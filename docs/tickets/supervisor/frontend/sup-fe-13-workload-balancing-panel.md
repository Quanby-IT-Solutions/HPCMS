# SUP-FE-13 — Workload-Balancing Assignment Panel

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.6 · User Flows: E6 · TOR: FR-03 |
| Existing Code | SUP-FE-08 assignment panel, SUP-BE-06 |

## Scope

Extend SUP-FE-08's Assignment Panel with a Team Workload View that recommends the agent with the lowest open-case count, with a real-time bar chart per agent.

## Objectives

- `<TeamWorkloadView>` rendered above the agent list: each agent row with name, role, open-case bar (color-coded by saturation).
- "Suggested Assignee" badge on the agent with lowest load.
- Confirming assignment immediately re-renders workload bars.
- Filter agents by skill / specialty (optional).

## Dependencies

- SUP-FE-08, SUP-BE-06.

## Acceptance Criteria

- [ ] View renders bars for every agent in the team.
- [ ] Suggested assignee badge points to the lowest-load agent.
- [ ] Confirming an assignment updates bars without page reload.
- [ ] Inaccessible to non-supervisor roles.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, open assignment for an unassigned case, see workload view.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
