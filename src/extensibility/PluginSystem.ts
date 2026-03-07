/**
 * Plugin System - система плагинов
 * 
 * Позволяет расширять функциональность Universal Card
 * через плагины без модификации основного кода.
 * 
 * @module extensibility/PluginSystem
 */

import type { EventLogger } from '../devtools/EventLogger.js';

export type PluginPayload = Record<string, unknown>;
export type PluginContext = Record<string, unknown>;
export type PluginHookResult = PluginPayload | false | void;
export type PluginHookHandler =
  (this: PluginContext, data: PluginPayload, context?: PluginContext) => PluginHookResult | Promise<PluginHookResult>;

export type PluginHookInput =
  | PluginHookHandler
  | {
      handler: PluginHookHandler;
      priority?: number;
    };

export type PluginHookDefinition = PluginHookHandler & {
  priority?: number;
};

type RegisteredHook = {
  pluginId: string;
  handler: PluginHookHandler;
  priority: number;
};

export type PluginDefinition = {
  id: string;
  name?: string;
  version?: string;
  description?: string;
  author?: string;
  hooks?: Record<string, PluginHookDefinition>;
  init?: (this: PluginContext) => void | Promise<void>;
  destroy?: (this: PluginContext) => void | Promise<void>;
};

export type PluginOptions = Omit<PluginDefinition, 'hooks'> & {
  hooks?: Record<string, PluginHookInput>;
};

type RegisteredPlugin = {
  id: string;
  name: string;
  version: string;
  hooks: Record<string, PluginHookDefinition>;
  init?: PluginDefinition['init'];
  destroy?: PluginDefinition['destroy'];
  enabled: boolean;
  context: PluginContext;
};

type PluginLogger = Pick<EventLogger, 'log'>;
type HookList = RegisteredHook[];
type PublicPluginInfo = {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
};

/**
 * Точки расширения (hooks)
 */
export const PLUGIN_HOOKS = Object.freeze({
  // Lifecycle
  BEFORE_INIT: 'beforeInit',
  AFTER_INIT: 'afterInit',
  BEFORE_RENDER: 'beforeRender',
  AFTER_RENDER: 'afterRender',
  BEFORE_UPDATE: 'beforeUpdate',
  AFTER_UPDATE: 'afterUpdate',
  BEFORE_DESTROY: 'beforeDestroy',

  // Config
  CONFIG_VALIDATE: 'configValidate',
  CONFIG_TRANSFORM: 'configTransform',

  // State
  STATE_CHANGE: 'stateChange',
  HASS_UPDATE: 'hassUpdate',

  // UI
  HEADER_RENDER: 'headerRender',
  BODY_RENDER: 'bodyRender',
  FOOTER_RENDER: 'footerRender',

  // Actions
  ACTION_EXECUTE: 'actionExecute',
  CLICK: 'click',
  HOLD: 'hold',

  // Custom
  CUSTOM: 'custom'
});

export const PUBLIC_PLUGIN_LIFECYCLE_VERSION = 2;

export const PUBLIC_PLUGIN_HOOKS = Object.freeze({
  BEFORE_INIT: PLUGIN_HOOKS.BEFORE_INIT,
  AFTER_INIT: PLUGIN_HOOKS.AFTER_INIT,
  BEFORE_RENDER: PLUGIN_HOOKS.BEFORE_RENDER,
  AFTER_RENDER: PLUGIN_HOOKS.AFTER_RENDER,
  BEFORE_UPDATE: PLUGIN_HOOKS.BEFORE_UPDATE,
  AFTER_UPDATE: PLUGIN_HOOKS.AFTER_UPDATE,
  BEFORE_DESTROY: PLUGIN_HOOKS.BEFORE_DESTROY,
  CONFIG_TRANSFORM: PLUGIN_HOOKS.CONFIG_TRANSFORM,
  CONFIG_VALIDATE: PLUGIN_HOOKS.CONFIG_VALIDATE,
  STATE_CHANGE: PLUGIN_HOOKS.STATE_CHANGE,
  HASS_UPDATE: PLUGIN_HOOKS.HASS_UPDATE,
  HEADER_RENDER: PLUGIN_HOOKS.HEADER_RENDER,
  BODY_RENDER: PLUGIN_HOOKS.BODY_RENDER,
  FOOTER_RENDER: PLUGIN_HOOKS.FOOTER_RENDER,
  ACTION_EXECUTE: PLUGIN_HOOKS.ACTION_EXECUTE,
  CLICK: PLUGIN_HOOKS.CLICK,
  HOLD: PLUGIN_HOOKS.HOLD
});

