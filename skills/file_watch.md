---
name: file_watch
description: Dev server and file watching operations
triggers:
  - start server
  - stop server
  - restart server
  - dev mode
  - watch files
  - hot reload
---

# Skill: File Watch & Dev Server

Manage development servers and file watching processes.

## Quick Reference

| Trigger | Action |
|---------|--------|
| "start server" | Launch dev server |
| "stop server" | Kill running server |
| "restart" | Stop then start |
| "dev mode" | Start with watch |
| "check running" | List active processes |

---

## Framework Detection

Detect and use appropriate dev commands:

| Framework | Start Command | Port |
|-----------|---------------|------|
| Next.js | `npm run dev` | 3000 |
| React (CRA) | `npm start` | 3000 |
| Vite | `npm run dev` | 5173 |
| Vue CLI | `npm run serve` | 8080 |
| Angular | `ng serve` | 4200 |
| Express | `node server.js` | 3000 |
| Django | `python manage.py runserver` | 8000 |
| Flask | `flask run` | 5000 |
| Rails | `rails server` | 3000 |
| Rust/Cargo | `cargo watch -x run` | varies |
| Go | `go run .` or `air` | varies |

---

## Start Server

### Auto-Detect Framework
```bash
# Check package.json scripts
if [ -f "package.json" ]; then
    # Check for common dev scripts
    if grep -q '"dev"' package.json; then
        npm run dev
    elif grep -q '"start"' package.json; then
        npm start
    fi
fi

# Python frameworks
if [ -f "manage.py" ]; then
    python manage.py runserver
elif [ -f "app.py" ] || [ -f "wsgi.py" ]; then
    flask run
fi
```

### Run in Background
```bash
# Start and detach
npm run dev &
DEV_PID=$!
echo $DEV_PID > .dev.pid

# Or with nohup for persistence
nohup npm run dev > dev.log 2>&1 &
```

---

## Stop Server

### By PID
```bash
# If we saved the PID
if [ -f ".dev.pid" ]; then
    kill $(cat .dev.pid)
    rm .dev.pid
fi
```

### By Port
```bash
# Find and kill process on port
lsof -ti:3000 | xargs kill -9

# Or more safely
fuser -k 3000/tcp
```

### By Name
```bash
# Kill all node processes (careful!)
pkill -f "node"

# Kill specific script
pkill -f "npm run dev"
```

---

## Check Running Servers

### List by Port
```bash
# Common dev ports
for port in 3000 3001 5173 8080 4200 8000 5000; do
    if lsof -i:$port >/dev/null 2>&1; then
        echo "Port $port: $(lsof -ti:$port | xargs ps -p | tail -1)"
    fi
done
```

### List Node Processes
```bash
ps aux | grep -E "node|npm|yarn|pnpm" | grep -v grep
```

### Check Specific Port
```bash
lsof -i :3000
# Or:
netstat -an | grep 3000
```

---

## File Watching

### Using nodemon (Node.js)
```bash
# Install globally
npm install -g nodemon

# Run with watch
nodemon server.js
nodemon --ext js,ts,json src/index.ts
```

### Using cargo-watch (Rust)
```bash
cargo install cargo-watch
cargo watch -x run
cargo watch -x test
```

### Using air (Go)
```bash
go install github.com/cosmtrek/air@latest
air
```

### Using watchexec (Universal)
```bash
# Install
brew install watchexec  # macOS
cargo install watchexec-cli  # via Rust

# Watch and run
watchexec -e js,ts npm test
watchexec -e py python main.py
```

---

## Hot Reload Setup

### Vite (Built-in)
```javascript
// vite.config.js - HMR is default
export default {
  server: {
    hmr: true
  }
}
```

### Webpack (with HMR)
```javascript
// webpack.config.js
devServer: {
  hot: true,
  liveReload: true
}
```

### Python (with watchdog)
```bash
pip install watchdog
watchmedo auto-restart --patterns="*.py" -- python app.py
```

---

## Process Management

### Save Running State
```bash
# Create state file
cat > .dev-state.json << EOF
{
  "pid": $DEV_PID,
  "port": 3000,
  "command": "npm run dev",
  "started": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
```

### Restore State
```bash
# Check if server should be running
if [ -f ".dev-state.json" ]; then
    PORT=$(jq -r '.port' .dev-state.json)
    if ! lsof -i:$PORT >/dev/null 2>&1; then
        echo "Server not running, restarting..."
        $(jq -r '.command' .dev-state.json) &
    fi
fi
```

---

## Output Parsing

### Dev Server Status
```yaml
server:
  status: running | stopped
  pid: 12345
  port: 3000
  uptime: "2h 34m"
  memory: "145MB"
  cpu: "2.3%"

logs:
  recent:
    - "[timestamp] Compiled successfully"
    - "[timestamp] Hot module replacement enabled"
```

---

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| EADDRINUSE | Port in use | Kill existing or use different port |
| EACCES | Permission denied | Use port > 1024 or sudo |
| Module not found | Dependencies missing | Run npm install |
| Cannot find module | Wrong directory | cd to project root |
| HMR disconnected | Server restart | Refresh browser |

---

## Common Patterns

### Start with Clean State
```bash
# Kill any existing, start fresh
pkill -f "npm run dev" 2>/dev/null
rm -f .dev.pid
npm run dev &
echo $! > .dev.pid
```

### Wait for Server Ready
```bash
# Start server
npm run dev &

# Wait for port
echo "Waiting for server..."
while ! nc -z localhost 3000; do
  sleep 0.5
done
echo "Server ready!"
```

### Graceful Shutdown
```bash
# Send SIGTERM first
kill -TERM $(cat .dev.pid)
sleep 2

# Force if still running
if kill -0 $(cat .dev.pid) 2>/dev/null; then
    kill -9 $(cat .dev.pid)
fi
rm .dev.pid
```

---

## Integration

This skill integrates with:
- `test_frontend` for running tests with dev server
- `/orchestrator` for build verification
- `app_reviews/` for logging server issues
