---
name: metrics_export
description: Skill for exporting metrics to external dashboards via Prometheus, webhooks, and CLI
triggers:
  - export metrics
  - prometheus endpoint
  - metrics webhook
  - dashboard integration
---

# Skill: Metrics Export

This skill enables exporting Agentic Layer metrics to external dashboards via Prometheus format, webhooks, and CLI commands.

## Philosophy

> Make metrics accessible everywhere. Export to Prometheus for monitoring, webhooks for real-time alerts, and CLI for quick analysis.

## Prometheus Endpoint Format

### Metric Types

| Type | Description | Example |
|------|-------------|---------|
| Counter | Monotonically increasing | `agentic_specs_created_total` |
| Gauge | Value that can go up/down | `agentic_open_issues` |
| Histogram | Distribution of values | `agentic_build_duration_seconds` |
| Summary | Similar to histogram | `agentic_response_time_seconds` |

### Core Metrics

```prometheus
# HELP agentic_specs_created_total Total number of specs created
# TYPE agentic_specs_created_total counter
agentic_specs_created_total{status="completed"} 42
agentic_specs_created_total{status="abandoned"} 3

# HELP agentic_builds_total Total number of builds executed
# TYPE agentic_builds_total counter
agentic_builds_total{result="success"} 156
agentic_builds_total{result="failure"} 12

# HELP agentic_reviews_total Total number of code reviews
# TYPE agentic_reviews_total counter
agentic_reviews_total{outcome="passed"} 140
agentic_reviews_total{outcome="failed"} 28

# HELP agentic_open_issues Current number of open issues
# TYPE agentic_open_issues gauge
agentic_open_issues 7

# HELP agentic_build_duration_seconds Time taken for builds
# TYPE agentic_build_duration_seconds histogram
agentic_build_duration_seconds_bucket{le="30"} 50
agentic_build_duration_seconds_bucket{le="60"} 120
agentic_build_duration_seconds_bucket{le="120"} 150
agentic_build_duration_seconds_bucket{le="+Inf"} 168
agentic_build_duration_seconds_sum 8456
agentic_build_duration_seconds_count 168

# HELP agentic_test_coverage_percent Current test coverage
# TYPE agentic_test_coverage_percent gauge
agentic_test_coverage_percent{suite="unit"} 87.5
agentic_test_coverage_percent{suite="integration"} 72.3

# HELP agentic_workflow_active Current active workflows
# TYPE agentic_workflow_active gauge
agentic_workflow_active{type="orchestrate"} 1
agentic_workflow_active{type="review"} 0
```

### Generate Prometheus Output

```bash
#!/bin/bash
# generate_metrics.sh - Output metrics in Prometheus format

echo "# HELP agentic_specs_created_total Total specs created"
echo "# TYPE agentic_specs_created_total counter"
COMPLETED=$(ls specs/*.md 2>/dev/null | wc -l)
echo "agentic_specs_created_total{status=\"active\"} $COMPLETED"

echo ""
echo "# HELP agentic_open_issues Current open issues"
echo "# TYPE agentic_open_issues gauge"
OPEN_ISSUES=$(gh issue list --json number --jq 'length' 2>/dev/null || echo 0)
echo "agentic_open_issues $OPEN_ISSUES"

echo ""
echo "# HELP agentic_bugs_reported_total Total bugs reported"
echo "# TYPE agentic_bugs_reported_total counter"
BUGS=$(ls app_reviews/bugs/*.md 2>/dev/null | wc -l)
echo "agentic_bugs_reported_total $BUGS"

echo ""
echo "# HELP agentic_resolutions_total Total resolutions logged"
echo "# TYPE agentic_resolutions_total counter"
RESOLUTIONS=$(ls app_reviews/resolutions/*.md 2>/dev/null | wc -l)
echo "agentic_resolutions_total $RESOLUTIONS"
```

### Serve Prometheus Endpoint

```bash
# Using Python's http.server
python3 -c "
import http.server
import subprocess

class MetricsHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/metrics':
            result = subprocess.run(['./generate_metrics.sh'], capture_output=True, text=True)
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(result.stdout.encode())
        else:
            self.send_response(404)
            self.end_headers()

http.server.HTTPServer(('', 9090), MetricsHandler).serve_forever()
"

# Access at http://localhost:9090/metrics
```

