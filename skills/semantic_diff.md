---
name: semantic_diff
description: AST-based semantic code diff analysis with impact scoring
triggers:
  - analyze diff
  - semantic changes
  - impact analysis
---

# Skill: Semantic Code Diff Analysis

## Overview

Go beyond text diff to understand semantic code changes with AST analysis, impact scoring, and breaking change detection.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 SEMANTIC DIFF PIPELINE                      │
│                                                             │
│   Code Change                                               │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ Layer 1: Text Diff                                  │  │
│   │ - Line additions/deletions                          │  │
│   │ - Character-level changes                           │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ Layer 2: AST Diff                                   │  │
│   │ - Node additions/removals                           │  │
│   │ - Structural changes                                │  │
│   │ - Semantic equivalence                              │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │ Layer 3: Impact Analysis                            │  │
│   │ - Dependency graph                                  │  │
│   │ - Breaking change detection                         │  │
│   │ - Risk scoring                                      │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   Impact Report + Natural Language Summary                  │
└─────────────────────────────────────────────────────────────┘
```

---

## AST Diff Analysis

### Supported Languages

| Language | Parser | AST Support |
|----------|--------|-------------|
| TypeScript | ts-morph | Full |
| JavaScript | @babel/parser | Full |
| Python | ast module | Full |
| Go | go/ast | Full |
| Rust | syn | Full |
| Java | JavaParser | Full |

### Change Categories

```yaml
change_types:
  structural:
    - function_added
    - function_removed
    - function_renamed
    - class_added
    - class_removed
    - parameter_changed

  semantic:
    - logic_changed
    - type_changed
    - return_value_changed
    - exception_handling_changed

  cosmetic:
    - formatting
    - comments
    - variable_rename_local
```

---

## Impact Scoring

### Impact Factors

```yaml
impact_scoring:
  factors:
    visibility:
      public: 1.0
      protected: 0.7
      private: 0.3

    usage:
      high_usage: 1.0      # >10 callers
      medium_usage: 0.6    # 3-10 callers
      low_usage: 0.3       # 1-2 callers
      unused: 0.1          # 0 callers

    breaking:
      signature_change: 1.0
      behavior_change: 0.8
      deprecation: 0.5

  formula: |
    impact = (visibility * 0.3) + (usage * 0.4) + (breaking * 0.3)
```

### Risk Levels

```
┌─────────────────────────────────────────────────┐
│           IMPACT SCORE INTERPRETATION           │
├─────────────────────────────────────────────────┤
│  0.0 - 0.3  │  LOW     │ Safe to merge         │
│  0.3 - 0.6  │  MEDIUM  │ Review recommended    │
│  0.6 - 0.8  │  HIGH    │ Careful review needed │
│  0.8 - 1.0  │  CRITICAL│ Breaking change       │
└─────────────────────────────────────────────────┘
```

---

## Breaking Change Detection

### Patterns

```yaml
breaking_changes:
  api:
    - removed_public_function
    - changed_function_signature
    - removed_class
    - changed_interface

  behavioral:
    - changed_return_type
    - changed_exception_type
    - removed_default_value

  structural:
    - removed_export
    - changed_module_structure
    - renamed_public_symbol
```

### Detection Rules

```yaml
rules:
  - name: function_signature_change
    severity: critical
    pattern: |
      Old: function foo(a: string)
      New: function foo(a: string, b: number)
    action: require_migration_guide

  - name: return_type_change
    severity: high
    pattern: |
      Old: function bar(): Promise<User>
      New: function bar(): Promise<User | null>
    action: require_null_handling
```

---

## Dependency Impact Visualization

### Call Graph Analysis

```
┌────────────────────────────────────────────────┐
│  CHANGE: updateUser() signature                │
├────────────────────────────────────────────────┤
│                                                │
│  Direct Callers (5):                           │
│    ├─ userController.save()                    │
│    ├─ adminPanel.updateProfile()               │
│    ├─ api/users.patch()                        │
│    ├─ tests/user.test.ts                       │
│    └─ migrations/v2.ts                         │
│                                                │
│  Indirect Impact (12):                         │
│    └─ [Expand to see affected paths]           │
│                                                │
│  Risk: HIGH (public API, 5 direct callers)     │
└────────────────────────────────────────────────┘
```

### Visualization Output

```yaml
visualization:
  formats:
    - mermaid_diagram
    - ascii_tree
    - json_graph

  example_mermaid: |
    graph TD
      A[updateUser - CHANGED] --> B[userController]
      A --> C[adminPanel]
      A --> D[api/users]
      B --> E[UserService]
      C --> F[Dashboard]
```

---

## AI-Powered Diff Explanation

### Natural Language Summaries

```yaml
summary_template: |
  ## Change Summary

  This PR modifies **{function_count}** functions across **{file_count}** files.

  ### Key Changes
  {key_changes_list}

  ### Breaking Changes
  {breaking_changes_or_none}

  ### Impact Assessment
  - **Risk Level**: {risk_level}
  - **Affected Areas**: {affected_areas}
  - **Recommended Actions**: {actions}

example_output: |
  ## Change Summary

  This PR modifies **3** functions across **2** files.

  ### Key Changes
  - `updateUser()`: Added optional `metadata` parameter
  - `validateUser()`: Changed return type to include validation errors
  - `UserService`: Added new caching layer

  ### Breaking Changes
  - `validateUser()` now returns `ValidationResult` instead of `boolean`

  ### Impact Assessment
  - **Risk Level**: HIGH
  - **Affected Areas**: User management, API validation
  - **Recommended Actions**: Update all callers of validateUser()
```

---

## Integration

### With Code Review

```yaml
code_review:
  semantic_diff:
    enabled: true
    show_impact_scores: true
    require_summary: true
    block_on_critical: true
```

### CLI Commands

```bash
# Analyze semantic diff
/diff semantic HEAD~1

# Show impact graph
/diff impact --visualize

# Generate migration guide for breaking changes
/diff breaking --generate-migration
```

---

## Configuration

```yaml
# config/semantic_diff.yaml
semantic_diff:
  enabled: true

  ast_parsing:
    languages:
      - typescript
      - python
      - go

  impact_thresholds:
    block_merge: 0.9
    require_review: 0.6
    auto_approve: 0.3

  breaking_change:
    require_migration_guide: true
    notify_stakeholders: true

  visualization:
    format: mermaid
    include_in_pr: true
```

---

*Semantic understanding for safer code changes.*
