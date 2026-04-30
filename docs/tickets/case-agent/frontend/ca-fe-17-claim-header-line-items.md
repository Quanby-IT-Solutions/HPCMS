# CA-FE-17 — Claim Header & Line Items Forms

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 9.1, 9.2, 9.3 · User Flows: I1, I2 · TOR: DM-06, DM-07 |
| Existing Code | CA-FE-06, CA-BE-10 |

## Scope

Claim Header creation page (linked to a healthcare case) and Claim Line Item entry with code-lookup support. Reachable from Case Detail Claims tab and from a global Claims list.

## Objectives

- "Create Claim" CTA on Case Detail Claims tab → Claim Header form (payer name, coverage id, submission date, total amount, claim type LOA / Hospitalization / Outpatient).
- `/agent/claims/[id]` Claim Detail Page with header summary + Line Items table + DRG panel slot.
- "Add Line Item" form: service code, diagnosis code, procedure code, quantity, billed amount, approved amount.
- `<CodeLookupPanel>` slide-out for ICD / CPT / PHIC code search with description.
- Running total compared to header amount with mismatch warning.
- Payer / Coverage management page at `/agent/claims/payers`.

## Dependencies

- CA-FE-06, CA-BE-10.

## Acceptance Criteria

- [ ] Claim header creates and opens detail.
- [ ] Line item form validates.
- [ ] Code lookup returns sample codes.
- [ ] Running total updates and warns on mismatch.
- [ ] Payer management CRUD works.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, create claim header for a case, add line items.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
