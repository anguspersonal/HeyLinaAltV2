import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ChatInput } from '@/features/chat/components/ChatInput';
import { MessageBubble } from '@/features/chat/components/MessageBubble';
import { TypingIndicator } from '@/features/chat/components/TypingIndicator';
import { useMessages } from '@/features/chat/hooks/useMessages';
import { useSendMessage } from '@/features/chat/hooks/useSendMessage';
import type { ChatMessage, ChatMessageStatus } from '@/features/chat/types';
import { useAuth } from '@/stores/auth';

const keyboardOffset = Platform.select({
  ios: 88,
  android: 64,
  default: 0,
});

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

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

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
      return sendMessage({ content: text });
    },
    [clearError, sendMessage]
  );

  const handleRetry = useCallback(
    (message: ChatMessage) => {
      return sendMessage({ content: message.content, retryOfId: message.localId ?? message.id });
    },
    [sendMessage]
  );

  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: false }));
    }
  }, [loading, messages]);

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
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" color="#0A7EA4" />
          <ThemedText style={styles.loaderText}>Loading your chat...</ThemedText>
        </ThemedView>
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

  const renderItem = ({ item }: { item: ChatMessage }) => (
    <MessageBubble
      message={item}
      onRetry={item.status === 'failed' ? () => handleRetry(item) : undefined}
    />
  );

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
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id ?? item.localId ?? item.createdAt}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#0A7EA4" />
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

        <ChatInput
          onSend={handleSend}
          isSending={isSending}
          disabled={isAwaitingResponse}
          lastError={lastError}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1226',
  },
  container: {
    flex: 1,
    backgroundColor: '#0B1226',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#122443',
  },
  title: {
    color: '#E2E8F0',
  },
  subtitle: {
    color: '#8EA5C5',
    marginTop: 6,
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    flexGrow: 1,
  },
  footerSpacer: {
    height: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loaderText: {
    marginTop: 12,
  },
  errorTitle: {
    marginBottom: 8,
  },
  errorSubtitle: {
    textAlign: 'center',
    color: '#8EA5C5',
  },
  errorActions: {
    marginTop: 16,
  },
  retryLink: {
    color: '#0A7EA4',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    marginBottom: 8,
    color: '#E2E8F0',
  },
  emptyBody: {
    color: '#8EA5C5',
    textAlign: 'center',
  },
});
