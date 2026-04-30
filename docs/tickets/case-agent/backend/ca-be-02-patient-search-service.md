# CA-BE-02 — Patient Search Service (Multi-Identifier, FHIR-Aware)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.2 · User Flows: B2 |
| Existing Code | `apps/backend/src/modules/v1/patients/`, SUP-BE-04 |

## Scope

Patient search supporting partial-match across name, DOB, MRN, contact, and HMO card number, with optional FHIR fallback when local result count < threshold.

## Objectives

- Endpoint: `patients.search` (paginated, multi-identifier, configurable fuzzy match).
- Endpoint: `patients.recent` (last N searched by user).
- FHIR fallback: when fewer than 3 local results and the requesting user has FHIR read permission, augment with EMR results.
- Tenant-scope.
- Permission `patient.read` required.

## Dependencies

- CA-BE-01, SUP-BE-04.

## Acceptance Criteria

- [ ] Search returns seeded patients on partial-name match.
- [ ] FHIR fallback triggers correctly.
- [ ] Recent endpoint returns last 5 distinct searches.
- [ ] Tenant scope enforced.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test patients-search && pnpm --filter @repo/backend typecheck`.
