# Workflow: Deploy

Pipeline para deploy de features em produção.

## Papéis envolvidos

| Fase | Papéis | Descrição |
|------|--------|-----------|
| Prep | DevOps | Preparar build, configurar ambiente |
| Approval | Tech Lead | Aprovar deploy |
| Deploy | DevOps | Executar deploy |
| Verify | QA, DevOps | Smoke test, monitoramento |

## Pré-requisitos

- [ ] Todos os PRs da feature aprovados (Review concluído)
- [ ] Migrations de banco revisadas pelo DBA
- [ ] Variáveis de ambiente e secrets configurados
- [ ] Plano de rollback documentado

## Fluxo

### 1. Prep (DevOps)

- Gerar build de produção
- Rodar migrations em staging
- Validar health checks
- Gerar changelog da feature

### 2. Approval (Tech Lead)

- Revisar changelog
- Confirmar que todos os PRs foram aprovados
- Autorizar deploy: ✅ Go / 🔴 Hold

### 3. Deploy (DevOps)

- Executar deploy (com plano de rollback pronto)
- Rodar migrations em produção (se houver)
- Monitorar métricas (erro rate, latency, CPU)

### 4. Verify (QA + DevOps)

- QA: smoke test dos fluxos principais em produção
- DevOps: verificar logs, alertas, métricas por 15 minutos
- Se tudo OK: deploy concluído ✅
- Se anomalia: rollback imediato 🔴

## Artefatos

- Changelog da feature
- Log de deploy (timestamp, duração, status)
- Relatório de smoke test
