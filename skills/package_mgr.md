---
name: package_mgr
description: Unified package manager operations (npm, pip, cargo, etc.)
triggers:
  - install
  - add package
  - remove package
  - update
  - dependencies
  - outdated
---

# Skill: Package Manager

Unified interface for npm, pip, cargo, go, and other package managers.

## Auto-Detection

Detect package manager from project files:

| File | Manager | Language |
|------|---------|----------|
| package.json | npm/yarn/pnpm | JavaScript/TypeScript |
| requirements.txt | pip | Python |
| Pipfile | pipenv | Python |
| pyproject.toml | poetry/pip | Python |
| Cargo.toml | cargo | Rust |
| go.mod | go | Go |
| Gemfile | bundler | Ruby |
| composer.json | composer | PHP |

---

## npm/yarn/pnpm Operations

### Install Dependencies
```bash
# Install all
npm install
yarn install
pnpm install

# Install specific
npm install <package>
yarn add <package>
pnpm add <package>

# Dev dependency
npm install -D <package>
yarn add -D <package>
pnpm add -D <package>
```

### Remove Package
```bash
npm uninstall <package>
yarn remove <package>
pnpm remove <package>
```

### Update
```bash
npm update
yarn upgrade
pnpm update

# Specific package
npm update <package>
```

### List Outdated
```bash
npm outdated
yarn outdated
pnpm outdated
```

### Run Scripts
```bash
npm run <script>
yarn <script>
pnpm <script>
```

### Audit Security
```bash
npm audit
npm audit fix
yarn audit
```

---

## pip Operations

### Install
```bash
# From requirements
pip install -r requirements.txt

# Specific package
pip install <package>
pip install <package>==<version>

# Upgrade
pip install --upgrade <package>
```

### Remove
```bash
pip uninstall <package>
```

### List
```bash
pip list
pip list --outdated
pip freeze > requirements.txt
```

### Show Package Info
```bash
pip show <package>
```

---

## poetry Operations

### Install
```bash
poetry install
poetry add <package>
poetry add --dev <package>
```

### Remove
```bash
poetry remove <package>
```

### Update
```bash
poetry update
poetry update <package>
```

### Show
```bash
poetry show
poetry show --outdated
```

---

## cargo Operations (Rust)

### Build & Run
```bash
cargo build
cargo build --release
cargo run
```

### Dependencies
```bash
cargo add <crate>
cargo remove <crate>
cargo update
```

### Check
```bash
cargo check
cargo clippy
cargo audit
```

---

## go Operations

### Dependencies
```bash
go get <package>
go mod tidy
go mod download
```

### Build
```bash
go build
go build -o <output>
```

---

## Unified Commands

The skill normalizes operations across managers:

| Unified | npm | pip | cargo |
|---------|-----|-----|-------|
| install all | `npm install` | `pip install -r requirements.txt` | `cargo build` |
| add pkg | `npm install pkg` | `pip install pkg` | `cargo add pkg` |
| remove pkg | `npm uninstall pkg` | `pip uninstall pkg` | `cargo remove pkg` |
| outdated | `npm outdated` | `pip list --outdated` | `cargo outdated` |
| audit | `npm audit` | `pip-audit` | `cargo audit` |

---

## Output Parsing

### Parse npm install output
```yaml
packages:
  added: 42
  removed: 0
  changed: 5
  audit:
    vulnerabilities: 0
  timing: "12.345s"
```

### Parse pip output
```yaml
installed:
  - name: requests
    version: 2.28.0
    location: /path/to/site-packages
```

---

## Common Workflows

### Fresh Install
```bash
# Detect manager
if [ -f "package.json" ]; then
    npm install
elif [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
elif [ -f "Cargo.toml" ]; then
    cargo build
fi
```

### Add Development Dependency
```bash
# Context-aware
case $MANAGER in
    npm)  npm install -D "$PACKAGE" ;;
    pip)  pip install "$PACKAGE" && echo "$PACKAGE" >> requirements-dev.txt ;;
    cargo) cargo add --dev "$PACKAGE" ;;
esac
```

### Security Audit
```bash
# Run audit for detected manager
npm audit --json 2>/dev/null | jq '.vulnerabilities'
pip-audit --format=json 2>/dev/null
cargo audit --json 2>/dev/null
```

---

## Error Handling

| Error | Manager | Resolution |
|-------|---------|------------|
| ENOENT | npm | Run `npm init` first |
| ModuleNotFoundError | pip | Create virtualenv first |
| could not find crate | cargo | Check crates.io name |
| network error | all | Check connectivity |
| version conflict | all | Review dependency tree |

---

## Integration

This skill integrates with:
- `/prime` for project setup
- `test_backend` / `test_frontend` for dependency management
- Build processes in orchestrator workflows
