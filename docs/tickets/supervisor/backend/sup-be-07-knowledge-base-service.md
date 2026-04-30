# SUP-BE-07 — Knowledge Base Content Service

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 5.8 · User Flows: E8 |
| Existing Code | `apps/backend/src/common/storage/` |

## Scope

Persist knowledge base articles (Markdown content, categories, tags, status, version history) and expose CRUD endpoints. Notify the patient-search index on publish (PAT-BE-06) and the chatbot retrieval engine (PAT-BE-07).

## Objectives

- Schema: `kb_articles` (id, tenant_id, title, slug, body_md, category_id, tags jsonb, status enum, published_at, created_by, last_modified_by).
- Schema: `kb_categories` (hierarchy support).
- Endpoints: `kb.articles.*` (CRUD + publish + archive), `kb.categories.*`.
- Image upload via `common/storage`.
- Audit publish/archive events.
- Re-index hook on publish.

## Dependencies

- SUP-BE-01.

## Acceptance Criteria

- [ ] Migrations create both tables.
- [ ] Article CRUD round-trip works.
- [ ] Publish triggers re-index and is audited.
- [ ] Image uploads stored securely.
- [ ] Permission `kb.publish` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test kb && pnpm --filter @repo/backend typecheck`.
