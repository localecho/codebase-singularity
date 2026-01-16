# Sandbox Skill

> Sandboxing dangerous operations with allowlists, confirmation flows, and dry-run mode.

## Purpose

This skill provides security controls for:
- Restricting commands to safe operations
- Requiring confirmation for destructive actions
- Testing operations in dry-run mode
- Isolating potentially dangerous code execution

## Command Classification

### Safety Levels

| Level | Description | Example Commands |
|-------|-------------|------------------|
| SAFE | Read-only, no side effects | `ls`, `cat`, `grep`, `find` |
| MODERATE | Local modifications, reversible | `npm install`, `git add`, `mkdir` |
| ELEVATED | System modifications | `npm publish`, `docker run`, `chmod` |
| DANGEROUS | Destructive, irreversible | `rm -rf`, `drop table`, `git push --force` |
| FORBIDDEN | Never allowed | `curl \| bash`, `eval`, `sudo rm` |

### Command Allowlist

```yaml
allowlist:
  safe:
    - ls
    - cat
    - head
    - tail
    - grep
    - find
    - pwd
    - echo
    - diff
    - wc
    - sort
    - uniq
    - git status
    - git log
    - git diff
    - git branch
    - npm list
    - npm outdated
    - node --version
    - python --version

  moderate:
    - mkdir
    - touch
    - cp
    - mv
    - git add
    - git commit
    - git checkout
    - git branch -d
    - npm install
    - npm run build
    - npm run test
    - pip install
    - python -m pytest

  elevated:
    - rm (single file only)
    - git push
    - git merge
    - npm publish --dry-run
    - docker build
    - docker run (with restrictions)
    - chmod (non-recursive)

  # These require explicit confirmation
  dangerous:
    - rm -r
    - rm -rf
    - git push --force
    - git reset --hard
    - drop table
    - truncate
    - npm publish
    - docker rm
    - docker rmi
```

### Command Blocklist

```yaml
blocklist:
  patterns:
    - "curl.*\\|.*sh"
    - "wget.*\\|.*sh"
    - "eval\\s+"
    - "sudo\\s+rm"
    - ":(){ :|:& };:"
    - "> /dev/sd"
    - "mkfs\\."
    - "dd if=.* of=/dev"

  commands:
    - sudo
    - su
    - passwd
    - chown (system directories)
    - shutdown
    - reboot
    - init
    - systemctl (dangerous operations)
```

## Confirmation Flow

### When Required

Confirmation is required for:
1. Any DANGEROUS level command
2. Operations affecting multiple files
3. Network operations to external hosts
4. Database schema modifications
5. Publishing or deployment operations

### Confirmation Request

```yaml
confirmation_request:
  timestamp: ISO-8601
  request_id: UUID
  command: string
  safety_level: elevated | dangerous
  impact_assessment:
    files_affected: string[]
    reversible: boolean
    network_access: boolean
    estimated_scope: string
  context:
    triggered_by: string
    workflow_phase: string
    previous_commands: string[]
  options:
    - approve: "Execute command"
    - deny: "Block command"
    - dry_run: "Execute in dry-run mode"
    - modify: "Modify command"
  timeout_seconds: 60
  default_action: deny
```

### Confirmation Response

```yaml
confirmation_response:
  request_id: UUID
  decision: approve | deny | dry_run | modify
  approved_by: string
  timestamp: ISO-8601
  modified_command: string (if modify)
  notes: string
```

## Dry-Run Mode

### Purpose

Dry-run mode allows testing operations without side effects:
- Validate command syntax
- Preview affected files
- Estimate impact
- Test without risk

### Enabling Dry-Run

```yaml
action: sandbox.execute
params:
  command: string
  dry_run: true
```

### Dry-Run Behavior

| Operation Type | Dry-Run Behavior |
|----------------|------------------|
| File write | Log intended write, don't modify |
| File delete | Log files that would be deleted |
| Git push | Show what would be pushed |
| npm publish | Run `--dry-run` flag |
| Database write | Log query, don't execute |
| API call | Log request, mock response |

### Dry-Run Output

```yaml
dry_run_result:
  command: string
  would_execute: boolean
  impact:
    files_created: string[]
    files_modified: string[]
    files_deleted: string[]
    network_calls: string[]
    database_operations: string[]
  warnings: string[]
  estimated_duration: string
  rollback_available: boolean
```

## Sandbox Environments

### Isolation Levels

```yaml
isolation:
  levels:
    minimal:
      filesystem: shared
      network: allowed
      processes: allowed
    standard:
      filesystem: copy-on-write
      network: localhost-only
      processes: limited
    strict:
      filesystem: isolated
      network: blocked
      processes: single
    maximum:
      filesystem: memory-only
      network: blocked
      processes: sandboxed
```

### Environment Configuration

