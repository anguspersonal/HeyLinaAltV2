/**
 * Notifications Service
 * Handles notification permissions, scheduling, and configuration
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Configure notification handler behavior
 * This determines how notifications are displayed when the app is in foreground
 */
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (error) {
  // Silently handle errors in environments that don't support notifications (e.g., Expo Go)
  console.log('Notification handler not available in this environment');
}

/**
 * Request notification permissions from the user
 * @returns Promise<boolean> - true if permissions granted, false otherwise
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permissions not already granted, request them
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions denied');
      return false;
    }

    // Configure notification channels for Android
    if (Platform.OS === 'android') {
      await configureAndroidChannels();
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Check if notification permissions are currently granted
 * @returns Promise<boolean>
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification permissions:', error);
    return false;
  }
}

/**
 * Configure Android notification channels
 * Channels are required for Android 8.0+ to display notifications
 */
async function configureAndroidChannels(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    // Check-in notifications channel
    await Notifications.setNotificationChannelAsync('check-ins', {
      name: 'Check-ins',
      description: 'Daily and weekly check-in reminders from Lina',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#CEA869', // HeyLina gold color
      enableVibrate: true,
      enableLights: true,
      showBadge: true,
    });

    // Event follow-ups channel
    await Notifications.setNotificationChannelAsync('event-followups', {
      name: 'Event Follow-ups',
      description: 'Reminders to reflect after dates or events',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#CEA869',
      enableVibrate: true,
      enableLights: true,
      showBadge: true,
    });

    // Weekly reflections channel
    await Notifications.setNotificationChannelAsync('weekly-reflections', {
      name: 'Weekly Reflections',
      description: 'Weekly prompts to review your progress',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#CEA869',
      enableVibrate: true,
      enableLights: true,
      showBadge: true,
    });

    // Score updates channel
    await Notifications.setNotificationChannelAsync('score-updates', {
      name: 'Score Updates',
      description: 'Notifications when your emotional health score changes',
      importance: Notifications.AndroidImportance.LOW,
      sound: 'default',
      lightColor: '#CEA869',
      enableLights: true,
      showBadge: true,
    });

    console.log('Android notification channels configured');
  } catch (error) {
    console.error('Error configuring Android channels:', error);
  }
}

/**
 * Get the device push token for remote notifications
 * @returns Promise<string | null> - Push token or null if unavailable
 */
export async function getPushToken(): Promise<string | null> {
  try {
    const hasPermissions = await checkNotificationPermissions();
    if (!hasPermissions) {
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });

    return token.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
}

/**
 * Open device settings for the app
 * Useful when user needs to manually enable permissions
 */
export async function openNotificationSettings(): Promise<void> {
  try {
    if (Platform.OS === 'ios') {
      // On iOS, we can't directly open notification settings
      // but we can open the app settings
      await Notifications.getPermissionsAsync();
    } else if (Platform.OS === 'android') {
      // On Android, we can open the notification settings
      await Notifications.getPermissionsAsync();
    }
  } catch (error) {
    console.error('Error opening notification settings:', error);
  }
}

/**
 * Get current notification badge count
 * @returns Promise<number>
 */
export async function getBadgeCount(): Promise<number> {
  try {
    return await Notifications.getBadgeCountAsync();
  } catch (error) {
    console.error('Error getting badge count:', error);
    return 0;
  }
}

/**
 * Set notification badge count
 * @param count - Number to display on app icon badge
 */
export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('Error setting badge count:', error);
  }
}

/**
 * Clear all delivered notifications
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    await Notifications.dismissAllNotificationsAsync();
    await setBadgeCount(0);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}

/**
 * Notification scheduling types
 */
export interface NotificationScheduleSettings {
  enabled: boolean;
  checkIns: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'custom';
    time: string; // HH:MM format
    days?: number[]; // 0-6 for custom frequency (0 = Sunday)
  };
  eventFollowUps: boolean;
  weeklyReflections: boolean;
  scoreUpdates: boolean;
}

/**
 * Schedule check-in notifications based on user preferences
 * @param settings - Notification settings from user preferences
 */
