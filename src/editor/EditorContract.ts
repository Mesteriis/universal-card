/**
 * Schema-driven field catalog for the visual editor.
 *
 * Complex editors stay hand-authored, but simple fields are declared once here
 * and resolved from the shared config contract.
 *
 * @module editor/EditorContract
 */

import {
  ACTION_TYPES,
  BADGE_FORMATS,
  BADGE_TYPES,
  BODY_MODES,
  CARD_ANIMATIONS,
  CARD_DIRECTIONS,
  COLLAPSE_ANIMATIONS,
  CONDITION_TYPES,
  EXPAND_TRIGGERS,
  EXPAND_ANIMATIONS,
  POOL_SCOPES,
  SWIPE_ACTIONS,
  SWIPE_DIRECTIONS,
  THEMES,
  VALID_WEEKDAYS
} from '../core/constants.js';
import {
  CONFIG_SCHEMA,
  FIELD_TYPES,
  resolveSchemaField,
  type EditorSchemaField
} from './SchemaContract.js';

type EditorControl = 'text' | 'number' | 'checkbox' | 'select' | 'entity' | 'icon' | 'multiselect';

export type EditorOption = { value: string; label: string; icon?: string };

type FieldMetadata = {
  label: string;
  placeholder?: string;
  helper?: string;
  control?: EditorControl;
  options?: EditorOption[];
  optionLabels?: Record<string, string>;
  optionIcons?: Record<string, string>;
};

export type EditorFieldDescriptor = {
  path: string;
  id: string;
  label: string;
  placeholder?: string;
  helper?: string;
  control: EditorControl;
  description?: string;
  default?: unknown;
  options?: EditorOption[];
  min?: number;
  max?: number;
  schema: EditorSchemaField;
};

export type ContractFieldDescriptor = {
  key: string;
  id: string;
  label: string;
  placeholder?: string;
  helper?: string;
  control: EditorControl;
  description?: string;
  options?: EditorOption[];
  min?: number;
  max?: number;
  schema?: EditorSchemaField;
};

