# SUP-BE-10 — Medical Device Tracking Service

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 8.4, 8.5, 8.6, 8.7 · User Flows: H3, H4, H5, H7 · TOR: FR-06, DM-05 |
| Existing Code | `packages/db/schema/patients.ts`, SUP-BE-01 |

## Scope

Persist medical device assignments to patients/cases with lifecycle status (Assigned, In Use, Returned, Decommissioned, Under Maintenance) and maintenance history. Expose CRUD endpoints and a facility-level inventory list.

## Objectives

- Schema: `device_types` (catalog of supported types: CPAP, IoT Monitor, Pulse Oximeter, etc.).
- Schema: `device_install_base` (id, tenant_id, serial_number, device_type_id, patient_id, case_id, status, assignment_date, last_service_date).
- Schema: `device_maintenance_log` (id, device_id, service_date, type, technician, notes).
- Endpoints: `devices.assign`, `devices.update`, `devices.maintenance.add`, `devices.list`, `devices.inventory`.
- Permission `device.assign` required.

## Dependencies

- SUP-BE-01.

## Acceptance Criteria

- [ ] Migrations create the three tables.
- [ ] Assigning a device persists.
- [ ] Maintenance add updates `last_service_date`.
- [ ] Status updates persist and are listed in inventory.
- [ ] Tenant-scoped reads.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test devices && pnpm --filter @repo/backend typecheck`.
