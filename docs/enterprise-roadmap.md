---
published: false
title: Enterprise Roadmap
description: Longer-term product direction and enterprise-oriented capability planning for Universal Card.
section_label: Project Notes
permalink: /enterprise-roadmap/
---
# Universal Card Enterprise Roadmap

## Purpose

Universal Card is being evolved from a powerful Lovelace card into a platform-grade composition brick that can host layout, data-provider, widget, action, and extensibility concerns in a controlled way.

## Target Architecture

1. Core shell
   - lifecycle
   - layout host
   - render pipeline
   - performance budgets
   - visibility and expansion state
2. Data provider layer
   - Home Assistant entity provider
   - WebSocket event provider
   - REST provider
   - notification/event stream provider
   - derived/computed state provider
3. Composition primitives
   - slots
   - grid/tabs/carousel/subview regions
   - widget host
   - action bus
4. Safe extensibility
   - sanitized custom CSS
   - local plugin registry
   - versioned hook contracts
   - capability flags
5. Editor and contract layer
   - single schema source of truth
   - migrations
   - diagnostics
   - generated docs

## Current Blockers

1. Full `strict: true` is still intentionally deferred
   - The production graph now runs with `allowJs: false` and a stricter migration baseline, but `strictNullChecks`/`noImplicitAny` would still create too much low-signal churn in `advanced/*`, `widgets/*`, and some theme helpers.
2. Expanded coverage is still selective rather than exhaustive
   - There is now a second coverage gate for the interaction-heavy mode layer, but `Header/Footer/Badges/UniversalCard` still need a cleaner direct unit surface before they should be pulled into a hard percentage gate.

## Delivery Phases

### Phase 1: Contract Unification
- Retire editor-local schema as a separate truth source.
- Generate editor contract from core schema.
- Keep config migrations explicit and versioned.

### Phase 2: TypeScript Foundation
- Introduce `tsconfig.json` and `tsc --noEmit` gate.
- Convert low-dependency core files first.
- Keep incremental migration safe with mixed JS/TS support.

### Phase 3: Platform Extensibility
- Keep `custom_css` as the first supported extension surface.
- Keep plugin registration local-only and reject remote executable URLs.
- Wire safe plugin hooks into actual card lifecycle and UI action/render seams.

### Phase 4: Provider Layer
- Introduce a normalized provider interface.
- Migrate REST, notifications, and entity-derived widgets onto it.
- Add realtime subscriptions where the provider supports them.
- Add a derived/computed provider layer for repeated entity value/name/icon/count reads.
- Move UI/feature state consumers onto provider-derived helpers instead of local raw `hass` traversals.

### Phase 5: Quality Gates
- Keep curated Vitest coverage strict for foundational contract/runtime/provider modules.
- Add a second expanded coverage gate for high-risk interaction-heavy modules.
- Add browser-level E2E coverage for modal/fullscreen/subview/tabs/carousel and editor critical flows.
- Enforce config validation + typecheck + unit/regression + coverage + build + smoke + E2E in CI.

## Current Status

Completed in the current migration wave:
- overlay synchronization hardening
- lazy-load cancellation and stale cleanup
- nested visibility dependency fixes
- image widget lifecycle fixes
- `stability_mode`
- sanitized `custom_css` runtime surface
- shared runtime/editor config schema via `ConfigManager.getSchema()`
- shared schema adapter via `editor/SchemaContract`
- schema-driven editor field catalog via `editor/EditorContract`
- action and animation editor option sets now sourced from the shared contract
- visibility conditions now use shared contract metadata, including nested `and` / `or` / `not` groups
- `state_styles` now binds only to root `entity` + optional root `attribute`; `state_styles_entity` was removed
- swipe runtime/editor now share the same contract, including directional actions via `swipe.left/right/up/down`
- badges now use the shared contract end-to-end, including `type`, thresholds, progress, and badge-level `tap_action`
- versioned config migrations now exist with explicit `v1 -> v2` rules and `config_version` stamping
- shared contract coverage for expand trigger, animation, carousel, and pool/runtime policy fields
- TypeScript migration of `editor/ConfigValidator`
- `providers/ProviderContext` now normalizes entity/service/websocket/http/notification access for widgets
- `providers/DerivedProviderContext` now provides computed entity helpers for value, numeric value, friendly name, icon, picture, and entity counting
- REST, image, media, and notification widgets now consume the provider context instead of raw `hass`
- NotificationCenter now reloads from realtime provider subscriptions instead of remaining snapshot-only
- Alerts, QuickActions, EntityPreview, Timer, and IconMapping now consume the provider context instead of raw `hass`
- provider context now covers Home Assistant `callApi` in addition to entities, services, websocket, HTTP, and notifications
- Header, Badges, VisibilityConditions, and StateStyles now consume the derived provider layer instead of local raw state traversal
- HA action/state helpers now accept provider and derived-provider contexts as first-class runtime inputs
- DOM-heavy Vitest suites now run under a local manual DOM harness instead of Vitest's `jsdom` environment, which restored a stable `vitest run --coverage` path
- reduced `window.UniversalCard` to a platform capability surface
- versioned `window.UniversalCard.policy` + capability catalog now formalize namespace versions, declared public members, and development-stage compatibility rules
- `PluginSystem` public hooks now execute from card config/init/render/update/destroy paths plus `header/body/footer`, `actionExecute`, `click`, and `hold`, and are exposed through `window.UniversalCard.plugins`
- internal remote plugin loading has been removed from extensibility helpers; plugin registration is local-only
- shared action/plugin interception logic now lives in `core/action-hooks.ts` instead of being duplicated across `Header`, `Footer`, and `ha-helpers`
- clean `tsc --noEmit` gate for migrated TS modules
- deterministic regression runner for high-risk runtime issues
- stable `vitest run` and `vitest run --coverage` gate on the current TS/contract/runtime/provider test suite

## Exit Criteria For Enterprise Baseline

- one config schema source of truth
- explicit versioned config migrations
- stable typecheck gate
- stable coverage gate
- no remote executable plugin loading by default
- versioned public API and compatibility policy
- provider abstraction used by widgets
- derived provider abstraction used by UI/features
- documented migration policy for breaking changes
