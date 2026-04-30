# PAT-FE-04 — Portal Login + Optional MFA

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.2 · User Flows: F2 |
| Existing Code | `apps/web/features/auth/`, `apps/web/services/better-auth/`, PAT-BE-03 |

## Scope

Patient-facing login page with optional MFA challenge. On success, lands on Patient Portal Dashboard (PAT-FE-06).

## Objectives

- `/portal/login` with email + password fields, "Forgot password?" + "Register" links, SLMC branding.
- If MFA enabled: redirect to `/portal/mfa` with one-time code entry, resend, expiry countdown.
- If MFA not enabled: show optional one-time prompt to enable (dismissible).
- On success → `/portal/dashboard`.

## Dependencies

- PAT-FE-01, PAT-FE-02, PAT-BE-03.

## Acceptance Criteria

- [ ] Login with valid credentials redirects to dashboard.
- [ ] Wrong password shows inline error.
- [ ] MFA challenge accepts the code from PAT-BE-03.
- [ ] Optional-MFA prompt dismissible without forcing setup.
- [ ] Once dismissed, the optional-MFA prompt does not reappear within 30 days for the same patient.

## Verification

- **Manual demo**: log in as `patient@hpcms.local`.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
