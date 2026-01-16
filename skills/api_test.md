---
name: api_test
description: API testing with curl/httpie without external tools
triggers:
  - test api
  - test endpoint
  - curl
  - http request
  - api call
---

# Skill: API Testing

Test APIs using native CLI tools (curl, httpie) with structured output parsing.

## Quick Reference

| Method | curl | httpie |
|--------|------|--------|
| GET | `curl URL` | `http URL` |
| POST JSON | `curl -X POST -H "Content-Type: application/json" -d '{}' URL` | `http POST URL key=value` |
| PUT | `curl -X PUT -d '{}' URL` | `http PUT URL` |
| DELETE | `curl -X DELETE URL` | `http DELETE URL` |

---

## GET Requests

### Basic GET
```bash
curl -s https://api.example.com/users

# With headers
curl -s -H "Authorization: Bearer $TOKEN" https://api.example.com/users

# With query params
curl -s "https://api.example.com/users?page=1&limit=10"
```

### GET with Full Response
```bash
# Include headers in output
curl -si https://api.example.com/users

# Verbose (debug)
curl -v https://api.example.com/users
```

---

## POST Requests

### JSON Body
```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "email": "test@example.com"}' \
  https://api.example.com/users
```

### From File
```bash
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d @payload.json \
  https://api.example.com/users
```

### Form Data
```bash
curl -s -X POST \
  -F "file=@upload.txt" \
  -F "name=test" \
  https://api.example.com/upload
```

---

## PUT/PATCH Requests

```bash
# PUT (replace)
curl -s -X PUT \
  -H "Content-Type: application/json" \
  -d '{"name": "updated"}' \
  https://api.example.com/users/123

# PATCH (partial update)
curl -s -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"name": "updated"}' \
  https://api.example.com/users/123
```

---

## DELETE Requests

```bash
curl -s -X DELETE https://api.example.com/users/123

# With body (rare but some APIs need it)
curl -s -X DELETE \
  -H "Content-Type: application/json" \
  -d '{"reason": "test cleanup"}' \
  https://api.example.com/users/123
```

---

## Authentication

### Bearer Token
```bash
curl -s -H "Authorization: Bearer $TOKEN" URL
```

### Basic Auth
```bash
curl -s -u username:password URL
# Or:
curl -s -H "Authorization: Basic $(echo -n user:pass | base64)" URL
```

### API Key
```bash
# In header
curl -s -H "X-API-Key: $API_KEY" URL

# In query string
curl -s "URL?api_key=$API_KEY"
```

---

## Response Parsing

### Parse JSON with jq
```bash
# Extract field
curl -s URL | jq '.data.id'

# Format output
curl -s URL | jq '.'

# Extract array items
curl -s URL | jq '.items[] | {id, name}'

# Conditional extraction
curl -s URL | jq '.users[] | select(.active == true)'
```

### Check Status Code
```bash
# Get just the status code
curl -s -o /dev/null -w "%{http_code}" URL

# Get status and body
STATUS=$(curl -s -o response.json -w "%{http_code}" URL)
if [ "$STATUS" -eq 200 ]; then
    cat response.json | jq '.'
else
    echo "Error: $STATUS"
fi
```

### Timing Information
```bash
curl -s -o /dev/null -w "
    time_namelookup:  %{time_namelookup}s
    time_connect:     %{time_connect}s
    time_starttransfer: %{time_starttransfer}s
    time_total:       %{time_total}s
" URL
```

---

## Test Patterns

### Health Check
```bash
health_check() {
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$1/health")
    if [ "$STATUS" -eq 200 ]; then
        echo "✅ $1 is healthy"
        return 0
    else
        echo "❌ $1 returned $STATUS"
        return 1
    fi
}
```

### CRUD Test Suite
```bash
# Create
ID=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name": "test"}' \
  $BASE_URL/items | jq -r '.id')
echo "Created: $ID"

# Read
curl -s $BASE_URL/items/$ID | jq '.'

# Update
curl -s -X PUT -H "Content-Type: application/json" \
  -d '{"name": "updated"}' \
  $BASE_URL/items/$ID | jq '.'

# Delete
curl -s -X DELETE $BASE_URL/items/$ID
echo "Deleted: $ID"
```

### Assert Response
```bash
assert_response() {
    local URL=$1
    local EXPECTED_STATUS=$2
    local EXPECTED_FIELD=$3
    local EXPECTED_VALUE=$4

    RESPONSE=$(curl -s -w "\n%{http_code}" $URL)
    STATUS=$(echo "$RESPONSE" | tail -1)
    BODY=$(echo "$RESPONSE" | head -n -1)

    if [ "$STATUS" != "$EXPECTED_STATUS" ]; then
        echo "❌ Status: expected $EXPECTED_STATUS, got $STATUS"
        return 1
    fi

    ACTUAL=$(echo "$BODY" | jq -r ".$EXPECTED_FIELD")
    if [ "$ACTUAL" != "$EXPECTED_VALUE" ]; then
        echo "❌ $EXPECTED_FIELD: expected $EXPECTED_VALUE, got $ACTUAL"
        return 1
    fi

    echo "✅ Passed"
    return 0
}

# Usage
assert_response "$BASE_URL/users/1" 200 "name" "John"
```

---

## Output Formatting

### Test Report Format
```yaml
test_results:
  endpoint: /api/users
  method: GET
  status_code: 200
  latency_ms: 45
  assertions:
    - field: data.length
      expected: ">0"
      actual: 10
      passed: true
  result: PASS
```

### Pretty Print Response
```bash
curl -s URL | jq '.' | less

# With colors
curl -s URL | jq -C '.' | less -R
```

---

## Error Handling

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | OK | Assert response body |
| 201 | Created | Verify resource exists |
| 400 | Bad Request | Check payload format |
| 401 | Unauthorized | Check auth token |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Check URL/ID |
| 500 | Server Error | Check server logs |
| CURL error 7 | Connection refused | Server not running |
| CURL error 28 | Timeout | Increase timeout |

---

## Environment Variables

```bash
# Set in .env or export
export API_BASE_URL=http://localhost:3000/api
export API_TOKEN=your-token-here

# Use in requests
curl -s -H "Authorization: Bearer $API_TOKEN" $API_BASE_URL/users
```

---

## Advanced Patterns

### Retry with Backoff
```bash
retry_request() {
    local URL=$1
    local MAX_RETRIES=3
    local DELAY=1

    for i in $(seq 1 $MAX_RETRIES); do
        RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/response.json $URL)
        if [ "$RESPONSE" -eq 200 ]; then
            cat /tmp/response.json
            return 0
        fi
        echo "Retry $i/$MAX_RETRIES in ${DELAY}s..."
        sleep $DELAY
        DELAY=$((DELAY * 2))
    done
    return 1
}
```

### Parallel Requests
```bash
# Test multiple endpoints in parallel
for endpoint in /users /products /orders; do
    curl -s "$BASE_URL$endpoint" > "/tmp/$(basename $endpoint).json" &
done
wait
echo "All requests completed"
```

---

## Integration

This skill integrates with:
- `test_backend` for API endpoint testing
- `/orchestrator` for verification steps
- `app_reviews/bugs/` for documenting API failures
