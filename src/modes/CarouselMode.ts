/**
 * Universal Card - Carousel Mode
 *
 * Content displayed as a horizontal carousel with swipe navigation.
 * Supports autoplay, indicators, and smooth transitions.
 *
 * @author Mesteriis
 * @version 1.0.0
 * @module modes/CarouselMode
 */

import { BaseMode } from './BaseMode.js';

type UnknownRecord = Record<string, unknown>;
type HomeAssistantLike = UnknownRecord;
type ModeCardElement = HTMLElement & { hass?: HomeAssistantLike | null };

interface ModeCardConfig extends UnknownRecord {}

interface BodyConfig extends UnknownRecord {
  cards?: ModeCardConfig[];
}

interface CarouselConfig extends UnknownRecord {
  body?: BodyConfig;
  cards?: ModeCardConfig[];
  carousel_autoplay?: boolean;
  carousel_interval?: number;
}

interface CarouselModeOptions extends UnknownRecord {
  startIndex?: number;
  onSlideChange?: ((index: number) => void) | null;
}

export class CarouselMode extends BaseMode {
  declare _config: CarouselConfig;
  declare _container: HTMLElement | null;
  declare _cards: ModeCardElement[];
  declare _hass: HomeAssistantLike | null;

  _currentIndex: number;
  _onSlideChange: ((index: number) => void) | null;
  _track: HTMLElement | null;
  _indicators: HTMLElement | null;
  _autoplayTimer: number | null;
  _touchStartX: number;
  _touchCurrentX: number;
  _isDragging: boolean;
  _autoplay: boolean;
  _interval: number;
  _showIndicators: boolean;
  _showArrows: boolean;
  _loop: boolean;
  _swipeThreshold: number;

  constructor(config: CarouselConfig, options: CarouselModeOptions = {}) {
    super(config, options);

    const startIndex = Number.isFinite(options.startIndex) ? Number(options.startIndex) : 0;
    this._currentIndex = Math.max(0, startIndex);
    this._onSlideChange = typeof options.onSlideChange === 'function'
      ? options.onSlideChange
      : null;
    this._track = null;
    this._indicators = null;
    this._autoplayTimer = null;
    this._touchStartX = 0;
    this._touchCurrentX = 0;
    this._isDragging = false;
    this._autoplay = config.carousel_autoplay === true;
    this._interval = typeof config.carousel_interval === 'number' && config.carousel_interval > 0
      ? config.carousel_interval
      : 5000;
    this._showIndicators = true;
    this._showArrows = true;
    this._loop = true;
    this._swipeThreshold = 50;
  }

  override render(): HTMLElement {
    this._container = document.createElement('div');
    this._container.className = 'carousel-mode';
    this._container.dataset.state = this.active ? 'expanded' : 'collapsed';

    const viewport = document.createElement('div');
    viewport.className = 'carousel-viewport';

    if (this._showArrows) {
      viewport.appendChild(this._createArrowButton('carousel-arrow carousel-arrow-prev', 'mdi:chevron-left', () => {
        this._goTo(this._currentIndex - 1);
      }));
    }

    const trackWrapper = document.createElement('div');
    trackWrapper.className = 'carousel-track-wrapper';

    this._track = document.createElement('div');
    this._track.className = 'carousel-track';

    trackWrapper.appendChild(this._track);
    viewport.appendChild(trackWrapper);

    if (this._showArrows) {
      viewport.appendChild(this._createArrowButton('carousel-arrow carousel-arrow-next', 'mdi:chevron-right', () => {
        this._goTo(this._currentIndex + 1);
      }));
    }

    this._container.appendChild(viewport);

    if (this._showIndicators) {
      this._indicators = this._renderIndicators();
      this._container.appendChild(this._indicators);
    }

    this._bindTouchEvents(trackWrapper);
    return this._container;
  }

  _createArrowButton(className: string, iconName: string, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = className;

    const icon = document.createElement('ha-icon');
    icon.setAttribute('icon', iconName);
    button.appendChild(icon);

    button.addEventListener('click', onClick);
    return button;
  }

  _renderArrows(): DocumentFragment {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(this._createArrowButton('carousel-arrow carousel-arrow-prev', 'mdi:chevron-left', () => {
      this._goTo(this._currentIndex - 1);
    }));
    fragment.appendChild(this._createArrowButton('carousel-arrow carousel-arrow-next', 'mdi:chevron-right', () => {
      this._goTo(this._currentIndex + 1);
    }));
    return fragment;
  }

  _renderIndicators(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'carousel-indicators';
    return container;
  }

