# TA-FE-02 — Reporting/Dashboard Component Library

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Frontend Design & UI/UX |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.4, 11.6, 12.4 · TOR: NFR-02 |
| Existing Code | `apps/web/core/components/ui/`, `apps/web/features/staff-admin/components/` |

## Scope

Build reusable dashboard primitives used by every Tenant Admin reporting page: KPI cards, time-series chart wrapper, severity/status badges, filter bar, and report-export panel.

## Objectives

- `<KpiCard>` with label, value, trend delta, sparkline.
- `<TimeSeriesChart>` (line/bar) wrapping a charting library; accepts dataset + axis config.
- `<SeverityBadge>` and `<StatusBadge>` with consistent color tokens.
- `<ReportFilterBar>` with date range, multi-tenant, and freeform filter slots.
- `<ReportExportPanel>` with CSV / PDF format selector and download progress.
- Showcase route `/tenant-admin/__design`.

## Out of Scope

- Specific report bodies.

## Dependencies

- TA-FE-01.

## Acceptance Criteria

- [ ] Showcase page renders all primitives with prop variations.
- [ ] Components are typed with no `any`.
- [ ] Tailwind `size-*` used for square dimensions.
- [ ] CSV download produced from a sample dataset works.

## Verification

- **Manual demo**: visit `/tenant-admin/__design` as Tenant Admin.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
