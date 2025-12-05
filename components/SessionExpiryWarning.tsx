import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { useAuth } from '@/stores/auth';

/**
 * Warning banner shown when session is about to expire
 * Allows user to refresh their session
 */
export function SessionExpiryWarning() {
  const { isExpiringSoon, timeUntilExpiry } = useTokenRefresh();
  const { bootstrap } = useAuth();

  if (!isExpiringSoon || timeUntilExpiry === null) {
    return null;
  }

  const minutes = Math.floor(timeUntilExpiry / 60);
  const seconds = timeUntilExpiry % 60;

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Session expiring soon</Text>
          <Text style={styles.subtitle}>
            {minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`} remaining
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={bootstrap}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CF802A',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
