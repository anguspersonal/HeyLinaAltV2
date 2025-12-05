import { useCallback, useEffect, useState } from 'react';

import { createSessionMonitor, getTimeUntilExpiry, isSessionExpired } from '@/lib/tokenRefresh';
import { useAuth } from '@/stores/auth';

/**
 * Hook to monitor and handle token expiration
 * Automatically prompts for re-authentication when token expires
 */
export function useTokenRefresh() {
  const { session, bootstrap } = useAuth();
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  // Update expiry time
  useEffect(() => {
    if (!session) {
      setTimeUntilExpiry(null);
      setIsExpiringSoon(false);
      return;
    }

    const updateExpiry = () => {
      const time = getTimeUntilExpiry(session);
      setTimeUntilExpiry(time);
      setIsExpiringSoon(time !== null && time < 300); // Less than 5 minutes
    };

    updateExpiry();

    // Update every 30 seconds
    const interval = setInterval(updateExpiry, 30000);

    return () => clearInterval(interval);
  }, [session]);

  // Monitor session and handle expiration
  useEffect(() => {
    if (!session) {
      return;
    }

    const cleanup = createSessionMonitor(
      () => {
        console.log('Session expired, prompting for re-authentication');
        // The auth store will handle the state update via onAuthStateChange
        bootstrap();
      },
      60000 // Check every minute
    );

    return cleanup;
  }, [session, bootstrap]);

  const checkAndRefresh = useCallback(async () => {
    if (!session) {
      return false;
    }

    if (isSessionExpired(session, 60)) {
      // Session expired or expiring soon, trigger bootstrap to refresh
      await bootstrap();
      return true;
    }

    return false;
  }, [session, bootstrap]);

  return {
    timeUntilExpiry,
    isExpiringSoon,
    checkAndRefresh,
  };
}
