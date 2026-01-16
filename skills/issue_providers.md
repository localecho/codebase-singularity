---
name: issue_providers
description: Abstract interface for pluggable issue tracking backends (Jira, Linear, Notion)
triggers:
  - configure issue provider
  - switch issue backend
  - sync issues
  - jira integration
  - linear integration
  - notion integration
---

# Skill: Issue Providers - Abstract Interface

This skill defines an abstract interface for pluggable issue tracking backends, enabling seamless integration with Jira, Linear, Notion, and other providers.

## Philosophy

> One interface, many backends. Switch issue trackers without changing workflows.

## Provider Interface

### Abstract Operations

All issue providers must implement these core operations:

| Operation | Description |
|-----------|-------------|
| `auth` | Authenticate with the provider |
| `create` | Create a new issue |
| `read` | Get issue details |
| `update` | Modify an issue |
| `close` | Close/complete an issue |
| `list` | List issues with filters |
| `link` | Link issue to spec/PR |
| `comment` | Add comment to issue |

### Configuration File

Create `.agentic/issue-provider.yaml`:

```yaml
# Issue Provider Configuration
provider: jira  # Options: github, jira, linear, notion

github:
  enabled: true
  token_env: GITHUB_TOKEN
  repo: owner/repo

jira:
  enabled: false
  url: https://company.atlassian.net
  token_env: JIRA_API_TOKEN
  email_env: JIRA_EMAIL
  project: PROJ

linear:
  enabled: false
  token_env: LINEAR_API_KEY
  team: team-slug

notion:
  enabled: false
  token_env: NOTION_API_KEY
  database_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Jira Integration

### Authentication

```bash
# Set environment variables
export JIRA_URL="https://company.atlassian.net"
export JIRA_EMAIL="user@company.com"
export JIRA_API_TOKEN="your-api-token"

# Test connection
curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_URL/rest/api/3/myself" | jq '.displayName'
```

### Create Issue

```bash
# Create Jira issue
curl -s -X POST \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$JIRA_URL/rest/api/3/issue" \
  -d '{
    "fields": {
      "project": {"key": "PROJ"},
      "summary": "Implement feature X",
      "description": {
        "type": "doc",
        "version": 1,
        "content": [{
          "type": "paragraph",
          "content": [{"type": "text", "text": "Description here"}]
        }]
      },
      "issuetype": {"name": "Task"}
    }
  }' | jq '.key'
```

### Read Issue

```bash
# Get issue details
curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_URL/rest/api/3/issue/PROJ-123" | jq '{
    key: .key,
    summary: .fields.summary,
    status: .fields.status.name
  }'
```

### Update Issue

```bash
# Update issue status (transition)
curl -s -X POST \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$JIRA_URL/rest/api/3/issue/PROJ-123/transitions" \
  -d '{"transition": {"id": "31"}}'

# Add comment
curl -s -X POST \
  -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$JIRA_URL/rest/api/3/issue/PROJ-123/comment" \
  -d '{
    "body": {
      "type": "doc",
      "version": 1,
      "content": [{
        "type": "paragraph",
        "content": [{"type": "text", "text": "Comment text"}]
      }]
    }
  }'
```

### List Issues

```bash
# JQL query
curl -s -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  "$JIRA_URL/rest/api/3/search?jql=project=PROJ+AND+status=Open" | \
  jq '.issues[] | {key: .key, summary: .fields.summary}'
```

## Linear Integration

### Authentication

```bash
# Set API key
export LINEAR_API_KEY="lin_api_xxxxx"

# Test connection
curl -s -X POST \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.linear.app/graphql" \
  -d '{"query": "{ viewer { id name } }"}' | jq '.data.viewer.name'
```

### Create Issue

```bash
# Create Linear issue
curl -s -X POST \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.linear.app/graphql" \
  -d '{
    "query": "mutation CreateIssue($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier title } } }",
    "variables": {
      "input": {
        "teamId": "team-uuid",
        "title": "Implement feature X",
        "description": "Description here"
      }
    }
  }' | jq '.data.issueCreate.issue'
```

### Read Issue

```bash
# Get issue by identifier
curl -s -X POST \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.linear.app/graphql" \
  -d '{
    "query": "query Issue($id: String!) { issue(id: $id) { id title state { name } } }",
    "variables": {"id": "issue-uuid"}
  }' | jq '.data.issue'
```

### Update Issue

```bash
# Update issue state
curl -s -X POST \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.linear.app/graphql" \
  -d '{
    "query": "mutation UpdateIssue($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success } }",
    "variables": {
      "id": "issue-uuid",
      "input": {"stateId": "state-uuid"}
    }
  }'
