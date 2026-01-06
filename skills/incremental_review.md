---
name: incremental_review
description: Diff-based reviews for faster iterations with review state tracking
triggers:
  - incremental review
  - diff review
  - review changes
---

# Skill: Incremental (Diff-Based) Reviews

## Overview

Track what has been reviewed, only review changed files on subsequent iterations, and display "previously approved" status for unchanged code. Dramatically reduce review time for iterative development.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 INCREMENTAL REVIEW SYSTEM                        │
│                                                                  │
│   Code Changes                                                   │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              DIFF ANALYZER                               │   │
│   │  - Calculate file diffs                                  │   │
│   │  - Identify changed functions/classes                    │   │
│   │  - Detect moved/renamed code                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              REVIEW STATE TRACKER                        │   │
│   │                                                          │   │
│   │   ┌─────────────────────────────────────────────────┐   │   │
│   │   │ File Review States                               │   │   │
│   │   │                                                  │   │   │
│   │   │ auth.ts      [APPROVED]  hash: abc123           │   │   │
│   │   │ api.ts       [APPROVED]  hash: def456           │   │   │
│   │   │ utils.ts     [CHANGED]   hash: ghi789 (new)     │   │   │
│   │   │ config.ts    [NEW]       hash: jkl012           │   │   │
│   │   └─────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              SELECTIVE REVIEWER                          │   │
│   │                                                          │   │
│   │   Skip: [auth.ts, api.ts]        (Previously approved)  │   │
│   │   Review: [utils.ts, config.ts]  (Changed/New)          │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                         │
│        ▼                                                         │
│   Review Results + Approval Status                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Review State Tracking

### State Storage

```yaml
review_state:
  version: 1
  session_id: "review-20240102-abc123"
  timestamp: "2024-01-02T10:00:00Z"

  files:
    - path: src/auth/login.ts
      status: approved
      content_hash: "sha256:abc123..."
      reviewed_at: "2024-01-02T10:00:00Z"
      reviewer: agent
      findings: []

    - path: src/api/endpoints.ts
      status: approved_with_notes
      content_hash: "sha256:def456..."
      reviewed_at: "2024-01-02T10:05:00Z"
      reviewer: agent
      findings:
        - type: suggestion
          line: 45
          message: "Consider adding rate limiting"

    - path: src/utils/helpers.ts
      status: pending
      content_hash: null
      reviewed_at: null
      reviewer: null
      findings: null
```

### Status Definitions

```yaml
review_statuses:
  approved:
    description: Reviewed and approved without issues
    icon: "✓"
    color: green

  approved_with_notes:
    description: Approved but has suggestions/minor issues
    icon: "~"
    color: yellow

  changes_requested:
    description: Requires changes before approval
    icon: "!"
    color: red

  pending:
    description: Not yet reviewed
    icon: "?"
    color: gray

  stale:
    description: Previously approved but file has changed
    icon: "↻"
    color: orange
```

---

## Diff Detection

### Change Classification

```yaml
change_types:
  no_change:
    description: File unchanged since last review
    action: skip_review
    status: previously_approved

  minor_change:
    description: Comments, formatting, whitespace only
    action: quick_review
    status: likely_approved

  localized_change:
    description: Changes in specific functions/sections
    action: partial_review
    scope: changed_sections_only

  major_change:
    description: Significant structural changes
    action: full_review
    status: pending

  new_file:
    description: File didn't exist in last review
    action: full_review
    status: pending
```

### Diff Analysis

```python
def analyze_diff(old_content, new_content, old_hash, new_hash):
    """Analyze changes between review states."""

    if old_hash == new_hash:
        return {
            "type": "no_change",
            "action": "skip",
            "message": "Previously approved, unchanged"
        }

    diff = compute_diff(old_content, new_content)

    # Check for cosmetic-only changes
    if is_cosmetic_only(diff):
        return {
            "type": "minor_change",
            "action": "quick_review",
            "changes": ["formatting", "comments"]
        }

    # Identify changed functions/classes
    changed_symbols = extract_changed_symbols(diff)

    if len(changed_symbols) < 5:
        return {
            "type": "localized_change",
            "action": "partial_review",
            "symbols": changed_symbols
        }

    return {
        "type": "major_change",
        "action": "full_review",
        "stats": compute_diff_stats(diff)
    }
```

---

## Review Display

### Incremental Review Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    INCREMENTAL CODE REVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Review Session: review-20240102-abc123
  Total Files: 12 | Changed: 3 | New: 1 | Unchanged: 8

  ──────────────────────────────────────────────────────────────────
  PREVIOUSLY APPROVED (Skipping)
  ──────────────────────────────────────────────────────────────────

  [APPROVED] src/auth/login.ts
             Reviewed: 2024-01-02 10:00 | No changes detected

  [APPROVED] src/auth/logout.ts
             Reviewed: 2024-01-02 10:00 | No changes detected

  [APPROVED] src/api/client.ts
             Reviewed: 2024-01-02 10:05 | No changes detected

  ... +5 more approved files

  ──────────────────────────────────────────────────────────────────
  NEEDS REVIEW
  ──────────────────────────────────────────────────────────────────

  [CHANGED] src/utils/helpers.ts
            Changes: +15 -8 lines | Modified: formatDate(), parseJSON()

  [CHANGED] src/api/endpoints.ts
            Changes: +42 -12 lines | Modified: fetchUser(), updateProfile()

  [NEW] src/services/cache.ts
        New file: 85 lines

  ──────────────────────────────────────────────────────────────────
  REVIEWING CHANGES...
  ──────────────────────────────────────────────────────────────────

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Per-File Review Result

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  REVIEW: src/utils/helpers.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Change Type: localized_change
  Modified Functions: formatDate(), parseJSON()
  Review Scope: Changed sections only

  ┌─────────────────────────────────────────────┐
  │ formatDate() [Lines 12-28]                  │
  │ Status: APPROVED                            │
  │ Notes: Clean implementation, good handling  │
  │        of edge cases.                       │
  └─────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────┐
  │ parseJSON() [Lines 45-62]                   │
  │ Status: APPROVED WITH NOTES                 │
  │ Notes: Consider adding schema validation.   │
  │        Low priority suggestion.             │
  └─────────────────────────────────────────────┘

  File Status: APPROVED WITH NOTES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Commands

