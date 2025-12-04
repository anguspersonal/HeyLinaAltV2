import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import type { Bookmark } from '@/features/history/types';

type BookmarkItemProps = {
  bookmark: Bookmark;
  onPress: (bookmarkId: string) => void;
  onUnbookmark: (bookmarkId: string) => void;
};

const formatDate = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};

export function BookmarkItem({ bookmark, onPress, onUnbookmark }: BookmarkItemProps) {
  const handlePress = () => {
    onPress(bookmark.id);
  };

  const handleUnbookmark = () => {
    onUnbookmark(bookmark.id);
  };

  const isUser = bookmark.message.role === 'user';

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.roleContainer}>
            <ThemedText style={styles.role}>
              {isUser ? 'You' : 'Lina'}
            </ThemedText>
          </View>
          <ThemedText style={styles.date}>{formatDate(bookmark.createdAt)}</ThemedText>
        </View>

        <ThemedText style={styles.messageContent} numberOfLines={4}>
          {bookmark.message.content}
        </ThemedText>

        {bookmark.note && (
          <View style={styles.noteContainer}>
            <ThemedText style={styles.noteLabel}>Note:</ThemedText>
            <ThemedText style={styles.noteText} numberOfLines={2}>
              {bookmark.note}
            </ThemedText>
          </View>
        )}

        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={handleUnbookmark}>
            <ThemedText style={styles.actionText}>Remove Bookmark</ThemedText>
          </Pressable>
        </View>
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
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleContainer: {
    backgroundColor: colors.accent.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  role: {
    ...typography.body.tiny,
    color: colors.background.primary,
    fontWeight: '600',
  },
  date: {
    ...typography.body.tiny,
    color: colors.text.tertiary,
  },
  messageContent: {
    ...typography.body.medium,
    color: colors.text.primary,
    lineHeight: typography.body.medium.lineHeight * 1.4,
  },
  noteContainer: {
    backgroundColor: colors.background.cardSecondary,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    gap: spacing.xs,
  },
  noteLabel: {
    ...typography.body.tiny,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  noteText: {
    ...typography.body.small,
    color: colors.text.secondary,
    lineHeight: typography.body.small.lineHeight * 1.4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  actionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  actionText: {
    ...typography.body.small,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
});
