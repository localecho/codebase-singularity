---
name: bugfix
description: Bug fixing workflow with reproduction and verification
phases: [reproduce, fix, verify]
checkpoints: [verify]
auto_merge: true
---

# Bug Fix Workflow

## Overview

Fast workflow for fixing bugs with mandatory reproduction and verification.

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ REPRODUCE│───▶│   FIX    │───▶│  VERIFY  │
│          │    │          │    │          │
│ Confirm  │    │ Patch    │    │ Test     │
│ Create   │    │ Commit   │    │ Close    │
│ Test     │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘
     │                               │
     ▼                               ▼
 Failing                       [CHECKPOINT]
 test                          Verification
```

## Phase 1: REPRODUCE

### Inputs
- Bug report (issue number or description)
- Reproduction steps (if provided)

### Actions
1. Read bug report
2. Understand expected vs actual behavior
3. Create minimal reproduction case
4. Write failing test that captures the bug

### Outputs
- `tests/regression/BUG-YYYYMMDD-NNNN.spec.ts`
- Failing test proving bug exists
- Root cause analysis

### Failing Test Template
```typescript
/**
 * Regression test for BUG-YYYYMMDD-NNNN
 *
 * Bug: [description]
 * Expected: [correct behavior]
 * Actual: [incorrect behavior]
 */
describe('Regression: BUG-YYYYMMDD-NNNN', () => {
  it('should [expected behavior]', () => {
    // Minimal reproduction
    const result = buggyFunction(input);
    expect(result).toBe(expected);  // Currently fails
  });
});
```

### Exit Criteria
- Failing test exists
- Test clearly demonstrates the bug
- Root cause identified

---

## Phase 2: FIX

### Inputs
- Failing test
- Root cause analysis
- Affected files

### Actions
1. Create bugfix branch
2. Implement fix
3. Run the failing test (should pass now)
4. Run full test suite (no regressions)
5. Commit with bug reference

### Commit Format
```
fix(scope): [brief description]

Fixes: #123
Root Cause: [what was wrong]
Solution: [what was changed]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Exit Criteria
- Regression test passes
- All other tests pass
- No new issues introduced

---

## Phase 3: VERIFY

### Inputs
- Fix commit
- Test results
- Original bug report

### Actions
1. Run full test suite
2. Manual verification (if steps provided)
3. Check for regressions
4. Update bug status
5. Create resolution record

### Checkpoint: Verification
```
⏸️ CHECKPOINT: Bug Verification

Bug: BUG-YYYYMMDD-NNNN
Fix Commit: abc1234

Regression Test: ✅ PASS
Full Suite: ✅ 123/123 passed
Regressions: None detected

[C]onfirm fix  [R]eject (bug persists)
```

### Outputs
- Resolution record in `app_reviews/resolutions/`
- Closed bug in `app_reviews/bugs/`
- PR or merged commit

---

## Completion

### Success Criteria
- [ ] Bug is confirmed fixed
- [ ] Regression test passes
- [ ] No new regressions
- [ ] Resolution documented

### Final Actions
```bash
# Auto-merge if enabled
git checkout main
git merge bugfix/BUG-YYYYMMDD-NNNN

# Close issue
gh issue close [number] --comment "Fixed in [commit]"
```

### Speed Target
- Simple bugs: < 30 minutes
- Complex bugs: < 2 hours
- Critical bugs: Immediate priority
