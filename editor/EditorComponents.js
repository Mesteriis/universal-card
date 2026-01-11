/**
 * Editor Components - компоненты визуального редактора
 * 
 * UI компоненты для настройки Universal Card
 * в визуальном редакторе Lovelace.
 * 
 * @module editor/EditorComponents
 */

import { fireEvent } from '../utils/helpers.js';
import { BODY_MODES } from '../core/constants.js';

/**
 * Базовый класс для компонентов редактора
 */
export class EditorComponent {
  constructor(config = {}) {
    this._config = config;
    this._element = null;
  }

  /**
   * Создаёт DOM элемент
   * @returns {HTMLElement}
   */
  render() {
    throw new Error('render() must be implemented');
  }

  /**
   * Получает значение
   * @returns {*}
   */
  getValue() {
    throw new Error('getValue() must be implemented');
  }

  /**
   * Устанавливает значение
   * @param {*} value 
   */
  setValue(value) {
    throw new Error('setValue() must be implemented');
  }
}

/**
 * Текстовое поле
 */
export class TextInput extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-editor-field';
    this._element.innerHTML = `
      ${this._config.label ? `<label class="uc-editor-label">${this._config.label}</label>` : ''}
      <input type="${this._config.type || 'text'}" 
             class="uc-editor-input"
             placeholder="${this._config.placeholder || ''}"
             value="${this._config.value || ''}"
             ${this._config.required ? 'required' : ''} />
      ${this._config.helper ? `<span class="uc-editor-helper">${this._config.helper}</span>` : ''}
    `;

    this._input = this._element.querySelector('input');
    this._input.addEventListener('input', () => {
      fireEvent(this._element, 'value-changed', { value: this.getValue() });
    });

    return this._element;
  }

  getValue() {
    return this._input?.value || '';
  }

  setValue(value) {
    if (this._input) {
      this._input.value = value || '';
    }
  }
}

/**
 * Числовое поле
 */
export class NumberInput extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-editor-field';
    this._element.innerHTML = `
      ${this._config.label ? `<label class="uc-editor-label">${this._config.label}</label>` : ''}
      <input type="number" 
             class="uc-editor-input"
             min="${this._config.min ?? ''}"
             max="${this._config.max ?? ''}"
             step="${this._config.step ?? 1}"
             value="${this._config.value ?? ''}"
             ${this._config.required ? 'required' : ''} />
      ${this._config.helper ? `<span class="uc-editor-helper">${this._config.helper}</span>` : ''}
    `;

    this._input = this._element.querySelector('input');
    this._input.addEventListener('input', () => {
      fireEvent(this._element, 'value-changed', { value: this.getValue() });
    });

    return this._element;
  }

  getValue() {
    const val = this._input?.value;
    return val !== '' ? Number(val) : null;
  }

  setValue(value) {
    if (this._input) {
      this._input.value = value ?? '';
    }
  }
}

/**
 * Чекбокс
 */
export class Checkbox extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-editor-field uc-editor-checkbox';
    this._element.innerHTML = `
      <label class="uc-editor-checkbox-label">
        <input type="checkbox" ${this._config.value ? 'checked' : ''} />
        <span class="uc-editor-checkbox-custom"></span>
        <span class="uc-editor-checkbox-text">${this._config.label || ''}</span>
      </label>
      ${this._config.helper ? `<span class="uc-editor-helper">${this._config.helper}</span>` : ''}
    `;

    this._input = this._element.querySelector('input');
    this._input.addEventListener('change', () => {
      fireEvent(this._element, 'value-changed', { value: this.getValue() });
    });

    return this._element;
  }

  getValue() {
    return this._input?.checked || false;
  }

  setValue(value) {
    if (this._input) {
      this._input.checked = !!value;
    }
  }
}

/**
 * Выпадающий список
 */
export class Select extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-editor-field';
    
    const options = (this._config.options || []).map(opt => {
      const value = typeof opt === 'object' ? opt.value : opt;
      const label = typeof opt === 'object' ? opt.label : opt;
      const selected = value === this._config.value ? 'selected' : '';
      return `<option value="${value}" ${selected}>${label}</option>`;
    }).join('');

    this._element.innerHTML = `
      ${this._config.label ? `<label class="uc-editor-label">${this._config.label}</label>` : ''}
      <select class="uc-editor-select">
        ${this._config.placeholder ? `<option value="">${this._config.placeholder}</option>` : ''}
        ${options}
      </select>
      ${this._config.helper ? `<span class="uc-editor-helper">${this._config.helper}</span>` : ''}
    `;

    this._select = this._element.querySelector('select');
    this._select.addEventListener('change', () => {
      fireEvent(this._element, 'value-changed', { value: this.getValue() });
    });

    return this._element;
  }

  getValue() {
    return this._select?.value || '';
  }

  setValue(value) {
    if (this._select) {
      this._select.value = value || '';
    }
  }
}

/**
 * Выбор entity
 */
