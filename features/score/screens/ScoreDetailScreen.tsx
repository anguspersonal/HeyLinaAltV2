import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors, layout, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, {
    Circle,
    Defs,
    Stop,
    RadialGradient as SvgRadialGradient,
} from 'react-native-svg';
import { InsightCard } from '../components/InsightCard';
import { ScoreGraph } from '../components/ScoreGraph';
import { useScore } from '../hooks/useScore';

export function ScoreDetailScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const accessToken = session?.access_token;

  const { score, history, insights, isLoading, error, refresh } = useScore({
    accessToken,
    autoFetch: true,
  });

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)');
    }
  };

  if (isLoading && !score) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.gold} />
          <ThemedText style={styles.loadingText}>Loading your score...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error && !score) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorTitle}>Unable to Load Score</ThemedText>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  if (!score) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyTitle}>No Score Yet</ThemedText>
          <ThemedText style={styles.emptyText}>
            Chat with Lina to start building your emotional health profile
          </ThemedText>
          <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/(tabs)/chat')}>
            <LinearGradient
              colors={['#BDA838', '#DEAE35']}
              style={styles.chatButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ThemedText style={styles.chatButtonText}>Start Chatting</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const scorePercentage = score.overall / 1000;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent.gold}
          />
        }
      >
        {/* Header with gradient */}
        <LinearGradient
          colors={['rgba(189, 168, 56, 0.2)', 'rgba(10, 8, 11, 0)']}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Your Emotional Health</ThemedText>
        </LinearGradient>

        {/* Large Score Display */}
        <View style={styles.scoreSection}>
          <View style={styles.circleContainer}>
            <Svg width={layout.scoreCircle} height={layout.scoreCircle}>
              <Defs>
                <SvgRadialGradient id="scoreGradient" cx="50%" cy="50%">
                  <Stop offset="0%" stopColor="#CEA869" stopOpacity="1" />
                  <Stop offset="20%" stopColor="#E6D8DA" stopOpacity="1" />
                  <Stop offset="40%" stopColor="#EAE8B6" stopOpacity="1" />
                  <Stop offset="60%" stopColor="#F0FF80" stopOpacity="1" />
                  <Stop offset="80%" stopColor="#BBB34D" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#A18D34" stopOpacity="1" />
                </SvgRadialGradient>
              </Defs>

              {/* Background circle */}
              <Circle
                cx={layout.scoreCircle / 2}
                cy={layout.scoreCircle / 2}
                r={(layout.scoreCircle - 40) / 2}
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth={40}
                fill="none"
              />

              {/* Progress circle */}
              <Circle
                cx={layout.scoreCircle / 2}
                cy={layout.scoreCircle / 2}
                r={(layout.scoreCircle - 40) / 2}
                stroke="url(#scoreGradient)"
                strokeWidth={40}
                fill="none"
                strokeDasharray={`${2 * Math.PI * ((layout.scoreCircle - 40) / 2)}`}
                strokeDashoffset={`${
                  2 * Math.PI * ((layout.scoreCircle - 40) / 2) * (1 - scorePercentage)
                }`}
                strokeLinecap="round"
                rotation="-90"
                origin={`${layout.scoreCircle / 2}, ${layout.scoreCircle / 2}`}
              />
            </Svg>

            {/* Score Value in Center */}
            <View style={styles.scoreValueContainer}>
              <ThemedText style={styles.scoreValue}>{score.overall}</ThemedText>
              <ThemedText style={styles.scoreLabel}>EHS</ThemedText>
            </View>
          </View>

          {/* Interpretation Text */}
          <ThemedText style={styles.interpretationText}>{score.interpretation}</ThemedText>
          <ThemedText style={styles.lastUpdatedText}>
            Last updated: {new Date(score.lastUpdated).toLocaleDateString()}
          </ThemedText>
        </View>

        {/* Component Breakdown */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Component Breakdown</ThemedText>
          <View style={styles.componentGrid}>
            <ComponentCard
              label="Self-Awareness"
              value={score.components.selfAwareness}
              color="#BDA838"
            />
            <ComponentCard
              label="Boundaries"
              value={score.components.boundaries}
              color="#CF802A"
            />
            <ComponentCard
              label="Communication"
              value={score.components.communication}
              color="#DEAE35"
            />
            <ComponentCard
              label="Attachment"
              value={score.components.attachmentSecurity}
              color="#9BA23B"
            />
            <ComponentCard
              label="Emotional Regulation"
              value={score.components.emotionalRegulation}
              color="#C35829"
            />
          </View>
        </View>

        {/* Score Trend Graph */}
        {history && history.dataPoints.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Your Progress</ThemedText>
            <ScoreGraph history={history} />
          </View>
        )}

        {/* Insights Section */}
        {insights && insights.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Insights & Suggestions</ThemedText>
            <View style={styles.insightsContainer}>
              {insights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedView>
  );
}

interface ComponentCardProps {
  label: string;
  value: number;
  color: string;
}

function ComponentCard({ label, value, color }: ComponentCardProps) {
  return (
    <View style={styles.componentCard}>
      <View style={[styles.componentColorBar, { backgroundColor: color }]} />
      <ThemedText style={styles.componentCardLabel}>{label}</ThemedText>
      <ThemedText style={styles.componentCardValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorTitle: {
    fontSize: typography.heading.h2.fontSize,
    fontWeight: typography.heading.h2.fontWeight as any,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  retryButton: {
    backgroundColor: colors.accent.gold,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.background.primary,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.heading.h1.fontSize,
    fontWeight: typography.heading.h1.fontWeight as any,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  chatButton: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  chatButtonText: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.background.primary,
  },

  // Header
  header: {
    paddingTop: spacing.xxxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.accent.gold,
  },
  headerTitle: {
    fontSize: typography.heading.h1.fontSize,
    fontWeight: typography.heading.h1.fontWeight as any,
    color: colors.text.primary,
  },

  // Score Section
  scoreSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  circleContainer: {
    width: layout.scoreCircle,
    height: layout.scoreCircle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scoreValueContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: typography.score.large.fontSize,
    fontWeight: typography.score.large.fontWeight as any,
    letterSpacing: typography.score.large.letterSpacing,
    color: colors.text.primary,
    lineHeight: typography.score.large.lineHeight,
  },
  scoreLabel: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  interpretationText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.body.medium.lineHeight,
    marginBottom: spacing.sm,
  },
  lastUpdatedText: {
    fontSize: typography.body.tiny.fontSize,
    color: colors.text.tertiary,
  },

  // Sections
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.heading.h2.fontSize,
    fontWeight: typography.heading.h2.fontWeight as any,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },

  // Component Breakdown
  componentGrid: {
    gap: spacing.md,
  },
  componentCard: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 3,
  },
  componentColorBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: spacing.md,
  },
  componentCardLabel: {
    flex: 1,
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
  },
  componentCardValue: {
    fontSize: typography.heading.h2.fontSize,
    fontWeight: typography.heading.h2.fontWeight as any,
    color: colors.text.primary,
  },

  // Insights
  insightsContainer: {
    gap: spacing.md,
  },

  // Bottom Spacer
  bottomSpacer: {
    height: spacing.xxxl,
  },
});
