---
name: timovi-linear
description: Linear integration skill for Timovi. Communicates with Linear GraphQL API (connect, push, pull, dry-run, status, ping). Use when syncing Issues to Linear during Breakdown/Execute/Review phases, checking sync status, or configuring Linear integration.
---

# Linear Integration — Timovi

You are the Linear integration skill. You execute bash commands that use `curl` + `jq` to interact with the Linear GraphQL API. You are not a persistent Role — you are a utility skill called by the Orchestrator and by Roles (Tech Lead, QA Engineer) when they need to interact with Linear.

## On activation

1. Read `.product-team/knowledge/INTEGRATIONS.md` — the integration design and architecture
2. Read `.product-team/state.json` — get `linear_config` (may be null)
3. Identify the operation requested: `connect`, `push`, `pull`, `dry-run`, `status`, or `ping`

## Configuration

Linear configuration is stored in `.product-team/state.json` under `linear_config`. When not configured, `linear_config` is `null`.

```json
{
  "linear_config": {
    "api_key": "lin_api_...",
    "team_id": "bf3630d3-...",
    "team_key": "KLO",
    "project_id": null,
    "status_mapping": {
      "pending": "8475ed27-9e8c-4db3-80ac-0adfaf84dc8c",
      "in_progress": "f43dbc9c-9846-42ce-87c4-32fcb2a29f3f",
      "done": "0b43344a-a0d4-4028-a047-2e5e861e609c",
      "blocked": "622778b4-78c5-4f67-b9f4-3ac6911df332",
      "failed": "990aaa56-c71f-4f71-8cd9-fb90fdb569c0"
    },
    "connected_at": "2026-06-10T00:30:00Z"
  }
}
```

**Important:** `status_mapping` stores Linear state **UUIDs**, not names. The UUIDs are resolved from the team's workflow states during `connect`. This avoids an extra API call on every push/pull operation.

All paths below are relative to the project root (current working directory).

## Operations

### ping — Health check

Validate connectivity and get viewer info.

```bash
# Read config from state.json
LINEAR_API_KEY=$(jq -r '.linear_config.api_key' .product-team/state.json)

if [ "$LINEAR_API_KEY" = "null" ] || [ -z "$LINEAR_API_KEY" ]; then
  echo "Linear not configured. Run 'connect' first."
  exit 1
fi

# Query viewer for health check
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{"query": "query { viewer { id name } }"}' | jq .

# Also get team info if team_id is configured
TEAM_ID=$(jq -r '.linear_config.team_id' .product-team/state.json)
if [ "$TEAM_ID" != "null" ]; then
  curl -s -X POST https://api.linear.app/graphql \
    -H "Content-Type: application/json" \
    -H "Authorization: $LINEAR_API_KEY" \
    -d "{\"query\": \"query { team(id: \\\"$TEAM_ID\\\") { id name key } }\"}" | jq .
fi
```

**Report format:**
```
🔌 Linear Health Check
   Connectivity:  ✅ / ❌
   Viewer:        <name> (<id>)
   Team:          <team name> (<key>)
   API Key valid: ✅ / ❌
```

### connect — Setup integration

Guides the user through configuring Linear. Accepts API key and team information, validates, and persists to state.json.

**Interactive flow (when called without arguments):**

