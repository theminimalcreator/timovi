# Feature Schema — feature.json

Each feature has its own `feature.json` at `.product-team/artifacts/<feature-name>/feature.json`.

## Full structure

```json
{
  "name": "workout-plans",
  "status": "in_progress",
  "created_at": "2026-06-05T10:00:00Z",
  "updated_at": "2026-06-05T14:30:00Z",
  "pipeline_phase": "execute",
  "branch": "feat/workout-plans",

  "prd": {
    "path": "artifacts/workout-plans/PRD.md",
    "source": "imported",
    "imported_from": "/home/user/projects/my-app/docs/prd.md",
    "created_at": "2026-06-05T10:30:00Z"
  },

  "issues": [
    {
      "id": "ISSUE-1",
      "title": "Schema: workout_plans table and relationships",
      "status": "done",
      "assigned_roles": ["backend-engineer", "dba"],
      "blocked_by": [],
      "pr_url": "https://github.com/user/repo/pull/42",
      "started_at": "2026-06-05T11:00:00Z",
      "completed_at": "2026-06-05T11:30:00Z",
      "agent_id": "agent-abc123",
      "notes": ""
    },
    {
      "id": "ISSUE-2",
      "title": "API: CRUD endpoints for workout plans",
      "status": "in_progress",
      "assigned_roles": ["backend-engineer"],
      "blocked_by": ["ISSUE-1"],
      "started_at": "2026-06-05T11:30:00Z",
      "agent_id": "agent-def456",
      "notes": "Blocked waiting for ISSUE-1 PR merge"
    },
    {
      "id": "ISSUE-3",
      "title": "UI: workout plan creation screen",
      "status": "blocked",
      "assigned_roles": ["frontend-engineer"],
      "blocked_by": ["ISSUE-2"],
      "notes": ""
    }
  ],

  "ponytail_actions": [
    {
      "timestamp": "2026-06-05T12:00:00Z",
      "phase": "breakdown",
      "action": "cancelled",
      "issue_id": "ISSUE-4",
      "reason": "coberto por ISSUE-2 com stdlib",
      "severity": "info"
    },
    {
      "timestamp": "2026-06-05T13:00:00Z",
      "phase": "execute",
      "action": "simplified",
      "issue_id": "ISSUE-3",
      "file": "src/utils/cache.ts",
      "reason": "functools.lru_cache substitui classe customizada de cache",
      "lines_saved": 120
    }
  ]
}
```

## Fields

### Feature

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Feature slug (e.g.: `workout-plans`) |
| `status` | string | `"planned"`, `"in_progress"`, `"done"`, `"paused"` |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 — updated on every status change |
| `pipeline_phase` | string | Current phase: `"plan"`, `"spec"`, `"breakdown"`, `"execute"`, `"review"` |
| `branch` | string | Feature git branch (e.g.: `feat/workout-plans`). Created in Spec Phase. |

### PRD

| Field | Type | Description |
|-------|------|-------------|
| `path` | string | Path relative to `.product-team/` |
| `source` | string | `"generated"` (created by PM) or `"imported"` (user brought from outside) |
| `imported_from` | string\|null | If imported, path to original file |
| `created_at` | string | ISO 8601 |

### Issue

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Sequential ID (ISSUE-1, ISSUE-2, ...) |
| `title` | string | Descriptive title |
| `status` | string | `"pending"`, `"in_progress"`, `"done"`, `"blocked"`, `"failed"`, `"cancelled"` |
| `assigned_roles` | string[] | Responsible roles |
| `blocked_by` | string[] | IDs of blocking issues |
| `pr_url` | string\|null | PR URL (filled after implementation) |
| `started_at` | string\|null | When the agent started |
| `completed_at` | string\|null | When the agent finished |
| `agent_id` | string\|null | Subagent ID that is executing |
| `notes` | string | Freeform notes (errors, blocks, observations) |

## Status transitions

```
pending ──────→ in_progress ──────→ done
   │    │             │
   │    │             ├──→ blocked
   │    │             │       │
   │    │             │       └──→ in_progress
   │    │             │
   │    │             └──→ failed
   │    │
   │    └──→ cancelled (ponytail gate: redundant or speculative)
   │
   └──→ (issue never spawned, waiting for round)
```

## Rules

- **Agents update `feature.json` directly.** It is the source of truth.
- **`updated_at` is updated on every change** to any issue or phase.
- **`blocked` → `in_progress`** happens automatically when the blocking issue marks `done`.
- **Never remove issues** — mark as `done`, `failed`, or `cancelled`.
- **`notes` is for inter-agent communication** — errors, decisions, context.

## PonytailActions

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string | ISO 8601 timestamp |
| `phase` | string | `"breakdown"` or `"execute"` |
| `action` | string | `"cancelled"`, `"simplified"`, `"merged"`, `"duplication_flagged"`, `"abstraction_flagged"`, `"dependency_flagged"` |
| `issue_id` | string | ID of the affected Issue |
| `reason` | string | Justification for the action |
| `severity` | string | `"info"` or `"warning"` |
| `file` | string\|null | Affected file (execute phase only) |
| `lines_saved` | number\|null | Lines saved (when applicable) |

### Rules for ponytail_actions

- **Backward-compatible:** Field is optional. Existing `feature.json` without `ponytail_actions` parses normally.
- **Append-only:** Actions are never removed or edited, only added.
- **Non-blocking:** If the ponytail gate fails, pipeline continues with a warning.
- **Minimum 1 issue:** Ponytail never cancels all issues — at least 1 must remain active.
- **Never cancels explicit user requests:** Issues implementing PRD User Stories are immune to cancellation.
