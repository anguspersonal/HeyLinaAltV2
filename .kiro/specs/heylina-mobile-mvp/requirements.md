# Requirements Document

## Introduction

HeyLina is an AI companion that provides emotionally intelligent, context-aware guidance for modern dating. The mobile application serves as the primary interface where users interact with Lina through chat, track their emotional health progress, and receive personalized insights based on longitudinal relationship data. This requirements document defines the V1 mobile MVP feature set that enables users to experience the core value proposition: feeling heard, gaining clarity, and making better relationship decisions.

## Glossary

- **HeyLina System**: The complete mobile application including UI, state management, and backend integration
- **Lina**: The AI persona that users interact with through chat
- **User**: A person using the HeyLina mobile application
- **Emotional Health Score (EHS)**: A proprietary score capturing emotional patterns across dimensions like self-awareness, boundaries, communication, attachment, and emotional volatility
- **Chat Session**: A conversation thread between the User and Lina
- **Message**: A single text communication from either the User or Lina within a Chat Session
- **Onboarding Flow**: The initial guided experience when a User first opens the application
- **Backend Service**: The server-side API that processes chat requests, manages user data, and generates scores
- **Premium Subscription**: A paid tier offering full access to HeyLina features at £14.99/month with 14-day free trial

## Requirements

### Requirement 1

**User Story:** As a new user, I want to understand what HeyLina is and create an account, so that I can start receiving emotionally intelligent dating guidance.

#### Acceptance Criteria

1. WHEN a User opens the HeyLina System for the first time THEN the HeyLina System SHALL display a splash screen with the tagline and value proposition
2. WHEN a User views the introduction screens THEN the HeyLina System SHALL present clear explanations of what Lina is, what Lina is not, and how data privacy is handled
3. WHEN a User provides valid email and password credentials THEN the HeyLina System SHALL create a new account and authenticate the User
4. WHEN a User attempts to sign up with invalid credentials THEN the HeyLina System SHALL display specific validation errors and prevent account creation
5. WHEN a User completes account creation THEN the HeyLina System SHALL store authentication tokens securely in device storage

### Requirement 2

**User Story:** As a new user, I want to complete a guided onboarding experience, so that Lina has context about my situation and I understand how to use the app.

#### Acceptance Criteria

1. WHEN a User completes sign up THEN the HeyLina System SHALL guide the User through profile setup including name, age bracket, city, and relationship status
2. WHEN a User selects their primary goal from options THEN the HeyLina System SHALL store this context for personalizing Lina's responses
3. WHEN a User views the expectation setting screen THEN the HeyLina System SHALL clearly communicate that Lina is AI-powered, not a therapist, and provide crisis resource information
4. WHEN a User completes all onboarding steps THEN the HeyLina System SHALL mark onboarding as complete and navigate to the main chat interface
5. WHEN a User provides incomplete onboarding information THEN the HeyLina System SHALL prevent progression until required fields are completed

### Requirement 3

**User Story:** As a user, I want to have natural conversations with Lina about my dating life, so that I can process emotions and gain clarity on relationship decisions.

#### Acceptance Criteria

1. WHEN a User opens the chat interface THEN the HeyLina System SHALL display a pre-seeded welcome message from Lina with an opening question
2. WHEN a User types a message and submits it THEN the HeyLina System SHALL send the message to the Backend Service and display a typing indicator
3. WHEN the Backend Service returns a response THEN the HeyLina System SHALL display Lina's message in the chat interface with appropriate formatting
4. WHEN a User views the chat interface THEN the HeyLina System SHALL display message history with clear visual distinction between User messages and Lina messages
5. WHEN the Backend Service fails to respond within a reasonable timeout THEN the HeyLina System SHALL display a reassuring error message and allow the User to retry

### Requirement 4

**User Story:** As a user, I want to see suggested conversation prompts, so that I can quickly start meaningful conversations without having to think of what to say.

#### Acceptance Criteria

1. WHEN a User views the chat interface with no active conversation THEN the HeyLina System SHALL display quick action prompts such as "Talk about someone I am dating" and "Process a breakup"
2. WHEN a User taps a quick action prompt THEN the HeyLina System SHALL send the corresponding message to Lina as if the User had typed it
3. WHEN Lina responds to a message THEN the HeyLina System SHALL optionally display contextual follow-up suggestions
4. WHEN a User is actively typing a message THEN the HeyLina System SHALL hide quick action prompts to avoid interface clutter

### Requirement 5

**User Story:** As a user, I want to view my Emotional Health Score and understand what it means, so that I can track my progress and identify patterns in my emotional wellbeing.

#### Acceptance Criteria

1. WHEN a User navigates to the score view THEN the HeyLina System SHALL display the current Emotional Health Score with a visual representation
2. WHEN a User views their Emotional Health Score THEN the HeyLina System SHALL present the score using compassionate, non-judgmental language
3. WHEN a User has sufficient historical data THEN the HeyLina System SHALL display trends over time using a simple graph or timeline
4. WHEN a User taps on the score details THEN the HeyLina System SHALL show component breakdowns with digestible insights about specific dimensions
5. WHEN a User views score insights THEN the HeyLina System SHALL suggest specific actions or conversation topics to improve weaker areas

