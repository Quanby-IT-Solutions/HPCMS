# SUP-BE-11 — FHIR Practitioner / Encounter / Condition / ServiceRequest Connectors

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.2, 10.5, 10.6 · User Flows: J2, J6, J7 · TOR: IR-03 |
| Existing Code | `packages/fhir/`, `apps/backend/src/common/fhir/`, SUP-BE-04 |

## Scope

Connectors and endpoints for FHIR Practitioner, Encounter, Condition, and ServiceRequest read + (where permitted) write operations. Linkage tables tie EMR resources to PCMS cases.

## Objectives

- Endpoint: `fhir.practitioners.search` (proxy FHIR Practitioner with name/specialty/PRC).
- Endpoint: `fhir.encounters.list`, `.linkToCase`, `.writeBackNote`.
- Endpoint: `fhir.conditions.list`, `.linkToCase`.
- Endpoint: `fhir.serviceRequests.list`, `.linkToCase`.
- Schema: `case_fhir_links` (case_id, resource_type, fhir_resource_id, linked_at, linked_by).
- Honor SA-BE-09 resource permissions; deny writes when disabled.
- Audit linkage and write-back.

## Dependencies

- SUP-BE-01, SUP-BE-04, SA-BE-09.

## Acceptance Criteria

- [ ] All four resource search endpoints return data via the dev stub.
- [ ] LinkToCase persists the linkage row.
- [ ] Encounter write-back returns 403 when disabled in settings.
- [ ] Audit log records linkage and write-back events.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test fhir-clinical && pnpm --filter @repo/backend typecheck`.
