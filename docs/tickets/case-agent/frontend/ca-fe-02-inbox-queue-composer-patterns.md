# CA-FE-02 — Inbox / Queue / Composer UX Patterns

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Frontend Design & UI/UX |
| Phase | TOR Phase 2 |
| Source Refs | Sections C, D |
| Existing Code | `apps/web/core/components/ui/`, SUP-FE-02 |

## Scope

Reusable UX primitives for queue/inbox style pages and message composers used across Case Agent pages: `<InboxFeed>`, `<MessageComposer>`, `<ChannelBadge>`, `<SLATimer>`, `<FilterChipBar>`.

## Objectives

- `<InboxFeed>` paginated, channel-icon-aware list with status badges.
- `<MessageComposer>` rich text + attachments + template selector + channel selector.
- `<ChannelBadge>` consistent icon+color per channel.
- `<SLATimer>` countdown badge with warning thresholds.
- `<FilterChipBar>` chip-style multi-filter control.
- Showcase route `/agent/__design`.

## Dependencies

- CA-FE-01.

## Acceptance Criteria

- [ ] All five primitives demoed with prop variations.
- [ ] Type-safe; Tailwind `size-*` used.
- [ ] Composer attachments upload via existing storage.

## Verification

- **Manual demo**: visit `/agent/__design`.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
