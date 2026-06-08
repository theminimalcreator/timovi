# Schema — state.json

## Estrutura

```json
{
  "version": "1.0.0",
  "project": "cdt",
  "description": "Platform for high-performance athlete training metrics.",
  "user_name": "Guilherme",
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
  }
}
```

## Campos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `version` | string | Versão do framework |
| `project` | string | Nome do produto |
| `description` | string | Descrição em uma frase |
| `user_name` | string | Nome do usuário |
| `chat_language` | string | Idioma com o usuário |
| `doc_language` | string | Idioma da documentação e comunicação entre agentes |
| `phase` | string | `"uninitialized"` ou `"ready"` |
| `bootstrap_completed` | boolean | Se o bootstrap foi concluído |
| `current_feature` | string\|null | Nome da feature ativa → aponta para `.product-team/artifacts/<name>/feature.json` |
| `features` | string[] | Lista de features concluídas ou pausadas (histórico). Detalhes em cada `feature.json`. |
| `knowledge_files` | object | Paths dos arquivos da Layer 0 |

## Estrutura de feature (feature.json)

Cada feature tem seu próprio arquivo em `.product-team/artifacts/<feature>/feature.json`.
Consulte `references/feature-schema.md` para o schema completo.

## Regras

- **Nunca remova campos.** Apenas adicione ou atualize.
- **`feature.json` é a fonte da verdade para issues.** `state.json` só guarda referências.
- **Use timestamps ISO 8601.**
