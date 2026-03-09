# Badges

## Overview

Badges are rendered in the card header and can show entity state, attributes, counters, or static values.

Primary runtime files:

- `src/ui/Header.ts`
- `src/ui/badge-rules.ts`
- `src/core/config-contracts.ts`
- `src/core/config.ts`

Supported badge types:

- `state`
- `attribute`
- `counter`
- `custom`

## Core fields

Common badge fields:

- `type`
- `entity`
- `attribute`
- `icon`
- `value`
- `label`
- `unit`
- `color`
- `thresholds`
- `tap_action`
- `icon_tap_action`
- `icon_only`
- `visibility`
- `color_rules`

## Visibility rules

Each badge can have its own `visibility` rule list.

Format:

```yaml
badges:
  - type: state
    entity: light.kitchen
    icon: mdi:lightbulb
    visibility:
      - operator: ==
        value: on
```

Behavior:

- rules are evaluated with logical `AND`
- if any rule fails, the badge is hidden
- if no visibility rules are defined, the badge is visible
- by default, rules compare against the badge's own resolved value
- a rule can override the source value with its own `entity` and optional `attribute`

## Comparison operators

Supported operators in this stage:

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

Comparison behavior:

- numeric-looking values are compared as numbers
- boolean values and `true` / `false` strings are compared as booleans
- everything else is compared as strings

The rule shape is intentionally designed to be extended later with operators such as `in`, `not_in`, `contains`, and `matches`, but those operators are not implemented in this stage.

## Color rules

`color_rules` provide rule-based badge colors without requiring a template engine.

Example:

```yaml
badges:
  - type: state
    entity: light.kitchen
    icon: mdi:lightbulb
    color_rules:
      - operator: ==
        value: on
        color: var(--warning-color)
      - operator: ==
        value: off
        color: var(--secondary-text-color)
      - operator: ==
        value: unavailable
        color: var(--error-color)
```

Color precedence:

1. `color`
2. first matching rule from `color_rules`
3. existing automatic state color / numeric threshold fallback
4. `var(--primary-color)`

This preserves backward compatibility for existing badges that already use `color` or `thresholds`.

## Icon-only mode

Set `icon_only: true` to render only the icon when the badge has an icon.

Example:

```yaml
badges:
  - type: state
    entity: light.kitchen
    icon: mdi:lightbulb
    icon_only: true
    color_rules:
      - operator: ==
        value: on
        color: gold
```

Notes:

- icon-only mode hides label, value, unit, and progress bar
- if no icon is provided, the badge falls back to normal text rendering instead of becoming empty

## Tap actions

Two action levels are available:

- `tap_action`: click anywhere on the badge body
- `icon_tap_action`: click only the icon area

Example:

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

Behavior:

- when `icon_tap_action` is configured, clicking the icon runs that action instead of the badge body action
- when `icon_tap_action` is not configured, clicking the icon behaves like a normal badge click
- if the badge has an `entity` and the action does not specify one, the badge entity is used automatically

## Examples

### Visibility on badge value

```yaml
badges:
  - type: custom
    icon: mdi:thermometer
    value: 24
    unit: °C
    visibility:
      - operator: >=
        value: 20
```

### Visibility based on another entity

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

### Counter badge with color rules

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

### Icon-only badge with separate icon action

```yaml
badges:
  - type: state
    entity: vacuum.robot
    icon: mdi:robot-vacuum
    icon_only: true
    tap_action:
      action: call-service
      service: vacuum.start
      entity: vacuum.robot
    icon_tap_action:
      action: more-info
```

## Limitations

- rule arrays currently use implicit `AND`; nested logical groups are not supported for badges in this stage
- future operators `in`, `not_in`, `contains`, and `matches` are planned but not yet available
- badge rules currently live in YAML/runtime first; full editor coverage is added separately
- the active runtime path is the header badge renderer in `src/ui/Header.ts`

## Compatibility notes

Existing badge configs continue to work:

- `color` still has the highest priority
- `thresholds` still work as before when `color` and `color_rules` do not override them
- `tap_action` still works on the whole badge
- new fields are additive and do not replace legacy badge fields
