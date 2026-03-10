---
title: Capability Reference
description: Complete public feature inventory for Universal Card, including coverage type, editor support, and where each capability is documented.
section_label: Features
permalink: /features/capability-reference/
---

# Capability Reference

This page is the public inventory for Universal Card.
It exists to answer a simple question precisely: what is actually supported, how is it configured, and where is that capability covered in the documentation.

<div class="docs-callout">
  <strong>Coverage model.</strong> Some features are best shown with real renders, some are timing-driven or interaction-driven and are better documented through YAML plus behavior notes. This page makes that distinction explicit.
</div>

## Coverage matrix

| Capability group | Public surface | Coverage type | Editor | Main docs |
| --- | --- | --- | --- | --- |
| Core shell | `title`, `subtitle`, `icon`, `icon_color`, `entity`, `attribute`, `theme`, `padding`, `border_radius`, `expanded` | screenshot + YAML | partial | [Configuration]({{ '/configuration/' | relative_url }}) |
| Body modes | `expand`, `modal`, `fullscreen`, `tabs`, `carousel`, `subview`, `none` | screenshot/GIF + YAML | partial | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| Grid layout | `grid.columns`, `gap`, spans, mixed columns | screenshot + YAML | partial | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Header | `header.cards`, `header_left`, `header_right`, `sticky`, `clickable`, `header.layout.*` | screenshot + YAML | partial | [Header Layout]({{ '/features/header-layout/' | relative_url }}) |
| Badges | `badges[]`, thresholds, `visibility`, `color_rules`, `icon_only`, badge actions | screenshot + YAML | partial | [Badges]({{ '/features/badges/' | relative_url }}) |
| Footer | `footer.cards`, `footer_left`, `footer_right`, `footer.actions`, footer root actions | screenshot + YAML | mixed | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Root actions | `tap_action`, `hold_action`, `double_tap_action` | YAML + render context | partial | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Context menu | `context_menu.items[]` | YAML + behavior note | YAML-first | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Visibility | `visibility`, `section_visibility` | YAML + render context | strong | [Configuration]({{ '/configuration/' | relative_url }}) |
| Styling | themes, `theme_tokens`, `state_styles`, `custom_css`, `icon_color` | screenshot + YAML | mixed | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Gestures | `swipe.*` | YAML + behavior note | strong | [Configuration]({{ '/configuration/' | relative_url }}) |
| Loading and runtime | `lazy_load`, `lazy_initial_batch`, `lazy_batch_size`, `lazy_idle_timeout`, `modal.loading_strategy`, `skeleton_count`, `stability_mode` | YAML + behavior note | mixed | [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }}) |
| Persistence and pooling | `remember_expanded_state`, `remember_mode_state`, `enable_card_pool`, `pool_scope`, `pool_ttl_ms`, `pool_max_entries` | YAML + behavior note | YAML-first | [Configuration]({{ '/configuration/' | relative_url }}) |
| Animation | `animation_duration`, `expand_animation`, `collapse_animation`, `cards_animation`, `cards_direction`, `cards_stagger`, `auto_collapse_after` | YAML + behavior note | mixed | [Configuration]({{ '/configuration/' | relative_url }}) |
| Editor | `universal-card-editor` sections and schema-driven controls | screenshot + YAML | n/a | [Editor]({{ '/features/editor/' | relative_url }}) |
| Platform API | `window.UniversalCard`, loaders, config helpers, devtools, plugins | reference note | n/a | [Configuration]({{ '/configuration/' | relative_url }}) |

## Core card surface

The root config defines the card identity and shell behavior:

- `title`, `subtitle`, `icon`, `icon_color`
- `entity`, optional root `attribute`
- `theme`, `theme_tokens`, `custom_css`
- `padding`, `border_radius`
- `expanded`, `show_state`, `show_expand_icon`, `expand_icon`

Minimal example:

```yaml
type: custom:universal-card
title: Overview
subtitle: Minimal shell
icon: mdi:view-dashboard
entity: sensor.demo_temperature
body:
  cards:
    - type: markdown
      content: Universal Card loaded successfully
```

## Layout and composition

### Body modes

The body can be rendered inline or through specialized surfaces:

- `expand`
- `modal`
- `fullscreen`
- `tabs`
- `carousel`
- `subview`
- `none`

Each mode is documented separately because the configuration surface differs:

- `modal.*` for overlay sizing and loading strategy
- `fullscreen.*` for immersive overlays
- `tabs[]` plus `tabs_config.*`
- `carousel_autoplay`, `carousel_interval`, and `carousel_options.*`
- `subview.*` for route-backed detail views

### Grid and nested cards

The shared grid contract applies to body content and per-tab grids:

- `grid.columns`
- `grid.gap`
- card-level `colspan`
- card-level `rowspan`

The runtime still supports embedded Lovelace cards such as:

- `entities`
- `button`
- `markdown`
- `gauge`
- `vertical-stack`
- `horizontal-stack`

Example:

```yaml
grid:
  columns: "1.4fr 0.8fr 1fr"
  gap: 10px
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
        - sensor.house_mode_sensor
```

## Header, badges, and footer

### Header

The header surface includes:

- root title and subtitle
- root icon and icon color
- `header.cards`
- `header_left.cards`
- `header_right.cards`
- `sticky_header` and `header.sticky`
- `header.clickable`
- `header.layout.variant`
- `header.layout.gap`
- `header.layout.content_gap`
- `header.layout.align`
- `header.layout.badges_position`

