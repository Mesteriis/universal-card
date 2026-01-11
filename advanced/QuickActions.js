/**
 * Quick Actions - быстрые действия
 * 
 * Позволяет добавлять кнопки быстрых действий в header карточки
 * для мгновенного управления entity без открытия детальной информации.
 * 
 * @module advanced/QuickActions
 */

import { fireEvent } from '../utils/helpers.js';

/**
 * Типы быстрых действий
 */
export const ACTION_TYPES = {
  TOGGLE: 'toggle',           // Переключить состояние
  TURN_ON: 'turn_on',         // Включить
  TURN_OFF: 'turn_off',       // Выключить
  SERVICE: 'service',         // Вызвать сервис
  MORE_INFO: 'more-info',     // Показать больше информации
  NAVIGATE: 'navigate',       // Навигация
  URL: 'url',                 // Открыть URL
  FIRE_EVENT: 'fire-event',   // Вызвать событие
  SCRIPT: 'script',           // Запустить скрипт
  SCENE: 'scene'              // Активировать сцену
};

/**
 * Иконки по умолчанию для действий
 */
const DEFAULT_ICONS = {
  [ACTION_TYPES.TOGGLE]: 'mdi:toggle-switch',
  [ACTION_TYPES.TURN_ON]: 'mdi:power',
  [ACTION_TYPES.TURN_OFF]: 'mdi:power-off',
  [ACTION_TYPES.SERVICE]: 'mdi:cog',
  [ACTION_TYPES.MORE_INFO]: 'mdi:information',
  [ACTION_TYPES.NAVIGATE]: 'mdi:arrow-right',
  [ACTION_TYPES.URL]: 'mdi:open-in-new',
  [ACTION_TYPES.FIRE_EVENT]: 'mdi:broadcast',
  [ACTION_TYPES.SCRIPT]: 'mdi:script-text',
  [ACTION_TYPES.SCENE]: 'mdi:palette'
};

/**
 * Класс для управления быстрыми действиями
 */