const FIELD_METADATA: Record<string, FieldMetadata> = {
  title: {
    label: 'Заголовок',
    placeholder: 'Название карточки'
  },
  subtitle: {
    label: 'Подзаголовок',
    placeholder: 'Дополнительный текст'
  },
  icon: {
    label: 'Иконка',
    placeholder: 'mdi:home',
    helper: 'Оставьте пустым, чтобы не показывать иконку.'
  },
  entity: {
    label: 'Entity (опционально)',
    placeholder: 'light.room'
  },
  attribute: {
    label: 'Attribute',
    placeholder: 'brightness',
    helper: 'Используется для state_styles и state-aware условий вместо основного state.'
  },
  body_mode: {
    label: 'Режим body',
    optionLabels: {
      [BODY_MODES.EXPAND]: 'Раскрытие (expand)',
      [BODY_MODES.MODAL]: 'Модальное окно (modal)',
      [BODY_MODES.FULLSCREEN]: 'Полноэкранный (fullscreen)',
      [BODY_MODES.TABS]: 'Вкладки (tabs)',
      [BODY_MODES.CAROUSEL]: 'Карусель (carousel)',
      [BODY_MODES.SUBVIEW]: 'Subview',
      [BODY_MODES.NONE]: 'Только заголовок (none)'
    }
  },
  expanded: {
    label: 'Раскрыта по умолчанию'
  },
  show_expand_icon: {
    label: 'Показывать иконку раскрытия'
  },
  expand_icon: {
    label: 'Иконка раскрытия',
    placeholder: 'mdi:chevron-down',
    helper: 'Оставьте пустым, чтобы использовать встроенную иконку раскрытия.'
  },
  sticky_header: {
    label: 'Фиксированный заголовок при скролле'
  },
  'grid.columns': {
    label: 'Колонки',
    control: 'number'
  },
  'grid.gap': {
    label: 'Отступы',
    placeholder: '16px'
  },
  theme: {
    label: 'Тема',
    optionLabels: {
      [THEMES.DEFAULT]: 'По умолчанию',
      [THEMES.TRANSPARENT]: 'Прозрачная',
      [THEMES.SOLID]: 'Обычная',
      [THEMES.GLASS]: 'Стекло',
      [THEMES.GLASSMORPHISM]: 'Glassmorphism',
      [THEMES.NEUMORPHISM]: 'Neumorphism',
      [THEMES.MINIMAL]: 'Минимализм',
      [THEMES.GRADIENT]: 'Градиент',
      [THEMES.DARK]: 'Тёмная',
      [THEMES.NEON]: 'Неон',
      [THEMES.AURORA]: 'Аврора',
      [THEMES.CARBON]: 'Carbon',
      [THEMES.SLATE]: 'Slate',
      [THEMES.OBSIDIAN]: 'Obsidian',
      [THEMES.CHARCOAL]: 'Charcoal',
      [THEMES.MIDNIGHT]: 'Midnight',
      [THEMES.CYBER]: 'Cyber',
      [THEMES.VOID]: 'Void',
      [THEMES.EMBER]: 'Ember',
      [THEMES.FOREST]: 'Forest',
      [THEMES.OCEAN]: 'Ocean',
      [THEMES.PURPLE_HAZE]: 'Purple Haze',
      [THEMES.MATRIX]: 'Matrix',
      [THEMES.GRAPHITE]: 'Graphite',
      [THEMES.SMOKE]: 'Smoke',
      [THEMES.NORD]: 'Nord',
      [THEMES.DRACULA]: 'Dracula',
      [THEMES.MONOKAI]: 'Monokai',
      [THEMES.TOKYO_NIGHT]: 'Tokyo Night',
      [THEMES.CATPPUCCIN]: 'Catppuccin'
    }
  },
  border_radius: {
    label: 'Скругление углов',
    placeholder: '12px'
  },
  padding: {
    label: 'Внутренние отступы',
    placeholder: '16px'
  },
  animation: {
    label: 'Анимации'
  },
  animation_duration: {
    label: 'Общая длительность'
  },
  expand_animation: {
    label: 'Раскрытие body',
    optionLabels: {
      [EXPAND_ANIMATIONS.NONE]: 'Нет',
      [EXPAND_ANIMATIONS.FADE]: 'Появление',
      [EXPAND_ANIMATIONS.FADE_UP]: 'Снизу',
      [EXPAND_ANIMATIONS.FADE_DOWN]: 'Сверху',
      [EXPAND_ANIMATIONS.SCALE]: 'Масштаб',
      [EXPAND_ANIMATIONS.SLIDE]: 'Выезд',
      [EXPAND_ANIMATIONS.BOUNCE]: 'Пружина',
      [EXPAND_ANIMATIONS.FLIP]: '3D флип'
    },
    optionIcons: {
      [EXPAND_ANIMATIONS.NONE]: 'mdi:cancel',
      [EXPAND_ANIMATIONS.FADE]: 'mdi:blur',
      [EXPAND_ANIMATIONS.FADE_UP]: 'mdi:arrow-up-bold',
      [EXPAND_ANIMATIONS.FADE_DOWN]: 'mdi:arrow-down-bold',
      [EXPAND_ANIMATIONS.SCALE]: 'mdi:resize',
      [EXPAND_ANIMATIONS.SLIDE]: 'mdi:arrow-expand-down',
      [EXPAND_ANIMATIONS.BOUNCE]: 'mdi:arrow-collapse-down',
      [EXPAND_ANIMATIONS.FLIP]: 'mdi:rotate-3d-variant'
    }
  },
  collapse_animation: {
    label: 'Сворачивание body',
    optionLabels: {
      [COLLAPSE_ANIMATIONS.NONE]: 'Нет',
      [COLLAPSE_ANIMATIONS.FADE]: 'Исчезание',
      [COLLAPSE_ANIMATIONS.FADE_DOWN]: 'Вниз',
      [COLLAPSE_ANIMATIONS.FADE_UP]: 'Вверх',
      [COLLAPSE_ANIMATIONS.SCALE]: 'Масштаб',
      [COLLAPSE_ANIMATIONS.SLIDE]: 'Уезд'
    },
    optionIcons: {
      [COLLAPSE_ANIMATIONS.NONE]: 'mdi:cancel',
      [COLLAPSE_ANIMATIONS.FADE]: 'mdi:blur-off',
      [COLLAPSE_ANIMATIONS.FADE_DOWN]: 'mdi:arrow-down-bold',
      [COLLAPSE_ANIMATIONS.FADE_UP]: 'mdi:arrow-up-bold',
      [COLLAPSE_ANIMATIONS.SCALE]: 'mdi:resize-bottom-right',
      [COLLAPSE_ANIMATIONS.SLIDE]: 'mdi:arrow-collapse-up'
    }
  },
  cards_animation: {
    label: 'Появление карточек (каскад)',
    optionLabels: {
      [CARD_ANIMATIONS.NONE]: 'Нет',
      [CARD_ANIMATIONS.FADE_UP]: 'Снизу',
      [CARD_ANIMATIONS.FADE_DOWN]: 'Сверху',
      [CARD_ANIMATIONS.FADE_LEFT]: 'Слева',
      [CARD_ANIMATIONS.FADE_RIGHT]: 'Справа',
      [CARD_ANIMATIONS.SCALE]: 'Масштаб',
      [CARD_ANIMATIONS.BOUNCE]: 'Пружина',
      [CARD_ANIMATIONS.FLIP]: '3D флип'
    },
    optionIcons: {
      [CARD_ANIMATIONS.NONE]: 'mdi:cancel',
      [CARD_ANIMATIONS.FADE_UP]: 'mdi:arrow-up-bold',
      [CARD_ANIMATIONS.FADE_DOWN]: 'mdi:arrow-down-bold',
      [CARD_ANIMATIONS.FADE_LEFT]: 'mdi:arrow-left-bold',
      [CARD_ANIMATIONS.FADE_RIGHT]: 'mdi:arrow-right-bold',
      [CARD_ANIMATIONS.SCALE]: 'mdi:resize',
      [CARD_ANIMATIONS.BOUNCE]: 'mdi:arrow-collapse-down',
      [CARD_ANIMATIONS.FLIP]: 'mdi:rotate-3d-variant'
    }
  },
  cards_stagger: {
    label: 'Задержка между карточками'
  },
  cards_direction: {
    label: 'Направление появления',
    optionLabels: {
      [CARD_DIRECTIONS.SEQUENTIAL]: 'По порядку',
      [CARD_DIRECTIONS.REVERSE]: 'Обратный',
      [CARD_DIRECTIONS.CENTER_OUT]: 'От центра',
      [CARD_DIRECTIONS.EDGES_IN]: 'К центру',
      [CARD_DIRECTIONS.DIAGONAL]: 'По диагонали',
      [CARD_DIRECTIONS.WAVE]: 'Волна',
      [CARD_DIRECTIONS.RANDOM]: 'Случайный'
    },
    optionIcons: {
      [CARD_DIRECTIONS.SEQUENTIAL]: 'mdi:ray-start-arrow',
      [CARD_DIRECTIONS.REVERSE]: 'mdi:ray-end-arrow',
      [CARD_DIRECTIONS.CENTER_OUT]: 'mdi:arrow-expand-horizontal',
      [CARD_DIRECTIONS.EDGES_IN]: 'mdi:arrow-collapse-horizontal',
      [CARD_DIRECTIONS.DIAGONAL]: 'mdi:arrow-bottom-right',
      [CARD_DIRECTIONS.WAVE]: 'mdi:wave',
      [CARD_DIRECTIONS.RANDOM]: 'mdi:shuffle-variant'
    }
  },
  lazy_load: {
    label: 'Ленивая загрузка (lazy loading)'
  },
  lazy_initial_batch: {
    label: 'Начальная партия lazy load'
  },
  lazy_batch_size: {
    label: 'Размер lazy партии'
  },
  lazy_idle_timeout: {
    label: 'Idle timeout (мс)'
  },
  remember_expanded_state: {
    label: 'Запоминать состояние раскрытия'
  },
  remember_mode_state: {
    label: 'Запоминать вкладку/слайд'
  },
  auto_collapse_after: {
    label: 'Авто-сворачивание (сек, 0 - откл.)'
  },
  stability_mode: {
    label: 'Stability mode'
  },
  enable_card_pool: {
    label: 'Переиспользовать вложенные карточки'
  },
  pool_scope: {
    label: 'Scope пула',
    optionLabels: {
      [POOL_SCOPES.CARD]: 'Card',
      [POOL_SCOPES.DASHBOARD]: 'Dashboard',
      [POOL_SCOPES.GLOBAL]: 'Global'
    }
  },
  pool_ttl_ms: {
    label: 'TTL пула (мс)'
  },
  pool_max_entries: {
    label: 'Лимит записей пула'
  },
  card_id: {
    label: 'ID карточки',
    placeholder: 'Авто-генерируется если пусто'
  },
  carousel_autoplay: {
    label: 'Автовоспроизведение'
  },
  carousel_interval: {
    label: 'Интервал (мс)'
  },
  expand_trigger: {
    label: 'Триггер раскрытия',
    optionLabels: {
      [EXPAND_TRIGGERS.TAP]: 'Клик (tap)',
      [EXPAND_TRIGGERS.HOLD]: 'Удержание (hold)',
      [EXPAND_TRIGGERS.DOUBLE_TAP]: 'Двойной клик',
      [EXPAND_TRIGGERS.NONE]: 'Отключено'
    },
    optionIcons: {
      [EXPAND_TRIGGERS.TAP]: 'mdi:gesture-tap',
      [EXPAND_TRIGGERS.HOLD]: 'mdi:gesture-tap-hold',
      [EXPAND_TRIGGERS.DOUBLE_TAP]: 'mdi:gesture-double-tap',
      [EXPAND_TRIGGERS.NONE]: 'mdi:close-circle-outline'
    }
  },
  'tap_action.action': {
    label: 'Действие tap',
    optionLabels: {
      [ACTION_TYPES.NONE]: 'Нет действия',
      [ACTION_TYPES.MORE_INFO]: 'Открыть информацию',
      [ACTION_TYPES.TOGGLE]: 'Переключить entity',
      [ACTION_TYPES.CALL_SERVICE]: 'Вызвать сервис',
      [ACTION_TYPES.NAVIGATE]: 'Перейти',
      [ACTION_TYPES.URL]: 'Открыть URL',
      [ACTION_TYPES.EXPAND]: 'Раскрыть',
      [ACTION_TYPES.COLLAPSE]: 'Свернуть'
    }
  },
  'hold_action.action': {
    label: 'Действие hold',
    optionLabels: {
      [ACTION_TYPES.NONE]: 'Нет действия',
      [ACTION_TYPES.MORE_INFO]: 'Открыть информацию',
      [ACTION_TYPES.TOGGLE]: 'Переключить entity',
      [ACTION_TYPES.CALL_SERVICE]: 'Вызвать сервис',
      [ACTION_TYPES.NAVIGATE]: 'Перейти',
      [ACTION_TYPES.URL]: 'Открыть URL',
      [ACTION_TYPES.EXPAND]: 'Раскрыть',
      [ACTION_TYPES.COLLAPSE]: 'Свернуть'
    }
  },
  'double_tap_action.action': {
    label: 'Действие double tap',
    optionLabels: {
      [ACTION_TYPES.NONE]: 'Нет действия',
      [ACTION_TYPES.MORE_INFO]: 'Открыть информацию',
      [ACTION_TYPES.TOGGLE]: 'Переключить entity',
      [ACTION_TYPES.CALL_SERVICE]: 'Вызвать сервис',
      [ACTION_TYPES.NAVIGATE]: 'Перейти',
      [ACTION_TYPES.URL]: 'Открыть URL',
      [ACTION_TYPES.EXPAND]: 'Раскрыть',
      [ACTION_TYPES.COLLAPSE]: 'Свернуть'
    }
  },
  'tap_action.service': {
    label: 'Service',
    placeholder: 'domain.service'
  },
  'hold_action.service': {
    label: 'Service',
    placeholder: 'domain.service'
  },
  'double_tap_action.service': {
    label: 'Service',
    placeholder: 'domain.service'
  },
  'tap_action.navigation_path': {
    label: 'Navigation Path',
    placeholder: '/lovelace/view'
  },
  'hold_action.navigation_path': {
    label: 'Navigation Path',
    placeholder: '/lovelace/view'
  },
  'double_tap_action.navigation_path': {
    label: 'Navigation Path',
    placeholder: '/lovelace/view'
  },
  'tap_action.url_path': {
    label: 'URL',
    placeholder: 'https://...'
  },
  'hold_action.url_path': {
    label: 'URL',
    placeholder: 'https://...'
  },
  'double_tap_action.url_path': {
    label: 'URL',
    placeholder: 'https://...'
  },
  'swipe.enabled': {
    label: 'Включить swipe gestures'
  },
  'swipe.direction': {
    label: 'Направление swipe',
    optionLabels: {
      [SWIPE_DIRECTIONS.HORIZONTAL]: 'Горизонтальный',
      [SWIPE_DIRECTIONS.VERTICAL]: 'Вертикальный',
      [SWIPE_DIRECTIONS.BOTH]: 'Оба'
    }
  },
  'swipe.threshold': {
    label: 'Порог свайпа (px)'
  },
  'swipe.velocityThreshold': {
    label: 'Порог скорости'
  },
  'swipe.preventScroll': {
    label: 'Блокировать scroll при совпадающем swipe'
  },
  'swipe.left.action': {
    label: 'Свайп влево',
    optionLabels: {
      [SWIPE_ACTIONS.NONE]: 'Нет действия',
      [SWIPE_ACTIONS.EXPAND]: 'Раскрыть',
      [SWIPE_ACTIONS.COLLAPSE]: 'Свернуть',
      [SWIPE_ACTIONS.TOGGLE]: 'Переключить',
      [SWIPE_ACTIONS.NEXT]: 'Следующий',
      [SWIPE_ACTIONS.PREV]: 'Предыдущий'
    }
  },
  'swipe.right.action': {
    label: 'Свайп вправо',
    optionLabels: {
      [SWIPE_ACTIONS.NONE]: 'Нет действия',
      [SWIPE_ACTIONS.EXPAND]: 'Раскрыть',
      [SWIPE_ACTIONS.COLLAPSE]: 'Свернуть',
      [SWIPE_ACTIONS.TOGGLE]: 'Переключить',
      [SWIPE_ACTIONS.NEXT]: 'Следующий',
      [SWIPE_ACTIONS.PREV]: 'Предыдущий'
    }
  },
  'swipe.up.action': {
    label: 'Свайп вверх',
    optionLabels: {
      [SWIPE_ACTIONS.NONE]: 'Нет действия',
      [SWIPE_ACTIONS.EXPAND]: 'Раскрыть',
      [SWIPE_ACTIONS.COLLAPSE]: 'Свернуть',
      [SWIPE_ACTIONS.TOGGLE]: 'Переключить',
      [SWIPE_ACTIONS.NEXT]: 'Следующий',
      [SWIPE_ACTIONS.PREV]: 'Предыдущий'
    }
  },
  'swipe.down.action': {
    label: 'Свайп вниз',
    optionLabels: {
      [SWIPE_ACTIONS.NONE]: 'Нет действия',
      [SWIPE_ACTIONS.EXPAND]: 'Раскрыть',
      [SWIPE_ACTIONS.COLLAPSE]: 'Свернуть',
      [SWIPE_ACTIONS.TOGGLE]: 'Переключить',
      [SWIPE_ACTIONS.NEXT]: 'Следующий',
      [SWIPE_ACTIONS.PREV]: 'Предыдущий'
    }
  },
  'badges.type': {
    label: 'Тип badge',
    optionLabels: {
      [BADGE_TYPES.STATE]: 'State',
      [BADGE_TYPES.ATTRIBUTE]: 'Attribute',
      [BADGE_TYPES.COUNTER]: 'Counter',
      [BADGE_TYPES.CUSTOM]: 'Custom'
    }
  },
  'badges.entity': {
    label: 'Entity',
    placeholder: 'sensor.temperature'
  },
  'badges.attribute': {
    label: 'Attribute',
    placeholder: 'temperature'
  },
  'badges.icon': {
    label: 'Иконка',
    placeholder: 'mdi:thermometer'
  },
  'badges.color': {
    label: 'Цвет',
    placeholder: 'var(--warning-color)'
  },
  'badges.value': {
    label: 'Значение',
    placeholder: 'Online / 42'
  },
  'badges.label': {
    label: 'Label',
    placeholder: 'Температура'
  },
  'badges.unit': {
    label: 'Unit',
    placeholder: '°C'
  },
  'badges.min': {
    label: 'Min',
    control: 'number'
  },
  'badges.max': {
    label: 'Max',
    control: 'number'
  },
  'badges.show_name': {
    label: 'Показывать имя entity'
  },
  'badges.show_progress': {
    label: 'Показывать progress'
  },
  'badges.precision': {
    label: 'Precision',
    control: 'number'
  },
  'badges.format': {
    label: 'Формат',
    optionLabels: {
      [BADGE_FORMATS.NONE]: 'Без форматирования',
      [BADGE_FORMATS.TIME]: 'Время',
      [BADGE_FORMATS.DATE]: 'Дата',
      [BADGE_FORMATS.DURATION]: 'Длительность'
    }
  },
  'badges.entities': {
    label: 'Entities',
    placeholder: 'light.kitchen, light.hall',
    control: 'text'
  },
  'badges.domain': {
    label: 'Domain',
    placeholder: 'light'
  },
  'badges.state': {
    label: 'Состояние',
    placeholder: 'on'
  },
  'badges.count_state': {
    label: 'Count State',
    placeholder: 'on'
  },
  'badges.thresholds.value': {
    label: 'Порог',
    control: 'number'
  },
  'badges.thresholds.color': {
    label: 'Цвет порога',
    placeholder: '#f44336'
  }
};

