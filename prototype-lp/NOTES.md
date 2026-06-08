# Prototype NOTES — Timovi Landing Page

**Question:** "What should the Timovi landing page look like?"

**Date:** 2026-06-08

## Variants

| Variant | Name | Approach |
|---------|------|----------|
| A | Hermes-style | Centric hero, dark gradient background, vertical flow. Clean product LP inspired by nousresearch.com/hermes-agent. Large typography, centered CTA cards. |
| B | Terminal-native | Entire page as terminal output. Monospace fonts, green prompt on dark. Command-line aesthetic. Perfect for Timovi's CLI persona. |
| C | Card-cascade | Asymmetric editorial layout with staggered cards. Two-column hero, masonry roles grid, card-based comparison. |

## Design decisions captured

- **Dark theme only** — consistent with Timovi banner (dark background, gold accent #FFD700).
- **Gold accent** on gold/amber — matches existing banner, package keywords.
- **Comparison data** sourced from project README.md table.
- **13 roles** with correct emoji icons as specified in task.
- **Pipeline** shows 5 phases with role assignments underneath.
- **Sections:** Hero → What → Roles → Pipeline → Comparison → CTA — exactly as required.
- **Both CTA sections** include install command + star button.

## Winner

_TBD — flip through variants and pick, or mix elements._

## Cleanup

When a variant wins:
- Delete `prototype-lp/index.html` (it's throwaway)
- Fold the winning design into the actual GitHub Pages LP (ISSUE-7)
- Or keep this file as reference and build fresh for ISSUE-7
