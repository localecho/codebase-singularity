---
name: python_package
description: Python package management with pip, poetry, and virtual environments
triggers:
  - install packages
  - pip install
  - poetry add
  - manage dependencies
  - virtual environment
---

# Skill: Python Package Management

This skill teaches the agent to manage Python packages using pip, poetry, and virtual environments for reproducible builds.

## Philosophy

> Use virtual environments for isolation, lock files for reproducibility, and semantic versioning for compatibility. Poetry is preferred for new projects; pip with requirements.txt for legacy support.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              PYTHON PACKAGE MANAGEMENT                       │
│                                                             │
│   Project Requirements                                       │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │            VIRTUAL ENVIRONMENT                       │  │
│   │  - venv / virtualenv / conda                         │  │
│   │  - Isolated Python interpreter                       │  │
│   │  - Project-specific dependencies                     │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │            PACKAGE MANAGER                           │  │
│   │  ┌─────────────┐  ┌─────────────┐  ┌────────────┐   │  │
│   │  │     pip     │  │   poetry    │  │    uv      │   │  │
│   │  │ (Standard)  │  │ (Modern)    │  │  (Fast)    │   │  │
│   │  └─────────────┘  └─────────────┘  └────────────┘   │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │            DEPENDENCY RESOLUTION                     │  │
│   │  - Version constraints                               │  │
│   │  - Transitive dependencies                           │  │
│   │  - Lock file generation                              │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   Reproducible Environment                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Virtual Environments

### venv (Built-in)

```bash
# Create virtual environment
python -m venv .venv

# Activate (Unix/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Activate (Fish shell)
source .venv/bin/activate.fish

# Deactivate
deactivate

# Delete environment
rm -rf .venv
```

### virtualenv (Enhanced)

```bash
# Install virtualenv
pip install virtualenv

# Create with specific Python version
virtualenv -p python3.11 .venv

# Create with system site-packages
virtualenv --system-site-packages .venv

# Create without pip (faster)
virtualenv --no-pip .venv
```

### pyenv + pyenv-virtualenv

```bash
# Install Python version
pyenv install 3.11.4

# Create virtualenv
pyenv virtualenv 3.11.4 myproject

# Activate automatically in directory
echo "myproject" > .python-version

# List virtualenvs
pyenv virtualenvs

# Delete virtualenv
pyenv virtualenv-delete myproject
```

---

## Pip Package Management

### Basic Commands

```bash
# Install package
pip install requests

# Install specific version
pip install requests==2.31.0

# Install with version constraints
pip install "requests>=2.28,<3.0"

# Install from requirements file
pip install -r requirements.txt

# Install in editable mode (development)
pip install -e .

# Install with extras
pip install "fastapi[all]"

# Upgrade package
pip install --upgrade requests

# Uninstall package
pip uninstall requests

# Show package info
pip show requests

# List installed packages
pip list

# List outdated packages
pip list --outdated
```

### Requirements Files

```bash
# Generate requirements file
pip freeze > requirements.txt

# Generate with hashes (secure)
pip freeze --all | pip-compile --generate-hashes

# Install from requirements
pip install -r requirements.txt

# Install from multiple files
pip install -r requirements.txt -r requirements-dev.txt
```

### requirements.txt Format

```text
# requirements.txt
# Pinned versions (recommended for production)
requests==2.31.0
flask==2.3.3
sqlalchemy==2.0.20

# Version ranges
numpy>=1.24,<2.0
pandas~=2.0.0

# Git dependencies
git+https://github.com/user/repo.git@v1.0.0#egg=package-name

# Local packages
-e ./libs/internal-package

# Environment markers
pywin32==306 ; sys_platform == 'win32'

# Extras
fastapi[all]==0.100.0
```

### requirements-dev.txt

```text
# requirements-dev.txt
-r requirements.txt

# Testing
pytest==7.4.0
pytest-cov==4.1.0
pytest-asyncio==0.21.1
hypothesis==6.82.0

# Linting
ruff==0.0.280
black==23.7.0
mypy==1.5.0

# Development tools
ipython==8.14.0
pre-commit==3.3.3
```

