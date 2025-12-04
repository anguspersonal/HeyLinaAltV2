import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FONT_FILES, useAppFonts } from '@/hooks/useFonts';
import { AuthProvider, useAuth } from '@/stores/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const LayoutContent = () => {
  const { isReady, session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

  // Check if user has seen welcome screen
  useEffect(() => {
    const checkWelcomeStatus = async () => {
      try {
        const { getItem } = await import('expo-secure-store');
        const seen = await getItem('hasSeenWelcome');
        setHasSeenWelcome(seen === 'true');
      } catch (error) {
        // If we can't check, assume they haven't seen it
        setHasSeenWelcome(false);
      }
    };
    checkWelcomeStatus();
  }, []);

  useEffect(() => {
    if (!isReady || hasSeenWelcome === null) {
      return;
    }

    // If user hasn't seen welcome and is not authenticated, show welcome
    if (!hasSeenWelcome && !session && pathname !== '/welcome' && pathname !== '/signup' && pathname !== '/login') {
      router.replace('/welcome' as any);
      return;
    }

    // If user is authenticated and on auth screens, check if onboarding is complete
    if (session && (pathname === '/login' || pathname === '/signup' || pathname === '/welcome')) {
      // Check if onboarding is complete
      const checkOnboarding = async () => {
        try {
          const { getItem } = await import('expo-secure-store');
          const onboardingComplete = await getItem('onboardingCompleted');
          
          if (onboardingComplete === 'true') {
            router.replace('/(tabs)' as any);
          } else {
            // Check if profile setup is complete
            const profileData = await getItem('profileData');
            if (profileData) {
              router.replace('/expectation-setting' as any);
            } else {
              router.replace('/profile-setup' as any);
            }
          }
        } catch (error) {
          console.error('Failed to check onboarding status:', error);
          router.replace('/profile-setup' as any);
        }
      };
      checkOnboarding();
      return;
    }

    // If user is not authenticated and has seen welcome, go to login
    if (!session && hasSeenWelcome && pathname !== '/login' && pathname !== '/signup') {
      router.replace('/login');
      return;
    }
  }, [isReady, session, pathname, router, hasSeenWelcome]);

  if (!isReady) {
    return (
      <ThemedView style={styles.loader}>
        <ActivityIndicator size="large" color="#0A7EA4" />
        <ThemedText style={styles.loaderText}>Restoring your session…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="expectation-setting" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { loaded, error } = useAppFonts();

  useWebFontFaces(FONT_FILES);

  // Log font loading errors for debugging
  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <LayoutContent />
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 16,
    marginTop: 12,
  },
});

const FONT_FACE_STYLE_ID = 'heylina-web-font-faces';

const createFontFaceRule = (fontFamily: string, uri: string) =>
  `@font-face{font-family:"${fontFamily}";src:url("${uri}") format("truetype");font-display:swap;}`;

function useWebFontFaces(fontMap: Record<string, number>) {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    if (document.getElementById(FONT_FACE_STYLE_ID)) {
      return;
    }

    let styleElement: HTMLStyleElement | null = null;
    let isActive = true;

    const loadFonts = async () => {
      try {
        const cssLines = await Promise.all(
          Object.entries(fontMap).map(async ([fontFamily, assetModule]) => {
            const asset = Asset.fromModule(assetModule);
            await asset.downloadAsync();
            const uri = asset.localUri ?? asset.uri;
            return createFontFaceRule(fontFamily, uri);
          })
        );

        if (!isActive) {
          return;
        }

        styleElement = document.createElement('style');
        styleElement.id = FONT_FACE_STYLE_ID;
        styleElement.appendChild(document.createTextNode(cssLines.join('\n')));
        document.head?.appendChild(styleElement);
      } catch (error) {
        console.warn('Unable to preload web fonts:', error);
      }
    };

    void loadFonts();

    return () => {
      isActive = false;
      if (styleElement?.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [fontMap]);
}
