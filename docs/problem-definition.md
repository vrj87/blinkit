# Problem Definition — Smart Category Explorer

> Aligns with [Blinkit.pdf](./Blinkit.pdf) slides 5–8 and [EXPECTATIONS.md](./EXPECTATIONS.md).  
> Assignment brief: [problemstatement.md](./problemstatement.md) (Blinkit Growth Team PM scenario).

## Target user segment

**P1 Routine Restocker** — weekly essentials repeat buyer on quick-commerce:

- 29, salaried, metro (deck persona)
- 2–3 orders per week; same short grocery list
- Primary categories: Groceries & staples, household care
- Uses reorder / familiar search; never notices new categories
- Has **not** purchased personal care, pet supplies, or baby products on-platform

**Demo user:** Atharv Sharma (`/demo/user/user-atharv`)

Representative quote: _"I reorder in 60 seconds — I know exactly what I'll get. Never tried personal care — not sure if brands are genuine."_

---

## Root cause

**Recommendations earn neither trust nor relevance.** The journey breaks at browse:

1. **Low awareness** — new categories never surfaced where users look
2. **Trust gap** — unfamiliar brands feel risky without visible social proof
3. **Choice overload** — too many options in a two-minute shopping session
4. **Habit satisfaction** — current basket already works; reordering is faster than discovering

---

## What users need before trying something new

| Need | MVP response |
|------|----------------|
| Reviews & ratings | AI review summaries from discovery themes |
| Price comparison | Trial-pack pricing (₹99 starter) |
| Clear product info | Curated starter pack, not 200 SKUs |
| Personalised reason | Explained recommendation: “You buy coffee weekly — shoppers like you add these biscuits.” |

---

## Existing user workarounds

| Workaround | Why it persists |
|------------|-----------------|
| Buy personal care on Amazon/Nykaa | Detailed reviews, perceived authenticity |
| Ask friends / WhatsApp groups | Trusted recommendations reduce risk |
| Wait for promos (free delivery threshold) | Incentive lowers trial cost |
| Never explore — stick to same list | Fastest path; zero cognitive load |

---

## User value

- **One short verdict** instead of hundreds of reviews
- **Lowered risk** of first purchase in a new category
- **Discovery without slowing** the urgent refill habit
- **Relevant offer with a clear reason** at the right moment

---

## Business value

| Metric | Deck target (2 quarters) |
|--------|--------------------------|
| **New category MAC** | +20% customers buying a new category |
| **AOV** | +15% |
| **Recommendation CTR** | +18% |
| **Retention** | +10% repeat customer retention |

---

## AI vs research reconciliation

### What AI discovery got right
- Habitual reordering blocks exploration (confirmed survey + 6/6 interviews)
- Trust gap for personal care / unfamiliar brands (confirmed)
- Choice overload in speed-optimized sessions (confirmed)
- Social proof and trial pricing as strongest levers (confirmed 5/6 interviews)

### What primary research added
- **Triggers for new categories:** discounts, curiosity while browsing, friend recommendations (deck slide 4)
- **Timing:** post-delivery nudge preferred over checkout interruption (5/6 interviews)
- **Curation vs browse:** starter packs for most; full category link for explorers (4/6 vs 2/6)

### New insight from research only
- One bad first purchase permanently blocks category exploration for risk-averse segments (new parents) — use highest-rated SKUs only for first category orders

---

## MVP scope

**Smart Category Explorer — Phase 1 (explained recommendations):**

- **Trigger:** User completes order matching segment rules OR daily batch scan finds eligible users
- **Action:** Fit-scored adjacent category + LLM explained recommendation with review-theme context and first-try offers
- **Delivery:** Next.js prototype user page + ops dashboard
- **Orchestration:** n8n workflows calling Next.js API routes
- **Guardrails:** delivery time, return rate, cart abandonment, discount cost (deck slide 9)

**Out of scope:** Full app clone, checkout integration, push notifications (simulated in prototype), Phase 2–3 national rollout
