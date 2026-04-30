# SUP-FE-19 — FHIR Resource Viewer (Encounter / Condition / ServiceRequest)

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.5, 10.6 · User Flows: J6, J7 · TOR: IR-03 |
| Existing Code | SUP-FE-02 case shell, `packages/fhir/`, SUP-BE-11 |

## Scope

Right-rail FHIR Resource Viewer Panel on Case Detail that lets the Supervisor pull EMR Encounter, Condition, and ServiceRequest resources for the patient and link them to the case. Supports write-back of an Encounter case-reference note where permitted.

## Objectives

- `<FhirResourceViewerPanel>` with resource-type selector (Encounter / Condition / ServiceRequest), query results list, and "Link to Case" action.
- Selected linked resources rendered in `<EncounterLinkagePanel>` and `<ClinicalContextPanel>` on Case Detail.
- "Pull Clinical Context" CTA bulk-fetches Condition + ServiceRequest.
- Write-back disabled when SA-FE-10 has read-only set for that resource.
- Sync status badge with last-synced timestamp + manual refresh button.

## Out of Scope

- Clinician-side enriched context (CL-FE-06).
- Patient-level FHIR sync (SUP-FE-05).

## Dependencies

- SUP-FE-02, SUP-BE-11.

## Acceptance Criteria

- [ ] Panel renders on Case Detail.
- [ ] Selecting a resource type queries the FHIR client and returns results.
- [ ] Linking an Encounter persists the FHIR ID and renders linkage details.
- [ ] Write-back attempt fails with 403 when SA-BE-09 disallows.
- [ ] Sync status badge updates after manual refresh.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, open a case, pull Conditions, link one.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
