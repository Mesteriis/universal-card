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

// =============================================================================
// CAROUSEL MODE CLASS
// =============================================================================

/**
 * Carousel mode - horizontal swipeable content
 * 
 * @class CarouselMode
 * @extends BaseMode
 */
export class CarouselMode extends BaseMode {
  
  /**
   * Create CarouselMode instance
   * 
   * @param {Object} config - Mode configuration
   * @param {Object} options - Additional options
   */
  constructor(config, options = {}) {
    super(config, options);
    
    /** @type {number} Current slide index */
    this._currentIndex = 0;
    
    /** @type {HTMLElement|null} Slides track element */
    this._track = null;
    
    /** @type {HTMLElement|null} Indicators container */
    this._indicators = null;
    
    /** @type {number|null} Autoplay timer ID */
    this._autoplayTimer = null;
    
    /** @type {number} Touch start X position */
    this._touchStartX = 0;
    
    /** @type {number} Touch current X position */
    this._touchCurrentX = 0;
    
    /** @type {boolean} Is dragging */
    this._isDragging = false;
    
    // Carousel configuration
    const carousel = config.carousel || {};
    
    /** @type {boolean} Enable autoplay */
    this._autoplay = carousel.autoplay || false;
    
    /** @type {number} Autoplay interval in ms */
    this._interval = carousel.interval || 5000;
    
    /** @type {boolean} Show indicators */
    this._showIndicators = carousel.show_indicators !== false;
    
    /** @type {boolean} Show navigation arrows */
    this._showArrows = carousel.show_arrows !== false;
    
    /** @type {boolean} Loop slides */
    this._loop = carousel.loop !== false;
    
    /** @type {number} Swipe threshold */
    this._swipeThreshold = 50;
  }
  
  // ===========================================================================
  // RENDERING
  // ===========================================================================
  
  /**
   * Render the carousel mode container
   * 
   * @returns {HTMLElement} Mode container element
   */
  render() {
    this._container = document.createElement('div');
    this._container.className = 'carousel-mode';
    this._container.dataset.state = this._active ? 'expanded' : 'collapsed';
    
    // Carousel viewport
    const viewport = document.createElement('div');
    viewport.className = 'carousel-viewport';
    
    // Slides track
    this._track = document.createElement('div');
    this._track.className = 'carousel-track';
    
    viewport.appendChild(this._track);
    
    // Navigation arrows
    if (this._showArrows) {
      viewport.appendChild(this._renderArrows());
    }
    
    this._container.appendChild(viewport);
    
    // Indicators
    if (this._showIndicators) {
      this._indicators = this._renderIndicators();
      this._container.appendChild(this._indicators);
    }
    
    // Bind touch events
    this._bindTouchEvents(viewport);
    
    return this._container;
  }
  
  /**
   * Render navigation arrows
   * 
   * @private
   * @returns {DocumentFragment} Arrows fragment
   */
  _renderArrows() {
    const fragment = document.createDocumentFragment();
    
    // Previous arrow
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-arrow carousel-arrow-prev';
    prevBtn.innerHTML = '<ha-icon icon="mdi:chevron-left"></ha-icon>';
    prevBtn.addEventListener('click', () => this._goTo(this._currentIndex - 1));
    
    // Next arrow
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-arrow carousel-arrow-next';
    nextBtn.innerHTML = '<ha-icon icon="mdi:chevron-right"></ha-icon>';
    nextBtn.addEventListener('click', () => this._goTo(this._currentIndex + 1));
    
    fragment.appendChild(prevBtn);
    fragment.appendChild(nextBtn);
    
    return fragment;
  }
  
  /**
   * Render indicators
   * 
   * @private
   * @returns {HTMLElement} Indicators container
   */
  _renderIndicators() {
    const container = document.createElement('div');
    container.className = 'carousel-indicators';
    
    // Will be populated when cards are loaded
    return container;
  }
  
