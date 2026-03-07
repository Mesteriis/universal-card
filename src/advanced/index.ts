/**
 * Advanced Features - экспорт всех продвинутых функций
 * 
 * @module advanced
 */

// Entity Preview - мини-спарклайн при наведении
export { EntityPreview } from './EntityPreview.js';

// Alerts - система оповещений и порогов
export { 
  Alerts,
  ALERT_TYPES,
  ALERT_CONDITIONS,
  ALERT_ACTIONS
} from './Alerts.js';

// Quick Actions - быстрые действия
export { 
  QuickActions,
  ACTION_TYPES
} from './QuickActions.js';

// Timer - таймер и обратный отсчёт
export { 
  Timer,
  TIMER_MODES,
  DISPLAY_FORMATS
} from './Timer.js';

// Icon Mapping - динамические иконки
export { 
  IconMapping,
  PRESET_MAPPINGS
} from './IconMapping.js';

// Animation Presets - библиотека анимаций
export { 
  AnimationPresets,
  PRESETS as ANIMATION_PRESETS,
  ANIMATION_CATEGORIES
} from './AnimationPresets.js';

// WebSocket Optimizer - оптимизация обновлений
export {
  getWebSocketOptimizer,
  createWebSocketOptimizer,
  createThrottledCallback,
  createDebouncedCallback,
  UPDATE_STRATEGIES,
  UPDATE_PRIORITY
} from './WebSocketOptimizer.js';

// Импорты для getAllAdvancedStyles
import { EntityPreview } from './EntityPreview.js';
import { Alerts } from './Alerts.js';
import { QuickActions } from './QuickActions.js';
import { Timer } from './Timer.js';
import { IconMapping } from './IconMapping.js';
import { AnimationPresets } from './AnimationPresets.js';

/**
 * Собирает все стили advanced компонентов
 * @returns {string}
 */
export function getAllAdvancedStyles() {
  return [
    EntityPreview.getStyles(),
    Alerts.getStyles(),
    QuickActions.getStyles(),
    Timer.getStyles(),
    IconMapping.getStyles(),
    AnimationPresets.getAllStyles()
  ].join('\n');
}

/**
 * Получает все стили через import (ES modules)
 * @returns {Promise<string>}
 */
export async function getAdvancedStylesAsync() {
  const [
    { EntityPreview },
    { Alerts },
    { QuickActions },
    { Timer },
    { IconMapping },
    { AnimationPresets }
  ] = await Promise.all([
    import('./EntityPreview.js'),
    import('./Alerts.js'),
    import('./QuickActions.js'),
    import('./Timer.js'),
    import('./IconMapping.js'),
    import('./AnimationPresets.js')
  ]);

  return [
    EntityPreview.getStyles(),
    Alerts.getStyles(),
    QuickActions.getStyles(),
    Timer.getStyles(),
    IconMapping.getStyles(),
    AnimationPresets.getAllStyles()
  ].join('\n');
}
