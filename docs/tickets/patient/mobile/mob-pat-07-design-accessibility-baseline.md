# MOB-PAT-07 — Mobile Design Tokens & Accessibility Baseline

| Field | Value |
|-------|-------|
| Role  | Patient (mobile) |
| Layer | Mobile (Flutter) |
| Category | Frontend Design & UI/UX |
| Phase | TOR Phase 1 |
| Source Refs | TOR: NFR-05 · Pairs with PAT-FE-02 |
| Existing Code | `apps/mobile/lib/core/theme/`, `lib/shared/widgets/`, MOB-PAT-01 |

## Scope

Patient-friendly Flutter theme, typography scale, color tokens (WCAG AA), and reusable widgets (`PortalButton`, `PortalField`, `PortalUploadTile`, `PortalAlert`) shared across MOB-PAT-02..06. Sets the accessibility baseline (text scale support, semantic labels for screen readers, reduced-motion).

## Objectives

- `lib/core/theme/portal_theme.dart` defining light + dark themes, typography, spacing, color tokens (matches web PAT-FE-02 hue identity).
- Shared widgets in `lib/shared/widgets/portal/`.
- TalkBack (Android) and VoiceOver (iOS) semantic labels on every interactive element.
- Respect platform "Reduce Motion" setting.
- Support OS dynamic-type / text-scaling up to 1.5×.
- Showcase widget gallery accessible at `/__design` in debug builds.

## Out of Scope

- Page-level layouts (MOB-PAT-02..06).

## Dependencies

- MOB-PAT-01.

## Acceptance Criteria

- [ ] Color contrast passes WCAG AA on both light and dark themes (verifiable via Flutter `accessibility_test`).
- [ ] Every shared widget exposes `semanticsLabel` props.
- [ ] Text scaling up to 1.5× does not clip critical UI in any showcase widget.
- [ ] Reduced-motion setting disables nonessential animations.
- [ ] Showcase route renders all primitives.

## Verification

- **Manual demo**: launch debug build, visit `/__design`, toggle iOS dynamic type to XXL.
- **Automated check**: `cd apps/mobile && flutter analyze && flutter test test/accessibility_test.dart`.
