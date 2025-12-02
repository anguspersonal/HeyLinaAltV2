import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import type { ChatMessage } from '@/features/chat/types';
import { useColorScheme } from '@/hooks/use-color-scheme';

type MessageBubbleProps = {
  message: ChatMessage;
  onRetry?: () => void;
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
};

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const isUser = message.role === 'user';
  const status = message.status ?? 'sent';

  const containerStyle = [
    styles.container,
    isUser ? styles.userContainer : styles.assistantContainer,
  ];
  const bubbleStyle = [
    styles.bubble,
    isUser ? styles.userBubble : styles.assistantBubble,
    status === 'failed' ? styles.failedBubble : null,
  ];

  const statusText = status === 'pending' ? 'Sending...' : status === 'failed' ? 'Failed' : undefined;

  return (
    <View style={containerStyle}>
      <View style={bubbleStyle}>
        <ThemedText style={styles.content}>{message.content}</ThemedText>
        <View style={styles.metaRow}>
          <ThemedText style={[styles.time, { color: Colors[colorScheme].powderBlue }]}>
            {formatTime(message.createdAt)}
          </ThemedText>
          {statusText ? (
            <View style={styles.statusPill}>
              <ThemedText style={styles.statusText}>{statusText}</ThemedText>
            </View>
          ) : null}
          {status === 'failed' && onRetry ? (
            <Pressable onPress={onRetry}>
              <ThemedText style={styles.retry}>Retry</ThemedText>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    padding: 14,
    borderRadius: 16,
    maxWidth: '88%',
    shadowColor: '#0D1B2A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#0A7EA4',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#172A4D',
    borderBottomLeftRadius: 4,
  },
  failedBubble: {
    borderWidth: 1,
    borderColor: '#C72C41',
  },
  content: {
    color: '#F8FAFC',
    fontSize: 15,
    lineHeight: 22,
  },
  metaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 12,
  },
  statusPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    color: '#F8FAFC',
    fontSize: 12,
  },
  retry: {
    fontSize: 12,
    color: '#FFD166',
  },
});
