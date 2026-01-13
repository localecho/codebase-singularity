# Agent Coordination Protocol

## Overview

This document defines the communication and coordination protocol between Class 2 agents.

## Message Format

All agent-to-agent communication uses this format:

```json
{
  "schema_version": "1.0.0",
  "message_id": "uuid-v4",
  "timestamp": "ISO-8601",
  "from": "agent_name",
  "to": "agent_name",
  "type": "message_type",
  "priority": "critical|high|medium|low",
  "payload": {},
  "context": {
    "workflow": "feature|bugfix|refactor",
    "spec": "path/to/spec.md",
    "iteration": 1
  },
  "status": "pending|accepted|completed|rejected"
}
```

## Message Types

| Type | From | To | Purpose |
|------|------|-----|---------|
| `task_handoff` | planner | builder | Pass spec for implementation |
| `review_request` | builder | reviewer | Request code review |
| `fix_request` | reviewer | fixer | Request issue fixes |
| `rereview_request` | fixer | reviewer | Request re-review after fixes |
| `completion` | any | orchestrator | Signal phase complete |
| `escalation` | any | orchestrator | Human intervention needed |

## Handoff Storage

Handoffs are stored in `.claude/handoffs/`:

```
.claude/handoffs/
├── pending/
│   └── handoff-uuid.json
├── accepted/
│   └── handoff-uuid.json
└── completed/
    └── handoff-uuid.json
```

## State Synchronization

### Shared State File

All agents read/write `.claude/state.json`:

```json
{
  "schema_version": "1.0.0",
  "current_workflow": {
    "id": "workflow-uuid",
    "type": "feature",
    "started": "ISO-8601",
    "spec": "specs/20240101-feature.md"
  },
  "current_agent": "builder",
  "last_handoff": "handoff-uuid",
  "locks": {},
  "iteration": 1,
  "agents": {
    "planner": {"status": "completed", "last_active": "ISO-8601"},
    "builder": {"status": "active", "last_active": "ISO-8601"},
    "reviewer": {"status": "idle"},
    "fixer": {"status": "idle"}
  }
}
```

### Lock Protocol

Before modifying shared resources:

```javascript
// Acquire lock
if (!state.locks[resource]) {
  state.locks[resource] = {
    agent: myName,
    acquired: new Date().toISOString(),
    expires: new Date(Date.now() + 30*60*1000).toISOString()
  };
  saveState(state);
  // Proceed with work
}

// Release lock
delete state.locks[resource];
saveState(state);
```

## Agent Lifecycle

### 1. Activation
```
Agent activated by orchestrator or handoff
  → Read state.json
  → Check for pending handoffs
  → Accept handoff if found
```

### 2. Execution
```
Execute agent-specific work
  → Update state.json periodically
  → Create artifacts (code, specs, reports)
  → Handle errors gracefully
```

### 3. Completion
```
Work complete
  → Create handoff for next agent
  → Update state with completion status
  → Return result to orchestrator
```

## Error Handling

### Retry Protocol
```
MAX_RETRIES = 3
RETRY_DELAY = exponential_backoff(attempt)

for attempt in range(MAX_RETRIES):
    try:
        execute_task()
        break
    except RecoverableError:
        sleep(RETRY_DELAY)
    except FatalError:
        escalate_to_human()
        break
```

### Escalation
```json
{
  "type": "escalation",
  "from": "builder",
  "to": "orchestrator",
  "payload": {
    "reason": "spec_ambiguity",
    "details": "Cannot determine auth method",
    "options": ["JWT", "Session", "OAuth"],
    "context": "spec line 45",
    "blocking": true
  }
}
```

## Conflict Resolution

### Same-File Conflicts
When multiple agents need the same file:

1. Check lock status
2. If locked by another agent, wait or skip
3. If expired lock, force acquire
4. Process file
5. Release lock

### Workflow Conflicts
When workflow state is inconsistent:

1. Orchestrator is arbiter
2. Last-write-wins for non-critical state
3. Human review for critical conflicts

## Observability

### Agent Events Log
```json
{
  "event": "agent_started",
  "agent": "builder",
  "timestamp": "ISO-8601",
  "context": {"workflow": "feature", "spec": "..."}
}
```

Events logged:
- `agent_started`
- `agent_completed`
- `handoff_created`
- `handoff_accepted`
- `error_occurred`
- `escalation_triggered`

### Metrics Collected
- Time per agent
- Handoffs per workflow
- Fix iterations
- Escalation rate

## Example Flow

```
1. USER: "Add user auth"
2. ORCHESTRATOR: Creates workflow, activates PLANNER
3. PLANNER:
   - Analyzes requirement
   - Creates spec
   - Creates handoff to BUILDER
   - Returns: {status: completed, spec: "specs/..."}
4. ORCHESTRATOR: Activates BUILDER
5. BUILDER:
   - Reads handoff
   - Implements spec
   - Creates handoff to REVIEWER
   - Returns: {status: completed, commit: "abc123"}
6. ORCHESTRATOR: Activates REVIEWER
7. REVIEWER:
   - Reviews code
   - Finds 2 issues
   - Creates handoff to FIXER
   - Returns: {status: needs_fixes, issues: 2}
8. ORCHESTRATOR: Activates FIXER
9. FIXER:
   - Fixes issues
   - Creates handoff to REVIEWER
   - Returns: {status: fixes_applied}
10. REVIEWER (iteration 2):
    - Re-reviews
    - Approves
    - Returns: {status: approved}
11. ORCHESTRATOR: Workflow complete
```
