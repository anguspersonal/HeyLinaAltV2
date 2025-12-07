import { useCallback, useEffect, useRef, useState } from 'react';

import {
    createBookmark,
    deleteBookmark,
    fetchBookmarks,
} from '@/features/history/services/historyApi';
import type { Bookmark } from '@/features/history/types';

export function useBookmarks({ accessToken }: { accessToken?: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkedMessageIds, setBookmarkedMessageIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadBookmarks = useCallback(async () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setError(null);
    setLoading(true);

    try {
      const response = await fetchBookmarks({
        limit: 100,
        offset: 0,
        accessToken,
        signal: controller.signal,
      });

      setBookmarks(response.bookmarks);
      setBookmarkedMessageIds(new Set(response.bookmarks.map((b) => b.messageId)));
    } catch (loadError) {
      if (controller.signal.aborted) {
        return;
      }
      const friendly =
        loadError instanceof Error ? loadError.message : 'Unable to load bookmarks.';
      setError(friendly);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [accessToken]);

  useEffect(() => {
    loadBookmarks();

    return () => {
      abortRef.current?.abort();
    };
  }, [loadBookmarks]);

  const addBookmark = useCallback(
    async (messageId: string, note?: string) => {
      try {
        // Optimistically add to set
        setBookmarkedMessageIds((prev) => new Set([...prev, messageId]));

        const bookmark = await createBookmark({
          messageId,
          note,
          accessToken,
        });

        // Update bookmarks list
        setBookmarks((prev) => [bookmark, ...prev]);

        return bookmark;
      } catch (bookmarkError) {
        // Revert on error
        setBookmarkedMessageIds((prev) => {
          const next = new Set(prev);
          next.delete(messageId);
          return next;
        });

        const friendly =
          bookmarkError instanceof Error ? bookmarkError.message : 'Unable to add bookmark.';
        setError(friendly);
        throw bookmarkError;
      }
    },
    [accessToken]
  );

  const removeBookmark = useCallback(
    async (bookmarkId: string) => {
      try {
        // Find the bookmark to get the messageId
        const bookmark = bookmarks.find((b) => b.id === bookmarkId);
        if (!bookmark) {
          return;
        }

        // Optimistically remove
        setBookmarkedMessageIds((prev) => {
          const next = new Set(prev);
          next.delete(bookmark.messageId);
          return next;
        });
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));

        await deleteBookmark({
          bookmarkId,
          accessToken,
        });
      } catch (unbookmarkError) {
        // Revert on error
        loadBookmarks();

        const friendly =
          unbookmarkError instanceof Error ? unbookmarkError.message : 'Unable to remove bookmark.';
        setError(friendly);
        throw unbookmarkError;
      }
    },
    [accessToken, bookmarks, loadBookmarks]
  );

  const toggleBookmark = useCallback(
    async (messageId: string) => {
      const existingBookmark = bookmarks.find((b) => b.messageId === messageId);

      if (existingBookmark) {
        await removeBookmark(existingBookmark.id);
      } else {
        await addBookmark(messageId);
      }
    },
    [bookmarks, addBookmark, removeBookmark]
  );

  const isBookmarked = useCallback(
    (messageId: string) => {
      return bookmarkedMessageIds.has(messageId);
    },
    [bookmarkedMessageIds]
  );

  return {
    bookmarks,
    bookmarkedMessageIds,
    loading,
    error,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    refresh: loadBookmarks,
  };
}
