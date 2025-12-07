/**
 * Dashboard/Home Screen Skeleton Loader
 * Loading state for the main dashboard
 */

import { colors, layout, spacing } from '@/constants/theme';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    Skeleton,
    SkeletonCircle,
    SkeletonInsightCard,
    SkeletonScoreBar,
    SkeletonText,
} from './SkeletonLoader';

export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Skeleton */}
        <View style={styles.header}>
          <SkeletonText width={120} lineHeight={14} style={{ alignSelf: 'center' }} />
          <SkeletonText width={200} lineHeight={56} style={{ alignSelf: 'center', marginTop: spacing.sm }} />
        </View>

        {/* EHS Score Card Skeleton */}
        <View style={styles.scoreCard}>
          <SkeletonCircle size={layout.scoreCircle} style={{ alignSelf: 'center', marginBottom: spacing.xl }} />
          <SkeletonText width="80%" lines={2} lineHeight={16} style={{ alignSelf: 'center' }} />
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <SkeletonCircle size={64} />
            <SkeletonCircle size={64} />
            <SkeletonCircle size={64} />
            <SkeletonCircle size={64} />
          </View>
        </View>

        {/* Daily Quote Card Skeleton */}
        <View style={styles.quoteCard}>
          <SkeletonText width="90%" lines={3} lineHeight={20} />
          <View style={styles.quoteActions}>
            <Skeleton width={32} height={32} borderRadius={16} />
            <View style={styles.paginationDots}>
              <Skeleton width={8} height={8} borderRadius={4} />
              <Skeleton width={8} height={8} borderRadius={4} />
              <Skeleton width={8} height={8} borderRadius={4} />
            </View>
          </View>
        </View>

        {/* Score Breakdown Skeleton */}
        <View style={styles.section}>
          <SkeletonText width={150} lineHeight={20} style={{ marginBottom: spacing.lg }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scoreBreakdown}>
            <SkeletonScoreBar />
            <SkeletonScoreBar />
            <SkeletonScoreBar />
            <SkeletonScoreBar />
            <SkeletonScoreBar />
          </ScrollView>
        </View>

        {/* Clarity Hits Skeleton */}
        <View style={styles.section}>
          <SkeletonText width={120} lineHeight={20} style={{ marginBottom: spacing.lg }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.clarityHits}>
            <SkeletonInsightCard />
            <SkeletonInsightCard />
            <SkeletonInsightCard />
          </ScrollView>
        </View>

        {/* Bottom Input Preview Skeleton */}
        <View style={styles.bottomInput}>
          <Skeleton width="100%" height={52} borderRadius={6} />
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
    alignItems: 'center',
  },
  scoreCard: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.xxl,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  quoteCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
  },
  quoteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  paginationDots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  section: {
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  scoreBreakdown: {
    paddingRight: spacing.lg,
  },
  clarityHits: {
    paddingRight: spacing.lg,
  },
  bottomInput: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
});