export const EDITOR_FIELD_GROUPS = Object.freeze({
  basic: ['title', 'subtitle', 'icon', 'entity', 'body_mode', 'expanded'],
  header: ['show_expand_icon', 'expand_icon', 'sticky_header'],
  body: ['grid.columns', 'grid.gap'],
  style: ['theme', 'border_radius', 'padding', 'animation'],
  runtime: [
    'lazy_load',
    'lazy_initial_batch',
    'lazy_batch_size',
    'lazy_idle_timeout',
    'remember_expanded_state',
    'remember_mode_state',
    'auto_collapse_after',
    'stability_mode',
    'enable_card_pool',
    'pool_scope',
    'pool_ttl_ms',
    'pool_max_entries'
  ],
  advanced: ['card_id'],
  carousel: ['carousel_autoplay', 'carousel_interval']
} as const);

const SWIPE_FIELD_PATHS = Object.freeze([
  'swipe.enabled',
  'swipe.direction',
  'swipe.threshold',
  'swipe.velocityThreshold',
  'swipe.preventScroll'
] as const);

const SWIPE_ACTION_FIELD_PATHS = Object.freeze([
  'swipe.left.action',
  'swipe.right.action',
  'swipe.up.action',
  'swipe.down.action'
] as const);

const BADGE_TYPE_FIELDS: Record<string, readonly string[]> = Object.freeze({
  [BADGE_TYPES.STATE]: [
    'badges.entity',
    'badges.icon',
    'badges.color',
    'badges.label',
    'badges.unit',
    'badges.show_name',
    'badges.show_progress',
    'badges.min',
    'badges.max',
    'badges.precision',
    'badges.format'
  ],
  [BADGE_TYPES.ATTRIBUTE]: [
    'badges.entity',
    'badges.attribute',
    'badges.icon',
    'badges.color',
    'badges.label',
    'badges.unit',
    'badges.show_name',
    'badges.show_progress',
    'badges.min',
    'badges.max',
    'badges.precision',
    'badges.format'
  ],
  [BADGE_TYPES.COUNTER]: [
    'badges.icon',
    'badges.color',
    'badges.label',
    'badges.unit',
    'badges.entities',
    'badges.domain',
    'badges.state',
    'badges.count_state',
    'badges.precision',
    'badges.format'
  ],
  [BADGE_TYPES.CUSTOM]: [
    'badges.icon',
    'badges.color',
    'badges.label',
    'badges.value',
    'badges.unit',
    'badges.precision',
    'badges.format'
  ]
});

