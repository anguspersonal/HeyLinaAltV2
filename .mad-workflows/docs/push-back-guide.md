# Push-Back Quick Reference Guide

**Philosophy:** Push-back is GOOD. It's a core feature of Multi-Agent Debate that improves quality through collaborative challenge.

---

## When to Use Push-Back Commands

| Scenario | Who Pushes Back | Command to Use | When |
|----------|-----------------|----------------|------|
| **User → PM** | User realizes PRD is wrong | `gen_pm_back docs/feat_X_PRD.md` | After reviewing PRD, requirements need changes |
| **Implementer → PM** | PRD is unclear/incomplete | Add "Message back to PM" then user runs `gen_pm_back` | PRD has gaps, contradictions, or missing details |
| **QA → Implementer** | Tests fail | Add "Message back to Implementer" then user runs `gen_impl_back` | Implementation doesn't meet acceptance criteria |
| **Implementer → QA** | Claims fixes done | User runs `gen_qa_back` | After fixing issues from QA push-back |

---

## Command Reference

### `gen_pm_back docs/feat_[name]_PRD.md`

**Who runs it:** Product Manager (in response to push-back)

**When to use:**
- User reviewed PRD and wants changes
- Implementer pushed back with "Message back to PM" section

**What it does:**
- PM reads push-back feedback
- Clarifies requirements
- Updates PRD with clarifications
- Hands back to Implementer

**Output:** Updated `_PRD.md` with clarifications

---

### `gen_impl_back docs/feat_[name]_IMPL.md` or `_PRD.md`

**Who runs it:** Architect+Implementer (in response to push-back)

**When to use:**
- QA pushed back with "Message back to Implementer" section
- PM provided clarifications via `gen_pm_back`

**What it does:**
- Reads push-back feedback
- Fixes bugs or implements clarifications
- Adds "Implementation Fixes" section
- Hands back to QA for re-testing

**Output:** Updated `_IMPL.md` with fixes (file stays at IMPL stage)

---

### `gen_qa_back docs/feat_[name]_IMPL.md`

**Who runs it:** QA Engineer (re-testing after fixes)

**When to use:**
- Implementer claims fixes are complete via `gen_impl_back`

**What it does:**
- Re-tests all previously failed items
- Checks for regression bugs
- Either passes (→ `_QA.md`) or pushes back again

**Output:** Either `_QA.md` (pass) or updated `_IMPL.md` with new feedback (fail)

---

## How Implementer Pushes Back to PM

**Scenario:** You're the Implementer and the PRD is unclear.

**Steps:**
1. **DO NOT guess or implement with unclear requirements**
2. **Add a section to the document:**

```markdown
## Message back to PM (2025-11-22 14:30:00 UTC)

**From:** Architect+Implementer
**To:** Product Manager
**Issue:** PRD lacks clarity on authentication flow

**Specific Questions:**
1. Should we support OAuth or just email/password?
2. What happens when user forgets password?
3. Should passwords expire after X days?

**Cannot Proceed Until:** Authentication requirements are clarified
```

3. **DO NOT implement anything**
4. **Inform user:**
   > "I've identified gaps in the PRD. Please clarify using `gen_pm_back docs/feat_auth_PRD.md`"

---

## How QA Pushes Back to Implementer

**Scenario:** You're QA and tests failed.

**Steps:**
1. **Test thoroughly against PRD acceptance criteria**
2. **Add a section to the document:**

```markdown
## Message back to Implementer (2025-11-22 15:45:00 UTC)

**From:** QA Engineer
**To:** Architect+Implementer
**Status:** TESTS FAILED

**Failed Acceptance Criteria:**
1. [AC #2: User can login] - Login button doesn't work, returns 500 error
2. [AC #4: Password reset] - Reset email never arrives

**Bugs Found:**
1. **Login Error:** Click login → Console shows 500 error → No feedback to user
   - Steps: Enter valid credentials → Click login → Error occurs
   - Expected: Successful login
   - Actual: 500 error, no user feedback

2. **Password Reset Email:** Request reset → Email never arrives → User stuck
   - Steps: Click "Forgot Password" → Enter email → Submit → Wait 5 minutes
   - Expected: Email with reset link
   - Actual: No email received

**Cannot Proceed Until:** Both issues fixed and verified
```

