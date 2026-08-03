# 1-Slider: Evidence & Discovery Workflow (Deck Slide 3)

Use inside the final deck or as supporting artefact.

---

## How evidence flows into Smart Category Explorer

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  01 SECONDARY   │───▶│  02 PRIMARY     │───▶│  03 AI SYNTHESIS│───▶│  04 INSIGHT →   │
│  RESEARCH       │    │  SURVEY         │    │                 │    │  SOLUTION       │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
        │                      │                      │                      │
 App Store reviews        Structured              Theme extraction        Personas
 Play Store reviews       questionnaire           Pain-point clustering   Journey map
 Reddit / forums          active Q-commerce       Quote linkage           Root causes
 Social / product         shoppers                Validation pass         Feature def
```

**Pipeline (repo):** Collect → Normalize → Dedupe → Chunk → Theme Extract → Validate  
**Outputs:** 577 signals · 10 themes · 8 research Q&A views  
**Demo:** `/dashboard/discovery` · **Collect UI:** `:3001`

---

# 1-Slider: Smart Category Explorer MVP (Deck Slide 9, Phase 1)

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   TRIGGER   │───▶│  FIT SCORE   │───▶│  EXPLAINED  │───▶│   DELIVER    │───▶│  GUARDRAILS │
│             │    │  + SEGMENT   │    │  REC (LLM)  │    │   NUDGE      │    │  + TRACK    │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘    └─────────────┘
      │                   │                   │                   │                   │
 Post-order          P1 Routine            Review themes        Explained copy      Delivery time
 Daily batch         Restocker rules       Adjacent category    Trial-pack offer    Return rate
 n8n webhook         ≤2 categories         Social proof         Accept/dismiss      Abandonment
```

**Stack:** Next.js (Vercel) + n8n + Prisma + Groq LLM  
**Demo:** `/mvp` · `/demo/user/user-atharv` · **Workflows:** `workflows/`

**Product phases:** 1 Explained recs → 2 AI summaries → 3 Bundles & offers
