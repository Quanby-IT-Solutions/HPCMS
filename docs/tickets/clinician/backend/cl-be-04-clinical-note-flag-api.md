# CL-BE-04 — Clinical Note & Case Flag API

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.10 · User Flows: J9 |
| Existing Code | SUP-BE-05, `apps/backend/src/common/notifications/` |

## Scope

Endpoints for clinicians to add a brief clinical note to a PCMS case or flag the case for coordinator attention. Notifications are dispatched to the assigned Case Agent.

## Objectives

- Endpoint: `clinician.notes.add` (caseId, body up to 500 chars).
- Endpoint: `clinician.flags.set` (caseId, type enum, reason).
- Schema additions: `case_notes` (clinical-only flag), `case_flags` (type, reason, set_by, set_at, cleared_at nullable).
- Notify assigned agent via `common/notifications`.
- Permission `case.note.write` and `case.flag.write` required.

## Dependencies

- CL-BE-01, SUP-BE-05.

## Acceptance Criteria

- [ ] Note saves and is visible to agents on Case Detail.
- [ ] Flag set/clear endpoints work.
- [ ] Notification dispatched and tracked.
- [ ] Audit log records both actions.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test clinician-notes && pnpm --filter @repo/backend typecheck`.
