/**
 * Accessibility Utilities
 * Provides helpers for implementing WCAG-compliant accessibility features
 */

import { AccessibilityRole, Platform } from 'react-native';

/**
 * Calculate relative luminance of a color
 * Used for WCAG contrast ratio calculations
 */
function getLuminance(hexColor: string): number {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export function getContrastRatio(foreground: string, background: string): number {
  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if color combination meets WCAG AAA standards
 */
export function meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Generate accessibility label for screen readers
 */
export function generateAccessibilityLabel(
  label: string,
  value?: string | number,
  hint?: string
): string {
  let fullLabel = label;
  
  if (value !== undefined && value !== null) {
    fullLabel += `, ${value}`;
  }
  
  if (hint) {
    fullLabel += `. ${hint}`;
  }
  
  return fullLabel;
}

/**
 * Format number for screen readers
 */
export function formatNumberForScreenReader(value: number, unit?: string): string {
  const formattedValue = value.toLocaleString();
  return unit ? `${formattedValue} ${unit}` : formattedValue;
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time for screen readers
 */
export function formatTimeForScreenReader(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get appropriate accessibility role for a component
 */
export function getAccessibilityRole(type: 'button' | 'link' | 'header' | 'text' | 'image' | 'input'): AccessibilityRole {
  const roleMap: Record<string, AccessibilityRole> = {
    button: 'button',
    link: 'link',
    header: 'header',
    text: 'text',
    image: 'image',
    input: 'none', // Use 'none' for TextInput as it has built-in accessibility
  };
  
  return roleMap[type] || 'none';
}

/**
 * Create accessibility hint for interactive elements
 */
export function createAccessibilityHint(action: string, result?: string): string {
  let hint = action;
  
  if (result) {
    hint += `. ${result}`;
  }
  
  return hint;
}

/**
 * Announce message to screen reader
 * Platform-specific implementation
 */
export function announceForAccessibility(message: string): void {
  if (Platform.OS === 'ios') {
    // iOS uses AccessibilityInfo.announceForAccessibility
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    AccessibilityInfo.announceForAccessibility(message);
  } else if (Platform.OS === 'android') {
    // Android uses AccessibilityInfo.announceForAccessibility
    const AccessibilityInfo = require('react-native').AccessibilityInfo;
    AccessibilityInfo.announceForAccessibility(message);
  }
}

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  const AccessibilityInfo = require('react-native').AccessibilityInfo;
  return await AccessibilityInfo.isScreenReaderEnabled();
}

/**
 * Get minimum touch target size based on platform
 */
export function getMinTouchTarget(): number {
  // iOS HIG recommends 44pt, Android recommends 48dp
  return Platform.OS === 'ios' ? 44 : 48;
}

/**
 * Ensure touch target meets minimum size
 */
export function ensureMinTouchTarget(size: number): number {
  const minSize = getMinTouchTarget();
  return Math.max(size, minSize);
}

/**
 * Create accessible state description
 */
export function createAccessibleState(
  selected?: boolean,
  disabled?: boolean,
  checked?: boolean,
  expanded?: boolean
): {
  selected?: boolean;
  disabled?: boolean;
  checked?: boolean;
  expanded?: boolean;
} {
  return {
    ...(selected !== undefined && { selected }),
    ...(disabled !== undefined && { disabled }),
    ...(checked !== undefined && { checked }),
    ...(expanded !== undefined && { expanded }),
  };
}

/**
 * Format score for screen reader
 */
export function formatScoreForScreenReader(score: number, maxScore: number = 1000): string {
  const percentage = Math.round((score / maxScore) * 100);
  return `${score} out of ${maxScore}, ${percentage} percent`;
}

/**
 * Create accessible label for message bubble
 */
export function createMessageAccessibilityLabel(
  role: 'user' | 'assistant',
  content: string,
  timestamp: string,
  status?: 'pending' | 'sent' | 'failed'
): string {
  const sender = role === 'user' ? 'You' : 'Lina';
  const time = formatTimeForScreenReader(timestamp);
  
  let label = `${sender} said: ${content}. Sent at ${time}`;
  
  if (status === 'pending') {
    label += '. Sending';
  } else if (status === 'failed') {
    label += '. Failed to send';
  }
  
  return label;
}

/**
 * Create accessible label for tab bar item
 */
export function createTabAccessibilityLabel(
  label: string,
  isSelected: boolean,
  index: number,
  total: number
): string {
  const position = `${index + 1} of ${total}`;
  const state = isSelected ? 'selected' : '';
  
  return `${label}, tab, ${position}${state ? ', ' + state : ''}`;
}

/**
 * Validate color contrast and log warnings in development
 */
export function validateColorContrast(
  foreground: string,
  background: string,
  context: string,
  isLargeText = false
): void {
  if (__DEV__) {
    const ratio = getContrastRatio(foreground, background);
    const meetsAA = meetsWCAGAA(foreground, background, isLargeText);
    
    if (!meetsAA) {
      console.warn(
        `[Accessibility] Low contrast ratio in ${context}: ${ratio.toFixed(2)}:1 ` +
        `(minimum ${isLargeText ? '3:1' : '4.5:1'} for WCAG AA)`
      );
    }
  }
}
