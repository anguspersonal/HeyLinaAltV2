import { borderRadius, colors, componentStyles, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafetyResources } from '../components/SafetyResources';
import { deleteAccount, requestDataExport } from '../services/userApi';

export function DataPrivacyScreen() {
  const { session } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDataExport = async () => {
    if (!session?.access_token) return;

    Alert.alert(
      'Export Your Data',
      'We will prepare a copy of all your data and send it to your email. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Export',
          onPress: async () => {
            try {
              setIsExporting(true);
              await requestDataExport(session.access_token);
              Alert.alert(
                'Export Requested',
                'Your data export has been requested. You will receive an email with a download link shortly.'
              );
            } catch (error) {
              console.error('Failed to request data export:', error);
              Alert.alert('Error', 'Failed to request data export. Please try again.');
            } finally {
              setIsExporting(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDeleteAccount(),
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    Alert.alert(
      'Final Confirmation',
      'This is your last chance. Type DELETE to confirm account deletion.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'I Understand, Delete My Account',
          style: 'destructive',
          onPress: async () => {
            if (!session?.access_token) return;

            try {
              setIsDeleting(true);
              await deleteAccount(session.access_token);
              // Navigation will be handled by auth state change
            } catch (error) {
              console.error('Failed to delete account:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again or contact support.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://heylina.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://heylina.com/terms');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Data & Privacy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Data</Text>
          <Text style={styles.description}>
            You have full control over your data. You can export all your conversations, insights, and profile information at any time.
          </Text>

          <TouchableOpacity
            style={[styles.actionButton, isExporting && styles.actionButtonDisabled]}
            onPress={handleDataExport}
            disabled={isExporting}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="download-outline" size={24} color={colors.accent.gold} />
              <View style={styles.actionButtonText}>
                <Text style={styles.actionButtonTitle}>
                  {isExporting ? 'Requesting Export...' : 'Export My Data'}
                </Text>
                <Text style={styles.actionButtonSubtitle}>
                  Download all your data in a portable format
                </Text>
              </View>
            </View>
            {!isExporting && (
              <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
            )}
            {isExporting && <ActivityIndicator color={colors.accent.gold} />}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Terms</Text>
          
          <TouchableOpacity style={styles.linkButton} onPress={handlePrivacyPolicy}>
            <View style={styles.linkButtonContent}>
              <Ionicons name="document-text-outline" size={24} color={colors.accent.gold} />
              <Text style={styles.linkButtonText}>Privacy Policy</Text>
            </View>
            <Ionicons name="open-outline" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={handleTermsOfService}>
            <View style={styles.linkButtonContent}>
              <Ionicons name="document-text-outline" size={24} color={colors.accent.gold} />
              <Text style={styles.linkButtonText}>Terms of Service</Text>
            </View>
            <Ionicons name="open-outline" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <SafetyResources />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <Text style={styles.description}>
            Once you delete your account, there is no going back. All your data will be permanently deleted.
          </Text>

          <TouchableOpacity
            style={[styles.deleteButton, isDeleting && styles.deleteButtonDisabled]}
            onPress={handleDeleteAccount}
            disabled={isDeleting}
          >
            <View style={styles.deleteButtonContent}>
              <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
              <Text style={styles.deleteButtonText}>
                {isDeleting ? 'Deleting Account...' : 'Delete My Account'}
              </Text>
            </View>
            {isDeleting && <ActivityIndicator color="#FF6B6B" />}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            We take your privacy seriously. Your conversations are encrypted and we never share your personal information with third parties.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  title: {
    ...typography.heading.h2,
    color: colors.text.primary,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...typography.body.small,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  description: {
    ...typography.body.small,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...componentStyles.card,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionButtonText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  actionButtonTitle: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...componentStyles.card,
  },
  linkButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkButtonText: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
    marginLeft: spacing.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    ...componentStyles.card,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    ...typography.body.medium,
    color: '#FF6B6B',
    fontWeight: '500',
    marginLeft: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  footerText: {
    ...typography.body.small,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
