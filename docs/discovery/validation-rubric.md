# Insight Validation Rubric

Use this rubric after theme extraction (automated or LLM-assisted) and before Phase 2 interviews.

## Per-theme checklist

| Criterion | Pass condition |
|-----------|----------------|
| **Evidence** | ≥2 verbatim quotes from input data |
| **Multi-source** | Quotes from ≥2 sources (App Store, Play Store, Reddit, forum, social) |
| **Traceability** | Each quote links to `reviewId` and source URL |
| **Actionability** | Insight suggests a concrete product/growth action |
| **Confidence** | Label matches evidence: high (3+ mentions, 2+ sources), medium (2+), low (1 strong signal) |

## Red flags (reject or revise)

- Paraphrased quotes that don't match source text
- Theme without a clear link to a research question
- Generic insight ("users want better UX") without specificity
- Single-source theme marked high confidence

## Validation workflow

1. Run `npm run pipeline:validate` for automated checks
2. Manually spot-check 3 random themes against `raw-reviews.json`
3. Mark themes as **interview-ready** or **needs more data**
4. Export top 5 hypotheses to `docs/research/interview-guide.md`

## Sign-off

- [ ] ≥8 themes pass automated validation
- [ ] Top 5 hypotheses documented
- [ ] Discovery report (`insights.md`) updated
