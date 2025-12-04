import { ThemedText } from '@/components/themed-text';
import { colors, layout, spacing, typography } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle, Defs, Stop, RadialGradient as SvgRadialGradient } from 'react-native-svg';
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

  return (
    <View style={styles.container}>
      {/* Main Score Display */}
      <View style={styles.scoreSection}>
        {/* Circular Score Visualization */}
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
              strokeDashoffset={`${2 * Math.PI * ((layout.scoreCircle - 40) / 2) * (1 - scorePercentage)}`}
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
        <ThemedText style={styles.interpretationText}>
          {score.interpretation}
        </ThemedText>

        {/* Statistics Toggle */}
        <TouchableOpacity
          style={styles.statisticsToggle}
          onPress={() => setShowStatistics(!showStatistics)}
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
  return (
    <View style={styles.componentItem}>
      <View style={styles.componentInfo}>
        <View style={[styles.componentColorDot, { backgroundColor: color }]} />
        <ThemedText style={styles.componentLabel}>{label}</ThemedText>
      </View>
      <ThemedText style={styles.componentValue}>{value}</ThemedText>
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
