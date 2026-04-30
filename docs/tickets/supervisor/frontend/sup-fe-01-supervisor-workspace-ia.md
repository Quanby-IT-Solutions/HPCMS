# SUP-FE-01 — Supervisor Workspace IA & Shared Layouts

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | All Section B/C/G/H/J/K user flows |
| Existing Code | `apps/web/app/(staff)/`, `apps/web/features/staff-case-queue/`, `staff-case-detail/` |

## Scope

Define the Supervisor workspace layout, sidebar, and route map. Supervisors live mostly in patients, cases, incidents, programs/devices, knowledge base, and AI insights. Establish the shared layout shell and route guards.

## Objectives

- Create `apps/web/app/(staff)/supervisor/layout.tsx` with sidebar groups: Patients, Cases, Incidents, Programs & Devices, Knowledge Base, AI Insights.
- `requireRole(['case_supervisor', 'tenant_admin', 'system_admin'])`.
- Route constants in `features/staff-admin/lib/supervisor-routes.ts`.
- Reuse the `(staff)` shell where possible.

## Out of Scope

- Page bodies.

## Dependencies

- SA-FE-01.

## Acceptance Criteria

- [ ] `/supervisor` renders sidebar for `supervisor@hpcms.local`.
- [ ] Non-supervisor seed users redirect to `/dashboard`.
- [ ] All sidebar items route to placeholder pages.
- [ ] Active route highlighted.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, click each sidebar item.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
