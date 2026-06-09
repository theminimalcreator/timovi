# Bootstrap — Product Team Initialization

This document describes the first-run flow. Follow each section in order.
Ask **one question at a time**. Do not advance without user response.

---

## Phase 0 — Welcome

Say:

> "👋 Hello! I'm going to set up your product team.
>
> I'll ask a few questions to build the project knowledge base
> and assemble the team with the right roles. In the end, you'll have a full team
> of specialist agents for your product.
>
> Shall we begin?"

Wait for confirmation.

---

## Phase 1 — Project Identity

### 1.1 User name

Ask:

> "What's your name?"

Save to `.product-team/state.json` → `user_name`.

### 1.2 Language

Ask:

> "What language should the team communicate with you in?"
>
> Examples: `en-us`, `pt-br`, `es`

Save to `.product-team/state.json` → `chat_language`.

### 1.3 Project name

Ask:

> "What's the product name?"

Save to `.product-team/state.json` → `project`.

### 1.4 One-line description

Ask:

> "Describe your product in one sentence. What problem does it solve and for whom?"

Save to `.product-team/state.json` → `description`.

---

## Phase 2 — Terrain Detection

### 2.1 Existing code?

Explore the current directory. Ignore node_modules, .git, dist, build, coverage.

If source code is found (`.ts`, `.js`, `.py`, `.go`, `.rb`, `.java`, `.dart`, etc.):

Say:

> "🔍 I found source code in the project. This means the product already exists,
> right? I'll analyze the structure to build the knowledge base."

Proceed to **Phase 3A (project with code)**.

If NO source code is found:

Ask:

> "Is this a brand new product (no code yet) or is the code somewhere else?"

- If **new**: Proceed to **Phase 3B (new project)**
- If **elsewhere**: Ask for the path and explore there. Then follow Phase 3A or 3B as appropriate.

---

## Phase 3A — Project with Existing Code

### Step 1: Structure analysis

Explore the folder structure. Identify:

- **Languages and frameworks** (package.json, Cargo.toml, go.mod, requirements.txt, pubspec.yaml, etc.)
- **Module structure** (main folders, entry points)
- **Database** (migrations, schema, ORM config)
- **APIs and integrations** (routes, HTTP clients, message queues)

### Step 2: Propose STACK.md

Based on the analysis, generate `.product-team/knowledge/STACK.md`:

```markdown
# Tech Stack — [PROJECT]

## Frontend
- **Framework:** [React / Next.js / Vue / Flutter / etc.]
- **Language:** [TypeScript / JavaScript / Dart / etc.]
- **Styling:** [Tailwind / CSS Modules / Styled Components / etc.]
- **State management:** [Zustand / Redux / Context / etc.]

## Backend
- **Runtime:** [Node.js / Python / Go / Java / etc.]
- **Framework:** [Express / NestJS / FastAPI / Spring / etc.]
- **ORM:** [Prisma / TypeORM / SQLAlchemy / etc.]

## Database
- **DBMS:** [PostgreSQL / MySQL / MongoDB / SQLite / etc.]
- **Migrations:** [Prisma / Flyway / Alembic / etc.]

## Infrastructure
- **Hosting:** [Vercel / AWS / Railway / VPS / etc.]
- **CI/CD:** [GitHub Actions / GitLab CI / etc.]
- **Containerization:** [Docker / Kubernetes / none]

## Key Dependencies
- [list 5-10 main dependencies]
```

Present the draft and ask:

> "📊 I detected this stack. Does it look right or want to adjust anything?"

### Step 3: Propose CONTEXT.md

Analyze the code for domain entities. Look for:
- Models/entities (classes, interfaces, types)
- Database tables (schema.prisma, migrations)
- Enums, domain constants
- Recurring terms in file and function names

For each candidate entity, identify:
1. **Canonical name** (what the business calls it)
2. **Name in code** (class, table, type)
3. **Brief description**
4. **Synonyms to avoid**

Generate `.product-team/knowledge/CONTEXT.md` using the template:

```markdown
# [PRODUCT NAME]

[One-line description]

## Language

**[Entity 1]** (Entity):
Clear description. In code, identified as `ClassName` or `table_name`.
_Avoid_: Synonym1, Synonym2

**[Entity 2]** (Entity):
Clear description. In code, identified as `ClassName` or `table_name`.
_Avoid_: Synonym1, Synonym2

## Example dialogue

**Dev:** "[common question from a new dev]"

**Domain expert:** "[answer using domain terms]"
```

**IMPORTANT:** Don't try to be exhaustive. List the **5-10 most important entities**.
CONTEXT.md grows over time. The goal is a solid foundation, not perfection.

Present the draft and ask:

> "📖 I suggested these domain entities based on the code. Does it look right? Want
> to rename any, add, or remove?"

