import AsyncStorage from '@react-native-async-storage/async-storage';

import { checkNetworkStatus, waitForNetwork } from './network';

/**
 * Offline message queue for storing and sending messages when connectivity is restored
 * Validates: Requirements 11.2 - Queue messages when offline, send when online
 */

export interface QueuedMessage {
  id: string;
  content: string;
  timestamp: number;
  retryCount: number;
  accessToken?: string;
}

const QUEUE_KEY = '@heylina:offline_message_queue';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

/**
 * Add a message to the offline queue
 */
export async function queueMessage(message: Omit<QueuedMessage, 'timestamp' | 'retryCount'>): Promise<void> {
  try {
    const queue = await getQueue();
    const queuedMessage: QueuedMessage = {
      ...message,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    queue.push(queuedMessage);
    await saveQueue(queue);
  } catch (error) {
    console.error('Failed to queue message:', error);
    throw error;
  }
}

/**
 * Get all queued messages
 */
export async function getQueue(): Promise<QueuedMessage[]> {
  try {
    const data = await AsyncStorage.getItem(QUEUE_KEY);
    if (!data) {
      return [];
    }
    return JSON.parse(data) as QueuedMessage[];
  } catch (error) {
    console.error('Failed to get queue:', error);
    return [];
  }
}

/**
 * Save the queue to storage
 */
async function saveQueue(queue: QueuedMessage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to save queue:', error);
    throw error;
  }
}

/**
 * Remove a message from the queue
 */
export async function removeFromQueue(messageId: string): Promise<void> {
  try {
    const queue = await getQueue();
    const filtered = queue.filter((msg) => msg.id !== messageId);
    await saveQueue(filtered);
  } catch (error) {
    console.error('Failed to remove from queue:', error);
  }
}

/**
 * Clear the entire queue
 */
export async function clearQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear queue:', error);
  }
}

/**
 * Get the count of queued messages
 */
export async function getQueueCount(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}

/**
 * Process the offline queue
 * Attempts to send all queued messages when connectivity is restored
 */
export async function processQueue(
  sendFn: (message: QueuedMessage) => Promise<void>,
  onProgress?: (sent: number, total: number) => void
): Promise<{ sent: number; failed: number }> {
  // Check if we're online
  const networkStatus = await checkNetworkStatus();
  if (!networkStatus.isConnected) {
    console.log('Still offline, skipping queue processing');
    return { sent: 0, failed: 0 };
  }

  const queue = await getQueue();
  if (queue.length === 0) {
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;
  const remainingQueue: QueuedMessage[] = [];

  // Sort by timestamp (oldest first)
  const sortedQueue = [...queue].sort((a, b) => a.timestamp - b.timestamp);

  for (const message of sortedQueue) {
    try {
      // Check if we're still online before each attempt
      const status = await checkNetworkStatus();
      if (!status.isConnected) {
        // Lost connection, keep remaining messages in queue
        remainingQueue.push(message, ...sortedQueue.slice(sortedQueue.indexOf(message) + 1));
        break;
      }

      await sendFn(message);
      sent++;
      onProgress?.(sent, queue.length);
    } catch (error) {
      console.error(`Failed to send queued message ${message.id}:`, error);
      
      // Increment retry count
      message.retryCount++;
      
      if (message.retryCount < MAX_RETRIES) {
        // Keep in queue for retry
        remainingQueue.push(message);
        
        // Wait before next retry
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        // Max retries exceeded, drop message
        failed++;
        console.warn(`Message ${message.id} exceeded max retries, dropping`);
      }
    }
  }

  // Update queue with remaining messages
  await saveQueue(remainingQueue);

  return { sent, failed };
}

/**
 * Start automatic queue processing when network is restored
 * Returns a cleanup function to stop monitoring
 */
export function startQueueProcessor(
  sendFn: (message: QueuedMessage) => Promise<void>,
  onProgress?: (sent: number, total: number) => void
): () => void {
  let isActive = true;
  let processingPromise: Promise<void> | null = null;

  const processWhenOnline = async () => {
    if (!isActive || processingPromise) {
      return;
    }

    try {
      // Wait for network to be available
      await waitForNetwork(60000); // 1 minute timeout
      
      if (!isActive) {
        return;
      }

      // Process the queue
      processingPromise = processQueue(sendFn, onProgress)
        .then((result) => {
          console.log(`Queue processed: ${result.sent} sent, ${result.failed} failed`);
        })
        .catch((error) => {
          console.error('Queue processing error:', error);
        })
        .finally(() => {
          processingPromise = null;
        });

      await processingPromise;
    } catch (error) {
      console.error('Error waiting for network:', error);
      processingPromise = null;
    }
  };

  // Start monitoring
  void processWhenOnline();

  // Return cleanup function
  return () => {
    isActive = false;
  };
}
