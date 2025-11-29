/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const palette = {
  midnightBlue: '#1F3666',
  lightOlive: '#CDE572',
  cream: '#FFF9E5',
  powderBlue: '#99BBFF',
  coral: '#FFA599',
  darkPurple: '#5D2680',
};

export const Colors = {
  light: {
    text: palette.midnightBlue,
    background: palette.cream,
    tint: palette.midnightBlue,
    icon: palette.midnightBlue,
    tabIconDefault: palette.midnightBlue,
    tabIconSelected: palette.lightOlive,
    ...palette,
  },
  dark: {
    text: palette.cream,
    background: palette.midnightBlue,
    tint: palette.lightOlive,
    icon: palette.cream,
    tabIconDefault: palette.cream,
    tabIconSelected: palette.lightOlive,
    ...palette,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    serif: 'Montserrat',
    rounded: 'Montserrat',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'Montserrat',
    rounded: 'Montserrat',
    mono: 'monospace',
  },
  web: {
    sans: "'Inter', sans-serif",
    serif: "'Montserrat', serif",
    rounded: "'Montserrat', sans-serif",
    mono: "monospace",
  },
});