const CONDITION_TYPE_METADATA: Record<string, { label: string; icon: string }> = {
  [CONDITION_TYPES.STATE]: {
    label: 'Состояние entity',
    icon: 'mdi:toggle-switch'
  },
  [CONDITION_TYPES.NUMERIC_STATE]: {
    label: 'Числовое значение',
    icon: 'mdi:numeric'
  },
  [CONDITION_TYPES.USER]: {
    label: 'Пользователь',
    icon: 'mdi:account'
  },
  [CONDITION_TYPES.TIME]: {
    label: 'Время',
    icon: 'mdi:clock-outline'
  },
  [CONDITION_TYPES.SCREEN]: {
    label: 'Размер экрана',
    icon: 'mdi:monitor'
  },
  [CONDITION_TYPES.AND]: {
    label: 'AND группа',
    icon: 'mdi:set-center'
  },
  [CONDITION_TYPES.OR]: {
    label: 'OR группа',
    icon: 'mdi:set-all'
  },
  [CONDITION_TYPES.NOT]: {
    label: 'NOT группа',
    icon: 'mdi:selection-remove'
  }
};

const WEEKDAY_LABELS: Record<string, string> = {
  mon: 'Пн',
  tue: 'Вт',
  wed: 'Ср',
  thu: 'Чт',
  fri: 'Пт',
  sat: 'Сб',
  sun: 'Вс'
};

