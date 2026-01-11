/**
 * Widgets - экспорт всех виджетов
 * 
 * @module widgets
 */

// REST API Widget
export {
  RestApiWidget,
  HTTP_METHODS,
  DISPLAY_FORMATS
} from './RestApiWidget.js';

// Image Entity Widget
export {
  ImageEntity,
  IMAGE_FIT,
  SOURCE_TYPES
} from './ImageEntity.js';

// Media Player Mini Widget
export {
  MediaPlayerMini,
  DISPLAY_STYLES
} from './MediaPlayerMini.js';

// Notification Center Widget
export {
  NotificationCenter,
  NOTIFICATION_TYPES
} from './NotificationCenter.js';

/**
 * Собирает все стили виджетов
 * @returns {string}
 */
export function getAllWidgetStyles() {
  return [
    RestApiWidget.getStyles(),
    ImageEntity.getStyles(),
    MediaPlayerMini.getStyles(),
    NotificationCenter.getStyles()
  ].join('\n');
}

/**
 * Создаёт виджет по типу
 * @param {string} type - Тип виджета
 * @param {Object} hass - Home Assistant объект
 * @param {Object} config - Конфигурация
 * @returns {Object|null}
 */
export function createWidget(type, hass, config = {}) {
  switch (type) {
    case 'rest_api':
    case 'rest':
      return new RestApiWidget(hass, config);
      
    case 'image':
    case 'camera':
      return new ImageEntity(hass, config);
      
    case 'media_player':
    case 'media':
      return new MediaPlayerMini(hass, config);
      
    case 'notifications':
    case 'notification_center':
      return new NotificationCenter(hass, config);
      
    default:
      console.warn(`[Widgets] Unknown widget type: ${type}`);
      return null;
  }
}

// Импорты для getAllWidgetStyles
import { RestApiWidget } from './RestApiWidget.js';
import { ImageEntity } from './ImageEntity.js';
import { MediaPlayerMini } from './MediaPlayerMini.js';
import { NotificationCenter } from './NotificationCenter.js';
