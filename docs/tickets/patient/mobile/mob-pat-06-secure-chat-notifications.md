# MOB-PAT-06 — Mobile Secure Chat & Push Notifications

| Field | Value |
|-------|-------|
| Role  | Patient (mobile) |
| Layer | Mobile (Flutter) |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.5, 6.12 · User Flows: D5, F8 · TOR: FR-02, SC-02 |
| Existing Code | `apps/mobile/lib/services/notifications/`, MOB-PAT-01, PAT-BE-08, PAT-BE-09 |

## Scope

Native chat thread UI (patient ↔ care team), notification inbox, and OS-level push notifications via FCM (Android) and APNs (iOS).

## Objectives

- `ChatListScreen` and `ChatThreadScreen` (`/chat/:threadId`): message bubbles, attachment uploader (camera or file), real-time delivery via WebSocket / SSE from `portal.chat.messages`.
- `NotificationsScreen` (`/notifications`): chronological list with type icon, summary, timestamp, read/unread state, "Mark all read".
- Bell badge in app header reflecting unread count.
- FCM + APNs push delivery on case status change, agent reply, LOA approval, request rejection.
- Tap on push opens deep link to relevant request / chat.
- Permission request UX for push on first launch (after onboarding).

## Out of Scope

- Notification + chat backends (PAT-BE-08, PAT-BE-09).

## Dependencies

- MOB-PAT-01, MOB-PAT-04, PAT-BE-08, PAT-BE-09.

## Acceptance Criteria

- [ ] Sending a message persists and is visible to back-office Case Agent (CA-FE-08).
- [ ] Real-time inbound message updates the thread without manual refresh.
- [ ] Push notification arrives on device when Case Agent sends a reply.
- [ ] Tapping the push opens the correct chat thread.
- [ ] Notification inbox lists unread items first.
- [ ] Tested on iOS (APNs) and Android (FCM) simulators with stubbed push provider.

## Verification

- **Manual demo**: send chat from web (`agent@hpcms.local`), confirm push lands on the patient's mobile simulator.
- **Automated check**: `cd apps/mobile && flutter analyze && flutter test`.