const BOOLEAN_FILTER_OPTIONS: EditorOption[] = [
  { value: '', label: 'Не учитывать' },
  { value: 'true', label: 'Да' },
  { value: 'false', label: 'Нет' }
];

const CONDITION_FIELD_METADATA: Record<string, FieldMetadata> = {
  entity: {
    label: 'Entity',
    placeholder: 'light.room',
    control: 'entity'
  },
  attribute: {
    label: 'Attribute',
    placeholder: 'brightness'
  },
  state: {
    label: 'Разрешённые состояния',
    placeholder: 'on, open, heat'
  },
  state_not: {
    label: 'Запрещённые состояния',
    placeholder: 'off, unavailable'
  },
  above: {
    label: 'Выше',
    control: 'number'
  },
  below: {
    label: 'Ниже',
    control: 'number'
  },
  users: {
    label: 'Users / IDs',
    placeholder: 'admin, guest'
  },
  is_admin: {
    label: 'Admin',
    control: 'select',
    options: BOOLEAN_FILTER_OPTIONS
  },
  is_owner: {
    label: 'Owner',
    control: 'select',
    options: BOOLEAN_FILTER_OPTIONS
  },
  after: {
    label: 'После',
    placeholder: '08:00'
  },
  before: {
    label: 'До',
    placeholder: '22:00'
  },
  weekday: {
    label: 'Дни недели',
    control: 'multiselect',
    options: VALID_WEEKDAYS.map((value) => ({
      value,
      label: WEEKDAY_LABELS[value] || value.toUpperCase()
    }))
  },
  media_query: {
    label: 'Media Query',
    placeholder: '(min-width: 768px)'
  },
  min_width: {
    label: 'Min Width',
    control: 'number'
  },
  max_width: {
    label: 'Max Width',
    control: 'number'
  }
};

