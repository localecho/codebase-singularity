# CLAUDE.md - Todo API Example Project

> Example project demonstrating Codebase Singularity framework

## Project Identity

**Project**: Todo API
**Version**: 1.0.0
**Type**: REST API with CRUD operations
**Stack**: Node.js, Express, SQLite

## Architecture

```
┌─────────────────────────────────────────────┐
│              AGENTIC LAYER                   │
│  ┌─────────┐ ┌─────────┐ ┌─────────────────┐ │
│  │commands │ │  specs  │ │   app_reviews   │ │
│  └─────────┘ └─────────┘ └─────────────────┘ │
├─────────────────────────────────────────────┤
│              APPLICATION                     │
│  ┌─────────┐ ┌─────────┐ ┌───────┐          │
│  │  src/   │ │database/│ │ tests │          │
│  │   api   │ │  sqlite │ │  jest │          │
│  └─────────┘ └─────────┘ └───────┘          │
└─────────────────────────────────────────────┘
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /todos | List all todos |
| GET | /todos/:id | Get single todo |
| POST | /todos | Create todo |
| PUT | /todos/:id | Update todo |
| DELETE | /todos/:id | Delete todo |

## Data Model

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm test             # Run tests
npm run build        # Build for production
```

## Agent Directives

1. Follow RESTful conventions
2. Write tests for all endpoints
3. Use parameterized SQL queries
4. Handle errors gracefully
5. Document API changes

## Current State

- **Workflow**: None
- **Active Spec**: None
- **Issues**: None