  _updateIndicators(): void {
    if (!this._indicators || this._cards.length === 0) {
      return;
    }

    this._indicators.innerHTML = '';

    const fragment = document.createDocumentFragment();
    this._cards.forEach((_, index) => {
      const button = document.createElement('button');
      button.className = 'carousel-indicator';
      if (index === this._currentIndex) {
        button.classList.add('active');
      }
      button.dataset.index = String(index);
      button.setAttribute('aria-label', `Slide ${index + 1}`);
      button.addEventListener('click', () => {
        this._goTo(index);
      });
      fragment.appendChild(button);
    });

    this._indicators.appendChild(fragment);
  }

  _goTo(index: number): void {
    const slideCount = this._cards.length;
    if (slideCount === 0) {
      return;
    }

    if (this._loop) {
      if (index < 0) {
        index = slideCount - 1;
      }
      if (index >= slideCount) {
        index = 0;
      }
    } else if (index < 0 || index >= slideCount) {
      return;
    }

    this._currentIndex = index;
    this._updateTrackPosition();
    this._updateIndicatorStates();
    this._onSlideChange?.(index);

    if (this._autoplay && this._active) {
      this._startAutoplay();
    }
  }

  next(): void {
    this._goTo(this._currentIndex + 1);
  }

  prev(): void {
    this._goTo(this._currentIndex - 1);
  }

  _updateTrackPosition(): void {
    if (!this._track) {
      return;
    }

    const offset = -this._currentIndex * 100;
    this._track.style.transform = `translateX(${offset}%)`;
  }

  _updateIndicatorStates(): void {
    if (!this._indicators) {
      return;
    }

    this._indicators.querySelectorAll('.carousel-indicator').forEach((button, index) => {
      button.classList.toggle('active', index === this._currentIndex);
    });
  }

  _bindTouchEvents(element: HTMLElement): void {
    element.addEventListener('touchstart', (event) => {
      this._onTouchStart(event as TouchEvent);
    }, { passive: true });
    element.addEventListener('touchmove', (event) => {
      this._onTouchMove(event as TouchEvent);
    }, { passive: true });
    element.addEventListener('touchend', (event) => {
      this._onTouchEnd(event as TouchEvent);
    });

    element.addEventListener('mousedown', (event) => {
      this._onMouseDown(event as MouseEvent);
    });
    element.addEventListener('mousemove', (event) => {
      this._onMouseMove(event as MouseEvent);
    });
    element.addEventListener('mouseup', () => {
      this._onMouseUp();
    });
    element.addEventListener('mouseleave', () => {
      this._onMouseUp();
    });
  }

  _onTouchStart(event: TouchEvent): void {
    this._isDragging = true;
    this._touchStartX = event.touches[0].clientX;
    this._touchCurrentX = this._touchStartX;
    this._stopAutoplay();
  }

  _onTouchMove(event: TouchEvent): void {
    if (!this._isDragging) {
      return;
    }

    this._touchCurrentX = event.touches[0].clientX;

    const diff = this._touchCurrentX - this._touchStartX;
    const baseOffset = -this._currentIndex * 100;
    const dragOffset = (diff / this._getContainerWidth()) * 100;

    if (this._track) {
      this._track.style.transition = 'none';
      this._track.style.transform = `translateX(${baseOffset + dragOffset}%)`;
    }
  }

  _onTouchEnd(_event: TouchEvent): void {
    if (!this._isDragging) {
      return;
    }

    this._isDragging = false;
    const diff = this._touchCurrentX - this._touchStartX;

    if (this._track) {
      this._track.style.transition = '';
    }

    if (Math.abs(diff) > this._swipeThreshold) {
      if (diff > 0) {
        this.prev();
      } else {
        this.next();
      }
    } else {
      this._updateTrackPosition();
    }

    if (this._autoplay && this._active) {
      this._startAutoplay();
    }
  }

  _onMouseDown(event: MouseEvent): void {
    if (event.button !== 0) {
      return;
    }

    this._isDragging = true;
    this._touchStartX = event.clientX;
    this._touchCurrentX = this._touchStartX;
    this._stopAutoplay();
  }

  _onMouseMove(event: MouseEvent): void {
    if (!this._isDragging) {
      return;
    }

    this._touchCurrentX = event.clientX;

    const diff = this._touchCurrentX - this._touchStartX;
    const baseOffset = -this._currentIndex * 100;
    const dragOffset = (diff / this._getContainerWidth()) * 100;

    if (this._track) {
      this._track.style.transition = 'none';
      this._track.style.transform = `translateX(${baseOffset + dragOffset}%)`;
    }
  }

  _onMouseUp(): void {
    if (!this._isDragging) {
      return;
    }

    this._isDragging = false;
    const diff = this._touchCurrentX - this._touchStartX;

    if (this._track) {
      this._track.style.transition = '';
    }

    if (Math.abs(diff) > this._swipeThreshold) {
      if (diff > 0) {
        this.prev();
      } else {
        this.next();
      }
    } else {
      this._updateTrackPosition();
    }

    if (this._autoplay && this._active) {
      this._startAutoplay();
    }
  }

