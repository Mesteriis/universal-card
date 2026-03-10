---
published: false
---
# Editor Support For Body Modes And Header Layout

## Goal

This document tracks which of the newly formalized body-mode and header-layout settings are available in the visual editor.

The editor continues to rely on the shared schema contract for scalar nested fields and avoids building a free-form layout editor.

## Available In The Visual Editor

### Fullscreen mode

- `fullscreen.width`
- `fullscreen.height`
- `fullscreen.max_width`
- `fullscreen.max_height`
- `fullscreen.padding`
- `fullscreen.background`
- `fullscreen.show_close`
- `fullscreen.close_on_escape`

### Tabs mode

- `tabs_config.position`
- `tabs_config.show_icons`
- `tabs_config.show_labels`
- `tabs_config.content_padding`
- `tabs_config.tab_min_width`
- `tabs_config.tab_alignment`

### Carousel mode

- `carousel_autoplay`
- `carousel_interval`
- `carousel_options.show_arrows`
- `carousel_options.show_indicators`
- `carousel_options.loop`
- `carousel_options.swipe_threshold`
- `carousel_options.height`

### Subview mode

- `subview.path`
- `subview.navigation_path`
- `subview.replace_state`
- `subview.return_on_close`

### Header layout

- `header.sticky`
- `header.clickable`
- `header.layout.variant`
- `header.layout.gap`
- `header.layout.content_gap`
- `header.layout.align`
- `header.layout.badges_position`

## YAML-Only In This Stage

Still better handled in YAML:

- advanced per-tab card `grid` definitions
- complex string-based root `grid.columns` templates
- any future free-form header ordering beyond the provided presets

## Rationale

The visual editor now exposes the parts that map cleanly to a stable schema:

- sizing
- spacing
- preset selection
- small boolean behavior toggles

It intentionally does not attempt to expose arbitrary layout composition logic in this stage.

## Known Limitations

- header layout uses presets rather than arbitrary free-form element ordering
- tabs still require YAML for per-tab custom grid templates beyond the shared field surface
- carousel slide height is editor-supported, but more advanced slide composition remains YAML-first
- subview is a navigation-oriented mode, so editor support remains intentionally small and literal

## Next Steps

1. Add editor affordances for per-tab grid overrides.
2. Add better helper text for CSS-length fields.
3. Consider a later preset expander for header zone ordering if preset coverage proves insufficient.
