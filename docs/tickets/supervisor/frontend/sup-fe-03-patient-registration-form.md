# SUP-FE-03 — Patient Registration Form

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.1 · User Flows: B1 · TOR: DM-01 |
| Existing Code | `apps/web/features/portal-mrn-verify/` (validation patterns), `services/orpc/` |

## Scope

Page where Supervisors register a new patient with full demographic, HMO coverage, and consent data. Includes duplicate detection trigger that opens SUP-FE-07 modal.

## Objectives

- Page at `/supervisor/patients/new` with form fields: full name, DOB, sex at birth, ethnicity, address, email, phone, emergency contact, HMO card number, HMO provider, consent toggles (data processing, communications, specific service categories).
- Pre-fill from `?name=&dob=` query if redirected from search.
- "Save Patient" triggers duplicate check; on match shows SUP-FE-07 Duplicate Detection modal.
- On confirm-create, redirect to new Patient Profile.
- Inline validation, required-field enforcement.

## Out of Scope

- Duplicate-merge UI (SUP-FE-07).
- MRN linking (SUP-FE-05).

## Dependencies

- SUP-FE-01, SUP-FE-02, SUP-BE-02.

## Acceptance Criteria

- [ ] Page renders form with all listed fields.
- [ ] Saving without duplicates persists and redirects to `/supervisor/patients/[id]`.
- [ ] Saving with potential duplicate opens the SUP-FE-07 modal.
- [ ] Consent toggles persist to the patient record.
- [ ] Inline validation prevents save on missing required fields.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, register a patient, observe the duplicate check.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
