import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FormWrapper } from '@/components/form-wrapper';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors, componentStyles, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/stores/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { status, error, session, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
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

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    const success = await signIn({ email: cleanedEmail, password });
    if (success) {
      router.replace('/(tabs)');
    }
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
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>
          Welcome back
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to continue your journey with Lina
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

          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
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
                Sign in
              </ThemedText>
            )}
          </Pressable>
        </FormWrapper>

        <Link href="/signup" style={styles.link}>
          <ThemedText style={styles.linkText}>
            Need to create an account?
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
    backgroundColor: colors.background.card, // Override to use card background instead of primary
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
