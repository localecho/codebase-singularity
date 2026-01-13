---
name: python_lint
description: Python linting and formatting with ruff, black, and mypy
triggers:
  - lint python
  - format code
  - type check
  - ruff
  - black
  - mypy
---

# Skill: Python Linting and Formatting

This skill teaches the agent to lint, format, and type-check Python code using modern tooling: ruff, black, and mypy.

## Philosophy

> Automate code style enforcement. Use ruff for speed, black for formatting, and mypy for type safety. Configure once, enforce everywhere.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               PYTHON CODE QUALITY PIPELINE                   │
│                                                             │
│   Source Code                                                │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              RUFF (Linting)                          │  │
│   │  - Style violations (pycodestyle)                    │  │
│   │  - Bug detection (pyflakes, bugbear)                 │  │
│   │  - Import sorting (isort)                            │  │
│   │  - Security checks (bandit)                          │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              BLACK (Formatting)                      │  │
│   │  - Consistent code formatting                        │  │
│   │  - Line length enforcement                           │  │
│   │  - String quote normalization                        │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              MYPY (Type Checking)                    │  │
│   │  - Static type analysis                              │  │
│   │  - Type annotation validation                        │  │
│   │  - Generic type inference                            │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   Clean, Typed, Formatted Code                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Ruff - Fast Python Linter

### Installation

```bash
# Install ruff
pip install ruff

# Or with Poetry
poetry add --group dev ruff

# Or with uv
uv pip install ruff

# Verify installation
ruff --version
```

### Basic Commands

```bash
# Check all files
ruff check .

# Check specific file
ruff check src/main.py

# Check with auto-fix
ruff check --fix .

# Check and show fixes without applying
ruff check --diff .

# Watch mode (continuous)
ruff check --watch .

# Output in JSON format
ruff check --output-format json .
```

### Ruff as Formatter

```bash
# Ruff includes a Black-compatible formatter
ruff format .

# Check formatting without changing files
ruff format --check .

# Show diff of what would change
ruff format --diff .

# Format specific file
ruff format src/main.py
```

### Rule Selection

```bash
# Enable specific rules
ruff check --select E,F,W .

# Enable all rules
ruff check --select ALL .

# Ignore specific rules
ruff check --ignore E501,W503 .

# Show all available rules
ruff rule --all

# Explain a specific rule
ruff rule E501
```

### Ruff Configuration (pyproject.toml)

```toml
[tool.ruff]
# Target Python version
target-version = "py310"

# Line length
line-length = 88

# Exclude directories
exclude = [
    ".git",
    ".venv",
    "__pycache__",
    "build",
    "dist",
    "*.egg-info",
]

# Include files
include = ["*.py", "*.pyi"]

# Fix violations automatically
fix = true

[tool.ruff.lint]
# Enable rule sets
select = [
    "E",      # pycodestyle errors
    "W",      # pycodestyle warnings
    "F",      # Pyflakes
    "I",      # isort
    "B",      # flake8-bugbear
    "C4",     # flake8-comprehensions
    "UP",     # pyupgrade
    "ARG",    # flake8-unused-arguments
    "SIM",    # flake8-simplify
    "PTH",    # flake8-use-pathlib
    "ERA",    # eradicate (commented code)
    "PL",     # Pylint
    "RUF",    # Ruff-specific rules
]

# Ignore specific rules
ignore = [
    "E501",   # Line too long (handled by formatter)
    "B008",   # Function call in default argument
    "PLR0913", # Too many arguments
]

# Allow autofix for all enabled rules
fixable = ["ALL"]
unfixable = []

# Allow unused variables when underscore-prefixed
dummy-variable-rgx = "^(_+|(_+[a-zA-Z0-9_]*[a-zA-Z0-9]+?))$"

[tool.ruff.lint.per-file-ignores]
# Ignore specific rules in test files
"tests/**/*.py" = ["S101", "ARG001", "PLR2004"]
# Ignore in migrations
"**/migrations/*.py" = ["E501"]

[tool.ruff.lint.isort]
# isort configuration
known-first-party = ["myproject"]
section-order = ["future", "standard-library", "third-party", "first-party", "local-folder"]

[tool.ruff.lint.flake8-bugbear]
# Allow default arguments like datetime.now()
extend-immutable-calls = ["datetime.datetime.now", "datetime.date.today"]

[tool.ruff.lint.pydocstyle]
convention = "google"

[tool.ruff.format]
# Formatter settings
quote-style = "double"
indent-style = "space"
skip-magic-trailing-comma = false
line-ending = "auto"
```

### Common Rules Reference

| Rule | Category | Description |
|------|----------|-------------|
| E | pycodestyle | Style errors (E1xx, E2xx, etc.) |
| W | pycodestyle | Style warnings |
| F | Pyflakes | Undefined names, unused imports |
| I | isort | Import sorting |
| B | Bugbear | Likely bugs and design problems |
| C4 | Comprehensions | List/dict comprehension improvements |
| UP | pyupgrade | Upgrade to newer Python syntax |
| S | Bandit | Security issues |
| N | pep8-naming | Naming conventions |
| D | pydocstyle | Docstring style |
| PL | Pylint | Additional linting |
| RUF | Ruff | Ruff-specific rules |

