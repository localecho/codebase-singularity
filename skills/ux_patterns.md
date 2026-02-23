---
name: ux_patterns
description: UX patterns for terminal output, progress indication, and error handling
triggers:
  - show progress
  - format error
  - terminal output
  - responsive display
---

# Skill: UX Patterns for Terminal Applications

## Overview

Production-ready patterns for progress indication, error messaging, and responsive terminal output. Addresses common UX issues in CLI and agent-based applications.

---

## 1. Progress Indication Patterns

### Issue Addressed: #38 - No progress indication during long operations

Long-running operations must provide feedback to users about:
- Current phase
- Current file being processed
- Elapsed time
- Ability to cancel gracefully

### Progress Display Structure

```
Progress Indicator Components:
+---------------------------------------------------------+
|                                                         |
|  PHASE INDICATOR                                        |
|  Shows which major step is currently executing          |
|                                                         |
|  FILE INDICATOR                                         |
|  Shows current file or item being processed             |
|                                                         |
|  PROGRESS BAR (optional)                                |
|  Visual representation of completion percentage         |
|                                                         |
|  ELAPSED TIME                                           |
|  Time since operation started                           |
|                                                         |
|  CANCEL HINT                                            |
|  Instructions for graceful cancellation                 |
|                                                         |
+---------------------------------------------------------+
```

### Standard Progress Output

```yaml
progress_output:
  format: |
    [PHASE] {phase_name} ({current}/{total})
    Processing: {current_item}
    Elapsed: {elapsed_time}
    Press Ctrl+C to cancel gracefully

  example: |
    [BUILD] Compiling TypeScript (3/7)
    Processing: src/services/auth.ts
    Elapsed: 00:01:23
    Press Ctrl+C to cancel gracefully
```

### Progress Bar Variants

```yaml
progress_bars:
  # Simple percentage bar
  simple:
    format: "[{filled}{empty}] {percent}%"
    example: "[=========>          ] 45%"
    width: 30
    filled_char: "="
    empty_char: " "
    head_char: ">"

  # Detailed progress bar
  detailed:
    format: |
      {phase}: [{filled}{empty}] {current}/{total} ({percent}%)
    example: |
      BUILD: [=========>          ] 45/100 (45%)

  # Spinner for indeterminate progress
  spinner:
    frames: ["|", "/", "-", "\\"]
    interval_ms: 100
    format: "{spinner} {message}"
    example: "/ Processing files..."

  # Multi-phase progress
  multi_phase:
    format: |
      Phase {phase_num}/{total_phases}: {phase_name}
      [{filled}{empty}] {current}/{total}
    example: |
      Phase 2/4: BUILD
      [=========>          ] 15/35
```

### Phase Indicators

```yaml
phase_display:
  # Use consistent phase naming
  phases:
    - name: INIT
      display: "Initializing..."
      icon: "[*]"

    - name: PLAN
      display: "Creating specification..."
      icon: "[P]"

    - name: BUILD
      display: "Building implementation..."
      icon: "[B]"

    - name: REVIEW
      display: "Reviewing changes..."
      icon: "[R]"

    - name: FIX
      display: "Applying fixes..."
      icon: "[F]"

    - name: DONE
      display: "Complete"
      icon: "[+]"

  # Multi-phase display
  multi_phase_format: |
    [*] INIT     [+] Complete
    [P] PLAN     [+] Complete
    [B] BUILD    [>] In Progress (45%)
    [R] REVIEW   [ ] Pending
    [F] FIX      [ ] Pending
```

### Elapsed Time Formatting

```yaml
elapsed_time:
  format_rules:
    - condition: "< 60 seconds"
      format: "{seconds}s"
      example: "42s"

    - condition: "< 60 minutes"
      format: "{minutes}:{seconds:02d}"
      example: "5:23"

    - condition: ">= 60 minutes"
      format: "{hours}:{minutes:02d}:{seconds:02d}"
      example: "1:23:45"

  update_frequency_ms: 1000
```

### Graceful Cancellation (Ctrl+C)

```yaml
cancellation:
  signal: SIGINT

  handling:
    on_first_press:
      action: "initiate_graceful_shutdown"
      message: |
        Cancellation requested. Finishing current operation...
        Press Ctrl+C again to force quit.

    on_second_press:
      action: "force_quit"
      message: "Force quitting..."

    cleanup_actions:
      - "Save partial progress to checkpoint"
      - "Close file handles"
      - "Release locks"
      - "Write cancellation log"

  checkpoint_format:
    file: "specs/CURRENT.md"
    content: |
      ## Cancelled Session
      - Operation: {operation_name}
      - Phase: {current_phase}
      - Progress: {current}/{total}
      - Files Completed: {completed_files}
      - Remaining: {remaining_files}
      - Cancelled At: {timestamp}
      - Resume Command: {resume_command}
```

