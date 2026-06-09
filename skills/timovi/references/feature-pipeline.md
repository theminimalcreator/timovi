# Feature Pipeline — Development Cycle

This document describes the 5-phase pipeline for developing features
with the product team. It is activated when `.product-team/state.json` has `phase: "ready"`.

---

## When starting a new feature

Read `.product-team/state.json`:

**If `current_feature` is `null`:**
→ The team is idle. Present:

> "Team ready. You can:
> 1. **New feature** — full pipeline (Plan → Spec → Breakdown → Execute → Review)
> 2. **Import PRD** — skip to Breakdown with an existing PRD
> 3. **View status** — list completed and pending features"

**If user chooses option 2 (import PRD):**

Ask:

> "Where's the PRD? Give me the file path."

After receiving the path:
1. Read the PRD file
2. Extract the feature name from the content (or ask the user to name it)
3. Create `.product-team/artifacts/<feature-name>/`
4. Copy the PRD to `PRD.md`
5. Create `feature.json` with `prd.source: "imported"` and `pipeline_phase: "breakdown"`
6. Update `.product-team/state.json` → `current_feature: "<name>"`
7. Ask: "PRD imported. Skip straight to Breakdown or review the plan first?"
   - If **Breakdown**: go to Phase 3
   - If **review**: execute Phase 1 (Plan) with the PRD as context

**If `current_feature` is set:**
→ A feature is in progress. Present the progress and suggest resuming.

Read `.product-team/artifacts/<feature>/feature.json` to show status:

> "📊 **Feature: [name]** — Phase: [pipeline_phase]"
> "Issues: [N] total, [X] done, [Y] in_progress, [Z] blocked, [W] pending"
> "Continue?"

---

## Phase 1 — PLAN (Multi-role Planning)

**Goal:** Extract the feature domain, stress-test the plan, align
PM, UX and Architect through rounds of questions and cross-examination.

### 1.1 Activate multi-role grilling

Say:

> "Starting **Phase 1 — Plan**. I'll activate PM, UX Designer and Software Architect
> for a planning session.
>
> Each will ask questions from their angle. One question at a time.
> At the end of each round, roles will cross-examine each other."

Load `.product-team/knowledge/CONTEXT.md`, `.product-team/knowledge/ARCHITECTURE.md`.

The 3 roles ask alternating questions. The orchestrator controls turns.
Each role asks **1 question per round** and waits for a response before the next.

### 1.2 Round Structure

Each round follows this sequence:

1. **PM asks** → user responds
2. **UX Designer asks** → user responds
3. **Software Architect asks** → user responds
4. **Cross-examination** (internal debate between roles):
   - PM questions UX and Architect about decisions made (1 question each)
   - UX questions PM and Architect (1 question each)
   - Architect questions PM and UX (1 question each)

Total per round: 3 user questions + 3 cross-questions.

**Cross-examination examples:**
- PM → UX: "Does this flow cover the scenario where the user abandons halfway?"
- UX → Architect: "Does this module structure scale to mobile that PM mentioned?"
- Architect → PM: "Is the success metric measurable with the current stack?"

### 1.3 Rounds and progression

**Round 1 — PM:**
> "What business problem does this feature solve? Who is the impacted user
> and what metric defines success?"

→ UX asks → Architect asks → Cross-examination

**Round 2 — UX:**
> "At what moment does the user use this? What are they doing immediately
> BEFORE and AFTER interacting with this feature?"

→ PM asks → Architect asks → Cross-examination

**Round 3 — Architect:**
> "Which existing modules does this feature touch? Does it need a new table,
> new endpoint, new integration?"

→ Cross-examination

### 1.4 Continuity decision

After **round 3**, the orchestrator asks:

> "We've completed 3 planning rounds. Is the plan clear enough
> to move forward to Spec (PRD) or want to keep exploring?
>
> 1. **Move to Spec** — generate PRD
> 2. **Continue planning** — more question rounds"

