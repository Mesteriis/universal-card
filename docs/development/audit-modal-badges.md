# Audit: modal, badges, loading, and editor architecture

## Scope

This audit covers the current implementation state for modal rendering, body modes, grid/stack layout behavior, badges, visibility logic, loading strategy, and editor support in `universal_card`.

## Where modal mode is implemented

Primary files:

- `src/modes/ModalMode.ts`
- `src/modes/BaseMode.ts`
- `src/core/UniversalCard.ts`
- `tests/window-modes.test.js`
- `tests/e2e/modes.spec.ts`

Current behavior:

- `UniversalCard` treats `modal` as a portal/overlay body mode and does not render body content inline inside `.body`.
- `ModalMode` builds its own overlay, dialog, header, and content container.
- `ModalMode.open()` appends the overlay to `document.body`, loads nested cards via `BaseMode.loadCards()`, and then injects cards into `.uc-modal-grid`.
- Existing modal options are limited to `width`, `max_width`, backdrop controls, and close behavior.

Current architectural issue:

- `ModalMode` tries to apply CSS grid inline when `config.grid` is present, but `ModalMode.getStyles()` later forces `.uc-modal-grid` to `display: flex` with `flex-direction: column`.
- This means multi-column modal layouts are currently overridden by the static stylesheet and can collapse into a vertical list.

## Where body mode / modal mode is implemented

Primary files:

- `src/core/UniversalCard.ts`
- `src/modes/index.ts`
- `src/modes/BaseMode.ts`
- `src/modes/ExpandMode.ts`
- `src/modes/ModalMode.ts`
- `src/modes/FullscreenMode.ts`
- `src/modes/TabsMode.ts`
- `src/modes/CarouselMode.ts`
- `src/modes/SubviewMode.ts`

Current behavior:

- `body_mode` is validated in `src/core/config.ts` and typed in `src/core/config-contracts.ts`.
- `createMode()` in `src/modes/index.ts` maps runtime mode names to dedicated mode classes.
- `UniversalCard._renderBodyElement()` renders inline body content for `expand`, `tabs`, and `carousel`.
- `modal`, `fullscreen`, and `subview` are handled outside the regular card body and use standalone mode instances.

Implication for upcoming work:

- Modal layout and loading changes should stay localized in `ModalMode` and shared mode utilities where possible.
- The existing expand-mode lazy loading pipeline in `UniversalCard` should not be blindly copied into overlay modes without a clear strategy boundary.

## How grid / stack rendering works now

Inline body rendering:

- `UniversalCard._renderBodyElement()` creates `.body-content` for standard expand mode.
- `UniversalCard._getGridStyles()` generates CSS grid styles from `config.grid`.
- `UniversalCard._appendBodyCardsBatch()` wraps nested cards in `.card-wrapper` and applies `colspan` / `rowspan`.

Overlay rendering:

- `ModalMode` and `FullscreenMode` create dedicated grid containers and append cards through `BaseMode._appendCards()`.
- `BaseMode._appendCards()` already respects `colspan` / `rowspan` by styling `.card-wrapper`.

Current gaps:

- Inline body layout has a richer, more integrated grid pipeline than modal mode.
- Modal mode only partially applies `grid.columns` and `grid.gap`; row gap, column gap, auto flow, alignment, and mobile behavior are not surfaced.
- There is no modal-specific layout abstraction for `vertical-stack` semantics beyond "render nested Lovelace cards inside wrappers".
- Because the modal stylesheet forces flex layout, configured 2-column layouts are unreliable.

## How badges are currently implemented

Primary files:

- `src/ui/Header.ts`
- `src/ui/Badges.ts`
- `src/core/config-contracts.ts`
- `src/core/config.ts`
- `src/editor/EditorContract.ts`
- `src/core/UniversalCardEditor.ts`

Important observation:

- There are two badge implementations in the repository.
- Runtime header rendering uses `Header._renderBadges()` and `Header._updateBadges()` in `src/ui/Header.ts`.
- `src/ui/Badges.ts` exists as a separate badge component, but the active card runtime path currently renders badges directly inside `Header`.

Current badge features in the active runtime path:

- Badge types: `state`, `attribute`, `counter`, `custom`
- Static color via `badges[].color`
- Automatic state-based color fallback through `_getBadgeAutoColor()`
- Numeric threshold colors through `badges[].thresholds`
- Optional label, unit, precision, and format
- Optional progress bar with `min` / `max`
- `tap_action` support on the whole badge

Current gaps:

- No per-badge visibility rules
- No comparison operators for string or numeric visibility beyond the separate top-level visibility system
- No dedicated badge color rules beyond direct color and numeric thresholds
- No icon-only badge mode
- No dedicated `icon_tap_action`
- The duplicate badge implementation increases maintenance risk and makes shared extensions less obvious

## Existing visibility / conditions / color rules

Global and section visibility:

- Implemented in `src/features/VisibilityConditions.ts`
- Wired in `src/core/UniversalCard.ts`
- Typed in `src/core/config-contracts.ts`
- Validated and normalized in `src/core/config.ts`

