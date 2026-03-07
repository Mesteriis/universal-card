# Universal Card - Development TODO

## Platform Track: Enterprise + TypeScript
- [x] Runtime stabilization baseline (overlay, lazy-load, visibility, image widget)
- [x] Safe mode (`stability_mode`)
- [x] Sanitized `custom_css` runtime surface
- [x] Single config contract for runtime + editor
- [x] Schema-driven editor primitives for shared contract fields
- [x] Contract-driven visibility/state_styles editor cleanup (root `entity` + `attribute`, recursive logical conditions)
- [x] Contract-driven swipe + badges cleanup (new `swipe.left/right/up/down`, rich badge contract in header runtime)
- [x] Versioned config migration pipeline (`v1 -> v2`, stamped `config_version`)
- [x] TypeScript baseline (`tsconfig`, `tsc --noEmit`, first core modules)
- [x] Provider layer abstraction
- [x] Derived/computed provider layer
- [x] Realtime notification/event providers
- [x] Foundational Vitest coverage baseline
- [x] Full Vitest coverage gate across DOM-heavy suites
- [x] Versioned public API / capability policy
- [x] Plugin lifecycle + UI/action hooks wired into runtime + public API (`plugins v2`)
- [x] Internal remote plugin loading removed from extensibility helpers
- [x] Shared TS action hook bridge extracted from Header/Footer/ha-helpers
- [x] Shared plugin action payload contract wired through `PluginSystem -> action-hooks -> Header/Footer/ha-helpers -> UniversalCard`
- [x] Typed bootstrap entrypoint (`src/index.ts`) with old source entry removed
- [x] Explicit class field contracts for `UniversalCard.ts` and `UniversalCardEditor.ts` (broad index signatures removed)
- [x] Broad `Record<string, any>` contracts reduced across `complex/*`, `themes/*`, and `extensibility/*`
- [x] `UniversalCard` runtime now uses shared provider `HomeAssistantLike`, typed `CardHelpers`, and typed devtools/editor proxy surfaces in `src/index.ts`
- [x] Shared runtime config contracts extracted to `core/config-contracts.ts`; `UniversalCard`, `Header`, and `Footer` no longer rely on broad top-level `Record<string, any>` config aliases
- [x] Nested runtime contracts tightened for `VisibilityCondition`, `StateStyleRule`, and `ContextMenuItemConfig`
- [x] Provider transport/entity contracts tightened in `ProviderContext.ts` and `DerivedProviderContext.ts` (typed HA state map, attributes, user, WS/API/service payloads, notification/event records)
- [x] Provider-adjacent consumers (`ui/Badges.ts`, `widgets/MediaPlayerMini.ts`, `widgets/ImageEntity.ts`) now consume typed badge/widget configs and typed entity/provider surfaces instead of local broad config aliases
- [x] Broad global DOM/editor augmentations removed from `UniversalCardEditor.ts`; editor now uses local DOM/custom-element types and neighboring runtime modules no longer rely on editor-owned globals for `style`/`dataset`/`detail`/`hass`
- [x] `UniversalCardEditor.ts` draft contracts for `actions`, `badges`, and `state_styles` now derive from shared `ActionConfig`/`HeaderBadgeConfig`/`StateStyleRule` surfaces instead of local broad `Record<string, unknown>` editor aliases
- [x] `UniversalCardEditor.ts` draft contracts for `visibility`, `section_visibility`, `swipe`, `tabs`, and `footer` now use explicit editor types built from shared `VisibilityCondition`/`SectionVisibilityConfig`/`SwipeConfig`/`TabConfig`/`FooterConfig` surfaces
- [x] `UniversalCardEditor.ts` immutable helper paths (`_setNestedValue`, visibility path readers/updaters/removers) no longer rely on broad `Record<string, unknown>` maps; they now use typed visibility-tree helpers and `Reflect`-based nested updates
- [x] Editor helper/bind suite added for `UniversalCardEditor.ts` (`visibility`, `actions`, `badges`, `tabs`) with shared manual DOM harness support for `HTMLInputElement`/`HTMLSelectElement`/`HTMLTextAreaElement`/`HTMLButtonElement`
- [x] Editor suite expanded to `icon picker`, `theme tokens`, `state_styles`, native/fallback `card picker`, and `sub-editor` textarea-save flow; manual DOM harness now supports `#id`, comma-separated selectors, presence-only attribute selectors, `closest()`, and stateful `customElements`

## Current Status
- Production source layer is TS-first and migrated end-to-end (`core`, `modes`, `ui`, `features`, `complex`, `themes`, `styles`, `advanced`, `widgets`, `editor`, `devtools`, `extensibility`, `src/lazy`).
- Publishable repository layout is normalized around `src/` for production source and `tests/` for verification, while the repository root remains directly HACS-installable with `content_in_root: true`.
- Shared contract is unified for runtime/editor/schema/migrations.
- Provider layer, derived provider layer, public API policy, and plugin lifecycle surface are implemented.
- `tsc --noEmit`, curated `vitest --coverage`, expanded mode-layer coverage, regression scripts, smoke scripts, Playwright E2E, and production build are green.
- Complex editor groups now have unit coverage for helper and bind flows, not only `typecheck`.
- CI now enforces config validation, unit/regression, curated coverage, expanded coverage, build, smoke checks, and browser E2E.
- HACS validation, hassfest staging validation, automated version bumping, release commit/tag creation, and GitHub release publishing are wired through `.github/workflows`.
- `allowJs` is removed from the production typecheck graph; remaining JS is an explicit tooling/test boundary only.

## Track Exit Criteria

- [x] Expand `vitest` coverage beyond the curated foundational surface with a second strict profile for high-risk interaction-heavy mode modules (`vitest.config.expanded.mjs`).
- [x] Add browser-level E2E coverage for modal/fullscreen/subview reopen/navigation flows, tabs/carousel persistence, and editor critical flows (`hui-card-picker`, inline YAML fallback editor, icon picker).
- [x] Add CI workflow in `.github/workflows/build.yml` that enforces config validation, regression/unit, typecheck, curated coverage, expanded coverage, build, smoke checks, and browser E2E.
- [x] Raise the TypeScript migration baseline beyond the original bootstrap (`alwaysStrict`, `noImplicitOverride`, `noImplicitReturns`, `noImplicitThis`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`, `useUnknownInCatchVariables`).
- [x] Decide and document the remaining JS boundary as tooling/test glue only (`build.js`, `scripts/*`, `tests/helpers/manual-dom.js`, browser E2E fixture glue).
- [x] Remove `allowJs` from the production typecheck graph.
- [x] Expand public docs/examples for `window.UniversalCard.plugins` (`plugins v2`), capability policy usage, config migration/versioning, and current development-stage breaking-change expectations.

## Future Watchlist

- Revisit `strict: true` / `strictNullChecks` / `noImplicitAny` only after the remaining broad dynamic configs in `advanced/*`, `widgets/*`, and theme helpers are narrowed enough that the signal-to-noise ratio stays acceptable.
- Expand the second coverage profile further into `core/UniversalCard.ts`, `ui/Header.ts`, `ui/Footer.ts`, and `ui/Badges.ts` once there is direct unit surface for those modules without inflating the foundational gate with low-signal percentages.

## Operating Principles
1. Keep a single config/schema source of truth.
2. Do not reintroduce editor-local contract drift.
3. Keep build, tests, smoke, and typecheck green on every step.
4. Prefer explicit breaking changes plus migrations over compatibility shims while the project is still pre-stable.
