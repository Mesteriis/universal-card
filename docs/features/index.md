---
title: Feature Map
description: Complete public capability map for Universal Card, including rendered examples, behavior-only surfaces, editor coverage, and advanced runtime hooks.
section_label: Features
permalink: /features/
---

# Feature Map

This page is the public map of the Universal Card feature surface.
It answers three things:

1. what the card supports
2. where that capability is documented
3. whether that capability is covered by screenshots, YAML examples, or behavior notes

<div class="docs-callout">
  <strong>Static-site constraint.</strong> GitHub Pages cannot boot a real Lovelace runtime. For visual features, the docs therefore use real dark-theme captures produced from a local Home Assistant fixture. For behavior-first features, the docs use exact YAML and explicit guidance instead of fake previews.
</div>

## Primary docs

<div class="docs-card-grid">
  <a class="docs-card" href="{{ '/features/capability-reference/' | relative_url }}">
    <h3>Capability Reference</h3>
    <p>Complete public inventory across layout, styling, interaction, runtime, editor, and platform API surfaces.</p>
  </a>
  <a class="docs-card" href="{{ '/examples/' | relative_url }}">
    <h3>Examples Gallery</h3>
    <p>Production-ready screenshots and GIFs paired with copyable YAML for every major visual cluster.</p>
  </a>
  <a class="docs-card" href="{{ '/features/modal-layout/' | relative_url }}">
    <h3>Modal Layout</h3>
    <p>Responsive modal sizing, overlay density, grid behavior, and loading strategy.</p>
  </a>
  <a class="docs-card" href="{{ '/features/body-modes-layout/' | relative_url }}">
    <h3>Body Modes Layout</h3>
    <p>Expand, fullscreen, tabs, carousel, subview, and the shared contracts behind them.</p>
  </a>
  <a class="docs-card" href="{{ '/features/header-layout/' | relative_url }}">
    <h3>Header Layout</h3>
    <p>Preset-based header arrangement, spacing, alignment, and badge placement.</p>
  </a>
  <a class="docs-card" href="{{ '/features/badges/' | relative_url }}">
    <h3>Badges</h3>
    <p>Per-badge rules, icon-only mode, color mapping, and badge action behavior.</p>
  </a>
  <a class="docs-card" href="{{ '/features/loading-strategy/' | relative_url }}">
    <h3>Loading Strategy</h3>
    <p>Lazy versus preload behavior and safe defaults for performance-sensitive dashboards.</p>
  </a>
  <a class="docs-card" href="{{ '/features/editor/' | relative_url }}">
    <h3>Editor</h3>
    <p>Visual editor coverage, section layout, and where YAML remains the better surface.</p>
  </a>
</div>

## Coverage matrix

| Area | Coverage | Best entry point |
| --- | --- | --- |
| Core card shell | screenshot + YAML | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Body modes | screenshot/GIF + YAML | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| Modal sizing and loading | GIF + YAML + guidance | [Modal Layout]({{ '/features/modal-layout/' | relative_url }}) |
| Grid composition | screenshot + YAML | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Header layout | screenshot + YAML | [Header Layout]({{ '/features/header-layout/' | relative_url }}) |
| Badges | screenshot + YAML | [Badges]({{ '/features/badges/' | relative_url }}) |
| Footer | screenshot + YAML | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Root actions | YAML + render context | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Context menu and swipe | YAML + behavior note | [Capability Reference]({{ '/features/capability-reference/' | relative_url }}) |
| Visibility and section visibility | YAML + render context | [Capability Reference]({{ '/features/capability-reference/' | relative_url }}) |
| Themes, tokens, state styles, custom CSS | screenshot + YAML | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Loading, persistence, pooling, stability | YAML + behavior note | [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }}) |
| Editor | screenshot + coverage map | [Editor]({{ '/features/editor/' | relative_url }}) |
| Platform API and plugin hooks | reference note | [Capability Reference]({{ '/features/capability-reference/' | relative_url }}) |

## Major capability areas

### Layout and surfaces

- 7 body modes: `expand`, `modal`, `fullscreen`, `tabs`, `carousel`, `subview`, `none`
- shared `grid` contract with spans and mixed column definitions
- nested Lovelace cards in body, header, and footer regions
- footer cards and footer action zones

### Interaction and rules

- top-level tap, hold, and double-tap actions
- badge actions and icon-specific badge actions
- root visibility and per-section visibility
- swipe gesture runtime with directional actions
- optional context menu surface

### Styling and themes

- broad built-in theme set
- `icon_color`
- `theme_tokens`
- `state_styles`
- scoped `custom_css`
- header, tabs, fullscreen, modal, and grid spacing controls

### Runtime and performance

- inline `lazy_load`
- modal `loading_strategy`
- persistence via `remember_expanded_state` and `remember_mode_state`
- card pooling knobs
- `stability_mode`
- animation timing and stagger controls

### Editor and tooling

- schema-driven visual editor
- nested rule builders for visibility and badge rules
- typed swipe and layout controls
- public runtime namespace for config helpers, loaders, plugins, and devtools

## Recommended reading order

1. [Installation]({{ '/installation/' | relative_url }})
2. [Configuration]({{ '/configuration/' | relative_url }})
3. [Examples Gallery]({{ '/examples/' | relative_url }})
4. [Capability Reference]({{ '/features/capability-reference/' | relative_url }})
5. The specific feature page for the part of the card you want to tune
