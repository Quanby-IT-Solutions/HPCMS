# TA-FE-07 — JCI Continuity Handoff Audit Page

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.7 · User Flows: K6 · TOR: SC-03 |
| Existing Code | TA-FE-02, `apps/backend/src/common/audit/` |

## Scope

Page that lists every patient/case handoff between departments or care teams with a completeness flag indicating whether case notes, consent status, and communication history transferred. Used for JCI accreditation evidence.

## Objectives

- Page at `/tenant-admin/compliance/handoffs` with filter panel (date range, department, case type) and result table.
- Columns: handoff timestamp, patient, case id, originating team, receiving team, completeness flag (✓ / ✗ with hover detail).
- Drill-in to "Case Transfer History" panel (timeline of all assignment events for a case).
- Export CSV/PDF for accreditation review.

## Out of Scope

- Case assignment UI (SUP-FE-08).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-05.

## Acceptance Criteria

- [ ] Page lists at least seeded handoff events.
- [ ] Completeness flag shows red when case notes or consent were missing at transfer time.
- [ ] Drill-in shows full timeline.
- [ ] Filters narrow results.
- [ ] Export downloads PDF.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, visit `/tenant-admin/compliance/handoffs`, drill into a handoff.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
