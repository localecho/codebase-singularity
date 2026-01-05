---
name: context_window
description: Intelligent context window management and optimization
triggers:
  - optimize context
  - manage context
  - context budget
---

# Skill: Intelligent Context Window Management

## Overview

Optimize what goes into the context window with relevance scoring, dynamic selection, summarization, and priority-based inclusion.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           CONTEXT WINDOW MANAGEMENT SYSTEM                  │
│                                                             │
│   Available Context                                         │
│   (Files, History, Docs)                                    │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              RELEVANCE SCORING                       │  │
│   │  - Semantic similarity to query                      │  │
│   │  - Recency weighting                                 │  │
│   │  - Dependency importance                             │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              PRIORITY RANKING                        │  │
│   │  - Critical files (direct relevance)                 │  │
│   │  - Supporting files (dependencies)                   │  │
│   │  - Background (project context)                      │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              CONTEXT ASSEMBLY                        │  │
│   │  - Fit within token budget                           │  │
│   │  - Summarize where needed                            │  │
│   │  - Preserve critical details                         │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   Optimized Context Window                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Relevance Scoring

### Scoring Factors

```yaml
relevance_factors:
  semantic_similarity:
    weight: 0.35
    method: cosine_similarity
    embedding_model: text-embedding-3-small

  keyword_match:
    weight: 0.20
    method: bm25
    boost_exact_match: 2.0

  recency:
    weight: 0.15
    decay: exponential
    half_life: 7_days

  dependency_graph:
    weight: 0.15
    method: pagerank
    consider_imports: true

  usage_frequency:
    weight: 0.10
    source: recent_edits
    window: 30_days

  file_importance:
    weight: 0.05
    boost_files:
      - "*.config.*"
      - "package.json"
      - "CLAUDE.md"
```

### Scoring Output

```yaml
file_scores:
  - file: src/services/UserService.ts
    relevance: 0.95
    reasons:
      - "Directly mentioned in query"
      - "High semantic similarity"
      - "Recently edited"

  - file: src/models/User.ts
    relevance: 0.82
    reasons:
      - "Imported by UserService"
      - "Type definitions needed"

  - file: src/utils/validator.ts
    relevance: 0.45
    reasons:
      - "Used by UserService"
      - "Lower direct relevance"
```

---

## Dynamic Context Selection

### Selection Algorithm

```python
def select_context(query, budget_tokens, available_files):
    """
    Dynamically select files to include in context.
    """
    # Score all files
    scored_files = [
        (file, calculate_relevance(file, query))
        for file in available_files
    ]

    # Sort by relevance
    scored_files.sort(key=lambda x: x[1], reverse=True)

    # Greedy selection within budget
    selected = []
    used_tokens = 0

    for file, score in scored_files:
        file_tokens = count_tokens(file)

        if used_tokens + file_tokens <= budget_tokens:
            selected.append(file)
            used_tokens += file_tokens
        elif score > SUMMARIZE_THRESHOLD:
            # Summarize important files that don't fit
            summary = summarize(file)
            summary_tokens = count_tokens(summary)
            if used_tokens + summary_tokens <= budget_tokens:
                selected.append(summary)
                used_tokens += summary_tokens

    return selected
```

### Budget Allocation

```yaml
context_budget:
  total_tokens: 100000

  allocation:
    system_prompt: 5000     # 5%
    primary_files: 50000    # 50%
    supporting_files: 25000 # 25%
    conversation: 15000     # 15%
    output_buffer: 5000     # 5%

  overflow_strategy:
    1. Summarize oldest conversation
    2. Reduce supporting files
    3. Summarize primary files
```

---

## Summarization for Old Context

### Conversation Summarization

```yaml
conversation_management:
  max_turns_full: 10
  summarize_after: 5

  summary_format: |
    Previous conversation summary:
    - User asked about {topic}
    - Key decisions made: {decisions}
    - Files modified: {files}
    - Current focus: {current_task}

  preserve:
    - Last 3 user messages
    - Last 3 assistant messages
    - All code blocks from recent turns
```

### File Summarization

