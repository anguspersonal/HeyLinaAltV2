/**
 * Font Demo Component
 * Demonstrates the usage of custom fonts (Instrument Sans and Carattere)
 * This component can be used for testing and showcasing font loading
 */

import { colors, spacing, typography } from '@/constants/theme';
import { getCarattereFont, getInstrumentSansFont } from '@/hooks/useFonts';
import { StyleSheet, Text, View } from 'react-native';

export function FontDemo() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Font Demo</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instrument Sans (Primary Font)</Text>
        <Text style={styles.regular}>Regular (400): The quick brown fox jumps over the lazy dog</Text>
        <Text style={styles.medium}>Medium (500): The quick brown fox jumps over the lazy dog</Text>
        <Text style={styles.semiBold}>SemiBold (600): The quick brown fox jumps over the lazy dog</Text>
        <Text style={styles.bold}>Bold (700): The quick brown fox jumps over the lazy dog</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Carattere (Accent Font)</Text>
        <Text style={styles.carattere}>Sarah</Text>
        <Text style={styles.carattereLarge}>Welcome to HeyLina</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Typography Scale</Text>
        <Text style={styles.displayLarge}>Display Large (56px)</Text>
        <Text style={styles.displayMedium}>Display Medium (48px)</Text>
        <Text style={styles.h1}>Heading 1 (24px)</Text>
        <Text style={styles.h2}>Heading 2 (20px)</Text>
        <Text style={styles.h3}>Heading 3 (18px)</Text>
        <Text style={styles.bodyLarge}>Body Large (20px)</Text>
        <Text style={styles.bodyMedium}>Body Medium (16px)</Text>
        <Text style={styles.bodySmall}>Body Small (14px)</Text>
        <Text style={styles.bodyTiny}>Body Tiny (12px)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
  },
  title: {
    fontFamily: getInstrumentSansFont(700),
    fontSize: 32,
    color: colors.accent.gold,
    marginBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: getInstrumentSansFont(600),
    fontSize: 18,
    color: colors.accent.lightGold,
    marginBottom: spacing.lg,
  },
  
  // Instrument Sans weights
  regular: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  medium: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  semiBold: {
    fontFamily: getInstrumentSansFont(600),
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bold: {
    fontFamily: getInstrumentSansFont(700),
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  // Carattere
  carattere: {
    fontFamily: getCarattereFont(),
    fontSize: 48,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  carattereLarge: {
    fontFamily: getCarattereFont(),
    fontSize: typography.display.large.fontSize,
    lineHeight: typography.display.large.lineHeight,
    color: colors.accent.gold,
  },
  
  // Typography scale
  displayLarge: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: typography.display.large.fontSize,
    lineHeight: typography.display.large.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  displayMedium: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.display.medium.fontSize,
    lineHeight: typography.display.medium.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  h1: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.heading.h1.fontSize,
    lineHeight: typography.heading.h1.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  h2: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.heading.h2.fontSize,
    lineHeight: typography.heading.h2.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  h3: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.heading.h3.fontSize,
    lineHeight: typography.heading.h3.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bodyLarge: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.body.large.fontSize,
    lineHeight: typography.body.large.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bodyMedium: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bodySmall: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: typography.body.small.fontSize,
    lineHeight: typography.body.small.lineHeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  bodyTiny: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.body.tiny.fontSize,
    lineHeight: typography.body.tiny.lineHeight,
    color: colors.text.primary,
  },
});
