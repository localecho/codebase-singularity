# Monorepo Support

Guide for using Codebase Singularity with monorepo projects.

## Overview

The framework supports monorepos through:
- Nested CLAUDE.md files
- Package-scoped commands
- Directory-aware context

## Directory Structure

```
my-monorepo/
├── CLAUDE.md                     # Root-level memory (shared context)
├── .claude/
│   ├── commands/                 # Root commands (available everywhere)
│   └── config.yaml               # Root configuration
│
├── packages/
│   ├── api/
│   │   ├── CLAUDE.md             # API-specific context
│   │   ├── .claude/
│   │   │   └── commands/         # API-specific commands
│   │   ├── src/
│   │   └── tests/
│   │
│   ├── web/
│   │   ├── CLAUDE.md             # Web app context
│   │   ├── .claude/
│   │   │   └── commands/
│   │   ├── src/
│   │   └── tests/
│   │
│   └── shared/
│       ├── CLAUDE.md             # Shared library context
│       └── src/
│
├── specs/                        # Shared specs (or per-package)
├── skills/                       # Shared skills
└── app_reviews/                  # Shared reviews
```

## Nested CLAUDE.md Files

Each package can have its own CLAUDE.md that:
- Inherits from root CLAUDE.md
- Overrides package-specific details
- Defines local conventions

### Root CLAUDE.md

```markdown
# CLAUDE.md - Monorepo Root

## Project Identity

**Project**: My Monorepo
**Type**: Monorepo with multiple packages

## Packages

| Package | Description | Tech Stack |
|---------|-------------|------------|
| api | Backend REST API | Node.js, Express |
| web | Frontend web app | Next.js, React |
| shared | Shared utilities | TypeScript |

## Shared Conventions

- Use TypeScript for all packages
- Jest for testing
- ESLint for linting
- Conventional commits

## Monorepo Commands

\`\`\`bash
npm install          # Install all packages
npm run build        # Build all packages
npm run test         # Test all packages
npm run lint         # Lint all packages
\`\`\`
```

### Package CLAUDE.md

```markdown
# CLAUDE.md - API Package

> This file extends the root CLAUDE.md with API-specific context.

## Package Identity

**Package**: @monorepo/api
**Path**: packages/api
**Type**: REST API Server

## Tech Stack

- Runtime: Node.js 20
- Framework: Express 4
- Database: PostgreSQL
- ORM: Prisma

## Package Commands

\`\`\`bash
npm run dev          # Start dev server (port 3001)
npm run test         # Run API tests
npm run migrate      # Run database migrations
\`\`\`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /users | List users |
| POST | /users | Create user |
| ... | ... | ... |

## Local Conventions

- All routes in src/routes/
- Middleware in src/middleware/
- Database models in src/models/
```

## Context Resolution

When you run a command, the framework:

1. **Detects current directory**
2. **Finds nearest CLAUDE.md** (walking up)
3. **Merges with root CLAUDE.md**
4. **Applies package-specific overrides**

### Resolution Order

```
Current Directory: packages/api/src/
  ↓
packages/api/CLAUDE.md (if exists)
  ↓
CLAUDE.md (root)
  ↓
Merged context for agent
```

## Package-Scoped Commands

### Local Commands

Commands in `packages/api/.claude/commands/` are only available when working in that package:

```bash
cd packages/api
/deploy-api          # Works - local command
cd ../web
/deploy-api          # Not found - different package
```

### Root Commands

Commands in `.claude/commands/` are available everywhere:

```bash
cd packages/api
/prime               # Works - root command
cd packages/web
/prime               # Works - root command
```

### Overriding Root Commands

A package can override a root command by creating a file with the same name:

```
.claude/commands/deploy.md        # Root deploy
packages/api/.claude/commands/deploy.md  # API-specific deploy
```

When in `packages/api`, the local version is used.

## Configuration Merging

`.claude/config.yaml` files are merged:

```yaml
# Root config (.claude/config.yaml)
commands:
  test_backend:
    coverage_threshold: 80

# Package config (packages/api/.claude/config.yaml)
commands:
  test_backend:
    coverage_threshold: 90  # Override for this package
```

## Scoped Testing

### Run Tests for Current Package

```
/test_backend
```

Automatically detects and runs tests for the current package.

### Run All Tests

```
/test_backend --all
```

Runs tests across all packages.

### Run Tests for Specific Package

```
/test_backend --package api
```

## Scoped Specs

### Package-Specific Specs

Create specs in package directories:

```
packages/api/specs/20240101-add-auth.md
```

### Shared Specs

Create specs in root for cross-package features:

```
specs/20240101-auth-system.md
```

Reference affected packages in the spec.

## Working with Workspaces

### npm Workspaces

```json
// package.json
{
  "workspaces": [
    "packages/*"
  ]
}
```

### Package Commands

```bash
# From root
npm run -w @monorepo/api dev      # Run dev in api
npm run -w @monorepo/web build    # Build web
npm test --workspaces             # Test all
```

## Tips

### 1. Keep Root CLAUDE.md High-Level

Focus on:
- Project overview
- Package relationships
- Shared conventions
- Cross-cutting concerns

### 2. Keep Package CLAUDE.md Focused

Focus on:
- Package-specific tech stack
- Local commands
- API/interface documentation
- Package conventions

### 3. Use Shared Skills

Put reusable skills in root `skills/`:
- Database operations
- API testing
- Deployment

### 4. Scope Workflows

For cross-package features:
1. Create spec in root `specs/`
2. List affected packages
3. Orchestrator handles coordination

### 5. Consistent Naming

Use consistent naming across packages:
- `src/` for source
- `tests/` for tests
- `CLAUDE.md` for context
- `.claude/` for config
