# SA-FE-09 — AI Triage Configuration Page

| Field | Value |
|-------|-------|
| Role  | System Admin |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 3 |
| Source Refs | User Stories: 5.1, 5.7 · User Flows: E7 · TOR: FR-03 |
| Existing Code | `apps/web/features/staff-admin/`, `<AdminDataTable>` from SA-FE-02 |

## Scope

Page that configures the AI/rule-based auto-categorization engine: triage categories, trigger keywords/phrases, negative keywords, confidence thresholds, and a live test simulator. Backed by SA-BE-08.

## Objectives

- Page at `/admin/ai-triage` with two subviews: Categories list and Test Simulator.
- Categories list (`<AdminDataTable>`): category name, keyword count, threshold, status, priority order.
- Add/edit category form (Category Rule Manager): name, trigger keyword chips, negative keyword chips, confidence threshold slider (0–1), routing recommendation (links to a routing rule).
- Test Simulator: free-text message input, "Run Test" button, returns matched category + confidence + highlighted keywords.
- Drag-reorder for category priority.

## Out of Scope

- Categorization service implementation (SA-BE-08).
- Override logging on inbox (CA-FE-14).

## Dependencies

- SA-FE-01, SA-FE-02, SA-BE-08.

## Acceptance Criteria

- [ ] `/admin/ai-triage` lists at least the seeded "LOA Request", "Billing Inquiry", and "Complaint" categories.
- [ ] Adding a new category with keywords `["pain", "appointment"]` and threshold 0.7 persists.
- [ ] Test Simulator with input "I need to schedule a pain appointment" returns the new category with ≥ 0.7 confidence and highlights the matched keywords.
- [ ] Negative keywords prevent classification (test: input "no pain" → not matched).
- [ ] Reordering categories updates evaluation precedence.

## Verification

- **Manual demo**: log in as `system@hpcms.local`, configure a category, run simulator, observe match.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
