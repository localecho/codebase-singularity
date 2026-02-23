---
name: codebase_cache
description: Intelligent caching of codebase analysis between sessions with git-aware invalidation
triggers:
  - prime cache
  - cache analysis
  - no-cache
---

# Skill: Codebase Analysis Caching

## Overview

Cache file lists, structure analysis, and codebase metadata between sessions. Intelligently invalidate when git changes are detected, with option to bypass via `/prime --no-cache`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 CODEBASE CACHE SYSTEM                           │
│                                                                 │
│   /prime Command                                                │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │            GIT STATE DETECTOR                            │  │
│   │  - Current HEAD commit                                   │  │
│   │  - Working tree status                                   │  │
│   │  - Tracked file hashes                                   │  │
│   └─────────────────────────────────────────────────────────┘  │
│        │                                                        │
│        ▼                                                        │
│   ┌─────────────────┐     ┌─────────────────────────────────┐  │
│   │   CACHE CHECK   │────►│     CACHE STORAGE               │  │
│   │   Valid? ────── │     │  ┌─────────────────────────┐    │  │
│   │   │      │      │     │  │ file_tree: {...}        │    │  │
│   │   ▼      ▼      │     │  │ structure: {...}        │    │  │
│   │  YES    NO      │     │  │ dependencies: {...}     │    │  │
│   └───┬──────┬──────┘     │  │ git_commit: abc123      │    │  │
│       │      │            │  └─────────────────────────┘    │  │
│       │      │            └─────────────────────────────────┘  │
│       │      │                                                  │
│       │      ▼                                                  │
│       │   ┌─────────────────────────────────────────────────┐  │
│       │   │        FULL ANALYSIS                             │  │
│       │   │  - Scan all files                                │  │
│       │   │  - Parse structure                               │  │
│       │   │  - Extract dependencies                          │  │
│       │   │  - Store in cache                                │  │
│       │   └─────────────────────────────────────────────────┘  │
│       │                                                         │
│       ▼                                                         │
│   Cached Analysis (Fast!)                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cached Data

### File Tree Cache

```yaml
file_tree_cache:
  version: 1
  git_commit: "abc123def456"
  timestamp: "2024-01-02T10:00:00Z"

  data:
    total_files: 2450
    total_directories: 180

    tree:
      src:
        components:
          - Button.tsx
          - Modal.tsx
          - Form.tsx
        services:
          - api.ts
          - auth.ts
        utils:
          - helpers.ts

    file_types:
      typescript: 1200
      javascript: 400
      css: 250
      markdown: 100
      json: 50
```

### Structure Cache

```yaml
structure_cache:
  version: 1
  git_commit: "abc123def456"

  data:
    entry_points:
      - src/index.ts
      - src/main.tsx

    modules:
      - name: auth
        files: 15
        exports: ["login", "logout", "useAuth"]
      - name: api
        files: 8
        exports: ["fetchData", "postData"]

    dependencies:
      internal:
        auth: ["api", "utils"]
        components: ["hooks", "utils"]
      external:
        react: "18.2.0"
        typescript: "5.0.0"
```

### Analysis Cache

```yaml
analysis_cache:
  version: 1
  git_commit: "abc123def456"

  data:
    complexity:
      high: ["src/services/auth.ts", "src/utils/parser.ts"]
      medium: ["src/components/Form.tsx"]
      low: ["src/utils/helpers.ts"]

    test_coverage:
      covered: 85%
      uncovered_files:
        - src/services/legacy.ts
        - src/utils/deprecated.ts

    patterns_detected:
      - singleton: ["src/services/config.ts"]
      - factory: ["src/factories/"]
      - observer: ["src/events/"]
```

---

## Git-Aware Invalidation

### Change Detection

```yaml
invalidation_triggers:
  immediate:
    - new_commit: true
    - branch_switch: true
    - reset/rebase: true

  conditional:
    - unstaged_changes:
        threshold: 5  # files
    - untracked_files:
        threshold: 10

  ignored:
    - .gitignore changes only
    - README updates only
    - Comment-only changes
```

### Invalidation Logic

```python
def should_invalidate_cache(cached_state, current_state):
    """Determine if cache should be invalidated."""

    # Always invalidate on commit change
    if cached_state.git_commit != current_state.git_commit:
        return True, "new_commit"

    # Check for significant working tree changes
    changed_files = get_working_tree_changes()

    # Filter out insignificant changes
    significant_changes = [
        f for f in changed_files
        if not is_documentation_only(f)
        and not is_comment_only(f)
    ]

    if len(significant_changes) > THRESHOLD:
        return True, "working_tree_changes"

    # Check file timestamps vs cache
    if any_source_newer_than_cache(cached_state.timestamp):
        return True, "file_modified"

    return False, None
```

