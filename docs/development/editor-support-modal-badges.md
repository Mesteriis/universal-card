# Editor Support For Modal And Badges

## Goal

This document tracks which modal and badge features are available in the visual editor and which still require YAML.

The editor follows the shared runtime config contract where possible and uses hand-authored sub-editors only for array-based structures such as badge rules.

## Added To The Visual Editor

### Root styling

- `icon_color`

### Modal settings

- `modal.width`
- `modal.height`
- `modal.max_width`
- `modal.max_height`
- `modal.loading_strategy`

These fields are shown when `body_mode: modal` is selected.

### Badge settings

- base badge fields by type
- static `color`
- `icon_only`
- `visibility`
- `color_rules`

Badge rules use the same operator set as the runtime contract:

- `==`
- `!=`
- `>`
- `<`
- `>=`
- `<=`

Rule values entered in the editor are parsed as:

- boolean for `true` / `false`
- number for numeric input like `42` or `18.5`
- string for everything else

## YAML-Only For Now

The following fields still require YAML:

- `modal.backdrop_blur`
- `modal.backdrop_color`
- `modal.close_on_backdrop`
- `modal.close_on_escape`
- `modal.show_close`
- badge `tap_action`
- badge `icon_tap_action`

## Rationale

The editor now covers the layout and rule-based configuration that benefits most from form controls, while avoiding a large one-off action editor inside each badge row.

Badge actions were left in YAML for this stage because a clean editor implementation needs:

- a reusable nested action editor that works inside repeated badge items
- clear affordances for body tap versus icon tap
- validation UX that does not become noisy inside dense badge rule layouts

## Known Editor Limitations

- badge rules are flat lists; the editor does not expose future operators such as `in`, `not_in`, `contains`, or `matches`
- custom `grid.columns` string templates are still better handled in YAML, because the generic editor control remains number-oriented for that field
- switching `body_mode` rerenders the editor so modal controls appear immediately, but existing non-modal fields are preserved as-is

## Next Steps

Recommended follow-up work:

1. add reusable nested action editors for badge `tap_action` and `icon_tap_action`
2. add color-picker style controls for color fields
3. add explicit YAML helper text for fields with mixed text or numeric semantics
