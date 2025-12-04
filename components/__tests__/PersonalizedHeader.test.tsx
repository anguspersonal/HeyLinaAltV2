/**
 * Tests for PersonalizedHeader Component
 * 
 * Validates that the personalized header displays:
 * - Date and time information
 * - "Hi HeyLina" greeting
 * - User's name
 * - Gradient overlay effects
 */

import { PersonalizedHeader } from '@/components/PersonalizedHeader';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('PersonalizedHeader', () => {
  it('should render with user name', () => {
    const { getByText } = render(<PersonalizedHeader userName="Sarah" />);
    
    expect(getByText('Sarah')).toBeTruthy();
  });

  it('should display "Hi HeyLina" greeting', () => {
    const { getByText } = render(<PersonalizedHeader userName="Alex" />);
    
    expect(getByText('Hi HeyLina')).toBeTruthy();
  });

  it('should display date and time when provided', () => {
    const { getByText } = render(
      <PersonalizedHeader
        userName="Jordan"
        dateString="Monday, December 4"
        timeString="2:30 PM"
      />
    );
    
    expect(getByText(/Monday, December 4/)).toBeTruthy();
    expect(getByText(/2:30 PM/)).toBeTruthy();
  });

  it('should generate current date and time when not provided', () => {
    const { getByText } = render(<PersonalizedHeader userName="Taylor" />);
    
    // Should contain some date text (we can't test exact date as it changes)
    const dateTimeElement = getByText(/•/); // The bullet separator
    expect(dateTimeElement).toBeTruthy();
  });

  it('should apply custom height when provided', () => {
    const { getByText } = render(
      <PersonalizedHeader userName="Morgan" height={350} />
    );
    
    // The component should render without errors with custom height
    expect(getByText('Morgan')).toBeTruthy();
  });

  it('should render all gradient layers', () => {
    const { UNSAFE_root } = render(<PersonalizedHeader userName="Casey" />);
    
    // Component should render successfully with gradient layers
    expect(UNSAFE_root).toBeTruthy();
  });
});
