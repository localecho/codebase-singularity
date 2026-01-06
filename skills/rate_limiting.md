# Rate Limiting Skill

> Configurable iteration limits and controls to prevent infinite loops and runaway operations.

## Purpose

This skill prevents agent operations from:
- Running indefinitely in fix loops
- Consuming excessive resources
- Making unbounded API calls
- Operating without human oversight

## Configuration

### Global Limits

```yaml
rate_limits:
  global:
    max_iterations_per_workflow: 50
    max_file_modifications_per_session: 100
    max_api_calls_per_minute: 60
    max_session_duration_minutes: 120
    max_tokens_per_session: 500000
```

### Per-Operation Limits

```yaml
rate_limits:
  operations:
    build:
      max_iterations: 10
      timeout_minutes: 30
    review:
      max_iterations: 5
      timeout_minutes: 15
    fix:
      max_iterations: 15
      timeout_minutes: 45
    test:
      max_iterations: 10
      timeout_minutes: 30
```

### Fix Loop Specific Limits

```yaml
rate_limits:
  fix_loops:
    max_consecutive_failures: 3
    max_same_error_attempts: 2
    backoff_strategy: exponential
    initial_backoff_seconds: 5
    max_backoff_seconds: 300
    require_human_after_failures: 3
```

## Limit Types

### 1. Iteration Limits

Control how many times an operation can repeat:

| Operation | Default Max | Hard Cap |
|-----------|-------------|----------|
| Build cycle | 10 | 25 |
| Fix attempt | 15 | 30 |
| Review pass | 5 | 10 |
| Test run | 10 | 20 |
| Full workflow | 50 | 100 |

### 2. Time Limits

Maximum duration for operations:

| Scope | Default | Hard Cap |
|-------|---------|----------|
| Single operation | 30 min | 60 min |
| Full workflow | 2 hours | 4 hours |
| Session | 4 hours | 8 hours |

### 3. Resource Limits

Prevent resource exhaustion:

| Resource | Default Limit | Per |
|----------|--------------|-----|
| API calls | 60 | minute |
| File writes | 100 | session |
| Token usage | 500K | session |
| Memory | 4GB | process |

## Alert Mechanisms

### Warning Thresholds

Alerts are triggered at configurable thresholds:

```yaml
alerts:
  thresholds:
    warning: 0.75  # 75% of limit
    critical: 0.90  # 90% of limit
    blocked: 1.0    # 100% of limit
```

### Alert Actions

```yaml
alerts:
  actions:
    warning:
      - log_warning
      - notify_user
    critical:
      - log_critical
      - notify_user
      - slow_down_operations
    blocked:
      - log_blocked
      - notify_user
      - pause_operations
      - request_human_approval
```

### Alert Format

```yaml
alert:
  timestamp: ISO-8601
  level: warning | critical | blocked
  limit_type: iteration | time | resource
  limit_name: string
  current_value: number
  limit_value: number
  percentage: number
  session_id: UUID
  operation: string
  recommendation: string
```

## Human Approval Flow

### When Required

Human approval is required when:
1. Any hard limit is reached
2. Same error occurs multiple times
3. Fix loop exceeds threshold
4. Unusual operation patterns detected

### Approval Request

```yaml
approval_request:
  timestamp: ISO-8601
  session_id: UUID
  request_id: UUID
  reason: string
  context:
    operation: string
    current_iteration: number
    max_iteration: number
    recent_errors: string[]
    files_modified: string[]
  options:
    - continue: "Allow N more iterations"
    - abort: "Stop operation"
    - skip: "Skip this step"
    - modify: "Modify approach"
  timeout_minutes: 30
  default_action: abort
```

### Approval Response

```yaml
approval_response:
  request_id: UUID
  decision: continue | abort | skip | modify
  approved_by: string
  timestamp: ISO-8601
  additional_iterations: number (if continue)
  notes: string
```

## State Machine

### Operation States

