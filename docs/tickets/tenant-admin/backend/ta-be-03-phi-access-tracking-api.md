# TA-BE-03 — PHI Access Tracking API

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.5 · User Flows: K4 · TOR: SC-01 |
| Existing Code | `apps/backend/src/common/audit/`, `packages/db/schema/audit.ts` |

## Scope

Tag PHI access events distinctly in the audit stream and expose a query API that lets Tenant Admin pull a focused PHI access report with anomaly indicators.

## Objectives

- Add `audit_event_type` enum value `phi_access` (or use a tag column) and emit it from every patient-data read.
- Endpoint: `compliance.phiAccess.report` (paginated, filters: date range, user, role, patient scope).
- Anomaly heuristics in service: off-hours flag (outside 08:00–18:00 local time), no-active-case flag.
- Endpoint: `compliance.phiAccess.export` (CSV/PDF).

## Out of Scope

- Real-time streaming dashboards.

## Dependencies

- TA-BE-01, TA-BE-02.

## Acceptance Criteria

- [ ] Reading a patient profile records a `phi_access` audit event.
- [ ] Report endpoint returns rows with anomaly flags computed.
- [ ] Filters narrow results.
- [ ] Export streams correctly.
- [ ] Permission `audit.view` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test phi-access && pnpm --filter @repo/backend typecheck`.
