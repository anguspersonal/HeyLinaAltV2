import Constants from 'expo-constants';

import type { MessagesResponse, SendMessageResult } from '@/features/chat/types';

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiBaseUrl ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

const withBaseUrl = (path: string) => {
  if (!API_BASE_URL) {
    return path;
  }
  const normalizedBase = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${normalizedBase}${path}`;
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

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(accessToken),
    signal,
  });

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
  const response = await fetch(withBaseUrl('/messages'), {
    method: 'POST',
    headers: buildHeaders(accessToken),
    body: JSON.stringify({
      content,
      idempotencyKey,
    }),
    signal,
  });

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
