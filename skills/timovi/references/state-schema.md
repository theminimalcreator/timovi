# Schema — state.json

## Structure

```json
{
  "version": "1.0.0",
  "project": "my-product",
  "description": "Platform for high-performance athlete training metrics.",
  "user_name": "Alice",
  "chat_language": "pt-br",
  "doc_language": "en",
  "phase": "ready",
  "bootstrap_completed": true,
  "bootstrap_completed_at": "2026-06-05T15:00:00Z",
  "active_roles": ["product-manager", "ux-designer", "..."],
  "current_feature": "workout-plans",
  "features": ["workout-plans", "athlete-dashboard-v2"],
  "knowledge_files": {
    "context": ".product-team/knowledge/CONTEXT.md",
    "architecture": ".product-team/knowledge/ARCHITECTURE.md",
    "stack": ".product-team/knowledge/STACK.md",
    "conventions": ".product-team/knowledge/CONVENTIONS.md"
  },
  "git_mode": "auto"
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Framework version |
| `project` | string | Product name |
| `description` | string | One-line description |
| `user_name` | string | User name |
| `chat_language` | string | Language for user communication |
| `doc_language` | string | Language for documentation and inter-agent communication |
| `phase` | string | `"uninitialized"` or `"ready"` |
| `bootstrap_completed` | boolean | Whether bootstrap has been completed |
| `current_feature` | string\|null | Active feature name → points to `.product-team/artifacts/<name>/feature.json` |
| `features` | string[] | List of completed or paused features (history). Details in each `feature.json`. |
| `knowledge_files` | object | Paths to Layer 0 files |
| `git_mode` | string | `"auto"` (automatic commits) or `"confirm"` (prompt before each commit). Default: `"auto"`. |

## Feature structure (feature.json)

Each feature has its own file at `.product-team/artifacts/<feature>/feature.json`.
See `references/feature-schema.md` for the complete schema.

## Rules

- **Never remove fields.** Only add or update.
- **`feature.json` is the source of truth for issues.** `state.json` only stores references.
- **Use ISO 8601 timestamps.**
