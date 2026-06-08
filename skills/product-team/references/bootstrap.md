# Bootstrap — Inicialização do Product Team

Este documento descreve o fluxo de primeira execução. Siga cada seção em ordem.
Faça **uma pergunta por vez**. Não avance sem resposta do usuário.

---

## Fase 0 — Boas-vindas

Diga:

> "👋 Olá! Vou configurar seu time de produto.
>
> Vou fazer algumas perguntas para construir a base de conhecimento do projeto
> e montar o time com os papéis certos. No final, você terá um time completo
> de agentes especialistas no seu produto.
>
> Vamos começar?"

Aguarde confirmação.

---

## Fase 1 — Identidade do Projeto

### 1.1 Nome do usuário

Pergunte:

> "Qual é o seu nome?"

Salve em `.product-team/state.json` → `user_name`.

### 1.2 Idioma

Pergunte:

> "Em qual idioma prefere que o time se comunique com você?"
>
> Exemplos: `pt-br`, `en-us`, `es`

Salve em `.product-team/state.json` → `chat_language`.

### 1.3 Nome do projeto

Pergunte:

> "Qual é o nome do produto?"

Salve em `.product-team/state.json` → `project`.

### 1.4 Descrição em uma frase

Pergunte:

> "Descreva seu produto em uma frase. Qual problema ele resolve e para quem?"

Salve em `.product-team/state.json` → `description`.

---

## Fase 2 — Detecção do Terreno

### 2.1 Código existente?

Explore o diretório atual. Ignore node_modules, .git, dist, build, coverage.

Se encontrar código-fonte (`.ts`, `.js`, `.py`, `.go`, `.rb`, `.java`, `.dart`, etc.):

Diga:

> "🔍 Encontrei código-fonte no projeto. Isso significa que o produto já existe,
> certo? Vou analisar a estrutura para construir a base de conhecimento."

Prossiga para **Fase 3A (projeto com código)**.

Se NÃO encontrar código-fonte:

Pergunte:

> "Este é um produto novo (sem código ainda) ou o código está em outro lugar?"

- Se **novo**: Prossiga para **Fase 3B (projeto novo)**
- Se **outro lugar**: Pergunte o caminho e explore lá. Depois siga para Fase 3A ou 3B conforme apropriado.

---

## Fase 3A — Projeto com Código Existente

### Passo 1: Análise da estrutura

Explore a estrutura de pastas. Identifique:

- **Linguagens e frameworks** (package.json, Cargo.toml, go.mod, requirements.txt, pubspec.yaml, etc.)
- **Estrutura de módulos** (pastas principais, entry points)
- **Banco de dados** (migrations, schema, ORM config)
- **APIs e integrações** (rotas, clients HTTP, message queues)

### Passo 2: Sugerir STACK.md

Com base na análise, gere `.product-team/knowledge/STACK.md`:

```markdown
# Stack Tecnológica — [PROJETO]

## Frontend
- **Framework:** [React / Next.js / Vue / Flutter / etc.]
- **Linguagem:** [TypeScript / JavaScript / Dart / etc.]
- **Estilo:** [Tailwind / CSS Modules / Styled Components / etc.]
- **Gerenciamento de estado:** [Zustand / Redux / Context / etc.]

## Backend
- **Runtime:** [Node.js / Python / Go / Java / etc.]
- **Framework:** [Express / NestJS / FastAPI / Spring / etc.]
- **ORM:** [Prisma / TypeORM / SQLAlchemy / etc.]

## Banco de Dados
- **SGBD:** [PostgreSQL / MySQL / MongoDB / SQLite / etc.]
- **Migrations:** [Prisma / Flyway / Alembic / etc.]

## Infraestrutura
- **Hosting:** [Vercel / AWS / Railway / VPS / etc.]
- **CI/CD:** [GitHub Actions / GitLab CI / etc.]
- **Containerização:** [Docker / Kubernetes / none]

## Dependências-chave
- [liste 5-10 dependências principais]
```

Apresente o rascunho e pergunte:

> " Detectei esta stack. Confere ou quer ajustar algo?"

### Passo 3: Sugerir CONTEXT.md

Analise o código em busca de entidades de domínio. Procure por:
- Models/entities (classes, interfaces, tipos)
- Tabelas do banco (schema.prisma, migrations)
- Enums, constantes de domínio
- Termos recorrentes em nomes de arquivos e funções

