---
name: test_backend
description: Closed-loop backend testing - Request, Validate, Resolve
arguments:
  - name: scope
    description: "Test scope: unit, integration, api, all"
    required: false
  - name: coverage
    description: Minimum coverage threshold (default 80)
    required: false
---

# Test Backend - Closed-Loop Validation

## Overview

This prompt runs backend tests in a **Request → Validate → Resolve** loop, fixing failures until all tests pass.

## Phase 1: REQUEST

### Prepare Test Environment

```bash
# Ensure test database exists
createdb test_db 2>/dev/null || true

# Run migrations on test DB
DATABASE_URL=... npm run migrate:test

# Seed test data if needed
npm run seed:test
```

### Identify Test Scope

Based on `$scope` argument:

| Scope | Command | Coverage |
|-------|---------|----------|
| unit | `npm run test:unit` | Functions, utilities |
| integration | `npm run test:integration` | DB, services |
| api | `npm run test:api` | Endpoints |
| all | `npm test` | Everything |

### Run Tests

```bash
# With coverage
npm test -- --coverage --coverageThreshold='{"global":{"lines":80}}'

# Specific files
npm test -- path/to/test.spec.ts

# Watch mode (for development)
npm test -- --watch
```

## Phase 2: VALIDATE

### Parse Test Results

Extract from test output:
- Total tests
- Passed tests
- Failed tests
- Skipped tests
- Coverage percentage

### Analyze Failures

For each failed test:

1. **Read the test file**
   - Understand what's being tested
   - Check the assertion that failed

2. **Read the implementation**
   - Find the code being tested
   - Identify the bug

3. **Categorize failure**
   - Test bug (bad assertion)
   - Implementation bug (code issue)
   - Environment issue (missing setup)

### Generate Test Report

```markdown
# Backend Test Report

**Date**: [timestamp]
**Scope**: [unit/integration/api/all]
**Duration**: [seconds]

## Results

| Metric | Value |
|--------|-------|
| Total Tests | X |
| Passed | Y |
| Failed | Z |
| Skipped | W |
| Coverage | X% |

## Failed Tests

### test_name_1
- **File**: tests/unit/user.spec.ts:45
- **Assertion**: Expected 200, got 401
- **Root Cause**: Missing auth header in test
- **Fix Type**: Test bug

### test_name_2
...

## Coverage Gaps

| File | Coverage | Gap |
|------|----------|-----|
| src/services/auth.ts | 65% | Missing error cases |

## Recommendation

[ ] ALL PASSED - Continue workflow
[ ] FAILURES - Fixes required
```

## Phase 3: RESOLVE

### Fix Failed Tests

For each failure:

1. **If test bug**:
   - Fix the test assertion
   - Ensure test is valid

2. **If implementation bug**:
   - Fix the source code
   - Verify test now passes

3. **If environment issue**:
   - Update test setup
   - Document requirement

### Improve Coverage

If coverage < threshold:

1. Identify uncovered lines
2. Write new tests for gaps
3. Focus on critical paths

### Re-run Tests

```bash
# Run again after fixes
npm test

# Verify specific fixed tests
npm test -- --testNamePattern="test_name_1"
```

### Loop Until Green

```
while tests_failing or coverage_low:
    fix_issue()
    run_tests()
```

## Integration with Orchestrator

After test_backend completes:

```yaml
test_status: passed | failed
tests_total: X
tests_passed: Y
tests_failed: Z
coverage: X%
coverage_threshold: 80%
ready_to_proceed: true | false
```

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BACKEND TESTS - CLOSED LOOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase: VALIDATE
Scope: all

Running tests...
  ▶ Unit tests: 34/35 passed
  ▶ Integration: 12/12 passed
  ▶ API tests: 8/8 passed

Failure Analysis:
  ✗ test "should hash password" (unit/auth.spec.ts:23)
    Expected: "$2b$..."
    Received: undefined

Root Cause: bcrypt not imported in auth.ts

Phase: RESOLVE
  → Fixed: Added bcrypt import
  → Re-running tests...

  ✓ All 55 tests passed
  ✓ Coverage: 87% (threshold: 80%)

STATUS: PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---
*Closed-loop backend testing with automatic fix attempts*