/**
 * Приоритеты плагинов
 */
export const PLUGIN_PRIORITY = Object.freeze({
  HIGHEST: 0,
  HIGH: 25,
  NORMAL: 50,
  LOW: 75,
  LOWEST: 100
});

/**
 * Класс системы плагинов
 */
export class PluginSystem {
  _plugins: Map<string, RegisteredPlugin>;
  _hooks: Map<string, HookList>;
  _enabled: boolean;
  _logger: PluginLogger | null;

  constructor() {
    this._plugins = new Map();
    this._hooks = new Map();
    this._enabled = true;
    this._logger = null;

    this._initHooks();
  }

  /**
   * Инициализирует хуки
   */
  _initHooks() {
    for (const hook of Object.values(PLUGIN_HOOKS)) {
      this._hooks.set(hook, []);
    }
  }

  /**
   * Включает логирование
   * @param {EventLogger} logger 
   */
  setLogger(logger: PluginLogger | null) {
    this._logger = logger;
  }

  /**
   * Регистрирует плагин
   * @param {Object} plugin - Объект плагина
   * @returns {boolean} Успех регистрации
   */
  register(plugin: PluginDefinition | PluginOptions) {
    if (!this._validatePlugin(plugin)) {
      console.error('[PluginSystem] Invalid plugin:', plugin);
      return false;
    }

    const normalizedPlugin = this._normalizePlugin(plugin);
    const { id, name, version, hooks, init, destroy } = normalizedPlugin;

    // Проверяем на дубликаты
    if (this._plugins.has(id)) {
      console.warn(`[PluginSystem] Plugin "${id}" already registered, updating...`);
      this.unregister(id);
    }

    // Сохраняем плагин
    this._plugins.set(id, {
      id,
      name: name || id,
      version: version || '1.0.0',
      hooks: hooks || {},
      init,
      destroy,
      enabled: true,
      context: {}
    });

    // Регистрируем хуки
    this._registerHooks(id, hooks || {});

    // Вызываем init
    if (init) {
      try {
        init.call(this._plugins.get(id).context);
      } catch (e) {
        console.error(`[PluginSystem] Error initializing plugin "${id}":`, e);
      }
    }

    this._log('info', `Plugin registered: ${name || id} v${version || '1.0.0'}`);
    return true;
  }

  /**
   * Валидирует плагин
   * @param {Object} plugin 
   * @returns {boolean}
   */
  _validatePlugin(plugin: unknown): plugin is PluginDefinition | PluginOptions {
    if (!plugin || typeof plugin !== 'object') return false;
    if (!('id' in plugin) || typeof plugin.id !== 'string') return false;
    return true;
  }

  _normalizePlugin(plugin: PluginDefinition | PluginOptions): PluginDefinition {
    const normalizedHooks: Record<string, PluginHookDefinition> = {};

    for (const [hookName, handler] of Object.entries(plugin.hooks || {})) {
      if (typeof handler === 'function') {
        normalizedHooks[hookName] = handler;
        continue;
      }

      const normalizedHandler = handler.handler as PluginHookDefinition;
      if (handler.priority != null) {
        normalizedHandler.priority = handler.priority;
      }
      normalizedHooks[hookName] = normalizedHandler;
    }

    return {
      id: plugin.id,
      name: plugin.name || plugin.id,
      version: plugin.version || '1.0.0',
      description: plugin.description || '',
      author: plugin.author || '',
      hooks: normalizedHooks,
      init: plugin.init,
      destroy: plugin.destroy
    };
  }

