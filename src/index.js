/**
 * Universal Card - Entry Point
 */
import { debug, setDebugMode } from '../utils/helpers.js';
debug('[UC] 1. Start loading');

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
debug('[UC] 2. Constants loaded');

import { UniversalCard } from '../core/UniversalCard.js';
debug('[UC] 3. UniversalCard loaded');

import { UniversalCardEditor } from '../core/UniversalCardEditor.js';
debug('[UC] 4. Editor loaded');

import { ConfigManager, ConfigValidationError } from '../core/config.js';
debug('[UC] 5. Config loaded');

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
debug('[UC] 6. Performance utils loaded');

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
debug('[UC] 7. Helpers loaded');

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
debug('[UC] 8. HA helpers loaded');

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
debug('[UC] 9. Modes loaded');

// =============================================================================
// FEATURES
// =============================================================================
import { VisibilityConditions } from '../features/VisibilityConditions.js';
import { StateStyles } from '../features/StateStyles.js';
import { SwipeGestures } from '../features/SwipeGestures.js';
import { ResponsiveBreakpoints } from '../features/ResponsiveBreakpoints.js';
debug('[UC] 10. Features loaded');

// =============================================================================
// UI COMPONENTS
// =============================================================================
import { Header } from '../ui/Header.js';
import { Footer } from '../ui/Footer.js';
import { Badges } from '../ui/Badges.js';
import { ContextMenu } from '../ui/ContextMenu.js';
import { RadialMenu } from '../ui/RadialMenu.js';
debug('[UC] 11. UI loaded');

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
debug('[UC] 12. Advanced loaded');

// =============================================================================
// COMPLEX FEATURES
// =============================================================================
import { CardLinking } from '../complex/CardLinking.js';
import { AutoGrouping } from '../complex/AutoGrouping.js';
import { CompactMode } from '../complex/CompactMode.js';
debug('[UC] 13. Complex loaded');

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
debug('[UC] 14. Themes loaded');

// =============================================================================
// WIDGETS
// =============================================================================
import { RestApiWidget } from '../widgets/RestApiWidget.js';
import { ImageEntity } from '../widgets/ImageEntity.js';
import { MediaPlayerMini } from '../widgets/MediaPlayerMini.js';
import { NotificationCenter } from '../widgets/NotificationCenter.js';
debug('[UC] 15. Widgets loaded');

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
debug('[UC] 16. Editor components loaded');

// =============================================================================
// DEVTOOLS
// =============================================================================
import { EventLogger } from '../devtools/EventLogger.js';
import { StateInspector } from '../devtools/StateInspector.js';
import { PerformanceProfiler } from '../devtools/PerformanceProfiler.js';
debug('[UC] 17. Devtools loaded');

// =============================================================================
// EXTENSIBILITY
// =============================================================================
import { PluginSystem } from '../extensibility/PluginSystem.js';
import { CustomCSS } from '../extensibility/CustomCSS.js';
debug('[UC] 18. Extensibility loaded');

// =============================================================================
// STYLES
// =============================================================================
import { HEADER_FOOTER_STYLES } from '../styles/header-footer.js';
debug('[UC] 19. Styles loaded');

// =============================================================================
// REGISTRATION
// =============================================================================
debug('[UC] 20. Starting registration...');

// Регистрируем custom elements
if (!customElements.get('universal-card')) {
  debug('[UC] 21. Defining universal-card...');
  customElements.define('universal-card', UniversalCard);
  debug('[UC] 22. universal-card defined');
}

