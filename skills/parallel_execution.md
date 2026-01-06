---
name: parallel_execution
description: Parallel agent execution for independent tasks with progress visualization
triggers:
  - parallel agents
  - concurrent execution
  - parallel tasks
---

# Skill: Parallel Agent Execution

## Overview

Identify parallelizable steps in workflows and execute independent tasks concurrently. Display real-time progress for parallel operations to maximize throughput while maintaining visibility.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                 PARALLEL EXECUTION ENGINE                        │
│                                                                  │
│   Task Queue                                                     │
│   [Task1] [Task2] [Task3] [Task4] [Task5]                       │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              DEPENDENCY ANALYZER                         │   │
│   │  - Build dependency graph                                │   │
│   │  - Identify independent tasks                            │   │
│   │  - Detect resource conflicts                             │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              PARALLELIZATION PLANNER                     │   │
│   │                                                          │   │
│   │   Wave 1: [Task1, Task2, Task3]  ←── No dependencies    │   │
│   │   Wave 2: [Task4]                 ←── Depends on T1,T2  │   │
│   │   Wave 3: [Task5]                 ←── Depends on T4     │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                         │
│        ▼                                                         │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              CONCURRENT EXECUTOR                         │   │
│   │                                                          │   │
│   │   ┌─────────┐  ┌─────────┐  ┌─────────┐                 │   │
│   │   │ Agent 1 │  │ Agent 2 │  │ Agent 3 │                 │   │
│   │   │  Task1  │  │  Task2  │  │  Task3  │                 │   │
│   │   │ [====] │  │ [==  ] │  │ [===] │                 │   │
│   │   └─────────┘  └─────────┘  └─────────┘                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│        │                                                         │
│        ▼                                                         │
│   Aggregated Results                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Task Dependency Analysis

### Dependency Graph

```yaml
dependency_detection:
  file_based:
    description: Tasks touching same files cannot run in parallel
    detection: analyze_file_scope(task)

  resource_based:
    description: Tasks using same resources (DB, API) may conflict
    detection: analyze_resource_usage(task)

  order_based:
    description: Some tasks have explicit ordering requirements
    detection: check_explicit_dependencies(task)
```

### Dependency Graph Example

```
Task Dependency Graph:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [Plan Auth]─────┐
                  ├───► [Build Auth]───► [Review Auth]
  [Plan API]──────┘           │
                              │
  [Plan UI]───────────────────┼───► [Build UI]───► [Review UI]
                              │
  [Plan Tests]────────────────┴───► [Build Tests]

Parallel Groups:
  Group 1: [Plan Auth, Plan API, Plan UI, Plan Tests]
  Group 2: [Build Auth, Build UI, Build Tests]
  Group 3: [Review Auth, Review UI]
```

### Conflict Detection

```python
def detect_parallel_conflicts(tasks):
    """Identify tasks that cannot run in parallel."""
    conflicts = []

    for i, task_a in enumerate(tasks):
        for task_b in tasks[i+1:]:
            # Check file conflicts
            files_a = predict_files_touched(task_a)
            files_b = predict_files_touched(task_b)

            if files_a & files_b:  # Intersection
                conflicts.append({
                    "tasks": [task_a.id, task_b.id],
                    "reason": "file_conflict",
                    "files": list(files_a & files_b)
                })

            # Check resource conflicts
            if uses_same_db_table(task_a, task_b):
                conflicts.append({
                    "tasks": [task_a.id, task_b.id],
                    "reason": "resource_conflict",
                    "resource": "database"
                })

    return conflicts
```

---

## Parallelization Strategies

### Wave-Based Execution

```yaml
wave_execution:
  description: Execute tasks in waves based on dependencies

  algorithm:
    1. Build dependency graph
    2. Find all tasks with no dependencies (Wave 1)
    3. Execute Wave 1 in parallel
    4. Find tasks whose dependencies are satisfied (Wave 2)
    5. Execute Wave 2 in parallel
    6. Repeat until all tasks complete

  example:
    wave_1:
      tasks: [plan_auth, plan_api, plan_db]
      parallel: true
      estimated_time: 3min

    wave_2:
      tasks: [build_auth, build_api, build_db]
      parallel: true
      estimated_time: 8min

    wave_3:
      tasks: [review_all, test_all]
      parallel: true
      estimated_time: 5min
```

### Pipeline Execution

```yaml
pipeline_execution:
  description: Stream tasks through stages as soon as ready

  stages:
    - name: planning
      capacity: 4
    - name: building
      capacity: 2
    - name: reviewing
      capacity: 3

  flow: |
    Task enters planning → completes → immediately enters building
    No waiting for other tasks in same stage
```

### Adaptive Concurrency

```yaml
adaptive_concurrency:
  description: Adjust parallelism based on system load

  factors:
    - api_rate_limits: true
    - memory_usage: true
    - token_budget: true

  scaling:
    min_agents: 1
    max_agents: 5
    scale_up_threshold: 0.5  # utilization
    scale_down_threshold: 0.2
```

