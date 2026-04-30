# PAT-FE-06 — Patient Portal Dashboard

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.2 · User Flows: F2 |
| Existing Code | PAT-FE-01, PAT-FE-02, PAT-BE-05 |

## Scope

Authenticated landing page summarizing pending requests, recent notifications, knowledge base entry, and chatbot launcher.

## Objectives

- `/portal/dashboard` with: pending request status cards (LOA / Other), notification bell with unread count, knowledge base search bar, chatbot launcher button, "Submit New LOA Request" prominent CTA.
- Status cards click → My Requests page (PAT-FE-08).
- Notification bell → Notification Inbox (PAT-FE-11).
- Search bar → Knowledge Base Search (PAT-FE-09).

## Dependencies

- PAT-FE-01, PAT-FE-02, PAT-BE-05, PAT-BE-08.

## Acceptance Criteria

- [ ] Dashboard renders for `patient@hpcms.local`.
- [ ] Status cards reflect Maria's seeded LOA case (status submitted/in_review/approved).
- [ ] Notification bell shows unread count.
- [ ] All quick links navigate correctly.

## Verification

- **Manual demo**: log in as `patient@hpcms.local`, observe dashboard cards.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
