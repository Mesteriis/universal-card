---
title: Selector Catalog
description: Official CSS hooks and stable selectors you can target with custom_css in Universal Card.
section_label: Features
permalink: /features/selector-catalog/
---

# Selector Catalog

This page lists the supported styling surface for targeted overrides.

For new configs, prefer the stable `data-uc-*` hooks first.
Class selectors are still listed because they are useful, but the `data-uc-*` hooks are the more intentional contract.

## Preferred Hook Pattern

Use selectors like these whenever possible:

- `[data-uc-role="card"]`
- `[data-uc-role="header"]`
- `[data-uc-role="title"]`
- `[data-uc-role="badge"]`
- `[data-uc-role="footer"]`
- `[data-uc-mode="tabs"]`
- `[data-uc-mode="carousel"]`
- `[data-uc-mode="modal"]`
- `[data-uc-mode="fullscreen"]`
- `[data-uc-mode="subview"]`

## Card Shell

| Hook or selector | Area | Purpose |
| --- | --- | --- |
| `[data-uc-role="card"]` | card | Main shell container |
| `.universal-card` | card | Main shell container |
| `[data-uc-role="body"]` | body | Root body element |
| `.header` | header | Root header element |
| `.body` | body | Root body element |
| `[data-uc-role="body-content"]` | body | Inner body content wrapper |
| `.body-content` | body | Inner body content wrapper |
| `[data-uc-role="footer"]` | footer | Root footer element |
| `.footer` | footer | Root footer element |
| `[data-uc-role="card-wrapper"]` | body/modes | Wrapper around nested cards |
| `.card-wrapper` | body/modes | Wrapper around nested cards |

## Header

| Hook or selector | Purpose |
| --- | --- |
| `[data-uc-role="header"]` | Root header element |
| `[data-uc-region="left"]` | Left header zone |
| `.header-left` | Left header zone |
| `[data-uc-role="icon"]` | Main header icon |
| `.header-icon` | Main header icon |
| `[data-uc-slot="left"]` | Left slot cards container |
| `.header-left-slot` | Left slot cards container |
| `[data-uc-region="content"]` | Title/subtitle/content column |
| `.header-content` | Title/subtitle/content column |
| `[data-uc-role="title"]` | Main title text |
| `.header-title` | Main title text |
| `[data-uc-role="subtitle"]` | Subtitle text |
| `.header-subtitle` | Subtitle text |
| `[data-uc-slot="content"]` | Header content slot cards |
| `.header-cards-slot` | Header content slot cards |
| `[data-uc-role="badges"][data-uc-position="right"]` | Right-side badge row |
| `.header-badges` | Right-side badge row |
| `[data-uc-role="badges"][data-uc-position="below-content"]` | Badges rendered below content |
| `.header-content-badges` | Badges rendered below content |
| `[data-uc-region="right"]` | Right header zone |
| `.header-right` | Right header zone |
| `[data-uc-slot="right"]` | Right slot cards container |
| `.header-right-slot` | Right slot cards container |
| `[data-uc-role="expand-icon"]` | Expand/collapse affordance |
| `.expand-icon` | Expand/collapse affordance |

Useful header state selectors:

- `.header.sticky`
- `.header.non-clickable`
- `.header.expanded`
- `.header[data-layout-variant="stacked"]`
- `.header[data-layout-variant="centered"]`
- `.header[data-content-align="center"]`
- `.header[data-content-align="end"]`

## Badges

| Hook or selector | Purpose |
| --- | --- |
| `[data-uc-role="badge"]` | Badge chip root |
| `.badge` | Badge chip root |
| `[data-uc-role="badge"][data-uc-icon-only="true"]` | Icon-only badge variant |
| `.badge.icon-only` | Icon-only badge variant |
| `.badge.clickable` | Clickable badge state |
| `[data-uc-role="badge-icon"]` | Badge icon element |
| `.badge-icon` | Badge icon element |
| `[data-uc-role="badge-icon-action"]` | Icon-only action target |
| `.badge-icon-action` | Icon-only action target |
| `[data-uc-role="badge-label"]` | Badge label |
| `.badge-label` | Badge label |
| `[data-uc-role="badge-value"]` | Badge value |
| `.badge-value` | Badge value |
| `[data-uc-role="badge-unit"]` | Badge unit |
| `.badge-unit` | Badge unit |
| `[data-uc-role="badge-progress"]` | Progress wrapper |
| `.badge-progress` | Progress wrapper |
| `[data-uc-role="badge-progress-bar"]` | Progress fill element |
| `.badge-progress-bar` | Progress fill element |

