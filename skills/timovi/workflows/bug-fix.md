# Workflow: Bug Fix

Pipeline para correção de bugs reportados.

## Papéis envolvidos

| Fase | Papéis | Descrição |
|------|--------|-----------|
| Triage | Tech Lead, QA | Classificar severidade, reproduzir, isolar causa |
| Fix | Frontend ou Backend | Implementar correção |
| Review | QA, Tech Lead | Validar correção, verificar regressão |

## Gatilhos

- Bug reportado por QA na Fase Review
- Bug reportado por usuário
- Incidente em produção

## Fluxo

### 1. Triage (Tech Lead + QA)

- Reproduzir o bug com passos claros
- Isolar causa raiz (módulo, arquivo, condição)
- Classificar severidade: 🔴 crítico / 🟡 médio / 🟢 baixo
- Identificar papel responsável pela correção
- Se for crítico e em produção: acionar DevOps para possível rollback

### 2. Fix (Frontend ou Backend Engineer)

- Implementar correção
- Adicionar teste de regressão
- Abrir PR com referência ao bug

### 3. Review (QA + Tech Lead)

- QA: verificar que o bug foi corrigido
- QA: verificar que não houve regressão nos fluxos relacionados
- Tech Lead: revisar código da correção
- Se aprovado: merge e deploy

## Artefatos

- Issue registrada em `feature.json`
- PR com `Fixes #<bug-issue>`
- Teste de regressão adicionado