### pip-tools (Compiled Requirements)

```bash
# Install pip-tools
pip install pip-tools

# Create requirements.in with loose constraints
# requirements.in:
# flask
# sqlalchemy>=2.0

# Compile to locked requirements.txt
pip-compile requirements.in

# Compile with hashes
pip-compile --generate-hashes requirements.in

# Sync environment to match requirements
pip-sync requirements.txt

# Upgrade all packages
pip-compile --upgrade requirements.in

# Upgrade specific package
pip-compile --upgrade-package flask requirements.in
```

---

## Poetry Package Management

### Installation

```bash
# Install Poetry (recommended method)
curl -sSL https://install.python-poetry.org | python3 -

# Or with pip
pip install poetry

# Verify installation
poetry --version

# Enable tab completion (bash)
poetry completions bash >> ~/.bash_completion
```

### Project Setup

```bash
# Create new project
poetry new myproject

# Initialize in existing directory
poetry init

# Install dependencies from pyproject.toml
poetry install

# Install with dev dependencies
poetry install --with dev

# Install without dev dependencies
poetry install --without dev

# Install specific groups
poetry install --with dev,test
```

### Managing Dependencies

```bash
# Add production dependency
poetry add requests

# Add with version constraint
poetry add "requests>=2.28,<3.0"

# Add development dependency
poetry add --group dev pytest

# Add from git
poetry add git+https://github.com/user/repo.git

# Add from local path
poetry add ./libs/internal-package

# Remove dependency
poetry remove requests

# Update all dependencies
poetry update

# Update specific package
poetry update requests

# Show dependency tree
poetry show --tree

# Show outdated packages
poetry show --outdated
```

### pyproject.toml

```toml
[tool.poetry]
name = "myproject"
version = "1.0.0"
description = "My Python project"
authors = ["Developer <dev@example.com>"]
readme = "README.md"
license = "MIT"
repository = "https://github.com/user/myproject"
keywords = ["python", "example"]

[tool.poetry.dependencies]
python = "^3.10"
fastapi = "^0.100.0"
sqlalchemy = "^2.0.0"
pydantic = "^2.0.0"
httpx = "^0.24.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-cov = "^4.1.0"
ruff = "^0.0.280"
black = "^23.7.0"
mypy = "^1.5.0"

[tool.poetry.group.docs]
optional = true

[tool.poetry.group.docs.dependencies]
mkdocs = "^1.5.0"
mkdocs-material = "^9.1.0"

[tool.poetry.scripts]
myapp = "myproject.cli:main"

[tool.poetry.extras]
postgres = ["psycopg2-binary"]
mysql = ["pymysql"]

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

### Poetry Commands

```bash
# Run command in virtual environment
poetry run python script.py
poetry run pytest

# Activate virtual environment shell
poetry shell

# Show virtual environment info
poetry env info

# List virtual environments
poetry env list

# Use specific Python version
poetry env use python3.11

# Remove virtual environment
poetry env remove python3.11

# Export to requirements.txt
poetry export -f requirements.txt -o requirements.txt

# Export with dev dependencies
poetry export --with dev -f requirements.txt -o requirements-dev.txt

# Build package
poetry build

# Publish to PyPI
poetry publish

# Check pyproject.toml validity
poetry check

# Show current configuration
poetry config --list
```

### Poetry Configuration

```bash
# Configure local virtual environments
poetry config virtualenvs.in-project true

# Use system site-packages
poetry config virtualenvs.options.system-site-packages true

# Configure PyPI token
poetry config pypi-token.pypi <your-token>

# Add private repository
poetry config repositories.private https://private.pypi.org/simple/

# Configure credentials
poetry config http-basic.private username password
```

---

## uv (Fast Package Manager)

### Installation

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or with pip
pip install uv

# Verify installation
uv --version
```

### Basic Commands

