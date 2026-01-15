---
name: rollback
description: Safe undo system - lists recent agent actions and rolls back to checkpoints
arguments:
  - name: action
    description: Action to take - list (show history), rollback (undo), or cleanup
    required: false
  - name: checkpoint
    description: Checkpoint ID or number of steps to rollback
    required: false
---

# ROLLBACK - Safe Undo Command

## Purpose

Provide safe undo capabilities for agent actions by maintaining checkpoints, listing action history, and enabling rollback to previous states.

> Every action should be reversible. Mistakes are recoverable.

## Process

### Phase 1: Action Resolution

Determine what operation to perform:

- **list**: Show recent agent actions and available checkpoints
- **rollback**: Undo actions back to a specific checkpoint
- **cleanup**: Remove orphaned artifacts from incomplete operations

**Default Action**: list (if no action specified)

### Phase 2: History Analysis

1. **Load Action Log**
   - Read from `.claude/history/actions.json`
   - Parse recent session actions
   - Identify checkpoint markers

2. **Build Action Timeline**
   - Timestamp of each action
   - Type of action (create, modify, delete, execute)
   - Files/resources affected
   - Checkpoint references

3. **Identify Rollback Points**
   - Git commits (if in repo)
   - Explicit checkpoints created by agent
   - Stable states before risky operations

### Phase 3: List Actions (if action=list)

Display recent history in format:

```
RECENT AGENT ACTIONS
=====================

[5] 10:45:32 - CREATE - src/components/Button.tsx
    Checkpoint: cp-20240105-104532

[4] 10:44:15 - MODIFY - src/App.tsx
    + Added Button import
    + Added Button to render

[3] 10:43:00 - EXECUTE - npm install react-icons
    Added 1 package

[2] 10:42:30 - MODIFY - package.json
    + Added react-icons dependency

[1] 10:40:00 - CHECKPOINT - Before component work
    ID: cp-20240105-104000

Available Rollback Points:
- cp-20240105-104532 (After Button creation)
- cp-20240105-104000 (Before component work)
- HEAD~5 (Git: 5 commits ago)
```

### Phase 4: Execute Rollback (if action=rollback)

1. **Validate Checkpoint**
   - Verify checkpoint exists
   - Check if rollback is safe
   - Warn about potential data loss

2. **Determine Rollback Scope**
   - Files to restore
   - Files to delete
   - Commands to reverse

3. **Execute Rollback**
   For each action to undo:
   - CREATE -> Delete the file
   - MODIFY -> Restore previous version
   - DELETE -> Restore from backup
   - EXECUTE -> Run reverse command if available

4. **Verify Rollback**
   - Confirm all files restored
   - Run any necessary checks
   - Update action log

### Phase 5: Cleanup (if action=cleanup)

1. **Find Orphaned Artifacts**
   - Incomplete file creations
   - Stale backup files
   - Unused checkpoint data

2. **Clean Up Safely**
   - Move to trash rather than delete
   - Log all cleanup actions
   - Provide recovery path if needed

## Checkpoint System

### Automatic Checkpoints
Created before:
- Destructive operations (delete, overwrite)
- Multi-file changes
- External command execution
- Database migrations

### Manual Checkpoints
Can be created with:
/rollback checkpoint "Description of state"

### Checkpoint Storage
```
.claude/history/
  actions.json     # Action log
  checkpoints/
    cp-TIMESTAMP/
      manifest.json
      files/        # File snapshots
```

## Safety Features

### Before Rollback
1. Create backup of current state
2. Display what will change
3. Require confirmation for destructive rollbacks

### During Rollback
1. Process actions in reverse order
2. Verify each step completes
3. Stop on first error

### After Rollback
1. Verify final state
2. Update action log
3. Keep backup for recovery

## Output Format

The output should include:
- Action history (for list)
- Rollback plan (for rollback)
- Confirmation of changes made
- Any warnings or errors

## Examples

### Example 1: List recent actions
/rollback list
- Shows last 10 actions
- Highlights available checkpoints
- Shows git history if available

### Example 2: Rollback to checkpoint
/rollback rollback cp-20240105-104000
- Shows what will be undone
- Requests confirmation
- Executes rollback
- Verifies success

### Example 3: Rollback N steps
/rollback rollback 3
- Undoes last 3 actions
- Preserves checkpoint history
- Updates action log

### Example 4: Cleanup artifacts
/rollback cleanup
- Finds orphaned files
- Shows what will be removed
- Cleans up safely

---
*Every action is logged. Every change is reversible.*
