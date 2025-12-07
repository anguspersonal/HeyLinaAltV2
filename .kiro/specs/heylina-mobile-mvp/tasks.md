# Implementation Plan

- [x] 1. Set up design system and theme infrastructure







- [x] 1.1 Create theme constants file with color palette, typography, spacing, and layout values


  - Define all colors from design system (backgrounds, accents, text, UI)
  - Define typography scale with font families, sizes, weights, line heights
  - Define spacing scale and layout dimensions
  - Define border radius, shadows, blur effects, and opacity levels
  - _Requirements: All requirements (foundational)_

- [x] 1.2 Create reusable style utilities and helper functions






  - Implement gradient generator functions (conic, linear)
  - Create shadow and glow effect utilities
  - Build responsive sizing helpers
  - _Requirements: All requirements (foundational)_

- [x] 1.3 Set up custom fonts (Instrument Sans, Carattere)





  - Add font files to assets
  - Configure expo-font loading
  - Create font loading hook
  - _Requirements: All requirements (foundational)_

- [ ] 2. Implement authentication and onboarding flows
- [x] 2.1 Create login screen with email/password input





  - Build login form with validation
  - Integrate with existing auth store
  - Add error handling and loading states
  - Style according to design system
  - _Requirements: 1.3, 1.4_

- [x] 2.2 Create signup screen with email/password input





  - Build signup form with validation
  - Integrate with existing auth store
  - Handle email confirmation flow
  - Style according to design system
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 2.3 Write property test for authentication flows







  - **Property 1: Valid credentials create authenticated sessions**
  - **Property 2: Invalid credentials are rejected with specific errors**
  - **Validates: Requirements 1.3, 1.4, 1.5**

- [x] 2.4 Create onboarding welcome screens





  - Build splash screen with tagline
  - Create swipeable intro screens explaining Lina
  - Add "Get started" CTA button
  - _Requirements: 1.1, 1.2_

- [x] 2.5 Create onboarding profile setup screen





  - Build form for name, age bracket, city, relationship status
  - Add primary goal selection
  - Implement form validation
  - _Requirements: 2.1, 2.2_

- [x] 2.6 Create onboarding expectation setting screen





  - Display AI disclaimer and crisis resource information
  - Add terms of service and privacy notice
  - Implement completion flow to main app
  - _Requirements: 2.3, 2.4_
-

- [x] 2.7 Write property tests for onboarding flows





  - **Property 3: Onboarding completion enables main app access**
  - **Property 4: Incomplete onboarding blocks progression**
  - **Property 5: User preferences persist across sessions**
  - **Validates: Requirements 2.2, 2.4, 2.5**

- [x] 3. Build core chat interface





- [x] 3.1 Create chat screen layout with message list


  - Implement FlatList with virtualization for messages
  - Add date separators between message groups
  - Handle scroll-to-bottom on new messages
  - Style according to design system
  - _Requirements: 3.1, 3.4_

- [x] 3.2 Create MessageBubble component


  - Build user message bubble (right-aligned, golden gradient)
  - Build Lina message bubble (left-aligned, dark background)
  - Add timestamp display
  - Add bookmark action
  - _Requirements: 3.4_

- [x] 3.3 Create ChatInput component


  - Build text input with multiline support
  - Add microphone icon for voice input
  - Add send button with golden accent
  - Implement input validation (non-empty)
  - Add glow effect styling
  - _Requirements: 3.2_

- [x] 3.4 Create TypingIndicator component


  - Build animated dots indicator
  - Show when waiting for Lina's response
  - _Requirements: 3.2_


- [x] 3.5 Create QuickActions component

  - Build horizontal scrolling quick action buttons
  - Display suggested prompts ("Talk about someone I'm dating", etc.)
  - Hide when user is typing
  - _Requirements: 4.1, 4.2, 4.4_

- [x] 3.6 Implement chat message sending logic


  - Integrate with existing chatApi service
  - Add optimistic UI updates
  - Handle loading and error states
  - Implement retry logic for failed messages
  - _Requirements: 3.2, 3.5_



