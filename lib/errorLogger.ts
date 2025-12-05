/**
 * Error logging service
 * Logs errors without PII for debugging
 * Validates: Requirements 11.3 - Log errors without exposing sensitive user data
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

export interface SanitizedError {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: string;
  level: 'error' | 'warn' | 'info';
}

/**
 * Patterns to detect and remove PII from strings
 */
const PII_PATTERNS = [
  // Email addresses (including edge cases like !@a.aa)
  { pattern: /[^\s@]+@[^\s@]+\.[^\s@]+/g, replacement: '[email]' },
  // Phone numbers (various formats)
  { pattern: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, replacement: '[phone]' },
  { pattern: /\+\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g, replacement: '[phone]' },
  // Credit card numbers
  { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: '[card]' },
  // Social security numbers
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[ssn]' },
  // API keys and tokens (20+ alphanumeric characters including _ and -)
  { pattern: /[A-Za-z0-9_-]{20,}/g, replacement: '[token]' },
  // URLs with query parameters (may contain sensitive data)
  { pattern: /https?:\/\/[^\s]+\?[^\s]+/g, replacement: '[url]' },
  // IP addresses
  { pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, replacement: '[ip]' },
  // UUIDs (may be user IDs)
  { pattern: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, replacement: '[uuid]' },
];

/**
 * Sensitive keys that should be removed from context objects
 */
const SENSITIVE_KEYS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'secret',
  'authorization',
  'cookie',
  'session',
  'ssn',
  'creditCard',
  'cvv',
];

/**
 * Sanitize a string by removing PII
 */
function sanitizeString(str: string): string {
  let sanitized = str;
  
  for (const { pattern, replacement } of PII_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  
  return sanitized;
}

/**
 * Sanitize an object by removing sensitive keys and sanitizing values
 */
function sanitizeObject(obj: any, depth: number = 0): any {
  // Prevent infinite recursion
  if (depth > 5) {
    return '[max depth]';
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      // Skip sensitive keys
      if (SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[redacted]';
        continue;
      }

      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value, depth + 1);
    }
    
    return sanitized;
  }

  return String(obj);
}

/**
 * Sanitize an error object
 */
function sanitizeError(error: Error): { message: string; stack?: string } {
  return {
    message: sanitizeString(error.message),
    stack: error.stack
      ? error.stack
          .split('\n')
          .slice(0, 10) // Limit stack trace length
          .map((line) => sanitizeString(line))
          .join('\n')
      : undefined,
  };
}

/**
 * Log an error with sanitized context
 */
export function logError(
  error: Error | string,
  context?: ErrorContext,
  level: 'error' | 'warn' | 'info' = 'error'
): SanitizedError {
  const sanitizedError: SanitizedError = {
    message: typeof error === 'string' ? sanitizeString(error) : sanitizeError(error).message,
    stack: typeof error === 'string' ? undefined : sanitizeError(error).stack,
    context: context ? sanitizeObject(context) : undefined,
    timestamp: new Date().toISOString(),
    level,
  };

  // Log to console (in production, this would go to a service like Sentry)
  const logFn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  logFn('[ErrorLogger]', sanitizedError);

  // In production, send to error tracking service
  // Example: Sentry.captureException(error, { contexts: { custom: sanitizedError.context } });

  return sanitizedError;
}

/**
 * Log a warning
 */
export function logWarning(message: string, context?: ErrorContext): SanitizedError {
  return logError(message, context, 'warn');
}

/**
 * Log info
 */
export function logInfo(message: string, context?: ErrorContext): SanitizedError {
  return logError(message, context, 'info');
}

/**
 * Create a logger for a specific component
 */
export function createLogger(componentName: string) {
  return {
    error: (error: Error | string, context?: Omit<ErrorContext, 'component'>) =>
      logError(error, { ...context, component: componentName }, 'error'),
    warn: (message: string, context?: Omit<ErrorContext, 'component'>) =>
      logWarning(message, { ...context, component: componentName }),
    info: (message: string, context?: Omit<ErrorContext, 'component'>) =>
      logInfo(message, { ...context, component: componentName }),
  };
}

/**
 * Test if a string contains PII (for testing purposes)
 */
export function containsPII(str: string): boolean {
  return PII_PATTERNS.some(({ pattern }) => pattern.test(str));
}

/**
 * Initialize error logging service
 * In production, this would set up Sentry or similar service
 */
export function initializeErrorLogging(config?: {
  dsn?: string;
  environment?: string;
  release?: string;
}) {
  // In production, initialize Sentry or similar:
  // Sentry.init({
  //   dsn: config?.dsn,
  //   environment: config?.environment,
  //   release: config?.release,
  //   beforeSend: (event) => {
  //     // Additional sanitization before sending
  //     return event;
  //   },
  // });

  console.log('[ErrorLogger] Initialized', config);
}
