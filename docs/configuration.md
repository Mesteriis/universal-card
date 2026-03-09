---
title: Configuration
description: Core YAML structure, config anatomy, and the shortest path from a minimal card to advanced layouts.
section_label: Configuration
permalink: /configuration/
---

# Configuration

`Universal Card` is a frontend-only Lovelace custom card.

## Core anatomy

A typical card is built from these layers:

| Layer | Purpose |
| --- | --- |
| root fields | title, subtitle, icon, entity, theme, actions, expansion state |
| `header` | slot cards, sticky/clickable behavior, layout presets |
| `badges` | small state chips with rules, colors, and actions |
| `body` | nested Lovelace cards |
| `body_mode` | how the body is opened and laid out |
| `grid` | shared layout rules for nested cards |
| `footer` | action area or supporting cards |

## Minimal example

```yaml
type: custom:universal-card
title: Example
body:
  cards:
    - type: markdown
      content: Hello
```

## Common build path

1. Start with `title`, `icon`, and `body.cards`.
2. Pick `body_mode` based on how content should open.
3. Add `grid` when the body needs columns, gaps, or spans.
4. Add `badges` and `header.layout` when the header needs status and density.
5. Add `theme`, visibility rules, and actions after the structure is stable.

## Body mode map

| Mode | Best for | Main docs |
| --- | --- | --- |
| `expand` | inline drill-down | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `modal` | focused detail dialogs | [Modal Layout]({{ '/features/modal-layout/' | relative_url }}) |
| `fullscreen` | immersive dashboards and cameras | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `tabs` | grouped content | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `carousel` | sequential cards and quick swipes | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `subview` | navigation to a separate Lovelace view | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) |
| `none` | header-only cards | [Feature Map]({{ '/features/' | relative_url }}) |

## Detailed capability map

<div class="docs-link-grid">
  <a class="docs-link-card" href="{{ '/features/' | relative_url }}">
    <h3>Feature Map</h3>
    <p>Full capability overview: layout, actions, visibility, themes, footer, and editor coverage.</p>
  </a>
  <a class="docs-link-card" href="{{ '/examples/' | relative_url }}">
    <h3>Examples Gallery</h3>
    <p>Preview screenshots and GIFs paired with YAML that can be copied into Lovelace.</p>
  </a>
  <a class="docs-link-card" href="{{ '/development/upgrade-notes/' | relative_url }}">
    <h3>Upgrade Notes</h3>
    <p>New fields and behavior changes grouped by implementation stage.</p>
  </a>
</div>

## Configuration files in this repository

- Production source: `src/`
- Tests: `tests/`
- Bundles: `universal-card.js`, `lazy/*.js`
- Release automation: `.github/workflows/release.yml`

## Next steps

- [Install the card]({{ '/installation/' | relative_url }}) if it is not loaded yet.
- [Open the feature map]({{ '/features/' | relative_url }}) for a capability-by-capability guide.
- [Open examples]({{ '/examples/' | relative_url }}) when you want starting YAML for real dashboards.