### Implementation Example

```
Long Operation Progress Display:
+----------------------------------------------------------+
|                                                          |
|  ORCHESTRATOR - Autonomous Workflow                      |
|  ================================================        |
|                                                          |
|  Phase: BUILD (2/4)                                      |
|                                                          |
|  [====================----------] 67% (20/30 files)      |
|                                                          |
|  Current: src/components/Dashboard.tsx                   |
|  Elapsed: 02:34                                          |
|                                                          |
|  Recent:                                                 |
|    [+] src/components/Header.tsx                         |
|    [+] src/components/Sidebar.tsx                        |
|    [>] src/components/Dashboard.tsx                      |
|    [ ] src/components/Footer.tsx                         |
|                                                          |
|  Press Ctrl+C to cancel gracefully                       |
|                                                          |
+----------------------------------------------------------+
```

---

## 2. Error Message Formatting

### Issue Addressed: #39 - Error messages are cryptic

Error messages must include:
- Human-readable description
- Suggestions for resolution
- Links to relevant documentation

### Error Message Structure

```yaml
error_structure:
  required_fields:
    - error_code        # Unique identifier for programmatic handling
    - title             # Human-readable summary (1 line)
    - description       # Detailed explanation
    - suggestion        # What the user can do

  optional_fields:
    - docs_link         # Link to documentation
    - context           # Relevant context (file, line, etc.)
    - related_errors    # Other errors that might be relevant
    - recovery_command  # Command to recover/retry
```

### Error Severity Levels

```yaml
severity_levels:
  critical:
    prefix: "[CRITICAL]"
    color: red
    description: "Operation cannot continue"
    requires_action: true

  error:
    prefix: "[ERROR]"
    color: red
    description: "Operation failed but can retry"
    requires_action: true

  warning:
    prefix: "[WARNING]"
    color: yellow
    description: "Operation succeeded with issues"
    requires_action: false

  info:
    prefix: "[INFO]"
    color: blue
    description: "Informational message"
    requires_action: false
```

### Error Message Templates

```yaml
error_templates:
  file_not_found:
    code: E001
    title: "File not found"
    template: |
      [ERROR] File not found: {file_path}

      The specified file does not exist or cannot be accessed.

      Suggestions:
        - Check if the file path is correct
        - Verify the file exists: ls -la {parent_dir}
        - Check file permissions

      Docs: https://docs.example.com/errors/E001

  permission_denied:
    code: E002
    title: "Permission denied"
    template: |
      [ERROR] Permission denied: {file_path}

      You don't have permission to access this file.

      Suggestions:
        - Check file permissions: ls -la {file_path}
        - Try running with elevated privileges (if appropriate)
        - Verify you own the file or are in the correct group

      Docs: https://docs.example.com/errors/E002

  syntax_error:
    code: E003
    title: "Syntax error in file"
    template: |
      [ERROR] Syntax error in {file_path}:{line_number}

      {error_message}

      Context:
        {line_number - 1} | {prev_line}
      > {line_number}     | {error_line}
        {line_number + 1} | {next_line}
                           {caret_position}

      Suggestions:
        - Check for missing brackets, quotes, or semicolons
        - Verify proper indentation
        - Run linter: npm run lint {file_path}

      Docs: https://docs.example.com/errors/E003

  network_error:
    code: E004
    title: "Network error"
    template: |
      [ERROR] Network error: {endpoint}

      Failed to connect to {host}:{port}

      Suggestions:
        - Check your internet connection
        - Verify the service is running
        - Check if firewall is blocking the connection
        - Try again in a few moments

      Retry: {retry_command}
      Docs: https://docs.example.com/errors/E004

  validation_error:
    code: E005
    title: "Validation failed"
    template: |
      [ERROR] Validation failed for {item}

      {validation_message}

      Expected: {expected}
      Received: {received}

      Suggestions:
        - Review the input format requirements
        - Check the specification: specs/CURRENT.md

      Docs: https://docs.example.com/errors/E005

  timeout_error:
    code: E006
    title: "Operation timed out"
    template: |
      [ERROR] Operation timed out after {duration}

      The operation took too long to complete.

      Suggestions:
        - Check system resources (CPU, memory)
        - Try with a smaller dataset
        - Increase timeout: --timeout={suggested_timeout}
        - Check for infinite loops in code

      Retry: {retry_command}
      Docs: https://docs.example.com/errors/E006

  dependency_error:
    code: E007
    title: "Missing dependency"
    template: |
      [ERROR] Missing dependency: {dependency_name}

      Required package {dependency_name}@{version} is not installed.

      Suggestions:
        - Install the package: npm install {dependency_name}
        - Check package.json for version conflicts
        - Clear node_modules and reinstall: rm -rf node_modules && npm install

      Docs: https://docs.example.com/errors/E007
```

