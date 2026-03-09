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
export const CARD_VERSION = '1.0.3';

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
// EXPAND TRIGGERS
// =============================================================================

/**
 * Header gestures that toggle or reserve expansion behavior.
 * @readonly
 * @enum {string}
 */
export const EXPAND_TRIGGERS = Object.freeze({
  TAP: 'tap',
  HOLD: 'hold',
  DOUBLE_TAP: 'double_tap',
  NONE: 'none'
});

/**
 * Array of valid expand trigger values.
 * @type {string[]}
 */
export const VALID_EXPAND_TRIGGERS = Object.values(EXPAND_TRIGGERS);

// =============================================================================
// POOL SCOPES
// =============================================================================

/**
 * Card pool reuse scopes
 * @readonly
 * @enum {string}
 */
export const POOL_SCOPES = Object.freeze({
  CARD: 'card',
  DASHBOARD: 'dashboard',
  GLOBAL: 'global'
});

/**
 * Array of valid pool scope values
 * @type {string[]}
 */
export const VALID_POOL_SCOPES = Object.values(POOL_SCOPES);

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
// BODY / CARD ANIMATIONS
// =============================================================================

/**
 * Body expand animation variants.
 * @readonly
 * @enum {string}
 */
export const EXPAND_ANIMATIONS = Object.freeze({
  NONE: 'none',
  FADE: 'fade',
  FADE_UP: 'fadeUp',
  FADE_DOWN: 'fadeDown',
  SCALE: 'scale',
  SLIDE: 'slide',
  BOUNCE: 'bounce',
  FLIP: 'flip'
});

/**
 * Array of valid expand animation values.
 * @type {string[]}
 */
export const VALID_EXPAND_ANIMATIONS = Object.values(EXPAND_ANIMATIONS);

/**
 * Body collapse animation variants.
 * @readonly
 * @enum {string}
 */
export const COLLAPSE_ANIMATIONS = Object.freeze({
  NONE: 'none',
  FADE: 'fade',
  FADE_DOWN: 'fadeDown',
  FADE_UP: 'fadeUp',
  SCALE: 'scale',
  SLIDE: 'slide'
});

/**
 * Array of valid collapse animation values.
 * @type {string[]}
 */
export const VALID_COLLAPSE_ANIMATIONS = Object.values(COLLAPSE_ANIMATIONS);

/**
 * Nested card cascade animation variants.
 * @readonly
 * @enum {string}
 */
export const CARD_ANIMATIONS = Object.freeze({
  NONE: 'none',
  FADE_UP: 'fadeUp',
  FADE_DOWN: 'fadeDown',
  FADE_LEFT: 'fadeLeft',
  FADE_RIGHT: 'fadeRight',
  SCALE: 'scale',
  BOUNCE: 'bounce',
  FLIP: 'flip'
});

/**
 * Array of valid nested card animation values.
 * @type {string[]}
 */
export const VALID_CARD_ANIMATIONS = Object.values(CARD_ANIMATIONS);

/**
 * Nested card reveal directions.
 * @readonly
 * @enum {string}
 */
export const CARD_DIRECTIONS = Object.freeze({
  SEQUENTIAL: 'sequential',
  REVERSE: 'reverse',
  CENTER_OUT: 'center-out',
  EDGES_IN: 'edges-in',
  DIAGONAL: 'diagonal',
  WAVE: 'wave',
  RANDOM: 'random'
});

/**
 * Array of valid nested card direction values.
 * @type {string[]}
 */
export const VALID_CARD_DIRECTIONS = Object.values(CARD_DIRECTIONS);

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

/**
 * Array of valid visibility condition type values.
 * @type {string[]}
 */
export const VALID_CONDITION_TYPES = Object.values(CONDITION_TYPES);

/**
 * Weekday values used by time visibility conditions.
 * @readonly
 * @enum {string}
 */
export const WEEKDAYS = Object.freeze({
  MON: 'mon',
  TUE: 'tue',
  WED: 'wed',
  THU: 'thu',
  FRI: 'fri',
  SAT: 'sat',
  SUN: 'sun'
});

/**
 * Array of valid weekday values.
 * @type {string[]}
 */
export const VALID_WEEKDAYS = Object.values(WEEKDAYS);

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
// SWIPE CONFIG
// =============================================================================

/**
 * Swipe gesture direction modes.
 * @readonly
 * @enum {string}
 */
export const SWIPE_DIRECTIONS = Object.freeze({
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  BOTH: 'both'
});

/**
 * Array of valid swipe direction values.
 * @type {string[]}
 */
export const VALID_SWIPE_DIRECTIONS = Object.values(SWIPE_DIRECTIONS);

/**
 * Swipe actions supported by the card runtime.
 * @readonly
 * @enum {string}
 */
export const SWIPE_ACTIONS = Object.freeze({
  NONE: 'none',
  EXPAND: 'expand',
  COLLAPSE: 'collapse',
  TOGGLE: 'toggle',
  NEXT: 'next',
  PREV: 'prev'
});

