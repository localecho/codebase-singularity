# Agentic Layer Metrics & ROI Tracking

Track agent performance, workflow effectiveness, financial ROI, and risk metrics.

## Directory Structure

```
.claude/metrics/
├── README.md           # This file
├── sessions.json       # Session history
├── workflows.json      # Workflow completion stats
├── quality.json        # Code quality trends
├── roi.json           # Financial ROI tracking
└── risk.json          # Risk measurements
```

## ROI Financial Metrics

The framework tracks return on investment to justify agentic tooling:

### Time Savings

```json
{
  "time_savings": {
    "estimated_manual_hours": 120,
    "actual_agent_hours": 45,
    "hours_saved": 75,
    "efficiency_multiplier": 2.67
  }
}
```

### Cost Analysis

```json
{
  "costs": {
    "developer_hourly_rate": 150,
    "agent_cost_per_session": 2.50,
    "infrastructure_monthly": 50,
    "total_agent_costs": 325,
    "manual_equivalent_cost": 18000,
    "net_savings": 17675,
    "roi_percentage": 5438
  }
}
```

### Productivity Metrics

| Metric | Before Agents | With Agents | Improvement |
|--------|--------------|-------------|-------------|
| Features/month | 4 | 12 | 3x |
| Bug fix time | 4 hours | 45 min | 5.3x |
| Code review time | 30 min | 5 min | 6x |
| Time to first test | 2 days | 2 hours | 12x |

## Risk Measurements

### Risk Categories

1. **Code Quality Risk**
   - Test coverage below threshold
   - Increasing tech debt
   - Declining code review scores

2. **Security Risk**
   - Vulnerabilities detected
   - Secrets exposure attempts
   - Dependencies with CVEs

3. **Operational Risk**
   - Agent failure rate
   - Fix loop frequency
   - Manual intervention required

4. **Business Risk**
   - Missed deadlines
   - Scope creep
   - Deployment failures

### Risk Score Calculation

```javascript
const calculateRiskScore = (metrics) => {
  const weights = {
    coverage: 0.25,      // Low coverage = high risk
    techDebt: 0.20,      // High debt = high risk
    vulnerabilities: 0.30, // Critical
    agentFailures: 0.15,  // Reliability
    deployments: 0.10     // Stability
  };

  let riskScore = 0;

  // Coverage risk (inverse - lower coverage = higher risk)
  riskScore += (100 - metrics.coverage) * weights.coverage;

  // Tech debt risk (linear)
  riskScore += Math.min(metrics.techDebtItems * 2, 100) * weights.techDebt;

  // Vulnerability risk (exponential)
  riskScore += Math.min(metrics.criticalVulns * 25, 100) * weights.vulnerabilities;

  // Agent failure risk
  riskScore += metrics.agentFailureRate * weights.agentFailures;

  // Deployment risk
  riskScore += metrics.deploymentFailureRate * weights.deployments;

  return Math.min(Math.round(riskScore), 100);
};
```

### Risk Levels

| Score | Level | Color | Action |
|-------|-------|-------|--------|
| 0-25 | Low | Green | Monitor |
| 26-50 | Medium | Yellow | Review |
| 51-75 | High | Orange | Address |
| 76-100 | Critical | Red | Immediate |

## Session Tracking

Each agent session tracked in `sessions.json`:

```json
{
  "sessions": [
    {
      "id": "session-uuid",
      "started": "2024-01-01T00:00:00Z",
      "ended": "2024-01-01T01:30:00Z",
      "duration_minutes": 90,
      "workflow": "feature",
      "spec": "specs/20240101-auth.md",
      "phases": {
        "plan": {"duration": 300, "iterations": 1},
        "build": {"duration": 2400, "iterations": 1},
        "review": {"duration": 600, "iterations": 2},
        "fix": {"duration": 900, "iterations": 1}
      },
      "outcome": "success",
      "files_changed": 12,
      "tests_added": 8,
      "coverage_delta": "+3%",
      "estimated_manual_time": 480,
      "agent_cost": 2.50
    }
  ]
}
```

## Dashboard Command

