/**
 * Auto Grouping - автоматическая группировка entity
 * 
 * Автоматически организует entity по домену, области,
 * классу устройства или кастомным правилам.
 * 
 * @module complex/AutoGrouping
 */

/**
 * Стратегии группировки
 */
export const GROUPING_STRATEGIES = {
  DOMAIN: 'domain',           // По домену (light.*, switch.*, etc.)
  AREA: 'area',               // По области (Гостиная, Спальня)
  DEVICE_CLASS: 'device_class', // По классу устройства
  DEVICE: 'device',           // По устройству
  FLOOR: 'floor',             // По этажу
  LABEL: 'label',             // По метке
  STATE: 'state',             // По текущему состоянию
  CUSTOM: 'custom'            // Кастомная группировка
};

/**
 * Порядок сортировки групп
 */
export const SORT_ORDER = {
  ALPHABETICAL: 'alphabetical',
  COUNT_DESC: 'count_desc',
  COUNT_ASC: 'count_asc',
  PRIORITY: 'priority',
  CUSTOM: 'custom'
};

/**
 * Иконки по умолчанию для доменов
 */
const DOMAIN_ICONS = {
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
  number: 'mdi:ray-vertex',
  person: 'mdi:account',
  scene: 'mdi:palette',
  script: 'mdi:script-text',
  select: 'mdi:format-list-bulleted',
  sensor: 'mdi:eye',
  sun: 'mdi:white-balance-sunny',
  switch: 'mdi:flash',
  timer: 'mdi:timer',
  update: 'mdi:package-up',
  vacuum: 'mdi:robot-vacuum',
  weather: 'mdi:weather-cloudy',
  zone: 'mdi:map-marker'
};

/**
 * Локализация названий доменов
 */
const DOMAIN_NAMES = {
  automation: 'Автоматизации',
  binary_sensor: 'Бинарные сенсоры',
  button: 'Кнопки',
  calendar: 'Календари',
  camera: 'Камеры',
  climate: 'Климат',
  cover: 'Шторы/Жалюзи',
  device_tracker: 'Трекеры',
  fan: 'Вентиляторы',
  group: 'Группы',
  input_boolean: 'Переключатели',
  input_number: 'Числа',
  input_select: 'Списки выбора',
  input_text: 'Текстовые поля',
  light: 'Освещение',
  lock: 'Замки',
  media_player: 'Медиаплееры',
  number: 'Числа',
  person: 'Люди',
  scene: 'Сцены',
  script: 'Скрипты',
  select: 'Списки выбора',
  sensor: 'Сенсоры',
  sun: 'Солнце',
  switch: 'Выключатели',
  timer: 'Таймеры',
  update: 'Обновления',
  vacuum: 'Пылесосы',
  weather: 'Погода',
  zone: 'Зоны'
};

/**
 * Конфигурация по умолчанию
 */
const DEFAULT_CONFIG = {
  strategy: GROUPING_STRATEGIES.DOMAIN,
  sort: SORT_ORDER.ALPHABETICAL,
  collapsed_by_default: false,
  show_empty_groups: false,
  show_counts: true,
  max_items_per_group: 0,  // 0 = без ограничения
  exclude_domains: [],
  exclude_entities: [],
  include_entities: [],
  priority_order: [],       // Порядок для SORT_ORDER.PRIORITY
  custom_groups: {}         // Для CUSTOM стратегии
};

/**
 * Класс для автоматической группировки entity
 */
export class AutoGrouping {
  /**
   * @param {Object} hass - Home Assistant объект
   * @param {Object} config - Конфигурация группировки
   */
  constructor(hass, config = {}) {
    this._hass = hass;
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._cache = null;
    this._cacheTimestamp = 0;
  }

  /**
   * Обновляет hass объект
   * @param {Object} hass 
   */
  set hass(hass) {
    this._hass = hass;
    this._invalidateCache();
  }

