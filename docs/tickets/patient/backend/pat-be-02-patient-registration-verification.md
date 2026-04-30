# PAT-BE-02 — Patient Registration & Email Verification API

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.1 · User Flows: F1 |
| Existing Code | `packages/auth/`, `apps/backend/src/common/email/`, `packages/db/schema/auth.ts` |

## Scope

Self-service patient registration creating a Better Auth user with `patient` role + a stub patient record (linked to existing PCMS patient if MRN matches). Email verification activates the account.

## Objectives

- Endpoint: `portal.auth.register` (full name, email, DOB, mobile, password, T&C consent).
- Endpoint: `portal.auth.verifyEmail` (token).
- Verification email via `common/email`.
- On register, create Better Auth user with `patient` role and a placeholder patient row (or link to existing patient via DOB + last 4 of MRN if pre-registered).
- Audit registration and verification events.

## Dependencies

- PAT-BE-01.

## Acceptance Criteria

- [ ] Register endpoint creates user + patient stub.
- [ ] Verify endpoint activates account.
- [ ] Duplicate email returns 409.
- [ ] Audit log captures both events.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test patient-register && pnpm --filter @repo/backend typecheck`.
