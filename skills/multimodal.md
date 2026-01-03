---
name: multimodal
description: Multi-modal support for diagrams, screenshots, and visual inputs
triggers:
  - analyze image
  - screenshot analysis
  - diagram to code
---

# Skill: Multi-Modal Support

## Overview

Support visual inputs for richer context understanding including screenshot analysis, architecture diagrams, flowcharts, and visual bug reporting.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 MULTI-MODAL PIPELINE                        │
│                                                             │
│   Visual Input                                              │
│   (Image/Screenshot/Diagram)                                │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              INPUT CLASSIFIER                        │  │
│   │  Determine type: screenshot | diagram | chart | UI   │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ├─────────────┬─────────────┬─────────────┐         │
│        ▼             ▼             ▼             ▼         │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   │
│   │Screenshot│   │Diagram  │   │Flowchart│   │UI Mock  │   │
│   │Analyzer │   │Parser   │   │Converter│   │Extractor│   │
│   └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘   │
│        │             │             │             │         │
│        └─────────────┴──────┬──────┴─────────────┘         │
│                             ▼                               │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              STRUCTURED OUTPUT                       │  │
│   │  - Code suggestions                                  │  │
│   │  - Bug reports                                       │  │
│   │  - Implementation specs                              │  │
│   └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Screenshot Analysis

### UI Bug Detection

```yaml
screenshot_analysis:
  capabilities:
    - layout_issues
    - visual_regressions
    - accessibility_problems
    - responsive_breakpoints
    - color_contrast

  output:
    type: structured_report
    sections:
      - element_detection
      - issue_identification
      - suggested_fixes
```

### Example Output

```yaml
analysis:
  image: "screenshot-login-page.png"

  detected_elements:
    - type: button
      label: "Login"
      position: {x: 150, y: 320}
      issues:
        - low_contrast: "Button text barely visible"

    - type: input
      label: "Password"
      position: {x: 150, y: 280}
      issues:
        - no_label: "Input missing associated label"

  issues:
    - severity: high
      type: accessibility
      description: "Login button has 2.1:1 contrast ratio (needs 4.5:1)"
      suggestion: "Change button color from #999 to #666"

    - severity: medium
      type: layout
      description: "Form not centered on mobile viewport"
      suggestion: "Add flexbox centering to .login-container"
```

### Error Screenshot Analysis

```
┌────────────────────────────────────────────────┐
│  SCREENSHOT ANALYSIS: error-page.png           │
├────────────────────────────────────────────────┤
│                                                │
│  Detected Error:                               │
│    Type: Runtime Exception                     │
│    Message: "Cannot read property 'id' of      │
│              undefined"                        │
│    Stack Trace: Visible in screenshot          │
│                                                │
│  Context Extracted:                            │
│    - File: UserProfile.tsx:45                  │
│    - Function: renderUserCard()                │
│    - Variable: user.id                         │
│                                                │
│  Suggested Fix:                                │
│    Add null check: user?.id                    │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Architecture Diagram Understanding

### Supported Diagram Types

| Type | Detection | Conversion |
|------|-----------|------------|
| UML Class | ✅ | → TypeScript interfaces |
| UML Sequence | ✅ | → Function flow |
| ER Diagram | ✅ | → Database schema |
| Flowchart | ✅ | → Control flow code |
| System Architecture | ✅ | → Service definitions |

### Diagram to Code

```yaml
diagram_conversion:
  input: "architecture-diagram.png"

  detected:
    type: system_architecture
    components:
      - name: "API Gateway"
        type: service
        connections: ["Auth Service", "User Service"]

      - name: "Auth Service"
        type: service
        connections: ["Database"]

      - name: "User Service"
        type: service
        connections: ["Database", "Cache"]

  generated:
    - file: "services/api-gateway/index.ts"
      content: |
        export class ApiGateway {
          constructor(
            private authService: AuthService,
            private userService: UserService
          ) {}
        }

    - file: "services/auth/index.ts"
      content: |
        export class AuthService {
          constructor(private db: Database) {}
        }
```

---

## Flowchart to Code Generation

### Process

```
┌─────────────────────────────────────────────────┐
│  FLOWCHART CONVERSION                           │
├─────────────────────────────────────────────────┤
│                                                 │
│  Input Flowchart:                               │
│    ┌───────┐                                    │
│    │ Start │                                    │
│    └───┬───┘                                    │
│        ▼                                        │
│    ┌───────────┐                                │
│    │ Get User  │                                │
│    └─────┬─────┘                                │
│          ▼                                      │
│    ┌───────────┐  No   ┌──────────┐            │
│    │ Is Admin? │──────►│ Redirect │            │
│    └─────┬─────┘       └──────────┘            │
│          │ Yes                                  │
│          ▼                                      │
│    ┌───────────┐                                │
│    │Show Panel │                                │
│    └───────────┘                                │
│                                                 │
│  Generated Code:                                │
│    async function handleAdminRoute(userId) {   │
│      const user = await getUser(userId);       │
│      if (!user.isAdmin) {                      │
│        return redirect('/home');               │
│      }                                         │
│      return showAdminPanel();                  │
│    }                                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Visual Diff Comparison

### UI Regression Detection

```yaml
visual_diff:
  baseline: "screenshots/v1/home.png"
  current: "screenshots/v2/home.png"

  differences:
    - region: {x: 100, y: 50, w: 200, h: 100}
      type: added
      description: "New banner element"

    - region: {x: 300, y: 200, w: 150, h: 50}
      type: changed
      description: "Button color changed from blue to green"

    - region: {x: 500, y: 300, w: 100, h: 30}
      type: removed
      description: "Help link removed"

  summary:
    total_changes: 3
    breaking_ui: false
    recommendation: "Review banner addition for accessibility"
```

---

## Image-Based Bug Reporting

### Automated Bug Report

```yaml
bug_report:
  screenshot: "bug-screenshot.png"

  generated:
    title: "Login button unresponsive on mobile"

    description: |
      The login button appears cut off on mobile viewport
      (detected width: 320px). The button extends beyond
      the container, making the right portion unclickable.

    environment:
      viewport: 320x568
      device: mobile
      os: iOS (detected from UI elements)

    steps_to_reproduce:
      1. Open login page on mobile device
      2. Observe button extends past screen edge
      3. Attempt to tap right side of button

    expected: "Button should be fully visible and clickable"
    actual: "Button is partially hidden and unresponsive"

    suggested_fix:
      file: "components/LoginButton.css"
      change: "Add max-width: 100% and box-sizing: border-box"
```

---

## Commands

```bash
# Analyze screenshot
/visual analyze screenshot.png

# Convert diagram to code
/visual diagram-to-code architecture.png --output src/

# Compare visual diff
/visual diff baseline.png current.png

# Generate bug report from screenshot
/visual bug-report error-screenshot.png

# Extract UI components
/visual extract-ui mockup.png --framework react
```

---

## Configuration

```yaml
# config/multimodal.yaml
multimodal:
  enabled: true

  screenshot_analysis:
    ocr: true
    element_detection: true
    accessibility_check: true

  diagram_conversion:
    supported_formats:
      - png
      - jpg
      - svg
    output_language: typescript

  visual_diff:
    sensitivity: medium
    ignore_regions: []

  bug_reporting:
    auto_generate: true
    include_suggestions: true

  models:
    vision: claude-3-sonnet
    fallback: claude-3-haiku
```

---

*Visual understanding for comprehensive code assistance.*
