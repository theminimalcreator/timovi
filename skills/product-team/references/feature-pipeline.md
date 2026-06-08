# Feature Pipeline — Ciclo de Desenvolvimento

Este documento descreve o pipeline de 5 fases para desenvolver features
com o time de produto. É ativado quando `.product-team/state.json` tem `phase: "ready"`.

---

## Ao iniciar uma nova feature

Leia `.product-team/state.json`:

**Se `current_feature` for `null`:**
→ O time está ocioso. Apresente:

> "Time pronto. Você quer:
> 1. **Nova feature** — pipeline completo (Plan → Spec → Breakdown → Execute → Review)
> 2. **Importar PRD** — pular para Breakdown com um PRD existente
> 3. **Ver status** — listar features concluídas e pendentes"

**Se o usuário escolher opção 2 (importar PRD):**

Pergunte:

> "Onde está o PRD? Me dê o caminho do arquivo."

Após receber o caminho:
1. Leia o arquivo PRD
2. Extraia o nome da feature do conteúdo (ou peça para o usuário nomear)
3. Crie `.product-team/artifacts/<feature-name>/`
4. Copie o PRD para `PRD.md`
5. Crie `feature.json` com `prd.source: "imported"` e `pipeline_phase: "breakdown"`
6. Atualize `.product-team/state.json` → `current_feature: "<name>"`
7. Pergunte: "PRD importado. Quer pular direto para Breakdown ou revisar o planejamento primeiro?"
   - Se **Breakdown**: vá para Fase 3
   - Se **revisar**: execute Fase 1 (Plan) com o PRD como contexto

**Se `current_feature` estiver definido:**
→ Uma feature está em andamento. Apresente o progresso e sugira retomar.

Leia `.product-team/artifacts/<feature>/feature.json` para mostrar status:

> "📊 **Feature: [nome]** — Fase: [pipeline_phase]"
> "Issues: [N] total, [X] done, [Y] in_progress, [Z] blocked, [W] pending"
> "Continuar?"

---

## Fase 1 — PLAN (Planejamento Multi-papel)

**Objetivo:** Extrair o domínio da feature, stress-testar o plano, alinhar
PM, UX e Architect.

### 1.1 Ativar multi-role grilling

Diga:

> "Iniciando a **Fase 1 — Plan**. Vou ativar PM, UX Designer e Software Architect
> para uma sessão de planejamento.
>
> Cada um fará perguntas do seu ângulo. Vamos uma pergunta por vez."

Carregue `.product-team/knowledge/CONTEXT.md`, `.product-team/knowledge/ARCHITECTURE.md`.

Os 3 papéis fazem perguntas alternadas. O orquestrador controla o turno.
Cada papel faz **1 pergunta por rodada** e aguarda resposta antes do próximo.

### 1.2 Rounds de perguntas

**Round 1 — PM:**
> "Qual problema de negócio esta feature resolve? Quem é o usuário impactado
> e qual métrica define sucesso?"

**Round 2 — UX:**
> "Em que momento o usuário usa isso? O que ele está fazendo imediatamente
> ANTES e DEPOIS de interagir com esta feature?"

**Round 3 — Architect:**
> "Esta feature toca quais módulos existentes? Precisa de nova tabela,
> novo endpoint, nova integração?"

Continue alternando até 3 rounds (9 perguntas no total) ou até o usuário
indicar que o plano está claro.

### 1.3 Síntese

Ao final, resuma:

> " Resumo do planejamento:"
> - Problema: [resumo PM]
> - Usuário e fluxo: [resumo UX]
> - Impacto técnico: [resumo Architect]
>
> "Passamos para a Fase 2 — Spec (PRD)?"

### 1.4 Checkpoint

Salve em `.product-team/state.json` → `features[].checkpoints.plan`.

---

## Fase 2 — SPEC (PRD)

**Objetivo:** Sintetizar o planejamento em um PRD na linguagem do domínio.

### 2.1 Criar feature directory

Crie a estrutura:
```
.product-team/artifacts/<feature-name>/
├── feature.json    ← criado agora
├── PRD.md          ← será escrito
└── plan-notes.md   ← notas da Fase 1
```

