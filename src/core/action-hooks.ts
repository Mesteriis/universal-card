import { ACTION_TYPES } from './constants.js';
import { PLUGIN_HOOKS, type PluginContext, type PluginPayload } from '../extensibility/PluginSystem.js';

export type ActionConfig = PluginPayload & {
  action?: string;
  target?: string | Record<string, unknown>;
  entity?: string;
  service?: string;
  service_data?: Record<string, unknown>;
  custom_action?: string;
  navigation_path?: string;
  url_path?: string;
  url_target?: string;
};

export type HookExecutor =
  ((hookName: string, data?: PluginPayload, context?: PluginContext) => PluginPayload) | undefined;

export type ActionTriggerMeta = PluginPayload & {
  source?: string | null;
  event?: Event | null;
  interaction?: string | null;
  implicit?: boolean;
};

type ActionHookResult = PluginPayload & {
  action?: ActionConfig;
  stop?: boolean;
  preventDefault?: boolean;
  handled?: boolean;
};

export type ExecuteActionOptions = {
  actionKey?: string | null;
  event?: Event | null;
  executePluginHookSync?: HookExecutor;
  interaction?: string | null;
  meta?: PluginPayload | null;
  section?: string | null;
  source?: string | null;
};

type InteractionHookOptions = {
  actionConfig?: ActionConfig | null;
  actionKey: string;
  element?: HTMLElement | null;
  event?: Event | null;
  executePluginHookSync?: HookExecutor;
  extra?: PluginPayload;
  hookName: string;
  interaction?: string | null;
  source: string;
};

type CardActionBridgeOptions = {
  actionConfig: ActionConfig;
  actionKey: string;
  dispatchCardAction: (actionType: string) => void;
  element?: HTMLElement | null;
  executeAction: (actionConfig: ActionConfig, options: ExecuteActionOptions) => void;
  executePluginHookSync?: HookExecutor;
  isCardAction: (actionConfig: ActionConfig) => boolean;
  section: string;
  triggerMeta?: ActionTriggerMeta & {
    meta?: PluginPayload | null;
  };
};

function isActionConfig(value: unknown): value is ActionConfig {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function shouldStopPluginResult(result: ActionHookResult | null | undefined): boolean {
  return result?.stop === true || result?.preventDefault === true || result?.handled === true;
}

export function buildActionExecutionOptions(options: ExecuteActionOptions = {}): ExecuteActionOptions {
  return {
    actionKey: options.actionKey || null,
    event: options.event || null,
    executePluginHookSync: options.executePluginHookSync,
    interaction: options.interaction || null,
    meta: options.meta || null,
    section: options.section || null,
    source: options.source || null
  };
}

export function runActionPluginHook(
  element: HTMLElement | null,
  actionConfig: ActionConfig,
  options: ExecuteActionOptions = {}
) {
  if (typeof options.executePluginHookSync !== 'function') {
    return {
      action: actionConfig,
      result: null,
      stopped: false
    };
  }

  const result = (options.executePluginHookSync(
    PLUGIN_HOOKS.ACTION_EXECUTE,
    {
      action: actionConfig,
      actionKey: options.actionKey || null,
      element,
      event: options.event || null,
      interaction: options.interaction || null,
      meta: options.meta || null,
      section: options.section || null,
      source: options.source || null
    },
    {
      actionKey: options.actionKey || null,
      interaction: options.interaction || null,
      phase: 'action',
      section: options.section || null,
      source: options.source || null
    }
  ) || {}) as ActionHookResult;

  return {
    action: isActionConfig(result.action) ? result.action : actionConfig,
    result,
    stopped: shouldStopPluginResult(result)
  };
}

export function runInteractionHook(options: InteractionHookOptions) {
  const payload: PluginPayload = {
    action: options.actionConfig || null,
    actionKey: options.actionKey,
    element: options.element || null,
    event: options.event || null,
    interaction: options.interaction || null,
    source: options.source,
    ...(options.extra || {})
  };

  if (typeof options.executePluginHookSync !== 'function') {
    return payload;
  }

  return options.executePluginHookSync(
    options.hookName,
    payload,
    {
      actionKey: options.actionKey,
      interaction: options.interaction || null,
      phase: 'interaction',
      source: options.source
    }
  ) || payload;
}

export function isHeaderCardAction(actionConfig: ActionConfig | null | undefined): boolean {
  const actionType = actionConfig?.action;
  return Boolean(
    actionConfig &&
    (
      actionType === ACTION_TYPES.TOGGLE ||
      actionType === ACTION_TYPES.EXPAND ||
      actionType === ACTION_TYPES.COLLAPSE
    ) &&
    (actionConfig.target === undefined || actionConfig.target === 'card')
  );
}

export function isFooterCardAction(actionConfig: ActionConfig | null | undefined): boolean {
  return Boolean(
    actionConfig &&
    (
      actionConfig.target === 'card' ||
      actionConfig.action === ACTION_TYPES.EXPAND ||
      actionConfig.action === ACTION_TYPES.COLLAPSE
    )
  );
}

export function executeCardActionWithPluginBridge(options: CardActionBridgeOptions): void {
  const triggerMeta = options.triggerMeta || {};
  const hookResult: ActionHookResult = options.executePluginHookSync
    ? options.executePluginHookSync(
      PLUGIN_HOOKS.ACTION_EXECUTE,
      {
        action: options.actionConfig,
        actionKey: options.actionKey,
        element: options.element || null,
        event: triggerMeta.event || null,
        implicit: triggerMeta.implicit === true,
        interaction: triggerMeta.interaction || null,
        meta: triggerMeta.meta || null,
        source: triggerMeta.source || options.section
      },
      {
        actionKey: options.actionKey,
        interaction: triggerMeta.interaction || null,
        phase: 'action',
        source: triggerMeta.source || options.section
      }
    ) || {}
    : { action: options.actionConfig };

  if (shouldStopPluginResult(hookResult)) {
    return;
  }

  const resolvedAction = isActionConfig(hookResult.action)
    ? hookResult.action
    : options.actionConfig;

  if (!resolvedAction || resolvedAction.action === ACTION_TYPES.NONE) {
    return;
  }

  if (!options.isCardAction(resolvedAction)) {
    options.executeAction(
      resolvedAction,
      buildActionExecutionOptions({
        actionKey: options.actionKey,
        event: triggerMeta.event || null,
        executePluginHookSync: options.executePluginHookSync,
        interaction: triggerMeta.interaction || null,
        meta: triggerMeta.meta || null,
        section: options.section,
        source: triggerMeta.source || options.section
      })
    );
    return;
  }

  if (resolvedAction.action === ACTION_TYPES.EXPAND) {
    options.dispatchCardAction(ACTION_TYPES.EXPAND);
    return;
  }

  if (resolvedAction.action === ACTION_TYPES.COLLAPSE) {
    options.dispatchCardAction(ACTION_TYPES.COLLAPSE);
    return;
  }

  options.dispatchCardAction(ACTION_TYPES.TOGGLE);
}
