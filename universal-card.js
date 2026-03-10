/**
 * Universal Card v1.0.4
 * @license MIT
 * Built: 2026-03-10T12:46:54.559Z
 */
"use strict";(()=>{var kt=!1;function it(r){kt=r}function p(...r){kt&&console.log(...r)}function Mt(r="uc"){let e=Math.random().toString(36).substring(2,10);return`${r}-${e}`}function f(r){return r!==null&&typeof r=="object"&&!Array.isArray(r)}function M(r){return typeof r=="string"&&r.trim().length>0}function v(r){return typeof r=="number"&&!Number.isNaN(r)}function j(r){if(r===null||typeof r!="object")return r;if(Array.isArray(r))return r.map(t=>j(t));let e={};return Object.keys(r).forEach(t=>{e[t]=j(r[t])}),e}function L(r,e,t={},n={}){let i=new CustomEvent(e,{bubbles:n.bubbles!==!1,cancelable:n.cancelable!==!1,composed:n.composed!==!1,detail:t});return r.dispatchEvent(i),i}function Q(r){return M(r)?/^[a-z_]+\.[a-z0-9_]+$/.test(r):!1}var rt="1.0.3",Lt="Universal Card",Pt="\u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0441 7 \u0440\u0435\u0436\u0438\u043C\u0430\u043C\u0438 body, grid layout, lazy loading \u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u043E\u0439",E=Object.freeze({EXPAND:"expand",MODAL:"modal",FULLSCREEN:"fullscreen",TABS:"tabs",CAROUSEL:"carousel",SUBVIEW:"subview",NONE:"none"}),we=Object.values(E),Ee=Object.freeze({START:"start",CENTER:"center",STRETCH:"stretch"}),se=Object.values(Ee),Se=Object.freeze({DEFAULT:"default",STACKED:"stacked",CENTERED:"centered"}),de=Object.values(Se),Ae=Object.freeze({START:"start",CENTER:"center",END:"end"}),le=Object.values(Ae),ce=Object.freeze({RIGHT:"right",BELOW_CONTENT:"below_content"}),ue=Object.values(ce),Ot=Object.freeze({TAP:"tap",HOLD:"hold",DOUBLE_TAP:"double_tap",NONE:"none"}),Te=Object.values(Ot),Rt=Object.freeze({CARD:"card",DASHBOARD:"dashboard",GLOBAL:"global"}),ke=Object.values(Rt),J=Object.freeze({DEFAULT:"default",TRANSPARENT:"transparent",SOLID:"solid",GLASS:"glass",GLASSMORPHISM:"glassmorphism",NEUMORPHISM:"neumorphism",MINIMAL:"minimal",GRADIENT:"gradient",DARK:"dark",NEON:"neon",AURORA:"aurora",CARBON:"carbon",SLATE:"slate",OBSIDIAN:"obsidian",CHARCOAL:"charcoal",MIDNIGHT:"midnight",CYBER:"cyber",VOID:"void",EMBER:"ember",FOREST:"forest",OCEAN:"ocean",PURPLE_HAZE:"purple-haze",MATRIX:"matrix",GRAPHITE:"graphite",SMOKE:"smoke",NORD:"nord",DRACULA:"dracula",MONOKAI:"monokai",TOKYO_NIGHT:"tokyo-night",CATPPUCCIN:"catppuccin"}),Ht=Object.freeze({NONE:"none",FADE:"fade",FADE_UP:"fadeUp",FADE_DOWN:"fadeDown",SCALE:"scale",SLIDE:"slide",BOUNCE:"bounce",FLIP:"flip"}),Me=Object.values(Ht),It=Object.freeze({NONE:"none",FADE:"fade",FADE_DOWN:"fadeDown",FADE_UP:"fadeUp",SCALE:"scale",SLIDE:"slide"}),Le=Object.values(It),Nt=Object.freeze({NONE:"none",FADE_UP:"fadeUp",FADE_DOWN:"fadeDown",FADE_LEFT:"fadeLeft",FADE_RIGHT:"fadeRight",SCALE:"scale",BOUNCE:"bounce",FLIP:"flip"}),Pe=Object.values(Nt),Dt=Object.freeze({SEQUENTIAL:"sequential",REVERSE:"reverse",CENTER_OUT:"center-out",EDGES_IN:"edges-in",DIAGONAL:"diagonal",WAVE:"wave",RANDOM:"random"}),Oe=Object.values(Dt),xn=Object.freeze({NONE:"none",FADE:"fade",SLIDE:"slide",BOUNCE:"bounce",ELASTIC:"elastic",SMOOTH:"smooth",SHARP:"sharp",ZOOM:"zoom"}),Cn=Object.freeze({SKELETON:"skeleton",SPINNER:"spinner",DOTS:"dots",PROGRESS:"progress",SHIMMER:"shimmer",PULSE:"pulse"}),C=Object.freeze({STATE:"state",NUMERIC_STATE:"numeric_state",USER:"user",TIME:"time",SCREEN:"screen",AND:"and",OR:"or",NOT:"not"}),ot=Object.values(C),wn=Object.freeze({MON:"mon",TUE:"tue",WED:"wed",THU:"thu",FRI:"fri",SAT:"sat",SUN:"sun"}),Re=Object.values(wn),x=Object.freeze({NONE:"none",TOGGLE:"toggle",CALL_SERVICE:"call-service",NAVIGATE:"navigate",URL:"url",MORE_INFO:"more-info",FIRE_EVENT:"fire-dom-event",EXPAND:"expand",COLLAPSE:"collapse"}),Bt=Object.freeze({HORIZONTAL:"horizontal",VERTICAL:"vertical",BOTH:"both"}),He=Object.values(Bt),En=Object.freeze({NONE:"none",EXPAND:"expand",COLLAPSE:"collapse",TOGGLE:"toggle",NEXT:"next",PREV:"prev"}),Ie=Object.values(En),$=Object.freeze({STATE:"state",ATTRIBUTE:"attribute",COUNTER:"counter",CUSTOM:"custom"}),Ne=Object.values($),he=Object.freeze({EQUALS:"==",NOT_EQUALS:"!=",GREATER_THAN:">",LESS_THAN:"<",GREATER_THAN_OR_EQUALS:">=",LESS_THAN_OR_EQUALS:"<="}),G=Object.values(he),at=Object.freeze({NONE:"none",TIME:"time",DATE:"date",DURATION:"duration"}),De=Object.values(at),X=Object.freeze({LAZY:"lazy",PRELOAD:"preload"}),pe=Object.values(X),Y=Object.freeze({CARD_EXPANDED:"universal-card-expanded",CARD_COLLAPSED:"universal-card-collapsed",CARD_CONTROL:"universal-card-control",CONFIG_CHANGED:"config-changed",HASS_UPDATED:"hass-updated"}),hi=Object.freeze({PRIMARY:"--uc-primary-color",SECONDARY:"--uc-secondary-color",ACCENT:"--uc-accent-color",BACKGROUND:"--uc-background-color",SURFACE:"--uc-surface-color",TEXT:"--uc-text-color",TEXT_SECONDARY:"--uc-text-secondary-color",BORDER:"--uc-border-color",BORDER_RADIUS:"--uc-border-radius",PADDING:"--uc-padding",GAP:"--uc-gap",SHADOW:"--uc-shadow",SHADOW_HOVER:"--uc-shadow-hover",TRANSITION_DURATION:"--uc-transition-duration",TRANSITION_TIMING:"--uc-transition-timing"}),u=Object.freeze({body_mode:E.EXPAND,expand_trigger:Ot.TAP,expanded:!1,animation:!0,stability_mode:!1,theme:J.DEFAULT,border_radius:"var(--ha-card-border-radius, 12px)",padding:"16px",grid_columns:1,grid_gap:"16px",modal_width:"90%",modal_height:"auto",modal_max_width:"600px",modal_max_height:"85vh",modal_loading_strategy:X.LAZY,backdrop_color:"rgba(0, 0, 0, 0.6)",fullscreen_width:"100%",fullscreen_height:"100%",fullscreen_max_width:"1200px",fullscreen_max_height:"100vh",fullscreen_padding:"16px",fullscreen_background:"var(--primary-background-color, #fafafa)",tabs_content_padding:"16px",tabs_tab_min_width:"72px",tabs_tab_alignment:Ee.START,header_layout_variant:Se.DEFAULT,header_gap:"12px",header_content_gap:"2px",header_content_align:Ae.START,header_badges_position:ce.RIGHT,carousel_show_arrows:!0,carousel_show_indicators:!0,carousel_loop:!0,carousel_height:"auto",lazy_load:!0,lazy_initial_batch:4,lazy_batch_size:4,lazy_idle_timeout:800,remember_expanded_state:!1,remember_mode_state:!0,auto_collapse_after:0,enable_card_pool:!0,pool_scope:Rt.CARD,pool_ttl_ms:10*60*1e3,pool_max_entries:32,show_expand_icon:!0,expand_icon:"mdi:chevron-down",haptic:!1,loading_type:Cn.SKELETON,skeleton_count:3,carousel_autoplay:!1,carousel_interval:5e3,swipe_enabled:!1,swipe_direction:Bt.HORIZONTAL,swipe_threshold:50,swipe_velocity_threshold:.3,swipe_prevent_scroll:!1,expand_animation:Ht.SLIDE,collapse_animation:It.SLIDE,cards_animation:Nt.FADE_UP,cards_stagger:50,cards_direction:Dt.SEQUENTIAL,animation_preset:xn.SMOOTH,animation_duration:300}),_e=Object.freeze({TTI_MS:250,RENDER_MS:16,UPDATE_MS:12,BODY_LOAD_MS:180,BUNDLE_SIZE_KB:360}),h=Object.freeze({MAX_GRID_COLUMNS:12,MIN_GRID_COLUMNS:1,MAX_CARDS_PER_BODY:100,MAX_TABS:20,UPDATE_THROTTLE_MS:100,RESIZE_DEBOUNCE_MS:200,INTERSECTION_MARGIN:"100px",LAZY_MIN_BATCH:1,LAZY_MAX_BATCH:25,LAZY_MIN_TIMEOUT_MS:50,LAZY_MAX_TIMEOUT_MS:5e3,CARD_POOL_MAX_ENTRIES:32,CARD_POOL_MAX_AGE_MS:10*60*1e3,CARD_POOL_HARD_MAX_ENTRIES:512,POOL_MIN_TTL_MS:1e3,POOL_MAX_TTL_MS:60*60*1e3,POOL_MIN_MAX_ENTRIES:1,POOL_MAX_MAX_ENTRIES:512,AUTO_COLLAPSE_MAX_SECONDS:3600,ANIMATION_DURATION_MAX_MS:2e3,CAROUSEL_MIN_INTERVAL_MS:1e3,CAROUSEL_MAX_INTERVAL_MS:6e4,CARDS_STAGGER_MAX_MS:200,SWIPE_MAX_THRESHOLD_PX:400,SWIPE_MAX_VELOCITY_THRESHOLD:5,BADGE_MAX_PRECISION:6,METRICS_HISTORY_SIZE:200,MAX_UNDO_HISTORY:50,MAX_LOG_ENTRIES:1e3});var Be=1,T=2;function Ut(r){if(Array.isArray(r))return{cards:r};if(f(r)){let e=r;return Array.isArray(e.cards)?{...e,cards:e.cards}:{...e}}return null}function A(r,e,t){r.push({path:e,message:t})}function Sn(r,e){if(r.cards!==void 0&&(f(r.body)||(r.body={}),r.body.cards===void 0?(r.body.cards=Array.isArray(r.cards)?[...r.cards]:r.cards,A(e,"cards","Moved legacy root cards to body.cards.")):A(e,"cards","Dropped legacy root cards because body.cards already exists."),delete r.cards),r.remember_state!==void 0&&(r.remember_expanded_state===void 0?(r.remember_expanded_state=r.remember_state,A(e,"remember_state","Renamed remember_state to remember_expanded_state.")):A(e,"remember_state","Removed remember_state because remember_expanded_state already exists."),delete r.remember_state),r.state_styles_entity!==void 0&&(r.entity===void 0?(r.entity=r.state_styles_entity,A(e,"state_styles_entity","Promoted state_styles_entity to root entity.")):A(e,"state_styles_entity","Removed state_styles_entity because root entity already exists."),delete r.state_styles_entity),r.debug!==void 0&&(delete r.debug,A(e,"debug","Removed deprecated debug config field.")),f(r.header)){let{header:t}=r;if(t.left!==void 0){if(r.header_left===void 0){let n=Ut(t.left);n&&(r.header_left=n,A(e,"header.left","Moved legacy header.left to root header_left."))}else A(e,"header.left","Dropped legacy header.left because header_left already exists.");delete t.left}if(t.right!==void 0){if(r.header_right===void 0){let n=Ut(t.right);n&&(r.header_right=n,A(e,"header.right","Moved legacy header.right to root header_right."))}else A(e,"header.right","Dropped legacy header.right because header_right already exists.");delete t.right}Object.keys(t).length===0&&delete r.header}if(f(r.carousel)){let{carousel:t}=r;r.carousel_autoplay===void 0&&typeof t.autoplay=="boolean"&&(r.carousel_autoplay=t.autoplay,A(e,"carousel.autoplay","Moved carousel.autoplay to root carousel_autoplay.")),r.carousel_interval===void 0&&typeof t.interval=="number"&&(r.carousel_interval=t.interval,A(e,"carousel.interval","Moved carousel.interval to root carousel_interval.")),["show_indicators","show_arrows","loop"].forEach(n=>{t[n]!==void 0&&A(e,`carousel.${n}`,`Removed legacy carousel.${n}; this option is no longer configurable.`)}),delete r.carousel}f(r.swipe)&&Object.entries({swipe_left:"left",swipe_right:"right",swipe_up:"up",swipe_down:"down"}).forEach(([n,i])=>{r.swipe[n]!==void 0&&(r.swipe[i]===void 0?(r.swipe[i]=r.swipe[n],A(e,`swipe.${n}`,`Renamed swipe.${n} to swipe.${i}.`)):A(e,`swipe.${n}`,`Removed swipe.${n} because swipe.${i} already exists.`),delete r.swipe[n])}),Array.isArray(r.badges)&&(r.badges=r.badges.map((t,n)=>{if(!f(t)||t.text===void 0)return t;let i={...t};return i.value===void 0?(i.value=i.text,A(e,`badges[${n}].text`,"Moved badges[].text to badges[].value.")):i.label===void 0?(i.label=i.text,A(e,`badges[${n}].text`,"Moved badges[].text to badges[].label because value already exists.")):A(e,`badges[${n}].text`,"Removed badges[].text because value/label already exist."),delete i.text,i}))}function An(r){return Number.isInteger(r.config_version)&&r.config_version>0?r.config_version:Be}function $t(r){let e=Number.isInteger(r.config_version)&&r.config_version>0,t=An(r),n=j(r),i=[];return t<2&&Sn(n,i),n.config_version=T,{config:n,fromVersion:t,toVersion:T,changed:e&&t!==T||i.length>0,explicitVersion:e,changes:i}}var d=class extends Error{constructor(e,t){super(t?`${t}: ${e}`:e),this.name="ConfigValidationError",this.path=t}},D=class{static getCurrentConfigVersion(){return T}static migrate(e){if(!f(e))throw new d("Configuration must be an object");if(e.config_version!==void 0){if(!Number.isInteger(e.config_version)||e.config_version<1)throw new d("config_version must be a positive integer","config_version");if(e.config_version>T)throw new d(`config_version ${e.config_version} is newer than this runtime. Current supported version is ${T}.`,"config_version")}return $t(e)}static validate(e){this._validateCurrentConfig(e)}static _validateCurrentConfig(e){var n,i,o,a,s;if(!f(e))throw new d("Configuration must be an object");if(e.config_version!==void 0){if(!Number.isInteger(e.config_version)||e.config_version<1)throw new d("config_version must be a positive integer","config_version");if(e.config_version<T)throw new d(`config_version ${e.config_version} is outdated. Migrate to version ${T} before strict validation.`,"config_version");if(e.config_version>T)throw new d(`config_version ${e.config_version} is newer than this runtime. Current supported version is ${T}.`,"config_version")}if(e.body_mode&&!we.includes(e.body_mode))throw new d(`Invalid body_mode: "${e.body_mode}". Valid modes: ${we.join(", ")}`,"body_mode");let t=Object.values(J);if(e.theme&&!t.includes(e.theme))throw new d(`Invalid theme: "${e.theme}". Valid themes: ${t.join(", ")}`,"theme");if(e.entity&&!Q(e.entity))throw new d(`Invalid entity format: "${e.entity}"`,"entity");if(e.icon_color!==void 0&&typeof e.icon_color!="string")throw new d("icon_color must be a string","icon_color");if(e.attribute!==void 0&&!M(e.attribute))throw new d("attribute must be a non-empty string","attribute");if(e.cards!==void 0)throw new d("Root-level cards were removed. Use body.cards instead.","cards");if(e.remember_state!==void 0)throw new d("remember_state was removed. Use remember_expanded_state instead.","remember_state");if(e.debug!==void 0)throw new d("debug was removed from the config contract. Use devtools instead.","debug");if(e.state_styles_entity!==void 0)throw new d("state_styles_entity was removed. Use root entity and optional attribute instead.","state_styles_entity");if(f(e.header)&&(e.header.left!==void 0||e.header.right!==void 0))throw new d("Legacy header.left/header.right were removed. Use root header_left/header_right sections.","header");if(e.header!==void 0&&this._validateHeaderConfig(e.header,"header"),e.carousel!==void 0)throw new d("Legacy carousel object was removed. Use root carousel_autoplay and carousel_interval fields.","carousel");if(e.expand_trigger!==void 0&&(typeof e.expand_trigger!="string"||!Te.includes(e.expand_trigger)))throw new d(`expand_trigger must be one of: ${Te.join(", ")}`,"expand_trigger");if(e.grid&&e.grid.columns!==void 0){let l=e.grid.columns;if(typeof l=="number"){if(l<h.MIN_GRID_COLUMNS||l>h.MAX_GRID_COLUMNS)throw new d("Grid columns must be between "+h.MIN_GRID_COLUMNS+" and "+h.MAX_GRID_COLUMNS,"grid.columns")}else if(typeof l!="string")throw new d("Grid columns must be a number or CSS template string","grid.columns")}if(e.modal!==void 0&&this._validateModal(e.modal,"modal"),e.fullscreen!==void 0&&this._validateFullscreen(e.fullscreen,"fullscreen"),e.tabs_config!==void 0&&this._validateTabsUiConfig(e.tabs_config,"tabs_config"),e.carousel_options!==void 0&&this._validateCarouselOptions(e.carousel_options,"carousel_options"),e.subview!==void 0&&this._validateSubview(e.subview,"subview"),e.lazy_initial_batch!==void 0){if(!v(e.lazy_initial_batch))throw new d("lazy_initial_batch must be a number","lazy_initial_batch");if(e.lazy_initial_batch<h.LAZY_MIN_BATCH||e.lazy_initial_batch>h.LAZY_MAX_BATCH)throw new d(`lazy_initial_batch must be between ${h.LAZY_MIN_BATCH} and ${h.LAZY_MAX_BATCH}`,"lazy_initial_batch")}if(e.lazy_batch_size!==void 0){if(!v(e.lazy_batch_size))throw new d("lazy_batch_size must be a number","lazy_batch_size");if(e.lazy_batch_size<h.LAZY_MIN_BATCH||e.lazy_batch_size>h.LAZY_MAX_BATCH)throw new d(`lazy_batch_size must be between ${h.LAZY_MIN_BATCH} and ${h.LAZY_MAX_BATCH}`,"lazy_batch_size")}if(e.lazy_idle_timeout!==void 0){if(!v(e.lazy_idle_timeout))throw new d("lazy_idle_timeout must be a number","lazy_idle_timeout");if(e.lazy_idle_timeout<h.LAZY_MIN_TIMEOUT_MS||e.lazy_idle_timeout>h.LAZY_MAX_TIMEOUT_MS)throw new d(`lazy_idle_timeout must be between ${h.LAZY_MIN_TIMEOUT_MS} and ${h.LAZY_MAX_TIMEOUT_MS}`,"lazy_idle_timeout")}if(e.auto_collapse_after!==void 0){if(!v(e.auto_collapse_after))throw new d("auto_collapse_after must be a number","auto_collapse_after");if(e.auto_collapse_after<0||e.auto_collapse_after>h.AUTO_COLLAPSE_MAX_SECONDS)throw new d(`auto_collapse_after must be between 0 and ${h.AUTO_COLLAPSE_MAX_SECONDS}`,"auto_collapse_after")}if(e.remember_expanded_state!==void 0&&typeof e.remember_expanded_state!="boolean")throw new d("remember_expanded_state must be a boolean","remember_expanded_state");if(e.remember_mode_state!==void 0&&typeof e.remember_mode_state!="boolean")throw new d("remember_mode_state must be a boolean","remember_mode_state");if(e.stability_mode!==void 0&&typeof e.stability_mode!="boolean")throw new d("stability_mode must be a boolean","stability_mode");if(e.carousel_autoplay!==void 0&&typeof e.carousel_autoplay!="boolean")throw new d("carousel_autoplay must be a boolean","carousel_autoplay");if(e.carousel_interval!==void 0){if(!v(e.carousel_interval))throw new d("carousel_interval must be a number","carousel_interval");if(e.carousel_interval<h.CAROUSEL_MIN_INTERVAL_MS||e.carousel_interval>h.CAROUSEL_MAX_INTERVAL_MS)throw new d(`carousel_interval must be between ${h.CAROUSEL_MIN_INTERVAL_MS} and ${h.CAROUSEL_MAX_INTERVAL_MS}`,"carousel_interval")}if(e.animation_duration!==void 0){if(!v(e.animation_duration))throw new d("animation_duration must be a number","animation_duration");if(e.animation_duration<0||e.animation_duration>h.ANIMATION_DURATION_MAX_MS)throw new d(`animation_duration must be between 0 and ${h.ANIMATION_DURATION_MAX_MS}`,"animation_duration")}if(e.expand_animation!==void 0&&(typeof e.expand_animation!="string"||!Me.includes(e.expand_animation)))throw new d(`expand_animation must be one of: ${Me.join(", ")}`,"expand_animation");if(e.collapse_animation!==void 0&&(typeof e.collapse_animation!="string"||!Le.includes(e.collapse_animation)))throw new d(`collapse_animation must be one of: ${Le.join(", ")}`,"collapse_animation");if(e.cards_animation!==void 0&&(typeof e.cards_animation!="string"||!Pe.includes(e.cards_animation)))throw new d(`cards_animation must be one of: ${Pe.join(", ")}`,"cards_animation");if(e.cards_stagger!==void 0){if(!v(e.cards_stagger))throw new d("cards_stagger must be a number","cards_stagger");if(e.cards_stagger<0||e.cards_stagger>h.CARDS_STAGGER_MAX_MS)throw new d(`cards_stagger must be between 0 and ${h.CARDS_STAGGER_MAX_MS}`,"cards_stagger")}if(e.cards_direction!==void 0&&(typeof e.cards_direction!="string"||!Oe.includes(e.cards_direction)))throw new d(`cards_direction must be one of: ${Oe.join(", ")}`,"cards_direction");if(e.enable_card_pool!==void 0&&typeof e.enable_card_pool!="boolean")throw new d("enable_card_pool must be a boolean","enable_card_pool");if(e.pool_scope!==void 0&&(typeof e.pool_scope!="string"||!ke.includes(e.pool_scope)))throw new d(`pool_scope must be one of: ${ke.join(", ")}`,"pool_scope");if(e.pool_ttl_ms!==void 0){if(!v(e.pool_ttl_ms))throw new d("pool_ttl_ms must be a number","pool_ttl_ms");if(e.pool_ttl_ms<h.POOL_MIN_TTL_MS||e.pool_ttl_ms>h.POOL_MAX_TTL_MS)throw new d(`pool_ttl_ms must be between ${h.POOL_MIN_TTL_MS} and ${h.POOL_MAX_TTL_MS}`,"pool_ttl_ms")}if(e.pool_max_entries!==void 0){if(!v(e.pool_max_entries))throw new d("pool_max_entries must be a number","pool_max_entries");if(e.pool_max_entries<h.POOL_MIN_MAX_ENTRIES||e.pool_max_entries>h.POOL_MAX_MAX_ENTRIES)throw new d(`pool_max_entries must be between ${h.POOL_MIN_MAX_ENTRIES} and ${h.POOL_MAX_MAX_ENTRIES}`,"pool_max_entries")}if(this._validateCardCollection((n=e.body)==null?void 0:n.cards,"body.cards",{maxCards:h.MAX_CARDS_PER_BODY}),this._validateCardCollection((i=e.header)==null?void 0:i.cards,"header.cards"),this._validateCardCollection((o=e.footer)==null?void 0:o.cards,"footer.cards"),this._validateCardCollection((a=e.header_left)==null?void 0:a.cards,"header_left.cards"),this._validateCardCollection((s=e.header_right)==null?void 0:s.cards,"header_right.cards"),e.tabs&&this._validateTabs(e.tabs),e.visibility&&this._validateConditions(e.visibility,"visibility"),e.section_visibility!==void 0){if(!f(e.section_visibility))throw new d("section_visibility must be an object with header/body/footer arrays","section_visibility");["header","body","footer"].forEach(l=>{let c=e.section_visibility[l];c!==void 0&&this._validateConditions(c,`section_visibility.${l}`)})}if(e.state_styles!==void 0){if(!e.entity)throw new d("state_styles requires root entity. Separate state_styles_entity is no longer supported.","state_styles");this._validateStateStyles(e.state_styles,"state_styles")}if(e.swipe!==void 0&&this._validateSwipeConfig(e.swipe,"swipe"),e.badges!==void 0&&this._validateBadges(e.badges,"badges"),e.theme_tokens!==void 0){if(!f(e.theme_tokens))throw new d("theme_tokens must be an object","theme_tokens");let l=/^--[a-z0-9_-]+$/i;Object.entries(e.theme_tokens).forEach(([c,m])=>{if(!l.test(c))throw new d(`Invalid CSS variable name "${c}"`,`theme_tokens.${c}`);if(typeof m!="string")throw new d("Theme token value must be a string",`theme_tokens.${c}`)})}return e.custom_css!==void 0&&this._validateCustomCSS(e.custom_css,"custom_css"),["tap_action","hold_action","double_tap_action"].forEach(l=>{e[l]&&this._validateAction(e[l],l)}),!0}static _validateCardConfig(e,t){if(!f(e))throw new d("Card config must be an object",t);if(!e.type)throw new d("Card must have a type",t)}static _validateCardCollection(e,t,n={}){if(e!==void 0){if(!Array.isArray(e))throw new d(`${t} must be an array`,t);if(n.maxCards&&e.length>n.maxCards)throw new d(`Maximum ${n.maxCards} cards allowed in ${t}`,t);e.forEach((i,o)=>{this._validateCardConfig(i,`${t}[${o}]`)})}}static _validateTabs(e){if(!Array.isArray(e))throw new d("tabs must be an array","tabs");if(e.length>h.MAX_TABS)throw new d(`Maximum ${h.MAX_TABS} tabs allowed`,"tabs");e.forEach((t,n)=>{if(!f(t))throw new d("Tab config must be an object",`tabs[${n}]`);if(t.cards&&!Array.isArray(t.cards))throw new d("Tab cards must be an array",`tabs[${n}].cards`)})}static _validateHeaderConfig(e,t){if(!f(e))throw new d("header must be an object",t);if(this._validateCardCollection(e.cards,`${t}.cards`),e.sticky!==void 0&&typeof e.sticky!="boolean")throw new d("header.sticky must be a boolean",`${t}.sticky`);if(e.clickable!==void 0&&typeof e.clickable!="boolean")throw new d("header.clickable must be a boolean",`${t}.clickable`);e.layout!==void 0&&this._validateHeaderLayout(e.layout,`${t}.layout`)}static _validateHeaderLayout(e,t){if(!f(e))throw new d("header.layout must be an object",t);if(["gap","content_gap"].forEach(n=>{if(e[n]!==void 0&&!M(e[n]))throw new d(`header.layout.${n} must be a non-empty string`,`${t}.${n}`)}),e.variant!==void 0&&(typeof e.variant!="string"||!de.includes(e.variant)))throw new d(`header.layout.variant must be one of: ${de.join(", ")}`,`${t}.variant`);if(e.align!==void 0&&(typeof e.align!="string"||!le.includes(e.align)))throw new d(`header.layout.align must be one of: ${le.join(", ")}`,`${t}.align`);if(e.badges_position!==void 0&&(typeof e.badges_position!="string"||!ue.includes(e.badges_position)))throw new d(`header.layout.badges_position must be one of: ${ue.join(", ")}`,`${t}.badges_position`)}static _validateConditions(e,t){if(!Array.isArray(e))throw new d("Visibility must be an array",t);e.forEach((n,i)=>{let o=`${t}[${i}]`;if(!f(n))throw new d("Condition must be an object",o);let a=n.condition;if(!a)throw new d('Condition must have a "condition" type',o);if(!ot.includes(a))throw new d(`Invalid condition type: "${a}"`,o);switch(a){case C.STATE:this._validateStateCondition(n,o);break;case C.NUMERIC_STATE:this._validateNumericStateCondition(n,o);break;case C.USER:this._validateUserCondition(n,o);break;case C.TIME:this._validateTimeCondition(n,o);break;case C.SCREEN:this._validateScreenCondition(n,o);break;case C.AND:case C.OR:case C.NOT:this._validateConditionGroup(n,o);break}})}static _validateConditionEntity(e,t){if(!M(e.entity))throw new d("Condition entity must be a non-empty string",`${t}.entity`);if(!Q(e.entity))throw new d(`Invalid entity format: "${e.entity}"`,`${t}.entity`);if(e.attribute!==void 0&&!M(e.attribute))throw new d("Condition attribute must be a non-empty string",`${t}.attribute`)}static _validateStateCondition(e,t){if(this._validateConditionEntity(e,t),e.state===void 0&&e.state_not===void 0)throw new d('state condition requires "state" or "state_not"',t);if(e.state!==void 0&&e.state_not!==void 0)throw new d('state condition cannot define both "state" and "state_not"',t);e.state!==void 0&&this._validateStringOrStringArray(e.state,`${t}.state`,"state"),e.state_not!==void 0&&this._validateStringOrStringArray(e.state_not,`${t}.state_not`,"state_not")}static _validateNumericStateCondition(e,t){if(this._validateConditionEntity(e,t),e.above===void 0&&e.below===void 0)throw new d('numeric_state condition requires "above" or "below"',t);if(e.above!==void 0&&!v(e.above))throw new d("numeric_state.above must be a number",`${t}.above`);if(e.below!==void 0&&!v(e.below))throw new d("numeric_state.below must be a number",`${t}.below`);if(v(e.above)&&v(e.below)&&e.above>=e.below)throw new d("numeric_state.above must be lower than numeric_state.below",t)}static _validateUserCondition(e,t){if(e.users===void 0&&e.is_admin===void 0&&e.is_owner===void 0)throw new d("user condition requires users, is_admin, or is_owner",t);if(e.users!==void 0&&this._validateStringArray(e.users,`${t}.users`,"users"),e.is_admin!==void 0&&typeof e.is_admin!="boolean")throw new d("user.is_admin must be a boolean",`${t}.is_admin`);if(e.is_owner!==void 0&&typeof e.is_owner!="boolean")throw new d("user.is_owner must be a boolean",`${t}.is_owner`)}static _validateTimeCondition(e,t){if(e.after===void 0&&e.before===void 0&&e.weekday===void 0)throw new d("time condition requires after, before, or weekday",t);if(e.after!==void 0&&!this._isValidTimeString(e.after))throw new d("time.after must be in HH:MM format",`${t}.after`);if(e.before!==void 0&&!this._isValidTimeString(e.before))throw new d("time.before must be in HH:MM format",`${t}.before`);if(e.weekday!==void 0){if(!Array.isArray(e.weekday))throw new d("time.weekday must be an array",`${t}.weekday`);e.weekday.forEach((n,i)=>{if(typeof n!="string"||!Re.includes(n))throw new d(`Invalid weekday: "${String(n)}"`,`${t}.weekday[${i}]`)})}}static _validateScreenCondition(e,t){if(e.media_query===void 0&&e.min_width===void 0&&e.max_width===void 0)throw new d("screen condition requires media_query, min_width, or max_width",t);if(e.media_query!==void 0&&!M(e.media_query))throw new d("screen.media_query must be a non-empty string",`${t}.media_query`);if(e.min_width!==void 0&&!v(e.min_width))throw new d("screen.min_width must be a number",`${t}.min_width`);if(e.max_width!==void 0&&!v(e.max_width))throw new d("screen.max_width must be a number",`${t}.max_width`);if(v(e.min_width)&&v(e.max_width)&&e.min_width>e.max_width)throw new d("screen.min_width must be lower than or equal to screen.max_width",t)}static _validateConditionGroup(e,t){if(!Array.isArray(e.conditions)||e.conditions.length===0)throw new d('Logical conditions require a non-empty "conditions" array',`${t}.conditions`);this._validateConditions(e.conditions,`${t}.conditions`)}static _validateStringOrStringArray(e,t,n){if(typeof e=="string"){if(!e.trim())throw new d(`${n} must not be empty`,t);return}if(!Array.isArray(e)||e.length===0)throw new d(`${n} must be a string or non-empty array of strings`,t);e.forEach((i,o)=>{if(typeof i!="string"||!i.trim())throw new d(`${n} items must be non-empty strings`,`${t}[${o}]`)})}static _validateStringArray(e,t,n){if(!Array.isArray(e)||e.length===0)throw new d(`${n} must be a non-empty array of strings`,t);e.forEach((i,o)=>{if(typeof i!="string"||!i.trim())throw new d(`${n} items must be non-empty strings`,`${t}[${o}]`)})}static _validateStateStyles(e,t){if(!f(e))throw new d("state_styles must be an object map",t);Object.entries(e).forEach(([n,i],o)=>{let a=`${t}.${n||o}`;if(!n||!n.trim())throw new d("state_styles keys must be non-empty strings",a);if(!f(i))throw new d("state_styles entries must be objects",a);Object.entries(i).forEach(([s,l])=>{if(s==="class"){if(typeof l!="string"&&(!Array.isArray(l)||l.some(c=>typeof c!="string"||!c.trim())))throw new d("state_styles.class must be a string or array of strings",`${a}.class`);return}if(typeof l!="string"&&!v(l))throw new d(`state_styles.${s} must be a string or number`,`${a}.${s}`)})})}static _validateSwipeConfig(e,t){if(!f(e))throw new d("swipe must be an object",t);if(e.swipe_left!==void 0||e.swipe_right!==void 0||e.swipe_up!==void 0||e.swipe_down!==void 0)throw new d("Legacy swipe.swipe_left/swipe_right/swipe_up/swipe_down keys were removed. Use swipe.left/right/up/down.",t);if(e.enabled!==void 0&&typeof e.enabled!="boolean")throw new d("swipe.enabled must be a boolean",`${t}.enabled`);if(e.direction!==void 0&&(typeof e.direction!="string"||!He.includes(e.direction)))throw new d(`swipe.direction must be one of: ${He.join(", ")}`,`${t}.direction`);if(e.threshold!==void 0){if(!v(e.threshold))throw new d("swipe.threshold must be a number",`${t}.threshold`);if(e.threshold<0||e.threshold>h.SWIPE_MAX_THRESHOLD_PX)throw new d(`swipe.threshold must be between 0 and ${h.SWIPE_MAX_THRESHOLD_PX}`,`${t}.threshold`)}if(e.velocityThreshold!==void 0){if(!v(e.velocityThreshold))throw new d("swipe.velocityThreshold must be a number",`${t}.velocityThreshold`);if(e.velocityThreshold<0||e.velocityThreshold>h.SWIPE_MAX_VELOCITY_THRESHOLD)throw new d(`swipe.velocityThreshold must be between 0 and ${h.SWIPE_MAX_VELOCITY_THRESHOLD}`,`${t}.velocityThreshold`)}if(e.preventScroll!==void 0&&typeof e.preventScroll!="boolean")throw new d("swipe.preventScroll must be a boolean",`${t}.preventScroll`);["left","right","up","down"].forEach(n=>{e[n]!==void 0&&this._validateSwipeActionConfig(e[n],`${t}.${n}`)})}static _validateSwipeActionConfig(e,t){if(!f(e))throw new d("Swipe action must be an object",t);if(e.action===void 0)throw new d('Swipe action requires an "action" field',`${t}.action`);if(typeof e.action!="string"||!Ie.includes(e.action))throw new d(`Swipe action must be one of: ${Ie.join(", ")}`,`${t}.action`)}static _validateBadges(e,t){if(!Array.isArray(e))throw new d("badges must be an array",t);e.forEach((n,i)=>{let o=`${t}[${i}]`;if(!f(n))throw new d("Badge must be an object",o);if(n.text!==void 0)throw new d("badges[].text was removed. Use badges[].value or badges[].label instead.",`${o}.text`);let a=n.type||$.STATE;if(typeof a!="string"||!Ne.includes(a))throw new d(`Badge type must be one of: ${Ne.join(", ")}`,`${o}.type`);let s=typeof n.entity=="string"?n.entity.trim():n.entity;if(s!==void 0&&!Q(s))throw new d(`Invalid entity format: "${n.entity}"`,`${o}.entity`);if(n.attribute!==void 0&&!M(n.attribute))throw new d("Badge attribute must be a non-empty string",`${o}.attribute`);if(["icon","color","label","unit","domain"].forEach(l=>{if(n[l]!==void 0&&typeof n[l]!="string")throw new d(`Badge ${l} must be a string`,`${o}.${l}`)}),n.value!==void 0&&typeof n.value!="string"&&!v(n.value))throw new d("Badge value must be a string or number",`${o}.value`);if(["min","max"].forEach(l=>{if(n[l]!==void 0&&!v(n[l]))throw new d(`Badge ${l} must be a number`,`${o}.${l}`)}),v(n.min)&&v(n.max)&&n.min>=n.max)throw new d("Badge min must be lower than max",o);if(["show_name","show_progress"].forEach(l=>{if(n[l]!==void 0&&typeof n[l]!="boolean")throw new d(`Badge ${l} must be a boolean`,`${o}.${l}`)}),n.icon_only!==void 0&&typeof n.icon_only!="boolean")throw new d("Badge icon_only must be a boolean",`${o}.icon_only`);if(n.precision!==void 0){if(!Number.isInteger(n.precision))throw new d("Badge precision must be an integer",`${o}.precision`);if(n.precision<0||n.precision>h.BADGE_MAX_PRECISION)throw new d(`Badge precision must be between 0 and ${h.BADGE_MAX_PRECISION}`,`${o}.precision`)}if(n.format!==void 0&&(typeof n.format!="string"||!De.includes(n.format)))throw new d(`Badge format must be one of: ${De.join(", ")}`,`${o}.format`);if(n.entities!==void 0){if(!Array.isArray(n.entities)||n.entities.length===0)throw new d("Badge entities must be a non-empty array",`${o}.entities`);let l=n.entities.map(c=>typeof c=="string"?c.trim():c).filter(c=>c!=="");if(l.length===0)throw new d("Badge entities must contain at least one valid entity ID",`${o}.entities`);l.forEach((c,m)=>{if(!Q(c))throw new d(`Invalid entity format: "${c}"`,`${o}.entities[${m}]`)})}if(n.state!==void 0&&typeof n.state!="string")throw new d("Badge state must be a string",`${o}.state`);if(n.count_state!==void 0&&typeof n.count_state!="string")throw new d("Badge count_state must be a string",`${o}.count_state`);switch(n.thresholds!==void 0&&this._validateBadgeThresholds(n.thresholds,`${o}.thresholds`),n.visibility!==void 0&&this._validateBadgeRules(n.visibility,`${o}.visibility`),n.color_rules!==void 0&&this._validateBadgeColorRules(n.color_rules,`${o}.color_rules`),n.tap_action!==void 0&&this._validateAction(n.tap_action,`${o}.tap_action`),n.icon_tap_action!==void 0&&this._validateAction(n.icon_tap_action,`${o}.icon_tap_action`),a){case $.STATE:if(!n.entity&&n.value===void 0)throw new d("State badges require entity or static value",o);break;case $.ATTRIBUTE:if(!n.entity)throw new d("Attribute badges require entity",`${o}.entity`);if(!n.attribute)throw new d("Attribute badges require attribute",`${o}.attribute`);break;case $.COUNTER:if(!n.domain&&!n.entities)throw new d("Counter badges require domain or entities",o);break;case $.CUSTOM:if(n.value===void 0)throw new d("Custom badges require value",`${o}.value`);break}})}static _validateModal(e,t){if(!f(e))throw new d("modal must be an object",t);if(["width","height","max_width","max_height","backdrop_color"].forEach(n=>{if(e[n]!==void 0&&!M(e[n]))throw new d(`modal.${n} must be a non-empty string`,`${t}.${n}`)}),["backdrop_blur","close_on_backdrop","close_on_escape","show_close"].forEach(n=>{if(e[n]!==void 0&&typeof e[n]!="boolean")throw new d(`modal.${n} must be a boolean`,`${t}.${n}`)}),e.loading_strategy!==void 0&&(typeof e.loading_strategy!="string"||!pe.includes(e.loading_strategy)))throw new d(`modal.loading_strategy must be one of: ${pe.join(", ")}`,`${t}.loading_strategy`)}static _validateFullscreen(e,t){if(!f(e))throw new d("fullscreen must be an object",t);["width","height","max_width","max_height","padding","background"].forEach(n=>{if(e[n]!==void 0&&!M(e[n]))throw new d(`fullscreen.${n} must be a non-empty string`,`${t}.${n}`)}),["show_close","close_on_escape"].forEach(n=>{if(e[n]!==void 0&&typeof e[n]!="boolean")throw new d(`fullscreen.${n} must be a boolean`,`${t}.${n}`)})}static _validateTabsUiConfig(e,t){if(!f(e))throw new d("tabs_config must be an object",t);if(e.position!==void 0&&!M(e.position))throw new d("tabs_config.position must be a non-empty string",`${t}.position`);if(["show_icons","show_labels"].forEach(n=>{if(e[n]!==void 0&&typeof e[n]!="boolean")throw new d(`tabs_config.${n} must be a boolean`,`${t}.${n}`)}),["content_padding","tab_min_width"].forEach(n=>{if(e[n]!==void 0&&!M(e[n]))throw new d(`tabs_config.${n} must be a non-empty string`,`${t}.${n}`)}),e.tab_alignment!==void 0&&(typeof e.tab_alignment!="string"||!se.includes(e.tab_alignment)))throw new d(`tabs_config.tab_alignment must be one of: ${se.join(", ")}`,`${t}.tab_alignment`)}static _validateCarouselOptions(e,t){if(!f(e))throw new d("carousel_options must be an object",t);if(["show_arrows","show_indicators","loop"].forEach(n=>{if(e[n]!==void 0&&typeof e[n]!="boolean")throw new d(`carousel_options.${n} must be a boolean`,`${t}.${n}`)}),e.swipe_threshold!==void 0){if(!v(e.swipe_threshold))throw new d("carousel_options.swipe_threshold must be a number",`${t}.swipe_threshold`);if(e.swipe_threshold<0||e.swipe_threshold>h.SWIPE_MAX_THRESHOLD_PX)throw new d(`carousel_options.swipe_threshold must be between 0 and ${h.SWIPE_MAX_THRESHOLD_PX}`,`${t}.swipe_threshold`)}if(e.height!==void 0&&!M(e.height))throw new d("carousel_options.height must be a non-empty string",`${t}.height`)}static _validateSubview(e,t){if(!f(e))throw new d("subview must be an object",t);["path","navigation_path"].forEach(n=>{if(e[n]!==void 0&&!M(e[n]))throw new d(`subview.${n} must be a non-empty string`,`${t}.${n}`)}),["replace_state","return_on_close"].forEach(n=>{if(e[n]!==void 0&&typeof e[n]!="boolean")throw new d(`subview.${n} must be a boolean`,`${t}.${n}`)})}static _validateBadgeThresholds(e,t){if(!Array.isArray(e))throw new d("Badge thresholds must be an array",t);e.forEach((n,i)=>{let o=`${t}[${i}]`;if(!f(n))throw new d("Badge threshold must be an object",o);if(!v(n.value))throw new d("Badge threshold value must be a number",`${o}.value`);if(!M(n.color))throw new d("Badge threshold color must be a non-empty string",`${o}.color`)})}static _validateBadgeRules(e,t){if(!Array.isArray(e))throw new d("Badge rules must be an array",t);e.forEach((n,i)=>{let o=`${t}[${i}]`;if(!f(n))throw new d("Badge rule must be an object",o);if(typeof n.operator!="string"||!G.includes(n.operator))throw new d(`Badge rule operator must be one of: ${G.join(", ")}`,`${o}.operator`);let a=typeof n.value;if(n.value===void 0||!["string","number","boolean"].includes(a))throw new d("Badge rule value must be a string, number, or boolean",`${o}.value`);if(n.entity!==void 0){let s=typeof n.entity=="string"?n.entity.trim():n.entity;if(!Q(s))throw new d(`Invalid entity format: "${n.entity}"`,`${o}.entity`)}if(n.attribute!==void 0&&!M(n.attribute))throw new d("Badge rule attribute must be a non-empty string",`${o}.attribute`)})}static _validateBadgeColorRules(e,t){this._validateBadgeRules(e,t),e.forEach((n,i)=>{if(!M(n.color))throw new d("Badge color rule color must be a non-empty string",`${t}[${i}].color`)})}static _isValidTimeString(e){if(typeof e!="string")return!1;let t=e.match(/^(\d{2}):(\d{2})$/);if(!t)return!1;let n=Number(t[1]),i=Number(t[2]);return n>=0&&n<=23&&i>=0&&i<=59}static _validateAction(e,t){if(!f(e))throw new d("Action must be an object",t);let n=Object.values(x);if(e.action&&!n.includes(e.action))throw new d(`Invalid action: "${e.action}"`,t);if(e.action===x.CALL_SERVICE&&!e.service)throw new d('call-service action requires a "service" property',t);if(e.action===x.NAVIGATE&&!e.navigation_path)throw new d('navigate action requires a "navigation_path" property',t);if(e.action===x.URL&&!e.url_path)throw new d('url action requires a "url_path" property',t)}static normalize(e){e=this.migrate(e).config,this._validateCurrentConfig(e);let t={...u,...e};if(t.config_version=T,t.card_id||(t.card_id=Mt("uc")),t.header=this._normalizeHeader(e.header),e.header_left&&(t.header_left=this._normalizeSection(e.header_left,"header_left")),e.header_right&&(t.header_right=this._normalizeSection(e.header_right,"header_right")),e.body?t.body=this._normalizeSection(e.body,"body"):t.body={cards:[]},e.footer&&(t.footer=this._normalizeSection(e.footer,"footer")),e.tabs&&(t.tabs=e.tabs.map((n,i)=>({label:n.label||`Tab ${i+1}`,icon:n.icon||null,cards:n.cards||[],...n}))),t.grid=this._normalizeGrid(e.grid),t.modal=this._normalizeModal(e.modal),t.fullscreen=this._normalizeFullscreen(e.fullscreen),t.tabs_config=this._normalizeTabsConfig(e.tabs_config),t.carousel_options=this._normalizeCarouselOptions(e.carousel_options),t.subview=this._normalizeSubview(e.subview),t.tap_action=this._normalizeAction(e.tap_action,"none"),t.hold_action=this._normalizeAction(e.hold_action,"none"),t.double_tap_action=this._normalizeAction(e.double_tap_action,"none"),e.visibility&&(t.visibility=e.visibility.map(n=>this._normalizeCondition(n))),t.section_visibility=this._normalizeSectionVisibility(e.section_visibility),e.attribute!==void 0){let n=e.attribute.trim();n?t.attribute=n:delete t.attribute}if(typeof e.icon_color=="string"){let n=e.icon_color.trim();n?t.icon_color=n:delete t.icon_color}return t.state_styles=this._normalizeStateStyles(e.state_styles),t.swipe=this._normalizeSwipe(e.swipe),t.badges=this._normalizeBadges(e.badges),t.theme_tokens=this._normalizeThemeTokens(e.theme_tokens),t.stability_mode&&(t.animation=!1,t.expand_animation="none",t.collapse_animation="none",t.cards_animation="none",t.cards_stagger=0,t.animation_duration=0,t.enable_card_pool=!1,t.carousel_autoplay=!1),t}static _normalizeSection(e,t){return e?{cards:e.cards||[],...e}:{cards:[]}}static _normalizeHeader(e){let t=this._normalizeSection(e,"header");return typeof t.sticky!="boolean"&&delete t.sticky,typeof t.clickable!="boolean"&&delete t.clickable,t.layout=this._normalizeHeaderLayout(e==null?void 0:e.layout),t}static _normalizeHeaderLayout(e){let t=f(e)?e:{},n=(i,o)=>typeof i!="string"?o:i.trim()||o;return{variant:typeof t.variant=="string"&&de.includes(t.variant)?t.variant:u.header_layout_variant,gap:n(t.gap,u.header_gap),content_gap:n(t.content_gap,u.header_content_gap),align:typeof t.align=="string"&&le.includes(t.align)?t.align:u.header_content_align,badges_position:typeof t.badges_position=="string"&&ue.includes(t.badges_position)?t.badges_position:u.header_badges_position}}static _normalizeGrid(e){return e?{columns:e.columns||u.grid_columns,gap:e.gap||u.grid_gap,responsive:e.responsive||null}:{columns:u.grid_columns,gap:u.grid_gap}}static _normalizeModal(e){let t=f(e)?e:{},n=(i,o)=>typeof i!="string"?o:i.trim()||o;return{width:n(t.width,u.modal_width),height:n(t.height,u.modal_height),max_width:n(t.max_width,u.modal_max_width),max_height:n(t.max_height,u.modal_max_height),loading_strategy:typeof t.loading_strategy=="string"&&pe.includes(t.loading_strategy)?t.loading_strategy:u.modal_loading_strategy,backdrop_blur:t.backdrop_blur!==!1,backdrop_color:n(t.backdrop_color,u.backdrop_color),close_on_backdrop:t.close_on_backdrop!==!1,close_on_escape:t.close_on_escape!==!1,show_close:t.show_close!==!1}}static _normalizeFullscreen(e){let t=f(e)?e:{},n=(i,o)=>typeof i!="string"?o:i.trim()||o;return{width:n(t.width,u.fullscreen_width),height:n(t.height,u.fullscreen_height),max_width:n(t.max_width,u.fullscreen_max_width),max_height:n(t.max_height,u.fullscreen_max_height),padding:n(t.padding,u.fullscreen_padding),background:n(t.background,u.fullscreen_background),show_close:t.show_close!==!1,close_on_escape:t.close_on_escape!==!1}}static _normalizeTabsConfig(e){let t=f(e)?e:{},n=(i,o)=>typeof i!="string"?o:i.trim()||o;return{position:n(t.position,"top"),show_icons:t.show_icons!==!1,show_labels:t.show_labels!==!1,content_padding:n(t.content_padding,u.tabs_content_padding),tab_min_width:n(t.tab_min_width,u.tabs_tab_min_width),tab_alignment:typeof t.tab_alignment=="string"&&se.includes(t.tab_alignment)?t.tab_alignment:u.tabs_tab_alignment}}static _normalizeCarouselOptions(e){let t=f(e)?e:{},n=(i,o)=>typeof i!="string"?o:i.trim()||o;return{show_arrows:t.show_arrows!==!1,show_indicators:t.show_indicators!==!1,loop:t.loop!==!1,swipe_threshold:v(t.swipe_threshold)?t.swipe_threshold:u.swipe_threshold,height:n(t.height,u.carousel_height)}}static _normalizeSubview(e){let t=f(e)?e:{},n=i=>typeof i!="string"?void 0:i.trim()||void 0;return{path:n(t.path),navigation_path:n(t.navigation_path),replace_state:t.replace_state===!0,return_on_close:t.return_on_close===!0}}static _normalizeAction(e,t="none"){return e?{action:e.action||t,...e}:{action:t}}static _normalizeCondition(e){let t={condition:e.condition,...e};return typeof t.entity=="string"&&(t.entity=t.entity.trim()),typeof t.attribute=="string"&&(t.attribute=t.attribute.trim()),e.condition===C.STATE&&(e.state!==void 0&&(t.state=this._normalizeStringListValue(e.state)),e.state_not!==void 0&&(t.state_not=this._normalizeStringListValue(e.state_not))),e.condition===C.USER&&Array.isArray(e.users)&&(t.users=e.users.map(n=>typeof n=="string"?n.trim():"").filter(Boolean)),e.condition===C.TIME&&Array.isArray(e.weekday)&&(t.weekday=e.weekday.map(n=>typeof n=="string"?n.trim():"").filter(n=>Re.includes(n))),[C.AND,C.OR,C.NOT].includes(e.condition)&&Array.isArray(e.conditions)&&(t.conditions=e.conditions.map(n=>this._normalizeCondition(n))),t}static _normalizeSectionVisibility(e){let t=f(e)?e:{},n=i=>Array.isArray(i)?i.map(o=>this._normalizeCondition(o)):[];return{header:n(t.header),body:n(t.body),footer:n(t.footer)}}static _normalizeThemeTokens(e){if(!f(e))return{};let t={},n=/^--[a-z0-9_-]+$/i;return Object.entries(e).forEach(([i,o])=>{if(!n.test(i)||typeof o!="string")return;let a=o.trim();a&&(t[i]=a)}),t}static _normalizeStateStyles(e){if(!f(e))return{};let t={};return Object.entries(e).forEach(([n,i])=>{let o=typeof n=="string"?n.trim():"";if(!o||!f(i))return;let a={};Object.entries(i).forEach(([s,l])=>{if(s==="class"){if(Array.isArray(l)){let c=l.map(m=>typeof m=="string"?m.trim():"").filter(Boolean);c.length>0&&(a.class=c);return}typeof l=="string"&&l.trim()&&(a.class=l.trim());return}if(typeof l=="string"){let c=l.trim();c&&(a[s]=c);return}v(l)&&(a[s]=l)}),Object.keys(a).length>0&&(t[o]=a)}),t}static _normalizeSwipe(e){var n,i,o,a;if(!f(e))return{enabled:u.swipe_enabled,direction:u.swipe_direction,threshold:u.swipe_threshold,velocityThreshold:u.swipe_velocity_threshold,preventScroll:u.swipe_prevent_scroll};let t={enabled:(n=e.enabled)!=null?n:u.swipe_enabled,direction:e.direction||u.swipe_direction,threshold:(i=e.threshold)!=null?i:u.swipe_threshold,velocityThreshold:(o=e.velocityThreshold)!=null?o:u.swipe_velocity_threshold,preventScroll:(a=e.preventScroll)!=null?a:u.swipe_prevent_scroll};return["left","right","up","down"].forEach(s=>{!f(e[s])||!e[s].action||e[s].action==="none"||(t[s]={action:e[s].action})}),t}static _normalizeBadges(e){return Array.isArray(e)?e.filter(t=>f(t)).map(t=>{let n={...t,type:t.type||$.STATE};if(["entity","attribute","icon","color","label","unit","domain","state","count_state"].forEach(i=>{if(typeof n[i]=="string"){let o=n[i].trim();o?n[i]=o:delete n[i]}}),typeof n.value=="string"){let i=n.value.trim();i?n.value=i:delete n.value}return Array.isArray(n.entities)&&(n.entities=[...new Set(n.entities.map(i=>typeof i=="string"?i.trim():"").filter(Boolean))],n.entities.length===0&&delete n.entities),Array.isArray(n.thresholds)&&(n.thresholds=n.thresholds.filter(i=>f(i)&&v(i.value)&&typeof i.color=="string"&&i.color.trim()).map(i=>({value:i.value,color:i.color.trim()})),n.thresholds.length===0&&delete n.thresholds),Array.isArray(n.visibility)&&(n.visibility=n.visibility.filter(i=>f(i)&&G.includes(i.operator)).map(i=>this._normalizeBadgeRule(i)).filter(Boolean),n.visibility.length===0&&delete n.visibility),Array.isArray(n.color_rules)&&(n.color_rules=n.color_rules.filter(i=>f(i)&&G.includes(i.operator)).map(i=>this._normalizeBadgeColorRule(i)).filter(Boolean),n.color_rules.length===0&&delete n.color_rules),n}):[]}static _normalizeBadgeRule(e){if(!f(e))return null;let t={operator:e.operator||he.EQUALS,value:e.value};if(typeof e.entity=="string"){let n=e.entity.trim();n&&(t.entity=n)}if(typeof e.attribute=="string"){let n=e.attribute.trim();n&&(t.attribute=n)}if(typeof t.value=="string"){let n=t.value.trim();if(!n)return null;t.value=n}return t}static _normalizeBadgeColorRule(e){let t=this._normalizeBadgeRule(e);return!t||typeof e.color!="string"||!e.color.trim()?null:{...t,color:e.color.trim()}}static _normalizeStringListValue(e){if(typeof e=="string")return e.trim()||void 0;if(!Array.isArray(e))return;let t=e.map(n=>typeof n=="string"?n.trim():"").filter(Boolean);if(t.length!==0)return t.length===1?t[0]:t}static getTitle(e,t){var n;return e.title?e.title:e.entity&&((n=t==null?void 0:t.states)!=null&&n[e.entity])?t.states[e.entity].attributes.friendly_name||e.entity:""}static getSubtitle(e,t){var n;return e.subtitle?e.subtitle:e.entity&&((n=t==null?void 0:t.states)!=null&&n[e.entity])?t.states[e.entity].state:""}static hasChanged(e,t){return JSON.stringify(e)!==JSON.stringify(t)}static getSchema(){let e={type:"object",properties:{action:{type:"string",enum:Object.values(x),default:x.NONE},service:{type:"string"},navigation_path:{type:"string"},url_path:{type:"string"}}},t={type:"object",properties:{action:{type:"string",enum:Ie,default:"none"}}},i={type:"array",items:{type:"object",properties:{type:{type:"string"}}}},o={type:"object",properties:{cards:i}},a={type:"object",properties:{condition:{type:"string",enum:ot},entity:{type:"string",description:"Entity referenced by state-based visibility conditions."},attribute:{type:"string",description:"Optional entity attribute used instead of the primary state."},state:{type:["string","array"],description:"Allowed state or list of allowed states.",items:{type:"string"}},state_not:{type:["string","array"],description:"Blocked state or list of blocked states.",items:{type:"string"}},above:{type:"number",description:"Numeric lower bound (exclusive)."},below:{type:"number",description:"Numeric upper bound (exclusive)."},users:{type:"array",description:"Allowed user names or ids.",items:{type:"string"}},is_admin:{type:"boolean",description:"Require current user to be an admin."},is_owner:{type:"boolean",description:"Require current user to be the owner."},after:{type:"string",description:"Show only after the given HH:MM time."},before:{type:"string",description:"Show only before the given HH:MM time."},weekday:{type:"array",description:"Allowed weekdays.",items:{type:"string",enum:Re}},media_query:{type:"string",description:"CSS media query matched against the current viewport."},min_width:{type:"number",description:"Minimum viewport width in pixels."},max_width:{type:"number",description:"Maximum viewport width in pixels."}}};a.properties.conditions={type:"array",description:"Nested logical conditions for and/or/not groups.",items:a};let s={type:"object",properties:{background:{type:["string","number"]},color:{type:["string","number"]},border:{type:["string","number"]},class:{type:["string","array"],items:{type:"string"}}}},l={type:"object",properties:{value:{type:"number"},color:{type:"string"}}},c={type:"object",properties:{type:{type:"string",enum:Ne,default:$.STATE},entity:{type:"string"},attribute:{type:"string"},icon:{type:"string"},color:{type:"string"},value:{type:["string","number"]},label:{type:"string"},unit:{type:"string"},min:{type:"number"},max:{type:"number"},icon_only:{type:"boolean",default:!1},show_name:{type:"boolean",default:!1},show_progress:{type:"boolean",default:!1},precision:{type:"number",minimum:0,maximum:h.BADGE_MAX_PRECISION},format:{type:"string",enum:De,default:at.NONE},entities:{type:"array",items:{type:"string"}},domain:{type:"string"},state:{type:"string"},count_state:{type:"string"},thresholds:{type:"array",items:l},visibility:{type:"array",items:{type:"object",properties:{operator:{type:"string",enum:G,default:he.EQUALS},value:{type:["string","number","boolean"]},entity:{type:"string"},attribute:{type:"string"}}}},color_rules:{type:"array",items:{type:"object",properties:{operator:{type:"string",enum:G,default:he.EQUALS},value:{type:["string","number","boolean"]},entity:{type:"string"},attribute:{type:"string"},color:{type:"string"}}}},tap_action:e,icon_tap_action:e}},m={type:"object",properties:{enabled:{type:"boolean",default:u.swipe_enabled},direction:{type:"string",enum:He,default:u.swipe_direction},threshold:{type:"number",minimum:0,maximum:h.SWIPE_MAX_THRESHOLD_PX,default:u.swipe_threshold},velocityThreshold:{type:"number",minimum:0,maximum:h.SWIPE_MAX_VELOCITY_THRESHOLD,default:u.swipe_velocity_threshold},preventScroll:{type:"boolean",default:u.swipe_prevent_scroll},left:t,right:t,up:t,down:t}};return{type:"object",properties:{config_version:{type:"number",minimum:Be,maximum:T,default:T,description:"Config contract version. Legacy configs are migrated to the current version during normalize()."},card_id:{type:"string",description:"Stable identifier for cross-card control and persisted mode state."},title:{type:"string",description:"Primary card title."},subtitle:{type:"string",description:"Optional secondary title shown in the header."},icon:{type:"string",description:"Header icon in mdi format."},icon_color:{type:"string",description:"Optional CSS color value for the primary header icon."},entity:{type:"string",description:"Primary Home Assistant entity bound to the card."},attribute:{type:"string",description:"Optional root attribute used by state_styles and other state-aware features."},body_mode:{type:"string",enum:we,default:E.EXPAND,description:"Presentation mode used for the body region."},expand_trigger:{type:"string",enum:Te,default:u.expand_trigger,description:"Header gesture that toggles body expansion by default."},theme:{type:"string",enum:Object.values(J),default:u.theme,description:"Theme preset applied to the card shell."},padding:{type:"string",default:u.padding,description:"Internal card padding."},border_radius:{type:"string",default:u.border_radius,description:"Border radius applied to the card shell."},expanded:{type:"boolean",default:!1,description:"Whether the card starts expanded."},animation:{type:"boolean",default:!0,description:"Master switch for card animations."},animation_duration:{type:"number",minimum:0,maximum:h.ANIMATION_DURATION_MAX_MS,default:u.animation_duration,description:"Base animation duration applied to body and nested cards."},expand_animation:{type:"string",enum:Me,default:u.expand_animation,description:"Body expand animation variant."},collapse_animation:{type:"string",enum:Le,default:u.collapse_animation,description:"Body collapse animation variant."},cards_animation:{type:"string",enum:Pe,default:u.cards_animation,description:"Nested card reveal animation variant."},cards_stagger:{type:"number",minimum:0,maximum:h.CARDS_STAGGER_MAX_MS,default:u.cards_stagger,description:"Delay between nested card reveal steps in milliseconds."},cards_direction:{type:"string",enum:Oe,default:u.cards_direction,description:"Ordering strategy for nested card reveal."},stability_mode:{type:"boolean",default:!1,description:"Disables high-risk effects for predictable rendering."},lazy_load:{type:"boolean",default:!0,description:"Enables progressive body card loading."},lazy_initial_batch:{type:"number",minimum:h.LAZY_MIN_BATCH,maximum:h.LAZY_MAX_BATCH,default:u.lazy_initial_batch,description:"Initial number of cards to load before idle batching."},lazy_batch_size:{type:"number",minimum:h.LAZY_MIN_BATCH,maximum:h.LAZY_MAX_BATCH,default:u.lazy_batch_size,description:"Number of cards added on each idle lazy-load pass."},lazy_idle_timeout:{type:"number",minimum:h.LAZY_MIN_TIMEOUT_MS,maximum:h.LAZY_MAX_TIMEOUT_MS,default:u.lazy_idle_timeout,description:"Idle callback timeout used for deferred body work."},auto_collapse_after:{type:"number",minimum:0,maximum:h.AUTO_COLLAPSE_MAX_SECONDS,default:u.auto_collapse_after,description:"Automatically collapse the card after N seconds. Set 0 to disable."},remember_expanded_state:{type:"boolean",default:u.remember_expanded_state,description:"Persist expanded/collapsed state across renders."},remember_mode_state:{type:"boolean",default:u.remember_mode_state,description:"Persist active tab and slide indices across renders."},enable_card_pool:{type:"boolean",default:u.enable_card_pool,description:"Reuse detached body card elements to reduce churn."},pool_scope:{type:"string",enum:ke,default:u.pool_scope,description:"Reuse scope for pooled body card elements."},pool_ttl_ms:{type:"number",minimum:h.POOL_MIN_TTL_MS,maximum:h.POOL_MAX_TTL_MS,default:u.pool_ttl_ms,description:"Time-to-live for pooled body card instances."},pool_max_entries:{type:"number",minimum:h.POOL_MIN_MAX_ENTRIES,maximum:h.POOL_MAX_MAX_ENTRIES,default:u.pool_max_entries,description:"Maximum pooled entries retained for a reuse scope."},show_expand_icon:{type:"boolean",default:u.show_expand_icon,description:"Show the expand/collapse affordance in the header."},expand_icon:{type:"string",default:u.expand_icon,description:"Icon used for the expand affordance."},sticky_header:{type:"boolean",default:!1,description:"Keep the header pinned while the body scrolls."},grid:{type:"object",properties:{columns:{type:["number","string"],minimum:h.MIN_GRID_COLUMNS,maximum:h.MAX_GRID_COLUMNS,default:u.grid_columns,description:"Column count or CSS grid-template-columns string."},gap:{type:"string",default:u.grid_gap,description:"Gap between grid items."}}},modal:{type:"object",description:"Modal body mode sizing and overlay behavior.",properties:{width:{type:"string",default:u.modal_width,description:"Modal width. Use CSS lengths or auto."},height:{type:"string",default:u.modal_height,description:"Modal height. Use CSS lengths or auto."},max_width:{type:"string",default:u.modal_max_width,description:"Maximum width cap applied to the modal dialog."},max_height:{type:"string",default:u.modal_max_height,description:"Maximum height cap applied to the modal dialog."},loading_strategy:{type:"string",enum:pe,default:u.modal_loading_strategy,description:"Modal content loading strategy."},backdrop_blur:{type:"boolean",default:!0},backdrop_color:{type:"string",default:u.backdrop_color},close_on_backdrop:{type:"boolean",default:!0},close_on_escape:{type:"boolean",default:!0},show_close:{type:"boolean",default:!0}}},fullscreen:{type:"object",description:"Fullscreen body mode sizing and overlay behavior.",properties:{width:{type:"string",default:u.fullscreen_width},height:{type:"string",default:u.fullscreen_height},max_width:{type:"string",default:u.fullscreen_max_width},max_height:{type:"string",default:u.fullscreen_max_height},padding:{type:"string",default:u.fullscreen_padding},background:{type:"string",default:u.fullscreen_background},show_close:{type:"boolean",default:!0},close_on_escape:{type:"boolean",default:!0}}},header:{type:"object",description:"Header region configuration.",properties:{cards:i,sticky:{type:"boolean",default:!1},clickable:{type:"boolean",default:!0},layout:{type:"object",properties:{variant:{type:"string",enum:de,default:u.header_layout_variant},gap:{type:"string",default:u.header_gap},content_gap:{type:"string",default:u.header_content_gap},align:{type:"string",enum:le,default:u.header_content_align},badges_position:{type:"string",enum:ue,default:u.header_badges_position}}}}},header_left:{...o,description:"Cards rendered in the left header slot."},header_right:{...o,description:"Cards rendered in the right header slot."},body:{...o,description:"Body region configuration."},footer:{...o,description:"Footer region configuration."},tabs:{type:"array",description:"Tab definitions used by tabs body mode.",items:{type:"object",properties:{label:{type:"string"},icon:{type:"string"},cards:i}}},tabs_config:{type:"object",description:"Tabs body mode UI controls.",properties:{position:{type:"string",default:"top"},show_icons:{type:"boolean",default:!0},show_labels:{type:"boolean",default:!0},content_padding:{type:"string",default:u.tabs_content_padding},tab_min_width:{type:"string",default:u.tabs_tab_min_width},tab_alignment:{type:"string",enum:se,default:u.tabs_tab_alignment}}},carousel_options:{type:"object",description:"Carousel body mode layout and control options.",properties:{show_arrows:{type:"boolean",default:u.carousel_show_arrows},show_indicators:{type:"boolean",default:u.carousel_show_indicators},loop:{type:"boolean",default:u.carousel_loop},swipe_threshold:{type:"number",minimum:0,maximum:h.SWIPE_MAX_THRESHOLD_PX,default:u.swipe_threshold},height:{type:"string",default:u.carousel_height}}},subview:{type:"object",description:"Subview navigation settings used by subview body mode.",properties:{path:{type:"string"},navigation_path:{type:"string"},replace_state:{type:"boolean",default:!1},return_on_close:{type:"boolean",default:!1}}},carousel_autoplay:{type:"boolean",default:u.carousel_autoplay,description:"Automatically advance slides in carousel mode."},carousel_interval:{type:"number",minimum:h.CAROUSEL_MIN_INTERVAL_MS,maximum:h.CAROUSEL_MAX_INTERVAL_MS,default:u.carousel_interval,description:"Delay between autoplay slide changes in carousel mode."},tap_action:{...e,description:"Action executed on tap."},hold_action:{...e,description:"Action executed on hold."},double_tap_action:{...e,description:"Action executed on double tap."},visibility:{type:"array",description:"Top-level card visibility conditions.",items:a},section_visibility:{type:"object",description:"Per-section visibility conditions for header/body/footer.",properties:{header:{type:"array",items:a},body:{type:"array",items:a},footer:{type:"array",items:a}}},swipe:{...m,description:"Gesture handling for top-level card swipes."},badges:{type:"array",description:"Header badge definitions.",items:c},state_styles:{type:"object",description:"Map of states or numeric matchers to style overrides applied to the card shell.",additionalProperties:s},theme_tokens:{type:"object",description:"CSS variable overrides applied after theme resolution.",additionalProperties:{type:"string"}},custom_css:{type:["string","object","array"],description:"Scoped custom CSS definitions."}}}}static _validateCustomCSS(e,t){if(typeof e=="string")return;if(Array.isArray(e)){e.forEach((o,a)=>{this._validateCustomCSS(o,`${t}[${a}]`)});return}if(!f(e))throw new d("custom_css must be a string, object, or array",t);if(["css","scope","mode","priority","id"].some(o=>o in e)){if(e.css!==void 0&&typeof e.css!="string")throw new d("custom_css.css must be a string",`${t}.css`);if(e.scope!==void 0&&typeof e.scope!="string")throw new d("custom_css.scope must be a string",`${t}.scope`);return}Object.entries(e).forEach(([o,a])=>{if(typeof a!="string")throw new d("custom_css scoped values must be strings",`${t}.${o}`)})}};function st(r,e=100,t={}){let{leading:n=!1,trailing:i=!0}=t,o=null,a=null,s=null,l,c=null;function m(w){let P=a,Z=s;return P&&(a=null,s=null,c=w,l=r.apply(Z,P)),l}function b(w){let P=c===null?e:w-c;return c===null||P>=e}function _(){let w=Date.now();return b(w)?y(w):(o=setTimeout(_,e-(w-c)),l)}function y(w){return o=null,i&&a?m(w):(a=null,s=null,l)}function S(w){return c=w,o=setTimeout(_,e),n?m(w):l}function k(...w){let P=Date.now(),Z=b(P);return a=w,s=this,Z&&o===null?S(P):(o===null&&(o=setTimeout(_,e)),l)}return k.cancel=function(){o!==null&&clearTimeout(o),a=null,s=null,c=null,o=null},k.flush=function(){return o!==null?y(Date.now()):l},k.pending=function(){return o!==null},k}function Ue(r,e=16,t={}){let{leading:n=!0,trailing:i=!0}=t,o=0,a=null,s=null,l=null;function c(){let b=s,_=l;if(b)return s=null,l=null,o=Date.now(),r.apply(_,b)}function m(...b){let y=Date.now()-o;if(s=b,l=this,y>=e&&(a!==null&&(clearTimeout(a),a=null),n))return c();if(a===null&&i){let S=e-y;a=setTimeout(()=>{a=null,c()},S>0?S:0)}}return m.cancel=function(){a!==null&&(clearTimeout(a),a=null),o=0,s=null,l=null},m}function zt(r,e={}){let{timeout:t=1e3}=e;return"requestIdleCallback"in window?window.requestIdleCallback(r,{timeout:t}):setTimeout(r,1)}function Vt(r){"cancelIdleCallback"in window?window.cancelIdleCallback(r):clearTimeout(r)}var dt=class{constructor(){this._cards=new Set,this._cardsById=new Map,this._listening=!1,this._boundControlHandler=this._handleControl.bind(this),this._boundResizeHandler=Ue(()=>this._handleResize(),h.RESIZE_DEBOUNCE_MS)}register(e){var t;!e||this._cards.has(e)||(this._cards.add(e),this._indexCard(e,(t=e._config)==null?void 0:t.card_id),this._listening||this._attachListeners())}unregister(e){var t;!e||!this._cards.has(e)||(this._cards.delete(e),this._deindexCard(e,(t=e._config)==null?void 0:t.card_id),this._cards.size===0&&this._detachListeners())}updateCardId(e,t,n){!e||!this._cards.has(e)||t===n||(this._deindexCard(e,t),this._indexCard(e,n))}_attachListeners(){window.addEventListener(Y.CARD_CONTROL,this._boundControlHandler),window.addEventListener("resize",this._boundResizeHandler),this._listening=!0}_detachListeners(){this._listening&&(window.removeEventListener(Y.CARD_CONTROL,this._boundControlHandler),window.removeEventListener("resize",this._boundResizeHandler),typeof this._boundResizeHandler.cancel=="function"&&this._boundResizeHandler.cancel(),this._listening=!1)}_handleControl(e){var n;let t=(n=e==null?void 0:e.detail)==null?void 0:n.card_id;if(t){let i=this._cardsById.get(t);if(!i)return;i.forEach(o=>{o!=null&&o.isConnected&&o._handleExternalControl(e)});return}this._cards.forEach(i=>{i!=null&&i.isConnected&&i._handleExternalControl(e)})}_handleResize(){this._cards.forEach(e=>{e!=null&&e.isConnected&&typeof e._resizeHandler=="function"&&e._resizeHandler()})}_indexCard(e,t){if(!t)return;let n=this._cardsById.get(t);n||(n=new Set,this._cardsById.set(t,n)),n.add(e)}_deindexCard(e,t){if(!t)return;let n=this._cardsById.get(t);n&&(n.delete(e),n.size===0&&this._cardsById.delete(t))}},lt=class{constructor(){this._cache=new Map,this._dirty=new Map,this._flushTimer=null,this._flushDelayMs=200}get(e,t=null){if(!e)return t;if(this._cache.has(e))return this._cache.get(e);let n=t;try{let i=localStorage.getItem(e);i!==null&&(n=JSON.parse(i))}catch(i){n=t}return this._cache.set(e,n),n}set(e,t){e&&(this._cache.set(e,t),this._dirty.set(e,t),this._scheduleFlush())}_scheduleFlush(){this._flushTimer===null&&(this._flushTimer=setTimeout(()=>{this._flush()},this._flushDelayMs))}_flush(){this._flushTimer=null,this._dirty.size!==0&&(this._dirty.forEach((e,t)=>{try{localStorage.setItem(t,JSON.stringify(e))}catch(n){}}),this._dirty.clear())}},ct=class{constructor(){this._entries=new Map,this._defaultMaxEntries=h.CARD_POOL_MAX_ENTRIES,this._defaultMaxAgeMs=h.CARD_POOL_MAX_AGE_MS,this._hardMaxEntries=Math.max(this._defaultMaxEntries,h.CARD_POOL_HARD_MAX_ENTRIES||this._defaultMaxEntries),this._hits=0,this._misses=0}acquire(e){if(!e)return null;this._pruneExpired();let t=this._entries.get(e);if(!t)return this._misses+=1,null;this._entries.delete(e);let n=t.cards.filter(i=>i instanceof HTMLElement);return n.length===0?(this._misses+=1,null):(this._hits+=1,n)}release(e,t,n={}){if(!e||!Array.isArray(t)||t.length===0)return;this._pruneExpired();let i=t.filter(l=>l instanceof HTMLElement);if(i.length===0)return;i.forEach(l=>{l.parentElement&&l.parentElement.removeChild(l)});let o=this._normalizeScope(n.scope),a=this._normalizeNumber(n.maxAgeMs,this._defaultMaxAgeMs,h.POOL_MIN_TTL_MS,h.POOL_MAX_TTL_MS),s=this._normalizeNumber(n.maxEntries,this._defaultMaxEntries,h.POOL_MIN_MAX_ENTRIES,h.POOL_MAX_MAX_ENTRIES);this._entries.delete(e),this._entries.set(e,{cards:i,timestamp:Date.now(),scope:o,maxAgeMs:a,maxEntries:s}),this._pruneToScopeLimit(o,s),this._pruneToHardLimit()}invalidate(e){e&&this._entries.delete(e)}clear(){this._entries.clear()}getStats(){let e={};return this._entries.forEach(t=>{let n=(t==null?void 0:t.scope)||"card";e[n]=(e[n]||0)+1}),{size:this._entries.size,hits:this._hits,misses:this._misses,byScope:e}}_pruneExpired(){let e=Date.now();this._entries.forEach((t,n)=>{let i=this._normalizeNumber(t==null?void 0:t.maxAgeMs,this._defaultMaxAgeMs,h.POOL_MIN_TTL_MS,h.POOL_MAX_TTL_MS);(!t||e-t.timestamp>i)&&this._entries.delete(n)})}_pruneToHardLimit(){for(;this._entries.size>this._hardMaxEntries;){let e=this._entries.keys().next().value;if(!e)break;this._entries.delete(e)}}_pruneToScopeLimit(e,t){if(!e||!Number.isFinite(t))return;let n=0;for(this._entries.forEach(i=>{((i==null?void 0:i.scope)||"card")===e&&(n+=1)});n>t;){let i=this._findOldestKeyByScope(e);if(!i)break;this._entries.delete(i),n-=1}}_findOldestKeyByScope(e){for(let[t,n]of this._entries.entries())if(((n==null?void 0:n.scope)||"card")===e)return t;return null}_normalizeScope(e){return e==="dashboard"||e==="global"?e:"card"}_normalizeNumber(e,t,n,i){let o=Number(e);if(!Number.isFinite(o))return t;let a=Math.floor(o);return Math.min(i,Math.max(n,a))}},ut=class{constructor(){this._metrics=new Map,this._budgets={tti:_e.TTI_MS,render:_e.RENDER_MS,update:_e.UPDATE_MS,body_load:_e.BODY_LOAD_MS},this._historyLimit=h.METRICS_HISTORY_SIZE}record(e,t,n={}){if(!e||!Number.isFinite(t))return;let i=this._ensureBucket(e),o={type:e,durationMs:t,timestamp:Date.now(),...n};i.push(o),i.length>this._historyLimit&&i.shift();let a=this._budgets[e];Number.isFinite(a)&&t>a&&console.warn(`[UniversalCard][perf] ${e} ${t.toFixed(1)}ms > ${a}ms`,n);try{window.dispatchEvent(new CustomEvent("universal-card-performance",{detail:o}))}catch(s){}}getStats(e){let t=this._metrics.get(e)||[];if(t.length===0)return{count:0,min:0,max:0,avg:0,samples:[]};let n=1/0,i=0,o=0;return t.forEach(a=>{let s=a.durationMs;n=Math.min(n,s),i=Math.max(i,s),o+=s}),{count:t.length,min:n,max:i,avg:o/t.length,samples:[...t]}}snapshot(){let e={};return this._metrics.forEach((t,n)=>{e[n]=this.getStats(n)}),e}_ensureBucket(e){let t=this._metrics.get(e);return t||(t=[],this._metrics.set(e,t)),t}},$e=new dt,me=new lt,R=new ct,ze=new ut;var Tn={APPEND:"append",PREPEND:"prepend",REPLACE:"replace"},K={CARD:"card",HEADER:"header",BODY:"body",FOOTER:"footer",GLOBAL:"global"},kn={enabled:!0,sanitize:!0,allowVariables:!0,allowAnimations:!0,maxLength:5e4,blockedProperties:["behavior","expression","-moz-binding"],blockedSelectors:["body","html",":root","head","script"]},Ve=class{constructor(e,t={}){this._shadowRoot=e,this._config={...kn,...t},this._styles=new Map,this._styleElement=null,this._init()}_init(){this._styleElement=document.createElement("style"),this._styleElement.setAttribute("data-custom-css","true"),this._shadowRoot.appendChild(this._styleElement)}add(e,t,n={}){if(!this._config.enabled)return!1;let{scope:i=K.CARD,mode:o=Tn.APPEND,priority:a=0}=n;if(!t||typeof t!="string")return console.warn("[CustomCSS] Invalid CSS"),!1;if(t.length>this._config.maxLength)return console.warn("[CustomCSS] CSS exceeds maximum length"),!1;let s=t;return this._config.sanitize&&(s=this._sanitize(t),!s)?(console.warn("[CustomCSS] CSS failed sanitization"),!1):(s=this._addScopePrefix(s,i),this._styles.set(e,{css:s,originalCSS:t,scope:i,mode:o,priority:a,enabled:!0}),this._updateStyles(),!0)}remove(e){let t=this._styles.delete(e);return t&&this._updateStyles(),t}enable(e){let t=this._styles.get(e);t&&(t.enabled=!0,this._updateStyles())}disable(e){let t=this._styles.get(e);t&&(t.enabled=!1,this._updateStyles())}update(e,t){let n=this._styles.get(e);return n?this.add(e,t,{scope:n.scope,mode:n.mode,priority:n.priority}):!1}_sanitize(e){let t=e;t=t.replace(/\/\*[\s\S]*?\*\//g,"");for(let n of this._config.blockedProperties)if(new RegExp(`${n}\\s*:`,"gi").test(t))return console.warn(`[CustomCSS] Blocked property detected: ${n}`),null;for(let n of this._config.blockedSelectors)if(new RegExp(`(^|[{},\\s])${n}[\\s{,]`,"gi").test(t))return console.warn(`[CustomCSS] Blocked selector detected: ${n}`),null;return/url\s*\(\s*['"]?\s*javascript:/gi.test(t)?(console.warn("[CustomCSS] JavaScript URL detected"),null):(/@import/gi.test(t)&&(console.warn("[CustomCSS] @import is not allowed"),t=t.replace(/@import[^;]*;/gi,"")),this._config.allowAnimations||(t=t.replace(/animation[^;]*;/gi,""),t=t.replace(/transition[^;]*;/gi,"")),t)}_addScopePrefix(e,t){if(t===K.GLOBAL)return e;let i={[K.CARD]:":host",[K.HEADER]:".uc-header",[K.BODY]:".uc-body",[K.FOOTER]:".uc-footer"}[t]||"";return i?e.replace(/([^{}]+)(\{[^}]*\})/g,(o,a,s)=>`${a.split(",").map(c=>(c=c.trim(),c.startsWith(":host")||c.startsWith(i)?c:i===":host"?`:host ${c}`:`${i} ${c}`)).join(", ")} ${s}`):e}_updateStyles(){if(!this._styleElement)return;let t=Array.from(this._styles.values()).filter(n=>n.enabled).sort((n,i)=>n.priority-i.priority).map(n=>n.css).join(`

`);this._styleElement.textContent=t}applyFromConfig(e){for(let t of this._styles.keys())t.startsWith("config-")&&this._styles.delete(t);if(!e){this._updateStyles();return}if(typeof e=="string"){this.add("config-main",e);return}if(Array.isArray(e)){e.forEach((t,n)=>{if(typeof t=="string")this.add(`config-${n}`,t);else if(t&&typeof t=="object"){let i=t;typeof i.css=="string"&&this.add(`config-${i.id||n}`,i.css,i)}});return}if(e&&typeof e=="object"){let t=e;for(let[n,i]of Object.entries(t))if(K[n.toUpperCase()]&&typeof i=="string")this.add(`config-${n}`,i,{scope:n});else{let o=e;typeof o.css=="string"&&this.add(`config-${o.id||"main"}`,o.css,o);break}}}setVariable(e,t){if(!this._config.allowVariables)return;let i=`:host { ${e.startsWith("--")?e:`--${e}`}: ${t}; }`;this.add(`var-${e}`,i,{priority:-1})}setVariables(e){for(let[t,n]of Object.entries(e))this.setVariable(t,n)}getStyles(){return Array.from(this._styles.entries()).map(([e,t])=>({id:e,...t}))}clear(){this._styles.clear(),this._styleElement&&(this._styleElement.textContent="")}destroy(){this.clear(),this._styleElement&&(this._styleElement.remove(),this._styleElement=null)}static fromObject(e){let t=[];for(let[n,i]of Object.entries(e)){let o=Object.entries(i).map(([a,s])=>`  ${a.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${s};`).join(`
`);t.push(`${n} {
${o}
}`)}return t.join(`

`)}static get helpers(){return{hide:e=>`${e} { display: none !important; }`,color:(e,t)=>`${e} { color: ${t} !important; }`,background:(e,t)=>`${e} { background: ${t} !important; }`,padding:(e,t)=>`${e} { padding: ${t} !important; }`,border:(e,t)=>`${e} { border: ${t} !important; }`,fontSize:(e,t)=>`${e} { font-size: ${t} !important; }`,borderRadius:(e,t)=>`${e} { border-radius: ${t} !important; }`,shadow:(e,t)=>`${e} { box-shadow: ${t} !important; }`,fadeIn:(e,t="0.3s")=>`
        ${e} {
          animation: uc-custom-fade-in ${t} ease;
        }
        @keyframes uc-custom-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,gradient:(e,t,n,i="to bottom")=>`${e} { background: linear-gradient(${i}, ${t}, ${n}) !important; }`}}};var g=Object.freeze({BEFORE_INIT:"beforeInit",AFTER_INIT:"afterInit",BEFORE_RENDER:"beforeRender",AFTER_RENDER:"afterRender",BEFORE_UPDATE:"beforeUpdate",AFTER_UPDATE:"afterUpdate",BEFORE_DESTROY:"beforeDestroy",CONFIG_VALIDATE:"configValidate",CONFIG_TRANSFORM:"configTransform",STATE_CHANGE:"stateChange",HASS_UPDATE:"hassUpdate",HEADER_RENDER:"headerRender",BODY_RENDER:"bodyRender",FOOTER_RENDER:"footerRender",ACTION_EXECUTE:"actionExecute",CLICK:"click",HOLD:"hold",CUSTOM:"custom"}),Ft=2,Fe=Object.freeze({BEFORE_INIT:g.BEFORE_INIT,AFTER_INIT:g.AFTER_INIT,BEFORE_RENDER:g.BEFORE_RENDER,AFTER_RENDER:g.AFTER_RENDER,BEFORE_UPDATE:g.BEFORE_UPDATE,AFTER_UPDATE:g.AFTER_UPDATE,BEFORE_DESTROY:g.BEFORE_DESTROY,CONFIG_TRANSFORM:g.CONFIG_TRANSFORM,CONFIG_VALIDATE:g.CONFIG_VALIDATE,STATE_CHANGE:g.STATE_CHANGE,HASS_UPDATE:g.HASS_UPDATE,HEADER_RENDER:g.HEADER_RENDER,BODY_RENDER:g.BODY_RENDER,FOOTER_RENDER:g.FOOTER_RENDER,ACTION_EXECUTE:g.ACTION_EXECUTE,CLICK:g.CLICK,HOLD:g.HOLD}),fe=Object.freeze({HIGHEST:0,HIGH:25,NORMAL:50,LOW:75,LOWEST:100}),pt=class{constructor(){this._plugins=new Map,this._hooks=new Map,this._enabled=!0,this._logger=null,this._initHooks()}_initHooks(){for(let e of Object.values(g))this._hooks.set(e,[])}setLogger(e){this._logger=e}register(e){if(!this._validatePlugin(e))return console.error("[PluginSystem] Invalid plugin:",e),!1;let t=this._normalizePlugin(e),{id:n,name:i,version:o,hooks:a,init:s,destroy:l}=t;if(this._plugins.has(n)&&(console.warn(`[PluginSystem] Plugin "${n}" already registered, updating...`),this.unregister(n)),this._plugins.set(n,{id:n,name:i||n,version:o||"1.0.0",hooks:a||{},init:s,destroy:l,enabled:!0,context:{}}),this._registerHooks(n,a||{}),s)try{s.call(this._plugins.get(n).context)}catch(c){console.error(`[PluginSystem] Error initializing plugin "${n}":`,c)}return this._log("info",`Plugin registered: ${i||n} v${o||"1.0.0"}`),!0}_validatePlugin(e){return!(!e||typeof e!="object"||!("id"in e)||typeof e.id!="string")}_normalizePlugin(e){let t={};for(let[n,i]of Object.entries(e.hooks||{})){if(typeof i=="function"){t[n]=i;continue}let o=i.handler;i.priority!=null&&(o.priority=i.priority),t[n]=o}return{id:e.id,name:e.name||e.id,version:e.version||"1.0.0",description:e.description||"",author:e.author||"",hooks:t,init:e.init,destroy:e.destroy}}_registerHooks(e,t={}){var n,i;for(let[o,a]of Object.entries(t)){this._hooks.has(o)||this._hooks.set(o,[]);let s={pluginId:e,handler:a,priority:a.priority!=null?a.priority:fe.NORMAL};(n=this._hooks.get(o))==null||n.push(s),(i=this._hooks.get(o))==null||i.sort((l,c)=>l.priority-c.priority)}}unregister(e){let t=this._plugins.get(e);if(!t)return!1;if(t.destroy)try{t.destroy.call(t.context)}catch(n){console.error(`[PluginSystem] Error destroying plugin "${e}":`,n)}for(let n of this._hooks.values()){let i=n.findIndex(o=>o.pluginId===e);i!==-1&&n.splice(i,1)}return this._plugins.delete(e),this._log("info",`Plugin unregistered: ${e}`),!0}enable(e){let t=this._plugins.get(e);t&&(t.enabled=!0)}disable(e){let t=this._plugins.get(e);t&&(t.enabled=!1)}async executeHook(e,t={},n={}){if(!this._enabled)return t;let i=this._hooks.get(e);if(!i||i.length===0)return t;let o={...t};for(let{pluginId:a,handler:s}of i){let l=this._plugins.get(a);if(!(!l||!l.enabled))try{let c=await s.call(l.context,o,n);if(c&&typeof c=="object"&&(o={...o,...c}),c===!1){this._log("debug",`Hook "${e}" chain stopped by plugin "${a}"`);break}}catch(c){let m=c instanceof Error?c.message:String(c);console.error(`[PluginSystem] Error in hook "${e}" (plugin: ${a}):`,c),this._log("error",`Hook error: ${e} (${a}): ${m}`)}}return o}executeHookSync(e,t={},n={}){if(!this._enabled)return t;let i=this._hooks.get(e);if(!i||i.length===0)return t;let o={...t};for(let{pluginId:a,handler:s}of i){let l=this._plugins.get(a);if(!(!l||!l.enabled))try{let c=s.call(l.context,o,n);if(c&&typeof c=="object"&&(o={...o,...c}),c===!1)break}catch(c){console.error(`[PluginSystem] Error in hook "${e}" (plugin: ${a}):`,c)}}return o}getPlugins(){return Array.from(this._plugins.values()).map(e=>({id:e.id,name:e.name,version:e.version,enabled:e.enabled}))}getPlugin(e){return this._plugins.get(e)||null}hasPlugin(e){return this._plugins.has(e)}enableSystem(){this._enabled=!0}disableSystem(){this._enabled=!1}_log(e,t){this._logger&&this._logger.log(e,"plugin",t)}destroy(){for(let e of this._plugins.keys())this.unregister(e);this._hooks.clear(),this._enabled=!1}},ht=null;function je(){return ht||(ht=new pt),ht}function _t(r){let e={};for(let[t,n]of Object.entries(r.hooks||{})){if(typeof n=="function"){e[t]=n;continue}let i=n.handler;n.priority!=null&&(i.priority=n.priority),e[t]=i}return{id:r.id,name:r.name||r.id,version:r.version||"1.0.0",description:r.description||"",author:r.author||"",hooks:e,init:r.init,destroy:r.destroy}}var Li=_t({id:"example-plugin",name:"Example Plugin",version:"1.0.0",description:"\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043F\u043B\u0430\u0433\u0438\u043D",hooks:{[g.AFTER_INIT]:function(r){return console.log("[ExamplePlugin] Card initialized!"),r},[g.CONFIG_TRANSFORM]:function(r){return r}},init(){console.log("[ExamplePlugin] Plugin initialized")},destroy(){console.log("[ExamplePlugin] Plugin destroyed")}});var jt=()=>{};function Gt(r){return new Error(`[ProviderContext] ${r}`)}function ge(r){return typeof r=="function"}function be(r){return!!r&&typeof r=="object"&&!Array.isArray(r)}function Xt(r,e){if(!be(e))return null;let t=be(e.attributes)?e.attributes:{},n=typeof e.state=="string"?e.state:"";return{...e,entity_id:typeof e.entity_id=="string"?e.entity_id:void 0,state:n,attributes:t}}function Mn(r){return be(r)?Object.fromEntries(Object.entries(r).map(([e,t])=>[e,Xt(e,t)]).filter(([,e])=>e!==null)):{}}function Ln(r){if(r instanceof Date&&!Number.isNaN(r.getTime()))return r;if(typeof r=="string"||typeof r=="number"){let e=new Date(r);if(!Number.isNaN(e.getTime()))return e}return new Date}function Pn(r){var t,n;let e=(n=(t=r.notification_id)!=null?t:r.id)!=null?n:`notification-${Date.now()}`;return{id:String(e),title:typeof r.title=="string"?r.title:"",message:typeof r.message=="string"?r.message:"",created_at:Ln(r.created_at),source:"persistent_notification",dismissible:!0,raw:r}}function On(r){var t;let e=(t=r==null?void 0:r.data)==null?void 0:t.entity_id;return typeof e=="string"&&e.startsWith("persistent_notification.")}function Rn(r){var e;return((e=r==null?void 0:r.data)==null?void 0:e.domain)==="persistent_notification"}async function Hn(r){let e=await r;return ge(e)?e:jt}function In(r){if(ge(r))return r;if(ge(globalThis.fetch))return globalThis.fetch.bind(globalThis);throw Gt("HTTP provider is unavailable because fetch is not defined.")}function Ge(r){return!!r&&typeof r=="object"&&r.__universalCardProviderContext===!0}function Nn(r,e={}){if(Ge(r))return r;let t=r!=null?r:null,n=In(e.fetcher),i=s=>{let l=t,c=l==null?void 0:l[s];if(!ge(c))throw Gt(`Home Assistant provider method "${String(s)}" is unavailable.`);return c.bind(l)},o={async call(s){return i("callWS")(s)},async subscribe(s,l){var m;let c=(m=t==null?void 0:t.connection)==null?void 0:m.subscribeEvents;return ge(c)?Hn(c.call(t==null?void 0:t.connection,s,l)):jt}},a={__universalCardProviderContext:!0,setHass(s){t=s!=null?s:null},getHass(){return t},entities:{getState(s){var c;if(!s)return null;let l=(c=t==null?void 0:t.states)==null?void 0:c[s];return Xt(s,l)},getStates(){return Mn(t==null?void 0:t.states)}},services:{async call(s,l,c,m){return i("callService")(s,l,c||{},m)}},api:{async call(s,l,c){return i("callApi")(s,l,c||{})}},websocket:o,http:{async request(s,l){return n(s,l)}},notifications:{async list(){let s=await o.call({type:"persistent_notification/get"});return be(s)?Object.values(s).filter(be).map(l=>Pn(l)):[]},async dismiss(s){await a.services.call("persistent_notification","dismiss",{notification_id:s})},async subscribe(s){let l=await Promise.all([o.subscribe(c=>{On(c)&&s({reason:"state_changed",event:c})},"state_changed"),o.subscribe(c=>{Rn(c)&&s({reason:"call_service",event:c})},"call_service"),o.subscribe(c=>{s({reason:"persistent_notifications_updated",event:c})},"persistent_notifications_updated")]);return()=>{l.forEach(c=>{try{c()}catch(m){console.warn("[ProviderContext] Failed to unsubscribe notification stream:",m)}})}}}};return a}function q(r,e={}){return Ge(r)?r:Nn(r,e)}function Yt(r){return!!(r&&typeof r=="object"&&!Array.isArray(r))}function H(r){return(r==null?void 0:r.stop)===!0||(r==null?void 0:r.preventDefault)===!0||(r==null?void 0:r.handled)===!0}function W(r={}){return{actionKey:r.actionKey||null,event:r.event||null,executePluginHookSync:r.executePluginHookSync,interaction:r.interaction||null,meta:r.meta||null,section:r.section||null,source:r.source||null}}function Kt(r,e,t={}){if(typeof t.executePluginHookSync!="function")return{action:e,result:null,stopped:!1};let n=t.executePluginHookSync(g.ACTION_EXECUTE,{action:e,actionKey:t.actionKey||null,element:r,event:t.event||null,interaction:t.interaction||null,meta:t.meta||null,section:t.section||null,source:t.source||null},{actionKey:t.actionKey||null,interaction:t.interaction||null,phase:"action",section:t.section||null,source:t.source||null})||{};return{action:Yt(n.action)?n.action:e,result:n,stopped:H(n)}}function B(r){let e={action:r.actionConfig||null,actionKey:r.actionKey,element:r.element||null,event:r.event||null,interaction:r.interaction||null,source:r.source,...r.extra||{}};return typeof r.executePluginHookSync!="function"?e:r.executePluginHookSync(r.hookName,e,{actionKey:r.actionKey,interaction:r.interaction||null,phase:"interaction",source:r.source})||e}function Xe(r){let e=r==null?void 0:r.action;return!!(r&&(e===x.TOGGLE||e===x.EXPAND||e===x.COLLAPSE)&&(r.target===void 0||r.target==="card"))}function ye(r){return!!(r&&(r.target==="card"||r.action===x.EXPAND||r.action===x.COLLAPSE))}function ee(r){let e=r.triggerMeta||{},t=r.executePluginHookSync?r.executePluginHookSync(g.ACTION_EXECUTE,{action:r.actionConfig,actionKey:r.actionKey,element:r.element||null,event:e.event||null,implicit:e.implicit===!0,interaction:e.interaction||null,meta:e.meta||null,source:e.source||r.section},{actionKey:r.actionKey,interaction:e.interaction||null,phase:"action",source:e.source||r.section})||{}:{action:r.actionConfig};if(H(t))return;let n=Yt(t.action)?t.action:r.actionConfig;if(!(!n||n.action===x.NONE)){if(!r.isCardAction(n)){r.executeAction(n,W({actionKey:r.actionKey,event:e.event||null,executePluginHookSync:r.executePluginHookSync,interaction:e.interaction||null,meta:e.meta||null,section:r.section,source:e.source||r.section}));return}if(n.action===x.EXPAND){r.dispatchCardAction(x.EXPAND);return}if(n.action===x.COLLAPSE){r.dispatchCardAction(x.COLLAPSE);return}r.dispatchCardAction(x.TOGGLE)}}function Dn(r,e="Unknown error"){return r instanceof Error&&typeof r.message=="string"&&r.message?r.message:e}var Ye=null;async function mt(){return Ye||(Ye=new Promise(async r=>{if(window.loadCardHelpers){r(await window.loadCardHelpers());return}let e=setInterval(async()=>{window.loadCardHelpers&&(clearInterval(e),r(await window.loadCardHelpers()))},100);setTimeout(()=>{clearInterval(e),console.warn("[UniversalCard] Card helpers not available"),r(null)},1e4)}),Ye)}async function ft(r){if(!r||!r.type)throw new Error("Card config must have a type");let e=await mt();if(e)try{return await e.createCardElement(r)}catch(t){throw new Error(`Failed to create card: ${Dn(t)}`)}return Bn(r)}function Bn(r){let e=typeof r.type=="string"?r.type:String(r.type||""),t=e;e.startsWith("custom:")?t=e.slice(7):t=`hui-${e}-card`;let n=document.createElement(String(t));return n.setConfig&&n.setConfig(r),n}async function Ke(r){return Array.isArray(r)?(await Promise.allSettled(r.map(t=>ft(t)))).map((t,n)=>t.status==="fulfilled"?t.value:(console.error("[UniversalCard] Card creation failed:",t.reason),gt(t.reason,r[n]))):[]}function gt(r,e){let t=document.createElement("ha-card");return t.className="uc-error-card",t.innerHTML=`
    <div class="error-content">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      <span class="error-message">${r.message||"Unknown error"}</span>
      <button class="error-details-btn">?</button>
    </div>
  `,t._errorData={error:r,config:e,stack:r.stack},t}async function I(r,e,t,n={}){if(!t||t.action==="none")return;let i=Kt(e,t,n);if(i.stopped)return;let o=i.action,{action:a}=o;switch(a){case"toggle":await Un(r,o);break;case"call-service":await $n(r,o);break;case"navigate":zn(o);break;case"url":Vn(o);break;case"more-info":Fn(e,o);break;case"fire-dom-event":jn(e,o);break;default:console.warn(`[UniversalCard] Unknown action: ${a}`)}}async function Un(r,e){let t=typeof e.entity=="string"?e.entity:null;if(!t||!r)return;let n=q(r),i=t.split(".")[0];await n.services.call(i,"toggle",{entity_id:t})}async function $n(r,e){let t=typeof e.service=="string"?e.service:null,n=e.service_data,i=e.target&&typeof e.target=="object"&&!Array.isArray(e.target)?e.target:void 0;if(!t||!r)return;let o=q(r),[a,s]=t.split(".");await o.services.call(a,s,n||{},i)}function zn(r){let e=typeof r.navigation_path=="string"?r.navigation_path:null;e&&(history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")))}function Vn(r){let e=typeof r.url_path=="string"?r.url_path:null;if(!e)return;let t=typeof r.url_target=="string"?r.url_target:"_blank";window.open(e,t)}function Fn(r,e){let t=typeof e.entity=="string"?e.entity:null;if(!t)return;let n=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}),i=r;for(;i&&i.tagName!=="UNIVERSAL-CARD";){let o=i.getRootNode();i=i.parentElement||(o instanceof ShadowRoot?o.host:null)}i&&i.isConnected?i.dispatchEvent(n):(document.querySelector("ha-panel-lovelace")||document.querySelector("home-assistant")||document.body).dispatchEvent(n)}function jn(r,e){let t=new CustomEvent("ll-custom",{bubbles:!0,composed:!0,detail:e});r.dispatchEvent(t)}function qt(r){let e=Ge(r)?r.getHass():r;return(e==null?void 0:e.user)||null}function bt(r,e){return(Array.isArray(e)?e:[e]).includes(r)}function Wt(r,e){var t;return e?(t=r==null?void 0:r.attributes)==null?void 0:t[e]:r==null?void 0:r.state}function Zt(r){return!!r&&typeof r=="object"&&r.__universalCardDerivedProviderContext===!0}function Gn(r){if(Zt(r))return r;let e=q(r),t={getValue(n,i,o=void 0){if(!n)return o;let a=e.entities.getState(n),s=Wt(a,i);return s===void 0?o:s},getNumericValue(n,i){let o=t.getValue(n,i),a=Number.parseFloat(String(o));return Number.isNaN(a)?null:a},getFriendlyName(n,i=null){var a,s;if(!n)return i;let o=e.entities.getState(n);return(s=(a=o==null?void 0:o.attributes)==null?void 0:a.friendly_name)!=null?s:i},getIcon(n,i=null){var a,s;if(!n)return i;let o=e.entities.getState(n);return(s=(a=o==null?void 0:o.attributes)==null?void 0:a.icon)!=null?s:i},getPicture(n){var o,a,s,l;if(!n)return null;let i=e.entities.getState(n);return(l=(s=(o=i==null?void 0:i.attributes)==null?void 0:o.entity_picture)!=null?s:(a=i==null?void 0:i.attributes)==null?void 0:a.url)!=null?l:null},count(n={}){let i=e.entities.getStates(),{attribute:o,domain:a,entities:s,predicate:l,state:c,value:m}=n,b=Array.isArray(s)&&s.length>0?s.filter(Boolean):Object.keys(i);return a&&(b=b.filter(_=>_.startsWith(`${a}.`))),b.filter(_=>{let y=i[_];if(!y||c!==void 0&&!bt(y.state,c))return!1;if(m!==void 0){let S=Wt(y,o);if(!bt(S,m))return!1}return!(l&&!l(y,_))}).length},matches(n,i,o){if(!n)return!1;let a=t.getValue(n,o);return bt(a,i)}};return{__universalCardProviderContext:!0,__universalCardDerivedProviderContext:!0,base:e,setHass(n){e.setHass(n)},getHass(){return e.getHass()},entities:e.entities,services:e.services,api:e.api,websocket:e.websocket,http:e.http,notifications:e.notifications,derived:{entities:t}}}function z(r){return Zt(r)?r:Gn(r)}function Xn(r){return typeof r=="number"&&Number.isFinite(r)}function Qt(r){if(typeof r=="boolean")return r;if(typeof r=="string"){let e=r.trim().toLowerCase();if(e==="true")return!0;if(e==="false")return!1}return null}function Jt(r){if(Xn(r))return r;if(typeof r=="string"&&r.trim()){let e=Number(r);if(Number.isFinite(e))return e}return null}function Yn(r,e){let t=Qt(r),n=Qt(e);if(t!==null&&n!==null)return[t,n];let i=Jt(r),o=Jt(e);return i!==null&&o!==null?[i,o]:[String(r!=null?r:""),String(e!=null?e:"")]}function Kn(r,e,t){switch(t){case"==":return r===e;case"!=":return r!==e;case">":return r>e;case"<":return r<e;case">=":return r>=e;case"<=":return r<=e;default:return!1}}function qn(r,e,t){return r.entity?typeof t=="function"?t(r.entity,r.attribute):void 0:e}function en(r,e,t){let n=qn(r,e,t),[i,o]=Yn(n,r.value);return Kn(i,o,r.operator)}function tn(r,e,t){return!Array.isArray(r)||r.length===0?!0:r.every(n=>en(n,e,t))}function nn(r,e,t){if(!Array.isArray(r)||r.length===0)return null;let n=r.find(i=>en(i,e,t));return(n==null?void 0:n.color)||null}var qe=class{constructor(e,t={}){this._config=e,this._options=t,this._element=null,this._leftCards=[],this._rightCards=[],this._contentCards=[],this._hass=null,this._providers=null,this._expanded=!1,this._holdTimer=null,this._isHolding=!1,this._holdDuration=500,this._lastTapTime=0,this._doubleTapThreshold=300,this._attached=!1,this._boundHandlers=null}set hass(e){this._providers=z(e),this._hass=this._providers.getHass(),this._updateCards(this._hass),this._updateDynamicContent()}set expanded(e){this._expanded=e,this._updateExpandedState()}render(){let e=this._config,t=this._getHeaderLayout(),n=t.badges_position===ce.BELOW_CONTENT;this._element=document.createElement("div"),this._element.className=this._getHeaderClasses(),this._element.setAttribute("role","button"),this._element.setAttribute("tabindex","0"),this._element.setAttribute("aria-expanded",String(this._expanded)),this._element.dataset.layoutVariant=t.variant,this._element.dataset.contentAlign=t.align,this._element.dataset.badgesPosition=t.badges_position,this._element.dataset.ucRole="header",this._element.style.setProperty("--uc-header-gap",t.gap),this._element.style.setProperty("--uc-header-content-gap",t.content_gap),this._element.innerHTML=`
      <div class="header-left" data-uc-region="left">
        ${this._renderIcon()}
        <div class="header-left-slot" data-uc-slot="left"></div>
      </div>
      <div class="header-content" data-uc-region="content">
        ${this._renderTitle()}
        ${this._renderSubtitle()}
        <div class="header-cards-slot" data-uc-slot="content"></div>
        ${n?this._renderBadgesContainer("header-content-badges"):""}
      </div>
      <div class="header-right" data-uc-region="right">
        ${n?"":this._renderBadges()}
        <div class="header-right-slot" data-uc-slot="right"></div>
        ${this._renderExpandIcon()}
      </div>
    `;let i=this._executePluginHookSync(g.HEADER_RENDER,{component:this,element:this._element,expanded:this._expanded},{phase:"render"}),o=i==null?void 0:i.element;return o&&typeof o=="object"&&(this._element=o),this._bindEvents(),this._attached=!0,this._element}_renderIcon(){let{icon:e,entity:t}=this._config;if(!e&&!t)return"";let n=e||this._getEntityIcon(t);return n?`
      <ha-icon class="header-icon" data-uc-role="icon" icon="${n}"></ha-icon>
    `:""}_renderTitle(){let{title:e,entity:t}=this._config,n=e||this._getEntityName(t)||"";return n?`<div class="header-title" data-uc-role="title">${n}</div>`:""}_renderSubtitle(){let{subtitle:e,entity:t,show_state:n}=this._config,i=this._getProviders(),o=e||"";if(n!==!1&&t&&i){let a=i.derived.entities.getValue(t,void 0,"unavailable"),s=a==null?"":String(a);s&&s!=="unavailable"&&(o=o?`${o} \xB7 ${s}`:s)}return o?`<div class="header-subtitle" data-uc-role="subtitle">${o}</div>`:""}_renderBadges(){let{badges:e}=this._config;return!e||!Array.isArray(e)||e.length===0?"":`<div class="header-badges" data-uc-role="badges" data-uc-position="right">${this._renderVisibleBadgesHtml()}</div>`}_renderBadgesContainer(e){let{badges:t}=this._config;if(!t||!Array.isArray(t)||t.length===0)return"";let n=this._renderVisibleBadgesHtml();return`<div class="${e}" data-uc-role="badges" data-uc-position="below-content">${n}</div>`}_renderVisibleBadgesHtml(){return(this._config.badges||[]).map((t,n)=>({badge:t,index:n})).filter(({badge:t})=>this._isBadgeVisible(t)).map(({badge:t,index:n})=>this._renderBadge(t,n)).join("")}_renderBadge(e,t){var w,P;let n=this._getBadgeValue(e),i=this._getBadgeDisplayValue(e,n),o=this._getBadgeColor(e,n),a=this._getBadgeLabel(e),s=e.icon_only===!0&&!!e.icon,l=!!((w=e.icon_tap_action)!=null&&w.action&&e.icon_tap_action.action!==x.NONE),c=this._escapeAttributeValue(`Action for ${a||e.entity||"badge"}`),m=e.icon?l?`
            <button
              type="button"
              class="badge-icon-action clickable"
              data-badge-index="${t}"
              data-uc-role="badge-icon-action"
              aria-label="${c}"
            >
              <ha-icon class="badge-icon" icon="${e.icon}"></ha-icon>
            </button>
          `:`<span class="badge-icon" data-uc-role="badge-icon"><ha-icon class="badge-icon" icon="${e.icon}"></ha-icon></span>`:"",b=!s&&a?`<span class="badge-label" data-uc-role="badge-label">${a}</span>`:"",_=!s&&i!==null&&i!==void 0&&i!==""?`<span class="badge-value" data-uc-role="badge-value">${i}</span>${e.unit?`<span class="badge-unit" data-uc-role="badge-unit">${e.unit}</span>`:""}`:"",y=s?"":this._renderBadgeProgress(e,n);return`
      <div class="badge${(P=e.tap_action)!=null&&P.action&&e.tap_action.action!=="none"?" clickable":""}${s?" icon-only":""}" data-badge-index="${t}" data-uc-role="badge" data-uc-badge-type="${e.type||"custom"}" data-uc-icon-only="${s?"true":"false"}" style="--badge-color: ${o}">
        ${m}${b}${_}${y}
      </div>
    `}_renderExpandIcon(){let{show_expand_icon:e,expand_icon:t,body_mode:n}=this._config;if(n==="none"||e===!1)return"";let i=t||"mdi:chevron-down";return`
      <ha-icon class="expand-icon ${this._expanded?"expanded":""}" data-uc-role="expand-icon" icon="${i}"></ha-icon>
    `}_getHeaderClasses(){let e=["header"];return this._expanded&&e.push("expanded"),(this._config.sticky_header||this._config.sticky)&&e.push("sticky"),this._config.clickable===!1&&e.push("non-clickable"),e.join(" ")}_getHeaderLayout(){let e=this._config.layout||{};return{variant:e.variant||Se.DEFAULT,gap:e.gap||"12px",content_gap:e.content_gap||"2px",align:e.align||Ae.START,badges_position:e.badges_position||ce.RIGHT}}async loadCards(){let{header_left:e,header_right:t,cards:n}=this._config,i=[];e!=null&&e.cards&&i.push(this._loadSlotCards(e.cards,".header-left-slot","_leftCards")),t!=null&&t.cards&&i.push(this._loadSlotCards(t.cards,".header-right-slot","_rightCards")),n&&i.push(this._loadSlotCards(n,".header-cards-slot","_contentCards")),await Promise.all(i)}async _loadSlotCards(e,t,n){var o;if(!Array.isArray(e)||e.length===0)return;let i=(o=this._element)==null?void 0:o.querySelector(t);if(i)try{let a=await Ke(e);this[n]=a;let s=document.createDocumentFragment();a.forEach(l=>{this._hass&&(l.hass=this._hass),s.appendChild(l)}),i.appendChild(s)}catch(a){console.error("[UniversalCard] Failed to load slot cards:",a)}}_updateCards(e){[...this._leftCards,...this._rightCards,...this._contentCards].forEach(n=>{if(n&&"hass"in n)try{n.hass=e}catch(i){}})}_bindEvents(){this._element&&(this._boundHandlers={click:e=>this._handleClick(e),touchstart:e=>this._handleTouchStart(e),touchend:e=>this._handleTouchEnd(e),touchcancel:()=>this._cancelHold(),mousedown:e=>this._handleMouseDown(e),mouseup:()=>this._handleMouseUp(),mouseleave:()=>this._cancelHold(),keydown:e=>this._handleKeydown(e),contextmenu:e=>this._handleContextMenu(e)},this._element.addEventListener("click",this._boundHandlers.click),this._element.addEventListener("touchstart",this._boundHandlers.touchstart,{passive:!0}),this._element.addEventListener("touchend",this._boundHandlers.touchend),this._element.addEventListener("touchcancel",this._boundHandlers.touchcancel),this._element.addEventListener("mousedown",this._boundHandlers.mousedown),this._element.addEventListener("mouseup",this._boundHandlers.mouseup),this._element.addEventListener("mouseleave",this._boundHandlers.mouseleave),this._element.addEventListener("keydown",this._boundHandlers.keydown),this._element.addEventListener("contextmenu",this._boundHandlers.contextmenu))}_handleClick(e){var a,s;p("[UC-Header] click!",e.target);let t=this._findBadgeActionElement(e.target,"badge-icon-action");if((a=t==null?void 0:t.classList)!=null&&a.contains("clickable")){p("[UC-Header] badge icon tap"),e.preventDefault(),e.stopPropagation(),this._handleBadgeIconClick(t);return}let n=this._findBadgeElement(e.target);if((s=n==null?void 0:n.classList)!=null&&s.contains("clickable")){p("[UC-Header] badge tap"),e.preventDefault(),this._handleBadgeClick(n);return}if(this._isInteractiveElement(e.target)){p("[UC-Header] ignored - interactive element");return}if(this._isHolding){p("[UC-Header] ignored - was holding"),this._isHolding=!1;return}let i=Date.now(),o=i-this._lastTapTime;if(this._lastTapTime=i,!this._requiresDoubleTapDelay()){let l=B({actionConfig:this._config.tap_action,actionKey:"tap_action",element:this._element,event:e,executePluginHookSync:this._executePluginHookSync.bind(this),hookName:g.CLICK,interaction:"tap",source:"header"});if(H(l))return;this._executeAction("tap_action",{event:e,interaction:"tap",source:"header"});return}if(o<this._doubleTapThreshold){p("[UC-Header] double-tap detected"),e.preventDefault();let l=B({actionConfig:this._config.double_tap_action,actionKey:"double_tap_action",element:this._element,event:e,executePluginHookSync:this._executePluginHookSync.bind(this),hookName:g.CLICK,interaction:"double_tap",source:"header"});if(H(l))return;this._executeAction("double_tap_action",{event:e,interaction:"double_tap",source:"header"});return}setTimeout(()=>{if(Date.now()-this._lastTapTime>=this._doubleTapThreshold){let l=B({actionConfig:this._config.tap_action,actionKey:"tap_action",element:this._element,event:e,executePluginHookSync:this._executePluginHookSync.bind(this),hookName:g.CLICK,interaction:"tap",source:"header"});if(H(l))return;this._executeAction("tap_action",{event:e,interaction:"tap",source:"header"})}},this._doubleTapThreshold)}_requiresDoubleTapDelay(){if(this._config.expand_trigger==="double_tap")return!0;let e=this._config.double_tap_action;return!!(e!=null&&e.action&&e.action!==x.NONE)}_handleTouchStart(e){this._isInteractiveElement(e.target)||this._startHold()}_handleTouchEnd(e){this._endHold()}_handleMouseDown(e){e.button===0&&(this._isInteractiveElement(e.target)||this._startHold())}_handleMouseUp(){this._endHold()}_startHold(){this._cancelHold(),this._holdTimer=setTimeout(()=>{this._isHolding=!0;let e=B({actionConfig:this._config.hold_action,actionKey:"hold_action",element:this._element,executePluginHookSync:this._executePluginHookSync.bind(this),hookName:g.HOLD,interaction:"hold",source:"header"});H(e)||this._executeAction("hold_action",{interaction:"hold",source:"header"})},this._holdDuration)}_endHold(){this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)}_cancelHold(){this._endHold(),this._isHolding=!1}_handleKeydown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._executeAction("tap_action"))}_handleContextMenu(e){this._config.context_menu&&(e.preventDefault(),L(this._element,"uc-context-menu",{x:e.clientX,y:e.clientY,config:this._config.context_menu}))}_isInteractiveElement(e){var n,i;let t=e instanceof HTMLElement?e:null;if(!this._element||!t)return!0;if(t===this._element||(i=(n=this._element).contains)!=null&&i.call(n,t)){let o=["ha-icon-button","button","a[href]","input","select","textarea",".badge.clickable",".badge-icon-action.clickable",".quick-action"],a=t;for(;a&&a!==this._element;){if(a.matches&&a.matches(o.join(", ")))return p("[UC-Header] blocked interactive:",a.tagName),!0;a=a.parentElement}return!1}return!1}_executeAction(e,t={}){p("[UC-Header] _executeAction:",e);let n=this._config.expand_trigger||"tap",i=n==="double_tap"?"double_tap_action":n==="hold"?"hold_action":n==="tap"?"tap_action":null;p("[UC-Header] expand_trigger:",n,"expandActionKey:",i);let o=this._config[e],a=o&&o.action&&o.action!=="none";if(p("[UC-Header] actionConfig:",o,"hasExplicitAction:",a),e===i&&!a&&n!=="none"){p("[UC-Header] firing uc-toggle (expand trigger default)"),ee({actionConfig:{action:x.TOGGLE,target:"card"},actionKey:e,dispatchCardAction:s=>this._dispatchCardAction(s),element:this._element,executeAction:(s,l)=>I(this._getProviders()||this._hass,this._element,s,l),executePluginHookSync:this._executePluginHookSync.bind(this),isCardAction:Xe,section:"header",triggerMeta:{...t,source:t.source||"header",implicit:!0}});return}if(!a){p("[UC-Header] no explicit action");return}if(Xe(o)){ee({actionConfig:{...o,target:o.target||"card"},actionKey:e,dispatchCardAction:s=>this._dispatchCardAction(s),element:this._element,executeAction:(s,l)=>I(this._getProviders()||this._hass,this._element,s,l),executePluginHookSync:this._executePluginHookSync.bind(this),isCardAction:Xe,section:"header",triggerMeta:{...t,source:t.source||"header"}});return}p("[UC-Header] executing HA action"),I(this._getProviders()||this._hass,this._element,o,W({actionKey:e,event:t.event||null,executePluginHookSync:this._options.executePluginHookSync,interaction:t.interaction||null,section:"header",source:t.source||"header"}))}_updateExpandedState(){if(!this._element)return;this._element.classList.toggle("expanded",this._expanded),this._element.setAttribute("aria-expanded",String(this._expanded));let e=this._element.querySelector(".expand-icon");e&&e.classList.toggle("expanded",this._expanded)}_updateDynamicContent(){let e=this._getProviders();if(!(!this._element||!e)){if(this._config.entity&&this._config.show_state!==!1){let t=this._element.querySelector(".header-subtitle");if(t){let n=e.derived.entities.getValue(this._config.entity,void 0,"unavailable"),i=n==null?"":String(n),o=this._config.subtitle;t.textContent=o?`${o} \xB7 ${i}`:i}}this._updateBadges()}}_updateBadges(){let{badges:e}=this._config;if(!e||!Array.isArray(e))return;let t=this._element.querySelector(".header-badges");t&&(t.innerHTML=this._renderVisibleBadgesHtml())}_getBadgeDisplayValue(e,t=this._getBadgeValue(e)){return t==null?null:this._formatBadgeValue(t,e)}_getBadgeLabel(e){return e.label?e.label:e.show_name&&e.entity&&this._getEntityName(e.entity)||""}_isBadgeVisible(e,t=this._getBadgeValue(e)){return tn(e.visibility,t,this._getBadgeRuleValueReader())}_getBadgeColor(e,t=this._getBadgeValue(e)){if(e.color)return e.color;let n=nn(e.color_rules,t,this._getBadgeRuleValueReader());return n||this._getBadgeAutoColor(e,t)}_getBadgeRuleValueReader(){let e=this._getProviders();if(e)return(t,n)=>e.derived.entities.getValue(t,n)}_getBadgeValue(e){let{type:t="state",entity:n,attribute:i,value:o}=e,a=this._getProviders();if(o!==void 0)return o;if(!a)return null;switch(t){case"attribute":return n&&i?a.derived.entities.getValue(n,i):null;case"counter":return this._getBadgeCounterValue(e);case"state":default:return n?a.derived.entities.getValue(n,void 0,""):null}}_getBadgeCounterValue(e){let t=this._getProviders();if(!t)return 0;let n=e.count_state||e.state||"on";return t.derived.entities.count({domain:e.domain,entities:e.entities,state:n})}_formatBadgeValue(e,t){let n=String(e);if(t.precision!==void 0&&!Number.isNaN(Number.parseFloat(n)))return Number.parseFloat(n).toFixed(t.precision);if(t.format==="time"||t.format==="date")try{let i=typeof e=="number"||typeof e=="string"?e:n,o=new Date(i);return t.format==="time"?o.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"}):o.toLocaleDateString("ru-RU")}catch(i){return String(e)}return t.format==="duration"?this._formatBadgeDuration(e):String(e)}_formatBadgeDuration(e){let t=Number.parseInt(String(e),10);if(Number.isNaN(t))return String(e);let n=Math.floor(t/3600),i=Math.floor(t%3600/60),o=t%60;return n>0?`${n}:${String(i).padStart(2,"0")}:${String(o).padStart(2,"0")}`:`${i}:${String(o).padStart(2,"0")}`}_getBadgeAutoColor(e,t=this._getBadgeValue(e)){let n=this._getProviders();if(e.entity&&n){let i=n.entities.getState(e.entity);if(i){let o=this._getStateColor(i.state);if(o)return o}}if(Array.isArray(e.thresholds)){let i=Number.parseFloat(String(t));if(!Number.isNaN(i)){let o=[...e.thresholds].sort((a,s)=>s.value-a.value);for(let a of o)if(i>=a.value)return a.color}}return"var(--primary-color)"}_renderBadgeProgress(e,t){let n=this._getBadgeProgressPercentage(e,t);return n===null?"":`
      <div class="badge-progress" data-uc-role="badge-progress">
        <div class="badge-progress-bar" data-uc-role="badge-progress-bar" style="width: ${n}%"></div>
      </div>
    `}_escapeAttributeValue(e){return String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}_getBadgeProgressPercentage(e,t){if(!e.show_progress||e.min===void 0||e.max===void 0)return null;let n=Number.parseFloat(String(t));return Number.isNaN(n)||e.max===e.min?null:Math.min(100,Math.max(0,(n-e.min)/(e.max-e.min)*100))}_findBadgeElement(e){var n;let t=e instanceof HTMLElement?e:null;for(;t&&t!==this._element;){if((n=t.classList)!=null&&n.contains("badge"))return t;t=t.parentElement}return null}_findBadgeActionElement(e,t){var i;let n=e instanceof HTMLElement?e:null;for(;n&&n!==this._element;){if((i=n.classList)!=null&&i.contains(t))return n;n=n.parentElement}return null}_handleBadgeClick(e){this._executeBadgeAction(e,"tap_action","badge_tap","badge")}_handleBadgeIconClick(e){this._executeBadgeAction(e,"icon_tap_action","badge_icon_tap","badge-icon")}_executeBadgeAction(e,t,n,i){var b;let o=parseInt(e.dataset.badgeIndex,10);if(Number.isNaN(o))return;let a=(b=this._config.badges)==null?void 0:b[o],s=a==null?void 0:a[t];if(!s||s.action===x.NONE)return;let l=a.entity&&!s.entity?{...s,entity:a.entity}:s,c=`badges[${o}].${t}`,m=B({actionConfig:l,actionKey:c,element:e,executePluginHookSync:this._executePluginHookSync.bind(this),extra:{badge:a,badgeIndex:o},hookName:g.CLICK,interaction:n,source:i});H(m)||Promise.resolve(I(this._getProviders()||this._hass,e,l,W({actionKey:c,executePluginHookSync:this._options.executePluginHookSync,interaction:n,meta:{badge:a,badgeIndex:o},section:"header",source:i}))).catch(_=>{console.error("[UniversalCard] Badge action failed:",_)})}_executePluginHookSync(e,t={},n={}){return typeof this._options.executePluginHookSync!="function"?t:this._options.executePluginHookSync(e,{component:this,config:this._config,element:this._element,section:"header",...t},{section:"header",...n})||{}}_dispatchCardAction(e){if(e===x.EXPAND){p("[UC-Header] firing uc-expand"),L(this._element,"uc-expand");return}if(e===x.COLLAPSE){p("[UC-Header] firing uc-collapse"),L(this._element,"uc-collapse");return}p("[UC-Header] firing uc-toggle"),L(this._element,"uc-toggle")}_getEntityIcon(e){let t=this._getProviders();if(!t||!e)return null;let n=e.split(".")[0];return t.derived.entities.getIcon(e,this._getDomainIcon(n))}_getEntityName(e){let t=this._getProviders();return!t||!e?null:t.derived.entities.getFriendlyName(e)}_getProviders(){return this._providers?this._providers:this._hass?(this._providers=z(this._hass),this._hass=this._providers.getHass(),this._providers):null}_getDomainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:radiobox-blank",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",alarm_control_panel:"mdi:shield-home",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",person:"mdi:account",device_tracker:"mdi:account",weather:"mdi:weather-partly-cloudy",vacuum:"mdi:robot-vacuum"}[e]||"mdi:bookmark"}_getStateColor(e){return{on:"var(--state-active-color, #fdd835)",off:"var(--state-inactive-color, #969696)",home:"var(--state-home-color, #4caf50)",not_home:"var(--state-not-home-color, #f44336)",armed_home:"var(--state-warning-color, #ff9800)",armed_away:"var(--state-error-color, #f44336)",disarmed:"var(--state-success-color, #4caf50)",unavailable:"var(--state-unavailable-color, #bdbdbd)"}[e]||null}detach(){this._cancelHold(),this._removeEventListeners(),this._attached=!1}attach(){this._attached||this._element&&(this._bindEvents(),this._attached=!0)}_removeEventListeners(){this._element&&this._boundHandlers&&(this._element.removeEventListener("click",this._boundHandlers.click),this._element.removeEventListener("touchstart",this._boundHandlers.touchstart),this._element.removeEventListener("touchend",this._boundHandlers.touchend),this._element.removeEventListener("touchcancel",this._boundHandlers.touchcancel),this._element.removeEventListener("mousedown",this._boundHandlers.mousedown),this._element.removeEventListener("mouseup",this._boundHandlers.mouseup),this._element.removeEventListener("mouseleave",this._boundHandlers.mouseleave),this._element.removeEventListener("keydown",this._boundHandlers.keydown),this._element.removeEventListener("contextmenu",this._boundHandlers.contextmenu)),this._boundHandlers=null}destroy(){this._cancelHold(),this._removeEventListeners(),this._leftCards=[],this._rightCards=[],this._contentCards=[],this._hass=null,this._providers=null,this._element=null,this._attached=!1}};var We=class{constructor(e,t={}){this._config=e,this._options=t,this._element=null,this._leftCards=[],this._rightCards=[],this._contentCards=[],this._hass=null,this._providers=null,this._holdTimer=null,this._isHolding=!1,this._holdDuration=500}set hass(e){this._providers=q(e),this._hass=this._providers.getHass(),this._updateCards(this._hass)}render(){let e=this._config;this._element=document.createElement("div"),this._element.className=this._getFooterClasses(),this._element.dataset.ucRole="footer",this._element.innerHTML=`
      <div class="footer-left" data-uc-region="left">
        <div class="footer-left-slot" data-uc-slot="left"></div>
      </div>
      <div class="footer-content" data-uc-region="content">
        ${this._renderText()}
        <div class="footer-cards-slot" data-uc-slot="content"></div>
      </div>
      <div class="footer-right" data-uc-region="right">
        <div class="footer-right-slot" data-uc-slot="right"></div>
        ${this._renderActions()}
      </div>
    `;let t=this._executePluginHookSync(g.FOOTER_RENDER,{component:this,element:this._element},{phase:"render"}),n=t==null?void 0:t.element;return n&&typeof n=="object"&&(this._element=n),this._bindEvents(),this._element}_renderText(){let{text:e,icon:t}=this._config;return e?`
      <div class="footer-text" data-uc-role="text">
        ${t?`<ha-icon data-uc-role="text-icon" icon="${t}"></ha-icon>`:""}
        <span data-uc-role="text-label">${e}</span>
      </div>
    `:""}_renderActions(){let{actions:e}=this._config;return!e||!Array.isArray(e)?"":e.map((t,n)=>`
      <button class="footer-action-btn" data-action-index="${n}" data-uc-role="action" data-uc-action-index="${n}">
        ${t.icon?`<ha-icon icon="${t.icon}"></ha-icon>`:""}
        ${t.label||""}
      </button>
    `).join("")}_getFooterClasses(){let e=["footer"];return this._config.sticky&&e.push("sticky"),this._config.border_top!==!1&&e.push("with-border"),e.join(" ")}async loadCards(){let{footer_left:e,footer_right:t,cards:n}=this._config,i=[];e!=null&&e.cards&&i.push(this._loadSlotCards(e.cards,".footer-left-slot","_leftCards")),t!=null&&t.cards&&i.push(this._loadSlotCards(t.cards,".footer-right-slot","_rightCards")),n&&i.push(this._loadSlotCards(n,".footer-cards-slot","_contentCards")),await Promise.all(i)}async _loadSlotCards(e,t,n){var o;if(!Array.isArray(e)||e.length===0)return;let i=(o=this._element)==null?void 0:o.querySelector(t);if(i)try{let a=await Ke(e);this[n]=a;let s=document.createDocumentFragment();a.forEach(l=>{this._hass&&(l.hass=this._hass),s.appendChild(l)}),i.appendChild(s)}catch(a){console.error("[UniversalCard] Failed to load footer cards:",a)}}_updateCards(e){[...this._leftCards,...this._rightCards,...this._contentCards].forEach(n=>{if(n&&"hass"in n)try{n.hass=e}catch(i){}})}_bindEvents(){this._element&&(this._element.querySelectorAll(".footer-action-btn").forEach(e=>{e.addEventListener("click",t=>this._handleActionClick(t))}),(this._config.tap_action||this._config.hold_action)&&(this._element.addEventListener("click",e=>this._handleClick(e)),this._element.addEventListener("mousedown",e=>this._handleMouseDown(e)),this._element.addEventListener("mouseup",()=>this._handleMouseUp()),this._element.addEventListener("mouseleave",()=>this._cancelHold())))}_handleActionClick(e){var o;let t=e.currentTarget;if(!t)return;let n=parseInt(t.dataset.actionIndex,10),i=(o=this._config.actions)==null?void 0:o[n];if(i){let a=B({actionConfig:i,actionKey:`actions[${n}]`,element:this._element,event:e,executePluginHookSync:this._executePluginHookSync.bind(this),extra:{actionIndex:n},hookName:g.CLICK,interaction:"button",source:"footer_action"});if(H(a))return;if(ye(i)){ee({actionConfig:{...i,target:i.target||"card"},actionKey:`actions[${n}]`,dispatchCardAction:s=>this._dispatchCardAction(s),element:this._element,executeAction:(s,l)=>I(this._providers||this._hass,this._element,s,l),executePluginHookSync:this._executePluginHookSync.bind(this),isCardAction:ye,section:"footer",triggerMeta:{event:e,interaction:"button",meta:{actionIndex:n},source:"footer_action"}});return}I(this._providers||this._hass,this._element,i,W({actionKey:`actions[${n}]`,event:e,executePluginHookSync:this._options.executePluginHookSync,interaction:"button",meta:{actionIndex:n},section:"footer",source:"footer_action"}))}}_handleClick(e){if(this._isInteractiveElement(e.target))return;if(this._isHolding){this._isHolding=!1;return}let t=B({actionConfig:this._config.tap_action,actionKey:"tap_action",element:this._element,event:e,executePluginHookSync:this._executePluginHookSync.bind(this),hookName:g.CLICK,interaction:"tap",source:"footer"});H(t)||this._executeAction("tap_action",{event:e,interaction:"tap",source:"footer"})}_handleMouseDown(e){e.button===0&&(this._isInteractiveElement(e.target)||(this._holdTimer=setTimeout(()=>{this._isHolding=!0;let t=B({actionConfig:this._config.hold_action,actionKey:"hold_action",element:this._element,event:e,executePluginHookSync:this._executePluginHookSync.bind(this),hookName:g.HOLD,interaction:"hold",source:"footer"});H(t)||this._executeAction("hold_action",{event:e,interaction:"hold",source:"footer"})},this._holdDuration)))}_handleMouseUp(){this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)}_cancelHold(){this._handleMouseUp(),this._isHolding=!1}_isInteractiveElement(e){let t=e instanceof HTMLElement?e:null;return!t||typeof t.closest!="function"?!1:t.closest("button, a, input, .footer-action-btn")!==null}_executeAction(e,t={}){let n=this._config[e];if(!(!n||n.action===x.NONE)){if(ye(n)){ee({actionConfig:{...n,target:n.target||"card"},actionKey:e,dispatchCardAction:i=>this._dispatchCardAction(i),element:this._element,executeAction:(i,o)=>I(this._providers||this._hass,this._element,i,o),executePluginHookSync:this._executePluginHookSync.bind(this),isCardAction:ye,section:"footer",triggerMeta:{...t,source:t.source||"footer"}});return}I(this._providers||this._hass,this._element,n,W({actionKey:e,event:t.event||null,executePluginHookSync:this._options.executePluginHookSync,interaction:t.interaction||null,section:"footer",source:t.source||"footer"}))}}_executePluginHookSync(e,t={},n={}){return typeof this._options.executePluginHookSync!="function"?t:this._options.executePluginHookSync(e,{component:this,config:this._config,element:this._element,section:"footer",...t},{section:"footer",...n})||{}}_dispatchCardAction(e){if(e===x.EXPAND){L(this._element,"uc-expand");return}if(e===x.COLLAPSE){L(this._element,"uc-collapse");return}L(this._element,"uc-toggle")}destroy(){this._cancelHold(),this._leftCards=[],this._rightCards=[],this._contentCards=[],this._providers=null,this._element=null}};var O=class r{constructor(e,t={}){if(new.target===r)throw new Error("BaseMode is an abstract class and cannot be instantiated directly");this._config=e,this._options=t,this._container=null,this._cards=[],this._hass=null,this._loaded=!1,this._loadPromise=null,this._active=!1,this._poolEnabled=(e==null?void 0:e.enable_card_pool)!==!1,this._poolNamespace=typeof t.poolNamespace=="string"&&t.poolNamespace?t.poolNamespace:typeof(e==null?void 0:e.body_mode)=="string"&&e.body_mode?e.body_mode:"mode",this._cardsPoolKey=null}render(){throw new Error("render() must be implemented by subclass")}async open(){throw new Error("open() must be implemented by subclass")}async close(){throw new Error("close() must be implemented by subclass")}static getStyles(){throw new Error("getStyles() must be implemented by subclass")}set hass(e){this._hass=e,this._updateCardsHass(e)}get hass(){return this._hass}get active(){return this._active}get loaded(){return this._loaded}async loadCards(e){if(this._loaded||!Array.isArray(e)||e.length===0){this._loaded=!0;return}return this._loadPromise?this._loadPromise:(this._loadPromise=(async()=>{let t=this._buildCardsPoolKey(e);if(this._cardsPoolKey=t,t){let n=R.acquire(t);if(n&&n.length===e.length){this._cards=n,this._updateCardsHass(this._hass),this._loaded=!0;return}}try{let n=await this._getCardHelpers();this._cards=await Promise.all(e.map(i=>this._createCard(i,n))),this._loaded=!0}catch(n){console.error("[UniversalCard] Failed to load cards:",n),this._loaded=!0}})().finally(()=>{this._loadPromise=null}),this._loadPromise)}async _createCard(e,t){try{if(!t||typeof t.createCardElement!="function")throw new Error("Card helpers are not available");let n=await t.createCardElement(e);return this._hass&&(n.hass=this._hass),n}catch(n){return console.error("[UniversalCard] Card creation error:",n),this._createErrorCard(n,e)}}_createErrorCard(e,t){let n=document.createElement("div");n.className="uc-error-card",n.innerHTML=`
      <div class="error-icon">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </div>
      <div class="error-message">${e.message||"Error loading card"}</div>
      <button class="error-details-btn" title="View details">?</button>
    `;let i={error:e,config:t,stack:e.stack||null};n._errorData=i;let o=n.querySelector(".error-details-btn");return o==null||o.addEventListener("click",a=>{a.stopPropagation(),this._showErrorDetails(i)}),n}_showErrorDetails(e){var i,o;let t=document.createElement("div");t.className="uc-error-popup-overlay",t.innerHTML=`
      <div class="uc-error-popup">
        <div class="popup-header">
          <span>Error Details</span>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-content">
          <div class="error-section">
            <strong>Message:</strong>
            <pre>${((i=e.error)==null?void 0:i.message)||"Unknown error"}</pre>
          </div>
          <div class="error-section">
            <strong>Card Config:</strong>
            <pre>${JSON.stringify(e.config,null,2)}</pre>
          </div>
          <div class="error-section">
            <strong>Stack Trace:</strong>
            <pre>${e.stack||"No stack trace available"}</pre>
          </div>
        </div>
      </div>
    `;let n=()=>t.remove();(o=t.querySelector(".popup-close"))==null||o.addEventListener("click",n),t.addEventListener("click",a=>{a.target===t&&n()}),document.body.appendChild(t)}async _getCardHelpers(){let e=window.loadCardHelpers;return typeof e=="function"?await e():new Promise(t=>{let n=setInterval(()=>{let i=window.loadCardHelpers;typeof i=="function"&&(clearInterval(n),i().then(t))},100);setTimeout(()=>{clearInterval(n),t(null)},1e4)})}_updateCardsHass(e){this._cards.forEach(t=>{if(!(!t||!("hass"in t)))try{t.hass=e}catch(n){}})}_applyGridConfig(e,t,n={}){var l,c;let i=(c=(l=t==null?void 0:t.columns)!=null?l:n.columns)!=null?c:1,o=typeof(t==null?void 0:t.display)=="string"&&t.display.trim()?t.display.trim():typeof n.display=="string"&&n.display.trim()?n.display.trim():"grid",a=typeof(t==null?void 0:t.gap)=="string"&&t.gap.trim()?t.gap.trim():typeof n.gap=="string"&&n.gap.trim()?n.gap.trim():"16px",s={gridAutoRows:t==null?void 0:t.auto_rows,gridAutoColumns:t==null?void 0:t.auto_columns,rowGap:t==null?void 0:t.row_gap,columnGap:t==null?void 0:t.column_gap,alignItems:t==null?void 0:t.align_items,justifyItems:t==null?void 0:t.justify_items,placeItems:t==null?void 0:t.place_items,alignContent:t==null?void 0:t.align_content,justifyContent:t==null?void 0:t.justify_content,placeContent:t==null?void 0:t.place_content,gridAutoFlow:t==null?void 0:t.auto_flow,direction:t==null?void 0:t.direction};e.style.display=o,e.style.gap=a,typeof i=="string"&&i.trim()?e.style.gridTemplateColumns=i.trim():typeof i=="number"&&i>1?e.style.gridTemplateColumns=`repeat(${i}, minmax(0, 1fr))`:e.style.gridTemplateColumns="minmax(0, 1fr)",Object.entries(s).forEach(([m,b])=>{typeof b=="string"&&b.trim()&&(e.style[m]=b.trim())})}_appendCards(e,t=[]){let n=document.createDocumentFragment();this._cards.forEach((i,o)=>{let a=document.createElement("div");a.className="card-wrapper",a.dataset.ucRole="card-wrapper";let s=t[o];if(s){let l=s.colspan||s.card_options&&s.card_options.colspan,c=s.rowspan||s.card_options&&s.card_options.rowspan;l&&(a.style.gridColumn="span "+l),c&&(a.style.gridRow="span "+c)}a.appendChild(i),n.appendChild(a)}),e.appendChild(n)}_animate(e,t,n=300){return new Promise(i=>{e.classList.add(t),setTimeout(()=>{e.classList.remove(t),i()},n)})}_waitForTransition(e,t=500){return new Promise(n=>{let i=()=>{e.removeEventListener("transitionend",i),n()};e.addEventListener("transitionend",i),setTimeout(n,t)})}destroy(){this._poolEnabled&&this._cardsPoolKey&&this._cards.length>0&&R.release(this._cardsPoolKey,this._cards,this._getPoolReleaseOptions()),this._cards=[],this._container=null,this._loaded=!1,this._loadPromise=null,this._active=!1,this._cardsPoolKey=null}_buildCardsPoolKey(e){if(!this._poolEnabled||!Array.isArray(e)||e.length===0)return null;let t=this._resolvePoolScope(),n=this._getPoolScopeToken(t);if(!n)return null;let i;try{i=JSON.stringify(e)}catch(a){return null}let o=`${n}:${this._poolNamespace}:${i}`;return`uc-mode-pool:${t}:${this._poolNamespace}:${this._hashString(o)}`}_hashString(e){let t=0;for(let n=0;n<e.length;n+=1)t=(t<<5)-t+e.charCodeAt(n),t|=0;return String(Math.abs(t))}_resolvePoolScope(){var t;let e=(t=this._config)==null?void 0:t.pool_scope;return e==="dashboard"||e==="global"||e==="card"?e:u.pool_scope||"card"}_getPoolScopeToken(e){var n,i,o;if(e==="global")return"global";if(e==="dashboard"){let a=typeof window!="undefined"&&((n=window.location)==null?void 0:n.pathname)||"",s=typeof window!="undefined"&&((i=window.location)==null?void 0:i.search)||"";return`dashboard:${`${a}${s||""}`||"default"}`}let t=(o=this._config)==null?void 0:o.card_id;return t?`card:${t}`:null}_normalizePoolNumber(e,t,n,i){let o=Number(e);return Number.isFinite(o)?Math.min(i,Math.max(n,Math.floor(o))):t}_getPoolReleaseOptions(){var e,t;return{scope:this._resolvePoolScope(),maxAgeMs:this._normalizePoolNumber((e=this._config)==null?void 0:e.pool_ttl_ms,u.pool_ttl_ms,h.POOL_MIN_TTL_MS,h.POOL_MAX_TTL_MS),maxEntries:this._normalizePoolNumber((t=this._config)==null?void 0:t.pool_max_entries,u.pool_max_entries,h.POOL_MIN_MAX_ENTRIES,h.POOL_MAX_MAX_ENTRIES)}}_getThemeVarSourceElement(){var n,i;let e=(n=this._options)==null?void 0:n.card,t=(i=e==null?void 0:e.shadowRoot)==null?void 0:i.querySelector(".universal-card");return t instanceof HTMLElement?t:e instanceof HTMLElement?e:null}_applyThemeVariables(e){if(!(e instanceof HTMLElement))return;let t=this._getThemeVarSourceElement();if(!(t instanceof HTMLElement))return;let n=getComputedStyle(t);["--ha-card-background","--card-background-color","--ha-card-box-shadow","--ha-card-border-radius","--primary-color","--primary-text-color","--secondary-text-color","--divider-color","--secondary-background-color"].forEach(o=>{let a=n.getPropertyValue(o);a&&a.trim()&&e.style.setProperty(o,a.trim())})}};var te=class extends O{constructor(e,t={}){super(e,t),this._contentWrapper=null,this._animationDuration=e.animation_duration||300,this._expandAnimation=e.expand_animation||"slide",this._collapseAnimation=e.collapse_animation||"slide",this._cardsAnimation=e.cards_animation||"fadeUp",this._cardsStagger=e.cards_stagger||50,this._cardsDirection=e.cards_direction||"sequential"}render(){this._container=document.createElement("div"),this._container.className="expand-mode",this._container.dataset.state=this._active?"expanded":"collapsed",this._container.dataset.expandAnimation=this._expandAnimation,this._container.dataset.collapseAnimation=this._collapseAnimation,this._container.dataset.cardsAnimation=this._cardsAnimation,this._container.dataset.cardsDirection=this._cardsDirection,this._container.style.setProperty("--expand-duration",`${this._animationDuration}ms`),this._container.style.setProperty("--cards-stagger",`${this._cardsStagger}ms`),this._contentWrapper=document.createElement("div"),this._contentWrapper.className="expand-content";let e=document.createElement("div");if(e.className="expand-grid",this._config.grid){let t=this._config.grid,n=t.columns||1;(typeof t.columns=="string"||typeof n=="number"&&n>1||t.display==="grid")&&(e.classList.add("has-grid"),this._applyGridConfig(e,t,{columns:1,gap:"16px"}),t.rows&&(typeof t.rows=="string"?e.style.gridTemplateRows=t.rows:e.style.gridTemplateRows="repeat("+t.rows+", auto)"),t.direction&&(t.direction==="row"||t.direction==="row-reverse"?e.style.gridAutoFlow=t.direction==="row-reverse"?"row dense":"row":(t.direction==="column"||t.direction==="column-reverse")&&(e.style.gridAutoFlow=t.direction==="column-reverse"?"column dense":"column")),t.auto_flow&&(e.style.gridAutoFlow=t.auto_flow),t.dense&&(e.style.gridAutoFlow=(e.style.gridAutoFlow||"row")+" dense"))}return this._loaded||(e.innerHTML=this._renderSkeleton()),this._contentWrapper.appendChild(e),this._container.appendChild(this._contentWrapper),this._container}_renderSkeleton(){let e=this._config.skeleton_count||3;return`
      <div class="skeleton-container">
        ${Array(e).fill(0).map(()=>`
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line text short"></div>
          </div>
        `).join("")}
      </div>
    `}async open(){var e;this._active||(this._active=!0,this._loaded||(await this.loadCards(((e=this._config.body)==null?void 0:e.cards)||[]),this._populateCards()),this._container&&(this._container.classList.remove("collapsing"),this._container.classList.add("expanding"),this._container.dataset.state="expanded",this._container.offsetHeight,await this._waitForTransition(this._container,this._animationDuration+50),this._container.classList.remove("expanding")))}async close(){this._active&&(this._active=!1,this._container&&(this._container.classList.remove("expanding"),this._container.classList.add("collapsing"),this._container.dataset.state="collapsed",await this._waitForTransition(this._container,this._animationDuration+50),this._container.classList.remove("collapsing")))}async toggle(){this._active?await this.close():await this.open()}_populateCards(){var n;if(!this._contentWrapper)return;let e=this._contentWrapper.querySelector(".expand-grid");if(!e)return;let t=e.querySelector(".skeleton-container");t&&(t.classList.add("fade-out"),setTimeout(()=>t.remove(),200)),this._appendCards(e,((n=this._config.body)==null?void 0:n.cards)||[])}static getStyles(){return`
      /* ============================= */
      /* EXPAND MODE */
      /* ============================= */
      
      .expand-mode {
        overflow: hidden;
        will-change: max-height, opacity, transform;
        --expand-duration: 300ms;
      }
      
      /* Base collapsed state */
      .expand-mode[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
        pointer-events: none;
      }
      
      /* Base expanded state */
      .expand-mode[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
        pointer-events: auto;
      }
      
      /* ============================= */
      /* EXPAND ANIMATIONS */
      /* ============================= */
      
      /* None - instant */
      .expand-mode[data-expand-animation="none"][data-state="expanded"] {
        transition: none;
      }
      
      /* Slide (default) */
      .expand-mode[data-expand-animation="slide"] {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease;
      }
      
      /* Fade */
      .expand-mode[data-expand-animation="fade"] {
        transition: opacity var(--expand-duration) ease;
      }
      .expand-mode[data-expand-animation="fade"][data-state="collapsed"] {
        max-height: 0;
      }
      .expand-mode[data-expand-animation="fade"][data-state="expanded"] {
        max-height: 2000px;
      }
      
      /* FadeUp */
      .expand-mode[data-expand-animation="fadeUp"].expanding .expand-content {
        animation: expand-fadeUp var(--expand-duration) ease forwards;
      }
      
      /* FadeDown */
      .expand-mode[data-expand-animation="fadeDown"].expanding .expand-content {
        animation: expand-fadeDown var(--expand-duration) ease forwards;
      }
      
      /* Scale */
      .expand-mode[data-expand-animation="scale"] {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease,
          transform var(--expand-duration) ease;
        transform-origin: top center;
      }
      .expand-mode[data-expand-animation="scale"][data-state="collapsed"] {
        transform: scaleY(0);
      }
      .expand-mode[data-expand-animation="scale"][data-state="expanded"] {
        transform: scaleY(1);
      }
      
      /* Bounce */
      .expand-mode[data-expand-animation="bounce"].expanding .expand-content {
        animation: expand-bounce var(--expand-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      }
      
      /* Flip */
      .expand-mode[data-expand-animation="flip"] {
        perspective: 1000px;
      }
      .expand-mode[data-expand-animation="flip"].expanding .expand-content {
        animation: expand-flip var(--expand-duration) ease forwards;
      }
      
      /* ============================= */
      /* COLLAPSE ANIMATIONS */
      /* ============================= */
      
      /* None */
      .expand-mode[data-collapse-animation="none"][data-state="collapsed"] {
        transition: none;
      }
      
      /* Slide (default) */
      .expand-mode[data-collapse-animation="slide"] {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease;
      }
      
      /* Fade */
      .expand-mode[data-collapse-animation="fade"] {
        transition: opacity var(--expand-duration) ease;
      }
      
      /* FadeDown */
      .expand-mode[data-collapse-animation="fadeDown"].collapsing .expand-content {
        animation: collapse-fadeDown var(--expand-duration) ease forwards;
      }
      
      /* FadeUp */
      .expand-mode[data-collapse-animation="fadeUp"].collapsing .expand-content {
        animation: collapse-fadeUp var(--expand-duration) ease forwards;
      }
      
      /* Scale */
      .expand-mode[data-collapse-animation="scale"].collapsing {
        transform-origin: top center;
        animation: collapse-scale var(--expand-duration) ease forwards;
      }
      
      /* ============================= */
      /* KEYFRAMES */
      /* ============================= */
      
      @keyframes expand-fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes expand-fadeDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes expand-bounce {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes expand-flip {
        from {
          opacity: 0;
          transform: perspective(400px) rotateX(-90deg);
        }
        to {
          opacity: 1;
          transform: perspective(400px) rotateX(0);
        }
      }
      
      @keyframes collapse-fadeDown {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }
      
      @keyframes collapse-fadeUp {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
      
      @keyframes collapse-scale {
        from {
          opacity: 1;
          transform: scaleY(1);
        }
        to {
          opacity: 0;
          transform: scaleY(0);
        }
      }
      
      /* ============================= */
      /* CONTENT STYLES */
      /* ============================= */
      
      .expand-content {
        padding: var(--uc-padding, 16px);
        padding-top: 0;
      }
      
      .expand-grid {
        display: flex;
        flex-direction: column;
        gap: var(--uc-gap, 16px);
      }
      
      .expand-grid.has-grid {
        display: grid !important;
        flex-direction: unset;
      }
      
      /* Card wrapper */
      .expand-mode .card-wrapper {
        min-width: 0;
        --card-index: 0;
      }
      
      .expand-mode .card-wrapper > * {
        height: 100%;
      }
      
      /* Card indices for stagger animation */
      .expand-mode .card-wrapper:nth-child(1) { --card-index: 0; }
      .expand-mode .card-wrapper:nth-child(2) { --card-index: 1; }
      .expand-mode .card-wrapper:nth-child(3) { --card-index: 2; }
      .expand-mode .card-wrapper:nth-child(4) { --card-index: 3; }
      .expand-mode .card-wrapper:nth-child(5) { --card-index: 4; }
      .expand-mode .card-wrapper:nth-child(6) { --card-index: 5; }
      .expand-mode .card-wrapper:nth-child(7) { --card-index: 6; }
      .expand-mode .card-wrapper:nth-child(8) { --card-index: 7; }
      .expand-mode .card-wrapper:nth-child(9) { --card-index: 8; }
      .expand-mode .card-wrapper:nth-child(10) { --card-index: 9; }
      .expand-mode .card-wrapper:nth-child(n+11) { --card-index: 10; }
      
      /* Base card animation */
      .expand-mode[data-state="expanded"] .card-wrapper {
        opacity: 0;
        animation-fill-mode: forwards;
        animation-delay: calc(var(--card-index) * var(--cards-stagger, 50ms));
        animation-duration: var(--expand-duration, 300ms);
      }
      
      /* FadeUp (default) */
      .expand-mode[data-cards-animation="fadeUp"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-fadeUp;
      }
      
      /* FadeDown */
      .expand-mode[data-cards-animation="fadeDown"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-fadeDown;
      }
      
      /* FadeLeft */
      .expand-mode[data-cards-animation="fadeLeft"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-fadeLeft;
      }
      
      /* FadeRight */
      .expand-mode[data-cards-animation="fadeRight"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-fadeRight;
      }
      
      /* Scale */
      .expand-mode[data-cards-animation="scale"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-scale;
      }
      
      /* Bounce */
      .expand-mode[data-cards-animation="bounce"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-bounce;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      /* Flip */
      .expand-mode[data-cards-animation="flip"][data-state="expanded"] .card-wrapper {
        animation-name: expand-card-flip;
      }
      
      /* None - instant */
      .expand-mode[data-cards-animation="none"][data-state="expanded"] .card-wrapper {
        opacity: 1;
        animation: none;
      }
      
      /* Collapsed state */
      .expand-mode[data-state="collapsed"] .card-wrapper {
        opacity: 0;
        animation: none;
      }
      
      /* Card Animation Keyframes */
      @keyframes expand-card-fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes expand-card-fadeDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes expand-card-fadeLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes expand-card-fadeRight {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes expand-card-scale {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes expand-card-bounce {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 0.9; transform: scale(1.05); }
        70% { transform: scale(0.95); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes expand-card-flip {
        from { opacity: 0; transform: perspective(400px) rotateY(-90deg); }
        to { opacity: 1; transform: perspective(400px) rotateY(0); }
      }
      
      /* Skeleton */
      .expand-mode .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .expand-mode .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .expand-mode .skeleton-card {
        padding: 16px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .expand-mode .skeleton-line {
        height: 12px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .expand-mode .skeleton-line.title {
        width: 60%;
        height: 16px;
      }
      
      .expand-mode .skeleton-line.text {
        width: 100%;
      }
      
      .expand-mode .skeleton-line.short {
        width: 40%;
      }
      
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
    `}destroy(){this._contentWrapper=null,super.destroy()}};var rn="__ucOverlayLockCount",Ze="__ucOverlayPrevOverflow";function on(){let r=Number(window[rn]);return Number.isFinite(r)?r:0}function an(r){window[rn]=r}function Qe(){let r=on();r===0&&(window[Ze]=document.body.style.overflow||"",document.body.style.overflow="hidden"),an(r+1)}function ne(){let r=on();if(r<=0)return;let e=r-1;if(an(e),e===0){let t=typeof window[Ze]=="string"?window[Ze]:"";document.body.style.overflow=t,delete window[Ze]}}var ie=class r extends O{constructor(e,t={}){super(e,t),this._overlay=null,this._dialog=null,this._portalTarget=document.body,this._escapeHandler=this._handleEscape.bind(this);let n=e.modal||{};this._width=this._normalizeStringValue(n.width,u.modal_width),this._height=this._normalizeStringValue(n.height,u.modal_height),this._maxWidth=this._normalizeStringValue(n.max_width,u.modal_max_width),this._maxHeight=this._normalizeStringValue(n.max_height,u.modal_max_height),this._backdropBlur=n.backdrop_blur!==!1,this._backdropColor=this._normalizeStringValue(n.backdrop_color,u.backdrop_color),this._closeOnBackdrop=n.close_on_backdrop!==!1,this._closeOnEscape=n.close_on_escape!==!1,this._showClose=n.show_close!==!1}render(){return this._container=document.createElement("div"),this._container.className="modal-mode-placeholder",this._container.style.display="none",this._container.dataset.ucRole="mode-placeholder",this._container.dataset.ucMode="modal",this._container}_renderModal(){this._overlay=document.createElement("div"),this._overlay.className="uc-modal-overlay",this._overlay.dataset.ucRole="overlay",this._overlay.dataset.ucMode="modal",this._overlay.style.setProperty("--modal-backdrop-color",this._backdropColor),this._backdropBlur&&this._overlay.classList.add("with-blur"),this._dialog=document.createElement("div"),this._dialog.className="uc-modal-dialog",this._dialog.dataset.ucRole="dialog",this._dialog.dataset.ucMode="modal",this._dialog.style.setProperty("--modal-width",this._width),this._dialog.style.setProperty("--modal-height",this._height),this._dialog.style.setProperty("--modal-max-width",this._maxWidth),this._dialog.style.setProperty("--modal-max-height",this._maxHeight),this._dialog.dataset.widthMode=this._width==="auto"?"auto":"manual",this._dialog.dataset.heightMode=this._height==="auto"?"auto":"manual",this._dialog.setAttribute("role","dialog"),this._dialog.setAttribute("aria-modal","true"),this._dialog.tabIndex=-1;let e=this._renderHeader(),t=document.createElement("div");t.className="uc-modal-content",t.dataset.ucRole="content";let n=document.createElement("div");n.className="uc-modal-grid",n.dataset.ucRole="grid",this._applyGridConfig(n,this._config.grid,{columns:1,gap:"12px"}),this._loaded||(n.innerHTML=this._renderSkeleton()),t.appendChild(n),e&&this._dialog.appendChild(e),this._dialog.appendChild(t);let i=document.createElement("style");return i.textContent=r.getStyles(),this._overlay.appendChild(i),this._overlay.appendChild(this._dialog),this._applyThemeVariables(this._overlay),this._applyThemeVariables(this._dialog),this._overlay}_renderHeader(){let e=this._config.title||"";if(!e&&!this._showClose)return null;let t=document.createElement("div");t.className="uc-modal-header",t.dataset.ucRole="header";let n=document.createElement("div");if(n.className="uc-modal-title",n.dataset.ucRole="title",n.textContent=e,t.appendChild(n),this._showClose){let i=document.createElement("button");i.type="button",i.className="uc-modal-close",i.dataset.ucRole="close",i.innerHTML='<ha-icon icon="mdi:close"></ha-icon>',i.addEventListener("click",()=>{this.close()}),t.appendChild(i)}return t}_renderSkeleton(){let e=this._config.skeleton_count||3;return`
      <div class="skeleton-container">
        ${Array(e).fill(0).map(()=>`
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line text short"></div>
          </div>
        `).join("")}
      </div>
    `}async open(){var t,n;if(this._active)return;this._active=!0;let e=this._renderModal();this._portalTarget.appendChild(e),Qe(),this._closeOnBackdrop&&this._overlay&&this._overlay.addEventListener("click",i=>{i.target===this._overlay&&this.close()}),this._closeOnEscape&&document.addEventListener("keydown",this._escapeHandler),requestAnimationFrame(()=>{var i,o;(i=this._overlay)==null||i.classList.add("open"),(o=this._dialog)==null||o.classList.add("open")}),this._loaded||await this.loadCards(((t=this._config.body)==null?void 0:t.cards)||[]),this._populateCards(),await new Promise(i=>setTimeout(i,300)),(n=this._dialog)==null||n.focus()}async close(){var e,t,n,i,o;this._active&&(this._active=!1,(e=this._overlay)==null||e.classList.remove("open"),(t=this._dialog)==null||t.classList.remove("open"),await new Promise(a=>setTimeout(a,250)),document.removeEventListener("keydown",this._escapeHandler),(n=this._overlay)==null||n.remove(),this._overlay=null,this._dialog=null,ne(),(o=(i=this._options).onClose)==null||o.call(i))}_handleEscape(e){e.key==="Escape"&&this.close()}_populateCards(){var n;if(!this._dialog)return;let e=this._dialog.querySelector(".uc-modal-grid");if(!e)return;let t=e.querySelector(".skeleton-container");t&&(t.classList.add("fade-out"),setTimeout(()=>t.remove(),200)),this._appendCards(e,((n=this._config.body)==null?void 0:n.cards)||[])}_normalizeStringValue(e,t){return typeof e!="string"?t:e.trim()||t}static getStyles(){return`
      /* ============================= */
      /* MODAL OVERLAY */
      /* ============================= */

      .uc-modal-overlay {
        --modal-overlay-padding: clamp(12px, 3vw, 20px);
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--modal-overlay-padding);
        background: var(--modal-backdrop-color, rgba(0, 0, 0, 0.6));
        opacity: 0;
        transition: opacity 0.25s ease;
      }

      .uc-modal-overlay.with-blur {
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }

      .uc-modal-overlay.open {
        opacity: 1;
      }

      /* ============================= */
      /* MODAL DIALOG */
      /* ============================= */

      .uc-modal-dialog {
        width: var(--modal-width, 90%);
        max-width: min(var(--modal-max-width, 600px), calc(100vw - (2 * var(--modal-overlay-padding))));
        max-height: min(var(--modal-max-height, 85vh), calc(100vh - (2 * var(--modal-overlay-padding))));
        min-width: min(280px, calc(100vw - (2 * var(--modal-overlay-padding))));
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        transform: scale(0.95) translateY(20px);
        opacity: 0;
        transition:
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.3s ease;
      }

      .uc-modal-dialog[data-width-mode="auto"] {
        width: min(calc(100vw - (2 * var(--modal-overlay-padding))), var(--modal-max-width, 600px));
      }

      .uc-modal-dialog[data-height-mode="manual"] {
        height: var(--modal-height, auto);
      }

      .uc-modal-dialog[data-height-mode="auto"] {
        height: auto;
      }

      .uc-modal-dialog.open {
        transform: scale(1) translateY(0);
        opacity: 1;
      }

      /* ============================= */
      /* MODAL HEADER */
      /* ============================= */

      .uc-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }

      .uc-modal-title {
        min-width: 0;
        font-size: 18px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .uc-modal-close {
        background: none;
        border: none;
        padding: 8px;
        margin: -8px;
        cursor: pointer;
        color: var(--secondary-text-color);
        border-radius: 50%;
        transition: background 0.2s ease;
      }

      .uc-modal-close:hover {
        background: rgba(0, 0, 0, 0.1);
      }

      .uc-modal-close ha-icon {
        --mdc-icon-size: 24px;
      }

      /* ============================= */
      /* MODAL CONTENT */
      /* ============================= */

      .uc-modal-content {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
        padding: 12px 16px 16px;
      }

      .uc-modal-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
        align-items: start;
      }

      .uc-modal-grid .card-wrapper {
        min-width: 0;
        min-height: 0;
        animation: modal-card-appear 0.3s ease forwards;
        opacity: 0;
      }

      .uc-modal-grid .card-wrapper > * {
        min-width: 0;
        height: 100%;
      }

      .uc-modal-grid .card-wrapper:nth-child(1) { animation-delay: 50ms; }
      .uc-modal-grid .card-wrapper:nth-child(2) { animation-delay: 100ms; }
      .uc-modal-grid .card-wrapper:nth-child(3) { animation-delay: 150ms; }
      .uc-modal-grid .card-wrapper:nth-child(4) { animation-delay: 200ms; }

      @keyframes modal-card-appear {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Skeleton */
      .uc-modal-content .skeleton-container {
        display: grid;
        grid-template-columns: inherit;
        gap: inherit;
        grid-column: 1 / -1;
        transition: opacity 0.2s ease;
      }

      .uc-modal-content .skeleton-container.fade-out {
        opacity: 0;
      }

      .uc-modal-content .skeleton-card {
        padding: 14px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
      }

      .uc-modal-content .skeleton-line {
        height: 12px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }

      .uc-modal-content .skeleton-line.title {
        width: 60%;
        height: 16px;
      }

      .uc-modal-content .skeleton-line.text {
        width: 100%;
      }

      .uc-modal-content .skeleton-line.short {
        width: 40%;
      }

      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }

      @media (max-width: 767px) {
        .uc-modal-overlay {
          align-items: stretch;
        }

        .uc-modal-dialog {
          width: calc(100vw - (2 * var(--modal-overlay-padding))) !important;
          min-width: 0;
          max-height: calc(100vh - (2 * var(--modal-overlay-padding)));
        }

        .uc-modal-content {
          padding: 10px 12px 12px;
        }

        .uc-modal-grid {
          grid-template-columns: minmax(0, 1fr) !important;
          gap: 10px;
        }
      }
    `}destroy(){var e;this._active&&(ne(),(e=this._overlay)==null||e.remove()),document.removeEventListener("keydown",this._escapeHandler),this._overlay=null,this._dialog=null,super.destroy()}};var re=class r extends O{constructor(e,t={}){super(e,t),this._overlay=null,this._escapeHandler=this._handleEscape.bind(this);let n=e.fullscreen||{};this._width=n.width||"100%",this._height=n.height||"100%",this._background=n.background||"var(--primary-background-color, #fafafa)",this._showClose=n.show_close!==!1,this._closeOnEscape=n.close_on_escape!==!1,this._maxWidth=n.max_width||"1200px",this._maxHeight=n.max_height||"100vh",this._padding=n.padding||"16px"}render(){return this._container=document.createElement("div"),this._container.className="fullscreen-mode-placeholder",this._container.style.display="none",this._container.dataset.ucRole="mode-placeholder",this._container.dataset.ucMode="fullscreen",this._container}_renderFullscreen(){this._overlay=document.createElement("div"),this._overlay.className="uc-fullscreen-overlay",this._overlay.dataset.ucRole="overlay",this._overlay.dataset.ucMode="fullscreen",this._overlay.style.setProperty("--fullscreen-bg",this._background);let e=document.createElement("div");e.className="uc-fullscreen-inner",e.dataset.ucRole="dialog",e.dataset.ucMode="fullscreen",e.style.width=this._width,e.style.height=this._height,e.style.maxWidth=this._maxWidth,e.style.maxHeight=this._maxHeight;let t=this._renderHeader(),n=document.createElement("div");n.className="uc-fullscreen-content",n.dataset.ucRole="content",n.style.padding=this._padding;let i=document.createElement("div");i.className="uc-fullscreen-grid",i.dataset.ucRole="grid",this._applyGridConfig(i,this._config.grid,{columns:1,gap:"16px"}),this._loaded||(i.innerHTML=this._renderSkeleton()),n.appendChild(i),e.appendChild(t),e.appendChild(n);let o=document.createElement("style");return o.textContent=r.getStyles(),this._overlay.appendChild(o),this._overlay.appendChild(e),this._applyThemeVariables(this._overlay),this._applyThemeVariables(e),this._overlay}_renderHeader(){let e=document.createElement("div");if(e.className="uc-fullscreen-header",e.dataset.ucRole="header",this._showClose){let i=document.createElement("button");i.type="button",i.className="uc-fullscreen-back",i.dataset.ucRole="close",i.innerHTML='<ha-icon icon="mdi:arrow-left"></ha-icon>',i.addEventListener("click",()=>{this.close()}),e.appendChild(i)}let t=document.createElement("div");t.className="uc-fullscreen-title",t.dataset.ucRole="title",t.textContent=this._config.title||"",e.appendChild(t);let n=document.createElement("div");return n.className="uc-fullscreen-spacer",n.dataset.ucRole="spacer",e.appendChild(n),e}_renderSkeleton(){let e=this._config.skeleton_count||3;return`
      <div class="skeleton-container">
        ${Array(e).fill(0).map(()=>`
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line text short"></div>
          </div>
        `).join("")}
      </div>
    `}async open(){var t;if(this._active)return;this._active=!0;let e=this._renderFullscreen();document.body.appendChild(e),Qe(),this._closeOnEscape&&document.addEventListener("keydown",this._escapeHandler),requestAnimationFrame(()=>{var n;(n=this._overlay)==null||n.classList.add("open")}),this._loaded||await this.loadCards(((t=this._config.body)==null?void 0:t.cards)||[]),this._populateCards(),await new Promise(n=>setTimeout(n,300))}async close(){var e,t,n,i,o;this._active&&(this._active=!1,(e=this._overlay)==null||e.classList.remove("open"),(t=this._overlay)==null||t.classList.add("closing"),await new Promise(a=>setTimeout(a,250)),document.removeEventListener("keydown",this._escapeHandler),(n=this._overlay)==null||n.remove(),this._overlay=null,ne(),(o=(i=this._options).onClose)==null||o.call(i))}_handleEscape(e){e.key==="Escape"&&this.close()}_populateCards(){var n;if(!this._overlay)return;let e=this._overlay.querySelector(".uc-fullscreen-grid");if(!e)return;let t=e.querySelector(".skeleton-container");t&&(t.classList.add("fade-out"),setTimeout(()=>t.remove(),200)),this._appendCards(e,((n=this._config.body)==null?void 0:n.cards)||[])}static getStyles(){return`
      /* ============================= */
      /* FULLSCREEN OVERLAY */
      /* ============================= */
      
      .uc-fullscreen-overlay {
        position: fixed;
        inset: 0;
        z-index: 1001;
        background: var(--fullscreen-bg, var(--primary-background-color, #fafafa));
        transform: translateY(100%);
        opacity: 0;
        transition: 
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.3s ease;
      }
      
      .uc-fullscreen-overlay.open {
        transform: translateY(0);
        opacity: 1;
      }
      
      .uc-fullscreen-overlay.closing {
        transform: translateY(100%);
        opacity: 0;
      }
      
      /* ============================= */
      /* FULLSCREEN INNER */
      /* ============================= */
      
      .uc-fullscreen-inner {
        width: 100%;
        height: 100%;
        max-width: 1200px;
        max-height: 100vh;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
      }
      
      /* ============================= */
      /* FULLSCREEN HEADER */
      /* ============================= */
      
      .uc-fullscreen-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .uc-fullscreen-back {
        background: none;
        border: none;
        padding: 8px;
        margin: -8px;
        margin-right: 4px;
        cursor: pointer;
        color: var(--primary-text-color);
        border-radius: 50%;
        transition: background 0.2s ease;
      }
      
      .uc-fullscreen-back:hover {
        background: rgba(0, 0, 0, 0.1);
      }
      
      .uc-fullscreen-back ha-icon {
        --mdc-icon-size: 24px;
      }
      
      .uc-fullscreen-title {
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }
      
      .uc-fullscreen-spacer {
        flex: 1;
      }
      
      /* ============================= */
      /* FULLSCREEN CONTENT */
      /* ============================= */
      
      .uc-fullscreen-content {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        min-height: 0;
      }

      .uc-fullscreen-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
      }
      
      .uc-fullscreen-grid .card-wrapper {
        min-width: 0;
        animation: fullscreen-card-appear 0.3s ease forwards;
        opacity: 0;
      }
      
      .uc-fullscreen-grid .card-wrapper:nth-child(1) { animation-delay: 100ms; }
      .uc-fullscreen-grid .card-wrapper:nth-child(2) { animation-delay: 150ms; }
      .uc-fullscreen-grid .card-wrapper:nth-child(3) { animation-delay: 200ms; }
      .uc-fullscreen-grid .card-wrapper:nth-child(4) { animation-delay: 250ms; }
      
      @keyframes fullscreen-card-appear {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Skeleton */
      .uc-fullscreen-content .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .uc-fullscreen-content .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .uc-fullscreen-content .skeleton-card {
        padding: 16px;
        background: var(--ha-card-background, white);
        border-radius: 8px;
        margin-bottom: 8px;
        box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,0.1));
      }
      
      .uc-fullscreen-content .skeleton-line {
        height: 12px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .uc-fullscreen-content .skeleton-line.title {
        width: 60%;
        height: 16px;
      }

      .uc-fullscreen-content .skeleton-line.text {
        width: 100%;
      }

      .uc-fullscreen-content .skeleton-line.short {
        width: 40%;
      }

      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
    `}destroy(){var e;this._active&&(ne(),(e=this._overlay)==null||e.remove()),document.removeEventListener("keydown",this._escapeHandler),this._overlay=null,super.destroy()}};var V=class extends O{constructor(e,t={}){super(e,t),this._tabCards={},this._tabPoolKeys={},this._loadedTabs={},this._tabBar=null,this._tabContent=null,this._tabs=Array.isArray(e.tabs)?e.tabs:[];let n=Number.isFinite(t.activeTab)?Number(t.activeTab):0;this._activeTab=Math.max(0,Math.min(n,Math.max(this._tabs.length-1,0))),this._onTabChange=typeof t.onTabChange=="function"?t.onTabChange:null;let i=e.tabs_config||{};this._tabPosition=typeof i.position=="string"&&i.position?i.position:"top",this._showIcons=i.show_icons!==!1,this._showLabels=i.show_labels!==!1,this._contentPadding=typeof i.content_padding=="string"&&i.content_padding?i.content_padding:"16px",this._tabMinWidth=typeof i.tab_min_width=="string"&&i.tab_min_width?i.tab_min_width:"72px",this._tabAlignment=typeof i.tab_alignment=="string"&&i.tab_alignment?i.tab_alignment:Ee.START}render(){return this._container=document.createElement("div"),this._container.className="tabs-mode",this._container.dataset.state=this.active?"expanded":"collapsed",this._container.dataset.tabPosition=this._tabPosition,this._container.dataset.tabAlignment=this._tabAlignment,this._container.dataset.ucRole="mode-root",this._container.dataset.ucMode="tabs",this._container.style.setProperty("--uc-tabs-content-padding",this._contentPadding),this._container.style.setProperty("--uc-tabs-tab-min-width",this._tabMinWidth),this._tabBar=this._renderTabBar(),this._tabContent=document.createElement("div"),this._tabContent.className="tabs-content",this._tabContent.dataset.ucRole="content",this._tabs.forEach((e,t)=>{var i;let n=this._renderTabPanel(e,t);(i=this._tabContent)==null||i.appendChild(n)}),this._tabPosition==="bottom"?(this._container.appendChild(this._tabContent),this._container.appendChild(this._tabBar)):(this._container.appendChild(this._tabBar),this._container.appendChild(this._tabContent)),this._container}_renderTabBar(){let e=document.createElement("div");e.className="tabs-bar",e.setAttribute("role","tablist"),e.dataset.ucRole="tab-bar",this._tabs.forEach((n,i)=>{let o=document.createElement("button");if(o.className="tab-button",o.setAttribute("role","tab"),o.setAttribute("aria-selected",i===this._activeTab?"true":"false"),o.dataset.index=String(i),o.dataset.ucRole="tab",i===this._activeTab&&o.classList.add("active"),this._showIcons&&typeof n.icon=="string"&&n.icon){let s=document.createElement("ha-icon");s.setAttribute("icon",n.icon),o.appendChild(s)}let a=n.label||n.title;if(this._showLabels&&typeof a=="string"&&a){let s=document.createElement("span");s.className="tab-label",s.dataset.ucRole="tab-label",s.textContent=a,o.appendChild(s)}o.addEventListener("click",()=>{this._selectTab(i)}),e.appendChild(o)});let t=document.createElement("div");return t.className="tab-indicator",t.dataset.ucRole="tab-indicator",e.appendChild(t),e}_renderTabPanel(e,t){let n=document.createElement("div");n.className="tab-panel",n.setAttribute("role","tabpanel"),n.dataset.index=String(t),n.dataset.ucRole="tab-panel",t===this._activeTab&&n.classList.add("active");let i=document.createElement("div");i.className="tab-grid",i.dataset.ucRole="grid";let o=e.grid||this._config.grid||{};return this._applyGridConfig(i,o,{columns:1,gap:"16px"}),t===this._activeTab&&i.appendChild(this._renderSkeleton()),n.appendChild(i),n}_renderSkeleton(){let e=typeof this._config.skeleton_count=="number"&&this._config.skeleton_count>0?Math.floor(this._config.skeleton_count):2,t=document.createElement("div");t.className="skeleton-container";for(let n=0;n<e;n+=1){let i=document.createElement("div");i.className="skeleton-card";let o=document.createElement("div");o.className="skeleton-line title";let a=document.createElement("div");a.className="skeleton-line text",i.appendChild(o),i.appendChild(a),t.appendChild(i)}return t}async _selectTab(e){var n;if(e===this._activeTab||e<0||e>=this._tabs.length)return;let t=this._activeTab;this._activeTab=e,this._updateTabButtons(),this._updateIndicator(),this._updatePanels(t,e),(n=this._onTabChange)==null||n.call(this,e),this._loadedTabs[e]||await this._loadTabCards(e)}_updateTabButtons(){var t;let e=(t=this._tabBar)==null?void 0:t.querySelectorAll(".tab-button");e==null||e.forEach((n,i)=>{let o=i===this._activeTab;n.classList.toggle("active",o),n.setAttribute("aria-selected",o?"true":"false")})}_updateIndicator(){var n,i;let e=(n=this._tabBar)==null?void 0:n.querySelector(".tab-indicator"),t=(i=this._tabBar)==null?void 0:i.querySelector(`.tab-button[data-index="${this._activeTab}"]`);!e||!t||(e.style.left=`${t.offsetLeft}px`,e.style.width=`${t.offsetWidth}px`)}_updatePanels(e,t){var i;let n=(i=this._tabContent)==null?void 0:i.querySelectorAll(".tab-panel");n==null||n.forEach((o,a)=>{let s=a===t;o.classList.toggle("active",s),s&&(o.classList.remove("slide-left","slide-right"),o.classList.add(t>e?"slide-from-right":"slide-from-left"))})}async _loadTabCards(e){let t=this._tabs[e],n=Array.isArray(t==null?void 0:t.cards)?t.cards:[];if(n.length===0){this._loadedTabs[e]=!0;return}let i=this._getTabPoolKey(e,n);if(this._tabPoolKeys[e]=i,this._poolEnabled&&i){let o=R.acquire(i);if(o&&o.length===n.length){this._tabCards[e]=o,this._loadedTabs[e]=!0,this._mountTabCards(e,n);return}}try{let o=await this._getCardHelpers();this._tabCards[e]=await Promise.all(n.map(a=>this._createCard(a,o))),this._loadedTabs[e]=!0,this._mountTabCards(e,n)}catch(o){console.error(`[UniversalCard] Failed to load tab ${e} cards:`,o),this._loadedTabs[e]=!0}}_mountTabCards(e,t){var s;let n=(s=this._tabContent)==null?void 0:s.querySelector(`.tab-panel[data-index="${e}"]`),i=n==null?void 0:n.querySelector(".tab-grid");if(!i)return;let o=i.querySelector(".skeleton-container");o&&(o.classList.add("fade-out"),setTimeout(()=>o.remove(),200));let a=document.createDocumentFragment();(this._tabCards[e]||[]).forEach((l,c)=>{var S,k,w,P;this._hass&&(l.hass=this._hass);let m=document.createElement("div");m.className="card-wrapper";let b=t[c],_=(k=b==null?void 0:b.colspan)!=null?k:(S=b==null?void 0:b.card_options)==null?void 0:S.colspan,y=(P=b==null?void 0:b.rowspan)!=null?P:(w=b==null?void 0:b.card_options)==null?void 0:w.rowspan;typeof _=="number"&&_>0&&(m.style.gridColumn=`span ${_}`),typeof y=="number"&&y>0&&(m.style.gridRow=`span ${y}`),m.appendChild(l),a.appendChild(m)}),i.appendChild(a)}_getTabPoolKey(e,t){if(!this._poolEnabled||!Array.isArray(t)||t.length===0)return null;let n=this._resolvePoolScope(),i=this._getPoolScopeToken(n);if(!i)return null;let o;try{o=JSON.stringify(t)}catch(s){return null}let a=`${i}:tabs:${e}:${o}`;return`uc-mode-pool:${n}:tabs:${this._hashString(a)}`}set hass(e){this._hass=e,Object.values(this._tabCards).forEach(t=>{t.forEach(n=>{if(n)try{n.hass=e}catch(i){}})})}async open(){var e;this._active||(this._active=!0,this._container&&(this._container.dataset.state="expanded"),requestAnimationFrame(()=>{this._updateIndicator()}),this._loadedTabs[this._activeTab]||await this._loadTabCards(this._activeTab),(e=this._onTabChange)==null||e.call(this,this._activeTab))}async close(){this._active&&(this._active=!1,this._container&&(this._container.dataset.state="collapsed"))}static getStyles(){return`
      /* ============================= */
      /* TABS MODE */
      /* ============================= */
      
      .tabs-mode {
        overflow: hidden;
        transition: 
          max-height var(--uc-transition-duration, 300ms) ease,
          opacity var(--uc-transition-duration, 300ms) ease;
      }
      
      .tabs-mode[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
      }
      
      .tabs-mode[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
      }
      
      /* ============================= */
      /* TAB BAR */
      /* ============================= */
      
      .tabs-bar {
        display: flex;
        position: relative;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        overflow-x: auto;
        scrollbar-width: none;
        justify-content: flex-start;
      }
      
      .tabs-bar::-webkit-scrollbar {
        display: none;
      }
      
      .tabs-mode[data-tab-position="bottom"] .tabs-bar {
        border-bottom: none;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      
      /* ============================= */
      /* TAB BUTTON */
      /* ============================= */
      
      .tab-button {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 12px 16px;
        min-width: var(--uc-tabs-tab-min-width, 72px);
        background: none;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        transition: color 0.2s ease;
        flex-shrink: 0;
      }
      
      .tab-button:hover {
        color: var(--primary-text-color);
      }
      
      .tab-button.active {
        color: var(--primary-color);
      }
      
      .tab-button ha-icon {
        --mdc-icon-size: 24px;
      }
      
      .tab-label {
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        white-space: nowrap;
      }
      
      /* ============================= */
      /* TAB INDICATOR */
      /* ============================= */
      
      .tab-indicator {
        position: absolute;
        bottom: 0;
        height: 2px;
        background: var(--primary-color);
        transition: left 0.25s ease, width 0.25s ease;
      }
      
      .tabs-mode[data-tab-position="bottom"] .tab-indicator {
        bottom: auto;
        top: 0;
      }
      
      /* ============================= */
      /* TAB CONTENT */
      /* ============================= */
      
      .tabs-content {
        position: relative;
        overflow: hidden;
      }

      .tab-panel {
        display: none;
        padding: var(--uc-tabs-content-padding, var(--uc-padding, 16px));
      }
      
      .tab-panel.active {
        display: block;
        animation: tab-panel-appear 0.25s ease;
      }
      
      @keyframes tab-panel-appear {
        from {
          opacity: 0;
          transform: translateX(10px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .tab-panel.slide-from-right {
        animation-name: tab-slide-from-right;
      }
      
      .tab-panel.slide-from-left {
        animation-name: tab-slide-from-left;
      }
      
      @keyframes tab-slide-from-right {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes tab-slide-from-left {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      /* ============================= */
      /* TAB GRID */
      /* ============================= */
      
      .tab-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 16px;
      }

      .tabs-mode[data-tab-alignment="center"] .tabs-bar {
        justify-content: center;
      }

      .tabs-mode[data-tab-alignment="stretch"] .tab-button {
        flex: 1 1 0;
        min-width: 0;
      }
      
      .tab-grid .card-wrapper {
        min-width: 0;
        animation: card-appear 0.3s ease forwards;
        opacity: 0;
      }
      
      .tab-grid .card-wrapper:nth-child(1) { animation-delay: 0ms; }
      .tab-grid .card-wrapper:nth-child(2) { animation-delay: 50ms; }
      .tab-grid .card-wrapper:nth-child(3) { animation-delay: 100ms; }
      
      /* Skeleton */
      .tab-panel .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .tab-panel .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .tab-panel .skeleton-card {
        padding: 16px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .tab-panel .skeleton-line {
        height: 12px;
        background: var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .tab-panel .skeleton-line.title {
        width: 60%;
        height: 16px;
      }
    `}destroy(){if(this._poolEnabled){let e=this._getPoolReleaseOptions();Object.entries(this._tabCards).forEach(([t,n])=>{let i=this._tabPoolKeys[Number(t)];i&&Array.isArray(n)&&n.length>0&&R.release(i,n,e)})}this._tabBar=null,this._tabContent=null,this._tabCards={},this._tabPoolKeys={},this._loadedTabs={},this._onTabChange=null,super.destroy()}};var F=class extends O{constructor(e,t={}){super(e,t);let n=Number.isFinite(t.startIndex)?Number(t.startIndex):0;this._currentIndex=Math.max(0,n),this._onSlideChange=typeof t.onSlideChange=="function"?t.onSlideChange:null,this._track=null,this._indicators=null,this._autoplayTimer=null,this._touchStartX=0,this._touchCurrentX=0,this._isDragging=!1,this._autoplay=e.carousel_autoplay===!0,this._interval=typeof e.carousel_interval=="number"&&e.carousel_interval>0?e.carousel_interval:5e3;let i=e.carousel_options||{};this._showIndicators=i.show_indicators!==!1,this._showArrows=i.show_arrows!==!1,this._loop=i.loop!==!1,this._swipeThreshold=typeof i.swipe_threshold=="number"&&i.swipe_threshold>=0?i.swipe_threshold:50,this._height=typeof i.height=="string"&&i.height?i.height:"auto"}render(){this._container=document.createElement("div"),this._container.className="carousel-mode",this._container.dataset.state=this.active?"expanded":"collapsed",this._container.dataset.ucRole="mode-root",this._container.dataset.ucMode="carousel";let e=document.createElement("div");e.className="carousel-viewport",e.dataset.ucRole="viewport",e.style.height=this._height,this._showArrows&&e.appendChild(this._createArrowButton("carousel-arrow carousel-arrow-prev","mdi:chevron-left",()=>{this._goTo(this._currentIndex-1)}));let t=document.createElement("div");return t.className="carousel-track-wrapper",t.dataset.ucRole="track-wrapper",this._track=document.createElement("div"),this._track.className="carousel-track",this._track.dataset.ucRole="track",t.appendChild(this._track),e.appendChild(t),this._showArrows&&e.appendChild(this._createArrowButton("carousel-arrow carousel-arrow-next","mdi:chevron-right",()=>{this._goTo(this._currentIndex+1)})),this._container.appendChild(e),this._showIndicators&&(this._indicators=this._renderIndicators(),this._container.appendChild(this._indicators)),this._bindTouchEvents(t),this._container}_createArrowButton(e,t,n){let i=document.createElement("button");i.className=e,i.dataset.ucRole="carousel-arrow",i.dataset.ucDirection=e.includes("prev")?"prev":"next";let o=document.createElement("ha-icon");return o.setAttribute("icon",t),i.appendChild(o),i.addEventListener("click",n),i}_renderArrows(){let e=document.createDocumentFragment();return e.appendChild(this._createArrowButton("carousel-arrow carousel-arrow-prev","mdi:chevron-left",()=>{this._goTo(this._currentIndex-1)})),e.appendChild(this._createArrowButton("carousel-arrow carousel-arrow-next","mdi:chevron-right",()=>{this._goTo(this._currentIndex+1)})),e}_renderIndicators(){let e=document.createElement("div");return e.className="carousel-indicators",e.dataset.ucRole="indicators",e}_updateIndicators(){if(!this._indicators||this._cards.length===0)return;this._indicators.innerHTML="";let e=document.createDocumentFragment();this._cards.forEach((t,n)=>{let i=document.createElement("button");i.className="carousel-indicator",i.dataset.ucRole="indicator",n===this._currentIndex&&i.classList.add("active"),i.dataset.index=String(n),i.setAttribute("aria-label",`Slide ${n+1}`),i.addEventListener("click",()=>{this._goTo(n)}),e.appendChild(i)}),this._indicators.appendChild(e)}_goTo(e){var n;let t=this._cards.length;if(t!==0){if(this._loop)e<0&&(e=t-1),e>=t&&(e=0);else if(e<0||e>=t)return;this._currentIndex=e,this._updateTrackPosition(),this._updateIndicatorStates(),(n=this._onSlideChange)==null||n.call(this,e),this._autoplay&&this._active&&this._startAutoplay()}}next(){this._goTo(this._currentIndex+1)}prev(){this._goTo(this._currentIndex-1)}_updateTrackPosition(){if(!this._track)return;let e=-this._currentIndex*100;this._track.style.transform=`translateX(${e}%)`}_updateIndicatorStates(){this._indicators&&this._indicators.querySelectorAll(".carousel-indicator").forEach((e,t)=>{e.classList.toggle("active",t===this._currentIndex)})}_bindTouchEvents(e){e.addEventListener("touchstart",t=>{this._onTouchStart(t)},{passive:!0}),e.addEventListener("touchmove",t=>{this._onTouchMove(t)},{passive:!0}),e.addEventListener("touchend",t=>{this._onTouchEnd(t)}),e.addEventListener("mousedown",t=>{this._onMouseDown(t)}),e.addEventListener("mousemove",t=>{this._onMouseMove(t)}),e.addEventListener("mouseup",()=>{this._onMouseUp()}),e.addEventListener("mouseleave",()=>{this._onMouseUp()})}_onTouchStart(e){this._isDragging=!0,this._touchStartX=e.touches[0].clientX,this._touchCurrentX=this._touchStartX,this._stopAutoplay()}_onTouchMove(e){if(!this._isDragging)return;this._touchCurrentX=e.touches[0].clientX;let t=this._touchCurrentX-this._touchStartX,n=-this._currentIndex*100,i=t/this._getContainerWidth()*100;this._track&&(this._track.style.transition="none",this._track.style.transform=`translateX(${n+i}%)`)}_onTouchEnd(e){if(!this._isDragging)return;this._isDragging=!1;let t=this._touchCurrentX-this._touchStartX;this._track&&(this._track.style.transition=""),Math.abs(t)>this._swipeThreshold?t>0?this.prev():this.next():this._updateTrackPosition(),this._autoplay&&this._active&&this._startAutoplay()}_onMouseDown(e){e.button===0&&(this._isDragging=!0,this._touchStartX=e.clientX,this._touchCurrentX=this._touchStartX,this._stopAutoplay())}_onMouseMove(e){if(!this._isDragging)return;this._touchCurrentX=e.clientX;let t=this._touchCurrentX-this._touchStartX,n=-this._currentIndex*100,i=t/this._getContainerWidth()*100;this._track&&(this._track.style.transition="none",this._track.style.transform=`translateX(${n+i}%)`)}_onMouseUp(){if(!this._isDragging)return;this._isDragging=!1;let e=this._touchCurrentX-this._touchStartX;this._track&&(this._track.style.transition=""),Math.abs(e)>this._swipeThreshold?e>0?this.prev():this.next():this._updateTrackPosition(),this._autoplay&&this._active&&this._startAutoplay()}_getContainerWidth(){var t;let e=(t=this._container)==null?void 0:t.offsetWidth;return typeof e=="number"&&e>0?e:1}_startAutoplay(){this._stopAutoplay(),this._autoplay&&(this._autoplayTimer=setInterval(()=>{this.next()},this._interval))}_stopAutoplay(){this._autoplayTimer!==null&&(clearInterval(this._autoplayTimer),this._autoplayTimer=null)}async open(){var e;this._active||(this._active=!0,this._container&&(this._container.dataset.state="expanded"),this._loaded||(await this.loadCards(this._getCardsConfig()),this._populateSlides()),(e=this._onSlideChange)==null||e.call(this,this._currentIndex),this._autoplay&&this._startAutoplay())}async close(){this._active&&(this._active=!1,this._container&&(this._container.dataset.state="collapsed"),this._stopAutoplay())}_getCardsConfig(){var e;return Array.isArray((e=this._config.body)==null?void 0:e.cards)?this._config.body.cards:Array.isArray(this._config.cards)?this._config.cards:[]}_populateSlides(){if(!this._track)return;this._cards.length>0&&this._currentIndex>=this._cards.length&&(this._currentIndex=0);let e=document.createDocumentFragment();this._cards.forEach((t,n)=>{this._hass&&(t.hass=this._hass);let i=document.createElement("div");i.className="carousel-slide",i.dataset.index=String(n),i.appendChild(t),e.appendChild(i)}),this._track.appendChild(e),this._updateIndicators(),this._updateTrackPosition()}static getStyles(){return`
      /* ============================= */
      /* CAROUSEL MODE */
      /* ============================= */
      
      .carousel-mode {
        overflow: hidden;
        transition: 
          max-height var(--uc-transition-duration, 300ms) ease,
          opacity var(--uc-transition-duration, 300ms) ease;
      }
      
      .carousel-mode[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
      }
      
      .carousel-mode[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
      }
      
      /* ============================= */
      /* VIEWPORT */
      /* ============================= */
      
      .carousel-viewport {
        position: relative;
        display: flex;
        align-items: stretch;
        height: auto;
      }
      
      .carousel-track-wrapper {
        flex: 1;
        overflow: hidden;
        min-width: 0;
      }
      
      /* ============================= */
      /* TRACK */
      /* ============================= */
      
      .carousel-track {
        display: flex;
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
      }
      
      /* ============================= */
      /* SLIDE */
      /* ============================= */
      
      .carousel-slide {
        flex: 0 0 100%;
        min-width: 100%;
        padding: var(--uc-padding, 16px);
        box-sizing: border-box;
      }
      
      .carousel-slide > * {
        height: 100%;
      }
      
      /* ============================= */
      /* ARROWS */
      /* ============================= */
      
      .carousel-arrow {
        flex-shrink: 0;
        width: 28px;
        background: rgba(255, 255, 255, 0.05);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s ease;
        opacity: 0.6;
      }
      
      .carousel-arrow:hover {
        background: rgba(255, 255, 255, 0.15);
        opacity: 1;
      }
      
      .carousel-arrow-prev {
        border-radius: 8px 0 0 8px;
      }
      
      .carousel-arrow-next {
        border-radius: 0 8px 8px 0;
      }
      
      .carousel-arrow ha-icon {
        --mdc-icon-size: 16px;
        color: var(--primary-text-color);
      }
      
      /* ============================= */
      /* INDICATORS */
      /* ============================= */
      
      .carousel-indicators {
        display: flex;
        justify-content: center;
        gap: 8px;
        padding: 12px;
      }
      
      .carousel-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--divider-color, rgba(0, 0, 0, 0.2));
        border: none;
        padding: 0;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }
      
      .carousel-indicator:hover {
        background: var(--secondary-text-color);
        transform: scale(1.2);
      }
      
      .carousel-indicator.active {
        background: var(--primary-color);
        transform: scale(1.2);
      }
    `}destroy(){this._stopAutoplay(),this._track=null,this._indicators=null,this._onSlideChange=null,super.destroy()}};var oe=class extends O{constructor(e,t={}){super(e,t);let n=e.subview||{};this._path=n.path||n.navigation_path||"",this._replaceState=n.replace_state===!0,this._returnOnClose=n.return_on_close===!0,this._previousPath=null}render(){return this._container=document.createElement("div"),this._container.className="subview-mode-placeholder",this._container.style.display="none",this._container.dataset.ucRole="mode-placeholder",this._container.dataset.ucMode="subview",this._container}async open(){var e,t;if(!this._active){if(!this._path){console.warn("[UniversalCard] subview.path is required for subview mode");return}this._active=!0,this._previousPath=window.location.pathname+window.location.search+window.location.hash,this._replaceState?history.replaceState(null,"",this._path):history.pushState(null,"",this._path),window.dispatchEvent(new CustomEvent("location-changed")),(t=(e=this._options).onOpen)==null||t.call(e)}}async close(){var e,t;this._active&&(this._active=!1,this._returnOnClose&&this._previousPath&&window.location.pathname+window.location.search+window.location.hash!==this._previousPath&&(history.pushState(null,"",this._previousPath),window.dispatchEvent(new CustomEvent("location-changed"))),(t=(e=this._options).onClose)==null||t.call(e))}static getStyles(){return`
      .subview-mode-placeholder {
        display: none;
      }
    `}destroy(){this._previousPath=null,super.destroy()}};var Wn={expand:te,modal:ie,fullscreen:re,tabs:V,carousel:F,subview:oe};function sn(r,e,t={}){let n=Wn[r];return n?new n(e,t):(console.warn(`[UniversalCard] Unknown mode type: ${r}`),null)}function dn(){return[te.getStyles(),ie.getStyles(),re.getStyles(),V.getStyles(),F.getStyles(),oe.getStyles()].join(`
`)}var Zn=`
  /* ============================= */
  /* HEADER */
  /* ============================= */
  
  .header {
    display: flex;
    align-items: center;
    padding: var(--uc-padding, 16px);
    gap: var(--uc-header-gap, 12px);
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease;
    position: relative;
  }
  
  .header:hover {
    background: var(--uc-header-hover-bg, rgba(0, 0, 0, 0.04));
  }
  
  .header:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }
  
  .header:active {
    background: var(--uc-header-active-bg, rgba(0, 0, 0, 0.08));
  }
  
  .header.non-clickable {
    cursor: default;
  }
  
  .header.non-clickable:hover,
  .header.non-clickable:active {
    background: transparent;
  }
  
  /* Sticky Header */
  .header.sticky {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--ha-card-background, var(--card-background-color, white));
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* ============================= */
  /* HEADER LEFT */
  /* ============================= */
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  
  .header-left:empty {
    display: none;
  }
  
  .header-icon {
    --mdc-icon-size: 24px;
    color: var(--uc-icon-color, var(--primary-color));
    transition: color 0.2s ease, transform 0.2s ease;
  }
  
  .header.expanded .header-icon {
    color: var(--uc-icon-active-color, var(--accent-color, var(--primary-color)));
  }
  
  .header-left-slot {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .header-left-slot:empty {
    display: none;
  }
  
  /* ============================= */
  /* HEADER CONTENT */
  /* ============================= */
  
  .header-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--uc-header-content-gap, 2px);
  }
  
  .header-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }
  
  .header-subtitle {
    font-size: 14px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }
  
  /* Badges in header (right side) */
  .header-badges {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 6px;
  }
  
  .header-badges:empty {
    display: none;
  }
  
  /* Cards slot in header */
  .header-cards-slot {
    margin-top: 8px;
  }
  
  .header-cards-slot:empty {
    display: none;
    margin-top: 0;
  }

  .header-content-badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
  }

  .header-content-badges:empty {
    display: none;
  }
  
  /* ============================= */
  /* HEADER RIGHT */
  /* ============================= */
  
  .header-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: auto;
    gap: 8px;
  }
  
  .header-right:empty {
    display: none;
  }
  
  .header-right-slot {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .header-right-slot:empty {
    display: none;
  }

  .header[data-layout-variant="stacked"],
  .header[data-layout-variant="centered"] {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      "left spacer right"
      "content content content";
    align-items: start;
  }

  .header[data-layout-variant="stacked"] .header-left,
  .header[data-layout-variant="centered"] .header-left {
    grid-area: left;
  }

  .header[data-layout-variant="stacked"] .header-content,
  .header[data-layout-variant="centered"] .header-content {
    grid-area: content;
    margin-top: 4px;
  }

  .header[data-layout-variant="stacked"] .header-right,
  .header[data-layout-variant="centered"] .header-right {
    grid-area: right;
    margin-left: 0;
    justify-self: end;
  }

  .header[data-content-align="center"] .header-content {
    align-items: center;
    text-align: center;
  }

  .header[data-content-align="end"] .header-content {
    align-items: flex-end;
    text-align: right;
  }

  .header[data-layout-variant="centered"] .header-content {
    align-items: center;
    text-align: center;
  }
  
  /* Expand Icon */
  .expand-icon {
    --mdc-icon-size: 24px;
    color: var(--secondary-text-color);
    transition: transform var(--uc-transition-duration, 300ms) ease;
    will-change: transform;
  }
  
  .expand-icon.expanded {
    transform: rotate(180deg);
  }
  
  /* ============================= */
  /* HEADER BADGES */
  /* ============================= */
  
  .badge {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
    padding: 3px 8px;
    background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 15%, transparent);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    color: var(--badge-color, var(--primary-color));
    transition: background 0.2s ease;
  }

  .badge.icon-only {
    padding: 5px;
    border-radius: 999px;
  }
  
  .badge:hover {
    background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 25%, transparent);
  }

  .badge.clickable {
    cursor: pointer;
  }
  
  .badge-icon,
  .badge ha-icon {
    --mdc-icon-size: 12px;
  }

  .badge-icon-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  
  .badge-label {
    font-size: 9px;
    text-transform: uppercase;
    opacity: 0.8;
  }
  
  .badge-value {
    font-weight: 600;
  }

  .badge-unit {
    font-size: 9px;
    opacity: 0.8;
    margin-left: 2px;
  }

  .badge-progress {
    flex-basis: 100%;
    width: 100%;
    height: 3px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 999px;
    overflow: hidden;
    margin-top: 2px;
  }

  .badge-progress-bar {
    height: 100%;
    background: var(--badge-color, var(--primary-color));
    border-radius: 999px;
    transition: width 0.3s ease;
  }
`,Qn=`
  /* ============================= */
  /* FOOTER */
  /* ============================= */
  
  .footer {
    display: flex;
    align-items: center;
    padding: var(--uc-padding, 16px);
    padding-top: 12px;
    padding-bottom: 12px;
  }
  
  .footer.with-border {
    border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
  }
  
  .footer.sticky {
    position: sticky;
    bottom: 0;
    background: var(--ha-card-background, var(--card-background-color, white));
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  }
  
  /* ============================= */
  /* FOOTER LEFT */
  /* ============================= */
  
  .footer-left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 12px;
  }
  
  .footer-left:empty {
    display: none;
    margin-right: 0;
  }
  
  .footer-left-slot {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .footer-left-slot:empty {
    display: none;
  }
  
  /* ============================= */
  /* FOOTER CONTENT */
  /* ============================= */
  
  .footer-content {
    flex: 1;
    min-width: 0;
  }
  
  .footer-text {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }
  
  .footer-text ha-icon {
    --mdc-icon-size: 16px;
  }
  
  .footer-cards-slot {
    margin-top: 8px;
  }
  
  .footer-cards-slot:empty {
    display: none;
    margin-top: 0;
  }
  
  /* ============================= */
  /* FOOTER RIGHT */
  /* ============================= */
  
  .footer-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: auto;
    gap: 8px;
  }
  
  .footer-right:empty {
    display: none;
  }
  
  .footer-right-slot {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .footer-right-slot:empty {
    display: none;
  }
  
  /* ============================= */
  /* FOOTER ACTION BUTTONS */
  /* ============================= */
  
  .footer-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;
  }
  
  .footer-action-btn:hover {
    background: var(--accent-color, var(--primary-color));
    filter: brightness(1.1);
  }
  
  .footer-action-btn:active {
    transform: scale(0.98);
  }
  
  .footer-action-btn ha-icon {
    --mdc-icon-size: 16px;
  }
  
  /* Outline variant */
  .footer-action-btn.outline {
    background: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
  }
  
  .footer-action-btn.outline:hover {
    background: var(--primary-color);
    color: white;
  }
  
  /* Text variant */
  .footer-action-btn.text {
    background: transparent;
    color: var(--primary-color);
    padding: 6px 8px;
  }
  
  .footer-action-btn.text:hover {
    background: rgba(var(--rgb-primary-color), 0.1);
  }
`,ln=`
  ${Zn}
  ${Qn}
`;var jr=Object.freeze({default:"background: var(--ha-card-background, #fff); color: var(--primary-text-color, #333);",transparent:"background: transparent; color: var(--primary-text-color, #fff); border: 1px dashed rgba(255,255,255,0.3);",solid:"background: #1a1a1a; color: #e0e0e0;",glass:"background: rgba(30,30,30,0.55); backdrop-filter: blur(8px); color: #f0f0f0; border: 1px solid rgba(255,255,255,0.08);",glassmorphism:"background: rgba(30,30,30,0.7); backdrop-filter: blur(12px) saturate(180%); color: #f7f7f7; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 8px 32px rgba(0,0,0,0.3);",neumorphism:"background: #1e1e1e; color: #d9d9d9; box-shadow: 6px 6px 12px rgba(0,0,0,0.5), -6px -6px 12px rgba(255,255,255,0.03);",minimal:"background: transparent; color: var(--primary-text-color, #fff); border: 1px solid rgba(255,255,255,0.1);",gradient:"background: linear-gradient(135deg, #1a1a2e, #16213e); color: #fff;",dark:"background: #121212; color: #fff; border: 1px solid rgba(255,255,255,0.08);",neon:"background: rgba(0,0,0,0.9); color: #00ff88; border: 1px solid #00ff88; box-shadow: 0 0 10px rgba(0,255,136,0.5);",aurora:"background: linear-gradient(135deg, rgba(0,212,170,0.15), rgba(124,58,237,0.15), rgba(14,165,233,0.15)), #0a0a0f; color: #fff;",carbon:"background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px), #0d0d0d; color: #c0c0c0;",slate:"background: #1e293b; color: #f1f5f9;",obsidian:"background: #0f0f0f; color: #d4d4d4;",charcoal:"background: #1f1f1f; color: #e5e5e5;",midnight:"background: #0f172a; color: #e2e8f0;",cyber:"background: #0a0a0a; color: #00d4ff; border: 1px solid #00d4ff;",void:"background: #000; color: #a0a0a0;",ember:"background: linear-gradient(135deg, #1a0a0a, #0a0505); color: #ffcccc;",forest:"background: linear-gradient(135deg, #0a1a0a, #050a05); color: #bbffcc;",ocean:"background: linear-gradient(135deg, #0a0f1a, #050810); color: #bae6fd;","purple-haze":"background: linear-gradient(135deg, #120a1a, #0a050f); color: #e9d5ff;",matrix:"background: #000500; color: #00ff00;",graphite:"background: #252525; color: #d0d0d0;",smoke:"background: rgba(40,40,40,0.85); color: #ccc; backdrop-filter: blur(8px);",nord:"background: #2e3440; color: #eceff4;",dracula:"background: #282a36; color: #f8f8f2;",monokai:"background: #272822; color: #f8f8f2;","tokyo-night":"background: #1a1b26; color: #c0caf5;",catppuccin:"background: #1e1e2e; color: #cdd6f4;"});var cn=`
  /* ============================= */
  /* DEFAULT THEME */
  /* ============================= */
  /* \u041D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u0442 \u043D\u0438\u043A\u0430\u043A\u0438\u0445 \u0441\u0442\u0438\u043B\u0435\u0439 - \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 HA dashboard theme */
  .theme-default {
    /* inherit all from ha-card */
  }
  
  /* ============================= */
  /* TRANSPARENT THEME */
  /* ============================= */
  /* \u041F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E \u043F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u0430\u044F - \u0441\u043B\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u0441 \u0444\u043E\u043D\u043E\u043C */
  .theme-transparent {
    --ha-card-background: transparent;
    --card-background-color: transparent;
    
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  .theme-transparent .header:hover {
    background: rgba(255, 255, 255, 0.03);
  }
  
  /* ============================= */
  /* SOLID THEME */
  /* ============================= */
  .theme-solid {
    --ha-card-background: #1a1a1a;
    --card-background-color: #1a1a1a;
    --primary-text-color: #e0e0e0;
    --secondary-text-color: #888;
  }
  
  /* ============================= */
  /* GLASS THEME */
  /* ============================= */
  .theme-glass {
    --ha-card-background: rgba(30, 30, 30, 0.55);
    --card-background-color: rgba(30, 30, 30, 0.55);

    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
  }

  /* ============================= */
  /* GLASSMORPHISM THEME */
  /* ============================= */
  .theme-glassmorphism {
    --ha-card-background: rgba(30, 30, 30, 0.7);
    --card-background-color: rgba(30, 30, 30, 0.7);

    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  }
  
  /* ============================= */
  /* NEUMORPHISM THEME */
  /* ============================= */
  .theme-neumorphism {
    --ha-card-background: #1e1e1e;
    --card-background-color: #1e1e1e;
    
    border: none !important;
    box-shadow: 
      6px 6px 12px rgba(0, 0, 0, 0.5),
      -6px -6px 12px rgba(255, 255, 255, 0.03) !important;
  }
  
  /* ============================= */
  /* MINIMAL THEME */
  /* ============================= */
  .theme-minimal {
    --ha-card-background: transparent;
    --card-background-color: transparent;
    
    background: transparent !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: none !important;
  }
  
  /* ============================= */
  /* GRADIENT THEME */
  /* ============================= */
  .theme-gradient {
    --ha-card-background: linear-gradient(135deg, #1a1a2e, #16213e);
    
    background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
  }
  
  /* ============================= */
  /* DARK THEME */
  /* ============================= */
  .theme-dark {
    --ha-card-background: #121212;
    --card-background-color: #121212;
    --primary-text-color: #ffffff;
    --secondary-text-color: #888;
    
    background: #121212 !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
  }
  
  /* ============================= */
  /* NEON THEME */
  /* ============================= */
  .theme-neon {
    --ha-card-background: rgba(0, 0, 0, 0.9);
    --card-background-color: rgba(0, 0, 0, 0.9);
    --primary-color: #00ff88;
    
    background: rgba(0, 0, 0, 0.9) !important;
    border: 1px solid #00ff88 !important;
    box-shadow: 
      0 0 5px #00ff88,
      0 0 10px rgba(0, 255, 136, 0.5),
      0 0 20px rgba(0, 255, 136, 0.3),
      inset 0 0 30px rgba(0, 255, 136, 0.05) !important;
  }
  
  .theme-neon .header-icon {
    color: #00ff88 !important;
    filter: drop-shadow(0 0 4px #00ff88);
  }
  
  .theme-neon .header-title {
    color: #ffffff !important;
    text-shadow: 0 0 10px #00ff88;
  }
  
  /* ============================= */
  /* AURORA THEME */
  /* ============================= */
  .theme-aurora {
    --ha-card-background: #0a0a0f;
    --card-background-color: #0a0a0f;
    
    background: 
      linear-gradient(135deg, 
        rgba(0, 212, 170, 0.1),
        rgba(124, 58, 237, 0.1),
        rgba(14, 165, 233, 0.1)
      ),
      #0a0a0f !important;
    border: 1px solid rgba(0, 212, 170, 0.2) !important;
    box-shadow: 
      0 0 40px rgba(0, 212, 170, 0.1),
      0 0 80px rgba(124, 58, 237, 0.05) !important;
  }
  
  /* ============================= */
  /* CARBON THEME */
  /* ============================= */
  .theme-carbon {
    --ha-card-background: #0d0d0d;
    --card-background-color: #0d0d0d;
    --primary-text-color: #c0c0c0;
    --secondary-text-color: #666;
    
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 1px,
        rgba(255, 255, 255, 0.02) 1px,
        rgba(255, 255, 255, 0.02) 2px
      ),
      #0d0d0d !important;
    border: 1px solid #222 !important;
  }
  
  /* ============================= */
  /* SLATE THEME */
  /* ============================= */
  .theme-slate {
    --ha-card-background: #1e293b;
    --card-background-color: #1e293b;
    --primary-text-color: #f1f5f9;
    --secondary-text-color: #94a3b8;
    
    background: #1e293b !important;
    border: 1px solid #334155 !important;
  }
  
  /* ============================= */
  /* OBSIDIAN THEME */
  /* ============================= */
  .theme-obsidian {
    --ha-card-background: #0f0f0f;
    --card-background-color: #0f0f0f;
    --primary-text-color: #d4d4d4;
    --secondary-text-color: #737373;
    
    background: #0f0f0f !important;
    border: 1px solid #262626 !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
  }
  
  /* ============================= */
  /* CHARCOAL THEME */
  /* ============================= */
  .theme-charcoal {
    --ha-card-background: #1f1f1f;
    --card-background-color: #1f1f1f;
    --primary-text-color: #e5e5e5;
    --secondary-text-color: #808080;
    
    background: #1f1f1f !important;
    border: 1px solid #333 !important;
  }
  
  /* ============================= */
  /* MIDNIGHT THEME */
  /* ============================= */
  .theme-midnight {
    --ha-card-background: #0f172a;
    --card-background-color: #0f172a;
    --primary-text-color: #e2e8f0;
    --secondary-text-color: #64748b;
    --primary-color: #3b82f6;
    
    background: #0f172a !important;
    border: 1px solid #1e3a5f !important;
  }
  
  /* ============================= */
  /* CYBER THEME */
  /* ============================= */
  .theme-cyber {
    --ha-card-background: #0a0a0a;
    --card-background-color: #0a0a0a;
    --primary-color: #00d4ff;
    --primary-text-color: #00d4ff;
    --secondary-text-color: #0088aa;
    
    background: #0a0a0a !important;
    border: 1px solid #00d4ff !important;
    box-shadow: 
      0 0 3px #00d4ff,
      inset 0 0 20px rgba(0, 212, 255, 0.03) !important;
  }
  
  .theme-cyber .header-title {
    text-shadow: 0 0 8px #00d4ff;
  }
  
  /* ============================= */
  /* VOID THEME */
  /* ============================= */
  .theme-void {
    --ha-card-background: #000000;
    --card-background-color: #000000;
    --primary-text-color: #a0a0a0;
    --secondary-text-color: #505050;
    
    background: #000000 !important;
    border: 1px solid #1a1a1a !important;
  }
  
  /* ============================= */
  /* EMBER THEME */
  /* ============================= */
  .theme-ember {
    --ha-card-background: #1a0a0a;
    --card-background-color: #1a0a0a;
    --primary-color: #ff4444;
    --primary-text-color: #ffcccc;
    --secondary-text-color: #aa6666;
    
    background: linear-gradient(135deg, #1a0a0a, #0a0505) !important;
    border: 1px solid #441111 !important;
    box-shadow: 0 0 30px rgba(255, 68, 68, 0.1) !important;
  }
  
  /* ============================= */
  /* FOREST THEME */
  /* ============================= */
  .theme-forest {
    --ha-card-background: #0a1a0a;
    --card-background-color: #0a1a0a;
    --primary-color: #22c55e;
    --primary-text-color: #bbffcc;
    --secondary-text-color: #558866;
    
    background: linear-gradient(135deg, #0a1a0a, #050a05) !important;
    border: 1px solid #114411 !important;
  }
  
  /* ============================= */
  /* OCEAN THEME */
  /* ============================= */
  .theme-ocean {
    --ha-card-background: #0a0f1a;
    --card-background-color: #0a0f1a;
    --primary-color: #0ea5e9;
    --primary-text-color: #bae6fd;
    --secondary-text-color: #5588aa;
    
    background: linear-gradient(135deg, #0a0f1a, #050810) !important;
    border: 1px solid #113344 !important;
  }
  
  /* ============================= */
  /* PURPLE HAZE THEME */
  /* ============================= */
  .theme-purple-haze {
    --ha-card-background: #120a1a;
    --card-background-color: #120a1a;
    --primary-color: #a855f7;
    --primary-text-color: #e9d5ff;
    --secondary-text-color: #8866aa;
    
    background: linear-gradient(135deg, #120a1a, #0a050f) !important;
    border: 1px solid #2d1a44 !important;
    box-shadow: 0 0 30px rgba(168, 85, 247, 0.1) !important;
  }
  
  /* ============================= */
  /* MATRIX THEME */
  /* ============================= */
  .theme-matrix {
    --ha-card-background: #000500;
    --card-background-color: #000500;
    --primary-color: #00ff00;
    --primary-text-color: #00ff00;
    --secondary-text-color: #008800;
    
    background: #000500 !important;
    border: 1px solid #003300 !important;
  }
  
  .theme-matrix .header-title,
  .theme-matrix .header-subtitle {
    font-family: 'Courier New', monospace;
  }
  
  .theme-matrix .header-title {
    text-shadow: 0 0 5px #00ff00;
  }
  
  /* ============================= */
  /* GRAPHITE THEME */
  /* ============================= */
  .theme-graphite {
    --ha-card-background: #252525;
    --card-background-color: #252525;
    --primary-text-color: #d0d0d0;
    --secondary-text-color: #808080;
    
    background: #252525 !important;
    border: 1px solid #3a3a3a !important;
  }
  
  /* ============================= */
  /* SMOKE THEME */
  /* ============================= */
  .theme-smoke {
    --ha-card-background: rgba(40, 40, 40, 0.85);
    --card-background-color: rgba(40, 40, 40, 0.85);
    
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background: rgba(40, 40, 40, 0.85) !important;
    border: 1px solid rgba(255, 255, 255, 0.05) !important;
  }
  
  /* ============================= */
  /* NORD THEME */
  /* ============================= */
  .theme-nord {
    --ha-card-background: #2e3440;
    --card-background-color: #2e3440;
    --primary-color: #88c0d0;
    --primary-text-color: #eceff4;
    --secondary-text-color: #d8dee9;
    
    background: #2e3440 !important;
    border: 1px solid #3b4252 !important;
  }
  
  /* ============================= */
  /* DRACULA THEME */
  /* ============================= */
  .theme-dracula {
    --ha-card-background: #282a36;
    --card-background-color: #282a36;
    --primary-color: #bd93f9;
    --primary-text-color: #f8f8f2;
    --secondary-text-color: #6272a4;
    
    background: #282a36 !important;
    border: 1px solid #44475a !important;
  }
  
  /* ============================= */
  /* MONOKAI THEME */
  /* ============================= */
  .theme-monokai {
    --ha-card-background: #272822;
    --card-background-color: #272822;
    --primary-color: #a6e22e;
    --primary-text-color: #f8f8f2;
    --secondary-text-color: #75715e;
    
    background: #272822 !important;
    border: 1px solid #3e3d32 !important;
  }
  
  /* ============================= */
  /* TOKYO NIGHT THEME */
  /* ============================= */
  .theme-tokyo-night {
    --ha-card-background: #1a1b26;
    --card-background-color: #1a1b26;
    --primary-color: #7aa2f7;
    --primary-text-color: #c0caf5;
    --secondary-text-color: #565f89;
    
    background: #1a1b26 !important;
    border: 1px solid #292e42 !important;
  }
  
  /* ============================= */
  /* CATPPUCCIN THEME (Mocha) */
  /* ============================= */
  .theme-catppuccin {
    --ha-card-background: #1e1e2e;
    --card-background-color: #1e1e2e;
    --primary-color: #cba6f7;
    --primary-text-color: #cdd6f4;
    --secondary-text-color: #6c7086;
    
    background: #1e1e2e !important;
    border: 1px solid #313244 !important;
  }
`;var Je=class{constructor(e,t={}){this._element=e,this._options={threshold:t.threshold||50,velocityThreshold:t.velocityThreshold||.3,direction:t.direction||"horizontal",preventScroll:t.preventScroll||!1,...t},this._touchStart={x:0,y:0,time:0},this._touchCurrent={x:0,y:0},this._isTracking=!1,this._listeners={left:[],right:[],up:[],down:[]},this._handleTouchStart=this._handleTouchStart.bind(this),this._handleTouchMove=this._handleTouchMove.bind(this),this._handleTouchEnd=this._handleTouchEnd.bind(this),this._attach()}_attach(){this._element.addEventListener("touchstart",this._handleTouchStart,{passive:!0}),this._element.addEventListener("touchmove",this._handleTouchMove,{passive:!this._options.preventScroll}),this._element.addEventListener("touchend",this._handleTouchEnd),this._element.addEventListener("touchcancel",this._handleTouchEnd)}destroy(){this._element.removeEventListener("touchstart",this._handleTouchStart),this._element.removeEventListener("touchmove",this._handleTouchMove),this._element.removeEventListener("touchend",this._handleTouchEnd),this._element.removeEventListener("touchcancel",this._handleTouchEnd),this._listeners={left:[],right:[],up:[],down:[]}}_handleTouchStart(e){let t=e.touches[0];t&&(this._touchStart={x:t.clientX,y:t.clientY,time:Date.now()},this._touchCurrent={x:t.clientX,y:t.clientY},this._isTracking=!0)}_handleTouchMove(e){if(!this._isTracking)return;let t=e.touches[0];if(t&&(this._touchCurrent={x:t.clientX,y:t.clientY},this._options.preventScroll)){let n=Math.abs(this._touchCurrent.x-this._touchStart.x),i=Math.abs(this._touchCurrent.y-this._touchStart.y);(this._options.direction==="horizontal"&&n>i||this._options.direction==="vertical"&&i>n)&&e.preventDefault()}}_handleTouchEnd(e){if(!this._isTracking)return;this._isTracking=!1;let t=this._touchCurrent.x-this._touchStart.x,n=this._touchCurrent.y-this._touchStart.y,i=Date.now()-this._touchStart.time,o=Math.abs(t)/i,a=Math.abs(n)/i,s=this._getSwipeDirection(t,n,o,a);s&&this._triggerSwipe(s,{deltaX:t,deltaY:n,velocityX:o,velocityY:a,duration:i})}_getSwipeDirection(e,t,n,i){let{threshold:o,velocityThreshold:a,direction:s}=this._options,l=Math.abs(e),c=Math.abs(t),m=l>o||n>a,b=c>o||i>a;return s!=="vertical"&&m&&l>c?e>0?"right":"left":s!=="horizontal"&&b&&c>l?t>0?"down":"up":null}_triggerSwipe(e,t){this._listeners[e].forEach(n=>{try{n(t)}catch(i){console.error("[UniversalCard] Swipe callback error:",i)}}),L(this._element,"uc-swipe",{direction:e,...t})}on(e,t){return this._listeners[e]?(this._listeners[e].push(t),()=>{let n=this._listeners[e].indexOf(t);n>-1&&this._listeners[e].splice(n,1)}):(console.warn(`[UniversalCard] Invalid swipe direction: ${e}`),()=>{})}onSwipeLeft(e){return this.on("left",e)}onSwipeRight(e){return this.on("right",e)}onSwipeUp(e){return this.on("up",e)}onSwipeDown(e){return this.on("down",e)}};function un(r){return"conditions"in r&&Array.isArray(r.conditions)}var ve=class{constructor(e=[]){this._conditions=e,this._hass=null,this._providers=null,this._cachedResult=!0,this._cacheKey=null}set hass(e){this._providers=z(e),this._hass=this._providers.getHass(),this._cacheKey=null}set conditions(e){this._conditions=e,this._cacheKey=null}evaluate(){if(!this._conditions||this._conditions.length===0)return!0;let e=this._generateCacheKey();if(e===this._cacheKey)return this._cachedResult;let t=this._conditions.every(n=>this._evaluateCondition(n));return this._cacheKey=e,this._cachedResult=t,t}_evaluateCondition(e){let t=e.condition;switch(t){case C.STATE:return this._evaluateStateCondition(e);case C.NUMERIC_STATE:return this._evaluateNumericStateCondition(e);case C.USER:return this._evaluateUserCondition(e);case C.TIME:return this._evaluateTimeCondition(e);case C.SCREEN:return this._evaluateScreenCondition(e);case C.AND:return this._evaluateAndCondition(e);case C.OR:return this._evaluateOrCondition(e);case C.NOT:return this._evaluateNotCondition(e);default:return console.warn(`[UniversalCard] Unknown condition type: ${t}`),!0}}_evaluateStateCondition(e){let{entity:t,state:n,state_not:i,attribute:o}=e,a=this._getProviders();if(!t||!a)return!0;let s=a.derived.entities.getValue(t,o),l=s==null?"":String(s);return i!==void 0?!(Array.isArray(i)?i:[i]).includes(l):n!==void 0?(Array.isArray(n)?n:[n]).includes(l):!0}_evaluateNumericStateCondition(e){let{entity:t,attribute:n,above:i,below:o}=e,a=this._getProviders();if(!t||!a)return!0;let s=a.derived.entities.getNumericValue(t,n);return!(s===null||i!==void 0&&s<=i||o!==void 0&&s>=o)}_evaluateUserCondition(e){let{users:t,is_admin:n,is_owner:i}=e,o=this._getProviders();if(!o)return!0;let a=qt(o);return a?!(t&&Array.isArray(t)&&!t.includes(a.name)&&!t.includes(a.id)||n!==void 0&&a.is_admin!==n||i!==void 0&&a.is_owner!==i):!0}_evaluateTimeCondition(e){let{after:t,before:n,weekday:i}=e,o=new Date,a=o.getHours()*60+o.getMinutes();if(t){let[s,l]=t.split(":").map(Number),c=s*60+l;if(a<c)return!1}if(n){let[s,l]=n.split(":").map(Number),c=s*60+l;if(a>=c)return!1}if(i&&Array.isArray(i)){let l=["sun","mon","tue","wed","thu","fri","sat"][o.getDay()];if(!i.includes(l))return!1}return!0}_evaluateScreenCondition(e){let{media_query:t,min_width:n,max_width:i}=e;if(t)return window.matchMedia(t).matches;let o=window.innerWidth;return!(n!==void 0&&o<n||i!==void 0&&o>i)}_evaluateAndCondition(e){let{conditions:t}=e;return!t||!Array.isArray(t)?!0:t.every(n=>this._evaluateCondition(n))}_evaluateOrCondition(e){let{conditions:t}=e;return!t||!Array.isArray(t)?!0:t.some(n=>this._evaluateCondition(n))}_evaluateNotCondition(e){let{conditions:t}=e;return!t||!Array.isArray(t)?!0:!t.every(n=>this._evaluateCondition(n))}_generateCacheKey(){let e=this._getProviders();if(!e)return"no-hass";let n=this._getRelevantEntities().map(a=>{let s=e.entities.getState(a);return s?`${a}:${s.state}`:`${a}:null`});if(this._hasConditionType(C.SCREEN)&&n.push(`screen:${window.innerWidth}`),this._hasConditionType(C.TIME)){let a=new Date;n.push(`time:${a.getHours()}:${a.getMinutes()}`)}return n.join("|")}_getRelevantEntities(){let e=new Set,t=n=>{n.forEach(i=>{"entity"in i&&typeof i.entity=="string"&&e.add(i.entity),un(i)&&t(i.conditions)})};return t(this._conditions),Array.from(e)}hasEntityDependencies(){return this._getRelevantEntities().length>0}hasScreenDependencies(){return this._hasConditionType(C.SCREEN)}hasTimeDependencies(){return this._hasConditionType(C.TIME)}_hasConditionType(e,t=this._conditions){return!Array.isArray(t)||t.length===0?!1:t.some(n=>!n||typeof n!="object"?!1:n.condition===e?!0:un(n)?this._hasConditionType(e,n.conditions):!1)}_getProviders(){return this._providers?this._providers:this._hass?(this._providers=z(this._hass),this._hass=this._providers.getHass(),this._providers):null}};var et=class extends HTMLElement{static getConfigElement(){return document.createElement("universal-card-editor")}static getStubConfig(){return{title:"Universal Card",icon:"mdi:card-outline",body_mode:E.EXPAND,body:{cards:[{type:"markdown",content:"Configure this card in the editor"}]}}}constructor(){super(),p("[UC] constructor() called"),this.attachShadow({mode:"open"}),p("[UC] shadowRoot attached"),this._config={},this._hass=null,this._expanded=!1,this._initialized=!1,this._pendingHass=null,this._initToken=0,this._expandRequestToken=0,this._header=null,this._footer=null,this._badges=null,this._swipeGestures=null,this._customCSS=null,this._mode=null,this._tabsMode=null,this._carouselMode=null,this._subviewMode=null,this._visibilityEvaluator=null,this._sectionVisibilityEvaluators={header:null,body:null,footer:null},this._headerCards=[],this._bodyCards=[],this._tabCards={},this._bodyCardsLoaded=!1,this._bodyPoolKey=null,this._helpers=null,this._activeTab=0,this._carouselIndex=0,this._modeState={activeTab:0,activeSlide:0},this._isLoading=!1,this._autoCollapseTimer=null,this._carouselTimer=null,this._resizeHandler=st(()=>this._handleResize(),h.RESIZE_DEBOUNCE_MS),this._hassUpdateHandler=Ue(()=>this._updateDynamicContent(),h.UPDATE_THROTTLE_MS),this._intersectionObserver=null,this._bodyLoadPromise=null,this._bodyLoadToken=0,this._pendingLazyIdleId=null,this._pendingLazyIdleResolve=null,this._visibilityRefreshTimer=null,this._modalOverlay=null,this._fullscreenOverlay=null,this._debug={initTime:0,renderCount:0,lastRenderTime:0},this._initStartedAt=0,this._pluginSystem=je()}connectedCallback(){p("[UC] connectedCallback()"),$e.register(this),this._setupIntersectionObserver(),this._initialized&&this._config.lazy_load&&!this._bodyCardsLoaded&&this._observeForLazyLoad(),this._header&&this._header.attach(),this._footer&&this._footer.attach&&this._footer.attach(),this._mode&&this._mode.attach&&this._mode.attach(),p("[UC] connectedCallback() done")}disconnectedCallback(){if(p("[UC] disconnectedCallback()"),this._executePluginHookSync(g.BEFORE_DESTROY,{config:this._config},{phase:"disconnect"}),$e.unregister(this),this._cancelPendingBodyLoad(),this._header&&this._header.detach(),this._footer&&this._footer.detach&&this._footer.detach(),this._mode&&this._mode.detach&&this._mode.detach(),this._clearAllTimers(),this._destroyIntersectionObserver(),this._destroySwipeGestures(),this._mode&&(this._config.body_mode==="modal"||this._config.body_mode==="fullscreen"||this._config.body_mode==="subview"))try{this._mode.close()}catch(e){}this._hideModal(),this._hideFullscreen(),p("[UC] disconnectedCallback() done")}set hass(e){if(this._hass=e,this._visibilityEvaluator&&(this._visibilityEvaluator.hass=e),Object.values(this._sectionVisibilityEvaluators).forEach(t=>{t&&(t.hass=e)}),!this._initialized){this._pendingHass=e;return}this._header&&(this._header.hass=e),this._footer&&(this._footer.hass=e),this._badges&&(this._badges.hass=e),this._mode&&(this._mode.hass=e),this._tabsMode&&(this._tabsMode.hass=e),this._carouselMode&&(this._carouselMode.hass=e),this._subviewMode&&(this._subviewMode.hass=e),this._updateChildCardsHass(e),this._executePluginHookSync(g.HASS_UPDATE,{hass:e,config:this._config}),this._hassUpdateHandler()}get hass(){return this._hass}setConfig(e){var a;p("[UC] setConfig() called",e);let t=performance.now(),n=(a=this._config)==null?void 0:a.card_id;this._initStartedAt=t;let i=this._executePluginHookSync(g.CONFIG_TRANSFORM,{config:j(e)},{phase:"setConfig"}),o=i!=null&&i.config&&typeof i.config=="object"?i.config:e;try{this._config=D.normalize(o);let s=this._executePluginHookSync(g.CONFIG_VALIDATE,{config:this._config,valid:!0},{phase:"setConfig"});if((s==null?void 0:s.valid)===!1){let l=typeof s.error=="string"?s.error:typeof s.message=="string"?s.message:"Plugin config validation failed";throw new Error(l)}p("[UC] config normalized")}catch(s){throw console.error("[UC] config normalize error:",s),s}this._debug.initTime=performance.now()-t,this._recordPerfMetric("config_change",this._debug.initTime),$e.updateCardId(this,n,this._config.card_id),this._initToken+=1,this._setupVisibilityEvaluators(),this._resetRuntimeState(),this._initializeCard(this._initToken)}_setupVisibilityEvaluators(){this._visibilityEvaluator=new ve(this._config.visibility||[]),this._hass&&(this._visibilityEvaluator.hass=this._hass);let e=this._config.section_visibility||{};["header","body","footer"].forEach(t=>{let n=new ve(e[t]||[]);this._hass&&(n.hass=this._hass),this._sectionVisibilityEvaluators[t]=n})}getConfig(){return j(this._config)}_getPluginHookContext(e={}){var t,n;return{card:this,card_id:(t=this._config)==null?void 0:t.card_id,body_mode:(n=this._config)==null?void 0:n.body_mode,config:this._config,expanded:this._expanded,hass:this._hass,initialized:this._initialized,isConnected:this.isConnected,shadowRoot:this.shadowRoot,...e}}_executePluginHookSync(e,t={},n={}){return this._pluginSystem.executeHookSync(e,t,this._getPluginHookContext(n))}_executePluginHook(e,t={},n={}){return this._pluginSystem.executeHook(e,t,this._getPluginHookContext(n))}_notifyStateChange(e,t,n,i){t!==n&&this._executePluginHookSync(g.STATE_CHANGE,{stateKey:e,previousValue:t,nextValue:n,source:i},{source:i})}_resetRuntimeState(){this._initialized=!1,this._pendingHass=this._hass,this._isLoading=!1,this._cancelPendingBodyLoad(),this._clearAllTimers(),this._destroyIntersectionObserver(),this._destroySwipeGestures(),this._hideModal(),this._hideFullscreen(),this._destroyCustomCSS(),this._destroyChildCards(),this.shadowRoot.innerHTML=""}async _initializeCard(e){p("[UC] _initializeCard() start");let t=performance.now(),n=()=>e!==this._initToken;try{if(await this._executePluginHook(g.BEFORE_INIT,{config:this._config},{phase:"init"}),n())return;p("[UC] getting card helpers...");let i=await mt();if(n()||(this._helpers=i,p("[UC] card helpers loaded"),this._restoreState(),p("[UC] state restored"),this._createHeaderComponent(),p("[UC] header created"),this._config.footer&&(this._createFooterComponent(),p("[UC] footer created")),this._createModeInstance(),p("[UC] mode created:",this._config.body_mode),p("[UC] starting render..."),await this._render(),n()))return;if(p("[UC] render done"),this._header){if(p("[UC] loading header cards..."),await this._header.loadCards(),n())return;p("[UC] header cards loaded")}if(this._footer){if(p("[UC] loading footer cards..."),await this._footer.loadCards(),n())return;p("[UC] footer cards loaded")}if(this._config.lazy_load)this._setupIntersectionObserver(),this._observeForLazyLoad(),p("[UC] lazy load setup");else if(this._expanded){if(p("[UC] loading body cards..."),await this._loadBodyCards(),n())return;p("[UC] body cards loaded")}if(this._preloadModalModeContent(),n())return;this._bindEvents(),p("[UC] events bound"),this._syncVisibilityRefreshTimer(),this._initialized=!0;let o=performance.now()-t;this._recordPerfMetric("tti",o),await this._executePluginHook(g.AFTER_INIT,{config:this._config,ttiMs:o},{phase:"init"}),p("[UC] initialization complete!"),this._pendingHass&&(this.hass=this._pendingHass,this._pendingHass=null)}catch(i){console.error("[UC] Initialization failed:",i),this._renderError(i)}}_createHeaderComponent(){let e=this._config.header||{},t={cards:e.cards,header_left:this._config.header_left,header_right:this._config.header_right,title:this._config.title,subtitle:this._config.subtitle,icon:this._config.icon,entity:this._config.entity,show_state:this._config.show_state,show_expand_icon:this._config.show_expand_icon,expand_icon:this._config.expand_icon,body_mode:this._config.body_mode,sticky_header:this._config.sticky_header,sticky:e.sticky,clickable:e.clickable,layout:e.layout,expand_trigger:this._config.expand_trigger,badges:this._config.badges,tap_action:this._config.tap_action,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action,context_menu:this._config.context_menu};this._header=new qe(t,{executePluginHookSync:(n,i,o)=>this._executePluginHookSync(n,i,o)}),this._hass&&(this._header.hass=this._hass)}_createFooterComponent(){let e=this._config.footer;this._footer=new We(e,{executePluginHookSync:(t,n,i)=>this._executePluginHookSync(t,n,i)}),this._hass&&(this._footer.hass=this._hass)}_createModeInstance(){var t;let e=this._config.body_mode||E.EXPAND;if(e===E.NONE||e===E.EXPAND||e===E.TABS||e===E.CAROUSEL){this._mode=null,this._subviewMode=null;return}this._mode=sn(e,{...this._config,cards:((t=this._config.body)==null?void 0:t.cards)||[],tabs:this._config.tabs||[]},{hass:this._hass,helpers:this._helpers,shadowRoot:this.shadowRoot,card:this,onClose:()=>this._handleModeClosed()}),this._mode&&this._hass&&(this._mode.hass=this._hass),this._subviewMode=e===E.SUBVIEW?this._mode:null}_getModalLoadingStrategy(){var e;return((e=this._config.modal)==null?void 0:e.loading_strategy)===X.PRELOAD?X.PRELOAD:X.LAZY}async _preloadModalModeContent(){var t;if(this._config.body_mode!==E.MODAL||this._getModalLoadingStrategy()!==X.PRELOAD||!this._mode||this._mode.loaded)return;let e=((t=this._config.body)==null?void 0:t.cards)||[];if(e.length!==0)try{await this._mode.loadCards(e)}catch(n){console.error("[UniversalCard] Failed to preload modal content:",n)}}_restoreState(){if(this._config.remember_expanded_state&&this._config.card_id){let e=`uc-state-${this._config.card_id}`,t=me.get(e,this._config.expanded);typeof t=="boolean"?this._expanded=t:this._expanded=this._config.expanded}else this._expanded=this._config.expanded;this._restoreModeState()}_saveState(){if(this._config.remember_expanded_state&&this._config.card_id){let e=`uc-state-${this._config.card_id}`;me.set(e,this._expanded)}}_restoreModeState(){if(this._modeState={activeTab:0,activeSlide:0},!this._config.remember_mode_state||!this._config.card_id)return;let e=me.get(this._getModeStateKey(),null);if(!e||typeof e!="object")return;let t=Number.isFinite(e.activeTab)?e.activeTab:0,n=Number.isFinite(e.activeSlide)?e.activeSlide:0;this._modeState={activeTab:Math.max(0,t),activeSlide:Math.max(0,n)}}_saveModeState(e={}){!this._config.remember_mode_state||!this._config.card_id||(this._modeState={...this._modeState,...e},me.set(this._getModeStateKey(),this._modeState))}_getModeStateKey(){return`uc-mode-${this._config.card_id}`}_handleModeClosed(){if(this._clearAutoCollapseTimer(),!this._expanded){this._updateExpandedUI();return}let e=this._expanded;this._expanded=!1,this._saveState(),this._updateExpandedUI(),this._notifyStateChange("expanded",e,this._expanded,"mode"),L(this,Y.CARD_COLLAPSED,{card_id:this._config.card_id,source:"mode"})}_isCardVisible(){return this._visibilityEvaluator?this._visibilityEvaluator.evaluate():!0}_isSectionVisible(e){var n;let t=(n=this._sectionVisibilityEvaluators)==null?void 0:n[e];return t?t.evaluate():!0}_applyVisibilityState(){let e=this._isCardVisible();if(this.style.display=e?"":"none",!e){this._expanded&&this._collapse();return}let t=this.shadowRoot.querySelector(".header");t&&(t.style.display=this._isSectionVisible("header")?"":"none");let n=this._isSectionVisible("body"),i=this.shadowRoot.querySelector(".body");i&&(i.style.display=n?"":"none"),!n&&this._expanded&&this._collapse();let o=this.shadowRoot.querySelector(".footer");o&&(o.style.display=this._isSectionVisible("footer")?"":"none")}async _render(){let e=performance.now();this._executePluginHookSync(g.BEFORE_RENDER,{config:this._config,expanded:this._expanded},{phase:"render"});let t=this._generateStyles(),n=this._isSectionVisible("header"),i=this._isSectionVisible("body"),o=this._isSectionVisible("footer");!i&&this._expanded&&(this._expanded=!1,this._saveState());let a=["universal-card"];this._config.theme&&this._config.theme!=="default"&&a.push(`theme-${this._config.theme}`);let s=document.createElement("div");if(s.className=a.join(" "),s.dataset.cardId=this._config.card_id,s.dataset.ucRole="card",s.dataset.ucBodyMode=this._config.body_mode||E.EXPAND,this._header&&n){this._header.expanded=this._expanded;let c=this._header.render();s.appendChild(c)}let l=i?this._applyBodyRenderHook(this._renderBodyElement()):null;if(l&&s.appendChild(l),this._footer&&o){let c=this._footer.render();s.appendChild(c)}this.shadowRoot.innerHTML=`<style>${t}</style>`,this.shadowRoot.appendChild(s),this._applyCustomCSS(),this._applyVisibilityState(),this._setupSwipeGestures(s),this._debug.renderCount++,this._debug.lastRenderTime=performance.now()-e,this._recordPerfMetric("render",this._debug.lastRenderTime),await this._executePluginHook(g.AFTER_RENDER,{config:this._config,expanded:this._expanded,renderTimeMs:this._debug.lastRenderTime,renderCount:this._debug.renderCount,sections:{header:n,body:i,footer:o}},{phase:"render"})}_setupSwipeGestures(e){this._destroySwipeGestures();let t=this._config.swipe;!(t!=null&&t.enabled)||!e||(this._swipeGestures=new Je(e,{threshold:t.threshold,velocityThreshold:t.velocityThreshold,direction:t.direction,preventScroll:t.preventScroll}),["left","right","up","down"].forEach(n=>{let i=t[n];!(i!=null&&i.action)||i.action==="none"||this._swipeGestures.on(n,()=>{this._handleSwipeAction(i)})}))}_destroySwipeGestures(){this._swipeGestures&&(this._swipeGestures.destroy(),this._swipeGestures=null)}_renderBodyElement(){let e=this._config,t=e.body_mode||"expand";if(!this._isSectionVisible("body")||t==="none"||t==="modal"||t==="fullscreen"||t==="subview")return null;let n=document.createElement("div");n.className="body",n.dataset.state=this._expanded?"expanded":"collapsed",n.dataset.mode=t,n.dataset.expandAnimation=e.expand_animation||"slide",n.dataset.collapseAnimation=e.collapse_animation||"slide",n.dataset.cardsAnimation=e.cards_animation||"fadeUp",n.dataset.cardsDirection=e.cards_direction||"sequential",n.dataset.ucRole="body",n.dataset.ucMode=t;let i=e.animation_duration||300,o=e.cards_stagger||50;if(n.style.setProperty("--expand-duration",`${i}ms`),n.style.setProperty("--cards-stagger",`${o}ms`),t==="tabs"){this._tabsMode=new V(e,{activeTab:this._modeState.activeTab,onTabChange:c=>this._saveModeState({activeTab:c})}),this._hass&&(this._tabsMode.hass=this._hass);let l=this._tabsMode.render();return n.appendChild(l),n}if(t==="carousel"){this._carouselMode=new F(e,{startIndex:this._modeState.activeSlide,onSlideChange:c=>this._saveModeState({activeSlide:c})}),this._hass&&(this._carouselMode.hass=this._hass);let l=this._carouselMode.render();return n.appendChild(l),n}let a=document.createElement("div");a.className="body-content",a.dataset.ucRole="body-content";let s=this._getGridStyles();return s&&(a.style.cssText=s),!this._bodyCardsLoaded&&this._expanded&&a.appendChild(this._renderSkeleton()),n.appendChild(a),n}_applyBodyRenderHook(e){if(!e)return null;let t=this._executePluginHookSync(g.BODY_RENDER,{element:e,mode:this._config.body_mode||E.EXPAND,section:"body"},{phase:"render",section:"body"});return t!=null&&t.element&&typeof t.element=="object"?t.element:e}_renderSkeleton(){let e=this._config.skeleton_count||u.skeleton_count,t=document.createElement("div");t.className="skeleton-container";for(let n=0;n<e;n+=1){let i=document.createElement("div");i.className="skeleton-card";let o=document.createElement("div");o.className="skeleton-line title";let a=document.createElement("div");a.className="skeleton-line text";let s=document.createElement("div");s.className="skeleton-line text short",i.appendChild(o),i.appendChild(a),i.appendChild(s),t.appendChild(i)}return t}_renderError(e){this._destroyCustomCSS(),this.shadowRoot.innerHTML="";let t=document.createElement("style");t.textContent=`
      .error-card {
        padding: 16px;
        background: var(--error-color, #f44336);
        color: white;
        border-radius: var(--ha-card-border-radius, 12px);
      }
      .error-message { font-weight: 500; display: flex; align-items: center; gap: 8px; }
      .error-details { margin-top: 8px; font-size: 12px; opacity: 0.9; }
    `;let n=document.createElement("div");n.className="error-card";let i=document.createElement("div");i.className="error-message";let o=document.createElement("ha-icon");o.setAttribute("icon","mdi:alert-circle");let a=document.createElement("span");a.textContent="Universal Card Error",i.appendChild(o),i.appendChild(a);let s=document.createElement("div");s.className="error-details",s.textContent=(e==null?void 0:e.message)||"Unknown error",n.appendChild(i),n.appendChild(s),this.shadowRoot.appendChild(t),this.shadowRoot.appendChild(n)}_applyCustomCSS(){this._destroyCustomCSS(),this._config.custom_css&&(this._customCSS=new Ve(this.shadowRoot,{allowAnimations:this._config.stability_mode!==!0}),this._customCSS.applyFromConfig(this._config.custom_css))}_destroyCustomCSS(){this._customCSS&&(this._customCSS.destroy(),this._customCSS=null)}async _loadBodyCards(){var a;if(this._bodyCardsLoaded)return;if(this._bodyLoadPromise)return this._bodyLoadPromise;let e=this._config.body_mode||E.EXPAND,t=((a=this._config.body)==null?void 0:a.cards)||[],n=performance.now(),i=++this._bodyLoadToken,o=()=>i!==this._bodyLoadToken;return this._isLoading=!0,this._bodyLoadPromise=(async()=>{var P,Z;if(e===E.TABS||e===E.CAROUSEL||e===E.SUBVIEW){this._bodyCardsLoaded=!0;return}if(t.length===0){this._bodyCardsLoaded=!0;return}let s=this._getBodyPoolKey(t,e);if(this._bodyPoolKey=s,this._config.enable_card_pool&&s){let N=R.acquire(s);if(N&&N.length===t.length){if(this._bodyCards=N,this._applyHassToCards(this._bodyCards),e===E.EXPAND){let ae=this.shadowRoot.querySelector(".body-content");if(ae){let U=this._config.cards_direction||"sequential",yn=((P=this._config.grid)==null?void 0:P.columns)||1,vn=this._calculateAnimationIndices(N.length,U,yn);if(await this._removeBodySkeleton(ae),o()){this._recyclePooledCards(s,N),this._bodyCards=[];return}this._appendBodyCardsBatch(ae,N,t,0,vn)}}this._bodyCardsLoaded=!0;return}}if(this._bodyCards=[],e!==E.EXPAND){let N=await this._createBodyCardChunk(t);if(o()){this._disposeCards(N);return}this._bodyCards=N,this._applyHassToCards(this._bodyCards),this._bodyCardsLoaded=!0;return}let l=this.shadowRoot.querySelector(".body-content"),c=this._config.cards_direction||"sequential",m=((Z=this._config.grid)==null?void 0:Z.columns)||1,b=this._calculateAnimationIndices(t.length,c,m),{initialBatchSize:_,batchSize:y,idleTimeout:S}=this._resolveLazyBatchConfig(t.length),k=0,w=!0;for(;k<t.length;){let N=w?_:y,ae=t.slice(k,k+N),U=await this._createBodyCardChunk(ae);if(o()){this._disposeCards(U);return}if(this._applyHassToCards(U),l){if(w&&(await this._removeBodySkeleton(l),o())){this._disposeCards(U);return}this._bodyCards.push(...U),this._appendBodyCardsBatch(l,U,t,k,b)}else this._bodyCards.push(...U);if(w=!1,k+=U.length,k<t.length&&(await this._yieldForLazyBatch(i,S),o()))return}this._bodyCardsLoaded=!0})().finally(()=>{i===this._bodyLoadToken&&(this._isLoading=!1,this._bodyLoadPromise=null),this._recordPerfMetric("body_load",performance.now()-n,{cardCount:t.length})}),this._bodyLoadPromise}_resolveLazyBatchConfig(e){if(this._config.stability_mode)return{initialBatchSize:e,batchSize:e,idleTimeout:h.LAZY_MIN_TIMEOUT_MS};let t=(a,s,l,c)=>{let m=Number(a);return Number.isFinite(m)?Math.min(c,Math.max(l,Math.floor(m))):s},n=t(this._config.lazy_initial_batch,u.lazy_initial_batch,h.LAZY_MIN_BATCH,h.LAZY_MAX_BATCH),i=t(this._config.lazy_batch_size,u.lazy_batch_size,h.LAZY_MIN_BATCH,h.LAZY_MAX_BATCH),o=t(this._config.lazy_idle_timeout,u.lazy_idle_timeout,h.LAZY_MIN_TIMEOUT_MS,h.LAZY_MAX_TIMEOUT_MS);return{initialBatchSize:Math.min(e,n),batchSize:Math.min(e,i),idleTimeout:o}}async _createBodyCardChunk(e){return(await Promise.allSettled(e.map(n=>ft(n)))).map((n,i)=>n.status==="fulfilled"?n.value:gt(n.reason,e[i]))}_applyHassToCards(e){!this._hass||!Array.isArray(e)||e.forEach(t=>{if(!(!t||!("hass"in t)))try{t.hass=this._hass}catch(n){}})}_appendBodyCardsBatch(e,t,n,i,o){let a=document.createDocumentFragment();t.forEach((s,l)=>{let c=i+l,m=document.createElement("div");m.className="card-wrapper",m.dataset.ucRole="card-wrapper";let b=o[c];m.style.setProperty("--card-index",String(b));let _=n[c];if(_){let y=_.colspan||_.card_options&&_.card_options.colspan,S=_.rowspan||_.card_options&&_.card_options.rowspan;y&&(m.style.gridColumn="span "+y),S&&(m.style.gridRow="span "+S)}m.appendChild(s),a.appendChild(m)}),e.appendChild(a)}async _removeBodySkeleton(e){let t=e.querySelector(".skeleton-container");t&&(t.classList.add("fade-out"),await new Promise(n=>setTimeout(n,200)),t.remove())}async _yieldForLazyBatch(e,t){e===this._bodyLoadToken&&await new Promise(n=>{let i=!1,o=()=>{i||(i=!0,this._pendingLazyIdleResolve===o&&(this._pendingLazyIdleResolve=null),this._pendingLazyIdleId=null,n())};this._pendingLazyIdleResolve=o,this._pendingLazyIdleId=zt(o,{timeout:t})})}_resolvePoolScope(){let e=this._config.pool_scope;return e==="dashboard"||e==="global"||e==="card"?e:u.pool_scope||"card"}_getPoolScopeToken(e){var t,n;if(e==="global")return"global";if(e==="dashboard"){let i=typeof window!="undefined"&&((t=window.location)==null?void 0:t.pathname)||"",o=typeof window!="undefined"&&((n=window.location)==null?void 0:n.search)||"";return`dashboard:${`${i}${o||""}`||"default"}`}return this._config.card_id?`card:${this._config.card_id}`:null}_normalizePoolNumber(e,t,n,i){let o=Number(e);return Number.isFinite(o)?Math.min(i,Math.max(n,Math.floor(o))):t}_getPoolReleaseOptions(){return{scope:this._resolvePoolScope(),maxAgeMs:this._normalizePoolNumber(this._config.pool_ttl_ms,u.pool_ttl_ms,h.POOL_MIN_TTL_MS,h.POOL_MAX_TTL_MS),maxEntries:this._normalizePoolNumber(this._config.pool_max_entries,u.pool_max_entries,h.POOL_MIN_MAX_ENTRIES,h.POOL_MAX_MAX_ENTRIES)}}_getBodyPoolKey(e,t){if(!Array.isArray(e)||e.length===0)return null;let n=this._resolvePoolScope(),i=this._getPoolScopeToken(n);if(!i)return null;let o=`${i}:${t}:${JSON.stringify(e)}`;return`uc-pool:${n}:${this._hashString(o)}`}_hashString(e){let t=0;for(let n=0;n<e.length;n+=1)t=(t<<5)-t+e.charCodeAt(n),t|=0;return String(Math.abs(t))}_cancelPendingBodyLoad(){if(this._bodyLoadToken+=1,this._isLoading=!1,this._bodyLoadPromise=null,this._pendingLazyIdleId!==null&&(Vt(this._pendingLazyIdleId),this._pendingLazyIdleId=null),this._pendingLazyIdleResolve){let e=this._pendingLazyIdleResolve;this._pendingLazyIdleResolve=null,e()}}_releaseBodyCardsToPool(){this._config.enable_card_pool&&this._bodyPoolKey&&this._bodyCards.length>0&&R.release(this._bodyPoolKey,this._bodyCards,this._getPoolReleaseOptions()),this._bodyCards=[]}_recyclePooledCards(e,t){!this._config.enable_card_pool||!e||!Array.isArray(t)||t.length===0||R.release(e,t,this._getPoolReleaseOptions())}_disposeCards(e){!Array.isArray(e)||e.length===0||e.forEach(t=>{if(t){try{typeof t.destroy=="function"&&t.destroy()}catch(n){}typeof t.remove=="function"&&t.remove()}})}_updateChildCardsHass(e){[...this._headerCards,...this._bodyCards,...Object.values(this._tabCards).flat()].forEach(n=>{if(n&&"hass"in n)try{n.hass=e}catch(i){}})}_destroyChildCards(){this._cancelPendingBodyLoad(),this._header&&(this._header.destroy(),this._header=null),this._footer&&(this._footer.destroy(),this._footer=null),this._badges&&(this._badges.destroy(),this._badges=null),this._mode&&typeof this._mode.destroy=="function"&&this._mode.destroy(),this._tabsMode&&typeof this._tabsMode.destroy=="function"&&this._tabsMode.destroy(),this._carouselMode&&typeof this._carouselMode.destroy=="function"&&this._carouselMode.destroy(),this._subviewMode&&typeof this._subviewMode.destroy=="function"&&this._subviewMode.destroy(),this._mode=null,this._tabsMode=null,this._carouselMode=null,this._subviewMode=null,this._releaseBodyCardsToPool(),this._headerCards=[],this._tabCards={},this._bodyCardsLoaded=!1,this._bodyPoolKey=null}_getThemeTokenDeclarations(){let e=/^--[a-z0-9_-]+$/i,t=this._config.theme_tokens||{};return Object.entries(t).filter(([n,i])=>e.test(n)&&typeof i=="string"&&i.trim()).map(([n,i])=>`${n}: ${i.trim()};`).join(`
        `)}_generateStyles(){return`
      /* ============================= */
      /* HOST */
      /* ============================= */
      
      :host {
        display: block;
        --uc-transition-duration: ${this._config.animation_duration}ms;
        --uc-border-radius: ${this._config.border_radius};
        --uc-padding: ${this._config.padding};
        ${this._config.icon_color?`--uc-icon-color: ${this._config.icon_color};`:""}
        ${this._getThemeTokenDeclarations()}
      }
      
      /* ============================= */
      /* CARD */
      /* ============================= */
      
      .universal-card {
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--uc-border-radius);
        box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,0.1));
        overflow: hidden;
      }
      
      /* ============================= */
      /* HEADER & FOOTER STYLES */
      /* ============================= */
      
      ${ln}
      
      /* ============================= */
      /* THEMES */
      /* ============================= */
      
      ${cn}
      
      /* ============================= */
      /* BODY */
      /* ============================= */
      
      .body {
        overflow: hidden;
        will-change: max-height, opacity, transform;
        --expand-duration: var(--uc-transition-duration, 300ms);
      }
      
      /* Base states */
      .body[data-state="collapsed"] {
        max-height: 0;
        opacity: 0;
        overflow: hidden;
        pointer-events: none;
      }
      
      .body[data-state="expanded"] {
        max-height: 2000px;
        opacity: 1;
        overflow: visible;
        pointer-events: auto;
      }
      
      /* ============================= */
      /* EXPAND ANIMATIONS */
      /* ============================= */
      
      /* None - instant */
      .body[data-expand-animation="none"] {
        transition: none !important;
      }
      
      /* Slide (default) */
      .body[data-expand-animation="slide"],
      .body:not([data-expand-animation]) {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease;
      }
      
      /* Fade */
      .body[data-expand-animation="fade"] {
        transition: opacity var(--expand-duration) ease, max-height 0s;
      }
      
      /* Scale */
      .body[data-expand-animation="scale"] {
        transition: 
          max-height var(--expand-duration) cubic-bezier(0.4, 0, 0.2, 1),
          opacity var(--expand-duration) ease,
          transform var(--expand-duration) ease;
        transform-origin: top center;
      }
      .body[data-expand-animation="scale"][data-state="collapsed"] {
        transform: scaleY(0);
      }
      .body[data-expand-animation="scale"][data-state="expanded"] {
        transform: scaleY(1);
      }
      
      /* FadeUp */
      .body[data-expand-animation="fadeUp"].expanding .body-content {
        animation: body-fadeUp var(--expand-duration) ease forwards;
      }
      
      /* FadeDown */
      .body[data-expand-animation="fadeDown"].expanding .body-content {
        animation: body-fadeDown var(--expand-duration) ease forwards;
      }
      
      /* Bounce */
      .body[data-expand-animation="bounce"].expanding .body-content {
        animation: body-bounce var(--expand-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      }
      
      /* Flip */
      .body[data-expand-animation="flip"] {
        perspective: 1000px;
      }
      .body[data-expand-animation="flip"].expanding .body-content {
        animation: body-flip var(--expand-duration) ease forwards;
      }
      
      /* ============================= */
      /* COLLAPSE ANIMATIONS */
      /* ============================= */
      
      .body[data-collapse-animation="none"][data-state="collapsed"] {
        transition: none !important;
      }
      
      .body[data-collapse-animation="fadeDown"].collapsing .body-content {
        animation: body-collapse-fadeDown var(--expand-duration) ease forwards;
      }
      
      .body[data-collapse-animation="fadeUp"].collapsing .body-content {
        animation: body-collapse-fadeUp var(--expand-duration) ease forwards;
      }
      
      .body[data-collapse-animation="scale"].collapsing {
        transform-origin: top center;
        animation: body-collapse-scale var(--expand-duration) ease forwards;
      }
      
      /* ============================= */
      /* BODY KEYFRAMES */
      /* ============================= */
      
      @keyframes body-fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes body-fadeDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes body-bounce {
        0% { opacity: 0; transform: scale(0.3); }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }
      
      @keyframes body-flip {
        from { opacity: 0; transform: perspective(400px) rotateX(-90deg); }
        to { opacity: 1; transform: perspective(400px) rotateX(0); }
      }
      
      @keyframes body-collapse-fadeDown {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
      
      @keyframes body-collapse-fadeUp {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
      }
      
      @keyframes body-collapse-scale {
        from { opacity: 1; transform: scaleY(1); }
        to { opacity: 0; transform: scaleY(0); }
      }
      
      .body-content {
        padding: var(--uc-padding);
      }
      
      /* ============================= */
      /* CARD WRAPPER */
      /* ============================= */
      
      .card-wrapper {
        min-width: 0;
        --card-index: 0;
      }
      
      .card-wrapper > * {
        height: 100%;
      }
      
      /* ============================= */
      /* CARDS CASCADE ANIMATIONS */
      /* ============================= */
      
      /* Card indices for stagger */
      .body-content .card-wrapper:nth-child(1) { --card-index: 0; }
      .body-content .card-wrapper:nth-child(2) { --card-index: 1; }
      .body-content .card-wrapper:nth-child(3) { --card-index: 2; }
      .body-content .card-wrapper:nth-child(4) { --card-index: 3; }
      .body-content .card-wrapper:nth-child(5) { --card-index: 4; }
      .body-content .card-wrapper:nth-child(6) { --card-index: 5; }
      .body-content .card-wrapper:nth-child(7) { --card-index: 6; }
      .body-content .card-wrapper:nth-child(8) { --card-index: 7; }
      .body-content .card-wrapper:nth-child(9) { --card-index: 8; }
      .body-content .card-wrapper:nth-child(10) { --card-index: 9; }
      .body-content .card-wrapper:nth-child(n+11) { --card-index: 10; }
      
      /* Base card animation */
      .body[data-state="expanded"] .card-wrapper {
        opacity: 0;
        animation-fill-mode: forwards;
        animation-delay: calc(var(--card-index) * var(--cards-stagger, 50ms));
        animation-duration: var(--expand-duration, 300ms);
      }
      
      /* FadeUp (default) */
      .body[data-cards-animation="fadeUp"][data-state="expanded"] .card-wrapper {
        animation-name: card-fadeUp;
      }
      
      /* FadeDown */
      .body[data-cards-animation="fadeDown"][data-state="expanded"] .card-wrapper {
        animation-name: card-fadeDown;
      }
      
      /* FadeLeft */
      .body[data-cards-animation="fadeLeft"][data-state="expanded"] .card-wrapper {
        animation-name: card-fadeLeft;
      }
      
      /* FadeRight */
      .body[data-cards-animation="fadeRight"][data-state="expanded"] .card-wrapper {
        animation-name: card-fadeRight;
      }
      
      /* Scale */
      .body[data-cards-animation="scale"][data-state="expanded"] .card-wrapper {
        animation-name: card-scale;
      }
      
      /* Bounce */
      .body[data-cards-animation="bounce"][data-state="expanded"] .card-wrapper {
        animation-name: card-bounce;
        animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }
      
      /* Flip */
      .body[data-cards-animation="flip"][data-state="expanded"] .card-wrapper {
        animation-name: card-flip;
        perspective: 1000px;
      }
      
      /* None - instant */
      .body[data-cards-animation="none"][data-state="expanded"] .card-wrapper {
        opacity: 1;
        animation: none;
      }
      
      /* Collapsed state - hide cards */
      .body[data-state="collapsed"] .card-wrapper {
        opacity: 0;
        animation: none;
      }
      
      /* Card Animation Keyframes */
      @keyframes card-fadeUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes card-fadeDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes card-fadeLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes card-fadeRight {
        from {
          opacity: 0;
          transform: translateX(30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes card-scale {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes card-bounce {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          opacity: 0.9;
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.95);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes card-flip {
        from {
          opacity: 0;
          transform: perspective(400px) rotateY(-90deg);
        }
        to {
          opacity: 1;
          transform: perspective(400px) rotateY(0);
        }
      }
      
      /* ============================= */
      /* SKELETON */
      /* ============================= */
      
      .skeleton-container {
        transition: opacity 0.2s ease;
      }
      
      .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .skeleton-card {
        padding: 16px;
        background: var(--secondary-background-color);
        border-radius: 8px;
        margin-bottom: 8px;
      }
      
      .skeleton-line {
        height: 12px;
        background: var(--divider-color);
        border-radius: 4px;
        margin-bottom: 8px;
        animation: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .skeleton-line.title {
        width: 60%;
        height: 16px;
      }
      
      .skeleton-line.text {
        width: 100%;
      }
      
      .skeleton-line.short {
        width: 40%;
      }
      
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      
      /* ============================= */
      /* MODE STYLES */
      /* ============================= */
      
      ${dn()}
    `}_getGridStyles(){let e=this._config.grid||{},t=e.columns||u.grid_columns,n=e.gap||u.grid_gap;return typeof t=="number"?t<=1?"":`
        display: grid;
        grid-template-columns: repeat(${t}, 1fr);
        gap: ${n};
      `.replace(/\s+/g," ").trim():typeof t=="string"&&t.trim()?`
        display: grid;
        grid-template-columns: ${t};
        gap: ${n};
      `.replace(/\s+/g," ").trim():""}_calculateAnimationIndices(e,t,n){let i=[],o=typeof n=="number"?n:1,a=Math.ceil(e/o);switch(t){case"reverse":for(let _=0;_<e;_++)i.push(e-1-_);break;case"center-out":let s=Math.floor(e/2);for(let _=0;_<e;_++)i.push(Math.abs(_-s));break;case"edges-in":let l=Math.floor(e/2);for(let _=0;_<e;_++){let y=Math.abs(_-l);i.push(l-y)}break;case"diagonal":for(let _=0;_<e;_++){let y=Math.floor(_/o),S=_%o;i.push(y+S)}break;case"wave":for(let _=0;_<e;_++){let y=Math.floor(_/o),S=_%o,k=y%2===0?S:o-1-S;i.push(y*2+k)}break;case"random":let c=Array.from({length:e},(_,y)=>y),b=e*7+o*13;for(let _=c.length-1;_>0;_--){b=b*1103515245+12345&2147483647;let y=b%(_+1);[c[_],c[y]]=[c[y],c[_]]}for(let _=0;_<e;_++)i.push(c.indexOf(_));break;case"sequential":default:for(let _=0;_<e;_++)i.push(_);break}return i}_bindEvents(){let e=this.shadowRoot.querySelector(".header");e&&(p("[UC] binding header events"),e.addEventListener("uc-toggle",()=>{p("[UC] uc-toggle received!"),this._toggle()}),e.addEventListener("uc-expand",()=>{p("[UC] uc-expand received!"),this._expand()}),e.addEventListener("uc-collapse",()=>{p("[UC] uc-collapse received!"),this._collapse()}),e.addEventListener("uc-context-menu",t=>this._handleContextMenu(t)))}_handleContextMenu(e){console.debug("[UniversalCard] Context menu:",e.detail)}_handleExternalControl(e){let{card_id:t,action:n}=e.detail||{};if(!(t&&t!==this._config.card_id))switch(n){case"expand":this._expand();break;case"collapse":this._collapse();break;case"toggle":this._toggle();break}}_handleSwipeAction(e){switch(e==null?void 0:e.action){case"expand":this._expand();break;case"collapse":this._collapse();break;case"toggle":this._toggle();break;case"next":this._navigateRelative(1);break;case"prev":this._navigateRelative(-1);break}}_navigateRelative(e){if(this._carouselMode){e>0?this._carouselMode.next():this._carouselMode.prev();return}if(this._tabsMode){let t=(this._modeState.activeTab||0)+e;this._tabsMode._selectTab(t)}}_handleResize(){this._updateDynamicContent()}_toggle(){this._expanded?this._collapse():this._expand()}async _expand(){if(this._expanded||!this._isCardVisible()||!this._isSectionVisible("body"))return;let e=this._config.body_mode||"expand",t=++this._expandRequestToken,n=this._expanded,i=!this._bodyCardsLoaded&&e==="expand"?this._loadBodyCards().catch(o=>{console.error("[UniversalCard] Failed to load body cards during expand:",o)}):null;if(this._expanded=!0,this._saveState(),this._notifyStateChange("expanded",n,this._expanded,"expand"),e==="modal"||e==="fullscreen"||e==="subview"){if(!this._mode)throw new Error(`Mode "${e}" is not initialized`);try{await this._mode.open()}catch(o){console.error("[UniversalCard] Failed to open mode:",o),this._handleModeClosed();return}if(!this._mode.active){this._handleModeClosed();return}this._updateExpandedUI()}else if(e==="tabs"&&this._tabsMode)this._updateExpandedUI(),await this._tabsMode.open();else if(e==="carousel"&&this._carouselMode)this._updateExpandedUI(),await this._carouselMode.open();else{let o=this.shadowRoot.querySelector(".body");this._updateExpandedUI(),o&&(o.classList.remove("collapsing"),o.classList.add("expanding"));let a=this._config.animation_duration||300;setTimeout(()=>{o&&o.classList.remove("expanding")},a+50)}i&&(await i,t!==this._expandRequestToken||!this._expanded)||(L(this,Y.CARD_EXPANDED,{card_id:this._config.card_id}),this._setupAutoCollapse())}_collapse(){if(!this._expanded)return;let e=this._expanded;this._expandRequestToken+=1,this._expanded=!1,this._saveState(),this._clearAutoCollapseTimer(),this._notifyStateChange("expanded",e,this._expanded,"collapse");let t=this._config.body_mode||"expand";if(t==="modal"||t==="fullscreen"||t==="subview"){if(!this._mode)throw new Error(`Mode "${t}" is not initialized`);this._mode.close(),this._updateExpandedUI()}else if(t==="tabs"&&this._tabsMode)this._updateExpandedUI(),this._tabsMode.close();else if(t==="carousel"&&this._carouselMode)this._updateExpandedUI(),this._carouselMode.close();else{let n=this.shadowRoot.querySelector(".body");n&&(n.classList.remove("expanding"),n.classList.add("collapsing")),this._updateExpandedUI();let i=this._config.animation_duration||300;setTimeout(()=>{n&&n.classList.remove("collapsing")},i+50)}L(this,Y.CARD_COLLAPSED,{card_id:this._config.card_id})}_showModal(){this._hideModal();let e=document.createElement("div");e.className="uc-modal-overlay",e.innerHTML=`
      <style>
        .uc-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          animation: uc-fade-in 0.2s ease;
        }
        .uc-modal-content {
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow: auto;
          padding: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: uc-scale-in 0.2s ease;
        }
        .uc-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .uc-modal-title {
          font-size: 18px;
          font-weight: 500;
        }
        .uc-modal-close {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          color: white;
          font-size: 16px;
        }
        .uc-modal-close:hover {
          background: rgba(255,255,255,0.2);
        }
        .uc-modal-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @keyframes uc-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes uc-scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      </style>
      <div class="uc-modal-content">
        <div class="uc-modal-header">
          <div class="uc-modal-title"></div>
          <button class="uc-modal-close">\u2715</button>
        </div>
        <div class="uc-modal-cards"></div>
      </div>
    `;let t=e.querySelector(".uc-modal-title");t&&(t.textContent=this._config.title||"Modal");let n=e.querySelector(".uc-modal-cards");this._bodyCards.forEach(i=>{this._hass&&(i.hass=this._hass),n.appendChild(i)}),e.querySelector(".uc-modal-close").addEventListener("click",()=>this._collapse()),e.addEventListener("click",i=>{i.target===e&&this._collapse()}),this._modalEscHandler=i=>{i.key==="Escape"&&this._collapse()},document.addEventListener("keydown",this._modalEscHandler),document.body.appendChild(e),this._modalOverlay=e}_hideModal(){this._modalOverlay&&(this._modalOverlay.remove(),this._modalOverlay=null),this._modalEscHandler&&(document.removeEventListener("keydown",this._modalEscHandler),this._modalEscHandler=null)}_showFullscreen(){this._hideFullscreen();let e=document.createElement("div");e.className="uc-fullscreen-overlay",e.innerHTML=`
      <style>
        .uc-fullscreen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--ha-card-background, var(--card-background-color, #1c1c1c));
          z-index: 9999;
          overflow: auto;
          padding: 20px;
          animation: uc-slide-up 0.3s ease;
        }
        .uc-fullscreen-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .uc-fullscreen-title {
          font-size: 24px;
          font-weight: 500;
        }
        .uc-fullscreen-close {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          color: white;
          font-size: 14px;
        }
        .uc-fullscreen-close:hover {
          background: rgba(255,255,255,0.2);
        }
        .uc-fullscreen-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 800px;
          margin: 0 auto;
        }
        @keyframes uc-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      </style>
      <div class="uc-fullscreen-header">
        <div class="uc-fullscreen-title"></div>
        <button class="uc-fullscreen-close">\u2715 \u0417\u0430\u043A\u0440\u044B\u0442\u044C</button>
      </div>
      <div class="uc-fullscreen-content"></div>
    `;let t=e.querySelector(".uc-fullscreen-title");t&&(t.textContent=this._config.title||"Fullscreen");let n=e.querySelector(".uc-fullscreen-content");this._bodyCards.forEach(i=>{this._hass&&(i.hass=this._hass),n.appendChild(i)}),e.querySelector(".uc-fullscreen-close").addEventListener("click",()=>{this._collapse()}),this._fsEscHandler=i=>{i.key==="Escape"&&this._collapse()},document.addEventListener("keydown",this._fsEscHandler),document.body.appendChild(e),this._fullscreenOverlay=e}_hideFullscreen(){this._fullscreenOverlay&&(this._fullscreenOverlay.remove(),this._fullscreenOverlay=null),this._fsEscHandler&&(document.removeEventListener("keydown",this._fsEscHandler),this._fsEscHandler=null)}_updateExpandedUI(){if(this._header&&(this._header.expanded=this._expanded),!this._isSectionVisible("body"))return;let e=this._config.body_mode||"expand";if(e==="modal"||e==="fullscreen"||e==="subview")return;let t=this.shadowRoot.querySelector(".body");t&&(t.dataset.state=this._expanded?"expanded":"collapsed")}_setupIntersectionObserver(){this._config.lazy_load&&(this._intersectionObserver=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&this._expanded&&!this._bodyCardsLoaded&&this._loadBodyCards()})},{rootMargin:h.INTERSECTION_MARGIN}))}_observeForLazyLoad(){this._intersectionObserver&&this._intersectionObserver.observe(this)}_destroyIntersectionObserver(){this._intersectionObserver&&(this._intersectionObserver.disconnect(),this._intersectionObserver=null)}_setupAutoCollapse(){let e=this._config.auto_collapse_after;!e||e<=0||(this._clearAutoCollapseTimer(),this._autoCollapseTimer=setTimeout(()=>{this._collapse()},e*1e3))}_clearAutoCollapseTimer(){this._autoCollapseTimer&&(clearTimeout(this._autoCollapseTimer),this._autoCollapseTimer=null)}_clearAllTimers(){this._clearAutoCollapseTimer(),this._carouselTimer&&(clearInterval(this._carouselTimer),this._carouselTimer=null),this._visibilityRefreshTimer&&(clearTimeout(this._visibilityRefreshTimer),this._visibilityRefreshTimer=null),typeof this._resizeHandler.cancel=="function"&&this._resizeHandler.cancel(),typeof this._hassUpdateHandler.cancel=="function"&&this._hassUpdateHandler.cancel()}_syncVisibilityRefreshTimer(){if(this._visibilityRefreshTimer&&(clearTimeout(this._visibilityRefreshTimer),this._visibilityRefreshTimer=null),![this._visibilityEvaluator,...Object.values(this._sectionVisibilityEvaluators||{})].some(o=>o&&typeof o.hasTimeDependencies=="function"&&o.hasTimeDependencies()))return;let n=new Date,i=(60-n.getSeconds())*1e3-n.getMilliseconds()+50;this._visibilityRefreshTimer=setTimeout(()=>{this._visibilityRefreshTimer=null,this._updateDynamicContent(),this._syncVisibilityRefreshTimer()},Math.max(250,i))}_recordPerfMetric(e,t,n={}){var i;ze.record(e,t,{card_id:(i=this._config)==null?void 0:i.card_id,...n})}_updateDynamicContent(){let e=performance.now();this._executePluginHookSync(g.BEFORE_UPDATE,{config:this._config,expanded:this._expanded},{phase:"update"}),this._applyVisibilityState();let t=performance.now()-e;this._recordPerfMetric("update",t),this._executePluginHookSync(g.AFTER_UPDATE,{config:this._config,expanded:this._expanded,durationMs:t},{phase:"update"})}getCardSize(){return this._expanded?3:1}};var hn=1,Jn=1,ei="development",yt=Object.freeze({elements:1,config:1,loaders:1,devtools:1,plugins:2}),pn=Object.freeze({elements:Object.freeze(["card","editor"]),config:Object.freeze(["getSchema","getCurrentVersion","migrate","validate","normalize","hasChanged"]),loaders:Object.freeze(["advanced","editor","cardEditor","devtools"]),devtools:Object.freeze(["enable","disable"]),plugins:Object.freeze(["register","unregister","enable","disable","list","create","getHooks","getPriorities"])}),_n=Object.freeze({cardPool:!0,sectionVisibility:!0,themeTokens:!0,customCss:!0,lazyBundles:!0,devtools:!0,pluginLifecycle:!0,pluginUiHooks:!0}),ti=Object.freeze({version:hn,stage:ei,configVersion:T,namespaceVersions:yt,compatibility:Object.freeze({backwardCompatible:!1,declaredNamespacesOnly:!0,strictConfigValidationRequiresCurrentVersion:!0,normalizeAutoMigratesLegacyConfig:!0,pluginsRequireLocalRegistration:!0})}),ni=Object.freeze({version:Jn,policyVersion:hn,schema:"2026-03-dev",configVersion:T,bodyModes:Object.freeze([...Object.values(E)]),themes:Object.freeze([...Object.values(J)]),namespaceVersions:yt,publicNamespaces:pn,pluginLifecycleVersion:Ft,pluginHooks:Object.freeze([...Object.values(Fe)]),pluginPriorities:fe,features:_n});function ii(r,e=1){let t=yt[r];return Number.isInteger(t)&&t>=e}function ri(r,e){let t=pn[r];return Array.isArray(t)&&t.includes(e)}function oi(r){return _n[r]===!0}function mn(r){let e=Object.freeze({...ti,supportsNamespace:ii,supportsMember:ri,hasFeature:oi});return Object.freeze({version:r.version,policy:e,elements:Object.freeze({card:r.elements.card,editor:r.elements.editor}),capabilities:ni,config:Object.freeze({getSchema:r.config.getSchema,getCurrentVersion:r.config.getCurrentVersion,migrate:r.config.migrate,validate:r.config.validate,normalize:r.config.normalize,hasChanged:r.config.hasChanged}),loaders:Object.freeze({advanced:r.loaders.advanced,editor:r.loaders.editor,cardEditor:r.loaders.cardEditor,devtools:r.loaders.devtools}),devtools:Object.freeze({enable:r.devtools.enable,disable:r.devtools.disable}),plugins:Object.freeze({register:r.plugins.register,unregister:r.plugins.unregister,enable:r.plugins.enable,disable:r.plugins.disable,list:r.plugins.list,create:r.plugins.create,getHooks:r.plugins.getHooks,getPriorities:r.plugins.getPriorities})})}p("[UC] 1. Start loading");p("[UC] 2. Constants loaded");p("[UC] 3. UniversalCard loaded");p("[UC] 4. Config loaded");p("[UC] 4.1 Runtime services loaded");p("[UC] 6. Performance utils loaded");p("[UC] 7. Helpers loaded");p("[UC] 8. HA helpers loaded");p("[UC] 9. Modes loaded");p("[UC] 10. Features loaded");p("[UC] 11. UI loaded");p("[UC] 12. Optional bundles are lazy-loaded");p("[UC] 18. Extensibility loaded");p("[UC] 18.1 Public API policy loaded");p("[UC] 19. Styles loaded");p("[UC] 20. Starting registration...");customElements.get("universal-card")||(p("[UC] 21. Defining universal-card..."),customElements.define("universal-card",et),p("[UC] 22. universal-card defined"));window.customCards=window.customCards||[];window.customCards.some(r=>r.type==="universal-card")||window.customCards.push({type:"universal-card",name:Lt,description:Pt,preview:!0,documentationURL:"https://github.com/Mesteriis/universal-card"});var ai=Object.freeze({advanced:"lazy/uc-lazy-advanced.js",editor:"lazy/uc-lazy-editor.js",cardEditor:"lazy/uc-lazy-card-editor.js",devtools:"lazy/uc-lazy-devtools.js"}),tt=new Map;function vt(r){if(typeof queueMicrotask=="function"){queueMicrotask(r);return}Promise.resolve().then(r)}function si(){let r=Array.from(document.scripts||[]),e=document.currentScript,t=e?[e,...r]:r;for(let n of t){let i=(n==null?void 0:n.src)||"";if(i&&i.includes("universal-card.js"))return i.slice(0,i.lastIndexOf("/")+1)}return"/local/"}async function nt(r){if(tt.has(r))return tt.get(r);let e=ai[r];if(!e)throw new Error(`Unknown lazy bundle: ${r}`);let i=import(`${si()}${e}`).catch(o=>{throw tt.delete(r),o});return tt.set(r,i),i}async function di(){return nt("advanced")}async function li(){return nt("editor")}async function fn(){return nt("devtools")}async function ci(){return nt("cardEditor")}var Et="universal-card-editor",St="universal-card-editor-real",xe=null;async function gn(){return xe||(xe=ci().then(r=>{let e=r,t=e.UniversalCardEditor||e.default;if(!t)throw new Error("Lazy card editor bundle does not export UniversalCardEditor");return customElements.get(St)||customElements.define(St,t),t}).catch(r=>{throw xe=null,r}),xe)}var At=class extends HTMLElement{constructor(){super(),this._editorEl=null,this._mountPromise=null,this._hasPendingHass=!1,this._pendingHass=null,this._hasPendingConfig=!1,this._pendingConfig=null}connectedCallback(){vt(()=>{this._ensureMountedEditor()})}disconnectedCallback(){this._editorEl&&this._editorEl.parentNode===this&&this.removeChild(this._editorEl),this._editorEl=null}set hass(e){if(this._pendingHass=e,this._hasPendingHass=!0,this._editorEl){this._editorEl.hass=e;return}vt(()=>{this._ensureMountedEditor()})}setConfig(e){if(this._pendingConfig=e,this._hasPendingConfig=!0,this._editorEl&&typeof this._editorEl.setConfig=="function"){this._editorEl.setConfig(e);return}vt(()=>{this._ensureMountedEditor()})}async _ensureMountedEditor(){return this._editorEl?this._editorEl:this.isConnected?this._mountPromise?this._mountPromise:(this._mountPromise=this._mountEditor().catch(e=>{throw console.error("[UC] Failed to lazy-load editor class:",e),e}).finally(()=>{this._mountPromise=null}),this._mountPromise):null}async _mountEditor(){if(await gn(),!this.isConnected)return null;if(this._editorEl)return this._editorEl;let e=document.createElement(St);for(this._editorEl=e;this.firstChild;)this.removeChild(this.firstChild);return this.appendChild(e),this._hasPendingHass&&(e.hass=this._pendingHass),this._hasPendingConfig&&typeof e.setConfig=="function"&&e.setConfig(this._pendingConfig),e}};customElements.get(Et)||(p("[UC] 23. Defining universal-card-editor (lazy proxy)..."),customElements.define(Et,At),p("[UC] 24. universal-card-editor defined"));var Ce=je();window.UniversalCard=mn({version:rt,elements:{card:"universal-card",editor:Et},config:{getSchema:()=>D.getSchema(),getCurrentVersion:()=>D.getCurrentConfigVersion(),migrate:r=>D.migrate(r),validate:r=>D.validate(r),normalize:r=>D.normalize(r),hasChanged:(r,e)=>D.hasChanged(r,e)},loaders:{advanced:di,editor:li,cardEditor:gn,devtools:fn},devtools:{enable:()=>window.enableUniversalCardDebug(),disable:()=>window.disableUniversalCardDebug()},plugins:{register:r=>Ce.register(r),unregister:r=>Ce.unregister(r),enable:r=>Ce.enable(r),disable:r=>Ce.disable(r),list:()=>Ce.getPlugins(),create:r=>_t(r),getHooks:()=>[...Object.values(Fe)],getPriorities:()=>fe}});console.info("%c \u{1F3B4} UNIVERSAL-CARD %c v"+rt+" %c","color: white; background: #3498db; font-weight: bold; padding: 2px 8px; border-radius: 4px 0 0 4px;","color: #3498db; background: #ecf0f1; font-weight: bold; padding: 2px 8px; border-radius: 0 4px 4px 0;","");var xt=null,Ct=null,wt=null;async function Tt(){return wt||(wt=fn().then(r=>{let e=r;return e.devtools||e})),wt}function bn(r,e=document){let t=[],n=e.querySelectorAll(r);for(let o=0;o<n.length;o+=1)t.push(n[o]);let i=e.querySelectorAll("*");for(let o=0;o<i.length;o+=1){let a=i[o];if(a.shadowRoot){let s=bn(r,a.shadowRoot);for(let l=0;l<s.length;l+=1)t.push(s[l])}}return t}window.__UC_DEVTOOLS__={_ensureLogger:async function(){if(!xt){let r=await Tt();xt=new r.EventLogger({enabled:!0})}return xt},_ensureProfiler:async function(){if(!Ct){let r=await Tt();Ct=new r.PerformanceProfiler({enabled:!0})}return Ct},findCards:function(){return bn("universal-card")},showLogger:function(){return this._ensureLogger().then(function(r){r.showPanel()}).catch(function(r){console.error("[UC] Failed to load logger:",r)}),"Logger panel requested"},showProfiler:function(){return this._ensureProfiler().then(function(r){r.showPanel()}).catch(function(r){console.error("[UC] Failed to load profiler:",r)}),"Profiler panel requested"},showInspector:function(){console.log("%c\u{1F4CA} State Inspector","color: #9b59b6; font-weight: bold;"),console.log("All universal-card elements (including Shadow DOM):");let r=this.findCards();return r.forEach(function(e,t){console.log("Card "+t+":",{title:e._config?e._config.title:"unknown",config:e._config,expanded:e._expanded,hass:e._hass?"connected":"not connected",bodyCards:e._bodyCards?e._bodyCards.length:0})}),"Found "+r.length+" cards"},listCards:function(){let r=this.findCards();return console.table(Array.from(r).map(function(e,t){return{index:t,title:e._config?e._config.title:"unknown",mode:e._config?e._config.body_mode:"unknown",expanded:e._expanded}})),r.length+" cards found"},runtimeStats:function(){let r={pool:R.getStats(),perf:ze.snapshot()};return console.log("%c\u26A1 Universal Card Runtime Stats","color: #26a69a; font-weight: bold;"),console.log(r),r},toggleCard:function(r){let e=this.findCards();return e[r]?(e[r]._toggle(),"Toggled card "+r):"Card not found"},getCard:function(r){return this.findCards()[r]||null}};window.enableUniversalCardDebug=function(){return it(!0),Tt(),console.log("%c\u{1F527} Universal Card Debug Mode Enabled","color: #03a9f4; font-weight: bold; font-size: 14px;"),console.log(""),console.log("%cAvailable commands:","font-weight: bold;"),console.log("  \u2022 __UC_DEVTOOLS__.listCards()       - List all cards"),console.log("  \u2022 __UC_DEVTOOLS__.showInspector()   - Show card states"),console.log("  \u2022 __UC_DEVTOOLS__.toggleCard(0)     - Toggle card by index"),console.log("  \u2022 __UC_DEVTOOLS__.getCard(0)        - Get card element"),console.log("  \u2022 __UC_DEVTOOLS__.runtimeStats()    - Pool + perf stats"),console.log("  \u2022 __UC_DEVTOOLS__.showLogger()      - Show event logger"),console.log("  \u2022 __UC_DEVTOOLS__.showProfiler()    - Show profiler"),console.log("  \u2022 disableUniversalCardDebug()       - Disable debug mode"),console.log(""),console.log("%cQuick access:","font-weight: bold;"),console.log("  \u2022 window.UniversalCard - Platform API"),console.log("  \u2022 window.UniversalCard.policy - Public API contract"),console.log("  \u2022 window.UniversalCard.plugins - Plugin lifecycle API"),"Debug mode enabled! Logs will now appear. Try __UC_DEVTOOLS__.listCards()"};window.disableUniversalCardDebug=function(){return it(!1),console.log("%c\u{1F527} Universal Card Debug Mode Disabled","color: #888; font-weight: bold;"),"Debug mode disabled. Logs will be suppressed."};p("[UC] Debug functions registered: enableUniversalCardDebug(), __UC_DEVTOOLS__");})();
