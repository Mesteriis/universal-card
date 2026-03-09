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
