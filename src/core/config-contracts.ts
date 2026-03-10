/**
 * Shared runtime config contracts used by the main card and UI components.
 *
 * These types intentionally model the normalized runtime surface consumed by
 * UniversalCard/Header/Footer instead of the full editor/schema universe.
 *
 * @module core/config-contracts
 */

import {
  BADGE_FORMATS,
  BADGE_OPERATORS,
  BADGE_TYPES,
  BODY_MODES,
  CARD_DIRECTIONS,
  CONDITION_TYPES,
  EXPAND_TRIGGERS,
  HEADER_BADGES_POSITIONS,
  HEADER_CONTENT_ALIGNMENTS,
  HEADER_LAYOUT_VARIANTS,
  MODAL_LOADING_STRATEGIES,
  POOL_SCOPES,
  SWIPE_ACTIONS,
  SWIPE_DIRECTIONS,
  TAB_ALIGNMENTS,
  WEEKDAYS
} from './constants.js';
import type { ActionConfig } from './action-hooks.js';
import type { ConfigStyleInput } from '../extensibility/CustomCSS.js';
import type { CardConfigLike } from '../utils/ha-helpers.js';

export type BodyMode = (typeof BODY_MODES)[keyof typeof BODY_MODES];
export type ExpandTrigger = (typeof EXPAND_TRIGGERS)[keyof typeof EXPAND_TRIGGERS];
export type PoolScope = (typeof POOL_SCOPES)[keyof typeof POOL_SCOPES];
export type CardsDirection = (typeof CARD_DIRECTIONS)[keyof typeof CARD_DIRECTIONS];
export type SwipeAxis = (typeof SWIPE_DIRECTIONS)[keyof typeof SWIPE_DIRECTIONS];
export type SwipeActionType = (typeof SWIPE_ACTIONS)[keyof typeof SWIPE_ACTIONS];
export type TabAlignment = (typeof TAB_ALIGNMENTS)[keyof typeof TAB_ALIGNMENTS];
export type HeaderLayoutVariant = (typeof HEADER_LAYOUT_VARIANTS)[keyof typeof HEADER_LAYOUT_VARIANTS];
export type HeaderContentAlignment = (typeof HEADER_CONTENT_ALIGNMENTS)[keyof typeof HEADER_CONTENT_ALIGNMENTS];
export type HeaderBadgesPosition = (typeof HEADER_BADGES_POSITIONS)[keyof typeof HEADER_BADGES_POSITIONS];
export type BadgeType = (typeof BADGE_TYPES)[keyof typeof BADGE_TYPES];
export type BadgeFormat = (typeof BADGE_FORMATS)[keyof typeof BADGE_FORMATS];
export type BadgeComparisonOperator = (typeof BADGE_OPERATORS)[keyof typeof BADGE_OPERATORS];
export type ModalLoadingStrategy = (typeof MODAL_LOADING_STRATEGIES)[keyof typeof MODAL_LOADING_STRATEGIES];
export type VisibilityConditionType = (typeof CONDITION_TYPES)[keyof typeof CONDITION_TYPES];
export type VisibilityWeekday = (typeof WEEKDAYS)[keyof typeof WEEKDAYS];

export interface CardLayoutOptions {
  colspan?: number;
  rowspan?: number;
}

export interface LayoutCardConfig extends CardConfigLike {
  colspan?: number;
  rowspan?: number;
  card_options?: CardLayoutOptions;
}

export interface CardSlotSection {
  cards?: LayoutCardConfig[];
}

export interface GridConfig {
  columns?: number | string;
  gap?: string;
}

export interface TabsUiConfig {
  position?: string;
  show_icons?: boolean;
  show_labels?: boolean;
  content_padding?: string;
  tab_min_width?: string;
  tab_alignment?: TabAlignment;
}

export interface FullscreenConfig {
  width?: string;
  height?: string;
  max_width?: string;
  max_height?: string;
  padding?: string;
  background?: string;
  show_close?: boolean;
  close_on_escape?: boolean;
}

export interface CarouselOptionsConfig {
  show_arrows?: boolean;
  show_indicators?: boolean;
  loop?: boolean;
  swipe_threshold?: number;
  height?: string;
}

export interface SubviewConfig {
  path?: string;
  navigation_path?: string;
  replace_state?: boolean;
  return_on_close?: boolean;
}

