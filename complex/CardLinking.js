/**
 * Card Linking - связывание карточек Master/Slave
 * 
 * Позволяет одной карточке (Master) управлять состоянием
 * других карточек (Slave) для синхронизации действий.
 * 
 * @module complex/CardLinking
 */

import { fireEvent } from '../utils/helpers.js';

/**
 * Типы событий связывания
 */
export const LINK_EVENTS = {
  STATE_CHANGE: 'uc-link-state-change',
  EXPAND: 'uc-link-expand',
  COLLAPSE: 'uc-link-collapse',
  TOGGLE: 'uc-link-toggle',
  TAB_CHANGE: 'uc-link-tab-change',
  CUSTOM: 'uc-link-custom'
};

/**
 * Режимы синхронизации
 */
export const SYNC_MODES = {
  MIRROR: 'mirror',           // Полное зеркалирование
  EXPAND_ONLY: 'expand_only', // Только раскрытие
  COLLAPSE_ONLY: 'collapse_only', // Только сворачивание
  INVERSE: 'inverse',         // Инверсное поведение
  CUSTOM: 'custom'            // Кастомная логика
};

/**
 * Реестр связанных карточек (Singleton)
 */
class CardRegistry {
  constructor() {
    this._groups = new Map();     // groupId -> Set<card>
    this._masters = new Map();    // groupId -> card
    this._slaves = new Map();     // groupId -> Set<card>
    this._listeners = new Map();  // card -> Map<event, handlers>
  }

  /**
   * Регистрирует карточку в группе
   * @param {string} groupId - ID группы
   * @param {HTMLElement} card - Элемент карточки
   * @param {Object} options - Опции регистрации
   */
  register(groupId, card, options = {}) {
    const { role = 'slave', syncMode = SYNC_MODES.MIRROR } = options;

    // Добавляем в общую группу
    if (!this._groups.has(groupId)) {
      this._groups.set(groupId, new Set());
      this._slaves.set(groupId, new Set());
    }
    
    this._groups.get(groupId).add(card);

    // Определяем роль
    if (role === 'master') {
      this._masters.set(groupId, card);
      this._setupMasterListeners(groupId, card);
    } else {
      this._slaves.get(groupId).add(card);
      this._setupSlaveListeners(groupId, card, syncMode);
    }

    // Сохраняем метаданные
    card._ucLinkData = { groupId, role, syncMode };
  }

  /**
   * Удаляет карточку из группы
   * @param {string} groupId 
   * @param {HTMLElement} card 
   */
  unregister(groupId, card) {
    const group = this._groups.get(groupId);
    if (group) {
      group.delete(card);
      if (group.size === 0) {
        this._groups.delete(groupId);
        this._masters.delete(groupId);
        this._slaves.delete(groupId);
      }
    }

    // Удаляем слушатели
    this._removeListeners(card);

    // Очищаем метаданные
    delete card._ucLinkData;
  }

  /**
   * Настраивает слушатели для master карточки
   * @param {string} groupId 
   * @param {HTMLElement} master 
   */
  _setupMasterListeners(groupId, master) {
    const handlers = new Map();

    // Слушаем изменения состояния master
    const stateHandler = (e) => {
      this._broadcastToSlaves(groupId, LINK_EVENTS.STATE_CHANGE, e.detail);
    };

    const expandHandler = () => {
      this._broadcastToSlaves(groupId, LINK_EVENTS.EXPAND, {});
    };

    const collapseHandler = () => {
      this._broadcastToSlaves(groupId, LINK_EVENTS.COLLAPSE, {});
    };

    const toggleHandler = (e) => {
      this._broadcastToSlaves(groupId, LINK_EVENTS.TOGGLE, e.detail);
    };

    const tabHandler = (e) => {
      this._broadcastToSlaves(groupId, LINK_EVENTS.TAB_CHANGE, e.detail);
    };

    master.addEventListener('uc-state-changed', stateHandler);
    master.addEventListener('uc-expanded', expandHandler);
    master.addEventListener('uc-collapsed', collapseHandler);
    master.addEventListener('uc-toggled', toggleHandler);
    master.addEventListener('uc-tab-changed', tabHandler);

    handlers.set('uc-state-changed', stateHandler);
    handlers.set('uc-expanded', expandHandler);
    handlers.set('uc-collapsed', collapseHandler);
    handlers.set('uc-toggled', toggleHandler);
    handlers.set('uc-tab-changed', tabHandler);

    this._listeners.set(master, handlers);
  }

  /**
   * Настраивает слушатели для slave карточки
   * @param {string} groupId 
   * @param {HTMLElement} slave 
   * @param {string} syncMode 
   */
  _setupSlaveListeners(groupId, slave, syncMode) {
    const handlers = new Map();

    const handleLinkEvent = (e) => {
      const { type, detail } = e;
      
      // Игнорируем события от самой карточки
      if (e.target === slave) return;

      this._applySyncAction(slave, type, detail, syncMode);
    };

    // Слушаем события связывания на window
    for (const eventType of Object.values(LINK_EVENTS)) {
      const handler = (e) => {
        if (e.detail?.groupId === groupId) {
          handleLinkEvent({ type: eventType, detail: e.detail });
        }
      };
      
      window.addEventListener(eventType, handler);
      handlers.set(eventType, handler);
    }

    this._listeners.set(slave, handlers);
  }

  /**
   * Удаляет слушатели карточки
   * @param {HTMLElement} card 
   */
  _removeListeners(card) {
    const handlers = this._listeners.get(card);
    if (!handlers) return;

    const data = card._ucLinkData;
    
    if (data?.role === 'master') {
      for (const [event, handler] of handlers) {
        card.removeEventListener(event, handler);
      }
    } else {
      for (const [event, handler] of handlers) {
        window.removeEventListener(event, handler);
      }
    }

    this._listeners.delete(card);
  }

