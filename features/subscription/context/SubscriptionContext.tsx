/**
 * Subscription Context
 * Manages subscription state across the application
 */

import { useAuth } from '@/stores/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
    cancelSubscription,
    getCurrentSubscription,
    getSubscriptionPlans,
    getTrialDaysRemaining,
    hasActiveSubscription,
    purchaseSubscription,
    restorePurchases,
} from '../services/subscriptionApi';
import { PurchaseResult, Subscription, SubscriptionPlan } from '../types';

interface SubscriptionContextType {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  isLoading: boolean;
  error: string | null;
  isPremium: boolean;
  isInTrial: boolean;
  trialDaysRemaining: number;
  refreshSubscription: () => Promise<void>;
  purchase: (planId: string) => Promise<PurchaseResult>;
  restore: () => Promise<PurchaseResult>;
  cancel: () => Promise<{ success: boolean; error?: string }>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const { session } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const isPremium = hasActiveSubscription(subscription);
  const isInTrial = subscription?.status === 'trial';
  const trialDaysRemaining = getTrialDaysRemaining(subscription);

  // Load subscription data
  const loadSubscription = async () => {
    if (!session?.access_token) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [subscriptionData, plansData] = await Promise.all([
        getCurrentSubscription(session.access_token),
        getSubscriptionPlans(),
      ]);

      setSubscription(subscriptionData);
      setPlans(plansData);
    } catch (err) {
      console.error('Error loading subscription:', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscription');
    } finally {
      setIsLoading(false);
    }
  };

  // Load subscription on mount and when session changes
  useEffect(() => {
    loadSubscription();
  }, [session?.access_token]);

  // Check for trial expiration
  useEffect(() => {
    if (!subscription || subscription.status !== 'trial') return;

    const checkTrialExpiration = () => {
      if (subscription.trialEndDate) {
        const now = new Date();
        const trialEnd = new Date(subscription.trialEndDate);
        
        if (now >= trialEnd) {
          // Trial has expired, refresh subscription status
          loadSubscription();
        }
      }
    };

    // Check immediately
    checkTrialExpiration();

    // Check every hour
    const interval = setInterval(checkTrialExpiration, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [subscription]);

  // Refresh subscription
  const refreshSubscription = async () => {
    await loadSubscription();
  };

  // Purchase subscription
  const purchase = async (planId: string): Promise<PurchaseResult> => {
    if (!session?.access_token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await purchaseSubscription(planId, session.access_token);

      if (result.success && result.subscription) {
        setSubscription(result.subscription);
      } else if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Purchase failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Restore purchases
  const restore = async (): Promise<PurchaseResult> => {
    if (!session?.access_token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await restorePurchases(session.access_token);

      if (result.success && result.subscription) {
        setSubscription(result.subscription);
      } else if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Restore failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel subscription
  const cancel = async (): Promise<{ success: boolean; error?: string }> => {
    if (!session?.access_token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await cancelSubscription(session.access_token);

      if (result.success) {
        // Update local state to reflect cancellation
        if (subscription) {
          setSubscription({
            ...subscription,
            cancelAtPeriodEnd: true,
          });
        }
      } else if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Cancellation failed';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: SubscriptionContextType = {
    subscription,
    plans,
    isLoading,
    error,
    isPremium,
    isInTrial,
    trialDaysRemaining,
    refreshSubscription,
    purchase,
    restore,
    cancel,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextType {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
