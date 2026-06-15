# PRD — Dashboard do Timovi

**Feature:** `dashboard`
**Status:** Em especificação
**Pipeline Phase:** Spec
**Criado:** 2026-06-15
**PM:** Zaia

---

## 1. Problem Statement

### Problema atual

O Timovi opera 100% como um agente de IA dentro do chat (Pi, Claude Code, Cursor, etc.). Toda a estrutura do time — Roles, Pipeline, Fases, Issues, Artefatos — está em arquivos dentro de `.product-team/`, mas é **invisível** para o usuário. Para saber o que está acontecendo, o usuário precisa perguntar ao Orquestrador via chat.

Isso gera atrito:

- **Falta de visibilidade:** O usuário não enxerga quais Roles estão ativas, qual Feature está em andamento, em qual Fase do Pipeline ela está
- **Consulta reativa:** Toda informação exige uma pergunta explícita no chat, interrompendo o fluxo de trabalho
- **Ausência de panorama multi-projeto:** Founders/devs com múltiplos projetos não têm como comparar ou alternar rapidamente entre os times de cada um

### Dores do usuário

| Dor | Impacto |
|-----|---------|
| "Não sei o que o time está fazendo agora" | Precisa perguntar no chat, gera ida e volta |
| "Tenho 3 projetos, cada um com seu time, quero ver todos" | Abrir cada projeto no agente é lento e desconexo |
| "O Pipeline avançou? Quais Issues estão prontas?" | Sem visibilidade, o Pipeline parece uma caixa preta |

### Métricas de sucesso

- Usuário consegue visualizar o Time (Roles ativas) e o Kanban (Issues por Fase do Pipeline) **sem fazer nenhuma pergunta ao Orquestrador**
- Troca entre projetos no Dashboard é **instantânea** (SPA, sem reload)
- Wizard de primeiro uso completa em **menos de 1 minuto**
- Dashboard complementa o chat — **zero atrito** entre abrir o Dashboard e voltar pro agente

---

## 2. Solution

### Visão geral

**`timovi-dashboard`** — Uma aplicação standalone (React + mini-backend Node/Express) que serve como **camada de observabilidade** sobre os Artefatos do `.product-team/`. O Dashboard é read-only: visualiza, não modifica. Toda ação (iniciar Feature pausada, discutir nova Feature) continua sendo feita via Orquestrador no chat do agente de IA.

### Arquitetura de alto nível

```
~/projects/
├── timovi-dashboard/          ← Projeto separado (este PRD)
│   ├── cli/                   ← CLI: wizard de instalação
│   ├── frontend/              ← React SPA (Dashboard UI)
│   └── backend/               ← API server (Node/Express)
│
├── meu-saas/                  ← Projeto 1 (já tem .product-team/)
├── landing-page/              ← Projeto 2 (já tem .product-team/)
└── app-mobile/                ← Projeto 3 (já tem .product-team/)
```

O backend do Dashboard acessa os `.product-team/` de cada projeto conectado via filesystem (read-only). A lista de projetos conectados é persistida em `backend/storage/projects.json`.

### Fluxo de primeiro uso

1. `npm install -g timovi-dashboard`
2. `timovi-dashboard wizard` → CLI interativo
3. File picker nativo → seleciona pasta do projeto
4. CLI detecta `.product-team/state.json` → confirma "Time detectado ✅"
5. Instala a Skill do Timovi no projeto (se necessário)
6. Sobe backend + frontend → abre `http://localhost:5173`

### Fluxo de uso diário

1. `timovi-dashboard` → sobe backend + frontend
2. Abre navegador → Dashboard com projetos já conectados
3. Sidebar com seletor de projetos (até 3), expansível:
   - 📊 **Kanban** — Issues distribuídas nas colunas das Fases do Pipeline
   - 👥 **Time** — Página dedicada com cards de cada Role ativa
   - ⚙️ **Config** — Wizard de reconexão, path do projeto, reconfigure

---

## 3. User Stories

### US-1: Primeiro acesso com Wizard

> Como founder/dev solo, quero conectar meu primeiro projeto ao Dashboard usando um Wizard simples com file picker nativo, para que em menos de 1 minuto eu já veja meu time.

