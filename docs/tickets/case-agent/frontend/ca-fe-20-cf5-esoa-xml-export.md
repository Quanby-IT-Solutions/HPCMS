# CA-FE-20 — CF5 / eSOA XML Export & Preview

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 9.7, 9.8 · User Flows: I5, I6 · TOR: FP-02 |
| Existing Code | CA-FE-17, CA-BE-12 |

## Scope

XML Export Panel on Claim Detail with CF5 (Claim Form 5) and eSOA (Electronic Statement of Account) generation, preview, and download. Validates the claim against schema before export.

## Objectives

- `<XmlExportPanel>` with `Generate CF5` and `Generate eSOA` buttons.
- Pre-export validation against PhilHealth CF5 / eSOA schemas; surface errors inline.
- `/agent/claims/[id]/export/cf5` Preview Page with field-by-field structured XML view + raw XML toggle + Download.
- `/agent/claims/[id]/export/esoa` Preview Page (same shape).
- Export event logged with file hash.

## Dependencies

- CA-FE-17, CA-FE-18, CA-BE-12.

## Acceptance Criteria

- [ ] Validation errors block download.
- [ ] Successful export downloads a `.xml` file.
- [ ] Preview renders both structured and raw views.
- [ ] Audit log records export with hash.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, generate CF5 for a complete claim.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
