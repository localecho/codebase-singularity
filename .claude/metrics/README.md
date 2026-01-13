# Agentic Layer Metrics

Track agent performance and workflow effectiveness over time.

## Metrics Files

```
.claude/metrics/
├── README.md           # This file
├── sessions.json       # Session history
├── workflows.json      # Workflow completion stats
└── quality.json        # Code quality trends
```

## Session Tracking

Each agent session is tracked in `sessions.json`:

```json
{
  "sessions": [
    {
      "id": "session-uuid",
      "started": "2024-01-01T00:00:00Z",
      "ended": "2024-01-01T01:30:00Z",
      "duration_minutes": 90,
      "workflow": "feature",
      "spec": "specs/20240101-auth.md",
      "phases": {
        "plan": {"duration": 300, "iterations": 1},
        "build": {"duration": 2400, "iterations": 1},
        "review": {"duration": 600, "iterations": 2},
        "fix": {"duration": 900, "iterations": 1}
      },
      "outcome": "success",
      "files_changed": 12,
      "tests_added": 8,
      "coverage_delta": "+3%"
    }
  ]
}
```

## Workflow Metrics

Track workflow completion in `workflows.json`:

```json
{
  "totals": {
    "feature": {"started": 45, "completed": 42, "success_rate": 93.3},
    "bugfix": {"started": 32, "completed": 31, "success_rate": 96.9},
    "refactor": {"started": 12, "completed": 10, "success_rate": 83.3},
    "security": {"started": 5, "completed": 5, "success_rate": 100}
  },
  "this_week": {
    "sessions": 23,
    "workflows_completed": 18,
    "avg_duration_minutes": 45,
    "fix_iterations_avg": 1.8
  }
}
```

## Quality Metrics

Track code quality trends in `quality.json`:

```json
{
  "snapshots": [
    {
      "date": "2024-01-01",
      "coverage": 82,
      "tests": 234,
      "bugs_found": 3,
      "bugs_fixed": 5,
      "debt_items": 12
    }
  ],
  "trends": {
    "coverage": {"direction": "up", "delta": 3},
    "test_count": {"direction": "up", "delta": 15},
    "debt": {"direction": "down", "delta": -2}
  }
}
```

## Dashboard Command

View metrics with `/metrics`:

```
┌─────────────────────────────────────────────────────────────────┐
│                  AGENTIC LAYER METRICS                           │
├─────────────────────────────────────────────────────────────────┤
│ This Week                                                        │
│   Sessions: 23                                                   │
│   Success Rate: 87%                                              │
│   Avg Duration: 45 min                                           │
│   Fix Iterations: 1.8 avg                                        │
├─────────────────────────────────────────────────────────────────┤
│ Quality Trends                                                   │
│   Coverage: 82% ↑ (+3%)                                          │
│   Tests: 234 ↑ (+15)                                             │
│   Tech Debt: 12 ↓ (-2)                                           │
├─────────────────────────────────────────────────────────────────┤
│ Workflow Distribution                                            │
│   Feature:  ████████████░░░░ 45 (93% success)                    │
│   Bugfix:   ██████░░░░░░░░░░ 32 (97% success)                    │
│   Refactor: ███░░░░░░░░░░░░░ 12 (83% success)                    │
│   Security: █░░░░░░░░░░░░░░░  5 (100% success)                   │
└─────────────────────────────────────────────────────────────────┘
```

## Collection Points

Metrics are collected at:

1. **Session Start** (`/prime`)
   - Create new session entry
   - Record start timestamp

2. **Phase Transitions** (orchestrator)
   - Record phase duration
   - Track iterations

3. **Session End** (workflow completion)
   - Calculate total duration
   - Record outcome
   - Update aggregates

4. **Test Runs** (`test_backend`, `test_frontend`)
   - Update coverage metrics
   - Track test count changes

5. **Bug Resolution** (fixer agent)
   - Increment fix count
   - Update debt metrics

## Retention

- **Sessions**: Keep last 100
- **Snapshots**: Keep daily for 90 days
- **Aggregates**: Keep forever
