import { PersonalizedHeader } from '@/components/PersonalizedHeader';
import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/constants/theme';
import { useAuth } from '@/stores/auth';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
} from 'react-native';

export default function DashboardScreen() {
  const { user } = useAuth();

  // Extract user's first name from email or use a default
  const userName = user?.email?.split('@')[0] || 'there';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Personalized Header Component */}
        <PersonalizedHeader userName={displayName} />

        {/* Content Sections - Placeholders for future components */}
        <View style={styles.contentSections}>
          {/* EHS Score Card Placeholder */}
          <View style={styles.sectionPlaceholder}>
            <ThemedText style={styles.placeholderText}>
              EHS Score Card
            </ThemedText>
            <ThemedText style={styles.placeholderSubtext}>
              Coming in task 4.3
            </ThemedText>
          </View>

          {/* Daily Quote Card Placeholder */}
          <View style={styles.sectionPlaceholder}>
            <ThemedText style={styles.placeholderText}>
              Daily Quote Card
            </ThemedText>
            <ThemedText style={styles.placeholderSubtext}>
              Coming in task 4.5
            </ThemedText>
          </View>

          {/* Score Breakdown Placeholder */}
          <View style={styles.sectionPlaceholder}>
            <ThemedText style={styles.placeholderText}>
              Score Breakdown
            </ThemedText>
            <ThemedText style={styles.placeholderSubtext}>
              Coming in task 4.4
            </ThemedText>
          </View>

          {/* Clarity Hits Placeholder */}
          <View style={styles.sectionPlaceholder}>
            <ThemedText style={styles.placeholderText}>
              Clarity Hits
            </ThemedText>
            <ThemedText style={styles.placeholderSubtext}>
              Coming in task 4.6
            </ThemedText>
          </View>

          {/* Add spacing at bottom for fade gradient */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Bottom Fade Gradient */}
      <LinearGradient
        colors={['rgba(9, 7, 10, 0)', '#09070A']}
        style={styles.bottomFade}
        pointerEvents="none"
      >
        {/* Chat Input Preview Placeholder */}
        <View style={styles.chatInputPreview}>
          <ThemedText style={styles.chatInputText}>
            Chat input preview (task 4.7)
          </ThemedText>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 250, // Space for bottom fade and input
  },
  
  // Content Sections
  contentSections: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  sectionPlaceholder: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  placeholderText: {
    fontSize: typography.heading.h2.fontSize,
    lineHeight: typography.heading.h2.lineHeight,
    fontWeight: typography.heading.h2.fontWeight as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  placeholderSubtext: {
    fontSize: typography.body.small.fontSize,
    lineHeight: typography.body.small.lineHeight,
    color: colors.text.tertiary,
  },
  bottomSpacing: {
    height: 100,
  },
  
  // Bottom Fade Gradient
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 193,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 34 : spacing.lg, // Account for home indicator
  },
  
  // Chat Input Preview
  chatInputPreview: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  chatInputText: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.tertiary,
  },
});
