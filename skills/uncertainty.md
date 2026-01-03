---
name: uncertainty
description: Confidence scoring and uncertainty quantification for agent outputs
triggers:
  - check confidence
  - uncertainty score
  - how sure
---

# Skill: Uncertainty Quantification

## Overview

Production-grade confidence scoring with entropy-based uncertainty, multiple hypothesis generation, and human escalation triggers.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│            UNCERTAINTY QUANTIFICATION SYSTEM                │
│                                                             │
│   Agent Output                                              │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │           CONFIDENCE ESTIMATOR                       │  │
│   │  - Token-level probabilities                        │  │
│   │  - Semantic consistency                             │  │
│   │  - Self-verification                                │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │          HYPOTHESIS GENERATOR                        │  │
│   │  - Generate N alternatives                          │  │
│   │  - Score each option                                │  │
│   │  - Measure agreement                                │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │          CALIBRATION ENGINE                          │  │
│   │  - Historical accuracy                              │  │
│   │  - Domain-specific calibration                      │  │
│   │  - Platt scaling                                    │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │          ESCALATION DECISION                         │  │
│   │  confidence < threshold → human review              │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Confidence Scoring

### Multi-Signal Approach

```yaml
confidence_signals:
  token_probability:
    weight: 0.3
    description: Average log probability of generated tokens

  self_consistency:
    weight: 0.3
    description: Agreement across multiple generations
    samples: 5

  semantic_verification:
    weight: 0.2
    description: Does output match stated intent?

  domain_calibration:
    weight: 0.2
    description: Historical accuracy in this domain
```

### Confidence Calculation

```python
def calculate_confidence(output, context):
    """
    Calculate calibrated confidence score.
    """
    # Token-level confidence
    token_conf = mean(output.token_log_probs)

    # Self-consistency (generate N samples, measure agreement)
    samples = generate_n_samples(context, n=5)
    consistency = measure_agreement(samples)

    # Semantic verification
    semantic_score = verify_semantic_match(output, context.intent)

    # Domain calibration
    domain_score = get_domain_calibration(context.domain)

    # Weighted combination
    raw_confidence = (
        token_conf * 0.3 +
        consistency * 0.3 +
        semantic_score * 0.2 +
        domain_score * 0.2
    )

    # Apply Platt scaling for calibration
    return platt_scale(raw_confidence)
```

---

## Entropy-Based Uncertainty

### Definition

```yaml
entropy_metrics:
  token_entropy:
    formula: "H(p) = -Σ p(x) log p(x)"
    interpretation:
      low: "High certainty, peaked distribution"
      high: "Low certainty, flat distribution"

  predictive_entropy:
    formula: "H(E[p]) - E[H(p)]"
    description: "Distinguishes aleatoric from epistemic uncertainty"

  mutual_information:
    formula: "I(y; θ) = H(y) - E[H(y|θ)]"
    description: "Model's uncertainty about its own parameters"
```

### Entropy Thresholds

```
┌─────────────────────────────────────────────────┐
│         ENTROPY INTERPRETATION                  │
├─────────────────────────────────────────────────┤
│  Entropy   │ Certainty  │ Action               │
│────────────┼────────────┼──────────────────────│
│  0.0 - 0.5 │ Very High  │ Auto-execute         │
│  0.5 - 1.0 │ High       │ Execute with logging │
│  1.0 - 2.0 │ Medium     │ Seek confirmation    │
│  2.0 - 3.0 │ Low        │ Provide alternatives │
│  > 3.0     │ Very Low   │ Escalate to human    │
└─────────────────────────────────────────────────┘
```

---

## Multiple Hypothesis Generation

### Process

```yaml
hypothesis_generation:
  num_hypotheses: 3
  diversity_threshold: 0.3

  process:
    1. Generate primary hypothesis
    2. Prompt for alternatives: "What are other valid approaches?"
    3. Score each hypothesis independently
    4. Rank by confidence + feasibility
```

