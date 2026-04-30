# SUP-FE-16 — Program Enrollment Form, Detail & List

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 8.1, 8.2, 8.3 · User Flows: H1, H2, H6 · TOR: FR-06, DM-04 |
| Existing Code | SUP-FE-04 right rail, SUP-BE-09 |

## Scope

Patient Profile right-rail Enrolled Programs panel + Enroll-in-Program form + Enrollment Detail Page (with status update form + history) + facility-wide Program Enrollment List.

## Objectives

- `<EnrolledProgramsPanel>` on Patient Profile listing programs (name, status, enrollment date, coordinator, "View Detail").
- "Enroll in Program" form: program search/select, start date, coordinator, status, notes.
- `/supervisor/enrollments/[id]` Enrollment Detail Page with status update form (Active / Suspended / Completed / Withdrawn + end date) and history log.
- `/supervisor/enrollments` list page with search + filter (program, status, date range, coordinator) and CSV export.

## Out of Scope

- Read-only patient program view for Case Agent (CA-FE-16).

## Dependencies

- SUP-FE-04, SUP-BE-09.

## Acceptance Criteria

- [ ] Panel renders enrollments for the patient.
- [ ] Enroll form persists and panel updates.
- [ ] Detail page status updates record actor + timestamp + reason.
- [ ] List page filters work; CSV export downloads.
- [ ] Inaccessible to patients.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, enroll Maria in Diabetes Management.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
