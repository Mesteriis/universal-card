/**
 * Extensibility - расширяемость карточки
 * 
 * @module extensibility
 */

// Plugin System
export {
  PluginSystem,
  PLUGIN_HOOKS,
  PUBLIC_PLUGIN_HOOKS,
  PUBLIC_PLUGIN_LIFECYCLE_VERSION,
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
import {
  PluginSystem,
  getPluginSystem,
  createPlugin,
  type PluginContext,
  type PluginDefinition,
  type PluginPayload,
  PLUGIN_HOOKS
} from './PluginSystem.js';
import { CustomCSS, type CustomCSSConfig } from './CustomCSS.js';

type ExtensibilityOptions = {
  cssConfig?: Partial<CustomCSSConfig>;
};

type IconPluginConfig = {
  icon?: string;
  color?: string;
};

type HeaderIconElement = HTMLElement & {
  icon?: string | null;
};

type IconPluginData = PluginPayload & {
  config?: {
    entity?: string;
  };
  element?: ParentNode | null;
};

type ActionPluginHandler = (data: PluginPayload, context: PluginContext) => void;

/**
 * Инициализирует систему расширений для карточки
 * @param {HTMLElement} shadowRoot - Shadow root карточки
 * @param {Object} options - Опции
 * @returns {Object}
 */
export function initExtensibility(shadowRoot: ShadowRoot | HTMLElement, options: ExtensibilityOptions = {}) {
  const pluginSystem = getPluginSystem();
  const customCSS = new CustomCSS(shadowRoot, options.cssConfig);

  return {
    plugins: pluginSystem,
    css: customCSS,

    /**
     * Регистрирует плагин
     * @param {Object} plugin 
     */
    registerPlugin(plugin: PluginDefinition) {
      return pluginSystem.register(plugin);
    },

    /**
     * Добавляет CSS
     * @param {string} id 
     * @param {string} css 
     * @param {Object} options 
     */
    addCSS(id: string, css: string, options?: { scope?: string; mode?: string; priority?: number }) {
      return customCSS.add(id, css, options);
    },

    /**
     * Выполняет хук
     * @param {string} hookName 
     * @param {Object} data 
     * @param {Object} context 
     */
    async executeHook(hookName: string, data?: PluginPayload, context?: PluginContext) {
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
export function registerPluginsFromConfig(plugins: unknown) {
  if (!Array.isArray(plugins)) return;

  const pluginSystem = getPluginSystem();

  for (const plugin of plugins) {
    if (typeof plugin === 'string') {
      throw new TypeError(
        '[Extensibility] Remote plugin URLs are no longer supported. Register local plugin objects explicitly.'
      );
    }

    if (!plugin || typeof plugin !== 'object' || Array.isArray(plugin)) {
      throw new TypeError('[Extensibility] plugins config accepts only plugin objects.');
    }

    pluginSystem.register(plugin as PluginDefinition);
  }
}

/**
 * Создаёт плагин для добавления иконок
 * @param {Object} iconMap - { entityPattern: iconConfig }
 * @returns {Object}
 */
export function createIconPlugin(iconMap: Record<string, IconPluginConfig>): PluginDefinition {
  return createPlugin({
    id: 'custom-icons',
    name: 'Custom Icons',
    version: '1.0.0',
    
    hooks: {
      [PLUGIN_HOOKS.HEADER_RENDER]: function(data: IconPluginData) {
        const entityId = data.config?.entity;
        if (!entityId) return data;

        for (const [pattern, iconConfig] of Object.entries(iconMap)) {
          if (new RegExp(pattern).test(entityId)) {
            const iconElement = data.element?.querySelector?.('.header-icon') as HeaderIconElement | null;

            if (iconElement && iconConfig.icon) {
              iconElement.setAttribute('icon', iconConfig.icon);
            }

            if (iconElement && iconConfig.color) {
              iconElement.style.setProperty('color', iconConfig.color);
            }

            return {
              element: data.element
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
export function createActionsPlugin(actions: Record<string, ActionPluginHandler>): PluginDefinition {
  return createPlugin({
    id: 'custom-actions',
    name: 'Custom Actions',
    version: '1.0.0',
    
    hooks: {
      [PLUGIN_HOOKS.ACTION_EXECUTE]: function(data: PluginPayload, context: PluginContext) {
        const action = data.action as { action?: unknown; custom_action?: unknown } | undefined;
        
        if (
          action &&
          action.action === 'custom' &&
          typeof action.custom_action === 'string'
        ) {
          const handler = actions[action.custom_action];
          if (handler) {
            handler(data, context);
            return {
              handled: true,
              stop: true
            };
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
export function createLoggingPlugin(): PluginDefinition {
  return createPlugin({
    id: 'logging',
    name: 'Logging Plugin',
    version: '1.0.0',
    
    hooks: {
      [PLUGIN_HOOKS.AFTER_INIT]: function(data: PluginPayload) {
        console.log('[UC] Card initialized', data.config);
        return data;
      },
      
      [PLUGIN_HOOKS.STATE_CHANGE]: function(data: PluginPayload) {
        console.log('[UC] State changed', data.entityId, data.newState);
        return data;
      },
      
      [PLUGIN_HOOKS.CLICK]: function(data: PluginPayload) {
        console.log('[UC] Click', data);
        return data;
      }
    }
  });
}
