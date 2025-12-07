import { AnimatedScoreCircle } from '@/components/animations/AnimatedScoreCircle';
import { FadeIn } from '@/components/animations/FadeIn';
import { ThemedText } from '@/components/themed-text';
import { colors, layout, spacing, typography } from '@/constants/theme';
import { formatScoreForScreenReader } from '@/lib/accessibility';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { EmotionalHealthScore, QuickAction } from '../types';

interface ScoreCardProps {
  score: EmotionalHealthScore | null;
  isLoading?: boolean;
  onViewDetails?: () => void;
}

export function ScoreCard({ score, isLoading = false, onViewDetails }: ScoreCardProps) {
  const [showStatistics, setShowStatistics] = useState(false);

  // Quick actions for the bottom of the card
  const quickActions: QuickAction[] = [
    { id: '1', label: 'Talk about someone I\'m dating' },
    { id: '2', label: 'Process a breakup' },
    { id: '3', label: 'Understand my patterns' },
    { id: '4', label: 'Set boundaries' },
  ];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading your score...</ThemedText>
        </View>
      </View>
    );
  }

  if (!score) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyTitle}>Your Emotional Health Score</ThemedText>
          <ThemedText style={styles.emptyText}>
            Chat with Lina to start building your emotional health profile
          </ThemedText>
        </View>
      </View>
    );
  }

  const scorePercentage = score.overall / 1000; // Convert to 0-1 range for circle
  
  // Create accessibility label for score
  const scoreAccessibilityLabel = `Your Emotional Health Score is ${formatScoreForScreenReader(score.overall, 1000)}. ${score.interpretation}`;

  return (
    <View style={styles.container}>
      {/* Main Score Display */}
      <View 
        style={styles.scoreSection}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={scoreAccessibilityLabel}
      >
        {/* Circular Score Visualization with Animation */}
        <View style={styles.circleContainer} accessible={false}>
          <AnimatedScoreCircle score={score.overall} />
          
          {/* Score Value in Center */}
          <View style={styles.scoreValueContainer} accessible={false}>
            <FadeIn duration={500} delay={800}>
              <ThemedText style={styles.scoreValue} accessible={false}>{score.overall}</ThemedText>
              <ThemedText style={styles.scoreLabel} accessible={false}>EHS</ThemedText>
            </FadeIn>
          </View>
        </View>

        {/* Interpretation Text */}
        <ThemedText style={styles.interpretationText} accessible={false}>
          {score.interpretation}
        </ThemedText>

        {/* Statistics Toggle */}
        <TouchableOpacity
          style={styles.statisticsToggle}
          onPress={() => setShowStatistics(!showStatistics)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={showStatistics ? 'Hide statistics' : 'View statistics'}
          accessibilityHint="Double tap to toggle component breakdown visibility"
          accessibilityState={{ expanded: showStatistics }}
        >
          <ThemedText style={styles.statisticsToggleText}>
            {showStatistics ? 'Hide' : 'View'} Statistics
          </ThemedText>
        </TouchableOpacity>

        {/* Statistics Section (Collapsible) */}
        {showStatistics && (
          <View style={styles.statisticsSection}>
            <ThemedText style={styles.statisticsTitle}>Component Breakdown</ThemedText>
            <View style={styles.componentList}>
              <ComponentItem label="Self-Awareness" value={score.components.selfAwareness} color="#BDA838" />
              <ComponentItem label="Boundaries" value={score.components.boundaries} color="#CF802A" />
              <ComponentItem label="Communication" value={score.components.communication} color="#DEAE35" />
              <ComponentItem label="Attachment" value={score.components.attachmentSecurity} color="#9BA23B" />
              <ComponentItem label="Emotional Regulation" value={score.components.emotionalRegulation} color="#C35829" />
            </View>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsScroll}
        >
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => {
                // Navigate to chat with this prompt
                console.log('Quick action:', action.label);
              }}
            >
              <LinearGradient
                colors={['#BDA838', '#DEAE35']}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <ThemedText style={styles.quickActionText} numberOfLines={2}>
                  {action.label}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

interface ComponentItemProps {
  label: string;
  value: number;
  color: string;
}

function ComponentItem({ label, value, color }: ComponentItemProps) {
  const accessibilityLabel = `${label}: ${value} out of 100`;
  
  return (
    <View 
      style={styles.componentItem}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.componentInfo} accessible={false}>
        <View 
          style={[styles.componentColorDot, { backgroundColor: color }]} 
          accessible={false}
        />
        <ThemedText style={styles.componentLabel} accessible={false}>{label}</ThemedText>
      </View>
      <ThemedText style={styles.componentValue} accessible={false}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  
  // Loading State
  loadingContainer: {
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
  },
  
  // Empty State
  emptyContainer: {
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.heading.h2.fontSize,
    fontWeight: typography.heading.h2.fontWeight as any,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.body.medium.lineHeight,
  },
  
  // Score Section
  scoreSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
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
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  
  // Statistics Toggle
  statisticsToggle: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  statisticsToggleText: {
    fontSize: typography.body.small.fontSize,
    color: colors.accent.gold,
    fontWeight: '500',
  },
  
  // Statistics Section
  statisticsSection: {
    width: '100%',
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  statisticsTitle: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  componentList: {
    gap: spacing.md,
  },
  componentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  componentColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  componentLabel: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
  },
  componentValue: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
  },
  
  // Quick Actions
  quickActionsSection: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    paddingTop: spacing.lg,
  },
  quickActionsScroll: {
    gap: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  quickActionButton: {
    width: layout.quickActionSize * 2,
    height: layout.quickActionSize,
    borderRadius: 6,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  quickActionText: {
    fontSize: typography.body.tiny.fontSize,
    fontWeight: '500',
    color: colors.background.primary,
    textAlign: 'center',
  },
});
