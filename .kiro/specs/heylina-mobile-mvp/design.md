# Design Document

## Overview

The HeyLina Mobile MVP is a React Native application built with Expo that provides users with an emotionally intelligent AI companion for dating guidance. The application architecture follows a feature-based modular structure with clear separation between UI, state management, and service layers. The core user experience centers around conversational chat with Lina, complemented by emotional health tracking, conversation history, and personalized insights.

The system integrates with a Supabase backend for authentication and data persistence, and communicates with AI services through Supabase Edge Functions. The design prioritizes emotional safety, data privacy, graceful error handling, and a calm, compassionate user experience that aligns with HeyLina's core values of integrity, trust, and compassion.

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              UI Layer (React Native)                   │  │
│  │  - Screens (Chat, Score, History, Settings)           │  │
│  │  - Components (MessageBubble, ChatInput, ScoreCard)   │  │
│  │  - Navigation (Expo Router)                           │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         State Management Layer                         │  │
│  │  - Auth Context (session, user state)                 │  │
│  │  - Custom Hooks (useMessages, useSendMessage)         │  │
│  │  - Local State (React hooks)                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Service Layer                               │  │
│  │  - chatApi (message operations)                       │  │
│  │  - scoreApi (EHS operations)                          │  │
│  │  - userApi (profile, settings)                        │  │
│  │  - supabase client (auth, storage)                    │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↕                                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Local Storage Layer                            │  │
│  │  - SecureStore (auth tokens)                          │  │
│  │  - AsyncStorage (preferences, cache)                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Supabase Edge Functions                        │  │
│  │  - /messages (POST, GET)                              │  │
│  │  - /score (GET)                                       │  │
│  │  - /user/profile (GET, PUT)                           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Supabase Auth & Database                       │  │
│  │  - User authentication                                 │  │
│  │  - Message persistence                                 │  │
│  │  - User profiles and settings                          │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AI Services                               │  │
│  │  - LLM (conversation generation)                       │  │
│  │  - RAG (context retrieval)                            │  │
│  │  - Scoring engine (EHS calculation)                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript with strict mode enabled
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Supabase Auth with secure token storage
- **Backend**: Supabase (PostgreSQL database + Edge Functions)
- **State Management**: React Context API + custom hooks
- **Local Storage**: 
  - expo-secure-store for sensitive data (auth tokens)
  - AsyncStorage for preferences and cache
- **Networking**: Native fetch API with custom service wrappers
- **UI Components**: Custom components with React Native core primitives
- **Styling**: React Native StyleSheet with theme constants

### Feature Module Structure

```
features/
├── auth/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   └── OnboardingScreen.tsx
│   ├── components/
│   │   ├── AuthForm.tsx
│   │   └── OnboardingStep.tsx
│   └── hooks/
│       └── useOnboarding.ts
├── chat/
│   ├── screens/
│   │   └── ChatScreen.tsx
│   ├── components/
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── QuickActions.tsx
│   ├── hooks/
│   │   ├── useMessages.ts
│   │   └── useSendMessage.ts
│   ├── services/
│   │   └── chatApi.ts
│   └── types.ts
├── score/
│   ├── screens/
│   │   ├── ScoreOverviewScreen.tsx
│   │   └── ScoreDetailScreen.tsx
│   ├── components/
│   │   ├── ScoreCard.tsx
│   │   ├── ScoreGraph.tsx
│   │   └── InsightCard.tsx
│   ├── services/
│   │   └── scoreApi.ts
│   └── types.ts
├── history/
│   ├── screens/
│   │   ├── HistoryListScreen.tsx
│   │   ├── ConversationDetailScreen.tsx
│   │   └── BookmarksScreen.tsx
│   ├── components/
│   │   ├── ConversationCard.tsx
│   │   └── BookmarkItem.tsx
│   ├── services/
│   │   └── historyApi.ts
│   └── types.ts
└── settings/
    ├── screens/
    │   ├── SettingsScreen.tsx
    │   ├── ProfileScreen.tsx
    │   ├── NotificationSettingsScreen.tsx
    │   └── DataPrivacyScreen.tsx
    ├── components/
    │   ├── SettingItem.tsx
    │   └── SafetyResources.tsx
    ├── services/
    │   └── userApi.ts
    └── types.ts
```

## Design System

### Color Palette

#### Background Colors
```typescript
const colors = {
  background: {
    primary: '#0A080B',      // Main app background (very dark, almost black)
    card: '#161612',         // Primary card background (dark charcoal)
    cardSecondary: '#1B1B25', // Secondary card background (slightly lighter)
    overlay: 'rgba(9, 7, 10, 0.9)', // Overlay for modals/gradients
  },
  
  // Golden/Yellow accent family - core brand colors
  accent: {
    gold: '#CEA869',         // Primary gold
    lightGold: '#F0FF80',    // Bright yellow-gold
    warmGold: '#BDA838',     // Warm gold
    orange: '#CF802A',       // Orange-gold
    yellow: '#DEAE35',       // Yellow-gold
    olive: '#A18D34',        // Olive-gold
    bronze: '#C35829',       // Bronze
    lime: '#9BA23B',         // Lime-gold
    tan: '#D9B577',          // Light tan
    cream: '#F8E6C8',        // Cream
    paleYellow: '#FDF3D8',   // Pale yellow
    chartreuse: '#D7CA61',   // Chartreuse
  },
  
  text: {
    primary: '#FFFFFF',      // Primary text (white)
    secondary: 'rgba(255, 255, 255, 0.7)', // Secondary text
    tertiary: 'rgba(255, 255, 255, 0.5)',  // Tertiary text
    placeholder: '#BDBDBD',  // Input placeholder text
    disabled: 'rgba(255, 255, 255, 0.15)', // Disabled text
  },
  
  ui: {
    border: 'rgba(255, 255, 255, 0.1)', // Subtle borders
    divider: 'rgba(255, 255, 255, 0.2)', // Dividers
    shadow: 'rgba(0, 0, 0, 0.5)',        // Drop shadows
  },
};
```

#### Gradient Definitions