---

## Parallel Progress Display

### Real-Time Progress View

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    PARALLEL EXECUTION PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Wave 2 of 3 | 3 agents active | Est. remaining: 4m 30s

  ┌─────────────────────────────────────────────────────────────┐
  │ Agent 1: Build Auth Module                                  │
  │ [████████████████████░░░░░░░░░░░░░░░░░░░░] 52%              │
  │ Status: Implementing login service...                       │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ Agent 2: Build API Layer                                    │
  │ [████████████████████████████░░░░░░░░░░░░] 72%              │
  │ Status: Writing endpoint handlers...                        │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │ Agent 3: Build Database Schema                              │
  │ [██████████████████████████████████░░░░░░] 85%              │
  │ Status: Creating migrations...                              │
  └─────────────────────────────────────────────────────────────┘

  Completed: [Plan Auth] [Plan API] [Plan DB]
  Pending:   [Review All] [Test All]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Compact Progress View

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PARALLEL PROGRESS | Wave 2/3 | 3 active
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [1] Build Auth    [████████░░░░░░░░] 52%
  [2] Build API     [███████████░░░░░] 72%
  [3] Build DB      [█████████████░░░] 85%

  Done: 3 | Running: 3 | Pending: 2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Timeline View

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    EXECUTION TIMELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Time:    0m      2m      4m      6m      8m      10m
           │       │       │       │       │       │
  Agent 1: [==Plan Auth==][====Build Auth====]
  Agent 2: [==Plan API===][=====Build API=====]
  Agent 3: [===Plan DB===][===Build DB===]
  Agent 4:                                [==Review==]

  Current: ────────────────────█

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Execution Modes

### Sprint Parallel Mode

```bash
# Process multiple issues in parallel
/sprint 1-5 --parallel

# With concurrency limit
/sprint 1-10 --parallel --max-agents 3
```

### Orchestrate Parallel Mode

```bash
# Run planning steps in parallel
/orchestrate "feature" full --parallel-planning

# Run reviews in parallel
/orchestrate "feature" full --parallel-review
```

---

## Error Handling

### Failure Isolation

```yaml
failure_handling:
  isolation: true

  on_agent_failure:
    1. Log error with context
    2. Mark task as failed
    3. Continue other parallel tasks
    4. Retry failed task (up to 3 times)
    5. Report partial completion

  rollback_strategy:
    partial_success: keep_completed
    critical_failure: rollback_all
```

### Recovery Flow

```
Agent 2 Failure:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  [1] Build Auth    [████████████████] 100% DONE
  [2] Build API     [████████░░░░░░░░] 48%  FAILED
  [3] Build DB      [████████████████] 100% DONE

  Recovery:
    - Task 2 will retry (attempt 2/3)
    - Agents 1,3 continuing to next wave
    - Results preserved for completed tasks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Performance Metrics

### Speedup Calculation

```yaml
performance_metrics:
  sequential_time: 25min
  parallel_time: 8min
  speedup: 3.1x
  efficiency: 78%

  breakdown:
    planning_phase:
      sequential: 9min
      parallel: 3min
      speedup: 3x

    building_phase:
      sequential: 12min
      parallel: 4min
      speedup: 3x

    review_phase:
      sequential: 4min
      parallel: 1min
      speedup: 4x
```

### Efficiency Dashboard

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         PARALLEL EFFICIENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Theoretical Max Speedup: 5x
  Achieved Speedup:        3.1x
  Efficiency:              62%

  Bottlenecks:
    - Dependencies:        25%
    - API Rate Limits:     10%
    - Merge Conflicts:     3%

  Agent Utilization:
    [█████████████████░░░] 85%

  Recommendations:
    - Reduce cross-task dependencies
    - Split large tasks for parallelism

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Configuration

```yaml
# config/parallel_execution.yaml
parallel_execution:
  enabled: true

  concurrency:
    default_max_agents: 3
    max_agents_limit: 5
    adaptive: true

  scheduling:
    strategy: wave_based
    priority_factors:
      - critical_path
      - resource_availability
      - estimated_duration

  progress:
    display_mode: detailed  # compact, detailed, timeline
    refresh_rate_ms: 500
    show_estimates: true

  failure_handling:
    max_retries: 3
    retry_delay_ms: 1000
    isolation: true

  rate_limiting:
    respect_api_limits: true
    token_budget_aware: true
```

---

## Integration

### With Sprint

```yaml
sprint_integration:
  parallel_issues: true

  parallelization:
    independent_issues: true
    conflicting_issues: sequential

  progress:
    show_per_issue: true
    aggregate_status: true
```

### With Orchestrate

```yaml
orchestrate_integration:
  parallel_phases:
    planning: true      # Multiple plans can run in parallel
    building: limited   # Limited by file conflicts
    reviewing: true     # Independent reviews in parallel
    fixing: limited     # May have dependencies
```

---

*Maximum throughput through intelligent parallel execution.*
