---
title: Selector Catalog
description: Stable internal selectors you can target with custom_css in Universal Card.
section_label: Features
permalink: /features/selector-catalog/
---

# Selector Catalog

This page lists the internal selectors that are reasonable to target with `custom_css`.
Treat this page as the supported styling surface for targeted overrides.

## Card Shell

| Selector | Area | Purpose |
| --- | --- | --- |
| `.universal-card` | card | Main shell container |
| `.header` | header | Root header element |
| `.body` | body | Root body element |
| `.body-content` | body | Inner body content wrapper |
| `.footer` | footer | Root footer element |
| `.card-wrapper` | body/modes | Wrapper around nested cards |

## Header

| Selector | Purpose |
| --- | --- |
| `.header-left` | Left header zone |
| `.header-icon` | Main header icon |
| `.header-left-slot` | Left slot cards container |
| `.header-content` | Title/subtitle/content column |
| `.header-title` | Main title text |
| `.header-subtitle` | Subtitle text |
| `.header-cards-slot` | Header content slot cards |
| `.header-badges` | Right-side badge row |
| `.header-content-badges` | Badges rendered below content |
| `.header-right` | Right header zone |
| `.header-right-slot` | Right slot cards container |
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

| Selector | Purpose |
| --- | --- |
| `.badge` | Badge chip root |
| `.badge.icon-only` | Icon-only badge variant |
| `.badge.clickable` | Clickable badge state |
| `.badge-icon` | Badge icon element |
| `.badge-icon-action` | Icon-only action target |
| `.badge-label` | Badge label |
| `.badge-value` | Badge value |
| `.badge-unit` | Badge unit |
| `.badge-progress` | Progress wrapper |
| `.badge-progress-bar` | Progress fill element |

## Footer

| Selector | Purpose |
| --- | --- |
| `.footer-left` | Left footer zone |
| `.footer-left-slot` | Left footer slot cards |
| `.footer-content` | Main footer content column |
| `.footer-text` | Footer text row |
| `.footer-cards-slot` | Footer content slot cards |
| `.footer-right` | Right footer zone |
| `.footer-right-slot` | Right footer slot cards |
| `.footer-action-btn` | Footer action button |

## Expand And Base Body

| Selector | Purpose |
| --- | --- |
| `.expand-mode` | Expand mode root |
| `.expand-content` | Expand mode content wrapper |
| `.expand-grid` | Expand mode grid container |
| `.body[data-state="collapsed"]` | Collapsed body state |
| `.body[data-state="expanded"]` | Expanded body state |

## Tabs

| Selector | Purpose |
| --- | --- |
| `.tabs-mode` | Tabs mode root |
| `.tabs-bar` | Tab buttons row |
| `.tab-button` | Individual tab button |
| `.tab-label` | Tab label text |
| `.tab-indicator` | Active tab indicator |
| `.tabs-content` | Tabs content wrapper |
| `.tab-panel` | One tab panel |
| `.tab-grid` | Grid inside a tab panel |

Useful tabs state selectors:

- `.tabs-mode[data-tab-position="bottom"]`
- `.tabs-mode[data-tab-alignment="center"]`
- `.tabs-mode[data-tab-alignment="stretch"]`

## Carousel

| Selector | Purpose |
| --- | --- |
| `.carousel-mode` | Carousel root |
| `.carousel-viewport` | Viewport wrapper |
| `.carousel-track-wrapper` | Track clip wrapper |
| `.carousel-track` | Moving slides track |
| `.carousel-slide` | One slide |
| `.carousel-arrow` | Base arrow button |
| `.carousel-arrow-prev` | Previous arrow |
| `.carousel-arrow-next` | Next arrow |
| `.carousel-indicators` | Indicator row |
| `.carousel-indicator` | One indicator dot/button |
| `.carousel-indicator.active` | Active indicator |

## Modal

| Selector | Purpose |
| --- | --- |
| `.uc-modal-overlay` | Overlay backdrop |
| `.uc-modal-dialog` | Dialog shell |
| `.uc-modal-header` | Modal header row |
| `.uc-modal-title` | Modal title |
| `.uc-modal-close` | Modal close button |
| `.uc-modal-content` | Modal scroll/content area |
| `.uc-modal-grid` | Modal grid container |

Useful modal state selectors:

- `.uc-modal-overlay.with-blur`
- `.uc-modal-overlay.open`
- `.uc-modal-dialog.open`
- `.uc-modal-dialog[data-width-mode="auto"]`
- `.uc-modal-dialog[data-height-mode="manual"]`
- `.uc-modal-dialog[data-height-mode="auto"]`

## Fullscreen

| Selector | Purpose |
| --- | --- |
| `.uc-fullscreen-overlay` | Fullscreen overlay root |
| `.uc-fullscreen-inner` | Inner surface |
| `.uc-fullscreen-header` | Header row |
| `.uc-fullscreen-title` | Title text |
| `.uc-fullscreen-back` | Back/close button |
| `.uc-fullscreen-spacer` | Header spacer |
| `.uc-fullscreen-content` | Scroll/content area |
| `.uc-fullscreen-grid` | Fullscreen grid container |

Useful fullscreen state selectors:

- `.uc-fullscreen-overlay.open`
- `.uc-fullscreen-overlay.closing`

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

- Prefer `scope: header` for header selectors.
- Prefer `scope: footer` for footer selectors.
- Prefer `scope: body` for mode-specific selectors such as tabs, carousel, modal, and fullscreen.
- Use `scope: card` for `.universal-card` and broad shell changes.
- Only target selectors listed here if you want the most stable results.

## Related Docs

- [Custom CSS Recipes]({{ '/features/custom-css-recipes/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
