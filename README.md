# 🎴 Universal Card

<p align="center">
  <img src="docs/img/body-modes-demo.gif" alt="Universal Card Demo" width="800"/>
</p>

<p align="center">
  <a href="https://github.com/Mesteriis/universal-card">
    <img src="https://img.shields.io/badge/Home%20Assistant-2024.1+-brightgreen?style=flat-square" alt="HA version"/>
  </a>
  <a href="https://github.com/hacs/integration">
    <img src="https://img.shields.io/badge/HACS-Custom-orange?style=flat-square" alt="HACS"/>
  </a>
  <a href="https://github.com/Mesteriis/universal-card/actions/workflows/build.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/Mesteriis/universal-card/build.yml?style=flat-square&label=build" alt="Build Status"/>
  </a>
  <a href="https://github.com/Mesteriis/universal-card/releases">
    <img src="https://img.shields.io/github/v/release/Mesteriis/universal-card?style=flat-square" alt="Release"/>
  </a>
</p>

<p align="center">
  <b>Продвинутая Lovelace-карточка для Home Assistant</b><br>
  7 body modes • Grid layout • Header layouts • Badges • Footer • Lazy loading • Visual editor
</p>

---

## Что это

`Universal Card` это гибкая карточка для Home Assistant, которая умеет быть:

- обычной expandable карточкой
- modal или fullscreen overlay
- tabs-контейнером
- carousel-контейнером
- subview launcher
- компактной header-only карточкой

В карточке есть:

- grid layout с `colspan` и `rowspan`
- header presets и badges
- footer с действиями
- visibility и section visibility
- root actions и swipe gestures
- themes, `theme_tokens`, `state_styles`, `custom_css`
- встроенный visual editor

## Документация

Основные страницы:

- [Feature Map](docs/features/index.md)
- [Configuration](docs/configuration.md)
- [Examples Gallery](docs/examples.md)
- [YAML Block Reference](docs/features/yaml-block-reference.md)
- [Grid Layout](docs/features/grid-layout.md)
- [Footer](docs/features/footer.md)
- [Visibility](docs/features/visibility.md)
- [Actions And Gestures](docs/features/interactions.md)
- [Recipes by Use Case](docs/features/recipes-by-use-case.md)
- [Modal Layout](docs/features/modal-layout.md)
- [Body Modes Layout](docs/features/body-modes-layout.md)
- [Header Layout](docs/features/header-layout.md)
- [Badges](docs/features/badges.md)
- [Theming Guide](docs/features/theming-guide.md)
- [Loading Strategy](docs/features/loading-strategy.md)
- [Editor](docs/features/editor.md)
- [Release Notes](docs/release-notes.md)

GitHub Pages:

- <https://mesteriis.github.io/universal-card/>

---

## Установка

### HACS

1. Откройте **HACS** → **Frontend**
2. Нажмите **+** и найдите **Universal Card**
3. Установите карточку
4. Обновите страницу Home Assistant

### Ручная установка

