import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    StyleSheet,
    View
} from 'react-native';

import { ChatScreenSkeleton } from '@/components/skeletons/ChatScreenSkeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors, spacing, typography } from '@/constants/theme';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { QuickActions, type QuickAction } from '@/features/chat/components/QuickActions';
import { SafetyWarning } from '@/features/chat/components/SafetyWarning';
import { TypingIndicator } from '@/features/chat/components/TypingIndicator';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import type { ChatMessage, ChatMessageStatus } from '@/features/chat/types';
import { useBookmarks } from '@/features/history/hooks/useBookmarks';
import { useAuth } from '@/stores/auth';

const keyboardOffset = Platform.select({
  ios: 88,
  android: 64,
  default: 0,
});

// Helper to format date for separators
const formatDateSeparator = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Recent';
    }
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset time parts for comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      // Format as "Monday, January 15, 2025"
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  } catch {
    return 'Recent';
  }
};

// Helper to check if two dates are on different days
const isDifferentDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getDate() !== d2.getDate() || 
         d1.getMonth() !== d2.getMonth() || 
         d1.getFullYear() !== d2.getFullYear();
};

// Type for list items (messages, date separators, or safety warnings)
type ListItem = 
  | { type: 'message'; data: ChatMessage }
  | { type: 'date'; data: string }
  | { type: 'safety-warning'; data: { flag: 'high-risk' | 'crisis' | 'self-harm' | 'abuse'; messageId: string } };

