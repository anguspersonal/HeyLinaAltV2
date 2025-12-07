import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

import { useNetworkStatus } from '@/lib/network';

interface OfflineIndicatorProps {
  queueSize?: number;
}

/**
 * Offline indicator banner
 * Shows when device is offline and displays queued message count
 */
export function OfflineIndicator({ queueSize = 0 }: OfflineIndicatorProps) {
  const { isConnected, isInternetReachable } = useNetworkStatus();

  // Show indicator if not connected or internet not reachable
  const isOffline = !isConnected || isInternetReachable === false;

  if (!isOffline) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>📡</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>You're offline</Text>
          {queueSize > 0 && (
            <Text style={styles.subtitle}>
              {queueSize} {queueSize === 1 ? 'message' : 'messages'} queued
            </Text>
          )}
        </View>
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
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  textContainer: {
    alignItems: 'center',
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
});
