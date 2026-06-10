# Linear GraphQL API Reference

> Full docs: https://linear.app/developers/graphql
> API endpoint: `https://api.linear.app/graphql`
> Auth: `Authorization: <api_key>` header (no Bearer prefix)
> Content-Type: `application/json`

## Authentication

Linear uses personal API keys. Create one at https://linear.app/settings/api.

Key format: `lin_api_...`

Pass in the `Authorization` header:
```bash
curl https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: lin_api_YOUR_KEY" \
  -d '{"query": "{ viewer { id name } }"}'
```

## Rate Limits

Linear enforces rate limits on mutations. Limits vary by plan:

| Plan | Limit |
|------|-------|
| Free | ~50 requests / minute |
| Plus | ~150 requests / minute |
| Business | ~300 requests / minute |

**Timovi handling:** During `push`, Issues are synced sequentially with a 200ms delay between calls. If a 429 is received, wait 5 seconds and retry once.

## Key Queries

### viewer — Health Check & Identity

Returns the authenticated user's identity. Used by `ping` and `connect` for validation.

```graphql
query {
  viewer {
    id
    name
    email
  }
}
```

### teams — List Available Teams

Returns all teams accessible to the authenticated user. Used by `connect` to let user choose a team.

```graphql
query {
  teams {
    nodes {
      id
      name
      key
    }
  }
}
```

Filter by key:

```graphql
query {
  teams(filter: { key: { eq: "KLO" } }) {
    nodes {
      id
      name
      key
    }
  }
}
```

### team — Get Single Team with States

Returns team details including workflow states. Used by `push` to resolve state IDs from status_mapping names, and by `status` for board summaries.

```graphql
query {
  team(id: "bf3630d3-...") {
    id
    name
    key
    states {
      nodes {
        id
        name
        type    # "unstarted", "started", "completed", "canceled", "backlog"
      }
    }
    issues {
      nodes {
        id
        identifier
        title
        state {
          id
          name
          type
        }
      }
    }
  }
}
```

`state.type` is used to determine the state category:
- `unstarted` — Backlog, Todo, Blocked
- `started` — In Progress, In Review
- `completed` — Done, Canceled
- `backlog` — Backlog

### issues — List Team Issues

Returns all issues for a team. Used by `status` for board summary and `pull` for state comparison.

```graphql
query {
  team(id: "bf3630d3-...") {
    issues {
      nodes {
        id
        identifier
        title
        state {
          id
          name
          type
        }
      }
    }
  }
}
```

Filter options:
```graphql
issues(filter: {
  state: { name: { eq: "In Progress" } }
  assignee: { isMe: { eq: true } }
}) { ... }
```

### issue — Get Single Issue by ID

Returns full details for a specific issue. Used by `pull` to check remote state.

```graphql
query {
  issue(id: "abc123...") {
    id
    identifier
    title
    description
    state {
      id
      name
      type
    }
    labels {
      nodes {
        id
        name
      }
    }
    priority
    project {
      id
      name
    }
    url
  }
}
```

## Key Mutations

### issueCreate — Create a New Issue

Used by `push` to create Linear issues from Timovi Issues.

```graphql
mutation IssueCreate($input: IssueCreateInput!) {
  issueCreate(input: $input) {
    success
    issue {
      id
      identifier
      title
      state {
        name
      }
      url
    }
  }
}
```

**Input fields used by Timovi:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | String | Yes | Team UUID |
| `title` | String | Yes | Issue title. Timovi prepends `[FEAT]` or `[BUG]` |
| `description` | String | No | Markdown description with standard sections + blocked_by note |
| `stateId` | String | No | Workflow state UUID (resolved from `status_mapping`) |
| `labelIds` | [String] | No | Label UUIDs — Feature/Bug label |
| `priority` | Int | No | 0=none, 1=urgent, 2=high, 3=medium, 4=low. Timovi defaults to 0. |

