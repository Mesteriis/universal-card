---
title: Loading Strategy
description: Lazy versus preload behavior for modal content and guidance for performance-sensitive cards.
section_label: Features
permalink: /features/loading-strategy/
---
# Loading Strategy

## Overview

`universal_card` now separates two different loading concerns:

- `lazy_load`: inline expand-body loading for regular body content
- `modal.loading_strategy`: modal content preparation strategy for `body_mode: modal`

This distinction matters because modal content is rendered through `ModalMode`, not through the inline body pipeline used by `expand` mode.

## Modal loading strategies

Configure modal content loading under `modal:`.

```yaml
modal:
  loading_strategy: lazy
```

Supported values:

- `lazy`
- `preload`

## `lazy`

`lazy` is the default and safest mode.

Behavior:

- modal cards are created when the modal is opened for the first time
- after the first load, card instances are reused by the existing mode/card lifecycle
- initial dashboard render stays lighter

Use `lazy` when:

- modal content contains camera cards
- modal content is heavy or expensive to initialize
- the modal is used occasionally
- slower devices or wall tablets are a priority

## `preload`

`preload` prepares modal cards ahead of the first open.

Behavior in this stage:

- `UniversalCard` starts modal content preparation during initialization
- the preload call uses the same `BaseMode.loadCards()` path as normal opening
- concurrent preload/open calls are deduplicated so cards are not built twice

Use `preload` when:

- first-open latency matters more than initial render cost
- the modal is opened frequently
- modal content is relatively light and predictable

## Examples

### Safe default

```yaml
type: custom:universal-card
title: Lights
body_mode: modal
modal:
  loading_strategy: lazy
body:
  cards:
    - type: entities
      entities:
        - light.kitchen
        - light.hall
```

### Preload for fast first open

```yaml
type: custom:universal-card
title: Quick controls
body_mode: modal
modal:
  loading_strategy: preload
body:
  cards:
    - type: button
      entity: light.kitchen
    - type: button
      entity: light.hall
```

## Performance notes

`preload` is intentionally opt-in.

Reasons:

- modal content may include heavy custom cards
- cameras and media cards can initialize network or rendering work early
- multiple cards with `preload` can increase startup cost on low-power devices

Practical recommendation:

- keep `lazy` as the default unless you have measured a real first-open UX problem
- use `preload` selectively, not on every modal in a large dashboard

## Relationship to existing `lazy_load`

`lazy_load` still means inline body lazy loading for the regular expandable card body.

It does not replace or override `modal.loading_strategy`.

Examples:

- `body_mode: expand` uses `lazy_load`
- `body_mode: modal` uses `modal.loading_strategy`

## Limitations

- loading strategy is modal-specific in this stage; fullscreen and subview are unchanged
- preload prepares cards but does not force the modal open
- there is no editor UI for `modal.loading_strategy` yet in this stage