### Requirement 6

**User Story:** As a user, I want to access my past conversations with Lina, so that I can review insights and track how my thinking has evolved.

#### Acceptance Criteria

1. WHEN a User navigates to the history view THEN the HeyLina System SHALL display a list of past Chat Sessions organized by recency
2. WHEN a User taps on a past Chat Session THEN the HeyLina System SHALL display the full conversation history for that session
3. WHEN a User bookmarks a specific message or insight THEN the HeyLina System SHALL save the bookmark and make it accessible from a dedicated bookmarks view
4. WHEN a User views bookmarked content THEN the HeyLina System SHALL display the bookmarked messages with surrounding context
5. WHEN a User searches their conversation history THEN the HeyLina System SHALL return relevant Chat Sessions and messages matching the search query

### Requirement 7

**User Story:** As a user, I want to receive timely check-in notifications, so that I can build a habit of reflecting with Lina and stay engaged with my emotional growth.

#### Acceptance Criteria

1. WHEN a User enables notifications THEN the HeyLina System SHALL send check-in prompts at configured times such as morning or weekly reflections
2. WHEN a User taps a notification THEN the HeyLina System SHALL open the chat interface with context related to the notification prompt
3. WHEN a User mentions a planned event like a date THEN the HeyLina System SHALL optionally send a follow-up notification asking how it went
4. WHEN a User configures notification preferences THEN the HeyLina System SHALL respect the User's choices for frequency, timing, and types of notifications
5. WHEN a User snoozes or dismisses a notification THEN the HeyLina System SHALL adjust the notification schedule accordingly

### Requirement 8

**User Story:** As a user, I want to understand subscription options and manage my premium access, so that I can make informed decisions about upgrading and understand what I'm paying for.

#### Acceptance Criteria

1. WHEN a User encounters premium-only features THEN the HeyLina System SHALL display clear messaging about the value of Premium Subscription
2. WHEN a User initiates an upgrade flow THEN the HeyLina System SHALL present subscription options with pricing, trial period, and feature comparison
3. WHEN a User starts a free trial THEN the HeyLina System SHALL clearly communicate the trial start date, end date, and when billing will begin
4. WHEN a User's trial period ends THEN the HeyLina System SHALL notify the User before charging and provide options to cancel or continue
5. WHEN a User completes a subscription purchase THEN the HeyLina System SHALL update the User's access level and confirm the transaction

### Requirement 9

**User Story:** As a user, I want to manage my account settings and data privacy, so that I can control my personal information and feel safe using the app.

#### Acceptance Criteria

1. WHEN a User navigates to settings THEN the HeyLina System SHALL display options for profile management, notification preferences, and data controls
2. WHEN a User updates their profile information THEN the HeyLina System SHALL save the changes and reflect them throughout the application
3. WHEN a User requests to export their data THEN the HeyLina System SHALL initiate a data export process and notify the User when complete
4. WHEN a User requests to delete their account THEN the HeyLina System SHALL confirm the action, explain consequences, and process the deletion request
5. WHEN a User logs out THEN the HeyLina System SHALL clear authentication tokens from secure storage and return to the login screen

### Requirement 10

**User Story:** As a user in distress, I want to access crisis resources and safety information, so that I can get appropriate help when I need more than Lina can provide.

#### Acceptance Criteria

1. WHEN a User views onboarding or help sections THEN the HeyLina System SHALL display clear disclaimers that Lina is not a therapist or crisis service
2. WHEN the Backend Service detects high-risk topics in conversation THEN the HeyLina System SHALL display inline warnings with links to professional resources
3. WHEN a User accesses safety information THEN the HeyLina System SHALL provide contact details for crisis hotlines and mental health services
4. WHEN a User is in a conversation about sensitive topics THEN the HeyLina System SHALL make it easy to pause or exit the conversation
5. WHEN a User views any screen with AI-generated content THEN the HeyLina System SHALL avoid implying guaranteed outcomes or positioning Lina as a replacement for professional help

### Requirement 11

**User Story:** As a user, I want the app to handle errors gracefully and maintain my data integrity, so that I don't lose my conversations or feel frustrated by technical issues.

#### Acceptance Criteria

1. WHEN the Backend Service is unavailable THEN the HeyLina System SHALL display a clear error message and allow the User to retry or continue offline
2. WHEN a User sends a message and loses network connectivity THEN the HeyLina System SHALL queue the message and send it when connectivity is restored
3. WHEN the HeyLina System encounters an unexpected error THEN the HeyLina System SHALL log the error securely without exposing sensitive user data
4. WHEN a User's authentication token expires THEN the HeyLina System SHALL prompt for re-authentication without losing unsaved conversation context
5. WHEN the HeyLina System updates to a new version THEN the HeyLina System SHALL migrate local data structures without data loss or corruption
