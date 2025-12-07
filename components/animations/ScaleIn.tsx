/**
 * Scale In Animation Component
 * Animates element scaling from small to normal size
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

interface ScaleInProps {
  children: React.ReactNode;
  initialScale?: number;
  duration?: number;
  delay?: number;
  useSpring?: boolean;
  style?: ViewStyle;
}

export function ScaleIn({
  children,
  initialScale = 0.8,
  duration = 300,
  delay = 0,
  useSpring = true,
  style,
}: ScaleInProps) {
  const scale = useSharedValue(initialScale);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (useSpring) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      opacity.value = withSpring(1, { damping: 12, stiffness: 100 });
    } else {
      scale.value = withTiming(1, { duration, delay, easing: Easing.out(Easing.ease) });
      opacity.value = withTiming(1, { duration, delay, easing: Easing.out(Easing.ease) });
    }
  }, [scale, opacity, duration, delay, useSpring]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
