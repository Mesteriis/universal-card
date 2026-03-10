---
published: false
---
# Implementation Plan: Body Modes And Header Layout

## Goals

1. Bring non-modal body modes closer to the same contract quality as `modal`.
2. Replace hard-coded header arrangement with a documented, configurable layout system.
3. Expose the safe scalar settings in the visual editor.
4. Keep all changes additive and backward compatible unless explicitly documented otherwise.

## Planned Stages

### Stage 1. Audit and plan

- audit current body-mode and header architecture
- define which config blocks are first-class in the shared contract
- document rationale before implementation

### Stage 2. Shared mode contracts

- formalize `fullscreen` settings in `ConfigManager`
- formalize `subview` settings in `ConfigManager`
- extend `tabs_config` with layout-related fields
- add a dedicated additive carousel settings block
- normalize and validate all new fields

### Stage 3. Runtime mode updates

- update `FullscreenMode` to use the normalized contract
- update `TabsMode` to honor new layout controls
- update `CarouselMode` to honor new behavior/layout controls
- keep `ExpandMode` on shared grid behavior unless a dedicated config is strictly needed

### Stage 4. Header layout runtime

- add `header.layout` contract
- keep current header arrangement as the default preset
- implement alternate presets and spacing/alignment controls
- preserve existing slot and badge behavior

### Stage 5. Editor support and docs

- expose the new scalar mode fields in the editor
- expose header layout preset and spacing controls in the editor
- document which options remain YAML-only
- update upgrade notes and feature docs

### Stage 6. Final verification

- run targeted tests while implementing
- run full project verification before the last commit
- update final summary docs if config surface changed materially

## Proposed Config Surface

### Fullscreen

Planned first-class fields:

- `fullscreen.width`
- `fullscreen.height`
- `fullscreen.max_width`
- `fullscreen.max_height`
- `fullscreen.padding`
- `fullscreen.background`
- `fullscreen.show_close`
- `fullscreen.close_on_escape`

### Tabs

Planned `tabs_config` additions:

- `tabs_config.content_padding`
- `tabs_config.tab_min_width`
- `tabs_config.tab_alignment`

### Carousel

Planned additive nested block:

- `carousel_options.show_arrows`
- `carousel_options.show_indicators`
- `carousel_options.loop`
- `carousel_options.swipe_threshold`
- `carousel_options.height`
- `carousel_options.gap`

Backward compatibility:

- root `carousel_autoplay` and `carousel_interval` remain supported
- no legacy migration behavior should be broken

### Subview

Planned first-class fields:

- `subview.path`
- `subview.navigation_path`
- `subview.replace_state`
- `subview.return_on_close`

### Header

Planned layout block:

- `header.layout.variant`
- `header.layout.gap`
- `header.layout.content_gap`
- `header.layout.align`
- `header.layout.badges_position`

Initial preset strategy:

- `default`
- `stacked`
- `centered`

## Risks

- body mode config can become fragmented again if new fields bypass `ConfigManager`
- reintroducing a nested carousel object under the old legacy name would be risky
- header layout changes can easily regress slot rendering or click behavior if DOM assumptions are broken
- editor support for deeply nested repeated structures must stay limited and explicit

## Backward Compatibility

- current mode defaults stay the default behavior
- current header layout stays the default preset
- root `carousel_autoplay` and `carousel_interval` stay valid
- existing modal/badge work remains unchanged
- any YAML-only fallback stays documented
