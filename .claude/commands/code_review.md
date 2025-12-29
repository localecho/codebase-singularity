---
name: code_review
description: Closed-loop code review - Request, Validate, Resolve
arguments:
  - name: files
    description: Files or directories to review (optional, defaults to recent changes)
    required: false
  - name: focus
    description: "Focus area: security, performance, style, all"
    required: false
---

# Code Review - Closed-Loop Validation

## Overview

This prompt implements a **Request → Validate → Resolve** loop where the agent reviews its own work and iterates until all issues are resolved.

## Phase 1: REQUEST

### Gather Context

1. **Identify Changes**
   ```bash
   git diff --name-only HEAD~1
   # Or for staged changes
   git diff --cached --name-only
   ```

2. **Read Changed Files**
   - Load each modified file
   - Note the type of changes (new code, refactor, fix)

3. **Load Relevant Spec**
   - Check `specs/CURRENT.md`
   - Ensure changes align with specification

### Review Checklist

Evaluate each file against:

#### Security (Critical)
- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all user data
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection where needed
- [ ] Authentication/authorization checks

#### Correctness
- [ ] Logic matches specification
- [ ] Edge cases handled
- [ ] Error handling is appropriate
- [ ] No undefined behavior

#### Performance
- [ ] No N+1 queries
- [ ] Appropriate data structures
- [ ] No unnecessary re-renders (React)
- [ ] Caching where beneficial

#### Style
- [ ] Consistent with project conventions
- [ ] Clear variable/function names
- [ ] No dead code
- [ ] Appropriate comments (not excessive)

## Phase 2: VALIDATE

### Run Automated Checks

```bash
# Linting
npm run lint

# Type checking
npm run typecheck

# Unit tests
npm test

# Build
npm run build
```

### Analyze Results

For each failure:
1. Categorize: Error vs Warning
2. Identify root cause
3. Determine fix complexity

### Generate Review Report

Create report in `app_reviews/resolutions/`:

```markdown
# Code Review Report

**Date**: [timestamp]
**Files Reviewed**: [list]
**Reviewer**: Codebase Singularity Agent

## Summary

| Category | Issues | Critical |
|----------|--------|----------|
| Security | X | Y |
| Correctness | X | Y |
| Performance | X | Y |
| Style | X | Y |

## Issues Found

### [CRITICAL] Issue 1
- **File**: path/to/file.ts:42
- **Category**: Security
- **Description**: Hardcoded API key
- **Resolution**: Move to environment variable

### [WARNING] Issue 2
...

## Test Results

- Unit Tests: PASS/FAIL (X/Y)
- Lint: PASS/FAIL
- Types: PASS/FAIL
- Build: PASS/FAIL

## Recommendation

[ ] APPROVED - Ready to merge
[ ] CHANGES REQUIRED - See issues above
[ ] BLOCKED - Critical issues must be resolved
```

## Phase 3: RESOLVE

### If Issues Found

1. **Prioritize by severity**
   - Critical (security, data loss) → Fix immediately
   - High (bugs, test failures) → Fix before merge
   - Medium (performance) → Fix if time permits
   - Low (style) → Optional

2. **Apply Fixes**
   - Make corrections to each file
   - Document what was changed

3. **Re-validate**
   - Run automated checks again
   - Ensure no regressions

4. **Loop Until Clean**
   ```
   while issues_exist:
       fix_issue()
       validate()
   ```

### If No Issues

1. Update review report: "APPROVED"
2. Log to `app_reviews/resolutions/`
3. Update `CLAUDE.md` session state
4. Notify orchestrator: Ready to proceed

## Integration with Orchestrator

After code_review completes:

```yaml
review_status: passed | failed
issues_found: [list]
issues_resolved: [list]
files_modified: [list]
ready_for_merge: true | false
```

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CODE REVIEW - CLOSED LOOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase: VALIDATE
Files: 3 modified

Running checks...
  ✓ Lint: passed
  ✓ Types: passed
  ✓ Tests: 42/42 passed
  ✓ Build: success

Review Results:
  Security: 0 issues
  Correctness: 1 warning
  Performance: 0 issues
  Style: 2 suggestions

Resolution:
  → Fixed: Unused variable in utils.ts
  → Skipped: Style suggestions (non-blocking)

STATUS: APPROVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---
*Closed-loop code review with self-healing capabilities*
