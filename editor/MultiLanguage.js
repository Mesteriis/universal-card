/**
 * Multi Language - поддержка мультиязычности
 * 
 * Система локализации для Universal Card.
 * 
 * @module editor/MultiLanguage
 */

/**
 * Поддерживаемые языки
 */
export const SUPPORTED_LANGUAGES = {
  EN: 'en',
  RU: 'ru',
  ES: 'es',
  DE: 'de',
  FR: 'fr',
  IT: 'it',
  PT: 'pt',
  ZH: 'zh',
  JA: 'ja',
  KO: 'ko'
};

/**
 * Переводы
 */
const TRANSLATIONS = {
  [SUPPORTED_LANGUAGES.EN]: {
    // General
    'card.title': 'Universal Card',
    'card.subtitle': 'Flexible card with multiple body modes',
    
    // Header
    'header.title': 'Title',
    'header.subtitle': 'Subtitle',
    'header.icon': 'Icon',
    'header.entity': 'Entity',
    
    // Body modes
    'body_mode.label': 'Body Mode',
    'body_mode.expand': 'Expand',
    'body_mode.modal': 'Modal',
    'body_mode.fullscreen': 'Fullscreen',
    'body_mode.tabs': 'Tabs',
    'body_mode.carousel': 'Carousel',
    'body_mode.subview': 'Subview',
    'body_mode.none': 'None (header only)',
    
    // Actions
    'action.tap': 'Tap Action',
    'action.hold': 'Hold Action',
    'action.double_tap': 'Double Tap Action',
    'action.none': 'No action',
    'action.more_info': 'More info',
    'action.toggle': 'Toggle',
    'action.call_service': 'Call service',
    'action.navigate': 'Navigate',
    'action.url': 'Open URL',
    
    // Grid
    'grid.columns': 'Columns',
    'grid.gap': 'Gap',
    
    // Features
    'features.lazy_load': 'Lazy loading',
    'features.collapsed': 'Start collapsed',
    'features.visibility': 'Visibility conditions',
    
    // Editor sections
    'section.header': 'Header',
    'section.body': 'Body',
    'section.cards': 'Cards',
    'section.style': 'Style',
    'section.actions': 'Actions',
    'section.advanced': 'Advanced',
    
    // Themes
    'theme.default': 'Default',
    'theme.glass': 'Glassmorphism',
    'theme.neumorphism': 'Neumorphism',
    'theme.neon': 'Neon',
    
    // Notifications
    'notification.saved': 'Configuration saved',
    'notification.error': 'Error saving configuration',
    'notification.locked': 'Card is locked',
    
    // Buttons
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.add_card': 'Add Card',
    'button.remove': 'Remove',
    'button.duplicate': 'Duplicate',
    'button.move_up': 'Move Up',
    'button.move_down': 'Move Down',
    
    // Validation
    'validation.required': 'This field is required',
    'validation.invalid_entity': 'Invalid entity format',
    'validation.invalid_icon': 'Invalid icon format',
    
    // Lock
    'lock.locked': 'Locked',
    'lock.unlock': 'Unlock',
    'lock.enter_password': 'Enter password',
    'lock.wrong_password': 'Wrong password',
    
    // Misc
    'misc.loading': 'Loading...',
    'misc.no_data': 'No data',
    'misc.unavailable': 'Unavailable'
  },

  [SUPPORTED_LANGUAGES.RU]: {
    // General
    'card.title': 'Universal Card',
    'card.subtitle': 'Гибкая карточка с разными режимами',
    
    // Header
    'header.title': 'Заголовок',
    'header.subtitle': 'Подзаголовок',
    'header.icon': 'Иконка',
    'header.entity': 'Сущность',
    
    // Body modes
    'body_mode.label': 'Режим тела',
    'body_mode.expand': 'Раскрытие',
    'body_mode.modal': 'Модальное окно',
    'body_mode.fullscreen': 'Полный экран',
    'body_mode.tabs': 'Вкладки',
    'body_mode.carousel': 'Карусель',
    'body_mode.subview': 'Подвью',
    'body_mode.none': 'Нет (только заголовок)',
    
    // Actions
    'action.tap': 'Действие по нажатию',
    'action.hold': 'Действие по удержанию',
    'action.double_tap': 'Действие по двойному нажатию',
    'action.none': 'Нет действия',
    'action.more_info': 'Информация',
    'action.toggle': 'Переключить',
    'action.call_service': 'Вызвать сервис',
    'action.navigate': 'Навигация',
    'action.url': 'Открыть URL',
    
    // Grid
    'grid.columns': 'Колонки',
    'grid.gap': 'Отступ',
    
    // Features
    'features.lazy_load': 'Ленивая загрузка',
    'features.collapsed': 'Свёрнуто по умолчанию',
    'features.visibility': 'Условия видимости',
    
    // Editor sections
    'section.header': 'Заголовок',
    'section.body': 'Тело',
    'section.cards': 'Карточки',
    'section.style': 'Стиль',
    'section.actions': 'Действия',
    'section.advanced': 'Дополнительно',
    
    // Themes
    'theme.default': 'По умолчанию',
    'theme.glass': 'Стекло',
    'theme.neumorphism': 'Неоморфизм',
    'theme.neon': 'Неон',
    
    // Notifications
    'notification.saved': 'Конфигурация сохранена',
    'notification.error': 'Ошибка сохранения',
    'notification.locked': 'Карточка заблокирована',
    
    // Buttons
    'button.save': 'Сохранить',
    'button.cancel': 'Отмена',
    'button.add_card': 'Добавить карточку',
    'button.remove': 'Удалить',
    'button.duplicate': 'Дублировать',
    'button.move_up': 'Вверх',
    'button.move_down': 'Вниз',
    
    // Validation
    'validation.required': 'Обязательное поле',
    'validation.invalid_entity': 'Неверный формат entity',
    'validation.invalid_icon': 'Неверный формат иконки',
    
    // Lock
    'lock.locked': 'Заблокировано',
    'lock.unlock': 'Разблокировать',
    'lock.enter_password': 'Введите пароль',
    'lock.wrong_password': 'Неверный пароль',
    
    // Misc
    'misc.loading': 'Загрузка...',
    'misc.no_data': 'Нет данных',
    'misc.unavailable': 'Недоступно'
  },

  [SUPPORTED_LANGUAGES.ES]: {
    'card.title': 'Universal Card',
    'card.subtitle': 'Tarjeta flexible con múltiples modos',
    'header.title': 'Título',
    'header.subtitle': 'Subtítulo',
    'header.icon': 'Icono',
    'header.entity': 'Entidad',
    'body_mode.label': 'Modo del cuerpo',
    'body_mode.expand': 'Expandir',
    'body_mode.modal': 'Modal',
    'body_mode.fullscreen': 'Pantalla completa',
    'body_mode.tabs': 'Pestañas',
    'body_mode.carousel': 'Carrusel',
    'body_mode.subview': 'Subvista',
    'body_mode.none': 'Ninguno',
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar',
    'button.add_card': 'Añadir tarjeta',
    'misc.loading': 'Cargando...',
    'misc.unavailable': 'No disponible'
  },

  [SUPPORTED_LANGUAGES.DE]: {
    'card.title': 'Universal Card',
    'card.subtitle': 'Flexible Karte mit mehreren Modi',
    'header.title': 'Titel',
    'header.subtitle': 'Untertitel',
    'header.icon': 'Symbol',
    'header.entity': 'Entität',
    'body_mode.label': 'Körpermodus',
    'body_mode.expand': 'Erweitern',
    'body_mode.modal': 'Modal',
    'body_mode.fullscreen': 'Vollbild',
    'body_mode.tabs': 'Tabs',
    'body_mode.carousel': 'Karussell',
    'button.save': 'Speichern',
    'button.cancel': 'Abbrechen',
    'button.add_card': 'Karte hinzufügen',
    'misc.loading': 'Laden...',
    'misc.unavailable': 'Nicht verfügbar'
  }
};