  /**
   * Рассылает событие всем slave карточкам
   * @param {string} groupId 
   * @param {string} eventType 
   * @param {Object} detail 
   */
  _broadcastToSlaves(groupId, eventType, detail) {
    fireEvent(window, eventType, { ...detail, groupId });
  }

  /**
   * Применяет действие синхронизации
   * @param {HTMLElement} slave 
   * @param {string} eventType 
   * @param {Object} detail 
   * @param {string} syncMode 
   */
  _applySyncAction(slave, eventType, detail, syncMode) {
    // Проверяем режим синхронизации
    if (syncMode === SYNC_MODES.EXPAND_ONLY && eventType !== LINK_EVENTS.EXPAND) {
      return;
    }
    if (syncMode === SYNC_MODES.COLLAPSE_ONLY && eventType !== LINK_EVENTS.COLLAPSE) {
      return;
    }

    // Применяем действие
    switch (eventType) {
      case LINK_EVENTS.EXPAND:
        if (syncMode === SYNC_MODES.INVERSE) {
          slave._collapse?.();
        } else {
          slave._expand?.();
        }
        break;

      case LINK_EVENTS.COLLAPSE:
        if (syncMode === SYNC_MODES.INVERSE) {
          slave._expand?.();
        } else {
          slave._collapse?.();
        }
        break;

      case LINK_EVENTS.TOGGLE:
        slave._toggle?.();
        break;

      case LINK_EVENTS.TAB_CHANGE:
        if (slave._setActiveTab && detail.tabIndex !== undefined) {
          slave._setActiveTab(detail.tabIndex);
        }
        break;

      case LINK_EVENTS.STATE_CHANGE:
        // Кастомная обработка изменения состояния
        if (slave._handleLinkedStateChange) {
          slave._handleLinkedStateChange(detail);
        }
        break;
    }
  }

  /**
   * Получает все карточки группы
   * @param {string} groupId 
   * @returns {Set<HTMLElement>}
   */
  getGroup(groupId) {
    return this._groups.get(groupId) || new Set();
  }

  /**
   * Получает master карточку группы
   * @param {string} groupId 
   * @returns {HTMLElement|undefined}
   */
  getMaster(groupId) {
    return this._masters.get(groupId);
  }

  /**
   * Получает все slave карточки группы
   * @param {string} groupId 
   * @returns {Set<HTMLElement>}
   */
  getSlaves(groupId) {
    return this._slaves.get(groupId) || new Set();
  }

  /**
   * Проверяет существование группы
   * @param {string} groupId 
   * @returns {boolean}
   */
  hasGroup(groupId) {
    return this._groups.has(groupId);
  }

  /**
   * Отправляет кастомное событие группе
   * @param {string} groupId 
   * @param {string} eventName 
   * @param {Object} data 
   */
  sendToGroup(groupId, eventName, data = {}) {
    fireEvent(window, LINK_EVENTS.CUSTOM, {
      groupId,
      eventName,
      data
    });
  }

  /**
   * Очищает все регистрации
   */
  clear() {
    for (const [groupId, cards] of this._groups) {
      for (const card of cards) {
        this.unregister(groupId, card);
      }
    }
  }
}

// Singleton экземпляр
let registryInstance = null;

/**
 * Получает экземпляр реестра
 * @returns {CardRegistry}
 */
export function getCardRegistry() {
  if (!registryInstance) {
    registryInstance = new CardRegistry();
  }
  return registryInstance;
}

/**
 * Класс для управления связыванием конкретной карточки
 */
export class CardLinking {
  /**
   * @param {HTMLElement} card - Элемент карточки
   * @param {Object} config - Конфигурация связывания
   */
  constructor(card, config = {}) {
    this._card = card;
    this._config = config;
    this._registry = getCardRegistry();
  }

  /**
   * Устанавливает конфигурацию
   * @param {Object} config 
   */
  setConfig(config) {
    // Отменяем предыдущую регистрацию
    if (this._config.group_id) {
      this._registry.unregister(this._config.group_id, this._card);
    }

    this._config = config;

    // Регистрируем с новой конфигурацией
    if (config.group_id) {
      this._registry.register(config.group_id, this._card, {
        role: config.role || 'slave',
        syncMode: config.sync_mode || SYNC_MODES.MIRROR
      });
    }
  }

  /**
   * Отправляет событие связанным карточкам
   * @param {string} eventType 
   * @param {Object} detail 
   */
  broadcast(eventType, detail = {}) {
    if (!this._config.group_id) return;
    
    if (this._config.role === 'master') {
      fireEvent(this._card, eventType, detail);
    }
  }

  /**
   * Отправляет кастомное событие
   * @param {string} eventName 
   * @param {Object} data 
   */
  sendCustomEvent(eventName, data = {}) {
    if (!this._config.group_id) return;
    this._registry.sendToGroup(this._config.group_id, eventName, data);
  }

  /**
   * Проверяет, является ли карточка master
   * @returns {boolean}
   */
  isMaster() {
    return this._config.role === 'master';
  }

  /**
   * Получает информацию о группе
   * @returns {Object}
   */
  getGroupInfo() {
    const groupId = this._config.group_id;
    if (!groupId) return null;

    return {
      id: groupId,
      totalCards: this._registry.getGroup(groupId).size,
      hasMaster: !!this._registry.getMaster(groupId),
      slavesCount: this._registry.getSlaves(groupId).size
    };
  }

  /**
   * Уничтожает связывание
   */
  destroy() {
    if (this._config.group_id) {
      this._registry.unregister(this._config.group_id, this._card);
    }
  }
}

export default CardLinking;
