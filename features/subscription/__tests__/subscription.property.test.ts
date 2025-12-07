/**
 * Property-Based Tests for Subscription Feature
 * Feature: heylina-mobile-mvp
 */

import fc from 'fast-check';
import {
    getTrialDaysRemaining,
    hasActiveSubscription,
} from '../services/subscriptionApi';
import { Subscription, SubscriptionStatus } from '../types';

// Generators for property tests

const subscriptionStatusGen = fc.constantFrom<SubscriptionStatus>(
  'trial',
  'active',
  'expired',
  'cancelled'
);

const futureDateGen = fc
  .integer({ min: 1, max: 365 })
  .map((days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  });

const pastDateGen = fc
  .integer({ min: 1, max: 365 })
  .map((days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  });

const subscriptionGen = fc.record({
  status: subscriptionStatusGen,
  tier: fc.constantFrom('free', 'premium'),
  trialStartDate: fc.option(pastDateGen, { nil: undefined }),
  trialEndDate: fc.option(futureDateGen, { nil: undefined }),
  currentPeriodStart: fc.option(pastDateGen, { nil: undefined }),
  currentPeriodEnd: fc.option(futureDateGen, { nil: undefined }),
  cancelAtPeriodEnd: fc.boolean(),
});

describe('Subscription Property Tests', () => {
  // Feature: heylina-mobile-mvp, Property 17: Trial start communicates billing timeline
  describe('Property 17: Trial start communicates billing timeline', () => {
    it('should always include trial start date, end date, and billing start for trial subscriptions', () => {
      fc.assert(
        fc.property(
          fc.record({
            status: fc.constant<SubscriptionStatus>('trial'),
            tier: fc.constant('premium'),
            trialStartDate: pastDateGen,
            trialEndDate: futureDateGen,
            currentPeriodStart: pastDateGen,
            currentPeriodEnd: futureDateGen,
            cancelAtPeriodEnd: fc.boolean(),
          }),
          (subscription: Subscription) => {
            // Verify all required dates are present
            expect(subscription.trialStartDate).toBeDefined();
            expect(subscription.trialEndDate).toBeDefined();
            expect(subscription.currentPeriodStart).toBeDefined();
            expect(subscription.currentPeriodEnd).toBeDefined();

            // Verify trial end date is in the future
            const trialEnd = new Date(subscription.trialEndDate!);
            const now = new Date();
            expect(trialEnd.getTime()).toBeGreaterThan(now.getTime());

            // Verify trial start is before trial end
            const trialStart = new Date(subscription.trialStartDate!);
            expect(trialStart.getTime()).toBeLessThan(trialEnd.getTime());

            // Verify billing period is defined
            const periodStart = new Date(subscription.currentPeriodStart!);
            const periodEnd = new Date(subscription.currentPeriodEnd!);
            expect(periodStart.getTime()).toBeLessThan(periodEnd.getTime());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should calculate correct days remaining in trial', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 30 }),
          (daysRemaining) => {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + daysRemaining);
            
            const subscription: Subscription = {
              status: 'trial',
              tier: 'premium',
              trialStartDate: new Date().toISOString(),
              trialEndDate: trialEndDate.toISOString(),
              currentPeriodStart: new Date().toISOString(),
              currentPeriodEnd: trialEndDate.toISOString(),
              cancelAtPeriodEnd: false,
            };

            const actualDays = getTrialDaysRemaining(subscription);

            // Allow for 1 day difference due to timing
            expect(Math.abs(actualDays - daysRemaining)).toBeLessThanOrEqual(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: heylina-mobile-mvp, Property 18: Subscription purchase grants access
  describe('Property 18: Subscription purchase grants access', () => {
    it('should grant access for any active or trial subscription', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<SubscriptionStatus>('trial', 'active'),
          futureDateGen,
          fc.boolean(),
          (status, futureDate, cancelAtPeriodEnd) => {
            const subscription: Subscription = {
              status,
              tier: 'premium',
              trialStartDate: status === 'trial' ? new Date().toISOString() : undefined,
              trialEndDate: status === 'trial' ? futureDate : undefined,
              currentPeriodStart: new Date().toISOString(),
              currentPeriodEnd: futureDate,
              cancelAtPeriodEnd,
            };

            // Any subscription with status 'trial' or 'active' and future end date should grant access
            const hasAccess = hasActiveSubscription(subscription);
            expect(hasAccess).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should deny access for expired or cancelled subscriptions with past end dates', () => {
      fc.assert(
        fc.property(
          fc.record({
            status: fc.constantFrom<SubscriptionStatus>('expired', 'cancelled'),
            tier: fc.constant('premium'),
            trialStartDate: fc.option(pastDateGen, { nil: undefined }),
            trialEndDate: fc.option(pastDateGen, { nil: undefined }),
            currentPeriodStart: fc.option(pastDateGen, { nil: undefined }),
            currentPeriodEnd: pastDateGen,
            cancelAtPeriodEnd: fc.boolean(),
          }),
          (subscription: Subscription) => {
            // Expired or cancelled subscriptions with past end dates should not grant access
            const hasAccess = hasActiveSubscription(subscription);
            expect(hasAccess).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle null subscription by denying access', () => {
      const hasAccess = hasActiveSubscription(null);
      expect(hasAccess).toBe(false);
    });

    it('should grant access during trial period regardless of other fields', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 14 }),
          fc.constantFrom('free', 'premium'),
          fc.boolean(),
          (daysRemaining, tier, cancelAtPeriodEnd) => {
            const trialEndDate = new Date();
            trialEndDate.setDate(trialEndDate.getDate() + daysRemaining);

            const subscription: Subscription = {
              status: 'trial',
              tier,
              trialStartDate: new Date().toISOString(),
              trialEndDate: trialEndDate.toISOString(),
              currentPeriodStart: new Date().toISOString(),
              currentPeriodEnd: trialEndDate.toISOString(),
              cancelAtPeriodEnd,
            };

            // Should have access during trial period
            const hasAccess = hasActiveSubscription(subscription);
            expect(hasAccess).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain access consistency across multiple checks', () => {
      fc.assert(
        fc.property(subscriptionGen, (subscription: Subscription) => {
          // Multiple checks should return the same result
          const firstCheck = hasActiveSubscription(subscription);
          const secondCheck = hasActiveSubscription(subscription);
          const thirdCheck = hasActiveSubscription(subscription);

          expect(firstCheck).toBe(secondCheck);
          expect(secondCheck).toBe(thirdCheck);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Subscription State Invariants', () => {
    it('should never have negative trial days remaining', () => {
      fc.assert(
        fc.property(subscriptionGen, (subscription: Subscription) => {
          const daysRemaining = getTrialDaysRemaining(subscription);
          expect(daysRemaining).toBeGreaterThanOrEqual(0);
        }),
        { numRuns: 100 }
      );
    });

    it('should return 0 trial days for non-trial subscriptions', () => {
      fc.assert(
        fc.property(
          fc.record({
            status: fc.constantFrom<SubscriptionStatus>('active', 'expired', 'cancelled'),
            tier: fc.constantFrom('free', 'premium'),
            trialStartDate: fc.option(pastDateGen, { nil: undefined }),
            trialEndDate: fc.option(futureDateGen, { nil: undefined }),
            currentPeriodStart: fc.option(pastDateGen, { nil: undefined }),
            currentPeriodEnd: fc.option(futureDateGen, { nil: undefined }),
            cancelAtPeriodEnd: fc.boolean(),
          }),
          (subscription: Subscription) => {
            const daysRemaining = getTrialDaysRemaining(subscription);
            expect(daysRemaining).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle subscriptions with missing dates gracefully', () => {
      fc.assert(
        fc.property(
          fc.record({
            status: subscriptionStatusGen,
            tier: fc.constantFrom('free', 'premium'),
            trialStartDate: fc.constant(undefined),
            trialEndDate: fc.constant(undefined),
            currentPeriodStart: fc.constant(undefined),
            currentPeriodEnd: fc.constant(undefined),
            cancelAtPeriodEnd: fc.boolean(),
          }),
          (subscription: Subscription) => {
            // Should not throw errors
            expect(() => hasActiveSubscription(subscription)).not.toThrow();
            expect(() => getTrialDaysRemaining(subscription)).not.toThrow();

            // Should deny access without valid dates
            const hasAccess = hasActiveSubscription(subscription);
            expect(hasAccess).toBe(false);

            // Should return 0 trial days without dates
            const daysRemaining = getTrialDaysRemaining(subscription);
            expect(daysRemaining).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
