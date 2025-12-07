/**
 * Retry utilities with exponential backoff
 * Validates: Requirements 11.1 - Handle errors gracefully with retry logic
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  timeout?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number, delay: number) => void;
}

export class RetryError extends Error {
  constructor(
    message: string,
    public readonly lastError: Error,
    public readonly attempts: number
  ) {
    super(message);
    this.name = 'RetryError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Default retry predicate - retry on network errors and 5xx server errors
 */
function defaultShouldRetry(error: any, attempt: number): boolean {
  // Don't retry after max attempts
  if (attempt >= 3) {
    return false;
  }

  // Retry on network errors
  if (
    error.message?.includes('network') ||
    error.message?.includes('fetch') ||
    error.message?.includes('timeout') ||
    error.message?.includes('ECONNREFUSED') ||
    error.message?.includes('ETIMEDOUT')
  ) {
    return true;
  }

  // Retry on 5xx server errors
  if (error.status >= 500 && error.status < 600) {
    return true;
  }

  // Retry on 429 (rate limit)
  if (error.status === 429) {
    return true;
  }

  // Don't retry on client errors (4xx)
  if (error.status >= 400 && error.status < 500) {
    return false;
  }

  return false;
}

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponentialDelay; // Add up to 30% jitter
  const delay = Math.min(exponentialDelay + jitter, maxDelay);
  return Math.floor(delay);
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    timeout,
    shouldRetry = defaultShouldRetry,
    onRetry,
  } = options;

  let lastError: Error;
  let timeoutId: NodeJS.Timeout | undefined;

  // Wrap operation with timeout if specified
  const executeWithTimeout = async (): Promise<T> => {
    if (!timeout) {
      return operation();
    }

    return new Promise<T>((resolve, reject) => {
      timeoutId = setTimeout(() => {
        reject(new TimeoutError(`Operation timed out after ${timeout}ms`));
      }, timeout);

      operation()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        });
    });
  };

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await executeWithTimeout();
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (attempt < maxRetries && shouldRetry(lastError, attempt)) {
        const delay = calculateDelay(attempt, baseDelay, maxDelay);
        
        // Call retry callback
        onRetry?.(lastError, attempt + 1, delay);

        // Wait before retrying
        await sleep(delay);
        continue;
      }

      // No more retries, throw error
      break;
    }
  }

  // All retries exhausted
  throw new RetryError(
    `Operation failed after ${maxRetries + 1} attempts: ${lastError!.message}`,
    lastError!,
    maxRetries + 1
  );
}

/**
 * Create a retryable version of a function
 */
export function withRetry<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: RetryOptions = {}
): (...args: TArgs) => Promise<TReturn> {
  return (...args: TArgs) => retryWithBackoff(() => fn(...args), options);
}

/**
 * Retry a fetch request with exponential backoff
 */
export async function retryFetch(
  url: string,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<Response> {
  return retryWithBackoff(async () => {
    const response = await fetch(url, init);
    
    // Throw error for non-ok responses so retry logic can handle them
    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;
      error.response = response;
      throw error;
    }
    
    return response;
  }, options);
}

/**
 * Create a retry-enabled fetch function with default options
 */
export function createRetryFetch(defaultOptions: RetryOptions = {}) {
  return (url: string, init?: RequestInit, options?: RetryOptions) =>
    retryFetch(url, init, { ...defaultOptions, ...options });
}
