<p align="center">
  <img src="assets/banner.svg" alt="Timovi — Seu time digital de produto" width="100%">
</p>

<p align="center">
  <a href="https://skills.sh"><img src="https://img.shields.io/badge/dispon%C3%ADvel%20em-skills.sh-FFD700?style=for-the-badge" alt="Disponível em skills.sh"></a>
  <a href="https://github.com/theminimalcreator/timovi/blob/main/LICENSE"><img src="https://img.shields.io/badge/Licen%C3%A7a-MIT-green?style=for-the-badge" alt="Licença: MIT"></a>
  <a href="https://github.com/vercel-labs/skills"><img src="https://img.shields.io/badge/Feito%20para-npx%20skills-000?style=for-the-badge&logo=npm" alt="Feito para npx skills"></a>
</p>

<p align="center">
  [English](README.md) | [Português](README.pt.md) | [Español](README.es.md)
</p>

# Timovi

**Monte um time digital de produto dentro do seu agente de código com IA.** Um comando, todo o seu pipeline de produto — Product Manager, UX Designer, Software Architect, Tech Lead, Engineers, QA e mais.

> Se o Claude Code é um dev solo, **o Timovi é o time de produto inteiro.**

```bash
npx skills add theminimalcreator/timovi --skill timovi
```

<br>

---

## O Timovi é pra você?

- ✅ Você é um **founder solo ou dev indie** lançando side projects
- ✅ Você usa **agentes de código com IA** (Claude Code, Cursor, Pi, Codex, OpenCode) e eles são ótimos — mas falta algo
- ✅ Você começa projetos rápido, mas **demora pra finalizar** — os últimos 20% levam 80% do tempo
- ✅ Você sabe que **UX importa**, mas nunca sobra tempo
- ✅ Você já tentou ferramentas pesadas de orquestração (OpenClaw, Paperclip) e pensou: **"isso é complexo demais, cadê a entrega?"**
- ✅ Você quer um **time de produto leve e opinativo** — não um framework de agentes genérico

<br>

---

## O que o Timovi te entrega

| Role | O que faz |
|------|-------------|
| 🎯 **Product Manager** | Define o que construir, escreve PRDs, prioriza. Chega de "será que estou construindo a coisa certa?" |
| 🎨 **UX Designer** | Personas, fluxos, wireframes. UX que você mesmo faria se tivesse tempo. |
| 🏗️ **Software Architect** | Valida viabilidade, documenta decisões, mapeia impacto nos módulos. |
| 👨‍💻 **Tech Lead** | Quebra features em issues, coordena execução, revisa código. |
| ⚛️ **Frontend Engineer** | Componentes, páginas, gerenciamento de estado. |
| 🖥️ **Backend Engineer** | APIs, serviços, lógica de negócio. |
| 🗄️ **DBA** | Modelagem de schema, queries, índices, migrações. |
| ✅ **QA Engineer** | Testes, critérios de aceite, edge cases. |
| 📣 **Head of Marketing** | Posicionamento, mensagem, go-to-market. |
| 🚀 **DevOps** | CI/CD, deploy, infraestrutura. |

**Todos conversando entre si, todos compartilhando o mesmo contexto sobre o seu projeto.**

<br>

---

## Como funciona

```
Você diz "timovi"
        │
        ▼
   ┌─────────┐     ┌──────┐     ┌───────────┐     ┌─────────┐     ┌────────┐
   │  PLAN   │ ──→ │ SPEC │ ──→ │ BREAKDOWN │ ──→ │ EXECUTE │ ──→ │ REVIEW │
   │ PM+UX   │     │  PM  │     │ Tech Lead │     │Eng+QA   │     │QA+TL   │
   │+Arch    │     │      │     │ +Arch     │     │         │     │        │
   └─────────┘     └──────┘     └───────────┘     └─────────┘     └────────┘
        │               │              │                │               │
        ▼               ▼              ▼                ▼               ▼
   Notas de       PRD.md        Issues +      Pull Requests    Aprovado
   planejamento                 feature.json                   & merge
```

**Cada fase produz uma entrega concreta.** Você sempre sabe exatamente o que foi feito e o que vem a seguir.

<br>

---

## Início Rápido

### 1. Instale

```bash
npx skills add theminimalcreator/timovi --skill timovi
```

