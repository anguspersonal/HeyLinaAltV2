/**
 * Hook for supporting dynamic text sizing based on user's accessibility settings
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform, TextStyle } from 'react-native';

/**
 * Get the user's preferred content size category (iOS) or font scale (Android)
 */
export function useAccessibleFontSize() {
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    // Get initial font scale
    const getFontScale = async () => {
      if (Platform.OS === 'ios') {
        // iOS uses content size category
        try {
          const isEnabled = await AccessibilityInfo.isBoldTextEnabled();
          // On iOS, we can detect bold text but not the exact scale
          // The system automatically scales fonts, but we can adjust if needed
          setFontScale(isEnabled ? 1.1 : 1);
        } catch (error) {
          console.warn('Error getting accessibility info:', error);
        }
      } else {
        // Android uses font scale
        // The system automatically applies font scaling
        setFontScale(1);
      }
    };

    getFontScale();

    // Listen for changes (iOS only)
    if (Platform.OS === 'ios') {
      const subscription = AccessibilityInfo.addEventListener(
        'boldTextChanged',
        (isBoldTextEnabled) => {
          setFontScale(isBoldTextEnabled ? 1.1 : 1);
        }
      );

      return () => {
        subscription?.remove();
      };
    }
  }, []);

  return fontScale;
}

/**
 * Scale a font size based on accessibility settings
 */
export function scaleFont(baseFontSize: number, fontScale: number = 1): number {
  return Math.round(baseFontSize * fontScale);
}

/**
 * Create accessible text style with dynamic sizing
 */
export function createAccessibleTextStyle(
  baseStyle: TextStyle,
  fontScale: number = 1
): TextStyle {
  if (!baseStyle.fontSize) {
    return baseStyle;
  }

  return {
    ...baseStyle,
    fontSize: scaleFont(baseStyle.fontSize, fontScale),
    lineHeight: baseStyle.lineHeight 
      ? scaleFont(baseStyle.lineHeight, fontScale) 
      : undefined,
  };
}

/**
 * Hook to get accessible text styles
 */
export function useAccessibleTextStyle(baseStyle: TextStyle): TextStyle {
  const fontScale = useAccessibleFontSize();
  return createAccessibleTextStyle(baseStyle, fontScale);
}

/**
 * Check if reduce motion is enabled
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const checkReduceMotion = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setReduceMotion(isEnabled);
      } catch (error) {
        console.warn('Error checking reduce motion:', error);
      }
    };

    checkReduceMotion();

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return reduceMotion;
}

/**
 * Check if screen reader is enabled
 */
export function useScreenReader(): boolean {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const checkScreenReader = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setScreenReaderEnabled(isEnabled);
      } catch (error) {
        console.warn('Error checking screen reader:', error);
      }
    };

    checkScreenReader();

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setScreenReaderEnabled
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return screenReaderEnabled;
}
