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

import { BODY_MODES, THEMES, DEFAULTS, VALID_BODY_MODES } from './constants.js';
import { ConfigManager } from './config.js';
import { fireEvent, deepClone } from '../utils/helpers.js';
import { getThemePreviewStyle } from '../styles/themes.js';

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

// =============================================================================
// UNIVERSAL CARD EDITOR
// =============================================================================

/**
 * UniversalCardEditor custom element
 * 
 * @extends HTMLElement
 */
export class UniversalCardEditor extends HTMLElement {
  
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
  }
  
  // ===========================================================================
  // SETTERS
  // ===========================================================================
  
  /**
   * Set Home Assistant instance
   * 
   * @param {Object} hass - Home Assistant instance
   */
  set hass(hass) {
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
  setConfig(config) {
    // Проверяем изменился ли конфиг - если нет, не перерендериваем
    const newConfigStr = JSON.stringify(config);
    if (this._lastConfigStr === newConfigStr) {
      return;
    }
    this._lastConfigStr = newConfigStr;
    
    // Используем JSON.parse/stringify для ПОЛНОГО размораживания объекта
    // deepClone может оставлять внутренние объекты замороженными
    try {
      this._config = JSON.parse(newConfigStr);
    } catch (e) {
      this._config = deepClone(config);
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
  _saveFocusState() {
    const activeElement = this.shadowRoot.activeElement;
    if (!activeElement || !activeElement.matches('input, textarea, select')) {
      return null;
    }
    
    return {
      id: activeElement.id,
      name: activeElement.name,
      tagName: activeElement.tagName,
      selectionStart: activeElement.selectionStart,
      selectionEnd: activeElement.selectionEnd,
      value: activeElement.value
    };
  }
  
  /**
   * Restore focus state after render
   * @private
   * @param {Object|null} focusInfo - Saved focus information
   */
  _restoreFocusState(focusInfo) {
    if (!focusInfo) return;
    
    // Небольшая задержка чтобы DOM успел обновиться
    requestAnimationFrame(() => {
      let element = null;
      
      // Пробуем найти по id
      if (focusInfo.id) {
        element = this.shadowRoot.getElementById(focusInfo.id);
      }
      
      // Если не нашли по id - пробуем по name
      if (!element && focusInfo.name) {
        element = this.shadowRoot.querySelector(`[name="${focusInfo.name}"]`);
      }
      
      if (element) {
        element.focus();
        
        // Восстанавливаем позицию курсора для текстовых полей
        if (typeof focusInfo.selectionStart === 'number' && element.setSelectionRange) {
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
  _renderSection(section) {
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
        
        <div class="field">
          <label for="title">Заголовок</label>
          <input type="text" 
                 id="title" 
                 name="title"
                 value="${this._escapeHtml(this._config.title || '')}" 
                 placeholder="Название карточки">
        </div>
        
        <div class="field">
          <label for="subtitle">Подзаголовок</label>
          <input type="text" 
                 id="subtitle" 
                 name="subtitle"
                 value="${this._escapeHtml(this._config.subtitle || '')}" 
                 placeholder="Дополнительный текст">
        </div>
        
        <div class="field">
          <label for="icon">Иконка</label>
          <div class="icon-picker-wrapper">
            <input type="text" 
                   id="icon" 
                   name="icon"
                   value="${this._escapeHtml(this._config.icon || '')}" 
                   placeholder="mdi:home">
            ${this._config.icon ? `<ha-icon icon="${this._config.icon}" class="icon-preview"></ha-icon>` : ''}
          </div>
        </div>
        
        <div class="field">
          <label for="entity">Entity (опционально)</label>
          <input type="text" 
                 id="entity" 
                 name="entity"
                 value="${this._escapeHtml(this._config.entity || '')}" 
                 placeholder="light.room"
                 list="entities-list">
          <datalist id="entities-list">
            ${this._hass ? Object.keys(this._hass.states).slice(0, 100).map(e => 
              `<option value="${e}">`).join('') : ''}
          </datalist>
        </div>
        
        <div class="field">
          <label for="body_mode">Режим body</label>
          <select id="body_mode" name="body_mode">
            ${VALID_BODY_MODES.map(mode => `
              <option value="${mode}" ${this._config.body_mode === mode ? 'selected' : ''}>
                ${this._getModeLabel(mode)}
              </option>
            `).join('')}
          </select>
        </div>
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="expanded" 
                 name="expanded"
                 ${this._config.expanded ? 'checked' : ''}>
          <label for="expanded">Раскрыта по умолчанию</label>
        </div>
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
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="show_expand_icon" 
                 name="show_expand_icon"
                 ${this._config.show_expand_icon !== false ? 'checked' : ''}>
          <label for="show_expand_icon">Показывать иконку раскрытия</label>
        </div>
        
        <div class="field">
          <label for="expand_icon">Иконка раскрытия</label>
          <input type="text" 
                 id="expand_icon" 
                 name="expand_icon"
                 value="${this._escapeHtml(this._config.expand_icon || DEFAULTS.expand_icon)}" 
                 placeholder="mdi:chevron-down">
        </div>
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="sticky_header" 
                 name="sticky_header"
                 ${this._config.sticky_header ? 'checked' : ''}>
          <label for="sticky_header">Фиксированный заголовок при скролле</label>
        </div>
        
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
    return `
      <div class="section">
        <h3>Настройки содержимого</h3>
        
        <div class="subsection">
          <h4>Grid Layout</h4>
          
          <div class="field-row">
            <div class="field">
              <label for="grid_columns">Колонки</label>
              <input type="number" 
                     id="grid_columns" 
                     name="grid.columns"
                     value="${this._config.grid?.columns || DEFAULTS.grid_columns}" 
                     min="1" 
                     max="12">
            </div>
            
            <div class="field">
              <label for="grid_gap">Отступы</label>
              <input type="text" 
                     id="grid_gap" 
                     name="grid.gap"
                     value="${this._escapeHtml(this._config.grid?.gap || DEFAULTS.grid_gap)}" 
                     placeholder="16px">
            </div>
          </div>
        </div>
        
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
    const themes = Object.values(THEMES);
    
    return `
      <div class="section">
        <h3>Настройки стиля</h3>
        
        <div class="field">
          <label for="theme">Тема</label>
          <select id="theme" name="theme">
            ${themes.map(theme => `
              <option value="${theme}" ${this._config.theme === theme ? 'selected' : ''}>
                ${this._getThemeLabel(theme)}
              </option>
            `).join('')}
          </select>
        </div>
        
        <div class="theme-preview" style="${this._escapeHtml(this._getThemePreviewStyle())}">
          <div class="preview-header">Preview</div>
          <div class="preview-body">Содержимое</div>
        </div>

        ${this._renderThemeTokensEditor()}
        
        <div class="field">
          <label for="border_radius">Скругление углов</label>
          <input type="text" 
                 id="border_radius" 
                 name="border_radius"
                 value="${this._escapeHtml(this._config.border_radius || DEFAULTS.border_radius)}" 
                 placeholder="12px">
        </div>
        
        <div class="field">
          <label for="padding">Внутренние отступы</label>
          <input type="text" 
                 id="padding" 
                 name="padding"
                 value="${this._escapeHtml(this._config.padding || DEFAULTS.padding)}" 
                 placeholder="16px">
        </div>
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="animation" 
                 name="animation"
                 ${this._config.animation !== false ? 'checked' : ''}>
          <label for="animation">Анимации</label>
        </div>
        
        <div class="field">
          <label for="animation_duration">Длительность анимации (мс)</label>
          <input type="number" 
                 id="animation_duration" 
                 name="animation_duration"
                 value="${this._config.animation_duration || DEFAULTS.animation_duration}" 
                 min="0" 
                 max="2000">
        </div>
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
        
        <!-- Базовые настройки -->
        <div class="feature-group">
          <div class="feature-group-header">
            <ha-icon icon="mdi:cog"></ha-icon>
            <span>Базовые</span>
          </div>
          
          <div class="field checkbox-field">
            <input type="checkbox" 
                   id="lazy_load" 
                   name="lazy_load"
                   ${this._config.lazy_load !== false ? 'checked' : ''}>
            <label for="lazy_load">Ленивая загрузка (lazy loading)</label>
          </div>
          
          <div class="field checkbox-field">
            <input type="checkbox" 
                   id="remember_state" 
                   name="remember_state"
                   ${this._config.remember_state ? 'checked' : ''}>
            <label for="remember_state">Запоминать состояние</label>
          </div>
          
          <div class="field">
            <label for="auto_collapse_after">Авто-сворачивание (сек, 0 - откл.)</label>
            <input type="number" 
                   id="auto_collapse_after" 
                   name="auto_collapse_after"
                   value="${this._config.auto_collapse_after || 0}" 
                   min="0" max="3600">
          </div>
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

    const conditionTypes = [
      { value: 'state', label: 'Состояние entity', icon: 'mdi:toggle-switch' },
      { value: 'numeric_state', label: 'Числовое значение', icon: 'mdi:numeric' },
      { value: 'user', label: 'Пользователь', icon: 'mdi:account' },
      { value: 'time', label: 'Время', icon: 'mdi:clock-outline' },
      { value: 'screen', label: 'Размер экрана', icon: 'mdi:monitor' }
    ];
    
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
  _renderVisibilityScope(scope, label, conditions, conditionTypes, hint = '') {
    return `
      <div class="visibility-scope">
        <div class="visibility-scope-header">
          <span class="visibility-scope-title">${label}</span>
          <span class="feature-badge">${conditions.length || ''}</span>
        </div>
        ${hint ? `<p class="feature-hint">${hint}</p>` : ''}

        <div class="conditions-list">
          ${conditions.map((cond, idx) => this._renderConditionItem(cond, idx, scope)).join('')}
        </div>

        <div class="add-condition-row">
          <select class="condition-type-select" data-visibility-scope="${scope}">
            <option value="">Выберите тип условия...</option>
            ${conditionTypes.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
          </select>
          <button class="btn btn-small btn-add" data-action="add-visibility-condition" data-scope="${scope}">
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
  _renderConditionItem(condition, index, scope = 'global') {
    const type = condition.condition || 'state';
    let fieldsHtml = '';
    
    switch (type) {
      case 'state':
        fieldsHtml = `
          <input type="text" placeholder="entity_id" value="${this._escapeHtml(condition.entity || '')}" 
                 data-field="entity" class="cond-field">
          <select data-field="operator" class="cond-operator">
            <option value="eq" ${!condition.state_not ? 'selected' : ''}>равно</option>
            <option value="neq" ${condition.state_not ? 'selected' : ''}>не равно</option>
          </select>
          <input type="text" placeholder="on, off, ..." value="${this._escapeHtml(condition.state || condition.state_not || '')}" 
                 data-field="state" class="cond-field">
        `;
        break;
        
      case 'numeric_state':
        fieldsHtml = `
          <input type="text" placeholder="entity_id" value="${this._escapeHtml(condition.entity || '')}" 
                 data-field="entity" class="cond-field">
          <input type="number" placeholder="выше" value="${condition.above ?? ''}" 
                 data-field="above" class="cond-field cond-small">
          <input type="number" placeholder="ниже" value="${condition.below ?? ''}" 
                 data-field="below" class="cond-field cond-small">
        `;
        break;
        
      case 'user':
        fieldsHtml = `
          <input type="text" placeholder="имена через запятую" value="${(condition.users || []).join(', ')}" 
                 data-field="users" class="cond-field">
          <label class="cond-checkbox">
            <input type="checkbox" data-field="is_admin" ${condition.is_admin ? 'checked' : ''}>
            Только админ
          </label>
        `;
        break;
        
      case 'time':
        fieldsHtml = `
          <input type="time" placeholder="после" value="${condition.after || ''}" 
                 data-field="after" class="cond-field cond-small">
          <span>—</span>
          <input type="time" placeholder="до" value="${condition.before || ''}" 
                 data-field="before" class="cond-field cond-small">
          <select data-field="weekday" multiple class="cond-weekday" title="Дни недели">
            <option value="mon" ${(condition.weekday || []).includes('mon') ? 'selected' : ''}>Пн</option>
            <option value="tue" ${(condition.weekday || []).includes('tue') ? 'selected' : ''}>Вт</option>
            <option value="wed" ${(condition.weekday || []).includes('wed') ? 'selected' : ''}>Ср</option>
            <option value="thu" ${(condition.weekday || []).includes('thu') ? 'selected' : ''}>Чт</option>
            <option value="fri" ${(condition.weekday || []).includes('fri') ? 'selected' : ''}>Пт</option>
            <option value="sat" ${(condition.weekday || []).includes('sat') ? 'selected' : ''}>Сб</option>
            <option value="sun" ${(condition.weekday || []).includes('sun') ? 'selected' : ''}>Вс</option>
          </select>
        `;
        break;
        
      case 'screen':
        fieldsHtml = `
          <input type="number" placeholder="min width" value="${condition.min_width ?? ''}" 
                 data-field="min_width" class="cond-field cond-small">
          <span>—</span>
          <input type="number" placeholder="max width" value="${condition.max_width ?? ''}" 
                 data-field="max_width" class="cond-field cond-small">
          <span>px</span>
        `;
        break;
    }
    
    return `
      <div class="condition-item" data-index="${index}" data-type="${type}" data-scope="${scope}">
        <div class="condition-type-badge">${type}</div>
        <div class="condition-fields">${fieldsHtml}</div>
        <button class="btn-icon btn-delete" data-action="delete-condition" data-scope="${scope}" data-index="${index}">
          <ha-icon icon="mdi:delete"></ha-icon>
        </button>
      </div>
    `;
  }
  
  /**
   * Render State Styles UI
   * @private
   * @returns {string} HTML string
   */
  _renderStateStylesUI() {
    const hasStateStyles = this._config.state_styles && Object.keys(this._config.state_styles).length > 0;
    const stateStylesEntity = this._config.state_styles_entity || '';
    const styles = this._config.state_styles || {};
    
    return `
      <div class="feature-group collapsible ${hasStateStyles ? 'has-content' : ''}" data-feature="state_styles">
        <div class="feature-group-header" data-toggle="state_styles">
          <ha-icon icon="mdi:palette-swatch"></ha-icon>
          <span>Стили по состоянию</span>
          <span class="feature-badge">${hasStateStyles ? '✓' : ''}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="state-styles-content">
          <p class="feature-hint">Изменение внешнего вида карточки в зависимости от состояния entity</p>
          
          <div class="field">
            <label>Entity для отслеживания</label>
            <input type="text" id="state_styles_entity" 
                   value="${this._escapeHtml(stateStylesEntity)}" 
                   placeholder="sensor.temperature"
                   list="entities-list">
          </div>
          
          <div class="state-styles-list" id="state-styles-list">
            ${Object.entries(styles).map(([state, style], idx) => `
              <div class="state-style-item" data-state="${this._escapeHtml(state)}">
                <input type="text" value="${this._escapeHtml(state)}" placeholder="on, off, >20, ..." 
                       class="state-key" data-index="${idx}">
                <input type="text" value="${style.background || ''}" placeholder="background" 
                       class="style-field" data-style="background">
                <input type="text" value="${style.color || ''}" placeholder="color" 
                       class="style-field" data-style="color">
                <input type="text" value="${style.border || ''}" placeholder="border" 
                       class="style-field" data-style="border">
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
    const tapAction = this._config.tap_action || {};
    const holdAction = this._config.hold_action || {};
    const doubleTapAction = this._config.double_tap_action || {};
    
    const hasActions = tapAction.action || holdAction.action || doubleTapAction.action || expandTrigger !== 'tap';
    
    const actionTypes = [
      { value: 'none', label: 'Нет действия' },
      { value: 'more-info', label: 'Открыть информацию' },
      { value: 'toggle', label: 'Переключить entity' },
      { value: 'call-service', label: 'Вызвать сервис' },
      { value: 'navigate', label: 'Перейти' },
      { value: 'url', label: 'Открыть URL' }
    ];
    
    const expandTriggers = [
      { value: 'tap', label: 'Клик (tap)', icon: 'mdi:gesture-tap' },
      { value: 'hold', label: 'Удержание (hold)', icon: 'mdi:gesture-tap-hold' },
      { value: 'double_tap', label: 'Двойной клик', icon: 'mdi:gesture-double-tap' },
      { value: 'none', label: 'Отключено', icon: 'mdi:close-circle-outline' }
    ];
    
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
                  <ha-icon icon="${trigger.icon}"></ha-icon>
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
  _renderActionRow(actionKey, label, action, actionTypes, isExpandTrigger = false) {
    const currentAction = action.action || 'none';
    
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
        <input type="text" placeholder="service" value="${this._escapeHtml(action.service || '')}" 
               data-action-key="${actionKey}" data-field="service" class="action-extra-field">
      `;
    } else if (currentAction === 'navigate') {
      extraFields = `
        <input type="text" placeholder="/lovelace/view" value="${this._escapeHtml(action.navigation_path || '')}" 
               data-action-key="${actionKey}" data-field="navigation_path" class="action-extra-field">
      `;
    } else if (currentAction === 'url') {
      extraFields = `
        <input type="text" placeholder="https://..." value="${this._escapeHtml(action.url_path || '')}" 
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
    const swipe = this._config.swipe || {};
    const hasSwipe = swipe.enabled || swipe.swipe_left || swipe.swipe_right;
    
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
          
          <div class="field checkbox-field">
            <input type="checkbox" id="swipe_enabled" 
                   ${swipe.enabled ? 'checked' : ''}>
            <label for="swipe_enabled">Включить жесты</label>
          </div>
          
          <div class="field">
            <label>Направление</label>
            <select id="swipe_direction">
              <option value="horizontal" ${swipe.direction === 'horizontal' ? 'selected' : ''}>Горизонтальный</option>
              <option value="vertical" ${swipe.direction === 'vertical' ? 'selected' : ''}>Вертикальный</option>
              <option value="both" ${swipe.direction === 'both' ? 'selected' : ''}>Оба</option>
            </select>
          </div>
          
          <div class="swipe-actions-grid">
            <div class="swipe-action-item">
              <ha-icon icon="mdi:arrow-left"></ha-icon>
              <select id="swipe_left_action">
                <option value="">Нет действия</option>
                <option value="expand" ${swipe.swipe_left?.action === 'expand' ? 'selected' : ''}>Раскрыть</option>
                <option value="collapse" ${swipe.swipe_left?.action === 'collapse' ? 'selected' : ''}>Свернуть</option>
                <option value="next" ${swipe.swipe_left?.action === 'next' ? 'selected' : ''}>Следующий</option>
                <option value="prev" ${swipe.swipe_left?.action === 'prev' ? 'selected' : ''}>Предыдущий</option>
              </select>
            </div>
            <div class="swipe-action-item">
              <ha-icon icon="mdi:arrow-right"></ha-icon>
              <select id="swipe_right_action">
                <option value="">Нет действия</option>
                <option value="expand" ${swipe.swipe_right?.action === 'expand' ? 'selected' : ''}>Раскрыть</option>
                <option value="collapse" ${swipe.swipe_right?.action === 'collapse' ? 'selected' : ''}>Свернуть</option>
                <option value="next" ${swipe.swipe_right?.action === 'next' ? 'selected' : ''}>Следующий</option>
                <option value="prev" ${swipe.swipe_right?.action === 'prev' ? 'selected' : ''}>Предыдущий</option>
              </select>
            </div>
          </div>
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
            ${badges.map((badge, idx) => `
              <div class="badge-item" data-index="${idx}">
                <input type="text" placeholder="entity_id" value="${this._escapeHtml(badge.entity || '')}" 
                       data-field="entity" class="badge-field">
                <input type="text" placeholder="иконка" value="${this._escapeHtml(badge.icon || '')}" 
                       data-field="icon" class="badge-field badge-small">
                <input type="text" placeholder="цвет" value="${this._escapeHtml(badge.color || '')}" 
                       data-field="color" class="badge-field badge-small">
                <button class="btn-icon btn-delete" data-action="delete-badge" data-index="${idx}">
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>
              </div>
            `).join('')}
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
   * Render Animation Presets UI
   * @private
   * @returns {string} HTML string
   */
  _renderAnimationPresetsUI() {
    const expandAnimation = this._config.expand_animation || 'slide';
    const collapseAnimation = this._config.collapse_animation || 'slide';
    const duration = this._config.animation_duration || 300;
    const cardsAnimation = this._config.cards_animation || 'fadeUp';
    const cardsStagger = this._config.cards_stagger || 50;
    
    const expandAnimations = [
      { value: 'none', label: 'Нет', icon: 'mdi:cancel' },
      { value: 'fade', label: 'Появление', icon: 'mdi:blur' },
      { value: 'fadeUp', label: 'Снизу', icon: 'mdi:arrow-up-bold' },
      { value: 'fadeDown', label: 'Сверху', icon: 'mdi:arrow-down-bold' },
      { value: 'scale', label: 'Масштаб', icon: 'mdi:resize' },
      { value: 'slide', label: 'Выезд', icon: 'mdi:arrow-expand-down' },
      { value: 'bounce', label: 'Пружина', icon: 'mdi:arrow-collapse-down' },
      { value: 'flip', label: '3D флип', icon: 'mdi:rotate-3d-variant' }
    ];
    
    const collapseAnimations = [
      { value: 'none', label: 'Нет', icon: 'mdi:cancel' },
      { value: 'fade', label: 'Исчезание', icon: 'mdi:blur-off' },
      { value: 'fadeDown', label: 'Вниз', icon: 'mdi:arrow-down-bold' },
      { value: 'fadeUp', label: 'Вверх', icon: 'mdi:arrow-up-bold' },
      { value: 'scale', label: 'Масштаб', icon: 'mdi:resize-bottom-right' },
      { value: 'slide', label: 'Уезд', icon: 'mdi:arrow-collapse-up' }
    ];
    
    const cardsAnimations = [
      { value: 'none', label: 'Нет', icon: 'mdi:cancel' },
      { value: 'fadeUp', label: 'Снизу', icon: 'mdi:arrow-up-bold' },
      { value: 'fadeDown', label: 'Сверху', icon: 'mdi:arrow-down-bold' },
      { value: 'fadeLeft', label: 'Слева', icon: 'mdi:arrow-left-bold' },
      { value: 'fadeRight', label: 'Справа', icon: 'mdi:arrow-right-bold' },
      { value: 'scale', label: 'Масштаб', icon: 'mdi:resize' },
      { value: 'bounce', label: 'Пружина', icon: 'mdi:arrow-collapse-down' },
      { value: 'flip', label: '3D флип', icon: 'mdi:rotate-3d-variant' }
    ];
    
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
              Задержка между карточками
            </label>
            <div class="duration-row">
              <input type="range" id="cards_stagger_slider" 
                     min="0" max="200" step="10"
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
              Общая длительность
            </label>
            <div class="duration-row">
              <input type="range" id="animation_duration_slider" 
                     min="0" max="1000" step="50"
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
    const direction = this._config.cards_direction || 'sequential';
    
    const directions = [
      { value: 'sequential', label: 'По порядку', icon: 'mdi:ray-start-arrow' },
      { value: 'reverse', label: 'Обратный', icon: 'mdi:ray-end-arrow' },
      { value: 'center-out', label: 'От центра', icon: 'mdi:arrow-expand-horizontal' },
      { value: 'edges-in', label: 'К центру', icon: 'mdi:arrow-collapse-horizontal' },
      { value: 'diagonal', label: 'По диагонали', icon: 'mdi:arrow-bottom-right' },
      { value: 'wave', label: 'Волна', icon: 'mdi:wave' },
      { value: 'random', label: 'Случайный', icon: 'mdi:shuffle-variant' }
    ];
    
    return `
      <div class="animation-section">
        <label class="section-label">
          <ha-icon icon="mdi:arrow-decision"></ha-icon>
          Направление появления
        </label>
        <div class="direction-grid">
          ${directions.map(d => `
            <button class="direction-btn ${direction === d.value ? 'active' : ''}" 
                    data-direction="${d.value}"
                    title="${d.label}">
              <ha-icon icon="${d.icon}"></ha-icon>
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
        
        <div class="field">
          <label for="card_id">ID карточки</label>
          <input type="text" 
                 id="card_id" 
                 name="card_id"
                 value="${this._escapeHtml(this._config.card_id || '')}" 
                 placeholder="Авто-генерируется если пусто">
        </div>
        
        <div class="subsection">
          <h4>YAML Preview</h4>
          <div class="yaml-preview">${this._getYamlPreview()}</div>
        </div>
        
        <div class="subsection">
          <h4>Debug</h4>
          <div class="field checkbox-field">
            <input type="checkbox" 
                   id="debug" 
                   name="debug"
                   ${this._config.debug ? 'checked' : ''}>
            <label for="debug">Режим отладки</label>
          </div>
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
  _renderCardsList(cards, section) {
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
            <span class="card-type">${this._escapeHtml(card.type || 'unknown')}</span>
            ${card.entity ? `<span class="card-entity">${this._escapeHtml(card.entity)}</span>` : ''}
            ${card.content ? `<span class="card-content-preview">${this._escapeHtml((card.content || '').substring(0, 30))}...</span>` : ''}
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
    
    // Если добавляем новую карточку - показываем card picker
    if (index === -1) {
      await this._showCardPicker(slot, section);
    } else {
      // Редактируем существующую карточку
      const cards = section === 'header' 
        ? (this._config.header?.cards || [])
        : (this._config.body?.cards || []);
      
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
  async _showCardPicker(container, section) {
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
  _showFallbackCardPicker(container, section, reason = '') {
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
  async _tryShowHaCardPicker(container, section) {
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
      
      const slot = container.querySelector('#ha-card-picker-slot');
      if (!slot) {
        return false;
      }
      
      const picker = document.createElement('hui-card-picker');
      picker.hass = this._hass;
      picker.lovelace = this._getLovelace();
      picker.path = [];
      picker.addEventListener('config-changed', (event) => {
        const pickedConfig = event.detail?.config;
        if (!pickedConfig || !pickedConfig.type) return;
        this._handlePickedCardConfig(section, pickedConfig);
      });
      slot.appendChild(picker);
      
      const fallbackBtn = container.querySelector('#use-fallback-picker');
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
  _handlePickedCardConfig(section, pickedConfig) {
    if (!pickedConfig || typeof pickedConfig !== 'object') return;
    
    const config = deepClone(pickedConfig);
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
  async _loadCardHelpers() {
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
  _getLovelace() {
    // Пробуем найти lovelace через разные способы
    let lovelace = null;
    
    // Способ 1: через document.__lovelace
    if (document.__lovelace) {
      lovelace = document.__lovelace;
    }
    
    // Способ 2: через hui-root
    if (!lovelace) {
      const root = document.querySelector('home-assistant');
      if (root && root.shadowRoot) {
        const main = root.shadowRoot.querySelector('home-assistant-main');
        if (main && main.shadowRoot) {
          const panel = main.shadowRoot.querySelector('ha-panel-lovelace');
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
  _bindCardTypeSelector(container, section) {
    const useHaPickerBtn = container.querySelector('#use-ha-picker');
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
    const searchInput = container.querySelector('#card-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        container.querySelectorAll('.card-type-btn').forEach(btn => {
          const name = btn.querySelector('.card-name')?.textContent?.toLowerCase() || '';
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
      
      const type = cardBtn.dataset.type;
      const config = this._getDefaultCardConfig(type);
      this._addCardConfig(section, config);
      this._closeSubEditor();
    });
    
    // Добавление кастомной карточки вручную
    const addCustomBtn = container.querySelector('#add-custom-card');
    if (addCustomBtn) {
      addCustomBtn.addEventListener('click', () => {
        const input = container.querySelector('#custom-card-type');
        const type = input?.value?.trim();
        if (type) {
          this._addCardConfig(section, { type: this._normalizeCardType(type) });
          this._closeSubEditor();
        }
      });
      
      // Enter для добавления
      const customInput = container.querySelector('#custom-card-type');
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
  _getDefaultCardConfig(type) {
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
  async _showCardEditor(container, cardConfig, section, index) {
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
    const editorSlot = container.querySelector('#code-editor-slot');
    let codeEditor = null;
    
    // Пробуем использовать ha-code-editor (встроенный в HA)
    if (customElements.get('ha-code-editor')) {
      codeEditor = document.createElement('ha-code-editor');
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
    const saveBtn = container.querySelector('[data-action="save-inline"]');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        try {
          let value = '';
          if (codeEditor) {
            value = codeEditor.value;
          } else {
            const textarea = container.querySelector('.yaml-fallback-editor');
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
          alert('Ошибка парсинга YAML: ' + e.message);
        }
      });
    }
    
    // Отмена
    const cancelBtn = container.querySelector('[data-action="cancel-inline"]');
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
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="carousel_autoplay" 
                 name="carousel_autoplay"
                 ${this._config.carousel_autoplay ? 'checked' : ''}>
          <label for="carousel_autoplay">Автовоспроизведение</label>
        </div>
        
        <div class="field">
          <label for="carousel_interval">Интервал (мс)</label>
          <input type="number" 
                 id="carousel_interval" 
                 name="carousel_interval"
                 value="${this._config.carousel_interval || DEFAULTS.carousel_interval}" 
                 min="1000" 
                 max="60000">
        </div>
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
      .map(([name, value]) => `${name}: ${value.trim()};`)
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
        message: error.message || 'Configuration validation failed'
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
  _addCardConfig(section, cardConfig) {
    if (!this._config[section]) {
      this._config[section] = { cards: [] };
    }
    if (!this._config[section].cards) {
      this._config[section].cards = [];
    }
    
    this._config[section].cards.push(cardConfig);
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
  _updateCardConfig(section, index, newConfig) {
    if (this._config[section]?.cards?.[index]) {
      this._config[section].cards[index] = newConfig;
      this._pushHistory(this._config);
      this._fireConfigChangedAndRender();
    }
  }
  
  /**
   * Delete card from section
   * 
   * @private
   * @param {string} section - Section name
   * @param {number} index - Card index
   */
  _deleteCard(section, index) {
    if (this._config[section]?.cards) {
      this._config[section].cards.splice(index, 1);
      this._pushHistory(this._config);
      this._fireConfigChangedAndRender();
    }
  }

  /**
   * Move a card within a section
   *
   * @private
   * @param {string} section - Section name
   * @param {number} fromIndex - Source index
   * @param {number} toIndex - Target index
   */
  _moveCard(section, fromIndex, toIndex) {
    const cards = this._config[section]?.cards;
    if (!Array.isArray(cards)) return;
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= cards.length) return;
    if (toIndex < 0 || toIndex >= cards.length) return;

    const nextCards = [...cards];
    const [moved] = nextCards.splice(fromIndex, 1);
    nextCards.splice(toIndex, 0, moved);

    this._config = {
      ...this._config,
      [section]: {
        ...(this._config[section] || {}),
        cards: nextCards
      }
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
  _openCardEditor(section, index) {
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
  _openInlineEditor(section, index) {
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
  async _initInlineEditor(section, index) {
    const container = this.shadowRoot.getElementById(`inline-editor-${section}-${index}`);
    if (!container) return;
    
    const cards = section === 'header' 
      ? (this._config.header?.cards || [])
      : (this._config.body?.cards || []);
    
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
  _addCard(section) {
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
    this.shadowRoot.querySelectorAll('.tab-item').forEach(item => {
      item.addEventListener('click', () => {
        if (this._showSubEditor) {
          this._closeSubEditor();
        }
        this._activeSection = item.dataset.section;
        this._render();
      });
    });
    
    // Toolbar actions
    this.shadowRoot.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => this._handleToolbarAction(btn.dataset.action));
    });
    
    // Form inputs - используем input для мгновенного обновления текстовых полей
    this.shadowRoot.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
      input.addEventListener('input', (e) => this._handleInputChange(e));
    });
    
    // Checkboxes и selects - используем change
    this.shadowRoot.querySelectorAll('input[type="checkbox"], select').forEach(input => {
      input.addEventListener('change', (e) => this._handleInputChange(e));
    });
    
    // Add card buttons
    this.shadowRoot.querySelectorAll('[data-action="add-header-card"]').forEach(btn => {
      btn.addEventListener('click', () => this._addCard('header'));
    });
    
    this.shadowRoot.querySelectorAll('[data-action="add-body-card"]').forEach(btn => {
      btn.addEventListener('click', () => this._addCard('body'));
    });
    
    // Edit/Delete card buttons (old style)
    this.shadowRoot.querySelectorAll('[data-action="edit-card"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const index = parseInt(btn.dataset.index, 10);
        this._openCardEditor(section, index);
      });
    });
    
    // Inline edit card
    this.shadowRoot.querySelectorAll('[data-action="edit-card-inline"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const section = btn.dataset.section;
        const index = parseInt(btn.dataset.index, 10);
        this._openInlineEditor(section, index);
      });
    });
    
    this.shadowRoot.querySelectorAll('[data-action="delete-card"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        const index = parseInt(btn.dataset.index, 10);
        if (confirm('Удалить карточку?')) {
          this._deleteCard(section, index);
        }
      });
    });

    this.shadowRoot.querySelectorAll('[data-action="move-card"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const section = btn.dataset.section;
        const index = parseInt(btn.dataset.index, 10);
        const direction = btn.dataset.direction;
        const nextIndex = direction === 'up' ? index - 1 : index + 1;
        this._moveCard(section, index, nextIndex);
      });
    });
    
    // Close sub-editor button
    this.shadowRoot.querySelectorAll('[data-action="close-sub-editor"]').forEach(btn => {
      btn.addEventListener('click', () => this._closeSubEditor());
    });
    
    // Tab editor inputs (immutable)
    this.shadowRoot.querySelectorAll('[data-tab-index]').forEach(input => {
      input.addEventListener('input', (e) => {
        const index = parseInt(e.target.dataset.tabIndex, 10);
        const field = e.target.dataset.field;
        const currentTabs = this._config.tabs ? [...this._config.tabs] : [];
        if (!currentTabs[index]) currentTabs[index] = {};
        currentTabs[index] = { ...currentTabs[index], [field]: e.target.value };
        this._config = { ...this._config, tabs: currentTabs };
        this._fireConfigChanged();
      });
    });
    
    // Add tab button (immutable)
    this.shadowRoot.querySelectorAll('[data-action="add-tab"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTabs = this._config.tabs ? [...this._config.tabs] : [];
        currentTabs.push({ label: `Вкладка ${currentTabs.length + 1}` });
        this._config = { ...this._config, tabs: currentTabs };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });
    
    // Delete tab button (immutable)
    this.shadowRoot.querySelectorAll('[data-action="delete-tab"]').forEach(btn => {
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
    this.shadowRoot.querySelectorAll('.feature-group-header[data-toggle]').forEach(header => {
      header.addEventListener('click', () => {
        const group = header.closest('.feature-group');
        group.classList.toggle('expanded');
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
    const items = this.shadowRoot.querySelectorAll('.cards-list .card-item:not(.editing)');

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
        if (this._dragState.section !== targetSection) return;

        this._moveCard(targetSection, this._dragState.index, targetIndex);
      });

      item.addEventListener('dragend', () => {
        this._dragState = null;
        this.shadowRoot.querySelectorAll('.card-item.dragging, .card-item.drop-target').forEach((el) => {
          el.classList.remove('dragging', 'drop-target');
        });
      });

      item.addEventListener('keydown', (event) => {
        if (!event.altKey) return;
        if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

        const section = item.dataset.section;
        const index = parseInt(item.dataset.index, 10);
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
    this.shadowRoot.querySelectorAll('[data-action="add-visibility-condition"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const scope = btn.dataset.scope || 'global';
        const typeSelect = this.shadowRoot.querySelector(`.condition-type-select[data-visibility-scope="${scope}"]`);
        const type = typeSelect?.value;
        if (!type) return;

        const current = this._getVisibilityConditionsByScope(scope);
        const next = [...current, { condition: type }];
        this._setVisibilityConditionsByScope(scope, next, true);
      });
    });

    this.shadowRoot.querySelectorAll('[data-action="delete-condition"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const scope = btn.dataset.scope || 'global';
        const index = parseInt(btn.dataset.index, 10);
        if (Number.isNaN(index)) return;

        const current = this._getVisibilityConditionsByScope(scope);
        const next = current.filter((_, i) => i !== index);
        this._setVisibilityConditionsByScope(scope, next, true);
      });
    });

    this.shadowRoot.querySelectorAll('.condition-item').forEach(item => {
      const scope = item.dataset.scope || 'global';
      const index = parseInt(item.dataset.index, 10);
      if (Number.isNaN(index)) return;

      item.querySelectorAll('.cond-field, .cond-operator, .cond-weekday, .cond-checkbox input').forEach(field => {
        field.addEventListener('change', () => {
          this._updateConditionField(scope, index, item);
        });
        if (field.tagName === 'INPUT' && field.type !== 'checkbox') {
          field.addEventListener('input', () => {
            this._updateConditionField(scope, index, item);
          });
        }
      });
    });
  }
  
  /**
   * Update condition field (immutable)
   * @private
   */
  _updateConditionField(scope, index, item) {
    const currentConditions = this._getVisibilityConditionsByScope(scope);
    if (!currentConditions[index]) return;

    const oldCondition = currentConditions[index];
    const type = item.dataset.type;
    let newCondition = { ...oldCondition };
    
    switch (type) {
      case 'state':
        const entity = item.querySelector('[data-field="entity"]')?.value;
        const operator = item.querySelector('[data-field="operator"]')?.value;
        const state = item.querySelector('[data-field="state"]')?.value;
        newCondition.entity = entity;
        if (operator === 'neq') {
          newCondition.state_not = state;
          delete newCondition.state;
        } else {
          newCondition.state = state;
          delete newCondition.state_not;
        }
        break;
        
      case 'numeric_state':
        newCondition.entity = item.querySelector('[data-field="entity"]')?.value;
        const above = item.querySelector('[data-field="above"]')?.value;
        const below = item.querySelector('[data-field="below"]')?.value;
        newCondition.above = above ? parseFloat(above) : undefined;
        newCondition.below = below ? parseFloat(below) : undefined;
        break;
        
      case 'user':
        const usersStr = item.querySelector('[data-field="users"]')?.value || '';
        newCondition.users = usersStr.split(',').map(u => u.trim()).filter(u => u);
        newCondition.is_admin = item.querySelector('[data-field="is_admin"]')?.checked;
        break;
        
      case 'time':
        newCondition.after = item.querySelector('[data-field="after"]')?.value || undefined;
        newCondition.before = item.querySelector('[data-field="before"]')?.value || undefined;
        const weekdaySelect = item.querySelector('[data-field="weekday"]');
        newCondition.weekday = weekdaySelect ? Array.from(weekdaySelect.selectedOptions).map(o => o.value) : undefined;
        break;
        
      case 'screen':
        const minW = item.querySelector('[data-field="min_width"]')?.value;
        const maxW = item.querySelector('[data-field="max_width"]')?.value;
        newCondition.min_width = minW ? parseInt(minW, 10) : undefined;
        newCondition.max_width = maxW ? parseInt(maxW, 10) : undefined;
        break;
    }
    
    const nextConditions = [...currentConditions];
    nextConditions[index] = newCondition;
    this._setVisibilityConditionsByScope(scope, nextConditions, false);
  }

  /**
   * Get visibility conditions by scope
   * @private
   * @param {string} scope - global | section:header | section:body | section:footer
   * @returns {Array<Object>}
   */
  _getVisibilityConditionsByScope(scope) {
    if (scope === 'global') {
      return this._config.visibility ? [...this._config.visibility] : [];
    }

    const section = scope.split(':')[1];
    if (!section || !['header', 'body', 'footer'].includes(section)) {
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
  _setVisibilityConditionsByScope(scope, conditions, rerender) {
    if (scope === 'global') {
      this._config = {
        ...this._config,
        visibility: conditions
      };
    } else {
      const section = scope.split(':')[1];
      if (!section || !['header', 'body', 'footer'].includes(section)) return;
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
      const tokens = {};
      this.shadowRoot.querySelectorAll('.theme-token-item').forEach((item) => {
        const name = item.querySelector('.token-name')?.value?.trim();
        const value = item.querySelector('.token-value')?.value?.trim();
        if (!name || !value) return;
        if (!tokenNameRegex.test(name)) return;
        tokens[name] = value;
      });

      this._config = {
        ...this._config,
        theme_tokens: tokens
      };
      this._fireConfigChanged();
    };

    const addBtn = this.shadowRoot.querySelector('[data-action="add-theme-token"]');
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

    this.shadowRoot.querySelectorAll('[data-action="delete-theme-token"]').forEach((btn) => {
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

    this.shadowRoot.querySelectorAll('.theme-token-item .token-name, .theme-token-item .token-value').forEach((input) => {
      input.addEventListener('input', () => updateTokensFromDom());
      input.addEventListener('change', () => updateTokensFromDom());
    });
  }
  
  /**
   * Bind state styles events (immutable)
   * @private
   */
  _bindStateStyles() {
    // Entity input
    const entityInput = this.shadowRoot.querySelector('#state_styles_entity');
    if (entityInput) {
      entityInput.addEventListener('input', (e) => {
        this._config = { ...this._config, state_styles_entity: e.target.value };
        this._fireConfigChanged();
      });
    }
    
    // Add state style
    const addBtn = this.shadowRoot.querySelector('[data-action="add-state-style"]');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const currentStyles = this._config.state_styles ? { ...this._config.state_styles } : {};
        const newState = `state_${Object.keys(currentStyles).length + 1}`;
        currentStyles[newState] = { background: '', color: '' };
        this._config = { ...this._config, state_styles: currentStyles };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    }
    
    // Delete state style
    this.shadowRoot.querySelectorAll('[data-action="delete-state-style"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.dataset.state;
        if (this._config.state_styles && this._config.state_styles[state]) {
          const newStyles = { ...this._config.state_styles };
          delete newStyles[state];
          this._config = { ...this._config, state_styles: newStyles };
          this._pushHistory(this._config);
          this._fireConfigChangedAndRender();
        }
      });
    });
    
    // State style field changes
    this.shadowRoot.querySelectorAll('.state-style-item').forEach(item => {
      const oldState = item.dataset.state;
      
      item.querySelector('.state-key')?.addEventListener('change', (e) => {
        const newState = e.target.value;
        if (newState && newState !== oldState && this._config.state_styles) {
          const newStyles = { ...this._config.state_styles };
          newStyles[newState] = { ...newStyles[oldState] };
          delete newStyles[oldState];
          this._config = { ...this._config, state_styles: newStyles };
          this._fireConfigChanged();
        }
      });
      
      item.querySelectorAll('.style-field').forEach(field => {
        field.addEventListener('input', () => {
          const state = item.querySelector('.state-key')?.value || oldState;
          const styleKey = field.dataset.style;
          if (this._config.state_styles && this._config.state_styles[state]) {
            const newStyles = { ...this._config.state_styles };
            newStyles[state] = { ...newStyles[state], [styleKey]: field.value };
            this._config = { ...this._config, state_styles: newStyles };
            this._fireConfigChanged();
          }
        });
      });
    });
    
    // Presets
    this.shadowRoot.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        this._applyStateStylePreset(preset);
      });
    });
  }
  
  /**
   * Apply state style preset
   * @private
   */
  _applyStateStylePreset(preset) {
    const presets = {
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
    
    if (presets[preset]) {
      this._config = { ...this._config, state_styles: JSON.parse(JSON.stringify(presets[preset])) };
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
    this.shadowRoot.querySelectorAll('.expand-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const trigger = btn.dataset.trigger;
        let newConfig = { ...this._config, expand_trigger: trigger };
        
        // Очищаем action для нового триггера (он будет использоваться для expand)
        const triggerActionKey = trigger === 'double_tap' ? 'double_tap_action' : `${trigger}_action`;
        if (trigger !== 'none' && newConfig[triggerActionKey]) {
          newConfig = { ...newConfig };
          delete newConfig[triggerActionKey];
        }
        
        this._config = newConfig;
        
        // Обновляем UI
        this.shadowRoot.querySelectorAll('.expand-trigger-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    });
    
    // Action type selects
    this.shadowRoot.querySelectorAll('.action-type-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const actionKey = e.target.dataset.actionKey;
        const action = e.target.value;
        
        let newAction = this._config[actionKey] ? { ...this._config[actionKey] } : {};
        newAction.action = action === 'none' ? undefined : action;
        
        // Очищаем лишние поля
        if (action !== 'call-service') delete newAction.service;
        if (action !== 'navigate') delete newAction.navigation_path;
        if (action !== 'url') delete newAction.url_path;
        
        this._config = { ...this._config, [actionKey]: newAction };
        this._fireConfigChangedAndRender();
      });
    });
    
    this.shadowRoot.querySelectorAll('.action-extra-field').forEach(input => {
      input.addEventListener('input', (e) => {
        const actionKey = e.target.dataset.actionKey;
        const field = e.target.dataset.field;
        
        const newAction = this._config[actionKey] ? { ...this._config[actionKey] } : {};
        newAction[field] = e.target.value;
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
    const enabledCheckbox = this.shadowRoot.querySelector('#swipe_enabled');
    if (enabledCheckbox) {
      enabledCheckbox.addEventListener('change', (e) => {
        const newSwipe = this._config.swipe ? { ...this._config.swipe } : {};
        newSwipe.enabled = e.target.checked;
        this._config = { ...this._config, swipe: newSwipe };
        this._fireConfigChanged();
      });
    }
    
    const directionSelect = this.shadowRoot.querySelector('#swipe_direction');
    if (directionSelect) {
      directionSelect.addEventListener('change', (e) => {
        const newSwipe = this._config.swipe ? { ...this._config.swipe } : {};
        newSwipe.direction = e.target.value;
        this._config = { ...this._config, swipe: newSwipe };
        this._fireConfigChanged();
      });
    }
    
    ['left', 'right'].forEach(dir => {
      const select = this.shadowRoot.querySelector(`#swipe_${dir}_action`);
      if (select) {
        select.addEventListener('change', (e) => {
          const newSwipe = this._config.swipe ? { ...this._config.swipe } : {};
          if (e.target.value) {
            newSwipe[`swipe_${dir}`] = { action: e.target.value };
          } else {
            delete newSwipe[`swipe_${dir}`];
          }
          this._config = { ...this._config, swipe: newSwipe };
          this._fireConfigChanged();
        });
      }
    });
  }
  
  /**
   * Bind badges events (immutable)
   * @private
   */
  _bindBadges() {
    // Add badge
    const addBtn = this.shadowRoot.querySelector('[data-action="add-badge"]');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const currentBadges = this._config.badges ? [...this._config.badges] : [];
        currentBadges.push({ entity: '', icon: '', color: '' });
        this._config = { ...this._config, badges: currentBadges };
        this._pushHistory(this._config);
        this._fireConfigChangedAndRender();
      });
    }
    
    // Delete badge
    this.shadowRoot.querySelectorAll('[data-action="delete-badge"]').forEach(btn => {
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
    
    // Badge field changes
    this.shadowRoot.querySelectorAll('.badge-item').forEach(item => {
      const index = parseInt(item.dataset.index, 10);
      
      item.querySelectorAll('.badge-field').forEach(field => {
        field.addEventListener('input', () => {
          if (this._config.badges && this._config.badges[index]) {
            const fieldName = field.dataset.field;
            const newBadges = [...this._config.badges];
            newBadges[index] = { ...newBadges[index], [fieldName]: field.value };
            this._config = { ...this._config, badges: newBadges };
            this._fireConfigChanged();
          }
        });
      });
    });
  }
  
  /**
   * Bind animation presets events (immutable)
   * @private
   */
  _bindAnimationPresets() {
    // Animation type buttons (expand/collapse/cards)
    this.shadowRoot.querySelectorAll('.animation-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.animationType;
        const animation = btn.dataset.animation;
        
        if (type === 'expand') {
          this._config = { ...this._config, expand_animation: animation };
          this.shadowRoot.querySelectorAll('.animation-btn[data-animation-type="expand"]')
            .forEach(b => b.classList.remove('active'));
        } else if (type === 'collapse') {
          this._config = { ...this._config, collapse_animation: animation };
          this.shadowRoot.querySelectorAll('.animation-btn[data-animation-type="collapse"]')
            .forEach(b => b.classList.remove('active'));
        } else if (type === 'cards') {
          this._config = { ...this._config, cards_animation: animation };
          this.shadowRoot.querySelectorAll('.animation-btn[data-animation-type="cards"]')
            .forEach(b => b.classList.remove('active'));
        }
        
        btn.classList.add('active');
        this._fireConfigChanged();
      });
    });
    
    // Duration slider
    const durationSlider = this.shadowRoot.querySelector('#animation_duration_slider');
    if (durationSlider) {
      durationSlider.addEventListener('input', (e) => {
        this._config = { ...this._config, animation_duration: parseInt(e.target.value, 10) };
        const valueDisplay = this.shadowRoot.querySelector('.duration-value');
        if (valueDisplay) {
          valueDisplay.textContent = `${e.target.value}ms`;
        }
        this._fireConfigChanged();
      });
    }
    
    // Cards stagger slider
    const staggerSlider = this.shadowRoot.querySelector('#cards_stagger_slider');
    if (staggerSlider) {
      staggerSlider.addEventListener('input', (e) => {
        this._config = { ...this._config, cards_stagger: parseInt(e.target.value, 10) };
        const valueDisplay = this.shadowRoot.querySelector('.stagger-value');
        if (valueDisplay) {
          valueDisplay.textContent = `${e.target.value}ms`;
        }
        this._fireConfigChanged();
      });
    }
    
    // Cards direction buttons
    this.shadowRoot.querySelectorAll('.direction-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const direction = btn.dataset.direction;
        this._config = { ...this._config, cards_direction: direction };
        
        this.shadowRoot.querySelectorAll('.direction-btn')
          .forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this._fireConfigChanged();
      });
    });
    
    // Preview button
    const previewBtn = this.shadowRoot.querySelector('[data-action="preview-animation"]');
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
    const preview = this.shadowRoot.querySelector('.preview-card');
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
  _handleToolbarAction(action) {
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
  _handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    
    if (!name) return;
    
    // Создаём НОВЫЙ конфиг иммутабельно (избегаем ошибки readonly)
    const keys = name.split('.');
    const newValue = type === 'checkbox' ? checked 
      : type === 'number' ? (value !== '' ? parseInt(value, 10) : null)
      : value;
    
    // Рекурсивно создаём новый объект с обновлённым значением
    this._config = this._setNestedValue(this._config, keys, newValue);
    this._fireConfigChanged();
  }
  
  /**
   * Immutably set a nested value in an object
   * @private
   * @param {Object} obj - Source object
   * @param {Array<string>} keys - Path to the value
   * @param {*} value - New value
   * @returns {Object} New object with updated value
   */
  _setNestedValue(obj, keys, value) {
    // Создаём копию объекта (или пустой объект если null/undefined)
    const copy = obj ? { ...obj } : {};
    
    if (keys.length === 1) {
      copy[keys[0]] = value;
      return copy;
    }
    
    const [first, ...rest] = keys;
    copy[first] = this._setNestedValue(copy[first], rest, value);
    return copy;
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
      
      .icon-picker-wrapper input {
        flex: 1;
      }
      
      .icon-preview {
        --mdc-icon-size: 24px;
        color: var(--editor-text);
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
      
      .cond-field {
        padding: 6px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 13px;
        min-width: 100px;
        flex: 1;
      }
      
      .cond-field.cond-small {
        max-width: 80px;
        flex: 0;
      }
      
      .cond-operator {
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
        background: var(--editor-surface);
      }
      
      .cond-weekday {
        padding: 4px;
        font-size: 11px;
        max-width: 120px;
      }
      
      .cond-checkbox {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        white-space: nowrap;
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
      
      /* Swipe Gestures */
      .swipe-actions-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }
      
      .swipe-action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }
      
      .swipe-action-item ha-icon {
        --mdc-icon-size: 28px;
        color: var(--editor-primary);
      }
      
      .swipe-action-item select {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
      }
      
      /* Badges */
      .badges-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .badge-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }
      
      .badge-field {
        flex: 1;
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
      }
      
      .badge-field.badge-small {
        max-width: 80px;
        flex: 0;
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
        
        .swipe-actions-grid {
          grid-template-columns: 1fr;
        }

        .theme-token-item {
          grid-template-columns: 1fr;
        }

        .live-preview-header-row {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    `;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default UniversalCardEditor;
