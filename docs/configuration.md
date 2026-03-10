---
title: Configuration
description: Core YAML structure, starter templates, and the shortest path from a minimal card to a production dashboard card.
section_label: Configuration
permalink: /configuration/
---

# Configuration

`Universal Card` is easiest to configure in layers:

1. define the shell
2. choose how the body opens
3. add layout
4. add rules and actions
5. add styling only where it improves the dashboard

## Minimal card

```yaml
type: custom:universal-card
title: Example
body:
  cards:
    - type: markdown
      content: Hello
```

## Common shell fields

| Field | Purpose |
| --- | --- |
| `title`, `subtitle` | Main header copy |
| `icon`, `icon_color` | Header icon and optional color |
| `entity`, `attribute` | Entity-backed title, styles, and rules |
| `theme` | Built-in visual preset |
| `padding`, `border_radius` | Base shell spacing and shape |
| `expanded` | Start opened or collapsed |
| `show_state` | Show the entity state in the header |
| `show_expand_icon`, `expand_icon` | Expand affordance |

## Main sections

| Section | Purpose |
| --- | --- |
| `header` | Header behavior and layout presets |
| `header_left`, `header_right` | Side slot cards in the header |
| `badges` | Header chips with values, rules, and actions |
| `body` | Nested Lovelace cards |
| `body_mode` | How the body is shown |
| `grid` | Shared card layout rules |
| `footer` | Supporting cards and actions |
| `footer_left`, `footer_right` | Side slot cards in the footer |
| `visibility`, `section_visibility` | Show or hide card regions |
| `swipe` | Directional gesture actions |
| `theme_tokens`, `state_styles`, `custom_css` | Styling layers |

## Body mode quick picker

| Mode | Best for | Main docs |
| --- | --- | --- |
| `expand` | inline drill-down | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `modal` | focused detail overlays | [Modal Layout]({{ '/features/modal-layout/' | relative_url }}) |
| `fullscreen` | large media and immersive dashboards | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `tabs` | grouped content inside one card | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `carousel` | slide-based navigation | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `subview` | jump to a dedicated Lovelace view | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `none` | header-only status cards | [Examples Gallery]({{ '/examples/' | relative_url }}) |

## Starter templates

### Expand with grid

```yaml
type: custom:universal-card
title: Overview
icon: mdi:view-dashboard
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

### Modal detail card

```yaml
type: custom:universal-card
title: Security
icon: mdi:shield-home
body_mode: modal
modal:
  width: auto
  max_width: 72rem
  max_height: 85vh
  loading_strategy: lazy
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
        - entity: sensor.security_status
```

### Header with badges

```yaml
type: custom:universal-card
title: Living Room
subtitle: Lights and comfort
icon: mdi:sofa
header:
  layout:
    variant: stacked
    badges_position: below_content
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    label: Main light
    color_rules:
      - operator: ==
        value: 'on'
        color: gold
      - operator: ==
        value: 'off'
        color: gray
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.kitchen_light
```

## Rules and interaction

Use these groups when the structure is already stable:

- root `tap_action`, `hold_action`, `double_tap_action`
- `badges[]` with `visibility`, `color_rules`, `icon_only`, and badge actions
- root `visibility`
- `section_visibility`
- `swipe.*`
- `context_menu.*`

## Styling and runtime

Use these groups for visual tuning and performance:

- `theme`
- `icon_color`
- `theme_tokens`
- `state_styles`
- `custom_css`
- `lazy_load`
- `modal.loading_strategy`
- persistence, pooling, animation, and stability settings

## Where to go next

<div class="docs-link-grid">
  <a class="docs-link-card" href="{{ '/examples/' | relative_url }}">
    <h3>Examples Gallery</h3>
    <p>Copyable YAML for body modes, badges, visibility, styling, footer, gestures, and editor scenarios.</p>
  </a>
  <a class="docs-link-card" href="{{ '/features/capability-reference/' | relative_url }}">
    <h3>Capability Reference</h3>
    <p>The complete user-facing field map grouped by feature area.</p>
  </a>
  <a class="docs-link-card" href="{{ '/features/yaml-block-reference/' | relative_url }}">
    <h3>YAML Block Reference</h3>
    <p>Block-by-block YAML guidance for root fields, badges, grid, body modes, styling, actions, and runtime settings.</p>
  </a>
  <a class="docs-link-card" href="{{ '/features/recipes-by-use-case/' | relative_url }}">
    <h3>Recipes by Use Case</h3>
    <p>Starter recipes for climate, security, media, mobile dashboards, wall panels, and admin tools.</p>
  </a>
  <a class="docs-link-card" href="{{ '/features/editor/' | relative_url }}">
    <h3>Editor</h3>
    <p>What is supported in the visual editor and when YAML remains the better fit.</p>
  </a>
</div>