Inicialize `feature.json`:
```json
{
  "name": "<feature-name>",
  "status": "in_progress",
  "pipeline_phase": "spec",
  "prd": { "source": "generated", "imported_from": null },
  "issues": []
}
```

### 2.2 Ativar Product Manager

Diga:

> "Iniciando a **Fase 2 — Spec**. O Product Manager vai sintetizar o
> planejamento em um PRD."

Ative o papel `product-manager` (leia `.agents/skills/product-team/roles/product-manager/SKILL.md`).

O PM deve:
1. Usar a linguagem do CONTEXT.md em todo o PRD
2. Referenciar módulos da ARCHITECTURE.md
3. Respeitar ADRs existentes
4. Seguir o template PRD (Problem Statement, Solution, User Stories,
   Implementation Decisions, Testing Decisions, Out of Scope)
5. Escrever o PRD em `.product-team/artifacts/<feature-name>/PRD.md`

### 2.3 Revisão e aprovação

Apresente o PRD e pergunte:

> "O PRD está aprovado? Quer ajustar algo antes de decompor em issues?"

### 2.4 Salvar checkpoint

Atualize `.product-team/artifacts/<feature-name>/feature.json`:
- `pipeline_phase: "breakdown"`
- `prd.path`, `prd.created_at`
- `updated_at`

---

## Fase 3 — BREAKDOWN (Decomposição em Issues)

**Objetivo:** Quebrar o PRD em issues verticais com role assignment.

### 3.1 Ativar Tech Lead + Architect

Diga:

> "Iniciando a **Fase 3 — Breakdown**. Tech Lead e Architect vão decompor
> o PRD em issues executáveis."

Ative `tech-lead` e `software-architect` (leia as skills).

### 3.2 Decomposição

Leia `.product-team/artifacts/<feature-name>/PRD.md`.

Siga o pattern do `to-issues`:
- Cada issue é um slice vertical (atravessa todas as camadas)
- Issues são AFK (auto-executáveis) ou HITL (precisam de decisão humana)
- Prefira AFK

**Além disso, cada issue ganha `assigned_roles`:**

| Se a issue toca... | Assigned roles |
|-------------------|----------------|
| Schema, migrations, queries | `["backend-engineer", "dba"]` |
| API endpoints, serviços | `["backend-engineer"]` |
| UI, componentes, páginas | `["frontend-engineer"]` |
| Testes, aceitação | `["quality-engineer"]` |
| CI/CD, deploy, infra | `["devops"]` |
| Múltiplas camadas | `["backend-engineer", "frontend-engineer"]` |

### 3.3 Salvar issues no feature.json

Atualize `.product-team/artifacts/<feature-name>/feature.json`:

```json
{
  "issues": [
    {
      "id": "ISSUE-1",
      "title": "Schema: workout_plans table",
      "status": "pending",
      "assigned_roles": ["backend-engineer", "dba"],
      "blocked_by": []
    },
    {
      "id": "ISSUE-2",
      "title": "API: CRUD workout plans",
      "status": "pending",
      "assigned_roles": ["backend-engineer"],
      "blocked_by": ["ISSUE-1"]
    }
  ],
  "pipeline_phase": "execute",
  "updated_at": "<timestamp>"
}
```

Consulte `references/feature-schema.md` para o schema completo.

### 3.4 Review da decomposição

Apresente a lista numerada e pergunte:

> "As issues fazem sentido? A granularidade está boa? As dependências
> estão corretas?"

### 3.4 Salvar

As issues estão salvas em `feature.json` — nada a publicar externamente


### 3.5 Checkpoint

Salve em `.product-team/state.json`:
- `features[].checkpoints.breakdown`
- `features[].issues` (array completo com IDs, títulos, dependências, roles)

---

## Fase 4 — EXECUTE (Execução Paralela)

**Objetivo:** Executar as issues em paralelo, respeitando dependências.

### 4.1 Construir o DAG

Com base nas issues e seus `blocked_by`, construa o grafo de dependências.

Diga:

> "Iniciando a **Fase 4 — Execute**."
>
> "DAG de execução:"
> - **Round 1 (sem blockers):** [N] issues — [liste]
> - **Round 2 (após Round 1):** [N] issues — [liste]
> - **Round 3 (após Round 2):** [N] issues — [liste]
>
> "Vou executar round por round. Issues dentro do mesmo round rodam em paralelo."

