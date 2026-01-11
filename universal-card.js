/**
 * Universal Card - Standalone Version
 * 
 * Простая версия для тестирования без ES modules
 * 
 * @version 1.0.0
 */

const CARD_VERSION = '1.0.0';
const CARD_NAME = 'Universal Card';
const CARD_DESCRIPTION = 'Продвинутая карточка с 7 режимами body, grid layout и расширенной настройкой';

// =============================================================================
// UNIVERSAL CARD CLASS
// =============================================================================

class UniversalCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
    this._childCards = [];
    this._expanded = false;
    this._initialized = false;
  }

  // --------------------------------------------------------------------------
  // Getters/Setters
  // --------------------------------------------------------------------------
  
  set hass(hass) {
    this._hass = hass;
    
    // Обновляем дочерние карточки
    this._childCards.forEach(card => {
      if (card) card.hass = hass;
    });
    
    // Первичный рендер
    if (!this._initialized && this._config) {
      this._initialized = true;
      this._render();
    }
  }
  
  get hass() {
    return this._hass;
  }

  // --------------------------------------------------------------------------
  // Config
  // --------------------------------------------------------------------------
  
  setConfig(config) {
    if (!config) {
      throw new Error('Конфигурация не указана');
    }
    
    this._config = {
      title: config.title || '',
      subtitle: config.subtitle || '',
      icon: config.icon || '',
      entity: config.entity || '',
      show_state: config.show_state || false,
      body_mode: config.body_mode || 'expand',
      collapsed: config.collapsed !== undefined ? config.collapsed : true,
      lazy_load: config.lazy_load !== undefined ? config.lazy_load : true,
      theme: config.theme || 'default',
      grid: config.grid || {},
      cards: config.cards || [],
      tabs: config.tabs || [],
      carousel: config.carousel || {},
      badges: config.badges || [],
      footer: config.footer || null,
      header_left: config.header_left || null,
      header_right: config.header_right || null,
      tap_action: config.tap_action || null,
      hold_action: config.hold_action || null,
      double_tap_action: config.double_tap_action || null,
      visibility: config.visibility || [],
      ...config
    };
    
    this._expanded = !this._config.collapsed;
    
    // Ре-рендер если уже инициализировано
    if (this._initialized) {
      this._render();
    }
  }
  
  getCardSize() {
    return this._expanded ? 3 : 1;
  }

  // --------------------------------------------------------------------------
  // Editor Support
  // --------------------------------------------------------------------------
  
  static getConfigElement() {
    return document.createElement('universal-card-editor');
  }
  
  static getStubConfig() {
    return {
      title: 'New Card',
      icon: 'mdi:card',
      body_mode: 'expand',
      cards: [
        {
          type: 'markdown',
          content: 'Hello World!'
        }
      ]
    };
  }

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  
  _render() {
    const config = this._config;
    const bodyMode = config.body_mode || 'expand';
    
    // Проверяем visibility
    if (!this._checkVisibility()) {
      this.shadowRoot.innerHTML = '';
      this.style.display = 'none';
      return;
    }
    this.style.display = '';
    
    // Styles
    const styles = this._getStyles();
    
    // Entity state
    let stateDisplay = '';
    if (config.entity && config.show_state && this._hass) {
      const state = this._hass.states[config.entity];
      if (state) {
        stateDisplay = `<span class="uc-state">${state.state}</span>`;
      }
    }
    
    // Header
    const headerHTML = `
      <div class="uc-header">
        <div class="uc-header-left">
          ${config.icon ? `<ha-icon class="uc-icon" icon="${config.icon}"></ha-icon>` : ''}
          <div class="uc-titles">
            ${config.title ? `<span class="uc-title">${config.title}</span>` : ''}
            ${config.subtitle ? `<span class="uc-subtitle">${config.subtitle}</span>` : ''}
          </div>
          ${stateDisplay}
        </div>
        <div class="uc-header-right">
          ${this._renderBadges()}
          ${bodyMode !== 'none' && bodyMode !== 'modal' && bodyMode !== 'fullscreen' ? `
            <ha-icon class="uc-expand-icon ${this._expanded ? 'expanded' : ''}" icon="mdi:chevron-down"></ha-icon>
          ` : ''}
        </div>
      </div>
    `;
    
    // Body
    const bodyHTML = this._renderBody();
    
    // Footer
    const footerHTML = config.footer ? `
      <div class="uc-footer">
        ${config.footer.icon ? `<ha-icon icon="${config.footer.icon}"></ha-icon>` : ''}
        <span>${config.footer.text || ''}</span>
      </div>
    ` : '';
    
    // Theme class
    const themeClass = config.theme ? `uc-theme-${config.theme}` : '';
    
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <ha-card class="uc-card ${themeClass} ${this._expanded ? 'expanded' : 'collapsed'}">
        ${headerHTML}
        ${bodyHTML}
        ${footerHTML}
      </ha-card>
    `;
    
    // Привязываем события
    this._bindEvents();
    
    // Загружаем дочерние карточки
    if (this._expanded || !config.lazy_load) {
      this._loadChildCards();
    }
  }
  
  _renderBadges() {
    if (!this._config.badges || this._config.badges.length === 0) return '';
    
    return this._config.badges.map(badge => {
      if (badge.entity && this._hass) {
        const state = this._hass.states[badge.entity];
        if (state) {
          return `<span class="uc-badge">${state.state}</span>`;
        }
      }
      return badge.text ? `<span class="uc-badge">${badge.text}</span>` : '';
    }).join('');
  }
  
  _renderBody() {
    const config = this._config;
    const bodyMode = config.body_mode || 'expand';
    
    if (bodyMode === 'none') return '';
    
    let bodyContent = '';
    
    switch (bodyMode) {
      case 'expand':
        bodyContent = `
          <div class="uc-body uc-body-expand ${this._expanded ? 'expanded' : ''}">
            <div class="uc-cards-container" id="cards-container"></div>
          </div>
        `;
        break;
        
      case 'tabs':
        const tabs = config.tabs || [];
        bodyContent = `
          <div class="uc-body uc-body-tabs ${this._expanded ? 'expanded' : ''}">
            <div class="uc-tabs-bar">
              ${tabs.map((tab, i) => `
                <button class="uc-tab ${i === 0 ? 'active' : ''}" data-tab="${i}">
                  ${tab.icon ? `<ha-icon icon="${tab.icon}"></ha-icon>` : ''}
                  <span>${tab.title || `Tab ${i + 1}`}</span>
                </button>
              `).join('')}
            </div>
            <div class="uc-tabs-content">
              ${tabs.map((tab, i) => `
                <div class="uc-tab-panel ${i === 0 ? 'active' : ''}" data-panel="${i}">
                  <div class="uc-cards-container" id="tab-cards-${i}"></div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;
        
      case 'carousel':
        const cards = config.cards || [];
        bodyContent = `
          <div class="uc-body uc-body-carousel ${this._expanded ? 'expanded' : ''}">
            <div class="uc-carousel-track" id="carousel-track">
              ${cards.map((_, i) => `
                <div class="uc-carousel-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
                  <div class="uc-cards-container" id="slide-cards-${i}"></div>
                </div>
              `).join('')}
            </div>
            ${config.carousel?.show_arrows !== false ? `
              <button class="uc-carousel-arrow uc-carousel-prev">❮</button>
              <button class="uc-carousel-arrow uc-carousel-next">❯</button>
            ` : ''}
            ${config.carousel?.show_dots !== false ? `
              <div class="uc-carousel-dots">
                ${cards.map((_, i) => `
                  <span class="uc-carousel-dot ${i === 0 ? 'active' : ''}" data-dot="${i}"></span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
        break;
        
      case 'modal':
      case 'fullscreen':
        bodyContent = `
          <div class="uc-body uc-body-${bodyMode}" id="modal-body" style="display: none;">
            <div class="uc-modal-backdrop"></div>
            <div class="uc-modal-content">
              <button class="uc-modal-close">✕</button>
              <div class="uc-cards-container" id="cards-container"></div>
            </div>
          </div>
        `;
        break;
        
      default:
        bodyContent = `
          <div class="uc-body uc-body-expand ${this._expanded ? 'expanded' : ''}">
            <div class="uc-cards-container" id="cards-container"></div>
          </div>
        `;
    }
    
    return bodyContent;
  }
  
  // --------------------------------------------------------------------------
  // Events
  // --------------------------------------------------------------------------
  
  _bindEvents() {
    const header = this.shadowRoot.querySelector('.uc-header');
    if (header) {
      header.addEventListener('click', () => this._onHeaderClick());
      
      // Hold action
      let holdTimer;
      header.addEventListener('pointerdown', () => {
        holdTimer = setTimeout(() => {
          this._executeAction(this._config.hold_action);
        }, 500);
      });
      header.addEventListener('pointerup', () => clearTimeout(holdTimer));
      header.addEventListener('pointerleave', () => clearTimeout(holdTimer));
      
      // Double tap
      let lastTap = 0;
      header.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          this._executeAction(this._config.double_tap_action);
        }
        lastTap = now;
      });
    }
    
    // Tab clicks
    this.shadowRoot.querySelectorAll('.uc-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabIndex = parseInt(e.currentTarget.dataset.tab);
        this._switchTab(tabIndex);
      });
    });
    
    // Carousel arrows
    const prevBtn = this.shadowRoot.querySelector('.uc-carousel-prev');
    const nextBtn = this.shadowRoot.querySelector('.uc-carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', () => this._carouselPrev());
    if (nextBtn) nextBtn.addEventListener('click', () => this._carouselNext());
    
    // Carousel dots
    this.shadowRoot.querySelectorAll('.uc-carousel-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.dot);
        this._goToSlide(index);
      });
    });
    
    // Modal close
    const modalClose = this.shadowRoot.querySelector('.uc-modal-close');
    const modalBackdrop = this.shadowRoot.querySelector('.uc-modal-backdrop');
    if (modalClose) modalClose.addEventListener('click', () => this._closeModal());
    if (modalBackdrop) modalBackdrop.addEventListener('click', () => this._closeModal());
    
    // Footer action
    const footer = this.shadowRoot.querySelector('.uc-footer');
    if (footer && this._config.footer?.tap_action) {
      footer.style.cursor = 'pointer';
      footer.addEventListener('click', () => {
        this._executeAction(this._config.footer.tap_action);
      });
    }
  }
  
  _onHeaderClick() {
    const bodyMode = this._config.body_mode || 'expand';
    
    if (this._config.tap_action) {
      this._executeAction(this._config.tap_action);
      return;
    }
    
    if (bodyMode === 'modal' || bodyMode === 'fullscreen') {
      this._openModal();
    } else if (bodyMode !== 'none') {
      this._toggle();
    }
  }
  
  _toggle() {
    this._expanded = !this._expanded;
    
    const body = this.shadowRoot.querySelector('.uc-body');
    const expandIcon = this.shadowRoot.querySelector('.uc-expand-icon');
    const card = this.shadowRoot.querySelector('.uc-card');
    
    if (body) body.classList.toggle('expanded', this._expanded);
    if (expandIcon) expandIcon.classList.toggle('expanded', this._expanded);
    if (card) {
      card.classList.toggle('expanded', this._expanded);
      card.classList.toggle('collapsed', !this._expanded);
    }
    
    // Lazy load
    if (this._expanded && this._config.lazy_load) {
      this._loadChildCards();
    }
  }
  
  _openModal() {
    const modalBody = this.shadowRoot.querySelector('#modal-body');
    if (modalBody) {
      modalBody.style.display = 'flex';
      this._loadChildCards();
      
      // Escape key
      this._escHandler = (e) => {
        if (e.key === 'Escape') this._closeModal();
      };
      document.addEventListener('keydown', this._escHandler);
    }
  }
  
  _closeModal() {
    const modalBody = this.shadowRoot.querySelector('#modal-body');
    if (modalBody) {
      modalBody.style.display = 'none';
    }
    if (this._escHandler) {
      document.removeEventListener('keydown', this._escHandler);
    }
  }
  
  _switchTab(index) {
    // Update tab buttons
    this.shadowRoot.querySelectorAll('.uc-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });
    
    // Update panels
    this.shadowRoot.querySelectorAll('.uc-tab-panel').forEach((panel, i) => {
      panel.classList.toggle('active', i === index);
    });
    
    // Load cards for this tab if needed
    this._loadTabCards(index);
  }
  
  _carouselPrev() {
    const track = this.shadowRoot.querySelector('.uc-carousel-track');
    const slides = track?.querySelectorAll('.uc-carousel-slide');
    if (!slides) return;
    
    const current = Array.from(slides).findIndex(s => s.classList.contains('active'));
    const prev = current > 0 ? current - 1 : slides.length - 1;
    this._goToSlide(prev);
  }
  
  _carouselNext() {
    const track = this.shadowRoot.querySelector('.uc-carousel-track');
    const slides = track?.querySelectorAll('.uc-carousel-slide');
    if (!slides) return;
    
    const current = Array.from(slides).findIndex(s => s.classList.contains('active'));
    const next = current < slides.length - 1 ? current + 1 : 0;
    this._goToSlide(next);
  }
  
  _goToSlide(index) {
    const slides = this.shadowRoot.querySelectorAll('.uc-carousel-slide');
    const dots = this.shadowRoot.querySelectorAll('.uc-carousel-dot');
    
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }
  
  // --------------------------------------------------------------------------
  // Actions
  // --------------------------------------------------------------------------
  
  _executeAction(action) {
    if (!action || action.action === 'none') return;
    
    const hass = this._hass;
    if (!hass) return;
    
    switch (action.action) {
      case 'more-info':
        const event = new CustomEvent('hass-more-info', {
          bubbles: true,
          composed: true,
          detail: { entityId: action.entity || this._config.entity }
        });
        this.dispatchEvent(event);
        break;
        
      case 'toggle':
        const entity = action.entity || this._config.entity;
        if (entity) {
          hass.callService('homeassistant', 'toggle', { entity_id: entity });
        }
        break;
        
      case 'call-service':
        if (action.service) {
          const [domain, service] = action.service.split('.');
          hass.callService(domain, service, action.service_data || {});
        }
        break;
        
      case 'navigate':
        if (action.navigation_path) {
          history.pushState(null, '', action.navigation_path);
          const navEvent = new CustomEvent('location-changed', {
            bubbles: true,
            composed: true
          });
          window.dispatchEvent(navEvent);
        }
        break;
        
      case 'url':
        if (action.url_path) {
          window.open(action.url_path, action.url_target || '_blank');
        }
        break;
    }
  }
  
  // --------------------------------------------------------------------------
  // Visibility
  // --------------------------------------------------------------------------
  
  _checkVisibility() {
    const conditions = this._config.visibility;
    if (!conditions || conditions.length === 0) return true;
    
    return conditions.every(cond => this._evaluateCondition(cond));
  }
  
  _evaluateCondition(condition) {
    if (!this._hass) return true;
    
    switch (condition.condition) {
      case 'state':
        const state = this._hass.states[condition.entity];
        if (!state) return false;
        if (condition.state) {
          return state.state === condition.state;
        }
        if (condition.state_not) {
          return state.state !== condition.state_not;
        }
        return true;
        
      case 'numeric_state':
        const numState = this._hass.states[condition.entity];
        if (!numState) return false;
        const value = parseFloat(numState.state);
        if (isNaN(value)) return false;
        if (condition.above !== undefined && value <= condition.above) return false;
        if (condition.below !== undefined && value >= condition.below) return false;
        return true;
        
      case 'user':
        const user = this._hass.user?.name;
        if (condition.users) {
          return condition.users.includes(user);
        }
        return true;
        
      case 'screen':
        const width = window.innerWidth;
        if (condition.media_query) {
          return window.matchMedia(condition.media_query).matches;
        }
        return true;
        
      default:
        return true;
    }
  }
  
  // --------------------------------------------------------------------------
  // Child Cards
  // --------------------------------------------------------------------------
  
  async _loadChildCards() {
    const container = this.shadowRoot.querySelector('#cards-container');
    if (!container || container.childElementCount > 0) return;
    
    const cards = this._config.cards || [];
    const gridConfig = this._config.grid || {};
    
    // Применяем grid
    if (gridConfig.columns) {
      container.style.display = 'grid';
      container.style.gridTemplateColumns = `repeat(${gridConfig.columns}, 1fr)`;
      container.style.gap = gridConfig.gap || '8px';
    }
    
    for (const cardConfig of cards) {
      await this._createCard(cardConfig, container);
    }
  }
  
  async _loadTabCards(tabIndex) {
    const container = this.shadowRoot.querySelector(`#tab-cards-${tabIndex}`);
    if (!container || container.childElementCount > 0) return;
    
    const tabs = this._config.tabs || [];
    const tab = tabs[tabIndex];
    if (!tab || !tab.cards) return;
    
    for (const cardConfig of tab.cards) {
      await this._createCard(cardConfig, container);
    }
  }
  
  async _createCard(cardConfig, container) {
    try {
      const helpers = await window.loadCardHelpers?.();
      
      let card;
      if (helpers) {
        card = await helpers.createCardElement(cardConfig);
      } else {
        // Fallback
        const tag = cardConfig.type.startsWith('custom:') 
          ? cardConfig.type.replace('custom:', '')
          : `hui-${cardConfig.type}-card`;
        card = document.createElement(tag);
        card.setConfig(cardConfig);
      }
      
      if (card) {
        card.hass = this._hass;
        this._childCards.push(card);
        
        // Grid options
        if (cardConfig.card_options) {
          if (cardConfig.card_options.colspan) {
            card.style.gridColumn = `span ${cardConfig.card_options.colspan}`;
          }
          if (cardConfig.card_options.rowspan) {
            card.style.gridRow = `span ${cardConfig.card_options.rowspan}`;
          }
        }
        
        container.appendChild(card);
      }
    } catch (e) {
      console.error('[UniversalCard] Error creating card:', e);
      const errorCard = document.createElement('ha-card');
      errorCard.innerHTML = `
        <div style="padding: 16px; color: var(--error-color);">
          <ha-icon icon="mdi:alert"></ha-icon>
          Ошибка: ${e.message}
        </div>
      `;
      container.appendChild(errorCard);
    }
  }
  
  // --------------------------------------------------------------------------
  // Styles
  // --------------------------------------------------------------------------
  
  _getStyles() {
    return `
      :host {
        display: block;
      }
      
      .uc-card {
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      /* Header */
      .uc-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        cursor: pointer;
        user-select: none;
        transition: background 0.2s;
      }
      
      .uc-header:hover {
        background: var(--secondary-background-color);
      }
      
      .uc-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }
      
      .uc-header-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .uc-icon {
        --mdc-icon-size: 24px;
        color: var(--primary-color);
      }
      
      .uc-titles {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      
      .uc-title {
        font-weight: 500;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .uc-subtitle {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .uc-state {
        padding: 2px 8px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .uc-badge {
        padding: 2px 8px;
        background: var(--secondary-background-color);
        border-radius: 12px;
        font-size: 12px;
      }
      
      .uc-expand-icon {
        --mdc-icon-size: 20px;
        transition: transform 0.3s ease;
        color: var(--secondary-text-color);
      }
      
      .uc-expand-icon.expanded {
        transform: rotate(180deg);
      }
      
      /* Body */
      .uc-body {
        overflow: hidden;
      }
      
      .uc-body-expand {
        max-height: 0;
        transition: max-height 0.3s ease, padding 0.3s ease;
      }
      
      .uc-body-expand.expanded {
        max-height: 2000px;
        padding: 0 16px 16px;
      }
      
      .uc-cards-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      /* Tabs */
      .uc-body-tabs {
        max-height: 0;
        transition: max-height 0.3s ease;
      }
      
      .uc-body-tabs.expanded {
        max-height: 2000px;
      }
      
      .uc-tabs-bar {
        display: flex;
        border-bottom: 1px solid var(--divider-color);
        overflow-x: auto;
      }
      
      .uc-tab {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 12px 16px;
        border: none;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
        white-space: nowrap;
      }
      
      .uc-tab:hover {
        background: var(--secondary-background-color);
      }
      
      .uc-tab.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }
      
      .uc-tab ha-icon {
        --mdc-icon-size: 18px;
      }
      
      .uc-tab-panel {
        display: none;
        padding: 16px;
      }
      
      .uc-tab-panel.active {
        display: block;
      }
      
      /* Carousel */
      .uc-body-carousel {
        max-height: 0;
        transition: max-height 0.3s ease;
        position: relative;
      }
      
      .uc-body-carousel.expanded {
        max-height: 2000px;
      }
      
      .uc-carousel-track {
        display: flex;
        transition: transform 0.3s ease;
      }
      
      .uc-carousel-slide {
        flex: 0 0 100%;
        display: none;
        padding: 16px;
      }
      
      .uc-carousel-slide.active {
        display: block;
      }
      
      .uc-carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        font-size: 16px;
        z-index: 10;
      }
      
      .uc-carousel-prev { left: 8px; }
      .uc-carousel-next { right: 8px; }
      
      .uc-carousel-dots {
        display: flex;
        justify-content: center;
        gap: 8px;
        padding: 12px;
      }
      
      .uc-carousel-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--divider-color);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .uc-carousel-dot.active {
        background: var(--primary-color);
        transform: scale(1.2);
      }
      
      /* Modal / Fullscreen */
      .uc-body-modal,
      .uc-body-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .uc-body-fullscreen {
        align-items: stretch;
      }
      
      .uc-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
      }
      
      .uc-modal-content {
        position: relative;
        background: var(--ha-card-background, white);
        border-radius: 16px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow: auto;
        padding: 16px;
        animation: modalIn 0.3s ease;
      }
      
      .uc-body-fullscreen .uc-modal-content {
        width: 100%;
        max-width: none;
        height: 100%;
        max-height: none;
        border-radius: 0;
        animation: slideUp 0.3s ease;
      }
      
      @keyframes modalIn {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
      
      .uc-modal-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 50%;
        background: var(--secondary-background-color);
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }
      
      /* Footer */
      .uc-footer {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-top: 1px solid var(--divider-color);
        font-size: 12px;
        color: var(--secondary-text-color);
      }
      
      .uc-footer ha-icon {
        --mdc-icon-size: 16px;
      }
      
      /* Themes */
      .uc-theme-glass {
        background: rgba(255, 255, 255, 0.1) !important;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .uc-theme-neumorphism {
        background: var(--ha-card-background) !important;
        box-shadow: 
          8px 8px 16px rgba(0, 0, 0, 0.1),
          -8px -8px 16px rgba(255, 255, 255, 0.05);
      }
      
      .uc-theme-neon .uc-header {
        border-bottom: 2px solid var(--primary-color);
        box-shadow: 0 2px 10px var(--primary-color);
      }
    `;
  }
}

