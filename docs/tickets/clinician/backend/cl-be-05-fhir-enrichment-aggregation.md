# CL-BE-05 — FHIR Enrichment Aggregation (Allergy/Med/Immunization/Observation/CarePlan/Diagnostic)

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.11 · User Flows: J10 · TOR: IR-03 |
| Existing Code | `packages/fhir/`, `packages/db/schema/fhir-cache.ts`, SUP-BE-04 |

## Scope

Endpoint set that pulls AllergyIntolerance, Medication + MedicationRequest, Immunization, Observation, CarePlan + Goal, and DiagnosticReport for the launched patient, normalizing into the sidebar's data model.

## Objectives

- Endpoints: `clinician.fhir.allergies`, `.medications`, `.immunizations`, `.observations`, `.carePlans`, `.diagnostics` (all keyed by patientId; honor SA-BE-09 read permissions).
- Normalize FHIR responses to compact UI-ready shapes (e.g., `{ substance, severity, reaction, recordedDate }`).
- Cache responses in `fhir-cache` with TTL.
- Refresh endpoint per resource type to bypass cache.
- Audit each fetch with patient + resource type.

## Dependencies

- CL-BE-01, SUP-BE-04, SA-BE-09.

## Acceptance Criteria

- [ ] All six endpoints return data via dev stub client.
- [ ] Cache hit observed on second call.
- [ ] Refresh bypass cache and updates timestamp.
- [ ] Permission gating per resource type.
- [ ] "Not available" falls back when EMR returns empty.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test fhir-enrichment && pnpm --filter @repo/backend typecheck`.
