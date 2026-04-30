# CL-FE-06 — Clinical Context Drawer (FHIR-Enriched)

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.11 · User Flows: J10 · TOR: IR-03 |
| Existing Code | CL-FE-04, CL-BE-05 |

## Scope

The Clinical Context tab in the sidebar showing AllergyIntolerance, Medication + MedicationRequest, Immunization, Observation (vitals + key labs), CarePlan + Goal, and DiagnosticReport sections — all pulled via FHIR R4 from Altera Sunrise.

## Objectives

- Tab "Clinical Context" with accordion sections: Allergies, Medications, Immunizations, Observations, Care Plans, Diagnostics.
- Each section: list rows with key fields (e.g., substance + severity for allergies), last-synced timestamp, refresh button.
- "Not available in EMR" placeholder when data missing rather than hard error.
- Loading skeletons per section.
- Per-section refresh fetches that resource only.

## Dependencies

- CL-FE-02, CL-BE-05.

## Acceptance Criteria

- [ ] All six sections render with data from FHIR stub.
- [ ] Refresh updates last-synced timestamp.
- [ ] Empty data shows placeholder.
- [ ] Loading skeletons during fetch.

## Verification

- **Manual demo**: launch sidebar for Maria Santos, switch to Clinical Context tab, refresh Allergies.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