  /**
   * Регистрирует хуки плагина
   * @param {string} pluginId 
   * @param {Object} hooks 
   */
  _registerHooks(pluginId: string, hooks: Record<string, PluginHookDefinition> = {}) {
    for (const [hookName, handler] of Object.entries(hooks)) {
      if (!this._hooks.has(hookName)) {
        // Создаём custom hook
        this._hooks.set(hookName, []);
      }

      const hookHandler: RegisteredHook = {
        pluginId,
        handler,
        priority: handler.priority != null ? handler.priority : PLUGIN_PRIORITY.NORMAL
      };

      this._hooks.get(hookName)?.push(hookHandler);

      // Сортируем по приоритету
      this._hooks.get(hookName)?.sort((a, b) => a.priority - b.priority);
    }
  }

  /**
   * Удаляет регистрацию плагина
   * @param {string} pluginId 
   * @returns {boolean}
   */
  unregister(pluginId: string) {
    const plugin = this._plugins.get(pluginId);
    if (!plugin) return false;

    // Вызываем destroy
    if (plugin.destroy) {
      try {
        plugin.destroy.call(plugin.context);
      } catch (e) {
        console.error(`[PluginSystem] Error destroying plugin "${pluginId}":`, e);
      }
    }

    // Удаляем хуки
    for (const handlers of this._hooks.values()) {
      const index = handlers.findIndex(h => h.pluginId === pluginId);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }

    this._plugins.delete(pluginId);
    this._log('info', `Plugin unregistered: ${pluginId}`);
    return true;
  }

