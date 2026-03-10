---
title: Field Matrix
description: Quick lookup matrix for major Universal Card fields, editor coverage, and the best documentation entry point.
section_label: Features
permalink: /features/field-matrix/
---

# Field Matrix

This page is the fastest way to answer four practical questions:

1. what the field group is called
2. whether the editor supports it well
3. whether YAML is still the better fit
4. where the best example lives

## How To Read This Page

| Column | Meaning |
| --- | --- |
| Field group | The config block or field family |
| Typical fields | The most important keys in that group |
| Editor | `Full`, `Partial`, or `YAML-first` |
| Best docs | The page that explains the group in context |
| Example | The best starting recipe |

## Shell And Layout

| Field group | Typical fields | Editor | Best docs | Example |
| --- | --- | --- | --- | --- |
| Root shell | `title`, `subtitle`, `icon`, `icon_color`, `entity`, `theme` | Full | [Configuration]({{ '/configuration/' | relative_url }}) | [Basic expandable card]({{ '/examples/#recipe-basic-expandable-card' | relative_url }}) |
| Grid | `grid.columns`, `gap`, `row_gap`, `column_gap`, `colspan`, `rowspan` | Partial | [Grid Layout]({{ '/features/grid-layout/' | relative_url }}) | [Advanced grid with spans]({{ '/examples/#recipe-advanced-grid-with-spans' | relative_url }}) |
| Header layout | `header.layout.variant`, `gap`, `content_gap`, `align`, `badges_position` | Full | [Header Layout]({{ '/features/header-layout/' | relative_url }}) | [Header layout presets]({{ '/examples/#recipe-header-layout-presets' | relative_url }}) |
| Footer | `footer.text`, `footer.icon`, `footer.actions[]`, `footer_left`, `footer_right` | Partial | [Footer]({{ '/features/footer/' | relative_url }}) | [Footer cards and actions]({{ '/examples/#recipe-footer-cards-and-actions' | relative_url }}) |

## Body Modes

| Field group | Typical fields | Editor | Best docs | Example |
| --- | --- | --- | --- | --- |
| Expand | `body_mode: expand`, `grid.*`, animation fields | Partial | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) | [Basic expandable card]({{ '/examples/#recipe-basic-expandable-card' | relative_url }}) |
| Modal | `modal.width`, `height`, `max_width`, `max_height`, `loading_strategy` | Full | [Modal Layout]({{ '/features/modal-layout/' | relative_url }}) | [Modal with responsive sizing]({{ '/examples/#recipe-modal-with-responsive-sizing' | relative_url }}) |
| Fullscreen | `fullscreen.width`, `height`, `max_width`, `max_height`, `padding`, `background` | Full | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) | [Fullscreen mode]({{ '/examples/#recipe-fullscreen-mode' | relative_url }}) |
| Tabs | `tabs[]`, `tabs_config.position`, `show_icons`, `show_labels`, `content_padding`, `tab_min_width`, `tab_alignment` | Full | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) | [Tabs mode]({{ '/examples/#recipe-tabs-mode' | relative_url }}) |
| Carousel | `carousel_autoplay`, `carousel_interval`, `carousel_options.show_arrows`, `show_indicators`, `loop`, `swipe_threshold`, `height` | Full | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) | [Carousel mode]({{ '/examples/#recipe-carousel-mode' | relative_url }}) |
| Subview | `subview.path`, `navigation_path`, `replace_state`, `return_on_close` | Full | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) | [Subview mode]({{ '/examples/#recipe-subview-mode' | relative_url }}) |
| None | `body_mode: none` | Full | [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) | [Header-only card]({{ '/examples/#recipe-header-only-card' | relative_url }}) |

## Badges, Rules, And Actions

