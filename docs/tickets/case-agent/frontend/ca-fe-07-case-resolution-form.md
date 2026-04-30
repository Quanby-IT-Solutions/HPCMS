# CA-FE-07 — Case Resolution Form

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.6 · User Flows: C5 |
| Existing Code | CA-FE-06, SUP-BE-05 |

## Scope

Modal Resolution Form launched from Case Detail when status is `In Progress` or `Pending Patient`. Captures resolution summary, category, attachments, and triggers patient notification.

## Objectives

- "Resolve Case" button on Case Detail (visible per status + permission).
- Modal form: resolution summary, resolution category (Resolved-Patient Satisfied / Resolved-Escalated to Clinician / Closed-Duplicate / Closed-No Action), attachment uploader, link to related communications.
- Submit sets status to `resolved`, records closure timestamp, updates SLA metrics, optionally notifies patient.
- Closed cases enter read-only mode in the UI.

## Dependencies

- CA-FE-06, SUP-BE-05.

## Acceptance Criteria

- [ ] Modal shows correct resolution categories.
- [ ] Submission updates status and records closure timestamp.
- [ ] Patient notification is sent when consent allows.
- [ ] Closed case banner enables read-only mode.
- [ ] Audit log records the resolution.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, resolve a seeded case.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