```yaml
sandbox:
  default_level: standard

  filesystem:
    allowed_paths:
      - ${PROJECT_ROOT}
      - /tmp/sandbox-*
    blocked_paths:
      - /etc
      - /var
      - ~/.ssh
      - ~/.aws
      - ~/.config
    max_file_size_mb: 100
    max_total_size_mb: 1000

  network:
    allowed_hosts:
      - localhost
      - 127.0.0.1
      - npm.registry.org
      - github.com
    blocked_ports:
      - 22
      - 23
      - 3389
    max_connections: 10

  resources:
    max_memory_mb: 2048
    max_cpu_percent: 50
    max_execution_time_seconds: 300
    max_open_files: 100
```

## Usage

### Execute Command

```yaml
action: sandbox.execute
params:
  command: string
  working_directory: string
  environment: object
  isolation_level: minimal | standard | strict | maximum
  dry_run: boolean
  timeout_seconds: number
returns:
  exit_code: number
  stdout: string
  stderr: string
  execution_time_ms: number
  resources_used:
    memory_mb: number
    cpu_seconds: number
    files_accessed: string[]
```

### Check Command Safety

```yaml
action: sandbox.check
params:
  command: string
returns:
  allowed: boolean
  safety_level: safe | moderate | elevated | dangerous | forbidden
  requires_confirmation: boolean
  blocked_reason: string (if not allowed)
  suggested_alternative: string (if blocked)
```

### Request Confirmation

```yaml
action: sandbox.confirm
params:
  command: string
  context: object
  timeout_seconds: number
returns:
  approved: boolean
  decision: approve | deny | dry_run | modify
  modified_command: string
```

## Integration Points

### With Orchestrator

```yaml
orchestrator_integration:
  - validate_commands_before_execution
  - apply_isolation_per_phase
  - enforce_confirmation_for_dangerous
  - log_all_executions
```

### With Audit Logging

All sandbox operations are logged:
- Command classification
- Execution attempts
- Confirmation requests/responses
- Dry-run results
- Security violations

### With Rate Limiting

Sandbox respects rate limits:
- Command execution counts
- Resource usage limits
- Time limits per command

## Security Policies

### Default Policy

```yaml
policy:
  name: default

  rules:
    - name: block_forbidden
      condition: safety_level == forbidden
      action: block

    - name: confirm_dangerous
      condition: safety_level == dangerous
      action: require_confirmation

    - name: log_elevated
      condition: safety_level == elevated
      action: log_and_allow

    - name: allow_safe
      condition: safety_level in [safe, moderate]
      action: allow
```

### Strict Policy

```yaml
policy:
  name: strict

  rules:
    - name: block_elevated_and_above
      condition: safety_level in [elevated, dangerous, forbidden]
      action: block

    - name: confirm_moderate
      condition: safety_level == moderate
      action: require_confirmation

    - name: allow_only_safe
      condition: safety_level == safe
      action: allow
```

## Error Handling

### Command Blocked Error

```yaml
error:
  type: CommandBlocked
  code: SANDBOX_001
  message: "Command blocked by security policy"
  details:
    command: string
    safety_level: string
    policy: string
    reason: string
  recovery:
    - use_alternative_command
    - request_policy_exception
    - use_dry_run_mode
```

### Confirmation Denied Error

```yaml
error:
  type: ConfirmationDenied
  code: SANDBOX_002
  message: "Command execution denied"
  details:
    command: string
    denied_by: string
    reason: string
  recovery:
    - modify_command
    - use_dry_run_mode
    - abort_operation
```

### Sandbox Violation Error

```yaml
error:
  type: SandboxViolation
  code: SANDBOX_003
  message: "Operation violated sandbox constraints"
  details:
    violation_type: filesystem | network | resource
    attempted_action: string
    constraint: string
  recovery:
    - adjust_sandbox_level
    - modify_operation
    - abort_operation
```

## Best Practices

1. **Principle of Least Privilege**: Only grant permissions needed for the task
2. **Default Deny**: Block by default, allow explicitly
3. **Audit Everything**: Log all command executions and decisions
4. **Dry-Run First**: Test dangerous operations in dry-run mode
5. **Human Oversight**: Require confirmation for irreversible actions
6. **Fail Secure**: On error, default to blocking the operation

## Configuration Example

```yaml
# sandbox.yaml
version: "1.0"
environment: production

policy: default

allowlist_extensions:
  - npm run lint
  - npm run format
  - prettier --write

blocklist_extensions:
  - "rm -rf /"
  - "rm -rf ~"

isolation:
  default_level: standard
  strict_for:
    - npm publish
    - git push
    - docker

confirmation:
  timeout_seconds: 60
  default_action: deny
  required_for:
    - dangerous
    - elevated (if multiple files)

dry_run:
  auto_enable_for:
    - first execution of command
    - commands affecting > 10 files

logging:
  level: verbose
  include_command_output: true
  redact_secrets: true
```

---

*This skill ensures safe command execution with appropriate security controls.*
