# PAT-FE-03 — Portal Registration & Email Verification

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.1 · User Flows: F1 |
| Existing Code | `apps/web/features/auth/`, `apps/web/features/portal-mrn-verify/`, PAT-BE-02 |

## Scope

Patient self-service registration flow: `/portal/register` → email verification → `/portal/welcome` with optional MFA setup prompt.

## Objectives

- `/portal/register` form: full name, email, DOB, mobile phone, password (with complexity hints), T&C + Data Privacy consent checkbox.
- Submit triggers verification email.
- `/portal/verify-email?token=` validates and activates account.
- `/portal/welcome` welcome page with quick-start links (Submit LOA, Track Requests, Knowledge Base) and an optional MFA setup CTA.

## Dependencies

- PAT-FE-01, PAT-FE-02, PAT-BE-02.

## Acceptance Criteria

- [ ] Form validates inline.
- [ ] Submission sends a verification email.
- [ ] Verifying via the email link activates the account.
- [ ] Welcome page renders post-verification.
- [ ] Audit log records registration event.

## Verification

- **Manual demo**: register a fresh patient, click email link, see welcome.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
