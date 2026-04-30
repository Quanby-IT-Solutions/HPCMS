# SUP-BE-04 — MRN Linking & FHIR Patient Sync

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.4, 10.1, 10.9 · User Flows: B4, J1, J8 · TOR: IR-02, IR-03 |
| Existing Code | `packages/fhir/`, `apps/backend/src/common/fhir/`, `packages/db/schema/fhir-cache.ts` |

## Scope

Endpoints to search Altera Sunrise FHIR Patients, link an MRN to a PCMS patient, trigger manual sync of demographics + clinical context, and run scheduled sync jobs per tenant.

## Objectives

- Endpoint: `patients.fhir.searchEmrPatients` (proxies FHIR Patient search).
- Endpoint: `patients.linkMrn` (sets `emr_mrn`, `emr_patient_id` and triggers initial sync).
- Endpoint: `patients.fhir.triggerSync` (manual sync; returns updated-fields summary).
- Background job: scheduled sync per tenant honoring SA-BE-09 schedule.
- Cache FHIR responses in `fhir-cache` table; invalidate on write-back.
- Audit each sync event with mode (manual / scheduled), result, and changed fields.

## Dependencies

- SUP-BE-01, SA-BE-09, `packages/fhir/`.

## Acceptance Criteria

- [ ] Search returns matches via the dev stub client.
- [ ] Link MRN persists and triggers a sync.
- [ ] Manual sync updates demographics and reports changed fields.
- [ ] Scheduled job runs at configured interval.
- [ ] Audit log captures each event.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test fhir-patient-sync && pnpm --filter @repo/backend typecheck`.
