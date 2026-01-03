---
name: sprint
description: Process multiple GitHub issues in sequence
arguments:
  - name: issues
    description: Issue numbers (e.g., "64-70" or "1,3,7")
    required: true
  - name: repo
    description: Repository in owner/repo format
    required: false
---

Process GitHub issues **$issues** from repo **$repo**.

## Workflow

For each issue in the range:

1. **Fetch** - `gh issue view {number} --repo $repo --json number,title,body,state`
2. **Branch** - Create `issue-{number}-{slug}` branch
3. **Implement** - Build the fix/feature based on issue requirements
4. **Test** - Run tests if they exist
5. **PR** - Create pull request that closes the issue

## Execution

- Use TodoWrite to track each issue
- Process in parallel when issues don't conflict
- Generate sprint report on completion

## Begin

Start by fetching all issues, then process each one.
