/**
 * Score Detail Screen Skeleton Loader
 * Loading state for the score detail view
 */

import { colors, layout, spacing } from '@/constants/theme';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Skeleton, SkeletonCircle, SkeletonText } from './SkeletonLoader';

export function ScoreDetailSkeleton() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <Skeleton width={80} height={16} style={{ marginBottom: spacing.md }} />
          <SkeletonText width={200} lineHeight={24} />
        </View>

        {/* Large Score Circle Skeleton */}
        <View style={styles.scoreSection}>
          <SkeletonCircle size={layout.scoreCircle} style={{ marginBottom: spacing.xl }} />
          <SkeletonText width="80%" lines={2} lineHeight={16} style={{ marginBottom: spacing.sm }} />
          <Skeleton width={150} height={12} />
        </View>

        {/* Component Breakdown Skeleton */}
        <View style={styles.section}>
          <SkeletonText width={180} lineHeight={20} style={{ marginBottom: spacing.lg }} />
          <View style={styles.componentGrid}>
            {Array.from({ length: 5 }).map((_, index) => (
              <View key={index} style={styles.componentCard}>
                <Skeleton width={4} height={40} style={{ marginRight: spacing.md }} />
                <View style={{ flex: 1 }}>
                  <SkeletonText width="70%" lineHeight={16} />
                </View>
                <Skeleton width={40} height={20} />
              </View>
            ))}
          </View>
        </View>

        {/* Score Graph Skeleton */}
        <View style={styles.section}>
          <SkeletonText width={120} lineHeight={20} style={{ marginBottom: spacing.lg }} />
          <Skeleton width="100%" height={200} borderRadius={6} />
        </View>

        {/* Insights Skeleton */}
        <View style={styles.section}>
          <SkeletonText width={180} lineHeight={20} style={{ marginBottom: spacing.lg }} />
          {Array.from({ length: 3 }).map((_, index) => (
            <View key={index} style={styles.insightCard}>
              <SkeletonText width="90%" lines={3} lineHeight={16} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  scoreSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  componentGrid: {
    gap: spacing.md,
  },
  componentCard: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightCard: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
});
