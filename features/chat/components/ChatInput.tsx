import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type ChatInputProps = {
  onSend: (text: string) => void | Promise<void>;
  isSending?: boolean;
  disabled?: boolean;
  lastError?: string | null;
  maxLength?: number;
};

const DEFAULT_MAX_LENGTH = 1000;

export function ChatInput({
  onSend,
  isSending = false,
  disabled = false,
  lastError,
  maxLength = DEFAULT_MAX_LENGTH,
}: ChatInputProps) {
  const [value, setValue] = useState('');

  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !isSending && !disabled;

  const handleSend = () => {
    if (!canSend) {
      return;
    }
    onSend(trimmed);
    setValue('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          multiline
          placeholder="Type a message to Lina"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={value}
          onChangeText={setValue}
          maxLength={maxLength}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable
          style={[styles.sendButton, !canSend ? styles.sendButtonDisabled : null]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <ThemedText style={styles.sendText}>{isSending ? '...' : 'Send'}</ThemedText>
        </Pressable>
      </View>
      {lastError ? <ThemedText style={styles.error}>{lastError}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0C162E',
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 140,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2A44',
    backgroundColor: '#0F1C38',
    color: '#E2E8F0',
    fontSize: 15,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#0A7EA4',
    minWidth: 72,
  },
  sendButtonDisabled: {
    backgroundColor: '#1E3A5F',
  },
  sendText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    color: '#F97316',
    fontSize: 13,
  },
});