  _getContainerWidth(): number {
    const width = this._container?.offsetWidth;
    return typeof width === 'number' && width > 0 ? width : 1;
  }

  _startAutoplay(): void {
    this._stopAutoplay();

    if (!this._autoplay) {
      return;
    }

    this._autoplayTimer = setInterval(() => {
      this.next();
    }, this._interval);
  }

  _stopAutoplay(): void {
    if (this._autoplayTimer !== null) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }

  override async open(): Promise<void> {
    if (this._active) {
      return;
    }

    this._active = true;

    if (this._container) {
      this._container.dataset.state = 'expanded';
    }

    if (!this._loaded) {
      await this.loadCards(this._getCardsConfig());
      this._populateSlides();
    }

    this._onSlideChange?.(this._currentIndex);

    if (this._autoplay) {
      this._startAutoplay();
    }
  }

  override async close(): Promise<void> {
    if (!this._active) {
      return;
    }

    this._active = false;

    if (this._container) {
      this._container.dataset.state = 'collapsed';
    }

    this._stopAutoplay();
  }

  _getCardsConfig(): ModeCardConfig[] {
    if (Array.isArray(this._config.body?.cards)) {
      return this._config.body.cards;
    }
    if (Array.isArray(this._config.cards)) {
      return this._config.cards;
    }
    return [];
  }

  _populateSlides(): void {
    if (!this._track) {
      return;
    }

    if (this._cards.length > 0 && this._currentIndex >= this._cards.length) {
      this._currentIndex = 0;
    }

    const fragment = document.createDocumentFragment();

    this._cards.forEach((card, index) => {
      if (this._hass) {
        card.hass = this._hass;
      }

      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.dataset.index = String(index);
      slide.appendChild(card);
      fragment.appendChild(slide);
    });

    this._track.appendChild(fragment);
    this._updateIndicators();
    this._updateTrackPosition();
  }

  static override getStyles(): string {
    return `
      /* ============================= */
      /* CAROUSEL MODE */
      /* ============================= */
      
      .carousel-mode {
        overflow: hidden;
        transition: 
          max-height var(--uc-transition-duration, 300ms) ease,
          opacity var(--uc-transition-duration, 300ms) ease;
      }
      
      .carousel-mode[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
      }
      
      .carousel-mode[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
      }
      
      /* ============================= */
      /* VIEWPORT */
      /* ============================= */
      
      .carousel-viewport {
        position: relative;
        display: flex;
        align-items: stretch;
      }
      
      .carousel-track-wrapper {
        flex: 1;
        overflow: hidden;
        min-width: 0;
      }
      
      /* ============================= */
      /* TRACK */
      /* ============================= */
      
      .carousel-track {
        display: flex;
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
      }
      
      /* ============================= */
      /* SLIDE */
      /* ============================= */
      
      .carousel-slide {
        flex: 0 0 100%;
        min-width: 100%;
        padding: var(--uc-padding, 16px);
        box-sizing: border-box;
      }
      
      .carousel-slide > * {
        height: 100%;
      }
      
      /* ============================= */
      /* ARROWS */
      /* ============================= */
      
      .carousel-arrow {
        flex-shrink: 0;
        width: 28px;
        background: rgba(255, 255, 255, 0.05);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease;
        opacity: 0.6;
      }
      
      .carousel-arrow:hover {
        background: rgba(255, 255, 255, 0.15);
        opacity: 1;
      }
      
      .carousel-arrow-prev {
        border-radius: 8px 0 0 8px;
      }
      
      .carousel-arrow-next {
        border-radius: 0 8px 8px 0;
      }
      
      .carousel-arrow ha-icon {
        --mdc-icon-size: 16px;
        color: var(--primary-text-color);
      }
      
      /* ============================= */
      /* INDICATORS */
      /* ============================= */
      
      .carousel-indicators {
        display: flex;
        justify-content: center;
        gap: 8px;
        padding: 12px;
      }
      
      .carousel-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--divider-color, rgba(0, 0, 0, 0.2));
        border: none;
        padding: 0;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      
      .carousel-indicator:hover {
        background: var(--secondary-text-color);
        transform: scale(1.2);
      }
      
      .carousel-indicator.active {
        background: var(--primary-color);
        transform: scale(1.2);
      }
    `;
  }

  override destroy(): void {
    this._stopAutoplay();
    this._track = null;
    this._indicators = null;
    this._onSlideChange = null;
    super.destroy();
  }
}

export default CarouselMode;
