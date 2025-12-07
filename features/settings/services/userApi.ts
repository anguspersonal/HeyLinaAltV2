/**
 * User API Service
 * Handles user profile, settings, and account management operations
 */

import { supabase } from '@/lib/supabase/client';
import type { NotificationSettings, UserProfile } from '../types';

/**
 * Get user profile information
 */
export async function getProfile(accessToken: string): Promise<UserProfile> {
  return retryWithBackoff(
    async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .single();

      if (error) {
        throw new Error(`Failed to fetch profile: ${error.message}`);
      }

      return data as UserProfile;
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 10000,
    }
  );
}

/**
 * Update user profile information
 */
export async function updateProfile(
  profile: Partial<UserProfile>,
  accessToken: string
): Promise<UserProfile> {
  return retryWithBackoff(
    async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      return data as UserProfile;
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 10000,
    }
  );
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(
  settings: NotificationSettings,
  accessToken: string
): Promise<void> {
  return retryWithBackoff(
    async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw new Error(`Failed to update notification settings: ${error.message}`);
      }
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 10000,
    }
  );
}

/**
 * Get notification settings
 */
export async function getNotificationSettings(
  accessToken: string
): Promise<NotificationSettings> {
  return retryWithBackoff(
    async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(`Failed to fetch notification settings: ${error.message}`);
      }

      // Return default settings if none exist
      if (!data) {
        return {
          enabled: true,
          checkIns: {
            enabled: false,
            frequency: 'daily',
            time: '09:00',
          },
          eventFollowUps: true,
          weeklyReflections: true,
          scoreUpdates: true,
        };
      }

      return data as NotificationSettings;
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 10000,
    }
  );
}

/**
 * Request data export
 */
export async function requestDataExport(accessToken: string): Promise<{ exportId: string }> {
  return retryWithBackoff(
    async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Call edge function to initiate data export
      const { data, error } = await supabase.functions.invoke('request-data-export', {
        body: { userId: user.id },
      });

      if (error) {
        throw new Error(`Failed to request data export: ${error.message}`);
      }

      return { exportId: data.exportId };
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 15000, // Longer timeout for data export
    }
  );
}

/**
 * Delete user account
 */
export async function deleteAccount(accessToken: string): Promise<void> {
  return retryWithBackoff(
    async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Call edge function to handle account deletion
      const { error } = await supabase.functions.invoke('delete-account', {
        body: { userId: user.id },
      });

      if (error) {
        throw new Error(`Failed to delete account: ${error.message}`);
      }

      // Sign out after successful deletion
      await supabase.auth.signOut();
    },
    {
      maxRetries: 2,
      baseDelay: 1000,
      timeout: 15000, // Longer timeout for account deletion
    }
  );
}
