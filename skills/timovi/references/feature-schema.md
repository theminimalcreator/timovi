# Feature Schema — feature.json

Cada feature tem seu próprio `feature.json` em `.product-team/artifacts/<feature-name>/feature.json`.

## Estrutura completa

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
      "pr_url": "https://github.com/user/cdt/pull/42",
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
  ]
}
```

## Campos

### Feature

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | string | Slug da feature (ex: `workout-plans`) |
| `status` | string | `"planned"`, `"in_progress"`, `"done"`, `"paused"` |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 — atualizado a cada mudança de status |
| `pipeline_phase` | string | Fase atual: `"plan"`, `"spec"`, `"breakdown"`, `"execute"`, `"review"` |
| `branch` | string | Branch git da feature (ex: `feat/workout-plans`). Criada na Fase Spec. |

### PRD

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `path` | string | Caminho relativo ao `.product-team/` |
| `source` | string | `"generated"` (criado pelo PM) ou `"imported"` (usuário trouxe de fora) |
| `imported_from` | string\|null | Se importado, caminho do arquivo original |
| `created_at` | string | ISO 8601 |

### Issue

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | ID sequencial (ISSUE-1, ISSUE-2, ...) |
| `title` | string | Título descritivo |
| `status` | string | `"pending"`, `"in_progress"`, `"done"`, `"blocked"`, `"failed"` |
| `assigned_roles` | string[] | Papéis responsáveis |
| `blocked_by` | string[] | IDs das issues bloqueantes |
| `pr_url` | string\|null | URL do PR (preenchido após implementação) |
| `started_at` | string\|null | Quando o agente começou |
| `completed_at` | string\|null | Quando o agente terminou |
| `agent_id` | string\|null | ID do subagent que está executando |
| `notes` | string | Notas livres (erros, bloqueios, observações) |

## Status transitions

```
pending ──────→ in_progress ──────→ done
   │                  │
   │                  ├──→ blocked
   │                  │       │
   │                  │       └──→ in_progress
   │                  │
   │                  └──→ failed
   │
   └──→ (issue nunca spawnada, aguardando round)
```

## Regras

- **Agentes atualizam `feature.json` diretamente.** É a fonte da verdade.
- **`updated_at` é atualizado a cada mudança** em qualquer issue ou fase.
- **`blocked` → `in_progress`** acontece automaticamente quando a issue bloqueante marca `done`.
- **Nunca remova issues** — marque como `done` ou `failed`.
- **`notes` é para comunicação entre agentes** — erros, decisões, contexto.
