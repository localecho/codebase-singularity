---
name: orchestrate
description: Autonomous AI Developer Workflow - Plan, Build, Review, Fix cycle
arguments:
  - name: task
    description: The feature or fix to implement
    required: true
  - name: max_iterations
    description: Maximum fix cycles before escalating (default 3)
    required: false
  - name: auto_merge
    description: Auto-merge if all checks pass (default false)
    required: false
---

# ORCHESTRATOR - Autonomous AI Developer Workflow

## Overview

The Orchestrator executes complete development cycles without human intervention:

```
┌──────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│                                                          │
│   ┌──────┐    ┌───────┐    ┌────────┐    ┌─────┐       │
│   │ PLAN │ →  │ BUILD │ →  │ REVIEW │ →  │ FIX │       │
│   └──────┘    └───────┘    └────────┘    └──┬──┘       │
│       ↑                                      │          │
│       └──────────────────────────────────────┘          │
│                    (if issues found)                     │
└──────────────────────────────────────────────────────────┘
```

## Activation

```
/orchestrate "Add user authentication with JWT"
```

## Phase 1: PLAN

### Initialize

1. **Read memory** - Load `CLAUDE.md` for context
2. **Parse task** - Understand `$task` requirements
3. **Check for existing spec** - Avoid duplicate work

### Create Specification

Generate spec file: `specs/YYYYMMDD-$task_slug.md`

```markdown
# Specification: $task

## Objective
[Clear statement of what will be built]

## Design
[Architecture and approach]

## Implementation Plan
[Ordered list of files to create/modify]

## Testing Strategy
[How success will be validated]

## Success Criteria
[Measurable outcomes]
```

### Update State

```yaml
# In CLAUDE.md
workflow: orchestrate
phase: plan
spec_file: specs/YYYYMMDD-task.md
```

### Output

```
━━━ ORCHESTRATOR: PLAN PHASE ━━━
Task: $task
Spec created: specs/20241229-user-auth.md

Implementation Plan:
  1. Create auth middleware
  2. Add JWT utilities
  3. Create login/register endpoints
  4. Add protected route wrapper
  5. Write tests

Proceeding to BUILD phase...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Phase 2: BUILD

### Execute Implementation

For each item in the implementation plan:

1. **Create/modify file**
   - Follow project conventions
   - Reference ai_docs if needed
   - Use skills for common operations

2. **Track changes**
   ```yaml
   files_modified:
     - src/middleware/auth.ts (created)
     - src/utils/jwt.ts (created)
     - src/routes/auth.ts (created)
   ```

3. **Commit incrementally** (optional)
   ```bash
   git add src/middleware/auth.ts
   git commit -m "feat(auth): add auth middleware"
   ```

### Run Build

```bash
npm run build
```

If build fails:
- Parse error
- Fix immediately
- Re-run build

### Output

```
━━━ ORCHESTRATOR: BUILD PHASE ━━━
Implementing from spec...

  ✓ Created src/middleware/auth.ts
  ✓ Created src/utils/jwt.ts
  ✓ Created src/routes/auth.ts
  ✓ Modified src/index.ts
  ✓ Build successful

Files modified: 4
Proceeding to REVIEW phase...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Phase 3: REVIEW

### Execute Review Suite

Run all validation loops:

1. **code_review**
   - Security check
   - Style check
   - Logic validation

2. **test_backend** (if applicable)
   - Unit tests
   - Integration tests
   - API tests

3. **test_frontend** (if applicable)
   - Component tests
   - E2E tests

### Aggregate Results

```yaml
review_results:
  code_review: passed | failed
  test_backend: passed | failed
  test_frontend: passed | failed
  issues_found: [list]
```

### Decision Point

```
if all_passed:
    proceed to COMPLETE
else:
    proceed to FIX (iteration += 1)
```

### Output