## Footer

| Hook or selector | Purpose |
| --- | --- |
| `[data-uc-role="footer"]` | Footer root |
| `[data-uc-region="left"]` inside footer | Left footer zone |
| `.footer-left` | Left footer zone |
| `[data-uc-slot="left"]` inside footer | Left footer slot cards |
| `.footer-left-slot` | Left footer slot cards |
| `[data-uc-region="content"]` inside footer | Main footer content column |
| `.footer-content` | Main footer content column |
| `[data-uc-role="text"]` | Footer text row |
| `.footer-text` | Footer text row |
| `[data-uc-slot="content"]` inside footer | Footer content slot cards |
| `.footer-cards-slot` | Footer content slot cards |
| `[data-uc-region="right"]` inside footer | Right footer zone |
| `.footer-right` | Right footer zone |
| `[data-uc-slot="right"]` inside footer | Right footer slot cards |
| `.footer-right-slot` | Right footer slot cards |
| `[data-uc-role="action"]` | Footer action button |
| `.footer-action-btn` | Footer action button |

## Expand And Base Body

| Hook or selector | Purpose |
| --- | --- |
| `.expand-mode` | Expand mode root |
| `.expand-content` | Expand mode content wrapper |
| `.expand-grid` | Expand mode grid container |
| `[data-uc-role="body"][data-uc-mode="expand"]` | Expand body root |
| `.body[data-state="collapsed"]` | Collapsed body state |
| `.body[data-state="expanded"]` | Expanded body state |

## Tabs

| Hook or selector | Purpose |
| --- | --- |
| `[data-uc-mode="tabs"]` | Tabs mode root |
| `.tabs-mode` | Tabs mode root |
| `[data-uc-role="tab-bar"]` | Tab buttons row |
| `.tabs-bar` | Tab buttons row |
| `[data-uc-role="tab"]` | Individual tab button |
| `.tab-button` | Individual tab button |
| `[data-uc-role="tab-label"]` | Tab label text |
| `.tab-label` | Tab label text |
| `[data-uc-role="tab-indicator"]` | Active tab indicator |
| `.tab-indicator` | Active tab indicator |
| `[data-uc-role="content"]` inside tabs mode | Tabs content wrapper |
| `.tabs-content` | Tabs content wrapper |
| `[data-uc-role="tab-panel"]` | One tab panel |
| `.tab-panel` | One tab panel |
| `[data-uc-role="grid"]` inside tabs mode | Grid inside a tab panel |
| `.tab-grid` | Grid inside a tab panel |

Useful tabs state selectors:

- `.tabs-mode[data-tab-position="bottom"]`
- `.tabs-mode[data-tab-alignment="center"]`
- `.tabs-mode[data-tab-alignment="stretch"]`

## Carousel

| Hook or selector | Purpose |
| --- | --- |
| `[data-uc-mode="carousel"]` | Carousel root |
| `.carousel-mode` | Carousel root |
| `[data-uc-role="viewport"]` | Viewport wrapper |
| `.carousel-viewport` | Viewport wrapper |
| `[data-uc-role="track-wrapper"]` | Track clip wrapper |
| `.carousel-track-wrapper` | Track clip wrapper |
| `[data-uc-role="track"]` | Moving slides track |
| `.carousel-track` | Moving slides track |
| `.carousel-slide` | One slide |
| `[data-uc-role="carousel-arrow"]` | Base arrow button |
| `.carousel-arrow` | Base arrow button |
| `[data-uc-role="carousel-arrow"][data-uc-direction="prev"]` | Previous arrow |
| `.carousel-arrow-prev` | Previous arrow |
| `[data-uc-role="carousel-arrow"][data-uc-direction="next"]` | Next arrow |
| `.carousel-arrow-next` | Next arrow |
| `[data-uc-role="indicators"]` | Indicator row |
| `.carousel-indicators` | Indicator row |
| `[data-uc-role="indicator"]` | One indicator dot/button |
| `.carousel-indicator` | One indicator dot/button |
| `.carousel-indicator.active` | Active indicator |

