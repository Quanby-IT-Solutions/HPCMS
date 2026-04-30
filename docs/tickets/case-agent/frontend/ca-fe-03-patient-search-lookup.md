# CA-FE-03 — Patient Search & Lookup Pages

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.2 · User Flows: B2 · TOR: DM-01 |
| Existing Code | `apps/web/features/portal-mrn-verify/`, CA-FE-02 |

## Scope

Multi-identifier patient search and results page used across Case Agent flows (case creation, inbox triage, claim creation).

## Objectives

- `/agent/patients` search page with multi-identifier inputs (name, DOB, MRN, contact, HMO card number).
- Recent searches list.
- `/agent/patients/results?[query]` results table (name, DOB, MRN, facility, last case date) with "Open" action.
- Result row click → patient profile (renders SUP-FE-04 with role-scoped UI).
- Quick-action: "Create case for this patient".

## Dependencies

- CA-FE-01, CA-BE-02.

## Acceptance Criteria

- [ ] Search returns the seeded patients on partial-name match.
- [ ] Recent searches show last 5.
- [ ] Opening a row navigates to the profile.
- [ ] "Create case" CTA navigates to SUP-FE-08 prefilled with patient.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, search "Maria", open result.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
