import { useCallback, useEffect, useState } from 'react';

import {
    getQueueCount,
    processQueue,
    queueMessage,
    startQueueProcessor,
    type QueuedMessage,
} from '@/lib/offlineQueue';

/**
 * Hook for managing offline message queue
 * Automatically processes queue when connectivity is restored
 */
export function useOfflineQueue(
  sendFn: (message: QueuedMessage) => Promise<void>,
  enabled: boolean = true
) {
  const [queueSize, setQueueSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState({ sent: 0, total: 0 });

  // Update queue size
  const updateQueueSize = useCallback(async () => {
    const count = await getQueueCount();
    setQueueSize(count);
  }, []);

  // Queue a message
  const enqueue = useCallback(
    async (message: Omit<QueuedMessage, 'timestamp' | 'retryCount'>) => {
      await queueMessage(message);
      await updateQueueSize();
    },
    [updateQueueSize]
  );

  // Manually process queue
  const process = useCallback(async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setProcessingProgress({ sent: 0, total: queueSize });

    try {
      const result = await processQueue(sendFn, (sent, total) => {
        setProcessingProgress({ sent, total });
      });

      await updateQueueSize();
      return result;
    } finally {
      setIsProcessing(false);
      setProcessingProgress({ sent: 0, total: 0 });
    }
  }, [isProcessing, queueSize, sendFn, updateQueueSize]);

  // Start automatic queue processor
  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Initial queue size check
    updateQueueSize();

    // Start automatic processor
    const cleanup = startQueueProcessor(
      sendFn,
      (sent, total) => {
        setProcessingProgress({ sent, total });
        if (sent === total) {
          updateQueueSize();
        }
      }
    );

    return cleanup;
  }, [enabled, sendFn, updateQueueSize]);

  return {
    queueSize,
    isProcessing,
    processingProgress,
    enqueue,
    process,
    updateQueueSize,
  };
}
