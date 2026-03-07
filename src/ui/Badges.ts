/**
 * Universal Card - Badges Component
 * 
 * Renders badges for displaying entity states, counters, or custom values.
 * Supports icons, colors, and dynamic updates.
 * 
 * @author Mesteriis
 * @version 1.0.0
 * @module ui/Badges
 */

import { normalizeDerivedProviderContext } from '../providers/DerivedProviderContext.js';
import type { HeaderBadgeConfig } from '../core/config-contracts.js';
import type {
  DerivedProviderContext
} from '../providers/DerivedProviderContext.js';
import type {
  HomeAssistantAttributeValue,
  HomeAssistantLike
} from '../providers/ProviderContext.js';

type BadgeConfig = HeaderBadgeConfig;
type BadgeProviders = DerivedProviderContext;

// =============================================================================
// BADGES COMPONENT
// =============================================================================

/**
 * Badges component for Universal Card
 * 
 * @class Badges
 */
export class Badges {
  _configs: BadgeConfig[];
  _element: HTMLElement | null;
  _hass: HomeAssistantLike;
  _providers: BadgeProviders | null;
  
  /**
   * Create Badges instance
   * 
   * @param {Object[]} configs - Array of badge configurations
   */
  constructor(configs: BadgeConfig[] = []) {
    /** @type {Object[]} Badge configurations */
    this._configs = configs;
    
    /** @type {HTMLElement|null} Container element */
    this._element = null;
    
    /** @type {Object|null} Home Assistant instance */
    this._hass = null;

    /** @type {Object|null} Provider context */
    this._providers = null;
  }
  
  // ===========================================================================
  // SETTERS
  // ===========================================================================
  
  /**
   * Set Home Assistant instance
   * 
   * @param {Object} hass - Home Assistant instance
   */
  set hass(hass: HomeAssistantLike) {
    this._providers = normalizeDerivedProviderContext(hass);
    this._hass = this._providers.getHass();
    this._update();
  }
  