---

## Black - Code Formatter

### Installation

```bash
# Install Black
pip install black

# Or with Poetry
poetry add --group dev black

# Verify installation
black --version
```

### Basic Commands

```bash
# Format all Python files
black .

# Format specific file
black src/main.py

# Check without modifying (CI mode)
black --check .

# Show diff of changes
black --diff .

# Format only changed files
black --check . | xargs black
```

### Configuration

```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ["py310", "py311"]
include = '\.pyi?$'
exclude = '''
/(
    \.git
  | \.hg
  | \.mypy_cache
  | \.tox
  | \.venv
  | _build
  | buck-out
  | build
  | dist
)/
'''

# Force single quotes (use with ruff format instead)
# Black always uses double quotes

# Preview features
preview = false
```

### Black vs Ruff Format

```bash
# Black is the original formatter
black .

# Ruff format is Black-compatible but faster
ruff format .

# Both produce nearly identical output
# Ruff is 30-100x faster than Black
```

---

## Mypy - Static Type Checker

### Installation

```bash
# Install mypy
pip install mypy

# Or with Poetry
poetry add --group dev mypy

# Install type stubs for common libraries
pip install types-requests types-redis types-PyYAML

# Or use mypy to install stubs
mypy --install-types

# Verify installation
mypy --version
```

### Basic Commands

```bash
# Type check all files
mypy .

# Type check specific module
mypy src/myproject

# Type check specific file
mypy src/main.py

# Strict mode
mypy --strict .

# Show error codes
mypy --show-error-codes .

# Generate report
mypy --html-report mypy_report .

# Ignore missing imports
mypy --ignore-missing-imports .
```

### Configuration

```toml
# pyproject.toml
[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_ignores = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_configs = true
warn_no_return = true
warn_unreachable = true
strict_equality = true
extra_checks = true
show_error_codes = true
show_column_numbers = true
pretty = true

# Exclude directories
exclude = [
    "build",
    "dist",
    ".venv",
    "tests",
]

# Per-module configuration
[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false

[[tool.mypy.overrides]]
module = "migrations.*"
ignore_errors = true

[[tool.mypy.overrides]]
module = "third_party_lib.*"
ignore_missing_imports = true
```

### mypy.ini (Alternative)

```ini
[mypy]
python_version = 3.10
warn_return_any = True
warn_unused_ignores = True
disallow_untyped_defs = True
check_untyped_defs = True
show_error_codes = True

[mypy-tests.*]
disallow_untyped_defs = False

[mypy-third_party.*]
ignore_missing_imports = True
```

### Type Hints Examples

```python
# Basic type hints
def greet(name: str) -> str:
    return f"Hello, {name}!"

# Optional types
from typing import Optional

def find_user(user_id: int) -> Optional[User]:
    # Returns User or None
    pass

# Union types (Python 3.10+)
def process(value: int | str) -> None:
    pass

# Generic types
from typing import List, Dict, Tuple

def get_users() -> List[User]:
    pass

def get_config() -> Dict[str, str]:
    pass

# Callable types
from typing import Callable

def apply(func: Callable[[int], int], value: int) -> int:
    return func(value)

# TypeVar for generics
from typing import TypeVar

T = TypeVar('T')

def first(items: list[T]) -> T:
    return items[0]

# Protocol for structural typing
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

# TypedDict
from typing import TypedDict

class UserDict(TypedDict):
    id: int
    name: str
    email: str
```

### Handling Type Errors

```python
# Ignore specific line
x = some_untyped_function()  # type: ignore

# Ignore with specific error code
x = value  # type: ignore[assignment]

# Cast to specific type
from typing import cast

value = cast(str, unknown_value)

# Assert type
from typing import assert_type

assert_type(value, str)  # Python 3.11+

# Type guard
from typing import TypeGuard

def is_string(val: object) -> TypeGuard[str]:
    return isinstance(val, str)
```

---

## Pylint - Comprehensive Linter

### Installation

```bash
# Install Pylint
pip install pylint

# Verify installation
pylint --version
```

### Basic Commands

```bash
# Lint all files
pylint src/

# Lint specific file
pylint src/main.py

# Generate config file
pylint --generate-rcfile > .pylintrc

# Show only errors
pylint --errors-only src/

# Output as JSON
pylint --output-format=json src/
```

### Configuration

```toml
# pyproject.toml
[tool.pylint.main]
jobs = 0  # Use all CPUs
fail-under = 8.0  # Minimum score
ignore-patterns = ["test_.*\\.py"]

[tool.pylint.messages_control]
disable = [
    "missing-module-docstring",
    "missing-class-docstring",
    "missing-function-docstring",
    "too-few-public-methods",
    "line-too-long",  # Handled by formatter
]

[tool.pylint.format]
max-line-length = 88

[tool.pylint.design]
max-args = 7
max-locals = 15
max-returns = 6
max-branches = 12

[tool.pylint.similarities]
min-similarity-lines = 4
ignore-comments = true
ignore-docstrings = true
```

