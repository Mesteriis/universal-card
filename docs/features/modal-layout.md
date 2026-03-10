---
title: Modal Layout
description: Layout, sizing, spacing, and mobile behavior for body_mode: modal.
section_label: Features
permalink: /features/modal-layout/
---

# Modal Layout

`body_mode: modal` keeps the card header in place and opens the body in a dialog overlay.
It is the best choice when the body should feel focused without taking over the full dashboard.

## Main settings

Configure modal behavior under `modal:`.

| Field | Purpose |
| --- | --- |
| `width` | Dialog width |
| `height` | Dialog height |
| `max_width` | Width cap |
| `max_height` | Height cap |
| `loading_strategy` | `lazy` or `preload` |
| `backdrop_blur` | Blur the page behind the modal |
| `backdrop_color` | Overlay color |
| `close_on_backdrop` | Close when clicking outside |
| `close_on_escape` | Close on `Escape` |
| `show_close` | Show close button |

## Auto vs manual sizing

Recommended rules:

- use `width: auto` when the dialog should stay responsive and respect `max_width`
- use `height: auto` when content height should grow naturally and stop at `max_height`
- use explicit values such as `px`, `%`, `vw`, `vh`, or `rem` when the modal must follow a fixed design

Safe defaults:

- `width: auto` or `90%`
- `height: auto`
- `max_width: 60rem` to `72rem`
- `max_height: 80vh` to `90vh`

## Grid and stacks inside modal

Modal mode respects the same `grid` rules as the regular body.
That means:

- numeric columns work well for 2-column overlays
- `vertical-stack` is a good way to group multiple cards inside one grid cell
- `colspan` and `rowspan` still work

Example:

```yaml
type: custom:universal-card
title: Energy Overview
body_mode: modal
modal:
  width: auto
  max_width: 72rem
  max_height: 85vh
grid:
  columns: 2
  gap: 12px
body:
  cards:
    - type: entities
      entities:
        - entity: sensor.solar_power
        - entity: sensor.grid_load
    - type: vertical-stack
      cards:
        - type: gauge
          entity: sensor.battery_level
        - type: gauge
          entity: sensor.demo_temperature
```

## Mobile behavior

On smaller screens the modal body collapses to one column.
This keeps nested cards readable and prevents narrow multi-column layouts from breaking on phones.

Recommendations:

- keep desktop modal grids simple
- prefer `vertical-stack` for dense content groups
- rely on `colspan` for hero cards instead of aggressive custom grid templates

## Example presets

### Compact responsive modal

```yaml
type: custom:universal-card
title: Security
body_mode: modal
modal:
  width: auto
  max_width: 64rem
  max_height: 82vh
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
        - entity: sensor.security_status
```

### Fixed-size media modal

```yaml
type: custom:universal-card
title: Garden Camera
body_mode: modal
modal:
  width: 80vw
  height: 72vh
  max_width: 96rem
  max_height: 90vh
body:
  cards:
    - type: picture-entity
      entity: camera.garden
```

### Modal with preload

```yaml
type: custom:universal-card
title: Frequently Used Controls
body_mode: modal
modal:
  width: auto
  max_width: 56rem
  loading_strategy: preload
body:
  cards:
    - type: button
      entity: input_boolean.kitchen_light
    - type: button
      entity: input_boolean.security_armed
```

## Editor coverage

The visual editor covers the main sizing fields and `modal.loading_strategy`.
Overlay behavior fields are still easiest to tune directly in YAML.