Iterate until the user approves.

### Step 4: Propose ARCHITECTURE.md

Based on the folder structure and imports, generate `.product-team/knowledge/ARCHITECTURE.md`:

```markdown
# Architecture — [PROJECT]

## Module Structure

| Module | Path | Responsibility |
|--------|------|-----------------|
| [name] | `apps/or/packages/name/` | [what it does] |

## Data Flow

[Describe how data flows between main modules]

## Entry Points

| Entry Point | File | Description |
|-------------|------|-------------|
| API | `apps/api/src/main.ts` | Backend server |
| Web | `apps/web/src/app/layout.tsx` | Frontend |
| Worker | `apps/worker/src/index.ts` | Async processing |

## External Integrations

| Service | Purpose | Configured in |
|---------|---------|---------------|
| [name] | [what it does] | [config file] |

## Architectural Patterns

- [e.g.: Monorepo with Turborepo]
- [e.g.: REST API with controllers → services → repositories]
- [e.g.: Frontend with App Router, Server Components]
```

Present and ask:

> "🏗️ This is the architecture map I detected. Does it look right?"

### Step 5: CONVENTIONS.md

Generate an initial draft (can be minimal):

```markdown
# Conventions — [PROJECT]

## Code
- [fill in based on existing code analysis]

## Testing
- [fill in based on patterns found]

## Git
- [fill in based on history]

> ⚠️ This file will be refined over time as the team produces code.
```

Say:

> "📐 I created a conventions draft. It'll be refined as the team
> produces code."

---

## Phase 3B — New Project (no code)

### Step 1: Domain interview

Explain:

> "Since the product is new, I'll ask a few questions to extract the domain.
> Think out loud — I'll organize it."

Ask questions **one at a time**:

1. > "Who are the product's users? List the types of people who interact with it."

2. > "What is the main 'thing' the product manages? (E.g.: orders, workouts, reservations, documents)"

3. > "What are the 3-5 main actions users perform?"

4. > "Are there business rules that, if implemented wrong, break everything?"

5. > "Does the product integrate with any external service? (Payment, email, storage, etc.)"

With the answers, generate `.product-team/knowledge/CONTEXT.md` and present for approval.

### Step 2: Stack selection

Ask:

> "Which stack do you want to use? If you're not sure, I can suggest based on
> the product type."
>
> Common suggestions:
> - **B2B SaaS:** Next.js + TypeScript + PostgreSQL + Prisma
> - **Mobile-first:** Flutter + Firebase/Supabase
> - **API-first:** NestJS + PostgreSQL + Redis
> - **Landing page / Marketing:** Astro + Tailwind
> - **Other:** tell me which

Generate `.product-team/knowledge/STACK.md`.

### Step 3: Initial architecture

Based on the domain and stack, suggest an initial architecture.

Ask:

> "Is the product a well-structured monolith or does it need to start as
> microservices/monorepo?"

Generate `.product-team/knowledge/ARCHITECTURE.md` with a suggested structure.

---

## Phase 3.5 — Best Practices Research

**Goal:** For each technology in the stack, look up consolidated best practices
and patterns. This makes the team code following real community standards,
not guesswork.

### Step 1: Identify key technologies

Read `.product-team/knowledge/STACK.md`. Extract the list of technologies worth
researching. Prioritize:

| Category | Examples |
|-----------|----------|
| Frameworks | Next.js, Fastify, Expo, React Native |
| DB/Backend | Supabase, PostgreSQL, Prisma |
| Styling/UI | Tailwind CSS, Radix UI, NativeWind |
| Integrations | Stripe, Resend, Sentry |
| Testing | Vitest, Jest, Detox, Playwright |
| Infra/DevOps | Docker, Traefik, GitHub Actions |

Say:

> "🔍 I identified [N] key technologies in the stack. I'll research best
> practices for each one. This takes a few minutes."

### Step 2: For each technology — gather knowledge

Create `.product-team/knowledge/best-practices/INDEX.md`.

For each technology, follow this priority order:

#### Level 1 — Local base (existing skills)

Check if there are best-practice skills installed covering this technology:

| Technology | Local skill |
|------------|-------------|
| React / Next.js | `vercel-react-best-practices` |
| PostgreSQL / Supabase | `supabase-postgres-best-practices` |
| Playwright | `playwright-best-practices` |
| Flutter | `flutter-animations` |

If the skill exists, read its content, extract the most relevant patterns,
and write to `.product-team/knowledge/best-practices/<tech>.md`.

#### Level 2 — Official documentation (web research)

If there's no local skill, use `web_fetch` to fetch the official documentation:

- Framework: fetch the official docs (e.g.: `https://nextjs.org/docs`)
- Extract sections like "Getting Started", "Patterns", "Best Practices"
- Focus on design patterns, not basic syntax

