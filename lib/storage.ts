import { Platform } from 'react-native';

/**
 * Cross-platform secure storage utility
 * Uses expo-secure-store on native platforms (iOS/Android)
 * Uses localStorage on web platform
 */

const storage = {
  /**
   * Get an item from storage
   * @param key - The key to retrieve
   * @returns The value or null if not found
   */
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return globalThis?.localStorage?.getItem(key) ?? null;
      } catch {
        return null;
      }
    } else {
      const SecureStore = await import('expo-secure-store');
      return SecureStore.getItemAsync(key);
    }
  },

  /**
   * Set an item in storage
   * @param key - The key to store
   * @param value - The value to store
   */
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        globalThis?.localStorage?.setItem(key, value);
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
        throw error;
      }
    } else {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.setItemAsync(key, value);
    }
  },

  /**
   * Remove an item from storage
   * @param key - The key to remove
   */
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        globalThis?.localStorage?.removeItem(key);
      } catch (error) {
        console.error('Failed to remove from localStorage:', error);
      }
    } else {
      const SecureStore = await import('expo-secure-store');
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export default storage;
