import { Link, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/stores/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const { status, error, session, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attempted, setAttempted] = useState(false);

  const loading = status === 'loading';

  useEffect(() => {
    if (session) {
      router.replace('/(tabs)');
    }
  }, [session, router]);

  const buttonText = useMemo(() => (loading ? 'Creating account…' : 'Create account'), [loading]);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }
    setAttempted(true);
    const cleanedEmail = email.trim().toLowerCase();
    const success = await signUp({ email: cleanedEmail, password });
    if (success) {
      router.replace('/(tabs)');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Create your account
      </ThemedText>
      <ThemedText type="default" style={styles.subtitle}>
        Sign up with a secure email and password so we can keep your chat safe.
      </ThemedText>

      <View style={styles.form}>
        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        {error && attempted ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              {buttonText}
            </ThemedText>
          )}
        </Pressable>
      </View>

      <Link href="/login" style={styles.link}>
        <ThemedText type="link">Already have an account?</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
    color: '#4A4F5F',
  },
  form: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D2D6DB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#F7F7F8',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#0A7EA4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  error: {
    color: '#C72C41',
    marginTop: 4,
  },
  link: {
    marginTop: 24,
    alignSelf: 'center',
  },
});
