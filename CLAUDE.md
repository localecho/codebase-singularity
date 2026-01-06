# CLAUDE.md - Codebase Singularity Memory File

> This file is the persistent memory layer for the Agentic System.
> It is read at the start of every session to establish context.

## Project Identity

**Project**: Codebase Singularity Framework
**Version**: 1.0.0
**Architecture**: Agentic Layer wrapping Application Layer

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      AGENTIC LAYER                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐   │
│  │ commands/ │ │  specs/   │ │  skills/  │ │  app_reviews/ │   │
│  │  (Prime)  │ │  (Plans)  │ │  (Tools)  │ │  (Feedback)   │   │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └───────┬───────┘   │
│        │             │             │               │            │
│        └─────────────┴──────┬──────┴───────────────┘            │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────┐    │
│  │                   ORCHESTRATOR                           │    │
│  │            (Plan → Build → Review → Fix)                 │    │
│  └──────────────────────────┬──────────────────────────────┘    │
│                             │                                    │
├─────────────────────────────┼────────────────────────────────────┤
│                             ▼                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  APPLICATION LAYER                       │    │
│  │  ┌─────────┐    ┌───────────┐    ┌─────────────┐        │    │
│  │  │  src/   │    │ database/ │    │   tests/    │        │    │
│  │  │ (Code)  │    │  (Data)   │    │ (Validation)│        │    │
│  │  └─────────┘    └───────────┘    └─────────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Grade Classification

| Grade | Class | Capability | Status |
|-------|-------|------------|--------|
| 1 | Foundation | Memory + Activation | Active |
| 2 | Planning | Specs + AI Docs | Active |
| 3 | Tools | Skills + DB Prompts | Active |
| 4 | Feedback | Closed-Loop Validation | Active |
| 5 | Orchestration | Autonomous Workflows | Active |

## Current Session State

- **Active Workflow**: None
- **Last Spec**: None
- **Open Issues**: 0
- **Pending Reviews**: 0

## Key Directories

| Directory | Purpose | Grade |
|-----------|---------|-------|
| `.claude/commands/` | Agent activation prompts | 1 |
| `specs/` | Pre-implementation plans | 2 |
| `ai_docs/` | External documentation cache | 2 |
| `skills/` | Reusable agent capabilities | 3 |
| `app_reviews/` | Feedback loop storage | 4 |
| `src/` | Application source code | App |
| `database/` | Schema and migrations | App |
| `tests/` | Test suites | App |

## Agent Directives

1. **Always read this file first** - Establish context before action
2. **Write specs before code** - Plan in `specs/` before implementing
3. **Validate all changes** - Run feedback loops after modifications
4. **Log resolutions** - Document fixes in `app_reviews/resolutions/`
5. **Never skip review** - Every change must pass code_review

## Security Controls

The agentic system operates under strict security controls:

| Control | Skill | Purpose |
|---------|-------|---------|
| Audit Logging | `skills/audit_logging.md` | Tamper-evident logging of all agent actions |
| Rate Limiting | `skills/rate_limiting.md` | Prevent runaway loops and resource exhaustion |
| Sandbox | `skills/sandbox.md` | Command allowlisting and safe execution |

### Security Directives

1. **All actions are logged** - Every invocation, file modification, and decision is audited
2. **Iterations are bounded** - Fix loops and workflows have configurable limits
3. **Human approval required** - Limits trigger approval flow before continuing
4. **Commands are sandboxed** - Only allowlisted commands execute; dangerous ops require confirmation
5. **Dry-run first** - Test destructive operations before executing

## Technology Stack

- **Runtime**: [Define your runtime]
- **Database**: [Define your database]
- **Framework**: [Define your framework]
- **Testing**: [Define your test framework]

## Conventions

### Commit Messages
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
```

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts` or `*.spec.ts`
- Specs: `YYYYMMDD-feature-name.md`

## Active Context

> Updated by the orchestrator during workflows

```yaml
workflow: null
phase: idle
spec_file: null
files_modified: []
tests_passed: null
review_status: null
```

---
*This memory file is the source of truth for agentic operations.*
