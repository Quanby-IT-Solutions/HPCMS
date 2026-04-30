# PAT-FE-08 — My Requests / Status Tracking (Extend `portal-my-requests`)

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.5 · User Flows: F4 |
| Existing Code | `apps/web/features/portal-my-requests/`, PAT-BE-05 |

## Scope

Audit and extend existing `portal-my-requests` so patients see all submitted requests with statuses and a detail page with full status timeline and team messages.

## Objectives

- `/portal/requests` table: case reference, request type, submission date, current status badge (Received / Under Review / Approved / Rejected / Closed).
- `/portal/requests/[caseId]` detail with status progress stepper, submitted fields summary, status history timeline, team notes/messages.
- Notification when status changes (PAT-FE-11).
- "Reply" CTA for cases needing more information.

## Dependencies

- PAT-FE-01, PAT-FE-06, PAT-BE-05.

## Acceptance Criteria

- [ ] List page renders patient's own cases only.
- [ ] Detail page shows status progress and history.
- [ ] Reply opens a portal chat to the team.
- [ ] Status badges color-coded by state.

## Verification

- **Manual demo**: log in as `patient@hpcms.local`, open a seeded case, view detail.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
