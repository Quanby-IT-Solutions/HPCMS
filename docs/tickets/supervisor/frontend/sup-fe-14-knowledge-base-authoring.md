# SUP-FE-14 — Knowledge Base Authoring (Article Editor + Categories)

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 5.8 · User Flows: E8 |
| Existing Code | SUP-FE-01, `<AdminDataTable>` (SA-FE-02) |

## Scope

Authoring suite for the patient-facing knowledge base: article list, rich-text editor, category management, preview, and publish flow.

## Objectives

- Page at `/supervisor/knowledge-base` listing articles with status badges and category filter.
- "New Article" opens the editor: title, category selector, tag input, rich-text body, embedded image support, save-draft and publish actions.
- Article Categories page with hierarchy editing.
- Article Preview Page renders patient-facing layout.
- Publish event updates patient portal search index (PAT-BE-06).

## Out of Scope

- Patient-facing search (PAT-FE-09).
- Chatbot retrieval (PAT-BE-07).

## Dependencies

- SUP-FE-01, SUP-BE-07.

## Acceptance Criteria

- [ ] Article list renders.
- [ ] Editor saves draft and publishes; preview matches patient view.
- [ ] Categories CRUD works.
- [ ] Tags persist and surface in search.
- [ ] Audit captures publication events.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, publish "HMO LOA Requirements" article, open patient portal search to confirm.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
