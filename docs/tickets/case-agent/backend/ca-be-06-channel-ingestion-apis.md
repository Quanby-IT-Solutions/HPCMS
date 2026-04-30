# CA-BE-06 — Channel Ingestion APIs (Email / Phone / Social / Chat)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.2–4.5 · User Flows: D2, D3, D4, D5 · TOR: FR-02 |
| Existing Code | `apps/backend/src/common/email/`, `common/notifications/` |

## Scope

Per-channel endpoints to receive inbound messages and persist as inbox items. Email uses webhook ingestion (Mailgun / SES inbound or polled IMAP — implementer's choice). Phone is manually logged. Social is manually captured. Portal chat is real-time via existing chat infra.

## Objectives

- Endpoint: `channels.email.webhook` (inbound webhook handler with HMAC verification).
- Endpoint: `channels.phone.log` (creates a phone-call inbox item).
- Endpoint: `channels.social.capture` (creates a social-media inbox item).
- Endpoint: `channels.chat.send` and `channels.chat.list` for portal chat.
- Schema: `communications` table (id, channel, direction, inbox_item_id nullable, case_id nullable, body, attachments_jsonb, sent_at).
- Each ingestion creates an `inbox_items` row and may emit a `triage_suggestion` (SA-BE-08).

## Dependencies

- CA-BE-01, CA-BE-05, SA-BE-08.

## Acceptance Criteria

- [ ] Email webhook accepts a sample payload with HMAC and creates an inbox item.
- [ ] Phone log persists.
- [ ] Social capture persists.
- [ ] Chat send/list works.
- [ ] AI suggestion is attached when category match exists.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test channels && pnpm --filter @repo/backend typecheck`.
