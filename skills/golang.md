---
name: golang
description: Go development patterns for modules, testing, and code quality
triggers:
  - go build
  - go test
  - go mod
  - golang lint
---

# Skill: Go Development Patterns

## Overview

Comprehensive Go development support including go mod management, testing patterns, linting with golangci-lint, code review rules, and Go-specific best practices for production-ready services.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    GO DEVELOPMENT PIPELINE                       │
│                                                                   │
│   Source Code                                                     │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                    GO MOD                                │    │
│   │  - Module initialization                                 │    │
│   │  - Dependency management                                 │    │
│   │  - Version resolution                                    │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                    GO BUILD                              │    │
│   │  - Cross-compilation                                     │    │
│   │  - Build tags                                            │    │
│   │  - CGO handling                                          │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                    GO TEST                               │    │
│   │  - Unit tests                                            │    │
│   │  - Table-driven tests                                    │    │
│   │  - Benchmarks                                            │    │
│   │  - Fuzz tests                                            │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │                    GOLANGCI-LINT                         │    │
│   │  - Static analysis                                       │    │
│   │  - Style checks                                          │    │
│   │  - Security lints                                        │    │
│   └─────────────────────────────────────────────────────────┘    │
│        │                                                          │
│        ▼                                                          │
│   Production-Ready Binary                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Detection

### Go Project Indicators

```yaml
detection:
  files:
    - go.mod               # Module definition
    - go.sum               # Dependency checksums
    - go.work              # Workspace file

  directories:
    - cmd/                 # Application entry points
    - pkg/                 # Public packages
    - internal/            # Private packages
    - api/                 # API definitions
    - vendor/              # Vendored dependencies

  patterns:
    - "*.go"               # Go source files
    - "*_test.go"          # Test files
```

### Go Module Analysis

```yaml
module_analysis:
  extract:
    - module_path
    - go_version
    - dependencies
    - indirect_dependencies
    - replacements
    - exclusions

  validate:
    - go_version_compatibility
    - dependency_versions
    - security_advisories
```

---

## Module Management

### Module Commands

```bash
# Initialize new module
go mod init github.com/user/project

# Add dependencies
go get github.com/pkg/errors@v0.9.1

# Update dependencies
go get -u ./...          # All
go get -u=patch ./...    # Patch updates only

# Tidy dependencies
go mod tidy

# Download dependencies
go mod download

# Vendor dependencies
go mod vendor

# Verify dependencies
go mod verify

# Show dependency graph
go mod graph

# Show why dependency is needed
go mod why github.com/pkg/errors
```

### Go Work (Multi-Module)

```bash
# Initialize workspace
go work init ./module1 ./module2

# Add module to workspace
go work use ./module3

# Sync workspace
go work sync
```

### Go.mod Configuration

```go
// go.mod

module github.com/user/project

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/lib/pq v1.10.9
    go.uber.org/zap v1.26.0
)

require (
    // indirect dependencies managed by go mod tidy
)

// Local development overrides
replace github.com/user/shared => ../shared

// Exclude vulnerable versions
exclude github.com/vulnerable/pkg v1.2.3
```

---

## Build Patterns

### Basic Build

```bash
# Build current package
go build

# Build with output name
go build -o myapp

# Build specific package
go build ./cmd/server

# Install binary
go install ./cmd/server
```

### Cross-Compilation

```bash
# Linux AMD64
GOOS=linux GOARCH=amd64 go build -o myapp-linux

# Windows
GOOS=windows GOARCH=amd64 go build -o myapp.exe

# macOS ARM
GOOS=darwin GOARCH=arm64 go build -o myapp-darwin

# Build for multiple platforms
platforms=("linux/amd64" "darwin/amd64" "windows/amd64")
for platform in "${platforms[@]}"; do
    GOOS="${platform%/*}" GOARCH="${platform#*/}" go build -o "myapp-${platform%/*}"
done
```

### Build Flags

```bash
# Optimized production build
go build -ldflags="-s -w" -o myapp

# With version information
go build -ldflags="-X main.version=1.0.0 -X main.commit=$(git rev-parse HEAD)" -o myapp

# Static binary (no CGO)
CGO_ENABLED=0 go build -o myapp

# Race detector (development)
go build -race -o myapp
```

### Build Tags

```go
//go:build linux
// +build linux

package platform

// Linux-specific implementation

//go:build integration
// +build integration

package tests

// Integration tests only run with: go test -tags=integration
```

---

## Testing Patterns

### Unit Tests

```go
// user_test.go

package user

import "testing"

func TestCreateUser(t *testing.T) {
    user, err := CreateUser("test@example.com", "password123")

    if err != nil {
        t.Fatalf("CreateUser failed: %v", err)
    }

    if user.Email != "test@example.com" {
        t.Errorf("expected email %q, got %q", "test@example.com", user.Email)
    }
}
```

### Table-Driven Tests

