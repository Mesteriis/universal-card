---
title: Modal Layout
description: Layout, sizing, spacing, and grid behavior for body_mode: modal.
section_label: Features
permalink: /features/modal-layout/
---
# Modal Layout

## Overview

`body_mode: modal` renders nested body cards in a dialog attached to `document.body`.
The modal keeps the card header in the main card shell and opens body content in an overlay.

Primary runtime files:

- `src/modes/ModalMode.ts`
- `src/modes/BaseMode.ts`
- `src/core/UniversalCard.ts`

## How modal mode works

When the card expands in modal mode:

1. `UniversalCard` delegates the body to `ModalMode`
2. `ModalMode` creates an overlay and dialog
3. nested body cards are mounted into `.uc-modal-grid`
4. the overlay locks page scroll until the modal closes

The modal grid uses the same nested card wrapper model as other body modes, so `colspan` and `rowspan` continue to work.

## Sizing options

Modal sizing is configured under `modal:`.

Supported fields:

- `width`: dialog width
- `height`: dialog height
- `max_width`: dialog max-width cap
- `max_height`: dialog max-height cap
- `backdrop_blur`: blur the page behind the modal
- `backdrop_color`: overlay background color
- `close_on_backdrop`: close when clicking outside the dialog
- `close_on_escape`: close on `Escape`
- `show_close`: show the close button in the dialog header

## Editor support

The visual editor now exposes the modal fields most users need for layout work:

- `modal.width`
- `modal.height`
- `modal.max_width`
- `modal.max_height`
- `modal.loading_strategy`

Overlay behavior fields remain YAML-only in this stage:

- `modal.backdrop_blur`
- `modal.backdrop_color`
- `modal.close_on_backdrop`
- `modal.close_on_escape`
- `modal.show_close`

## Auto vs manual sizing

The modal supports both responsive auto sizing and manual sizing.

Rules:

- `width: auto` enables responsive width behavior based on the viewport and `max_width`
- `height: auto` lets content define height, capped by `max_height`
- any other CSS value switches that axis to manual sizing
- if `width` is omitted, the existing default width preset remains `90%`
- if `height` is omitted, the default is `auto`

Recommended CSS values:

- `px`
- `%`
- `vw`
- `vh`
- `rem`
- `auto`

## Examples

### Default responsive modal

```yaml
type: custom:universal-card
title: Climate
body_mode: modal
body:
  cards:
    - type: thermostat
      entity: climate.living_room
```

### Responsive width with explicit height cap

```yaml
type: custom:universal-card
title: Security
body_mode: modal
modal:
  width: auto
  max_width: 72rem
  max_height: 85vh
body:
  cards:
    - type: entities
      entities:
        - binary_sensor.door
        - binary_sensor.window
```

### Manual modal size

```yaml
type: custom:universal-card
title: Cameras
body_mode: modal
modal:
  width: 80vw
  height: 70vh
  max_width: 96rem
  max_height: 90vh
body:
  cards:
    - type: picture-entity
      entity: camera.garden
```

## Grid and stack inside modal

The modal body uses `.uc-modal-grid` and honors `grid.columns`, `grid.gap`, `grid.row_gap`, `grid.column_gap`, alignment, and auto-flow options.

Example:

```yaml
type: custom:universal-card
title: Energy
body_mode: modal
modal:
  width: auto
  max_width: 70rem
grid:
  columns: 2
  gap: 12px
  column_gap: 16px
  row_gap: 12px
body:
  cards:
    - type: entities
      title: Solar
      entities:
        - sensor.solar_power
        - sensor.solar_today
    - type: vertical-stack
      cards:
        - type: gauge
          entity: sensor.grid_load
        - type: gauge
          entity: sensor.battery_level
```

Recommendations:

- use numeric `grid.columns` for simple 2-column modal layouts
- keep `gap` values slightly tighter than inline expand mode to avoid wasted space in overlays
- prefer `vertical-stack` inside a grid cell when one column needs multiple related cards
- use `colspan` for wider cards instead of forcing overly complex grid templates

## Mobile behavior

Below roughly `768px` viewport width, modal grid collapses to a single column.

This is intentional.

Rationale:

- prevents unreadable narrow columns
- reduces overflow risk for nested Lovelace cards
- keeps spacing predictable on phones and small tablets

If a layout must stay multi-column on mobile, that currently requires custom CSS and is not the default runtime behavior.

## Spacing behavior

Current modal spacing changes compared with earlier builds:

- tighter inner content padding
- tighter default card gap inside the modal grid
- header is omitted completely when both title and close button are absent
- nested cards keep `min-width: 0` to avoid horizontal overflow in narrow columns

## Limitations

- `width: auto` is a responsive viewport-fit mode, not content-measured shrink-wrap sizing
- `max_width` and `max_height` should use CSS values that browsers can apply directly
- very wide nested cards can still force uncomfortable layouts if they are not designed for narrow containers
- mobile collapse to one column is automatic and currently not configurable through YAML

## Compatibility notes

Existing configs continue to work:

- `modal.width` and `modal.max_width` are still supported
- configs without `modal.height` continue to use auto height
- the main behavioral change is that modal grid now consistently renders as grid instead of being overridden back to a vertical flex list
