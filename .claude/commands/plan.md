---
name: plan
description: Create a specification before implementing a feature
arguments:
  - name: feature
    description: The feature to plan
    required: true
---

# PLAN - Specification Creation

## Purpose

Create a detailed specification in `specs/` before writing any code.

> "Plan before you build. Measure twice, cut once."

## Process

### 1. Analyze Requirements

Parse `$feature` and determine:
- What is being built?
- What problem does it solve?
- What are the constraints?

### 2. Research Context

- Read `CLAUDE.md` for project conventions
- Check `ai_docs/` for relevant documentation
- Review existing code patterns in `src/`

### 3. Design Architecture

- Identify affected components
- Plan file structure
- Define interfaces/APIs
- Consider edge cases

### 4. Create Spec File

Generate: `specs/YYYYMMDD-$feature_slug.md`

Use template from `specs/TEMPLATE.md`:

```markdown
# Specification: $feature

## Summary
[One paragraph overview]

## Motivation
[Why this is needed]

## Design
[Architecture decisions]

## Implementation Plan
1. [ ] Task 1
2. [ ] Task 2
...

## Testing Strategy
[How to validate]

## Success Criteria
[Definition of done]
```

### 5. Update State

```yaml
# In specs/CURRENT.md
Active Spec: YYYYMMDD-$feature_slug.md
```

## Output

```
━━━ PLAN: SPECIFICATION CREATED ━━━
Feature: $feature
Spec: specs/YYYYMMDD-feature.md

Ready for implementation.
Run /build to proceed, or /orchestrate for full cycle.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---
*Always plan before building.*
