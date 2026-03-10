---
title: YAML Block Reference
description: Block-by-block YAML reference for Universal Card with field tables, typical values, and practical examples.
section_label: Features
permalink: /features/yaml-block-reference/
---

# YAML Block Reference

This page is the practical YAML map of Universal Card.
It is organized by configuration block instead of by feature story.

## Block Map

| Block | Purpose |
| --- | --- |
| Root shell | Card identity, entity binding, shell styling, open state |
| `header`, `header_left`, `header_right` | Header behavior, layout presets, and slot cards |
| `badges[]` | Compact status, counters, rules, and actions |
| `body.cards` | Main nested Lovelace content |
| `grid` | Shared card layout and spans |
| `modal`, `fullscreen` | Overlay sizing and behavior |
| `tabs`, `tabs_config` | Tabbed body composition |
| `carousel_options` plus root carousel fields | Slide controls and timing |
| `subview` | Route-backed detail views |
| `footer`, `footer_left`, `footer_right` | Footer content and actions |
| `tap_action`, `hold_action`, `double_tap_action` | Card-level actions |
| `context_menu` | Optional secondary actions menu |
| `visibility`, `section_visibility` | Conditional rendering |
| `swipe` | Directional gestures |
| `theme_tokens`, `state_styles`, `custom_css` | Styling overrides |
| Runtime settings | Loading, persistence, stability, pooling |

## Root Shell

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `type` | string | `custom:universal-card` | Required Lovelace card type |
| `title` | string | `Overview` | Main header title |
| `subtitle` | string | `Main floor` | Optional secondary line |
| `icon` | string | `mdi:view-dashboard` | Optional MDI icon |
| `icon_color` | string | `gold`, `#7cd6ff`, `var(--primary-color)` | Colors the main header icon |
| `entity` | string | `light.kitchen`, `sensor.demo_temperature` | Primary entity for state-aware features |
| `attribute` | string | `temperature`, `humidity` | Optional root attribute for state-aware styling or rules |
| `body_mode` | string | `expand`, `modal`, `fullscreen`, `tabs`, `carousel`, `subview`, `none` | Controls how the body is shown |
| `theme` | string | `glass`, `midnight`, `minimal`, `matrix` | Built-in theme preset |
| `padding` | string | `12px`, `16px`, `1rem` | Shell padding |
| `border_radius` | string | `12px`, `16px`, `var(--ha-card-border-radius)` | Shell border radius |
| `expanded` | boolean | `true`, `false` | Start opened or collapsed |
| `show_state` | boolean | `true`, `false` | Show root entity state in the header |
| `show_expand_icon` | boolean | `true`, `false` | Show expand affordance when relevant |
| `expand_icon` | string | `mdi:chevron-down` | Optional expand icon override |

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

## Header Blocks

### `header`

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `sticky` | boolean | `true`, `false` | Keep header pinned while body scrolls |
| `clickable` | boolean | `true`, `false` | Allow header to trigger default card action behavior |
| `cards` | array | Lovelace card configs | Content slot cards inside the header |
| `layout.variant` | string | `default`, `stacked`, `centered` | Overall header arrangement |
| `layout.gap` | string | `10px`, `18px` | Gap between header regions |
| `layout.content_gap` | string | `2px`, `6px` | Gap inside title/subtitle/content cluster |
| `layout.align` | string | `start`, `center`, `end` | Alignment for title and content cluster |
| `layout.badges_position` | string | `right`, `below_content` | Badge placement in the header |

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

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `cards` | array | `button`, `state-icon`, `markdown` | Utility slots on the sides of the header |

Example:

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

### Common badge fields

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `type` | string | `state`, `attribute`, `counter`, `custom` | Badge source type |
| `entity` | string | `light.kitchen` | Entity used by `state` and `attribute` badges |
| `attribute` | string | `temperature`, `battery_level` | Attribute source for attribute badges or rules |
| `icon` | string | `mdi:lightbulb` | Badge icon |
| `value` | string or number | `Online`, `24` | Displayed value for `custom` badges |
| `label` | string | `Kitchen`, `Temp` | Short badge label |
| `unit` | string | `%`, `°C` | Unit suffix |
| `color` | string | `gold`, `gray`, `var(--warning-color)` | Fixed color override |
| `icon_only` | boolean | `true`, `false` | Show only the icon |
| `show_progress` | boolean | `true`, `false` | Progress visualization where supported |
| `precision` | number | `0`, `1`, `2` | Decimal precision |
| `format` | string | `none`, `time`, `date`, `duration` | Formatting helper for compatible values |
| `tap_action` | object | action config | Action for the full badge |
| `icon_tap_action` | object | action config | Action for the icon only |

