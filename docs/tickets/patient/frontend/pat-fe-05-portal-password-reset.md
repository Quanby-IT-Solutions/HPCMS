# PAT-FE-05 — Portal Password Reset

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.11 · User Flows: F7 |
| Existing Code | PAT-FE-04, PAT-BE-03 |

## Scope

Self-service password reset: email entry → identity verification (DOB or mobile OTP) → new password form → success redirect.

## Objectives

- `/portal/password-reset` email entry form.
- Verification page accepting DOB or mobile OTP.
- New Password Form with complexity hints.
- All sessions invalidated on success; redirect to login.
- Inline error states for invalid token / expired link.

## Dependencies

- PAT-FE-01, PAT-FE-02, PAT-BE-03.

## Acceptance Criteria

- [ ] Reset email sent on valid email submission.
- [ ] Token-based reset link works.
- [ ] Identity verification step blocks proceeding.
- [ ] New password persists; existing sessions invalidated.
- [ ] Expired link shows clear message.

## Verification

- **Manual demo**: trigger reset for `patient@hpcms.local`, complete flow.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
