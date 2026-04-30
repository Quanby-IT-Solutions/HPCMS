# CA-FE-05 — Case Queue Dashboard (Filters / SLA / Sort)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.2, 3.4, 3.9 · User Flows: C2 · FR-01 |
| Existing Code | `apps/web/features/staff-case-queue/`, CA-FE-02 |

## Scope

Real-time dashboard of open cases assigned to the Case Agent or their team, with filtering, sorting, SLA indicators, and quick actions.

## Objectives

- Page at `/agent/cases` with table/card view: case id, patient name, type, priority badge, status, age (days), SLA timer.
- Case Filter Panel: priority, type, status, agent, date range, risk level (from SUP-FE-12).
- Sort by priority, SLA breach, age, last update.
- Per-row Quick Actions context menu: update status, reassign (if permitted), open detail.
- KPI strip (Open / Pending / Escalated / SLA-at-risk).

## Dependencies

- CA-FE-01, CA-FE-02, CA-BE-04, SUP-BE-06.

## Acceptance Criteria

- [ ] Page loads with seeded cases.
- [ ] Filters reduce list.
- [ ] SLA timer counts down for each row with warning colors.
- [ ] Quick action context menu actions work.
- [ ] KPI strip values match list counts.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, filter by High priority, open a case.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
