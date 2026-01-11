/**
 * Themes - экспорт всех тем и эффектов
 * 
 * @module themes
 */

// Glassmorphism - эффект стекла
export {
  Glassmorphism,
  GLASS_PRESETS,
  GLASS_COLORS
} from './Glassmorphism.js';

// Neumorphism - мягкие тени
export {
  Neumorphism,
  NEUMORPHISM_TYPES,
  INTENSITY_LEVELS,
  NEUMORPHISM_PALETTES
} from './Neumorphism.js';

// Background Patterns - фоновые паттерны
export {
  BackgroundPatterns,
  PATTERNS,
  PATTERN_CATEGORIES
} from './BackgroundPatterns.js';

// Border Animations - анимации границ
export {
  BorderAnimations,
  BORDER_TYPES,
  GRADIENT_PRESETS
} from './BorderAnimations.js';

// Hover Effects - эффекты наведения
export {
  HoverEffects,
  HOVER_EFFECTS,
  EFFECT_CATEGORIES
} from './HoverEffects.js';

// Color Schemes - цветовые схемы
export {
  ColorSchemes,
  COLOR_SCHEMES
} from './ColorSchemes.js';

// Loading Variants - варианты загрузки
export {
  LoadingVariants,
  LOADING_TYPES,
  LOADING_SIZES
} from './LoadingVariants.js';

// Micro Interactions - микро-взаимодействия
export {
  MicroInteractions,
  MICRO_INTERACTIONS,
  INTERACTION_CATEGORIES
} from './MicroInteractions.js';

/**
 * Собирает все стили тем
 * @returns {string}
 */
export function getAllThemeStyles() {
  return [
    Glassmorphism.getStyles(),
    Neumorphism.getStyles(),
    BackgroundPatterns.getStyles(),
    BorderAnimations.getStyles(),
    HoverEffects.getStyles(),
    ColorSchemes.getStyles(),
    LoadingVariants.getStyles(),
    MicroInteractions.getStyles()
  ].join('\n');
}

/**
 * Применяет тему к элементу
 * @param {HTMLElement} element 
 * @param {Object} themeConfig 
 */
export function applyTheme(element, themeConfig = {}) {
  const {
    glass,
    neumorphism,
    pattern,
    border,
    hover,
    colorScheme,
    loading
  } = themeConfig;

  // Glassmorphism
  if (glass) {
    const glassmorphism = new Glassmorphism(glass);
    glassmorphism.apply(element);
  }

  // Neumorphism
  if (neumorphism) {
    const neu = new Neumorphism(neumorphism);
    neu.apply(element);
  }

  // Background Pattern
  if (pattern) {
    const patterns = new BackgroundPatterns(pattern);
    patterns.apply(element);
  }

  // Border Animation
  if (border) {
    const borderAnim = new BorderAnimations(border);
    borderAnim.apply(element);
  }

  // Hover Effect
  if (hover) {
    const hoverEffect = new HoverEffects(element, hover);
    hoverEffect.apply();
  }

  // Color Scheme
  if (colorScheme) {
    const scheme = new ColorSchemes({ scheme: colorScheme });
    scheme.apply(element);
  }
}

// Импорты для getAllThemeStyles (нужны для функции)
import { Glassmorphism } from './Glassmorphism.js';
import { Neumorphism } from './Neumorphism.js';
import { BackgroundPatterns } from './BackgroundPatterns.js';
import { BorderAnimations } from './BorderAnimations.js';
import { HoverEffects } from './HoverEffects.js';
import { ColorSchemes } from './ColorSchemes.js';
import { LoadingVariants } from './LoadingVariants.js';
import { MicroInteractions } from './MicroInteractions.js';
