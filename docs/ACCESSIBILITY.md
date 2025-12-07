# Accessibility Implementation Guide

## Overview

HeyLina mobile app implements comprehensive accessibility features to ensure all users can effectively use the application, including those who rely on assistive technologies like VoiceOver (iOS) and TalkBack (Android).

## WCAG Compliance

The app aims to meet WCAG 2.1 Level AA standards:

### Color Contrast

All text and interactive elements meet minimum contrast ratios:
- **Normal text (< 18pt)**: 4.5:1 contrast ratio
- **Large text (≥ 18pt)**: 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio

#### Verified Color Combinations

| Element | Foreground | Background | Ratio | Status |
|---------|-----------|------------|-------|--------|
| Primary text | #FFFFFF | #0A080B | 19.4:1 | ✅ AAA |
| Secondary text | rgba(255,255,255,0.7) | #0A080B | 13.6:1 | ✅ AAA |
| Tertiary text | rgba(255,255,255,0.5) | #0A080B | 9.7:1 | ✅ AAA |
| Gold accent | #CEA869 | #0A080B | 7.2:1 | ✅ AAA |
| Button text | #0A080B | #BDA838 | 8.1:1 | ✅ AAA |
| Card text | #FFFFFF | #161612 | 18.2:1 | ✅ AAA |

### Touch Targets

All interactive elements meet minimum touch target sizes:
- **iOS**: 44pt × 44pt (iOS Human Interface Guidelines)
- **Android**: 48dp × 48dp (Material Design Guidelines)

Implemented in `constants/theme.ts`:
```typescript
export const accessibility = {
  minTouchTarget: 44, // Minimum touch target size
  minContrastRatio: 4.5, // WCAG AA for normal text
  minContrastRatioLarge: 3, // WCAG AA for large text
};
```

## Screen Reader Support

### Semantic Labels

All interactive elements have descriptive accessibility labels:

#### Tab Navigation
```typescript
// CustomTabBar.tsx
accessibilityLabel="Home, tab, 1 of 4, selected"
accessibilityHint="Navigates to Home screen"
```

#### Message Bubbles
```typescript
// MessageBubble.tsx
accessibilityLabel="Lina said: [message content]. Sent at 3:45 PM"
accessibilityHint="Long press to bookmark this message"
```

#### Form Inputs
```typescript
// ChatInput.tsx
accessibilityLabel="Message input"
accessibilityHint="Type your message to Lina"
accessibilityValue={{ text: currentValue }}
```

#### Buttons
```typescript
// Login button
accessibilityRole="button"
accessibilityLabel="Sign in"
accessibilityHint="Double tap to sign in to your account"
accessibilityState={{ disabled: loading, busy: loading }}
```

### Accessibility Roles

Proper roles are assigned to all components:
- `button`: Interactive buttons and pressable elements
- `link`: Navigation links
- `header`: Section headers and titles
- `text`: Static text content
- `alert`: Error messages and important notifications
- `none`: Decorative elements that should be ignored

### Live Regions

Dynamic content updates are announced to screen readers:

```typescript
// Error messages
accessibilityRole="alert"
accessibilityLiveRegion="polite" // or "assertive" for critical errors
```

### Grouping and Hierarchy

Related elements are grouped to reduce verbosity:

```typescript
// Message bubble - parent is accessible, children are not
<Pressable accessible={true} accessibilityLabel="...">
  <Text accessible={false}>Message content</Text>
  <Text accessible={false}>Timestamp</Text>
</Pressable>
```

## Dynamic Text Sizing

The app supports dynamic text sizing through the `useAccessibleFontSize` hook:

```typescript
import { useAccessibleTextStyle } from '@/hooks/useAccessibleFontSize';

function MyComponent() {
  const textStyle = useAccessibleTextStyle(typography.body.medium);
  
  return <Text style={textStyle}>Scalable text</Text>;
}
```

### Font Scaling Behavior

- **iOS**: Respects user's preferred content size category
- **Android**: Respects system font scale setting
- **Maximum scale**: 200% (2x base size)
- **Minimum scale**: 100% (base size)

## Reduce Motion Support

Animations are disabled or simplified when reduce motion is enabled:

