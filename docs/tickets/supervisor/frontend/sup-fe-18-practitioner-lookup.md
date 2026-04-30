# SUP-FE-18 — Practitioner Lookup Page (FHIR-Backed)

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 10.2 · User Flows: J2 · TOR: IR-03, DM-02 |
| Existing Code | `packages/fhir/`, `apps/backend/src/modules/v1/practitioners/`, SUP-BE-11 |

## Scope

Standalone Practitioner Lookup page and a `<FhirPractitionerSearch>` component embedded in the New Case Form (SUP-FE-08) and Case Detail.

## Objectives

- `/supervisor/practitioners` page with searchable list (name, specialty, PRC license, department, facility, active status).
- `<FhirPractitionerSearch>` reusable component returning FHIR-validated results.
- Selecting a practitioner attaches their FHIR Practitioner ID to the case context.
- Free-text fallback (with audit flag) when EMR has no match.

## Out of Scope

- Practitioner CRUD (data lives in EMR via FHIR).

## Dependencies

- SUP-FE-01, SUP-BE-11.

## Acceptance Criteria

- [ ] Lookup page returns results from FHIR stub client.
- [ ] Selecting a practitioner persists the FHIR ID on the case.
- [ ] Free-text fallback flagged in audit.
- [ ] Component reusable across forms.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, search for "Dela Cruz", attach to a case.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
