/**
 * usePremiumFeature Hook
 * Check if user has access to premium features
 */

import { useRouter } from 'expo-router';
import { useSubscription } from '../context/SubscriptionContext';

interface UsePremiumFeatureOptions {
  feature?: string;
  redirectToPaywall?: boolean;
  paywallRoute?: string;
}

export function usePremiumFeature(options: UsePremiumFeatureOptions = {}) {
  const {
    feature = 'this feature',
    redirectToPaywall = false,
    paywallRoute = '/paywall',
  } = options;

  const { isPremium, isInTrial, isLoading } = useSubscription();
  const router = useRouter();

  // User has access if they're premium or in trial
  const hasAccess = isPremium || isInTrial;

  // Check access and optionally redirect
  const checkAccess = (): boolean => {
    if (hasAccess) {
      return true;
    }

    if (redirectToPaywall) {
      router.push(paywallRoute as any);
    }

    return false;
  };

  // Show paywall
  const showPaywall = () => {
    router.push(paywallRoute as any);
  };

  return {
    hasAccess,
    isPremium,
    isInTrial,
    isLoading,
    checkAccess,
    showPaywall,
    feature,
  };
}
