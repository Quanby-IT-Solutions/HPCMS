# SUP-BE-03 — Duplicate Detection & Merge Service

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 2.8 · User Flows: B7 |
| Existing Code | `apps/backend/src/modules/v1/patients/`, SUP-BE-02 |

## Scope

Detect potential duplicate patient records on create, expose detection-search and merge endpoints, and physically merge cases, communications, and consent flags onto the surviving record.

## Objectives

- Endpoint: `patients.detectDuplicates` (input: name, DOB, phone; output: ranked candidates with similarity score).
- Endpoint: `patients.merge` (sourcePatientId, targetPatientId, fieldResolutions, mergeReason).
- Service uses fuzzy match on name + DOB + phone.
- Merge runs in a transaction: re-parents cases / communications / programs / devices / consent / attachments to the surviving patient; marks the superseded record `merged_into = targetPatientId` (no physical delete).
- Audit the merge event.

## Dependencies

- SUP-BE-01, SUP-BE-02.

## Acceptance Criteria

- [ ] Detect endpoint returns candidates with score > 0.7 for clear duplicates.
- [ ] Merge re-parents all owned rows.
- [ ] Superseded record returns 410 with redirect on subsequent fetches.
- [ ] Audit log captures the merge.
- [ ] Permission `patient.merge` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test patients-merge && pnpm --filter @repo/backend typecheck`.
