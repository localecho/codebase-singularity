---
name: prompt_versioning
description: Version control and A/B testing for prompts with metrics collection
triggers:
  - version prompt
  - ab test
  - experiment prompt
---

# Skill: Prompt Versioning & A/B Testing

## Overview

Production-grade prompt management with version control, A/B testing, and statistical analysis.

---

## Prompt Version Control

### Directory Structure

```
prompts/
├── registry.yaml           # Prompt registry
├── experiments/            # Active experiments
│   └── exp_001.yaml
├── commands/               # Versioned command prompts
│   ├── orchestrate/
│   │   ├── v1.0.0.md
│   │   ├── v1.1.0.md
│   │   └── current -> v1.1.0.md
│   └── code_review/
│       ├── v1.0.0.md
│       └── current -> v1.0.0.md
└── metrics/                # Experiment results
    └── exp_001_results.json
```

### Version Schema

```yaml
# prompts/commands/orchestrate/v1.1.0.md
---
version: 1.1.0
created: 2024-01-02
author: agent
parent_version: 1.0.0
changelog:
  - Added explicit phase transitions
  - Improved error handling prompts
  - Reduced token usage by 15%
status: active
metrics:
  success_rate: 0.94
  avg_tokens: 2500
  avg_latency: 1.8s
---

# Orchestrator Prompt v1.1.0
...
```

---

## A/B Testing Framework

### Experiment Configuration

```yaml
# prompts/experiments/exp_001.yaml
experiment:
  id: exp_001
  name: "Orchestrator Phase Clarity"
  status: running
  start_date: 2024-01-02
  end_date: 2024-01-09

  hypothesis: |
    Adding explicit phase transition markers will reduce
    fix iterations by 20%.

variants:
  control:
    prompt_version: orchestrate/v1.0.0
    traffic_percentage: 50

  treatment:
    prompt_version: orchestrate/v1.1.0
    traffic_percentage: 50

metrics:
  primary: fix_iterations
  secondary:
    - success_rate
    - token_usage
    - latency

stopping_rules:
  min_samples: 100
  significance_level: 0.05
  early_stop_threshold: 0.01  # Stop if p < 0.01
```

### Traffic Routing

```
┌──────────────────────────────────────────────────┐
│              A/B TRAFFIC ROUTER                  │
│                                                  │
│   Request ──┬──► Hash(user_id) % 100            │
│             │                                    │
│             ├──► 0-49  ──► Control (v1.0.0)     │
│             │                                    │
│             └──► 50-99 ──► Treatment (v1.1.0)   │
│                                                  │
│   Consistent routing per user session           │
└──────────────────────────────────────────────────┘
```

---

## Metrics Collection

### Per-Request Logging

```yaml
# Logged automatically for each request
request_log:
  id: req_xyz789
  timestamp: 2024-01-02T14:30:00Z
  experiment: exp_001
  variant: treatment
  prompt_version: orchestrate/v1.1.0

  # Performance metrics
  tokens_used: 2450
  latency_ms: 1850
  success: true

  # Quality metrics
  fix_iterations: 1
  code_quality_score: 0.92
  user_accepted: true

  # Context
  workflow: sprint
  issue_complexity: medium
```

### Aggregated Analysis

```yaml
# prompts/metrics/exp_001_results.json
experiment: exp_001
samples: 156
duration_days: 5

control:
  samples: 78
  metrics:
    fix_iterations:
      mean: 2.3
      std: 1.1
    success_rate: 0.88
    avg_tokens: 2800

treatment:
  samples: 78
  metrics:
    fix_iterations:
      mean: 1.6
      std: 0.8
    success_rate: 0.94
    avg_tokens: 2500

statistical_analysis:
  fix_iterations:
    difference: -0.7
    relative_improvement: 30.4%
    p_value: 0.002
    significant: true
    confidence_interval: [-1.0, -0.4]

  success_rate:
    difference: 0.06
    relative_improvement: 6.8%
    p_value: 0.08
    significant: false

recommendation: PROMOTE_TREATMENT
```

---

## Prompt Lifecycle

### States

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  DRAFT   │───►│  TESTING │───►│  ACTIVE  │
└──────────┘    └──────────┘    └──────────┘
     │               │               │
     │               ▼               ▼
     │         ┌──────────┐    ┌──────────┐
     └────────►│  FAILED  │    │ ARCHIVED │
               └──────────┘    └──────────┘
```

### Promotion Flow

1. **Draft**: New prompt version created
2. **Testing**: Running in A/B experiment
3. **Active**: Promoted to production (>95% traffic)
4. **Archived**: Previous version, kept for rollback
5. **Failed**: Experiment showed regression

---

## Commands

### Create New Version

```bash
# Create new prompt version
/prompt new orchestrate --parent v1.0.0

# Edit and save
# Automatically creates v1.1.0 draft
```

### Start Experiment

```bash
# Start A/B test
/prompt experiment orchestrate \
  --control v1.0.0 \
  --treatment v1.1.0 \
  --split 50/50 \
  --duration 7d
```

### Check Results

```bash
# View experiment status
/prompt results exp_001

# Output:
# Experiment: exp_001
# Status: SIGNIFICANT WINNER
# Winner: treatment (v1.1.0)
# Improvement: 30.4% reduction in fix iterations
# Confidence: 99.8%
```

### Promote Winner

```bash
# Promote winning variant
/prompt promote exp_001

# This:
# 1. Sets v1.1.0 as current
# 2. Archives v1.0.0
# 3. Closes experiment
# 4. Updates registry
```

---

## Rollback

### Automatic Rollback Triggers

| Condition | Action |
|-----------|--------|
| Success rate drops >10% | Alert + pause experiment |
| Error rate spikes | Immediate rollback |
| Latency increase >50% | Alert + review |
| Token cost doubles | Alert + review |

### Manual Rollback

```bash
# Rollback to previous version
/prompt rollback orchestrate --to v1.0.0

# Emergency rollback (instant)
/prompt rollback orchestrate --emergency
```

---

## Best Practices

### 1. Semantic Versioning

```
MAJOR.MINOR.PATCH

MAJOR: Breaking changes to output format
MINOR: New capabilities, backward compatible
PATCH: Bug fixes, wording improvements
```

### 2. Changelog Requirements

Every version must document:
- What changed
- Why it changed
- Expected impact
- Rollback plan

### 3. Experiment Duration

| Change Type | Min Duration | Min Samples |
|-------------|--------------|-------------|
| Minor wording | 3 days | 50 |
| Structure change | 7 days | 100 |
| Major rewrite | 14 days | 200 |

### 4. Statistical Rigor

- Always use significance level 0.05
- Require 95% confidence for promotion
- Account for multiple comparisons
- Use sequential testing for early stopping

---

## Integration

### With Orchestrator

```yaml
# Orchestrator respects experiments
orchestrator:
  prompt_selection: experiment_aware
  fallback_version: v1.0.0  # If experiment fails
```

### With Metrics

```yaml
# All metrics tagged with prompt version
metrics:
  tags:
    - prompt_version
    - experiment_id
    - variant
```

---

*Production-grade prompt versioning for continuous improvement.*
