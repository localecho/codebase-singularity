---
name: git_ops
description: Git workflow operations without MCP servers
triggers:
  - commit
  - push
  - branch
  - merge
  - status
  - diff
  - log
---

# Skill: Git Operations

Perform git operations using native CLI commands with intelligent parsing.

## Quick Reference

| Trigger | Command | Description |
|---------|---------|-------------|
| status | `git status` | Show working tree status |
| diff | `git diff` | Show unstaged changes |
| staged | `git diff --cached` | Show staged changes |
| log | `git log --oneline -10` | Recent commits |
| branch | `git branch -a` | List all branches |
| commit | See workflow below | Create commit |
| push | See workflow below | Push to remote |

---

## Commit Workflow

When asked to commit changes:

```bash
# 1. Check status
git status

# 2. Show what will be committed
git diff --cached  # If staged
git diff           # If unstaged

# 3. Stage changes (if needed)
git add <files>
# Or for all: git add -A

# 4. Create commit with conventional format
git commit -m "<type>(<scope>): <description>

<body if needed>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### Commit Message Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

---

## Branch Workflow

### Create Feature Branch
```bash
# From main/master
git checkout main
git pull origin main
git checkout -b feature/issue-{number}-{slug}
```

### List Branches
```bash
git branch -a  # All branches
git branch -vv # With tracking info
```

### Switch Branch
```bash
git checkout <branch-name>
# Or with new git:
git switch <branch-name>
```

### Delete Branch
```bash
git branch -d <branch>  # Safe delete (merged only)
git branch -D <branch>  # Force delete
```

---

## Push Workflow

```bash
# First push (set upstream)
git push -u origin <branch-name>

# Subsequent pushes
git push

# Push with force (careful!)
git push --force-with-lease  # Safer than --force
```

---

## Merge Workflow

### Merge to Main
```bash
git checkout main
git pull origin main
git merge feature/branch-name
git push origin main
```

### Resolve Conflicts
```bash
# During merge conflict:
git status  # Shows conflicted files

# After resolving:
git add <resolved-files>
git commit  # Complete the merge
```

---

## Inspection Commands

### View History
```bash
# Recent commits
git log --oneline -20

# With graph
git log --oneline --graph --all -20

# File history
git log --follow -p -- <file>
```

### View Changes
```bash
# Unstaged changes
git diff

# Staged changes
git diff --cached

# Between commits
git diff <commit1> <commit2>

# Between branches
git diff main..feature/branch
```

### Blame
```bash
git blame <file>
git blame -L 10,20 <file>  # Lines 10-20
```

---

## Stash Operations

```bash
# Save current work
git stash

# With message
git stash push -m "WIP: feature work"

# List stashes
git stash list

# Apply latest
git stash pop

# Apply specific
git stash apply stash@{1}
```

---

## Undo Operations

### Unstage Files
```bash
git reset HEAD <file>
# Or:
git restore --staged <file>
```

### Discard Changes
```bash
git checkout -- <file>
# Or:
git restore <file>
```

### Amend Last Commit
```bash
git commit --amend -m "new message"
```

### Reset to Previous Commit
```bash
git reset --soft HEAD~1  # Keep changes staged
git reset --mixed HEAD~1 # Keep changes unstaged
git reset --hard HEAD~1  # DISCARD changes
```

---

## Output Parsing

When parsing git output, extract:

```yaml
status:
  staged: [list of staged files]
  modified: [list of modified files]
  untracked: [list of untracked files]
  branch: current branch name
  ahead: commits ahead of remote
  behind: commits behind remote

log:
  commits:
    - hash: abc1234
      message: "commit message"
      author: "name"
      date: "date"

diff:
  files:
    - path: "file.ts"
      insertions: 10
      deletions: 5
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| "not a git repository" | No .git directory | Run `git init` |
| "uncommitted changes" | Dirty working tree | Commit or stash first |
| "merge conflict" | Conflicting changes | Resolve and commit |
| "rejected...non-fast-forward" | Remote has changes | Pull first |
| "permission denied" | Auth issue | Check SSH/token |

---

## Integration

This skill integrates with:
- `/commit` command (if defined)
- `/orchestrator` for automated workflows
- `app_reviews/` for tracking changes
