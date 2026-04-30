# CA-FE-09 — Email Thread View & Reply Composer

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.2 · User Flows: D2 · TOR: FR-02 |
| Existing Code | CA-FE-02 composer, CA-FE-08 |

## Scope

Inline Email Thread View opened from the inbox showing the full conversation chain plus a Reply Composer that links the reply to a case (existing or new).

## Objectives

- `<EmailThreadView>` opens when an email inbox item is selected: chain of messages (sender, timestamps, read/unread, attachments).
- "Reply" launches `<EmailReplyComposer>`: rich text editor, response template selector, attachments, case link selector (or create-new).
- Send dispatches via the email channel and appends to the thread + Patient 360 timeline.
- Forward / archive actions.

## Dependencies

- CA-FE-02, CA-FE-08, CA-BE-06, CA-BE-07.

## Acceptance Criteria

- [ ] Thread renders chronologically with proper read state.
- [ ] Reply composer sends and links to case.
- [ ] Sent reply appears in thread + timeline.
- [ ] Attachments persist via storage.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, open an email, reply, verify timeline.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
