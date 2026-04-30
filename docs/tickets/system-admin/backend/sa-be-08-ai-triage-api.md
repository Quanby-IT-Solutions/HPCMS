# SA-BE-08 — AI Triage Categories API + Classifier Hooks

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.1, 5.7 · User Flows: E1, E7 · TOR: FR-03 |
| Existing Code | `apps/backend/src/modules/v1/cases/`, `apps/backend/src/common/notifications/` |

## Scope

Implement the configurable triage classifier: persist categories with keyword/threshold/negative-keyword config, expose CRUD, run a deterministic rules-based classifier on each inbound communication, and write the suggestion (with confidence) onto the inbox item. Pluggable interface for a future ML classifier.

## Objectives

- Schema: `triage_categories` table (id, tenant_id, name, keywords jsonb, negative_keywords jsonb, threshold numeric, priority_order, active bool, recommended_routing_rule_id).
- Schema: `triage_suggestions` table (id, communication_id, category_id, confidence numeric, applied bool, overridden_to_id nullable).
- Endpoints: `staff-admin.aiTriage.categories.*` (CRUD + reorder), `staff-admin.aiTriage.simulate` (test-runner).
- `TriageClassifier` interface with a `RulesBasedClassifier` implementation; pluggable so a future ML classifier can drop in.
- Hook into `common/notifications` and inbox ingestion flows.

## Out of Scope

- ML model training (TOR Phase-3 stretch).

## Dependencies

- SA-BE-01.

## Acceptance Criteria

- [ ] Migrations create both tables and seed three baseline categories.
- [ ] `simulate` endpoint accepts text and returns matched category, confidence, and matched-keyword highlights.
- [ ] Classifier fires on new communications and writes a `triage_suggestion` row.
- [ ] Negative keywords prevent classification.
- [ ] Suggestions are tenant-scoped.
- [ ] Override endpoint records the human override for future training.

## Verification

- **Manual demo**: SA-FE-09 simulator returns expected matches; submit a new portal chat and observe the suggestion attached.
- **Automated check**: `pnpm --filter @repo/backend test ai-triage && pnpm --filter @repo/backend typecheck`.
