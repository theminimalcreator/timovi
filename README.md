<p align="center">
  <img src="assets/banner.svg" alt="Timovi — Your digital product team" width="100%">
</p>

<p align="center">
  <a href="https://skills.sh"><img src="https://img.shields.io/badge/available%20on-skills.sh-FFD700?style=for-the-badge" alt="Available on skills.sh"></a>
  <a href="https://github.com/theminimalcreator/timovi/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License: MIT"></a>
  <a href="https://github.com/vercel-labs/skills"><img src="https://img.shields.io/badge/Built%20for-npx%20skills-000?style=for-the-badge&logo=npm" alt="Built for npx skills"></a>
</p>

# Timovi

**Assemble a digital product team inside your AI coding agent.** One command, your entire product pipeline — Product Manager, UX Designer, Software Architect, Tech Lead, Engineers, QA, and more.

> If Claude Code is a solo developer, **Timovi is the whole product team.**

```bash
npx skills add theminimalcreator/timovi --skill product-team
```

<br>

---

## Is Timovi right for you?

- ✅ You're a **solo founder or indie dev** shipping side projects
- ✅ You use **AI coding agents** (Claude Code, Cursor, Pi, Codex, OpenCode) and they're great — but something's missing
- ✅ You start projects fast but **finish them slowly** — the last 20% takes 80% of the time
- ✅ You know **UX matters**, but there's never enough time
- ✅ You've tried heavy orchestration tools (OpenClaw, Paperclip) and thought: **"this is too complex, what's the deliverable?"**
- ✅ You want a **lightweight, opinionated product team** — not a generic agent framework

<br>

---

## What Timovi gives you

| Role | What they do |
|------|-------------|
| 🎯 **Product Manager** | Defines what to build, writes PRDs, prioritizes. No more "am I building the right thing?" |
| 🎨 **UX Designer** | Personas, flows, wireframes. UX you'd do yourself if you had the time. |
| 🏗️ **Software Architect** | Validates feasibility, documents decisions, maps module impact. |
| 👨‍💻 **Tech Lead** | Breaks features into issues, coordinates execution, reviews code. |
| ⚛️ **Frontend Engineer** | Components, pages, state management. |
| 🖥️ **Backend Engineer** | APIs, services, business logic. |
| 🗄️ **DBA** | Schema design, queries, indexes, migrations. |
| ✅ **QA Engineer** | Tests, acceptance criteria, edge cases. |
| 📣 **Head of Marketing** | Positioning, messaging, go-to-market. |
| 🚀 **DevOps** | CI/CD, deploy, infrastructure. |

**All talking to each other, all sharing the same context about your project.**

<br>

---

## How it works

```
You say "product-team"
        │
        ▼
   ┌─────────┐     ┌──────┐     ┌───────────┐     ┌─────────┐     ┌────────┐
   │  PLAN   │ ──→ │ SPEC │ ──→ │ BREAKDOWN │ ──→ │ EXECUTE │ ──→ │ REVIEW │
   │ PM+UX   │     │  PM  │     │ Tech Lead │     │Eng+QA   │     │QA+TL   │
   │+Arch    │     │      │     │ +Arch     │     │         │     │        │
   └─────────┘     └──────┘     └───────────┘     └─────────┘     └────────┘
        │               │              │                │               │
        ▼               ▼              ▼                ▼               ▼
   Plan notes       PRD.md        Issues +      Pull Requests    Approved
                                  feature.json                   & merged
```

**Every phase produces a concrete deliverable.** You always know exactly what was done and what's next.

<br>

---

## Quick Start

### 1. Install

```bash
npx skills add theminimalcreator/timovi --skill product-team
```

