/**
 * useSubscriptionStatus Hook
 * Provides subscription status and helper functions
 */

import { useSubscription } from '../context/SubscriptionContext';

export function useSubscriptionStatus() {
  const {
    subscription,
    isPremium,
    isInTrial,
    trialDaysRemaining,
    isLoading,
  } = useSubscription();

  // Check if subscription is expired
  const isExpired = subscription?.status === 'expired';

  // Check if subscription is cancelled but still active
  const isCancelled = subscription?.cancelAtPeriodEnd === true;

  // Get subscription end date
  const getEndDate = (): Date | null => {
    if (!subscription) return null;

    if (isInTrial && subscription.trialEndDate) {
      return new Date(subscription.trialEndDate);
    }

    if (subscription.currentPeriodEnd) {
      return new Date(subscription.currentPeriodEnd);
    }

    return null;
  };

  // Get formatted end date
  const getFormattedEndDate = (): string | null => {
    const endDate = getEndDate();
    if (!endDate) return null;

    return endDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Get subscription status message
  const getStatusMessage = (): string => {
    if (isLoading) return 'Loading...';
    if (!subscription) return 'No active subscription';
    
    if (isInTrial) {
      const days = trialDaysRemaining;
      if (days === 0) return 'Trial ending today';
      if (days === 1) return '1 day left in trial';
      return `${days} days left in trial`;
    }

    if (isCancelled) {
      const endDate = getFormattedEndDate();
      return `Subscription ends ${endDate}`;
    }

    if (isPremium) {
      return 'Premium active';
    }

    if (isExpired) {
      return 'Subscription expired';
    }

    return 'No active subscription';
  };

  return {
    subscription,
    isPremium,
    isInTrial,
    isExpired,
    isCancelled,
    trialDaysRemaining,
    isLoading,
    endDate: getEndDate(),
    formattedEndDate: getFormattedEndDate(),
    statusMessage: getStatusMessage(),
  };
}
