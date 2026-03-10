---
title: Loading Strategy
description: When to use lazy loading, preload, and runtime-safety settings.
section_label: Features
permalink: /features/loading-strategy/
---

# Loading Strategy

Universal Card has two loading layers:

- inline lazy loading for regular body content
- modal `lazy` or `preload` for `body_mode: modal`

## Modal loading strategy

```yaml
modal:
  loading_strategy: lazy
```

Supported values:

- `lazy`
- `preload`

### `lazy`

Use `lazy` when:

- modal content is heavy
- first-open speed is acceptable
- the dashboard runs on slower tablets or wall panels

### `preload`

Use `preload` when:

- the modal is opened often
- first-open speed matters
- the content is relatively light

## Inline lazy loading

These fields control regular body loading:

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
    - type: entities
      entities:
        - sensor.network_health_sensor
```

## Runtime-safety settings

Use these when the dashboard needs predictable behavior on weaker hardware:

- `stability_mode`
- `remember_expanded_state`
- `remember_mode_state`
- `enable_card_pool`
- `pool_scope`
- `pool_ttl_ms`
- `pool_max_entries`

## Example combinations

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

### Conservative dashboard tuning

```yaml
type: custom:universal-card
title: Stable wall panel
lazy_load: true
lazy_initial_batch: 1
lazy_batch_size: 1
lazy_idle_timeout: 180
stability_mode: true
remember_expanded_state: false
enable_card_pool: true
pool_scope: card
pool_max_entries: 8
body:
  cards:
    - type: entities
      entities:
        - sensor.demo_temperature
        - sensor.demo_humidity
        - sensor.network_health_sensor
```

## Recommendation

Start with defaults.
Only switch to `preload` or tune batching when you have a real performance or UX reason.
