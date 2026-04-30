# SUP-FE-08 — Case Creation, Assignment & Routing UI

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.1, 3.3, 3.8 · User Flows: C1, C3 · TOR: FR-01 |
| Existing Code | `apps/web/features/staff-case-detail/`, SA-FE-07 (case types) |

## Scope

The New Case Form and the Case Assignment Panel. New Case is reachable from the Patient Profile and from a global "+ New Case" button. The Assignment Panel is rendered on Case Detail and surfaces team/agent dropdowns with workload indicators.

## Objectives

- `/supervisor/patients/[id]/new-case` form with: case type (from SA-BE-06), source channel, priority, optional practitioner (FHIR-backed via SUP-FE-18), description, team assignment.
- Required-field rendering driven by selected case type.
- After submit → Case Detail Page with assigned team notified.
- `<CaseAssignmentPanel>` on Case Detail with team dropdown, agent list (with current workload bar), routing notes, "Confirm Assignment".
- Reassignment via the same panel from Case Detail.

## Out of Scope

- Workload-balancing recommendation (SUP-FE-13).
- Case escalation (SUP-FE-09).

## Dependencies

- SUP-FE-01, SUP-FE-02, SUP-FE-04, SA-BE-06, SUP-BE-05.

## Acceptance Criteria

- [ ] New Case Form lists active case types from SA-BE-06.
- [ ] Required fields adjust based on selected case type.
- [ ] Submitting creates a case linked to the patient and triggers routing rule evaluation (SA-BE-07).
- [ ] Assignment Panel changes team/agent and emits a notification.
- [ ] Status History records the assignment.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, create a Care Coordination case for Maria, assign to a Case Agent.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
