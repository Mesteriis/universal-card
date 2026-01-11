/**
 * Extensibility - расширяемость карточки
 * 
 * @module extensibility
 */

// Plugin System
export {
  PluginSystem,
  PLUGIN_HOOKS,
  PLUGIN_PRIORITY,
  getPluginSystem,
  createPlugin,
  ExamplePlugin
} from './PluginSystem.js';

// Custom CSS
export {
  CustomCSS,
  CSS_MODES,
  CSS_SCOPES
} from './CustomCSS.js';

// Импорты для удобства
import { PluginSystem, getPluginSystem, createPlugin } from './PluginSystem.js';
import { CustomCSS } from './CustomCSS.js';

/**
 * Инициализирует систему расширений для карточки
 * @param {HTMLElement} shadowRoot - Shadow root карточки
 * @param {Object} options - Опции
 * @returns {Object}
 */
export function initExtensibility(shadowRoot, options = {}) {
  const pluginSystem = getPluginSystem();
  const customCSS = new CustomCSS(shadowRoot, options.cssConfig);

  return {
    plugins: pluginSystem,
    css: customCSS,

    /**
     * Регистрирует плагин
     * @param {Object} plugin 
     */
    registerPlugin(plugin) {
      return pluginSystem.register(plugin);
    },

    /**
     * Добавляет CSS
     * @param {string} id 
     * @param {string} css 
     * @param {Object} options 
     */
    addCSS(id, css, options) {
      return customCSS.add(id, css, options);
    },

    /**
     * Выполняет хук
     * @param {string} hookName 
     * @param {Object} data 
     * @param {Object} context 
     */
    async executeHook(hookName, data, context) {
      return pluginSystem.executeHook(hookName, data, context);
    },

    /**
     * Уничтожает систему расширений
     */
    destroy() {
      customCSS.destroy();
      // pluginSystem не уничтожаем - он глобальный
    }
  };
}

/**
 * Регистрирует плагины из конфигурации
 * @param {Array} plugins - Массив плагинов из конфига
 */
export function registerPluginsFromConfig(plugins) {
  if (!Array.isArray(plugins)) return;

  const pluginSystem = getPluginSystem();

  for (const plugin of plugins) {
    if (typeof plugin === 'string') {
      // URL плагина - загружаем динамически
      loadPluginFromUrl(plugin);
    } else if (typeof plugin === 'object') {
      pluginSystem.register(plugin);
    }
  }
}

/**
 * Загружает плагин по URL
 * @param {string} url 
 */
async function loadPluginFromUrl(url) {
  try {
    const module = await import(url);
    const plugin = module.default || module.plugin;
    
    if (plugin) {
      getPluginSystem().register(plugin);
    }
  } catch (e) {
    console.error(`[Extensibility] Failed to load plugin from ${url}:`, e);
  }
}

/**
 * Создаёт плагин для добавления иконок
 * @param {Object} iconMap - { entityPattern: iconConfig }
 * @returns {Object}
 */
export function createIconPlugin(iconMap) {
  return createPlugin({
    id: 'custom-icons',
    name: 'Custom Icons',
    version: '1.0.0',
    
    hooks: {
      headerRender: function(data) {
        const entityId = data.config?.entity;
        if (!entityId) return data;

        for (const [pattern, iconConfig] of Object.entries(iconMap)) {
          if (new RegExp(pattern).test(entityId)) {
            return {
              ...data,
              icon: iconConfig.icon || data.icon,
              iconColor: iconConfig.color || data.iconColor
            };
          }
        }
        
        return data;
      }
    }
  });
}

/**
 * Создаёт плагин для кастомных действий
 * @param {Object} actions - { actionName: handler }
 * @returns {Object}
 */
export function createActionsPlugin(actions) {
  return createPlugin({
    id: 'custom-actions',
    name: 'Custom Actions',
    version: '1.0.0',
    
    hooks: {
      actionExecute: function(data, context) {
        const { action } = data;
        
        if (action?.action === 'custom' && action.custom_action) {
          const handler = actions[action.custom_action];
          if (handler) {
            handler(data, context);
            return false; // Останавливаем стандартную обработку
          }
        }
        
        return data;
      }
    }
  });
}

/**
 * Создаёт плагин для логирования
 * @returns {Object}
 */
export function createLoggingPlugin() {
  return createPlugin({
    id: 'logging',
    name: 'Logging Plugin',
    version: '1.0.0',
    
    hooks: {
      afterInit: function(data) {
        console.log('[UC] Card initialized', data.config);
        return data;
      },
      
      stateChange: function(data) {
        console.log('[UC] State changed', data.entityId, data.newState);
        return data;
      },
      
      click: function(data) {
        console.log('[UC] Click', data);
        return data;
      }
    }
  });
}
