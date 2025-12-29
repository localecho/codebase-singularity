---
name: start_stop_app
description: Skill for starting, stopping, and managing the application lifecycle
triggers:
  - start the app
  - stop the app
  - restart the app
  - check if app is running
---

# Skill: Start/Stop Application

This skill teaches the agent how to manage the application lifecycle.

## Commands

### Start Application

```bash
# Development mode
npm run dev
# OR
yarn dev
# OR
pnpm dev

# Production mode
npm run start
# OR
node dist/index.js
```

**Expected Output**: Server listening message with port number
**Validation**: Check for "listening on port" in stdout

### Stop Application

```bash
# Find the process
lsof -i :3000  # Replace with actual port

# Kill gracefully
kill -SIGTERM <PID>

# Force kill if needed
kill -9 <PID>
```

**Validation**: Port should be free after stop

### Check Status

```bash
# Check if port is in use
lsof -i :3000 | grep LISTEN

# Check process
ps aux | grep node
```

**Returns**: Running/Stopped status

### Restart Application

```bash
# Stop then start
npm run stop && npm run start

# Or using process manager
pm2 restart app
```

## Health Check

After starting, validate the app is healthy:

```bash
curl -s http://localhost:3000/health | jq .
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

## Troubleshooting

| Issue | Check | Resolution |
|-------|-------|------------|
| Port in use | `lsof -i :3000` | Kill conflicting process |
| Won't start | Check logs | Fix error and retry |
| Crashes on start | `npm run build` first | Rebuild application |

## Usage in Workflows

When the orchestrator needs to test changes:

1. **Before Build**: Stop any running instance
2. **After Build**: Start the application
3. **During Review**: Verify health endpoint
4. **On Failure**: Check logs and report

## Environment Variables

Ensure these are set before starting:

```bash
export NODE_ENV=development
export PORT=3000
export DATABASE_URL=...
```

---
*Skill for application lifecycle management*
