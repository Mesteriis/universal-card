---
title: Examples Gallery
description: Visual previews captured from real card renders, paired with copyable YAML for the main Universal Card scenarios.
section_label: Examples
permalink: /examples/
---

# Examples Gallery

<div class="docs-callout docs-callout--warning">
  <strong>Rendering note.</strong> GitHub Pages is static and does not boot a Lovelace runtime. This gallery therefore uses screenshots and GIFs captured from real <code>Universal Card</code> renders and pairs them with the exact YAML patterns you can copy into Home Assistant.
</div>

## Basic dashboard card

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Compact entity-driven card with nested body content.</p>
    <img class="docs-showcase__media" src="{{ '/img/body-modes-demo.gif' | relative_url }}" alt="Universal Card body modes demo">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Living Room
subtitle: Lights and media
icon: mdi:sofa
entity: light.living_room
body:
  cards:
    - type: entities
      entities:
        - light.living_room
        - media_player.living_room_tv</code></pre>
  </div>
</div>

## Grid layout with spans

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Shared grid contract with multi-column composition.</p>
    <img class="docs-showcase__media" src="{{ '/img/grid-layout-1.png' | relative_url }}" alt="Grid layout screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Energy Overview
grid:
  columns: 3
  gap: 16px
body:
  cards:
    - type: gauge
      entity: sensor.solar_power
      colspan: 2
    - type: gauge
      entity: sensor.grid_load
    - type: entities
      entities:
        - sensor.solar_today
        - sensor.grid_today
      rowspan: 2</code></pre>
  </div>
</div>

## Modal layout with explicit sizing

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Modal body mode with responsive sizing and nested cards.</p>
    <img class="docs-showcase__media" src="{{ '/img/body-modes-demo.gif' | relative_url }}" alt="Body modes demo gif">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Security Controls
icon: mdi:shield-home
body_mode: modal
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
        - lock.front_door
        - alarm_control_panel.house
    - type: vertical-stack
      cards:
        - type: glance
          entities:
            - binary_sensor.window_kitchen
            - binary_sensor.window_bedroom</code></pre>
  </div>
</div>

## Tabs mode with grouped content

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Tabs keep related cards grouped without forcing a modal or route change.</p>
    <img class="docs-showcase__media" src="{{ '/img/body-modes-demo.gif' | relative_url }}" alt="Body mode preview gif">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Smart Home
body_mode: tabs
tabs_config:
  content_padding: 12px
  tab_min_width: 96px
  tab_alignment: center
tabs:
  - label: Lights
    icon: mdi:lightbulb-group
    cards:
      - type: entities
        entities:
          - light.kitchen
          - light.hall
  - label: Cameras
    icon: mdi:cctv
    cards:
      - type: picture-entity
        entity: camera.front_door</code></pre>
  </div>
</div>

## Fullscreen mode for immersive content

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Fullscreen mode is best for dense detail views such as cameras, maps, or admin panels.</p>
    <img class="docs-showcase__media" src="{{ '/img/body-modes-demo.gif' | relative_url }}" alt="Fullscreen body mode preview gif">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Front Door
icon: mdi:cctv
body_mode: fullscreen
fullscreen:
  width: 92vw
  max_width: 96rem
  max_height: 94vh
  padding: 20px
body:
  cards:
    - type: picture-entity
      entity: camera.front_door</code></pre>
  </div>
</div>

## Subview navigation

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Subview mode is route-driven and works best when the detail lives in a dedicated Lovelace view.</p>
    <img class="docs-showcase__media" src="{{ '/img/body-modes-demo.gif' | relative_url }}" alt="Subview body mode preview gif">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Advanced Details
icon: mdi:arrow-right-circle
body_mode: subview
subview:
  path: /lovelace/details
  return_on_close: true
tap_action:
  action: navigate
  navigation_path: /lovelace/details</code></pre>
  </div>
</div>

## Header layouts and badges

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Preset-based header layout plus rule-driven badges.</p>
    <img class="docs-showcase__media" src="{{ '/img/header-options.png' | relative_url }}" alt="Header options screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Climate
subtitle: Main floor
icon: mdi:home-thermometer
header:
  layout:
    variant: centered
    gap: 16px
    content_gap: 4px
    badges_position: below_content
badges:
  - type: state
    entity: climate.main_floor
    icon: mdi:thermometer
    icon_only: true
    color_rules:
      - operator: ==
        value: heat
        color: var(--warning-color)
      - operator: ==
        value: off
        color: var(--secondary-text-color)</code></pre>
  </div>
</div>

## Visibility rules and actions

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Conditional rendering and action-driven interaction.</p>
    <img class="docs-showcase__media" src="{{ '/img/visibility.png' | relative_url }}" alt="Visibility rules screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Entry
icon: mdi:door
entity: binary_sensor.front_door
visibility:
  - entity: person.owner
    operator: ==
    value: home
tap_action:
  action: more-info
hold_action:
  action: navigate
  navigation_path: /lovelace/security
badges:
  - type: state
    entity: lock.front_door
    label: Lock
    tap_action:
      action: toggle</code></pre>
  </div>
</div>

## Themes and nested cards

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Built-in themes plus nested Lovelace card composition.</p>
    <img class="docs-showcase__media" src="{{ '/img/nested-cards.png' | relative_url }}" alt="Nested cards screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Media Hub
theme: glass
expanded: true
body:
  cards:
    - type: vertical-stack
      cards:
        - type: media-control
          entity: media_player.living_room_tv
        - type: horizontal-stack
          cards:
            - type: button
              name: Netflix
            - type: button
              name: Spotify</code></pre>
  </div>
</div>

## Footer actions and loading strategy

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Footer actions with a modal preloading strategy for faster open.</p>
    <img class="docs-showcase__media" src="{{ '/img/footer.png' | relative_url }}" alt="Footer screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Cameras
icon: mdi:cctv
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
    - type: picture-entity
      entity: camera.front_door</code></pre>
  </div>
</div>

## Theme gallery and performance hints

<div class="docs-showcase">
  <div class="docs-showcase__panel">
    <h3>Rendered preview</h3>
    <p class="docs-showcase__meta">Theme library and loading behavior are best reviewed together.</p>
    <img class="docs-showcase__media" src="{{ '/img/themes.png' | relative_url }}" alt="Themes screenshot">
  </div>
  <div class="docs-showcase__panel">
    <h3>YAML</h3>
    <pre><code class="language-yaml">type: custom:universal-card
title: Theme Lab
theme: tokyo-night
body_mode: carousel
carousel_autoplay: true
carousel_interval: 4500
carousel_options:
  show_arrows: false
  show_indicators: true
  loop: true
body:
  cards:
    - type: entities
      entities:
        - sensor.temperature
        - sensor.humidity
    - type: entities
      entities:
        - sensor.power
        - sensor.energy_today</code></pre>
  </div>
</div>

## Where to go next

- [Feature Map]({{ '/features/' | relative_url }}) for a capability-by-capability overview.
- [Modal Layout]({{ '/features/modal-layout/' | relative_url }}) for the sizing and grid rules behind modal examples.
- [Body Modes Layout]({{ '/features/body-modes-layout/' | relative_url }}) for fullscreen, tabs, carousel, and subview details.
- [Header Layout]({{ '/features/header-layout/' | relative_url }}) and [Badges]({{ '/features/badges/' | relative_url }}) for the header examples above.
