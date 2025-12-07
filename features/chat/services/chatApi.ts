import Constants from 'expo-constants';

import type { MessagesResponse, SendMessageResult } from '@/features/chat/types';
import { retryFetch } from '@/lib/retry';

const SUPABASE_URL =
  Constants.expoConfig?.extra?.supabase?.url ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

const resolveBaseUrl = () => {
  if (API_BASE_URL) {
    return API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  }
  if (SUPABASE_URL) {
    const normalized = SUPABASE_URL.endsWith('/') ? SUPABASE_URL.slice(0, -1) : SUPABASE_URL;
    return `${normalized}/functions/v1`;
  }
  throw new Error(
    'API base URL is not configured. Set EXPO_PUBLIC_API_BASE_URL or EXPO_PUBLIC_SUPABASE_URL.'
  );
};

const withBaseUrl = (path: string) => {
  const base = resolveBaseUrl();
  return `${base}${path}`;
};

const buildHeaders = (accessToken?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

const parseErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    if (typeof data?.message === 'string') {
      return data.message;
    }
    if (typeof data?.error === 'string') {
      return data.error;
    }
    if (typeof data?.error?.message === 'string') {
      return data.error.message;
    }
  } catch {
    // ignore JSON parse failures
  }
  return `${response.status} ${response.statusText}`.trim();
};

export async function fetchMessages({
  limit = 50,
  offset = 0,
  accessToken,
  signal,
}: {
  limit?: number;
  offset?: number;
  accessToken?: string;
  signal?: AbortSignal;
}): Promise<MessagesResponse> {
  const url = withBaseUrl(`/messages?limit=${limit}&offset=${offset}`);

  const response = await retryFetch(
    url,
    {
      method: 'GET',
      headers: buildHeaders(accessToken),
      signal,
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 15000,
    }
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const rawData = await response.json();


  // Handle Supabase Edge Function response format: { ok: true, data: { messages: [...] } }
  let data = rawData;
  if (rawData.ok && rawData.data) {
    data = rawData.data;

  }

  // Validate response structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format from server');
  }

  // Ensure messages array exists
  if (!Array.isArray(data.messages)) {
    console.warn('API returned non-array messages, returning empty array');
    return {
      messages: [],
      total: 0,
    };
  }

  return data as MessagesResponse;
}

export async function sendMessage({
  content,
  accessToken,
  idempotencyKey,
  signal,
}: {
  content: string;
  accessToken?: string;
  idempotencyKey?: string;
  signal?: AbortSignal;
}): Promise<SendMessageResult> {
  const response = await retryFetch(
    withBaseUrl('/messages'),
    {
      method: 'POST',
      headers: buildHeaders(accessToken),
      body: JSON.stringify({
        content,
        idempotencyKey,
      }),
      signal,
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      timeout: 30000, // 30 seconds for AI response
    }
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const rawData = await response.json();


  // Handle Supabase Edge Function response format: { ok: true, data: { userMessage: ..., aiResponse: ... } }
  let data = rawData;
  if (rawData.ok && rawData.data) {
    data = rawData.data;

  }

  return data as SendMessageResult;
}
