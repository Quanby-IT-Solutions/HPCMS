# CA-BE-08 — AI Categorization Service (Rules + Extensible Classifier)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Backend |
| Category | API Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.1, 5.7 · User Flows: E1 · TOR: FR-03 |
| Existing Code | SA-BE-08, CA-BE-05 |

## Scope

Hook into inbox ingestion to invoke the configurable classifier (SA-BE-08) and persist suggestions on `inbox_items`. Provide an override endpoint to record agent corrections.

## Objectives

- Service: `TriageInvocationService` runs on every new `inbox_items` insert.
- Endpoint: `inbox.suggestion.accept` (creates/links case with suggested type, persists as `applied`).
- Endpoint: `inbox.suggestion.override` (records correction, links case with corrected type).
- Override events available to a future ML training feedback loop.

## Dependencies

- SA-BE-08, CA-BE-05.

## Acceptance Criteria

- [ ] New inbox items emit a suggestion when category matches.
- [ ] Accept creates case and marks suggestion applied.
- [ ] Override records the correction with reason and updates case category.
- [ ] Permission `case.create` required for accept.

## Verification

- **Automated check**: `pnpm --filter @repo/backend test triage-invocation && pnpm --filter @repo/backend typecheck`.
