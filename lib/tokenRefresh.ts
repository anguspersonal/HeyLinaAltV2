import type { Session } from '@supabase/supabase-js';

import { supabase } from './supabase/client';

/**
 * Token refresh utilities
 * Validates: Requirements 11.4 - Detect expired tokens and refresh automatically
 */

export interface TokenRefreshResult {
  success: boolean;
  session: Session | null;
  error?: string;
}

/**
 * Check if a session is expired or about to expire
 * @param session - The session to check
 * @param bufferSeconds - Consider expired if expiring within this many seconds (default: 60)
 */
export function isSessionExpired(session: Session | null, bufferSeconds: number = 60): boolean {
  if (!session?.expires_at) {
    return true;
  }

  const expiresAt = session.expires_at * 1000; // Convert to milliseconds
  const now = Date.now();
  const buffer = bufferSeconds * 1000;

  return expiresAt - now < buffer;
}

/**
 * Get time until session expires in seconds
 */
export function getTimeUntilExpiry(session: Session | null): number | null {
  if (!session?.expires_at) {
    return null;
  }

  const expiresAt = session.expires_at * 1000;
  const now = Date.now();
  const timeUntilExpiry = Math.floor((expiresAt - now) / 1000);

  return Math.max(0, timeUntilExpiry);
}

/**
 * Attempt to refresh the session
 */
export async function refreshSession(): Promise<TokenRefreshResult> {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('Token refresh failed:', error.message);
      return {
        success: false,
        session: null,
        error: error.message,
      };
    }

    if (!data.session) {
      return {
        success: false,
        session: null,
        error: 'No session returned from refresh',
      };
    }

    return {
      success: true,
      session: data.session,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during token refresh';
    console.error('Token refresh error:', message);
    return {
      success: false,
      session: null,
      error: message,
    };
  }
}

/**
 * Ensure session is valid, refreshing if necessary
 * Returns the current valid session or null if refresh fails
 */
export async function ensureValidSession(): Promise<Session | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return null;
    }

    // Check if session is expired or about to expire
    if (isSessionExpired(session, 300)) { // 5 minute buffer
      console.log('Session expiring soon, refreshing...');
      const result = await refreshSession();
      return result.session;
    }

    return session;
  } catch (error) {
    console.error('Error ensuring valid session:', error);
    return null;
  }
}

/**
 * Get a valid access token, refreshing if necessary
 */
export async function getValidAccessToken(): Promise<string | null> {
  const session = await ensureValidSession();
  return session?.access_token ?? null;
}

/**
 * Create a session monitor that checks for expiration periodically
 * Returns a cleanup function to stop monitoring
 */
export function createSessionMonitor(
  onExpired: () => void,
  checkIntervalMs: number = 60000 // Check every minute
): () => void {
  let intervalId: NodeJS.Timeout | null = null;
  let isActive = true;

  const checkSession = async () => {
    if (!isActive) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        onExpired();
        return;
      }

      // If session is expired or expiring soon, try to refresh
      if (isSessionExpired(session, 300)) {
        const result = await refreshSession();
        
        if (!result.success) {
          onExpired();
        }
      }
    } catch (error) {
      console.error('Session monitor error:', error);
    }
  };

  // Start monitoring
  intervalId = setInterval(checkSession, checkIntervalMs);

  // Initial check
  void checkSession();

  // Return cleanup function
  return () => {
    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
}
