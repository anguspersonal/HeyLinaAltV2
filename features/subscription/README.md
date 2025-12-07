# Subscription Feature

This feature implements subscription management and premium feature gating for HeyLina.

## Overview

The subscription feature provides:
- Paywall screen with pricing and trial information
- Subscription state management via React Context
- Premium feature gates to restrict access
- In-app purchase integration (mock implementation for MVP)
- Property-based tests for subscription logic

## Components

### PaywallScreen
Displays subscription benefits, pricing, and trial information. Shows a clear call-to-action for starting a free trial.

**Props:**
- `onSubscribe?: () => void` - Callback when user taps subscribe button
- `onClose?: () => void` - Callback when user dismisses paywall
- `isLoading?: boolean` - Loading state during purchase

### PremiumGate
Conditionally renders content based on subscription status. Shows upgrade prompt for non-premium users.

**Props:**
- `children: ReactNode` - Content to show for premium users
- `feature?: string` - Name of the feature being gated
- `onUpgrade?: () => void` - Callback for upgrade action
- `fallback?: ReactNode` - Custom fallback UI

### PremiumBadge
Visual indicator for premium features.

**Props:**
- `size?: 'small' | 'medium' | 'large'` - Badge size
- `style?: ViewStyle` - Additional styles

## Hooks

### useSubscription
Main hook for accessing subscription state and actions.

**Returns:**
- `subscription: Subscription | null` - Current subscription
- `plans: SubscriptionPlan[]` - Available plans
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message
- `isPremium: boolean` - Whether user has premium access
- `isInTrial: boolean` - Whether user is in trial period
- `trialDaysRemaining: number` - Days left in trial
- `refreshSubscription: () => Promise<void>` - Refresh subscription data
- `purchase: (planId: string) => Promise<PurchaseResult>` - Purchase subscription
- `restore: () => Promise<PurchaseResult>` - Restore purchases
- `cancel: () => Promise<void>` - Cancel subscription

### useSubscriptionStatus
Helper hook for subscription status information.

**Returns:**
- `subscription: Subscription | null`
- `isPremium: boolean`
- `isInTrial: boolean`
- `isExpired: boolean`
- `isCancelled: boolean`
- `trialDaysRemaining: number`
- `isLoading: boolean`
- `endDate: Date | null`
- `formattedEndDate: string | null`
- `statusMessage: string`

### usePremiumFeature
Hook for checking premium feature access.

**Options:**
- `feature?: string` - Feature name
- `redirectToPaywall?: boolean` - Auto-redirect to paywall
- `paywallRoute?: string` - Paywall route path

**Returns:**
- `hasAccess: boolean` - Whether user has access
- `isPremium: boolean`
- `isInTrial: boolean`
- `isLoading: boolean`
- `checkAccess: () => boolean` - Check and optionally redirect
- `showPaywall: () => void` - Navigate to paywall
- `feature: string`

## Services

### subscriptionApi
Handles subscription operations and in-app purchases.

**Functions:**
- `getSubscriptionPlans(): Promise<SubscriptionPlan[]>`
- `getCurrentSubscription(accessToken: string): Promise<Subscription | null>`
- `purchaseSubscription(planId: string, accessToken: string): Promise<PurchaseResult>`
- `restorePurchases(accessToken: string): Promise<PurchaseResult>`
- `cancelSubscription(accessToken: string): Promise<{ success: boolean; error?: string }>`
- `hasActiveSubscription(subscription: Subscription | null): boolean`
- `getTrialDaysRemaining(subscription: Subscription | null): number`

## Usage Examples

### Basic Premium Gate

```tsx
import { PremiumGate } from '@/features/subscription';

function MyFeature() {
  return (
    <PremiumGate 
      feature="advanced insights"
      onUpgrade={() => router.push('/paywall')}
    >
      <AdvancedInsightsContent />
    </PremiumGate>
  );
}
```

### Check Access Programmatically

```tsx
import { usePremiumFeature } from '@/features/subscription';

function MyComponent() {
  const { hasAccess, showPaywall } = usePremiumFeature({
    feature: 'unlimited conversations',
  });

  const handleAction = () => {
    if (!hasAccess) {
      showPaywall();
      return;
    }
    // Perform premium action
  };

  return (
    <Button onPress={handleAction}>
      Premium Action
    </Button>
  );
}
```

### Display Subscription Status

```tsx
import { useSubscriptionStatus } from '@/features/subscription';

function SubscriptionInfo() {
  const { statusMessage, formattedEndDate, isInTrial } = useSubscriptionStatus();

  return (
    <View>
      <Text>{statusMessage}</Text>
      {isInTrial && formattedEndDate && (
        <Text>Trial ends {formattedEndDate}</Text>
      )}
    </View>
  );
}
```

### Show Paywall

```tsx
import { PaywallScreen } from '@/features/subscription';
import { useSubscription } from '@/features/subscription';

function PaywallModal() {
  const { purchase, isLoading } = useSubscription();
  const router = useRouter();

  const handleSubscribe = async () => {
    const result = await purchase('heylina_premium_monthly');
    if (result.success) {
      router.back();
    }
  };

  return (
    <PaywallScreen
      onSubscribe={handleSubscribe}
      onClose={() => router.back()}
      isLoading={isLoading}
    />
  );
}
```

## Integration

### Add to App Layout

Wrap your app with the SubscriptionProvider:

```tsx
import { SubscriptionProvider } from '@/features/subscription';

export default function RootLayout() {
  return (
    <SubscriptionProvider>
      <YourApp />
    </SubscriptionProvider>
  );
}
```

## Testing

Property-based tests verify:
- **Property 17**: Trial start communicates billing timeline
- **Property 18**: Subscription purchase grants access

Run tests:
```bash
npm test -- features/subscription/__tests__/subscription.property.test.ts
```

## Production Implementation

This is a mock implementation for MVP. For production:

1. **Install IAP Package**:
   ```bash
   npx expo install expo-in-app-purchases
   # or
   npm install react-native-purchases
   ```

2. **Configure App Store Connect / Google Play Console**:
   - Create subscription products
   - Set up pricing and trial periods
   - Configure server-to-server notifications

3. **Update subscriptionApi.ts**:
   - Replace mock implementations with actual IAP calls
   - Add receipt validation
   - Integrate with backend API

4. **Backend Integration**:
   - Validate receipts server-side
   - Store subscription status in database
   - Handle webhook notifications from app stores

## Pricing

- **Monthly**: £14.99/month
- **Trial**: 14 days free
- **Features**: Unlimited conversations, emotional health insights, progress tracking, premium features, priority support, ad-free experience

## Requirements Validated

- **8.1**: Premium feature messaging
- **8.2**: Subscription options and pricing display
- **8.3**: Trial timeline communication
- **8.5**: Subscription purchase and access grant