### Error Output Example

```
Error Display Format:
+----------------------------------------------------------+
|                                                          |
|  [ERROR] E003: Syntax error in file                      |
|  ================================================        |
|                                                          |
|  File: src/services/auth.ts:42                           |
|                                                          |
|  Unexpected token '}'                                    |
|                                                          |
|  Context:                                                |
|    41 |   const token = generateToken(user);             |
|  > 42 |   }                                              |
|    43 |   return token;                                  |
|        ^                                                 |
|                                                          |
|  Suggestions:                                            |
|    - Check for missing brackets or semicolons            |
|    - Verify proper function closure                      |
|    - Run: npm run lint src/services/auth.ts              |
|                                                          |
|  Docs: https://docs.example.com/errors/E003              |
|                                                          |
+----------------------------------------------------------+
```

### Error Recovery

```yaml
error_recovery:
  # Automatic recovery strategies
  strategies:
    retry:
      max_attempts: 3
      backoff_ms: [1000, 2000, 5000]
      applicable_errors: [E004, E006]

    fallback:
      action: "use_cached_version"
      applicable_errors: [E004]

    escalate:
      action: "request_human_input"
      applicable_errors: [E001, E002, E003]

  # Recovery command suggestions
  common_fixes:
    - error: E001
      commands:
        - "touch {file_path}  # Create empty file"
        - "git checkout -- {file_path}  # Restore from git"

    - error: E007
      commands:
        - "npm install  # Install all dependencies"
        - "npm install {dependency}  # Install specific package"
```

---

## 3. Responsive Terminal Output

### Issue Addressed: #40 - ASCII art dashboards break in narrow terminals

Terminal output must:
- Detect terminal width
- Provide compact mode for narrow terminals
- Fall back to plain text when necessary

### Terminal Width Detection

```yaml
terminal_detection:
  detection_methods:
    - method: "tput cols"
      fallback: 80
    - method: "stty size | cut -d' ' -f2"
      fallback: 80
    - method: "$COLUMNS environment variable"
      fallback: 80

  width_thresholds:
    wide: 120      # Full ASCII art with all details
    standard: 80   # Standard ASCII art
    narrow: 60     # Compact mode
    minimal: 40    # Plain text only
```

### Responsive Output Modes

```yaml
output_modes:
  wide:
    min_width: 120
    features:
      - full_ascii_borders
      - multi_column_layout
      - detailed_tables
      - progress_bars
      - icons

  standard:
    min_width: 80
    features:
      - standard_ascii_borders
      - single_column_layout
      - simplified_tables
      - progress_bars
      - icons

  narrow:
    min_width: 60
    features:
      - minimal_borders
      - single_column_layout
      - list_format_tables
      - text_progress
      - no_icons

  minimal:
    min_width: 40
    features:
      - no_borders
      - plain_text
      - inline_data
      - percentage_only
      - no_icons
```

### Responsive Status Display

```yaml
status_display:
  wide: |
    +---------------------------------------------------------+
    |            CODEBASE SINGULARITY - STATUS                |
    +---------------------------------------------------------+
    | Workflow State      | Agentic Layer       | Git Status  |
    |---------------------|---------------------|-------------|
    | Workflow: BUILD     | Commands: 8         | Branch: main|
    | Phase: 2/4          | Skills: 22          | Ahead: +3   |
    | Progress: 67%       | Specs: 5            | Modified: 2 |
    +---------------------------------------------------------+

  standard: |
    ================================================
    CODEBASE SINGULARITY - STATUS
    ================================================
    Workflow: BUILD (Phase 2/4) - 67%
    Agentic: 8 commands, 22 skills, 5 specs
    Git: main (+3 ahead, 2 modified)
    ================================================

  narrow: |
    --- STATUS ---
    Workflow: BUILD 2/4 (67%)
    Commands: 8 | Skills: 22
    Branch: main (+3, 2 mod)
    --------------

  minimal: |
    STATUS: BUILD 2/4 67%
    main +3/2mod
```

