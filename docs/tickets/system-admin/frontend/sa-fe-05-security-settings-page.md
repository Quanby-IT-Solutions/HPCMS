# SA-FE-05 — Security Settings Page (Password / Session / MFA / Concurrency)

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.1, 1.3, 1.5, 1.9 · User Flows: A5 · TOR: SC-02 |
| Existing Code | `apps/web/features/staff-admin/`, `services/better-auth/` |

## Scope

Build a tabbed security configuration page that lets System Admins set password complexity, session timeout, MFA enforcement, and concurrent-session policies. Backed by SA-BE-03.

## Objectives

- Page at `/admin/security` using `<SettingsTabs>` with tabs: Password Policy, Session Policy, MFA Policy, Concurrent Sessions.
- **Password Policy tab**: min length, complexity (upper/lower/digit/symbol), expiration days, reuse history count.
- **Session Policy tab**: idle timeout (minutes) per role tier; warning-banner offset N minutes; "force logout idle" toggle.
- **MFA Policy tab**: per-role MFA enforcement matrix (Required / Optional / Disabled); allowed methods (SMS, TOTP, email).
- **Concurrent Sessions tab**: max concurrent sessions per role; "single-session" toggle for elevated roles; live Active Session Management table with terminate-session action.
- **Per-user MFA reset action** in the Active Session Management table (gated by `system_admin`) that revokes the user's MFA enrollment and forces re-enrollment on next login.
- Save bar per tab with audit confirmation modal noting "this change is logged".

## Out of Scope

- Backend rule enforcement (SA-BE-03).
- Audit log viewing (TA-FE-03).

## Dependencies

- SA-FE-01, SA-FE-02, SA-BE-03.

## Acceptance Criteria

- [ ] `/admin/security` renders four tabs.
- [ ] Saving each tab posts to the policy API and shows a "saved at HH:MM" timestamp.
- [ ] Active Session Management table lists all currently logged-in users with role, IP, last activity.
- [ ] Terminate-session button immediately removes a session and the targeted user is logged out on next request.
- [ ] All policy fields validate (e.g., min-length ≥ 8).
- [ ] Per-user MFA reset action revokes the user's enrolled MFA factor and is logged in audit; on next login the user is forced through MFA enrollment.
- [ ] Page is inaccessible to all non-admin seed users.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, set idle timeout to 5 minutes for `case_agent`, log in as `agent@hpcms.local` in another browser, idle, observe forced logout.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
