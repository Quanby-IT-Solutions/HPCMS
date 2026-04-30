# CA-BE-09 — Playbook Engine

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.3 · User Flows: E3 · TOR: FR-03 |
| Existing Code | SA-BE-06 (case types), CA-BE-04 |

## Scope

Persist playbook templates per case type, expose an endpoint that returns the playbook for a case, and persist per-case checklist progress.

## Objectives

- Schema: `playbooks` (id, tenant_id, case_type_id, steps jsonb {ordered list of steps with title, description, action_link}, status).
- Schema: `case_playbook_progress` (case_id, step_index, completed_at, completed_by).
- Endpoints: `playbooks.list`, `playbooks.upsert`, `cases.playbook.get`, `cases.playbook.completeStep`.
- Persisted per case so multiple agents can pick up where another left off.

## Dependencies

- CA-BE-01, SA-BE-06.

## Acceptance Criteria

- [ ] Migrations create both tables.
- [ ] Get endpoint returns playbook + per-case progress.
- [ ] Complete step persists.
- [ ] On case closure, completion percentage is computable.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test playbooks && pnpm --filter @repo/backend typecheck`.
