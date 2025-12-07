import { borderRadius, colors, componentStyles, spacing, typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SafetyWarningProps {
  type: 'high-risk' | 'crisis' | 'self-harm' | 'abuse';
  onPauseConversation?: () => void;
  onExitConversation?: () => void;
}

const WARNING_CONTENT = {
  'high-risk': {
    title: 'We noticed you might be struggling',
    message: 'It sounds like you\'re going through a difficult time. While Lina can provide support, she\'s not a replacement for professional help.',
    icon: 'alert-circle' as const,
    color: '#FFA500',
  },
  'crisis': {
    title: 'Crisis Support Available',
    message: 'If you\'re in crisis or need immediate help, please reach out to professional crisis services. They\'re available 24/7.',
    icon: 'warning' as const,
    color: '#FF6B6B',
  },
  'self-harm': {
    title: 'Please Reach Out for Help',
    message: 'If you\'re having thoughts of self-harm, please contact a crisis service immediately. You don\'t have to face this alone.',
    icon: 'warning' as const,
    color: '#FF6B6B',
  },
  'abuse': {
    title: 'Support is Available',
    message: 'If you\'re experiencing abuse or feel unsafe, please reach out to professional resources who can help you.',
    icon: 'shield-outline' as const,
    color: '#FF6B6B',
  },
};

const CRISIS_RESOURCES = [
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 crisis support',
  },
  {
    name: 'Crisis Text Line',
    phone: '741741',
    description: 'Text HOME to 741741',
  },
  {
    name: 'National Domestic Violence Hotline',
    phone: '1-800-799-7233',
    description: '24/7 support for domestic violence',
  },
];

export function SafetyWarning({ type, onPauseConversation, onExitConversation }: SafetyWarningProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = WARNING_CONTENT[type];

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handlePause = () => {
    Alert.alert(
      'Pause Conversation',
      'Take a moment to breathe. Your conversation will be here when you\'re ready to continue.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pause',
          onPress: () => {
            onPauseConversation?.();
          },
        },
      ]
    );
  };

  const handleExit = () => {
    Alert.alert(
      'Exit Conversation',
      'Are you sure you want to exit this conversation? You can always come back later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            onExitConversation?.();
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { borderLeftColor: content.color }]}>
      <View style={styles.header}>
        <Ionicons name={content.icon} size={24} color={content.color} />
        <View style={styles.headerText}>
          <Text style={styles.title}>{content.title}</Text>
        </View>
      </View>

      <Text style={styles.message}>{content.message}</Text>

      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <Text style={styles.expandButtonText}>
          {isExpanded ? 'Hide Resources' : 'View Crisis Resources'}
        </Text>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.accent.gold}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.resourcesContainer}>
          {CRISIS_RESOURCES.map((resource, index) => (
            <TouchableOpacity
              key={index}
              style={styles.resourceItem}
              onPress={() => handleCall(resource.phone)}
              activeOpacity={0.7}
            >
              <View style={styles.resourceContent}>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <Text style={styles.resourcePhone}>{resource.phone}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
              <Ionicons name="call" size={20} color={colors.accent.gold} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {onPauseConversation && (
          <TouchableOpacity style={styles.actionButton} onPress={handlePause} activeOpacity={0.7}>
            <Ionicons name="pause-circle-outline" size={20} color={colors.text.primary} />
            <Text style={styles.actionButtonText}>Pause</Text>
          </TouchableOpacity>
        )}
        {onExitConversation && (
          <TouchableOpacity
            style={[styles.actionButton, styles.exitButton]}
            onPress={handleExit}
            activeOpacity={0.7}
          >
            <Ionicons name="exit-outline" size={20} color={colors.text.primary} />
            <Text style={styles.actionButtonText}>Exit Chat</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    marginHorizontal: spacing.sm,
    borderLeftWidth: 4,
    ...componentStyles.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.body.medium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  message: {
    ...typography.body.small,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    marginBottom: spacing.md,
  },
  expandButtonText: {
    ...typography.body.small,
    color: colors.accent.gold,
    fontWeight: '500',
  },
  resourcesContainer: {
    marginBottom: spacing.md,
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
  resourceName: {
    ...typography.body.small,
    color: colors.text.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  resourcePhone: {
    ...typography.body.small,
    color: colors.accent.gold,
    fontWeight: '600',
    marginBottom: 2,
  },
  resourceDescription: {
    ...typography.body.tiny,
    color: colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    paddingTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.cardSecondary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  exitButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  actionButtonText: {
    ...typography.body.small,
    color: colors.text.primary,
    fontWeight: '500',
  },
});
