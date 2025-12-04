import { ThemedText } from '@/components/themed-text';
import { colors, layout, spacing, typography } from '@/constants/theme';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { EmotionalHealthScore } from '../types';

interface ScoreBreakdownProps {
  score: EmotionalHealthScore | null;
  isLoading?: boolean;
}

export function ScoreBreakdown({ score, isLoading = false }: ScoreBreakdownProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title}>Score Breakdown</ThemedText>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading breakdown...</ThemedText>
        </View>
      </View>
    );
  }

  if (!score) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title}>Score Breakdown</ThemedText>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            Your score breakdown will appear here once you start chatting with Lina
          </ThemedText>
        </View>
      </View>
    );
  }

  const components = [
    {
      key: 'selfAwareness',
      label: 'Self-Awareness',
      value: score.components.selfAwareness,
      color: '#BDA838',
    },
    {
      key: 'boundaries',
      label: 'Boundaries',
      value: score.components.boundaries,
      color: '#CF802A',
    },
    {
      key: 'communication',
      label: 'Communication',
      value: score.components.communication,
      color: '#DEAE35',
    },
    {
      key: 'attachmentSecurity',
      label: 'Attachment',
      value: score.components.attachmentSecurity,
      color: '#9BA23B',
    },
    {
      key: 'emotionalRegulation',
      label: 'Emotional Regulation',
      value: score.components.emotionalRegulation,
      color: '#C35829',
    },
  ];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Score Breakdown</ThemedText>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {components.map((component) => (
          <ComponentBar
            key={component.key}
            label={component.label}
            value={component.value}
            color={component.color}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface ComponentBarProps {
  label: string;
  value: number;
  color: string;
}

function ComponentBar({ label, value, color }: ComponentBarProps) {
  // Calculate bar height based on value (0-100 scale)
  const barHeight = (value / 100) * (layout.componentBarHeight - 24); // 24px for padding and label

  return (
    <View style={styles.componentBarContainer}>
      <View style={styles.barWrapper}>
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                height: barHeight,
                backgroundColor: color,
              },
            ]}
          />
        </View>
        <ThemedText style={styles.barValue}>{value}</ThemedText>
      </View>
      <ThemedText style={styles.barLabel} numberOfLines={2}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.heading.h2.fontSize,
    fontWeight: typography.heading.h2.fontWeight as any,
    lineHeight: typography.heading.h2.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  
  // Loading State
  loadingContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  loadingText: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
  },
  
  // Empty State
  emptyContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  emptyText: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.body.small.lineHeight,
  },
  
  // Scroll Content
  scrollContent: {
    gap: 10,
    paddingHorizontal: spacing.xs,
  },
  
  // Component Bar
  componentBarContainer: {
    width: layout.componentBarWidth,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    height: layout.componentBarHeight,
    marginBottom: spacing.sm,
  },
  barBackground: {
    flex: 1,
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.sm,
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: typography.body.tiny.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  barLabel: {
    fontSize: typography.body.tiny.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.body.tiny.lineHeight,
  },
});
