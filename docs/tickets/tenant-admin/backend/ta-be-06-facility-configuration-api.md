# TA-BE-06 — Facility Configuration API

| Field | Value |
|-------|-------|
| Role  | Tenant Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 12.5 · User Flows: L3 |
| Existing Code | `packages/db/schema/tenancy.ts`, `packages/db/schema/templates.ts`, `apps/backend/src/common/templates/` |

## Scope

Per-tenant configuration of SLA thresholds, notification templates, departments, and default routing rules. Persisted under the tenant id and consumed by case lifecycle and notification flows.

## Objectives

- Schema: `tenant_sla_overrides`, `tenant_notification_templates`, `tenant_departments` tables.
- Endpoints: `tenantAdmin.facility.sla.*`, `.notifications.*`, `.departments.*`.
- Notification template variable substitution at send time.
- Audit all changes; tenant-scope all reads.

## Dependencies

- TA-BE-01.

## Acceptance Criteria

- [ ] Migrations create the three tables.
- [ ] SLA override applies to next-created case of that type.
- [ ] Template editor preview substitutes `{{patient.name}}` and other supported variables.
- [ ] Department deactivation blocks new assignments without breaking existing cases.
- [ ] Permission `tenant.configure` required.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test facility-config && pnpm --filter @repo/backend typecheck`.