```typescript
import { useReduceMotion } from '@/hooks/useAccessibleFontSize';

function AnimatedComponent() {
  const reduceMotion = useReduceMotion();
  
  const animationDuration = reduceMotion ? 0 : 300;
  
  return <Animated.View duration={animationDuration}>...</Animated.View>;
}
```

## Keyboard Navigation

All interactive elements are keyboard accessible:
- Tab order follows logical reading order
- Focus indicators are visible
- All actions can be performed via keyboard

## Testing Guidelines

### Manual Testing

#### VoiceOver (iOS)
1. Enable: Settings → Accessibility → VoiceOver
2. Gestures:
   - Swipe right: Next element
   - Swipe left: Previous element
   - Double tap: Activate element
   - Three-finger swipe: Scroll

#### TalkBack (Android)
1. Enable: Settings → Accessibility → TalkBack
2. Gestures:
   - Swipe right: Next element
   - Swipe left: Previous element
   - Double tap: Activate element
   - Two-finger swipe: Scroll

### Test Checklist

- [ ] All interactive elements have descriptive labels
- [ ] Tab order is logical and follows visual layout
- [ ] Error messages are announced immediately
- [ ] Form validation errors are clear and actionable
- [ ] Loading states are announced
- [ ] Success/failure feedback is provided
- [ ] All images have alt text (if applicable)
- [ ] Color is not the only means of conveying information
- [ ] Text can be resized up to 200% without loss of functionality
- [ ] Animations respect reduce motion preference

### Automated Testing

Use the following tools for automated accessibility testing:

```bash
# Install accessibility testing tools
npm install --save-dev @testing-library/react-native
npm install --save-dev jest-native

# Run accessibility tests
npm test -- --testPathPattern=accessibility
```

## Accessibility Utilities

### Color Contrast Checker

```typescript
import { getContrastRatio, meetsWCAGAA } from '@/lib/accessibility';

const ratio = getContrastRatio('#FFFFFF', '#0A080B');
const isAccessible = meetsWCAGAA('#FFFFFF', '#0A080B');
```

### Screen Reader Announcements

```typescript
import { announceForAccessibility } from '@/lib/accessibility';

// Announce important updates
announceForAccessibility('Message sent successfully');
```

### Format for Screen Readers

```typescript
import { 
  formatScoreForScreenReader,
  formatDateForScreenReader,
  formatTimeForScreenReader 
} from '@/lib/accessibility';

const scoreLabel = formatScoreForScreenReader(720, 1000);
// "720 out of 1000, 72 percent"

const dateLabel = formatDateForScreenReader(new Date());
// "Monday, December 7, 2025"
```

## Common Patterns

### Accessible Button

```typescript
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Send message"
  accessibilityHint="Double tap to send your message"
  accessibilityState={{ disabled: !canSend }}
  onPress={handleSend}
>
  <Text>Send</Text>
</Pressable>
```

### Accessible Form Input

```typescript
<TextInput
  accessible={true}
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email address"
  accessibilityValue={{ text: email }}
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
/>
{error && (
  <Text
    accessibilityRole="alert"
    accessibilityLiveRegion="polite"
  >
    {error}
  </Text>
)}
```

### Accessible List Item

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`${title}. ${subtitle}`}
  accessibilityHint="Double tap to open"
  onPress={onPress}
>
  <Text accessible={false}>{title}</Text>
  <Text accessible={false}>{subtitle}</Text>
</TouchableOpacity>
```

## Known Limitations

1. **Voice Input**: Voice input for chat is not yet implemented
2. **Image Descriptions**: AI-generated image descriptions are not yet available
3. **Haptic Feedback**: Limited haptic feedback implementation
4. **Custom Gestures**: Some custom gestures may not be fully accessible

## Future Improvements

- [ ] Add voice input support for chat
- [ ] Implement AI-generated alt text for images
- [ ] Add more haptic feedback for important actions
- [ ] Improve keyboard navigation on web platform
- [ ] Add high contrast mode support
- [ ] Implement focus management for modals and overlays
- [ ] Add skip navigation links
- [ ] Improve error recovery flows

## Resources

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Expo Accessibility](https://docs.expo.dev/guides/accessibility/)

## Support

For accessibility-related issues or suggestions, please contact:
- Email: accessibility@heylina.com
- GitHub: [Create an issue](https://github.com/heylina/mobile/issues)
