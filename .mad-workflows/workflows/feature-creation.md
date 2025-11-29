# Feature Generation Flow

## Commands

**Usage Format:**

### Forward Flow (Normal Progression)
- `gen_feature` or `gen_pm` - Start as Product Manager (creates `docs/feat_[name]_PRD.md`)
- `gen_pm_auto` - PM autonomously scopes a project by reviewing docs and planning materials
- `gen_impl docs/feat_[name]_PRD.md` - Start as Architect+Implementer (appends & renames to IMPL)
- `gen_qa docs/feat_[name]_IMPL.md` - Start as QA Engineer (appends & renames to QA)
- `gen_pub docs/feat_[name]_QA.md` - Start as Publisher (appends & renames to DONE)

### Push-Back Flow (Quality Control - ENCOURAGED!)
- `gen_pm_back docs/feat_[name]_PRD.md` - PM clarifies requirements after User/Implementer push-back
- `gen_impl_back docs/feat_[name]_IMPL.md` - Implementer addresses QA push-back or PM clarifications
- `gen_qa_back docs/feat_[name]_IMPL.md` - QA re-tests after Implementer fixes push-back issues

**Important:** If you receive a command but the required file is missing or unclear, **ask the user to provide it** before proceeding.

**Purpose:** Multi-agent workflow to create new features through specialized agent collaboration (PM → Architect+Implementer → QA → Publisher).

**🔄 Push-Back Philosophy:** Push-back is GOOD. It's a core feature of Multi-Agent Debate. Each agent should challenge the previous work if clarity or quality is lacking. This improves the final outcome.

---

## Handling Command Errors & Re-runs

### When Commands Are Run Out of Order or Stages Are Already Complete

**IMPORTANT:** Always check the file status before proceeding with any command.

#### Scenario 1: Command Already Complete (e.g., `gen_qa` when file is `_QA.md` or `_DONE.md`)

**What to do:**
1. **Check the file stage** by looking at the filename suffix
2. **Inform the user** that this stage is already complete
3. **Ask for clarification:**
   - "This feature has already been tested. The file is at `docs/feat_[name]_QA.md`."
   - "Do you want to:"
     - "a) Re-run QA testing (will replace existing QA section)"
     - "b) Continue to the next step (`gen_pub docs/feat_[name]_QA.md`)"
     - "c) Cancel"

**Example:**
```
User: gen_qa docs/feat_auth_IMPL.md

Agent: I notice this file is already at the IMPL stage. However, I found 
       docs/feat_auth_QA.md in the docs folder, which means QA has already 
       been completed.
       
       Do you want to:
       a) Re-run QA testing (will replace the existing QA section)
       b) Continue to deployment with: gen_pub docs/feat_auth_QA.md
       c) Cancel this command
```

#### Scenario 2: Wrong File Stage Provided (e.g., `gen_qa docs/feat_[name]_PRD.md`)

**What to do:**
1. **Check if the expected file exists** (e.g., look for `_IMPL.md` version)
2. **Inform the user:**
   - "The provided file is at PRD stage. QA requires an IMPL file."
   - If `_IMPL.md` exists: "I found `docs/feat_[name]_IMPL.md`. Did you mean to use this?"
   - If `_IMPL.md` doesn't exist: "Implementation hasn't been completed yet. You need to run `gen_impl docs/feat_[name]_PRD.md` first."

**Example:**
```
User: gen_qa docs/feat_auth_PRD.md

Agent: The file you provided is at the PRD stage, but QA requires a completed 
       implementation. I found docs/feat_auth_IMPL.md in your docs folder.
       
       Did you mean to run: gen_qa docs/feat_auth_IMPL.md?
```

#### Scenario 3: File Doesn't Exist or Wrong Name

**What to do:**
1. **Search the docs folder** for similar feature names
2. **List candidates if found:**
   - "I couldn't find that file. Did you mean one of these?"
   - List up to 5 similar files
