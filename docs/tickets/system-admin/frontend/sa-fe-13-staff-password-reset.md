# SA-FE-13 — Staff Self-Service Password Reset Page

| Field | Value |
|-------|-------|
| Role  | System Admin (cross-role flow) |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.4 · User Flows: A4 · TOR: SC-02 |
| Existing Code | `apps/web/features/auth/`, `apps/web/services/better-auth/`, `apps/web/app/(auth)/`, PAT-FE-05 (parallel patient flow) |

## Scope

The `/login` "Forgot password?" flow for every staff role (System Admin, Tenant Admin, Supervisor, Case Agent, Clinician). Patient reset is already covered by PAT-FE-05; this ticket builds the staff-side equivalent under the existing `(auth)` route group so all six roles can self-serve a reset.

## Objectives

- "Forgot password?" link on `/login` (existing) routes to `/auth/password-reset`.
- `/auth/password-reset` Password Reset Page: email entry field, submit, "Return to login".
- `/auth/password-reset/verify?token=` Identity Verification Page: registered MFA method or security question challenge.
- `/auth/password-reset/new` New Password Form: new password + confirm + complexity hint, complies with policy from SA-BE-03.
- Success toast → redirect to `/login`.
- All previously active sessions invalidated on completion.

## Out of Scope

- Patient portal reset (PAT-FE-05).
- Password policy configuration UI (SA-FE-05).

## Dependencies

- SA-FE-01, SA-FE-05, STAFF-BE-PWD-RESET (sa-be-11).

## Acceptance Criteria

- [ ] Clicking "Forgot password?" on `/login` opens the Password Reset Page.
- [ ] Submitting a valid staff email triggers a reset email.
- [ ] Verification page rejects an expired or invalid token with a clear message.
- [ ] New Password Form blocks save until complexity policy from SA-BE-03 is satisfied.
- [ ] Successful reset invalidates all active sessions for the user (Active Session Management page in SA-FE-05 reflects this).
- [ ] Flow works for all five staff seed accounts (`system@`, `admin@`, `supervisor@`, `agent@`, `clinician@hpcms.local`).

## Verification

- **Manual demo**: trigger a reset for `agent@hpcms.local`, complete the flow in a private window, confirm previous session is invalidated.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
