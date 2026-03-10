---
title: Feature Map
description: User-facing map of the Universal Card feature surface, with links to examples and focused guides.
section_label: Features
permalink: /features/
---

# Feature Map

This page answers three practical questions:

1. what the card can do
2. where to find an example
3. where to find the focused guide for that area

<div class="docs-callout">
  <strong>Preview model.</strong> GitHub Pages is static, so visual examples use real Home Assistant captures instead of simulated renders.
</div>

## Primary docs

<div class="docs-card-grid">
  <a class="docs-card" href="{{ '/examples/' | relative_url }}">
    <h3>Examples Gallery</h3>
    <p>Copyable YAML for every major visual and behavioral area of the card.</p>
  </a>
  <a class="docs-card" href="{{ '/configuration/' | relative_url }}">
    <h3>Configuration</h3>
    <p>Start here for structure, starter templates, and field groups.</p>
  </a>
  <a class="docs-card" href="{{ '/features/yaml-block-reference/' | relative_url }}">
    <h3>YAML Block Reference</h3>
    <p>Block-by-block reference for root fields, badges, body mode blocks, styling, actions, and runtime settings.</p>
  </a>
  <a class="docs-card" href="{{ '/features/recipes-by-use-case/' | relative_url }}">
    <h3>Recipes by Use Case</h3>
    <p>Starter configurations grouped by real dashboard needs such as climate, security, media, wall panels, and admin tools.</p>
  </a>
  <a class="docs-card" href="{{ '/features/modal-layout/' | relative_url }}">
    <h3>Modal Layout</h3>
    <p>Overlay sizing, spacing, mobile behavior, and modal-specific loading.</p>
  </a>
  <a class="docs-card" href="{{ '/features/body-modes-layout/' | relative_url }}">
    <h3>Body Modes Layout</h3>
    <p>Expand, fullscreen, tabs, carousel, subview, and header-only cards.</p>
  </a>
  <a class="docs-card" href="{{ '/features/header-layout/' | relative_url }}">
    <h3>Header Layout</h3>
    <p>Header variants, spacing, alignment, slot usage, and badge placement.</p>
  </a>
  <a class="docs-card" href="{{ '/features/badges/' | relative_url }}">
    <h3>Badges</h3>
    <p>Badge types, visibility rules, color rules, icon-only mode, and actions.</p>
  </a>
  <a class="docs-card" href="{{ '/features/loading-strategy/' | relative_url }}">
    <h3>Loading Strategy</h3>
    <p>When to use lazy loading, preload, and runtime-safety settings.</p>
  </a>
  <a class="docs-card" href="{{ '/features/editor/' | relative_url }}">
    <h3>Editor</h3>
    <p>Visual editor coverage, best-fit workflows, and YAML-first areas.</p>
  </a>
</div>

## Coverage map

| Area | Best entry point |
| --- | --- |
| Basic card setup | [Configuration]({{ '/configuration/' | relative_url }}) |
| Ready-to-copy YAML | [Examples Gallery]({{ '/examples/' | relative_url }}) |
| Block-by-block field lookup | [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }}) |
| Room or dashboard scenario recipes | [Recipes by Use Case]({{ '/features/recipes-by-use-case/' | relative_url }}) |
| Modal overlays | [Modal Layout]({{ '/features/modal-layout/' | relative_url }}) |
| Fullscreen, tabs, carousel, subview | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| Header arrangement | [Header Layout]({{ '/features/header-layout/' | relative_url }}) |
| Badge rules and icon-only mode | [Badges]({{ '/features/badges/' | relative_url }}) |
| Performance and loading | [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }}) |
| Visual editor | [Editor]({{ '/features/editor/' | relative_url }}) |
| Release highlights | [Release Notes]({{ '/release-notes/' | relative_url }}) |

## Main capability groups

### Layout

- 7 body modes: `expand`, `modal`, `fullscreen`, `tabs`, `carousel`, `subview`, `none`
- shared `grid` layout with card spans
- nested Lovelace cards in header, body, and footer
- configurable header variants and badge placement

### Rules and interaction

- tap, hold, and double-tap actions
- badge-level actions
- root and section visibility
- swipe gestures
- optional context menus

### Styling

- built-in themes
- `icon_color`
- `theme_tokens`
- `state_styles`
- `custom_css`
- spacing and sizing controls for body modes and header layouts

### Runtime and editor

- inline lazy loading
- modal `lazy` vs `preload`
- persistence and stability controls
- visual editor with mode-aware settings and nested rule builders