  /**
   * Set badge configurations
   * 
   * @param {Object[]} configs - Badge configurations
   */
  set configs(configs: BadgeConfig[]) {
    this._configs = configs;
    this._renderBadges();
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render badges container
   * 
   * @returns {HTMLElement} Badges container element
   */
  render(): HTMLElement {
    this._element = document.createElement('div');
    this._element.className = 'badges-container';
    
    this._renderBadges();
    
    return this._element;
  }
  
  /**
   * Render all badges
   * 
   * @private
   */
  _renderBadges() {
    if (!this._element) return;
    
    this._element.innerHTML = this._configs
      .map((config, index) => this._renderBadge(config, index))
      .join('');
  }
  
  /**
   * Render single badge
   * 
   * @private
   * @param {Object} config - Badge configuration
   * @param {number} index - Badge index
   * @returns {string} HTML string
   */
  _renderBadge(config: BadgeConfig, index: number): string {
    const {
      type = 'state',  // state | counter | custom | attribute
      entity,
      attribute,
      icon,
      color,
      value,
      label,
      unit,
      min,
      max,
      show_name = false,
      tap_action
    } = config;
    
    // Determine value to display
    const rawValue = this._getValue(config);
    let displayValue = rawValue;
    let badgeColor = color || this._getAutoColor(config);
    
    // Format value
    if (displayValue !== null && displayValue !== undefined) {
      displayValue = this._formatValue(displayValue, config);
    }
    
    // Build badge HTML
    const iconHtml = icon ? `<ha-icon class="badge-icon" icon="${icon}"></ha-icon>` : '';
    const labelHtml = label ? `<span class="badge-label">${label}</span>` : '';
    const unitHtml = unit ? `<span class="badge-unit">${unit}</span>` : '';
    const valueHtml = displayValue !== null && displayValue !== undefined 
      ? `<span class="badge-value">${displayValue}</span>${unitHtml}` 
      : '';
    
    // Progress bar for min/max
    const progressHtml = this._renderProgress(config, rawValue);
    
    const clickable = tap_action ? 'clickable' : '';
    
    return `
      <div class="badge ${clickable}" 
           data-badge-index="${index}"
           style="--badge-color: ${badgeColor}">
        ${iconHtml}
        <div class="badge-content">
          ${labelHtml}
          ${valueHtml}
          ${progressHtml}
        </div>
      </div>
    `;
  }
  
  /**
   * Render progress bar
   * 
   * @private
   * @param {Object} config - Badge configuration
   * @param {*} value - Current value
   * @returns {string} HTML string
   */
  _renderProgress(config: BadgeConfig, value: HomeAssistantAttributeValue) {
    const { min, max, show_progress } = config;
    
    if (!show_progress || min === undefined || max === undefined) {
      return '';
    }
    
    const numValue = this._toNumericValue(value);
    if (numValue === null || max === min) return '';
    
    const percentage = Math.min(100, Math.max(0, 
      ((numValue - min) / (max - min)) * 100
    ));
    
    return `
      <div class="badge-progress">
        <div class="badge-progress-bar" style="width: ${percentage}%"></div>
      </div>
    `;
  }
  
  /**
   * Get badge value
   * 
   * @private
   * @param {Object} config - Badge configuration
   * @returns {*} Value
   */
  _getValue(config: BadgeConfig): HomeAssistantAttributeValue {
    const { type, entity, attribute, value } = config;
    const providers = this._getProviders();
    
    // Custom static value
    if (value !== undefined) {
      return value;
    }
    
    if (!entity || !providers) {
      return null;
    }
    
    // Get from entity
    switch (type) {
      case 'state':
        return providers.derived.entities.getValue(entity);
        
      case 'attribute':
        return providers.derived.entities.getValue(entity, attribute);
        
      case 'counter':
        // Counter logic - could be count of entities in a state
        return this._getCounterValue(config);
        
      default:
        return providers.derived.entities.getValue(entity);
    }
  }
  
  /**
   * Get counter value
   * 
   * @private
   * @param {Object} config - Badge configuration
   * @returns {number} Count
   */
  _getCounterValue(config: BadgeConfig): number {
    const { entities, domain, state, count_state } = config;
    const providers = this._getProviders();
    if (!providers) return 0;

    const targetState = count_state || state || 'on';

    return providers.derived.entities.count({
      domain,
      entities,
      state: targetState
    });
  }
  
  /**
   * Format value for display
   * 
   * @private
   * @param {*} value - Raw value
   * @param {Object} config - Badge configuration
   * @returns {string} Formatted value
   */
  _formatValue(value: HomeAssistantAttributeValue, config: BadgeConfig): string {
    const { precision, format } = config;
    const stringValue = value === null || value === undefined ? '' : String(value);
    
    // Number formatting
    if (precision !== undefined && !Number.isNaN(Number.parseFloat(stringValue))) {
      return Number.parseFloat(stringValue).toFixed(precision);
    }
    
    // Date/time formatting
    if (format === 'time' || format === 'date') {
      try {
        const date = new Date(stringValue);
        if (format === 'time') {
          return date.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
        }
        return date.toLocaleDateString('ru-RU');
      } catch {
        return stringValue;
      }
    }
    
    // Duration formatting
    if (format === 'duration') {
      return this._formatDuration(value);
    }
    
    return stringValue;
  }
  
  /**
   * Format duration
   * 
   * @private
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted duration
   */
  _formatDuration(seconds: HomeAssistantAttributeValue): string {
    const num = Number.parseInt(String(seconds), 10);
    if (Number.isNaN(num)) {
      return seconds === null || seconds === undefined ? '' : String(seconds);
    }
    
    const hours = Math.floor(num / 3600);
    const minutes = Math.floor((num % 3600) / 60);
    const secs = num % 60;
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
  }
  
  /**
   * Get auto color based on state/value
   * 
   * @private
   * @param {Object} config - Badge configuration
   * @returns {string} Color
   */
  _getAutoColor(config: BadgeConfig): string {
    const { entity, thresholds } = config;
    const providers = this._getProviders();
    
    // Default color
    let color = 'var(--primary-color)';
    
    if (!entity || !providers) {
      return color;
    }

    const state = providers.entities.getState(entity);
    if (!state) return color;
    
    // State-based colors
    const stateColors: Record<string, string> = {
      on: 'var(--state-active-color, #fdd835)',
      off: 'var(--disabled-text-color, #969696)',
      home: 'var(--success-color, #4caf50)',
      not_home: 'var(--error-color, #f44336)',
      unavailable: 'var(--disabled-text-color, #bdbdbd)',
      unknown: 'var(--disabled-text-color, #bdbdbd)'
    };
    
    if (stateColors[state.state]) {
      return stateColors[state.state];
    }
    
    // Threshold-based colors
    if (thresholds && Array.isArray(thresholds)) {
      const value = this._toNumericValue(state.state);
      if (value !== null) {
        // Sort thresholds descending
        const sorted = [...thresholds].sort((a, b) => b.value - a.value);
        
        for (const threshold of sorted) {
          if (value >= threshold.value) {
            return threshold.color;
          }
        }
      }
    }
    
    return color;
  }
  
  // ===========================================================================
  // UPDATE
  // ===========================================================================
  
  /**
   * Update badge values
   * 
   * @private
   */
  _update() {
    if (!this._element || !this._getProviders()) return;
    
    const badges = this._element.querySelectorAll<HTMLElement>('.badge');
    
    this._configs.forEach((config, index) => {
      const badge = badges[index];
      if (!badge) return;
      
      // Update value
      const valueEl = badge.querySelector('.badge-value');
      if (valueEl) {
        const value = this._getValue(config);
        valueEl.textContent = value === null || value === undefined
          ? ''
          : this._formatValue(value, config);
      }
      
      // Update color
      const color = config.color || this._getAutoColor(config);
      badge.style.setProperty('--badge-color', color);
      
      // Update progress
      if (config.show_progress) {
        const progressBar = badge.querySelector<HTMLElement>('.badge-progress-bar');
        if (progressBar && config.min !== undefined && config.max !== undefined && config.max !== config.min) {
          const value = this._toNumericValue(this._getValue(config));
          const percentage = value === null
            ? 0
            : Math.min(100, Math.max(0,
                ((value - config.min) / (config.max - config.min)) * 100
              ));
          progressBar.style.width = `${percentage}%`;
        }
      }
    });
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================
  
  /**
   * Get badge styles
   * 
   * @static
   * @returns {string} CSS string
   */
  static getStyles() {
    return `
      .badges-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: color-mix(in srgb, var(--badge-color) 15%, transparent);
        border-radius: 12px;
        font-size: 12px;
        color: var(--badge-color);
      }
      
      .badge.clickable {
        cursor: pointer;
        transition: background 0.2s ease;
      }
      
      .badge.clickable:hover {
        background: color-mix(in srgb, var(--badge-color) 25%, transparent);
      }
      
      .badge-icon {
        --mdc-icon-size: 14px;
      }
      
      .badge-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }
      
      .badge-label {
        font-size: 10px;
        opacity: 0.8;
        text-transform: uppercase;
      }
      
      .badge-value {
        font-weight: 500;
      }
      
      .badge-unit {
        font-size: 10px;
        opacity: 0.8;
        margin-left: 2px;
      }
      
      .badge-progress {
        width: 100%;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-top: 2px;
      }
      
      .badge-progress-bar {
        height: 100%;
        background: var(--badge-color);
        border-radius: 2px;
        transition: width 0.3s ease;
      }
    `;
  }
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the badges component
   */
  destroy() {
    this._element = null;
    this._hass = null;
    this._providers = null;
  }

  /**
   * Resolve normalized derived providers.
   *
   * @private
   * @returns {Object|null}
   */
  _getProviders(): BadgeProviders | null {
    if (this._providers) {
      return this._providers;
    }

    if (!this._hass) {
      return null;
    }

    this._providers = normalizeDerivedProviderContext(this._hass);
    this._hass = this._providers.getHass();
    return this._providers;
  }

  _toNumericValue(value: HomeAssistantAttributeValue): number | null {
    const numericValue = Number.parseFloat(String(value));
    return Number.isNaN(numericValue) ? null : numericValue;
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default Badges;
