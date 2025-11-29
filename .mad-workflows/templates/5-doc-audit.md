# Documentation Audit Report

**Date**: [ISO 8601 timestamp]  
**Audited By**: [Agent/Human name]  
**Scope**: [Full repository | Root docs | /docs | .mad-workflows | Other]  
**Audit Duration**: [Time spent]

---

## Executive Summary

[2-3 sentence summary of overall documentation health]

[1-2 sentences on most critical findings]

[1 sentence on primary recommendation]

---

## Current State Map

### Repository Structure
```
[Text representation of current documentation structure]
Example:
/
├── README.md
├── CONTRIBUTING.md
├── docs/
│   ├── api/
│   ├── guides/
│   └── old-notes.md (ephemeral)
├── .mad-workflows/
│   └── output/ (contains 15 PRDs)
└── [other files]
```

### Documentation Inventory
- **Total Documentation Files**: [count]
- **Root-level docs**: [count]
- **Docs directory**: [count]
- **Workflow outputs**: [count]
- **Orphaned docs** (no incoming links): [count]
- **Potential ephemeral artifacts**: [count]

---

## Findings

### High Priority Issues

#### 1. [Issue Name]
- **Type**: [Contradiction | Missing Critical Doc | Broken Organization | Other]
- **Impact**: [How this blocks or confuses newcomers]
- **Current State**: [What exists now]
- **Recommendation**: [What should be done]
- **Affected Files**: 
  - `[file path]`
  - `[file path]`

#### 2. [Issue Name]
[Same structure as above]

---

### Medium Priority Issues

#### 1. [Issue Name]
- **Type**: [Redundancy | Outdated Content | Poor Organization | Other]
- **Impact**: [How this creates friction]
- **Current State**: [What exists now]
- **Recommendation**: [What should be done]
- **Affected Files**: 
  - `[file path]`

[Continue as needed]

---

### Low Priority Issues

#### 1. [Issue Name]
- **Type**: [Formatting | Minor Verbosity | Enhancement Opportunity | Other]
- **Impact**: [Minor quality improvement]
- **Recommendation**: [What could be done]
- **Affected Files**: 
  - `[file path]`

[Continue as needed]

---

## Detailed Analysis

### Contradictions Found
[List any places where documentation conflicts with itself or reality]

| Topic | File A | File B | Contradiction | Resolution |
|-------|--------|--------|---------------|------------|
| [e.g., API endpoint] | `docs/api.md` | `README.md` | File A says REST, File B says GraphQL | Update to GraphQL |

---

### Redundancy Analysis
[Documents that cover the same ground]

| Content Theme | Files Covering It | Overlap % | Consolidation Proposal |
|---------------|-------------------|-----------|------------------------|
| [e.g., Getting Started] | `README.md`, `docs/setup.md`, `docs/quickstart.md` | 70% | Merge into single `QUICKSTART.md` |

---

### Ephemeral Artifacts
[Temporary documents from development that should be cleaned up]

| File | Purpose | Keep? | Disposition |
|------|---------|-------|-------------|
| `.mad-workflows/output/2024-11-15-auth-prd.md` | Feature PRD | No | Delete (feature complete) |
| `docs/spike-results-2024-10.md` | Investigation notes | No | Delete (decision made) |
| `NOTES.md` | Scratch notes | No | Delete (temporary) |

---

### Organization Assessment

#### README Quality
- [ ] Clearly states what the project is
- [ ] Provides quick start instructions
- [ ] Links to deeper documentation
- [ ] Is concise (< 200 lines)
- [ ] Accurately reflects current project state

**Issues Found**: [List any README problems]

**Recommendations**: [How to improve README]

---

#### Internal Reference Quality
- [ ] Comprehensive vision document exists
- [ ] Internal reference is up-to-date
- [ ] Clear hierarchy from general → specific
- [ ] Decision records are preserved

**Issues Found**: [List any internal reference problems]

**Recommendations**: [How to improve internal docs]

---

#### Hierarchy & Discoverability
- [ ] Logical grouping of related docs
- [ ] Clear navigation path from README
- [ ] No orphaned documents
- [ ] Consistent file naming

**Issues Found**: [List any organization problems]

**Recommendations**: [How to improve organization]

---

## Recommended Actions

### Priority 1: Must Do (High Impact, High Urgency)

#### Delete Files
**Total: [X] files, [Y] KB to be freed**

| File | Reason | Risk Level | Backup/Archive? |
|------|--------|------------|-----------------|
| `[path]` | [Ephemeral artifact from completed feature] | Low | No |
| `[path]` | [Duplicate content] | Medium | Archive first |
| `[path]` | [Contradictory outdated info] | High | Archive (may have historical value) |

---

#### Consolidate Files
**Total: [X] files → [Y] files**

