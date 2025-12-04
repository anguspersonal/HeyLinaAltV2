import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FormWrapper } from '@/components/form-wrapper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors, componentStyles, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/stores/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const { status, error, session, signUp, notification } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const loading = status === 'loading';

  useEffect(() => {
    if (session) {
      router.replace('/(tabs)');
    }
  }, [session, router]);

  const validateEmail = (emailValue: string): boolean => {
    const trimmedEmail = emailValue.trim();
    if (!trimmedEmail) {
      setValidationErrors(prev => ({ ...prev, email: 'Email is required' }));
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setValidationErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, email: undefined }));
    return true;
  };

  const validatePassword = (passwordValue: string): boolean => {
    if (!passwordValue) {
      setValidationErrors(prev => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    if (passwordValue.length < 6) {
      setValidationErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, password: undefined }));
    return true;
  };

  const validateConfirmPassword = (confirmPasswordValue: string): boolean => {
    if (!confirmPasswordValue) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }));
      return false;
    }
    if (confirmPasswordValue !== password) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
    return true;
  };

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    const result = await signUp({ email: cleanedEmail, password });
    
    if (!result.success) {
      return;
    }
    
    // If email confirmation is required, stay on this screen to show the notification
    if (result.requiresConfirmation) {
      return;
    }
    
    // Otherwise, navigate to profile setup
    router.replace('/profile-setup' as any);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    // Clear validation error when user starts typing
    if (validationErrors.email) {
      setValidationErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    // Clear validation error when user starts typing
    if (validationErrors.password) {
      setValidationErrors(prev => ({ ...prev, password: undefined }));
    }
    // Also revalidate confirm password if it's been filled
    if (confirmPassword && text !== confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else if (confirmPassword && text === confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    // Clear validation error when user starts typing
    if (validationErrors.confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>
          Create your account
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign up with a secure email and password so we can keep your conversations with Lina safe
        </ThemedText>

        <FormWrapper style={styles.form} onSubmit={handleSubmit}>
          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor={colors.text.placeholder}
              style={[
                styles.input,
                validationErrors.email && styles.inputError
              ]}
              value={email}
              onChangeText={handleEmailChange}
              editable={!loading}
            />
            {validationErrors.email && (
              <ThemedText style={styles.errorText}>{validationErrors.email}</ThemedText>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              placeholder="Password"
              placeholderTextColor={colors.text.placeholder}
              secureTextEntry
              style={[
                styles.input,
                validationErrors.password && styles.inputError
              ]}
              value={password}
              onChangeText={handlePasswordChange}
              editable={!loading}
            />
            {validationErrors.password && (
              <ThemedText style={styles.errorText}>{validationErrors.password}</ThemedText>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              placeholder="Confirm Password"
              placeholderTextColor={colors.text.placeholder}
              secureTextEntry
              style={[
                styles.input,
                validationErrors.confirmPassword && styles.inputError
              ]}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              editable={!loading}
            />
            {validationErrors.confirmPassword && (
              <ThemedText style={styles.errorText}>{validationErrors.confirmPassword}</ThemedText>
            )}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {notification && (
            <View style={styles.notificationContainer}>
              <ThemedText style={styles.notificationText}>{notification}</ThemedText>
            </View>
          )}

          <Pressable 
            style={[
              styles.button,
              loading && styles.buttonDisabled
            ]} 
            onPress={handleSubmit} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.text.primary} />
            ) : (
              <ThemedText style={styles.buttonText}>
                Create account
              </ThemedText>
            )}
          </Pressable>
        </FormWrapper>

        <Link href="/login" style={styles.link}>
          <ThemedText style={styles.linkText}>
            Already have an account?
          </ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: spacing.xxl,
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
    fontWeight: typography.body.medium.fontWeight,
    color: colors.text.secondary,
    marginBottom: spacing.xxxl,
  },
  form: {
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
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
  errorContainer: {
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: typography.body.small.fontSize,
    color: colors.accent.bronze,
    marginTop: spacing.xs,
  },
  notificationContainer: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background.cardSecondary,
    borderRadius: componentStyles.card.borderRadius,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.lightGold,
  },
  notificationText: {
    fontSize: typography.body.small.fontSize,
    color: colors.accent.lightGold,
    lineHeight: typography.body.small.lineHeight,
  },
  button: {
    ...componentStyles.button.primary,
    backgroundColor: colors.accent.warmGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    ...componentStyles.card.shadowColor && {
      shadowColor: componentStyles.card.shadowColor,
      shadowOffset: componentStyles.card.shadowOffset,
      shadowOpacity: componentStyles.card.shadowOpacity,
      shadowRadius: componentStyles.card.shadowRadius,
      elevation: componentStyles.card.elevation,
    },
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.background.primary,
  },
  link: {
    marginTop: spacing.xl,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.accent.lightGold,
    textDecorationLine: 'underline',
  },
});
