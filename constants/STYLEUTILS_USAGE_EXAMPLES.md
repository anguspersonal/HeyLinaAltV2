# Style Utilities Usage Examples

## Gradient Usage

### Using Linear Gradients with expo-linear-gradient

```typescript
import { LinearGradient } from 'expo-linear-gradient';
import { userMessageGradient, createLinearGradient } from './constants/styleUtils';

// Using pre-defined gradient
<LinearGradient
  colors={userMessageGradient.colors}
  start={userMessageGradient.start}
  end={userMessageGradient.end}
  style={styles.messageBubble}
>
  <Text>Hello!</Text>
</LinearGradient>

// Creating custom gradient
const customGradient = createLinearGradient(['#FF0000', '#00FF00'], 45);
<LinearGradient
  colors={customGradient.colors}
  start={customGradient.start}
  end={customGradient.end}
  style={styles.container}
>
  <Text>Custom gradient</Text>
</LinearGradient>
```

### Using Conic Gradients (Score Circle)

```typescript
import { scoreCircleGradient } from './constants/styleUtils';

// Note: React Native doesn't support conic gradients natively
// You'll need to use a library like react-native-svg or create a custom component
// The scoreCircleGradient provides the color stops for implementation

const ScoreCircle = () => {
  return (
    <Svg width={274} height={274}>
      <Defs>
        <RadialGradient id="scoreGradient">
          {scoreCircleGradient.colors.map((color, index) => (
            <Stop
              key={index}
              offset={index / (scoreCircleGradient.colors.length - 1)}
              stopColor={color}
            />
          ))}
        </RadialGradient>
      </Defs>
      <Circle cx={137} cy={137} r={137} fill="url(#scoreGradient)" />
    </Svg>
  );
};
```

## Shadow Usage

### Card with Shadow

```typescript
import { View, StyleSheet } from 'react-native';
import { createCardShadow } from './constants/styleUtils';

const Card = ({ children }) => (
  <View style={styles.card}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161612',
    borderRadius: 6,
    padding: 16,
    ...createCardShadow(), // Spreads shadow properties
  },
});
```

### Button with Subtle Shadow

```typescript
import { TouchableOpacity, StyleSheet } from 'react-native';
import { createSubtleShadow } from './constants/styleUtils';

const Button = ({ onPress, children }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#BBA53F',
    borderRadius: 6,
    padding: 12,
    ...createSubtleShadow(),
  },
});
```

## Glow Effects

### Input with Golden Glow

```typescript
import { View, TextInput, StyleSheet } from 'react-native';
import { createGoldenGlow, colors } from './constants/styleUtils';

const GlowInput = () => {
  const glow = createGoldenGlow();
  
  return (
    <View style={styles.container}>
      {/* Glow layer (behind input) */}
      <View style={[styles.glowLayer, { 
        backgroundColor: glow.gradient.colors[0],
        opacity: glow.opacity,
      }]} />
      
      {/* Actual input */}
      <TextInput
        style={styles.input}
        placeholder="Message Lina..."
        placeholderTextColor={colors.text.placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  glowLayer: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 9,
    // Note: For actual blur, use react-native-blur or similar
  },
  input: {
    backgroundColor: colors.background.primary,
    borderRadius: 6,
    height: 52,
    paddingHorizontal: 16,
    color: colors.text.primary,
  },
});
```

## Responsive Sizing

### Responsive Component

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { 
  scaleSize, 
  scaleFontSize, 
  getResponsiveWidth,
  isSmallScreen,
  getAdaptiveFontSize 
} from './constants/styleUtils';

const ResponsiveCard = () => {
  const cardWidth = getResponsiveWidth(90); // 90% of screen width
  const fontSize = getAdaptiveFontSize(14, 16, 18); // Small/Medium/Large screens
  
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <Text style={[styles.text, { fontSize }]}>
        Responsive Text
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: scaleSize(16),
    borderRadius: scaleSize(6),
  },
  text: {
    // fontSize set dynamically above
  },
});
```

### Adaptive Spacing

```typescript
import { View, StyleSheet } from 'react-native';
import { getAdaptiveSpacing } from './constants/styleUtils';