export interface HeaderLayoutConfig {
  variant?: HeaderLayoutVariant;
  gap?: string;
  content_gap?: string;
  align?: HeaderContentAlignment;
  badges_position?: HeaderBadgesPosition;
}

export interface TabConfig {
  label?: string;
  title?: string;
  icon?: string;
  cards?: LayoutCardConfig[];
  grid?: GridConfig;
}

export interface ModalConfig {
  width?: string;
  height?: string;
  max_width?: string;
  max_height?: string;
  loading_strategy?: ModalLoadingStrategy;
  backdrop_blur?: boolean;
  backdrop_color?: string;
  close_on_backdrop?: boolean;
  close_on_escape?: boolean;
  show_close?: boolean;
}

export interface BadgeThreshold {
  value: number;
  color: string;
}

export type BadgeRuleValue = string | number | boolean;

export interface BadgeConditionRule {
  operator: BadgeComparisonOperator;
  value: BadgeRuleValue;
  entity?: string;
  attribute?: string;
}

export interface BadgeColorRule extends BadgeConditionRule {
  color: string;
}

export interface HeaderBadgeConfig {
  type?: BadgeType;
  entity?: string;
  attribute?: string;
  icon?: string;
  color?: string;
  value?: string | number;
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  show_name?: boolean;
  show_progress?: boolean;
  precision?: number;
  format?: BadgeFormat;
  entities?: string[];
  domain?: string;
  state?: string;
  count_state?: string;
  thresholds?: BadgeThreshold[];
  visibility?: BadgeConditionRule[];
  color_rules?: BadgeColorRule[];
  icon_only?: boolean;
  tap_action?: ActionConfig;
  icon_tap_action?: ActionConfig;
}

export type ContextMenuHandlerContext = Record<string, unknown>;

export interface ContextMenuSeparatorItemConfig {
  type: 'separator';
}

export interface ContextMenuActionItemConfig {
  type?: 'item';
  label?: string;
  name?: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  submenu?: ContextMenuItemConfig[];
  action?: ActionConfig;
  callback?: (context?: ContextMenuHandlerContext) => unknown;
  event?: string;
}

export type ContextMenuConfigItem = ContextMenuSeparatorItemConfig | ContextMenuActionItemConfig;
export type ContextMenuItemConfig = ContextMenuConfigItem;

export interface ContextMenuConfig {
  items?: ContextMenuItemConfig[];
}

export interface HeaderConfig extends CardSlotSection {
  title?: string;
  subtitle?: string;
  icon?: string;
  entity?: string;
  show_state?: boolean;
  show_expand_icon?: boolean;
  expand_icon?: string;
  body_mode?: BodyMode;
  sticky_header?: boolean;
  sticky?: boolean;
  clickable?: boolean;
  layout?: HeaderLayoutConfig;
  expand_trigger?: ExpandTrigger;
  header_left?: CardSlotSection;
  header_right?: CardSlotSection;
  badges?: HeaderBadgeConfig[];
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  context_menu?: ContextMenuConfig;
}

export interface FooterActionConfig extends ActionConfig {
  icon?: string;
  label?: string;
}

export interface FooterConfig extends CardSlotSection {
  text?: string;
  icon?: string;
  sticky?: boolean;
  border_top?: boolean;
  footer_left?: CardSlotSection;
  footer_right?: CardSlotSection;
  actions?: FooterActionConfig[];
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
}

export interface SwipeGestureAction {
  action?: SwipeActionType;
}

export interface SwipeConfig {
  enabled?: boolean;
  direction?: SwipeAxis;
  threshold?: number;
  velocityThreshold?: number;
  preventScroll?: boolean;
  left?: SwipeGestureAction;
  right?: SwipeGestureAction;
  up?: SwipeGestureAction;
  down?: SwipeGestureAction;
}

interface VisibilityConditionBase {
  condition: VisibilityConditionType;
}

interface VisibilityEntityConditionBase extends VisibilityConditionBase {
  entity: string;
  conditions?: VisibilityCondition[];
  attribute?: string;
}

export interface StateVisibilityCondition extends VisibilityEntityConditionBase {
  condition: typeof CONDITION_TYPES.STATE;
  state?: string | string[];
  state_not?: string | string[];
}

