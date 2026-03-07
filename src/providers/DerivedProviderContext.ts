/**
 * Derived Provider Context
 *
 * Computed provider layer built on top of the base ProviderContext.
 * It keeps transport/runtime concerns in ProviderContext and concentrates
 * repeated entity-derived reads here.
 *
 * @module providers/DerivedProviderContext
 */

import {
  type HomeAssistantAttributeValue,
  type HomeAssistantEntityState,
  type ProviderContext,
  type ProviderSource,
  normalizeProviderContext
} from './ProviderContext.js';

export type DerivedEntityCountFilters = {
  attribute?: string;
  domain?: string;
  entities?: string[];
  predicate?: (state: HomeAssistantEntityState, entityId: string) => boolean;
  state?: unknown | unknown[];
  value?: unknown | unknown[];
};

export type DerivedEntityProvider = {
  count(filters?: DerivedEntityCountFilters): number;
  getFriendlyName(entityId: string, fallback?: string | null): string | null;
  getIcon(entityId: string, fallback?: string | null): string | null;
  getNumericValue(entityId: string, attribute?: string): number | null;
  getPicture(entityId: string): string | null;
  getValue<T = HomeAssistantAttributeValue | undefined>(
    entityId: string,
    attribute?: string,
    defaultValue?: T
  ): HomeAssistantAttributeValue | T;
  matches(entityId: string, expected: unknown | unknown[], attribute?: string): boolean;
};

export type DerivedProviderContext = ProviderContext & {
  __universalCardDerivedProviderContext: true;
  base: ProviderContext;
  derived: {
    entities: DerivedEntityProvider;
  };
};

function matchesExpected(value: unknown, expected: unknown | unknown[]): boolean {
  const expectedValues = Array.isArray(expected) ? expected : [expected];
  return expectedValues.includes(value);
}

function getAttributeValue(
  state: HomeAssistantEntityState | null,
  attribute?: string
): HomeAssistantAttributeValue {
  if (!attribute) {
    return state?.state;
  }

  return state?.attributes?.[attribute];
}

export function isDerivedProviderContext(value: unknown): value is DerivedProviderContext {
  return Boolean(value)
    && typeof value === 'object'
    && (value as DerivedProviderContext).__universalCardDerivedProviderContext === true;
}

export function createDerivedProviderContext(source?: ProviderSource): DerivedProviderContext {
  if (isDerivedProviderContext(source)) {
    return source;
  }

  const base = normalizeProviderContext(source);

  const derivedEntities: DerivedEntityProvider = {
    getValue(entityId, attribute, defaultValue = undefined) {
      if (!entityId) {
        return defaultValue;
      }

      const state = base.entities.getState(entityId);
      const value = getAttributeValue(state, attribute);
      return value === undefined ? defaultValue : value;
    },

    getNumericValue(entityId, attribute) {
      const rawValue = derivedEntities.getValue(entityId, attribute);
      const numericValue = Number.parseFloat(String(rawValue));
      return Number.isNaN(numericValue) ? null : numericValue;
    },

    getFriendlyName(entityId, fallback = null) {
      if (!entityId) {
        return fallback;
      }

      const state = base.entities.getState(entityId);
      return state?.attributes?.friendly_name ?? fallback;
    },

    getIcon(entityId, fallback = null) {
      if (!entityId) {
        return fallback;
      }

      const state = base.entities.getState(entityId);
      return state?.attributes?.icon ?? fallback;
    },

    getPicture(entityId) {
      if (!entityId) {
        return null;
      }

      const state = base.entities.getState(entityId);
      return state?.attributes?.entity_picture ?? state?.attributes?.url ?? null;
    },

    count(filters = {}) {
      const states = base.entities.getStates();
      const {
        attribute,
        domain,
        entities,
        predicate,
        state: stateFilter,
        value
      } = filters;

      let entityIds = Array.isArray(entities) && entities.length > 0
        ? entities.filter(Boolean)
        : Object.keys(states);

      if (domain) {
        entityIds = entityIds.filter((entityId) => entityId.startsWith(`${domain}.`));
      }

      return entityIds.filter((entityId) => {
        const state = states[entityId];
        if (!state) {
          return false;
        }

        if (stateFilter !== undefined && !matchesExpected(state.state, stateFilter)) {
          return false;
        }

        if (value !== undefined) {
          const currentValue = getAttributeValue(state, attribute);
          if (!matchesExpected(currentValue, value)) {
            return false;
          }
        }

        if (predicate && !predicate(state, entityId)) {
          return false;
        }

        return true;
      }).length;
    },

    matches(entityId, expected, attribute) {
      if (!entityId) {
        return false;
      }

      const currentValue = derivedEntities.getValue(entityId, attribute);
      return matchesExpected(currentValue, expected);
    }
  };

  return {
    __universalCardProviderContext: true,
    __universalCardDerivedProviderContext: true,
    base,
    setHass(nextHass) {
      base.setHass(nextHass);
    },
    getHass() {
      return base.getHass();
    },
    entities: base.entities,
    services: base.services,
    api: base.api,
    websocket: base.websocket,
    http: base.http,
    notifications: base.notifications,
    derived: {
      entities: derivedEntities
    }
  };
}

export function normalizeDerivedProviderContext(source?: ProviderSource): DerivedProviderContext {
  return isDerivedProviderContext(source) ? source : createDerivedProviderContext(source);
}
