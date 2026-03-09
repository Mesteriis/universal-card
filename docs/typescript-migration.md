---
title: TypeScript Migration
description: Project migration notes for the TypeScript transition and related implementation strategy.
section_label: Project Notes
permalink: /typescript-migration/
---
# TypeScript Migration Strategy

## Why This Migration Is Incremental

Universal Card already has a large runtime surface, many UI modules, and a live editor. A big-bang rewrite would create too much breakage and destroy reviewability. The migration therefore starts with the lowest-dependency core modules and keeps the application buildable at every step.

## External Guidance Used

This migration strategy follows current official guidance gathered through Context7 from:
- TypeScript v5.9.x
- esbuild
- Vitest v4

Key takeaways applied here:
- TypeScript incremental adoption works best with `allowJs` while JS and TS coexist, but that should be removed once the production source layer is TS-first.
- `esbuild` transpiles and bundles TS, but does not replace `tsc` for type-checking.
- `tsc --noEmit` should be the contract gate during migration.
- Vitest environments and coverage should be explicitly configured, especially for DOM-like tests.

## Chosen Baseline

### tsconfig principles
- `allowJs: false`
- `checkJs: false` initially
- `noEmit: true`
- `module: esnext`
- `moduleResolution: bundler`
- `isolatedModules: true`
- `skipLibCheck: true`
- keep `strict: false` for now, but ratchet the migration baseline upward with:
  - `alwaysStrict`
  - `noImplicitOverride`
  - `noImplicitReturns`
  - `noImplicitThis`
  - `noFallthroughCasesInSwitch`
  - `noUncheckedIndexedAccess`
  - `useUnknownInCatchVariables`

### Build principles
- keep esbuild as the bundler
- keep `.js` import specifiers stable during migration
- convert files in-place to `.ts` where safe
- use `tsc --noEmit` as a separate validation step
- keep the remaining JS boundary explicit and tooling-only:
  - `build.js`
  - `scripts/*`
  - `tests/helpers/manual-dom.js`
  - browser fixture glue in `tests/e2e/*`

## Migration Order

### Wave 1
- `core/constants`
- `core/config`
- `core/runtime`
- `extensibility/CustomCSS`
- `extensibility/PluginSystem`

### Wave 2
- shared helpers and small feature modules
- schema generation and editor integration

### Wave 3
- modes and UI components
- widgets and advanced modules

### Wave 4
- editor internals
- full provider layer typing
- public API hardening

## Rules During Migration

1. Do not create a second type model.
   - Types must come from the same contract the runtime uses.
2. Do not widen the public API during migration.
3. Keep `.js` import specifiers unless there is a hard technical reason to change them.
4. Every migrated file must continue to participate in build, test, and typecheck.
5. Prefer foundational modules before UI-heavy modules.

## Current Exit Criteria

- production runtime/editor/provider/ui source is TS-first
- `allowJs` is disabled for the production typecheck graph
- the migration baseline is stricter than the original TS bootstrap, without pretending that `strict: true` is already cheap
- curated coverage gate stays strict for foundational contract/runtime/provider modules
- expanded coverage gate now also tracks the interaction-heavy mode layer
- browser-level E2E covers modal/fullscreen/subview/tabs/carousel and editor critical flows
- CI enforces config/unit/typecheck/coverage/build/smoke/E2E end-to-end

## Completed In This Wave