export interface NumericStateVisibilityCondition extends VisibilityEntityConditionBase {
  condition: typeof CONDITION_TYPES.NUMERIC_STATE;
  above?: number;
  below?: number;
}

export interface UserVisibilityCondition extends VisibilityConditionBase {
  condition: typeof CONDITION_TYPES.USER;
  users?: string[];
  is_admin?: boolean;
  is_owner?: boolean;
}

export interface TimeVisibilityCondition extends VisibilityConditionBase {
  condition: typeof CONDITION_TYPES.TIME;
  after?: string;
  before?: string;
  weekday?: VisibilityWeekday[];
}

export interface ScreenVisibilityCondition extends VisibilityConditionBase {
  condition: typeof CONDITION_TYPES.SCREEN;
  media_query?: string;
  min_width?: number;
  max_width?: number;
}

export interface LogicalVisibilityCondition extends VisibilityConditionBase {
  condition:
    | typeof CONDITION_TYPES.AND
    | typeof CONDITION_TYPES.OR
    | typeof CONDITION_TYPES.NOT;
  conditions?: VisibilityCondition[];
}

export type VisibilityCondition =
  | StateVisibilityCondition
  | NumericStateVisibilityCondition
  | UserVisibilityCondition
  | TimeVisibilityCondition
  | ScreenVisibilityCondition
  | LogicalVisibilityCondition;

export interface SectionVisibilityConfig {
  header?: VisibilityCondition[];
  body?: VisibilityCondition[];
  footer?: VisibilityCondition[];
}

export type StateStyleClassValue = string | string[];
export type StateStyleValue = string | number;
export interface StateStyleRule {
  class?: StateStyleClassValue;
  background?: StateStyleValue;
  bg?: StateStyleValue;
  color?: StateStyleValue;
  text_color?: StateStyleValue;
  border?: StateStyleValue;
  border_color?: StateStyleValue;
  border_width?: StateStyleValue;
  border_radius?: StateStyleValue;
  shadow?: StateStyleValue;
  box_shadow?: StateStyleValue;
  opacity?: StateStyleValue;
  transform?: StateStyleValue;
  filter?: StateStyleValue;
  [styleProperty: string]: StateStyleValue | StateStyleClassValue | undefined;
}

export type StateStyleMap = Record<string, StateStyleRule>;
export type ThemeTokenMap = Record<`--${string}`, string>;

export interface UniversalCardConfig {
  card_id?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  icon_color?: string;
  entity?: string;
  attribute?: string;
  theme?: string;
  border_radius?: string;
  padding?: string;
  expanded?: boolean;
  body_mode?: BodyMode;
  expand_trigger?: ExpandTrigger;
  show_state?: boolean;
  show_expand_icon?: boolean;
  expand_icon?: string;
  sticky_header?: boolean;
  remember_expanded_state?: boolean;
  remember_mode_state?: boolean;
  enable_card_pool?: boolean;
  pool_scope?: PoolScope;
  pool_ttl_ms?: number;
  pool_max_entries?: number;
  skeleton_count?: number;
  lazy_load?: boolean;
  lazy_initial_batch?: number;
  lazy_batch_size?: number;
  lazy_idle_timeout?: number;
  animation_duration?: number;
  expand_animation?: string;
  collapse_animation?: string;
  cards_animation?: string;
  cards_direction?: CardsDirection;
  cards_stagger?: number;
  auto_collapse_after?: number;
  carousel_autoplay?: boolean;
  carousel_interval?: number;
  stability_mode?: boolean;
  header?: Partial<HeaderConfig>;
  header_left?: CardSlotSection;
  header_right?: CardSlotSection;
  body?: CardSlotSection;
  footer?: FooterConfig;
  grid?: GridConfig;
  modal?: ModalConfig;
  tabs?: TabConfig[];
  tabs_config?: TabsUiConfig;
  fullscreen?: FullscreenConfig;
  carousel_options?: CarouselOptionsConfig;
  subview?: SubviewConfig;
  badges?: HeaderBadgeConfig[];
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  context_menu?: ContextMenuConfig;
  visibility?: VisibilityCondition[];
  section_visibility?: SectionVisibilityConfig;
  state_styles?: StateStyleMap;
  swipe?: SwipeConfig;
  theme_tokens?: ThemeTokenMap;
  custom_css?: ConfigStyleInput;
}
