---
name: sheets_tracker
description: Google Sheets integration for sprint tracking and executive dashboards
triggers:
  - update sheet
  - sync to sheets
  - sprint dashboard
---

# Skill: Google Sheets Sprint Tracker

## Overview

Automatically sync sprint progress, metrics, and reports to Google Sheets for manager visibility and executive dashboards.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               SHEETS TRACKING SYSTEM                        │
│                                                             │
│   Sprint Activity                                           │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              EVENT COLLECTOR                         │  │
│   │  - Issue started/completed                           │  │
│   │  - PR created/merged                                 │  │
│   │  - Tests run/passed                                  │  │
│   │  - Errors encountered                                │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              METRICS AGGREGATOR                      │  │
│   │  - Issues completed / total                          │  │
│   │  - Time per issue                                    │  │
│   │  - Success rate                                      │  │
│   │  - Blockers encountered                              │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   ┌─────────────────────────────────────────────────────┐  │
│   │              GOOGLE SHEETS API                       │  │
│   │  - Append rows                                       │  │
│   │  - Update aggregations                               │  │
│   │  - Refresh charts                                    │  │
│   └─────────────────────────────────────────────────────┘  │
│        │                                                    │
│        ▼                                                    │
│   Live Dashboard in Google Sheets                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Sheet Structure

### Tab 1: Sprint Log (Raw Events)

| Timestamp | Sprint | Issue | Title | Status | Duration | PR | Notes |
|-----------|--------|-------|-------|--------|----------|-----|-------|
| 2024-01-02 10:30 | Sprint-76-80 | #76 | Vulnerability Scanner | ✅ Complete | 15m | #101 | |
| 2024-01-02 10:45 | Sprint-76-80 | #77 | Test Generation | ✅ Complete | 12m | #101 | |
| 2024-01-02 11:00 | Sprint-76-80 | #78 | Doc Generation | ✅ Complete | 10m | #101 | |

### Tab 2: Sprint Summary (Aggregations)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              SPRINT DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Active Sprint: 76-80
  Repository: localecho/codebase-singularity

  Progress:
    Issues: 5/5 (100%)
    PRs Created: 1
    PRs Merged: 0

  Time Metrics:
    Total Time: 45 minutes
    Avg per Issue: 9 minutes
    Fastest: #78 (10 min)
    Slowest: #76 (15 min)

  Quality:
    Tests Passing: ✅
    Reviews Approved: Pending
    Blockers: 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Tab 3: Historical Trends

| Week | Issues Completed | Avg Time | Success Rate | PRs Merged |
|------|-----------------|----------|--------------|------------|
| W1 | 12 | 8.5m | 100% | 4 |
| W2 | 15 | 7.2m | 93% | 5 |
| W3 | 20 | 6.8m | 100% | 6 |

### Tab 4: Skills Inventory

| Skill | Created | Issues Closed | Category | Status |
|-------|---------|---------------|----------|--------|
| llm_provider | 2024-01-02 | #64 | ML | Active |
| prompt_versioning | 2024-01-02 | #65 | ML | Active |
| rag_pipeline | 2024-01-02 | #66 | ML | Active |
| vulnerability_scanner | 2024-01-02 | #76 | Security | Active |

---

## Google Sheets API Integration

### Authentication

```yaml
auth:
  method: service_account
  credentials_file: $GOOGLE_SHEETS_CREDENTIALS
  scopes:
    - https://www.googleapis.com/auth/spreadsheets
```

### Sync Operations

```javascript
// Append sprint event
async function logSprintEvent(event) {
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: 'Sprint Log!A:H',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [[
        event.timestamp,
        event.sprintId,
        event.issueNumber,
        event.issueTitle,
        event.status,
        event.duration,
        event.prNumber,
        event.notes
      ]]
    }
  });
}

// Update aggregations
async function updateDashboard(sprintId) {
  const sheets = google.sheets({ version: 'v4', auth });

  const stats = await calculateSprintStats(sprintId);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'Dashboard!B2:B10',
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [
        [stats.issuesCompleted],
        [stats.totalIssues],
        [stats.prsCreated],
        [stats.prsMerged],
        [stats.totalTime],
        [stats.avgTime],
        [stats.successRate],
        [stats.blockers],
        [stats.status]
      ]
    }
  });
}
```