export class EntityPicker extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-editor-field';
    this._element.innerHTML = `
      ${this._config.label ? `<label class="uc-editor-label">${this._config.label}</label>` : ''}
      <ha-entity-picker
        .hass="${this._config.hass}"
        .value="${this._config.value || ''}"
        .includeDomains="${this._config.domains}"
        allow-custom-entity
      ></ha-entity-picker>
      ${this._config.helper ? `<span class="uc-editor-helper">${this._config.helper}</span>` : ''}
    `;

    this._picker = this._element.querySelector('ha-entity-picker');
    this._picker?.addEventListener('value-changed', (e) => {
      fireEvent(this._element, 'value-changed', { value: e.detail.value });
    });

    return this._element;
  }

  getValue() {
    return this._picker?.value || '';
  }

  setValue(value) {
    if (this._picker) {
      this._picker.value = value || '';
    }
  }
}

/**
 * Выбор иконки
 */
export class IconPicker extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-editor-field';
    this._element.innerHTML = `
      ${this._config.label ? `<label class="uc-editor-label">${this._config.label}</label>` : ''}
      <ha-icon-picker
        .hass="${this._config.hass}"
        .value="${this._config.value || ''}"
      ></ha-icon-picker>
      ${this._config.helper ? `<span class="uc-editor-helper">${this._config.helper}</span>` : ''}
    `;

    this._picker = this._element.querySelector('ha-icon-picker');
    this._picker?.addEventListener('value-changed', (e) => {
      fireEvent(this._element, 'value-changed', { value: e.detail.value });
    });

    return this._element;
  }

  getValue() {
    return this._picker?.value || '';
  }

  setValue(value) {
    if (this._picker) {
      this._picker.value = value || '';
    }
  }
}

/**
 * Выбор цвета
 */
export class ColorPicker extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-editor-field uc-editor-color';
    this._element.innerHTML = `
      ${this._config.label ? `<label class="uc-editor-label">${this._config.label}</label>` : ''}
      <div class="uc-editor-color-wrapper">
        <input type="color" 
               class="uc-editor-color-input"
               value="${this._config.value || '#ffffff'}" />
        <input type="text" 
               class="uc-editor-color-text"
               value="${this._config.value || ''}"
               placeholder="#ffffff" />
      </div>
      ${this._config.helper ? `<span class="uc-editor-helper">${this._config.helper}</span>` : ''}
    `;

    this._colorInput = this._element.querySelector('.uc-editor-color-input');
    this._textInput = this._element.querySelector('.uc-editor-color-text');

    this._colorInput.addEventListener('input', () => {
      this._textInput.value = this._colorInput.value;
      fireEvent(this._element, 'value-changed', { value: this.getValue() });
    });

    this._textInput.addEventListener('input', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(this._textInput.value)) {
        this._colorInput.value = this._textInput.value;
      }
      fireEvent(this._element, 'value-changed', { value: this.getValue() });
    });

    return this._element;
  }

  getValue() {
    return this._textInput?.value || '';
  }

  setValue(value) {
    if (this._colorInput && this._textInput) {
      this._colorInput.value = value || '#ffffff';
      this._textInput.value = value || '';
    }
  }
}

/**
 * Секция с раскрытием
 */
export class Section extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = `uc-editor-section ${this._config.expanded ? 'expanded' : ''}`;
    this._element.innerHTML = `
      <div class="uc-editor-section-header">
        <ha-icon icon="mdi:${this._config.icon || 'chevron-right'}" class="uc-editor-section-icon"></ha-icon>
        <span class="uc-editor-section-title">${this._config.title || ''}</span>
        <ha-icon icon="mdi:chevron-down" class="uc-editor-section-chevron"></ha-icon>
      </div>
      <div class="uc-editor-section-content"></div>
    `;

    this._header = this._element.querySelector('.uc-editor-section-header');
    this._content = this._element.querySelector('.uc-editor-section-content');

    this._header.addEventListener('click', () => {
      this._element.classList.toggle('expanded');
    });

    return this._element;
  }

  /**
   * Добавляет контент в секцию
   * @param {HTMLElement|EditorComponent} content 
   */
  addContent(content) {
    if (content instanceof EditorComponent) {
      this._content.appendChild(content.render());
    } else {
      this._content.appendChild(content);
    }
  }

  getValue() {
    return null;
  }

  setValue() {}
}

/**
 * Редактор Action
 */
export class ActionEditor extends EditorComponent {
  render() {
    this._element = document.createElement('div');
    this._element.className = 'uc-editor-field uc-editor-action';
    
    const actionTypes = [
      { value: 'none', label: 'Нет действия' },
      { value: 'more-info', label: 'Информация' },
      { value: 'toggle', label: 'Переключить' },
      { value: 'call-service', label: 'Вызвать сервис' },
      { value: 'navigate', label: 'Навигация' },
      { value: 'url', label: 'Открыть URL' }
    ];

    const currentAction = this._config.value?.action || 'none';

    this._element.innerHTML = `
      ${this._config.label ? `<label class="uc-editor-label">${this._config.label}</label>` : ''}
      <select class="uc-editor-select uc-editor-action-type">
        ${actionTypes.map(a => `
          <option value="${a.value}" ${a.value === currentAction ? 'selected' : ''}>${a.label}</option>
        `).join('')}
      </select>
      <div class="uc-editor-action-options"></div>
    `;

    this._typeSelect = this._element.querySelector('.uc-editor-action-type');
    this._optionsContainer = this._element.querySelector('.uc-editor-action-options');

    this._typeSelect.addEventListener('change', () => {
      this._updateOptions();
      fireEvent(this._element, 'value-changed', { value: this.getValue() });
    });

    this._updateOptions();

    return this._element;
  }

