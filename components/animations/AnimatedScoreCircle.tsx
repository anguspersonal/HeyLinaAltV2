/**
 * Animated Score Circle Component
 * Animates the score circle progress on mount
 */

import { colors, layout } from '@/constants/theme';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedScoreCircleProps {
  score: number; // 0-1000
  size?: number;
  strokeWidth?: number;
  duration?: number;
}

export function AnimatedScoreCircle({
  score,
  size = layout.scoreCircle,
  strokeWidth = 40,
  duration = 1500,
}: AnimatedScoreCircleProps) {
  const progress = useSharedValue(0);
  const scorePercentage = score / 1000;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = withTiming(scorePercentage, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, scorePercentage, duration]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id="scoreGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor={colors.accent.gold} stopOpacity="1" />
            <Stop offset="20%" stopColor="#E6D8DA" stopOpacity="1" />
            <Stop offset="40%" stopColor="#EAE8B6" stopOpacity="1" />
            <Stop offset="60%" stopColor={colors.accent.lightGold} stopOpacity="1" />
            <Stop offset="80%" stopColor="#BBB34D" stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.accent.olive} stopOpacity="1" />
          </RadialGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
