# SUP-BE-05 — Case Lifecycle: Create / Assign / Route / Escalate / Link

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.1, 3.3, 3.5, 3.10, 3.6, 3.8, 3.9 · User Flows: C1, C3, C4, C7 · TOR: FR-01, DM-03 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, `packages/db/schema/cases.ts`, SA-BE-07 |

## Scope

Extend the existing cases module with the full lifecycle: create with case_type-driven fields, assign/route (consumes routing engine), escalate, link related cases. Status history is retained for every transition.

## Objectives

- Schema additions: `case_status` enum (Open, In Progress, Pending Patient, Escalated, Resolved, Closed); `case_relationships` table (left_id, right_id, relationship_type).
- Endpoints: `cases.create` (calls SA-BE-07 RoutingEngine), `cases.assign`, `cases.escalate`, `cases.link`, `cases.unlink`, `cases.statusHistory.list`.
- Notifications emitted on assign/escalate via `common/notifications`.
- Tenant-scope all reads; permission gating per action.

## Dependencies

- SUP-BE-01, SA-BE-06, SA-BE-07, SUP-BE-12.

## Acceptance Criteria

- [ ] Migration creates the relationship table and status enum.
- [ ] Create with no team triggers routing engine; matched team is set.
- [ ] Assign updates assignee + notifies them.
- [ ] Escalate updates status + reroutes + notifies.
- [ ] Link creates symmetric relationship rows.
- [ ] Status history endpoint returns chronological transitions.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test cases-lifecycle && pnpm --filter @repo/backend typecheck`.
