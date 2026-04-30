# SUP-FE-11 — AI Insights Dashboard & Trend Alert Panel

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.2 · User Flows: E2 · TOR: FR-03 |
| Existing Code | SUP-FE-01, TA-FE-02 charts |

## Scope

Dashboard surfacing trend alerts (case-type spikes, recurring complaints, SLA breach clusters, patient cohort patterns) computed by the backend AI/heuristics. Drill-in to a Case Analytics page with charts and case lists.

## Objectives

- Page at `/supervisor/insights` with trend alert cards (severity badge, alert title, last-updated).
- Click a card → Trend Alert Panel: case list, time-window chart, affected patient cohort, channel breakdown.
- "Acknowledge" action with note and timestamp logged.
- "Escalate to Major Incident" shortcut → SUP-FE-15 with prefilled cases.

## Out of Scope

- Major incident creation (SUP-FE-15).

## Dependencies

- SUP-FE-01, TA-FE-02, SUP-BE-06.

## Acceptance Criteria

- [ ] Dashboard renders alert cards from seeded heuristics.
- [ ] Clicking opens a panel with affected cases.
- [ ] Acknowledge persists and is shown in history.
- [ ] "Escalate to Major Incident" pre-populates incident form.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, visit `/supervisor/insights`, acknowledge a trend.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
