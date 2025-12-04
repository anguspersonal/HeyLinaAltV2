import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafetyResources } from '../components/SafetyResources';
import { SettingItem } from '../components/SettingItem';

export function SettingsScreen() {
  const { signOut, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await signOut();
              // Navigation will be handled by auth state change
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleProfilePress = () => {
    router.push('/settings/profile');
  };

  const handleNotificationsPress = () => {
    router.push('/settings/notifications');
  };

  const handleDataPrivacyPress = () => {
    router.push('/settings/data-privacy');
  };

  const handleAboutPress = () => {
    Alert.alert(
      'About HeyLina',
      'HeyLina is your AI companion for emotionally intelligent dating guidance.\n\nVersion 1.0.0',
      [{ text: 'OK' }]
    );
  };

  const handleSupportPress = () => {
    Alert.alert(
      'Support',
      'Need help? Contact us at support@heylina.com',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        {user?.email && (
          <Text style={styles.email}>{user.email}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          title="Profile"
          subtitle="Manage your personal information"
          icon="person-outline"
          onPress={handleProfilePress}
        />
        <SettingItem
          title="Notifications"
          subtitle="Manage check-ins and reminders"
          icon="notifications-outline"
          onPress={handleNotificationsPress}
        />
        <SettingItem
          title="Data & Privacy"
          subtitle="Export data and manage account"
          icon="shield-outline"
          onPress={handleDataPrivacyPress}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          title="About HeyLina"
          subtitle="App version and information"
          icon="information-circle-outline"
          onPress={handleAboutPress}
        />
        <SettingItem
          title="Help & Support"
          subtitle="Get help or contact us"
          icon="help-circle-outline"
          onPress={handleSupportPress}
        />
      </View>

      <View style={styles.section}>
        <SafetyResources />
      </View>

      <View style={styles.section}>
        <SettingItem
          title={isLoggingOut ? 'Signing out...' : 'Sign Out'}
          icon="log-out-outline"
          onPress={handleLogout}
          showChevron={false}
          destructive
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Lina is an AI companion and not a replacement for professional therapy or crisis services.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    ...typography.heading.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  email: {
    ...typography.body.small,
    color: colors.text.secondary,
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
