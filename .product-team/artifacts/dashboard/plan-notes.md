# Plan Notes — Dashboard do Timovi

## Problema de Negócio
Timovi é invisível — roda 100% dentro do chat do agente de IA (Pi). O usuário não enxerga o time, as fases do pipeline, as issues. Hoje precisa perguntar pro chat o que está acontecendo. O Dashboard resolve isso como camada de observabilidade read-only sobre `.product-team/`.

## Usuário
Founder/dev solo (Zaia) com múltiplos projetos. Usa o Dashboard como "home screen" sempre aberta em janela separada, consulta a qualquer momento (início, meio, fim da sessão). Quando quer agir, volta pro chat do Pi.

## Fluxo do Usuário
1. **Primeiro uso:** `npm install -g timovi-dashboard` → `timovi-dashboard wizard` → file picker nativo → seleciona path do projeto → detecta `.product-team/state.json` → sobe Dashboard
2. **Uso diário:** `timovi-dashboard` → sobe API + frontend → abre navegador → Dashboard com multi-projeto
3. **ANTES de abrir:** Sessão de trabalho no chat do Pi
4. **DEPOIS de olhar:** Volta pro chat para agir (iniciar feature pausada, discutir nova feature)

## Layout (wireframe conceitual)
- **Sidebar esquerda:** Seletor de projetos (até 3 projetos), com expansão por projeto:
  - 📊 Kanban — colunas do pipeline com issues
  - 👥 Time — página dedicada com todas as roles
  - ⚙️ Config — Wizard de reconexão, path do projeto
- **Conteúdo principal:** Varia conforme item selecionado (Kanban ou Time ou Config)
- **Kanban:** Colunas Plan | Spec | Breakdown | Execute | Review, cards de issues com role assignada
- **Time:** Cards com cada role ativa do projeto
- **Topo:** Botão ⚙️ Configurar para Wizard a qualquer momento

## Decisões Técnicas
- Projeto separado: `timovi-dashboard` em `~/projects/timovi-dashboard/`
- Stack: React (frontend) + Node/Express (mini-backend)
- Backend persiste lista de paths dos projetos conectados (`storage/projects.json`)
- Backend lê JSONs do `.product-team/` de cada projeto (read-only)
- Dashboard é SPA — sem reload ao trocar de projeto
- Animações: fade/slide quando feature muda de coluna no Kanban
- Sem notificações por enquanto
- Sem paginação (dados leves)
- Até 3 projetos conectados (começar pequeno)
- Tema: Dark-only, cores do Timovi (Electric Green #00e639)

## Métricas de Sucesso
- Usuário consegue ver o time e as issues sem perguntar pro chat
- Troca entre projetos é instantânea (SPA)
- Wizard de primeiro uso funciona em < 1 minuto

## Out of Scope (v1)
- Bootstrap via Dashboard (continua via chat)
- Notificações
- Drag-and-drop no Kanban
- Edição de issues via Dashboard
- Integração direta com GitHub
