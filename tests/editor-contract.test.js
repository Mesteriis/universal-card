import { describe, expect, it } from 'vitest';

import {
  EDITOR_FIELD_GROUPS,
  getBadgeColorRuleFieldDescriptors,
  getBadgeFieldDescriptors,
  getBadgeThresholdFieldDescriptors,
  getBadgeVisibilityRuleFieldDescriptors,
  getEditorFieldDescriptor,
  getEditorFieldOptions,
  getSwipeActionFieldDescriptors,
  getSwipeFieldDescriptors,
  getStateStyleFieldDescriptors,
  getVisibilityConditionFieldDescriptors,
  getVisibilityConditionTypeOptions,
  isLogicalConditionType
} from '../src/editor/EditorContract.js';

describe('EditorContract', () => {
  it('maps schema-backed runtime fields into editor descriptors', () => {
    const poolScope = getEditorFieldDescriptor('pool_scope');
    const gridColumns = getEditorFieldDescriptor('grid.columns');
    const cardId = getEditorFieldDescriptor('card_id');
    const iconField = getEditorFieldDescriptor('icon');
    const iconColorField = getEditorFieldDescriptor('icon_color');
    const modalWidthField = getEditorFieldDescriptor('modal.width');
    const fullscreenWidthField = getEditorFieldDescriptor('fullscreen.width');
    const tabsAlignmentField = getEditorFieldDescriptor('tabs_config.tab_alignment');
    const headerLayoutField = getEditorFieldDescriptor('header.layout.variant');
    const expandIconField = getEditorFieldDescriptor('expand_icon');
    const expandTriggerOptions = getEditorFieldOptions('expand_trigger');
    const actionOptions = getEditorFieldOptions('tap_action.action');
    const modalLoadingOptions = getEditorFieldOptions('modal.loading_strategy');

    expect(EDITOR_FIELD_GROUPS.runtime).toContain('pool_scope');
    expect(EDITOR_FIELD_GROUPS.style).toContain('icon_color');
    expect(poolScope?.control).toBe('select');
    expect(poolScope?.options?.map((option) => option.value)).toContain('dashboard');
    expect(gridColumns?.control).toBe('number');
    expect(cardId?.label).toBe('ID карточки');
    expect(iconField?.control).toBe('icon');
    expect(iconColorField?.label).toBe('Цвет основной иконки');
    expect(modalWidthField?.placeholder).toContain('32rem');
    expect(fullscreenWidthField?.path).toBe('fullscreen.width');
    expect(tabsAlignmentField?.options?.map((option) => option.value)).toEqual(expect.arrayContaining(['start', 'center', 'stretch']));
    expect(headerLayoutField?.options?.map((option) => option.value)).toEqual(expect.arrayContaining(['default', 'stacked', 'centered']));
    expect(expandIconField?.control).toBe('icon');
    expect(expandTriggerOptions.find((option) => option.value === 'tap')?.icon).toBe('mdi:gesture-tap');
    expect(actionOptions.find((option) => option.value === 'call-service')?.label).toBe('Вызвать сервис');
    expect(modalLoadingOptions.map((option) => option.value)).toEqual(expect.arrayContaining(['lazy', 'preload']));
  });

  it('does not expose removed debug config as a contract field', () => {
    expect(getEditorFieldDescriptor('debug')).toBeNull();
  });

  it('exposes visibility condition contract from shared schema and metadata', () => {
    const conditionTypes = getVisibilityConditionTypeOptions();
    const stateFields = getVisibilityConditionFieldDescriptors('state');
    const userFields = getVisibilityConditionFieldDescriptors('user');

    expect(conditionTypes.map((option) => option.value)).toEqual(
      expect.arrayContaining(['state', 'numeric_state', 'user', 'time', 'screen', 'and', 'or', 'not'])
    );
    expect(stateFields.find((field) => field.key === 'attribute')?.label).toBe('Attribute');
    expect(userFields.find((field) => field.key === 'is_admin')?.options?.map((option) => option.value)).toEqual(['', 'true', 'false']);
    expect(isLogicalConditionType('and')).toBe(true);
    expect(isLogicalConditionType('state')).toBe(false);
  });

  it('exposes state style field descriptors for manual rule editing', () => {
    const fields = getStateStyleFieldDescriptors();

    expect(fields.map((field) => field.key)).toEqual(['background', 'color', 'border', 'class']);
    expect(fields.find((field) => field.key === 'class')?.placeholder).toContain('high-priority');
  });

  it('exposes swipe and badge descriptors from the shared contract', () => {
    const swipeFields = getSwipeFieldDescriptors();
    const swipeActions = getSwipeActionFieldDescriptors();
    const counterBadgeFields = getBadgeFieldDescriptors('counter');
    const customBadgeFields = getBadgeFieldDescriptors('custom');
    const thresholdFields = getBadgeThresholdFieldDescriptors();
    const visibilityRuleFields = getBadgeVisibilityRuleFieldDescriptors();
    const colorRuleFields = getBadgeColorRuleFieldDescriptors();

    expect(swipeFields.map((field) => field.path)).toEqual([
      'swipe.enabled',
      'swipe.direction',
      'swipe.threshold',
      'swipe.velocityThreshold',
      'swipe.preventScroll'
    ]);
    expect(swipeActions.find((field) => field.path === 'swipe.left.action')?.options?.map((option) => option.value)).toEqual(
      expect.arrayContaining(['none', 'next', 'prev'])
    );
    expect(counterBadgeFields.map((field) => field.path)).toEqual(
      expect.arrayContaining(['badges.type', 'badges.domain', 'badges.entities', 'badges.count_state', 'badges.icon_only'])
    );
    expect(customBadgeFields.some((field) => field.path === 'badges.value')).toBe(true);
    expect(customBadgeFields.some((field) => field.path === 'badges.entity')).toBe(false);
    expect(thresholdFields.map((field) => field.path)).toEqual([
      'badges.thresholds.value',
      'badges.thresholds.color'
    ]);
    expect(visibilityRuleFields.map((field) => field.path)).toEqual([
      'badges.visibility.operator',
      'badges.visibility.value',
      'badges.visibility.entity',
      'badges.visibility.attribute'
    ]);
    expect(colorRuleFields.map((field) => field.path)).toEqual([
      'badges.color_rules.operator',
      'badges.color_rules.value',
      'badges.color_rules.color',
      'badges.color_rules.entity',
      'badges.color_rules.attribute'
    ]);
  });
});
