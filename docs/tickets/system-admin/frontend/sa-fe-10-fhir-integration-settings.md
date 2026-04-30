# SA-FE-10 — FHIR Integration Settings & OAuth Configuration

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 10.7, 10.8 · User Flows: J5 · TOR: IR-02, IR-03, IR-04 |
| Existing Code | `apps/web/features/staff-admin/`, `packages/fhir/`, `apps/backend/src/common/fhir/` |

## Scope

Page that configures FHIR resource read/write permissions, SMART on FHIR OAuth client settings, and connection status against the Altera Sunrise developer API. Backed by SA-BE-09.

## Objectives

- Page at `/admin/fhir-settings` using `<SettingsTabs>` with Resource Permissions, OAuth Settings, Connection Status, and Audit Log tabs.
- **Resource Permissions tab**: matrix of all 20 supported FHIR R4 resources × {Read, Write} toggles. Bulk "Read-only mode" preset.
- **OAuth Settings tab**: SMART authorization server URL, client ID, masked client secret (with reveal/copy), allowed scopes multi-select, token expiry / refresh fields.
- **Connection Status tab**: "Test Connection" button, last-tested timestamp, response status, error detail panel.
- **Audit Log tab**: recent FHIR launch events (read-only excerpt, links to full TA-FE-03).

## Out of Scope

- FHIR client implementation (`packages/fhir/`).
- Per-tenant sync schedules (J8 — covered by SUP-FE-05 and SA-BE-09).

## Dependencies

- SA-FE-01, SA-FE-02, SA-BE-09.

## Acceptance Criteria

- [ ] `/admin/fhir-settings` renders all four tabs.
- [ ] Toggling write permission for `Encounter` persists and is enforced by the backend (returns 403 on disallowed write).
- [ ] OAuth client secret is never displayed in plaintext by default.
- [ ] "Test Connection" calls the Altera FHIR `metadata` endpoint and reports success/failure with response time.
- [ ] All saves are recorded in the audit log.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, visit `/admin/fhir-settings`, run Test Connection (uses `packages/fhir/client/stub.ts` in dev), confirm success.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
