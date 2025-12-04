/**
 * HeyLina Design System
 * Complete theme constants including colors, typography, spacing, and layout values
 */

// Color Palette
export const colors = {
  background: {
    primary: '#0A080B',      // Main app background (very dark, almost black)
    card: '#161612',         // Primary card background (dark charcoal)
    cardSecondary: '#1B1B25', // Secondary card background (slightly lighter)
    overlay: 'rgba(9, 7, 10, 0.9)', // Overlay for modals/gradients
  },
  
  // Golden/Yellow accent family - core brand colors
  accent: {
    gold: '#CEA869',         // Primary gold
    lightGold: '#F0FF80',    // Bright yellow-gold
    warmGold: '#BDA838',     // Warm gold
    orange: '#CF802A',       // Orange-gold
    yellow: '#DEAE35',       // Yellow-gold
    olive: '#A18D34',        // Olive-gold
    bronze: '#C35829',       // Bronze
    lime: '#9BA23B',         // Lime-gold
    tan: '#D9B577',          // Light tan
    cream: '#F8E6C8',        // Cream
    paleYellow: '#FDF3D8',   // Pale yellow
    chartreuse: '#D7CA61',   // Chartreuse
  },
  
  text: {
    primary: '#FFFFFF',      // Primary text (white)
    secondary: 'rgba(255, 255, 255, 0.7)', // Secondary text
    tertiary: 'rgba(255, 255, 255, 0.5)',  // Tertiary text
    placeholder: '#BDBDBD',  // Input placeholder text
    disabled: 'rgba(255, 255, 255, 0.15)', // Disabled text
  },
  
  ui: {
    border: 'rgba(255, 255, 255, 0.1)', // Subtle borders
    divider: 'rgba(255, 255, 255, 0.2)', // Dividers
    shadow: 'rgba(0, 0, 0, 0.5)',        // Drop shadows
  },
};

// Typography Scale
export const typography = {
  // Display sizes
  display: {
    large: { 
      fontSize: 56, 
      lineHeight: 56 * 1.2, 
      fontWeight: '400' as const, 
      letterSpacing: -0.04 * 56 
    }, // User name
    medium: { 
      fontSize: 48, 
      lineHeight: 48 * 1.2, 
      fontWeight: '500' as const, 
      letterSpacing: -0.04 * 48 
    }, // Score value
  },
  
  // Heading sizes
  heading: {
    h1: { fontSize: 24, lineHeight: 24 * 1.2, fontWeight: '500' as const }, // Section titles
    h2: { fontSize: 20, lineHeight: 20 * 1.2, fontWeight: '500' as const }, // Card titles
    h3: { fontSize: 18, lineHeight: 18 * 1.2, fontWeight: '500' as const }, // Subsection titles
  },
  
  // Body sizes
  body: {
    large: { fontSize: 20, lineHeight: 20 * 1.4, fontWeight: '500' as const }, // Quote text
    medium: { fontSize: 16, lineHeight: 16 * 1.2, fontWeight: '400' as const }, // Standard body
    small: { fontSize: 14, lineHeight: 14 * 1.2, fontWeight: '400' as const },  // Secondary text
    tiny: { 
      fontSize: 12, 
      lineHeight: 12 * 1.2, 
      fontWeight: '500' as const, 
      letterSpacing: -0.02 * 12 
    }, // Labels
  },
  
  // Score display
  score: {
    large: { 
      fontSize: 48, 
      lineHeight: 48 * 1.2, 
      fontWeight: '500' as const, 
      letterSpacing: -0.04 * 48 
    },
    medium: { 
      fontSize: 32, 
      lineHeight: 32 * 1.2, 
      fontWeight: '500' as const, 
      letterSpacing: -0.04 * 32 
    },
  },
};

// Font Families
// Note: These are the design system names. For actual font loading, use the helpers from @/hooks/useFonts
export const fonts = {
  primary: 'Instrument Sans',  // Main UI font (sans-serif) - use getInstrumentSansFont() helper
  accent: 'Carattere',         // Handwritten/script for personalization - use getCarattereFont() helper
  system: 'SF Pro',            // iOS system font for status bar
};

