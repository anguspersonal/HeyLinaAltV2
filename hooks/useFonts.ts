/**
 * Custom hook for loading fonts
 * Provides a reusable way to load and manage custom fonts across the app
 */

import { useFonts as useExpoFonts } from 'expo-font';
import { Platform } from 'react-native';

/**
 * Font file mappings for native platforms
 * 
 * IMPORTANT: Instrument Sans and Carattere fonts need to be downloaded from Google Fonts
 * See assets/fonts/FONT_SETUP_INSTRUCTIONS.md for download instructions
 * 
 * Until the fonts are added, the app will use Inter and Montserrat Alternates as fallbacks
 */
export const FONT_FILES = {
  // Using Inter as temporary fallback for Instrument Sans
  // TODO: Replace with actual Instrument Sans fonts once downloaded
  'InstrumentSans-Regular': require('../assets/fonts/Inter/Inter_18pt-Regular.ttf'),
  'InstrumentSans-Medium': require('../assets/fonts/Inter/Inter_18pt-Medium.ttf'),
  'InstrumentSans-SemiBold': require('../assets/fonts/Inter/Inter_18pt-SemiBold.ttf'),
  'InstrumentSans-Bold': require('../assets/fonts/Inter/Inter_18pt-Bold.ttf'),
  
  // Using Montserrat Alternates as temporary fallback for Carattere
  // TODO: Replace with actual Carattere font once downloaded
  'Carattere-Regular': require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Regular.ttf'),
  
  // Legacy fonts (keeping for backward compatibility)
  'Inter': require('../assets/fonts/Inter/Inter_18pt-Regular.ttf'),
  'Montserrat': require('../assets/fonts/Montserrat/Montserrat-Regular.ttf'),
  'MontserratAlternates': require('../assets/fonts/Montserrat_Alternates/MontserratAlternates-Regular.ttf'),
} as const;

/**
 * Font family name mappings for use in styles
 * These match the font family names defined in constants/theme.ts
 */
export const FONT_FAMILIES = {
  primary: 'InstrumentSans-Regular',
  primaryMedium: 'InstrumentSans-Medium',
  primarySemiBold: 'InstrumentSans-SemiBold',
  primaryBold: 'InstrumentSans-Bold',
  accent: 'Carattere-Regular',
  // Legacy
  inter: 'Inter',
  montserrat: 'Montserrat',
  montserratAlternates: 'MontserratAlternates',
} as const;

/**
 * Custom hook to load all required fonts
 * Returns loading state and error information
 * 
 * @returns {Object} Font loading state
 * @returns {boolean} loaded - Whether fonts are loaded
 * @returns {Error | null} error - Any error that occurred during loading
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { loaded, error } = useAppFonts();
 *   
 *   if (!loaded) {
 *     return <LoadingScreen />;
 *   }
 *   
 *   if (error) {
 *     console.error('Font loading error:', error);
 *   }
 *   
 *   return <MainApp />;
 * }
 * ```
 */
export function useAppFonts() {
  // On web, fonts are loaded via CSS @font-face rules
  // On native, fonts are loaded via expo-font
  const [loaded, error] = useExpoFonts(
    Platform.OS === 'web' ? {} : FONT_FILES
  );

  return { loaded, error };
}

/**
 * Helper function to get font family name with weight
 * Useful for applying different font weights in styles
 * 
 * @param weight - Font weight (400, 500, 600, 700)
 * @returns Font family name for the specified weight
 * 
 * @example
 * ```tsx
 * const styles = StyleSheet.create({
 *   heading: {
 *     fontFamily: getInstrumentSansFont(500),
 *     fontSize: 24,
 *   },
 * });
 * ```
 */
export function getInstrumentSansFont(weight: 400 | 500 | 600 | 700 = 400): string {
  switch (weight) {
    case 400:
      return FONT_FAMILIES.primary;
    case 500:
      return FONT_FAMILIES.primaryMedium;
    case 600:
      return FONT_FAMILIES.primarySemiBold;
    case 700:
      return FONT_FAMILIES.primaryBold;
    default:
      return FONT_FAMILIES.primary;
  }
}

/**
 * Helper function to get Carattere font family
 * 
 * @returns Font family name for Carattere
 * 
 * @example
 * ```tsx
 * const styles = StyleSheet.create({
 *   userName: {
 *     fontFamily: getCarattereFont(),
 *     fontSize: 56,
 *   },
 * });
 * ```
 */
export function getCarattereFont(): string {
  return FONT_FAMILIES.accent;
}