const CONDITION_TYPE_FIELDS: Record<string, readonly string[]> = Object.freeze({
  [CONDITION_TYPES.STATE]: ['entity', 'attribute', 'state', 'state_not'],
  [CONDITION_TYPES.NUMERIC_STATE]: ['entity', 'attribute', 'above', 'below'],
  [CONDITION_TYPES.USER]: ['users', 'is_admin', 'is_owner'],
  [CONDITION_TYPES.TIME]: ['after', 'before', 'weekday'],
  [CONDITION_TYPES.SCREEN]: ['media_query', 'min_width', 'max_width'],
  [CONDITION_TYPES.AND]: [],
  [CONDITION_TYPES.OR]: [],
  [CONDITION_TYPES.NOT]: []
});

const STATE_STYLE_FIELD_DESCRIPTORS: readonly ContractFieldDescriptor[] = Object.freeze([
  {
    key: 'background',
    id: 'state_style_background',
    label: 'Background',
    placeholder: 'rgba(76, 175, 80, 0.2)',
    control: 'text'
  },
  {
    key: 'color',
    id: 'state_style_color',
    label: 'Color',
    placeholder: '#4caf50',
    control: 'text'
  },
  {
    key: 'border',
    id: 'state_style_border',
    label: 'Border',
    placeholder: '1px solid #4caf50',
    control: 'text'
  },
  {
    key: 'class',
    id: 'state_style_class',
    label: 'Class',
    placeholder: 'is-active, high-priority',
    control: 'text'
  }
]);

