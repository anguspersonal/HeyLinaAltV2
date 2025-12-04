import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

interface ChatInputPreviewProps {
  onPress?: () => void;
}

export function ChatInputPreview({ onPress }: ChatInputPreviewProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Navigate to chat screen
      router.push('/(tabs)/chat');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Glow Effect Background */}
      <View style={styles.glowContainer}>
        <Svg width="100%" height="100%" style={styles.glowSvg}>
          <Defs>
            <RadialGradient
              id="inputGlow"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0%" stopColor="#CEA869" stopOpacity="0.4" />
              <Stop offset="30%" stopColor="#F0FF80" stopOpacity="0.3" />
              <Stop offset="60%" stopColor="#FDF3D8" stopOpacity="0.2" />
              <Stop offset="100%" stopColor="#CEA869" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#inputGlow)"
          />
        </Svg>
      </View>

      {/* Input Container */}
      <View style={styles.inputContainer}>
        <View style={styles.inputContent}>
          {/* Microphone Icon */}
          <View style={styles.iconButton}>
            <ThemedText style={styles.icon}>🎤</ThemedText>
          </View>

          {/* Input Field (Non-functional, just for display) */}
          <View style={styles.inputField}>
            <ThemedText style={styles.placeholderText}>
              Message Lina...
            </ThemedText>
          </View>

          {/* Send Button */}
          <LinearGradient
            colors={['#BDA838', '#DEAE35']}
            style={styles.sendButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ThemedText style={styles.sendIcon}>→</ThemedText>
          </LinearGradient>
        </View>

        {/* Swipe Hint */}
        <View style={styles.hintContainer}>
          <ThemedText style={styles.hintText}>
            Tap to open chat
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  
  // Glow Effect
  glowContainer: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    opacity: 0.6,
  },
  glowSvg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  
  // Input Container
  inputContainer: {
    backgroundColor: colors.background.card,
    borderRadius: 6,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  // Icon Button
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 2,
    backgroundColor: 'rgba(189, 168, 56, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  
  // Input Field
  inputField: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.primary,
    borderRadius: 6,
  },
  placeholderText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.placeholder,
  },
  
  // Send Button
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background.primary,
  },
  
  // Hint
  hintContainer: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  hintText: {
    fontSize: typography.body.tiny.fontSize,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
});
