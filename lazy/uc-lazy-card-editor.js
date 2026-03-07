var x=Object.freeze({EXPAND:"expand",MODAL:"modal",FULLSCREEN:"fullscreen",TABS:"tabs",CAROUSEL:"carousel",SUBVIEW:"subview",NONE:"none"}),J=Object.values(x),H=Object.freeze({TAP:"tap",HOLD:"hold",DOUBLE_TAP:"double_tap",NONE:"none"}),Q=Object.values(H),j=Object.freeze({CARD:"card",DASHBOARD:"dashboard",GLOBAL:"global"}),ee=Object.values(j),p=Object.freeze({DEFAULT:"default",TRANSPARENT:"transparent",SOLID:"solid",GLASS:"glass",GLASSMORPHISM:"glassmorphism",NEUMORPHISM:"neumorphism",MINIMAL:"minimal",GRADIENT:"gradient",DARK:"dark",NEON:"neon",AURORA:"aurora",CARBON:"carbon",SLATE:"slate",OBSIDIAN:"obsidian",CHARCOAL:"charcoal",MIDNIGHT:"midnight",CYBER:"cyber",VOID:"void",EMBER:"ember",FOREST:"forest",OCEAN:"ocean",PURPLE_HAZE:"purple-haze",MATRIX:"matrix",GRAPHITE:"graphite",SMOKE:"smoke",NORD:"nord",DRACULA:"dracula",MONOKAI:"monokai",TOKYO_NIGHT:"tokyo-night",CATPPUCCIN:"catppuccin"}),C=Object.freeze({NONE:"none",FADE:"fade",FADE_UP:"fadeUp",FADE_DOWN:"fadeDown",SCALE:"scale",SLIDE:"slide",BOUNCE:"bounce",FLIP:"flip"}),te=Object.values(C),$=Object.freeze({NONE:"none",FADE:"fade",FADE_DOWN:"fadeDown",FADE_UP:"fadeUp",SCALE:"scale",SLIDE:"slide"}),ie=Object.values($),A=Object.freeze({NONE:"none",FADE_UP:"fadeUp",FADE_DOWN:"fadeDown",FADE_LEFT:"fadeLeft",FADE_RIGHT:"fadeRight",SCALE:"scale",BOUNCE:"bounce",FLIP:"flip"}),re=Object.values(A),O=Object.freeze({SEQUENTIAL:"sequential",REVERSE:"reverse",CENTER_OUT:"center-out",EDGES_IN:"edges-in",DIAGONAL:"diagonal",WAVE:"wave",RANDOM:"random"}),ne=Object.values(O),Ge=Object.freeze({NONE:"none",FADE:"fade",SLIDE:"slide",BOUNCE:"bounce",ELASTIC:"elastic",SMOOTH:"smooth",SHARP:"sharp",ZOOM:"zoom"}),Ye=Object.freeze({SKELETON:"skeleton",SPINNER:"spinner",DOTS:"dots",PROGRESS:"progress",SHIMMER:"shimmer",PULSE:"pulse"}),m=Object.freeze({STATE:"state",NUMERIC_STATE:"numeric_state",USER:"user",TIME:"time",SCREEN:"screen",AND:"and",OR:"or",NOT:"not"}),pe=Object.values(m),Ke=Object.freeze({MON:"mon",TUE:"tue",WED:"wed",THU:"thu",FRI:"fri",SAT:"sat",SUN:"sun"}),G=Object.values(Ke),_=Object.freeze({NONE:"none",TOGGLE:"toggle",CALL_SERVICE:"call-service",NAVIGATE:"navigate",URL:"url",MORE_INFO:"more-info",FIRE_EVENT:"fire-dom-event",EXPAND:"expand",COLLAPSE:"collapse"}),Y=Object.freeze({HORIZONTAL:"horizontal",VERTICAL:"vertical",BOTH:"both"}),oe=Object.values(Y),w=Object.freeze({NONE:"none",EXPAND:"expand",COLLAPSE:"collapse",TOGGLE:"toggle",NEXT:"next",PREV:"prev"}),ae=Object.values(w),T=Object.freeze({STATE:"state",ATTRIBUTE:"attribute",COUNTER:"counter",CUSTOM:"custom"}),se=Object.values(T),P=Object.freeze({NONE:"none",TIME:"time",DATE:"date",DURATION:"duration"}),de=Object.values(P),Tt=Object.freeze({CARD_EXPANDED:"universal-card-expanded",CARD_COLLAPSED:"universal-card-collapsed",CARD_CONTROL:"universal-card-control",CONFIG_CHANGED:"config-changed",HASS_UPDATED:"hass-updated"}),It=Object.freeze({PRIMARY:"--uc-primary-color",SECONDARY:"--uc-secondary-color",ACCENT:"--uc-accent-color",BACKGROUND:"--uc-background-color",SURFACE:"--uc-surface-color",TEXT:"--uc-text-color",TEXT_SECONDARY:"--uc-text-secondary-color",BORDER:"--uc-border-color",BORDER_RADIUS:"--uc-border-radius",PADDING:"--uc-padding",GAP:"--uc-gap",SHADOW:"--uc-shadow",SHADOW_HOVER:"--uc-shadow-hover",TRANSITION_DURATION:"--uc-transition-duration",TRANSITION_TIMING:"--uc-transition-timing"}),b=Object.freeze({body_mode:x.EXPAND,expand_trigger:H.TAP,expanded:!1,animation:!0,stability_mode:!1,theme:p.DEFAULT,border_radius:"var(--ha-card-border-radius, 12px)",padding:"16px",grid_columns:1,grid_gap:"16px",modal_width:"90%",modal_max_width:"600px",backdrop_color:"rgba(0, 0, 0, 0.6)",lazy_load:!0,lazy_initial_batch:4,lazy_batch_size:4,lazy_idle_timeout:800,remember_expanded_state:!1,remember_mode_state:!0,auto_collapse_after:0,enable_card_pool:!0,pool_scope:j.CARD,pool_ttl_ms:10*60*1e3,pool_max_entries:32,show_expand_icon:!0,expand_icon:"mdi:chevron-down",haptic:!1,loading_type:Ye.SKELETON,skeleton_count:3,carousel_autoplay:!1,carousel_interval:5e3,swipe_enabled:!1,swipe_direction:Y.HORIZONTAL,swipe_threshold:50,swipe_velocity_threshold:.3,swipe_prevent_scroll:!1,expand_animation:C.SLIDE,collapse_animation:$.SLIDE,cards_animation:A.FADE_UP,cards_stagger:50,cards_direction:O.SEQUENTIAL,animation_preset:Ge.SMOOTH,animation_duration:300}),Lt=Object.freeze({TTI_MS:250,RENDER_MS:16,UPDATE_MS:12,BODY_LOAD_MS:180,BUNDLE_SIZE_KB:360}),u=Object.freeze({MAX_GRID_COLUMNS:12,MIN_GRID_COLUMNS:1,MAX_CARDS_PER_BODY:100,MAX_TABS:20,UPDATE_THROTTLE_MS:100,RESIZE_DEBOUNCE_MS:200,INTERSECTION_MARGIN:"100px",LAZY_MIN_BATCH:1,LAZY_MAX_BATCH:25,LAZY_MIN_TIMEOUT_MS:50,LAZY_MAX_TIMEOUT_MS:5e3,CARD_POOL_MAX_ENTRIES:32,CARD_POOL_MAX_AGE_MS:10*60*1e3,CARD_POOL_HARD_MAX_ENTRIES:512,POOL_MIN_TTL_MS:1e3,POOL_MAX_TTL_MS:60*60*1e3,POOL_MIN_MAX_ENTRIES:1,POOL_MAX_MAX_ENTRIES:512,AUTO_COLLAPSE_MAX_SECONDS:3600,ANIMATION_DURATION_MAX_MS:2e3,CAROUSEL_MIN_INTERVAL_MS:1e3,CAROUSEL_MAX_INTERVAL_MS:6e4,CARDS_STAGGER_MAX_MS:200,SWIPE_MAX_THRESHOLD_PX:400,SWIPE_MAX_VELOCITY_THRESHOLD:5,BADGE_MAX_PRECISION:6,METRICS_HISTORY_SIZE:200,MAX_UNDO_HISTORY:50,MAX_LOG_ENTRIES:1e3});function ve(a="uc"){let e=Math.random().toString(36).substring(2,10);return`${a}-${e}`}function y(a){return a!==null&&typeof a=="object"&&!Array.isArray(a)}function B(a){return typeof a=="string"&&a.trim().length>0}function v(a){return typeof a=="number"&&!Number.isNaN(a)}function D(a){if(a===null||typeof a!="object")return a;if(Array.isArray(a))return a.map(t=>D(t));let e={};return Object.keys(a).forEach(t=>{e[t]=D(a[t])}),e}function ue(a,e,t={},i={}){let r=new CustomEvent(e,{bubbles:i.bubbles!==!1,cancelable:i.cancelable!==!1,composed:i.composed!==!1,detail:t});return a.dispatchEvent(r),r}function W(a){return B(a)?/^[a-z_]+\.[a-z0-9_]+$/.test(a):!1}var le=1,N=2;function we(a){if(Array.isArray(a))return{cards:a};if(y(a)){let e=a;return Array.isArray(e.cards)?{...e,cards:e.cards}:{...e}}return null}function I(a,e,t){a.push({path:e,message:t})}function Xe(a,e){if(a.cards!==void 0&&(y(a.body)||(a.body={}),a.body.cards===void 0?(a.body.cards=Array.isArray(a.cards)?[...a.cards]:a.cards,I(e,"cards","Moved legacy root cards to body.cards.")):I(e,"cards","Dropped legacy root cards because body.cards already exists."),delete a.cards),a.remember_state!==void 0&&(a.remember_expanded_state===void 0?(a.remember_expanded_state=a.remember_state,I(e,"remember_state","Renamed remember_state to remember_expanded_state.")):I(e,"remember_state","Removed remember_state because remember_expanded_state already exists."),delete a.remember_state),a.state_styles_entity!==void 0&&(a.entity===void 0?(a.entity=a.state_styles_entity,I(e,"state_styles_entity","Promoted state_styles_entity to root entity.")):I(e,"state_styles_entity","Removed state_styles_entity because root entity already exists."),delete a.state_styles_entity),a.debug!==void 0&&(delete a.debug,I(e,"debug","Removed deprecated debug config field.")),y(a.header)){let{header:t}=a;if(t.left!==void 0){if(a.header_left===void 0){let i=we(t.left);i&&(a.header_left=i,I(e,"header.left","Moved legacy header.left to root header_left."))}else I(e,"header.left","Dropped legacy header.left because header_left already exists.");delete t.left}if(t.right!==void 0){if(a.header_right===void 0){let i=we(t.right);i&&(a.header_right=i,I(e,"header.right","Moved legacy header.right to root header_right."))}else I(e,"header.right","Dropped legacy header.right because header_right already exists.");delete t.right}Object.keys(t).length===0&&delete a.header}if(y(a.carousel)){let{carousel:t}=a;a.carousel_autoplay===void 0&&typeof t.autoplay=="boolean"&&(a.carousel_autoplay=t.autoplay,I(e,"carousel.autoplay","Moved carousel.autoplay to root carousel_autoplay.")),a.carousel_interval===void 0&&typeof t.interval=="number"&&(a.carousel_interval=t.interval,I(e,"carousel.interval","Moved carousel.interval to root carousel_interval.")),["show_indicators","show_arrows","loop"].forEach(i=>{t[i]!==void 0&&I(e,`carousel.${i}`,`Removed legacy carousel.${i}; this option is no longer configurable.`)}),delete a.carousel}y(a.swipe)&&Object.entries({swipe_left:"left",swipe_right:"right",swipe_up:"up",swipe_down:"down"}).forEach(([i,r])=>{a.swipe[i]!==void 0&&(a.swipe[r]===void 0?(a.swipe[r]=a.swipe[i],I(e,`swipe.${i}`,`Renamed swipe.${i} to swipe.${r}.`)):I(e,`swipe.${i}`,`Removed swipe.${i} because swipe.${r} already exists.`),delete a.swipe[i])}),Array.isArray(a.badges)&&(a.badges=a.badges.map((t,i)=>{if(!y(t)||t.text===void 0)return t;let r={...t};return r.value===void 0?(r.value=r.text,I(e,`badges[${i}].text`,"Moved badges[].text to badges[].value.")):r.label===void 0?(r.label=r.text,I(e,`badges[${i}].text`,"Moved badges[].text to badges[].label because value already exists.")):I(e,`badges[${i}].text`,"Removed badges[].text because value/label already exist."),delete r.text,r}))}function We(a){return Number.isInteger(a.config_version)&&a.config_version>0?a.config_version:le}function Se(a){let e=Number.isInteger(a.config_version)&&a.config_version>0,t=We(a),i=D(a),r=[];return t<2&&Xe(i,r),i.config_version=N,{config:i,fromVersion:t,toVersion:N,changed:e&&t!==N||r.length>0,explicitVersion:e,changes:r}}var s=class extends Error{constructor(e,t){super(t?`${t}: ${e}`:e),this.name="ConfigValidationError",this.path=t}},K=class{static getCurrentConfigVersion(){return N}static migrate(e){if(!y(e))throw new s("Configuration must be an object");if(e.config_version!==void 0){if(!Number.isInteger(e.config_version)||e.config_version<1)throw new s("config_version must be a positive integer","config_version");if(e.config_version>N)throw new s(`config_version ${e.config_version} is newer than this runtime. Current supported version is ${N}.`,"config_version")}return Se(e)}static validate(e){this._validateCurrentConfig(e)}static _validateCurrentConfig(e){if(!y(e))throw new s("Configuration must be an object");if(e.config_version!==void 0){if(!Number.isInteger(e.config_version)||e.config_version<1)throw new s("config_version must be a positive integer","config_version");if(e.config_version<N)throw new s(`config_version ${e.config_version} is outdated. Migrate to version ${N} before strict validation.`,"config_version");if(e.config_version>N)throw new s(`config_version ${e.config_version} is newer than this runtime. Current supported version is ${N}.`,"config_version")}if(e.body_mode&&!J.includes(e.body_mode))throw new s(`Invalid body_mode: "${e.body_mode}". Valid modes: ${J.join(", ")}`,"body_mode");let t=Object.values(p);if(e.theme&&!t.includes(e.theme))throw new s(`Invalid theme: "${e.theme}". Valid themes: ${t.join(", ")}`,"theme");if(e.entity&&!W(e.entity))throw new s(`Invalid entity format: "${e.entity}"`,"entity");if(e.attribute!==void 0&&!B(e.attribute))throw new s("attribute must be a non-empty string","attribute");if(e.cards!==void 0)throw new s("Root-level cards were removed. Use body.cards instead.","cards");if(e.remember_state!==void 0)throw new s("remember_state was removed. Use remember_expanded_state instead.","remember_state");if(e.debug!==void 0)throw new s("debug was removed from the config contract. Use devtools instead.","debug");if(e.state_styles_entity!==void 0)throw new s("state_styles_entity was removed. Use root entity and optional attribute instead.","state_styles_entity");if(y(e.header)&&(e.header.left!==void 0||e.header.right!==void 0))throw new s("Legacy header.left/header.right were removed. Use root header_left/header_right sections.","header");if(e.carousel!==void 0)throw new s("Legacy carousel object was removed. Use root carousel_autoplay and carousel_interval fields.","carousel");if(e.expand_trigger!==void 0&&(typeof e.expand_trigger!="string"||!Q.includes(e.expand_trigger)))throw new s(`expand_trigger must be one of: ${Q.join(", ")}`,"expand_trigger");if(e.grid&&e.grid.columns!==void 0){let i=e.grid.columns;if(typeof i=="number"){if(i<u.MIN_GRID_COLUMNS||i>u.MAX_GRID_COLUMNS)throw new s("Grid columns must be between "+u.MIN_GRID_COLUMNS+" and "+u.MAX_GRID_COLUMNS,"grid.columns")}else if(typeof i!="string")throw new s("Grid columns must be a number or CSS template string","grid.columns")}if(e.lazy_initial_batch!==void 0){if(!v(e.lazy_initial_batch))throw new s("lazy_initial_batch must be a number","lazy_initial_batch");if(e.lazy_initial_batch<u.LAZY_MIN_BATCH||e.lazy_initial_batch>u.LAZY_MAX_BATCH)throw new s(`lazy_initial_batch must be between ${u.LAZY_MIN_BATCH} and ${u.LAZY_MAX_BATCH}`,"lazy_initial_batch")}if(e.lazy_batch_size!==void 0){if(!v(e.lazy_batch_size))throw new s("lazy_batch_size must be a number","lazy_batch_size");if(e.lazy_batch_size<u.LAZY_MIN_BATCH||e.lazy_batch_size>u.LAZY_MAX_BATCH)throw new s(`lazy_batch_size must be between ${u.LAZY_MIN_BATCH} and ${u.LAZY_MAX_BATCH}`,"lazy_batch_size")}if(e.lazy_idle_timeout!==void 0){if(!v(e.lazy_idle_timeout))throw new s("lazy_idle_timeout must be a number","lazy_idle_timeout");if(e.lazy_idle_timeout<u.LAZY_MIN_TIMEOUT_MS||e.lazy_idle_timeout>u.LAZY_MAX_TIMEOUT_MS)throw new s(`lazy_idle_timeout must be between ${u.LAZY_MIN_TIMEOUT_MS} and ${u.LAZY_MAX_TIMEOUT_MS}`,"lazy_idle_timeout")}if(e.auto_collapse_after!==void 0){if(!v(e.auto_collapse_after))throw new s("auto_collapse_after must be a number","auto_collapse_after");if(e.auto_collapse_after<0||e.auto_collapse_after>u.AUTO_COLLAPSE_MAX_SECONDS)throw new s(`auto_collapse_after must be between 0 and ${u.AUTO_COLLAPSE_MAX_SECONDS}`,"auto_collapse_after")}if(e.remember_expanded_state!==void 0&&typeof e.remember_expanded_state!="boolean")throw new s("remember_expanded_state must be a boolean","remember_expanded_state");if(e.remember_mode_state!==void 0&&typeof e.remember_mode_state!="boolean")throw new s("remember_mode_state must be a boolean","remember_mode_state");if(e.stability_mode!==void 0&&typeof e.stability_mode!="boolean")throw new s("stability_mode must be a boolean","stability_mode");if(e.carousel_autoplay!==void 0&&typeof e.carousel_autoplay!="boolean")throw new s("carousel_autoplay must be a boolean","carousel_autoplay");if(e.carousel_interval!==void 0){if(!v(e.carousel_interval))throw new s("carousel_interval must be a number","carousel_interval");if(e.carousel_interval<u.CAROUSEL_MIN_INTERVAL_MS||e.carousel_interval>u.CAROUSEL_MAX_INTERVAL_MS)throw new s(`carousel_interval must be between ${u.CAROUSEL_MIN_INTERVAL_MS} and ${u.CAROUSEL_MAX_INTERVAL_MS}`,"carousel_interval")}if(e.animation_duration!==void 0){if(!v(e.animation_duration))throw new s("animation_duration must be a number","animation_duration");if(e.animation_duration<0||e.animation_duration>u.ANIMATION_DURATION_MAX_MS)throw new s(`animation_duration must be between 0 and ${u.ANIMATION_DURATION_MAX_MS}`,"animation_duration")}if(e.expand_animation!==void 0&&(typeof e.expand_animation!="string"||!te.includes(e.expand_animation)))throw new s(`expand_animation must be one of: ${te.join(", ")}`,"expand_animation");if(e.collapse_animation!==void 0&&(typeof e.collapse_animation!="string"||!ie.includes(e.collapse_animation)))throw new s(`collapse_animation must be one of: ${ie.join(", ")}`,"collapse_animation");if(e.cards_animation!==void 0&&(typeof e.cards_animation!="string"||!re.includes(e.cards_animation)))throw new s(`cards_animation must be one of: ${re.join(", ")}`,"cards_animation");if(e.cards_stagger!==void 0){if(!v(e.cards_stagger))throw new s("cards_stagger must be a number","cards_stagger");if(e.cards_stagger<0||e.cards_stagger>u.CARDS_STAGGER_MAX_MS)throw new s(`cards_stagger must be between 0 and ${u.CARDS_STAGGER_MAX_MS}`,"cards_stagger")}if(e.cards_direction!==void 0&&(typeof e.cards_direction!="string"||!ne.includes(e.cards_direction)))throw new s(`cards_direction must be one of: ${ne.join(", ")}`,"cards_direction");if(e.enable_card_pool!==void 0&&typeof e.enable_card_pool!="boolean")throw new s("enable_card_pool must be a boolean","enable_card_pool");if(e.pool_scope!==void 0&&(typeof e.pool_scope!="string"||!ee.includes(e.pool_scope)))throw new s(`pool_scope must be one of: ${ee.join(", ")}`,"pool_scope");if(e.pool_ttl_ms!==void 0){if(!v(e.pool_ttl_ms))throw new s("pool_ttl_ms must be a number","pool_ttl_ms");if(e.pool_ttl_ms<u.POOL_MIN_TTL_MS||e.pool_ttl_ms>u.POOL_MAX_TTL_MS)throw new s(`pool_ttl_ms must be between ${u.POOL_MIN_TTL_MS} and ${u.POOL_MAX_TTL_MS}`,"pool_ttl_ms")}if(e.pool_max_entries!==void 0){if(!v(e.pool_max_entries))throw new s("pool_max_entries must be a number","pool_max_entries");if(e.pool_max_entries<u.POOL_MIN_MAX_ENTRIES||e.pool_max_entries>u.POOL_MAX_MAX_ENTRIES)throw new s(`pool_max_entries must be between ${u.POOL_MIN_MAX_ENTRIES} and ${u.POOL_MAX_MAX_ENTRIES}`,"pool_max_entries")}if(this._validateCardCollection(e.body?.cards,"body.cards",{maxCards:u.MAX_CARDS_PER_BODY}),this._validateCardCollection(e.header?.cards,"header.cards"),this._validateCardCollection(e.footer?.cards,"footer.cards"),this._validateCardCollection(e.header_left?.cards,"header_left.cards"),this._validateCardCollection(e.header_right?.cards,"header_right.cards"),e.tabs&&this._validateTabs(e.tabs),e.visibility&&this._validateConditions(e.visibility,"visibility"),e.section_visibility!==void 0){if(!y(e.section_visibility))throw new s("section_visibility must be an object with header/body/footer arrays","section_visibility");["header","body","footer"].forEach(i=>{let r=e.section_visibility[i];r!==void 0&&this._validateConditions(r,`section_visibility.${i}`)})}if(e.state_styles!==void 0){if(!e.entity)throw new s("state_styles requires root entity. Separate state_styles_entity is no longer supported.","state_styles");this._validateStateStyles(e.state_styles,"state_styles")}if(e.swipe!==void 0&&this._validateSwipeConfig(e.swipe,"swipe"),e.badges!==void 0&&this._validateBadges(e.badges,"badges"),e.theme_tokens!==void 0){if(!y(e.theme_tokens))throw new s("theme_tokens must be an object","theme_tokens");let i=/^--[a-z0-9_-]+$/i;Object.entries(e.theme_tokens).forEach(([r,n])=>{if(!i.test(r))throw new s(`Invalid CSS variable name "${r}"`,`theme_tokens.${r}`);if(typeof n!="string")throw new s("Theme token value must be a string",`theme_tokens.${r}`)})}return e.custom_css!==void 0&&this._validateCustomCSS(e.custom_css,"custom_css"),["tap_action","hold_action","double_tap_action"].forEach(i=>{e[i]&&this._validateAction(e[i],i)}),!0}static _validateCardConfig(e,t){if(!y(e))throw new s("Card config must be an object",t);if(!e.type)throw new s("Card must have a type",t)}static _validateCardCollection(e,t,i={}){if(e!==void 0){if(!Array.isArray(e))throw new s(`${t} must be an array`,t);if(i.maxCards&&e.length>i.maxCards)throw new s(`Maximum ${i.maxCards} cards allowed in ${t}`,t);e.forEach((r,n)=>{this._validateCardConfig(r,`${t}[${n}]`)})}}static _validateTabs(e){if(!Array.isArray(e))throw new s("tabs must be an array","tabs");if(e.length>u.MAX_TABS)throw new s(`Maximum ${u.MAX_TABS} tabs allowed`,"tabs");e.forEach((t,i)=>{if(!y(t))throw new s("Tab config must be an object",`tabs[${i}]`);if(t.cards&&!Array.isArray(t.cards))throw new s("Tab cards must be an array",`tabs[${i}].cards`)})}static _validateConditions(e,t){if(!Array.isArray(e))throw new s("Visibility must be an array",t);e.forEach((i,r)=>{let n=`${t}[${r}]`;if(!y(i))throw new s("Condition must be an object",n);let o=i.condition;if(!o)throw new s('Condition must have a "condition" type',n);if(!pe.includes(o))throw new s(`Invalid condition type: "${o}"`,n);switch(o){case m.STATE:this._validateStateCondition(i,n);break;case m.NUMERIC_STATE:this._validateNumericStateCondition(i,n);break;case m.USER:this._validateUserCondition(i,n);break;case m.TIME:this._validateTimeCondition(i,n);break;case m.SCREEN:this._validateScreenCondition(i,n);break;case m.AND:case m.OR:case m.NOT:this._validateConditionGroup(i,n);break}})}static _validateConditionEntity(e,t){if(!B(e.entity))throw new s("Condition entity must be a non-empty string",`${t}.entity`);if(!W(e.entity))throw new s(`Invalid entity format: "${e.entity}"`,`${t}.entity`);if(e.attribute!==void 0&&!B(e.attribute))throw new s("Condition attribute must be a non-empty string",`${t}.attribute`)}static _validateStateCondition(e,t){if(this._validateConditionEntity(e,t),e.state===void 0&&e.state_not===void 0)throw new s('state condition requires "state" or "state_not"',t);if(e.state!==void 0&&e.state_not!==void 0)throw new s('state condition cannot define both "state" and "state_not"',t);e.state!==void 0&&this._validateStringOrStringArray(e.state,`${t}.state`,"state"),e.state_not!==void 0&&this._validateStringOrStringArray(e.state_not,`${t}.state_not`,"state_not")}static _validateNumericStateCondition(e,t){if(this._validateConditionEntity(e,t),e.above===void 0&&e.below===void 0)throw new s('numeric_state condition requires "above" or "below"',t);if(e.above!==void 0&&!v(e.above))throw new s("numeric_state.above must be a number",`${t}.above`);if(e.below!==void 0&&!v(e.below))throw new s("numeric_state.below must be a number",`${t}.below`);if(v(e.above)&&v(e.below)&&e.above>=e.below)throw new s("numeric_state.above must be lower than numeric_state.below",t)}static _validateUserCondition(e,t){if(e.users===void 0&&e.is_admin===void 0&&e.is_owner===void 0)throw new s("user condition requires users, is_admin, or is_owner",t);if(e.users!==void 0&&this._validateStringArray(e.users,`${t}.users`,"users"),e.is_admin!==void 0&&typeof e.is_admin!="boolean")throw new s("user.is_admin must be a boolean",`${t}.is_admin`);if(e.is_owner!==void 0&&typeof e.is_owner!="boolean")throw new s("user.is_owner must be a boolean",`${t}.is_owner`)}static _validateTimeCondition(e,t){if(e.after===void 0&&e.before===void 0&&e.weekday===void 0)throw new s("time condition requires after, before, or weekday",t);if(e.after!==void 0&&!this._isValidTimeString(e.after))throw new s("time.after must be in HH:MM format",`${t}.after`);if(e.before!==void 0&&!this._isValidTimeString(e.before))throw new s("time.before must be in HH:MM format",`${t}.before`);if(e.weekday!==void 0){if(!Array.isArray(e.weekday))throw new s("time.weekday must be an array",`${t}.weekday`);e.weekday.forEach((i,r)=>{if(typeof i!="string"||!G.includes(i))throw new s(`Invalid weekday: "${String(i)}"`,`${t}.weekday[${r}]`)})}}static _validateScreenCondition(e,t){if(e.media_query===void 0&&e.min_width===void 0&&e.max_width===void 0)throw new s("screen condition requires media_query, min_width, or max_width",t);if(e.media_query!==void 0&&!B(e.media_query))throw new s("screen.media_query must be a non-empty string",`${t}.media_query`);if(e.min_width!==void 0&&!v(e.min_width))throw new s("screen.min_width must be a number",`${t}.min_width`);if(e.max_width!==void 0&&!v(e.max_width))throw new s("screen.max_width must be a number",`${t}.max_width`);if(v(e.min_width)&&v(e.max_width)&&e.min_width>e.max_width)throw new s("screen.min_width must be lower than or equal to screen.max_width",t)}static _validateConditionGroup(e,t){if(!Array.isArray(e.conditions)||e.conditions.length===0)throw new s('Logical conditions require a non-empty "conditions" array',`${t}.conditions`);this._validateConditions(e.conditions,`${t}.conditions`)}static _validateStringOrStringArray(e,t,i){if(typeof e=="string"){if(!e.trim())throw new s(`${i} must not be empty`,t);return}if(!Array.isArray(e)||e.length===0)throw new s(`${i} must be a string or non-empty array of strings`,t);e.forEach((r,n)=>{if(typeof r!="string"||!r.trim())throw new s(`${i} items must be non-empty strings`,`${t}[${n}]`)})}static _validateStringArray(e,t,i){if(!Array.isArray(e)||e.length===0)throw new s(`${i} must be a non-empty array of strings`,t);e.forEach((r,n)=>{if(typeof r!="string"||!r.trim())throw new s(`${i} items must be non-empty strings`,`${t}[${n}]`)})}static _validateStateStyles(e,t){if(!y(e))throw new s("state_styles must be an object map",t);Object.entries(e).forEach(([i,r],n)=>{let o=`${t}.${i||n}`;if(!i||!i.trim())throw new s("state_styles keys must be non-empty strings",o);if(!y(r))throw new s("state_styles entries must be objects",o);Object.entries(r).forEach(([d,l])=>{if(d==="class"){if(typeof l!="string"&&(!Array.isArray(l)||l.some(c=>typeof c!="string"||!c.trim())))throw new s("state_styles.class must be a string or array of strings",`${o}.class`);return}if(typeof l!="string"&&!v(l))throw new s(`state_styles.${d} must be a string or number`,`${o}.${d}`)})})}static _validateSwipeConfig(e,t){if(!y(e))throw new s("swipe must be an object",t);if(e.swipe_left!==void 0||e.swipe_right!==void 0||e.swipe_up!==void 0||e.swipe_down!==void 0)throw new s("Legacy swipe.swipe_left/swipe_right/swipe_up/swipe_down keys were removed. Use swipe.left/right/up/down.",t);if(e.enabled!==void 0&&typeof e.enabled!="boolean")throw new s("swipe.enabled must be a boolean",`${t}.enabled`);if(e.direction!==void 0&&(typeof e.direction!="string"||!oe.includes(e.direction)))throw new s(`swipe.direction must be one of: ${oe.join(", ")}`,`${t}.direction`);if(e.threshold!==void 0){if(!v(e.threshold))throw new s("swipe.threshold must be a number",`${t}.threshold`);if(e.threshold<0||e.threshold>u.SWIPE_MAX_THRESHOLD_PX)throw new s(`swipe.threshold must be between 0 and ${u.SWIPE_MAX_THRESHOLD_PX}`,`${t}.threshold`)}if(e.velocityThreshold!==void 0){if(!v(e.velocityThreshold))throw new s("swipe.velocityThreshold must be a number",`${t}.velocityThreshold`);if(e.velocityThreshold<0||e.velocityThreshold>u.SWIPE_MAX_VELOCITY_THRESHOLD)throw new s(`swipe.velocityThreshold must be between 0 and ${u.SWIPE_MAX_VELOCITY_THRESHOLD}`,`${t}.velocityThreshold`)}if(e.preventScroll!==void 0&&typeof e.preventScroll!="boolean")throw new s("swipe.preventScroll must be a boolean",`${t}.preventScroll`);["left","right","up","down"].forEach(i=>{e[i]!==void 0&&this._validateSwipeActionConfig(e[i],`${t}.${i}`)})}static _validateSwipeActionConfig(e,t){if(!y(e))throw new s("Swipe action must be an object",t);if(e.action===void 0)throw new s('Swipe action requires an "action" field',`${t}.action`);if(typeof e.action!="string"||!ae.includes(e.action))throw new s(`Swipe action must be one of: ${ae.join(", ")}`,`${t}.action`)}static _validateBadges(e,t){if(!Array.isArray(e))throw new s("badges must be an array",t);e.forEach((i,r)=>{let n=`${t}[${r}]`;if(!y(i))throw new s("Badge must be an object",n);if(i.text!==void 0)throw new s("badges[].text was removed. Use badges[].value or badges[].label instead.",`${n}.text`);let o=i.type||T.STATE;if(typeof o!="string"||!se.includes(o))throw new s(`Badge type must be one of: ${se.join(", ")}`,`${n}.type`);let d=typeof i.entity=="string"?i.entity.trim():i.entity;if(d!==void 0&&!W(d))throw new s(`Invalid entity format: "${i.entity}"`,`${n}.entity`);if(i.attribute!==void 0&&!B(i.attribute))throw new s("Badge attribute must be a non-empty string",`${n}.attribute`);if(["icon","color","label","unit","domain"].forEach(l=>{if(i[l]!==void 0&&typeof i[l]!="string")throw new s(`Badge ${l} must be a string`,`${n}.${l}`)}),i.value!==void 0&&typeof i.value!="string"&&!v(i.value))throw new s("Badge value must be a string or number",`${n}.value`);if(["min","max"].forEach(l=>{if(i[l]!==void 0&&!v(i[l]))throw new s(`Badge ${l} must be a number`,`${n}.${l}`)}),v(i.min)&&v(i.max)&&i.min>=i.max)throw new s("Badge min must be lower than max",n);if(["show_name","show_progress"].forEach(l=>{if(i[l]!==void 0&&typeof i[l]!="boolean")throw new s(`Badge ${l} must be a boolean`,`${n}.${l}`)}),i.precision!==void 0){if(!Number.isInteger(i.precision))throw new s("Badge precision must be an integer",`${n}.precision`);if(i.precision<0||i.precision>u.BADGE_MAX_PRECISION)throw new s(`Badge precision must be between 0 and ${u.BADGE_MAX_PRECISION}`,`${n}.precision`)}if(i.format!==void 0&&(typeof i.format!="string"||!de.includes(i.format)))throw new s(`Badge format must be one of: ${de.join(", ")}`,`${n}.format`);if(i.entities!==void 0){if(!Array.isArray(i.entities)||i.entities.length===0)throw new s("Badge entities must be a non-empty array",`${n}.entities`);let l=i.entities.map(c=>typeof c=="string"?c.trim():c).filter(c=>c!=="");if(l.length===0)throw new s("Badge entities must contain at least one valid entity ID",`${n}.entities`);l.forEach((c,h)=>{if(!W(c))throw new s(`Invalid entity format: "${c}"`,`${n}.entities[${h}]`)})}if(i.state!==void 0&&typeof i.state!="string")throw new s("Badge state must be a string",`${n}.state`);if(i.count_state!==void 0&&typeof i.count_state!="string")throw new s("Badge count_state must be a string",`${n}.count_state`);switch(i.thresholds!==void 0&&this._validateBadgeThresholds(i.thresholds,`${n}.thresholds`),i.tap_action!==void 0&&this._validateAction(i.tap_action,`${n}.tap_action`),o){case T.STATE:if(!i.entity&&i.value===void 0)throw new s("State badges require entity or static value",n);break;case T.ATTRIBUTE:if(!i.entity)throw new s("Attribute badges require entity",`${n}.entity`);if(!i.attribute)throw new s("Attribute badges require attribute",`${n}.attribute`);break;case T.COUNTER:if(!i.domain&&!i.entities)throw new s("Counter badges require domain or entities",n);break;case T.CUSTOM:if(i.value===void 0)throw new s("Custom badges require value",`${n}.value`);break}})}static _validateBadgeThresholds(e,t){if(!Array.isArray(e))throw new s("Badge thresholds must be an array",t);e.forEach((i,r)=>{let n=`${t}[${r}]`;if(!y(i))throw new s("Badge threshold must be an object",n);if(!v(i.value))throw new s("Badge threshold value must be a number",`${n}.value`);if(!B(i.color))throw new s("Badge threshold color must be a non-empty string",`${n}.color`)})}static _isValidTimeString(e){if(typeof e!="string")return!1;let t=e.match(/^(\d{2}):(\d{2})$/);if(!t)return!1;let i=Number(t[1]),r=Number(t[2]);return i>=0&&i<=23&&r>=0&&r<=59}static _validateAction(e,t){if(!y(e))throw new s("Action must be an object",t);let i=Object.values(_);if(e.action&&!i.includes(e.action))throw new s(`Invalid action: "${e.action}"`,t);if(e.action===_.CALL_SERVICE&&!e.service)throw new s('call-service action requires a "service" property',t);if(e.action===_.NAVIGATE&&!e.navigation_path)throw new s('navigate action requires a "navigation_path" property',t);if(e.action===_.URL&&!e.url_path)throw new s('url action requires a "url_path" property',t)}static normalize(e){e=this.migrate(e).config,this._validateCurrentConfig(e);let t={...b,...e};if(t.config_version=N,t.card_id||(t.card_id=ve("uc")),t.header=this._normalizeSection(e.header,"header"),e.header_left&&(t.header_left=this._normalizeSection(e.header_left,"header_left")),e.header_right&&(t.header_right=this._normalizeSection(e.header_right,"header_right")),e.body?t.body=this._normalizeSection(e.body,"body"):t.body={cards:[]},e.footer&&(t.footer=this._normalizeSection(e.footer,"footer")),e.tabs&&(t.tabs=e.tabs.map((i,r)=>({label:i.label||`Tab ${r+1}`,icon:i.icon||null,cards:i.cards||[],...i}))),t.grid=this._normalizeGrid(e.grid),t.tap_action=this._normalizeAction(e.tap_action,"none"),t.hold_action=this._normalizeAction(e.hold_action,"none"),t.double_tap_action=this._normalizeAction(e.double_tap_action,"none"),e.visibility&&(t.visibility=e.visibility.map(i=>this._normalizeCondition(i))),t.section_visibility=this._normalizeSectionVisibility(e.section_visibility),e.attribute!==void 0){let i=e.attribute.trim();i?t.attribute=i:delete t.attribute}return t.state_styles=this._normalizeStateStyles(e.state_styles),t.swipe=this._normalizeSwipe(e.swipe),t.badges=this._normalizeBadges(e.badges),t.theme_tokens=this._normalizeThemeTokens(e.theme_tokens),t.stability_mode&&(t.animation=!1,t.expand_animation="none",t.collapse_animation="none",t.cards_animation="none",t.cards_stagger=0,t.animation_duration=0,t.enable_card_pool=!1,t.carousel_autoplay=!1),t}static _normalizeSection(e,t){return e?{cards:e.cards||[],...e}:{cards:[]}}static _normalizeGrid(e){return e?{columns:e.columns||b.grid_columns,gap:e.gap||b.grid_gap,responsive:e.responsive||null}:{columns:b.grid_columns,gap:b.grid_gap}}static _normalizeAction(e,t="none"){return e?{action:e.action||t,...e}:{action:t}}static _normalizeCondition(e){let t={condition:e.condition,...e};return typeof t.entity=="string"&&(t.entity=t.entity.trim()),typeof t.attribute=="string"&&(t.attribute=t.attribute.trim()),e.condition===m.STATE&&(e.state!==void 0&&(t.state=this._normalizeStringListValue(e.state)),e.state_not!==void 0&&(t.state_not=this._normalizeStringListValue(e.state_not))),e.condition===m.USER&&Array.isArray(e.users)&&(t.users=e.users.map(i=>typeof i=="string"?i.trim():"").filter(Boolean)),e.condition===m.TIME&&Array.isArray(e.weekday)&&(t.weekday=e.weekday.map(i=>typeof i=="string"?i.trim():"").filter(i=>G.includes(i))),[m.AND,m.OR,m.NOT].includes(e.condition)&&Array.isArray(e.conditions)&&(t.conditions=e.conditions.map(i=>this._normalizeCondition(i))),t}static _normalizeSectionVisibility(e){let t=y(e)?e:{},i=r=>Array.isArray(r)?r.map(n=>this._normalizeCondition(n)):[];return{header:i(t.header),body:i(t.body),footer:i(t.footer)}}static _normalizeThemeTokens(e){if(!y(e))return{};let t={},i=/^--[a-z0-9_-]+$/i;return Object.entries(e).forEach(([r,n])=>{if(!i.test(r)||typeof n!="string")return;let o=n.trim();o&&(t[r]=o)}),t}static _normalizeStateStyles(e){if(!y(e))return{};let t={};return Object.entries(e).forEach(([i,r])=>{let n=typeof i=="string"?i.trim():"";if(!n||!y(r))return;let o={};Object.entries(r).forEach(([d,l])=>{if(d==="class"){if(Array.isArray(l)){let c=l.map(h=>typeof h=="string"?h.trim():"").filter(Boolean);c.length>0&&(o.class=c);return}typeof l=="string"&&l.trim()&&(o.class=l.trim());return}if(typeof l=="string"){let c=l.trim();c&&(o[d]=c);return}v(l)&&(o[d]=l)}),Object.keys(o).length>0&&(t[n]=o)}),t}static _normalizeSwipe(e){if(!y(e))return{enabled:b.swipe_enabled,direction:b.swipe_direction,threshold:b.swipe_threshold,velocityThreshold:b.swipe_velocity_threshold,preventScroll:b.swipe_prevent_scroll};let t={enabled:e.enabled??b.swipe_enabled,direction:e.direction||b.swipe_direction,threshold:e.threshold??b.swipe_threshold,velocityThreshold:e.velocityThreshold??b.swipe_velocity_threshold,preventScroll:e.preventScroll??b.swipe_prevent_scroll};return["left","right","up","down"].forEach(i=>{!y(e[i])||!e[i].action||e[i].action==="none"||(t[i]={action:e[i].action})}),t}static _normalizeBadges(e){return Array.isArray(e)?e.filter(t=>y(t)).map(t=>{let i={...t,type:t.type||T.STATE};if(["entity","attribute","icon","color","label","unit","domain","state","count_state"].forEach(r=>{if(typeof i[r]=="string"){let n=i[r].trim();n?i[r]=n:delete i[r]}}),typeof i.value=="string"){let r=i.value.trim();r?i.value=r:delete i.value}return Array.isArray(i.entities)&&(i.entities=[...new Set(i.entities.map(r=>typeof r=="string"?r.trim():"").filter(Boolean))],i.entities.length===0&&delete i.entities),Array.isArray(i.thresholds)&&(i.thresholds=i.thresholds.filter(r=>y(r)&&v(r.value)&&typeof r.color=="string"&&r.color.trim()).map(r=>({value:r.value,color:r.color.trim()})),i.thresholds.length===0&&delete i.thresholds),i}):[]}static _normalizeStringListValue(e){if(typeof e=="string")return e.trim()||void 0;if(!Array.isArray(e))return;let t=e.map(i=>typeof i=="string"?i.trim():"").filter(Boolean);if(t.length!==0)return t.length===1?t[0]:t}static getTitle(e,t){return e.title?e.title:e.entity&&t?.states?.[e.entity]?t.states[e.entity].attributes.friendly_name||e.entity:""}static getSubtitle(e,t){return e.subtitle?e.subtitle:e.entity&&t?.states?.[e.entity]?t.states[e.entity].state:""}static hasChanged(e,t){return JSON.stringify(e)!==JSON.stringify(t)}static getSchema(){let e={type:"object",properties:{action:{type:"string",enum:Object.values(_),default:_.NONE},service:{type:"string"},navigation_path:{type:"string"},url_path:{type:"string"}}},t={type:"object",properties:{action:{type:"string",enum:ae,default:"none"}}},r={type:"array",items:{type:"object",properties:{type:{type:"string"}}}},n={type:"object",properties:{cards:r}},o={type:"object",properties:{condition:{type:"string",enum:pe},entity:{type:"string",description:"Entity referenced by state-based visibility conditions."},attribute:{type:"string",description:"Optional entity attribute used instead of the primary state."},state:{type:["string","array"],description:"Allowed state or list of allowed states.",items:{type:"string"}},state_not:{type:["string","array"],description:"Blocked state or list of blocked states.",items:{type:"string"}},above:{type:"number",description:"Numeric lower bound (exclusive)."},below:{type:"number",description:"Numeric upper bound (exclusive)."},users:{type:"array",description:"Allowed user names or ids.",items:{type:"string"}},is_admin:{type:"boolean",description:"Require current user to be an admin."},is_owner:{type:"boolean",description:"Require current user to be the owner."},after:{type:"string",description:"Show only after the given HH:MM time."},before:{type:"string",description:"Show only before the given HH:MM time."},weekday:{type:"array",description:"Allowed weekdays.",items:{type:"string",enum:G}},media_query:{type:"string",description:"CSS media query matched against the current viewport."},min_width:{type:"number",description:"Minimum viewport width in pixels."},max_width:{type:"number",description:"Maximum viewport width in pixels."}}};o.properties.conditions={type:"array",description:"Nested logical conditions for and/or/not groups.",items:o};let d={type:"object",properties:{background:{type:["string","number"]},color:{type:["string","number"]},border:{type:["string","number"]},class:{type:["string","array"],items:{type:"string"}}}},l={type:"object",properties:{value:{type:"number"},color:{type:"string"}}},c={type:"object",properties:{type:{type:"string",enum:se,default:T.STATE},entity:{type:"string"},attribute:{type:"string"},icon:{type:"string"},color:{type:"string"},value:{type:["string","number"]},label:{type:"string"},unit:{type:"string"},min:{type:"number"},max:{type:"number"},show_name:{type:"boolean",default:!1},show_progress:{type:"boolean",default:!1},precision:{type:"number",minimum:0,maximum:u.BADGE_MAX_PRECISION},format:{type:"string",enum:de,default:P.NONE},entities:{type:"array",items:{type:"string"}},domain:{type:"string"},state:{type:"string"},count_state:{type:"string"},thresholds:{type:"array",items:l},tap_action:e}},h={type:"object",properties:{enabled:{type:"boolean",default:b.swipe_enabled},direction:{type:"string",enum:oe,default:b.swipe_direction},threshold:{type:"number",minimum:0,maximum:u.SWIPE_MAX_THRESHOLD_PX,default:b.swipe_threshold},velocityThreshold:{type:"number",minimum:0,maximum:u.SWIPE_MAX_VELOCITY_THRESHOLD,default:b.swipe_velocity_threshold},preventScroll:{type:"boolean",default:b.swipe_prevent_scroll},left:t,right:t,up:t,down:t}};return{type:"object",properties:{config_version:{type:"number",minimum:le,maximum:N,default:N,description:"Config contract version. Legacy configs are migrated to the current version during normalize()."},card_id:{type:"string",description:"Stable identifier for cross-card control and persisted mode state."},title:{type:"string",description:"Primary card title."},subtitle:{type:"string",description:"Optional secondary title shown in the header."},icon:{type:"string",description:"Header icon in mdi format."},entity:{type:"string",description:"Primary Home Assistant entity bound to the card."},attribute:{type:"string",description:"Optional root attribute used by state_styles and other state-aware features."},body_mode:{type:"string",enum:J,default:x.EXPAND,description:"Presentation mode used for the body region."},expand_trigger:{type:"string",enum:Q,default:b.expand_trigger,description:"Header gesture that toggles body expansion by default."},theme:{type:"string",enum:Object.values(p),default:b.theme,description:"Theme preset applied to the card shell."},padding:{type:"string",default:b.padding,description:"Internal card padding."},border_radius:{type:"string",default:b.border_radius,description:"Border radius applied to the card shell."},expanded:{type:"boolean",default:!1,description:"Whether the card starts expanded."},animation:{type:"boolean",default:!0,description:"Master switch for card animations."},animation_duration:{type:"number",minimum:0,maximum:u.ANIMATION_DURATION_MAX_MS,default:b.animation_duration,description:"Base animation duration applied to body and nested cards."},expand_animation:{type:"string",enum:te,default:b.expand_animation,description:"Body expand animation variant."},collapse_animation:{type:"string",enum:ie,default:b.collapse_animation,description:"Body collapse animation variant."},cards_animation:{type:"string",enum:re,default:b.cards_animation,description:"Nested card reveal animation variant."},cards_stagger:{type:"number",minimum:0,maximum:u.CARDS_STAGGER_MAX_MS,default:b.cards_stagger,description:"Delay between nested card reveal steps in milliseconds."},cards_direction:{type:"string",enum:ne,default:b.cards_direction,description:"Ordering strategy for nested card reveal."},stability_mode:{type:"boolean",default:!1,description:"Disables high-risk effects for predictable rendering."},lazy_load:{type:"boolean",default:!0,description:"Enables progressive body card loading."},lazy_initial_batch:{type:"number",minimum:u.LAZY_MIN_BATCH,maximum:u.LAZY_MAX_BATCH,default:b.lazy_initial_batch,description:"Initial number of cards to load before idle batching."},lazy_batch_size:{type:"number",minimum:u.LAZY_MIN_BATCH,maximum:u.LAZY_MAX_BATCH,default:b.lazy_batch_size,description:"Number of cards added on each idle lazy-load pass."},lazy_idle_timeout:{type:"number",minimum:u.LAZY_MIN_TIMEOUT_MS,maximum:u.LAZY_MAX_TIMEOUT_MS,default:b.lazy_idle_timeout,description:"Idle callback timeout used for deferred body work."},auto_collapse_after:{type:"number",minimum:0,maximum:u.AUTO_COLLAPSE_MAX_SECONDS,default:b.auto_collapse_after,description:"Automatically collapse the card after N seconds. Set 0 to disable."},remember_expanded_state:{type:"boolean",default:b.remember_expanded_state,description:"Persist expanded/collapsed state across renders."},remember_mode_state:{type:"boolean",default:b.remember_mode_state,description:"Persist active tab and slide indices across renders."},enable_card_pool:{type:"boolean",default:b.enable_card_pool,description:"Reuse detached body card elements to reduce churn."},pool_scope:{type:"string",enum:ee,default:b.pool_scope,description:"Reuse scope for pooled body card elements."},pool_ttl_ms:{type:"number",minimum:u.POOL_MIN_TTL_MS,maximum:u.POOL_MAX_TTL_MS,default:b.pool_ttl_ms,description:"Time-to-live for pooled body card instances."},pool_max_entries:{type:"number",minimum:u.POOL_MIN_MAX_ENTRIES,maximum:u.POOL_MAX_MAX_ENTRIES,default:b.pool_max_entries,description:"Maximum pooled entries retained for a reuse scope."},show_expand_icon:{type:"boolean",default:b.show_expand_icon,description:"Show the expand/collapse affordance in the header."},expand_icon:{type:"string",default:b.expand_icon,description:"Icon used for the expand affordance."},sticky_header:{type:"boolean",default:!1,description:"Keep the header pinned while the body scrolls."},grid:{type:"object",properties:{columns:{type:["number","string"],minimum:u.MIN_GRID_COLUMNS,maximum:u.MAX_GRID_COLUMNS,default:b.grid_columns,description:"Column count or CSS grid-template-columns string."},gap:{type:"string",default:b.grid_gap,description:"Gap between grid items."}}},header:{...n,description:"Header region configuration."},header_left:{...n,description:"Cards rendered in the left header slot."},header_right:{...n,description:"Cards rendered in the right header slot."},body:{...n,description:"Body region configuration."},footer:{...n,description:"Footer region configuration."},tabs:{type:"array",description:"Tab definitions used by tabs body mode.",items:{type:"object",properties:{label:{type:"string"},icon:{type:"string"},cards:r}}},carousel_autoplay:{type:"boolean",default:b.carousel_autoplay,description:"Automatically advance slides in carousel mode."},carousel_interval:{type:"number",minimum:u.CAROUSEL_MIN_INTERVAL_MS,maximum:u.CAROUSEL_MAX_INTERVAL_MS,default:b.carousel_interval,description:"Delay between autoplay slide changes in carousel mode."},tap_action:{...e,description:"Action executed on tap."},hold_action:{...e,description:"Action executed on hold."},double_tap_action:{...e,description:"Action executed on double tap."},visibility:{type:"array",description:"Top-level card visibility conditions.",items:o},section_visibility:{type:"object",description:"Per-section visibility conditions for header/body/footer.",properties:{header:{type:"array",items:o},body:{type:"array",items:o},footer:{type:"array",items:o}}},swipe:{...h,description:"Gesture handling for top-level card swipes."},badges:{type:"array",description:"Header badge definitions.",items:c},state_styles:{type:"object",description:"Map of states or numeric matchers to style overrides applied to the card shell.",additionalProperties:d},theme_tokens:{type:"object",description:"CSS variable overrides applied after theme resolution.",additionalProperties:{type:"string"}},custom_css:{type:["string","object","array"],description:"Scoped custom CSS definitions."}}}}static _validateCustomCSS(e,t){if(typeof e=="string")return;if(Array.isArray(e)){e.forEach((n,o)=>{this._validateCustomCSS(n,`${t}[${o}]`)});return}if(!y(e))throw new s("custom_css must be a string, object, or array",t);if(["css","scope","mode","priority","id"].some(n=>n in e)){if(e.css!==void 0&&typeof e.css!="string")throw new s("custom_css.css must be a string",`${t}.css`);if(e.scope!==void 0&&typeof e.scope!="string")throw new s("custom_css.scope must be a string",`${t}.scope`);return}Object.entries(e).forEach(([n,o])=>{if(typeof o!="string")throw new s("custom_css scoped values must be strings",`${t}.${n}`)})}};var Ce=Object.freeze({default:"background: var(--ha-card-background, #fff); color: var(--primary-text-color, #333);",transparent:"background: transparent; color: var(--primary-text-color, #fff); border: 1px dashed rgba(255,255,255,0.3);",solid:"background: #1a1a1a; color: #e0e0e0;",glass:"background: rgba(30,30,30,0.55); backdrop-filter: blur(8px); color: #f0f0f0; border: 1px solid rgba(255,255,255,0.08);",glassmorphism:"background: rgba(30,30,30,0.7); backdrop-filter: blur(12px) saturate(180%); color: #f7f7f7; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 8px 32px rgba(0,0,0,0.3);",neumorphism:"background: #1e1e1e; color: #d9d9d9; box-shadow: 6px 6px 12px rgba(0,0,0,0.5), -6px -6px 12px rgba(255,255,255,0.03);",minimal:"background: transparent; color: var(--primary-text-color, #fff); border: 1px solid rgba(255,255,255,0.1);",gradient:"background: linear-gradient(135deg, #1a1a2e, #16213e); color: #fff;",dark:"background: #121212; color: #fff; border: 1px solid rgba(255,255,255,0.08);",neon:"background: rgba(0,0,0,0.9); color: #00ff88; border: 1px solid #00ff88; box-shadow: 0 0 10px rgba(0,255,136,0.5);",aurora:"background: linear-gradient(135deg, rgba(0,212,170,0.15), rgba(124,58,237,0.15), rgba(14,165,233,0.15)), #0a0a0f; color: #fff;",carbon:"background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.02) 1px, rgba(255,255,255,0.02) 2px), #0d0d0d; color: #c0c0c0;",slate:"background: #1e293b; color: #f1f5f9;",obsidian:"background: #0f0f0f; color: #d4d4d4;",charcoal:"background: #1f1f1f; color: #e5e5e5;",midnight:"background: #0f172a; color: #e2e8f0;",cyber:"background: #0a0a0a; color: #00d4ff; border: 1px solid #00d4ff;",void:"background: #000; color: #a0a0a0;",ember:"background: linear-gradient(135deg, #1a0a0a, #0a0505); color: #ffcccc;",forest:"background: linear-gradient(135deg, #0a1a0a, #050a05); color: #bbffcc;",ocean:"background: linear-gradient(135deg, #0a0f1a, #050810); color: #bae6fd;","purple-haze":"background: linear-gradient(135deg, #120a1a, #0a050f); color: #e9d5ff;",matrix:"background: #000500; color: #00ff00;",graphite:"background: #252525; color: #d0d0d0;",smoke:"background: rgba(40,40,40,0.85); color: #ccc; backdrop-filter: blur(8px);",nord:"background: #2e3440; color: #eceff4;",dracula:"background: #282a36; color: #f8f8f2;",monokai:"background: #272822; color: #f8f8f2;","tokyo-night":"background: #1a1b26; color: #c0caf5;",catppuccin:"background: #1e1e2e; color: #cdd6f4;"});function Ae(a="default"){return Ce[a]||Ce.default}var S=Object.freeze({STRING:"string",NUMBER:"number",BOOLEAN:"boolean",ENTITY:"entity",ICON:"icon",COLOR:"color",SELECT:"select",OBJECT:"object",ARRAY:"array",TEMPLATE:"template",ACTION:"action"});function qe(a){let e=[...new Set(a)];return e.length===1?e[0]:e}function Ze(a,e){if(a==="entity")return S.ENTITY;if(a==="icon"||a.endsWith("_icon"))return S.ICON;if(a.includes("color"))return S.COLOR;switch(e){case"number":case"integer":return S.NUMBER;case"boolean":return S.BOOLEAN;case"array":return S.ARRAY;case"object":return a.endsWith("_action")?S.ACTION:S.OBJECT;case"string":default:return S.STRING}}function ce(a,e,t=new WeakMap){let i=t.get(e);if(i)return i;let r=Array.isArray(e.type)?e.type:[e.type||"string"],o={type:e.enum?S.SELECT:qe(r.map(d=>Ze(a,d))),description:e.description,default:e.default};if(t.set(e,o),e.enum&&(o.options=[...e.enum]),typeof e.minimum=="number"&&(o.min=e.minimum),typeof e.maximum=="number"&&(o.max=e.maximum),e.properties){let d=new Set(e.required||[]);o.properties=Object.fromEntries(Object.entries(e.properties).map(([l,c])=>{let h=ce(l,c,t);return h.required=d.has(l),[l,h]}))}return e.items&&(o.items=ce(`${a}_item`,e.items,t)),e.additionalProperties&&(o.additionalProperties=e.additionalProperties===!0?!0:ce(`${a}_value`,e.additionalProperties,t)),o}function Je(){let a=K.getSchema(),e=a.properties||{},t=new Set(a.required||[]);return Object.fromEntries(Object.entries(e).map(([i,r])=>{let n=ce(i,r);return n.required=t.has(i),[i,n]}))}function Qe(a){return a.replace(/\[\d+\]/g,"").split(".").map(e=>e.trim()).filter(Boolean)}function he(a,e){let t=Qe(e);if(t.length===0)return null;let i=a,r=null;for(let n of t){if(!i||!i[n])return null;if(r=i[n],r.properties){i=r.properties;continue}if(r.items?.properties){i=r.items.properties;continue}i=null}return r}var me=Je();var et={title:{label:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",placeholder:"\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438"},subtitle:{label:"\u041F\u043E\u0434\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",placeholder:"\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442"},icon:{label:"\u0418\u043A\u043E\u043D\u043A\u0430",placeholder:"mdi:home",helper:"\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u043D\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043A\u043E\u043D\u043A\u0443."},entity:{label:"Entity (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)",placeholder:"light.room"},attribute:{label:"Attribute",placeholder:"brightness",helper:"\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0434\u043B\u044F state_styles \u0438 state-aware \u0443\u0441\u043B\u043E\u0432\u0438\u0439 \u0432\u043C\u0435\u0441\u0442\u043E \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0433\u043E state."},body_mode:{label:"\u0420\u0435\u0436\u0438\u043C body",optionLabels:{[x.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 (expand)",[x.MODAL]:"\u041C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u043D\u043E (modal)",[x.FULLSCREEN]:"\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u044B\u0439 (fullscreen)",[x.TABS]:"\u0412\u043A\u043B\u0430\u0434\u043A\u0438 (tabs)",[x.CAROUSEL]:"\u041A\u0430\u0440\u0443\u0441\u0435\u043B\u044C (carousel)",[x.SUBVIEW]:"Subview",[x.NONE]:"\u0422\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A (none)"}},expanded:{label:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0430 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E"},show_expand_icon:{label:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043A\u043E\u043D\u043A\u0443 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F"},expand_icon:{label:"\u0418\u043A\u043E\u043D\u043A\u0430 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F",placeholder:"mdi:chevron-down",helper:"\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u0443\u044E \u0438\u043A\u043E\u043D\u043A\u0443 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F."},sticky_header:{label:"\u0424\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043F\u0440\u0438 \u0441\u043A\u0440\u043E\u043B\u043B\u0435"},"grid.columns":{label:"\u041A\u043E\u043B\u043E\u043D\u043A\u0438",control:"number"},"grid.gap":{label:"\u041E\u0442\u0441\u0442\u0443\u043F\u044B",placeholder:"16px"},theme:{label:"\u0422\u0435\u043C\u0430",optionLabels:{[p.DEFAULT]:"\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",[p.TRANSPARENT]:"\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u0430\u044F",[p.SOLID]:"\u041E\u0431\u044B\u0447\u043D\u0430\u044F",[p.GLASS]:"\u0421\u0442\u0435\u043A\u043B\u043E",[p.GLASSMORPHISM]:"Glassmorphism",[p.NEUMORPHISM]:"Neumorphism",[p.MINIMAL]:"\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u0438\u0437\u043C",[p.GRADIENT]:"\u0413\u0440\u0430\u0434\u0438\u0435\u043D\u0442",[p.DARK]:"\u0422\u0451\u043C\u043D\u0430\u044F",[p.NEON]:"\u041D\u0435\u043E\u043D",[p.AURORA]:"\u0410\u0432\u0440\u043E\u0440\u0430",[p.CARBON]:"Carbon",[p.SLATE]:"Slate",[p.OBSIDIAN]:"Obsidian",[p.CHARCOAL]:"Charcoal",[p.MIDNIGHT]:"Midnight",[p.CYBER]:"Cyber",[p.VOID]:"Void",[p.EMBER]:"Ember",[p.FOREST]:"Forest",[p.OCEAN]:"Ocean",[p.PURPLE_HAZE]:"Purple Haze",[p.MATRIX]:"Matrix",[p.GRAPHITE]:"Graphite",[p.SMOKE]:"Smoke",[p.NORD]:"Nord",[p.DRACULA]:"Dracula",[p.MONOKAI]:"Monokai",[p.TOKYO_NIGHT]:"Tokyo Night",[p.CATPPUCCIN]:"Catppuccin"}},border_radius:{label:"\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435 \u0443\u0433\u043B\u043E\u0432",placeholder:"12px"},padding:{label:"\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0435 \u043E\u0442\u0441\u0442\u0443\u043F\u044B",placeholder:"16px"},animation:{label:"\u0410\u043D\u0438\u043C\u0430\u0446\u0438\u0438"},animation_duration:{label:"\u041E\u0431\u0449\u0430\u044F \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C"},expand_animation:{label:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 body",optionLabels:{[C.NONE]:"\u041D\u0435\u0442",[C.FADE]:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435",[C.FADE_UP]:"\u0421\u043D\u0438\u0437\u0443",[C.FADE_DOWN]:"\u0421\u0432\u0435\u0440\u0445\u0443",[C.SCALE]:"\u041C\u0430\u0441\u0448\u0442\u0430\u0431",[C.SLIDE]:"\u0412\u044B\u0435\u0437\u0434",[C.BOUNCE]:"\u041F\u0440\u0443\u0436\u0438\u043D\u0430",[C.FLIP]:"3D \u0444\u043B\u0438\u043F"},optionIcons:{[C.NONE]:"mdi:cancel",[C.FADE]:"mdi:blur",[C.FADE_UP]:"mdi:arrow-up-bold",[C.FADE_DOWN]:"mdi:arrow-down-bold",[C.SCALE]:"mdi:resize",[C.SLIDE]:"mdi:arrow-expand-down",[C.BOUNCE]:"mdi:arrow-collapse-down",[C.FLIP]:"mdi:rotate-3d-variant"}},collapse_animation:{label:"\u0421\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435 body",optionLabels:{[$.NONE]:"\u041D\u0435\u0442",[$.FADE]:"\u0418\u0441\u0447\u0435\u0437\u0430\u043D\u0438\u0435",[$.FADE_DOWN]:"\u0412\u043D\u0438\u0437",[$.FADE_UP]:"\u0412\u0432\u0435\u0440\u0445",[$.SCALE]:"\u041C\u0430\u0441\u0448\u0442\u0430\u0431",[$.SLIDE]:"\u0423\u0435\u0437\u0434"},optionIcons:{[$.NONE]:"mdi:cancel",[$.FADE]:"mdi:blur-off",[$.FADE_DOWN]:"mdi:arrow-down-bold",[$.FADE_UP]:"mdi:arrow-up-bold",[$.SCALE]:"mdi:resize-bottom-right",[$.SLIDE]:"mdi:arrow-collapse-up"}},cards_animation:{label:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A (\u043A\u0430\u0441\u043A\u0430\u0434)",optionLabels:{[A.NONE]:"\u041D\u0435\u0442",[A.FADE_UP]:"\u0421\u043D\u0438\u0437\u0443",[A.FADE_DOWN]:"\u0421\u0432\u0435\u0440\u0445\u0443",[A.FADE_LEFT]:"\u0421\u043B\u0435\u0432\u0430",[A.FADE_RIGHT]:"\u0421\u043F\u0440\u0430\u0432\u0430",[A.SCALE]:"\u041C\u0430\u0441\u0448\u0442\u0430\u0431",[A.BOUNCE]:"\u041F\u0440\u0443\u0436\u0438\u043D\u0430",[A.FLIP]:"3D \u0444\u043B\u0438\u043F"},optionIcons:{[A.NONE]:"mdi:cancel",[A.FADE_UP]:"mdi:arrow-up-bold",[A.FADE_DOWN]:"mdi:arrow-down-bold",[A.FADE_LEFT]:"mdi:arrow-left-bold",[A.FADE_RIGHT]:"mdi:arrow-right-bold",[A.SCALE]:"mdi:resize",[A.BOUNCE]:"mdi:arrow-collapse-down",[A.FLIP]:"mdi:rotate-3d-variant"}},cards_stagger:{label:"\u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043C\u0435\u0436\u0434\u0443 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438"},cards_direction:{label:"\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u044F",optionLabels:{[O.SEQUENTIAL]:"\u041F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443",[O.REVERSE]:"\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0439",[O.CENTER_OUT]:"\u041E\u0442 \u0446\u0435\u043D\u0442\u0440\u0430",[O.EDGES_IN]:"\u041A \u0446\u0435\u043D\u0442\u0440\u0443",[O.DIAGONAL]:"\u041F\u043E \u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u0438",[O.WAVE]:"\u0412\u043E\u043B\u043D\u0430",[O.RANDOM]:"\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439"},optionIcons:{[O.SEQUENTIAL]:"mdi:ray-start-arrow",[O.REVERSE]:"mdi:ray-end-arrow",[O.CENTER_OUT]:"mdi:arrow-expand-horizontal",[O.EDGES_IN]:"mdi:arrow-collapse-horizontal",[O.DIAGONAL]:"mdi:arrow-bottom-right",[O.WAVE]:"mdi:wave",[O.RANDOM]:"mdi:shuffle-variant"}},lazy_load:{label:"\u041B\u0435\u043D\u0438\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 (lazy loading)"},lazy_initial_batch:{label:"\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0430\u0440\u0442\u0438\u044F lazy load"},lazy_batch_size:{label:"\u0420\u0430\u0437\u043C\u0435\u0440 lazy \u043F\u0430\u0440\u0442\u0438\u0438"},lazy_idle_timeout:{label:"Idle timeout (\u043C\u0441)"},remember_expanded_state:{label:"\u0417\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F"},remember_mode_state:{label:"\u0417\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u0442\u044C \u0432\u043A\u043B\u0430\u0434\u043A\u0443/\u0441\u043B\u0430\u0439\u0434"},auto_collapse_after:{label:"\u0410\u0432\u0442\u043E-\u0441\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435 (\u0441\u0435\u043A, 0 - \u043E\u0442\u043A\u043B.)"},stability_mode:{label:"Stability mode"},enable_card_pool:{label:"\u041F\u0435\u0440\u0435\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438"},pool_scope:{label:"Scope \u043F\u0443\u043B\u0430",optionLabels:{[j.CARD]:"Card",[j.DASHBOARD]:"Dashboard",[j.GLOBAL]:"Global"}},pool_ttl_ms:{label:"TTL \u043F\u0443\u043B\u0430 (\u043C\u0441)"},pool_max_entries:{label:"\u041B\u0438\u043C\u0438\u0442 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u043F\u0443\u043B\u0430"},card_id:{label:"ID \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",placeholder:"\u0410\u0432\u0442\u043E-\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0435\u0441\u043B\u0438 \u043F\u0443\u0441\u0442\u043E"},carousel_autoplay:{label:"\u0410\u0432\u0442\u043E\u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435"},carousel_interval:{label:"\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u043C\u0441)"},expand_trigger:{label:"\u0422\u0440\u0438\u0433\u0433\u0435\u0440 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F",optionLabels:{[H.TAP]:"\u041A\u043B\u0438\u043A (tap)",[H.HOLD]:"\u0423\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 (hold)",[H.DOUBLE_TAP]:"\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u043A\u043B\u0438\u043A",[H.NONE]:"\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E"},optionIcons:{[H.TAP]:"mdi:gesture-tap",[H.HOLD]:"mdi:gesture-tap-hold",[H.DOUBLE_TAP]:"mdi:gesture-double-tap",[H.NONE]:"mdi:close-circle-outline"}},"tap_action.action":{label:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 tap",optionLabels:{[_.NONE]:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",[_.MORE_INFO]:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E",[_.TOGGLE]:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C entity",[_.CALL_SERVICE]:"\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441",[_.NAVIGATE]:"\u041F\u0435\u0440\u0435\u0439\u0442\u0438",[_.URL]:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL",[_.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C",[_.COLLAPSE]:"\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C"}},"hold_action.action":{label:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 hold",optionLabels:{[_.NONE]:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",[_.MORE_INFO]:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E",[_.TOGGLE]:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C entity",[_.CALL_SERVICE]:"\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441",[_.NAVIGATE]:"\u041F\u0435\u0440\u0435\u0439\u0442\u0438",[_.URL]:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL",[_.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C",[_.COLLAPSE]:"\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C"}},"double_tap_action.action":{label:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 double tap",optionLabels:{[_.NONE]:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",[_.MORE_INFO]:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E",[_.TOGGLE]:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C entity",[_.CALL_SERVICE]:"\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441",[_.NAVIGATE]:"\u041F\u0435\u0440\u0435\u0439\u0442\u0438",[_.URL]:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL",[_.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C",[_.COLLAPSE]:"\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C"}},"tap_action.service":{label:"Service",placeholder:"domain.service"},"hold_action.service":{label:"Service",placeholder:"domain.service"},"double_tap_action.service":{label:"Service",placeholder:"domain.service"},"tap_action.navigation_path":{label:"Navigation Path",placeholder:"/lovelace/view"},"hold_action.navigation_path":{label:"Navigation Path",placeholder:"/lovelace/view"},"double_tap_action.navigation_path":{label:"Navigation Path",placeholder:"/lovelace/view"},"tap_action.url_path":{label:"URL",placeholder:"https://..."},"hold_action.url_path":{label:"URL",placeholder:"https://..."},"double_tap_action.url_path":{label:"URL",placeholder:"https://..."},"swipe.enabled":{label:"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C swipe gestures"},"swipe.direction":{label:"\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 swipe",optionLabels:{[Y.HORIZONTAL]:"\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0439",[Y.VERTICAL]:"\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439",[Y.BOTH]:"\u041E\u0431\u0430"}},"swipe.threshold":{label:"\u041F\u043E\u0440\u043E\u0433 \u0441\u0432\u0430\u0439\u043F\u0430 (px)"},"swipe.velocityThreshold":{label:"\u041F\u043E\u0440\u043E\u0433 \u0441\u043A\u043E\u0440\u043E\u0441\u0442\u0438"},"swipe.preventScroll":{label:"\u0411\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C scroll \u043F\u0440\u0438 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0449\u0435\u043C swipe"},"swipe.left.action":{label:"\u0421\u0432\u0430\u0439\u043F \u0432\u043B\u0435\u0432\u043E",optionLabels:{[w.NONE]:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",[w.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C",[w.COLLAPSE]:"\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C",[w.TOGGLE]:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C",[w.NEXT]:"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439",[w.PREV]:"\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439"}},"swipe.right.action":{label:"\u0421\u0432\u0430\u0439\u043F \u0432\u043F\u0440\u0430\u0432\u043E",optionLabels:{[w.NONE]:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",[w.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C",[w.COLLAPSE]:"\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C",[w.TOGGLE]:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C",[w.NEXT]:"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439",[w.PREV]:"\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439"}},"swipe.up.action":{label:"\u0421\u0432\u0430\u0439\u043F \u0432\u0432\u0435\u0440\u0445",optionLabels:{[w.NONE]:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",[w.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C",[w.COLLAPSE]:"\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C",[w.TOGGLE]:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C",[w.NEXT]:"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439",[w.PREV]:"\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439"}},"swipe.down.action":{label:"\u0421\u0432\u0430\u0439\u043F \u0432\u043D\u0438\u0437",optionLabels:{[w.NONE]:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",[w.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C",[w.COLLAPSE]:"\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C",[w.TOGGLE]:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C",[w.NEXT]:"\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439",[w.PREV]:"\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439"}},"badges.type":{label:"\u0422\u0438\u043F badge",optionLabels:{[T.STATE]:"State",[T.ATTRIBUTE]:"Attribute",[T.COUNTER]:"Counter",[T.CUSTOM]:"Custom"}},"badges.entity":{label:"Entity",placeholder:"sensor.temperature"},"badges.attribute":{label:"Attribute",placeholder:"temperature"},"badges.icon":{label:"\u0418\u043A\u043E\u043D\u043A\u0430",placeholder:"mdi:thermometer"},"badges.color":{label:"\u0426\u0432\u0435\u0442",placeholder:"var(--warning-color)"},"badges.value":{label:"\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435",placeholder:"Online / 42"},"badges.label":{label:"Label",placeholder:"\u0422\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430"},"badges.unit":{label:"Unit",placeholder:"\xB0C"},"badges.min":{label:"Min",control:"number"},"badges.max":{label:"Max",control:"number"},"badges.show_name":{label:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043C\u044F entity"},"badges.show_progress":{label:"\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C progress"},"badges.precision":{label:"Precision",control:"number"},"badges.format":{label:"\u0424\u043E\u0440\u043C\u0430\u0442",optionLabels:{[P.NONE]:"\u0411\u0435\u0437 \u0444\u043E\u0440\u043C\u0430\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F",[P.TIME]:"\u0412\u0440\u0435\u043C\u044F",[P.DATE]:"\u0414\u0430\u0442\u0430",[P.DURATION]:"\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C"}},"badges.entities":{label:"Entities",placeholder:"light.kitchen, light.hall",control:"text"},"badges.domain":{label:"Domain",placeholder:"light"},"badges.state":{label:"\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435",placeholder:"on"},"badges.count_state":{label:"Count State",placeholder:"on"},"badges.thresholds.value":{label:"\u041F\u043E\u0440\u043E\u0433",control:"number"},"badges.thresholds.color":{label:"\u0426\u0432\u0435\u0442 \u043F\u043E\u0440\u043E\u0433\u0430",placeholder:"#f44336"}},X=Object.freeze({basic:["title","subtitle","icon","entity","body_mode","expanded"],header:["show_expand_icon","expand_icon","sticky_header"],body:["grid.columns","grid.gap"],style:["theme","border_radius","padding","animation"],runtime:["lazy_load","lazy_initial_batch","lazy_batch_size","lazy_idle_timeout","remember_expanded_state","remember_mode_state","auto_collapse_after","stability_mode","enable_card_pool","pool_scope","pool_ttl_ms","pool_max_entries"],advanced:["card_id"],carousel:["carousel_autoplay","carousel_interval"]}),Kt=Object.freeze(["swipe.enabled","swipe.direction","swipe.threshold","swipe.velocityThreshold","swipe.preventScroll"]),Xt=Object.freeze(["swipe.left.action","swipe.right.action","swipe.up.action","swipe.down.action"]),Te=Object.freeze({[T.STATE]:["badges.entity","badges.icon","badges.color","badges.label","badges.unit","badges.show_name","badges.show_progress","badges.min","badges.max","badges.precision","badges.format"],[T.ATTRIBUTE]:["badges.entity","badges.attribute","badges.icon","badges.color","badges.label","badges.unit","badges.show_name","badges.show_progress","badges.min","badges.max","badges.precision","badges.format"],[T.COUNTER]:["badges.icon","badges.color","badges.label","badges.unit","badges.entities","badges.domain","badges.state","badges.count_state","badges.precision","badges.format"],[T.CUSTOM]:["badges.icon","badges.color","badges.label","badges.value","badges.unit","badges.precision","badges.format"]}),Le={[m.STATE]:{label:"\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 entity",icon:"mdi:toggle-switch"},[m.NUMERIC_STATE]:{label:"\u0427\u0438\u0441\u043B\u043E\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",icon:"mdi:numeric"},[m.USER]:{label:"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",icon:"mdi:account"},[m.TIME]:{label:"\u0412\u0440\u0435\u043C\u044F",icon:"mdi:clock-outline"},[m.SCREEN]:{label:"\u0420\u0430\u0437\u043C\u0435\u0440 \u044D\u043A\u0440\u0430\u043D\u0430",icon:"mdi:monitor"},[m.AND]:{label:"AND \u0433\u0440\u0443\u043F\u043F\u0430",icon:"mdi:set-center"},[m.OR]:{label:"OR \u0433\u0440\u0443\u043F\u043F\u0430",icon:"mdi:set-all"},[m.NOT]:{label:"NOT \u0433\u0440\u0443\u043F\u043F\u0430",icon:"mdi:selection-remove"}},tt={mon:"\u041F\u043D",tue:"\u0412\u0442",wed:"\u0421\u0440",thu:"\u0427\u0442",fri:"\u041F\u0442",sat:"\u0421\u0431",sun:"\u0412\u0441"},Ie=[{value:"",label:"\u041D\u0435 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C"},{value:"true",label:"\u0414\u0430"},{value:"false",label:"\u041D\u0435\u0442"}],it={entity:{label:"Entity",placeholder:"light.room",control:"entity"},attribute:{label:"Attribute",placeholder:"brightness"},state:{label:"\u0420\u0430\u0437\u0440\u0435\u0448\u0451\u043D\u043D\u044B\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F",placeholder:"on, open, heat"},state_not:{label:"\u0417\u0430\u043F\u0440\u0435\u0449\u0451\u043D\u043D\u044B\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F",placeholder:"off, unavailable"},above:{label:"\u0412\u044B\u0448\u0435",control:"number"},below:{label:"\u041D\u0438\u0436\u0435",control:"number"},users:{label:"Users / IDs",placeholder:"admin, guest"},is_admin:{label:"Admin",control:"select",options:Ie},is_owner:{label:"Owner",control:"select",options:Ie},after:{label:"\u041F\u043E\u0441\u043B\u0435",placeholder:"08:00"},before:{label:"\u0414\u043E",placeholder:"22:00"},weekday:{label:"\u0414\u043D\u0438 \u043D\u0435\u0434\u0435\u043B\u0438",control:"multiselect",options:G.map(a=>({value:a,label:tt[a]||a.toUpperCase()}))},media_query:{label:"Media Query",placeholder:"(min-width: 768px)"},min_width:{label:"Min Width",control:"number"},max_width:{label:"Max Width",control:"number"}},rt=Object.freeze({[m.STATE]:["entity","attribute","state","state_not"],[m.NUMERIC_STATE]:["entity","attribute","above","below"],[m.USER]:["users","is_admin","is_owner"],[m.TIME]:["after","before","weekday"],[m.SCREEN]:["media_query","min_width","max_width"],[m.AND]:[],[m.OR]:[],[m.NOT]:[]}),nt=Object.freeze([{key:"background",id:"state_style_background",label:"Background",placeholder:"rgba(76, 175, 80, 0.2)",control:"text"},{key:"color",id:"state_style_color",label:"Color",placeholder:"#4caf50",control:"text"},{key:"border",id:"state_style_border",label:"Border",placeholder:"1px solid #4caf50",control:"text"},{key:"class",id:"state_style_class",label:"Class",placeholder:"is-active, high-priority",control:"text"}]);function Oe(a,e){if(e)return e;let t=Array.isArray(a.type)?a.type:[a.type];return t.includes(S.ENTITY)?"entity":t.includes(S.ICON)?"icon":t.includes(S.BOOLEAN)?"checkbox":t.includes(S.SELECT)?"select":t.includes(S.NUMBER)?"number":t.includes(S.OBJECT)||t.includes(S.ARRAY)||t.includes(S.ACTION)?null:"text"}function ke(a){return a.replace(/[.\[\]]+/g,"_").replace(/_+/g,"_").replace(/^_|_$/g,"")}function $e(a,e){if(e?.options)return e.options;if(a.options)return a.options.map(t=>{let i=String(t);return{value:i,label:e?.optionLabels?.[i]||i,icon:e?.optionIcons?.[i]}})}function R(a){let e=he(me,a);if(!e)return null;let t=et[a],i=Oe(e,t?.control);return i?{path:a,id:ke(a),label:t?.label||a,placeholder:t?.placeholder,helper:t?.helper||e.description,control:i,description:e.description,default:e.default,options:$e(e,t),min:e.min,max:e.max,schema:e}:null}function Ne(a){return a.map(e=>R(e)).filter(e=>!!e)}function z(a){return R(a)?.options||[]}function ot(){return he(me,"visibility")?.items||null}function at(a){return ot()?.properties?.[a]}function st(a,e,t){let i=Oe(e||{type:S.STRING},t.control)||"text";return{key:a,id:ke(`condition_${a}`),label:t.label,placeholder:t.placeholder,helper:t.helper||e?.description,control:i,description:e?.description,options:$e(e||{type:S.STRING},t),min:e?.min,max:e?.max,schema:e}}function be(){return Object.entries(Le).map(([a,e])=>({value:a,label:e.label,icon:e.icon}))}function ge(a){return(rt[a]||[]).map(t=>{let i=it[t];return st(t,at(t),i)})}function Re(a){return Le[a]||null}function q(a){return a===m.AND||a===m.OR||a===m.NOT}function Me(){return[...nt]}function De(a){let e=Te[a]||Te[T.STATE];return Ne(["badges.type",...e])}function He(){return Ne(["badges.thresholds.value","badges.thresholds.color"])}var M={BASIC:"basic",HEADER:"header",BODY:"body",STYLE:"style",FEATURES:"features",ADVANCED:"advanced"},dt=[{id:M.BASIC,icon:"mdi:cog",label:"\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435"},{id:M.HEADER,icon:"mdi:page-layout-header",label:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A"},{id:M.BODY,icon:"mdi:card-text-outline",label:"\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435"},{id:M.STYLE,icon:"mdi:palette",label:"\u0421\u0442\u0438\u043B\u044C"},{id:M.FEATURES,icon:"mdi:tune",label:"\u0424\u0443\u043D\u043A\u0446\u0438\u0438"},{id:M.ADVANCED,icon:"mdi:code-tags",label:"\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435"}],lt=["tap_action","hold_action","double_tap_action"],ct=["service","navigation_path","url_path"],pt=["label","title","icon"],ut=["type","entity","attribute","icon","color","value","label","unit","min","max","show_name","show_progress","precision","format","entities","domain","state","count_state"],ht=["value","color"],mt=["header","body","footer"],bt=["entity","attribute","state","state_not","above","below","users","is_admin","is_owner","after","before","weekday","media_query","min_width","max_width"],gt=[m.STATE,m.NUMERIC_STATE,m.USER,m.TIME,m.SCREEN,m.AND,m.OR,m.NOT],ft=["class","background","bg","color","text_color","border","border_color","border_width","border_radius","shadow","box_shadow","opacity","transform","filter"];function Fe(a,e="Unknown error"){return a instanceof Error&&typeof a.message=="string"&&a.message?a.message:e}function ye(a){return!!a&&typeof a=="object"&&!Array.isArray(a)}function Z(a){return ye(a)&&"condition"in a}function Pe(a){return lt.includes(a)}function _t(a){return ct.includes(a)}function yt(a){return pt.includes(a)}function Be(a){return ut.includes(a)}function Ve(a){return ht.includes(a)}function Et(a){return ft.includes(a)}function Ee(a){return mt.includes(a)}function ze(a){return bt.includes(a)}function Ue(a){return gt.includes(a)}function fe(a){if(a==="global")return!0;let e=a.split(":")[1];return!!(e&&Ee(e))}function xt(a){return a==="tap"?"tap_action":a==="hold"?"hold_action":a==="double_tap"?"double_tap_action":null}function vt(a,e,t){a[e]=t}function wt(a,e,t){a[e]=t}function St(a,e,t){a[e]=t}function Ct(a,e,t){a[e]=t}function At(a,e,t){a[e]=t}function g(a,e){return Array.from(a.querySelectorAll(e))}function E(a,e){return a.querySelector(e)}function _e(a){return a instanceof HTMLInputElement||a instanceof HTMLTextAreaElement||a instanceof HTMLSelectElement}function V(a){return a instanceof HTMLInputElement||a instanceof HTMLSelectElement||a instanceof HTMLTextAreaElement}function je(a){return a instanceof HTMLElement&&a.shadowRoot instanceof ShadowRoot}var xe=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._config={},this._hass=null,this._activeSection=M.BASIC,this._history=[],this._historyIndex=-1,this._editingCardIndex=null,this._editingCardSection=null,this._showSubEditor=!1,this._subEditor=null,this._dragState=null,this._lastConfigStr=null,this._cardHelpers=null,this._inlineEditSection=null,this._inlineEditIndex=null}set hass(e){let t=!this._hass;this._hass=e,this._subEditor&&(this._subEditor.hass=e),t&&this._render()}setConfig(e){let t=JSON.stringify(e);if(this._lastConfigStr!==t){this._lastConfigStr=t;try{this._config=JSON.parse(t)}catch{this._config=D(e)}this._pushHistory(this._config),this._render()}}_render(){let e=this._saveFocusState();this.shadowRoot.innerHTML=`
      <style>${this._getStyles()}</style>
      <div class="editor">
        ${this._renderToolbar()}
        ${this._renderTabBar()}
        <div class="editor-content">
          ${this._showSubEditor?this._renderSubEditorContainer():`
              ${this._renderSection(this._activeSection)}
              ${this._renderLiveInspector()}
            `}
        </div>
      </div>
    `,this._bindEvents(),this._showSubEditor&&this._initSubEditor(),this._restoreFocusState(e)}_saveFocusState(){let e=this.shadowRoot.activeElement;if(!_e(e))return null;let t="selectionStart"in e?e.selectionStart:null,i="selectionEnd"in e?e.selectionEnd:null;return{id:e.id,name:e.name,tagName:e.tagName,selectionStart:t,selectionEnd:i,value:e.value}}_restoreFocusState(e){e&&requestAnimationFrame(()=>{let t=null;if(e.id){let i=this.shadowRoot.getElementById(e.id);t=_e(i)?i:null}if(!t&&e.name){let i=E(this.shadowRoot,`[name="${e.name}"]`);t=_e(i)?i:null}if(t&&(t.focus(),typeof e.selectionStart=="number"&&"setSelectionRange"in t&&typeof t.setSelectionRange=="function"))try{t.setSelectionRange(e.selectionStart,e.selectionEnd)}catch{}})}_renderToolbar(){let e=this._historyIndex>0,t=this._historyIndex<this._history.length-1;return`
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">Universal Card Editor</span>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-btn" data-action="undo" ${e?"":"disabled"} title="\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C">
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button class="toolbar-btn" data-action="redo" ${t?"":"disabled"} title="\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C">
            <ha-icon icon="mdi:redo"></ha-icon>
          </button>
          <button class="toolbar-btn" data-action="reset" title="\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C">
            <ha-icon icon="mdi:restore"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderTabBar(){return`
      <div class="tab-bar">
        ${dt.map(e=>`
          <button class="tab-item ${this._activeSection===e.id?"active":""}" 
                  data-section="${e.id}"
                  title="${e.label}">
            <ha-icon icon="${e.icon}"></ha-icon>
            <span class="tab-label">${e.label}</span>
          </button>
        `).join("")}
      </div>
    `}_renderSection(e){switch(e){case M.BASIC:return this._renderBasicSection();case M.HEADER:return this._renderHeaderSection();case M.BODY:return this._renderBodySection();case M.STYLE:return this._renderStyleSection();case M.FEATURES:return this._renderFeaturesSection();case M.ADVANCED:return this._renderAdvancedSection();default:return""}}_renderSchemaFields(e){return e.map(t=>typeof t!="string"?`
          <div class="field-row">
            ${t.map(i=>this._renderSchemaField(i)).join("")}
          </div>
        `:this._renderSchemaField(t)).join("")}_renderSchemaField(e){let t=R(e);if(!t)return"";let i=t.control==="icon"?this._getConfigValue(e,""):this._getConfigValue(e,t.default),r=i??"",n=t.helper?`<p class="hint">${this._escapeHtml(t.helper)}</p>`:"";if(t.control==="checkbox")return`
        <div class="field checkbox-field">
          <input type="checkbox"
                 id="${t.id}"
                 name="${e}"
                 ${r?"checked":""}>
          <label for="${t.id}">${t.label}</label>
          ${n}
        </div>
      `;if(t.control==="select")return`
        <div class="field">
          <label for="${t.id}">${t.label}</label>
          <select id="${t.id}" name="${e}">
            ${(t.options||[]).map(f=>`
              <option value="${this._escapeHtml(f.value)}" ${String(r)===f.value?"selected":""}>
                ${this._escapeHtml(f.label)}
              </option>
            `).join("")}
          </select>
          ${n}
        </div>
      `;if(t.control==="icon"){let f=typeof r=="string"?r:String(r),k=f.trim()!=="";return`
        <div class="field field-icon">
          <label for="${t.id}">${t.label}</label>
          <div class="icon-picker-wrapper">
            <ha-icon-picker id="${t.id}"
                            data-name="${e}"
                            data-value="${this._escapeHtml(f)}">
            </ha-icon-picker>
            <button type="button"
                    class="btn-icon icon-clear-btn ${k?"":"hidden"}"
                    data-action="clear-icon"
                    data-path="${e}"
                    title="\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0438\u043A\u043E\u043D\u043A\u0443">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          ${n}
        </div>
      `}if(t.control==="entity")return`
        <div class="field">
          <label for="${t.id}">${t.label}</label>
          <input type="text"
                 id="${t.id}"
                 name="${e}"
                 value="${this._escapeHtml(typeof r=="string"?r:String(r))}"
                 placeholder="${this._escapeHtml(t.placeholder||"")}"
                 list="entities-list">
          <datalist id="entities-list">
            ${this._hass?Object.keys(this._hass.states).slice(0,100).map(f=>`<option value="${f}">`).join(""):""}
          </datalist>
          ${n}
        </div>
      `;let o=t.control==="number"?"number":"text",d=typeof r=="number"?r:r===""||Number.isNaN(Number(r))?"":Number(r),l=t.control==="number"?d:this._escapeHtml(typeof r=="string"?r:String(r)),c=t.control==="number"&&t.min!==void 0?`min="${t.min}"`:"",h=t.control==="number"&&t.max!==void 0?`max="${t.max}"`:"";return`
      <div class="field">
        <label for="${t.id}">${t.label}</label>
        <input type="${o}"
               id="${t.id}"
               name="${e}"
               value="${l}"
               placeholder="${this._escapeHtml(t.placeholder||"")}"
               ${c}
               ${h}>
        ${n}
      </div>
    `}_getConfigValue(e,t){let i=e.split(".").reduce((r,n)=>r?.[n],this._config);return i!==void 0?i:t}_getCardsForSection(e){return e==="header"?this._config.header?.cards||[]:this._config.body?.cards||[]}_setCardsForSection(e,t){if(e==="header"){this._config={...this._config,header:{...this._config.header||{},cards:t}};return}this._config={...this._config,body:{...this._config.body||{},cards:t}}}_renderBasicSection(){let e=this._config.expand_trigger||"tap",t=this._getTriggerInfo(e);return`
      <div class="section">
        <h3>\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h3>
        
        <!-- Card Preview with Trigger Indicator -->
        <div class="card-mini-preview preview-card">
          <div class="mini-preview-header">
            ${this._config.icon?`<ha-icon icon="${this._config.icon}" class="mini-icon"></ha-icon>`:""}
            <div class="mini-preview-text">
              <span class="mini-title">${this._escapeHtml(this._config.title||"Universal Card")}</span>
              ${this._config.subtitle?`<span class="mini-subtitle">${this._escapeHtml(this._config.subtitle)}</span>`:""}
            </div>
            <div class="trigger-indicator" title="${t.tooltip}">
              <ha-icon icon="${t.icon}"></ha-icon>
            </div>
          </div>
        <div class="mini-preview-hint">
          ${t.hint}
        </div>
        </div>
        
        ${this._renderSchemaFields(X.basic)}
      </div>
    `}_getTriggerInfo(e){let t={tap:{icon:"mdi:gesture-tap",tooltip:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u043E \u043A\u043B\u0438\u043A\u0443",hint:"\u041A\u043B\u0438\u043A \u0434\u043B\u044F \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F"},hold:{icon:"mdi:gesture-tap-hold",tooltip:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u043E \u0443\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u044E",hint:"\u0423\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F"},double_tap:{icon:"mdi:gesture-double-tap",tooltip:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u043E \u0434\u0432\u043E\u0439\u043D\u043E\u043C\u0443 \u043A\u043B\u0438\u043A\u0443",hint:"\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u043A\u043B\u0438\u043A \u0434\u043B\u044F \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F"},none:{icon:"mdi:lock-outline",tooltip:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",hint:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u0447\u0435\u0440\u0435\u0437 actions"}};return t[e]||t.tap}_renderHeaderSection(){return`
      <div class="section">
        <h3>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430</h3>

        ${this._renderSchemaFields(X.header)}
        
        <div class="subsection">
          <h4>\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0435</h4>
          <p class="hint">\u041F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u0439\u0442\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0434\u043B\u044F \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0438. \u0421 \u043A\u043B\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u044B: Alt + \u2191/\u2193.</p>
          
          <div class="cards-list" id="header-cards">
            ${this._renderCardsList(this._config.header?.cards||[],"header")}
          </div>
          
          <button class="btn btn-add" data-action="add-header-card">
            <ha-icon icon="mdi:plus"></ha-icon>
            \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443
          </button>
        </div>
      </div>
    `}_renderBodySection(){return`
      <div class="section">
        <h3>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E</h3>
        
        <div class="subsection">
          <h4>Grid Layout</h4>

          ${this._renderSchemaFields([X.body])}
        </div>
        
        <div class="subsection">
          <h4>\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432 body</h4>
          <p class="hint">Drag & drop \u0438\u043B\u0438 \u043A\u043D\u043E\u043F\u043A\u0438 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u044F \u0441\u043F\u0440\u0430\u0432\u0430. \u0421 \u043A\u043B\u0430\u0432\u0438\u0430\u0442\u0443\u0440\u044B: Alt + \u2191/\u2193.</p>
          
          <div class="cards-list" id="body-cards">
            ${this._renderCardsList(this._config.body?.cards||[],"body")}
          </div>
          
          <button class="btn btn-add" data-action="add-body-card">
            <ha-icon icon="mdi:plus"></ha-icon>
            \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443
          </button>
        </div>
        
        ${this._config.body_mode===x.TABS?this._renderTabsEditor():""}
        ${this._config.body_mode===x.CAROUSEL?this._renderCarouselEditor():""}
      </div>
    `}_renderStyleSection(){return`
      <div class="section">
        <h3>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0442\u0438\u043B\u044F</h3>

        ${this._renderSchemaFields(["theme"])}
        
        <div class="theme-preview" style="${this._escapeHtml(this._getThemePreviewStyle())}">
          <div class="preview-header">Preview</div>
          <div class="preview-body">\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435</div>
        </div>

        ${this._renderThemeTokensEditor()}

        ${this._renderSchemaFields([["border_radius","padding"],"animation"])}
      </div>
    `}_renderThemeTokensEditor(){return`
      <div class="subsection">
        <h4>Theme Tokens Overrides</h4>
        <p class="hint">\u041F\u0435\u0440\u0435\u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 CSS \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: --uc-primary-color)</p>

        <div class="theme-tokens-list">
          ${Object.entries(this._config.theme_tokens||{}).map(([t,i],r)=>`
            <div class="theme-token-item" data-index="${r}" data-token-name="${this._escapeHtml(t)}">
              <input type="text"
                     class="token-name"
                     placeholder="--uc-primary-color"
                     value="${this._escapeHtml(t)}">
              <input type="text"
                     class="token-value"
                     placeholder="#00d4ff"
                     value="${this._escapeHtml(i)}">
              <button class="btn-icon btn-delete" data-action="delete-theme-token" data-index="${r}" title="\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0442\u043E\u043A\u0435\u043D">
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `).join("")}
        </div>

        <button class="btn btn-small btn-add" data-action="add-theme-token">
          <ha-icon icon="mdi:plus"></ha-icon>
          \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u043E\u043A\u0435\u043D
        </button>
      </div>
    `}_renderFeaturesSection(){return`
      <div class="section features-section">
        <h3>\u0424\u0443\u043D\u043A\u0446\u0438\u0438</h3>
        
        <div class="feature-group">
          <div class="feature-group-header">
            <ha-icon icon="mdi:tune-variant"></ha-icon>
            <span>Runtime policy</span>
          </div>

          ${this._renderSchemaFields(["lazy_load",["lazy_initial_batch","lazy_batch_size"],"lazy_idle_timeout","remember_expanded_state","remember_mode_state","auto_collapse_after","stability_mode","enable_card_pool",["pool_scope","pool_max_entries"],"pool_ttl_ms"])}
        </div>
        
        <!-- Visibility Conditions -->
        ${this._renderVisibilityConditionsUI()}
        
        <!-- State Styles -->
        ${this._renderStateStylesUI()}
        
        <!-- Actions -->
        ${this._renderActionsUI()}
        
        <!-- Swipe Gestures -->
        ${this._renderSwipeGesturesUI()}
        
        <!-- Badges -->
        ${this._renderBadgesUI()}
        
        <!-- Animation Presets -->
        ${this._renderAnimationPresetsUI()}
      </div>
    `}_renderVisibilityConditionsUI(){let e=this._config.visibility||[],t=this._config.section_visibility||{},i=t.header||[],r=t.body||[],n=t.footer||[],o=e.length+i.length+r.length+n.length,d=be();return`
      <div class="feature-group collapsible ${o>0?"has-content":""}" data-feature="visibility">
        <div class="feature-group-header" data-toggle="visibility">
          <ha-icon icon="mdi:eye-settings"></ha-icon>
          <span>\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u0438</span>
          <span class="feature-badge">${o||""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="visibility-content">
          <p class="feature-hint">\u041A\u0430\u0436\u0434\u044B\u0439 \u0431\u043B\u043E\u043A \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442 AND-\u043B\u043E\u0433\u0438\u043A\u0443: \u0441\u0435\u043A\u0446\u0438\u044F \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0432\u0441\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u044B.</p>

          ${this._renderVisibilityScope("global","\u0412\u0441\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430",e,d,"\u0421\u043A\u0440\u044B\u0432\u0430\u0435\u0442/\u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0432\u0435\u0441\u044C \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442.")}
          ${this._renderVisibilityScope("section:header","Header",i,d,"\u0412\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430.")}
          ${this._renderVisibilityScope("section:body","Body",r,d,"\u0412\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u0441\u0435\u043A\u0446\u0438\u0438 \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430.")}
          ${this._renderVisibilityScope("section:footer","Footer",n,d,"\u0412\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u044C footer.")}
        </div>
      </div>
    `}_renderVisibilityScope(e,t,i,r,n=""){return`
      <div class="visibility-scope">
        <div class="visibility-scope-header">
          <span class="visibility-scope-title">${t}</span>
          <span class="feature-badge">${i.length||""}</span>
        </div>
        ${n?`<p class="feature-hint">${n}</p>`:""}

        <div class="conditions-list">
          ${i.length?i.map((o,d)=>this._renderConditionItem(o,`${d}`,e,r)).join(""):'<p class="feature-hint">\u041D\u0435\u0442 \u0443\u0441\u043B\u043E\u0432\u0438\u0439. \u0421\u0435\u043A\u0446\u0438\u044F \u0432\u0441\u0435\u0433\u0434\u0430 \u0432\u0438\u0434\u0438\u043C\u0430.</p>'}
        </div>

        <div class="add-condition-row">
          <select class="condition-type-select" data-visibility-scope="${e}" data-parent-path="">
            <option value="">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043F \u0443\u0441\u043B\u043E\u0432\u0438\u044F...</option>
            ${r.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}
          </select>
          <button class="btn btn-small btn-add" data-action="add-visibility-condition" data-scope="${e}" data-parent-path="">
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderConditionItem(e,t,i="global",r=be()){let n=e.condition||"state",o=Re(n),d=this._renderConditionFields(n,e),l=Array.isArray(e.conditions)?e.conditions:[],c=q(n)?`
        <div class="condition-children">
          <div class="condition-children-header">
            <span>\u0412\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u044F</span>
            <span class="feature-badge">${l.length||""}</span>
          </div>
          <div class="conditions-list nested-conditions">
            ${l.length?l.map((h,f)=>this._renderConditionItem(h,`${t}.conditions.${f}`,i,r)).join(""):'<p class="feature-hint">\u0413\u0440\u0443\u043F\u043F\u0430 \u043F\u0443\u0441\u0442\u0430. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u043E \u0443\u0441\u043B\u043E\u0432\u0438\u0435.</p>'}
          </div>
          <div class="add-condition-row nested-add-condition-row">
            <select class="condition-type-select" data-visibility-scope="${i}" data-parent-path="${t}">
              <option value="">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u043E\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u0435...</option>
              ${r.map(h=>`<option value="${h.value}">${h.label}</option>`).join("")}
            </select>
            <button class="btn btn-small btn-add" data-action="add-visibility-condition" data-scope="${i}" data-parent-path="${t}">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        </div>
      `:"";return`
      <div class="condition-item ${q(n)?"condition-item-logical":""}" data-path="${t}" data-type="${n}" data-scope="${i}">
        <div class="condition-type-badge" title="${this._escapeHtml(o?.label||n)}">${this._escapeHtml(o?.label||n)}</div>
        <div class="condition-fields">${d}</div>
        <button class="btn-icon btn-delete" data-action="delete-condition" data-scope="${i}" data-path="${t}">
          <ha-icon icon="mdi:delete"></ha-icon>
        </button>
        ${c}
      </div>
    `}_renderConditionFields(e,t){let i=ge(e);return i.length===0?'<p class="feature-hint">\u042D\u0442\u0430 \u0433\u0440\u0443\u043F\u043F\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u043C\u0438 \u0443\u0441\u043B\u043E\u0432\u0438\u044F\u043C\u0438.</p>':i.map(r=>this._renderConditionField(r,ze(r.key)?t[r.key]:void 0)).join("")}_renderConditionField(e,t){let i=this._formatConditionFieldValue(e.key,t),r=e.control==="number"&&e.min!==void 0?`min="${e.min}"`:"",n=e.control==="number"&&e.max!==void 0?`max="${e.max}"`:"";if(e.control==="select")return`
        <label class="condition-control">
          <span>${this._escapeHtml(e.label)}</span>
          <select data-field="${e.key}" class="cond-field">
            ${(e.options||[]).map(l=>`
              <option value="${this._escapeHtml(l.value)}" ${i===l.value?"selected":""}>
                ${this._escapeHtml(l.label)}
              </option>
            `).join("")}
          </select>
        </label>
      `;if(e.control==="multiselect"){let l=Array.isArray(t)?t:[];return`
        <label class="condition-control">
          <span>${this._escapeHtml(e.label)}</span>
          <select data-field="${e.key}" class="cond-field cond-weekday" multiple title="${this._escapeHtml(e.label)}">
            ${(e.options||[]).map(c=>`
              <option value="${this._escapeHtml(c.value)}" ${l.includes(c.value)?"selected":""}>
                ${this._escapeHtml(c.label)}
              </option>
            `).join("")}
          </select>
        </label>
      `}let o=e.control==="number"?"number":e.key==="after"||e.key==="before"?"time":"text",d=e.control==="entity"?'list="entities-list"':"";return`
      <label class="condition-control">
        <span>${this._escapeHtml(e.label)}</span>
        <input type="${o}"
               value="${e.control==="number"?t??"":this._escapeHtml(i)}"
               placeholder="${this._escapeHtml(e.placeholder||"")}"
               data-field="${e.key}"
               class="cond-field ${e.control==="number"?"cond-small":""}"
               ${d}
               ${r}
               ${n}>
      </label>
    `}_formatConditionFieldValue(e,t){return t==null?"":e==="weekday"&&Array.isArray(t)?t.join(","):(e==="state"||e==="state_not"||e==="users")&&Array.isArray(t)?t.join(", "):String(t)}_renderStateStylesUI(){let e=this._config.state_styles&&Object.keys(this._config.state_styles).length>0,t=this._config.state_styles||{},i=this._config.entity||"",r=Me();return`
      <div class="feature-group collapsible ${e?"has-content":""}" data-feature="state_styles">
        <div class="feature-group-header" data-toggle="state_styles">
          <ha-icon icon="mdi:palette-swatch"></ha-icon>
          <span>\u0421\u0442\u0438\u043B\u0438 \u043F\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044E</span>
          <span class="feature-badge">${e?"\u2713":""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="state-styles-content">
          <p class="feature-hint">\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0432\u043D\u0435\u0448\u043D\u0435\u0433\u043E \u0432\u0438\u0434\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F root entity.</p>
          <p class="feature-hint">
            \u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A: ${i?`<code>${this._escapeHtml(i)}</code>`:"<strong>root entity \u043D\u0435 \u0437\u0430\u0434\u0430\u043D</strong>"}.
            \u041E\u0442\u0434\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435 <code>state_styles_entity</code> \u0443\u0434\u0430\u043B\u0435\u043D\u043E.
          </p>
          ${this._renderSchemaField("attribute")}
          
          <div class="state-styles-list" id="state-styles-list">
            ${Object.entries(t).map(([n,o],d)=>`
              <div class="state-style-item" data-state="${this._escapeHtml(n)}">
                <input type="text" value="${this._escapeHtml(n)}" placeholder="on, off, >20, ..." 
                       class="state-key" data-index="${d}">
                ${r.map(l=>{let c=o[l.key],h=Array.isArray(c)?c.join(", "):c===void 0?"":String(c);return`
                  <input type="text"
                         value="${this._escapeHtml(h)}"
                         placeholder="${this._escapeHtml(l.placeholder||l.label)}"
                         class="style-field"
                         data-style="${l.key}">
                `}).join("")}
                <button class="btn-icon btn-delete" data-action="delete-state-style" data-state="${this._escapeHtml(n)}">
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>
              </div>
            `).join("")}
          </div>
          
          <button class="btn btn-small btn-add" data-action="add-state-style">
            <ha-icon icon="mdi:plus"></ha-icon>
            \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u0442\u0438\u043B\u044C
          </button>
          
          <div class="style-presets">
            <span class="preset-label">\u041F\u0440\u0435\u0441\u0435\u0442\u044B:</span>
            <button class="btn-preset" data-preset="on-off">on/off</button>
            <button class="btn-preset" data-preset="temperature">\u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0430</button>
            <button class="btn-preset" data-preset="battery">\u0431\u0430\u0442\u0430\u0440\u0435\u044F</button>
          </div>
        </div>
      </div>
    `}_renderActionsUI(){let e=this._config.expand_trigger||"tap",t=this._config.tap_action||{},i=this._config.hold_action||{},r=this._config.double_tap_action||{},n=t.action||i.action||r.action||e!=="tap",o=z("tap_action.action"),d=z("expand_trigger");return`
      <div class="feature-group collapsible ${n?"has-content":""}" data-feature="actions">
        <div class="feature-group-header" data-toggle="actions">
          <ha-icon icon="mdi:gesture-tap"></ha-icon>
          <span>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</span>
          <span class="feature-badge">${n?"\u2713":""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="actions-content">
          
          <!-- Expand Trigger Selection -->
          <div class="expand-trigger-section">
            <label class="section-label">
              <ha-icon icon="mdi:arrow-expand-vertical"></ha-icon>
              \u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u043E:
            </label>
            <div class="expand-trigger-grid">
              ${d.map(l=>`
                <button class="expand-trigger-btn ${e===l.value?"active":""}" 
                        data-trigger="${l.value}">
                  <ha-icon icon="${l.icon||"mdi:cog"}"></ha-icon>
                  <span>${l.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
          
          <hr class="section-divider">
          
          <!-- Custom Actions -->
          <div class="custom-actions-section">
            <label class="section-label">
              <ha-icon icon="mdi:cog"></ha-icon>
              \u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F
            </label>
            <p class="feature-hint">\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0434\u043B\u044F \u0436\u0435\u0441\u0442\u043E\u0432, \u043D\u0435 \u0437\u0430\u043D\u044F\u0442\u044B\u0445 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435\u043C</p>
            
            ${this._renderActionRow("tap_action","\u041D\u0430\u0436\u0430\u0442\u0438\u0435 (tap)",t,o,e==="tap")}
            ${this._renderActionRow("hold_action","\u0423\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 (hold)",i,o,e==="hold")}
            ${this._renderActionRow("double_tap_action","\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u043A\u043B\u0438\u043A",r,o,e==="double_tap")}
          </div>
        </div>
      </div>
    `}_renderActionRow(e,t,i,r,n=!1){let o=i.action||"none",d=R(`${e}.service`),l=R(`${e}.navigation_path`),c=R(`${e}.url_path`);if(n)return`
        <div class="action-row disabled" data-action-key="${e}">
          <label>${t}</label>
          <div class="action-expand-badge">
            <ha-icon icon="mdi:arrow-expand-vertical"></ha-icon>
            <span>\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</span>
          </div>
        </div>
      `;let h="";return o==="call-service"?h=`
        <input type="text" placeholder="${this._escapeHtml(d?.placeholder||"domain.service")}" value="${this._escapeHtml(i.service||"")}" 
               data-action-key="${e}" data-field="service" class="action-extra-field">
      `:o==="navigate"?h=`
        <input type="text" placeholder="${this._escapeHtml(l?.placeholder||"/lovelace/view")}" value="${this._escapeHtml(i.navigation_path||"")}" 
               data-action-key="${e}" data-field="navigation_path" class="action-extra-field">
      `:o==="url"&&(h=`
        <input type="text" placeholder="${this._escapeHtml(c?.placeholder||"https://...")}" value="${this._escapeHtml(i.url_path||"")}" 
               data-action-key="${e}" data-field="url_path" class="action-extra-field">
      `),`
      <div class="action-row" data-action-key="${e}">
        <label>${t}</label>
        <select class="action-type-select" data-action-key="${e}">
          ${r.map(f=>`<option value="${f.value}" ${o===f.value?"selected":""}>${f.label}</option>`).join("")}
        </select>
        ${h}
      </div>
    `}_renderSwipeGesturesUI(){let e=this._config.swipe||{},t=e.enabled||e.left||e.right||e.up||e.down;return`
      <div class="feature-group collapsible ${t?"has-content":""}" data-feature="swipe">
        <div class="feature-group-header" data-toggle="swipe">
          <ha-icon icon="mdi:gesture-swipe-horizontal"></ha-icon>
          <span>\u0416\u0435\u0441\u0442\u044B \u0441\u0432\u0430\u0439\u043F\u0430</span>
          <span class="feature-badge">${t?"\u2713":""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="swipe-content">
          <p class="feature-hint">\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043F\u0440\u0438 \u0441\u0432\u0430\u0439\u043F\u0435 \u043F\u043E \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435</p>

          ${this._renderSchemaFields([["swipe.enabled","swipe.preventScroll"],["swipe.direction","swipe.threshold"],["swipe.velocityThreshold"],["swipe.left.action","swipe.right.action"],["swipe.up.action","swipe.down.action"]])}
        </div>
      </div>
    `}_renderBadgesUI(){let e=this._config.badges||[];return`
      <div class="feature-group collapsible ${e.length>0?"has-content":""}" data-feature="badges">
        <div class="feature-group-header" data-toggle="badges">
          <ha-icon icon="mdi:tag-multiple"></ha-icon>
          <span>\u0411\u0435\u0439\u0434\u0436\u0438</span>
          <span class="feature-badge">${e.length||""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="badges-content">
          <p class="feature-hint">\u041E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0439 \u0432 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</p>
          
          <div class="badges-list" id="badges-list">
            ${e.length?e.map((t,i)=>this._renderBadgeItem(t,i)).join(""):'<p class="feature-hint">\u041D\u0435\u0442 badges. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043F\u0435\u0440\u0432\u044B\u0439 badge \u043D\u0438\u0436\u0435.</p>'}
          </div>
          
          <button class="btn btn-small btn-add" data-action="add-badge">
            <ha-icon icon="mdi:plus"></ha-icon>
            \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0431\u0435\u0439\u0434\u0436
          </button>
        </div>
      </div>
    `}_renderBadgeItem(e,t){let i=e.type||"state",r=De(i),n=He(),o=Array.isArray(e.thresholds)?e.thresholds:[];return`
      <div class="badge-item" data-index="${t}">
        <div class="badge-item-header">
          <span class="badge-item-title">Badge ${t+1}</span>
          <button class="btn-icon btn-delete" data-action="delete-badge" data-index="${t}">
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
        <div class="badge-fields-grid">
          ${r.map(d=>this._renderBadgeField(d,e,t)).join("")}
        </div>
        <div class="badge-thresholds">
          <div class="badge-thresholds-header">
            <span>Thresholds</span>
            <span class="feature-badge">${o.length||""}</span>
          </div>
          <div class="badge-threshold-list">
            ${o.length?o.map((d,l)=>`
                <div class="badge-threshold-item" data-index="${t}" data-threshold-index="${l}">
                  ${n.map(c=>this._renderBadgeThresholdField(c,d,t,l)).join("")}
                  <button class="btn-icon btn-delete" data-action="delete-badge-threshold" data-index="${t}" data-threshold-index="${l}">
                    <ha-icon icon="mdi:delete"></ha-icon>
                  </button>
                </div>
              `).join(""):'<p class="feature-hint">\u041D\u0435\u0442 thresholds.</p>'}
          </div>
          <button class="btn btn-small btn-add" data-action="add-badge-threshold" data-index="${t}">
            <ha-icon icon="mdi:plus"></ha-icon>
            \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C threshold
          </button>
        </div>
      </div>
    `}_renderBadgeField(e,t,i){let r=this._getBadgeFieldKey(e.path),n=t[r];return this._renderBadgeContractField(e,n,{index:i,fieldKey:r,className:"badge-field"})}_renderBadgeThresholdField(e,t,i,r){let n=this._getBadgeThresholdFieldKey(e.path);return this._renderBadgeContractField(e,t[n],{index:i,fieldKey:n,className:"badge-field badge-threshold-field",thresholdIndex:r})}_renderBadgeContractField(e,t,i){let{index:r,fieldKey:n,className:o,thresholdIndex:d}=i,l=d!==void 0?`data-threshold-index="${d}"`:"";if(e.control==="checkbox"){let F=`${e.id}_${r}${d!==void 0?`_${d}`:""}`;return`
        <div class="field checkbox-field badge-field-block">
          <input type="checkbox"
                 id="${F}"
                 class="${o}"
                 data-field="${n}"
                 data-index="${r}"
                 ${l}
                 ${t?"checked":""}>
          <label for="${F}">${this._escapeHtml(e.label)}</label>
        </div>
      `}if(e.control==="select")return`
        <label class="badge-field-block">
          <span>${this._escapeHtml(e.label)}</span>
          <select class="${o}" data-field="${n}" data-index="${r}" ${l}>
            ${(e.options||[]).map(F=>`
              <option value="${this._escapeHtml(F.value)}" ${String(t??e.default??"")===F.value?"selected":""}>
                ${this._escapeHtml(F.label)}
              </option>
            `).join("")}
          </select>
        </label>
      `;let c=e.control==="number"?"number":"text",h=e.control==="entity"?'list="entities-list"':"",f=e.control==="number"&&e.min!==void 0?`min="${e.min}"`:"",k=e.control==="number"&&e.max!==void 0?`max="${e.max}"`:"",U=n==="entities"&&Array.isArray(t)?t.join(", "):t??"";return`
      <label class="badge-field-block">
        <span>${this._escapeHtml(e.label)}</span>
        <input type="${c}"
               value="${e.control==="number"?U:this._escapeHtml(String(U))}"
               placeholder="${this._escapeHtml(e.placeholder||"")}"
               class="${o}"
               data-field="${n}"
               data-index="${r}"
               ${l}
               ${h}
               ${f}
               ${k}>
      </label>
    `}_getBadgeFieldKey(e){let t=e.replace("badges.","");if(!Be(t))throw new Error(`Unsupported badge field: ${e}`);return t}_getBadgeThresholdFieldKey(e){let t=e.replace("badges.thresholds.","");if(!Ve(t))throw new Error(`Unsupported badge threshold field: ${e}`);return t}_renderAnimationPresetsUI(){let e=R("expand_animation"),t=R("collapse_animation"),i=R("cards_animation"),r=R("cards_stagger"),n=R("animation_duration"),o=this._config.expand_animation||e?.default||"slide",d=this._config.collapse_animation||t?.default||"slide",l=this._config.animation_duration??n?.default??300,c=this._config.cards_animation||i?.default||"fadeUp",h=this._config.cards_stagger??r?.default??50,f=z("expand_animation"),k=z("collapse_animation"),U=z("cards_animation"),F=o!=="none"||d!=="none"||c!=="none";return`
      <div class="feature-group collapsible ${F?"has-content":""}" data-feature="animation">
        <div class="feature-group-header" data-toggle="animation">
          <ha-icon icon="mdi:animation-play"></ha-icon>
          <span>\u0410\u043D\u0438\u043C\u0430\u0446\u0438\u0438</span>
          <span class="feature-badge">${F?"\u2713":""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="animation-content">
          
          <!-- Body Expand Animation -->
          <div class="animation-section">
            <label class="section-label">
              <ha-icon icon="mdi:arrow-expand-vertical"></ha-icon>
              \u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 body
            </label>
            <div class="animation-grid">
              ${f.map(L=>`
                <button class="animation-btn ${o===L.value?"active":""}" 
                        data-animation-type="expand" data-animation="${L.value}"
                        title="${L.label}">
                  <ha-icon icon="${L.icon}"></ha-icon>
                  <span>${L.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
          
          <!-- Body Collapse Animation -->
          <div class="animation-section">
            <label class="section-label">
              <ha-icon icon="mdi:arrow-collapse-vertical"></ha-icon>
              \u0421\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435 body
            </label>
            <div class="animation-grid">
              ${k.map(L=>`
                <button class="animation-btn ${d===L.value?"active":""}" 
                        data-animation-type="collapse" data-animation="${L.value}"
                        title="${L.label}">
                  <ha-icon icon="${L.icon}"></ha-icon>
                  <span>${L.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
          
          <hr class="section-divider">
          
          <!-- Cards Animation -->
          <div class="animation-section">
            <label class="section-label">
              <ha-icon icon="mdi:cards"></ha-icon>
              \u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A (\u043A\u0430\u0441\u043A\u0430\u0434)
            </label>
            <div class="animation-grid">
              ${U.map(L=>`
                <button class="animation-btn ${c===L.value?"active":""}" 
                        data-animation-type="cards" data-animation="${L.value}"
                        title="${L.label}">
                  <ha-icon icon="${L.icon}"></ha-icon>
                  <span>${L.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
          
          <!-- Cards Stagger Delay -->
          <div class="animation-duration-section">
            <label class="section-label">
              <ha-icon icon="mdi:sort-clock-ascending"></ha-icon>
              ${this._escapeHtml(r?.label||"\u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043C\u0435\u0436\u0434\u0443 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438")}
            </label>
            <div class="duration-row">
              <input type="range" id="cards_stagger_slider" 
                     min="${r?.min??0}" max="${r?.max??200}" step="10"
                     value="${h}">
              <span class="stagger-value">${h}ms</span>
            </div>
          </div>
          
          <!-- Cards Direction -->
          ${this._renderCardsDirectionUI()}
          
          <hr class="section-divider">
          
          <!-- Duration -->
          <div class="animation-duration-section">
            <label class="section-label">
              <ha-icon icon="mdi:timer-outline"></ha-icon>
              ${this._escapeHtml(n?.label||"\u041E\u0431\u0449\u0430\u044F \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C")}
            </label>
            <div class="duration-row">
              <input type="range" id="animation_duration_slider" 
                     min="${n?.min??0}" max="${n?.max??1e3}" step="50"
                     value="${l}">
              <span class="duration-value">${l}ms</span>
            </div>
          </div>
          
          <!-- Preview Button -->
          <button class="btn btn-preview-animation" data-action="preview-animation">
            <ha-icon icon="mdi:play-circle-outline"></ha-icon>
            \u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440
          </button>
        </div>
      </div>
    `}_renderCardsDirectionUI(){let e=R("cards_direction"),t=this._config.cards_direction||e?.default||"sequential",i=z("cards_direction");return`
      <div class="animation-section">
        <label class="section-label">
          <ha-icon icon="mdi:arrow-decision"></ha-icon>
          ${this._escapeHtml(e?.label||"\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u044F")}
        </label>
        <div class="direction-grid">
          ${i.map(r=>`
            <button class="direction-btn ${t===r.value?"active":""}" 
                    data-direction="${r.value}"
                    title="${r.label}">
              <ha-icon icon="${r.icon||"mdi:arrow-right"}"></ha-icon>
              <span>${r.label}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `}_renderAdvancedSection(){return`
      <div class="section">
        <h3>\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h3>

        ${this._renderSchemaFields(X.advanced)}
        
        <div class="subsection">
          <h4>YAML Preview</h4>
          <div class="yaml-preview">${this._getYamlPreview()}</div>
        </div>
      </div>
    `}_renderCardsList(e,t){return!e||!e.length?'<div class="empty-state">\u041D\u0435\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A</div>':e.map((i,r)=>{let n=this._inlineEditSection===t&&this._inlineEditIndex===r,o=r===0,d=r===e.length-1;return n?`
          <div class="card-item editing" data-section="${t}" data-index="${r}">
            <div class="inline-editor" id="inline-editor-${t}-${r}">
              <!-- Editor will be inserted here -->
            </div>
          </div>
        `:`
        <div class="card-item"
             data-section="${t}"
             data-index="${r}"
             draggable="true"
             tabindex="0"
             aria-label="Card ${r+1} in ${t}">
          <div class="card-item-content" data-action="edit-card-inline" data-section="${t}" data-index="${r}">
            <ha-icon icon="mdi:drag-vertical" class="drag-handle"></ha-icon>
            <span class="card-type">${this._escapeHtml(typeof i.type=="string"?i.type:"unknown")}</span>
            ${typeof i.entity=="string"&&i.entity?`<span class="card-entity">${this._escapeHtml(i.entity)}</span>`:""}
            ${typeof i.content=="string"&&i.content?`<span class="card-content-preview">${this._escapeHtml(i.content.substring(0,30))}...</span>`:""}
          </div>
          <div class="card-item-actions">
            <button class="btn-icon" data-action="move-card" data-direction="up" data-section="${t}" data-index="${r}" title="\u0421\u0434\u0432\u0438\u043D\u0443\u0442\u044C \u0432\u0432\u0435\u0440\u0445" ${o?"disabled":""}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>
            <button class="btn-icon" data-action="move-card" data-direction="down" data-section="${t}" data-index="${r}" title="\u0421\u0434\u0432\u0438\u043D\u0443\u0442\u044C \u0432\u043D\u0438\u0437" ${d?"disabled":""}>
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>
            <button class="btn-icon" data-action="edit-card-inline" data-section="${t}" data-index="${r}" title="\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C">
              <ha-icon icon="mdi:pencil"></ha-icon>
            </button>
            <button class="btn-icon btn-danger" data-action="delete-card" data-section="${t}" data-index="${r}" title="\u0423\u0434\u0430\u043B\u0438\u0442\u044C">
              <ha-icon icon="mdi:delete"></ha-icon>
            </button>
          </div>
        </div>
      `}).join("")}_renderSubEditorContainer(){return`
      <div class="sub-editor-container">
        <div class="sub-editor-header">
          <button class="btn btn-back" data-action="close-sub-editor">
            <ha-icon icon="mdi:arrow-left"></ha-icon>
            \u041D\u0430\u0437\u0430\u0434 \u043A \u0441\u043F\u0438\u0441\u043A\u0443
          </button>
          <span class="sub-editor-title">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</span>
        </div>
        <div class="sub-editor-content" id="sub-editor-slot">
          <!-- Card picker or editor will be inserted here -->
        </div>
      </div>
    `}async _initSubEditor(){let e=this.shadowRoot.getElementById("sub-editor-slot");if(!e)return;let t=this._editingCardSection,i=this._editingCardIndex;if(!(t!=="header"&&t!=="body")&&i!==null)if(i===-1)await this._showCardPicker(e,t);else{let n=this._getCardsForSection(t)[i];n&&await this._showCardEditor(e,n,t,i)}}async _showCardPicker(e,t){await this._tryShowHaCardPicker(e,t)||this._showFallbackCardPicker(e,t,"\u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0439 picker \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A.")}_showFallbackCardPicker(e,t,i=""){e.innerHTML=this._renderCardTypeSelector(t,i),this._bindCardTypeSelector(e,t)}async _tryShowHaCardPicker(e,t){if(!this._hass||(await this._loadCardHelpers(),!customElements.get("hui-card-picker")))return!1;try{e.innerHTML=`
        <div class="ha-picker-wrapper">
          <div class="picker-tools">
            <button class="btn btn-add btn-small" type="button" id="use-fallback-picker">
              <ha-icon icon="mdi:view-grid"></ha-icon>
              \u0421\u043F\u0438\u0441\u043E\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A
            </button>
          </div>
          <div id="ha-card-picker-slot"></div>
        </div>
      `;let i=E(e,"#ha-card-picker-slot");if(!i)return!1;let r=document.createElement("hui-card-picker");r.hass=this._hass,r.lovelace=this._getLovelace(),r.path=[],r.addEventListener("config-changed",o=>{let d=o.detail?.config;!d||!d.type||this._handlePickedCardConfig(t,d)}),i.appendChild(r);let n=E(e,"#use-fallback-picker");return n&&n.addEventListener("click",()=>{this._showFallbackCardPicker(e,t)}),!0}catch(i){return console.warn("[UC Editor] Could not render hui-card-picker:",i),!1}}_handlePickedCardConfig(e,t){if(!ye(t))return;let i=D(t);i.type=this._normalizeCardType(i.type),i.type&&(this._addCardConfig(e,i),this._closeSubEditor())}async _loadCardHelpers(){if(this._cardHelpers)return this._cardHelpers;try{if(window.loadCardHelpers)return this._cardHelpers=await window.loadCardHelpers(),this._cardHelpers}catch(e){console.warn("[UC Editor] Could not load card helpers:",e)}return null}_getLovelace(){let e=null,t=document;if(t.__lovelace&&(e=t.__lovelace),!e){let i=E(document,"home-assistant");if(je(i)){let r=E(i.shadowRoot,"home-assistant-main");if(je(r)){let n=E(r.shadowRoot,"ha-panel-lovelace");n&&(e=n.lovelace)}}}return(!e||!e.config||!Array.isArray(e.config.views))&&(e={config:{views:[{cards:[]}]},editMode:!0}),e}_getAllAvailableCards(){let e=[];[{type:"alarm-panel",name:"Alarm Panel",description:"\u041F\u0430\u043D\u0435\u043B\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043E\u0445\u0440\u0430\u043D\u043D\u043E\u0439 \u0441\u0438\u0433\u043D\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0435\u0439",icon:"mdi:shield"},{type:"area",name:"Area",description:"\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",icon:"mdi:texture-box"},{type:"button",name:"Button",description:"\u041A\u043D\u043E\u043F\u043A\u0430 \u0434\u043B\u044F \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439",icon:"mdi:gesture-tap-button"},{type:"calendar",name:"Calendar",description:"\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C \u0441\u043E\u0431\u044B\u0442\u0438\u0439",icon:"mdi:calendar"},{type:"conditional",name:"Conditional",description:"\u0423\u0441\u043B\u043E\u0432\u043D\u043E\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",icon:"mdi:help-circle-outline"},{type:"entities",name:"Entities",description:"\u0421\u043F\u0438\u0441\u043E\u043A \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",icon:"mdi:view-list"},{type:"entity",name:"Entity",description:"\u041E\u0434\u043D\u0430 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044C",icon:"mdi:square-rounded"},{type:"entity-filter",name:"Entity Filter",description:"\u0424\u0438\u043B\u044C\u0442\u0440 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",icon:"mdi:filter"},{type:"gauge",name:"Gauge",description:"\u0414\u0430\u0442\u0447\u0438\u043A \u0441\u043E \u0448\u043A\u0430\u043B\u043E\u0439",icon:"mdi:gauge"},{type:"glance",name:"Glance",description:"\u041E\u0431\u0437\u043E\u0440 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",icon:"mdi:eye"},{type:"grid",name:"Grid",description:"\u0421\u0435\u0442\u043A\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A",icon:"mdi:view-grid"},{type:"history-graph",name:"History Graph",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u0438\u0441\u0442\u043E\u0440\u0438\u0438",icon:"mdi:chart-line"},{type:"horizontal-stack",name:"Horizontal Stack",description:"\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430",icon:"mdi:arrow-split-vertical"},{type:"humidifier",name:"Humidifier",description:"\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0443\u0432\u043B\u0430\u0436\u043D\u0438\u0442\u0435\u043B\u0435\u043C",icon:"mdi:air-humidifier"},{type:"iframe",name:"iFrame",description:"\u0412\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 iframe",icon:"mdi:application"},{type:"light",name:"Light",description:"\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0441\u0432\u0435\u0449\u0435\u043D\u0438\u0435\u043C",icon:"mdi:lightbulb"},{type:"logbook",name:"Logbook",description:"\u0416\u0443\u0440\u043D\u0430\u043B \u0441\u043E\u0431\u044B\u0442\u0438\u0439",icon:"mdi:script-text"},{type:"map",name:"Map",description:"\u041A\u0430\u0440\u0442\u0430 \u0441 \u0442\u0440\u0435\u043A\u0435\u0440\u0430\u043C\u0438",icon:"mdi:map"},{type:"markdown",name:"Markdown",description:"\u0422\u0435\u043A\u0441\u0442 \u0441 \u0444\u043E\u0440\u043C\u0430\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\u043C",icon:"mdi:language-markdown"},{type:"media-control",name:"Media Control",description:"\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u0435\u0434\u0438\u0430\u043F\u043B\u0435\u0435\u0440\u043E\u043C",icon:"mdi:play-pause"},{type:"picture",name:"Picture",description:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",icon:"mdi:image"},{type:"picture-elements",name:"Picture Elements",description:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u043C\u0438",icon:"mdi:image-text"},{type:"picture-entity",name:"Picture Entity",description:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438",icon:"mdi:image-outline"},{type:"picture-glance",name:"Picture Glance",description:"\u041E\u0431\u0437\u043E\u0440 \u0441 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435\u043C",icon:"mdi:image-multiple"},{type:"plant-status",name:"Plant Status",description:"\u0421\u0442\u0430\u0442\u0443\u0441 \u0440\u0430\u0441\u0442\u0435\u043D\u0438\u044F",icon:"mdi:flower"},{type:"sensor",name:"Sensor",description:"\u0421\u0435\u043D\u0441\u043E\u0440",icon:"mdi:eye"},{type:"shopping-list",name:"Shopping List",description:"\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u043E\u043A\u0443\u043F\u043E\u043A",icon:"mdi:cart"},{type:"statistic",name:"Statistic",description:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430",icon:"mdi:chart-bar"},{type:"statistics-graph",name:"Statistics Graph",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438",icon:"mdi:chart-line-variant"},{type:"thermostat",name:"Thermostat",description:"\u0422\u0435\u0440\u043C\u043E\u0441\u0442\u0430\u0442",icon:"mdi:thermostat"},{type:"tile",name:"Tile",description:"\u041F\u043B\u0438\u0442\u043A\u0430",icon:"mdi:square-rounded"},{type:"todo-list",name:"Todo List",description:"\u0421\u043F\u0438\u0441\u043E\u043A \u0434\u0435\u043B",icon:"mdi:format-list-checks"},{type:"vertical-stack",name:"Vertical Stack",description:"\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430",icon:"mdi:arrow-split-horizontal"},{type:"weather-forecast",name:"Weather Forecast",description:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u043F\u043E\u0433\u043E\u0434\u044B",icon:"mdi:weather-cloudy"},{type:"energy-date-selection",name:"Energy Date",description:"\u0412\u044B\u0431\u043E\u0440 \u0434\u0430\u0442\u044B \u044D\u043D\u0435\u0440\u0433\u0438\u0438",icon:"mdi:calendar-range"},{type:"energy-usage-graph",name:"Energy Usage",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u0435\u043D\u0438\u044F",icon:"mdi:lightning-bolt"},{type:"energy-solar-graph",name:"Energy Solar",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u0441\u043E\u043B\u043D\u0435\u0447\u043D\u043E\u0439 \u044D\u043D\u0435\u0440\u0433\u0438\u0438",icon:"mdi:solar-power"},{type:"energy-gas-graph",name:"Energy Gas",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u0435\u043D\u0438\u044F \u0433\u0430\u0437\u0430",icon:"mdi:fire"},{type:"energy-water-graph",name:"Energy Water",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u0435\u043D\u0438\u044F \u0432\u043E\u0434\u044B",icon:"mdi:water"},{type:"energy-devices-graph",name:"Energy Devices",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432",icon:"mdi:devices"},{type:"energy-sources-table",name:"Energy Sources",description:"\u0422\u0430\u0431\u043B\u0438\u0446\u0430 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u043E\u0432",icon:"mdi:table"},{type:"energy-distribution",name:"Energy Distribution",description:"\u0420\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u044D\u043D\u0435\u0440\u0433\u0438\u0438",icon:"mdi:chart-sankey"}].forEach(r=>{e.push({type:r.type,name:r.name,description:r.description,icon:r.icon,isCustom:!1})}),window.customCards&&Array.isArray(window.customCards)&&window.customCards.forEach(r=>{e.find(n=>n.type===r.type)||e.push({type:r.type,name:r.name||r.type,description:r.description||"",icon:r.preview||"mdi:puzzle",isCustom:!0})});let i=[];return typeof customElements<"u"&&["hui-","ha-","mushroom-","mini-","apexcharts-","bubble-","button-card","card-mod","decluttering-card","auto-entities","layout-card","stack-in-card","fold-entity-row","slider-entity-row","multiple-entity-row","simple-thermostat","weather-card","clock-weather-card","atomic-calendar","vacuum-card","bar-card","uptime-card","flex-horseshoe-card","restriction-card","state-switch","swipe-card","tabbed-card","vertical-stack-in-card","xiaomi-vacuum-map-card","lovelace-","sankey-chart","plotly-graph","power-flow-card","sunsynk-power-flow-card","lg-webos-remote-control","roku-card","frigate-card","webrtc-camera"].forEach(n=>{try{customElements.get(n)&&!e.find(o=>o.type===`custom:${n}`)&&e.push({type:`custom:${n}`,name:n.replace(/-/g," ").replace(/card$/i,"").trim(),description:"Custom card",icon:"mdi:puzzle",isCustom:!0})}catch{}}),e.sort((r,n)=>r.isCustom===n.isCustom?r.name.localeCompare(n.name):r.isCustom?1:-1),e}_renderCardTypeSelector(e,t=""){let i=this._getAllAvailableCards(),r=i.filter(d=>!d.isCustom),n=i.filter(d=>d.isCustom);return`
      <div class="card-picker-container">
        <div class="picker-tools">
          ${!!(this._hass&&customElements.get("hui-card-picker"))?`
            <button class="btn btn-small" type="button" id="use-ha-picker">
              <ha-icon icon="mdi:home-assistant"></ha-icon>
              \u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0439 picker
            </button>
          `:""}
          ${t?`<div class="picker-fallback-note">${this._escapeHtml(t)}</div>`:""}
        </div>

        <div class="card-picker-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input type="text" id="card-search" placeholder="\u041F\u043E\u0438\u0441\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A..." autocomplete="off">
        </div>
        
        <div class="card-picker-sections">
          <div class="card-section">
            <h4 class="card-section-title">
              <ha-icon icon="mdi:home-assistant"></ha-icon>
              \u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 (${r.length})
            </h4>
            <div class="card-type-grid" data-section="builtin">
              ${r.map(d=>this._renderCardTypeButton(d,e)).join("")}
            </div>
          </div>
          
          ${n.length>0?`
            <div class="card-section">
              <h4 class="card-section-title">
                <ha-icon icon="mdi:puzzle"></ha-icon>
                \u041A\u0430\u0441\u0442\u043E\u043C\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 (${n.length})
              </h4>
              <div class="card-type-grid" data-section="custom">
                ${n.map(d=>this._renderCardTypeButton(d,e)).join("")}
              </div>
            </div>
          `:""}
        </div>
        
        <div class="custom-type-input">
          <h4>
            <ha-icon icon="mdi:code-tags"></ha-icon>
            \u0423\u043A\u0430\u0437\u0430\u0442\u044C \u0442\u0438\u043F \u0432\u0440\u0443\u0447\u043D\u0443\u044E
          </h4>
          <div class="custom-type-row">
            <input type="text" id="custom-card-type" placeholder="custom:my-card \u0438\u043B\u0438 entities">
            <button class="btn btn-add" type="button" id="add-custom-card">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C</button>
          </div>
        </div>
      </div>
    `}_renderCardTypeButton(e,t){let i=typeof e.icon=="string"&&e.icon.startsWith("mdi:")?e.icon:"mdi:card-outline";return`
      <button class="card-type-btn ${e.isCustom?"custom":""}" 
              type="button"
              data-type="${this._escapeHtml(e.type)}" 
              data-section="${t}"
              title="${this._escapeHtml(e.description||e.name||e.type)}">
        <ha-icon icon="${i}"></ha-icon>
        <span class="card-name">${this._escapeHtml(e.name)}</span>
        ${e.isCustom?'<span class="custom-badge">CUSTOM</span>':""}
      </button>
    `}_bindCardTypeSelector(e,t){let i=E(e,"#use-ha-picker");i&&i.addEventListener("click",async()=>{await this._tryShowHaCardPicker(e,t)||this._showFallbackCardPicker(e,t,"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0441\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0439 picker, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A.")});let r=E(e,"#card-search");r&&r.addEventListener("input",o=>{let d=V(o.target)?o.target:null;if(!d)return;let l=d.value.toLowerCase().trim();g(e,".card-type-btn").forEach(c=>{let h=E(c,".card-name")?.textContent?.toLowerCase()||"",f=c.dataset.type?.toLowerCase()||"",k=h.includes(l)||f.includes(l);c.style.display=k?"":"none"})}),e.addEventListener("click",o=>{let d=o.target;if(!(d instanceof Element))return;let l=d.closest(".card-type-btn");if(!l||!e.contains(l)||!(l instanceof HTMLElement))return;let c=l.dataset.type,h=this._getDefaultCardConfig(c);this._addCardConfig(t,h),this._closeSubEditor()});let n=E(e,"#add-custom-card");if(n){n.addEventListener("click",()=>{let l=E(e,"#custom-card-type")?.value?.trim();l&&(this._addCardConfig(t,{type:this._normalizeCardType(l)}),this._closeSubEditor())});let o=E(e,"#custom-card-type");o&&o.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),n.click())})}}_getDefaultCardConfig(e){let t=this._normalizeCardType(e),r={markdown:{type:"markdown",content:"\u041D\u043E\u0432\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430"},entities:{type:"entities",entities:[]},button:{type:"button",tap_action:{action:"toggle"}},gauge:{type:"gauge",entity:""},glance:{type:"glance",entities:[]},"history-graph":{type:"history-graph",entities:[]},light:{type:"light",entity:""},"media-control":{type:"media-control",entity:""},picture:{type:"picture",image:""},sensor:{type:"sensor",entity:""},thermostat:{type:"thermostat",entity:""},"weather-forecast":{type:"weather-forecast",entity:""}}[t];return r?D(r):{type:t}}_normalizeCardType(e){let t=typeof e=="string"?e.trim():"";return t?t.startsWith("custom:")||this._isBuiltInCardType(t)?t:(Array.isArray(window.customCards)?window.customCards:[]).some(n=>{let o=typeof n?.type=="string"?n.type.trim():"";return o?o===t||o===`custom:${t}`:!1})?`custom:${t}`:t:""}_isBuiltInCardType(e){return this._getAllAvailableCards().some(i=>!i.isCustom&&i.type===e)}async _showCardEditor(e,t,i,r){let n=t.type||"",o=this._configToYaml(t),d=this._inlineEditSection!==null;e.innerHTML=`
      <div class="card-editor-toolbar">
        <span class="editor-title">
          <ha-icon icon="mdi:code-braces"></ha-icon>
          ${this._escapeHtml(n)}
        </span>
        <div class="editor-actions">
          <button class="editor-btn cancel" data-action="cancel-inline" title="\u041E\u0442\u043C\u0435\u043D\u0430">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
          <button class="editor-btn save" data-action="save-inline" title="\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C">
            <ha-icon icon="mdi:check"></ha-icon>
          </button>
        </div>
      </div>
      <div class="code-editor-wrapper" id="code-editor-slot"></div>
    `;let l=E(e,"#code-editor-slot"),c=null;if(!l)return;customElements.get("ha-code-editor")?(c=document.createElement("ha-code-editor"),c.mode="yaml",c.autofocus=!0,c.autocompleteEntities=!0,c.autocompleteIcons=!0,c.value=o,this._hass&&(c.hass=this._hass),l.appendChild(c)):l.innerHTML=`<textarea class="yaml-fallback-editor">${this._escapeHtml(o)}</textarea>`;let h=E(e,'[data-action="save-inline"]');h&&h.addEventListener("click",()=>{try{let k="";c?k=c.value:k=E(e,".yaml-fallback-editor")?.value||"";let U=this._yamlToConfig(k);this._updateCardConfig(i,r,U),d?this._closeInlineEditor():this._closeSubEditor()}catch(k){alert(`\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 YAML: ${Fe(k,"Invalid YAML")}`)}});let f=E(e,'[data-action="cancel-inline"]');f&&f.addEventListener("click",()=>{d?this._closeInlineEditor():this._closeSubEditor()})}_renderTabsEditor(){return`
      <div class="subsection">
        <h4>\u0412\u043A\u043B\u0430\u0434\u043A\u0438</h4>
        <div class="tabs-list">
          ${(this._config.tabs||[]).map((e,t)=>`
            <div class="tab-item">
              <input type="text" value="${this._escapeHtml(e.label||"")}" placeholder="\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0432\u043A\u043B\u0430\u0434\u043A\u0438" 
                     data-tab-index="${t}" data-field="label">
              <button class="btn-icon" data-action="delete-tab" data-index="${t}">
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `).join("")}
        </div>
        <button class="btn btn-add" data-action="add-tab">
          <ha-icon icon="mdi:plus"></ha-icon>
          \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u043A\u043B\u0430\u0434\u043A\u0443
        </button>
      </div>
    `}_renderCarouselEditor(){return`
      <div class="subsection">
        <h4>\u041A\u0430\u0440\u0443\u0441\u0435\u043B\u044C</h4>

        ${this._renderSchemaFields(X.carousel)}
      </div>
    `}_escapeHtml(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}_getModeLabel(e){return{[x.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 (expand)",[x.MODAL]:"\u041C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u043D\u043E (modal)",[x.FULLSCREEN]:"\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u044B\u0439 (fullscreen)",[x.TABS]:"\u0412\u043A\u043B\u0430\u0434\u043A\u0438 (tabs)",[x.CAROUSEL]:"\u041A\u0430\u0440\u0443\u0441\u0435\u043B\u044C (carousel)",[x.SUBVIEW]:"Subview",[x.NONE]:"\u0422\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A (none)"}[e]||e}_getThemeLabel(e){return{[p.DEFAULT]:"\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",[p.TRANSPARENT]:"\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u0430\u044F",[p.SOLID]:"\u041E\u0431\u044B\u0447\u043D\u0430\u044F",[p.GLASS]:"\u0421\u0442\u0435\u043A\u043B\u043E",[p.GLASSMORPHISM]:"Glassmorphism",[p.NEUMORPHISM]:"Neumorphism",[p.MINIMAL]:"\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u0438\u0437\u043C",[p.GRADIENT]:"\u0413\u0440\u0430\u0434\u0438\u0435\u043D\u0442",[p.DARK]:"\u0422\u0451\u043C\u043D\u0430\u044F",[p.NEON]:"\u041D\u0435\u043E\u043D",[p.AURORA]:"\u0410\u0432\u0440\u043E\u0440\u0430",[p.CARBON]:"Carbon",[p.SLATE]:"Slate",[p.OBSIDIAN]:"Obsidian",[p.CHARCOAL]:"Charcoal",[p.MIDNIGHT]:"Midnight",[p.CYBER]:"Cyber",[p.VOID]:"Void",[p.EMBER]:"Ember",[p.FOREST]:"Forest",[p.OCEAN]:"Ocean",[p.PURPLE_HAZE]:"Purple Haze",[p.MATRIX]:"Matrix",[p.GRAPHITE]:"Graphite",[p.SMOKE]:"Smoke",[p.NORD]:"Nord",[p.DRACULA]:"Dracula",[p.MONOKAI]:"Monokai",[p.TOKYO_NIGHT]:"Tokyo Night",[p.CATPPUCCIN]:"Catppuccin"}[e]||e}_getThemePreviewStyle(){let e=this._config.theme||p.DEFAULT,t=Ae(e),i=this._getThemeTokenStyleOverrides();return`${t} ${i}`.trim()}_getThemeTokenStyleOverrides(){let e=/^--[a-z0-9_-]+$/i;return Object.entries(this._config.theme_tokens||{}).filter(([t,i])=>e.test(t)&&typeof i=="string"&&i.trim()).map(([t,i])=>`${t}: ${i.trim()};`).join(" ")}_renderLiveInspector(){return`
      <div class="live-inspector">
        ${this._renderLiveInspectorContent()}
      </div>
    `}_renderLiveInspectorContent(){let e=this._collectLintMessages(),t=this._config.body_mode||x.EXPAND,i=this._config.header?.cards?.length||0,r=this._config.body?.cards?.length||0,n=this._config.footer?.cards?.length||0,o=this._config.theme||p.DEFAULT,d=e.errors.length>0?"has-errors":e.warnings.length>0?"has-warnings":"is-clean";return`
      <div class="live-inspector-title-row">
        <h4>Live Preview & Lint</h4>
      </div>

      <div class="live-preview-card" style="${this._escapeHtml(this._getThemePreviewStyle())}">
        <div class="live-preview-header-row">
          <span class="live-title">${this._escapeHtml(this._config.title||"Universal Card")}</span>
          <span class="live-mode">${this._escapeHtml(this._getModeLabel(t))}</span>
        </div>
        <div class="live-preview-meta">
          <span>Theme: <strong>${this._escapeHtml(this._getThemeLabel(o))}</strong></span>
          <span>Header cards: <strong>${i}</strong></span>
          <span>Body cards: <strong>${r}</strong></span>
          <span>Footer cards: <strong>${n}</strong></span>
        </div>
      </div>

      <div class="lint-panel ${d}">
        <div class="lint-header">
          <span>Lint</span>
          <span class="lint-summary">
            ${e.errors.length} errors \xB7 ${e.warnings.length} warnings
          </span>
        </div>
        <div class="lint-list">
          ${this._renderLintItems(e)}
        </div>
      </div>
    `}_renderLintItems(e){let t=[...e.errors.map(i=>({...i,level:"error"})),...e.warnings.map(i=>({...i,level:"warning"})),...e.info.map(i=>({...i,level:"info"}))];return t.length===0?'<div class="lint-item level-info">\u041F\u0440\u043E\u0431\u043B\u0435\u043C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E</div>':t.map(i=>`
      <div class="lint-item level-${i.level}">
        <span class="lint-level">${i.level.toUpperCase()}</span>
        <span class="lint-message">${this._escapeHtml(i.message||"")}</span>
      </div>
    `).join("")}_collectLintMessages(){let e={errors:[],warnings:[],info:[]};try{K.validate(this._config)}catch(o){e.errors.push({message:Fe(o,"Configuration validation failed")})}let t=this._config.body_mode||x.EXPAND,i=this._config.body?.cards||[],r=this._config.tabs||[],n=/^--[a-z0-9_-]+$/i;return t!==x.NONE&&i.length===0&&t!==x.TABS&&e.warnings.push({message:"Body mode \u0432\u043A\u043B\u044E\u0447\u0435\u043D, \u043D\u043E \u0432 body.cards \u043D\u0435\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A"}),t===x.TABS&&r.length===0&&e.warnings.push({message:"\u0420\u0435\u0436\u0438\u043C tabs \u0432\u044B\u0431\u0440\u0430\u043D, \u043D\u043E tabs[] \u043F\u0443\u0441\u0442\u043E\u0439"}),t===x.CAROUSEL&&i.length<2&&e.info.push({message:"\u0414\u043B\u044F \u043A\u0430\u0440\u0443\u0441\u0435\u043B\u0438 \u043E\u0431\u044B\u0447\u043D\u043E \u043D\u0443\u0436\u043D\u043E 2+ \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438"}),Object.entries(this._config.theme_tokens||{}).forEach(([o,d])=>{n.test(o)||e.warnings.push({message:`\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0438\u043C\u044F theme token: ${o}`}),(typeof d!="string"||d.trim()==="")&&e.warnings.push({message:`\u041F\u0443\u0441\u0442\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0434\u043B\u044F theme token: ${o}`})}),e}_updateLiveInspector(){let e=this.shadowRoot.querySelector(".live-inspector");e&&(e.innerHTML=this._renderLiveInspectorContent())}_getYamlPreview(){let e=this._configToYaml(this._config);return this._highlightYaml(e)}_configToYaml(e,t=0){let i="  ".repeat(t),r="";for(let[n,o]of Object.entries(e))o!=null&&(Array.isArray(o)?o.length===0?r+=`${i}${n}: []
`:(r+=`${i}${n}:
`,o.forEach(d=>{typeof d=="object"?(r+=`${i}  -
`,r+=this._configToYaml(d,t+2)):r+=`${i}  - ${d}
`})):typeof o=="object"?(r+=`${i}${n}:
`,r+=this._configToYaml(o,t+1)):typeof o=="string"&&(o.includes(":")||o.includes("#")||o.includes(`
`))?r+=`${i}${n}: "${o}"
`:r+=`${i}${n}: ${o}
`);return r}_yamlToConfig(e){let t=e.split(`
`),i={},r=i,n=[{obj:i,indent:-1}];for(let o of t){if(!o.trim()||o.trim().startsWith("#"))continue;let d=o.search(/\S/),l=o.trim();for(;n.length>1&&n[n.length-1].indent>=d;)n.pop();if(r=n[n.length-1].obj,l.startsWith("- ")){let c=l.substring(2).trim();if(Array.isArray(r))if(c)r.push(this._parseYamlValue(c));else{let h={};r.push(h),n.push({obj:h,indent:d})}}else if(l.includes(":")){let c=l.indexOf(":"),h=l.substring(0,c).trim(),f=l.substring(c+1).trim();if(f===""||f==="[]")f==="[]"?r[h]=[]:(r[h]={},n.push({obj:r[h],indent:d}));else if(f.startsWith("[")||f.startsWith("{"))try{r[h]=JSON.parse(f)}catch{r[h]=f}else r[h]=this._parseYamlValue(f)}}return i}_parseYamlValue(e){return e==="true"?!0:e==="false"?!1:e==="null"?null:/^-?\d+$/.test(e)?parseInt(e,10):/^-?\d+\.\d+$/.test(e)?parseFloat(e):e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'")?e.slice(1,-1):e}_highlightYaml(e){return e.replace(/^(\s*)([a-z_]+)(:)/gmi,'$1<span class="yaml-key">$2</span>$3').replace(/: (.+)$/gm,': <span class="yaml-value">$1</span>').replace(/^(\s*-\s)(.+)$/gm,'$1<span class="yaml-value">$2</span>').replace(/\n/g,"<br>")}_addCardConfig(e,t){let i=[...this._getCardsForSection(e),t];this._setCardsForSection(e,i),this._pushHistory(this._config),this._fireConfigChangedAndRender()}_updateCardConfig(e,t,i){let r=[...this._getCardsForSection(e)];r[t]&&(r[t]=i,this._setCardsForSection(e,r),this._pushHistory(this._config),this._fireConfigChangedAndRender())}_deleteCard(e,t){let i=this._getCardsForSection(e);if(!i[t])return;let r=i.filter((n,o)=>o!==t);this._setCardsForSection(e,r),this._pushHistory(this._config),this._fireConfigChangedAndRender()}_moveCard(e,t,i){let r=this._getCardsForSection(e);if(!Array.isArray(r)||t===i||t<0||t>=r.length||i<0||i>=r.length)return;let n=[...r],[o]=n.splice(t,1);n.splice(i,0,o),this._config={...this._config,...e==="header"?{header:{...this._config.header||{},cards:n}}:{body:{...this._config.body||{},cards:n}}},this._dragState=null,this._pushHistory(this._config),this._fireConfigChangedAndRender()}_openCardEditor(e,t){this._editingCardSection=e,this._editingCardIndex=t,this._showSubEditor=!0,this._render()}_closeSubEditor(){this._showSubEditor=!1,this._editingCardIndex=null,this._editingCardSection=null,this._subEditor=null,this._inlineEditSection=null,this._inlineEditIndex=null,this._render()}_openInlineEditor(e,t){this._inlineEditSection!==null&&this._closeInlineEditor(),this._inlineEditSection=e,this._inlineEditIndex=t,this._render(),requestAnimationFrame(()=>{this._initInlineEditor(e,t)})}_closeInlineEditor(){this._inlineEditSection=null,this._inlineEditIndex=null,this._render()}async _initInlineEditor(e,t){let i=this.shadowRoot.getElementById(`inline-editor-${e}-${t}`);if(!i)return;let n=this._getCardsForSection(e)[t];n&&await this._showCardEditor(i,n,e,t)}_addCard(e){this._openCardEditor(e,-1)}_bindEvents(){g(this.shadowRoot,".tab-item").forEach(e=>{e.addEventListener("click",()=>{this._showSubEditor&&this._closeSubEditor();let t=e.dataset.section;t&&(this._activeSection=t,this._render())})}),g(this.shadowRoot,".toolbar-btn").forEach(e=>{e.addEventListener("click",()=>this._handleToolbarAction(e.dataset.action))}),g(this.shadowRoot,'input[type="text"], input[type="number"]').forEach(e=>{e.addEventListener("input",t=>this._handleInputChange(t))}),g(this.shadowRoot,'input[type="checkbox"], select').forEach(e=>{e.addEventListener("change",t=>this._handleInputChange(t))}),g(this.shadowRoot,"ha-icon-picker[data-name]").forEach(e=>{e.hass=this._hass,e.value=e.dataset.value||"",e.addEventListener("value-changed",t=>this._handleIconPickerChange(t))}),g(this.shadowRoot,'[data-action="clear-icon"]').forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.path;t&&(this._config=this._setNestedValue(this._config,t.split("."),void 0),this._fireConfigChangedAndRender())})}),g(this.shadowRoot,'[data-action="add-header-card"]').forEach(e=>{e.addEventListener("click",()=>this._addCard("header"))}),g(this.shadowRoot,'[data-action="add-body-card"]').forEach(e=>{e.addEventListener("click",()=>this._addCard("body"))}),g(this.shadowRoot,'[data-action="edit-card"]').forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.section,i=parseInt(e.dataset.index,10);t!=="header"&&t!=="body"||!t||Number.isNaN(i)||this._openCardEditor(t,i)})}),g(this.shadowRoot,'[data-action="edit-card-inline"]').forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let i=e.dataset.section,r=parseInt(e.dataset.index,10);i!=="header"&&i!=="body"||!i||Number.isNaN(r)||this._openInlineEditor(i,r)})}),g(this.shadowRoot,'[data-action="delete-card"]').forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.section,i=parseInt(e.dataset.index,10);(t==="header"||t==="body")&&!Number.isNaN(i)&&confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443?")&&this._deleteCard(t,i)})}),g(this.shadowRoot,'[data-action="move-card"]').forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let i=e.dataset.section,r=parseInt(e.dataset.index,10),n=e.dataset.direction;if(i!=="header"&&i!=="body"||!i||Number.isNaN(r))return;let o=n==="up"?r-1:r+1;this._moveCard(i,r,o)})}),g(this.shadowRoot,'[data-action="close-sub-editor"]').forEach(e=>{e.addEventListener("click",()=>this._closeSubEditor())}),g(this.shadowRoot,"[data-tab-index]").forEach(e=>{e.addEventListener("input",t=>{let i=V(t.target)?t.target:null,r=parseInt(i?.dataset.tabIndex||"",10),n=i?.dataset.field;if(!i||!n||Number.isNaN(r)||!yt(n))return;let o=this._config.tabs?[...this._config.tabs]:[];o[r]||(o[r]={});let d={...o[r]};Ct(d,n,i.value),o[r]=d,this._config={...this._config,tabs:o},this._fireConfigChanged()})}),g(this.shadowRoot,'[data-action="add-tab"]').forEach(e=>{e.addEventListener("click",()=>{let t=this._config.tabs?[...this._config.tabs]:[];t.push({label:`\u0412\u043A\u043B\u0430\u0434\u043A\u0430 ${t.length+1}`}),this._config={...this._config,tabs:t},this._pushHistory(this._config),this._fireConfigChangedAndRender()})}),g(this.shadowRoot,'[data-action="delete-tab"]').forEach(e=>{e.addEventListener("click",()=>{let t=parseInt(e.dataset.index,10);if(this._config.tabs){let i=this._config.tabs.filter((r,n)=>n!==t);this._config={...this._config,tabs:i},this._pushHistory(this._config),this._fireConfigChangedAndRender()}})}),g(this.shadowRoot,".feature-group-header[data-toggle]").forEach(e=>{e.addEventListener("click",()=>{let t=e.closest(".feature-group");t instanceof HTMLElement&&t.classList.toggle("expanded")})}),this._bindVisibilityConditions(),this._bindThemeTokens(),this._bindStateStyles(),this._bindActions(),this._bindSwipeGestures(),this._bindBadges(),this._bindAnimationPresets(),this._bindCardReordering(),this._updateLiveInspector()}_bindCardReordering(){g(this.shadowRoot,".cards-list .card-item:not(.editing)").forEach(t=>{t.addEventListener("dragstart",i=>{let r=t.dataset.section,n=parseInt(t.dataset.index,10);!r||Number.isNaN(n)||(this._dragState={section:r,index:n},t.classList.add("dragging"),i.dataTransfer&&(i.dataTransfer.effectAllowed="move",i.dataTransfer.setData("text/plain",`${r}:${n}`)))}),t.addEventListener("dragover",i=>{this._dragState&&this._dragState.section===t.dataset.section&&(i.preventDefault(),t.classList.add("drop-target"))}),t.addEventListener("dragleave",()=>{t.classList.remove("drop-target")}),t.addEventListener("drop",i=>{i.preventDefault();let r=t.dataset.section,n=parseInt(t.dataset.index,10);t.classList.remove("drop-target"),!(!this._dragState||!r||Number.isNaN(n))&&(r!=="header"&&r!=="body"||this._dragState.section===r&&this._moveCard(r,this._dragState.index,n))}),t.addEventListener("dragend",()=>{this._dragState=null,g(this.shadowRoot,".card-item.dragging, .card-item.drop-target").forEach(i=>{i.classList.remove("dragging","drop-target")})}),t.addEventListener("keydown",i=>{if(!i.altKey||i.key!=="ArrowUp"&&i.key!=="ArrowDown")return;let r=t.dataset.section,n=parseInt(t.dataset.index,10);if(r!=="header"&&r!=="body"||!r||Number.isNaN(n))return;i.preventDefault();let o=i.key==="ArrowUp"?n-1:n+1;this._moveCard(r,n,o)})})}_bindVisibilityConditions(){g(this.shadowRoot,'[data-action="add-visibility-condition"]').forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.scope||"global",i=e.dataset.parentPath||"",n=E(e.parentElement||this.shadowRoot,".condition-type-select")?.value;!n||!fe(t)||!Ue(n)||this._addVisibilityCondition(t,i,n)})}),g(this.shadowRoot,'[data-action="delete-condition"]').forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.scope||"global",i=e.dataset.path||"";if(!i||!fe(t))return;let r=this._getVisibilityConditionsByScope(t),n=this._removeVisibilityPathValue(r,this._parseVisibilityPath(i));this._setVisibilityConditionsByScope(t,n,!0)})}),g(this.shadowRoot,".condition-item").forEach(e=>{let t=e.dataset.scope||"global",i=e.dataset.path||"";!i||!fe(t)||g(e,".cond-field").forEach(r=>{r.addEventListener("change",()=>{this._updateConditionField(t,i,e)}),r.tagName==="INPUT"&&r.addEventListener("input",()=>{this._updateConditionField(t,i,e)})})})}_updateConditionField(e,t,i){let r=this._getVisibilityConditionsByScope(e),n=this._getVisibilityConditionByPath(r,t);if(!n)return;let o=i.dataset.type;if(!o||!Ue(o))return;let d={...n,condition:o};ge(o).forEach(c=>{let h=E(i,`[data-field="${c.key}"]`);if(!h||!ze(c.key))return;let f=this._parseConditionEditorValue(c,h);f===void 0?delete d[c.key]:At(d,c.key,f)}),q(o)?Array.isArray(d.conditions)||(d.conditions=[]):delete d.conditions;let l=this._updateVisibilityPathValue(r,this._parseVisibilityPath(t),()=>d);this._setVisibilityConditionsByScope(e,l,!1)}_addVisibilityCondition(e,t,i){let r=this._getVisibilityConditionsByScope(e),n=this._createVisibilityCondition(i);if(!t){this._setVisibilityConditionsByScope(e,[...r,n],!0);return}let o=this._updateVisibilityPathValue(r,this._parseVisibilityPath(t),d=>({...Z(d)?d:{condition:i},conditions:[...Z(d)&&Array.isArray(d.conditions)?d.conditions:[],n]}));this._setVisibilityConditionsByScope(e,o,!0)}_createVisibilityCondition(e){return q(e)?{condition:e,conditions:[]}:{condition:e}}_parseVisibilityPath(e){return e.split(".").filter(Boolean).map(t=>/^\d+$/.test(t)?Number(t):"conditions")}_getVisibilityConditionByPath(e,t){return this._parseVisibilityPath(t).reduce((i,r)=>{if(Array.isArray(i)&&typeof r=="number")return i[r];if(r==="conditions"&&Z(i))return i.conditions},e)||null}_updateVisibilityPathValue(e,t,i,r=0){if(r===t.length)return[i(Array.isArray(e)?void 0:e)];let n=t[r];if(typeof n=="number"){let d=Array.isArray(e)?[...e]:[],l=this._updateVisibilityPathValue(d[n],t,i,r+1);return d[n]=l[0],d}let o=Z(e)?{...e}:{condition:m.AND,conditions:[]};return o.conditions=this._updateVisibilityPathValue(o.conditions,t,i,r+1),[o]}_removeVisibilityPathValue(e,t,i=0){let r=t[i];if(typeof r=="number"){let o=Array.isArray(e)?[...e]:[];if(i===t.length-1)return o.splice(r,1),o;let d=this._removeVisibilityPathValue(o[r],t,i+1);return o[r]=d[0],o}let n=Z(e)?{...e}:{condition:m.AND,conditions:[]};return n.conditions=this._removeVisibilityPathValue(n.conditions,t,i+1),[n]}_parseConditionEditorValue(e,t){if(e.control==="number")return t.value===""?void 0:Number(t.value);if(e.control==="multiselect"){let r=Array.from(t.selectedOptions||[]).map(n=>n.value);return e.key==="weekday",r.length>0?r:void 0}if(e.key==="is_admin"||e.key==="is_owner")return t.value===""?void 0:t.value==="true";let i=t.value.trim();if(i){if(e.key==="state"||e.key==="state_not"){let r=i.split(",").map(n=>n.trim()).filter(Boolean);return r.length===0?void 0:r.length===1?r[0]:r}if(e.key==="users"){let r=i.split(",").map(n=>n.trim()).filter(Boolean);return r.length>0?r:void 0}return i}}_getVisibilityConditionsByScope(e){if(e==="global")return this._config.visibility?[...this._config.visibility]:[];let t=e.split(":")[1];return!t||!Ee(t)?[]:this._config.section_visibility?.[t]?[...this._config.section_visibility[t]]:[]}_setVisibilityConditionsByScope(e,t,i){if(e==="global")this._config={...this._config,visibility:t};else{let r=e.split(":")[1];if(!r||!Ee(r))return;let n={...this._config.section_visibility||{},[r]:t};this._config={...this._config,section_visibility:n}}if(i){this._pushHistory(this._config),this._fireConfigChangedAndRender();return}this._fireConfigChanged()}_bindThemeTokens(){let e=/^--[a-z0-9_-]+$/i,t=()=>{let r={};g(this.shadowRoot,".theme-token-item").forEach(n=>{let o=E(n,".token-name")?.value?.trim(),d=E(n,".token-value")?.value?.trim();!o||!d||e.test(o)&&(r[o]=d)}),this._config={...this._config,theme_tokens:r},this._fireConfigChanged()},i=E(this.shadowRoot,'[data-action="add-theme-token"]');i&&i.addEventListener("click",()=>{let r=this._config.theme_tokens||{},n=Object.keys(r).length+1,o=`--uc-custom-token-${n}`;for(;Object.prototype.hasOwnProperty.call(r,o);)n+=1,o=`--uc-custom-token-${n}`;this._config={...this._config,theme_tokens:{...r,[o]:"initial"}},this._pushHistory(this._config),this._fireConfigChangedAndRender()}),g(this.shadowRoot,'[data-action="delete-theme-token"]').forEach(r=>{r.addEventListener("click",()=>{let n=parseInt(r.dataset.index,10);if(Number.isNaN(n))return;let o=Object.entries(this._config.theme_tokens||{});o[n]&&(o.splice(n,1),this._config={...this._config,theme_tokens:Object.fromEntries(o)},this._pushHistory(this._config),this._fireConfigChangedAndRender())})}),g(this.shadowRoot,".theme-token-item .token-name, .theme-token-item .token-value").forEach(r=>{r.addEventListener("input",()=>t()),r.addEventListener("change",()=>t())})}_bindStateStyles(){let e=E(this.shadowRoot,'[data-action="add-state-style"]');e&&e.addEventListener("click",()=>{let t=this._config.state_styles?{...this._config.state_styles}:{},i=Object.keys(t).length+1,r=`state_${i}`;for(;t[r];)i+=1,r=`state_${i}`;t[r]={},this._config={...this._config,state_styles:t},this._pushHistory(this._config),this._fireConfigChangedAndRender()}),g(this.shadowRoot,'[data-action="delete-state-style"]').forEach(t=>{t.addEventListener("click",()=>{let i=t.dataset.state;if(i&&this._config.state_styles&&this._config.state_styles[i]){let r={...this._config.state_styles};delete r[i],this._config={...this._config,state_styles:r},this._pushHistory(this._config),this._fireConfigChangedAndRender()}})}),g(this.shadowRoot,".state-style-item").forEach(t=>{let i=t.dataset.state;E(t,".state-key")?.addEventListener("change",r=>{let o=(V(r.target)?r.target:null)?.value;if(o&&o!==i&&this._config.state_styles){let d={...this._config.state_styles};d[o]={...i?d[i]:{}},i&&delete d[i],this._config={...this._config,state_styles:d},this._fireConfigChanged()}}),g(t,".style-field").forEach(r=>{r.addEventListener("input",()=>{let n=E(t,".state-key")?.value||i,o=r.dataset.style;if(n&&o&&this._config.state_styles&&this._config.state_styles[n]&&Et(o)){let d={...this._config.state_styles},l=this._parseStateStyleEditorValue(o,r.value),c={...d[n]};l===void 0?delete c[o]:St(c,o,l),d[n]=c,this._config={...this._config,state_styles:d},this._fireConfigChanged()}})})}),g(this.shadowRoot,".btn-preset").forEach(t=>{t.addEventListener("click",()=>{let i=t.dataset.preset;this._applyStateStylePreset(i)})})}_parseStateStyleEditorValue(e,t){let i=t.trim();if(!i)return;if(e!=="class")return i;let r=i.split(",").map(n=>n.trim()).filter(Boolean);if(r.length!==0)return r.length===1?r[0]:r}_applyStateStylePreset(e){let i={"on-off":{on:{background:"rgba(76, 175, 80, 0.2)",color:"#4caf50"},off:{background:"rgba(158, 158, 158, 0.2)",color:"#9e9e9e"}},temperature:{"<15":{background:"rgba(33, 150, 243, 0.2)",color:"#2196f3"},"15-25":{background:"rgba(76, 175, 80, 0.2)",color:"#4caf50"},">25":{background:"rgba(244, 67, 54, 0.2)",color:"#f44336"}},battery:{"<20":{background:"rgba(244, 67, 54, 0.2)",color:"#f44336"},"20-50":{background:"rgba(255, 152, 0, 0.2)",color:"#ff9800"},">50":{background:"rgba(76, 175, 80, 0.2)",color:"#4caf50"}}}[e];i&&(this._config={...this._config,state_styles:D(i)},this._pushHistory(this._config),this._fireConfigChangedAndRender())}_bindActions(){g(this.shadowRoot,".expand-trigger-btn").forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.trigger,i={...this._config,expand_trigger:t},r=xt(t);t!=="none"&&r&&i[r]&&(i={...i},delete i[r]),this._config=i,g(this.shadowRoot,".expand-trigger-btn").forEach(n=>n.classList.remove("active")),e.classList.add("active"),this._pushHistory(this._config),this._fireConfigChangedAndRender()})}),g(this.shadowRoot,".action-type-select").forEach(e=>{e.addEventListener("change",t=>{let i=V(t.target)?t.target:null,r=i?.dataset.actionKey,n=i?.value;if(!i||!r||!n||!Pe(r))return;let d={...this._config[r]||{}};d.action=n==="none"?void 0:n,n!=="call-service"&&delete d.service,n!=="navigate"&&delete d.navigation_path,n!=="url"&&delete d.url_path,this._config={...this._config,[r]:d},this._fireConfigChangedAndRender()})}),g(this.shadowRoot,".action-extra-field").forEach(e=>{e.addEventListener("input",t=>{let i=V(t.target)?t.target:null,r=i?.dataset.actionKey,n=i?.dataset.field;if(!i||!r||!n||!Pe(r)||!_t(n))return;let d={...this._config[r]||{}};d[n]=i.value,this._config={...this._config,[r]:d},this._fireConfigChanged()})})}_bindSwipeGestures(){}_bindBadges(){let e=E(this.shadowRoot,'[data-action="add-badge"]');e&&e.addEventListener("click",()=>{let t=this._config.badges?[...this._config.badges]:[];t.push({type:"state"}),this._config={...this._config,badges:t},this._pushHistory(this._config),this._fireConfigChangedAndRender()}),g(this.shadowRoot,'[data-action="delete-badge"]').forEach(t=>{t.addEventListener("click",()=>{let i=parseInt(t.dataset.index,10);if(this._config.badges){let r=this._config.badges.filter((n,o)=>o!==i);this._config={...this._config,badges:r},this._pushHistory(this._config),this._fireConfigChangedAndRender()}})}),g(this.shadowRoot,'[data-action="add-badge-threshold"]').forEach(t=>{t.addEventListener("click",()=>{let i=parseInt(t.dataset.index,10);if(Number.isNaN(i)||!this._config.badges?.[i])return;let r=[...this._config.badges],n={...r[i]},o=Array.isArray(n.thresholds)?[...n.thresholds]:[];o.push({value:0,color:""}),n.thresholds=o,r[i]=n,this._config={...this._config,badges:r},this._pushHistory(this._config),this._fireConfigChangedAndRender()})}),g(this.shadowRoot,'[data-action="delete-badge-threshold"]').forEach(t=>{t.addEventListener("click",()=>{let i=parseInt(t.dataset.index,10),r=parseInt(t.dataset.thresholdIndex,10);if(Number.isNaN(i)||Number.isNaN(r)||!this._config.badges?.[i])return;let n=[...this._config.badges],o={...n[i]},d=(o.thresholds||[]).filter((l,c)=>c!==r);d.length>0?o.thresholds=d:delete o.thresholds,n[i]=o,this._config={...this._config,badges:n},this._pushHistory(this._config),this._fireConfigChangedAndRender()})}),g(this.shadowRoot,".badge-item").forEach(t=>{let i=parseInt(t.dataset.index,10);g(t,".badge-field").forEach(r=>{let n=()=>{if(Number.isNaN(i)||!this._config.badges?.[i])return;let o=r.dataset.field;if(!o)return;let d=r.dataset.thresholdIndex!==void 0?parseInt(r.dataset.thresholdIndex,10):null,l=[...this._config.badges],c={...l[i]};if(d!==null&&!Number.isNaN(d)){if(!Ve(o))return;let h=Array.isArray(c.thresholds)?[...c.thresholds]:[],f={...h[d]||{}},k=this._parseBadgeEditorValue(o,r);k===void 0?delete f[o]:vt(f,o,k),h[d]=f,c.thresholds=h}else{if(!Be(o))return;let h=this._parseBadgeEditorValue(o,r);h===void 0?delete c[o]:wt(c,o,h)}if(l[i]=c,this._config={...this._config,badges:l},o==="type"){this._pushHistory(this._config),this._fireConfigChangedAndRender();return}this._fireConfigChanged()};r.addEventListener("change",n),r.tagName==="INPUT"&&r.addEventListener("input",n)})})}_parseBadgeEditorValue(e,t){if(t instanceof HTMLInputElement&&t.type==="checkbox")return t.checked;if(t instanceof HTMLInputElement&&t.type==="number")return t.value===""?void 0:Number(t.value);let i=t.value.trim();if(i){if(e==="entities"){let r=i.split(",").map(n=>n.trim()).filter(Boolean);return r.length>0?r:void 0}return i}}_bindAnimationPresets(){g(this.shadowRoot,".animation-btn").forEach(r=>{r.addEventListener("click",()=>{let n=r.dataset.animationType,o=r.dataset.animation;n==="expand"?(this._config={...this._config,expand_animation:o},g(this.shadowRoot,'.animation-btn[data-animation-type="expand"]').forEach(d=>d.classList.remove("active"))):n==="collapse"?(this._config={...this._config,collapse_animation:o},g(this.shadowRoot,'.animation-btn[data-animation-type="collapse"]').forEach(d=>d.classList.remove("active"))):n==="cards"&&(this._config={...this._config,cards_animation:o},g(this.shadowRoot,'.animation-btn[data-animation-type="cards"]').forEach(d=>d.classList.remove("active"))),r.classList.add("active"),this._fireConfigChanged()})});let e=E(this.shadowRoot,"#animation_duration_slider");e&&e.addEventListener("input",r=>{let n=V(r.target)?r.target:null;if(!n)return;this._config={...this._config,animation_duration:parseInt(n.value,10)};let o=E(this.shadowRoot,".duration-value");o&&(o.textContent=`${n.value}ms`),this._fireConfigChanged()});let t=E(this.shadowRoot,"#cards_stagger_slider");t&&t.addEventListener("input",r=>{let n=V(r.target)?r.target:null;if(!n)return;this._config={...this._config,cards_stagger:parseInt(n.value,10)};let o=E(this.shadowRoot,".stagger-value");o&&(o.textContent=`${n.value}ms`),this._fireConfigChanged()}),g(this.shadowRoot,".direction-btn").forEach(r=>{r.addEventListener("click",()=>{let n=r.dataset.direction;this._config={...this._config,cards_direction:n},g(this.shadowRoot,".direction-btn").forEach(o=>o.classList.remove("active")),r.classList.add("active"),this._fireConfigChanged()})});let i=E(this.shadowRoot,'[data-action="preview-animation"]');i&&i.addEventListener("click",()=>{this._previewAnimation()})}_previewAnimation(){let e=E(this.shadowRoot,".preview-card");if(!e)return;let t=this._config.expand_animation||"slide",i=this._config.animation_duration||300,n={none:"",fade:"uc-animate-fadeIn",fadeUp:"uc-animate-fadeInUp",fadeDown:"uc-animate-fadeInDown",scale:"uc-animate-scaleIn",slide:"uc-animate-slideInUp",bounce:"uc-animate-bounceIn",flip:"uc-animate-flipInX"}[t];n&&(e.style.animation="",e.offsetHeight,e.style.animation=`${n.replace("uc-animate-","uc-")} ${i}ms ease forwards`,setTimeout(()=>{e.style.animation=""},i+100))}_handleToolbarAction(e){switch(e){case"undo":this._undo();break;case"redo":this._redo();break;case"reset":confirm("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438?")&&(this._config={type:"custom:universal-card"},this._fireConfigChangedAndRender());break}}_handleInputChange(e){let t=V(e.target)?e.target:null;if(!t)return;let{name:i,value:r}=t;if(!i)return;let n=i.split("."),o=t instanceof HTMLInputElement&&t.type==="checkbox"?t.checked:t instanceof HTMLInputElement&&t.type==="number"?r!==""?parseInt(r,10):void 0:r;this._config=this._setNestedValue(this._config,n,o),this._fireConfigChanged()}_handleIconPickerChange(e){let i=(e.currentTarget instanceof HTMLElement?e.currentTarget:e.target instanceof HTMLElement?e.target:null)?.dataset.name;if(!i)return;let r=typeof e.detail?.value=="string"?e.detail.value.trim():"";this._config=this._setNestedValue(this._config,i.split("."),r||void 0),this._fireConfigChangedAndRender()}_setNestedValue(e,t,i){let r=ye(e)?{...e}:{};if(t.length===1)return i===void 0?Reflect.deleteProperty(r,t[0]):Reflect.set(r,t[0],i),r;let[n,...o]=t;return Reflect.set(r,n,this._setNestedValue(Reflect.get(r,n),o,i)),r}_pushHistory(e){this._historyIndex<this._history.length-1&&(this._history=this._history.slice(0,this._historyIndex+1)),this._history.push(D(e)),this._historyIndex=this._history.length-1,this._history.length>50&&(this._history.shift(),this._historyIndex--)}_undo(){this._historyIndex>0&&(this._historyIndex--,this._config=D(this._history[this._historyIndex]),this._fireConfigChangedAndRender())}_redo(){this._historyIndex<this._history.length-1&&(this._historyIndex++,this._config=D(this._history[this._historyIndex]),this._fireConfigChangedAndRender())}_fireConfigChanged(){this._lastConfigStr=JSON.stringify(this._config),ue(this,"config-changed",{config:this._config}),this._updateLiveInspector()}_fireConfigChangedAndRender(){ue(this,"config-changed",{config:this._config}),this._render()}_getStyles(){return`
      :host {
        display: block;
        --editor-bg: var(--primary-background-color, #fff);
        --editor-surface: var(--card-background-color, #fff);
        --editor-border: var(--divider-color, #e0e0e0);
        --editor-text: var(--primary-text-color, #212121);
        --editor-text-secondary: var(--secondary-text-color, #757575);
        --editor-primary: var(--primary-color, #03a9f4);
        --editor-primary-rgb: 3, 169, 244;
      }
      
      .editor {
        background: var(--editor-bg);
        border-radius: 12px;
        overflow: hidden;
      }
      
      /* Toolbar */
      .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: var(--editor-primary);
        color: white;
      }
      
      .toolbar-title {
        font-weight: 600;
        font-size: 16px;
      }
      
      .toolbar-right {
        display: flex;
        gap: 4px;
      }
      
      .toolbar-btn {
        background: rgba(255,255,255,0.2);
        border: none;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }
      
      .toolbar-btn:hover:not(:disabled) {
        background: rgba(255,255,255,0.3);
      }
      
      .toolbar-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      
      .toolbar-btn ha-icon {
        color: white;
        --mdc-icon-size: 20px;
      }
      
      /* Tab Bar - \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0432\u043A\u043B\u0430\u0434\u043A\u0438 */
      .tab-bar {
        display: flex;
        background: var(--editor-surface);
        border-bottom: 1px solid var(--editor-border);
        overflow-x: auto;
        scrollbar-width: none;
      }
      
      .tab-bar::-webkit-scrollbar {
        display: none;
      }
      
      .tab-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 12px 16px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--editor-text-secondary);
        transition: all 0.2s;
        border-bottom: 3px solid transparent;
        min-width: 80px;
        flex-shrink: 0;
      }
      
      .tab-item:hover {
        background: rgba(var(--editor-primary-rgb), 0.05);
        color: var(--editor-text);
      }
      
      .tab-item.active {
        color: var(--editor-primary);
        border-bottom-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .tab-item ha-icon {
        --mdc-icon-size: 24px;
      }
      
      .tab-label {
        font-size: 11px;
        font-weight: 500;
        white-space: nowrap;
      }
      
      /* Content */
      .editor-content {
        padding: 16px;
        max-height: 60vh;
        overflow-y: auto;
      }
      
      /* Sections */
      .section h3 {
        margin: 0 0 16px 0;
        font-size: 18px;
        color: var(--editor-text);
      }
      
      .subsection {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid var(--editor-border);
      }
      
      .subsection h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        color: var(--editor-text-secondary);
        font-weight: 500;
      }
      
      /* Fields */
      .field {
        margin-bottom: 16px;
      }
      
      .field label {
        display: block;
        margin-bottom: 6px;
        font-size: 12px;
        color: var(--editor-text-secondary);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .field input,
      .field select,
      .field textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
        background: var(--editor-surface);
        color: var(--editor-text);
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      
      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        outline: none;
        border-color: var(--editor-primary);
        box-shadow: 0 0 0 3px rgba(var(--editor-primary-rgb), 0.15);
      }
      
      .field-row {
        display: flex;
        gap: 16px;
      }
      
      .field-row .field {
        flex: 1;
      }
      
      .checkbox-field {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .checkbox-field input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }
      
      .checkbox-field label {
        margin: 0;
        font-size: 14px;
        color: var(--editor-text);
        text-transform: none;
        letter-spacing: normal;
        cursor: pointer;
      }
      
      /* Icon picker wrapper */
      .icon-picker-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .icon-picker-wrapper ha-icon-picker {
        flex: 1;
      }

      .icon-clear-btn.hidden {
        visibility: hidden;
        pointer-events: none;
      }
      
      /* Card Mini Preview */
      .card-mini-preview {
        background: var(--ha-card-background, var(--editor-surface));
        border: 1px solid var(--editor-border);
        border-radius: 12px;
        padding: 12px 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      
      .mini-preview-header {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .mini-preview-header .mini-icon {
        --mdc-icon-size: 28px;
        color: var(--editor-primary);
      }
      
      .mini-preview-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      
      .mini-title {
        font-size: 15px;
        font-weight: 500;
        color: var(--editor-text);
      }
      
      .mini-subtitle {
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .trigger-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: rgba(var(--editor-primary-rgb), 0.15);
        cursor: help;
        transition: all 0.2s;
      }
      
      .trigger-indicator:hover {
        background: rgba(var(--editor-primary-rgb), 0.25);
        transform: scale(1.05);
      }
      
      .trigger-indicator ha-icon {
        --mdc-icon-size: 20px;
        color: var(--editor-primary);
      }
      
      .mini-preview-hint {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--editor-border);
        font-size: 11px;
        color: var(--editor-text-secondary);
        text-align: center;
      }
      
      /* Cards list */
      .cards-list {
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        margin-bottom: 12px;
        overflow: hidden;
      }
      
      .card-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        background: var(--editor-surface);
        border-bottom: 1px solid var(--editor-border);
        transition: background 0.2s;
      }
      
      .card-item:last-child {
        border-bottom: none;
      }
      
      .card-item:hover {
        background: rgba(var(--editor-primary-rgb), 0.05);
      }

      .card-item[draggable="true"] {
        cursor: grab;
      }

      .card-item.dragging {
        opacity: 0.55;
        border: 1px dashed var(--editor-primary);
      }

      .card-item.drop-target {
        box-shadow: inset 0 0 0 2px rgba(var(--editor-primary-rgb), 0.45);
      }
      
      .card-item-content {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      
      .drag-handle {
        cursor: grab;
        color: var(--editor-text-secondary);
        --mdc-icon-size: 20px;
      }
      
      .card-type {
        font-weight: 500;
        color: var(--editor-text);
      }
      
      .card-entity {
        color: var(--editor-text-secondary);
        font-size: 12px;
      }
      
      .card-content-preview {
        color: var(--editor-text-secondary);
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .card-item-actions {
        display: flex;
        gap: 4px;
      }
      
      .empty-state {
        padding: 32px;
        text-align: center;
        color: var(--editor-text-secondary);
        font-style: italic;
      }
      
      /* Buttons */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        background: var(--editor-primary);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: opacity 0.2s, transform 0.1s;
      }
      
      .btn:hover {
        opacity: 0.9;
      }
      
      .btn:active {
        transform: scale(0.98);
      }
      
      .btn-icon {
        background: none;
        border: none;
        padding: 6px;
        cursor: pointer;
        color: var(--editor-text-secondary);
        border-radius: 6px;
        transition: all 0.2s;
      }
      
      .btn-icon:hover {
        color: var(--editor-text);
        background: rgba(0,0,0,0.05);
      }

      .btn-icon:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        pointer-events: none;
      }
      
      .btn-back {
        background: transparent;
        color: var(--editor-primary);
        border: 1px solid var(--editor-primary);
      }
      
      .btn-back:hover {
        background: rgba(var(--editor-primary-rgb), 0.1);
      }
      
      /* Sub-editor */
      .sub-editor-container {
        min-height: 300px;
      }
      
      .sub-editor-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--editor-border);
      }
      
      .sub-editor-title {
        font-weight: 500;
        color: var(--editor-text);
      }
      
      .sub-editor-content {
        min-height: 250px;
      }
      
      /* Card Picker Container */
      .card-picker-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .ha-picker-wrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .picker-tools {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      
      .picker-fallback-note {
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .card-picker-search {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .card-picker-search ha-icon {
        color: var(--editor-text-secondary);
        --mdc-icon-size: 20px;
      }
      
      .card-picker-search input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 14px;
        color: var(--editor-text);
        outline: none;
        padding: 0;
      }
      
      .card-picker-search input::placeholder {
        color: var(--editor-text-secondary);
      }
      
      .card-picker-sections {
        display: flex;
        flex-direction: column;
        gap: 24px;
        max-height: 400px;
        overflow-y: auto;
        padding-right: 8px;
      }
      
      .card-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .card-section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--editor-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .card-section-title ha-icon {
        --mdc-icon-size: 18px;
        color: var(--editor-primary);
      }
      
      /* Card type grid */
      .card-type-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 10px;
      }
      
      .card-type-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 12px 8px;
        min-height: 80px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        overflow: hidden;
      }
      
      .card-type-btn:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.08);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .card-type-btn.custom {
        border-style: dashed;
      }
      
      .card-type-btn.custom:hover {
        border-style: solid;
      }
      
      .card-type-btn ha-icon {
        --mdc-icon-size: 28px;
        color: var(--editor-primary);
      }
      
      .card-type-btn.custom ha-icon {
        color: #ff9800;
      }
      
      .card-type-btn .card-name {
        font-size: 11px;
        font-weight: 500;
        color: var(--editor-text);
        text-align: center;
        line-height: 1.2;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .card-type-btn .custom-badge {
        position: absolute;
        top: 4px;
        right: 4px;
        font-size: 8px;
        font-weight: 700;
        padding: 2px 4px;
        background: linear-gradient(135deg, #ff9800, #f57c00);
        color: white;
        border-radius: 4px;
        letter-spacing: 0.5px;
      }
      
      /* Custom type input */
      .custom-type-input {
        padding: 16px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 10px;
      }
      
      .custom-type-input h4 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 12px 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--editor-text-secondary);
      }
      
      .custom-type-input h4 ha-icon {
        --mdc-icon-size: 18px;
        color: var(--editor-primary);
      }
      
      .custom-type-row {
        display: flex;
        gap: 10px;
      }
      
      .custom-type-row input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        font-size: 14px;
        background: var(--editor-bg);
        color: var(--editor-text);
      }
      
      .custom-type-row input:focus {
        outline: none;
        border-color: var(--editor-primary);
      }
      
      /* YAML Preview */
      .yaml-preview {
        background: var(--code-editor-background-color, #1e1e1e);
        color: var(--primary-text-color, #d4d4d4);
        padding: 16px;
        border-radius: 8px;
        font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
        font-size: 12px;
        line-height: 1.6;
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-word;
      }
      
      .yaml-key {
        color: #9cdcfe;
      }
      
      .yaml-value {
        color: #ce9178;
      }
      
      /* YAML Editor */
      .yaml-editor-container {
        padding: 16px;
      }
      
      .yaml-editor {
        width: 100%;
        min-height: 300px;
        font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
        font-size: 13px;
        line-height: 1.5;
        padding: 12px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        resize: vertical;
        background: var(--editor-surface);
        color: var(--editor-text);
      }
      
      .yaml-editor-actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
      }
      
      /* Card Editor with Tabs */
      .card-editor-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      
      /* Inline card editor */
      .card-item.editing {
        background: transparent;
        padding: 0;
        border: none;
      }
      
      .inline-editor {
        border: 2px solid var(--editor-primary);
        border-radius: 8px;
        overflow: hidden;
        background: var(--editor-surface);
      }
      
      .card-editor-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: var(--editor-primary);
        color: white;
      }
      
      .editor-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 500;
      }
      
      .editor-title ha-icon {
        --mdc-icon-size: 16px;
      }
      
      .editor-actions {
        display: flex;
        gap: 6px;
      }
      
      .editor-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 6px;
        background: rgba(255,255,255,0.2);
        color: white;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .editor-btn:hover {
        background: rgba(255,255,255,0.3);
        transform: scale(1.05);
      }
      
      .editor-btn.save {
        background: #4caf50;
      }
      
      .editor-btn.save:hover {
        background: #43a047;
      }
      
      .editor-btn.cancel {
        background: rgba(255,255,255,0.15);
      }
      
      .editor-btn.cancel:hover {
        background: #f44336;
      }
      
      .editor-btn ha-icon {
        --mdc-icon-size: 18px;
      }
      
      .code-editor-wrapper {
        min-height: 120px;
        max-height: 350px;
        overflow: auto;
      }
      
      .code-editor-wrapper ha-code-editor {
        display: block;
        --code-mirror-height: 100%;
        min-height: 120px;
      }
      
      .yaml-fallback-editor {
        width: 100%;
        min-height: 120px;
        max-height: 350px;
        padding: 12px;
        border: none;
        background: #1e1e1e;
        color: #d4d4d4;
        font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        font-size: 13px;
        line-height: 1.5;
        resize: vertical;
        box-sizing: border-box;
      }
      
      .yaml-fallback-editor:focus {
        outline: none;
      }
      
      /* Card item clickable */
      .card-item-content {
        cursor: pointer;
      }
      
      .card-item-content:hover {
        background: var(--editor-surface-hover, rgba(255,255,255,0.05));
      }
      
      .card-editor-tabs {
        display: flex;
        gap: 4px;
        padding: 8px 16px;
        border-bottom: 1px solid var(--editor-border);
        background: var(--editor-surface);
      }
      
      .editor-tab {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: transparent;
        border: none;
        border-radius: 8px 8px 0 0;
        color: var(--editor-text-secondary);
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s ease;
      }
      
      .editor-tab:hover {
        background: rgba(var(--editor-primary-rgb), 0.1);
        color: var(--editor-text);
      }
      
      .editor-tab.active {
        background: var(--editor-primary);
        color: white;
      }
      
      .editor-tab ha-icon {
        --mdc-icon-size: 18px;
      }
      
      .card-editor-content {
        flex: 1;
        overflow: auto;
      }
      
      .editor-panel {
        display: none;
        padding: 16px;
      }
      
      .editor-panel.active {
        display: block;
      }
      
      .card-editor-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 16px;
        border-top: 1px solid var(--editor-border);
        background: var(--editor-surface);
      }
      
      .loading-editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 40px;
        color: var(--editor-text-secondary);
      }
      
      .loading-editor .spin {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .no-visual-editor {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 40px;
        text-align: center;
        color: var(--editor-text-secondary);
      }
      
      .no-visual-editor ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.5;
      }
      
      .no-visual-editor p {
        margin: 4px 0;
      }
      
      /* Tabs list */
      .tabs-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .tabs-list .tab-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-surface);
      }
      
      .tabs-list .tab-item input {
        flex: 1;
        border: none;
        background: transparent;
        padding: 4px 8px;
      }
      
      /* Preview */
      .theme-preview {
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 16px;
        background: var(--ha-card-background, #fff);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .preview-header {
        font-weight: 500;
        margin-bottom: 8px;
      }
      
      .preview-body {
        color: var(--editor-text-secondary);
      }

      .theme-tokens-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }

      .theme-token-item {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 8px;
        align-items: center;
        padding: 8px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-bg);
      }

      .theme-token-item input {
        padding: 8px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
      }
      
      .hint {
        font-size: 12px;
        color: var(--editor-text-secondary);
        margin-bottom: 12px;
      }

      .live-inspector {
        margin-top: 16px;
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        background: var(--editor-surface);
        padding: 14px;
      }

      .live-inspector-title-row {
        margin-bottom: 10px;
      }

      .live-inspector-title-row h4 {
        margin: 0;
        font-size: 14px;
        color: var(--editor-text);
      }

      .live-preview-card {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 10px 12px;
        margin-bottom: 12px;
      }

      .live-preview-header-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .live-title {
        font-weight: 600;
      }

      .live-mode {
        font-size: 11px;
        opacity: 0.85;
      }

      .live-preview-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 14px;
        font-size: 12px;
        opacity: 0.9;
      }

      .lint-panel {
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-bg);
      }

      .lint-panel.has-errors {
        border-color: #e57373;
      }

      .lint-panel.has-warnings {
        border-color: #ffb74d;
      }

      .lint-panel.is-clean {
        border-color: #81c784;
      }

      .lint-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 10px;
        border-bottom: 1px solid var(--editor-border);
        font-size: 12px;
        font-weight: 600;
      }

      .lint-summary {
        font-weight: 500;
        color: var(--editor-text-secondary);
      }

      .lint-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px;
      }

      .lint-item {
        display: flex;
        gap: 8px;
        font-size: 12px;
        line-height: 1.35;
      }

      .lint-level {
        min-width: 50px;
        font-weight: 700;
      }

      .lint-item.level-error .lint-level {
        color: #e53935;
      }

      .lint-item.level-warning .lint-level {
        color: #fb8c00;
      }

      .lint-item.level-info .lint-level {
        color: #1e88e5;
      }
      
      /* Feature Groups */
      .features-section {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .feature-group {
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        overflow: hidden;
        background: var(--editor-surface);
      }
      
      .feature-group.has-content {
        border-color: var(--editor-primary);
        border-width: 2px;
      }
      
      .feature-group-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        background: rgba(var(--editor-primary-rgb), 0.05);
        cursor: pointer;
        user-select: none;
        transition: background 0.2s;
      }
      
      .feature-group-header:hover {
        background: rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .feature-group-header ha-icon:first-child {
        --mdc-icon-size: 20px;
        color: var(--editor-primary);
      }
      
      .feature-group-header span:first-of-type {
        flex: 1;
        font-weight: 500;
        font-size: 14px;
      }
      
      .feature-badge {
        font-size: 11px;
        padding: 2px 6px;
        background: var(--editor-primary);
        color: white;
        border-radius: 10px;
        min-width: 16px;
        text-align: center;
      }
      
      .feature-badge:empty {
        display: none;
      }
      
      .collapse-icon {
        --mdc-icon-size: 20px;
        color: var(--editor-text-secondary);
        transition: transform 0.2s;
      }
      
      .feature-group.collapsible .feature-group-content {
        max-height: 0;
        overflow: hidden;
        padding: 0 14px;
        transition: max-height 0.3s, padding 0.3s;
      }
      
      .feature-group.collapsible.expanded .feature-group-content {
        max-height: 2000px;
        padding: 14px;
      }
      
      .feature-group.collapsible.expanded .collapse-icon {
        transform: rotate(180deg);
      }
      
      .feature-hint {
        font-size: 12px;
        color: var(--editor-text-secondary);
        margin: 0 0 12px 0;
        line-height: 1.4;
      }
      
      /* Conditions List */
      .conditions-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }

      .visibility-scope {
        padding: 12px;
        border: 1px solid var(--editor-border);
        border-radius: 10px;
        background: var(--editor-bg);
        margin-bottom: 12px;
      }

      .visibility-scope-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .visibility-scope-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--editor-text);
      }
      
      .condition-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        flex-wrap: wrap;
      }

      .condition-item-logical {
        align-items: stretch;
      }
      
      .condition-type-badge {
        font-size: 10px;
        font-weight: 600;
        padding: 3px 6px;
        background: var(--editor-primary);
        color: white;
        border-radius: 4px;
        text-transform: uppercase;
      }
      
      .condition-fields {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
        flex-wrap: wrap;
      }

      .condition-control {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 120px;
        flex: 1;
      }

      .condition-control span {
        font-size: 11px;
        color: var(--editor-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      
      .cond-field {
        padding: 6px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 13px;
        min-width: 100px;
        flex: 1;
      }
      
      .cond-field.cond-small {
        max-width: 120px;
        flex: 0;
      }
      
      .cond-weekday {
        padding: 4px;
        font-size: 11px;
        min-height: 88px;
      }
      
      .add-condition-row {
        display: flex;
        gap: 8px;
      }
      
      .condition-type-select {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        font-size: 13px;
      }

      .condition-children {
        width: 100%;
        padding-top: 8px;
        border-top: 1px dashed var(--editor-border);
      }

      .condition-children-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 12px;
        color: var(--editor-text-secondary);
      }

      .nested-conditions {
        margin-left: 12px;
      }

      .nested-add-condition-row {
        margin-left: 12px;
      }
      
      /* State Styles */
      .state-styles-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .state-style-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
        flex-wrap: wrap;
      }
      
      .state-key {
        width: 80px;
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
      }
      
      .style-field {
        flex: 1;
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
      }
      
      .style-presets {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        flex-wrap: wrap;
      }
      
      .preset-label {
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .btn-preset {
        padding: 4px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        background: var(--editor-surface);
        font-size: 11px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .btn-preset:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.1);
      }
      
      /* Expand Trigger */
      .expand-trigger-section {
        margin-bottom: 16px;
      }
      
      .section-label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--editor-text);
        margin-bottom: 10px;
      }
      
      .section-label ha-icon {
        --mdc-icon-size: 18px;
        color: var(--editor-primary);
      }
      
      .expand-trigger-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
      }
      
      .expand-trigger-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border: 2px solid var(--editor-border);
        border-radius: 10px;
        background: var(--editor-surface);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .expand-trigger-btn:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.05);
      }
      
      .expand-trigger-btn.active {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.15);
        box-shadow: 0 0 0 3px rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .expand-trigger-btn ha-icon {
        --mdc-icon-size: 20px;
        color: var(--editor-primary);
      }
      
      .expand-trigger-btn span {
        font-size: 12px;
        font-weight: 500;
        color: var(--editor-text);
      }
      
      .section-divider {
        border: none;
        border-top: 1px solid var(--editor-border);
        margin: 16px 0;
      }
      
      .custom-actions-section {
        margin-top: 12px;
      }
      
      /* Actions */
      .action-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }
      
      .action-row.disabled {
        opacity: 0.7;
      }
      
      .action-row label {
        width: 130px;
        font-size: 13px;
        color: var(--editor-text);
      }
      
      .action-expand-badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: rgba(var(--editor-primary-rgb), 0.15);
        border: 1px solid var(--editor-primary);
        border-radius: 6px;
        color: var(--editor-primary);
        font-size: 12px;
        font-weight: 500;
      }
      
      .action-expand-badge ha-icon {
        --mdc-icon-size: 16px;
      }
      
      .action-type-select {
        flex: 1;
        min-width: 150px;
        padding: 8px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 13px;
      }
      
      .action-extra-field {
        flex: 1;
        min-width: 150px;
        padding: 8px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 13px;
        margin-top: 6px;
      }
      
      /* Badges */
      .badges-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 12px;
      }
      
      .badge-item {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }

      .badge-item-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
      }

      .badge-item-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--editor-text);
      }

      .badge-fields-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 10px;
        width: 100%;
      }

      .badge-field-block {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
      }

      .badge-field-block > span,
      .badge-field-block > label {
        font-size: 12px;
        color: var(--editor-text-secondary);
      }
      
      .badge-field {
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
        min-width: 0;
      }

      .badge-thresholds {
        width: 100%;
        padding-top: 8px;
        border-top: 1px dashed var(--editor-border);
      }

      .badge-thresholds-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .badge-threshold-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 10px;
      }

      .badge-threshold-item {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) auto;
        gap: 8px;
        align-items: end;
        padding: 10px;
        background: var(--editor-surface);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }

      .badge-threshold-field {
        width: 100%;
      }
      
      /* Animation Presets */
      .animation-section {
        margin-bottom: 16px;
      }
      
      .animation-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin-top: 8px;
      }
      
      .animation-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border: 2px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-surface);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .animation-btn:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.05);
      }
      
      .animation-btn.active {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.15);
        box-shadow: 0 0 0 3px rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .animation-btn ha-icon {
        --mdc-icon-size: 20px;
        color: var(--editor-primary);
      }
      
      .animation-btn span {
        font-size: 9px;
        color: var(--editor-text);
        text-align: center;
        white-space: nowrap;
      }
      
      /* Direction Grid */
      .direction-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin-top: 8px;
      }
      
      .direction-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 4px;
        border: 2px solid var(--editor-border);
        border-radius: 8px;
        background: var(--editor-surface);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .direction-btn:hover {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.05);
      }
      
      .direction-btn.active {
        border-color: var(--editor-primary);
        background: rgba(var(--editor-primary-rgb), 0.15);
        box-shadow: 0 0 0 3px rgba(var(--editor-primary-rgb), 0.1);
      }
      
      .direction-btn ha-icon {
        --mdc-icon-size: 18px;
        color: var(--editor-primary);
      }
      
      .direction-btn span {
        font-size: 8px;
        color: var(--editor-text);
        text-align: center;
        white-space: nowrap;
      }
      
      .animation-duration-section {
        margin-bottom: 16px;
      }
      
      .duration-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 8px;
      }
      
      .duration-row input[type="range"] {
        flex: 1;
        height: 6px;
        -webkit-appearance: none;
        background: var(--editor-border);
        border-radius: 3px;
      }
      
      .duration-row input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--editor-primary);
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
      
      .duration-value,
      .stagger-value {
        font-size: 13px;
        font-weight: 500;
        color: var(--editor-primary);
        min-width: 50px;
      }
      
      .btn-preview-animation {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 10px;
        border: 1px dashed var(--editor-primary);
        border-radius: 8px;
        background: rgba(var(--editor-primary-rgb), 0.05);
        color: var(--editor-primary);
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
      }
      
      .btn-preview-animation:hover {
        background: rgba(var(--editor-primary-rgb), 0.15);
        border-style: solid;
      }
      
      .btn-preview-animation ha-icon {
        --mdc-icon-size: 18px;
      }
      
      /* Range Slider */
      .field input[type="range"] {
        width: 100%;
        margin: 8px 0;
      }
      
      .range-value {
        display: inline-block;
        font-size: 12px;
        color: var(--editor-text-secondary);
        margin-left: 8px;
      }
      
      /* Small buttons */
      .btn-small {
        padding: 6px 12px;
        font-size: 12px;
      }
      
      .btn-delete {
        color: #f44336;
      }
      
      .btn-delete:hover {
        background: rgba(244, 67, 54, 0.1);
      }
      
      /* Responsive */
      @media (max-width: 500px) {
        .tab-item {
          padding: 10px 12px;
          min-width: 60px;
        }
        
        .tab-label {
          font-size: 10px;
        }
        
        .tab-item ha-icon {
          --mdc-icon-size: 20px;
        }
        
        .condition-item {
          flex-direction: column;
          align-items: stretch;
        }
        
        .condition-fields {
          flex-direction: column;
        }
        
        .cond-field {
          width: 100%;
          max-width: none !important;
        }
        
        .action-row {
          flex-direction: column;
          align-items: stretch;
        }
        
        .action-row label {
          width: auto;
        }
        
        .theme-token-item {
          grid-template-columns: 1fr;
        }

        .live-preview-header-row {
          flex-direction: column;
          align-items: flex-start;
        }

        .badge-fields-grid,
        .badge-threshold-item {
          grid-template-columns: 1fr;
        }
      }
    `}};export{xe as UniversalCardEditor};