```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"valid email", "test@example.com", false},
        {"empty email", "", true},
        {"no at sign", "testexample.com", true},
        {"no domain", "test@", true},
        {"unicode", "test@example.co.uk", false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("ValidateEmail(%q) error = %v, wantErr %v",
                    tt.email, err, tt.wantErr)
            }
        })
    }
}
```

### Subtests and Parallel

```go
func TestUserService(t *testing.T) {
    t.Parallel() // Run test in parallel

    t.Run("Create", func(t *testing.T) {
        t.Parallel()
        // Test create functionality
    })

    t.Run("Update", func(t *testing.T) {
        t.Parallel()
        // Test update functionality
    })
}
```

### Test Fixtures

```go
func TestMain(m *testing.M) {
    // Setup
    setup()

    // Run tests
    code := m.Run()

    // Teardown
    teardown()

    os.Exit(code)
}

func setup() {
    // Initialize test database, etc.
}

func teardown() {
    // Cleanup resources
}
```

### Benchmarks

```go
func BenchmarkProcessData(b *testing.B) {
    data := generateTestData()

    b.ResetTimer()
    for i := 0; i < b.N; i++ {
        ProcessData(data)
    }
}

func BenchmarkProcessDataParallel(b *testing.B) {
    data := generateTestData()

    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
            ProcessData(data)
        }
    })
}
```

### Fuzz Testing

```go
func FuzzParseInput(f *testing.F) {
    // Seed corpus
    f.Add("valid input")
    f.Add("")
    f.Add("special chars: !@#$%")

    f.Fuzz(func(t *testing.T, input string) {
        result, err := ParseInput(input)
        if err == nil && result == nil {
            t.Error("nil result without error")
        }
    })
}
```

### Test Commands

```bash
# Run all tests
go test ./...

# Verbose output
go test -v ./...

# Run specific test
go test -run TestCreateUser ./...

# Run with coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Run benchmarks
go test -bench=. ./...

# Run with race detector
go test -race ./...

# Run fuzz tests
go test -fuzz=FuzzParseInput -fuzztime=30s ./...

# Run with build tags
go test -tags=integration ./...

# Short mode (skip slow tests)
go test -short ./...
```

---

## Linting with golangci-lint

### Configuration

```yaml
# .golangci.yml

run:
  timeout: 5m
  issues-exit-code: 1
  tests: true
  modules-download-mode: readonly

linters:
  enable:
    # Default linters
    - errcheck
    - gosimple
    - govet
    - ineffassign
    - staticcheck
    - unused

    # Additional recommended
    - bodyclose
    - contextcheck
    - dupl
    - errorlint
    - exhaustive
    - exportloopref
    - gocognit
    - goconst
    - gocritic
    - gocyclo
    - godot
    - gofmt
    - goimports
    - gomnd
    - goprintffuncname
    - gosec
    - misspell
    - nakedret
    - nestif
    - nilerr
    - noctx
    - nolintlint
    - prealloc
    - predeclared
    - revive
    - rowserrcheck
    - sqlclosecheck
    - stylecheck
    - tparallel
    - unconvert
    - unparam
    - wastedassign
    - whitespace

linters-settings:
  errcheck:
    check-type-assertions: true
    check-blank: true

  govet:
    check-shadowing: true

  gocyclo:
    min-complexity: 15

  gocognit:
    min-complexity: 20

  goconst:
    min-len: 3
    min-occurrences: 3

  misspell:
    locale: US

  gomnd:
    ignored-numbers:
      - '0'
      - '1'
      - '2'
    ignored-functions:
      - 'time.*'

  gosec:
    severity: medium
    confidence: medium

  revive:
    rules:
      - name: exported
        severity: warning
      - name: unused-parameter
        severity: warning

issues:
  exclude-rules:
    - path: _test\.go
      linters:
        - dupl
        - gomnd
        - goconst

  max-issues-per-linter: 0
  max-same-issues: 0
```

### Lint Commands

```bash
# Run all linters
golangci-lint run

# Run with verbose output
golangci-lint run -v

# Run specific linters
golangci-lint run --enable=gosec,errcheck

# Auto-fix issues
golangci-lint run --fix

# Run on specific path
golangci-lint run ./pkg/...

# Show enabled linters
golangci-lint linters
```

---

## Code Review Rules

### Error Handling

```yaml
review_errors:
  patterns:
    always_check:
      - "Never ignore error returns"
      - "Use errors.Is() for error comparison"
      - "Use errors.As() for error type assertion"
      - "Wrap errors with context"

    error_wrapping: |
      // Good: wrap with context
      if err != nil {
          return fmt.Errorf("failed to process user %s: %w", userID, err)
      }

      // Check error types
      if errors.Is(err, sql.ErrNoRows) {
          return nil, ErrNotFound
      }

    sentinel_errors: |
      // Define sentinel errors
      var (
          ErrNotFound = errors.New("resource not found")
          ErrInvalid  = errors.New("invalid input")
      )

    custom_errors: |
      // Custom error type
      type ValidationError struct {
          Field   string
          Message string
      }

      func (e *ValidationError) Error() string {
          return fmt.Sprintf("%s: %s", e.Field, e.Message)
      }
```

