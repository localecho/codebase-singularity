# Audit Logging Skill

> Comprehensive audit logging for all agent actions with tamper-evident format.

## Purpose

This skill provides a complete audit trail of all agent operations, ensuring:
- Full transparency of agent actions
- Explainability through reasoning logs
- Tamper-evident integrity verification
- Compliance with security requirements

## Log Categories

### 1. Agent Invocations

All agent activations are logged with:

```yaml
invocation:
  timestamp: ISO-8601 datetime
  session_id: UUID
  agent_id: string
  command: string
  arguments: object
  user_context: string
  entry_point: string  # skill, command, or orchestrator
```

### 2. File Modifications

Every file change is captured:

```yaml
file_modification:
  timestamp: ISO-8601 datetime
  session_id: UUID
  operation: create | update | delete | rename
  file_path: string
  previous_hash: SHA-256 (for updates/deletes)
  new_hash: SHA-256 (for creates/updates)
  diff_summary: string
  lines_added: number
  lines_removed: number
  triggered_by: invocation_id
```

### 3. Reasoning Logs

For explainability, all decisions are documented:

```yaml
reasoning:
  timestamp: ISO-8601 datetime
  session_id: UUID
  invocation_id: UUID
  phase: planning | execution | validation | correction
  decision: string
  alternatives_considered: string[]
  rationale: string
  confidence: 0.0-1.0
  context_files: string[]
```

## Tamper-Evident Format

### Log Chain Structure

Each log entry includes integrity verification:

```yaml
log_entry:
  sequence_number: integer  # Monotonically increasing
  timestamp: ISO-8601 datetime
  entry_type: invocation | file_modification | reasoning
  data: object  # The actual log data
  previous_hash: SHA-256  # Hash of previous entry
  entry_hash: SHA-256  # Hash of this entry (excluding this field)
  signature: HMAC-SHA256  # Signed with session key
```

### Chain Verification

```
Entry N Hash = SHA256(
  sequence_number +
  timestamp +
  entry_type +
  JSON(data) +
  previous_hash
)

Entry N Signature = HMAC-SHA256(
  Entry N Hash,
  session_key
)
```

### Genesis Entry

First entry in each session:

```yaml
genesis:
  sequence_number: 0
  timestamp: session_start_time
  entry_type: genesis
  data:
    session_id: UUID
    session_key_hash: SHA-256  # Hash of session key (not the key itself)
    agent_version: string
    environment_hash: SHA-256  # Hash of environment config
  previous_hash: "0000000000000000000000000000000000000000000000000000000000000000"
```

## Log Storage

### File Structure

```
logs/
  audit/
    YYYYMMDD/
      session-{UUID}.jsonl      # JSON Lines format
      session-{UUID}.jsonl.sig  # Detached signature
    integrity/
      daily-checkpoint-YYYYMMDD.json  # Daily chain verification
```

### Retention Policy

| Log Type | Retention | Archive |
|----------|-----------|---------|
| Invocations | 90 days | 1 year |
| File Modifications | 90 days | 1 year |
| Reasoning | 30 days | 6 months |
| Integrity Checkpoints | Forever | N/A |

## Usage

### Starting an Audit Session

```yaml
action: audit.start_session
config:
  log_level: full | summary | minimal
  reasoning_capture: true | false
  file_diff_capture: true | false
```

### Logging an Action

```yaml
action: audit.log
entry:
  type: invocation | file_modification | reasoning
  data: <entry-specific-data>
```

### Verifying Chain Integrity

```yaml
action: audit.verify
params:
  session_id: UUID
  from_sequence: integer (optional)
  to_sequence: integer (optional)
```

### Querying Logs

```yaml
action: audit.query
filters:
  session_id: UUID (optional)
  time_range:
    start: ISO-8601
    end: ISO-8601
  entry_types: string[]
  file_paths: glob pattern (optional)
output:
  format: json | csv | human-readable
  include_signatures: boolean
```

## Integration Points

### With Orchestrator

The orchestrator automatically:
1. Starts audit session at workflow begin
2. Logs each phase transition
3. Captures all tool invocations
4. Records final outcome and reasoning

### With Code Review

Code review skill:
1. Receives audit context for review
2. Can query modification history
3. Validates changes against audit trail

### With Rate Limiting

Rate limiter:
1. Logs all limit checks
2. Records limit breach events
3. Captures human approval decisions

## Security Considerations

### Access Control

- Audit logs are append-only
- No delete or modify operations on existing entries
- Read access requires audit.read permission
- Chain verification requires audit.verify permission

### Key Management

- Session keys are generated at session start
- Keys are stored in secure memory only
- Key hashes are logged, not keys themselves
- Keys are destroyed at session end

### Anomaly Detection

Monitor for:
- Sequence gaps
- Timestamp inconsistencies
- Hash chain breaks
- Unusual operation patterns

## Example Log Entries

### Agent Invocation

```json
{
  "sequence_number": 42,
  "timestamp": "2024-01-15T10:30:45.123Z",
  "entry_type": "invocation",
  "data": {
    "invocation": {
      "timestamp": "2024-01-15T10:30:45.123Z",
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "agent_id": "orchestrator",
      "command": "build",
      "arguments": {"spec": "specs/20240115-new-feature.md"},
      "user_context": "Implement new feature per spec",
      "entry_point": "skill"
    }
  },
  "previous_hash": "a1b2c3d4...",
  "entry_hash": "e5f6g7h8...",
  "signature": "i9j0k1l2..."
}
```

### File Modification

```json
{
  "sequence_number": 43,
  "timestamp": "2024-01-15T10:30:46.456Z",
  "entry_type": "file_modification",
  "data": {
    "file_modification": {
      "timestamp": "2024-01-15T10:30:46.456Z",
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "operation": "update",
      "file_path": "src/components/Feature.tsx",
      "previous_hash": "abc123...",
      "new_hash": "def456...",
      "diff_summary": "Added error handling for edge case",
      "lines_added": 15,
      "lines_removed": 3,
      "triggered_by": "inv-42"
    }
  },
  "previous_hash": "e5f6g7h8...",
  "entry_hash": "m3n4o5p6...",
  "signature": "q7r8s9t0..."
}
```

### Reasoning Entry

```json
{
  "sequence_number": 44,
  "timestamp": "2024-01-15T10:30:47.789Z",
  "entry_type": "reasoning",
  "data": {
    "reasoning": {
      "timestamp": "2024-01-15T10:30:47.789Z",
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "invocation_id": "inv-42",
      "phase": "execution",
      "decision": "Use try-catch wrapper for API calls",
      "alternatives_considered": [
        "Error boundary component",
        "Global error handler",
        "Inline error checks"
      ],
      "rationale": "Try-catch provides granular error handling per API call with type-safe error objects",
      "confidence": 0.85,
      "context_files": ["src/api/client.ts", "src/types/errors.ts"]
    }
  },
  "previous_hash": "m3n4o5p6...",
  "entry_hash": "u1v2w3x4...",
  "signature": "y5z6a7b8..."
}
```

---

*This skill ensures complete auditability and explainability of all agent operations.*