## Modal

| Hook or selector | Purpose |
| --- | --- |
| `[data-uc-mode="modal"][data-uc-role="overlay"]` | Overlay backdrop |
| `.uc-modal-overlay` | Overlay backdrop |
| `[data-uc-mode="modal"][data-uc-role="dialog"]` | Dialog shell |
| `.uc-modal-dialog` | Dialog shell |
| `[data-uc-role="header"]` inside modal | Modal header row |
| `.uc-modal-header` | Modal header row |
| `[data-uc-role="title"]` inside modal | Modal title |
| `.uc-modal-title` | Modal title |
| `[data-uc-role="close"]` inside modal | Modal close button |
| `.uc-modal-close` | Modal close button |
| `[data-uc-role="content"]` inside modal | Modal scroll/content area |
| `.uc-modal-content` | Modal scroll/content area |
| `[data-uc-role="grid"]` inside modal | Modal grid container |
| `.uc-modal-grid` | Modal grid container |

Useful modal state selectors:

- `.uc-modal-overlay.with-blur`
- `.uc-modal-overlay.open`
- `.uc-modal-dialog.open`
- `.uc-modal-dialog[data-width-mode="auto"]`
- `.uc-modal-dialog[data-height-mode="manual"]`
- `.uc-modal-dialog[data-height-mode="auto"]`

## Fullscreen

| Hook or selector | Purpose |
| --- | --- |
| `[data-uc-mode="fullscreen"][data-uc-role="overlay"]` | Fullscreen overlay root |
| `.uc-fullscreen-overlay` | Fullscreen overlay root |
| `[data-uc-mode="fullscreen"][data-uc-role="dialog"]` | Inner surface |
| `.uc-fullscreen-inner` | Inner surface |
| `[data-uc-role="header"]` inside fullscreen | Header row |
| `.uc-fullscreen-header` | Header row |
| `[data-uc-role="title"]` inside fullscreen | Title text |
| `.uc-fullscreen-title` | Title text |
| `[data-uc-role="close"]` inside fullscreen | Back/close button |
| `.uc-fullscreen-back` | Back/close button |
| `[data-uc-role="spacer"]` inside fullscreen | Header spacer |
| `.uc-fullscreen-spacer` | Header spacer |
| `[data-uc-role="content"]` inside fullscreen | Scroll/content area |
| `.uc-fullscreen-content` | Scroll/content area |
| `[data-uc-role="grid"]` inside fullscreen | Fullscreen grid container |
| `.uc-fullscreen-grid` | Fullscreen grid container |

Useful fullscreen state selectors:

- `.uc-fullscreen-overlay.open`
- `.uc-fullscreen-overlay.closing`

## Subview

| Hook or selector | Purpose |
| --- | --- |
| `[data-uc-mode="subview"][data-uc-role="mode-placeholder"]` | Placeholder used by subview mode |
| `.subview-mode-placeholder` | Placeholder used by subview mode |

## Context Menu And Radial Menu

These are optional UI surfaces and can also be targeted if you use those features.

| Selector | Purpose |
| --- | --- |
| `.uc-context-menu` | Context menu root |
| `.uc-context-menu-item` | Context menu item |
| `.uc-context-menu-separator` | Context menu divider |
| `.uc-radial-menu` | Radial menu root |
| `.uc-radial-overlay` | Radial menu overlay |
| `.uc-radial-center` | Radial center button |
| `.uc-radial-item` | Radial action item |

## Practical Guidance

- Prefer the documented `data-uc-*` hooks over raw class selectors for new work.
- Prefer `scope: header` for header selectors.
- Prefer `scope: footer` for footer selectors.
- Prefer `scope: body` for mode-specific selectors such as tabs, carousel, modal, and fullscreen.
- Use `scope: card` for `.universal-card` and broad shell changes.
- Only target selectors listed here if you want the most stable results.

## Related Docs

- [Theming Guide]({{ '/features/theming-guide/' | relative_url }})
- [Custom CSS Recipes]({{ '/features/custom-css-recipes/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
