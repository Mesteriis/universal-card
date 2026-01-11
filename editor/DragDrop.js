/**
 * Drag & Drop - перетаскивание карточек
 * 
 * Позволяет переупорядочивать карточки в edit mode
 * с помощью перетаскивания.
 * 
 * @module editor/DragDrop
 */

import { fireEvent } from '../utils/helpers.js';

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  handle: null,           // Селектор для handle (null = весь элемент)
  ghostClass: 'uc-drag-ghost',
  dragClass: 'uc-dragging',
  dropZoneClass: 'uc-drop-zone',
  dropActiveClass: 'uc-drop-active',
  animation: 200,
  threshold: 10,          // Минимальное смещение для начала drag
  axis: null,             // null = оба, 'x' или 'y'
  scrollSensitivity: 50,  // Пиксели от края для автоскролла
  scrollSpeed: 10
};

/**
 * Класс для Drag & Drop функциональности
 */
export class DragDrop {
  /**
   * @param {HTMLElement} container - Контейнер с элементами
   * @param {Object} config - Конфигурация
   */
  constructor(container, config = {}) {
    this._container = container;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._items = [];
    this._draggedItem = null;
    this._ghost = null;
    this._placeholder = null;
    this._startPos = { x: 0, y: 0 };
    this._currentPos = { x: 0, y: 0 };
    this._scrollInterval = null;
    this._isDragging = false;
    this._callbacks = {
      onStart: null,
      onMove: null,
      onEnd: null,
      onReorder: null
    };

    this._init();
  }

  /**
   * Инициализация
   */
  _init() {
    this._updateItems();
    this._bindEvents();
  }

  /**
   * Обновляет список элементов
   */
  _updateItems() {
    this._items = Array.from(this._container.children);
  }

  /**
   * Привязывает события
   */
  _bindEvents() {
    // Mouse events
    this._container.addEventListener('mousedown', this._onMouseDown.bind(this));
    document.addEventListener('mousemove', this._onMouseMove.bind(this));
    document.addEventListener('mouseup', this._onMouseUp.bind(this));

    // Touch events
    this._container.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
  }

  /**
   * Устанавливает callback
   * @param {string} event - onStart, onMove, onEnd, onReorder
   * @param {Function} callback 
   */
  on(event, callback) {
    if (this._callbacks.hasOwnProperty(event)) {
      this._callbacks[event] = callback;
    }
  }

  /**
   * Обработчик mousedown
   * @param {MouseEvent} e 
   */
  _onMouseDown(e) {
    if (e.button !== 0) return; // Только левая кнопка
    
    const item = this._getItemFromEvent(e);
    if (!item) return;

    // Проверяем handle если указан
    if (this._config.handle) {
      const handle = e.target.closest(this._config.handle);
      if (!handle || !item.contains(handle)) return;
    }

    e.preventDefault();
    this._startDrag(item, e.clientX, e.clientY);
  }

  /**
   * Обработчик touchstart
   * @param {TouchEvent} e 
   */
  _onTouchStart(e) {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const item = this._getItemFromEvent(e);
    if (!item) return;

    // Проверяем handle
    if (this._config.handle) {
      const handle = e.target.closest(this._config.handle);
      if (!handle || !item.contains(handle)) return;
    }

    this._startDrag(item, touch.clientX, touch.clientY);
  }

  /**
   * Получает элемент из события
   * @param {Event} e 
   * @returns {HTMLElement|null}
   */
  _getItemFromEvent(e) {
    const target = e.target;
    return this._items.find(item => item.contains(target));
  }

  /**
   * Начинает перетаскивание
   * @param {HTMLElement} item 
   * @param {number} x 
   * @param {number} y 
   */
  _startDrag(item, x, y) {
    this._draggedItem = item;
    this._startPos = { x, y };
    this._currentPos = { x, y };
    this._isDragging = false;

    // Сохраняем начальные размеры
    const rect = item.getBoundingClientRect();
    this._itemRect = rect;
  }

  /**
   * Обработчик mousemove
   * @param {MouseEvent} e 
   */
  _onMouseMove(e) {
    if (!this._draggedItem) return;
    this._handleMove(e.clientX, e.clientY);
  }

