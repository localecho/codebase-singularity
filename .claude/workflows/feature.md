---
name: feature
description: New feature development workflow
phases: [plan, build, review, fix]
checkpoints: [plan, review]
auto_merge: false
---

# Feature Development Workflow

## Overview

Complete workflow for implementing new features from requirement to deployment.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   PLAN   │───▶│  BUILD   │───▶│  REVIEW  │───▶│   FIX    │
│          │    │          │    │          │    │          │
│ Spec     │    │ Code     │    │ Validate │    │ Resolve  │
│ Analysis │    │ Tests    │    │ Quality  │    │ Issues   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
     │                               │               │
     ▼                               ▼               │
[CHECKPOINT]                   [CHECKPOINT]          │
User approval                  If issues ───────────►│
                                                     │
                                                     ▼
                                              [COMPLETE]
```

## Phase 1: PLAN

### Inputs
- Natural language requirement
- CLAUDE.md context
- Existing codebase

### Actions
1. Analyze requirement for clarity
2. Search codebase for related code
3. Create specification in `specs/`
4. Estimate complexity

### Outputs
- `specs/YYYYMMDD-feature-name.md`
- Complexity assessment
- Affected files list

### Checkpoint: User Approval
```
⏸️ CHECKPOINT: Spec Approval Required

Spec: specs/20240101-feature-name.md
Complexity: Medium
Files: 5

[A]pprove  [E]dit  [R]eject
```

**Continue only if approved.**

---

## Phase 2: BUILD

### Inputs
- Approved specification
- Existing codebase

### Actions
1. Create feature branch
2. Implement code per spec
3. Write unit tests
4. Write integration tests
5. Update documentation
6. Commit changes

### Outputs
- Feature branch with commits
- New/modified source files
- Test files
- Documentation updates

### Exit Criteria
- All spec requirements implemented
- Tests written and passing locally
- No type errors
- No linting errors

---

## Phase 3: REVIEW

### Inputs
- Committed code changes
- Test results

### Actions
1. Run full test suite
2. Check code coverage
3. Security scan
4. Style check
5. Performance review

### Outputs
- Test report
- Coverage report
- Review findings

### Checkpoint: Review Decision
```
⏸️ CHECKPOINT: Review Complete

Tests: ✅ 45/45 passed
Coverage: 87%
Security: No issues
Style: 2 warnings

Issues Found: 3
- [HIGH] Missing input validation (auth.ts:45)
- [MED] Unused import (utils.ts:12)
- [LOW] Consider async/await (api.ts:78)

[A]pprove  [F]ix issues  [R]eject
```

If issues found → Phase 4
If approved → Complete

---

## Phase 4: FIX

### Inputs
- Issue list from review
- Original specification

### Actions
1. Fix critical issues first
2. Fix high priority issues
3. Fix medium/low if time
4. Re-run tests
5. Commit fixes

### Outputs
- Fix commits
- Updated test results

### Loop Back
After fixes → Return to REVIEW (max 5 iterations)

---

## Completion

### Success Criteria
- [ ] All spec requirements met
- [ ] Tests pass (100%)
- [ ] Coverage >= threshold
- [ ] No critical/high issues
- [ ] Documentation updated

### Final Actions
```bash
# Merge to main (if auto_merge enabled)
git checkout main
git merge feature/branch

# Or create PR for manual merge
gh pr create --title "feat: ..." --body "..."
```

### Artifacts Created
- Specification file
- Source code changes
- Test files
- Review report
- Resolution records (if fixes made)
