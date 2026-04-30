# PAT-BE-05 — My Requests / Status Tracking API

| Field | Value |
|-------|-------|
| Role  | Patient |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 6.5 · User Flows: F4 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, PAT-BE-01 |

## Scope

Patient-scoped endpoint that returns all cases the patient submitted, with status, history, and any team messages.

## Objectives

- Endpoint: `portal.myRequests.list` (returns patient's own cases with status badges).
- Endpoint: `portal.myRequests.get` (case detail with status timeline + team messages + reply CTA target).
- Endpoint: `portal.myRequests.reply` (post a reply to the case thread).
- Strict ownership check: patient can only access their own cases.

## Dependencies

- PAT-BE-01, SUP-BE-05.

## Acceptance Criteria

- [ ] List returns only cases owned by the requesting patient.
- [ ] Detail returns status timeline.
- [ ] Reply posts a portal-chat message to the case.
- [ ] Cross-patient access returns 403.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test my-requests && pnpm --filter @repo/backend typecheck`.
