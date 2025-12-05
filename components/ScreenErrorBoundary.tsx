import { useRouter } from 'expo-router';
import React, { type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ErrorBoundary } from './ErrorBoundary';

interface ScreenErrorBoundaryProps {
  children: ReactNode;
  screenName?: string;
}

/**
 * Screen-level error boundary with navigation fallback
 * Provides option to go back or return to home
 */
export function ScreenErrorBoundary({ children, screenName }: ScreenErrorBoundaryProps) {
  const router = useRouter();

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log screen-specific error context
    console.error(`Error in screen: ${screenName ?? 'unknown'}`, {
      error: error.message,
      componentStack: errorInfo.componentStack?.split('\n').slice(0, 3).join('\n'),
    });
  };

  const renderFallback = (error: Error, retry: () => void) => {
    const canGoBack = router.canGoBack();

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>😔</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We encountered an issue loading this screen. You can try again or go back.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={retry}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>

            {canGoBack && (
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Go Back</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ErrorBoundary
      level="screen"
      fallback={renderFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
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
    width: '100%',
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
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#BBA53F',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '500',
  },
});