**Critérios de aceitação:**
- Wizard CLI com prompt interativo e file picker nativo
- Detecta automaticamente `.product-team/state.json` na pasta selecionada
- Mostra mensagem de sucesso "Time detectado ✅" com nome do projeto e Roles ativas
- Sobe backend + frontend automaticamente após wizard
- Se `state.json` não for encontrado, mostra mensagem "Nenhum time encontrado. Execute o bootstrap via chat primeiro."

### US-2: Seletor de projetos

> Como founder com múltiplos projetos, quero ver todos meus projetos na sidebar e trocar entre eles com um clique, para alternar rapidamente entre os times.

**Critérios de aceitação:**
- Sidebar esquerda lista projetos conectados (até 3 no MVP)
- Projeto ativo expande com sub-items: Kanban, Time, Config
- Projetos inativos mostram apenas nome (colapsados)
- Ao clicar em outro projeto, o conteúdo principal atualiza com animação de fade/slide
- Botão "+ Adicionar" no fim da lista para conectar novo projeto
- Lista de projetos persiste entre sessões (salva em `storage/projects.json` no backend)

### US-3: Kanban de Features

> Como founder, quero ver um quadro Kanban com as Issues de cada Feature distribuídas nas Fases do Pipeline (Plan → Spec → Breakdown → Execute → Review), para saber exatamente o que está acontecendo.

**Critérios de aceitação:**
- Colunas: Plan | Spec | Breakdown | Execute | Review
- Cada Issue é um card com: título, Roles assignadas (badges)
- Cards usam cor de status: verde (done), azul (in_progress), cinza (pending), vermelho (failed), amarelo (blocked)
- Feature atual é destacada com borda Electric Green
- Quando uma Issue muda de Fase no `feature.json`, o card anima (fade/slide) na atualização
- Features concluídas aparecem na coluna Review com check verde

### US-4: Página do Time

> Como founder, quero ver todos os papéis ativos no projeto em uma página dedicada, para saber exatamente quais Roles compõem meu time.

**Critérios de aceitação:**
- Grid de cards, um por Role ativa (definida em `state.json` → `active_roles`)
- Cada card mostra: nome da Role, ícone representativo, status (ativo)
- Roles são agrupadas por categoria visual (estratégia, engenharia, qualidade, marketing)
- Cards usam o design system do Timovi (Terminal Dark, Electric Green, Geist/Inter/JetBrains Mono)

### US-5: Configuração

> Como founder, quero acessar a tela de configuração de um projeto para reconectar o Dashboard, ver o path do projeto, ou remover um projeto da lista.

**Critérios de aceitação:**
- Acessível via sidebar (⚙️ Config) e via botão no topo (⚙️ Configurar)
- Mostra path do projeto, data de conexão, status do `.product-team/`
- Botão "Reconectar" — reabre Wizard para este projeto
- Botão "Remover" — remove projeto da lista (não deleta arquivos)

---

## 4. Implementation Decisions

