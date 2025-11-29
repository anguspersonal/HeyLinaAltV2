# MAD Workflows Changelog

## 2025-11-22 (Part 3): Enhanced Error Handling & Command Validation

### Improvements: Robust handling of repeated commands and out-of-order execution

Added comprehensive error handling documentation to guide agents and users when commands are run at the wrong stage, when stages are already complete, or when commands are intentionally re-run.

### Changes Made

#### 1. New Documentation
- **`.mad-workflows/docs/error-handling-guide.md`** (NEW)
  - Comprehensive quick reference for all error scenarios
  - Diagnosis table for common issues
  - Detailed explanations for each command type
  - Command validation rules table
  - Best practices for users and agents
  - Troubleshooting section
  - Examples of when to ignore warnings vs. when to heed them

#### 2. Enhanced Workflow Documentation
- **`.mad-workflows/workflows/feature-creation.md`**
  - Added "Handling Command Errors & Re-runs" section
  - 5 scenarios covered:
    1. Command already complete (e.g., `gen_qa` when file is `_QA.md`)
    2. Wrong file stage provided (e.g., `gen_qa` with `_PRD.md` file)
    3. File doesn't exist or wrong name
    4. User wants to re-run a stage (intentional)
    5. Feature already deployed (`_DONE.md` exists)
  - Quick reference validation table for all commands
  - Clear agent guidance: "Ask, don't assume"

- **`.mad-workflows/workflows/quality-assurance.md`**
  - Added "Error Handling: Repeated Commands" section
  - Clarified that QA commands are DESIGNED to run repeatedly
  - Specific guidance for `mrsop`, `arsop`, and `afsop` re-runs
  - Explained expected iterative behavior
  - What to do when backlog is empty

- **`.mad-workflows/workflows/documentation-curation.md`**
  - Added "Handling Repeated Audit Runs" section
  - Guidance for checking recent audit reports
  - What to do when recent audit exists (< 7 days)
  - Celebration/verification mode for post-cleanup audits

#### 3. Updated Core Documentation
- **`.mad-workflows/README.md`**
  - Added common commands with file parameters to command list
  - Added warning note about out-of-order commands
  - Added link to error handling guide in Additional Documentation section

- **`.mad-workflows/AGENT_MANIFEST.md`**
  - Added "Error Handling" subsection to Feature Creation workflow
  - Added link to error handling section in feature-creation.md
  - Listed error handling guide in Reference Material section

### Key Features

**For Feature Creation Commands (`gen_impl`, `gen_qa`, `gen_pub`):**
- ✅ Validates file exists before proceeding
- ✅ Checks file is at expected stage
- ✅ Suggests similar files if typo detected
- ✅ Asks for clarification when stage already complete
- ✅ Provides 2-3 clear options instead of assuming
- ✅ Warns before overwriting existing work

**For Quality Assurance Commands (`mrsop`, `arsop`, `afsop`):**
- ✅ Clarifies these are MEANT to run repeatedly
- ✅ Checks for duplicate backlog entries
- ✅ Celebrates when backlog is clean
- ✅ Suggests next steps when work is complete

**For Documentation Commands (`curate_docs`):**
- ✅ Checks for recent audit reports
- ✅ Offers to review, re-run, or execute
- ✅ Focuses on NEW content in subsequent runs
- ✅ Verifies cleanup effectiveness

### Agent Behavior Improvements

**Before (No validation):**
```
User: gen_qa docs/feat_auth_PRD.md
Agent: [Starts testing, fails, confusion]
```

**After (With validation):**
```
User: gen_qa docs/feat_auth_PRD.md
Agent: The file you provided is at the PRD stage, but QA requires 
       a completed implementation. I found docs/feat_auth_IMPL.md.
       Did you mean: gen_qa docs/feat_auth_IMPL.md?
```

### Benefits

1. **Reduced User Frustration**: Clear error messages with actionable options
2. **Fewer Wasted Runs**: Agents validate before expensive operations
3. **Better Learning**: Users understand workflow stages better
4. **Intentional Re-runs**: Users can explicitly re-run stages when needed
5. **Safer Operations**: Warnings before overwriting existing work

### Usage Examples

**Check feature status before running command:**
```bash
ls docs/feat_*
# See: feat_auth_IMPL.md

gen_qa docs/feat_auth_IMPL.md  # ✅ Correct stage
```

**Agent helps with typos:**
```bash
gen_qa docs/feat_user_auth_IMPL.md
# Agent: "Did you mean docs/feat_auth_IMPL.md?"
```

**Intentional re-run:**
```bash
gen_qa docs/feat_auth_IMPL.md
# Agent: "QA already complete. Re-run testing?"
# User: "Yes, implementation was changed"
# Agent: [Proceeds with testing]
```

### Documentation Reference

All error handling documentation is now cross-referenced:
- Main guide: `.mad-workflows/docs/error-handling-guide.md`
- Feature creation: `.mad-workflows/workflows/feature-creation.md` (section: Handling Command Errors)
- Quality assurance: `.mad-workflows/workflows/quality-assurance.md` (section: Error Handling)
- Documentation curation: `.mad-workflows/workflows/documentation-curation.md` (section: Handling Repeated Audit Runs)

