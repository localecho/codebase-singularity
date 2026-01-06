---
name: rust
description: Rust/Cargo development patterns for building, testing, and code quality
triggers:
  - rust build
  - cargo test
  - rust lint
  - clippy check
---

# Skill: Rust Development Patterns

## Overview

Comprehensive Rust development support including Cargo build/test/clippy patterns, code review rules, workspace management, and Rust-specific best practices for production-ready code.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   RUST DEVELOPMENT PIPELINE                      │
│                                                                   │
│   Source Code                                                     │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                    CARGO BUILD                           │    │
│   │  - Debug/Release profiles                                │    │
│   │  - Feature flags                                         │    │
│   │  - Workspace management                                  │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                    CARGO TEST                            │    │
│   │  - Unit tests                                            │    │
│   │  - Integration tests                                     │    │
│   │  - Doc tests                                             │    │
│   │  - Property-based tests (proptest)                       │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                    CARGO CLIPPY                          │    │
│   │  - Lint checks                                           │    │
│   │  - Pedantic rules                                        │    │
│   │  - Nursery lints                                         │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                    CODE REVIEW                           │    │
│   │  - Ownership patterns                                    │    │
│   │  - Error handling                                        │    │
│   │  - Unsafe code audit                                     │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   Production-Ready Binary                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Detection

### Rust Project Indicators

```yaml
detection:
  files:
    - Cargo.toml           # Primary indicator
    - Cargo.lock           # Dependency lock file
    - rust-toolchain.toml  # Toolchain specification
    - .cargo/config.toml   # Cargo configuration

  directories:
    - src/                 # Source code
    - tests/               # Integration tests
    - benches/             # Benchmarks
    - examples/            # Example programs

  workspace:
    indicator: "[workspace]"
    in_file: Cargo.toml
```

### Cargo.toml Analysis

```yaml
cargo_analysis:
  extract:
    - package_name
    - version
    - edition  # 2018, 2021, 2024
    - dependencies
    - dev_dependencies
    - build_dependencies
    - features
    - workspace_members

  validate:
    - minimum_rust_version
    - license_compatibility
    - dependency_versions
```

---

## Build Patterns

### Debug Build

```bash
# Standard debug build
cargo build

# With specific features
cargo build --features "feature1,feature2"

# All features
cargo build --all-features

# No default features
cargo build --no-default-features
```

### Release Build

```bash
# Optimized release build
cargo build --release

# With LTO (Link Time Optimization)
cargo build --release --config 'profile.release.lto=true'

# Size-optimized binary
cargo build --release --config 'profile.release.opt-level="s"'
```

### Workspace Build

```bash
# Build entire workspace
cargo build --workspace

# Build specific package
cargo build -p package-name

# Exclude packages
cargo build --workspace --exclude test-utils
```

### Build Configuration

```toml
# Cargo.toml

[profile.dev]
opt-level = 0
debug = true

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true

[profile.bench]
opt-level = 3
debug = true

[profile.test]
opt-level = 0
debug = true
```

---

## Testing Patterns

### Unit Tests

```rust
// src/lib.rs or inline in modules

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic_functionality() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }

    #[test]
    #[should_panic(expected = "division by zero")]
    fn test_panic_case() {
        divide(1, 0);
    }

    #[test]
    fn test_result_ok() -> Result<(), String> {
        let result = try_something()?;
        assert!(result.is_valid());
        Ok(())
    }
}
```

### Integration Tests

```rust
// tests/integration_test.rs

use my_crate::public_api;

#[test]
fn test_full_workflow() {
    let client = public_api::Client::new();
    let result = client.process("input");
    assert!(result.is_ok());
}
```

### Test Commands

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_name

# Run tests in specific module
cargo test module::submodule

# Run with output
cargo test -- --nocapture

# Run ignored tests
cargo test -- --ignored

# Run doc tests only
cargo test --doc

# Run integration tests only
cargo test --test integration_test

# Test all features
cargo test --all-features