- [x] 3.7 Implement chat message fetching logic


  - Integrate with existing chatApi service
  - Add pagination for message history
  - Implement pull-to-refresh
  - Handle loading and error states
  - _Requirements: 3.4_

- [x] 3.8 Write property tests for chat functionality







  - **Property 6: Message submission triggers backend communication**
  - **Property 7: Backend responses are displayed correctly**
  - **Property 8: Quick actions send corresponding messages**
  - **Property 9: Active typing hides quick actions**
  - **Validates: Requirements 3.2, 3.3, 3.4, 4.2, 4.4**

- [x] 4. Build dashboard/home screen




- [x] 4.1 Create dashboard screen layout




  - Build scrollable container with sections
  - Add gradient header with personalized greeting
  - Implement layered gradient backgrounds
  - Add bottom fade gradient
  - _Requirements: All (dashboard is main hub)_

- [x] 4.2 Create personalized header component




  - Display date and time
  - Show user's name in Carattere font
  - Add "Hi HeyLina" greeting
  - Implement gradient overlay effects
  - _Requirements: All (personalization)_

- [x] 4.3 Create EHS score card component


  - Build large circular score visualization with conic gradient
  - Display score value (0-1000 scale)
  - Show interpretation text
  - Add statistics toggle
  - Implement horizontal scrolling quick actions at bottom
  - _Requirements: 5.1, 5.2_

- [x] 4.4 Create score breakdown section


  - Build horizontal scrolling component bars
  - Display individual dimension scores with color coding
  - Show dimension labels
  - Handle empty/loading states
  - _Requirements: 5.4, 5.5_

- [x] 4.5 Create daily quote card component


  - Display quote text with proper typography
  - Add share button
  - Implement pagination dots for multiple quotes
  - Style with gradient background
  - _Requirements: General UX_

- [x] 4.6 Create clarity hits section


  - Build horizontal scrolling insight cards
  - Display circular images with glow effect
  - Show insight titles and categories
  - Add bookmark and like actions
  - _Requirements: 6.1, 6.3_

- [x] 4.7 Create bottom chat input preview


  - Build fixed bottom input with glow effect
  - Add "Swipe to open chat" hint
  - Implement navigation to chat screen
  - _Requirements: 3.1_

- [x] 5. Implement emotional health score features



- [x] 5.1 Create scoreApi service


  - Implement getCurrentScore endpoint integration
  - Implement getScoreHistory endpoint integration
  - Implement getScoreInsights endpoint integration
  - Add error handling and retry logic
  - _Requirements: 5.1, 5.3, 5.4, 5.5_

- [x] 5.2 Create useScore custom hook


  - Manage score state and loading
  - Implement data fetching and caching
  - Handle error states
  - Provide refresh functionality
  - _Requirements: 5.1, 5.3_

- [x] 5.3 Create score detail screen


  - Build full-screen score view
  - Display large circular visualization
  - Show detailed component breakdown
  - Add insights section
  - Implement navigation from dashboard
  - _Requirements: 5.1, 5.4, 5.5_

- [x] 5.4 Create ScoreGraph component for trends


  - Build timeline visualization
  - Display data points over time
  - Add time range selector (week/month/all)
  - Handle empty states
  - _Requirements: 5.3_

- [x] 5.5 Create InsightCard component







  - Display insight text and category
  - Show suggested actions
  - Add bookmark and share actions
  - Style with appropriate color coding
  - _Requirements: 5.5_

- [x] 5.6 Write property tests for score functionality



  - **Property 10: Historical data enables trend visualization**
  - **Property 11: Score insights include actionable suggestions**
  - **Validates: Requirements 5.3, 5.5**

- [x] 5.7 Fix peer dependencies, critical severity vulnerabilities and testing failures
  - There are 2 critical severity vulnerabilities from npm install
  - Conflicting peer dependencies e.g. jest@29.7.0
  - npm test -- --watchAll=false

  

- [x] 6. Implement conversation history and bookmarks





- [x] 6.1 Create history list screen


  - Build list of past conversations
  - Sort by recency (most recent first)
  - Display conversation preview and metadata
  - Implement navigation to conversation detail
  - _Requirements: 6.1, 6.2_

