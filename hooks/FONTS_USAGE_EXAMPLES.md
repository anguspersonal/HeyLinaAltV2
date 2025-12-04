# Font Usage Examples

This document provides examples of how to use the custom fonts in your React Native components.

## Available Fonts

### Instrument Sans (Primary UI Font)
- `InstrumentSans-Regular` (400 weight)
- `InstrumentSans-Medium` (500 weight)
- `InstrumentSans-SemiBold` (600 weight)
- `InstrumentSans-Bold` (700 weight)

### Carattere (Accent Font)
- `Carattere-Regular` - Handwritten/script style for personalization

## Basic Usage

### Using Font Families Directly

```tsx
import { StyleSheet, Text } from 'react-native';
import { FONT_FAMILIES } from '@/hooks/useFonts';

const MyComponent = () => {
  return (
    <Text style={styles.heading}>
      Welcome to HeyLina
    </Text>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: FONT_FAMILIES.primaryMedium,
    fontSize: 24,
    color: '#FFFFFF',
  },
});
```

### Using Helper Functions

```tsx
import { StyleSheet, Text } from 'react-native';
import { getInstrumentSansFont, getCarattereFont } from '@/hooks/useFonts';

const MyComponent = () => {
  return (
    <>
      <Text style={styles.heading}>Section Title</Text>
      <Text style={styles.userName}>Sarah</Text>
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: getInstrumentSansFont(500), // Medium weight
    fontSize: 24,
  },
  userName: {
    fontFamily: getCarattereFont(), // Handwritten style
    fontSize: 56,
  },
});
```

## Design System Integration

### Using with Theme Constants

```tsx
import { StyleSheet, Text } from 'react-native';
import { typography, colors } from '@/constants/theme';
import { getInstrumentSansFont } from '@/hooks/useFonts';

const MyComponent = () => {
  return (
    <Text style={styles.title}>
      Emotional Health Score
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.heading.h1.fontSize,
    lineHeight: typography.heading.h1.lineHeight,
    color: colors.text.primary,
  },
});
```

## Common Patterns

### Dashboard Header with User Name

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { getInstrumentSansFont, getCarattereFont } from '@/hooks/useFonts';
import { colors, typography } from '@/constants/theme';

const DashboardHeader = ({ userName }: { userName: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hi HeyLina</Text>
      <Text style={styles.userName}>{userName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  greeting: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: typography.body.medium.fontSize,
    color: colors.text.secondary,
  },
  userName: {
    fontFamily: getCarattereFont(),
    fontSize: typography.display.large.fontSize,
    lineHeight: typography.display.large.lineHeight,
    letterSpacing: typography.display.large.letterSpacing,
    color: colors.text.primary,
  },
});
```

### Message Bubble

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { getInstrumentSansFont } from '@/hooks/useFonts';
import { colors, typography, componentStyles } from '@/constants/theme';

const MessageBubble = ({ text, isUser }: { text: string; isUser: boolean }) => {
  return (
    <View style={[
      styles.bubble,
      isUser ? styles.userBubble : styles.linaBubble
    ]}>
      <Text style={[
        styles.text,
        isUser ? styles.userText : styles.linaText
      ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    ...componentStyles.messageBubble.user,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: colors.accent.warmGold,
    alignSelf: 'flex-end',
  },
  linaBubble: {
    backgroundColor: colors.background.cardSecondary,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: typography.body.medium.fontSize,
    lineHeight: typography.body.medium.lineHeight,
  },
  userText: {
    color: colors.background.primary,
  },
  linaText: {
    color: colors.text.primary,
  },
});
```

### Score Display

```tsx
import { StyleSheet, Text, View } from 'react-native';
import { getInstrumentSansFont } from '@/hooks/useFonts';
import { colors, typography } from '@/constants/theme';

const ScoreDisplay = ({ score }: { score: number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.scoreValue}>{score}</Text>
      <Text style={styles.scoreLabel}>Emotional Health Score</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scoreValue: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.score.large.fontSize,
    lineHeight: typography.score.large.lineHeight,
    letterSpacing: typography.score.large.letterSpacing,
    color: colors.text.primary,
  },
  scoreLabel: {
    fontFamily: getInstrumentSansFont(400),
    fontSize: typography.body.small.fontSize,
    color: colors.text.secondary,
    marginTop: 8,
  },
});
```

### Button with Custom Font

```tsx
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getInstrumentSansFont } from '@/hooks/useFonts';
import { colors, componentStyles, typography } from '@/constants/theme';

const PrimaryButton = ({ title, onPress }: { title: string; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    ...componentStyles.button.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: getInstrumentSansFont(500),
    fontSize: typography.body.medium.fontSize,
    color: colors.text.primary,
  },
});
```

## Font Weight Reference

When using `getInstrumentSansFont()`, use these weight values:

- `400` - Regular (default body text)
- `500` - Medium (headings, emphasis)
- `600` - SemiBold (strong emphasis)
- `700` - Bold (maximum emphasis)

## Best Practices

1. **Use helper functions** - Prefer `getInstrumentSansFont()` and `getCarattereFont()` over direct font family names
2. **Combine with theme** - Always use font constants alongside color and spacing from the theme
3. **Consistent weights** - Use Medium (500) for headings, Regular (400) for body text
4. **Carattere sparingly** - Use the accent font only for personalization (user names, special headings)
5. **Line height** - Always set line height from typography constants for consistency
6. **Letter spacing** - Apply letter spacing for display and score text as defined in theme

## Troubleshooting

### Fonts not loading?

1. Check that font files exist in `assets/fonts/InstrumentSans/` and `assets/fonts/Carattere/`
2. See `assets/fonts/FONT_SETUP_INSTRUCTIONS.md` for download instructions
3. Restart the development server after adding new fonts
4. Clear the cache: `expo start -c`

### Fonts look different on web?

Web fonts are loaded via CSS `@font-face` rules. The `useWebFontFaces` hook in `app/_layout.tsx` handles this automatically.

### Using system fonts as fallback?

The current implementation uses Inter as a fallback for Instrument Sans and Montserrat Alternates as a fallback for Carattere until the actual fonts are downloaded.