### Responsive Progress Display

```yaml
progress_display:
  wide: |
    [BUILD] Phase 2 of 4
    File: src/components/Dashboard.tsx
    [====================----------] 67% (20/30)
    Elapsed: 02:34 | ETA: 01:15

  standard: |
    BUILD (2/4): Dashboard.tsx
    [=========>          ] 67%
    02:34 elapsed

  narrow: |
    BUILD 2/4: 67%
    Dashboard.tsx
    02:34

  minimal: |
    BUILD 67% (02:34)
```

### Responsive Table Formatting

```yaml
table_formats:
  wide:
    style: "bordered"
    example: |
      +------------+--------+----------+
      | Category   | Issues | Critical |
      +------------+--------+----------+
      | Security   |      2 |        1 |
      | Correctness|      5 |        0 |
      | Performance|      1 |        0 |
      +------------+--------+----------+

  standard:
    style: "simple"
    example: |
      Category     | Issues | Critical
      -------------|--------|----------
      Security     |      2 |        1
      Correctness  |      5 |        0
      Performance  |      1 |        0

  narrow:
    style: "list"
    example: |
      Security: 2 issues (1 critical)
      Correctness: 5 issues
      Performance: 1 issue

  minimal:
    style: "inline"
    example: |
      Sec:2(1crit) Corr:5 Perf:1
```

### Border Characters

```yaml
border_sets:
  unicode_heavy:
    top_left: "+"
    top_right: "+"
    bottom_left: "+"
    bottom_right: "+"
    horizontal: "-"
    vertical: "|"
    cross: "+"
    t_down: "+"
    t_up: "+"
    t_left: "+"
    t_right: "+"

  unicode_light:
    top_left: "+"
    top_right: "+"
    bottom_left: "+"
    bottom_right: "+"
    horizontal: "-"
    vertical: "|"
    cross: "+"

  ascii:
    top_left: "+"
    top_right: "+"
    bottom_left: "+"
    bottom_right: "+"
    horizontal: "-"
    vertical: "|"
    cross: "+"

  minimal:
    horizontal: "-"
    vertical: ""
    separator: " | "

  none:
    # No borders, just spacing
```

### Implementation Guidelines

```yaml
implementation:
  # Check terminal width at startup
  startup_check: |
    width=$(tput cols 2>/dev/null || echo 80)
    if [ "$width" -lt 40 ]; then
      OUTPUT_MODE="minimal"
    elif [ "$width" -lt 60 ]; then
      OUTPUT_MODE="narrow"
    elif [ "$width" -lt 120 ]; then
      OUTPUT_MODE="standard"
    else
      OUTPUT_MODE="wide"
    fi

  # Re-check on window resize (SIGWINCH)
  resize_handling: |
    trap 'recalculate_layout' SIGWINCH

  # Truncation rules
  truncation:
    file_paths:
      max_length: "width - 20"
      strategy: "middle_ellipsis"
      example: "src/com.../Dashboard.tsx"

    messages:
      max_length: "width - 5"
      strategy: "end_ellipsis"
      example: "Processing authentication servi..."

    tables:
      strategy: "priority_columns"
      priority: ["name", "status", "value"]
```

---

## Usage in Commands

Reference this skill in commands that produce terminal output:

```yaml
# In any command that has long operations
progress: See skills/ux_patterns.md#progress-indication-patterns

# In any command that can produce errors
errors: See skills/ux_patterns.md#error-message-formatting

# In any command with visual output
display: See skills/ux_patterns.md#responsive-terminal-output
```

---

## Quick Reference

### Progress Indication Checklist
- [ ] Show current phase name
- [ ] Show current file/item being processed
- [ ] Display elapsed time
- [ ] Show Ctrl+C cancellation hint
- [ ] Save checkpoint on cancellation

### Error Message Checklist
- [ ] Include error code
- [ ] Human-readable title
- [ ] Clear description
- [ ] At least one actionable suggestion
- [ ] Link to documentation (if available)
- [ ] Show relevant context (file, line)

### Responsive Output Checklist
- [ ] Detect terminal width
- [ ] Support at least 3 display modes (standard, narrow, minimal)
- [ ] Truncate long content appropriately
- [ ] Use ASCII-only characters for compatibility
- [ ] Handle window resize gracefully

---

*Consistent UX patterns for professional CLI experiences.*
