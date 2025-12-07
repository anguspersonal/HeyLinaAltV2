/**
 * Slide In Animation Component
 * Animates element sliding in from a direction
 */

import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

type Direction = 'up' | 'down' | 'left' | 'right';

interface SlideInProps {
  children: React.ReactNode;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
  useSpring?: boolean;
  style?: ViewStyle;
}

export function SlideIn({
  children,
  direction = 'up',
  distance = 50,
  duration = 300,
  delay = 0,
  useSpring = false,
  style,
}: SlideInProps) {
  const translateX = useSharedValue(direction === 'left' ? -distance : direction === 'right' ? distance : 0);
  const translateY = useSharedValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const config = useSpring
      ? { damping: 15, stiffness: 100 }
      : { duration, delay, easing: Easing.out(Easing.ease) };

    if (useSpring) {
      translateX.value = withSpring(0, config);
      translateY.value = withSpring(0, config);
      opacity.value = withSpring(1, config);
    } else {
      translateX.value = withTiming(0, config);
      translateY.value = withTiming(0, config);
      opacity.value = withTiming(1, config);
    }
  }, [translateX, translateY, opacity, duration, delay, useSpring]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