- [x] 6.2 Create conversation detail screen


  - Display full message history for selected conversation
  - Reuse MessageBubble components
  - Add navigation back to history list
  - _Requirements: 6.2_

- [x] 6.3 Create bookmarks screen


  - Display list of bookmarked messages
  - Show message content with surrounding context
  - Add unbookmark action
  - Implement navigation to full conversation
  - _Requirements: 6.3, 6.4_

- [x] 6.4 Implement bookmark functionality


  - Add bookmark action to MessageBubble
  - Persist bookmarks locally and to backend
  - Update UI optimistically
  - _Requirements: 6.3_

- [x] 6.5 Implement conversation search

  - Add search input to history screen
  - Filter conversations by search query
  - Highlight matching text
  - Handle empty search results
  - _Requirements: 6.5_

- [x] 6.6 Write property tests for history and bookmarks



  - **Property 12: Chat sessions are ordered by recency**
  - **Property 13: Session selection displays full conversation**
  - **Property 14: Bookmark round-trip preserves messages**
  - **Property 15: Search returns matching conversations**
  - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [x] 7. Implement settings and user profile management







- [x] 7.1 Create settings screen


  - Build settings list with sections
  - Add navigation to profile, notifications, data privacy
  - Add logout action
  - Style according to design system
  - _Requirements: 9.1_

- [x] 7.2 Create profile edit screen


  - Build form for updating user information
  - Implement validation
  - Add save functionality
  - Show success/error feedback
  - _Requirements: 9.2_

- [x] 7.3 Create notification settings screen


  - Build toggles for notification preferences
  - Add time picker for check-in schedule
  - Implement save functionality
  - _Requirements: 7.4_

- [x] 7.4 Create data privacy screen


  - Add data export request button
  - Add account deletion button with confirmation
  - Display privacy policy and terms
  - Add safety resources section
  - _Requirements: 9.3, 9.4, 10.3_

- [x] 7.5 Create userApi service


  - Implement getProfile endpoint integration
  - Implement updateProfile endpoint integration
  - Implement updateNotificationSettings endpoint integration
  - Implement requestDataExport endpoint integration
  - Implement deleteAccount endpoint integration
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 7.6 Write property tests for settings functionality





  - **Property 5: User preferences persist across sessions** (already covered in 2.7)
  - **Property 19: Logout clears authentication state**
  - **Validates: Requirements 7.4, 9.2, 9.5**

- [x] 8. Implement notifications and check-ins





- [x] 8.1 Set up notification permissions and configuration

  - Request notification permissions at appropriate time
  - Handle permission denied gracefully
  - Configure notification channels (iOS/Android)
  - _Requirements: 7.1_

- [x] 8.2 Implement notification scheduling


  - Schedule check-in notifications based on user preferences
  - Handle notification taps with deep linking
  - Update schedule when preferences change
  - _Requirements: 7.1, 7.2, 7.4_


- [x] 8.3 Implement notification handlers

  - Handle notification tap to open chat with context
  - Handle notification dismissal
  - Update notification badge counts
  - _Requirements: 7.2_


- [x] 8.4 Write property test for notification navigation


  - **Property 16: Notification taps navigate with context**
  - **Validates: Requirements 7.2**

- [x] 9. Implement subscription and paywall





- [x] 9.1 Create paywall screen


  - Display subscription benefits
  - Show pricing and trial information
  - Add subscribe button
  - Style with premium aesthetic
  - _Requirements: 8.1, 8.2_

- [x] 9.2 Integrate with in-app purchase system


  - Set up Expo In-App Purchases or RevenueCat
  - Implement purchase flow
  - Handle purchase success/failure
  - Restore purchases functionality
  - _Requirements: 8.3, 8.5_

- [x] 9.3 Implement subscription state management


  - Track subscription status (trial, active, expired)
  - Update UI based on subscription state
  - Handle trial expiration
  - _Requirements: 8.3, 8.5_

- [x] 9.4 Add premium feature gates


  - Identify premium-only features
  - Show paywall when accessing premium features
  - Allow trial users full access
  - _Requirements: 8.1_

