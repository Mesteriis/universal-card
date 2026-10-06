---
title: Drawer Layout
description: Four edge panels with viewport fraction sizing, loading, keyboard focus, and close controls.
section_label: Features
permalink: /features/drawer-layout/
---

# Drawer Layout

`body_mode: drawer` slides the body in from an edge, leaving the current dashboard
visible behind a dimmed backdrop. It uses the same Lovelace child cards and Home
Assistant context as the modal mode.

```yaml
type: custom:universal-card
title: Details
body_mode: drawer
drawer:
  side: right
  size: 1/3
body:
  cards:
    - type: markdown
      content: More information
```

## Direction and size

| Field | Values | Default |
| --- | --- | --- |
| `drawer.side` | `left`, `right`, `top`, `bottom` | `right` |
| `drawer.size` | `full`, fractions, percentages, or numeric fractions | `1/3` |

For left/right panels, size controls width; height fills the viewport.
For top/bottom panels, size controls height; width fills the viewport.
The same fraction is respected on narrow screens. Content scrolls inside the panel.

Examples: `full`, `1/2`, `1/3`, `1/4`, `1/5`, `2/3`, `40%`, or `0.5`.
All sizes must be greater than zero and at most the full viewport.
Numeric values represent a fraction, so `0.5` is half the screen; `50` is invalid.
Pixels and arbitrary CSS expressions are not accepted.

## Behavior

| Option | Default | Purpose |
| --- | --- | --- |
| `loading_strategy` | `lazy` | `lazy` creates children on first open; `preload` loads them ahead of time |
| `show_close` | `true` | Display the close button |
| `close_on_escape` | `true` | Close with Escape |
| `close_on_backdrop` | `true` | Close when clicking outside the panel |
| `backdrop_blur` | `true` | Blur the dashboard behind the panel |
| `backdrop_color` | `rgba(0, 0, 0, 0.6)` | Backdrop color |
| `custom_css` | empty | Optional CSS for this portal, applied after built-in styles |

These options belong under `drawer`. The visual editor exposes the direction,
size, loading strategy, backdrop, and close behavior. Disable all close methods
only if a child card provides a working close action.

The panel slides in from the selected side and respects `prefers-reduced-motion`.
Keyboard Tab stays within the panel, and closing returns focus to its trigger.
Opening locks background scrolling; closing or removing the card releases the lock.
Existing `body_mode: modal` configurations remain supported, including
`modal.custom_css` styling for their portal.