1. Скачайте последний релиз из [GitHub Releases](https://github.com/Mesteriis/universal-card/releases)
2. Скопируйте `universal-card.js` и папку `lazy/` в `/config/www/universal-card/`
3. Добавьте resource в Lovelace:

```yaml
url: /local/universal-card/universal-card.js
type: module
```

4. Обновите страницу Home Assistant

---

## Быстрый старт

### Минимальная карточка

```yaml
type: custom:universal-card
title: Example
body:
  cards:
    - type: markdown
      content: Hello
```

### Базовая expandable карточка

```yaml
type: custom:universal-card
title: Living Room
subtitle: Lights and comfort
icon: mdi:sofa
entity: input_boolean.kitchen_light
theme: glass
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.kitchen_light
        - entity: sensor.demo_temperature
        - entity: sensor.demo_humidity
```

### Modal карточка

```yaml
type: custom:universal-card
title: Security Controls
body_mode: modal
icon: mdi:shield-home
modal:
  width: auto
  max_width: 72rem
  max_height: 85vh
  loading_strategy: lazy
body:
  cards:
    - type: entities
      entities:
        - entity: input_boolean.security_armed
        - entity: sensor.security_status
```

### Tabs карточка

```yaml
type: custom:universal-card
title: Climate Tabs
body_mode: tabs
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
          - entity: sensor.security_status
```

### Header с badges

```yaml
type: custom:universal-card
title: Kitchen
subtitle: Lights and scenes
header:
  layout:
    variant: stacked
    badges_position: below_content
badges:
  - type: state
    entity: input_boolean.kitchen_light
    icon: mdi:lightbulb
    label: Main
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
        - entity: input_boolean.kitchen_light
```

## Top 10 Recipes

Самые полезные стартовые точки:

1. [Basic expandable card](docs/examples.md#recipe-basic-expandable-card)
2. [Modal detail card](docs/examples.md#recipe-modal-with-responsive-sizing)
3. [Fullscreen media card](docs/examples.md#recipe-fullscreen-mode)
4. [Tabs card](docs/examples.md#recipe-tabs-mode)
5. [Badge status row](docs/examples.md#recipe-badge-rules-and-icon-only-mode)
6. [Conditional UI](docs/examples.md#recipe-visibility-and-section-visibility)
7. [Theme override card](docs/examples.md#recipe-themes-tokens-and-state-styles)
8. [Stable wall panel](docs/examples.md#recipe-loading-strategy-and-stable-wall-panel-setup)
9. [Security dashboard recipe](docs/features/recipes-by-use-case.md#use-case-security-dashboard)
10. [Mobile dashboard recipe](docs/features/recipes-by-use-case.md#use-case-mobile-dashboard)

---

## Основные возможности

### Body modes

| Mode | Назначение |
| --- | --- |
| `expand` | inline detail under the header |
| `modal` | overlay without leaving the dashboard |
| `fullscreen` | large media or immersive layouts |
| `tabs` | grouped content inside one card |
| `carousel` | slide-based navigation |
| `subview` | jump to a dedicated route |
| `none` | header-only card |

### Layout

- `grid.columns`, `gap`, `row_gap`, `column_gap`
- `colspan` / `rowspan`
- `header_left`, `header`, `header_right`
- `footer_left`, `footer`, `footer_right`
- modal and fullscreen sizing controls

### Rules and interaction

- `tap_action`, `hold_action`, `double_tap_action`
- badge `visibility`
- badge `color_rules`
- `icon_only`
- `visibility` and `section_visibility`
- `swipe.*`
- `context_menu.items[]`

### Styling

- built-in themes
- `icon_color`
- `theme_tokens`
- `state_styles`
- `custom_css`

Для выбора правильного styling layer см. [Theming Guide](docs/features/theming-guide.md).

### CSS overrides

Да, можно точечно переопределять стили элементов через `custom_css`.
Для новых override-сценариев лучше опираться на стабильные `data-uc-*` hooks из [Selector Catalog](docs/features/selector-catalog.md).

Рабочие scope:

- `card`
- `header`
- `body`
- `footer`
- `global`

Типичный пример:

```yaml
type: custom:universal-card
title: Styled Header
custom_css:
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .header-subtitle {
        color: #7cd6ff;
      }
```

Что важно:

- стили санитизируются
- запрещены селекторы `body`, `html`, `:root`, `head`, `script`
- запрещены опасные свойства вроде `behavior`, `expression`, `-moz-binding`
- лучше таргетить внутренние классы карточки, а не пытаться ломать весь документ

### Runtime and editor

- inline lazy loading
- modal `loading_strategy: lazy | preload`
- persistence and stability settings
- visual editor for common card flows

---

## Готовые сценарии

### Grid layout

```yaml
type: custom:universal-card
title: Energy Grid
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
        - entity: sensor.network_health_sensor
```

### Fullscreen mode

```yaml
type: custom:universal-card
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
      entity: camera.garden
```

### Carousel mode

```yaml
type: custom:universal-card
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
        - entity: sensor.demo_humidity
```

### Visibility rules

```yaml
type: custom:universal-card
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
  text: Admin-only footer actions
```

### Swipe gestures

```yaml
type: custom:universal-card
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
        - entity: sensor.demo_humidity
```

### Themes and styling

```yaml
type: custom:universal-card
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
  'off':
    opacity: 0.72
custom_css:
  - scope: header
    css: |
      .header-title {
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
```

### Footer actions

```yaml
type: custom:universal-card
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
        - entity: sensor.security_status
```

---

## Структура конфигурации

Основные блоки YAML:

- root shell: `title`, `subtitle`, `icon`, `entity`, `theme`
- header: `header`, `header_left`, `header_right`
- badges: `badges[]`
- body: `body.cards`
- body mode blocks: `modal`, `fullscreen`, `tabs`, `tabs_config`, `carousel_options`, `subview`
- layout: `grid`
- footer: `footer`, `footer_left`, `footer_right`
- interaction: `tap_action`, `hold_action`, `double_tap_action`, `context_menu`, `swipe`
- rules: `visibility`, `section_visibility`
- styling: `theme_tokens`, `state_styles`, `custom_css`
- runtime: `lazy_load`, modal loading strategy, persistence, stability

Подробный reference по YAML блокам:

- [YAML Block Reference](docs/features/yaml-block-reference.md)

---

## Визуальный редактор

Визуальный editor покрывает:

- shell fields
- header layout
- badges `visibility` и `color_rules`
- modal/fullscreen/tabs/carousel/subview settings
- visibility and section visibility
- swipe settings
- `theme_tokens`
- `state_styles`

YAML по-прежнему удобнее для:

- сложных `grid.columns` строк
- advanced `custom_css`
- крупных action payloads
- badge `tap_action` и `icon_tap_action`

Подробнее:

- [Editor](docs/features/editor.md)

---

## Troubleshooting

### Карточка не обновилась после установки

- обновите страницу Home Assistant
- очистите браузерный cache
- проверьте путь к resource

### Включить debug logging

Откройте консоль браузера и выполните:

```javascript
enableUniversalCardDebug()
```

Выключить:

```javascript
disableUniversalCardDebug()
```

---

## FAQ

### Нужен ли YAML, если есть editor?

Нет, для большинства карточек editor достаточно.
YAML нужен в основном для сложных layout и styling сценариев.

### Можно ли использовать nested cards?

Да. Внутри `body.cards`, tabs, grid cells, modal и fullscreen можно использовать вложенные Lovelace cards.

### Можно ли использовать custom CSS?

Да. Для этого есть `custom_css`, но лучше сначала попробовать theme и `theme_tokens`.

### Где посмотреть больше примеров?

- [Examples Gallery](docs/examples.md)
- [YAML Block Reference](docs/features/yaml-block-reference.md)
- [Feature Map](docs/features/index.md)

---

## Лицензия

MIT. См. [LICENSE](LICENSE).

## Вклад в проект

Issues и Pull Requests приветствуются.
Если меняете user-facing поведение, синхронизируйте код, examples и docs вместе.