```
+-------------------------------------------------------------+
|                                                             |
|   +------+    +---------+    +---------+    +----------+   |
|   | INIT |--->| RUNNING |--->| WARNING |--->| CRITICAL |   |
|   +------+    +----+----+    +----+----+    +----+-----+   |
|                    |              |               |         |
|                    |              |               v         |
|                    |              |         +----------+    |
|                    |              |         | BLOCKED  |    |
|                    |              |         +----+-----+    |
|                    |              |              |          |
|                    v              v              v          |
|               +------------------------------------+        |
|               |         AWAITING_APPROVAL          |        |
|               +----------------+-------------------+        |
|                                |                            |
|          +---------------------+---------------------+      |
|          v                     v                     v      |
|   +-----------+         +-----------+         +----------+ |
|   | CONTINUED |         |  ABORTED  |         | MODIFIED | |
|   +-----------+         +-----------+         +----------+ |
|                                                             |
+-------------------------------------------------------------+
```

## Usage

### Check Limit

```yaml
action: rate_limit.check
params:
  operation: string
  limit_type: iteration | time | resource
returns:
  allowed: boolean
  current: number
  limit: number
  remaining: number
  status: ok | warning | critical | blocked
```

### Increment Counter

```yaml
action: rate_limit.increment
params:
  operation: string
  limit_type: iteration | time | resource
  amount: number (default: 1)
returns:
  new_value: number
  status: ok | warning | critical | blocked
  alert: alert object (if threshold crossed)
```

### Request Approval

```yaml
action: rate_limit.request_approval
params:
  reason: string
  context: object
  options: string[]
returns:
  request_id: UUID
  status: pending | approved | denied | timeout
```

### Reset Limits

```yaml
action: rate_limit.reset
params:
  scope: operation | session | all
  operation: string (if scope is operation)
requires: admin permission
```

## Integration Points

### With Orchestrator

```yaml
orchestrator_integration:
  - check_limits_before_phase
  - increment_on_phase_complete
  - pause_on_limit_reached
  - resume_on_approval
```

### With Audit Logging

All rate limit events are logged:
- Limit checks
- Threshold crossings
- Approval requests
- Approval decisions
- Limit resets

### With Sandbox

Rate limits apply to sandboxed operations:
- Command execution counts
- Resource usage tracking
- Time limits per command

## Error Handling

### Limit Exceeded Error

```yaml
error:
  type: RateLimitExceeded
  code: RATE_001
  message: "Operation limit exceeded"
  details:
    operation: string
    limit_type: string
    current: number
    limit: number
  recovery:
    - request_approval
    - abort_operation
    - wait_and_retry
```

### Approval Timeout Error

```yaml
error:
  type: ApprovalTimeout
  code: RATE_002
  message: "Human approval timed out"
  details:
    request_id: UUID
    timeout_minutes: number
  recovery:
    - retry_request
    - abort_operation
```

## Best Practices

1. **Set Conservative Defaults**: Start with lower limits and increase based on need
2. **Monitor Patterns**: Watch for operations that consistently hit limits
3. **Log Everything**: All limit events should be audited
4. **Human in the Loop**: Always require human approval for extended operations
5. **Graceful Degradation**: Operations should fail safely when limits hit

## Configuration Example

```yaml
# rate_limits.yaml
version: "1.0"
environment: production

limits:
  workflow:
    orchestrate:
      max_iterations: 50
      timeout_minutes: 120
    quick:
      max_iterations: 20
      timeout_minutes: 60

  fix_loop:
    max_attempts: 15
    same_error_limit: 2
    require_approval_after: 10

  resources:
    api_calls_per_minute: 60
    file_writes_per_session: 100
    tokens_per_session: 500000

alerts:
  warning_threshold: 0.75
  critical_threshold: 0.90
  notification_channels:
    - console
    - audit_log

approval:
  timeout_minutes: 30
  default_action: abort
  require_reason: true
```

---

*This skill ensures safe, bounded agent operations with human oversight.*
