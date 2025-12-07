/**
 * Subscription feature types
 */

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';
export type SubscriptionTier = 'free' | 'premium';

export interface Subscription {
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  trialStartDate?: string;
  trialEndDate?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  trialDays: number;
  features: string[];
}

export interface PurchaseResult {
  success: boolean;
  subscription?: Subscription;
  error?: string;
}
