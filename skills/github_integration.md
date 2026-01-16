---
name: github_integration
description: Skill for direct GitHub Issues integration with specs and PRs
triggers:
  - create issue
  - link spec to issue
  - auto-close issue
  - github auth
---

# Skill: GitHub Integration

This skill enables direct integration between the Agentic Layer and GitHub Issues for seamless project management.

## Philosophy

> Connect specs directly to issues, and auto-close when PRs merge. Keep project management in sync with code changes automatically.

## Authentication Setup

### Personal Access Token (PAT)

```bash
# Set token via environment variable
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

# Or use gh CLI authentication (recommended)
gh auth login
```

### GitHub CLI (gh) Authentication

```bash
# Interactive login
gh auth login

# Check authentication status
gh auth status

# View current user
gh api user -q '.login'
```

### Token Permissions Required

- `repo` - Full repository access
- `issues` - Read/write issues
- `pull_requests` - Read/write PRs

## Spec to Issue Integration

### Create Issue from Spec

Use `/spec "feature name" --create-issue` to create a spec and linked GitHub issue.

```bash
# Create spec and issue together
/spec "Add user authentication" --create-issue

# This triggers:
# 1. Create specs/YYYYMMDD-add-user-authentication.md
# 2. Create GitHub issue with spec content
# 3. Add issue URL to spec frontmatter
```

### Spec Frontmatter with Issue Link

```yaml
---
title: Add User Authentication
date: 2025-01-15
status: draft
github_issue: https://github.com/owner/repo/issues/123
issue_number: 123
---
```

### Manual Issue Linking

```bash
# Link existing spec to issue
gh issue view 123 --json url -q '.url'
# Then add to spec frontmatter

# Or create issue from existing spec
gh issue create \
  --title "$(head -1 specs/CURRENT.md | sed 's/# //')" \
  --body "$(cat specs/CURRENT.md)"
```

## Auto-Linking Specs to Issues

### Bidirectional Links

When a spec is created:
1. Issue is created with spec content as body
2. Spec frontmatter is updated with issue URL
3. Issue is labeled with `spec-linked`

```bash
# Create issue and link back to spec
ISSUE_URL=$(gh issue create \
  --title "$SPEC_TITLE" \
  --body "$SPEC_CONTENT" \
  --label "spec-linked" \
  --json url -q '.url')

# Update spec with issue URL
sed -i "s/github_issue:.*/github_issue: $ISSUE_URL/" specs/CURRENT.md
```

### Issue Labels for Tracking

| Label | Meaning |
|-------|---------|
| `spec-linked` | Has an associated spec file |
| `in-progress` | Active development |
| `needs-review` | PR ready for review |
| `blocked` | Waiting on dependencies |

```bash
# Add labels to issue
gh issue edit 123 --add-label "spec-linked,in-progress"
```

## Auto-Close on PR Merge

### PR Closing Keywords

Include in PR description or commit message:

```markdown
Closes #123
Fixes #123
Resolves #123
```

### Workflow Integration

```bash
# Create PR that auto-closes issue
gh pr create \
  --title "feat: Add user authentication" \
  --body "$(cat <<EOF
## Summary
Implements user authentication per spec.

Closes #123

## Test Plan
- [ ] Unit tests pass
- [ ] Integration tests pass
EOF
)"
```

### Post-Merge Automation

When PR merges:
1. Issue is automatically closed
2. Spec status should be updated to `completed`
3. Resolution logged in `app_reviews/resolutions/`

```bash
# Check if issue was closed
gh issue view 123 --json state -q '.state'

# Update spec status
sed -i 's/status: in_progress/status: completed/' specs/YYYYMMDD-feature.md
```

## CLI Commands

### View Issue

```bash
# View issue details
gh issue view 123

# View in browser
gh issue view 123 --web
```

### List Issues

```bash
# List open issues
gh issue list

# Filter by label
gh issue list --label "spec-linked"

# Filter by assignee
gh issue list --assignee "@me"
```

### Update Issue

```bash
# Add comment
gh issue comment 123 --body "Started implementation"

# Update title
gh issue edit 123 --title "New title"

# Close manually
gh issue close 123
```

### Search Issues

```bash
# Search by keyword
gh issue list --search "authentication"

# Search with filters
gh issue list --search "label:bug state:open"
```

## Integration Workflow

### Complete Flow

```bash
# 1. Create spec with issue
/spec "Add OAuth support" --create-issue

# 2. Start work, update issue
gh issue edit 123 --add-label "in-progress"
gh issue comment 123 --body "Starting implementation"

# 3. Create branch
git checkout -b feature/oauth-support

# 4. Implement and commit
git add .
git commit -m "feat(auth): add OAuth support

Implements OAuth 2.0 flow per spec.
Relates to #123"

# 5. Create PR that closes issue
gh pr create \
  --title "feat(auth): Add OAuth support" \
  --body "Closes #123"

# 6. On merge, issue auto-closes
# 7. Update spec status to completed
```

## Error Handling

### Authentication Errors

```bash
# Check auth status
gh auth status

# Re-authenticate if needed
gh auth refresh

# Test API access
gh api user
```

### Rate Limiting

```bash
# Check rate limit
gh api rate_limit -q '.rate.remaining'

# If limited, wait or use token with higher limits
```

### Network Issues

```bash
# Retry with timeout
timeout 30 gh issue view 123 || echo "Network timeout"
```

## Configuration

### Repository Context

```bash
# Set default repository
gh repo set-default owner/repo

# Or specify per-command
gh issue list -R owner/repo
```

### Output Formats

```bash
# JSON output for scripting
gh issue view 123 --json title,state,labels

# Table format
gh issue list --json number,title --jq '.[] | [.number, .title] | @tsv'
```

## Safety Rules

1. **Never expose tokens** in code or logs
2. **Validate issue exists** before linking
3. **Backup specs** before automated updates
4. **Use dry-run** for destructive operations when available

---
*Skill for GitHub Issues integration with the Agentic Layer*
