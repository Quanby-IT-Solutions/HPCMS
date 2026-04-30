# CL-FE-04 — Clinician Sidebar Patient Case Summary

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.4 · User Flows: J4 |
| Existing Code | CL-FE-02, CL-BE-03 |

## Scope

The compact PCMS Clinician Sidebar View embedded in the EMR. Loads case summary for the launched patient and provides expandable sections.

## Objectives

- Page at `/clinician/sidebar/[patientId]` rendering tabs (Case Summary / Clinical Context / Notes).
- **Case Summary tab**: patient header + active case count + latest case type/status + open LOA status + most-recent communication summary.
- Expand-each-case to see assigned agent, open date, key notes.
- "View Full Case" deep-link opens PCMS Case Detail in a new tab.
- "Patient not linked" empty state with create/link CTA.
- Refresh button.

## Dependencies

- CL-FE-02, CL-BE-03.

## Acceptance Criteria

- [ ] Sidebar loads for a launched patient.
- [ ] Active cases listed with statuses.
- [ ] Expand reveals more detail.
- [ ] "View Full Case" opens new tab.
- [ ] Empty state for unlinked patient.

## Verification

- **Manual demo**: launch sidebar for Maria Santos, expand a case.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
