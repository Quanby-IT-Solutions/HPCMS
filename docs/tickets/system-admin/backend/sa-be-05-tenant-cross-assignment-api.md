# SA-BE-05 — Tenant Configuration & Cross-Tenant Assignment API

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.6, 12.2, 12.7 · User Flows: A6, L2 · TOR: SC-04 |
| Existing Code | `packages/db/schema/tenancy.ts`, `apps/backend/src/common/tenancy/` |

## Scope

Manage tenant entities and user-to-tenant assignments with per-tenant access levels (None / Read-Only / Full) and an explicit cross-facility flag. Tenant-aware authorization layer is enforced at request time via `common/tenancy`.

## Objectives

- Endpoints: `staff-admin.tenants.list`, `staff-admin.tenants.get`, `staff-admin.tenants.update`.
- Endpoint: `staff-admin.tenants.users.list` (users assigned to a tenant with their access level).
- Endpoint: `staff-admin.users.assignTenants` (multi-tenant assignment with per-tenant access level + cross-facility justification).
- Schema additions: `user_tenant_assignment` table (user_id, tenant_id, access_level enum, cross_facility bool, justification text).
- Extend `common/tenancy` middleware to consult the assignment table on every request and inject the effective `tenantId` set.
- Audit assignment changes.

## Out of Scope

- New tenant onboarding workflow (SA-BE-10).
- Tenant-specific operational settings (TA-BE-06).

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] Migration creates the assignment table.
- [ ] Assigning `agent@hpcms.local` to a second tenant with Read-Only restricts that user to read-only on the second tenant's data.
- [ ] Cross-facility flag requires non-empty justification text.
- [ ] List endpoints scope rows by the requesting user's effective tenant set.
- [ ] Audit log records every assignment change.
- [ ] Endpoint contract types round-trip.

## Verification

- **Manual demo**: via SA-FE-06 modal, assign a user, log in as that user in another browser, attempt write on second tenant, expect 403.
- **Automated check**: `pnpm --filter @repo/backend test tenants && pnpm --filter @repo/backend typecheck`.
