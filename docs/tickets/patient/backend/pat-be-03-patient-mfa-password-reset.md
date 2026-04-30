# PAT-BE-03 — Patient MFA Enrolment & Password Reset API

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.2, 6.11 · User Flows: F2, F7 |
| Existing Code | `packages/auth/`, PAT-BE-02 |

## Scope

Enable optional patient MFA (TOTP / SMS / email) and a self-service password reset flow with secondary identity verification (DOB or mobile OTP).

## Objectives

- Endpoint: `portal.auth.mfa.enroll` (method TOTP/SMS/email).
- Endpoint: `portal.auth.mfa.verify` (during login).
- Endpoint: `portal.auth.passwordReset.request` (email).
- Endpoint: `portal.auth.passwordReset.verifyIdentity` (DOB or mobile OTP).
- Endpoint: `portal.auth.passwordReset.complete` (new password).
- All sessions invalidated on password change.

## Dependencies

- PAT-BE-01, PAT-BE-02.

## Acceptance Criteria

- [ ] MFA enrolment + verify flow works for at least one method.
- [ ] Password reset email sent.
- [ ] Identity verification step rejects invalid DOB / OTP.
- [ ] Password change invalidates all sessions.
- [ ] Audit log captures every event.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test patient-auth && pnpm --filter @repo/backend typecheck`.
