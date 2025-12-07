/**
 * Subscription API Service
 * Handles in-app purchase operations and subscription management
 * 
 * Note: This is a mock implementation for MVP. In production, integrate with:
 * - expo-in-app-purchases for native IAP
 * - RevenueCat for cross-platform subscription management
 * - Backend API for subscription validation and management
 */

import { PurchaseResult, Subscription, SubscriptionPlan } from '../types';

// Mock subscription plans
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'heylina_premium_monthly',
    name: 'Premium Monthly',
    price: 14.99,
    currency: 'GBP',
    interval: 'month',
    trialDays: 14,
    features: [
      'Unlimited conversations',
      'Emotional health insights',
      'Progress tracking',
      'Premium features',
      'Priority support',
      'Ad-free experience',
    ],
  },
];

/**
 * Get available subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  // In production: Fetch from app store or RevenueCat
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(SUBSCRIPTION_PLANS);
    }, 500);
  });
}

/**
 * Get current subscription status
 */
export async function getCurrentSubscription(
  accessToken: string
): Promise<Subscription | null> {
  // In production: Fetch from backend API
  try {
    return await retryWithBackoff(
      async () => {
        // Mock implementation - check local storage or backend
        const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/subscriptions`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
          },
        });

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        return data;
      },
      {
        maxRetries: 2,
        baseDelay: 1000,
        timeout: 10000,
      }
    );
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

/**
 * Purchase a subscription
 * @param planId - The subscription plan ID
 * @param accessToken - User access token
 */
export async function purchaseSubscription(
  planId: string,
  accessToken: string
): Promise<PurchaseResult> {
  try {
    // In production: Use expo-in-app-purchases or RevenueCat
    // 1. Initiate purchase flow with app store
    // 2. Validate receipt with backend
    // 3. Update subscription status
    
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const subscription: Subscription = {
      status: 'trial',
      tier: 'premium',
      trialStartDate: now.toISOString(),
      trialEndDate: trialEnd.toISOString(),
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: trialEnd.toISOString(),
      cancelAtPeriodEnd: false,
    };

    // In production: Send to backend for validation
    // await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/subscriptions`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(subscription),
    // });

    return {
      success: true,
      subscription,
    };
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Purchase failed',
    };
  }
}

/**
 * Restore previous purchases
 * @param accessToken - User access token
 */
export async function restorePurchases(
  accessToken: string
): Promise<PurchaseResult> {
  try {
    // In production: Use expo-in-app-purchases or RevenueCat
    // 1. Query app store for previous purchases
    // 2. Validate receipts with backend
    // 3. Restore subscription status
    
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const subscription = await getCurrentSubscription(accessToken);

    if (subscription) {
      return {
        success: true,
        subscription,
      };
    }

    return {
      success: false,
      error: 'No previous purchases found',
    };
  } catch (error) {
    console.error('Error restoring purchases:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Restore failed',
    };
  }
}

/**
 * Cancel subscription
 * @param accessToken - User access token
 */
export async function cancelSubscription(
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // In production: Update backend and app store
    // Note: Actual cancellation happens through app store settings
    // This just marks the subscription to not renew
    
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production: Update backend
    // await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/subscriptions`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Authorization': `Bearer ${accessToken}`,
    //     'apikey': process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ cancelAtPeriodEnd: true }),
    // });

    return { success: true };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Cancellation failed',
    };
  }
}

/**
 * Check if user has active subscription
 * @param subscription - Current subscription object
 */
export function hasActiveSubscription(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  
  const now = new Date();
  
  // Check if in trial period
  if (subscription.status === 'trial' && subscription.trialEndDate) {
    const trialEnd = new Date(subscription.trialEndDate);
    if (now < trialEnd) return true;
  }
  
  // Check if active subscription
  if (subscription.status === 'active' && subscription.currentPeriodEnd) {
    const periodEnd = new Date(subscription.currentPeriodEnd);
    if (now < periodEnd) return true;
  }
  
  return false;
}

/**
 * Get days remaining in trial
 * @param subscription - Current subscription object
 */
export function getTrialDaysRemaining(subscription: Subscription | null): number {
  if (!subscription || subscription.status !== 'trial' || !subscription.trialEndDate) {
    return 0;
  }
  
  const now = new Date();
  const trialEnd = new Date(subscription.trialEndDate);
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}
