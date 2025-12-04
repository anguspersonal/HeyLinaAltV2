/**
 * PremiumGate Component
 * Conditionally renders content based on subscription status
 * Shows paywall for non-premium users
 */

import { borderRadius, colors, componentStyles, spacing, typography } from '@/constants/theme';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSubscription } from '../context/SubscriptionContext';

interface PremiumGateProps {
  children: ReactNode;
  feature?: string;
  onUpgrade?: () => void;
  fallback?: ReactNode;
}

export default function PremiumGate({
  children,
  feature = 'this feature',
  onUpgrade,
  fallback,
}: PremiumGateProps) {
  const { isPremium, isInTrial } = useSubscription();

  // Allow access for premium users and trial users
  if (isPremium || isInTrial) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show default premium gate UI
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✨</Text>
        </View>
        
        <Text style={styles.title}>Premium Feature</Text>
        
        <Text style={styles.description}>
          Upgrade to Premium to access {feature} and unlock all features
        </Text>

        {onUpgrade && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={onUpgrade}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  card: {
    ...componentStyles.card,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.warmGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    ...typography.heading.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.body.medium.lineHeight * 1.4,
  },
  upgradeButton: {
    ...componentStyles.button.primary,
    paddingHorizontal: spacing.xxl,
  },
  upgradeButtonText: {
    ...typography.body.medium,
    fontWeight: '600',
    color: colors.background.primary,
  },
});