Works with **Pi, Claude Code, Cursor, Codex, OpenCode, and [60+ other agents](https://github.com/vercel-labs/skills#supported-agents).**

### 2. Activate

Open your AI agent and type:

```
product-team
```

### 3. Bootstrap (5 minutes)

The orchestrator will ask a few questions about your project — name, stack, domain. It auto-detects your codebase, generates a knowledge base (domain language, architecture map, stack docs, conventions), and activates your team.

### 4. Start a feature

```
product-team → "new feature"
```

Pick a feature. The pipeline runs. You answer questions (one at a time), approve artifacts, and watch your team build.

<br>

---

## Without Timovi vs With Timovi

| Without Timovi | With Timovi |
|---------------|------------|
| ❌ "I need UX but have no time for it" | ✅ UX Designer is a dedicated Role — flows, personas, wireframes, done |
| ❌ "What should I build first?" | ✅ Product Manager writes PRDs, prioritizes, defines scope |
| ❌ Spaghetti code, no architecture | ✅ Software Architect validates feasibility, maps modules |
| ❌ Bugs found after launch | ✅ QA Engineer tests happy path + edge cases before you ship |
| ❌ Writing prompts, managing context, losing flow | ✅ Orchestrator runs the pipeline. You approve artifacts. |
| ❌ 5 side projects, 0 finished | ✅ Pipeline forces momentum: Plan → Spec → Breakdown → Execute → Review |
| ❌ "Is this even ready to launch?" | ✅ Review phase: QA approval + Tech Lead code review = ship with confidence |

<br>

---

## What makes Timovi different

| | OpenClaw / Hermes | Paperclip | **Timovi** |
|---|:---:|:---:|:---:|
| **Focus** | General AI agent | Agent orchestration platform | **Product team for builders** |
| **Setup time** | 30+ min config | Server + React UI | **1 command, 5 min bootstrap** |
| **Deliverables** | Agent runs commands | Tasks + budgets | **PRD → Issues → PRs → Review** |
| **UX role** | — | — | **Dedicated UX Designer** |
| **Learning curve** | Steep | Steep | **Guided — one question at a time** |
| **For who** | Power users | Companies | **Solo founders & indie devs** |

<br>

---

## Supported Agents

Timovi works with any agent supported by [npx skills](https://github.com/vercel-labs/skills). Primary tested:

| Agent | Install path |
|-------|-------------|
| **Pi** | `.pi/skills/product-team/` |
| **Claude Code** | `.claude/skills/product-team/` |
| **Cursor** | `.agents/skills/product-team/` |
| **Codex** | `.agents/skills/product-team/` |
| **OpenCode** | `.agents/skills/product-team/` |

<br>

---

## Under the Hood

Timovi is a **meta-framework of agent skills** — Markdown + JSON, no runtime, no servers.

```
skills/product-team/
├── SKILL.md                 ← Orchestrator (you are here)
├── references/
│   ├── bootstrap.md         ← First-run setup flow
│   ├── feature-pipeline.md  ← 5-phase development cycle
│   ├── state-schema.md      ← Persistent state format
│   └── role-skill-template.md
├── roles/                   ← 10 specialist agents
│   ├── product-manager/SKILL.md
│   ├── ux-designer/SKILL.md
│   └── ...
└── workflows/               ← Process templates
    ├── new-feature.md
    ├── bug-fix.md
    └── deploy.md
```

**Runtime behavior:**
- Every Role loads the **Layer 0** (project knowledge base) before acting
- The orchestrator saves **checkpoints** after each phase — resume across sessions
- Issues are executed as a **DAG** with parallel rounds, respecting dependencies
- All project-specific data lives in `.product-team/` — never touches the template

<br>

---

## Community

- 🔍 Discover more skills on **[skills.sh](https://skills.sh)**
- 🛠️ Built for the **[npx skills](https://github.com/vercel-labs/skills)** ecosystem
- 🐛 [Issues & feature requests](https://github.com/theminimalcreator/timovi/issues)
- ⭐ Star the repo if Timovi helps you ship

<br>

---

## License

MIT — see [LICENSE](LICENSE).

Built by [@theminimalcreator](https://github.com/theminimalcreator).