```

### List Issues

```bash
# List team issues
curl -s -X POST \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.linear.app/graphql" \
  -d '{
    "query": "query Issues { issues(filter: {state: {name: {eq: \"In Progress\"}}}) { nodes { identifier title } } }"
  }' | jq '.data.issues.nodes'
```

## Notion Integration

### Authentication

```bash
# Set API key
export NOTION_API_KEY="secret_xxxxx"
export NOTION_DATABASE_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# Test connection
curl -s \
  -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2022-06-28" \
  "https://api.notion.com/v1/users/me" | jq '.name'
```

### Create Issue (Database Page)

```bash
# Create page in database
curl -s -X POST \
  -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  "https://api.notion.com/v1/pages" \
  -d '{
    "parent": {"database_id": "'"$NOTION_DATABASE_ID"'"},
    "properties": {
      "Name": {"title": [{"text": {"content": "Implement feature X"}}]},
      "Status": {"select": {"name": "Open"}},
      "Type": {"select": {"name": "Task"}}
    }
  }' | jq '.id'
```

### Read Issue

```bash
# Get page details
curl -s \
  -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2022-06-28" \
  "https://api.notion.com/v1/pages/$PAGE_ID" | jq '{
    id: .id,
    title: .properties.Name.title[0].text.content,
    status: .properties.Status.select.name
  }'
```

### Update Issue

```bash
# Update page properties
curl -s -X PATCH \
  -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  "https://api.notion.com/v1/pages/$PAGE_ID" \
  -d '{
    "properties": {
      "Status": {"select": {"name": "Done"}}
    }
  }'
```

### List Issues

```bash
# Query database
curl -s -X POST \
  -H "Authorization: Bearer $NOTION_API_KEY" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  "https://api.notion.com/v1/databases/$NOTION_DATABASE_ID/query" \
  -d '{
    "filter": {
      "property": "Status",
      "select": {"equals": "Open"}
    }
  }' | jq '.results[] | {id: .id, title: .properties.Name.title[0].text.content}'
```

## Unified CLI Wrapper

### Provider-Agnostic Commands

Create wrapper scripts that route to the active provider:

```bash
#!/bin/bash
# issue-cli.sh - Unified issue management

PROVIDER=$(cat .agentic/issue-provider.yaml | grep "^provider:" | cut -d' ' -f2)

case "$1" in
  create)
    case "$PROVIDER" in
      github) gh issue create --title "$2" --body "$3" ;;
      jira) jira_create "$2" "$3" ;;
      linear) linear_create "$2" "$3" ;;
      notion) notion_create "$2" "$3" ;;
    esac
    ;;
  read)
    case "$PROVIDER" in
      github) gh issue view "$2" ;;
      jira) jira_read "$2" ;;
      linear) linear_read "$2" ;;
      notion) notion_read "$2" ;;
    esac
    ;;
  close)
    case "$PROVIDER" in
      github) gh issue close "$2" ;;
      jira) jira_transition "$2" "Done" ;;
      linear) linear_update_state "$2" "done" ;;
      notion) notion_update "$2" "Done" ;;
    esac
    ;;
esac
```

### Usage Examples

```bash
# Create issue (provider-agnostic)
./issue-cli.sh create "Feature title" "Description"

# Read issue
./issue-cli.sh read ISSUE-123

# Close issue
./issue-cli.sh close ISSUE-123
```

## Spec Integration

### Spec Frontmatter (Multi-Provider)

```yaml
---
title: Feature Name
date: 2025-01-15
status: draft
issue:
  provider: jira
  key: PROJ-123
  url: https://company.atlassian.net/browse/PROJ-123
---
```

### Auto-Link on Spec Creation

```bash
# Create spec and issue in configured provider
/spec "Feature name" --create-issue

# Workflow:
# 1. Detect provider from config
# 2. Create issue in provider
# 3. Add issue reference to spec frontmatter
# 4. Log linking in app_reviews/
```

## Provider Comparison

| Feature | GitHub | Jira | Linear | Notion |
|---------|--------|------|--------|--------|
| CLI Tool | gh | - | - | - |
| API Style | REST | REST | GraphQL | REST |
| Auth | Token/OAuth | Token | Token | Token |
| Webhooks | Yes | Yes | Yes | Yes |
| Subtasks | - | Yes | Yes | Yes |
| Sprints | - | Yes | Cycles | - |

## Safety Rules

1. **Store tokens in environment variables** - Never hardcode
2. **Validate provider config** before operations
3. **Handle API rate limits** gracefully
4. **Log all provider operations** for audit
5. **Test connection** before critical operations

---
*Skill for abstract issue provider interface supporting multiple backends*