  /**
   * Включает плагин
   * @param {string} pluginId 
   */
  enable(pluginId: string) {
    const plugin = this._plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = true;
    }
  }

  /**
   * Выключает плагин
   * @param {string} pluginId 
   */
  disable(pluginId: string) {
    const plugin = this._plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = false;
    }
  }

  /**
   * Выполняет хук
   * @param {string} hookName - Имя хука
   * @param {Object} data - Данные для передачи
   * @param {Object} context - Контекст выполнения
   * @returns {Object} Модифицированные данные
   */
  async executeHook(hookName: string, data: PluginPayload = {}, context: PluginContext = {}) {
    if (!this._enabled) return data;

    const handlers = this._hooks.get(hookName);
    if (!handlers || handlers.length === 0) return data;

    let result = { ...data };

    for (const { pluginId, handler } of handlers) {
      const plugin = this._plugins.get(pluginId);
      
      if (!plugin || !plugin.enabled) continue;

      try {
        const hookResult = await handler.call(plugin.context, result, context);
        
        // Если handler вернул объект, мержим с результатом
        if (hookResult && typeof hookResult === 'object') {
          result = { ...result, ...hookResult };
        }
        
        // Если вернул false - прерываем цепочку
        if (hookResult === false) {
          this._log('debug', `Hook "${hookName}" chain stopped by plugin "${pluginId}"`);
          break;
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[PluginSystem] Error in hook "${hookName}" (plugin: ${pluginId}):`, e);
        this._log('error', `Hook error: ${hookName} (${pluginId}): ${message}`);
      }
    }

    return result;
  }

  /**
   * Синхронно выполняет хук
   * @param {string} hookName 
   * @param {Object} data 
   * @param {Object} context 
   * @returns {Object}
   */
  executeHookSync(hookName: string, data: PluginPayload = {}, context: PluginContext = {}) {
    if (!this._enabled) return data;

    const handlers = this._hooks.get(hookName);
    if (!handlers || handlers.length === 0) return data;

    let result = { ...data };

    for (const { pluginId, handler } of handlers) {
      const plugin = this._plugins.get(pluginId);
      
      if (!plugin || !plugin.enabled) continue;

      try {
        const hookResult = handler.call(plugin.context, result, context);
        
        if (hookResult && typeof hookResult === 'object') {
          result = { ...result, ...hookResult };
        }
        
        if (hookResult === false) {
          break;
        }
      } catch (e) {
        console.error(`[PluginSystem] Error in hook "${hookName}" (plugin: ${pluginId}):`, e);
      }
    }

    return result;
  }

  /**
   * Получает список плагинов
   * @returns {Object[]}
   */
  getPlugins(): PublicPluginInfo[] {
    return Array.from(this._plugins.values()).map(p => ({
      id: p.id,
      name: p.name,
      version: p.version,
      enabled: p.enabled
    }));
  }

  /**
   * Получает плагин по ID
   * @param {string} pluginId 
   * @returns {Object|null}
   */
  getPlugin(pluginId: string): RegisteredPlugin | null {
    return this._plugins.get(pluginId) || null;
  }

  /**
   * Проверяет наличие плагина
   * @param {string} pluginId 
   * @returns {boolean}
   */
  hasPlugin(pluginId: string) {
    return this._plugins.has(pluginId);
  }

  /**
   * Включает систему плагинов
   */
  enableSystem() {
    this._enabled = true;
  }

  /**
   * Выключает систему плагинов
   */
  disableSystem() {
    this._enabled = false;
  }

  /**
   * Логирует сообщение
   * @param {string} level 
   * @param {string} message 
   */
  _log(level: string, message: string) {
    if (this._logger) {
      this._logger.log(level, 'plugin', message);
    }
  }

  /**
   * Уничтожает систему
   */
  destroy() {
    // Уничтожаем все плагины
    for (const pluginId of this._plugins.keys()) {
      this.unregister(pluginId);
    }

    this._hooks.clear();
    this._enabled = false;
  }
}

// Глобальный экземпляр
let instance: PluginSystem | null = null;

/**
 * Получает экземпляр системы плагинов
 * @returns {PluginSystem}
 */
export function getPluginSystem() {
  if (!instance) {
    instance = new PluginSystem();
  }
  return instance;
}

/**
 * Хелпер для создания плагина
 * @param {Object} options 
 * @returns {Object}
 */
export function createPlugin(options: PluginOptions): PluginDefinition {
  const hooks: Record<string, PluginHookDefinition> = {};

  for (const [hookName, handler] of Object.entries(options.hooks || {})) {
    if (typeof handler === 'function') {
      hooks[hookName] = handler;
      continue;
    }

    const normalizedHandler = handler.handler as PluginHookDefinition;
    if (handler.priority != null) {
      normalizedHandler.priority = handler.priority;
    }
    hooks[hookName] = normalizedHandler;
  }

  return {
    id: options.id,
    name: options.name || options.id,
    version: options.version || '1.0.0',
    description: options.description || '',
    author: options.author || '',
    hooks,
    init: options.init,
    destroy: options.destroy
  };
}

/**
 * Пример плагина
 */
export const ExamplePlugin = createPlugin({
  id: 'example-plugin',
  name: 'Example Plugin',
  version: '1.0.0',
  description: 'Демонстрационный плагин',

  hooks: {
    [PLUGIN_HOOKS.AFTER_INIT]: function(data) {
      console.log('[ExamplePlugin] Card initialized!');
      return data;
    },

    [PLUGIN_HOOKS.CONFIG_TRANSFORM]: function(data) {
      // Можно модифицировать конфиг
      return data;
    }
  },

  init() {
    console.log('[ExamplePlugin] Plugin initialized');
  },

  destroy() {
    console.log('[ExamplePlugin] Plugin destroyed');
  }
});

export default PluginSystem;
