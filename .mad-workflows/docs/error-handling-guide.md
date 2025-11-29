# MAD Workflows Error Handling Guide

**Quick reference for handling command errors, re-runs, and out-of-order execution.**

---

## Quick Diagnosis: "Something Went Wrong"

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Agent says "file not found" | Wrong filename or path | Check `docs/` folder, verify exact filename |
| Agent asks "this is already done" | Command run when stage complete | Clarify: re-run or move to next stage? |
| Agent says "wrong stage" | Command needs different file version | Use the file stage the command expects |
| Agent lists similar files | File name typo | Pick correct file from list |
| Agent asks to confirm re-run | Intentional re-run of completed stage | Confirm you want to replace existing work |

---

## Feature Creation Commands (gen_pm, gen_impl, gen_qa, gen_pub)

### Error: "This stage is already complete"

**Example:**
```
User: gen_qa docs/feat_auth_IMPL.md
Agent: I notice this feature has already been tested. 
       The file docs/feat_auth_QA.md exists.
```

**What this means:**
- The QA stage has already been completed
- The file was renamed to `_QA.md` after testing

**Your options:**
1. **Continue to next stage:** `gen_pub docs/feat_auth_QA.md`
2. **Re-run QA (replaces existing):** Confirm you want to re-test
3. **Cancel:** If you ran the command by mistake

---

### Error: "Wrong file stage provided"

**Example:**
```
User: gen_qa docs/feat_auth_PRD.md
Agent: This file is at PRD stage. QA requires an IMPL file.
       I found docs/feat_auth_IMPL.md - did you mean this?
```

**What this means:**
- You provided a file at the wrong stage of the workflow
- Implementation needs to happen before QA

**Your options:**
1. **Use the correct file:** `gen_qa docs/feat_auth_IMPL.md`
2. **Run missing stage first:** `gen_impl docs/feat_auth_PRD.md`

---

### Error: "File not found"

**Example:**
```
User: gen_impl docs/feat_user_auth_PRD.md
Agent: I couldn't find that file. Did you mean:
       - docs/feat_auth_PRD.md
       - docs/feat_user_profile_PRD.md
```

**What this means:**
- File name doesn't match exactly
- Common causes: typo, wrong feature name, file doesn't exist

**Your options:**
1. **Pick from suggestions:** Use exact filename from the list
2. **Check what exists:** Look in `docs/` folder for available files
3. **Create the file first:** Run `gen_pm` to create a new feature PRD

---

### When to Re-run a Stage (Intentionally)

**Valid reasons to re-run:**
- ✅ QA found major issues, implementation was redone
- ✅ Requirements changed significantly during development
- ✅ First attempt was incomplete or incorrect
- ✅ Testing approach needs to be different

**How to re-run:**
1. Agent will ask for confirmation
2. Confirm: "Yes, re-run [stage name]"
3. Agent will replace that section in the document
4. File stays at the same stage (e.g., `_IMPL.md` remains `_IMPL.md`)

**What gets replaced:**
- The specific stage section (e.g., "## Implementation" section)
- Timestamp updates to current
- Previous work is overwritten (not preserved)

---

### Feature Already Deployed (_DONE.md exists)

**Example:**
```
User: gen_qa docs/feat_auth_IMPL.md
Agent: This feature is complete and deployed. 
       File: docs/feat_auth_DONE.md
```

**What this means:**
- Feature went through full cycle: PRD → IMPL → QA → Deployment
- It's production-ready

**Your options:**
1. **For bug fixes:** Use `mrsop`, `arsop`, or `afsop` (code review workflows)
2. **For new changes:** Create new feature: `gen_pm` → `feat_auth_v2_PRD.md`
3. **To re-open feature:** Manually rename file back to earlier stage (advanced)

---

## Quality Assurance Commands (mrsop, arsop, afsop)

### Re-running Manual Review (mrsop)

**This is normal and expected!**

Code review is iterative:
1. Developer makes changes → Requests review (`mrsop`)
2. Reviewer finds issues → Logs to backlog
3. Developer fixes → Requests review again (`mrsop`)
4. Process repeats until production-ready

