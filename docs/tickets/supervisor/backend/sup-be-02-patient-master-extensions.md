# SUP-BE-02 — Patient Master CRUD Extensions (Demographics, Audit, Change-Reason)

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.1, 2.3, 2.9 · User Flows: B1, B3 · TOR: DM-01 |
| Existing Code | `apps/backend/src/modules/v1/patients/`, `packages/db/schema/patients.ts` |

## Scope

Extend the existing patients module to support: full demographic field set, mandatory change-reason on update, audit history retrieval, and the consent flag fields owned by SUP-BE-12.

## Objectives

- Schema additions to `patients` table: ethnicity, sex_at_birth, address jsonb, email, phone, emergency_contact jsonb, hmo_card_number, hmo_provider.
- Endpoint: `patients.create` (server-side duplicate detection enabled).
- Endpoint: `patients.update` (requires `change_reason` field).
- Endpoint: `patients.audit.list` (full change history per patient).
- Audit emission on every create/update.
- Tenant-scope all queries; cross-facility check via SA-BE-05 + SUP-FE-20 flow.

## Dependencies

- SUP-BE-01, SUP-BE-03, SUP-BE-12.

## Acceptance Criteria

- [ ] Migrations add the new columns.
- [ ] Update without `change_reason` returns 400.
- [ ] Audit history endpoint returns chronological change list.
- [ ] List/get scoped to caller's tenants.
- [ ] Permission `patient.write` required for create/update.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test patients && pnpm --filter @repo/backend typecheck`.
