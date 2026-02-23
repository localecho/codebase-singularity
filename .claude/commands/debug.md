---
name: debug
description: Interactive bug hunting - analyzes stack traces, identifies causes, and suggests fixes
arguments:
  - name: error
    description: Error message, stack trace, or description of the bug
    required: true
  - name: context
    description: Additional context - file path, reproduction steps, or environment info
    required: false
---

# DEBUG - Interactive Bug Hunting Command

## Purpose

Systematically analyze errors and bugs by parsing stack traces, identifying root causes, and suggesting targeted fixes.

> Every bug has a cause. Find it, understand it, fix it.

## Process

### Phase 1: Error Classification

Analyze the error input and classify it:

1. **Error Types**
   - Runtime Error (exceptions, crashes)
   - Syntax Error (parsing failures)
   - Logic Error (incorrect behavior)
   - Type Error (type mismatches)
   - Network Error (API, connectivity)
   - Database Error (queries, connections)
   - Build Error (compilation, bundling)
   - Test Failure (assertion failures)

2. **Severity Assessment**
   - Critical: Application crash, data loss
   - High: Feature broken, user blocked
   - Medium: Degraded functionality
   - Low: Minor issue, workaround exists

### Phase 2: Stack Trace Analysis

If a stack trace is provided:

1. **Parse Stack Frames**
   - Identify file paths and line numbers
   - Distinguish application code from library code
   - Find the originating error location

2. **Load Relevant Files**
   - Read the file where error originated
   - Examine surrounding context (10 lines each direction)
   - Load related files in the call chain

3. **Map the Call Chain**
   ```
   Error Origin
       ^
       |
   Direct Caller
       ^
       |
   Indirect Caller
       ^
       |
   Entry Point
   ```

### Phase 3: Root Cause Investigation

1. **Common Patterns Check**
   - Null/undefined access
   - Missing error handling
   - Race conditions
   - Resource exhaustion
   - Configuration issues
   - Dependency conflicts

2. **Code Analysis**
   - Variable states at error point
   - Input validation gaps
   - Edge cases not handled
   - Type mismatches

3. **Context Examination**
   - Recent changes to affected files
   - Related git commits
   - Environment differences

### Phase 4: Cause Identification

Document the likely cause:

```
ROOT CAUSE ANALYSIS
===================

Error: [Error message]
Type: [Error type]
Severity: [Critical/High/Medium/Low]

Location:
  File: src/api/users.ts
  Line: 42
  Function: getUserById()

Cause: [Detailed explanation]

Evidence:
  1. [Supporting evidence 1]
  2. [Supporting evidence 2]

Contributing Factors:
  - [Factor 1]
  - [Factor 2]
```

### Phase 5: Fix Suggestions

Provide actionable fix recommendations:

1. **Immediate Fix**
   - Exact code change to resolve the error
   - File and line number
   - Before/after comparison

2. **Preventive Measures**
   - Additional validation to add
   - Error handling improvements
   - Type safety enhancements

3. **Test Coverage**
   - Test case to catch this bug
   - Edge cases to cover
   - Regression test recommendation

## Interactive Mode

When more information is needed:

1. **Request Additional Context**
   - Ask for reproduction steps
   - Request environment details
   - Ask for recent changes

2. **Guided Debugging**
   - Suggest console.log placements
   - Recommend debugger breakpoints
   - Propose test scenarios

3. **Hypothesis Testing**
   - Propose potential causes
   - Suggest verification steps
   - Narrow down through elimination

## Output Format

The output should include:

```
DEBUG ANALYSIS REPORT
=====================

Error Summary:
  [Brief description of the error]

Stack Trace Analysis:
  [Key frames and their significance]

Root Cause:
  [Identified cause with evidence]

Suggested Fix:
  File: [path]
  Line: [number]
  
  Before:
  [code snippet]
  
  After:
  [fixed code snippet]

Preventive Measures:
  1. [Recommendation 1]
  2. [Recommendation 2]

Test Case:
  [Test to prevent regression]
```

## Examples

### Example 1: Runtime error
/debug "TypeError: Cannot read property id of undefined at getUserById (users.ts:42)"
- Parses stack trace
- Loads users.ts
- Identifies null check missing
- Suggests fix with optional chaining

### Example 2: Test failure
/debug "Expected 200 but got 401" --context "auth.test.ts line 55"
- Analyzes test code
- Checks authentication flow
- Identifies token expiration issue
- Suggests mock fix

### Example 3: Build error
/debug "Module not found: ./components/Button"
- Checks import paths
- Verifies file existence
- Identifies case sensitivity issue
- Suggests path correction

### Example 4: Logic error
/debug "Users are seeing wrong data after login" --context "Started after PR #123"
- Reviews recent changes
- Analyzes data flow
- Identifies caching issue
- Suggests cache invalidation fix

---
*Systematic debugging beats random guessing. Follow the evidence.*