3. **If none found:**
   - "I couldn't find any feature documents matching that name."
   - "Available features: [list _PRD, _IMPL, _QA, _DONE files]"

#### Scenario 4: User Wants to Re-run a Stage (Intentional)

**What to do:**
1. **Confirm the intention explicitly**
2. **Warn about what will be replaced:**
   - "Re-running QA will replace the existing QA section and test results."
   - "The file will remain at the same stage (_QA.md)."
3. **Proceed only after confirmation**

#### Scenario 5: Feature Already Deployed (`_DONE.md` exists)

**What to do:**
1. **Inform the user the feature is complete:**
   - "This feature has already been deployed. The file is at `docs/feat_[name]_DONE.md`."
2. **Suggest alternatives:**
   - "If you need to make changes, consider:"
     - "a) Creating a new feature for the changes (e.g., `feat_[name]_v2_PRD.md`)"
     - "b) Using code review workflows (`mrsop`, `arsop`, `afsop`) for bug fixes"
     - "c) Re-opening this feature (manual process - requires editing the file)"

### Quick Reference: Stage Validation Rules

| Command | Required Input | Valid Stages | Action |
|---------|----------------|--------------|--------|
| `gen_pm` / `gen_pm_auto` | None | N/A | Creates new `_PRD.md` |
| `gen_impl` | `_PRD.md` file | PRD only | Appends & renames to `_IMPL.md` |
| `gen_qa` | `_IMPL.md` file | IMPL only | Appends & renames to `_QA.md` |
| `gen_pub` | `_QA.md` file | QA only | Appends & renames to `_DONE.md` |

**Always validate before proceeding. Ask, don't assume.**

---

## Push-Back Workflows (Quality Control Mechanism)

### Philosophy: Push-Back is GOOD

**Core Principle:** In Multi-Agent Debate, agents should challenge each other when work lacks clarity or quality. This is not confrontation—it's collaborative quality control.

**When to Push Back:**
- ✅ Requirements are vague or contradictory
- ✅ Implementation doesn't match PRD
- ✅ Tests fail or acceptance criteria aren't met
- ✅ Technical constraints aren't feasible
- ✅ Missing critical information needed to proceed

**When NOT to Push Back:**
- ❌ Minor style preferences
- ❌ Over-engineering concerns (unless blocking)
- ❌ Personal disagreement with approach (if it meets requirements)

### Push-Back Command Reference

| Command | Who Runs It | Scenario | Input File Stage |
|---------|-------------|----------|------------------|
| `gen_pm_back` | Product Manager | User or Implementer pushes back on PRD | `_PRD.md` |
| `gen_impl_back` | Implementer | QA pushes back on implementation OR PM provides clarifications | `_IMPL.md` or `_PRD.md` |
| `gen_qa_back` | QA Engineer | Implementer claims fixes are done, QA re-tests | `_IMPL.md` |

---

### Scenario 1: PM Push-Back (Command: `gen_pm_back`)

**Trigger:** User invokes `gen_pm_back docs/feat_[name]_PRD.md`

**Who Pushes Back TO PM:**
- **User** - After reviewing PRD, user realizes requirements are wrong or incomplete
- **Implementer** - PRD has gaps, contradictions, or missing technical constraints

**Input:** File path to PRD document (may contain a "Message back to PM" section if coming from Implementer)

**Role:** Product Manager receives push-back and must clarify/revise requirements.

**Process:**
1. **Read the entire feature document** - Understand original PRD and push-back feedback
2. **Identify the issue:**
   - If from User: Ask clarifying questions about what needs to change
   - If from Implementer: Review their "Message back to PM" section for specific gaps
3. **Gather additional information:**
   - Ask user for clarification
   - Research technical constraints
   - Review product vision documents
4. **Update the PRD section:**
   - Add a `### PM Clarification (Timestamp)` subsection to the PRD section
   - Address each point raised in push-back
   - Update acceptance criteria if needed
   - Add/clarify technical constraints
