# AI Documentation Cache

This directory stores external documentation fetched by sub-agents for context.

## Purpose

When the agent needs to understand external APIs, libraries, or services:
1. A fetch-docs sub-agent retrieves the documentation
2. The relevant portions are cached here
3. The main agent references this cache instead of re-fetching

## Directory Structure

```
ai_docs/
├── README.md           # This file
├── apis/               # External API documentation
├── libraries/          # Library/framework docs
├── services/           # Third-party service docs
└── standards/          # Standards and conventions
```

## File Format

Each cached document should include:

```markdown
# [Service/Library Name]

**Source**: [URL]
**Fetched**: [Date]
**Version**: [Version if applicable]

## Summary
[Quick overview for the agent]

## Key Concepts
[Important information]

## Code Examples
[Relevant examples]

## Gotchas
[Common pitfalls]
```

## Maintenance

- Documents older than 30 days should be re-fetched
- Remove documents for deprecated dependencies
- Update when major versions change

---
*Managed by fetch-docs sub-agent*
