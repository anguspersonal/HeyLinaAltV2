# Accessibility Testing Checklist

## Pre-Testing Setup

### iOS (VoiceOver)
1. Open Settings → Accessibility → VoiceOver
2. Enable VoiceOver
3. Optional: Enable "Speak Hints" for more detailed feedback
4. Optional: Adjust speaking rate in VoiceOver settings

**VoiceOver Gestures:**
- **Swipe right**: Move to next element
- **Swipe left**: Move to previous element
- **Double tap**: Activate selected element
- **Two-finger tap**: Pause/resume speaking
- **Three-finger swipe up/down**: Scroll
- **Two-finger scrub (Z-pattern)**: Go back
- **Rotor (two-finger rotate)**: Change navigation mode

### Android (TalkBack)
1. Open Settings → Accessibility → TalkBack
2. Enable TalkBack
3. Complete the tutorial if first time

**TalkBack Gestures:**
- **Swipe right**: Move to next element
- **Swipe left**: Move to previous element
- **Double tap**: Activate selected element
- **Two-finger swipe down**: Read from top
- **Two-finger swipe up**: Read from current position
- **Swipe down then right**: Go to next reading control
- **Swipe up then right**: Go to previous reading control

## Testing Checklist

### 1. Authentication Screens

#### Login Screen
- [ ] Screen title is announced as header
- [ ] Email input has clear label "Email address"
- [ ] Password input has clear label "Password"
- [ ] Validation errors are announced immediately
- [ ] Sign in button state (enabled/disabled) is clear
- [ ] Loading state is announced
- [ ] "Create account" link is accessible
- [ ] Tab order is logical: email → password → sign in → create account

#### Signup Screen
- [ ] All form fields have descriptive labels
- [ ] Password requirements are announced
- [ ] Validation errors are clear and actionable
- [ ] Success/failure feedback is provided

### 2. Onboarding Flow

#### Welcome Screen
- [ ] Welcome message is announced
- [ ] Tagline is readable
- [ ] "Get started" button is accessible
- [ ] Swipe gestures work with screen reader

#### Profile Setup
- [ ] All form fields have labels
- [ ] Dropdown selections are announced
- [ ] Required fields are indicated
- [ ] Progress through onboarding is clear

#### Expectation Setting
- [ ] Disclaimers are announced
- [ ] Crisis resources are accessible
- [ ] Terms acceptance is clear
- [ ] "Continue" button state is clear

### 3. Dashboard/Home Screen

#### Header
- [ ] Personalized greeting is announced
- [ ] Date and time are formatted for screen readers
- [ ] User name is readable

#### Score Card
- [ ] Score value is announced with context (e.g., "720 out of 1000")
- [ ] Interpretation text is readable
- [ ] "View Statistics" button state (expanded/collapsed) is clear
- [ ] Component breakdown items are announced with values
- [ ] Quick action buttons are accessible

#### Daily Quote
- [ ] Quote text is readable
- [ ] Share button is accessible
- [ ] Pagination dots indicate position

#### Clarity Hits
- [ ] Section header is announced
- [ ] Horizontal scroll is accessible
- [ ] Each insight card is accessible
- [ ] Bookmark and like actions are clear

#### Bottom Input Preview
- [ ] Input preview is accessible
- [ ] "Swipe to open chat" hint is announced
- [ ] Navigation to chat works

### 4. Chat Screen

#### Message List
- [ ] Messages are announced with sender and timestamp
- [ ] User messages are distinguished from Lina messages
- [ ] Message status (pending, sent, failed) is announced
- [ ] Scroll position is maintained
- [ ] Date separators are announced

#### Message Bubbles
- [ ] Long press hint for bookmarking is announced
- [ ] Bookmark action is accessible
- [ ] Retry button for failed messages is accessible
- [ ] Message content is fully readable

#### Chat Input
- [ ] Input field has clear label
- [ ] Character count (if shown) is announced
- [ ] Send button state is clear
- [ ] Voice input button (when available) is accessible
- [ ] Success feedback when message is sent

#### Quick Actions
- [ ] Section header is announced
- [ ] Horizontal scroll is accessible
- [ ] Each quick action is accessible with clear label
- [ ] Selection feedback is provided

#### Typing Indicator
- [ ] "Lina is typing" is announced
- [ ] Animation respects reduce motion preference

### 5. History/Explore Screen

#### Conversation List
- [ ] Each conversation card is accessible
- [ ] Conversation preview is readable
- [ ] Timestamp is formatted for screen readers
- [ ] Selection navigates to detail view

#### Search
- [ ] Search input has clear label
- [ ] Search results are announced
- [ ] "No results" state is announced
- [ ] Clear search button is accessible

#### Bookmarks
- [ ] Bookmarked messages are accessible
- [ ] Context around bookmark is provided
- [ ] Unbookmark action is accessible
- [ ] Navigation to full conversation works

### 6. Settings Screen

#### Settings List
- [ ] Each setting item is accessible
- [ ] Subtitles provide additional context
- [ ] Navigation to detail screens works
- [ ] Destructive actions (logout, delete) are clearly marked

#### Profile Edit
- [ ] All form fields have labels
- [ ] Save button state is clear
- [ ] Success/error feedback is provided

