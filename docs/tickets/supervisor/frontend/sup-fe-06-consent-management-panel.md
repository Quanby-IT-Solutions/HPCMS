# SUP-FE-06 — Consent Management Panel & Recording / Withdrawal Forms

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.5, 11.1, 11.2 · User Flows: B5, K1, K2 · TOR: SC-01 |
| Existing Code | SUP-FE-04, SUP-BE-12 |

## Scope

Right-rail panel for managing patient consent flags by category, with Record Consent and Withdraw Consent forms. Withdrawals immediately propagate as restrictions surfaced on the patient banner.

## Objectives

- `<ConsentManagementPanel>` listing categories (data processing, communications, specific service categories) with current status (Granted / Withdrawn / Not Collected) and effective date.
- "Record Consent" form: category selector, status, method of capture (Written / Verbal Witnessed / Electronic), date, optional document upload.
- "Withdraw Consent" form: category selector, effective date, reason field, confirmation checkbox.
- Patient Profile banner shows active restrictions when any consent is withdrawn.
- Consent History Log tab/panel listing all events.

## Out of Scope

- Consent audit panel (TA-FE-13).

## Dependencies

- SUP-FE-04, SUP-BE-12.

## Acceptance Criteria

- [ ] Recording consent persists with the staff member's identity and timestamp.
- [ ] Withdrawing consent immediately shows a banner on the Patient Profile.
- [ ] Subsequent communication actions blocked by withdrawn consent show inline warnings.
- [ ] Consent History Log lists all events.
- [ ] Optional document upload works for written-consent attachments.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, withdraw "communications" consent for Maria Santos, attempt outbound message and observe the warning.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
