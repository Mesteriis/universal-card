var M=Object.freeze({EXPAND:"expand",MODAL:"modal",FULLSCREEN:"fullscreen",TABS:"tabs",CAROUSEL:"carousel",SUBVIEW:"subview",NONE:"none"}),z=Object.values(M),be=Object.freeze({TAP:"tap",HOLD:"hold",DOUBLE_TAP:"double_tap",NONE:"none"}),P=Object.values(be),ge=Object.freeze({CARD:"card",DASHBOARD:"dashboard",GLOBAL:"global"}),H=Object.values(ge),V=Object.freeze({DEFAULT:"default",TRANSPARENT:"transparent",SOLID:"solid",GLASS:"glass",GLASSMORPHISM:"glassmorphism",NEUMORPHISM:"neumorphism",MINIMAL:"minimal",GRADIENT:"gradient",DARK:"dark",NEON:"neon",AURORA:"aurora",CARBON:"carbon",SLATE:"slate",OBSIDIAN:"obsidian",CHARCOAL:"charcoal",MIDNIGHT:"midnight",CYBER:"cyber",VOID:"void",EMBER:"ember",FOREST:"forest",OCEAN:"ocean",PURPLE_HAZE:"purple-haze",MATRIX:"matrix",GRAPHITE:"graphite",SMOKE:"smoke",NORD:"nord",DRACULA:"dracula",MONOKAI:"monokai",TOKYO_NIGHT:"tokyo-night",CATPPUCCIN:"catppuccin"}),ye=Object.freeze({NONE:"none",FADE:"fade",FADE_UP:"fadeUp",FADE_DOWN:"fadeDown",SCALE:"scale",SLIDE:"slide",BOUNCE:"bounce",FLIP:"flip"}),U=Object.values(ye),ve=Object.freeze({NONE:"none",FADE:"fade",FADE_DOWN:"fadeDown",FADE_UP:"fadeUp",SCALE:"scale",SLIDE:"slide"}),B=Object.values(ve),Ee=Object.freeze({NONE:"none",FADE_UP:"fadeUp",FADE_DOWN:"fadeDown",FADE_LEFT:"fadeLeft",FADE_RIGHT:"fadeRight",SCALE:"scale",BOUNCE:"bounce",FLIP:"flip"}),j=Object.values(Ee),we=Object.freeze({SEQUENTIAL:"sequential",REVERSE:"reverse",CENTER_OUT:"center-out",EDGES_IN:"edges-in",DIAGONAL:"diagonal",WAVE:"wave",RANDOM:"random"}),F=Object.values(we),Ce=Object.freeze({NONE:"none",FADE:"fade",SLIDE:"slide",BOUNCE:"bounce",ELASTIC:"elastic",SMOOTH:"smooth",SHARP:"sharp",ZOOM:"zoom"}),Ne=Object.freeze({SKELETON:"skeleton",SPINNER:"spinner",DOTS:"dots",PROGRESS:"progress",SHIMMER:"shimmer",PULSE:"pulse"}),v=Object.freeze({STATE:"state",NUMERIC_STATE:"numeric_state",USER:"user",TIME:"time",SCREEN:"screen",AND:"and",OR:"or",NOT:"not"}),pe=Object.values(v),ke=Object.freeze({MON:"mon",TUE:"tue",WED:"wed",THU:"thu",FRI:"fri",SAT:"sat",SUN:"sun"}),G=Object.values(ke),L=Object.freeze({NONE:"none",TOGGLE:"toggle",CALL_SERVICE:"call-service",NAVIGATE:"navigate",URL:"url",MORE_INFO:"more-info",FIRE_EVENT:"fire-dom-event",EXPAND:"expand",COLLAPSE:"collapse"}),Ae=Object.freeze({HORIZONTAL:"horizontal",VERTICAL:"vertical",BOTH:"both"}),X=Object.values(Ae),De=Object.freeze({NONE:"none",EXPAND:"expand",COLLAPSE:"collapse",TOGGLE:"toggle",NEXT:"next",PREV:"prev"}),Y=Object.values(De),T=Object.freeze({STATE:"state",ATTRIBUTE:"attribute",COUNTER:"counter",CUSTOM:"custom"}),q=Object.values(T),N=Object.freeze({EQUALS:"==",NOT_EQUALS:"!=",GREATER_THAN:">",LESS_THAN:"<",GREATER_THAN_OR_EQUALS:">=",LESS_THAN_OR_EQUALS:"<="}),O=Object.values(N),he=Object.freeze({NONE:"none",TIME:"time",DATE:"date",DURATION:"duration"}),W=Object.values(he),Se=Object.freeze({LAZY:"lazy",PRELOAD:"preload"}),k=Object.values(Se),Ge=Object.freeze({CARD_EXPANDED:"universal-card-expanded",CARD_COLLAPSED:"universal-card-collapsed",CARD_CONTROL:"universal-card-control",CONFIG_CHANGED:"config-changed",HASS_UPDATED:"hass-updated"}),Xe=Object.freeze({PRIMARY:"--uc-primary-color",SECONDARY:"--uc-secondary-color",ACCENT:"--uc-accent-color",BACKGROUND:"--uc-background-color",SURFACE:"--uc-surface-color",TEXT:"--uc-text-color",TEXT_SECONDARY:"--uc-text-secondary-color",BORDER:"--uc-border-color",BORDER_RADIUS:"--uc-border-radius",PADDING:"--uc-padding",GAP:"--uc-gap",SHADOW:"--uc-shadow",SHADOW_HOVER:"--uc-shadow-hover",TRANSITION_DURATION:"--uc-transition-duration",TRANSITION_TIMING:"--uc-transition-timing"}),d=Object.freeze({body_mode:M.EXPAND,expand_trigger:be.TAP,expanded:!1,animation:!0,stability_mode:!1,theme:V.DEFAULT,border_radius:"var(--ha-card-border-radius, 12px)",padding:"16px",grid_columns:1,grid_gap:"16px",modal_width:"90%",modal_height:"auto",modal_max_width:"600px",modal_max_height:"85vh",modal_loading_strategy:Se.LAZY,backdrop_color:"rgba(0, 0, 0, 0.6)",lazy_load:!0,lazy_initial_batch:4,lazy_batch_size:4,lazy_idle_timeout:800,remember_expanded_state:!1,remember_mode_state:!0,auto_collapse_after:0,enable_card_pool:!0,pool_scope:ge.CARD,pool_ttl_ms:10*60*1e3,pool_max_entries:32,show_expand_icon:!0,expand_icon:"mdi:chevron-down",haptic:!1,loading_type:Ne.SKELETON,skeleton_count:3,carousel_autoplay:!1,carousel_interval:5e3,swipe_enabled:!1,swipe_direction:Ae.HORIZONTAL,swipe_threshold:50,swipe_velocity_threshold:.3,swipe_prevent_scroll:!1,expand_animation:ye.SLIDE,collapse_animation:ve.SLIDE,cards_animation:Ee.FADE_UP,cards_stagger:50,cards_direction:we.SEQUENTIAL,animation_preset:Ce.SMOOTH,animation_duration:300}),Ye=Object.freeze({TTI_MS:250,RENDER_MS:16,UPDATE_MS:12,BODY_LOAD_MS:180,BUNDLE_SIZE_KB:360}),l=Object.freeze({MAX_GRID_COLUMNS:12,MIN_GRID_COLUMNS:1,MAX_CARDS_PER_BODY:100,MAX_TABS:20,UPDATE_THROTTLE_MS:100,RESIZE_DEBOUNCE_MS:200,INTERSECTION_MARGIN:"100px",LAZY_MIN_BATCH:1,LAZY_MAX_BATCH:25,LAZY_MIN_TIMEOUT_MS:50,LAZY_MAX_TIMEOUT_MS:5e3,CARD_POOL_MAX_ENTRIES:32,CARD_POOL_MAX_AGE_MS:10*60*1e3,CARD_POOL_HARD_MAX_ENTRIES:512,POOL_MIN_TTL_MS:1e3,POOL_MAX_TTL_MS:60*60*1e3,POOL_MIN_MAX_ENTRIES:1,POOL_MAX_MAX_ENTRIES:512,AUTO_COLLAPSE_MAX_SECONDS:3600,ANIMATION_DURATION_MAX_MS:2e3,CAROUSEL_MIN_INTERVAL_MS:1e3,CAROUSEL_MAX_INTERVAL_MS:6e4,CARDS_STAGGER_MAX_MS:200,SWIPE_MAX_THRESHOLD_PX:400,SWIPE_MAX_VELOCITY_THRESHOLD:5,BADGE_MAX_PRECISION:6,METRICS_HISTORY_SIZE:200,MAX_UNDO_HISTORY:50,MAX_LOG_ENTRIES:1e3});function xe(s="uc"){let e=Math.random().toString(36).substring(2,10);return`${s}-${e}`}function _(s){return s!==null&&typeof s=="object"&&!Array.isArray(s)}function x(s){return typeof s=="string"&&s.trim().length>0}function p(s){return typeof s=="number"&&!Number.isNaN(s)}function Z(s){if(s===null||typeof s!="object")return s;if(Array.isArray(s))return s.map(t=>Z(t));let e={};return Object.keys(s).forEach(t=>{e[t]=Z(s[t])}),e}function b(s,e,t={},i={}){let n=new CustomEvent(e,{bubbles:i.bubbles!==!1,cancelable:i.cancelable!==!1,composed:i.composed!==!1,detail:t});return s.dispatchEvent(n),n}function C(s){return x(s)?/^[a-z_]+\.[a-z0-9_]+$/.test(s):!1}var K=1,w=2;function Te(s){if(Array.isArray(s))return{cards:s};if(_(s)){let e=s;return Array.isArray(e.cards)?{...e,cards:e.cards}:{...e}}return null}function f(s,e,t){s.push({path:e,message:t})}function $e(s,e){if(s.cards!==void 0&&(_(s.body)||(s.body={}),s.body.cards===void 0?(s.body.cards=Array.isArray(s.cards)?[...s.cards]:s.cards,f(e,"cards","Moved legacy root cards to body.cards.")):f(e,"cards","Dropped legacy root cards because body.cards already exists."),delete s.cards),s.remember_state!==void 0&&(s.remember_expanded_state===void 0?(s.remember_expanded_state=s.remember_state,f(e,"remember_state","Renamed remember_state to remember_expanded_state.")):f(e,"remember_state","Removed remember_state because remember_expanded_state already exists."),delete s.remember_state),s.state_styles_entity!==void 0&&(s.entity===void 0?(s.entity=s.state_styles_entity,f(e,"state_styles_entity","Promoted state_styles_entity to root entity.")):f(e,"state_styles_entity","Removed state_styles_entity because root entity already exists."),delete s.state_styles_entity),s.debug!==void 0&&(delete s.debug,f(e,"debug","Removed deprecated debug config field.")),_(s.header)){let{header:t}=s;if(t.left!==void 0){if(s.header_left===void 0){let i=Te(t.left);i&&(s.header_left=i,f(e,"header.left","Moved legacy header.left to root header_left."))}else f(e,"header.left","Dropped legacy header.left because header_left already exists.");delete t.left}if(t.right!==void 0){if(s.header_right===void 0){let i=Te(t.right);i&&(s.header_right=i,f(e,"header.right","Moved legacy header.right to root header_right."))}else f(e,"header.right","Dropped legacy header.right because header_right already exists.");delete t.right}Object.keys(t).length===0&&delete s.header}if(_(s.carousel)){let{carousel:t}=s;s.carousel_autoplay===void 0&&typeof t.autoplay=="boolean"&&(s.carousel_autoplay=t.autoplay,f(e,"carousel.autoplay","Moved carousel.autoplay to root carousel_autoplay.")),s.carousel_interval===void 0&&typeof t.interval=="number"&&(s.carousel_interval=t.interval,f(e,"carousel.interval","Moved carousel.interval to root carousel_interval.")),["show_indicators","show_arrows","loop"].forEach(i=>{t[i]!==void 0&&f(e,`carousel.${i}`,`Removed legacy carousel.${i}; this option is no longer configurable.`)}),delete s.carousel}_(s.swipe)&&Object.entries({swipe_left:"left",swipe_right:"right",swipe_up:"up",swipe_down:"down"}).forEach(([i,n])=>{s.swipe[i]!==void 0&&(s.swipe[n]===void 0?(s.swipe[n]=s.swipe[i],f(e,`swipe.${i}`,`Renamed swipe.${i} to swipe.${n}.`)):f(e,`swipe.${i}`,`Removed swipe.${i} because swipe.${n} already exists.`),delete s.swipe[i])}),Array.isArray(s.badges)&&(s.badges=s.badges.map((t,i)=>{if(!_(t)||t.text===void 0)return t;let n={...t};return n.value===void 0?(n.value=n.text,f(e,`badges[${i}].text`,"Moved badges[].text to badges[].value.")):n.label===void 0?(n.label=n.text,f(e,`badges[${i}].text`,"Moved badges[].text to badges[].label because value already exists.")):f(e,`badges[${i}].text`,"Removed badges[].text because value/label already exist."),delete n.text,n}))}function ze(s){return Number.isInteger(s.config_version)&&s.config_version>0?s.config_version:K}function Ie(s){let e=Number.isInteger(s.config_version)&&s.config_version>0,t=ze(s),i=Z(s),n=[];return t<2&&$e(i,n),i.config_version=w,{config:i,fromVersion:t,toVersion:w,changed:e&&t!==w||n.length>0,explicitVersion:e,changes:n}}var r=class extends Error{constructor(e,t){super(t?`${t}: ${e}`:e),this.name="ConfigValidationError",this.path=t}},R=class{static getCurrentConfigVersion(){return w}static migrate(e){if(!_(e))throw new r("Configuration must be an object");if(e.config_version!==void 0){if(!Number.isInteger(e.config_version)||e.config_version<1)throw new r("config_version must be a positive integer","config_version");if(e.config_version>w)throw new r(`config_version ${e.config_version} is newer than this runtime. Current supported version is ${w}.`,"config_version")}return Ie(e)}static validate(e){this._validateCurrentConfig(e)}static _validateCurrentConfig(e){if(!_(e))throw new r("Configuration must be an object");if(e.config_version!==void 0){if(!Number.isInteger(e.config_version)||e.config_version<1)throw new r("config_version must be a positive integer","config_version");if(e.config_version<w)throw new r(`config_version ${e.config_version} is outdated. Migrate to version ${w} before strict validation.`,"config_version");if(e.config_version>w)throw new r(`config_version ${e.config_version} is newer than this runtime. Current supported version is ${w}.`,"config_version")}if(e.body_mode&&!z.includes(e.body_mode))throw new r(`Invalid body_mode: "${e.body_mode}". Valid modes: ${z.join(", ")}`,"body_mode");let t=Object.values(V);if(e.theme&&!t.includes(e.theme))throw new r(`Invalid theme: "${e.theme}". Valid themes: ${t.join(", ")}`,"theme");if(e.entity&&!C(e.entity))throw new r(`Invalid entity format: "${e.entity}"`,"entity");if(e.icon_color!==void 0&&typeof e.icon_color!="string")throw new r("icon_color must be a string","icon_color");if(e.attribute!==void 0&&!x(e.attribute))throw new r("attribute must be a non-empty string","attribute");if(e.cards!==void 0)throw new r("Root-level cards were removed. Use body.cards instead.","cards");if(e.remember_state!==void 0)throw new r("remember_state was removed. Use remember_expanded_state instead.","remember_state");if(e.debug!==void 0)throw new r("debug was removed from the config contract. Use devtools instead.","debug");if(e.state_styles_entity!==void 0)throw new r("state_styles_entity was removed. Use root entity and optional attribute instead.","state_styles_entity");if(_(e.header)&&(e.header.left!==void 0||e.header.right!==void 0))throw new r("Legacy header.left/header.right were removed. Use root header_left/header_right sections.","header");if(e.carousel!==void 0)throw new r("Legacy carousel object was removed. Use root carousel_autoplay and carousel_interval fields.","carousel");if(e.expand_trigger!==void 0&&(typeof e.expand_trigger!="string"||!P.includes(e.expand_trigger)))throw new r(`expand_trigger must be one of: ${P.join(", ")}`,"expand_trigger");if(e.grid&&e.grid.columns!==void 0){let i=e.grid.columns;if(typeof i=="number"){if(i<l.MIN_GRID_COLUMNS||i>l.MAX_GRID_COLUMNS)throw new r("Grid columns must be between "+l.MIN_GRID_COLUMNS+" and "+l.MAX_GRID_COLUMNS,"grid.columns")}else if(typeof i!="string")throw new r("Grid columns must be a number or CSS template string","grid.columns")}if(e.modal!==void 0&&this._validateModal(e.modal,"modal"),e.lazy_initial_batch!==void 0){if(!p(e.lazy_initial_batch))throw new r("lazy_initial_batch must be a number","lazy_initial_batch");if(e.lazy_initial_batch<l.LAZY_MIN_BATCH||e.lazy_initial_batch>l.LAZY_MAX_BATCH)throw new r(`lazy_initial_batch must be between ${l.LAZY_MIN_BATCH} and ${l.LAZY_MAX_BATCH}`,"lazy_initial_batch")}if(e.lazy_batch_size!==void 0){if(!p(e.lazy_batch_size))throw new r("lazy_batch_size must be a number","lazy_batch_size");if(e.lazy_batch_size<l.LAZY_MIN_BATCH||e.lazy_batch_size>l.LAZY_MAX_BATCH)throw new r(`lazy_batch_size must be between ${l.LAZY_MIN_BATCH} and ${l.LAZY_MAX_BATCH}`,"lazy_batch_size")}if(e.lazy_idle_timeout!==void 0){if(!p(e.lazy_idle_timeout))throw new r("lazy_idle_timeout must be a number","lazy_idle_timeout");if(e.lazy_idle_timeout<l.LAZY_MIN_TIMEOUT_MS||e.lazy_idle_timeout>l.LAZY_MAX_TIMEOUT_MS)throw new r(`lazy_idle_timeout must be between ${l.LAZY_MIN_TIMEOUT_MS} and ${l.LAZY_MAX_TIMEOUT_MS}`,"lazy_idle_timeout")}if(e.auto_collapse_after!==void 0){if(!p(e.auto_collapse_after))throw new r("auto_collapse_after must be a number","auto_collapse_after");if(e.auto_collapse_after<0||e.auto_collapse_after>l.AUTO_COLLAPSE_MAX_SECONDS)throw new r(`auto_collapse_after must be between 0 and ${l.AUTO_COLLAPSE_MAX_SECONDS}`,"auto_collapse_after")}if(e.remember_expanded_state!==void 0&&typeof e.remember_expanded_state!="boolean")throw new r("remember_expanded_state must be a boolean","remember_expanded_state");if(e.remember_mode_state!==void 0&&typeof e.remember_mode_state!="boolean")throw new r("remember_mode_state must be a boolean","remember_mode_state");if(e.stability_mode!==void 0&&typeof e.stability_mode!="boolean")throw new r("stability_mode must be a boolean","stability_mode");if(e.carousel_autoplay!==void 0&&typeof e.carousel_autoplay!="boolean")throw new r("carousel_autoplay must be a boolean","carousel_autoplay");if(e.carousel_interval!==void 0){if(!p(e.carousel_interval))throw new r("carousel_interval must be a number","carousel_interval");if(e.carousel_interval<l.CAROUSEL_MIN_INTERVAL_MS||e.carousel_interval>l.CAROUSEL_MAX_INTERVAL_MS)throw new r(`carousel_interval must be between ${l.CAROUSEL_MIN_INTERVAL_MS} and ${l.CAROUSEL_MAX_INTERVAL_MS}`,"carousel_interval")}if(e.animation_duration!==void 0){if(!p(e.animation_duration))throw new r("animation_duration must be a number","animation_duration");if(e.animation_duration<0||e.animation_duration>l.ANIMATION_DURATION_MAX_MS)throw new r(`animation_duration must be between 0 and ${l.ANIMATION_DURATION_MAX_MS}`,"animation_duration")}if(e.expand_animation!==void 0&&(typeof e.expand_animation!="string"||!U.includes(e.expand_animation)))throw new r(`expand_animation must be one of: ${U.join(", ")}`,"expand_animation");if(e.collapse_animation!==void 0&&(typeof e.collapse_animation!="string"||!B.includes(e.collapse_animation)))throw new r(`collapse_animation must be one of: ${B.join(", ")}`,"collapse_animation");if(e.cards_animation!==void 0&&(typeof e.cards_animation!="string"||!j.includes(e.cards_animation)))throw new r(`cards_animation must be one of: ${j.join(", ")}`,"cards_animation");if(e.cards_stagger!==void 0){if(!p(e.cards_stagger))throw new r("cards_stagger must be a number","cards_stagger");if(e.cards_stagger<0||e.cards_stagger>l.CARDS_STAGGER_MAX_MS)throw new r(`cards_stagger must be between 0 and ${l.CARDS_STAGGER_MAX_MS}`,"cards_stagger")}if(e.cards_direction!==void 0&&(typeof e.cards_direction!="string"||!F.includes(e.cards_direction)))throw new r(`cards_direction must be one of: ${F.join(", ")}`,"cards_direction");if(e.enable_card_pool!==void 0&&typeof e.enable_card_pool!="boolean")throw new r("enable_card_pool must be a boolean","enable_card_pool");if(e.pool_scope!==void 0&&(typeof e.pool_scope!="string"||!H.includes(e.pool_scope)))throw new r(`pool_scope must be one of: ${H.join(", ")}`,"pool_scope");if(e.pool_ttl_ms!==void 0){if(!p(e.pool_ttl_ms))throw new r("pool_ttl_ms must be a number","pool_ttl_ms");if(e.pool_ttl_ms<l.POOL_MIN_TTL_MS||e.pool_ttl_ms>l.POOL_MAX_TTL_MS)throw new r(`pool_ttl_ms must be between ${l.POOL_MIN_TTL_MS} and ${l.POOL_MAX_TTL_MS}`,"pool_ttl_ms")}if(e.pool_max_entries!==void 0){if(!p(e.pool_max_entries))throw new r("pool_max_entries must be a number","pool_max_entries");if(e.pool_max_entries<l.POOL_MIN_MAX_ENTRIES||e.pool_max_entries>l.POOL_MAX_MAX_ENTRIES)throw new r(`pool_max_entries must be between ${l.POOL_MIN_MAX_ENTRIES} and ${l.POOL_MAX_MAX_ENTRIES}`,"pool_max_entries")}if(this._validateCardCollection(e.body?.cards,"body.cards",{maxCards:l.MAX_CARDS_PER_BODY}),this._validateCardCollection(e.header?.cards,"header.cards"),this._validateCardCollection(e.footer?.cards,"footer.cards"),this._validateCardCollection(e.header_left?.cards,"header_left.cards"),this._validateCardCollection(e.header_right?.cards,"header_right.cards"),e.tabs&&this._validateTabs(e.tabs),e.visibility&&this._validateConditions(e.visibility,"visibility"),e.section_visibility!==void 0){if(!_(e.section_visibility))throw new r("section_visibility must be an object with header/body/footer arrays","section_visibility");["header","body","footer"].forEach(i=>{let n=e.section_visibility[i];n!==void 0&&this._validateConditions(n,`section_visibility.${i}`)})}if(e.state_styles!==void 0){if(!e.entity)throw new r("state_styles requires root entity. Separate state_styles_entity is no longer supported.","state_styles");this._validateStateStyles(e.state_styles,"state_styles")}if(e.swipe!==void 0&&this._validateSwipeConfig(e.swipe,"swipe"),e.badges!==void 0&&this._validateBadges(e.badges,"badges"),e.theme_tokens!==void 0){if(!_(e.theme_tokens))throw new r("theme_tokens must be an object","theme_tokens");let i=/^--[a-z0-9_-]+$/i;Object.entries(e.theme_tokens).forEach(([n,o])=>{if(!i.test(n))throw new r(`Invalid CSS variable name "${n}"`,`theme_tokens.${n}`);if(typeof o!="string")throw new r("Theme token value must be a string",`theme_tokens.${n}`)})}return e.custom_css!==void 0&&this._validateCustomCSS(e.custom_css,"custom_css"),["tap_action","hold_action","double_tap_action"].forEach(i=>{e[i]&&this._validateAction(e[i],i)}),!0}static _validateCardConfig(e,t){if(!_(e))throw new r("Card config must be an object",t);if(!e.type)throw new r("Card must have a type",t)}static _validateCardCollection(e,t,i={}){if(e!==void 0){if(!Array.isArray(e))throw new r(`${t} must be an array`,t);if(i.maxCards&&e.length>i.maxCards)throw new r(`Maximum ${i.maxCards} cards allowed in ${t}`,t);e.forEach((n,o)=>{this._validateCardConfig(n,`${t}[${o}]`)})}}static _validateTabs(e){if(!Array.isArray(e))throw new r("tabs must be an array","tabs");if(e.length>l.MAX_TABS)throw new r(`Maximum ${l.MAX_TABS} tabs allowed`,"tabs");e.forEach((t,i)=>{if(!_(t))throw new r("Tab config must be an object",`tabs[${i}]`);if(t.cards&&!Array.isArray(t.cards))throw new r("Tab cards must be an array",`tabs[${i}].cards`)})}static _validateConditions(e,t){if(!Array.isArray(e))throw new r("Visibility must be an array",t);e.forEach((i,n)=>{let o=`${t}[${n}]`;if(!_(i))throw new r("Condition must be an object",o);let a=i.condition;if(!a)throw new r('Condition must have a "condition" type',o);if(!pe.includes(a))throw new r(`Invalid condition type: "${a}"`,o);switch(a){case v.STATE:this._validateStateCondition(i,o);break;case v.NUMERIC_STATE:this._validateNumericStateCondition(i,o);break;case v.USER:this._validateUserCondition(i,o);break;case v.TIME:this._validateTimeCondition(i,o);break;case v.SCREEN:this._validateScreenCondition(i,o);break;case v.AND:case v.OR:case v.NOT:this._validateConditionGroup(i,o);break}})}static _validateConditionEntity(e,t){if(!x(e.entity))throw new r("Condition entity must be a non-empty string",`${t}.entity`);if(!C(e.entity))throw new r(`Invalid entity format: "${e.entity}"`,`${t}.entity`);if(e.attribute!==void 0&&!x(e.attribute))throw new r("Condition attribute must be a non-empty string",`${t}.attribute`)}static _validateStateCondition(e,t){if(this._validateConditionEntity(e,t),e.state===void 0&&e.state_not===void 0)throw new r('state condition requires "state" or "state_not"',t);if(e.state!==void 0&&e.state_not!==void 0)throw new r('state condition cannot define both "state" and "state_not"',t);e.state!==void 0&&this._validateStringOrStringArray(e.state,`${t}.state`,"state"),e.state_not!==void 0&&this._validateStringOrStringArray(e.state_not,`${t}.state_not`,"state_not")}static _validateNumericStateCondition(e,t){if(this._validateConditionEntity(e,t),e.above===void 0&&e.below===void 0)throw new r('numeric_state condition requires "above" or "below"',t);if(e.above!==void 0&&!p(e.above))throw new r("numeric_state.above must be a number",`${t}.above`);if(e.below!==void 0&&!p(e.below))throw new r("numeric_state.below must be a number",`${t}.below`);if(p(e.above)&&p(e.below)&&e.above>=e.below)throw new r("numeric_state.above must be lower than numeric_state.below",t)}static _validateUserCondition(e,t){if(e.users===void 0&&e.is_admin===void 0&&e.is_owner===void 0)throw new r("user condition requires users, is_admin, or is_owner",t);if(e.users!==void 0&&this._validateStringArray(e.users,`${t}.users`,"users"),e.is_admin!==void 0&&typeof e.is_admin!="boolean")throw new r("user.is_admin must be a boolean",`${t}.is_admin`);if(e.is_owner!==void 0&&typeof e.is_owner!="boolean")throw new r("user.is_owner must be a boolean",`${t}.is_owner`)}static _validateTimeCondition(e,t){if(e.after===void 0&&e.before===void 0&&e.weekday===void 0)throw new r("time condition requires after, before, or weekday",t);if(e.after!==void 0&&!this._isValidTimeString(e.after))throw new r("time.after must be in HH:MM format",`${t}.after`);if(e.before!==void 0&&!this._isValidTimeString(e.before))throw new r("time.before must be in HH:MM format",`${t}.before`);if(e.weekday!==void 0){if(!Array.isArray(e.weekday))throw new r("time.weekday must be an array",`${t}.weekday`);e.weekday.forEach((i,n)=>{if(typeof i!="string"||!G.includes(i))throw new r(`Invalid weekday: "${String(i)}"`,`${t}.weekday[${n}]`)})}}static _validateScreenCondition(e,t){if(e.media_query===void 0&&e.min_width===void 0&&e.max_width===void 0)throw new r("screen condition requires media_query, min_width, or max_width",t);if(e.media_query!==void 0&&!x(e.media_query))throw new r("screen.media_query must be a non-empty string",`${t}.media_query`);if(e.min_width!==void 0&&!p(e.min_width))throw new r("screen.min_width must be a number",`${t}.min_width`);if(e.max_width!==void 0&&!p(e.max_width))throw new r("screen.max_width must be a number",`${t}.max_width`);if(p(e.min_width)&&p(e.max_width)&&e.min_width>e.max_width)throw new r("screen.min_width must be lower than or equal to screen.max_width",t)}static _validateConditionGroup(e,t){if(!Array.isArray(e.conditions)||e.conditions.length===0)throw new r('Logical conditions require a non-empty "conditions" array',`${t}.conditions`);this._validateConditions(e.conditions,`${t}.conditions`)}static _validateStringOrStringArray(e,t,i){if(typeof e=="string"){if(!e.trim())throw new r(`${i} must not be empty`,t);return}if(!Array.isArray(e)||e.length===0)throw new r(`${i} must be a string or non-empty array of strings`,t);e.forEach((n,o)=>{if(typeof n!="string"||!n.trim())throw new r(`${i} items must be non-empty strings`,`${t}[${o}]`)})}static _validateStringArray(e,t,i){if(!Array.isArray(e)||e.length===0)throw new r(`${i} must be a non-empty array of strings`,t);e.forEach((n,o)=>{if(typeof n!="string"||!n.trim())throw new r(`${i} items must be non-empty strings`,`${t}[${o}]`)})}static _validateStateStyles(e,t){if(!_(e))throw new r("state_styles must be an object map",t);Object.entries(e).forEach(([i,n],o)=>{let a=`${t}.${i||o}`;if(!i||!i.trim())throw new r("state_styles keys must be non-empty strings",a);if(!_(n))throw new r("state_styles entries must be objects",a);Object.entries(n).forEach(([u,c])=>{if(u==="class"){if(typeof c!="string"&&(!Array.isArray(c)||c.some(m=>typeof m!="string"||!m.trim())))throw new r("state_styles.class must be a string or array of strings",`${a}.class`);return}if(typeof c!="string"&&!p(c))throw new r(`state_styles.${u} must be a string or number`,`${a}.${u}`)})})}static _validateSwipeConfig(e,t){if(!_(e))throw new r("swipe must be an object",t);if(e.swipe_left!==void 0||e.swipe_right!==void 0||e.swipe_up!==void 0||e.swipe_down!==void 0)throw new r("Legacy swipe.swipe_left/swipe_right/swipe_up/swipe_down keys were removed. Use swipe.left/right/up/down.",t);if(e.enabled!==void 0&&typeof e.enabled!="boolean")throw new r("swipe.enabled must be a boolean",`${t}.enabled`);if(e.direction!==void 0&&(typeof e.direction!="string"||!X.includes(e.direction)))throw new r(`swipe.direction must be one of: ${X.join(", ")}`,`${t}.direction`);if(e.threshold!==void 0){if(!p(e.threshold))throw new r("swipe.threshold must be a number",`${t}.threshold`);if(e.threshold<0||e.threshold>l.SWIPE_MAX_THRESHOLD_PX)throw new r(`swipe.threshold must be between 0 and ${l.SWIPE_MAX_THRESHOLD_PX}`,`${t}.threshold`)}if(e.velocityThreshold!==void 0){if(!p(e.velocityThreshold))throw new r("swipe.velocityThreshold must be a number",`${t}.velocityThreshold`);if(e.velocityThreshold<0||e.velocityThreshold>l.SWIPE_MAX_VELOCITY_THRESHOLD)throw new r(`swipe.velocityThreshold must be between 0 and ${l.SWIPE_MAX_VELOCITY_THRESHOLD}`,`${t}.velocityThreshold`)}if(e.preventScroll!==void 0&&typeof e.preventScroll!="boolean")throw new r("swipe.preventScroll must be a boolean",`${t}.preventScroll`);["left","right","up","down"].forEach(i=>{e[i]!==void 0&&this._validateSwipeActionConfig(e[i],`${t}.${i}`)})}static _validateSwipeActionConfig(e,t){if(!_(e))throw new r("Swipe action must be an object",t);if(e.action===void 0)throw new r('Swipe action requires an "action" field',`${t}.action`);if(typeof e.action!="string"||!Y.includes(e.action))throw new r(`Swipe action must be one of: ${Y.join(", ")}`,`${t}.action`)}static _validateBadges(e,t){if(!Array.isArray(e))throw new r("badges must be an array",t);e.forEach((i,n)=>{let o=`${t}[${n}]`;if(!_(i))throw new r("Badge must be an object",o);if(i.text!==void 0)throw new r("badges[].text was removed. Use badges[].value or badges[].label instead.",`${o}.text`);let a=i.type||T.STATE;if(typeof a!="string"||!q.includes(a))throw new r(`Badge type must be one of: ${q.join(", ")}`,`${o}.type`);let u=typeof i.entity=="string"?i.entity.trim():i.entity;if(u!==void 0&&!C(u))throw new r(`Invalid entity format: "${i.entity}"`,`${o}.entity`);if(i.attribute!==void 0&&!x(i.attribute))throw new r("Badge attribute must be a non-empty string",`${o}.attribute`);if(["icon","color","label","unit","domain"].forEach(c=>{if(i[c]!==void 0&&typeof i[c]!="string")throw new r(`Badge ${c} must be a string`,`${o}.${c}`)}),i.value!==void 0&&typeof i.value!="string"&&!p(i.value))throw new r("Badge value must be a string or number",`${o}.value`);if(["min","max"].forEach(c=>{if(i[c]!==void 0&&!p(i[c]))throw new r(`Badge ${c} must be a number`,`${o}.${c}`)}),p(i.min)&&p(i.max)&&i.min>=i.max)throw new r("Badge min must be lower than max",o);if(["show_name","show_progress"].forEach(c=>{if(i[c]!==void 0&&typeof i[c]!="boolean")throw new r(`Badge ${c} must be a boolean`,`${o}.${c}`)}),i.icon_only!==void 0&&typeof i.icon_only!="boolean")throw new r("Badge icon_only must be a boolean",`${o}.icon_only`);if(i.precision!==void 0){if(!Number.isInteger(i.precision))throw new r("Badge precision must be an integer",`${o}.precision`);if(i.precision<0||i.precision>l.BADGE_MAX_PRECISION)throw new r(`Badge precision must be between 0 and ${l.BADGE_MAX_PRECISION}`,`${o}.precision`)}if(i.format!==void 0&&(typeof i.format!="string"||!W.includes(i.format)))throw new r(`Badge format must be one of: ${W.join(", ")}`,`${o}.format`);if(i.entities!==void 0){if(!Array.isArray(i.entities)||i.entities.length===0)throw new r("Badge entities must be a non-empty array",`${o}.entities`);let c=i.entities.map(m=>typeof m=="string"?m.trim():m).filter(m=>m!=="");if(c.length===0)throw new r("Badge entities must contain at least one valid entity ID",`${o}.entities`);c.forEach((m,A)=>{if(!C(m))throw new r(`Invalid entity format: "${m}"`,`${o}.entities[${A}]`)})}if(i.state!==void 0&&typeof i.state!="string")throw new r("Badge state must be a string",`${o}.state`);if(i.count_state!==void 0&&typeof i.count_state!="string")throw new r("Badge count_state must be a string",`${o}.count_state`);switch(i.thresholds!==void 0&&this._validateBadgeThresholds(i.thresholds,`${o}.thresholds`),i.visibility!==void 0&&this._validateBadgeRules(i.visibility,`${o}.visibility`),i.color_rules!==void 0&&this._validateBadgeColorRules(i.color_rules,`${o}.color_rules`),i.tap_action!==void 0&&this._validateAction(i.tap_action,`${o}.tap_action`),i.icon_tap_action!==void 0&&this._validateAction(i.icon_tap_action,`${o}.icon_tap_action`),a){case T.STATE:if(!i.entity&&i.value===void 0)throw new r("State badges require entity or static value",o);break;case T.ATTRIBUTE:if(!i.entity)throw new r("Attribute badges require entity",`${o}.entity`);if(!i.attribute)throw new r("Attribute badges require attribute",`${o}.attribute`);break;case T.COUNTER:if(!i.domain&&!i.entities)throw new r("Counter badges require domain or entities",o);break;case T.CUSTOM:if(i.value===void 0)throw new r("Custom badges require value",`${o}.value`);break}})}static _validateModal(e,t){if(!_(e))throw new r("modal must be an object",t);if(["width","height","max_width","max_height","backdrop_color"].forEach(i=>{if(e[i]!==void 0&&!x(e[i]))throw new r(`modal.${i} must be a non-empty string`,`${t}.${i}`)}),["backdrop_blur","close_on_backdrop","close_on_escape","show_close"].forEach(i=>{if(e[i]!==void 0&&typeof e[i]!="boolean")throw new r(`modal.${i} must be a boolean`,`${t}.${i}`)}),e.loading_strategy!==void 0&&(typeof e.loading_strategy!="string"||!k.includes(e.loading_strategy)))throw new r(`modal.loading_strategy must be one of: ${k.join(", ")}`,`${t}.loading_strategy`)}static _validateBadgeThresholds(e,t){if(!Array.isArray(e))throw new r("Badge thresholds must be an array",t);e.forEach((i,n)=>{let o=`${t}[${n}]`;if(!_(i))throw new r("Badge threshold must be an object",o);if(!p(i.value))throw new r("Badge threshold value must be a number",`${o}.value`);if(!x(i.color))throw new r("Badge threshold color must be a non-empty string",`${o}.color`)})}static _validateBadgeRules(e,t){if(!Array.isArray(e))throw new r("Badge rules must be an array",t);e.forEach((i,n)=>{let o=`${t}[${n}]`;if(!_(i))throw new r("Badge rule must be an object",o);if(typeof i.operator!="string"||!O.includes(i.operator))throw new r(`Badge rule operator must be one of: ${O.join(", ")}`,`${o}.operator`);let a=typeof i.value;if(i.value===void 0||!["string","number","boolean"].includes(a))throw new r("Badge rule value must be a string, number, or boolean",`${o}.value`);if(i.entity!==void 0){let u=typeof i.entity=="string"?i.entity.trim():i.entity;if(!C(u))throw new r(`Invalid entity format: "${i.entity}"`,`${o}.entity`)}if(i.attribute!==void 0&&!x(i.attribute))throw new r("Badge rule attribute must be a non-empty string",`${o}.attribute`)})}static _validateBadgeColorRules(e,t){this._validateBadgeRules(e,t),e.forEach((i,n)=>{if(!x(i.color))throw new r("Badge color rule color must be a non-empty string",`${t}[${n}].color`)})}static _isValidTimeString(e){if(typeof e!="string")return!1;let t=e.match(/^(\d{2}):(\d{2})$/);if(!t)return!1;let i=Number(t[1]),n=Number(t[2]);return i>=0&&i<=23&&n>=0&&n<=59}static _validateAction(e,t){if(!_(e))throw new r("Action must be an object",t);let i=Object.values(L);if(e.action&&!i.includes(e.action))throw new r(`Invalid action: "${e.action}"`,t);if(e.action===L.CALL_SERVICE&&!e.service)throw new r('call-service action requires a "service" property',t);if(e.action===L.NAVIGATE&&!e.navigation_path)throw new r('navigate action requires a "navigation_path" property',t);if(e.action===L.URL&&!e.url_path)throw new r('url action requires a "url_path" property',t)}static normalize(e){e=this.migrate(e).config,this._validateCurrentConfig(e);let t={...d,...e};if(t.config_version=w,t.card_id||(t.card_id=xe("uc")),t.header=this._normalizeSection(e.header,"header"),e.header_left&&(t.header_left=this._normalizeSection(e.header_left,"header_left")),e.header_right&&(t.header_right=this._normalizeSection(e.header_right,"header_right")),e.body?t.body=this._normalizeSection(e.body,"body"):t.body={cards:[]},e.footer&&(t.footer=this._normalizeSection(e.footer,"footer")),e.tabs&&(t.tabs=e.tabs.map((i,n)=>({label:i.label||`Tab ${n+1}`,icon:i.icon||null,cards:i.cards||[],...i}))),t.grid=this._normalizeGrid(e.grid),t.modal=this._normalizeModal(e.modal),t.tap_action=this._normalizeAction(e.tap_action,"none"),t.hold_action=this._normalizeAction(e.hold_action,"none"),t.double_tap_action=this._normalizeAction(e.double_tap_action,"none"),e.visibility&&(t.visibility=e.visibility.map(i=>this._normalizeCondition(i))),t.section_visibility=this._normalizeSectionVisibility(e.section_visibility),e.attribute!==void 0){let i=e.attribute.trim();i?t.attribute=i:delete t.attribute}if(typeof e.icon_color=="string"){let i=e.icon_color.trim();i?t.icon_color=i:delete t.icon_color}return t.state_styles=this._normalizeStateStyles(e.state_styles),t.swipe=this._normalizeSwipe(e.swipe),t.badges=this._normalizeBadges(e.badges),t.theme_tokens=this._normalizeThemeTokens(e.theme_tokens),t.stability_mode&&(t.animation=!1,t.expand_animation="none",t.collapse_animation="none",t.cards_animation="none",t.cards_stagger=0,t.animation_duration=0,t.enable_card_pool=!1,t.carousel_autoplay=!1),t}static _normalizeSection(e,t){return e?{cards:e.cards||[],...e}:{cards:[]}}static _normalizeGrid(e){return e?{columns:e.columns||d.grid_columns,gap:e.gap||d.grid_gap,responsive:e.responsive||null}:{columns:d.grid_columns,gap:d.grid_gap}}static _normalizeModal(e){let t=_(e)?e:{},i=(n,o)=>typeof n!="string"?o:n.trim()||o;return{width:i(t.width,d.modal_width),height:i(t.height,d.modal_height),max_width:i(t.max_width,d.modal_max_width),max_height:i(t.max_height,d.modal_max_height),loading_strategy:typeof t.loading_strategy=="string"&&k.includes(t.loading_strategy)?t.loading_strategy:d.modal_loading_strategy,backdrop_blur:t.backdrop_blur!==!1,backdrop_color:i(t.backdrop_color,d.backdrop_color),close_on_backdrop:t.close_on_backdrop!==!1,close_on_escape:t.close_on_escape!==!1,show_close:t.show_close!==!1}}static _normalizeAction(e,t="none"){return e?{action:e.action||t,...e}:{action:t}}static _normalizeCondition(e){let t={condition:e.condition,...e};return typeof t.entity=="string"&&(t.entity=t.entity.trim()),typeof t.attribute=="string"&&(t.attribute=t.attribute.trim()),e.condition===v.STATE&&(e.state!==void 0&&(t.state=this._normalizeStringListValue(e.state)),e.state_not!==void 0&&(t.state_not=this._normalizeStringListValue(e.state_not))),e.condition===v.USER&&Array.isArray(e.users)&&(t.users=e.users.map(i=>typeof i=="string"?i.trim():"").filter(Boolean)),e.condition===v.TIME&&Array.isArray(e.weekday)&&(t.weekday=e.weekday.map(i=>typeof i=="string"?i.trim():"").filter(i=>G.includes(i))),[v.AND,v.OR,v.NOT].includes(e.condition)&&Array.isArray(e.conditions)&&(t.conditions=e.conditions.map(i=>this._normalizeCondition(i))),t}static _normalizeSectionVisibility(e){let t=_(e)?e:{},i=n=>Array.isArray(n)?n.map(o=>this._normalizeCondition(o)):[];return{header:i(t.header),body:i(t.body),footer:i(t.footer)}}static _normalizeThemeTokens(e){if(!_(e))return{};let t={},i=/^--[a-z0-9_-]+$/i;return Object.entries(e).forEach(([n,o])=>{if(!i.test(n)||typeof o!="string")return;let a=o.trim();a&&(t[n]=a)}),t}static _normalizeStateStyles(e){if(!_(e))return{};let t={};return Object.entries(e).forEach(([i,n])=>{let o=typeof i=="string"?i.trim():"";if(!o||!_(n))return;let a={};Object.entries(n).forEach(([u,c])=>{if(u==="class"){if(Array.isArray(c)){let m=c.map(A=>typeof A=="string"?A.trim():"").filter(Boolean);m.length>0&&(a.class=m);return}typeof c=="string"&&c.trim()&&(a.class=c.trim());return}if(typeof c=="string"){let m=c.trim();m&&(a[u]=m);return}p(c)&&(a[u]=c)}),Object.keys(a).length>0&&(t[o]=a)}),t}static _normalizeSwipe(e){if(!_(e))return{enabled:d.swipe_enabled,direction:d.swipe_direction,threshold:d.swipe_threshold,velocityThreshold:d.swipe_velocity_threshold,preventScroll:d.swipe_prevent_scroll};let t={enabled:e.enabled??d.swipe_enabled,direction:e.direction||d.swipe_direction,threshold:e.threshold??d.swipe_threshold,velocityThreshold:e.velocityThreshold??d.swipe_velocity_threshold,preventScroll:e.preventScroll??d.swipe_prevent_scroll};return["left","right","up","down"].forEach(i=>{!_(e[i])||!e[i].action||e[i].action==="none"||(t[i]={action:e[i].action})}),t}static _normalizeBadges(e){return Array.isArray(e)?e.filter(t=>_(t)).map(t=>{let i={...t,type:t.type||T.STATE};if(["entity","attribute","icon","color","label","unit","domain","state","count_state"].forEach(n=>{if(typeof i[n]=="string"){let o=i[n].trim();o?i[n]=o:delete i[n]}}),typeof i.value=="string"){let n=i.value.trim();n?i.value=n:delete i.value}return Array.isArray(i.entities)&&(i.entities=[...new Set(i.entities.map(n=>typeof n=="string"?n.trim():"").filter(Boolean))],i.entities.length===0&&delete i.entities),Array.isArray(i.thresholds)&&(i.thresholds=i.thresholds.filter(n=>_(n)&&p(n.value)&&typeof n.color=="string"&&n.color.trim()).map(n=>({value:n.value,color:n.color.trim()})),i.thresholds.length===0&&delete i.thresholds),Array.isArray(i.visibility)&&(i.visibility=i.visibility.filter(n=>_(n)&&O.includes(n.operator)).map(n=>this._normalizeBadgeRule(n)).filter(Boolean),i.visibility.length===0&&delete i.visibility),Array.isArray(i.color_rules)&&(i.color_rules=i.color_rules.filter(n=>_(n)&&O.includes(n.operator)).map(n=>this._normalizeBadgeColorRule(n)).filter(Boolean),i.color_rules.length===0&&delete i.color_rules),i}):[]}static _normalizeBadgeRule(e){if(!_(e))return null;let t={operator:e.operator||N.EQUALS,value:e.value};if(typeof e.entity=="string"){let i=e.entity.trim();i&&(t.entity=i)}if(typeof e.attribute=="string"){let i=e.attribute.trim();i&&(t.attribute=i)}if(typeof t.value=="string"){let i=t.value.trim();if(!i)return null;t.value=i}return t}static _normalizeBadgeColorRule(e){let t=this._normalizeBadgeRule(e);return!t||typeof e.color!="string"||!e.color.trim()?null:{...t,color:e.color.trim()}}static _normalizeStringListValue(e){if(typeof e=="string")return e.trim()||void 0;if(!Array.isArray(e))return;let t=e.map(i=>typeof i=="string"?i.trim():"").filter(Boolean);if(t.length!==0)return t.length===1?t[0]:t}static getTitle(e,t){return e.title?e.title:e.entity&&t?.states?.[e.entity]?t.states[e.entity].attributes.friendly_name||e.entity:""}static getSubtitle(e,t){return e.subtitle?e.subtitle:e.entity&&t?.states?.[e.entity]?t.states[e.entity].state:""}static hasChanged(e,t){return JSON.stringify(e)!==JSON.stringify(t)}static getSchema(){let e={type:"object",properties:{action:{type:"string",enum:Object.values(L),default:L.NONE},service:{type:"string"},navigation_path:{type:"string"},url_path:{type:"string"}}},t={type:"object",properties:{action:{type:"string",enum:Y,default:"none"}}},n={type:"array",items:{type:"object",properties:{type:{type:"string"}}}},o={type:"object",properties:{cards:n}},a={type:"object",properties:{condition:{type:"string",enum:pe},entity:{type:"string",description:"Entity referenced by state-based visibility conditions."},attribute:{type:"string",description:"Optional entity attribute used instead of the primary state."},state:{type:["string","array"],description:"Allowed state or list of allowed states.",items:{type:"string"}},state_not:{type:["string","array"],description:"Blocked state or list of blocked states.",items:{type:"string"}},above:{type:"number",description:"Numeric lower bound (exclusive)."},below:{type:"number",description:"Numeric upper bound (exclusive)."},users:{type:"array",description:"Allowed user names or ids.",items:{type:"string"}},is_admin:{type:"boolean",description:"Require current user to be an admin."},is_owner:{type:"boolean",description:"Require current user to be the owner."},after:{type:"string",description:"Show only after the given HH:MM time."},before:{type:"string",description:"Show only before the given HH:MM time."},weekday:{type:"array",description:"Allowed weekdays.",items:{type:"string",enum:G}},media_query:{type:"string",description:"CSS media query matched against the current viewport."},min_width:{type:"number",description:"Minimum viewport width in pixels."},max_width:{type:"number",description:"Maximum viewport width in pixels."}}};a.properties.conditions={type:"array",description:"Nested logical conditions for and/or/not groups.",items:a};let u={type:"object",properties:{background:{type:["string","number"]},color:{type:["string","number"]},border:{type:["string","number"]},class:{type:["string","array"],items:{type:"string"}}}},c={type:"object",properties:{value:{type:"number"},color:{type:"string"}}},m={type:"object",properties:{type:{type:"string",enum:q,default:T.STATE},entity:{type:"string"},attribute:{type:"string"},icon:{type:"string"},color:{type:"string"},value:{type:["string","number"]},label:{type:"string"},unit:{type:"string"},min:{type:"number"},max:{type:"number"},icon_only:{type:"boolean",default:!1},show_name:{type:"boolean",default:!1},show_progress:{type:"boolean",default:!1},precision:{type:"number",minimum:0,maximum:l.BADGE_MAX_PRECISION},format:{type:"string",enum:W,default:he.NONE},entities:{type:"array",items:{type:"string"}},domain:{type:"string"},state:{type:"string"},count_state:{type:"string"},thresholds:{type:"array",items:c},visibility:{type:"array",items:{type:"object",properties:{operator:{type:"string",enum:O,default:N.EQUALS},value:{type:["string","number","boolean"]},entity:{type:"string"},attribute:{type:"string"}}}},color_rules:{type:"array",items:{type:"object",properties:{operator:{type:"string",enum:O,default:N.EQUALS},value:{type:["string","number","boolean"]},entity:{type:"string"},attribute:{type:"string"},color:{type:"string"}}}},tap_action:e,icon_tap_action:e}},A={type:"object",properties:{enabled:{type:"boolean",default:d.swipe_enabled},direction:{type:"string",enum:X,default:d.swipe_direction},threshold:{type:"number",minimum:0,maximum:l.SWIPE_MAX_THRESHOLD_PX,default:d.swipe_threshold},velocityThreshold:{type:"number",minimum:0,maximum:l.SWIPE_MAX_VELOCITY_THRESHOLD,default:d.swipe_velocity_threshold},preventScroll:{type:"boolean",default:d.swipe_prevent_scroll},left:t,right:t,up:t,down:t}};return{type:"object",properties:{config_version:{type:"number",minimum:K,maximum:w,default:w,description:"Config contract version. Legacy configs are migrated to the current version during normalize()."},card_id:{type:"string",description:"Stable identifier for cross-card control and persisted mode state."},title:{type:"string",description:"Primary card title."},subtitle:{type:"string",description:"Optional secondary title shown in the header."},icon:{type:"string",description:"Header icon in mdi format."},icon_color:{type:"string",description:"Optional CSS color value for the primary header icon."},entity:{type:"string",description:"Primary Home Assistant entity bound to the card."},attribute:{type:"string",description:"Optional root attribute used by state_styles and other state-aware features."},body_mode:{type:"string",enum:z,default:M.EXPAND,description:"Presentation mode used for the body region."},expand_trigger:{type:"string",enum:P,default:d.expand_trigger,description:"Header gesture that toggles body expansion by default."},theme:{type:"string",enum:Object.values(V),default:d.theme,description:"Theme preset applied to the card shell."},padding:{type:"string",default:d.padding,description:"Internal card padding."},border_radius:{type:"string",default:d.border_radius,description:"Border radius applied to the card shell."},expanded:{type:"boolean",default:!1,description:"Whether the card starts expanded."},animation:{type:"boolean",default:!0,description:"Master switch for card animations."},animation_duration:{type:"number",minimum:0,maximum:l.ANIMATION_DURATION_MAX_MS,default:d.animation_duration,description:"Base animation duration applied to body and nested cards."},expand_animation:{type:"string",enum:U,default:d.expand_animation,description:"Body expand animation variant."},collapse_animation:{type:"string",enum:B,default:d.collapse_animation,description:"Body collapse animation variant."},cards_animation:{type:"string",enum:j,default:d.cards_animation,description:"Nested card reveal animation variant."},cards_stagger:{type:"number",minimum:0,maximum:l.CARDS_STAGGER_MAX_MS,default:d.cards_stagger,description:"Delay between nested card reveal steps in milliseconds."},cards_direction:{type:"string",enum:F,default:d.cards_direction,description:"Ordering strategy for nested card reveal."},stability_mode:{type:"boolean",default:!1,description:"Disables high-risk effects for predictable rendering."},lazy_load:{type:"boolean",default:!0,description:"Enables progressive body card loading."},lazy_initial_batch:{type:"number",minimum:l.LAZY_MIN_BATCH,maximum:l.LAZY_MAX_BATCH,default:d.lazy_initial_batch,description:"Initial number of cards to load before idle batching."},lazy_batch_size:{type:"number",minimum:l.LAZY_MIN_BATCH,maximum:l.LAZY_MAX_BATCH,default:d.lazy_batch_size,description:"Number of cards added on each idle lazy-load pass."},lazy_idle_timeout:{type:"number",minimum:l.LAZY_MIN_TIMEOUT_MS,maximum:l.LAZY_MAX_TIMEOUT_MS,default:d.lazy_idle_timeout,description:"Idle callback timeout used for deferred body work."},auto_collapse_after:{type:"number",minimum:0,maximum:l.AUTO_COLLAPSE_MAX_SECONDS,default:d.auto_collapse_after,description:"Automatically collapse the card after N seconds. Set 0 to disable."},remember_expanded_state:{type:"boolean",default:d.remember_expanded_state,description:"Persist expanded/collapsed state across renders."},remember_mode_state:{type:"boolean",default:d.remember_mode_state,description:"Persist active tab and slide indices across renders."},enable_card_pool:{type:"boolean",default:d.enable_card_pool,description:"Reuse detached body card elements to reduce churn."},pool_scope:{type:"string",enum:H,default:d.pool_scope,description:"Reuse scope for pooled body card elements."},pool_ttl_ms:{type:"number",minimum:l.POOL_MIN_TTL_MS,maximum:l.POOL_MAX_TTL_MS,default:d.pool_ttl_ms,description:"Time-to-live for pooled body card instances."},pool_max_entries:{type:"number",minimum:l.POOL_MIN_MAX_ENTRIES,maximum:l.POOL_MAX_MAX_ENTRIES,default:d.pool_max_entries,description:"Maximum pooled entries retained for a reuse scope."},show_expand_icon:{type:"boolean",default:d.show_expand_icon,description:"Show the expand/collapse affordance in the header."},expand_icon:{type:"string",default:d.expand_icon,description:"Icon used for the expand affordance."},sticky_header:{type:"boolean",default:!1,description:"Keep the header pinned while the body scrolls."},grid:{type:"object",properties:{columns:{type:["number","string"],minimum:l.MIN_GRID_COLUMNS,maximum:l.MAX_GRID_COLUMNS,default:d.grid_columns,description:"Column count or CSS grid-template-columns string."},gap:{type:"string",default:d.grid_gap,description:"Gap between grid items."}}},modal:{type:"object",description:"Modal body mode sizing and overlay behavior.",properties:{width:{type:"string",default:d.modal_width,description:"Modal width. Use CSS lengths or auto."},height:{type:"string",default:d.modal_height,description:"Modal height. Use CSS lengths or auto."},max_width:{type:"string",default:d.modal_max_width,description:"Maximum width cap applied to the modal dialog."},max_height:{type:"string",default:d.modal_max_height,description:"Maximum height cap applied to the modal dialog."},loading_strategy:{type:"string",enum:k,default:d.modal_loading_strategy,description:"Modal content loading strategy."},backdrop_blur:{type:"boolean",default:!0},backdrop_color:{type:"string",default:d.backdrop_color},close_on_backdrop:{type:"boolean",default:!0},close_on_escape:{type:"boolean",default:!0},show_close:{type:"boolean",default:!0}}},header:{...o,description:"Header region configuration."},header_left:{...o,description:"Cards rendered in the left header slot."},header_right:{...o,description:"Cards rendered in the right header slot."},body:{...o,description:"Body region configuration."},footer:{...o,description:"Footer region configuration."},tabs:{type:"array",description:"Tab definitions used by tabs body mode.",items:{type:"object",properties:{label:{type:"string"},icon:{type:"string"},cards:n}}},carousel_autoplay:{type:"boolean",default:d.carousel_autoplay,description:"Automatically advance slides in carousel mode."},carousel_interval:{type:"number",minimum:l.CAROUSEL_MIN_INTERVAL_MS,maximum:l.CAROUSEL_MAX_INTERVAL_MS,default:d.carousel_interval,description:"Delay between autoplay slide changes in carousel mode."},tap_action:{...e,description:"Action executed on tap."},hold_action:{...e,description:"Action executed on hold."},double_tap_action:{...e,description:"Action executed on double tap."},visibility:{type:"array",description:"Top-level card visibility conditions.",items:a},section_visibility:{type:"object",description:"Per-section visibility conditions for header/body/footer.",properties:{header:{type:"array",items:a},body:{type:"array",items:a},footer:{type:"array",items:a}}},swipe:{...A,description:"Gesture handling for top-level card swipes."},badges:{type:"array",description:"Header badge definitions.",items:m},state_styles:{type:"object",description:"Map of states or numeric matchers to style overrides applied to the card shell.",additionalProperties:u},theme_tokens:{type:"object",description:"CSS variable overrides applied after theme resolution.",additionalProperties:{type:"string"}},custom_css:{type:["string","object","array"],description:"Scoped custom CSS definitions."}}}}static _validateCustomCSS(e,t){if(typeof e=="string")return;if(Array.isArray(e)){e.forEach((o,a)=>{this._validateCustomCSS(o,`${t}[${a}]`)});return}if(!_(e))throw new r("custom_css must be a string, object, or array",t);if(["css","scope","mode","priority","id"].some(o=>o in e)){if(e.css!==void 0&&typeof e.css!="string")throw new r("custom_css.css must be a string",`${t}.css`);if(e.scope!==void 0&&typeof e.scope!="string")throw new r("custom_css.scope must be a string",`${t}.scope`);return}Object.entries(e).forEach(([o,a])=>{if(typeof a!="string")throw new r("custom_css scoped values must be strings",`${t}.${o}`)})}};var h=Object.freeze({STRING:"string",NUMBER:"number",BOOLEAN:"boolean",ENTITY:"entity",ICON:"icon",COLOR:"color",SELECT:"select",OBJECT:"object",ARRAY:"array",TEMPLATE:"template",ACTION:"action"});function Pe(s){let e=[...new Set(s)];return e.length===1?e[0]:e}function He(s,e){if(s==="entity")return h.ENTITY;if(s==="icon"||s.endsWith("_icon"))return h.ICON;if(s.includes("color"))return h.COLOR;switch(e){case"number":case"integer":return h.NUMBER;case"boolean":return h.BOOLEAN;case"array":return h.ARRAY;case"object":return s.endsWith("_action")?h.ACTION:h.OBJECT;case"string":default:return h.STRING}}function J(s,e,t=new WeakMap){let i=t.get(e);if(i)return i;let n=Array.isArray(e.type)?e.type:[e.type||"string"],a={type:e.enum?h.SELECT:Pe(n.map(u=>He(s,u))),description:e.description,default:e.default};if(t.set(e,a),e.enum&&(a.options=[...e.enum]),typeof e.minimum=="number"&&(a.min=e.minimum),typeof e.maximum=="number"&&(a.max=e.maximum),e.properties){let u=new Set(e.required||[]);a.properties=Object.fromEntries(Object.entries(e.properties).map(([c,m])=>{let A=J(c,m,t);return A.required=u.has(c),[c,A]}))}return e.items&&(a.items=J(`${s}_item`,e.items,t)),e.additionalProperties&&(a.additionalProperties=e.additionalProperties===!0?!0:J(`${s}_value`,e.additionalProperties,t)),a}function Ve(){let s=R.getSchema(),e=s.properties||{},t=new Set(s.required||[]);return Object.fromEntries(Object.entries(e).map(([i,n])=>{let o=J(i,n);return o.required=t.has(i),[i,o]}))}function Ue(s){return s.replace(/\[\d+\]/g,"").split(".").map(e=>e.trim()).filter(Boolean)}function me(s,e){let t=Ue(e);if(t.length===0)return null;let i=s,n=null;for(let o of t){if(!i||!i[o])return null;if(n=i[o],n.properties){i=n.properties;continue}if(n.items?.properties){i=n.items.properties;continue}i=null}return n}function Le(s,e){if(!e.trim())return s;let t=me(s,e);return t?t.properties?t.properties:t.items?.properties?t.items.properties:null:null}function Oe(s){return Array.isArray(s)?s.join(" | "):s}var Re=Ve();var g=Object.freeze({ERROR:"error",WARNING:"warning",INFO:"info"});function fe(s){return!!s&&typeof s=="object"&&!Array.isArray(s)}var Q=class{constructor(){this._schema=Re,this._customRules=[]}addRule(e){this._customRules.push(e)}validate(e){let t={valid:!0,errors:[],warnings:[],suggestions:[]};if(!fe(e))return t.valid=!1,t.errors.push({path:"",message:"\u041A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044F \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u043C",level:g.ERROR}),t;let i=e;try{let n=R.migrate(e);i=n.config,this._addMigrationIssues(n,t)}catch(n){let o=this._toRuntimeIssue(n);return o&&(t.errors.push(o),t.valid=!1),this._dedupeIssues(t)}return this._validateSchemaObject(i,this._schema,"",t),this._applyRuntimeValidation(i,t),this._applyCustomRules(i,t),this._addSuggestions(i,t),this._dedupeIssues(t)}_validateSchemaObject(e,t,i,n){for(let[o,a]of Object.entries(t)){let u=i?`${i}.${o}`:o,c=e[o];if(a.required&&c===void 0){n.errors.push({path:u,message:`\u041E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435 "${o}" \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E`,level:g.ERROR}),n.valid=!1;continue}c!==void 0&&this._validateField(c,a,u,n)}for(let o of Object.keys(e))t[o]||n.warnings.push({path:i?`${i}.${o}`:o,message:`\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u043F\u043E\u043B\u0435 "${o}"`,level:g.WARNING})}_validateField(e,t,i,n){if(!this._validateType(e,t,i,n))return;let o=Array.isArray(t.type)?t.type:[t.type];t.options&&o.includes(h.SELECT)&&!t.options.includes(e)&&(n.errors.push({path:i,message:`\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 "${String(e)}". \u0414\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0435: ${t.options.join(", ")}`,level:g.ERROR}),n.valid=!1),o.includes(h.NUMBER)&&typeof e=="number"&&(t.min!==void 0&&e<t.min&&n.warnings.push({path:i,message:`\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 ${e} \u043C\u0435\u043D\u044C\u0448\u0435 \u043C\u0438\u043D\u0438\u043C\u0443\u043C\u0430 ${t.min}`,level:g.WARNING}),t.max!==void 0&&e>t.max&&n.warnings.push({path:i,message:`\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 ${e} \u0431\u043E\u043B\u044C\u0448\u0435 \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C\u0430 ${t.max}`,level:g.WARNING})),t.properties&&fe(e)&&this._validateSchemaObject(e,t.properties,i,n),t.items&&Array.isArray(e)&&e.forEach((a,u)=>{let c=`${i}[${u}]`;this._validateField(a,t.items,c,n)})}_validateType(e,t,i,n){let o=Array.isArray(t.type)?t.type:[t.type];return o.some(u=>this._matchesType(e,u))?(o.includes(h.ENTITY)&&typeof e=="string"&&!e.includes(".")&&n.warnings.push({path:i,message:'Entity ID \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 "domain.entity"',level:g.WARNING}),o.includes(h.ICON)&&typeof e=="string"&&!e.includes(":")&&n.warnings.push({path:i,message:'\u0418\u043A\u043E\u043D\u043A\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 "mdi:icon-name"',level:g.WARNING}),!0):(n.errors.push({path:i,message:`\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F ${Oe(t.type)}, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${Array.isArray(e)?"array":typeof e}`,level:g.ERROR}),n.valid=!1,!1)}_matchesType(e,t){switch(t){case h.STRING:case h.ENTITY:case h.ICON:case h.COLOR:case h.TEMPLATE:return typeof e=="string";case h.NUMBER:return typeof e=="number"&&!Number.isNaN(e);case h.BOOLEAN:return typeof e=="boolean";case h.SELECT:return!0;case h.OBJECT:case h.ACTION:return fe(e);case h.ARRAY:return Array.isArray(e);default:return!1}}_applyRuntimeValidation(e,t){try{R.validate(e)}catch(i){let n=this._toRuntimeIssue(i);n&&(t.errors.push(n),t.valid=!1)}}_addMigrationIssues(e,t){e.changed&&(t.warnings.push({path:"config_version",message:`\u041A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044F \u0431\u0443\u0434\u0435\u0442 \u043C\u0438\u0433\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u0441 v${e.fromVersion} \u0434\u043E v${e.toVersion} \u043F\u0440\u0438 normalize().`,level:g.WARNING}),e.changes.forEach(i=>{t.suggestions.push({path:i.path,message:i.message,level:g.INFO})}))}_toRuntimeIssue(e){if(!(e instanceof Error))return null;let t=e instanceof r&&e.path||"",i=t?`${t}: `:"",n=e.message.startsWith(i)?e.message.slice(i.length):e.message;return{path:t,message:n,level:g.ERROR}}_applyCustomRules(e,t){for(let i of this._customRules)try{let n=i(e);if(!Array.isArray(n))continue;for(let o of n){if(o.level===g.ERROR){t.errors.push(o),t.valid=!1;continue}if(o.level===g.WARNING){t.warnings.push(o);continue}t.suggestions.push(o)}}catch(n){console.warn("[ConfigValidator] Rule error:",n)}}_addSuggestions(e,t){let i=Array.isArray(e.body?.cards)?e.body.cards:[];i.length>5&&e.lazy_load!==!0&&t.suggestions.push({path:"lazy_load",message:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C lazy_load \u0434\u043B\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441 \u0431\u043E\u043B\u0435\u0435 \u0447\u0435\u043C 5 \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u043C\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438",level:g.INFO,fix:{lazy_load:!0}}),i.length>1&&!e.grid&&t.suggestions.push({path:"grid",message:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C grid layout \u0434\u043B\u044F \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A",level:g.INFO,fix:{grid:{columns:2}}}),(e.state_styles||e.alerts)&&!e.entity&&t.warnings.push({path:"entity",message:"\u0414\u043B\u044F state_styles \u0438 alerts \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0443\u043A\u0430\u0437\u0430\u0442\u044C entity",level:g.WARNING}),e.body_mode===M.TABS&&(!Array.isArray(e.tabs)||e.tabs.length===0)&&t.warnings.push({path:"tabs",message:"\u0414\u043B\u044F \u0440\u0435\u0436\u0438\u043C\u0430 tabs \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043C\u0430\u0441\u0441\u0438\u0432 \u0432\u043A\u043B\u0430\u0434\u043E\u043A",level:g.WARNING})}_dedupeIssues(e){let t=n=>{let o=new Set;return n.filter(a=>{let u=`${a.level}|${a.path}|${a.message}`;return o.has(u)?!1:(o.add(u),!0)})},i={...e,errors:t(e.errors),warnings:t(e.warnings),suggestions:t(e.suggestions)};return i.valid=i.errors.length===0,i}getCompletions(e=""){let t=Le(this._schema,e);return t?Object.entries(t).map(([i,n])=>({label:i,type:n.type,description:n.description,required:n.required,default:n.default,options:n.options})):[]}getFieldDocumentation(e){let t=me(this._schema,e);return t?{...t,path:e}:null}static getStyles(){return`
      .uc-validation-error {
        color: var(--error-color, #f44336);
        background: rgba(244, 67, 54, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        margin: 4px 0;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-validation-warning {
        color: var(--warning-color, #ff9800);
        background: rgba(255, 152, 0, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        margin: 4px 0;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-validation-suggestion {
        color: var(--info-color, #2196f3);
        background: rgba(33, 150, 243, 0.1);
        padding: 8px 12px;
        border-radius: 8px;
        margin: 4px 0;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-validation-path {
        font-family: monospace;
        font-size: 12px;
        opacity: 0.7;
      }

      .uc-validation-fix {
        margin-left: auto;
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        background: currentColor;
        color: white;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.8;
      }

      .uc-validation-fix:hover {
        opacity: 1;
      }
    `}};var Be={handle:null,ghostClass:"uc-drag-ghost",dragClass:"uc-dragging",dropZoneClass:"uc-drop-zone",dropActiveClass:"uc-drop-active",animation:200,threshold:10,axis:null,scrollSensitivity:50,scrollSpeed:10},ee=class{constructor(e,t={}){this._container=e,this._config={...Be,...t},this._items=[],this._draggedItem=null,this._ghost=null,this._placeholder=null,this._startPos={x:0,y:0},this._currentPos={x:0,y:0},this._startIndex=-1,this._scrollInterval=null,this._isDragging=!1,this._callbacks={onStart:null,onMove:null,onEnd:null,onReorder:null},this._boundHandlers={mouseDown:this._onMouseDown.bind(this),mouseMove:this._onMouseMove.bind(this),mouseUp:this._onMouseUp.bind(this),touchStart:this._onTouchStart.bind(this),touchMove:this._onTouchMove.bind(this),touchEnd:this._onTouchEnd.bind(this)},this._itemRect=null,this._init()}_init(){this._updateItems(),this._bindEvents()}_updateItems(){this._items=Array.from(this._container.children)}_bindEvents(){this._container.addEventListener("mousedown",this._boundHandlers.mouseDown),document.addEventListener("mousemove",this._boundHandlers.mouseMove),document.addEventListener("mouseup",this._boundHandlers.mouseUp),this._container.addEventListener("touchstart",this._boundHandlers.touchStart,{passive:!1}),document.addEventListener("touchmove",this._boundHandlers.touchMove,{passive:!1}),document.addEventListener("touchend",this._boundHandlers.touchEnd)}on(e,t){Object.prototype.hasOwnProperty.call(this._callbacks,e)&&(this._callbacks[e]=t)}_onMouseDown(e){if(e.button!==0)return;let t=this._getItemFromEvent(e);if(t){if(this._config.handle){let i=e.target?.closest(this._config.handle);if(!i||!t.contains(i))return}e.preventDefault(),this._startDrag(t,e.clientX,e.clientY)}}_onTouchStart(e){if(e.touches.length!==1)return;let t=e.touches[0],i=this._getItemFromEvent(e);if(i){if(this._config.handle){let n=e.target?.closest(this._config.handle);if(!n||!i.contains(n))return}this._startDrag(i,t.clientX,t.clientY)}}_getItemFromEvent(e){let t=e.target;return this._items.find(i=>i.contains(t))}_startDrag(e,t,i){this._draggedItem=e,this._startPos={x:t,y:i},this._currentPos={x:t,y:i},this._isDragging=!1,this._startIndex=this._getItemIndex(e);let n=e.getBoundingClientRect();this._itemRect=n}_onMouseMove(e){this._draggedItem&&this._handleMove(e.clientX,e.clientY)}_onTouchMove(e){if(!this._draggedItem||e.touches.length!==1)return;let t=e.touches[0];this._handleMove(t.clientX,t.clientY),this._isDragging&&e.preventDefault()}_handleMove(e,t){let i=e-this._startPos.x,n=t-this._startPos.y;if(!this._isDragging){if(Math.sqrt(i*i+n*n)<this._config.threshold)return;this._isDragging=!0,this._createGhost(),this._createPlaceholder(),this._callbacks.onStart?.(this._draggedItem,this._getItemIndex(this._draggedItem))}this._currentPos={x:e,y:t},this._moveGhost(e,t),this._updateDropPosition(e,t),this._handleAutoScroll(t),this._callbacks.onMove?.(this._draggedItem,e,t)}_createGhost(){let e=this._itemRect,t=this._draggedItem;!e||!t||(this._ghost=t.cloneNode(!0),this._ghost.className=`${t.className} ${this._config.ghostClass}`,this._ghost.style.cssText=`
      position: fixed;
      left: ${e.left}px;
      top: ${e.top}px;
      width: ${e.width}px;
      height: ${e.height}px;
      pointer-events: none;
      z-index: 10000;
      opacity: 0.8;
      transform: scale(1.02);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      transition: transform 0.1s ease;
    `,document.body.appendChild(this._ghost),t.classList.add(this._config.dragClass),t.style.opacity="0.3")}_createPlaceholder(){let e=this._itemRect,t=this._draggedItem;!e||!t||!t.parentNode||(this._placeholder=document.createElement("div"),this._placeholder.className=this._config.dropZoneClass,this._placeholder.style.cssText=`
      height: ${e.height}px;
      background: var(--primary-color, #03a9f4);
      opacity: 0.2;
      border-radius: 8px;
      border: 2px dashed var(--primary-color);
      transition: all ${this._config.animation}ms ease;
    `,t.parentNode.insertBefore(this._placeholder,t))}_moveGhost(e,t){if(!this._ghost||!this._itemRect)return;let i=e-this._itemRect.width/2,n=t-this._itemRect.height/2;this._config.axis==="x"?n=this._itemRect.top:this._config.axis==="y"&&(i=this._itemRect.left),this._ghost.style.left=`${i}px`,this._ghost.style.top=`${n}px`}_updateDropPosition(e,t){if(!this._placeholder)return;this._updateItems();let i=null;for(let n=0;n<this._items.length;n++){let o=this._items[n];if(o===this._draggedItem||o===this._placeholder)continue;let a=o.getBoundingClientRect(),u=a.top+a.height/2;if(t<u){i=n;break}}if(i!==null){let n=this._items[i];n&&n!==this._placeholder.nextSibling&&this._container.insertBefore(this._placeholder,n)}else this._placeholder.nextSibling!==null&&this._container.appendChild(this._placeholder)}_handleAutoScroll(e){let t=this._container.getBoundingClientRect(),{scrollSensitivity:i,scrollSpeed:n}=this._config;this._scrollInterval&&(clearInterval(this._scrollInterval),this._scrollInterval=null),e<t.top+i?this._scrollInterval=setInterval(()=>{this._container.scrollTop-=n},16):e>t.bottom-i&&(this._scrollInterval=setInterval(()=>{this._container.scrollTop+=n},16))}_onMouseUp(e){this._endDrag()}_onTouchEnd(e){this._endDrag()}_endDrag(){if(this._draggedItem){if(this._scrollInterval&&(clearInterval(this._scrollInterval),this._scrollInterval=null),this._isDragging){let e=this._startIndex,t=e;this._placeholder&&this._placeholder.parentNode&&(this._placeholder.parentNode.insertBefore(this._draggedItem,this._placeholder),this._placeholder.remove(),t=this._getItemIndex(this._draggedItem)),this._ghost&&(this._ghost.remove(),this._ghost=null),this._draggedItem.classList.remove(this._config.dragClass),this._draggedItem.style.opacity="",e!==t&&(this._callbacks.onReorder?.(e,t,this._draggedItem),b(this._container,"items-reordered",{oldIndex:e,newIndex:t,item:this._draggedItem})),this._callbacks.onEnd?.(this._draggedItem,t)}this._draggedItem=null,this._placeholder=null,this._isDragging=!1,this._startIndex=-1,this._updateItems()}}_getItemIndex(e){return Array.from(this._container.children).indexOf(e)}enable(){this._container.classList.add("uc-drag-enabled")}disable(){this._container.classList.remove("uc-drag-enabled"),this._endDrag()}destroy(){this.disable(),this._container.removeEventListener("mousedown",this._boundHandlers.mouseDown),document.removeEventListener("mousemove",this._boundHandlers.mouseMove),document.removeEventListener("mouseup",this._boundHandlers.mouseUp),this._container.removeEventListener("touchstart",this._boundHandlers.touchStart),document.removeEventListener("touchmove",this._boundHandlers.touchMove),document.removeEventListener("touchend",this._boundHandlers.touchEnd)}static getStyles(){return`
      .uc-drag-enabled {
        user-select: none;
        -webkit-user-select: none;
      }

      .uc-dragging {
        opacity: 0.3 !important;
        pointer-events: none;
      }

      .uc-drag-ghost {
        cursor: grabbing !important;
      }

      .uc-drop-zone {
        background: var(--primary-color, #03a9f4);
        opacity: 0.2;
        border-radius: 8px;
        border: 2px dashed var(--primary-color);
      }

      .uc-drop-active {
        background: var(--primary-color);
        opacity: 0.3;
      }

      /* Handle \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u044F */
      .uc-drag-handle {
        cursor: grab;
        padding: 8px;
        color: var(--secondary-text-color);
        transition: color 0.2s;
      }

      .uc-drag-handle:hover {
        color: var(--primary-text-color);
      }

      .uc-drag-handle:active {
        cursor: grabbing;
      }

      /* \u0410\u043D\u0438\u043C\u0430\u0446\u0438\u044F \u043F\u0440\u0438 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0438 */
      .uc-drag-enabled > * {
        transition: transform 0.2s ease;
      }

      /* \u0418\u043D\u0434\u0438\u043A\u0430\u0442\u043E\u0440 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F */
      .uc-edit-mode {
        outline: 2px dashed var(--primary-color);
        outline-offset: 2px;
      }
    `}};var y={N:"n",S:"s",E:"e",W:"w",NE:"ne",NW:"nw",SE:"se",SW:"sw"},je={handles:[y.SE],minWidth:100,minHeight:50,maxWidth:1/0,maxHeight:1/0,grid:[1,1],aspectRatio:null,handleSize:12,handleClass:"uc-resize-handle",resizingClass:"uc-resizing"},te=class{constructor(e,t={}){this._element=e,this._config={...je,...t},this._handles=new Map,this._isResizing=!1,this._currentHandle=null,this._startRect=null,this._startPos={x:0,y:0},this._callbacks={onStart:null,onResize:null,onEnd:null},this._boundHandlers={mouseMove:this._onMouseMove.bind(this),mouseUp:this._onMouseUp.bind(this),touchMove:this._onTouchMove.bind(this),touchEnd:this._onTouchEnd.bind(this)},this._handleListeners=new Map,this._init()}_init(){this._element.style.position="relative",this._createHandles(),this._bindEvents()}_createHandles(){for(let e of this._config.handles){let t=document.createElement("div");t.className=`${this._config.handleClass} ${this._config.handleClass}-${e}`,t.dataset.handle=e,this._applyHandleStyles(t,e),this._element.appendChild(t),this._handles.set(e,t)}}_applyHandleStyles(e,t){let i=this._config.handleSize,n=i/2,o={position:"absolute",width:`${i}px`,height:`${i}px`,zIndex:"10"},a={[y.N]:{top:`-${n}px`,left:"50%",transform:"translateX(-50%)",cursor:"ns-resize"},[y.S]:{bottom:`-${n}px`,left:"50%",transform:"translateX(-50%)",cursor:"ns-resize"},[y.E]:{right:`-${n}px`,top:"50%",transform:"translateY(-50%)",cursor:"ew-resize"},[y.W]:{left:`-${n}px`,top:"50%",transform:"translateY(-50%)",cursor:"ew-resize"},[y.NE]:{top:`-${n}px`,right:`-${n}px`,cursor:"nesw-resize"},[y.NW]:{top:`-${n}px`,left:`-${n}px`,cursor:"nwse-resize"},[y.SE]:{bottom:`-${n}px`,right:`-${n}px`,cursor:"nwse-resize"},[y.SW]:{bottom:`-${n}px`,left:`-${n}px`,cursor:"nesw-resize"}};Object.assign(e.style,o,a[t])}_bindEvents(){for(let[e,t]of this._handles){let i=o=>this._onMouseDown(o,e),n=o=>this._onTouchStart(o,e);this._handleListeners.set(t,{mouseDown:i,touchStart:n}),t.addEventListener("mousedown",i),t.addEventListener("touchstart",n,{passive:!1})}document.addEventListener("mousemove",this._boundHandlers.mouseMove),document.addEventListener("mouseup",this._boundHandlers.mouseUp),document.addEventListener("touchmove",this._boundHandlers.touchMove,{passive:!1}),document.addEventListener("touchend",this._boundHandlers.touchEnd)}on(e,t){Object.prototype.hasOwnProperty.call(this._callbacks,e)&&(this._callbacks[e]=t)}_onMouseDown(e,t){e.preventDefault(),e.stopPropagation(),this._startResize(t,e.clientX,e.clientY)}_onTouchStart(e,t){if(e.touches.length!==1)return;e.preventDefault();let i=e.touches[0];this._startResize(t,i.clientX,i.clientY)}_startResize(e,t,i){this._isResizing=!0,this._currentHandle=e,this._startPos={x:t,y:i},this._startRect=this._element.getBoundingClientRect(),this._element.classList.add(this._config.resizingClass),document.body.style.cursor=this._handles.get(e)?.style.cursor||"default",document.body.style.userSelect="none",this._callbacks.onStart?.({handle:e,width:this._startRect.width,height:this._startRect.height})}_onMouseMove(e){this._isResizing&&this._handleResize(e.clientX,e.clientY)}_onTouchMove(e){if(!this._isResizing||e.touches.length!==1)return;e.preventDefault();let t=e.touches[0];this._handleResize(t.clientX,t.clientY)}_handleResize(e,t){let i=this._startRect;if(!i)return;let n=e-this._startPos.x,o=t-this._startPos.y,a=i.width,u=i.height,c=null,m=null;switch(this._currentHandle){case y.N:u=i.height-o,m=i.top+o;break;case y.S:u=i.height+o;break;case y.E:a=i.width+n;break;case y.W:a=i.width-n,c=i.left+n;break;case y.NE:a=i.width+n,u=i.height-o,m=i.top+o;break;case y.NW:a=i.width-n,u=i.height-o,c=i.left+n,m=i.top+o;break;case y.SE:a=i.width+n,u=i.height+o;break;case y.SW:a=i.width-n,u=i.height+o,c=i.left+n;break}if(a=Math.max(this._config.minWidth,Math.min(this._config.maxWidth,a)),u=Math.max(this._config.minHeight,Math.min(this._config.maxHeight,u)),this._config.grid[0]>1&&(a=Math.round(a/this._config.grid[0])*this._config.grid[0]),this._config.grid[1]>1&&(u=Math.round(u/this._config.grid[1])*this._config.grid[1]),this._config.aspectRatio){let A=this._config.aspectRatio;a/A>u?a=u*A:u=a/A}this._element.style.width=`${a}px`,this._element.style.height=`${u}px`,this._callbacks.onResize?.({handle:this._currentHandle,width:a,height:u,deltaX:n,deltaY:o})}_onMouseUp(){this._endResize()}_onTouchEnd(){this._endResize()}_endResize(){if(!this._isResizing)return;this._isResizing=!1,this._element.classList.remove(this._config.resizingClass),document.body.style.cursor="",document.body.style.userSelect="";let e=this._element.getBoundingClientRect();this._callbacks.onEnd?.({handle:this._currentHandle,width:e.width,height:e.height}),b(this._element,"card-resized",{width:e.width,height:e.height}),this._currentHandle=null,this._startRect=null}setSize(e,t){this._element.style.width=`${e}px`,this._element.style.height=`${t}px`}getSize(){let e=this._element.getBoundingClientRect();return{width:e.width,height:e.height}}showHandles(){for(let e of this._handles.values())e.style.display=""}hideHandles(){for(let e of this._handles.values())e.style.display="none"}destroy(){for(let e of this._handles.values()){let t=this._handleListeners.get(e);t&&(e.removeEventListener("mousedown",t.mouseDown),e.removeEventListener("touchstart",t.touchStart)),e.remove()}this._handles.clear(),this._handleListeners.clear(),document.removeEventListener("mousemove",this._boundHandlers.mouseMove),document.removeEventListener("mouseup",this._boundHandlers.mouseUp),document.removeEventListener("touchmove",this._boundHandlers.touchMove),document.removeEventListener("touchend",this._boundHandlers.touchEnd)}static getStyles(){return`
      .uc-resize-handle {
        background: var(--primary-color, #03a9f4);
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .uc-resize-handle::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
      }

      *:hover > .uc-resize-handle,
      .uc-resizing .uc-resize-handle {
        opacity: 1;
      }

      .uc-resize-handle:hover {
        transform: scale(1.2);
      }

      .uc-resizing {
        opacity: 0.8;
        outline: 2px solid var(--primary-color);
      }

      /* \u0421\u043F\u0435\u0446\u0438\u0444\u0438\u0447\u043D\u044B\u0435 \u0441\u0442\u0438\u043B\u0438 \u0434\u043B\u044F \u0443\u0433\u043B\u043E\u0432\u044B\u0445 handles */
      .uc-resize-handle-se {
        background: var(--primary-color);
        border-radius: 0;
        width: 16px !important;
        height: 16px !important;
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
      }

      .uc-resize-handle-se::after {
        display: none;
      }

      /* Grid preview \u043F\u0440\u0438 resize */
      .uc-resize-grid-preview {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 49px,
          var(--divider-color) 49px,
          var(--divider-color) 50px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 49px,
          var(--divider-color) 49px,
          var(--divider-color) 50px
        );
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s;
      }

      .uc-resizing .uc-resize-grid-preview {
        opacity: 0.3;
      }

      /* \u0420\u0430\u0437\u043C\u0435\u0440\u044B \u0432 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C \u0432\u0440\u0435\u043C\u0435\u043D\u0438 */
      .uc-resize-dimensions {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s;
        pointer-events: none;
      }

      .uc-resizing .uc-resize-dimensions {
        opacity: 1;
      }
    `}};var I={NONE:"none",PARTIAL:"partial",FULL:"full"},D={EDIT:"edit",DELETE:"delete",MOVE:"move",RESIZE:"resize",DUPLICATE:"duplicate"},Fe={level:I.NONE,lockedActions:[],password:null,showIndicator:!0,indicatorPosition:"top-right"},ie=class{constructor(e,t={}){this._element=e,this._config={...Fe,...t},this._isLocked=this._config.level!==I.NONE,this._indicator=null,this._callbacks={onLock:null,onUnlock:null,onAttempt:null},this._init()}_init(){this._config.showIndicator&&this._isLocked&&this._createIndicator(),this._updateElementState()}_createIndicator(){this._indicator=document.createElement("div"),this._indicator.className=`uc-lock-indicator uc-lock-${this._config.indicatorPosition}`,this._indicator.innerHTML=`
      <ha-icon icon="mdi:lock"></ha-icon>
      ${this._config.level===I.FULL?"<span>\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E</span>":""}
    `,this._indicator.addEventListener("click",e=>{e.stopPropagation(),this._showUnlockDialog()}),this._element.appendChild(this._indicator)}_removeIndicator(){this._indicator&&(this._indicator.remove(),this._indicator=null)}_updateElementState(){this._element.classList.toggle("uc-locked",this._isLocked),this._element.classList.toggle("uc-locked-full",this._config.level===I.FULL),this._element.classList.toggle("uc-locked-partial",this._config.level===I.PARTIAL),this._element.dataset.lockLevel=this._config.level}on(e,t){Object.prototype.hasOwnProperty.call(this._callbacks,e)&&(this._callbacks[e]=t)}lock(e=I.FULL,t=[]){this._config.level=e,this._config.lockedActions=t,this._isLocked=e!==I.NONE,this._config.showIndicator&&this._isLocked&&!this._indicator&&this._createIndicator(),this._updateElementState(),this._callbacks.onLock?.(e,t),b(this._element,"lock-changed",{locked:!0,level:e,actions:t})}unlock(e=null){return this._config.password&&e!==this._config.password?(this._showError("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C"),!1):(this._config.level=I.NONE,this._isLocked=!1,this._removeIndicator(),this._updateElementState(),this._callbacks.onUnlock?.(),b(this._element,"lock-changed",{locked:!1}),!0)}toggle(){return this._isLocked?!this.unlock():(this.lock(),!0)}isActionLocked(e){return this._isLocked?this._config.level===I.FULL||this._config.lockedActions.length===0?!0:this._config.lockedActions.includes(e):!1}attemptAction(e,t){return this.isActionLocked(e)?(this._callbacks.onAttempt?.(e),this._showBlockedMessage(e),!1):(t?.(),!0)}_showBlockedMessage(e){let i=`\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 "${{[D.EDIT]:"\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",[D.DELETE]:"\u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435",[D.MOVE]:"\u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435",[D.RESIZE]:"\u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0440\u0430\u0437\u043C\u0435\u0440\u0430",[D.DUPLICATE]:"\u0434\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435"}[e]||e}" \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E`;this._showToast(i,"warning")}_showUnlockDialog(){if(!this._config.password){this.unlock();return}let e=document.createElement("div");e.className="uc-lock-dialog",e.innerHTML=`
      <div class="uc-lock-dialog-backdrop"></div>
      <div class="uc-lock-dialog-content">
        <div class="uc-lock-dialog-header">
          <ha-icon icon="mdi:lock"></ha-icon>
          <span>\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430</span>
        </div>
        <div class="uc-lock-dialog-body">
          <input type="password" 
                 class="uc-lock-password" 
                 placeholder="\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" 
                 autocomplete="off" />
        </div>
        <div class="uc-lock-dialog-footer">
          <button class="uc-lock-btn uc-lock-btn-cancel">\u041E\u0442\u043C\u0435\u043D\u0430</button>
          <button class="uc-lock-btn uc-lock-btn-unlock">\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button>
        </div>
      </div>
    `;let t=e.querySelector(".uc-lock-password"),i=e.querySelector(".uc-lock-btn-cancel"),n=e.querySelector(".uc-lock-btn-unlock"),o=e.querySelector(".uc-lock-dialog-backdrop");if(!(t instanceof HTMLInputElement)||!(i instanceof HTMLButtonElement)||!(n instanceof HTMLButtonElement)||!(o instanceof HTMLElement))return;let a=()=>e.remove();o.addEventListener("click",a),i.addEventListener("click",a),n.addEventListener("click",()=>{this.unlock(t.value)?a():(t.classList.add("error"),t.value="",t.focus())}),t.addEventListener("keypress",u=>{u.key==="Enter"&&n.click()}),document.body.appendChild(e),t.focus()}_showError(e){this._showToast(e,"error")}_showToast(e,t="info"){let i=document.createElement("div");i.className=`uc-lock-toast uc-lock-toast-${t}`,i.innerHTML=`
      <ha-icon icon="mdi:${t==="error"?"alert-circle":"information"}"></ha-icon>
      <span>${e}</span>
    `,document.body.appendChild(i),requestAnimationFrame(()=>{i.classList.add("visible")}),setTimeout(()=>{i.classList.remove("visible"),setTimeout(()=>i.remove(),300)},3e3)}getState(){return{locked:this._isLocked,level:this._config.level,lockedActions:this._config.lockedActions,hasPassword:!!this._config.password}}setPassword(e){this._config.password=e}destroy(){this._removeIndicator(),this._element.classList.remove("uc-locked","uc-locked-full","uc-locked-partial"),delete this._element.dataset.lockLevel}static getStyles(){return`
      /* \u0418\u043D\u0434\u0438\u043A\u0430\u0442\u043E\u0440 \u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0438 */
      .uc-lock-indicator {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: var(--error-color, #f44336);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        z-index: 100;
        transition: transform 0.2s, opacity 0.2s;
      }

      .uc-lock-indicator:hover {
        transform: scale(1.05);
      }

      .uc-lock-indicator ha-icon {
        --mdc-icon-size: 16px;
      }

      .uc-lock-top-right { top: 8px; right: 8px; }
      .uc-lock-top-left { top: 8px; left: 8px; }
      .uc-lock-bottom-right { bottom: 8px; right: 8px; }
      .uc-lock-bottom-left { bottom: 8px; left: 8px; }

      /* \u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0433\u043E \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 */
      .uc-locked {
        pointer-events: auto;
      }

      .uc-locked-full::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.05);
        z-index: 50;
        pointer-events: none;
      }

      /* \u0414\u0438\u0430\u043B\u043E\u0433 */
      .uc-lock-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-lock-dialog-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      .uc-lock-dialog-content {
        position: relative;
        background: var(--ha-card-background, white);
        border-radius: 16px;
        width: 300px;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: uc-lock-dialog-appear 0.2s ease;
      }

      @keyframes uc-lock-dialog-appear {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .uc-lock-dialog-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 16px;
        background: var(--primary-color);
        color: white;
        font-weight: 600;
      }

      .uc-lock-dialog-body {
        padding: 16px;
      }

      .uc-lock-password {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--divider-color);
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      .uc-lock-password:focus {
        border-color: var(--primary-color);
      }

      .uc-lock-password.error {
        border-color: var(--error-color);
        animation: uc-lock-shake 0.3s;
      }

      @keyframes uc-lock-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }

      .uc-lock-dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid var(--divider-color);
      }

      .uc-lock-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .uc-lock-btn-cancel {
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
      }

      .uc-lock-btn-unlock {
        background: var(--primary-color);
        color: white;
      }

      .uc-lock-btn:hover {
        filter: brightness(1.1);
      }

      /* Toast */
      .uc-lock-toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: var(--primary-text-color);
        color: var(--primary-background-color);
        border-radius: 8px;
        font-size: 14px;
        z-index: 10002;
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
      }

      .uc-lock-toast.visible {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }

      .uc-lock-toast-error {
        background: var(--error-color);
        color: white;
      }

      .uc-lock-toast-warning {
        background: var(--warning-color);
        color: white;
      }
    `}};var S=class{constructor(e={}){this._config=e,this._element=null}render(){throw new Error("render() must be implemented")}getValue(){throw new Error("getValue() must be implemented")}setValue(e){throw new Error("setValue() must be implemented")}},ne=class extends S{constructor(){super(...arguments);this._input=null}render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <input type="${this._config.type||"text"}" 
             class="uc-editor-input"
             placeholder="${this._config.placeholder||""}"
             value="${this._config.value||""}"
             ${this._config.required?"required":""} />
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._input=this._element.querySelector("input"),this._input.addEventListener("input",()=>{b(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){return this._input?.value||""}setValue(t){this._input&&(this._input.value=t||"")}},re=class extends S{constructor(){super(...arguments);this._input=null}render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <input type="number" 
             class="uc-editor-input"
             min="${this._config.min!=null?this._config.min:""}"
             max="${this._config.max!=null?this._config.max:""}"
             step="${this._config.step!=null?this._config.step:1}"
             value="${this._config.value!=null?this._config.value:""}"
             ${this._config.required?"required":""} />
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._input=this._element.querySelector("input"),this._input.addEventListener("input",()=>{b(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){let t=this._input?.value;return t!==""?Number(t):null}setValue(t){this._input&&(this._input.value=t!=null?String(t):"")}},oe=class extends S{constructor(){super(...arguments);this._input=null}render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field uc-editor-checkbox",this._element.innerHTML=`
      <label class="uc-editor-checkbox-label">
        <input type="checkbox" ${this._config.value?"checked":""} />
        <span class="uc-editor-checkbox-custom"></span>
        <span class="uc-editor-checkbox-text">${this._config.label||""}</span>
      </label>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._input=this._element.querySelector("input"),this._input.addEventListener("change",()=>{b(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){return this._input?.checked||!1}setValue(t){this._input&&(this._input.checked=!!t)}},se=class extends S{constructor(){super(...arguments);this._select=null}render(){this._element=document.createElement("div"),this._element.className="uc-editor-field";let t=(this._config.options||[]).map(i=>{let n=typeof i=="object"?i.value:i,o=typeof i=="object"?i.label:i,a=n===this._config.value?"selected":"";return`<option value="${n}" ${a}>${o}</option>`}).join("");return this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <select class="uc-editor-select">
        ${this._config.placeholder?`<option value="">${this._config.placeholder}</option>`:""}
        ${t}
      </select>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._select=this._element.querySelector("select"),this._select.addEventListener("change",()=>{b(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){return this._select?.value||""}setValue(t){this._select&&(this._select.value=t||"")}},ae=class extends S{constructor(){super(...arguments);this._picker=null}render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <ha-entity-picker
        .hass="${this._config.hass}"
        .value="${this._config.value||""}"
        .includeDomains="${this._config.domains}"
        allow-custom-entity
      ></ha-entity-picker>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._picker=this._element.querySelector("ha-entity-picker"),this._picker?.addEventListener("value-changed",t=>{let i=t.detail?.value||"";b(this._element,"value-changed",{value:i})}),this._element}getValue(){return this._picker?.value||""}setValue(t){this._picker&&(this._picker.value=t||"")}},le=class extends S{constructor(){super(...arguments);this._picker=null}render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <ha-icon-picker
        .hass="${this._config.hass}"
        .value="${this._config.value||""}"
      ></ha-icon-picker>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._picker=this._element.querySelector("ha-icon-picker"),this._picker?.addEventListener("value-changed",t=>{let i=t.detail?.value||"";b(this._element,"value-changed",{value:i})}),this._element}getValue(){return this._picker?.value||""}setValue(t){this._picker&&(this._picker.value=t||"")}},de=class extends S{constructor(){super(...arguments);this._colorInput=null;this._textInput=null}render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field uc-editor-color",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <div class="uc-editor-color-wrapper">
        <input type="color" 
               class="uc-editor-color-input"
               value="${this._config.value||"#ffffff"}" />
        <input type="text" 
               class="uc-editor-color-text"
               value="${this._config.value||""}"
               placeholder="#ffffff" />
      </div>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._colorInput=this._element.querySelector(".uc-editor-color-input"),this._textInput=this._element.querySelector(".uc-editor-color-text"),this._colorInput?.addEventListener("input",()=>{!this._colorInput||!this._textInput||(this._textInput.value=this._colorInput.value,b(this._element,"value-changed",{value:this.getValue()}))}),this._textInput?.addEventListener("input",()=>{!this._textInput||!this._colorInput||(/^#[0-9a-fA-F]{6}$/.test(this._textInput.value)&&(this._colorInput.value=this._textInput.value),b(this._element,"value-changed",{value:this.getValue()}))}),this._element}getValue(){return this._textInput?.value||""}setValue(t){this._colorInput&&this._textInput&&(this._colorInput.value=t||"#ffffff",this._textInput.value=t||"")}},ce=class extends S{constructor(){super(...arguments);this._header=null;this._content=null}render(){return this._element=document.createElement("div"),this._element.className=`uc-editor-section ${this._config.expanded?"expanded":""}`,this._element.innerHTML=`
      <div class="uc-editor-section-header">
        <ha-icon icon="mdi:${this._config.icon||"chevron-right"}" class="uc-editor-section-icon"></ha-icon>
        <span class="uc-editor-section-title">${this._config.title||""}</span>
        <ha-icon icon="mdi:chevron-down" class="uc-editor-section-chevron"></ha-icon>
      </div>
      <div class="uc-editor-section-content"></div>
    `,this._header=this._element.querySelector(".uc-editor-section-header"),this._content=this._element.querySelector(".uc-editor-section-content"),this._header?.addEventListener("click",()=>{this._element.classList.toggle("expanded")}),this._element}addContent(t){this._content&&(t instanceof S?this._content.appendChild(t.render()):this._content.appendChild(t))}getValue(){return null}setValue(t){}},ue=class extends S{constructor(){super(...arguments);this._typeSelect=null;this._optionsContainer=null}render(){this._element=document.createElement("div"),this._element.className="uc-editor-field uc-editor-action";let t=[{value:"none",label:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F"},{value:"more-info",label:"\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F"},{value:"toggle",label:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C"},{value:"call-service",label:"\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441"},{value:"navigate",label:"\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F"},{value:"url",label:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL"}],i=this._config.value?.action||"none";return this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <select class="uc-editor-select uc-editor-action-type">
        ${t.map(n=>`
          <option value="${n.value}" ${n.value===i?"selected":""}>${n.label}</option>
        `).join("")}
      </select>
      <div class="uc-editor-action-options"></div>
    `,this._typeSelect=this._element.querySelector(".uc-editor-action-type"),this._optionsContainer=this._element.querySelector(".uc-editor-action-options"),this._typeSelect?.addEventListener("change",()=>{this._updateOptions(),b(this._element,"value-changed",{value:this.getValue()})}),this._updateOptions(),this._element}_updateOptions(){if(!this._typeSelect||!this._optionsContainer)return;let t=this._typeSelect.value;switch(this._optionsContainer.innerHTML="",t){case"call-service":this._optionsContainer.innerHTML=`
          <input type="text" 
                 class="uc-editor-input action-service" 
                 placeholder="domain.service"
                 value="${this._config.value?.service||""}" />
          <textarea class="uc-editor-textarea action-data" 
                    placeholder="service_data (YAML)">${this._config.value?.service_data?JSON.stringify(this._config.value.service_data,null,2):""}</textarea>
        `;break;case"navigate":this._optionsContainer.innerHTML=`
          <input type="text" 
                 class="uc-editor-input action-path" 
                 placeholder="/lovelace/view"
                 value="${this._config.value?.navigation_path||""}" />
        `;break;case"url":this._optionsContainer.innerHTML=`
          <input type="text" 
                 class="uc-editor-input action-url" 
                 placeholder="https://..."
                 value="${this._config.value?.url_path||""}" />
        `;break}this._optionsContainer.querySelectorAll("input, textarea").forEach(i=>{i.addEventListener("input",()=>{b(this._element,"value-changed",{value:this.getValue()})})})}getValue(){if(!this._typeSelect||!this._optionsContainer)return null;let t=this._typeSelect.value,i={action:t};switch(t){case"call-service":{let n=this._optionsContainer.querySelector(".action-service")?.value,o=this._optionsContainer.querySelector(".action-data")?.value;if(n&&(i.service=n),o)try{i.service_data=JSON.parse(o)}catch{}break}case"navigate":{let n=this._optionsContainer.querySelector(".action-path")?.value;n&&(i.navigation_path=n);break}case"url":{let n=this._optionsContainer.querySelector(".action-url")?.value;n&&(i.url_path=n);break}}return t==="none"?null:i}setValue(t){this._config.value=t,this._typeSelect&&(this._typeSelect.value=t?.action||"none",this._updateOptions())}};function Me(){return`
    .uc-editor-field {
      margin-bottom: 16px;
    }

    .uc-editor-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .uc-editor-input,
    .uc-editor-select,
    .uc-editor-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--ha-card-background);
      color: var(--primary-text-color);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .uc-editor-input:focus,
    .uc-editor-select:focus,
    .uc-editor-textarea:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(var(--rgb-primary-color), 0.1);
    }

    .uc-editor-textarea {
      min-height: 80px;
      resize: vertical;
      font-family: monospace;
    }

    .uc-editor-helper {
      display: block;
      font-size: 11px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }

    /* Checkbox */
    .uc-editor-checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }

    .uc-editor-checkbox-label input {
      display: none;
    }

    .uc-editor-checkbox-custom {
      width: 20px;
      height: 20px;
      border: 2px solid var(--divider-color);
      border-radius: 4px;
      position: relative;
      transition: all 0.2s;
    }

    .uc-editor-checkbox-label input:checked + .uc-editor-checkbox-custom {
      background: var(--primary-color);
      border-color: var(--primary-color);
    }

    .uc-editor-checkbox-custom::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 6px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
      transition: opacity 0.2s;
    }

    .uc-editor-checkbox-label input:checked + .uc-editor-checkbox-custom::after {
      opacity: 1;
    }

    /* Color picker */
    .uc-editor-color-wrapper {
      display: flex;
      gap: 8px;
    }

    .uc-editor-color-input {
      width: 50px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .uc-editor-color-text {
      flex: 1;
    }

    /* Section */
    .uc-editor-section {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 16px;
    }

    .uc-editor-section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--secondary-background-color);
      cursor: pointer;
      user-select: none;
    }

    .uc-editor-section-icon {
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }

    .uc-editor-section-title {
      flex: 1;
      font-weight: 500;
    }

    .uc-editor-section-chevron {
      --mdc-icon-size: 20px;
      transition: transform 0.2s;
    }

    .uc-editor-section.expanded .uc-editor-section-chevron {
      transform: rotate(180deg);
    }

    .uc-editor-section-content {
      padding: 0 16px;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s, padding 0.3s;
    }

    .uc-editor-section.expanded .uc-editor-section-content {
      padding: 16px;
      max-height: 2000px;
    }

    /* Action editor */
    .uc-editor-action-options {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `}var E={EN:"en",RU:"ru",ES:"es",DE:"de",FR:"fr",IT:"it",PT:"pt",ZH:"zh",JA:"ja",KO:"ko"},$={[E.EN]:{"card.title":"Universal Card","card.subtitle":"Flexible card with multiple body modes","header.title":"Title","header.subtitle":"Subtitle","header.icon":"Icon","header.entity":"Entity","body_mode.label":"Body Mode","body_mode.expand":"Expand","body_mode.modal":"Modal","body_mode.fullscreen":"Fullscreen","body_mode.tabs":"Tabs","body_mode.carousel":"Carousel","body_mode.subview":"Subview","body_mode.none":"None (header only)","action.tap":"Tap Action","action.hold":"Hold Action","action.double_tap":"Double Tap Action","action.none":"No action","action.more_info":"More info","action.toggle":"Toggle","action.call_service":"Call service","action.navigate":"Navigate","action.url":"Open URL","grid.columns":"Columns","grid.gap":"Gap","features.lazy_load":"Lazy loading","features.collapsed":"Start collapsed","features.visibility":"Visibility conditions","section.header":"Header","section.body":"Body","section.cards":"Cards","section.style":"Style","section.actions":"Actions","section.advanced":"Advanced","theme.default":"Default","theme.glass":"Glassmorphism","theme.neumorphism":"Neumorphism","theme.neon":"Neon","notification.saved":"Configuration saved","notification.error":"Error saving configuration","notification.locked":"Card is locked","button.save":"Save","button.cancel":"Cancel","button.add_card":"Add Card","button.remove":"Remove","button.duplicate":"Duplicate","button.move_up":"Move Up","button.move_down":"Move Down","validation.required":"This field is required","validation.invalid_entity":"Invalid entity format","validation.invalid_icon":"Invalid icon format","lock.locked":"Locked","lock.unlock":"Unlock","lock.enter_password":"Enter password","lock.wrong_password":"Wrong password","misc.loading":"Loading...","misc.no_data":"No data","misc.unavailable":"Unavailable"},[E.RU]:{"card.title":"Universal Card","card.subtitle":"\u0413\u0438\u0431\u043A\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0441 \u0440\u0430\u0437\u043D\u044B\u043C\u0438 \u0440\u0435\u0436\u0438\u043C\u0430\u043C\u0438","header.title":"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A","header.subtitle":"\u041F\u043E\u0434\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A","header.icon":"\u0418\u043A\u043E\u043D\u043A\u0430","header.entity":"\u0421\u0443\u0449\u043D\u043E\u0441\u0442\u044C","body_mode.label":"\u0420\u0435\u0436\u0438\u043C \u0442\u0435\u043B\u0430","body_mode.expand":"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435","body_mode.modal":"\u041C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u043D\u043E","body_mode.fullscreen":"\u041F\u043E\u043B\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D","body_mode.tabs":"\u0412\u043A\u043B\u0430\u0434\u043A\u0438","body_mode.carousel":"\u041A\u0430\u0440\u0443\u0441\u0435\u043B\u044C","body_mode.subview":"\u041F\u043E\u0434\u0432\u044C\u044E","body_mode.none":"\u041D\u0435\u0442 (\u0442\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A)","action.tap":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u043E \u043D\u0430\u0436\u0430\u0442\u0438\u044E","action.hold":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u043E \u0443\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u044E","action.double_tap":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u043E \u0434\u0432\u043E\u0439\u043D\u043E\u043C\u0443 \u043D\u0430\u0436\u0430\u0442\u0438\u044E","action.none":"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F","action.more_info":"\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F","action.toggle":"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C","action.call_service":"\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441","action.navigate":"\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F","action.url":"\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL","grid.columns":"\u041A\u043E\u043B\u043E\u043D\u043A\u0438","grid.gap":"\u041E\u0442\u0441\u0442\u0443\u043F","features.lazy_load":"\u041B\u0435\u043D\u0438\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430","features.collapsed":"\u0421\u0432\u0451\u0440\u043D\u0443\u0442\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E","features.visibility":"\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u0438","section.header":"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A","section.body":"\u0422\u0435\u043B\u043E","section.cards":"\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438","section.style":"\u0421\u0442\u0438\u043B\u044C","section.actions":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F","section.advanced":"\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E","theme.default":"\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E","theme.glass":"\u0421\u0442\u0435\u043A\u043B\u043E","theme.neumorphism":"\u041D\u0435\u043E\u043C\u043E\u0440\u0444\u0438\u0437\u043C","theme.neon":"\u041D\u0435\u043E\u043D","notification.saved":"\u041A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430","notification.error":"\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F","notification.locked":"\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430","button.save":"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C","button.cancel":"\u041E\u0442\u043C\u0435\u043D\u0430","button.add_card":"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443","button.remove":"\u0423\u0434\u0430\u043B\u0438\u0442\u044C","button.duplicate":"\u0414\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u0442\u044C","button.move_up":"\u0412\u0432\u0435\u0440\u0445","button.move_down":"\u0412\u043D\u0438\u0437","validation.required":"\u041E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435","validation.invalid_entity":"\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 entity","validation.invalid_icon":"\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0438\u043A\u043E\u043D\u043A\u0438","lock.locked":"\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E","lock.unlock":"\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C","lock.enter_password":"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C","lock.wrong_password":"\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C","misc.loading":"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...","misc.no_data":"\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445","misc.unavailable":"\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E"},[E.ES]:{"card.title":"Universal Card","card.subtitle":"Tarjeta flexible con m\xFAltiples modos","header.title":"T\xEDtulo","header.subtitle":"Subt\xEDtulo","header.icon":"Icono","header.entity":"Entidad","body_mode.label":"Modo del cuerpo","body_mode.expand":"Expandir","body_mode.modal":"Modal","body_mode.fullscreen":"Pantalla completa","body_mode.tabs":"Pesta\xF1as","body_mode.carousel":"Carrusel","body_mode.subview":"Subvista","body_mode.none":"Ninguno","button.save":"Guardar","button.cancel":"Cancelar","button.add_card":"A\xF1adir tarjeta","misc.loading":"Cargando...","misc.unavailable":"No disponible"},[E.DE]:{"card.title":"Universal Card","card.subtitle":"Flexible Karte mit mehreren Modi","header.title":"Titel","header.subtitle":"Untertitel","header.icon":"Symbol","header.entity":"Entit\xE4t","body_mode.label":"K\xF6rpermodus","body_mode.expand":"Erweitern","body_mode.modal":"Modal","body_mode.fullscreen":"Vollbild","body_mode.tabs":"Tabs","body_mode.carousel":"Karussell","button.save":"Speichern","button.cancel":"Abbrechen","button.add_card":"Karte hinzuf\xFCgen","misc.loading":"Laden...","misc.unavailable":"Nicht verf\xFCgbar"}},_e=class{constructor(){this._currentLanguage=E.EN,this._customTranslations={}}initFromHass(e){if(e?.language){let t=e.language.split("-")[0].toLowerCase();$[t]&&(this._currentLanguage=t)}}setLanguage(e){($[e]||this._customTranslations[e])&&(this._currentLanguage=e)}getLanguage(){return this._currentLanguage}t(e,t={}){let i=this._customTranslations[this._currentLanguage]?.[e];return i||(i=$[this._currentLanguage]?.[e]),i||(i=$[E.EN]?.[e]),i?i.replace(/\{(\w+)\}/g,(n,o)=>t[o]!==void 0?String(t[o]):n):e}addTranslations(e,t){this._customTranslations[e]||(this._customTranslations[e]={}),Object.assign(this._customTranslations[e],t)}getAllTranslations(e){return{...$[e]||{},...this._customTranslations[e]||{}}}getSupportedLanguages(){return[{code:E.EN,name:"English"},{code:E.RU,name:"\u0420\u0443\u0441\u0441\u043A\u0438\u0439"},{code:E.ES,name:"Espa\xF1ol"},{code:E.DE,name:"Deutsch"},{code:E.FR,name:"Fran\xE7ais"},{code:E.IT,name:"Italiano"},{code:E.PT,name:"Portugu\xEAs"},{code:E.ZH,name:"\u4E2D\u6587"},{code:E.JA,name:"\u65E5\u672C\u8A9E"},{code:E.KO,name:"\uD55C\uAD6D\uC5B4"}]}};var Lt={ConfigValidator:Q,DragDrop:ee,ResizableCards:te,LockMode:ie,TextInput:ne,NumberInput:re,Checkbox:oe,Select:se,EntityPicker:ae,IconPicker:le,ColorPicker:de,Section:ce,ActionEditor:ue,getEditorStyles:Me,MultiLanguage:_e};export{Lt as editor};
