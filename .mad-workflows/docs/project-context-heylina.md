# HeyLina Project Context for MAD Workflows

## Quick Reference for All Agents

This document provides HeyLina-specific context for agents working through the MAD workflow system.

---

## Project Foundation

### Built on Ignite Boilerplate

**Source**: [Ignite by Infinite Red](https://github.com/infinitered/ignite)

- Battle-tested React Native boilerplate (since 2016)
- Most popular third-party React Native/Expo boilerplate
- Includes CLI, component generators, proven patterns
- Well-documented, production-ready foundation

### Current Status (Nov 22, 2025)

**🔴 100% Boilerplate - No HeyLina Features Built Yet**

This means:
- All current screens, components, utilities are generic Ignite defaults
- No product-specific logic has been implemented
- Perfect clean slate for building HeyLina

---

## Creative Freedom: The Golden Rule

### You Have Ultimate Creative Freedom

**Do NOT treat existing code as sacred.**

- ✅ **Replace** boilerplate screens with HeyLina-specific designs
- ✅ **Remove** generic demo components that don't serve the product
- ✅ **Adapt** navigation patterns to fit emotional clarity journeys
- ✅ **Change** theming to match HeyLina's calm, compassionate aesthetic
- ✅ **Rethink** data models to support relationship intelligence
- ✅ **Prioritize** product vision over boilerplate conventions

### The Guiding Question

> **"Does this serve Julie's journey toward emotional clarity in dating?"**

If no, change it. If yes, build it.

---

## Product Vision Quick Reference

**Source**: `HeyLinaMobileDevOnboardingPack.md`

### What HeyLina Is

**One-line**: AI companion that gives emotionally intelligent, context-aware guidance for modern dating

- NOT a dating app (we don't match people)
- NOT therapy (though informed by CBT and therapist practices)
- YES emotional intelligence layer underneath dating

### Target User: Julie

- **Age**: 28
- **Location**: London (major UK city)
- **Status**: Single, actively dating with intention
- **Job**: Professional, ambitious
- **Pain**: Dating app burnout, overthinks messages, feels exhausted
- **Needs**: Clarity, accountability, emotional support

### Core Values (Shape ALL Decisions)

1. **Integrity**: Data integrity, structural integrity, honest UX
2. **Trust**: Trust is our moat - no gimmicks or manipulation
3. **Compassion**: Design for anxiety, heartbreak, self-doubt

### Tone of Voice

- ✅ Warm and conversational
- ✅ Direct but kind
- ✅ Slightly playful (never mocking)
- ✅ Confident enough to set boundaries
- ❌ NOT clinical ("Your attachment schema...")
- ❌ NOT flippant ("Dump him lol")

### V1 Feature Priorities

From the onboarding pack (section 4.2):
1. Account creation and login
2. Onboarding and intention setting
3. Chat with Lina (core interaction)
4. Score and insights view (Emotional Health Score)
5. History and bookmarks
6. Notifications and check-ins
7. Subscription and paywall (£14.99/month, 14-day trial)
8. Settings and safety

---

## Role-Specific Guidance

### For Product Managers (gen_pm / gen_pm_auto)

When scoping features:
- **Reference**: `HeyLinaMobileDevOnboardingPack.md` section 4.2 (V1 feature set)
- **Don't be constrained** by boilerplate screens
- **Think about**: Julie's emotional triggers (breakup, ghosted, no second dates)
- **Prioritize**: Features that make users feel heard and emotionally held
- **Scope**: ~1 week dev work, aligned with V1 priorities

**Example Good PRD Topics:**
- Onboarding flow that sets emotional safety context
- Chat interface optimized for reflection (not quick replies)
- Emotional Health Score visualization (non-judgmental, growth-focused)
- Check-in notifications that feel caring (not spammy)

### For Architects+Implementers (gen_impl)

When designing and implementing:
- **Feel free to** replace boilerplate components entirely
- **Data models**: Think longitudinal (history, patterns, emotional states over time)
- **UI/UX**: Calm colors, rounded shapes, legible, "journaling meets therapy chat"
- **State management**: Consider emotional context persistence across sessions
- **API**: Assume AI backend for chat, RAG, scoring (focus on frontend)

**Example Bold Moves (Encouraged):**
- Replace Ignite's demo screens with HeyLina-specific ones
- Change theming system to support calm/compassionate aesthetic
- Rework navigation to prioritize chat as primary surface
- Add emotional state tracking models (not in boilerplate)

### For QA Engineers (gen_qa)

When testing:
- **Validate tone**: Does microcopy feel warm and compassionate?
- **Check clarity**: Would Julie understand this without confusion?
- **Test emotional flows**: Does this feel safe for someone in distress?
- **Verify safety**: Are crisis disclaimers present where needed?

### For Publishers (gen_pub)

When building and deploying:
- **Strict TypeScript**: Keep passing before merging
- **Lint rules**: Follow project prettier/eslint (see AGENTS.md)
- **Platform testing**: Verify Android + iOS if UI changes

---

## Tech Stack Context

### Core Stack
- **Framework**: React Native + Expo
- **Language**: TypeScript (strict mode)
- **Base**: Ignite boilerplate by Infinite Red
- **Navigation**: React Navigation (stack + tab)
- **State**: React hooks + React Query/SWR for server state
- **Storage**: Secure storage for tokens, AsyncStorage for prefs

### Code Style (from AGENTS.md)
- Prettier: 100-char width, no semicolons, double quotes, trailing commas
- Imports: Alphabetized, use aliases (`@/*` → `app/*`)
- Components: PascalCase files, named exports
- Utilities: camelCase files

### Commands Reference
- `yarn start` - Launch dev
- `yarn android` / `yarn ios` / `yarn web` - Platform runs
- `yarn compile` - TypeScript check
- `yarn lint` - ESLint + Prettier
- `yarn test` - Jest tests

---

## Browser Access

All agents have browser tools available for:
- Researching React Native patterns
- Looking up library documentation
- Finding design inspiration (wellness apps, journaling apps)
- Checking Ignite docs when needed
- Verifying accessibility standards

**Example uses:**
- "Search for React Native emotion tracking UI patterns"
- "Look up Expo notifications best practices"
- "Find examples of compassionate error messaging"

---

## Key Reminders

### Environment
- **WSL (Ubuntu)**: Commands may need manual user execution
- **Passwords**: Stop at password prompts, ask user to run manually
- **Environment vars**: User manages `.env` files - never write them

### Data Privacy
- **Sensitive context**: Relationship data is highly personal
- **Never log**: Sensitive content to third-party analytics
- **Secure storage**: Required for auth tokens and personal identifiers

### Safety & Ethics
- **Never position** Lina as a crisis line or therapist
- **Always provide** signposting to crisis resources where needed
- **Make it easy** for users to pause or leave if overwhelmed
- **Disclaimers**: Clear in onboarding and relevant screens

---

## Quick Decision Framework

When in doubt, ask:

1. **Does this serve Julie's emotional clarity journey?** 
   - If yes → Build it
   - If no → Don't build it

2. **Would this feel compassionate to someone in distress?**
   - If yes → Good tone
   - If no → Revise messaging

3. **Does this build trust or break it?**
   - Trust builds: Transparency, clear value, gentle guidance
   - Trust breaks: Gimmicks, manipulative patterns, overpromising

4. **Is this product-specific or generic boilerplate?**
   - Product-specific → Implement with care
   - Generic boilerplate → Feel free to replace

---

## Further Reading

- **Product Vision**: `HeyLinaMobileDevOnboardingPack.md` (full 638 lines)
- **Project Guidelines**: `AGENTS.md`
- **MAD System**: `.mad-workflows/README.md`
- **Ignite Docs**: https://github.com/infinitered/ignite

---

**Last Updated**: November 22, 2025  
**Status**: Boilerplate stage, ready for HeyLina-specific development

