---
name: finetune_collection
description: Collect high-quality examples for model fine-tuning
triggers:
  - collect example
  - save for training
  - export training data
---

# Skill: Fine-Tuning Data Collection

## Overview

Collect, curate, and export high-quality examples for potential model fine-tuning.

---

## Collection Pipeline

```
┌─────────────────────────────────────────────────┐
│          DATA COLLECTION PIPELINE               │
│                                                 │
│   Successful Workflow                           │
│        │                                        │
│        ▼                                        │
│   ┌─────────────────────────────────────┐      │
│   │ Capture: Input + Output + Context   │      │
│   └─────────────────────────────────────┘      │
│        │                                        │
│        ▼                                        │
│   ┌─────────────────────────────────────┐      │
│   │ Quality Filter: Score > 0.9         │      │
│   └─────────────────────────────────────┘      │
│        │                                        │
│        ▼                                        │
│   ┌─────────────────────────────────────┐      │
│   │ PII Scrubber: Remove sensitive data │      │
│   └─────────────────────────────────────┘      │
│        │                                        │
│        ▼                                        │
│   ┌─────────────────────────────────────┐      │
│   │ Deduplication: Remove similar       │      │
│   └─────────────────────────────────────┘      │
│        │                                        │
│        ▼                                        │
│   Training Dataset                              │
└─────────────────────────────────────────────────┘
```

---

## Example Format

```json
{
  "id": "ex_12345",
  "created_at": "2024-01-02T10:30:00Z",
  "task_type": "code_generation",
  "quality_score": 0.95,

  "input": {
    "system": "You are a code assistant...",
    "user": "Create a function that...",
    "context": "Project uses TypeScript..."
  },

  "output": {
    "assistant": "Here is the function..."
  },

  "metadata": {
    "tokens_used": 2500,
    "execution_time": 1.5,
    "human_approved": true,
    "workflow": "orchestrate",
    "phase": "BUILD"
  }
}
```

---

## Quality Criteria

```yaml
quality_filters:
  # Minimum thresholds
  min_quality_score: 0.9
  min_human_approval: true

  # Signals
  positive_signals:
    - tests_passed
    - code_review_approved
    - zero_fix_iterations
    - user_accepted

  negative_signals:
    - errors_occurred
    - multiple_retries
    - user_rejected
    - timeout
```

---

## PII Scrubbing

```yaml
pii_patterns:
  - type: email
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
    replacement: "<EMAIL>"

  - type: api_key
    pattern: "sk-[a-zA-Z0-9]{32,}"
    replacement: "<API_KEY>"

  - type: password
    pattern: "password[\"']?\\s*[:=]\\s*[\"'][^\"']+[\"']"
    replacement: "password: <REDACTED>"
```

---

## Export Formats

### OpenAI Format

```jsonl
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
```

### Anthropic Format

```jsonl
{"prompt": "\n\nHuman: ...\n\nAssistant:", "completion": "..."}
```

---

## Commands

```bash
# Export training data
/finetune export --format openai --output training.jsonl

# View collection stats
/finetune stats

# Manually add example
/finetune add --quality high
```

---

*Building high-quality datasets for continuous improvement.*
