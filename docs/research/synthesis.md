# Research Synthesis

**Segment studied:** P1 Routine Restocker — weekly essentials repeat buyers (2–3 orders/week, ≤2 categories)  
**Methods:** Primary survey (n=40, [questionnaire](https://docs.google.com/forms/d/e/1FAIpQLScAJAfUjeyQm-bw0qCQdlk2LKf0RM0S5bhXcIFsdiLjgRHSAg/viewform?pli=1) · [responses](https://docs.google.com/spreadsheets/d/1aGnzWyNH2nMwUDRZnC6xTcms9RwCW5R8gzDuA0Szmtw/edit?gid=0#gid=0)) + 6 semi-structured interviews for depth validation  
**Recruitment:** Survey distributed to active Q-commerce users; interviews via personal network + screener ([session summaries](./interviews/session-summaries.md)).  
**Survey summary:** [survey-summary.md](./survey-summary.md)

---

## Top 3 root causes

### 1. Reorder loops optimize for speed, blocking exploration mindset
Users open quick-commerce apps with a refill job-to-be-done. "Buy Again" delivers in one tap. Exploration requires a different mental mode that the current UX doesn't trigger.

### 2. Trust anxiety for non-essential categories
Personal care, baby, and pet categories carry perceived risk (authenticity, wrong size, no reviews). Users default to Amazon/Nykaa for these even when they trust Blinkit for groceries.

### 3. Discovery UI serves known-item search, not category expansion
Homepage promotions feel random. Users don't discover adjacent categories unless prompted externally (friends, social media, banners they happen to notice).

---

## Existing workarounds

- Buy non-grocery categories on Amazon/Nykaa where reviews exist
- Ask friends or WhatsApp groups for recommendations
- Wait for promos ("add ₹200 personal care for free delivery")
- Stick to the same list indefinitely

---

## What users want (validated)

1. **Post-order nudge** (not at checkout) suggesting one adjacent category
2. **Risk reducers:** ₹99 trial pack, bestseller badge, easy returns
3. **Social proof:** "Others like you tried this"
4. **Curated starter pack** instead of browsing 200 SKUs

---

## AI vs research reconciliation

| AI insight | Research outcome |
|------------|------------------|
| Reorder loops cause lock-in | **Confirmed** — universal across 6/6 |
| Trust blocks personal care | **Confirmed** — #1 stated barrier |
| Social proof drives trial | **Confirmed** — 4/6 cited word-of-mouth |
| Homepage discovery broken | **Mostly confirmed** — 1 user browses on non-urgent days |
| Post-order nudge concept | **New nuance** — users prefer post-delivery over checkout (AI didn't specify timing) |

---

## MVP implications

- Trigger nudge **after order confirmation / delivery**, not during checkout
- Target **groceries → personal care** as primary adjacent category
- Lead with **trial pack + social proof + return policy**
- Segment rule: 3+ orders/month, ≤2 categories, no personal care in 90 days