Para cada entidade candidata, identifique:
1. **Nome canônico** (como o negócio chama)
2. **Nome no código** (classe, tabela, tipo)
3. **Descrição breve**
4. **Sinônimos a evitar**

Gere `.product-team/.product-team/knowledge/CONTEXT.md` usando o template:

```markdown
# [NOME DO PRODUTO]

[Descrição em uma frase]

## Language

**[Entidade 1]** (Entity):
Descrição clara. No código, identificado como `NomeClasse` ou `nome_tabela`.
_Avoid_: Sinônimo1, Sinônimo2

**[Entidade 2]** (Entity):
Descrição clara. No código, identificado como `NomeClasse` ou `nome_tabela`.
_Avoid_: Sinônimo1, Sinônimo2

## Example dialogue

**Dev:** "[pergunta comum de um dev novo]"

**Domain expert:** "[resposta usando os termos do domínio]"
```

**IMPORTANTE:** Não tente ser exaustivo. Liste as **5-10 entidades mais importantes**.
O CONTEXT.md cresce com o tempo. O objetivo é ter uma base sólida, não perfeita.

Apresente o rascunho e pergunte:

> "📖 Sugeri estas entidades de domínio com base no código. Confere? Quer
> renomear alguma, adicionar ou remover?"

Itere até o usuário aprovar.

### Passo 4: Sugerir ARCHITECTURE.md

Com base na estrutura de pastas e imports, gere `.product-team/knowledge/ARCHITECTURE.md`:

```markdown
# Arquitetura — [PROJETO]

## Estrutura de Módulos

| Módulo | Caminho | Responsabilidade |
|--------|---------|-----------------|
| [nome] | `apps/ou/packages/nome/` | [o que faz] |

## Fluxo de Dados

[Descreva como os dados fluem entre os módulos principais]

## Entry Points

| Entry Point | Arquivo | Descrição |
|-------------|---------|-----------|
| API | `apps/api/src/main.ts` | Servidor backend |
| Web | `apps/web/src/app/layout.tsx` | Frontend |
| Worker | `apps/worker/src/index.ts` | Processamento assíncrono |

## Integrações Externas

| Serviço | Propósito | Onde está configurado |
|---------|-----------|----------------------|
| [nome] | [o que faz] | [arquivo de config] |

## Padrões Arquiteturais

- [ex: Monorepo com Turborepo]
- [ex: API REST com controllers → services → repositories]
- [ex: Frontend com App Router, Server Components]
```

Apresente e pergunte:

> "🏗️ Este é o mapa da arquitetura que detectei. Confere?"

### Passo 5: CONVENTIONS.md

Gere um esboço inicial (pode ser mínimo):

```markdown
# Convenções — [PROJETO]

## Código
- [preencher conforme análise do código existente]

## Testes
- [preencher conforme padrão encontrado]

## Git
- [preencher conforme histórico]

> ⚠️ Este arquivo será refinado ao longo do tempo conforme o time trabalha.
```

Diga:

> "📐 Criei um esboço de convenções. Ele será refinado conforme o time
> produz código."

---

## Fase 3B — Projeto Novo (sem código)

### Passo 1: Entrevista de domínio

Explique:

> "Como o produto é novo, vou fazer algumas perguntas para extrair o domínio.
> Pense em voz alta — eu organizo."

Faça as perguntas **uma por vez**:

1. > "Quem são os usuários do produto? Liste os tipos de pessoa que interagem com ele."

2. > "Qual é a principal 'coisa' que o produto gerencia? (Ex: pedidos, treinos, reservas, documentos)"

3. > "Quais são as 3-5 ações principais que os usuários fazem?"

4. > "Existem regras de negócio que, se implementadas errado, quebram tudo?"

5. > "O produto se integra com algum serviço externo? (Pagamento, email, storage, etc.)"

Com as respostas, gere `.product-team/.product-team/knowledge/CONTEXT.md` e apresente para aprovação.

### Passo 2: Escolha de stack

Pergunte:

> "Qual stack você quer usar? Se não tiver certeza, posso sugerir com base
> no tipo de produto."
>
> Sugestões comuns:
> - **SaaS B2B:** Next.js + TypeScript + PostgreSQL + Prisma
> - **Mobile-first:** Flutter + Firebase/Supabase
> - **API-first:** NestJS + PostgreSQL + Redis
> - **Landing page / Marketing:** Astro + Tailwind
> - **Outra:** me diga qual

