/**
 * Universal Card - Visual Editor
 * 
 * GUI editor for configuring Universal Card in Lovelace UI.
 * Integrated with Home Assistant's built-in card editor.
 * 
 * @author Mesteriis
 * @version 2.0.0
 * @module core/UniversalCardEditor
 */

import { BADGE_OPERATORS, BODY_MODES, CONDITION_TYPES, THEMES } from './constants.js';
import { ConfigManager } from './config.js';
import type { ActionConfig } from './action-hooks.js';
import type {
  BadgeColorRule,
  BadgeConditionRule,
  BadgeThreshold,
  FooterConfig,
  HeaderBadgeConfig,
  ModalConfig,
  SectionVisibilityConfig,
  StateStyleRule,
  SwipeConfig,
  TabConfig,
  TimeVisibilityCondition,
  VisibilityCondition
} from './config-contracts.js';
import { fireEvent, deepClone } from '../utils/helpers.js';
import type { CardConfigLike, CardHelpers } from '../utils/ha-helpers.js';
import type { HomeAssistantLike, HomeAssistantStateMap } from '../providers/ProviderContext.js';
import { getThemePreviewStyle } from '../styles/themes.js';
import {
  EDITOR_FIELD_GROUPS,
  getBadgeColorRuleFieldDescriptors,
  getBadgeFieldDescriptors,
  getBadgeThresholdFieldDescriptors,
  getBadgeVisibilityRuleFieldDescriptors,
  getEditorFieldDescriptor,
  getEditorFieldOptions,
  getStateStyleFieldDescriptors,
  getVisibilityConditionFieldDescriptors,
  getVisibilityConditionTypeDescriptor,
  getVisibilityConditionTypeOptions,
  getSwipeActionFieldDescriptors,
  getSwipeFieldDescriptors,
  isLogicalConditionType
} from '../editor/EditorContract.js';

// =============================================================================
// EDITOR SECTIONS
// =============================================================================

/**
 * Available editor sections
 * @readonly
 * @enum {string}
 */
const SECTIONS = {
  BASIC: 'basic',
  HEADER: 'header',
  BODY: 'body',
  STYLE: 'style',
  FEATURES: 'features',
  ADVANCED: 'advanced'
};

/**
 * Section definitions with icons
 */
const SECTION_DEFINITIONS = [
  { id: SECTIONS.BASIC, icon: 'mdi:cog', label: 'Основные' },
  { id: SECTIONS.HEADER, icon: 'mdi:page-layout-header', label: 'Заголовок' },
  { id: SECTIONS.BODY, icon: 'mdi:card-text-outline', label: 'Содержимое' },
  { id: SECTIONS.STYLE, icon: 'mdi:palette', label: 'Стиль' },
  { id: SECTIONS.FEATURES, icon: 'mdi:tune', label: 'Функции' },
  { id: SECTIONS.ADVANCED, icon: 'mdi:code-tags', label: 'Расширенные' }
];

const EDITOR_ACTION_KEYS = ['tap_action', 'hold_action', 'double_tap_action'] as const;
const EDITOR_ACTION_EXTRA_FIELDS = ['service', 'navigation_path', 'url_path'] as const;
const EDITOR_TAB_FIELD_KEYS = ['label', 'title', 'icon'] as const satisfies readonly (keyof TabConfig)[];
const EDITOR_BADGE_FIELD_KEYS = [
  'type',
  'entity',
  'attribute',
  'icon',
  'color',
  'icon_only',
  'value',
  'label',
  'unit',
  'min',
  'max',
  'show_name',
  'show_progress',
  'precision',
  'format',
  'entities',
  'domain',
  'state',
  'count_state'
] as const;
const EDITOR_BADGE_THRESHOLD_FIELD_KEYS = ['value', 'color'] as const;
const EDITOR_BADGE_RULE_FIELD_KEYS = ['operator', 'value', 'entity', 'attribute'] as const;
const EDITOR_BADGE_COLOR_RULE_FIELD_KEYS = ['operator', 'value', 'entity', 'attribute', 'color'] as const;
const EDITOR_SECTION_VISIBILITY_KEYS = ['header', 'body', 'footer'] as const satisfies readonly (keyof SectionVisibilityConfig)[];
const EDITOR_VISIBILITY_FIELD_KEYS = [
  'entity',
  'attribute',
  'state',
  'state_not',
  'above',
  'below',
  'users',
  'is_admin',
  'is_owner',
  'after',
  'before',
  'weekday',
  'media_query',
  'min_width',
  'max_width'
] as const;
const EDITOR_VISIBILITY_CONDITION_TYPES = [
  CONDITION_TYPES.STATE,
  CONDITION_TYPES.NUMERIC_STATE,
  CONDITION_TYPES.USER,
  CONDITION_TYPES.TIME,
  CONDITION_TYPES.SCREEN,
  CONDITION_TYPES.AND,
  CONDITION_TYPES.OR,
  CONDITION_TYPES.NOT
] as const satisfies readonly VisibilityCondition['condition'][];
const EDITOR_STATE_STYLE_KEYS = [
  'class',
  'background',
  'bg',
  'color',
  'text_color',
  'border',
  'border_color',
  'border_width',
  'border_radius',
  'shadow',
  'box_shadow',
  'opacity',
  'transform',
  'filter'
] as const satisfies readonly (keyof StateStyleRule)[];

type EditorSection = (typeof SECTIONS)[keyof typeof SECTIONS];
type CardSectionKey = 'header' | 'body';
type EditorActionKey = (typeof EDITOR_ACTION_KEYS)[number];
type EditorActionExtraFieldKey = (typeof EDITOR_ACTION_EXTRA_FIELDS)[number];
type EditorTabFieldKey = (typeof EDITOR_TAB_FIELD_KEYS)[number];
type EditorBadgeFieldKey = (typeof EDITOR_BADGE_FIELD_KEYS)[number];
type EditorBadgeThresholdFieldKey = (typeof EDITOR_BADGE_THRESHOLD_FIELD_KEYS)[number];
type EditorBadgeRuleFieldKey = (typeof EDITOR_BADGE_RULE_FIELD_KEYS)[number];
type EditorBadgeColorRuleFieldKey = (typeof EDITOR_BADGE_COLOR_RULE_FIELD_KEYS)[number];
type EditorSectionVisibilityKey = (typeof EDITOR_SECTION_VISIBILITY_KEYS)[number];
type EditorVisibilityFieldKey = (typeof EDITOR_VISIBILITY_FIELD_KEYS)[number];
type EditorStateStyleKey = (typeof EDITOR_STATE_STYLE_KEYS)[number];
type EditorVisibilityScope = 'global' | `section:${EditorSectionVisibilityKey}`;
type VisibilityPathSegment = number | 'conditions';
type VisibilityTreeNode = EditorVisibilityCondition[] | EditorVisibilityCondition | undefined;
type EditorActionConfig = Pick<
  ActionConfig,
  'action' | 'target' | 'entity' | 'service' | 'service_data' | 'custom_action' | 'navigation_path' | 'url_path' | 'url_target'
>;
type EditorBadgeThreshold = Partial<BadgeThreshold>;
type EditorBadgeRule = Partial<BadgeConditionRule>;
type EditorBadgeColorRule = Partial<BadgeColorRule>;
type EditorBadgeConfig = Omit<Partial<HeaderBadgeConfig>, 'thresholds' | 'visibility' | 'color_rules' | 'tap_action' | 'icon_tap_action'> & {
  thresholds?: EditorBadgeThreshold[];
  visibility?: EditorBadgeRule[];
  color_rules?: EditorBadgeColorRule[];
  tap_action?: EditorActionConfig;
  icon_tap_action?: EditorActionConfig;
};
type EditorVisibilityCondition = {
  condition: VisibilityCondition['condition'];
  conditions?: EditorVisibilityCondition[];
  entity?: string;
  attribute?: string;
  state?: string | string[];
  state_not?: string | string[];
  above?: number;
  below?: number;
  users?: string[];
  is_admin?: boolean;
  is_owner?: boolean;
  after?: string;
  before?: string;
  weekday?: NonNullable<TimeVisibilityCondition['weekday']>;
  media_query?: string;
  min_width?: number;
  max_width?: number;
};
type EditorStateStyleRule = Partial<Pick<StateStyleRule, EditorStateStyleKey>>;
type EditorStateStyleMap = Record<string, EditorStateStyleRule>;
type EditorCardSection = {
  cards?: CardConfigLike[];
};
type EditorFooterConfig = Partial<Omit<FooterConfig, 'cards' | 'footer_left' | 'footer_right'>> & {
  cards?: CardConfigLike[];
  footer_left?: EditorCardSection;
  footer_right?: EditorCardSection;
};
type EditorSwipeConfig = Partial<Omit<SwipeConfig, 'left' | 'right' | 'up' | 'down'>> & {
  left?: SwipeConfig['left'];
  right?: SwipeConfig['right'];
  up?: SwipeConfig['up'];
  down?: SwipeConfig['down'];
};
type EditorTabConfig = Omit<Partial<TabConfig>, 'cards'> & {
  cards?: CardConfigLike[];
};
type EditorModalConfig = Partial<ModalConfig>;
type EditorSectionVisibilityConfig = {
  [K in EditorSectionVisibilityKey]?: EditorVisibilityCondition[];
};
type EditorConfig = CardConfigLike & {
  type?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  icon_color?: string;
  entity?: string;
  attribute?: string;
  theme?: string;
  body_mode?: string;
  expanded?: boolean;
  expand_trigger?: string;
  header?: EditorCardSection;
  body?: EditorCardSection;
  modal?: EditorModalConfig;
  footer?: EditorFooterConfig;
  tabs?: EditorTabConfig[];
  visibility?: EditorVisibilityCondition[];
  section_visibility?: EditorSectionVisibilityConfig;
  state_styles?: EditorStateStyleMap;
  theme_tokens?: Record<string, string>;
  swipe?: EditorSwipeConfig;
  badges?: EditorBadgeConfig[];
  tap_action?: EditorActionConfig;
  hold_action?: EditorActionConfig;
  double_tap_action?: EditorActionConfig;
  animation_duration?: number;
  expand_animation?: string;
  collapse_animation?: string;
  cards_animation?: string;
  cards_direction?: string;
  cards_stagger?: number;
  carousel_autoplay?: boolean;
  carousel_interval?: number;
};
type EditorHass = Exclude<HomeAssistantLike, null> & {
  states: HomeAssistantStateMap;
};
type EditorLovelace = {
  config: {
    views: unknown[];
  };
  editMode?: boolean;
  [key: string]: unknown;
};
type DragState = {
  section: string;
  index: number;
};
type FocusableEditorElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type FocusState = {
  id: string;
  name: string;
  tagName: string;
  selectionStart: number | null;
  selectionEnd: number | null;
  value: string;
};
type EditorFieldElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type HaIconPickerElement = HTMLElement & {
  hass?: EditorHass | null;
  value?: string;
};
type HaCodeEditorElement = HTMLElement & {
  hass?: EditorHass;
  mode?: string;
  autofocus?: boolean;
  autocompleteEntities?: boolean;
  autocompleteIcons?: boolean;
  value?: string;
};
type SubEditorElement = HTMLElement & {
  hass?: EditorHass;
  lovelace?: EditorLovelace;
  path?: unknown[];
  setConfig?: (config: CardConfigLike) => void;
};
type HuiCardPickerElement = HTMLElement & {
  hass?: EditorHass;
  lovelace?: EditorLovelace;
  path?: unknown[];
};
type CardPickerChangedEvent = CustomEvent<{
  config?: CardConfigLike;
}>;
type IconPickerChangedEvent = CustomEvent<{
  value?: string;
}>;

function getErrorMessage(error: unknown, fallback = 'Unknown error'): string {
  return error instanceof Error && typeof error.message === 'string' && error.message
    ? error.message
    : fallback;
}

