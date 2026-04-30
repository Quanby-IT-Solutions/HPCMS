# SA-FE-03 — User Management Page

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.2, 1.8 · User Flows: A2, A3 |
| Existing Code | `apps/web/features/staff-admin/`, `services/orpc/client.ts`, `core/components/ui/` |

## Scope

Build the User Management page where System Admins list, search, provision, deactivate, and view change history for accounts. Uses `<AdminDataTable>` from SA-FE-02. Backed by the staff-admin oRPC contract (extended in SA-BE-02).

## Objectives

- Page at `/admin/users` listing all users with columns: name, email, role, tenants, status (Active / Pending Activation / Inactive), last login.
- "Add New User" button opens an Account Provisioning Form (modal or side panel) with: full name, email, job title, department, tenant multi-select, role selector, permission summary preview.
- Row "Open" navigates to `/admin/users/[id]` showing the User Profile (details, role, tenants, status, change history log).
- "Deactivate" action opens a Deactivation Confirmation Modal with reason selector and a summary of the user's open cases / active sessions.
- Filters: status (Active/Pending/Inactive), role, tenant.

## Out of Scope

- Role-permission cell editing (SA-FE-04).
- Tenant-assignment side modal (SA-FE-06).

## Dependencies

- SA-FE-01, SA-FE-02, SA-BE-02.

## Acceptance Criteria

- [ ] `/admin/users` lists all six seed users when logged in as `system@hpcms.local`.
- [ ] Adding a new user via the form persists and the user appears in the list with status "Pending Activation".
- [ ] Activation email is sent (mocked in dev — hook into `apps/backend/src/common/email`).
- [ ] Clicking a row opens `/admin/users/[id]` with full profile and a chronological change history.
- [ ] Deactivating a user shows the open-case count and a list of active sessions in the confirmation modal.
- [ ] After deactivation, the user appears in the "Inactive" filter and not in "Active".
- [ ] Form fields validate inline (email format, required fields).
- [ ] Page is inaccessible to all non-admin seed users.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, visit `/admin/users`, provision a test user, view profile, deactivate.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
