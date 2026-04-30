# SA-BE-03 — Session/Password Policy API + Auth Interceptor

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.1, 1.3, 1.5, 1.9 · User Flows: A5 · TOR: SC-01, SC-02 |
| Existing Code | `packages/auth/`, `apps/backend/src/common/`, `packages/db/schema/auth.ts` |

## Scope

Persist and enforce password complexity, session timeout, MFA, and concurrent-session policies. Add an interceptor that reads the active policy and applies it on every request.

## Objectives

- Schema: `security_policies` table (singleton or per-tenant) covering password rules, idle timeout per role, MFA enforcement matrix, max concurrent sessions per role.
- Endpoint: `staff-admin.security.get` and `staff-admin.security.update`.
- Endpoint: `staff-admin.security.sessions.list` (active sessions per user).
- Endpoint: `staff-admin.security.sessions.terminate`.
- NestJS interceptor reading idle timeout and forcing logout via Better Auth session revocation.
- Hook into Better Auth password validation to enforce complexity, expiration, reuse history.
- Audit every policy change.

## Out of Scope

- MFA setup flows (handled by Better Auth + PAT-BE-03).
- Forgot/Reset endpoints for staff users — delegated to **SA-BE-11 (Staff Password Reset API)**, which consumes the complexity and reuse-history rules persisted by this ticket.

## Dependencies

- SA-BE-01.

## Downstream Consumers

- SA-BE-11 reads `security_policies` to enforce complexity on the new-password step.

## Acceptance Criteria

- [ ] Setting password min length to 12 rejects shorter passwords on next signup or password reset.
- [ ] Setting idle timeout to 5 minutes for `case_agent` revokes their session after 5 minutes of inactivity.
- [ ] `sessions.list` returns active sessions across all six seed users.
- [ ] `sessions.terminate` immediately invalidates the targeted session.
- [ ] Concurrent-session limit prevents a 3rd session for `system_admin` if max = 2.
- [ ] Every policy change appears in the audit log.

## Verification

- **Manual demo**: through SA-FE-05, set timeout, log in as the affected role in another browser, idle, observe forced logout.
- **Automated check**: `pnpm --filter @repo/backend test security && pnpm --filter @repo/backend typecheck`.
