/**
 * Resizable Cards - изменение размеров карточек
 * 
 * Позволяет изменять размеры карточек в grid layout
 * с помощью перетаскивания углов/краёв.
 * 
 * @module editor/ResizableCards
 */

import { fireEvent } from '../utils/helpers.js';

/**
 * Направления изменения размера
 */
export const RESIZE_HANDLES = {
  N: 'n',     // Север
  S: 's',     // Юг
  E: 'e',     // Восток
  W: 'w',     // Запад
  NE: 'ne',   // Северо-восток
  NW: 'nw',   // Северо-запад
  SE: 'se',   // Юго-восток
  SW: 'sw'    // Юго-запад
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  handles: [RESIZE_HANDLES.SE], // Только юго-восток по умолчанию
  minWidth: 100,
  minHeight: 50,
  maxWidth: Infinity,
  maxHeight: Infinity,
  grid: [1, 1],               // Шаг изменения [x, y]
  aspectRatio: null,          // null = свободное, число = фиксированное
  handleSize: 12,
  handleClass: 'uc-resize-handle',
  resizingClass: 'uc-resizing'
};

/**
 * Класс для изменения размеров карточек
 */
export class ResizableCards {
  /**
   * @param {HTMLElement} element - Элемент для resize
   * @param {Object} config - Конфигурация
   */
  constructor(element, config = {}) {
    this._element = element;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._handles = new Map();
    this._isResizing = false;
    this._currentHandle = null;
    this._startRect = null;
    this._startPos = { x: 0, y: 0 };
    this._callbacks = {
      onStart: null,
      onResize: null,
      onEnd: null
    };

    this._init();
  }

  /**
   * Инициализация
   */
  _init() {
    this._element.style.position = 'relative';
    this._createHandles();
    this._bindEvents();
  }

  /**
   * Создаёт handle элементы
   */
  _createHandles() {
    for (const handle of this._config.handles) {
      const handleEl = document.createElement('div');
      handleEl.className = `${this._config.handleClass} ${this._config.handleClass}-${handle}`;
      handleEl.dataset.handle = handle;
      
      this._applyHandleStyles(handleEl, handle);
      this._element.appendChild(handleEl);
      this._handles.set(handle, handleEl);
    }
  }

