---
title: Recipes by Use Case
description: Starter recipes grouped by real dashboard scenarios such as climate, security, media, wall panels, mobile dashboards, and admin tools.
section_label: Features
permalink: /features/recipes-by-use-case/
---

# Recipes by Use Case

This page groups Universal Card by real dashboard jobs instead of by config blocks.

## Use Case Index

| Scenario | Best fit |
| --- | --- |
| Climate summary | [Climate dashboard](#use-case-climate-dashboard) |
| Security controls | [Security dashboard](#use-case-security-dashboard) |
| Media and cameras | [Media and cameras](#use-case-media-and-cameras) |
| Wall-mounted tablet | [Wall panel](#use-case-wall-panel) |
| Mobile-first dashboard | [Mobile dashboard](#use-case-mobile-dashboard) |
| Admin-only utilities | [Admin tools](#use-case-admin-tools) |
| Compact status overview | [Status strip](#use-case-status-strip) |
| Styling-heavy hero card | [Hero card](#use-case-hero-card) |

## Use Case: Climate Dashboard

Use when one card should group temperature, humidity, and HVAC controls.

```yaml
type: custom:universal-card
title: Climate
subtitle: Main floor
icon: mdi:home-thermometer
body_mode: tabs
tabs:
  - label: Overview
    icon: mdi:view-dashboard
    cards:
      - type: entities
        entities:
          - entity: sensor.demo_temperature
          - entity: sensor.demo_humidity
  - label: HVAC
    icon: mdi:air-conditioner
    cards:
      - type: thermostat
        entity: climate.living_room
badges:
  - type: attribute
    entity: weather.home
    attribute: temperature
    icon: mdi:thermometer
    unit: °C
```

## Use Case: Security Dashboard

<div id="use-case-security-dashboard"></div>

Use when the card needs arm/disarm status, sensors, cameras, and actions.

```yaml
type: custom:universal-card
title: Security
icon: mdi:shield-home
body_mode: modal
modal:
  width: auto
  max_width: 72rem
grid:
  columns: 2
  gap: 12px
badges:
  - type: state
    entity: input_boolean.security_armed
    icon: mdi:shield-lock
    color_rules:
      - operator: ==
        value: 'on'
        color: gold
      - operator: ==
        value: 'off'
        color: gray
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
        - entity: sensor.security_status
    - type: picture-entity
      entity: camera.garden
footer:
  actions:
    - label: Cameras
      icon: mdi:cctv
      action:
        action: navigate
        navigation_path: /lovelace/cameras
```

## Use Case: Media And Cameras

Use when fullscreen is a better fit than inline expand.

```yaml
type: custom:universal-card
title: Media Room
body_mode: fullscreen
fullscreen:
  width: 92vw
  max_width: 96rem
  max_height: 94vh
  padding: 20px
body:
  cards:
    - type: media-control
      entity: media_player.living_room
    - type: picture-entity
      entity: camera.garden
```

## Use Case: Wall Panel

Use when a tablet runs the dashboard all day and predictability matters more than aggressive effects.

```yaml
type: custom:universal-card
title: Wall Panel Summary
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
        - entity: sensor.network_health_sensor
```

## Use Case: Mobile Dashboard

<div id="use-case-mobile-dashboard"></div>

Use when space is tight and overlays or one-column layouts are safer.

```yaml
type: custom:universal-card
title: Mobile Summary
body_mode: none
header:
  layout:
    variant: stacked
    badges_position: below_content
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    icon_only: true
  - type: state
    entity: vacuum.robot
    icon: mdi:robot-vacuum
    icon_only: true
tap_action:
  action: navigate
  navigation_path: /lovelace/mobile-controls
```

## Use Case: Admin Tools

Use when controls or diagnostics should only appear for privileged users.

```yaml
type: custom:universal-card
title: Admin Controls
visibility:
  - condition: user
    is_admin: true
section_visibility:
  footer:
    - condition: screen
      min_width: 768
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
        - entity: sensor.network_health_sensor
footer:
  actions:
    - label: Logs
      icon: mdi:file-document-outline
      action:
        action: navigate
        navigation_path: /config/logs
```

## Use Case: Status Strip

Use when the card should act like a compact status header with little or no body.

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

## Use Case: Hero Card

Use when the card is a visual focal point and styling matters as much as content.

```yaml
type: custom:universal-card
title: Evening Ambience
subtitle: Main room
icon: mdi:weather-night
theme: midnight
header:
  layout:
    variant: centered
    align: center
    badges_position: below_content
theme_tokens:
  --uc-background-color: "linear-gradient(145deg, rgba(9,16,27,.96), rgba(23,42,59,.92))"
  --uc-border-color: "rgba(117, 204, 255, 0.36)"
custom_css:
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
badges:
  - type: custom
    icon: mdi:sofa
    label: Scene
    value: Evening
```

## Picking The Right Page

- Use [Examples Gallery]({{ '/examples/' | relative_url }}) when you want a broad recipe catalog with screenshots.
- Use [YAML Block Reference]({{ '/features/yaml-block-reference/' | relative_url }}) when you already know the config block you need.