export async function scheduleCheckInNotifications(
  settings: NotificationScheduleSettings
): Promise<void> {
  try {
    // Cancel existing check-in notifications
    await cancelCheckInNotifications();

    if (!settings.enabled || !settings.checkIns.enabled) {
      return;
    }

    const [hours, minutes] = settings.checkIns.time.split(':').map(Number);

    if (settings.checkIns.frequency === 'daily') {
      // Schedule daily notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time to check in with Lina 💛',
          body: 'How are you feeling today? Take a moment to reflect.',
          data: { type: 'check-in', context: 'daily' },
          sound: 'default',
          badge: 1,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
          channelId: 'check-ins',
        },
      });
    } else if (settings.checkIns.frequency === 'weekly') {
      // Schedule weekly notification (default to Monday)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Weekly reflection with Lina 💛',
          body: 'Let\'s look back at your week together.',
          data: { type: 'check-in', context: 'weekly' },
          sound: 'default',
          badge: 1,
        },
        trigger: {
          weekday: 2, // Monday (1 = Sunday, 2 = Monday, etc.)
          hour: hours,
          minute: minutes,
          repeats: true,
          channelId: 'check-ins',
        },
      });
    } else if (settings.checkIns.frequency === 'custom' && settings.checkIns.days) {
      // Schedule notifications for custom days
      for (const day of settings.checkIns.days) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Time to check in with Lina 💛',
            body: 'How are you feeling today? Take a moment to reflect.',
            data: { type: 'check-in', context: 'custom' },
            sound: 'default',
            badge: 1,
          },
          trigger: {
            weekday: day + 1, // expo-notifications uses 1-7 (1 = Sunday)
            hour: hours,
            minute: minutes,
            repeats: true,
            channelId: 'check-ins',
          },
        });
      }
    }

    console.log('Check-in notifications scheduled');
  } catch (error) {
    console.error('Error scheduling check-in notifications:', error);
    throw error;
  }
}

/**
 * Cancel all check-in notifications
 */
export async function cancelCheckInNotifications(): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    // Cancel notifications with check-in type
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === 'check-in') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    console.log('Check-in notifications cancelled');
  } catch (error) {
    console.error('Error cancelling check-in notifications:', error);
  }
}

/**
 * Schedule an event follow-up notification
 * @param eventName - Name of the event (e.g., "date", "important conversation")
 * @param followUpDate - When to send the follow-up (Date object)
 */
export async function scheduleEventFollowUp(
  eventName: string,
  followUpDate: Date
): Promise<string | null> {
  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: `How did your ${eventName} go? 💛`,
        body: 'Lina would love to hear about it.',
        data: { type: 'event-followup', eventName },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        date: followUpDate,
        channelId: 'event-followups',
      },
    });

    console.log(`Event follow-up scheduled for ${eventName}`);
    return identifier;
  } catch (error) {
    console.error('Error scheduling event follow-up:', error);
    return null;
  }
}

/**
 * Schedule weekly reflection notification
 * @param enabled - Whether weekly reflections are enabled
 */
export async function scheduleWeeklyReflection(enabled: boolean): Promise<void> {
  try {
    // Cancel existing weekly reflection notifications
    await cancelWeeklyReflections();

    if (!enabled) {
      return;
    }

    // Schedule for Sunday evening at 7 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time for your weekly reflection 💛',
        body: 'Let\'s review your emotional journey this week.',
        data: { type: 'weekly-reflection' },
        sound: 'default',
        badge: 1,
      },
      trigger: {
        weekday: 1, // Sunday
        hour: 19, // 7 PM
        minute: 0,
        repeats: true,
        channelId: 'weekly-reflections',
      },
    });

    console.log('Weekly reflection notification scheduled');
  } catch (error) {
    console.error('Error scheduling weekly reflection:', error);
  }
}

/**
 * Cancel weekly reflection notifications
 */
export async function cancelWeeklyReflections(): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.type === 'weekly-reflection') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    console.log('Weekly reflection notifications cancelled');
  } catch (error) {
    console.error('Error cancelling weekly reflections:', error);
  }
}

/**
 * Send a score update notification
 * @param newScore - The new emotional health score
 * @param change - The change from previous score (positive or negative)
 */
export async function sendScoreUpdateNotification(
  newScore: number,
  change: number
): Promise<void> {
  try {
    const changeText = change > 0 ? `up ${change} points` : `down ${Math.abs(change)} points`;
    const emoji = change > 0 ? '📈' : '📊';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Your emotional health score is ${changeText} ${emoji}`,
        body: `Your new score is ${newScore}. Tap to see insights.`,
        data: { type: 'score-update', score: newScore, change },
        sound: 'default',
        badge: 1,
      },
      trigger: null, // Send immediately
    });

    console.log('Score update notification sent');
  } catch (error) {
    console.error('Error sending score update notification:', error);
  }
}

/**
 * Cancel a specific scheduled notification
 * @param identifier - The notification identifier returned when scheduling
 */
export async function cancelNotification(identifier: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    console.log(`Notification ${identifier} cancelled`);
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All scheduled notifications cancelled');
  } catch (error) {
    console.error('Error cancelling all notifications:', error);
  }
}

/**
 * Get all scheduled notifications
 * @returns Promise<Notifications.NotificationRequest[]>
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
}
