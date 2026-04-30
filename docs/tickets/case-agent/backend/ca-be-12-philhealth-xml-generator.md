# CA-BE-12 — PhilHealth XML Generator (CF5 / eSOA)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 9.7, 9.8 · User Flows: I5, I6 · TOR: FP-02 |
| Existing Code | CA-BE-10, CA-BE-11 |

## Scope

Generate PhilHealth-compliant CF5 (Claim Form 5) and eSOA (Electronic Statement of Account) XML payloads from finalized claims, with validation against schema before emission.

## Objectives

- Service: `XmlGeneratorService.generateCf5(claimId)` and `.generateEsoa(claimId)`.
- XML schemas validated using a packaged XSD or schema definition.
- Endpoints: `claims.xml.cf5.generate`, `claims.xml.esoa.generate`, `claims.xml.preview`.
- Output stored to `common/storage` with audit log entry containing file hash.
- Re-generation increments version.

## Dependencies

- CA-BE-10, CA-BE-11, `common/storage`.

## Acceptance Criteria

- [ ] CF5 generation produces XML that passes schema validation.
- [ ] eSOA generation produces XML that passes schema validation.
- [ ] File stored with hash in audit log.
- [ ] Permission `xml.export` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test xml-generator && pnpm --filter @repo/backend typecheck`.
