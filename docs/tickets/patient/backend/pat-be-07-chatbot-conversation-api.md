# PAT-BE-07 — Chatbot Conversation API + KB Retrieval Hook

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 6.7, 6.8, 6.9 · User Flows: F6 |
| Existing Code | PAT-BE-06, SA-BE-08 (triage classifier), SUP-BE-07 |

## Scope

Conversational chatbot service with intent recognition (rules-based initially), KB retrieval, and escalation-to-human handoff.

## Objectives

- Schema: `chatbot_sessions` (id, patient_id, started_at, ended_at, transcript jsonb).
- Endpoint: `portal.chatbot.start` (creates session, returns greeting + quick replies).
- Endpoint: `portal.chatbot.message` (user message → bot response; intent classification + KB retrieval).
- Endpoint: `portal.chatbot.escalate` (open a portal chat to a live agent).
- Use SA-BE-08 categories to classify intents.
- Persist transcript on session end.

## Dependencies

- PAT-BE-01, PAT-BE-06, SA-BE-08.

## Acceptance Criteria

- [ ] Start returns greeting + quick replies.
- [ ] Message endpoint returns relevant KB excerpt for FAQ-style queries.
- [ ] Escalate creates a chat thread (via PAT-BE-09).
- [ ] Transcript persisted.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test chatbot && pnpm --filter @repo/backend typecheck`.
