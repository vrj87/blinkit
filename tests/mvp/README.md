# MVP tests

Unit tests for the Smart Category Explorer MVP live in this folder (`tests/mvp/unit/`).

## Run

From the repository root:

```bash
npm run test:mvp
```

Run all project unit tests (MVP + discovery):

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Coverage

| Module | Tests |
|--------|--------|
| `lib/segment.ts` | Eligibility rules, JSON parsing |
| `lib/product-catalog.ts` | Search, categories, cart resolution |
| `lib/api/schemas.ts` | Order and nudge API validation |
| `lib/starter-packs.ts` | Starter pack lookup |

Tests import MVP code via the `@mvp` alias configured in `vitest.config.ts`.
