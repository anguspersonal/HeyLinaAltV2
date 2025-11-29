# Documentation Curation Guide

**Last Updated**: November 22, 2025

---

## Overview

The Documentation Curation workflow helps maintain clean, organized, and newcomer-friendly documentation throughout the project lifecycle. It's designed to combat the natural tendency for documentation to accumulate, contradict itself, and become overwhelming as a project evolves.

---

## The Documentation Problem

As projects grow, documentation often suffers from:

### 1. **Ephemeral Artifact Accumulation**
- PRDs from completed features linger in the repo
- Implementation scratch notes remain after shipping
- One-off investigation reports clutter directories
- Temporary "TODO" files become permanent

### 2. **Pivot Contradictions**
- Old architecture docs contradict new ones
- Setup guides mention deprecated approaches
- Screenshots show old UI with new text descriptions
- API docs reference both old and new systems

### 3. **Redundancy & Duplication**
- Multiple "getting started" guides
- Overlapping setup instructions
- Duplicated API documentation
- Copy-pasted content that diverges over time

### 4. **Organizational Chaos**
- No clear entry point for newcomers
- Related docs scattered across directories
- Broken or missing cross-references
- Unclear hierarchy and navigation

### 5. **Newcomer Confusion**
- Too many places to look
- Unclear which docs are authoritative
- Can't find critical information quickly
- Overwhelmed by historical artifacts

---

## When to Run Documentation Audit

### Regular Cadence
- **Quarterly**: Scheduled maintenance audit
- **Post-major feature**: After completing large features that generated significant docs
- **Post-pivot**: After any architectural or product direction changes
- **Pre-onboarding**: Before bringing new team members on board

### Triggered Events
- Someone reports documentation confusion
- CI/CD starts failing due to broken doc links
- Documentation takes longer to navigate than it should
- Multiple overlapping docs exist for the same topic

---

## Using the `gen_doc_audit` Command

### Basic Usage

```
gen_doc_audit
```

This runs a full repository documentation audit.

### Scoped Audits

For faster, targeted audits:

```bash
# Audit only root-level documentation
gen_doc_audit --scope=root

# Audit only the /docs directory
gen_doc_audit --scope=docs

# Audit only MAD workflow documentation
gen_doc_audit --scope=mad

# Audit specific directory
gen_doc_audit --scope=app/docs
```

### Full Audit with Extra Depth

```
gen_doc_audit --full
```

---

## What the Curator Does

### Phase 1: Discovery (Automatic)

The curator will:
1. Scan all documentation files (`.md`, `.txt`, root docs, `/docs`, etc.)
2. Map the documentation structure and relationships
3. Identify orphaned documents (not linked from anywhere)
4. Categorize docs as:
   - **Permanent**: Core docs like README, architecture, API
   - **Ephemeral**: PRDs, implementation notes, temporary files
   - **Reference**: Vision docs, decision records, onboarding
   - **Generated**: Changelogs, release notes, auto-generated
   - **Unclear**: Needs manual review to categorize

### Phase 2: Analysis (Automatic)

The curator will:
1. **Check for contradictions** between related documents
2. **Identify redundancy** and overlapping content
3. **Assess organization** and newcomer experience
4. **Test navigation paths** from README to detailed docs
5. **Flag broken links** and missing cross-references

### Phase 3: Recommendations (Automatic)

The curator produces a comprehensive audit report with:
- **Delete recommendations**: Ephemeral docs to remove
- **Consolidation proposals**: How to merge overlapping docs
- **Update suggestions**: Docs needing revision
- **Relocation recommendations**: Better organizational structure
- **Creation suggestions**: Missing critical documentation

Each recommendation includes:
- Priority level (High/Medium/Low)
- Rationale
- Impact assessment
- Risk level (for deletions)

### Phase 4: Execution (Manual Approval Required)

After reviewing the audit report, you can:
- Approve all recommendations
- Cherry-pick specific actions
- Modify recommendations
- Request curator to execute approved changes

---

## Example Workflows

### Example 1: Post-Feature Cleanup

**Scenario**: Just shipped a major authentication feature that generated lots of documentation artifacts.

```
You: "We just completed the authentication feature. Clean up the docs."

Curator executes:
1. Scans for auth-related documentation
2. Finds:
   - auth_PRD.md (requirements doc)
   - auth_IMPL.md (implementation notes)
   - auth_QA.md (test report)
   - scratch_notes_oauth.md (temp notes)
3. Proposes:
   - Archive auth_PRD.md (contains valuable user research)
   - Delete auth_IMPL.md (implementation complete)
   - Delete auth_QA.md (tests now in codebase)
   - Delete scratch_notes_oauth.md (temporary)
4. Updates:
   - README.md to mention authentication feature
   - docs/api.md to include auth endpoints
5. Creates:
   - docs/guides/authentication.md (permanent auth guide)
```