/**
 * Класс для работы с локализацией
 */
export class MultiLanguage {
  constructor() {
    this._currentLanguage = SUPPORTED_LANGUAGES.EN;
    this._customTranslations = {};
  }

  /**
   * Инициализирует язык из Home Assistant
   * @param {Object} hass 
   */
  initFromHass(hass) {
    if (hass?.language) {
      const lang = hass.language.split('-')[0].toLowerCase();
      if (TRANSLATIONS[lang]) {
        this._currentLanguage = lang;
      }
    }
  }

  /**
   * Устанавливает язык
   * @param {string} language 
   */
  setLanguage(language) {
    if (TRANSLATIONS[language] || this._customTranslations[language]) {
      this._currentLanguage = language;
    }
  }

  /**
   * Получает текущий язык
   * @returns {string}
   */
  getLanguage() {
    return this._currentLanguage;
  }

  /**
   * Получает перевод
   * @param {string} key - Ключ перевода
   * @param {Object} params - Параметры для подстановки
   * @returns {string}
   */
  t(key, params = {}) {
    // Сначала проверяем кастомные переводы
    let translation = this._customTranslations[this._currentLanguage]?.[key];
    
    // Затем встроенные
    if (!translation) {
      translation = TRANSLATIONS[this._currentLanguage]?.[key];
    }
    
    // Fallback на английский
    if (!translation) {
      translation = TRANSLATIONS[SUPPORTED_LANGUAGES.EN]?.[key];
    }
    
    // Если перевода нет - возвращаем ключ
    if (!translation) {
      return key;
    }

    // Подставляем параметры
    return translation.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  /**
   * Добавляет кастомные переводы
   * @param {string} language 
   * @param {Object} translations 
   */
  addTranslations(language, translations) {
    if (!this._customTranslations[language]) {
      this._customTranslations[language] = {};
    }
    Object.assign(this._customTranslations[language], translations);
  }

  /**
   * Получает все переводы для языка
   * @param {string} language 
   * @returns {Object}
   */
  getAllTranslations(language) {
    return {
      ...TRANSLATIONS[language],
      ...this._customTranslations[language]
    };
  }

  /**
   * Получает список поддерживаемых языков
   * @returns {Object[]}
   */
  getSupportedLanguages() {
    return [
      { code: SUPPORTED_LANGUAGES.EN, name: 'English' },
      { code: SUPPORTED_LANGUAGES.RU, name: 'Русский' },
      { code: SUPPORTED_LANGUAGES.ES, name: 'Español' },
      { code: SUPPORTED_LANGUAGES.DE, name: 'Deutsch' },
      { code: SUPPORTED_LANGUAGES.FR, name: 'Français' },
      { code: SUPPORTED_LANGUAGES.IT, name: 'Italiano' },
      { code: SUPPORTED_LANGUAGES.PT, name: 'Português' },
      { code: SUPPORTED_LANGUAGES.ZH, name: '中文' },
      { code: SUPPORTED_LANGUAGES.JA, name: '日本語' },
      { code: SUPPORTED_LANGUAGES.KO, name: '한국어' }
    ];
  }
}

// Синглтон экземпляр
let instance = null;

/**
 * Получает экземпляр MultiLanguage
 * @returns {MultiLanguage}
 */
export function getLanguageInstance() {
  if (!instance) {
    instance = new MultiLanguage();
  }
  return instance;
}

/**
 * Короткий алиас для перевода
 * @param {string} key 
 * @param {Object} params 
 * @returns {string}
 */
export function t(key, params = {}) {
  return getLanguageInstance().t(key, params);
}

export default MultiLanguage;
