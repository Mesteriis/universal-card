---
title: Editor
description: What the visual editor covers well, and where YAML remains the better tool.
section_label: Features
permalink: /features/editor/
---

# Editor

The visual editor is the fastest way to assemble most cards.
It is strongest when the configuration is structured and repeatable.

<img src="{{ '/img/editor-overview-dark.png' | relative_url }}" alt="Universal Card editor in dark theme">

## Main sections

The editor is organized into:

1. `Basic`
2. `Header`
3. `Body`
4. `Style`
5. `Features`
6. `Advanced`

## Best-covered areas

### Basic shell

- `title`
- `subtitle`
- `icon`
- `icon_color`
- `entity`
- `theme`
- `body_mode`

### Header and badges

- header sticky and clickable behavior
- `header.layout.variant`
- `header.layout.gap`
- `header.layout.content_gap`
- `header.layout.align`
- `header.layout.badges_position`
- common badge fields
- badge `icon_only`
- badge `visibility`
- badge `color_rules`

### Body modes

The editor exposes mode-specific settings when they matter:

- `modal.width`, `modal.height`, `modal.max_width`, `modal.max_height`, `modal.loading_strategy`
- `fullscreen.width`, `fullscreen.height`, `fullscreen.max_width`, `fullscreen.max_height`, `fullscreen.padding`, `fullscreen.background`, `fullscreen.show_close`, `fullscreen.close_on_escape`
- `tabs_config.position`, `tabs_config.show_icons`, `tabs_config.show_labels`, `tabs_config.content_padding`, `tabs_config.tab_min_width`, `tabs_config.tab_alignment`
- `carousel_autoplay`, `carousel_interval`, `carousel_options.show_arrows`, `carousel_options.show_indicators`, `carousel_options.loop`, `carousel_options.swipe_threshold`, `carousel_options.height`
- `subview.path`, `subview.navigation_path`, `subview.replace_state`, `subview.return_on_close`

### Features and styling

- root `visibility`
- `section_visibility`
- `swipe.*`
- `theme_tokens`
- `state_styles`

## When YAML is better

Use YAML when you want:

- complex `grid.columns` strings
- advanced `custom_css`
- large action payloads
- badge `tap_action`
- badge `icon_tap_action`
- highly custom nested card compositions

## Recommended workflow

1. Start in `Basic`.
2. Pick the body mode.
3. Adjust header layout and badges.
4. Add visibility and swipe only if needed.
5. Drop to YAML for custom layout strings, advanced actions, or CSS.

## Related docs

- [Examples Gallery]({{ '/examples/' | relative_url }})
- [Header Layout]({{ '/features/header-layout/' | relative_url }})
- [Badges]({{ '/features/badges/' | relative_url }})
- [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }})