#### Level 3 — Google search (deep research)

If the official documentation isn't enough, do a search:

- Use `web_fetch` with URL: `https://www.google.com/search?q=<tech>+best+practices+<year>`
- Open 2-3 relevant results
- Extract recurring patterns across them

### Step 3: Format the best practices file

Each file follows this template:

```markdown
# [Technology] — Best Practices

> Source: [local skill | official docs | web research]
> Last updated: [date]

## Patterns to Follow

### [Pattern name]
- **What:** [brief description]
- **Why:** [why it's a best practice]
- **How:** [concrete code example]

## Patterns to Avoid

### [Anti-pattern name]
- **What:** [description]
- **Why avoid:** [consequence]
- **Use instead:** [alternative]

## Quick Reference

- [shortcut 1]
- [shortcut 2]
```

### Step 4: Generate INDEX.md

The `INDEX.md` maps "when to consult which file":

```markdown
# Best Practices Index — [PROJECT]

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

### Step 5: Present summary

Say:

> "📚 **Best practices collected:**"
> - ✅ [N] technologies with documented patterns
> - 📖 [N] from local skill base
> - 🌐 [N] via web research
> - ⚠️ [N] without coverage (technologies not researched)
>
> "Files are in `.product-team/knowledge/best-practices/`.
> The team will consult `INDEX.md` automatically when activated."

---

## Phase 4 — Team Configuration

### 4.1 Show available roles

Present:

> "These are the available team roles:"
>
> | # | Role | What it does | Essential? |
> |---|------|-------------|------------|
> | 1 | Product Manager | Defines what to build, PRDs, prioritization | ⭐ Yes |
> | 2 | UX Designer | Flows, personas, wireframes | ⭐ Yes |
> | 3 | Software Architect | ADRs, feasibility, structure | ⭐ Yes |
> | 4 | Tech Lead | Breakdown, review, standards | ⭐ Yes |
> | 5 | Frontend Engineer | UI, components, integration | ⭐ Yes |
> | 6 | Backend Engineer | APIs, services, logic | ⭐ Yes |
> | 7 | QA Engineer | Testing, acceptance, edge cases | ⭐ Yes |
> | 8 | DBA | Schema, queries, indexes | If there's a database |
> | 9 | Head of Marketing | Positioning, campaigns | If there's go-to-market |
> | 10 | DevOps | CI/CD, deploy, infra | If product in production |

### 4.2 Confirm team

Ask:

> "Do you want all 10 or prefer to disable some? Tell me the numbers
> you want to keep, or 'all' to activate everything."
>
> Examples: `all`, `1-7`, `1,2,3,4,5,6,7,8`

Save active roles to `.product-team/state.json` → `active_roles`.

---

## Phase 5 — File Generation

Say:

> "🎬 I'm going to generate the team structure now."

### 5.1 Create directory structure

Ensure these exist:
```
.product-team/
├── knowledge/
│   ├── CONTEXT.md          ← already written
│   ├── ARCHITECTURE.md     ← already written
│   ├── STACK.md            ← already written
│   └── CONVENTIONS.md      ← already written
├── roles/                  ← generate one subfolder per active role
├── workflows/
├── artifacts/
└── references/
```

### 5.2 Generate role skills

For each role in `active_roles`, read `references/role-skill-template.md`
and generate `.product-team/roles/<role>/SKILL.md`.

Each role skill must:
1. Have the preamble that loads Layer 0 (CONTEXT.md, ARCHITECTURE.md, STACK.md, CONVENTIONS.md)
2. Include the role's specific responsibilities
3. Reference relevant workflows

Replace `[PROJECT]` with the real project name in all generated files.

### 5.3 Update state.json

Update `.product-team/state.json`:
```json
{
  "phase": "ready",
  "bootstrap_completed": true,
  "bootstrap_completed_at": "<ISO timestamp>",
  "current_feature": null,
  "pipeline_phase": null,
  "features": []
}
```

---

## Phase 6 — Done

Say:

> "✅ **[Name], your product team is ready!**"
>
> "**Knowledge base created:**"
> - `.product-team/knowledge/CONTEXT.md` — [N] domain entities
> - `.product-team/knowledge/ARCHITECTURE.md` — [N] modules mapped
> - `.product-team/knowledge/STACK.md` — stack documented
>
> "**Active team:** [list active roles]"
>
> "**To start a feature, type `timovi` and I'll start the pipeline:**
> 1. **Plan** — multi-role planning
> 2. **Spec** — PRD in domain language
> 3. **Breakdown** — issues with role assignment
> 4. **Execute** — agents in parallel
> 5. **Review** — QA + Tech Lead"
>
> "Want to start the first feature now or prefer to explore the files first?"

Wait for response.
