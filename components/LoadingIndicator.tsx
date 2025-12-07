/**
 * Loading Indicator Component
 * Reusable loading spinner with optional text
 */

import { colors, spacing, typography } from '@/constants/theme';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
  style?: ViewStyle;
  fullScreen?: boolean;
}

export function LoadingIndicator({
  size = 'large',
  text,
  color = colors.accent.gold,
  style,
  fullScreen = false,
}: LoadingIndicatorProps) {
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator size={size} color={color} />
      {text && <ThemedText style={styles.text}>{text}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  fullScreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
  },
  text: {
    marginTop: spacing.md,
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