**Score Circle Gradient (Conic):**
```css
background: conic-gradient(
  from 180deg at 50% 50%, 
  #CEA869 -90.29deg, 
  #E6D8DA 88.27deg, 
  #EAE8B6 115.96deg, 
  #F0FF80 148.83deg, 
  #BBB34D 179.42deg, 
  #A18D34 203.98deg, 
  #BF9F58 243.43deg, 
  #CEA869 269.71deg, 
  #E6D8DA 448.27deg
);
```

**Input Glow Gradient (Conic):**
```css
background: conic-gradient(
  from 90deg at 50% 50%, 
  #CEA869 0deg, 
  #F0FF80 76.15deg, 
  #FDF3D8 203.48deg, 
  #CEA869 360deg
);
filter: blur(6.5px);
```

**Header Gradient Overlays:**
```css
/* Warm gradient */
background: linear-gradient(209.7deg, #371904 22.15%, #4C2D11 43.13%);
filter: blur(20.65px);

/* Light gradient */
background: linear-gradient(107.08deg, #D9B577 19.42%, #F8E6C8 87.23%);
filter: blur(50px);

/* Olive gradient */
background: linear-gradient(236.17deg, #A18D34 27.66%, #323A2A 70.53%);
filter: blur(29.85px);
```

**Bottom Fade Gradient:**
```css
background: linear-gradient(180deg, rgba(9, 7, 10, 0) 0%, #09070A 32.69%);
```

### Typography

#### Font Families
```typescript
const fonts = {
  primary: 'Instrument Sans',  // Main UI font (sans-serif)
  accent: 'Carattere',         // Handwritten/script for personalization
  system: 'SF Pro',            // iOS system font for status bar
};
```

#### Font Sizes and Weights
```typescript
const typography = {
  // Display sizes
  display: {
    large: { size: 56, lineHeight: '120%', weight: 400, letterSpacing: '-0.04em' }, // User name
    medium: { size: 48, lineHeight: '120%', weight: 500, letterSpacing: '-0.04em' }, // Score value
  },
  
  // Heading sizes
  heading: {
    h1: { size: 24, lineHeight: '120%', weight: 500 }, // Section titles
    h2: { size: 20, lineHeight: '120%', weight: 500 }, // Card titles
    h3: { size: 18, lineHeight: '120%', weight: 500 }, // Subsection titles
  },
  
  // Body sizes
  body: {
    large: { size: 20, lineHeight: '140%', weight: 500 }, // Quote text
    medium: { size: 16, lineHeight: '120%', weight: 400 }, // Standard body
    small: { size: 14, lineHeight: '120%', weight: 400 },  // Secondary text
    tiny: { size: 12, lineHeight: '120%', weight: 500, letterSpacing: '-0.02em' }, // Labels
  },
  
  // Score display
  score: {
    large: { size: 48, lineHeight: '120%', weight: 500, letterSpacing: '-0.04em' },
    medium: { size: 32, lineHeight: '120%', weight: 500, letterSpacing: '-0.04em' },
  },
};
```

### Spacing and Layout

#### Spacing Scale
```typescript
const spacing = {
  xs: 6,    // Tiny gaps
  sm: 8,    // Small gaps
  md: 12,   // Medium gaps
  lg: 16,   // Large gaps (card padding)
  xl: 20,   // Extra large gaps
  xxl: 32,  // Section spacing
  xxxl: 72, // Major section spacing
};
```

#### Layout Dimensions
```typescript
const layout = {
  screenWidth: 375,           // iPhone standard width
  contentWidth: 335,          // Main content area (20px margins)
  cardWidth: 335,             // Full-width cards
  insightCardWidth: 237,      // Insight card width
  scoreCircle: 274,           // Large score circle diameter
  componentBarHeight: 88,     // Score component bar height
  componentBarWidth: 64,      // Score component bar width
  inputHeight: 52,            // Chat input height
  quickActionSize: 64,        // Quick action circle size
};
```

### Border Radius

```typescript
const borderRadius = {
  sm: 2,    // Small elements
  md: 6,    // Cards, buttons, inputs
  lg: 7,    // Special elements with glow
  full: 100, // Circular elements
};
```

### Shadows and Effects

#### Box Shadows
```typescript
const shadows = {
  card: '0px 2px 7.3px rgba(0, 0, 0, 0.5)',  // Standard card shadow
};
```

#### Blur Effects
```typescript
const blur = {
  subtle: 5.4,   // Subtle blur
  medium: 12.3,  // Medium blur for glows
  strong: 20.65, // Strong blur for backgrounds
  heavy: 29.85,  // Heavy blur for gradients
  extreme: 50,   // Extreme blur for large gradients
};
```

#### Opacity Levels
```typescript
const opacity = {
  disabled: 0.15,   // Disabled elements
  tertiary: 0.2,    // Tertiary UI elements
  secondary: 0.35,  // Secondary UI elements
  medium: 0.5,      // Medium emphasis
  high: 0.76,       // High emphasis with transparency
  full: 0.9,        // Nearly opaque
};
```

### Component Specifications

#### Cards
```typescript
const cardStyles = {
  background: '#161612',
  borderRadius: 6,
  boxShadow: '0px 2px 7.3px rgba(0, 0, 0, 0.5)',
  padding: 16,
};
```

#### Buttons
```typescript
const buttonStyles = {
  primary: {
    background: '#BBA53F',  // Golden accent
    color: '#FFFFFF',
    borderRadius: 6,
    height: 52,
    fontSize: 16,
    fontWeight: 500,
  },
  
  icon: {
    size: 32,
    borderRadius: 2,
    background: '#BBA53F',
  },
};
```

#### Input Fields
```typescript
const inputStyles = {
  background: '#0A080B',
  borderRadius: 6,
  height: 52,
  padding: '8px 16px',
  fontSize: 16,
  color: '#FFFFFF',
  placeholderColor: '#BDBDBD',
  boxShadow: '0px 2px 7.3px rgba(0, 0, 0, 0.5)',
  
  // Glow effect
  glowBackground: 'conic-gradient(from 90deg at 50% 50%, #CEA869 0deg, #F0FF80 76.15deg, #FDF3D8 203.48deg, #CEA869 360deg)',
  glowBlur: 6.5,
};
```

