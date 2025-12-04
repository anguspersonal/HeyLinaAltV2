import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/constants/theme';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import type { Message } from '@/features/chat/types';
import { fetchConversationDetail } from '@/features/history/services/historyApi';
import type { Conversation } from '@/features/history/types';

type ConversationDetailScreenProps = {
  conversationId: string;
  accessToken?: string;
  onBack: () => void;
  onBookmark?: (messageId: string) => void;
  bookmarkedMessageIds?: Set<string>;
};

export function ConversationDetailScreen({
  conversationId,
  accessToken,
  onBack,
  onBookmark,
  bookmarkedMessageIds = new Set(),
}: ConversationDetailScreenProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadConversation = useCallback(
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
        const response = await fetchConversationDetail({
          conversationId,
          accessToken,
          signal: controller.signal,
        });

        setConversation(response.conversation);
        setMessages(response.messages);
      } catch (loadError) {
        if (controller.signal.aborted) {
          return;
        }
        const friendly =
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load conversation details right now.';
        setError(friendly);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [conversationId, accessToken]
  );

  useEffect(() => {
    loadConversation();

    return () => {
      abortRef.current?.abort();
    };
  }, [loadConversation]);

  const handleRefresh = useCallback(() => {
    loadConversation(true);
  }, [loadConversation]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble
        message={item}
        onBookmark={onBookmark}
        isBookmarked={bookmarkedMessageIds.has(item.id)}
      />
    ),
    [onBookmark, bookmarkedMessageIds]
  );

  const renderHeader = useCallback(() => {
    if (!conversation) {
      return null;
    }

    return (
      <View style={styles.header}>
        <ThemedText style={styles.title}>{conversation.title}</ThemedText>
        <ThemedText style={styles.subtitle}>
          {conversation.messageCount} {conversation.messageCount === 1 ? 'message' : 'messages'}
        </ThemedText>
      </View>
    );
  }, [conversation]);

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
        <ThemedText style={styles.emptyText}>No messages in this conversation</ThemedText>
      </View>
    );
  }, [loading, error]);

  const keyExtractor = useCallback((item: Message) => item.id, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <View style={styles.backButtonContainer}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </Pressable>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.gold} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <ThemedText style={styles.backButtonText}>← Back</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backButtonContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    ...typography.body.medium,
    color: colors.accent.gold,
    fontWeight: '500',
  },
  header: {
    padding: spacing.lg,
    paddingTop: 0,
    gap: spacing.xs,
  },
  title: {
    ...typography.heading.h1,
    color: colors.text.primary,
  },
  subtitle: {
    ...typography.body.small,
    color: colors.text.tertiary,
  },
  listContent: {
    paddingBottom: spacing.xl,
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
