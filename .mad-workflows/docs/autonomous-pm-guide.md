# Autonomous PM Mode Guide

## What is `gen_pm_auto`?

The `gen_pm_auto` command allows the Product Manager agent to **autonomously scope and plan a project** without requiring a real-time interview with the user.

### Use Case

When you want the PM to:
- Review the project's vision and goals
- Identify uncompleted features from planning documents
- Scope a moderate project (~1 week of dev work)
- Create a PRD without hand-holding

### When to Use

✅ **Use `gen_pm_auto` when:**
- You have clear vision/onboarding documents
- You have roadmaps, backlogs, or planning docs
- You want the PM to propose what to build next
- You trust the PM to prioritize based on documentation

❌ **Don't use `gen_pm_auto` when:**
- You have a specific feature in mind (use `gen_pm` instead)
- The project has no vision docs or planning materials
- You want to discuss requirements interactively

---

## How It Works

### Step 1: PM Reviews Documentation

The PM agent will:
1. Search for and read vision documents (e.g., `HeyLinaMobileDevOnboardingPack.md`)
2. Look for planning docs, roadmaps, backlogs in:
   - `docs/` folder
   - Root-level markdown files
   - `planning/` folder
   - Any other obvious locations

### Step 2: Clarity Check

If the PM finds:
- **Clear vision + identified tasks** → Proceeds to scope a project
- **Unclear goals or no backlog** → Stops and asks user for clarification

Example questions PM might ask:
- "I found the vision docs but no clear backlog. What area should I focus on?"
- "I see multiple priorities: [A, B, C]. Which is most important right now?"

### Step 3: Scope a Project

The PM will select or define a feature that:
- Aligns with the mission/vision
- Represents ~1 week of development work
- Can go through the full MAD cycle (PM → Impl → QA → Pub)
- Has clear user value and impact

### Step 4: Create PRD

The PM will:
1. Read the template: `.mad-workflows/templates/1-prd.md`
2. Create `docs/feat_[featurename]_PRD.md`
3. Include:
   - Problem statement
   - User story
   - Clear acceptance criteria
   - Technical constraints
   - Out of scope items

### Step 5: Hand Off

The PM provides the file path to the Architect+Implementer:

> "PRD complete. Please design and implement this feature using `gen_impl docs/feat_[featurename]_PRD.md`"

---

## Important Constraints

### PM Stays in Role

The autonomous PM will:
- ✅ Define **what** to build
- ✅ Specify acceptance criteria
- ✅ Identify constraints
- ❌ **NOT** create implementation plans
- ❌ **NOT** design technical solutions
- ❌ **NOT** write code

**Why?** The PM is a product person, not a developer. Technical planning is the Architect+Implementer's job.

### Moderate Scope Only

The PM will scope projects that:
- Take **~1 week of development** (not multi-month epics)
- Are **complete features** (not partial work)
- Can be **tested and validated** (clear acceptance criteria)

---

## Example Workflow

### Scenario: HeyLina Mobile App

```bash
# User invokes autonomous PM
User: gen_pm_auto

# PM reads vision doc
PM: Reading HeyLinaMobileDevOnboardingPack.md...
    Found target user: Julie, 28, dating with intention
    Core product: AI companion for dating clarity
    V1 features listed: Chat, Onboarding, Score, Notifications...

# PM searches for planning docs
PM: Searching for planning documents...
    No explicit backlog found
    Reviewing V1 feature set in onboarding doc...

# PM identifies gap
PM: Based on the onboarding pack, I see that "Onboarding and 
    intention setting" is listed as a V1 requirement but may not 
    be fully implemented yet. Should I scope this feature?

User: Yes, do that.

# PM creates PRD
PM: Creating docs/feat_onboarding_flow_PRD.md...
    [Writes PRD with problem statement, user story, criteria]
    
    PRD complete. Please design and implement this feature using
    gen_impl docs/feat_onboarding_flow_PRD.md

# User continues the MAD chain
User: gen_impl docs/feat_onboarding_flow_PRD.md
```

---

## Configuration for Your Project

### HeyLina-Specific Context

**Important: Boilerplate Foundation**
- HeyLina is built on [Ignite](https://github.com/infinitered/ignite) (Infinite Red's React Native boilerplate)
- As of Nov 22, 2025, **ALL code is boilerplate** - no HeyLina-specific features yet
- **Ultimate creative freedom**: Agents can liberally adapt/replace boilerplate to fit HeyLina's needs
- **Product vision is the north star**: `HeyLinaMobileDevOnboardingPack.md` > boilerplate patterns

**PM Scoping Guidance:**
- Don't be constrained by existing boilerplate screens/components
- Propose features based on HeyLina's vision, not what exists in boilerplate
- Target user: Julie, 28, seeking emotional clarity in dating
- Core value: Compassionate, non-judgmental AI companion

### Required: Vision Documents

For `gen_pm_auto` to work, your project should have:
- **Vision/mission document** explaining what you're building and why
- **User personas** or target audience definition
- **Feature scope** or high-level requirements

Example: `HeyLinaMobileDevOnboardingPack.md`

### Optional: Planning Documents

These help the PM identify what to build:
- Roadmaps (`docs/roadmap.md`)
- Backlogs (`docs/backlog.md`)
- TODO lists (`docs/todos.md`)
- Issue tracking exports

### Tell the PM Where to Look

You can create a `.mad-workflows/project-config.md` to guide the PM:

```markdown
# Project Configuration for Autonomous PM

## Vision Documents
- HeyLinaMobileDevOnboardingPack.md - Complete product vision

## Planning Documents
- docs/roadmap.md - Feature roadmap
- docs/backlog.md - Prioritized backlog

## Current Focus
- V1 mobile app features (see onboarding pack section 4.2)
```

---

## Troubleshooting

### "PM couldn't find vision docs"

**Solution:** Ensure you have clear vision documents in the root or docs folder. Tell the PM explicitly:
```
The vision is in HeyLinaMobileDevOnboardingPack.md
```

### "PM asking too many questions"

**Solution:** This means your planning docs are unclear. Either:
1. Add clearer roadmap/backlog docs
2. Switch to `gen_pm` (interview mode) for this feature

### "PM scoped something too big/small"

**Solution:** In the PRD review phase, ask the PM to rescope:
```
This seems too large for 1 week. Can you break it into smaller features?
```

### "PM is trying to design technical solutions"

**Solution:** This shouldn't happen! If it does:
1. Remind the PM: "You're a PM, not a developer"
2. File a bug in the MAD workflows system
3. Stop the PM and restart with clearer instructions

---

## Comparison: gen_pm vs gen_pm_auto

| Aspect | `gen_pm` (Interview) | `gen_pm_auto` (Autonomous) |
|--------|---------------------|---------------------------|
| **Input** | User's description | Vision docs + planning docs |
| **Process** | Interactive Q&A | Document review |
| **User effort** | High (answer questions) | Low (review output) |
| **Best for** | Specific feature ideas | "What should we build next?" |
| **Speed** | Slower (back-and-forth) | Faster (if docs are clear) |
| **Accuracy** | High (direct input) | Good (depends on doc quality) |

---

## Next Steps

After the PM creates the PRD:
1. **Review the PRD** - Make sure it aligns with your intent
2. **Continue the chain** - Use `gen_impl` to start implementation
3. **Follow through** - Complete the MAD cycle (Impl → QA → Pub)

For the full feature creation flow, see:
- `.mad-workflows/workflows/feature-creation.md`