const AdaptiveLayout = () => {
  const spacing = getAdaptiveSpacing(12, 16, 20); // Small/Medium/Large
  
  return (
    <View style={[styles.container, { padding: spacing }]}>
      {/* Content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding set dynamically above
  },
});
```

## Layout Helpers

### Centered Content

```typescript
import { View, Text, StyleSheet } from 'react-native';
import { createCenteredContainer } from './constants/styleUtils';

const LoadingScreen = () => (
  <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: createCenteredContainer(),
});
```

### Full-Width Card

```typescript
import { View, StyleSheet } from 'react-native';
import { createFullWidthCard } from './constants/styleUtils';

const ScoreCard = () => (
  <View style={styles.card}>
    {/* Card content */}
  </View>
);

const styles = StyleSheet.create({
  card: {
    ...createFullWidthCard(),
    backgroundColor: '#161612',
  },
});
```

## Typography Helpers

### Text with Proper Line Height

```typescript
import { Text, StyleSheet } from 'react-native';
import { createTextStyle } from './constants/styleUtils';

const BodyText = ({ children }) => (
  <Text style={styles.text}>{children}</Text>
);

const styles = StyleSheet.create({
  text: {
    ...createTextStyle(16, 1.4), // 16px font, 1.4 line height multiplier
    color: '#FFFFFF',
  },
});
```

### Truncated Text

```typescript
import { Text, StyleSheet } from 'react-native';
import { createTruncatedTextProps } from './constants/styleUtils';

const PreviewText = ({ children }) => (
  <Text 
    style={styles.text}
    {...createTruncatedTextProps(2)} // Max 2 lines
  >
    {children}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});
```

## Accessibility

### Accessible Button

```typescript
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createAccessibleButton } from './constants/styleUtils';

const IconButton = ({ onPress, icon }) => (
  <TouchableOpacity 
    style={styles.button}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel="Action button"
  >
    {icon}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    ...createAccessibleButton(32, 32), // Ensures min 44px touch target
    backgroundColor: '#BBA53F',
    borderRadius: 2,
  },
});
```

## Color Utilities

### Dynamic Opacity

```typescript
import { View, StyleSheet } from 'react-native';
import { hexToRgba } from './constants/styleUtils';

const Overlay = () => (
  <View style={styles.overlay} />
);

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: hexToRgba('#0A080B', 0.9),
    ...StyleSheet.absoluteFillObject,
  },
});
```

### Score Component Colors

```typescript
import { View, StyleSheet } from 'react-native';
import { getScoreComponentColor } from './constants/styleUtils';

const ScoreBar = ({ dimension, value }) => (
  <View style={[
    styles.bar,
    { backgroundColor: getScoreComponentColor(dimension) }
  ]}>
    {/* Bar content */}
  </View>
);

const styles = StyleSheet.create({
  bar: {
    width: 64,
    height: 88,
    borderRadius: 6,
  },
});
```

## Math Utilities

### Clamping Values

```typescript
import { clamp } from './constants/styleUtils';

const handleScroll = (scrollY) => {
  // Clamp opacity between 0 and 1
  const opacity = clamp(scrollY / 100, 0, 1);
  setHeaderOpacity(opacity);
};
```

### Interpolation

```typescript
import { interpolate } from './constants/styleUtils';

const AnimatedComponent = ({ progress }) => {
  // Interpolate size from 50 to 200 based on progress (0-1)
  const size = interpolate(50, 200, progress);
  
  return (
    <View style={{ width: size, height: size }}>
      {/* Content */}
    </View>
  );
};
```

## Animation Helpers

### Fade In Animation

```typescript
import { useEffect } from 'react';
import { Animated } from 'react-native';
import { createFadeInAnimation } from './constants/styleUtils';

const FadeInView = ({ children }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animation = createFadeInAnimation(300);
    Animated.timing(opacity, {
      toValue: animation.to.opacity,
      duration: animation.duration,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View style={{ opacity }}>
      {children}
    </Animated.View>
  );
};
```

## Complete Example: Message Bubble

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  userMessageGradient,
  createCardShadow,
  createTextStyle,
  scaleSize,
  colors,
} from './constants/styleUtils';

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isUser, timestamp }) => {
  if (isUser) {
    return (
      <LinearGradient
        colors={userMessageGradient.colors}
        start={userMessageGradient.start}
        end={userMessageGradient.end}
        style={[styles.bubble, styles.userBubble]}
      >
        <Text style={styles.userText}>{text}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </LinearGradient>
    );
  }
  
  return (
    <View style={[styles.bubble, styles.linaBubble]}>
      <Text style={styles.linaText}>{text}</Text>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    padding: scaleSize(12),
    borderRadius: scaleSize(6),
    marginVertical: scaleSize(4),
    ...createCardShadow(),
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  linaBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.cardSecondary,
  },
  userText: {
    ...createTextStyle(16),
    color: colors.background.primary,
  },
  linaText: {
    ...createTextStyle(16),
    color: colors.text.primary,
  },
  timestamp: {
    ...createTextStyle(12),
    color: colors.text.tertiary,
    marginTop: scaleSize(4),
  },
});

export default MessageBubble;
```
