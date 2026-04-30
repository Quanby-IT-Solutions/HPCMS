# SUP-BE-09 — Program Enrollment Service

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 8.1, 8.2, 8.3, 8.7 · User Flows: H1, H2, H6 · TOR: FR-06, DM-04 |
| Existing Code | `packages/db/schema/patients.ts`, SUP-BE-01 |

## Scope

Persist patient enrollments in care programs with status lifecycle, coordinator assignment, and history. Expose CRUD + listing endpoints used by Supervisor and read-only views by Case Agent.

## Objectives

- Schema: `programs` (id, tenant_id, name, description, status enum) seeded with Diabetes Management, Oncology Support, Cardiac Rehab.
- Schema: `enrollments` (id, patient_id, program_id, status enum {Active, Suspended, Completed, Withdrawn}, start_date, end_date, coordinator_id, notes).
- Schema: `enrollment_status_history` (enrollment_id, status, reason, actor, timestamp).
- Endpoints: `programs.list`, `enrollments.create`, `.update`, `.list`, `.get`, `.history`.
- Audit lifecycle events.

## Dependencies

- SUP-BE-01.

## Acceptance Criteria

- [ ] Migrations create three tables and seed programs.
- [ ] Enrolling a patient persists the row.
- [ ] Status updates record reason + actor.
- [ ] List endpoint supports filter by program/status/date/coordinator and pagination.
- [ ] Tenant-scoped reads.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test enrollments && pnpm --filter @repo/backend typecheck`.
