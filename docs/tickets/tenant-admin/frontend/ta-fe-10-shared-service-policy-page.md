# TA-FE-10 — Shared Service Policy Page

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.3 · User Flows: L4 · TOR: SC-04 |
| Existing Code | TA-FE-02, `apps/backend/src/common/tenancy/` |

## Scope

Page where Tenant Admins define which shared services (e.g., Central Claims Processing, Shared Care Program Management) operate across tenants and which roles at each tenant participate.

## Objectives

- Page at `/tenant-admin/shared-services` listing active shared policies with: service name, participating tenants, access level, edit/delete actions.
- "Add Shared Policy" form: service name, participating tenants (multi-select), access level (read/create/update), role scopes per tenant, justification.
- Confirmation modal listing affected users on save.

## Out of Scope

- Cross-facility reports (TA-FE-11).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-07.

## Acceptance Criteria

- [ ] Listing shows ≥ 0 policies.
- [ ] Adding a "Central Claims Processing" policy spanning two tenants persists.
- [ ] Affected user count is shown in the confirm modal.
- [ ] Edit/delete updates the policy and audits the change.
- [ ] Inaccessible to non-admin users.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, create a shared policy with two tenants present.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
