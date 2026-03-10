---
title: Actions And Gestures
description: Tap, hold, double-tap, badge actions, context menu, and swipe gestures in Universal Card.
section_label: Features
permalink: /features/interactions/
---

# Actions And Gestures

Universal Card supports several interaction layers.

Use them to make the card behave like a compact control surface instead of a passive display.

## Interaction layers

| Area | Main fields |
| --- | --- |
| Card shell | `tap_action`, `hold_action`, `double_tap_action` |
| Badges | `badges[].tap_action`, `badges[].icon_tap_action` |
| Footer | `footer.actions[]`, `footer.tap_action`, `footer.hold_action` |
| Context menu | `context_menu.items[]` |
| Swipe gestures | `swipe.*` |

## Root actions

Use root actions when the whole card should behave like one primary control.

```yaml
type: custom:universal-card
title: Security
tap_action:
  action: more-info
hold_action:
  action: navigate
  navigation_path: /lovelace/security
double_tap_action:
  action: toggle
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
```

## Badge actions

Use badge actions for small direct controls.

```yaml
badges:
  - type: state
    entity: light.kitchen
    icon: mdi:lightbulb
    label: Kitchen
    tap_action:
      action: toggle
    icon_tap_action:
      action: more-info
```

## Context menu

Use `context_menu` for secondary actions that should not be always visible.

```yaml
context_menu:
  items:
    - label: Open dashboard
      icon: mdi:view-dashboard
      action: navigate
      navigation_path: /lovelace/overview
    - label: More info
      icon: mdi:information-outline
      action: more-info
```

## Swipe gestures

Use `swipe` for directional shortcuts.

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Swipe and action surfaces are usually combined with normal card content.</p>
    <img class="docs-showcase__media" src="{{ '/img/interactions-dark.png' | relative_url }}" alt="Actions and gestures screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Room Controls
swipe:
  enabled: true
  direction: horizontal
  threshold: 60
  left:
    action: navigate
    navigation_path: /lovelace/left-room
  right:
    action: navigate
    navigation_path: /lovelace/right-room
body:
  cards:
    - type: entities
      entities:
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity</code></pre>
  </div>
</div>

## Practical guidance

1. keep one interaction primary and obvious
2. use context menu for lower-priority actions
3. use swipe only when directional navigation is natural
4. avoid stacking too many gesture types on a tiny card

## Editor coverage

The visual editor covers:

- root action shells in the normal form sections
- `swipe.*`

YAML remains better for:

- larger action payloads
- detailed context menu item lists
- complex badge action setups

## Related Docs

- [Badges]({{ '/features/badges/' | relative_url }})
- [Footer]({{ '/features/footer/' | relative_url }})
- [Examples Gallery]({{ '/examples/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