function inferControl(field: EditorSchemaField, fallback?: EditorControl): EditorControl | null {
  if (fallback) {
    return fallback;
  }

  const fieldTypes = Array.isArray(field.type) ? field.type : [field.type];

  if (fieldTypes.includes(FIELD_TYPES.ENTITY)) return 'entity';
  if (fieldTypes.includes(FIELD_TYPES.ICON)) return 'icon';
  if (fieldTypes.includes(FIELD_TYPES.BOOLEAN)) return 'checkbox';
  if (fieldTypes.includes(FIELD_TYPES.SELECT)) return 'select';
  if (fieldTypes.includes(FIELD_TYPES.NUMBER)) return 'number';

  if (
    fieldTypes.includes(FIELD_TYPES.OBJECT) ||
    fieldTypes.includes(FIELD_TYPES.ARRAY) ||
    fieldTypes.includes(FIELD_TYPES.ACTION)
  ) {
    return null;
  }

  return 'text';
}

function sanitizeFieldId(path: string): string {
  return path.replace(/[.\[\]]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

function mapOptions(field: EditorSchemaField, metadata?: FieldMetadata) {
  if (metadata?.options) {
    return metadata.options;
  }

  if (!field.options) {
    return undefined;
  }

  return field.options.map((option) => {
    const value = String(option);
    return {
      value,
      label: metadata?.optionLabels?.[value] || value,
      icon: metadata?.optionIcons?.[value]
    };
  });
}

export function getEditorFieldDescriptor(path: string): EditorFieldDescriptor | null {
  const schema = resolveSchemaField(CONFIG_SCHEMA, path);
  if (!schema) {
    return null;
  }

  const metadata = FIELD_METADATA[path];
  const control = inferControl(schema, metadata?.control);
  if (!control) {
    return null;
  }

  return {
    path,
    id: sanitizeFieldId(path),
    label: metadata?.label || path,
    placeholder: metadata?.placeholder,
    helper: metadata?.helper || schema.description,
    control,
    description: schema.description,
    default: schema.default,
    options: mapOptions(schema, metadata),
    min: schema.min,
    max: schema.max,
    schema
  };
}

export function getEditorFieldDescriptors(paths: readonly string[]): EditorFieldDescriptor[] {
  return paths
    .map((path) => getEditorFieldDescriptor(path))
    .filter((field): field is EditorFieldDescriptor => Boolean(field));
}

export function getEditorFieldOptions(path: string) {
  return getEditorFieldDescriptor(path)?.options || [];
}

function getVisibilityConditionSchema(): EditorSchemaField | null {
  return resolveSchemaField(CONFIG_SCHEMA, 'visibility')?.items || null;
}

function getVisibilityConditionFieldSchema(key: string): EditorSchemaField | undefined {
  return getVisibilityConditionSchema()?.properties?.[key];
}

function createContractFieldDescriptor(
  key: string,
  schema: EditorSchemaField | undefined,
  metadata: FieldMetadata
): ContractFieldDescriptor {
  const control = inferControl(schema || { type: FIELD_TYPES.STRING }, metadata.control) || 'text';

  return {
    key,
    id: sanitizeFieldId(`condition_${key}`),
    label: metadata.label,
    placeholder: metadata.placeholder,
    helper: metadata.helper || schema?.description,
    control,
    description: schema?.description,
    options: mapOptions(schema || { type: FIELD_TYPES.STRING }, metadata),
    min: schema?.min,
    max: schema?.max,
    schema
  };
}

export function getVisibilityConditionTypeOptions(): EditorOption[] {
  return Object.entries(CONDITION_TYPE_METADATA).map(([value, meta]) => ({
    value,
    label: meta.label,
    icon: meta.icon
  }));
}

export function getVisibilityConditionFieldDescriptors(type: string): ContractFieldDescriptor[] {
  const fieldKeys = CONDITION_TYPE_FIELDS[type] || [];

  return fieldKeys.map((key) => {
    const metadata = CONDITION_FIELD_METADATA[key];
    return createContractFieldDescriptor(key, getVisibilityConditionFieldSchema(key), metadata);
  });
}

export function getVisibilityConditionTypeDescriptor(type: string) {
  return CONDITION_TYPE_METADATA[type] || null;
}

export function isLogicalConditionType(type: string) {
  return (
    type === CONDITION_TYPES.AND ||
    type === CONDITION_TYPES.OR ||
    type === CONDITION_TYPES.NOT
  );
}

export function getStateStyleFieldDescriptors(): ContractFieldDescriptor[] {
  return [...STATE_STYLE_FIELD_DESCRIPTORS];
}

export function getSwipeFieldDescriptors(): EditorFieldDescriptor[] {
  return getEditorFieldDescriptors(SWIPE_FIELD_PATHS);
}

export function getSwipeActionFieldDescriptors(): EditorFieldDescriptor[] {
  return getEditorFieldDescriptors(SWIPE_ACTION_FIELD_PATHS);
}

export function getBadgeFieldDescriptors(type: string): EditorFieldDescriptor[] {
  const fieldPaths = BADGE_TYPE_FIELDS[type] || BADGE_TYPE_FIELDS[BADGE_TYPES.STATE];
  return getEditorFieldDescriptors(['badges.type', ...fieldPaths]);
}

export function getBadgeThresholdFieldDescriptors(): EditorFieldDescriptor[] {
  return getEditorFieldDescriptors(['badges.thresholds.value', 'badges.thresholds.color']);
}
