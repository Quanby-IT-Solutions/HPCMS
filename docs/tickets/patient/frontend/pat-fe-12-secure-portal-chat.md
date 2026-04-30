# PAT-FE-12 — Secure Portal Chat (Patient Side)

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.5 · User Flows: D5 · TOR: FR-02 |
| Existing Code | PAT-FE-01, CA-FE-08 (back-office side), PAT-BE-09 |

## Scope

Authenticated chat thread between patient and care team accessible from request detail and the chatbot escalation. Encrypted in transit, persisted server-side.

## Objectives

- `/portal/chat` listing active chat threads.
- `/portal/chat/[threadId]` thread view with message input, attachment uploader, send.
- New-message indicator + browser notification permission prompt.
- Mobile-responsive layout.

## Dependencies

- PAT-FE-01, PAT-FE-02, PAT-BE-09.

## Acceptance Criteria

- [ ] Sending a message persists and appears immediately.
- [ ] Back-office reply appears in real time.
- [ ] Attachment upload works.
- [ ] Threads scoped to the patient.

## Verification

- **Manual demo**: as `patient@hpcms.local`, send chat; as `agent@hpcms.local`, reply.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
