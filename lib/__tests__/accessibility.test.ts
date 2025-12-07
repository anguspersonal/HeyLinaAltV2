/**
 * Accessibility Utilities Tests
 */

import {
    createAccessibilityHint,
    createAccessibleState,
    createMessageAccessibilityLabel,
    createTabAccessibilityLabel,
    formatDateForScreenReader,
    formatNumberForScreenReader,
    formatScoreForScreenReader,
    formatTimeForScreenReader,
    generateAccessibilityLabel,
    getContrastRatio,
    meetsWCAGAA,
    meetsWCAGAAA,
} from '../accessibility';

describe('Accessibility Utilities', () => {
  describe('Color Contrast', () => {
    it('should calculate correct contrast ratio for white on black', () => {
      const ratio = getContrastRatio('#FFFFFF', '#000000');
      expect(ratio).toBeCloseTo(21, 1);
    });

    it('should calculate correct contrast ratio for HeyLina primary colors', () => {
      const ratio = getContrastRatio('#FFFFFF', '#0A080B');
      expect(ratio).toBeGreaterThan(19);
    });

    it('should verify gold accent meets WCAG AA', () => {
      const meetsAA = meetsWCAGAA('#CEA869', '#0A080B');
      expect(meetsAA).toBe(true);
    });

    it('should verify secondary text meets WCAG AA', () => {
      // Secondary text is rgba(255, 255, 255, 0.7) which is approximately #B3B3B3
      const meetsAA = meetsWCAGAA('#B3B3B3', '#0A080B');
      expect(meetsAA).toBe(true);
    });

    it('should verify button text meets WCAG AAA', () => {
      const meetsAAA = meetsWCAGAAA('#0A080B', '#BDA838');
      expect(meetsAAA).toBe(true);
    });

    it('should handle large text contrast requirements', () => {
      // Large text has lower requirements (3:1 vs 4.5:1)
      const meetsAA = meetsWCAGAA('#999999', '#000000', true);
      expect(meetsAA).toBe(true);
    });
  });

  describe('Accessibility Labels', () => {
    it('should generate basic accessibility label', () => {
      const label = generateAccessibilityLabel('Settings');
      expect(label).toBe('Settings');
    });

    it('should generate label with value', () => {
      const label = generateAccessibilityLabel('Score', 720);
      expect(label).toBe('Score, 720');
    });

    it('should generate label with hint', () => {
      const label = generateAccessibilityLabel('Button', undefined, 'Double tap to activate');
      expect(label).toBe('Button. Double tap to activate');
    });

    it('should generate complete label with value and hint', () => {
      const label = generateAccessibilityLabel('Score', 720, 'Out of 1000');
      expect(label).toBe('Score, 720. Out of 1000');
    });
  });

  describe('Number Formatting', () => {
    it('should format number for screen reader', () => {
      const formatted = formatNumberForScreenReader(1234);
      expect(formatted).toBe('1,234');
    });

    it('should format number with unit', () => {
      const formatted = formatNumberForScreenReader(720, 'points');
      expect(formatted).toBe('720 points');
    });

    it('should format large numbers with commas', () => {
      const formatted = formatNumberForScreenReader(1234567);
      expect(formatted).toBe('1,234,567');
    });
  });

  describe('Date and Time Formatting', () => {
    it('should format date for screen reader', () => {
      const date = new Date('2025-12-07T15:30:00');
      const formatted = formatDateForScreenReader(date);
      expect(formatted).toContain('December');
      expect(formatted).toContain('2025');
    });

    it('should format time for screen reader', () => {
      const date = new Date('2025-12-07T15:30:00');
      const formatted = formatTimeForScreenReader(date);
      expect(formatted).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/i);
    });

    it('should handle string dates', () => {
      const formatted = formatDateForScreenReader('2025-12-07');
      expect(formatted).toContain('December');
    });
  });

  describe('Score Formatting', () => {
    it('should format score for screen reader', () => {
      const formatted = formatScoreForScreenReader(720, 1000);
      expect(formatted).toBe('720 out of 1000, 72 percent');
    });

    it('should handle perfect score', () => {
      const formatted = formatScoreForScreenReader(1000, 1000);
      expect(formatted).toBe('1000 out of 1000, 100 percent');
    });

    it('should handle zero score', () => {
      const formatted = formatScoreForScreenReader(0, 1000);
      expect(formatted).toBe('0 out of 1000, 0 percent');
    });

    it('should round percentage', () => {
      const formatted = formatScoreForScreenReader(333, 1000);
      expect(formatted).toBe('333 out of 1000, 33 percent');
    });
  });

  describe('Message Accessibility Labels', () => {
    it('should create label for user message', () => {
      const label = createMessageAccessibilityLabel(
        'user',
        'Hello Lina',
        '2025-12-07T15:30:00'
      );
      expect(label).toContain('You said: Hello Lina');
      expect(label).toContain('Sent at');
    });

    it('should create label for assistant message', () => {
      const label = createMessageAccessibilityLabel(
        'assistant',
        'Hello! How can I help?',
        '2025-12-07T15:30:00'
      );
      expect(label).toContain('Lina said: Hello! How can I help?');
      expect(label).toContain('Sent at');
    });

    it('should include pending status', () => {
      const label = createMessageAccessibilityLabel(
        'user',
        'Test message',
        '2025-12-07T15:30:00',
        'pending'
      );
      expect(label).toContain('Sending');
    });

    it('should include failed status', () => {
      const label = createMessageAccessibilityLabel(
        'user',
        'Test message',
        '2025-12-07T15:30:00',
        'failed'
      );
      expect(label).toContain('Failed to send');
    });
  });

  describe('Tab Accessibility Labels', () => {
    it('should create label for selected tab', () => {
      const label = createTabAccessibilityLabel('Home', true, 0, 4);
      expect(label).toBe('Home, tab, 1 of 4, selected');
    });

    it('should create label for unselected tab', () => {
      const label = createTabAccessibilityLabel('Settings', false, 3, 4);
      expect(label).toBe('Settings, tab, 4 of 4');
    });

    it('should handle middle tabs', () => {
      const label = createTabAccessibilityLabel('Chat', false, 1, 4);
      expect(label).toBe('Chat, tab, 2 of 4');
    });
  });

  describe('Accessibility Hints', () => {
    it('should create basic hint', () => {
      const hint = createAccessibilityHint('Double tap to activate');
      expect(hint).toBe('Double tap to activate');
    });

    it('should create hint with result', () => {
      const hint = createAccessibilityHint('Double tap', 'Opens settings');
      expect(hint).toBe('Double tap. Opens settings');
    });
  });

  describe('Accessible State', () => {
    it('should create state with selected', () => {
      const state = createAccessibleState(true);
      expect(state).toEqual({ selected: true });
    });

    it('should create state with disabled', () => {
      const state = createAccessibleState(undefined, true);
      expect(state).toEqual({ disabled: true });
    });

    it('should create state with multiple properties', () => {
      const state = createAccessibleState(true, false, true, false);
      expect(state).toEqual({
        selected: true,
        disabled: false,
        checked: true,
        expanded: false,
      });
    });

    it('should omit undefined properties', () => {
      const state = createAccessibleState(true, undefined, undefined, false);
      expect(state).toEqual({
        selected: true,
        expanded: false,
      });
    });
  });
});
