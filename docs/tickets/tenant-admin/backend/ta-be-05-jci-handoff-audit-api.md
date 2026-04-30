# TA-BE-05 — JCI Handoff Audit API

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.7 · User Flows: K6 · TOR: SC-03 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, `apps/backend/src/common/audit/` |

## Scope

Expose every case assignment / team transfer event with a completeness flag indicating whether case notes, consent flags, and communication history were attached at the time of transfer. Used for JCI accreditation evidence.

## Objectives

- Endpoint: `compliance.handoffs.list` (paginated, filters: date range, department, case type).
- Endpoint: `compliance.handoffs.case.timeline` (full assignment timeline for one case).
- Completeness computation: at handoff time, snapshot whether consent_status, recent_communications, case_notes were non-null.
- Export CSV/PDF.

## Dependencies

- TA-BE-01, TA-BE-02.

## Acceptance Criteria

- [ ] Listing returns handoff events from the seeded cases.
- [ ] Completeness flag computes correctly given test fixtures.
- [ ] Timeline endpoint returns chronological events.
- [ ] Permission `audit.view` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test handoff-audit && pnpm --filter @repo/backend typecheck`.
