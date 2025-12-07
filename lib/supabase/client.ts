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
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value, {
      keychainService: 'heylina.supabase.auth',
    });
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const browserStorageAdapter = {
  getItem: (key: string) => {
    try {
      return Promise.resolve(globalThis?.localStorage?.getItem(key) ?? null);
    } catch {
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string) => {
    try {
      globalThis?.localStorage?.setItem(key, value);
      return Promise.resolve();
    } catch {
      // ignore write failures (e.g., storage disabled)
      return Promise.resolve();
    }
  },
  removeItem: (key: string) => {
    try {
      globalThis?.localStorage?.removeItem(key);
      return Promise.resolve();
    } catch {
      // ignore remove failures
      return Promise.resolve();
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
