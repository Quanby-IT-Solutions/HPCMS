# CA-BE-03 — Patient 360 Timeline Aggregation

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 2.6, 2.7, 4.6 · User Flows: B6 · TOR: FR-02 |
| Existing Code | `apps/backend/src/common/notifications/`, SUP-BE-05, SUP-BE-12 |

## Scope

Aggregate every interaction with a patient across channels, cases, FHIR sync events, and consent events into a unified, paginated, filterable timeline endpoint.

## Objectives

- Endpoint: `patients.timeline.list` (filters: channel, date range, case type, agent; pagination).
- Backed by a UNION query across `communications`, `case_events`, `fhir_sync_events`, `consent_events`.
- Optional `view: 'compact' | 'detailed'`.
- Tenant-scope.

## Dependencies

- CA-BE-01, SUP-BE-04, SUP-BE-05, SUP-BE-12, CA-BE-05.

## Acceptance Criteria

- [ ] Endpoint returns chronological events across all sources.
- [ ] Filters narrow results.
- [ ] Pagination works.
- [ ] Permission `patient.read` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test patient-timeline && pnpm --filter @repo/backend typecheck`.
