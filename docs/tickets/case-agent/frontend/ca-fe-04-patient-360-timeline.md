# CA-FE-04 — Patient 360 Timeline Page

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 2.6, 2.7, 4.6 · User Flows: B6 · TOR: FR-02 |
| Existing Code | SUP-FE-02, CA-FE-02 |

## Scope

Chronological feed of all patient interactions (email, phone, portal chat, social media), cases, FHIR sync events, and consent changes — accessible from Patient Profile and as a standalone page.

## Objectives

- Page at `/agent/patients/[id]/timeline` with chronological list.
- Each entry: channel/icon, date/time, case ref, agent, summary snippet.
- Timeline Filter Panel: channels, date range, case type, agent.
- Click entry → Interaction Detail Drawer with full content + linked case + "Go to Case" button.
- Pagination / infinite scroll.

## Dependencies

- CA-FE-02, SUP-FE-04, CA-BE-03.

## Acceptance Criteria

- [ ] Timeline renders with seeded interactions for Maria Santos.
- [ ] Filters reduce results.
- [ ] Drawer shows full message and case link.
- [ ] Sorting by recency works.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, open Maria's timeline, filter by "Email".
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
