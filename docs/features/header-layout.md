# Header Layout

## Overview

The header now supports preset-based layout configuration instead of a single hard-coded arrangement.

Primary runtime files:

- `src/ui/Header.ts`
- `src/styles/header-footer.ts`
- `src/core/config.ts`
- `src/core/UniversalCard.ts`

The current historical layout remains the default preset.

## Config Surface

Header layout is configured under `header.layout`.

Supported fields:

- `variant`
- `gap`
- `content_gap`
- `align`
- `badges_position`

### Variants

Supported values:

- `default`
- `stacked`
- `centered`

Behavior summary:

- `default`: current left/content/right row layout
- `stacked`: control zones stay on top, content moves to a second row
- `centered`: stacked-style layout with centered content alignment

### Alignment

Supported `align` values:

- `start`
- `center`
- `end`

This controls alignment of title, subtitle, content cards, and any badges rendered below content.

### Badges position

Supported values:

- `right`
- `below_content`

`right` keeps badges in the right header zone.

`below_content` moves badges into the content column under title, subtitle, and content slot cards.

## Examples

### Default layout with tighter spacing

```yaml
type: custom:universal-card
title: Living Room
header:
  layout:
    variant: default
    gap: 10px
    content_gap: 2px
```

### Stacked layout with badges below content

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
    entity: light.kitchen
    label: Main
```

### Centered layout for a dashboard hero card

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
```

## Slots And Existing Header Features

The new layout system keeps existing header features intact:

- left slot cards still render in `header_left`
- right slot cards still render in `header_right`
- content slot cards still render in `header.cards`
- expand icon behavior is unchanged
- badge actions and visibility rules are unchanged

## Limitations

- header layout uses presets, not arbitrary free-form element ordering
- `centered` is intentionally opinionated and does not expose every possible alignment combination
- slot placement remains tied to left/content/right regions; only badges can move between right and below-content positions in this stage
- a full drag-and-drop header builder is intentionally out of scope for now

## Rationale

A preset-based system fits the current architecture better than a free-form layout engine:

- smaller API surface
- easier editor integration
- easier regression testing
- preserves current DOM/event behavior with minimal change

## Compatibility Notes

- if `header.layout` is omitted, the runtime uses the existing default header arrangement
- existing badges, slot cards, and header actions continue to work without changes
- no existing header field was removed in this stage
