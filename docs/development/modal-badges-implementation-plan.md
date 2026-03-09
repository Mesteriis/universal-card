# Modal and Badges Implementation Plan

## Goals

This workstream improves modal rendering, badge behavior, overlay loading strategy, and editor coverage without breaking the existing `universal_card` configuration model unnecessarily.

Primary goals:

- stabilize modal grid and stack rendering
- reduce modal spacing issues and support predictable sizing
- add per-badge visibility rules with comparison operators
- add dynamic badge color rules without introducing a heavy expression engine
- add explicit modal content loading strategy (`lazy` vs `preload`)
- expose as many new options as practical through the visual editor
- document all behavior and compatibility expectations in Markdown

## Planned stages

### Stage 1. Audit and planning

Deliverables:

- technical audit of current modal, badges, loading, and editor architecture
- implementation plan with compatibility notes and risks

Commit target:

- `docs: add audit and implementation plan for modal badges work`

### Stage 2. Modal layout improvements

Scope:

- fix modal grid rendering so configured columns are respected
- improve spacing inside modal content
- support safer modal sizing controls for width and height
- preserve an auto-sizing path as a first-class option
- keep mobile behavior predictable

Expected docs updates:

- `docs/features/modal-layout.md`
- upgrade notes if config behavior changes materially

Commit target:

- `fix: stabilize grid layout inside modal body`
- `feat: add configurable modal width and height`

### Stage 3. Badge system improvements

Scope:

- add per-badge visibility support
- support comparison operators: `==`, `!=`, `>`, `<`, `>=`, `<=`
- add extensible rule format for future operators such as `in`, `not_in`, `contains`, `matches`
- add dynamic badge color rules
- add icon-only badge mode
- add badge actions where the runtime contract stays clean

Expected docs updates:

- `docs/features/badges.md`
- `docs/development/upgrade-notes.md` if new config fields are introduced

Commit target:

- `refactor: extract badge condition evaluation logic`
- `feat: add badge visibility rules with comparison operators`
- `feat: add badge color rules and icon-only mode`

### Stage 4. Loading strategy

Scope:

- study current modal load path versus expand-body lazy loading
- add explicit modal loading strategy
- support at least `lazy` and `preload`
- keep defaults conservative for performance

Expected docs updates:

- `docs/features/loading-strategy.md`

Commit target:

- `feat: add loading strategy with lazy and preload modes`

### Stage 5. Editor integration

Scope:

- surface supported modal sizing options in editor
- surface badge visibility and badge color rule configuration where clean enough
- surface badge icon-only mode
- surface main card icon color if it can be added consistently
- document any remaining YAML-only fields

Expected docs updates:

- editor support notes, either as additions to feature docs or a dedicated development note

Commit target:

- `feat: expose modal and badge options in editor`
- `docs: document editor coverage for modal and badge settings`

### Stage 6. Final polish

Scope:

- run tests, type checks, lint, and build
- refresh examples and docs
- produce final work summary for PR preparation

Expected docs updates:

- `docs/development/work-summary-modal-badges.md`
- final adjustments to feature docs

Commit target:

- `docs: expand feature documentation for modal badges and loading`
- `chore: finalize modal badges implementation summary`

## Planned configuration API changes

Expected additions, subject to implementation details:

### Modal configuration

Likely additions under `modal`:

- `width`: keep existing field, but document explicit manual sizing behavior
- `height`: new explicit height setting
- `max_width`: keep existing field
- `max_height`: likely new explicit cap for height
- `size_mode` or equivalent auto/manual control if needed for a predictable runtime contract
- `content_padding`, `gap`, or layout-specific spacing fields only if existing `grid` fields are insufficient
- `loading_strategy`: `lazy` or `preload`

Notes:

- existing `modal.width` and `modal.max_width` already exist, so extensions should build on them rather than replace them
- CSS-length acceptance should be limited to safe string values that map well to the browser and editor UX

### Badge configuration

Likely additions per badge:

- `visibility`: array of badge-scoped rule objects
- `color_rules`: ordered rule list, or equivalent mapping-based rule structure
- `hide_label` or `icon_only`
- `icon_tap_action` if the DOM structure can support it cleanly

Planned rule model direction:

- rule-based evaluation instead of free-form template evaluation
- explicit comparator field such as `operator`
- values stored in a typed structure rather than encoded into a string expression

## Risks

1. Modal CSS regressions

- Modal layout currently mixes inline grid style and static flex style.
- Fixing that can affect existing modal configs that accidentally relied on the broken flex fallback.

2. Badge runtime drift

- Because `Header.ts` is the active badge runtime and `Badges.ts` is a separate implementation, adding features in the wrong place would create inconsistent behavior.

3. Editor complexity

- Nested per-badge rules can significantly increase editor UI complexity.
- Some advanced YAML-first fields may need a staged editor rollout.

4. Performance regressions

- `preload` can hurt heavy cards, camera cards, or cards with expensive initialization.
- Any preload implementation should remain opt-in unless measurements show otherwise.

5. Compatibility with existing configs

- Existing configs already use `badges[].color`, `thresholds`, `tap_action`, and `modal.width` / `modal.max_width`.
- New rule precedence must be documented clearly so old configs continue to behave predictably.

## Backward compatibility strategy

Current strategy:

- preserve existing modal config keys
- preserve existing badge keys and semantics
- treat new fields as additive wherever possible
- avoid changing the default meaning of `lazy_load`, which currently refers to inline body card loading
- keep the default modal content behavior conservative and documented if a new loading strategy is added

Potential compatibility-sensitive areas to document explicitly:

- precedence between `badges[].color`, badge color rules, automatic state colors, and numeric thresholds
- interaction between `label`, `show_name`, and icon-only mode
- interaction between modal auto sizing and manual width/height settings
- whether modal preload is enabled by default or must be opted in

## Decision notes before implementation

1. Modal loading strategy should be modal-specific, not a hidden reinterpretation of global `lazy_load`.
2. Badge visibility and color logic should share a small rule evaluator.
3. A full template engine is not justified by the current codebase or risk profile.
4. Editor support should follow the normalized runtime contract, not invent an editor-only schema.
