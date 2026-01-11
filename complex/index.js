/**
 * Complex Features - экспорт сложных функций
 * 
 * @module complex
 */

// Card Linking - связывание карточек Master/Slave
export {
  CardLinking,
  getCardRegistry,
  LINK_EVENTS,
  SYNC_MODES
} from './CardLinking.js';

// Auto Grouping - автоматическая группировка entity
export {
  AutoGrouping,
  GROUPING_STRATEGIES,
  SORT_ORDER
} from './AutoGrouping.js';

// Compact Mode - адаптивный компактный режим
export {
  CompactMode,
  COMPACT_LEVELS,
  COMPACT_TRIGGERS
} from './CompactMode.js';

/**
 * Собирает все стили complex компонентов
 * @returns {string}
 */
export function getComplexStyles() {
  return CompactMode.getStyles();
}
