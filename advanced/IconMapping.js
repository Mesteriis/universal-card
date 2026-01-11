/**
 * Icon Mapping - динамическое сопоставление иконок
 * 
 * Позволяет динамически менять иконки и цвета
 * на основе состояния entity.
 * 
 * @module advanced/IconMapping
 */

/**
 * Предустановленные маппинги для распространённых типов entity
 */
export const PRESET_MAPPINGS = {
  // Освещение
  light: {
    on: { icon: 'mdi:lightbulb', color: 'var(--warning-color, #ffc107)' },
    off: { icon: 'mdi:lightbulb-off', color: 'var(--secondary-text-color)' },
    unavailable: { icon: 'mdi:lightbulb-question', color: 'var(--disabled-color)' }
  },
  
  // Выключатели
  switch: {
    on: { icon: 'mdi:toggle-switch', color: 'var(--primary-color)' },
    off: { icon: 'mdi:toggle-switch-off', color: 'var(--secondary-text-color)' }
  },
  
  // Замки
  lock: {
    locked: { icon: 'mdi:lock', color: 'var(--success-color, #4caf50)' },
    unlocked: { icon: 'mdi:lock-open', color: 'var(--warning-color, #ff9800)' },
    locking: { icon: 'mdi:lock-clock', color: 'var(--info-color)' },
    unlocking: { icon: 'mdi:lock-clock', color: 'var(--info-color)' }
  },
  
  // Двери/окна
  binary_sensor_door: {
    on: { icon: 'mdi:door-open', color: 'var(--warning-color, #ff9800)' },
    off: { icon: 'mdi:door-closed', color: 'var(--success-color, #4caf50)' }
  },
  
  binary_sensor_window: {
    on: { icon: 'mdi:window-open', color: 'var(--warning-color, #ff9800)' },
    off: { icon: 'mdi:window-closed', color: 'var(--success-color, #4caf50)' }
  },
  
  // Движение
  binary_sensor_motion: {
    on: { icon: 'mdi:motion-sensor', color: 'var(--primary-color)' },
    off: { icon: 'mdi:motion-sensor-off', color: 'var(--secondary-text-color)' }
  },
  
  // Присутствие
  binary_sensor_occupancy: {
    on: { icon: 'mdi:home-account', color: 'var(--primary-color)' },
    off: { icon: 'mdi:home-outline', color: 'var(--secondary-text-color)' }
  },
  
  // Батарея
  battery: {
    high: { icon: 'mdi:battery-high', color: 'var(--success-color, #4caf50)' },
    medium: { icon: 'mdi:battery-medium', color: 'var(--warning-color, #ff9800)' },
    low: { icon: 'mdi:battery-low', color: 'var(--error-color, #f44336)' },
    charging: { icon: 'mdi:battery-charging', color: 'var(--info-color)' }
  },
  
  // Климат
  climate: {
    heat: { icon: 'mdi:fire', color: '#ff5722' },
    cool: { icon: 'mdi:snowflake', color: '#2196f3' },
    heat_cool: { icon: 'mdi:sun-snowflake', color: 'var(--primary-color)' },
    auto: { icon: 'mdi:thermostat-auto', color: 'var(--success-color)' },
    dry: { icon: 'mdi:water-percent', color: '#795548' },
    fan_only: { icon: 'mdi:fan', color: '#00bcd4' },
    off: { icon: 'mdi:power', color: 'var(--secondary-text-color)' }
  },
  
  // Медиаплеер
  media_player: {
    playing: { icon: 'mdi:play-circle', color: 'var(--primary-color)' },
    paused: { icon: 'mdi:pause-circle', color: 'var(--warning-color)' },
    idle: { icon: 'mdi:stop-circle', color: 'var(--secondary-text-color)' },
    off: { icon: 'mdi:power', color: 'var(--secondary-text-color)' }
  },
  
  // Погода
  weather: {
    'clear-night': { icon: 'mdi:weather-night', color: '#1a237e' },
    cloudy: { icon: 'mdi:weather-cloudy', color: '#78909c' },
    fog: { icon: 'mdi:weather-fog', color: '#90a4ae' },
    hail: { icon: 'mdi:weather-hail', color: '#b0bec5' },
    lightning: { icon: 'mdi:weather-lightning', color: '#ffc107' },
    'lightning-rainy': { icon: 'mdi:weather-lightning-rainy', color: '#ff9800' },
    partlycloudy: { icon: 'mdi:weather-partly-cloudy', color: '#8bc34a' },
    pouring: { icon: 'mdi:weather-pouring', color: '#2196f3' },
    rainy: { icon: 'mdi:weather-rainy', color: '#03a9f4' },
    snowy: { icon: 'mdi:weather-snowy', color: '#e0e0e0' },
    'snowy-rainy': { icon: 'mdi:weather-snowy-rainy', color: '#b3e5fc' },
    sunny: { icon: 'mdi:weather-sunny', color: '#ffeb3b' },
    windy: { icon: 'mdi:weather-windy', color: '#26a69a' },
    'windy-variant': { icon: 'mdi:weather-windy-variant', color: '#4db6ac' }
  },
  
  // Персона
  person: {
    home: { icon: 'mdi:home-account', color: 'var(--success-color, #4caf50)' },
    not_home: { icon: 'mdi:account-arrow-right', color: 'var(--secondary-text-color)' },
    unknown: { icon: 'mdi:account-question', color: 'var(--warning-color)' }
  },
  
  // Пылесос
  vacuum: {
    cleaning: { icon: 'mdi:robot-vacuum', color: 'var(--primary-color)' },
    docked: { icon: 'mdi:robot-vacuum', color: 'var(--success-color)' },
    returning: { icon: 'mdi:robot-vacuum', color: 'var(--info-color)' },
    paused: { icon: 'mdi:robot-vacuum', color: 'var(--warning-color)' },
    idle: { icon: 'mdi:robot-vacuum', color: 'var(--secondary-text-color)' },
    error: { icon: 'mdi:robot-vacuum-alert', color: 'var(--error-color)' }
  }
};

