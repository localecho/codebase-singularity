---
name: init
description: Initialize the Codebase Singularity framework for a new project
arguments:
  - name: template
    description: "Optional template: basic, nextjs, express, django, fastapi"
    required: false
---

# Initialize Codebase Singularity

Set up the framework for first-time use in this project.

## Welcome!

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   Welcome to Codebase Singularity!                                            ║
║                                                                               ║
║   This command will set up everything you need to get started.                ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

## Step 1: Check Prerequisites

Verify the environment:
- [ ] Is this a git repository? (`git status`)
- [ ] Does CLAUDE.md exist? (create if not)
- [ ] Does .claude/ directory exist? (create if not)

## Step 2: Create Directory Structure

```bash
# Create agentic layer directories
mkdir -p .claude/commands
mkdir -p .claude/agents
mkdir -p .claude/workflows
mkdir -p .claude/metrics
mkdir -p .claude/handoffs
mkdir -p specs
mkdir -p ai_docs
mkdir -p skills
mkdir -p app_reviews/bugs
mkdir -p app_reviews/resolutions
```

## Step 3: Detect Project Type

Auto-detect from files:

| File | Project Type | Template |
|------|-------------|----------|
| package.json + next.config.js | Next.js | nextjs |
| package.json (no framework) | Node.js | express |
| requirements.txt + manage.py | Django | django |
| requirements.txt + app.py | Flask/FastAPI | fastapi |
| Cargo.toml | Rust | rust |
| go.mod | Go | go |
| (none) | Basic | basic |

## Step 4: Generate CLAUDE.md

If CLAUDE.md doesn't exist, create from template:

```markdown
# CLAUDE.md - Project Memory File

> This file provides context for the AI agent.
> Edit the sections below to describe your project.

## Project Identity

**Project**: [Your project name]
**Version**: 1.0.0
**Description**: [Brief description]

## Technology Stack

- **Language**: [e.g., TypeScript, Python]
- **Framework**: [e.g., Next.js, Django]
- **Database**: [e.g., PostgreSQL, MongoDB]
- **Testing**: [e.g., Jest, pytest]

## Architecture

[Describe your project structure]

## Development Commands

\`\`\`bash
npm install    # Install dependencies
npm run dev    # Start development
npm test       # Run tests
\`\`\`

## Agent Directives

1. Follow existing code patterns
2. Write tests for new features
3. Keep functions focused and small
4. Document public APIs

## Current State

- **Workflow**: None
- **Active Spec**: None
```

## Step 5: Initialize State

Create `.claude/state.json`:
```json
{
  "version": "1.0.0",
  "initialized": true,
  "initialized_at": "[timestamp]",
  "project_type": "[detected]",
  "lastSession": null,
  "currentSession": null,
  "activeSpec": null,
  "workflow": null,
  "todos": [],
  "recentCommands": [],
  "context": {}
}
```

## Step 6: Validate Setup

Run validation checks:
- [ ] CLAUDE.md is valid markdown
- [ ] All directories exist
- [ ] state.json is valid JSON
- [ ] At least one command exists

## Step 7: Show Success

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   ✓ Codebase Singularity initialized successfully!                            ║
║                                                                               ║
║   Created:                                                                    ║
║     • CLAUDE.md (project memory)                                              ║
║     • .claude/ (commands, agents, workflows)                                  ║
║     • specs/ (specifications)                                                 ║
║     • skills/ (agent capabilities)                                            ║
║     • app_reviews/ (feedback loops)                                           ║
║                                                                               ║
║   Next steps:                                                                 ║
║     1. Edit CLAUDE.md to describe your project                                ║
║     2. Run /prime to activate the agent                                       ║
║     3. Try /spec "Add a new feature" to create your first spec                ║
║                                                                               ║
║   Need help? Run /help or visit the docs.                                     ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

## Available After Init

| Command | Description |
|---------|-------------|
| `/prime` | Activate the agent for this session |
| `/spec` | Create a specification |
| `/orchestrator` | Run autonomous workflows |
| `/metrics` | View agent metrics |
| `/help` | Get help |
