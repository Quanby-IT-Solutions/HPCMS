# CL-FE-05 — Add Clinical Note / Flag Case from Sidebar

| Field | Value |
|-------|-------|
| Role  | Clinician |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 10.10 · User Flows: J9 |
| Existing Code | CL-FE-04, CL-BE-04 |

## Scope

Inline forms within the sidebar for adding a brief clinical note or flagging a case for coordinator attention without leaving the EMR workflow.

## Objectives

- "Add Note" button on each case entry → inline textarea (character limit 500), Save button.
- "Flag" button → modal with flag type (Urgent Review / Medication Query / Follow-up Required / Safety Concern) and reason text.
- On save: case audit updated, assigned Case Agent notified, badge appears on Case Detail and Case Queue.

## Dependencies

- CL-FE-04, CL-BE-04.

## Acceptance Criteria

- [ ] Note saves and is visible on Case Detail to the assigned agent.
- [ ] Flag persists and surfaces a badge on Case Queue.
- [ ] Notification reaches the assignee.
- [ ] Character limit enforced.

## Verification

- **Manual demo**: launch sidebar, flag a case as "Urgent Review", confirm Case Agent sees badge.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