5. **Decision:**
   - If clarifications are minor: Keep file as `_PRD.md`, notify user to re-run `gen_impl`
   - If major changes: Consider starting fresh with a new PRD (user decides)

**Handoff (after clarification):**
> "Requirements clarified in `docs/feat_[featurename]_PRD.md`. Please re-implement using `gen_impl docs/feat_[featurename]_PRD.md`."

**⚠️ IMPORTANT - Fresh Agent Context:**
The `gen_pm_back` command may run in a FRESH AGENT with no prior conversation history. All context MUST come from the feature document itself. Always read the full document first.

---

### Scenario 2: Implementer Push-Back (Command: `gen_impl_back`)

**Trigger:** User invokes `gen_impl_back docs/feat_[name]_IMPL.md` or `gen_impl_back docs/feat_[name]_PRD.md`

**Who Pushes Back TO Implementer:**
- **PM** - Provides clarifications after Implementer pushed back
- **QA** - Tests failed, bugs found, implementation doesn't match PRD

**Input:** File path to IMPL document (may contain a "Message back to Implementer" section from QA)

**Role:** Implementer receives push-back and must fix issues or clarify with PM.

**Two Sub-Scenarios:**

#### 2A: Implementer Pushes Back to PM (Implementer → PM)

**When:** PRD is unclear, contradictory, or missing technical details.

**Process:**
1. **Read the PRD carefully** - Identify specific gaps or contradictions
2. **DO NOT guess or assume** - If requirements are unclear, push back
3. **Add a "Message back to PM" section to the document:**
   ```markdown
   ## Message back to PM (Timestamp)
   
   **From:** Architect+Implementer
   **To:** Product Manager
   **Issue:** [Clear description of the problem]
   
   **Specific Questions:**
   1. [Question about requirement X]
   2. [Question about constraint Y]
   3. [Clarification needed on acceptance criteria Z]
   
   **Cannot Proceed Until:** [What needs to be clarified]
   ```
4. **DO NOT IMPLEMENT** - Stop work until PM clarifies
5. **Inform user:**
   > "I've identified gaps in the PRD and added a 'Message back to PM' section to `docs/feat_[featurename]_PRD.md`. Please clarify requirements using `gen_pm_back docs/feat_[featurename]_PRD.md`."

#### 2B: Implementer Responds to Push-Back (QA → Implementer or PM → Implementer)

**When:** QA found bugs OR PM provided clarifications.

**Process:**
1. **Read the entire feature document** - Understand push-back feedback
2. **Identify issues to fix:**
   - If from QA: Review their "Message back to Implementer" section
   - If from PM: Review their "PM Clarification" section
3. **Fix each issue:**
   - Update code
   - Fix bugs
   - Align implementation with clarified requirements
4. **Update the IMPL section:**
   - Add a `### Implementation Fixes (Timestamp)` subsection
   - List each issue addressed
   - Note any code changes made
5. **DO NOT rename file** - Keep as `_IMPL.md` so QA can re-test
6. **Handoff:**
   > "Issues addressed in `docs/feat_[featurename]_IMPL.md`. Please re-test using `gen_qa_back docs/feat_[featurename]_IMPL.md`."

**⚠️ IMPORTANT - Fresh Agent Context:**
The `gen_impl_back` command may run in a FRESH AGENT with no prior conversation history. All context MUST come from the feature document itself. Always read the full document first.

---

### Scenario 3: QA Push-Back (Command: `gen_qa_back`)

**Trigger:** User invokes `gen_qa_back docs/feat_[name]_IMPL.md`

**Who Pushes Back TO QA:**
- **Implementer** - Claims fixes are complete, QA must re-test

**Input:** File path to IMPL document (should contain "Implementation Fixes" section)

**Role:** QA Engineer re-tests implementation after Implementer claims fixes are complete.

**Two Sub-Scenarios:**