export class QuickActions {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = config;
    this._actions = [];
    this._element = null;
    this._confirmDialog = null;
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
    this._updateStates();
  }

  /**
   * Устанавливает конфигурацию действий
   * @param {Array} actions - Массив конфигураций действий
   */
  setActions(actions) {
    this._actions = actions.map((action, index) => ({
      id: action.id || `action_${index}`,
      type: action.type || ACTION_TYPES.SERVICE,
      name: action.name,
      icon: action.icon || DEFAULT_ICONS[action.type] || 'mdi:gesture-tap',
      entity_id: action.entity_id,
      service: action.service,
      service_data: action.service_data,
      target: action.target,
      navigation_path: action.navigation_path,
      url: action.url,
      url_new_tab: action.url_new_tab !== false,
      event: action.event,
      event_data: action.event_data,
      confirmation: action.confirmation,
      show_state: action.show_state,
      disabled_when: action.disabled_when,
      hidden_when: action.hidden_when,
      color: action.color,
      active_color: action.active_color || 'var(--primary-color)'
    }));
  }

  /**
   * Создаёт DOM элемент с действиями
   * @returns {HTMLElement}
   */
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-quick-actions';

    for (const action of this._actions) {
      const button = this._createActionButton(action);
      if (button) {
        this._element.appendChild(button);
      }
    }

    return this._element;
  }

  /**
   * Создаёт кнопку действия
   * @param {Object} action 
   * @returns {HTMLElement|null}
   */
  _createActionButton(action) {
    // Проверяем условие скрытия
    if (this._evaluateCondition(action.hidden_when)) {
      return null;
    }

    const button = document.createElement('button');
    button.className = 'uc-quick-action';
    button.dataset.actionId = action.id;
    
    // Проверяем состояние disabled
    const isDisabled = this._evaluateCondition(action.disabled_when);
    if (isDisabled) {
      button.disabled = true;
      button.classList.add('disabled');
    }

    // Проверяем активное состояние (для toggle)
    const isActive = this._isActionActive(action);
    if (isActive) {
      button.classList.add('active');
    }

    // Иконка
    const iconEl = document.createElement('ha-icon');
    iconEl.setAttribute('icon', action.icon);
    button.appendChild(iconEl);

    // Название (опционально)
    if (action.name) {
      const nameEl = document.createElement('span');
      nameEl.className = 'uc-action-name';
      nameEl.textContent = action.name;
      button.appendChild(nameEl);
    }

    // Состояние entity (опционально)
    if (action.show_state && action.entity_id) {
      const stateEl = document.createElement('span');
      stateEl.className = 'uc-action-state';
      stateEl.textContent = this._getEntityState(action.entity_id);
      button.appendChild(stateEl);
    }

    // Цвет
    if (action.color) {
      button.style.setProperty('--action-color', action.color);
    }
    if (isActive && action.active_color) {
      button.style.setProperty('--action-color', action.active_color);
    }

    // Обработчик клика
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this._executeAction(action);
    });

    // Tooltip
    if (action.name) {
      button.title = action.name;
    }

    return button;
  }

  /**
   * Выполняет действие
   * @param {Object} action 
   */
  async _executeAction(action) {
    // Подтверждение
    if (action.confirmation) {
      const confirmed = await this._showConfirmation(action.confirmation);
      if (!confirmed) return;
    }

    switch (action.type) {
      case ACTION_TYPES.TOGGLE:
        this._executeToggle(action);
        break;
        
      case ACTION_TYPES.TURN_ON:
        this._executeTurnOn(action);
        break;
        
      case ACTION_TYPES.TURN_OFF:
        this._executeTurnOff(action);
        break;
        
      case ACTION_TYPES.SERVICE:
        this._executeService(action);
        break;
        
      case ACTION_TYPES.MORE_INFO:
        this._executeMoreInfo(action);
        break;
        
      case ACTION_TYPES.NAVIGATE:
        this._executeNavigate(action);
        break;
        
      case ACTION_TYPES.URL:
        this._executeUrl(action);
        break;
        
      case ACTION_TYPES.FIRE_EVENT:
        this._executeFireEvent(action);
        break;
        
      case ACTION_TYPES.SCRIPT:
        this._executeScript(action);
        break;
        
      case ACTION_TYPES.SCENE:
        this._executeScene(action);
        break;
    }

    // Визуальная обратная связь
    this._animateButton(action.id);
  }

  /**
   * Переключает состояние entity
   * @param {Object} action 
   */
  _executeToggle(action) {
    if (!action.entity_id) return;
    
    const domain = action.entity_id.split('.')[0];
    let service = 'toggle';
    
    // Некоторые домены не поддерживают toggle
    if (['script', 'scene'].includes(domain)) {
      service = 'turn_on';
    }
    
    this._hass.callService(domain, service, {
      entity_id: action.entity_id
    });
  }

  /**
   * Включает entity
   * @param {Object} action 
   */
  _executeTurnOn(action) {
    if (!action.entity_id) return;
    
    const domain = action.entity_id.split('.')[0];
    this._hass.callService(domain, 'turn_on', {
      entity_id: action.entity_id,
      ...action.service_data
    });
  }

  /**
   * Выключает entity
   * @param {Object} action 
   */
  _executeTurnOff(action) {
    if (!action.entity_id) return;
    
    const domain = action.entity_id.split('.')[0];
    this._hass.callService(domain, 'turn_off', {
      entity_id: action.entity_id
    });
  }

  /**
   * Вызывает сервис
   * @param {Object} action 
   */
  _executeService(action) {
    if (!action.service) return;
    
    const [domain, service] = action.service.split('.');
    if (!domain || !service) return;

    const serviceData = { ...action.service_data };
    
    // Добавляем target если указан
    if (action.target) {
      this._hass.callService(domain, service, serviceData, action.target);
    } else if (action.entity_id) {
      serviceData.entity_id = action.entity_id;
      this._hass.callService(domain, service, serviceData);
    } else {
      this._hass.callService(domain, service, serviceData);
    }
  }

  /**
   * Показывает больше информации об entity
   * @param {Object} action 
   */
  _executeMoreInfo(action) {
    if (!action.entity_id) return;
    
    fireEvent(window, 'hass-more-info', {
      entityId: action.entity_id
    });
  }

  /**
   * Навигация
   * @param {Object} action 
   */
  _executeNavigate(action) {
    if (!action.navigation_path) return;
    
    history.pushState(null, '', action.navigation_path);
    fireEvent(window, 'location-changed');
  }

  /**
   * Открывает URL
   * @param {Object} action 
   */
  _executeUrl(action) {
    if (!action.url) return;
    
    if (action.url_new_tab) {
      window.open(action.url, '_blank');
    } else {
      window.location.href = action.url;
    }
  }

  /**
   * Вызывает событие
   * @param {Object} action 
   */
  _executeFireEvent(action) {
    if (!action.event) return;
    
    this._hass.callApi('POST', 'events/' + action.event, action.event_data || {});
  }

  /**
   * Запускает скрипт
   * @param {Object} action 
   */
  _executeScript(action) {
    if (!action.entity_id) return;
    
    this._hass.callService('script', 'turn_on', {
      entity_id: action.entity_id,
      ...action.service_data
    });
  }

  /**
   * Активирует сцену
   * @param {Object} action 
   */
  _executeScene(action) {
    if (!action.entity_id) return;
    
    this._hass.callService('scene', 'turn_on', {
      entity_id: action.entity_id
    });
  }

  /**
   * Показывает диалог подтверждения
   * @param {string|Object} confirmation 
   * @returns {Promise<boolean>}
   */
  async _showConfirmation(confirmation) {
    const message = typeof confirmation === 'string' 
      ? confirmation 
      : confirmation.text || 'Вы уверены?';
    
    return new Promise((resolve) => {
      // Создаём диалог
      const dialog = document.createElement('div');
      dialog.className = 'uc-confirm-dialog';
      dialog.innerHTML = `
        <div class="uc-confirm-backdrop"></div>
        <div class="uc-confirm-content">
          <div class="uc-confirm-message">${message}</div>
          <div class="uc-confirm-buttons">
            <button class="uc-confirm-cancel">Отмена</button>
            <button class="uc-confirm-ok">OK</button>
          </div>
        </div>
      `;

      dialog.querySelector('.uc-confirm-backdrop').addEventListener('click', () => {
        dialog.remove();
        resolve(false);
      });

      dialog.querySelector('.uc-confirm-cancel').addEventListener('click', () => {
        dialog.remove();
        resolve(false);
      });

      dialog.querySelector('.uc-confirm-ok').addEventListener('click', () => {
        dialog.remove();
        resolve(true);
      });

      document.body.appendChild(dialog);
      
      // Фокус на OK для быстрого подтверждения Enter
      setTimeout(() => {
        dialog.querySelector('.uc-confirm-ok').focus();
      }, 10);
    });
  }

  /**
   * Проверяет активное состояние действия
   * @param {Object} action 
   * @returns {boolean}
   */
  _isActionActive(action) {
    if (!action.entity_id) return false;
    
    const state = this._hass?.states?.[action.entity_id];
    if (!state) return false;

    return ['on', 'playing', 'home', 'open', 'unlocked'].includes(state.state);
  }

  /**
   * Оценивает условие
   * @param {Object|string} condition 
   * @returns {boolean}
   */
  _evaluateCondition(condition) {
    if (!condition) return false;
    
    // Строковое условие - просто entity_id для проверки on/off
    if (typeof condition === 'string') {
      const state = this._hass?.states?.[condition];
      return state?.state === 'on';
    }

    // Объект условия
    if (condition.entity_id) {
      const state = this._hass?.states?.[condition.entity_id];
      if (!state) return false;

      if (condition.state !== undefined) {
        return state.state === String(condition.state);
      }
      
      if (condition.state_not !== undefined) {
        return state.state !== String(condition.state_not);
      }

      const numValue = parseFloat(state.state);
      if (condition.above !== undefined) {
        return numValue > condition.above;
      }
      if (condition.below !== undefined) {
        return numValue < condition.below;
      }
    }

    return false;
  }

  /**
   * Получает состояние entity
   * @param {string} entityId 
   * @returns {string}
   */
  _getEntityState(entityId) {
    const state = this._hass?.states?.[entityId];
    if (!state) return '-';
    
    const unit = state.attributes?.unit_of_measurement;
    return unit ? `${state.state} ${unit}` : state.state;
  }

  /**
   * Анимирует кнопку при клике
   * @param {string} actionId 
   */
  _animateButton(actionId) {
    if (!this._element) return;
    
    const button = this._element.querySelector(`[data-action-id="${actionId}"]`);
    if (!button) return;

    button.classList.add('uc-action-clicked');
    setTimeout(() => {
      button.classList.remove('uc-action-clicked');
    }, 300);
  }

  /**
   * Обновляет состояния кнопок
   */
  _updateStates() {
    if (!this._element) return;

    for (const action of this._actions) {
      const button = this._element.querySelector(`[data-action-id="${action.id}"]`);
      if (!button) continue;

      // Обновляем активное состояние
      const isActive = this._isActionActive(action);
      button.classList.toggle('active', isActive);

      // Обновляем состояние entity
      if (action.show_state && action.entity_id) {
        const stateEl = button.querySelector('.uc-action-state');
        if (stateEl) {
          stateEl.textContent = this._getEntityState(action.entity_id);
        }
      }

      // Обновляем disabled
      const isDisabled = this._evaluateCondition(action.disabled_when);
      button.disabled = isDisabled;
      button.classList.toggle('disabled', isDisabled);
    }
  }

  /**
   * Уничтожает компонент
   */
  destroy() {
    if (this._element) {
      this._element.remove();
      this._element = null;
    }
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-quick-actions {
        display: flex;
        gap: 4px;
        align-items: center;
        flex-wrap: wrap;
      }

      .uc-quick-action {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 6px 10px;
        border: none;
        border-radius: 8px;
        background: var(--action-color, var(--primary-background-color, rgba(0,0,0,0.05)));
        color: var(--primary-text-color);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 12px;
        min-width: 32px;
        min-height: 32px;
      }

      .uc-quick-action:hover:not(.disabled) {
        background: var(--action-color, var(--primary-color));
        color: var(--text-primary-color, white);
        transform: translateY(-1px);
      }

      .uc-quick-action:active:not(.disabled) {
        transform: translateY(0) scale(0.95);
      }

      .uc-quick-action.active {
        background: var(--action-color, var(--primary-color));
        color: var(--text-primary-color, white);
      }

      .uc-quick-action.disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .uc-quick-action.uc-action-clicked {
        animation: uc-action-ripple 0.3s ease;
      }

      @keyframes uc-action-ripple {
        0% { transform: scale(1); }
        50% { transform: scale(0.9); }
        100% { transform: scale(1); }
      }

      .uc-quick-action ha-icon {
        --mdc-icon-size: 18px;
      }

      .uc-action-name {
        white-space: nowrap;
      }

      .uc-action-state {
        font-size: 11px;
        opacity: 0.8;
        white-space: nowrap;
      }

      /* Диалог подтверждения */
      .uc-confirm-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-confirm-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      .uc-confirm-content {
        position: relative;
        background: var(--ha-card-background, white);
        border-radius: 16px;
        padding: 24px;
        min-width: 280px;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: uc-confirm-appear 0.2s ease;
      }

      @keyframes uc-confirm-appear {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .uc-confirm-message {
        font-size: 16px;
        color: var(--primary-text-color);
        margin-bottom: 20px;
        text-align: center;
      }

      .uc-confirm-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .uc-confirm-cancel,
      .uc-confirm-ok {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .uc-confirm-cancel {
        background: var(--secondary-background-color, #f0f0f0);
        color: var(--primary-text-color);
      }

      .uc-confirm-cancel:hover {
        background: var(--disabled-color, #ddd);
      }

      .uc-confirm-ok {
        background: var(--primary-color, #03a9f4);
        color: white;
      }

      .uc-confirm-ok:hover {
        filter: brightness(1.1);
      }

      .uc-confirm-ok:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
    `;
  }
}

export default QuickActions;
