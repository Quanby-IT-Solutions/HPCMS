# PAT-BE-09 — Secure Portal Chat API

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.5 · User Flows: D5 · TOR: FR-02, SC-02 |
| Existing Code | CA-BE-06 (chat ingestion), `apps/backend/src/common/notifications/` |

## Scope

Server side of the secure portal chat: persisted threads, real-time delivery, attachment support, and ownership enforcement.

## Objectives

- Schema: `chat_threads` (id, tenant_id, patient_id, case_id nullable, opened_at, closed_at), `chat_messages` (id, thread_id, sender_role, sender_id, body, attachments jsonb, sent_at).
- Endpoints: `portal.chat.threads.list`, `portal.chat.threads.open`, `portal.chat.messages.list`, `portal.chat.messages.send`.
- WebSocket / SSE channel for real-time delivery.
- Encryption in transit; strict ownership check.
- Patient send creates an inbox item via CA-BE-06 so back-office can respond.

## Dependencies

- PAT-BE-01, CA-BE-06, SUP-BE-12.

## Acceptance Criteria

- [ ] Patient can list their own threads only.
- [ ] Sending a message creates an inbox item for back-office.
- [ ] Real-time delivery to connected clients.
- [ ] Attachments stored securely.
- [ ] Cross-patient access returns 403.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test portal-chat && pnpm --filter @repo/backend typecheck`.
