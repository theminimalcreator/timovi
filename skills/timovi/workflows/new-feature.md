# Workflow: New Feature

Full pipeline for developing a new feature.

## Roles involved

| Phase | Roles | Description |
|------|--------|-------------|
| Plan | PM, UX, Architect | Multi-role planning, grilling session with cross-examination (up to 10 rounds) |
| Spec | PM | PRD in domain language + optional PRD.html |
| Breakdown | Tech Lead, Architect | Decomposition into issues with role assignment |
| Execute | Frontend, Backend, DBA, DevOps | Parallel implementation |
| Review | QA, Tech Lead | Validation and code review |

## Dependencies

```
Plan ──→ Spec ──→ Breakdown ──→ Execute ──→ Review
```

## Generated artifacts

| Phase | Artifact | Location |
|------|----------|----------|
| Plan | Planning notes | `state.json` → `features[].checkpoints.plan` |
| Spec | PRD | `.product-team/artifacts/<feature>/PRD.md` |
| Spec (optional) | PRD HTML | `.product-team/artifacts/<feature>/PRD.html` |
| Spec (optional) | Prototype | `.product-team/artifacts/<feature>/prototype.html` |
| Breakdown | Issues with role assignment | `.product-team/artifacts/<feature>/feature.json` |
| Execute | PRs | Repository |
| Review | Quality report | `state.json` → `features[].checkpoints.review` |

## Completion criteria

- [ ] Planning approved (PM + UX + Architect aligned with cross-examination)
- [ ] PRD written and approved in CONTEXT.md language
- [ ] PRD HTML generated (optional, if user accepted)
- [ ] Interactive prototype generated (optional, if user accepted)
- [ ] Issues decomposed with dependencies and assigned_roles
- [ ] All PRs opened and reviewed
- [ ] QA approved against acceptance criteria
- [ ] Tech Lead approved code review
- [ ] `state.json` updated with final status