| Files to Merge | Target File | Reason | Merge Strategy |
|----------------|-------------|--------|----------------|
| `docs/setup.md`, `docs/install.md`, `README.md` (setup section) | `docs/QUICKSTART.md` | Redundant setup instructions | Combine all, add cross-references |

---

#### Update Files
**Total: [X] files to update**

| File | Changes Needed | Priority | Estimated Effort |
|------|----------------|----------|------------------|
| `README.md` | Remove outdated API reference, add GraphQL link | High | 15 min |
| `docs/architecture.md` | Fix broken links, update diagram | High | 30 min |

---

### Priority 2: Should Do (Medium Impact)

#### Relocate Files
**Total: [X] files to move**

| File | Current Path | Proposed Path | Reason |
|------|--------------|---------------|--------|
| `setup-guide.md` | `/` | `/docs/setup-guide.md` | Keep root clean |
| `api-spec.md` | `/docs/` | `/docs/api/spec.md` | Better grouping |

---

#### Create Files
**Total: [X] new files**

| File | Purpose | Priority | Template/Reference |
|------|---------|----------|-------------------|
| `docs/ARCHITECTURE.md` | Missing high-level architecture doc | High | Standard arch doc |
| `docs/CONTRIBUTING.md` | Missing contributor guide | Medium | GitHub template |

---

### Priority 3: Nice to Have (Low Impact)

#### Minor Improvements

| File | Improvement | Effort |
|------|-------------|--------|
| `README.md` | Add badges for build status | 5 min |
| `docs/api.md` | Add more examples | 20 min |

---

## Proposed Structure (After Cleanup)

### Target Organization
```
/
├── README.md (updated, concise entry point)
├── QUICKSTART.md (new, consolidates setup)
├── CONTRIBUTING.md (created)
├── LICENSE.md
├── docs/
│   ├── README.md (docs index)
│   ├── vision/ (internal reference)
│   │   └── product-vision.md
│   ├── architecture/
│   │   ├── overview.md
│   │   └── decisions/ (ADRs)
│   ├── api/
│   │   ├── graphql-schema.md
│   │   └── endpoints.md
│   ├── guides/
│   │   ├── development.md
│   │   └── deployment.md
│   └── archive/ (historical docs)
│       └── 2024-pivot-from-rest.md
└── .mad-workflows/
    ├── [workflow files]
    └── output/ (cleaned, only active PRDs)
```

### Changes Summary
- **Deleted**: [X] files
- **Consolidated**: [Y] files into [Z]
- **Moved**: [A] files
- **Created**: [B] files
- **Updated**: [C] files

---

## Migration Notes

### Breaking Changes
[Any changes that might affect developers or users]

- Example: "Setup instructions moved from README to QUICKSTART.md"
- Example: "API documentation consolidated into /docs/api/"

### Communication Plan
- [ ] Announce changes in [team channel/meeting]
- [ ] Update onboarding checklist
- [ ] Post migration guide
- [ ] Update bookmarks/links in other tools

---

## Newcomer Experience Test

### Before Cleanup
**Time to understand project**: [estimate]  
**Friction points**: 
- [List confusion points]

### After Cleanup (Expected)
**Time to understand project**: [estimate]  
**Improvements**: 
- [List expected improvements]

---

## Next Steps

### Immediate (This Session)
1. [ ] Get approval for High priority deletions
2. [ ] Execute High priority consolidations
3. [ ] Update README
4. [ ] Fix critical contradictions
5. [ ] Verify all links work

### Near-term (This Week)
1. [ ] Execute Medium priority relocations
2. [ ] Create missing critical docs
3. [ ] Archive historical artifacts
4. [ ] Update internal references

### Long-term (This Month)
1. [ ] Address Low priority improvements
2. [ ] Schedule regular documentation audits
3. [ ] Create documentation maintenance process
4. [ ] Train team on new structure

---

## Metrics & Success Criteria

### Before
- Documentation files: [count]
- Average document age: [days]
- Broken links: [count]
- Contradictions found: [count]
- Duplicate content sections: [count]

### After (Target)
- Documentation files: [count] (↓ by X%)
- All docs reviewed within last [Y] days
- Broken links: 0
- Contradictions: 0
- Duplicate content: 0

### Success Criteria
- [ ] Newcomer can understand project in < 2 minutes
- [ ] Setup instructions in exactly one location
- [ ] No contradictory information
- [ ] Clear README → Detailed Docs path
- [ ] All internal links functional
- [ ] Ephemeral artifacts removed/archived

---

## Appendix

### Files Reviewed
[Complete list of all files reviewed during audit]

### Tools Used
- [List any tools, scripts, or automated checks used]

### Additional Notes
[Any other context, decisions, or observations]