### Stack

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| Frontend | React (Vite) | SPA com roteamento, sem reload entre projetos |
| Estilização | Tailwind CSS (CDN) | Consistente com landing page do Timovi |
| Backend | Node.js + Express | Leve, já conhecido, serve JSONs do filesystem |
| CLI | Node.js (inquirer) | File picker nativo, compatível com npm global |
| Persistência | JSON em arquivo (`storage/projects.json`) | Sem banco de dados, dados leves |
| Tema | Terminal Dark (Timovi Design System) | Dark-only, Electric Green (#00e639), Geist/Inter/JetBrains Mono |

### Decisões arquiteturais

| Decisão | Motivo |
|---------|--------|
| Dashboard é read-only | Evita conflito de escrita com o Orquestrador. O chat do Pi é a única via de modificação |
| Projeto separado (`timovi-dashboard`) | Desacoplado do template de skills. `.product-team/` é consumido, não modificado |
| Mini-backend em vez de HTML puro | Necessário para persistir lista de projetos, acessar filesystem, e servir JSONs de múltiplos paths |
| React em vez de HTML vanilla | Layout com sidebar + routing + animações de transição entre projetos seria complexo em vanilla |
| `npm install -g` como distribuição | Mesmo ecossistema do Timovi (`npx skills`). Instalação simples e familiar |
| Sem banco de dados | Escopo do MVP: até 3 projetos, dados já estão em arquivos JSON no disco |

### Estrutura de diretórios (target)

```
timovi-dashboard/
├── package.json                 ← "timovi-dashboard" v1.0.0
├── cli/
│   ├── index.js                 ← Entry point CLI
│   └── wizard.js                ← Fluxo do Wizard
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── App.tsx              ← Router SPA
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── Sidebar.tsx       ← Seletor de projetos + navegação
│   │   │   ├── ProjectSelector.tsx
│   │   │   ├── TeamGrid.tsx      ← Grid de Roles
│   │   │   ├── RoleCard.tsx      ← Card individual de Role
│   │   │   ├── KanbanBoard.tsx   ← Colunas do Pipeline
│   │   │   ├── KanbanColumn.tsx  ← Uma Fase do Pipeline
│   │   │   ├── IssueCard.tsx     ← Card de Issue
│   │   │   └── ConfigPanel.tsx   ← Painel de configuração
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx     ← Página Kanban
│   │   │   ├── Team.tsx          ← Página do Time
│   │   │   └── Config.tsx        ← Página de Config
│   │   ├── hooks/
│   │   │   └── useProject.ts     ← Hook de dados do projeto (fetch API)
│   │   └── styles/
│   │       └── index.css         ← Tailwind + tema Terminal Dark
│   └── ...
├── backend/
│   ├── package.json
│   ├── server.js                 ← Express server
│   ├── routes/
│   │   ├── projects.js           ← CRUD de projetos conectados
│   │   └── state.js              ← Lê .product-team/ do projeto
│   └── storage/
│       └── projects.json         ← Persiste lista de paths
└── README.md
```

### API Endpoints (backend)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/projects` | Lista projetos conectados |
| `POST` | `/api/projects` | Adiciona projeto (body: `{ path }`) |
| `DELETE` | `/api/projects/:id` | Remove projeto da lista |
| `GET` | `/api/projects/:id/state` | Lê e retorna `state.json` do projeto |
| `GET` | `/api/projects/:id/feature` | Lê e retorna `feature.json` da feature atual |

---

## 5. Testing Decisions

### O que testar

| Tipo | Foco |
|------|------|
| **Wizard** | File picker funciona em macOS/Linux/Windows? Detecta `state.json` corretamente? Mensagens de erro claras? |
| **API** | Responde com dados corretos? Lida com path inválido? JSON malformado retorna erro 500 com mensagem? |
| **Kanban** | Cards renderizam na coluna correta? Animação dispara ao mudar status? Coluna vazia mostra "Nenhuma Issue"? |
| **Time** | Todas as Roles de `active_roles` aparecem? Roles são agrupadas corretamente? |
| **Seletor** | Trocar projeto atualiza UI sem reload? Projeto sem `.product-team/` mostra erro no card? |
| **Persistência** | Projetos adicionados sobrevivem a restart do servidor? |

### O que NÃO testar (v1)

- Testes E2E automatizados (Cypress/Playwright) — escopo futuro
- Testes de performance com 50+ projetos
- Testes de acessibilidade (WCAG)

### Responsabilidades de QA

- QA Engineer revisa cada User Story contra os critérios de aceitação
- Happy path + edge cases (path inválido, JSON corrompido, projeto sem feature ativa)
- Report: ✅ approved / 🟡 approved with caveats / 🔴 rejected

---

## 6. Out of Scope (v1)

| Item | Motivo |
|------|--------|
| Bootstrap via Dashboard | Bootstrap continua via chat do Orquestrador |
| Drag-and-drop no Kanban | Complexidade alta, valor baixo para v1 |
| Edição de Issues via Dashboard | Dashboard é read-only; ação via chat |
| Notificações (toast, push, email) | Postergado para não poluir MVP |
| Integração com GitHub (PRs, commits) | Adiciona superfície de API externa |
| Autenticação / multi-usuário | Timovi é single-user |
| Tema claro | Terminal Dark-only, consistente com Design System |
| Mobile / responsivo | Dashboard é desktop-only (janela separada) |
| Métricas / analytics | Prematuro antes de validar uso |
| Internacionalização | Interface segue `chat_language` do `state.json` — pt-BR inicial |
| Instalação do Timovi via Dashboard | `timovi-dashboard` conecta projetos existentes, não cria |
| Suporte a mais de 3 projetos | MVP começa com 3 |
| Paginação no Kanban | Dados leves, sem necessidade no MVP |
| Modo offline | Sempre precisa do backend rodando para acessar filesystem |
