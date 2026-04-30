# MOB-PAT-05 — Mobile Knowledge Base Search & Chatbot

| Field | Value |
|-------|-------|
| Role  | Patient (mobile) |
| Layer | Mobile (Flutter) |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 6.6, 6.7, 6.8, 6.9 · User Flows: F5, F6 |
| Existing Code | MOB-PAT-01, PAT-BE-06, PAT-BE-07 |

## Scope

Mobile Knowledge Base search + article reader and the chatbot interface (triage / FAQ / scheduling). Mirrors PAT-FE-09 + PAT-FE-10.

## Objectives

- `KbSearchScreen` (`/kb`) with search bar, featured categories, popular articles.
- `ArticleDetailScreen` (`/kb/:slug`) renders Markdown safely; "Was this helpful?" widget.
- `ChatbotScreen` (`/chatbot`) with quick-reply chips, free-text input, message bubbles.
- Triage / FAQ / scheduling sub-flows mirror web spec.
- "Escalate to live agent" creates a chat thread and routes to `/chat/:threadId` (MOB-PAT-06).
- Conversation transcript persisted via `portal.chatbot.message`.

## Out of Scope

- KB and chatbot APIs (PAT-BE-06, PAT-BE-07).

## Dependencies

- MOB-PAT-01, PAT-BE-06, PAT-BE-07.

## Acceptance Criteria

- [ ] Search returns ranked results from KB.
- [ ] Article renders Markdown with embedded images.
- [ ] Chatbot quick-replies route to correct sub-flows.
- [ ] FAQ path returns inline KB answer with "Read Full Article" CTA.
- [ ] Escalate-to-agent opens chat thread.
- [ ] Tested on iOS and Android.

## Verification

- **Manual demo**: search "HMO LOA", open article; ask chatbot "How do I submit an LOA?".
- **Automated check**: `cd apps/mobile && flutter analyze && flutter test`.
