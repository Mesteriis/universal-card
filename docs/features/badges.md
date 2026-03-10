---
title: Badges
description: Badge types, visibility rules, comparison operators, color rules, icon-only rendering, and actions.
section_label: Features
permalink: /features/badges/
---

# Badges

Badges live in the header and are ideal for compact status, counters, quick actions, and visual state indicators.

## Badge types

Supported types:

- `state`
- `attribute`
- `counter`
- `custom`

## Common fields

| Field | Purpose |
| --- | --- |
| `icon` | badge icon |
| `value` | displayed value |
| `label` | short label |
| `unit` | unit suffix |
| `color` | fixed badge color |
| `thresholds` | numeric color mapping |
| `visibility` | show or hide the badge based on rules |
| `color_rules` | set color from rules |
| `icon_only` | hide label and value, keep icon only |
| `tap_action` | action for the whole badge |
| `icon_tap_action` | action for the icon only |

## Visibility rules

Each badge can decide for itself whether it should render.
Rules are evaluated with logical `AND`.

```yaml
badges:
  - type: state
    entity: light.kitchen
    icon: mdi:lightbulb
    visibility:
      - operator: ==
        value: on
```

A rule can compare against:

- the badge's own resolved value
- another `entity`
- another entity `attribute`

## Supported operators

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

Use cases:

- compare `on` / `off`
- compare string states such as `home`, `away`, `unavailable`
- compare numeric sensor values

## Color rules

Use `color_rules` when the color should follow state.

```yaml
badges:
  - type: state
    entity: light.kitchen
    icon: mdi:lightbulb
    color_rules:
      - operator: ==
        value: 'on'
        color: var(--warning-color)
      - operator: ==
        value: 'off'
        color: var(--secondary-text-color)
      - operator: ==
        value: unavailable
        color: var(--error-color)
```

Typical patterns:

- active = yellow
- inactive = gray
- unavailable = red

## Icon-only mode

`icon_only: true` keeps the badge compact and works well for dense dashboards.

```yaml
badges:
  - type: state
    entity: vacuum.robot
    icon: mdi:robot-vacuum
    icon_only: true
    color_rules:
      - operator: ==
        value: cleaning
        color: deepskyblue
```

## Badge actions

You can add actions at two levels:

- `tap_action` for the full badge
- `icon_tap_action` for the icon only

```yaml
badges:
  - type: state
    entity: light.kitchen
    icon: mdi:lightbulb
    label: Kitchen
    tap_action:
      action: toggle
    icon_tap_action:
      action: more-info
```

## Example patterns

### Attribute badge

```yaml
badges:
  - type: attribute
    entity: weather.home
    attribute: humidity
    icon: mdi:water-percent
    label: Humidity
    unit: '%'
```

### Counter badge

```yaml
badges:
  - type: counter
    icon: mdi:lightbulb-group
    domain: light
    count_state: on
    label: Lights
    color_rules:
      - operator: ==
        value: 0
        color: gray
      - operator: >
        value: 0
        color: gold
```

### Badge shown only on a separate entity state

```yaml
badges:
  - type: custom
    icon: mdi:door
    label: Patio
    value: Open
    visibility:
      - entity: binary_sensor.patio_door
        operator: ==
        value: on
```

### Compact icon-only badge row

```yaml
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    icon_only: true
  - type: state
    entity: vacuum.robot
    icon: mdi:robot-vacuum
    icon_only: true
  - type: state
    entity: input_boolean.security_armed
    icon: mdi:shield-lock
    icon_only: true
```

## Editor coverage

The visual editor covers:

- common badge fields
- `icon_only`
- `visibility`
- `color_rules`

YAML is still the best fit for:

- `tap_action`
- `icon_tap_action`
- larger hand-tuned badge collections

## Limits

- badge rule lists use `AND`
- future operators such as `in`, `not_in`, `contains`, and `matches` are not available yet
