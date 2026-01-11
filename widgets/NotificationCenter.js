/**
 * Notification Center Widget - центр уведомлений
 * 
 * Отображает недавние уведомления из Home Assistant.
 * 
 * @module widgets/NotificationCenter
 */

/**
 * Типы уведомлений
 */
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  max_items: 10,
  show_timestamp: true,
  show_source: true,
  show_actions: true,
  auto_dismiss: 0,            // 0 = не скрывать автоматически
  group_by_source: false,
  filter_sources: [],         // Пустой = все источники
  exclude_sources: [],
  compact: false
};

/**
 * Класс центра уведомлений
 */
export class NotificationCenter {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._element = null;
    this._notifications = [];
    this._dismissedIds = new Set();
    this._unsubscribe = null;
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
    this._loadNotifications();
  }

  /**
   * Устанавливает конфигурацию
   * @param {Object} config 
   */
  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Создаёт DOM элемент
   * @returns {HTMLElement}
   */
  render() {
    this._element = document.createElement('div');
    this._element.className = `uc-notifications ${this._config.compact ? 'compact' : ''}`;

    this._loadNotifications();
    this._subscribeToUpdates();

    return this._element;
  }

  /**
   * Загружает уведомления из HA
   */
  async _loadNotifications() {
    try {
      // Получаем persistent notifications
      const persistentNotifications = await this._hass.callWS({
        type: 'persistent_notification/get'
      });

      // Получаем обычные notifications если есть
      let notifications = [];
      
      if (persistentNotifications) {
        notifications = Object.values(persistentNotifications).map(n => ({
          id: n.notification_id,
          title: n.title,
          message: n.message,
          created_at: new Date(n.created_at),
          source: 'persistent_notification',
          type: this._detectType(n),
          dismissible: true
        }));
      }

      // Фильтруем
      notifications = this._filterNotifications(notifications);

      // Сортируем по дате
      notifications.sort((a, b) => b.created_at - a.created_at);

      // Ограничиваем количество
      this._notifications = notifications.slice(0, this._config.max_items);

      this._renderNotifications();
    } catch (error) {
      console.error('[NotificationCenter] Error loading notifications:', error);
      this._renderError();
    }
  }

  /**
   * Подписывается на обновления
   */
  _subscribeToUpdates() {
    // Можно подписаться на события HA для real-time обновлений
    // this._hass.connection.subscribeEvents(...)
  }

  /**
   * Фильтрует уведомления
   * @param {Array} notifications 
   * @returns {Array}
   */
  _filterNotifications(notifications) {
    let result = notifications;

    // Исключаем dismissed
    result = result.filter(n => !this._dismissedIds.has(n.id));

    // Фильтр по источникам
    if (this._config.filter_sources.length > 0) {
      result = result.filter(n => this._config.filter_sources.includes(n.source));
    }

    // Исключаем источники
    if (this._config.exclude_sources.length > 0) {
      result = result.filter(n => !this._config.exclude_sources.includes(n.source));
    }

    return result;
  }

  /**
   * Определяет тип уведомления
   * @param {Object} notification 
   * @returns {string}
   */
  _detectType(notification) {
    const message = (notification.message || '').toLowerCase();
    const title = (notification.title || '').toLowerCase();
    const text = message + ' ' + title;

    if (text.includes('error') || text.includes('ошибка') || text.includes('failed')) {
      return NOTIFICATION_TYPES.ERROR;
    }
    if (text.includes('warning') || text.includes('предупреждение') || text.includes('внимание')) {
      return NOTIFICATION_TYPES.WARNING;
    }
    if (text.includes('success') || text.includes('успешно') || text.includes('готово')) {
      return NOTIFICATION_TYPES.SUCCESS;
    }
    return NOTIFICATION_TYPES.INFO;
  }

  /**
   * Рендерит уведомления
   */
  _renderNotifications() {
    if (!this._element) return;

    if (this._notifications.length === 0) {
      this._element.innerHTML = `
        <div class="uc-notifications-empty">
          <ha-icon icon="mdi:bell-check"></ha-icon>
          <span>Нет уведомлений</span>
        </div>
      `;
      return;
    }

    const grouped = this._config.group_by_source 
      ? this._groupBySource(this._notifications)
      : { 'all': this._notifications };

    let html = '';

    for (const [source, items] of Object.entries(grouped)) {
      if (this._config.group_by_source && source !== 'all') {
        html += `<div class="uc-notifications-group-header">${source}</div>`;
      }

      html += items.map(n => this._renderNotification(n)).join('');
    }

    this._element.innerHTML = `
      <div class="uc-notifications-list">
        ${html}
      </div>
      ${this._notifications.length > 0 ? `
        <div class="uc-notifications-footer">
          <button class="uc-notifications-clear-all">Очистить все</button>
        </div>
      ` : ''}
    `;

    // Привязываем события
    this._bindEvents();
  }

  /**
   * Рендерит одно уведомление
   * @param {Object} notification 
   * @returns {string}
   */
  _renderNotification(notification) {
    const { show_timestamp, show_source, show_actions, compact } = this._config;
    const typeIcon = this._getTypeIcon(notification.type);
    const typeClass = `uc-notification-${notification.type}`;

    const timeAgo = this._formatTimeAgo(notification.created_at);

    return `
      <div class="uc-notification ${typeClass}" data-id="${notification.id}">
        <div class="uc-notification-icon">
          <ha-icon icon="${typeIcon}"></ha-icon>
        </div>
        <div class="uc-notification-content">
          ${notification.title ? `<div class="uc-notification-title">${notification.title}</div>` : ''}
          <div class="uc-notification-message">${notification.message}</div>
          <div class="uc-notification-meta">
            ${show_timestamp ? `<span class="uc-notification-time">${timeAgo}</span>` : ''}
            ${show_source ? `<span class="uc-notification-source">${notification.source}</span>` : ''}
          </div>
        </div>
        ${notification.dismissible && show_actions ? `
          <button class="uc-notification-dismiss" data-action="dismiss" title="Скрыть">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        ` : ''}
      </div>
    `;
  }

  /**
   * Рендерит ошибку
   */
  _renderError() {
    if (!this._element) return;

    this._element.innerHTML = `
      <div class="uc-notifications-error">
        <ha-icon icon="mdi:alert-circle"></ha-icon>
        <span>Ошибка загрузки</span>
        <button class="uc-notifications-retry">Повторить</button>
      </div>
    `;

    this._element.querySelector('.uc-notifications-retry')?.addEventListener('click', () => {
      this._loadNotifications();
    });
  }

  /**
   * Группирует по источнику
   * @param {Array} notifications 
   * @returns {Object}
   */
  _groupBySource(notifications) {
    const groups = {};
    for (const n of notifications) {
      const source = n.source || 'other';
      if (!groups[source]) groups[source] = [];
      groups[source].push(n);
    }
    return groups;
  }

  /**
   * Получает иконку типа
   * @param {string} type 
   * @returns {string}
   */
  _getTypeIcon(type) {
    const icons = {
      [NOTIFICATION_TYPES.INFO]: 'mdi:information',
      [NOTIFICATION_TYPES.WARNING]: 'mdi:alert',
      [NOTIFICATION_TYPES.ERROR]: 'mdi:alert-circle',
      [NOTIFICATION_TYPES.SUCCESS]: 'mdi:check-circle'
    };
    return icons[type] || 'mdi:bell';
  }

  /**
   * Форматирует время относительно сейчас
   * @param {Date} date 
   * @returns {string}
   */
  _formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} д. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (minutes > 0) return `${minutes} мин. назад`;
    return 'только что';
  }

  /**
   * Привязывает события
   */
  _bindEvents() {
    // Dismiss одного уведомления
    this._element.querySelectorAll('[data-action="dismiss"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const notifEl = btn.closest('.uc-notification');
        const id = notifEl?.dataset.id;
        if (id) this._dismissNotification(id);
      });
    });

    // Clear all
    this._element.querySelector('.uc-notifications-clear-all')?.addEventListener('click', () => {
      this._clearAll();
    });

    // Клик на уведомление
    this._element.querySelectorAll('.uc-notification').forEach(notif => {
      notif.addEventListener('click', () => {
        const id = notif.dataset.id;
        this._onNotificationClick(id);
      });
    });
  }

  /**
   * Скрывает уведомление
   * @param {string} id 
   */
  async _dismissNotification(id) {
    try {
      // Удаляем из HA
      await this._hass.callService('persistent_notification', 'dismiss', {
        notification_id: id
      });
    } catch (e) {
      // Если не получилось удалить из HA, просто скрываем локально
    }

    this._dismissedIds.add(id);
    
    // Анимация удаления
    const el = this._element.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.style.animation = 'uc-notification-dismiss 0.3s ease forwards';
      setTimeout(() => {
        this._notifications = this._notifications.filter(n => n.id !== id);
        this._renderNotifications();
      }, 300);
    }
  }

  /**
   * Очищает все уведомления
   */
  async _clearAll() {
    for (const n of this._notifications) {
      if (n.dismissible) {
        try {
          await this._hass.callService('persistent_notification', 'dismiss', {
            notification_id: n.id
          });
        } catch (e) {}
        this._dismissedIds.add(n.id);
      }
    }

    this._notifications = [];
    this._renderNotifications();
  }

  /**
   * Обработчик клика на уведомление
   * @param {string} id 
   */
  _onNotificationClick(id) {
    // Можно добавить действие при клике
    // Например, показать детали или перейти по ссылке
  }

  /**
   * Добавляет уведомление программно
   * @param {Object} notification 
   */
  addNotification(notification) {
    const newNotif = {
      id: notification.id || `custom-${Date.now()}`,
      title: notification.title,
      message: notification.message,
      created_at: new Date(),
      source: notification.source || 'custom',
      type: notification.type || NOTIFICATION_TYPES.INFO,
      dismissible: notification.dismissible !== false
    };

    this._notifications.unshift(newNotif);
    
    if (this._notifications.length > this._config.max_items) {
      this._notifications.pop();
    }

    this._renderNotifications();

    // Автоскрытие
    if (this._config.auto_dismiss > 0) {
      setTimeout(() => {
        this._dismissNotification(newNotif.id);
      }, this._config.auto_dismiss);
    }
  }

  /**
   * Уничтожает виджет
   */
  destroy() {
    if (this._unsubscribe) {
      this._unsubscribe();
    }

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
      .uc-notifications {
        width: 100%;
      }

      .uc-notifications-empty,
      .uc-notifications-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 32px 16px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      .uc-notifications-empty ha-icon,
      .uc-notifications-error ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.5;
      }

      .uc-notifications-retry {
        margin-top: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
      }

      .uc-notifications-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .uc-notifications-group-header {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--secondary-text-color);
        padding: 8px 0 4px;
        letter-spacing: 0.5px;
      }

      .uc-notification {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: var(--ha-card-background, white);
        border-radius: 12px;
        border-left: 4px solid var(--divider-color);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .uc-notification:hover {
        transform: translateX(4px);
        box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
      }

      .uc-notification-info {
        border-left-color: var(--info-color, #2196f3);
      }

      .uc-notification-warning {
        border-left-color: var(--warning-color, #ff9800);
      }

      .uc-notification-error {
        border-left-color: var(--error-color, #f44336);
      }

      .uc-notification-success {
        border-left-color: var(--success-color, #4caf50);
      }

      .uc-notification-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--secondary-background-color);
      }

      .uc-notification-info .uc-notification-icon {
        color: var(--info-color);
        background: rgba(33, 150, 243, 0.1);
      }

      .uc-notification-warning .uc-notification-icon {
        color: var(--warning-color);
        background: rgba(255, 152, 0, 0.1);
      }

      .uc-notification-error .uc-notification-icon {
        color: var(--error-color);
        background: rgba(244, 67, 54, 0.1);
      }

      .uc-notification-success .uc-notification-icon {
        color: var(--success-color);
        background: rgba(76, 175, 80, 0.1);
      }

      .uc-notification-content {
        flex: 1;
        min-width: 0;
      }

      .uc-notification-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .uc-notification-message {
        font-size: 13px;
        color: var(--primary-text-color);
        line-height: 1.4;
        word-wrap: break-word;
      }

      .uc-notification-meta {
        display: flex;
        gap: 12px;
        margin-top: 8px;
        font-size: 11px;
        color: var(--secondary-text-color);
      }

      .uc-notification-dismiss {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s, background 0.2s;
      }

      .uc-notification:hover .uc-notification-dismiss {
        opacity: 1;
      }

      .uc-notification-dismiss:hover {
        background: var(--secondary-background-color);
      }

      .uc-notifications-footer {
        display: flex;
        justify-content: center;
        padding-top: 12px;
        margin-top: 8px;
        border-top: 1px solid var(--divider-color);
      }

      .uc-notifications-clear-all {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 13px;
      }

      .uc-notifications-clear-all:hover {
        background: var(--secondary-background-color);
      }

      @keyframes uc-notification-dismiss {
        to {
          opacity: 0;
          transform: translateX(100%);
          height: 0;
          padding: 0;
          margin: 0;
        }
      }

      /* Compact mode */
      .uc-notifications.compact .uc-notification {
        padding: 8px;
        gap: 8px;
      }

      .uc-notifications.compact .uc-notification-icon {
        width: 24px;
        height: 24px;
      }

      .uc-notifications.compact .uc-notification-icon ha-icon {
        --mdc-icon-size: 16px;
      }

      .uc-notifications.compact .uc-notification-title {
        font-size: 13px;
      }

      .uc-notifications.compact .uc-notification-message {
        font-size: 12px;
      }
    `;
  }
}

export default NotificationCenter;