**Agent behavior:**
- Proceeds with review
- Checks if previous items were addressed
- Adds new findings (doesn't duplicate)
- Provides feedback on progress

---

### Re-running Auto Review (arsop)

**This is expected for comprehensive coverage.**

**Agent behavior:**
1. Checks existing backlog for reviewed files
2. Selects 5 NEW files not recently reviewed
3. Avoids duplicate entries for same issue
4. Notes: "Second pass review - focused on [area]"

**Why run multiple times:**
- First pass: Critical files (e.g., authentication, payment)
- Second pass: Core features
- Third pass: Utilities and helpers

---

### Re-running Auto Fix (afsop)

**This is the primary workflow pattern!**

Expected flow:
- Run 1: "Fixed 5 high priority items"
- Run 2: "Fixed 3 more high priority items"
- Run 3: "All high priority complete. Ready for medium?"
- Run 4: "Fixed 4 medium priority items"
- Etc.

**When no work remains:**
```
Agent: Backlog is clean! No open issues to fix.
       Options:
       - Run arsop for a fresh automated review
       - Run mrsop for manual review of recent changes
       - Continue with feature development
```

---

## Documentation Curation Commands (curate_docs, gen_doc_audit)

### Re-running Documentation Audit

**This is normal - periodic audits are recommended.**

**Agent behavior when recent audit exists (< 7 days):**
```
Agent: I found a recent audit from [date]. Do you want to:
       a) Review that audit's recommendations
       b) Run a fresh audit (useful if you've made changes)
       c) Execute approved items from the previous audit
```

**When to run fresh audit:**
- After executing previous recommendations
- After major code changes or pivots
- Periodic maintenance (monthly/quarterly)
- Before onboarding new team members

**Agent behavior on fresh audit after previous cleanup:**
- References what was completed from last audit
- Celebrates improvements: "Doc count reduced by 35%!"
- Focuses on NEW ephemeral content since last run
- Provides verification that structure is healthy

---

## Command Validation Rules

### Feature Creation Chain

| Command | Requires | Creates/Updates | Next Step |
|---------|----------|-----------------|-----------|
| `gen_pm` | Nothing | `_PRD.md` | `gen_impl [file]` |
| `gen_pm_auto` | Vision docs | `_PRD.md` | `gen_impl [file]` |
| `gen_impl` | `_PRD.md` | `_IMPL.md` | `gen_qa [file]` |
| `gen_qa` | `_IMPL.md` | `_QA.md` | `gen_pub [file]` (if PASS) |
| `gen_pub` | `_QA.md` | `_DONE.md` | Feature complete! |

### Quality Assurance (Iterative - No Prerequisites)

| Command | Purpose | Can Run Repeatedly |
|---------|---------|-------------------|
| `mrsop` | Manual code review | ✅ Yes - iterative by design |
| `arsop` | Automated code scan | ✅ Yes - cover different files |
| `afsop` | Fix backlog items | ✅ Yes - work through backlog |

### Documentation (Periodic - No Prerequisites)

| Command | Purpose | Can Run Repeatedly |
|---------|---------|-------------------|
| `curate_docs` | Audit & cleanup docs | ✅ Yes - periodic maintenance |
| `gen_doc_audit` | Same as above | ✅ Yes - periodic maintenance |

---

## Best Practices

### For Users

**Before running a command:**
1. Check what stage your feature is at: `ls docs/feat_*`
2. Use the exact filename the previous agent provided
3. Copy-paste file paths to avoid typos

**When agent asks for clarification:**
1. Don't ignore the question - agent is trying to help
2. If unsure, ask agent to show available files
3. Agent validations prevent wasted work

**Command cheat sheet:**
```bash
# Create new feature
gen_pm                                    # Interview mode
gen_pm_auto                               # Auto-scope from docs

# Continue feature development (use exact filenames!)
gen_impl docs/feat_[name]_PRD.md
gen_qa docs/feat_[name]_IMPL.md
gen_pub docs/feat_[name]_QA.md

# Quality assurance (run anytime, repeatedly)
mrsop                                     # Manual review
arsop                                     # Auto review (5 files)
afsop                                     # Auto fix from backlog

# Documentation maintenance (run periodically)
curate_docs                               # Full audit
```

### For Agents

**Always validate before proceeding:**
1. Check if provided file exists
2. Check if file is at expected stage
3. Search for similar files if not found
4. Ask user before assuming anything

**When validation fails:**
1. Explain what's wrong clearly
2. Show what you found (similar files, current stage)
3. Provide 2-3 clear options
4. Wait for user decision - don't guess

**Be helpful, not pedantic:**
- ✅ "I found `_QA.md` - this is already tested. Continue to deployment?"
- ❌ "ERROR: INVALID STAGE"

---

## Troubleshooting

### "I keep getting file not found"

**Solution:**
```bash
# List all feature documents
ls docs/feat_*

# Copy exact filename, don't type it manually
gen_qa docs/feat_exact_name_from_list_IMPL.md
```

### "Agent keeps asking if I want to re-run"

**Solution:**
- If yes: Say "yes, re-run QA" (or whatever stage)
- If no: Say "no, continue to next stage" or provide correct file

### "I want to restart a feature from scratch"

**Solution:**
```bash
# Option 1: Delete the existing file
rm docs/feat_[name]_*.md

# Option 2: Use a different name
gen_pm  # Call it feat_[name]_v2
```

### "I ran commands out of order, how do I fix?"

**Solution:**
- Agent will guide you to the correct file
- Run the missing stages in order: PRD → IMPL → QA → PUB
- Don't skip stages (each builds on previous)

---

## When to Ignore Agent Warnings

### "I know what I'm doing" Scenarios

**You want to re-run a stage intentionally:**
- Agent: "This is already complete"
- You: "Yes, re-run it anyway"
- Valid reason: Major changes, first attempt was wrong

**You're experimenting with workflow:**
- Agent: "This file is already at QA stage"
- You: "Re-run IMPL to try different approach"
- Valid reason: Learning, testing, iterating on design

**You're recovering from a mistake:**
- Agent: "Expected _IMPL.md but got _QA.md"
- You: "That file is wrong, manually rename it back"
- Valid reason: Previous agent made an error, fixing workflow state

### Never Ignore

**Agent says file doesn't exist:**
- This is a real error - fix the filename

**Agent says required stage not complete:**
- Don't skip stages - each depends on previous

**Agent warns about overwriting work:**
- Confirm you understand what will be replaced

---

## Summary

**Key Principles:**
1. **Agents validate to save you time** - they're not being annoying
2. **File naming is precise** - use exact filenames from agents
3. **Re-running is often valid** - especially for QA workflows
4. **When in doubt, ask** - agents will explain options

**Most common mistakes:**
- ❌ Typing filenames manually (typos)
- ❌ Using old file names (wrong stage)
- ❌ Ignoring agent questions (then getting confused)

**Most common fixes:**
- ✅ Copy-paste exact filenames
- ✅ Use `ls docs/feat_*` to see what exists
- ✅ Answer agent's clarifying questions

---

**For detailed workflow SOPs, see:**
- Feature Creation: `.mad-workflows/workflows/feature-creation.md`
- Quality Assurance: `.mad-workflows/workflows/quality-assurance.md`
- Documentation: `.mad-workflows/workflows/documentation-curation.md`

