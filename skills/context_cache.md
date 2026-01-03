---
name: context_cache
description: KV cache for repeated context with TTL and intelligent eviction
triggers:
  - cache context
  - context reuse
  - reduce latency
---

# Skill: Context Caching and Reuse

## Overview

Reduce latency and cost by caching common contexts with fingerprinting, TTL management, and intelligent eviction strategies.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   CONTEXT CACHE SYSTEM                      │
│                                                             │
│   Incoming Request                                          │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              FINGERPRINT GENERATOR                   │  │
│   │  - Hash context content                             │  │
│   │  - Semantic similarity check                        │  │
│   │  - Generate cache key                               │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────┐     ┌─────────────────────────────┐  │
│   │   CACHE LOOKUP  │────►│     KV CACHE STORE          │  │
│   │   Hit? ──────── │     │  ┌─────────────────────┐    │  │
│   │   │    │        │     │  │ context_abc: {...}  │    │  │
│   │   ▼    ▼        │     │  │ context_def: {...}  │    │  │
│   │  HIT  MISS      │     │  │ context_ghi: {...}  │    │  │
│   └───┬────┬────────┘     │  └─────────────────────┘    │  │
│       │    │              └─────────────────────────────┘  │
│       │    │                                               │
│       │    ▼                                               │
│       │   ┌─────────────────────────────────────────┐     │
│       │   │         COMPUTE + CACHE                  │     │
│       │   │  - Process context                       │     │
│       │   │  - Store with TTL                        │     │
│       │   └─────────────────────────────────────────┘     │
│       │                                                    │
│       ▼                                                    │
│   Cached Response (Fast!)                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Context Fingerprinting

### Hash Generation

```yaml
fingerprinting:
  algorithm: xxhash64

  components:
    - system_prompt_hash
    - file_content_hashes
    - conversation_context_hash

  semantic_matching:
    enabled: true
    similarity_threshold: 0.95
    embedding_model: text-embedding-3-small
```

### Fingerprint Structure

```json
{
  "fingerprint": "fp_a1b2c3d4e5f6",
  "components": {
    "system": "hash_of_system_prompt",
    "files": ["hash_file1", "hash_file2"],
    "context": "hash_of_recent_context"
  },
  "semantic_vector": [0.12, -0.34, ...],
  "created_at": "2024-01-02T10:00:00Z"
}
```

---

## Cache Storage

### Backends

| Backend | Use Case | Latency | Persistence |
|---------|----------|---------|-------------|
| **In-Memory** | Development | <1ms | None |
| **Redis** | Production | 1-5ms | Optional |
| **Memcached** | High throughput | 1-3ms | None |
| **DynamoDB** | Serverless | 5-20ms | Full |

### Cache Entry

```yaml
cache_entry:
  key: "fp_a1b2c3d4e5f6"
  value:
    kv_cache_state: <binary>
    token_count: 15000
    model_version: "claude-3-sonnet"
  metadata:
    created_at: "2024-01-02T10:00:00Z"
    last_accessed: "2024-01-02T10:30:00Z"
    access_count: 42
    ttl_seconds: 3600
    size_bytes: 245000
```

---

## TTL Management

### Dynamic TTL

```yaml
ttl_strategy:
  base_ttl: 3600  # 1 hour

  adjustments:
    high_access:
      threshold: 10  # accesses per hour
      multiplier: 2.0

    low_access:
      threshold: 1
      multiplier: 0.5

    large_context:
      threshold: 50000  # tokens
      multiplier: 1.5   # Keep longer (expensive to recompute)

  max_ttl: 86400  # 24 hours
  min_ttl: 300    # 5 minutes
```

### TTL Calculation

```python
def calculate_ttl(entry):
    """Calculate dynamic TTL based on access patterns."""
    ttl = BASE_TTL

    # Increase for frequently accessed
    if entry.access_rate > HIGH_ACCESS_THRESHOLD:
        ttl *= HIGH_ACCESS_MULTIPLIER

    # Increase for large contexts
    if entry.token_count > LARGE_CONTEXT_THRESHOLD:
        ttl *= LARGE_CONTEXT_MULTIPLIER

    return min(max(ttl, MIN_TTL), MAX_TTL)
```

---

## Cache Hit Rate Monitoring

### Metrics

```yaml
metrics:
  cache_hits: counter
  cache_misses: counter
  cache_hit_rate: gauge
  cache_size_bytes: gauge
  cache_entries: gauge
  avg_lookup_time_ms: histogram
  tokens_saved: counter
  cost_saved_usd: counter
```

### Dashboard

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           CONTEXT CACHE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Hit Rate:     [████████████░░░░░░░░] 62%

  Today's Stats:
    Hits:       12,450
    Misses:     7,680

  Performance:
    Avg Lookup: 2.3ms
    P99 Lookup: 8.1ms

  Savings:
    Tokens Saved: 45.2M
    Cost Saved:   $127.50

  Cache Size:
    Entries:    2,340
    Size:       1.2 GB

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Intelligent Eviction

### Eviction Strategies

```yaml
eviction:
  primary: lru_with_frequency

  strategies:
    lru:
      description: Least Recently Used

    lfu:
      description: Least Frequently Used

    lru_with_frequency:
      description: LRU weighted by access frequency
      formula: |
        score = recency * 0.6 + frequency * 0.4

    cost_aware:
      description: Evict cheapest to recompute first
      factors:
        - token_count
        - recompute_time
        - access_frequency
```

### Eviction Triggers

```yaml
eviction_triggers:
  memory_pressure:
    threshold: 80%  # of allocated memory
    action: evict_lowest_score

  entry_limit:
    max_entries: 10000
    action: evict_oldest

  scheduled:
    frequency: hourly
    action: evict_expired
```

---

## Latency Reduction

### Before/After

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         LATENCY COMPARISON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Without Cache:
    Context Processing: 2,500ms
    Total Request:      4,200ms

  With Cache (HIT):
    Cache Lookup:       3ms
    Total Request:      1,700ms

  Improvement: 59% faster

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Cost Savings

### Calculation

```yaml
cost_tracking:
  input_token_cost: $0.003  # per 1K tokens
  output_token_cost: $0.015  # per 1K tokens

  savings_formula: |
    tokens_saved = cache_hits * avg_cached_tokens
    cost_saved = tokens_saved * input_token_cost / 1000

  reporting:
    frequency: daily
    notify_on: savings > $100
```

---

## Commands

```bash
# View cache status
/cache status

# Clear cache
/cache clear

# Warm cache with common contexts
/cache warm --files src/**/*.ts

# View cache analytics
/cache analytics --period 7d

# Force eviction
/cache evict --strategy lru --count 100
```

---

## Configuration

```yaml
# config/context_cache.yaml
context_cache:
  enabled: true

  storage:
    backend: redis
    connection: $REDIS_URL
    max_memory: 2GB

  fingerprinting:
    algorithm: xxhash64
    semantic_matching: true

  ttl:
    base: 3600
    max: 86400

  eviction:
    strategy: lru_with_frequency
    memory_threshold: 80%

  monitoring:
    metrics: true
    dashboard: true
    alerts:
      hit_rate_low: 30%
```

---

*Intelligent caching for faster, cheaper AI interactions.*
