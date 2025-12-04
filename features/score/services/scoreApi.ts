import type {
    EmotionalHealthScore,
    ScoreHistory,
    ScoreInsight,
} from '@/features/score/types';
import Constants from 'expo-constants';

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

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

/**
 * Get the current Emotional Health Score for the authenticated user
 */
export async function getCurrentScore(
  accessToken: string,
  signal?: AbortSignal
): Promise<EmotionalHealthScore> {
  return retryWithBackoff(async () => {
    const url = withBaseUrl('/score');

    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(accessToken),
      signal,
    });

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    const rawData = await response.json();

    // Handle Supabase Edge Function response format: { ok: true, data: { ... } }
    let data = rawData;
    if (rawData.ok && rawData.data) {
      data = rawData.data;
    }

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from server');
    }

    if (typeof data.overall !== 'number' || !data.components || !data.interpretation) {
      throw new Error('Invalid score data structure');
    }

    return data as EmotionalHealthScore;
  });
}

/**
 * Get the score history for the authenticated user
 */
export async function getScoreHistory({
  startDate,
  endDate,
  accessToken,
  signal,
}: {
  startDate?: string;
  endDate?: string;
  accessToken: string;
  signal?: AbortSignal;
}): Promise<ScoreHistory> {
  return retryWithBackoff(async () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const queryString = params.toString();
    const url = withBaseUrl(`/score/history${queryString ? `?${queryString}` : ''}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(accessToken),
      signal,
    });

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

    if (!Array.isArray(data.dataPoints)) {
      console.warn('API returned non-array dataPoints, returning empty history');
      return {
        dataPoints: [],
        trend: 'stable',
      };
    }

    return data as ScoreHistory;
  });
}

/**
 * Get score insights for the authenticated user
 */
export async function getScoreInsights(
  accessToken: string,
  signal?: AbortSignal
): Promise<ScoreInsight[]> {
  return retryWithBackoff(async () => {
    const url = withBaseUrl('/score/insights');

    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(accessToken),
      signal,
    });

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

    // Handle both array response and object with insights property
    const insights = Array.isArray(data) ? data : data.insights;

    if (!Array.isArray(insights)) {
      console.warn('API returned non-array insights, returning empty array');
      return [];
    }

    return insights as ScoreInsight[];
  });
}
