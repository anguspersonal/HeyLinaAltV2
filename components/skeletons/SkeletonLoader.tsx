/**
 * Reusable Skeleton Loader Components
 * Provides animated loading placeholders for various UI elements
 */

import { borderRadius, colors, spacing } from '@/constants/theme';
import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Base Skeleton Component
 * Animated placeholder with shimmer effect
 */
export function Skeleton({ width = '100%', height = 20, borderRadius: radius = borderRadius.sm, style }: SkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

/**
 * Skeleton Circle
 * For avatars, score circles, etc.
 */
export function SkeletonCircle({ size = 40, style }: { size?: number; style?: ViewStyle }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />;
}

/**
 * Skeleton Text Line
 * For text content placeholders
 */
export function SkeletonText({ 
  width = '100%', 
  lines = 1, 
  lineHeight = 16,
  gap = spacing.sm,
  style 
}: { 
  width?: number | string; 
  lines?: number;
  lineHeight?: number;
  gap?: number;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.textContainer, style]}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lines > 1 ? '70%' : width}
          height={lineHeight}
          style={{ marginBottom: index < lines - 1 ? gap : 0 }}
        />
      ))}
    </View>
  );
}

/**
 * Skeleton Card
 * For card-based content
 */
export function SkeletonCard({ 
  height = 100, 
  style 
}: { 
  height?: number; 
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.card, { height }, style]}>
      <Skeleton width="100%" height="100%" borderRadius={borderRadius.md} />
    </View>
  );
}

/**
 * Skeleton Message Bubble
 * For chat messages
 */
export function SkeletonMessageBubble({ 
  isUser = false,
  style 
}: { 
  isUser?: boolean;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble, style]}>
      <Skeleton width="100%" height={60} borderRadius={borderRadius.md} />
    </View>
  );
}

/**
 * Skeleton Score Component Bar
 * For score breakdown bars
 */
export function SkeletonScoreBar({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.scoreBar, style]}>
      <Skeleton width={64} height={88} borderRadius={borderRadius.md} />
    </View>
  );
}

/**
 * Skeleton Insight Card
 * For clarity hits/insights
 */
export function SkeletonInsightCard({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.insightCard, style]}>
      <SkeletonCircle size={80} style={{ marginBottom: spacing.md }} />
      <SkeletonText width="80%" lines={2} lineHeight={14} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.ui.border,
  },
  textContainer: {
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  messageBubble: {
    marginVertical: spacing.sm,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  scoreBar: {
    marginRight: spacing.md,
  },
  insightCard: {
    width: 237,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginRight: spacing.md,
  },
});
