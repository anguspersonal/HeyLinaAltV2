import { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    TextInput,
    View
} from 'react-native';

import { HistoryScreenSkeleton } from '@/components/skeletons/HistoryScreenSkeleton';
import { ThemedText } from '@/components/themed-text';
import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { ConversationCard } from '@/features/history/components/ConversationCard';
import { fetchConversations } from '@/features/history/services/historyApi';
import type { Conversation } from '@/features/history/types';

type HistoryListScreenProps = {
  accessToken?: string;
  onConversationPress: (conversationId: string) => void;
};

export function HistoryListScreen({ accessToken, onConversationPress }: HistoryListScreenProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const loadConversations = useCallback(
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
        const response = await fetchConversations({
          limit: 50,
          offset: 0,
          searchQuery: searchQuery || undefined,
          accessToken,
          signal: controller.signal,
        });

        // Sort by recency (most recent first)
        const sorted = [...response.conversations].sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );

        setConversations(sorted);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }
        const friendly =
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load conversation history right now.';
        setError(friendly);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [accessToken, searchQuery]
  );

  useEffect(() => {
    loadConversations();

    return () => {
      abortRef.current?.abort();
    };
  }, [loadConversations]);

  const handleRefresh = useCallback(() => {
    loadConversations(true);
  }, [loadConversations]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Conversation }) => (
      <ConversationCard
        conversation={item}
        onPress={onConversationPress}
        searchQuery={searchQuery}
      />
    ),
    [onConversationPress, searchQuery]
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

    if (searchQuery) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No conversations found</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Try a different search term
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>No conversations yet</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Start chatting with Lina to see your history here
        </ThemedText>
      </View>
    );
  }, [loading, error, searchQuery]);

  const keyExtractor = useCallback((item: Conversation) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={colors.text.placeholder}
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
        />
      </View>

      {loading && !refreshing ? (
        <HistoryScreenSkeleton />
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={Platform.OS === 'android'}
          updateCellsBatchingPeriod={50}
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
  searchContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body.medium,
    color: colors.text.primary,
    shadowColor: colors.ui.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
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
