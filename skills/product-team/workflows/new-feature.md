# Workflow: New Feature

Pipeline completo para desenvolvimento de uma feature nova.

## Papéis envolvidos

| Fase | Papéis | Descrição |
|------|--------|-----------|
| Plan | PM, UX, Architect | Planejamento multi-papel, grilling session |
| Spec | PM | PRD na linguagem do domínio |
| Breakdown | Tech Lead, Architect | Decomposição em issues com role assignment |
| Execute | Frontend, Backend, DBA, DevOps | Implementação paralela |
| Review | QA, Tech Lead | Validação e code review |

## Dependências

```
Plan ──→ Spec ──→ Breakdown ──→ Execute ──→ Review
```

## Artefatos gerados

| Fase | Artefato | Local |
|------|----------|-------|
| Plan | Notas de planejamento | `state.json` → `features[].checkpoints.plan` |
| Spec | PRD | `.product-team/artifacts/<feature>/PRD.md` |
| Breakdown | Issues com role assignment | `.product-team/artifacts/<feature>/feature.json` |
| Execute | PRs | Repositório |
| Review | Relatório de qualidade | `state.json` → `features[].checkpoints.review` |

## Critérios de conclusão

- [ ] Planejamento aprovado (PM + UX + Architect alinhados)
- [ ] PRD escrito e aprovado na linguagem do CONTEXT.md
- [ ] Issues decompostas com dependências e assigned_roles
- [ ] Todos os PRs abertos e revisados
- [ ] QA aprovou contra critérios de aceitação
- [ ] Tech Lead aprovou code review
- [ ] `state.json` atualizado com status final