// Spacing Scale
export const spacing = {
  xs: 6,    // Tiny gaps
  sm: 8,    // Small gaps
  md: 12,   // Medium gaps
  lg: 16,   // Large gaps (card padding)
  xl: 20,   // Extra large gaps
  xxl: 32,  // Section spacing
  xxxl: 72, // Major section spacing
};

// Layout Dimensions
export const layout = {
  screenWidth: 375,           // iPhone standard width
  contentWidth: 335,          // Main content area (20px margins)
  cardWidth: 335,             // Full-width cards
  insightCardWidth: 237,      // Insight card width
  scoreCircle: 274,           // Large score circle diameter
  componentBarHeight: 88,     // Score component bar height
  componentBarWidth: 64,      // Score component bar width
  inputHeight: 52,            // Chat input height
  quickActionSize: 64,        // Quick action circle size
};

// Border Radius
export const borderRadius = {
  sm: 2,    // Small elements
  md: 6,    // Cards, buttons, inputs
  lg: 7,    // Special elements with glow
  full: 100, // Circular elements
};

// Shadows and Effects
export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5, // Android
  },
};

// Blur Effects
export const blur = {
  subtle: 5.4,   // Subtle blur
  medium: 12.3,  // Medium blur for glows
  strong: 20.65, // Strong blur for backgrounds
  heavy: 29.85,  // Heavy blur for gradients
  extreme: 50,   // Extreme blur for large gradients
};

// Opacity Levels
export const opacity = {
  disabled: 0.15,   // Disabled elements
  tertiary: 0.2,    // Tertiary UI elements
  secondary: 0.35,  // Secondary UI elements
  medium: 0.5,      // Medium emphasis
  high: 0.76,       // High emphasis with transparency
  full: 0.9,        // Nearly opaque
};

// Component Styles
export const componentStyles = {
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...shadows.card,
  },
  
  button: {
    primary: {
      backgroundColor: '#BBA53F',  // Golden accent
      borderRadius: borderRadius.md,
      height: layout.inputHeight,
      paddingHorizontal: spacing.xl,
    },
    
    icon: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.sm,
      backgroundColor: '#BBA53F',
    },
  },
  
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    height: layout.inputHeight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    color: colors.text.primary,
    ...shadows.card,
  },
  
  messageBubble: {
    user: {
      backgroundColor: colors.accent.warmGold,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      maxWidth: '80%',
    },
    
    assistant: {
      backgroundColor: colors.background.cardSecondary,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      maxWidth: '80%',
    },
  },
};

// Icon Sizes
export const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
};

// Animation and Transitions
export const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
};

// Accessibility
export const accessibility = {
  minTouchTarget: 44,        // Minimum touch target size (iOS HIG)
  minContrastRatio: 4.5,     // WCAG AA standard for normal text
  minContrastRatioLarge: 3,  // WCAG AA standard for large text
};

// Score Component Colors
export const scoreComponentColors = {
  selfAwareness: colors.accent.warmGold,
  boundaries: colors.accent.orange,
  communication: colors.accent.yellow,
  attachment: colors.accent.lime,
  emotionalRegulation: colors.accent.bronze,
};

// Colors object for light/dark theme support (currently only dark theme)
// Note: Defined before theme object to ensure proper initialization order
export const Colors = {
  light: {
    text: '#FFFFFF',
    background: '#0A080B',
    tint: '#CEA869',
    icon: 'rgba(255, 255, 255, 0.7)',
    tabIconDefault: 'rgba(255, 255, 255, 0.5)',
    tabIconSelected: '#CEA869',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0A080B',
    tint: '#CEA869',
    icon: 'rgba(255, 255, 255, 0.7)',
    tabIconDefault: 'rgba(255, 255, 255, 0.5)',
    tabIconSelected: '#CEA869',
  },
};

// Export default theme object
export const theme = {
  colors,
  typography,
  fonts,
  spacing,
  layout,
  borderRadius,
  shadows,
  blur,
  opacity,
  componentStyles,
  iconSizes,
  animations,
  accessibility,
  scoreComponentColors,
};
