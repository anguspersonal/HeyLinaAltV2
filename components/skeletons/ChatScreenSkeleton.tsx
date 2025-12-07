/**
 * Chat Screen Skeleton Loader
 * Loading state for the chat interface
 */

import { colors, spacing } from '@/constants/theme';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton, SkeletonMessageBubble, SkeletonText } from './SkeletonLoader';

export function ChatScreenSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonText width="60%" lineHeight={24} />
        <SkeletonText width="80%" lineHeight={14} style={{ marginTop: spacing.xs }} />
        <View style={styles.disclaimer}>
          <SkeletonText width="100%" lineHeight={12} />
        </View>
      </View>

      {/* Messages Skeleton */}
      <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {/* Date Separator */}
        <View style={styles.dateSeparator}>
          <Skeleton width={100} height={12} />
        </View>

        {/* Message Bubbles */}
        <SkeletonMessageBubble isUser={false} />
        <SkeletonMessageBubble isUser={true} />
        <SkeletonMessageBubble isUser={false} />
        <SkeletonMessageBubble isUser={true} />
        <SkeletonMessageBubble isUser={false} />
      </ScrollView>

      {/* Input Skeleton */}
      <View style={styles.inputContainer}>
        <Skeleton width="100%" height={52} borderRadius={6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  disclaimer: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  inputContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
});
