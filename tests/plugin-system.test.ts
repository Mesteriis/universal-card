import { describe, expect, it, vi } from 'vitest';

import {
  ExamplePlugin,
  PLUGIN_HOOKS,
  PLUGIN_PRIORITY,
  PluginSystem,
  PUBLIC_PLUGIN_HOOKS,
  PUBLIC_PLUGIN_LIFECYCLE_VERSION,
  createPlugin,
  getPluginSystem
} from '../src/extensibility/PluginSystem.js';

describe('PluginSystem', () => {
  it('exposes a frozen public lifecycle hook catalog', () => {
    expect(PUBLIC_PLUGIN_LIFECYCLE_VERSION).toBe(2);
    expect(Object.isFrozen(PLUGIN_HOOKS)).toBe(true);
    expect(Object.isFrozen(PLUGIN_PRIORITY)).toBe(true);
    expect(PUBLIC_PLUGIN_HOOKS).toMatchObject({
      BEFORE_INIT: 'beforeInit',
      AFTER_RENDER: 'afterRender',
      CONFIG_TRANSFORM: 'configTransform',
      HASS_UPDATE: 'hassUpdate',
      HEADER_RENDER: 'headerRender',
      BODY_RENDER: 'bodyRender',
      FOOTER_RENDER: 'footerRender',
      ACTION_EXECUTE: 'actionExecute',
      CLICK: 'click',
      HOLD: 'hold'
    });
  });

  it('registers plugins and executes configured hooks in priority order', async () => {
    const pluginSystem = new PluginSystem();
    const executionOrder: string[] = [];

    pluginSystem.register(createPlugin({
      id: 'second',
      hooks: {
        [PLUGIN_HOOKS.BEFORE_RENDER]: {
          priority: PLUGIN_PRIORITY.LOW,
          handler(data: { steps?: string[] }) {
            executionOrder.push('second');
            return {
              steps: [...(data.steps || []), 'second']
            };
          }
        }
      }
    }));

    pluginSystem.register(createPlugin({
      id: 'first',
      hooks: {
        [PLUGIN_HOOKS.BEFORE_RENDER]: {
          priority: PLUGIN_PRIORITY.HIGH,
          handler(data: { steps?: string[] }) {
            executionOrder.push('first');
            return {
              steps: [...(data.steps || []), 'first']
            };
          }
        }
      }
    }));

    const result = await pluginSystem.executeHook(PLUGIN_HOOKS.BEFORE_RENDER, { steps: [] });

    expect(pluginSystem.getPlugins().map((plugin) => plugin.id)).toEqual(
      expect.arrayContaining(['first', 'second'])
    );
    expect(executionOrder).toEqual(['first', 'second']);
    expect(result.steps).toEqual(['first', 'second']);
  });

  it('rejects invalid plugins and applies createPlugin defaults', () => {
    const pluginSystem = new PluginSystem();
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(pluginSystem.register(null as any)).toBe(false);

    const plugin = createPlugin({ id: 'basic-plugin' });
    expect(plugin).toMatchObject({
      id: 'basic-plugin',
      name: 'basic-plugin',
      version: '1.0.0',
      hooks: {}
    });
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('supports duplicate registration, logger integration, enable/disable, and unregister', () => {
    const pluginSystem = new PluginSystem();
    const logger = { log: vi.fn() };
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const destroyCalls: string[] = [];

    pluginSystem.setLogger(logger);

    expect(pluginSystem.register(createPlugin({
      id: 'dup-plugin',
      init() {},
      destroy() {
        destroyCalls.push('v1');
      }
    }))).toBe(true);

    pluginSystem.disable('dup-plugin');
    expect(pluginSystem.getPlugins()[0].enabled).toBe(false);
    pluginSystem.enable('dup-plugin');
    expect(pluginSystem.getPlugin('dup-plugin')?.enabled).toBe(true);
    expect(pluginSystem.hasPlugin('dup-plugin')).toBe(true);

    expect(pluginSystem.register(createPlugin({
      id: 'dup-plugin',
      version: '2.0.0',
      destroy() {
        destroyCalls.push('v2');
      }
    }))).toBe(true);

    expect(destroyCalls).toContain('v1');
    expect(pluginSystem.getPlugin('dup-plugin')?.version).toBe('2.0.0');
    expect(pluginSystem.unregister('dup-plugin')).toBe(true);
    expect(pluginSystem.unregister('missing-plugin')).toBe(false);
    expect(destroyCalls).toContain('v2');
    expect(logger.log).toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('handles sync and async hook control flow, errors, and system toggles', async () => {
    const pluginSystem = new PluginSystem();
    const logger = { log: vi.fn() };
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const executionOrder: string[] = [];

    pluginSystem.setLogger(logger);

    pluginSystem.register(createPlugin({
      id: 'stopper',
      hooks: {
        custom: {
          priority: PLUGIN_PRIORITY.HIGH,
          handler() {
            executionOrder.push('stopper');
            return false;
          }
        }
      }
    }));

    pluginSystem.register(createPlugin({
      id: 'worker',
      hooks: {
        custom(data: { steps?: string[] }) {
          executionOrder.push('worker');
          return {
            steps: [...(data.steps || []), 'worker']
          };
        }
      }
    }));

    pluginSystem.register(createPlugin({
      id: 'failing',
      hooks: {
        custom() {
          throw new Error('boom');
        }
      }
    }));

    const syncResult = pluginSystem.executeHookSync('custom', { steps: [] });
    expect(syncResult.steps).toEqual([]);
    expect(executionOrder).toEqual(['stopper']);

    pluginSystem.disable('stopper');
    executionOrder.length = 0;

    const asyncResult = await pluginSystem.executeHook('custom', { steps: [] });
    expect(asyncResult.steps).toEqual(['worker']);
    expect(executionOrder).toEqual(['worker']);
    expect(logger.log).toHaveBeenCalledWith('error', 'plugin', expect.stringContaining('Hook error'));

    pluginSystem.disableSystem();
    expect(await pluginSystem.executeHook('custom', { steps: ['unchanged'] })).toEqual({
      steps: ['unchanged']
    });

    pluginSystem.enableSystem();
    pluginSystem.destroy();

    expect(pluginSystem.getPlugins()).toEqual([]);
    expect(pluginSystem.executeHookSync('custom', { steps: ['after-destroy'] })).toEqual({
      steps: ['after-destroy']
    });
    expect(errorSpy).toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it('exposes a global singleton and example plugin contract', () => {
    const first = getPluginSystem();
    const second = getPluginSystem();
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    expect(first).toBe(second);
    expect(ExamplePlugin.id).toBe('example-plugin');
    expect(Object.keys(ExamplePlugin.hooks || {})).toEqual(
      expect.arrayContaining([PLUGIN_HOOKS.AFTER_INIT, PLUGIN_HOOKS.CONFIG_TRANSFORM])
    );

    ExamplePlugin.hooks?.[PLUGIN_HOOKS.AFTER_INIT]?.({ sample: true });
    ExamplePlugin.init?.();
    ExamplePlugin.destroy?.();

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