#### Score Visualization
```typescript
const scoreVisualization = {
  circle: {
    size: 274,
    strokeWidth: 137, // Half of size for full circle
    background: 'rgba(255, 255, 255, 0.15)', // Base circle
    gradient: 'conic-gradient(...)', // See gradient definitions above
  },
  
  componentBars: {
    width: 64,
    height: 88,
    borderRadius: 6,
    padding: 8,
    gap: 10,
    colors: {
      selfAwareness: '#BDA838',
      boundaries: '#CF802A',
      communication: '#DEAE35',
      attachment: '#9BA23B',
      emotionalRegulation: '#C35829',
    },
  },
};
```

#### Message Bubbles
```typescript
const messageBubbleStyles = {
  user: {
    background: 'linear-gradient(135deg, #BDA838, #DEAE35)', // Golden gradient
    color: '#0A080B',
    borderRadius: 6,
    padding: '12px 16px',
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  
  assistant: {
    background: '#1B1B25',
    color: '#FFFFFF',
    borderRadius: 6,
    padding: '12px 16px',
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
  },
};
```

#### Icons
```typescript
const iconSizes = {
  small: 16,
  medium: 20,
  large: 24,
};

const iconColors = {
  primary: '#FFFFFF',
  accent: '#F0FF80',
  gold: '#CEA869',
};
```

### Animation and Transitions

```typescript
const animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
};
```

### Accessibility

```typescript
const accessibility = {
  minTouchTarget: 44,        // Minimum touch target size (iOS HIG)
  minContrastRatio: 4.5,     // WCAG AA standard for normal text
  minContrastRatioLarge: 3,  // WCAG AA standard for large text
  
  // Ensure all interactive elements meet minimum size
  // Ensure sufficient color contrast for all text
  // Support dynamic type sizing
  // Provide semantic labels for screen readers
};
```

## Components and Interfaces

### Screen Layouts

#### Dashboard/Home Screen

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Status Bar (50px)                   │
├─────────────────────────────────────┤
│ Gradient Header (418px)             │
│   - Date/Time (centered, top)       │
│   - Greeting "Hi HeyLina"           │
│   - User Name (Carattere, 56px)     │
│   - Multiple blur gradient layers   │
├─────────────────────────────────────┤
│ Content Area (scrollable)           │
│   ┌───────────────────────────────┐ │
│   │ EHS Score Card (562px)        │ │
│   │   - Circular score display    │ │
│   │   - Score interpretation      │ │
│   │   - Statistics toggle         │ │
│   │   - Quick action circles      │ │
│   └───────────────────────────────┘ │
│   ┌───────────────────────────────┐ │
│   │ Daily Quote Card (217px)      │ │
│   │   - Quote text                │ │
│   │   - Share button              │ │
│   │   - Pagination dots           │ │
│   └───────────────────────────────┘ │
│   ┌───────────────────────────────┐ │
│   │ Score Breakdown (208px)       │ │
│   │   - Title                     │ │
│   │   - Horizontal scroll bars    │ │
│   │   - Component scores          │ │
│   └───────────────────────────────┘ │
│   ┌───────────────────────────────┐ │
│   │ Clarity Hits (399px)          │ │
│   │   - Title                     │ │
│   │   - Horizontal scroll cards   │ │
│   │   - Insight previews          │ │
│   └───────────────────────────────┘ │
├─────────────────────────────────────┤
│ Bottom Gradient Fade (193px)        │
│   - Chat input with glow            │
│   - "Swipe to open chat" hint       │
│   - Home indicator                  │
└─────────────────────────────────────┘
```

**Key Visual Elements:**
- Personalized greeting with user's name in script font
- Large circular EHS score with conic gradient
- Horizontal scrolling sections for insights and components
- Fixed bottom input with golden glow effect
- Layered gradient backgrounds for depth

#### Chat Screen

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Status Bar                          │
├─────────────────────────────────────┤
│ Navigation Bar                      │
│   ← Back to dashboard               │
├─────────────────────────────────────┤
│ Gradient Header (optional)          │
│   - Greeting prompt                 │
│   - Decorative gradient arc         │
├─────────────────────────────────────┤
│ Message List (scrollable)           │
│   ┌─────────────────────────────┐   │
│   │ Date Separator              │   │
│   │ Tuesday 11, 2025            │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ User Message (right)        │   │
│   │ Golden gradient bubble      │   │
│   └─────────────────────────────┘   │
│   ┌─────────────────────────────┐   │
│   │ Lina Message (left)         │   │
│   │ Dark bubble with text       │   │
│   │ Audio playback option       │   │
│   └─────────────────────────────┘   │
├─────────────────────────────────────┤
│ Input Area (fixed bottom)           │
│   ┌───────────────────────────────┐ │
│   │ Text Input                    │ │
│   │ 🎤 Mic | 🔊 Send Button      │ │
│   └───────────────────────────────┘ │
│   Home Indicator                    │
└─────────────────────────────────────┘
```

**Message States:**
- User messages: Right-aligned, golden gradient background
- Lina messages: Left-aligned, dark background
- Typing indicator: Animated dots
- Voice message: Waveform visualization
- Timestamp: Small, subtle text below messages

#### Score Detail Screen

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Status Bar                          │
├─────────────────────────────────────┤
│ Navigation Bar                      │
│   ← Back to dashboard               │
├─────────────────────────────────────┤
│ Header with gradient                │
│   - Date and time                   │
│   - User greeting                   │
├─────────────────────────────────────┤
│ Large Score Display                 │
│   - Circular visualization          │
│   - Score number (720)              │
│   - Interpretation text             │
├─────────────────────────────────────┤
│ Statistics Section (collapsible)    │
│   - Component breakdown circles     │
│   - Dimension labels                │
├─────────────────────────────────────┤
│ Insights Card                       │
│   - Quote/insight text              │
│   - Timestamp                       │
│   - Share button                    │
├─────────────────────────────────────┤
│ Mood Tracker                        │
│   - Daily mood indicators           │
│   - Color-coded by mood             │
├─────────────────────────────────────┤
│ Today's Clarity Hits                │
│   - Horizontal scroll cards         │
│   - Circular images with glow       │
│   - Insight titles                  │
├─────────────────────────────────────┤
│ Bottom Input                        │
│   - "Swipe to open chat"            │
│   - Chat input preview              │
└─────────────────────────────────────┘
```

#### Mood Tracking Screen

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Status Bar                          │
├─────────────────────────────────────┤
│ Navigation Bar                      │
│   ← Back to dashboard               │
├─────────────────────────────────────┤
│ Title                               │
│   "What is your mood today?"        │
│   Subtitle instruction              │
├─────────────────────────────────────┤
│ Mood Visualization                  │
│   ┌───────────────────────────────┐ │
│   │ Large Circle with Glow        │ │
│   │ Current mood label            │ │
│   │ (e.g., "Fear")                │ │
│   └───────────────────────────────┘ │
├─────────────────────────────────────┤
│ Color Selector                      │
│   ○ ○ ● ○ ○                        │
│   Swipeable slider                  │
├─────────────────────────────────────┤
│ Decorative gradient arc             │
├─────────────────────────────────────┤
│ Next Step (if applicable)           │
│   "Choose nuances" screen           │
│   - Multi-select emotion tags       │
│   - Save button                     │
└─────────────────────────────────────┘
```