  /**
   * Устанавливает конфигурацию
   * @param {Object} config 
   */
  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    this._invalidateCache();
  }

  /**
   * Получает сгруппированные entity
   * @param {string[]} entityIds - Массив ID entity (опционально)
   * @returns {Object[]} Массив групп
   */
  getGroups(entityIds = null) {
    // Используем кэш если не устарел
    if (this._cache && Date.now() - this._cacheTimestamp < 1000) {
      return this._cache;
    }

    const entities = this._getFilteredEntities(entityIds);
    let groups;

    switch (this._config.strategy) {
      case GROUPING_STRATEGIES.DOMAIN:
        groups = this._groupByDomain(entities);
        break;
        
      case GROUPING_STRATEGIES.AREA:
        groups = this._groupByArea(entities);
        break;
        
      case GROUPING_STRATEGIES.DEVICE_CLASS:
        groups = this._groupByDeviceClass(entities);
        break;
        
      case GROUPING_STRATEGIES.DEVICE:
        groups = this._groupByDevice(entities);
        break;
        
      case GROUPING_STRATEGIES.FLOOR:
        groups = this._groupByFloor(entities);
        break;
        
      case GROUPING_STRATEGIES.LABEL:
        groups = this._groupByLabel(entities);
        break;
        
      case GROUPING_STRATEGIES.STATE:
        groups = this._groupByState(entities);
        break;
        
      case GROUPING_STRATEGIES.CUSTOM:
        groups = this._groupByCustomRules(entities);
        break;
        
      default:
        groups = this._groupByDomain(entities);
    }

    // Сортируем группы
    groups = this._sortGroups(groups);

    // Применяем лимит элементов
    if (this._config.max_items_per_group > 0) {
      groups = groups.map(group => ({
        ...group,
        entities: group.entities.slice(0, this._config.max_items_per_group),
        hasMore: group.entities.length > this._config.max_items_per_group
      }));
    }

    // Кэшируем
    this._cache = groups;
    this._cacheTimestamp = Date.now();

    return groups;
  }

  /**
   * Получает отфильтрованные entity
   * @param {string[]} entityIds 
   * @returns {Object[]}
   */
  _getFilteredEntities(entityIds) {
    const states = this._hass?.states || {};
    let entities;

    if (entityIds) {
      entities = entityIds
        .filter(id => states[id])
        .map(id => ({ entity_id: id, ...states[id] }));
    } else if (this._config.include_entities?.length > 0) {
      entities = this._config.include_entities
        .filter(id => states[id])
        .map(id => ({ entity_id: id, ...states[id] }));
    } else {
      entities = Object.entries(states).map(([id, state]) => ({
        entity_id: id,
        ...state
      }));
    }

    // Фильтруем по исключениям
    return entities.filter(entity => {
      const domain = entity.entity_id.split('.')[0];
      
      if (this._config.exclude_domains.includes(domain)) return false;
      if (this._config.exclude_entities.includes(entity.entity_id)) return false;
      
      return true;
    });
  }

  /**
   * Группирует по домену
   * @param {Object[]} entities 
   * @returns {Object[]}
   */
  _groupByDomain(entities) {
    const groups = new Map();

    for (const entity of entities) {
      const domain = entity.entity_id.split('.')[0];
      
      if (!groups.has(domain)) {
        groups.set(domain, {
          id: domain,
          name: DOMAIN_NAMES[domain] || this._capitalize(domain),
          icon: DOMAIN_ICONS[domain] || 'mdi:bookmark',
          entities: [],
          collapsed: this._config.collapsed_by_default
        });
      }
      
      groups.get(domain).entities.push(entity);
    }

    return Array.from(groups.values())
      .filter(g => this._config.show_empty_groups || g.entities.length > 0);
  }

  /**
   * Группирует по области
   * @param {Object[]} entities 
   * @returns {Object[]}
   */
  _groupByArea(entities) {
    const groups = new Map();
    const areas = this._hass?.areas || {};
    const entityRegistry = this._hass?.entities || {};
    const deviceRegistry = this._hass?.devices || {};

    // Группа для entity без области
    groups.set('_no_area', {
      id: '_no_area',
      name: 'Без области',
      icon: 'mdi:help-circle-outline',
      entities: [],
      collapsed: this._config.collapsed_by_default
    });

    for (const entity of entities) {
      let areaId = null;

      // Проверяем область entity напрямую
      const entityEntry = entityRegistry[entity.entity_id];
      if (entityEntry?.area_id) {
        areaId = entityEntry.area_id;
      } else if (entityEntry?.device_id) {
        // Проверяем область устройства
        const device = deviceRegistry[entityEntry.device_id];
        if (device?.area_id) {
          areaId = device.area_id;
        }
      }

      if (areaId && areas[areaId]) {
        if (!groups.has(areaId)) {
          groups.set(areaId, {
            id: areaId,
            name: areas[areaId].name,
            icon: areas[areaId].icon || 'mdi:home-floor-0',
            entities: [],
            collapsed: this._config.collapsed_by_default
          });
        }
        groups.get(areaId).entities.push(entity);
      } else {
        groups.get('_no_area').entities.push(entity);
      }
    }

    return Array.from(groups.values())
      .filter(g => this._config.show_empty_groups || g.entities.length > 0);
  }

  /**
   * Группирует по классу устройства
   * @param {Object[]} entities 
   * @returns {Object[]}
   */
  _groupByDeviceClass(entities) {
    const groups = new Map();

    for (const entity of entities) {
      const deviceClass = entity.attributes?.device_class || '_none';
      
      if (!groups.has(deviceClass)) {
        groups.set(deviceClass, {
          id: deviceClass,
          name: deviceClass === '_none' ? 'Без класса' : this._capitalize(deviceClass),
          icon: this._getDeviceClassIcon(deviceClass),
          entities: [],
          collapsed: this._config.collapsed_by_default
        });
      }
      
      groups.get(deviceClass).entities.push(entity);
    }

    return Array.from(groups.values())
      .filter(g => this._config.show_empty_groups || g.entities.length > 0);
  }

  /**
   * Группирует по устройству
   * @param {Object[]} entities 
   * @returns {Object[]}
   */
  _groupByDevice(entities) {
    const groups = new Map();
    const entityRegistry = this._hass?.entities || {};
    const deviceRegistry = this._hass?.devices || {};

    groups.set('_no_device', {
      id: '_no_device',
      name: 'Без устройства',
      icon: 'mdi:help-circle-outline',
      entities: [],
      collapsed: this._config.collapsed_by_default
    });

    for (const entity of entities) {
      const entityEntry = entityRegistry[entity.entity_id];
      const deviceId = entityEntry?.device_id;

      if (deviceId && deviceRegistry[deviceId]) {
        const device = deviceRegistry[deviceId];
        
        if (!groups.has(deviceId)) {
          groups.set(deviceId, {
            id: deviceId,
            name: device.name || device.name_by_user || deviceId,
            icon: 'mdi:devices',
            manufacturer: device.manufacturer,
            model: device.model,
            entities: [],
            collapsed: this._config.collapsed_by_default
          });
        }
        
        groups.get(deviceId).entities.push(entity);
      } else {
        groups.get('_no_device').entities.push(entity);
      }
    }

    return Array.from(groups.values())
      .filter(g => this._config.show_empty_groups || g.entities.length > 0);
  }

  /**
   * Группирует по этажу
   * @param {Object[]} entities 
   * @returns {Object[]}
   */
  _groupByFloor(entities) {
    const groups = new Map();
    const areas = this._hass?.areas || {};
    const floors = this._hass?.floors || {};
    const entityRegistry = this._hass?.entities || {};
    const deviceRegistry = this._hass?.devices || {};

    groups.set('_no_floor', {
      id: '_no_floor',
      name: 'Без этажа',
      icon: 'mdi:help-circle-outline',
      entities: [],
      collapsed: this._config.collapsed_by_default
    });

    for (const entity of entities) {
      let floorId = null;

      // Находим область entity
      const entityEntry = entityRegistry[entity.entity_id];
      let areaId = entityEntry?.area_id;
      
      if (!areaId && entityEntry?.device_id) {
        const device = deviceRegistry[entityEntry.device_id];
        areaId = device?.area_id;
      }

      // Находим этаж области
      if (areaId && areas[areaId]?.floor_id) {
        floorId = areas[areaId].floor_id;
      }

      if (floorId && floors[floorId]) {
        if (!groups.has(floorId)) {
          groups.set(floorId, {
            id: floorId,
            name: floors[floorId].name,
            icon: floors[floorId].icon || 'mdi:home-floor-0',
            level: floors[floorId].level,
            entities: [],
            collapsed: this._config.collapsed_by_default
          });
        }
        groups.get(floorId).entities.push(entity);
      } else {
        groups.get('_no_floor').entities.push(entity);
      }
    }

    return Array.from(groups.values())
      .filter(g => this._config.show_empty_groups || g.entities.length > 0);
  }

  /**
   * Группирует по метке
   * @param {Object[]} entities 
   * @returns {Object[]}
   */
  _groupByLabel(entities) {
    const groups = new Map();
    const labels = this._hass?.labels || {};
    const entityRegistry = this._hass?.entities || {};

    groups.set('_no_label', {
      id: '_no_label',
      name: 'Без метки',
      icon: 'mdi:label-off-outline',
      entities: [],
      collapsed: this._config.collapsed_by_default
    });

    for (const entity of entities) {
      const entityEntry = entityRegistry[entity.entity_id];
      const entityLabels = entityEntry?.labels || [];

      if (entityLabels.length === 0) {
        groups.get('_no_label').entities.push(entity);
      } else {
        for (const labelId of entityLabels) {
          if (!groups.has(labelId)) {
            const label = labels[labelId] || { name: labelId };
            groups.set(labelId, {
              id: labelId,
              name: label.name,
              icon: label.icon || 'mdi:label',
              color: label.color,
              entities: [],
              collapsed: this._config.collapsed_by_default
            });
          }
          groups.get(labelId).entities.push(entity);
        }
      }
    }

    return Array.from(groups.values())
      .filter(g => this._config.show_empty_groups || g.entities.length > 0);
  }

  /**
   * Группирует по состоянию
   * @param {Object[]} entities 
   * @returns {Object[]}
   */
  _groupByState(entities) {
    const groups = new Map();

    for (const entity of entities) {
      const state = entity.state;
      
      if (!groups.has(state)) {
        groups.set(state, {
          id: state,
          name: this._getStateName(state),
          icon: this._getStateIcon(state),
          entities: [],
          collapsed: this._config.collapsed_by_default
        });
      }
      
      groups.get(state).entities.push(entity);
    }

    return Array.from(groups.values())
      .filter(g => this._config.show_empty_groups || g.entities.length > 0);
  }

  /**
   * Группирует по кастомным правилам
   * @param {Object[]} entities 
   * @returns {Object[]}
   */
  _groupByCustomRules(entities) {
    const groups = new Map();
    const customGroups = this._config.custom_groups || {};

    // Создаём группы из конфигурации
    for (const [groupId, groupConfig] of Object.entries(customGroups)) {
      groups.set(groupId, {
        id: groupId,
        name: groupConfig.name || groupId,
        icon: groupConfig.icon || 'mdi:folder',
        entities: [],
        collapsed: groupConfig.collapsed != null ? groupConfig.collapsed : this._config.collapsed_by_default
      });
    }

    // Группа по умолчанию
    groups.set('_other', {
      id: '_other',
      name: 'Прочее',
      icon: 'mdi:dots-horizontal',
      entities: [],
      collapsed: this._config.collapsed_by_default
    });

    // Распределяем entity по группам
    for (const entity of entities) {
      let matched = false;

      for (const [groupId, groupConfig] of Object.entries(customGroups)) {
        if (this._matchesGroupRules(entity, groupConfig)) {
          groups.get(groupId).entities.push(entity);
          matched = true;
          break;
        }
      }

      if (!matched) {
        groups.get('_other').entities.push(entity);
      }
    }

    return Array.from(groups.values())
      .filter(g => this._config.show_empty_groups || g.entities.length > 0);
  }

  /**
   * Проверяет соответствие entity правилам группы
   * @param {Object} entity 
   * @param {Object} groupConfig 
   * @returns {boolean}
   */
  _matchesGroupRules(entity, groupConfig) {
    const rules = groupConfig.rules || {};

    // Проверка по entity_id (glob pattern)
    if (rules.entity_id) {
      const pattern = new RegExp(rules.entity_id.replace(/\*/g, '.*'));
      if (!pattern.test(entity.entity_id)) return false;
    }

    // Проверка по домену
    if (rules.domain) {
      const domain = entity.entity_id.split('.')[0];
      const domains = Array.isArray(rules.domain) ? rules.domain : [rules.domain];
      if (!domains.includes(domain)) return false;
    }

    // Проверка по состоянию
    if (rules.state) {
      const states = Array.isArray(rules.state) ? rules.state : [rules.state];
      if (!states.includes(entity.state)) return false;
    }

    // Проверка по атрибуту
    if (rules.attribute) {
      const { name, value, above, below } = rules.attribute;
      const attrValue = entity.attributes?.[name];

      if (value !== undefined && attrValue !== value) return false;
      if (above !== undefined && parseFloat(attrValue) <= above) return false;
      if (below !== undefined && parseFloat(attrValue) >= below) return false;
    }

    return true;
  }

  /**
   * Сортирует группы
   * @param {Object[]} groups 
   * @returns {Object[]}
   */
  _sortGroups(groups) {
    switch (this._config.sort) {
      case SORT_ORDER.ALPHABETICAL:
        return groups.sort((a, b) => a.name.localeCompare(b.name));
        
      case SORT_ORDER.COUNT_DESC:
        return groups.sort((a, b) => b.entities.length - a.entities.length);
        
      case SORT_ORDER.COUNT_ASC:
        return groups.sort((a, b) => a.entities.length - b.entities.length);
        
      case SORT_ORDER.PRIORITY:
        const priority = this._config.priority_order || [];
        return groups.sort((a, b) => {
          const aIdx = priority.indexOf(a.id);
          const bIdx = priority.indexOf(b.id);
          if (aIdx === -1 && bIdx === -1) return 0;
          if (aIdx === -1) return 1;
          if (bIdx === -1) return -1;
          return aIdx - bIdx;
        });
        
      default:
        return groups;
    }
  }

  /**
   * Инвалидирует кэш
   */
  _invalidateCache() {
    this._cache = null;
    this._cacheTimestamp = 0;
  }

  /**
   * Вспомогательные методы
   */

  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  }

  _getDeviceClassIcon(deviceClass) {
    const icons = {
      battery: 'mdi:battery',
      carbon_dioxide: 'mdi:molecule-co2',
      carbon_monoxide: 'mdi:molecule-co',
      connectivity: 'mdi:connection',
      current: 'mdi:current-ac',
      door: 'mdi:door',
      energy: 'mdi:lightning-bolt',
      gas: 'mdi:gas-cylinder',
      humidity: 'mdi:water-percent',
      illuminance: 'mdi:brightness-5',
      moisture: 'mdi:water',
      motion: 'mdi:motion-sensor',
      occupancy: 'mdi:home-account',
      power: 'mdi:flash',
      power_factor: 'mdi:angle-acute',
      pressure: 'mdi:gauge',
      problem: 'mdi:alert-circle',
      safety: 'mdi:shield-check',
      smoke: 'mdi:smoke-detector',
      sound: 'mdi:volume-high',
      temperature: 'mdi:thermometer',
      timestamp: 'mdi:clock',
      voltage: 'mdi:sine-wave',
      window: 'mdi:window-closed'
    };
    return icons[deviceClass] || 'mdi:bookmark';
  }

  _getStateName(state) {
    const names = {
      on: 'Включено',
      off: 'Выключено',
      home: 'Дома',
      not_home: 'Не дома',
      open: 'Открыто',
      closed: 'Закрыто',
      locked: 'Заблокировано',
      unlocked: 'Разблокировано',
      playing: 'Воспроизведение',
      paused: 'Пауза',
      idle: 'Ожидание',
      unavailable: 'Недоступно',
      unknown: 'Неизвестно'
    };
    return names[state] || this._capitalize(state);
  }

  _getStateIcon(state) {
    const icons = {
      on: 'mdi:check-circle',
      off: 'mdi:close-circle',
      home: 'mdi:home',
      not_home: 'mdi:home-export-outline',
      open: 'mdi:door-open',
      closed: 'mdi:door-closed',
      locked: 'mdi:lock',
      unlocked: 'mdi:lock-open',
      playing: 'mdi:play',
      paused: 'mdi:pause',
      idle: 'mdi:sleep',
      unavailable: 'mdi:alert',
      unknown: 'mdi:help-circle'
    };
    return icons[state] || 'mdi:circle';
  }
}

export default AutoGrouping;