#### Notifications
- [ ] Toggle switches announce state
- [ ] Time picker is accessible
- [ ] Changes are saved and confirmed

#### Data & Privacy
- [ ] Export data button is accessible
- [ ] Delete account button is accessible and clearly marked as destructive
- [ ] Confirmation dialogs are accessible
- [ ] Safety resources are accessible

### 7. Score Detail Screen

#### Score Display
- [ ] Large score value is announced with context
- [ ] Interpretation is readable
- [ ] Trend information is accessible

#### Component Breakdown
- [ ] Each component is announced with value
- [ ] Color coding is not the only indicator
- [ ] Descriptions are clear

#### Insights
- [ ] Each insight is accessible
- [ ] Suggested actions are clear
- [ ] Bookmark and share actions work

### 8. Subscription/Paywall

#### Paywall Screen
- [ ] Benefits list is accessible
- [ ] Pricing information is clear
- [ ] Trial period is announced
- [ ] Subscribe button is accessible
- [ ] Restore purchases button is accessible

### 9. Error States

#### Network Errors
- [ ] Error messages are announced immediately
- [ ] Retry actions are accessible
- [ ] Offline indicator is announced

#### Validation Errors
- [ ] Errors are announced when they occur
- [ ] Error messages are clear and actionable
- [ ] Focus moves to error location

#### Loading States
- [ ] Loading indicators are announced
- [ ] Skeleton loaders are accessible
- [ ] Timeout errors are handled

### 10. Navigation

#### Tab Bar
- [ ] Each tab is accessible
- [ ] Selected state is announced
- [ ] Tab position is indicated (e.g., "1 of 4")
- [ ] Icons have text labels

#### Back Navigation
- [ ] Back buttons are accessible
- [ ] Back action is clear
- [ ] Navigation hierarchy is maintained

#### Deep Links
- [ ] Deep link navigation works with screen reader
- [ ] Context is preserved
- [ ] User is oriented after navigation

## Color Contrast Testing

### Automated Testing
Run the contrast validation:
```typescript
import { validateColorContrast } from '@/lib/accessibility';

// In development, this will log warnings for low contrast
validateColorContrast('#FFFFFF', '#0A080B', 'Primary text');
```

### Manual Testing
Use browser DevTools or accessibility tools to verify:
- [ ] All text meets 4.5:1 contrast ratio (normal text)
- [ ] Large text meets 3:1 contrast ratio
- [ ] UI components meet 3:1 contrast ratio
- [ ] Focus indicators are visible

## Dynamic Text Sizing

### iOS
1. Settings → Display & Brightness → Text Size
2. Adjust slider to different sizes
3. Test app at each size

### Android
1. Settings → Display → Font size
2. Adjust to different sizes
3. Test app at each size

**Test Points:**
- [ ] Text scales appropriately
- [ ] Layout doesn't break at 200% scale
- [ ] No text truncation at large sizes
- [ ] Touch targets remain accessible
- [ ] Scrolling works at all sizes

## Reduce Motion Testing

### iOS
1. Settings → Accessibility → Motion → Reduce Motion
2. Enable Reduce Motion

### Android
1. Settings → Accessibility → Remove animations
2. Enable

**Test Points:**
- [ ] Animations are disabled or simplified
- [ ] Transitions are instant or very brief
- [ ] No parallax effects
- [ ] Loading indicators still work
- [ ] Functionality is not affected

## Keyboard Navigation (Web/Desktop)

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Enter/Space activate buttons
- [ ] Escape closes modals
- [ ] Arrow keys navigate lists

## Common Issues to Check

### Missing Labels
- [ ] No unlabeled buttons or inputs
- [ ] No "button" or "image" generic labels
- [ ] No empty accessibility labels

### Poor Labels
- [ ] Labels are descriptive, not just "button" or "tap here"
- [ ] Labels provide context
- [ ] Labels don't repeat unnecessarily

### Incorrect Roles
- [ ] Buttons are marked as buttons
- [ ] Links are marked as links
- [ ] Headers are marked as headers
- [ ] Text is marked as text

### Missing State
- [ ] Selected/unselected state is announced
- [ ] Expanded/collapsed state is announced
- [ ] Disabled state is announced
- [ ] Loading/busy state is announced

### Poor Focus Management
- [ ] Focus moves logically
- [ ] Focus is visible
- [ ] Focus is trapped in modals
- [ ] Focus returns after modal closes

### Color-Only Information
- [ ] Error states have text, not just red color
- [ ] Success states have text, not just green color
- [ ] Status is conveyed through text and icons

## Automated Testing

Run accessibility tests:
```bash
# Run all accessibility tests
npm test -- --testPathPattern=accessibility

# Run specific test file
npm test -- lib/__tests__/accessibility.test.ts --no-watch
```

## Reporting Issues

When reporting accessibility issues, include:
1. **Device/OS**: iOS 17, Android 14, etc.
2. **Screen reader**: VoiceOver, TalkBack, etc.
3. **Screen**: Which screen the issue occurs on
4. **Steps to reproduce**: Exact steps to encounter the issue
5. **Expected behavior**: What should happen
6. **Actual behavior**: What actually happens
7. **Severity**: Critical, High, Medium, Low

## Resources

- [iOS Accessibility Inspector](https://developer.apple.com/library/archive/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)
- [Android Accessibility Scanner](https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
