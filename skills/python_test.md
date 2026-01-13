---
name: python_test
description: Pytest testing patterns, fixtures, and best practices for Python projects
triggers:
  - run pytest
  - python tests
  - test coverage
  - pytest fixtures
---

# Skill: Python Testing with Pytest

This skill teaches the agent to run, write, and manage Python tests using pytest and related tooling.

## Philosophy

> Write tests that document behavior, not implementation. Use fixtures for setup, parametrize for coverage, and markers for organization.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 PYTHON TESTING PIPELINE                      │
│                                                             │
│   Source Code + Specifications                               │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              TEST DISCOVERY                          │  │
│   │  - pytest collects tests from tests/                 │  │
│   │  - Identifies test_*.py and *_test.py files          │  │
│   │  - Finds test functions and classes                  │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              FIXTURE SETUP                           │  │
│   │  - Session/module/function scoped fixtures           │  │
│   │  - Database connections, test clients                │  │
│   │  - Mock services and external APIs                   │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              TEST EXECUTION                          │  │
│   │  - Run tests with parallelization (pytest-xdist)     │  │
│   │  - Apply markers and filters                         │  │
│   │  - Capture output and assertions                     │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              COVERAGE REPORTING                      │  │
│   │  - Line and branch coverage                          │  │
│   │  - HTML/XML/JSON reports                             │  │
│   │  - Coverage thresholds                               │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   Test Results + Coverage Report                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific file
pytest tests/test_users.py

# Run specific test function
pytest tests/test_users.py::test_create_user

# Run specific test class
pytest tests/test_users.py::TestUserService

# Run tests matching a keyword
pytest -k "user and not slow"
```

### Parallel Execution

```bash
# Install pytest-xdist
pip install pytest-xdist

# Run tests in parallel (auto-detect CPUs)
pytest -n auto

# Run tests with 4 workers
pytest -n 4

# Run with load balancing
pytest -n auto --dist loadfile
```

### Coverage

```bash
# Install pytest-cov
pip install pytest-cov

# Run with coverage
pytest --cov=src

# Coverage with HTML report
pytest --cov=src --cov-report=html

# Coverage with XML (for CI)
pytest --cov=src --cov-report=xml

# Fail if coverage below threshold
pytest --cov=src --cov-fail-under=80

# Coverage for specific package
pytest --cov=src/services --cov-report=term-missing
```

### Output Control

```bash
# Show print statements
pytest -s

# Show local variables in tracebacks
pytest -l

# Stop on first failure
pytest -x

# Stop after N failures
pytest --maxfail=3

# Show slowest N tests
pytest --durations=10

# Quiet output (dots only)
pytest -q
```

---

## Test Structure

### Basic Test

```python
# tests/test_calculator.py
def test_addition():
    """Test that addition works correctly."""
    result = 2 + 2
    assert result == 4

def test_division():
    """Test division with proper error handling."""
    result = 10 / 2
    assert result == 5.0
```

### Test Class

```python
# tests/test_user_service.py
import pytest
from src.services.user_service import UserService

class TestUserService:
    """Tests for UserService class."""

    def setup_method(self):
        """Set up test fixtures before each test method."""
        self.service = UserService()

    def teardown_method(self):
        """Clean up after each test method."""
        self.service.cleanup()

    def test_create_user(self):
        """Test user creation with valid data."""
        user = self.service.create_user(
            email="test@example.com",
            name="Test User"
        )
        assert user.id is not None
        assert user.email == "test@example.com"

    def test_create_user_duplicate_email(self):
        """Test that duplicate emails raise an error."""
        self.service.create_user(email="dup@example.com", name="First")
        with pytest.raises(ValueError, match="Email already exists"):
            self.service.create_user(email="dup@example.com", name="Second")
```

---

## Fixtures

### Basic Fixtures

```python
# tests/conftest.py
import pytest
from src.database import Database
from src.services.user_service import UserService

@pytest.fixture
def db():
    """Provide a clean database connection."""
    database = Database(":memory:")
    database.create_tables()
    yield database
    database.close()

@pytest.fixture
def user_service(db):
    """Provide a UserService with database connection."""
    return UserService(db)

@pytest.fixture
def sample_user(user_service):
    """Create a sample user for testing."""
    return user_service.create_user(
        email="sample@example.com",
        name="Sample User"
    )
```

### Fixture Scopes

```python
# tests/conftest.py
import pytest

