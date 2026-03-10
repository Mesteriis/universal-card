---
title: Capability Reference
description: Complete user-facing field inventory for Universal Card.
section_label: Features
permalink: /features/capability-reference/
---

# Capability Reference

This reference groups the card by feature area so you can quickly find the right field family.

## Card shell

| Group | Main fields |
| --- | --- |
| Identity | `title`, `subtitle`, `icon`, `icon_color` |
| Entity binding | `entity`, `attribute` |
| Visual shell | `theme`, `padding`, `border_radius` |
| Open state | `expanded`, `show_expand_icon`, `expand_icon` |

## Body modes

| Mode | Key fields |
| --- | --- |
| `expand` | `body_mode`, `grid.*`, animation fields |
| `modal` | `modal.width`, `modal.height`, `modal.max_width`, `modal.max_height`, `modal.loading_strategy` |
| `fullscreen` | `fullscreen.width`, `fullscreen.height`, `fullscreen.max_width`, `fullscreen.max_height`, `fullscreen.padding`, `fullscreen.background` |
| `tabs` | `tabs[]`, `tabs_config.position`, `tabs_config.show_icons`, `tabs_config.show_labels`, `tabs_config.content_padding`, `tabs_config.tab_min_width`, `tabs_config.tab_alignment` |
| `carousel` | `carousel_autoplay`, `carousel_interval`, `carousel_options.show_arrows`, `carousel_options.show_indicators`, `carousel_options.loop`, `carousel_options.swipe_threshold`, `carousel_options.height` |
| `subview` | `subview.path`, `subview.navigation_path`, `subview.replace_state`, `subview.return_on_close` |
| `none` | header-only layout, actions, badges, footer |

## Layout and composition

| Area | Main fields |
| --- | --- |
| Body content | `body.cards` |
| Grid | `grid.columns`, `grid.gap`, card `colspan`, card `rowspan` |
| Header slots | `header.cards`, `header_left.cards`, `header_right.cards` |
| Header layout | `header.layout.variant`, `header.layout.gap`, `header.layout.content_gap`, `header.layout.align`, `header.layout.badges_position` |
| Footer | `footer.cards`, `footer_left.cards`, `footer_right.cards`, `footer.text`, `footer.icon`, `footer.actions[]`, `footer.tap_action`, `footer.hold_action` |

## Badges

| Capability | Main fields |
| --- | --- |
| Badge types | `type: state`, `attribute`, `counter`, `custom` |
| Display | `icon`, `value`, `label`, `unit`, `icon_only`, `show_progress`, `precision`, `format` |
| Rules | `visibility[]`, `color_rules[]`, `thresholds[]` |
| Actions | `tap_action`, `icon_tap_action` |
| Counter sources | `entities`, `domain`, `state`, `count_state` |

Supported badge operators:

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

## Actions and visibility

| Area | Main fields |
| --- | --- |
| Root actions | `tap_action`, `hold_action`, `double_tap_action` |
| Swipe | `swipe.enabled`, `swipe.direction`, `swipe.threshold`, `swipe.velocityThreshold`, `swipe.preventScroll`, `swipe.left/right/up/down` |
| Visibility | `visibility[]` |
| Section visibility | `section_visibility.header`, `section_visibility.body`, `section_visibility.footer` |
| Context menu | `context_menu.items[]` |

Supported visibility condition families:

- state
- numeric state
- user
- time
- screen
- logical groups with `and`, `or`, `not`

## Styling

| Area | Main fields |
| --- | --- |
| Built-in themes | `theme` |
| Icon styling | `icon_color` |
| Theme overrides | `theme_tokens` |
| State-based card styling | `state_styles` |
| Free-form styling | `custom_css` |

Start with [Theming Guide]({{ '/features/theming-guide/' | relative_url }}) if you are deciding which of these layers to use.

## Runtime and performance

| Area | Main fields |
| --- | --- |
| Inline lazy loading | `lazy_load`, `lazy_initial_batch`, `lazy_batch_size`, `lazy_idle_timeout`, `skeleton_count` |
| Modal loading | `modal.loading_strategy` |
| Stability | `stability_mode` |
| State persistence | `remember_expanded_state`, `remember_mode_state` |
| Card reuse | `enable_card_pool`, `pool_scope`, `pool_ttl_ms`, `pool_max_entries` |
| Animation | `animation_duration`, `expand_animation`, `collapse_animation`, `cards_animation`, `cards_stagger`, `cards_direction`, `auto_collapse_after` |

## Editor coverage

The visual editor is strongest for:

- shell fields
- modal/fullscreen/tabs/carousel/subview settings
- header layout presets
- badge visibility and color rules
- root and section visibility
- swipe settings
- `theme_tokens`
- `state_styles`

YAML remains the better tool for:

- complex `grid.columns` strings
- advanced `custom_css`
- very custom action payloads
- badge `tap_action` and `icon_tap_action`

## Related docs

- [Examples Gallery]({{ '/examples/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
- [Field Matrix]({{ '/features/field-matrix/' | relative_url }})
- [Grid Layout]({{ '/features/grid-layout/' | relative_url }})
- [Footer]({{ '/features/footer/' | relative_url }})
- [Visibility]({{ '/features/visibility/' | relative_url }})
- [Actions And Gestures]({{ '/features/interactions/' | relative_url }})
- [Recipes by Use Case]({{ '/features/recipes-by-use-case/' | relative_url }})
- [Custom CSS Recipes]({{ '/features/custom-css-recipes/' | relative_url }})
- [Theming Guide]({{ '/features/theming-guide/' | relative_url }})
- [Selector Catalog]({{ '/features/selector-catalog/' | relative_url }})
- [Modal Layout]({{ '/features/modal-layout/' | relative_url }})
- [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }})
- [Header Layout]({{ '/features/header-layout/' | relative_url }})
- [Badges]({{ '/features/badges/' | relative_url }})
- [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }})
- [Editor]({{ '/features/editor/' | relative_url }})