# Test with coverage (requires cargo-tarpaulin)
cargo tarpaulin --out Html
```

### Property-Based Testing

```rust
// Using proptest
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_parse_doesnt_panic(s in "\\PC*") {
        let _ = parse(&s);
    }

    #[test]
    fn test_roundtrip(value: i32) {
        let encoded = encode(value);
        let decoded = decode(&encoded);
        prop_assert_eq!(value, decoded);
    }
}
```

---

## Clippy Patterns

### Running Clippy

```bash
# Basic clippy check
cargo clippy

# All targets
cargo clippy --all-targets

# All features
cargo clippy --all-features

# Fail on warnings
cargo clippy -- -D warnings

# Pedantic mode
cargo clippy -- -W clippy::pedantic

# Fix automatically
cargo clippy --fix
```

### Clippy Configuration

```toml
# clippy.toml

# Maximum cognitive complexity
cognitive-complexity-threshold = 25

# Minimum lines for function extraction suggestion
too-many-lines-threshold = 100

# Type complexity threshold
type-complexity-threshold = 250

# Documentation requirements
missing-docs-in-private-items = false
```

### Lint Attributes

```rust
// Module-level lint configuration
#![warn(clippy::all)]
#![warn(clippy::pedantic)]
#![warn(clippy::nursery)]
#![deny(clippy::unwrap_used)]
#![deny(clippy::expect_used)]

// Allow specific lints where justified
#[allow(clippy::module_name_repetitions)]
pub struct ConfigConfig { /* ... */ }

// Expect lint (fails if lint doesn't fire)
#[expect(dead_code, reason = "Reserved for future use")]
fn future_feature() {}
```

### Common Clippy Rules

```yaml
clippy_rules:
  must_fix:
    - clippy::unwrap_used         # Use expect or handle error
    - clippy::expect_used         # Handle errors properly
    - clippy::panic               # No panics in library code
    - clippy::todo                # No TODOs in production
    - clippy::unimplemented       # Must implement
    - clippy::dbg_macro           # No debug macros

  recommended:
    - clippy::redundant_clone     # Remove unnecessary clones
    - clippy::needless_pass_by_value    # Use references
    - clippy::inefficient_to_string     # Use to_owned
    - clippy::manual_string_new   # Use String::new()
    - clippy::map_unwrap_or       # Use and_then

  pedantic:
    - clippy::doc_markdown        # Proper documentation
    - clippy::missing_errors_doc  # Document error conditions
    - clippy::missing_panics_doc  # Document panic conditions
    - clippy::must_use_candidate  # Add must_use attributes
```

---

## Code Review Rules

### Ownership & Borrowing

```yaml
review_ownership:
  patterns:
    prefer_references:
      - "Use &T instead of T for read-only access"
      - "Use &mut T instead of T when modification needed"
      - "Avoid unnecessary clones"

    lifetime_clarity:
      - "Explicit lifetimes when compiler cannot infer"
      - "Named lifetimes for complex relationships"
      - "Document lifetime requirements"

    move_semantics:
      - "Document ownership transfers"
      - "Use move closures when capturing ownership"
      - "Consider Arc/Rc for shared ownership"
