# Deck alignment — submission deck

**Authoritative submission file:** [`docs/Blinkit.pdf`](./Blinkit.pdf) — this is the deck that will be submitted.

This document maps the submitted **Smart Category Explorer** deck to the assignment brief ([problemstatement.md](./problemstatement.md)) and the implemented repo.

## Deck summary (10 slides)

| Slide | Key message | Repo artefact |
|-------|-------------|---------------|
| 1 | Retention is high; discovery is stuck — Smart Category Explorer for quick-commerce (Blinkit) | [README](../README.md), MVP home |
| 2 | North-star: % MAC buying ≥1 new category/month; +20% exploration, +15% AOV targets | [problem-definition.md](./problem-definition.md) |
| 3 | Evidence: secondary research + primary survey + AI synthesis | [discovery pipeline](../tools/discovery-pipeline/), [dashboard](/dashboard/discovery) |
| 4 | Habitual ordering; triggers for new categories (offers, curiosity, friends) | [insights.md](./discovery/insights.md), [research-questions](../apps/mvp/lib/research-questions.ts) |
| 5 | Four barriers: awareness, trust, choice overload, habit satisfaction | Themes in `data/discovery/themes.json` |
| 6 | Journey breaks at browse — **P1 Routine Restocker** persona | Demo: `/demo/user/user-atharv` |
| 7 | Root cause: generic recs; AI closes gap via fit scoring + explained recs | [lib/llm.ts](../apps/mvp/lib/llm.ts), nudge workflow |
| 8 | **Smart Category Explorer** — explained recs, AI summaries, bundles | MVP nudge card + discovery dashboard |
| 9 | 3-phase rollout with guardrails (speed, trust, margin) | [architecture.md](./architecture.md#product-rollout-phases) |
| 10 | Success: +20% exploration, +18% CTR, +15% AOV, +10% retention | [EXPECTATIONS.md](./EXPECTATIONS.md) |

## Alignment with problem statement

| Requirement | Deck | Project implementation | Status |
|-------------|------|------------------------|--------|
| AI discovery engine (reviews, Reddit, forums, social) | Slide 3 — secondary research + AI synthesis | 577 normalized signals, 10 themes, 10/10 validated | **Met** |
| 8 research questions answered | Implicit in slides 4–7 | Q&A UI at `/dashboard/discovery` | **Met** |
| Workflow demo + 1-slider | Slide 3 artefacts | `apps/collect`, `docs/deck/workflow-diagram.md`, discovery dashboard | **Met** |
| Primary research (5–6 interviews) | Deck cites **survey** (n=40) + interviews for depth | [Survey](https://docs.google.com/forms/d/e/1FAIpQLScAJAfUjeyQm-bw0qCQdlk2LKf0RM0S5bhXcIFsdiLjgRHSAg/viewform?pli=1) · [Responses](https://docs.google.com/spreadsheets/d/1aGnzWyNH2nMwUDRZnC6xTcms9RwCW5R8gzDuA0Szmtw/edit?gid=0#gid=0) · 6 interviews | **Met** |
| Problem definition (segment, root cause, value) | Slides 5–7 | [problem-definition.md](./problem-definition.md) | **Met** (updated to match deck) |
| AI-native MVP deployed | Slide 8–9 | Next.js MVP + n8n workflows | **Ready** — deploy via `scripts/deploy-prod.cmd` |
| 10-slide PDF, no fellow name | `docs/Blinkit.pdf` | **Final submission deck** | **Done** |

## Platform naming

- **Assignment brief:** Blinkit (Growth Team PM scenario).
- **Submitted deck:** Blinkit as the example quick-commerce platform.
- **Repo:** Blinkit-focused quick-commerce research (Blinkit primary; Instamart/BigBasket as competitive corpus). MVP branded **Smart Category Explorer**.

## Four barriers → discovery themes

| Deck barrier | Theme ID(s) |
|--------------|-------------|
| Low awareness | `theme-discovery-friction` |
| Trust gap | `theme-trust-risk` |
| Choice overload | `theme-choice-overload` |
| Habit satisfaction | `theme-habit-reorder`, `theme-speed-transactional` |

## Persona mapping

| Deck persona | Demo user | Profile |
|--------------|-----------|---------|
| P1 Routine Restocker | `user-atharv` (Atharv Sharma) | 29, metro, 2–3×/week groceries, same short list, never notices new categories |

## Gaps to close before submission

1. **Production URL** — deploy MVP; hyperlink in `docs/Blinkit.pdf` slides 3 & 8.

## Completed in submission deck

- **Slide 3** — survey hyperlinks in `docs/Blinkit.pdf`:
  - [Questionnaire](https://docs.google.com/forms/d/e/1FAIpQLScAJAfUjeyQm-bw0qCQdlk2LKf0RM0S5bhXcIFsdiLjgRHSAg/viewform?pli=1)
  - [Response summary](https://docs.google.com/spreadsheets/d/1aGnzWyNH2nMwUDRZnC6xTcms9RwCW5R8gzDuA0Szmtw/edit?gid=0#gid=0)
