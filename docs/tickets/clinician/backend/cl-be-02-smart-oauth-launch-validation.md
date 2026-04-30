# CL-BE-02 — SMART/OAuth Launch Validation API

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.3, 10.8 · User Flows: J3 · TOR: IR-04 |
| Existing Code | `packages/fhir/auth/oauth-client-credentials.ts`, `packages/auth/`, SA-BE-09 |

## Scope

Endpoints that validate the SMART launch token, fetch patient context, mint a short-lived PCMS clinician session, and audit the launch.

## Objectives

- Endpoint: `clinician.launch.validate` (input: iss, launch token, code from authorization server; output: patient FHIR id, clinician FHIR id, scopes, session token).
- Token exchange with Altera authorization server using configured client credentials (SA-BE-09).
- Map FHIR practitioner ID → PCMS user (creating a `clinician` user record on first launch if necessary).
- Map FHIR patient ID → PCMS patient (link or prompt to create).
- Audit each launch with iss, clinician, patient, scopes, IP.

## Dependencies

- CL-BE-01, SA-BE-09.

## Acceptance Criteria

- [ ] Validate endpoint exchanges code and returns session.
- [ ] Unknown FHIR practitioner triggers user creation with `clinician` role.
- [ ] Unknown FHIR patient returns `patient_not_linked` status.
- [ ] Audit log captures every launch.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test smart-launch && pnpm --filter @repo/backend typecheck`.
