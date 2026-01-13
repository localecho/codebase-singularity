# Agent Coordination - Class 2 Multi-Agent System

This directory defines specialized agents and their coordination protocols.

## Agent Types

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PLANNER   │────▶│   BUILDER   │────▶│  REVIEWER   │────▶│   FIXER     │
│             │     │             │     │             │     │             │
│ Creates     │     │ Implements  │     │ Validates   │     │ Resolves    │
│ specs       │     │ code        │     │ quality     │     │ issues      │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                  │                   │                   │
       └──────────────────┴───────────────────┴───────────────────┘
                                    │
                              ┌─────▼─────┐
                              │ SHARED    │
                              │ CONTEXT   │
                              │ .claude/  │
                              │ state.json│
                              └───────────┘
```

## Directory Structure

```
.claude/agents/
├── README.md           # This file
├── planner.md          # Planner agent definition
├── builder.md          # Builder agent definition
├── reviewer.md         # Reviewer agent definition
├── fixer.md            # Fixer agent definition
└── protocol.md         # Handoff protocol definition
```

## Handoff Protocol

Agents communicate through structured messages stored in `.claude/handoffs/`:

```json
{
  "id": "handoff-uuid",
  "from": "planner",
  "to": "builder",
  "timestamp": "2024-01-01T00:00:00Z",
  "type": "task_handoff",
  "priority": "high",
  "payload": {
    "spec": "specs/20240101-feature.md",
    "context": {
      "files_analyzed": ["src/auth.ts"],
      "dependencies": ["bcrypt"]
    },
    "instructions": "Implement according to spec section 3.2"
  },
  "status": "pending"
}
```

## Shared Context

All agents read/write to `.claude/state.json` for shared context:

```json
{
  "current_agent": "builder",
  "workflow": "feature",
  "spec": "specs/20240101-feature.md",
  "handoffs": [
    {"id": "...", "from": "planner", "to": "builder", "status": "completed"}
  ],
  "files_modified": [],
  "tests_status": null
}
```

## Conflict Resolution

When multiple agents could act on the same resource:

1. **Lock Check**: Agent checks `state.json` for active locks
2. **Acquire Lock**: If unlocked, agent sets `locked_by: agent_name`
3. **Execute**: Agent performs its work
4. **Release Lock**: Agent clears lock on completion

```json
{
  "locks": {
    "src/auth.ts": {
      "agent": "builder",
      "acquired": "2024-01-01T00:00:00Z",
      "expires": "2024-01-01T00:30:00Z"
    }
  }
}
```

## Usage

To invoke a specific agent:

```
/planner "Add user authentication"
/builder "Implement spec 20240101-auth"
/reviewer "Review recent changes"
/fixer "Fix failing tests"
```

Or let the orchestrator coordinate:

```
/orchestrator "Add user authentication" full
```
