# CA-BE-05 — Unified Inbox Aggregation Service

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.1, 4.8 · User Flows: D1, D7 · TOR: FR-02 |
| Existing Code | `apps/backend/src/common/notifications/`, CA-BE-06 |

## Scope

Unified inbox table that ingests email, phone, social, chat into a single feed with status, channel, AI suggestion, and case linkage.

## Objectives

- Schema: `inbox_items` (id, tenant_id, channel enum, sender_id nullable, patient_id nullable, subject, body, received_at, status enum, ai_suggestion_id nullable, linked_case_id nullable).
- Endpoints: `inbox.list`, `inbox.get`, `inbox.attachToCase`, `inbox.resolve`, `inbox.search`.
- Communication search endpoint with full-text on body + filter combinations.
- Tenant-scope.

## Dependencies

- CA-BE-01, CA-BE-06, CA-BE-08.

## Acceptance Criteria

- [ ] Migrations create `inbox_items`.
- [ ] List endpoint returns items across channels.
- [ ] Search returns relevant matches.
- [ ] Status updates persist.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test inbox && pnpm --filter @repo/backend typecheck`.