- If **move to Spec**: go to 1.5 (Synthesis)
- If **continue**: execute more rounds (up to a max of 10 rounds)
  - Each additional round, roles alternate who starts (PM → UX → Architect → PM...)
  - After each additional round, ask again: "Continue or advance?"
  - The user can request to advance at any time ("spec", "done", "enough", "advance")

Maximum: **10 rounds** (30 user questions + 30 cross-questions).

### 1.5 Synthesis

At the end, summarize:

> "📋 Planning summary:"
> - Problem: [PM summary]
> - User and flow: [UX summary]
> - Technical impact: [Architect summary]
>
> "Move on to Phase 2 — Spec (PRD)?"

### 1.6 Checkpoint + Git commit

Save to `.product-team/state.json` → `features[].checkpoints.plan`.

**Git:** Commit the planning (respecting `git_mode` from state.json):
```bash
git add .product-team/artifacts/<feature>/plan-notes.md
git commit -m "plan: [1-sentence planning summary]"
```

---

## Phase 2 — SPEC (PRD)

**Goal:** Synthesize the planning into a PRD in domain language.

### 2.1 Create feature directory

Create the structure:
```
.product-team/artifacts/<feature-name>/
├── feature.json    ← created now
├── PRD.md          ← will be written
└── plan-notes.md   ← Phase 1 notes
```

**Git:** Create the feature branch:
```bash
git checkout -b feat/<feature-slug>
```
The slug is derived from the feature name: lowercase, spaces → hyphens, remove special chars.
Ex: "Framework Improvements v1" → `framework-improvements-v1`.

If git is unavailable or the directory is not a repo, show a warning and continue without git.

Initialize `feature.json`:
```json
{
  "name": "<feature-name>",
  "status": "in_progress",
  "pipeline_phase": "spec",
  "prd": { "source": "generated", "imported_from": null },
  "issues": []
}
```

### 2.2 Activate Product Manager

Say:

> "Starting **Phase 2 — Spec**. The Product Manager will synthesize the
> planning into a PRD."

Activate the `product-manager` role (read `roles/product-manager/SKILL.md`).

The PM must:
1. Use CONTEXT.md language throughout the PRD
2. Reference modules from ARCHITECTURE.md
3. Respect existing ADRs
4. Follow the PRD template (Problem Statement, Solution, User Stories,
   Implementation Decisions, Testing Decisions, Out of Scope)
5. Write the PRD to `.product-team/artifacts/<feature-name>/PRD.md`

### 2.3 Review and approval

Present the PRD and ask:

> "Is the PRD approved? Want to adjust anything before decomposing into issues?"

### 2.4 PRD HTML (Optional — new-feature only)

After PRD is approved, the PM offers:

> "Want to generate an HTML version of the PRD for browser viewing?"

If the user accepts:

1. Read the template `references/prd-template.html`
2. Replace placeholders:
   - `{{FEATURE_NAME}}` → feature name
   - `{{FEATURE_STATUS}}` → current status
   - `{{FEATURE_PHASE}}` → current phase
   - `{{CREATED_AT}}` → creation date
   - `{{UPDATED_AT}}` → update date
   - `{{PM_NAME}}` → PM name (extract from state.json → `user_name`)
   - `{{ISSUE_COUNT}}` → issue count (0 if none yet)
   - `{{PRD_CONTENT}}` → PRD rendered as HTML (headings → `<h3>`, tables → `<table>`, lists → `<ul>/<ol>`, paragraphs → `<p>`)
   - `{{ISSUES_INLINE_DATA}}` → if issues exist, embed data inline:
     ```js
     const EMBEDDED_ISSUES = [/* copy from feature.json */];
     function renderIssues(issues) { ... }
     renderIssues(EMBEDDED_ISSUES);
     ```
     If no issues yet, leave the placeholder empty (shows empty state)
3. Save to `.product-team/artifacts/<feature-name>/PRD.html`
4. Run `open .product-team/artifacts/<feature-name>/PRD.html` to open in browser
5. **Git:** Commit the HTML (respecting `git_mode`):
   ```bash
   git add .product-team/artifacts/<feature>/PRD.html
   git commit -m "spec: add PRD.html"
   ```

