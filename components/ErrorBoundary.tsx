import React, { Component, type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  level?: 'app' | 'screen';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching and handling React errors
 * Provides user-friendly error messages and retry functionality
 * 
 * Usage:
 * - App-level: Wrap entire app to catch all errors
 * - Screen-level: Wrap individual screens for isolated error handling
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error without PII
    const sanitizedError = this.sanitizeError(error);
    console.error('ErrorBoundary caught error:', sanitizedError, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  /**
   * Remove sensitive data from error messages
   * Validates: Requirements 11.3 - Error logs exclude sensitive data
   */
  private sanitizeError(error: Error): { message: string; stack?: string } {
    const message = error.message
      // Remove email addresses
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, '[email]')
      // Remove phone numbers
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[phone]')
      // Remove tokens/keys
      .replace(/\b[A-Za-z0-9_-]{20,}\b/g, '[token]')
      // Remove URLs with query params
      .replace(/https?:\/\/[^\s]+\?[^\s]+/g, '[url]');

    return {
      message,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'), // Limit stack trace
    };
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  private getUserFriendlyMessage(): string {
    const { level = 'screen' } = this.props;
    const { error } = this.state;

    if (level === 'app') {
      return 'Something unexpected happened. We\'re working to fix it.';
    }

    // Provide context-specific messages
    if (error?.message.includes('network') || error?.message.includes('fetch')) {
      return 'We\'re having trouble connecting. Please check your connection and try again.';
    }

    if (error?.message.includes('timeout')) {
      return 'This is taking longer than expected. Please try again.';
    }

    return 'Something went wrong on this screen. Let\'s try that again.';
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.handleRetry);
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😔</Text>
            <Text style={styles.title}>Oops!</Text>
            <Text style={styles.message}>{this.getUserFriendlyMessage()}</Text>
            
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A080B',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 335,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#BBA53F',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 6,
    minWidth: 200,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