```

### Error Handling

```yaml
review_errors:
  required:
    - "Use Result<T, E> for recoverable errors"
    - "Use thiserror for error type definitions"
    - "Use anyhow for application error handling"
    - "Never use unwrap/expect in library code"

  error_type_pattern: |
    use thiserror::Error;

    #[derive(Error, Debug)]
    pub enum MyError {
        #[error("I/O error: {0}")]
        Io(#[from] std::io::Error),

        #[error("Parse error at line {line}: {message}")]
        Parse { line: usize, message: String },

        #[error("Not found: {0}")]
        NotFound(String),
    }
```

### Unsafe Code

```yaml
review_unsafe:
  requirements:
    - "Document safety invariants"
    - "Minimize unsafe scope"
    - "Provide safe abstractions"
    - "Audit all unsafe blocks"

  example: |
    /// SAFETY: The pointer must be valid and properly aligned.
    /// The caller must ensure the data is initialized.
    unsafe fn read_raw<T>(ptr: *const T) -> T {
        // SAFETY: Caller guarantees validity
        ptr.read()
    }

  audit_checklist:
    - "Raw pointer dereferencing justified"
    - "FFI boundaries documented"
    - "Mutable static access synchronized"
    - "Union field access validated"
```

### Async/Concurrency

```yaml
review_async:
  patterns:
    - "Use tokio or async-std runtime"
    - "Avoid blocking in async context"
    - "Use spawn_blocking for CPU-bound work"
    - "Properly handle cancellation"

  concurrency:
    - "Prefer channels over shared state"
    - "Use RwLock for read-heavy workloads"
    - "Document lock ordering to prevent deadlocks"
    - "Consider lock-free data structures"
```

---

## Dependency Management

### Cargo Commands

```bash
# Add dependency
cargo add serde --features derive

# Add dev dependency
cargo add --dev mockall

# Update dependencies
cargo update

# Check for outdated
cargo outdated  # requires cargo-outdated

# Audit for vulnerabilities
cargo audit     # requires cargo-audit

# Generate dependency tree
cargo tree
```

### Dependency Review

```yaml
dependency_review:
  check:
    - "Minimal dependency footprint"
    - "No duplicate dependencies"
    - "Security audit passing"
    - "License compatibility"

  version_strategy:
    - "Use semver ranges: ^1.0 not 1.0.0"
    - "Pin in Cargo.lock for applications"
    - "Document minimum versions"
```

---

## Formatting

### Rustfmt Configuration

```toml
# rustfmt.toml

edition = "2021"
max_width = 100
tab_spaces = 4
newline_style = "Unix"
use_small_heuristics = "Default"

# Imports
imports_granularity = "Module"
group_imports = "StdExternalCrate"
reorder_imports = true

# Items
fn_single_line = false
struct_lit_single_line = true
```

### Format Commands

```bash
# Check formatting
cargo fmt -- --check

# Apply formatting
cargo fmt

# Format specific files
cargo fmt -- src/main.rs
```

---

## CI/CD Pipeline

```yaml
# .github/workflows/rust.yml

name: Rust CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  CARGO_TERM_COLOR: always
  RUSTFLAGS: "-Dwarnings"

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt, clippy

      - name: Cache cargo
        uses: Swatinem/rust-cache@v2

      - name: Check formatting
        run: cargo fmt -- --check

      - name: Clippy
        run: cargo clippy --all-targets --all-features

      - name: Build
        run: cargo build --all-features

      - name: Test
        run: cargo test --all-features

      - name: Doc tests
        run: cargo test --doc

  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable

      - name: Install tarpaulin
        run: cargo install cargo-tarpaulin

      - name: Coverage
        run: cargo tarpaulin --out Xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Security audit
        uses: rustsec/audit-check@v1
```

---

## Commands

```bash
# Build commands
/rust build                    # Debug build
/rust build --release          # Release build
/rust build --features x,y     # Build with features

# Test commands
/rust test                     # Run all tests
/rust test --coverage          # Run with coverage
/rust test module::test_name   # Run specific test

# Lint commands
/rust clippy                   # Run clippy
/rust clippy --pedantic        # Strict linting
/rust clippy --fix             # Auto-fix issues

# Format commands
/rust fmt                      # Format code
/rust fmt --check              # Check formatting

# Dependency commands
/rust deps audit               # Security audit
/rust deps update              # Update dependencies
/rust deps tree                # Show dependency tree

# Full pipeline
/rust check                    # fmt + clippy + test
```

---

## Configuration

```yaml
# config/rust.yaml
rust:
  enabled: true

  toolchain:
    channel: stable  # stable, beta, nightly
    components:
      - rustfmt
      - clippy

  build:
    default_features: true
    release_profile:
      lto: true
      codegen_units: 1

  test:
    coverage_threshold: 80
    doc_tests: true
    integration_tests: true

  clippy:
    deny_warnings: true
    pedantic: false
    nursery: false
    custom_rules: []

  format:
    check_on_save: true
    max_width: 100

  review:
    unsafe_audit: required
    error_handling: strict
    documentation: required
```

---

*Production-ready Rust development with safety and performance.*
