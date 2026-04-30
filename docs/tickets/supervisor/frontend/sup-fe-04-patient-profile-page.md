# SUP-FE-04 — Patient Profile Page (Demographics, MRN, Consent, Panels)

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.3, 2.6 · User Flows: B3 · TOR: DM-01 |
| Existing Code | SUP-FE-02 shell, `apps/web/features/staff-case-detail/` |

## Scope

Build the canonical Patient Profile page using `<PatientProfileShell>`. Includes the Edit Demographics flow (B3) and renders all integrated right-rail panels (consent, programs, devices, FHIR sync, cross-facility). Other tickets contribute panels; this ticket builds the page skeleton, Overview tab, and Edit Demographics modal.

## Objectives

- Page at `/supervisor/patients/[id]` rendering the shell with Overview tab.
- Overview tab: demographics card, contact card, HMO coverage card, active cases count, recent communications snapshot.
- "Edit Demographics" button → modal with current values, mandatory change-reason field.
- Right-rail slots reserved for SUP-FE-05/06/16/17/19/20.
- Cross-Facility Patient Context Panel slot for SUP-FE-20.

## Out of Scope

- MRN sync (SUP-FE-05).
- Consent UI (SUP-FE-06).

## Dependencies

- SUP-FE-01, SUP-FE-02, SUP-BE-02.

## Acceptance Criteria

- [ ] `/supervisor/patients/[id]` loads Maria Santos's record from seed.
- [ ] Overview tab shows demographics, contact, HMO coverage, active case count, and recent communications snapshot.
- [ ] Edit Demographics modal blocks save when `change_reason` is empty and logs reason to audit on save.
- [ ] All right-rail panel slots render placeholder cards for not-yet-built panels.
- [ ] Tabs (Overview / Communications / Cases / Programs / Devices / Audit / Consent) render and switch without page reload.
- [ ] Inaccessible to the Patient seed user (returns 403 / redirect).

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, open Maria Santos, edit her phone number with reason.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
