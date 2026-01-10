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

---

# Ralph Loop Development Methodology

## Autonomous Development Protocol

This project uses **Ralph Loop** - a continuous AI agent methodology for iterative development. Named after Ralph Wiggum, it embodies persistent iteration until completion.

### How It Works

1. Claude receives a task with clear completion criteria
2. Works autonomously, iterating until done
3. State persists in files and git, not context
4. Fresh context on each loop prevents pollution
5. Completion signaled via `<promise>COMPLETE</promise>`

### Starting a Ralph Loop

```bash
/ralph-loop "Your task description. Requirements: [list]. Output <promise>COMPLETE</promise> when done." --max-iterations 50
```

### Writing Effective Prompts

**Good prompts have:**
- Binary success criteria (testable pass/fail)
- Incremental phases for complex work
- Self-correction loops (run tests, fix, repeat)
- Escape hatches (`--max-iterations`)

**Example:**
```
Implement user authentication with JWT.

Phase 1: Create auth routes (register, login, logout)
Phase 2: Add JWT token generation and validation
Phase 3: Create auth middleware
Phase 4: Write tests (>80% coverage)
Phase 5: Update README with API docs

Run tests after each phase. Fix any failures before proceeding.
Output <promise>COMPLETE</promise> when all phases pass.
```

---

## Long-Form Autonomous Thinking

### When to Think Deeply

Use extended reasoning for:
- Architectural decisions affecting multiple files
- Debugging complex issues across the codebase
- Planning multi-step implementations
- Evaluating trade-offs between approaches

### Subagent Strategy

Launch specialized subagents for parallel work:

| Agent Type | Use Case |
|------------|----------|
| `Explore` | Codebase search, finding patterns |
| `Plan` | Architecture design, implementation strategy |
| `Bash` | Git operations, builds, deployments |
| `general-purpose` | Complex multi-step research |

**Parallel execution example:**
```
When researching a feature, launch:
- Explore agent: Find similar patterns in codebase
- Plan agent: Design implementation approach
- general-purpose agent: Research external docs
```

### Context Management

- State lives in files and git, not LLM memory
- Each loop iteration gets fresh context
- Use @fix_plan.md to track progress across sessions
- Commit frequently to preserve work

---

## Completion Criteria Standards

### For Features
```
Feature is COMPLETE when:
- [ ] All acceptance criteria met
- [ ] Tests pass (coverage >80%)
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] README updated if needed
Output: <promise>COMPLETE</promise>
```

### For Bug Fixes
```
Bug fix is COMPLETE when:
- [ ] Root cause identified and documented
- [ ] Fix implemented
- [ ] Regression test added
- [ ] All existing tests pass
Output: <promise>COMPLETE</promise>
```

### For Refactoring
```
Refactor is COMPLETE when:
- [ ] Code restructured as specified
- [ ] No behavior changes (tests verify)
- [ ] All tests pass
- [ ] No new TypeScript errors
Output: <promise>COMPLETE</promise>
```

---

## Anti-Patterns to Avoid

1. **Vague goals** - "Make it better" has no exit condition
2. **Skipping tests** - No verification = no convergence
3. **Unlimited iterations** - Always set `--max-iterations`
4. **Monolithic tasks** - Break into phases
5. **Context pollution** - Let loops refresh context naturally

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/ralph-loop "..."` | Start autonomous loop |
| `/cancel-ralph` | Stop current loop |
| `--max-iterations N` | Safety limit |
| `--completion-promise "X"` | Custom exit phrase |

---

*Ralph Loop methodology based on [Geoffrey Huntley's original technique](https://ghuntley.com/ralph/)*