@pytest.fixture(scope="session")
def database_engine():
    """Create database engine once per test session."""
    engine = create_engine("postgresql://test:test@localhost/test_db")
    yield engine
    engine.dispose()

@pytest.fixture(scope="module")
def shared_client():
    """Create HTTP client once per test module."""
    client = TestClient(app)
    yield client

@pytest.fixture(scope="function")  # Default scope
def fresh_user():
    """Create a new user for each test function."""
    return User(name="Fresh", email="fresh@example.com")
```

### Parameterized Fixtures

```python
# tests/conftest.py
import pytest

@pytest.fixture(params=["sqlite", "postgresql", "mysql"])
def database_type(request):
    """Run tests against multiple database types."""
    return request.param

@pytest.fixture(params=[
    {"role": "admin", "permissions": ["read", "write", "delete"]},
    {"role": "user", "permissions": ["read"]},
    {"role": "guest", "permissions": []},
])
def user_role(request):
    """Test with different user roles."""
    return request.param
```

### Factory Fixtures

```python
# tests/conftest.py
import pytest
from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    id: int
    email: str
    name: str

@pytest.fixture
def user_factory():
    """Factory for creating test users with custom attributes."""
    created_users = []
    counter = 0

    def create_user(
        email: Optional[str] = None,
        name: Optional[str] = None
    ) -> User:
        nonlocal counter
        counter += 1
        user = User(
            id=counter,
            email=email or f"user{counter}@example.com",
            name=name or f"User {counter}"
        )
        created_users.append(user)
        return user

    yield create_user

    # Cleanup: delete all created users
    for user in created_users:
        # cleanup logic here
        pass
```

---

## Markers

### Built-in Markers

```python
# tests/test_features.py
import pytest

@pytest.mark.skip(reason="Not implemented yet")
def test_future_feature():
    pass

@pytest.mark.skipif(
    sys.platform == "win32",
    reason="Not supported on Windows"
)
def test_unix_only():
    pass

@pytest.mark.xfail(reason="Known bug, see issue #123")
def test_known_failure():
    assert False  # Expected to fail

@pytest.mark.parametrize("input,expected", [
    (1, 2),
    (2, 4),
    (3, 6),
])
def test_double(input, expected):
    assert input * 2 == expected
```

### Custom Markers

```python
# pytest.ini or pyproject.toml configuration
# [tool.pytest.ini_options]
# markers = [
#     "slow: marks tests as slow (deselect with '-m \"not slow\"')",
#     "integration: marks tests as integration tests",
#     "unit: marks tests as unit tests",
# ]

# tests/test_database.py
import pytest

@pytest.mark.slow
def test_large_data_import():
    """Test importing 1 million records."""
    pass

@pytest.mark.integration
def test_external_api_call():
    """Test actual API integration."""
    pass

@pytest.mark.unit
def test_pure_function():
    """Test pure function with no external dependencies."""
    pass
```

### Running by Markers

```bash
# Run only slow tests
pytest -m slow

# Run everything except slow tests
pytest -m "not slow"

# Run unit OR integration tests
pytest -m "unit or integration"

# Run tests that are both integration AND slow
pytest -m "integration and slow"
```

---

## Parametrization

### Basic Parametrization

```python
import pytest

@pytest.mark.parametrize("input,expected", [
    ("hello", 5),
    ("world", 5),
    ("", 0),
    ("a", 1),
])
def test_string_length(input, expected):
    assert len(input) == expected
```

### Multiple Parameters

```python
import pytest

@pytest.mark.parametrize("x", [1, 2, 3])
@pytest.mark.parametrize("y", [10, 20])
def test_multiplication(x, y):
    """Tests all combinations: (1,10), (1,20), (2,10), (2,20), (3,10), (3,20)"""
    assert x * y == x * y
```

### Parametrize with IDs

```python
import pytest

@pytest.mark.parametrize(
    "user_input,expected_error",
    [
        pytest.param("", "Email required", id="empty_email"),
        pytest.param("invalid", "Invalid email format", id="no_at_sign"),
        pytest.param("@example.com", "Missing local part", id="no_local"),
        pytest.param("test@", "Missing domain", id="no_domain"),
    ]
)
def test_email_validation_errors(user_input, expected_error):
    with pytest.raises(ValidationError, match=expected_error):
        validate_email(user_input)
```

### Parametrize Classes

```python
import pytest

