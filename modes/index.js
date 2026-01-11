/**
 * Universal Card - Modes Index
 * 
 * Re-exports all body mode classes.
 * 
 * @module modes
 */

export { BaseMode } from './BaseMode.js';
export { ExpandMode } from './ExpandMode.js';
export { ModalMode } from './ModalMode.js';
export { FullscreenMode } from './FullscreenMode.js';
export { TabsMode } from './TabsMode.js';
export { CarouselMode } from './CarouselMode.js';

// Mode factory
import { ExpandMode } from './ExpandMode.js';
import { ModalMode } from './ModalMode.js';
import { FullscreenMode } from './FullscreenMode.js';
import { TabsMode } from './TabsMode.js';
import { CarouselMode } from './CarouselMode.js';

/**
 * Mode type to class mapping
 */
const MODE_CLASSES = {
  expand: ExpandMode,
  modal: ModalMode,
  fullscreen: FullscreenMode,
  tabs: TabsMode,
  carousel: CarouselMode
};

/**
 * Create a mode instance by type
 * 
 * @param {string} type - Mode type
 * @param {Object} config - Configuration
 * @param {Object} [options] - Options
 * @returns {BaseMode|null} Mode instance or null
 */
export function createMode(type, config, options = {}) {
  const ModeClass = MODE_CLASSES[type];
  
  if (!ModeClass) {
    console.warn(`[UniversalCard] Unknown mode type: ${type}`);
    return null;
  }
  
  return new ModeClass(config, options);
}

/**
 * Get all mode styles combined
 * 
 * @returns {string} CSS string
 */
export function getAllModeStyles() {
  return [
    ExpandMode.getStyles(),
    ModalMode.getStyles(),
    FullscreenMode.getStyles(),
    TabsMode.getStyles(),
    CarouselMode.getStyles()
  ].join('\n');
}
