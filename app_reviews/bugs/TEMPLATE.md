# Bug Report Template

> Copy this template when documenting bugs: `app_reviews/bugs/BUG-YYYYMMDD-NNNN.md`

## Bug Metadata

| Field | Value |
|-------|-------|
| **Bug ID** | BUG-YYYYMMDD-NNNN |
| **Severity** | 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low |
| **Status** | Open / In Progress / Resolved / Won't Fix |
| **Discovered** | YYYY-MM-DD HH:MM |
| **Discovered By** | Agent / Human / Test Suite |
| **Assigned To** | Agent / Human |
| **Resolution ID** | (link to resolution when fixed) |

---

## Summary

[One-line description of the bug]

---

## Reproduction Steps

### Environment
- OS:
- Runtime:
- Dependencies:
- Configuration:

### Steps to Reproduce
1.
2.
3.

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

---

## Evidence

### Error Output
```
[Paste error messages, stack traces, logs here]
```

### Screenshots/Recordings
[If applicable, describe or link to visual evidence]

### Minimal Reproduction Code
```
[If applicable, minimal code that reproduces the issue]
```

---

## Analysis

### Root Cause Hypothesis
[Agent's analysis of what's causing the bug]

### Affected Components
- [ ] Component 1
- [ ] Component 2
- [ ] Component 3

### Impact Assessment
| Impact Area | Severity |
|-------------|----------|
| User Experience | Low/Medium/High |
| Data Integrity | Low/Medium/High |
| Security | Low/Medium/High |
| Performance | Low/Medium/High |

---

## Proposed Fix

### Approach
[Brief description of how to fix]

### Files to Modify
- `path/to/file1.ts` - [what to change]
- `path/to/file2.ts` - [what to change]

### Tests to Add
- [ ] Test case 1
- [ ] Test case 2

### Rollback Plan
[How to revert if fix causes issues]

---

## Resolution Log

### Attempt 1
- **Date**:
- **Action Taken**:
- **Result**: Success / Failed
- **Notes**:

### Attempt 2 (if needed)
- **Date**:
- **Action Taken**:
- **Result**: Success / Failed
- **Notes**:

---

## Verification

- [ ] Fix implemented
- [ ] Tests pass
- [ ] Bug no longer reproducible
- [ ] No regression introduced
- [ ] Resolution documented

---

## Related

- Related bugs:
- Related specs:
- Related PRs:
