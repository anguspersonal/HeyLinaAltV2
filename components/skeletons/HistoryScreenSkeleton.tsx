/**
 * History Screen Skeleton Loader
 * Loading state for conversation history list
 */

import { colors, spacing } from '@/constants/theme';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton, SkeletonText } from './SkeletonLoader';

export function HistoryScreenSkeleton() {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.header}>
        <SkeletonText width={150} lineHeight={24} />
        <Skeleton width="100%" height={40} borderRadius={6} style={{ marginTop: spacing.md }} />
      </View>

      {/* Conversation List Skeleton */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {Array.from({ length: 8 }).map((_, index) => (
          <View key={index} style={styles.conversationCard}>
            <View style={styles.conversationHeader}>
              <SkeletonText width="60%" lineHeight={18} />
              <Skeleton width={80} height={12} />
            </View>
            <SkeletonText width="90%" lines={2} lineHeight={14} style={{ marginTop: spacing.sm }} />
            <View style={styles.conversationFooter}>
              <Skeleton width={60} height={12} />
              <Skeleton width={40} height={12} />
            </View>
          </View>
        ))}
      </ScrollView>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  listContent: {
    padding: spacing.lg,
  },
  conversationCard: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
});