### Rule and counter fields

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `thresholds[]` | array | numeric thresholds | Numeric color mapping |
| `visibility[]` | array | rule list | Per-badge show/hide rules |
| `color_rules[]` | array | rule list | Per-badge color rules |
| `entities[]` | array | entity ids | Counter source list |
| `domain` | string | `light`, `switch` | Counter by domain |
| `state` | string | `on`, `off` | Badge state filter |
| `count_state` | string | `on`, `home` | Counter matches this state |

Supported badge operators:

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

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

## Body Content

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `body.cards` | array | Lovelace card configs | Main card content |

Example:

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

### Grid fields

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `columns` | number or string | `2`, `3`, `"1.4fr 0.8fr 1fr"` | Column count or CSS template string |
| `gap` | string | `12px`, `1rem` | Shared grid gap |
| `row_gap` | string | `10px` | Vertical gap |
| `column_gap` | string | `14px` | Horizontal gap |
| `align_items` | string | `start`, `center`, `stretch` | Align items within cells |
| `justify_items` | string | `start`, `center`, `stretch` | Horizontal item alignment |
| `place_items` | string | `center`, `stretch` | Combined alignment shortcut |
| `auto_flow` | string | `row`, `column`, `dense` | Grid filling direction |
| `dense` | boolean | `true`, `false` | Pack gaps more aggressively |

### Card-level grid helpers

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `colspan` | number | `2`, `3` | Span across columns |
| `rowspan` | number | `2` | Span across rows |

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

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `width` | string | `auto`, `80vw`, `42rem` | Modal width |
| `height` | string | `auto`, `70vh` | Modal height |
| `max_width` | string | `72rem`, `90vw` | Width cap |
| `max_height` | string | `85vh`, `90vh` | Height cap |
| `loading_strategy` | string | `lazy`, `preload` | Modal content loading mode |
| `backdrop_blur` | boolean | `true`, `false` | Blur the page behind the modal |
| `backdrop_color` | string | `rgba(0,0,0,.6)` | Overlay color |
| `close_on_backdrop` | boolean | `true`, `false` | Close on click outside |
| `close_on_escape` | boolean | `true`, `false` | Close on `Escape` |
| `show_close` | boolean | `true`, `false` | Show close button |

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

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `width` | string | `92vw`, `100%` | Fullscreen dialog width |
| `height` | string | `90vh`, `100%` | Fullscreen dialog height |
| `max_width` | string | `96rem` | Width cap |
| `max_height` | string | `94vh`, `100vh` | Height cap |
| `padding` | string | `20px`, `1rem` | Inner spacing |
| `background` | string | `var(--lovelace-background-color)` | Overlay surface color |
| `show_close` | boolean | `true`, `false` | Show close button |
| `close_on_escape` | boolean | `true`, `false` | Close on `Escape` |

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

### `tabs[]`

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `label` | string | `Climate`, `Security` | Tab label |
| `icon` | string | `mdi:home-thermometer` | Tab icon |
| `cards` | array | Lovelace card configs | Cards inside the tab |

### `tabs_config`

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `position` | string | `top` | Tab bar position |
| `show_icons` | boolean | `true`, `false` | Show tab icons |
| `show_labels` | boolean | `true`, `false` | Show tab labels |
| `content_padding` | string | `12px`, `16px` | Padding around tab content |
| `tab_min_width` | string | `96px`, `8rem` | Minimum tab width |
| `tab_alignment` | string | `start`, `center`, `stretch` | Tab bar alignment |

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

### Root carousel timing fields

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `carousel_autoplay` | boolean | `true`, `false` | Auto-advance slides |
| `carousel_interval` | number | `4000`, `5000` | Slide interval in ms |

### `carousel_options`

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `show_arrows` | boolean | `true`, `false` | Show previous/next arrows |
| `show_indicators` | boolean | `true`, `false` | Show slide indicators |
| `loop` | boolean | `true`, `false` | Wrap around at ends |
| `swipe_threshold` | number | `50`, `80` | Swipe distance threshold |
| `height` | string | `20rem`, `320px` | Fixed slide height |

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

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `path` | string | `/lovelace/details` | Route path |
| `navigation_path` | string | `/lovelace/details` | Navigation target |
| `replace_state` | boolean | `true`, `false` | Replace history entry |
| `return_on_close` | boolean | `true`, `false` | Return when closing |

