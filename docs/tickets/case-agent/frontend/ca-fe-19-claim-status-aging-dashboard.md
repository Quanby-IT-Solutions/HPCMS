# CA-FE-19 — Claim Status & Aging Dashboard

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 9.4, 9.9 · User Flows: I4, I7 |
| Existing Code | CA-FE-17, CA-BE-10 |

## Scope

Dashboard summarizing claims by status with aging buckets, plus a Claim Status Update flow on Claim Detail.

## Objectives

- `/agent/claims` dashboard with KPI cards (total claims by status, outstanding amount, claims breaching SLA) and aging bucket table (0–30 / 31–60 / 61–90 / 90+).
- Click a bucket → filtered claims list.
- Claim Detail status update modal: status (Draft / Submitted / Under Review / Approved / Rejected / Appealed / Paid), notes (payer ref, rejection code, payment receipt).
- "Initiate Appeal" prompt when status = Rejected.
- CSV / PDF export of aging report.

## Dependencies

- CA-FE-17, CA-BE-10.

## Acceptance Criteria

- [ ] Dashboard KPIs match data.
- [ ] Aging buckets correct given submission dates.
- [ ] Status update modal records reason.
- [ ] Rejection prompts appeal flow.
- [ ] Export downloads.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, advance a claim through statuses.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
