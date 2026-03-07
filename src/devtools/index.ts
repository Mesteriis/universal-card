/**
 * DevTools - инструменты разработчика
 * 
 * @module devtools
 */

// Event Logger
export {
  EventLogger,
  LOG_LEVELS,
  EVENT_CATEGORIES,
  getLogger
} from './EventLogger.js';

// State Inspector
export {
  StateInspector
} from './StateInspector.js';

// Performance Profiler
export {
  PerformanceProfiler,
  METRIC_TYPES,
  getProfiler
} from './PerformanceProfiler.js';

import { getLogger, EventLogger } from './EventLogger.js';
import { StateInspector } from './StateInspector.js';
import { getProfiler, PerformanceProfiler } from './PerformanceProfiler.js';

type DevToolsOptions = {
  debug?: boolean;
  exposeGlobally?: boolean;
};

/**
 * Собирает все стили devtools
 * @returns {string}
 */
export function getDevToolsStyles() {
  return [
    EventLogger.getStyles(),
    StateInspector.getStyles(),
    PerformanceProfiler.getStyles()
  ].join('\n');
}

/**
 * Инициализирует все devtools для карточки
 * @param {HTMLElement} cardElement - Элемент карточки
 * @param {Object} options - Опции
 * @returns {Object} DevTools объект
 */
export function initDevTools(cardElement: HTMLElement, options: DevToolsOptions = {}) {
  const logger = getLogger();
  const inspector = new StateInspector(cardElement);
  const profiler = getProfiler();

  // Включаем если в debug mode
  if (options.debug) {
    logger.enable();
    inspector.enable();
    profiler.enable();
  }

  return {
    logger,
    inspector,
    profiler,

    /**
     * Включает все инструменты
     */
    enableAll() {
      logger.enable();
      inspector.enable();
      profiler.enable();
    },

    /**
     * Выключает все инструменты
     */
    disableAll() {
      logger.disable();
      inspector.disable();
      profiler.disable();
    },

    /**
     * Показывает все панели
     */
    showAll() {
      logger.showPanel();
      inspector.showPanel();
      profiler.showPanel();
    },

    /**
     * Скрывает все панели
     */
    hideAll() {
      logger.hidePanel();
      inspector.hidePanel();
      profiler.hidePanel();
    },

    /**
     * Уничтожает все инструменты
     */
    destroy() {
      inspector.destroy();
      profiler.destroy();
      // Logger не уничтожаем - он глобальный
    }
  };
}

/**
 * Debug Mode - консольная команда для включения debug
 */
if (typeof window !== 'undefined') {
  window.enableUniversalCardDebug = () => {
    const logger = getLogger();
    const profiler = getProfiler();
    
    logger.enable();
    profiler.enable();
    
    console.log('%c🔧 Universal Card Debug Mode Enabled', 'color: #03a9f4; font-weight: bold; font-size: 14px;');
    console.log('Available commands:');
    console.log('  • window.__UC_DEVTOOLS__.showLogger()');
    console.log('  • window.__UC_DEVTOOLS__.showInspector()');
    console.log('  • window.__UC_DEVTOOLS__.showProfiler()');
    
    return 'Debug mode enabled. Check console for available commands.';
  };
}
