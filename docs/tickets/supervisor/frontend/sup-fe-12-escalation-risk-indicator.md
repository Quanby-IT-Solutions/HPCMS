# SUP-FE-12 — Escalation Risk Indicator on Case Queue

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.4 · User Flows: E4 · TOR: FR-03 |
| Existing Code | `apps/web/features/staff-case-queue/`, SUP-BE-06 |

## Scope

Add a risk indicator badge to each row on the Case Queue Dashboard, with hover explanation, drill-in to the case, and an Override Risk Flag with note.

## Objectives

- Risk badge column on Case Queue (color-coded by risk score).
- Hover tooltip lists contributing factors (case age, unanswered communications, complaint keyword match, SLA proximity).
- Click badge opens Case Detail with the risk panel highlighted.
- Override flag modal: justification + log entry.

## Dependencies

- CA-FE-05 (queue dashboard), SUP-BE-06.

## Acceptance Criteria

- [ ] Risk badge appears on every row with color-coded level.
- [ ] Tooltip lists factors and last-updated time.
- [ ] Override creates a logged audit entry; badge updates accordingly.
- [ ] Sorting by risk works.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, sort queue by risk, override a flag.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
