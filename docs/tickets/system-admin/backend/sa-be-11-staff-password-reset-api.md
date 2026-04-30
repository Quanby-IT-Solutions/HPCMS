# SA-BE-11 — Staff Password Reset API

| Field | Value |
|-------|-------|
| Role  | System Admin (cross-role flow) |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.4 · User Flows: A4 · TOR: SC-02 |
| Existing Code | `packages/auth/`, `apps/backend/src/common/email/`, SA-BE-03, PAT-BE-03 (parallel patient API) |

## Scope

Backend endpoints powering the staff-side password reset flow (SA-FE-13). Mirrors PAT-BE-03 but is callable by any non-`patient` role and uses staff identity-verification methods (registered MFA method or security question, not DOB / mobile OTP).

## Objectives

- Endpoint: `auth.staff.passwordReset.request` (input: email; sends time-limited reset email).
- Endpoint: `auth.staff.passwordReset.verifyIdentity` (input: token + MFA code or security answer).
- Endpoint: `auth.staff.passwordReset.complete` (input: new password; enforces SA-BE-03 policy).
- Token lifetime: 30 minutes; single-use; stored hashed.
- Audit each step (request, verify, complete) with actor, IP, user-agent.
- Invalidate every existing session for the user on success via Better Auth session revocation.
- Rate-limit `request` per email + IP to prevent enumeration.

## Out of Scope

- Patient portal reset (PAT-BE-03).
- Password complexity policy CRUD (SA-BE-03 owns it).

## Dependencies

- SA-BE-01, SA-BE-03.

## Acceptance Criteria

- [ ] Reset request emits an email with a single-use token.
- [ ] Reusing a consumed token returns 410 Gone.
- [ ] Verify-identity rejects wrong MFA code with 401.
- [ ] Complete enforces complexity from SA-BE-03 (rejects too-short/too-simple passwords).
- [ ] All existing sessions for the user are invalidated on success.
- [ ] Rate limit kicks in after N consecutive `request` calls for the same email/IP.
- [ ] Audit log captures all three steps.
- [ ] Patient role is rejected (must use PAT-BE-03 path instead).

## Verification

- **Automated check**: `pnpm --filter @repo/backend test staff-password-reset && pnpm --filter @repo/backend typecheck`.
