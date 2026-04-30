# SUP-BE-06 — Trend Detection & Risk Scoring Engine

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.2, 5.4, 5.6 · User Flows: E2, E4, E6 · TOR: FR-03 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, SA-BE-08 |

## Scope

Compute and persist trend alerts (case-type spikes, recurring complaints, SLA breach clusters, cohort patterns) and per-case risk scores (age, unanswered communications, complaint keyword match, SLA proximity). Expose query endpoints for SUP-FE-11 and SUP-FE-12.

## Objectives

- Schema: `trend_alerts` (id, type, severity, payload jsonb, acknowledged_by, acknowledged_at, created_at).
- Schema: `case_risk_scores` (case_id, score, factors jsonb, computed_at).
- Scheduled jobs: trend computation hourly, risk recompute every 15 minutes.
- Endpoints: `insights.trends.list`, `insights.trends.acknowledge`, `cases.risk.get`, `cases.risk.override`.
- Workload-balancing helper: `cases.workload.recommend` returns the lowest-load agent for a team.

## Dependencies

- SUP-BE-01, SUP-BE-05, SA-BE-08.

## Acceptance Criteria

- [ ] Migrations create the two tables.
- [ ] Trend computation populates alerts when seeded data crosses thresholds.
- [ ] Risk scores compute for every open case.
- [ ] Acknowledge endpoint records actor and timestamp.
- [ ] Workload recommendation returns deterministically with same input.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test risk-engine && pnpm --filter @repo/backend typecheck`.
