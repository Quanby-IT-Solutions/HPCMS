# CA-FE-12 — Attach-to-Case Modal & Outbound Message Composer

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.7, 4.9 · User Flows: D6, D8 |
| Existing Code | CA-FE-02, CA-FE-06, CA-FE-08 |

## Scope

`<AttachToCaseModal>` for linking an inbox item to an existing case + `<OutboundMessageComposer>` launched from Case Detail. Sends via email or secure portal message and pre-links to case.

## Objectives

- Modal: search by case id / patient / type, multi-select, attachment note, confirm.
- Composer: channel selector (email / portal), recipient (patient), template picker, body editor, attachments, send.
- Both flows append to Case Detail communication history + Patient 360 timeline.
- Pre-send consent check via SUP-BE-12 `ensureConsent`.

## Dependencies

- CA-FE-02, CA-FE-06, CA-FE-08, CA-BE-07, SUP-BE-12.

## Acceptance Criteria

- [ ] Modal links the item; status flips to "Linked to Case".
- [ ] Composer dispatches and appends to history + timeline.
- [ ] Consent block surfaces inline warning.
- [ ] Attachment upload works.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, attach a portal chat to a case, then send an outbound email from that case.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