#### 3A: QA Pushes Back to Implementer (QA → Implementer)

**When:** BIG issues found that QA cannot fix (see Phase 2 criteria above).

**Process:**
1. **Read the entire feature document** - Understand PRD and implementation
2. **Test against acceptance criteria** - Be thorough
3. **Triage issues:**
   - **Trivial issues:** Fix them yourself (see Phase 2 criteria)
   - **Big issues:** Document for push-back
4. **For big issues only, add a "Message back to Implementer" section:**
   ```markdown
   ## Message back to Implementer (Timestamp)
   
   **From:** QA Engineer
   **To:** Architect+Implementer
   **Status:** BIG ISSUES REQUIRE IMPLEMENTER ATTENTION
   
   **Note:** Trivial issues were fixed by QA (see QA Report section)
   
   **Failed Acceptance Criteria (Big Issues Only):**
   1. [AC #1] - [What failed and why this requires Implementer]
   2. [AC #2] - [What failed and why this requires Implementer]
   
   **Major Bugs Found:**
   1. [Bug description with steps to reproduce - why it's not trivial]
   2. [Bug description with steps to reproduce - why it's not trivial]
   
   **Cannot Proceed Until:** [What needs to be fixed by Implementer]
   ```
5. **DO NOT rename file** - Keep as `_IMPL.md` since big issues remain
6. **Inform user:**
   > "Big issues found requiring Implementer attention. I fixed trivial issues myself. Added 'Message back to Implementer' section to `docs/feat_[featurename]_IMPL.md`. Please fix using `gen_impl_back docs/feat_[featurename]_IMPL.md`."

#### 3B: QA Re-Tests After Implementer Fixes (Implementer → QA)

**When:** Implementer claims fixes are complete.

**Process:**
1. **Read the entire feature document** - Review original issues and claimed fixes
2. **Re-test each issue:**
   - Verify each bug is fixed
   - Re-test failed acceptance criteria
   - Look for regression bugs
3. **Triage any new issues:**
   - **Trivial issues:** Fix them yourself
   - **Big issues:** Document for push-back
4. **Update the QA section:**
   - If tests now PASS (after your trivial fixes): Follow normal `gen_qa` flow (rename to `_QA.md`, hand off to Publisher)
   - If big issues remain: Add another "Message back to Implementer" section (stay as `_IMPL.md`)
5. **Handoff:**
   - If PASS: > "All tests pass (trivial issues fixed by QA). Feature document updated to `docs/feat_[featurename]_QA.md`. Ready for deployment using `gen_pub docs/feat_[featurename]_QA.md`."
   - If big issues remain: > "Big issues still present. Fixed trivial issues. Added new feedback to `docs/feat_[featurename]_IMPL.md`. Please fix using `gen_impl_back docs/feat_[featurename]_IMPL.md`."

**⚠️ IMPORTANT - Fresh Agent Context:**
The `gen_qa_back` command may run in a FRESH AGENT with no prior conversation history. All context MUST come from the feature document itself. Always read the full document first.

---

### Push-Back Best Practices

**For All Agents:**
1. ✅ **Be specific** - Vague push-back wastes time
2. ✅ **Be constructive** - Suggest solutions when possible
3. ✅ **Document in the feature file** - All push-back goes in the single document
4. ✅ **Use clear section headers** - "Message back to [Role]"
5. ✅ **Include timestamps** - Track when push-back occurred
6. ✅ **Read the ENTIRE document** - Context from previous stages is critical
7. ✅ **Assume fresh agent** - Your successor may have no conversation history

**For PM:**
- Push back on User if requirements are unclear or contradictory
- Don't guess what the user wants—ASK

**For Implementer:**
- Push back on PM if PRD has gaps
- Push back on QA if their bugs are actually correct behavior per PRD
- Don't implement with unclear requirements—PUSH BACK

