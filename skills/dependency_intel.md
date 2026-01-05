---
name: dependency_intel
description: ML-powered dependency management and upgrade intelligence
triggers:
  - check dependencies
  - upgrade analysis
  - dependency risk
---

# Skill: Dependency Upgrade Intelligence

## Overview

ML-powered dependency management with breaking change prediction, upgrade risk scoring, migration path generation, and compatibility analysis.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│            DEPENDENCY INTELLIGENCE SYSTEM                   │
│                                                             │
│   Dependency Files                                          │
│   (package.json, requirements.txt, etc.)                    │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              DEPENDENCY ANALYSIS                     │  │
│   │  - Parse lockfiles                                   │  │
│   │  - Build dependency graph                            │  │
│   │  - Identify outdated packages                        │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │           BREAKING CHANGE PREDICTION                 │  │
│   │  - Changelog analysis                                │  │
│   │  - API diff detection                                │  │
│   │  - Community reports                                 │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              RISK SCORING                            │  │
│   │  - Breaking probability                              │  │
│   │  - Usage impact                                      │  │
│   │  - Effort estimation                                 │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │           MIGRATION PATH GENERATION                  │  │
│   │  - Step-by-step upgrade plan                         │  │
│   │  - Code change suggestions                           │  │
│   │  - Testing recommendations                           │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   Upgrade Report + Migration Guide                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Dependency Analysis

### Supported Package Managers

| Manager | Files | Languages |
|---------|-------|-----------|
| npm/yarn | package.json, yarn.lock | JS/TS |
| pip | requirements.txt, pyproject.toml | Python |
| cargo | Cargo.toml, Cargo.lock | Rust |
| go mod | go.mod, go.sum | Go |
| maven | pom.xml | Java |
| bundler | Gemfile, Gemfile.lock | Ruby |

### Dependency Graph

```yaml
dependency_graph:
  direct:
    - name: express
      version: 4.18.2
      latest: 4.19.0
      type: production

    - name: lodash
      version: 4.17.15
      latest: 4.17.21
      type: production
      vulnerability: true

  transitive:
    - name: body-parser
      version: 1.20.1
      parent: express
      depth: 1

  stats:
    total_direct: 45
    total_transitive: 312
    outdated: 23
    vulnerable: 5
```

---

## Breaking Change Prediction

### ML Model

```yaml
breaking_change_model:
  type: classifier
  features:
    - version_bump_type  # major, minor, patch
    - changelog_keywords  # BREAKING, deprecated, removed
    - api_diff_score
    - community_reports
    - time_since_release
    - maintainer_activity

  training_data:
    source: npm_upgrade_history
    samples: 500000
    accuracy: 89%
```

### Changelog Analysis

```yaml
changelog_analysis:
  package: react
  from: 17.0.2
  to: 18.0.0

  detected_changes:
    breaking:
      - "Removed legacy context API"
      - "Changed concurrent rendering default"
      - "Dropped IE11 support"

    deprecated:
      - "ReactDOM.render → createRoot"
      - "componentWillMount lifecycle"

    new_features:
      - "Automatic batching"
      - "Transitions API"
      - "Suspense improvements"

  breaking_probability: 0.85
  migration_effort: high
```

---

## Upgrade Risk Scoring

### Risk Factors

```yaml
risk_factors:
  breaking_probability:
    weight: 0.30
    source: ml_prediction

  usage_breadth:
    weight: 0.25
    calculation: |
      (files_using_package / total_files) *
      (import_count / total_imports)

  api_surface:
    weight: 0.20
    calculation: "number of imported functions/classes"

  test_coverage:
    weight: 0.15
    calculation: "coverage of code using this package"

  community_health:
    weight: 0.10
    factors:
      - issue_resolution_time
      - maintainer_count
      - recent_activity
```

### Risk Score Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         UPGRADE RISK ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Package: react 17.0.2 → 18.0.0

  Overall Risk: HIGH (7.8/10)

  Breakdown:
    Breaking Changes:    ████████░░ 8.5
    Usage Impact:        ███████░░░ 7.2
    Migration Effort:    ████████░░ 8.0
    Test Coverage Gap:   █████░░░░░ 5.0

  Your Usage:
    Files affected: 45
    Components: 23
    Hooks: 12

  Recommendation:
    ⚠️ Plan dedicated migration sprint
    📋 Follow migration guide below
    🧪 Extensive testing required

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Migration Path Generation

