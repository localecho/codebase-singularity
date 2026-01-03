---
name: token_budget
description: Token budget management with real-time tracking and optimization
triggers:
  - check tokens
  - token usage
  - budget status
---

# Skill: Token Budget Management

## Overview

Enterprise token budget controls with real-time tracking, alerts, and optimization.

---

## Budget Configuration

```yaml
# config/token_budgets.yaml
budgets:
  global:
    daily_limit: 1000000
    monthly_limit: 25000000
    alert_threshold: 80%

  per_workflow:
    orchestrate: 100000
    sprint: 500000
    code_review: 25000
    test_backend: 15000

  per_model:
    claude-opus: 200000
    claude-sonnet: 500000
    claude-haiku: 1000000
```

---

## Real-Time Tracking

### Token Counter

```
┌─────────────────────────────────────────────────┐
│           TOKEN USAGE DASHBOARD                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  Daily Budget    [████████████░░░░] 75%        │
│                  750,000 / 1,000,000            │
│                                                 │
│  Current Workflow (sprint)                      │
│                  [██████░░░░░░░░░░] 38%        │
│                  190,000 / 500,000              │
│                                                 │
│  By Model:                                      │
│    Opus:    [████░░] 40%   80k tokens          │
│    Sonnet:  [██████] 60%   300k tokens         │
│    Haiku:   [████████] 80%  400k tokens        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Per-Request Logging

```yaml
token_log:
  request_id: req_123
  timestamp: 2024-01-02T10:30:00Z
  workflow: sprint
  phase: BUILD
  model: claude-sonnet-4
  tokens:
    input: 15000
    output: 3500
    total: 18500
  cumulative:
    workflow: 190000
    daily: 750000
```

---

## Budget Enforcement

### Soft Limits (Warnings)

| Threshold | Action |
|-----------|--------|
| 70% | Log warning |
| 80% | Alert user |
| 90% | Suggest optimization |

### Hard Limits (Blocks)

| Threshold | Action |
|-----------|--------|
| 100% | Block new requests |
| 110% | Emergency stop |

### Graceful Degradation

```yaml
degradation_strategy:
  on_budget_exceeded:
    1. Switch to cheaper model
    2. Reduce context window
    3. Batch remaining work
    4. Defer non-critical tasks
```

---

## Optimization Strategies

### Automatic Optimizations

```yaml
optimizations:
  context_compression:
    enabled: true
    trigger: usage > 60%
    method: summarize_old_context

  model_downgrade:
    enabled: true
    trigger: usage > 80%
    from: claude-sonnet
    to: claude-haiku

  caching:
    enabled: true
    cache_embeddings: true
    cache_repeated_queries: true
```

### Manual Controls

```bash
# Check current usage
/tokens status

# Set workflow budget
/tokens budget sprint 300000

# Force cheap model
/tokens mode economy
```

---

## Alerts

### Alert Channels

```yaml
alerts:
  channels:
    - type: console
      threshold: 70%
    - type: slack
      threshold: 90%
      webhook: $SLACK_WEBHOOK
    - type: email
      threshold: 100%
      to: admin@company.com
```

### Alert Format

```
⚠️ TOKEN BUDGET ALERT

Workflow: sprint
Current Usage: 450,000 / 500,000 (90%)
Remaining: 50,000 tokens

Recommendation:
- Switch to Haiku for remaining tasks
- Or request budget increase

Action Required: Acknowledge or Adjust
```

---

## Reporting

### Daily Summary

```yaml
daily_report:
  date: 2024-01-02
  total_tokens: 850000
  total_cost: $12.50

  by_workflow:
    sprint: 400000
    orchestrate: 250000
    code_review: 150000
    test_backend: 50000

  by_model:
    claude-opus: 100000 ($7.50)
    claude-sonnet: 400000 ($4.00)
    claude-haiku: 350000 ($1.00)

  efficiency_score: 0.85
  optimization_savings: 15%
```

---

*Enterprise token budget management for cost control.*
