import { borderRadius, colors, componentStyles, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ResourceItem {
  title: string;
  description: string;
  phone?: string;
  url?: string;
}

const CRISIS_RESOURCES: ResourceItem[] = [
  {
    title: 'National Suicide Prevention Lifeline',
    description: '24/7 crisis support',
    phone: '988',
  },
  {
    title: 'Crisis Text Line',
    description: 'Text HOME to 741741',
    phone: '741741',
  },
  {
    title: 'National Domestic Violence Hotline',
    description: '24/7 support for domestic violence',
    phone: '1-800-799-7233',
  },
  {
    title: 'SAMHSA National Helpline',
    description: 'Mental health and substance abuse',
    phone: '1-800-662-4357',
  },
];

export function SafetyResources() {
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={24} color={colors.accent.gold} />
        <Text style={styles.title}>Crisis Resources</Text>
      </View>
      
      <Text style={styles.disclaimer}>
        If you're in crisis or experiencing thoughts of self-harm, please reach out to these professional resources immediately. Lina is not a crisis service or replacement for professional help.
      </Text>

      {CRISIS_RESOURCES.map((resource, index) => (
        <TouchableOpacity
          key={index}
          style={styles.resourceItem}
          onPress={() => resource.phone ? handleCall(resource.phone) : resource.url && handleURL(resource.url)}
          activeOpacity={0.7}
        >
          <View style={styles.resourceContent}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.resourceDescription}>{resource.description}</Text>
            {resource.phone && (
              <Text style={styles.resourcePhone}>{resource.phone}</Text>
            )}
          </View>
          <Ionicons name="call" size={20} color={colors.accent.gold} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    ...componentStyles.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading.h3,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  disclaimer: {
    ...typography.body.small,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  resourceDescription: {
    ...typography.body.small,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  resourcePhone: {
    ...typography.body.small,
    color: colors.accent.gold,
    fontWeight: '500',
  },
});