### Badges

Badge capabilities include:

- built-in types: `state`, `attribute`, `counter`, `custom`
- static colors and thresholds
- per-badge `visibility`
- `color_rules` with comparison operators
- `icon_only`
- whole-badge `tap_action`
- separate `icon_tap_action`

### Footer

Footer capabilities include:

- `footer.cards`
- `footer_left.cards`
- `footer_right.cards`
- `footer.text`, `footer.icon`
- `footer.actions[]`
- `footer.tap_action`
- `footer.hold_action`

## Interaction and conditions

### Root actions

Top-level interaction remains available through:

- `tap_action`
- `hold_action`
- `double_tap_action`

### Context menu

`context_menu.items[]` supports:

- labeled items
- icons
- separators
- nested submenus
- actions bound to menu items

### Visibility

Visibility is supported at two levels:

- root `visibility`
- `section_visibility.header`, `.body`, `.footer`

Supported condition families:

- state
- numeric state
- user
- time
- screen
- logical `and` / `or` / `not`

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

### Swipe gestures

`swipe.*` config supports:

- `enabled`
- `direction`
- `threshold`
- `velocityThreshold`
- `preventScroll`
- directional actions via `left`, `right`, `up`, `down`

Supported directional actions:

- `none`
- `expand`
- `collapse`
- `toggle`
- `next`
- `prev`

## Styling and visual tuning

### Built-in themes

The card ships with a wide built-in theme catalog including:

- `default`, `transparent`, `solid`, `glass`, `glassmorphism`, `minimal`
- `dark`, `midnight`, `obsidian`, `charcoal`, `carbon`, `graphite`
- `neon`, `cyber`, `void`, `matrix`
- `aurora`, `forest`, `ocean`, `ember`, `purple-haze`
- `nord`, `dracula`, `monokai`, `tokyo-night`, `catppuccin`

### Theme token overrides

`theme_tokens` accepts a flat CSS-variable map:

```yaml
theme_tokens:
  --uc-background-color: "linear-gradient(145deg, rgba(9,16,27,.96), rgba(23,42,59,.92))"
  --uc-border-color: "rgba(117, 204, 255, 0.36)"
  --uc-text-color: "#f8fbff"
```

### State styles

`state_styles` maps entity state to style overrides on the card shell.
It uses the root `entity` and optional root `attribute`.

```yaml
entity: input_boolean.kitchen_light
state_styles:
  'on':
    border_color: '#f4b400'
    box_shadow: "0 0 0 1px rgba(244,180,0,.36), 0 24px 52px rgba(244,180,0,.16)"
  'off':
    opacity: 0.72
```

### Custom CSS

`custom_css` is the most flexible styling surface and supports:

- string form
- object form with `scope`, `mode`, `priority`
- arrays of scoped CSS rules

Supported scopes:

- `card`
- `header`
- `body`
- `footer`
- `global`

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

## Loading, persistence, and runtime controls

### Inline lazy loading

The inline body pipeline supports:

- `lazy_load`
- `lazy_initial_batch`
- `lazy_batch_size`
- `lazy_idle_timeout`
- `skeleton_count`

### Modal loading

`modal.loading_strategy` supports:

- `lazy`
- `preload`

### Stability mode

`stability_mode: true` intentionally disables a subset of aggressive runtime features for weaker devices.
It is the safe switch when you need predictability more than visual polish.

### Persistence and card pool

The runtime also exposes:

- `remember_expanded_state`
- `remember_mode_state`
- `enable_card_pool`
- `pool_scope`
- `pool_ttl_ms`
- `pool_max_entries`

These are public, but they are more operational than visual, so the docs keep them in reference/YAML coverage instead of screenshot-driven coverage.

## Animation controls

Animation and body timing remain public configuration:

- `animation_duration`
- `expand_animation`
- `collapse_animation`
- `cards_animation`
- `cards_direction`
- `cards_stagger`
- `auto_collapse_after`

These belong in YAML because their effect depends on motion and dashboard context.

## Editor surface

The editor is a real surface with its own contract.
It now covers the most common fields for body modes, header layout, visibility, swipe, styling, and badges.

For the editor-specific breakdown and current YAML-only gaps, use:

- [Editor]({{ '/features/editor/' | relative_url }})

## Platform API and advanced namespaces

The bundle also exposes a public runtime namespace at `window.UniversalCard`.
That surface includes:

- `config.getSchema()`
- `config.normalize()`
- `config.validate()`
- `config.hasChanged()`
- lazy loaders for `advanced`, `editor`, `cardEditor`, and `devtools`
- plugin registration lifecycle
- devtools enable/disable hooks

This API is useful for integrators, advanced wrappers, and tooling, but it is not required for normal Lovelace usage.

## Recommended path through the docs

1. [Configuration]({{ '/configuration/' | relative_url }})
2. [Examples Gallery]({{ '/examples/' | relative_url }})
3. [Modal Layout]({{ '/features/modal-layout/' | relative_url }}) or [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }})
4. [Header Layout]({{ '/features/header-layout/' | relative_url }}) and [Badges]({{ '/features/badges/' | relative_url }})
5. [Editor]({{ '/features/editor/' | relative_url }}) when you want the UI coverage map
