/**
 * Universal Card - Entry Point
 * 
 * Этот файл собирает все модули в один бандл
 */

// =============================================================================
// CORE
// =============================================================================
import { 
  CARD_VERSION, 
  CARD_NAME, 
  CARD_DESCRIPTION, 
  BODY_MODES, 
  THEMES, 
  DEFAULTS,
  EVENTS,
  ACTION_TYPES,
  CONDITION_TYPES,
  CSS_VARS,
  LIMITS
} from '../core/constants.js';

import { UniversalCard } from '../core/UniversalCard.js';
import { UniversalCardEditor } from '../core/UniversalCardEditor.js';
import { ConfigManager, ConfigValidationError } from '../core/config.js';

// =============================================================================
// UTILS
// =============================================================================
import { 
  debounce, 
  throttle, 
  raf,
  rafDouble,
  batchUpdates,
  createBatchUpdater,
  whenIdle,
  measureTime
} from '../utils/performance.js';

import { 
  deepMerge, 
  deepClone,
  generateId, 
  isObject,
  isNonEmptyString,
  fireEvent,
  nextFrame,
  getNestedValue,
  ensureArray,
  formatNumber,
  formatDateTime,
  isValidEntityId
} from '../utils/helpers.js';

import { 
  getCardHelpers,
  createCardElement,
  createCardElements,
  createErrorCard,
  getEntityState,
  getStateValue,
  getAttributeValue,
  isState,
  executeAction,
  hapticFeedback,
  getThemeVariables,
  getCurrentUser,
  isUserAdmin
} from '../utils/ha-helpers.js';

// =============================================================================
// MODES
// =============================================================================
import { BaseMode } from '../modes/BaseMode.js';
import { ExpandMode } from '../modes/ExpandMode.js';
import { ModalMode } from '../modes/ModalMode.js';
import { FullscreenMode } from '../modes/FullscreenMode.js';
import { TabsMode } from '../modes/TabsMode.js';
import { CarouselMode } from '../modes/CarouselMode.js';
import { createMode, getAllModeStyles } from '../modes/index.js';

// =============================================================================
// FEATURES
// =============================================================================
import { VisibilityConditions } from '../features/VisibilityConditions.js';
import { StateStyles } from '../features/StateStyles.js';
import { SwipeGestures } from '../features/SwipeGestures.js';
import { ResponsiveBreakpoints } from '../features/ResponsiveBreakpoints.js';

// =============================================================================
// UI COMPONENTS
// =============================================================================
import { Header } from '../ui/Header.js';
import { Footer } from '../ui/Footer.js';
import { Badges } from '../ui/Badges.js';
import { ContextMenu } from '../ui/ContextMenu.js';
import { RadialMenu } from '../ui/RadialMenu.js';

// =============================================================================
// ADVANCED FEATURES
// =============================================================================
import { EntityPreview } from '../advanced/EntityPreview.js';
import { Alerts, ALERT_TYPES, ALERT_CONDITIONS } from '../advanced/Alerts.js';
import { QuickActions } from '../advanced/QuickActions.js';
import { Timer, TIMER_MODES, DISPLAY_FORMATS } from '../advanced/Timer.js';
import { IconMapping, PRESET_MAPPINGS } from '../advanced/IconMapping.js';
import { AnimationPresets, ANIMATION_CATEGORIES, PRESETS } from '../advanced/AnimationPresets.js';
import { 
  WebSocketOptimizerClass,
  getWebSocketOptimizer,
  createThrottledCallback,
  createDebouncedCallback,
  UPDATE_STRATEGIES,
  UPDATE_PRIORITY
} from '../advanced/WebSocketOptimizer.js';

// =============================================================================
// COMPLEX FEATURES
// =============================================================================
import { CardLinking } from '../complex/CardLinking.js';
import { AutoGrouping } from '../complex/AutoGrouping.js';
import { CompactMode } from '../complex/CompactMode.js';

// =============================================================================
// THEMES
// =============================================================================
import { Glassmorphism } from '../themes/Glassmorphism.js';
import { Neumorphism } from '../themes/Neumorphism.js';
import { BackgroundPatterns } from '../themes/BackgroundPatterns.js';
import { BorderAnimations } from '../themes/BorderAnimations.js';
import { HoverEffects } from '../themes/HoverEffects.js';
import { ColorSchemes } from '../themes/ColorSchemes.js';
import { LoadingVariants } from '../themes/LoadingVariants.js';
import { MicroInteractions } from '../themes/MicroInteractions.js';

// =============================================================================
// WIDGETS
// =============================================================================
import { RestApiWidget } from '../widgets/RestApiWidget.js';
import { ImageEntity } from '../widgets/ImageEntity.js';
import { MediaPlayerMini } from '../widgets/MediaPlayerMini.js';
import { NotificationCenter } from '../widgets/NotificationCenter.js';

// =============================================================================
// EDITOR
// =============================================================================
import { ConfigValidator } from '../editor/ConfigValidator.js';
import { DragDrop } from '../editor/DragDrop.js';
import { ResizableCards } from '../editor/ResizableCards.js';
import { LockMode } from '../editor/LockMode.js';
import { 
  TextInput,
  NumberInput,
  Checkbox,
  Select,
  EntityPicker,
  IconPicker,
  ColorPicker,
  Section,
  ActionEditor,
  getEditorStyles
} from '../editor/EditorComponents.js';
import { MultiLanguage } from '../editor/MultiLanguage.js';