  /**
   * Обработчик touchmove
   * @param {TouchEvent} e 
   */
  _onTouchMove(e) {
    if (!this._draggedItem || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    this._handleMove(touch.clientX, touch.clientY);
    
    // Предотвращаем скролл страницы
    if (this._isDragging) {
      e.preventDefault();
    }
  }

  /**
   * Обрабатывает движение
   * @param {number} x 
   * @param {number} y 
   */
  _handleMove(x, y) {
    const deltaX = x - this._startPos.x;
    const deltaY = y - this._startPos.y;
    
    // Проверяем порог для начала drag
    if (!this._isDragging) {
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < this._config.threshold) return;
      
      this._isDragging = true;
      this._createGhost();
      this._createPlaceholder();
      this._callbacks.onStart?.(this._draggedItem, this._getItemIndex(this._draggedItem));
    }

    this._currentPos = { x, y };

    // Перемещаем ghost
    this._moveGhost(x, y);

    // Определяем позицию для вставки
    this._updateDropPosition(x, y);

    // Автоскролл
    this._handleAutoScroll(y);

    this._callbacks.onMove?.(this._draggedItem, x, y);
  }

  /**
   * Создаёт ghost элемент
   */
  _createGhost() {
    const rect = this._itemRect;
    
    this._ghost = this._draggedItem.cloneNode(true);
    this._ghost.className = `${this._draggedItem.className} ${this._config.ghostClass}`;
    this._ghost.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      pointer-events: none;
      z-index: 10000;
      opacity: 0.8;
      transform: scale(1.02);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      transition: transform 0.1s ease;
    `;

    document.body.appendChild(this._ghost);
    
    // Скрываем оригинал
    this._draggedItem.classList.add(this._config.dragClass);
    this._draggedItem.style.opacity = '0.3';
  }

  /**
   * Создаёт placeholder
   */
  _createPlaceholder() {
    const rect = this._itemRect;
    
    this._placeholder = document.createElement('div');
    this._placeholder.className = this._config.dropZoneClass;
    this._placeholder.style.cssText = `
      height: ${rect.height}px;
      background: var(--primary-color, #03a9f4);
      opacity: 0.2;
      border-radius: 8px;
      border: 2px dashed var(--primary-color);
      transition: all ${this._config.animation}ms ease;
    `;

    this._draggedItem.parentNode.insertBefore(this._placeholder, this._draggedItem);
  }

  /**
   * Перемещает ghost
   * @param {number} x 
   * @param {number} y 
   */
  _moveGhost(x, y) {
    if (!this._ghost) return;

    let newX = x - this._itemRect.width / 2;
    let newY = y - this._itemRect.height / 2;

    // Ограничение по оси
    if (this._config.axis === 'x') {
      newY = this._itemRect.top;
    } else if (this._config.axis === 'y') {
      newX = this._itemRect.left;
    }

    this._ghost.style.left = `${newX}px`;
    this._ghost.style.top = `${newY}px`;
  }

  /**
   * Обновляет позицию для drop
   * @param {number} x 
   * @param {number} y 
   */
  _updateDropPosition(x, y) {
    if (!this._placeholder) return;

    this._updateItems();
    
    let newIndex = null;
    
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      if (item === this._draggedItem || item === this._placeholder) continue;

      const rect = item.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;

      if (y < centerY) {
        newIndex = i;
        break;
      }
    }

    // Перемещаем placeholder
    if (newIndex !== null) {
      const targetItem = this._items[newIndex];
      if (targetItem && targetItem !== this._placeholder.nextSibling) {
        this._container.insertBefore(this._placeholder, targetItem);
      }
    } else if (this._placeholder.nextSibling !== null) {
      this._container.appendChild(this._placeholder);
    }
  }

  /**
   * Обрабатывает автоскролл
   * @param {number} y 
   */
  _handleAutoScroll(y) {
    const containerRect = this._container.getBoundingClientRect();
    const { scrollSensitivity, scrollSpeed } = this._config;

    // Очищаем предыдущий интервал
    if (this._scrollInterval) {
      clearInterval(this._scrollInterval);
      this._scrollInterval = null;
    }

    // Скролл вверх
    if (y < containerRect.top + scrollSensitivity) {
      this._scrollInterval = setInterval(() => {
        this._container.scrollTop -= scrollSpeed;
      }, 16);
    }
    // Скролл вниз
    else if (y > containerRect.bottom - scrollSensitivity) {
      this._scrollInterval = setInterval(() => {
        this._container.scrollTop += scrollSpeed;
      }, 16);
    }
  }

  /**
   * Обработчик mouseup
   * @param {MouseEvent} e 
   */
  _onMouseUp(e) {
    this._endDrag();
  }

  /**
   * Обработчик touchend
   * @param {TouchEvent} e 
   */
  _onTouchEnd(e) {
    this._endDrag();
  }

  /**
   * Завершает перетаскивание
   */
  _endDrag() {
    if (!this._draggedItem) return;

    // Останавливаем автоскролл
    if (this._scrollInterval) {
      clearInterval(this._scrollInterval);
      this._scrollInterval = null;
    }

    if (this._isDragging) {
      // Получаем новый индекс
      const oldIndex = this._getItemIndex(this._draggedItem);
      const newIndex = this._getItemIndex(this._placeholder);

      // Вставляем элемент на новое место
      if (this._placeholder && this._placeholder.parentNode) {
        this._placeholder.parentNode.insertBefore(this._draggedItem, this._placeholder);
        this._placeholder.remove();
      }

      // Удаляем ghost
      if (this._ghost) {
        this._ghost.remove();
        this._ghost = null;
      }

      // Восстанавливаем оригинал
      this._draggedItem.classList.remove(this._config.dragClass);
      this._draggedItem.style.opacity = '';

      // Callback
      if (oldIndex !== newIndex) {
        this._callbacks.onReorder?.(oldIndex, newIndex, this._draggedItem);
        
        // Событие для HA
        fireEvent(this._container, 'items-reordered', {
          oldIndex,
          newIndex,
          item: this._draggedItem
        });
      }

      this._callbacks.onEnd?.(this._draggedItem, newIndex);
    }

    this._draggedItem = null;
    this._placeholder = null;
    this._isDragging = false;
    this._updateItems();
  }

  /**
   * Получает индекс элемента
   * @param {HTMLElement} item 
   * @returns {number}
   */
  _getItemIndex(item) {
    return Array.from(this._container.children).indexOf(item);
  }

  /**
   * Включает drag & drop
   */
  enable() {
    this._container.classList.add('uc-drag-enabled');
  }

  /**
   * Выключает drag & drop
   */
  disable() {
    this._container.classList.remove('uc-drag-enabled');
    this._endDrag();
  }

  /**
   * Уничтожает экземпляр
   */
  destroy() {
    this.disable();
    this._container.removeEventListener('mousedown', this._onMouseDown);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    this._container.removeEventListener('touchstart', this._onTouchStart);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-drag-enabled {
        user-select: none;
        -webkit-user-select: none;
      }

      .uc-dragging {
        opacity: 0.3 !important;
        pointer-events: none;
      }

      .uc-drag-ghost {
        cursor: grabbing !important;
      }

      .uc-drop-zone {
        background: var(--primary-color, #03a9f4);
        opacity: 0.2;
        border-radius: 8px;
        border: 2px dashed var(--primary-color);
      }

      .uc-drop-active {
        background: var(--primary-color);
        opacity: 0.3;
      }

      /* Handle для перетаскивания */
      .uc-drag-handle {
        cursor: grab;
        padding: 8px;
        color: var(--secondary-text-color);
        transition: color 0.2s;
      }

      .uc-drag-handle:hover {
        color: var(--primary-text-color);
      }

      .uc-drag-handle:active {
        cursor: grabbing;
      }

      /* Анимация при перемещении */
      .uc-drag-enabled > * {
        transition: transform 0.2s ease;
      }

      /* Индикатор редактирования */
      .uc-edit-mode {
        outline: 2px dashed var(--primary-color);
        outline-offset: 2px;
      }
    `;
  }
}

export default DragDrop;
