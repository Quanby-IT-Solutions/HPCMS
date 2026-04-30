# SUP-BE-12 — Consent Management Service

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.5, 11.1, 11.2, 11.3 · User Flows: B5, K1, K2 · TOR: SC-01 |
| Existing Code | `packages/db/schema/patients.ts`, `apps/backend/src/common/audit/` |

## Scope

Persist consent records (categories, status, method, effective dates) and expose endpoints to record, withdraw, and list consent. Withdrawal triggers downstream restriction enforcement.

## Objectives

- Schema: `consents` (id, patient_id, category, status enum {Granted, Withdrawn, NotCollected}, method enum, effective_date, document_attachment_id, recorded_by, recorded_at).
- Endpoints: `consent.record`, `consent.withdraw`, `consent.list`, `consent.history`.
- Hook: `ensureConsent(patientId, category)` middleware that downstream actions (e.g., outbound communications) call before executing.
- Audit every consent action.

## Dependencies

- SUP-BE-01, SUP-BE-02.

## Acceptance Criteria

- [ ] Migrations create the consents table.
- [ ] Recording / withdrawing / listing endpoints work.
- [ ] `ensureConsent` blocks an outbound message when status = Withdrawn for `communications`.
- [ ] History endpoint returns chronological events with actor.
- [ ] Permission `consent.write` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test consent && pnpm --filter @repo/backend typecheck`.
