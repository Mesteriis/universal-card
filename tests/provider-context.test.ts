import { describe, expect, it, vi } from 'vitest';

import {
  createProviderContext,
  isProviderContext,
  normalizeProviderContext
} from '../src/providers/ProviderContext.js';

describe('ProviderContext', () => {
  it('adapts raw hass into entity, service, websocket, and http providers', async () => {
    const callService = vi.fn(async () => ({ ok: true }));
    const callApi = vi.fn(async () => ({ posted: true }));
    const callWS = vi.fn(async () => ({ ok: true }));
    const fetcher = vi.fn(async () => ({ ok: true } as Response));
    const hass = {
      states: {
        'sensor.office': { state: '23', attributes: { unit_of_measurement: 'C' } }
      },
      callService,
      callApi,
      callWS
    };

    const providers = createProviderContext(hass, { fetcher });

    expect(isProviderContext(providers)).toBe(true);
    expect(providers.entities.getState('sensor.office')?.state).toBe('23');
    expect(providers.entities.getStates()).toEqual(hass.states);

    await providers.services.call('light', 'toggle', { entity_id: 'light.office' });
    await providers.api.call('POST', 'events/demo', { value: 1 });
    await providers.websocket.call({ type: 'ping' });
    await providers.http.request('https://example.test/data', { method: 'GET' });

    expect(callService).toHaveBeenCalledWith('light', 'toggle', { entity_id: 'light.office' }, undefined);
    expect(callApi).toHaveBeenCalledWith('POST', 'events/demo', { value: 1 });
    expect(callWS).toHaveBeenCalledWith({ type: 'ping' });
    expect(fetcher).toHaveBeenCalledWith('https://example.test/data', { method: 'GET' });
  });

  it('normalizes persistent notifications from websocket payload', async () => {
    const hass = {
      callWS: vi.fn(async () => ({
        first: {
          notification_id: 'abc',
          title: 'Warning',
          message: 'Battery low',
          created_at: '2026-03-07T10:00:00.000Z'
        }
      }))
    };

    const providers = createProviderContext(hass);
    const notifications = await providers.notifications.list();

    expect(notifications).toHaveLength(1);
    expect(notifications[0]).toMatchObject({
      id: 'abc',
      title: 'Warning',
      message: 'Battery low',
      source: 'persistent_notification',
      dismissible: true
    });
    expect(notifications[0].created_at).toBeInstanceOf(Date);
  });

  it('subscribes to persistent-notification related events only', async () => {
    const subscribers = new Map<string, (event: any) => void>();
    const subscribeEvents = vi.fn(async (callback: (event: any) => void, eventType?: string) => {
      subscribers.set(String(eventType), callback);
      return () => {
        subscribers.delete(String(eventType));
      };
    });

    const providers = createProviderContext({
      connection: {
        subscribeEvents
      }
    });

    const callback = vi.fn();
    const unsubscribe = await providers.notifications.subscribe(callback);

    subscribers.get('state_changed')?.({
      data: {
        entity_id: 'sensor.outdoor'
      }
    });
    subscribers.get('state_changed')?.({
      data: {
        entity_id: 'persistent_notification.router_alert'
      }
    });
    subscribers.get('call_service')?.({
      data: {
        domain: 'light'
      }
    });
    subscribers.get('call_service')?.({
      data: {
        domain: 'persistent_notification'
      }
    });
    subscribers.get('persistent_notifications_updated')?.({ data: {} });

    expect(subscribeEvents).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, expect.objectContaining({ reason: 'state_changed' }));
    expect(callback).toHaveBeenNthCalledWith(2, expect.objectContaining({ reason: 'call_service' }));
    expect(callback).toHaveBeenNthCalledWith(3, expect.objectContaining({ reason: 'persistent_notifications_updated' }));

    unsubscribe();
    expect(subscribers.size).toBe(0);
  });

  it('returns existing provider contexts unchanged', () => {
    const providers = createProviderContext();
    expect(normalizeProviderContext(providers)).toBe(providers);
  });
});
