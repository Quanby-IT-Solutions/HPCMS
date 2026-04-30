# CA-BE-07 — Outbound Dispatch Service

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.9 · User Flows: D8 |
| Existing Code | `apps/backend/src/common/email/`, CA-BE-06, SUP-BE-12 |

## Scope

Endpoint and service that dispatches outbound emails / portal messages from a case context, recording the send in the case + patient timeline.

## Objectives

- Endpoint: `outbound.send` (case_id, channel email|portal, recipient, subject, body, attachments).
- Pre-flight `ensureConsent(patient, 'communications')` from SUP-BE-12.
- Email send via `common/email`; portal via chat infra.
- Persist send as a `communications` row + `inbox_items` `Sent`.
- Audit dispatch.

## Dependencies

- CA-BE-01, CA-BE-06, SUP-BE-12.

## Acceptance Criteria

- [ ] Send returns success and persists rows.
- [ ] Consent block returns 409 with reason.
- [ ] Sent message visible in case detail and patient timeline.
- [ ] Permission `communication.send` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test outbound && pnpm --filter @repo/backend typecheck`.
