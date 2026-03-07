import { describe, expect, it } from 'vitest';

import {
  createDerivedProviderContext,
  isDerivedProviderContext,
  normalizeDerivedProviderContext
} from '../src/providers/DerivedProviderContext.js';
import {
  isProviderContext,
  normalizeProviderContext
} from '../src/providers/ProviderContext.js';

describe('DerivedProviderContext', () => {
  it('derives entity values, metadata, and picture helpers from provider state', () => {
    const providers = createDerivedProviderContext({
      states: {
        'sensor.office_temperature': {
          state: '23.5',
          attributes: {
            friendly_name: 'Office Temperature',
            unit_of_measurement: 'C'
          }
        },
        'light.office': {
          state: 'on',
          attributes: {
            icon: 'mdi:ceiling-light'
          }
        },
        'person.alex': {
          state: 'home',
          attributes: {
            entity_picture: '/local/alex.png'
          }
        }
      }
    });

    expect(isDerivedProviderContext(providers)).toBe(true);
    expect(isProviderContext(providers)).toBe(true);
    expect(normalizeProviderContext(providers)).toBe(providers);
    expect(providers.derived.entities.getValue('sensor.office_temperature')).toBe('23.5');
    expect(providers.derived.entities.getValue('sensor.office_temperature', 'unit_of_measurement')).toBe('C');
    expect(providers.derived.entities.getNumericValue('sensor.office_temperature')).toBe(23.5);
    expect(providers.derived.entities.getFriendlyName('sensor.office_temperature')).toBe('Office Temperature');
    expect(providers.derived.entities.getIcon('light.office', 'mdi:lightbulb-outline')).toBe('mdi:ceiling-light');
    expect(providers.derived.entities.getPicture('person.alex')).toBe('/local/alex.png');
    expect(providers.derived.entities.matches('light.office', 'on')).toBe(true);
  });

  it('counts entities across domain, explicit entity lists, and attribute/value filters', () => {
    const providers = createDerivedProviderContext({
      states: {
        'light.kitchen': {
          state: 'on',
          attributes: {
            area: 'kitchen'
          }
        },
        'light.office': {
          state: 'off',
          attributes: {
            area: 'office'
          }
        },
        'light.hallway': {
          state: 'on',
          attributes: {
            area: 'hallway'
          }
        },
        'switch.fan': {
          state: 'on',
          attributes: {
            area: 'office'
          }
        }
      }
    });

    expect(providers.derived.entities.count({ domain: 'light', state: 'on' })).toBe(2);
    expect(providers.derived.entities.count({
      entities: ['light.kitchen', 'light.office', 'switch.fan'],
      state: ['on', 'off']
    })).toBe(3);
    expect(providers.derived.entities.count({
      attribute: 'area',
      value: 'office',
      predicate: (state) => state.state === 'on'
    })).toBe(1);
  });

  it('normalizes existing providers and stays live when hass is replaced', () => {
    const providers = normalizeDerivedProviderContext({
      states: {
        'sensor.load': {
          state: '10',
          attributes: {}
        }
      }
    });

    expect(providers.derived.entities.getValue('sensor.load')).toBe('10');

    providers.setHass({
      states: {
        'sensor.load': {
          state: '14',
          attributes: {}
        }
      }
    });

    expect(providers.derived.entities.getValue('sensor.load')).toBe('14');
    expect(normalizeDerivedProviderContext(providers)).toBe(providers);
  });
});
