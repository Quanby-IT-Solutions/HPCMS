# SA-FE-04 — Role & Permission Matrix Page

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.2 · TOR: SC-04, NFR-04 |
| Existing Code | `apps/web/features/staff-admin/`, `core/components/ui/` |

## Scope

Page that visualises and edits the permission matrix per role (System Admin, Tenant Admin, Supervisor, Case Agent, Clinician, Patient). Allows enabling/disabling capability flags per role. Backed by SA-BE-04.

## Objectives

- Page at `/admin/roles` rendering `<PermissionMatrix>` with rows = permission keys (e.g., `case.create`, `case.escalate`, `audit.view`, `tenant.assign`) and columns = the six roles.
- Read-only column for `system_admin` (always full access).
- Cell toggle for editable roles; bulk "Enable all" / "Disable all" per row.
- Save bar with diff summary ("3 changes") and "Discard / Save".
- Role description sidebar: clicking a column header shows the role's narrative description and listing of users currently in that role.

## Out of Scope

- Granting per-user overrides (SA-FE-03).

## Dependencies

- SA-FE-01, SA-FE-02, SA-BE-04.

## Acceptance Criteria

- [ ] `/admin/roles` renders the matrix with all six roles as columns.
- [ ] Toggling cells produces a diff summary in the save bar.
- [ ] Saving persists the change via oRPC and the new permissions reflect on next page load.
- [ ] System Admin column is non-editable.
- [ ] Each role column header opens a side panel with description and user list.
- [ ] Discard reverts unsaved changes.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, visit `/admin/roles`, toggle a Supervisor permission, save, reload, confirm.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
