---
name: rag_pipeline
description: RAG pipeline for semantic codebase search and context retrieval
triggers:
  - search code
  - find context
  - semantic search
---

# Skill: RAG Pipeline for Codebase Context

## Overview

Vector-based retrieval augmented generation for efficient codebase context loading.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    RAG PIPELINE                             │
│                                                             │
│   ┌─────────┐    ┌──────────┐    ┌──────────┐             │
│   │ Indexer │───►│  Vector  │───►│ Retriever│             │
│   │         │    │  Store   │    │          │             │
│   └─────────┘    └──────────┘    └──────────┘             │
│        │                              │                     │
│        ▼                              ▼                     │
│   ┌─────────┐                   ┌──────────┐              │
│   │  Code   │                   │  Context │              │
│   │ Chunks  │                   │  Window  │              │
│   └─────────┘                   └──────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## Indexing

### Code Chunking Strategy

```yaml
chunking:
  # By file type
  strategies:
    typescript:
      method: ast_based
      chunk_by: function
      max_tokens: 500
      overlap: 50

    markdown:
      method: heading_based
      chunk_by: section
      max_tokens: 1000
      overlap: 100

    python:
      method: ast_based
      chunk_by: class_or_function
      max_tokens: 500
      overlap: 50

  # Metadata enrichment
  metadata:
    - file_path
    - function_name
    - class_name
    - imports
    - docstring
```

### Embedding Generation

```yaml
embeddings:
  model: text-embedding-3-small
  dimensions: 1536
  batch_size: 100

  # Cache settings
  cache:
    enabled: true
    ttl: 86400  # 24 hours
    invalidate_on_change: true
```

---

## Vector Store

### Supported Backends

| Backend | Use Case | Persistence |
|---------|----------|-------------|
| **In-Memory** | Development | None |
| **SQLite+VSS** | Local production | File |
| **Pinecone** | Cloud production | Managed |
| **Weaviate** | Self-hosted | Docker |

### Schema

```yaml
collection: codebase_chunks
fields:
  id: string (uuid)
  content: text
  embedding: vector[1536]
  metadata:
    file_path: string
    chunk_type: enum[function, class, module, doc]
    language: string
    last_modified: timestamp
    git_hash: string
```

---

## Retrieval

### Query Flow

```
Query: "How does authentication work?"
         │
         ▼
┌─────────────────────┐
│  Query Embedding    │
│  (same model)       │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Vector Similarity  │
│  Search (top-k=10)  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Re-ranking         │
│  (relevance score)  │
└─────────────────────┘
         │
         ▼
┌─────────────────────┐
│  Context Assembly   │
│  (token budget)     │
└─────────────────────┘
```

### Hybrid Search

```yaml
search:
  # Combine vector and keyword search
  hybrid:
    enabled: true
    vector_weight: 0.7
    keyword_weight: 0.3

  # Filtering
  filters:
    - file_type
    - directory
    - recency

  # Results
  top_k: 10
  min_score: 0.7
```

---

## Context Assembly

### Token Budget Management

```yaml
context_budget:
  max_tokens: 50000
  allocation:
    system_prompt: 5000
    retrieved_context: 35000
    conversation_history: 8000
    output_buffer: 2000

  prioritization:
    - relevance_score
    - recency
    - file_importance
```

### Smart Truncation

```python
# Pseudo-code
def assemble_context(query, budget):
    chunks = retrieve(query, k=20)
    context = []
    tokens_used = 0

    for chunk in sorted(chunks, key=relevance):
        if tokens_used + chunk.tokens <= budget:
            context.append(chunk)
            tokens_used += chunk.tokens
        else:
            # Summarize remaining if important
            if chunk.relevance > 0.9:
                summary = summarize(chunk)
                context.append(summary)

    return context
```

---

## Incremental Updates

### On File Change

```yaml
update_triggers:
  - file_save
  - git_commit
  - manual_refresh

update_strategy:
  # Only re-index changed files
  incremental: true

  # Batch updates
  debounce_ms: 5000

  # Background processing
  async: true
```

### Git Integration

```bash
# Re-index changed files since last commit
git diff --name-only HEAD~1 | xargs rag-index

# Full re-index (weekly)
rag-index --full --prune
```

---

## Usage

### In Orchestrator

```yaml
# Automatic context retrieval
orchestrator:
  context_retrieval:
    enabled: true
    query_from: issue_title + issue_body
    max_chunks: 15
```

### In Code Review

```yaml
# Retrieve similar code for comparison
code_review:
  similar_code_search:
    enabled: true
    threshold: 0.85
```

### Direct Query

```bash
# CLI usage
/rag "How does the auth middleware work?"

# Returns top 5 relevant code chunks
```

---

## Monitoring

### Index Health

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RAG INDEX STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Total Chunks: 2,450
  Index Size: 45 MB
  Last Updated: 2 hours ago

  By Language:
    TypeScript: 1,200 chunks
    Python: 800 chunks
    Markdown: 450 chunks

  Cache Hit Rate: 78%
  Avg Query Time: 120ms
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Semantic code search for intelligent context retrieval.*