Supported visibility condition families:

- `state`
- `numeric_state`
- `user`
- `time`
- `screen`
- logical `and` / `or` / `not`

Current limits relevant to badges:

- Visibility conditions are available for the whole card and for `header` / `body` / `footer` sections, not for individual badges.
- The current condition engine does not expose a generic comparator model such as `==`, `!=`, `>`, `<`, `>=`, `<=` for arbitrary badge values.
- Color rules exist only in narrow forms:
  - automatic entity state colors
  - numeric threshold mapping for badges
  - state style rules for the main card shell

## Templating or expression engine

Findings:

- There is no general-purpose templating engine for badges or modal config.
- There is no expression evaluator currently wired into badge rendering.
- `CustomCSS` reserves an `expression` style input type, but this is not a general runtime badge expression system.
- `advanced/Alerts.ts` contains string interpolation for alert messages, but it is unrelated to badge or modal configuration.

Conclusion:

- The project currently leans toward explicit rule-based configuration, not free-form template evaluation.
- For badge visibility and dynamic badge colors, a small comparator/rule system fits the current architecture better than adding a full expression engine.

## Lazy loading / preload logic today

Primary files:

- `src/core/UniversalCard.ts`
- `src/modes/BaseMode.ts`
- `src/utils/performance.ts`
- `README.md`
- `src/editor/EditorContract.ts`

Current behavior:

- Inline expand-mode body cards support `lazy_load`, `lazy_initial_batch`, `lazy_batch_size`, and `lazy_idle_timeout`.
- `UniversalCard` uses `IntersectionObserver` plus idle batching to progressively create nested cards.
- Body card pooling is available through `cardPool` in `src/core/runtime.ts`.
- Overlay modes do not reuse the expand-mode incremental lazy pipeline.
- `ModalMode.open()` currently loads all nested modal cards on first open by calling `BaseMode.loadCards()` if `_loaded` is false.

Current gaps:

- There is no explicit modal content loading strategy setting.
- There is no `preload` mode for modal content.
- There is no documented separation between expand-body lazy loading and modal-content readiness.
- Heavy modal content such as cameras or complex cards would currently all initialize on first open without a strategy knob.

## What settings are currently available through UI/editor

Primary files:

- `src/core/UniversalCardEditor.ts`
- `src/editor/EditorContract.ts`
- `tests/universal-card-editor.test.js`

Currently exposed in editor:

- Core card fields such as title, subtitle, icon, entity, body mode
- Global visibility and section visibility
- `lazy_load`, `lazy_initial_batch`, `lazy_batch_size`, `lazy_idle_timeout`
- Existing badge fields:
  - type
  - entity
  - attribute
  - icon
  - color
  - value
  - label
  - unit
  - min
  - max
  - show_name
  - show_progress
  - precision
  - format
  - entities
  - domain
  - state
  - count_state
  - thresholds

Not currently exposed in editor:

- Modal sizing controls (`modal.width`, `modal.max_width`, height-related options)
- Badge visibility rules
- Badge color rules beyond static color/thresholds
- Badge icon-only mode
- Badge `icon_tap_action`
- Card main icon color as a dedicated editor field
- Any modal-specific loading strategy setting

## Parts that look unfinished or need refactoring

1. Modal layout CSS contract is internally inconsistent.

- ModalMode mixes inline grid styles with a static stylesheet that reverts the layout to flex.
- This is the most obvious source of grid regressions inside modal content.

2. Overlay loading strategy is under-specified.

- Expand body has a detailed lazy pipeline.
- Modal mode still uses a simpler "load everything on open" path.
- There is no shared abstraction for overlay load policy.

3. Badge logic is duplicated.

- `Header.ts` owns the active runtime path.
- `Badges.ts` mirrors similar behavior but is not the main integration point.
- Shared badge evaluation utilities would reduce drift and make new conditions/color rules safer.

4. Badge rules are not yet composable.

- Static color, state fallback color, and thresholds exist, but there is no unified rule evaluator.
- Adding per-badge visibility and dynamic color cleanly will likely require extracted rule helpers.

5. Editor coverage lags behind YAML capabilities and planned runtime changes.

- The editor supports existing badge basics and visibility conditions well enough.
- It does not yet surface modal sizing or more advanced badge behavior.
- Any new runtime config should be designed with editor descriptors in mind from the start.

## Summary of recommended direction

Recommended implementation direction based on the current architecture:

1. Fix modal layout in `ModalMode` first by aligning DOM structure and stylesheet behavior with the existing grid contract.
2. Extend modal config with explicit sizing and loading strategy instead of overloading the existing `lazy_load` meaning.
3. Extract badge rule evaluation into shared helpers and keep runtime integration in `Header.ts`.
4. Reuse a rule-based comparator model for badge visibility and dynamic colors instead of introducing a full template engine.
5. Expand editor descriptors only after the runtime contract and normalization layer are stable.
