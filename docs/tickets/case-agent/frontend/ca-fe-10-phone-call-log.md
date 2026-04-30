# CA-FE-10 — Phone Call Log Entry Form

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.3 · User Flows: D3 |
| Existing Code | CA-FE-02, CA-FE-08 |

## Scope

Form to log inbound or outbound phone calls with patient lookup, duration, summary, and case linkage. Reachable from inbox and from Patient Profile.

## Objectives

- "Log Call" button on inbox and patient profile.
- Form fields: direction, patient (search by name/phone/MRN), date, start time, duration, reason category, summary notes, case link / create new.
- Submit appends to inbox feed + patient 360 timeline.

## Dependencies

- CA-FE-02, CA-BE-06.

## Acceptance Criteria

- [ ] Form validates required fields.
- [ ] Submitted log appears in inbox and timeline.
- [ ] Linked to existing case or creates new.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, log a 5-minute call.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
