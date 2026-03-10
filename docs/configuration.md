---
title: Configuration
description: Core YAML structure, config anatomy, and the shortest path from a minimal card to the full Universal Card feature surface.
section_label: Configuration
permalink: /configuration/
---

# Configuration

`Universal Card` is a frontend-only Lovelace custom card.
The configuration surface is intentionally layered: start with the shell, then choose a body mode, then add layout, rules, styling, and runtime knobs only where they solve a real need.

## Core anatomy

A typical card is built from these layers:

| Layer | Purpose |
| --- | --- |
| root fields | title, subtitle, icon, entity, theme, actions, expansion state, runtime flags |
| `header` | slot cards, sticky/clickable behavior, layout presets |
| `badges` | state chips with thresholds, visibility rules, color rules, and actions |
| `body` | nested Lovelace cards |
| `body_mode` | how the body is opened and laid out |
| `grid` | shared column and spacing rules for nested cards |
| `footer` | supporting cards and action zones |
| feature surfaces | visibility, swipe, state styles, theme tokens, custom CSS, loading |

## Minimal example

```yaml
type: custom:universal-card
title: Example
body:
  cards:
    - type: markdown
      content: Hello
```

## Recommended build path

1. Set `title`, `icon`, optional `entity`, and `body.cards`.
2. Pick a `body_mode` based on how content should open.
3. Add `grid` when the body needs structure.
4. Add `header.layout` and `badges` when the header becomes dense.
5. Add actions, visibility, and styling once the structure is stable.
6. Add runtime tuning only if you have a concrete performance or UX reason.

## Body mode map

| Mode | Best for | Main docs |
| --- | --- | --- |
| `expand` | inline drill-down | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `modal` | focused detail dialogs | [Modal Layout]({{ '/features/modal-layout/' | relative_url }}) |
| `fullscreen` | immersive dashboards and cameras | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `tabs` | grouped content | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `carousel` | sequential cards and quick swipes | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `subview` | navigation to a separate Lovelace view | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `none` | header-only cards | [Capability Reference]({{ '/features/capability-reference/' | relative_url }}) |

## Major config families

### Layout and composition

- root shell fields
- `body_mode`
- `body.cards`
- `grid.*`
- `tabs[]`, `tabs_config.*`
- `carousel_autoplay`, `carousel_interval`, `carousel_options.*`
- `modal.*`, `fullscreen.*`, `subview.*`
- `header.*`, `header_left.*`, `header_right.*`
- `footer.*`

### Rules and interaction

- root `tap_action`, `hold_action`, `double_tap_action`
- `badges[]` including `visibility` and `color_rules`
- root `visibility`
- `section_visibility`
- `swipe.*`
- `context_menu.*`

### Styling and runtime

- `theme`
- `icon_color`
- `theme_tokens`
- `state_styles`
- `custom_css`
- `lazy_load`
- `modal.loading_strategy`
- persistence, pooling, animation, and stability fields

## Docs map for the full surface

<div class="docs-link-grid">
  <a class="docs-link-card" href="{{ '/features/capability-reference/' | relative_url }}">
    <h3>Capability Reference</h3>
    <p>The complete public inventory across layout, styling, interactions, runtime, editor, and platform API surfaces.</p>
  </a>
  <a class="docs-link-card" href="{{ '/examples/' | relative_url }}">
    <h3>Examples Gallery</h3>
    <p>Dark-theme screenshots and GIFs captured from a real Home Assistant fixture, paired with exact YAML.</p>
  </a>
  <a class="docs-link-card" href="{{ '/features/editor/' | relative_url }}">
    <h3>Editor</h3>
    <p>Visual editor coverage, section breakdown, and where YAML remains the better tool.</p>
  </a>
  <a class="docs-link-card" href="{{ '/development/upgrade-notes/' | relative_url }}">
    <h3>Upgrade Notes</h3>
    <p>New fields and behavior changes grouped by implementation stage.</p>
  </a>
</div>

## Repository map

- production source: `src/`
- tests and fixtures: `tests/`
- production bundles: `universal-card.js`, `lazy/*.js`
- docs site: `docs/`
- release automation: `.github/workflows/`

## Next steps

- [Installation]({{ '/installation/' | relative_url }}) if the resource is not loaded yet
- [Examples Gallery]({{ '/examples/' | relative_url }}) if you want starting YAML and real renders
- [Capability Reference]({{ '/features/capability-reference/' | relative_url }}) when you need the full public inventory
