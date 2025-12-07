import { ChatInputPreview } from '@/components/ChatInputPreview';
import { PersonalizedHeader } from '@/components/PersonalizedHeader';
import { colors, spacing, typography } from '@/constants/theme';
import { ClarityHits } from '@/features/score/components/ClarityHits';
import { DailyQuoteCard } from '@/features/score/components/DailyQuoteCard';
import { ScoreBreakdown } from '@/features/score/components/ScoreBreakdown';
import { ScoreCard } from '@/features/score/components/ScoreCard';
import { EmotionalHealthScore } from '@/features/score/types';
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

  // Mock score data for demonstration
  // In production, this would come from an API call
  const mockScore: EmotionalHealthScore = {
    overall: 720,
    components: {
      selfAwareness: 78,
      boundaries: 65,
      communication: 82,
      attachmentSecurity: 71,
      emotionalRegulation: 68,
    },
    interpretation: "You're showing strong emotional awareness and communication skills. Focus on strengthening your boundaries to feel more secure in relationships.",
    lastUpdated: new Date().toISOString(),
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        scrollEventThrottle={16}
        accessible={true}
        accessibilityLabel="Dashboard"
        accessibilityHint="Scroll to view your emotional health score, daily quotes, and insights"
      >
        {/* Personalized Header Component */}
        <PersonalizedHeader userName={displayName} />

        {/* Content Sections */}
        <View style={styles.contentSections}>
          {/* EHS Score Card */}
          <ScoreCard score={mockScore} />

          {/* Daily Quote Card */}
          <DailyQuoteCard />

          {/* Score Breakdown */}
          <ScoreBreakdown score={mockScore} />

          {/* Clarity Hits */}
          <ClarityHits />

          {/* Add spacing at bottom for fade gradient */}
          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Bottom Fade Gradient */}
      <LinearGradient
        colors={['rgba(9, 7, 10, 0)', '#09070A']}
        style={styles.bottomFade}
        pointerEvents="box-none"
      >
        {/* Chat Input Preview */}
        <View style={styles.chatInputPreviewContainer}>
          <ChatInputPreview />
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
  chatInputPreviewContainer: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
});
