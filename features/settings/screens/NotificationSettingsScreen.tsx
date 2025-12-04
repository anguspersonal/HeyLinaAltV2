import { borderRadius, colors, componentStyles, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getNotificationSettings, updateNotificationSettings } from '../services/userApi';
import type { NotificationSettings } from '../types';

type Frequency = 'daily' | 'weekly' | 'custom';

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function NotificationSettingsScreen() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    checkIns: {
      enabled: false,
      frequency: 'daily',
      time: '09:00',
    },
    eventFollowUps: true,
    weeklyReflections: true,
    scoreUpdates: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (!session?.access_token) return;

    try {
      setIsLoading(true);
      const data = await getNotificationSettings(session.access_token);
      setSettings(data);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      Alert.alert('Error', 'Failed to load settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.access_token) return;

    try {
      setIsSaving(true);
      await updateNotificationSettings(settings, session.access_token);
      Alert.alert('Success', 'Notification settings updated!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setSettings({
        ...settings,
        checkIns: {
          ...settings.checkIns,
          time: `${hours}:${minutes}`,
        },
      });
    }
  };

  const toggleDay = (dayIndex: number) => {
    const currentDays = settings.checkIns.days || [];
    const newDays = currentDays.includes(dayIndex)
      ? currentDays.filter((d) => d !== dayIndex)
      : [...currentDays, dayIndex].sort();
    
    setSettings({
      ...settings,
      checkIns: {
        ...settings.checkIns,
        days: newDays,
      },
    });
  };

  const parseTime = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive check-ins and updates from Lina
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={(value) => setSettings({ ...settings, enabled: value })}
              trackColor={{ false: colors.ui.border, true: colors.accent.gold }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>

        {settings.enabled && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Check-ins</Text>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Daily Check-ins</Text>
                  <Text style={styles.settingDescription}>
                    Regular prompts to reflect with Lina
                  </Text>
                </View>
                <Switch
                  value={settings.checkIns.enabled}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      checkIns: { ...settings.checkIns, enabled: value },
                    })
                  }
                  trackColor={{ false: colors.ui.border, true: colors.accent.gold }}
                  thumbColor={colors.text.primary}
                />
              </View>

              {settings.checkIns.enabled && (
                <>
                  <View style={styles.field}>
                    <Text style={styles.label}>Frequency</Text>
                    <View style={styles.optionsContainer}>
                      {FREQUENCIES.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.option,
                            settings.checkIns.frequency === option.value && styles.optionSelected,
                          ]}
                          onPress={() =>
                            setSettings({
                              ...settings,
                              checkIns: { ...settings.checkIns, frequency: option.value },
                            })
                          }
                        >
                          <Text
                            style={[
                              styles.optionText,
                              settings.checkIns.frequency === option.value && styles.optionTextSelected,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Time</Text>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={styles.timeButtonText}>{settings.checkIns.time}</Text>
                      <Ionicons name="time-outline" size={20} color={colors.accent.gold} />
                    </TouchableOpacity>
                  </View>

                  {showTimePicker && (
                    <DateTimePicker
                      value={parseTime(settings.checkIns.time)}
                      mode="time"
                      is24Hour={false}
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}

                  {settings.checkIns.frequency === 'custom' && (
                    <View style={styles.field}>
                      <Text style={styles.label}>Days</Text>
                      <View style={styles.daysContainer}>
                        {DAYS.map((day, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.dayButton,
                              settings.checkIns.days?.includes(index) && styles.dayButtonSelected,
                            ]}
                            onPress={() => toggleDay(index)}
                          >
                            <Text
                              style={[
                                styles.dayButtonText,
                                settings.checkIns.days?.includes(index) && styles.dayButtonTextSelected,
                              ]}
                            >
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Other Notifications</Text>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Event Follow-ups</Text>
                  <Text style={styles.settingDescription}>
                    Get reminders to reflect after dates or events
                  </Text>
                </View>
                <Switch
                  value={settings.eventFollowUps}
                  onValueChange={(value) => setSettings({ ...settings, eventFollowUps: value })}
                  trackColor={{ false: colors.ui.border, true: colors.accent.gold }}
                  thumbColor={colors.text.primary}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Weekly Reflections</Text>
                  <Text style={styles.settingDescription}>
                    Weekly prompts to review your progress
                  </Text>
                </View>
                <Switch
                  value={settings.weeklyReflections}
                  onValueChange={(value) => setSettings({ ...settings, weeklyReflections: value })}
                  trackColor={{ false: colors.ui.border, true: colors.accent.gold }}
                  thumbColor={colors.text.primary}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Score Updates</Text>
                  <Text style={styles.settingDescription}>
                    Get notified when your emotional health score changes
                  </Text>
                </View>
                <Switch
                  value={settings.scoreUpdates}
                  onValueChange={(value) => setSettings({ ...settings, scoreUpdates: value })}
                  trackColor={{ false: colors.ui.border, true: colors.accent.gold }}
                  thumbColor={colors.text.primary}
                />
              </View>
            </View>
          </>
        )}

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.text.primary} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...componentStyles.card,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    ...typography.body.small,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  field: {
    marginTop: spacing.lg,
  },
  label: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  option: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  optionSelected: {
    backgroundColor: colors.accent.gold,
    borderColor: colors.accent.gold,
  },
  optionText: {
    ...typography.body.small,
    color: colors.text.secondary,
  },
  optionTextSelected: {
    color: colors.background.primary,
    fontWeight: '500',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  timeButtonText: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  dayButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.ui.border,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: colors.accent.gold,
    borderColor: colors.accent.gold,
  },
  dayButtonText: {
    ...typography.body.small,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: colors.background.primary,
  },
  saveButton: {
    ...componentStyles.button.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '600',
  },
});
