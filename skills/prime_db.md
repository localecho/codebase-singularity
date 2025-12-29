---
name: prime_db
description: Skill for database operations via CLI (psql, sqlite3, etc.)
triggers:
  - query database
  - run migration
  - check schema
  - seed data
---

# Skill: Prime DB - Database CLI Operations

This skill teaches the agent to interact with databases using CLI tools instead of heavy MCP servers.

## Philosophy

> Use text-based CLI tools for database operations. They're fast, scriptable, and don't require complex server setups.

## PostgreSQL (psql)

### Connect

```bash
# Basic connection
psql -h localhost -U postgres -d mydb

# With password (use PGPASSWORD env var)
PGPASSWORD=secret psql -h localhost -U postgres -d mydb

# Connection string
psql "postgresql://user:pass@localhost:5432/mydb"
```

### Execute Queries

```bash
# Single query
psql -c "SELECT * FROM users LIMIT 5;"

# From file
psql -f migrations/001_create_users.sql

# Output to file
psql -c "SELECT * FROM users;" -o output.csv -A -F ','
```

### Schema Operations

```bash
# List tables
psql -c "\dt"

# Describe table
psql -c "\d users"

# List indexes
psql -c "\di"
```

### Migrations

```bash
# Run all pending migrations
for f in migrations/*.sql; do
  echo "Running $f..."
  psql -f "$f"
done

# Rollback (if you have down migrations)
psql -f migrations/001_down.sql
```

## SQLite (sqlite3)

### Connect

```bash
sqlite3 database.db
```

### Execute Queries

```bash
# Single query
sqlite3 database.db "SELECT * FROM users LIMIT 5;"

# From file
sqlite3 database.db < schema.sql

# Output modes
sqlite3 -header -csv database.db "SELECT * FROM users;"
```

### Schema Operations

```bash
# List tables
sqlite3 database.db ".tables"

# Show schema
sqlite3 database.db ".schema users"
```

## Common Operations

### Check Connection

```bash
# PostgreSQL
psql -c "SELECT 1;" && echo "Connected" || echo "Failed"

# SQLite
sqlite3 database.db "SELECT 1;" && echo "Connected" || echo "Failed"
```

### Backup Database

```bash
# PostgreSQL
pg_dump -h localhost -U postgres mydb > backup.sql

# SQLite
sqlite3 database.db ".backup backup.db"
```

### Seed Data

```bash
# PostgreSQL
psql -f seeds/development.sql

# SQLite
sqlite3 database.db < seeds/development.sql
```

## Integration with Workflows

### Before Build
```bash
# Ensure DB is accessible
psql -c "SELECT 1;" || exit 1
```

### After Migration
```bash
# Verify tables exist
psql -c "\dt" | grep -q "users" && echo "OK" || echo "FAIL"
```

### During Review
```bash
# Check for data integrity
psql -c "SELECT COUNT(*) FROM users WHERE email IS NULL;"
```

## Safety Rules

1. **Never DROP in production** without explicit confirmation
2. **Always backup** before destructive operations
3. **Use transactions** for multi-statement changes
4. **Log all commands** to `app_reviews/` for audit

## Example: Full Migration Flow

```bash
#!/bin/bash
# run_migration.sh

set -e  # Exit on error

echo "Backing up database..."
pg_dump mydb > backups/$(date +%Y%m%d_%H%M%S).sql

echo "Running migrations..."
psql -f migrations/latest.sql

echo "Verifying schema..."
psql -c "\dt" | tee schema_check.txt

echo "Migration complete!"
```

---
*Skill for lightweight database operations via CLI*