```bash
# Create virtual environment
uv venv

# Create with specific Python
uv venv --python 3.11

# Install packages (fast!)
uv pip install requests flask sqlalchemy

# Install from requirements
uv pip install -r requirements.txt

# Compile requirements
uv pip compile requirements.in -o requirements.txt

# Sync environment
uv pip sync requirements.txt

# Show installed packages
uv pip list

# Freeze installed packages
uv pip freeze
```

### uv as pip Replacement

```bash
# uv is a drop-in replacement for pip
# All pip commands work with 'uv pip'

# Install package
uv pip install numpy

# Install editable
uv pip install -e .

# Uninstall
uv pip uninstall numpy

# Upgrade
uv pip install --upgrade numpy
```

---

## Dependency Groups

### Development vs Production

```toml
# pyproject.toml with dependency groups

[tool.poetry.dependencies]
python = "^3.10"
fastapi = "^0.100.0"
uvicorn = "^0.23.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
ruff = "^0.0.280"

[tool.poetry.group.test.dependencies]
pytest-cov = "^4.1.0"
hypothesis = "^6.82.0"

[tool.poetry.group.docs.dependencies]
mkdocs = "^1.5.0"
```

### Installing Specific Groups

```bash
# Install only main dependencies
poetry install --only main

# Install with dev group
poetry install --with dev

# Install with multiple groups
poetry install --with dev,test,docs

# Install without specific groups
poetry install --without docs
```

---

## Version Constraints

### Constraint Syntax

| Constraint | Meaning | Example |
|-----------|---------|---------|
| `==1.0.0` | Exact version | Only 1.0.0 |
| `>=1.0.0` | Minimum version | 1.0.0 or higher |
| `<=1.0.0` | Maximum version | 1.0.0 or lower |
| `>1.0.0` | Greater than | Higher than 1.0.0 |
| `<1.0.0` | Less than | Lower than 1.0.0 |
| `>=1.0,<2.0` | Range | 1.x versions |
| `~=1.4.2` | Compatible | >=1.4.2, <1.5.0 |
| `^1.4.2` | Caret (Poetry) | >=1.4.2, <2.0.0 |
| `*` | Any version | Latest available |

### Poetry Caret Constraint

```toml
# Caret (^) allows SemVer compatible updates
"^1.2.3"  # >=1.2.3, <2.0.0
"^0.2.3"  # >=0.2.3, <0.3.0 (special case for 0.x)
"^0.0.3"  # >=0.0.3, <0.0.4 (special case for 0.0.x)
```

### Tilde Constraint

```toml
# Tilde (~) allows patch updates only
"~1.2.3"  # >=1.2.3, <1.3.0
"~1.2"    # >=1.2.0, <1.3.0
"~1"      # >=1.0.0, <2.0.0
```

---

## Lock Files

### poetry.lock

```yaml
# Auto-generated by Poetry
# Contains exact versions of all dependencies
# Should be committed to version control

# Regenerate lock file
poetry lock

# Update lock without installing
poetry lock --no-update

# Verify lock file is up to date
poetry lock --check
```

### requirements.txt as Lock File

```bash
# Generate locked requirements
pip freeze > requirements.lock

# Use pip-tools for better control
pip-compile requirements.in -o requirements.lock

# Install from locked requirements
pip install -r requirements.lock
```

---

## Publishing Packages

### Build Package

```bash
# Using Poetry
poetry build

# Using pip/build
pip install build
python -m build
```

### Publish to PyPI

```bash
# Using Poetry
poetry publish

# Using twine
pip install twine
twine upload dist/*

# Upload to TestPyPI first
poetry publish -r testpypi
twine upload --repository testpypi dist/*
```

### pyproject.toml for Publishing

