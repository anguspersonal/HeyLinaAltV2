import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/constants/theme';

const createDotAnimation = (value: Animated.Value, delay: number) =>
  Animated.loop(
    Animated.sequence([
      Animated.timing(value, { toValue: 1, duration: 320, easing: Easing.inOut(Easing.ease), useNativeDriver: true, delay }),
      Animated.timing(value, { toValue: 0.2, duration: 320, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])
  );

export function TypingIndicator() {
  const dotOne = useRef(new Animated.Value(0.2)).current;
  const dotTwo = useRef(new Animated.Value(0.2)).current;
  const dotThree = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      createDotAnimation(dotOne, 0),
      createDotAnimation(dotTwo, 140),
      createDotAnimation(dotThree, 280),
    ]);
    animation.start();

    return () => {
      animation.stop();
    };
  }, [dotOne, dotThree, dotTwo]);

  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <ThemedText style={styles.label}>Lina is replying</ThemedText>
        <View style={styles.dots}>
          {[dotOne, dotTwo, dotThree].map((value, index) => (
            <Animated.View key={index} style={[styles.dot, { opacity: value }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.background.cardSecondary,
    borderRadius: 999,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  label: {
    color: colors.text.secondary,
    ...typography.body.small,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.gold,
  },
});
