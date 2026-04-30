# SUP-FE-09 — Case Escalation Form & History Panel

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.5 · User Flows: C4 |
| Existing Code | SUP-FE-02 case shell, SUP-BE-05 |

## Scope

Modal escalation form on Case Detail and an Escalation History panel on the case's right rail.

## Objectives

- "Escalate Case" button on Case Detail opens a modal with: escalation level (Senior Coordinator / Department Head / Incident Management), reason category, detailed notes.
- Submit updates case status to `escalated`, re-routes to target team, emits notifications, appends to history.
- `<EscalationHistoryPanel>` listing every escalation event with level, reason, actor, timestamp.
- SLA timer adapts to escalation tier.

## Out of Scope

- Linking related cases (SUP-FE-10).

## Dependencies

- SUP-FE-02, SUP-FE-08, SUP-BE-05.

## Acceptance Criteria

- [ ] Modal validates required fields.
- [ ] Submitting escalates the case and notifies the new team.
- [ ] Status banner updates to "Escalated".
- [ ] Escalation History panel lists the new event.
- [ ] SLA badge reflects escalation thresholds.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, escalate a case, observe banner and history.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
