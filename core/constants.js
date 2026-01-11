/**
 * Universal Card - Constants
 * 
 * Centralized constants for the entire application.
 * Following the Single Responsibility Principle (SRP).
 * 
 * @module core/constants
 */

// =============================================================================
// CARD INFO
// =============================================================================

/** @type {string} Card version */
export const CARD_VERSION = '1.0.0';

/** @type {string} Card name for display */
export const CARD_NAME = 'Universal Card';

/** @type {string} Card description */
export const CARD_DESCRIPTION = 
  'Продвинутая карточка с 7 режимами body, grid layout, lazy loading и расширенной настройкой';

// =============================================================================
// BODY MODES
// =============================================================================

/**
 * Available body modes
 * @readonly
 * @enum {string}
 */
export const BODY_MODES = Object.freeze({
  EXPAND: 'expand',
  MODAL: 'modal',
  FULLSCREEN: 'fullscreen',
  TABS: 'tabs',
  CAROUSEL: 'carousel',
  SUBVIEW: 'subview',
  NONE: 'none'
});

/**
 * Array of valid body mode values
 * @type {string[]}
 */
export const VALID_BODY_MODES = Object.values(BODY_MODES);

// =============================================================================
// THEMES
// =============================================================================

/**
 * Available themes
 * @readonly
 * @enum {string}
 */
export const THEMES = Object.freeze({
  DEFAULT: 'default',
  TRANSPARENT: 'transparent',
  SOLID: 'solid',
  GLASS: 'glass',
  GLASSMORPHISM: 'glassmorphism',
  NEUMORPHISM: 'neumorphism',
  MINIMAL: 'minimal',
  GRADIENT: 'gradient',
  DARK: 'dark',
  NEON: 'neon',
  AURORA: 'aurora',
  // Dark themes
  CARBON: 'carbon',
  SLATE: 'slate',
  OBSIDIAN: 'obsidian',
  CHARCOAL: 'charcoal',
  MIDNIGHT: 'midnight',
  CYBER: 'cyber',
  VOID: 'void',
  EMBER: 'ember',
  FOREST: 'forest',
  OCEAN: 'ocean',
  PURPLE_HAZE: 'purple-haze',
  MATRIX: 'matrix',
  GRAPHITE: 'graphite',
  SMOKE: 'smoke',
  // Popular color schemes
  NORD: 'nord',
  DRACULA: 'dracula',
  MONOKAI: 'monokai',
  TOKYO_NIGHT: 'tokyo-night',
  CATPPUCCIN: 'catppuccin'
});

// =============================================================================
// ANIMATION PRESETS
// =============================================================================

/**
 * Animation preset names
 * @readonly
 * @enum {string}
 */
export const ANIMATION_PRESETS = Object.freeze({
  NONE: 'none',
  FADE: 'fade',
  SLIDE: 'slide',
  BOUNCE: 'bounce',
  ELASTIC: 'elastic',
  SMOOTH: 'smooth',
  SHARP: 'sharp',
  ZOOM: 'zoom'
});

// =============================================================================
// LOADING TYPES
// =============================================================================

/**
 * Loading indicator types
 * @readonly
 * @enum {string}
 */
export const LOADING_TYPES = Object.freeze({
  SKELETON: 'skeleton',
  SPINNER: 'spinner',
  DOTS: 'dots',
  PROGRESS: 'progress',
  SHIMMER: 'shimmer',
  PULSE: 'pulse'
});

// =============================================================================
// CONDITION TYPES
// =============================================================================

/**
 * Visibility condition types
 * @readonly
 * @enum {string}
 */
export const CONDITION_TYPES = Object.freeze({
  STATE: 'state',
  NUMERIC_STATE: 'numeric_state',
  USER: 'user',
  TIME: 'time',
  SCREEN: 'screen',
  AND: 'and',
  OR: 'or',
  NOT: 'not'
});

// =============================================================================
// ACTION TYPES
// =============================================================================

