/**
 * Universal Card - Lazy Editor Bundle
 *
 * Optional editor modules loaded on demand.
 */

import { ConfigValidator } from '../editor/ConfigValidator.js';
import { DragDrop } from '../editor/DragDrop.js';
import { ResizableCards } from '../editor/ResizableCards.js';
import { LockMode } from '../editor/LockMode.js';
import {
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
} from '../editor/EditorComponents.js';
import { MultiLanguage } from '../editor/MultiLanguage.js';

export const editor = {
  ConfigValidator,
  DragDrop,
  ResizableCards,
  LockMode,
  TextInput,
  NumberInput,
  Checkbox,
  Select,
  EntityPicker,
  IconPicker,
  ColorPicker,
  Section,
  ActionEditor,
  getEditorStyles,
  MultiLanguage
};
