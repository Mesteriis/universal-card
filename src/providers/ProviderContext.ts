/**
 * Provider Context
 *
 * Widget-facing runtime abstraction that normalizes entity access,
 * services, websocket events, HTTP requests, and notification streams.
 *
 * @module providers/ProviderContext
 */

export type HomeAssistantAttributeValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | unknown[];

export type HomeAssistantEntityAttributes = {
  friendly_name?: string;
  icon?: string;
  entity_picture?: string;
  url?: string;
  unit_of_measurement?: string;
  is_volume_muted?: boolean;
  media_title?: string;
  media_artist?: string;
  media_album_name?: string;
  app_name?: string;
  media_duration?: number;
  media_position?: number;
  volume_level?: number;
  source?: string;
  source_list?: string[];
  finishes_at?: string;
  remaining?: string;
  end_time?: string;
  [key: string]: HomeAssistantAttributeValue;
};

export type HomeAssistantEntityState = {
  entity_id?: string;
  state: string;
  attributes: HomeAssistantEntityAttributes;
  last_changed?: string;
  last_updated?: string;
  [key: string]: unknown;
};

export type HomeAssistantStateMap = Record<string, HomeAssistantEntityState>;

export type HomeAssistantUser = {
  id?: string;
  name?: string;
  is_admin?: boolean;
  is_owner?: boolean;
  [key: string]: unknown;
};

export type HomeAssistantServiceData = Record<string, unknown>;
export type HomeAssistantTarget = Record<string, unknown>;
export type HomeAssistantApiPayload = Record<string, unknown>;
export type HomeAssistantWebSocketMessage = { type?: string } & Record<string, unknown>;
export type HomeAssistantEventData = Record<string, unknown>;
export type HomeAssistantEvent = {
  event_type?: string;
  data?: HomeAssistantEventData;
  [key: string]: unknown;
};

export type HomeAssistantLike = {
  states?: HomeAssistantStateMap;
  user?: HomeAssistantUser;
  callService?: (
    domain: string,
    service: string,
    serviceData?: HomeAssistantServiceData,
    target?: HomeAssistantTarget
  ) => unknown;
  callApi?: (method: string, path: string, data?: HomeAssistantApiPayload) => unknown;
  callWS?: (message: HomeAssistantWebSocketMessage) => unknown;
  connection?: {
    subscribeEvents?: (
      callback: (event: HomeAssistantEvent) => void,
      eventType?: string
    ) => Promise<(() => void) | void> | (() => void) | void;
  };
} | null;

export type PersistentNotificationRecord = {
  notification_id?: string | number;
  id?: string | number;
  title?: string;
  message?: string;
  created_at?: string | number | Date;
  [key: string]: unknown;
};

export type ProviderNotification = {
  id: string;
  title: string;
  message: string;
  created_at: Date;
  source: string;
  dismissible: boolean;
  raw: PersistentNotificationRecord;
};

export type ProviderNotificationEvent = {
  reason: 'state_changed' | 'call_service' | 'persistent_notifications_updated';
  event: HomeAssistantEvent;
};

export type ProviderContextOptions = {
  fetcher?: typeof fetch;
};

export type EntityProvider = {
  getState(entityId: string): HomeAssistantEntityState | null;
  getStates(): HomeAssistantStateMap;
};

export type ServiceProvider = {
  call(
    domain: string,
    service: string,
    serviceData?: HomeAssistantServiceData,
    target?: HomeAssistantTarget
  ): Promise<unknown>;
};

export type ApiProvider = {
  call(method: string, path: string, data?: HomeAssistantApiPayload): Promise<unknown>;
};

export type WebSocketProvider = {
  call(message: HomeAssistantWebSocketMessage): Promise<unknown>;
  subscribe(
    callback: (event: HomeAssistantEvent) => void,
    eventType?: string
  ): Promise<() => void>;
};

export type HttpProvider = {
  request(url: string, init?: RequestInit): Promise<Response>;
};

export type NotificationProvider = {
  list(): Promise<ProviderNotification[]>;
  dismiss(notificationId: string): Promise<void>;
  subscribe(
    callback: (event: ProviderNotificationEvent) => void
  ): Promise<() => void>;
};

export type ProviderContext = {
  __universalCardProviderContext: true;
  setHass(hass: HomeAssistantLike): void;
  getHass(): HomeAssistantLike;
  entities: EntityProvider;
  services: ServiceProvider;
  api: ApiProvider;
  websocket: WebSocketProvider;
  http: HttpProvider;
  notifications: NotificationProvider;
};

export type ProviderSource = ProviderContext | HomeAssistantLike | undefined;

const NOOP_UNSUBSCRIBE = () => {};

function toError(message: string): Error {
  return new Error(`[ProviderContext] ${message}`);
}

function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function normalizeEntityState(entityId: string, value: unknown): HomeAssistantEntityState | null {
  if (!isRecord(value)) {
    return null;
  }

  const attributes = isRecord(value.attributes)
    ? (value.attributes as HomeAssistantEntityAttributes)
    : {};

  const state = typeof value.state === 'string' ? value.state : '';

  return {
    ...value,
    entity_id: typeof value.entity_id === 'string' ? value.entity_id : undefined,
    state,
    attributes
  };
}

