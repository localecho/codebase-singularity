---
name: status
description: Report current state of the Agentic Layer
---

# STATUS - System State Report

## Purpose

Provide a comprehensive view of the Codebase Singularity state.

## Process

### 1. Read Memory

Load `CLAUDE.md` and extract:
- Active workflow
- Current phase
- Session state

### 2. Scan Directories

```bash
# Count commands
ls .claude/commands/*.md | wc -l

# Count skills
ls skills/*.md | wc -l

# Count specs
ls specs/*.md | wc -l

# Count ai_docs
find ai_docs -name "*.md" | wc -l

# Count open bugs
grep -l "Status: Open" app_reviews/bugs/*.md 2>/dev/null | wc -l

# Count resolutions
ls app_reviews/resolutions/*.md 2>/dev/null | wc -l
```

### 3. Check Git State

```bash
# Uncommitted changes
git status --porcelain | wc -l

# Current branch
git branch --show-current

# Ahead/behind
git rev-list --left-right --count origin/main...HEAD
```

### 4. Generate Report

## Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CODEBASE SINGULARITY - STATUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workflow State:
  Active Workflow: [workflow or "None"]
  Current Phase: [phase or "Idle"]
  Active Spec: [spec or "None"]

Agentic Layer:
  ├── Commands: X available
  ├── Skills: X defined
  ├── Specs: X (Y active)
  ├── AI Docs: X cached
  └── Reviews:
      ├── Open Bugs: X
      └── Resolutions: Y

Application Layer:
  ├── Source Files: X
  ├── Test Files: X
  └── Database Migrations: X

Git Status:
  Branch: [branch]
  Uncommitted: X files
  Ahead/Behind: +X/-Y

Recent Activity:
  - [Last action 1]
  - [Last action 2]
  - [Last action 3]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---
*Quick status check for the Agentic Layer.*
