# TA-BE-08 — Cross-Facility Reporting API + Tenant-Aware Aggregations

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 12.4 · User Flows: L5 |
| Existing Code | TA-BE-02, SA-BE-05 |

## Scope

Aggregation endpoints that compute case volume, claims aging, consent coverage, and incident rate across the requesting user's authorized tenants, with optional tenant-separated output.

## Objectives

- Endpoint: `tenantAdmin.crossFacilityReports.types` (lists report types).
- Endpoint: `tenantAdmin.crossFacilityReports.generate` (params: type, date range, tenants, view mode).
- Endpoint: `tenantAdmin.crossFacilityReports.export`.
- Aggregations executed in SQL with tenant grouping; respect requester tenant scope.
- Cache results for 5 minutes per parameter signature.

## Dependencies

- TA-BE-01, TA-BE-02, SA-BE-05.

## Acceptance Criteria

- [ ] Listing report types returns at least four.
- [ ] Generating "Case Volume" returns rows with facility-level breakdown.
- [ ] Combined-view request returns merged rows.
- [ ] Cache hit observed on identical second call.
- [ ] Tenant scope respected.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test cross-facility && pnpm --filter @repo/backend typecheck`.