function normalizeStatesMap(states: unknown): HomeAssistantStateMap {
  if (!isRecord(states)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(states)
      .map(([entityId, state]) => [entityId, normalizeEntityState(entityId, state)])
      .filter(([, state]) => state !== null)
  ) as HomeAssistantStateMap;
}

function normalizeDate(value: unknown): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return new Date();
}

function normalizePersistentNotification(notification: PersistentNotificationRecord): ProviderNotification {
  const id = notification.notification_id ?? notification.id ?? `notification-${Date.now()}`;

  return {
    id: String(id),
    title: typeof notification.title === 'string' ? notification.title : '',
    message: typeof notification.message === 'string' ? notification.message : '',
    created_at: normalizeDate(notification.created_at),
    source: 'persistent_notification',
    dismissible: true,
    raw: notification
  };
}

function isPersistentNotificationStateChange(event: HomeAssistantEvent): boolean {
  const entityId = event?.data?.entity_id;
  return typeof entityId === 'string' && entityId.startsWith('persistent_notification.');
}

function isPersistentNotificationServiceCall(event: HomeAssistantEvent): boolean {
  return event?.data?.domain === 'persistent_notification';
}

async function resolveUnsubscribe(
  callbackRegistration:
    | Promise<(() => void) | void>
    | (() => void)
    | void
): Promise<() => void> {
  const resolved = await callbackRegistration;
  return isFunction(resolved) ? resolved : NOOP_UNSUBSCRIBE;
}

function resolveFetch(fetcher?: typeof fetch): typeof fetch {
  if (isFunction(fetcher)) {
    return fetcher;
  }

  if (isFunction(globalThis.fetch)) {
    return globalThis.fetch.bind(globalThis);
  }

  throw toError('HTTP provider is unavailable because fetch is not defined.');
}

export function isProviderContext(value: unknown): value is ProviderContext {
  return Boolean(value)
    && typeof value === 'object'
    && (value as ProviderContext).__universalCardProviderContext === true;
}

export function createProviderContext(
  source?: ProviderSource,
  options: ProviderContextOptions = {}
): ProviderContext {
  if (isProviderContext(source)) {
    return source;
  }

  let hass: HomeAssistantLike = source ?? null;
  const fetcher = resolveFetch(options.fetcher);

  const requireHassMethod = <T extends 'callService' | 'callApi' | 'callWS'>(
    methodName: T
  ): NonNullable<NonNullable<HomeAssistantLike>[T]> => {
    const currentHass = hass;
    const method = currentHass?.[methodName];

    if (!isFunction(method)) {
      throw toError(`Home Assistant provider method "${String(methodName)}" is unavailable.`);
    }

    return method.bind(currentHass);
  };

  const websocket: WebSocketProvider = {
    async call(message) {
      const callWS = requireHassMethod('callWS');
      return callWS(message);
    },
    async subscribe(callback, eventType) {
      const subscribeEvents = hass?.connection?.subscribeEvents;
      if (!isFunction(subscribeEvents)) {
        return NOOP_UNSUBSCRIBE;
      }

      return resolveUnsubscribe(subscribeEvents.call(hass?.connection, callback, eventType));
    }
  };

  const context: ProviderContext = {
    __universalCardProviderContext: true,
    setHass(nextHass) {
      hass = nextHass ?? null;
    },
    getHass() {
      return hass;
    },
    entities: {
      getState(entityId) {
        if (!entityId) {
          return null;
        }

        const state = hass?.states?.[entityId];
        return normalizeEntityState(entityId, state);
      },
      getStates() {
        return normalizeStatesMap(hass?.states);
      }
    },
    services: {
      async call(domain, service, serviceData, target) {
        const callService = requireHassMethod('callService');
        return callService(domain, service, serviceData || {}, target);
      }
    },
    api: {
      async call(method, path, data) {
        const callApi = requireHassMethod('callApi');
        return callApi(method, path, data || {});
      }
    },
    websocket,
    http: {
      async request(url, init) {
        return fetcher(url, init);
      }
    },
    notifications: {
      async list() {
        const result = await websocket.call({ type: 'persistent_notification/get' });
        if (!isRecord(result)) {
          return [];
        }

        return Object.values(result)
          .filter(isRecord)
          .map((notification) => normalizePersistentNotification(notification));
      },
      async dismiss(notificationId) {
        await context.services.call('persistent_notification', 'dismiss', {
          notification_id: notificationId
        });
      },
      async subscribe(callback) {
        const unsubscriptions = await Promise.all([
          websocket.subscribe((event) => {
            if (isPersistentNotificationStateChange(event)) {
              callback({ reason: 'state_changed', event });
            }
          }, 'state_changed'),
          websocket.subscribe((event) => {
            if (isPersistentNotificationServiceCall(event)) {
              callback({ reason: 'call_service', event });
            }
          }, 'call_service'),
          websocket.subscribe((event) => {
            callback({ reason: 'persistent_notifications_updated', event });
          }, 'persistent_notifications_updated')
        ]);

        return () => {
          unsubscriptions.forEach((unsubscribe) => {
            try {
              unsubscribe();
            } catch (error) {
              console.warn('[ProviderContext] Failed to unsubscribe notification stream:', error);
            }
          });
        };
      }
    }
  };

  return context;
}

export function normalizeProviderContext(
  source?: ProviderSource,
  options: ProviderContextOptions = {}
): ProviderContext {
  return isProviderContext(source) ? source : createProviderContext(source, options);
}
