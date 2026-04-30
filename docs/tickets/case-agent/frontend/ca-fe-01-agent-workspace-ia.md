# CA-FE-01 — Agent Workspace IA & Navigation

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Planning & Architecture |
| Phase | TOR Phase 1 |
| Source Refs | All Section B/C/D/E/H/I user flows for Case Agent |
| Existing Code | `apps/web/app/(staff)/`, `apps/web/features/staff-case-queue/`, `staff-case-detail/` |

## Scope

Define the Case Agent workspace layout, sidebar (Inbox, Cases, Patients, Claims, Insights), route guards (`case_agent` + supervisor + admins), and route constants.

## Objectives

- `apps/web/app/(staff)/agent/layout.tsx` shell.
- Sidebar groups: Inbox, Cases, Patients, Claims.
- `requireRole(['case_agent', 'case_supervisor', 'tenant_admin', 'system_admin'])`.
- Route constants in `agent-routes.ts`.

## Dependencies

- SA-FE-01.

## Acceptance Criteria

- [ ] `/agent` renders sidebar for `agent@hpcms.local`.
- [ ] Patient role redirects.
- [ ] Active route highlighted.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, click each sidebar item.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
