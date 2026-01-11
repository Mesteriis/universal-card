/**
 * Plugin System - система плагинов
 * 
 * Позволяет расширять функциональность Universal Card
 * через плагины без модификации основного кода.
 * 
 * @module extensibility/PluginSystem
 */

import { getLogger } from '../devtools/EventLogger.js';

/**
 * Точки расширения (hooks)
 */
export const PLUGIN_HOOKS = {
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
};

/**
 * Приоритеты плагинов
 */
export const PLUGIN_PRIORITY = {
  HIGHEST: 0,
  HIGH: 25,
  NORMAL: 50,
  LOW: 75,
  LOWEST: 100
};

/**
 * Класс системы плагинов
 */
export class PluginSystem {
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
  setLogger(logger) {
    this._logger = logger;
  }

  /**
   * Регистрирует плагин
   * @param {Object} plugin - Объект плагина
   * @returns {boolean} Успех регистрации
   */
  register(plugin) {
    if (!this._validatePlugin(plugin)) {
      console.error('[PluginSystem] Invalid plugin:', plugin);
      return false;
    }

    const { id, name, version, hooks, init, destroy } = plugin;

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
  _validatePlugin(plugin) {
    if (!plugin || typeof plugin !== 'object') return false;
    if (!plugin.id || typeof plugin.id !== 'string') return false;
    return true;
  }

  /**
   * Регистрирует хуки плагина
   * @param {string} pluginId 
   * @param {Object} hooks 
   */
  _registerHooks(pluginId, hooks) {
    for (const [hookName, handler] of Object.entries(hooks)) {
      if (!this._hooks.has(hookName)) {
        // Создаём custom hook
        this._hooks.set(hookName, []);
      }

      const hookHandler = {
        pluginId,
        handler: typeof handler === 'function' ? handler : handler.handler,
        priority: typeof handler === 'object' && handler.priority != null ? handler.priority : PLUGIN_PRIORITY.NORMAL
      };

      this._hooks.get(hookName).push(hookHandler);

      // Сортируем по приоритету
      this._hooks.get(hookName).sort((a, b) => a.priority - b.priority);
    }
  }

  /**
   * Удаляет регистрацию плагина
   * @param {string} pluginId 
   * @returns {boolean}
   */
  unregister(pluginId) {
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
  enable(pluginId) {
    const plugin = this._plugins.get(pluginId);
    if (plugin) {
      plugin.enabled = true;
    }
  }

  /**
   * Выключает плагин
   * @param {string} pluginId 
   */
  disable(pluginId) {
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
  async executeHook(hookName, data = {}, context = {}) {
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
        console.error(`[PluginSystem] Error in hook "${hookName}" (plugin: ${pluginId}):`, e);
        this._log('error', `Hook error: ${hookName} (${pluginId}): ${e.message}`);
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
  executeHookSync(hookName, data = {}, context = {}) {
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
  getPlugins() {
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
  getPlugin(pluginId) {
    return this._plugins.get(pluginId) || null;
  }

  /**
   * Проверяет наличие плагина
   * @param {string} pluginId 
   * @returns {boolean}
   */
  hasPlugin(pluginId) {
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
  _log(level, message) {
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
let instance = null;

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
export function createPlugin(options) {
  return {
    id: options.id,
    name: options.name || options.id,
    version: options.version || '1.0.0',
    description: options.description || '',
    author: options.author || '',
    hooks: options.hooks || {},
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
