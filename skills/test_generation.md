---
name: test_generation
description: Auto-generate tests from specifications using ML
triggers:
  - generate tests
  - create test cases
  - test from spec
---

# Skill: Test Generation from Specs

## Overview

Auto-generate comprehensive tests from specifications using property-based testing, edge case discovery, mutation testing, and coverage optimization.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               TEST GENERATION PIPELINE                      │
│                                                             │
│   Specification / Code                                      │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              REQUIREMENT EXTRACTION                  │  │
│   │  - Parse specification                               │  │
│   │  - Extract invariants                                │  │
│   │  - Identify edge cases                               │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              TEST CASE GENERATION                    │  │
│   │  - Unit tests                                        │  │
│   │  - Property-based tests                              │  │
│   │  - Integration tests                                 │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              MUTATION TESTING                        │  │
│   │  - Generate mutants                                  │  │
│   │  - Run test suite                                    │  │
│   │  - Identify weak spots                               │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              COVERAGE OPTIMIZATION                   │  │
│   │  - Identify uncovered paths                          │  │
│   │  - Generate targeted tests                           │  │
│   │  - Minimize test suite                               │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   Complete Test Suite                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Requirement Extraction

### From Specification

```yaml
extraction:
  sources:
    - spec_files  # specs/*.md
    - docstrings
    - type_annotations
    - comments

  extracted_elements:
    preconditions:
      - "input must be non-empty string"
      - "user must be authenticated"

    postconditions:
      - "returns valid JSON"
      - "status code is 200 or 400"

    invariants:
      - "balance >= 0"
      - "list length <= max_size"

    edge_cases:
      - "empty input"
      - "null values"
      - "boundary values"
```

### From Code Analysis

```yaml
code_analysis:
  function: "def calculate_discount(price, percentage):"

  inferred_tests:
    - input: {price: 100, percentage: 10}
      expected: 90

    - input: {price: 0, percentage: 50}
      expected: 0  # Edge case: zero price

    - input: {price: 100, percentage: 0}
      expected: 100  # Edge case: no discount

    - input: {price: 100, percentage: 100}
      expected: 0  # Edge case: full discount

    - input: {price: -10, percentage: 10}
      expected: error  # Invalid: negative price
```

---

## Property-Based Testing

### Property Definition

```yaml
properties:
  - name: "discount_never_negative"
    property: "forall price, percentage: discount(price, percentage) >= 0"
    generator:
      price: positive_float
      percentage: float_0_to_100

  - name: "discount_never_exceeds_price"
    property: "forall price, percentage: discount(price, percentage) <= price"

  - name: "idempotent_save"
    property: "forall user: save(user) == save(save(user))"
```

### Generated Tests

```python
# Generated property-based tests
from hypothesis import given, strategies as st

@given(
    price=st.floats(min_value=0, max_value=1000000),
    percentage=st.floats(min_value=0, max_value=100)
)
def test_discount_never_negative(price, percentage):
    result = calculate_discount(price, percentage)
    assert result >= 0

@given(
    price=st.floats(min_value=0, max_value=1000000),
    percentage=st.floats(min_value=0, max_value=100)
)
def test_discount_never_exceeds_price(price, percentage):
    result = calculate_discount(price, percentage)
    assert result <= price
```

---

## Edge Case Discovery

### Automatic Detection

```yaml
edge_case_patterns:
  numeric:
    - zero
    - negative
    - max_int
    - min_int
    - infinity
    - nan

  string:
    - empty
    - whitespace_only
    - unicode
    - very_long
    - special_chars
    - null_bytes

  collection:
    - empty
    - single_element
    - duplicates
    - max_size
    - nested

  temporal:
    - epoch
    - far_future
    - leap_year
    - timezone_edge
    - dst_transition
```

