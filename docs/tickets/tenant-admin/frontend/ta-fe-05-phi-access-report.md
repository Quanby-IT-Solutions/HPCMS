# TA-FE-05 — PHI Access Report Page

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.5 · User Flows: K4 · TOR: SC-01 |
| Existing Code | TA-FE-02 components, `apps/backend/src/common/audit/` |

## Scope

Page that lets Tenant Admin generate and review every access event to PHI within a date range, scoped to the tenant. Used to detect inappropriate access (off-hours, unrelated patients, etc.).

## Objectives

- Page at `/tenant-admin/compliance/phi-access` with parameter form (date range, user / role filter, patient scope) and "Generate Report".
- Result table: user, role, patient, access context (case view / profile view / timeline view), timestamp, facility.
- Anomaly highlighters (off-hours access, access without active case relationship) — visual flag column.
- Click row → drill-in to TA-FE-03.
- Export CSV / PDF.

## Out of Scope

- Whole-organization aggregate (covered by TA-FE-06).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-03.

## Acceptance Criteria

- [ ] Generating with default range returns ≥ 1 access row from seeded data.
- [ ] Filter by role restricts results.
- [ ] Anomaly flags surface when access happens outside 08:00–18:00 local time.
- [ ] Export downloads report in selected format.
- [ ] Inaccessible to non-admin users.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, generate the PHI report for "last 30 days", inspect anomaly flags.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
