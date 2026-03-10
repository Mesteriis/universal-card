---
published: false
---
# Audit: Body Modes And Header Layout

## Scope

This audit extends the earlier modal/badge work and focuses on two gaps in the current architecture:

- body modes other than `modal` still expose layout/runtime behavior inconsistently
- header layout is effectively hard-coded to one visual arrangement

## Current Body Mode State

### Expand mode

Runtime file:

- `src/modes/ExpandMode.ts`

Current behavior:

- uses shared `grid` config directly
- no dedicated `expand` config block exists in the normalized runtime contract
- layout behavior is mostly inherited from the card shell and animation settings

Observations:

- grid application logic is still partially duplicated compared with `BaseMode._applyGridConfig`
- no explicit per-mode sizing or spacing surface exists
- editor support is indirect through generic `grid.*` and animation fields only

### Modal mode

Runtime file:

- `src/modes/ModalMode.ts`

Current behavior:

- already has a dedicated normalized `modal` config block
- supports width/height/max-width/max-height and loading strategy
- has dedicated docs and editor support

Observations:

- this is currently the cleanest body-mode contract in the project
- it is a good reference for how other mode-specific settings should be normalized and documented

### Fullscreen mode

Runtime file:

- `src/modes/FullscreenMode.ts`

Current behavior:

- consumes `config.fullscreen` locally at runtime
- supports only a partial local contract: `background`, `show_close`, `close_on_escape`, `max_width`
- these settings are not part of the normalized shared config contract or editor schema

Observations:

- fullscreen already behaves as if it had a first-class config block, but it bypasses `ConfigManager`
- grid support is shallow: only columns and gap are applied locally
- width, height, content padding, and related sizing behavior are not configurable via shared schema

### Tabs mode

Runtime file:

- `src/modes/TabsMode.ts`

Current behavior:

- uses `tabs` and `tabs_config`
- `tabs_config` currently supports only `position`, `show_icons`, `show_labels`
- each tab can optionally define `grid`

Observations:

- `tabs_config` exists in the runtime contract but is under-modeled and under-documented
- tab content padding, tab min width, and other layout options are hard-coded in CSS
- editor support for `tabs_config` is minimal to nonexistent

### Carousel mode

Runtime file:

- `src/modes/CarouselMode.ts`

Current behavior:

- uses root `carousel_autoplay` and `carousel_interval`
- arrows, indicators, looping, and swipe threshold are hard-coded inside the class
- there is no normalized nested carousel settings block

Observations:

- carousel is behaviorally configurable in code, but most useful UI controls are not exposed through config
- layout details such as viewport height, slide gap, arrows, and indicators are fixed runtime defaults
- the old legacy nested `carousel` object was removed, so any new nested config must avoid breaking that migration story

### Subview mode

Runtime file:

- `src/modes/SubviewMode.ts`

Current behavior:

- consumes `config.subview` locally with `path`, `navigation_path`, `replace_state`, `return_on_close`
- these fields are not part of the shared schema or editor support

Observations:

- subview already has a natural nested config block, but it is not normalized or documented through the main contract
- this mode is behavior-oriented rather than layout-oriented
- editor support is currently missing despite a clean enough runtime surface

## Shared Mode Architecture Findings

Primary files:

- `src/modes/BaseMode.ts`
- `src/modes/index.ts`
- `src/core/config.ts`
- `src/core/config-contracts.ts`

Observations:

- `modal` is normalized through `ConfigManager`, but `fullscreen` and `subview` still read local ad-hoc objects
- grid support is partly centralized in `BaseMode._applyGridConfig`, but not all modes consistently rely on it
- `tabs` and `carousel` mix root fields and mode-local defaults, which makes editor/schema support uneven

Conclusion:

- the next stable step is not arbitrary per-mode flags, but explicit config blocks per mode where useful, all normalized in `ConfigManager`

## Current Header State

Primary files:

- `src/ui/Header.ts`
- `src/styles/header-footer.ts`
- `src/core/UniversalCard.ts`

Current rendering model:

- fixed outer structure: `header-left`, `header-content`, `header-right`
- left zone renders icon and left slot
- content zone renders title, subtitle, and content slot cards
- right zone renders badges, right slot, and expand icon

Observations:

- header layout is effectively hard-coded to one preset
- styling assumes a row layout with left/content/right distribution
- there is no first-class `header.layout` contract
- editor support covers common header flags, but not structural arrangement

Implications:

- users can populate slots and badges, but cannot meaningfully choose how the header is arranged
- the current layout is good as a default, but not flexible enough for denser or more centered headers

## Editor State

Primary files:

- `src/core/UniversalCardEditor.ts`
- `src/editor/EditorContract.ts`

Observations:

- schema-backed simple fields are easy to expose when they exist in `ConfigManager.getSchema()`
- array/repeated structures require hand-authored editor sections, as already done for badge rules
- this makes mode-specific nested scalar fields relatively cheap to expose, while complex arbitrary layout builders would be expensive

Conclusion:

- preset-based layout controls are a better fit than a fully free-form drag layout editor in this stage

## Refactor Opportunities

1. Move more mode config into shared normalized contracts.
2. Reuse `BaseMode._applyGridConfig` consistently across `fullscreen` and any other grid-aware mode.
3. Introduce preset-based header layout config instead of fixed DOM assumptions.
4. Expose safe scalar mode settings in the editor and document YAML-only areas explicitly.

## Recommended Direction

### Body modes

- formalize `fullscreen` and `subview` as documented config blocks
- expand `tabs_config` with layout-related fields that are currently hard-coded in CSS
- add a dedicated additive config block for carousel behavior/layout instead of relying only on root autoplay fields
- keep backward compatibility for root `carousel_autoplay` and `carousel_interval`

### Header

- add a `header.layout` block with a small number of layout presets and spacing/alignment controls
- keep the current arrangement as the default preset
- avoid a free-form reorder engine in this stage; presets are cheaper to test, document, and expose in the editor
