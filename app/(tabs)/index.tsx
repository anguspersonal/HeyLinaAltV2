import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/stores/auth';

export default function HomeScreen() {
  const { user, status, signOut } = useAuth();
  const handleSignOut = () => {
    signOut();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">HeyLina</ThemedText>
      <ThemedText type="subtitle" style={styles.subtitle}>
        {user ? `Signed in as ${user.email}` : 'You are signed in as a guest.'}
      </ThemedText>
      <ThemedText style={styles.status}>Session status: {status}</ThemedText>
      <Pressable style={styles.signOut} onPress={handleSignOut}>
        <ThemedText type="defaultSemiBold" style={styles.signOutText}>
          Sign out
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
  },
  status: {
    marginBottom: 32,
    color: '#606774',
  },
  signOut: {
    borderWidth: 1,
    borderColor: '#0A7EA4',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signOutText: {
    color: '#0A7EA4',
  },
});
