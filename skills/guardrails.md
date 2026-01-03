---
name: guardrails
description: Output validation and safety guardrails for agent outputs
triggers:
  - validate output
  - check safety
  - guardrail check
---

# Skill: Output Validation & Guardrails

## Overview

Production safety controls for validating agent outputs before execution.

---

## Guardrail Layers

```
┌─────────────────────────────────────────────────┐
│              GUARDRAIL PIPELINE                 │
│                                                 │
│   Agent Output                                  │
│        │                                        │
│        ▼                                        │
│   ┌─────────────────────────────────────┐      │
│   │ Layer 1: Schema Validation          │      │
│   │ - JSON structure                     │      │
│   │ - Required fields                    │      │
│   └─────────────────────────────────────┘      │
│        │                                        │
│        ▼                                        │
│   ┌─────────────────────────────────────┐      │
│   │ Layer 2: Safety Filters             │      │
│   │ - Content safety                     │      │
│   │ - No harmful code                    │      │
│   └─────────────────────────────────────┘      │
│        │                                        │
│        ▼                                        │
│   ┌─────────────────────────────────────┐      │
│   │ Layer 3: Quality Gates              │      │
│   │ - Hallucination check               │      │
│   │ - Confidence scoring                 │      │
│   └─────────────────────────────────────┘      │
│        │                                        │
│        ▼                                        │
│   ┌─────────────────────────────────────┐      │
│   │ Layer 4: Business Rules             │      │
│   │ - Custom validations                 │      │
│   │ - Policy compliance                  │      │
│   └─────────────────────────────────────┘      │
│        │                                        │
│        ▼                                        │
│   Validated Output ✓                            │
└─────────────────────────────────────────────────┘
```

---

## Schema Validation

### Output Schemas

```yaml
schemas:
  code_output:
    type: object
    required:
      - file_path
      - content
      - action  # create, modify, delete
    properties:
      file_path:
        type: string
        pattern: "^[a-zA-Z0-9_/.-]+$"
      content:
        type: string
        maxLength: 100000
      action:
        enum: [create, modify, delete]

  review_output:
    type: object
    required:
      - status
      - issues
    properties:
      status:
        enum: [approved, changes_required, blocked]
      issues:
        type: array
        items:
          type: object
          properties:
            severity: enum[critical, high, medium, low]
            description: string
```

---

## Safety Filters

### Dangerous Patterns

```yaml
blocked_patterns:
  # System commands
  - pattern: "rm -rf /"
    severity: critical
    action: block

  - pattern: "sudo"
    severity: high
    action: warn

  # Secrets
  - pattern: "password\\s*=\\s*[\"'][^\"']+[\"']"
    severity: critical
    action: block

  - pattern: "api[_-]?key\\s*=\\s*[\"'][^\"']+[\"']"
    severity: critical
    action: block

  # Network
  - pattern: "curl.*\\|.*sh"
    severity: critical
    action: block
```

### File Safety

```yaml
file_restrictions:
  # Protected paths
  never_modify:
    - "/.env"
    - "/credentials"
    - "/.git/"
    - "/node_modules/"

  # Require confirmation
  confirm_before_modify:
    - "package.json"
    - "*.config.*"
    - "Dockerfile"
```

---

## Quality Gates

### Hallucination Detection

```yaml
hallucination_checks:
  # File references
  verify_file_exists:
    enabled: true
    action: warn

  # Import validation
  verify_imports:
    enabled: true
    action: warn

  # Function calls
  verify_function_exists:
    enabled: true
    action: warn
```

### Confidence Scoring

```yaml
confidence:
  thresholds:
    high: 0.9      # Auto-execute
    medium: 0.7    # Execute with logging
    low: 0.5       # Require confirmation
    very_low: 0.3  # Block and escalate

  factors:
    - output_coherence
    - schema_match
    - pattern_safety
    - reference_validity
```

---

## Escalation

### Human-in-the-Loop

```yaml
escalation_triggers:
  - confidence < 0.5
  - security_risk_detected
  - breaking_change_detected
  - cost > $1.00 per action

escalation_format:
  title: "Agent Action Requires Approval"
  context: |
    The agent wants to perform an action that
    triggered escalation rules.
  action_preview: "..."
  options:
    - approve
    - modify
    - reject
```

---

## Audit Trail

### Logged Events

```yaml
audit_log:
  - timestamp
  - agent_id
  - action_type
  - input_hash
  - output_hash
  - guardrail_results
  - final_decision
  - human_override (if any)
```

---

*Safety-first output validation for production agents.*
