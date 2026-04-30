# PAT-FE-09 — Knowledge Base Search & Article Detail

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 6.6 · User Flows: F5 |
| Existing Code | PAT-FE-01, PAT-FE-02, SUP-BE-07, PAT-BE-06 |

## Scope

Patient-facing knowledge base with search, featured categories, and article detail page. Accessible both authenticated and as a public landing page.

## Objectives

- `/portal/kb` with prominent search bar, featured categories cards, popular articles strip.
- `/portal/kb/article/[slug]` article detail with title, body (markdown rendered), related articles, "Was this helpful?" feedback.
- "No results" state suggests starting a chatbot conversation or contact form.
- Breadcrumb navigation.

## Dependencies

- PAT-FE-01, PAT-FE-02, PAT-BE-06.

## Acceptance Criteria

- [ ] Search returns ranked results.
- [ ] Article detail renders markdown safely.
- [ ] Helpful feedback widget records vote.
- [ ] No-results state shows fallback options.

## Verification

- **Manual demo**: search "HMO LOA requirements", open a result.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
