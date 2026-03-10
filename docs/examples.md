---
title: Examples Gallery
description: Production-ready examples rendered from real Home Assistant UI, paired with exact YAML for every major Universal Card capability group.
section_label: Examples
permalink: /examples/
---

# Examples Gallery

<div class="docs-callout docs-callout--warning">
  <strong>Rendering note.</strong> GitHub Pages is static and does not boot a Lovelace runtime. Every preview on this page is captured from a real Home Assistant dashboard rendered with the current <code>universal-card.js</code> bundle in dark theme.
</div>

## Coverage policy

This gallery is designed to cover the public feature surface in two ways:

- visual features are shown with real screenshots or GIFs
- behavior-first features are paired with exact YAML and linked feature docs
- editor coverage is shown separately because it is a distinct runtime surface

## Basic expandable card

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Default expand mode with entity state, badges, and inline body cards.</p>
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
    color_rules:
      - operator: ==
        value: 'on'
        color: var(--warning-color)
      - operator: ==
        value: 'off'
        color: var(--secondary-text-color)
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.kitchen_light
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity</code></pre>
  </div>
</div>

## Shared grid layout

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Shared <code>grid</code> contract with nested gauges and entity lists.</p>
    <img class="docs-showcase__media" src="{{ '/img/grid-layout-1.png' | relative_url }}" alt="Expanded grid layout screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Energy Grid
subtitle: Grid layout demo
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

## Advanced grid with spans

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Mixed column sizing, <code>colspan</code>, and <code>rowspan</code> in one composition.</p>
    <img class="docs-showcase__media" src="{{ '/img/grid-layout-2.png' | relative_url }}" alt="Advanced grid layout screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Advanced Grid
subtitle: Spans and mixed column sizing
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
        Multi-column composition with spans and mixed card types.
    - type: gauge
      entity: sensor.demo_temperature
      max: 30
    - type: entities
      rowspan: 2
      entities:
        - entity: input_select.house_mode
        - entity: sensor.network_health_sensor
        - entity: counter.notifications
    - type: button
      entity: input_boolean.kitchen_light
      name: Kitchen
    - type: button
      entity: input_boolean.security_armed
      name: Security</code></pre>
  </div>
</div>

## Modal mode with manual sizing

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Real modal open animation captured from Home Assistant UI.</p>
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

## Tabs mode

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Tabs mode rendered open with the shared tab-bar layout contract.</p>
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

## Carousel mode

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Carousel mode with explicit slide height, indicators, arrows, and looping.</p>
    <img class="docs-showcase__media" src="{{ '/img/carousel-mode-dark.png' | relative_url }}" alt="Carousel mode screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Mode Carousel
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

## Fullscreen mode

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Fullscreen overlay captured from the real HA dialog surface.</p>
    <img class="docs-showcase__media" src="{{ '/img/fullscreen-mode-dark.png' | relative_url }}" alt="Fullscreen mode screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Fullscreen Detail
body_mode: fullscreen
fullscreen:
  width: 92vw
  max_width: 96rem
  max_height: 94vh
  padding: 20px
body:
  cards:
    - type: markdown
      content: |
        ## Fullscreen demo
        Real Home Assistant overlay with nested Lovelace content.
    - type: entities
      entities:
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity
        - entity: sensor.network_health_sensor</code></pre>
  </div>
</div>

## Subview mode

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Subview drill-down into a route-backed Lovelace detail page.</p>
    <img class="docs-showcase__media" src="{{ '/img/subview-details-dark.png' | relative_url }}" alt="Subview detail screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Route Detail
body_mode: subview
subview:
  path: /fixture-dashboard/details
  return_on_close: true</code></pre>
  </div>
</div>

## Header layouts and badge rules

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Centered header preset with badge placement below content and icon-only badge actions.</p>
    <img class="docs-showcase__media" src="{{ '/img/header-options.png' | relative_url }}" alt="Header layout and badges screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Climate Center
subtitle: Main floor
icon: mdi:home-thermometer
icon_color: var(--accent-color)
header:
  layout:
    variant: centered
    gap: 16px
    content_gap: 4px
    badges_position: below_content
badges:
  - type: state
    entity: sensor.security_status
    icon: mdi:shield
    label: Security
    color_rules:
      - operator: ==
        value: armed
        color: var(--warning-color)
      - operator: ==
        value: disarmed
        color: var(--secondary-text-color)
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    icon_only: true
    icon_tap_action:
      action: toggle
    color_rules:
      - operator: ==
        value: 'on'
        color: gold
      - operator: ==
        value: 'off'
        color: var(--secondary-text-color)</code></pre>
  </div>
</div>

## Footer actions

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Footer cards stay visible on the root card surface while the body opens in a modal.</p>
    <img class="docs-showcase__media" src="{{ '/img/footer.png' | relative_url }}" alt="Footer actions screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Footer Actions
body_mode: modal
modal:
  width: 80vw
  max_width: 96rem
  loading_strategy: preload
footer:
  cards:
    - type: button
      name: Archive
    - type: button
      name: Snapshot
body:
  cards:
    - type: entities
      entities:
        - entity: counter.notifications
        - entity: sensor.house_mode_sensor</code></pre>
  </div>
</div>

## Visibility rules and root actions

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Root visibility, root actions, and badge color rules on one card.</p>
    <img class="docs-showcase__media" src="{{ '/img/visibility.png' | relative_url }}" alt="Visibility and actions screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Presence Gate
