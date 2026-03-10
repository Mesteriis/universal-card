---
title: YAML Block Reference
description: Block-by-block YAML reference for Universal Card with field groups, typical values, and practical examples.
section_label: Features
permalink: /features/yaml-block-reference/
---

# YAML Block Reference

This page is the practical YAML map of Universal Card.
It is organized by configuration block instead of by feature story.

## Root shell

Core fields:

- `title`
- `subtitle`
- `icon`
- `icon_color`
- `entity`
- `attribute`
- `theme`
- `padding`
- `border_radius`
- `expanded`
- `show_state`
- `show_expand_icon`
- `expand_icon`
- `body_mode`

Example:

```yaml
type: custom:universal-card
title: Overview
subtitle: Main floor
icon: mdi:view-dashboard
icon_color: '#7cd6ff'
entity: sensor.demo_temperature
theme: glass
padding: 16px
border_radius: 16px
show_state: true
body_mode: expand
```

## Header blocks

Header-related sections:

- `header`
- `header_left`
- `header_right`

### `header`

Common fields:

- `sticky`
- `clickable`
- `cards`
- `layout.variant`
- `layout.gap`
- `layout.content_gap`
- `layout.align`
- `layout.badges_position`

Example:

```yaml
header:
  sticky: true
  clickable: true
  layout:
    variant: stacked
    gap: 18px
    content_gap: 6px
    badges_position: below_content
  cards:
    - type: markdown
      content: "Header slot content"
```

### `header_left` and `header_right`

Use side slots for utility controls.

```yaml
header_left:
  cards:
    - type: button
      icon: mdi:arrow-left
header_right:
  cards:
    - type: button
      icon: mdi:cog
```

## Badges

Each entry in `badges:` can be one of these types:

- `state`
- `attribute`
- `counter`
- `custom`

Common fields:

- `icon`
- `value`
- `label`
- `unit`
- `color`
- `thresholds`
- `visibility`
- `color_rules`
- `icon_only`
- `tap_action`
- `icon_tap_action`

Example:

```yaml
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    label: Main
    color_rules:
      - operator: ==
        value: 'on'
        color: gold
      - operator: ==
        value: 'off'
        color: gray
  - type: state
    entity: vacuum.robot
    icon: mdi:robot-vacuum
    icon_only: true
    visibility:
      - operator: !=
        value: docked
```

Supported badge operators:

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

## Body content

Main block:

- `body.cards`

`body.cards` accepts nested Lovelace cards.

```yaml
body:
  cards:
    - type: entities
      entities:
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity
    - type: markdown
      content: Extra details
```

## Grid

Main fields:

- `columns`
- `gap`
- `row_gap`
- `column_gap`
- `align_items`
- `justify_items`
- `place_items`
- `auto_flow`
- `dense`

Card-level helpers:

- `colspan`
- `rowspan`

Example:

```yaml
grid:
  columns: "1.4fr 0.8fr 1fr"
  gap: 10px
  row_gap: 10px
  column_gap: 14px
body:
  cards:
    - type: markdown
      colspan: 2
      content: Summary
    - type: gauge
      entity: sensor.demo_temperature
    - type: entities
      rowspan: 2
      entities:
        - entity: sensor.network_health_sensor
```

## Modal

Main block:

- `modal`

Fields:

- `width`
- `height`
- `max_width`
- `max_height`
- `loading_strategy`
- `backdrop_blur`
- `backdrop_color`
- `close_on_backdrop`
- `close_on_escape`
- `show_close`

Example:

```yaml
body_mode: modal
modal:
  width: auto
  max_width: 72rem
  max_height: 85vh
  loading_strategy: lazy
```

## Fullscreen

Main block:

- `fullscreen`

Fields:

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
body_mode: fullscreen
fullscreen:
  width: 92vw
  max_width: 96rem
  max_height: 94vh
  padding: 20px
```

## Tabs

Main blocks:

- `tabs`
- `tabs_config`

### `tabs`

Each tab supports:

- `label`
- `icon`
- `cards`

### `tabs_config`

Main fields:

- `position`
- `show_icons`
- `show_labels`
- `content_padding`
- `tab_min_width`
- `tab_alignment`

Example:

```yaml
body_mode: tabs
tabs_config:
  position: top
  show_icons: true
  show_labels: true
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
```

## Carousel

Main controls are split across root fields and `carousel_options`.

Root fields:

- `carousel_autoplay`
- `carousel_interval`

`carousel_options` fields:

- `show_arrows`
- `show_indicators`
- `loop`
- `swipe_threshold`
- `height`

Example:

```yaml
body_mode: carousel
carousel_autoplay: true
carousel_interval: 4500
carousel_options:
  show_arrows: true
  show_indicators: true
  loop: true
  swipe_threshold: 60
  height: 20rem
