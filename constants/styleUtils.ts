/**
 * HeyLina Style Utilities
 * Reusable helper functions for gradients, shadows, glows, and responsive sizing
 */

import { Dimensions, TextStyle, ViewStyle } from 'react-native';
import { blur, colors, layout, spacing } from './theme';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Gradient Generator Functions
 * Note: React Native doesn't support CSS gradients natively.
 * These functions return configuration objects for use with libraries like react-native-linear-gradient
 * or expo-linear-gradient
 */

/**
 * Score Circle Conic Gradient Configuration
 * Creates the golden conic gradient used for score visualizations
 */
export const scoreCircleGradient = {
  colors: [
    colors.accent.gold,      // #CEA869 at -90.29deg
    '#E6D8DA',               // at 88.27deg
    '#EAE8B6',               // at 115.96deg
    colors.accent.lightGold, // #F0FF80 at 148.83deg
    '#BBB34D',               // at 179.42deg
    colors.accent.olive,     // #A18D34 at 203.98deg
    '#BF9F58',               // at 243.43deg
    colors.accent.gold,      // #CEA869 at 269.71deg
    '#E6D8DA',               // at 448.27deg
  ],
  // For libraries that support angle-based gradients
  type: 'conic' as const,
  angle: 180,
};

/**
 * Input Glow Conic Gradient Configuration
 * Creates the golden glow effect for input fields
 */
export const inputGlowGradient = {
  colors: [
    colors.accent.gold,      // #CEA869 at 0deg
    colors.accent.lightGold, // #F0FF80 at 76.15deg
    colors.accent.paleYellow,// #FDF3D8 at 203.48deg
    colors.accent.gold,      // #CEA869 at 360deg
  ],
  type: 'conic' as const,
  angle: 90,
  blur: blur.medium,
};

/**
 * Creates a linear gradient configuration
 * @param colors - Array of color stops
 * @param angle - Gradient angle in degrees (0 = left to right, 90 = bottom to top)
 * @returns Gradient configuration object
 */
export const createLinearGradient = (
  colors: string[],
  angle: number = 0
): {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
  locations?: number[];
} => {
  // Convert angle to start/end coordinates for React Native
  const angleRad = (angle * Math.PI) / 180;
  const start = {
    x: Math.cos(angleRad + Math.PI) / 2 + 0.5,
    y: Math.sin(angleRad + Math.PI) / 2 + 0.5,
  };
  const end = {
    x: Math.cos(angleRad) / 2 + 0.5,
    y: Math.sin(angleRad) / 2 + 0.5,
  };

  return {
    colors,
    start,
    end,
  };
};

/**
 * Header Warm Gradient Configuration
 * Used for dashboard header backgrounds
 */
export const headerWarmGradient = createLinearGradient(
  ['#371904', '#4C2D11'],
  209.7
);

/**
 * Header Light Gradient Configuration
 * Used for dashboard header overlays
 */
export const headerLightGradient = createLinearGradient(
  [colors.accent.tan, colors.accent.cream],
  107.08
);

/**
 * Header Olive Gradient Configuration
 * Used for dashboard header depth
 */
export const headerOliveGradient = createLinearGradient(
  [colors.accent.olive, '#323A2A'],
  236.17
);

/**
 * Bottom Fade Gradient Configuration
 * Creates fade effect at bottom of scrollable content
 */
export const bottomFadeGradient = createLinearGradient(
  ['rgba(9, 7, 10, 0)', colors.background.overlay],
  180
);

/**
 * User Message Bubble Gradient
 * Golden gradient for user messages
 */
export const userMessageGradient = createLinearGradient(
  [colors.accent.warmGold, colors.accent.yellow],
  135
);

/**
 * Shadow and Glow Effect Utilities
 */

/**
 * Creates a standard card shadow style
 * @returns Shadow style object for React Native
 */
export const createCardShadow = (): ViewStyle => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.5,
  shadowRadius: 7.3,
  elevation: 5, // Android shadow
});

/**
 * Creates a glow effect style (for use with blur views or similar)
 * @param color - The glow color
 * @param intensity - Blur intensity (default: medium)
 * @returns Style configuration for glow effect
 */
export const createGlowEffect = (
  color: string,
  intensity: number = blur.medium
): {
  color: string;
  blur: number;
  opacity: number;
} => ({
  color,
  blur: intensity,
  opacity: 0.8,
});