subtitle: Visibility and actions
icon: mdi:door
entity: input_boolean.away_mode
visibility:
  - condition: state
    entity: sensor.house_mode_sensor
    state: home
tap_action:
  action: more-info
hold_action:
  action: navigate
  navigation_path: /fixture-dashboard/details
badges:
  - type: state
    entity: input_boolean.security_armed
    icon: mdi:shield-check
    label: Armed
    color_rules:
      - operator: ==
        value: 'on'
        color: var(--warning-color)
      - operator: ==
        value: 'off'
        color: var(--secondary-text-color)</code></pre>
  </div>
</div>

## Swipe, context menu, and action surfaces

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Behavior-heavy features still render on the card surface, but are configured primarily through YAML.</p>
    <img class="docs-showcase__media" src="{{ '/img/actions.png' | relative_url }}" alt="Action surface screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Control Surface
subtitle: Swipe and context hooks
icon: mdi:gesture-double-tap
entity: input_boolean.security_armed
context_menu:
  items:
    - label: Open details
      icon: mdi:open-in-app
      action:
        action: navigate
        navigation_path: /fixture-dashboard/details
    - type: separator
    - label: Toggle alarm
      icon: mdi:shield
      action:
        action: toggle
        entity: input_boolean.security_armed
swipe:
  enabled: true
  direction: both
  threshold: 48
  velocityThreshold: 0.2
  preventScroll: true
  left:
    action: next
  right:
    action: prev
footer:
  actions:
    - icon: mdi:open-in-app
      label: Details
      action: navigate
      navigation_path: /fixture-dashboard/details
    - icon: mdi:shield-check
      label: Toggle
      action: toggle
      entity: input_boolean.security_armed</code></pre>
  </div>
</div>

## Themes, tokens, state styles, and custom CSS

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Theme resolution can be layered with token overrides, state-driven styles, and scoped custom CSS.</p>
    <img class="docs-showcase__media" src="{{ '/img/themes.png' | relative_url }}" alt="Styling overrides screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Runtime Styling
subtitle: Theme tokens and state styles
icon: mdi:palette-outline
icon_color: '#ffbf66'
entity: input_boolean.kitchen_light
theme: glass
theme_tokens:
  --uc-background-color: "linear-gradient(145deg, rgba(9, 16, 27, 0.96), rgba(23, 42, 59, 0.92))"
  --uc-border-color: "rgba(117, 204, 255, 0.36)"
  --uc-text-color: '#f8fbff'
  --uc-text-secondary-color: '#bfd7ea'
state_styles:
  'on':
    border_color: '#f4b400'
    box_shadow: "0 0 0 1px rgba(244, 180, 0, 0.36), 0 24px 52px rgba(244, 180, 0, 0.16)"
custom_css:
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
  - scope: card
    css: |
      .universal-card {
        backdrop-filter: blur(16px);
      }</code></pre>
  </div>
</div>

## Nested Lovelace cards

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Nested stacks, gauges, and standard Lovelace cards inside the body region.</p>
    <img class="docs-showcase__media" src="{{ '/img/nested-cards.png' | relative_url }}" alt="Nested Lovelace cards screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Night Stack
subtitle: Theme and nested cards
icon: mdi:weather-night
theme: tokyo-night
body:
  cards:
    - type: horizontal-stack
      cards:
        - type: gauge
          entity: sensor.demo_temperature
          max: 30
        - type: gauge
          entity: sensor.demo_humidity
          max: 100
    - type: entities
      entities:
        - entity: sensor.network_health_sensor
        - entity: counter.notifications</code></pre>
  </div>
</div>

## Editor coverage

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">The built-in editor is documented as a first-class surface, not an afterthought.</p>
    <img class="docs-showcase__media" src="{{ '/img/editor-overview-dark.png' | relative_url }}" alt="Universal Card editor screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>What the editor covers</h3>
    <ul>
      <li>core card metadata, entity binding, icon color, and theme selection</li>
      <li>modal, fullscreen, tabs, carousel, and subview settings</li>
      <li>header layout presets and badge rule editors</li>
      <li>visibility trees, section visibility, swipe controls, theme tokens, and state styles</li>
      <li>body and footer card composition plus advanced YAML fallback when needed</li>
    </ul>
    <p>Open the <a href="{{ '/features/editor/' | relative_url }}">editor feature page</a> for the editor-specific coverage map and current YAML-only gaps.</p>
  </div>
</div>

## Loading strategy and performance knobs

<div class="docs-callout">
  <strong>Behavior-first surface.</strong> Loading and runtime-performance options are public and documented, but they are timing-dependent. A static screenshot is less useful than exact YAML and guidance.
</div>

```yaml
type: custom:universal-card
title: Fast modal
body_mode: modal
lazy_load: true
lazy_initial_batch: 1
lazy_batch_size: 2
lazy_idle_timeout: 120
remember_mode_state: true
stability_mode: false
modal:
  loading_strategy: preload
body:
  cards:
    - type: button
      entity: light.kitchen
    - type: button
      entity: light.hall
```

Use the dedicated docs for the full rationale:

- [Loading Strategy]({{ '/features/loading-strategy/' | relative_url }})
- [Capability Reference]({{ '/features/capability-reference/' | relative_url }})