### Step-by-Step Plan

```yaml
migration_plan:
  package: react
  from: 17.0.2
  to: 18.0.0

  phases:
    - phase: 1
      name: "Preparation"
      tasks:
        - "Update React DevTools"
        - "Add StrictMode to identify issues"
        - "Run existing tests"
      estimated_time: "2 hours"

    - phase: 2
      name: "Update Dependencies"
      tasks:
        - "Update react and react-dom"
        - "Update @types/react if using TypeScript"
        - "Update react-test-renderer"
      commands:
        - "npm install react@18 react-dom@18"
      estimated_time: "30 minutes"

    - phase: 3
      name: "Code Changes"
      tasks:
        - file: src/index.tsx
          change: "Replace ReactDOM.render with createRoot"
          before: |
            ReactDOM.render(<App />, document.getElementById('root'));
          after: |
            const root = createRoot(document.getElementById('root')!);
            root.render(<App />);

        - file: "**/*.tsx"
          change: "Remove deprecated lifecycle methods"
          pattern: "componentWillMount → useEffect"

      estimated_time: "4 hours"

    - phase: 4
      name: "Testing"
      tasks:
        - "Run full test suite"
        - "Manual testing of critical flows"
        - "Performance comparison"
      estimated_time: "2 hours"

  total_estimated_time: "8.5 hours"
```

### Code Change Suggestions

```typescript
// Generated migration diff

// BEFORE (React 17)
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// AFTER (React 18)
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Compatibility Analysis

### Peer Dependency Check

```yaml
compatibility_matrix:
  upgrade: react@18.0.0

  compatible:
    - react-router-dom@6.x ✅
    - redux@4.x ✅
    - axios@1.x ✅

  needs_upgrade:
    - react-redux: 7.x → 8.x
      reason: "React 18 hooks compatibility"

    - @testing-library/react: 12.x → 14.x
      reason: "createRoot support"

  incompatible:
    - react-beautiful-dnd: 13.x ❌
      reason: "Not yet compatible with React 18"
      alternative: "@hello-pangea/dnd"
```

### Upgrade Order

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RECOMMENDED UPGRADE ORDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. typescript      4.9 → 5.0   (no deps)
  2. eslint          8.x → 8.56  (low risk)
  3. jest            29.x → 29.7 (low risk)
  4. react           17 → 18     (medium risk)
  5. react-redux     7 → 8       (depends on #4)
  6. @testing-lib    12 → 14     (depends on #4)

  Packages to upgrade together:
    [react, react-dom, @types/react, @types/react-dom]

  Packages to replace:
    react-beautiful-dnd → @hello-pangea/dnd

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Automated Upgrades

### Safe Auto-Upgrade

```yaml
auto_upgrade:
  enabled: true

  criteria:
    patch_updates: auto
    minor_updates: auto_if_tested
    major_updates: manual

  safety_checks:
    - run_tests: true
    - check_types: true
    - lint: true

  rollback_on_failure: true
```

---

## Commands

```bash
# Analyze all dependencies
/deps analyze

# Check specific package upgrade
/deps upgrade react --to 18.0.0

# Generate migration plan
/deps migrate lodash@4.17.21

# Find compatibility issues
/deps compat

# Auto-upgrade safe packages
/deps auto-upgrade --patch
```

---

## Configuration

```yaml
# config/dependency_intel.yaml
dependency_intel:
  enabled: true

  analysis:
    include_dev: true
    check_transitive: true
    vulnerability_scan: true

  risk_thresholds:
    auto_upgrade: 3.0
    review_required: 6.0
    block: 9.0

  auto_upgrade:
    enabled: true
    patch: auto
    minor: review
    major: manual

  notifications:
    outdated_count: 10
    vulnerability_found: immediate
    major_available: weekly

  ignore:
    packages:
      - "internal-package"
    versions:
      - "react@17.x"  # Intentionally pinned
```

---

*Intelligent dependency management for safer upgrades.*
