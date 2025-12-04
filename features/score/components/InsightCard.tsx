import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/constants/theme';
import React, { useState } from 'react';
import { Alert, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { ScoreInsight } from '../types';

interface InsightCardProps {
  insight: ScoreInsight;
  onBookmark?: (insightId: string) => void;
  isBookmarked?: boolean;
}

export function InsightCard({ insight, onBookmark, isBookmarked = false }: InsightCardProps) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  // Map component to color
  const componentColors: Record<string, string> = {
    selfAwareness: '#BDA838',
    boundaries: '#CF802A',
    communication: '#DEAE35',
    attachmentSecurity: '#9BA23B',
    emotionalRegulation: '#C35829',
  };

  const componentColor = componentColors[insight.component] || colors.accent.gold;

  // Map priority to visual indicator
  const priorityLabels: Record<string, string> = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  const priorityColors: Record<string, string> = {
    high: colors.accent.orange,
    medium: colors.accent.yellow,
    low: colors.accent.lime,
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmark) {
      onBookmark(insight.id);
    }
  };

  const handleShare = async () => {
    try {
      const message = `${insight.title}\n\n${insight.description}\n\nSuggested Action: ${insight.suggestedAction}`;
      await Share.share({
        message,
      });
    } catch (error) {
      Alert.alert('Unable to share', 'Something went wrong while trying to share this insight.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with component indicator */}
      <View style={styles.header}>
        <View style={[styles.componentDot, { backgroundColor: componentColor }]} />
        <ThemedText style={styles.componentLabel}>
          {formatComponentName(insight.component)}
        </ThemedText>
        {insight.priority && (
          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[insight.priority] }]}>
            <ThemedText style={styles.priorityText}>
              {priorityLabels[insight.priority]}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Title */}
      <ThemedText style={styles.title}>{insight.title}</ThemedText>

      {/* Description */}
      <ThemedText style={styles.description}>{insight.description}</ThemedText>

      {/* Suggested Action */}
      <View style={styles.actionContainer}>
        <ThemedText style={styles.actionLabel}>Suggested Action:</ThemedText>
        <ThemedText style={styles.actionText}>{insight.suggestedAction}</ThemedText>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
          <ThemedText style={styles.actionButtonText}>
            {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <ThemedText style={styles.actionButtonText}>↗ Share</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper function to format component names
function formatComponentName(component: string): string {
  const names: Record<string, string> = {
    selfAwareness: 'Self-Awareness',
    boundaries: 'Boundaries',
    communication: 'Communication',
    attachmentSecurity: 'Attachment Security',
    emotionalRegulation: 'Emotional Regulation',
  };
  return names[component] || component;
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
    elevation: 3,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  componentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  componentLabel: {
    fontSize: typography.body.tiny.fontSize,
    color: colors.text.tertiary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  priorityText: {
    fontSize: typography.body.tiny.fontSize,
    color: colors.background.primary,
    fontWeight: '500',
  },

  // Content
  title: {
    fontSize: typography.heading.h3.fontSize,
    fontWeight: typography.heading.h3.fontWeight as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: typography.heading.h3.lineHeight,
  },
  description: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
    lineHeight: typography.body.medium.lineHeight,
    marginBottom: spacing.lg,
  },

  // Suggested Action
  actionContainer: {
    backgroundColor: colors.background.primary,
    borderRadius: 6,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.gold,
  },
  actionLabel: {
    fontSize: typography.body.tiny.fontSize,
    color: colors.text.tertiary,
    fontWeight: '500',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.primary,
    lineHeight: typography.body.medium.lineHeight,
  },

  // Actions Row
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 6,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: typography.body.small.fontSize,
    color: colors.accent.gold,
    fontWeight: '500',
  },
});
