import { borderRadius, colors, componentStyles, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getProfile, updateProfile } from '../services/userApi';
import type { UserProfile } from '../types';

type AgeRange = '18-24' | '25-29' | '30-34' | '35-39' | '40+';
type RelationshipStatus = 'single' | 'dating' | 'in-relationship' | 'complicated';
type PrimaryGoal = 'healing-breakup' | 'dating-intention' | 'improve-communication' | 'understand-patterns';

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: '18-24', label: '18-24' },
  { value: '25-29', label: '25-29' },
  { value: '30-34', label: '30-34' },
  { value: '35-39', label: '35-39' },
  { value: '40+', label: '40+' },
];

const RELATIONSHIP_STATUSES: { value: RelationshipStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'dating', label: 'Dating' },
  { value: 'in-relationship', label: 'In a Relationship' },
  { value: 'complicated', label: "It's Complicated" },
];

const PRIMARY_GOALS: { value: PrimaryGoal; label: string }[] = [
  { value: 'healing-breakup', label: 'Healing from a Breakup' },
  { value: 'dating-intention', label: 'Dating with Intention' },
  { value: 'improve-communication', label: 'Improve Communication' },
  { value: 'understand-patterns', label: 'Understand Patterns' },
];

export function ProfileScreen() {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: '',
    ageRange: '25-29',
    city: '',
    relationshipStatus: 'single',
    primaryGoal: 'dating-intention',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!session?.access_token) return;

    try {
      setIsLoading(true);
      const data = await getProfile(session.access_token);
      setProfile({
        name: data.name,
        ageRange: data.ageRange,
        city: data.city,
        relationshipStatus: data.relationshipStatus,
        primaryGoal: data.primaryGoal,
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      Alert.alert('Error', 'Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.access_token) return;

    // Validation
    if (!profile.name?.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return;
    }

    if (!profile.city?.trim()) {
      Alert.alert('Validation Error', 'Please enter your city.');
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile(profile, session.access_token);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your name"
            placeholderTextColor={colors.text.placeholder}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age Range</Text>
          <View style={styles.optionsContainer}>
            {AGE_RANGES.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  profile.ageRange === option.value && styles.optionSelected,
                ]}
                onPress={() => setProfile({ ...profile, ageRange: option.value })}
              >
                <Text
                  style={[
                    styles.optionText,
                    profile.ageRange === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={profile.city}
            onChangeText={(text) => setProfile({ ...profile, city: text })}
            placeholder="Enter your city"
            placeholderTextColor={colors.text.placeholder}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Relationship Status</Text>
          <View style={styles.optionsContainer}>
            {RELATIONSHIP_STATUSES.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  profile.relationshipStatus === option.value && styles.optionSelected,
                ]}
                onPress={() => setProfile({ ...profile, relationshipStatus: option.value })}
              >
                <Text
                  style={[
                    styles.optionText,
                    profile.relationshipStatus === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Primary Goal</Text>
          <View style={styles.optionsContainer}>
            {PRIMARY_GOALS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  profile.primaryGoal === option.value && styles.optionSelected,
                ]}
                onPress={() => setProfile({ ...profile, primaryGoal: option.value })}
              >
                <Text
                  style={[
                    styles.optionText,
                    profile.primaryGoal === option.value && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
  field: {
    marginBottom: spacing.xxl,
  },
  label: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: spacing.md,
  },
  input: {
    ...componentStyles.input,
    ...typography.body.medium,
    color: colors.text.primary,
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