### 4.2 Executar rounds

Para cada round:

1. Para cada issue no round, spawne um subagent.
   O prompt deve incluir instruções para o agente:

   > "Você é o papel [assigned_roles] no time CDT.
   >
   > 1. Carregue a base de conhecimento:
   >    - `.product-team/knowledge/CONTEXT.md`
   >    - `.product-team/knowledge/ARCHITECTURE.md`
   >    - `.product-team/knowledge/STACK.md`
   >    - `.product-team/knowledge/CONVENTIONS.md`
   >    - `.product-team/knowledge/best-practices/INDEX.md`
   >    - `.product-team/playbooks/[role]/INDEX.md`
   >
   > 2. Leia `.product-team/artifacts/<feature>/feature.json`
   >    Sua issue: **[ISSUE-X]** — [título]
   >
   > 3. Atualize `feature.json`: status → `in_progress`, `started_at`, `agent_id`
   >
   > 4. Implemente a issue seguindo as convenções e boas práticas
   >
   > 5. Ao concluir, atualize `feature.json`:
   >    - `status`: `done`
   >    - `pr_url`: URL do PR
   >    - `completed_at`: timestamp
   >
   > 6. Se falhar, atualize `feature.json`:
   >    - `status`: `failed`
   >    - `notes`: descrição do erro"

2. Monitore progresso lendo `feature.json` periodicamente
3. Quando todas as issues do round concluírem, avance

### 4.3 Relatório de execução

Leia `feature.json` e apresente:

> "✅ **Execução concluída:**"
> - [N]/[N] issues implementadas
> - [N] PRs abertos: [liste]
> - [N] issues com ressalvas: [liste]

### 4.4 Checkpoint

Atualize `feature.json`:
- `pipeline_phase: "review"`
- `updated_at`

Não precisa atualizar `.product-team/state.json` — o `feature.json` é a fonte da verdade.

---

## Fase 5 — REVIEW (Revisão e Qualidade)

**Objetivo:** Revisar código, testar aceitação, garantir qualidade.

### 5.1 Ativar QA Engineer + Tech Lead

Diga:

> "Iniciando a **Fase 5 — Review**. QA Engineer e Tech Lead vão revisar."

Ative `quality-engineer` e `tech-lead`.

### 5.2 QA Review

QA Engineer:
- Revisa cada PR contra os critérios de aceitação da issue
- Testa happy path, alternativo, edge cases
- Reporta: ✅ aprovado / 🟡 aprovado com ressalvas / 🔴 rejeitado

### 5.3 Tech Lead Review

Tech Lead:
- Revisa código: padrões, ADRs, convenções
- Verifica cobertura de testes
- Reporta: ✅ aprovado / 🔴 solicita mudanças

### 5.4 Relatório final

Leia `feature.json` e apresente:

> "📊 **Review concluído:**"
> - ✅ [N] PRs aprovados
> - 🟡 [N] PRs com ressalvas menores
> - 🔴 [N] PRs que precisam de ajuste
>
> "Feature **[nome]** — status final: [aprovada / pendente]"

### 5.5 Checkpoint final

Atualize `feature.json`:
- `status: "done"` (ou `"paused"` se houver pendências)
- `pipeline_phase: null`
- `updated_at`

Atualize `.product-team/state.json`:
- `current_feature: null` (time liberado para próxima feature)

---

## Checkpoint preventivo entre fases

Após cada fase concluída, ofereça pausa se a sessão estiver longa:

> "[Nome], a **[fase atual]** terminou e o checkpoint está salvo.
> A próxima fase é a **[próxima fase]**. Você quer:
>
> 1. Continuar agora
> 2. Pausar aqui, digitar `/clear` e voltar com `product-team` em
>    uma sessão nova (recomendado se a sessão já está longa)
>
> Pressione 1, 2, ou digite CONTINUAR para opção 1."

**Não ofereça este prompt logo após uma retomada de sessão.** A sessão já
está limpa. O prompt só vale depois que uma fase produziu trabalho real
dentro da sessão atual.
