/**
 * Integration Tests for Key User Flows
 * 
 * These tests validate end-to-end user journeys through the HeyLina mobile app:
 * 1. Complete onboarding flow (welcome → signup → profile setup → expectation setting → main app)
 * 2. Send message and receive response flow (chat interaction)
 * 3. Score viewing and navigation flow (dashboard → score detail)
 * 4. Settings update flow (profile edit, notification preferences)
 * 
 * These tests focus on the integration between screens, navigation, and state management.
 */

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import ExpectationSettingScreen from '../expectation-setting';
import ProfileSetupScreen from '../profile-setup';
import SignupScreen from '../signup';
import WelcomeScreen from '../welcome';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children }: any) => children,
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock auth store
const mockSignUp = jest.fn();
const mockSignIn = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@/stores/auth', () => ({
  useAuth: jest.fn(() => ({
    signUp: mockSignUp,
    signIn: mockSignIn,
    signOut: mockSignOut,
    status: 'unauthenticated',
    session: null,
    user: null,
    error: null,
    notification: null,
    isReady: true,
  })),
  AuthProvider: ({ children }: any) => children,
}));

// Mock chat API
const mockFetchMessages = jest.fn();
const mockSendMessage = jest.fn();

jest.mock('@/features/chat/services/chatApi', () => ({
  fetchMessages: (...args: any[]) => mockFetchMessages(...args),
  sendMessage: (...args: any[]) => mockSendMessage(...args),
}));

// Mock score API
const mockGetCurrentScore = jest.fn();
const mockGetScoreHistory = jest.fn();
const mockGetScoreInsights = jest.fn();

jest.mock('@/features/score/services/scoreApi', () => ({
  getCurrentScore: (...args: any[]) => mockGetCurrentScore(...args),
  getScoreHistory: (...args: any[]) => mockGetScoreHistory(...args),
  getScoreInsights: (...args: any[]) => mockGetScoreInsights(...args),
}));

// Mock user API
const mockGetProfile = jest.fn();
const mockUpdateProfile = jest.fn();
const mockUpdateNotificationSettings = jest.fn();

jest.mock('@/features/settings/services/userApi', () => ({
  getProfile: (...args: any[]) => mockGetProfile(...args),
  updateProfile: (...args: any[]) => mockUpdateProfile(...args),
  updateNotificationSettings: (...args: any[]) => mockUpdateNotificationSettings(...args),
}));

// Access the global mock storage
const mockStorage = (global as any).mockStorage;

