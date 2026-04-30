# SA-FE-08 — Routing Rules Configuration & Rule Builder

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.5 · User Flows: E5 · TOR: FR-01 |
| Existing Code | `apps/web/features/staff-admin/`, `<RuleBuilder>` from SA-FE-02 |

## Scope

Page where the System Admin defines rules that auto-route incoming cases to teams or agents based on case type, priority, source channel, patient attributes, or keyword match. Rules evaluate top-to-bottom, first match wins. Backed by SA-BE-07.

## Objectives

- Page at `/admin/routing-rules` listing all configured rules with: priority order, trigger summary, action summary, active/inactive toggle.
- Drag-to-reorder list to change rule precedence.
- "Add Rule" opens `<RuleBuilder>` with conditions (case type, priority, source channel, HMO type, keyword) and actions (assign to team, assign to specific agent, set priority, add label).
- "Case Routing Log" subtab showing recent routing decisions: case ID, matched rule, assigned team, timestamp.
- Rule activation toggle that pauses without deletion.

## Out of Scope

- Rule evaluation engine (SA-BE-07).
- Workload-balancing assignment (SUP-FE-13).

## Dependencies

- SA-FE-01, SA-FE-02, SA-BE-07.

## Acceptance Criteria

- [ ] `/admin/routing-rules` renders the rule list and routing log subtabs.
- [ ] Adding a rule with condition `case_type = 'LOA Request' AND source_channel = 'portal'` → action `assign_team = 'LOA Triage'` persists and evaluates on the next inbound LOA case.
- [ ] Reordering rules updates their precedence and the log shows which rule matched.
- [ ] Toggling active/inactive immediately removes the rule from evaluation.
- [ ] Routing log displays at least 10 most-recent decisions with rule traceability.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, create a routing rule, log in as `patient@hpcms.local`, submit an LOA, log back in as admin and confirm the routing log shows the matched rule.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