- `ConfigManager.getSchema()` is now the single source of truth for runtime and editor config schema
- `editor/SchemaContract` now centralizes runtime-to-editor schema adaptation for validation and UI
- `editor/EditorContract` now provides schema-driven field descriptors for primitive editor sections
- editor action/animation option catalogs now consume shared schema metadata instead of local arrays
- visibility builders now consume shared condition metadata, including recursive logical groups
- `state_styles_entity` was removed; `state_styles` now binds to root `entity` and root `attribute`
- swipe editor/runtime contract now uses `swipe.left/right/up/down` without legacy aliases
- badges now use a shared typed contract for `type`, thresholds, progress, and badge actions
- `core/config-migrations` now provides explicit `v1 -> v2` migration rules and stamps `config_version`
- `editor/ConfigValidator` was migrated to TypeScript and derives completions/docs from the shared schema
- `providers/ProviderContext` now gives widgets a typed provider seam for entities, services, websocket events, HTTP, and notifications
- `providers/DerivedProviderContext` now adds typed computed entity helpers on top of the base provider seam
- provider context now also covers Home Assistant `callApi`
- widget and advanced runtime moved off direct `hass`/`fetch` access onto the provider context bridge
- `VisibilityConditions`, `StateStyles`, `Header`, and `Badges` now resolve state/name/icon/count reads through the derived provider layer instead of local raw `hass` traversal
- DOM-heavy Vitest suites (`BaseMode`, runtime services, `TabsMode`) now run under a shared manual DOM harness in node env instead of the Vitest `jsdom` runner path
- `src/public-api-policy.ts` now defines the versioned `window.UniversalCard.policy` contract and the public capability/member inventory for the external platform API
- `src/index.ts` now owns the typed public bootstrap/registration entry instead of a legacy JS entrypoint
- `core/UniversalCard.ts` now owns the main card runtime instead of a legacy JS source file
- `core/UniversalCardEditor.ts` now owns the visual editor runtime instead of a legacy JS source file
- `UniversalCard.ts` and `UniversalCardEditor.ts` no longer rely on broad `[key: string]: any` index signatures; both classes now declare explicit runtime/editor field contracts
- `ui/Header.ts`, `ui/Footer.ts`, and `ui/Badges.ts` now own the primary UI runtime instead of legacy JS source files
- `ui/index.ts`, `ui/ContextMenu.ts`, and `ui/RadialMenu.ts` now own the remaining UI menu/export surface instead of legacy JS source files
- `features/index.ts`, `features/VisibilityConditions.ts`, `features/StateStyles.ts`, `features/SwipeGestures.ts`, and `features/ResponsiveBreakpoints.ts` now own the feature layer instead of legacy JS source files
- `utils/index.ts`, `utils/helpers.ts`, `utils/performance.ts`, `utils/overlay.ts`, and `utils/ha-helpers.ts` now own the shared utility layer instead of legacy JS source files
- `advanced/index.ts`, `advanced/EntityPreview.ts`, `advanced/Alerts.ts`, `advanced/QuickActions.ts`, `advanced/Timer.ts`, `advanced/IconMapping.ts`, `advanced/AnimationPresets.ts`, and `advanced/WebSocketOptimizer.ts` now own the advanced runtime layer instead of legacy JS source files
- `widgets/index.ts`, `widgets/RestApiWidget.ts`, `widgets/ImageEntity.ts`, `widgets/MediaPlayerMini.ts`, and `widgets/NotificationCenter.ts` now own the widget runtime layer instead of legacy JS source files
- `editor/index.ts`, `editor/DragDrop.ts`, `editor/ResizableCards.ts`, `editor/LockMode.ts`, `editor/EditorComponents.ts`, and `editor/MultiLanguage.ts` now own the visual editor helper/runtime layer instead of legacy JS source files
- `devtools/index.ts`, `devtools/EventLogger.ts`, `devtools/StateInspector.ts`, and `devtools/PerformanceProfiler.ts` now own the devtools layer instead of legacy JS source files
- `src/lazy/advanced-bundle.ts`, `src/lazy/editor-bundle.ts`, `src/lazy/card-editor-bundle.ts`, and `src/lazy/devtools-bundle.ts` now own the lazy bundle entry layer, and `build.js` resolves lazy entrypoints from `.(ts|js)` sources
- `complex/index.ts`, `complex/AutoGrouping.ts`, `complex/CardLinking.ts`, and `complex/CompactMode.ts` now own the complex feature layer instead of legacy JS source files
- `themes/index.ts`, `themes/Glassmorphism.ts`, `themes/Neumorphism.ts`, `themes/BackgroundPatterns.ts`, `themes/BorderAnimations.ts`, `themes/HoverEffects.ts`, `themes/ColorSchemes.ts`, `themes/LoadingVariants.ts`, and `themes/MicroInteractions.ts` now own the theme/effect layer instead of legacy JS source files
- `styles/index.ts`, `styles/header-footer.ts`, `styles/themes.ts`, `core/index.ts`, and `extensibility/index.ts` now own the remaining production glue/style barrels instead of legacy JS source files
- `PluginSystem` public hooks are now wired into `UniversalCard` config/init/render/update/destroy paths plus `header/body/footer`, `actionExecute`, `click`, and `hold`, and exposed via `window.UniversalCard.plugins`
- internal extensibility helpers now reject remote plugin URLs and only accept locally registered plugin objects
- `complex/*`, `themes/*`, and `extensibility/*` no longer rely on broad `Record<string, any>`/`any` contracts for configs, presets, and plugin metadata; dynamic payloads remain only at explicit plugin hook boundaries
- `core/action-hooks.ts` now owns shared plugin-aware action bridge logic used by `Header`, `Footer`, and `ha-helpers`
- the plugin/runtime seam now shares explicit `PluginPayload`/`PluginContext` and `ActionConfig` contracts across `PluginSystem`, `core/action-hooks.ts`, `Header.ts`, `Footer.ts`, `ha-helpers.ts`, and `UniversalCard.ts`
- `core/config-contracts.ts` now owns the shared runtime config surface for `UniversalCard`, `Header`, and `Footer`, replacing the remaining broad top-level `Record<string, any>` config aliases in those runtime/UI entrypoints
- `core/config-contracts.ts` now also defines discriminated `VisibilityCondition` unions, explicit `ContextMenuItemConfig` action/separator items, and typed `StateStyleRule` values; `VisibilityConditions.ts`, `StateStyles.ts`, and `ContextMenu.ts` consume those contracts directly
- `providers/ProviderContext.ts` now owns typed Home Assistant transport/entity contracts for state maps, attributes, user info, service/API/WS payloads, and persistent notification event records instead of broad provider payload aliases
- `providers/DerivedProviderContext.ts` now consumes typed `HomeAssistantEntityState`/attribute values directly, so derived entity reads and predicates no longer rely on broad `Record<string, any>` state inputs
- `ui/Badges.ts` now consumes shared `HeaderBadgeConfig` and typed `HomeAssistantLike`/derived provider surfaces instead of local `Record<string, any>` badge/provider aliases
- `widgets/MediaPlayerMini.ts` and `widgets/ImageEntity.ts` now use explicit widget config interfaces plus typed entity/provider contracts, reducing broad provider-adjacent consumer drift in the widget layer
- `core/UniversalCardEditor.ts` no longer mutates global `Element/EventTarget/Event` typings; it now uses local editor-specific DOM/custom-element contracts (`ha-icon-picker`, `ha-code-editor`, `hui-card-picker`, focus/input helpers) instead of project-wide broad augmentations
- `core/UniversalCardEditor.ts` draft config typing for `tap/hold/double_tap` actions, header badges, badge thresholds, and `state_styles` now reuses shared `ActionConfig`, `HeaderBadgeConfig`, `BadgeThreshold`, and `StateStyleRule` contracts instead of local broad `Record<string, unknown>` editor aliases
- `core/UniversalCardEditor.ts` draft config typing for `visibility` / `section_visibility`, `swipe`, `tabs`, and `footer` now uses explicit editor-side types derived from shared `VisibilityCondition`, `SectionVisibilityConfig`, `SwipeConfig`, `TabConfig`, and `FooterConfig` contracts, with typed guards for visibility scopes and tab field updates
- `core/UniversalCardEditor.ts` internal immutable helper paths no longer depend on broad object maps: visibility tree traversal/update/removal now works against explicit `EditorVisibilityCondition[] | EditorVisibilityCondition` nodes, and generic nested editor updates use `Reflect`-based cloning instead of `Record<string, unknown>` writes
- `tests/universal-card-editor.test.js` now covers editor helper paths and bind flows for `visibility`, `actions`, `badges`, and `tabs`, and `tests/helpers/manual-dom.js` now exposes `HTMLInputElement` / `HTMLSelectElement` / `HTMLTextAreaElement` / `HTMLButtonElement` globals so editor runtime checks work under the node-based DOM harness
- `tests/universal-card-editor.test.js` now also covers `icon picker`, `theme tokens`, `state_styles`, native HA `hui-card-picker`, and textarea fallback `sub-editor` save flow; `tests/helpers/manual-dom.js` now supports `#id`, comma-separated selectors, presence-only attribute selectors, `closest()`, and a stateful `customElements` registry so these editor runtime paths are testable under the node harness
- neighboring runtime modules that had been implicitly relying on the editor-owned globals now use local typed casts/contracts for `style`, `dataset`, `detail`, and `hass` access (`advanced/*`, `complex/CardLinking.ts`, `devtools/StateInspector.ts`, `ui/*`, `widgets/*`, `utils/ha-helpers.ts`)
- the remaining mode layer now lives in TypeScript: `modes/index.ts`, `modes/BaseMode.ts`, `modes/ExpandMode.ts`, `modes/ModalMode.ts`, `modes/FullscreenMode.ts`, `modes/SubviewMode.ts`, `modes/TabsMode.ts`, and `modes/CarouselMode.ts`
- `tsconfig.json` now disables `allowJs` for the production typecheck graph and raises the migration baseline with `alwaysStrict`, `noImplicitOverride`, `noImplicitReturns`, `noImplicitThis`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`, and `useUnknownInCatchVariables`
- `tests/e2e/*` now provides Playwright browser coverage for modal/fullscreen/subview reopen/navigation flows, tabs/carousel persistence flows, and editor critical flows (`ha-icon-picker`, native `hui-card-picker`, YAML fallback editor)
- `.github/workflows/build.yml` now enforces config validation, unit/regression, curated coverage, expanded coverage, build, smoke checks, and Playwright E2E in CI
- `vitest.config.expanded.mjs` now extends the strict curated coverage gate with interaction-heavy mode modules without diluting the foundational gate
- the intentional JS boundary is now documented as tooling-only (`build.js`, `scripts/*`, `tests/helpers/manual-dom.js`, browser E2E fixture glue)
- `tsc --noEmit` passes for the current TS migration surface
- `vitest run` and `vitest run --coverage` are stable again across the current suite
