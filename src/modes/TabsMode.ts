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
import { cardPool } from '../core/runtime.js';
import { TAB_ALIGNMENTS } from '../core/constants.js';

type UnknownRecord = Record<string, unknown>;
type HomeAssistantLike = UnknownRecord;
type ModeCardElement = HTMLElement & { hass?: HomeAssistantLike | null };

interface CardLayoutOptions extends UnknownRecord {
  colspan?: number;
  rowspan?: number;
}

interface ModeCardConfig extends UnknownRecord {
  colspan?: number;
  rowspan?: number;
  card_options?: CardLayoutOptions;
}

interface TabGridConfig extends UnknownRecord {
  columns?: number | string;
  gap?: string;
}

interface TabConfig extends UnknownRecord {
  label?: string;
  title?: string;
  icon?: string;
  cards?: ModeCardConfig[];
  grid?: TabGridConfig;
}

interface TabsConfig extends UnknownRecord {
  tabs?: TabConfig[];
  tabs_config?: {
    position?: string;
    show_icons?: boolean;
    show_labels?: boolean;
    content_padding?: string;
    tab_min_width?: string;
    tab_alignment?: string;
  } & UnknownRecord;
  grid?: TabGridConfig;
  skeleton_count?: number;
}

interface TabsModeOptions extends UnknownRecord {
  activeTab?: number;
  onTabChange?: ((index: number) => void) | null;
}

interface CardHelpers {
  createCardElement(config: ModeCardConfig): Promise<ModeCardElement>;
}

export class TabsMode extends BaseMode {
  declare _config: TabsConfig;
  declare _container: HTMLElement | null;
  declare _hass: HomeAssistantLike | null;
  declare _poolEnabled: boolean;

  _tabCards: Record<number, ModeCardElement[]>;
  _tabPoolKeys: Record<number, string | null>;
  _loadedTabs: Record<number, boolean>;
  _tabBar: HTMLElement | null;
  _tabContent: HTMLElement | null;
  _tabs: TabConfig[];
  _activeTab: number;
  _onTabChange: ((index: number) => void) | null;
  _tabPosition: string;
  _showIcons: boolean;
  _showLabels: boolean;
  _contentPadding: string;
  _tabMinWidth: string;
  _tabAlignment: string;

  constructor(config: TabsConfig, options: TabsModeOptions = {}) {
    super(config, options);

    this._tabCards = {};
    this._tabPoolKeys = {};
    this._loadedTabs = {};
    this._tabBar = null;
    this._tabContent = null;
    this._tabs = Array.isArray(config.tabs) ? config.tabs : [];

    const initialTab = Number.isFinite(options.activeTab) ? Number(options.activeTab) : 0;
    this._activeTab = Math.max(0, Math.min(initialTab, Math.max(this._tabs.length - 1, 0)));

    this._onTabChange = typeof options.onTabChange === 'function'
      ? options.onTabChange
      : null;

    const tabsConfig = config.tabs_config || {};
    this._tabPosition = typeof tabsConfig.position === 'string' && tabsConfig.position
      ? tabsConfig.position
      : 'top';
    this._showIcons = tabsConfig.show_icons !== false;
    this._showLabels = tabsConfig.show_labels !== false;
    this._contentPadding = typeof tabsConfig.content_padding === 'string' && tabsConfig.content_padding
      ? tabsConfig.content_padding
      : '16px';
    this._tabMinWidth = typeof tabsConfig.tab_min_width === 'string' && tabsConfig.tab_min_width
      ? tabsConfig.tab_min_width
      : '72px';
    this._tabAlignment = typeof tabsConfig.tab_alignment === 'string' && tabsConfig.tab_alignment
      ? tabsConfig.tab_alignment
      : TAB_ALIGNMENTS.START;
  }

  override render(): HTMLElement {
    this._container = document.createElement('div');
    this._container.className = 'tabs-mode';
    this._container.dataset.state = this.active ? 'expanded' : 'collapsed';
    this._container.dataset.tabPosition = this._tabPosition;
    this._container.dataset.tabAlignment = this._tabAlignment;
    this._container.style.setProperty('--uc-tabs-content-padding', this._contentPadding);
    this._container.style.setProperty('--uc-tabs-tab-min-width', this._tabMinWidth);

    this._tabBar = this._renderTabBar();
    this._tabContent = document.createElement('div');
    this._tabContent.className = 'tabs-content';

    this._tabs.forEach((tab, index) => {
      const panel = this._renderTabPanel(tab, index);
      this._tabContent?.appendChild(panel);
    });

    if (this._tabPosition === 'bottom') {
      this._container.appendChild(this._tabContent);
      this._container.appendChild(this._tabBar);
    } else {
      this._container.appendChild(this._tabBar);
      this._container.appendChild(this._tabContent);
    }

    return this._container;
  }