Example:

```yaml
body_mode: subview
subview:
  navigation_path: /lovelace/details
  return_on_close: true
```

## Footer Blocks

### `footer`

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `text` | string | `Last update 2 min ago` | Footer copy |
| `icon` | string | `mdi:clock-outline` | Footer icon |
| `cards` | array | Lovelace card configs | Footer slot cards |
| `actions[]` | array | footer action objects | Secondary actions row |
| `tap_action` | object | action config | Footer tap behavior |
| `hold_action` | object | action config | Footer hold behavior |

### `footer_left` and `footer_right`

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `cards` | array | `button`, `markdown` | Side slot cards for the footer |

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
footer_left:
  cards:
    - type: button
      icon: mdi:skip-previous
footer_right:
  cards:
    - type: button
      icon: mdi:skip-next
```

## Root Actions

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `tap_action` | object | action config | Triggered on tap |
| `hold_action` | object | action config | Triggered on hold |
| `double_tap_action` | object | action config | Triggered on double tap |

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

## Context Menu

### `context_menu.items[]`

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `label` | string | `Open details` | Menu item label |
| `icon` | string | `mdi:open-in-new` | Optional icon |
| `separator` | boolean | `true`, `false` | Divider row |
| `action` | object | action config | Menu item action |

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

### Root and section visibility

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `visibility[]` | array | condition list | Controls whole-card visibility |
| `section_visibility.header` | array | condition list | Controls only the header |
| `section_visibility.body` | array | condition list | Controls only the body |
| `section_visibility.footer` | array | condition list | Controls only the footer |

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

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `enabled` | boolean | `true`, `false` | Enable gestures |
| `direction` | string | `horizontal`, `vertical`, `both` | Allowed swipe direction |
| `threshold` | number | `50`, `60` | Swipe distance threshold |
| `velocityThreshold` | number | `0.3`, `0.35` | Swipe speed threshold |
| `preventScroll` | boolean | `true`, `false` | Prevent native scroll while swiping |
| `left`, `right`, `up`, `down` | object | directional action config | Swipe actions |

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

## Styling Blocks

### Theme and tokens

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `theme` | string | `glass`, `midnight`, `minimal` | Built-in visual preset |
| `icon_color` | string | `gold`, `#7cd6ff` | Main icon color |
| `theme_tokens` | object | CSS variable map | Theme overrides |

Example:

```yaml
theme: midnight
icon_color: '#7cd6ff'
theme_tokens:
  --uc-background-color: "linear-gradient(145deg, rgba(9,16,27,.96), rgba(23,42,59,.92))"
  --uc-border-color: "rgba(117, 204, 255, 0.36)"
  --uc-text-color: "#f8fbff"
```

### `state_styles`

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| state key | object | `'on'`, `'off'`, numeric matchers | Style override keyed by state |

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

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| string form | string | CSS text | Fastest for one scoped block |
| `scope` | string | `card`, `header`, `body`, `footer`, `global` | Target area |
| `css` | string | CSS text | CSS rules |
| `mode` | string | append/replace style semantics | Advanced use |
| `priority` | number | `0`, `10` | Ordering helper |

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

## Runtime and Loading

| Field | Type | Typical values | Notes |
| --- | --- | --- | --- |
| `lazy_load` | boolean | `true`, `false` | Enable inline lazy loading |
| `lazy_initial_batch` | number | `1`, `2`, `4` | Initial body cards loaded |
| `lazy_batch_size` | number | `1`, `2`, `4` | Deferred batch size |
| `lazy_idle_timeout` | number | `120`, `180`, `800` | Idle timeout in ms |
| `skeleton_count` | number | `2`, `3` | Placeholder count |
| `stability_mode` | boolean | `true`, `false` | Conservative behavior mode |
| `remember_expanded_state` | boolean | `true`, `false` | Persist expanded state |
| `remember_mode_state` | boolean | `true`, `false` | Persist active tab or slide |
| `enable_card_pool` | boolean | `true`, `false` | Reuse detached cards |
| `pool_scope` | string | `card`, `dashboard`, `global` | Pooling scope |
| `pool_ttl_ms` | number | `600000` | Pool lifetime in ms |
| `pool_max_entries` | number | `8`, `32` | Pool capacity |

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

## Recommended Reading Order

1. [Configuration]({{ '/configuration/' | relative_url }})
2. [Examples Gallery]({{ '/examples/' | relative_url }})
3. The focused feature page for the area you are tuning
