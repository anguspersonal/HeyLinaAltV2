import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { colors, componentStyles, spacing, typography } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface IntroSlide {
  title: string;
  description: string;
  icon: string;
}

const INTRO_SLIDES: IntroSlide[] = [
  {
    title: 'Meet Lina',
    description: 'Your AI companion for navigating modern dating with emotional intelligence and clarity.',
    icon: '💬',
  },
  {
    title: 'Feel Heard',
    description: 'Share your thoughts, feelings, and relationship questions in a safe, judgment-free space.',
    icon: '🤝',
  },
  {
    title: 'Gain Clarity',
    description: 'Get personalized insights and guidance to help you make better relationship decisions.',
    icon: '✨',
  },
  {
    title: 'Track Your Growth',
    description: 'Monitor your emotional health score and see how your patterns evolve over time.',
    icon: '📈',
  },
  {
    title: 'Your Privacy Matters',
    description: 'Your conversations are private and secure. We never share your personal data.',
    icon: '🔒',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentSlide(slideIndex);
  };

  const handleGetStarted = async () => {
    try {
      const storage = await import('@/lib/storage');
      await storage.default.setItem('hasSeenWelcome', 'true');
    } catch (error) {
      console.error('Failed to save welcome status:', error);
    }
    router.push('/signup');
  };

  const isLastSlide = currentSlide === INTRO_SLIDES.length - 1;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.logo}>HeyLina</ThemedText>
        <ThemedText style={styles.tagline}>
          Your emotionally intelligent dating companion
        </ThemedText>
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.slideContainer}
      >
        {INTRO_SLIDES.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.iconContainer}>
              <ThemedText style={styles.icon}>{slide.icon}</ThemedText>
            </View>
            <ThemedText style={styles.slideTitle}>{slide.title}</ThemedText>
            <ThemedText style={styles.slideDescription}>
              {slide.description}
            </ThemedText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {INTRO_SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentSlide === index && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.button}
          onPress={handleGetStarted}
        >
          <ThemedText style={styles.buttonText}>
            Get Started
          </ThemedText>
        </Pressable>

        <ThemedText style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </ThemedText>

        <Link href="/login" style={styles.link}>
          <ThemedText style={styles.linkText}>
            Already have an account? Sign in
          </ThemedText>
        </Link>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.accent.gold,
    marginBottom: spacing.md,
    fontFamily: 'Carattere',
  },
  tagline: {
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  slideContainer: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  icon: {
    fontSize: 56,
  },
  slideTitle: {
    fontSize: typography.heading.h1.fontSize,
    lineHeight: typography.heading.h1.lineHeight,
    fontWeight: typography.heading.h1.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 320,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.ui.border,
  },
  dotActive: {
    backgroundColor: colors.accent.gold,
    width: 24,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  button: {
    ...componentStyles.button.primary,
    backgroundColor: colors.accent.warmGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  buttonText: {
    fontSize: typography.body.medium.fontSize,
    fontWeight: '500',
    color: colors.background.primary,
  },
  disclaimer: {
    fontSize: typography.body.tiny.fontSize,
    lineHeight: typography.body.tiny.lineHeight,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  link: {
    marginTop: spacing.md,
    alignSelf: 'center',
  },
  linkText: {
    fontSize: typography.body.small.fontSize,
    color: colors.accent.lightGold,
    textAlign: 'center',
  },
});