- [x] 9.5 Write property tests for subscription functionality



  - **Property 17: Trial start communicates billing timeline**
  - **Property 18: Subscription purchase grants access**
  - **Validates: Requirements 8.3, 8.5**

- [x] 10. Implement error handling and offline support









- [x] 10.1 Create error boundary components


  - Build app-level error boundary
  - Build screen-level error boundaries
  - Display user-friendly error messages
  - Add retry functionality
  - _Requirements: 11.1, 11.3_

- [x] 10.2 Implement offline message queue


  - Detect network connectivity changes
  - Queue messages when offline
  - Send queued messages when online
  - Show offline indicator in UI
  - _Requirements: 11.2_



- [x] 10.3 Implement error logging

  - Set up error logging service (Sentry, etc.)
  - Log errors without PII
  - Include relevant context for debugging


  - _Requirements: 11.3_


- [x] 10.4 Add retry logic to API calls


  - Implement exponential backoff

  - Handle timeout errors
  - Show retry UI to users
  - _Requirements: 11.1_

- [x] 10.5 Implement token refresh handling

  - Detect expired tokens
  - Refresh tokens automatically
  - Prompt for re-authentication if refresh fails
  - Preserve unsaved context
  - _Requirements: 11.4_

- [x] 10.6 Write property tests for error handling





  - **Property 20: Safety warnings appear for flagged content**
  - **Property 21: Offline messages are queued and sent**
  - **Property 22: Error logs exclude sensitive data**
  - **Validates: Requirements 10.2, 11.2, 11.3**

- [ ] 11. Implement safety features and crisis resources
- [ ] 11.1 Create safety resources component
  - Display crisis hotline information
  - Add links to mental health resources
  - Make easily accessible from multiple screens
  - _Requirements: 10.1, 10.3_

- [ ] 11.2 Implement safety warning system
  - Detect high-risk topics from backend flags
  - Display inline warnings with resource links
  - Allow users to pause or exit conversation
  - _Requirements: 10.2, 10.4_

- [ ] 11.3 Add disclaimers throughout app
  - Add AI disclaimer to onboarding
  - Add "not a therapist" messaging to chat
  - Add crisis resource links to settings
  - _Requirements: 10.1, 10.5_

- [ ] 12. Implement navigation and routing
- [ ] 12.1 Set up Expo Router file-based navigation
  - Configure tab navigation for main screens
  - Set up stack navigation for detail screens
  - Implement modal navigation for overlays
  - _Requirements: All (navigation is foundational)_

- [ ] 12.2 Create tab bar component
  - Build custom tab bar with design system styling
  - Add icons for each tab (Home, Chat, History, Settings)
  - Implement active state styling
  - _Requirements: All (navigation is foundational)_

- [ ] 12.3 Implement deep linking
  - Configure deep link URLs
  - Handle notification deep links
  - Handle external deep links (email, etc.)
  - _Requirements: 7.2_

- [ ] 13. Polish and optimization
- [ ] 13.1 Implement loading states and skeletons
  - Create skeleton loaders for all major screens
  - Add loading indicators for async operations
  - Ensure smooth transitions
  - _Requirements: All (UX polish)_

- [ ] 13.2 Add animations and transitions
  - Implement screen transitions
  - Add micro-interactions (button presses, etc.)
  - Animate score visualizations
  - Use react-native-reanimated for performance
  - _Requirements: All (UX polish)_

- [ ] 13.3 Optimize performance
  - Implement message list virtualization
  - Optimize image loading and caching
  - Reduce bundle size
  - Profile and fix performance bottlenecks
  - _Requirements: All (performance)_

- [ ] 13.4 Implement accessibility features
  - Add semantic labels for screen readers
  - Ensure sufficient color contrast
  - Support dynamic text sizing
  - Test with VoiceOver/TalkBack
  - _Requirements: All (accessibility)_

- [ ] 13.5 Write integration tests for key user flows

  - Test complete onboarding flow
  - Test send message and receive response flow
  - Test score viewing and navigation flow
  - Test settings update flow

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
