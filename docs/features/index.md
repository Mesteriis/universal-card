---
title: Feature Map
description: Complete capability overview for layouts, body modes, badges, actions, themes, visibility, footer, and editor support.
section_label: Features
permalink: /features/
---

# Feature Map

This page is the public capability map for the GitHub Pages documentation.
It explains what the card can do, where to find the detailed docs, and which parts are better demonstrated in screenshots or YAML examples.

<div class="docs-callout">
  <strong>Scope note.</strong> The Pages site is static. Where live Lovelace rendering is not feasible on GitHub Pages, the docs use screenshots and GIFs captured from real card renders and pair them with exact YAML.
</div>

## Core capability areas

<div class="docs-card-grid">
  <a class="docs-card" href="{{ '/features/modal-layout/' | relative_url }}">
    <h3>Modal Layout</h3>
    <p>Responsive and manual sizing, grid behavior, modal spacing, and loading strategy entry points.</p>
  </a>
  <a class="docs-card" href="{{ '/features/body-modes-layout/' | relative_url }}">
    <h3>Body Modes</h3>
    <p>Expand, fullscreen, tabs, carousel, subview, and the shared layout contract behind them.</p>
  </a>
  <a class="docs-card" href="{{ '/features/header-layout/' | relative_url }}">
    <h3>Header Layout</h3>
    <p>Preset-based header arrangements with adjustable spacing, alignment, and badge placement.</p>
  </a>
  <a class="docs-card" href="{{ '/features/badges/' | relative_url }}">
    <h3>Badges</h3>
    <p>State chips with per-badge visibility, color rules, icon-only mode, and badge actions.</p>
  </a>
  <a class="docs-card" href="{{ '/features/loading-strategy/' | relative_url }}">
    <h3>Loading Strategy</h3>
    <p>Safe defaults for lazy loading and optional preload behavior for modal content.</p>
  </a>
  <a class="docs-card" href="{{ '/examples/' | relative_url }}">
    <h3>Examples Gallery</h3>
    <p>Copyable YAML plus rendered screenshots and GIFs for the major feature clusters.</p>
  </a>
</div>

## Feature matrix

| Capability | What it covers | Where to look |
| --- | --- | --- |
| Body modes | `expand`, `modal`, `fullscreen`, `tabs`, `carousel`, `subview`, `none` | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| Grid layout | columns, gaps, spans, alignment, auto-flow | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Header | slot cards, sticky header, clickable header, layout presets | [Header Layout]({{ '/features/header-layout/' | relative_url }}) |
| Badges | state chips, per-badge rules, icon-only mode | [Badges]({{ '/features/badges/' | relative_url }}) |
| Actions | tap, hold, double-tap, badge actions | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Visibility | entity, time, screen, and rule-driven visibility | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Themes | built-in themes plus custom CSS styling hooks | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Footer | footer cards and action zones | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Nested cards | embedding Lovelace cards inside body, header, and footer slots | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Editor | visual editor coverage for the most common fields | [Configuration]({{ '/configuration/' | relative_url }}) |

## Built-in body modes

| Mode | Strength | Current guidance |
| --- | --- | --- |
| `expand` | lightweight inline details | use when the content should stay in flow |
| `modal` | focused overlay content | use for settings, detail panels, and compact dashboards |
| `fullscreen` | large immersive content | use for cameras, maps, or dense admin views |
| `tabs` | grouped content with stable navigation | use when users switch between related clusters |
| `carousel` | sequential content and touch-heavy views | use when one card at a time is the right density |
| `subview` | deep navigation to another Lovelace path | use for route-based drill-down |
| `none` | summary-only headers | use for compact overview cards |

## Other major capabilities

### Grid and nested card composition

- Any supported body mode can render nested Lovelace cards.
- Shared `grid` settings control columns, gaps, spans, alignment, and auto-flow.
- `vertical-stack` and `horizontal-stack` inside body content remain supported.

### Visibility and rules

- The card already supports conditional visibility at the section and badge levels.
- Badge visibility now supports comparison operators instead of boolean-only checks.
- Rules remain deliberately simple and auditable; no heavy template engine is required for common scenarios.

### Actions and interaction

- Root card actions still support tap, hold, and double-tap patterns.
- Badge actions support whole-badge action handling and separate icon action handling.
- Header click hooks remain intact when layout presets change.

### Themes, CSS, and visual tuning

- The card ships with a large built-in theme set.
- Layout density can be tuned through spacing fields in modal, header, tabs, fullscreen, and grid blocks.
- Advanced styling still lives best in YAML when values become too free-form for the editor.

### Editor coverage

The editor now covers the most important user-facing layout knobs:

- modal sizing and loading strategy
- badge visibility and color rules
- fullscreen sizing
- tabs alignment and padding
- carousel controls and height
- subview navigation fields
- header layout presets and spacing

For exact UI coverage and current YAML-only gaps, see the development notes linked from the work summary.

## Recommended reading order

1. [Installation]({{ '/installation/' | relative_url }})
2. [Configuration]({{ '/configuration/' | relative_url }})
3. [Examples Gallery]({{ '/examples/' | relative_url }})
4. Detailed feature docs for the specific mode or header/badge system you want to tune
