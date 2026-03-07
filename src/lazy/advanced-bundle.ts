/**
 * Universal Card - Lazy Advanced Bundle
 *
 * Optional modules loaded on demand:
 * - advanced features
 * - complex features
 * - themes
 * - widgets
 */

import { EntityPreview } from '../advanced/EntityPreview.js';
import { Alerts, ALERT_TYPES, ALERT_CONDITIONS } from '../advanced/Alerts.js';
import { QuickActions } from '../advanced/QuickActions.js';
import { Timer, TIMER_MODES, DISPLAY_FORMATS } from '../advanced/Timer.js';
import { IconMapping, PRESET_MAPPINGS } from '../advanced/IconMapping.js';
import { AnimationPresets, ANIMATION_CATEGORIES, PRESETS } from '../advanced/AnimationPresets.js';
import {
  WebSocketOptimizerClass,
  getWebSocketOptimizer,
  createThrottledCallback,
  createDebouncedCallback,
  UPDATE_STRATEGIES,
  UPDATE_PRIORITY
} from '../advanced/WebSocketOptimizer.js';

import { CardLinking } from '../complex/CardLinking.js';
import { AutoGrouping } from '../complex/AutoGrouping.js';
import { CompactMode } from '../complex/CompactMode.js';

import { Glassmorphism } from '../themes/Glassmorphism.js';
import { Neumorphism } from '../themes/Neumorphism.js';
import { BackgroundPatterns } from '../themes/BackgroundPatterns.js';
import { BorderAnimations } from '../themes/BorderAnimations.js';
import { HoverEffects } from '../themes/HoverEffects.js';
import { ColorSchemes } from '../themes/ColorSchemes.js';
import { LoadingVariants } from '../themes/LoadingVariants.js';
import { MicroInteractions } from '../themes/MicroInteractions.js';

import { RestApiWidget } from '../widgets/RestApiWidget.js';
import { ImageEntity } from '../widgets/ImageEntity.js';
import { MediaPlayerMini } from '../widgets/MediaPlayerMini.js';
import { NotificationCenter } from '../widgets/NotificationCenter.js';

export const advanced = {
  EntityPreview,
  Alerts,
  QuickActions,
  Timer,
  IconMapping,
  AnimationPresets,
  WebSocketOptimizer: WebSocketOptimizerClass,
  getWebSocketOptimizer,
  createThrottledCallback,
  createDebouncedCallback
};

export const complex = {
  CardLinking,
  AutoGrouping,
  CompactMode
};

export const themes = {
  Glassmorphism,
  Neumorphism,
  BackgroundPatterns,
  BorderAnimations,
  HoverEffects,
  ColorSchemes,
  LoadingVariants,
  MicroInteractions
};

export const widgets = {
  RestApiWidget,
  ImageEntity,
  MediaPlayerMini,
  NotificationCenter
};

export const constants = {
  ALERT_TYPES,
  ALERT_CONDITIONS,
  TIMER_MODES,
  DISPLAY_FORMATS,
  ANIMATION_CATEGORIES,
  PRESETS,
  PRESET_MAPPINGS,
  UPDATE_STRATEGIES,
  UPDATE_PRIORITY
};
