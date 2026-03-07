// @ts-check
/**
 * Universal Card - Configuration Migrations
 *
 * Versioned migration pipeline for evolving the config contract without
 * scattering legacy shims across validation and normalization.
 *
 * @module core/config-migrations
 */

import { deepClone, isObject } from '../utils/helpers.js';

export const LEGACY_CONFIG_VERSION = 1;
export const CURRENT_CONFIG_VERSION = 2;

export type MigrationChange = {
  path: string;
  message: string;
};

export type ConfigMigrationResult = {
  config: Record<string, any>;
  fromVersion: number;
  toVersion: number;
  changed: boolean;
  explicitVersion: boolean;
  changes: MigrationChange[];
};

function toSectionCards(value: unknown): Record<string, any> | null {
  if (Array.isArray(value)) {
    return { cards: value };
  }

  if (isObject(value)) {
    const sectionValue = value as Record<string, any>;

    if (Array.isArray(sectionValue.cards)) {
      return { ...sectionValue, cards: sectionValue.cards };
    }
    return { ...sectionValue };
  }

  return null;
}

function addChange(changes: MigrationChange[], path: string, message: string) {
  changes.push({ path, message });
}

function migrateV1ToV2(config: Record<string, any>, changes: MigrationChange[]) {
  if (config.cards !== undefined) {
    if (!isObject(config.body)) {
      config.body = {};
    }

    if (config.body.cards === undefined) {
      config.body.cards = Array.isArray(config.cards) ? [...config.cards] : config.cards;
      addChange(changes, 'cards', 'Moved legacy root cards to body.cards.');
    } else {
      addChange(changes, 'cards', 'Dropped legacy root cards because body.cards already exists.');
    }

    delete config.cards;
  }

  if (config.remember_state !== undefined) {
    if (config.remember_expanded_state === undefined) {
      config.remember_expanded_state = config.remember_state;
      addChange(changes, 'remember_state', 'Renamed remember_state to remember_expanded_state.');
    } else {
      addChange(changes, 'remember_state', 'Removed remember_state because remember_expanded_state already exists.');
    }

    delete config.remember_state;
  }

  if (config.state_styles_entity !== undefined) {
    if (config.entity === undefined) {
      config.entity = config.state_styles_entity;
      addChange(changes, 'state_styles_entity', 'Promoted state_styles_entity to root entity.');
    } else {
      addChange(changes, 'state_styles_entity', 'Removed state_styles_entity because root entity already exists.');
    }

    delete config.state_styles_entity;
  }

  if (config.debug !== undefined) {
    delete config.debug;
    addChange(changes, 'debug', 'Removed deprecated debug config field.');
  }

  if (isObject(config.header)) {
    const { header } = config;

    if (header.left !== undefined) {
      if (config.header_left === undefined) {
        const migratedLeft = toSectionCards(header.left);
        if (migratedLeft) {
          config.header_left = migratedLeft;
          addChange(changes, 'header.left', 'Moved legacy header.left to root header_left.');
        }
      } else {
        addChange(changes, 'header.left', 'Dropped legacy header.left because header_left already exists.');
      }

      delete header.left;
    }

    if (header.right !== undefined) {
      if (config.header_right === undefined) {
        const migratedRight = toSectionCards(header.right);
        if (migratedRight) {
          config.header_right = migratedRight;
          addChange(changes, 'header.right', 'Moved legacy header.right to root header_right.');
        }
      } else {
        addChange(changes, 'header.right', 'Dropped legacy header.right because header_right already exists.');
      }

      delete header.right;
    }

    if (Object.keys(header).length === 0) {
      delete config.header;
    }
  }

  if (isObject(config.carousel)) {
    const { carousel } = config;

    if (config.carousel_autoplay === undefined && typeof carousel.autoplay === 'boolean') {
      config.carousel_autoplay = carousel.autoplay;
      addChange(changes, 'carousel.autoplay', 'Moved carousel.autoplay to root carousel_autoplay.');
    }

    if (config.carousel_interval === undefined && typeof carousel.interval === 'number') {
      config.carousel_interval = carousel.interval;
      addChange(changes, 'carousel.interval', 'Moved carousel.interval to root carousel_interval.');
    }

    ['show_indicators', 'show_arrows', 'loop'].forEach((field) => {
      if (carousel[field] !== undefined) {
        addChange(changes, `carousel.${field}`, `Removed legacy carousel.${field}; this option is no longer configurable.`);
      }
    });

    delete config.carousel;
  }

  if (isObject(config.swipe)) {
    const swipeKeyMap = {
      swipe_left: 'left',
      swipe_right: 'right',
      swipe_up: 'up',
      swipe_down: 'down'
    } as const;

    Object.entries(swipeKeyMap).forEach(([legacyKey, nextKey]) => {
      if (config.swipe[legacyKey] === undefined) {
        return;
      }

      if (config.swipe[nextKey] === undefined) {
        config.swipe[nextKey] = config.swipe[legacyKey];
        addChange(changes, `swipe.${legacyKey}`, `Renamed swipe.${legacyKey} to swipe.${nextKey}.`);
      } else {
        addChange(changes, `swipe.${legacyKey}`, `Removed swipe.${legacyKey} because swipe.${nextKey} already exists.`);
      }

      delete config.swipe[legacyKey];
    });
  }

  if (Array.isArray(config.badges)) {
    config.badges = config.badges.map((badge, index) => {
      if (!isObject(badge) || badge.text === undefined) {
        return badge;
      }

      const migratedBadge = { ...badge };
      if (migratedBadge.value === undefined) {
        migratedBadge.value = migratedBadge.text;
        addChange(changes, `badges[${index}].text`, 'Moved badges[].text to badges[].value.');
      } else if (migratedBadge.label === undefined) {
        migratedBadge.label = migratedBadge.text;
        addChange(changes, `badges[${index}].text`, 'Moved badges[].text to badges[].label because value already exists.');
      } else {
        addChange(changes, `badges[${index}].text`, 'Removed badges[].text because value/label already exist.');
      }

      delete migratedBadge.text;
      return migratedBadge;
    });
  }
}

export function detectConfigVersion(config: Record<string, any>) {
  if (Number.isInteger(config.config_version) && config.config_version > 0) {
    return config.config_version;
  }

  return LEGACY_CONFIG_VERSION;
}

export function migrateConfig(config: Record<string, any>): ConfigMigrationResult {
  const explicitVersion = Number.isInteger(config.config_version) && config.config_version > 0;
  const fromVersion = detectConfigVersion(config);
  const migrated = deepClone(config);
  const changes: MigrationChange[] = [];

  if (fromVersion < 2) {
    migrateV1ToV2(migrated, changes);
  }

  migrated.config_version = CURRENT_CONFIG_VERSION;

  return {
    config: migrated,
    fromVersion,
    toVersion: CURRENT_CONFIG_VERSION,
    changed: explicitVersion ? fromVersion !== CURRENT_CONFIG_VERSION || changes.length > 0 : changes.length > 0,
    explicitVersion,
    changes
  };
}