3. **DO NOT rename to `_QA.md`** (keep as `_IMPL.md`)
4. **Inform user:**
   > "Tests failed. Please fix using `gen_impl_back docs/feat_auth_IMPL.md`"

---

## How PM Pushes Back to User

**Scenario:** You're PM and the user's feature request is unclear.

**Steps:**
1. **DO NOT guess what they want**
2. **Ask specific clarifying questions:**

```
I need clarification on a few points before I can create the PRD:

1. **User Authentication:** You mentioned "users can login" but didn't specify:
   - What authentication methods? (email/password, OAuth, social login?)
   - Should we support "Remember Me" functionality?
   - What's the password reset flow?

2. **User Roles:** You mentioned "admin" and "regular users":
   - What specific permissions does each role have?
   - Can admins create other admins?
   - Are there any other roles we need?

3. **Success Criteria:** How will we measure success?
   - Is it just "feature works" or are there metrics?
   - Are there performance requirements?

Please clarify these points so I can create a complete PRD.
```

3. **Wait for user response**
4. **Only proceed once clarity is achieved**

---

## Fresh Agent Context (IMPORTANT)

**Key Principle:** The `_back` commands may run in a FRESH AGENT with no conversation history.

**This means:**
- ✅ **All context MUST be in the feature document itself**
- ✅ **Always read the ENTIRE document first**
- ✅ **Look for "Message back to [Role]" sections**
- ✅ **Include timestamps in all push-back sections**
- ✅ **Be specific and detailed in feedback**

**Template for "Message back" sections:**

```markdown
## Message back to [Role] (ISO Timestamp)

**From:** [Your Role]
**To:** [Target Role]
**Issue:** [One-sentence summary]

**Specific Questions/Issues:**
1. [Detailed point 1]
2. [Detailed point 2]
3. [Detailed point 3]

**Cannot Proceed Until:** [Clear blocking condition]
```

---

## Push-Back Philosophy Summary

**✅ DO Push Back When:**
- Requirements are vague or contradictory
- Implementation doesn't match PRD
- Tests fail or acceptance criteria aren't met
- Technical constraints aren't feasible
- Missing critical information

**❌ DON'T Push Back For:**
- Minor style preferences
- Over-engineering concerns (unless blocking)
- Personal disagreement with approach (if it meets requirements)

**Remember:** Push-back improves quality. It's not confrontation—it's collaboration.

---

## Quick Workflow Examples

### Example 1: QA Finds Bugs

```
User: gen_qa docs/feat_auth_IMPL.md
QA: Tests failed! Added "Message back to Implementer" to feat_auth_IMPL.md

User: gen_impl_back docs/feat_auth_IMPL.md
Implementer: Fixed bugs, added "Implementation Fixes" section

User: gen_qa_back docs/feat_auth_IMPL.md
QA: All tests pass! Renamed to feat_auth_QA.md, ready for deployment
```

### Example 2: Implementer Finds PRD Gaps

```
User: gen_impl docs/feat_payments_PRD.md
Implementer: PRD is unclear on payment providers. Added "Message back to PM"

User: gen_pm_back docs/feat_payments_PRD.md
PM: Clarified payment providers (Stripe + PayPal), updated PRD

User: gen_impl docs/feat_payments_PRD.md
Implementer: Now clear! Implementing with Stripe + PayPal...
```

### Example 3: PM Pushes Back on User

```
User: gen_pm
PM: I need more details before creating the PRD:
    1. What authentication methods?
    2. What user roles?
    3. What are the performance requirements?

User: (provides clarifications)
PM: Perfect! Creating PRD now...
```

---

## Integration with MAD Workflow

Push-back is now integrated into all MAD workflow stages:

1. **PM Stage:** Can push back on User if unclear
2. **Implementation Stage:** Can push back on PM if PRD incomplete
3. **QA Stage:** Can push back on Implementer if tests fail
4. **All Stages:** Use single evolving document with "Message back" sections

**See full workflows in:**
- `.mad-workflows/workflows/feature-creation.md` - Complete push-back workflows for each agent
- `.mad-workflows/AGENT_MANIFEST.md` - Command reference
- `.mad-workflows/README.md` - Quick start guide

