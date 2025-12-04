/**
 * useNotificationHandler Hook
 * Handles notification taps, dismissals, and badge updates
 */

import { setBadgeCount } from '@/services/notifications';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';

export interface NotificationData {
  type: 'check-in' | 'event-followup' | 'weekly-reflection' | 'score-update';
  context?: string;
  eventName?: string;
  score?: number;
  change?: number;
}

export function useNotificationHandler() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  /**
   * Handle notification received while app is in foreground
   */
  const handleNotificationReceived = async (
    notification: Notifications.Notification
  ) => {
    console.log('Notification received:', notification);
    
    // Increment badge count
    const currentBadge = await Notifications.getBadgeCountAsync();
    await setBadgeCount(currentBadge + 1);
  };

  /**
   * Handle user tapping on a notification
   */
  const handleNotificationResponse = async (
    response: Notifications.NotificationResponse
  ) => {
    const data = response.notification.request.content.data as NotificationData;
    
    console.log('Notification tapped:', data);

    // Clear badge when user interacts with notification
    await setBadgeCount(0);

    // Navigate based on notification type
    switch (data.type) {
      case 'check-in':
        // Navigate to chat with check-in context
        navigateToChat(data.context || 'daily check-in');
        break;

      case 'event-followup':
        // Navigate to chat with event follow-up context
        navigateToChat(`How did your ${data.eventName} go?`);
        break;

      case 'weekly-reflection':
        // Navigate to chat with weekly reflection context
        navigateToChat('weekly reflection');
        break;

      case 'score-update':
        // Navigate to score detail screen
        navigateToScore();
        break;

      default:
        // Default to chat screen
        navigateToChat();
        break;
    }
  };

  /**
   * Navigate to chat screen with optional context
   */
  const navigateToChat = (context?: string) => {
    try {
      // Navigate to chat tab
      router.push('/(tabs)/chat');
      
      // If context is provided, we could pre-fill the input or send a message
      // This would require additional state management in the chat screen
      if (context) {
        console.log('Chat context:', context);
        // TODO: Pass context to chat screen via params or global state
      }
    } catch (error) {
      console.error('Error navigating to chat:', error);
    }
  };

  /**
   * Navigate to score detail screen
   */
  const navigateToScore = () => {
    try {
      // Navigate to home tab (which shows the score)
      router.push('/(tabs)/');
    } catch (error) {
      console.error('Error navigating to score:', error);
    }
  };

  return {
    // Expose functions if needed for manual handling
    handleNotificationReceived,
    handleNotificationResponse,
  };
}
