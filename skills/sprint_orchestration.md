---
name: sprint_orchestration
description: Advanced multi-agent orchestration patterns for sprint execution
triggers:
  - run sprint
  - process issues
  - parallel sprint
---

# Skill: Sprint Orchestration

## Overview

This skill implements advanced multi-agent patterns for processing GitHub issues at scale.

Based on production patterns from multi-agent Claude systems.

---

## Agent Fleet

### Specialized Agents

| Agent Type | Role | Specialization |
|------------|------|----------------|
| **Planner** | Creates specs from issues | Requirements analysis, design |
| **Builder** | Implements code | Code generation, testing |
| **Reviewer** | Validates code quality | Security, style, correctness |
| **Fixer** | Resolves issues | Debugging, refactoring |

### Agent Capabilities

```yaml
planner_agent:
  processing_speed: 0.8  # tasks/minute
  quality_score: 0.95
  token_efficiency: 0.85
  parallel_capacity: 3

builder_agent:
  processing_speed: 0.5
  quality_score: 0.90
  token_efficiency: 0.75
  parallel_capacity: 2

reviewer_agent:
  processing_speed: 1.2
  quality_score: 0.98
  token_efficiency: 0.90
  parallel_capacity: 5

fixer_agent:
  processing_speed: 0.6
  quality_score: 0.92
  token_efficiency: 0.80
  parallel_capacity: 3
```

---

## Orchestration Patterns

### 1. Orchestrator-Worker Pattern

Best for: Independent issues that don't conflict

```
┌──────────────────────────────────────────────────┐
│              ORCHESTRATOR                        │
│  ┌─────────────────────────────────────────┐    │
│  │  1. Parse issue range                   │    │
│  │  2. Analyze dependencies                │    │
│  │  3. Assign to worker agents             │    │
│  │  4. Aggregate results                   │    │
│  └─────────────────────────────────────────┘    │
│                    │                             │
│     ┌──────────────┼──────────────┐             │
│     ▼              ▼              ▼             │
│  ┌──────┐     ┌──────┐      ┌──────┐           │
│  │Worker│     │Worker│      │Worker│           │
│  │  #1  │     │  #2  │      │  #3  │           │
│  └──────┘     └──────┘      └──────┘           │
│     │              │              │             │
│     ▼              ▼              ▼             │
│   PR #A          PR #B          PR #C          │
└──────────────────────────────────────────────────┘
```

### 2. Map-Reduce Pattern

Best for: Issues that share common analysis

```
MAP PHASE:
  Issue #1 → [analyze, plan, implement] → Result 1
  Issue #2 → [analyze, plan, implement] → Result 2
  Issue #3 → [analyze, plan, implement] → Result 3

REDUCE PHASE:
  [Result 1, Result 2, Result 3] → Sprint Report
```

### 3. Swarm Intelligence Pattern

Best for: Complex sprints with interdependencies

```
┌────────────────────────────────────────────────┐
│           SWARM INTELLIGENCE                   │
│                                                │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │Agent1│──│Agent2│──│Agent3│──│Agent4│      │
│  └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘      │
│     │         │         │         │           │
│     └────────┬┴─────────┴─────────┘           │
│              │                                 │
│        ┌─────▼─────┐                          │
│        │  Shared   │                          │
│        │  Context  │                          │
│        └───────────┘                          │
│                                                │
│  Features:                                     │
│  - Self-organizing clusters                   │
│  - Adaptive load balancing                    │
│  - Collective learning                        │
│  - Failure recovery                           │
└────────────────────────────────────────────────┘
```

---

## Conflict Detection

Before parallel execution, check for conflicts:

```python
def detect_conflicts(issues):
    file_touches = {}
    for issue in issues:
        predicted_files = analyze_issue_scope(issue)
        for file in predicted_files:
            if file in file_touches:
                return True  # Conflict detected
            file_touches[file] = issue.number
    return False  # Safe for parallel
```

### Conflict Resolution

1. **Sequential fallback**: Process conflicting issues in order
2. **Merge strategy**: Combine changes intelligently
3. **Rebase flow**: Apply changes on top of each other

---

## Performance Optimization

### Token Efficiency

```yaml
optimization_strategies:
  - cache_common_context: true
  - compress_long_issues: true
  - batch_similar_tasks: true
  - reuse_analysis: true
```

### Parallel Speedup

| Issues | Sequential | Parallel | Speedup |
|--------|------------|----------|---------|
| 3 | 15min | 6min | 2.5x |
| 5 | 25min | 8min | 3.1x |
| 10 | 50min | 12min | 4.2x |

### Self-Healing

```
IF agent_failure:
    1. Log failure to app_reviews/bugs/
    2. Reassign task to backup agent
    3. Continue with remaining issues
    4. Report partial completion
```

---

## Integration Points

### With Orchestrator

```bash
# Sprint calls orchestrator for each issue
/orchestrate "Issue #N: {title}" full
```

### With Feedback Loops

```bash
# Each issue goes through validation
/code_review --files=changed
/test_backend --scope=affected
```

### With Metrics

```yaml
# Track in metrics/sprints/
sprint_id: SPRINT-20240101
issues_processed: 5
parallel_agents: 3
total_tokens: 45000
execution_time: 720s
success_rate: 100%
```

---

## Usage Examples

### Basic Sprint

```
/sprint 1-5
```

### Parallel Sprint

```
/sprint 1-10 --parallel
```

### Sprint with Specific Repo

```
/sprint 1-5 localecho/codebase-singularity
```

### Resume Failed Sprint

```
/sprint --resume SPRINT-20240101
```

---

*Advanced multi-agent orchestration for maximum sprint velocity.*
