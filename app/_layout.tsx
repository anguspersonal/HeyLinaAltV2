import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Asset } from 'expo-asset';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/stores/auth';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const LayoutContent = () => {
  const { isReady, session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const destination = session ? '/(tabs)' : '/login';
    if (pathname !== destination) {
      router.replace(destination);
    }
  }, [isReady, session, pathname, router]);

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
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
};

const FONT_FILES = {
  Inter: require('../assets/fonts/Inter/Inter_18pt-Regular.ttf'),
  Montserrat: require('../assets/fonts/Montserrat/Montserrat-Regular.ttf'),
  MontserratAlternates: require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Regular.ttf'),
} as const;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts(Platform.OS === 'web' ? {} : FONT_FILES);

  useWebFontFaces(FONT_FILES);

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
