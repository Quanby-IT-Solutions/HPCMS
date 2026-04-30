# PAT-FE-11 — Notification Inbox

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.12 · User Flows: F8 |
| Existing Code | `apps/web/features/staff-notifications/`, PAT-FE-06, PAT-BE-08 |

## Scope

Patient-facing notification inbox for status updates, approvals, messages, and reminders. Bell icon on every authenticated page; full inbox at `/portal/notifications`.

## Objectives

- Bell icon in portal header with unread count badge.
- `/portal/notifications` chronological list: type icon, title, summary, timestamp, read/unread state.
- Notification detail page with full content + contextual action ("Go to Request", "View Case Thread").
- "Mark all as read" action.
- Real-time update via existing WebSocket / poll path.

## Dependencies

- PAT-FE-01, PAT-FE-06, PAT-BE-08.

## Acceptance Criteria

- [ ] Bell badge updates on new notification.
- [ ] List renders chronologically with read state.
- [ ] Detail action navigates correctly.
- [ ] "Mark all read" resets badge to 0.

## Verification

- **Manual demo**: as `patient@hpcms.local`, have a Case Agent send an outbound message → see notification.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
