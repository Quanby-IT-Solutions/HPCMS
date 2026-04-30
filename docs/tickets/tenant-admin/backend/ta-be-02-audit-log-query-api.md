# TA-BE-02 — Audit Log Query API (Extend `common/audit`)

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.7, 11.4 · User Flows: K3 · TOR: NFR-02 |
| Existing Code | `apps/backend/src/common/audit/`, `packages/db/schema/audit.ts` |

## Scope

Expose query endpoints over the existing audit log table with filtering by actor, role, action type, record type, date range, and tenant. Provide login-event subset endpoints for TA-FE-04.

## Objectives

- Endpoint: `compliance.audit.list` (paginated, filters).
- Endpoint: `compliance.audit.get` (event detail with before/after diff).
- Endpoint: `compliance.audit.logins.list` and `.kpis` for the login dashboard.
- Endpoint: `compliance.audit.export` (streams CSV/JSON respecting filters).
- Tenant-scope all queries; system_admin can pass `?allTenants=true`.

## Out of Scope

- Audit-event emission (each feature already writes via `common/audit`).

## Dependencies

- TA-BE-01.

## Acceptance Criteria

- [ ] Listing returns events scoped to caller's tenants.
- [ ] Detail endpoint returns full payload.
- [ ] Login KPIs reflect seeded login events.
- [ ] Export streams large result sets without OOM.
- [ ] Permission `audit.view` required (RBAC SA-BE-04).

## Verification

- **Automated check**: `pnpm --filter @repo/backend test audit-query && pnpm --filter @repo/backend typecheck`.