---

## 2025-11-22 (Part 2): Added Documentation Curation Workflow

### New Feature: `curate_docs`

Added Documentation Curator agent to maintain documentation health and ensure repository accessibility for newcomers.

### Changes Made

#### 1. Core Workflow Files
- **`.mad-workflows/workflows/documentation-curation.md`** (NEW)
  - Complete Documentation Curator workflow
  - 6-phase process: Discovery → Classification → Hierarchy Design → Analysis → Execution → Maintenance
  - Identifies ephemeral docs (session summaries, temp notes)
  - Detects contradictions from project pivots
  - Suggests deletions, consolidations, hierarchy improvements
  - Links all documentation back to vision docs and README
  - Includes maintenance guidelines and success metrics

#### 2. Template Files
- **`.mad-workflows/templates/5-docs-audit.md`** (NEW)
  - Comprehensive documentation audit report template
  - Sections: Executive Summary, Deletions, Consolidations, Contradictions, Hierarchy Issues, Quick Wins
  - Execution plan with time estimates
  - Verification checklist
  - Risk assessment and rollback plan
  - Success metrics tracking

#### 3. Manifest & Reference Files
- **`.mad-workflows/AGENT_MANIFEST.md`**
  - Added `curate_docs` to Capability Map
  - Added new section "C. Documentation Curation (The 'Clarity' Motion)"
  - Linked to documentation-curation.md workflow

- **`.mad-workflows/README.md`**
  - Added `curate_docs` to common commands
  - Updated directory structure to show new workflow and template files

#### 4. Project Integration Files
- **`AGENTS.md`**
  - Added `curate_docs` command to Quick Command Reference table
  - Added Documentation Curation Flow to MAD Documentation section
  - Added "Documentation cleanup" to "When to Use MAD Workflows" section

- **`.cursor/rules`**
  - Added `curate_docs` command to MAD command table
  - Defined Documentation Curator role and mission

### Key Features of `curate_docs`

1. **Comprehensive Discovery**: Scans all documentation across repository
2. **Smart Classification**: Categorizes docs as KEEP/CONSOLIDATE/DELETE/UPDATE
3. **Contradiction Detection**: Identifies outdated content from pivots
4. **Hierarchy Design**: Ensures clear navigation (README → Vision → Details)
5. **Newcomer Focus**: Optimizes for "understand at a glance" experience
6. **Maintenance Guidelines**: Provides ongoing documentation hygiene rules
7. **Safe Execution**: Recommends only, requires user approval for destructive changes

### Usage

```bash
# Run full documentation audit
curate_docs

# AI generates comprehensive audit report
# Output: docs/audits/docs-audit-[date].md

# Review recommendations, approve changes
# AI executes approved deletions/consolidations

# Result: Clean, organized documentation hierarchy
```

### Success Metrics

- 20-40% reduction in doc count (eliminate ephemera)
- 100% internal links resolve
- 0 contradictions from past pivots
- Every doc ≤3 clicks from README
- Onboarding time < 5 minutes to find key docs

### Integration Points

- **After `gen_pub`**: Cleanup feature implementation docs
- **After `gen_pm_auto`**: Consolidate generated PRDs
- **Periodic maintenance**: Monthly or quarterly runs
- **Before onboarding**: Ensure repo is newcomer-ready

---

## 2025-11-22 (Part 2): Added Documentation Curation Workflow

### New Workflow: Documentation Curation (`gen_doc_audit`)

Added a dedicated workflow for maintaining clean, organized, and newcomer-friendly documentation throughout the project lifecycle.

### Changes Made

#### 1. Core Workflow Files
- **`.mad-workflows/workflows/documentation-curation.md`** (NEW)
  - Complete workflow for documentation auditing and cleanup
  - Four-phase process: Discovery → Analysis → Recommendations → Execution
  - Priority classification system (High/Medium/Low)
  - Examples of common documentation problems and solutions
  - Integration points with other workflows

#### 2. Template Files
- **`.mad-workflows/templates/5-doc-audit.md`** (NEW)
  - Comprehensive audit report template
  - Sections: Executive Summary, Current State Map, Findings, Recommended Actions
  - Action tables: Delete, Consolidate, Update, Relocate, Create
  - Metrics and success criteria tracking

#### 3. Manifest & Reference Files
- **`.mad-workflows/AGENT_MANIFEST.md`**
  - Added `gen_doc_audit` to Capability Map
  - Added new section "C. Documentation Curation (The 'Clarity' Motion)"
  - Updated templates list to include `5-doc-audit.md`

- **`.mad-workflows/README.md`**
  - Added `documentation-curation.md` to workflows directory structure
  - Added `5-doc-audit.md` to templates list
  - Added `gen_doc_audit` to common commands

#### 4. Documentation
- **`.mad-workflows/docs/documentation-curation-guide.md`** (NEW)
  - Complete guide to using the documentation curation workflow
  - Common documentation problems explained
  - When to run audits (regular cadence and triggered events)
  - Four detailed example workflows
  - Understanding audit reports
  - Documentation curation principles
  - Success metrics and common questions

