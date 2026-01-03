---
name: cot_logging
description: Chain-of-thought logging for debugging and audit
triggers:
  - log reasoning
  - debug thoughts
  - trace decision
---

# Skill: Chain-of-Thought Logging

## Overview

Capture and store agent reasoning for debugging, audit, and improvement.

---

## Trace Structure

```yaml
trace:
  id: trace_abc123
  timestamp: 2024-01-02T10:30:00Z
  workflow: orchestrate
  phase: BUILD

  reasoning_steps:
    - step: 1
      type: observation
      content: "Issue #64 requires LLM provider abstraction"
      confidence: 0.95

    - step: 2
      type: hypothesis
      content: "Need to create skills/llm_provider.md"
      alternatives:
        - "Could modify existing skill"
        - "Could create separate files per provider"
      chosen_reason: "Single file more maintainable"

    - step: 3
      type: action
      content: "Creating llm_provider.md with multi-provider support"
      tool: Write
      parameters:
        file_path: skills/llm_provider.md

    - step: 4
      type: verification
      content: "File created successfully"
      result: success

  decision_points:
    - point: "Provider structure"
      options: ["single file", "multiple files", "class hierarchy"]
      chosen: "single file"
      rationale: "Simpler to maintain and understand"

  final_outcome:
    success: true
    artifacts_created:
      - skills/llm_provider.md
```

---

## Logging Levels

```yaml
levels:
  minimal:
    - final_decision
    - outcome
    - errors

  standard:
    - reasoning_steps
    - decision_points
    - final_decision
    - outcome

  verbose:
    - all_observations
    - all_hypotheses
    - alternatives_considered
    - confidence_scores
    - token_usage_per_step

  debug:
    - raw_prompts
    - raw_responses
    - internal_state
    - timing_data
```

---

## Storage

```
logs/
├── cot/
│   ├── 2024-01-02/
│   │   ├── trace_abc123.json
│   │   ├── trace_def456.json
│   │   └── index.json
│   └── summary/
│       └── daily_2024-01-02.json
```

---

## Replay & Debug

### Trace Viewer

```bash
# View specific trace
/cot view trace_abc123

# Output:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CHAIN OF THOUGHT: trace_abc123
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# Step 1 [observation] ✓
#   "Issue #64 requires LLM provider abstraction"
#   Confidence: 95%
#
# Step 2 [hypothesis] ✓
#   "Need to create skills/llm_provider.md"
#   Alternatives considered: 2
#
# ...
```

### Debug Mode

```bash
# Enable verbose logging for session
/cot debug on

# Replay with different parameters
/cot replay trace_abc123 --modify step=2
```

---

## Analysis

### Pattern Detection

```yaml
analysis:
  common_patterns:
    - pattern: "repeated_file_reads"
      frequency: 15%
      suggestion: "Consider caching"

    - pattern: "backtrack_on_error"
      frequency: 8%
      suggestion: "Improve initial planning"
```

---

*Transparent reasoning for debuggable AI agents.*
