# CA-FE-13 — Communication Search & Advanced Filter

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.8 · User Flows: D7 |
| Existing Code | CA-FE-08 |

## Scope

Page that searches across all interactions with advanced filters. Reachable from inbox toolbar.

## Objectives

- `/agent/communications/search` with keyword bar.
- Advanced Filter Panel: date range, channel multi-select, issue type, agent, status.
- Paginated results (channel icon, patient, date, case ref, snippet, agent).
- Click → Interaction Detail Page.
- CSV export of filtered results.

## Dependencies

- CA-FE-02, CA-BE-05.

## Cross-Role Access

Page is also reachable by Tenant Admin via the same route (`/agent/communications/search`) — they see all communications across the tenant for audit, dispute, and patient-follow-up purposes. Supervisor has the same access scoped to their team. Tenant Admin export priority is audit-grade (full metadata + actor identity).

## Acceptance Criteria

- [ ] Search returns matching interactions.
- [ ] Filters narrow results.
- [ ] Pagination works.
- [ ] CSV export downloads.
- [ ] Tenant Admin and Supervisor seed users can access the page; their result set is scoped per role (Tenant Admin: tenant-wide; Supervisor: team-wide; Case Agent: own + team).
- [ ] Tenant Admin export includes full audit-grade metadata (actor identity, IP, session id) not visible to Case Agent exports.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, search "LOA", filter by Email last 30 days.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
