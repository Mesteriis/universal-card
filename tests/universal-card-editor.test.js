import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { installDomEnvironment } from './helpers/manual-dom.js';

let teardownDom;
let UniversalCardEditor;

async function createEditor(config = {}) {
  if (!UniversalCardEditor) {
    ({ UniversalCardEditor } = await import('../src/core/UniversalCardEditor.js'));
  }

  const editor = new UniversalCardEditor();
  editor._config = {
    type: 'custom:universal-card',
    ...config
  };
  editor._pushHistory = vi.fn();
  editor._fireConfigChanged = vi.fn();
  editor._fireConfigChangedAndRender = vi.fn();
  editor._updateLiveInspector = vi.fn();

  return editor;
}

function appendElement(parent, tagName, options = {}) {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.id) {
    element.setAttribute('id', options.id);
  }

  if (options.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
  }

  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = String(value);
    });
  }

  if (options.type !== undefined) {
    element.type = options.type;
  }

  if (options.value !== undefined) {
    element.value = options.value;
  }

  if (options.checked !== undefined) {
    element.checked = options.checked;
  }

  if (options.name !== undefined) {
    element.name = options.name;
  }

  if (options.textContent !== undefined) {
    element.textContent = options.textContent;
  }

  parent.appendChild(element);
  return element;
}

function mockContainerInnerHtml(container, builder) {
  Object.defineProperty(container, 'innerHTML', {
    configurable: true,
    get: () => '',
    set: (value) => {
      container._innerHTML = String(value);
      container.children.slice().forEach((child) => container.removeChild(child));
      builder(container, String(value));
    }
  });
}