### Generated Edge Cases

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       EDGE CASES DISCOVERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Function: parse_user_input(input: str)

  Edge Cases Generated:
    1. Empty string: ""
    2. Whitespace: "   \t\n"
    3. Unicode: "こんにちは"
    4. Emoji: "Hello 👋 World"
    5. Very long: "a" * 10000
    6. Null byte: "hello\x00world"
    7. SQL injection: "'; DROP TABLE users;--"
    8. XSS: "<script>alert('xss')</script>"

  Tests Generated: 8

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Mutation Testing

### Mutation Operators

```yaml
mutation_operators:
  arithmetic:
    - replace_plus_with_minus
    - replace_multiply_with_divide
    - replace_increment_with_decrement

  logical:
    - replace_and_with_or
    - negate_condition
    - remove_condition

  boundary:
    - off_by_one
    - boundary_swap  # < to <=

  null:
    - remove_null_check
    - return_null

  exception:
    - remove_try_catch
    - change_exception_type
```

### Mutation Score

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          MUTATION TESTING RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Mutants Generated: 156
  Mutants Killed: 142
  Mutants Survived: 14

  Mutation Score: 91.0%

  Surviving Mutants (weak tests):
    1. src/utils.py:45 - boundary swap < to <=
    2. src/auth.py:23 - removed null check
    3. src/api.py:78 - changed + to -

  Recommendation:
    Add tests for boundary conditions in utils.py

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Coverage Optimization

### Coverage Analysis

```yaml
coverage:
  current:
    line: 78%
    branch: 65%
    function: 85%

  uncovered:
    - file: src/handlers/error.py
      lines: [45, 46, 47, 89, 90]
      reason: "Exception handling paths"

    - file: src/utils/parser.py
      lines: [23, 24, 25]
      reason: "Edge case: malformed input"
```

### Test Minimization

```yaml
minimization:
  original_tests: 450
  after_minimization: 312
  reduction: 30.7%

  strategy:
    - Remove redundant tests
    - Merge similar test cases
    - Keep highest mutation-killing tests

  coverage_maintained: true
```

---

## Generated Test Output

### Example: TypeScript

```typescript
// Generated tests for UserService
import { describe, it, expect } from 'vitest';
import { UserService } from './UserService';

describe('UserService', () => {
  describe('createUser', () => {
    // Happy path
    it('should create user with valid input', async () => {
      const service = new UserService();
      const user = await service.createUser({
        email: 'test@example.com',
        name: 'Test User'
      });
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    // Edge case: empty name
    it('should reject empty name', async () => {
      const service = new UserService();
      await expect(
        service.createUser({ email: 'test@example.com', name: '' })
      ).rejects.toThrow('Name is required');
    });

    // Edge case: invalid email
    it('should reject invalid email', async () => {
      const service = new UserService();
      await expect(
        service.createUser({ email: 'invalid', name: 'Test' })
      ).rejects.toThrow('Invalid email format');
    });

    // Property: email uniqueness
    it('should not allow duplicate emails', async () => {
      const service = new UserService();
      await service.createUser({
        email: 'unique@example.com',
        name: 'First'
      });
      await expect(
        service.createUser({
          email: 'unique@example.com',
          name: 'Second'
        })
      ).rejects.toThrow('Email already exists');
    });
  });
});
```

---

## Commands

```bash
# Generate tests for a file
/test generate src/services/UserService.ts

# Generate from specification
/test from-spec specs/user-management.md

# Run mutation testing
/test mutate src/utils/

# Optimize test suite
/test optimize --target 90%

# Generate property tests
/test properties src/core/
```

---

## Configuration

```yaml
# config/test_generation.yaml
test_generation:
  enabled: true

  frameworks:
    typescript: vitest
    python: pytest
    go: testing
    rust: cargo-test

  coverage:
    target: 85%
    branch_target: 75%

  mutation:
    enabled: true
    threshold: 80%

  property_testing:
    enabled: true
    examples_per_property: 100

  edge_cases:
    auto_discover: true
    include_security: true

  output:
    directory: tests/generated/
    naming: "{module}.generated.test.ts"
```

---

*Comprehensive test generation for confident deployments.*