---

## Event Types

### Sprint Events

```yaml
events:
  sprint_started:
    fields:
      - sprint_id
      - issue_range
      - repo
      - timestamp

  issue_started:
    fields:
      - issue_number
      - title
      - priority
      - timestamp

  issue_completed:
    fields:
      - issue_number
      - duration_seconds
      - files_created
      - pr_number

  pr_created:
    fields:
      - pr_number
      - issues_closed
      - files_changed

  pr_merged:
    fields:
      - pr_number
      - merge_time

  error_occurred:
    fields:
      - issue_number
      - error_type
      - message
      - resolved

  sprint_completed:
    fields:
      - sprint_id
      - total_duration
      - issues_completed
      - success_rate
```

---

## Real-Time Updates

### WebSocket Notifications

```yaml
realtime:
  enabled: true

  triggers:
    - on_issue_complete: update_dashboard
    - on_pr_merged: update_dashboard
    - on_sprint_complete: generate_report

  refresh_interval: 30s
```

### Push to Sheets

```yaml
sync:
  mode: real_time  # or batch

  batch_settings:
    interval: 5m
    max_events: 100

  real_time_settings:
    debounce: 10s
    retry_on_failure: true
```

---

## Executive Dashboard Template

### Setup Command

```bash
# Create new tracking sheet from template
/sheets init --name "Codebase Singularity Sprint Tracker"

# Output:
# ✅ Created: https://docs.google.com/spreadsheets/d/xxx
# ✅ Tabs: Sprint Log, Dashboard, Trends, Skills
# ✅ Charts configured
# ✅ Sharing: team@company.com
```

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  CODEBASE SINGULARITY - EXECUTIVE DASHBOARD                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │
│  │   ISSUES    │  │    PRs      │  │  SUCCESS    │  │   TIME     │ │
│  │     23      │  │     8       │  │    96%      │  │   2.5h     │ │
│  │  completed  │  │   merged    │  │    rate     │  │   total    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  WEEKLY PROGRESS                                    [CHART]    │ │
│  │  ████████████████████░░░░░ 80%                                 │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  SKILLS BY CATEGORY                                            │ │
│  │  ML:       ████████████ 12                                     │ │
│  │  Security: ████ 4                                              │ │
│  │  Testing:  ██ 2                                                │ │
│  │  Docs:     ██ 2                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  RECENT ACTIVITY                                               │ │
│  │  • #76-80 sprint completed (5 issues, 1 PR)                    │ │
│  │  • #71-75 sprint merged                                        │ │
│  │  • #64-70 sprint merged                                        │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Commands

```bash
# Initialize sheets tracking
/sheets init

# Sync current sprint to sheets
/sheets sync

# View dashboard link
/sheets dashboard

# Export sprint report to sheets
/sheets export --sprint 76-80

# Update aggregations
/sheets refresh
```

---

## Configuration

```yaml
# config/sheets_tracker.yaml
sheets:
  enabled: true

  spreadsheet_id: $GOOGLE_SHEET_ID
  credentials: $GOOGLE_SHEETS_CREDENTIALS

  tabs:
    sprint_log: "Sprint Log"
    dashboard: "Dashboard"
    trends: "Trends"
    skills: "Skills Inventory"

  sync:
    mode: real_time
    on_events:
      - issue_completed
      - pr_merged
      - sprint_completed

  dashboard:
    auto_refresh: true
    charts: true

  sharing:
    default_access: view
    notify_on_complete: true
    recipients:
      - manager@company.com
```

---

## MCP Integration

For real-time Google Sheets access, add the MCP server:

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "npx",
      "args": ["@anthropic/mcp-google-sheets"],
      "env": {
        "GOOGLE_CREDENTIALS": "/path/to/credentials.json"
      }
    }
  }
}
```

---

*Real-time visibility into agent progress for stakeholders.*