/**
 * Creates a subtle shadow for elevated elements
 * @returns Shadow style object
 */
export const createSubtleShadow = (): ViewStyle => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 2,
});

/**
 * Creates a strong shadow for prominent elements
 * @returns Shadow style object
 */
export const createStrongShadow = (): ViewStyle => ({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.7,
  shadowRadius: 12,
  elevation: 8,
});

/**
 * Creates a golden glow effect configuration
 * Used for input fields and special UI elements
 */
export const createGoldenGlow = (): {
  gradient: typeof inputGlowGradient;
  blur: number;
  opacity: number;
} => ({
  gradient: inputGlowGradient,
  blur: blur.medium,
  opacity: 0.6,
});

/**
 * Responsive Sizing Helpers
 */

/**
 * Scales a size value based on screen width
 * @param size - Base size (designed for 375px width)
 * @param baseWidth - Base screen width (default: 375)
 * @returns Scaled size for current screen
 */
export const scaleSize = (size: number, baseWidth: number = layout.screenWidth): number => {
  return (SCREEN_WIDTH / baseWidth) * size;
};

/**
 * Scales font size responsively
 * @param fontSize - Base font size
 * @returns Scaled font size
 */
export const scaleFontSize = (fontSize: number): number => {
  return scaleSize(fontSize);
};

/**
 * Scales spacing value responsively
 * @param space - Base spacing value
 * @returns Scaled spacing
 */
export const scaleSpacing = (space: number): number => {
  return scaleSize(space);
};

/**
 * Gets responsive width as percentage of screen
 * @param percentage - Percentage of screen width (0-100)
 * @returns Width in pixels
 */
export const getResponsiveWidth = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * Gets responsive height as percentage of screen
 * @param percentage - Percentage of screen height (0-100)
 * @returns Height in pixels
 */
export const getResponsiveHeight = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Checks if device is a small screen (width < 375px)
 * @returns True if small screen
 */
export const isSmallScreen = (): boolean => {
  return SCREEN_WIDTH < 375;
};

/**
 * Checks if device is a large screen (width >= 414px)
 * @returns True if large screen
 */
export const isLargeScreen = (): boolean => {
  return SCREEN_WIDTH >= 414;
};

/**
 * Gets adaptive spacing based on screen size
 * @param small - Spacing for small screens
 * @param medium - Spacing for medium screens
 * @param large - Spacing for large screens
 * @returns Appropriate spacing for current screen
 */
export const getAdaptiveSpacing = (
  small: number,
  medium: number,
  large: number
): number => {
  if (isSmallScreen()) return small;
  if (isLargeScreen()) return large;
  return medium;
};

/**
 * Gets adaptive font size based on screen size
 * @param small - Font size for small screens
 * @param medium - Font size for medium screens
 * @param large - Font size for large screens
 * @returns Appropriate font size for current screen
 */
export const getAdaptiveFontSize = (
  small: number,
  medium: number,
  large: number
): number => {
  if (isSmallScreen()) return small;
  if (isLargeScreen()) return large;
  return medium;
};

/**
 * Clamps a value between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Interpolates between two values based on a factor
 * @param start - Start value
 * @param end - End value
 * @param factor - Interpolation factor (0-1)
 * @returns Interpolated value
 */
export const interpolate = (start: number, end: number, factor: number): number => {
  return start + (end - start) * clamp(factor, 0, 1);
};

/**
 * Layout Helpers
 */

/**
 * Creates a centered container style
 * @returns Style object for centered content
 */
export const createCenteredContainer = (): ViewStyle => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

/**
 * Creates a full-width card style with standard padding
 * @returns Style object for card
 */
export const createFullWidthCard = (): ViewStyle => ({
  width: getResponsiveWidth(100) - spacing.xl * 2,
  marginHorizontal: spacing.xl,
  ...createCardShadow(),
});

/**
 * Creates horizontal padding for content area
 * @returns Style object with horizontal padding
 */
export const createContentPadding = (): ViewStyle => ({
  paddingHorizontal: spacing.xl,
});

/**
 * Creates vertical spacing between sections
 * @returns Style object with vertical margin
 */
export const createSectionSpacing = (): ViewStyle => ({
  marginVertical: spacing.xxl,
});

