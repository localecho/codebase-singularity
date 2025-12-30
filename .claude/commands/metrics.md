---
name: metrics
description: Display agentic layer metrics dashboard
arguments: []
---

# Metrics Dashboard

Display current metrics for the agentic layer.

## Load Data

Read metrics from:
- `.claude/metrics/sessions.json`
- `.claude/metrics/workflows.json`
- `.claude/metrics/quality.json`

## Calculate

```javascript
// This week stats
const thisWeek = {
  sessions: sessions.filter(s => isThisWeek(s.started)).length,
  completed: sessions.filter(s => isThisWeek(s.started) && s.outcome === 'success').length,
  avgDuration: average(sessions.map(s => s.duration_minutes)),
  avgIterations: average(sessions.flatMap(s => Object.values(s.phases).map(p => p.iterations)))
};

// Success rate
const successRate = (thisWeek.completed / thisWeek.sessions * 100).toFixed(1);

// Quality trends
const latestSnapshot = quality.snapshots[quality.snapshots.length - 1];
const previousSnapshot = quality.snapshots[quality.snapshots.length - 2];
const coverageDelta = latestSnapshot.coverage - previousSnapshot.coverage;
```

## Output Format

```
┌─────────────────────────────────────────────────────────────────┐
│                  AGENTIC LAYER METRICS                           │
├─────────────────────────────────────────────────────────────────┤
│ This Week                                                        │
│   Sessions: [count]                                              │
│   Success Rate: [percentage]%                                    │
│   Avg Duration: [minutes] min                                    │
│   Fix Iterations: [average] avg                                  │
├─────────────────────────────────────────────────────────────────┤
│ Quality Trends                                                   │
│   Coverage: [current]% [arrow] ([delta]%)                        │
│   Tests: [count] [arrow] ([delta])                               │
│   Tech Debt: [count] [arrow] ([delta])                           │
├─────────────────────────────────────────────────────────────────┤
│ Workflow Distribution                                            │
│   Feature:  [bar] [count] ([success]% success)                   │
│   Bugfix:   [bar] [count] ([success]% success)                   │
│   Refactor: [bar] [count] ([success]% success)                   │
│   Security: [bar] [count] ([success]% success)                   │
│   Release:  [bar] [count] ([success]% success)                   │
├─────────────────────────────────────────────────────────────────┤
│ Recent Sessions                                                  │
│   [date] [workflow] [duration] [outcome]                         │
│   [date] [workflow] [duration] [outcome]                         │
│   [date] [workflow] [duration] [outcome]                         │
└─────────────────────────────────────────────────────────────────┘
```

## Bar Chart Helper

```javascript
function renderBar(value, max, width = 16) {
  const filled = Math.round((value / max) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}
```

## Arrow Helper

```javascript
function trendArrow(direction) {
  switch(direction) {
    case 'up': return '↑';
    case 'down': return '↓';
    default: return '→';
  }
}
```

## Empty State

If no metrics yet:

```
┌─────────────────────────────────────────────────────────────────┐
│                  AGENTIC LAYER METRICS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   No metrics recorded yet.                                       │
│                                                                  │
│   Metrics will be collected as you use the framework:            │
│   - Start sessions with /prime                                   │
│   - Complete workflows with /orchestrator                        │
│   - Run tests with /test_backend                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```