  /**
   * Update indicators based on slide count
   * 
   * @private
   */
  _updateIndicators() {
    if (!this._indicators || !this._cards.length) return;
    
    this._indicators.innerHTML = this._cards.map((_, index) => `
      <button class="carousel-indicator ${index === this._currentIndex ? 'active' : ''}"
              data-index="${index}"
              aria-label="Slide ${index + 1}">
      </button>
    `).join('');
    
    // Add click handlers
    this._indicators.querySelectorAll('.carousel-indicator').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index, 10);
        this._goTo(index);
      });
    });
  }
  
  // ===========================================================================
  // NAVIGATION
  // ===========================================================================
  
  /**
   * Go to a specific slide
   * 
   * @param {number} index - Target slide index
   */
  _goTo(index) {
    const slideCount = this._cards.length;
    if (slideCount === 0) return;
    
    // Handle looping
    if (this._loop) {
      if (index < 0) index = slideCount - 1;
      if (index >= slideCount) index = 0;
    } else {
      if (index < 0 || index >= slideCount) return;
    }
    
    this._currentIndex = index;
    this._updateTrackPosition();
    this._updateIndicatorStates();
    
    // Reset autoplay timer
    if (this._autoplay && this._active) {
      this._startAutoplay();
    }
  }
  
  /**
   * Go to next slide
   */
  next() {
    this._goTo(this._currentIndex + 1);
  }
  
  /**
   * Go to previous slide
   */
  prev() {
    this._goTo(this._currentIndex - 1);
  }
  
  /**
   * Update track transform position
   * 
   * @private
   */
  _updateTrackPosition() {
    if (!this._track) return;
    
    const offset = -this._currentIndex * 100;
    this._track.style.transform = `translateX(${offset}%)`;
  }
  
  /**
   * Update indicator active states
   * 
   * @private
   */
  _updateIndicatorStates() {
    if (!this._indicators) return;
    
    this._indicators.querySelectorAll('.carousel-indicator').forEach((btn, index) => {
      btn.classList.toggle('active', index === this._currentIndex);
    });
  }
  
  // ===========================================================================
  // TOUCH / SWIPE
  // ===========================================================================
  
  /**
   * Bind touch event handlers
   * 
   * @private
   * @param {HTMLElement} element - Element to bind to
   */
  _bindTouchEvents(element) {
    // Touch events
    element.addEventListener('touchstart', (e) => this._onTouchStart(e), { passive: true });
    element.addEventListener('touchmove', (e) => this._onTouchMove(e), { passive: true });
    element.addEventListener('touchend', (e) => this._onTouchEnd(e));
    
    // Mouse events for desktop
    element.addEventListener('mousedown', (e) => this._onMouseDown(e));
    element.addEventListener('mousemove', (e) => this._onMouseMove(e));
    element.addEventListener('mouseup', (e) => this._onMouseUp(e));
    element.addEventListener('mouseleave', () => this._onMouseUp());
  }
  
  /**
   * Handle touch start
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _onTouchStart(event) {
    this._isDragging = true;
    this._touchStartX = event.touches[0].clientX;
    this._touchCurrentX = this._touchStartX;
    
    // Pause autoplay while dragging
    this._stopAutoplay();
  }
  
  /**
   * Handle touch move
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _onTouchMove(event) {
    if (!this._isDragging) return;
    
    this._touchCurrentX = event.touches[0].clientX;
    
    // Apply drag transform
    const diff = this._touchCurrentX - this._touchStartX;
    const baseOffset = -this._currentIndex * 100;
    const dragOffset = (diff / this._container.offsetWidth) * 100;
    
    if (this._track) {
      this._track.style.transition = 'none';
      this._track.style.transform = `translateX(${baseOffset + dragOffset}%)`;
    }
  }
  
  /**
   * Handle touch end
   * 
   * @private
   * @param {TouchEvent} event - Touch event
   */
  _onTouchEnd(event) {
    if (!this._isDragging) return;
    
    this._isDragging = false;
    
    const diff = this._touchCurrentX - this._touchStartX;
    
    // Restore transition
    if (this._track) {
      this._track.style.transition = '';
    }
    
    // Determine swipe direction
    if (Math.abs(diff) > this._swipeThreshold) {
      if (diff > 0) {
        this.prev();
      } else {
        this.next();
      }
    } else {
      // Snap back
      this._updateTrackPosition();
    }
    
    // Resume autoplay
    if (this._autoplay && this._active) {
      this._startAutoplay();
    }
  }
  
  /**
   * Handle mouse down
   * 
   * @private
   * @param {MouseEvent} event - Mouse event
   */
  _onMouseDown(event) {
    // Only left button
    if (event.button !== 0) return;
    
    this._isDragging = true;
    this._touchStartX = event.clientX;
    this._touchCurrentX = this._touchStartX;
    
    this._stopAutoplay();
  }
  
  /**
   * Handle mouse move
   * 
   * @private
   * @param {MouseEvent} event - Mouse event
   */
  _onMouseMove(event) {
    if (!this._isDragging) return;
    
    this._touchCurrentX = event.clientX;
    
    const diff = this._touchCurrentX - this._touchStartX;
    const baseOffset = -this._currentIndex * 100;
    const dragOffset = (diff / this._container.offsetWidth) * 100;
    
    if (this._track) {
      this._track.style.transition = 'none';
      this._track.style.transform = `translateX(${baseOffset + dragOffset}%)`;
    }
  }
  
  /**
   * Handle mouse up
   * 
   * @private
   */
  _onMouseUp() {
    if (!this._isDragging) return;
    
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
  
  // ===========================================================================
  // AUTOPLAY
  // ===========================================================================
  
  /**
   * Start autoplay
   * 
   * @private
   */
  _startAutoplay() {
    this._stopAutoplay();
    
    if (!this._autoplay) return;
    
    this._autoplayTimer = setInterval(() => {
      this.next();
    }, this._interval);
  }
  
  /**
   * Stop autoplay
   * 
   * @private
   */
  _stopAutoplay() {
    if (this._autoplayTimer) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }
  
  // ===========================================================================
  // OPEN / CLOSE
  // ===========================================================================
  
  /**
   * Open the carousel mode
   * 
   * @returns {Promise<void>}
   */
  async open() {
    if (this._active) return;
    
    this._active = true;
    
    if (this._container) {
      this._container.dataset.state = 'expanded';
    }
    
    // Load cards if not loaded
    if (!this._loaded) {
      await this.loadCards(this._config.body?.cards || []);
      this._populateSlides();
    }
    
    // Start autoplay
    if (this._autoplay) {
      this._startAutoplay();
    }
  }
  
  /**
   * Close the carousel mode
   * 
   * @returns {Promise<void>}
   */
  async close() {
    if (!this._active) return;
    
    this._active = false;
    
    if (this._container) {
      this._container.dataset.state = 'collapsed';
    }
    
    this._stopAutoplay();
  }
  
  /**
   * Populate slides with cards
   * 
   * @private
   */
  _populateSlides() {
    if (!this._track) return;
    
    const fragment = document.createDocumentFragment();
    
    this._cards.forEach((card, index) => {
      if (this._hass) card.hass = this._hass;
      
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.dataset.index = index;
      slide.appendChild(card);
      
      fragment.appendChild(slide);
    });
    
    this._track.appendChild(fragment);
    
    // Update indicators
    this._updateIndicators();
    
    // Set initial position
    this._updateTrackPosition();
  }
  
  // ===========================================================================
  // STYLES
  // ===========================================================================
  
  /**
   * Get CSS styles for carousel mode
   * 
   * @returns {string} CSS string
   */
  static getStyles() {
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
        overflow: hidden;
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
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        background: var(--ha-card-background, white);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      .carousel-arrow:hover {
        transform: translateY(-50%) scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      .carousel-arrow-prev {
        left: 8px;
      }
      
      .carousel-arrow-next {
        right: 8px;
      }
      
      .carousel-arrow ha-icon {
        --mdc-icon-size: 24px;
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
  
  // ===========================================================================
  // CLEANUP
  // ===========================================================================
  
  /**
   * Destroy the mode
   */
  destroy() {
    this._stopAutoplay();
    
    this._track = null;
    this._indicators = null;
    
    super.destroy();
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

export default CarouselMode;
