import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { borderRadius, colors, layout, spacing, typography } from '@/constants/theme';

type ChatInputProps = {
  onSend: (text: string) => void | Promise<void>;
  isSending?: boolean;
  disabled?: boolean;
  lastError?: string | null;
  maxLength?: number;
  onFocusChange?: (focused: boolean) => void;
  onValueChange?: (value: string) => void;
};

const DEFAULT_MAX_LENGTH = 2000;

export function ChatInput({
  onSend,
  isSending = false,
  disabled = false,
  lastError,
  maxLength = DEFAULT_MAX_LENGTH,
  onFocusChange,
  onValueChange,
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isSending && !disabled;

  const handleChangeText = (text: string) => {
    setValue(text);
    onValueChange?.(text);
  };

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    onSend(trimmed);
    setValue('');
    onValueChange?.('');
    
    // Announce to screen reader
    announceForAccessibility('Message sent');
  };

  return (
    <View style={styles.container}>
      {/* Glow effect background */}
      <View style={styles.glowContainer}>
        <View style={styles.glow} />
      </View>
      
      <View style={styles.inputRow}>
        {/* Microphone icon placeholder - voice input not implemented yet */}
        <Pressable 
          style={styles.micButton} 
          disabled
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Voice input"
          accessibilityHint="Voice input not yet available"
          accessibilityState={{ disabled: true }}
        >
          <ThemedText style={styles.micIcon}>🎤</ThemedText>
        </Pressable>
        
        <TextInput
          multiline
          placeholder="Message Lina..."
          placeholderTextColor={colors.text.placeholder}
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          maxLength={maxLength}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          editable={!disabled && !isSending}
          onFocus={() => onFocusChange?.(true)}
          onBlur={() => onFocusChange?.(false)}
          accessible={true}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message to Lina"
          accessibilityValue={{ text: value }}
        />
        
        <Pressable
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={isSending ? 'Sending message' : 'Send message'}
          accessibilityHint="Double tap to send your message"
          accessibilityState={{ disabled: !canSend }}
        >
          <ThemedText style={[styles.sendText, !canSend && styles.sendTextDisabled]}>
            {isSending ? '⋯' : '→'}
          </ThemedText>
        </Pressable>
      </View>
      
      {lastError ? <ThemedText style={styles.error}>{lastError}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    gap: spacing.xs,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  glow: {
    width: '90%',
    height: layout.inputHeight,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.accent.gold,
    opacity: 0.15,
    // Note: blur effect would require a library like react-native-blur
    // For now using opacity to simulate glow
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  micButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background.card,
  },
  micIcon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    minHeight: layout.inputHeight,
    maxHeight: 140,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    ...typography.body.medium,
    shadowColor: colors.ui.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent.gold,
  },
  sendButtonDisabled: {
    backgroundColor: colors.background.card,
    opacity: 0.5,
  },
  sendText: {
    color: colors.background.primary,
    fontSize: 24,
    fontWeight: '600',
  },
  sendTextDisabled: {
    color: colors.text.disabled,
  },
  error: {
    color: '#F97316',
    ...typography.body.small,
    marginTop: spacing.xs,
  },
});
