# SUP-FE-17 — Medical Device Assignment, Detail, Lifecycle UI

| Field | Value |
|-------|-------|
| Role  | Supervisor |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 8.4, 8.5, 8.6 · User Flows: H3, H4, H7 · TOR: FR-06, DM-05 |
| Existing Code | SUP-FE-04 right rail, SUP-BE-10 |

## Scope

Patient Profile right-rail Assigned Devices panel + Device Assignment form + Device Detail (with maintenance + status update) + facility Device Inventory List.

## Objectives

- `<AssignedDevicesPanel>` on Patient Profile listing devices (type, serial, status, assignment date).
- "Assign Device" form: serial number, device type selector, assignment date, case link, initial status.
- `/supervisor/devices/[id]` Device Detail with metadata + Maintenance History Panel + Add Maintenance Record Form (date, type Routine/Repair/Calibration/Inspection, technician, notes) + Status Update Form (Assigned / In Use / Returned / Decommissioned / Under Maintenance).
- `/supervisor/devices` Device Inventory List (facility scope, status filter).

## Out of Scope

- Read-only Case Agent panel (CA-FE-16).

## Dependencies

- SUP-FE-04, SUP-BE-10.

## Acceptance Criteria

- [ ] Panel renders devices.
- [ ] Assign form persists and panel updates.
- [ ] Device Detail shows maintenance entries chronologically.
- [ ] Adding maintenance updates "Last Service Date".
- [ ] Status updates persist and inventory list reflects them.

## Verification

- **Manual demo**: log in as `supervisor@hpcms.local`, assign a CPAP device, log a maintenance.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
