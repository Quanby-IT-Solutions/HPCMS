# SUP-FE-05 — MRN Linking & FHIR Sync Status Panel

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.4, 10.1, 10.9 · User Flows: B4, J1, J8 · TOR: IR-02 |
| Existing Code | SUP-FE-04 shell, `packages/fhir/`, `apps/web/features/portal-mrn-verify/` |

## Scope

Right-rail panel and modal flow that link a PCMS patient to an Altera Sunrise MRN via FHIR Patient search, plus the FHIR Sync Status panel showing last-sync time and a Trigger-Manual-Sync button.

## Objectives

- `<MrnLinkingPanel>` rendered on the Patient Profile right-rail showing current MRN + last sync timestamp + "Link MRN" or "Re-sync" button.
- "Link MRN" button opens a modal with FHIR search (name, DOB, partial MRN); selecting a record links the patient via `staff-admin.patients.linkMrn`.
- Trigger Manual Sync button calls the sync endpoint and shows progress + updated-fields summary.
- Error states with retry button.

## Out of Scope

- Sync schedule config (SA-FE-10).
- Practitioner lookup (SUP-FE-18).

## Dependencies

- SUP-FE-04, SUP-BE-04.

## Acceptance Criteria

- [ ] Panel renders on the Patient Profile right rail.
- [ ] Link MRN modal returns FHIR search results from the dev stub client.
- [ ] Linking a record persists and the Patient Profile shows the linked MRN.
- [ ] Trigger Manual Sync updates the timestamp and lists changed fields.
- [ ] Error state displays the FHIR response code with a retry button.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, open a patient without an MRN, link via the modal, sync.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
