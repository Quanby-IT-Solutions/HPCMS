# CA-FE-06 — Case Detail Page Shell (Header / Status / Tabs)

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 1 |
| Source Refs | User Stories: 3.6, 3.8, 3.9 · TOR: DM-03 |
| Existing Code | `apps/web/features/staff-case-detail/`, SUP-FE-02 |

## Scope

The Case Detail page that renders the `<CaseDetailShell>` and hosts every panel contributed by other tickets (assignment, escalation, related cases, communications, claims, FHIR resources, playbook, attachments). This ticket builds the page-level structure plus the Overview tab.

## Objectives

- Page at `/agent/cases/[id]` rendering `<CaseDetailShell>` with header (case id, status, priority, SLA timer, tags) and tabs (Overview, Communications, Notes, Linked, Claims, Attachments).
- Overview tab summarizes: case header, patient summary card, case description, recent activity feed.
- Right rail slots reserved for SUP-FE-08, SUP-FE-09, SUP-FE-10, CA-FE-15, CA-FE-16, SUP-FE-19 panels.
- Permission-aware action buttons (Resolve, Escalate, Reassign).

## Dependencies

- SUP-FE-02, CA-FE-01, CA-BE-04.

## Acceptance Criteria

- [ ] `/agent/cases/[id]` loads a seeded case for Maria Santos.
- [ ] Header displays correct case status / priority / SLA timer.
- [ ] All right-rail slots render placeholder cards for not-yet-built panels.
- [ ] Tabs navigate without page reload.
- [ ] Patient summary card links to patient profile.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, open a seeded case.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
