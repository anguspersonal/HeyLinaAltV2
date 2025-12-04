import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { borderRadius, colors, spacing, typography } from '@/constants/theme';

export type QuickAction = {
  id: string;
  label: string;
  prompt: string;
};

type QuickActionsProps = {
  actions?: QuickAction[];
  onSelect: (action: QuickAction) => void;
  visible: boolean;
};

const DEFAULT_ACTIONS: QuickAction[] = [
  {
    id: 'dating',
    label: 'Talk about someone I\'m dating',
    prompt: 'I want to talk about someone I\'m dating',
  },
  {
    id: 'breakup',
    label: 'Process a breakup',
    prompt: 'I need help processing a breakup',
  },
  {
    id: 'boundaries',
    label: 'Set better boundaries',
    prompt: 'I want to learn how to set better boundaries',
  },
  {
    id: 'mixed-signals',
    label: 'Decode mixed signals',
    prompt: 'I\'m getting mixed signals and need clarity',
  },
  {
    id: 'patterns',
    label: 'Understand my patterns',
    prompt: 'I want to understand my relationship patterns',
  },
];

export function QuickActions({ 
  actions = DEFAULT_ACTIONS, 
  onSelect, 
  visible 
}: QuickActionsProps) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Quick prompts</ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map((action) => (
          <Pressable
            key={action.id}
            style={styles.actionButton}
            onPress={() => onSelect(action)}
          >
            <ThemedText style={styles.actionText}>{action.label}</ThemedText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
  },
  title: {
    ...typography.body.small,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  actionButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  actionText: {
    ...typography.body.medium,
    color: colors.text.primary,
  },
});
