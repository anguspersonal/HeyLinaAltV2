import { ThemedText } from '@/components/themed-text';
import { colors, layout, spacing, typography } from '@/constants/theme';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface ClarityInsight {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

interface ClarityHitsProps {
  insights?: ClarityInsight[];
  isLoading?: boolean;
  onBookmark?: (insightId: string) => void;
  onLike?: (insightId: string) => void;
  onInsightPress?: (insightId: string) => void;
}

export function ClarityHits({
  insights,
  isLoading = false,
  onBookmark,
  onLike,
  onInsightPress,
}: ClarityHitsProps) {
  // Default insights if none provided
  const defaultInsights: ClarityInsight[] = [
    {
      id: '1',
      title: 'Understanding Your Attachment Style',
      category: 'Attachment',
      isBookmarked: false,
      isLiked: false,
    },
    {
      id: '2',
      title: 'Setting Healthy Boundaries',
      category: 'Boundaries',
      isBookmarked: true,
      isLiked: false,
    },
    {
      id: '3',
      title: 'Communication Patterns in Conflict',
      category: 'Communication',
      isBookmarked: false,
      isLiked: true,
    },
    {
      id: '4',
      title: 'Recognizing Emotional Triggers',
      category: 'Self-Awareness',
      isBookmarked: false,
      isLiked: false,
    },
  ];

  const displayInsights = insights && insights.length > 0 ? insights : defaultInsights;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title}>Today's Clarity Hits</ThemedText>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading insights...</ThemedText>
        </View>
      </View>
    );
  }

  if (displayInsights.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title}>Today's Clarity Hits</ThemedText>
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            Your personalized insights will appear here as you chat with Lina
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Today's Clarity Hits</ThemedText>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayInsights.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onPress={() => onInsightPress?.(insight.id)}
            onBookmark={() => onBookmark?.(insight.id)}
            onLike={() => onLike?.(insight.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

interface InsightCardProps {
  insight: ClarityInsight;
  onPress?: () => void;
  onBookmark?: () => void;
  onLike?: () => void;
}

function InsightCard({ insight, onPress, onBookmark, onLike }: InsightCardProps) {
  // Category colors
  const categoryColors: Record<string, string> = {
    'Attachment': '#9BA23B',
    'Boundaries': '#CF802A',
    'Communication': '#DEAE35',
    'Self-Awareness': '#BDA838',
    'Emotional Regulation': '#C35829',
  };

  const categoryColor = categoryColors[insight.category] || colors.accent.gold;

  return (
    <TouchableOpacity
      style={styles.insightCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Circular Image with Glow */}
      <View style={styles.imageContainer}>
        {/* Glow Effect */}
        <View style={[styles.glowEffect, { backgroundColor: categoryColor }]} />
        
        {/* Image or Placeholder */}
        <View style={[styles.imagePlaceholder, { backgroundColor: categoryColor }]}>
          {insight.imageUrl ? (
            <Image
              source={{ uri: insight.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderContent}>
              <ThemedText style={styles.placeholderIcon}>✨</ThemedText>
            </View>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        {/* Category Badge */}
        <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
          <ThemedText style={[styles.categoryText, { color: categoryColor }]}>
            {insight.category}
          </ThemedText>
        </View>

        {/* Title */}
        <ThemedText style={styles.insightTitle} numberOfLines={2}>
          {insight.title}
        </ThemedText>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onBookmark?.();
            }}
          >
            <ThemedText style={styles.actionIcon}>
              {insight.isBookmarked ? '🔖' : '📑'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onLike?.();
            }}
          >
            <ThemedText style={styles.actionIcon}>
              {insight.isLiked ? '❤️' : '🤍'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
    minHeight: 200,
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
    minHeight: 200,
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
    gap: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  
  // Insight Card
  insightCard: {
    width: layout.insightCardWidth,
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  
  // Image Container
  imageContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.3,
    shadowColor: '#CEA869',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 32,
  },
  
  // Card Content
  cardContent: {
    gap: spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: typography.body.tiny.fontSize,
    fontWeight: '500',
  },
  insightTitle: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: typography.body.medium.lineHeight,
    minHeight: 40, // Ensure consistent height
  },
  
  // Actions
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  actionIcon: {
    fontSize: 16,
  },
});
