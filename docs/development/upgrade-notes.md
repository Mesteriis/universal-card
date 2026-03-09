# Upgrade Notes

## Modal layout and sizing

The modal body mode now has an expanded sizing contract.

New fields:

- `modal.height`
- `modal.max_height`

Clarified behavior:

- `modal.width` still works as before
- `modal.max_width` still works as before
- `width: auto` and `height: auto` are now documented and supported as explicit responsive sizing values

Behavioral fix:

- modal body grid now stays in grid mode when `grid.columns` is configured
- previous builds could accidentally collapse configured modal columns into a single vertical list because the runtime stylesheet overrode inline grid styles

Potentially visible change:

- on narrow screens, modal grid collapses to one column by default for stability
- spacing inside the modal is tighter than before to reduce unused space

Backward compatibility:

- existing modal configs remain valid
- existing custom `modal.width` and `modal.max_width` values remain supported
- no legacy modal field was removed in this stage

## Badge rules and icon actions

The badge contract now supports rule-based visibility and rule-based dynamic colors.

New fields on each badge:

- `visibility`
- `color_rules`
- `icon_only`
- `icon_tap_action`

Supported operators in this stage:

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

Compatibility notes:

- `color` still overrides every other badge color mechanism
- `color_rules` are evaluated before legacy automatic state color / numeric thresholds
- `tap_action` remains the whole-badge action
- `icon_tap_action` adds a separate icon-only click target when an icon is present

Known limitation:

- badge rules use implicit `AND` and do not support nested logical groups in this stage

## Modal loading strategy

New field:

- `modal.loading_strategy`

Supported values:

- `lazy` (default)
- `preload`

Important compatibility note:

- existing `lazy_load` keeps its previous meaning for inline expand-body loading
- modal preload is a separate feature and does not reinterpret `lazy_load`

Performance note:

- `preload` can increase startup cost for heavy modal content and should be used selectively

## Header icon color and editor coverage

New root field:

- `icon_color`

Editor coverage added in this stage:

- modal sizing fields and modal loading strategy
- badge visibility rules
- badge color rules
- badge `icon_only`
- root `icon_color`

Still YAML-only:

- modal overlay behavior fields
- badge `tap_action`
- badge `icon_tap_action`

## Fullscreen, tabs, carousel, and subview contracts

New or expanded config blocks:

- `fullscreen`
- `tabs_config.content_padding`
- `tabs_config.tab_min_width`
- `tabs_config.tab_alignment`
- `carousel_options`
- `subview`

Compatibility notes:

- root `carousel_autoplay` and `carousel_interval` remain supported
- the removed legacy `carousel` object is still not valid config
- `fullscreen` and `subview` are now part of the shared normalized contract instead of only local runtime parsing
- expand mode still uses shared `grid` instead of a dedicated nested `expand` object

