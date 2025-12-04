import { render } from '@testing-library/react-native';
import React from 'react';
import DashboardScreen from '../index';

// Mock the auth store
jest.mock('@/stores/auth', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    status: 'authenticated',
  }),
}));

describe('DashboardScreen', () => {
  it('should render the dashboard screen', () => {
    const { getByText } = render(<DashboardScreen />);
    
    // Check that the greeting is displayed
    expect(getByText('Hi HeyLina')).toBeTruthy();
  });

  it('should display user name from email', () => {
    const { getByText } = render(<DashboardScreen />);
    
    // Check that the user name is displayed (capitalized first letter of email)
    expect(getByText('Test')).toBeTruthy();
  });

  it('should display placeholder sections', () => {
    const { getByText } = render(<DashboardScreen />);
    
    // Check that placeholder sections are present
    expect(getByText('EHS Score Card')).toBeTruthy();
    expect(getByText('Daily Quote Card')).toBeTruthy();
    expect(getByText('Score Breakdown')).toBeTruthy();
    expect(getByText('Clarity Hits')).toBeTruthy();
  });

  it('should display chat input preview placeholder', () => {
    const { getByText } = render(<DashboardScreen />);
    
    // Check that the chat input preview is present
    expect(getByText('Chat input preview (task 4.7)')).toBeTruthy();
  });
});