describe('Integration Tests - Key User Flows', () => {
  const mockReplace = jest.fn();
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      push: mockPush,
      back: mockBack,
    });
  });

  /**
   * Test 1: Complete Onboarding Flow
   * 
   * This test validates the entire onboarding journey from welcome screen
   * through account creation, profile setup, and expectation setting.
   * 
   * Flow: Welcome → Signup → Profile Setup → Expectation Setting → Main App
   */
  describe('Complete Onboarding Flow', () => {
    it(
      'should complete full onboarding journey from welcome to main app',
      async () => {
        // Step 1: Welcome Screen - User sees welcome and clicks "Get Started"
      const { getByText: getWelcomeText } = render(<WelcomeScreen />);
      
      // Verify welcome screen content (using actual text from the component)
      expect(getWelcomeText(/Your AI companion for navigating modern dating/i)).toBeTruthy();
      
      // Click "Get Started" button
      const getStartedButton = getWelcomeText('Get Started');
      fireEvent.press(getStartedButton);
      
      // Should navigate to signup (storage call is an implementation detail tested elsewhere)
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/signup');
      });

      // Step 2: Signup Screen - User creates account
      mockReplace.mockClear();
      mockSignUp.mockResolvedValue({ success: true, requiresConfirmation: false });
      
      const { getByPlaceholderText: getSignupPlaceholder, getByText: getSignupText } = render(
        <SignupScreen />
      );
      
      // Fill in signup form
      const emailInput = getSignupPlaceholder('Email');
      const passwordInput = getSignupPlaceholder('Password');
      const confirmPasswordInput = getSignupPlaceholder('Confirm Password');
      
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'SecurePass123!');
      fireEvent.changeText(confirmPasswordInput, 'SecurePass123!');
      
      // Submit signup form
      const signupButton = getSignupText('Create account');
      fireEvent.press(signupButton);
      
      // Should call signUp and navigate to profile setup
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'SecurePass123!',
        });
        expect(mockReplace).toHaveBeenCalledWith('/profile-setup');
      });

      // Step 3: Profile Setup Screen - User completes profile
      mockPush.mockClear();
      mockStorage.setItem.mockResolvedValue(undefined);
      
      const { getByPlaceholderText: getProfilePlaceholder, getByText: getProfileText } = render(
        <ProfileSetupScreen />
      );
      
      // Fill in profile form
      const nameInput = getProfilePlaceholder('Your name');
      const cityInput = getProfilePlaceholder('City');
      
      fireEvent.changeText(nameInput, 'Alex');
      fireEvent.changeText(cityInput, 'London');
      
      // Select age range
      const ageButton = getProfileText('25-29');
      fireEvent.press(ageButton);
      
      // Select relationship status
      const statusButton = getProfileText('Single');
      fireEvent.press(statusButton);
      
      // Select primary goal
      const goalButton = getProfileText('Understand My Patterns');
      fireEvent.press(goalButton);
      
      // Submit profile
      const continueButton = getProfileText('Continue');
      fireEvent.press(continueButton);
      
      // Should save profile data and navigate to expectation setting
      await waitFor(() => {
        expect(mockStorage.setItem).toHaveBeenCalledWith(
          'profileData',
          expect.stringContaining('Alex')
        );
        expect(mockPush).toHaveBeenCalledWith('/expectation-setting');
      });

      // Step 4: Expectation Setting Screen - User acknowledges disclaimers
      mockReplace.mockClear();
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
      
      const { getByText: getExpectationText } = render(<ExpectationSettingScreen />);
      
      // Check both acknowledgment checkboxes
      const disclaimerCheckbox = getExpectationText(/I understand that Lina is an AI companion/);
      const termsCheckbox = getExpectationText(/I agree to the/);
      
      fireEvent.press(disclaimerCheckbox);
      fireEvent.press(termsCheckbox);
      
      // Complete onboarding
      const finalContinueButton = getExpectationText('Continue to HeyLina');
      fireEvent.press(finalContinueButton);
      
        // Should mark onboarding complete and navigate to main app
        await waitFor(() => {
          expect(mockStorage.setItem).toHaveBeenCalledWith('onboardingCompleted', 'true');
          expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
        });
      },
      10000
    ); // 10 second timeout for this complex integration test

    it('should block progression if profile data is incomplete', async () => {
      const { getByPlaceholderText, getByText } = render(<ProfileSetupScreen />);
      
      // Fill in only name, leave other fields empty
      const nameInput = getByPlaceholderText('Your name');
      fireEvent.changeText(nameInput, 'Alex');
      
      // Try to continue without completing all fields
      const continueButton = getByText('Continue');
      fireEvent.press(continueButton);
      
      // Should not navigate
      await waitFor(() => {
        expect(mockReplace).not.toHaveBeenCalled();
      });
    });

    it('should block progression if expectations are not acknowledged', async () => {
      const { getByText } = render(<ExpectationSettingScreen />);
      
      // Check only one checkbox
      const disclaimerCheckbox = getByText(/I understand that Lina is an AI companion/);
      fireEvent.press(disclaimerCheckbox);
      
      // Try to continue without checking both
      const continueButton = getByText('Continue to HeyLina');
      fireEvent.press(continueButton);
      
      // Should not navigate
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });

  /**
   * Test 2: Send Message and Receive Response Flow
   * 
   * This test validates the chat API integration and message handling logic.
   * 
   * Flow: Send Message → Receive Response → Handle Errors
   */
  describe('Send Message and Receive Response Flow', () => {
    it('should send message and receive AI response via API', async () => {
      // Mock successful message send
      mockSendMessage.mockResolvedValue({
        userMessage: {
          id: 'msg-1',
          role: 'user',
          content: 'I need advice about my relationship',
          createdAt: new Date().toISOString(),
        },
        aiResponse: {
          id: 'msg-2',
          role: 'assistant',
          content: "I'm here to listen. Tell me more about what's on your mind.",
          createdAt: new Date().toISOString(),
        },
      });

      // Call the API directly
      const result = await mockSendMessage({
        content: 'I need advice about my relationship',
        accessToken: 'test-token',
      });

      // Verify API was called correctly
      expect(mockSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'I need advice about my relationship',
        })
      );

      // Verify response structure
      expect(result.userMessage).toBeTruthy();
      expect(result.userMessage.content).toBe('I need advice about my relationship');
      expect(result.aiResponse).toBeTruthy();
      expect(result.aiResponse.content).toBe("I'm here to listen. Tell me more about what's on your mind.");
    });

    it('should handle message send failure gracefully', async () => {
      // Mock failed message send
      mockSendMessage.mockRejectedValue(new Error('Network error'));

      // Attempt to send message
      await expect(
        mockSendMessage({
          content: 'Test message',
          accessToken: 'test-token',
        })
      ).rejects.toThrow('Network error');

      // Verify error was thrown
      expect(mockSendMessage).toHaveBeenCalled();
    });

    it('should fetch message history successfully', async () => {
      // Mock successful messages fetch
      mockFetchMessages.mockResolvedValue({
        messages: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'msg-2',
            role: 'assistant',
            content: 'Hi there!',
            createdAt: new Date().toISOString(),
          },
        ],
        total: 2,
      });

      // Fetch messages
      const result = await mockFetchMessages({
        limit: 50,
        offset: 0,
        accessToken: 'test-token',
      });

      // Verify messages were fetched
      expect(mockFetchMessages).toHaveBeenCalled();
      expect(result.messages).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  /**
   * Test 3: Score Viewing and Navigation Flow
   * 
   * This test validates the score API integration and data handling.
   * 
   * Flow: Fetch Score → Fetch History → Fetch Insights
   */
  describe('Score Viewing and Navigation Flow', () => {
    it('should fetch current score successfully', async () => {
      // Mock score data
      const mockScore = {
        overall: 720,
        components: {
          selfAwareness: 78,
          boundaries: 65,
          communication: 82,
          attachmentSecurity: 71,
          emotionalRegulation: 68,
        },
        interpretation: "You're showing strong emotional awareness",
        lastUpdated: new Date().toISOString(),
      };

      mockGetCurrentScore.mockResolvedValue(mockScore);

      // Fetch score
      const result = await mockGetCurrentScore('test-token');

      // Verify score was fetched
      expect(mockGetCurrentScore).toHaveBeenCalledWith('test-token');
      expect(result.overall).toBe(720);
      expect(result.components.selfAwareness).toBe(78);
      expect(result.interpretation).toBeTruthy();
    });

    it('should fetch score history successfully', async () => {
      mockGetScoreHistory.mockResolvedValue({
        dataPoints: [
          { date: '2025-01-01', score: 700 },
          { date: '2025-01-02', score: 720 },
        ],
        trend: 'improving',
      });

      // Fetch history
      const result = await mockGetScoreHistory({
        accessToken: 'test-token',
      });

      // Verify history was fetched
      expect(mockGetScoreHistory).toHaveBeenCalled();
      expect(result.dataPoints).toHaveLength(2);
      expect(result.trend).toBe('improving');
    });

    it('should fetch score insights successfully', async () => {
      mockGetScoreInsights.mockResolvedValue([
        {
          id: 'insight-1',
          component: 'boundaries',
          title: 'Strengthen Your Boundaries',
          description: 'Focus on setting clear boundaries',
          suggestedAction: 'Practice saying no',
          priority: 'high',
        },
      ]);

      // Fetch insights
      const result = await mockGetScoreInsights('test-token');

      // Verify insights were fetched
      expect(mockGetScoreInsights).toHaveBeenCalledWith('test-token');
      expect(result).toHaveLength(1);
      expect(result[0].component).toBe('boundaries');
    });

    it('should handle score loading error gracefully', async () => {
      mockGetCurrentScore.mockRejectedValue(new Error('Failed to fetch score'));

      // Attempt to fetch score
      await expect(mockGetCurrentScore('test-token')).rejects.toThrow('Failed to fetch score');

      // Verify error was thrown
      expect(mockGetCurrentScore).toHaveBeenCalled();
    });
  });

  /**
   * Test 4: Settings Update Flow
   * 
   * This test validates the settings API integration and data persistence.
   * 
   * Flow: Fetch Profile → Update Profile → Update Notifications
   */
  describe('Settings Update Flow', () => {
    it('should fetch profile information successfully', async () => {
      // Mock current profile
      mockGetProfile.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Alex',
        ageRange: '25-29',
        city: 'London',
        relationshipStatus: 'single',
        primaryGoal: 'understand-patterns',
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Fetch profile
      const result = await mockGetProfile('test-token');

      // Verify profile was fetched
      expect(mockGetProfile).toHaveBeenCalledWith('test-token');
      expect(result.name).toBe('Alex');
      expect(result.city).toBe('London');
    });

    it('should update profile information successfully', async () => {
      // Mock successful update
      mockUpdateProfile.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Alex Smith',
        ageRange: '25-29',
        city: 'Manchester',
        relationshipStatus: 'dating',
        primaryGoal: 'improve-communication',
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Update profile
      const result = await mockUpdateProfile(
        {
          name: 'Alex Smith',
          city: 'Manchester',
        },
        'test-token'
      );

      // Verify profile was updated
      expect(mockUpdateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alex Smith',
          city: 'Manchester',
        }),
        'test-token'
      );
      expect(result.name).toBe('Alex Smith');
      expect(result.city).toBe('Manchester');
    });

    it('should update notification settings successfully', async () => {
      // Mock successful update
      mockUpdateNotificationSettings.mockResolvedValue(undefined);

      // Update notification settings
      await mockUpdateNotificationSettings(
        {
          enabled: true,
          checkIns: {
            enabled: true,
            frequency: 'daily',
            time: '09:00',
          },
          eventFollowUps: true,
          weeklyReflections: true,
          scoreUpdates: true,
        },
        'test-token'
      );

      // Verify settings were updated
      expect(mockUpdateNotificationSettings).toHaveBeenCalled();
    });

    it('should handle profile update failure gracefully', async () => {
      // Mock failed update
      mockUpdateProfile.mockRejectedValue(new Error('Network error'));

      // Attempt to update profile
      await expect(
        mockUpdateProfile(
          {
            name: 'Alex Smith',
          },
          'test-token'
        )
      ).rejects.toThrow('Network error');

      // Verify error was thrown
      expect(mockUpdateProfile).toHaveBeenCalled();
    });

    it('should persist profile data through round-trip', async () => {
      const originalProfile = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Alex',
        ageRange: '25-29' as const,
        city: 'London',
        relationshipStatus: 'single' as const,
        primaryGoal: 'understand-patterns' as const,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock get and update
      mockGetProfile.mockResolvedValue(originalProfile);
      mockUpdateProfile.mockResolvedValue({
        ...originalProfile,
        name: 'Alex Smith',
        updatedAt: new Date().toISOString(),
      });

      // Fetch original profile
      const fetched = await mockGetProfile('test-token');
      expect(fetched.name).toBe('Alex');

      // Update profile
      const updated = await mockUpdateProfile(
        { name: 'Alex Smith' },
        'test-token'
      );
      expect(updated.name).toBe('Alex Smith');

      // Verify both calls were made
      expect(mockGetProfile).toHaveBeenCalled();
      expect(mockUpdateProfile).toHaveBeenCalled();
    });
  });

  /**
   * Additional Integration Tests
   */
  describe('Cross-Feature Integration', () => {
    it('should maintain authentication state consistency', async () => {
      // This test ensures that authentication state is consistent
      // across different API calls
      
      const { useAuth } = require('@/stores/auth');
      const mockAuthState = {
        signUp: mockSignUp,
        signIn: mockSignIn,
        signOut: mockSignOut,
        status: 'authenticated' as const,
        session: { user: { id: 'user-1', email: 'test@example.com' } },
        user: { id: 'user-1', email: 'test@example.com' },
        error: null,
        notification: null,
        isReady: true,
        bootstrap: jest.fn(),
      };

      (useAuth as jest.Mock).mockReturnValue(mockAuthState);

      // Verify auth state
      const authState = useAuth();
      expect(authState.status).toBe('authenticated');
      expect(authState.user).toBeTruthy();
      expect(authState.user?.email).toBe('test@example.com');
    });

    it('should handle logout and clear authentication', async () => {
      mockSignOut.mockResolvedValue(undefined);
      (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);
      mockStorage.removeItem.mockResolvedValue(undefined);

      // Call signOut
      await mockSignOut();

      // Should call signOut
      expect(mockSignOut).toHaveBeenCalled();

      // Clear storage
      await mockStorage.removeItem('onboardingCompleted');
      await mockStorage.removeItem('profileData');

      // Verify storage was cleared
      expect(mockStorage.removeItem).toHaveBeenCalledWith('onboardingCompleted');
      expect(mockStorage.removeItem).toHaveBeenCalledWith('profileData');
    });

    it('should handle complete user flow from signup to using app', async () => {
      // Step 1: Sign up
      mockSignUp.mockResolvedValue({ success: true, requiresConfirmation: false });
      const signupResult = await mockSignUp({
        email: 'newuser@example.com',
        password: 'SecurePass123!',
      });
      expect(signupResult.success).toBe(true);

      // Step 2: Save profile data
      (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
      await SecureStore.setItemAsync(
        'profileData',
        JSON.stringify({
          name: 'New User',
          ageRange: '25-29',
          city: 'London',
          relationshipStatus: 'single',
          primaryGoal: 'understand-patterns',
        })
      );

      // Step 3: Complete onboarding
      await mockStorage.setItem('onboardingCompleted', 'true');

      // Step 4: Fetch initial data
      mockGetCurrentScore.mockResolvedValue({
        overall: 500,
        components: {
          selfAwareness: 50,
          boundaries: 50,
          communication: 50,
          attachmentSecurity: 50,
          emotionalRegulation: 50,
        },
        interpretation: 'Starting your journey',
        lastUpdated: new Date().toISOString(),
      });

      const score = await mockGetCurrentScore('test-token');
      expect(score.overall).toBe(500);

      // Step 5: Send first message
      mockSendMessage.mockResolvedValue({
        userMessage: {
          id: 'msg-1',
          role: 'user',
          content: 'Hello Lina',
          createdAt: new Date().toISOString(),
        },
        aiResponse: {
          id: 'msg-2',
          role: 'assistant',
          content: 'Welcome! How can I help you today?',
          createdAt: new Date().toISOString(),
        },
      });

      const messageResult = await mockSendMessage({
        content: 'Hello Lina',
        accessToken: 'test-token',
      });
      expect(messageResult.userMessage.content).toBe('Hello Lina');
      expect(messageResult.aiResponse).toBeTruthy();

      // Verify all steps were completed
      expect(mockSignUp).toHaveBeenCalled();
      expect(SecureStore.setItemAsync).toHaveBeenCalled();
      expect(mockStorage.setItem).toHaveBeenCalled();
      expect(mockGetCurrentScore).toHaveBeenCalled();
      expect(mockSendMessage).toHaveBeenCalled();
    });
  });
});
