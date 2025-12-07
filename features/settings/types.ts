/**
 * Settings Feature Types
 */

export interface UserProfile {
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

export interface NotificationSettings {
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

export interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export interface SettingSection {
  title?: string;
  items: SettingItem[];
}
