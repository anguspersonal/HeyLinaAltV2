import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    getCurrentScore,
    getScoreHistory,
    getScoreInsights,
} from '@/features/score/services/scoreApi';
import type {
    EmotionalHealthScore,
    ScoreHistory,
    ScoreInsight,
} from '@/features/score/types';

interface UseScoreOptions {
  accessToken?: string;
  autoFetch?: boolean;
}

export function useScore({ accessToken, autoFetch = true }: UseScoreOptions = {}) {
  const [score, setScore] = useState<EmotionalHealthScore | null>(null);
  const [history, setHistory] = useState<ScoreHistory | null>(null);
  const [insights, setInsights] = useState<ScoreInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cache to avoid unnecessary refetches
  const cacheRef = useRef<{
    score: EmotionalHealthScore | null;
    history: ScoreHistory | null;
    insights: ScoreInsight[];
    timestamp: number;
  }>({
    score: null,
    history: null,
    insights: [],
    timestamp: 0,
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const isCacheValid = useCallback(() => {
    const now = Date.now();
    return now - cacheRef.current.timestamp < CACHE_DURATION;
  }, []);

  const loadScore = useCallback(
    async (forceRefresh = false) => {
      if (!accessToken) {
        setError('Authentication required to load score');
        return;
      }

      // Use cache if valid and not forcing refresh
      if (!forceRefresh && isCacheValid() && cacheRef.current.score) {
        setScore(cacheRef.current.score);
        setHistory(cacheRef.current.history);
        setInsights(cacheRef.current.insights);
        return;
      }

      // Abort any pending requests
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all score data in parallel
        const [scoreData, historyData, insightsData] = await Promise.all([
          getCurrentScore(accessToken, controller.signal),
          getScoreHistory({ accessToken, signal: controller.signal }),
          getScoreInsights(accessToken, controller.signal),
        ]);

        if (!controller.signal.aborted) {
          setScore(scoreData);
          setHistory(historyData);
          setInsights(insightsData);

          // Update cache
          cacheRef.current = {
            score: scoreData,
            history: historyData,
            insights: insightsData,
            timestamp: Date.now(),
          };
        }
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }

        const friendly =
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load your emotional health score right now.';
        setError(friendly);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [accessToken, isCacheValid]
  );

  const refresh = useCallback(async () => {
    await loadScore(true);
  }, [loadScore]);

  const clearError = useCallback(() => setError(null), []);

  // Auto-fetch on mount if enabled and accessToken is available
  useEffect(() => {
    if (autoFetch && accessToken) {
      loadScore();
    }

    return () => {
      abortRef.current?.abort();
    };
  }, [autoFetch, accessToken, loadScore]);

  const state = useMemo(
    () => ({
      score,
      history,
      insights,
      isLoading,
      error,
    }),
    [score, history, insights, isLoading, error]
  );

  return {
    ...state,
    refresh,
    clearError,
  };
}
