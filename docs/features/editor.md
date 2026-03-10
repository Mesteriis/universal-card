---
title: Editor
description: Visual editor coverage for Universal Card, including which areas are schema-driven, which still fall back to YAML, and how the editor is organized.
section_label: Features
permalink: /features/editor/
---

# Editor

The built-in `universal-card-editor` is part of the public product surface.
It is not a thin wrapper around YAML. It has its own sections, schema-driven controls, nested rule editors, and YAML fallback paths.

<div class="docs-callout">
  <strong>Positioning.</strong> The editor is optimized for the most common and structurally stable configuration paths. Deeply free-form layouts and some nested action cases still belong in YAML.
</div>

## Rendered editor surface

<img src="{{ '/img/editor-overview-dark.png' | relative_url }}" alt="Universal Card editor in dark theme">

## Editor sections

The editor is organized into six top-level sections:

1. `Basic`
2. `Header`
3. `Body`
4. `Style`
5. `Features`
6. `Advanced`

This split mirrors the runtime config instead of forcing all fields into one flat form.

## What the editor covers well

### Core card shell

- `title`
- `subtitle`
- `icon`
- `icon_color`
- `entity`
- `theme`
- `body_mode`
- base layout toggles such as `show_state` and expand affordances

### Header and badges

- header sticky and clickable behavior
- `header.layout.variant`
- `header.layout.gap`
- `header.layout.content_gap`
- `header.layout.align`
- `header.layout.badges_position`
- badge base fields by badge type
- badge `icon_only`
- badge `visibility`
- badge `color_rules`

### Body modes

When the selected mode requires extra settings, the editor exposes them contextually.

Supported mode-specific fields:

- `modal.width`, `modal.height`, `modal.max_width`, `modal.max_height`, `modal.loading_strategy`
- `fullscreen.width`, `fullscreen.height`, `fullscreen.max_width`, `fullscreen.max_height`, `fullscreen.padding`, `fullscreen.background`, `fullscreen.show_close`, `fullscreen.close_on_escape`
- `tabs_config.position`, `tabs_config.show_icons`, `tabs_config.show_labels`, `tabs_config.content_padding`, `tabs_config.tab_min_width`, `tabs_config.tab_alignment`
- `carousel_autoplay`, `carousel_interval`, `carousel_options.show_arrows`, `carousel_options.show_indicators`, `carousel_options.loop`, `carousel_options.swipe_threshold`, `carousel_options.height`
- `subview.path`, `subview.navigation_path`, `subview.replace_state`, `subview.return_on_close`

### Visibility, swipe, and runtime features

The editor also covers behavior-heavy surfaces that benefit from structured controls:

- root `visibility`
- `section_visibility` for `header`, `body`, and `footer`
- `swipe.enabled`
- `swipe.direction`
- `swipe.threshold`
- `swipe.velocityThreshold`
- `swipe.preventScroll`
- directional swipe actions
- `theme_tokens`
- `state_styles`

## YAML-first or YAML-only areas

The following areas still belong primarily in YAML:

- badge `tap_action`
- badge `icon_tap_action`
- free-form header ordering beyond the shipped presets
- complex string-based `grid.columns` design work
- deeply custom per-tab grid composition
- heavily nested custom action payloads where a form would become noisier than YAML
- advanced `custom_css` authoring when you want full selector control

These limits are intentional. The current editor optimizes for stable, testable configuration flows rather than exposing every edge case through a brittle UI.

## Why the editor stops where it does

The editor is schema-driven where that improves quality:

- typed options are easier to validate
- nested rule builders are safer than raw free-text JSON
- conditional fields can appear only when a body mode actually needs them

The editor falls back to YAML where the problem is inherently open-ended:

- CSS authoring
- arbitrary layout composition
- advanced action payloads
- feature combinations that are valid but too irregular for a maintainable form

## Recommended workflow

1. Start with `Basic` to set title, icon, entity, theme, and body mode.
2. Use `Header` to choose layout preset and badge rules.
3. Use `Body` to configure tabs, carousel, footer cards, and nested body content.
4. Use `Style` for icon color, theme tokens, and state styles.
5. Use `Features` for visibility and swipe behavior.
6. Drop to YAML only when you reach a configuration shape that is more expressive than a form should be.

## Related docs

- [Capability Reference]({{ '/features/capability-reference/' | relative_url }})
- [Examples Gallery]({{ '/examples/' | relative_url }})
- [Header Layout]({{ '/features/header-layout/' | relative_url }})
- [Badges]({{ '/features/badges/' | relative_url }})
- [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }})
