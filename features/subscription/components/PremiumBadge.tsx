/**
 * PremiumBadge Component
 * Visual indicator for premium features
 */

import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface PremiumBadgeProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export default function PremiumBadge({ size = 'medium', style }: PremiumBadgeProps) {
  const sizeStyles = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  };

  const textSizeStyles = {
    small: styles.textSmall,
    medium: styles.textMedium,
    large: styles.textLarge,
  };

  return (
    <View style={[styles.badge, sizeStyles[size], style]}>
      <Text style={[styles.text, textSizeStyles[size]]}>✨ Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.accent.warmGold,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  text: {
    color: colors.background.primary,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    ...typography.body.tiny,
  },
  textLarge: {
    ...typography.body.small,
  },
});
