---
name: migrate
description: Database migration assistant - generates migrations, updates models, endpoints, and tests
arguments:
  - name: change
    description: Description of the database change to make
    required: true
  - name: strategy
    description: Migration strategy - additive (safe), destructive, or rename
    required: false
---

# MIGRATE - Database Migration Command

## Purpose

Automate database schema changes by generating migrations, updating models, modifying affected endpoints, and updating tests - all in a coordinated workflow.

> Safe migrations require careful coordination across layers.

## Process

### Phase 1: Change Analysis

Parse the change request and determine:

1. **Change Type**
   - Add table/column (additive - safe)
   - Remove table/column (destructive - requires backup)
   - Rename table/column (rename - needs data migration)
   - Modify column type (transform - needs data conversion)

2. **Impact Assessment**
   - Which models are affected?
   - Which endpoints use these models?
   - Which tests cover this functionality?

**Strategy Setting**: {{strategy}} (defaults to additive)

### Phase 2: Migration Generation

1. **Detect ORM/Migration Tool**
   - Prisma? Generate prisma migrate
   - Sequelize? Generate sequelize migration
   - TypeORM? Generate typeorm migration
   - Django? Generate django makemigrations
   - Alembic? Generate alembic revision
   - Raw SQL? Generate SQL migration file

2. **Generate Migration File**
   - Create timestamped migration file
   - Include both up and down migrations
   - Add safety checks for destructive operations

3. **Validate Migration**
   - Check for syntax errors
   - Verify rollback capability
   - Test on empty database

### Phase 3: Model Updates

1. **Locate Model Files**
   - Find affected model definitions
   - Identify related types/interfaces

2. **Update Model Definitions**
   - Add/remove/modify fields
   - Update relationships
   - Maintain type consistency

3. **Update Validation Rules**
   - Schema validation (Zod, Joi, etc.)
   - Required/optional fields
   - Default values

### Phase 4: Endpoint Updates

1. **Find Affected Endpoints**
   - Search for model usage in routes
   - Identify CRUD operations
   - Find any transformations

2. **Update Request/Response Schemas**
   - Add new fields to DTOs
   - Update API documentation
   - Modify serialization logic

3. **Handle Breaking Changes**
   - Version API if needed
   - Add deprecation warnings
   - Provide migration path for clients

### Phase 5: Test Updates

1. **Find Related Tests**
   - Unit tests for models
   - Integration tests for endpoints
   - E2E tests with database

2. **Update Test Fixtures**
   - Add new fields to test data
   - Update factory functions
   - Modify seed data

3. **Add Migration Tests**
   - Test migration runs successfully
   - Test rollback works
   - Verify data integrity

## Safety Protocols

### For Additive Changes
- Safe to apply directly
- Add new columns as nullable or with defaults
- No data loss risk

### For Destructive Changes
1. Create backup checkpoint
2. Warn user of data loss risk
3. Require explicit confirmation
4. Generate rollback script

### For Rename Operations
1. Create new column
2. Copy data from old to new
3. Remove old column
4. Update all references

## Output Format

The output should include:
- Migration file path and contents
- List of modified model files
- List of modified endpoint files
- List of modified test files
- Execution instructions
- Rollback instructions

## Examples

### Example 1: Add a new column
/migrate Add email_verified boolean to users table
- Generates additive migration
- Updates User model
- Updates registration endpoint
- Adds test coverage

### Example 2: Remove a column
/migrate Remove deprecated legacy_id from orders --strategy destructive
- Creates backup checkpoint
- Generates removal migration
- Updates Order model and endpoints
- Removes from tests

### Example 3: Rename a column
/migrate Rename user.name to user.full_name --strategy rename
- Generates multi-step migration
- Updates all references
- Preserves existing data

---
*Database changes should be reversible. Always plan for rollback.*
