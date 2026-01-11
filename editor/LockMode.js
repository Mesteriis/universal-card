/**
 * Lock Mode - блокировка от случайных изменений
 * 
 * Позволяет заблокировать карточку от случайных
 * изменений в edit mode.
 * 
 * @module editor/LockMode
 */

import { fireEvent } from '../utils/helpers.js';

/**
 * Уровни блокировки
 */
export const LOCK_LEVELS = {
  NONE: 'none',           // Без блокировки
  PARTIAL: 'partial',     // Частичная (разрешено редактирование)
  FULL: 'full'            // Полная блокировка
};

/**
 * Типы блокируемых действий
 */
export const LOCK_ACTIONS = {
  EDIT: 'edit',           // Редактирование конфига
  DELETE: 'delete',       // Удаление
  MOVE: 'move',           // Перемещение
  RESIZE: 'resize',       // Изменение размера
  DUPLICATE: 'duplicate'  // Дублирование
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  level: LOCK_LEVELS.NONE,
  lockedActions: [],      // Пустой = все действия заблокированы при level !== NONE
  password: null,         // Пароль для разблокировки (опционально)
  showIndicator: true,
  indicatorPosition: 'top-right'
};

/**
 * Класс для управления блокировкой
 */
export class LockMode {
  /**
   * @param {HTMLElement} element - Элемент карточки
   * @param {Object} config - Конфигурация
   */
  constructor(element, config = {}) {
    this._element = element;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._isLocked = this._config.level !== LOCK_LEVELS.NONE;
    this._indicator = null;
    this._callbacks = {
      onLock: null,
      onUnlock: null,
      onAttempt: null  // При попытке действия на заблокированной карточке
    };

    this._init();
  }

  /**
   * Инициализация
   */
  _init() {
    if (this._config.showIndicator && this._isLocked) {
      this._createIndicator();
    }

    this._updateElementState();
  }

  /**
   * Создаёт индикатор блокировки
   */
  _createIndicator() {
    this._indicator = document.createElement('div');
    this._indicator.className = `uc-lock-indicator uc-lock-${this._config.indicatorPosition}`;
    this._indicator.innerHTML = `
      <ha-icon icon="mdi:lock"></ha-icon>
      ${this._config.level === LOCK_LEVELS.FULL ? '<span>Заблокировано</span>' : ''}
    `;

    this._indicator.addEventListener('click', (e) => {
      e.stopPropagation();
      this._showUnlockDialog();
    });

    this._element.appendChild(this._indicator);
  }

  /**
   * Удаляет индикатор
   */
  _removeIndicator() {
    if (this._indicator) {
      this._indicator.remove();
      this._indicator = null;
    }
  }

  /**
   * Обновляет состояние элемента
   */
  _updateElementState() {
    this._element.classList.toggle('uc-locked', this._isLocked);
    this._element.classList.toggle('uc-locked-full', this._config.level === LOCK_LEVELS.FULL);
    this._element.classList.toggle('uc-locked-partial', this._config.level === LOCK_LEVELS.PARTIAL);
    this._element.dataset.lockLevel = this._config.level;
  }

  /**
   * Устанавливает callback
   * @param {string} event 
   * @param {Function} callback 
   */
  on(event, callback) {
    if (this._callbacks.hasOwnProperty(event)) {
      this._callbacks[event] = callback;
    }
  }

  /**
   * Блокирует карточку
   * @param {string} level - Уровень блокировки
   * @param {string[]} actions - Заблокированные действия
   */
  lock(level = LOCK_LEVELS.FULL, actions = []) {
    this._config.level = level;
    this._config.lockedActions = actions;
    this._isLocked = level !== LOCK_LEVELS.NONE;

    if (this._config.showIndicator && this._isLocked && !this._indicator) {
      this._createIndicator();
    }

    this._updateElementState();
    this._callbacks.onLock?.(level, actions);

    fireEvent(this._element, 'lock-changed', { locked: true, level, actions });
  }

  /**
   * Разблокирует карточку
   * @param {string} password - Пароль (если требуется)
   * @returns {boolean} Успех разблокировки
   */
  unlock(password = null) {
    // Проверяем пароль если установлен
    if (this._config.password && password !== this._config.password) {
      this._showError('Неверный пароль');
      return false;
    }

    this._config.level = LOCK_LEVELS.NONE;
    this._isLocked = false;
    
    this._removeIndicator();
    this._updateElementState();
    this._callbacks.onUnlock?.();

    fireEvent(this._element, 'lock-changed', { locked: false });
    return true;
  }

  /**
   * Переключает блокировку
   * @returns {boolean} Новое состояние
   */
  toggle() {
    if (this._isLocked) {
      return !this.unlock();
    } else {
      this.lock();
      return true;
    }
  }

  /**
   * Проверяет, заблокировано ли действие
   * @param {string} action 
   * @returns {boolean}
   */
  isActionLocked(action) {
    if (!this._isLocked) return false;
    
    // Полная блокировка - все действия заблокированы
    if (this._config.level === LOCK_LEVELS.FULL) return true;
    
    // Частичная блокировка - проверяем список
    if (this._config.lockedActions.length === 0) return true;
    return this._config.lockedActions.includes(action);
  }

  /**
   * Пытается выполнить действие
   * @param {string} action 
   * @param {Function} callback - Функция для выполнения если не заблокировано
   * @returns {boolean} Выполнено ли действие
   */
  attemptAction(action, callback) {
    if (this.isActionLocked(action)) {
      this._callbacks.onAttempt?.(action);
      this._showBlockedMessage(action);
      return false;
    }

    callback?.();
    return true;
  }

