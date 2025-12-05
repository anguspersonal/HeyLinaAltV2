# Known Warnings and Issues

This document tracks known warnings, their impact, and our decision on how to handle them.

## Browser Console Warnings (Web Platform)

### 1. Forced Reflow Warning
**Warning:** `[Violation] Forced reflow while executing JavaScript took 97ms`

**Source:** React Native Web rendering engine

**Impact:** Minor performance impact during initial page load on web platform

**Decision:** **IGNORE**

**Rationale:**
- This warning occurs during the initial render when React Native Web is calculating layouts
- The 97ms delay is acceptable for an MVP and only affects web platform
- This is a mobile-first application where web is a secondary platform
- Fixing this would require deep changes to React Native Web's rendering pipeline
- The warning doesn't affect functionality or user experience significantly

**Action Required:** None


### 2. Non-Passive Event Listener Warning
**Warning:** `[Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive.`

**Source:** React Native gesture handling libraries (react-native-gesture-handler, react-native-reanimated)

**Impact:** Theoretical scroll performance impact on web platform

**Decision:** **IGNORE**

**Rationale:**
- This warning comes from React Native's gesture handling system
- The libraries need active (non-passive) listeners to properly intercept and handle gestures
- Making these listeners passive would break gesture functionality (swipes, drags, etc.)
- This is a known limitation of React Native Web when using gesture libraries
- Mobile platforms (iOS/Android) don't have this issue as they use native gesture handlers
- The actual performance impact is negligible for our use case

**Action Required:** None

**Reference:** https://www.chromestatus.com/feature/5745543795965952


## Fixed Issues

### 3. expo-secure-store Not Available on Web
**Error:** `TypeError: ExpoSecureStore.default.setValueWithKeyAsync is not a function`

**Source:** Direct usage of `expo-secure-store` in web builds

**Impact:** Complete failure of storage operations on web platform

**Decision:** **FIXED**

**Solution:**
- Created cross-platform storage utility at `lib/storage.ts`
- Uses `expo-secure-store` on native platforms (iOS/Android)
- Uses `localStorage` on web platform
- All app code now uses `import storage from '@/lib/storage'` instead of direct SecureStore imports

**Files Updated:**
- `lib/storage.ts` (new utility)
- `app/profile-setup.tsx`
- `app/expectation-setting.tsx`
- `app/_layout.tsx`
- `features/onboarding/screens/WelcomeScreen.tsx`

**Note:** The Supabase client (`lib/supabase/client.ts`) already handles this correctly with platform-specific adapters.

---

## Future Considerations

If web platform performance becomes a priority:
1. Consider using web-specific gesture libraries for web builds
2. Implement platform-specific code splitting to avoid loading mobile gesture handlers on web
3. Profile and optimize the initial render pipeline

---

**Last Updated:** 2025-12-05
