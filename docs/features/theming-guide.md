---
title: Theming Guide
description: Practical guidance for choosing between theme, icon_color, theme_tokens, state_styles, and custom_css.
section_label: Features
permalink: /features/theming-guide/
---

# Theming Guide

Universal Card supports several styling layers. They are not interchangeable.
Use the lightest tool that solves the problem.

## Decision Order

1. use `theme` for a ready-made visual preset
2. use `icon_color` for the main header icon only
3. use `theme_tokens` for broad card-wide color, spacing, and surface tuning
4. use `state_styles` when the card should restyle itself based on entity state
5. use `custom_css` only when you need a precise override on an internal element

## Quick Decision Table

| Goal | Best tool | Why |
| --- | --- | --- |
| Switch the whole card to a known look | `theme` | fastest and easiest to keep consistent |
| Recolor only the main icon | `icon_color` | explicit and simple |
| Adjust background, accent, spacing, border, shadows | `theme_tokens` | broad tuning without targeting internals |
| Change appearance when entity state changes | `state_styles` | declarative state-driven styling |
| Restyle one exact element such as a badge row or tab button | `custom_css` | precise control over internals |

## Layer 1: `theme`

Use `theme` when you want a card-wide preset.

```yaml
type: custom:universal-card
title: Living Room
theme: glass
body:
  cards:
    - type: markdown
      content: Hello
```

Best for:

- quick visual consistency
- dashboards with repeated card families
- users who want low-maintenance styling

## Layer 2: `icon_color`

Use `icon_color` only for the main header icon.

```yaml
type: custom:universal-card
title: Security
icon: mdi:shield-home
icon_color: '#ffb347'
body:
  cards:
    - type: markdown
      content: Armed
```

Best for:

- highlight cards
- status emphasis on the primary icon
- simple semantic color coding

## Layer 3: `theme_tokens`

Use `theme_tokens` when the card should keep its existing structure but shift its design language.

```yaml
type: custom:universal-card
title: Climate
theme: minimal
theme_tokens:
  accent_color: '#7cd6ff'
  card_background: 'linear-gradient(145deg, rgba(8,16,28,.95), rgba(18,35,52,.92))'
  border_radius: 18px
body:
  cards:
    - type: markdown
      content: Tuned with tokens
```

Best for:

- color systems
- roundedness and surface tuning
- keeping the card styleable without targeting internals

Use `theme_tokens` before `custom_css` if the goal is still card-wide.

## Layer 4: `state_styles`

Use `state_styles` when the visual treatment should follow entity state.

```yaml
type: custom:universal-card
title: Front Door
entity: binary_sensor.front_door
state_styles:
  - value: 'on'
    theme_tokens:
      accent_color: '#ff6b6b'
      border_color: 'rgba(255,107,107,.35)'
  - value: 'off'
    theme_tokens:
      accent_color: '#7bd88f'
body:
  cards:
    - type: entities
      entities:
        - entity: binary_sensor.front_door
```

Best for:

- alarm and security cards
- availability/error states
- active/inactive emphasis

Use this when the styling decision depends on runtime state, not on layout.

## Layer 5: `custom_css`

Use `custom_css` when the card API does not expose the exact visual control you need.

```yaml
type: custom:universal-card
title: Styled Header
custom_css:
  - scope: header
    css: |
      [data-uc-role="title"] {
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      [data-uc-role="badges"] {
        flex-wrap: wrap;
      }
```

Best for:

- exact element-level overrides
- layout nudges in a specific region
- component-specific polish

Do not start with `custom_css` if a simpler layer already solves it.

## Official CSS Hooks

For targeted overrides, prefer the stable `data-uc-*` hooks over raw class names.

Examples:

- `[data-uc-role="card"]`
- `[data-uc-role="header"]`
- `[data-uc-role="title"]`
- `[data-uc-role="badge"]`
- `[data-uc-role="footer"]`
- `[data-uc-mode="tabs"]`
- `[data-uc-mode="carousel"]`
- `[data-uc-mode="modal"]`
- `[data-uc-mode="fullscreen"]`

The full list is documented in [Selector Catalog]({{ '/features/selector-catalog/' | relative_url }}).

## Recommended Workflow

1. choose a `theme`
2. tune broad visuals with `theme_tokens`
3. add `state_styles` only where runtime feedback matters
4. use `custom_css` as the final precision tool

That keeps the config easier to maintain and reduces brittle CSS.

## Anti-Patterns

Avoid these patterns when a cleaner tool exists:

- using `custom_css` to recolor only the main icon
- using `custom_css` for state-based color changes that belong in `state_styles`
- using many element-level overrides when a different `theme` or `theme_tokens` set would solve the same problem

## Related Docs

- [Custom CSS Recipes]({{ '/features/custom-css-recipes/' | relative_url }})
- [Selector Catalog]({{ '/features/selector-catalog/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
- [Capability Reference]({{ '/features/capability-reference/' | relative_url }})
