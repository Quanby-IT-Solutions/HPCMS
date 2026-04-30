# TA-FE-01 — Tenant Admin IA, Navigation & Scoped Routing

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.4, 12.5 · TOR: SC-01, SC-04 |
| Existing Code | `apps/web/app/(staff)/`, `apps/web/features/auth/`, `apps/web/features/staff-admin/` |

## Scope

Define the Tenant Admin console IA, sidebar, and scope-aware route guards. The Tenant Admin sees compliance, audit, incident, facility configuration, and reporting features — all scoped to the tenant(s) they administer.

## Objectives

- Create `apps/web/app/(staff)/tenant-admin/layout.tsx` with sidebar groups: Compliance (Audit, PHI, DPA, Handoff), Operations (Incident Ops), Facility (Settings, Departments, Notifications), Cross-Tenant (Shared Policies, Cross-Facility Reports).
- Add `requireRole(['tenant_admin', 'system_admin'])` guard.
- Scope every route to the user's effective tenants (via session-injected tenant context).
- Define `tenant-admin-routes.ts` constants.

## Out of Scope

- Page bodies (TA-FE-03..TA-FE-13).

## Dependencies

- SA-FE-01.

## Acceptance Criteria

- [ ] `/tenant-admin` renders with the sidebar when logged in as `admin@hpcms.local`.
- [ ] Visiting as `agent@hpcms.local` redirects to `/dashboard`.
- [ ] System Admin can also access for cross-tenant troubleshooting.
- [ ] All sidebar items route to placeholder pages.
- [ ] Active route highlighted.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, visit `/tenant-admin`, click each sidebar item.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
