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
- [Field Matrix](docs/features/field-matrix.md)
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
4. Дополнительные lazy-бандлы подхватятся автоматически из HACS-каталога установки
5. Обновите страницу Home Assistant

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

## Быстрый docs map

Что открывать в зависимости от задачи:

- нужен старт и структура: [Configuration](docs/configuration.md)
- нужен копируемый пример: [Examples Gallery](docs/examples.md)
- нужен быстрый lookup по полям: [Field Matrix](docs/features/field-matrix.md)
- нужен полный блочный reference: [YAML Block Reference](docs/features/yaml-block-reference.md)
- нужен layout guide: [Grid Layout](docs/features/grid-layout.md), [Header Layout](docs/features/header-layout.md), [Footer](docs/features/footer.md)
- нужны body modes: [Modal Layout](docs/features/modal-layout.md), [Body Modes Layout](docs/features/body-modes-layout.md)
- нужны rules/actions: [Badges](docs/features/badges.md), [Visibility](docs/features/visibility.md), [Actions And Gestures](docs/features/interactions.md)
- нужен styling guide: [Theming Guide](docs/features/theming-guide.md), [Custom CSS Recipes](docs/features/custom-css-recipes.md), [Selector Catalog](docs/features/selector-catalog.md)
- нужен editor coverage: [Editor](docs/features/editor.md)

## Что есть в карточке

- 7 body modes: `expand`, `modal`, `fullscreen`, `tabs`, `carousel`, `subview`, `none`
- grid layout с `colspan` и `rowspan`
- configurable header layouts и badges
- footer slots и action rows
- visibility, section visibility, context menu и swipe
- themes, `theme_tokens`, `state_styles`, `custom_css`
- visual editor для основных сценариев

## CSS overrides

Да, `custom_css` поддерживается.

Практический маршрут:

1. сначала `theme`
2. потом `theme_tokens`
3. потом `state_styles`
4. `custom_css` только для точечных override

Для новых override-сценариев лучше опираться на стабильные `data-uc-*` hooks из [Selector Catalog](docs/features/selector-catalog.md).

Подробнее:

- [Theming Guide](docs/features/theming-guide.md)
- [Custom CSS Recipes](docs/features/custom-css-recipes.md)
- [Selector Catalog](docs/features/selector-catalog.md)

## Визуальный редактор

Editor лучше всего покрывает:

- shell fields
- header layout
- modal/fullscreen/tabs/carousel/subview settings
- badge `visibility` и `color_rules`
- `visibility` и `section_visibility`
- `swipe`
- `theme_tokens`
- `state_styles`

YAML остаётся лучшим вариантом для:

- сложных `grid.columns` строк
- advanced `custom_css`
- крупных action payloads
- badge `tap_action` и `icon_tap_action`

Подробнее: [Editor](docs/features/editor.md)

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
