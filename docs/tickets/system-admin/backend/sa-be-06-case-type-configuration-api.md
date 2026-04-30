# SA-BE-06 — Case Type Configuration API + Dynamic Schema

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.7 · User Flows: C6 · TOR: NFR-03 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, `packages/db/schema/cases.ts` |

## Scope

Persist user-defined case types and expose them so that the case engine and the New Case Form can pick them up dynamically without code changes. Each case type defines metadata and the field set required when creating a case of that type.

## Objectives

- Schema: `case_types` table (id, name, description, default_priority, sla_hours, default_team, required_field_keys jsonb, optional_field_keys jsonb, default_routing_rule_id nullable, status enum, tenant_id).
- Seed the canonical types: LOA Request, Billing Inquiry, Complaint, Care Coordination, Drug Program Enrollment.
- Endpoints: `staff-admin.caseTypes.list`, `.get`, `.create`, `.update`, `.archive`.
- Reference enforcement: deleting/archiving a case type does not delete cases — cases keep their original `case_type_id`.
- The case-creation flow reads from this table to determine valid types and required fields.

## Out of Scope

- Case creation UI (SUP-FE-08).

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] Migration adds `case_types` and seeds the five canonical types.
- [ ] Listing returns active case types scoped to the requesting tenant.
- [ ] Creating a new case type makes it available to subsequent case creations.
- [ ] Archived case types do not appear in the case-creation type selector but remain usable for filters and historical cases.
- [ ] Validation rejects negative SLA hours.
- [ ] Audit log records all changes.

## Verification

- **Manual demo**: through SA-FE-07, add a "Drug Program Enrollment" type, then via SUP-FE-08 create a case of that type.
- **Automated check**: `pnpm --filter @repo/backend test case-types && pnpm --filter @repo/backend typecheck`.
