# CA-FE-16 — Patient Programs & Devices Read-Only Panel

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 8.7 · User Flows: H5 · TOR: FR-06 |
| Existing Code | SUP-FE-16, SUP-FE-17 |

## Scope

Read-only mirror of the Enrolled Programs and Assigned Devices panels visible in Patient Profile and Case Detail when accessed by a Case Agent. Provides context but no write actions.

## Objectives

- `<EnrolledProgramsReadOnly>` and `<AssignedDevicesReadOnly>` panels.
- Visible on `/agent/patients/[id]` and `/agent/cases/[id]` right rail.
- Click row → detail drawer (status, dates, coordinator, maintenance log).

## Dependencies

- SUP-FE-16, SUP-FE-17, SUP-BE-09, SUP-BE-10.

## Acceptance Criteria

- [ ] Panels render when patient has enrollments/devices.
- [ ] No edit actions available to Case Agent.
- [ ] Drawers show full detail.
- [ ] Tenant-scope respected.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, open a patient with programs/devices.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
