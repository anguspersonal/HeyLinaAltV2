import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import type { Conversation } from '@/features/history/types';

type ConversationCardProps = {
  conversation: Conversation;
  onPress: (conversationId: string) => void;
  searchQuery?: string;
};

const formatDate = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return '';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } catch {
    return '';
  }
};

const highlightText = (text: string, query?: string) => {
  if (!query || !text) {
    return text;
  }

  // Simple case-insensitive highlighting
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text;
  }

  return text;
};

export function ConversationCard({ conversation, onPress, searchQuery }: ConversationCardProps) {
  const handlePress = () => {
    onPress(conversation.id);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {highlightText(conversation.title, searchQuery)}
          </ThemedText>
          <ThemedText style={styles.date}>{formatDate(conversation.lastMessageAt)}</ThemedText>
        </View>
        <ThemedText style={styles.preview} numberOfLines={2}>
          {highlightText(conversation.preview, searchQuery)}
        </ThemedText>
        <ThemedText style={styles.messageCount}>
          {conversation.messageCount} {conversation.messageCount === 1 ? 'message' : 'messages'}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.ui.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  pressed: {
    opacity: 0.7,
  },
  content: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    ...typography.heading.h3,
    color: colors.text.primary,
    flex: 1,
  },
  date: {
    ...typography.body.tiny,
    color: colors.text.tertiary,
  },
  preview: {
    ...typography.body.small,
    color: colors.text.secondary,
    lineHeight: typography.body.small.lineHeight * 1.4,
  },
  messageCount: {
    ...typography.body.tiny,
    color: colors.text.tertiary,
  },
});
