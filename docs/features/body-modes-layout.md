---
title: Body Modes Layout
description: Practical guide to expand, fullscreen, tabs, carousel, subview, and header-only cards.
section_label: Features
permalink: /features/body-modes-layout/
---

# Body Mode Layouts

Universal Card supports seven body modes.
Use the mode that matches how the content should feel in the dashboard.

| Mode | Best for |
| --- | --- |
| `expand` | inline details under the card header |
| `modal` | focused overlays without leaving the current view |
| `fullscreen` | cameras, media, and large layouts |
| `tabs` | grouped content inside one card |
| `carousel` | swipe or slide-based navigation |
| `subview` | move to a dedicated Lovelace route |
| `none` | status-only or action-only header cards |

## Expand

`expand` is the default mode.
It works well when the body is part of the page flow.

Use these fields with `expand`:

- `grid.*`
- animation settings
- `lazy_load` and inline lazy batching

```yaml
type: custom:universal-card
title: Overview
body_mode: expand
grid:
  columns: 2
  gap: 12px
body:
  cards:
    - type: entities
      entities:
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity
    - type: entities
      entities:
        - entity: sensor.network_health_sensor
        - entity: input_select.house_mode
```

## Fullscreen

`fullscreen` is useful for large media, camera walls, and immersive detail views.

Main fields:

- `width`
- `height`
- `max_width`
- `max_height`
- `padding`
- `background`
- `show_close`
- `close_on_escape`

```yaml
type: custom:universal-card
title: Cameras
body_mode: fullscreen
fullscreen:
  width: 92vw
  max_width: 96rem
  max_height: 94vh
  padding: 20px
body:
  cards:
    - type: picture-entity
      entity: camera.garden
```

## Tabs

`tabs` groups related content without opening a separate overlay.

Main fields:

- `tabs[]`
- `tabs_config.position`
- `tabs_config.show_icons`
- `tabs_config.show_labels`
- `tabs_config.content_padding`
- `tabs_config.tab_min_width`
- `tabs_config.tab_alignment`

```yaml
type: custom:universal-card
title: Home Status
body_mode: tabs
tabs_config:
  content_padding: 12px
  tab_min_width: 96px
  tab_alignment: center
tabs:
  - label: Climate
    icon: mdi:home-thermometer
    cards:
      - type: entities
        entities:
          - entity: sensor.demo_temperature
          - entity: sensor.demo_humidity
  - label: Security
    icon: mdi:shield-lock
    cards:
      - type: entities
        entities:
          - entity: input_boolean.security_armed
          - entity: sensor.security_status
```

## Carousel

`carousel` is useful when one card should cycle through a short set of panels.

Main fields:

- `carousel_autoplay`
- `carousel_interval`
- `carousel_options.show_arrows`
- `carousel_options.show_indicators`
- `carousel_options.loop`
- `carousel_options.swipe_threshold`
- `carousel_options.height`

```yaml
type: custom:universal-card
title: Daily Overview
body_mode: carousel
carousel_autoplay: true
carousel_interval: 4500
carousel_options:
  show_arrows: true
  show_indicators: true
  loop: true
  height: 20rem
body:
  cards:
    - type: entities
      title: Status
      entities:
        - entity: sensor.network_health_sensor
        - entity: sensor.house_mode_sensor
    - type: entities
      title: Comfort
      entities:
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity
```

## Subview

`subview` is best when the card should open a dedicated page or dashboard route.

Main fields:

- `subview.path`
- `subview.navigation_path`
- `subview.replace_state`
- `subview.return_on_close`

```yaml
type: custom:universal-card
title: More Details
body_mode: subview
subview:
  navigation_path: /lovelace/details
  return_on_close: true
```

## None

`none` is the header-only mode.
Use it for compact status cards, badge-only cards, and action launchers.

```yaml
type: custom:universal-card
title: Quick Actions
subtitle: Header only
body_mode: none
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    icon_only: true
tap_action:
  action: navigate
  navigation_path: /lovelace/controls
```

## Editor coverage

The visual editor covers:

- `fullscreen.*`
- `tabs[]` and `tabs_config.*`
- `carousel_autoplay`, `carousel_interval`, and `carousel_options.*`
- `subview.*`

For `expand`, the editor relies mostly on shared body, grid, and animation controls.
