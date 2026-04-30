# TA-FE-04 — Login Event Audit Page

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 1.7 · TOR: SC-01, NFR-02 |
| Existing Code | `apps/backend/src/common/audit/`, TA-FE-02 components |

## Scope

Specialized view of the audit log focused on authentication events: login attempts, successes, failures, MFA challenges, logouts. Includes a security-dashboard summary KPI strip.

## Objectives

- Page at `/tenant-admin/audit/logins` with KPI cards (Logins today, Failed attempts last 24h, Active sessions, MFA challenges issued).
- Table: timestamp, user, role, IP, user-agent, outcome (success / failed / locked / mfa-required), session id.
- Filters: outcome, role, IP, date range.
- Quick actions: "View user profile", "Terminate session" (system_admin only).
- Drill-in to TA-FE-03 for full audit context.

## Out of Scope

- Concurrent-session policy (SA-FE-05).

## Dependencies

- TA-FE-01, TA-FE-02, TA-BE-02.

## Acceptance Criteria

- [ ] KPIs reflect current seeded data and update on filter change.
- [ ] Filtering by "Failed" returns only failed attempts.
- [ ] Drill-in to TA-FE-03 preserves filter context.
- [ ] Page is tenant-scoped.
- [ ] Inaccessible to non-admin users.

## Verification

- **Manual demo**: log in as `admin@hpcms.local`, visit `/tenant-admin/audit/logins`, attempt to log in as a wrong-password user in another browser, refresh and confirm the failed attempt appears.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
