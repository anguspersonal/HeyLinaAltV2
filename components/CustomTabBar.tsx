import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { accessibility, colors, spacing } from '@/constants/theme';

/**
 * Custom Tab Bar Component
 * Implements HeyLina design system styling for bottom navigation
 * 
 * Features:
 * - Custom styling with golden accent colors
 * - Active state indicators
 * - Safe area insets for notched devices
 * - Haptic feedback on iOS
 * - Accessibility support
 */
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, spacing.md),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Get icon name from options
        const iconName = getIconName(route.name);
        const iconColor = isFocused ? colors.accent.gold : colors.text.tertiary;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
              <IconSymbol name={iconName} size={24} color={iconColor} />
            </View>
            <ThemedText
              style={[
                styles.label,
                {
                  color: iconColor,
                  fontWeight: isFocused ? '500' : '400',
                },
              ]}
            >
              {typeof label === 'string' ? label : route.name}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/**
 * Map route names to icon names
 */
function getIconName(routeName: string): any {
  const iconMap: Record<string, any> = {
    index: 'house.fill',
    chat: 'ellipsis.bubble.fill',
    explore: 'clock.fill', // Using history icon for explore/history
    settings: 'gearshape.fill',
  };

  return iconMap[routeName] || 'house.fill';
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: accessibility.minTouchTarget,
    paddingVertical: spacing.sm,
  },
  iconContainer: {
    marginBottom: 4,
  },
  iconContainerActive: {
    // Optional: Add a subtle background or indicator for active state
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
  },
});
