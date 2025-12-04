/**
 * PersonalizedHeader Component
 * 
 * Displays a personalized greeting header with:
 * - Current date and time
 * - "Hi HeyLina" greeting
 * - User's name in Carattere font
 * - Layered gradient overlay effects for visual depth
 * 
 * Used on the dashboard/home screen to create a warm, personalized experience.
 */

import { colors, spacing, typography } from '@/constants/theme';
import { getCarattereFont, getInstrumentSansFont } from '@/hooks/useFonts';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';

interface PersonalizedHeaderProps {
  /**
   * User's display name to show in the header
   */
  userName: string;
  
  /**
   * Optional custom height for the header
   * @default 418
   */
  height?: number;
  
  /**
   * Optional custom date string
   * If not provided, current date will be used
   */
  dateString?: string;
  
  /**
   * Optional custom time string
   * If not provided, current time will be used
   */
  timeString?: string;
}

/**
 * PersonalizedHeader Component
 * 
 * Creates a visually rich header with layered gradients and personalized content.
 * The component automatically generates current date/time if not provided.
 * 
 * @example
 * ```tsx
 * <PersonalizedHeader userName="Sarah" />
 * ```
 * 
 * @example
 * ```tsx
 * <PersonalizedHeader 
 *   userName="Alex"
 *   height={350}
 *   dateString="Monday, December 4"
 *   timeString="2:30 PM"
 * />
 * ```
 */
export function PersonalizedHeader({
  userName,
  height = 418,
  dateString,
  timeString,
}: PersonalizedHeaderProps) {
  // Generate current date and time if not provided
  const now = new Date();
  const defaultDateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const defaultTimeString = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const displayDate = dateString || defaultDateString;
  const displayTime = timeString || defaultTimeString;

  return (
    <View style={[styles.headerContainer, { height }]}>
      {/* Layered Gradient Backgrounds */}
      <View style={styles.gradientLayers}>
        {/* Warm gradient layer - base layer with warm brown tones */}
        <LinearGradient
          colors={['#371904', '#4C2D11']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientLayer, styles.warmGradient]}
        />

        {/* Light gradient layer - adds brightness and depth */}
        <LinearGradient
          colors={['#D9B577', '#F8E6C8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.gradientLayer, styles.lightGradient]}
        />

        {/* Olive gradient layer - adds complexity and richness */}
        <LinearGradient
          colors={['#A18D34', '#323A2A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.gradientLayer, styles.oliveGradient]}
        />
      </View>

      {/* Header Content */}
      <View style={styles.headerContent}>
        {/* Date and Time */}
        <Text style={styles.dateTime}>
          {displayDate} • {displayTime}
        </Text>

        {/* Greeting */}
        <Text style={styles.greeting}>Hi HeyLina</Text>

        {/* User Name in Carattere font */}
        <Text style={styles.userName}>{userName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Header Container
  headerContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },

  // Layered Gradient Backgrounds
  gradientLayers: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  warmGradient: {
    opacity: 0.6,
  },
  lightGradient: {
    opacity: 0.3,
    top: 50,
    left: -50,
    width: '120%',
    height: '80%',
  },
  oliveGradient: {
    opacity: 0.4,
    top: 100,
    right: -30,
    width: '110%',
    height: '70%',
  },

  // Header Content
  headerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0,
  },
  dateTime: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: typography.body.small.fontSize,
    lineHeight: typography.body.small.fontSize * 1.2,
    fontWeight: '400',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  greeting: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.fontSize * 1.2,
    fontWeight: '400',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  userName: {
    fontFamily: getCarattereFont(),
    fontSize: typography.display.large.fontSize,
    lineHeight: typography.display.large.fontSize * 1.2,
    fontWeight: '400',
    letterSpacing: -2.24, // -0.04em of 56px
    color: colors.text.primary,
    textAlign: 'center',
  },
});
