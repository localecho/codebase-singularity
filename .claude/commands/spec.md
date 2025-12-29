---
name: spec
description: Auto-generate specifications from natural language requirements
arguments:
  - name: requirement
    description: Natural language description of the feature/change
    required: true
  - name: type
    description: "Spec type: feature, bugfix, refactor, enhancement"
    required: false
---

# SPEC - Specification Generator

Generate a complete specification from natural language requirements.

## Input

**Requirement**: {{requirement}}
**Type**: {{type}} (defaults to "feature")

---

## Generation Protocol

### Step 1: Analyze Requirement

Parse the natural language input to extract:
- **Core objective**: What is the main goal?
- **Scope**: What areas of the codebase are affected?
- **Constraints**: Any limitations or requirements mentioned?
- **Dependencies**: What existing systems does this rely on?

### Step 2: Codebase Analysis

Search the codebase to understand context:

```
1. Grep for related keywords from the requirement
2. Identify affected files and directories
3. Find existing patterns to follow
4. Locate related tests
5. Check for similar past implementations
```

### Step 3: Generate Spec File

Create `specs/YYYYMMDD-{slug}.md` following the template:

```markdown
# Specification: [Feature Name]

## Metadata
| Field | Value |
|-------|-------|
| **Spec ID** | YYYYMMDD-{slug} |
| **Type** | {{type}} |
| **Author** | Agent |
| **Status** | Draft |
| **Created** | [timestamp] |

## Summary
[1-2 sentence description derived from requirement]

## Requirements
### Functional
- [ ] Requirement 1 (from analysis)
- [ ] Requirement 2 (inferred)

### Non-Functional
- [ ] Performance: [if applicable]
- [ ] Security: [if applicable]

## Technical Design

### Affected Files
| File | Action | Changes |
|------|--------|---------|
| path/to/file.ts | Modify | [description] |
| path/to/new.ts | Create | [description] |

### Implementation Approach
[Step-by-step implementation plan]

### Data Flow
[If applicable, describe data transformations]

## Testing Strategy
- Unit tests: [what to test]
- Integration tests: [if needed]
- Manual testing: [steps]

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | Medium | How to handle |

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests pass
- [ ] Code review approved
```

### Step 4: Complexity Assessment

Estimate complexity and provide recommendation:

```
Complexity Assessment:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Estimated Complexity: [Low/Medium/High]
  Files to Modify: [count]
  Files to Create: [count]
  Estimated Tests: [count]
  Suggested Approach: [Brief recommendation]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Output Format

After generation, output:

```
┌─────────────────────────────────────────────────────────────┐
│ SPECIFICATION GENERATED                                     │
├─────────────────────────────────────────────────────────────┤
│ File: specs/YYYYMMDD-{slug}.md                              │
│ Type: {{type}}                                              │
│ Complexity: [assessment]                                    │
├─────────────────────────────────────────────────────────────┤
│ Affected Components:                                        │
│   • component-1                                             │
│   • component-2                                             │
├─────────────────────────────────────────────────────────────┤
│ Next Steps:                                                 │
│   1. Review and approve spec                                │
│   2. Run: /orchestrator "Implement spec YYYYMMDD-{slug}"    │
└─────────────────────────────────────────────────────────────┘
```

---

## Approval Flow

After generating, ask for approval:

```
Spec generated. Options:
  [A] Approve and proceed to implementation
  [E] Edit spec before proceeding
  [R] Regenerate with different approach
  [C] Cancel
```

If approved:
1. Update `specs/CURRENT.md` to point to new spec
2. Update `.claude/state.json` with activeSpec
3. Optionally trigger `/orchestrator` for implementation

---

## Examples

### Example 1: Feature Request
```
/spec "Add user authentication with magic link login"

→ Generates: specs/20240101-magic-link-auth.md
→ Identifies: src/auth/, src/api/, database/users
→ Complexity: Medium
→ Approach: Supabase Auth integration
```

### Example 2: Bug Fix
```
/spec "Fix pagination not working on mobile" --type bugfix

→ Generates: specs/20240101-mobile-pagination-fix.md
→ Identifies: src/components/Pagination.tsx
→ Complexity: Low
→ Approach: Add responsive breakpoints
```

### Example 3: Refactor
```
/spec "Refactor API routes to use middleware" --type refactor

→ Generates: specs/20240101-api-middleware-refactor.md
→ Identifies: src/api/*, src/middleware/
→ Complexity: High
→ Approach: Extract common logic, add middleware chain
```

---

## Begin Generation

Analyzing requirement: "{{requirement}}"

Searching codebase for context...
