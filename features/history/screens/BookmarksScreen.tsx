import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/constants/theme';
import { BookmarkItem } from '@/features/history/components/BookmarkItem';
import { deleteBookmark, fetchBookmarks } from '@/features/history/services/historyApi';
import type { Bookmark } from '@/features/history/types';

type BookmarksScreenProps = {
  accessToken?: string;
  onBookmarkPress: (bookmarkId: string) => void;
};

export function BookmarksScreen({ accessToken, onBookmarkPress }: BookmarksScreenProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadBookmarks = useCallback(
    async (isRefresh = false) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;
      setError(null);

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const response = await fetchBookmarks({
          limit: 50,
          offset: 0,
          accessToken,
          signal: controller.signal,
        });

        // Sort by creation date (most recent first)
        const sorted = [...response.bookmarks].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setBookmarks(sorted);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }
        const friendly =
          loadError instanceof Error ? loadError.message : 'Unable to load bookmarks right now.';
        setError(friendly);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [accessToken]
  );

  useEffect(() => {
    loadBookmarks();

    return () => {
      abortRef.current?.abort();
    };
  }, [loadBookmarks]);

  const handleRefresh = useCallback(() => {
    loadBookmarks(true);
  }, [loadBookmarks]);

  const handleUnbookmark = useCallback(
    async (bookmarkId: string) => {
      try {
        // Optimistically remove from UI
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));

        await deleteBookmark({
          bookmarkId,
          accessToken,
        });
      } catch (unbookmarkError) {
        // Revert on error
        loadBookmarks();
        const friendly =
          unbookmarkError instanceof Error
            ? unbookmarkError.message
            : 'Unable to remove bookmark.';
        setError(friendly);
      }
    },
    [accessToken, loadBookmarks]
  );

  const renderItem = useCallback(
    ({ item }: { item: Bookmark }) => (
      <BookmarkItem bookmark={item} onPress={onBookmarkPress} onUnbookmark={handleUnbookmark} />
    ),
    [onBookmarkPress, handleUnbookmark]
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>{error}</ThemedText>
          <ThemedText style={styles.emptySubtext}>Pull down to try again</ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No bookmarks yet</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Long press on Lina's messages to bookmark insights
        </ThemedText>
      </View>
    );
  }, [loading, error]);

  const keyExtractor = useCallback((item: Bookmark) => item.id, []);

  return (
    <View style={styles.container}>
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.gold} />
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent.gold}
              colors={[colors.accent.gold]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  listContent: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.heading.h2,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  emptySubtext: {
    ...typography.body.medium,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
