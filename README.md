# Universal Card

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="version"/>
  <img src="https://img.shields.io/badge/HACS-Custom-orange.svg" alt="HACS"/>
  <img src="https://img.shields.io/badge/Home%20Assistant-2024.1+-brightgreen.svg" alt="HA version"/>
</p>

Продвинутая карточка Lovelace для Home Assistant с 7 режимами body, CSS Grid layout, lazy loading и расширенной настройкой.

## 🚀 Возможности

### Body Modes (7 режимов)
- **expand** — стандартное раскрытие с анимацией
- **modal** — модальное окно
- **fullscreen** — полноэкранный режим
- **tabs** — вкладки
- **carousel** — карусель с автоплеем
- **subview** — встроенный lovelace view
- **none** — только заголовок

### Layout
- 📐 CSS Grid с colspan/rowspan
- 📱 Responsive breakpoints
- 🧩 Вложенные карточки в header/footer

### Производительность
- ⚡ Lazy loading с Intersection Observer
- 💀 Skeleton loaders
- 🔄 Асинхронная загрузка карточек
- 🎯 Throttling/Debouncing WebSocket updates
- 🖼️ GPU-accelerated CSS animations

### Функции
- 👁️ Visibility conditions
- 🎨 State-based theming (9 тем)
- 👆 Swipe gestures
- 📌 Sticky header
- 🏷️ Badges
- 📊 Entity Preview (hover sparkline)
- ⚠️ Alerts/Thresholds
- ⚡ Quick Actions
- ⏱️ Timer/Countdown
- 🔗 Card Linking (master/slave)

### Меню
- 🖱️ Context Menu (правый клик)
- 🎯 Radial Menu (долгое нажатие)

### Редактор
- 🎨 Визуальный редактор (встроенный в Lovelace)
- ↩️ Undo/Redo
- ✅ Config validation

## 📦 Установка

### HACS (рекомендуется)

1. Откройте HACS → Frontend
2. Нажмите "+" и найдите "Universal Card"
3. Установите и перезагрузите Home Assistant

### Ручная установка

1. Скачайте последний релиз
2. Скопируйте папку `universal_card` в `/config/custom_components/`
3. Перезагрузите Home Assistant

## ⚙️ Конфигурация

### Базовый пример

```yaml
type: custom:universal-card
title: Освещение
icon: mdi:lightbulb-group
body_mode: expand
body:
  cards:
    - type: light
      entity: light.living_room
    - type: light
      entity: light.bedroom
```

### Grid Layout

```yaml
type: custom:universal-card
title: Dashboard
body_mode: expand
grid:
  columns: 3
  gap: 16px
body:
  cards:
    - type: sensor
      entity: sensor.temperature
      colspan: 2  # Занимает 2 колонки
    - type: sensor
      entity: sensor.humidity
    - type: gauge
      entity: sensor.power
      rowspan: 2  # Занимает 2 строки
```

### Tabs Mode

```yaml
type: custom:universal-card
title: Умный дом
body_mode: tabs
tabs:
  - label: Свет
    icon: mdi:lightbulb
    cards:
      - type: light
        entity: light.room
  - label: Климат
    icon: mdi:thermometer
    cards:
      - type: thermostat
        entity: climate.ac
```

### Modal Mode

```yaml
type: custom:universal-card
title: Настройки
icon: mdi:cog
body_mode: modal
modal:
  width: 500px
  backdrop_blur: true
body:
  cards:
    - type: entities
      entities:
        - input_boolean.setting_1
        - input_number.setting_2
```

### Visibility Conditions

```yaml
type: custom:universal-card
title: Гостевой режим
visibility:
  - condition: user
    users:
      - guest_user
  - condition: state
    entity: input_boolean.show_card
    state: "on"
body:
  cards:
    - type: markdown
      content: "Добро пожаловать!"
```

### State-based Styling

```yaml
type: custom:universal-card
title: Сигнализация
entity: alarm_control_panel.home
state_styles:
  armed_home:
    background: "rgba(255, 152, 0, 0.2)"
    border_color: "#ff9800"
  armed_away:
    background: "rgba(244, 67, 54, 0.2)"
    border_color: "#f44336"
  disarmed:
    background: "rgba(76, 175, 80, 0.2)"
    border_color: "#4caf50"
```

### Header Cards

```yaml
type: custom:universal-card
title: Комната
header:
  cards:
    - type: custom:mini-graph-card
      entities:
        - sensor.temperature
      height: 40
body:
  cards:
    - type: entities
      entities:
        - light.room
        - switch.fan
```

## 📋 Полный список параметров

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `title` | string | — | Заголовок карточки |
| `subtitle` | string | — | Подзаголовок |
| `icon` | string | — | MDI иконка |
| `entity` | string | — | Entity для состояния |
| `body_mode` | string | expand | Режим body |
| `expanded` | boolean | false | Раскрыта по умолчанию |
| `theme` | string | solid | Тема оформления |
| `animation` | boolean | true | Включить анимации |
| `lazy_load` | boolean | true | Ленивая загрузка |
| `remember_state` | boolean | false | Запоминать состояние |
| `show_expand_icon` | boolean | true | Показывать иконку |
| `sticky_header` | boolean | false | Фиксированный header |

### Grid параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `grid.columns` | number | 1 | Количество колонок |
| `grid.gap` | string | 16px | Отступы между карточками |
| `grid.responsive` | object | — | Responsive breakpoints |

### Body параметры

| Параметр | Тип | Описание |
|----------|-----|----------|
| `body.cards` | array | Массив карточек |

### Modal параметры

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `modal.width` | string | 90% | Ширина модального окна |
| `modal.max_width` | string | 600px | Максимальная ширина |
| `modal.backdrop_blur` | boolean | true | Размытие фона |

## 🎨 Темы

- `solid` — стандартная
- `glass` — стекло
- `glassmorphism` — glassmorphism эффект
- `neumorphism` — neumorphism стиль
- `minimal` — минимализм
- `gradient` — градиент
- `dark` — тёмная
- `neon` — неоновое свечение
- `aurora` — эффект северного сияния

## 🔧 Разработка

```bash
# Клонирование
git clone git@github.com:Mesteriis/universal-card.git

# Структура проекта
universal_card/
├── __init__.py         # Python integration
├── manifest.json       # HACS manifest
├── universal-card.js   # Entry point
├── core/              # Основные компоненты
├── modes/             # Body modes
├── features/          # Функции
├── ui/                # UI компоненты
├── widgets/           # Виджеты
├── styles/            # Стили и темы
├── editor/            # Редактор
├── plugins/           # Система плагинов
├── dev/               # Dev tools
├── utils/             # Утилиты
└── i18n/              # Локализация
```

## 📄 Лицензия

MIT License - см. [LICENSE](LICENSE)

## 🤝 Вклад

Pull requests приветствуются! Для крупных изменений сначала откройте issue.

---

Made with ❤️ by [Mesteriis](https://github.com/Mesteriis)