### Visual Patterns

#### Horizontal Scrolling Sections
- Used for: Score components, insights, clarity hits
- Container: `overflow-x: scroll`, `gap: 18-20px`
- Items: Fixed width cards (64px for bars, 237px for insight cards)
- Scroll behavior: Smooth, momentum-based
- Visual cue: Partial visibility of next item

#### Circular Progress Indicators
- Base circle: `rgba(255, 255, 255, 0.15)`
- Progress: Conic gradient with golden tones
- Center content: Score value and label
- Size variations: 274px (large), 166px (medium), 64px (small)

#### Glow Effects
- Input fields: Blurred conic gradient behind element
- Score circles: Blurred gradient halo
- Insight cards: Subtle glow around circular images
- Implementation: Duplicate element with blur filter

#### Card Elevation
- All cards: `box-shadow: 0px 2px 7.3px rgba(0, 0, 0, 0.5)`
- Consistent 6px border radius
- Dark backgrounds (#161612, #1B1B25)
- 16px internal padding

#### Gradient Overlays
- Header: Multiple layered gradients with varying blur
- Bottom fade: Linear gradient from transparent to dark
- Purpose: Create depth and focus attention
- Opacity: 0.9 for overlays

#### Typography Hierarchy
- Display text: Carattere font for personalization
- Headings: Instrument Sans Medium (500)
- Body: Instrument Sans Regular (400)
- Labels: Instrument Sans Medium (500), smaller size
- Consistent 120% line height for readability

### Core Components

#### 1. MessageBubble
Displays individual messages in the chat interface with role-based styling.

**Props:**
```typescript
interface MessageBubbleProps {
  message: ChatMessage;
  isLina: boolean;
  onBookmark?: (messageId: string) => void;
  isBookmarked?: boolean;
}
```

**Responsibilities:**
- Render message content with appropriate styling for user vs Lina
- Display timestamp
- Show message status indicators (pending, sent, failed)
- Provide bookmark action for insights

#### 2. ChatInput
Text input component for composing messages to Lina.

**Props:**
```typescript
interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

**Responsibilities:**
- Handle text input with multiline support
- Validate non-empty messages before sending
- Provide send button with disabled state
- Clear input after successful send

#### 3. TypingIndicator
Animated indicator showing Lina is composing a response.

**Props:**
```typescript
interface TypingIndicatorProps {
  visible: boolean;
}
```

#### 4. QuickActions
Displays suggested conversation starters or follow-up prompts.

**Props:**
```typescript
interface QuickActionsProps {
  actions: QuickAction[];
  onSelect: (action: QuickAction) => void;
  visible: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
}
```

#### 5. ScoreCard
Visual representation of the Emotional Health Score.

**Props:**
```typescript
interface ScoreCardProps {
  score: EmotionalHealthScore;
  onViewDetails: () => void;
}
```

**Responsibilities:**
- Display current score with visual indicator (progress circle, gauge)
- Show compassionate interpretation text
- Provide navigation to detailed breakdown

#### 6. ScoreGraph
Timeline visualization of score trends over time.

**Props:**
```typescript
interface ScoreGraphProps {
  dataPoints: ScoreDataPoint[];
  timeRange: 'week' | 'month' | 'all';
  onTimeRangeChange: (range: 'week' | 'month' | 'all') => void;
}
```

### Service Interfaces

#### chatApi

```typescript
interface ChatApi {
  fetchMessages(params: FetchMessagesParams): Promise<MessagesResponse>;
  sendMessage(params: SendMessageParams): Promise<SendMessageResult>;
}

interface FetchMessagesParams {
  limit?: number;
  offset?: number;
  accessToken?: string;
  signal?: AbortSignal;
}

interface SendMessageParams {
  content: string;
  accessToken?: string;
  idempotencyKey?: string;
  signal?: AbortSignal;
}
```

#### scoreApi

```typescript
interface ScoreApi {
  getCurrentScore(accessToken: string): Promise<EmotionalHealthScore>;
  getScoreHistory(params: ScoreHistoryParams): Promise<ScoreHistory>;
  getScoreInsights(accessToken: string): Promise<ScoreInsight[]>;
}

interface ScoreHistoryParams {
  startDate?: string;
  endDate?: string;
  accessToken: string;
}
```

#### userApi

```typescript
interface UserApi {
  getProfile(accessToken: string): Promise<UserProfile>;
  updateProfile(profile: Partial<UserProfile>, accessToken: string): Promise<UserProfile>;
  updateNotificationSettings(settings: NotificationSettings, accessToken: string): Promise<void>;
  requestDataExport(accessToken: string): Promise<{ exportId: string }>;
  deleteAccount(accessToken: string): Promise<void>;
}
```

### Custom Hooks

#### useMessages

```typescript
function useMessages(): {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}
```

**Responsibilities:**
- Fetch and manage message list state
- Handle pagination for message history
- Provide loading and error states
- Support pull-to-refresh

#### useSendMessage

```typescript
function useSendMessage(): {
  sendMessage: (content: string) => Promise<void>;
  isSending: boolean;
  error: string | null;
  optimisticMessage: ChatMessage | null;
}
```

**Responsibilities:**
- Send messages with optimistic UI updates
- Handle retry logic for failed sends
- Generate idempotency keys to prevent duplicates
- Manage sending state and errors

#### useScore

```typescript
function useScore(): {
  score: EmotionalHealthScore | null;
  history: ScoreHistory | null;
  insights: ScoreInsight[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
```

## Data Models

### User Profile

```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  ageRange: '18-24' | '25-29' | '30-34' | '35-39' | '40+';
  city: string;
  relationshipStatus: 'single' | 'dating' | 'in-relationship' | 'complicated';
  primaryGoal: 'healing-breakup' | 'dating-intention' | 'improve-communication' | 'understand-patterns';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Message

```typescript
interface Message {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface ChatMessage extends Message {
  localId?: string; // For optimistic updates
  status?: 'pending' | 'sent' | 'failed';
  isBookmarked?: boolean;
}
```

### Emotional Health Score

```typescript
interface EmotionalHealthScore {
  overall: number; // 0-100
  components: {
    selfAwareness: number;
    boundaries: number;
    communication: number;
    attachmentSecurity: number;
    emotionalRegulation: number;
  };
  interpretation: string; // Compassionate explanation
  lastUpdated: string;
}

interface ScoreDataPoint {
  date: string;
  score: number;
}

interface ScoreHistory {
  dataPoints: ScoreDataPoint[];
  trend: 'improving' | 'stable' | 'declining';
}

interface ScoreInsight {
  id: string;
  component: keyof EmotionalHealthScore['components'];
  title: string;
  description: string;
  suggestedAction: string;
  priority: 'high' | 'medium' | 'low';
}
```

### Conversation History

```typescript
interface Conversation {
  id: string;
  userId: string;
  title: string; // Auto-generated or user-defined
  lastMessageAt: string;
  messageCount: number;
  preview: string; // First few words of last message
}

interface Bookmark {
  id: string;
  userId: string;
  messageId: string;
  message: Message;
  note?: string;
  createdAt: string;
}
```

### Notification Settings

```typescript
interface NotificationSettings {
  enabled: boolean;
  checkIns: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'custom';
    time: string; // HH:MM format
    days?: number[]; // 0-6 for custom frequency
  };
  eventFollowUps: boolean;
  weeklyReflections: boolean;
  scoreUpdates: boolean;
}
```

### Subscription

```typescript
interface Subscription {
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  tier: 'free' | 'premium';
  trialStartDate?: string;
  trialEndDate?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Valid credentials create authenticated sessions

*For any* valid email and password combination, when a user signs up, the system should create an account, authenticate the user, and store authentication tokens securely in device storage.

**Validates: Requirements 1.3, 1.5**

### Property 2: Invalid credentials are rejected with specific errors

*For any* invalid credential input (malformed email, weak password, empty fields), when a user attempts to sign up, the system should display specific validation errors and prevent account creation.

**Validates: Requirements 1.4**

### Property 3: Onboarding completion enables main app access

*For any* user who completes all required onboarding steps (profile setup, goal selection, expectation acknowledgment), the system should mark onboarding as complete and navigate to the main chat interface.

**Validates: Requirements 2.4**

### Property 4: Incomplete onboarding blocks progression

*For any* combination of missing required onboarding fields, the system should prevent progression to the next step until all required fields are completed.

**Validates: Requirements 2.5**

### Property 5: User preferences persist across sessions

*For any* user preference update (profile information, notification settings, goal changes), when the user saves changes and later retrieves their settings, the system should return the updated values.

**Validates: Requirements 2.2, 7.4, 9.2**

### Property 6: Message submission triggers backend communication

*For any* non-empty message content, when a user submits a message, the system should send it to the backend service and display a typing indicator while waiting for response.

**Validates: Requirements 3.2**

### Property 7: Backend responses are displayed correctly

*For any* response received from the backend service, the system should display Lina's message in the chat interface with appropriate formatting and clear visual distinction from user messages.

**Validates: Requirements 3.3, 3.4**

### Property 8: Quick actions send corresponding messages

*For any* quick action prompt, when a user taps it, the system should send the associated message content to Lina as if the user had typed it manually.

**Validates: Requirements 4.2**

### Property 9: Active typing hides quick actions

*For any* chat state where the user is actively typing (input has focus and contains text), the system should hide quick action prompts to avoid interface clutter.

**Validates: Requirements 4.4**

### Property 10: Historical data enables trend visualization

*For any* user with sufficient historical score data (multiple data points over time), the system should display trends using a graph or timeline visualization.

**Validates: Requirements 5.3**

### Property 11: Score insights include actionable suggestions

*For any* score insight displayed to the user, the system should include specific suggested actions or conversation topics to improve that dimension.

**Validates: Requirements 5.5**

### Property 12: Chat sessions are ordered by recency

*For any* set of chat sessions in the history view, the system should display them sorted by most recent activity first.

**Validates: Requirements 6.1**

### Property 13: Session selection displays full conversation

*For any* chat session selected from the history view, the system should retrieve and display the complete message history for that session.

**Validates: Requirements 6.2**

### Property 14: Bookmark round-trip preserves messages

*For any* message that a user bookmarks, when the user later views their bookmarks, the system should display that message with surrounding context.

**Validates: Requirements 6.3, 6.4**

### Property 15: Search returns matching conversations

*For any* search query entered by the user, the system should return chat sessions and messages that contain terms matching the query.

**Validates: Requirements 6.5**

### Property 16: Notification taps navigate with context

*For any* notification that a user taps, the system should open the chat interface with context related to the notification prompt.

**Validates: Requirements 7.2**

### Property 17: Trial start communicates billing timeline

*For any* user who starts a free trial, the system should clearly display the trial start date, end date, and when billing will begin.

**Validates: Requirements 8.3**

### Property 18: Subscription purchase grants access

*For any* successful subscription purchase, the system should immediately update the user's access level to premium and confirm the transaction.

**Validates: Requirements 8.5**

### Property 19: Logout clears authentication state

*For any* user who logs out, the system should clear authentication tokens from secure storage and navigate to the login screen.

**Validates: Requirements 9.5**

### Property 20: Safety warnings appear for flagged content

*For any* message where the backend service detects high-risk topics, the system should display inline warnings with links to professional resources.

**Validates: Requirements 10.2**

### Property 21: Offline messages are queued and sent

*For any* message sent while network connectivity is unavailable, the system should queue the message locally and send it when connectivity is restored.

**Validates: Requirements 11.2**

### Property 22: Error logs exclude sensitive data

*For any* error that occurs in the system, when logging the error, the system should not include personally identifiable information or sensitive user data in the log output.

**Validates: Requirements 11.3**

## Error Handling

### Error Categories and Strategies

#### 1. Network Errors

**Scenarios:**
- Backend service unavailable
- Request timeout
- Network connectivity lost during operation
- DNS resolution failures

**Handling Strategy:**
- Display user-friendly error messages that avoid technical jargon
- Provide retry mechanisms with exponential backoff
- Implement offline queue for messages sent without connectivity
- Show connection status indicators when appropriate
- Cache recent data for offline viewing

**User Experience:**
- "We're having trouble connecting. Your message is safe and will be sent when connection is restored."
- "Lina is taking longer than usual to respond. Please check your connection."

#### 2. Authentication Errors

**Scenarios:**
- Invalid credentials during login
- Expired authentication tokens
- Session conflicts (logged in on another device)
- Password reset failures

**Handling Strategy:**
- Provide specific validation feedback for credential issues
- Implement automatic token refresh before expiration
- Prompt for re-authentication when tokens expire
- Preserve unsaved conversation context during re-auth
- Clear sensitive data on authentication failures

**User Experience:**
- "Email or password is incorrect. Please try again."
- "Your session has expired. Please sign in again to continue."

#### 3. Validation Errors

**Scenarios:**
- Empty or whitespace-only message input
- Invalid email format during signup
- Weak passwords that don't meet requirements
- Missing required onboarding fields

**Handling Strategy:**
- Validate input on the client side before submission
- Provide inline validation feedback as user types
- Display clear, specific error messages near the relevant field
- Prevent form submission until validation passes
- Highlight invalid fields with visual indicators

**User Experience:**
- "Please enter a message to send to Lina."
- "Password must be at least 8 characters with a mix of letters and numbers."

#### 4. Backend Processing Errors

**Scenarios:**
- AI service failures or timeouts
- Rate limiting exceeded
- Unexpected server errors (5xx)
- Malformed responses from backend

**Handling Strategy:**
- Implement request timeouts (30 seconds for chat)
- Parse and handle error responses from backend
- Log errors securely for debugging
- Provide graceful degradation where possible
- Show reassuring messages that don't blame the user

**User Experience:**
- "Something went wrong, but your message is safe. Let's try that again."
- "Lina is experiencing high demand right now. Please try again in a moment."

#### 5. Data Integrity Errors

**Scenarios:**
- Local storage corruption
- Failed data migrations
- Inconsistent state between local and remote
- Concurrent modification conflicts

**Handling Strategy:**
- Implement data validation on read operations
- Use versioning for local storage schemas
- Provide migration paths for schema changes
- Implement conflict resolution for concurrent edits
- Maintain backup of critical data before migrations

**User Experience:**
- "We need to refresh your data. This will only take a moment."
- "There was an issue syncing your data. We're fixing it now."

#### 6. Permission Errors

**Scenarios:**
- Notification permissions denied
- Storage permissions unavailable
- Camera/photo library access denied (future features)

**Handling Strategy:**
- Request permissions at contextually appropriate times
- Explain why permissions are needed before requesting
- Provide fallback functionality when permissions denied
- Guide users to settings if they need to change permissions
- Never block core functionality due to optional permissions

**User Experience:**
- "To send you check-in reminders, we need notification permission. You can enable this in Settings."
- "Notifications are disabled. You can enable them anytime in Settings."

### Error Recovery Patterns

#### Retry with Exponential Backoff

```typescript
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

#### Optimistic Updates with Rollback

```typescript
// Add message optimistically
const optimisticMessage = {
  localId: generateLocalId(),
  content: userInput,
  role: 'user',
  status: 'pending',
  createdAt: new Date().toISOString(),
};
setMessages(prev => [...prev, optimisticMessage]);

try {
  const result = await sendMessage({ content: userInput });
  // Replace optimistic message with server response
  setMessages(prev => 
    prev.map(msg => 
      msg.localId === optimisticMessage.localId 
        ? { ...result.userMessage, status: 'sent' }
        : msg
    )
  );
} catch (error) {
  // Mark message as failed, allow retry
  setMessages(prev =>
    prev.map(msg =>
      msg.localId === optimisticMessage.localId
        ? { ...msg, status: 'failed' }
        : msg
    )
  );
}
```

#### Graceful Degradation

When features are unavailable, provide reduced functionality:
- If score service is down, show cached score with "last updated" timestamp
- If history service is down, show local message cache
- If AI service is slow, show extended typing indicator with reassuring message

## Testing Strategy

### Overview

The HeyLina Mobile MVP employs a dual testing approach combining unit tests for specific scenarios and property-based tests for universal correctness properties. This comprehensive strategy ensures both concrete functionality and general system behavior are verified.

### Unit Testing

**Framework:** Jest (included with React Native)

**Scope:**
- Component rendering and user interactions
- Service layer API calls and error handling
- Custom hooks state management
- Utility functions and data transformations
- Navigation flows
- Specific edge cases and error conditions

**Key Test Suites:**

1. **Authentication Tests**
   - Login with valid credentials succeeds
   - Login with invalid credentials shows error
   - Signup creates account and navigates to onboarding
   - Token storage and retrieval works correctly
   - Logout clears tokens and navigates to login

2. **Chat Interface Tests**
   - MessageBubble renders user and Lina messages differently
   - ChatInput validates non-empty messages
   - TypingIndicator shows/hides based on loading state
   - QuickActions display and trigger message sends
   - Message list scrolls to bottom on new message

3. **Score Display Tests**
   - ScoreCard displays score value and interpretation
   - ScoreGraph renders with historical data points
   - Score insights show actionable suggestions
   - Empty state shown when no score data available

4. **History and Bookmarks Tests**
   - Conversation list displays sessions sorted by recency
   - Tapping conversation navigates to detail view
   - Bookmark action saves message reference
   - Bookmarks view displays saved messages with context

5. **Settings Tests**
   - Profile updates persist correctly
   - Notification settings save and apply
   - Logout confirmation dialog appears
   - Data export request initiates successfully

6. **Error Handling Tests**
   - Network errors show retry option
   - Timeout errors display appropriate message
   - Validation errors appear inline
   - Offline messages queue correctly

**Example Unit Test:**

```typescript
describe('ChatInput', () => {
  it('should prevent sending empty messages', () => {
    const onSend = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
      <ChatInput onSend={onSend} placeholder="Message Lina..." />
    );
    
    const input = getByPlaceholderText('Message Lina...');
    const sendButton = getByRole('button');
    
    fireEvent.changeText(input, '   '); // Only whitespace
    fireEvent.press(sendButton);
    
    expect(onSend).not.toHaveBeenCalled();
  });
  
  it('should send non-empty messages and clear input', () => {
    const onSend = jest.fn();
    const { getByPlaceholderText, getByRole } = render(
      <ChatInput onSend={onSend} placeholder="Message Lina..." />
    );
    
    const input = getByPlaceholderText('Message Lina...');
    const sendButton = getByRole('button');
    
    fireEvent.changeText(input, 'Hello Lina');
    fireEvent.press(sendButton);
    
    expect(onSend).toHaveBeenCalledWith('Hello Lina');
    expect(input.props.value).toBe('');
  });
});
```

### Property-Based Testing

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Each property test must reference its corresponding design document property
- Tag format: `// Feature: heylina-mobile-mvp, Property {number}: {property_text}`

**Scope:**
- Universal behaviors that should hold across all inputs
- Data transformation invariants
- Round-trip properties (save/load, serialize/deserialize)
- Ordering and filtering correctness
- State consistency after operations

**Key Property Tests:**

1. **Authentication Properties**
   - Property 1: Valid credentials create authenticated sessions
   - Property 2: Invalid credentials are rejected with specific errors
   - Property 19: Logout clears authentication state

2. **Onboarding Properties**
   - Property 3: Onboarding completion enables main app access
   - Property 4: Incomplete onboarding blocks progression
   - Property 5: User preferences persist across sessions

3. **Chat Properties**
   - Property 6: Message submission triggers backend communication
   - Property 7: Backend responses are displayed correctly
   - Property 8: Quick actions send corresponding messages
   - Property 9: Active typing hides quick actions

4. **Score Properties**
   - Property 10: Historical data enables trend visualization
   - Property 11: Score insights include actionable suggestions

5. **History Properties**
   - Property 12: Chat sessions are ordered by recency
   - Property 13: Session selection displays full conversation
   - Property 14: Bookmark round-trip preserves messages
   - Property 15: Search returns matching conversations

6. **Notification Properties**
   - Property 16: Notification taps navigate with context

7. **Subscription Properties**
   - Property 17: Trial start communicates billing timeline
   - Property 18: Subscription purchase grants access

8. **Error Handling Properties**
   - Property 20: Safety warnings appear for flagged content
   - Property 21: Offline messages are queued and sent
   - Property 22: Error logs exclude sensitive data

**Example Property Test:**

```typescript
import fc from 'fast-check';

// Feature: heylina-mobile-mvp, Property 12: Chat sessions are ordered by recency
describe('Property 12: Chat sessions are ordered by recency', () => {
  it('should always display chat sessions sorted by most recent first', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            userId: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 50 }),
            lastMessageAt: fc.date({ min: new Date('2024-01-01'), max: new Date() }).map(d => d.toISOString()),
            messageCount: fc.integer({ min: 1, max: 100 }),
            preview: fc.string({ minLength: 1, maxLength: 100 }),
          }),
          { minLength: 2, maxLength: 20 }
        ),
        (sessions) => {
          // Sort sessions using the app's sorting logic
          const sorted = sortChatSessionsByRecency(sessions);
          
          // Verify that each session is more recent than or equal to the next
          for (let i = 0; i < sorted.length - 1; i++) {
            const current = new Date(sorted[i].lastMessageAt);
            const next = new Date(sorted[i + 1].lastMessageAt);
            expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: heylina-mobile-mvp, Property 14: Bookmark round-trip preserves messages
describe('Property 14: Bookmark round-trip preserves messages', () => {
  it('should preserve message content and context through bookmark save and retrieval', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          userId: fc.uuid(),
          role: fc.constantFrom('user', 'assistant'),
          content: fc.string({ minLength: 1, maxLength: 500 }),
          createdAt: fc.date().map(d => d.toISOString()),
        }),
        async (message) => {
          // Bookmark the message
          const bookmarkId = await bookmarkMessage(message.id);
          
          // Retrieve bookmarks
          const bookmarks = await getBookmarks();
          const savedBookmark = bookmarks.find(b => b.id === bookmarkId);
          
          // Verify message is preserved
          expect(savedBookmark).toBeDefined();
          expect(savedBookmark.message.id).toBe(message.id);
          expect(savedBookmark.message.content).toBe(message.content);
          expect(savedBookmark.message.role).toBe(message.role);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Integration Testing

**Scope:**
- End-to-end user flows across multiple screens
- Backend API integration
- Authentication flow from signup to authenticated state
- Message send and receive flow
- Navigation between major app sections

**Key Integration Tests:**
1. Complete onboarding flow from signup to first chat
2. Send message, receive response, bookmark insight
3. View score, navigate to details, return to chat
4. Update profile settings, verify changes persist
5. Logout and login, verify session restoration

### Test Data Management

**Generators for Property Tests:**

```typescript
// Smart generators that constrain to valid input space

const validEmailGen = fc.emailAddress();

const validPasswordGen = fc.string({ minLength: 8, maxLength: 128 })
  .filter(pwd => /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd));

const invalidEmailGen = fc.oneof(
  fc.constant(''),
  fc.constant('notanemail'),
  fc.constant('@example.com'),
  fc.constant('user@'),
);

const messageContentGen = fc.string({ minLength: 1, maxLength: 2000 })
  .filter(s => s.trim().length > 0);

const conversationGen = fc.array(
  fc.record({
    role: fc.constantFrom('user', 'assistant'),
    content: messageContentGen,
    createdAt: fc.date().map(d => d.toISOString()),
  }),
  { minLength: 1, maxLength: 50 }
);
```

### Test Coverage Goals

- Unit test coverage: >80% for service layer and custom hooks
- Component test coverage: >70% for UI components
- Property test coverage: 100% of defined correctness properties
- Integration test coverage: All critical user journeys

### Continuous Testing

- Run unit tests on every commit
- Run property tests on pull requests
- Run integration tests before releases
- Monitor test execution time and optimize slow tests
- Fail builds on test failures or coverage drops

## Performance Considerations

### Key Performance Metrics

1. **App Launch Time**
   - Target: <2 seconds from tap to interactive
   - Optimize: Lazy load features, minimize initial bundle size

2. **Chat Message Latency**
   - Target: <500ms for message to appear in UI after send
   - Optimize: Optimistic updates, efficient re-renders

3. **AI Response Time**
   - Target: <5 seconds for Lina's response (backend dependent)
   - Optimize: Show typing indicator, stream responses if possible

4. **Screen Navigation**
   - Target: <300ms transition between screens
   - Optimize: Use native navigation, avoid heavy computations during transitions

5. **Memory Usage**
   - Target: <150MB for typical usage session
   - Optimize: Paginate message history, release unused resources

### Optimization Strategies

#### 1. Message List Virtualization

Use FlatList with proper optimization props:

```typescript
<FlatList
  data={messages}
  renderItem={({ item }) => <MessageBubble message={item} />}
  keyExtractor={(item) => item.id}
  initialNumToRender={20}
  maxToRenderPerBatch={10}
  windowSize={21}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ESTIMATED_MESSAGE_HEIGHT,
    offset: ESTIMATED_MESSAGE_HEIGHT * index,
    index,
  })}