### Partial Invalidation

```yaml
partial_invalidation:
  enabled: true

  strategies:
    directory_scoped:
      description: Only invalidate affected directories
      example: "src/auth/* changed -> invalidate auth module cache"

    dependency_aware:
      description: Invalidate files that import changed files
      example: "api.ts changed -> invalidate components using api"

    type_specific:
      description: Invalidate by file type
      example: ".css changed -> invalidate style cache only"
```

---

## Cache Storage

### Location

```yaml
cache_locations:
  primary: .claude/cache/

  files:
    file_tree: .claude/cache/file_tree.json
    structure: .claude/cache/structure.json
    analysis: .claude/cache/analysis.json
    metadata: .claude/cache/metadata.json
```

### Metadata

```json
{
  "cache_version": "1.0.0",
  "created_at": "2024-01-02T10:00:00Z",
  "last_validated": "2024-01-02T12:30:00Z",
  "git_state": {
    "commit": "abc123def456",
    "branch": "main",
    "is_dirty": false
  },
  "statistics": {
    "hits": 42,
    "misses": 3,
    "invalidations": 2
  }
}
```

---

## Commands

### Standard Prime (Uses Cache)

```bash
# Uses cache if valid, rebuilds if stale
/prime
```

### Force Fresh Analysis

```bash
# Bypass cache entirely
/prime --no-cache
```

### Cache Management

```bash
# View cache status
/prime --cache-status

# Clear cache
/prime --clear-cache

# Validate cache without using
/prime --validate-cache
```

---

## Performance Impact

### Comparison

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         PRIME PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Without Cache (Full Scan):
    File enumeration:    2,500ms
    Structure analysis:  1,800ms
    Dependency mapping:  1,200ms
    ──────────────────────────────
    Total:               5,500ms

  With Cache (Hit):
    Cache validation:      50ms
    Load from disk:       100ms
    ──────────────────────────────
    Total:                 150ms

  Speedup: 36x faster

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Token Savings

```yaml
token_savings:
  without_cache:
    file_list_tokens: 15000
    structure_tokens: 8000
    total: 23000

  with_cache:
    summary_tokens: 500
    delta_tokens: 200
    total: 700

  savings: 97%
```

---

## Configuration

```yaml
# config/codebase_cache.yaml
codebase_cache:
  enabled: true

  storage:
    location: .claude/cache/
    max_size_mb: 50

  invalidation:
    on_commit: true
    on_branch_switch: true
    file_change_threshold: 5
    ignore_patterns:
      - "*.md"
      - "*.txt"
      - ".gitignore"

  partial_invalidation:
    enabled: true
    strategies:
      - directory_scoped
      - dependency_aware

  ttl:
    max_age_hours: 24
    validate_on_load: true
```

---

## Cache Warming

### Pre-Warm Strategies

```yaml
warming_strategies:
  on_checkout:
    description: Warm cache when switching branches
    trigger: "git checkout"

  on_pull:
    description: Warm cache after pulling changes
    trigger: "git pull"

  scheduled:
    description: Background refresh during idle
    frequency: "hourly"
```

### Warm Command

```bash
# Pre-warm cache for common operations
/prime --warm

# Warm specific directories
/prime --warm src/
```

---

## Integration

### With /prime Workflow

```
/prime
  │
  ├─► Check .claude/cache/metadata.json
  │     │
  │     ├─► Valid? Load cached data
  │     │     │
  │     │     └─► Verify git state matches
  │     │           │
  │     │           ├─► Match: Use cache
  │     │           └─► Mismatch: Rebuild
  │     │
  │     └─► Invalid/Missing: Full analysis
  │
  └─► Return analysis results
```

### With /orchestrate

```yaml
orchestrate_integration:
  - phase: planning
    uses_cache: true
    cache_keys:
      - file_tree
      - structure

  - phase: building
    uses_cache: true
    cache_keys:
      - dependencies
      - analysis

  - phase: reviewing
    uses_cache: false
    reason: "Always fresh for accuracy"
```

---

## Monitoring

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         CACHE STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Cache Status: VALID

  Hit Rate:     [████████████████░░░░] 82%

  This Session:
    Hits:       24
    Misses:     5
    Rebuilds:   2

  Cache Age:    2h 15m
  Size:         12.3 MB

  Last Invalidation:
    Reason:     new_commit
    Time:       2024-01-02 10:30:00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Intelligent caching for instant codebase awareness across sessions.*