```
━━━ ORCHESTRATOR: REVIEW PHASE ━━━
Running validation suite...

  ✓ code_review: passed
    - Security: 0 issues
    - Style: 2 suggestions (non-blocking)

  ✗ test_backend: failed
    - 1 test failing: "should validate JWT"
    - Coverage: 78% (needs 80%)

  ✓ test_frontend: passed (no changes)

Issues requiring resolution: 2
Proceeding to FIX phase...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Phase 4: FIX

### Iteration Control

```python
iteration = 1
max_iterations = $max_iterations or 3

while issues_exist and iteration <= max_iterations:
    fix_issues()
    re_review()
    iteration += 1

if issues_exist:
    escalate_to_human()
```

### Fix Process

For each issue:

1. **Analyze** - Understand root cause
2. **Fix** - Apply correction
3. **Verify** - Run targeted test

### Log Resolution

Create: `app_reviews/resolutions/RES-XXX.md`

```markdown
# RES-XXX: Fixed JWT validation test

## Problem
Test expected token expiry in seconds, code used milliseconds

## Solution
Updated jwt.ts to use seconds consistently

## Verification
✓ test_backend passed
✓ Coverage now 82%
```

### Re-run Review

```bash
# Only re-run failed checks
/test_backend
```

### Output

```
━━━ ORCHESTRATOR: FIX PHASE (1/3) ━━━
Resolving 2 issues...

Issue 1: JWT validation test
  → Root cause: time unit mismatch
  → Fixed: src/utils/jwt.ts:45
  → Verified: test passes

Issue 2: Coverage gap
  → Root cause: missing error test
  → Fixed: Added tests/auth.error.spec.ts
  → Verified: coverage now 82%

Re-running review...
  ✓ All checks passed

Proceeding to COMPLETE...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Phase 5: COMPLETE

### Finalize

1. **Update spec status**
   ```markdown
   **Status**: Complete
   ```

2. **Create summary commit**
   ```bash
   git add .
   git commit -m "feat(auth): implement JWT authentication

   - Add auth middleware
   - Add JWT utilities
   - Add login/register endpoints
   - Add tests (82% coverage)

   Closes: spec-20241229-user-auth"
   ```

3. **Update CLAUDE.md**
   ```yaml
   workflow: null
   phase: idle
   last_completed: 20241229-user-auth
   ```

4. **Log completion**
   Create: `app_reviews/resolutions/ORCH-YYYYMMDD.md`

### Auto-merge (if enabled)

```bash
if $auto_merge:
    git push origin feature-branch
    gh pr create --fill
    gh pr merge --auto
```

### Final Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ORCHESTRATOR: WORKFLOW COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Task: Add user authentication with JWT
Status: SUCCESS

Summary:
  - Phases completed: PLAN → BUILD → REVIEW → FIX → COMPLETE
  - Fix iterations: 1
  - Files created: 4
  - Files modified: 1
  - Tests added: 8
  - Coverage: 82%

Artifacts:
  - Spec: specs/20241229-user-auth.md
  - Resolution: app_reviews/resolutions/ORCH-20241229.md

Next Steps:
  - Review changes: git diff HEAD~1
  - Create PR: gh pr create
  - Or run another: /orchestrate "next task"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Error Handling

### Build Failure
- Parse error message
- Attempt fix
- If persistent, log bug and escalate

### Test Timeout
- Increase timeout
- Check for infinite loops
- Log and escalate if unresolved

### Max Iterations Exceeded

```
━━━ ORCHESTRATOR: ESCALATION ━━━
Max iterations (3) exceeded.
Unresolved issues: 1

Escalating to human review.
See: app_reviews/bugs/BUG-XXX.md

Workflow paused. Run /orchestrate resume to continue.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## State Recovery

If interrupted, resume with:

```
/orchestrate resume
```

The orchestrator reads `CLAUDE.md` state and continues from last phase.

---

*The Orchestrator: Autonomous development from task to tested code.*