### Standard Review (Incremental)

```bash
# Review only changes since last review
/code_review

# Equivalent explicit form
/code_review --incremental
```

### Full Review (Override)

```bash
# Force full review of all files
/code_review --full

# Review specific files fully
/code_review --full --files src/auth/*.ts
```

### Review Status

```bash
# Show current review state
/code_review --status

# Show review history
/code_review --history

# Clear review state (reset)
/code_review --reset
```

---

## Review Persistence

### State File Location

```yaml
storage:
  location: .claude/review_state/

  files:
    current: .claude/review_state/current.json
    history: .claude/review_state/history/
```

### Review History

```json
{
  "sessions": [
    {
      "id": "review-20240102-abc123",
      "timestamp": "2024-01-02T10:00:00Z",
      "files_reviewed": 12,
      "files_approved": 10,
      "files_changed_requested": 2,
      "duration_seconds": 180
    },
    {
      "id": "review-20240102-def456",
      "timestamp": "2024-01-02T14:00:00Z",
      "files_reviewed": 2,
      "files_approved": 2,
      "files_changed_requested": 0,
      "duration_seconds": 45
    }
  ]
}
```

---

## Performance Impact

### Time Savings

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         REVIEW TIME COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Full Review (12 files):
    Analysis time:      45s
    Review time:        180s
    Total:              225s

  Incremental Review (3 changed files):
    State check:        2s
    Analysis time:      12s
    Review time:        45s
    Total:              59s

  Time Saved: 74%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Token Savings

```yaml
token_comparison:
  full_review:
    file_content_tokens: 25000
    analysis_tokens: 5000
    output_tokens: 3000
    total: 33000

  incremental_review:
    state_check_tokens: 500
    changed_file_tokens: 6000
    analysis_tokens: 1500
    output_tokens: 1000
    total: 9000

  savings: 73%
```

---

## Smart Re-Review Triggers

### Automatic Re-Review

```yaml
re_review_triggers:
  dependency_change:
    description: Re-review if imported file changed
    action: queue_for_review

  config_change:
    description: Re-review if configuration affects file
    files:
      - tsconfig.json
      - package.json
      - .eslintrc

  security_update:
    description: Re-review after security-related changes
    patterns:
      - "**/auth/**"
      - "**/security/**"
```

### Staleness Detection

```python
def check_staleness(file_path, review_state):
    """Check if a reviewed file has become stale."""

    # Direct content change
    if file_hash(file_path) != review_state.content_hash:
        return "content_changed"

    # Dependency changed
    imports = extract_imports(file_path)
    for imported_file in imports:
        if has_changed_since(imported_file, review_state.timestamp):
            return "dependency_changed"

    # Configuration changed
    if config_affects_file(file_path) and config_changed_since(review_state.timestamp):
        return "config_changed"

    return None  # Still valid
```

---

## Configuration

```yaml
# config/incremental_review.yaml
incremental_review:
  enabled: true

  state_storage:
    location: .claude/review_state/
    persist_across_sessions: true

  diff_detection:
    ignore_patterns:
      - "**/*.md"
      - "**/*.txt"
      - "**/package-lock.json"

    cosmetic_changes:
      - whitespace
      - comments
      - formatting

  review_scope:
    no_change: skip
    cosmetic_only: quick_review
    localized_change: partial_review
    major_change: full_review
    new_file: full_review

  staleness:
    check_dependencies: true
    check_config: true
    max_age_hours: 24

  display:
    show_previously_approved: true
    collapse_unchanged: true
```

---

## Integration

### With Orchestrate

```yaml
orchestrate_integration:
  review_phase:
    mode: incremental

    first_iteration:
      review_all: true

    subsequent_iterations:
      review_changed: true
      show_approved: true
```

### With Code Review Skill

```yaml
code_review_integration:
  default_mode: incremental

  fallback_to_full:
    - no_previous_state
    - state_corrupted
    - explicit_request
```

### With CI/CD

```yaml
ci_integration:
  on_pr_update:
    mode: incremental
    base: last_review_state

  on_merge_request:
    mode: full
    reason: final_approval_needed
```

---

## Summary Report

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    REVIEW SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Session: review-20240102-def456

  Files:
    Previously Approved:    8 (skipped)
    Newly Reviewed:         3
    Changed Requested:      1

  Results:
    [APPROVED]       src/utils/helpers.ts
    [APPROVED]       src/services/cache.ts (new)
    [CHANGES REQ]    src/api/endpoints.ts

  Issues Found:
    Critical:    0
    Major:       1 (in endpoints.ts)
    Minor:       2
    Suggestions: 3

  Time Saved: 74% vs full review

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Faster iterations through intelligent incremental reviews.*
