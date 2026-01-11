"""
Universal Card - Advanced Lovelace card for Home Assistant.

This custom component provides a highly customizable card with:
- 7 body modes (expand, modal, fullscreen, tabs, carousel, subview, none)
- CSS Grid layout with colspan/rowspan
- Lazy loading with skeleton placeholders
- Visibility conditions
- Context menu & Radial menu
- Plugin system and much more

GitHub: https://github.com/Mesteriis/universal-card
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import Final

from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig

_LOGGER = logging.getLogger(__name__)

DOMAIN: Final = "universal_card"
VERSION: Final = "1.0.0"

# Пути к статическим файлам
URL_BASE: Final = "/universal_card_static"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Universal Card component."""
    
    # Путь к JS файлам компонента
    component_path = Path(__file__).parent
    
    # Регистрируем статический путь для JS файлов
    hass.http.register_static_path(
        URL_BASE,
        str(component_path),
        cache_headers=False  # Отключаем кеш для разработки
    )
    
    # Добавляем JS ресурс в frontend
    add_extra_js_url(hass, f"{URL_BASE}/universal-card.js?v={VERSION}")
    
    _LOGGER.info(
        "Universal Card v%s loaded. Resource: %s/universal-card.js",
        VERSION,
        URL_BASE
    )
    
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Universal Card from a config entry."""
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return True
