---
name: test_frontend
description: Closed-loop frontend testing - Request, Validate, Resolve
arguments:
  - name: scope
    description: "Test scope: unit, component, e2e, all"
    required: false
  - name: browser
    description: "Browser for e2e: chromium, firefox, webkit"
    required: false
---

# Test Frontend - Closed-Loop Validation

## Overview

This prompt runs frontend tests in a **Request → Validate → Resolve** loop, fixing failures until all tests pass.

## Phase 1: REQUEST

### Prepare Test Environment

```bash
# Install browsers for e2e
npx playwright install

# Build for testing
npm run build

# Start test server (if needed)
npm run start:test &
```

### Identify Test Scope

Based on `$scope` argument:

| Scope | Tool | What's Tested |
|-------|------|---------------|
| unit | Vitest/Jest | Utilities, hooks |
| component | Testing Library | React components |
| e2e | Playwright | Full user flows |
| all | All above | Everything |

### Run Tests

```bash
# Unit tests
npm run test:unit

# Component tests
npm run test:components

# E2E tests
npx playwright test

# With specific browser
npx playwright test --project=chromium
```

## Phase 2: VALIDATE

### Parse Test Results

Extract from test output:
- Total tests per category
- Pass/fail counts
- Screenshots (for e2e failures)
- Coverage data

### Analyze Failures

For each failed test:

1. **Unit/Component failures**
   - Check assertion
   - Verify mock data
   - Check component props

2. **E2E failures**
   - Review screenshot
   - Check selector validity
   - Verify page state

3. **Categorize**
   - Test bug
   - UI bug
   - Timing issue
   - Selector issue

### Generate Test Report

```markdown
# Frontend Test Report

**Date**: [timestamp]
**Scope**: [unit/component/e2e/all]
**Browser**: [if e2e]

## Results

| Category | Total | Passed | Failed |
|----------|-------|--------|--------|
| Unit | X | Y | Z |
| Component | X | Y | Z |
| E2E | X | Y | Z |

## Failed Tests

### Component: Button renders correctly
- **File**: tests/Button.test.tsx:15
- **Issue**: Missing aria-label
- **Screenshot**: N/A
- **Fix Type**: UI bug

### E2E: User can login
- **File**: tests/e2e/auth.spec.ts:30
- **Issue**: Timeout waiting for selector
- **Screenshot**: screenshots/login-failure.png
- **Fix Type**: Timing issue

## Visual Regression

| Component | Status | Diff |
|-----------|--------|------|
| Header | ✓ Match | - |
| Button | ✗ Changed | 2.3% |

## Recommendation

[ ] ALL PASSED - Continue workflow
[ ] FAILURES - Fixes required
```

## Phase 3: RESOLVE

### Fix Failed Tests

#### For Unit/Component bugs:

```typescript
// Before: Missing prop
<Button />

// After: Added required prop
<Button aria-label="Submit" />
```

#### For E2E timing issues:

```typescript
// Before: Immediate assertion
await page.click('#submit')
expect(page.locator('.success')).toBeVisible()

// After: Wait for state
await page.click('#submit')
await expect(page.locator('.success')).toBeVisible({ timeout: 5000 })
```

#### For selector issues:

```typescript
// Before: Fragile selector
page.locator('.btn-primary')

// After: Accessible selector
page.getByRole('button', { name: 'Submit' })
```

### Update Visual Baselines

If visual changes are intentional:

```bash
npx playwright test --update-snapshots
```

### Re-run Tests

```bash
# Run again after fixes
npm run test:frontend

# Run specific failed test
npx playwright test tests/e2e/auth.spec.ts
```

### Loop Until Green

```
while tests_failing:
    analyze_failure()
    fix_issue()
    run_tests()
```

## Integration with Orchestrator

After test_frontend completes:

```yaml
test_status: passed | failed
unit_tests: passed/total
component_tests: passed/total
e2e_tests: passed/total
visual_regression: passed | failed
ready_to_proceed: true | false
```

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FRONTEND TESTS - CLOSED LOOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Phase: VALIDATE
Scope: all
Browser: chromium

Running tests...
  ▶ Unit: 23/23 passed
  ▶ Component: 15/16 passed
  ▶ E2E: 7/8 passed

Failure Analysis:
  ✗ Component "Modal closes on escape"
    Expected: modal to be hidden
    Actual: modal still visible

  ✗ E2E "User completes checkout"
    Timeout: waiting for .order-confirmation
    Screenshot: saved

Root Causes:
  1. Modal: Missing keyboard event handler
  2. E2E: API response slow, need longer timeout

Phase: RESOLVE
  → Fixed: Added onKeyDown handler to Modal
  → Fixed: Increased e2e timeout to 10s
  → Re-running tests...

  ✓ All 47 tests passed

STATUS: PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---
*Closed-loop frontend testing with visual regression support*
