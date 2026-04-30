# CA-FE-11 — Social Media Inquiry Capture

| Field | Value |
|-------|-------|
| Role  | Case Agent |
| Layer | Frontend |
| Category | Page Implementation |
| Phase | TOR Phase 2 |
| Source Refs | User Stories: 4.4 · User Flows: D4 |
| Existing Code | CA-FE-02, CA-FE-08 |

## Scope

Form to capture patient inquiries received via Facebook, X (Twitter), or Instagram into the PCMS inbox with optional patient identification.

## Objectives

- "Capture Social Inquiry" button on inbox.
- Form: platform selector, content text, patient search (or "Anonymous"), issue category.
- Submit creates an inbox item; "Create Case from Inquiry" pre-populates SUP-FE-08 with source channel `social_media`.
- Tag indicates inquiries linked to anonymous senders.

## Dependencies

- CA-FE-02, CA-FE-08, CA-BE-06.

## Acceptance Criteria

- [ ] Platform selector covers FB, X, IG.
- [ ] Anonymous flag works.
- [ ] Create-case CTA pre-fills correctly.
- [ ] Inquiry appears in inbox with platform icon.

## Verification

- **Manual demo**: log in as `agent@hpcms.local`, capture a Facebook inquiry, escalate to a case.
- **Automated check**: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web lint`.