describe('UniversalCardEditor helper paths and bind flows', () => {
  beforeEach(() => {
    teardownDom = installDomEnvironment();
  });

  afterEach(() => {
    teardownDom?.();
    teardownDom = null;
    UniversalCardEditor = null;
  });

  it('immutably sets and deletes nested values', async () => {
    const editor = await createEditor();
    const original = {
      header: {
        icon: 'mdi:home',
        title: 'Home'
      }
    };

    const updated = editor._setNestedValue(original, ['header', 'icon'], 'mdi:alarm');
    const removed = editor._setNestedValue(updated, ['header', 'icon'], undefined);

    expect(updated).toEqual({
      header: {
        icon: 'mdi:alarm',
        title: 'Home'
      }
    });
    expect(original.header.icon).toBe('mdi:home');
    expect(removed).toEqual({
      header: {
        title: 'Home'
      }
    });
  });

  it('updates and removes nested visibility conditions without mutating the source tree', async () => {
    const editor = await createEditor();
    const source = [
      {
        condition: 'and',
        conditions: [
          {
            condition: 'state',
            entity: 'light.kitchen',
            state: 'off'
          }
        ]
      }
    ];

    const updated = editor._updateVisibilityPathValue(source, [0, 'conditions', 0], (condition) => ({
      ...condition,
      state: 'on'
    }));
    const removed = editor._removeVisibilityPathValue(updated, [0, 'conditions', 0]);

    expect(updated[0].conditions[0].state).toBe('on');
    expect(source[0].conditions[0].state).toBe('off');
    expect(removed[0].conditions).toEqual([]);
  });

  it('binds visibility add and field update flows', async () => {
    const editor = await createEditor({
      visibility: [
        {
          condition: 'state',
          entity: 'light.kitchen'
        }
      ]
    });

    const addRow = appendElement(editor.shadowRoot, 'div');
    const typeSelect = appendElement(addRow, 'select', {
      className: 'condition-type-select',
      value: 'numeric_state'
    });
    typeSelect.value = 'numeric_state';
    appendElement(addRow, 'button', {
      dataset: {
        action: 'add-visibility-condition',
        scope: 'global',
        parentPath: ''
      }
    });

    const conditionItem = appendElement(editor.shadowRoot, 'div', {
      className: 'condition-item',
      dataset: {
        scope: 'global',
        path: '0',
        type: 'state'
      }
    });
    const stateInput = appendElement(conditionItem, 'input', {
      className: 'cond-field',
      dataset: { field: 'state' },
      type: 'text',
      value: 'on'
    });

    editor._bindVisibilityConditions();

    addRow.querySelector('[data-action="add-visibility-condition"]').dispatchEvent(new Event('click'));
    stateInput.dispatchEvent(new Event('input'));

    expect(editor._config.visibility).toEqual([
      {
        condition: 'state',
        entity: 'light.kitchen',
        state: 'on'
      },
      {
        condition: 'numeric_state'
      }
    ]);
    expect(editor._pushHistory).toHaveBeenCalledTimes(1);
    expect(editor._fireConfigChangedAndRender).toHaveBeenCalledTimes(1);
    expect(editor._fireConfigChanged).toHaveBeenCalledTimes(1);
  });

  it('binds action expand trigger and action field updates', async () => {
    const editor = await createEditor({
      tap_action: {
        action: 'navigate',
        navigation_path: '/old'
      },
      hold_action: {
        action: 'toggle'
      }
    });

    const expandButton = appendElement(editor.shadowRoot, 'button', {
      className: 'expand-trigger-btn',
      dataset: { trigger: 'hold' }
    });
    const actionTypeSelect = appendElement(editor.shadowRoot, 'select', {
      className: 'action-type-select',
      dataset: { actionKey: 'tap_action' },
      value: 'url'
    });
    actionTypeSelect.value = 'url';
    const actionField = appendElement(editor.shadowRoot, 'input', {
      className: 'action-extra-field',
      dataset: { actionKey: 'tap_action', field: 'url_path' },
      type: 'text',
      value: 'https://example.com'
    });

    editor._bindActions();

    expandButton.dispatchEvent(new Event('click'));
    actionTypeSelect.dispatchEvent(new Event('change'));
    actionField.dispatchEvent(new Event('input'));

    expect(editor._config.expand_trigger).toBe('hold');
    expect(editor._config.hold_action).toBeUndefined();
    expect(editor._config.tap_action).toEqual({
      action: 'url',
      url_path: 'https://example.com'
    });
  });

  it('binds badge threshold creation and badge field updates', async () => {
    const editor = await createEditor({
      badges: [
        {
          type: 'state'
        }
      ]
    });

    const addThresholdButton = appendElement(editor.shadowRoot, 'button', {
      dataset: { action: 'add-badge-threshold', index: '0' }
    });
    const badgeItem = appendElement(editor.shadowRoot, 'div', {
      className: 'badge-item',
      dataset: { index: '0' }
    });
    const labelInput = appendElement(badgeItem, 'input', {
      className: 'badge-field',
      dataset: { field: 'label' },
      type: 'text',
      value: 'Kitchen'
    });

    editor._bindBadges();

    addThresholdButton.dispatchEvent(new Event('click'));
    labelInput.dispatchEvent(new Event('input'));

    expect(editor._config.badges[0]).toEqual({
      type: 'state',
      label: 'Kitchen',
      thresholds: [
        {
          value: 0,
          color: ''
        }
      ]
    });
  });

  it('binds tab editor input, add, and delete flows through the main bind pipeline', async () => {
    const editor = await createEditor({
      tabs: [{}]
    });

    const tabInput = appendElement(editor.shadowRoot, 'input', {
      type: 'text',
      dataset: { tabIndex: '0', field: 'label' },
      value: 'Primary'
    });
    const addButton = appendElement(editor.shadowRoot, 'button', {
      dataset: { action: 'add-tab' }
    });
    const deleteButton = appendElement(editor.shadowRoot, 'button', {
      dataset: { action: 'delete-tab', index: '0' }
    });

    editor._bindEvents();

    tabInput.dispatchEvent(new Event('input'));
    addButton.dispatchEvent(new Event('click'));
    deleteButton.dispatchEvent(new Event('click'));

    expect(editor._config.tabs).toEqual([
      {
        label: 'Вкладка 2'
      }
    ]);
    expect(editor._fireConfigChanged).toHaveBeenCalled();
    expect(editor._pushHistory).toHaveBeenCalledTimes(2);
    expect(editor._fireConfigChangedAndRender).toHaveBeenCalledTimes(2);
  });

  it('handles icon picker updates and clears nested icon values', async () => {
    const editor = await createEditor({
      header: {
        icon: 'mdi:home'
      }
    });

    const picker = appendElement(editor.shadowRoot, 'ha-icon-picker', {
      dataset: { name: 'header.icon' }
    });

    editor._handleIconPickerChange({
      currentTarget: picker,
      detail: { value: 'mdi:alarm' }
    });

    expect(editor._config.header.icon).toBe('mdi:alarm');
    expect(editor._fireConfigChangedAndRender).toHaveBeenCalledTimes(1);

    editor._handleIconPickerChange({
      currentTarget: picker,
      detail: { value: '   ' }
    });

    expect(editor._config.header).toEqual({});
    expect(editor._fireConfigChangedAndRender).toHaveBeenCalledTimes(2);
  });

  it('binds theme token add, update, and delete flows', async () => {
    const editor = await createEditor({
      theme_tokens: {
        '--existing': 'blue'
      }
    });

    const tokensList = appendElement(editor.shadowRoot, 'div');
    const tokenItem = appendElement(tokensList, 'div', {
      className: 'theme-token-item'
    });
    const tokenName = appendElement(tokenItem, 'input', {
      className: 'token-name',
      type: 'text',
      value: '--existing'
    });
    const tokenValue = appendElement(tokenItem, 'input', {
      className: 'token-value',
      type: 'text',
      value: 'red'
    });
    const addButton = appendElement(editor.shadowRoot, 'button', {
      dataset: { action: 'add-theme-token' }
    });
    const deleteButton = appendElement(editor.shadowRoot, 'button', {
      dataset: { action: 'delete-theme-token', index: '0' }
    });

    editor._bindThemeTokens();

    tokenValue.dispatchEvent(new Event('input'));
    expect(editor._config.theme_tokens).toEqual({
      '--existing': 'red'
    });
    expect(editor._fireConfigChanged).toHaveBeenCalledTimes(1);

    addButton.dispatchEvent(new Event('click'));
    expect(editor._config.theme_tokens).toEqual({
      '--existing': 'red',
      '--uc-custom-token-2': 'initial'
    });

    tokenName.value = '--valid';
    tokenValue.value = 'green';
    tokenValue.dispatchEvent(new Event('change'));
    expect(editor._config.theme_tokens).toEqual({
      '--valid': 'green'
    });

    editor._config.theme_tokens = {
      '--valid': 'green'
    };
    deleteButton.dispatchEvent(new Event('click'));
    expect(editor._config.theme_tokens).toEqual({});
  });

  it('binds state style add, update, preset, and delete flows', async () => {
    const editor = await createEditor({
      state_styles: {
        on: {}
      }
    });

    const addButton = appendElement(editor.shadowRoot, 'button', {
      dataset: { action: 'add-state-style' }
    });
    const deleteButton = appendElement(editor.shadowRoot, 'button', {
      dataset: { action: 'delete-state-style', state: 'on' }
    });
    const conditionItem = appendElement(editor.shadowRoot, 'div', {
      className: 'state-style-item',
      dataset: { state: 'on' }
    });
    appendElement(conditionItem, 'input', {
      className: 'state-key',
      type: 'text',
      value: 'on'
    });
    const styleInput = appendElement(conditionItem, 'input', {
      className: 'style-field',
      dataset: { style: 'color' },
      type: 'text',
      value: '#fff'
    });
    const presetButton = appendElement(editor.shadowRoot, 'button', {
      className: 'btn-preset',
      dataset: { preset: 'battery' }
    });

    editor._bindStateStyles();

    styleInput.dispatchEvent(new Event('input'));
    expect(editor._config.state_styles).toEqual({
      on: { color: '#fff' }
    });

    addButton.dispatchEvent(new Event('click'));
    expect(editor._config.state_styles).toEqual({
      on: { color: '#fff' },
      state_2: {}
    });

    deleteButton.dispatchEvent(new Event('click'));
    expect(editor._config.state_styles).toEqual({
      state_2: {}
    });

    presetButton.dispatchEvent(new Event('click'));
    expect(editor._config.state_styles).toEqual({
      '<20': { background: 'rgba(244, 67, 54, 0.2)', color: '#f44336' },
      '20-50': { background: 'rgba(255, 152, 0, 0.2)', color: '#ff9800' },
      '>50': { background: 'rgba(76, 175, 80, 0.2)', color: '#4caf50' }
    });
  });

  it('handles picked card configs and normalizes custom card types', async () => {
    const editor = await createEditor();
    window.customCards = [
      {
        type: 'custom:button-card'
      }
    ];
    editor._addCardConfig = vi.fn();
    editor._closeSubEditor = vi.fn();

    editor._handlePickedCardConfig('body', {
      type: 'button-card',
      name: 'Kitchen'
    });

    expect(editor._addCardConfig).toHaveBeenCalledWith('body', {
      type: 'custom:button-card',
      name: 'Kitchen'
    });
    expect(editor._closeSubEditor).toHaveBeenCalledTimes(1);
  });

  it('renders native HA card picker and wires config-changed and fallback actions', async () => {
    const editor = await createEditor();
    editor._hass = { states: {} };
    editor._loadCardHelpers = vi.fn().mockResolvedValue({});
    editor._handlePickedCardConfig = vi.fn();
    editor._showFallbackCardPicker = vi.fn();
    customElements.define('hui-card-picker', class HuiCardPicker extends HTMLElement {});

    const container = document.createElement('div');
    mockContainerInnerHtml(container, (root) => {
      const wrapper = appendElement(root, 'div', { className: 'ha-picker-wrapper' });
      const tools = appendElement(wrapper, 'div', { className: 'picker-tools' });
      appendElement(tools, 'button', { id: 'use-fallback-picker' });
      appendElement(wrapper, 'div', { id: 'ha-card-picker-slot' });
    });

    const rendered = await editor._tryShowHaCardPicker(container, 'body');
    const picker = container.querySelector('#ha-card-picker-slot').children[0];
    const fallbackButton = container.querySelector('#use-fallback-picker');

    expect(rendered).toBe(true);
    expect(editor._loadCardHelpers).toHaveBeenCalledTimes(1);
    expect(picker).toBeTruthy();
    expect(picker.hass).toEqual({ states: {} });
    expect(Array.isArray(picker.path)).toBe(true);

    picker.dispatchEvent(new CustomEvent('config-changed', {
      detail: {
        config: {
          type: 'markdown',
          content: 'hello'
        }
      }
    }));
    fallbackButton.dispatchEvent(new Event('click'));

    expect(editor._handlePickedCardConfig).toHaveBeenCalledWith('body', {
      type: 'markdown',
      content: 'hello'
    });
    expect(editor._showFallbackCardPicker).toHaveBeenCalledWith(container, 'body');
  });

  it('saves sub-editor content through textarea fallback when ha-code-editor is unavailable', async () => {
    const editor = await createEditor();
    editor._yamlToConfig = vi.fn().mockReturnValue({
      type: 'markdown',
      content: 'Saved'
    });
    editor._updateCardConfig = vi.fn();
    editor._closeSubEditor = vi.fn();
    editor._configToYaml = vi.fn().mockReturnValue('type: markdown');

    const container = document.createElement('div');
    mockContainerInnerHtml(container, (root, markup) => {
      const toolbar = appendElement(root, 'div', { className: 'card-editor-toolbar' });
      const actions = appendElement(toolbar, 'div', { className: 'editor-actions' });
      appendElement(actions, 'button', { dataset: { action: 'cancel-inline' } });
      appendElement(actions, 'button', { dataset: { action: 'save-inline' } });
      const slot = appendElement(root, 'div', { id: 'code-editor-slot' });

      Object.defineProperty(slot, 'innerHTML', {
        configurable: true,
        get: () => '',
        set: (value) => {
          slot.children.slice().forEach((child) => slot.removeChild(child));
          if (String(value).includes('yaml-fallback-editor')) {
            appendElement(slot, 'textarea', {
              className: 'yaml-fallback-editor',
              textContent: ''
            });
          }
        }
      });
    });

    await editor._showCardEditor(container, { type: 'markdown', content: 'Draft' }, 'body', 0);

    const textarea = container.querySelector('.yaml-fallback-editor');
    const saveButton = container.querySelector('[data-action=\"save-inline\"]');
    textarea.value = 'type: markdown\ncontent: Saved';
    saveButton.dispatchEvent(new Event('click'));

    expect(editor._yamlToConfig).toHaveBeenCalledWith('type: markdown\ncontent: Saved');
    expect(editor._updateCardConfig).toHaveBeenCalledWith('body', 0, {
      type: 'markdown',
      content: 'Saved'
    });
    expect(editor._closeSubEditor).toHaveBeenCalledTimes(1);
  });
});
