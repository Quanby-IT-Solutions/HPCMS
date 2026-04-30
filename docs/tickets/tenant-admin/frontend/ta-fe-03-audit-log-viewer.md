# TA-FE-03 — Audit Log Viewer Page (Filters + Detail Drawer)

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.4, 11.8 · User Flows: K3 · TOR: NFR-02, SC-01 |
| Existing Code | `apps/backend/src/common/audit/`, `apps/web/features/staff-admin/`, TA-FE-02 components |

## Scope

Page where Tenant Admins inspect audit events filtered by actor, action type, record type, and date range. Selecting a row opens a detail drawer with full payload and before/after values.

## Objectives

- Page at `/tenant-admin/audit` with `<ReportFilterBar>` + paginated audit table.
- Columns: timestamp, actor (name + role), action type, record type, record id, IP, session id.
- Click row → side drawer showing full event JSON (with before/after diff if applicable).
- Export filtered results to CSV via `<ReportExportPanel>`.
- Tenant filter scoped to the user's effective tenants.

## Out of Scope

- PHI access subset (TA-FE-05).
- Tenant boundary violations (TA-FE-12).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-02.

## Acceptance Criteria

- [ ] Page loads ≤ 1s with seeded audit entries.
- [ ] Filtering by actor restricts results.
- [ ] Date range picker correctly bounds query.
- [ ] Detail drawer shows full payload incl. before/after for update events.
- [ ] CSV export downloads matching filtered set.
- [ ] Inaccessible to Case Agent / Supervisor / Patient seed users.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, visit `/tenant-admin/audit`, filter to "Update" actions in last 7 days, open a detail drawer, export CSV.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