**For QA:**
- Fix trivial issues yourself (styling, typos, simple validations)
- Push back on Implementer only for BIG issues (broken functionality, missing features, architectural problems)
- Be thorough—don't pass substandard work
- Verify fixes completely before passing

---

## Handover Documentation

**CRITICAL: All agents work in a SINGLE feature document that gets appended and renamed at each stage.**

**File Location:** `docs/feat_[featurename]_[status].md`

**Single-File Pattern:**
- ✅ **DO:** Append your section to the existing document using the appropriate template
- ✅ **DO:** Rename the file to reflect the new status when you complete your work
- ❌ **DON'T:** Create separate files like `implementation_plan.md`, `design.md`, etc.
- ❌ **DON'T:** Create side documentation outside the main feature document

**Why Single-File?**
- Complete feature history in one place
- Clear progression through development stages
- Easy handoffs between agents
- No confusion about which document is current

**Filename Convention (Feature Lifecycle):**
1. `feat_[featurename]_PRD.md` - After PM completes requirements
2. `feat_[featurename]_IMPL.md` - After Architect+Implementer completes design & code
3. `feat_[featurename]_QA.md` - After QA completes testing
4. `feat_[featurename]_DONE.md` - After Publisher completes deployment

**Structure:**
- Each agent appends their section using the standard template from `.mad-workflows/templates/`
- Each section includes a timestamp and status marker
- The filename updates as the feature progresses through stages
- All sections remain in the document for complete traceability

---

## Workflow Overview

This is a **sequential handoff chain using a SINGLE evolving document** where each agent:
1. Receives the feature document file path from the previous agent
2. Reads the ENTIRE document to understand full context (PRD, previous work, etc.)
3. Performs their specialized role
4. **Reads the appropriate template** from `.mad-workflows/templates/`
5. **Appends** their section to the existing document using the template
6. **Renames** the file to reflect new status (e.g., `_PRD.md` → `_IMPL.md`)
7. Hands off the updated file path to the next agent

**Key Principle:** One feature = One document that grows through the development lifecycle.

---

## Agent 1: Product Manager (PM)

**Trigger:** User invokes `gen_feature` or `gen_pm` command

**Role:** Interview the user to extract clear, complete requirements.

**Process:**
1. Ask the user to describe the feature they want
2. Clarify requirements (Problem, User, Criteria, Constraints)
3. **PUSH BACK if requirements are unclear:**
   - Don't guess what the user wants
   - Ask specific clarifying questions
   - Challenge contradictory requirements
   - Ensure technical constraints are feasible
4. Read template: `.mad-workflows/templates/1-prd.md`
5. Create file `docs/feat_[featurename]_PRD.md` using the template
6. **This is the ONLY file for this feature** - all subsequent agents will append to it

**Handoff:** Provide the file path to the Architect+Implementer:
> "PRD complete at `docs/feat_[featurename]_PRD.md`. Please design and implement this feature using `gen_impl docs/feat_[featurename]_PRD.md`."