@pytest.mark.parametrize("backend", ["memory", "redis", "postgres"])
class TestCacheBackend:
    """Run all tests against multiple cache backends."""

    def test_set_get(self, backend):
        cache = create_cache(backend)
        cache.set("key", "value")
        assert cache.get("key") == "value"

    def test_delete(self, backend):
        cache = create_cache(backend)
        cache.set("key", "value")
        cache.delete("key")
        assert cache.get("key") is None
```

---

## Mocking

### Using pytest-mock

```python
# pip install pytest-mock

def test_api_call(mocker):
    """Mock external API call."""
    mock_response = {"status": "success", "data": [1, 2, 3]}
    mocker.patch(
        "src.services.api_client.fetch_data",
        return_value=mock_response
    )

    result = process_api_data()
    assert result == [1, 2, 3]

def test_database_error(mocker):
    """Mock database to simulate error."""
    mocker.patch(
        "src.database.Database.query",
        side_effect=DatabaseError("Connection lost")
    )

    with pytest.raises(ServiceError, match="Database unavailable"):
        get_user_data(user_id=1)
```

### Using unittest.mock

```python
from unittest.mock import Mock, patch, MagicMock

def test_with_mock():
    """Use Mock objects for testing."""
    mock_service = Mock()
    mock_service.get_user.return_value = {"id": 1, "name": "Test"}

    result = process_user(mock_service, user_id=1)

    mock_service.get_user.assert_called_once_with(1)
    assert result["name"] == "Test"

def test_with_patch():
    """Patch a module-level function."""
    with patch("src.utils.send_email") as mock_send:
        mock_send.return_value = True

        result = register_user("test@example.com")

        mock_send.assert_called_once()
        assert result.email_sent is True
```

### Mock Fixtures

```python
# tests/conftest.py
import pytest
from unittest.mock import AsyncMock

@pytest.fixture
def mock_http_client(mocker):
    """Provide a mock HTTP client."""
    client = mocker.Mock()
    client.get.return_value.json.return_value = {"success": True}
    client.post.return_value.status_code = 201
    return client

@pytest.fixture
def mock_async_db():
    """Provide a mock async database."""
    db = AsyncMock()
    db.fetch_one.return_value = {"id": 1, "name": "Test"}
    db.fetch_all.return_value = [{"id": 1}, {"id": 2}]
    return db
```

---

## Async Testing

### Using pytest-asyncio

```python
# pip install pytest-asyncio

import pytest

@pytest.mark.asyncio
async def test_async_function():
    """Test async function."""
    result = await fetch_data_async()
    assert result is not None

@pytest.mark.asyncio
async def test_async_context_manager():
    """Test async context manager."""
    async with AsyncDatabaseConnection() as conn:
        result = await conn.query("SELECT 1")
        assert result == 1
```

### Async Fixtures

```python
# tests/conftest.py
import pytest
import pytest_asyncio

@pytest_asyncio.fixture
async def async_client():
    """Provide async HTTP client."""
    async with AsyncClient(app, base_url="http://test") as client:
        yield client

@pytest_asyncio.fixture
async def async_db():
    """Provide async database connection."""
    db = await create_async_connection()
    await db.execute("BEGIN")
    yield db
    await db.execute("ROLLBACK")
    await db.close()
```

---

## Property-Based Testing

### Using Hypothesis

```python
# pip install hypothesis

from hypothesis import given, strategies as st
import pytest

@given(st.integers(), st.integers())
def test_addition_commutative(a, b):
    """Test that addition is commutative."""
    assert a + b == b + a

@given(st.lists(st.integers()))
def test_sort_idempotent(lst):
    """Test that sorting twice gives same result."""
    assert sorted(sorted(lst)) == sorted(lst)

@given(st.text(min_size=1))
def test_string_reversible(s):
    """Test that reversing twice returns original."""
    assert s[::-1][::-1] == s

@given(
    st.dictionaries(
        keys=st.text(min_size=1, max_size=10),
        values=st.integers()
    )
)
def test_json_roundtrip(data):
    """Test JSON serialization roundtrip."""
    import json
    assert json.loads(json.dumps(data)) == data
```

### Custom Strategies

```python
from hypothesis import given, strategies as st
from dataclasses import dataclass

@dataclass
class User:
    id: int
    email: str
    age: int

user_strategy = st.builds(
    User,
    id=st.integers(min_value=1),
    email=st.emails(),
    age=st.integers(min_value=0, max_value=150)
)