  _renderTabBar(): HTMLElement {
    const tabBar = document.createElement('div');
    tabBar.className = 'tabs-bar';
    tabBar.setAttribute('role', 'tablist');

    this._tabs.forEach((tab, index) => {
      const tabBtn = document.createElement('button');
      tabBtn.className = 'tab-button';
      tabBtn.setAttribute('role', 'tab');
      tabBtn.setAttribute('aria-selected', index === this._activeTab ? 'true' : 'false');
      tabBtn.dataset.index = String(index);

      if (index === this._activeTab) {
        tabBtn.classList.add('active');
      }

      if (this._showIcons && typeof tab.icon === 'string' && tab.icon) {
        const icon = document.createElement('ha-icon');
        icon.setAttribute('icon', tab.icon);
        tabBtn.appendChild(icon);
      }

      const tabLabel = tab.label || tab.title;
      if (this._showLabels && typeof tabLabel === 'string' && tabLabel) {
        const label = document.createElement('span');
        label.className = 'tab-label';
        label.textContent = tabLabel;
        tabBtn.appendChild(label);
      }

      tabBtn.addEventListener('click', () => {
        void this._selectTab(index);
      });

      tabBar.appendChild(tabBtn);
    });

    const indicator = document.createElement('div');
    indicator.className = 'tab-indicator';
    tabBar.appendChild(indicator);

    return tabBar;
  }

  _renderTabPanel(tab: TabConfig, index: number): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'tab-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.dataset.index = String(index);

    if (index === this._activeTab) {
      panel.classList.add('active');
    }

    const grid = document.createElement('div');
    grid.className = 'tab-grid';

    const gridConfig = tab.grid || this._config.grid || {};
    this._applyGridConfig(grid, gridConfig, { columns: 1, gap: '16px' });

    if (index === this._activeTab) {
      grid.appendChild(this._renderSkeleton());
    }

