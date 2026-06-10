# Workflow: Bug Fix

Pipeline for fixing reported bugs.

## Roles involved

| Phase | Roles | Description |
|------|--------|-------------|
| Triage | Tech Lead, QA | Classify severity, reproduce, isolate cause |
| Fix | Frontend or Backend | Implement fix |
| Review | QA, Tech Lead | Validate fix, check regression |

## Triggers

- Bug reported by QA in Review Phase
- User-reported bug
- Production incident

## Flow

### 1. Triage (Tech Lead + QA)

- Reproduce the bug with clear steps
- Isolate root cause (module, file, condition)
- Classify severity: 🔴 critical / 🟡 medium / 🟢 low
- Identify role responsible for the fix
- If critical and in production: trigger DevOps for possible rollback

### 2. Fix (Frontend or Backend Engineer)

- Implement fix
- Add regression test
- Open PR referencing the bug

### 3. Review (QA + Tech Lead)

- QA: verify the bug is fixed
- QA: verify no regression in related flows
- Tech Lead: code review of the fix
- If approved: merge and deploy

## Artifacts

- Issue recorded in `feature.json`
- PR with `Fixes #<bug-issue>`
- Regression test added

## Linear Integration

If `.product-team/state.json` has `linear_config` configured (not null), bug Issues generated during Triage will be synced to Linear via `integrations/linear/SKILL.md`. Bug Issues use the `[BUG]` prefix in the title and the `Bug` label in Linear (see `INTEGRATIONS.md` for status mapping).
