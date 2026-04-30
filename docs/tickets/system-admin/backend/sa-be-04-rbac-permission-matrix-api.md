# SA-BE-04 — RBAC Permission Matrix API + Guard Utilities

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.2 · TOR: SC-04, NFR-04 |
| Existing Code | `packages/db/schema/auth.ts` (`user_role` enum), `apps/backend/src/shared/` |

## Scope

Define the canonical permission catalog, persist per-role overrides, and expose decorators/guards that controllers use to enforce RBAC. The API is read/write for `system_admin` only and read-only for the rest.

## Objectives

- Schema: `permissions` table (key, description, default-by-role JSON) and `role_permission_overrides` table (role × permission key × granted bool).
- Seed canonical permissions: `case.create`, `case.escalate`, `case.resolve`, `audit.view`, `audit.export`, `tenant.assign`, `kb.publish`, `incident.create`, `claim.create`, `xml.export`, `fhir.write`, etc.
- Endpoints: `staff-admin.roles.matrix.get` and `staff-admin.roles.matrix.update`.
- `@RequirePermission('case.escalate')` decorator and a `PermissionGuard` that pulls the user's role's effective permissions.
- Cache effective permissions per session.

## Out of Scope

- UI editing matrix (SA-FE-04).
- User-level permission overrides (out of demo).

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] Migration creates `permissions` and `role_permission_overrides` tables and seeds the catalog.
- [ ] `roles.matrix.get` returns the full matrix.
- [ ] `roles.matrix.update` persists a diff.
- [ ] `@RequirePermission('audit.view')` allows `tenant_admin` and rejects `case_agent` with 403.
- [ ] System Admin always passes any permission check.
- [ ] Permission cache invalidates on matrix update.

## Verification

- **Manual demo**: revoke `case.escalate` from `case_supervisor`, log in as supervisor, attempt escalation, expect 403.
- **Automated check**: `pnpm --filter @repo/backend test rbac && pnpm --filter @repo/backend typecheck`.