export default function ChatScreen() {
  let session, user;
  let authError: unknown;

  try {
    const auth = useAuth();
    session = auth.session;
    user = auth.user;
  } catch (error) {
    authError = error;
  }

  const flatListRef = useRef<FlatList<ListItem>>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const {
    messages,
    loading,
    refreshing,
    error,
    refresh,
    reload,
    setMessages,
    clearError,
  } = useMessages({ accessToken: authError ? undefined : session?.access_token });

  const { bookmarkedMessageIds, toggleBookmark } = useBookmarks({
    accessToken: authError ? undefined : session?.access_token,
  });



  const handleQueued = useCallback(
    (message: ChatMessage, retryOfId?: string) => {
      setMessages((current) => {
        if (retryOfId) {
          return current.map((existing) =>
            existing.id === retryOfId || existing.localId === retryOfId
              ? { ...message, localId: retryOfId, id: retryOfId }
              : existing
          );
        }
        return [...current, message];
      });
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    },
    [setMessages]
  );

  const handleSuccess = useCallback(
    (optimisticMessage: ChatMessage, result: { userMessage: ChatMessage; aiResponse: ChatMessage }) => {
      setMessages((current) => {
        const withUserMessage = current.map((message) =>
          message.localId === optimisticMessage.localId
            ? { ...result.userMessage, status: 'sent' as ChatMessageStatus }
            : message
        );

        const aiMessage: ChatMessage = { ...result.aiResponse, status: 'sent' as ChatMessageStatus };
        const alreadyPresent = withUserMessage.find(
          (message) => message.id === aiMessage.id || message.localId === aiMessage.localId
        );

        if (alreadyPresent) {
          return withUserMessage.map((message) =>
            message.id === aiMessage.id || message.localId === aiMessage.localId ? aiMessage : message
          );
        }

        return [...withUserMessage, aiMessage];
      });
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    },
    [setMessages]
  );

  const handleFailure = useCallback(
    (optimisticMessage: ChatMessage) => {
      setMessages((current) =>
        current.map((message) =>
          message.localId === optimisticMessage.localId ? { ...message, status: 'failed' as ChatMessageStatus } : message
        )
      );
    },
    [setMessages]
  );

  const { sendMessage, isSending, isAwaitingResponse, lastError } = useSendMessage({
    accessToken: session?.access_token,
    userId: user?.id,
    onQueued: handleQueued,
    onSuccess: handleSuccess,
    onFailure: handleFailure,
  });

  const handleSend = useCallback(
    (text: string) => {
      clearError();
      setInputValue('');
      return sendMessage({ content: text });
    },
    [clearError, sendMessage]
  );

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      handleSend(action.prompt);
    },
    [handleSend]
  );

  const handleRetry = useCallback(
    (message: ChatMessage) => {
      return sendMessage({ content: message.content, retryOfId: message.localId ?? message.id });
    },
    [sendMessage]
  );

  const handlePauseConversation = useCallback(() => {
    // User can simply stop typing - this is more of a UI acknowledgment
    setInputFocused(false);
  }, []);

  const handleExitConversation = useCallback(() => {
    // Navigate back or to home
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  }, []);

  // Create list items with date separators and safety warnings
  const listItems = useMemo((): ListItem[] => {
    const items: ListItem[] = [];
    
    messages.forEach((message, index) => {
      // Add date separator if this is the first message or if the date changed
      if (index === 0 || isDifferentDay(messages[index - 1].createdAt, message.createdAt)) {
        items.push({ type: 'date', data: message.createdAt });
      }
      items.push({ type: 'message', data: message });
      
      // Add safety warning if message has a safety flag
      if (message.safetyFlag) {
        items.push({ 
          type: 'safety-warning', 
          data: { flag: message.safetyFlag, messageId: message.id } 
        });
      }
    });
    
    return items;
  }, [messages]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: false }));
    }
  }, [loading, messages.length]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messages.length]);

  const listFooter = useMemo(() => {
    if (isAwaitingResponse) {
      return <TypingIndicator />;
    }
    return <View style={styles.footerSpacer} />;
  }, [isAwaitingResponse]);

  if (authError) {
    console.error('Auth error in ChatScreen:', authError);
    return (
      <View style={styles.safeArea}>
        <ThemedView style={styles.centered}>
          <ThemedText type="title" style={styles.errorTitle}>
            Authentication Error
          </ThemedText>
          <ThemedText style={styles.errorSubtitle}>
            {authError instanceof Error ? authError.message : 'Unable to access authentication'}
          </ThemedText>
        </ThemedView>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.safeArea}>
        <ChatScreenSkeleton />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.safeArea}>
        <ThemedView style={styles.centered}>
          <ThemedText type="title" style={styles.errorTitle}>
            Could not load chat
          </ThemedText>
          <ThemedText style={styles.errorSubtitle}>{error}</ThemedText>
          <View style={styles.errorActions}>
            <ThemedText type="link" onPress={reload} style={styles.retryLink}>
              Retry
            </ThemedText>
          </View>
        </ThemedView>
      </View>
    );
  }

  const handleBookmark = useCallback(
    async (messageId: string) => {
      try {
        await toggleBookmark(messageId);
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
      }
    },
    [toggleBookmark]
  );

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <ThemedText style={styles.dateSeparatorText}>
            {formatDateSeparator(item.data)}
          </ThemedText>
        </View>
      );
    }
    
    if (item.type === 'safety-warning') {
      return (
        <SafetyWarning
          type={item.data.flag}
          onPauseConversation={handlePauseConversation}
          onExitConversation={handleExitConversation}
        />
      );
    }
    
    return (
      <MessageBubble
        message={item.data}
        onRetry={item.data.status === 'failed' ? () => handleRetry(item.data) : undefined}
        onBookmark={handleBookmark}
        isBookmarked={bookmarkedMessageIds.has(item.data.id)}
      />
    );
  };

  const getItemKey = (item: ListItem, index: number) => {
    if (item.type === 'date') {
      return `date-${item.data}-${index}`;
    }
    if (item.type === 'safety-warning') {
      return `safety-${item.data.messageId}-${item.data.flag}`;
    }
    return item.data.id ?? item.data.localId ?? `${item.data.createdAt}-${index}`;
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset ?? 0}
        style={styles.flex}
      >
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Chat with Lina
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Get clarity on dating and relationships in a private space.
            </ThemedText>
            <View style={styles.disclaimer}>
              <ThemedText style={styles.disclaimerText}>
                💭 Lina is an AI companion, not a therapist or crisis service
              </ThemedText>
            </View>
          </View>

          <FlatList
            ref={flatListRef}
            data={listItems}
            renderItem={renderItem}
            keyExtractor={getItemKey}
            contentContainerStyle={styles.listContent}
            initialNumToRender={15}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={Platform.OS === 'android'}
            updateCellsBatchingPeriod={50}
            getItemLayout={undefined}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={refresh} 
                tintColor={colors.accent.gold}
                colors={[colors.accent.gold]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <ThemedText type="subtitle" style={styles.emptyTitle}>
                  Start your first chat
                </ThemedText>
                <ThemedText style={styles.emptyBody}>
                  Ask Lina about boundaries, mixed signals, or anything you are unsure about.
                </ThemedText>
              </View>
            }
            ListFooterComponent={listFooter}
          />
        </ThemedView>

        <QuickActions
          onSelect={handleQuickAction}
          visible={!inputFocused && !isSending && inputValue.trim().length === 0}
        />

        <ChatInput
          onSend={handleSend}
          isSending={isSending}
          disabled={isAwaitingResponse}
          lastError={lastError}
          onFocusChange={setInputFocused}
          onValueChange={setInputValue}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  title: {
    color: colors.text.primary,
    ...typography.heading.h1,
  },
  subtitle: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
    ...typography.body.small,
  },
  disclaimer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  disclaimerText: {
    color: colors.text.tertiary,
    ...typography.body.tiny,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    flexGrow: 1,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dateSeparatorText: {
    color: colors.text.tertiary,
    ...typography.body.tiny,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerSpacer: {
    height: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loaderText: {
    marginTop: spacing.md,
    color: colors.text.secondary,
  },
  errorTitle: {
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  errorSubtitle: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
  errorActions: {
    marginTop: spacing.lg,
  },
  retryLink: {
    color: colors.accent.gold,
  },
  emptyState: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  emptyBody: {
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