  /**
   * Применяет стили к handle
   * @param {HTMLElement} handleEl 
   * @param {string} handle 
   */
  _applyHandleStyles(handleEl, handle) {
    const size = this._config.handleSize;
    const half = size / 2;

    const baseStyles = {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      zIndex: '10'
    };

    const positionStyles = {
      [RESIZE_HANDLES.N]: { top: `-${half}px`, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
      [RESIZE_HANDLES.S]: { bottom: `-${half}px`, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
      [RESIZE_HANDLES.E]: { right: `-${half}px`, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
      [RESIZE_HANDLES.W]: { left: `-${half}px`, top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
      [RESIZE_HANDLES.NE]: { top: `-${half}px`, right: `-${half}px`, cursor: 'nesw-resize' },
      [RESIZE_HANDLES.NW]: { top: `-${half}px`, left: `-${half}px`, cursor: 'nwse-resize' },
      [RESIZE_HANDLES.SE]: { bottom: `-${half}px`, right: `-${half}px`, cursor: 'nwse-resize' },
      [RESIZE_HANDLES.SW]: { bottom: `-${half}px`, left: `-${half}px`, cursor: 'nesw-resize' }
    };

    Object.assign(handleEl.style, baseStyles, positionStyles[handle]);
  }

  /**
   * Привязывает события
   */
  _bindEvents() {
    for (const [handle, handleEl] of this._handles) {
      handleEl.addEventListener('mousedown', (e) => this._onMouseDown(e, handle));
      handleEl.addEventListener('touchstart', (e) => this._onTouchStart(e, handle), { passive: false });
    }

    document.addEventListener('mousemove', this._onMouseMove.bind(this));
    document.addEventListener('mouseup', this._onMouseUp.bind(this));
    document.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
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
   * Обработчик mousedown
   * @param {MouseEvent} e 
   * @param {string} handle 
   */
  _onMouseDown(e, handle) {
    e.preventDefault();
    e.stopPropagation();
    this._startResize(handle, e.clientX, e.clientY);
  }

  /**
   * Обработчик touchstart
   * @param {TouchEvent} e 
   * @param {string} handle 
   */
  _onTouchStart(e, handle) {
    if (e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    this._startResize(handle, touch.clientX, touch.clientY);
  }

  /**
   * Начинает изменение размера
   * @param {string} handle 
   * @param {number} x 
   * @param {number} y 
   */
  _startResize(handle, x, y) {
    this._isResizing = true;
    this._currentHandle = handle;
    this._startPos = { x, y };
    this._startRect = this._element.getBoundingClientRect();
    
    this._element.classList.add(this._config.resizingClass);
    document.body.style.cursor = this._handles.get(handle)?.style.cursor || 'default';
    document.body.style.userSelect = 'none';

    this._callbacks.onStart?.({
      handle,
      width: this._startRect.width,
      height: this._startRect.height
    });
  }

  /**
   * Обработчик mousemove
   * @param {MouseEvent} e 
   */
  _onMouseMove(e) {
    if (!this._isResizing) return;
    this._handleResize(e.clientX, e.clientY);
  }

  /**
   * Обработчик touchmove
   * @param {TouchEvent} e 
   */
  _onTouchMove(e) {
    if (!this._isResizing || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    this._handleResize(touch.clientX, touch.clientY);
  }

  /**
   * Обрабатывает изменение размера
   * @param {number} x 
   * @param {number} y 
   */
  _handleResize(x, y) {
    const deltaX = x - this._startPos.x;
    const deltaY = y - this._startPos.y;

    let newWidth = this._startRect.width;
    let newHeight = this._startRect.height;
    let newLeft = null;
    let newTop = null;

    // Вычисляем новые размеры в зависимости от handle
    switch (this._currentHandle) {
      case RESIZE_HANDLES.N:
        newHeight = this._startRect.height - deltaY;
        newTop = this._startRect.top + deltaY;
        break;
      case RESIZE_HANDLES.S:
        newHeight = this._startRect.height + deltaY;
        break;
      case RESIZE_HANDLES.E:
        newWidth = this._startRect.width + deltaX;
        break;
      case RESIZE_HANDLES.W:
        newWidth = this._startRect.width - deltaX;
        newLeft = this._startRect.left + deltaX;
        break;
      case RESIZE_HANDLES.NE:
        newWidth = this._startRect.width + deltaX;
        newHeight = this._startRect.height - deltaY;
        newTop = this._startRect.top + deltaY;
        break;
      case RESIZE_HANDLES.NW:
        newWidth = this._startRect.width - deltaX;
        newHeight = this._startRect.height - deltaY;
        newLeft = this._startRect.left + deltaX;
        newTop = this._startRect.top + deltaY;
        break;
      case RESIZE_HANDLES.SE:
        newWidth = this._startRect.width + deltaX;
        newHeight = this._startRect.height + deltaY;
        break;
      case RESIZE_HANDLES.SW:
        newWidth = this._startRect.width - deltaX;
        newHeight = this._startRect.height + deltaY;
        newLeft = this._startRect.left + deltaX;
        break;
    }

    // Применяем ограничения
    newWidth = Math.max(this._config.minWidth, Math.min(this._config.maxWidth, newWidth));
    newHeight = Math.max(this._config.minHeight, Math.min(this._config.maxHeight, newHeight));

    // Применяем grid
    if (this._config.grid[0] > 1) {
      newWidth = Math.round(newWidth / this._config.grid[0]) * this._config.grid[0];
    }
    if (this._config.grid[1] > 1) {
      newHeight = Math.round(newHeight / this._config.grid[1]) * this._config.grid[1];
    }

    // Применяем aspect ratio
    if (this._config.aspectRatio) {
      const ratio = this._config.aspectRatio;
      if (newWidth / ratio > newHeight) {
        newWidth = newHeight * ratio;
      } else {
        newHeight = newWidth / ratio;
      }
    }

    // Применяем размеры
    this._element.style.width = `${newWidth}px`;
    this._element.style.height = `${newHeight}px`;

    this._callbacks.onResize?.({
      handle: this._currentHandle,
      width: newWidth,
      height: newHeight,
      deltaX,
      deltaY
    });
  }

  /**
   * Обработчик mouseup
   */
  _onMouseUp() {
    this._endResize();
  }

  /**
   * Обработчик touchend
   */
  _onTouchEnd() {
    this._endResize();
  }

  /**
   * Завершает изменение размера
   */
  _endResize() {
    if (!this._isResizing) return;

    this._isResizing = false;
    this._element.classList.remove(this._config.resizingClass);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    const rect = this._element.getBoundingClientRect();
    
    this._callbacks.onEnd?.({
      handle: this._currentHandle,
      width: rect.width,
      height: rect.height
    });

    // Событие для HA
    fireEvent(this._element, 'card-resized', {
      width: rect.width,
      height: rect.height
    });

    this._currentHandle = null;
    this._startRect = null;
  }

  /**
   * Устанавливает размеры программно
   * @param {number} width 
   * @param {number} height 
   */
  setSize(width, height) {
    this._element.style.width = `${width}px`;
    this._element.style.height = `${height}px`;
  }

  /**
   * Получает текущие размеры
   * @returns {Object}
   */
  getSize() {
    const rect = this._element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  /**
   * Показывает handles
   */
  showHandles() {
    for (const handleEl of this._handles.values()) {
      handleEl.style.display = '';
    }
  }

  /**
   * Скрывает handles
   */
  hideHandles() {
    for (const handleEl of this._handles.values()) {
      handleEl.style.display = 'none';
    }
  }

  /**
   * Уничтожает экземпляр
   */
  destroy() {
    for (const handleEl of this._handles.values()) {
      handleEl.remove();
    }
    this._handles.clear();

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('touchmove', this._onTouchMove);
    document.removeEventListener('touchend', this._onTouchEnd);
  }

  /**
   * Возвращает CSS стили
   * @returns {string}
   */
  static getStyles() {
    return `
      .uc-resize-handle {
        background: var(--primary-color, #03a9f4);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .uc-resize-handle::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
      }

      *:hover > .uc-resize-handle,
      .uc-resizing .uc-resize-handle {
        opacity: 1;
      }

      .uc-resize-handle:hover {
        transform: scale(1.2);
      }

      .uc-resizing {
        opacity: 0.8;
        outline: 2px solid var(--primary-color);
      }

      /* Специфичные стили для угловых handles */
      .uc-resize-handle-se {
        background: var(--primary-color);
        border-radius: 0;
        width: 16px !important;
        height: 16px !important;
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
      }

      .uc-resize-handle-se::after {
        display: none;
      }

      /* Grid preview при resize */
      .uc-resize-grid-preview {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 49px,
          var(--divider-color) 49px,
          var(--divider-color) 50px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 49px,
          var(--divider-color) 49px,
          var(--divider-color) 50px
        );
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .uc-resizing .uc-resize-grid-preview {
        opacity: 0.3;
      }

      /* Размеры в реальном времени */
      .uc-resize-dimensions {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }

      .uc-resizing .uc-resize-dimensions {
        opacity: 1;
      }
    `;
  }
}

export default ResizableCards;
