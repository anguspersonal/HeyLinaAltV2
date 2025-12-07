import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import type { ChatMessage } from '@/features/chat/types';

type MessageBubbleProps = {
  message: ChatMessage;
  onRetry?: () => void;
  onBookmark?: (messageId: string) => void;
  isBookmarked?: boolean;
};

const formatTime = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return '--:--';
    }
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  } catch {
    return '--:--';
  }
};

export const MessageBubble = memo(function MessageBubble({ message, onRetry, onBookmark, isBookmarked = false }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const isUser = message.role === 'user';
  const isLina = message.role === 'assistant';
  const status = message.status ?? 'sent';

  const containerStyle = [
    styles.container,
    isUser ? styles.userContainer : styles.assistantContainer,
  ];
  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.assistantBubble,
    status === 'failed' ? styles.failedBubble : null,
  ];

  const statusText = status === 'pending' ? 'Sending...' : status === 'failed' ? 'Failed' : undefined;

  const handleBookmark = () => {
    if (onBookmark && message.id) {
      onBookmark(message.id);
      setShowActions(false); // Close actions after bookmarking
    }
  };

  const handleLongPress = () => {
    if (isLina && onBookmark) {
      setShowActions(!showActions);
    }
  };

  // Create accessibility label
  const accessibilityLabel = createMessageAccessibilityLabel(
    message.role,
    message.content,
    message.createdAt,
    status
  );

  const accessibilityHint = isLina && onBookmark 
    ? 'Long press to bookmark this message' 
    : undefined;

  return (
    <View style={containerStyle}>
        <Pressable 
          style={bubbleStyle}
          onLongPress={handleLongPress}
          delayLongPress={300}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityState={{
            disabled: status === 'pending',
          }}
        >
          <ThemedText 
            style={[styles.content, isUser && styles.userContent]}
            accessible={false}
          >
            {message.content}
          </ThemedText>
          <View style={styles.metaRow} accessible={false}>
            <ThemedText style={styles.time} accessible={false}>
              {formatTime(message.createdAt)}
            </ThemedText>
            {statusText ? (
              <View style={styles.statusPill} accessible={false}>
                <ThemedText style={styles.statusText} accessible={false}>{statusText}</ThemedText>
              </View>
            ) : null}
            {status === 'failed' && onRetry ? (
              <Pressable 
                onPress={onRetry}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Retry sending message"
                accessibilityHint="Double tap to resend this message"
              >
                <ThemedText style={styles.retry}>Retry</ThemedText>
              </Pressable>
            ) : null}
          </View>
          {showActions && isLina && onBookmark && (
            <View style={styles.actions} accessible={false}>
              <Pressable 
                style={styles.actionButton} 
                onPress={handleBookmark}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark message'}
                accessibilityHint={isBookmarked ? 'Double tap to remove bookmark' : 'Double tap to bookmark this message'}
              >
                <ThemedText style={styles.actionText}>
                  {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                </ThemedText>
              </Pressable>
            </View>
          )}
        </Pressable>
      </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    maxWidth: '80%',
    shadowColor: colors.ui.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  userBubble: {
    // Golden gradient background (using warmGold as base)
    backgroundColor: colors.accent.warmGold,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: colors.background.cardSecondary,
    borderBottomLeftRadius: 4,
  },
  failedBubble: {
    borderWidth: 1,
    borderColor: '#C72C41',
    opacity: 0.7,
  },
  content: {
    color: colors.text.primary,
    ...typography.body.medium,
    lineHeight: typography.body.medium.lineHeight * 1.4,
  },
  userContent: {
    color: colors.background.primary, // Dark text on golden background
  },
  metaRow: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  time: {
    ...typography.body.tiny,
    color: colors.text.tertiary,
  },
  statusPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: colors.text.primary,
    ...typography.body.tiny,
  },
  retry: {
    ...typography.body.tiny,
    color: colors.accent.yellow,
    fontWeight: '600',
  },
  actions: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  actionButton: {
    paddingVertical: spacing.xs,
  },
  actionText: {
    ...typography.body.small,
    color: colors.accent.gold,
  },
});
