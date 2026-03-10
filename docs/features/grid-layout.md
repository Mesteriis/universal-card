---
title: Grid Layout
description: How to build single-column, multi-column, and mixed-span card layouts with grid, colspan, and rowspan.
section_label: Features
permalink: /features/grid-layout/
---

# Grid Layout

Grid is the main layout tool for inline body content, modal content, fullscreen content, and tab panels.

Use it when the card should contain more than one nested Lovelace card and the visual rhythm matters.

## Core fields

| Field | Purpose |
| --- | --- |
| `grid.columns` | number of columns or a raw CSS template string |
| `grid.gap` | shared gap between items |
| `grid.row_gap` | vertical gap |
| `grid.column_gap` | horizontal gap |
| `colspan` | make one nested card span multiple columns |
| `rowspan` | make one nested card span multiple rows |

## Simple two-column layout

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Compact summary layout with two balanced columns.</p>
    <img class="docs-showcase__media" src="{{ '/img/grid-layout-basic-dark.png' | relative_url }}" alt="Two-column grid screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Energy Grid
grid:
  columns: 2
  gap: 12px
body:
  cards:
    - type: gauge
      entity: sensor.demo_temperature
    - type: gauge
      entity: sensor.demo_humidity
    - type: entities
      colspan: 2
      entities:
        - entity: sensor.security_status
        - entity: sensor.network_health_sensor</code></pre>
  </div>
</div>

## Mixed template columns

Use a string for `grid.columns` when equal-width columns are not enough.

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Mixed column sizing with hero spans and denser card composition.</p>
    <img class="docs-showcase__media" src="{{ '/img/grid-layout-advanced-dark.png' | relative_url }}" alt="Advanced grid screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Advanced Grid
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
        - entity: sensor.network_health_sensor</code></pre>
  </div>
</div>

## Where grid is used

Grid rules apply in these areas:

- regular `expand` body content
- `modal` body content
- `fullscreen` body content
- each tab panel in `tabs`

That means one grid model can be reused across several body modes.

## Practical guidance

Use these rules if you want predictable results:

1. start with numeric `columns` before switching to a raw CSS string
2. use `colspan` for hero cards and summaries
3. use `rowspan` only when the height difference is intentional
4. keep modal and mobile layouts simpler than desktop dashboards
5. prefer a `vertical-stack` inside one grid cell over very aggressive grid templates

## Mobile guidance

Multi-column layouts are useful, but mobile screens expose bad spacing quickly.

Prefer:

- `columns: 1` or `columns: 2`
- moderate `gap` values such as `8px` to `14px`
- fewer wide spans

Be careful with:

- very custom template strings
- many nested cards with different intrinsic heights
- dashboard designs that depend on exact pixel-perfect row balance

## Related Docs

- [Examples Gallery]({{ '/examples/' | relative_url }})
- [Modal Layout]({{ '/features/modal-layout/' | relative_url }})
- [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
