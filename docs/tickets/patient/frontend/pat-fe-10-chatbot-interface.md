# PAT-FE-10 — Chatbot Interface (Triage / FAQ / Scheduling)

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 6.7, 6.8, 6.9 · User Flows: F6 |
| Existing Code | PAT-FE-06, PAT-BE-07 |

## Scope

Conversational interface for triage, FAQ, and appointment scheduling assistance. Launches from the dashboard or anywhere via a floating widget.

## Objectives

- `/portal/chatbot` page + floating widget on every patient page.
- Initial greeting + quick-reply buttons (Submit a Request, Track my Request, Find Information, Ask a Question, Schedule a Consultation).
- Free-text input with send button.
- Triage path: guided questions → recommendation (e.g., "Submit LOA").
- FAQ path: KB search results inline with "Read Full Article" link.
- Scheduling path: appointment-inquiry sub-flow (preferred date/time, specialty).
- Escalate to live agent CTA when bot fails.
- Conversation transcript saved.

## Dependencies

- PAT-FE-06, PAT-BE-07.

## Acceptance Criteria

- [ ] Chatbot opens from dashboard.
- [ ] Quick replies route to correct flows.
- [ ] FAQ path returns KB articles.
- [ ] Scheduling sub-flow captures inputs.
- [ ] Escalate triggers a live chat session (PAT-FE-12).

## Verification

- **Manual demo**: log in as `patient@hpcms.local`, ask "How do I submit an LOA?".
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
