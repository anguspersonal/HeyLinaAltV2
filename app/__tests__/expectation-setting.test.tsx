import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import ExpectationSettingScreen from '../expectation-setting';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

// Access the global mock
const mockStorage = (global as any).mockStorage;

describe('ExpectationSettingScreen', () => {
  const mockReplace = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it('should render all sections correctly', () => {
    const { getByText } = render(<ExpectationSettingScreen />);
    
    // Check header
    expect(getByText('Before we begin')).toBeTruthy();
    expect(getByText('A few important things to know about using HeyLina')).toBeTruthy();
    
    // Check AI disclaimer section
    expect(getByText('Lina is AI-Powered')).toBeTruthy();
    expect(getByText(/Lina uses artificial intelligence/)).toBeTruthy();
    
    // Check crisis resources section
    expect(getByText('If You Need Immediate Help')).toBeTruthy();
    expect(getByText('National Suicide Prevention Lifeline')).toBeTruthy();
    expect(getByText('988')).toBeTruthy();
    
    // Check privacy section
    expect(getByText('Your Privacy Matters')).toBeTruthy();
    
    // Check acknowledgment checkboxes
    expect(getByText(/I understand that Lina is an AI companion/)).toBeTruthy();
    expect(getByText(/I agree to the/)).toBeTruthy();
  });

  it('should disable continue button when checkboxes are not checked', () => {
    const { getByText } = render(<ExpectationSettingScreen />);
    
    // Try to press the button without checking boxes
    const continueButton = getByText('Continue to HeyLina');
    fireEvent.press(continueButton);
    
    // Should not navigate since button is disabled
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should enable continue button when both checkboxes are checked', async () => {
    const { getByText } = render(<ExpectationSettingScreen />);
    
    // Check disclaimer checkbox
    const disclaimerCheckbox = getByText(/I understand that Lina is an AI companion/);
    fireEvent.press(disclaimerCheckbox);
    
    // Check terms checkbox
    const termsCheckbox = getByText(/I agree to the/);
    fireEvent.press(termsCheckbox);
    
    // Press continue button
    const continueButton = getByText('Continue to HeyLina');
    fireEvent.press(continueButton);
    
    // Should navigate since button is enabled
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    }, { timeout: 10000 });
  });

  it('should mark onboarding as complete and navigate to main app when continue is pressed', async () => {
    const { getByText } = render(<ExpectationSettingScreen />);
    
    // Check both checkboxes
    const disclaimerCheckbox = getByText(/I understand that Lina is an AI companion/);
    fireEvent.press(disclaimerCheckbox);
    
    const termsCheckbox = getByText(/I agree to the/);
    fireEvent.press(termsCheckbox);
    
    // Press continue button
    const continueButton = getByText('Continue to HeyLina');
    fireEvent.press(continueButton);
    
    await waitFor(() => {
      expect(mockStorage.setItem).toHaveBeenCalledWith('onboardingCompleted', 'true');
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('should toggle checkboxes when pressed', () => {
    const { getByText } = render(<ExpectationSettingScreen />);
    
    const disclaimerCheckbox = getByText(/I understand that Lina is an AI companion/);
    
    // Press once to check
    fireEvent.press(disclaimerCheckbox);
    
    // Press again to uncheck
    fireEvent.press(disclaimerCheckbox);
    
    // Try to press continue button
    const continueButton = getByText('Continue to HeyLina');
    fireEvent.press(continueButton);
    
    // Should not navigate since checkbox was unchecked
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should display all crisis resources', () => {
    const { getByText } = render(<ExpectationSettingScreen />);
    
    expect(getByText('National Suicide Prevention Lifeline')).toBeTruthy();
    expect(getByText('988')).toBeTruthy();
    
    expect(getByText('Crisis Text Line')).toBeTruthy();
    expect(getByText('Text HOME to 741741')).toBeTruthy();
    
    expect(getByText('SAMHSA National Helpline')).toBeTruthy();
    expect(getByText('1-800-662-4357')).toBeTruthy();
  });

  it('should display AI limitations', () => {
    const { getByText } = render(<ExpectationSettingScreen />);
    
    expect(getByText('• Diagnose mental health conditions')).toBeTruthy();
    expect(getByText('• Provide medical or therapeutic treatment')).toBeTruthy();
    expect(getByText('• Handle crisis situations or emergencies')).toBeTruthy();
    expect(getByText('• Guarantee specific outcomes in your relationships')).toBeTruthy();
  });

  it('should show loading state when submitting', async () => {
    const { getByText, queryByText } = render(<ExpectationSettingScreen />);
    
    // Check both checkboxes
    const disclaimerCheckbox = getByText(/I understand that Lina is an AI companion/);
    fireEvent.press(disclaimerCheckbox);
    
    const termsCheckbox = getByText(/I agree to the/);
    fireEvent.press(termsCheckbox);
    
    // Mock setItem to delay
    mockStorage.setItem.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    
    // Press continue button
    const continueButton = getByText('Continue to HeyLina');
    fireEvent.press(continueButton);
    
    // Button text should be replaced with loading indicator
    await waitFor(() => {
      expect(queryByText('Continue to HeyLina')).toBeNull();
    });
  });
});
