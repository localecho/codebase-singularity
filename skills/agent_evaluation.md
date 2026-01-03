---
name: agent_evaluation
description: Benchmark suite for evaluating agent performance on coding tasks
triggers:
  - run benchmark
  - evaluate agent
  - check performance
---

# Skill: Agent Behavior Evaluation Framework

## Overview

Standardized benchmarks to evaluate agent performance on coding tasks with Pass@k metrics, quality scores, and regression detection.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              AGENT EVALUATION FRAMEWORK                     │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                 BENCHMARK SUITE                      │  │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │  │
│   │  │ Coding  │  │ Review  │  │ Debug   │             │  │
│   │  │ Tasks   │  │ Tasks   │  │ Tasks   │             │  │
│   │  └────┬────┘  └────┬────┘  └────┬────┘             │  │
│   └───────┼────────────┼────────────┼───────────────────┘  │
│           │            │            │                       │
│           ▼            ▼            ▼                       │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                  EVALUATION ENGINE                   │  │
│   │  - Execute benchmarks                               │  │
│   │  - Measure Pass@k                                   │  │
│   │  - Score quality                                    │  │
│   │  - Compare versions                                 │  │
│   └─────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          ▼                                  │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              REGRESSION DETECTION                    │  │
│   │  - Track scores over time                           │  │
│   │  - Alert on degradation                             │  │
│   │  - Version comparison                               │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Benchmark Categories

### Coding Tasks

```yaml
coding_benchmarks:
  code_generation:
    - name: function_implementation
      description: Generate function from docstring
      difficulty: [easy, medium, hard]
      pass_criteria: tests_pass

    - name: class_implementation
      description: Generate class from specification
      difficulty: [medium, hard]
      pass_criteria: tests_pass + style_check

    - name: algorithm_implementation
      description: Implement standard algorithms
      difficulty: [easy, medium, hard, expert]
      pass_criteria: tests_pass + performance_check

  code_completion:
    - name: inline_completion
      description: Complete partial code
      pass_criteria: syntactically_valid + semantically_correct

    - name: function_completion
      description: Complete function body
      pass_criteria: tests_pass
```

### Review Tasks

```yaml
review_benchmarks:
  bug_detection:
    - name: security_vulnerabilities
      description: Identify OWASP top 10
      pass_criteria: recall > 0.8

    - name: logic_errors
      description: Find logical bugs
      pass_criteria: precision > 0.7

    - name: performance_issues
      description: Identify N+1, memory leaks
      pass_criteria: recall > 0.7

  code_quality:
    - name: style_violations
      description: Identify style issues
      pass_criteria: precision > 0.9

    - name: maintainability
      description: Assess code maintainability
      pass_criteria: correlation > 0.8
```

### Debug Tasks

```yaml
debug_benchmarks:
  error_diagnosis:
    - name: stack_trace_analysis
      description: Identify root cause from stack trace
      pass_criteria: correct_diagnosis

    - name: reproduction_steps
      description: Generate reproduction steps
      pass_criteria: bug_reproducible

  fix_generation:
    - name: single_file_fix
      description: Fix bug in single file
      pass_criteria: tests_pass + no_regression

    - name: multi_file_fix
      description: Fix bug spanning files
      pass_criteria: tests_pass + no_regression
```

---

## Pass@k Metrics

### Definition

```yaml
pass_at_k:
  description: |
    Probability that at least one of k generated samples passes all tests.

  formula: |
    Pass@k = 1 - (C(n-c, k) / C(n, k))
    where:
      n = total samples generated
      c = correct samples
      k = number of attempts allowed

  standard_k_values:
    - k=1   # First attempt success rate
    - k=5   # Within 5 attempts
    - k=10  # Within 10 attempts
    - k=100 # Theoretical maximum
```

### Calculation

```python
def pass_at_k(n, c, k):
    """
    Calculate Pass@k metric.

    Args:
        n: total number of samples
        c: number of correct samples
        k: number of attempts
    """
    if n - c < k:
        return 1.0
    return 1.0 - np.prod(1.0 - k / np.arange(n - c + 1, n + 1))
```

### Reporting

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PASS@K RESULTS - Code Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Benchmark: function_implementation

  Pass@1:   67.3%  [████████████░░░░░░░░]
  Pass@5:   84.2%  [████████████████░░░░]
  Pass@10:  91.5%  [██████████████████░░]
  Pass@100: 98.7%  [███████████████████░]

  Samples: 1000 | Correct: 673
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Code Quality Scores

### Dimensions

```yaml
quality_dimensions:
  correctness:
    weight: 0.4
    metrics:
      - tests_passed_ratio
      - edge_cases_handled
      - error_handling_complete

  efficiency:
    weight: 0.2
    metrics:
      - time_complexity
      - space_complexity
      - resource_usage

  maintainability:
    weight: 0.2
    metrics:
      - cyclomatic_complexity
      - code_duplication
      - naming_quality

  style:
    weight: 0.1
    metrics:
      - linter_score
      - formatting_score
      - documentation_score

  security:
    weight: 0.1
    metrics:
      - vulnerability_count
      - secure_defaults
      - input_validation
```

### Aggregate Score

```yaml
quality_score:
  formula: |
    Q = Σ (dimension_score * weight)

  interpretation:
    90-100: excellent
    80-89: good
    70-79: acceptable
    60-69: needs_improvement
    0-59: failing
```

---

## Regression Detection

### Tracking

```yaml
regression_tracking:
  metrics_tracked:
    - pass_at_k
    - quality_score
    - latency_p50
    - latency_p99
    - token_usage

  comparison:
    baseline: previous_version
    window: 7_days

  alerts:
    - metric: pass_at_1
      threshold: -5%
      severity: critical

    - metric: quality_score
      threshold: -3%
      severity: high
```

### Alert Format

```
⚠️ REGRESSION DETECTED

Benchmark: code_generation
Metric: Pass@1

Current:  67.3%
Previous: 73.1%
Delta:    -5.8% ❌

Affected tasks:
  - algorithm_implementation: -8.2%
  - class_implementation: -4.1%

Recommendation:
  Investigate model version change or prompt modifications.
```

---

## Comparative Analysis

### Model Comparison

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MODEL COMPARISON - Code Generation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Metric      │ Claude 3.5 │ Claude 4 │ Delta
  ────────────┼────────────┼──────────┼────────
  Pass@1      │   67.3%    │  78.4%   │ +11.1%
  Pass@5      │   84.2%    │  91.3%   │  +7.1%
  Quality     │   82.1     │  87.6    │  +5.5
  Latency(ms) │   1,240    │  1,180   │  -4.8%
  Tokens      │   2,340    │  2,120   │  -9.4%

  Recommendation: Upgrade to Claude 4 ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Commands

```bash
# Run all benchmarks
/benchmark run all

# Run specific category
/benchmark run coding --difficulty medium

# Compare versions
/benchmark compare v1.0.0 v2.0.0

# View regression report
/benchmark regression --days 7

# Export results
/benchmark export --format json --output results.json
```

---

## Configuration

```yaml
# benchmarks/config.yaml
evaluation:
  enabled: true

  schedule:
    frequency: daily
    time: "02:00"

  benchmarks:
    coding: true
    review: true
    debug: true

  sample_sizes:
    pass_at_k: 100
    quality: 50

  thresholds:
    min_pass_at_1: 60%
    min_quality: 75
    max_latency_p99: 5000ms

  notifications:
    slack: $SLACK_WEBHOOK
    email: team@company.com
```

---

*Continuous evaluation for reliable agent performance.*
