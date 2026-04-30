# CL-BE-03 — Clinician Case Summary Aggregation API

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.4 · User Flows: J4 |
| Existing Code | SUP-BE-05, CA-BE-03 |

## Scope

Aggregate the compact clinician summary for a patient: active cases with status, latest LOA status, recent communications snippet — read-only.

## Objectives

- Endpoint: `clinician.summary.get` (patientId): returns `{ patient, activeCases[], openLoa, recentCommunications[] }`.
- Cache per patient with 30-second TTL (sidebar refreshes are frequent).
- Tenant-scoped via session.
- Permission `case.read` required.

## Dependencies

- CL-BE-01, SUP-BE-05, CA-BE-03.

## Acceptance Criteria

- [ ] Endpoint returns aggregated summary in < 300ms.
- [ ] Cache hit observed on second call within 30s.
- [ ] Read-only; no mutation paths exposed.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test clinician-summary && pnpm --filter @repo/backend typecheck`.
