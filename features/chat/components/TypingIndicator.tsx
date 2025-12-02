import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

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
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#11213A',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  label: {
    color: '#E7EEF7',
    fontSize: 13,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E7EEF7',
  },
});
