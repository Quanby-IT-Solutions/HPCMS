# SUP-FE-07 — Duplicate Detection Modal & Merge Flow

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.8 · User Flows: B7 |
| Existing Code | SUP-FE-03, SUP-BE-03 |

## Scope

Modal that surfaces during patient registration or search when a near-duplicate is detected. Shows side-by-side comparison and routes to the Merge Confirmation page with field-level resolution.

## Objectives

- `<DuplicateDetectionModal>` with side-by-side record comparison, "Use Existing" / "Merge Records" / "Create Anyway" actions.
- "Merge Records" navigates to `/supervisor/patients/[id]/merge?with=[otherId]`.
- Merge Confirmation page: per-field master selector, merge reason text, "Confirm Merge" button.
- Post-merge: redirect to surviving record with merged timeline visible; superseded record marked as merged (not deleted).

## Out of Scope

- Patient registration (SUP-FE-03).

## Dependencies

- SUP-FE-03, SUP-FE-04, SUP-BE-03.

## Acceptance Criteria

- [ ] Modal triggers on duplicate hit in registration.
- [ ] Side-by-side comparison shows differing fields highlighted.
- [ ] Merge Confirmation lets the user pick master values per field.
- [ ] After merge, communication timeline and case history attach to the surviving record.
- [ ] Superseded record is hidden from search but accessible via direct URL with a "Merged into …" notice.
- [ ] Audit log captures the merge with actor and reason.

## Verification

- **Manual demo**: register a near-duplicate of Maria Santos, trigger modal, complete merge.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