```toml
[project]
name = "mypackage"
version = "1.0.0"
description = "My awesome package"
readme = "README.md"
license = {text = "MIT"}
requires-python = ">=3.10"
authors = [
    {name = "Developer", email = "dev@example.com"}
]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
]
keywords = ["python", "package"]
dependencies = [
    "requests>=2.28.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0.0",
    "black>=23.0.0",
]

[project.urls]
Homepage = "https://github.com/user/mypackage"
Documentation = "https://mypackage.readthedocs.io"
Repository = "https://github.com/user/mypackage"

[project.scripts]
mypackage-cli = "mypackage.cli:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

---

## Private Repositories

### pip with Private Index

```bash
# Install from private index
pip install --index-url https://private.pypi.org/simple/ mypackage

# Configure in pip.conf
# ~/.pip/pip.conf (Unix) or %APPDATA%\pip\pip.ini (Windows)
[global]
index-url = https://private.pypi.org/simple/
extra-index-url = https://pypi.org/simple/
trusted-host = private.pypi.org

# With authentication
pip install --index-url https://user:pass@private.pypi.org/simple/ mypackage
```

### Poetry with Private Repository

```bash
# Add private repository
poetry config repositories.private https://private.pypi.org/simple/

# Configure credentials
poetry config http-basic.private username password

# Install from private repository
poetry add --source private mypackage
```

```toml
# pyproject.toml
[[tool.poetry.source]]
name = "private"
url = "https://private.pypi.org/simple/"
priority = "supplemental"
```

---

## Environment Variables

### Using python-dotenv

```python
# .env file
DATABASE_URL=postgresql://localhost/mydb
API_KEY=secret123
DEBUG=true
```

```python
# Load environment variables
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
API_KEY = os.getenv("API_KEY")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
```

### Using pydantic-settings

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    api_key: str
    debug: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Best Practices

### Project Structure

```
myproject/
├── pyproject.toml          # Project configuration
├── poetry.lock             # Lock file (if using Poetry)
├── requirements.txt        # For pip users
├── requirements-dev.txt    # Dev dependencies
├── .python-version         # Python version (pyenv)
├── .env                    # Environment variables (not committed)
├── .env.example            # Example env file (committed)
├── src/
│   └── myproject/
│       ├── __init__.py
│       └── main.py
├── tests/
│   ├── conftest.py
│   └── test_main.py
└── README.md
```

### Dependency Hygiene

```bash
# Regular dependency audit
pip list --outdated

# Check for security vulnerabilities
pip install safety
safety check

# Or with pip-audit
pip install pip-audit
pip-audit

# Remove unused dependencies
pip install pipreqs
pipreqs . --force
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.10", "3.11", "3.12"]

    steps:
    - uses: actions/checkout@v4

    - name: Set up Python
      uses: actions/setup-python@v5
      with:
        python-version: ${{ matrix.python-version }}

    - name: Install Poetry
      uses: snok/install-poetry@v1
      with:
        virtualenvs-create: true
        virtualenvs-in-project: true

    - name: Load cached venv
      uses: actions/cache@v3
      with:
        path: .venv
        key: venv-${{ runner.os }}-${{ matrix.python-version }}-${{ hashFiles('**/poetry.lock') }}

    - name: Install dependencies
      run: poetry install

    - name: Run tests
      run: poetry run pytest --cov
```

---

## Commands Reference

```bash
# pip
pip install <package>           # Install package
pip uninstall <package>         # Remove package
pip freeze > requirements.txt   # Export dependencies
pip install -r requirements.txt # Install from file

# poetry
poetry add <package>            # Add dependency
poetry remove <package>         # Remove dependency
poetry install                  # Install all dependencies
poetry update                   # Update dependencies
poetry lock                     # Update lock file
poetry shell                    # Activate environment
poetry run <cmd>                # Run command in environment
poetry export -f requirements.txt -o requirements.txt

# uv
uv pip install <package>        # Install package (fast)
uv pip compile requirements.in  # Compile requirements
uv pip sync requirements.txt    # Sync environment
uv venv                         # Create virtual environment

# Virtual environments
python -m venv .venv            # Create venv
source .venv/bin/activate       # Activate (Unix)
deactivate                      # Deactivate
```

---

*Comprehensive Python package management for reproducible environments.*
