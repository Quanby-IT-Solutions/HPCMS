# PAT-FE-07 — LOA Request Form (Extend Existing `portal-loa`)

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.3, 6.4, 6.10 · User Flows: F3 · TOR: FR-04A |
| Existing Code | `apps/web/features/portal-loa/`, `apps/web/features/portal-mrn-verify/`, PAT-BE-04 |

## Scope

Audit and extend the existing `portal-loa` feature so the LOA Request Form captures all 7 required SLMC fields with secure file upload, inline validation, and a submission confirmation page with case reference.

## Objectives

- `/portal/loa/new` form with all 7 fields:
  1. Admitting Order file upload (PDF/image).
  2. HMO Card Number (text).
  3. Date of Consultation/Procedure (date picker).
  4. Preferred Doctor Name (text with practitioner suggestion).
  5. Chief Complaint (textarea).
  6. Valid ID file upload.
  7. HMO ID file upload.
- File upload component with progress, file-type/size hints, remove option.
- Inline validation per field; required-field enforcement.
- Review summary step before submit.
- `/portal/loa/[caseId]/confirmation` confirmation page with case reference + email confirmation note + "Track Status" link.

## Out of Scope

- LOA processing on backoffice side (covered by SUP-FE-08, SUP-BE-05).

## Dependencies

- PAT-FE-01, PAT-FE-02, PAT-BE-04.

## Acceptance Criteria

- [ ] All 7 fields render and validate.
- [ ] Three file uploads succeed and show progress.
- [ ] Submission persists via PAT-BE-04 and creates a `case_type='LOA Request'` case.
- [ ] Confirmation page shows case reference and next steps.
- [ ] Patient receives email confirmation.

## Verification

- **Manual demo**: log in as `patient@hpcms.local`, submit a complete LOA request.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
