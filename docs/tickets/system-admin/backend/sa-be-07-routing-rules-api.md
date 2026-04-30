# SA-BE-07 — Routing Rules API & Rule Evaluation Engine

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.5 · User Flows: E5 · TOR: FR-01, FR-03 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, `apps/backend/src/common/audit/` |

## Scope

Persist routing rules, expose CRUD endpoints, and implement an evaluation engine that runs on every new case to assign team/agent/priority. Includes a routing log of recent decisions.

## Objectives

- Schema: `routing_rules` table (id, tenant_id, priority_order, condition jsonb, action jsonb, active bool, created_by, updated_by).
- Schema: `routing_decisions` table (id, case_id, matched_rule_id nullable, applied_team, applied_agent, decided_at).
- Endpoints: `staff-admin.routingRules.list`, `.create`, `.update`, `.archive`, `.reorder`, `staff-admin.routingRules.log.list`.
- `RoutingEngine` service: evaluates rules in priority order against a case context object; returns first match's action.
- Hook the engine into the case-create lifecycle so new cases auto-route on creation.

## Out of Scope

- AI auto-categorization (SA-BE-08).
- Workload-balancing recommendations (uses this engine downstream — SUP-BE-05).

## Dependencies

- SA-BE-01, SA-BE-04.

## Acceptance Criteria

- [ ] Migration creates both tables.
- [ ] Creating a rule with condition `case_type='LOA Request'` and action `assign_team='LOA Triage'` results in subsequent LOA cases being assigned to LOA Triage.
- [ ] Reorder endpoint updates priority and engine respects new order.
- [ ] Inactive rules are skipped.
- [ ] Routing log lists the last 100 decisions including unmatched cases.
- [ ] Engine has a synchronous unit-test harness to exercise rule sets.

## Verification

- **Manual demo**: SA-FE-08 to create a rule; submit an LOA via patient portal; check `routing_decisions` log.
- **Automated check**: `pnpm --filter @repo/backend test routing && pnpm --filter @repo/backend typecheck`.
