# Feature: Supabase Auth Integration — Implementation Plan

**Status:** Implementation Planning  
**Last Updated:** 2025-11-29T12:50:00Z  
**Current Stage:** Implementation

---

## Overview
- Mobile app uses Supabase Auth for email/password signup and login.
- Session must persist securely across app launches and refresh when expired.
- Errors surface in-line with existing calm/supportive tone; logout clears session state.

## Key Decisions
- **SDK:** Use `@supabase/supabase-js` v2 with Expo-compatible configuration.
- **Storage:** Persist session using Expo SecureStore (key `supabase.session`) with fallback to in-memory during bootstrap.
- **Session Refresh:** Enable auto-refresh from supabase-js; add manual refresh on app resume.
- **Env Config:** Add `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`; no secrets in code.
- **Network Layer:** Wrap fetch via Supabase client; ensure RLS-ready (always send access token).

## Architecture & Data Flow
1) **Bootstrap**
   - Initialize Supabase client with env vars and SecureStore adapter.
   - Attempt to load cached session; set auth state in global store.
2) **Signup/Login**
   - Call `supabase.auth.signUp` / `signInWithPassword`.
   - On success, store session in SecureStore; hydrate store.
3) **Session Refresh**
   - Rely on supabase-js auto-refresh; add listener for `onAuthStateChange`.
   - On app foreground, call `supabase.auth.getSession` to reconcile.
4) **Logout**
   - Call `supabase.auth.signOut`.
   - Clear SecureStore and global auth store; reset navigation stack to onboarding/login.
5) **API Consumption**
   - For Supabase RPC/table access, reuse shared client to ensure access token is attached.

## Client Work Items
- **Dependencies:** Add `@supabase/supabase-js`, `expo-secure-store`. Keep TypeScript types up to date.
- **Config:** Add env entries to `.env.example`, `app.config.ts`/`app.json` reads `EXPO_PUBLIC_*`.
- **Supabase Client:** Create `lib/supabase/client.ts` exporting a singleton configured with SecureStore adapter.
- **Auth Store:** Add `stores/auth.ts` (Zustand/Context—follow existing state pattern) with state: `session`, `user`, `status`, and actions `bootstrap`, `signUp`, `signIn`, `signOut`.
- **Screens:** Wire signup/login forms to store actions; display inline errors and loading states.
- **Navigation:** Guard authed routes; show splash while bootstrap resolves; redirect on logout.
- **Network:** Replace any raw Supabase fetch calls to use shared client; audit for token usage.

## Error Handling & UX
- Map Supabase errors to user-friendly messages (invalid credentials, rate limiting, network).
- Show inline error text under inputs; avoid modal spam.
- Add retry for transient network errors on bootstrap/refresh; fail gracefully to login screen.

## Security
- Store session only in SecureStore; avoid AsyncStorage.
- Never log tokens; ensure crash reporting scrubbers ignore auth payloads.
- Use `persistSession: true`, `autoRefreshToken: true` on client init.
- Ensure logout wipes SecureStore key and in-memory state.

## Testing & Verification
- **Unit:** Auth store actions (bootstrap, signIn, signOut), SecureStore adapter interactions mocked.
- **E2E / Manual:** 
  - Signup and login flows; session persists after app restart.
  - Token refresh after ~50 min inactivity (simulate via time travel/mock).
  - Logout clears session and redirects to login.
  - Error messaging for bad password and offline mode.
- **Static:** Type check and lint after adding dependencies.

## Rollout & Ops
- Add Supabase project URL and anon key to envs for dev/stage/prod; keep prod anon key scoped.
- Feature flag not required; release behind app update once login screen is ready.
- Document recovery playbook: rotate anon key and redeploy envs if exposed.

---

## Message back to Implementer (2025-11-29T14:38:00Z)

**From:** QA Engineer  
**To:** Architect+Implementer  
**Status:** PRE-FLIGHT CHECKS FAILED - CANNOT PROCEED TO MANUAL TESTING

### Pre-Flight Check Results

**❌ TypeScript Compilation: FAILED**

```
stores/auth.ts(178,34): error TS1161: Unterminated regular expression literal.
```

**✅ Linting: PASSED**

**⏸️ Tests: SKIPPED** (pre-flight failed)

**⏸️ Build: SKIPPED** (pre-flight failed)

### Issue Details

**File:** `stores/auth.ts`  
**Line:** 178, Column 34  
**Error:** Unterminated regular expression literal

**Context:**
```typescript
// Line 178
return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
```

This appears to be a syntax error in the JSX return statement. The TypeScript compiler is interpreting something as a regular expression when it shouldn't be.

### Cannot Proceed Until

- TypeScript compilation passes without errors
- All pre-flight checks (TypeScript, linting, tests, build) complete successfully

### Next Steps

Please fix the TypeScript compilation error in `stores/auth.ts:178` and re-run implementation using:

```bash
gen_impl_back docs/feat_supabase_auth_IMPL.md
```

**Note:** Per QA workflow, manual testing cannot begin until all pre-flight checks pass. This file will remain at `_IMPL.md` stage until issues are resolved.
