# SA-BE-09 — FHIR Integration Settings API

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | Integration & API Connectivity |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 10.7, 10.8, 10.9 · User Flows: J5, J8 · TOR: IR-02, IR-03, IR-04 |
| Existing Code | `packages/fhir/`, `apps/backend/src/common/fhir/` |

## Scope

Persist FHIR resource read/write permissions and SMART OAuth client configuration per tenant. Provide a "Test Connection" endpoint that probes the Altera Sunrise developer API. Publish a hook the rest of the backend uses to gate FHIR operations against current settings.

## Objectives

- Schema: `fhir_resource_permissions` (tenant_id, resource_type, can_read, can_write).
- Schema: `fhir_oauth_settings` (tenant_id, auth_server_url, client_id, encrypted_secret, allowed_scopes jsonb, token_ttl_seconds, refresh_ttl_seconds).
- Schema: `fhir_sync_schedule` (tenant_id, mode enum {manual, scheduled}, interval_minutes nullable).
- Endpoints: `staff-admin.fhir.permissions.*`, `staff-admin.fhir.oauth.*`, `staff-admin.fhir.sync.*`, `staff-admin.fhir.testConnection`.
- Wire `packages/fhir/client/altera-sunrise.ts` to consume these settings.
- Encrypt the OAuth secret at rest (AES-256 key from env).
- Audit settings changes; record `Test Connection` results.

## Out of Scope

- Per-resource sync logic (SUP-BE-04, SUP-BE-11, CL-BE-05).

## Dependencies

- SA-BE-01, SA-BE-04.

## Acceptance Criteria

- [ ] Migrations create the three tables.
- [ ] `testConnection` returns success against the dev stub client (`packages/fhir/client/stub.ts`).
- [ ] Toggling `Encounter.write = false` causes downstream encounter writes to return 403.
- [ ] Stored client secret is encrypted in the DB and decrypted only in-memory.
- [ ] Sync schedule updates trigger the scheduler immediately.
- [ ] Audit log records all settings changes.

## Verification

- **Manual demo**: SA-FE-10 → set permissions, run Test Connection, observe success.
- **Automated check**: `pnpm --filter @repo/backend test fhir-settings && pnpm --filter @repo/backend typecheck`.
