# TA-FE-12 — Tenant Boundary Violation Report

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.8 · TOR: SC-04 |
| Existing Code | TA-FE-02, `apps/backend/src/common/tenancy/`, `apps/backend/src/common/audit/` |

## Scope

Page that lists audit events flagged as cross-tenant access attempts where the requester lacked the necessary cross-facility permission. Provides drill-in for investigation.

## Objectives

- Page at `/tenant-admin/security/boundary-violations` with KPI strip (Violations today, Last 7d, Distinct users) and result table.
- Columns: timestamp, user, role, source tenant, target tenant, attempted resource, outcome (blocked / allowed-with-flag).
- Drill-in to TA-FE-03 audit detail.
- Filters: outcome, user, date range.
- Export CSV.

## Out of Scope

- Granting cross-facility access (SA-FE-06).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-09.

## Acceptance Criteria

- [ ] Page renders the table.
- [ ] Each row drill-in opens the underlying audit event.
- [ ] CSV export works.
- [ ] Inaccessible to non-admin roles.

## Verification

- **Manual demo**: as `admin@hpcms.local`, force a cross-tenant attempt by another seeded user, refresh, see the violation.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