### Concurrency

```yaml
review_concurrency:
  goroutines:
    - "Always clean up goroutines"
    - "Use context for cancellation"
    - "Avoid goroutine leaks"

    pattern: |
      func processWithContext(ctx context.Context) error {
          done := make(chan error, 1)

          go func() {
              done <- doWork()
          }()

          select {
          case err := <-done:
              return err
          case <-ctx.Done():
              return ctx.Err()
          }
      }

  channels:
    - "Prefer buffered channels when appropriate"
    - "Close channels from sender side"
    - "Use select with default for non-blocking"

  sync:
    - "Prefer sync.RWMutex for read-heavy workloads"
    - "Use sync.Once for initialization"
    - "Consider sync.Pool for object reuse"
    - "Use atomic operations for simple counters"
```

### Interface Design

```yaml
review_interfaces:
  principles:
    - "Accept interfaces, return structs"
    - "Keep interfaces small"
    - "Define interfaces at point of use"

    good_example: |
      // Good: small interface at point of use
      type UserReader interface {
          GetUser(id string) (*User, error)
      }

      func ProcessUser(r UserReader, id string) error {
          user, err := r.GetUser(id)
          // ...
      }

    bad_example: |
      // Bad: large interface defined with implementation
      type UserService interface {
          GetUser(id string) (*User, error)
          CreateUser(user *User) error
          UpdateUser(user *User) error
          DeleteUser(id string) error
          ListUsers() ([]*User, error)
          // ... many more methods
      }
```

### Resource Management

```yaml
review_resources:
  defer_pattern:
    - "Use defer for cleanup"
    - "Check error in deferred close"

    example: |
      func readFile(path string) ([]byte, error) {
          f, err := os.Open(path)
          if err != nil {
              return nil, err
          }
          defer func() {
              if err := f.Close(); err != nil {
                  log.Printf("error closing file: %v", err)
              }
          }()

          return io.ReadAll(f)
      }

  connection_handling:
    - "Use connection pools"
    - "Set appropriate timeouts"
    - "Handle graceful shutdown"
```

### Context Usage

```yaml
review_context:
  rules:
    - "First parameter should be context"
    - "Never store context in struct"
    - "Don't pass nil context"

    good_example: |
      func (s *Service) GetUser(ctx context.Context, id string) (*User, error) {
          ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
          defer cancel()

          return s.db.GetUser(ctx, id)
      }

    propagation: |
      // Propagate context through call chain
      func Handler(w http.ResponseWriter, r *http.Request) {
          ctx := r.Context()
          user, err := userService.GetUser(ctx, userID)
          // ...
      }
```

---

## Code Generation

```bash
# Generate mocks (mockgen)
mockgen -source=interfaces.go -destination=mocks/mock_interfaces.go

# Generate from go:generate comments
go generate ./...

# Generate stringer
go generate ./...
//go:generate stringer -type=Status

# Generate protobuf
protoc --go_out=. --go-grpc_out=. api.proto
```

---

## CI/CD Pipeline

```yaml
# .github/workflows/go.yml

name: Go CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.22'
          cache: true

      - name: Verify dependencies
        run: go mod verify

      - name: Build
        run: go build -v ./...

      - name: Test
        run: go test -race -coverprofile=coverage.out -covermode=atomic ./...

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: coverage.out

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.22'
          cache: true

      - name: golangci-lint
        uses: golangci/golangci-lint-action@v4
        with:
          version: latest

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Gosec
        uses: securego/gosec@master
        with:
          args: ./...

      - name: Run govulncheck
        run: |
          go install golang.org/x/vuln/cmd/govulncheck@latest
          govulncheck ./...
```

---

## Commands

```bash
# Module commands
/go mod init <module>          # Initialize module
/go mod tidy                   # Clean dependencies
/go mod verify                 # Verify dependencies

# Build commands
/go build                      # Build package
/go build --release            # Production build
/go build --cross <os/arch>    # Cross-compile

# Test commands
/go test                       # Run all tests
/go test --cover               # With coverage
/go test --race                # With race detector
/go test --bench               # Run benchmarks
/go test --fuzz                # Run fuzz tests

# Lint commands
/go lint                       # Run golangci-lint
/go lint --fix                 # Auto-fix issues
/go fmt                        # Format code

# Full pipeline
/go check                      # fmt + lint + test
```

---

## Configuration

```yaml
# config/golang.yaml
golang:
  enabled: true

  version: "1.22"

  module:
    private: "github.com/myorg/*"
    proxy: "https://proxy.golang.org"

  build:
    cgo_enabled: false
    ldflags: "-s -w"
    tags: []

  test:
    coverage_threshold: 80
    race_detection: true
    timeout: 5m
    tags:
      - unit

  lint:
    config: .golangci.yml
    timeout: 5m

  review:
    error_handling: strict
    context_usage: required
    concurrency_patterns: enforced
```

---

*Production-ready Go development with simplicity and performance.*