---

## Pre-commit Integration

### Installation

```bash
# Install pre-commit
pip install pre-commit

# Or with Poetry
poetry add --group dev pre-commit

# Install hooks
pre-commit install

# Run on all files
pre-commit run --all-files

# Update hooks
pre-commit autoupdate
```

### .pre-commit-config.yaml

```yaml
repos:
  # Ruff for linting and formatting
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.6
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  # Black for formatting (if not using ruff format)
  - repo: https://github.com/psf/black
    rev: 23.11.0
    hooks:
      - id: black

  # Mypy for type checking
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.7.0
    hooks:
      - id: mypy
        additional_dependencies:
          - types-requests
          - types-PyYAML

  # Standard pre-commit hooks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
      - id: check-toml
      - id: debug-statements

  # Detect secrets
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  # Conventional commits
  - repo: https://github.com/compilerla/conventional-pre-commit
    rev: v3.0.0
    hooks:
      - id: conventional-pre-commit
        stages: [commit-msg]
```

---

## Complete Configuration

### pyproject.toml (Full Example)

```toml
[project]
name = "myproject"
version = "1.0.0"
requires-python = ">=3.10"

[tool.ruff]
target-version = "py310"
line-length = 88
exclude = [".venv", "build", "dist"]

[tool.ruff.lint]
select = [
    "E", "W",   # pycodestyle
    "F",        # Pyflakes
    "I",        # isort
    "B",        # flake8-bugbear
    "C4",       # flake8-comprehensions
    "UP",       # pyupgrade
    "ARG",      # flake8-unused-arguments
    "SIM",      # flake8-simplify
    "S",        # flake8-bandit (security)
    "RUF",      # Ruff-specific
]
ignore = ["E501", "B008"]

[tool.ruff.lint.per-file-ignores]
"tests/**/*.py" = ["S101", "ARG001"]

[tool.ruff.lint.isort]
known-first-party = ["myproject"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"

[tool.black]
line-length = 88
target-version = ["py310"]

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_ignores = true
disallow_untyped_defs = true
check_untyped_defs = true
show_error_codes = true

[[tool.mypy.overrides]]
module = "tests.*"
disallow_untyped_defs = false

[tool.pylint.main]
jobs = 0
fail-under = 8.0

[tool.pylint.messages_control]
disable = ["missing-docstring", "line-too-long"]
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/lint.yml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          pip install ruff mypy

      - name: Run Ruff
        run: ruff check .

      - name: Run Ruff Format Check
        run: ruff format --check .

      - name: Run Mypy
        run: mypy src/
```

### GitLab CI

```yaml
# .gitlab-ci.yml
lint:
  image: python:3.11
  script:
    - pip install ruff mypy
    - ruff check .
    - ruff format --check .
    - mypy src/
```

---

## Commands Reference

```bash
# Ruff
ruff check .                    # Lint all files
ruff check --fix .              # Lint and auto-fix
ruff format .                   # Format all files
ruff format --check .           # Check formatting
ruff rule E501                  # Explain a rule

# Black
black .                         # Format all files
black --check .                 # Check formatting
black --diff .                  # Show changes

# Mypy
mypy .                          # Type check all files
mypy --strict .                 # Strict mode
mypy --install-types            # Install type stubs
mypy --show-error-codes .       # Show error codes

# Pylint
pylint src/                     # Lint source code
pylint --errors-only src/       # Show only errors

# Pre-commit
pre-commit install              # Install git hooks
pre-commit run --all-files      # Run on all files
pre-commit autoupdate           # Update hooks
```

---

## Integration with Workflows

### Before Commit

```bash
# Run all checks
ruff check --fix . && ruff format . && mypy src/
```

### During CI

```bash
# Strict checking (no auto-fix)
ruff check .
ruff format --check .
mypy --strict src/
```

### During Review

```bash
# Check only changed files
git diff --name-only HEAD~1 | xargs ruff check
git diff --name-only HEAD~1 | xargs mypy
```

---

## Migration Guide

### From flake8 to Ruff

```bash
# Ruff is a drop-in replacement for flake8
# Simply replace flake8 with ruff check

# flake8 (old)
flake8 src/

# ruff (new)
ruff check src/

# Most flake8 plugins are built-in to ruff
# See: https://docs.astral.sh/ruff/rules/
```

### From isort to Ruff

```bash
# Ruff includes isort functionality
# Enable I rules in ruff configuration

# isort (old)
isort src/

# ruff (new)
ruff check --select I --fix src/
```

### From black to Ruff Format

```bash
# Ruff format is Black-compatible
# Simply replace black with ruff format

# black (old)
black src/

# ruff format (new)
ruff format src/
```

---

*Comprehensive Python linting and formatting for consistent, type-safe code.*
