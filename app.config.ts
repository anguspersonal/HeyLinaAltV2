import 'dotenv/config';
import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Supabase credentials missing. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return {
    ...config,
    name: config.name ?? 'HeyLina',
    slug: config.slug ?? 'heylina',
    scheme: 'heylina',
    extra: {
      ...config.extra,
      supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      },
      apiBaseUrl,
    },
  } as ExpoConfig;
};
