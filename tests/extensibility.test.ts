import { afterEach, describe, expect, it, vi } from 'vitest';

import { createActionsPlugin, registerPluginsFromConfig } from '../src/extensibility/index.js';
import { PLUGIN_HOOKS, getPluginSystem } from '../src/extensibility/PluginSystem.js';

function resetPluginSystem() {
  const pluginSystem = getPluginSystem();
  pluginSystem.enableSystem();

  pluginSystem.getPlugins().forEach((plugin) => {
    pluginSystem.unregister(plugin.id);
  });

  return pluginSystem;
}

describe('Extensibility helpers', () => {
  afterEach(() => {
    resetPluginSystem();
  });

  it('rejects remote plugin urls during config registration', () => {
    expect(() => registerPluginsFromConfig(['https://example.com/plugin.js'])).toThrow(
      /Remote plugin URLs are no longer supported/
    );
  });

  it('registers local plugin objects from config arrays', () => {
    const pluginSystem = resetPluginSystem();

    registerPluginsFromConfig([
      {
        id: 'local-only-plugin',
        hooks: {}
      }
    ]);

    expect(pluginSystem.hasPlugin('local-only-plugin')).toBe(true);
  });

  it('createActionsPlugin marks handled custom actions as stop signals', () => {
    const handler = vi.fn();
    const plugin = createActionsPlugin({
      demo: handler
    });

    const result = plugin.hooks?.[PLUGIN_HOOKS.ACTION_EXECUTE]?.({
      action: {
        action: 'custom',
        custom_action: 'demo'
      }
    }, {
      source: 'test'
    });

    expect(handler).toHaveBeenCalledWith(expect.any(Object), { source: 'test' });
    expect(result).toMatchObject({
      handled: true,
      stop: true
    });
  });
});
