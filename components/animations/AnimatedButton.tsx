/**
 * Animated Button Component
 * Button with press animation feedback
 */

import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedButtonProps extends PressableProps {
  children: React.ReactNode;
  scaleOnPress?: number;
  style?: ViewStyle;
  hapticFeedback?: boolean;
}

export function AnimatedButton({
  children,
  scaleOnPress = 0.95,
  style,
  hapticFeedback = true,
  onPressIn,
  onPressOut,
  ...pressableProps
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = (event: any) => {
    scale.value = withSpring(scaleOnPress, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(0.8, { duration: 100 });
    
    if (hapticFeedback) {
      // Haptic feedback would be triggered here
      // import * as Haptics from 'expo-haptics';
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
    onPressOut?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...pressableProps}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}