@given(user_strategy)
def test_user_validation(user):
    """Test user validation with generated data."""
    assert validate_user(user) is True
```

---

## Testing Patterns

### Testing Exceptions

```python
import pytest

def test_raises_value_error():
    """Test that function raises ValueError."""
    with pytest.raises(ValueError):
        int("not a number")

def test_raises_with_message():
    """Test exception message matches pattern."""
    with pytest.raises(ValueError, match=r"invalid literal"):
        int("not a number")

def test_exception_info():
    """Access exception details."""
    with pytest.raises(ValueError) as exc_info:
        raise ValueError("Custom error message")

    assert "Custom" in str(exc_info.value)
    assert exc_info.type == ValueError
```

### Testing Warnings

```python
import pytest
import warnings

def test_deprecation_warning():
    """Test that deprecation warning is raised."""
    with pytest.warns(DeprecationWarning):
        deprecated_function()

def test_specific_warning_message():
    """Test warning with specific message."""
    with pytest.warns(UserWarning, match="will be removed"):
        function_with_warning()
```

### Testing Output

```python
def test_stdout(capsys):
    """Test standard output."""
    print("Hello, World!")
    captured = capsys.readouterr()
    assert captured.out == "Hello, World!\n"
    assert captured.err == ""

def test_logging(caplog):
    """Test logging output."""
    import logging
    logger = logging.getLogger(__name__)

    with caplog.at_level(logging.INFO):
        logger.info("Test message")

    assert "Test message" in caplog.text
    assert len(caplog.records) == 1
```

---

## Configuration

### pyproject.toml

```toml
[tool.pytest.ini_options]
minversion = "7.0"
addopts = "-ra -q --strict-markers"
testpaths = ["tests"]
pythonpath = ["src"]
markers = [
    "slow: marks tests as slow",
    "integration: marks tests as integration tests",
    "unit: marks tests as unit tests",
]
filterwarnings = [
    "error",
    "ignore::DeprecationWarning:third_party.*",
]

[tool.coverage.run]
source = ["src"]
branch = true
omit = ["*/tests/*", "*/__pycache__/*"]

[tool.coverage.report]
exclude_lines = [
    "pragma: no cover",
    "def __repr__",
    "raise NotImplementedError",
    "if TYPE_CHECKING:",
]
fail_under = 80
show_missing = true
```

### pytest.ini (Alternative)

```ini
[pytest]
minversion = 7.0
addopts = -ra -q --strict-markers
testpaths = tests
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
```

### conftest.py Structure

```python
# tests/conftest.py
import pytest
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

# Fixtures available to all tests
@pytest.fixture(scope="session")
def app_config():
    """Application configuration for testing."""
    return {
        "DATABASE_URL": "sqlite:///:memory:",
        "DEBUG": True,
        "TESTING": True,
    }

@pytest.fixture(autouse=True)
def reset_state():
    """Reset global state before each test."""
    yield
    # Cleanup after test

# Hooks
def pytest_configure(config):
    """Configure pytest."""
    config.addinivalue_line("markers", "e2e: end-to-end tests")

def pytest_collection_modifyitems(config, items):
    """Modify test collection."""
    # Skip slow tests unless --slow flag is passed
    if not config.getoption("--slow"):
        skip_slow = pytest.mark.skip(reason="need --slow option to run")
        for item in items:
            if "slow" in item.keywords:
                item.add_marker(skip_slow)
```

---

## Commands

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=src --cov-report=term-missing

# Run only fast tests
pytest -m "not slow"

# Run integration tests with verbose output
pytest -m integration -v

# Run tests in parallel
pytest -n auto

# Run with specific config
pytest -c pytest.ini

# Generate JUnit XML for CI
pytest --junitxml=test-results.xml

# Run with pdb on failure
pytest --pdb

# Run tests that failed last time
pytest --lf

# Run tests related to changed files
pytest --picked
```

---

## Integration with Workflows

### Before Build

```bash
# Run fast unit tests
pytest -m "not slow and not integration" -q
```

### During CI

```bash
# Full test suite with coverage
pytest --cov=src --cov-report=xml --junitxml=test-results.xml -n auto
```

### During Review

```bash
# Run tests related to changed files
pytest --picked --cov --cov-report=term-missing
```

---

*Comprehensive pytest patterns for reliable Python testing.*
