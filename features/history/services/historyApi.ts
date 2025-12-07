import Constants from 'expo-constants';

import type {
    Bookmark,
    BookmarksResponse,
    ConversationDetail,
    ConversationsResponse
} from '@/features/history/types';

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

export async function fetchConversations({
  limit = 50,
  offset = 0,
  searchQuery,
  accessToken,
  signal,
}: {
  limit?: number;
  offset?: number;
  searchQuery?: string;
  accessToken?: string;
  signal?: AbortSignal;
}): Promise<ConversationsResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (searchQuery) {
    params.append('search', searchQuery);
  }

  const url = withBaseUrl(`/conversations?${params.toString()}`);

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
      timeout: 10000,
    }
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const rawData = await response.json();

  // Handle Supabase Edge Function response format
  let data = rawData;
  if (rawData.ok && rawData.data) {
    data = rawData.data;
  }

  // Validate response structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format from server');
  }

  // Ensure conversations array exists
  if (!Array.isArray(data.conversations)) {
    console.warn('API returned non-array conversations, returning empty array');
    return {
      conversations: [],
      total: 0,
    };
  }

  return data as ConversationsResponse;
}

export async function fetchConversationDetail({
  conversationId,
  accessToken,
  signal,
}: {
  conversationId: string;
  accessToken?: string;
  signal?: AbortSignal;
}): Promise<ConversationDetail> {
  const url = withBaseUrl(`/conversations/${conversationId}`);

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
      timeout: 10000,
    }
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const rawData = await response.json();

  // Handle Supabase Edge Function response format
  let data = rawData;
  if (rawData.ok && rawData.data) {
    data = rawData.data;
  }

  return data as ConversationDetail;
}

export async function fetchBookmarks({
  limit = 50,
  offset = 0,
  accessToken,
  signal,
}: {
  limit?: number;
  offset?: number;
  accessToken?: string;
  signal?: AbortSignal;
}): Promise<BookmarksResponse> {
  const url = withBaseUrl(`/bookmarks?limit=${limit}&offset=${offset}`);

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
      timeout: 10000,
    }
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const rawData = await response.json();

  // Handle Supabase Edge Function response format
  let data = rawData;
  if (rawData.ok && rawData.data) {
    data = rawData.data;
  }

  // Validate response structure
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response format from server');
  }

  // Ensure bookmarks array exists
  if (!Array.isArray(data.bookmarks)) {
    console.warn('API returned non-array bookmarks, returning empty array');
    return {
      bookmarks: [],
      total: 0,
    };
  }

  return data as BookmarksResponse;
}

export async function createBookmark({
  messageId,
  note,
  accessToken,
  signal,
}: {
  messageId: string;
  note?: string;
  accessToken?: string;
  signal?: AbortSignal;
}): Promise<Bookmark> {
  const url = withBaseUrl('/bookmarks');

  const response = await retryFetch(
    url,
    {
      method: 'POST',
      headers: buildHeaders(accessToken),
      body: JSON.stringify({
        messageId,
        note,
      }),
      signal,
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 10000,
    }
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const rawData = await response.json();

  // Handle Supabase Edge Function response format
  let data = rawData;
  if (rawData.ok && rawData.data) {
    data = rawData.data;
  }

  return data as Bookmark;
}

export async function deleteBookmark({
  bookmarkId,
  accessToken,
  signal,
}: {
  bookmarkId: string;
  accessToken?: string;
  signal?: AbortSignal;
}): Promise<void> {
  const url = withBaseUrl(`/bookmarks/${bookmarkId}`);

  const response = await retryFetch(
    url,
    {
      method: 'DELETE',
      headers: buildHeaders(accessToken),
      signal,
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 10000,
    }
  );

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
}
