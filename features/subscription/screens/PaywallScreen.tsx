import { borderRadius, colors, componentStyles, spacing, typography } from '@/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PaywallScreenProps {
  onSubscribe?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
}

const SUBSCRIPTION_BENEFITS = [
  'Unlimited conversations with Lina',
  'Personalized emotional health insights',
  'Track your progress over time',
  'Access to all premium features',
  'Priority support',
  'Ad-free experience',
];

const PRICING = {
  amount: 14.99,
  currency: '£',
  interval: 'month',
  trialDays: 14,
};

export default function PaywallScreen({
  onSubscribe,
  onClose,
  isLoading = false,
}: PaywallScreenProps) {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + PRICING.trialDays);
  
  const formattedTrialEnd = trialEndDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Unlock Premium</Text>
          <Text style={styles.subtitle}>
            Get full access to HeyLina and start your journey to better relationships
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>{PRICING.currency}</Text>
            <Text style={styles.price}>{PRICING.amount.toFixed(2)}</Text>
            <Text style={styles.interval}>/{PRICING.interval}</Text>
          </View>
          
          <View style={styles.trialBadge}>
            <Text style={styles.trialText}>
              {PRICING.trialDays}-day free trial
            </Text>
          </View>
          
          <Text style={styles.billingInfo}>
            Trial ends {formattedTrialEnd}. Cancel anytime before then to avoid charges.
          </Text>
        </View>

        {/* Benefits List */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>What's included:</Text>
          {SUBSCRIPTION_BENEFITS.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            • Subscription automatically renews unless cancelled
          </Text>
          <Text style={styles.infoText}>
            • Manage your subscription in Settings
          </Text>
          <Text style={styles.infoText}>
            • Cancel anytime, no questions asked
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.subscribeButton, isLoading && styles.subscribeButtonDisabled]}
          onPress={onSubscribe}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background.primary} />
          ) : (
            <Text style={styles.subscribeButtonText}>
              Start Free Trial
            </Text>
          )}
        </TouchableOpacity>

        {onClose && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
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
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.display.medium,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.body.medium.lineHeight * 1.4,
  },
  pricingCard: {
    ...componentStyles.card,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  currency: {
    ...typography.heading.h2,
    color: colors.accent.gold,
    marginTop: spacing.sm,
  },
  price: {
    fontSize: 56,
    lineHeight: 56,
    fontWeight: '500',
    color: colors.accent.gold,
    marginHorizontal: spacing.xs,
  },
  interval: {
    ...typography.heading.h3,
    color: colors.text.secondary,
    alignSelf: 'flex-end',
    marginBottom: spacing.sm,
  },
  trialBadge: {
    backgroundColor: colors.accent.warmGold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginBottom: spacing.lg,
  },
  trialText: {
    ...typography.body.small,
    fontWeight: '600',
    color: colors.background.primary,
  },
  billingInfo: {
    ...typography.body.small,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: typography.body.small.lineHeight * 1.4,
  },
  benefitsContainer: {
    marginBottom: spacing.xxl,
  },
  benefitsTitle: {
    ...typography.heading.h2,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent.warmGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkmarkText: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  benefitText: {
    ...typography.body.medium,
    color: colors.text.primary,
    flex: 1,
  },
  infoContainer: {
    marginBottom: spacing.xl,
  },
  infoText: {
    ...typography.body.small,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
    lineHeight: typography.body.small.lineHeight * 1.4,
  },
  bottomContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  subscribeButton: {
    ...componentStyles.button.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    ...typography.body.medium,
    fontWeight: '600',
    color: colors.background.primary,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  closeButtonText: {
    ...typography.body.medium,
    color: colors.text.secondary,
  },
  termsText: {
    ...typography.body.tiny,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: typography.body.tiny.lineHeight * 1.4,
  },
});
