import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/**
 * Network connectivity utilities
 * Provides hooks and functions for detecting and monitoring network status
 */

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
};

/**
 * Check current network connectivity status
 */
export async function checkNetworkStatus(): Promise<NetworkStatus> {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
  };
}

/**
 * Hook to monitor network connectivity changes
 * Returns current network status and updates when connectivity changes
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: true, // Assume connected initially
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    // Get initial state
    checkNetworkStatus().then(setStatus);

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return status;
}

/**
 * Wait for network connectivity to be restored
 * Resolves when network is available, or rejects after timeout
 */
export function waitForNetwork(timeoutMs: number = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      unsubscribe();
      reject(new Error('Network timeout'));
    }, timeoutMs);

    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      }
    });

    // Check immediately in case we're already connected
    checkNetworkStatus().then((status) => {
      if (status.isConnected && status.isInternetReachable) {
        clearTimeout(timeout);
        unsubscribe();
        resolve();
      }
    });
  });
}