**🔄 Handling Push-Back:**
If you receive `gen_pm_back` command, see [Scenario 1: PM Push-Back](#scenario-1-pm-push-back-command-gen_pm_back) above.

---

## Agent 1b: Product Manager - Autonomous Mode (PM Auto)

**Trigger:** User invokes `gen_pm_auto` command

**Role:** Autonomously scope a moderate project (~1 week of dev work) by reviewing project documentation, vision, and planning materials.

**Process:**
1. **Review project mission and vision:**
   - Look for onboarding documents, vision docs, mission statements
   - Understand the overall product direction and goals
   - Example: In HeyLina project, review `HeyLinaMobileDevOnboardingPack.md`

2. **Search for planning documents:**
   - Look for roadmap files, feature backlogs, TODO lists, or planning documents
   - Identify uncompleted tasks or features
   - Search in common locations: `docs/`, root level `.md` files, `planning/`, etc.

3. **Decision point - Clarity check (PUSH BACK if unclear):**
   - **If vision/goals are unclear or no planning docs found:**
     - **STOP** and ask the user for clarification
     - Examples:
       - "I found the vision docs but no clear backlog. What area should I focus on?"
       - "I see multiple possible priorities. Which of these is most important right now?"
     - **This is push-back on the User—it's GOOD**
   - **If vision is clear and tasks are identified:**
     - Proceed to scope out a project

4. **Scope a moderate project:**
   - Select or define a feature that represents ~1 week of development work
   - Consider:
     - Alignment with mission/vision
     - Dependencies and technical feasibility
     - User value and impact
     - Completeness (can go through full MAD cycle: PM -> Impl -> QA -> Pub)

5. **Create PRD using template:**
   - Read template: `.mad-workflows/templates/1-prd.md`
   - Create file `docs/feat_[featurename]_PRD.md` using the template
   - Include clear acceptance criteria and technical constraints
   - **This is the ONLY file for this feature** - all subsequent agents will append to it

**Important Constraints:**
- **Do NOT go into planning mode** - You are a PM, not a developer
- **Do NOT create implementation plans** - That's the Architect+Implementer's job
- **Do NOT start implementing** - Only create the PRD
- **Do NOT create separate planning documents** - Only the single feature document
- Focus on **what** needs to be built, not **how** to build it

**Handoff:** Same as regular PM mode - provide file path to Architect+Implementer:
> "PRD complete at `docs/feat_[featurename]_PRD.md`. Please design and implement this feature using `gen_impl docs/feat_[featurename]_PRD.md`."

**🔄 Handling Push-Back:**
If you receive `gen_pm_back` command, see [Scenario 1: PM Push-Back](#scenario-1-pm-push-back-command-gen_pm_back) above.

---

## Agent 2: Architect + Implementer (Combined Role)

**Trigger:** User invokes `gen_impl docs/feat_[name]_PRD.md`

**Input:** File path to PRD document

**Role:** Design the technical solution AND implement it.

**Process:**

### Phase 1: Architecture & Planning
1. **Verify input:** Confirm you have received the file path and can read the PRD.
2. Read and review the PRD.
3. **PUSH BACK if PRD is unclear:**
   - If requirements are vague, contradictory, or missing critical details
   - Add "Message back to PM" section to the document (see [Scenario 2A](#2a-implementer-pushes-back-to-pm-implementer--pm))
   - **DO NOT guess or assume** - Stop and request clarification
4. Analyze existing codebase structure.
5. Design the solution and break down tasks.
6. **DO NOT create separate planning files** - All work stays in the single feature document.

### Phase 2: Implementation
7. **Proceed with implementation** (click the "Proceed" button).
8. Implement each task.
9. **Note on Commands:** If terminal commands (e.g., `npm install`) fail due to WSL:
   - **Stop immediately**
   - Ask user to run manually and paste output.

### Phase 3: Documentation
10. Read template: `.mad-workflows/templates/2-impl-design.md`
11. Append your technical design and implementation notes to `docs/feat_[featurename]_PRD.md` using the template.
12. Rename file to `docs/feat_[featurename]_IMPL.md`.

**Handoff:** Provide the updated file path:
> "Design and implementation complete. Feature document updated to `docs/feat_[featurename]_IMPL.md`. Please test using `gen_qa docs/feat_[featurename]_IMPL.md`"

**🔄 Handling Push-Back:**
If you receive `gen_impl_back` command, see [Scenario 2: Implementer Push-Back](#scenario-2-implementer-push-back-command-gen_impl_back) above.

---

## Agent 3: QA Engineer (The "Tester")

**Trigger:** User invokes `gen_qa docs/feat_[name]_IMPL.md`

**Input:** File path to IMPL document

**Role:** Verify the feature against the original PRD acceptance criteria.

**Process:**

### Phase 1: Pre-Flight Validation (MANDATORY - Run FIRST)
1. **Run automated checks before any manual testing:**
   ```bash
   ./scripts/pre-qa-check.sh
   ```
   Or: `yarn test:pre-qa`

2. **Check pre-flight results:**
   - **If ANY check fails (TypeScript, linting, tests, or build):**
     - Document the failures in the feature document
     - Add "Message back to Implementer" section with error log
     - **DO NOT proceed to manual testing**
     - **DO NOT rename to _QA.md**
     - Return to Implementer immediately
   - **If all checks pass:**
     - Proceed to Phase 2 (manual testing)

### Phase 2: Manual Testing
3. **Verify input:** Confirm you have received the file path.
4. Read the entire feature document to understand PRD requirements and implementation details.
5. **For web-testable features:**
   - Start web server: `yarn web:start`
   - Follow browser testing guide: `docs/browser-testing-guide.md`
   - Test using Cursor browser tools
   - Capture screenshots for evidence
6. **For mobile-specific features:**
   - Use Maestro for E2E testing if applicable
   - Test on emulator/device
7. Test each acceptance criterion from the PRD thoroughly.
8. **HANDLE ISSUES - Fix Trivial, Push Back Big:**
   - **Trivial issues (FIX YOURSELF):**
     - Minor styling issues (spacing, alignment, colors)
     - Simple typos in UI text
     - Missing basic error messages
     - Small accessibility fixes (alt text, labels)
     - Simple prop/data validation
     - Fix immediately and document in QA report
   - **Big issues (PUSH BACK):**
     - Core functionality broken or missing
     - Acceptance criteria fundamentally not met
     - Data loss or security vulnerabilities
     - Major architectural problems
     - Complex logic errors requiring redesign
     - Performance issues requiring refactoring
     - Add "Message back to Implementer" section with specific failures (see [Scenario 3A](#3a-qa-pushes-back-to-implementer-qa--implementer))
     - **DO NOT rename to _QA.md** if big issues exist

### Phase 3: Documentation
9. Read template: `.mad-workflows/templates/3-qa-report.md`
10. Append your QA report to `docs/feat_[featurename]_IMPL.md` using the template.
11. Include in your report:
    - Pre-flight check results (all passed)
    - Browser testing results (if applicable)
    - Screenshots/evidence
    - Pass/Fail status for each AC
    - **List of trivial issues fixed by QA** (if any)
    - List of big issues requiring Implementer fix (if any)
12. **Rename to _QA.md if:**
    - All tests PASS (including after your trivial fixes)
    - No big issues requiring push-back remain

**Testing Resources:**
- Pre-flight script: `scripts/pre-qa-check.sh`
- Browser testing guide: `docs/browser-testing-guide.md`
- Testing documentation: `docs/TESTING.md`

**Decision:**
- **If PASS:** Hand off to Publisher with file path
- **If FAIL:** Push back to Implementer with "Message back to Implementer" section (file stays as `_IMPL.md`)

**🔄 Handling Push-Back:**
If you receive `gen_qa_back` command, see [Scenario 3: QA Push-Back](#scenario-3-qa-push-back-command-gen_qa_back) above.

---

## Agent 4: Publisher

**Trigger:** User invokes `gen_pub docs/feat_[name]_QA.md`

**Input:** File path to QA document

**Role:** Run build scripts, fix final lint/build errors, prepare for deployment.

**Process:**
1. **Verify input:** Confirm you have received the file path.
2. Run `npm run build` (or equivalent).
   - **Note:** If build fails due to WSL, ask user to run manually.
3. Fix any TypeScript/lint errors.
4. Read template: `.mad-workflows/templates/4-deployment.md`
5. Append your deployment report to `docs/feat_[featurename]_QA.md` using the template.
6. Rename file to `docs/feat_[featurename]_DONE.md`.

**Completion:** Feature is ready for production. The complete feature document (PRD → Implementation → QA → Deployment) is archived in `docs/feat_[featurename]_DONE.md`.
