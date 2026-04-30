# CA-BE-04 — Case Queue & Filter API

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.2, 3.4, 3.9 · User Flows: C2 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, SUP-BE-05, SUP-BE-06 |

## Scope

Cases listing endpoint optimized for the queue dashboard: server-side pagination, sort, filter, and KPI aggregations.

## Objectives

- Endpoint: `cases.queue.list` (filters: priority, type, status, agent, date range, risk level; sort: priority/SLA/age/last-update).
- Endpoint: `cases.queue.kpis` (Open / Pending / Escalated / SLA-at-risk).
- Joins to `case_risk_scores` (SUP-BE-06) and SLA computation.
- Tenant-scope.

## Dependencies

- CA-BE-01, SUP-BE-05, SUP-BE-06.

## Acceptance Criteria

- [ ] List query returns paginated cases sorted by chosen field.
- [ ] KPIs match seeded data.
- [ ] Filters narrow results.
- [ ] Permission `case.read` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test case-queue && pnpm --filter @repo/backend typecheck`.
