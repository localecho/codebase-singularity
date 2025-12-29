# Codebase Singularity Framework

> **The Agentic Layer that wraps your Application Layer**

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         CODEBASE SINGULARITY                                  ║
║                    "The New Ring Around Your Codebase"                        ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

## The Vision

In the age of AI agents, your codebase needs more than just code. It needs an **Agentic Layer** - a structured system that enables AI to:

- **Remember** context across sessions
- **Plan** before coding
- **Execute** autonomously
- **Review** its own work
- **Learn** from feedback loops

This framework implements the complete Codebase Singularity architecture.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AGENTIC LAYER                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                                                                       │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │   │   MEMORY    │  │   SPECS     │  │   SKILLS    │  │  FEEDBACK   │  │  │
│  │   │  CLAUDE.md  │  │  Planning   │  │   Tools     │  │   Loops     │  │  │
│  │   │  .claude/   │  │  AI Docs    │  │  Prompts    │  │   Reviews   │  │  │
│  │   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │                                                                       │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │   │                      ORCHESTRATOR                               │ │  │
│  │   │              Plan → Build → Review → Fix                        │ │  │
│  │   └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                                    ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        APPLICATION LAYER                              │  │
│  │   ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐   │  │
│  │   │   src/    │    │ database/ │    │  tests/   │    │  config   │   │  │
│  │   │   Code    │    │  Schema   │    │  Specs    │    │   Env     │   │  │
│  │   └───────────┘    └───────────┘    └───────────┘    └───────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
codebase-singularity/
│
├── CLAUDE.md                    # 🧠 Memory File (Grade 1)
│                                #    Persistent context across sessions
│
├── .claude/
│   └── commands/                # ⚡ Activators (Grade 1)
│       ├── prime.md             #    Session initialization
│       ├── code_review.md       #    Closed-loop review (Grade 4)
│       ├── test_backend.md      #    Backend testing loop (Grade 4)
│       ├── test_frontend.md     #    Frontend testing loop (Grade 4)
│       └── orchestrator.md      #    Class 3 autonomous workflows
│
├── specs/                       # 📋 Planning (Grade 2)
│   ├── TEMPLATE.md              #    Spec template
│   └── CURRENT.md               #    Active specification
│
├── ai_docs/                     # 📚 AI Documentation Cache (Grade 2)
│   └── README.md                #    Documentation fetching guide
│
├── skills/                      # 🛠️ Tools & Skills (Grade 3)
│   ├── start_stop_app.md        #    Application lifecycle
│   ├── prime_db.md              #    Database operations via CLI
│   └── fetch_docs.md            #    Documentation fetching
│
├── app_reviews/                 # 🔄 Feedback Loops (Grade 4)
│   ├── README.md                #    Feedback loop documentation
│   ├── bugs/                    #    Bug reproduction reports
│   │   └── TEMPLATE.md
│   └── resolutions/             #    Resolution documentation
│       └── TEMPLATE.md
│
│─────────────────────────────── APPLICATION LAYER ──────────────────────────
│
├── src/                         # 💻 Application source code
│   └── (your code here)
│
├── database/                    # 🗄️ Database schemas and migrations
│   └── (your schemas here)
│
└── tests/                       # 🧪 Test suites
    └── (your tests here)
```

---

## The Grade System

### Class 1: Foundation → Full Autonomy

| Grade | Capability | Components |
|-------|------------|------------|
| **Grade 1** | Memory & Activation | `CLAUDE.md`, `commands/prime.md` |
| **Grade 2** | Planning & Context | `specs/`, `ai_docs/` |
| **Grade 3** | Tools & Skills | `skills/` |
| **Grade 4** | Feedback Loops | `app_reviews/`, closed-loop prompts |

### Class 2: Multi-Agent Coordination
(Future: Multiple specialized agents working together)

### Class 3: Full Orchestration
The Orchestrator Agent can run complete Plan → Build → Review → Fix cycles autonomously.

---

## Quick Start

### 1. Initialize Memory

The agent reads `CLAUDE.md` at session start:
```bash
# Just start a Claude Code session in this directory
cd codebase-singularity
claude
```

### 2. Prime the Session

Activate with specific context:
```
/prime plan feature-auth
```

### 3. Run Autonomous Workflow

Let the Orchestrator handle a complete feature:
```
/orchestrator "Add user authentication with magic link login" full
```

### 4. Review Work

Use closed-loop review:
```
/code_review src/auth
```

---

## Key Concepts

### The Prime Command

The "activator" that establishes session context:

```markdown
/prime [workflow] [spec]

Workflows:
- plan     # Focus on planning/spec writing
- build    # Focus on implementation
- review   # Focus on code review
- fix      # Focus on bug fixing
- full     # Complete plan-build-review-fix cycle
```

### Closed-Loop Feedback

Grade 4 systems don't just generate - they **validate**:

```
REQUEST → EXECUTE → VALIDATE → RESOLVE (or loop back)

Example:
1. REQUEST: "Write tests for auth module"
2. EXECUTE: Write the tests
3. VALIDATE: Run tests, check coverage
4. RESOLVE: If pass → done, if fail → fix and re-validate
```

### The Orchestrator

Class 3 autonomous execution:

```
TASK → PLAN → BUILD → REVIEW → FIX → DONE
         │               │         │
         └───────────────┴─────────┘
              (loop until resolved)
```

---

## Usage Examples

### Feature Development
```
# Plan first
/prime plan
# Write spec for new feature
# Then build
/orchestrator "Implement spec 20240101-auth-system" full
```

### Bug Fixing
```
# Document the bug
/prime fix
# Create bug report
# Then fix
/orchestrator "Fix BUG-20240101-0001" quick
```

### Code Review
```
# Review recent changes
/code_review
# Or specific files
/code_review src/api security
```

### Database Operations
```
# Use prime_db skill
# Query: "Show all users created today"
# Migrate: "Add email_verified column to users"
```

---

## Philosophy

> **"The Agentic Layer is the new ring around your codebase."**

Traditional development:
```
Human → Code → Deploy
```

Agentic development:
```
Human → Agent → [Plan → Build → Review → Fix] → Code → Deploy
                         (autonomous loop)
```

The agent becomes a **first-class citizen** of your development workflow, not just a tool.

---

## Contributing

1. Fork this framework
2. Add your own skills to `skills/`
3. Customize prompts for your workflow
4. Share what works!

---

## License

MIT - Use it, modify it, ship it.

---

*Built for the age of agents.*
