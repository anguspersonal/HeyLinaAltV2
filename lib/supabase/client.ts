import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

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

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
  {
    auth: {
      storage: secureStoreAdapter,
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