  _updateOptions() {
    const type = this._typeSelect.value;
    this._optionsContainer.innerHTML = '';

    switch (type) {
      case 'call-service':
        this._optionsContainer.innerHTML = `
          <input type="text" 
                 class="uc-editor-input action-service" 
                 placeholder="domain.service"
                 value="${this._config.value?.service || ''}" />
          <textarea class="uc-editor-textarea action-data" 
                    placeholder="service_data (YAML)">${this._config.value?.service_data ? JSON.stringify(this._config.value.service_data, null, 2) : ''}</textarea>
        `;
        break;
        
      case 'navigate':
        this._optionsContainer.innerHTML = `
          <input type="text" 
                 class="uc-editor-input action-path" 
                 placeholder="/lovelace/view"
                 value="${this._config.value?.navigation_path || ''}" />
        `;
        break;
        
      case 'url':
        this._optionsContainer.innerHTML = `
          <input type="text" 
                 class="uc-editor-input action-url" 
                 placeholder="https://..."
                 value="${this._config.value?.url_path || ''}" />
        `;
        break;
    }

    // Привязываем события
    this._optionsContainer.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        fireEvent(this._element, 'value-changed', { value: this.getValue() });
      });
    });
  }

  getValue() {
    const type = this._typeSelect.value;
    const result = { action: type };

    switch (type) {
      case 'call-service':
        const service = this._optionsContainer.querySelector('.action-service')?.value;
        const dataText = this._optionsContainer.querySelector('.action-data')?.value;
        if (service) result.service = service;
        if (dataText) {
          try {
            result.service_data = JSON.parse(dataText);
          } catch (e) {}
        }
        break;
        
      case 'navigate':
        const path = this._optionsContainer.querySelector('.action-path')?.value;
        if (path) result.navigation_path = path;
        break;
        
      case 'url':
        const url = this._optionsContainer.querySelector('.action-url')?.value;
        if (url) result.url_path = url;
        break;
    }

    return type === 'none' ? null : result;
  }

  setValue(value) {
    this._config.value = value;
    if (this._typeSelect) {
      this._typeSelect.value = value?.action || 'none';
      this._updateOptions();
    }
  }
}

/**
 * Возвращает CSS стили для компонентов редактора
 * @returns {string}
 */
export function getEditorStyles() {
  return `
    .uc-editor-field {
      margin-bottom: 16px;
    }

    .uc-editor-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .uc-editor-input,
    .uc-editor-select,
    .uc-editor-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--ha-card-background);
      color: var(--primary-text-color);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .uc-editor-input:focus,
    .uc-editor-select:focus,
    .uc-editor-textarea:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--rgb-primary-color), 0.1);
    }

    .uc-editor-textarea {
      min-height: 80px;
      resize: vertical;
      font-family: monospace;
    }

    .uc-editor-helper {
      display: block;
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }

    /* Checkbox */
    .uc-editor-checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .uc-editor-checkbox-label input {
      display: none;
    }

    .uc-editor-checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid var(--divider-color);
      border-radius: 4px;
      position: relative;
      transition: all 0.2s;
    }

    .uc-editor-checkbox-label input:checked + .uc-editor-checkbox-custom {
      background: var(--primary-color);
      border-color: var(--primary-color);
    }

    .uc-editor-checkbox-custom::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 6px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .uc-editor-checkbox-label input:checked + .uc-editor-checkbox-custom::after {
      opacity: 1;
    }

    /* Color picker */
    .uc-editor-color-wrapper {
      display: flex;
      gap: 8px;
    }

    .uc-editor-color-input {
      width: 50px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .uc-editor-color-text {
      flex: 1;
    }

    /* Section */
    .uc-editor-section {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .uc-editor-section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--secondary-background-color);
      cursor: pointer;
      user-select: none;
    }

    .uc-editor-section-icon {
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }

    .uc-editor-section-title {
      flex: 1;
      font-weight: 500;
    }

    .uc-editor-section-chevron {
      --mdc-icon-size: 20px;
      transition: transform 0.2s;
    }

    .uc-editor-section.expanded .uc-editor-section-chevron {
      transform: rotate(180deg);
    }

    .uc-editor-section-content {
      padding: 0 16px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s, padding 0.3s;
    }

    .uc-editor-section.expanded .uc-editor-section-content {
      padding: 16px;
      max-height: 2000px;
    }

    /* Action editor */
    .uc-editor-action-options {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `;
}
