---
name: refactor
description: Code refactoring workflow with safety guarantees
phases: [analyze, plan, refactor, verify]
checkpoints: [plan, verify]
auto_merge: false
---

# Refactor Workflow

## Overview

Safe refactoring workflow that ensures no behavior changes.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ ANALYZE  │───▶│   PLAN   │───▶│ REFACTOR │───▶│  VERIFY  │
│          │    │          │    │          │    │          │
│ Scope    │    │ Strategy │    │ Execute  │    │ Test     │
│ Risk     │    │ Steps    │    │ Commit   │    │ Compare  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │                               │
                     ▼                               ▼
              [CHECKPOINT]                    [CHECKPOINT]
              Approval                        Verification
```

## Phase 1: ANALYZE

### Inputs
- Refactoring goal (what to improve)
- Affected code area

### Actions
1. Map all affected files
2. Identify all callers/dependencies
3. Assess test coverage of affected code
4. Evaluate risk level

### Risk Assessment
| Factor | Low | Medium | High |
|--------|-----|--------|------|
| Files affected | 1-3 | 4-10 | >10 |
| Callers | <5 | 5-20 | >20 |
| Test coverage | >80% | 50-80% | <50% |
| Public API change | No | Minor | Breaking |

### Outputs
- Dependency map
- Risk assessment
- Coverage report
- Recommended approach

---

## Phase 2: PLAN

### Inputs
- Analysis results
- Refactoring goal

### Actions
1. Define refactoring steps
2. Order by dependency (leaf first)
3. Plan atomic commits
4. Identify rollback points

### Plan Template
```markdown
# Refactoring Plan: [Goal]

## Scope
- Files: [count]
- Lines: ~[estimate]
- Risk: [Low/Medium/High]

## Steps
1. [ ] Step 1 - [description]
2. [ ] Step 2 - [description]
...

## Commit Strategy
- Commit per logical change
- Each commit must pass tests
- Rollback point after step 3

## Not Changing
- [Explicit list of what stays same]
```

### Checkpoint: Plan Approval
```
⏸️ CHECKPOINT: Refactoring Plan

Goal: [goal]
Risk: Medium
Steps: 8
Commits: 4

Breaking Changes: None
Test Coverage: 85%

[A]pprove  [E]dit plan  [R]eject
```

---

## Phase 3: REFACTOR

### Inputs
- Approved plan
- Current test results (baseline)

### Actions
For each step in plan:
1. Make change
2. Run tests
3. Verify no behavior change
4. Commit

### Atomic Commit Pattern
```bash
# Make one logical change
edit files...

# Verify
npm test

# Commit
git commit -m "refactor(scope): step N - [description]

Part of [refactoring goal]
- No behavior change
- Tests: ✅ [pass count]"
```

### Rollback Protocol
If tests fail after a step:
```bash
git revert HEAD  # Undo last commit
# Or full reset
git reset --hard [rollback-point]
```

---

## Phase 4: VERIFY

### Inputs
- All refactoring commits
- Baseline test results

### Actions
1. Run full test suite
2. Compare behavior (before/after)
3. Performance comparison
4. Code quality metrics

### Verification Checklist
- [ ] All tests pass
- [ ] Test count unchanged (or increased)
- [ ] No new test failures
- [ ] Performance not degraded (>5%)
- [ ] Code complexity improved
- [ ] No behavior changes

### Checkpoint: Final Verification
```
⏸️ CHECKPOINT: Refactoring Verification

Tests: ✅ 156/156 (unchanged)
Coverage: 87% → 89% (+2%)
Complexity: 45 → 38 (-16%)
Performance: No regression

Behavior Changes: None detected

[C]omplete  [R]ollback all
```

---

## Completion

### Success Criteria
- [ ] All tests pass
- [ ] No behavior changes
- [ ] Code quality improved
- [ ] Performance maintained

### Metrics to Report
- Cyclomatic complexity before/after
- Lines of code before/after
- Test coverage before/after
- Performance benchmarks
