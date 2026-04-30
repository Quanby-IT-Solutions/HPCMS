# SA-FE-01 — Admin Console IA & RBAC Routing Guards

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.1, 1.2, 1.6, 1.8 · User Flows: A1–A6 · TOR: SC-04 |
| Existing Code | `apps/web/app/(staff)/`, `apps/web/features/auth/`, `apps/web/features/staff-admin/`, `apps/web/services/better-auth/` |

## Scope

Define the information architecture, sidebar navigation, route group, and RBAC route guards for the System Admin console under the existing `(staff)` route group. Establishes the layout shell and `system_admin`-only access control that every other SA-FE ticket depends on.

## Objectives

- Create `apps/web/app/(staff)/admin/layout.tsx` rendering an admin sidebar (User Management, Roles, Security, Tenants, Case Types, Routing Rules, AI Triage, FHIR Settings, Facilities) and a top-bar with current admin identity.
- Add a `requireRole(['system_admin'])` server guard in `apps/web/features/auth/lib/` that 302-redirects non-admins to `/dashboard` and returns the session for use in admin pages.
- Define route slugs for every SA-FE-03..SA-FE-11 page in a single source-of-truth constants file (`features/staff-admin/lib/admin-routes.ts`).
- Wire the admin sidebar to highlight the active route.
- Document the IA decision (sidebar groups, breadcrumb pattern) in a short JSDoc on the layout.

## Out of Scope

- Page bodies (covered by SA-FE-03..SA-FE-11).
- Backend RBAC (covered by SA-BE-04).

## Dependencies

- None (foundational).

## Acceptance Criteria

- [ ] `/admin` route exists and renders the sidebar shell when logged in as `system@hpcms.local`.
- [ ] Logging in as `agent@hpcms.local` and visiting `/admin` redirects to `/dashboard`.
- [ ] All nine admin sidebar items render and route to placeholder pages (`<h1>{title}</h1>`).
- [ ] Active route is visually highlighted in the sidebar.
- [ ] Admin route slugs are imported from `admin-routes.ts` (no hard-coded strings in the sidebar).
- [ ] `requireRole` guard rejects all five non-admin seed roles.

## Verification

- **Manual demo**: log in as `system@hpcms.local` / `DevPass123!`, visit `/admin`, confirm sidebar; log out, log in as `agent@hpcms.local`, visit `/admin`, confirm redirect.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
