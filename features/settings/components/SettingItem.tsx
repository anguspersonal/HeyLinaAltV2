import { borderRadius, colors, componentStyles, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export function SettingItem({
  title,
  subtitle,
  icon,
  onPress,
  showChevron = true,
  destructive = false,
}: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={24}
            color={destructive ? '#FF6B6B' : colors.accent.gold}
            style={styles.icon}
          />
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.title, destructive && styles.destructiveText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.text.tertiary}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...componentStyles.card,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
  },
  subtitle: {
    ...typography.body.small,
    color: colors.text.secondary,
    marginTop: 4,
  },
  destructiveText: {
    color: '#FF6B6B',
  },
});
