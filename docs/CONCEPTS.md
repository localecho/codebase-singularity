# Codebase Singularity Concepts

Understanding the key concepts will help you get the most out of the framework.

## The Agentic Layer

The framework adds an **Agentic Layer** around your existing codebase:

```
┌─────────────────────────────────────────────────────────────────┐
│                      AGENTIC LAYER                               │
│                                                                  │
│   Your AI agent lives here. It has memory, skills, and          │
│   workflows that help it understand and modify your code.       │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                  APPLICATION LAYER                        │  │
│   │                                                           │  │
│   │   Your actual code: src/, tests/, database/, etc.        │  │
│   │                                                           │  │
│   └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. CLAUDE.md - The Memory File

**What it is**: A markdown file at your project root that provides persistent context to the AI agent.

**Why it's called that**: It's designed to be read by Claude (the AI), hence "CLAUDE.md". Think of it as a README for the AI.

**What goes in it**:
- Project description and architecture
- Technology stack information
- Development commands
- Coding conventions
- Current project state

**Do you edit it?**: Yes! You should customize it for your project. Some sections (like "Current State") may be auto-updated by the agent.

### 2. Commands (`/.claude/commands/`)

**What they are**: Invokable prompts that trigger specific agent behaviors.

**How to use them**: Type `/command-name` in Claude Code.

**Examples**:
| Command | Purpose |
|---------|---------|
| `/prime` | Activate the agent, load context |
| `/spec` | Create a specification |
| `/orchestrator` | Run autonomous workflows |
| `/code_review` | Review code for issues |
| `/metrics` | View performance metrics |

**Creating custom commands**: Add a `.md` file to `.claude/commands/`:
```markdown
---
name: my-command
description: What it does
arguments:
  - name: arg1
    description: First argument
    required: true
---

# My Command

Instructions for the agent when this command runs...
```

### 3. Skills (`/skills/`)

**What they are**: Knowledge files that teach the agent how to do specific things.

**How they differ from commands**:
- Commands = things you invoke directly
- Skills = knowledge the agent uses when needed

**Examples**:
| Skill | What it teaches |
|-------|-----------------|
| `git_ops.md` | How to use git commands |
| `package_mgr.md` | How to use npm/pip/cargo |
| `api_test.md` | How to test APIs with curl |

**When skills activate**: The agent reads relevant skills based on what it needs to do. If asked to "commit changes", it will reference `git_ops.md`.

### 4. Workflows (`.claude/workflows/`)

**What they are**: Multi-step processes for common development tasks.

**How they differ from commands**:
- Commands = single action
- Workflows = orchestrated sequence of actions

**Examples**:
| Workflow | Steps |
|----------|-------|
| `feature.md` | Plan → Build → Review → Fix |
| `bugfix.md` | Reproduce → Fix → Verify |
| `security.md` | Scan → Analyze → Remediate → Verify |

**When to use**: Workflows are typically invoked via `/orchestrator`:
```
/orchestrator "Add user authentication" full
```

### 5. Specs (`/specs/`)

**What they are**: Detailed plans written before implementation.

**Why they matter**: The agent writes code based on specs. Better specs = better code.

**Format**: `YYYYMMDD-feature-name.md`

**Contents**:
- Requirements
- Technical design
- Affected files
- Testing strategy
- Success criteria

### 6. AI Docs (`/ai_docs/`)

**What they are**: External documentation cached for the agent.

**Use case**: When working with external APIs or libraries, the agent can fetch and cache their docs here.

**Example**: `ai_docs/supabase-auth.md` contains Supabase auth documentation for reference.

### 7. App Reviews (`/app_reviews/`)

**What they are**: Storage for feedback loop artifacts.

**Contents**:
- `bugs/` - Bug reproduction reports
- `resolutions/` - Documentation of fixes

**Why they matter**: Creates a history of issues and how they were resolved.

## The Grade System

The framework uses a "grade" system to indicate capability levels:

| Grade | Capability | Components |
|-------|------------|------------|
| Grade 1 | Memory & Activation | CLAUDE.md, /prime |
| Grade 2 | Planning | specs/, ai_docs/ |
| Grade 3 | Tools | skills/ |
| Grade 4 | Feedback Loops | app_reviews/, closed-loop commands |

Higher grades = more autonomous operation.

## Closed-Loop Operations

**What they are**: Operations that validate their own results and iterate until successful.

**Example**: The `test_backend` command:
1. **Request**: Run tests
2. **Validate**: Check if all pass
3. **Resolve**: If failures, fix and re-run

This loop continues until tests pass or iteration limit is reached.

## The Orchestrator

**What it is**: A meta-agent that coordinates other agents and workflows.

**How it works**:
```
User: /orchestrator "Add auth" full

Orchestrator:
  1. Activates Planner agent → Creates spec
  2. Activates Builder agent → Writes code
  3. Activates Reviewer agent → Reviews code
  4. Activates Fixer agent → Fixes issues (if any)
  5. Returns: "Feature complete"
```

## Best Practices

1. **Start with CLAUDE.md**: A well-written memory file makes everything else better.

2. **Use /spec before /orchestrator**: Planning first leads to better implementations.

3. **Let feedback loops run**: Don't interrupt the agent mid-loop unless necessary.

4. **Customize skills**: Add skills specific to your project's needs.

5. **Review app_reviews/**: Learn from past bugs and resolutions.

## Common Questions

**Q: Do I commit the agentic layer files?**
A: Yes! `.claude/`, `specs/`, `skills/`, and `app_reviews/` should be committed so your team shares the same agent configuration.

**Q: Can I use this with other AI tools?**
A: The framework is designed for Claude Code but the concepts (memory files, specs, skills) work with any AI assistant.

**Q: How do I disable certain behaviors?**
A: Edit the relevant command or skill file, or create a config in `.claude/config.yaml`.

**Q: What if the agent gets stuck?**
A: Use `/rollback` to undo recent changes, or manually reset with `git reset`.
