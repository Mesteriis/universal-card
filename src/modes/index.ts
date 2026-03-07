/**
 * Universal Card - Modes Index
 *
 * Re-exports all body mode classes.
 *
 * @module modes
 */

import { BaseMode, type ModeConfig, type ModeOptions } from './BaseMode.js';
import { ExpandMode } from './ExpandMode.js';
import { ModalMode } from './ModalMode.js';
import { FullscreenMode } from './FullscreenMode.js';
import { TabsMode } from './TabsMode.js';
import { CarouselMode } from './CarouselMode.js';
import { SubviewMode } from './SubviewMode.js';

export { BaseMode } from './BaseMode.js';
export { ExpandMode } from './ExpandMode.js';
export { ModalMode } from './ModalMode.js';
export { FullscreenMode } from './FullscreenMode.js';
export { TabsMode } from './TabsMode.js';
export { CarouselMode } from './CarouselMode.js';
export { SubviewMode } from './SubviewMode.js';

type SupportedModeClass =
  | typeof ExpandMode
  | typeof ModalMode
  | typeof FullscreenMode
  | typeof TabsMode
  | typeof CarouselMode
  | typeof SubviewMode;

const MODE_CLASSES = {
  expand: ExpandMode,
  modal: ModalMode,
  fullscreen: FullscreenMode,
  tabs: TabsMode,
  carousel: CarouselMode,
  subview: SubviewMode
} satisfies Record<string, SupportedModeClass>;

export function createMode(type: string, config: ModeConfig, options: ModeOptions = {}): BaseMode | null {
  const ModeClass = MODE_CLASSES[type as keyof typeof MODE_CLASSES];

  if (!ModeClass) {
    console.warn(`[UniversalCard] Unknown mode type: ${type}`);
    return null;
  }

  return new (ModeClass as unknown as { new(config: ModeConfig, options?: ModeOptions): BaseMode })(config, options);
}

export function getAllModeStyles(): string {
  return [
    ExpandMode.getStyles(),
    ModalMode.getStyles(),
    FullscreenMode.getStyles(),
    TabsMode.getStyles(),
    CarouselMode.getStyles(),
    SubviewMode.getStyles()
  ].join('\n');
}
