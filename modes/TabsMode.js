/**
 * Universal Card - Tabs Mode
 * 
 * Content organized in tabs with tab bar navigation.
 * Supports icons, labels, and swipe gestures.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module modes/TabsMode
 */

import { BaseMode } from './BaseMode.js';

// =============================================================================
// TABS MODE CLASS
// =============================================================================

/**
 * Tabs mode - content in switchable tabs
 * 
 * @class TabsMode
 * @extends BaseMode
 */
export class TabsMode extends BaseMode {
  
  /**
   * Create TabsMode instance
   * 
   * @param {Object} config - Mode configuration
   * @param {Object} options - Additional options
   */
  constructor(config, options = {}) {
    super(config, options);
    
    /** @type {number} Active tab index */
    this._activeTab = 0;
    
    /** @type {Object<number, HTMLElement[]>} Cards by tab index */
    this._tabCards = {};
    
    /** @type {Object<number, boolean>} Loaded tabs */
    this._loadedTabs = {};
    
    /** @type {HTMLElement|null} Tab bar element */
    this._tabBar = null;
    
    /** @type {HTMLElement|null} Tab content element */
    this._tabContent = null;
    
    /** @type {Array} Tab configurations */
    this._tabs = config.tabs || [];
    
    // Tabs configuration
    const tabsConfig = config.tabs_config || {};
    
    /** @type {string} Tab bar position */
    this._tabPosition = tabsConfig.position || 'top';
    
    /** @type {boolean} Show tab icons */
    this._showIcons = tabsConfig.show_icons !== false;
    
    /** @type {boolean} Show tab labels */
    this._showLabels = tabsConfig.show_labels !== false;
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the tabs mode container
   * 
   * @returns {HTMLElement} Mode container element
   */
  render() {
    this._container = document.createElement('div');
    this._container.className = 'tabs-mode';
    this._container.dataset.state = this._active ? 'expanded' : 'collapsed';
    this._container.dataset.tabPosition = this._tabPosition;
    
    // Tab bar
    this._tabBar = this._renderTabBar();
    
    // Tab content container
    this._tabContent = document.createElement('div');
    this._tabContent.className = 'tabs-content';
    
    // Render panels for each tab
    this._tabs.forEach((tab, index) => {
      const panel = this._renderTabPanel(tab, index);
      this._tabContent.appendChild(panel);
    });
    
    // Order based on position
    if (this._tabPosition === 'bottom') {
      this._container.appendChild(this._tabContent);
      this._container.appendChild(this._tabBar);
    } else {
      this._container.appendChild(this._tabBar);
      this._container.appendChild(this._tabContent);
    }
    
    return this._container;
  }
  
  /**
   * Render tab bar
   * 
   * @private
   * @returns {HTMLElement} Tab bar element
   */
  _renderTabBar() {
    const tabBar = document.createElement('div');
    tabBar.className = 'tabs-bar';
    tabBar.setAttribute('role', 'tablist');
    
    this._tabs.forEach((tab, index) => {
      const tabBtn = document.createElement('button');
      tabBtn.className = 'tab-button';
      tabBtn.setAttribute('role', 'tab');
      tabBtn.setAttribute('aria-selected', index === this._activeTab ? 'true' : 'false');
      tabBtn.dataset.index = index;
      
      if (index === this._activeTab) {
        tabBtn.classList.add('active');
      }
      
      // Icon
      if (this._showIcons && tab.icon) {
        const icon = document.createElement('ha-icon');
        icon.setAttribute('icon', tab.icon);
        tabBtn.appendChild(icon);
      }
      
      // Label (support both 'label' and 'title')
      const tabLabel = tab.label || tab.title;
      if (this._showLabels && tabLabel) {
        const label = document.createElement('span');
        label.className = 'tab-label';
        label.textContent = tabLabel;
        tabBtn.appendChild(label);
      }
      
      // Click handler
      tabBtn.addEventListener('click', () => this._selectTab(index));
      
      tabBar.appendChild(tabBtn);
    });
    
    // Active indicator
    const indicator = document.createElement('div');
    indicator.className = 'tab-indicator';
    tabBar.appendChild(indicator);
    
    return tabBar;
  }
  
  /**
   * Render tab panel
   * 
   * @private
   * @param {Object} tab - Tab configuration
   * @param {number} index - Tab index
   * @returns {HTMLElement} Tab panel element
   */
  _renderTabPanel(tab, index) {
    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.dataset.index = index;
    
    if (index === this._activeTab) {
      panel.classList.add('active');
    }
    
    // Grid container
    const grid = document.createElement('div');
    grid.className = 'tab-grid';
    
    // Apply grid styles
    const gridConfig = tab.grid || this._config.grid || {};
    const { columns = 1, gap = '16px' } = gridConfig;
    
    if (columns > 1) {
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
      grid.style.gap = gap;
    }
    
    // Skeleton for initial tab
    if (index === this._activeTab) {
      grid.innerHTML = this._renderSkeleton();
    }
    
    panel.appendChild(grid);
    
    return panel;
  }
  
  /**
   * Render skeleton loader
   * 
   * @private
   * @returns {string} Skeleton HTML
   */
  _renderSkeleton() {
    const count = this._config.skeleton_count || 2;
    
    return `
      <div class="skeleton-container">
        ${Array(count).fill(0).map(() => `
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // ===========================================================================
  // TAB SELECTION
  // ===========================================================================
  
  /**
   * Select a tab
   * 
   * @param {number} index - Tab index
   * @returns {Promise<void>}
   */
  async _selectTab(index) {
    if (index === this._activeTab || index < 0 || index >= this._tabs.length) {
      return;
    }
    
    const previousIndex = this._activeTab;
    this._activeTab = index;
    
    // Update tab buttons
    this._updateTabButtons();
    
    // Update indicator position
    this._updateIndicator();
    
    // Update panels
    this._updatePanels(previousIndex, index);
    
    // Load tab cards if needed
    if (!this._loadedTabs[index]) {
      await this._loadTabCards(index);
    }
  }
  
  /**
   * Update tab button states
   * 
   * @private
   */
  _updateTabButtons() {
    const buttons = this._tabBar?.querySelectorAll('.tab-button');
    
    buttons?.forEach((btn, index) => {
      const isActive = index === this._activeTab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }
  
  /**
   * Update tab indicator position
   * 
   * @private
   */
  _updateIndicator() {
    const indicator = this._tabBar?.querySelector('.tab-indicator');
    const activeBtn = this._tabBar?.querySelector(`.tab-button[data-index="${this._activeTab}"]`);
    
    if (indicator && activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn;
      indicator.style.left = `${offsetLeft}px`;
      indicator.style.width = `${offsetWidth}px`;
    }
  }
  
  /**
   * Update panel visibility
   * 
   * @private
   * @param {number} previousIndex - Previous active index
   * @param {number} newIndex - New active index
   */
  _updatePanels(previousIndex, newIndex) {
    const panels = this._tabContent?.querySelectorAll('.tab-panel');
    
    panels?.forEach((panel, index) => {
      const isActive = index === newIndex;
      panel.classList.toggle('active', isActive);
      
      // Slide direction
      if (isActive) {
        panel.classList.remove('slide-left', 'slide-right');
        panel.classList.add(newIndex > previousIndex ? 'slide-from-right' : 'slide-from-left');
      }
    });
  }
  
  // ===========================================================================
  // CARD LOADING
  // ===========================================================================
  
  /**
   * Load cards for a specific tab
   * 
   * @private
   * @param {number} index - Tab index
   * @returns {Promise<void>}
   */
  async _loadTabCards(index) {
    const tab = this._tabs[index];
    const cards = tab?.cards || [];
    
    if (cards.length === 0) {
      this._loadedTabs[index] = true;
      return;
    }
    
    try {
      const helpers = await this._getCardHelpers();
      
      this._tabCards[index] = await Promise.all(
        cards.map(config => this._createCard(config, helpers))
      );
      
      this._loadedTabs[index] = true;
      
      // Populate panel
      const panel = this._tabContent?.querySelector(`.tab-panel[data-index="${index}"]`);
      const grid = panel?.querySelector('.tab-grid');
      
      if (grid) {
        // Remove skeleton
        const skeleton = grid.querySelector('.skeleton-container');
        if (skeleton) {
          skeleton.classList.add('fade-out');
          setTimeout(() => skeleton.remove(), 200);
        }
        
        // Append cards
        const fragment = document.createDocumentFragment();
        
        this._tabCards[index].forEach((card, cardIndex) => {
          if (this._hass) card.hass = this._hass;
          
          const wrapper = document.createElement('div');
          wrapper.className = 'card-wrapper';
          
          const cardConfig = cards[cardIndex];
          if (cardConfig) {
            const colspan = cardConfig.colspan || (cardConfig.card_options && cardConfig.card_options.colspan);
            const rowspan = cardConfig.rowspan || (cardConfig.card_options && cardConfig.card_options.rowspan);
            
            if (colspan) {
              wrapper.style.gridColumn = 'span ' + colspan;
            }
            if (rowspan) {
              wrapper.style.gridRow = 'span ' + rowspan;
            }
          }
          
          wrapper.appendChild(card);
          fragment.appendChild(wrapper);
        });
        
        grid.appendChild(fragment);
      }
      
    } catch (error) {
      console.error(`[UniversalCard] Failed to load tab ${index} cards:`, error);
      this._loadedTabs[index] = true;
    }
  }
  
  /**
   * Update hass on all cards
   * 
   * @param {Object} hass - Home Assistant instance
   */
  set hass(hass) {
    this._hass = hass;
    
    // Update all loaded tab cards
    Object.values(this._tabCards).forEach(cards => {
      cards.forEach(card => {
        if (card && 'hass' in card) {
          try {
            card.hass = hass;
          } catch {
            // Ignore errors
          }
        }
      });
    });
  }
  
  // ===========================================================================
  // OPEN / CLOSE
  // ===========================================================================
  
  /**
   * Open the tabs mode
   * 
   * @returns {Promise<void>}
   */
  async open() {
    if (this._active) return;
    
    this._active = true;
    
    if (this._container) {
      this._container.dataset.state = 'expanded';
    }
    
    // Update indicator position
    requestAnimationFrame(() => {
      this._updateIndicator();
    });
    
    // Load initial tab cards
    if (!this._loadedTabs[this._activeTab]) {
      await this._loadTabCards(this._activeTab);
    }
  }
  
  /**
   * Close the tabs mode
   * 
   * @returns {Promise<void>}
   */
  async close() {
    if (!this._active) return;
    
    this._active = false;
    
    if (this._container) {
      this._container.dataset.state = 'collapsed';
    }
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================
  
  /**
   * Get CSS styles for tabs mode
   * 
   * @returns {string} CSS string
   */
  static getStyles() {
    return `
      /* ============================= */
      /* TABS MODE */
      /* ============================= */
      
      .tabs-mode {
        overflow: hidden;
        transition: 
          max-height var(--uc-transition-duration, 300ms) ease,
          opacity var(--uc-transition-duration, 300ms) ease;
      }
      
      .tabs-mode[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
      }
      
      .tabs-mode[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
      }
      
      /* ============================= */
      /* TAB BAR */
      /* ============================= */
      
      .tabs-bar {
        display: flex;
        position: relative;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        overflow-x: auto;
        scrollbar-width: none;
      }
      
      .tabs-bar::-webkit-scrollbar {
        display: none;
      }
      
      .tabs-mode[data-tab-position="bottom"] .tabs-bar {
        border-bottom: none;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      
      /* ============================= */
      /* TAB BUTTON */
      /* ============================= */
      
      .tab-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 12px 16px;
        min-width: 72px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        transition: color 0.2s ease;
        flex-shrink: 0;
      }
      
      .tab-button:hover {
        color: var(--primary-text-color);
      }
      
      .tab-button.active {
        color: var(--primary-color);
      }
      
      .tab-button ha-icon {
        --mdc-icon-size: 24px;
      }
      
      .tab-label {
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        white-space: nowrap;
      }
      
      /* ============================= */
      /* TAB INDICATOR */
      /* ============================= */
      
      .tab-indicator {
        position: absolute;
        bottom: 0;
        height: 2px;
        background: var(--primary-color);
        transition: left 0.25s ease, width 0.25s ease;
      }
      
      .tabs-mode[data-tab-position="bottom"] .tab-indicator {
        bottom: auto;
        top: 0;
      }
      
      /* ============================= */
      /* TAB CONTENT */
      /* ============================= */
      
      .tabs-content {
        position: relative;
        overflow: hidden;
      }
      
      .tab-panel {
        display: none;
        padding: var(--uc-padding, 16px);
      }
      
      .tab-panel.active {
        display: block;
        animation: tab-panel-appear 0.25s ease;
      }
      
      @keyframes tab-panel-appear {
        from {
          opacity: 0;
          transform: translateX(10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .tab-panel.slide-from-right {
        animation-name: tab-slide-from-right;
      }
      
      .tab-panel.slide-from-left {
        animation-name: tab-slide-from-left;
      }
      
      @keyframes tab-slide-from-right {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes tab-slide-from-left {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      /* ============================= */
      /* TAB GRID */
      /* ============================= */
      
      .tab-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .tab-grid .card-wrapper {
        min-width: 0;
        animation: card-appear 0.3s ease forwards;
        opacity: 0;
      }
      
      .tab-grid .card-wrapper:nth-child(1) { animation-delay: 0ms; }
      .tab-grid .card-wrapper:nth-child(2) { animation-delay: 50ms; }
      .tab-grid .card-wrapper:nth-child(3) { animation-delay: 100ms; }
      
      /* Skeleton */
      .tab-panel .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .tab-panel .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .tab-panel .skeleton-card {
        padding: 16px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .tab-panel .skeleton-line {
        height: 12px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .tab-panel .skeleton-line.title {
        width: 60%;
        height: 16px;
      }
    `;
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the mode
   */
  destroy() {
    this._tabBar = null;
    this._tabContent = null;
    this._tabCards = {};
    this._loadedTabs = {};
    
    super.destroy();
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default TabsMode;
