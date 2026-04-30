# TA-FE-14 — Compliance oRPC Wiring + Report Export (CSV/PDF)

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 1 |
| Source Refs | All TA stories |
| Existing Code | `apps/web/services/orpc/`, `services/tanstack-query/`, TA-FE-02 |

## Scope

Wire all Tenant Admin pages to backend APIs via the existing oRPC client and add shared CSV/PDF export utilities used by every report page.

## Objectives

- Add `features/staff-admin/api/tenant-admin.hooks.ts` with `useAuditLog*`, `usePhiAccess*`, `useDpaReport*`, `useHandoffAudit*`, `useIncidentOps*`, `useFacilityConfig*`, `useSharedPolicies*`, `useCrossFacilityReports*`, `useBoundaryViolations*` hooks.
- CSV export utility that streams server-side filtered data via the corresponding `*.export` endpoint.
- PDF export via server-side render endpoint or `@react-pdf/renderer` client lib (decide per implementer; document choice).
- Toast handling for 403/expiry consistent with SA-FE-12.

## Out of Scope

- Backend export endpoints (TA-BE-* tickets).

## Dependencies

- TA-FE-01, TA-FE-02, all TA-BE-* tickets.

## Acceptance Criteria

- [ ] Every TA page consumes hooks from `tenant-admin.hooks.ts` (no direct `fetch` calls).
- [ ] CSV export downloads a streamed file matching active filters.
- [ ] PDF export renders a printable layout.
- [ ] 403 redirects to `/dashboard` with toast.
- [ ] Smoke test verifies hook exports.

## Verification

- **Manual demo**: from any TA page, export CSV and PDF.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint && pnpm --filter @repo/web test tenant-admin-hooks`.