/>
```

#### 2. Image and Asset Optimization

- Use WebP format for images where supported
- Implement lazy loading for images in message history
- Cache frequently accessed assets
- Use appropriate image sizes for different screen densities

#### 3. State Management Optimization

- Use React.memo for components that don't need frequent re-renders
- Implement useMemo and useCallback for expensive computations
- Avoid unnecessary context re-renders by splitting contexts

#### 4. Network Optimization

- Implement request deduplication
- Use HTTP caching headers appropriately
- Batch multiple API calls when possible
- Implement pagination for large data sets

#### 5. Bundle Size Optimization

- Use dynamic imports for feature modules
- Remove unused dependencies
- Enable Hermes JavaScript engine for Android
- Implement code splitting for web platform

### Monitoring and Profiling

- Use React Native Performance Monitor in development
- Implement analytics for key performance metrics
- Monitor crash rates and error frequencies
- Track API response times and failure rates
- Use Flipper for debugging and profiling

## Security Considerations

### Data Protection

1. **Authentication Tokens**
   - Store in expo-secure-store (encrypted keychain on iOS, Keystore on Android)
   - Never log tokens or include in error messages
   - Implement automatic token refresh
   - Clear tokens on logout and account deletion

2. **Sensitive User Data**
   - Encrypt conversation data at rest if storing locally
   - Use HTTPS for all network communication
   - Implement certificate pinning for production
   - Validate and sanitize all user inputs

3. **Privacy Controls**
   - Provide clear data export functionality
   - Implement account deletion with data purge
   - Allow users to delete individual conversations
   - Respect user notification preferences

### API Security

1. **Request Authentication**
   - Include bearer token in Authorization header
   - Implement request signing for sensitive operations
   - Use idempotency keys for message sends

2. **Input Validation**
   - Validate all inputs on client before sending
   - Sanitize user-generated content
   - Implement rate limiting on client side
   - Prevent injection attacks

3. **Error Handling**
   - Never expose internal error details to users
   - Log errors securely without PII
   - Implement proper error boundaries
   - Handle edge cases gracefully

### Compliance

- GDPR compliance for EU users
- CCPA compliance for California users
- Clear privacy policy and terms of service
- Obtain explicit consent for data processing
- Provide data portability and deletion rights

## Deployment and Release Strategy

### Build Configuration

**Development:**
- Debug builds with source maps
- Verbose logging enabled
- Development API endpoints
- Fast refresh enabled

**Staging:**
- Release builds with obfuscation
- Limited logging
- Staging API endpoints
- Performance monitoring enabled

**Production:**
- Optimized release builds
- Minimal logging (errors only)
- Production API endpoints
- Full monitoring and analytics

### Release Process

1. **Version Numbering**
   - Follow semantic versioning (MAJOR.MINOR.PATCH)
   - Increment MAJOR for breaking changes
   - Increment MINOR for new features
   - Increment PATCH for bug fixes

2. **Testing Gates**
   - All unit tests pass
   - All property tests pass
   - Integration tests pass
   - Manual QA on key flows
   - Performance benchmarks met

3. **Phased Rollout**
   - Internal testing (TestFlight/Internal Testing)
   - Beta testing with select users (10-50 users)
   - Staged rollout (10% → 50% → 100%)
   - Monitor crash rates and key metrics at each stage

4. **Rollback Plan**
   - Ability to halt rollout at any percentage
   - Revert to previous version if critical issues found
   - Communicate issues to users transparently

### App Store Presence

**iOS (App Store):**
- App name: HeyLina
- Category: Health & Fitness / Lifestyle
- Age rating: 17+ (due to mature relationship content)
- Privacy labels: Data collection clearly disclosed
- Screenshots highlighting key features

**Android (Google Play):**
- App name: HeyLina
- Category: Health & Fitness
- Content rating: Mature 17+
- Data safety section completed
- Feature graphic and screenshots

### Post-Launch Monitoring

- Track daily/weekly active users
- Monitor crash-free rate (target: >99.5%)
- Track key conversion metrics (signup, trial start, subscription)
- Monitor API error rates and latency
- Collect user feedback through in-app prompts and reviews
- Analyze user retention cohorts

## Future Considerations

### Scalability

- Implement message pagination and infinite scroll
- Add conversation archiving for old chats
- Optimize database queries as data grows
- Consider CDN for static assets

### Feature Expansion

- Voice input for messages
- Image sharing in conversations
- Relationship timeline visualization
- Community features (anonymous sharing)
- Integration with calendar for date tracking
- Couples mode for shared guidance

### Technical Debt Management

- Regular dependency updates
- Refactor legacy code as features evolve
- Maintain comprehensive documentation
- Conduct periodic security audits
- Review and optimize performance regularly

### Accessibility

- Support screen readers (VoiceOver, TalkBack)
- Implement proper semantic labels
- Ensure sufficient color contrast
- Support dynamic text sizing
- Provide keyboard navigation for web

### Internationalization

- Prepare for multi-language support
- Externalize all user-facing strings
- Consider cultural differences in relationship advice
- Adapt tone and content for different markets