Funciona com **Pi, Claude Code, Cursor, Codex, OpenCode e [mais de 60 agentes](https://github.com/vercel-labs/skills#supported-agents).**

### 2. Ative

Abra seu agente de IA e digite:

```
timovi
```

### 3. Bootstrap (5 minutos)

O orquestrador vai fazer algumas perguntas sobre seu projeto — nome, stack, domínio. Ele detecta automaticamente sua codebase, gera uma base de conhecimento (linguagem de domínio, mapa de arquitetura, docs da stack, convenções) e ativa seu time.

### 4. Comece uma feature

```
timovi → "new feature"
```

Escolha uma feature. O pipeline roda. Você responde perguntas (uma de cada vez), aprova artefatos e vê seu time construir.

### 5. Mantenha-se atualizado

Quando o Timovi tiver novas features ou correções, atualize com um comando:

```bash
npx skills update timovi
```

> **Usuários de symlink** (recomendado durante a instalação) recebem atualizações instantaneamente — `npx skills update` só executa `git pull` no clone do Timovi. **Usuários de cópia** recebem os arquivos mais recentes recopiados. Em ambos os casos, sua instância `.product-team/` nunca é tocada.

<br>

---

## Sem Timovi vs Com Timovi

| Sem Timovi | Com Timovi |
|---------------|------------|
| ❌ "Preciso de UX mas não tenho tempo" | ✅ UX Designer é uma Role dedicada — fluxos, personas, wireframes, feito |
| ❌ "O que devo construir primeiro?" | ✅ Product Manager escreve PRDs, prioriza, define escopo |
| ❌ Código espaguete, sem arquitetura | ✅ Software Architect valida viabilidade, mapeia módulos |
| ❌ Bugs encontrados após o lançamento | ✅ QA Engineer testa happy path + edge cases antes de você publicar |
| ❌ Escrevendo prompts, gerenciando contexto, perdendo o fluxo | ✅ Orquestrador roda o pipeline. Você aprova artefatos. |
| ❌ 5 side projects, 0 finalizados | ✅ Pipeline força momentum: Plan → Spec → Breakdown → Execute → Review |
| ❌ "Isso tá pronto pra lançar?" | ✅ Fase de Review: aprovação QA + code review do Tech Lead = publique com confiança |

<br>

---

## O que torna o Timovi diferente

| | OpenClaw / Hermes | Paperclip | **Timovi** |
|---|:---:|:---:|:---:|
| **Foco** | Agente de IA genérico | Plataforma de orquestração de agentes | **Time de produto para builders** |
| **Tempo de setup** | 30+ min config | Servidor + UI React | **1 comando, 5 min bootstrap** |
| **Entregas** | Agente executa comandos | Tasks + budgets | **PRD → Issues → PRs → Review** |
| **Role de UX** | — | — | **UX Designer dedicado** |
| **Curva de aprendizado** | Alta | Alta | **Guiado — uma pergunta por vez** |
| **Pra quem** | Power users | Empresas | **Founders solo & devs indie** |

<br>

---

## Agentes Compatíveis

O Timovi funciona com qualquer agente compatível com o [npx skills](https://github.com/vercel-labs/skills). Principais testados:

| Agente | Caminho de instalação |
|-------|-------------|
| **Pi** | `.pi/skills/timovi/` |
| **Claude Code** | `.claude/skills/timovi/` |
| **Cursor** | `.agents/skills/timovi/` |
| **Codex** | `.agents/skills/timovi/` |
| **OpenCode** | `.agents/skills/timovi/` |

<br>

---

## Por Dentro

O Timovi é um **meta-framework de agent skills** — Markdown + JSON, sem runtime, sem servidores.

```
skills/timovi/
├── SKILL.md                 ← Orquestrador (você está aqui)
├── references/
│   ├── bootstrap.md         ← Fluxo de setup inicial
│   ├── feature-pipeline.md  ← Ciclo de desenvolvimento em 5 fases
│   ├── state-schema.md      ← Formato do estado persistente
│   └── role-skill-template.md
├── roles/                   ← 10 agentes especialistas
│   ├── product-manager/SKILL.md
│   ├── ux-designer/SKILL.md
│   └── ...
└── workflows/               ← Templates de Workflow
    ├── new-feature.md
    ├── bug-fix.md
    └── deploy.md
```

**Comportamento em runtime:**
- Cada Role carrega o **Layer 0** (base de conhecimento do projeto) antes de agir
- O orquestrador salva **checkpoints** após cada fase — retome entre sessões
- Issues são executadas como um **DAG** com rounds paralelos, respeitando dependências
- Todos os dados específicos do projeto ficam em `.product-team/` — nunca toca o template

<br>

---

## Comunidade

- 🔍 Descubra mais skills em **[skills.sh](https://skills.sh)**
- 🛠️ Feito para o ecossistema **[npx skills](https://github.com/vercel-labs/skills)**
- 🐛 [Issues & pedidos de features](https://github.com/theminimalcreator/timovi/issues)
- ⭐ Dê estrela no repo se o Timovi te ajuda a publicar

<br>

---

## Inspirações

Projetos e ideias que inspiraram o Timovi:

- **[Reversa](https://github.com/theminimalcreator/timovi/blob/main/AGENTS.md)** — Um framework de engenharia reversa que provou que agentes de IA conseguem analisar e documentar codebases existentes de forma sistemática. O Reversa mostrou que workflows de agentes estruturados e baseados em fases produzem resultados confiáveis.
- **[Vercel Skills](https://github.com/vercel-labs/skills)** — O ecossistema aberto de agent skills que tornou a distribuição de skills trivial. Sem o `npx skills`, o Timovi seria uma instalação manual.
- **[Paperclip](https://github.com/paperclipai/paperclip)** — Mostrou que "times de produto virtuais" eram a abstração certa — só que pesada demais para founders solo. O Timovi é a resposta leve.
- **[Hermes Agent](https://github.com/NousResearch/hermes-agent)** — Demonstrou que agent skills podiam se auto-aperfeiçoar. O padrão de cross-examination do Timovi foi inspirado no loop de aprendizado do Hermes.
- **A experiência do founder solo** — Todo dev indie que faz malabarismo com 5 side projects, nunca tem tempo pra UX e queria ter um time. O Timovi existe porque construir sozinho não deveria significar construir sem estrutura.

<br>

---

## Licença

MIT — veja [LICENSE](LICENSE).

Criado por [@theminimalcreator](https://github.com/theminimalcreator).
