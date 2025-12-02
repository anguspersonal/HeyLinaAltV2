import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { fetchMessages } from '@/features/chat/services/chatApi';
import type { ChatMessage } from '@/features/chat/types';

const sortByCreatedAt = (messages: ChatMessage[]) =>
  [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

const hydrateMessages = (messages: ChatMessage[]) =>
  sortByCreatedAt(
    messages.map((message) => ({
      ...message,
      status: message.status ?? 'sent',
    }))
  );

const dedupeMessages = (messages: ChatMessage[]) => {
  const ordered = hydrateMessages(messages);
  const map = new Map<string, ChatMessage>();
  ordered.forEach((message) => {
    const key = message.id ?? message.localId ?? `${message.role}-${message.createdAt}`;
    map.set(key, message);
  });
  return Array.from(map.values());
};

export function useMessages({ accessToken, pageSize = 50 }: { accessToken?: string; pageSize?: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const setMessagesSafe = useCallback((updater: (current: ChatMessage[]) => ChatMessage[]) => {
    setMessages((current) => dedupeMessages(updater(current)));
  }, []);

  const loadMessages = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);

    try {
      const response = await fetchMessages({
        limit: pageSize,
        offset: 0,
        accessToken,
        signal: controller.signal,
      });
      setMessages(dedupeMessages(response.messages));
    } catch (loadError) {
      if (controller.signal.aborted) {
        return;
      }
      const friendly =
        loadError instanceof Error ? loadError.message : 'Unable to load your chat right now.';
      setError(friendly);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [accessToken, pageSize]);

  useEffect(() => {
    setLoading(true);
    setRefreshing(false);
    loadMessages();

    return () => {
      abortRef.current?.abort();
    };
  }, [loadMessages]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadMessages();
  }, [loadMessages]);

  const clearError = useCallback(() => setError(null), []);

  const state = useMemo(
    () => ({
      messages,
      loading,
      refreshing,
      error,
    }),
    [messages, loading, refreshing, error]
  );

  return {
    ...state,
    refresh,
    reload: loadMessages,
    setMessages: setMessagesSafe,
    clearError,
  };
}
