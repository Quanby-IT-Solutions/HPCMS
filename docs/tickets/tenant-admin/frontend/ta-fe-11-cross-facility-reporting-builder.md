# TA-FE-11 — Cross-Facility Reporting Builder

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 12.4 · User Flows: L5 |
| Existing Code | TA-FE-02 |

## Scope

Report builder that aggregates metrics across the user's authorized tenants, with an optional separated-by-tenant view. Used for hospital-wide leadership reporting.

## Objectives

- Page at `/tenant-admin/reports/cross-facility` with report type cards (Case Volume, Claims Aging, Consent Coverage, Incident Rate).
- Selecting a type opens a parameter form (date range, tenant filter, additional fields).
- "Generate" renders the report below; columns show facility-separated metrics or combined view (toggle).
- Export CSV/PDF.
- Recent reports list.

## Out of Scope

- Per-tenant facility report (TA-FE-09).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-08.

## Acceptance Criteria

- [ ] Report type cards render.
- [ ] Generating "Case Volume by Facility" produces a table separated by facility for the seeded tenant.
- [ ] Combined-view toggle merges rows.
- [ ] Recent reports list shows the last 5 generations.
- [ ] Export downloads PDF.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, generate Case Volume cross-facility report.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
