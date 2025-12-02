import { useCallback, useMemo, useState } from 'react';

import { sendMessage as sendChatMessage } from '@/features/chat/services/chatApi';
import type { ChatMessage, SendMessageResult } from '@/features/chat/types';

type SendCallbacks = {
  onQueued?: (message: ChatMessage, retryOfId?: string) => void;
  onSuccess?: (optimisticMessage: ChatMessage, result: SendMessageResult) => void;
  onFailure?: (optimisticMessage: ChatMessage, errorMessage: string) => void;
};

type SendMessageParams = {
  content: string;
  retryOfId?: string;
};

const createLocalId = () =>
  `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function useSendMessage({
  accessToken,
  userId,
  onQueued,
  onSuccess,
  onFailure,
}: {
  accessToken?: string;
  userId?: string;
} & SendCallbacks) {
  const [isSending, setIsSending] = useState(false);
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async ({ content, retryOfId }: SendMessageParams) => {
      const trimmed = content.trim();
      if (!trimmed) {
        return;
      }

      const localId = retryOfId ?? createLocalId();
      const createdAt = new Date().toISOString();
      const optimistic: ChatMessage = {
        id: retryOfId ?? localId,
        localId,
        role: 'user',
        userId: userId ?? 'local-user',
        content: trimmed,
        createdAt,
        status: 'pending',
      };

      onQueued?.(optimistic, retryOfId);

      setIsSending(true);
      setIsAwaitingResponse(true);
      setLastError(null);

      if (!accessToken) {
        const missingAuthMessage = 'You need to be signed in to send messages.';
        setLastError(missingAuthMessage);
        onFailure?.(optimistic, missingAuthMessage);
        setIsSending(false);
        setIsAwaitingResponse(false);
        return;
      }

      try {
        const response = await sendChatMessage({
          content: trimmed,
          accessToken,
          idempotencyKey: localId,
        });
        onSuccess?.(optimistic, response);
      } catch (error) {
        const friendly =
          error instanceof Error ? error.message : 'Unable to send your message. Please retry.';
        setLastError(friendly);
        onFailure?.(optimistic, friendly);
      } finally {
        setIsSending(false);
        setIsAwaitingResponse(false);
      }
    },
    [accessToken, onFailure, onQueued, onSuccess, userId]
  );

  const state = useMemo(
    () => ({
      isSending,
      isAwaitingResponse,
      lastError,
    }),
    [isSending, isAwaitingResponse, lastError]
  );

  return {
    ...state,
    sendMessage,
  };
}
