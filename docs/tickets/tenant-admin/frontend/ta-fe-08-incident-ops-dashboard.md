# TA-FE-08 — Incident Operations Dashboard

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 7.7 · User Flows: G5 · TOR: FR-05 |
| Existing Code | TA-FE-02, `apps/backend/src/modules/v1/cases/` |

## Scope

Dashboard summarizing all active major incidents with severity, scope, and status — for executive operations awareness. Lists incidents tenant-scoped, with drill-in to the Supervisor's Incident Detail Page (SUP-FE-15).

## Objectives

- Page at `/tenant-admin/incidents` with summary KPI strip (Total active, Opened today, Nearing SLA, Resolved last 24h) and a severity distribution chart.
- Active Incident table: incident id, title, severity, affected scope summary, current status, opened timestamp.
- Click row → SUP-FE-15 incident detail.
- Filters: severity, status, department.
- Export active-incident summary report.

## Out of Scope

- Incident creation (SUP-FE-15).

## Dependencies

- TA-FE-01, TA-FE-02, SUP-BE-08.

## Acceptance Criteria

- [ ] Page renders empty state when no active incidents.
- [ ] After Supervisor creates an incident, it appears here.
- [ ] Severity distribution chart matches list counts.
- [ ] Click-through opens SUP-FE-15 with correct incident.
- [ ] Tenant Admin sees the incident detail in **read-only** mode (no severity / status edit controls, no scope edit, no resolution form); only Supervisor sees the mutation actions.
- [ ] Export downloads CSV.

## Verification

- **Manual demo**: have Supervisor create an incident; reload as `admin@hpcms.local` and see it on `/tenant-admin/incidents`.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
