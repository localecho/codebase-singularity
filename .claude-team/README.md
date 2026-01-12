# Team Configuration

Share configuration and standards across your development team.

## Directory Structure

```
.claude-team/
├── README.md              # This file
├── config.yaml            # Team-wide settings
├── templates/
│   └── CLAUDE.md.template # CLAUDE.md template for consistency
└── skills/                # Team-shared skills (optional)
```

## Configuration Precedence

Settings are merged in this order (later wins):

1. **Project** (`.claude/config.yaml`) - Base project settings
2. **Team** (`.claude-team/config.yaml`) - Committed team standards
3. **User** (`~/.claude/config.yaml`) - Personal preferences

## Team Config File

```yaml
# .claude-team/config.yaml
team:
  name: "Engineering Team"
  lead: "team-lead@company.com"

standards:
  code_review:
    required: true
    min_approvals: 1
    focus_on:
      - security
      - types
      - tests

  testing:
    min_coverage: 80
    require_tests_for_features: true

  workflows:
    require_spec: true
    max_fix_iterations: 3

security:
  prevent_secrets_in_claude_md: true
  pre_commit_hook: true
```

## CLAUDE.md Template

Create `.claude-team/templates/CLAUDE.md.template` to ensure consistency:

```markdown
# {{PROJECT_NAME}}

## Project Identity
<!-- LOCKED: Do not modify -->
{{PROJECT_DESCRIPTION}}

## Architecture
<!-- LOCKED: Synced from template -->
{{ARCHITECTURE_DIAGRAM}}

## Agent Directives
<!-- Can be customized -->
- Follow team coding standards
- Run tests before committing
```

### Locked Sections

Sections marked `<!-- LOCKED -->` are synced from the template during `/prime`.
Developers can customize unlocked sections.

### Template Variables

| Variable | Description |
|----------|-------------|
| `{{PROJECT_NAME}}` | From package.json or directory name |
| `{{PROJECT_DESCRIPTION}}` | From package.json description |
| `{{ARCHITECTURE_DIAGRAM}}` | Generated from codebase analysis |
| `{{STACK}}` | Auto-detected tech stack |

## Sync Command

Keep team members' CLAUDE.md in sync:

```bash
# During /prime, the framework will:
# 1. Check if CLAUDE.md differs from template
# 2. Show diff of locked sections
# 3. Offer to sync locked sections
```

## Pre-commit Hook

The team config can enable a pre-commit hook that:
- Scans CLAUDE.md for secrets
- Validates CLAUDE.md structure
- Checks locked sections haven't been modified

Install with:
```bash
git config core.hooksPath .githooks
```

## Migration Guide

### For Team Leads

1. Create `.claude-team/` directory
2. Add `config.yaml` with team standards
3. Create `CLAUDE.md.template`
4. Commit to repository
5. Tell team to run `/prime` to sync

### For Team Members

1. Pull latest changes
2. Run `/prime` to apply team config
3. Review and accept synced sections
4. Personal overrides go in `~/.claude/config.yaml`