### Example 2: Pivot Reconciliation

**Scenario**: Pivoted from REST API to GraphQL. Documentation is inconsistent.

```
You: "We pivoted from REST to GraphQL. Fix the contradictions."

Curator executes:
1. Scans all API documentation
2. Identifies contradictions:
   - README mentions REST
   - docs/api.md shows GraphQL
   - Old tutorials reference REST endpoints
3. Proposes:
   - Update README to mention GraphQL
   - Archive old REST documentation in docs/archive/
   - Consolidate GraphQL docs into single authoritative guide
   - Delete outdated REST tutorials
   - Create migration guide for historical reference
4. Updates all cross-references
5. Verifies no broken links remain
```

### Example 3: Onboarding Overload

**Scenario**: New developer reported being confused by too many "getting started" documents.

```
You: "New dev was confused. Too many places to look for setup."

Curator executes:
1. Finds 4 "getting started" documents:
   - README (setup section)
   - docs/setup.md
   - docs/quickstart.md
   - docs/onboarding.md
2. Discovers partial overlap and contradictory instructions
3. Proposes:
   - Consolidate into single docs/QUICKSTART.md
   - Update README with "👉 Start Here" link to QUICKSTART
   - Archive old setup variations
   - Create clear hierarchy: README → QUICKSTART → Deep Docs
4. Tests newcomer path:
   - README (< 2 min read) → QUICKSTART (< 10 min) → Specific topic
```

### Example 4: Quarterly Maintenance

**Scenario**: Scheduled quarterly documentation health check.

```
You: "gen_doc_audit --full"

Curator executes:
1. Comprehensive scan of entire repository
2. Generates metrics:
   - 47 documentation files total
   - 12 orphaned documents (not linked)
   - 8 broken internal links
   - 3 contradictory pairs
   - 15 ephemeral artifacts older than 60 days
3. Prioritized action plan:
   - High: Fix 3 contradictions (confusing to newcomers)
   - High: Remove 15 old ephemeral artifacts
   - Medium: Link or archive 12 orphaned docs
   - Medium: Fix 8 broken links
   - Low: Add diagrams to 3 key docs
4. Estimated cleanup time: 2-3 hours
5. Expected impact: 30% reduction in doc files, 100% of critical docs accessible
```

---

## Understanding the Audit Report

The curator generates reports using the template: `.mad-workflows/templates/5-doc-audit.md`

### Key Sections

#### 1. Executive Summary
Quick overview of findings and primary recommendations.

#### 2. Current State Map
Visual representation of documentation structure.

#### 3. Findings by Priority
Detailed issues categorized as High/Medium/Low.

#### 4. Recommended Actions
Specific action tables:
- **Delete**: Files to remove with justification
- **Consolidate**: Mergers with target structure
- **Update**: Revisions needed
- **Relocate**: Organizational moves
- **Create**: Missing documentation

#### 5. Proposed Structure
"After cleanup" organizational diagram.

#### 6. Migration Notes
Important changes to communicate to team.

#### 7. Next Steps
Sequenced implementation plan.

---

## Documentation Curation Principles

### 1. Archive, Don't Delete (When Uncertain)

