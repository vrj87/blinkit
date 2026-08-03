# Project expectations (post-deck)

**Submission deck:** [Blinkit.pdf](./Blinkit.pdf) — final PDF to submit.

Updated to align [Blinkit.pdf](./Blinkit.pdf) with [problemstatement.md](./problemstatement.md) and [architecture.md](./architecture.md).

## Product

**Smart Category Explorer** — an AI-driven feature to grow cross-category purchases on Blinkit (primary platform; Instamart/BigBasket in competitive research corpus).

## North-star metric

**Share of monthly active customers (MAC) who purchase from at least one new product category each month.**

Measured monthly, per city cohort, against a matched control group.

## Target outcomes (two quarters — from deck)

| Metric | Target |
|--------|--------|
| Category exploration (new category buyers) | +20% |
| Average order value | +15% |
| Recommendation click-through | +18% |
| Repeat customer retention | +10% |

## Evidence base

1. **Secondary research** — App Store, Play Store, Reddit, forums, social, product reviews (577 signals → 10 validated themes).
2. **Primary research** — [Blinkit Shopping Behaviour Survey](https://docs.google.com/forms/d/e/1FAIpQLScAJAfUjeyQm-bw0qCQdlk2LKf0RM0S5bhXcIFsdiLjgRHSAg/viewform?pli=1) (n=40); [responses](https://docs.google.com/spreadsheets/d/1aGnzWyNH2nMwUDRZnC6xTcms9RwCW5R8gzDuA0Szmtw/edit?gid=0#gid=0); supplemented by 6 interviews ([summary](./docs/research/survey-summary.md)).
3. **AI-assisted synthesis** — Theme extraction, quote linkage, validation pass.
4. **Insight → solution** — Personas, journey map, root causes, feature definition.

## Target segment

**P1 Routine Restocker** — weekly essentials buyer, 2–3 orders/week, groceries & staples focus, ≤2 categories on platform, reorder-driven habit.

Demo: `/demo/user/user-atharv`

## Root cause (validated)

Recommendations earn neither **trust** nor **relevance**. Reordering is faster than discovering; new categories are not surfaced where users look; reviews/ratings are not visible in-flow.

## Solution pillars (MVP maps to Phase 1 of product rollout)

| Pillar | MVP implementation |
|--------|-------------------|
| Explained recommendations | LLM nudge with rationale + “shoppers like you” copy |
| Personalised category picks | Segment rules + adjacent-category scoring |
| AI review summaries | Discovery themes as RAG context in nudge generation |
| Smart bundles & first-try offers | Risk reducers: ₹99 trial pack, bestseller, easy returns |

## Product rollout phases (deck slide 9)

| Phase | Scope | Guardrails |
|-------|-------|------------|
| **1** | Explained recommendations — rules-based fit on home feed; A/B one city | Delivery time flat; return rate in range; cart abandonment stable |
| **2** | AI review summaries on product cards | Discount cost per order capped |
| **3** | Bundles & first-try offers — margin-aware discounting, national | Same guardrails |

**MVP in this repo** = Phase 1 prototype (workflow + explained nudge surface).

## Deliverables checklist

| # | Item | Location |
|---|------|----------|
| 1 | Review analysis workflow | `apps/collect` (:3001), `/dashboard/discovery` |
| 2 | Workflow test / demo | `npm run discovery:all`, collect UI |
| 3 | 1-slider in deck | `docs/deck/workflow-diagram.md` |
| 4 | 10-slide PDF | **`docs/Blinkit.pdf`** (submission file) |
| 5 | Deployed MVP | Vercel — run `scripts/deploy-prod.cmd` |

## What success looks like in demo

1. Discovery dashboard shows 8 research Q&A with theme evidence.
2. Atharv (P1) completes grocery order → Smart Category Explorer nudge appears.
3. Nudge includes explained reason, social proof, trial-pack offer.
4. Ops dashboard tracks eligible → nudged → accepted funnel.