| Field group | Typical fields | Editor | Best docs | Example |
| --- | --- | --- | --- | --- |
| Badges | `type`, `icon`, `label`, `value`, `unit`, `icon_only` | Full | [Badges]({{ '/features/badges/' | relative_url }}) | [Badge rules and icon-only mode]({{ '/examples/#recipe-badge-rules-and-icon-only-mode' | relative_url }}) |
| Badge visibility | `badges[].visibility[]` | Full | [Visibility]({{ '/features/visibility/' | relative_url }}) | [Badge visibility on a separate entity]({{ '/examples/#recipe-badge-visibility-on-a-separate-entity' | relative_url }}) |
| Badge color rules | `badges[].color_rules[]` | Full | [Badges]({{ '/features/badges/' | relative_url }}) | [Badge rules and icon-only mode]({{ '/examples/#recipe-badge-rules-and-icon-only-mode' | relative_url }}) |
| Card actions | `tap_action`, `hold_action`, `double_tap_action` | Partial | [Actions And Gestures]({{ '/features/interactions/' | relative_url }}) | [Root actions and context menu]({{ '/examples/#recipe-root-actions-and-context-menu' | relative_url }}) |
| Badge actions | `badges[].tap_action`, `badges[].icon_tap_action` | YAML-first | [Badges]({{ '/features/badges/' | relative_url }}) | [Root actions and context menu]({{ '/examples/#recipe-root-actions-and-context-menu' | relative_url }}) |
| Context menu | `context_menu.items[]` | YAML-first | [Actions And Gestures]({{ '/features/interactions/' | relative_url }}) | [Root actions and context menu]({{ '/examples/#recipe-root-actions-and-context-menu' | relative_url }}) |
| Swipe | `swipe.enabled`, `direction`, `threshold`, `velocityThreshold`, `preventScroll`, directional actions | Full | [Actions And Gestures]({{ '/features/interactions/' | relative_url }}) | [Swipe gestures]({{ '/examples/#recipe-swipe-gestures' | relative_url }}) |
| Visibility | `visibility`, `section_visibility.*` | Full | [Visibility]({{ '/features/visibility/' | relative_url }}) | [Visibility and section visibility]({{ '/examples/#recipe-visibility-and-section-visibility' | relative_url }}) |

## Styling

| Field group | Typical fields | Editor | Best docs | Example |
| --- | --- | --- | --- | --- |
| Theme | `theme` | Full | [Theming Guide]({{ '/features/theming-guide/' | relative_url }}) | [Theme-only quick restyle]({{ '/examples/#recipe-theme-only-quick-restyle' | relative_url }}) |
| Icon color | `icon_color` | Full | [Theming Guide]({{ '/features/theming-guide/' | relative_url }}) | [Themes, tokens, and state styles]({{ '/examples/#recipe-themes-tokens-and-state-styles' | relative_url }}) |
| Theme tokens | `theme_tokens` | Full | [Theming Guide]({{ '/features/theming-guide/' | relative_url }}) | [Themes, tokens, and state styles]({{ '/examples/#recipe-themes-tokens-and-state-styles' | relative_url }}) |
| State styles | `state_styles` | Full | [Theming Guide]({{ '/features/theming-guide/' | relative_url }}) | [Themes, tokens, and state styles]({{ '/examples/#recipe-themes-tokens-and-state-styles' | relative_url }}) |
| Custom CSS | `custom_css` | YAML-first | [Custom CSS Recipes]({{ '/features/custom-css-recipes/' | relative_url }}) | [Custom CSS accent]({{ '/examples/#recipe-custom-css-accent' | relative_url }}) |
| CSS hooks | `data-uc-*` hooks and stable selectors | YAML-first | [Selector Catalog]({{ '/features/selector-catalog/' | relative_url }}) | [Custom CSS Recipes]({{ '/features/custom-css-recipes/' | relative_url }}) |

## Runtime And Editor

| Field group | Typical fields | Editor | Best docs | Example |
| --- | --- | --- | --- | --- |
| Inline lazy loading | `lazy_load`, `lazy_initial_batch`, `lazy_batch_size`, `lazy_idle_timeout`, `skeleton_count` | YAML-first | [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }}) | [Loading strategy and stable wall panel setup]({{ '/examples/#recipe-loading-strategy-and-stable-wall-panel-setup' | relative_url }}) |
| Stability and pooling | `stability_mode`, `remember_expanded_state`, `remember_mode_state`, `enable_card_pool`, `pool_scope`, `pool_ttl_ms`, `pool_max_entries` | YAML-first | [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }}) | [Loading strategy and stable wall panel setup]({{ '/examples/#recipe-loading-strategy-and-stable-wall-panel-setup' | relative_url }}) |
| Visual editor | section-based config editing | N/A | [Editor]({{ '/features/editor/' | relative_url }}) | [Editor-driven setup]({{ '/examples/#recipe-editor-driven-setup' | relative_url }}) |

## Practical Reading Order

1. [Configuration]({{ '/configuration/' | relative_url }})
2. [Examples Gallery]({{ '/examples/' | relative_url }})
3. This page for fast lookup
4. The focused guide for the area you are tuning

## Related Docs

- [Configuration]({{ '/configuration/' | relative_url }})
- [Examples Gallery]({{ '/examples/' | relative_url }})
- [Capability Reference]({{ '/features/capability-reference/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