### Output Format

```yaml
output:
  primary_hypothesis:
    content: "Add null check before accessing user.id"
    confidence: 0.85
    reasoning: "Most direct fix for TypeError"

  alternatives:
    - content: "Use optional chaining: user?.id"
      confidence: 0.82
      reasoning: "More concise, same effect"

    - content: "Add default value: user?.id ?? 'unknown'"
      confidence: 0.65
      reasoning: "Handles edge case but may hide bugs"

  agreement_score: 0.78
  recommendation: "primary_hypothesis"
  escalate: false
```

### Presentation to User

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  MULTIPLE SOLUTIONS AVAILABLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Confidence spread detected. Here are the options:

  ▶ Option 1 (Recommended) - 85% confident
    Add null check before accessing user.id

  ▷ Option 2 - 82% confident
    Use optional chaining: user?.id

  ▷ Option 3 - 65% confident
    Add default value: user?.id ?? 'unknown'

  [1] Use Option 1  [2] Use Option 2  [3] Use Option 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Calibrated Probabilities

### Platt Scaling

```yaml
calibration:
  method: platt_scaling

  formula: |
    P(y=1|x) = 1 / (1 + exp(A*f(x) + B))
    where A, B are learned from validation data

  training:
    dataset: historical_predictions
    validation_split: 0.2
    retrain_frequency: weekly
```

### Calibration Curve

```
  Calibration Curve

  1.0 │                              ●
      │                           ●
      │                        ●
  0.8 │                     ●
      │                  ●
  A   │               ●
  c 0.6│            ●
  t   │         ●
  u   │      ●                    ─── Perfectly Calibrated
  a 0.4│   ●                       ● ● Model Output
  l   │●
      │
  0.2 │
      │
      │
  0.0 └────────────────────────────────
      0.0   0.2   0.4   0.6   0.8   1.0
                 Predicted

  ECE (Expected Calibration Error): 0.03
  Status: Well-calibrated ✓
```

---

## Human Escalation

### Triggers

```yaml
escalation_triggers:
  confidence_based:
    - condition: confidence < 0.5
      action: require_human_approval

    - condition: confidence < 0.3
      action: block_and_escalate

  disagreement_based:
    - condition: hypothesis_agreement < 0.6
      action: present_options_to_human

  risk_based:
    - condition: is_destructive_action && confidence < 0.8
      action: require_human_approval

    - condition: is_security_related
      action: always_escalate
```

### Escalation Format

```
⚠️ HUMAN REVIEW REQUIRED

The agent has low confidence in this action.

Action: Delete user account #12345
Confidence: 42%
Entropy: 2.8 (high uncertainty)

Reason for escalation:
  - Destructive action with below-threshold confidence
  - Multiple valid interpretations of user intent

Alternatives considered:
  1. Delete user account (42% conf)
  2. Deactivate user account (38% conf)
  3. Archive user data (20% conf)

[Approve] [Modify] [Reject] [Ask for clarification]
```

---

## Commands

```bash
# Check confidence of last output
/confidence

# Generate multiple hypotheses
/uncertain --alternatives 5

# View calibration metrics
/uncertainty calibration

# Set escalation threshold
/uncertainty threshold 0.6

# Force human review
/uncertainty escalate
```

---

## Configuration

```yaml
# config/uncertainty.yaml
uncertainty:
  enabled: true

  confidence:
    signals:
      token_probability: 0.3
      self_consistency: 0.3
      semantic_verification: 0.2
      domain_calibration: 0.2

  hypothesis:
    num_alternatives: 3
    min_diversity: 0.3

  calibration:
    method: platt_scaling
    retrain: weekly

  escalation:
    confidence_threshold: 0.5
    always_escalate:
      - security_changes
      - data_deletion
      - production_deployment

  reporting:
    log_all_scores: true
    track_calibration: true
```

---

*Knowing what you don't know is the first step to reliable AI.*
