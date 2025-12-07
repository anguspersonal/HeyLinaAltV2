/**
 * useNotificationPermissions Hook
 * Manages notification permission state and requests
 */

import {
    checkNotificationPermissions,
    requestNotificationPermissions,
} from '@/services/notifications';
import { useEffect, useState } from 'react';

export function useNotificationPermissions() {
  const [hasPermissions, setHasPermissions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      setIsLoading(true);
      const granted = await checkNotificationPermissions();
      setHasPermissions(granted);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setHasPermissions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    try {
      setIsRequesting(true);
      const granted = await requestNotificationPermissions();
      setHasPermissions(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      setHasPermissions(false);
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    hasPermissions,
    isLoading,
    isRequesting,
    requestPermissions,
    checkPermissions,
  };
}
