# Feature Generation Flow

## Commands

**Usage Format:**
- `gen_feature` or `gen_pm` - Start as Product Manager (creates `docs/feat_[name]_PRD.md`)
- `gen_impl docs/feat_[name]_PRD.md` - Start as Architect+Implementer (appends & renames to IMPL)
- `gen_qa docs/feat_[name]_IMPL.md` - Start as QA Engineer (appends & renames to QA)
- `gen_pub docs/feat_[name]_QA.md` - Start as Publisher (appends & renames to DONE)

**Important:** If you receive a command but the required file is missing or unclear, **ask the user to provide it** before proceeding.

**Purpose:** Multi-agent workflow to create new features through specialized agent collaboration (PM → Architect+Implementer → QA → Publisher).

**Implementation Strategy:** Simpler orchestration (e.g., LangGraph or local script) than the backend-heavy review flow.

---

## Handover Documentation

**All agents work in a single feature document:** `docs/feat_[featurename]_[status].md`

**Structure:**
- Each agent appends their section to the document
- Each section includes a timestamp and status
- The filename status updates as the feature progresses through stages

**Filename Convention:**
- `feat_[featurename]_PRD.md` - After PM completes
- `feat_[featurename]_IMPL.md` - After Architect+Implementer completes
- `feat_[featurename]_QA.md` - After QA completes
- `feat_[featurename]_DONE.md` - After Publisher completes

**Agents should rename the file** when they complete their section to reflect the new status.

---

## Workflow Overview

This is a **sequential handoff chain** where each agent:
1. Receives the feature document file path from the previous agent
2. Reads the document to understand context
3. Performs their specialized role
4. Appends their section to the document
5. Renames the file to reflect new status
6. Hands off the new file path to the next agent

---

## Agent 1: Product Manager (PM)

**Trigger:** User invokes `gen_feature` command

**Role:** Interview the user to extract clear, complete requirements.

**Process:**
1. Ask the user to describe the feature they want
2. Clarify:
   - What problem does this solve?
   - Who is the user?
   - What are the acceptance criteria?
   - Any technical constraints or preferences?
3. Document findings in a **Product Requirements Doc (PRD)**

**Output Format:**

Create file: `docs/feat_[featurename]_PRD.md`

```markdown
# Feature: [Feature Name]

**Status:** PRD Complete  
**Last Updated:** [ISO Timestamp]  
**Current Stage:** Product Requirements

---

## 1. Product Requirements (PM)

**Completed:** [ISO Timestamp]

### Problem Statement
[What problem are we solving?]

### User Story
As a [user type], I want [goal] so that [benefit].

### Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Technical Constraints
- [Constraint 1]
- [Constraint 2]

### Out of Scope
- [What we're NOT doing]

---

## Next Steps
**Handoff to:** Architect+Implementer  
**Command:** `gen_impl docs/feat_[featurename]_PRD.md`
```

**Handoff:** Provide the file path to the Architect+Implementer:
> "PRD complete. Please design and implement this feature using `gen_impl docs/feat_[featurename]_PRD.md`. Create the technical design, then proceed to implementation."

---

## Agent 2: Architect + Implementer (Combined Role)

**Trigger:** User invokes `gen_impl docs/feat_[name]_PRD.md`

**Input:** File path to PRD document

**Role:** Design the technical solution AND implement it. This role embraces the agent's natural planning-then-execution flow.

**Process:**

### Phase 1: Architecture & Planning
1. **Verify input:** Confirm you have received the file path and can read the PRD. If not, ask the user to provide it.
2. Read and review the PRD from the file
3. Analyze existing codebase structure (check relevant directories)
4. Design the solution:
   - What files need to be created/modified?
   - What patterns/libraries to use?
   - How does it integrate with existing code?
