import { ThemedText } from '@/components/themed-text';
import { colors, spacing, typography } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface Quote {
  id: string;
  text: string;
  author?: string;
}

interface DailyQuoteCardProps {
  quotes?: Quote[];
  isLoading?: boolean;
}

export function DailyQuoteCard({ quotes, isLoading = false }: DailyQuoteCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Default quotes if none provided
  const defaultQuotes: Quote[] = [
    {
      id: '1',
      text: "The quality of your relationships determines the quality of your life.",
      author: "Esther Perel"
    },
    {
      id: '2',
      text: "Vulnerability is not winning or losing; it's having the courage to show up and be seen.",
      author: "Brené Brown"
    },
    {
      id: '3',
      text: "The most important relationship you'll ever have is the one with yourself.",
    },
  ];

  const displayQuotes = quotes && quotes.length > 0 ? quotes : defaultQuotes;
  const currentQuote = displayQuotes[currentIndex];

  const handleShare = async () => {
    try {
      const message = currentQuote.author
        ? `"${currentQuote.text}" - ${currentQuote.author}`
        : `"${currentQuote.text}"`;
      
      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing quote:', error);
    }
  };

  const handleNextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % displayQuotes.length);
  };

  const handlePrevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + displayQuotes.length) % displayQuotes.length);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(189, 168, 56, 0.1)', 'rgba(222, 174, 53, 0.05)']}
          style={styles.gradient}
        >
          <ThemedText style={styles.loadingText}>Loading quote...</ThemedText>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(189, 168, 56, 0.1)', 'rgba(222, 174, 53, 0.05)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Quote Content */}
        <View style={styles.quoteContent}>
          <ThemedText style={styles.quoteText}>
            "{currentQuote.text}"
          </ThemedText>
          {currentQuote.author && (
            <ThemedText style={styles.authorText}>
              — {currentQuote.author}
            </ThemedText>
          )}
        </View>

        {/* Bottom Section with Share and Pagination */}
        <View style={styles.bottomSection}>
          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
          >
            <ThemedText style={styles.shareButtonText}>Share</ThemedText>
          </TouchableOpacity>

          {/* Pagination Dots */}
          {displayQuotes.length > 1 && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                onPress={handlePrevQuote}
                style={styles.paginationArrow}
              >
                <ThemedText style={styles.paginationArrowText}>‹</ThemedText>
              </TouchableOpacity>
              
              <View style={styles.dotsContainer}>
                {displayQuotes.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      index === currentIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleNextQuote}
                style={styles.paginationArrow}
              >
                <ThemedText style={styles.paginationArrowText}>›</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
    borderRadius: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 7.3,
    elevation: 5,
  },
  gradient: {
    padding: spacing.xl,
    minHeight: 217,
    justifyContent: 'space-between',
  },
  
  // Loading State
  loadingText: {
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  
  // Quote Content
  quoteContent: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  quoteText: {
    fontSize: typography.body.large.fontSize,
    lineHeight: typography.body.large.lineHeight,
    fontWeight: typography.body.large.fontWeight as any,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  authorText: {
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Bottom Section
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Share Button
  shareButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(189, 168, 56, 0.2)',
    borderRadius: 6,
  },
  shareButtonText: {
    fontSize: typography.body.small.fontSize,
    fontWeight: '500',
    color: colors.accent.gold,
  },
  
  // Pagination
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  paginationArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationArrowText: {
    fontSize: 24,
    color: colors.accent.gold,
    fontWeight: '300',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: colors.accent.gold,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
