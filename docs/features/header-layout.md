---
title: Header Layout
description: Header variants, spacing, alignment, slot usage, and badge placement.
section_label: Features
permalink: /features/header-layout/
---

# Header Layout

The header can stay compact, stack into rows, or center itself for hero-style cards.
All header layout settings live under `header.layout`.

## Main fields

| Field | Purpose |
| --- | --- |
| `variant` | overall header arrangement |
| `gap` | spacing between header regions |
| `content_gap` | spacing between title, subtitle, content cards, and badges |
| `align` | text and content alignment |
| `badges_position` | keep badges on the right or move them below content |

## Variants

### `default`

Best for regular dashboard cards with title, subtitle, icon, and badges in one row.

### `stacked`

Best when the header is getting dense and badges need more room.

### `centered`

Best for hero cards, status cards, and cards with fewer controls but stronger visual emphasis.

## Alignment values

Supported values:

- `start`
- `center`
- `end`

## Badge placement

Supported values:

- `right`
- `below_content`

Use `below_content` when badges are part of the main header story instead of a side utility area.

## Examples

### Compact default header

```yaml
type: custom:universal-card
title: Living Room
subtitle: Lights and comfort
header:
  layout:
    variant: default
    gap: 10px
    content_gap: 2px
```

### Stacked header with badges under the title

```yaml
type: custom:universal-card
title: Kitchen
subtitle: Lights and scenes
header:
  layout:
    variant: stacked
    gap: 18px
    content_gap: 6px
    badges_position: below_content
badges:
  - type: state
    entity: input_boolean.kitchen_light
    label: Main
```

### Centered hero header

```yaml
type: custom:universal-card
title: Climate
subtitle: Main floor
icon: mdi:home-thermometer
header:
  layout:
    variant: centered
    align: center
    badges_position: below_content
badges:
  - type: attribute
    entity: weather.home
    attribute: temperature
    icon: mdi:thermometer
    unit: °C
```

## Slot usage

These layout options work together with the existing header slots:

- `header_left.cards`
- `header.cards`
- `header_right.cards`

That means you can still place supporting controls in the side slots while changing the main title/badge arrangement.

## Editor coverage

The visual editor covers the full header layout group:

- `header.sticky`
- `header.clickable`
- `header.layout.variant`
- `header.layout.gap`
- `header.layout.content_gap`
- `header.layout.align`
- `header.layout.badges_position`

## When YAML is still better

YAML remains better if you want:

- very custom slot-card combinations
- highly tuned spacing across nested header cards
- a card design that uses header slots as part of a larger visual composition