```

## Subview

Main block:

- `subview`

Fields:

- `path`
- `navigation_path`
- `replace_state`
- `return_on_close`

Example:

```yaml
body_mode: subview
subview:
  navigation_path: /lovelace/details
  return_on_close: true
```

## Footer

Footer-related sections:

- `footer`
- `footer_left`
- `footer_right`

### `footer`

Common fields:

- `text`
- `icon`
- `cards`
- `actions[]`
- `tap_action`
- `hold_action`

Example:

```yaml
footer:
  text: Last update 2 min ago
  icon: mdi:clock-outline
  actions:
    - label: Open
      icon: mdi:open-in-new
      action:
        action: navigate
        navigation_path: /lovelace/details
```

### `footer_left` and `footer_right`

```yaml
footer_left:
  cards:
    - type: button
      icon: mdi:skip-previous
footer_right:
  cards:
    - type: button
      icon: mdi:skip-next
```

## Root actions

Supported blocks:

- `tap_action`
- `hold_action`
- `double_tap_action`

Common action values:

- `more-info`
- `toggle`
- `navigate`
- `url`
- `call-service`
- `fire-dom-event`
- `none`

Example:

```yaml
tap_action:
  action: navigate
  navigation_path: /lovelace/energy
hold_action:
  action: more-info
double_tap_action:
  action: toggle
```

## Context menu

Main block:

- `context_menu.items[]`

Typical item fields:

- `label`
- `icon`
- `separator`
- `action`

Example:

```yaml
context_menu:
  items:
    - label: Open details
      icon: mdi:open-in-new
      action:
        action: navigate
        navigation_path: /lovelace/details
    - separator: true
    - label: More info
      icon: mdi:information-outline
      action:
        action: more-info
```

## Visibility

Main blocks:

- `visibility`
- `section_visibility`

Supported condition families:

- state
- numeric state
- user
- time
- screen
- logical groups with `and`, `or`, `not`

Example:

```yaml
visibility:
  - condition: and
    conditions:
      - condition: state
        entity: input_select.house_mode
        state: home
      - condition: screen
        min_width: 768
section_visibility:
  footer:
    - condition: user
      is_admin: true
```

## Swipe

Main block:

- `swipe`

Fields:

- `enabled`
- `direction`
- `threshold`
- `velocityThreshold`
- `preventScroll`
- `left`
- `right`
- `up`
- `down`

Directional action values:

- `none`
- `expand`
- `collapse`
- `toggle`
- `next`
- `prev`

Example:

```yaml
swipe:
  enabled: true
  direction: horizontal
  threshold: 60
  velocityThreshold: 0.35
  preventScroll: true
  left:
    action: next
  right:
    action: prev
```

## Styling

Main styling blocks:

- `theme`
- `icon_color`
- `theme_tokens`
- `state_styles`
- `custom_css`

### `theme_tokens`

Example:

```yaml
theme_tokens:
  --uc-background-color: "linear-gradient(145deg, rgba(9,16,27,.96), rgba(23,42,59,.92))"
  --uc-border-color: "rgba(117, 204, 255, 0.36)"
  --uc-text-color: "#f8fbff"
```

### `state_styles`

Example:

```yaml
entity: input_boolean.kitchen_light
state_styles:
  'on':
    border_color: '#f4b400'
    box_shadow: "0 0 0 1px rgba(244,180,0,.36), 0 24px 52px rgba(244,180,0,.16)"
  'off':
    opacity: 0.72
```

### `custom_css`

Example:

```yaml
custom_css:
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
  - scope: card
    css: |
      .universal-card {
        backdrop-filter: blur(16px);
      }
```

## Loading and runtime

Main fields:

- `lazy_load`
- `lazy_initial_batch`
- `lazy_batch_size`
- `lazy_idle_timeout`
- `skeleton_count`
- `stability_mode`
- `remember_expanded_state`
- `remember_mode_state`
- `enable_card_pool`
- `pool_scope`
- `pool_ttl_ms`
- `pool_max_entries`

Example:

```yaml
lazy_load: true
lazy_initial_batch: 1
lazy_batch_size: 1
lazy_idle_timeout: 180
stability_mode: true
remember_expanded_state: false
enable_card_pool: true
pool_scope: card
pool_max_entries: 8
```

## Recommended reading order

1. [Configuration]({{ '/configuration/' | relative_url }})
2. [Examples Gallery]({{ '/examples/' | relative_url }})
3. The focused feature page for the area you are tuning
