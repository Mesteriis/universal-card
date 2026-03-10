---
title: Examples Gallery
description: Use-case recipes for the full Universal Card feature surface, paired with real Home Assistant captures where that adds value.
section_label: Examples
permalink: /examples/
---

# Examples Gallery

<div class="docs-callout docs-callout--warning">
  <strong>Preview model.</strong> Visual examples use real Home Assistant screenshots and GIFs. Behavior-first examples use exact YAML when a static screenshot would not explain the feature well.
</div>

## How To Use This Page

Use this page in two ways:

1. jump to a use case and copy the closest recipe
2. use [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }}) when you already know which config block you need

If you want starter configs grouped by real dashboard scenarios, use [Recipes by Use Case]({{ '/features/recipes-by-use-case/' | relative_url }}).

Focused guides for the main recipe families:

- [Grid Layout]({{ '/features/grid-layout/' | relative_url }})
- [Footer]({{ '/features/footer/' | relative_url }})
- [Visibility]({{ '/features/visibility/' | relative_url }})
- [Actions And Gestures]({{ '/features/interactions/' | relative_url }})
- [Theming Guide]({{ '/features/theming-guide/' | relative_url }})

## Recipe Index

| Use case | Best recipe |
| --- | --- |
| First card | [Basic expandable card](#recipe-basic-expandable-card) |
| Two-column summary | [Grid layout](#recipe-grid-layout) |
| Mixed spans dashboard | [Advanced grid with spans](#recipe-advanced-grid-with-spans) |
| Focused overlay | [Modal with responsive sizing](#recipe-modal-with-responsive-sizing) |
| Instant modal open | [Modal with preload](#recipe-modal-with-preload) |
| Large media card | [Fullscreen mode](#recipe-fullscreen-mode) |
| Grouped content | [Tabs mode](#recipe-tabs-mode) |
| Slide-based navigation | [Carousel mode](#recipe-carousel-mode) |
| Route-based detail page | [Subview mode](#recipe-subview-mode) |
| Header-only launcher | [Header-only card](#recipe-header-only-card) |
| Header redesign | [Header layout presets](#recipe-header-layout-presets) |
| Compact status row | [Badge rules and icon-only mode](#recipe-badge-rules-and-icon-only-mode) |
| Footer actions | [Footer cards and actions](#recipe-footer-cards-and-actions) |
| Card shell actions | [Root actions and context menu](#recipe-root-actions-and-context-menu) |
| Conditional UI | [Visibility and section visibility](#recipe-visibility-and-section-visibility) |
| Swipe navigation | [Swipe gestures](#recipe-swipe-gestures) |
| Themed card | [Themes, tokens, and state styles](#recipe-themes-tokens-and-state-styles) |
| Stable wall panel | [Loading strategy and stable wall panel setup](#recipe-loading-strategy-and-stable-wall-panel-setup) |
| Nested dashboard | [Nested cards](#recipe-nested-cards) |
| Editor-first workflow | [Editor-driven setup](#recipe-editor-driven-setup) |

## Layout Recipes

### Recipe: Basic expandable card

<div id="recipe-basic-expandable-card" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Default card with entity, badges, and inline content.</p>
    <img class="docs-showcase__media" src="{{ '/img/basic-card-dark.png' | relative_url }}" alt="Expanded basic Universal Card screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Living Room
subtitle: Lights and comfort
icon: mdi:sofa
entity: input_boolean.kitchen_light
theme: glass
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    label: Light
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.kitchen_light
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity</code></pre>
  </div>
</div>

### Recipe: Grid layout

<div id="recipe-grid-layout" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Two-column grid for compact dashboard summaries.</p>
    <img class="docs-showcase__media" src="{{ '/img/grid-layout-1.png' | relative_url }}" alt="Expanded grid layout screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Energy Grid
icon: mdi:flash
grid:
  columns: 2
  gap: 12px
body:
  cards:
    - type: gauge
      entity: sensor.demo_temperature
    - type: gauge
      entity: sensor.demo_humidity
    - type: entities
      colspan: 2
      entities:
        - entity: sensor.security_status
        - entity: sensor.network_health_sensor</code></pre>
  </div>
</div>

### Recipe: Advanced grid with spans

<div id="recipe-advanced-grid-with-spans" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Mixed column sizing with colspan and rowspan.</p>
    <img class="docs-showcase__media" src="{{ '/img/grid-layout-2.png' | relative_url }}" alt="Advanced grid layout screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Advanced Grid
subtitle: Spans and mixed columns
icon: mdi:grid-large
theme: minimal
grid:
  columns: "1.4fr 0.8fr 1fr"
  gap: 10px
body:
  cards:
    - type: markdown
      colspan: 2
      content: |
        ### Power Mix
        Multi-column composition with spans.
    - type: gauge
      entity: sensor.demo_temperature
      max: 30
    - type: entities
      rowspan: 2
      entities:
        - entity: input_select.house_mode
        - entity: sensor.network_health_sensor
    - type: button
      entity: input_boolean.kitchen_light
      name: Kitchen
    - type: button
      entity: input_boolean.security_armed
      name: Security</code></pre>
  </div>
</div>

### Recipe: Modal with responsive sizing

<div id="recipe-modal-with-responsive-sizing" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Real modal open animation from Home Assistant.</p>
    <img class="docs-showcase__media" src="{{ '/img/modal-open-dark.gif' | relative_url }}" alt="Modal open animation in dark theme">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Security Controls
body_mode: modal
icon: mdi:shield-home
modal:
  width: auto
  max_width: 72rem
  max_height: 85vh
  loading_strategy: lazy
grid:
  columns: 2
  gap: 12px
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
        - entity: sensor.security_status
    - type: vertical-stack
      cards:
        - type: entities
          entities:
            - entity: sensor.demo_temperature
            - entity: sensor.demo_humidity</code></pre>
  </div>
</div>

### Recipe: Modal with preload

```yaml
type: custom:universal-card
title: Frequently Used Controls
body_mode: modal
modal:
  width: auto
  max_width: 56rem
  loading_strategy: preload
body:
  cards:
    - type: button
      entity: input_boolean.kitchen_light
    - type: button
      entity: input_boolean.security_armed
    - type: button
      entity: script.evening_scene
```

### Recipe: Fullscreen mode

<div id="recipe-fullscreen-mode" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Fullscreen body mode for large media and immersive layouts.</p>
    <img class="docs-showcase__media" src="{{ '/img/fullscreen-mode-dark.png' | relative_url }}" alt="Fullscreen mode screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Camera Wall
body_mode: fullscreen
fullscreen:
  width: 92vw
  max_width: 96rem
  max_height: 94vh
  padding: 20px
body:
  cards:
    - type: picture-entity
      entity: camera.garden</code></pre>
  </div>
</div>

### Recipe: Tabs mode

<div id="recipe-tabs-mode" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Tab-based grouping inside one card.</p>
    <img class="docs-showcase__media" src="{{ '/img/tabs-mode-dark.png' | relative_url }}" alt="Tabs mode screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Climate Tabs
body_mode: tabs
tabs_config:
  content_padding: 12px
  tab_min_width: 96px
  tab_alignment: center
tabs:
  - label: Climate
    icon: mdi:home-thermometer
    cards:
      - type: entities
        entities:
          - entity: sensor.demo_temperature
          - entity: sensor.demo_humidity
  - label: Security
    icon: mdi:shield-lock
    cards:
      - type: entities
        entities:
          - entity: input_boolean.security_armed
          - entity: sensor.security_status</code></pre>
  </div>
</div>

### Recipe: Carousel mode

<div id="recipe-carousel-mode" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Slide-based navigation with autoplay and indicators.</p>
    <img class="docs-showcase__media" src="{{ '/img/carousel-mode-dark.png' | relative_url }}" alt="Carousel mode screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Daily Overview
body_mode: carousel
carousel_autoplay: true
carousel_interval: 4500
carousel_options:
  show_arrows: true
  show_indicators: true
  loop: true
  height: 20rem
body:
  cards:
    - type: entities
      title: Status
      entities:
        - entity: sensor.network_health_sensor
        - entity: sensor.house_mode_sensor
    - type: entities
      title: Comfort
      entities:
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity</code></pre>
  </div>
</div>

### Recipe: Subview mode

<div id="recipe-subview-mode" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Subview mode for route-based details.</p>
    <img class="docs-showcase__media" src="{{ '/img/subview-details-dark.png' | relative_url }}" alt="Subview details screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: More Details
body_mode: subview
subview:
  navigation_path: /lovelace/details
  return_on_close: true</code></pre>
  </div>
</div>

### Recipe: Header-only card

<div id="recipe-header-only-card" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Use <code>body_mode: none</code> for compact status or launcher cards.</p>
    <img class="docs-showcase__media" src="{{ '/img/header-options.png' | relative_url }}" alt="Header options screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Quick Actions
subtitle: Header only
body_mode: none
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    icon_only: true
tap_action:
  action: navigate
  navigation_path: /lovelace/controls</code></pre>
  </div>
</div>

## Header And Status Recipes

### Recipe: Header layout presets

<div id="recipe-header-layout-presets" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Header variants with different badge placement and spacing.</p>
    <img class="docs-showcase__media" src="{{ '/img/header-options.png' | relative_url }}" alt="Header layout screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Kitchen
subtitle: Lights and scenes
header:
  layout:
    variant: stacked
    gap: 18px
    content_gap: 6px
    badges_position: below_content
badges:
  - type: state
    entity: input_boolean.kitchen_light
    label: Main
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.kitchen_light</code></pre>
  </div>
</div>

### Recipe: Centered hero header

```yaml
type: custom:universal-card
title: Climate
subtitle: Main floor
icon: mdi:home-thermometer
header:
  layout:
    variant: centered
    align: center
    badges_position: below_content
badges:
  - type: attribute
    entity: weather.home
    attribute: temperature
    icon: mdi:thermometer
    unit: °C
body:
  cards:
    - type: thermostat
      entity: climate.living_room
```

### Recipe: Badge rules and icon-only mode

<div id="recipe-badge-rules-and-icon-only-mode" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Header badges with color rules and compact icon-only chips.</p>
    <img class="docs-showcase__media" src="{{ '/img/header-options.png' | relative_url }}" alt="Badge layout screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Header Status
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    label: Main light
    color_rules:
      - operator: ==
        value: 'on'
        color: gold
      - operator: ==
        value: 'off'
        color: gray
  - type: state
    entity: vacuum.robot
    icon: mdi:robot-vacuum
    icon_only: true
    visibility:
      - operator: !=
        value: docked
    icon_tap_action:
      action: more-info</code></pre>
  </div>
</div>

### Recipe: Attribute badge cluster

```yaml
type: custom:universal-card
title: Weather Summary
badges:
  - type: attribute
    entity: weather.home
    attribute: temperature
    icon: mdi:thermometer
    label: Temp
    unit: °C
  - type: attribute
    entity: weather.home
    attribute: humidity
    icon: mdi:water-percent
    label: Humidity
    unit: '%'
  - type: custom
    icon: mdi:weather-windy
    label: Wind
    value: 14
    unit: km/h
```

### Recipe: Header slots with sticky state

```yaml
type: custom:universal-card
title: Hallway
entity: sensor.demo_temperature
show_state: true
sticky_header: true
header_left:
  cards:
    - type: button
      icon: mdi:arrow-left
header_right:
  cards:
    - type: button
      icon: mdi:cog
body:
  cards:
    - type: entities
      entities:
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity
```

## Footer And Interaction Recipes

### Recipe: Footer cards and actions

<div id="recipe-footer-cards-and-actions" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Footer content for secondary status and quick actions.</p>
    <img class="docs-showcase__media" src="{{ '/img/footer.png' | relative_url }}" alt="Footer screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Security Summary
footer:
  text: Last check 2 min ago
  actions:
    - label: Arm
      icon: mdi:shield-lock
      action:
        action: call-service
        service: input_boolean.turn_on
        entity: input_boolean.security_armed
    - label: Cameras
      icon: mdi:cctv
      action:
        action: navigate
        navigation_path: /lovelace/cameras
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
        - entity: sensor.security_status</code></pre>
  </div>
</div>

### Recipe: Footer slot cards

```yaml
type: custom:universal-card
title: Media Room
footer_left:
  cards:
    - type: button
      icon: mdi:skip-previous
footer_right:
  cards:
    - type: button
      icon: mdi:skip-next
footer:
  text: Media shortcuts
body:
  cards:
    - type: media-control
      entity: media_player.living_room
```

### Recipe: Root actions and context menu

<div id="recipe-root-actions-and-context-menu" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Actions work on the card shell, badges, footer, and optional context surfaces.</p>
    <img class="docs-showcase__media" src="{{ '/img/actions.png' | relative_url }}" alt="Actions screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Action Card
tap_action:
  action: navigate
  navigation_path: /lovelace/energy
hold_action:
  action: more-info
double_tap_action:
  action: toggle
context_menu:
  items:
    - label: Open details
      icon: mdi:open-in-new
      action:
        action: navigate
        navigation_path: /lovelace/details
    - separator: true
    - label: More info
      icon: mdi:information-outline
      action:
        action: more-info
body:
  cards:
    - type: markdown
      content: Tap, hold, double tap, or open the context menu.</code></pre>
  </div>
</div>

### Recipe: Visibility and section visibility

<div id="recipe-visibility-and-section-visibility" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Visibility can target the full card or only specific regions.</p>
    <img class="docs-showcase__media" src="{{ '/img/visibility.png' | relative_url }}" alt="Visibility screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Admin Controls
visibility:
  - condition: screen
    min_width: 768
section_visibility:
  footer:
    - condition: user
      is_admin: true
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
        - entity: sensor.security_status
footer:
  text: Admin-only footer actions</code></pre>
  </div>
</div>

### Recipe: Swipe gestures

<div id="recipe-swipe-gestures" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Swipe is behavior-first, so the YAML is the important part here.</p>
    <img class="docs-showcase__media" src="{{ '/img/actions.png' | relative_url }}" alt="Actions and gestures screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Gesture Card
body_mode: carousel
swipe:
  enabled: true
  direction: horizontal
  threshold: 60
  velocityThreshold: 0.35
  preventScroll: true
  left:
    action: next
  right:
    action: prev
body:
  cards:
    - type: entities
      entities:
        - entity: sensor.demo_temperature
    - type: entities
      entities:
        - entity: sensor.demo_humidity</code></pre>
  </div>
</div>

## Styling Recipes

### Recipe: Themes, tokens, and state styles

<div id="recipe-themes-tokens-and-state-styles" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Built-in themes plus fine-grained style overrides.</p>
    <img class="docs-showcase__media" src="{{ '/img/themes.png' | relative_url }}" alt="Themes screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Styled Card
entity: input_boolean.kitchen_light
theme: midnight
icon_color: '#7cd6ff'
theme_tokens:
  --uc-background-color: "linear-gradient(145deg, rgba(9,16,27,.96), rgba(23,42,59,.92))"
  --uc-border-color: "rgba(117, 204, 255, 0.36)"
state_styles:
  'on':
    border_color: '#f4b400'
    box_shadow: "0 0 0 1px rgba(244,180,0,.36), 0 24px 52px rgba(244,180,0,.16)"
  'off':
    opacity: 0.72
custom_css:
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }</code></pre>
  </div>
</div>

### Recipe: Theme-only quick restyle

```yaml
type: custom:universal-card
title: Midnight Summary
theme: midnight
body:
  cards:
    - type: entities
      entities:
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity
```

### Recipe: Custom CSS accent

```yaml
type: custom:universal-card
title: Accent Card
theme: minimal
custom_css:
  - scope: card
    css: |
      .universal-card {
        border: 1px solid rgba(124, 214, 255, 0.28);
      }
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.08em;
      }
body:
  cards:
    - type: markdown
      content: Accent styling example
```

## Performance And Editor Recipes

### Recipe: Loading strategy and stable wall panel setup

<div id="recipe-loading-strategy-and-stable-wall-panel-setup" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Use lazy loading and stability settings for heavier dashboards.</p>
    <img class="docs-showcase__media" src="{{ '/img/lazy-loading.png' | relative_url }}" alt="Lazy loading screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
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
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity
        - entity: sensor.network_health_sensor</code></pre>
  </div>
</div>

### Recipe: Nested cards

<div id="recipe-nested-cards" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Nested cards and stacks for complex dashboards.</p>
    <img class="docs-showcase__media" src="{{ '/img/nested-cards.png' | relative_url }}" alt="Nested cards screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Operations Hub
grid:
  columns: 2
  gap: 12px
body:
  cards:
    - type: vertical-stack
      cards:
        - type: entities
          entities:
            - entity: sensor.demo_temperature
            - entity: sensor.demo_humidity
        - type: horizontal-stack
          cards:
            - type: button
              entity: input_boolean.kitchen_light
            - type: button
              entity: input_boolean.security_armed
    - type: entities
      entities:
        - entity: sensor.network_health_sensor
        - entity: counter.notifications</code></pre>
  </div>
</div>

### Recipe: Editor-driven setup

<div id="recipe-editor-driven-setup" class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">The visual editor covers shell, body modes, badges, visibility, swipe, and styling.</p>
    <img class="docs-showcase__media" src="{{ '/img/editor-overview-dark.png' | relative_url }}" alt="Editor screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>Recommended workflow</h3>
    <pre><code class="language-text">1. Set title, icon, entity, and body mode.
2. Add header layout and badges.
3. Configure tabs, carousel, fullscreen, modal, or subview settings.
4. Add visibility, swipe, and theme tokens.
5. Drop to YAML only for advanced CSS, action payloads, and complex grid strings.</code></pre>
  </div>
</div>

### Recipe: Badge-only status card

```yaml
type: custom:universal-card
title: Services
body_mode: none
badges:
  - type: state
    entity: sensor.network_health_sensor
    label: Network
  - type: counter
    icon: mdi:bell
    entities:
      - binary_sensor.front_door
      - binary_sensor.back_door
    count_state: 'on'
    label: Alerts
```

### Recipe: Compact dashboard launcher

```yaml
type: custom:universal-card
title: Cameras
subtitle: Open security view
body_mode: none
icon: mdi:cctv
tap_action:
  action: navigate
  navigation_path: /lovelace/cameras
```

### Recipe: Modal quick-control sheet

```yaml
type: custom:universal-card
title: Evening Scene
body_mode: modal
modal:
  width: auto
  max_width: 48rem
body:
  cards:
    - type: button
      entity: script.evening_scene
    - type: button
      entity: input_boolean.kitchen_light
    - type: button
      entity: input_boolean.security_armed
```

## Related Docs

- [Configuration]({{ '/configuration/' | relative_url }})
- [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }})
- [Grid Layout]({{ '/features/grid-layout/' | relative_url }})
- [Footer]({{ '/features/footer/' | relative_url }})
- [Visibility]({{ '/features/visibility/' | relative_url }})
- [Actions And Gestures]({{ '/features/interactions/' | relative_url }})
