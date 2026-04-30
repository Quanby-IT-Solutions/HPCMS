# SA-FE-06 — Tenant Configuration & User Tenant Assignment

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.6, 12.2 · User Flows: A6, L2 · TOR: SC-04 |
| Existing Code | `apps/web/features/staff-admin/`, `packages/db/schema/tenancy.ts` |

## Scope

Page that lists configured tenants (facilities) and lets the System Admin manage user-to-tenant assignments with per-tenant access levels (None / Read-Only / Full) and an explicit cross-facility flag. Backed by SA-BE-05.

## Objectives

- Page at `/admin/tenants` with two panels: Tenant List on the left, Tenant Detail on the right.
- Tenant List shows each tenant's short code, display name, status, user count, and case count.
- Tenant Detail shows facility settings summary and a "Users with access" table.
- "Manage Tenant Access" modal (also reachable from `/admin/users/[id]`) shows the facility checklist with per-tenant access-level dropdown and a "Cross-Facility" justification toggle.
- "Effective Access Matrix" subtab showing user × tenant × resource type computed permissions.

## Out of Scope

- New tenant creation wizard (SA-FE-11).
- Facility-specific operational settings (TA-FE-09).

## Dependencies

- SA-FE-01, SA-FE-02, SA-FE-03, SA-BE-05.

## Acceptance Criteria

- [ ] `/admin/tenants` lists the seeded `HPCMS Hospital` tenant.
- [ ] Selecting a tenant shows the users currently assigned with their access level.
- [ ] Modal for assigning a user supports multi-tenant selection and per-tenant access level.
- [ ] Cross-facility toggle requires a justification note before save.
- [ ] After assignment, the user's effective access updates on next session (verifiable via the user's own page access).
- [ ] Effective Access Matrix subtab renders without errors.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, assign `agent@hpcms.local` to a (newly created) second tenant with Read-Only, log in as that agent, confirm scoped data.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
