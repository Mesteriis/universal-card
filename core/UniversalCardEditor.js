/**
 * Universal Card - Visual Editor
 * 
 * GUI editor for configuring Universal Card in Lovelace UI.
 * Integrated with Home Assistant's built-in card editor.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module core/UniversalCardEditor
 */

import { BODY_MODES, THEMES, DEFAULTS, VALID_BODY_MODES } from './constants.js';
import { ConfigManager } from './config.js';
import { fireEvent, deepClone } from '../utils/helpers.js';

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
    this._hass = hass;
    this._render();
  }
  
  /**
   * Set configuration
   * 
   * @param {Object} config - Card configuration
   */
  setConfig(config) {
    this._config = deepClone(config);
    this._pushHistory(config);
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
    this.shadowRoot.innerHTML = `
      <style>${this._getStyles()}</style>
      <div class="editor">
        ${this._renderToolbar()}
        <div class="editor-content">
          ${this._renderSidebar()}
          <div class="editor-main">
            ${this._renderSection(this._activeSection)}
          </div>
        </div>
      </div>
    `;
    
    this._bindEvents();
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
          <button class="toolbar-btn" data-action="undo" ${canUndo ? '' : 'disabled'}>
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button class="toolbar-btn" data-action="redo" ${canRedo ? '' : 'disabled'}>
            <ha-icon icon="mdi:redo"></ha-icon>
          </button>
          <button class="toolbar-btn" data-action="reset">
            <ha-icon icon="mdi:restore"></ha-icon>
          </button>
        </div>
      </div>
    `;
  }
  
  /**
   * Render sidebar with section navigation
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderSidebar() {
    const sections = [
      { id: SECTIONS.BASIC, icon: 'mdi:cog', label: 'Основные' },
      { id: SECTIONS.HEADER, icon: 'mdi:page-layout-header', label: 'Заголовок' },
      { id: SECTIONS.BODY, icon: 'mdi:card-text-outline', label: 'Содержимое' },
      { id: SECTIONS.STYLE, icon: 'mdi:palette', label: 'Стиль' },
      { id: SECTIONS.FEATURES, icon: 'mdi:tune', label: 'Функции' },
      { id: SECTIONS.ADVANCED, icon: 'mdi:code-tags', label: 'Расширенные' }
    ];
    
    return `
      <div class="sidebar">
        ${sections.map(section => `
          <button class="sidebar-item ${this._activeSection === section.id ? 'active' : ''}" 
                  data-section="${section.id}">
            <ha-icon icon="${section.icon}"></ha-icon>
            <span>${section.label}</span>
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
    return `
      <div class="section">
        <h3>Основные настройки</h3>
        
        <div class="field">
          <label for="title">Заголовок</label>
          <input type="text" 
                 id="title" 
                 name="title"
                 value="${this._config.title || ''}" 
                 placeholder="Название карточки">
        </div>
        
        <div class="field">
          <label for="subtitle">Подзаголовок</label>
          <input type="text" 
                 id="subtitle" 
                 name="subtitle"
                 value="${this._config.subtitle || ''}" 
                 placeholder="Дополнительный текст">
        </div>
        
        <div class="field">
          <label for="icon">Иконка</label>
          <input type="text" 
                 id="icon" 
                 name="icon"
                 value="${this._config.icon || ''}" 
                 placeholder="mdi:home">
        </div>
        
        <div class="field">
          <label for="entity">Entity (опционально)</label>
          <input type="text" 
                 id="entity" 
                 name="entity"
                 value="${this._config.entity || ''}" 
                 placeholder="light.room">
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
                 value="${this._config.expand_icon || DEFAULTS.expand_icon}" 
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
          <p class="hint">Добавьте карточки для отображения в заголовке</p>
          
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
                     value="${this._config.grid?.gap || DEFAULTS.grid_gap}" 
                     placeholder="16px">
            </div>
          </div>
        </div>
        
        <div class="subsection">
          <h4>Карточки в body</h4>
          
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
        
        <div class="theme-preview" style="${this._getThemePreviewStyle()}">
          <div class="preview-header">Preview</div>
          <div class="preview-body">Содержимое</div>
        </div>
        
        <div class="field">
          <label for="border_radius">Скругление углов</label>
          <input type="text" 
                 id="border_radius" 
                 name="border_radius"
                 value="${this._config.border_radius || DEFAULTS.border_radius}" 
                 placeholder="12px">
        </div>
        
        <div class="field">
          <label for="padding">Внутренние отступы</label>
          <input type="text" 
                 id="padding" 
                 name="padding"
                 value="${this._config.padding || DEFAULTS.padding}" 
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
   * Render features settings section
   * 
   * @private
   * @returns {string} HTML string
   */
  _renderFeaturesSection() {
    return `
      <div class="section">
        <h3>Функции</h3>
        
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
          <label for="remember_state">Запоминать состояние (expanded/collapsed)</label>
        </div>
        
        <div class="subsection">
          <h4>Автоматическое сворачивание</h4>
          
          <div class="field">
            <label for="auto_collapse_after">Сворачивать через (сек, 0 - отключено)</label>
            <input type="number" 
                   id="auto_collapse_after" 
                   name="auto_collapse_after"
                   value="${this._config.auto_collapse_after || 0}" 
                   min="0" 
                   max="3600">
          </div>
        </div>
        
        <div class="subsection">
          <h4>Skeleton Loader</h4>
          
          <div class="field">
            <label for="skeleton_count">Количество скелетонов</label>
            <input type="number" 
                   id="skeleton_count" 
                   name="skeleton_count"
                   value="${this._config.skeleton_count || DEFAULTS.skeleton_count}" 
                   min="1" 
                   max="10">
          </div>
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
                 value="${this._config.card_id || ''}" 
                 placeholder="Авто-генерируется если пусто">
        </div>
        
        <div class="subsection">
          <h4>YAML Preview</h4>
          <pre class="yaml-preview">${this._getYamlPreview()}</pre>
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
    if (!cards.length) {
      return '<div class="empty-state">Нет карточек</div>';
    }
    
    return cards.map((card, index) => `
      <div class="card-item" data-section="${section}" data-index="${index}">
        <div class="card-item-content">
          <ha-icon icon="mdi:drag-vertical"></ha-icon>
          <span class="card-type">${card.type || 'unknown'}</span>
          ${card.entity ? `<span class="card-entity">${card.entity}</span>` : ''}
        </div>
        <div class="card-item-actions">
          <button class="btn-icon" data-action="edit-card">
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button class="btn-icon" data-action="delete-card">
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      </div>
    `).join('');
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
              <input type="text" value="${tab.label || ''}" placeholder="Название вкладки">
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
      [THEMES.SOLID]: 'Обычная',
      [THEMES.GLASS]: 'Стекло',
      [THEMES.GLASSMORPHISM]: 'Glassmorphism',
      [THEMES.NEUMORPHISM]: 'Neumorphism',
      [THEMES.MINIMAL]: 'Минимализм',
      [THEMES.GRADIENT]: 'Градиент',
      [THEMES.DARK]: 'Тёмная',
      [THEMES.NEON]: 'Неон',
      [THEMES.AURORA]: 'Аврора'
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
    // Generate preview styles based on theme
    return '';
  }
  
  /**
   * Get YAML preview of current config
   * 
   * @private
   * @returns {string} YAML string
   */
  _getYamlPreview() {
    // Simple YAML-like representation
    const lines = ['type: custom:universal-card'];
    
    const addLine = (key, value, indent = 0) => {
      const prefix = '  '.repeat(indent);
      if (typeof value === 'object' && value !== null) {
        lines.push(`${prefix}${key}:`);
        Object.entries(value).forEach(([k, v]) => addLine(k, v, indent + 1));
      } else if (value !== undefined && value !== null && value !== '') {
        lines.push(`${prefix}${key}: ${value}`);
      }
    };
    
    ['title', 'icon', 'entity', 'body_mode', 'expanded'].forEach(key => {
      if (this._config[key] !== undefined) {
        addLine(key, this._config[key]);
      }
    });
    
    return lines.join('\n');
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
    // Sidebar navigation
    this.shadowRoot.querySelectorAll('.sidebar-item').forEach(item => {
      item.addEventListener('click', () => {
        this._activeSection = item.dataset.section;
        this._render();
      });
    });
    
    // Toolbar actions
    this.shadowRoot.querySelectorAll('.toolbar-btn').forEach(btn => {
      btn.addEventListener('click', () => this._handleToolbarAction(btn.dataset.action));
    });
    
    // Form inputs
    this.shadowRoot.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('change', (e) => this._handleInputChange(e));
    });
    
    // Add buttons
    this.shadowRoot.querySelectorAll('[data-action="add-header-card"]').forEach(btn => {
      btn.addEventListener('click', () => this._addCard('header'));
    });
    
    this.shadowRoot.querySelectorAll('[data-action="add-body-card"]').forEach(btn => {
      btn.addEventListener('click', () => this._addCard('body'));
    });
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
        this._config = { type: 'custom:universal-card' };
        this._fireConfigChanged();
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
    
    // Handle nested properties (e.g., "grid.columns")
    const keys = name.split('.');
    let config = this._config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!config[keys[i]]) {
        config[keys[i]] = {};
      }
      config = config[keys[i]];
    }
    
    const finalKey = keys[keys.length - 1];
    
    // Convert value based on input type
    if (type === 'checkbox') {
      config[finalKey] = checked;
    } else if (type === 'number') {
      config[finalKey] = parseInt(value, 10);
    } else {
      config[finalKey] = value;
    }
    
    this._pushHistory(this._config);
    this._fireConfigChanged();
  }
  
  /**
   * Add a new card
   * 
   * @private
   * @param {string} section - Section name (header/body)
   */
  _addCard(section) {
    // This would open a card picker dialog
    // For now, add a placeholder
    if (!this._config[section]) {
      this._config[section] = { cards: [] };
    }
    if (!this._config[section].cards) {
      this._config[section].cards = [];
    }
    
    this._config[section].cards.push({
      type: 'markdown',
      content: 'Новая карточка'
    });
    
    this._pushHistory(this._config);
    this._fireConfigChanged();
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
      this._fireConfigChanged();
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
      this._fireConfigChanged();
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
  _fireConfigChanged() {
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
        --editor-border: var(--divider-color, #e0e0e0);
        --editor-text: var(--primary-text-color, #212121);
        --editor-text-secondary: var(--secondary-text-color, #757575);
        --editor-primary: var(--primary-color, #03a9f4);
      }
      
      .editor {
        background: var(--editor-bg);
        border-radius: 8px;
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
        font-weight: 500;
      }
      
      .toolbar-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 8px;
      }
      
      .toolbar-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .toolbar-btn ha-icon {
        color: white;
        --mdc-icon-size: 20px;
      }
      
      /* Content */
      .editor-content {
        display: flex;
        min-height: 400px;
      }
      
      /* Sidebar */
      .sidebar {
        width: 160px;
        border-right: 1px solid var(--editor-border);
        padding: 8px 0;
      }
      
      .sidebar-item {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 12px 16px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--editor-text-secondary);
        text-align: left;
      }
      
      .sidebar-item:hover {
        background: rgba(0,0,0,0.04);
      }
      
      .sidebar-item.active {
        color: var(--editor-primary);
        background: rgba(3, 169, 244, 0.1);
      }
      
      .sidebar-item ha-icon {
        --mdc-icon-size: 20px;
      }
      
      /* Main */
      .editor-main {
        flex: 1;
        padding: 16px;
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
      }
      
      /* Fields */
      .field {
        margin-bottom: 16px;
      }
      
      .field label {
        display: block;
        margin-bottom: 4px;
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .field input,
      .field select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--editor-border);
        border-radius: 4px;
        font-size: 14px;
        box-sizing: border-box;
      }
      
      .field input:focus,
      .field select:focus {
        outline: none;
        border-color: var(--editor-primary);
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
        gap: 8px;
      }
      
      .checkbox-field input {
        width: auto;
      }
      
      .checkbox-field label {
        margin: 0;
        font-size: 14px;
        color: var(--editor-text);
      }
      
      /* Cards list */
      .cards-list {
        border: 1px solid var(--editor-border);
        border-radius: 4px;
        margin-bottom: 12px;
      }
      
      .card-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-bottom: 1px solid var(--editor-border);
      }
      
      .card-item:last-child {
        border-bottom: none;
      }
      
      .card-item-content {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .card-type {
        font-weight: 500;
      }
      
      .card-entity {
        color: var(--editor-text-secondary);
        font-size: 12px;
      }
      
      .empty-state {
        padding: 24px;
        text-align: center;
        color: var(--editor-text-secondary);
      }
      
      /* Buttons */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: var(--editor-primary);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .btn:hover {
        opacity: 0.9;
      }
      
      .btn-icon {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--editor-text-secondary);
      }
      
      .btn-icon:hover {
        color: var(--editor-text);
      }
      
      /* Preview */
      .theme-preview {
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        background: var(--ha-card-background, #fff);
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
      
      .preview-header {
        font-weight: 500;
        margin-bottom: 8px;
      }
      
      .preview-body {
        color: var(--editor-text-secondary);
      }
      
      /* YAML */
      .yaml-preview {
        background: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        font-family: monospace;
        font-size: 12px;
        overflow-x: auto;
        white-space: pre-wrap;
      }
      
      .hint {
        font-size: 12px;
        color: var(--editor-text-secondary);
        margin-bottom: 12px;
      }
    `;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default UniversalCardEditor;