/**
 * Typography Helpers
 */

/**
 * Creates text style with proper line height
 * @param fontSize - Font size
 * @param lineHeightMultiplier - Line height multiplier (default: 1.2)
 * @returns Text style object
 */
export const createTextStyle = (
  fontSize: number,
  lineHeightMultiplier: number = 1.2
): TextStyle => ({
  fontSize: scaleFontSize(fontSize),
  lineHeight: scaleFontSize(fontSize) * lineHeightMultiplier,
});

/**
 * Creates truncated text props configuration
 * Note: numberOfLines and ellipsizeMode are Text component props, not style properties
 * @param numberOfLines - Maximum number of lines
 * @returns Text props configuration
 */
export const createTruncatedTextProps = (numberOfLines: number = 1) => ({
  numberOfLines,
  ellipsizeMode: 'tail' as const,
});

/**
 * Accessibility Helpers
 */

/**
 * Ensures minimum touch target size
 * @param size - Desired size
 * @returns Size that meets minimum touch target (44px)
 */
export const ensureMinTouchTarget = (size: number): number => {
  const MIN_TOUCH_TARGET = 44;
  return Math.max(size, MIN_TOUCH_TARGET);
};

/**
 * Creates accessible button style with minimum touch target
 * @param width - Desired width
 * @param height - Desired height
 * @returns Style object with proper touch target
 */
export const createAccessibleButton = (
  width?: number,
  height?: number
): ViewStyle => ({
  minWidth: ensureMinTouchTarget(width || 44),
  minHeight: ensureMinTouchTarget(height || 44),
  justifyContent: 'center',
  alignItems: 'center',
});

/**
 * Color Utilities
 */

/**
 * Converts hex color to rgba
 * @param hex - Hex color string
 * @param alpha - Alpha value (0-1)
 * @returns RGBA color string
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Gets score component color by dimension
 * @param dimension - Score dimension name
 * @returns Color string
 */
export const getScoreComponentColor = (
  dimension: 'selfAwareness' | 'boundaries' | 'communication' | 'attachment' | 'emotionalRegulation'
): string => {
  const colorMap = {
    selfAwareness: colors.accent.warmGold,
    boundaries: colors.accent.orange,
    communication: colors.accent.yellow,
    attachment: colors.accent.lime,
    emotionalRegulation: colors.accent.bronze,
  };
  return colorMap[dimension];
};

/**
 * Animation Helpers
 */

/**
 * Creates a fade-in animation configuration
 * @param duration - Animation duration in ms
 * @returns Animation config
 */
export const createFadeInAnimation = (duration: number = 300) => ({
  from: { opacity: 0 },
  to: { opacity: 1 },
  duration,
});

/**
 * Creates a slide-up animation configuration
 * @param distance - Distance to slide in pixels
 * @param duration - Animation duration in ms
 * @returns Animation config
 */
export const createSlideUpAnimation = (distance: number = 50, duration: number = 300) => ({
  from: { translateY: distance, opacity: 0 },
  to: { translateY: 0, opacity: 1 },
  duration,
});

/**
 * Export all utilities as a single object for convenience
 */
export const styleUtils = {
  // Gradients
  scoreCircleGradient,
  inputGlowGradient,
  createLinearGradient,
  headerWarmGradient,
  headerLightGradient,
  headerOliveGradient,
  bottomFadeGradient,
  userMessageGradient,
  
  // Shadows and Glows
  createCardShadow,
  createGlowEffect,
  createSubtleShadow,
  createStrongShadow,
  createGoldenGlow,
  
  // Responsive Sizing
  scaleSize,
  scaleFontSize,
  scaleSpacing,
  getResponsiveWidth,
  getResponsiveHeight,
  isSmallScreen,
  isLargeScreen,
  getAdaptiveSpacing,
  getAdaptiveFontSize,
  clamp,
  interpolate,
  
  // Layout
  createCenteredContainer,
  createFullWidthCard,
  createContentPadding,
  createSectionSpacing,
  
  // Typography
  createTextStyle,
  createTruncatedTextProps,
  
  // Accessibility
  ensureMinTouchTarget,
  createAccessibleButton,
  
  // Colors
  hexToRgba,
  getScoreComponentColor,
  
  // Animation
  createFadeInAnimation,
  createSlideUpAnimation,
};

export default styleUtils;