### Prometheus Configuration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'agentic-layer'
    scrape_interval: 30s
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/metrics'
```

## Webhook for Metric Events

### Event Types

| Event | Trigger | Payload |
|-------|---------|---------|
| `spec.created` | New spec created | spec details |
| `build.completed` | Build finished | result, duration |
| `review.completed` | Review finished | outcome, issues |
| `issue.opened` | Issue created | issue details |
| `issue.closed` | Issue resolved | resolution |
| `workflow.started` | Workflow begins | workflow type |
| `workflow.completed` | Workflow ends | result, duration |

### Webhook Configuration

Create `.agentic/webhooks.yaml`:

```yaml
webhooks:
  - name: slack-notifications
    url: https://hooks.slack.com/services/xxx/yyy/zzz
    events:
      - build.completed
      - review.completed
    filters:
      build.completed:
        result: failure
      review.completed:
        outcome: failed

  - name: metrics-collector
    url: https://metrics.company.com/webhook
    events:
      - "*"  # All events
    headers:
      Authorization: "Bearer ${METRICS_TOKEN}"

  - name: pagerduty-alerts
    url: https://events.pagerduty.com/v2/enqueue
    events:
      - build.completed
    filters:
      build.completed:
        result: failure
        consecutive_failures: ">= 3"
```

### Send Webhook

```bash
#!/bin/bash
# send_webhook.sh - Send metric event to configured webhooks

EVENT_TYPE="$1"
PAYLOAD="$2"
WEBHOOK_URL="$3"

curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "X-Event-Type: $EVENT_TYPE" \
  "$WEBHOOK_URL" \
  -d "$PAYLOAD"
```

### Webhook Payload Format

```json
{
  "event_type": "build.completed",
  "timestamp": "2025-01-15T10:30:00Z",
  "project": "codebase-singularity",
  "data": {
    "result": "success",
    "duration_seconds": 45,
    "spec_file": "specs/20250115-feature-x.md",
    "commit": "abc123f"
  },
  "metadata": {
    "agent_version": "1.0.0",
    "workflow_id": "wf-12345"
  }
}
```

### Webhook Event Examples

```bash
# Build completed event
./send_webhook.sh "build.completed" '{
  "event_type": "build.completed",
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "data": {
    "result": "success",
    "duration_seconds": 45
  }
}' "$WEBHOOK_URL"

# Review completed event
./send_webhook.sh "review.completed" '{
  "event_type": "review.completed",
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "data": {
    "outcome": "passed",
    "issues_found": 0,
    "suggestions": 3
  }
}' "$WEBHOOK_URL"
```

### Slack Webhook Format

```bash
# Send to Slack
curl -X POST -H 'Content-type: application/json' \
  "$SLACK_WEBHOOK_URL" \
  -d '{
    "blocks": [
      {
        "type": "header",
        "text": {"type": "plain_text", "text": "Build Completed"}
      },
      {
        "type": "section",
        "fields": [
          {"type": "mrkdwn", "text": "*Result:*\n:white_check_mark: Success"},
          {"type": "mrkdwn", "text": "*Duration:*\n45 seconds"}
        ]
      }
    ]
  }'
```

## CLI Export Command

### Export Formats

| Format | Use Case | Command Flag |
|--------|----------|--------------|
| JSON | API consumption | `--format json` |
| CSV | Spreadsheet import | `--format csv` |
| Prometheus | Monitoring systems | `--format prometheus` |
| Markdown | Documentation | `--format markdown` |

### CLI Usage

```bash
# Export all metrics as JSON
/metrics export --format json

# Export to file
/metrics export --format csv --output metrics.csv

# Export specific time range
/metrics export --from 2025-01-01 --to 2025-01-15

# Export specific metric types
/metrics export --types builds,reviews,specs

# Export with labels filter
/metrics export --filter "result=success"
```

### Export Script

```bash
#!/bin/bash
# metrics_export.sh - CLI metrics export

FORMAT="${1:-json}"
OUTPUT="${2:-stdout}"