Gere `.product-team/knowledge/STACK.md`.

### Passo 3: Arquitetura inicial

Com base no domínio e stack, sugira uma arquitetura inicial.

Pergunte:

> "O produto é um monolito bem estruturado ou vai nascer como
> microsserviços/monorepo?"

Gere `.product-team/knowledge/ARCHITECTURE.md` com uma estrutura sugerida.

---

## Fase 3.5 — Best Practices Research

**Objetivo:** Para cada tecnologia da stack, buscar boas práticas e padrões
consolidados. Isso faz o time codar seguindo padrões reais da comunidade,
não achismos.

### Passo 1: Identificar tecnologias-chave

Leia `.product-team/knowledge/STACK.md`. Extraia a lista de tecnologias que
merecem pesquisa. Priorize:

| Categoria | Exemplos |
|-----------|----------|
| Frameworks | Next.js, Fastify, Expo, React Native |
| Bancos/Backend | Supabase, PostgreSQL, Prisma |
| Estilo/UI | Tailwind CSS, Radix UI, NativeWind |
| Integrações | Stripe, Resend, Sentry |
| Testes | Vitest, Jest, Detox, Playwright |
| Infra/DevOps | Docker, Traefik, GitHub Actions |

Diga:

> "🔍 Identifiquei [N] tecnologias-chave na stack. Vou pesquisar boas
> práticas para cada uma. Isso leva alguns minutos."

### Passo 2: Para cada tecnologia — buscar conhecimento

Crie `.product-team/knowledge/best-practices/INDEX.md`.

Para cada tecnologia, siga esta ordem de prioridade:

#### Nível 1 — Base local (skills existentes)

Verifique se há skills de boas práticas instaladas que cobrem esta tecnologia:

| Tecnologia | Skill local |
|------------|-------------|
| React / Next.js | `vercel-react-best-practices` |
| PostgreSQL / Supabase | `supabase-postgres-best-practices` |
| Playwright | `playwright-best-practices` |
| Flutter | `flutter-animations` |

Se a skill existir, leia seu conteúdo, extraia os padrões mais relevantes
e escreva em `.product-team/knowledge/best-practices/<tech>.md`.

#### Nível 2 — Documentação oficial (web research)

Se não houver skill local, use `web_fetch` para buscar a documentação oficial:

- Framework: busque a doc oficial (ex: `https://nextjs.org/docs`)
- Extraia seções de "Getting Started", "Patterns", "Best Practices"
- Foque em padrões de projeto, não em sintaxe básica

#### Nível 3 — Pesquisa Google (deep research)

Se a documentação oficial não for suficiente, faça uma pesquisa:

- Use `web_fetch` com URL: `https://www.google.com/search?q=<tech>+best+practices+<ano>`
- Abra 2-3 resultados relevantes
- Extraia padrões recorrentes entre eles

### Passo 3: Formatar o arquivo de boas práticas

Cada arquivo segue este template:

```markdown
# [Tecnologia] — Best Practices

> Source: [skill local | doc oficial | web research]
> Last updated: [data]

## Patterns to Follow

### [Nome do padrão]
- **What:** [descrição curta]
- **Why:** [por que é boa prática]
- **How:** [exemplo concreto em código]

## Patterns to Avoid

### [Nome do antipadrão]
- **What:** [descrição]
- **Why avoid:** [consequência]
- **Use instead:** [alternativa]

## Quick Reference

- [atalho 1]
- [atalho 2]
```

### Passo 4: Gerar INDEX.md

O `INDEX.md` mapeia "quando consultar qual arquivo":

```markdown
# Best Practices Index — [PROJETO]

## By Technology

| Technology | File | Key Patterns |
|------------|------|-------------|
| Next.js | `nextjs.md` | RSC, data fetching, routing |
| Fastify | `fastify.md` | Plugins, validation, error handling |
| Supabase | `supabase.md` | RLS, auth, migrations |
| ... | ... | ... |

## By Task

| When you need to... | Consult |
|---------------------|---------|
| Create a new API route | `fastify.md` + `CONVENTIONS.md` |
| Design a database schema | `supabase.md` + `CONTEXT.md` |
| Build a UI component | `nextjs.md` + `tailwind.md` |
| Write tests | `testing.md` + `CONVENTIONS.md` |
| Handle payments | `stripe.md` |
| Deploy | `docker.md` + `traefik.md` |
```

