---
name: llm_provider
description: Multi-provider LLM abstraction with fallback, cost tracking, and optimization
triggers:
  - use llm
  - call model
  - generate with
---

# Skill: LLM Provider Abstraction

## Overview

Enterprise-grade LLM provider abstraction supporting multiple providers with automatic fallback, cost tracking, and latency monitoring.

---

## Supported Providers

| Provider | Models | Cost/1K tokens | Latency | Use Case |
|----------|--------|----------------|---------|----------|
| **Anthropic** | Claude Opus, Sonnet, Haiku | $15/$3/$0.25 | Low | Primary |
| **OpenAI** | GPT-4o, GPT-4, GPT-3.5 | $5/$30/$0.50 | Low | Fallback |
| **Google** | Gemini Pro, Flash | $1.25/$0.075 | Medium | Cost-opt |
| **Local** | Ollama, LMStudio | $0 | Variable | Privacy |

---

## Provider Configuration

### Environment Variables

```bash
# Primary Provider
ANTHROPIC_API_KEY=sk-ant-...
LLM_PRIMARY_PROVIDER=anthropic
LLM_PRIMARY_MODEL=claude-sonnet-4-20250514

# Fallback Chain
LLM_FALLBACK_1=openai:gpt-4o
LLM_FALLBACK_2=google:gemini-pro
LLM_FALLBACK_3=local:llama3

# Cost Controls
LLM_MAX_COST_PER_WORKFLOW=5.00
LLM_TOKEN_BUDGET_WARNING=80000
```

### Provider Registry

```yaml
# config/llm_providers.yaml
providers:
  anthropic:
    api_base: https://api.anthropic.com
    models:
      - claude-opus-4-20250514
      - claude-sonnet-4-20250514
      - claude-haiku-3-20250307
    features:
      - tool_use
      - vision
      - extended_thinking
    rate_limit: 1000/min

  openai:
    api_base: https://api.openai.com/v1
    models:
      - gpt-4o
      - gpt-4-turbo
      - gpt-3.5-turbo
    features:
      - function_calling
      - vision
      - json_mode
    rate_limit: 500/min

  google:
    api_base: https://generativelanguage.googleapis.com
    models:
      - gemini-pro
      - gemini-flash
    features:
      - grounding
      - code_execution
    rate_limit: 60/min

  local:
    api_base: http://localhost:11434
    models:
      - llama3
      - codellama
      - mistral
    features:
      - offline
      - privacy
    rate_limit: unlimited
```

---

## Fallback Chain

### Automatic Failover

```
┌──────────────────────────────────────────────────┐
│              FALLBACK CHAIN                      │
│                                                  │
│   Primary ──┬──► Fallback 1 ──► Fallback 2      │
│   (Claude)  │    (GPT-4o)      (Gemini)         │
│             │                                    │
│             └──► Rate Limit? ──► Next Provider  │
│             └──► API Error? ──► Next Provider   │
│             └──► Timeout? ──► Next Provider     │
└──────────────────────────────────────────────────┘
```

### Failover Triggers

| Condition | Action | Cooldown |
|-----------|--------|----------|
| HTTP 429 (Rate Limit) | Next provider | 60s |
| HTTP 500+ (Server Error) | Retry once, then next | 30s |
| Timeout (>30s) | Next provider | 0s |
| API Key Invalid | Skip provider | Permanent |
| Cost Budget Exceeded | Use cheaper model | Reset daily |

---

## Cost Tracking

### Per-Request Tracking

```yaml
# Logged to metrics/llm_usage/
request:
  id: req_abc123
  timestamp: 2024-01-02T10:30:00Z
  provider: anthropic
  model: claude-sonnet-4
  tokens:
    input: 1500
    output: 800
  cost_usd: 0.0105
  latency_ms: 1250
  workflow: orchestrate
  phase: BUILD
```

### Aggregated Metrics

```yaml
# Daily summary
date: 2024-01-02
total_requests: 150
total_tokens: 450000
total_cost_usd: 12.50
by_provider:
  anthropic: { requests: 120, cost: 10.00 }
  openai: { requests: 25, cost: 2.00 }
  google: { requests: 5, cost: 0.50 }
by_workflow:
  sprint: { requests: 80, cost: 8.00 }
  code_review: { requests: 50, cost: 3.50 }
  test_backend: { requests: 20, cost: 1.00 }
```

---

## Latency Monitoring

### Real-Time Tracking

```
Provider     Avg Latency   P95 Latency   Success Rate
─────────────────────────────────────────────────────
Anthropic    1.2s          2.5s          99.5%
OpenAI       1.8s          3.2s          98.2%
Google       2.1s          4.0s          97.8%
Local        0.8s          1.5s          100%
```

### Adaptive Routing

When latency exceeds thresholds:
1. Route to faster provider for time-sensitive tasks
2. Batch requests for cost-sensitive tasks
3. Use local models for latency-critical operations

---

## Token Optimization

### Context Management

```yaml
optimization_strategies:
  # Compress long contexts
  context_compression:
    enabled: true
    threshold: 50000  # tokens
    method: summarize

  # Cache repeated contexts
  context_caching:
    enabled: true
    ttl: 3600  # seconds

  # Truncate old messages
  conversation_pruning:
    enabled: true
    max_turns: 10
    preserve_system: true
```

### Model Selection by Task

| Task Type | Recommended Model | Reason |
|-----------|-------------------|--------|
| Planning | Claude Opus | Deep reasoning |
| Coding | Claude Sonnet | Balance |
| Review | Claude Haiku | Speed |
| Simple Queries | Gemini Flash | Cost |

---

## Usage in Workflows

### Basic Call

```python
# Pseudo-code for agent usage
response = llm.complete(
    prompt="Generate code for...",
    model="auto",  # Uses primary, falls back if needed
    max_tokens=4000,
    temperature=0.7
)
```

### With Provider Override

```python
# Force specific provider
response = llm.complete(
    prompt="...",
    provider="openai",
    model="gpt-4o",
    fallback=False  # Don't fallback
)
```

### Cost-Constrained

```python
# Stay within budget
response = llm.complete(
    prompt="...",
    max_cost=0.10,  # Max $0.10 for this call
    prefer_cheap=True
)
```

---

## Integration with Codebase Singularity

### In Orchestrator

```yaml
# Each phase can specify model preferences
orchestrator:
  plan_phase:
    model: claude-opus-4
    reason: "Complex reasoning needed"
  build_phase:
    model: claude-sonnet-4
    reason: "Balance of speed and quality"
  review_phase:
    model: claude-haiku-3
    reason: "Fast validation"
  fix_phase:
    model: claude-sonnet-4
    reason: "Careful corrections"
```

### In Sprint

```yaml
# Per-issue model selection
sprint:
  complex_issues:
    model: claude-opus-4
  standard_issues:
    model: claude-sonnet-4
  simple_fixes:
    model: claude-haiku-3
```

---

## Monitoring Dashboard

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  LLM PROVIDER STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Anthropic  ████████████████████  98% uptime
  OpenAI     ██████████████████░░  90% uptime
  Google     ████████████████░░░░  80% uptime
  Local      ████████████████████  100% uptime

  Today's Usage:
    Tokens: 125,000 / 500,000 budget
    Cost: $8.50 / $20.00 budget

  Current Provider: Anthropic (Claude Sonnet)
  Fallback Ready: OpenAI (GPT-4o)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Enterprise-grade LLM provider abstraction for production agentic systems.*