**Example curl:**

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: lin_api_..." \
  -d '{
    "query": "mutation IssueCreate($input: IssueCreateInput!) { issueCreate(input: $input) { success issue { id identifier title state { name } } } }",
    "variables": {
      "input": {
        "teamId": "bf3630d3-...",
        "title": "[FEAT] User authentication",
        "description": "**Feature:** User authentication\n\n**Acceptance Criteria:**\n- Login with email/password",
        "stateId": "state-uuid-here"
      }
    }
  }' | jq .
```

**Response shape:**

```json
{
  "data": {
    "issueCreate": {
      "success": true,
      "issue": {
        "id": "abc12345-...",
        "identifier": "KLO-250",
        "title": "[FEAT] User authentication",
        "state": { "name": "Backlog" }
      }
    }
  }
}
```

### issueUpdate — Update an Existing Issue

Used in Phase 5 (Review) to update Linear status after QA approval/rejection.

```graphql
mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
  issueUpdate(id: $id, input: $input) {
    success
    issue {
      id
      identifier
      state {
        name
      }
    }
  }
}
```

**Input fields used by Timovi:**

| Field | Type | Description |
|-------|------|-------------|
| `stateId` | String | New workflow state UUID (from status_mapping) |
| `description` | String | Updated description (append review notes) |

**Example:**
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: lin_api_..." \
  -d '{
    "query": "mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) { issueUpdate(id: $id, input: $input) { success issue { id identifier state { name } } } }",
    "variables": {
      "id": "abc12345-...",
      "input": {
        "stateId": "in-review-state-uuid"
      }
    }
  }' | jq .
```

### issueDelete — Delete an Issue

Delete (trash) an issue by its UUID.

```graphql
mutation {
  issueDelete(id: "<issue-uuid>") {
    success
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `String!` | Yes | UUID of the issue to delete |

**⚠️ Soft-delete:** `issueDelete` marks the issue as `trashed: true` rather than permanently deleting it. Trashed issues still appear in queries by ID (`trashed: true`) but NOT in board/list queries. Permanent deletion requires the Linear UI or admin API.

**Curl example:**
```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{"query": "mutation { issueDelete(id: \"<uuid>\") { success } }"}'
```

Note: `issueDelete` takes `id` directly as a query argument (not inside an `input` object).

### createWorkflowState — Create a Custom Workflow State (v1 out of scope)

Creates `Blocked` and `Failed` states in the target team. Handled by ISSUE-5 (not part of core skill).

```graphql
mutation {
  workflowStateCreate(input: {
    teamId: "bf3630d3-...",
    name: "Blocked",
    type: "unstarted",
    color: "#f59e0b"
  }) {
    success
    workflowState { id name }
  }
}
```

## Status Mapping Reference

| Timovi `status` | Linear State Name | Linear `type` |
|-----------------|-------------------|---------------|
| `pending` | `Backlog` | `backlog` |
| `in_progress` | `In Progress` | `started` |
| `done` | `In Review` | `started` |
| `blocked` | `Blocked` | `unstarted` |
| `failed` | `Failed` | `backlog` |

These are the **default** mappings stored in `state.json` → `linear_config.status_mapping`. They can be customized per team during `connect`.

## Priority Mapping

| Linear Priority | Value | Usage |
|----------------|-------|-------|
| None | 0 | Default for Timovi Issues |
| Urgent | 1 | Reserved |
| High | 2 | Reserved |
| Medium | 3 | Reserved |
| Low | 4 | Reserved |

Timovi v1 defaults all Issues to priority 0 (None). Priority mapping may be added in future versions.

## Error Response Format

GraphQL errors come in the `errors` array:

```json
{
  "data": null,
  "errors": [
    {
      "message": "Team not found",
      "extensions": {
        "code": "NOT_FOUND",
        "type": "not_found"
      }
    }
  ]
}
```

Common error codes:
- `NOT_FOUND` — Invalid UUID (team, issue, state)
- `UNAUTHORIZED` — Invalid or revoked API key
- `RATELIMITED` — Too many requests
- `VALIDATION_ERROR` — Missing required fields in input

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (including GraphQL errors in body) |
| 400 | Bad request (malformed JSON) |
| 401 | Missing or invalid API key header |
| 429 | Rate limited |
| 500 | Internal server error |

Note: GraphQL endpoint always returns 200 on valid requests — errors are in the response body.
