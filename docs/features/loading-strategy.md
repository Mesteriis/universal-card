---
title: Loading Strategy
description: Lazy versus preload behavior for modal content, plus guidance for inline lazy loading and runtime-safety features.
section_label: Features
permalink: /features/loading-strategy/
---
# Loading Strategy

## Overview

`Universal Card` exposes two related but distinct loading surfaces:

- `lazy_load` and its inline batching controls for the regular expandable body pipeline
- `modal.loading_strategy` for `body_mode: modal`

These are intentionally separate because modal content is managed by the modal mode lifecycle, not by the inline expand-body lifecycle.

## Modal loading strategies

Configure modal content under `modal:`.

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
- initial dashboard render stays lighter
- after first load, the existing mode lifecycle reuses built cards

Use `lazy` when:

- modal content contains heavy cards
- the modal is opened occasionally
- low-power tablets are a priority
- first-open latency is acceptable

## `preload`

`preload` prepares modal content ahead of the first open.

Behavior:

- the card starts modal preparation during initialization
- the preload path reuses the same mode card-loading flow as a real open
- concurrent preload and open calls are deduplicated

Use `preload` when:

- first-open latency matters more than startup cost
- modal content is relatively light
- the modal is opened often enough to justify precomputation

## Inline lazy loading

The regular expandable body still supports inline lazy loading through root fields:

- `lazy_load`
- `lazy_initial_batch`
- `lazy_batch_size`
- `lazy_idle_timeout`
- `skeleton_count`

Example:

```yaml
type: custom:universal-card
title: Inline lazy body
lazy_load: true
lazy_initial_batch: 1
lazy_batch_size: 2
lazy_idle_timeout: 120
skeleton_count: 2
body:
  cards:
    - type: entities
      entities:
        - sensor.demo_temperature
    - type: entities
      entities:
        - sensor.demo_humidity
```

## Runtime-safety controls

For weaker devices or highly dynamic dashboards, the runtime also exposes:

- `stability_mode`
- `remember_expanded_state`
- `remember_mode_state`
- `enable_card_pool`
- `pool_scope`
- `pool_ttl_ms`
- `pool_max_entries`

These are not modal-specific, but they often matter in the same performance-tuning conversations.

## Examples

### Safe default modal

```yaml
type: custom:universal-card
title: Safe modal
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

### Fast first open

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

- modal content may include cameras, media, or heavy custom cards
- early initialization can increase startup cost
- multiple preloaded cards on one dashboard can add up quickly

Practical guidance:

- keep `lazy` as the default unless you have measured a first-open problem
- use `preload` selectively rather than globally
- use `stability_mode` when you need predictable behavior more than aggressive optimization

## Editor support

The visual editor now exposes:

- `modal.loading_strategy`
- modal size fields that usually need to be tuned together with loading behavior

Inline batching controls such as `lazy_initial_batch` and `lazy_batch_size` remain better suited to YAML.

## Limitations

- loading strategy is modal-specific in this stage; fullscreen and subview are unchanged
- `preload` prepares content but does not force the modal open
- the visual difference is timing-based, so documentation uses YAML and guidance instead of a fake screenshot
