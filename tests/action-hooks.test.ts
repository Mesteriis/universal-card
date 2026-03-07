import { describe, expect, it, vi } from 'vitest';

import { ACTION_TYPES } from '../src/core/constants.js';
import {
  buildActionExecutionOptions,
  executeCardActionWithPluginBridge,
  isFooterCardAction,
  isHeaderCardAction,
  runActionPluginHook,
  runInteractionHook,
  shouldStopPluginResult
} from '../src/core/action-hooks.js';
import { PLUGIN_HOOKS } from '../src/extensibility/PluginSystem.js';

describe('action-hooks', () => {
  it('normalizes plugin stop signals', () => {
    expect(shouldStopPluginResult({ stop: true })).toBe(true);
    expect(shouldStopPluginResult({ preventDefault: true })).toBe(true);
    expect(shouldStopPluginResult({ handled: true })).toBe(true);
    expect(shouldStopPluginResult({})).toBe(false);
    expect(shouldStopPluginResult(null)).toBe(false);
  });

  it('builds normalized action execution options', () => {
    const hookExecutor = vi.fn();
    expect(buildActionExecutionOptions({
      actionKey: 'tap_action',
      executePluginHookSync: hookExecutor,
      section: 'header'
    })).toEqual({
      actionKey: 'tap_action',
      event: null,
      executePluginHookSync: hookExecutor,
      interaction: null,
      meta: null,
      section: 'header',
      source: null
    });
  });

  it('runs interaction hooks through executor or returns fallback payload', () => {
    const executor = vi.fn((_hookName, data) => ({
      ...data,
      accepted: true
    }));

    expect(runInteractionHook({
      actionConfig: { action: 'navigate' },
      actionKey: 'tap_action',
      hookName: PLUGIN_HOOKS.CLICK,
      interaction: 'tap',
      source: 'header'
    })).toMatchObject({
      action: { action: 'navigate' },
      actionKey: 'tap_action',
      interaction: 'tap',
      source: 'header'
    });

    expect(runInteractionHook({
      actionConfig: { action: 'navigate' },
      actionKey: 'tap_action',
      executePluginHookSync: executor,
      extra: { badgeIndex: 2 },
      hookName: PLUGIN_HOOKS.CLICK,
      interaction: 'tap',
      source: 'badge'
    })).toMatchObject({
      accepted: true,
      badgeIndex: 2,
      source: 'badge'
    });
  });

  it('runs action hooks and allows rewriting or stopping execution', () => {
    const executor = vi.fn((_hookName, data) => ({
      ...data,
      action: {
        action: 'navigate',
        navigation_path: '/rewritten'
      }
    }));

    const rewritten = runActionPluginHook(null, { action: 'call-service' }, {
      actionKey: 'tap_action',
      executePluginHookSync: executor,
      section: 'header',
      source: 'header'
    });

    expect(rewritten.action).toMatchObject({
      action: 'navigate',
      navigation_path: '/rewritten'
    });
    expect(rewritten.stopped).toBe(false);

    const stopped = runActionPluginHook(null, { action: 'navigate' }, {
      executePluginHookSync: () => ({ stop: true }),
      source: 'header'
    });

    expect(stopped.stopped).toBe(true);
  });

  it('distinguishes header and footer card actions', () => {
    expect(isHeaderCardAction({ action: ACTION_TYPES.TOGGLE })).toBe(true);
    expect(isHeaderCardAction({ action: ACTION_TYPES.TOGGLE, target: 'entity' })).toBe(false);
    expect(isFooterCardAction({ action: ACTION_TYPES.TOGGLE })).toBe(false);
    expect(isFooterCardAction({ action: ACTION_TYPES.TOGGLE, target: 'card' })).toBe(true);
    expect(isFooterCardAction({ action: ACTION_TYPES.EXPAND })).toBe(true);
  });

  it('dispatches card actions and can fall back to generic action execution', () => {
    const dispatchCardAction = vi.fn();
    const executeAction = vi.fn();

    executeCardActionWithPluginBridge({
      actionConfig: { action: ACTION_TYPES.EXPAND },
      actionKey: 'tap_action',
      dispatchCardAction,
      executeAction,
      isCardAction: isHeaderCardAction,
      section: 'header'
    });

    expect(dispatchCardAction).toHaveBeenCalledWith(ACTION_TYPES.EXPAND);
    expect(executeAction).not.toHaveBeenCalled();

    dispatchCardAction.mockClear();

    executeCardActionWithPluginBridge({
      actionConfig: { action: ACTION_TYPES.TOGGLE, target: 'card' },
      actionKey: 'tap_action',
      dispatchCardAction,
      executeAction,
      executePluginHookSync: () => ({
        action: {
          action: 'navigate',
          navigation_path: '/generic'
        }
      }),
      isCardAction: isFooterCardAction,
      section: 'footer',
      triggerMeta: {
        interaction: 'tap',
        source: 'footer'
      }
    });

    expect(dispatchCardAction).not.toHaveBeenCalled();
    expect(executeAction).toHaveBeenCalledWith(
      {
        action: 'navigate',
        navigation_path: '/generic'
      },
      expect.objectContaining({
        actionKey: 'tap_action',
        interaction: 'tap',
        section: 'footer',
        source: 'footer'
      })
    );
  });
});