View enhanced metrics with `/metrics`:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AGENTIC LAYER METRICS                                │
├─────────────────────────────────────────────────────────────────────────┤
│ Performance (This Week)                                                  │
│   Sessions: 23            Success Rate: 87%                              │
│   Avg Duration: 45 min    Fix Iterations: 1.8 avg                        │
├─────────────────────────────────────────────────────────────────────────┤
│ 💰 ROI FINANCIAL SUMMARY                                                 │
│ ┌───────────────────────────────────────────────────────────────────┐   │
│ │ Time Saved This Month:        75 hours                             │   │
│ │ Developer Cost Avoided:       $11,250                              │   │
│ │ Agent Costs (API + Infra):    $325                                 │   │
│ │ ─────────────────────────────────────────────                      │   │
│ │ NET SAVINGS:                  $10,925                              │   │
│ │ ROI:                          3,362%                               │   │
│ └───────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│ ⚠️  RISK ASSESSMENT                                                      │
│ ┌───────────────────────────────────────────────────────────────────┐   │
│ │ Overall Risk Score:  [████████░░░░░░░░░░░░] 38/100 (Medium)        │   │
│ │                                                                    │   │
│ │ Code Quality:        [██████░░░░░░░░░░░░░░] 28  ✓ Low              │   │
│ │ Security:            [████████░░░░░░░░░░░░] 42  ⚠ Medium           │   │
│ │ Operational:         [████░░░░░░░░░░░░░░░░] 18  ✓ Low              │   │
│ │ Business:            [██████████░░░░░░░░░░] 52  ⚠ High             │   │
│ └───────────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────┤
│ Quality Trends                                                           │
│   Coverage: 82% ↑ (+3%)      Tests: 234 ↑ (+15)                          │
│   Tech Debt: 12 ↓ (-2)       Vulnerabilities: 0 ✓                        │
├─────────────────────────────────────────────────────────────────────────┤
│ Workflow Distribution                                                    │
│   Feature:  ████████████░░░░ 45 (93% success)  💰 $8,200 saved           │
│   Bugfix:   ██████░░░░░░░░░░ 32 (97% success)  💰 $2,100 saved           │
│   Refactor: ███░░░░░░░░░░░░░ 12 (83% success)  💰 $625 saved             │
│   Security: █░░░░░░░░░░░░░░░  5 (100% success) ⚠ 2 vulns fixed           │
└─────────────────────────────────────────────────────────────────────────┘
```

## ROI Data File

Track ROI in `roi.json`:

```json
{
  "period": "2024-01",
  "time_savings": {
    "estimated_manual_hours": 120,
    "actual_agent_hours": 45,
    "hours_saved": 75,
    "efficiency_multiplier": 2.67
  },
  "cost_analysis": {
    "developer_hourly_rate": 150,
    "agent_api_costs": 275,
    "infrastructure_costs": 50,
    "total_agent_costs": 325,
    "manual_equivalent_cost": 18000,
    "net_savings": 17675,
    "roi_percentage": 5438
  },
  "by_workflow": {
    "feature": {
      "count": 45,
      "avg_manual_hours": 8,
      "avg_agent_hours": 3,
      "total_saved": 225,
      "cost_saved": 33750
    },
    "bugfix": {
      "count": 32,
      "avg_manual_hours": 4,
      "avg_agent_hours": 0.75,
      "total_saved": 104,
      "cost_saved": 15600
    }
  },
  "trends": {
    "monthly_savings": [12500, 14200, 15800, 17675],
    "efficiency_trend": [2.1, 2.3, 2.5, 2.67],
    "cost_per_task_trend": [3.20, 2.90, 2.70, 2.50]
  }
}
```

## Risk Data File

Track risk in `risk.json`:

```json
{
  "timestamp": "2024-01-15T12:00:00Z",
  "overall_score": 38,
  "level": "medium",
  "categories": {
    "code_quality": {
      "score": 28,
      "level": "low",
      "factors": {
        "coverage": {"value": 82, "target": 80, "status": "pass"},
        "tech_debt": {"value": 12, "threshold": 20, "status": "pass"},
        "review_score": {"value": 4.2, "target": 4.0, "status": "pass"}
      }
    },
    "security": {
      "score": 42,
      "level": "medium",
      "factors": {
        "critical_vulns": {"value": 0, "status": "pass"},
        "high_vulns": {"value": 2, "status": "warn"},
        "secret_exposures": {"value": 0, "status": "pass"},
        "outdated_deps": {"value": 5, "status": "warn"}
      }
    },
    "operational": {
      "score": 18,
      "level": "low",
      "factors": {
        "agent_failure_rate": {"value": 3, "threshold": 10, "status": "pass"},
        "fix_loops": {"value": 1, "threshold": 5, "status": "pass"},
        "manual_interventions": {"value": 2, "threshold": 10, "status": "pass"}
      }
    },
    "business": {
      "score": 52,
      "level": "high",
      "factors": {
        "missed_deadlines": {"value": 2, "threshold": 1, "status": "fail"},
        "scope_creep": {"value": 15, "threshold": 10, "status": "warn"},
        "deployment_failures": {"value": 1, "threshold": 2, "status": "pass"}
      }
    }
  },
  "recommendations": [
    {
      "priority": "high",
      "category": "business",
      "action": "Review project timeline and reduce scope",
      "impact": "Could reduce business risk by 20 points"
    },
    {
      "priority": "medium",
      "category": "security",
      "action": "Update 5 outdated dependencies",
      "impact": "Could reduce security risk by 10 points"
    }
  ],
  "history": [
    {"date": "2024-01-08", "score": 45},
    {"date": "2024-01-15", "score": 38}
  ]
}
```

## Collection Points

Metrics are collected at:

1. **Session Start** (`/prime`) - Create session, record start
2. **Phase Transitions** (orchestrator) - Duration, iterations
3. **Session End** - Calculate ROI, update risk
4. **Test Runs** - Coverage, quality metrics
5. **Security Scans** - Vulnerability counts
6. **Deployments** - Success/failure rates

## Retention Policy

- **Sessions**: Last 100
- **Snapshots**: Daily for 90 days
- **ROI Data**: Monthly for 24 months
- **Risk History**: Daily for 90 days, weekly for 1 year
