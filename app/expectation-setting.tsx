import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors, componentStyles, spacing, typography } from '@/constants/theme';
import storage from '@/lib/storage';

const CRISIS_RESOURCES = [
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 crisis support',
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free 24/7 text support',
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    description: 'Mental health and substance abuse',
  },
];

export default function ExpectationSettingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acknowledgedDisclaimer, setAcknowledgedDisclaimer] = useState(false);

  const handleContinue = async () => {
    if (loading || !acceptedTerms || !acknowledgedDisclaimer) {
      return;
    }

    setLoading(true);
    try {
      // Mark onboarding as complete
      await storage.setItem('onboardingCompleted', 'true');
      
      // Navigate to main app
      router.replace('/(tabs)' as any);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      // Show error to user
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTerms = () => {
    // TODO: Replace with actual terms URL
    Linking.openURL('https://heylina.com/terms');
  };

  const handleOpenPrivacy = () => {
    // TODO: Replace with actual privacy policy URL
    Linking.openURL('https://heylina.com/privacy');
  };

  const canContinue = acceptedTerms && acknowledgedDisclaimer;

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>
            Before we begin
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            A few important things to know about using HeyLina
          </ThemedText>
        </View>

        {/* AI Disclaimer Section */}
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <ThemedText style={styles.icon}>🤖</ThemedText>
          </View>
          <ThemedText style={styles.sectionTitle}>
            Lina is AI-Powered
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            Lina uses artificial intelligence to provide guidance and support. While Lina is designed to be helpful and emotionally intelligent, she is not a replacement for professional therapy or medical advice.
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            Lina cannot:
          </ThemedText>
          <View style={styles.bulletList}>
            <ThemedText style={styles.bulletItem}>• Diagnose mental health conditions</ThemedText>
            <ThemedText style={styles.bulletItem}>• Provide medical or therapeutic treatment</ThemedText>
            <ThemedText style={styles.bulletItem}>• Handle crisis situations or emergencies</ThemedText>
            <ThemedText style={styles.bulletItem}>• Guarantee specific outcomes in your relationships</ThemedText>
          </View>
        </View>

        {/* Crisis Resources Section */}
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <ThemedText style={styles.icon}>🆘</ThemedText>
          </View>
          <ThemedText style={styles.sectionTitle}>
            If You Need Immediate Help
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            If you're experiencing a mental health crisis or emergency, please reach out to professional resources immediately:
          </ThemedText>
          <View style={styles.resourceList}>
            {CRISIS_RESOURCES.map((resource, index) => (
              <View key={index} style={styles.resourceCard}>
                <ThemedText style={styles.resourceName}>{resource.name}</ThemedText>
                <ThemedText style={styles.resourcePhone}>{resource.phone}</ThemedText>
                <ThemedText style={styles.resourceDescription}>{resource.description}</ThemedText>
              </View>
            ))}
          </View>
          <ThemedText style={styles.sectionText}>
            These resources are always available from the Settings menu.
          </ThemedText>
        </View>

        {/* Privacy and Data Section */}
        <View style={styles.section}>
          <View style={styles.iconContainer}>
            <ThemedText style={styles.icon}>🔒</ThemedText>
          </View>
          <ThemedText style={styles.sectionTitle}>
            Your Privacy Matters
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            Your conversations with Lina are private and secure. We use your data to provide personalized guidance and improve our service, but we never share your personal information with third parties for marketing purposes.
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            You have full control over your data and can request to export or delete your account at any time.
          </ThemedText>
        </View>

        {/* Acknowledgment Checkboxes */}
        <View style={styles.acknowledgmentSection}>
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAcknowledgedDisclaimer(!acknowledgedDisclaimer)}
            disabled={loading}
          >
            <View style={[styles.checkbox, acknowledgedDisclaimer && styles.checkboxChecked]}>
              {acknowledgedDisclaimer && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </View>
            <ThemedText style={styles.checkboxLabel}>
              I understand that Lina is an AI companion and not a therapist or crisis service
            </ThemedText>
          </Pressable>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            disabled={loading}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </View>
            <View style={styles.checkboxLabelContainer}>
              <ThemedText style={styles.checkboxLabel}>
                I agree to the{' '}
              </ThemedText>
              <Pressable onPress={handleOpenTerms}>
                <ThemedText style={styles.link}>Terms of Service</ThemedText>
              </Pressable>
              <ThemedText style={styles.checkboxLabel}>{' '}and{' '}</ThemedText>
              <Pressable onPress={handleOpenPrivacy}>
                <ThemedText style={styles.link}>Privacy Policy</ThemedText>
              </Pressable>
            </View>
          </Pressable>
        </View>

        <Pressable 
          style={[
            styles.button,
            (!canContinue || loading) && styles.buttonDisabled
          ]} 
          onPress={handleContinue} 
          disabled={!canContinue || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background.primary} />
          ) : (
            <ThemedText style={styles.buttonText}>
              Continue to HeyLina
            </ThemedText>
          )}
        </Pressable>
      </ScrollView>
    </ThemedView>
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
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: typography.heading.h1.fontSize,
    lineHeight: typography.heading.h1.lineHeight,
    fontWeight: typography.heading.h1.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
  },
  sectionTitle: {
    fontSize: typography.heading.h2.fontSize,
    lineHeight: typography.heading.h2.lineHeight,
    fontWeight: typography.heading.h2.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionText: {
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  bulletList: {
    marginLeft: spacing.md,
    marginBottom: spacing.md,
  },
  bulletItem: {
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  resourceList: {
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  resourceCard: {
    padding: spacing.lg,
    borderRadius: componentStyles.card.borderRadius,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  resourceName: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  resourcePhone: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '600',
    color: colors.accent.lightGold,
    marginBottom: spacing.xs,
  },
  resourceDescription: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.tertiary,
  },
  acknowledgmentSection: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.ui.border,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    borderColor: colors.accent.gold,
    backgroundColor: colors.accent.gold,
  },
  checkmark: {
    fontSize: 16,
    color: colors.background.primary,
    fontWeight: '600',
  },
  checkboxLabel: {
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
    color: colors.text.secondary,
  },
  checkboxLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  link: {
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
    color: colors.accent.lightGold,
    textDecorationLine: 'underline',
  },
  button: {
    ...componentStyles.button.primary,
    backgroundColor: colors.accent.warmGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.background.primary,
  },
});
