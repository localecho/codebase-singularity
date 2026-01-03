---
description: Process multiple GitHub issues in sequence
argument-hint: [issues] [repo]
---

# Sprint Mode: Process Issues $ARGUMENTS

Process the following GitHub issues in sequence.

## Instructions

1. **Parse the issue list** - Handle ranges (1-5) and comma-separated (1,3,7) formats
2. **For each issue:**
   - Fetch issue details from GitHub using `gh issue view`
   - Create a feature branch named `issue-{number}-{slug}`
   - Implement the fix/feature based on issue requirements
   - Run tests if they exist
   - Commit changes with message referencing the issue
   - Create a PR that closes the issue
   - Move to next issue

3. **Use TodoWrite** to track progress through each issue

4. **Run issues in parallel** when they don't conflict (different files/features)

## Begin Processing

Start by fetching all issue details, then create a todo list and begin implementation.