  /**
   * Показывает сообщение о блокировке
   * @param {string} action 
   */
  _showBlockedMessage(action) {
    const actionNames = {
      [LOCK_ACTIONS.EDIT]: 'редактирование',
      [LOCK_ACTIONS.DELETE]: 'удаление',
      [LOCK_ACTIONS.MOVE]: 'перемещение',
      [LOCK_ACTIONS.RESIZE]: 'изменение размера',
      [LOCK_ACTIONS.DUPLICATE]: 'дублирование'
    };

    const message = `Действие "${actionNames[action] || action}" заблокировано`;
    
    // Показываем toast
    this._showToast(message, 'warning');
  }

  /**
   * Показывает диалог разблокировки
   */
  _showUnlockDialog() {
    if (!this._config.password) {
      // Без пароля - просто разблокируем
      this.unlock();
      return;
    }

    // С паролем - показываем диалог
    const dialog = document.createElement('div');
    dialog.className = 'uc-lock-dialog';
    dialog.innerHTML = `
      <div class="uc-lock-dialog-backdrop"></div>
      <div class="uc-lock-dialog-content">
        <div class="uc-lock-dialog-header">
          <ha-icon icon="mdi:lock"></ha-icon>
          <span>Разблокировка</span>
        </div>
        <div class="uc-lock-dialog-body">
          <input type="password" 
                 class="uc-lock-password" 
                 placeholder="Введите пароль" 
                 autocomplete="off" />
        </div>
        <div class="uc-lock-dialog-footer">
          <button class="uc-lock-btn uc-lock-btn-cancel">Отмена</button>
          <button class="uc-lock-btn uc-lock-btn-unlock">Разблокировать</button>
        </div>
      </div>
    `;

    const input = dialog.querySelector('.uc-lock-password');
    const cancelBtn = dialog.querySelector('.uc-lock-btn-cancel');
    const unlockBtn = dialog.querySelector('.uc-lock-btn-unlock');
    const backdrop = dialog.querySelector('.uc-lock-dialog-backdrop');

    const close = () => dialog.remove();

    backdrop.addEventListener('click', close);
    cancelBtn.addEventListener('click', close);
    
    unlockBtn.addEventListener('click', () => {
      if (this.unlock(input.value)) {
        close();
      } else {
        input.classList.add('error');
        input.value = '';
        input.focus();
      }
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        unlockBtn.click();
      }
    });

    document.body.appendChild(dialog);
    input.focus();
  }

  /**
   * Показывает ошибку
   * @param {string} message 
   */
  _showError(message) {
    this._showToast(message, 'error');
  }

  /**
   * Показывает toast уведомление
   * @param {string} message 
   * @param {string} type 
   */
  _showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `uc-lock-toast uc-lock-toast-${type}`;
    toast.innerHTML = `
      <ha-icon icon="mdi:${type === 'error' ? 'alert-circle' : 'information'}"></ha-icon>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Анимация появления
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Автоскрытие
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Получает текущее состояние
   * @returns {Object}
   */
  getState() {
    return {
      locked: this._isLocked,
      level: this._config.level,
      lockedActions: this._config.lockedActions,
      hasPassword: !!this._config.password
    };
  }

  /**
   * Устанавливает пароль
   * @param {string} password 
   */
  setPassword(password) {
    this._config.password = password;
  }

  /**
   * Уничтожает экземпляр
   */
  destroy() {
    this._removeIndicator();
    this._element.classList.remove('uc-locked', 'uc-locked-full', 'uc-locked-partial');
    delete this._element.dataset.lockLevel;
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      /* Индикатор блокировки */
      .uc-lock-indicator {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: var(--error-color, #f44336);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        z-index: 100;
        transition: transform 0.2s, opacity 0.2s;
      }

      .uc-lock-indicator:hover {
        transform: scale(1.05);
      }

      .uc-lock-indicator ha-icon {
        --mdc-icon-size: 16px;
      }

      .uc-lock-top-right { top: 8px; right: 8px; }
      .uc-lock-top-left { top: 8px; left: 8px; }
      .uc-lock-bottom-right { bottom: 8px; right: 8px; }
      .uc-lock-bottom-left { bottom: 8px; left: 8px; }

      /* Состояние заблокированного элемента */
      .uc-locked {
        pointer-events: auto;
      }

      .uc-locked-full::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.05);
        z-index: 50;
        pointer-events: none;
      }

      /* Диалог */
      .uc-lock-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-lock-dialog-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      .uc-lock-dialog-content {
        position: relative;
        background: var(--ha-card-background, white);
        border-radius: 16px;
        width: 300px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: uc-lock-dialog-appear 0.2s ease;
      }

      @keyframes uc-lock-dialog-appear {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .uc-lock-dialog-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px;
        background: var(--primary-color);
        color: white;
        font-weight: 600;
      }

      .uc-lock-dialog-body {
        padding: 16px;
      }

      .uc-lock-password {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--divider-color);
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      .uc-lock-password:focus {
        border-color: var(--primary-color);
      }

      .uc-lock-password.error {
        border-color: var(--error-color);
        animation: uc-lock-shake 0.3s;
      }

      @keyframes uc-lock-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .uc-lock-dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid var(--divider-color);
      }

      .uc-lock-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .uc-lock-btn-cancel {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
      }

      .uc-lock-btn-unlock {
        background: var(--primary-color);
        color: white;
      }

      .uc-lock-btn:hover {
        filter: brightness(1.1);
      }

      /* Toast */
      .uc-lock-toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: var(--primary-text-color);
        color: var(--primary-background-color);
        border-radius: 8px;
        font-size: 14px;
        z-index: 10002;
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
      }

      .uc-lock-toast.visible {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }

      .uc-lock-toast-error {
        background: var(--error-color);
        color: white;
      }

      .uc-lock-toast-warning {
        background: var(--warning-color);
        color: white;
      }
    `;
  }
}

export default LockMode;
