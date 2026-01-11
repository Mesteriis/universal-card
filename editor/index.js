/**
 * Editor - экспорт всех компонентов редактора
 * 
 * @module editor
 */

// Config Validator
export {
  ConfigValidator,
  CONFIG_SCHEMA,
  FIELD_TYPES,
  VALIDATION_LEVELS
} from './ConfigValidator.js';

// Drag & Drop
export {
  DragDrop
} from './DragDrop.js';

// Resizable Cards
export {
  ResizableCards,
  RESIZE_HANDLES
} from './ResizableCards.js';

// Lock Mode
export {
  LockMode,
  LOCK_LEVELS,
  LOCK_ACTIONS
} from './LockMode.js';

// Editor Components
export {
  EditorComponent,
  TextInput,
  NumberInput,
  Checkbox,
  Select,
  EntityPicker,
  IconPicker,
  ColorPicker,
  Section,
  ActionEditor,
  getEditorStyles
} from './EditorComponents.js';

// Multi Language
export {
  MultiLanguage,
  SUPPORTED_LANGUAGES,
  getLanguageInstance,
  t
} from './MultiLanguage.js';

/**
 * Собирает все стили редактора
 * @returns {string}
 */
export function getAllEditorStyles() {
  // Import classes for getStyles
  const { ConfigValidator } = require('./ConfigValidator.js');
  const { DragDrop } = require('./DragDrop.js');
  const { ResizableCards } = require('./ResizableCards.js');
  const { LockMode } = require('./LockMode.js');
  const { getEditorStyles } = require('./EditorComponents.js');

  return [
    ConfigValidator.getStyles(),
    DragDrop.getStyles(),
    ResizableCards.getStyles(),
    LockMode.getStyles(),
    getEditorStyles()
  ].join('\n');
}

// Импорты для getAllEditorStyles
import { ConfigValidator } from './ConfigValidator.js';
import { DragDrop } from './DragDrop.js';
import { ResizableCards } from './ResizableCards.js';
import { LockMode } from './LockMode.js';
import { getEditorStyles } from './EditorComponents.js';

/**
 * Собирает все стили (ES modules версия)
 * @returns {string}
 */
export function getEditorStylesBundle() {
  return [
    ConfigValidator.getStyles(),
    DragDrop.getStyles(),
    ResizableCards.getStyles(),
    LockMode.getStyles(),
    getEditorStyles()
  ].join('\n');
}