    panel.appendChild(grid);
    return panel;
  }

  _renderSkeleton(): HTMLElement {
    const count = typeof this._config.skeleton_count === 'number' && this._config.skeleton_count > 0
      ? Math.floor(this._config.skeleton_count)
      : 2;
    const container = document.createElement('div');
    container.className = 'skeleton-container';

    for (let index = 0; index < count; index += 1) {
      const card = document.createElement('div');
      card.className = 'skeleton-card';

      const title = document.createElement('div');
      title.className = 'skeleton-line title';
      const text = document.createElement('div');
      text.className = 'skeleton-line text';

      card.appendChild(title);
      card.appendChild(text);
      container.appendChild(card);
    }

    return container;
  }

  async _selectTab(index: number): Promise<void> {
    if (index === this._activeTab || index < 0 || index >= this._tabs.length) {
      return;
    }

    const previousIndex = this._activeTab;
    this._activeTab = index;

    this._updateTabButtons();
    this._updateIndicator();
    this._updatePanels(previousIndex, index);

    this._onTabChange?.(index);

    if (!this._loadedTabs[index]) {
      await this._loadTabCards(index);
    }
  }

  _updateTabButtons(): void {
    const buttons = this._tabBar?.querySelectorAll('.tab-button');

    buttons?.forEach((button, index) => {
      const isActive = index === this._activeTab;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  _updateIndicator(): void {
    const indicator = this._tabBar?.querySelector('.tab-indicator') as HTMLElement | null;
    const activeBtn = this._tabBar?.querySelector(`.tab-button[data-index="${this._activeTab}"]`) as HTMLElement | null;

    if (!indicator || !activeBtn) {
      return;
    }

    indicator.style.left = `${activeBtn.offsetLeft}px`;
    indicator.style.width = `${activeBtn.offsetWidth}px`;
  }

  _updatePanels(previousIndex: number, newIndex: number): void {
    const panels = this._tabContent?.querySelectorAll('.tab-panel');

    panels?.forEach((panel, index) => {
      const isActive = index === newIndex;
      panel.classList.toggle('active', isActive);

      if (isActive) {
        panel.classList.remove('slide-left', 'slide-right');
        panel.classList.add(newIndex > previousIndex ? 'slide-from-right' : 'slide-from-left');
      }
    });
  }

  async _loadTabCards(index: number): Promise<void> {
    const tab = this._tabs[index];
    const cards = Array.isArray(tab?.cards) ? tab.cards : [];

    if (cards.length === 0) {
      this._loadedTabs[index] = true;
      return;
    }

    const poolKey = this._getTabPoolKey(index, cards);
    this._tabPoolKeys[index] = poolKey;

    if (this._poolEnabled && poolKey) {
      const pooled = cardPool.acquire(poolKey) as ModeCardElement[] | null;
      if (pooled && pooled.length === cards.length) {
        this._tabCards[index] = pooled;
        this._loadedTabs[index] = true;
        this._mountTabCards(index, cards);
        return;
      }
    }

    try {
      const helpers = await this._getCardHelpers() as CardHelpers;
      this._tabCards[index] = await Promise.all(
        cards.map((cardConfig) => this._createCard(cardConfig, helpers) as Promise<ModeCardElement>)
      );
      this._loadedTabs[index] = true;
      this._mountTabCards(index, cards);
    } catch (error) {
      console.error(`[UniversalCard] Failed to load tab ${index} cards:`, error);
      this._loadedTabs[index] = true;
    }
  }

  _mountTabCards(index: number, cards: ModeCardConfig[]): void {
    const panel = this._tabContent?.querySelector(`.tab-panel[data-index="${index}"]`) as HTMLElement | null;
    const grid = panel?.querySelector('.tab-grid') as HTMLElement | null;

    if (!grid) {
      return;
    }

    const skeleton = grid.querySelector('.skeleton-container') as HTMLElement | null;
    if (skeleton) {
      skeleton.classList.add('fade-out');
      setTimeout(() => skeleton.remove(), 200);
    }

    const fragment = document.createDocumentFragment();

    (this._tabCards[index] || []).forEach((card, cardIndex) => {
      if (this._hass) {
        card.hass = this._hass;
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'card-wrapper';

      const cardConfig = cards[cardIndex];
      const colspan = cardConfig?.colspan ?? cardConfig?.card_options?.colspan;
      const rowspan = cardConfig?.rowspan ?? cardConfig?.card_options?.rowspan;

      if (typeof colspan === 'number' && colspan > 0) {
        wrapper.style.gridColumn = `span ${colspan}`;
      }
      if (typeof rowspan === 'number' && rowspan > 0) {
        wrapper.style.gridRow = `span ${rowspan}`;
      }

      wrapper.appendChild(card);
      fragment.appendChild(wrapper);
    });

    grid.appendChild(fragment);
  }

  _getTabPoolKey(index: number, cards: ModeCardConfig[]): string | null {
    if (!this._poolEnabled || !Array.isArray(cards) || cards.length === 0) {
      return null;
    }

    const scope = this._resolvePoolScope();
    const scopeToken = this._getPoolScopeToken(scope);
    if (!scopeToken) {
      return null;
    }

    let serialized: string;
    try {
      serialized = JSON.stringify(cards);
    } catch {
      return null;
    }

    const rawKey = `${scopeToken}:tabs:${index}:${serialized}`;
    return `uc-mode-pool:${scope}:tabs:${this._hashString(rawKey)}`;
  }

  override set hass(hass: HomeAssistantLike | null) {
    this._hass = hass;

    Object.values(this._tabCards).forEach((cards) => {
      cards.forEach((card) => {
        if (!card) {
          return;
        }

        try {
          card.hass = hass;
        } catch {
          // Ignore hass assignment failures from nested cards.
        }
      });
    });
  }

  override async open(): Promise<void> {
    if (this._active) {
      return;
    }

    this._active = true;

    if (this._container) {
      this._container.dataset.state = 'expanded';
    }

    requestAnimationFrame(() => {
      this._updateIndicator();
    });

    if (!this._loadedTabs[this._activeTab]) {
      await this._loadTabCards(this._activeTab);
    }

    this._onTabChange?.(this._activeTab);
  }

  override async close(): Promise<void> {
    if (!this._active) {
      return;
    }

    this._active = false;

    if (this._container) {
      this._container.dataset.state = 'collapsed';
    }
  }

  static override getStyles(): string {
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
        justify-content: flex-start;
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
        min-width: var(--uc-tabs-tab-min-width, 72px);
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
        padding: var(--uc-tabs-content-padding, var(--uc-padding, 16px));
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
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
      }

      .tabs-mode[data-tab-alignment="center"] .tabs-bar {
        justify-content: center;
      }

      .tabs-mode[data-tab-alignment="stretch"] .tab-button {
        flex: 1 1 0;
        min-width: 0;
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

  override destroy(): void {
    if (this._poolEnabled) {
      const releaseOptions = this._getPoolReleaseOptions();
      Object.entries(this._tabCards).forEach(([index, cards]) => {
        const poolKey = this._tabPoolKeys[Number(index)];
        if (poolKey && Array.isArray(cards) && cards.length > 0) {
          cardPool.release(poolKey, cards, releaseOptions);
        }
      });
    }

    this._tabBar = null;
    this._tabContent = null;
    this._tabCards = {};
    this._tabPoolKeys = {};
    this._loadedTabs = {};
    this._onTabChange = null;

    super.destroy();
  }
}

export default TabsMode;
