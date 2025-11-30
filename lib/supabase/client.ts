import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseConfig = Constants.expoConfig?.extra?.supabase ?? {};
const supabaseUrl = supabaseConfig.url ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = supabaseConfig.anonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials are missing from `app.config.ts`. Auth flows will fail until you provide them.'
  );
}

const secureStoreAdapter = {
  getItem: async (key: string) => SecureStore.getItemAsync(key),
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value, {
      keychainService: 'heylina.supabase.auth',
    });
  },
  removeItem: async (key: string) => SecureStore.deleteItemAsync(key),
};

const browserStorageAdapter = {
  getItem: async (key: string) => {
    try {
      return globalThis?.localStorage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      globalThis?.localStorage?.setItem(key, value);
    } catch {
      // ignore write failures (e.g., storage disabled)
    }
  },
  removeItem: async (key: string) => {
    try {
      globalThis?.localStorage?.removeItem(key);
    } catch {
      // ignore remove failures
    }
  },
};

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: {
      storage: Platform.OS === 'web' ? browserStorageAdapter : secureStoreAdapter,
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