If a document might have historical value:
- Create `/docs/archive/` directory
- Move (don't delete) the document
- Add README.md in archive explaining purpose
- Link from main docs if reference value exists

### 2. One Source of Truth

Never duplicate documentation. Always reference.

**Bad:**
```
README.md: "To install, run npm install"
docs/setup.md: "Installation: npm install"
docs/quickstart.md: "First step: npm install"
```

**Good:**
```
README.md: "See docs/QUICKSTART.md for setup"
docs/QUICKSTART.md: [Canonical setup instructions]
```

### 3. Clear Hierarchy

Documentation should flow from general to specific:

```
README.md (2 min: What is this? Quick links)
  ↓
QUICKSTART.md (10 min: Get running)
  ↓
docs/guides/ (30+ min: Deep dives)
  ↓
docs/reference/ (As needed: API specs, ADRs)
```

### 4. Ruthless with Ephemera

If documentation served a temporary purpose, remove it:
- ✅ Feature PRDs after feature ships
- ✅ Implementation scratch notes
- ✅ One-off investigation reports
- ✅ Temporary TODO files
- ❌ Architecture decision records (keep these!)
- ❌ "Why" explanations (keep these!)

### 5. Test the Newcomer Experience

Simulate landing in the repo with fresh eyes:
- Can I understand what this project is in < 2 minutes?
- Can I find setup instructions in < 30 seconds?
- Is there a clear "Start Here" path?
- Are related topics grouped logically?

---

## Integration with Other Workflows

### After Feature Creation (`gen_pub`)

When the Publisher completes a feature:
1. Check if feature generated ephemeral docs (PRD, IMPL, QA reports)
2. Flag for documentation curator review
3. Curator decides: delete, archive, or convert to permanent docs

### After Major Pivots

After any significant architectural or product changes:
1. Run `gen_doc_audit --full`
2. Prioritize resolving contradictions (High priority)
3. Archive old approach documentation with clear "Historical" markers
4. Update README and primary docs to reflect new reality

### Regular Maintenance

Schedule quarterly audits:
```
Q1: gen_doc_audit --full
Q2: gen_doc_audit --full
Q3: gen_doc_audit --full
Q4: gen_doc_audit --full
```

Prevents documentation debt accumulation.

---

## Success Metrics

A successful documentation curation achieves:

### Quantitative
- ✅ 100% of internal links work
- ✅ 0 contradictory information
- ✅ < 5% orphaned documents
- ✅ README under 200 lines
- ✅ Single authoritative source for each topic

### Qualitative
- ✅ Newcomer understands project in < 2 minutes
- ✅ Setup instructions in exactly one place
- ✅ Clear path from README → detailed docs
- ✅ Documentation structure is self-explanatory
- ✅ No "where do I find X?" confusion

### Team Feedback
- ✅ "Documentation is easy to navigate"
- ✅ "I can find what I need quickly"
- ✅ "New team members onboard faster"
- ✅ "No more conflicting instructions"

---

## Common Questions

### Q: Will the curator delete important documents?

**A**: No. The curator:
- Flags deletions for your approval
- Assesses risk level for each deletion
- Suggests archival for uncertain cases
- Never executes deletions without explicit approval

### Q: What if I disagree with recommendations?

**A**: Totally fine! The curator provides recommendations, not mandates. You can:
- Cherry-pick specific actions
- Modify recommendations
- Reject any suggestions
- Request alternative approaches

### Q: How often should I run audits?

**A**: 
- **Minimum**: Quarterly full audits
- **Recommended**: After major features or pivots
- **Proactive**: When you notice documentation confusion

### Q: What happens to archived documents?

**A**: Archived docs go to `/docs/archive/` with:
- Clear "Historical" markers
- Context about why archived
- Date of archival
- Optional links from main docs if reference value exists

### Q: Can the curator fix contradictions automatically?

**A**: The curator identifies contradictions and proposes resolutions, but human review is required to choose which version is correct.

### Q: What about auto-generated documentation?

**A**: The curator treats auto-generated docs (like API specs from code) as "Generated" category and won't delete them. It will suggest updating generators if output is stale.

---

## Tips for Manual Curation

If doing documentation cleanup manually:

### 1. Start with README
Does it represent the current project? Is it concise?

### 2. Map First, Delete Later
Understand relationships before removing anything.

### 3. Archive, Don't Delete
If uncertain, archive for 1 sprint, then decide.

### 4. One Source of Truth
Never duplicate, always reference.

### 5. Test the Newcomer Experience
Have someone unfamiliar read the docs.

### 6. Be Ruthless with Ephemera
If it served a temporary purpose, it can go.

### 7. Preserve Decisions
Keep Architecture Decision Records (ADRs) and "why" documents.

### 8. Update Incrementally
Don't break everything at once. Small, tested changes.

---

## Output Location

Documentation audit reports are saved to:

```
docs/audits/doc-audit-[YYYY-MM-DD].md
```

Example: `docs/audits/doc-audit-2025-11-22.md`

Audit reports themselves should be reviewed and archived after implementation.

---

## Further Reading

- **Workflow SOP**: `.mad-workflows/workflows/documentation-curation.md`
- **Audit Report Template**: `.mad-workflows/templates/5-doc-audit.md`
- **MAD System Overview**: `.mad-workflows/README.md`
- **Agent Manifest**: `.mad-workflows/AGENT_MANIFEST.md`

---

## Support

If you encounter issues with the documentation curation workflow:
1. Check the workflow SOP: `.mad-workflows/workflows/documentation-curation.md`
2. Review example audit reports in `docs/audits/`
3. Open an issue describing the problem
4. Tag with `documentation` label

