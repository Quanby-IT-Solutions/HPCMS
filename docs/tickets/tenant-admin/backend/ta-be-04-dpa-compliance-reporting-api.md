# TA-BE-04 — DPA Compliance Reporting API

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 11.6 · User Flows: K5 · TOR: SC-01 |
| Existing Code | `apps/backend/src/common/audit/`, SUP-BE-12 (consent service) |

## Scope

Aggregate consent coverage, PHI access counts, audit completeness, and outstanding consent gaps into a single DPA compliance summary suitable for the hospital's DPO.

## Objectives

- Endpoint: `compliance.dpa.kpis` (latest KPI values for the dashboard).
- Endpoint: `compliance.dpa.report` (generates a structured report for a specified period).
- Endpoint: `compliance.dpa.export` (PDF render and email-to-DPO).
- Audit completeness heuristic: ratio of write actions with audit entries vs. total writes.
- Email send via `common/email` with rate-limit + delivery audit.

## Dependencies

- TA-BE-01, TA-BE-02, TA-BE-03, SUP-BE-12.

## Acceptance Criteria

- [ ] KPIs return non-null numeric values from seeded data.
- [ ] Report has all four sections populated.
- [ ] PDF export renders without missing sections.
- [ ] Email-to-DPO sends a real email when configured.
- [ ] Permission `audit.view` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test dpa-report && pnpm --filter @repo/backend typecheck`.