```yaml
file_summarization:
  triggers:
    - file_tokens > budget_remaining
    - relevance < 0.7

  summary_types:
    interface_only:
      include:
        - Function signatures
        - Type definitions
        - Export statements
      exclude:
        - Implementation details
        - Comments

    key_functions:
      include:
        - Most relevant functions (top 3)
        - Public API
      exclude:
        - Helper functions
        - Tests

    structure_only:
      include:
        - Class/module structure
        - Dependencies
      exclude:
        - All implementation
```

### Summary Example

```
━━━━━ SUMMARIZED: src/services/PaymentService.ts ━━━━━

Exports:
  - class PaymentService
  - interface PaymentResult
  - type PaymentMethod

Key Methods:
  - processPayment(amount: number, method: PaymentMethod): Promise<PaymentResult>
  - refund(transactionId: string): Promise<boolean>
  - getTransactionHistory(userId: string): Promise<Transaction[]>

Dependencies:
  - StripeClient from './clients/stripe'
  - Database from '../db'

[Full file: 450 lines → Summary: 45 tokens]
```

---

## Priority-Based Inclusion

### Priority Levels

```yaml
priority_levels:
  P0_critical:
    description: "Must include in full"
    budget_share: 40%
    examples:
      - Current file being edited
      - File mentioned in query
      - Active error source

  P1_important:
    description: "Include if space, may summarize"
    budget_share: 30%
    examples:
      - Direct dependencies
      - Related test files
      - Configuration files

  P2_supporting:
    description: "Include summary or skip"
    budget_share: 20%
    examples:
      - Transitive dependencies
      - Type definitions
      - Utility functions

  P3_background:
    description: "Skip unless specifically needed"
    budget_share: 10%
    examples:
      - Other project files
      - Historical context
      - Documentation
```

### Inclusion Decision Tree

```
Query: "Fix the authentication bug in UserService"

Decision Process:
├── P0: UserService.ts (mentioned) → INCLUDE FULL
├── P0: Error stack trace → INCLUDE FULL
├── P1: AuthMiddleware.ts (dependency) → INCLUDE FULL
├── P1: User.model.ts (types) → INCLUDE FULL
├── P2: auth.config.ts → SUMMARIZE (interface only)
├── P2: JWTUtils.ts → SUMMARIZE (signatures only)
├── P3: OtherService.ts → SKIP
└── P3: README.md → SKIP

Final Context:
  - 4 full files (2,500 tokens)
  - 2 summaries (150 tokens)
  - System prompt (500 tokens)
  Total: 3,150 / 100,000 tokens
```

---

## Context Visualization

### Dashboard

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         CONTEXT WINDOW STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Budget: 100,000 tokens
  Used:   45,230 tokens (45.2%)

  ┌─────────────────────────────────────────────┐
  │████████████████████░░░░░░░░░░░░░░░░░░░░░░░░│
  └─────────────────────────────────────────────┘

  Allocation:
    System Prompt     [███░░]  4,500 (5%)
    Primary Files     [████████████░░] 25,000 (25%)
    Supporting Files  [████████░░░░░░] 12,000 (12%)
    Conversation      [██░░░░░░░░░░░░]  3,500 (4%)
    Output Buffer     [░░░░░░░░░░░░░░]  5,000 (reserved)

  Files Included:
    📄 UserService.ts      (1,200 tokens) P0
    📄 AuthMiddleware.ts   (800 tokens)   P0
    📄 User.model.ts       (450 tokens)   P1
    📝 auth.config.ts      (75 tokens)    P2 [summarized]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Commands

```bash
# View current context allocation
/context status

# Optimize context for a query
/context optimize "fix auth bug"

# Set budget allocation
/context budget --primary 60% --supporting 25%

# Force include a file
/context include src/critical.ts --priority P0

# Clear conversation history
/context clear-history --keep-last 3
```

---

## Configuration

```yaml
# config/context_window.yaml
context_window:
  total_budget: 100000

  allocation:
    system: 5%
    primary: 50%
    supporting: 25%
    conversation: 15%
    buffer: 5%

  relevance:
    embedding_model: text-embedding-3-small
    recency_half_life: 7d

  summarization:
    enabled: true
    min_relevance: 0.7
    preserve_signatures: true

  conversation:
    max_full_turns: 10
    summarize_after: 5

  priority_boost:
    - pattern: "CLAUDE.md"
      boost: 2.0
    - pattern: "*.test.*"
      boost: 0.5
```

---

*Smart context management for effective AI assistance.*