// =============================================================================
// DEVTOOLS
// =============================================================================
import { EventLogger } from '../devtools/EventLogger.js';
import { StateInspector } from '../devtools/StateInspector.js';
import { PerformanceProfiler } from '../devtools/PerformanceProfiler.js';

// =============================================================================
// EXTENSIBILITY
// =============================================================================
import { PluginSystem } from '../extensibility/PluginSystem.js';
import { CustomCSS } from '../extensibility/CustomCSS.js';

// =============================================================================
// STYLES
// =============================================================================
import { HEADER_FOOTER_STYLES } from '../styles/header-footer.js';

// =============================================================================
// REGISTRATION
// =============================================================================

// Регистрируем custom elements
if (!customElements.get('universal-card')) {
  customElements.define('universal-card', UniversalCard);
}

if (!customElements.get('universal-card-editor')) {
  customElements.define('universal-card-editor', UniversalCardEditor);
}

// Регистрируем в Home Assistant card picker
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

// =============================================================================
// GLOBAL API
// =============================================================================

/**
 * Экспортируем глобальный API для плагинов и расширений
 */
window.UniversalCard = {
  version: CARD_VERSION,
  
  // Core classes
  UniversalCard,
  UniversalCardEditor,
  ConfigManager,
  
  // Mode factory
  createMode,
  getAllModeStyles,
  
  // Modes
  modes: {
    BaseMode,
    ExpandMode,
    ModalMode,
    FullscreenMode,
    TabsMode,
    CarouselMode
  },
  
  // Features
  features: {
    VisibilityConditions,
    StateStyles,
    SwipeGestures,
    ResponsiveBreakpoints
  },
  
  // UI Components
  ui: {
    Header,
    Footer,
    Badges,
    ContextMenu,
    RadialMenu
  },
  
  // Advanced Features
  advanced: {
    EntityPreview,
    Alerts,
    QuickActions,
    Timer,
    IconMapping,
    AnimationPresets,
    WebSocketOptimizer: WebSocketOptimizerClass,
    getWebSocketOptimizer,
    createThrottledCallback,
    createDebouncedCallback
  },
  
  // Complex Features
  complex: {
    CardLinking,
    AutoGrouping,
    CompactMode
  },
  
  // Themes
  themes: {
    Glassmorphism,
    Neumorphism,
    BackgroundPatterns,
    BorderAnimations,
    HoverEffects,
    ColorSchemes,
    LoadingVariants,
    MicroInteractions
  },
  
  // Widgets
  widgets: {
    RestApiWidget,
    ImageEntity,
    MediaPlayerMini,
    NotificationCenter
  },
  
  // Editor
  editor: {
    ConfigValidator,
    DragDrop,
    ResizableCards,
    LockMode,
    TextInput,
    NumberInput,
    Checkbox,
    Select,
    EntityPicker,
    IconPicker,
    ColorPicker,
    Section,
    ActionEditor,
    getEditorStyles,
    MultiLanguage
  },
  
  // DevTools
  devtools: {
    EventLogger,
    StateInspector,
    PerformanceProfiler
  },
  
  // Extensibility
  PluginSystem,
  CustomCSS,
  
  // Utils
  utils: {
    // Performance
    debounce,
    throttle,
    raf,
    rafDouble,
    batchUpdates,
    createBatchUpdater,
    whenIdle,
    measureTime,
    
    // Helpers
    deepMerge,
    deepClone,
    generateId,
    isObject,
    isNonEmptyString,
    fireEvent,
    nextFrame,
    getNestedValue,
    ensureArray,
    formatNumber,
    formatDateTime,
    isValidEntityId,
    
    // HA Helpers
    getCardHelpers,
    createCardElement,
    createCardElements,
    createErrorCard,
    getEntityState,
    getStateValue,
    getAttributeValue,
    isState,
    executeAction,
    hapticFeedback,
    getThemeVariables,
    getCurrentUser,
    isUserAdmin
  },
  
  // Constants
  constants: {
    BODY_MODES,
    THEMES,
    DEFAULTS,
    EVENTS,
    ACTION_TYPES,
    CONDITION_TYPES,
    CSS_VARS,
    LIMITS,
    ALERT_TYPES,
    ALERT_CONDITIONS,
    TIMER_MODES,
    DISPLAY_FORMATS,
    ANIMATION_CATEGORIES,
    PRESETS,
    PRESET_MAPPINGS,
    UPDATE_STRATEGIES,
    UPDATE_PRIORITY
  },
  
  // Config helpers
  config: {
    ConfigManager,
    ConfigValidationError
  }
};

// =============================================================================
// CONSOLE LOG
// =============================================================================

console.info(
  '%c 🎴 UNIVERSAL-CARD %c v' + CARD_VERSION + ' %c',
  'color: white; background: #3498db; font-weight: bold; padding: 2px 8px; border-radius: 4px 0 0 4px;',
  'color: #3498db; background: #ecf0f1; font-weight: bold; padding: 2px 8px; border-radius: 0 4px 4px 0;',
  ''
);

// Dev mode log
if (process.env.NODE_ENV === 'development') {
  console.info(
    '%c 🔧 DEV MODE %c All modules loaded',
    'color: white; background: #e74c3c; font-weight: bold; padding: 2px 8px;',
    'color: #e74c3c; padding: 2px 8px;'
  );
  console.log('window.UniversalCard API:', window.UniversalCard);
}
