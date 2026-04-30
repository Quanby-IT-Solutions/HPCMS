# PAT-BE-04 — LOA Submission API + Secure File Storage

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.3, 6.4, 6.10 · User Flows: F3 · TOR: FR-04A, SC-02 |
| Existing Code | `apps/backend/src/modules/v1/{cases,attachments}/`, `apps/backend/src/common/storage/` |

## Scope

Endpoint that accepts the 7-field LOA submission (3 file uploads + 4 text fields), stores files securely (encrypted at rest, virus-scanned), creates an LOA-type case, and returns the case reference.

## Objectives

- Endpoint: `portal.loa.submit` (multipart accepting Admitting Order, Valid ID, HMO ID + form fields).
- Files routed through `common/storage` with AES-256 at rest.
- Server-side validation: required fields, file MIME types (PDF / JPG / PNG), max size (10 MB each), virus scan hook.
- Creates a healthcare case with `case_type='LOA Request'` linked to the patient and attaches files via `attachments` module.
- Triggers SA-BE-07 routing engine for auto-assignment.
- Sends email confirmation with case reference.
- Audit submission.

## Dependencies

- PAT-BE-01, SUP-BE-05, SA-BE-06, SA-BE-07.

## Acceptance Criteria

- [ ] Submission with all fields persists and creates an LOA case.
- [ ] Files stored encrypted with retrievable URL gated by patient ownership.
- [ ] Missing required fields return 400.
- [ ] Wrong MIME type or oversize files rejected.
- [ ] Email confirmation sent with case reference.
- [ ] Routing engine fires.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test loa-submit && pnpm --filter @repo/backend typecheck`.
