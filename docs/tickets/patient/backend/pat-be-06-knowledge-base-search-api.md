# PAT-BE-06 — Knowledge Base Search API

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 6.6 · User Flows: F5 |
| Existing Code | SUP-BE-07 |

## Scope

Public + authenticated search over published knowledge base articles with ranking and category facets. Indexed on publish events from SUP-BE-07.

## Objectives

- Endpoint: `portal.kb.search` (query, optional category filter, pagination).
- Endpoint: `portal.kb.article` (slug → article body + related articles).
- Endpoint: `portal.kb.feedback` (article id, helpful boolean).
- Search uses Postgres full-text or external search index (decision documented).
- Anonymous access allowed; authenticated requests get personalization.

## Dependencies

- SUP-BE-07.

## Acceptance Criteria

- [ ] Search returns ranked results.
- [ ] Article endpoint returns related articles.
- [ ] Feedback persists.
- [ ] Empty query returns featured articles.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test kb-search && pnpm --filter @repo/backend typecheck`.
