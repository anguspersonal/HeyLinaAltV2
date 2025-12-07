import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import { FormWrapper } from '@/components/form-wrapper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors, componentStyles, spacing, typography } from '@/constants/theme';
import storage from '@/lib/storage';

type AgeRange = '18-24' | '25-29' | '30-34' | '35-39' | '40+';
type RelationshipStatus = 'single' | 'dating' | 'in-relationship' | 'complicated';
type PrimaryGoal = 'healing-breakup' | 'dating-intention' | 'improve-communication' | 'understand-patterns';

interface ProfileData {
  name: string;
  ageRange: AgeRange | '';
  city: string;
  relationshipStatus: RelationshipStatus | '';
  primaryGoal: PrimaryGoal | '';
}

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

const PRIMARY_GOALS: { value: PrimaryGoal; label: string; description: string }[] = [
  { 
    value: 'healing-breakup', 
    label: 'Healing from a Breakup',
    description: 'Process emotions and move forward'
  },
  { 
    value: 'dating-intention', 
    label: 'Dating with Intention',
    description: 'Find meaningful connections'
  },
  { 
    value: 'improve-communication', 
    label: 'Improve Communication',
    description: 'Build healthier relationship patterns'
  },
  { 
    value: 'understand-patterns', 
    label: 'Understand My Patterns',
    description: 'Gain clarity on relationship dynamics'
  },
];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    ageRange: '',
    city: '',
    relationshipStatus: '',
    primaryGoal: '',
  });
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});

  const validateName = (name: string): boolean => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationErrors(prev => ({ ...prev, name: 'Name is required' }));
      return false;
    }
    if (trimmedName.length < 2) {
      setValidationErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };

  const validateCity = (city: string): boolean => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setValidationErrors(prev => ({ ...prev, city: 'City is required' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, city: undefined }));
    return true;
  };

  const validateAgeRange = (ageRange: string): boolean => {
    if (!ageRange) {
      setValidationErrors(prev => ({ ...prev, ageRange: 'Please select your age range' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, ageRange: undefined }));
    return true;
  };

  const validateRelationshipStatus = (status: string): boolean => {
    if (!status) {
      setValidationErrors(prev => ({ ...prev, relationshipStatus: 'Please select your relationship status' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, relationshipStatus: undefined }));
    return true;
  };

  const validatePrimaryGoal = (goal: string): boolean => {
    if (!goal) {
      setValidationErrors(prev => ({ ...prev, primaryGoal: 'Please select your primary goal' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, primaryGoal: undefined }));
    return true;
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    // Validate all fields
    const isNameValid = validateName(profileData.name);
    const isCityValid = validateCity(profileData.city);
    const isAgeRangeValid = validateAgeRange(profileData.ageRange);
    const isRelationshipStatusValid = validateRelationshipStatus(profileData.relationshipStatus);
    const isPrimaryGoalValid = validatePrimaryGoal(profileData.primaryGoal);

    if (!isNameValid || !isCityValid || !isAgeRangeValid || !isRelationshipStatusValid || !isPrimaryGoalValid) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Save profile data to backend/storage
      // For now, we'll just store it locally
      await storage.setItem('profileData', JSON.stringify({
        name: profileData.name.trim(),
        ageRange: profileData.ageRange,
        city: profileData.city.trim(),
        relationshipStatus: profileData.relationshipStatus,
        primaryGoal: profileData.primaryGoal,
      }));

      // Navigate to next onboarding step (expectation setting)
      router.push('/expectation-setting' as any);
    } catch (error) {
      console.error('Failed to save profile data:', error);
      // Show error to user
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (text: string) => {
    setProfileData(prev => ({ ...prev, name: text }));
    if (validationErrors.name) {
      setValidationErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleCityChange = (text: string) => {
    setProfileData(prev => ({ ...prev, city: text }));
    if (validationErrors.city) {
      setValidationErrors(prev => ({ ...prev, city: undefined }));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>
            Tell us about yourself
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            This helps Lina provide personalized guidance tailored to your situation
          </ThemedText>
        </View>

        <FormWrapper style={styles.form} onSubmit={handleSubmit}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>What's your name?</ThemedText>
            <TextInput
              autoCapitalize="words"
              autoComplete="name"
              placeholder="Your name"
              placeholderTextColor={colors.text.placeholder}
              style={[
                styles.input,
                validationErrors.name && styles.inputError
              ]}
              value={profileData.name}
              onChangeText={handleNameChange}
              editable={!loading}
            />
            {validationErrors.name && (
              <ThemedText style={styles.errorText}>{validationErrors.name}</ThemedText>
            )}
          </View>

          {/* Age Range Selection */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Age range</ThemedText>
            <View style={styles.optionGrid}>
              {AGE_RANGES.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.optionButton,
                    profileData.ageRange === option.value && styles.optionButtonSelected,
                    validationErrors.ageRange && !profileData.ageRange && styles.optionButtonError,
                  ]}
                  onPress={() => {
                    setProfileData(prev => ({ ...prev, ageRange: option.value }));
                    setValidationErrors(prev => ({ ...prev, ageRange: undefined }));
                  }}
                  disabled={loading}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      profileData.ageRange === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            {validationErrors.ageRange && (
              <ThemedText style={styles.errorText}>{validationErrors.ageRange}</ThemedText>
            )}
          </View>

          {/* City Input */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Where are you located?</ThemedText>
            <TextInput
              autoCapitalize="words"
              placeholder="City"
              placeholderTextColor={colors.text.placeholder}
              style={[
                styles.input,
                validationErrors.city && styles.inputError
              ]}
              value={profileData.city}
              onChangeText={handleCityChange}
              editable={!loading}
            />
            {validationErrors.city && (
              <ThemedText style={styles.errorText}>{validationErrors.city}</ThemedText>
            )}
          </View>

          {/* Relationship Status Selection */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Current relationship status</ThemedText>
            <View style={styles.optionList}>
              {RELATIONSHIP_STATUSES.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.optionButtonWide,
                    profileData.relationshipStatus === option.value && styles.optionButtonSelected,
                    validationErrors.relationshipStatus && !profileData.relationshipStatus && styles.optionButtonError,
                  ]}
                  onPress={() => {
                    setProfileData(prev => ({ ...prev, relationshipStatus: option.value }));
                    setValidationErrors(prev => ({ ...prev, relationshipStatus: undefined }));
                  }}
                  disabled={loading}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      profileData.relationshipStatus === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            {validationErrors.relationshipStatus && (
              <ThemedText style={styles.errorText}>{validationErrors.relationshipStatus}</ThemedText>
            )}
          </View>

          {/* Primary Goal Selection */}
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>What's your primary goal?</ThemedText>
            <View style={styles.optionList}>
              {PRIMARY_GOALS.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.goalCard,
                    profileData.primaryGoal === option.value && styles.goalCardSelected,
                    validationErrors.primaryGoal && !profileData.primaryGoal && styles.optionButtonError,
                  ]}
                  onPress={() => {
                    setProfileData(prev => ({ ...prev, primaryGoal: option.value }));
                    setValidationErrors(prev => ({ ...prev, primaryGoal: undefined }));
                  }}
                  disabled={loading}
                >
                  <ThemedText
                    style={[
                      styles.goalTitle,
                      profileData.primaryGoal === option.value && styles.goalTitleSelected,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.goalDescription,
                      profileData.primaryGoal === option.value && styles.goalDescriptionSelected,
                    ]}
                  >
                    {option.description}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            {validationErrors.primaryGoal && (
              <ThemedText style={styles.errorText}>{validationErrors.primaryGoal}</ThemedText>
            )}
          </View>

          <Pressable 
            style={[
              styles.button,
              loading && styles.buttonDisabled
            ]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background.primary} />
            ) : (
              <ThemedText style={styles.buttonText}>
                Continue
              </ThemedText>
            )}
          </Pressable>
        </FormWrapper>
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
  form: {
    gap: spacing.xxl,
  },
  inputContainer: {
    gap: spacing.md,
  },
  label: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
  },
  input: {
    ...componentStyles.input,
    fontSize: typography.body.medium.fontSize,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.background.card,
  },
  inputError: {
    borderColor: colors.accent.bronze,
  },
  errorText: {
    fontSize: typography.body.small.fontSize,
    color: colors.accent.bronze,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  optionList: {
    gap: spacing.md,
  },
  optionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: componentStyles.card.borderRadius,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.background.card,
    minWidth: 80,
    alignItems: 'center',
  },
  optionButtonWide: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: componentStyles.card.borderRadius,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.background.card,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: colors.accent.gold,
    backgroundColor: colors.background.cardSecondary,
  },
  optionButtonError: {
    borderColor: colors.accent.bronze,
  },
  optionText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
  },
  optionTextSelected: {
    color: colors.accent.lightGold,
    fontWeight: '500',
  },
  goalCard: {
    padding: spacing.lg,
    borderRadius: componentStyles.card.borderRadius,
    borderWidth: 1,
    borderColor: colors.ui.border,
    backgroundColor: colors.background.card,
    gap: spacing.xs,
  },
  goalCardSelected: {
    borderColor: colors.accent.gold,
    backgroundColor: colors.background.cardSecondary,
  },
  goalTitle: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.text.primary,
  },
  goalTitleSelected: {
    color: colors.accent.lightGold,
  },
  goalDescription: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.tertiary,
  },
  goalDescriptionSelected: {
    color: colors.text.secondary,
  },
  button: {
    ...componentStyles.button.primary,
    backgroundColor: colors.accent.warmGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.background.primary,
  },
});
