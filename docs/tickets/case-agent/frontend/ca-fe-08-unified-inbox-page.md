# CA-FE-08 — Unified Inbox Page (Multi-Channel Feed)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.1, 4.8 · User Flows: D1 · TOR: FR-02 |
| Existing Code | CA-FE-02 |

## Scope

The Unified Inbox aggregating email, phone log entries, portal chat, and social media inquiries into a single feed with multi-channel filters.

## Objectives

- Page at `/agent/inbox` rendering `<InboxFeed>` of incoming items: channel icon, sender/patient, subject/summary, received at, status (New / In Progress / Linked / Resolved).
- Communication Filter Panel (channel, status, agent, date range).
- Sort by recency, priority, unanswered duration.
- Click item → Inbox Item Detail View with action buttons (Create Case, Link to Case, Reply, Resolve, Attach).
- AI category badge + confidence (consumed by CA-FE-14).

## Dependencies

- CA-FE-02, CA-BE-05.

## Acceptance Criteria

- [ ] Inbox lists items across all channels.
- [ ] Filters narrow results.
- [ ] Detail view exposes action buttons.
- [ ] Status updates after action.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, open inbox, filter by Email.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