/**
 * Action types for tap/hold/double-tap
 * @readonly
 * @enum {string}
 */
export const ACTION_TYPES = Object.freeze({
  NONE: 'none',
  TOGGLE: 'toggle',
  CALL_SERVICE: 'call-service',
  NAVIGATE: 'navigate',
  URL: 'url',
  MORE_INFO: 'more-info',
  FIRE_EVENT: 'fire-dom-event',
  EXPAND: 'expand',
  COLLAPSE: 'collapse'
});

// =============================================================================
// EVENTS
// =============================================================================

/**
 * Custom event names
 * @readonly
 * @enum {string}
 */
export const EVENTS = Object.freeze({
  CARD_EXPANDED: 'universal-card-expanded',
  CARD_COLLAPSED: 'universal-card-collapsed',
  CARD_CONTROL: 'universal-card-control',
  CONFIG_CHANGED: 'config-changed',
  HASS_UPDATED: 'hass-updated'
});

// =============================================================================
// CSS CUSTOM PROPERTIES
// =============================================================================

/**
 * CSS custom property names used by the card
 * @readonly
 * @enum {string}
 */
export const CSS_VARS = Object.freeze({
  // Colors
  PRIMARY: '--uc-primary-color',
  SECONDARY: '--uc-secondary-color',
  ACCENT: '--uc-accent-color',
  BACKGROUND: '--uc-background-color',
  SURFACE: '--uc-surface-color',
  TEXT: '--uc-text-color',
  TEXT_SECONDARY: '--uc-text-secondary-color',
  BORDER: '--uc-border-color',
  
  // Sizes
  BORDER_RADIUS: '--uc-border-radius',
  PADDING: '--uc-padding',
  GAP: '--uc-gap',
  
  // Shadows
  SHADOW: '--uc-shadow',
  SHADOW_HOVER: '--uc-shadow-hover',
  
  // Transitions
  TRANSITION_DURATION: '--uc-transition-duration',
  TRANSITION_TIMING: '--uc-transition-timing'
});

// =============================================================================
// DEFAULT VALUES
// =============================================================================

/**
 * Default configuration values
 * @readonly
 * @type {Object}
 */
export const DEFAULTS = Object.freeze({
  // Basic
  body_mode: BODY_MODES.EXPAND,
  expanded: false,
  animation: true,
  theme: THEMES.DEFAULT,
  
  // Layout
  border_radius: 'var(--ha-card-border-radius, 12px)',
  padding: '16px',
  
  // Grid
  grid_columns: 1,
  grid_gap: '16px',
  
  // Modal
  modal_width: '90%',
  modal_max_width: '600px',
  backdrop_color: 'rgba(0, 0, 0, 0.6)',
  
  // Features
  lazy_load: true,
  remember_state: false,
  show_expand_icon: true,
  expand_icon: 'mdi:chevron-down',
  haptic: false,
  
  // Loading
  loading_type: LOADING_TYPES.SKELETON,
  skeleton_count: 3,
  
  // Carousel
  carousel_autoplay: false,
  carousel_interval: 5000,
  
  // Animations
  animation_preset: ANIMATION_PRESETS.SMOOTH,
  animation_duration: 300
});

// =============================================================================
// LIMITS
// =============================================================================

/**
 * Various limits and constraints
 * @readonly
 * @type {Object}
 */
export const LIMITS = Object.freeze({
  // Grid
  MAX_GRID_COLUMNS: 12,
  MIN_GRID_COLUMNS: 1,
  
  // Cards
  MAX_CARDS_PER_BODY: 100,
  MAX_TABS: 20,
  
  // Performance
  UPDATE_THROTTLE_MS: 100,
  RESIZE_DEBOUNCE_MS: 200,
  INTERSECTION_MARGIN: '100px',
  
  // History
  MAX_UNDO_HISTORY: 50,
  
  // Debug
  MAX_LOG_ENTRIES: 1000
});
