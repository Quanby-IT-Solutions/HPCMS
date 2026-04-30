# PAT-BE-08 — Patient Notification Service

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.12 · User Flows: F8 |
| Existing Code | `apps/backend/src/modules/v1/notifications/`, `apps/backend/src/common/notifications/`, `packages/db/schema/notifications.ts` |

## Scope

Patient-scoped notification feed with bell-count, list, mark-read endpoints. Triggered by case status changes, agent replies, KB recommendations, and LOA approvals.

## Objectives

- Endpoint: `portal.notifications.list` (patient's own notifications, paginated).
- Endpoint: `portal.notifications.unreadCount`.
- Endpoint: `portal.notifications.markRead` (single or all).
- Triggers: case status change, outbound message, LOA approval, request rejection.
- Real-time push via existing notifications infrastructure.
- Strict ownership check.

## Dependencies

- PAT-BE-01, SUP-BE-05, CA-BE-07.

## Acceptance Criteria

- [ ] List returns patient's notifications only.
- [ ] Unread count matches list state.
- [ ] Mark-read updates rows.
- [ ] Status change triggers notification within 5 seconds.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test patient-notifications && pnpm --filter @repo/backend typecheck`.
