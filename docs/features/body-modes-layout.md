# Body Mode Layouts

## Overview

This document covers the non-modal body-mode settings that are now part of the shared config contract.

Primary runtime files:

- `src/modes/ExpandMode.ts`
- `src/modes/FullscreenMode.ts`
- `src/modes/TabsMode.ts`
- `src/modes/CarouselMode.ts`
- `src/modes/SubviewMode.ts`

## Expand mode

`body_mode: expand` continues to rely on shared `grid` and animation settings.

Current note:

- no dedicated `expand` config block was introduced in this stage
- grid application now stays aligned with the shared base-mode helper logic

Use `grid.*`, animation fields, and card padding for expand layouts.

## Fullscreen mode

`body_mode: fullscreen` now has a documented `fullscreen:` config block.

Supported fields:

- `width`
- `height`
- `max_width`
- `max_height`
- `padding`
- `background`
- `show_close`
- `close_on_escape`

Example:

```yaml
type: custom:universal-card
title: Cameras
body_mode: fullscreen
fullscreen:
  width: 88rem
  height: 90vh
  max_width: 96rem
  max_height: 95vh
  padding: 24px
  background: var(--lovelace-background)
body:
  cards:
    - type: picture-entity
      entity: camera.garden
```

## Tabs mode

`body_mode: tabs` keeps `tabs:` and `tabs_config:`.

`tabs_config` now supports:

- `position`
- `show_icons`
- `show_labels`
- `content_padding`
- `tab_min_width`
- `tab_alignment`

Supported `tab_alignment` values:

- `start`
- `center`
- `stretch`

Example:

```yaml
type: custom:universal-card
body_mode: tabs
tabs_config:
  position: top
  content_padding: 12px
  tab_min_width: 96px
  tab_alignment: center
tabs:
  - label: Overview
    icon: mdi:view-dashboard
    cards:
      - type: entities
        entities:
          - sensor.power
  - label: Details
    icon: mdi:list-box-outline
    cards:
      - type: history-graph
        entities:
          - sensor.power
```

## Carousel mode

`body_mode: carousel` keeps root autoplay fields and adds `carousel_options:` for layout and controls.

Root fields kept for backward compatibility:

- `carousel_autoplay`
- `carousel_interval`

New nested fields:

- `show_arrows`
- `show_indicators`
- `loop`
- `swipe_threshold`
- `height`

Example:

```yaml
type: custom:universal-card
body_mode: carousel
carousel_autoplay: true
carousel_interval: 4000
carousel_options:
  show_arrows: false
  show_indicators: true
  loop: true
  swipe_threshold: 80
  height: 22rem
body:
  cards:
    - type: picture-elements
      image: /local/one.jpg
    - type: picture-elements
      image: /local/two.jpg
```

## Subview mode

`body_mode: subview` now has first-class schema support for `subview:`.

Supported fields:

- `path`
- `navigation_path`
- `replace_state`
- `return_on_close`

Example:

```yaml
type: custom:universal-card
title: More Details
body_mode: subview
subview:
  path: /lovelace/details
  return_on_close: true
```

## Editor support

Current editor-friendly fields in this stage are the scalar layout fields that fit well into form controls.

Best candidates for editor exposure:

- `fullscreen.*` sizing and behavior fields
- `tabs_config.*`
- `carousel_options.*`
- `subview.*`

If a field is not exposed yet in the editor, it remains available in YAML.

## Compatibility notes

- existing `carousel_autoplay` and `carousel_interval` remain valid
- legacy removed `carousel:` object is still not reintroduced
- `fullscreen` and `subview` runtime blocks are now documented as first-class config
- expand mode remains based on shared `grid` rather than a separate nested block
