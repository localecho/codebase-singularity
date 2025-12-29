---
name: fetch_docs
description: Sub-agent skill for fetching and caching external documentation
triggers:
  - fetch docs for
  - get documentation
  - cache api docs
---

# Skill: Fetch Documentation

This skill enables a sub-agent to fetch external documentation and cache it for the main agent.

## Purpose

When working with external APIs or libraries, the agent needs context. This skill:
1. Fetches relevant documentation
2. Extracts key information
3. Caches it in `ai_docs/` for future reference

## Workflow

### 1. Identify Documentation Need

When the agent encounters:
- Unknown API endpoints
- Unfamiliar library methods
- External service integration

### 2. Fetch Documentation

```bash
# Use WebFetch tool to get docs
# Target official documentation sites
```

Sources priority:
1. Official documentation
2. GitHub README
3. API reference
4. Stack Overflow (for examples)

### 3. Extract Key Information

Focus on:
- **Quick Start**: How to get started
- **API Reference**: Endpoints, methods, parameters
- **Examples**: Working code samples
- **Gotchas**: Common mistakes and solutions

### 4. Cache in ai_docs/

Save to appropriate subdirectory:
- `ai_docs/apis/` - External API docs
- `ai_docs/libraries/` - Package/library docs
- `ai_docs/services/` - Third-party service docs

## Template for Cached Docs

```markdown
# [Name]

**Source**: [URL]
**Fetched**: [Date]
**Relevance**: [Why this is needed]

## Quick Reference

[Most important info for the agent]

## Key Methods/Endpoints

### [Method/Endpoint 1]
- Purpose: ...
- Parameters: ...
- Returns: ...
- Example: ...

### [Method/Endpoint 2]
...

## Common Patterns

[Typical usage patterns]

## Error Handling

[How to handle common errors]

## Notes

[Additional context]
```

## Example: Fetching Stripe API Docs

```
1. Fetch: https://stripe.com/docs/api
2. Extract: Payment intents, customers, webhooks
3. Cache: ai_docs/apis/stripe.md
4. Update: CLAUDE.md to note availability
```

## Maintenance

- Check cache age (>30 days = stale)
- Remove docs for unused dependencies
- Update when versions change

---
*Sub-agent skill for documentation management*
