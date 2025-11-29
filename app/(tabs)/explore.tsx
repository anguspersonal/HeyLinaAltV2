import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/stores/auth';

export default function ExploreScreen() {
  const { user, session } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Supabase Auth</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Short-lived Supabase sessions keep chat secure while letting Lina connect fast.
        </ThemedText>
        <View style={styles.card}>
          <ThemedText type="defaultSemiBold">Current user</ThemedText>
          <ThemedText type="default" style={styles.cardDetail}>
            {user ? user.email : 'No user is signed in.'}
          </ThemedText>
          <ThemedText type="defaultSemiBold">Session expires</ThemedText>
          <ThemedText type="default" style={styles.cardDetail}>
            {session?.expires_at
              ? new Date(session.expires_at * 1000).toLocaleString()
              : 'No active session'}
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="defaultSemiBold">Refresh logic</ThemedText>
          <ThemedText type="default" style={styles.cardDetail}>
            Supabase auto-refreshes tokens, and we reconcile on foreground transitions to keep
            everything in sync.
          </ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText type="defaultSemiBold">Secure storage</ThemedText>
          <ThemedText type="default" style={styles.cardDetail}>
            Sessions live in Expo SecureStore and are cleared from this device on logout.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  subtitle: {
    color: '#4A4F5F',
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  cardDetail: {
    marginTop: 4,
    marginBottom: 8,
  },
});