### Passo 5: Apresentar resumo

Diga:

> "📚 **Best practices coletadas:**"
> - ✅ [N] tecnologias com padrões documentados
> - 📖 [N] da base local de skills
> - 🌐 [N] via web research
> - ⚠️ [N] sem cobertura (tecnologias sem pesquisa)
>
> "Os arquivos estão em `.product-team/knowledge/best-practices/`.
> O time vai consultar o `INDEX.md` automaticamente ao ser ativado."

---

## Fase 4 — Configuração do Time

### 4.1 Mostrar papéis disponíveis

Apresente:

> "Estes são os papéis disponíveis no time:"
>
> | # | Papel | O que faz | Essencial? |
> |---|-------|-----------|------------|
> | 1 | Product Manager | Define o que construir, PRDs, priorização | ⭐ Sim |
> | 2 | UX Designer | Fluxos, personas, wireframes | ⭐ Sim |
> | 3 | Software Architect | ADRs, viabilidade, estrutura | ⭐ Sim |
> | 4 | Tech Lead | Decomposição, revisão, padrões | ⭐ Sim |
> | 5 | Frontend Engineer | UI, componentes, integração | ⭐ Sim |
> | 6 | Backend Engineer | APIs, serviços, lógica | ⭐ Sim |
> | 7 | QA Engineer | Testes, aceitação, edge cases | ⭐ Sim |
> | 8 | DBA | Schema, queries, índices | Se tiver banco |
> | 9 | Head of Marketing | Posicionamento, campanhas | Se tiver go-to-market |
> | 10 | DevOps | CI/CD, deploy, infra | Se produto em produção |

### 4.2 Confirmar time

Pergunte:

> "Quer todos os 10 ou prefere desativar algum? Pode me dizer os números
> dos que quer manter, ou 'todos' para ativar tudo."
>
> Exemplos: `todos`, `1-7`, `1,2,3,4,5,6,7,8`

Salve os papéis ativos em `.product-team/state.json` → `active_roles`.

---

## Fase 5 — Geração dos Arquivos

Diga:

> "🎬 Vou gerar a estrutura do time agora."

### 5.1 Criar structure de diretórios

Garanta que existam:
```
.agents/skills/product-team/
├── knowledge/
│   ├── CONTEXT.md          ← já escrito
│   ├── ARCHITECTURE.md     ← já escrito
│   ├── STACK.md            ← já escrito
│   └── CONVENTIONS.md      ← já escrito
├── roles/                  ← gerar uma subpasta por papel ativo
├── workflows/
├── artifacts/
└── references/
```

### 5.2 Gerar skills de papel

Para cada papel em `active_roles`, leia `.agents/skills/product-team/references/role-skill-template.md`
e gere `.agents/skills/product-team/roles/<papel>/SKILL.md`.

Cada skill de papel deve:
1. Ter o preamble que carrega a Layer 0 (CONTEXT.md, ARCHITECTURE.md, STACK.md, CONVENTIONS.md)
2. Incluir as responsabilidades específicas do papel
3. Referenciar os workflows relevantes

Substitua `[PROJETO]` pelo nome real do projeto em todos os arquivos gerados.

### 5.3 Atualizar state.json

Atualize `.product-team/state.json`:
```json
{
  "phase": "ready",
  "bootstrap_completed": true,
  "bootstrap_completed_at": "<timestamp ISO>",
  "current_feature": null,
  "pipeline_phase": null,
  "features": []
}
```

---

## Fase 6 — Pronto

Diga:

> "✅ **[Nome], seu time de produto está pronto!**"
>
> "**Base de conhecimento criada:**"
> - `.product-team/.product-team/knowledge/CONTEXT.md` — [N] entidades de domínio
> - `.product-team/knowledge/ARCHITECTURE.md` — [N] módulos mapeados
> - `.product-team/knowledge/STACK.md` — stack documentada
>
> "**Time ativo:** [liste os papéis ativos]"
>
> "**Para começar uma feature, digite `product-team` e eu inicio o pipeline:**
> 1. **Plan** — planejamento multi-papel
> 2. **Spec** — PRD na linguagem do domínio
> 3. **Breakdown** — issues com role assignment
> 4. **Execute** — agentes em paralelo
> 5. **Review** — QA + Tech Lead"
>
> "Quer começar a primeira feature agora ou prefere explorar os arquivos primeiro?"

Aguarde resposta.
