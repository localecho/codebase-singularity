# Command Authoring Guide

Learn how to create custom commands for the Codebase Singularity framework.

## What is a Command?

A command is a markdown file in `.claude/commands/` that defines:
- A name (how to invoke it)
- Arguments (parameters it accepts)
- Instructions (what the agent should do)

When you type `/my-command` in Claude Code, the agent reads the corresponding `.claude/commands/my-command.md` file.

## File Structure

```markdown
---
name: command-name
description: Short description of what it does
arguments:
  - name: arg1
    description: What this argument is for
    required: true
  - name: arg2
    description: Optional argument
    required: false
---

# Command Title

Instructions for the agent when this command runs...
```

## The Frontmatter

The YAML frontmatter at the top of the file defines metadata:

### Required Fields

| Field | Description |
|-------|-------------|
| `name` | The command name (used for `/name`) |
| `description` | Brief description shown in help |

### Optional Fields

| Field | Description | Default |
|-------|-------------|---------|
| `arguments` | List of arguments | `[]` |
| `triggers` | Natural language phrases | `[]` |
| `hidden` | Hide from help listing | `false` |

### Arguments Schema

Each argument can have:
```yaml
arguments:
  - name: myarg
    description: What it's for
    required: true
    default: "default value"
    enum: ["option1", "option2"]
```

## Using Arguments

In the command body, reference arguments with `{{argument_name}}`:

```markdown
---
name: greet
arguments:
  - name: name
    description: Name to greet
    required: true
---

# Greet Command

Say hello to {{name}}!
```

Usage: `/greet John` → "Say hello to John!"

## Example Commands

### Simple Command

```markdown
---
name: hello
description: A simple greeting
---

# Hello

Respond with a friendly greeting to the user.
```

### Command with Arguments

```markdown
---
name: deploy
description: Deploy to an environment
arguments:
  - name: environment
    description: "Target: staging or production"
    required: true
    enum: ["staging", "production"]
  - name: version
    description: Version tag to deploy
    required: false
    default: "latest"
---

# Deploy to {{environment}}

## Pre-deployment Checks

1. Verify environment is {{environment}}
2. Check version: {{version}}
3. Run tests before deploying

## Deployment Steps

\`\`\`bash
# Deploy version {{version}} to {{environment}}
./deploy.sh --env {{environment}} --version {{version}}
\`\`\`
```

### Complex Command with Phases

```markdown
---
name: feature
description: Create a new feature
arguments:
  - name: name
    description: Feature name
    required: true
---

# Create Feature: {{name}}

## Phase 1: Planning

1. Create spec file at `specs/{{name}}.md`
2. Analyze existing code for patterns
3. Identify affected files

## Phase 2: Implementation

1. Create feature branch
2. Implement according to spec
3. Write tests

## Phase 3: Review

1. Run linters
2. Run tests
3. Self-review code

## Completion

Mark feature as complete when all phases pass.
```

## Best Practices

### 1. Clear Names
```markdown
# Good
name: create-user
name: run-tests
name: deploy-staging

# Avoid
name: cu
name: do-thing
name: x
```

### 2. Helpful Descriptions
```markdown
# Good
description: Create a new user account with email verification

# Avoid
description: Creates user
```

### 3. Validate Input
```markdown
## Input Validation

Before proceeding, verify:
- [ ] {{name}} is not empty
- [ ] {{name}} follows naming convention
- [ ] No existing feature with this name
```

### 4. Provide Feedback
```markdown
## Output

After completion, show:
\`\`\`
Feature "{{name}}" created successfully!
- Spec: specs/{{name}}.md
- Branch: feature/{{name}}
- Next: Run /orchestrator to implement
\`\`\`
```

### 5. Handle Errors
```markdown
## Error Handling

If any step fails:
1. Show clear error message
2. Suggest resolution
3. Offer to rollback partial changes
```

## Testing Commands

### Manual Testing

1. Create your command file
2. Run it with `/your-command`
3. Check the agent follows instructions
4. Test with different arguments

### Validation Checklist

- [ ] Frontmatter parses correctly
- [ ] Required arguments are enforced
- [ ] Default values work
- [ ] Instructions are clear
- [ ] Error cases are handled

## Command Discovery

Commands are discovered from:

1. `.claude/commands/` in the project
2. `~/.claude/commands/` for user-global commands
3. `.claude-team/commands/` for team-shared commands

Priority: project > user > team

## Advanced Features

### Triggers (Natural Language Invocation)

```yaml
triggers:
  - "create a new feature"
  - "start feature"
  - "new feature called"
```

This allows natural language invocation:
"Create a new feature called auth" → runs `/feature auth`

### Hidden Commands

```yaml
hidden: true
```

Hidden commands don't appear in `/help` but can still be invoked.

### Composing Commands

One command can suggest running another:

```markdown
## Next Steps

1. Review the generated spec
2. Run `/orchestrator "Implement {{name}}" full` to build
3. Run `/test_backend` to verify
```

## Troubleshooting

### Command Not Found

- Check file is in `.claude/commands/`
- Verify filename matches command name
- Ensure `.md` extension

### Arguments Not Working

- Check frontmatter YAML syntax
- Verify argument names match usage
- Use `{{arg}}` not `$arg` or `{arg}`

### Unexpected Behavior

- Read the command output carefully
- Add more specific instructions
- Use explicit step numbering
