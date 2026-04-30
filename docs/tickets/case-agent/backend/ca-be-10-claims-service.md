# CA-BE-10 — Claims Service (Header / Lines / Status)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 9.1, 9.2, 9.3, 9.4, 9.9 · User Flows: I1, I2, I4, I7 · TOR: DM-06, DM-07 |
| Existing Code | `apps/backend/src/modules/v1/cases/` |

## Scope

Persist claim headers, line items, payer/coverage references, and status lifecycle. Expose CRUD + dashboard endpoints.

## Objectives

- Schema: `payers`, `coverages`, `claim_headers`, `claim_lines`, `claim_status_history`.
- Endpoints: `claims.headers.*`, `claims.lines.*`, `claims.status.update`, `claims.dashboard.kpis`, `claims.aging.report`.
- Status enum: Draft / Submitted / UnderReview / Approved / Rejected / Appealed / Paid.
- Total amount auto-summed from lines with mismatch warning.
- Tenant-scope.

## Dependencies

- CA-BE-01.

## Acceptance Criteria

- [ ] Migrations create five tables.
- [ ] Header create / line item add / status update endpoints work.
- [ ] Aging report buckets correctly given submission dates.
- [ ] Dashboard KPIs match aggregates.
- [ ] Permission `claim.write` required for mutations.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test claims && pnpm --filter @repo/backend typecheck`.
