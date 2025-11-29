# MAD Workflow Templates

These templates define the standardized output format for each agent in the feature creation workflow.

## Single-File Pattern

**Critical:** All agents work on ONE evolving document per feature.

### Template Usage

| Template | When to Use | Action |
|----------|-------------|--------|
| `1-prd.md` | PM creates initial PRD | **CREATE** new file: `docs/feat_[name]_PRD.md` |
| `2-impl-design.md` | Implementer completes work | **APPEND** to existing file, then **RENAME** to `_IMPL.md` |
| `3-qa-report.md` | QA tests the feature | **APPEND** to existing file, then **RENAME** to `_QA.md` |
| `4-deployment.md` | Publisher deploys | **APPEND** to existing file, then **RENAME** to `_DONE.md` |

### Example Lifecycle

1. **PM** creates `docs/feat_user_profile_PRD.md` using template 1
2. **Implementer** reads the PRD, does work, appends template 2, renames to `feat_user_profile_IMPL.md`
3. **QA** reads PRD + Implementation, tests, appends template 3, renames to `feat_user_profile_QA.md`
4. **Publisher** reads everything, deploys, appends template 4, renames to `feat_user_profile_DONE.md`

**Result:** One complete document with full feature history from requirements to deployment.

## Why Single-File?

- ✅ Complete traceability in one place
- ✅ Clear progression through stages (filename changes)
- ✅ No confusion about which document is current
- ✅ Easy handoffs (just pass the file path)
- ✅ All context available for each agent

## What NOT to Do

❌ Don't create separate files like `implementation_plan.md`, `design_doc.md`, etc.  
❌ Don't create side documentation outside the main feature file  
❌ Don't lose the existing content when appending your section  
❌ Don't forget to rename the file to reflect the new stage

## Template Structure

Each template (except #1) starts with `---` to indicate it should be appended.

Each template includes:
- Agent role identifier (e.g., "QA Engineer")
- Timestamp field
- Standardized sections for that stage
- "Next Steps" handoff instructions