if (!customElements.get('universal-card-editor')) {
  debug('[UC] 23. Defining universal-card-editor...');
  customElements.define('universal-card-editor', UniversalCardEditor);
  debug('[UC] 24. universal-card-editor defined');
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

// =============================================================================
// GLOBAL DEBUG FUNCTIONS
// =============================================================================

// Глобальный объект devtools
var __ucLogger = null;
var __ucProfiler = null;

// Функция поиска элементов во всех Shadow DOM
function findAllInShadowDOM(selector, root) {
  root = root || document;
  var results = [];
  
  // Поиск в текущем корне
  var found = root.querySelectorAll(selector);
  for (var i = 0; i < found.length; i++) {
    results.push(found[i]);
  }
  
  // Поиск во всех shadow roots
  var allElements = root.querySelectorAll('*');
  for (var j = 0; j < allElements.length; j++) {
    var el = allElements[j];
    if (el.shadowRoot) {
      var shadowResults = findAllInShadowDOM(selector, el.shadowRoot);
      for (var k = 0; k < shadowResults.length; k++) {
        results.push(shadowResults[k]);
      }
    }
  }
  
  return results;
}

window.__UC_DEVTOOLS__ = {
  get logger() {
    if (!__ucLogger) {
      __ucLogger = new EventLogger({ enabled: true });
    }
    return __ucLogger;
  },
  get profiler() {
    if (!__ucProfiler) {
      __ucProfiler = new PerformanceProfiler({ enabled: true });
    }
    return __ucProfiler;
  },
  
  // Поиск всех карточек (включая Shadow DOM)
  findCards: function() {
    return findAllInShadowDOM('universal-card');
  },
  
  showLogger: function() {
    this.logger.showPanel();
    return 'Logger panel opened';
  },
  showProfiler: function() {
    this.profiler.showPanel();
    return 'Profiler panel opened';
  },
  showInspector: function() {
    console.log('%c📊 State Inspector', 'color: #9b59b6; font-weight: bold;');
    console.log('All universal-card elements (including Shadow DOM):');
    var cards = this.findCards();
    cards.forEach(function(card, i) {
      console.log('Card ' + i + ':', {
        title: card._config ? card._config.title : 'unknown',
        config: card._config,
        expanded: card._expanded,
        hass: card._hass ? 'connected' : 'not connected',
        bodyCards: card._bodyCards ? card._bodyCards.length : 0
      });
    });
    return 'Found ' + cards.length + ' cards';
  },
  
  listCards: function() {
    var cards = this.findCards();
    console.table(Array.from(cards).map(function(c, i) {
      return {
        index: i,
        title: c._config ? c._config.title : 'unknown',
        mode: c._config ? c._config.body_mode : 'unknown',
        expanded: c._expanded
      };
    }));
    return cards.length + ' cards found';
  },
  
  toggleCard: function(index) {
    var cards = this.findCards();
    if (cards[index]) {
      cards[index]._toggle();
      return 'Toggled card ' + index;
    }
    return 'Card not found';
  },
  
  getCard: function(index) {
    var cards = this.findCards();
    return cards[index] || null;
  }
};

// Функция включения debug режима
window.enableUniversalCardDebug = function() {
  setDebugMode(true);
  console.log('%c🔧 Universal Card Debug Mode Enabled', 'color: #03a9f4; font-weight: bold; font-size: 14px;');
  console.log('');
  console.log('%cAvailable commands:', 'font-weight: bold;');
  console.log('  • __UC_DEVTOOLS__.listCards()       - List all cards');
  console.log('  • __UC_DEVTOOLS__.showInspector()   - Show card states');
  console.log('  • __UC_DEVTOOLS__.toggleCard(0)     - Toggle card by index');
  console.log('  • __UC_DEVTOOLS__.getCard(0)        - Get card element');
  console.log('  • __UC_DEVTOOLS__.showLogger()      - Show event logger');
  console.log('  • __UC_DEVTOOLS__.showProfiler()    - Show profiler');
  console.log('  • disableUniversalCardDebug()       - Disable debug mode');
  console.log('');
  console.log('%cQuick access:', 'font-weight: bold;');
  console.log('  • window.UniversalCard - Full API');
  return 'Debug mode enabled! Logs will now appear. Try __UC_DEVTOOLS__.listCards()';
};

// Функция выключения debug режима
window.disableUniversalCardDebug = function() {
  setDebugMode(false);
  console.log('%c🔧 Universal Card Debug Mode Disabled', 'color: #888; font-weight: bold;');
  return 'Debug mode disabled. Logs will be suppressed.';
};

debug('[UC] Debug functions registered: enableUniversalCardDebug(), __UC_DEVTOOLS__');
