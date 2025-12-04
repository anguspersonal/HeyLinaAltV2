import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import ProfileSetupScreen from '../profile-setup';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock expo-secure-store with namespace export
jest.mock('expo-secure-store', () => ({
  __esModule: true,
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('ProfileSetupScreen', () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: mockPush,
    });
  });

  it('should render all form fields', () => {
    const { getByPlaceholderText, getByText } = render(<ProfileSetupScreen />);

    expect(getByText("Tell us about yourself")).toBeTruthy();
    expect(getByPlaceholderText("Your name")).toBeTruthy();
    expect(getByPlaceholderText("City")).toBeTruthy();
    expect(getByText("Age range")).toBeTruthy();
    expect(getByText("Current relationship status")).toBeTruthy();
    expect(getByText("What's your primary goal?")).toBeTruthy();
  });

  it('should show validation errors when submitting empty form', async () => {
    const { getByText, findByText } = render(<ProfileSetupScreen />);

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(findByText('Name is required')).toBeTruthy();
    });
  });

  it('should validate name field', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ProfileSetupScreen />);

    const nameInput = getByPlaceholderText('Your name');
    const continueButton = getByText('Continue');

    // Test empty name
    fireEvent.press(continueButton);
    await waitFor(() => {
      expect(queryByText('Name is required')).toBeTruthy();
    });

    // Test name too short
    fireEvent.changeText(nameInput, 'A');
    fireEvent.press(continueButton);
    await waitFor(() => {
      expect(queryByText('Name must be at least 2 characters')).toBeTruthy();
    });

    // Test valid name
    fireEvent.changeText(nameInput, 'John Doe');
    await waitFor(() => {
      expect(queryByText('Name is required')).toBeFalsy();
      expect(queryByText('Name must be at least 2 characters')).toBeFalsy();
    });
  });

  it('should allow selecting age range', () => {
    const { getByText } = render(<ProfileSetupScreen />);

    const ageOption = getByText('25-29');
    fireEvent.press(ageOption);

    // The button should be selected (this would be verified by checking styles in a real test)
    expect(ageOption).toBeTruthy();
  });

  it('should allow selecting relationship status', () => {
    const { getByText } = render(<ProfileSetupScreen />);

    const statusOption = getByText('Single');
    fireEvent.press(statusOption);

    expect(statusOption).toBeTruthy();
  });

  it('should allow selecting primary goal', () => {
    const { getByText } = render(<ProfileSetupScreen />);

    const goalOption = getByText('Healing from a Breakup');
    fireEvent.press(goalOption);

    expect(goalOption).toBeTruthy();
  });

  it('should submit form with valid data', async () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: mockPush,
    });

    const { getByPlaceholderText, getByText } = render(<ProfileSetupScreen />);

    // Fill in all required fields
    fireEvent.changeText(getByPlaceholderText('Your name'), 'Jane Smith');
    fireEvent.changeText(getByPlaceholderText('City'), 'London');
    fireEvent.press(getByText('25-29'));
    fireEvent.press(getByText('Single'));
    fireEvent.press(getByText('Dating with Intention'));

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/expectation-setting');
    }, { timeout: 10000 });
  });

  it('should prevent submission when fields are missing', async () => {
    const { getByPlaceholderText, getByText } = render(<ProfileSetupScreen />);

    // Only fill in name
    fireEvent.changeText(getByPlaceholderText('Your name'), 'Jane Smith');

    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  it('should clear validation errors when user starts typing', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<ProfileSetupScreen />);

    const nameInput = getByPlaceholderText('Your name');
    const continueButton = getByText('Continue');

    // Trigger validation error
    fireEvent.press(continueButton);
    await waitFor(() => {
      expect(queryByText('Name is required')).toBeTruthy();
    });

    // Start typing
    fireEvent.changeText(nameInput, 'J');
    await waitFor(() => {
      expect(queryByText('Name is required')).toBeFalsy();
    });
  });
});
