---
name: explain
description: Deep code understanding - explains file purpose, dependencies, and workflow integration
arguments:
  - name: target
    description: File path, function name, or component to explain
    required: true
  - name: depth
    description: Analysis depth - shallow, deep, or architectural
    required: false
---

# EXPLAIN - Code Understanding Command

## Purpose

Provide deep understanding of code by explaining its purpose, dependencies, and how it fits within the broader codebase architecture.

> Understanding code is the first step to improving it.

## Process

### Phase 1: Target Resolution

Parse the target to determine what to explain:

- File path? Load and analyze file
- Function name? Search codebase, find definition
- Component name? Locate component and related files
- Module/package? Map entire module structure

**Depth Setting**: {{depth}} (defaults to deep)

### Phase 2: Context Gathering

1. **Read Target**
   - Load the target file or find the target definition
   - Identify the programming language and framework

2. **Extract Metadata**
   - file: path/to/file
   - type: component|utility|model|controller|test|config
   - language: typescript|python|etc
   - framework: react|express|django|etc
   - lines: X
   - exports: list of exports

3. **Parse Structure**
   - Identify functions, classes, and exports
   - Note complexity indicators
   - Find entry points

### Phase 3: Dependency Analysis

Trace all dependencies in both directions:

**IMPORTS (What this file uses):**
- Internal dependencies (e.g., ./utils/helper, ../models/User)
- External dependencies (e.g., react, axios)

**DEPENDENTS (What uses this file):**
- List all files that import/require this target
- Note which features depend on it

### Phase 4: Workflow Integration

Explain how the target fits into larger workflows:

1. **Data Flow Analysis**
   - Where does data enter?
   - How is it transformed?
   - Where does it exit?

2. **Call Chain Tracing**
   - Entry Point -> Router/Handler -> [TARGET] -> Database/API -> Response

3. **Related Features**
   - What features depend on this code?
   - What would break if this changed?

### Phase 5: Purpose Explanation

Generate human-readable explanation covering:

- Summary: One paragraph explaining what this code does
- Key Responsibilities: Numbered list
- How It Works: Step-by-step explanation
- Integration Points: Called by, Calls, Events
- Important Notes: Gotchas, performance, security

## Depth Modes

### Shallow (--depth shallow)
- File purpose only
- Direct imports/exports
- One-sentence summary

### Deep (--depth deep) [Default]
- Full dependency trace
- Workflow integration
- Line-by-line explanation of complex logic

### Architectural (--depth architectural)
- System-wide impact
- All transitive dependencies
- Design pattern identification
- Refactoring opportunities

## Output Format

The output should include:
- Target identification and metadata
- Purpose explanation in plain English
- Dependency map (imports and dependents)
- Workflow diagram showing data flow
- Key functions with their responsibilities
- Important notes and considerations

## Examples

### Example 1: Explain a file
/explain src/auth/middleware.ts
- Analyzes authentication middleware
- Shows request flow through auth
- Maps to protected routes

### Example 2: Explain a function
/explain validateUserInput --depth shallow
- Quick overview of input validation
- Lists parameters and return type
- Notes any security implications

### Example 3: Architectural analysis
/explain src/api/ --depth architectural
- Maps entire API module
- Shows route hierarchy
- Identifies design patterns
- Suggests improvements

---
*Understanding before modification. Clarity before complexity.*
