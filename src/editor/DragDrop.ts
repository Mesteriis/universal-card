/**
 * Drag & Drop - перетаскивание карточек
 * 
 * Позволяет переупорядочивать карточки в edit mode
 * с помощью перетаскивания.
 * 
 * @module editor/DragDrop
 */

import { fireEvent } from '../utils/helpers.js';

type DragPosition = {
  x: number;
  y: number;
};

type DragDropCallbackMap = {
  onStart: ((item: HTMLElement | null, index: number) => void) | null;
  onMove: ((item: HTMLElement | null, x: number, y: number) => void) | null;
  onEnd: ((item: HTMLElement | null, index: number) => void) | null;
  onReorder: ((oldIndex: number, newIndex: number, item: HTMLElement | null) => void) | null;
};

type DragDropHandlers = {
  mouseDown: (e: MouseEvent) => void;
  mouseMove: (e: MouseEvent) => void;
  mouseUp: (e: MouseEvent) => void;
  touchStart: (e: TouchEvent) => void;
  touchMove: (e: TouchEvent) => void;
  touchEnd: (e: TouchEvent) => void;
};

type DragDropConfig = {
  handle: string | null;
  ghostClass: string;
  dragClass: string;
  dropZoneClass: string;
  dropActiveClass: string;
  animation: number;
  threshold: number;
  axis: 'x' | 'y' | null;
  scrollSensitivity: number;
  scrollSpeed: number;
};

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
  _container: HTMLElement;
  _config: DragDropConfig;
  _items: HTMLElement[];
  _draggedItem: HTMLElement | null;
  _ghost: HTMLElement | null;
  _placeholder: HTMLElement | null;
  _startPos: DragPosition;
  _currentPos: DragPosition;
  _startIndex: number;
  _scrollInterval: number | null;
  _isDragging: boolean;
  _callbacks: DragDropCallbackMap;
  _boundHandlers: DragDropHandlers;
  _itemRect: DOMRect | null;

  /**
   * @param {HTMLElement} container - Контейнер с элементами
   * @param {Object} config - Конфигурация
   */
  constructor(container: HTMLElement, config: Partial<DragDropConfig> = {}) {
    this._container = container;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._items = [];
    this._draggedItem = null;
    this._ghost = null;
    this._placeholder = null;
    this._startPos = { x: 0, y: 0 };
    this._currentPos = { x: 0, y: 0 };
    this._startIndex = -1;
    this._scrollInterval = null;
    this._isDragging = false;
    this._callbacks = {
      onStart: null,
      onMove: null,
      onEnd: null,
      onReorder: null
    };
    this._boundHandlers = {
      mouseDown: this._onMouseDown.bind(this),
      mouseMove: this._onMouseMove.bind(this),
      mouseUp: this._onMouseUp.bind(this),
      touchStart: this._onTouchStart.bind(this),
      touchMove: this._onTouchMove.bind(this),
      touchEnd: this._onTouchEnd.bind(this)
    };
    this._itemRect = null;

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
    this._items = Array.from(this._container.children) as HTMLElement[];
  }

  /**
   * Привязывает события
   */
  _bindEvents() {
    // Mouse events
    this._container.addEventListener('mousedown', this._boundHandlers.mouseDown);
    document.addEventListener('mousemove', this._boundHandlers.mouseMove);
    document.addEventListener('mouseup', this._boundHandlers.mouseUp);

    // Touch events
    this._container.addEventListener('touchstart', this._boundHandlers.touchStart, { passive: false });
    document.addEventListener('touchmove', this._boundHandlers.touchMove, { passive: false });
    document.addEventListener('touchend', this._boundHandlers.touchEnd);
  }

  /**
   * Устанавливает callback
   * @param {string} event - onStart, onMove, onEnd, onReorder
   * @param {Function} callback 
   */
  on(event: keyof DragDropCallbackMap, callback: DragDropCallbackMap[keyof DragDropCallbackMap]) {
    if (Object.prototype.hasOwnProperty.call(this._callbacks, event)) {
      (this._callbacks as Record<string, unknown>)[event] = callback;
    }
  }

  /**
   * Обработчик mousedown
   * @param {MouseEvent} e 
   */
  _onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return; // Только левая кнопка
    
    const item = this._getItemFromEvent(e);
    if (!item) return;

    // Проверяем handle если указан
    if (this._config.handle) {
      const handle = (e.target as Element | null)?.closest(this._config.handle);
      if (!handle || !item.contains(handle)) return;
    }

    e.preventDefault();
    this._startDrag(item, e.clientX, e.clientY);
  }

  /**
   * Обработчик touchstart
   * @param {TouchEvent} e 
   */
  _onTouchStart(e: TouchEvent) {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const item = this._getItemFromEvent(e);
    if (!item) return;

    // Проверяем handle
    if (this._config.handle) {
      const handle = (e.target as Element | null)?.closest(this._config.handle);
      if (!handle || !item.contains(handle)) return;
    }

    this._startDrag(item, touch.clientX, touch.clientY);
  }

  /**
   * Получает элемент из события
   * @param {Event} e 
   * @returns {HTMLElement|null}
   */
  _getItemFromEvent(e: Event): HTMLElement | null {
    const target = e.target as Node | null;
    return this._items.find(item => item.contains(target));
  }

  /**
   * Начинает перетаскивание
   * @param {HTMLElement} item 
   * @param {number} x 
   * @param {number} y 
   */
  _startDrag(item: HTMLElement, x: number, y: number) {
    this._draggedItem = item;
    this._startPos = { x, y };
    this._currentPos = { x, y };
    this._isDragging = false;
    this._startIndex = this._getItemIndex(item);

    // Сохраняем начальные размеры
    const rect = item.getBoundingClientRect();
    this._itemRect = rect;
  }

  /**
   * Обработчик mousemove
   * @param {MouseEvent} e 
   */
  _onMouseMove(e: MouseEvent) {
    if (!this._draggedItem) return;
    this._handleMove(e.clientX, e.clientY);
  }

  /**
   * Обработчик touchmove
   * @param {TouchEvent} e 
   */
  _onTouchMove(e: TouchEvent) {
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
  _handleMove(x: number, y: number) {
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
    const draggedItem = this._draggedItem;
    if (!rect || !draggedItem) return;
    
    this._ghost = draggedItem.cloneNode(true) as HTMLElement;
    this._ghost.className = `${draggedItem.className} ${this._config.ghostClass}`;
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
    draggedItem.classList.add(this._config.dragClass);
    draggedItem.style.opacity = '0.3';
  }

  /**
   * Создаёт placeholder
   */
  _createPlaceholder() {
    const rect = this._itemRect;
    const draggedItem = this._draggedItem;
    if (!rect || !draggedItem || !draggedItem.parentNode) return;
    
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

    draggedItem.parentNode.insertBefore(this._placeholder, draggedItem);
  }

  /**
   * Перемещает ghost
   * @param {number} x 
   * @param {number} y 
   */
  _moveGhost(x: number, y: number) {
    if (!this._ghost || !this._itemRect) return;

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
  _updateDropPosition(_x: number, y: number) {
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
  _handleAutoScroll(y: number) {
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
  _onMouseUp(_e: MouseEvent) {
    this._endDrag();
  }

  /**
   * Обработчик touchend
   * @param {TouchEvent} e 
   */
  _onTouchEnd(_e: TouchEvent) {
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
      const oldIndex = this._startIndex;
      let newIndex = oldIndex;

      // Вставляем элемент на новое место
      if (this._placeholder && this._placeholder.parentNode) {
        this._placeholder.parentNode.insertBefore(this._draggedItem, this._placeholder);
        this._placeholder.remove();
        newIndex = this._getItemIndex(this._draggedItem);
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
    this._startIndex = -1;
    this._updateItems();
  }

  /**
   * Получает индекс элемента
   * @param {HTMLElement} item 
   * @returns {number}
   */
  _getItemIndex(item: HTMLElement) {
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
    this._container.removeEventListener('mousedown', this._boundHandlers.mouseDown);
    document.removeEventListener('mousemove', this._boundHandlers.mouseMove);
    document.removeEventListener('mouseup', this._boundHandlers.mouseUp);
    this._container.removeEventListener('touchstart', this._boundHandlers.touchStart);
    document.removeEventListener('touchmove', this._boundHandlers.touchMove);
    document.removeEventListener('touchend', this._boundHandlers.touchEnd);
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