function isObjectLike(value: unknown): value is object {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isEditorVisibilityConditionNode(value: unknown): value is EditorVisibilityCondition {
  return isObjectLike(value) && 'condition' in value;
}

function isEditorActionKey(value: string): value is EditorActionKey {
  return (EDITOR_ACTION_KEYS as readonly string[]).includes(value);
}

function isEditorActionExtraFieldKey(value: string): value is EditorActionExtraFieldKey {
  return (EDITOR_ACTION_EXTRA_FIELDS as readonly string[]).includes(value);
}

function isEditorTabFieldKey(value: string): value is EditorTabFieldKey {
  return (EDITOR_TAB_FIELD_KEYS as readonly string[]).includes(value);
}

function isEditorBadgeFieldKey(value: string): value is EditorBadgeFieldKey {
  return (EDITOR_BADGE_FIELD_KEYS as readonly string[]).includes(value);
}

function isEditorBadgeThresholdFieldKey(value: string): value is EditorBadgeThresholdFieldKey {
  return (EDITOR_BADGE_THRESHOLD_FIELD_KEYS as readonly string[]).includes(value);
}

function isEditorBadgeRuleFieldKey(value: string): value is EditorBadgeRuleFieldKey {
  return (EDITOR_BADGE_RULE_FIELD_KEYS as readonly string[]).includes(value);
}

function isEditorBadgeColorRuleFieldKey(value: string): value is EditorBadgeColorRuleFieldKey {
  return (EDITOR_BADGE_COLOR_RULE_FIELD_KEYS as readonly string[]).includes(value);
}

function isEditorStateStyleKey(value: string): value is EditorStateStyleKey {
  return (EDITOR_STATE_STYLE_KEYS as readonly string[]).includes(value);
}

function isEditorSectionVisibilityKey(value: string): value is EditorSectionVisibilityKey {
  return (EDITOR_SECTION_VISIBILITY_KEYS as readonly string[]).includes(value);
}

function isEditorVisibilityFieldKey(value: string): value is EditorVisibilityFieldKey {
  return (EDITOR_VISIBILITY_FIELD_KEYS as readonly string[]).includes(value);
}

function isEditorVisibilityConditionType(value: string): value is VisibilityCondition['condition'] {
  return (EDITOR_VISIBILITY_CONDITION_TYPES as readonly string[]).includes(value);
}

function isEditorVisibilityScope(value: string): value is EditorVisibilityScope {
  if (value === 'global') {
    return true;
  }

  const section = value.split(':')[1];
  return Boolean(section && isEditorSectionVisibilityKey(section));
}

function getEditorActionKeyForTrigger(trigger: string | undefined): EditorActionKey | null {
  if (trigger === 'tap') {
    return 'tap_action';
  }

  if (trigger === 'hold') {
    return 'hold_action';
  }

  if (trigger === 'double_tap') {
    return 'double_tap_action';
  }

  return null;
}

function setEditorBadgeThresholdField<K extends EditorBadgeThresholdFieldKey>(
  threshold: EditorBadgeThreshold,
  key: K,
  value: EditorBadgeThreshold[K]
): void {
  threshold[key] = value;
}

function setEditorBadgeField<K extends EditorBadgeFieldKey>(
  badge: EditorBadgeConfig,
  key: K,
  value: EditorBadgeConfig[K]
): void {
  badge[key] = value;
}

function setEditorBadgeRuleField<K extends EditorBadgeRuleFieldKey>(
  rule: EditorBadgeRule,
  key: K,
  value: EditorBadgeRule[K]
): void {
  rule[key] = value;
}

function setEditorBadgeColorRuleField<K extends EditorBadgeColorRuleFieldKey>(
  rule: EditorBadgeColorRule,
  key: K,
  value: EditorBadgeColorRule[K]
): void {
  rule[key] = value;
}

function setEditorStateStyleField<K extends EditorStateStyleKey>(
  rule: EditorStateStyleRule,
  key: K,
  value: EditorStateStyleRule[K]
): void {
  rule[key] = value;
}

function setEditorTabField<K extends EditorTabFieldKey>(
  tab: EditorTabConfig,
  key: K,
  value: EditorTabConfig[K]
): void {
  tab[key] = value;
}

function setEditorVisibilityField<K extends EditorVisibilityFieldKey>(
  condition: EditorVisibilityCondition,
  key: K,
  value: EditorVisibilityCondition[K]
): void {
  condition[key] = value;
}

function queryAll<T extends Element>(root: ParentNode, selector: string): T[] {
  return Array.from(root.querySelectorAll(selector)) as T[];
}

function queryOne<T extends Element>(root: ParentNode, selector: string): T | null {
  return root.querySelector(selector) as T | null;
}

function isFocusableEditorElement(value: Element | null): value is FocusableEditorElement {
  return value instanceof HTMLInputElement
    || value instanceof HTMLTextAreaElement
    || value instanceof HTMLSelectElement;
}

function isEditorFieldElement(value: EventTarget | null): value is EditorFieldElement {
  return value instanceof HTMLInputElement
    || value instanceof HTMLSelectElement
    || value instanceof HTMLTextAreaElement;
}

function hasShadowRoot(value: Element | null): value is HTMLElement & { shadowRoot: ShadowRoot } {
  return value instanceof HTMLElement && value.shadowRoot instanceof ShadowRoot;
}

// =============================================================================
// UNIVERSAL CARD EDITOR
// =============================================================================

/**
 * UniversalCardEditor custom element
 * 
 * @extends HTMLElement
 */
export class UniversalCardEditor extends HTMLElement {
  _config: EditorConfig;
  _hass: EditorHass | null;
  _activeSection: EditorSection;
  _history: EditorConfig[];
  _historyIndex: number;
  _editingCardIndex: number | null;
  _editingCardSection: string | null;
  _showSubEditor: boolean;
  _subEditor: SubEditorElement | null;
  _dragState: DragState | null;
  _lastConfigStr: string | null;
  _cardHelpers: CardHelpers | null;
  _inlineEditSection: string | null;
  _inlineEditIndex: number | null;
  
  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  
  /**
   * Create editor instance
   */
  constructor() {
    super();
    
    this.attachShadow({ mode: 'open' });
    
    /** @type {Object} Current configuration */
    this._config = {};
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;
    
    /** @type {string} Active editor section */
    this._activeSection = SECTIONS.BASIC;
    
    /** @type {Object[]} Undo history */
    this._history = [];
    
    /** @type {number} Current history position */
    this._historyIndex = -1;
    
    /** @type {number|null} Индекс редактируемой карточки */
    this._editingCardIndex = null;
    
    /** @type {string|null} Секция редактируемой карточки */
    this._editingCardSection = null;
    
    /** @type {boolean} Показывать ли субредактор */
    this._showSubEditor = false;
    
    /** @type {HTMLElement|null} Субредактор карточки */
    this._subEditor = null;

    /** @type {{section: string, index: number}|null} Drag state for card reordering */
    this._dragState = null;

    this._lastConfigStr = null;
    this._cardHelpers = null;
    this._inlineEditSection = null;
    this._inlineEditIndex = null;
  }
  
  // ===========================================================================
  // SETTERS
  // ===========================================================================
  
  /**
   * Set Home Assistant instance
   * 
   * @param {Object} hass - Home Assistant instance
   */
  set hass(hass: EditorHass) {
    const firstLoad = !this._hass;
    this._hass = hass;
    // Обновляем hass для субредактора если он открыт
    if (this._subEditor) {
      this._subEditor.hass = hass;
    }
    // Рендерим только при первой загрузке, не при каждом обновлении hass
    if (firstLoad) {
      this._render();
    }
  }
  
  /**
   * Set configuration
   * 
   * @param {Object} config - Card configuration
   */
  setConfig(config: CardConfigLike) {
    // Проверяем изменился ли конфиг - если нет, не перерендериваем
    const newConfigStr = JSON.stringify(config);
    if (this._lastConfigStr === newConfigStr) {
      return;
    }
    this._lastConfigStr = newConfigStr;
    
    // Используем JSON.parse/stringify для ПОЛНОГО размораживания объекта
    // deepClone может оставлять внутренние объекты замороженными
    try {
      this._config = JSON.parse(newConfigStr) as EditorConfig;
    } catch (e) {
      this._config = deepClone(config) as EditorConfig;
    }
    this._pushHistory(this._config);
    this._render();
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the editor
   * 
   * @private
   */
  _render() {
    // Сохраняем информацию о текущем фокусе
    const focusInfo = this._saveFocusState();
    
    this.shadowRoot.innerHTML = `
      <style>${this._getStyles()}</style>
      <div class="editor">
        ${this._renderToolbar()}
        ${this._renderTabBar()}
        <div class="editor-content">
          ${this._showSubEditor
            ? this._renderSubEditorContainer()
            : `
              ${this._renderSection(this._activeSection)}
              ${this._renderLiveInspector()}
            `}
        </div>
      </div>
    `;
    
    this._bindEvents();
    
    // Если показываем субредактор - инициализируем его
    if (this._showSubEditor) {
      this._initSubEditor();
    }
    
    // Восстанавливаем фокус
    this._restoreFocusState(focusInfo);
  }
  
  /**
   * Save current focus state
   * @private
   * @returns {Object|null} Focus information
   */
  _saveFocusState(): FocusState | null {
    const activeElement = this.shadowRoot.activeElement;
    if (!isFocusableEditorElement(activeElement)) {
      return null;
    }
    const selectionStart = 'selectionStart' in activeElement ? activeElement.selectionStart : null;
    const selectionEnd = 'selectionEnd' in activeElement ? activeElement.selectionEnd : null;
    
    return {
      id: activeElement.id,
      name: activeElement.name,
      tagName: activeElement.tagName,
      selectionStart,
      selectionEnd,
      value: activeElement.value
    };
  }
  
  /**
   * Restore focus state after render
   * @private
   * @param {Object|null} focusInfo - Saved focus information
   */
  _restoreFocusState(focusInfo: FocusState | null) {
    if (!focusInfo) return;
    
    // Небольшая задержка чтобы DOM успел обновиться
    requestAnimationFrame(() => {
      let element: FocusableEditorElement | null = null;
      
      // Пробуем найти по id
      if (focusInfo.id) {
        const elementById = this.shadowRoot.getElementById(focusInfo.id);
        element = isFocusableEditorElement(elementById) ? elementById : null;
      }
      
      // Если не нашли по id - пробуем по name
      if (!element && focusInfo.name) {
        const elementByName = queryOne<Element>(this.shadowRoot, `[name="${focusInfo.name}"]`);
        element = isFocusableEditorElement(elementByName) ? elementByName : null;
      }
      
      if (element) {
        element.focus();
        
        // Восстанавливаем позицию курсора для текстовых полей
        if (
          typeof focusInfo.selectionStart === 'number'
          && ('setSelectionRange' in element)
          && typeof element.setSelectionRange === 'function'
        ) {
          try {
            element.setSelectionRange(focusInfo.selectionStart, focusInfo.selectionEnd);
          } catch (e) {
            // Некоторые типы input не поддерживают setSelectionRange
          }
        }
      }
    });
  }
  
  /**
   * Render toolbar with undo/redo and actions
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderToolbar() {
    const canUndo = this._historyIndex > 0;
    const canRedo = this._historyIndex < this._history.length - 1;
    
    return `
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">Universal Card Editor</span>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-btn" data-action="undo" ${canUndo ? '' : 'disabled'} title="Отменить">
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button class="toolbar-btn" data-action="redo" ${canRedo ? '' : 'disabled'} title="Повторить">
            <ha-icon icon="mdi:redo"></ha-icon>
          </button>
          <button class="toolbar-btn" data-action="reset" title="Сбросить">
            <ha-icon icon="mdi:restore"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Render horizontal tab bar for sections
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderTabBar() {
    return `
      <div class="tab-bar">
        ${SECTION_DEFINITIONS.map(section => `
          <button class="tab-item ${this._activeSection === section.id ? 'active' : ''}" 
                  data-section="${section.id}"
                  title="${section.label}">
            <ha-icon icon="${section.icon}"></ha-icon>
            <span class="tab-label">${section.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }
  
  /**
   * Render a section
   * 
   * @private
   * @param {string} section - Section ID
   * @returns {string} HTML string
   */
  _renderSection(section: EditorSection): string {
    switch (section) {
      case SECTIONS.BASIC:
        return this._renderBasicSection();
      case SECTIONS.HEADER:
        return this._renderHeaderSection();
      case SECTIONS.BODY:
        return this._renderBodySection();
      case SECTIONS.STYLE:
        return this._renderStyleSection();
      case SECTIONS.FEATURES:
        return this._renderFeaturesSection();
      case SECTIONS.ADVANCED:
        return this._renderAdvancedSection();
      default:
        return '';
    }
  }

  /**
   * Render schema-driven fields.
   *
   * @private
   * @param {Array<string|Array<string>>} fieldPaths
   * @returns {string}
   */
  _renderSchemaFields(fieldPaths: ReadonlyArray<string | ReadonlyArray<string>>): string {
    return fieldPaths.map((entry) => {
      if (typeof entry !== 'string') {
        return `
          <div class="field-row">
            ${entry.map((path) => this._renderSchemaField(path)).join('')}
          </div>
        `;
      }

      return this._renderSchemaField(entry);
    }).join('');
  }

  /**
   * Render a single schema-driven field.
   *
   * @private
   * @param {string} path
   * @returns {string}
   */
  _renderSchemaField(path: string): string {
    const field = getEditorFieldDescriptor(path);
    if (!field) {
      return '';
    }

    const rawValue = field.control === 'icon'
      ? this._getConfigValue(path, '')
      : this._getConfigValue(path, field.default);
    const value = rawValue === null || rawValue === undefined
      ? ''
      : rawValue;
    const hint = field.helper ? `<p class="hint">${this._escapeHtml(field.helper)}</p>` : '';

    if (field.control === 'checkbox') {
      return `
        <div class="field checkbox-field">
          <input type="checkbox"
                 id="${field.id}"
                 name="${path}"
                 ${Boolean(value) ? 'checked' : ''}>
          <label for="${field.id}">${field.label}</label>
          ${hint}
        </div>
      `;
    }

    if (field.control === 'select') {
      return `
        <div class="field">
          <label for="${field.id}">${field.label}</label>
          <select id="${field.id}" name="${path}">
            ${(field.options || []).map((option) => `
              <option value="${this._escapeHtml(option.value)}" ${String(value) === option.value ? 'selected' : ''}>
                ${this._escapeHtml(option.label)}
              </option>
            `).join('')}
          </select>
          ${hint}
        </div>
      `;
    }

    if (field.control === 'icon') {
      const iconValue = typeof value === 'string' ? value : String(value);
      const hasValue = iconValue.trim() !== '';
      return `
        <div class="field field-icon">
          <label for="${field.id}">${field.label}</label>
          <div class="icon-picker-wrapper">
            <ha-icon-picker id="${field.id}"
                            data-name="${path}"
                            data-value="${this._escapeHtml(iconValue)}">
            </ha-icon-picker>
            <button type="button"
                    class="btn-icon icon-clear-btn ${hasValue ? '' : 'hidden'}"
                    data-action="clear-icon"
                    data-path="${path}"
                    title="Очистить иконку">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          ${hint}
        </div>
      `;
    }

    if (field.control === 'entity') {
      return `
        <div class="field">
          <label for="${field.id}">${field.label}</label>
          <input type="text"
                 id="${field.id}"
                 name="${path}"
                 value="${this._escapeHtml(typeof value === 'string' ? value : String(value))}"
                 placeholder="${this._escapeHtml(field.placeholder || '')}"
                 list="entities-list">
          <datalist id="entities-list">
            ${this._hass ? Object.keys(this._hass.states).slice(0, 100).map((entityId) =>
              `<option value="${entityId}">`).join('') : ''}
          </datalist>
          ${hint}
        </div>
      `;
    }

    const inputType = field.control === 'number' ? 'number' : 'text';
    const numericValue = typeof value === 'number'
      ? value
      : value === ''
        ? ''
        : Number.isNaN(Number(value))
          ? ''
          : Number(value);
    const valueAttr = field.control === 'number'
      ? numericValue
      : this._escapeHtml(typeof value === 'string' ? value : String(value));
    const minAttr = field.control === 'number' && field.min !== undefined ? `min="${field.min}"` : '';
    const maxAttr = field.control === 'number' && field.max !== undefined ? `max="${field.max}"` : '';

    return `
      <div class="field">
        <label for="${field.id}">${field.label}</label>
        <input type="${inputType}"
               id="${field.id}"
               name="${path}"
               value="${valueAttr}"
               placeholder="${this._escapeHtml(field.placeholder || '')}"
               ${minAttr}
               ${maxAttr}>
        ${hint}
      </div>
    `;
  }

  /**
   * Read nested config value by dotted path.
   *
   * @private
   * @param {string} path
   * @param {*} fallback
   * @returns {*}
   */
  _getConfigValue<T = string>(path: string, fallback: T): unknown | T {
    const value = path.split('.').reduce((current, key) => current?.[key], this._config);
    return value !== undefined ? value : fallback;
  }

  _getCardsForSection(section: CardSectionKey): CardConfigLike[] {
    return section === 'header'
      ? (this._config.header?.cards || [])
      : (this._config.body?.cards || []);
  }

  _setCardsForSection(section: CardSectionKey, cards: CardConfigLike[]) {
    if (section === 'header') {
      this._config = {
        ...this._config,
        header: {
          ...(this._config.header || {}),
          cards
        }
      };
      return;
    }

    this._config = {
      ...this._config,
      body: {
        ...(this._config.body || {}),
        cards
      }
    };
  }
  
  /**
   * Render basic settings section
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderBasicSection() {
    const expandTrigger = this._config.expand_trigger || 'tap';
    const triggerInfo = this._getTriggerInfo(expandTrigger);
    
    return `
      <div class="section">
        <h3>Основные настройки</h3>
        
        <!-- Card Preview with Trigger Indicator -->
        <div class="card-mini-preview preview-card">
          <div class="mini-preview-header">
            ${this._config.icon ? `<ha-icon icon="${this._config.icon}" class="mini-icon"></ha-icon>` : ''}
            <div class="mini-preview-text">
              <span class="mini-title">${this._escapeHtml(this._config.title || 'Universal Card')}</span>
              ${this._config.subtitle ? `<span class="mini-subtitle">${this._escapeHtml(this._config.subtitle)}</span>` : ''}
            </div>
            <div class="trigger-indicator" title="${triggerInfo.tooltip}">
              <ha-icon icon="${triggerInfo.icon}"></ha-icon>
            </div>
          </div>
        <div class="mini-preview-hint">
          ${triggerInfo.hint}
        </div>
        </div>
        
        ${this._renderSchemaFields(EDITOR_FIELD_GROUPS.basic)}
      </div>
    `;
  }
  
  /**
   * Get trigger info for display
   * @private
   * @param {string} trigger - Trigger type
   * @returns {Object} Trigger info with icon, tooltip, hint
   */
  _getTriggerInfo(trigger) {
    const triggers = {
      'tap': {
        icon: 'mdi:gesture-tap',
        tooltip: 'Раскрытие по клику',
        hint: 'Клик для раскрытия'
      },
      'hold': {
        icon: 'mdi:gesture-tap-hold',
        tooltip: 'Раскрытие по удержанию',
        hint: 'Удержание для раскрытия'
      },
      'double_tap': {
        icon: 'mdi:gesture-double-tap',
        tooltip: 'Раскрытие по двойному клику',
        hint: 'Двойной клик для раскрытия'
      },
      'none': {
        icon: 'mdi:lock-outline',
        tooltip: 'Раскрытие отключено',
        hint: 'Раскрытие через actions'
      }
    };
    return triggers[trigger] || triggers['tap'];
  }
  
  /**
   * Render header settings section
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderHeaderSection() {
    return `
      <div class="section">
        <h3>Настройки заголовка</h3>

        ${this._renderSchemaFields(EDITOR_FIELD_GROUPS.header)}
        
        <div class="subsection">
          <h4>Карточки в заголовке</h4>
          <p class="hint">Перетаскивайте карточки для сортировки. С клавиатуры: Alt + ↑/↓.</p>
          
          <div class="cards-list" id="header-cards">
            ${this._renderCardsList(this._config.header?.cards || [], 'header')}
          </div>
          
          <button class="btn btn-add" data-action="add-header-card">
            <ha-icon icon="mdi:plus"></ha-icon>
            Добавить карточку
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Render body settings section
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderBodySection() {
    const showModalSettings = this._config.body_mode === BODY_MODES.MODAL;

    return `
      <div class="section">
        <h3>Настройки содержимого</h3>
        
        <div class="subsection">
          <h4>Grid Layout</h4>

          ${this._renderSchemaFields([EDITOR_FIELD_GROUPS.body])}
        </div>

        ${showModalSettings ? `
          <div class="subsection">
            <h4>Modal Layout</h4>
            <p class="hint">Размеры принимают CSS значения: <code>auto</code>, <code>px</code>, <code>%</code>, <code>vw</code>, <code>vh</code>, <code>rem</code>.</p>

            ${this._renderSchemaFields([
              ['modal.width', 'modal.height'],
              ['modal.max_width', 'modal.max_height'],
              'modal.loading_strategy'
            ])}
          </div>
        ` : ''}
        
        <div class="subsection">
          <h4>Карточки в body</h4>
          <p class="hint">Drag & drop или кнопки перемещения справа. С клавиатуры: Alt + ↑/↓.</p>
          
          <div class="cards-list" id="body-cards">
            ${this._renderCardsList(this._config.body?.cards || [], 'body')}
          </div>
          
          <button class="btn btn-add" data-action="add-body-card">
            <ha-icon icon="mdi:plus"></ha-icon>
            Добавить карточку
          </button>
        </div>
        
        ${this._config.body_mode === BODY_MODES.TABS ? this._renderTabsEditor() : ''}
        ${this._config.body_mode === BODY_MODES.CAROUSEL ? this._renderCarouselEditor() : ''}
      </div>
    `;
  }
  
  /**
   * Render style settings section
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderStyleSection() {
    return `
      <div class="section">
        <h3>Настройки стиля</h3>

        ${this._renderSchemaFields([['theme', 'icon_color']])}
        
        <div class="theme-preview" style="${this._escapeHtml(this._getThemePreviewStyle())}">
          <div class="preview-header">Preview</div>
          <div class="preview-body">Содержимое</div>
        </div>

        ${this._renderThemeTokensEditor()}

        ${this._renderSchemaFields([['border_radius', 'padding'], 'animation'])}
      </div>
    `;
  }

  /**
   * Render theme token overrides editor
   *
   * @private
   * @returns {string}
   */
  _renderThemeTokensEditor() {
    const tokens = Object.entries(this._config.theme_tokens || {});

    return `
      <div class="subsection">
        <h4>Theme Tokens Overrides</h4>
        <p class="hint">Переопределение CSS переменных карточки (например: --uc-primary-color)</p>

        <div class="theme-tokens-list">
          ${tokens.map(([name, value], index) => `
            <div class="theme-token-item" data-index="${index}" data-token-name="${this._escapeHtml(name)}">
              <input type="text"
                     class="token-name"
                     placeholder="--uc-primary-color"
                     value="${this._escapeHtml(name)}">
              <input type="text"
                     class="token-value"
                     placeholder="#00d4ff"
                     value="${this._escapeHtml(value)}">
              <button class="btn-icon btn-delete" data-action="delete-theme-token" data-index="${index}" title="Удалить токен">
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `).join('')}
        </div>

        <button class="btn btn-small btn-add" data-action="add-theme-token">
          <ha-icon icon="mdi:plus"></ha-icon>
          Добавить токен
        </button>
      </div>
    `;
  }
  
  /**
   * Render features settings section
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderFeaturesSection() {
    return `
      <div class="section features-section">
        <h3>Функции</h3>
        
        <div class="feature-group">
          <div class="feature-group-header">
            <ha-icon icon="mdi:tune-variant"></ha-icon>
            <span>Runtime policy</span>
          </div>

          ${this._renderSchemaFields([
            'lazy_load',
            ['lazy_initial_batch', 'lazy_batch_size'],
            'lazy_idle_timeout',
            'remember_expanded_state',
            'remember_mode_state',
            'auto_collapse_after',
            'stability_mode',
            'enable_card_pool',
            ['pool_scope', 'pool_max_entries'],
            'pool_ttl_ms'
          ])}
        </div>
        
        <!-- Visibility Conditions -->
        ${this._renderVisibilityConditionsUI()}
        
        <!-- State Styles -->
        ${this._renderStateStylesUI()}
        
        <!-- Actions -->
        ${this._renderActionsUI()}
        
        <!-- Swipe Gestures -->
        ${this._renderSwipeGesturesUI()}
        
        <!-- Badges -->
        ${this._renderBadgesUI()}
        
        <!-- Animation Presets -->
        ${this._renderAnimationPresetsUI()}
      </div>
    `;
  }
  
  /**
   * Render Visibility Conditions UI
   * @private
   * @returns {string} HTML string
   */
  _renderVisibilityConditionsUI() {
    const globalConditions = this._config.visibility || [];
    const sectionVisibility = this._config.section_visibility || {};
    const headerConditions = sectionVisibility.header || [];
    const bodyConditions = sectionVisibility.body || [];
    const footerConditions = sectionVisibility.footer || [];
    const totalConditions =
      globalConditions.length +
      headerConditions.length +
      bodyConditions.length +
      footerConditions.length;
    const conditionTypes = getVisibilityConditionTypeOptions();
    
    return `
      <div class="feature-group collapsible ${totalConditions > 0 ? 'has-content' : ''}" data-feature="visibility">
        <div class="feature-group-header" data-toggle="visibility">
          <ha-icon icon="mdi:eye-settings"></ha-icon>
          <span>Условия видимости</span>
          <span class="feature-badge">${totalConditions || ''}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="visibility-content">
          <p class="feature-hint">Каждый блок использует AND-логику: секция показывается только если все условия выполнены.</p>

          ${this._renderVisibilityScope(
            'global',
            'Вся карточка',
            globalConditions,
            conditionTypes,
            'Скрывает/показывает весь компонент.'
          )}
          ${this._renderVisibilityScope(
            'section:header',
            'Header',
            headerConditions,
            conditionTypes,
            'Видимость только заголовка.'
          )}
          ${this._renderVisibilityScope(
            'section:body',
            'Body',
            bodyConditions,
            conditionTypes,
            'Видимость секции контента.'
          )}
          ${this._renderVisibilityScope(
            'section:footer',
            'Footer',
            footerConditions,
            conditionTypes,
            'Видимость footer.'
          )}
        </div>
      </div>
    `;
  }

  /**
   * Render a visibility scope editor
   * @private
   * @param {string} scope - Scope key
   * @param {string} label - Human label
   * @param {Array<Object>} conditions - Scope conditions
   * @param {Array<Object>} conditionTypes - Available condition types
   * @param {string} hint - Scope hint text
   * @returns {string}
   */
  _renderVisibilityScope(
    scope: EditorVisibilityScope,
    label: string,
    conditions: EditorVisibilityCondition[],
    conditionTypes: ReturnType<typeof getVisibilityConditionTypeOptions>,
    hint = ''
  ) {
    return `
      <div class="visibility-scope">
        <div class="visibility-scope-header">
          <span class="visibility-scope-title">${label}</span>
          <span class="feature-badge">${conditions.length || ''}</span>
        </div>
        ${hint ? `<p class="feature-hint">${hint}</p>` : ''}

        <div class="conditions-list">
          ${conditions.length
            ? conditions.map((cond, idx) => this._renderConditionItem(cond, `${idx}`, scope, conditionTypes)).join('')
            : '<p class="feature-hint">Нет условий. Секция всегда видима.</p>'}
        </div>

        <div class="add-condition-row">
          <select class="condition-type-select" data-visibility-scope="${scope}" data-parent-path="">
            <option value="">Выберите тип условия...</option>
            ${conditionTypes.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
          </select>
          <button class="btn btn-small btn-add" data-action="add-visibility-condition" data-scope="${scope}" data-parent-path="">
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Render single condition item
   * @private
   */
  _renderConditionItem(
    condition: EditorVisibilityCondition,
    path: string,
    scope: EditorVisibilityScope = 'global',
    conditionTypes = getVisibilityConditionTypeOptions()
  ) {
    const type = condition.condition || 'state';
    const typeMeta = getVisibilityConditionTypeDescriptor(type);
    const fieldsHtml = this._renderConditionFields(type, condition);
    const nestedConditions = Array.isArray(condition.conditions) ? condition.conditions : [];
    const nestedHtml = isLogicalConditionType(type)
      ? `
        <div class="condition-children">
          <div class="condition-children-header">
            <span>Вложенные условия</span>
            <span class="feature-badge">${nestedConditions.length || ''}</span>
          </div>
          <div class="conditions-list nested-conditions">
            ${nestedConditions.length
              ? nestedConditions.map((child, idx) => this._renderConditionItem(child, `${path}.conditions.${idx}`, scope, conditionTypes)).join('')
              : '<p class="feature-hint">Группа пуста. Добавьте хотя бы одно условие.</p>'}
          </div>
          <div class="add-condition-row nested-add-condition-row">
            <select class="condition-type-select" data-visibility-scope="${scope}" data-parent-path="${path}">
              <option value="">Добавить вложенное условие...</option>
              ${conditionTypes.map((option) => `<option value="${option.value}">${option.label}</option>`).join('')}
            </select>
            <button class="btn btn-small btn-add" data-action="add-visibility-condition" data-scope="${scope}" data-parent-path="${path}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        </div>
      `
      : '';

    return `
      <div class="condition-item ${isLogicalConditionType(type) ? 'condition-item-logical' : ''}" data-path="${path}" data-type="${type}" data-scope="${scope}">
        <div class="condition-type-badge" title="${this._escapeHtml(typeMeta?.label || type)}">${this._escapeHtml(typeMeta?.label || type)}</div>
        <div class="condition-fields">${fieldsHtml}</div>
        <button class="btn-icon btn-delete" data-action="delete-condition" data-scope="${scope}" data-path="${path}">
          <ha-icon icon="mdi:delete"></ha-icon>
        </button>
        ${nestedHtml}
      </div>
    `;
  }

  /**
   * Render visibility condition fields from shared contract descriptors.
   *
   * @private
   * @param {string} type
   * @param {Object} condition
   * @returns {string}
   */
  _renderConditionFields(type: VisibilityCondition['condition'], condition: EditorVisibilityCondition) {
    const fields = getVisibilityConditionFieldDescriptors(type);
    if (fields.length === 0) {
      return `<p class="feature-hint">Эта группа управляется только вложенными условиями.</p>`;
    }

    return fields
      .map((field) => this._renderConditionField(
        field,
        isEditorVisibilityFieldKey(field.key) ? condition[field.key] : undefined
      ))
      .join('');
  }

  /**
   * Render a single visibility condition field.
   *
   * @private
   * @param {import('../editor/EditorContract.js').ContractFieldDescriptor} field
   * @param {*} value
   * @returns {string}
   */
  _renderConditionField(field, value) {
    const formattedValue = this._formatConditionFieldValue(field.key, value);
    const minAttr = field.control === 'number' && field.min !== undefined ? `min="${field.min}"` : '';
    const maxAttr = field.control === 'number' && field.max !== undefined ? `max="${field.max}"` : '';

    if (field.control === 'select') {
      return `
        <label class="condition-control">
          <span>${this._escapeHtml(field.label)}</span>
          <select data-field="${field.key}" class="cond-field">
            ${(field.options || []).map((option) => `
              <option value="${this._escapeHtml(option.value)}" ${formattedValue === option.value ? 'selected' : ''}>
                ${this._escapeHtml(option.label)}
              </option>
            `).join('')}
          </select>
        </label>
      `;
    }

    if (field.control === 'multiselect') {
      const selectedValues = Array.isArray(value) ? value : [];

      return `
        <label class="condition-control">
          <span>${this._escapeHtml(field.label)}</span>
          <select data-field="${field.key}" class="cond-field cond-weekday" multiple title="${this._escapeHtml(field.label)}">
            ${(field.options || []).map((option) => `
              <option value="${this._escapeHtml(option.value)}" ${selectedValues.includes(option.value) ? 'selected' : ''}>
                ${this._escapeHtml(option.label)}
              </option>
            `).join('')}
          </select>
        </label>
      `;
    }

    const inputType = field.control === 'number' ? 'number' : field.key === 'after' || field.key === 'before' ? 'time' : 'text';
    const listAttr = field.control === 'entity' ? 'list="entities-list"' : '';

    return `
      <label class="condition-control">
        <span>${this._escapeHtml(field.label)}</span>
        <input type="${inputType}"
               value="${field.control === 'number' ? (value ?? '') : this._escapeHtml(formattedValue)}"
               placeholder="${this._escapeHtml(field.placeholder || '')}"
               data-field="${field.key}"
               class="cond-field ${field.control === 'number' ? 'cond-small' : ''}"
               ${listAttr}
               ${minAttr}
               ${maxAttr}>
      </label>
    `;
  }

  /**
   * Format condition field value for UI rendering.
   *
   * @private
   * @param {string} key
   * @param {*} value
   * @returns {string}
   */
  _formatConditionFieldValue(key, value) {
    if (value === undefined || value === null) {
      return '';
    }

    if (key === 'weekday' && Array.isArray(value)) {
      return value.join(',');
    }

    if ((key === 'state' || key === 'state_not' || key === 'users') && Array.isArray(value)) {
      return value.join(', ');
    }

    if (typeof value === 'boolean') {
      return String(value);
    }

    return String(value);
  }
  
  /**
   * Render State Styles UI
   * @private
   * @returns {string} HTML string
   */
  _renderStateStylesUI() {
    const hasStateStyles = this._config.state_styles && Object.keys(this._config.state_styles).length > 0;
    const styles = this._config.state_styles || {};
    const entity = this._config.entity || '';
    const styleFields = getStateStyleFieldDescriptors();
    
    return `
      <div class="feature-group collapsible ${hasStateStyles ? 'has-content' : ''}" data-feature="state_styles">
        <div class="feature-group-header" data-toggle="state_styles">
          <ha-icon icon="mdi:palette-swatch"></ha-icon>
          <span>Стили по состоянию</span>
          <span class="feature-badge">${hasStateStyles ? '✓' : ''}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="state-styles-content">
          <p class="feature-hint">Изменение внешнего вида карточки в зависимости от состояния root entity.</p>
          <p class="feature-hint">
            Источник: ${entity ? `<code>${this._escapeHtml(entity)}</code>` : '<strong>root entity не задан</strong>'}.
            Отдельное поле <code>state_styles_entity</code> удалено.
          </p>
          ${this._renderSchemaField('attribute')}
          
          <div class="state-styles-list" id="state-styles-list">
            ${Object.entries(styles).map(([state, style], idx) => `
              <div class="state-style-item" data-state="${this._escapeHtml(state)}">
                <input type="text" value="${this._escapeHtml(state)}" placeholder="on, off, >20, ..." 
                       class="state-key" data-index="${idx}">
                ${styleFields.map((field) => {
                  const styleValue = style[field.key];
                  const normalizedValue = Array.isArray(styleValue)
                    ? styleValue.join(', ')
                    : styleValue === undefined
                      ? ''
                      : String(styleValue);
                  return `
                  <input type="text"
                         value="${this._escapeHtml(normalizedValue)}"
                         placeholder="${this._escapeHtml(field.placeholder || field.label)}"
                         class="style-field"
                         data-style="${field.key}">
                `;
                }).join('')}
                <button class="btn-icon btn-delete" data-action="delete-state-style" data-state="${this._escapeHtml(state)}">
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>
              </div>
            `).join('')}
          </div>
          
          <button class="btn btn-small btn-add" data-action="add-state-style">
            <ha-icon icon="mdi:plus"></ha-icon>
            Добавить стиль
          </button>
          
          <div class="style-presets">
            <span class="preset-label">Пресеты:</span>
            <button class="btn-preset" data-preset="on-off">on/off</button>
            <button class="btn-preset" data-preset="temperature">температура</button>
            <button class="btn-preset" data-preset="battery">батарея</button>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Render Actions UI
   * @private
   * @returns {string} HTML string
   */
  _renderActionsUI() {
    const expandTrigger = this._config.expand_trigger || 'tap';
    const tapAction: EditorActionConfig = this._config.tap_action || {};
    const holdAction: EditorActionConfig = this._config.hold_action || {};
    const doubleTapAction: EditorActionConfig = this._config.double_tap_action || {};
    
    const hasActions = tapAction.action || holdAction.action || doubleTapAction.action || expandTrigger !== 'tap';
    const actionTypes = getEditorFieldOptions('tap_action.action');
    const expandTriggers = getEditorFieldOptions('expand_trigger');
    
    return `
      <div class="feature-group collapsible ${hasActions ? 'has-content' : ''}" data-feature="actions">
        <div class="feature-group-header" data-toggle="actions">
          <ha-icon icon="mdi:gesture-tap"></ha-icon>
          <span>Действия</span>
          <span class="feature-badge">${hasActions ? '✓' : ''}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="actions-content">
          
          <!-- Expand Trigger Selection -->
          <div class="expand-trigger-section">
            <label class="section-label">
              <ha-icon icon="mdi:arrow-expand-vertical"></ha-icon>
              Раскрытие карточки по:
            </label>
            <div class="expand-trigger-grid">
              ${expandTriggers.map(trigger => `
                <button class="expand-trigger-btn ${expandTrigger === trigger.value ? 'active' : ''}" 
                        data-trigger="${trigger.value}">
                  <ha-icon icon="${trigger.icon || 'mdi:cog'}"></ha-icon>
                  <span>${trigger.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
          
          <hr class="section-divider">
          
          <!-- Custom Actions -->
          <div class="custom-actions-section">
            <label class="section-label">
              <ha-icon icon="mdi:cog"></ha-icon>
              Дополнительные действия
            </label>
            <p class="feature-hint">Настройте действия для жестов, не занятых раскрытием</p>
            
            ${this._renderActionRow('tap_action', 'Нажатие (tap)', tapAction, actionTypes, expandTrigger === 'tap')}
            ${this._renderActionRow('hold_action', 'Удержание (hold)', holdAction, actionTypes, expandTrigger === 'hold')}
            ${this._renderActionRow('double_tap_action', 'Двойной клик', doubleTapAction, actionTypes, expandTrigger === 'double_tap')}
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Render single action row
   * @private
   * @param {string} actionKey - Action config key
   * @param {string} label - Display label
   * @param {Object} action - Action config
   * @param {Array} actionTypes - Available action types
   * @param {boolean} isExpandTrigger - Is this action used for expand
   */
  _renderActionRow(
    actionKey: EditorActionKey,
    label: string,
    action: EditorActionConfig,
    actionTypes: ReturnType<typeof getEditorFieldOptions>,
    isExpandTrigger = false
  ) {
    const currentAction = action.action || 'none';
    const serviceField = getEditorFieldDescriptor(`${actionKey}.service`);
    const navigationField = getEditorFieldDescriptor(`${actionKey}.navigation_path`);
    const urlField = getEditorFieldDescriptor(`${actionKey}.url_path`);
    
    // Если это триггер раскрытия - показываем специальное состояние
    if (isExpandTrigger) {
      return `
        <div class="action-row disabled" data-action-key="${actionKey}">
          <label>${label}</label>
          <div class="action-expand-badge">
            <ha-icon icon="mdi:arrow-expand-vertical"></ha-icon>
            <span>Раскрытие карточки</span>
          </div>
        </div>
      `;
    }
    
    let extraFields = '';
    if (currentAction === 'call-service') {
      extraFields = `
        <input type="text" placeholder="${this._escapeHtml(serviceField?.placeholder || 'domain.service')}" value="${this._escapeHtml(action.service || '')}" 
               data-action-key="${actionKey}" data-field="service" class="action-extra-field">
      `;
    } else if (currentAction === 'navigate') {
      extraFields = `
        <input type="text" placeholder="${this._escapeHtml(navigationField?.placeholder || '/lovelace/view')}" value="${this._escapeHtml(action.navigation_path || '')}" 
               data-action-key="${actionKey}" data-field="navigation_path" class="action-extra-field">
      `;
    } else if (currentAction === 'url') {
      extraFields = `
        <input type="text" placeholder="${this._escapeHtml(urlField?.placeholder || 'https://...')}" value="${this._escapeHtml(action.url_path || '')}" 
               data-action-key="${actionKey}" data-field="url_path" class="action-extra-field">
      `;
    }
    
    return `
      <div class="action-row" data-action-key="${actionKey}">
        <label>${label}</label>
        <select class="action-type-select" data-action-key="${actionKey}">
          ${actionTypes.map(t => `<option value="${t.value}" ${currentAction === t.value ? 'selected' : ''}>${t.label}</option>`).join('')}
        </select>
        ${extraFields}
      </div>
    `;
  }
  
  /**
   * Render Swipe Gestures UI
   * @private
   * @returns {string} HTML string
   */
  _renderSwipeGesturesUI() {
    const swipe: EditorSwipeConfig = this._config.swipe || {};
    const hasSwipe = swipe.enabled || swipe.left || swipe.right || swipe.up || swipe.down;
    
    return `
      <div class="feature-group collapsible ${hasSwipe ? 'has-content' : ''}" data-feature="swipe">
        <div class="feature-group-header" data-toggle="swipe">
          <ha-icon icon="mdi:gesture-swipe-horizontal"></ha-icon>
          <span>Жесты свайпа</span>
          <span class="feature-badge">${hasSwipe ? '✓' : ''}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="swipe-content">
          <p class="feature-hint">Действия при свайпе по карточке</p>

          ${this._renderSchemaFields([
            ['swipe.enabled', 'swipe.preventScroll'],
            ['swipe.direction', 'swipe.threshold'],
            ['swipe.velocityThreshold'],
            ['swipe.left.action', 'swipe.right.action'],
            ['swipe.up.action', 'swipe.down.action']
          ])}
        </div>
      </div>
    `;
  }
  
  /**
   * Render Badges UI
   * @private
   * @returns {string} HTML string
   */
  _renderBadgesUI() {
    const badges = this._config.badges || [];
    
    return `
      <div class="feature-group collapsible ${badges.length > 0 ? 'has-content' : ''}" data-feature="badges">
        <div class="feature-group-header" data-toggle="badges">
          <ha-icon icon="mdi:tag-multiple"></ha-icon>
          <span>Бейджи</span>
          <span class="feature-badge">${badges.length || ''}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="badges-content">
          <p class="feature-hint">Отображение состояний в заголовке карточки</p>
          
          <div class="badges-list" id="badges-list">
            ${badges.length
              ? badges.map((badge, idx) => this._renderBadgeItem(badge, idx)).join('')
              : '<p class="feature-hint">Нет badges. Добавьте первый badge ниже.</p>'}
          </div>
          
          <button class="btn btn-small btn-add" data-action="add-badge">
            <ha-icon icon="mdi:plus"></ha-icon>
            Добавить бейдж
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render a badge editor item from shared badge descriptors.
   *
   * @private
   * @param {Object} badge
   * @param {number} index
   * @returns {string}
   */
  _renderBadgeItem(badge: EditorBadgeConfig, index: number) {
    const type = badge.type || 'state';
    const badgeFields = getBadgeFieldDescriptors(type);
    const thresholdFields = getBadgeThresholdFieldDescriptors();
    const visibilityRuleFields = getBadgeVisibilityRuleFieldDescriptors();
    const colorRuleFields = getBadgeColorRuleFieldDescriptors();
    const thresholds = Array.isArray(badge.thresholds) ? badge.thresholds : [];
    const visibilityRules = Array.isArray(badge.visibility) ? badge.visibility : [];
    const colorRules = Array.isArray(badge.color_rules) ? badge.color_rules : [];

    return `
      <div class="badge-item" data-index="${index}">
        <div class="badge-item-header">
          <span class="badge-item-title">Badge ${index + 1}</span>
          <button class="btn-icon btn-delete" data-action="delete-badge" data-index="${index}">
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        <div class="badge-fields-grid">
          ${badgeFields.map((field) => this._renderBadgeField(field, badge, index)).join('')}
        </div>
        <div class="badge-thresholds">
          <div class="badge-thresholds-header">
            <span>Thresholds</span>
            <span class="feature-badge">${thresholds.length || ''}</span>
          </div>
          <div class="badge-threshold-list">
            ${thresholds.length
              ? thresholds.map((threshold, thresholdIndex) => `
                <div class="badge-threshold-item" data-index="${index}" data-threshold-index="${thresholdIndex}">
                  ${thresholdFields.map((field) => this._renderBadgeThresholdField(field, threshold, index, thresholdIndex)).join('')}
                  <button class="btn-icon btn-delete" data-action="delete-badge-threshold" data-index="${index}" data-threshold-index="${thresholdIndex}">
                    <ha-icon icon="mdi:delete"></ha-icon>
                  </button>
                </div>
              `).join('')
              : '<p class="feature-hint">Нет thresholds.</p>'}
          </div>
          <button class="btn btn-small btn-add" data-action="add-badge-threshold" data-index="${index}">
            <ha-icon icon="mdi:plus"></ha-icon>
            Добавить threshold
          </button>
        </div>
        ${this._renderBadgeRuleSection({
          title: 'Visibility Rules',
          emptyText: 'Нет visibility rules.',
          action: 'add-badge-visibility-rule',
          ruleKind: 'visibility',
          fields: visibilityRuleFields,
          rules: visibilityRules,
          index
        })}
        ${this._renderBadgeRuleSection({
          title: 'Color Rules',
          emptyText: 'Нет color rules.',
          action: 'add-badge-color-rule',
          ruleKind: 'color_rules',
          fields: colorRuleFields,
          rules: colorRules,
          index
        })}
      </div>
    `;
  }

  /**
   * Render a badge field using shared contract metadata.
   *
   * @private
   * @param {import('../editor/EditorContract.js').EditorFieldDescriptor} field
   * @param {Object} badge
   * @param {number} index
   * @returns {string}
   */
  _renderBadgeField(
    field: import('../editor/EditorContract.js').EditorFieldDescriptor,
    badge: EditorBadgeConfig,
    index: number
  ) {
    const fieldKey = this._getBadgeFieldKey(field.path);
    const value = badge[fieldKey];
    return this._renderBadgeContractField(field, value, {
      index,
      fieldKey,
      className: 'badge-field'
    });
  }

  /**
   * Render a badge threshold field.
   *
   * @private
   * @param {import('../editor/EditorContract.js').EditorFieldDescriptor} field
   * @param {Object} threshold
   * @param {number} index
   * @param {number} thresholdIndex
   * @returns {string}
   */
  _renderBadgeThresholdField(
    field: import('../editor/EditorContract.js').EditorFieldDescriptor,
    threshold: EditorBadgeThreshold,
    index: number,
    thresholdIndex: number
  ) {
    const fieldKey = this._getBadgeThresholdFieldKey(field.path);
    return this._renderBadgeContractField(field, threshold[fieldKey], {
      index,
      fieldKey,
      className: 'badge-field badge-threshold-field',
      thresholdIndex
    });
  }

  /**
   * Render a badge rules editor section.
   *
   * @private
   * @param {{
   *   title:string,
   *   emptyText:string,
   *   action:string,
   *   ruleKind:'visibility'|'color_rules',
   *   fields: import('../editor/EditorContract.js').EditorFieldDescriptor[],
   *   rules: EditorBadgeRule[] | EditorBadgeColorRule[],
   *   index:number
   * }} options
   * @returns {string}
   */
  _renderBadgeRuleSection(options) {
    const {
      title,
      emptyText,
      action,
      ruleKind,
      fields,
      rules,
      index
    } = options;

    return `
      <div class="badge-rules">
        <div class="badge-rules-header">
          <span>${this._escapeHtml(title)}</span>
          <span class="feature-badge">${rules.length || ''}</span>
        </div>
        <div class="badge-rule-list">
          ${rules.length
            ? rules.map((rule, ruleIndex) => `
              <div class="badge-rule-item" data-index="${index}" data-rule-kind="${ruleKind}" data-rule-index="${ruleIndex}">
                ${fields.map((field) => this._renderBadgeRuleField(field, rule, index, ruleKind, ruleIndex)).join('')}
                <button class="btn-icon btn-delete" data-action="delete-badge-rule" data-index="${index}" data-rule-kind="${ruleKind}" data-rule-index="${ruleIndex}">
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>
              </div>
            `).join('')
            : `<p class="feature-hint">${this._escapeHtml(emptyText)}</p>`}
        </div>
        <button class="btn btn-small btn-add" data-action="${action}" data-index="${index}">
          <ha-icon icon="mdi:plus"></ha-icon>
          Добавить правило
        </button>
      </div>
    `;
  }

  /**
   * Render a badge visibility/color rule field.
   *
   * @private
   * @param {import('../editor/EditorContract.js').EditorFieldDescriptor} field
   * @param {EditorBadgeRule | EditorBadgeColorRule} rule
   * @param {number} index
   * @param {'visibility'|'color_rules'} ruleKind
   * @param {number} ruleIndex
   * @returns {string}
   */
  _renderBadgeRuleField(
    field: import('../editor/EditorContract.js').EditorFieldDescriptor,
    rule: EditorBadgeRule | EditorBadgeColorRule,
    index: number,
    ruleKind: 'visibility' | 'color_rules',
    ruleIndex: number
  ) {
    const fieldKey = ruleKind === 'visibility'
      ? this._getBadgeRuleFieldKey(field.path)
      : this._getBadgeColorRuleFieldKey(field.path);

    return this._renderBadgeContractField(field, rule[fieldKey], {
      index,
      fieldKey,
      className: 'badge-field badge-rule-field',
      ruleKind,
      ruleIndex
    });
  }

  /**
   * Render a contract-backed badge input control.
   *
   * @private
   * @param {import('../editor/EditorContract.js').EditorFieldDescriptor} field
   * @param {*} value
   * @param {{
   *   index:number,
   *   fieldKey:string,
   *   className:string,
   *   thresholdIndex?:number,
   *   ruleKind?:'visibility'|'color_rules',
   *   ruleIndex?:number
   * }} options
   * @returns {string}
   */
  _renderBadgeContractField(field, value, options) {
    const { index, fieldKey, className, thresholdIndex, ruleKind, ruleIndex } = options;
    const dataThreshold = thresholdIndex !== undefined ? `data-threshold-index="${thresholdIndex}"` : '';
    const dataRuleKind = ruleKind ? `data-rule-kind="${ruleKind}"` : '';
    const dataRuleIndex = ruleIndex !== undefined ? `data-rule-index="${ruleIndex}"` : '';
    const inputId = `${field.id}_${index}${thresholdIndex !== undefined ? `_${thresholdIndex}` : ''}${ruleIndex !== undefined ? `_${ruleIndex}` : ''}`;

    if (field.control === 'checkbox') {
      return `
        <div class="field checkbox-field badge-field-block">
          <input type="checkbox"
                 id="${inputId}"
                 class="${className}"
                 data-field="${fieldKey}"
                 data-index="${index}"
                 ${dataThreshold}
                 ${dataRuleKind}
                 ${dataRuleIndex}
                 ${value ? 'checked' : ''}>
          <label for="${inputId}">${this._escapeHtml(field.label)}</label>
        </div>
      `;
    }

    if (field.control === 'select') {
      return `
        <label class="badge-field-block">
          <span>${this._escapeHtml(field.label)}</span>
          <select class="${className}" data-field="${fieldKey}" data-index="${index}" ${dataThreshold} ${dataRuleKind} ${dataRuleIndex}>
            ${(field.options || []).map((option) => `
              <option value="${this._escapeHtml(option.value)}" ${String(value ?? field.default ?? '') === option.value ? 'selected' : ''}>
                ${this._escapeHtml(option.label)}
              </option>
            `).join('')}
          </select>
        </label>
      `;
    }

    const inputType = field.control === 'number' ? 'number' : 'text';
    const listAttr = field.control === 'entity' ? 'list="entities-list"' : '';
    const minAttr = field.control === 'number' && field.min !== undefined ? `min="${field.min}"` : '';
    const maxAttr = field.control === 'number' && field.max !== undefined ? `max="${field.max}"` : '';
    const renderedValue = fieldKey === 'entities' && Array.isArray(value)
      ? value.join(', ')
      : value ?? '';

    return `
      <label class="badge-field-block">
        <span>${this._escapeHtml(field.label)}</span>
        <input type="${inputType}"
               value="${field.control === 'number' ? renderedValue : this._escapeHtml(String(renderedValue))}"
               placeholder="${this._escapeHtml(field.placeholder || '')}"
               class="${className}"
               data-field="${fieldKey}"
               data-index="${index}"
               ${dataThreshold}
               ${dataRuleKind}
               ${dataRuleIndex}
               ${listAttr}
               ${minAttr}
               ${maxAttr}>
      </label>
    `;
  }

  /**
   * Resolve badge field key from contract path.
   *
   * @private
   * @param {string} path
   * @returns {string}
   */
  _getBadgeFieldKey(path: string): EditorBadgeFieldKey {
    const fieldKey = path.replace('badges.', '');
    if (!isEditorBadgeFieldKey(fieldKey)) {
      throw new Error(`Unsupported badge field: ${path}`);
    }

    return fieldKey;
  }

  /**
   * Resolve badge threshold field key from contract path.
   *
   * @private
   * @param {string} path
   * @returns {'value'|'color'}
   */
  _getBadgeThresholdFieldKey(path: string): EditorBadgeThresholdFieldKey {
    const fieldKey = path.replace('badges.thresholds.', '');
    if (!isEditorBadgeThresholdFieldKey(fieldKey)) {
      throw new Error(`Unsupported badge threshold field: ${path}`);
    }

    return fieldKey;
  }

  /**
   * Resolve badge visibility rule field key from contract path.
   *
   * @private
   * @param {string} path
   * @returns {EditorBadgeRuleFieldKey}
   */
  _getBadgeRuleFieldKey(path: string): EditorBadgeRuleFieldKey {
    const fieldKey = path.replace('badges.visibility.', '');
    if (!isEditorBadgeRuleFieldKey(fieldKey)) {
      throw new Error(`Unsupported badge visibility field: ${path}`);
    }

    return fieldKey;
  }

  /**
   * Resolve badge color rule field key from contract path.
   *
   * @private
   * @param {string} path
   * @returns {EditorBadgeColorRuleFieldKey}
   */
  _getBadgeColorRuleFieldKey(path: string): EditorBadgeColorRuleFieldKey {
    const fieldKey = path.replace('badges.color_rules.', '');
    if (!isEditorBadgeColorRuleFieldKey(fieldKey)) {
      throw new Error(`Unsupported badge color rule field: ${path}`);
    }

    return fieldKey;
  }
  
  /**
   * Render Animation Presets UI
   * @private
   * @returns {string} HTML string
   */
  _renderAnimationPresetsUI() {
    const expandAnimationField = getEditorFieldDescriptor('expand_animation');
    const collapseAnimationField = getEditorFieldDescriptor('collapse_animation');
    const cardsAnimationField = getEditorFieldDescriptor('cards_animation');
    const cardsStaggerField = getEditorFieldDescriptor('cards_stagger');
    const durationField = getEditorFieldDescriptor('animation_duration');

    const expandAnimation = this._config.expand_animation || expandAnimationField?.default || 'slide';
    const collapseAnimation = this._config.collapse_animation || collapseAnimationField?.default || 'slide';
    const duration = this._config.animation_duration ?? durationField?.default ?? 300;
    const cardsAnimation = this._config.cards_animation || cardsAnimationField?.default || 'fadeUp';
    const cardsStagger = this._config.cards_stagger ?? cardsStaggerField?.default ?? 50;

    const expandAnimations = getEditorFieldOptions('expand_animation');
    const collapseAnimations = getEditorFieldOptions('collapse_animation');
    const cardsAnimations = getEditorFieldOptions('cards_animation');
    
    const hasAnimation = expandAnimation !== 'none' || collapseAnimation !== 'none' || cardsAnimation !== 'none';
    
    return `
      <div class="feature-group collapsible ${hasAnimation ? 'has-content' : ''}" data-feature="animation">
        <div class="feature-group-header" data-toggle="animation">
          <ha-icon icon="mdi:animation-play"></ha-icon>
          <span>Анимации</span>
          <span class="feature-badge">${hasAnimation ? '✓' : ''}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="animation-content">
          
          <!-- Body Expand Animation -->
          <div class="animation-section">
            <label class="section-label">
              <ha-icon icon="mdi:arrow-expand-vertical"></ha-icon>
              Раскрытие body
            </label>
            <div class="animation-grid">
              ${expandAnimations.map(a => `
                <button class="animation-btn ${expandAnimation === a.value ? 'active' : ''}" 
                        data-animation-type="expand" data-animation="${a.value}"
                        title="${a.label}">
                  <ha-icon icon="${a.icon}"></ha-icon>
                  <span>${a.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
          
          <!-- Body Collapse Animation -->
          <div class="animation-section">
            <label class="section-label">
              <ha-icon icon="mdi:arrow-collapse-vertical"></ha-icon>
              Сворачивание body
            </label>
            <div class="animation-grid">
              ${collapseAnimations.map(a => `
                <button class="animation-btn ${collapseAnimation === a.value ? 'active' : ''}" 
                        data-animation-type="collapse" data-animation="${a.value}"
                        title="${a.label}">
                  <ha-icon icon="${a.icon}"></ha-icon>
                  <span>${a.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
          
          <hr class="section-divider">
          
          <!-- Cards Animation -->
          <div class="animation-section">
            <label class="section-label">
              <ha-icon icon="mdi:cards"></ha-icon>
              Появление карточек (каскад)
            </label>
            <div class="animation-grid">
              ${cardsAnimations.map(a => `
                <button class="animation-btn ${cardsAnimation === a.value ? 'active' : ''}" 
                        data-animation-type="cards" data-animation="${a.value}"
                        title="${a.label}">
                  <ha-icon icon="${a.icon}"></ha-icon>
                  <span>${a.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
          
          <!-- Cards Stagger Delay -->
          <div class="animation-duration-section">
            <label class="section-label">
              <ha-icon icon="mdi:sort-clock-ascending"></ha-icon>
              ${this._escapeHtml(cardsStaggerField?.label || 'Задержка между карточками')}
            </label>
            <div class="duration-row">
              <input type="range" id="cards_stagger_slider" 
                     min="${cardsStaggerField?.min ?? 0}" max="${cardsStaggerField?.max ?? 200}" step="10"
                     value="${cardsStagger}">
              <span class="stagger-value">${cardsStagger}ms</span>
            </div>
          </div>
          
          <!-- Cards Direction -->
          ${this._renderCardsDirectionUI()}
          
          <hr class="section-divider">
          
          <!-- Duration -->
          <div class="animation-duration-section">
            <label class="section-label">
              <ha-icon icon="mdi:timer-outline"></ha-icon>
              ${this._escapeHtml(durationField?.label || 'Общая длительность')}
            </label>
            <div class="duration-row">
              <input type="range" id="animation_duration_slider" 
                     min="${durationField?.min ?? 0}" max="${durationField?.max ?? 1000}" step="50"
                     value="${duration}">
              <span class="duration-value">${duration}ms</span>
            </div>
          </div>
          
          <!-- Preview Button -->
          <button class="btn btn-preview-animation" data-action="preview-animation">
            <ha-icon icon="mdi:play-circle-outline"></ha-icon>
            Предпросмотр
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Render cards direction UI
   * @private
   * @returns {string} HTML string
   */
  _renderCardsDirectionUI() {
    const directionField = getEditorFieldDescriptor('cards_direction');
    const direction = this._config.cards_direction || directionField?.default || 'sequential';
    const directions = getEditorFieldOptions('cards_direction');
    
    return `
      <div class="animation-section">
        <label class="section-label">
          <ha-icon icon="mdi:arrow-decision"></ha-icon>
          ${this._escapeHtml(directionField?.label || 'Направление появления')}
        </label>
        <div class="direction-grid">
          ${directions.map(d => `
            <button class="direction-btn ${direction === d.value ? 'active' : ''}" 
                    data-direction="${d.value}"
                    title="${d.label}">
              <ha-icon icon="${d.icon || 'mdi:arrow-right'}"></ha-icon>
              <span>${d.label}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  /**
   * Render advanced settings section
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderAdvancedSection() {
    return `
      <div class="section">
        <h3>Расширенные настройки</h3>

        ${this._renderSchemaFields(EDITOR_FIELD_GROUPS.advanced)}
        
        <div class="subsection">
          <h4>YAML Preview</h4>
          <div class="yaml-preview">${this._getYamlPreview()}</div>
        </div>
      </div>
    `;
  }
  
  /**
   * Render cards list
   * 
   * @private
   * @param {Object[]} cards - Array of card configs
   * @param {string} section - Section name (header/body)
   * @returns {string} HTML string
   */
  _renderCardsList(cards: CardConfigLike[], section: CardSectionKey) {
    if (!cards || !cards.length) {
      return '<div class="empty-state">Нет карточек</div>';
    }
    
    return cards.map((card, index) => {
      const isEditing = this._inlineEditSection === section && this._inlineEditIndex === index;
      const isFirst = index === 0;
      const isLast = index === cards.length - 1;
      
      if (isEditing) {
        // Inline editor
        return `
          <div class="card-item editing" data-section="${section}" data-index="${index}">
            <div class="inline-editor" id="inline-editor-${section}-${index}">
              <!-- Editor will be inserted here -->
            </div>
          </div>
        `;
      }
      
      return `
        <div class="card-item"
             data-section="${section}"
             data-index="${index}"
             draggable="true"
             tabindex="0"
             aria-label="Card ${index + 1} in ${section}">
          <div class="card-item-content" data-action="edit-card-inline" data-section="${section}" data-index="${index}">
            <ha-icon icon="mdi:drag-vertical" class="drag-handle"></ha-icon>
            <span class="card-type">${this._escapeHtml(typeof card.type === 'string' ? card.type : 'unknown')}</span>
            ${typeof card.entity === 'string' && card.entity ? `<span class="card-entity">${this._escapeHtml(card.entity)}</span>` : ''}
            ${typeof card.content === 'string' && card.content ? `<span class="card-content-preview">${this._escapeHtml(card.content.substring(0, 30))}...</span>` : ''}
          </div>
          <div class="card-item-actions">
            <button class="btn-icon" data-action="move-card" data-direction="up" data-section="${section}" data-index="${index}" title="Сдвинуть вверх" ${isFirst ? 'disabled' : ''}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>
            <button class="btn-icon" data-action="move-card" data-direction="down" data-section="${section}" data-index="${index}" title="Сдвинуть вниз" ${isLast ? 'disabled' : ''}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>
            <button class="btn-icon" data-action="edit-card-inline" data-section="${section}" data-index="${index}" title="Редактировать">
              <ha-icon icon="mdi:pencil"></ha-icon>
            </button>
            <button class="btn-icon btn-danger" data-action="delete-card" data-section="${section}" data-index="${index}" title="Удалить">
              <ha-icon icon="mdi:delete"></ha-icon>
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
  
  /**
   * Render sub-editor container for card editing
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderSubEditorContainer() {
    return `
      <div class="sub-editor-container">
        <div class="sub-editor-header">
          <button class="btn btn-back" data-action="close-sub-editor">
            <ha-icon icon="mdi:arrow-left"></ha-icon>
            Назад к списку
          </button>
          <span class="sub-editor-title">Редактирование карточки</span>
        </div>
        <div class="sub-editor-content" id="sub-editor-slot">
          <!-- Card picker or editor will be inserted here -->
        </div>
      </div>
    `;
  }
  
  /**
   * Initialize sub-editor for card
   * 
   * @private
   */
  async _initSubEditor() {
    const slot = this.shadowRoot.getElementById('sub-editor-slot');
    if (!slot) return;
    
    const section = this._editingCardSection;
    const index = this._editingCardIndex;
    if (section !== 'header' && section !== 'body') return;
    if (index === null) return;
    
    // Если добавляем новую карточку - показываем card picker
    if (index === -1) {
      await this._showCardPicker(slot, section);
    } else {
      // Редактируем существующую карточку
      const cards = this._getCardsForSection(section);
      
      const cardConfig = cards[index];
      if (cardConfig) {
        await this._showCardEditor(slot, cardConfig, section, index);
      }
    }
  }
  
  /**
   * Show card picker for selecting card type
   * 
   * @private
   * @param {HTMLElement} container - Container element
   * @param {string} section - Section name (header/body)
   */
  async _showCardPicker(container: HTMLElement, section: 'header' | 'body') {
    const rendered = await this._tryShowHaCardPicker(container, section);
    if (!rendered) {
      this._showFallbackCardPicker(
        container,
        section,
        'Стандартный picker недоступен, используется встроенный список.'
      );
    }
  }
  
  /**
   * Show fallback picker
   * 
   * @private
   * @param {HTMLElement} container - Container element
   * @param {string} section - Section name (header/body)
   * @param {string} reason - Reason why fallback is used
   */
  _showFallbackCardPicker(container: HTMLElement, section: 'header' | 'body', reason = '') {
    container.innerHTML = this._renderCardTypeSelector(section, reason);
    this._bindCardTypeSelector(container, section);
  }
  
  /**
   * Try rendering Home Assistant native card picker
   * 
   * @private
   * @param {HTMLElement} container - Container element
   * @param {string} section - Section name (header/body)
   * @returns {Promise<boolean>} True when native picker is rendered
   */
  async _tryShowHaCardPicker(container: HTMLElement, section: 'header' | 'body'): Promise<boolean> {
    if (!this._hass) {
      return false;
    }
    
    // В некоторых версиях HA элемент регистрируется только после loadCardHelpers()
    await this._loadCardHelpers();
    
    if (!customElements.get('hui-card-picker')) {
      return false;
    }
    
    try {
      container.innerHTML = `
        <div class="ha-picker-wrapper">
          <div class="picker-tools">
            <button class="btn btn-add btn-small" type="button" id="use-fallback-picker">
              <ha-icon icon="mdi:view-grid"></ha-icon>
              Список карточек
            </button>
          </div>
          <div id="ha-card-picker-slot"></div>
        </div>
      `;
      
      const slot = queryOne<HTMLElement>(container, '#ha-card-picker-slot');
      if (!slot) {
        return false;
      }
      
      const picker = document.createElement('hui-card-picker') as HuiCardPickerElement;
      picker.hass = this._hass;
      picker.lovelace = this._getLovelace();
      picker.path = [];
      picker.addEventListener('config-changed', (event: CardPickerChangedEvent) => {
        const pickedConfig = event.detail?.config;
        if (!pickedConfig || !pickedConfig.type) return;
        this._handlePickedCardConfig(section, pickedConfig);
      });
      slot.appendChild(picker);
      
      const fallbackBtn = queryOne<HTMLButtonElement>(container, '#use-fallback-picker');
      if (fallbackBtn) {
        fallbackBtn.addEventListener('click', () => {
          this._showFallbackCardPicker(container, section);
        });
      }
      
      return true;
    } catch (error) {
      console.warn('[UC Editor] Could not render hui-card-picker:', error);
      return false;
    }
  }
  
  /**
   * Normalize and apply picked card config
   * 
   * @private
   * @param {string} section - Section name
   * @param {Object} pickedConfig - Config emitted by picker
   */
  _handlePickedCardConfig(section: 'header' | 'body', pickedConfig: CardConfigLike) {
    if (!isObjectLike(pickedConfig)) return;
    
    const config = deepClone(pickedConfig) as CardConfigLike & { type?: string };
    config.type = this._normalizeCardType(config.type);
    
    if (!config.type) return;
    
    this._addCardConfig(section, config);
    this._closeSubEditor();
  }
  
  /**
   * Load card helpers from Home Assistant
   * 
   * @private
   * @returns {Promise<Object|null>}
   */
  async _loadCardHelpers(): Promise<CardHelpers | null> {
    if (this._cardHelpers) return this._cardHelpers;
    
    try {
      if (window.loadCardHelpers) {
        this._cardHelpers = await window.loadCardHelpers();
        return this._cardHelpers;
      }
    } catch (e) {
      console.warn('[UC Editor] Could not load card helpers:', e);
    }
    
    return null;
  }
  
  /**
   * Get lovelace config (needed for card picker)
   * 
   * @private
   * @returns {Object}
   */
  _getLovelace(): EditorLovelace {
    // Пробуем найти lovelace через разные способы
    let lovelace: EditorLovelace | null = null;
    
    // Способ 1: через document.__lovelace
    const documentWithLovelace = document as Document & { __lovelace?: EditorLovelace | null };
    if (documentWithLovelace.__lovelace) {
      lovelace = documentWithLovelace.__lovelace;
    }
    
    // Способ 2: через hui-root
    if (!lovelace) {
      const root = queryOne<HTMLElement>(document, 'home-assistant');
      if (hasShadowRoot(root)) {
        const main = queryOne<HTMLElement>(root.shadowRoot, 'home-assistant-main');
        if (hasShadowRoot(main)) {
          const panel = queryOne<HTMLElement>(main.shadowRoot, 'ha-panel-lovelace') as (HTMLElement & {
            lovelace?: EditorLovelace | null;
          }) | null;
          if (panel) {
            lovelace = panel.lovelace;
          }
        }
      }
    }
    
    // Проверяем что lovelace имеет корректную структуру
    // hui-card-picker требует lovelace.config.views как массив
    if (!lovelace || !lovelace.config || !Array.isArray(lovelace.config.views)) {
      lovelace = {
        config: { views: [{ cards: [] }] },
        editMode: true
      };
    }
    
    return lovelace;
  }
  
  /**
   * Get all available card types including HACS custom cards
   * 
   * @private
   * @returns {Array<Object>}
   */
  _getAllAvailableCards() {
    const cards = [];
    
    // Стандартные карточки Home Assistant
    const builtInCards = [
      { type: 'alarm-panel', name: 'Alarm Panel', description: 'Панель управления охранной сигнализацией', icon: 'mdi:shield' },
      { type: 'area', name: 'Area', description: 'Карточка области', icon: 'mdi:texture-box' },
      { type: 'button', name: 'Button', description: 'Кнопка для действий', icon: 'mdi:gesture-tap-button' },
      { type: 'calendar', name: 'Calendar', description: 'Календарь событий', icon: 'mdi:calendar' },
      { type: 'conditional', name: 'Conditional', description: 'Условное отображение', icon: 'mdi:help-circle-outline' },
      { type: 'entities', name: 'Entities', description: 'Список сущностей', icon: 'mdi:view-list' },
      { type: 'entity', name: 'Entity', description: 'Одна сущность', icon: 'mdi:square-rounded' },
      { type: 'entity-filter', name: 'Entity Filter', description: 'Фильтр сущностей', icon: 'mdi:filter' },
      { type: 'gauge', name: 'Gauge', description: 'Датчик со шкалой', icon: 'mdi:gauge' },
      { type: 'glance', name: 'Glance', description: 'Обзор нескольких сущностей', icon: 'mdi:eye' },
      { type: 'grid', name: 'Grid', description: 'Сетка карточек', icon: 'mdi:view-grid' },
      { type: 'history-graph', name: 'History Graph', description: 'График истории', icon: 'mdi:chart-line' },
      { type: 'horizontal-stack', name: 'Horizontal Stack', description: 'Горизонтальная группа', icon: 'mdi:arrow-split-vertical' },
      { type: 'humidifier', name: 'Humidifier', description: 'Управление увлажнителем', icon: 'mdi:air-humidifier' },
      { type: 'iframe', name: 'iFrame', description: 'Встроенный iframe', icon: 'mdi:application' },
      { type: 'light', name: 'Light', description: 'Управление освещением', icon: 'mdi:lightbulb' },
      { type: 'logbook', name: 'Logbook', description: 'Журнал событий', icon: 'mdi:script-text' },
      { type: 'map', name: 'Map', description: 'Карта с трекерами', icon: 'mdi:map' },
      { type: 'markdown', name: 'Markdown', description: 'Текст с форматированием', icon: 'mdi:language-markdown' },
      { type: 'media-control', name: 'Media Control', description: 'Управление медиаплеером', icon: 'mdi:play-pause' },
      { type: 'picture', name: 'Picture', description: 'Изображение', icon: 'mdi:image' },
      { type: 'picture-elements', name: 'Picture Elements', description: 'Изображение с элементами', icon: 'mdi:image-text' },
      { type: 'picture-entity', name: 'Picture Entity', description: 'Изображение сущности', icon: 'mdi:image-outline' },
      { type: 'picture-glance', name: 'Picture Glance', description: 'Обзор с изображением', icon: 'mdi:image-multiple' },
      { type: 'plant-status', name: 'Plant Status', description: 'Статус растения', icon: 'mdi:flower' },
      { type: 'sensor', name: 'Sensor', description: 'Сенсор', icon: 'mdi:eye' },
      { type: 'shopping-list', name: 'Shopping List', description: 'Список покупок', icon: 'mdi:cart' },
      { type: 'statistic', name: 'Statistic', description: 'Статистика', icon: 'mdi:chart-bar' },
      { type: 'statistics-graph', name: 'Statistics Graph', description: 'График статистики', icon: 'mdi:chart-line-variant' },
      { type: 'thermostat', name: 'Thermostat', description: 'Термостат', icon: 'mdi:thermostat' },
      { type: 'tile', name: 'Tile', description: 'Плитка', icon: 'mdi:square-rounded' },
      { type: 'todo-list', name: 'Todo List', description: 'Список дел', icon: 'mdi:format-list-checks' },
      { type: 'vertical-stack', name: 'Vertical Stack', description: 'Вертикальная группа', icon: 'mdi:arrow-split-horizontal' },
      { type: 'weather-forecast', name: 'Weather Forecast', description: 'Прогноз погоды', icon: 'mdi:weather-cloudy' },
      { type: 'energy-date-selection', name: 'Energy Date', description: 'Выбор даты энергии', icon: 'mdi:calendar-range' },
      { type: 'energy-usage-graph', name: 'Energy Usage', description: 'График потребления', icon: 'mdi:lightning-bolt' },
      { type: 'energy-solar-graph', name: 'Energy Solar', description: 'График солнечной энергии', icon: 'mdi:solar-power' },
      { type: 'energy-gas-graph', name: 'Energy Gas', description: 'График потребления газа', icon: 'mdi:fire' },
      { type: 'energy-water-graph', name: 'Energy Water', description: 'График потребления воды', icon: 'mdi:water' },
      { type: 'energy-devices-graph', name: 'Energy Devices', description: 'График устройств', icon: 'mdi:devices' },
      { type: 'energy-sources-table', name: 'Energy Sources', description: 'Таблица источников', icon: 'mdi:table' },
      { type: 'energy-distribution', name: 'Energy Distribution', description: 'Распределение энергии', icon: 'mdi:chart-sankey' },
    ];
    
    // Добавляем встроенные карточки
    builtInCards.forEach(card => {
      cards.push({
        type: card.type,
        name: card.name,
        description: card.description,
        icon: card.icon,
        isCustom: false
      });
    });
    
    // Добавляем кастомные карточки из window.customCards (HACS и другие)
    if (window.customCards && Array.isArray(window.customCards)) {
      window.customCards.forEach(card => {
        // Проверяем что это не дубликат
        if (!cards.find(c => c.type === card.type)) {
          cards.push({
            type: card.type,
            name: card.name || card.type,
            description: card.description || '',
            icon: card.preview || 'mdi:puzzle',
            isCustom: true
          });
        }
      });
    }
    
    // Ищем дополнительные кастомные карточки через customElements
    const customElementNames = [];
    if (typeof customElements !== 'undefined') {
      // Получаем все зарегистрированные custom elements
      // К сожалению нет прямого API для этого, но можно проверить известные паттерны
      const knownCustomPrefixes = [
        'hui-', 'ha-', 'mushroom-', 'mini-', 'apexcharts-', 'bubble-',
        'button-card', 'card-mod', 'decluttering-card', 'auto-entities',
        'layout-card', 'stack-in-card', 'fold-entity-row', 'slider-entity-row',
        'multiple-entity-row', 'simple-thermostat', 'weather-card', 'clock-weather-card',
        'atomic-calendar', 'vacuum-card', 'bar-card', 'uptime-card', 'flex-horseshoe-card',
        'restriction-card', 'state-switch', 'swipe-card', 'tabbed-card', 'vertical-stack-in-card',
        'xiaomi-vacuum-map-card', 'lovelace-', 'sankey-chart', 'plotly-graph',
        'power-flow-card', 'sunsynk-power-flow-card', 'lg-webos-remote-control',
        'roku-card', 'frigate-card', 'webrtc-camera'
      ];
      
      // Добавляем найденные кастомные карточки если они есть
      knownCustomPrefixes.forEach(prefix => {
        try {
          if (customElements.get(prefix) && !cards.find(c => c.type === `custom:${prefix}`)) {
            cards.push({
              type: `custom:${prefix}`,
              name: prefix.replace(/-/g, ' ').replace(/card$/i, '').trim(),
              description: 'Custom card',
              icon: 'mdi:puzzle',
              isCustom: true
            });
          }
        } catch (e) {
          // игнорируем
        }
      });
    }
    
    // Сортируем: сначала встроенные, потом кастомные
    cards.sort((a, b) => {
      if (a.isCustom === b.isCustom) {
        return a.name.localeCompare(b.name);
      }
      return a.isCustom ? 1 : -1;
    });
    
    return cards;
  }
  
  /**
   * Render fallback card type selector with ALL available cards
   * 
   * @private
   * @param {string} section - Section name
   * @returns {string} HTML string
   */
  _renderCardTypeSelector(section, reason = '') {
    const allCards = this._getAllAvailableCards();
    const builtInCards = allCards.filter(c => !c.isCustom);
    const customCards = allCards.filter(c => c.isCustom);
    const canUseHaPicker = Boolean(this._hass && customElements.get('hui-card-picker'));
    
    return `
      <div class="card-picker-container">
        <div class="picker-tools">
          ${canUseHaPicker ? `
            <button class="btn btn-small" type="button" id="use-ha-picker">
              <ha-icon icon="mdi:home-assistant"></ha-icon>
              Стандартный picker
            </button>
          ` : ''}
          ${reason ? `<div class="picker-fallback-note">${this._escapeHtml(reason)}</div>` : ''}
        </div>

        <div class="card-picker-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input type="text" id="card-search" placeholder="Поиск карточек..." autocomplete="off">
        </div>
        
        <div class="card-picker-sections">
          <div class="card-section">
            <h4 class="card-section-title">
              <ha-icon icon="mdi:home-assistant"></ha-icon>
              Стандартные карточки (${builtInCards.length})
            </h4>
            <div class="card-type-grid" data-section="builtin">
              ${builtInCards.map(card => this._renderCardTypeButton(card, section)).join('')}
            </div>
          </div>
          
          ${customCards.length > 0 ? `
            <div class="card-section">
              <h4 class="card-section-title">
                <ha-icon icon="mdi:puzzle"></ha-icon>
                Кастомные карточки (${customCards.length})
              </h4>
              <div class="card-type-grid" data-section="custom">
                ${customCards.map(card => this._renderCardTypeButton(card, section)).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="custom-type-input">
          <h4>
            <ha-icon icon="mdi:code-tags"></ha-icon>
            Указать тип вручную
          </h4>
          <div class="custom-type-row">
            <input type="text" id="custom-card-type" placeholder="custom:my-card или entities">
            <button class="btn btn-add" type="button" id="add-custom-card">Добавить</button>
          </div>
        </div>
      </div>
    `;
  }
  
  /**
   * Render single card type button
   * 
   * @private
   * @param {Object} card - Card info
   * @param {string} section - Section name
   * @returns {string} HTML string
   */
  _renderCardTypeButton(card, section) {
    const icon = typeof card.icon === 'string' && card.icon.startsWith('mdi:') 
      ? card.icon 
      : 'mdi:card-outline';
    
    return `
      <button class="card-type-btn ${card.isCustom ? 'custom' : ''}" 
              type="button"
              data-type="${this._escapeHtml(card.type)}" 
              data-section="${section}"
              title="${this._escapeHtml(card.description || card.name || card.type)}">
        <ha-icon icon="${icon}"></ha-icon>
        <span class="card-name">${this._escapeHtml(card.name)}</span>
        ${card.isCustom ? '<span class="custom-badge">CUSTOM</span>' : ''}
      </button>
    `;
  }
  
  /**
   * Bind events for card type selector
   * 
   * @private
   * @param {HTMLElement} container - Container element
   * @param {string} section - Section name
   */
  _bindCardTypeSelector(container: HTMLElement, section: CardSectionKey) {
    const useHaPickerBtn = queryOne<HTMLButtonElement>(container, '#use-ha-picker');
    if (useHaPickerBtn) {
      useHaPickerBtn.addEventListener('click', async () => {
        const rendered = await this._tryShowHaCardPicker(container, section);
        if (!rendered) {
          this._showFallbackCardPicker(
            container,
            section,
            'Не удалось открыть стандартный picker, используется встроенный список.'
          );
        }
      });
    }
    
    // Поиск карточек
    const searchInput = queryOne<HTMLInputElement>(container, '#card-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const target = isEditorFieldElement(e.target) ? e.target : null;
        if (!target) return;
        const query = target.value.toLowerCase().trim();
        queryAll<HTMLElement>(container, '.card-type-btn').forEach((btn) => {
          const name = queryOne<HTMLElement>(btn, '.card-name')?.textContent?.toLowerCase() || '';
          const type = btn.dataset.type?.toLowerCase() || '';
          const matches = name.includes(query) || type.includes(query);
          btn.style.display = matches ? '' : 'none';
        });
      });
    }
    
    // Клик по карточке (делегирование, чтобы не терять обработчики после фильтрации/перерендера)
    container.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      
      const cardBtn = target.closest('.card-type-btn');
      if (!cardBtn || !container.contains(cardBtn)) return;
      if (!(cardBtn instanceof HTMLElement)) return;
      
      const type = cardBtn.dataset.type;
      const config = this._getDefaultCardConfig(type);
      this._addCardConfig(section, config);
      this._closeSubEditor();
    });
    
    // Добавление кастомной карточки вручную
    const addCustomBtn = queryOne<HTMLButtonElement>(container, '#add-custom-card');
    if (addCustomBtn) {
      addCustomBtn.addEventListener('click', () => {
        const input = queryOne<HTMLInputElement>(container, '#custom-card-type');
        const type = input?.value?.trim();
        if (type) {
          this._addCardConfig(section, { type: this._normalizeCardType(type) });
          this._closeSubEditor();
        }
      });
      
      // Enter для добавления
      const customInput = queryOne<HTMLInputElement>(container, '#custom-card-type');
      if (customInput) {
        customInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addCustomBtn.click();
          }
        });
      }
    }
  }
  
  /**
   * Get default card config for a type
   * 
   * @private
   * @param {string} type - Card type
   * @returns {Object} Default config
   */
  _getDefaultCardConfig(type?: string): CardConfigLike & { type?: string } {
    const normalizedType = this._normalizeCardType(type);
    const defaults = {
      'markdown': { type: 'markdown', content: 'Новая карточка' },
      'entities': { type: 'entities', entities: [] },
      'button': { type: 'button', tap_action: { action: 'toggle' } },
      'gauge': { type: 'gauge', entity: '' },
      'glance': { type: 'glance', entities: [] },
      'history-graph': { type: 'history-graph', entities: [] },
      'light': { type: 'light', entity: '' },
      'media-control': { type: 'media-control', entity: '' },
      'picture': { type: 'picture', image: '' },
      'sensor': { type: 'sensor', entity: '' },
      'thermostat': { type: 'thermostat', entity: '' },
      'weather-forecast': { type: 'weather-forecast', entity: '' }
    };
    
    const defaultConfig = defaults[normalizedType];
    return defaultConfig ? deepClone(defaultConfig) : { type: normalizedType };
  }
  
  /**
   * Normalize selected card type
   * 
   * @private
   * @param {string} type - Raw card type
   * @returns {string} Normalized card type
   */
  _normalizeCardType(type) {
    const rawType = typeof type === 'string' ? type.trim() : '';
    if (!rawType) return '';
    
    if (rawType.startsWith('custom:')) {
      return rawType;
    }
    
    if (this._isBuiltInCardType(rawType)) {
      return rawType;
    }
    
    const customCards = Array.isArray(window.customCards) ? window.customCards : [];
    const isKnownCustom = customCards.some((card) => {
      const customType = typeof card?.type === 'string' ? card.type.trim() : '';
      if (!customType) return false;
      return customType === rawType || customType === `custom:${rawType}`;
    });
    
    return isKnownCustom ? `custom:${rawType}` : rawType;
  }
  
  /**
   * Check if type is a built-in card
   * 
   * @private
   * @param {string} type - Card type
   * @returns {boolean} True when type is built-in
   */
  _isBuiltInCardType(type) {
    const allCards = this._getAllAvailableCards();
    return allCards.some(card => !card.isCustom && card.type === type);
  }
  
  /**
   * Show card editor for existing card
   * 
   * @private
   * @param {HTMLElement} container - Container element
   * @param {Object} cardConfig - Card configuration
   * @param {string} section - Section name
   * @param {number} index - Card index
   */
  async _showCardEditor(
    container: HTMLElement,
    cardConfig: CardConfigLike & { type?: string },
    section: CardSectionKey,
    index: number
  ) {
    const cardType = cardConfig.type || '';
    const yamlContent = this._configToYaml(cardConfig);
    const isInline = this._inlineEditSection !== null;
    
    // Компактный inline редактор с ha-code-editor
    container.innerHTML = `
      <div class="card-editor-toolbar">
        <span class="editor-title">
          <ha-icon icon="mdi:code-braces"></ha-icon>
          ${this._escapeHtml(cardType)}
        </span>
        <div class="editor-actions">
          <button class="editor-btn cancel" data-action="cancel-inline" title="Отмена">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <button class="editor-btn save" data-action="save-inline" title="Сохранить">
            <ha-icon icon="mdi:check"></ha-icon>
          </button>
        </div>
      </div>
      <div class="code-editor-wrapper" id="code-editor-slot"></div>
    `;
    
    // Создаём ha-code-editor
    const editorSlot = queryOne<HTMLElement>(container, '#code-editor-slot');
    let codeEditor: HaCodeEditorElement | null = null;
    if (!editorSlot) {
      return;
    }
    
    // Пробуем использовать ha-code-editor (встроенный в HA)
    if (customElements.get('ha-code-editor')) {
      codeEditor = document.createElement('ha-code-editor') as HaCodeEditorElement;
      codeEditor.mode = 'yaml';
      codeEditor.autofocus = true;
      codeEditor.autocompleteEntities = true;
      codeEditor.autocompleteIcons = true;
      codeEditor.value = yamlContent;
      
      if (this._hass) {
        codeEditor.hass = this._hass;
      }
      
      editorSlot.appendChild(codeEditor);
    } else {
      // Fallback к textarea
      editorSlot.innerHTML = `<textarea class="yaml-fallback-editor">${this._escapeHtml(yamlContent)}</textarea>`;
    }
    
    // Сохранение
    const saveBtn = queryOne<HTMLButtonElement>(container, '[data-action="save-inline"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        try {
          let value = '';
          if (codeEditor) {
            value = codeEditor.value;
          } else {
            const textarea = queryOne<HTMLTextAreaElement>(container, '.yaml-fallback-editor');
            value = textarea?.value || '';
          }
          
          const newConfig = this._yamlToConfig(value);
          this._updateCardConfig(section, index, newConfig);
          
          // Закрываем inline или sub редактор
          if (isInline) {
            this._closeInlineEditor();
          } else {
            this._closeSubEditor();
          }
        } catch (e) {
          alert(`Ошибка парсинга YAML: ${getErrorMessage(e, 'Invalid YAML')}`);
        }
      });
    }
    
    // Отмена
    const cancelBtn = queryOne<HTMLButtonElement>(container, '[data-action="cancel-inline"]');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (isInline) {
          this._closeInlineEditor();
        } else {
          this._closeSubEditor();
        }
      });
    }
  }
  
  /**
   * Render tabs editor (for tabs mode)
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderTabsEditor() {
    return `
      <div class="subsection">
        <h4>Вкладки</h4>
        <div class="tabs-list">
          ${(this._config.tabs || []).map((tab, index) => `
            <div class="tab-item">
              <input type="text" value="${this._escapeHtml(tab.label || '')}" placeholder="Название вкладки" 
                     data-tab-index="${index}" data-field="label">
              <button class="btn-icon" data-action="delete-tab" data-index="${index}">
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-add" data-action="add-tab">
          <ha-icon icon="mdi:plus"></ha-icon>
          Добавить вкладку
        </button>
      </div>
    `;
  }
  
  /**
   * Render carousel editor (for carousel mode)
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderCarouselEditor() {
    return `
      <div class="subsection">
        <h4>Карусель</h4>

        ${this._renderSchemaFields(EDITOR_FIELD_GROUPS.carousel)}
      </div>
    `;
  }
  
  // ===========================================================================
  // HELPERS
  // ===========================================================================
  
  /**
   * Escape HTML special characters
   * 
   * @private
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  _escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  /**
   * Get human-readable mode label
   * 
   * @private
   * @param {string} mode - Body mode
   * @returns {string} Label
   */
  _getModeLabel(mode) {
    const labels = {
      [BODY_MODES.EXPAND]: 'Раскрытие (expand)',
      [BODY_MODES.MODAL]: 'Модальное окно (modal)',
      [BODY_MODES.FULLSCREEN]: 'Полноэкранный (fullscreen)',
      [BODY_MODES.TABS]: 'Вкладки (tabs)',
      [BODY_MODES.CAROUSEL]: 'Карусель (carousel)',
      [BODY_MODES.SUBVIEW]: 'Subview',
      [BODY_MODES.NONE]: 'Только заголовок (none)'
    };
    return labels[mode] || mode;
  }
  
  /**
   * Get human-readable theme label
   * 
   * @private
   * @param {string} theme - Theme name
   * @returns {string} Label
   */
  _getThemeLabel(theme) {
    const labels = {
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
    };
    return labels[theme] || theme;
  }
  
  /**
   * Get theme preview inline styles
   * 
   * @private
   * @returns {string} CSS string
   */
  _getThemePreviewStyle() {
    const theme = this._config.theme || THEMES.DEFAULT;
    const baseStyle = getThemePreviewStyle(theme);
    const tokenStyles = this._getThemeTokenStyleOverrides();
    return `${baseStyle} ${tokenStyles}`.trim();
  }

  /**
   * Build CSS declarations for theme token overrides
   * @private
   * @returns {string}
   */
  _getThemeTokenStyleOverrides() {
    const tokenNameRegex = /^--[a-z0-9_-]+$/i;
    return Object.entries(this._config.theme_tokens || {})
      .filter(([name, value]) => tokenNameRegex.test(name) && typeof value === 'string' && value.trim())
      .map(([name, value]) => `${name}: ${(value as string).trim()};`)
      .join(' ');
  }

  /**
   * Render live preview and lint panel
   * @private
   * @returns {string}
   */
  _renderLiveInspector() {
    return `
      <div class="live-inspector">
        ${this._renderLiveInspectorContent()}
      </div>
    `;
  }

  /**
   * Render live inspector inner content
   * @private
   * @returns {string}
   */
  _renderLiveInspectorContent() {
    const lint = this._collectLintMessages();
    const bodyMode = this._config.body_mode || BODY_MODES.EXPAND;
    const headerCards = this._config.header?.cards?.length || 0;
    const bodyCards = this._config.body?.cards?.length || 0;
    const footerCards = this._config.footer?.cards?.length || 0;
    const theme = this._config.theme || THEMES.DEFAULT;

    const lintClass = lint.errors.length > 0
      ? 'has-errors'
      : lint.warnings.length > 0
        ? 'has-warnings'
        : 'is-clean';

    return `
      <div class="live-inspector-title-row">
        <h4>Live Preview & Lint</h4>
      </div>

      <div class="live-preview-card" style="${this._escapeHtml(this._getThemePreviewStyle())}">
        <div class="live-preview-header-row">
          <span class="live-title">${this._escapeHtml(this._config.title || 'Universal Card')}</span>
          <span class="live-mode">${this._escapeHtml(this._getModeLabel(bodyMode))}</span>
        </div>
        <div class="live-preview-meta">
          <span>Theme: <strong>${this._escapeHtml(this._getThemeLabel(theme))}</strong></span>
          <span>Header cards: <strong>${headerCards}</strong></span>
          <span>Body cards: <strong>${bodyCards}</strong></span>
          <span>Footer cards: <strong>${footerCards}</strong></span>
        </div>
      </div>

      <div class="lint-panel ${lintClass}">
        <div class="lint-header">
          <span>Lint</span>
          <span class="lint-summary">
            ${lint.errors.length} errors · ${lint.warnings.length} warnings
          </span>
        </div>
        <div class="lint-list">
          ${this._renderLintItems(lint)}
        </div>
      </div>
    `;
  }

  /**
   * Render lint messages
   * @private
   * @param {{errors: Array<Object>, warnings: Array<Object>, info: Array<Object>}} lint
   * @returns {string}
   */
  _renderLintItems(lint) {
    const messages = [
      ...lint.errors.map(msg => ({ ...msg, level: 'error' })),
      ...lint.warnings.map(msg => ({ ...msg, level: 'warning' })),
      ...lint.info.map(msg => ({ ...msg, level: 'info' }))
    ];

    if (messages.length === 0) {
      return '<div class="lint-item level-info">Проблем не найдено</div>';
    }

    return messages.map((item) => `
      <div class="lint-item level-${item.level}">
        <span class="lint-level">${item.level.toUpperCase()}</span>
        <span class="lint-message">${this._escapeHtml(item.message || '')}</span>
      </div>
    `).join('');
  }

  /**
   * Collect lint diagnostics for current config
   * @private
   * @returns {{errors: Array<Object>, warnings: Array<Object>, info: Array<Object>}}
   */
  _collectLintMessages() {
    const result = {
      errors: [],
      warnings: [],
      info: []
    };

    try {
      ConfigManager.validate(this._config);
    } catch (error) {
      result.errors.push({
        message: getErrorMessage(error, 'Configuration validation failed')
      });
    }

    const bodyMode = this._config.body_mode || BODY_MODES.EXPAND;
    const bodyCards = this._config.body?.cards || [];
    const tabs = this._config.tabs || [];
    const tokenNameRegex = /^--[a-z0-9_-]+$/i;

    if (bodyMode !== BODY_MODES.NONE && bodyCards.length === 0 && bodyMode !== BODY_MODES.TABS) {
      result.warnings.push({
        message: 'Body mode включен, но в body.cards нет карточек'
      });
    }

    if (bodyMode === BODY_MODES.TABS && tabs.length === 0) {
      result.warnings.push({
        message: 'Режим tabs выбран, но tabs[] пустой'
      });
    }

    if (bodyMode === BODY_MODES.CAROUSEL && bodyCards.length < 2) {
      result.info.push({
        message: 'Для карусели обычно нужно 2+ карточки'
      });
    }

    Object.entries(this._config.theme_tokens || {}).forEach(([name, value]) => {
      if (!tokenNameRegex.test(name)) {
        result.warnings.push({
          message: `Некорректное имя theme token: ${name}`
        });
      }
      if (typeof value !== 'string' || value.trim() === '') {
        result.warnings.push({
          message: `Пустое значение для theme token: ${name}`
        });
      }
    });

    return result;
  }

  /**
   * Update live inspector without full editor rerender
   * @private
   */
  _updateLiveInspector() {
    const inspector = this.shadowRoot.querySelector('.live-inspector');
    if (!inspector) return;
    inspector.innerHTML = this._renderLiveInspectorContent();
  }
  
  /**
   * Get YAML preview of current config
   * 
   * @private
   * @returns {string} HTML string with syntax highlighting
   */
  _getYamlPreview() {
    const yaml = this._configToYaml(this._config);
    return this._highlightYaml(yaml);
  }
  
  /**
   * Convert config to YAML string
   * 
   * @private
   * @param {Object} config - Configuration object
   * @param {number} indent - Indentation level
   * @returns {string} YAML string
   */
  _configToYaml(config, indent = 0) {
    const spaces = '  '.repeat(indent);
    let yaml = '';
    
    for (const [key, value] of Object.entries(config)) {
      if (value === undefined || value === null) continue;
      
      if (Array.isArray(value)) {
        if (value.length === 0) {
          yaml += `${spaces}${key}: []\n`;
        } else {
          yaml += `${spaces}${key}:\n`;
          value.forEach(item => {
            if (typeof item === 'object') {
              yaml += `${spaces}  -\n`;
              yaml += this._configToYaml(item, indent + 2);
            } else {
              yaml += `${spaces}  - ${item}\n`;
            }
          });
        }
      } else if (typeof value === 'object') {
        yaml += `${spaces}${key}:\n`;
        yaml += this._configToYaml(value, indent + 1);
      } else if (typeof value === 'string' && (value.includes(':') || value.includes('#') || value.includes('\n'))) {
        yaml += `${spaces}${key}: "${value}"\n`;
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
    
    return yaml;
  }
  
  /**
   * Simple YAML to config parser
   * 
   * @private
   * @param {string} yaml - YAML string
   * @returns {Object} Configuration object
   */
  _yamlToConfig(yaml) {
    // Простой парсер YAML (для базовых случаев)
    // В реальности лучше использовать js-yaml библиотеку
    const lines = yaml.split('\n');
    const result = {};
    let currentObj = result;
    const stack = [{ obj: result, indent: -1 }];
    
    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      
      const indent = line.search(/\S/);
      const content = line.trim();
      
      // Находим правильный уровень вложенности
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      currentObj = stack[stack.length - 1].obj;
      
      if (content.startsWith('- ')) {
        // Array item
        const value = content.substring(2).trim();
        if (Array.isArray(currentObj)) {
          if (value) {
            currentObj.push(this._parseYamlValue(value));
          } else {
            const newObj = {};
            currentObj.push(newObj);
            stack.push({ obj: newObj, indent });
          }
        }
      } else if (content.includes(':')) {
        const colonIndex = content.indexOf(':');
        const key = content.substring(0, colonIndex).trim();
        const value = content.substring(colonIndex + 1).trim();
        
        if (value === '' || value === '[]') {
          if (value === '[]') {
            currentObj[key] = [];
          } else {
            currentObj[key] = {};
            stack.push({ obj: currentObj[key], indent });
          }
        } else if (value.startsWith('[') || value.startsWith('{')) {
          try {
            currentObj[key] = JSON.parse(value);
          } catch {
            currentObj[key] = value;
          }
        } else {
          currentObj[key] = this._parseYamlValue(value);
        }
      }
    }
    
    return result;
  }
  
  /**
   * Parse YAML value
   * 
   * @private
   * @param {string} value - Value string
   * @returns {*} Parsed value
   */
  _parseYamlValue(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (/^-?\d+$/.test(value)) return parseInt(value, 10);
    if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1);
    }
    return value;
  }
  
  /**
   * Highlight YAML syntax
   * 
   * @private
   * @param {string} yaml - YAML string
   * @returns {string} HTML with syntax highlighting
   */
  _highlightYaml(yaml) {
    return yaml
      .replace(/^(\s*)([a-z_]+)(:)/gmi, '$1<span class="yaml-key">$2</span>$3')
      .replace(/: (.+)$/gm, ': <span class="yaml-value">$1</span>')
      .replace(/^(\s*-\s)(.+)$/gm, '$1<span class="yaml-value">$2</span>')
      .replace(/\n/g, '<br>');
  }
  
  // ===========================================================================
  // CARD MANAGEMENT
  // ===========================================================================
  
  /**
   * Add a new card configuration
   * 
   * @private
   * @param {string} section - Section name (header/body)
   * @param {Object} cardConfig - Card configuration
   */
  _addCardConfig(section: CardSectionKey, cardConfig: CardConfigLike) {
    const nextCards = [...this._getCardsForSection(section), cardConfig];
    this._setCardsForSection(section, nextCards);
    this._pushHistory(this._config);
    this._fireConfigChangedAndRender();
  }
  
  /**
   * Update card configuration
   * 
   * @private
   * @param {string} section - Section name
   * @param {number} index - Card index
   * @param {Object} newConfig - New configuration
   */
  _updateCardConfig(section: CardSectionKey, index: number, newConfig: CardConfigLike) {
    const currentCards = [...this._getCardsForSection(section)];
    if (!currentCards[index]) return;
    currentCards[index] = newConfig;
    this._setCardsForSection(section, currentCards);
    this._pushHistory(this._config);
    this._fireConfigChangedAndRender();
  }
  
  /**
   * Delete card from section
   * 
   * @private
   * @param {string} section - Section name
   * @param {number} index - Card index
   */
  _deleteCard(section: CardSectionKey, index: number) {
    const currentCards = this._getCardsForSection(section);
    if (!currentCards[index]) return;
    const nextCards = currentCards.filter((_, currentIndex) => currentIndex !== index);
    this._setCardsForSection(section, nextCards);
    this._pushHistory(this._config);
    this._fireConfigChangedAndRender();
  }

  /**
   * Move a card within a section
   *
   * @private
   * @param {string} section - Section name
   * @param {number} fromIndex - Source index
   * @param {number} toIndex - Target index
   */
  _moveCard(section: CardSectionKey, fromIndex: number, toIndex: number) {
    const cards = this._getCardsForSection(section);
    if (!Array.isArray(cards)) return;
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= cards.length) return;
    if (toIndex < 0 || toIndex >= cards.length) return;

    const nextCards = [...cards];
    const [moved] = nextCards.splice(fromIndex, 1);
    nextCards.splice(toIndex, 0, moved);

    this._config = {
      ...this._config,
      ...(section === 'header'
        ? {
            header: {
              ...(this._config.header || {}),
              cards: nextCards
            }
          }
        : {
            body: {
              ...(this._config.body || {}),
              cards: nextCards
            }
          })
    };

    this._dragState = null;
    this._pushHistory(this._config);
    this._fireConfigChangedAndRender();
  }
  
  /**
   * Open card editor
   * 
   * @private
   * @param {string} section - Section name
   * @param {number} index - Card index (-1 for new card)
   */
  _openCardEditor(section: CardSectionKey, index: number) {
    this._editingCardSection = section;
    this._editingCardIndex = index;
    this._showSubEditor = true;
    this._render();
  }
  
  /**
   * Close sub-editor
   * 
   * @private
   */
  _closeSubEditor() {
    this._showSubEditor = false;
    this._editingCardIndex = null;
    this._editingCardSection = null;
    this._subEditor = null;
    this._inlineEditSection = null;
    this._inlineEditIndex = null;
    this._render();
  }
  
  /**
   * Open inline editor for a card
   * 
   * @private
   * @param {string} section - Section name (header/body)
   * @param {number} index - Card index
   */
  _openInlineEditor(section: CardSectionKey, index: number) {
    // Закрыть предыдущий если открыт
    if (this._inlineEditSection !== null) {
      this._closeInlineEditor();
    }
    
    this._inlineEditSection = section;
    this._inlineEditIndex = index;
    this._render();
    
    // Инициализация редактора после рендера
    requestAnimationFrame(() => {
      this._initInlineEditor(section, index);
    });
  }
  
  /**
   * Close inline editor
   * @private
   */
  _closeInlineEditor() {
    this._inlineEditSection = null;
    this._inlineEditIndex = null;
    this._render();
  }
  
  /**
   * Initialize inline editor content
   * @private
   */
  async _initInlineEditor(section: CardSectionKey, index: number) {
    const container = this.shadowRoot.getElementById(`inline-editor-${section}-${index}`);
    if (!container) return;
    
    const cards = this._getCardsForSection(section);
    
    const cardConfig = cards[index];
    if (!cardConfig) return;
    
    await this._showCardEditor(container, cardConfig, section, index);
  }
  
  /**
   * Add a new card (opens card picker)
   * 
   * @private
   * @param {string} section - Section name (header/body)
   */
  _addCard(section: CardSectionKey) {
    this._openCardEditor(section, -1);
  }
  
  // ===========================================================================
  // EVENTS
  // ===========================================================================
  
  /**
   * Bind event handlers
   * 
   * @private
   */
  _bindEvents() {
    // Tab navigation
    queryAll<HTMLElement>(this.shadowRoot, '.tab-item').forEach((item) => {
      item.addEventListener('click', () => {
        if (this._showSubEditor) {
          this._closeSubEditor();
        }
        const section = item.dataset.section as EditorSection | undefined;
        if (!section) return;
        this._activeSection = section;
        this._render();
      });
    });
    
    // Toolbar actions
    queryAll<HTMLButtonElement>(this.shadowRoot, '.toolbar-btn').forEach((btn) => {
      btn.addEventListener('click', () => this._handleToolbarAction(btn.dataset.action));
    });
    
    // Form inputs - используем input для мгновенного обновления текстовых полей
    queryAll<HTMLInputElement>(this.shadowRoot, 'input[type="text"], input[type="number"]').forEach((input) => {
      input.addEventListener('input', (e) => this._handleInputChange(e));
    });
    
    // Checkboxes и selects - используем change
    queryAll<HTMLInputElement | HTMLSelectElement>(this.shadowRoot, 'input[type="checkbox"], select').forEach((input) => {
      input.addEventListener('change', (e) => this._handleInputChange(e));
    });

    queryAll<HaIconPickerElement>(this.shadowRoot, 'ha-icon-picker[data-name]').forEach((picker) => {
      picker.hass = this._hass;
      picker.value = picker.dataset.value || '';
      picker.addEventListener('value-changed', (e) => this._handleIconPickerChange(e as IconPickerChangedEvent));
    });

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="clear-icon"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const path = btn.dataset.path;
        if (!path) return;

        this._config = this._setNestedValue(this._config, path.split('.'), undefined);
        this._fireConfigChangedAndRender();
      });
    });
    
    // Add card buttons
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="add-header-card"]').forEach((btn) => {
      btn.addEventListener('click', () => this._addCard('header'));
    });
    
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="add-body-card"]').forEach((btn) => {
      btn.addEventListener('click', () => this._addCard('body'));
    });
    
    // Edit/Delete card buttons (old style)
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="edit-card"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const index = parseInt(btn.dataset.index, 10);
        if (section !== 'header' && section !== 'body') return;
        if (!section || Number.isNaN(index)) return;
        this._openCardEditor(section, index);
      });
    });
    
    // Inline edit card
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="edit-card-inline"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const section = btn.dataset.section;
        const index = parseInt(btn.dataset.index, 10);
        if (section !== 'header' && section !== 'body') return;
        if (!section || Number.isNaN(index)) return;
        this._openInlineEditor(section, index);
      });
    });
    
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="delete-card"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const index = parseInt(btn.dataset.index, 10);
        if ((section === 'header' || section === 'body') && !Number.isNaN(index) && confirm('Удалить карточку?')) {
          this._deleteCard(section, index);
        }
      });
    });

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="move-card"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const section = btn.dataset.section;
        const index = parseInt(btn.dataset.index, 10);
        const direction = btn.dataset.direction;
        if (section !== 'header' && section !== 'body') return;
        if (!section || Number.isNaN(index)) return;
        const nextIndex = direction === 'up' ? index - 1 : index + 1;
        this._moveCard(section, index, nextIndex);
      });
    });
    
    // Close sub-editor button
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="close-sub-editor"]').forEach((btn) => {
      btn.addEventListener('click', () => this._closeSubEditor());
    });
    
    // Tab editor inputs (immutable)
    queryAll<EditorFieldElement>(this.shadowRoot, '[data-tab-index]').forEach((input) => {
      input.addEventListener('input', (e) => {
        const target = isEditorFieldElement(e.target) ? e.target : null;
        const index = parseInt(target?.dataset.tabIndex || '', 10);
        const field = target?.dataset.field;
        if (!target || !field || Number.isNaN(index) || !isEditorTabFieldKey(field)) return;
        const currentTabs = this._config.tabs ? [...this._config.tabs] : [];
        if (!currentTabs[index]) currentTabs[index] = {};
        const nextTab: EditorTabConfig = { ...currentTabs[index] };
        setEditorTabField(nextTab, field, target.value);
        currentTabs[index] = nextTab;
        this._config = { ...this._config, tabs: currentTabs };
        this._fireConfigChanged();
      });
    });
    
    // Add tab button (immutable)
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="add-tab"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const currentTabs = this._config.tabs ? [...this._config.tabs] : [];
        currentTabs.push({ label: `Вкладка ${currentTabs.length + 1}` });
        this._config = { ...this._config, tabs: currentTabs };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });
    
    // Delete tab button (immutable)
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="delete-tab"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        if (this._config.tabs) {
          const newTabs = this._config.tabs.filter((_, i) => i !== index);
          this._config = { ...this._config, tabs: newTabs };
          this._pushHistory(this._config);
          this._fireConfigChangedAndRender();
        }
      });
    });
    
    // Feature groups collapsible
    queryAll<HTMLElement>(this.shadowRoot, '.feature-group-header[data-toggle]').forEach((header) => {
      header.addEventListener('click', () => {
        const group = header.closest('.feature-group');
        if (group instanceof HTMLElement) {
          group.classList.toggle('expanded');
        }
      });
    });
    
    // Visibility Conditions
    this._bindVisibilityConditions();

    // Theme token overrides
    this._bindThemeTokens();
    
    // State Styles
    this._bindStateStyles();
    
    // Actions
    this._bindActions();
    
    // Swipe Gestures
    this._bindSwipeGestures();
    
    // Badges
    this._bindBadges();
    
    // Animation Presets
    this._bindAnimationPresets();

    // Drag&drop + keyboard reorder
    this._bindCardReordering();

    // Update live inspector content after binding phase
    this._updateLiveInspector();
  }

  /**
   * Bind drag&drop and keyboard reorder for cards
   * @private
   */
  _bindCardReordering() {
    const items = queryAll<HTMLElement>(this.shadowRoot, '.cards-list .card-item:not(.editing)');

    items.forEach((item) => {
      item.addEventListener('dragstart', (event) => {
        const section = item.dataset.section;
        const index = parseInt(item.dataset.index, 10);
        if (!section || Number.isNaN(index)) return;

        this._dragState = { section, index };
        item.classList.add('dragging');
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', `${section}:${index}`);
        }
      });

      item.addEventListener('dragover', (event) => {
        if (!this._dragState) return;
        if (this._dragState.section !== item.dataset.section) return;
        event.preventDefault();
        item.classList.add('drop-target');
      });

      item.addEventListener('dragleave', () => {
        item.classList.remove('drop-target');
      });

      item.addEventListener('drop', (event) => {
        event.preventDefault();
        const targetSection = item.dataset.section;
        const targetIndex = parseInt(item.dataset.index, 10);
        item.classList.remove('drop-target');

        if (!this._dragState || !targetSection || Number.isNaN(targetIndex)) return;
        if (targetSection !== 'header' && targetSection !== 'body') return;
        if (this._dragState.section !== targetSection) return;

        this._moveCard(targetSection, this._dragState.index, targetIndex);
      });

      item.addEventListener('dragend', () => {
        this._dragState = null;
        queryAll<HTMLElement>(this.shadowRoot, '.card-item.dragging, .card-item.drop-target').forEach((el) => {
          el.classList.remove('dragging', 'drop-target');
        });
      });

      item.addEventListener('keydown', (event) => {
        if (!event.altKey) return;
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

        const section = item.dataset.section;
        const index = parseInt(item.dataset.index, 10);
        if (section !== 'header' && section !== 'body') return;
        if (!section || Number.isNaN(index)) return;

        event.preventDefault();
        const targetIndex = event.key === 'ArrowUp' ? index - 1 : index + 1;
        this._moveCard(section, index, targetIndex);
      });
    });
  }
  
  /**
   * Bind visibility conditions events
   * @private
   */
  _bindVisibilityConditions() {
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="add-visibility-condition"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rawScope = btn.dataset.scope || 'global';
        const parentPath = btn.dataset.parentPath || '';
        const typeSelect = queryOne<HTMLSelectElement>(btn.parentElement || this.shadowRoot, '.condition-type-select');
        const type = typeSelect?.value;
        if (!type || !isEditorVisibilityScope(rawScope) || !isEditorVisibilityConditionType(type)) return;

        this._addVisibilityCondition(rawScope, parentPath, type);
      });
    });

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="delete-condition"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rawScope = btn.dataset.scope || 'global';
        const path = btn.dataset.path || '';
        if (!path || !isEditorVisibilityScope(rawScope)) return;

        const current = this._getVisibilityConditionsByScope(rawScope);
        const next = this._removeVisibilityPathValue(current, this._parseVisibilityPath(path));
        this._setVisibilityConditionsByScope(rawScope, next, true);
      });
    });

    queryAll<HTMLElement>(this.shadowRoot, '.condition-item').forEach((item) => {
      const rawScope = item.dataset.scope || 'global';
      const path = item.dataset.path || '';
      if (!path || !isEditorVisibilityScope(rawScope)) return;

      queryAll<EditorFieldElement>(item, '.cond-field').forEach((field) => {
        field.addEventListener('change', () => {
          this._updateConditionField(rawScope, path, item);
        });
        if (field.tagName === 'INPUT') {
          field.addEventListener('input', () => {
            this._updateConditionField(rawScope, path, item);
          });
        }
      });
    });
  }
  
  /**
   * Update condition field (immutable)
   * @private
   */
  _updateConditionField(scope: EditorVisibilityScope, path: string, item: HTMLElement) {
    const currentConditions = this._getVisibilityConditionsByScope(scope);
    const existingCondition = this._getVisibilityConditionByPath(currentConditions, path);
    if (!existingCondition) return;

    const type = item.dataset.type;
    if (!type || !isEditorVisibilityConditionType(type)) {
      return;
    }
    const newCondition: EditorVisibilityCondition = {
      ...existingCondition,
      condition: type
    };

    getVisibilityConditionFieldDescriptors(type).forEach((field) => {
      const element = queryOne<EditorFieldElement>(item, `[data-field="${field.key}"]`);
      if (!element || !isEditorVisibilityFieldKey(field.key)) {
        return;
      }

      const nextValue = this._parseConditionEditorValue(field, element);
      if (nextValue === undefined) {
        delete newCondition[field.key];
      } else {
        setEditorVisibilityField(newCondition, field.key, nextValue);
      }
    });

    if (!isLogicalConditionType(type)) {
      delete newCondition.conditions;
    } else if (!Array.isArray(newCondition.conditions)) {
      newCondition.conditions = [];
    }

    const nextConditions = this._updateVisibilityPathValue(
      currentConditions,
      this._parseVisibilityPath(path),
      () => newCondition
    );
    this._setVisibilityConditionsByScope(scope, nextConditions, false);
  }

  /**
   * Add a visibility condition to root or nested logical group.
   *
   * @private
   * @param {string} scope
   * @param {string} parentPath
   * @param {string} type
   */
  _addVisibilityCondition(scope: EditorVisibilityScope, parentPath: string, type: VisibilityCondition['condition']) {
    const current = this._getVisibilityConditionsByScope(scope);
    const nextCondition = this._createVisibilityCondition(type);

    if (!parentPath) {
      this._setVisibilityConditionsByScope(scope, [...current, nextCondition], true);
      return;
    }

    const next = this._updateVisibilityPathValue(
      current,
      this._parseVisibilityPath(parentPath),
      (condition) => ({
        ...(isEditorVisibilityConditionNode(condition) ? condition : { condition: type }),
        conditions: [
          ...(isEditorVisibilityConditionNode(condition) && Array.isArray(condition.conditions) ? condition.conditions : []),
          nextCondition
        ]
      })
    );

    this._setVisibilityConditionsByScope(scope, next, true);
  }

  /**
   * Create a new visibility condition object.
   *
   * @private
   * @param {string} type
   * @returns {Object}
   */
  _createVisibilityCondition(type: VisibilityCondition['condition']): EditorVisibilityCondition {
    return isLogicalConditionType(type)
      ? { condition: type, conditions: [] }
      : { condition: type };
  }

  /**
   * Parse visibility path from DOM dataset.
   *
   * @private
   * @param {string} path
   * @returns {Array<string|number>}
   */
  _parseVisibilityPath(path: string): VisibilityPathSegment[] {
    return path
      .split('.')
      .filter(Boolean)
      .map((segment) => (/^\d+$/.test(segment) ? Number(segment) : 'conditions'));
  }

  /**
   * Read condition object by path.
   *
   * @private
   * @param {Array<Object>} conditions
   * @param {string} path
   * @returns {Object|null}
   */
  _getVisibilityConditionByPath(conditions: EditorVisibilityCondition[], path: string) {
    return this._parseVisibilityPath(path).reduce<VisibilityTreeNode>((current, segment) => {
      if (Array.isArray(current) && typeof segment === 'number') {
        return current[segment];
      }
      if (segment === 'conditions' && isEditorVisibilityConditionNode(current)) {
        return current.conditions;
      }
      return undefined;
    }, conditions) || null;
  }

  /**
   * Immutably update a nested condition path.
   *
   * @private
   * @param {*} current
   * @param {Array<string|number>} path
   * @param {(value: any) => any} updater
   * @param {number} [depth=0]
   * @returns {*}
   */
  _updateVisibilityPathValue(
    current: VisibilityTreeNode,
    path: VisibilityPathSegment[],
    updater: (value: EditorVisibilityCondition | undefined) => EditorVisibilityCondition,
    depth = 0
  ): EditorVisibilityCondition[] {
    if (depth === path.length) {
      return [updater(Array.isArray(current) ? undefined : current)];
    }

    const segment = path[depth];
    if (typeof segment === 'number') {
      const next = Array.isArray(current) ? [...current] : [];
      const updated = this._updateVisibilityPathValue(next[segment], path, updater, depth + 1);
      next[segment] = updated[0];
      return next;
    }

    const nextCondition = isEditorVisibilityConditionNode(current)
      ? { ...current }
      : { condition: CONDITION_TYPES.AND, conditions: [] };
    nextCondition.conditions = this._updateVisibilityPathValue(nextCondition.conditions, path, updater, depth + 1);
    return [nextCondition];
  }

  /**
   * Immutably remove a nested condition path.
   *
   * @private
   * @param {*} current
   * @param {Array<string|number>} path
   * @param {number} [depth=0]
   * @returns {*}
   */
  _removeVisibilityPathValue(
    current: VisibilityTreeNode,
    path: VisibilityPathSegment[],
    depth = 0
  ): EditorVisibilityCondition[] {
    const segment = path[depth];

    if (typeof segment === 'number') {
      const next = Array.isArray(current) ? [...current] : [];
      if (depth === path.length - 1) {
        next.splice(segment, 1);
        return next;
      }

      const updated = this._removeVisibilityPathValue(next[segment], path, depth + 1);
      next[segment] = updated[0];
      return next;
    }

    const nextCondition = isEditorVisibilityConditionNode(current)
      ? { ...current }
      : { condition: CONDITION_TYPES.AND, conditions: [] };
    nextCondition.conditions = this._removeVisibilityPathValue(nextCondition.conditions, path, depth + 1);
    return [nextCondition];
  }

  /**
   * Parse editor value for a visibility condition field.
   *
   * @private
   * @param {import('../editor/EditorContract.js').ContractFieldDescriptor} field
   * @param {HTMLInputElement|HTMLSelectElement} element
   * @returns {*}
   */
  _parseConditionEditorValue(
    field: { control: string; key: string },
    element: EditorFieldElement
  ): EditorVisibilityCondition[EditorVisibilityFieldKey] | undefined {
    if (field.control === 'number') {
      return element.value === '' ? undefined : Number(element.value);
    }

    if (field.control === 'multiselect') {
      const values = Array.from((element as HTMLSelectElement).selectedOptions || []).map((option) => option.value);
      if (field.key === 'weekday') {
        return values.length > 0
          ? values as NonNullable<TimeVisibilityCondition['weekday']>
          : undefined;
      }
      return values.length > 0 ? values : undefined;
    }

    if (field.key === 'is_admin' || field.key === 'is_owner') {
      if (element.value === '') {
        return undefined;
      }
      return element.value === 'true';
    }

    const rawValue = element.value.trim();
    if (!rawValue) {
      return undefined;
    }

    if (field.key === 'state' || field.key === 'state_not') {
      const values = rawValue.split(',').map((entry) => entry.trim()).filter(Boolean);
      if (values.length === 0) return undefined;
      return values.length === 1 ? values[0] : values;
    }

    if (field.key === 'users') {
      const values = rawValue.split(',').map((entry) => entry.trim()).filter(Boolean);
      return values.length > 0 ? values : undefined;
    }

    return rawValue;
  }

  /**
   * Get visibility conditions by scope
   * @private
   * @param {string} scope - global | section:header | section:body | section:footer
   * @returns {Array<Object>}
   */
  _getVisibilityConditionsByScope(scope: EditorVisibilityScope): EditorVisibilityCondition[] {
    if (scope === 'global') {
      return this._config.visibility ? [...this._config.visibility] : [];
    }

    const section = scope.split(':')[1];
    if (!section || !isEditorSectionVisibilityKey(section)) {
      return [];
    }

    return this._config.section_visibility?.[section]
      ? [...this._config.section_visibility[section]]
      : [];
  }

  /**
   * Set visibility conditions for a scope
   * @private
   * @param {string} scope - Scope identifier
   * @param {Array<Object>} conditions - New conditions array
   * @param {boolean} rerender - Whether to rerender editor
   */
  _setVisibilityConditionsByScope(scope: EditorVisibilityScope, conditions: EditorVisibilityCondition[], rerender: boolean) {
    if (scope === 'global') {
      this._config = {
        ...this._config,
        visibility: conditions
      };
    } else {
      const section = scope.split(':')[1];
      if (!section || !isEditorSectionVisibilityKey(section)) return;
      const sectionVisibility = {
        ...(this._config.section_visibility || {}),
        [section]: conditions
      };

      this._config = {
        ...this._config,
        section_visibility: sectionVisibility
      };
    }

    if (rerender) {
      this._pushHistory(this._config);
      this._fireConfigChangedAndRender();
      return;
    }

    this._fireConfigChanged();
  }

  /**
   * Bind theme token editor events
   * @private
   */
  _bindThemeTokens() {
    const tokenNameRegex = /^--[a-z0-9_-]+$/i;

    const updateTokensFromDom = () => {
      const tokens: Record<`--${string}`, string> = {};
      queryAll<HTMLElement>(this.shadowRoot, '.theme-token-item').forEach((item) => {
        const name = queryOne<HTMLInputElement>(item, '.token-name')?.value?.trim();
        const value = queryOne<HTMLInputElement>(item, '.token-value')?.value?.trim();
        if (!name || !value) return;
        if (!tokenNameRegex.test(name)) return;
        tokens[name as `--${string}`] = value;
      });

      this._config = {
        ...this._config,
        theme_tokens: tokens
      };
      this._fireConfigChanged();
    };

    const addBtn = queryOne<HTMLButtonElement>(this.shadowRoot, '[data-action="add-theme-token"]');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const existing = this._config.theme_tokens || {};
        let index = Object.keys(existing).length + 1;
        let tokenName = `--uc-custom-token-${index}`;
        while (Object.prototype.hasOwnProperty.call(existing, tokenName)) {
          index += 1;
          tokenName = `--uc-custom-token-${index}`;
        }

        this._config = {
          ...this._config,
          theme_tokens: {
            ...existing,
            [tokenName]: 'initial'
          }
        };

        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    }

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="delete-theme-token"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        if (Number.isNaN(index)) return;

        const entries = Object.entries(this._config.theme_tokens || {});
        if (!entries[index]) return;
        entries.splice(index, 1);

        this._config = {
          ...this._config,
          theme_tokens: Object.fromEntries(entries)
        };

        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });

    queryAll<HTMLInputElement>(this.shadowRoot, '.theme-token-item .token-name, .theme-token-item .token-value').forEach((input) => {
      input.addEventListener('input', () => updateTokensFromDom());
      input.addEventListener('change', () => updateTokensFromDom());
    });
  }
  
  /**
   * Bind state styles events (immutable)
   * @private
   */
  _bindStateStyles() {
    // Add state style
    const addBtn = queryOne<HTMLButtonElement>(this.shadowRoot, '[data-action="add-state-style"]');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const currentStyles = this._config.state_styles ? { ...this._config.state_styles } : {};
        let index = Object.keys(currentStyles).length + 1;
        let newState = `state_${index}`;
        while (currentStyles[newState]) {
          index += 1;
          newState = `state_${index}`;
        }
        currentStyles[newState] = {};
        this._config = { ...this._config, state_styles: currentStyles };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    }
    
    // Delete state style
    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="delete-state-style"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const state = btn.dataset.state;
        if (state && this._config.state_styles && this._config.state_styles[state]) {
          const newStyles = { ...this._config.state_styles };
          delete newStyles[state];
          this._config = { ...this._config, state_styles: newStyles };
          this._pushHistory(this._config);
          this._fireConfigChangedAndRender();
        }
      });
    });
    
    // State style field changes
    queryAll<HTMLElement>(this.shadowRoot, '.state-style-item').forEach((item) => {
      const oldState = item.dataset.state;
      
      queryOne<HTMLInputElement>(item, '.state-key')?.addEventListener('change', (e) => {
        const target = isEditorFieldElement(e.target) ? e.target : null;
        const newState = target?.value;
        if (newState && newState !== oldState && this._config.state_styles) {
          const newStyles = { ...this._config.state_styles };
          newStyles[newState] = { ...(oldState ? newStyles[oldState] : {}) };
          if (oldState) {
            delete newStyles[oldState];
          }
          this._config = { ...this._config, state_styles: newStyles };
          this._fireConfigChanged();
        }
      });
      
      queryAll<HTMLInputElement>(item, '.style-field').forEach((field) => {
        field.addEventListener('input', () => {
          const state = queryOne<HTMLInputElement>(item, '.state-key')?.value || oldState;
          const styleKey = field.dataset.style;
          if (
            state &&
            styleKey &&
            this._config.state_styles &&
            this._config.state_styles[state] &&
            isEditorStateStyleKey(styleKey)
          ) {
            const newStyles = { ...this._config.state_styles };
            const nextValue = this._parseStateStyleEditorValue(styleKey, field.value);
            const nextStyle = { ...newStyles[state] };

            if (nextValue === undefined) {
              delete nextStyle[styleKey];
            } else {
              setEditorStateStyleField(nextStyle, styleKey, nextValue);
            }

            newStyles[state] = nextStyle;
            this._config = { ...this._config, state_styles: newStyles };
            this._fireConfigChanged();
          }
        });
      });
    });
    
    // Presets
    queryAll<HTMLButtonElement>(this.shadowRoot, '.btn-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        this._applyStateStylePreset(preset);
      });
    });
  }

  /**
   * Parse a state style editor value.
   *
   * @private
   * @param {string} styleKey
   * @param {string} rawValue
   * @returns {*}
   */
  _parseStateStyleEditorValue(
    styleKey: EditorStateStyleKey,
    rawValue: string
  ): EditorStateStyleRule[EditorStateStyleKey] | undefined {
    const trimmed = rawValue.trim();
    if (!trimmed) {
      return undefined;
    }

    if (styleKey !== 'class') {
      return trimmed;
    }

    const classes = trimmed.split(',').map((entry) => entry.trim()).filter(Boolean);
    if (classes.length === 0) {
      return undefined;
    }

    return classes.length === 1 ? classes[0] : classes;
  }
  
  /**
   * Apply state style preset
   * @private
   */
  _applyStateStylePreset(preset) {
    const presets: Record<string, EditorStateStyleMap> = {
      'on-off': {
        'on': { background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50' },
        'off': { background: 'rgba(158, 158, 158, 0.2)', color: '#9e9e9e' }
      },
      'temperature': {
        '<15': { background: 'rgba(33, 150, 243, 0.2)', color: '#2196f3' },
        '15-25': { background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50' },
        '>25': { background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' }
      },
      'battery': {
        '<20': { background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' },
        '20-50': { background: 'rgba(255, 152, 0, 0.2)', color: '#ff9800' },
        '>50': { background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50' }
      }
    };
    
    const presetStyles = presets[preset];
    if (presetStyles) {
      this._config = { ...this._config, state_styles: deepClone(presetStyles) as EditorStateStyleMap };
      this._pushHistory(this._config);
      this._fireConfigChangedAndRender();
    }
  }
  
  /**
   * Bind actions events (immutable)
   * @private
   */
  _bindActions() {
    // Expand trigger buttons
    queryAll<HTMLButtonElement>(this.shadowRoot, '.expand-trigger-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const trigger = btn.dataset.trigger;
        let newConfig = { ...this._config, expand_trigger: trigger };
        
        // Очищаем action для нового триггера (он будет использоваться для expand)
        const triggerActionKey = getEditorActionKeyForTrigger(trigger);
        if (trigger !== 'none' && triggerActionKey && newConfig[triggerActionKey]) {
          newConfig = { ...newConfig };
          delete newConfig[triggerActionKey];
        }
        
        this._config = newConfig;
        
        // Обновляем UI
        queryAll<HTMLButtonElement>(this.shadowRoot, '.expand-trigger-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });
    
    // Action type selects
    queryAll<HTMLSelectElement>(this.shadowRoot, '.action-type-select').forEach((select) => {
      select.addEventListener('change', (e) => {
        const target = isEditorFieldElement(e.target) ? e.target : null;
        const actionKey = target?.dataset.actionKey;
        const action = target?.value;
        if (!target || !actionKey || !action || !isEditorActionKey(actionKey)) return;
        
        const currentAction = this._config[actionKey] || {};
        const newAction: EditorActionConfig = { ...currentAction };
        newAction.action = action === 'none' ? undefined : action;
        
        // Очищаем лишние поля
        if (action !== 'call-service') delete newAction.service;
        if (action !== 'navigate') delete newAction.navigation_path;
        if (action !== 'url') delete newAction.url_path;
        
        this._config = { ...this._config, [actionKey]: newAction };
        this._fireConfigChangedAndRender();
      });
    });
    
    queryAll<EditorFieldElement>(this.shadowRoot, '.action-extra-field').forEach((input) => {
      input.addEventListener('input', (e) => {
        const target = isEditorFieldElement(e.target) ? e.target : null;
        const actionKey = target?.dataset.actionKey;
        const field = target?.dataset.field;
        if (!target || !actionKey || !field || !isEditorActionKey(actionKey) || !isEditorActionExtraFieldKey(field)) return;
        
        const currentAction = this._config[actionKey] || {};
        const newAction: EditorActionConfig = { ...currentAction };
        newAction[field] = target.value;
        this._config = { ...this._config, [actionKey]: newAction };
        this._fireConfigChanged();
      });
    });
  }
  
  /**
   * Bind swipe gestures events (immutable)
   * @private
   */
  _bindSwipeGestures() {
    // Swipe inputs are schema-backed and handled by the generic input pipeline.
  }
  
  /**
   * Bind badges events (immutable)
   * @private
   */
  _bindBadges() {
    const addBtn = queryOne<HTMLButtonElement>(this.shadowRoot, '[data-action="add-badge"]');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const currentBadges = this._config.badges ? [...this._config.badges] : [];
        currentBadges.push({ type: 'state' });
        this._config = { ...this._config, badges: currentBadges };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    }

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="delete-badge"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        if (this._config.badges) {
          const newBadges = this._config.badges.filter((_, i) => i !== index);
          this._config = { ...this._config, badges: newBadges };
          this._pushHistory(this._config);
          this._fireConfigChangedAndRender();
        }
      });
    });

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="add-badge-threshold"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        if (Number.isNaN(index) || !this._config.badges?.[index]) {
          return;
        }

        const newBadges = [...this._config.badges];
        const badge = { ...newBadges[index] };
        const thresholds = Array.isArray(badge.thresholds) ? [...badge.thresholds] : [];
        thresholds.push({ value: 0, color: '' });
        badge.thresholds = thresholds;
        newBadges[index] = badge;
        this._config = { ...this._config, badges: newBadges };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="delete-badge-threshold"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        const thresholdIndex = parseInt(btn.dataset.thresholdIndex, 10);
        if (Number.isNaN(index) || Number.isNaN(thresholdIndex) || !this._config.badges?.[index]) {
          return;
        }

        const newBadges = [...this._config.badges];
        const badge = { ...newBadges[index] };
        const thresholds = (badge.thresholds || []).filter((_, currentIndex) => currentIndex !== thresholdIndex);
        if (thresholds.length > 0) {
          badge.thresholds = thresholds;
        } else {
          delete badge.thresholds;
        }
        newBadges[index] = badge;
        this._config = { ...this._config, badges: newBadges };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="add-badge-visibility-rule"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        if (Number.isNaN(index) || !this._config.badges?.[index]) {
          return;
        }

        const newBadges = [...this._config.badges];
        const badge = { ...newBadges[index] };
        const rules = Array.isArray(badge.visibility) ? [...badge.visibility] : [];
        rules.push({ operator: BADGE_OPERATORS.EQUALS, value: 'on' });
        badge.visibility = rules;
        newBadges[index] = badge;
        this._config = { ...this._config, badges: newBadges };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="add-badge-color-rule"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        if (Number.isNaN(index) || !this._config.badges?.[index]) {
          return;
        }

        const newBadges = [...this._config.badges];
        const badge = { ...newBadges[index] };
        const rules = Array.isArray(badge.color_rules) ? [...badge.color_rules] : [];
        rules.push({ operator: BADGE_OPERATORS.EQUALS, value: 'on', color: '#fdd835' });
        badge.color_rules = rules;
        newBadges[index] = badge;
        this._config = { ...this._config, badges: newBadges };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });

    queryAll<HTMLButtonElement>(this.shadowRoot, '[data-action="delete-badge-rule"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        const ruleIndex = parseInt(btn.dataset.ruleIndex, 10);
        const ruleKind = btn.dataset.ruleKind;
        if (
          Number.isNaN(index) ||
          Number.isNaN(ruleIndex) ||
          !this._config.badges?.[index] ||
          (ruleKind !== 'visibility' && ruleKind !== 'color_rules')
        ) {
          return;
        }

        const newBadges = [...this._config.badges];
        const badge = { ...newBadges[index] };
        const rules = ruleKind === 'visibility'
          ? (badge.visibility || []).filter((_, currentIndex) => currentIndex !== ruleIndex)
          : (badge.color_rules || []).filter((_, currentIndex) => currentIndex !== ruleIndex);

        if (ruleKind === 'visibility') {
          if (rules.length > 0) {
            badge.visibility = rules;
          } else {
            delete badge.visibility;
          }
        } else if (rules.length > 0) {
          badge.color_rules = rules;
        } else {
          delete badge.color_rules;
        }

        newBadges[index] = badge;
        this._config = { ...this._config, badges: newBadges };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });

    queryAll<HTMLElement>(this.shadowRoot, '.badge-item').forEach((item) => {
      const index = parseInt(item.dataset.index, 10);
      queryAll<EditorFieldElement>(item, '.badge-field').forEach((field) => {

        const updateBadgeField = () => {
          if (Number.isNaN(index) || !this._config.badges?.[index]) {
            return;
          }

          const fieldName = field.dataset.field;
          if (!fieldName) {
            return;
          }
          const thresholdIndex = field.dataset.thresholdIndex !== undefined
            ? parseInt(field.dataset.thresholdIndex, 10)
            : null;
          const ruleIndex = field.dataset.ruleIndex !== undefined
            ? parseInt(field.dataset.ruleIndex, 10)
            : null;
          const ruleKind = field.dataset.ruleKind;

          const newBadges = [...this._config.badges];
          const badge = { ...newBadges[index] };

          if (thresholdIndex !== null && !Number.isNaN(thresholdIndex)) {
            if (!isEditorBadgeThresholdFieldKey(fieldName)) {
              return;
            }

            const thresholds = Array.isArray(badge.thresholds) ? [...badge.thresholds] : [];
            const nextThreshold: EditorBadgeThreshold = { ...(thresholds[thresholdIndex] || {}) };
            const nextValue = this._parseBadgeEditorValue(fieldName, field);

            if (nextValue === undefined) {
              delete nextThreshold[fieldName];
            } else {
              setEditorBadgeThresholdField(nextThreshold, fieldName, nextValue as EditorBadgeThreshold[typeof fieldName]);
            }

            thresholds[thresholdIndex] = nextThreshold;
            badge.thresholds = thresholds;
          } else if (ruleIndex !== null && !Number.isNaN(ruleIndex)) {
            if (ruleKind === 'visibility') {
              if (!isEditorBadgeRuleFieldKey(fieldName)) {
                return;
              }

              const rules = Array.isArray(badge.visibility) ? [...badge.visibility] : [];
              const nextRule: EditorBadgeRule = { ...(rules[ruleIndex] || {}) };
              const nextValue = this._parseBadgeRuleEditorValue(fieldName, field);

              if (nextValue === undefined) {
                delete nextRule[fieldName];
              } else {
                setEditorBadgeRuleField(nextRule, fieldName, nextValue as EditorBadgeRule[typeof fieldName]);
              }

              rules[ruleIndex] = nextRule;
              badge.visibility = rules;
            } else if (ruleKind === 'color_rules') {
              if (!isEditorBadgeColorRuleFieldKey(fieldName)) {
                return;
              }

              const rules = Array.isArray(badge.color_rules) ? [...badge.color_rules] : [];
              const nextRule: EditorBadgeColorRule = { ...(rules[ruleIndex] || {}) };
              const nextValue = this._parseBadgeRuleEditorValue(fieldName, field);

              if (nextValue === undefined) {
                delete nextRule[fieldName];
              } else {
                setEditorBadgeColorRuleField(nextRule, fieldName, nextValue as EditorBadgeColorRule[typeof fieldName]);
              }

              rules[ruleIndex] = nextRule;
              badge.color_rules = rules;
            } else {
              return;
            }
          } else {
            if (!isEditorBadgeFieldKey(fieldName)) {
              return;
            }

            const nextValue = this._parseBadgeEditorValue(fieldName, field);
            if (nextValue === undefined) {
              delete badge[fieldName];
            } else {
              setEditorBadgeField(badge, fieldName, nextValue as EditorBadgeConfig[typeof fieldName]);
            }
          }

          newBadges[index] = badge;
          this._config = { ...this._config, badges: newBadges };

          if (fieldName === 'type') {
            this._pushHistory(this._config);
            this._fireConfigChangedAndRender();
            return;
          }

          this._fireConfigChanged();
        };

        field.addEventListener('change', updateBadgeField);
        if (field.tagName === 'INPUT') {
          field.addEventListener('input', updateBadgeField);
        }
      });
    });
  }

  /**
   * Parse badge editor field value.
   *
   * @private
   * @param {string} fieldName
   * @param {HTMLInputElement|HTMLSelectElement} field
   * @returns {*}
   */
  _parseBadgeEditorValue(
    fieldName: EditorBadgeFieldKey | EditorBadgeThresholdFieldKey,
    field: EditorFieldElement
  ): HeaderBadgeConfig[EditorBadgeFieldKey] | EditorBadgeThreshold[EditorBadgeThresholdFieldKey] | undefined {
    if (field instanceof HTMLInputElement && field.type === 'checkbox') {
      return field.checked;
    }

    if (field instanceof HTMLInputElement && field.type === 'number') {
      return field.value === '' ? undefined : Number(field.value);
    }

    const rawValue = field.value.trim();
    if (!rawValue) {
      return undefined;
    }

    if (fieldName === 'entities') {
      const values = rawValue.split(',').map((entry) => entry.trim()).filter(Boolean);
      return values.length > 0 ? values : undefined;
    }

    return rawValue;
  }

  /**
   * Parse badge visibility/color rule field value.
   *
   * @private
   * @param {EditorBadgeRuleFieldKey | EditorBadgeColorRuleFieldKey} fieldName
   * @param {HTMLInputElement|HTMLSelectElement} field
   * @returns {EditorBadgeRule[EditorBadgeRuleFieldKey] | EditorBadgeColorRule[EditorBadgeColorRuleFieldKey] | undefined}
   */
  _parseBadgeRuleEditorValue(
    fieldName: EditorBadgeRuleFieldKey | EditorBadgeColorRuleFieldKey,
    field: EditorFieldElement
  ): EditorBadgeRule[EditorBadgeRuleFieldKey] | EditorBadgeColorRule[EditorBadgeColorRuleFieldKey] | undefined {
    if (field instanceof HTMLInputElement && field.type === 'checkbox') {
      return field.checked;
    }

    const rawValue = field.value.trim();
    if (!rawValue) {
      return undefined;
    }

    if (fieldName === 'operator' || fieldName === 'entity' || fieldName === 'attribute' || fieldName === 'color') {
      return rawValue;
    }

    if (/^(true|false)$/i.test(rawValue)) {
      return rawValue.toLowerCase() === 'true';
    }

    if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
      return Number(rawValue);
    }

    return rawValue;
  }
  
  /**
   * Bind animation presets events (immutable)
   * @private
   */
  _bindAnimationPresets() {
    // Animation type buttons (expand/collapse/cards)
    queryAll<HTMLButtonElement>(this.shadowRoot, '.animation-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.animationType;
        const animation = btn.dataset.animation;
        
        if (type === 'expand') {
          this._config = { ...this._config, expand_animation: animation };
          queryAll<HTMLButtonElement>(this.shadowRoot, '.animation-btn[data-animation-type="expand"]')
            .forEach(b => b.classList.remove('active'));
        } else if (type === 'collapse') {
          this._config = { ...this._config, collapse_animation: animation };
          queryAll<HTMLButtonElement>(this.shadowRoot, '.animation-btn[data-animation-type="collapse"]')
            .forEach(b => b.classList.remove('active'));
        } else if (type === 'cards') {
          this._config = { ...this._config, cards_animation: animation };
          queryAll<HTMLButtonElement>(this.shadowRoot, '.animation-btn[data-animation-type="cards"]')
            .forEach(b => b.classList.remove('active'));
        }
        
        btn.classList.add('active');
        this._fireConfigChanged();
      });
    });
    
    // Duration slider
    const durationSlider = queryOne<HTMLInputElement>(this.shadowRoot, '#animation_duration_slider');
    if (durationSlider) {
      durationSlider.addEventListener('input', (e) => {
        const target = isEditorFieldElement(e.target) ? e.target : null;
        if (!target) return;
        this._config = { ...this._config, animation_duration: parseInt(target.value, 10) };
        const valueDisplay = queryOne<HTMLElement>(this.shadowRoot, '.duration-value');
        if (valueDisplay) {
          valueDisplay.textContent = `${target.value}ms`;
        }
        this._fireConfigChanged();
      });
    }
    
    // Cards stagger slider
    const staggerSlider = queryOne<HTMLInputElement>(this.shadowRoot, '#cards_stagger_slider');
    if (staggerSlider) {
      staggerSlider.addEventListener('input', (e) => {
        const target = isEditorFieldElement(e.target) ? e.target : null;
        if (!target) return;
        this._config = { ...this._config, cards_stagger: parseInt(target.value, 10) };
        const valueDisplay = queryOne<HTMLElement>(this.shadowRoot, '.stagger-value');
        if (valueDisplay) {
          valueDisplay.textContent = `${target.value}ms`;
        }
        this._fireConfigChanged();
      });
    }
    
    // Cards direction buttons
    queryAll<HTMLButtonElement>(this.shadowRoot, '.direction-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const direction = btn.dataset.direction;
        this._config = { ...this._config, cards_direction: direction };
        
        queryAll<HTMLButtonElement>(this.shadowRoot, '.direction-btn')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this._fireConfigChanged();
      });
    });
    
    // Preview button
    const previewBtn = queryOne<HTMLButtonElement>(this.shadowRoot, '[data-action="preview-animation"]');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        this._previewAnimation();
      });
    }
  }
  
  /**
   * Preview animation on the card preview
   * @private
   */
  _previewAnimation() {
    const preview = queryOne<HTMLElement>(this.shadowRoot, '.preview-card');
    if (!preview) return;
    
    const expandAnim = this._config.expand_animation || 'slide';
    const duration = this._config.animation_duration || 300;
    
    // Animation class mapping
    const animationMap = {
      'none': '',
      'fade': 'uc-animate-fadeIn',
      'fadeUp': 'uc-animate-fadeInUp',
      'fadeDown': 'uc-animate-fadeInDown',
      'scale': 'uc-animate-scaleIn',
      'slide': 'uc-animate-slideInUp',
      'bounce': 'uc-animate-bounceIn',
      'flip': 'uc-animate-flipInX'
    };
    
    const animClass = animationMap[expandAnim];
    if (!animClass) return;
    
    // Remove any existing animation
    preview.style.animation = '';
    
    // Force reflow
    void preview.offsetHeight;
    
    // Apply animation
    preview.style.animation = `${animClass.replace('uc-animate-', 'uc-')} ${duration}ms ease forwards`;
    
    // Remove after completion
    setTimeout(() => {
      preview.style.animation = '';
    }, duration + 100);
  }
  
  /**
   * Handle toolbar button action
   * 
   * @private
   * @param {string} action - Action name
   */
  _handleToolbarAction(action?: string) {
    switch (action) {
      case 'undo':
        this._undo();
        break;
      case 'redo':
        this._redo();
        break;
      case 'reset':
        if (confirm('Сбросить все настройки?')) {
          this._config = { type: 'custom:universal-card' };
          this._fireConfigChangedAndRender();
        }
        break;
    }
  }
  
  /**
   * Handle input change
   * 
   * @private
   * @param {Event} event - Change event
   */
  _handleInputChange(event: Event) {
    const target = isEditorFieldElement(event.target) ? event.target : null;
    if (!target) return;

    const { name, value } = target;
    
    if (!name) return;
    
    // Создаём НОВЫЙ конфиг иммутабельно (избегаем ошибки readonly)
    const keys = name.split('.');
    const newValue = target instanceof HTMLInputElement && target.type === 'checkbox'
      ? target.checked 
      : target instanceof HTMLInputElement && target.type === 'number'
        ? (value !== '' ? parseInt(value, 10) : undefined)
      : value;
    
    // Рекурсивно создаём новый объект с обновлённым значением
    this._config = this._setNestedValue(this._config, keys, newValue);

    if (name === 'body_mode' || name === 'theme') {
      this._fireConfigChangedAndRender();
      return;
    }

    this._fireConfigChanged();
  }

  /**
   * Handle icon picker change.
   *
   * @private
   * @param {CustomEvent} event
   */
  _handleIconPickerChange(event: IconPickerChangedEvent) {
    const target = event.currentTarget instanceof HTMLElement
      ? event.currentTarget
      : event.target instanceof HTMLElement
        ? event.target
        : null;
    const path = target?.dataset.name;

    if (!path) return;

    const nextValue = typeof event.detail?.value === 'string'
      ? event.detail.value.trim()
      : '';

    this._config = this._setNestedValue(
      this._config,
      path.split('.'),
      nextValue || undefined
    );
    this._fireConfigChangedAndRender();
  }
  
  /**
   * Immutably set a nested value in an object
   * @private
   * @param {Object} obj - Source object
   * @param {Array<string>} keys - Path to the value
   * @param {*} value - New value
   * @returns {Object} New object with updated value
   */
  _setNestedValue<T>(obj: T, keys: string[], value: unknown): T {
    const copy = isObjectLike(obj) ? { ...obj } : {};
    
    if (keys.length === 1) {
      if (value === undefined) {
        Reflect.deleteProperty(copy, keys[0]);
      } else {
        Reflect.set(copy, keys[0], value);
      }
      return copy as T;
    }
    
    const [first, ...rest] = keys;
    Reflect.set(copy, first, this._setNestedValue(Reflect.get(copy, first), rest, value));
    return copy as T;
  }
  
  // ===========================================================================
  // HISTORY
  // ===========================================================================
  
  /**
   * Push config to history
   * 
   * @private
   * @param {Object} config - Configuration
   */
  _pushHistory(config) {
    // Remove future history if we're not at the end
    if (this._historyIndex < this._history.length - 1) {
      this._history = this._history.slice(0, this._historyIndex + 1);
    }
    
    this._history.push(deepClone(config));
    this._historyIndex = this._history.length - 1;
    
    // Limit history size
    if (this._history.length > 50) {
      this._history.shift();
      this._historyIndex--;
    }
  }
  
  /**
   * Undo last change
   * 
   * @private
   */
  _undo() {
    if (this._historyIndex > 0) {
      this._historyIndex--;
      this._config = deepClone(this._history[this._historyIndex]);
      this._fireConfigChangedAndRender();
    }
  }
  
  /**
   * Redo last undone change
   * 
   * @private
   */
  _redo() {
    if (this._historyIndex < this._history.length - 1) {
      this._historyIndex++;
      this._config = deepClone(this._history[this._historyIndex]);
      this._fireConfigChangedAndRender();
    }
  }
  
  // ===========================================================================
  // CONFIG EVENTS
  // ===========================================================================
  
  /**
   * Fire config-changed event
   * 
   * @private
   */
  /**
   * Fire config changed event WITHOUT re-rendering
   * Use this for text input changes to preserve focus
   * @private
   */
  _fireConfigChanged() {
    // Обновляем кэш конфига чтобы setConfig не вызвал перерендеринг
    this._lastConfigStr = JSON.stringify(this._config);
    fireEvent(this, 'config-changed', { config: this._config });
    this._updateLiveInspector();
  }
  
  /**
   * Fire config changed AND re-render the editor
   * Use this when structure changes (add/remove cards, tabs, etc.)
   * @private
   */
  _fireConfigChangedAndRender() {
    fireEvent(this, 'config-changed', { config: this._config });
    this._render();
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================
  
  /**
   * Get editor styles
   * 
   * @private
   * @returns {string} CSS string
   */
  _getStyles() {
    return `
      :host {
        display: block;
        --editor-bg: var(--primary-background-color, #fff);
        --editor-surface: var(--card-background-color, #fff);
        --editor-border: var(--divider-color, #e0e0e0);
        --editor-text: var(--primary-text-color, #212121);
        --editor-text-secondary: var(--secondary-text-color, #757575);
        --editor-primary: var(--primary-color, #03a9f4);
        --editor-primary-rgb: 3, 169, 244;
      }
      
      .editor {
        background: var(--editor-bg);
        border-radius: 12px;
        overflow: hidden;
      }
      
      /* Toolbar */
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: var(--editor-primary);
        color: white;
      }
      
      .toolbar-title {
        font-weight: 600;
        font-size: 16px;
      }
      
      .toolbar-right {
        display: flex;
        gap: 4px;
      }
      
      .toolbar-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .toolbar-btn:hover:not(:disabled) {
        background: rgba(255,255,255,0.3);
      }
      
      .toolbar-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      
      .toolbar-btn ha-icon {
        color: white;
        --mdc-icon-size: 20px;
      }
      
      /* Tab Bar - горизонтальные вкладки */
      .tab-bar {
        display: flex;
        background: var(--editor-surface);
        border-bottom: 1px solid var(--editor-border);
        overflow-x: auto;
        scrollbar-width: none;
      }
      
      .tab-bar::-webkit-scrollbar {
        display: none;
      }
      
      .tab-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px 16px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--editor-text-secondary);
        transition: all 0.2s;
        border-bottom: 3px solid transparent;
        min-width: 80px;
        flex-shrink: 0;
      }
      
      .tab-item:hover {
        background: rgba(var(--editor-primary-rgb), 0.05);
        color: var(--editor-text);
      }
      
      .tab-item.active {
        color: var(--editor-primary);
        border-bottom-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .tab-item ha-icon {
        --mdc-icon-size: 24px;
      }
      
      .tab-label {
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
      }
      
      /* Content */
      .editor-content {
        padding: 16px;
        max-height: 60vh;
        overflow-y: auto;
      }
      
      /* Sections */
      .section h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        color: var(--editor-text);
      }
      
      .subsection {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid var(--editor-border);
      }
      
      .subsection h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: var(--editor-text-secondary);
        font-weight: 500;
      }
      
      /* Fields */
      .field {
        margin-bottom: 16px;
      }
      
      .field label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        color: var(--editor-text-secondary);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .field input,
      .field select,
      .field textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
        background: var(--editor-surface);
        color: var(--editor-text);
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      
      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        outline: none;
        border-color: var(--editor-primary);
        box-shadow: 0 0 0 3px rgba(var(--editor-primary-rgb), 0.15);
      }
      
      .field-row {
        display: flex;
        gap: 16px;
      }
      
      .field-row .field {
        flex: 1;
      }
      
      .checkbox-field {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .checkbox-field input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
      
      .checkbox-field label {
        margin: 0;
        font-size: 14px;
        color: var(--editor-text);
        text-transform: none;
        letter-spacing: normal;
        cursor: pointer;
      }
      
      /* Icon picker wrapper */
      .icon-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .icon-picker-wrapper ha-icon-picker {
        flex: 1;
      }

      .icon-clear-btn.hidden {
        visibility: hidden;
        pointer-events: none;
      }
      
      /* Card Mini Preview */
      .card-mini-preview {
        background: var(--ha-card-background, var(--editor-surface));
        border: 1px solid var(--editor-border);
        border-radius: 12px;
        padding: 12px 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      
      .mini-preview-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .mini-preview-header .mini-icon {
        --mdc-icon-size: 28px;
        color: var(--editor-primary);
      }
      
      .mini-preview-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      
      .mini-title {
        font-size: 15px;
        font-weight: 500;
        color: var(--editor-text);
      }
      
      .mini-subtitle {
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .trigger-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: rgba(var(--editor-primary-rgb), 0.15);
        cursor: help;
        transition: all 0.2s;
      }
      
      .trigger-indicator:hover {
        background: rgba(var(--editor-primary-rgb), 0.25);
        transform: scale(1.05);
      }
      
      .trigger-indicator ha-icon {
        --mdc-icon-size: 20px;
        color: var(--editor-primary);
      }
      
      .mini-preview-hint {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--editor-border);
        font-size: 11px;
        color: var(--editor-text-secondary);
        text-align: center;
      }
      
      /* Cards list */
      .cards-list {
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        margin-bottom: 12px;
        overflow: hidden;
      }
      
      .card-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        background: var(--editor-surface);
        border-bottom: 1px solid var(--editor-border);
        transition: background 0.2s;
      }
      
      .card-item:last-child {
        border-bottom: none;
      }
      
      .card-item:hover {
        background: rgba(var(--editor-primary-rgb), 0.05);
      }

      .card-item[draggable="true"] {
        cursor: grab;
      }

      .card-item.dragging {
        opacity: 0.55;
        border: 1px dashed var(--editor-primary);
      }

      .card-item.drop-target {
        box-shadow: inset 0 0 0 2px rgba(var(--editor-primary-rgb), 0.45);
      }
      
      .card-item-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      
      .drag-handle {
        cursor: grab;
        color: var(--editor-text-secondary);
        --mdc-icon-size: 20px;
      }
      
      .card-type {
        font-weight: 500;
        color: var(--editor-text);
      }
      
      .card-entity {
        color: var(--editor-text-secondary);
        font-size: 12px;
      }
      
      .card-content-preview {
        color: var(--editor-text-secondary);
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .card-item-actions {
        display: flex;
        gap: 4px;
      }
      
      .empty-state {
        padding: 32px;
        text-align: center;
        color: var(--editor-text-secondary);
        font-style: italic;
      }
      
      /* Buttons */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: var(--editor-primary);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: opacity 0.2s, transform 0.1s;
      }
      
      .btn:hover {
        opacity: 0.9;
      }
      
      .btn:active {
        transform: scale(0.98);
      }
      
      .btn-icon {
        background: none;
        border: none;
        padding: 6px;
        cursor: pointer;
        color: var(--editor-text-secondary);
        border-radius: 6px;
        transition: all 0.2s;
      }
      
      .btn-icon:hover {
        color: var(--editor-text);
        background: rgba(0,0,0,0.05);
      }

      .btn-icon:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        pointer-events: none;
      }
      
      .btn-back {
        background: transparent;
        color: var(--editor-primary);
        border: 1px solid var(--editor-primary);
      }
      
      .btn-back:hover {
        background: rgba(var(--editor-primary-rgb), 0.1);
      }
      
      /* Sub-editor */
      .sub-editor-container {
        min-height: 300px;
      }
      
      .sub-editor-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--editor-border);
      }
      
      .sub-editor-title {
        font-weight: 500;
        color: var(--editor-text);
      }
      
      .sub-editor-content {
        min-height: 250px;
      }
      
      /* Card Picker Container */
      .card-picker-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .ha-picker-wrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .picker-tools {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      
      .picker-fallback-note {
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .card-picker-search {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .card-picker-search ha-icon {
        color: var(--editor-text-secondary);
        --mdc-icon-size: 20px;
      }
      
      .card-picker-search input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 14px;
        color: var(--editor-text);
        outline: none;
        padding: 0;
      }
      
      .card-picker-search input::placeholder {
        color: var(--editor-text-secondary);
      }
      
      .card-picker-sections {
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 8px;
      }
      
      .card-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .card-section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--editor-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .card-section-title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--editor-primary);
      }
      
      /* Card type grid */
      .card-type-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 10px;
      }
      
      .card-type-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px 8px;
        min-height: 80px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        overflow: hidden;
      }
      
      .card-type-btn:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.08);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .card-type-btn.custom {
        border-style: dashed;
      }
      
      .card-type-btn.custom:hover {
        border-style: solid;
      }
      
      .card-type-btn ha-icon {
        --mdc-icon-size: 28px;
        color: var(--editor-primary);
      }
      
      .card-type-btn.custom ha-icon {
        color: #ff9800;
      }
      
      .card-type-btn .card-name {
        font-size: 11px;
        font-weight: 500;
        color: var(--editor-text);
        text-align: center;
        line-height: 1.2;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .card-type-btn .custom-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: 8px;
        font-weight: 700;
        padding: 2px 4px;
        background: linear-gradient(135deg, #ff9800, #f57c00);
        color: white;
        border-radius: 4px;
        letter-spacing: 0.5px;
      }
      
      /* Custom type input */
      .custom-type-input {
        padding: 16px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 10px;
      }
      
      .custom-type-input h4 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 12px 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--editor-text-secondary);
      }
      
      .custom-type-input h4 ha-icon {
        --mdc-icon-size: 18px;
        color: var(--editor-primary);
      }
      
      .custom-type-row {
        display: flex;
        gap: 10px;
      }
      
      .custom-type-row input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        font-size: 14px;
        background: var(--editor-bg);
        color: var(--editor-text);
      }
      
      .custom-type-row input:focus {
        outline: none;
        border-color: var(--editor-primary);
      }
      
      /* YAML Preview */
      .yaml-preview {
        background: var(--code-editor-background-color, #1e1e1e);
        color: var(--primary-text-color, #d4d4d4);
        padding: 16px;
        border-radius: 8px;
        font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
        font-size: 12px;
        line-height: 1.6;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-word;
      }
      
      .yaml-key {
        color: #9cdcfe;
      }
      
      .yaml-value {
        color: #ce9178;
      }
      
      /* YAML Editor */
      .yaml-editor-container {
        padding: 16px;
      }
      
      .yaml-editor {
        width: 100%;
        min-height: 300px;
        font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
        font-size: 13px;
        line-height: 1.5;
        padding: 12px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        resize: vertical;
        background: var(--editor-surface);
        color: var(--editor-text);
      }
      
      .yaml-editor-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
      }
      
      /* Card Editor with Tabs */
      .card-editor-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      
      /* Inline card editor */
      .card-item.editing {
        background: transparent;
        padding: 0;
        border: none;
      }
      
      .inline-editor {
        border: 2px solid var(--editor-primary);
        border-radius: 8px;
        overflow: hidden;
        background: var(--editor-surface);
      }
      
      .card-editor-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: var(--editor-primary);
        color: white;
      }
      
      .editor-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 500;
      }
      
      .editor-title ha-icon {
        --mdc-icon-size: 16px;
      }
      
      .editor-actions {
        display: flex;
        gap: 6px;
      }
      
      .editor-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 6px;
        background: rgba(255,255,255,0.2);
        color: white;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .editor-btn:hover {
        background: rgba(255,255,255,0.3);
        transform: scale(1.05);
      }
      
      .editor-btn.save {
        background: #4caf50;
      }
      
      .editor-btn.save:hover {
        background: #43a047;
      }
      
      .editor-btn.cancel {
        background: rgba(255,255,255,0.15);
      }
      
      .editor-btn.cancel:hover {
        background: #f44336;
      }
      
      .editor-btn ha-icon {
        --mdc-icon-size: 18px;
      }
      
      .code-editor-wrapper {
        min-height: 120px;
        max-height: 350px;
        overflow: auto;
      }
      
      .code-editor-wrapper ha-code-editor {
        display: block;
        --code-mirror-height: 100%;
        min-height: 120px;
      }
      
      .yaml-fallback-editor {
        width: 100%;
        min-height: 120px;
        max-height: 350px;
        padding: 12px;
        border: none;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        font-size: 13px;
        line-height: 1.5;
        resize: vertical;
        box-sizing: border-box;
      }
      
      .yaml-fallback-editor:focus {
        outline: none;
      }
      
      /* Card item clickable */
      .card-item-content {
        cursor: pointer;
      }
      
      .card-item-content:hover {
        background: var(--editor-surface-hover, rgba(255,255,255,0.05));
      }
      
      .card-editor-tabs {
        display: flex;
        gap: 4px;
        padding: 8px 16px;
        border-bottom: 1px solid var(--editor-border);
        background: var(--editor-surface);
      }
      
      .editor-tab {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: transparent;
        border: none;
        border-radius: 8px 8px 0 0;
        color: var(--editor-text-secondary);
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
      }
      
      .editor-tab:hover {
        background: rgba(var(--editor-primary-rgb), 0.1);
        color: var(--editor-text);
      }
      
      .editor-tab.active {
        background: var(--editor-primary);
        color: white;
      }
      
      .editor-tab ha-icon {
        --mdc-icon-size: 18px;
      }
      
      .card-editor-content {
        flex: 1;
        overflow: auto;
      }
      
      .editor-panel {
        display: none;
        padding: 16px;
      }
      
      .editor-panel.active {
        display: block;
      }
      
      .card-editor-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid var(--editor-border);
        background: var(--editor-surface);
      }
      
      .loading-editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 40px;
        color: var(--editor-text-secondary);
      }
      
      .loading-editor .spin {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .no-visual-editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 40px;
        text-align: center;
        color: var(--editor-text-secondary);
      }
      
      .no-visual-editor ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.5;
      }
      
      .no-visual-editor p {
        margin: 4px 0;
      }
      
      /* Tabs list */
      .tabs-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .tabs-list .tab-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-surface);
      }
      
      .tabs-list .tab-item input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 4px 8px;
      }
      
      /* Preview */
      .theme-preview {
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 16px;
        background: var(--ha-card-background, #fff);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .preview-header {
        font-weight: 500;
        margin-bottom: 8px;
      }
      
      .preview-body {
        color: var(--editor-text-secondary);
      }

      .theme-tokens-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }

      .theme-token-item {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-bg);
      }

      .theme-token-item input {
        padding: 8px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
      }
      
      .hint {
        font-size: 12px;
        color: var(--editor-text-secondary);
        margin-bottom: 12px;
      }

      .live-inspector {
        margin-top: 16px;
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        background: var(--editor-surface);
        padding: 14px;
      }

      .live-inspector-title-row {
        margin-bottom: 10px;
      }

      .live-inspector-title-row h4 {
        margin: 0;
        font-size: 14px;
        color: var(--editor-text);
      }

      .live-preview-card {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 10px 12px;
        margin-bottom: 12px;
      }

      .live-preview-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .live-title {
        font-weight: 600;
      }

      .live-mode {
        font-size: 11px;
        opacity: 0.85;
      }

      .live-preview-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        font-size: 12px;
        opacity: 0.9;
      }

      .lint-panel {
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-bg);
      }

      .lint-panel.has-errors {
        border-color: #e57373;
      }

      .lint-panel.has-warnings {
        border-color: #ffb74d;
      }

      .lint-panel.is-clean {
        border-color: #81c784;
      }

      .lint-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 10px;
        border-bottom: 1px solid var(--editor-border);
        font-size: 12px;
        font-weight: 600;
      }

      .lint-summary {
        font-weight: 500;
        color: var(--editor-text-secondary);
      }

      .lint-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px;
      }

      .lint-item {
        display: flex;
        gap: 8px;
        font-size: 12px;
        line-height: 1.35;
      }

      .lint-level {
        min-width: 50px;
        font-weight: 700;
      }

      .lint-item.level-error .lint-level {
        color: #e53935;
      }

      .lint-item.level-warning .lint-level {
        color: #fb8c00;
      }

      .lint-item.level-info .lint-level {
        color: #1e88e5;
      }
      
      /* Feature Groups */
      .features-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .feature-group {
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        overflow: hidden;
        background: var(--editor-surface);
      }
      
      .feature-group.has-content {
        border-color: var(--editor-primary);
        border-width: 2px;
      }
      
      .feature-group-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        background: rgba(var(--editor-primary-rgb), 0.05);
        cursor: pointer;
        user-select: none;
        transition: background 0.2s;
      }
      
      .feature-group-header:hover {
        background: rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .feature-group-header ha-icon:first-child {
        --mdc-icon-size: 20px;
        color: var(--editor-primary);
      }
      
      .feature-group-header span:first-of-type {
        flex: 1;
        font-weight: 500;
        font-size: 14px;
      }
      
      .feature-badge {
        font-size: 11px;
        padding: 2px 6px;
        background: var(--editor-primary);
        color: white;
        border-radius: 10px;
        min-width: 16px;
        text-align: center;
      }
      
      .feature-badge:empty {
        display: none;
      }
      
      .collapse-icon {
        --mdc-icon-size: 20px;
        color: var(--editor-text-secondary);
        transition: transform 0.2s;
      }
      
      .feature-group.collapsible .feature-group-content {
        max-height: 0;
        overflow: hidden;
        padding: 0 14px;
        transition: max-height 0.3s, padding 0.3s;
      }
      
      .feature-group.collapsible.expanded .feature-group-content {
        max-height: 2000px;
        padding: 14px;
      }
      
      .feature-group.collapsible.expanded .collapse-icon {
        transform: rotate(180deg);
      }
      
      .feature-hint {
        font-size: 12px;
        color: var(--editor-text-secondary);
        margin: 0 0 12px 0;
        line-height: 1.4;
      }
      
      /* Conditions List */
      .conditions-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }

      .visibility-scope {
        padding: 12px;
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        background: var(--editor-bg);
        margin-bottom: 12px;
      }

      .visibility-scope-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .visibility-scope-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--editor-text);
      }
      
      .condition-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        flex-wrap: wrap;
      }

      .condition-item-logical {
        align-items: stretch;
      }
      
      .condition-type-badge {
        font-size: 10px;
        font-weight: 600;
        padding: 3px 6px;
        background: var(--editor-primary);
        color: white;
        border-radius: 4px;
        text-transform: uppercase;
      }
      
      .condition-fields {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
        flex-wrap: wrap;
      }

      .condition-control {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 120px;
        flex: 1;
      }

      .condition-control span {
        font-size: 11px;
        color: var(--editor-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      
      .cond-field {
        padding: 6px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 13px;
        min-width: 100px;
        flex: 1;
      }
      
      .cond-field.cond-small {
        max-width: 120px;
        flex: 0;
      }
      
      .cond-weekday {
        padding: 4px;
        font-size: 11px;
        min-height: 88px;
      }
      
      .add-condition-row {
        display: flex;
        gap: 8px;
      }
      
      .condition-type-select {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        font-size: 13px;
      }

      .condition-children {
        width: 100%;
        padding-top: 8px;
        border-top: 1px dashed var(--editor-border);
      }

      .condition-children-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 12px;
        color: var(--editor-text-secondary);
      }

      .nested-conditions {
        margin-left: 12px;
      }

      .nested-add-condition-row {
        margin-left: 12px;
      }
      
      /* State Styles */
      .state-styles-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .state-style-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        flex-wrap: wrap;
      }
      
      .state-key {
        width: 80px;
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .style-field {
        flex: 1;
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
      }
      
      .style-presets {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        flex-wrap: wrap;
      }
      
      .preset-label {
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .btn-preset {
        padding: 4px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        background: var(--editor-surface);
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-preset:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.1);
      }
      
      /* Expand Trigger */
      .expand-trigger-section {
        margin-bottom: 16px;
      }
      
      .section-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--editor-text);
        margin-bottom: 10px;
      }
      
      .section-label ha-icon {
        --mdc-icon-size: 18px;
        color: var(--editor-primary);
      }
      
      .expand-trigger-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      
      .expand-trigger-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border: 2px solid var(--editor-border);
        border-radius: 10px;
        background: var(--editor-surface);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .expand-trigger-btn:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.05);
      }
      
      .expand-trigger-btn.active {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.15);
        box-shadow: 0 0 0 3px rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .expand-trigger-btn ha-icon {
        --mdc-icon-size: 20px;
        color: var(--editor-primary);
      }
      
      .expand-trigger-btn span {
        font-size: 12px;
        font-weight: 500;
        color: var(--editor-text);
      }
      
      .section-divider {
        border: none;
        border-top: 1px solid var(--editor-border);
        margin: 16px 0;
      }
      
      .custom-actions-section {
        margin-top: 12px;
      }
      
      /* Actions */
      .action-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }
      
      .action-row.disabled {
        opacity: 0.7;
      }
      
      .action-row label {
        width: 130px;
        font-size: 13px;
        color: var(--editor-text);
      }
      
      .action-expand-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: rgba(var(--editor-primary-rgb), 0.15);
        border: 1px solid var(--editor-primary);
        border-radius: 6px;
        color: var(--editor-primary);
        font-size: 12px;
        font-weight: 500;
      }
      
      .action-expand-badge ha-icon {
        --mdc-icon-size: 16px;
      }
      
      .action-type-select {
        flex: 1;
        min-width: 150px;
        padding: 8px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 13px;
      }
      
      .action-extra-field {
        flex: 1;
        min-width: 150px;
        padding: 8px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 13px;
        margin-top: 6px;
      }
      
      /* Badges */
      .badges-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 12px;
      }
      
      .badge-item {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }

      .badge-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
      }

      .badge-item-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--editor-text);
      }

      .badge-fields-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
        width: 100%;
      }

      .badge-field-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }

      .badge-field-block > span,
      .badge-field-block > label {
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .badge-field {
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
        min-width: 0;
      }

      .badge-thresholds {
        width: 100%;
        padding-top: 8px;
        border-top: 1px dashed var(--editor-border);
      }

      .badge-rules {
        width: 100%;
        padding-top: 8px;
        border-top: 1px dashed var(--editor-border);
      }

      .badge-thresholds-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .badge-threshold-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 10px;
      }

      .badge-rules-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .badge-rule-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 10px;
      }

      .badge-threshold-item {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) auto;
        gap: 8px;
        align-items: end;
        padding: 10px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }

      .badge-rule-item {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)) auto;
        gap: 8px;
        align-items: end;
        padding: 10px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }

      .badge-threshold-field {
        width: 100%;
      }

      .badge-rule-field {
        width: 100%;
      }
      
      /* Animation Presets */
      .animation-section {
        margin-bottom: 16px;
      }
      
      .animation-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin-top: 8px;
      }
      
      .animation-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border: 2px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-surface);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .animation-btn:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.05);
      }
      
      .animation-btn.active {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.15);
        box-shadow: 0 0 0 3px rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .animation-btn ha-icon {
        --mdc-icon-size: 20px;
        color: var(--editor-primary);
      }
      
      .animation-btn span {
        font-size: 9px;
        color: var(--editor-text);
        text-align: center;
        white-space: nowrap;
      }
      
      /* Direction Grid */
      .direction-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin-top: 8px;
      }
      
      .direction-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border: 2px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-surface);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .direction-btn:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.05);
      }
      
      .direction-btn.active {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.15);
        box-shadow: 0 0 0 3px rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .direction-btn ha-icon {
        --mdc-icon-size: 18px;
        color: var(--editor-primary);
      }
      
      .direction-btn span {
        font-size: 8px;
        color: var(--editor-text);
        text-align: center;
        white-space: nowrap;
      }
      
      .animation-duration-section {
        margin-bottom: 16px;
      }
      
      .duration-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 8px;
      }
      
      .duration-row input[type="range"] {
        flex: 1;
        height: 6px;
        -webkit-appearance: none;
        background: var(--editor-border);
        border-radius: 3px;
      }
      
      .duration-row input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--editor-primary);
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
      
      .duration-value,
      .stagger-value {
        font-size: 13px;
        font-weight: 500;
        color: var(--editor-primary);
        min-width: 50px;
      }
      
      .btn-preview-animation {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 10px;
        border: 1px dashed var(--editor-primary);
        border-radius: 8px;
        background: rgba(var(--editor-primary-rgb), 0.05);
        color: var(--editor-primary);
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      }
      
      .btn-preview-animation:hover {
        background: rgba(var(--editor-primary-rgb), 0.15);
        border-style: solid;
      }
      
      .btn-preview-animation ha-icon {
        --mdc-icon-size: 18px;
      }
      
      /* Range Slider */
      .field input[type="range"] {
        width: 100%;
        margin: 8px 0;
      }
      
      .range-value {
        display: inline-block;
        font-size: 12px;
        color: var(--editor-text-secondary);
        margin-left: 8px;
      }
      
      /* Small buttons */
      .btn-small {
        padding: 6px 12px;
        font-size: 12px;
      }
      
      .btn-delete {
        color: #f44336;
      }
      
      .btn-delete:hover {
        background: rgba(244, 67, 54, 0.1);
      }
      
      /* Responsive */
      @media (max-width: 500px) {
        .tab-item {
          padding: 10px 12px;
          min-width: 60px;
        }
        
        .tab-label {
          font-size: 10px;
        }
        
        .tab-item ha-icon {
          --mdc-icon-size: 20px;
        }
        
        .condition-item {
          flex-direction: column;
          align-items: stretch;
        }
        
        .condition-fields {
          flex-direction: column;
        }
        
        .cond-field {
          width: 100%;
          max-width: none !important;
        }
        
        .action-row {
          flex-direction: column;
          align-items: stretch;
        }
        
        .action-row label {
          width: auto;
        }
        
        .theme-token-item {
          grid-template-columns: 1fr;
        }

        .live-preview-header-row {
          flex-direction: column;
          align-items: flex-start;
        }

        .badge-fields-grid,
        .badge-threshold-item {
          grid-template-columns: 1fr;
        }
      }
    `;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default UniversalCardEditor;
