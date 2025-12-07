import * as Linking from 'expo-linking';
import { router } from 'expo-router';

/**
 * Deep Linking Configuration and Handlers
 * 
 * Supports:
 * - Notification deep links (check-ins, follow-ups)
 * - External deep links (email, password reset)
 * - Universal links (web to app)
 * 
 * URL Scheme: heylina://
 * 
 * Supported paths:
 * - heylina://chat - Open chat screen
 * - heylina://chat?prompt=<text> - Open chat with pre-filled prompt
 * - heylina://score - Open score detail screen
 * - heylina://history - Open conversation history
 * - heylina://settings - Open settings
 * - heylina://reset-password?token=<token> - Password reset flow
 */

export interface DeepLinkParams {
  path: string;
  queryParams?: Record<string, string>;
}

/**
 * Parse a deep link URL into path and query parameters
 */
export function parseDeepLink(url: string): DeepLinkParams | null {
  try {
    const parsed = Linking.parse(url);
    
    if (!parsed.path) {
      return null;
    }

    return {
      path: parsed.path,
      queryParams: parsed.queryParams as Record<string, string> | undefined,
    };
  } catch (error) {
    console.error('Failed to parse deep link:', url, error);
    return null;
  }
}

/**
 * Handle a deep link by navigating to the appropriate screen
 * Validates: Requirements 7.2 - Notification taps navigate with context
 */
export function handleDeepLink(url: string): boolean {
  const parsed = parseDeepLink(url);
  
  if (!parsed) {
    return false;
  }

  const { path, queryParams } = parsed;

  try {
    switch (path) {
      case 'chat':
        // Navigate to chat, optionally with a pre-filled prompt
        if (queryParams?.prompt) {
          // Store the prompt in a way the chat screen can access it
          router.push({
            pathname: '/(tabs)/chat',
            params: { prompt: queryParams.prompt },
          });
        } else {
          router.push('/(tabs)/chat');
        }
        return true;

      case 'score':
        // Navigate to score detail screen
        router.push('/(tabs)/' as any); // Dashboard shows score
        return true;

      case 'history':
        // Navigate to conversation history
        router.push('/(tabs)/explore');
        return true;

      case 'settings':
        // Navigate to settings
        router.push('/(tabs)/settings');
        return true;

      case 'reset-password':
        // Handle password reset flow
        if (queryParams?.token) {
          // Navigate to password reset screen with token
          // This would be implemented when password reset feature is added
          console.log('Password reset token:', queryParams.token);
        }
        return true;

      case 'verify-email':
        // Handle email verification
        if (queryParams?.token) {
          // Navigate to email verification screen
          console.log('Email verification token:', queryParams.token);
        }
        return true;

      default:
        console.warn('Unknown deep link path:', path);
        return false;
    }
  } catch (error) {
    console.error('Failed to handle deep link:', error);
    return false;
  }
}

/**
 * Create a deep link URL for a given path and parameters
 * Useful for generating notification deep links
 */
export function createDeepLink(path: string, params?: Record<string, string>): string {
  const url = Linking.createURL(path, {
    queryParams: params,
  });
  return url;
}

/**
 * Initialize deep linking listeners
 * Should be called once when the app starts
 */
export function initializeDeepLinking(): () => void {
  // Handle initial URL if app was opened via deep link
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log('App opened with URL:', url);
      handleDeepLink(url);
    }
  });

  // Listen for deep links while app is running
  const subscription = Linking.addEventListener('url', (event) => {
    console.log('Deep link received:', event.url);
    handleDeepLink(event.url);
  });

  // Return cleanup function
  return () => {
    subscription.remove();
  };
}

/**
 * Notification-specific deep link handlers
 * These create properly formatted deep links for different notification types
 */
export const notificationDeepLinks = {
  /**
   * Create a deep link for a check-in notification
   */
  checkIn: (prompt?: string): string => {
    return createDeepLink('chat', prompt ? { prompt } : undefined);
  },

  /**
   * Create a deep link for a follow-up notification
   */
  followUp: (conversationId: string, prompt: string): string => {
    return createDeepLink('chat', { 
      conversationId,
      prompt,
    });
  },

  /**
   * Create a deep link for a score update notification
   */
  scoreUpdate: (): string => {
    return createDeepLink('score');
  },

  /**
   * Create a deep link for a weekly reflection notification
   */
  weeklyReflection: (): string => {
    return createDeepLink('chat', { 
      prompt: 'Let\'s reflect on your week',
    });
  },
};

/**
 * External deep link handlers
 * For links from emails, web, etc.
 */
export const externalDeepLinks = {
  /**
   * Create a password reset deep link
   */
  passwordReset: (token: string): string => {
    return createDeepLink('reset-password', { token });
  },

  /**
   * Create an email verification deep link
   */
  emailVerification: (token: string): string => {
    return createDeepLink('verify-email', { token });
  },
};
