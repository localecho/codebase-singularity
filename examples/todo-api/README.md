# Todo API - Codebase Singularity Example

This is a complete example demonstrating the Codebase Singularity framework.

## Quick Start

```bash
cd examples/todo-api
npm install
npm run dev
```

## Framework Demonstration

### 1. Activate the Agent

```bash
claude  # Start Claude Code session
```

Then run:
```
/prime
```

### 2. Create a Feature Specification

```
/spec "Add pagination to GET /todos endpoint"
```

This generates: `specs/YYYYMMDD-add-pagination.md`

### 3. Run the Orchestrator

```
/orchestrator "Implement pagination spec" full
```

This executes:
1. **PLAN**: Read spec, identify files
2. **BUILD**: Implement pagination
3. **REVIEW**: Run tests, check coverage
4. **FIX**: Resolve any issues

### 4. Code Review

```
/code_review src/
```

### 5. Run Tests

```
/test_backend all 80
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /todos | List todos (supports pagination) |
| GET | /todos/:id | Get single todo |
| POST | /todos | Create todo |
| PUT | /todos/:id | Update todo |
| DELETE | /todos/:id | Delete todo |
| GET | /health | Health check |

## Project Structure

```
todo-api/
├── CLAUDE.md           # Agent memory file
├── .claude/
│   └── commands/       # Project-specific commands
├── src/
│   └── index.js        # Main application
├── database/
│   └── schema.sql      # Database schema
├── tests/
│   └── api.test.js     # API tests
└── specs/              # Generated specifications
```

## Use Cases to Try

1. **Add a feature**:
   ```
   /orchestrator "Add due date field to todos" full
   ```

2. **Fix a bug**:
   ```
   /orchestrator "Fix: GET /todos returns wrong order" bugfix
   ```

3. **Refactor**:
   ```
   /orchestrator "Extract database logic to separate module" refactor
   ```

4. **Security audit**:
   ```
   /orchestrator "Run security audit" security
   ```
