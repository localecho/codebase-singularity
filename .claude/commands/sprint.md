---
name: sprint
description: Process multiple GitHub issues in sequence - autonomous issue resolution
arguments:
  - name: issues
    description: Issue numbers or ranges (e.g., "1-5" or "1,3,7" or "1-3,5,8-10")
    required: true
  - name: repo
    description: Repository in owner/repo format (optional - uses current repo if not specified)
    required: false
---

# Sprint Mode: Autonomous Issue Processing

## Overview

Sprint mode processes multiple GitHub issues using the full Codebase Singularity workflow for each:

```
┌─────────────────────────────────────────────────────────────┐
│                    SPRINT MODE                              │
│                                                             │
│   Issue #1 → [PLAN → BUILD → REVIEW → FIX] → PR → Done     │
│   Issue #2 → [PLAN → BUILD → REVIEW → FIX] → PR → Done     │
│   Issue #3 → [PLAN → BUILD → REVIEW → FIX] → PR → Done     │
│   ...                                                       │
└─────────────────────────────────────────────────────────────┘
```

## Input

**Issues**: $issues
**Repository**: $repo (or current directory)

---

## Phase 1: Sprint Initialization

### Parse Issue Range

```
Input: "$issues"
Examples:
  "1-5"      → [1, 2, 3, 4, 5]
  "1,3,7"    → [1, 3, 7]
  "1-3,5,8"  → [1, 2, 3, 5, 8]
```

### Fetch All Issues

For each issue number:
```bash
gh issue view {number} --repo $repo --json title,body,labels,state
```

### Create Sprint Plan

Generate sprint summary:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SPRINT INITIALIZED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Repository: $repo
Issues: [list]
Total: X issues

Sprint Backlog:
  #1: [title] [labels]
  #2: [title] [labels]
  ...

Estimated Complexity: [Low/Medium/High]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Phase 2: Issue Processing Loop

For each issue in the sprint:

### 2.1 Create Feature Branch

```bash
git checkout -b issue-{number}-{slug}
```

### 2.2 Run Orchestrator

Invoke the full PLAN → BUILD → REVIEW → FIX cycle:

```
/orchestrate "Implement Issue #{number}: {title}" full
```

The orchestrator will:
1. **PLAN**: Create spec from issue body
2. **BUILD**: Implement the solution
3. **REVIEW**: Self-validate the code
4. **FIX**: Resolve any issues

### 2.3 Create Pull Request

```bash
gh pr create \
  --title "Fix #{number}: {title}" \
  --body "Closes #{number}\n\n{summary}" \
  --base main
```

### 2.4 Update Progress

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SPRINT PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issue #1: ✅ Complete (PR #X)
Issue #2: 🔄 In Progress (BUILD phase)
Issue #3: ⏳ Pending
Issue #4: ⏳ Pending
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Phase 3: Sprint Completion

### Generate Sprint Report

Store in `app_reviews/resolutions/SPRINT-YYYYMMDD.md`:

```markdown
# Sprint Report: YYYYMMDD

## Summary
- Issues Processed: X
- PRs Created: Y
- Success Rate: Z%

## Issue Details

### Issue #1: [title]
- Status: Complete
- PR: #X
- Files Changed: N
- Tests Added: M

### Issue #2: [title]
...

## Metrics
- Total Time: Xh Ym
- Avg Time Per Issue: Xm
- Fix Iterations: N

## Lessons Learned
[Auto-generated patterns from resolutions]
```

### Final Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  SPRINT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Issues Processed: X/Y
PRs Created: Z

Results:
  ✅ #1: [title] → PR #A
  ✅ #2: [title] → PR #B
  ❌ #3: [title] → Escalated (see BUG-XXX)

Report: app_reviews/resolutions/SPRINT-20240101.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Parallel Execution (Advanced)

When issues are independent (different files/features):

```
┌─────────────────────────────────────────────┐
│  Parallel Sprint Mode                       │
│                                             │
│  Agent 1 → Issue #1 ────────────→ PR #A    │
│  Agent 2 → Issue #2 ────────────→ PR #B    │
│  Agent 3 → Issue #3 ────────────→ PR #C    │
│                                             │
│  Conflict Detection → Sequential if needed  │
└─────────────────────────────────────────────┘
```

Enable with: `/sprint 1-5 --parallel`

---

## Error Handling

### Issue Cannot Be Resolved
1. Log to `app_reviews/bugs/`
2. Skip to next issue
3. Include in sprint report

### Merge Conflict
1. Stash changes
2. Rebase from main
3. Retry implementation

### Max Retries Exceeded
1. Create draft PR with partial work
2. Add "needs-help" label
3. Continue to next issue

---

## Integration with Codebase Singularity

Sprint mode leverages:
- **CLAUDE.md**: Project context
- **specs/**: Spec per issue
- **skills/**: Reusable capabilities
- **app_reviews/**: Sprint documentation
- **orchestrate.md**: Per-issue automation

---

**Begin Sprint Processing...**