> **Note:** Issues are embedded inline in the HTML — they always work, even on `file://`.

If the user declines, skip to the next step.

**Rule:** PRD HTML is offered only in the `new-feature.md` workflow. Bug fixes don't offer it.

### 2.5 HTML Prototype (Optional — new-feature only)

After PRD HTML (or after approval if the user declined HTML), the UX Designer asks:

> "Need an interactive prototype to validate the flows?"

If the user accepts, ask the fidelity level:

> "What fidelity level?"
> - **Wireframe** — low fidelity, boxes and placeholders
> - **Final product** — high fidelity, with project visual identity

The UX Designer must:

1. Read the template `references/prototype-template.html`
2. If **final product**, extract visual identity from the project:
   - Read `.product-team/knowledge/STACK.md` → colors, fonts
   - Read `.product-team/knowledge/CONVENTIONS.md` → visual patterns
   - If the project has theme files (tailwind.config, theme.ts, etc.), read them
3. Replace placeholders:
   - `{{PROTOTYPE_TITLE}}` → feature name + "— Prototype"
   - `{{FIDELITY_MODE}}` → "Wireframe" or "High-Fidelity"
   - `{{PRIMARY_COLOR}}` → project primary color (default: #3b82f6)
   - `{{SECONDARY_COLOR}}` → secondary color (default: #6366f1)
   - `{{ACCENT_COLOR}}` → accent color (default: #f59e0b)
   - `{{BG_COLOR}}` → background color (default: #0d1117)
   - `{{SURFACE_COLOR}}` → surface color (default: #161b22)
   - `{{TEXT_COLOR}}` → text color (default: #c9d1d9)
   - `{{TEXT_MUTED_COLOR}}` → muted text color (default: #8b949e)
   - `{{BORDER_COLOR}}` → border color (default: #30363d)
   - `{{SUCCESS_COLOR}}` → success color (default: #22c55e)
   - `{{DANGER_COLOR}}` → danger color (default: #ef4444)
   - `{{FONT_FAMILY}}` → font family (default: -apple-system, sans-serif)
   - `{{BORDER_RADIUS}}` → border radius (default: 6px)
   - `{{PROJECT_NAME}}` → project name
   - `{{NAV_ITEMS}}` → nav items based on PRD flows
   - `{{SCREENS}}` → prototype screens (wireframe .wf-* or final .card/.btn/.input)
4. Save to `.product-team/artifacts/<feature-name>/prototype.html`
5. Run `open .product-team/artifacts/<feature-name>/prototype.html` to open in browser
6. **Git:** Commit the prototype (respecting `git_mode`):
   ```bash
   git add .product-team/artifacts/<feature>/prototype.html
   git commit -m "spec: add prototype"
   ```

> **Wireframe mode:** Use classes `.wf-box`, `.wf-placeholder`, `.wf-button`, `.wf-grid`.
> **Final product mode:** Use `.card`, `.btn`, `.btn-primary`, `.btn-secondary`, `.input`, `.badge`.

If the user declines, skip.

### 2.6 Save checkpoint + Git commit

Update `.product-team/artifacts/<feature-name>/feature.json`:
- `pipeline_phase: "breakdown"`
- `prd.path`, `prd.created_at`
- `updated_at`

**Git:** Commit the PRD (respecting `git_mode`):
```bash
git add .product-team/artifacts/<feature>/PRD.md .product-team/artifacts/<feature>/feature.json
git commit -m "spec: PRD — [PRD title]"
```

---

## Phase 3 — BREAKDOWN (Decompose into Issues)

**Goal:** Break the PRD into vertical issues with role assignment.

### 3.1 Activate Tech Lead + Architect

Say:

> "Starting **Phase 3 — Breakdown**. Tech Lead and Architect will decompose
> the PRD into executable issues."

Activate `tech-lead` and `software-architect` (read the skills).

### 3.2 Decomposition

Read `.product-team/artifacts/<feature-name>/PRD.md`.

Follow the `to-issues` pattern:
- Each issue is a vertical slice (crosses all layers)
- Issues are AFK (auto-executable) or HITL (require human decision)
- Prefer AFK

**Additionally, each issue gets `assigned_roles`:**

| If the issue touches... | Assigned roles |
|------------------------|----------------|
| Schema, migrations, queries | `["backend-engineer", "dba"]` |
| API endpoints, services | `["backend-engineer"]` |
| UI, components, pages | `["frontend-engineer"]` |
| Tests, acceptance | `["quality-engineer"]` |
| CI/CD, deploy, infra | `["devops"]` |
| Multiple layers | `["backend-engineer", "frontend-engineer"]` |

### 3.3 Save issues to feature.json

Update `.product-team/artifacts/<feature-name>/feature.json`:

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

See `references/feature-schema.md` for the complete schema.

### 3.4 Decomposition review

Present the numbered list and ask:

> "Do the issues make sense? Is the granularity good? Are the dependencies
> correct?"

### 3.5 Save

Issues are saved in `feature.json` — nothing to publish externally.

### 3.6 Checkpoint + Git commit

Save to `.product-team/state.json`:
- `features[].checkpoints.breakdown`
- `features[].issues` (full array with IDs, titles, dependencies, roles)

**Git:** Commit the breakdown (respecting `git_mode`):
```bash
git add .product-team/artifacts/<feature>/feature.json
git commit -m "breakdown: [N] issues"
```

---

## Phase 4 — EXECUTE (Parallel Execution)

**Goal:** Execute issues in parallel, respecting dependencies.

### 4.1 Build the DAG

Based on the issues and their `blocked_by`, build the dependency graph.

Say:

> "Starting **Phase 4 — Execute**."
>
> "Execution DAG:"
> - **Round 1 (no blockers):** [N] issues — [list]
> - **Round 2 (after Round 1):** [N] issues — [list]
> - **Round 3 (after Round 2):** [N] issues — [list]
>
> "I'll execute round by round. Issues within the same round run in parallel."

### 4.2 Execute rounds

For each round:

1. For each issue in the round, spawn a subagent.
   The prompt must include instructions for the agent:

   > "You are the [assigned_roles] role on the CDT team.
   >
   > 1. Load the knowledge base:
   >    - `.product-team/knowledge/CONTEXT.md`
   >    - `.product-team/knowledge/ARCHITECTURE.md`
   >    - `.product-team/knowledge/STACK.md`
   >    - `.product-team/knowledge/CONVENTIONS.md`
   >    - `.product-team/knowledge/best-practices/INDEX.md`
   >    - `.product-team/playbooks/[role]/INDEX.md`
   >
   > 2. Read `.product-team/artifacts/<feature>/feature.json`
   >    Your issue: **[ISSUE-X]** — [title]
   >
   > 3. Update `feature.json`: status → `in_progress`, `started_at`, `agent_id`
   >
   > 4. Implement the issue following conventions and best practices
   >
   > 5. On completion, update `feature.json`:
   >    - `status`: `done`
   >    - `pr_url`: PR URL
   >    - `completed_at`: timestamp
   >
   > 6. Commit the issue (respecting `git_mode` from state.json):
   >    ```bash
   >    git add -A
   >    git commit -m "[ISSUE-ID]: [issue title]"
   >    ```
   >
   > 7. If it fails, update `feature.json`:
   >    - `status`: `failed`
   >    - `notes`: error description"

2. Monitor progress by reading `feature.json` periodically
3. When all issues in the round complete, advance

### 4.3 Execution report

Read `feature.json` and present:

> "✅ **Execution complete:**"
> - [N]/[N] issues implemented
> - [N] PRs opened: [list]
> - [N] issues with caveats: [list]

### 4.4 Checkpoint

Update `feature.json`:
- `pipeline_phase: "review"`
- `updated_at`

**Git:** Commit execution completion (respecting `git_mode`):
```bash
git add .product-team/artifacts/<feature>/feature.json
git commit -m "execute: all issues completed"
```

No need to update `.product-team/state.json` — `feature.json` is the source of truth.

---

## Phase 5 — REVIEW (Review and Quality)

**Goal:** Review code, test acceptance, ensure quality.

### 5.1 Activate QA Engineer + Tech Lead

Say:

> "Starting **Phase 5 — Review**. QA Engineer and Tech Lead will review."

Activate `quality-engineer` and `tech-lead`.

### 5.2 QA Review

QA Engineer:
- Reviews each PR against the issue's acceptance criteria
- Tests happy path, alternative path, edge cases
- Reports: ✅ approved / 🟡 approved with caveats / 🔴 rejected

### 5.3 Tech Lead Review

Tech Lead:
- Reviews code: standards, ADRs, conventions
- Checks test coverage
- Reports: ✅ approved / 🔴 requests changes

### 5.4 Final report

Read `feature.json` and present:

> "📊 **Review complete:**"
> - ✅ [N] PRs approved
> - 🟡 [N] PRs with minor caveats
> - 🔴 [N] PRs needing adjustments
>
> "Feature **[name]** — final status: [approved / pending]"

### 5.5 Git commit + Human-gated merge

**Git:** Commit the review (respecting `git_mode`):
```bash
git add .product-team/artifacts/<feature>/feature.json
git commit -m "review: QA + TL approved"
```

After committing, ask:

> "QA and Tech Lead approved. All issues are complete.
> Merge to main branch?"
>
> ⚠️ Merge is NEVER automatic — always requires your confirmation.

If the user approves:
```bash
git checkout main
git merge feat/<feature-slug>
```

If there's a conflict, report and wait for manual resolution.

### 5.6 Final checkpoint

Update `feature.json`:
- `status: "done"` (or `"paused"` if there are pending items)
- `pipeline_phase: null`
- `updated_at`

Update `.product-team/state.json`:
- `current_feature: null` (team freed for next feature)

### 5.7 Retrospective (internal — user does NOT participate)

After merge, convene all Roles that participated in this feature for an internal Agile retrospective.

> "Starting internal retrospective. Roles will discuss learnings from this feature."

**Agile format — conversation between Roles (cross-examination):**

1. **✅ What went well?** — Each Role shares what worked
2. **❌ What didn't go well?** — Each Role points out what could be improved
3. **🔧 Actions** — Each Role proposes 1-2 concrete actions for the next feature

**Save learnings:**

Create/update `memory/<NNN>.md` (project):
```markdown
# Retrospective — [FEATURE]

## ✅ What went well
- [learning 1]
- [learning 2]

## ❌ What didn't go well
- [improvement point 1]

## 🔧 Actions
- [action 1]
- [action 2]
```

For each participating Role, create/update `memory/roles/<role>/<NNN>.md`:
```markdown
# [ROLE] — [FEATURE]

## What I learned
- [role-specific learning]

## What I'll do differently
- [role-specific action]
```

**Splitting rule:**
- If `memory/<NNN>.md` exceeds **100 lines**, create `<NNN+1>.md` with the overflow content
- If `memory/roles/<role>/<NNN>.md` exceeds **100 lines**, create `<NNN+1>.md`
- Update the corresponding `INDEX.md` with the new entry

**Save full retro:**
Create `.product-team/artifacts/<feature>/retrospective.md` with the full conversation transcript.

After saving, present to the user:

> "🧠 Retrospective complete. Learnings saved."
> - ✅ [N] things that went well
> - ❌ [N] improvement points
> - 🔧 [N] actions for the next feature
>
> "Memories updated: project + [N] roles."

---

## Preventive checkpoint between phases

After each phase is completed, offer a pause if the session has been long:

> "[Name], **[current phase]** is done and the checkpoint is saved.
> Next phase is **[next phase]**. Do you want to:
>
> 1. Continue now
> 2. Pause here, type `/clear` and come back with `timovi` in
>    a fresh session (recommended if the session is already long)
>
> Press 1, 2, or type CONTINUE for option 1."

**Don't offer this prompt right after a session resume.** The session is
already fresh. The prompt only applies after a phase produced real work
within the current session.