#### 5. Project Integration Files
- **`AGENTS.md`**
  - Updated command reference table with `gen_doc_audit`
  - Added documentation curation flow reference
  - Added when to use documentation cleanup guidance

- **`.cursor/rules`**
  - Updated MAD command table with `gen_doc_audit`
  - Role: Documentation Curator
  - Mission: Audit docs, eliminate ephemeral artifacts, consolidate redundancy, resolve contradictions

### Key Features of `gen_doc_audit`

1. **Comprehensive Scanning**: Maps entire documentation structure
2. **Smart Categorization**: Identifies Permanent, Ephemeral, Reference, Generated, and Unclear docs
3. **Contradiction Detection**: Finds conflicting information from pivots
4. **Redundancy Analysis**: Identifies overlapping and duplicate content
5. **Organization Assessment**: Tests newcomer experience and navigation paths
6. **Prioritized Recommendations**: Action plan with High/Medium/Low priorities
7. **Risk Assessment**: Evaluates risk level for each deletion
8. **Archival Strategy**: Archive instead of delete when uncertain

### Usage

```bash
# Full repository audit
gen_doc_audit

# Scoped audits
gen_doc_audit --scope=root      # Root-level docs only
gen_doc_audit --scope=docs      # /docs directory only
gen_doc_audit --scope=mad       # MAD workflows only
gen_doc_audit --full            # Extra depth audit
```

### Integration Points

The documentation curation workflow integrates with:
- ✅ **Feature Creation**: Publisher flags ephemeral docs for curator review
- ✅ **Major Pivots**: Auto-triggers to resolve contradictions
- ✅ **Regular Maintenance**: Quarterly scheduled audits

### Problem Solved

This workflow addresses the natural documentation debt that accumulates from:
- Ephemeral artifacts from feature development (PRDs, implementation notes)
- Contradictions after pivots (old vs. new approaches)
- Redundancy and duplication (multiple "getting started" guides)
- Organizational chaos (unclear hierarchy, broken links)
- Newcomer confusion (too many places to look)

### Output

Audit reports saved to: `docs/audits/doc-audit-[YYYY-MM-DD].md`

---

## 2025-11-22 (Part 1): Added Autonomous PM Mode

### New Feature: `gen_pm_auto`

Added autonomous Product Manager mode that can scope projects independently by reviewing documentation.

### Changes Made

#### 1. Core Workflow Files
- **`.mad-workflows/workflows/feature-creation.md`**
  - Added `gen_pm_auto` to command list
  - Added new section "Agent 1b: Product Manager - Autonomous Mode"
  - Detailed process: Review docs → Clarity check → Scope project → Create PRD
  - Clear constraints: PM stays in role, no implementation planning

#### 2. Manifest & Reference Files
- **`.mad-workflows/AGENT_MANIFEST.md`**
  - Added `gen_pm_auto` to Capability Map
  - Updated Feature Creation description to mention two PM modes

- **`.mad-workflows/commands/MADworkflow.md`**
  - Added `gen_pm_auto` to Command Reference table

- **`.mad-workflows/README.md`**
  - Added `gen_pm_auto` to common commands

#### 3. Documentation
- **`.mad-workflows/docs/autonomous-pm-guide.md`** (NEW)
  - Complete guide to using autonomous PM mode
  - Use cases, workflow, constraints, examples
  - Troubleshooting section
  - Comparison table: `gen_pm` vs `gen_pm_auto`

#### 4. Project Integration Files
- **`AGENTS.md`**
  - Added full "MAD Workflows System" section at the top
  - Command reference table
  - Links to all MAD documentation
  - Product vision reference (HeyLinaMobileDevOnboardingPack.md)
  - Guidance on when to use MAD workflows

- **`.cursor/rules`** (NEW)
  - Created Cursor agent rules file
  - Strong references to MAD workflows
  - Command behavior rules
  - Special `gen_pm_auto` instructions
  - Project-specific context

### Key Features of `gen_pm_auto`

1. **Autonomous Scoping**: PM reviews docs without user interview
2. **Clarity Checks**: Stops and asks user if vision/goals unclear
3. **Moderate Projects**: Scopes ~1 week of dev work
4. **Stays in Role**: PM does NOT create implementation plans
5. **Document-Driven**: Uses project vision docs (e.g., HeyLinaMobileDevOnboardingPack.md)

### Usage

```bash
# Autonomous mode - PM reviews docs and proposes feature
gen_pm_auto

# Traditional interview mode - PM asks user questions
gen_pm
```

### Integration Points

The system is now fully integrated across:
- ✅ MAD workflow system (`.mad-workflows/`)
- ✅ Project guidelines (`AGENTS.md`)
- ✅ Cursor agent rules (`.cursor/rules`)
- ✅ Product vision reference (`HeyLinaMobileDevOnboardingPack.md`)

All agents and documentation now strongly reference the MAD workflows system.

