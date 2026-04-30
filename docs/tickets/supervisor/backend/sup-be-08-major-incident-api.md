# SUP-BE-08 — Major Incident Aggregation API

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 7.1–7.8 · User Flows: G1–G5 · TOR: FR-05 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, SUP-BE-01 |

## Scope

Persist major incidents and their relationship to cases, support severity/status updates, root cause and resolution documentation, and drive both Supervisor (SUP-FE-15) and Tenant Admin (TA-FE-08) views.

## Objectives

- Schema: `incidents` (id, tenant_id, title, description, severity enum, status enum, opened_at, resolved_at, root_cause, resolution_actions, created_by).
- Schema: `incident_cases` (incident_id, case_id) and `incident_scope` (incident_id, departments jsonb, cohorts jsonb, systems jsonb, impact_count).
- Endpoints: `incidents.create`, `incidents.update`, `incidents.attachCases`, `incidents.detachCase`, `incidents.list`, `incidents.get`, `incidents.kpis`.
- Status transitions audited.
- Linked cases automatically display incident reference (via `cases.get`).

## Dependencies

- SUP-BE-01, SUP-BE-05.

## Acceptance Criteria

- [ ] Migrations create the three tables.
- [ ] Creating an incident requires ≥ 2 attached cases.
- [ ] Severity / status updates appear in incident audit history.
- [ ] Root cause and resolution persist with timestamps.
- [ ] KPI endpoint returns counts by severity and status.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test incidents && pnpm --filter @repo/backend typecheck`.