/**
 * Класс для динамического сопоставления иконок
 */
export class IconMapping {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = config;
    this._customMappings = new Map();
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
  }

  /**
   * Регистрирует кастомный маппинг
   * @param {string} entityId - ID entity или паттерн (domain.*)
   * @param {Object} mapping - Маппинг состояний
   */
  register(entityId, mapping) {
    this._customMappings.set(entityId, mapping);
  }

  /**
   * Удаляет кастомный маппинг
   * @param {string} entityId 
   */
  unregister(entityId) {
    this._customMappings.delete(entityId);
  }

  /**
   * Получает иконку и цвет для entity
   * @param {string} entityId 
   * @param {Object} options - Дополнительные опции
   * @returns {Object} { icon, color }
   */
  getIconAndColor(entityId, options = {}) {
    if (!entityId || !this._hass?.states?.[entityId]) {
      return { icon: options.default_icon || 'mdi:help-circle', color: null };
    }

    const state = this._hass.states[entityId];
    const stateValue = state.state;
    const domain = entityId.split('.')[0];
    const deviceClass = state.attributes?.device_class;

    // 1. Проверяем кастомные маппинги
    let mapping = this._customMappings.get(entityId);
    
    // 2. Проверяем паттерн domain.*
    if (!mapping) {
      mapping = this._customMappings.get(`${domain}.*`);
    }

    // 3. Используем пресеты
    if (!mapping) {
      // Для binary_sensor учитываем device_class
      if (domain === 'binary_sensor' && deviceClass) {
        mapping = PRESET_MAPPINGS[`binary_sensor_${deviceClass}`];
      }
      
      if (!mapping) {
        mapping = PRESET_MAPPINGS[domain];
      }
    }

    // Если маппинг не найден
    if (!mapping) {
      return this._getDefaultIcon(state, options);
    }

    // Получаем значение для текущего состояния
    let result = mapping[stateValue];

    // Для числовых значений проверяем диапазоны
    if (!result && mapping._ranges) {
      const numValue = parseFloat(stateValue);
      if (!isNaN(numValue)) {
        result = this._findInRanges(mapping._ranges, numValue);
      }
    }

    // Для батареи - особая логика
    if (!result && domain === 'sensor' && deviceClass === 'battery') {
      result = this._getBatteryIcon(stateValue);
    }

    // Fallback
    if (!result) {
      result = mapping.default || mapping.unknown;
    }

    if (!result) {
      return this._getDefaultIcon(state, options);
    }

    return {
      icon: result.icon || options.default_icon || state.attributes?.icon,
      color: result.color || null
    };
  }

  /**
   * Ищет значение в диапазонах
   * @param {Array} ranges 
   * @param {number} value 
   * @returns {Object|null}
   */
  _findInRanges(ranges, value) {
    for (const range of ranges) {
      const { min = -Infinity, max = Infinity, ...result } = range;
      if (value >= min && value <= max) {
        return result;
      }
    }
    return null;
  }

  /**
   * Получает иконку для батареи
   * @param {string} stateValue 
   * @returns {Object}
   */
  _getBatteryIcon(stateValue) {
    const level = parseInt(stateValue, 10);
    
    if (isNaN(level)) {
      return PRESET_MAPPINGS.battery.unavailable || { 
        icon: 'mdi:battery-unknown', 
        color: 'var(--secondary-text-color)' 
      };
    }

    if (level <= 10) {
      return { icon: 'mdi:battery-10', color: 'var(--error-color, #f44336)' };
    } else if (level <= 20) {
      return { icon: 'mdi:battery-20', color: 'var(--error-color, #f44336)' };
    } else if (level <= 30) {
      return { icon: 'mdi:battery-30', color: 'var(--warning-color, #ff9800)' };
    } else if (level <= 40) {
      return { icon: 'mdi:battery-40', color: 'var(--warning-color, #ff9800)' };
    } else if (level <= 50) {
      return { icon: 'mdi:battery-50', color: 'var(--warning-color, #ff9800)' };
    } else if (level <= 60) {
      return { icon: 'mdi:battery-60', color: 'var(--success-color, #4caf50)' };
    } else if (level <= 70) {
      return { icon: 'mdi:battery-70', color: 'var(--success-color, #4caf50)' };
    } else if (level <= 80) {
      return { icon: 'mdi:battery-80', color: 'var(--success-color, #4caf50)' };
    } else if (level <= 90) {
      return { icon: 'mdi:battery-90', color: 'var(--success-color, #4caf50)' };
    } else {
      return { icon: 'mdi:battery', color: 'var(--success-color, #4caf50)' };
    }
  }

  /**
   * Получает иконку по умолчанию
   * @param {Object} state 
   * @param {Object} options 
   * @returns {Object}
   */
  _getDefaultIcon(state, options) {
    const icon = options.default_icon || 
                 state.attributes?.icon || 
                 this._getDomainIcon(state.entity_id);
    
    const color = state.state === 'on' || state.state === 'home' 
      ? 'var(--primary-color)' 
      : null;

    return { icon, color };
  }

  /**
   * Получает иконку домена по умолчанию
   * @param {string} entityId 
   * @returns {string}
   */
  _getDomainIcon(entityId) {
    const domain = entityId.split('.')[0];
    const domainIcons = {
      automation: 'mdi:robot',
      binary_sensor: 'mdi:checkbox-marked-circle',
      button: 'mdi:gesture-tap-button',
      calendar: 'mdi:calendar',
      camera: 'mdi:video',
      climate: 'mdi:thermostat',
      cover: 'mdi:window-shutter',
      device_tracker: 'mdi:account',
      fan: 'mdi:fan',
      group: 'mdi:google-circles-communities',
      input_boolean: 'mdi:toggle-switch',
      input_number: 'mdi:ray-vertex',
      input_select: 'mdi:format-list-bulleted',
      input_text: 'mdi:form-textbox',
      light: 'mdi:lightbulb',
      lock: 'mdi:lock',
      media_player: 'mdi:cast',
      person: 'mdi:account',
      scene: 'mdi:palette',
      script: 'mdi:script-text',
      sensor: 'mdi:eye',
      sun: 'mdi:white-balance-sunny',
      switch: 'mdi:flash',
      timer: 'mdi:timer',
      vacuum: 'mdi:robot-vacuum',
      weather: 'mdi:weather-cloudy',
      zone: 'mdi:map-marker'
    };
    
    return domainIcons[domain] || 'mdi:bookmark';
  }

  /**
   * Создаёт маппинг из конфигурации
   * @param {Array} config - Массив правил
   * @returns {Object}
   */
  static createMappingFromConfig(config) {
    const mapping = {};
    
    for (const rule of config) {
      if (rule.state !== undefined) {
        mapping[rule.state] = {
          icon: rule.icon,
          color: rule.color
        };
      }
      
      if (rule.above !== undefined || rule.below !== undefined) {
        if (!mapping._ranges) mapping._ranges = [];
        mapping._ranges.push({
          min: rule.above ?? -Infinity,
          max: rule.below ?? Infinity,
          icon: rule.icon,
          color: rule.color
        });
      }
    }

    return mapping;
  }

  /**
   * Рендерит иконку с цветом
   * @param {string} entityId 
   * @param {Object} options 
   * @returns {HTMLElement}
   */
  renderIcon(entityId, options = {}) {
    const { icon, color } = this.getIconAndColor(entityId, options);
    
    const iconEl = document.createElement('ha-icon');
    iconEl.setAttribute('icon', icon);
    
    if (color) {
      iconEl.style.color = color;
    }
    
    if (options.size) {
      iconEl.style.setProperty('--mdc-icon-size', 
        typeof options.size === 'number' ? `${options.size}px` : options.size
      );
    }

    return iconEl;
  }

  /**
   * Получает список доступных пресетов
   * @returns {string[]}
   */
  static getAvailablePresets() {
    return Object.keys(PRESET_MAPPINGS);
  }

  /**
   * Возвращает CSS стили (если нужны)
   * @returns {string}
   */
  static getStyles() {
    return `
      /* Icon Mapping не требует дополнительных стилей */
      /* Цвета применяются инлайн */
      
      .uc-mapped-icon {
        transition: color 0.3s ease;
      }
      
      .uc-mapped-icon.animate {
        animation: uc-icon-pulse 0.3s ease;
      }
      
      @keyframes uc-icon-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
    `;
  }
}

export default IconMapping;