collect_metrics() {
  cat <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "metrics": {
    "specs": {
      "total": $(ls specs/*.md 2>/dev/null | wc -l | tr -d ' '),
      "current": "$(basename specs/CURRENT.md 2>/dev/null || echo 'none')"
    },
    "builds": {
      "total": 168,
      "success": 156,
      "failure": 12,
      "success_rate": 92.86
    },
    "reviews": {
      "total": 168,
      "passed": 140,
      "failed": 28,
      "pass_rate": 83.33
    },
    "issues": {
      "open": $(gh issue list --json number --jq 'length' 2>/dev/null || echo 0),
      "closed_today": 0
    },
    "bugs": {
      "reported": $(ls app_reviews/bugs/*.md 2>/dev/null | wc -l | tr -d ' '),
      "resolved": $(ls app_reviews/resolutions/*.md 2>/dev/null | wc -l | tr -d ' ')
    }
  }
}
EOF
}

case "$FORMAT" in
  json)
    METRICS=$(collect_metrics)
    if [ "$OUTPUT" = "stdout" ]; then
      echo "$METRICS" | jq .
    else
      echo "$METRICS" | jq . > "$OUTPUT"
    fi
    ;;
  csv)
    echo "metric,value,timestamp"
    echo "specs_total,$(ls specs/*.md 2>/dev/null | wc -l | tr -d ' '),$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "builds_success,156,$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "builds_failure,12,$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "reviews_passed,140,$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    echo "reviews_failed,28,$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    ;;
  prometheus)
    ./generate_metrics.sh
    ;;
  markdown)
    cat <<EOF
# Metrics Report

**Generated**: $(date -u +%Y-%m-%dT%H:%M:%SZ)

## Summary

| Metric | Value |
|--------|-------|
| Total Specs | $(ls specs/*.md 2>/dev/null | wc -l | tr -d ' ') |
| Build Success Rate | 92.86% |
| Review Pass Rate | 83.33% |
| Open Issues | $(gh issue list --json number --jq 'length' 2>/dev/null || echo 0) |

## Details

- Builds: 156 success, 12 failure
- Reviews: 140 passed, 28 failed
- Bugs: $(ls app_reviews/bugs/*.md 2>/dev/null | wc -l | tr -d ' ') reported
EOF
    ;;
esac
```

## Dashboard Integrations

### Grafana

```yaml
# grafana-datasource.yaml
apiVersion: 1
datasources:
  - name: Agentic Metrics
    type: prometheus
    url: http://localhost:9090
    access: proxy
    isDefault: true
```

### Datadog

```bash
# Send metric to Datadog
curl -X POST "https://api.datadoghq.com/api/v2/series" \
  -H "Content-Type: application/json" \
  -H "DD-API-KEY: ${DD_API_KEY}" \
  -d '{
    "series": [{
      "metric": "agentic.builds.success",
      "type": 0,
      "points": [{"timestamp": '$(date +%s)', "value": 156}],
      "tags": ["project:codebase-singularity"]
    }]
  }'
```

### New Relic

```bash
# Send metric to New Relic
curl -X POST "https://metric-api.newrelic.com/metric/v1" \
  -H "Content-Type: application/json" \
  -H "Api-Key: ${NEW_RELIC_API_KEY}" \
  -d '{
    "metrics": [{
      "name": "agentic.builds.success",
      "type": "gauge",
      "value": 156,
      "timestamp": '$(date +%s)',
      "attributes": {"project": "codebase-singularity"}
    }]
  }'
```

## Scheduled Export

### Cron Configuration

```bash
# Export metrics every 5 minutes
*/5 * * * * /path/to/metrics_export.sh json /var/metrics/latest.json

# Daily summary
0 0 * * * /path/to/metrics_export.sh markdown /var/reports/daily-$(date +\%Y\%m\%d).md

# Hourly webhook push
0 * * * * /path/to/push_metrics_webhook.sh
```

### Push Script

```bash
#!/bin/bash
# push_metrics_webhook.sh - Push metrics to configured webhooks

METRICS=$(./metrics_export.sh json)

# Read webhook URLs from config
while IFS= read -r WEBHOOK_URL; do
  curl -s -X POST \
    -H "Content-Type: application/json" \
    "$WEBHOOK_URL" \
    -d "$METRICS"
done < .agentic/webhook_urls.txt
```

## Safety Rules

1. **Never expose sensitive data** in metrics (tokens, passwords)
2. **Rate limit webhook calls** to avoid flooding
3. **Validate webhook URLs** before sending
4. **Log all exports** for audit trail
5. **Handle failures gracefully** with retries and backoff

## Troubleshooting

### Prometheus Not Scraping

```bash
# Check endpoint is reachable
curl http://localhost:9090/metrics

# Verify Prometheus config
promtool check config prometheus.yml
```

### Webhook Failures

```bash
# Test webhook manually
curl -X POST -v "$WEBHOOK_URL" -d '{"test": true}'

# Check webhook logs
tail -f /var/log/webhook_failures.log
```

### Missing Metrics

```bash
# Verify metric collection script
./generate_metrics.sh

# Check data sources exist
ls specs/ app_reviews/bugs/ app_reviews/resolutions/
```

---
*Skill for exporting metrics to external dashboards and monitoring systems*
