<!-- 
  APPEND this section to the existing feature document (docs/feat_[name]_IMPL.md).
  Do NOT create a new file. Read the PRD and Implementation sections above, then append this below.
  After appending, rename the file from _IMPL.md to _QA.md
-->

---

## 3. QA Testing (QA Engineer)

**Completed:** [ISO Timestamp]

### Test Results
- [x] [Criterion 1] - PASS
- [ ] [Criterion 2] - FAIL: [Bug description]
- [x] [Criterion 3] - PASS

### Trivial Issues Fixed by QA
*QA fixed these issues directly during testing (styling, typos, simple validations):*

1. **[Issue Title]** (Optional - only if QA fixed trivial issues)
   - Location: [File/line]
   - Fix: [What was changed]
   - Commit: [If applicable]

*If no trivial issues were fixed, write: "None - no trivial issues found."*

### Big Issues Requiring Implementer
*Issues that are too complex for QA to fix (broken functionality, missing features, architectural problems):*

1. **[Bug Title]** (If any big issues exist)
   - Location: [File/line]
   - Description: [What's wrong and why it needs Implementer]
   - Severity: High/Medium/Low

*If no big issues exist, write: "None - all issues were trivial and fixed by QA."*

### Recommendations
- [Suggestion 1]
- [Suggestion 2]

### Status
- [ ] Ready for Publisher (all tests pass after trivial fixes)
- [x] Needs Implementer fixes (big issues remain)

---

## Next Steps
**If all tests passed (after QA's trivial fixes):**
- **Handoff to:** Publisher
- **Command:** `gen_pub docs/feat_[featurename]_QA.md`

**If big issues remain:**
- **Handoff to:** Implementer
- **Command:** User will run `gen_impl_back docs/feat_[featurename]_IMPL.md` (file stays as _IMPL.md)