1. Ask for Linear API key (`lin_api_...` — can be created at https://linear.app/settings/api)
2. Validate key with `viewer { name }` query. If invalid, retry.
3. Ask for team key or team ID (e.g., `KLO` or `bf3630d3-...`)
4. List available teams if no specific team given:

```bash
curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d '{"query": "query { teams { nodes { id name key } } }"}' | \
  jq -r '.data.teams.nodes[] | "\(.key) — \(.name) (\(.id))"'
```

5. Let user select team. Resolve team ID from key if needed:

```bash
# Resolve team ID from key (e.g., KLO -> bf3630d3-...)
TEAM_KEY="KLO"
TEAM_ID=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d "{\"query\": \"query { teams(filter: { key: { eq: \\\"$TEAM_KEY\\\" } }) { nodes { id key name } } }\"}" | \
  jq -r '.data.teams.nodes[0].id')
```

6. Optionally ask for project ID (can be `null`)
7. Query the team's workflow states to resolve state UUIDs:

```bash
# Fetch all workflow states for the selected team
STATES_JSON=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d "{\"query\": \"query { team(id: \\\"$TEAM_ID\\\") { states { nodes { id name } } } }\"}" | \
  jq '.data.team.states.nodes')

# Resolve each required state name to its UUID
BACKLOG_ID=$(echo "$STATES_JSON" | jq -r '.[] | select(.name == "Backlog") | .id')
IN_PROGRESS_ID=$(echo "$STATES_JSON" | jq -r '.[] | select(.name == "In Progress") | .id')
IN_REVIEW_ID=$(echo "$STATES_JSON" | jq -r '.[] | select(.name == "In Review") | .id')
BLOCKED_ID=$(echo "$STATES_JSON" | jq -r '.[] | select(.name == "Blocked") | .id')
FAILED_ID=$(echo "$STATES_JSON" | jq -r '.[] | select(.name == "Failed") | .id')

# If Blocked or Failed don't exist, create them:
if [ "$BLOCKED_ID" = "null" ] || [ -z "$BLOCKED_ID" ]; then
  BLOCKED_RESULT=$(curl -s -X POST https://api.linear.app/graphql \
    -H "Content-Type: application/json" \
    -H "Authorization: $LINEAR_API_KEY" \
    -d "{\"query\": \"mutation { workflowStateCreate(input: { teamId: \\\"$TEAM_ID\\\", name: \\\"Blocked\\\", type: \\\"unstarted\\\", color: \\\"#f59e0b\\\" }) { success workflowState { id } } }\"}")
  BLOCKED_ID=$(echo "$BLOCKED_RESULT" | jq -r '.data.workflowStateCreate.workflowState.id')
fi
if [ "$FAILED_ID" = "null" ] || [ -z "$FAILED_ID" ]; then
  FAILED_RESULT=$(curl -s -X POST https://api.linear.app/graphql \
    -H "Content-Type: application/json" \
    -H "Authorization: $LINEAR_API_KEY" \
    -d "{\"query\": \"mutation { workflowStateCreate(input: { teamId: \\\"$TEAM_ID\\\", name: \\\"Failed\\\", type: \\\"backlog\\\", color: \\\"#ef4444\\\" }) { success workflowState { id } } }\"}")
  FAILED_ID=$(echo "$FAILED_RESULT" | jq -r '.data.workflowStateCreate.workflowState.id')
fi
```

8. Write `linear_config` to `.product-team/state.json` with UUIDs:

```bash
# Build the linear_config JSON with state UUIDs
CONFIG=$(jq -n \
  --arg api_key "$LINEAR_API_KEY" \
  --arg team_id "$TEAM_ID" \
  --arg team_key "$TEAM_KEY" \
  --arg project_id "${PROJECT_ID:-null}" \
  --arg backlog_id "$BACKLOG_ID" \
  --arg in_progress_id "$IN_PROGRESS_ID" \
  --arg in_review_id "$IN_REVIEW_ID" \
  --arg blocked_id "$BLOCKED_ID" \
  --arg failed_id "$FAILED_ID" \
  --arg connected_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  '{
    api_key: $api_key,
    team_id: $team_id,
    team_key: $team_key,
    project_id: ($project_id | if . == "null" then null else . end),
    status_mapping: {
      pending: $backlog_id,
      in_progress: $in_progress_id,
      done: $in_review_id,
      blocked: $blocked_id,
      failed: $failed_id
    },
    connected_at: $connected_at
  }')

# Write to state.json (merge into existing)
jq --argjson config "$CONFIG" '.linear_config = $config' .product-team/state.json > .product-team/state.tmp.json && \
  mv .product-team/state.tmp.json .product-team/state.json
```

**Report format:**
```
✅ Linear connected!
   Team:    <name> (<key>)
   Viewer:  <name>
   Config saved to .product-team/state.json → linear_config
```

### push — Create Issues in Linear

Read Issues from `.product-team/artifacts/<feature>/feature.json` and create corresponding Linear issues for each with `sync_status` "pending_sync" or "failed".

**Pre-flight:**
1. Validate `linear_config` is not null
2. Run `ping` to confirm connectivity
3. Identify target feature (from state.json `current_feature` or explicit argument)

**For each Issue with `sync_status` = "pending_sync" or "failed":**

**Important:** New cards (`sync_status: "pending_sync"`, no `linear_issue_id`) always start at **Backlog** (the mapped state for Timovi `pending`), regardless of the Issue's current Timovi `status`. This matches PRD US-3 — new Features and Bugs enter the board at Backlog. Only `sync_status: "failed"` cards use the status_mapping based on their Timovi status (retry preserving original state).

Resolve the appropriate Linear state ID:

```bash
# For new cards (pending_sync, no linear_issue_id): always Backlog
# For retry cards (failed): use the status_mapping based on Timovi status
SYNC_STATUS="pending_sync"
if [ "$SYNC_STATUS" = "pending_sync" ]; then
  # New card → always Backlog
  STATE_ID=$(jq -r '.linear_config.status_mapping.pending' .product-team/state.json)
else
  # Failed retry → use mapped state from Timovi status
  LOCAL_STATUS="pending"
  STATE_ID=$(jq -r --arg status "$LOCAL_STATUS" '.linear_config.status_mapping[$status]' .product-team/state.json)
fi
```

Then create the Linear issue:

```bash
# Build the issueCreate mutation
# Note: description is markdown. Escape double quotes and newlines.
TITLE="[FEAT] Issue title here"
DESCRIPTION="Issue description with markdown.
⛓️ Blocked by: ISSUE-1, ISSUE-3"
PRIORITY=0  # 0=none, 1=urgent, 2=high, 3=medium, 4=low

RESULT=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d @- <<EOF
{
  "query": "mutation IssueCreate(\$input: IssueCreateInput!) { issueCreate(input: \$input) { success issue { id identifier title state { name } } } }",
  "variables": {
    "input": {
      "teamId": "$TEAM_ID",
      "title": "$TITLE",
      "description": "$DESCRIPTION",
      "stateId": "$STATE_ID",
      "priority": $PRIORITY
    }
  }
}
EOF
)

# Extract result
SUCCESS=$(echo "$RESULT" | jq -r '.data.issueCreate.success')
LINEAR_ID=$(echo "$RESULT" | jq -r '.data.issueCreate.issue.id')
LINEAR_IDENTIFIER=$(echo "$RESULT" | jq -r '.data.issueCreate.issue.identifier')
```

**On success:** Update the Issue in `feature.json`:
```bash
SYNC_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)
jq --arg id "ISSUE-1" \
   --arg linear_id "$LINEAR_ID" \
   --arg identifier "$LINEAR_IDENTIFIER" \
   --arg synced_at "$SYNC_TIME" \
   '(.issues[] | select(.id == $id)) |= (
      .linear_issue_id = $linear_id |
      .linear_identifier = $identifier |
      .sync_status = "synced" |
      .sync_updated_at = $synced_at
    )' \
   .product-team/artifacts/<feature>/feature.json > .product-team/artifacts/<feature>/feature.tmp.json && \
   mv .product-team/artifacts/<feature>/feature.tmp.json .product-team/artifacts/<feature>/feature.json
```

**On failure:** Set `sync_status` to "failed":
```bash
jq --arg id "ISSUE-1" \
   '(.issues[] | select(.id == $id)).sync_status = "failed"' \
   .product-team/artifacts/<feature>/feature.json > .product-team/artifacts/<feature>/feature.tmp.json && \
   mv .product-team/artifacts/<feature>/feature.tmp.json .product-team/artifacts/<feature>/feature.json
```

**Progress feedback:** Show after each Issue:
```
Sincronizando 3 de 8...
```

**Summary format:**
```
📤 Push complete — <feature>
   ✅ X synced
   ⚠️ Y failed
   ─────────────────
   Total: Z issues
```

**If no Issues to sync:**
```
📤 Push — <feature>
   All Issues already synced. Nothing to push.
```

### dry-run — Preview without creating

Same as push, but show what WOULD be created without calling `issueCreate`. Reads Issues from `feature.json` with `sync_status` "pending_sync" or "failed", resolves state names, and prints a preview table.

```bash
# Read pending/failed issues and their mapped Linear states
jq -r '
  .issues[] |
  select(.sync_status == "pending_sync" or .sync_status == "failed") |
  "\(.id) | [FEAT] \(.title) | \(.sync_status) | \(
    if .id | test("ISSUE-") then .id else "" end
  )"
' .product-team/artifacts/<feature>/feature.json
```

**Output format:**
```
🏜️  DRY RUN — Linear Sync Preview
   Feature: <feature>
   ────────────────────────────────
    #  | ID       | Title              | Status      | Linear State | Labels
   ─────────────────────────────────────────────────────────────────────
   1   | ISSUE-1  | Schema: user table  | pending_sync | Backlog      | Feature
   2   | ISSUE-2  | API: auth endpoint  | pending_sync | Backlog      | Feature
   3   | ISSUE-5  | UI: login page      | failed       | Backlog      | Feature
   ─────────────────────────────────────────────────────────────────────
   Would create 3 issues in Linear.
   Run 'push' to execute.
```

### pull — Fetch status from Linear

Read Issues from `feature.json` that have `linear_issue_id`, query their current state from Linear, compare with local status, and flag divergence.

```bash
# For each issue with linear_issue_id, query its state (including state.id for UUID comparison)
LINEAR_ID="abc123..."
RESULT=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d "{\"query\": \"query { issue(id: \\\"$LINEAR_ID\\\") { id identifier state { id name type } } }\"}" | \
  jq '.data.issue')

LINEAR_STATE_ID=$(echo "$RESULT" | jq -r '.state.id')
LINEAR_STATE_NAME=$(echo "$RESULT" | jq -r '.state.name')
LINEAR_STATE_TYPE=$(echo "$RESULT" | jq -r '.state.type')
```

**Comparison logic:**
- Read local `status` from `feature.json` for the Issue
- Look up expected Linear state UUID from `status_mapping` by local status
- If Linear `state.id` matches expected UUID → `sync_status = "synced"`
- If Linear `state.id` differs → `sync_status = "stale"`

```bash
LOCAL_STATUS="in_progress"
EXPECTED_ID=$(jq -r --arg status "$LOCAL_STATUS" '.linear_config.status_mapping[$status]' .product-team/state.json)
if [ "$LINEAR_STATE_ID" = "$EXPECTED_ID" ]; then
  SYNC_STATUS="synced"
else
  SYNC_STATUS="stale"
fi
```

```bash
# Update feature.json for each stale issue
jq --arg id "ISSUE-1" --arg sync_status "stale" --arg synced_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  '(.issues[] | select(.id == $id)) |= (
     .sync_status = $sync_status |
     .sync_updated_at = $synced_at
   )' \
   .product-team/artifacts/<feature>/feature.json > .product-team/artifacts/<feature>/feature.tmp.json && \
   mv .product-team/artifacts/<feature>/feature.tmp.json .product-team/artifacts/<feature>/feature.json
```

**Output format:**
```
📥 Pull — <feature>
   ────────────────────────────────
   ID       | Local Status | Remote State | Sync
   ─────────────────────────────────────────
   ISSUE-1  | in_progress  | In Progress  | ✅ synced
   ISSUE-2  | pending      | In Progress  | ⚠️ stale (was moved ahead in Linear)
   ISSUE-3  | done         | Done         | ✅ synced
   ─────────────────────────────────────────
   ✅ 2 synced  ⚠️ 1 stale  ❌ 0 failed
```

### status — Show sync state

Read feature.json Issues with their `sync_status` and query Linear for a board summary.

```bash
# Count Issues by sync_status from feature.json
LOCAL=$(jq -r '
  [.issues[].sync_status] |
  group_by(.) |
  map({key: .[0], count: length}) |
  .[]
' .product-team/artifacts/<feature>/feature.json)

# Query Linear board summary
BOARD=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: $LINEAR_API_KEY" \
  -d "{\"query\": \"query { team(id: \\\"$TEAM_ID\\\") { issues { nodes { state { name } } } } }\"}" | \
  jq '[.data.team.issues.nodes[].state.name] | group_by(.) | map({key: .[0], count: length}) | .[]')
```

**Output format:**
```
📊 Sync Status — <feature>
   ────────────────────────────────
   Local Issues (in feature.json):
     ✅ synced:         N
     ⏳ pending_sync:   N
     ⚠️ stale:          N
     ❌ failed:         N

   Remote Board (Linear):
     Backlog:     N
     In Progress: N
     In Review:   N
     Blocked:     N
     Done:        N
   ────────────────────────────────
   Local total:  N  |  Remote total: N
```

## Guardrails

Always:
- Use `jq` for all JSON parsing and mutation — never sed/regex on JSON
- Use heredocs for GraphQL queries with variables to avoid escaping issues
- Validate `linear_config` is not null before any operation except `connect`
- Handle API errors gracefully — curl exit codes, HTTP errors, GraphQL errors in response
- Read from `.product-team/state.json` and `.product-team/artifacts/<feature>/feature.json` — never hardcode paths

Never:
- Expose `api_key` in output — mask as `lin_api_...XXXX`
- Create an Issue in Linear that already has `linear_issue_id` (skip already-synced Issues)
- Modify the feature.json `issues[]` array without preserving all existing fields
- Block pipeline execution on Linear failures — always set `sync_status: "failed"` and continue

## Error Handling

| Scenario | Behavior |
|----------|----------|
| `linear_config` is null and operation is not `connect` | Report: "Linear not configured. Run connect first." — exit gracefully |
| API key invalid (401/403) | Report: "Linear API key rejected. Re-run connect to update." |
| Network error (curl timeout/DNS) | Report: "Cannot reach Linear API. Check connectivity." — set affected Issues to `sync_status: "failed"` |
| GraphQL error in response (`errors[]` present) | Extract `errors[].message`, report, set failed |
| Rate limit (429) | Wait 5 seconds, retry once. If still 429, set remaining Issues to `sync_status: "failed"` |
| Issue not found on pull (404 via GraphQL null) | Set `sync_status: "stale"` — the Issue may have been deleted in Linear |
| `jq` parse error on state.json/feature.json | Report corrupted file, do not proceed |
| Duplicate `linear_issue_id` detected | Skip the duplicate — report warning |

## Handoffs

**Called by:**
- Orchestrator — during pipeline execution (Breakdown → push, Execute → pull, Review → update)
- Tech Lead — after decomposition in Phase 3 (Breakdown)
- QA Engineer — during Phase 5 (Review) to update Linear status
- Any Role — for status checks and health verification

**Calls:**
- None (utility skill — operates independently via Linear GraphQL API)

## Behavior

- All operations are idempotent — safe to re-run
- GraphQL mutations use variables (not string interpolation) whenever possible
- Progress is shown per-Issue during bulk operations
- Timestamps are ISO 8601 UTC (`date -u +%Y-%m-%dT%H:%M:%SZ`)
- Feature name is resolved from `state.json` → `current_feature` unless explicitly overridden