/**
 * Array of valid swipe action values.
 * @type {string[]}
 */
export const VALID_SWIPE_ACTIONS = Object.values(SWIPE_ACTIONS);

// =============================================================================
// BADGE CONFIG
// =============================================================================

/**
 * Badge value sources.
 * @readonly
 * @enum {string}
 */
export const BADGE_TYPES = Object.freeze({
  STATE: 'state',
  ATTRIBUTE: 'attribute',
  COUNTER: 'counter',
  CUSTOM: 'custom'
});

/**
 * Array of valid badge types.
 * @type {string[]}
 */
export const VALID_BADGE_TYPES = Object.values(BADGE_TYPES);

/**
 * Badge value formatting modes.
 * @readonly
 * @enum {string}
 */
export const BADGE_FORMATS = Object.freeze({
  NONE: 'none',
  TIME: 'time',
  DATE: 'date',
  DURATION: 'duration'
});

/**
 * Array of valid badge formats.
 * @type {string[]}
 */
export const VALID_BADGE_FORMATS = Object.values(BADGE_FORMATS);

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
  expand_trigger: EXPAND_TRIGGERS.TAP,
  expanded: false,
  animation: true,
  stability_mode: false,
  theme: THEMES.DEFAULT,
  
  // Layout
  border_radius: 'var(--ha-card-border-radius, 12px)',
  padding: '16px',
  
  // Grid
  grid_columns: 1,
  grid_gap: '16px',
  
  // Modal
  modal_width: '90%',
  modal_height: 'auto',
  modal_max_width: '600px',
  modal_max_height: '85vh',
  backdrop_color: 'rgba(0, 0, 0, 0.6)',
  
  // Features
  lazy_load: true,
  lazy_initial_batch: 4,
  lazy_batch_size: 4,
  lazy_idle_timeout: 800,
  remember_expanded_state: false,
  remember_mode_state: true,
  auto_collapse_after: 0,
  enable_card_pool: true,
  pool_scope: POOL_SCOPES.CARD,
  pool_ttl_ms: 10 * 60 * 1000,
  pool_max_entries: 32,
  show_expand_icon: true,
  expand_icon: 'mdi:chevron-down',
  haptic: false,
  
  // Loading
  loading_type: LOADING_TYPES.SKELETON,
  skeleton_count: 3,
  
  // Carousel
  carousel_autoplay: false,
  carousel_interval: 5000,

  // Swipe
  swipe_enabled: false,
  swipe_direction: SWIPE_DIRECTIONS.HORIZONTAL,
  swipe_threshold: 50,
  swipe_velocity_threshold: 0.3,
  swipe_prevent_scroll: false,

  // Animations
  expand_animation: EXPAND_ANIMATIONS.SLIDE,
  collapse_animation: COLLAPSE_ANIMATIONS.SLIDE,
  cards_animation: CARD_ANIMATIONS.FADE_UP,
  cards_stagger: 50,
  cards_direction: CARD_DIRECTIONS.SEQUENTIAL,
  animation_preset: ANIMATION_PRESETS.SMOOTH,
  animation_duration: 300
});

// =============================================================================
// PERFORMANCE BUDGETS
// =============================================================================

/**
 * Performance budget targets
 * @readonly
 * @type {Object}
 */
export const PERF_BUDGETS = Object.freeze({
  // Time To Interactive after setConfig()
  TTI_MS: 250,
  // Single render() duration
  RENDER_MS: 16,
  // HASS-driven update cost
  UPDATE_MS: 12,
  // Body lazy-load total duration
  BODY_LOAD_MS: 180,
  // Production bundle size budget in KB
  BUNDLE_SIZE_KB: 360
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
  LAZY_MIN_BATCH: 1,
  LAZY_MAX_BATCH: 25,
  LAZY_MIN_TIMEOUT_MS: 50,
  LAZY_MAX_TIMEOUT_MS: 5000,
  CARD_POOL_MAX_ENTRIES: 32,
  CARD_POOL_MAX_AGE_MS: 10 * 60 * 1000,
  CARD_POOL_HARD_MAX_ENTRIES: 512,
  POOL_MIN_TTL_MS: 1000,
  POOL_MAX_TTL_MS: 60 * 60 * 1000,
  POOL_MIN_MAX_ENTRIES: 1,
  POOL_MAX_MAX_ENTRIES: 512,
  AUTO_COLLAPSE_MAX_SECONDS: 3600,
  ANIMATION_DURATION_MAX_MS: 2000,
  CAROUSEL_MIN_INTERVAL_MS: 1000,
  CAROUSEL_MAX_INTERVAL_MS: 60000,
  CARDS_STAGGER_MAX_MS: 200,
  SWIPE_MAX_THRESHOLD_PX: 400,
  SWIPE_MAX_VELOCITY_THRESHOLD: 5,
  BADGE_MAX_PRECISION: 6,
  METRICS_HISTORY_SIZE: 200,
  
  // History
  MAX_UNDO_HISTORY: 50,
  
  // Debug
  MAX_LOG_ENTRIES: 1000
});
