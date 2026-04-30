# SA-BE-02 — User Provisioning API

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.2, 1.8 · User Flows: A2, A3 |
| Existing Code | `apps/backend/src/modules/v1/staff-admin/`, `packages/auth/`, `packages/db/schema/auth.ts`, `apps/backend/src/common/email/` |

## Scope

Implement oRPC endpoints for listing, creating, deactivating, reactivating, and viewing change history for user accounts. Extends the existing `staff-admin` module.

## Objectives

- Endpoint: `staff-admin.users.list` (paginated, search, filters: status, role, tenant).
- Endpoint: `staff-admin.users.create` — accepts name, email, role, tenant IDs, job title; creates Better Auth user with `pending_activation` status; emits an activation email via `common/email`.
- Endpoint: `staff-admin.users.get` — returns user with role, tenant assignments, change history.
- Endpoint: `staff-admin.users.deactivate` — revokes sessions, sets status, records reason in audit, returns the user's open-case count.
- Endpoint: `staff-admin.users.reactivate`.
- Append every mutation to the audit log (`common/audit`).
- Define Zod schemas in `@repo/contracts/modules/v1/staff-admin/users.contract.ts`.

## Out of Scope

- Tenant assignment endpoint (SA-BE-05).
- Password policy enforcement (SA-BE-03).

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] `staff-admin.users.list` returns paginated results scoped to `system_admin` callers.
- [ ] Creating a user emits an activation email and creates a Better Auth user record.
- [ ] Deactivating a user immediately revokes existing sessions.
- [ ] Audit entries are written for create/deactivate/reactivate.
- [ ] All endpoints reject non-`system_admin` callers with 403.
- [ ] Contract type round-trip (server → `@repo/contracts` → web) works.
- [ ] Unit test coverage for service ≥ 80% for these endpoints.

## Verification

- **Manual demo**: from `apps/web` admin UI (SA-FE-03), provision and deactivate a user; observe DB and audit table.
- **Automated check**: `pnpm --filter @repo/backend test staff-admin/users && pnpm --filter @repo/backend typecheck`.
