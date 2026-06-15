# Project Memory — Timovi

> Lessons learned from past features. Consult before starting new work.

## Features Completed

| Feature | Date | Key Lessons |
|---------|------|-------------|
| dashboard | 2026-06 | Dashboard visual React+Express, observabilidade multi-projeto, Kanban + Time + Config |

## Patterns That Worked

- **Template-vs-Instance separation:** Keeping `skills/timovi/` immutable and `.product-team/` mutable has been clean and reliable
- **Design System first:** Defining DESIGN.md before building prototypes ensures consistency
- **Multi-variant prototyping:** Building A/B/C variants for the landing page allowed choosing the best elements from each

## Pitfalls to Avoid

- **Don't modify template after bootstrap:** Instance data in `.product-team/` is the project-specific layer
- **Keep Layer 0 lean:** Every role loads it — don't bloat it
- **One question at a time:** Bootstrap flow works best when each question gets a clear answer

## Active Decisions

- 13 roles active (10 core + Tech Writer + LinkedIn + Instagram)
- Landing page: variant selection pending (A = Hermes-style, B = Terminal-native, C = Card-cascade)
- V2 backlog: 30 épicos ranked and ready for prioritization