// =============================================================================
// EDITOR CLASS
// =============================================================================

class UniversalCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
  }
  
  set hass(hass) {
    this._hass = hass;
  }
  
  setConfig(config) {
    this._config = config;
    this._render();
  }
  
  _render() {
    this.innerHTML = `
      <style>
        .editor-row {
          margin-bottom: 16px;
        }
        .editor-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 4px;
          color: var(--secondary-text-color);
        }
        .editor-input {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          background: var(--ha-card-background);
          color: var(--primary-text-color);
        }
        .editor-select {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          background: var(--ha-card-background);
          color: var(--primary-text-color);
        }
      </style>
      
      <div class="editor-row">
        <label class="editor-label">Title</label>
        <input class="editor-input" id="title" value="${this._config.title || ''}" />
      </div>
      
      <div class="editor-row">
        <label class="editor-label">Subtitle</label>
        <input class="editor-input" id="subtitle" value="${this._config.subtitle || ''}" />
      </div>
      
      <div class="editor-row">
        <label class="editor-label">Icon</label>
        <input class="editor-input" id="icon" value="${this._config.icon || ''}" placeholder="mdi:home" />
      </div>
      
      <div class="editor-row">
        <label class="editor-label">Entity</label>
        <input class="editor-input" id="entity" value="${this._config.entity || ''}" placeholder="sun.sun" />
      </div>
      
      <div class="editor-row">
        <label class="editor-label">Body Mode</label>
        <select class="editor-select" id="body_mode">
          <option value="expand" ${this._config.body_mode === 'expand' ? 'selected' : ''}>Expand</option>
          <option value="modal" ${this._config.body_mode === 'modal' ? 'selected' : ''}>Modal</option>
          <option value="fullscreen" ${this._config.body_mode === 'fullscreen' ? 'selected' : ''}>Fullscreen</option>
          <option value="tabs" ${this._config.body_mode === 'tabs' ? 'selected' : ''}>Tabs</option>
          <option value="carousel" ${this._config.body_mode === 'carousel' ? 'selected' : ''}>Carousel</option>
          <option value="none" ${this._config.body_mode === 'none' ? 'selected' : ''}>None</option>
        </select>
      </div>
      
      <div class="editor-row">
        <label class="editor-label">Theme</label>
        <select class="editor-select" id="theme">
          <option value="default" ${this._config.theme === 'default' ? 'selected' : ''}>Default</option>
          <option value="glass" ${this._config.theme === 'glass' ? 'selected' : ''}>Glassmorphism</option>
          <option value="neumorphism" ${this._config.theme === 'neumorphism' ? 'selected' : ''}>Neumorphism</option>
          <option value="neon" ${this._config.theme === 'neon' ? 'selected' : ''}>Neon</option>
        </select>
      </div>
    `;
    
    // Events
    ['title', 'subtitle', 'icon', 'entity', 'body_mode', 'theme'].forEach(id => {
      const el = this.querySelector(`#${id}`);
      if (el) {
        el.addEventListener('change', () => this._valueChanged());
        el.addEventListener('input', () => this._valueChanged());
      }
    });
  }
  
  _valueChanged() {
    const config = {
      ...this._config,
      title: this.querySelector('#title')?.value || '',
      subtitle: this.querySelector('#subtitle')?.value || '',
      icon: this.querySelector('#icon')?.value || '',
      entity: this.querySelector('#entity')?.value || '',
      body_mode: this.querySelector('#body_mode')?.value || 'expand',
      theme: this.querySelector('#theme')?.value || 'default'
    };
    
    const event = new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: { config }
    });
    this.dispatchEvent(event);
  }
}

// =============================================================================
// REGISTRATION
// =============================================================================

if (!customElements.get('universal-card')) {
  customElements.define('universal-card', UniversalCard);
}

if (!customElements.get('universal-card-editor')) {
  customElements.define('universal-card-editor', UniversalCardEditor);
}

// Register with HA card picker
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === 'universal-card')) {
  window.customCards.push({
    type: 'universal-card',
    name: CARD_NAME,
    description: CARD_DESCRIPTION,
    preview: true,
    documentationURL: 'https://github.com/Mesteriis/universal-card'
  });
}

console.info(
  `%c 🎴 UNIVERSAL-CARD %c v${CARD_VERSION} %c`,
  'color: white; background: #3498db; font-weight: bold; padding: 2px 8px; border-radius: 4px 0 0 4px;',
  'color: #3498db; background: #ecf0f1; font-weight: bold; padding: 2px 8px; border-radius: 0 4px 4px 0;',
  ''
);