5. Break down into implementation tasks
6. Create an `implementation_plan.md` (agent's natural behavior)

### Phase 2: Implementation
7. **Proceed with implementation** (click the "Proceed" button or continue automatically)
8. Implement each task in the implementation plan
9. Follow existing code style and patterns
10. Add basic error handling
11. Document key functions

**Note on Commands:** If you need to run terminal commands (e.g., `npm install`) and they fail due to WSL environment issues:
- **Stop immediately**
- Provide the exact command that failed
- Ask the user to run it manually in their WSL terminal
- Wait for the user to paste the output
- Continue based on their output

**Output Format:**

Append to `docs/feat_[featurename]_PRD.md` and rename to `docs/feat_[featurename]_IMPL.md`:

```markdown
---

## 2. Technical Design & Implementation (Architect+Implementer)

**Completed:** [ISO Timestamp]

### Architecture Overview
[High-level design approach]

### Files Modified
- `path/to/file1.ts` - [What changes were made]
- `path/to/file2.tsx` - [What changes were made]

### Files Created
- `path/to/newfile.ts` - [Purpose and what was implemented]

### Implementation Plan Executed
1. [x] [Task 1] - [Brief note on completion]
2. [x] [Task 2] - [Brief note on completion]
3. [x] [Task 3] - [Brief note on completion]

### Dependencies Added
- [Any new packages installed]

### Integration Points
- [How this connects to existing code]

### Implementation Notes
- [Key decisions made during implementation]
- [Any deviations from initial plan and why]
- [Challenges encountered and solutions]

### Testing Notes
- [How to test this feature]
- [Any setup required]

---

## Next Steps
**Handoff to:** QA Engineer  
**Command:** `gen_qa docs/feat_[featurename]_IMPL.md`
```

**Update file status in header:**
```markdown
**Status:** Implementation Complete  
**Last Updated:** [ISO Timestamp]  
**Current Stage:** Implementation
```

**Handoff:** Provide the updated file path:
> "Design and implementation complete. Please test according to `docs/feat_[featurename]_IMPL.md` using `gen_qa docs/feat_[featurename]_IMPL.md`"

**Note:** The `implementation_plan.md` artifact created during planning is valuable for QA to understand the intended approach.

---

## Agent 3: QA Engineer (The "Tester")

**Trigger:** User invokes `gen_qa docs/feat_[name]_IMPL.md`

**Input:** File path to IMPL document (which contains PRD, TDD, and implementation notes)

**Role:** Verify the feature against the original PRD acceptance criteria. Fix trivial issues directly, push back only big issues.

**Process:**
1. **Verify input:** Confirm you have received the file path and can read the document. If not, ask the user to provide it.
2. Read the PRD acceptance criteria from the file
3. Test each criterion:
   - Does the feature work as specified?
   - Are there any bugs or edge cases?
   - Does it integrate properly with existing features?
4. **Handle issues - Fix trivial, push back big:**
   - **Trivial issues (FIX YOURSELF):** Styling, typos, simple validations, basic error messages, simple accessibility fixes
   - **Big issues (PUSH BACK):** Broken functionality, missing features, major bugs, architectural problems, complex logic errors
5. Document findings including any trivial fixes made

**Output Format:**

Append to `docs/feat_[featurename]_IMPL.md` and rename to `docs/feat_[featurename]_QA.md`:

```markdown
---

## 3. QA Testing (QA Engineer)

**Completed:** [ISO Timestamp]

### Test Results
- [x] [Criterion 1] - PASS
- [ ] [Criterion 2] - FAIL: [Bug description]
- [x] [Criterion 3] - PASS

### Trivial Issues Fixed by QA
*QA fixed these issues directly during testing:*
1. **[Issue Title]** (if any)
   - Location: [File/line]
   - Fix: [What was changed]

### Big Issues Requiring Implementer
*Issues too complex for QA to fix:*
1. **[Bug Title]** (if any)
   - Location: [File/line]
   - Description: [What's wrong and why it needs Implementer]
   - Severity: High/Medium/Low

### Recommendations
- [Suggestion 1]
- [Suggestion 2]

### Status
- [ ] Ready for Publisher (all tests pass after trivial fixes)
- [x] Needs Implementer fixes (big issues remain)

---

## Next Steps
**Handoff to:** Publisher (if passed) OR Implementer (if failed)  
**Command:** `gen_pub docs/feat_[featurename]_QA.md` OR return to Implementer
```

**Update file status in header:**
```markdown
**Status:** QA Complete  
**Last Updated:** [ISO Timestamp]  
**Current Stage:** QA Testing
```

**Decision:**
- **If PASS:** Hand off to Publisher with file path
- **If FAIL:** Return to Implementer with bug list and file path

---

## Agent 4: Publisher

**Trigger:** User invokes `gen_pub docs/feat_[name]_QA.md`

**Input:** File path to QA document (verified code)

**Role:** Run build scripts, fix final lint/build errors, prepare for deployment.

**Process:**
1. **Verify input:** Confirm you have received the file path and can read the QA results. If not, ask the user to provide it.
2. Run `npm run build` (or equivalent)
3. Fix any TypeScript/lint errors that appear
4. Verify build succeeds
5. Optionally: commit changes, create PR, or deploy

**Note on Build Commands:** If build commands fail due to WSL environment issues:
- **Stop immediately**
- Provide the exact command that failed (e.g., `npm run build`)
- Ask the user to run it manually in their WSL terminal
- Wait for the user to paste the build output
- Address any errors shown in their output

**Output:**

Append to `docs/feat_[featurename]_QA.md` and rename to `docs/feat_[featurename]_DONE.md`:

```markdown
---

## 4. Deployment (Publisher)

**Completed:** [ISO Timestamp]

### Build Status
- [x] Build successful
- [x] All lint errors fixed
- [x] TypeScript compilation passed

### Final Fixes Made
- [Fix 1]
- [Fix 2]

### Git Workflow
- [x] Changes reviewed with `git status`
- [x] Relevant files staged: [list key files]
- [x] Committed with message: `[commit message]`
- [x] Pushed to branch: [branch name]

### Deployment Status
- [ ] PR created: [PR link] (if using PR workflow)
- [ ] Deployed to: [environment] (if applicable)

### Feature Complete
✅ Feature is ready for production use.

---

**Status:** DONE  
**Last Updated:** [ISO Timestamp]  
**Current Stage:** Deployed
```

**Completion:** Feature is ready for production. Archive the document in `docs/` for future reference.

---

## Notes

- **This is a synchronous chain:** Each agent waits for the previous one to complete.
- **Backtracking is allowed:** If QA finds issues, loop back to Implementer.
- **Single source of truth:** All context lives in one evolving document with timestamps.
- **File-based handoffs:** Agents pass file paths, not unstructured copy-paste.
- **Future enhancement:** Could be orchestrated with LangGraph for automated handoffs.
