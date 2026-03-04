/**
 * Universal Card v1.0.0
 * @license MIT
 * Built: 2026-01-12T23:58:49.433Z
 */
// Global Error Handler
window.addEventListener('error', function(e) {
  console.error('[UC-ERR]', e.filename, e.lineno, e.colno, e.message, e.error);
});
window.addEventListener('unhandledrejection', function(e) {
  console.error('[UC-REJ]', e.reason, e.reason && e.reason.stack);
});
(()=>{var gi=!1;function Jt(s){gi=s}function m(...s){gi&&console.log(...s)}function We(s="uc"){let e=Math.random().toString(36).substring(2,10);return`${s}-${e}`}function X(s){return s!==null&&typeof s=="object"&&!Array.isArray(s)}function Zt(s){return typeof s=="string"&&s.trim().length>0}function Xi(s){return typeof s=="number"&&!Number.isNaN(s)}function Qt(s,e){let t={...s};return X(s)&&X(e)&&Object.keys(e).forEach(i=>{X(e[i])&&i in s?t[i]=Qt(s[i],e[i]):t[i]=e[i]}),t}function K(s){if(s===null||typeof s!="object")return s;if(Array.isArray(s))return s.map(t=>K(t));let e={};return Object.keys(s).forEach(t=>{e[t]=K(s[t])}),e}function _i(s,e,t=void 0){if(!s||!e)return t;let i=e.split("."),a=s;for(let r of i){if(a==null)return t;a=a[r]}return a!==void 0?a:t}function bi(s){return s==null?[]:Array.isArray(s)?s:[s]}function _(s,e,t={},i={}){let a=new CustomEvent(e,{bubbles:i.bubbles!==!1,cancelable:i.cancelable!==!1,composed:i.composed!==!1,detail:t});return s.dispatchEvent(a),a}function yi(){return new Promise(s=>{requestAnimationFrame(()=>{requestAnimationFrame(s)})})}function vi(s,e=2){return Xi(s)?s.toFixed(e):""}function xi(s,e={},t="ru-RU"){let i=s instanceof Date?s:new Date(s),a={year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"};return new Intl.DateTimeFormat(t,{...a,...e}).format(i)}function Xe(s){return Zt(s)?/^[a-z_]+\.[a-z0-9_]+$/.test(s):!1}var ei="1.0.3",wi="Universal Card",ki="\u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0441 7 \u0440\u0435\u0436\u0438\u043C\u0430\u043C\u0438 body, grid layout, lazy loading \u0438 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u0439 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u043E\u0439",E=Object.freeze({EXPAND:"expand",MODAL:"modal",FULLSCREEN:"fullscreen",TABS:"tabs",CAROUSEL:"carousel",SUBVIEW:"subview",NONE:"none"}),Le=Object.values(E),f=Object.freeze({DEFAULT:"default",TRANSPARENT:"transparent",SOLID:"solid",GLASS:"glass",GLASSMORPHISM:"glassmorphism",NEUMORPHISM:"neumorphism",MINIMAL:"minimal",GRADIENT:"gradient",DARK:"dark",NEON:"neon",AURORA:"aurora",CARBON:"carbon",SLATE:"slate",OBSIDIAN:"obsidian",CHARCOAL:"charcoal",MIDNIGHT:"midnight",CYBER:"cyber",VOID:"void",EMBER:"ember",FOREST:"forest",OCEAN:"ocean",PURPLE_HAZE:"purple-haze",MATRIX:"matrix",GRAPHITE:"graphite",SMOKE:"smoke",NORD:"nord",DRACULA:"dracula",MONOKAI:"monokai",TOKYO_NIGHT:"tokyo-night",CATPPUCCIN:"catppuccin"}),Ki=Object.freeze({NONE:"none",FADE:"fade",SLIDE:"slide",BOUNCE:"bounce",ELASTIC:"elastic",SMOOTH:"smooth",SHARP:"sharp",ZOOM:"zoom"}),Ji=Object.freeze({SKELETON:"skeleton",SPINNER:"spinner",DOTS:"dots",PROGRESS:"progress",SHIMMER:"shimmer",PULSE:"pulse"}),A=Object.freeze({STATE:"state",NUMERIC_STATE:"numeric_state",USER:"user",TIME:"time",SCREEN:"screen",AND:"and",OR:"or",NOT:"not"}),V=Object.freeze({NONE:"none",TOGGLE:"toggle",CALL_SERVICE:"call-service",NAVIGATE:"navigate",URL:"url",MORE_INFO:"more-info",FIRE_EVENT:"fire-dom-event",EXPAND:"expand",COLLAPSE:"collapse"}),ve=Object.freeze({CARD_EXPANDED:"universal-card-expanded",CARD_COLLAPSED:"universal-card-collapsed",CARD_CONTROL:"universal-card-control",CONFIG_CHANGED:"config-changed",HASS_UPDATED:"hass-updated"}),Ei=Object.freeze({PRIMARY:"--uc-primary-color",SECONDARY:"--uc-secondary-color",ACCENT:"--uc-accent-color",BACKGROUND:"--uc-background-color",SURFACE:"--uc-surface-color",TEXT:"--uc-text-color",TEXT_SECONDARY:"--uc-text-secondary-color",BORDER:"--uc-border-color",BORDER_RADIUS:"--uc-border-radius",PADDING:"--uc-padding",GAP:"--uc-gap",SHADOW:"--uc-shadow",SHADOW_HOVER:"--uc-shadow-hover",TRANSITION_DURATION:"--uc-transition-duration",TRANSITION_TIMING:"--uc-transition-timing"}),T=Object.freeze({body_mode:E.EXPAND,expanded:!1,animation:!0,theme:f.DEFAULT,border_radius:"var(--ha-card-border-radius, 12px)",padding:"16px",grid_columns:1,grid_gap:"16px",modal_width:"90%",modal_max_width:"600px",backdrop_color:"rgba(0, 0, 0, 0.6)",lazy_load:!0,remember_state:!1,show_expand_icon:!0,expand_icon:"mdi:chevron-down",haptic:!1,loading_type:Ji.SKELETON,skeleton_count:3,carousel_autoplay:!1,carousel_interval:5e3,animation_preset:Ki.SMOOTH,animation_duration:300}),M=Object.freeze({MAX_GRID_COLUMNS:12,MIN_GRID_COLUMNS:1,MAX_CARDS_PER_BODY:100,MAX_TABS:20,UPDATE_THROTTLE_MS:100,RESIZE_DEBOUNCE_MS:200,INTERSECTION_MARGIN:"100px",MAX_UNDO_HISTORY:50,MAX_LOG_ENTRIES:1e3});var w=class extends Error{constructor(e,t){super(t?`${t}: ${e}`:e),this.name="ConfigValidationError",this.path=t}},xe=class{static validate(e){var i,a;if(!X(e))throw new w("Configuration must be an object");if(e.body_mode&&!Le.includes(e.body_mode))throw new w(`Invalid body_mode: "${e.body_mode}". Valid modes: ${Le.join(", ")}`,"body_mode");let t=Object.values(f);if(e.theme&&!t.includes(e.theme))throw new w(`Invalid theme: "${e.theme}". Valid themes: ${t.join(", ")}`,"theme");if(e.entity&&!Xe(e.entity))throw new w(`Invalid entity format: "${e.entity}"`,"entity");if(e.grid&&e.grid.columns!==void 0){let r=e.grid.columns;if(typeof r=="number"){if(r<M.MIN_GRID_COLUMNS||r>M.MAX_GRID_COLUMNS)throw new w("Grid columns must be between "+M.MIN_GRID_COLUMNS+" and "+M.MAX_GRID_COLUMNS,"grid.columns")}else if(typeof r!="string")throw new w("Grid columns must be a number or CSS template string","grid.columns")}if((i=e.body)!=null&&i.cards){if(!Array.isArray(e.body.cards))throw new w("body.cards must be an array","body.cards");if(e.body.cards.length>M.MAX_CARDS_PER_BODY)throw new w(`Maximum ${M.MAX_CARDS_PER_BODY} cards allowed in body`,"body.cards");e.body.cards.forEach((r,o)=>{this._validateCardConfig(r,`body.cards[${o}]`)})}if((a=e.header)!=null&&a.cards){if(!Array.isArray(e.header.cards))throw new w("header.cards must be an array","header.cards");e.header.cards.forEach((r,o)=>{this._validateCardConfig(r,`header.cards[${o}]`)})}return e.tabs&&this._validateTabs(e.tabs),e.visibility&&this._validateConditions(e.visibility,"visibility"),["tap_action","hold_action","double_tap_action"].forEach(r=>{e[r]&&this._validateAction(e[r],r)}),!0}static _validateCardConfig(e,t){if(!X(e))throw new w("Card config must be an object",t);if(!e.type)throw new w("Card must have a type",t)}static _validateTabs(e){if(!Array.isArray(e))throw new w("tabs must be an array","tabs");if(e.length>M.MAX_TABS)throw new w(`Maximum ${M.MAX_TABS} tabs allowed`,"tabs");e.forEach((t,i)=>{if(!X(t))throw new w("Tab config must be an object",`tabs[${i}]`);if(t.cards&&!Array.isArray(t.cards))throw new w("Tab cards must be an array",`tabs[${i}].cards`)})}static _validateConditions(e,t){if(!Array.isArray(e))throw new w("Visibility must be an array",t);let i=Object.values(A);e.forEach((a,r)=>{let o=`${t}[${r}]`;if(!X(a))throw new w("Condition must be an object",o);if(!a.condition)throw new w('Condition must have a "condition" type',o);if(!i.includes(a.condition))throw new w(`Invalid condition type: "${a.condition}"`,o)})}static _validateAction(e,t){if(!X(e))throw new w("Action must be an object",t);let i=Object.values(V);if(e.action&&!i.includes(e.action))throw new w(`Invalid action: "${e.action}"`,t);if(e.action===V.CALL_SERVICE&&!e.service)throw new w('call-service action requires a "service" property',t);if(e.action===V.NAVIGATE&&!e.navigation_path)throw new w('navigate action requires a "navigation_path" property',t);if(e.action===V.URL&&!e.url_path)throw new w('url action requires a "url_path" property',t)}static normalize(e){this.validate(e);let t={...T,...e};t.card_id||(t.card_id=We("uc")),t.header=this._normalizeSection(e.header,"header"),e.body?t.body=this._normalizeSection(e.body,"body"):e.cards?t.body={cards:e.cards}:t.body={cards:[]},e.footer&&(t.footer=this._normalizeSection(e.footer,"footer")),e.tabs&&(t.tabs=e.tabs.map((a,r)=>({label:a.label||`Tab ${r+1}`,icon:a.icon||null,cards:a.cards||[],...a}))),t.grid=this._normalizeGrid(e.grid);let i=e.expand_trigger||"tap";return t.tap_action=this._normalizeAction(e.tap_action,"none"),t.hold_action=this._normalizeAction(e.hold_action,"none"),t.double_tap_action=this._normalizeAction(e.double_tap_action,"none"),e.visibility&&(t.visibility=e.visibility.map(a=>this._normalizeCondition(a))),t}static _normalizeSection(e,t){return e?{cards:e.cards||[],...e}:{cards:[]}}static _normalizeGrid(e){return e?{columns:e.columns||T.grid_columns,gap:e.gap||T.grid_gap,responsive:e.responsive||null}:{columns:T.grid_columns,gap:T.grid_gap}}static _normalizeAction(e,t="none"){return e?{action:e.action||t,...e}:{action:t}}static _normalizeCondition(e){let t={condition:e.condition,...e};return e.condition===A.STATE&&e.state&&(t.state=Array.isArray(e.state)?e.state:[e.state]),t}static getTitle(e,t){var i;return e.title?e.title:e.entity&&((i=t==null?void 0:t.states)!=null&&i[e.entity])?t.states[e.entity].attributes.friendly_name||e.entity:""}static getSubtitle(e,t){var i;return e.subtitle?e.subtitle:e.entity&&((i=t==null?void 0:t.states)!=null&&i[e.entity])?t.states[e.entity].state:""}static hasChanged(e,t){return JSON.stringify(e)!==JSON.stringify(t)}static getSchema(){return{type:"object",properties:{title:{type:"string"},subtitle:{type:"string"},icon:{type:"string"},entity:{type:"string"},body_mode:{type:"string",enum:Le,default:E.EXPAND},theme:{type:"string",enum:Object.values(f),default:f.SOLID},expanded:{type:"boolean",default:!1},animation:{type:"boolean",default:!0},lazy_load:{type:"boolean",default:!0},show_expand_icon:{type:"boolean",default:!0},grid:{type:"object",properties:{columns:{type:"number",minimum:1,maximum:12},gap:{type:"string"}}}}}}};function Q(s,e=100,t={}){let{leading:i=!1,trailing:a=!0}=t,r=null,o=null,n=null,c=null,l=null;function d(y){let I=o,B=n;return o=null,n=null,l=y,c=s.apply(B,I),c}function u(y){let I=l===null?e:y-l;return l===null||I>=e}function p(){let y=Date.now();if(u(y))return h(y);r=setTimeout(p,e-(y-l))}function h(y){return r=null,a&&o?d(y):(o=null,n=null,c)}function g(y){return l=y,r=setTimeout(p,e),i?d(y):c}function b(...y){let I=Date.now(),B=u(I);return o=y,n=this,B&&r===null?g(I):(r===null&&(r=setTimeout(p,e)),c)}return b.cancel=function(){r!==null&&clearTimeout(r),o=null,n=null,l=null,r=null},b.flush=function(){return r!==null?h(Date.now()):c},b.pending=function(){return r!==null},b}function Ie(s,e=16,t={}){let{leading:i=!0,trailing:a=!0}=t,r=0,o=null,n=null,c=null;function l(){let u=n,p=c;return n=null,c=null,r=Date.now(),s.apply(p,u)}function d(...u){let h=Date.now()-r;if(n=u,c=this,h>=e&&(o!==null&&(clearTimeout(o),o=null),i))return l();if(o===null&&a){let g=e-h;o=setTimeout(()=>{o=null,l()},g>0?g:0)}}return d.cancel=function(){o!==null&&(clearTimeout(o),o=null),r=0,n=null,c=null},d}function Si(s){return requestAnimationFrame(s)}function Ci(s){return new Promise(e=>{requestAnimationFrame(()=>{requestAnimationFrame(()=>{s(),e()})})})}function ti(s){return new Promise(e=>{requestAnimationFrame(()=>{s.forEach(t=>{try{t()}catch(i){console.error("[UniversalCard] Batch update error:",i)}}),e()})})}function Ti(){let s=[],e=!1;function t(){if(s.length===0)return;let a=[...s];s.length=0,e=!1,ti(a)}function i(a){s.push(a),e||(e=!0,requestAnimationFrame(t))}return{add:i,flush:t}}function $i(s,e={}){let{timeout:t=1e3}=e;return"requestIdleCallback"in window?window.requestIdleCallback(s,{timeout:t}):setTimeout(s,1)}function Ai(s,e){let t=performance.now(),i=e(),a=performance.now();return console.debug(`[UniversalCard] ${s}: ${(a-t).toFixed(2)}ms`),i}var Ke=null;async function Pe(){return Ke||(Ke=new Promise(async s=>{if(window.loadCardHelpers){s(await window.loadCardHelpers());return}let e=setInterval(async()=>{window.loadCardHelpers&&(clearInterval(e),s(await window.loadCardHelpers()))},100);setTimeout(()=>{clearInterval(e),console.warn("[UniversalCard] Card helpers not available"),s(null)},1e4)}),Ke)}async function ii(s){if(!s||!s.type)throw new Error("Card config must have a type");let e=await Pe();if(e)try{return await e.createCardElement(s)}catch(t){throw new Error(`Failed to create card: ${t.message}`)}return Zi(s)}function Zi(s){let e=s.type,t=e;e.startsWith("custom:")?t=e.slice(7):t=`hui-${e}-card`;let i=document.createElement(t);return i.setConfig&&i.setConfig(s),i}async function ce(s){return Array.isArray(s)?(await Promise.allSettled(s.map(t=>ii(t)))).map((t,i)=>t.status==="fulfilled"?t.value:(console.error("[UniversalCard] Card creation failed:",t.reason),ai(t.reason,s[i]))):[]}function ai(s,e){let t=document.createElement("ha-card");return t.className="uc-error-card",t.innerHTML=`
    <div class="error-content">
      <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      <span class="error-message">${s.message||"Unknown error"}</span>
      <button class="error-details-btn">?</button>
    </div>
  `,t._errorData={error:s,config:e,stack:s.stack},t}function Je(s,e){return!(s!=null&&s.states)||!e?null:s.states[e]||null}function R(s,e,t="unavailable"){let i=Je(s,e);return i&&i.state!==void 0?i.state:t}function ae(s,e,t,i){let a=Je(s,e);var r=a&&a.attributes?a.attributes[t]:void 0;return r!==void 0?r:i}function Li(s,e,t){let i=R(s,e);return(Array.isArray(t)?t:[t]).includes(i)}async function J(s,e,t,i={}){if(!t||t.action==="none")return;let{action:a}=t;switch(a){case"toggle":await Qi(s,t);break;case"call-service":await ea(s,t);break;case"navigate":ta(t);break;case"url":ia(t);break;case"more-info":aa(e,t);break;case"fire-dom-event":ra(e,t);break;default:console.warn(`[UniversalCard] Unknown action: ${a}`)}}async function Qi(s,e){let t=e.entity;if(!t)return;let i=t.split(".")[0];await s.callService(i,"toggle",{entity_id:t})}async function ea(s,e){let{service:t,service_data:i,target:a}=e;if(!t)return;let[r,o]=t.split(".");await s.callService(r,o,i||{},a)}function ta(s){let e=s.navigation_path;e&&(history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")))}function ia(s){let e=s.url_path;if(!e)return;let t=s.url_target||"_blank";window.open(e,t)}function aa(s,e){let t=e.entity;if(!t)return;let i=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}),a=s;for(;a&&a.tagName!=="UNIVERSAL-CARD";)a=a.parentElement||a.getRootNode().host;a&&a.isConnected?a.dispatchEvent(i):(document.querySelector("ha-panel-lovelace")||document.querySelector("home-assistant")||document.body).dispatchEvent(i)}function ra(s,e){let t=new CustomEvent("ll-custom",{bubbles:!0,composed:!0,detail:e});s.dispatchEvent(t)}function Ii(s="light"){let e=new CustomEvent("haptic",{bubbles:!0,composed:!0,detail:s});window.dispatchEvent(e)}function Oi(s){let e=getComputedStyle(s);return{primaryColor:e.getPropertyValue("--primary-color").trim(),accentColor:e.getPropertyValue("--accent-color").trim(),textColor:e.getPropertyValue("--primary-text-color").trim(),secondaryTextColor:e.getPropertyValue("--secondary-text-color").trim(),backgroundColor:e.getPropertyValue("--primary-background-color").trim(),cardBackgroundColor:e.getPropertyValue("--ha-card-background").trim()||e.getPropertyValue("--card-background-color").trim(),dividerColor:e.getPropertyValue("--divider-color").trim(),borderRadius:e.getPropertyValue("--ha-card-border-radius").trim()||"12px"}}function Ze(s){return(s==null?void 0:s.user)||null}function Ri(s){var e;return((e=s==null?void 0:s.user)==null?void 0:e.is_admin)===!0}var Oe=class{constructor(e,t={}){this._config=e,this._options=t,this._element=null,this._leftCards=[],this._rightCards=[],this._contentCards=[],this._hass=null,this._expanded=!1,this._holdTimer=null,this._isHolding=!1,this._holdDuration=500,this._lastTapTime=0,this._doubleTapThreshold=300,this._attached=!1,this._boundHandlers=null}set hass(e){this._hass=e,this._updateCards(e),this._updateDynamicContent()}set expanded(e){this._expanded=e,this._updateExpandedState()}render(){let e=this._config;return this._element=document.createElement("div"),this._element.className=this._getHeaderClasses(),this._element.setAttribute("role","button"),this._element.setAttribute("tabindex","0"),this._element.setAttribute("aria-expanded",String(this._expanded)),this._element.innerHTML=`
      <div class="header-left">
        ${this._renderIcon()}
        <div class="header-left-slot"></div>
      </div>
      <div class="header-content">
        ${this._renderTitle()}
        ${this._renderSubtitle()}
        <div class="header-cards-slot"></div>
      </div>
      <div class="header-right">
        ${this._renderBadges()}
        <div class="header-right-slot"></div>
        ${this._renderExpandIcon()}
      </div>
    `,this._bindEvents(),this._attached=!0,this._element}_renderIcon(){let{icon:e,entity:t}=this._config;if(!e&&!t)return"";let i=e||this._getEntityIcon(t);return i?`
      <ha-icon class="header-icon" icon="${i}"></ha-icon>
    `:""}_renderTitle(){let{title:e,entity:t}=this._config,i=e||this._getEntityName(t)||"";return i?`<div class="header-title">${i}</div>`:""}_renderSubtitle(){let{subtitle:e,entity:t,show_state:i}=this._config,a=e||"";if(i!==!1&&t&&this._hass){let r=R(this._hass,t);r&&r!=="unavailable"&&(a=a?`${a} \xB7 ${r}`:r)}return a?`<div class="header-subtitle">${a}</div>`:""}_renderBadges(){let{badges:e}=this._config;return!e||!Array.isArray(e)||e.length===0?"":`<div class="header-badges">${e.map(i=>this._renderBadge(i)).join("")}</div>`}_renderBadge(e){let{entity:t,icon:i,color:a,value:r,label:o}=e,n=r||"",c=a||"var(--primary-color)";if(t&&this._hass){n=R(this._hass,t,"");let p=this._hass.states[t];if(p){let h=this._getStateColor(p.state);h&&(c=h)}}let l=i?`<ha-icon icon="${i}"></ha-icon>`:"",d=o?`<span class="badge-label">${o}</span>`:"",u=n?`<span class="badge-value">${n}</span>`:"";return`
      <div class="badge" style="--badge-color: ${c}">
        ${l}${d}${u}
      </div>
    `}_renderExpandIcon(){let{show_expand_icon:e,expand_icon:t,body_mode:i}=this._config;if(i==="none"||e===!1)return"";let a=t||"mdi:chevron-down";return`
      <ha-icon class="expand-icon ${this._expanded?"expanded":""}" icon="${a}"></ha-icon>
    `}_getHeaderClasses(){let e=["header"];return this._expanded&&e.push("expanded"),(this._config.sticky_header||this._config.sticky)&&e.push("sticky"),this._config.clickable===!1&&e.push("non-clickable"),e.join(" ")}async loadCards(){let{header_left:e,header_right:t,cards:i}=this._config,a=[];e!=null&&e.cards&&a.push(this._loadSlotCards(e.cards,".header-left-slot","_leftCards")),t!=null&&t.cards&&a.push(this._loadSlotCards(t.cards,".header-right-slot","_rightCards")),i&&a.push(this._loadSlotCards(i,".header-cards-slot","_contentCards")),await Promise.all(a)}async _loadSlotCards(e,t,i){var r;if(!Array.isArray(e)||e.length===0)return;let a=(r=this._element)==null?void 0:r.querySelector(t);if(a)try{let o=await ce(e);this[i]=o;let n=document.createDocumentFragment();o.forEach(c=>{this._hass&&(c.hass=this._hass),n.appendChild(c)}),a.appendChild(n)}catch(o){console.error("[UniversalCard] Failed to load slot cards:",o)}}_updateCards(e){[...this._leftCards,...this._rightCards,...this._contentCards].forEach(i=>{if(i&&"hass"in i)try{i.hass=e}catch(a){}})}_bindEvents(){this._element&&(this._boundHandlers={click:e=>this._handleClick(e),touchstart:e=>this._handleTouchStart(e),touchend:e=>this._handleTouchEnd(e),touchcancel:()=>this._cancelHold(),mousedown:e=>this._handleMouseDown(e),mouseup:()=>this._handleMouseUp(),mouseleave:()=>this._cancelHold(),keydown:e=>this._handleKeydown(e),contextmenu:e=>this._handleContextMenu(e)},this._element.addEventListener("click",this._boundHandlers.click),this._element.addEventListener("touchstart",this._boundHandlers.touchstart,{passive:!0}),this._element.addEventListener("touchend",this._boundHandlers.touchend),this._element.addEventListener("touchcancel",this._boundHandlers.touchcancel),this._element.addEventListener("mousedown",this._boundHandlers.mousedown),this._element.addEventListener("mouseup",this._boundHandlers.mouseup),this._element.addEventListener("mouseleave",this._boundHandlers.mouseleave),this._element.addEventListener("keydown",this._boundHandlers.keydown),this._element.addEventListener("contextmenu",this._boundHandlers.contextmenu))}_handleClick(e){if(m("[UC-Header] click!",e.target),this._isInteractiveElement(e.target)){m("[UC-Header] ignored - interactive element");return}if(this._isHolding){m("[UC-Header] ignored - was holding"),this._isHolding=!1;return}let t=Date.now(),i=t-this._lastTapTime;if(this._lastTapTime=t,i<this._doubleTapThreshold){m("[UC-Header] double-tap detected"),e.preventDefault(),this._executeAction("double_tap_action");return}setTimeout(()=>{Date.now()-this._lastTapTime>=this._doubleTapThreshold&&this._executeAction("tap_action")},this._doubleTapThreshold)}_handleTouchStart(e){this._isInteractiveElement(e.target)||this._startHold()}_handleTouchEnd(e){this._endHold()}_handleMouseDown(e){e.button===0&&(this._isInteractiveElement(e.target)||this._startHold())}_handleMouseUp(){this._endHold()}_startHold(){this._cancelHold(),this._holdTimer=setTimeout(()=>{this._isHolding=!0,this._executeAction("hold_action")},this._holdDuration)}_endHold(){this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)}_cancelHold(){this._endHold(),this._isHolding=!1}_handleKeydown(e){(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this._executeAction("tap_action"))}_handleContextMenu(e){this._config.context_menu&&(e.preventDefault(),_(this._element,"uc-context-menu",{x:e.clientX,y:e.clientY,config:this._config.context_menu}))}_isInteractiveElement(e){if(!this._element||!e)return!0;if(e===this._element||this._element.contains(e)){let t=["ha-icon-button","button","a[href]","input","select","textarea",".badge.clickable",".quick-action"],i=e;for(;i&&i!==this._element;){if(i.matches&&i.matches(t.join(", ")))return m("[UC-Header] blocked interactive:",i.tagName),!0;i=i.parentElement}return!1}return!1}_executeAction(e){m("[UC-Header] _executeAction:",e);let t=this._config.expand_trigger||"tap",i=t==="double_tap"?"double_tap_action":`${t}_action`;m("[UC-Header] expand_trigger:",t,"expandActionKey:",i);let a=this._config[e],r=a&&a.action&&a.action!=="none";if(m("[UC-Header] actionConfig:",a,"hasExplicitAction:",r),e===i&&!r&&t!=="none"){m("[UC-Header] firing uc-toggle (expand trigger default)"),_(this._element,"uc-toggle");return}if(!r){m("[UC-Header] no explicit action");return}if(a.action===V.EXPAND){m("[UC-Header] firing uc-expand"),_(this._element,"uc-expand");return}if(a.action===V.COLLAPSE){m("[UC-Header] firing uc-collapse"),_(this._element,"uc-collapse");return}if(a.action==="toggle"){m("[UC-Header] firing uc-toggle"),_(this._element,"uc-toggle");return}m("[UC-Header] executing HA action"),J(this._hass,this._element,a)}_updateExpandedState(){if(!this._element)return;this._element.classList.toggle("expanded",this._expanded),this._element.setAttribute("aria-expanded",String(this._expanded));let e=this._element.querySelector(".expand-icon");e&&e.classList.toggle("expanded",this._expanded)}_updateDynamicContent(){if(!(!this._element||!this._hass)){if(this._config.entity&&this._config.show_state!==!1){let e=this._element.querySelector(".header-subtitle");if(e){let t=R(this._hass,this._config.entity),i=this._config.subtitle;e.textContent=i?`${i} \xB7 ${t}`:t}}this._updateBadges()}}_updateBadges(){let{badges:e}=this._config;if(!e||!Array.isArray(e))return;let t=this._element.querySelectorAll(".badge");e.forEach((i,a)=>{if(!i.entity||!t[a])return;let r=R(this._hass,i.entity,""),o=t[a].querySelector(".badge-value");o&&(o.textContent=r)})}_getEntityIcon(e){if(!this._hass||!e)return null;let t=this._hass.states[e];if(!t)return null;if(t.attributes.icon)return t.attributes.icon;let i=e.split(".")[0];return this._getDomainIcon(i)}_getEntityName(e){var i;if(!this._hass||!e)return null;let t=this._hass.states[e];return((i=t==null?void 0:t.attributes)==null?void 0:i.friendly_name)||null}_getDomainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:radiobox-blank",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",alarm_control_panel:"mdi:shield-home",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",person:"mdi:account",device_tracker:"mdi:account",weather:"mdi:weather-partly-cloudy",vacuum:"mdi:robot-vacuum"}[e]||"mdi:bookmark"}_getStateColor(e){return{on:"var(--state-active-color, #fdd835)",off:"var(--state-inactive-color, #969696)",home:"var(--state-home-color, #4caf50)",not_home:"var(--state-not-home-color, #f44336)",armed_home:"var(--state-warning-color, #ff9800)",armed_away:"var(--state-error-color, #f44336)",disarmed:"var(--state-success-color, #4caf50)",unavailable:"var(--state-unavailable-color, #bdbdbd)"}[e]||null}detach(){this._cancelHold(),this._removeEventListeners(),this._attached=!1}attach(){this._attached||this._element&&(this._bindEvents(),this._attached=!0)}_removeEventListeners(){this._element&&this._boundHandlers&&(this._element.removeEventListener("click",this._boundHandlers.click),this._element.removeEventListener("touchstart",this._boundHandlers.touchstart),this._element.removeEventListener("touchend",this._boundHandlers.touchend),this._element.removeEventListener("touchcancel",this._boundHandlers.touchcancel),this._element.removeEventListener("mousedown",this._boundHandlers.mousedown),this._element.removeEventListener("mouseup",this._boundHandlers.mouseup),this._element.removeEventListener("mouseleave",this._boundHandlers.mouseleave),this._element.removeEventListener("keydown",this._boundHandlers.keydown),this._element.removeEventListener("contextmenu",this._boundHandlers.contextmenu)),this._boundHandlers=null}destroy(){this._cancelHold(),this._removeEventListeners(),this._leftCards=[],this._rightCards=[],this._contentCards=[],this._hass=null,this._element=null,this._attached=!1}};var Re=class{constructor(e,t={}){this._config=e,this._options=t,this._element=null,this._leftCards=[],this._rightCards=[],this._contentCards=[],this._hass=null,this._holdTimer=null,this._isHolding=!1}set hass(e){this._hass=e,this._updateCards(e)}render(){let e=this._config;return this._element=document.createElement("div"),this._element.className=this._getFooterClasses(),this._element.innerHTML=`
      <div class="footer-left">
        <div class="footer-left-slot"></div>
      </div>
      <div class="footer-content">
        ${this._renderText()}
        <div class="footer-cards-slot"></div>
      </div>
      <div class="footer-right">
        <div class="footer-right-slot"></div>
        ${this._renderActions()}
      </div>
    `,this._bindEvents(),this._element}_renderText(){let{text:e,icon:t}=this._config;return e?`
      <div class="footer-text">
        ${t?`<ha-icon icon="${t}"></ha-icon>`:""}
        <span>${e}</span>
      </div>
    `:""}_renderActions(){let{actions:e}=this._config;return!e||!Array.isArray(e)?"":e.map((t,i)=>`
      <button class="footer-action-btn" data-action-index="${i}">
        ${t.icon?`<ha-icon icon="${t.icon}"></ha-icon>`:""}
        ${t.label||""}
      </button>
    `).join("")}_getFooterClasses(){let e=["footer"];return this._config.sticky&&e.push("sticky"),this._config.border_top!==!1&&e.push("with-border"),e.join(" ")}async loadCards(){let{footer_left:e,footer_right:t,cards:i}=this._config,a=[];e!=null&&e.cards&&a.push(this._loadSlotCards(e.cards,".footer-left-slot","_leftCards")),t!=null&&t.cards&&a.push(this._loadSlotCards(t.cards,".footer-right-slot","_rightCards")),i&&a.push(this._loadSlotCards(i,".footer-cards-slot","_contentCards")),await Promise.all(a)}async _loadSlotCards(e,t,i){var r;if(!Array.isArray(e)||e.length===0)return;let a=(r=this._element)==null?void 0:r.querySelector(t);if(a)try{let o=await ce(e);this[i]=o;let n=document.createDocumentFragment();o.forEach(c=>{this._hass&&(c.hass=this._hass),n.appendChild(c)}),a.appendChild(n)}catch(o){console.error("[UniversalCard] Failed to load footer cards:",o)}}_updateCards(e){[...this._leftCards,...this._rightCards,...this._contentCards].forEach(i=>{if(i&&"hass"in i)try{i.hass=e}catch(a){}})}_bindEvents(){this._element&&(this._element.querySelectorAll(".footer-action-btn").forEach(e=>{e.addEventListener("click",t=>this._handleActionClick(t))}),(this._config.tap_action||this._config.hold_action)&&(this._element.addEventListener("click",e=>this._handleClick(e)),this._element.addEventListener("mousedown",e=>this._handleMouseDown(e)),this._element.addEventListener("mouseup",()=>this._handleMouseUp()),this._element.addEventListener("mouseleave",()=>this._cancelHold())))}_handleActionClick(e){var r;let t=e.currentTarget,i=parseInt(t.dataset.actionIndex,10),a=(r=this._config.actions)==null?void 0:r[i];a&&J(this._hass,this._element,a)}_handleClick(e){if(!this._isInteractiveElement(e.target)){if(this._isHolding){this._isHolding=!1;return}this._executeAction("tap_action")}}_handleMouseDown(e){e.button===0&&(this._isInteractiveElement(e.target)||(this._holdTimer=setTimeout(()=>{this._isHolding=!0,this._executeAction("hold_action")},500)))}_handleMouseUp(){this._holdTimer&&(clearTimeout(this._holdTimer),this._holdTimer=null)}_cancelHold(){this._handleMouseUp(),this._isHolding=!1}_isInteractiveElement(e){return e.closest("button, a, input, .footer-action-btn")!==null}_executeAction(e){let t=this._config[e];!t||t.action===V.NONE||J(this._hass,this._element,t)}destroy(){this._cancelHold(),this._leftCards=[],this._rightCards=[],this._contentCards=[],this._element=null}};var Qe=class{constructor(e=[]){this._configs=e,this._element=null,this._hass=null}set hass(e){this._hass=e,this._update()}set configs(e){this._configs=e,this._render()}render(){return this._element=document.createElement("div"),this._element.className="badges-container",this._renderBadges(),this._element}_renderBadges(){this._element&&(this._element.innerHTML=this._configs.map((e,t)=>this._renderBadge(e,t)).join(""))}_renderBadge(e,t){let{type:i="state",entity:a,attribute:r,icon:o,color:n,value:c,label:l,unit:d,min:u,max:p,show_name:h=!1,tap_action:g}=e,b=this._getValue(e),y=n||this._getAutoColor(e);b!=null&&(b=this._formatValue(b,e));let I=o?`<ha-icon class="badge-icon" icon="${o}"></ha-icon>`:"",B=l?`<span class="badge-label">${l}</span>`:"",q=d?`<span class="badge-unit">${d}</span>`:"",ye=b!=null?`<span class="badge-value">${b}</span>${q}`:"",Ae=this._renderProgress(e,b);return`
      <div class="badge ${g?"clickable":""}" 
           data-badge-index="${t}"
           style="--badge-color: ${y}">
        ${I}
        <div class="badge-content">
          ${B}
          ${ye}
          ${Ae}
        </div>
      </div>
    `}_renderProgress(e,t){let{min:i,max:a,show_progress:r}=e;if(!r||i===void 0||a===void 0)return"";let o=parseFloat(t);return isNaN(o)?"":`
      <div class="badge-progress">
        <div class="badge-progress-bar" style="width: ${Math.min(100,Math.max(0,(o-i)/(a-i)*100))}%"></div>
      </div>
    `}_getValue(e){let{type:t,entity:i,attribute:a,value:r}=e;if(r!==void 0)return r;if(!i||!this._hass)return null;switch(t){case"state":return R(this._hass,i);case"attribute":return ae(this._hass,i,a);case"counter":return this._getCounterValue(e);default:return R(this._hass,i)}}_getCounterValue(e){let{entities:t,domain:i,state:a,count_state:r}=e;if(!this._hass)return 0;let o=[];t&&Array.isArray(t)?o=t:i&&(o=Object.keys(this._hass.states).filter(c=>c.startsWith(`${i}.`)));let n=r||a||"on";return o.filter(c=>{let l=this._hass.states[c];return(l==null?void 0:l.state)===n}).length}_formatValue(e,t){let{precision:i,format:a}=t;if(i!==void 0&&!isNaN(parseFloat(e)))return parseFloat(e).toFixed(i);if(a==="time"||a==="date")try{let r=new Date(e);return a==="time"?r.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"}):r.toLocaleDateString("ru-RU")}catch(r){return e}return a==="duration"?this._formatDuration(e):String(e)}_formatDuration(e){let t=parseInt(e,10);if(isNaN(t))return e;let i=Math.floor(t/3600),a=Math.floor(t%3600/60),r=t%60;return i>0?`${i}:${String(a).padStart(2,"0")}:${String(r).padStart(2,"0")}`:`${a}:${String(r).padStart(2,"0")}`}_getAutoColor(e){let{entity:t,thresholds:i}=e,a="var(--primary-color)";if(!t||!this._hass)return a;let r=this._hass.states[t];if(!r)return a;let o={on:"var(--state-active-color, #fdd835)",off:"var(--disabled-text-color, #969696)",home:"var(--success-color, #4caf50)",not_home:"var(--error-color, #f44336)",unavailable:"var(--disabled-text-color, #bdbdbd)",unknown:"var(--disabled-text-color, #bdbdbd)"};if(o[r.state])return o[r.state];if(i&&Array.isArray(i)){let n=parseFloat(r.state);if(!isNaN(n)){let c=[...i].sort((l,d)=>d.value-l.value);for(let l of c)if(n>=l.value)return l.color}}return a}_update(){if(!this._element||!this._hass)return;let e=this._element.querySelectorAll(".badge");this._configs.forEach((t,i)=>{let a=e[i];if(!a)return;let r=a.querySelector(".badge-value");if(r){let n=this._getValue(t);r.textContent=this._formatValue(n,t)}let o=t.color||this._getAutoColor(t);if(a.style.setProperty("--badge-color",o),t.show_progress){let n=a.querySelector(".badge-progress-bar");if(n){let c=parseFloat(this._getValue(t)),l=Math.min(100,Math.max(0,(c-t.min)/(t.max-t.min)*100));n.style.width=`${l}%`}}})}static getStyles(){return`
      .badges-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      
      .badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        background: color-mix(in srgb, var(--badge-color) 15%, transparent);
        border-radius: 12px;
        font-size: 12px;
        color: var(--badge-color);
      }
      
      .badge.clickable {
        cursor: pointer;
        transition: background 0.2s ease;
      }
      
      .badge.clickable:hover {
        background: color-mix(in srgb, var(--badge-color) 25%, transparent);
      }
      
      .badge-icon {
        --mdc-icon-size: 14px;
      }
      
      .badge-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }
      
      .badge-label {
        font-size: 10px;
        opacity: 0.8;
        text-transform: uppercase;
      }
      
      .badge-value {
        font-weight: 500;
      }
      
      .badge-unit {
        font-size: 10px;
        opacity: 0.8;
        margin-left: 2px;
      }
      
      .badge-progress {
        width: 100%;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        overflow: hidden;
        margin-top: 2px;
      }
      
      .badge-progress-bar {
        height: 100%;
        background: var(--badge-color);
        border-radius: 2px;
        transition: width 0.3s ease;
      }
    `}destroy(){this._element=null,this._hass=null}};var D=class s{constructor(e,t={}){if(new.target===s)throw new Error("BaseMode is an abstract class and cannot be instantiated directly");this._config=e,this._options=t,this._container=null,this._cards=[],this._hass=null,this._loaded=!1,this._active=!1}render(){throw new Error("render() must be implemented by subclass")}async open(){throw new Error("open() must be implemented by subclass")}async close(){throw new Error("close() must be implemented by subclass")}static getStyles(){throw new Error("getStyles() must be implemented by subclass")}set hass(e){this._hass=e,this._updateCardsHass(e)}get hass(){return this._hass}get active(){return this._active}get loaded(){return this._loaded}async loadCards(e){if(this._loaded||!Array.isArray(e)||e.length===0){this._loaded=!0;return}try{let t=await this._getCardHelpers();this._cards=await Promise.all(e.map(i=>this._createCard(i,t))),this._loaded=!0}catch(t){console.error("[UniversalCard] Failed to load cards:",t),this._loaded=!0}}async _createCard(e,t){try{let i=await t.createCardElement(e);return this._hass&&(i.hass=this._hass),i}catch(i){return console.error("[UniversalCard] Card creation error:",i),this._createErrorCard(i,e)}}_createErrorCard(e,t){let i=document.createElement("div");i.className="uc-error-card",i.innerHTML=`
      <div class="error-icon">
        <ha-icon icon="mdi:alert-circle-outline"></ha-icon>
      </div>
      <div class="error-message">${e.message||"Error loading card"}</div>
      <button class="error-details-btn" title="View details">?</button>
    `,i._errorData={error:e,config:t,stack:e.stack};let a=i.querySelector(".error-details-btn");return a==null||a.addEventListener("click",r=>{r.stopPropagation(),this._showErrorDetails(i._errorData)}),i}_showErrorDetails(e){var a,r;let t=document.createElement("div");t.className="uc-error-popup-overlay",t.innerHTML=`
      <div class="uc-error-popup">
        <div class="popup-header">
          <span>Error Details</span>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-content">
          <div class="error-section">
            <strong>Message:</strong>
            <pre>${((a=e.error)==null?void 0:a.message)||"Unknown error"}</pre>
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
    `;let i=()=>t.remove();(r=t.querySelector(".popup-close"))==null||r.addEventListener("click",i),t.addEventListener("click",o=>{o.target===t&&i()}),document.body.appendChild(t)}async _getCardHelpers(){return window.loadCardHelpers?await window.loadCardHelpers():new Promise(e=>{let t=setInterval(()=>{window.loadCardHelpers&&(clearInterval(t),window.loadCardHelpers().then(e))},100);setTimeout(()=>{clearInterval(t),e(null)},1e4)})}_updateCardsHass(e){this._cards.forEach(t=>{if(t&&"hass"in t)try{t.hass=e}catch(i){}})}_appendCards(e,t=[]){let i=document.createDocumentFragment();this._cards.forEach((a,r)=>{let o=document.createElement("div");o.className="card-wrapper";let n=t[r];if(n){let c=n.colspan||n.card_options&&n.card_options.colspan,l=n.rowspan||n.card_options&&n.card_options.rowspan;c&&(o.style.gridColumn="span "+c),l&&(o.style.gridRow="span "+l)}o.appendChild(a),i.appendChild(o)}),e.appendChild(i)}_animate(e,t,i=300){return new Promise(a=>{e.classList.add(t),setTimeout(()=>{e.classList.remove(t),a()},i)})}_waitForTransition(e,t=500){return new Promise(i=>{let a=()=>{e.removeEventListener("transitionend",a),i()};e.addEventListener("transitionend",a),setTimeout(i,t)})}destroy(){this._cards=[],this._container=null,this._loaded=!1,this._active=!1}};var le=class extends D{constructor(e,t={}){super(e,t),this._contentWrapper=null,this._animationDuration=e.animation_duration||300,this._expandAnimation=e.expand_animation||"slide",this._collapseAnimation=e.collapse_animation||"slide",this._cardsAnimation=e.cards_animation||"fadeUp",this._cardsStagger=e.cards_stagger||50,this._cardsDirection=e.cards_direction||"sequential"}render(){this._container=document.createElement("div"),this._container.className="expand-mode",this._container.dataset.state=this._active?"expanded":"collapsed",this._container.dataset.expandAnimation=this._expandAnimation,this._container.dataset.collapseAnimation=this._collapseAnimation,this._container.dataset.cardsAnimation=this._cardsAnimation,this._container.dataset.cardsDirection=this._cardsDirection,this._container.style.setProperty("--expand-duration",`${this._animationDuration}ms`),this._container.style.setProperty("--cards-stagger",`${this._cardsStagger}ms`),this._contentWrapper=document.createElement("div"),this._contentWrapper.className="expand-content";let e=document.createElement("div");if(e.className="expand-grid",this._config.grid){let t=this._config.grid,i=t.columns||1,a=typeof t.columns=="string";(a||typeof i=="number"&&i>1||t.display==="grid")&&(e.classList.add("has-grid"),a?e.style.gridTemplateColumns=t.columns:i>1&&(e.style.gridTemplateColumns="repeat("+i+", 1fr)"),t.rows&&(typeof t.rows=="string"?e.style.gridTemplateRows=t.rows:e.style.gridTemplateRows="repeat("+t.rows+", auto)"),t.auto_rows&&(e.style.gridAutoRows=t.auto_rows),t.auto_columns&&(e.style.gridAutoColumns=t.auto_columns),e.style.gap=t.gap||"16px",t.row_gap&&(e.style.rowGap=t.row_gap),t.column_gap&&(e.style.columnGap=t.column_gap),t.align_items&&(e.style.alignItems=t.align_items),t.justify_items&&(e.style.justifyItems=t.justify_items),t.place_items&&(e.style.placeItems=t.place_items),t.align_content&&(e.style.alignContent=t.align_content),t.justify_content&&(e.style.justifyContent=t.justify_content),t.place_content&&(e.style.placeContent=t.place_content),t.direction&&(t.direction==="row"||t.direction==="row-reverse"?e.style.gridAutoFlow=t.direction==="row-reverse"?"row dense":"row":(t.direction==="column"||t.direction==="column-reverse")&&(e.style.gridAutoFlow=t.direction==="column-reverse"?"column dense":"column")),t.auto_flow&&(e.style.gridAutoFlow=t.auto_flow),t.dense&&(e.style.gridAutoFlow=(e.style.gridAutoFlow||"row")+" dense"))}return this._loaded||(e.innerHTML=this._renderSkeleton()),this._contentWrapper.appendChild(e),this._container.appendChild(this._contentWrapper),this._container}_renderSkeleton(){let e=this._config.skeleton_count||3;return`
      <div class="skeleton-container">
        ${Array(e).fill(0).map(()=>`
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line text short"></div>
          </div>
        `).join("")}
      </div>
    `}async open(){var e;this._active||(this._active=!0,this._loaded||(await this.loadCards(((e=this._config.body)==null?void 0:e.cards)||[]),this._populateCards()),this._container&&(this._container.classList.remove("collapsing"),this._container.classList.add("expanding"),this._container.dataset.state="expanded",this._container.offsetHeight,await this._waitForTransition(this._container,this._animationDuration+50),this._container.classList.remove("expanding")))}async close(){this._active&&(this._active=!1,this._container&&(this._container.classList.remove("expanding"),this._container.classList.add("collapsing"),this._container.dataset.state="collapsed",await this._waitForTransition(this._container,this._animationDuration+50),this._container.classList.remove("collapsing")))}async toggle(){this._active?await this.close():await this.open()}_populateCards(){var i;if(!this._contentWrapper)return;let e=this._contentWrapper.querySelector(".expand-grid");if(!e)return;let t=e.querySelector(".skeleton-container");t&&(t.classList.add("fade-out"),setTimeout(()=>t.remove(),200)),this._appendCards(e,((i=this._config.body)==null?void 0:i.cards)||[])}static getStyles(){return`
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
    `}destroy(){this._contentWrapper=null,super.destroy()}};var de=class extends D{constructor(e,t={}){super(e,t),this._overlay=null,this._dialog=null,this._portalTarget=document.body,this._escapeHandler=this._handleEscape.bind(this);let i=e.modal||{};this._width=i.width||"90%",this._maxWidth=i.max_width||"600px",this._backdropBlur=i.backdrop_blur!==!1,this._backdropColor=i.backdrop_color||"rgba(0, 0, 0, 0.6)",this._closeOnBackdrop=i.close_on_backdrop!==!1,this._closeOnEscape=i.close_on_escape!==!1,this._showClose=i.show_close!==!1}render(){return this._container=document.createElement("div"),this._container.className="modal-mode-placeholder",this._container.style.display="none",this._container}_renderModal(){this._overlay=document.createElement("div"),this._overlay.className="uc-modal-overlay",this._overlay.style.setProperty("--modal-backdrop-color",this._backdropColor),this._backdropBlur&&this._overlay.classList.add("with-blur"),this._dialog=document.createElement("div"),this._dialog.className="uc-modal-dialog",this._dialog.style.setProperty("--modal-width",this._width),this._dialog.style.setProperty("--modal-max-width",this._maxWidth),this._dialog.setAttribute("role","dialog"),this._dialog.setAttribute("aria-modal","true");let e=this._renderHeader(),t=document.createElement("div");t.className="uc-modal-content";let i=document.createElement("div");if(i.className="uc-modal-grid",this._config.grid){let{columns:a=1,gap:r="16px"}=this._config.grid;a>1&&(i.style.display="grid",i.style.gridTemplateColumns=`repeat(${a}, 1fr)`,i.style.gap=r)}return this._loaded||(i.innerHTML=this._renderSkeleton()),t.appendChild(i),this._dialog.appendChild(e),this._dialog.appendChild(t),this._overlay.appendChild(this._dialog),this._overlay}_renderHeader(){let e=document.createElement("div");e.className="uc-modal-header";let t=document.createElement("div");if(t.className="uc-modal-title",t.textContent=this._config.title||"",e.appendChild(t),this._showClose){let i=document.createElement("button");i.className="uc-modal-close",i.innerHTML='<ha-icon icon="mdi:close"></ha-icon>',i.addEventListener("click",()=>this.close()),e.appendChild(i)}return e}_renderSkeleton(){let e=this._config.skeleton_count||3;return`
      <div class="skeleton-container">
        ${Array(e).fill(0).map(()=>`
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line text short"></div>
          </div>
        `).join("")}
      </div>
    `}async open(){var t,i;if(this._active)return;this._active=!0;let e=this._renderModal();this._portalTarget.appendChild(e),document.body.style.overflow="hidden",this._closeOnBackdrop&&this._overlay.addEventListener("click",a=>{a.target===this._overlay&&this.close()}),this._closeOnEscape&&document.addEventListener("keydown",this._escapeHandler),requestAnimationFrame(()=>{var a,r;(a=this._overlay)==null||a.classList.add("open"),(r=this._dialog)==null||r.classList.add("open")}),this._loaded||(await this.loadCards(((t=this._config.body)==null?void 0:t.cards)||[]),this._populateCards()),await new Promise(a=>setTimeout(a,300)),(i=this._dialog)==null||i.focus()}async close(){var e,t,i;this._active&&(this._active=!1,(e=this._overlay)==null||e.classList.remove("open"),(t=this._dialog)==null||t.classList.remove("open"),await new Promise(a=>setTimeout(a,250)),document.removeEventListener("keydown",this._escapeHandler),(i=this._overlay)==null||i.remove(),this._overlay=null,this._dialog=null,document.body.style.overflow="",this._options.onClose&&this._options.onClose())}_handleEscape(e){e.key==="Escape"&&this.close()}_populateCards(){var i;if(!this._dialog)return;let e=this._dialog.querySelector(".uc-modal-grid");if(!e)return;let t=e.querySelector(".skeleton-container");t&&(t.classList.add("fade-out"),setTimeout(()=>t.remove(),200)),this._appendCards(e,((i=this._config.body)==null?void 0:i.cards)||[])}static getStyles(){return`
      /* ============================= */
      /* MODAL OVERLAY */
      /* ============================= */
      
      .uc-modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
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
        max-width: var(--modal-max-width, 600px);
        max-height: 90vh;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transform: scale(0.95) translateY(20px);
        opacity: 0;
        transition: 
          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
          opacity 0.3s ease;
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
        padding: 16px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }
      
      .uc-modal-title {
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
        flex: 1;
        overflow-y: auto;
        padding: 16px;
      }
      
      .uc-modal-grid {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .uc-modal-grid .card-wrapper {
        min-width: 0;
        animation: modal-card-appear 0.3s ease forwards;
        opacity: 0;
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
        transition: opacity 0.2s ease;
      }
      
      .uc-modal-content .skeleton-container.fade-out {
        opacity: 0;
      }
      
      .uc-modal-content .skeleton-card {
        padding: 16px;
        background: var(--secondary-background-color, #f5f5f5);
        border-radius: 8px;
        margin-bottom: 8px;
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
    `}destroy(){var e;this._active&&(document.body.style.overflow="",(e=this._overlay)==null||e.remove()),document.removeEventListener("keydown",this._escapeHandler),this._overlay=null,this._dialog=null,super.destroy()}};var ue=class extends D{constructor(e,t={}){super(e,t),this._overlay=null,this._escapeHandler=this._handleEscape.bind(this);let i=e.fullscreen||{};this._background=i.background||"var(--primary-background-color, #fafafa)",this._showClose=i.show_close!==!1,this._closeOnEscape=i.close_on_escape!==!1,this._maxWidth=i.max_width||"1200px"}render(){return this._container=document.createElement("div"),this._container.className="fullscreen-mode-placeholder",this._container.style.display="none",this._container}_renderFullscreen(){this._overlay=document.createElement("div"),this._overlay.className="uc-fullscreen-overlay",this._overlay.style.setProperty("--fullscreen-bg",this._background);let e=document.createElement("div");e.className="uc-fullscreen-inner",e.style.setProperty("--fullscreen-max-width",this._maxWidth);let t=this._renderHeader(),i=document.createElement("div");i.className="uc-fullscreen-content";let a=document.createElement("div");if(a.className="uc-fullscreen-grid",this._config.grid){let{columns:r=1,gap:o="16px"}=this._config.grid;r>1&&(a.style.display="grid",a.style.gridTemplateColumns=`repeat(${r}, 1fr)`,a.style.gap=o)}return this._loaded||(a.innerHTML=this._renderSkeleton()),i.appendChild(a),e.appendChild(t),e.appendChild(i),this._overlay.appendChild(e),this._overlay}_renderHeader(){let e=document.createElement("div");if(e.className="uc-fullscreen-header",this._showClose){let a=document.createElement("button");a.className="uc-fullscreen-back",a.innerHTML='<ha-icon icon="mdi:arrow-left"></ha-icon>',a.addEventListener("click",()=>this.close()),e.appendChild(a)}let t=document.createElement("div");t.className="uc-fullscreen-title",t.textContent=this._config.title||"",e.appendChild(t);let i=document.createElement("div");return i.className="uc-fullscreen-spacer",e.appendChild(i),e}_renderSkeleton(){let e=this._config.skeleton_count||3;return`
      <div class="skeleton-container">
        ${Array(e).fill(0).map(()=>`
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line text short"></div>
          </div>
        `).join("")}
      </div>
    `}async open(){var t;if(this._active)return;this._active=!0;let e=this._renderFullscreen();document.body.appendChild(e),document.body.style.overflow="hidden",this._closeOnEscape&&document.addEventListener("keydown",this._escapeHandler),requestAnimationFrame(()=>{var i;(i=this._overlay)==null||i.classList.add("open")}),this._loaded||(await this.loadCards(((t=this._config.body)==null?void 0:t.cards)||[]),this._populateCards()),await new Promise(i=>setTimeout(i,300))}async close(){var e,t,i;this._active&&(this._active=!1,(e=this._overlay)==null||e.classList.remove("open"),(t=this._overlay)==null||t.classList.add("closing"),await new Promise(a=>setTimeout(a,250)),document.removeEventListener("keydown",this._escapeHandler),(i=this._overlay)==null||i.remove(),this._overlay=null,document.body.style.overflow="",this._options.onClose&&this._options.onClose())}_handleEscape(e){e.key==="Escape"&&this.close()}_populateCards(){var i;if(!this._overlay)return;let e=this._overlay.querySelector(".uc-fullscreen-grid");if(!e)return;let t=e.querySelector(".skeleton-container");t&&(t.classList.add("fade-out"),setTimeout(()=>t.remove(),200)),this._appendCards(e,((i=this._config.body)==null?void 0:i.cards)||[])}static getStyles(){return`
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
        max-width: var(--fullscreen-max-width, 1200px);
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
      }
      
      .uc-fullscreen-grid {
        display: flex;
        flex-direction: column;
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
    `}destroy(){var e;this._active&&(document.body.style.overflow="",(e=this._overlay)==null||e.remove()),document.removeEventListener("keydown",this._escapeHandler),this._overlay=null,super.destroy()}};var ee=class extends D{constructor(e,t={}){super(e,t),this._activeTab=0,this._tabCards={},this._loadedTabs={},this._tabBar=null,this._tabContent=null,this._tabs=e.tabs||[];let i=e.tabs_config||{};this._tabPosition=i.position||"top",this._showIcons=i.show_icons!==!1,this._showLabels=i.show_labels!==!1}render(){return this._container=document.createElement("div"),this._container.className="tabs-mode",this._container.dataset.state=this._active?"expanded":"collapsed",this._container.dataset.tabPosition=this._tabPosition,this._tabBar=this._renderTabBar(),this._tabContent=document.createElement("div"),this._tabContent.className="tabs-content",this._tabs.forEach((e,t)=>{let i=this._renderTabPanel(e,t);this._tabContent.appendChild(i)}),this._tabPosition==="bottom"?(this._container.appendChild(this._tabContent),this._container.appendChild(this._tabBar)):(this._container.appendChild(this._tabBar),this._container.appendChild(this._tabContent)),this._container}_renderTabBar(){let e=document.createElement("div");e.className="tabs-bar",e.setAttribute("role","tablist"),this._tabs.forEach((i,a)=>{let r=document.createElement("button");if(r.className="tab-button",r.setAttribute("role","tab"),r.setAttribute("aria-selected",a===this._activeTab?"true":"false"),r.dataset.index=a,a===this._activeTab&&r.classList.add("active"),this._showIcons&&i.icon){let n=document.createElement("ha-icon");n.setAttribute("icon",i.icon),r.appendChild(n)}let o=i.label||i.title;if(this._showLabels&&o){let n=document.createElement("span");n.className="tab-label",n.textContent=o,r.appendChild(n)}r.addEventListener("click",()=>this._selectTab(a)),e.appendChild(r)});let t=document.createElement("div");return t.className="tab-indicator",e.appendChild(t),e}_renderTabPanel(e,t){let i=document.createElement("div");i.className="tab-panel",i.setAttribute("role","tabpanel"),i.dataset.index=t,t===this._activeTab&&i.classList.add("active");let a=document.createElement("div");a.className="tab-grid";let r=e.grid||this._config.grid||{},{columns:o=1,gap:n="16px"}=r;return o>1&&(a.style.display="grid",a.style.gridTemplateColumns=`repeat(${o}, 1fr)`,a.style.gap=n),t===this._activeTab&&(a.innerHTML=this._renderSkeleton()),i.appendChild(a),i}_renderSkeleton(){let e=this._config.skeleton_count||2;return`
      <div class="skeleton-container">
        ${Array(e).fill(0).map(()=>`
          <div class="skeleton-card">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
          </div>
        `).join("")}
      </div>
    `}async _selectTab(e){if(e===this._activeTab||e<0||e>=this._tabs.length)return;let t=this._activeTab;this._activeTab=e,this._updateTabButtons(),this._updateIndicator(),this._updatePanels(t,e),this._loadedTabs[e]||await this._loadTabCards(e)}_updateTabButtons(){var t;let e=(t=this._tabBar)==null?void 0:t.querySelectorAll(".tab-button");e==null||e.forEach((i,a)=>{let r=a===this._activeTab;i.classList.toggle("active",r),i.setAttribute("aria-selected",r?"true":"false")})}_updateIndicator(){var i,a;let e=(i=this._tabBar)==null?void 0:i.querySelector(".tab-indicator"),t=(a=this._tabBar)==null?void 0:a.querySelector(`.tab-button[data-index="${this._activeTab}"]`);if(e&&t){let{offsetLeft:r,offsetWidth:o}=t;e.style.left=`${r}px`,e.style.width=`${o}px`}}_updatePanels(e,t){var a;let i=(a=this._tabContent)==null?void 0:a.querySelectorAll(".tab-panel");i==null||i.forEach((r,o)=>{let n=o===t;r.classList.toggle("active",n),n&&(r.classList.remove("slide-left","slide-right"),r.classList.add(t>e?"slide-from-right":"slide-from-left"))})}async _loadTabCards(e){var a;let t=this._tabs[e],i=(t==null?void 0:t.cards)||[];if(i.length===0){this._loadedTabs[e]=!0;return}try{let r=await this._getCardHelpers();this._tabCards[e]=await Promise.all(i.map(c=>this._createCard(c,r))),this._loadedTabs[e]=!0;let o=(a=this._tabContent)==null?void 0:a.querySelector(`.tab-panel[data-index="${e}"]`),n=o==null?void 0:o.querySelector(".tab-grid");if(n){let c=n.querySelector(".skeleton-container");c&&(c.classList.add("fade-out"),setTimeout(()=>c.remove(),200));let l=document.createDocumentFragment();this._tabCards[e].forEach((d,u)=>{this._hass&&(d.hass=this._hass);let p=document.createElement("div");p.className="card-wrapper";let h=i[u];if(h){let g=h.colspan||h.card_options&&h.card_options.colspan,b=h.rowspan||h.card_options&&h.card_options.rowspan;g&&(p.style.gridColumn="span "+g),b&&(p.style.gridRow="span "+b)}p.appendChild(d),l.appendChild(p)}),n.appendChild(l)}}catch(r){console.error(`[UniversalCard] Failed to load tab ${e} cards:`,r),this._loadedTabs[e]=!0}}set hass(e){this._hass=e,Object.values(this._tabCards).forEach(t=>{t.forEach(i=>{if(i&&"hass"in i)try{i.hass=e}catch(a){}})})}async open(){this._active||(this._active=!0,this._container&&(this._container.dataset.state="expanded"),requestAnimationFrame(()=>{this._updateIndicator()}),this._loadedTabs[this._activeTab]||await this._loadTabCards(this._activeTab))}async close(){this._active&&(this._active=!1,this._container&&(this._container.dataset.state="collapsed"))}static getStyles(){return`
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
        min-width: 72px;
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
        padding: var(--uc-padding, 16px);
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
        display: flex;
        flex-direction: column;
        gap: 16px;
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
    `}destroy(){this._tabBar=null,this._tabContent=null,this._tabCards={},this._loadedTabs={},super.destroy()}};var te=class extends D{constructor(e,t={}){super(e,t),this._currentIndex=0,this._track=null,this._indicators=null,this._autoplayTimer=null,this._touchStartX=0,this._touchCurrentX=0,this._isDragging=!1;let i=e.carousel||{};this._autoplay=i.autoplay||!1,this._interval=i.interval||5e3,this._showIndicators=i.show_indicators!==!1,this._showArrows=i.show_arrows!==!1,this._loop=i.loop!==!1,this._swipeThreshold=50}render(){this._container=document.createElement("div"),this._container.className="carousel-mode",this._container.dataset.state=this._active?"expanded":"collapsed";let e=document.createElement("div");if(e.className="carousel-viewport",this._showArrows){let i=document.createElement("button");i.className="carousel-arrow carousel-arrow-prev",i.innerHTML='<ha-icon icon="mdi:chevron-left"></ha-icon>',i.addEventListener("click",()=>this._goTo(this._currentIndex-1)),e.appendChild(i)}let t=document.createElement("div");if(t.className="carousel-track-wrapper",this._track=document.createElement("div"),this._track.className="carousel-track",t.appendChild(this._track),e.appendChild(t),this._showArrows){let i=document.createElement("button");i.className="carousel-arrow carousel-arrow-next",i.innerHTML='<ha-icon icon="mdi:chevron-right"></ha-icon>',i.addEventListener("click",()=>this._goTo(this._currentIndex+1)),e.appendChild(i)}return this._container.appendChild(e),this._showIndicators&&(this._indicators=this._renderIndicators(),this._container.appendChild(this._indicators)),this._bindTouchEvents(t),this._container}_renderArrows(){let e=document.createDocumentFragment(),t=document.createElement("button");t.className="carousel-arrow carousel-arrow-prev",t.innerHTML='<ha-icon icon="mdi:chevron-left"></ha-icon>',t.addEventListener("click",()=>this._goTo(this._currentIndex-1));let i=document.createElement("button");return i.className="carousel-arrow carousel-arrow-next",i.innerHTML='<ha-icon icon="mdi:chevron-right"></ha-icon>',i.addEventListener("click",()=>this._goTo(this._currentIndex+1)),e.appendChild(t),e.appendChild(i),e}_renderIndicators(){let e=document.createElement("div");return e.className="carousel-indicators",e}_updateIndicators(){!this._indicators||!this._cards.length||(this._indicators.innerHTML=this._cards.map((e,t)=>`
      <button class="carousel-indicator ${t===this._currentIndex?"active":""}"
              data-index="${t}"
              aria-label="Slide ${t+1}">
      </button>
    `).join(""),this._indicators.querySelectorAll(".carousel-indicator").forEach(e=>{e.addEventListener("click",()=>{let t=parseInt(e.dataset.index,10);this._goTo(t)})}))}_goTo(e){let t=this._cards.length;if(t!==0){if(this._loop)e<0&&(e=t-1),e>=t&&(e=0);else if(e<0||e>=t)return;this._currentIndex=e,this._updateTrackPosition(),this._updateIndicatorStates(),this._autoplay&&this._active&&this._startAutoplay()}}next(){this._goTo(this._currentIndex+1)}prev(){this._goTo(this._currentIndex-1)}_updateTrackPosition(){if(!this._track)return;let e=-this._currentIndex*100;this._track.style.transform=`translateX(${e}%)`}_updateIndicatorStates(){this._indicators&&this._indicators.querySelectorAll(".carousel-indicator").forEach((e,t)=>{e.classList.toggle("active",t===this._currentIndex)})}_bindTouchEvents(e){e.addEventListener("touchstart",t=>this._onTouchStart(t),{passive:!0}),e.addEventListener("touchmove",t=>this._onTouchMove(t),{passive:!0}),e.addEventListener("touchend",t=>this._onTouchEnd(t)),e.addEventListener("mousedown",t=>this._onMouseDown(t)),e.addEventListener("mousemove",t=>this._onMouseMove(t)),e.addEventListener("mouseup",t=>this._onMouseUp(t)),e.addEventListener("mouseleave",()=>this._onMouseUp())}_onTouchStart(e){this._isDragging=!0,this._touchStartX=e.touches[0].clientX,this._touchCurrentX=this._touchStartX,this._stopAutoplay()}_onTouchMove(e){if(!this._isDragging)return;this._touchCurrentX=e.touches[0].clientX;let t=this._touchCurrentX-this._touchStartX,i=-this._currentIndex*100,a=t/this._container.offsetWidth*100;this._track&&(this._track.style.transition="none",this._track.style.transform=`translateX(${i+a}%)`)}_onTouchEnd(e){if(!this._isDragging)return;this._isDragging=!1;let t=this._touchCurrentX-this._touchStartX;this._track&&(this._track.style.transition=""),Math.abs(t)>this._swipeThreshold?t>0?this.prev():this.next():this._updateTrackPosition(),this._autoplay&&this._active&&this._startAutoplay()}_onMouseDown(e){e.button===0&&(this._isDragging=!0,this._touchStartX=e.clientX,this._touchCurrentX=this._touchStartX,this._stopAutoplay())}_onMouseMove(e){if(!this._isDragging)return;this._touchCurrentX=e.clientX;let t=this._touchCurrentX-this._touchStartX,i=-this._currentIndex*100,a=t/this._container.offsetWidth*100;this._track&&(this._track.style.transition="none",this._track.style.transform=`translateX(${i+a}%)`)}_onMouseUp(){if(!this._isDragging)return;this._isDragging=!1;let e=this._touchCurrentX-this._touchStartX;this._track&&(this._track.style.transition=""),Math.abs(e)>this._swipeThreshold?e>0?this.prev():this.next():this._updateTrackPosition(),this._autoplay&&this._active&&this._startAutoplay()}_startAutoplay(){this._stopAutoplay(),this._autoplay&&(this._autoplayTimer=setInterval(()=>{this.next()},this._interval))}_stopAutoplay(){this._autoplayTimer&&(clearInterval(this._autoplayTimer),this._autoplayTimer=null)}async open(){var e;this._active||(this._active=!0,this._container&&(this._container.dataset.state="expanded"),this._loaded||(await this.loadCards(((e=this._config.body)==null?void 0:e.cards)||this._config.cards||[]),this._populateSlides()),this._autoplay&&this._startAutoplay())}async close(){this._active&&(this._active=!1,this._container&&(this._container.dataset.state="collapsed"),this._stopAutoplay())}_populateSlides(){if(!this._track)return;let e=document.createDocumentFragment();this._cards.forEach((t,i)=>{this._hass&&(t.hass=this._hass);let a=document.createElement("div");a.className="carousel-slide",a.dataset.index=i,a.appendChild(t),e.appendChild(a)}),this._track.appendChild(e),this._updateIndicators(),this._updateTrackPosition()}static getStyles(){return`
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
    `}destroy(){this._stopAutoplay(),this._track=null,this._indicators=null,super.destroy()}};var oa={expand:le,modal:de,fullscreen:ue,tabs:ee,carousel:te};function et(s,e,t={}){let i=oa[s];return i?new i(e,t):(console.warn(`[UniversalCard] Unknown mode type: ${s}`),null)}function tt(){return[le.getStyles(),de.getStyles(),ue.getStyles(),ee.getStyles(),te.getStyles()].join(`
`)}var na=`
  /* ============================= */
  /* HEADER */
  /* ============================= */
  
  .header {
    display: flex;
    align-items: center;
    padding: var(--uc-padding, 16px);
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
    flex-shrink: 0;
    margin-right: 12px;
  }
  
  .header-left:empty {
    display: none;
    margin-right: 0;
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
    gap: 2px;
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
  
  /* ============================= */
  /* HEADER RIGHT */
  /* ============================= */
  
  .header-right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-left: 12px;
    gap: 8px;
  }
  
  .header-right:empty {
    display: none;
    margin-left: 0;
  }
  
  .header-right-slot {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .header-right-slot:empty {
    display: none;
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
    gap: 4px;
    padding: 3px 8px;
    background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 15%, transparent);
    border-radius: 10px;
    font-size: 11px;
    font-weight: 500;
    color: var(--badge-color, var(--primary-color));
    transition: background 0.2s ease;
  }
  
  .badge:hover {
    background: color-mix(in srgb, var(--badge-color, var(--primary-color)) 25%, transparent);
  }
  
  .badge ha-icon {
    --mdc-icon-size: 12px;
  }
  
  .badge-label {
    font-size: 9px;
    text-transform: uppercase;
    opacity: 0.8;
  }
  
  .badge-value {
    font-weight: 600;
  }
`,sa=`
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
`,Ni=`
  ${na}
  ${sa}
`;var Mi=`
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
  /* GLASS / GLASSMORPHISM THEME */
  /* ============================= */
  .theme-glass,
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
`;var He=class extends HTMLElement{static getConfigElement(){return document.createElement("universal-card-editor")}static getStubConfig(){return{title:"Universal Card",icon:"mdi:card-outline",body_mode:E.EXPAND,body:{cards:[{type:"markdown",content:"Configure this card in the editor"}]}}}constructor(){super(),m("[UC] constructor() called"),this.attachShadow({mode:"open"}),m("[UC] shadowRoot attached"),this._config={},this._hass=null,this._expanded=!1,this._initialized=!1,this._pendingHass=null,this._header=null,this._footer=null,this._badges=null,this._mode=null,this._tabsMode=null,this._carouselMode=null,this._headerCards=[],this._bodyCards=[],this._tabCards={},this._bodyCardsLoaded=!1,this._helpers=null,this._activeTab=0,this._carouselIndex=0,this._isLoading=!1,this._autoCollapseTimer=null,this._carouselTimer=null,this._boundControlHandler=this._handleExternalControl.bind(this),this._resizeHandler=Q(()=>this._handleResize(),M.RESIZE_DEBOUNCE_MS),this._hassUpdateHandler=Ie(()=>this._updateDynamicContent(),M.UPDATE_THROTTLE_MS),this._intersectionObserver=null,this._debug={initTime:0,renderCount:0,lastRenderTime:0}}connectedCallback(){m("[UC] connectedCallback()"),window.addEventListener(ve.CARD_CONTROL,this._boundControlHandler),window.addEventListener("resize",this._resizeHandler),this._setupIntersectionObserver(),this._header&&this._header.attach(),this._footer&&this._footer.attach&&this._footer.attach(),this._mode&&this._mode.attach&&this._mode.attach(),m("[UC] connectedCallback() done")}disconnectedCallback(){m("[UC] disconnectedCallback()"),window.removeEventListener(ve.CARD_CONTROL,this._boundControlHandler),window.removeEventListener("resize",this._resizeHandler),this._header&&this._header.detach(),this._footer&&this._footer.detach&&this._footer.detach(),this._mode&&this._mode.detach&&this._mode.detach(),this._clearAllTimers(),this._destroyIntersectionObserver(),m("[UC] disconnectedCallback() done")}set hass(e){if(this._hass=e,!this._initialized){this._pendingHass=e;return}this._header&&(this._header.hass=e),this._footer&&(this._footer.hass=e),this._badges&&(this._badges.hass=e),this._tabsMode&&(this._tabsMode.hass=e),this._carouselMode&&(this._carouselMode.hass=e),this._updateChildCardsHass(e),this._hassUpdateHandler()}get hass(){return this._hass}setConfig(e){m("[UC] setConfig() called",e);let t=performance.now();try{this._config=xe.normalize(e),m("[UC] config normalized")}catch(i){throw console.error("[UC] config normalize error:",i),i}this._debug.initTime=performance.now()-t,this._initializeCard()}getConfig(){return K(this._config)}async _initializeCard(){m("[UC] _initializeCard() start");try{m("[UC] getting card helpers..."),this._helpers=await Pe(),m("[UC] card helpers loaded"),this._restoreState(),m("[UC] state restored"),this._createHeaderComponent(),m("[UC] header created"),this._config.footer&&(this._createFooterComponent(),m("[UC] footer created")),this._createModeInstance(),m("[UC] mode created:",this._config.body_mode),m("[UC] starting render..."),await this._render(),m("[UC] render done"),this._header&&(m("[UC] loading header cards..."),await this._header.loadCards(),m("[UC] header cards loaded")),this._footer&&(m("[UC] loading footer cards..."),await this._footer.loadCards(),m("[UC] footer cards loaded")),this._config.lazy_load?(this._observeForLazyLoad(),m("[UC] lazy load setup")):this._expanded&&(m("[UC] loading body cards..."),await this._loadBodyCards(),m("[UC] body cards loaded")),this._bindEvents(),m("[UC] events bound"),this._initialized=!0,m("[UC] initialization complete!"),this._pendingHass&&(this.hass=this._pendingHass,this._pendingHass=null)}catch(e){console.error("[UC] Initialization failed:",e),this._renderError(e)}}_createHeaderComponent(){let e={...this._config,...this._config.header,title:this._config.title,subtitle:this._config.subtitle,icon:this._config.icon,entity:this._config.entity,show_state:this._config.show_state,show_expand_icon:this._config.show_expand_icon,expand_icon:this._config.expand_icon,body_mode:this._config.body_mode,sticky_header:this._config.sticky_header,badges:this._config.badges,tap_action:this._config.tap_action,hold_action:this._config.hold_action,double_tap_action:this._config.double_tap_action,context_menu:this._config.context_menu};this._header=new Oe(e),this._hass&&(this._header.hass=this._hass)}_createFooterComponent(){this._footer=new Re(this._config.footer),this._hass&&(this._footer.hass=this._hass)}_createModeInstance(){var t;let e=this._config.body_mode||E.EXPAND;if(e===E.NONE){this._mode=null;return}this._mode=et(e,{...this._config,cards:((t=this._config.body)==null?void 0:t.cards)||[],tabs:this._config.tabs||[]},{hass:this._hass,helpers:this._helpers,shadowRoot:this.shadowRoot,card:this}),this._mode&&this._hass&&(this._mode.hass=this._hass)}_restoreState(){if(this._config.remember_state&&this._config.card_id)try{let e=`uc-state-${this._config.card_id}`,t=localStorage.getItem(e);t!==null?this._expanded=JSON.parse(t):this._expanded=this._config.expanded}catch(e){this._expanded=this._config.expanded}else this._expanded=this._config.expanded}_saveState(){if(this._config.remember_state&&this._config.card_id)try{let e=`uc-state-${this._config.card_id}`;localStorage.setItem(e,JSON.stringify(this._expanded))}catch(e){}}async _render(){let e=performance.now(),t=this._generateStyles(),i=["universal-card"];this._config.theme&&this._config.theme!=="default"&&i.push(`theme-${this._config.theme}`);let a=document.createElement("div");if(a.className=i.join(" "),a.dataset.cardId=this._config.card_id,this._header){this._header.expanded=this._expanded;let o=this._header.render();a.appendChild(o)}let r=this._renderBodyElement();if(r&&a.appendChild(r),this._footer){let o=this._footer.render();a.appendChild(o)}this.shadowRoot.innerHTML=`<style>${t}</style>`,this.shadowRoot.appendChild(a),this._debug.renderCount++,this._debug.lastRenderTime=performance.now()-e}_renderBodyElement(){let e=this._config,t=e.body_mode||"expand";if(t==="none"||t==="modal"||t==="fullscreen")return null;let i=document.createElement("div");i.className="body",i.dataset.state=this._expanded?"expanded":"collapsed",i.dataset.mode=t,i.dataset.expandAnimation=e.expand_animation||"slide",i.dataset.collapseAnimation=e.collapse_animation||"slide",i.dataset.cardsAnimation=e.cards_animation||"fadeUp",i.dataset.cardsDirection=e.cards_direction||"sequential";let a=e.animation_duration||300,r=e.cards_stagger||50;if(i.style.setProperty("--expand-duration",`${a}ms`),i.style.setProperty("--cards-stagger",`${r}ms`),t==="tabs"){this._tabsMode=new ee(e),this._hass&&(this._tabsMode.hass=this._hass);let c=this._tabsMode.render();return i.appendChild(c),i}if(t==="carousel"){this._carouselMode=new te(e),this._hass&&(this._carouselMode.hass=this._hass);let c=this._carouselMode.render();return i.appendChild(c),i}let o=document.createElement("div");o.className="body-content";let n=this._getGridStyles();return n&&(o.style.cssText=n),!this._bodyCardsLoaded&&this._expanded&&(o.innerHTML=this._renderSkeleton()),i.appendChild(o),i}_renderSkeleton(){let e=this._config.skeleton_count||T.skeleton_count;return`<div class="skeleton-container">${Array(e).fill(0).map(()=>`
      <div class="skeleton-card">
        <div class="skeleton-line title"></div>
        <div class="skeleton-line text"></div>
        <div class="skeleton-line text short"></div>
      </div>
    `).join("")}</div>`}_renderError(e){this.shadowRoot.innerHTML=`
      <style>
        .error-card {
          padding: 16px;
          background: var(--error-color, #f44336);
          color: white;
          border-radius: var(--ha-card-border-radius, 12px);
        }
        .error-message { font-weight: 500; }
        .error-details { margin-top: 8px; font-size: 12px; opacity: 0.9; }
      </style>
      <div class="error-card">
        <div class="error-message">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          Universal Card Error
        </div>
        <div class="error-details">${e.message}</div>
      </div>
    `}async _loadBodyCards(){var e,t;if(!(this._bodyCardsLoaded||this._isLoading)){this._isLoading=!0;try{let i=this._config.body_mode||"expand";if(i==="tabs"||i==="carousel"){this._bodyCardsLoaded=!0;return}let a=((e=this._config.body)==null?void 0:e.cards)||[];if(a.length===0){this._bodyCardsLoaded=!0;return}if(this._bodyCards=await ce(a),this._bodyCards.forEach(p=>{this._hass&&(p.hass=this._hass)}),i==="modal"||i==="fullscreen"){this._bodyCardsLoaded=!0;return}let r=this.shadowRoot.querySelector(".body-content");if(!r)return;let o=r.querySelector(".skeleton-container");o&&(o.classList.add("fade-out"),await new Promise(p=>setTimeout(p,200)),o.remove());let n=document.createDocumentFragment(),c=this._config.cards_direction||"sequential",l=((t=this._config.grid)==null?void 0:t.columns)||1,d=this._bodyCards.length,u=this._calculateAnimationIndices(d,c,l);this._bodyCards.forEach((p,h)=>{let g=document.createElement("div");g.className="card-wrapper";let b=u[h];g.style.setProperty("--card-index",b);let y=a[h];if(y){let I=y.colspan||y.card_options&&y.card_options.colspan,B=y.rowspan||y.card_options&&y.card_options.rowspan;I&&(g.style.gridColumn="span "+I),B&&(g.style.gridRow="span "+B)}g.appendChild(p),n.appendChild(g)}),r.appendChild(n),this._bodyCardsLoaded=!0}finally{this._isLoading=!1}}}_updateChildCardsHass(e){[...this._headerCards,...this._bodyCards,...Object.values(this._tabCards).flat()].forEach(i=>{if(i&&"hass"in i)try{i.hass=e}catch(a){}})}_destroyChildCards(){this._header&&(this._header.destroy(),this._header=null),this._footer&&(this._footer.destroy(),this._footer=null),this._badges&&(this._badges.destroy(),this._badges=null),this._headerCards=[],this._bodyCards=[],this._tabCards={},this._bodyCardsLoaded=!1}_generateStyles(){return`
      /* ============================= */
      /* HOST */
      /* ============================= */
      
      :host {
        display: block;
        --uc-transition-duration: ${this._config.animation_duration}ms;
        --uc-border-radius: ${this._config.border_radius};
        --uc-padding: ${this._config.padding};
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
      
      ${Ni}
      
      /* ============================= */
      /* THEMES */
      /* ============================= */
      
      ${Mi}
      
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
      
      ${tt()}
    `}_getGridStyles(){let e=this._config.grid||{},t=e.columns||T.grid_columns,i=e.gap||T.grid_gap;return t<=1?"":`
      display: grid;
      grid-template-columns: repeat(${t}, 1fr);
      gap: ${i};
    `.replace(/\s+/g," ").trim()}_calculateAnimationIndices(e,t,i){let a=[],r=typeof i=="number"?i:1,o=Math.ceil(e/r);switch(t){case"reverse":for(let p=0;p<e;p++)a.push(e-1-p);break;case"center-out":let n=Math.floor(e/2);for(let p=0;p<e;p++)a.push(Math.abs(p-n));break;case"edges-in":let c=Math.floor(e/2);for(let p=0;p<e;p++){let h=Math.abs(p-c);a.push(c-h)}break;case"diagonal":for(let p=0;p<e;p++){let h=Math.floor(p/r),g=p%r;a.push(h+g)}break;case"wave":for(let p=0;p<e;p++){let h=Math.floor(p/r),g=p%r,b=h%2===0?g:r-1-g;a.push(h*2+b)}break;case"random":let l=Array.from({length:e},(p,h)=>h),u=e*7+r*13;for(let p=l.length-1;p>0;p--){u=u*1103515245+12345&2147483647;let h=u%(p+1);[l[p],l[h]]=[l[h],l[p]]}for(let p=0;p<e;p++)a.push(l.indexOf(p));break;case"sequential":default:for(let p=0;p<e;p++)a.push(p);break}return a}_bindEvents(){let e=this.shadowRoot.querySelector(".header");e&&(m("[UC] binding header events"),e.addEventListener("uc-toggle",()=>{m("[UC] uc-toggle received!"),this._toggle()}),e.addEventListener("uc-expand",()=>{m("[UC] uc-expand received!"),this._expand()}),e.addEventListener("uc-collapse",()=>{m("[UC] uc-collapse received!"),this._collapse()}),e.addEventListener("uc-context-menu",t=>this._handleContextMenu(t)))}_handleContextMenu(e){console.debug("[UniversalCard] Context menu:",e.detail)}_handleExternalControl(e){let{card_id:t,action:i}=e.detail||{};if(!(t&&t!==this._config.card_id))switch(i){case"expand":this._expand();break;case"collapse":this._collapse();break;case"toggle":this._toggle();break}}_handleResize(){this._updateDynamicContent()}_toggle(){this._expanded?this._collapse():this._expand()}async _expand(){if(this._expanded)return;this._expanded=!0,this._saveState(),this._bodyCardsLoaded||await this._loadBodyCards();let e=this._config.body_mode||"expand";if(e==="modal")this._showModal();else if(e==="fullscreen")this._showFullscreen();else if(e==="tabs"&&this._tabsMode)this._updateExpandedUI(),await this._tabsMode.open();else if(e==="carousel"&&this._carouselMode)this._updateExpandedUI(),await this._carouselMode.open();else{let t=this.shadowRoot.querySelector(".body");t&&(t.classList.remove("collapsing"),t.classList.add("expanding")),this._updateExpandedUI();let i=this._config.animation_duration||300;setTimeout(()=>{t&&t.classList.remove("expanding")},i+50)}_(this,ve.CARD_EXPANDED,{card_id:this._config.card_id}),this._setupAutoCollapse()}_collapse(){if(!this._expanded)return;this._expanded=!1,this._saveState(),this._clearAutoCollapseTimer();let e=this._config.body_mode||"expand";if(e==="modal")this._hideModal();else if(e==="fullscreen")this._hideFullscreen();else if(e==="tabs"&&this._tabsMode)this._updateExpandedUI(),this._tabsMode.close();else if(e==="carousel"&&this._carouselMode)this._updateExpandedUI(),this._carouselMode.close();else{let t=this.shadowRoot.querySelector(".body");t&&(t.classList.remove("expanding"),t.classList.add("collapsing")),this._updateExpandedUI();let i=this._config.animation_duration||300;setTimeout(()=>{t&&t.classList.remove("collapsing")},i+50)}_(this,ve.CARD_COLLAPSED,{card_id:this._config.card_id})}_showModal(){this._hideModal();let e=document.createElement("div");e.className="uc-modal-overlay",e.innerHTML=`
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
          <div class="uc-modal-title">${this._config.title||"Modal"}</div>
          <button class="uc-modal-close">\u2715</button>
        </div>
        <div class="uc-modal-cards"></div>
      </div>
    `;let t=e.querySelector(".uc-modal-cards");this._bodyCards.forEach(i=>{this._hass&&(i.hass=this._hass),t.appendChild(i)}),e.querySelector(".uc-modal-close").addEventListener("click",()=>this._collapse()),e.addEventListener("click",i=>{i.target===e&&this._collapse()}),this._modalEscHandler=i=>{i.key==="Escape"&&this._collapse()},document.addEventListener("keydown",this._modalEscHandler),document.body.appendChild(e),this._modalOverlay=e}_hideModal(){this._modalOverlay&&(this._modalOverlay.remove(),this._modalOverlay=null),this._modalEscHandler&&(document.removeEventListener("keydown",this._modalEscHandler),this._modalEscHandler=null)}_showFullscreen(){this._hideFullscreen();let e=document.createElement("div");e.className="uc-fullscreen-overlay",e.innerHTML=`
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
        <div class="uc-fullscreen-title">${this._config.title||"Fullscreen"}</div>
        <button class="uc-fullscreen-close">\u2715 \u0417\u0430\u043A\u0440\u044B\u0442\u044C</button>
      </div>
      <div class="uc-fullscreen-content"></div>
    `;let t=e.querySelector(".uc-fullscreen-content");this._bodyCards.forEach(i=>{this._hass&&(i.hass=this._hass),t.appendChild(i)}),e.querySelector(".uc-fullscreen-close").addEventListener("click",()=>{this._collapse()}),this._fsEscHandler=i=>{i.key==="Escape"&&this._collapse()},document.addEventListener("keydown",this._fsEscHandler),document.body.appendChild(e),this._fullscreenOverlay=e}_hideFullscreen(){this._fullscreenOverlay&&(this._fullscreenOverlay.remove(),this._fullscreenOverlay=null),this._fsEscHandler&&(document.removeEventListener("keydown",this._fsEscHandler),this._fsEscHandler=null)}_updateExpandedUI(){this._header&&(this._header.expanded=this._expanded);let e=this._config.body_mode||"expand";if(e==="modal"||e==="fullscreen")return;let t=this.shadowRoot.querySelector(".body");t&&(t.dataset.state=this._expanded?"expanded":"collapsed")}_setupIntersectionObserver(){this._config.lazy_load&&(this._intersectionObserver=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&this._expanded&&!this._bodyCardsLoaded&&this._loadBodyCards()})},{rootMargin:M.INTERSECTION_MARGIN}))}_observeForLazyLoad(){this._intersectionObserver&&this._intersectionObserver.observe(this)}_destroyIntersectionObserver(){this._intersectionObserver&&(this._intersectionObserver.disconnect(),this._intersectionObserver=null)}_setupAutoCollapse(){let e=this._config.auto_collapse_after;!e||e<=0||(this._clearAutoCollapseTimer(),this._autoCollapseTimer=setTimeout(()=>{this._collapse()},e*1e3))}_clearAutoCollapseTimer(){this._autoCollapseTimer&&(clearTimeout(this._autoCollapseTimer),this._autoCollapseTimer=null)}_clearAllTimers(){this._clearAutoCollapseTimer(),this._carouselTimer&&(clearInterval(this._carouselTimer),this._carouselTimer=null)}_updateDynamicContent(){}getCardSize(){return this._expanded?3:1}};var j={BASIC:"basic",HEADER:"header",BODY:"body",STYLE:"style",FEATURES:"features",ADVANCED:"advanced"},ca=[{id:j.BASIC,icon:"mdi:cog",label:"\u041E\u0441\u043D\u043E\u0432\u043D\u044B\u0435"},{id:j.HEADER,icon:"mdi:page-layout-header",label:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A"},{id:j.BODY,icon:"mdi:card-text-outline",label:"\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435"},{id:j.STYLE,icon:"mdi:palette",label:"\u0421\u0442\u0438\u043B\u044C"},{id:j.FEATURES,icon:"mdi:tune",label:"\u0424\u0443\u043D\u043A\u0446\u0438\u0438"},{id:j.ADVANCED,icon:"mdi:code-tags",label:"\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435"}],Fe=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._config={},this._hass=null,this._activeSection=j.BASIC,this._history=[],this._historyIndex=-1,this._editingCardIndex=null,this._editingCardSection=null,this._showSubEditor=!1,this._subEditor=null}set hass(e){let t=!this._hass;this._hass=e,this._subEditor&&(this._subEditor.hass=e),t&&this._render()}setConfig(e){let t=JSON.stringify(e);if(this._lastConfigStr!==t){this._lastConfigStr=t;try{this._config=JSON.parse(t)}catch(i){this._config=K(e)}this._pushHistory(this._config),this._render()}}_render(){let e=this._saveFocusState();this.shadowRoot.innerHTML=`
      <style>${this._getStyles()}</style>
      <div class="editor">
        ${this._renderToolbar()}
        ${this._renderTabBar()}
        <div class="editor-content">
          ${this._showSubEditor?this._renderSubEditorContainer():this._renderSection(this._activeSection)}
        </div>
      </div>
    `,this._bindEvents(),this._showSubEditor&&this._initSubEditor(),this._restoreFocusState(e)}_saveFocusState(){let e=this.shadowRoot.activeElement;return!e||!e.matches("input, textarea, select")?null:{id:e.id,name:e.name,tagName:e.tagName,selectionStart:e.selectionStart,selectionEnd:e.selectionEnd,value:e.value}}_restoreFocusState(e){e&&requestAnimationFrame(()=>{let t=null;if(e.id&&(t=this.shadowRoot.getElementById(e.id)),!t&&e.name&&(t=this.shadowRoot.querySelector(`[name="${e.name}"]`)),t&&(t.focus(),typeof e.selectionStart=="number"&&t.setSelectionRange))try{t.setSelectionRange(e.selectionStart,e.selectionEnd)}catch(i){}})}_renderToolbar(){let e=this._historyIndex>0,t=this._historyIndex<this._history.length-1;return`
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
        ${ca.map(e=>`
          <button class="tab-item ${this._activeSection===e.id?"active":""}" 
                  data-section="${e.id}"
                  title="${e.label}">
            <ha-icon icon="${e.icon}"></ha-icon>
            <span class="tab-label">${e.label}</span>
          </button>
        `).join("")}
      </div>
    `}_renderSection(e){switch(e){case j.BASIC:return this._renderBasicSection();case j.HEADER:return this._renderHeaderSection();case j.BODY:return this._renderBodySection();case j.STYLE:return this._renderStyleSection();case j.FEATURES:return this._renderFeaturesSection();case j.ADVANCED:return this._renderAdvancedSection();default:return""}}_renderBasicSection(){let e=this._config.expand_trigger||"tap",t=this._getTriggerInfo(e);return`
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
        
        <div class="field">
          <label for="title">\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A</label>
          <input type="text" 
                 id="title" 
                 name="title"
                 value="${this._escapeHtml(this._config.title||"")}" 
                 placeholder="\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438">
        </div>
        
        <div class="field">
          <label for="subtitle">\u041F\u043E\u0434\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A</label>
          <input type="text" 
                 id="subtitle" 
                 name="subtitle"
                 value="${this._escapeHtml(this._config.subtitle||"")}" 
                 placeholder="\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442">
        </div>
        
        <div class="field">
          <label for="icon">\u0418\u043A\u043E\u043D\u043A\u0430</label>
          <div class="icon-picker-wrapper">
            <input type="text" 
                   id="icon" 
                   name="icon"
                   value="${this._escapeHtml(this._config.icon||"")}" 
                   placeholder="mdi:home">
            ${this._config.icon?`<ha-icon icon="${this._config.icon}" class="icon-preview"></ha-icon>`:""}
          </div>
        </div>
        
        <div class="field">
          <label for="entity">Entity (\u043E\u043F\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u043E)</label>
          <input type="text" 
                 id="entity" 
                 name="entity"
                 value="${this._escapeHtml(this._config.entity||"")}" 
                 placeholder="light.room"
                 list="entities-list">
          <datalist id="entities-list">
            ${this._hass?Object.keys(this._hass.states).slice(0,100).map(i=>`<option value="${i}">`).join(""):""}
          </datalist>
        </div>
        
        <div class="field">
          <label for="body_mode">\u0420\u0435\u0436\u0438\u043C body</label>
          <select id="body_mode" name="body_mode">
            ${Le.map(i=>`
              <option value="${i}" ${this._config.body_mode===i?"selected":""}>
                ${this._getModeLabel(i)}
              </option>
            `).join("")}
          </select>
        </div>
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="expanded" 
                 name="expanded"
                 ${this._config.expanded?"checked":""}>
          <label for="expanded">\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0430 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E</label>
        </div>
      </div>
    `}_getTriggerInfo(e){let t={tap:{icon:"mdi:gesture-tap",tooltip:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u043E \u043A\u043B\u0438\u043A\u0443",hint:"\u041A\u043B\u0438\u043A \u0434\u043B\u044F \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F"},hold:{icon:"mdi:gesture-tap-hold",tooltip:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u043E \u0443\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u044E",hint:"\u0423\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 \u0434\u043B\u044F \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F"},double_tap:{icon:"mdi:gesture-double-tap",tooltip:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u043E \u0434\u0432\u043E\u0439\u043D\u043E\u043C\u0443 \u043A\u043B\u0438\u043A\u0443",hint:"\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u043A\u043B\u0438\u043A \u0434\u043B\u044F \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F"},none:{icon:"mdi:lock-outline",tooltip:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",hint:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u0447\u0435\u0440\u0435\u0437 actions"}};return t[e]||t.tap}_renderHeaderSection(){var e;return`
      <div class="section">
        <h3>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430</h3>
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="show_expand_icon" 
                 name="show_expand_icon"
                 ${this._config.show_expand_icon!==!1?"checked":""}>
          <label for="show_expand_icon">\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0438\u043A\u043E\u043D\u043A\u0443 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F</label>
        </div>
        
        <div class="field">
          <label for="expand_icon">\u0418\u043A\u043E\u043D\u043A\u0430 \u0440\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u044F</label>
          <input type="text" 
                 id="expand_icon" 
                 name="expand_icon"
                 value="${this._escapeHtml(this._config.expand_icon||T.expand_icon)}" 
                 placeholder="mdi:chevron-down">
        </div>
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="sticky_header" 
                 name="sticky_header"
                 ${this._config.sticky_header?"checked":""}>
          <label for="sticky_header">\u0424\u0438\u043A\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043F\u0440\u0438 \u0441\u043A\u0440\u043E\u043B\u043B\u0435</label>
        </div>
        
        <div class="subsection">
          <h4>\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0435</h4>
          <p class="hint">\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0432 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0435</p>
          
          <div class="cards-list" id="header-cards">
            ${this._renderCardsList(((e=this._config.header)==null?void 0:e.cards)||[],"header")}
          </div>
          
          <button class="btn btn-add" data-action="add-header-card">
            <ha-icon icon="mdi:plus"></ha-icon>
            \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443
          </button>
        </div>
      </div>
    `}_renderBodySection(){var e,t,i;return`
      <div class="section">
        <h3>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E</h3>
        
        <div class="subsection">
          <h4>Grid Layout</h4>
          
          <div class="field-row">
            <div class="field">
              <label for="grid_columns">\u041A\u043E\u043B\u043E\u043D\u043A\u0438</label>
              <input type="number" 
                     id="grid_columns" 
                     name="grid.columns"
                     value="${((e=this._config.grid)==null?void 0:e.columns)||T.grid_columns}" 
                     min="1" 
                     max="12">
            </div>
            
            <div class="field">
              <label for="grid_gap">\u041E\u0442\u0441\u0442\u0443\u043F\u044B</label>
              <input type="text" 
                     id="grid_gap" 
                     name="grid.gap"
                     value="${this._escapeHtml(((t=this._config.grid)==null?void 0:t.gap)||T.grid_gap)}" 
                     placeholder="16px">
            </div>
          </div>
        </div>
        
        <div class="subsection">
          <h4>\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432 body</h4>
          
          <div class="cards-list" id="body-cards">
            ${this._renderCardsList(((i=this._config.body)==null?void 0:i.cards)||[],"body")}
          </div>
          
          <button class="btn btn-add" data-action="add-body-card">
            <ha-icon icon="mdi:plus"></ha-icon>
            \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443
          </button>
        </div>
        
        ${this._config.body_mode===E.TABS?this._renderTabsEditor():""}
        ${this._config.body_mode===E.CAROUSEL?this._renderCarouselEditor():""}
      </div>
    `}_renderStyleSection(){return`
      <div class="section">
        <h3>\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u0441\u0442\u0438\u043B\u044F</h3>
        
        <div class="field">
          <label for="theme">\u0422\u0435\u043C\u0430</label>
          <select id="theme" name="theme">
            ${Object.values(f).map(t=>`
              <option value="${t}" ${this._config.theme===t?"selected":""}>
                ${this._getThemeLabel(t)}
              </option>
            `).join("")}
          </select>
        </div>
        
        <div class="theme-preview" style="${this._getThemePreviewStyle()}">
          <div class="preview-header">Preview</div>
          <div class="preview-body">\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435</div>
        </div>
        
        <div class="field">
          <label for="border_radius">\u0421\u043A\u0440\u0443\u0433\u043B\u0435\u043D\u0438\u0435 \u0443\u0433\u043B\u043E\u0432</label>
          <input type="text" 
                 id="border_radius" 
                 name="border_radius"
                 value="${this._escapeHtml(this._config.border_radius||T.border_radius)}" 
                 placeholder="12px">
        </div>
        
        <div class="field">
          <label for="padding">\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0438\u0435 \u043E\u0442\u0441\u0442\u0443\u043F\u044B</label>
          <input type="text" 
                 id="padding" 
                 name="padding"
                 value="${this._escapeHtml(this._config.padding||T.padding)}" 
                 placeholder="16px">
        </div>
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="animation" 
                 name="animation"
                 ${this._config.animation!==!1?"checked":""}>
          <label for="animation">\u0410\u043D\u0438\u043C\u0430\u0446\u0438\u0438</label>
        </div>
        
        <div class="field">
          <label for="animation_duration">\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u0438 (\u043C\u0441)</label>
          <input type="number" 
                 id="animation_duration" 
                 name="animation_duration"
                 value="${this._config.animation_duration||T.animation_duration}" 
                 min="0" 
                 max="2000">
        </div>
      </div>
    `}_renderFeaturesSection(){return`
      <div class="section features-section">
        <h3>\u0424\u0443\u043D\u043A\u0446\u0438\u0438</h3>
        
        <!-- \u0411\u0430\u0437\u043E\u0432\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 -->
        <div class="feature-group">
          <div class="feature-group-header">
            <ha-icon icon="mdi:cog"></ha-icon>
            <span>\u0411\u0430\u0437\u043E\u0432\u044B\u0435</span>
          </div>
          
          <div class="field checkbox-field">
            <input type="checkbox" 
                   id="lazy_load" 
                   name="lazy_load"
                   ${this._config.lazy_load!==!1?"checked":""}>
            <label for="lazy_load">\u041B\u0435\u043D\u0438\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 (lazy loading)</label>
          </div>
          
          <div class="field checkbox-field">
            <input type="checkbox" 
                   id="remember_state" 
                   name="remember_state"
                   ${this._config.remember_state?"checked":""}>
            <label for="remember_state">\u0417\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435</label>
          </div>
          
          <div class="field">
            <label for="auto_collapse_after">\u0410\u0432\u0442\u043E-\u0441\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435 (\u0441\u0435\u043A, 0 - \u043E\u0442\u043A\u043B.)</label>
            <input type="number" 
                   id="auto_collapse_after" 
                   name="auto_collapse_after"
                   value="${this._config.auto_collapse_after||0}" 
                   min="0" max="3600">
          </div>
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
    `}_renderVisibilityConditionsUI(){let e=this._config.visibility||[],t=[{value:"state",label:"\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 entity",icon:"mdi:toggle-switch"},{value:"numeric_state",label:"\u0427\u0438\u0441\u043B\u043E\u0432\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",icon:"mdi:numeric"},{value:"user",label:"\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",icon:"mdi:account"},{value:"time",label:"\u0412\u0440\u0435\u043C\u044F",icon:"mdi:clock-outline"},{value:"screen",label:"\u0420\u0430\u0437\u043C\u0435\u0440 \u044D\u043A\u0440\u0430\u043D\u0430",icon:"mdi:monitor"}];return`
      <div class="feature-group collapsible ${e.length>0?"has-content":""}" data-feature="visibility">
        <div class="feature-group-header" data-toggle="visibility">
          <ha-icon icon="mdi:eye-settings"></ha-icon>
          <span>\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u0438</span>
          <span class="feature-badge">${e.length||""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="visibility-content">
          <p class="feature-hint">\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0432\u0441\u0435 \u0443\u0441\u043B\u043E\u0432\u0438\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u044B</p>
          
          <div class="conditions-list" id="visibility-list">
            ${e.map((i,a)=>this._renderConditionItem(i,a)).join("")}
          </div>
          
          <div class="add-condition-row">
            <select id="new-condition-type" class="condition-type-select">
              <option value="">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043F \u0443\u0441\u043B\u043E\u0432\u0438\u044F...</option>
              ${t.map(i=>`<option value="${i.value}">${i.label}</option>`).join("")}
            </select>
            <button class="btn btn-small btn-add" data-action="add-visibility-condition">
              <ha-icon icon="mdi:plus"></ha-icon>
            </button>
          </div>
        </div>
      </div>
    `}_renderConditionItem(e,t){var r,o,n,c;let i=e.condition||"state",a="";switch(i){case"state":a=`
          <input type="text" placeholder="entity_id" value="${this._escapeHtml(e.entity||"")}" 
                 data-field="entity" class="cond-field">
          <select data-field="operator" class="cond-operator">
            <option value="eq" ${e.state_not?"":"selected"}>\u0440\u0430\u0432\u043D\u043E</option>
            <option value="neq" ${e.state_not?"selected":""}>\u043D\u0435 \u0440\u0430\u0432\u043D\u043E</option>
          </select>
          <input type="text" placeholder="on, off, ..." value="${this._escapeHtml(e.state||e.state_not||"")}" 
                 data-field="state" class="cond-field">
        `;break;case"numeric_state":a=`
          <input type="text" placeholder="entity_id" value="${this._escapeHtml(e.entity||"")}" 
                 data-field="entity" class="cond-field">
          <input type="number" placeholder="\u0432\u044B\u0448\u0435" value="${(r=e.above)!=null?r:""}" 
                 data-field="above" class="cond-field cond-small">
          <input type="number" placeholder="\u043D\u0438\u0436\u0435" value="${(o=e.below)!=null?o:""}" 
                 data-field="below" class="cond-field cond-small">
        `;break;case"user":a=`
          <input type="text" placeholder="\u0438\u043C\u0435\u043D\u0430 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E" value="${(e.users||[]).join(", ")}" 
                 data-field="users" class="cond-field">
          <label class="cond-checkbox">
            <input type="checkbox" data-field="is_admin" ${e.is_admin?"checked":""}>
            \u0422\u043E\u043B\u044C\u043A\u043E \u0430\u0434\u043C\u0438\u043D
          </label>
        `;break;case"time":a=`
          <input type="time" placeholder="\u043F\u043E\u0441\u043B\u0435" value="${e.after||""}" 
                 data-field="after" class="cond-field cond-small">
          <span>\u2014</span>
          <input type="time" placeholder="\u0434\u043E" value="${e.before||""}" 
                 data-field="before" class="cond-field cond-small">
          <select data-field="weekday" multiple class="cond-weekday" title="\u0414\u043D\u0438 \u043D\u0435\u0434\u0435\u043B\u0438">
            <option value="mon" ${(e.weekday||[]).includes("mon")?"selected":""}>\u041F\u043D</option>
            <option value="tue" ${(e.weekday||[]).includes("tue")?"selected":""}>\u0412\u0442</option>
            <option value="wed" ${(e.weekday||[]).includes("wed")?"selected":""}>\u0421\u0440</option>
            <option value="thu" ${(e.weekday||[]).includes("thu")?"selected":""}>\u0427\u0442</option>
            <option value="fri" ${(e.weekday||[]).includes("fri")?"selected":""}>\u041F\u0442</option>
            <option value="sat" ${(e.weekday||[]).includes("sat")?"selected":""}>\u0421\u0431</option>
            <option value="sun" ${(e.weekday||[]).includes("sun")?"selected":""}>\u0412\u0441</option>
          </select>
        `;break;case"screen":a=`
          <input type="number" placeholder="min width" value="${(n=e.min_width)!=null?n:""}" 
                 data-field="min_width" class="cond-field cond-small">
          <span>\u2014</span>
          <input type="number" placeholder="max width" value="${(c=e.max_width)!=null?c:""}" 
                 data-field="max_width" class="cond-field cond-small">
          <span>px</span>
        `;break}return`
      <div class="condition-item" data-index="${t}" data-type="${i}">
        <div class="condition-type-badge">${i}</div>
        <div class="condition-fields">${a}</div>
        <button class="btn-icon btn-delete" data-action="delete-condition" data-index="${t}">
          <ha-icon icon="mdi:delete"></ha-icon>
        </button>
      </div>
    `}_renderStateStylesUI(){let e=this._config.state_styles&&Object.keys(this._config.state_styles).length>0,t=this._config.state_styles_entity||"",i=this._config.state_styles||{};return`
      <div class="feature-group collapsible ${e?"has-content":""}" data-feature="state_styles">
        <div class="feature-group-header" data-toggle="state_styles">
          <ha-icon icon="mdi:palette-swatch"></ha-icon>
          <span>\u0421\u0442\u0438\u043B\u0438 \u043F\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044E</span>
          <span class="feature-badge">${e?"\u2713":""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="state-styles-content">
          <p class="feature-hint">\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0432\u043D\u0435\u0448\u043D\u0435\u0433\u043E \u0432\u0438\u0434\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0432 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F entity</p>
          
          <div class="field">
            <label>Entity \u0434\u043B\u044F \u043E\u0442\u0441\u043B\u0435\u0436\u0438\u0432\u0430\u043D\u0438\u044F</label>
            <input type="text" id="state_styles_entity" 
                   value="${this._escapeHtml(t)}" 
                   placeholder="sensor.temperature"
                   list="entities-list">
          </div>
          
          <div class="state-styles-list" id="state-styles-list">
            ${Object.entries(i).map(([a,r],o)=>`
              <div class="state-style-item" data-state="${this._escapeHtml(a)}">
                <input type="text" value="${this._escapeHtml(a)}" placeholder="on, off, >20, ..." 
                       class="state-key" data-index="${o}">
                <input type="text" value="${r.background||""}" placeholder="background" 
                       class="style-field" data-style="background">
                <input type="text" value="${r.color||""}" placeholder="color" 
                       class="style-field" data-style="color">
                <input type="text" value="${r.border||""}" placeholder="border" 
                       class="style-field" data-style="border">
                <button class="btn-icon btn-delete" data-action="delete-state-style" data-state="${this._escapeHtml(a)}">
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
    `}_renderActionsUI(){let e=this._config.expand_trigger||"tap",t=this._config.tap_action||{},i=this._config.hold_action||{},a=this._config.double_tap_action||{},r=t.action||i.action||a.action||e!=="tap",o=[{value:"none",label:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F"},{value:"more-info",label:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E"},{value:"toggle",label:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C entity"},{value:"call-service",label:"\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441"},{value:"navigate",label:"\u041F\u0435\u0440\u0435\u0439\u0442\u0438"},{value:"url",label:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL"}];return`
      <div class="feature-group collapsible ${r?"has-content":""}" data-feature="actions">
        <div class="feature-group-header" data-toggle="actions">
          <ha-icon icon="mdi:gesture-tap"></ha-icon>
          <span>\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F</span>
          <span class="feature-badge">${r?"\u2713":""}</span>
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
              ${[{value:"tap",label:"\u041A\u043B\u0438\u043A (tap)",icon:"mdi:gesture-tap"},{value:"hold",label:"\u0423\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u0435 (hold)",icon:"mdi:gesture-tap-hold"},{value:"double_tap",label:"\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u043A\u043B\u0438\u043A",icon:"mdi:gesture-double-tap"},{value:"none",label:"\u041E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E",icon:"mdi:close-circle-outline"}].map(c=>`
                <button class="expand-trigger-btn ${e===c.value?"active":""}" 
                        data-trigger="${c.value}">
                  <ha-icon icon="${c.icon}"></ha-icon>
                  <span>${c.label}</span>
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
            ${this._renderActionRow("double_tap_action","\u0414\u0432\u043E\u0439\u043D\u043E\u0439 \u043A\u043B\u0438\u043A",a,o,e==="double_tap")}
          </div>
        </div>
      </div>
    `}_renderActionRow(e,t,i,a,r=!1){let o=i.action||"none";if(r)return`
        <div class="action-row disabled" data-action-key="${e}">
          <label>${t}</label>
          <div class="action-expand-badge">
            <ha-icon icon="mdi:arrow-expand-vertical"></ha-icon>
            <span>\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</span>
          </div>
        </div>
      `;let n="";return o==="call-service"?n=`
        <input type="text" placeholder="service" value="${this._escapeHtml(i.service||"")}" 
               data-action-key="${e}" data-field="service" class="action-extra-field">
      `:o==="navigate"?n=`
        <input type="text" placeholder="/lovelace/view" value="${this._escapeHtml(i.navigation_path||"")}" 
               data-action-key="${e}" data-field="navigation_path" class="action-extra-field">
      `:o==="url"&&(n=`
        <input type="text" placeholder="https://..." value="${this._escapeHtml(i.url_path||"")}" 
               data-action-key="${e}" data-field="url_path" class="action-extra-field">
      `),`
      <div class="action-row" data-action-key="${e}">
        <label>${t}</label>
        <select class="action-type-select" data-action-key="${e}">
          ${a.map(c=>`<option value="${c.value}" ${o===c.value?"selected":""}>${c.label}</option>`).join("")}
        </select>
        ${n}
      </div>
    `}_renderSwipeGesturesUI(){var i,a,r,o,n,c,l,d;let e=this._config.swipe||{},t=e.enabled||e.swipe_left||e.swipe_right;return`
      <div class="feature-group collapsible ${t?"has-content":""}" data-feature="swipe">
        <div class="feature-group-header" data-toggle="swipe">
          <ha-icon icon="mdi:gesture-swipe-horizontal"></ha-icon>
          <span>\u0416\u0435\u0441\u0442\u044B \u0441\u0432\u0430\u0439\u043F\u0430</span>
          <span class="feature-badge">${t?"\u2713":""}</span>
          <ha-icon icon="mdi:chevron-down" class="collapse-icon"></ha-icon>
        </div>
        
        <div class="feature-group-content" id="swipe-content">
          <p class="feature-hint">\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043F\u0440\u0438 \u0441\u0432\u0430\u0439\u043F\u0435 \u043F\u043E \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0435</p>
          
          <div class="field checkbox-field">
            <input type="checkbox" id="swipe_enabled" 
                   ${e.enabled?"checked":""}>
            <label for="swipe_enabled">\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0436\u0435\u0441\u0442\u044B</label>
          </div>
          
          <div class="field">
            <label>\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435</label>
            <select id="swipe_direction">
              <option value="horizontal" ${e.direction==="horizontal"?"selected":""}>\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0439</option>
              <option value="vertical" ${e.direction==="vertical"?"selected":""}>\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439</option>
              <option value="both" ${e.direction==="both"?"selected":""}>\u041E\u0431\u0430</option>
            </select>
          </div>
          
          <div class="swipe-actions-grid">
            <div class="swipe-action-item">
              <ha-icon icon="mdi:arrow-left"></ha-icon>
              <select id="swipe_left_action">
                <option value="">\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F</option>
                <option value="expand" ${((i=e.swipe_left)==null?void 0:i.action)==="expand"?"selected":""}>\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C</option>
                <option value="collapse" ${((a=e.swipe_left)==null?void 0:a.action)==="collapse"?"selected":""}>\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C</option>
                <option value="next" ${((r=e.swipe_left)==null?void 0:r.action)==="next"?"selected":""}>\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439</option>
                <option value="prev" ${((o=e.swipe_left)==null?void 0:o.action)==="prev"?"selected":""}>\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439</option>
              </select>
            </div>
            <div class="swipe-action-item">
              <ha-icon icon="mdi:arrow-right"></ha-icon>
              <select id="swipe_right_action">
                <option value="">\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F</option>
                <option value="expand" ${((n=e.swipe_right)==null?void 0:n.action)==="expand"?"selected":""}>\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u044C</option>
                <option value="collapse" ${((c=e.swipe_right)==null?void 0:c.action)==="collapse"?"selected":""}>\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C</option>
                <option value="next" ${((l=e.swipe_right)==null?void 0:l.action)==="next"?"selected":""}>\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439</option>
                <option value="prev" ${((d=e.swipe_right)==null?void 0:d.action)==="prev"?"selected":""}>\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439</option>
              </select>
            </div>
          </div>
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
            ${e.map((t,i)=>`
              <div class="badge-item" data-index="${i}">
                <input type="text" placeholder="entity_id" value="${this._escapeHtml(t.entity||"")}" 
                       data-field="entity" class="badge-field">
                <input type="text" placeholder="\u0438\u043A\u043E\u043D\u043A\u0430" value="${this._escapeHtml(t.icon||"")}" 
                       data-field="icon" class="badge-field badge-small">
                <input type="text" placeholder="\u0446\u0432\u0435\u0442" value="${this._escapeHtml(t.color||"")}" 
                       data-field="color" class="badge-field badge-small">
                <button class="btn-icon btn-delete" data-action="delete-badge" data-index="${i}">
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>
              </div>
            `).join("")}
          </div>
          
          <button class="btn btn-small btn-add" data-action="add-badge">
            <ha-icon icon="mdi:plus"></ha-icon>
            \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0431\u0435\u0439\u0434\u0436
          </button>
        </div>
      </div>
    `}_renderAnimationPresetsUI(){let e=this._config.expand_animation||"slide",t=this._config.collapse_animation||"slide",i=this._config.animation_duration||300,a=this._config.cards_animation||"fadeUp",r=this._config.cards_stagger||50,o=[{value:"none",label:"\u041D\u0435\u0442",icon:"mdi:cancel"},{value:"fade",label:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435",icon:"mdi:blur"},{value:"fadeUp",label:"\u0421\u043D\u0438\u0437\u0443",icon:"mdi:arrow-up-bold"},{value:"fadeDown",label:"\u0421\u0432\u0435\u0440\u0445\u0443",icon:"mdi:arrow-down-bold"},{value:"scale",label:"\u041C\u0430\u0441\u0448\u0442\u0430\u0431",icon:"mdi:resize"},{value:"slide",label:"\u0412\u044B\u0435\u0437\u0434",icon:"mdi:arrow-expand-down"},{value:"bounce",label:"\u041F\u0440\u0443\u0436\u0438\u043D\u0430",icon:"mdi:arrow-collapse-down"},{value:"flip",label:"3D \u0444\u043B\u0438\u043F",icon:"mdi:rotate-3d-variant"}],n=[{value:"none",label:"\u041D\u0435\u0442",icon:"mdi:cancel"},{value:"fade",label:"\u0418\u0441\u0447\u0435\u0437\u0430\u043D\u0438\u0435",icon:"mdi:blur-off"},{value:"fadeDown",label:"\u0412\u043D\u0438\u0437",icon:"mdi:arrow-down-bold"},{value:"fadeUp",label:"\u0412\u0432\u0435\u0440\u0445",icon:"mdi:arrow-up-bold"},{value:"scale",label:"\u041C\u0430\u0441\u0448\u0442\u0430\u0431",icon:"mdi:resize-bottom-right"},{value:"slide",label:"\u0423\u0435\u0437\u0434",icon:"mdi:arrow-collapse-up"}],c=[{value:"none",label:"\u041D\u0435\u0442",icon:"mdi:cancel"},{value:"fadeUp",label:"\u0421\u043D\u0438\u0437\u0443",icon:"mdi:arrow-up-bold"},{value:"fadeDown",label:"\u0421\u0432\u0435\u0440\u0445\u0443",icon:"mdi:arrow-down-bold"},{value:"fadeLeft",label:"\u0421\u043B\u0435\u0432\u0430",icon:"mdi:arrow-left-bold"},{value:"fadeRight",label:"\u0421\u043F\u0440\u0430\u0432\u0430",icon:"mdi:arrow-right-bold"},{value:"scale",label:"\u041C\u0430\u0441\u0448\u0442\u0430\u0431",icon:"mdi:resize"},{value:"bounce",label:"\u041F\u0440\u0443\u0436\u0438\u043D\u0430",icon:"mdi:arrow-collapse-down"},{value:"flip",label:"3D \u0444\u043B\u0438\u043F",icon:"mdi:rotate-3d-variant"}],l=e!=="none"||t!=="none"||a!=="none";return`
      <div class="feature-group collapsible ${l?"has-content":""}" data-feature="animation">
        <div class="feature-group-header" data-toggle="animation">
          <ha-icon icon="mdi:animation-play"></ha-icon>
          <span>\u0410\u043D\u0438\u043C\u0430\u0446\u0438\u0438</span>
          <span class="feature-badge">${l?"\u2713":""}</span>
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
              ${o.map(d=>`
                <button class="animation-btn ${e===d.value?"active":""}" 
                        data-animation-type="expand" data-animation="${d.value}"
                        title="${d.label}">
                  <ha-icon icon="${d.icon}"></ha-icon>
                  <span>${d.label}</span>
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
              ${n.map(d=>`
                <button class="animation-btn ${t===d.value?"active":""}" 
                        data-animation-type="collapse" data-animation="${d.value}"
                        title="${d.label}">
                  <ha-icon icon="${d.icon}"></ha-icon>
                  <span>${d.label}</span>
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
              ${c.map(d=>`
                <button class="animation-btn ${a===d.value?"active":""}" 
                        data-animation-type="cards" data-animation="${d.value}"
                        title="${d.label}">
                  <ha-icon icon="${d.icon}"></ha-icon>
                  <span>${d.label}</span>
                </button>
              `).join("")}
            </div>
          </div>
          
          <!-- Cards Stagger Delay -->
          <div class="animation-duration-section">
            <label class="section-label">
              <ha-icon icon="mdi:sort-clock-ascending"></ha-icon>
              \u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 \u043C\u0435\u0436\u0434\u0443 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438
            </label>
            <div class="duration-row">
              <input type="range" id="cards_stagger_slider" 
                     min="0" max="200" step="10"
                     value="${r}">
              <span class="stagger-value">${r}ms</span>
            </div>
          </div>
          
          <!-- Cards Direction -->
          ${this._renderCardsDirectionUI()}
          
          <hr class="section-divider">
          
          <!-- Duration -->
          <div class="animation-duration-section">
            <label class="section-label">
              <ha-icon icon="mdi:timer-outline"></ha-icon>
              \u041E\u0431\u0449\u0430\u044F \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C
            </label>
            <div class="duration-row">
              <input type="range" id="animation_duration_slider" 
                     min="0" max="1000" step="50"
                     value="${i}">
              <span class="duration-value">${i}ms</span>
            </div>
          </div>
          
          <!-- Preview Button -->
          <button class="btn btn-preview-animation" data-action="preview-animation">
            <ha-icon icon="mdi:play-circle-outline"></ha-icon>
            \u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440
          </button>
        </div>
      </div>
    `}_renderCardsDirectionUI(){let e=this._config.cards_direction||"sequential";return`
      <div class="animation-section">
        <label class="section-label">
          <ha-icon icon="mdi:arrow-decision"></ha-icon>
          \u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u044F
        </label>
        <div class="direction-grid">
          ${[{value:"sequential",label:"\u041F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443",icon:"mdi:ray-start-arrow"},{value:"reverse",label:"\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0439",icon:"mdi:ray-end-arrow"},{value:"center-out",label:"\u041E\u0442 \u0446\u0435\u043D\u0442\u0440\u0430",icon:"mdi:arrow-expand-horizontal"},{value:"edges-in",label:"\u041A \u0446\u0435\u043D\u0442\u0440\u0443",icon:"mdi:arrow-collapse-horizontal"},{value:"diagonal",label:"\u041F\u043E \u0434\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u0438",icon:"mdi:arrow-bottom-right"},{value:"wave",label:"\u0412\u043E\u043B\u043D\u0430",icon:"mdi:wave"},{value:"random",label:"\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439",icon:"mdi:shuffle-variant"}].map(i=>`
            <button class="direction-btn ${e===i.value?"active":""}" 
                    data-direction="${i.value}"
                    title="${i.label}">
              <ha-icon icon="${i.icon}"></ha-icon>
              <span>${i.label}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `}_renderAdvancedSection(){return`
      <div class="section">
        <h3>\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438</h3>
        
        <div class="field">
          <label for="card_id">ID \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438</label>
          <input type="text" 
                 id="card_id" 
                 name="card_id"
                 value="${this._escapeHtml(this._config.card_id||"")}" 
                 placeholder="\u0410\u0432\u0442\u043E-\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0435\u0441\u043B\u0438 \u043F\u0443\u0441\u0442\u043E">
        </div>
        
        <div class="subsection">
          <h4>YAML Preview</h4>
          <div class="yaml-preview">${this._getYamlPreview()}</div>
        </div>
        
        <div class="subsection">
          <h4>Debug</h4>
          <div class="field checkbox-field">
            <input type="checkbox" 
                   id="debug" 
                   name="debug"
                   ${this._config.debug?"checked":""}>
            <label for="debug">\u0420\u0435\u0436\u0438\u043C \u043E\u0442\u043B\u0430\u0434\u043A\u0438</label>
          </div>
        </div>
      </div>
    `}_renderCardsList(e,t){return!e||!e.length?'<div class="empty-state">\u041D\u0435\u0442 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A</div>':e.map((i,a)=>this._inlineEditSection===t&&this._inlineEditIndex===a?`
          <div class="card-item editing" data-section="${t}" data-index="${a}">
            <div class="inline-editor" id="inline-editor-${t}-${a}">
              <!-- Editor will be inserted here -->
            </div>
          </div>
        `:`
        <div class="card-item" data-section="${t}" data-index="${a}">
          <div class="card-item-content" data-action="edit-card-inline" data-section="${t}" data-index="${a}">
            <ha-icon icon="mdi:drag-vertical" class="drag-handle"></ha-icon>
            <span class="card-type">${i.type||"unknown"}</span>
            ${i.entity?`<span class="card-entity">${i.entity}</span>`:""}
            ${i.content?`<span class="card-content-preview">${this._escapeHtml((i.content||"").substring(0,30))}...</span>`:""}
          </div>
          <div class="card-item-actions">
            <button class="btn-icon" data-action="edit-card-inline" data-section="${t}" data-index="${a}" title="\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C">
              <ha-icon icon="mdi:pencil"></ha-icon>
            </button>
            <button class="btn-icon btn-danger" data-action="delete-card" data-section="${t}" data-index="${a}" title="\u0423\u0434\u0430\u043B\u0438\u0442\u044C">
              <ha-icon icon="mdi:delete"></ha-icon>
            </button>
          </div>
        </div>
      `).join("")}_renderSubEditorContainer(){return`
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
    `}async _initSubEditor(){var a,r;let e=this.shadowRoot.getElementById("sub-editor-slot");if(!e)return;let t=this._editingCardSection,i=this._editingCardIndex;if(i===-1)await this._showCardPicker(e,t);else{let n=(t==="header"?((a=this._config.header)==null?void 0:a.cards)||[]:((r=this._config.body)==null?void 0:r.cards)||[])[i];n&&await this._showCardEditor(e,n,t,i)}}async _showCardPicker(e,t){e.innerHTML=this._renderCardTypeSelector(t),this._bindCardTypeSelector(e,t)}async _loadCardHelpers(){if(this._cardHelpers)return this._cardHelpers;try{if(window.loadCardHelpers)return this._cardHelpers=await window.loadCardHelpers(),this._cardHelpers}catch(e){console.warn("[UC Editor] Could not load card helpers:",e)}return null}_getLovelace(){let e=null;if(document.__lovelace&&(e=document.__lovelace),!e){let t=document.querySelector("home-assistant");if(t&&t.shadowRoot){let i=t.shadowRoot.querySelector("home-assistant-main");if(i&&i.shadowRoot){let a=i.shadowRoot.querySelector("ha-panel-lovelace");a&&(e=a.lovelace)}}}return(!e||!e.config||!Array.isArray(e.config.views))&&(e={config:{views:[{cards:[]}]},editMode:!0}),e}_getAllAvailableCards(){let e=[];[{type:"alarm-panel",name:"Alarm Panel",description:"\u041F\u0430\u043D\u0435\u043B\u044C \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043E\u0445\u0440\u0430\u043D\u043D\u043E\u0439 \u0441\u0438\u0433\u043D\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0435\u0439",icon:"mdi:shield"},{type:"area",name:"Area",description:"\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",icon:"mdi:texture-box"},{type:"button",name:"Button",description:"\u041A\u043D\u043E\u043F\u043A\u0430 \u0434\u043B\u044F \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439",icon:"mdi:gesture-tap-button"},{type:"calendar",name:"Calendar",description:"\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C \u0441\u043E\u0431\u044B\u0442\u0438\u0439",icon:"mdi:calendar"},{type:"conditional",name:"Conditional",description:"\u0423\u0441\u043B\u043E\u0432\u043D\u043E\u0435 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",icon:"mdi:help-circle-outline"},{type:"entities",name:"Entities",description:"\u0421\u043F\u0438\u0441\u043E\u043A \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",icon:"mdi:view-list"},{type:"entity",name:"Entity",description:"\u041E\u0434\u043D\u0430 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u044C",icon:"mdi:square-rounded"},{type:"entity-filter",name:"Entity Filter",description:"\u0424\u0438\u043B\u044C\u0442\u0440 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",icon:"mdi:filter"},{type:"gauge",name:"Gauge",description:"\u0414\u0430\u0442\u0447\u0438\u043A \u0441\u043E \u0448\u043A\u0430\u043B\u043E\u0439",icon:"mdi:gauge"},{type:"glance",name:"Glance",description:"\u041E\u0431\u0437\u043E\u0440 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0435\u0439",icon:"mdi:eye"},{type:"grid",name:"Grid",description:"\u0421\u0435\u0442\u043A\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A",icon:"mdi:view-grid"},{type:"history-graph",name:"History Graph",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u0438\u0441\u0442\u043E\u0440\u0438\u0438",icon:"mdi:chart-line"},{type:"horizontal-stack",name:"Horizontal Stack",description:"\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430",icon:"mdi:arrow-split-vertical"},{type:"humidifier",name:"Humidifier",description:"\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0443\u0432\u043B\u0430\u0436\u043D\u0438\u0442\u0435\u043B\u0435\u043C",icon:"mdi:air-humidifier"},{type:"iframe",name:"iFrame",description:"\u0412\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 iframe",icon:"mdi:application"},{type:"light",name:"Light",description:"\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043E\u0441\u0432\u0435\u0449\u0435\u043D\u0438\u0435\u043C",icon:"mdi:lightbulb"},{type:"logbook",name:"Logbook",description:"\u0416\u0443\u0440\u043D\u0430\u043B \u0441\u043E\u0431\u044B\u0442\u0438\u0439",icon:"mdi:script-text"},{type:"map",name:"Map",description:"\u041A\u0430\u0440\u0442\u0430 \u0441 \u0442\u0440\u0435\u043A\u0435\u0440\u0430\u043C\u0438",icon:"mdi:map"},{type:"markdown",name:"Markdown",description:"\u0422\u0435\u043A\u0441\u0442 \u0441 \u0444\u043E\u0440\u043C\u0430\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435\u043C",icon:"mdi:language-markdown"},{type:"media-control",name:"Media Control",description:"\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u0435\u0434\u0438\u0430\u043F\u043B\u0435\u0435\u0440\u043E\u043C",icon:"mdi:play-pause"},{type:"picture",name:"Picture",description:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435",icon:"mdi:image"},{type:"picture-elements",name:"Picture Elements",description:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u043C\u0438",icon:"mdi:image-text"},{type:"picture-entity",name:"Picture Entity",description:"\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441\u0443\u0449\u043D\u043E\u0441\u0442\u0438",icon:"mdi:image-outline"},{type:"picture-glance",name:"Picture Glance",description:"\u041E\u0431\u0437\u043E\u0440 \u0441 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435\u043C",icon:"mdi:image-multiple"},{type:"plant-status",name:"Plant Status",description:"\u0421\u0442\u0430\u0442\u0443\u0441 \u0440\u0430\u0441\u0442\u0435\u043D\u0438\u044F",icon:"mdi:flower"},{type:"sensor",name:"Sensor",description:"\u0421\u0435\u043D\u0441\u043E\u0440",icon:"mdi:eye"},{type:"shopping-list",name:"Shopping List",description:"\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u043E\u043A\u0443\u043F\u043E\u043A",icon:"mdi:cart"},{type:"statistic",name:"Statistic",description:"\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430",icon:"mdi:chart-bar"},{type:"statistics-graph",name:"Statistics Graph",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438",icon:"mdi:chart-line-variant"},{type:"thermostat",name:"Thermostat",description:"\u0422\u0435\u0440\u043C\u043E\u0441\u0442\u0430\u0442",icon:"mdi:thermostat"},{type:"tile",name:"Tile",description:"\u041F\u043B\u0438\u0442\u043A\u0430",icon:"mdi:square-rounded"},{type:"todo-list",name:"Todo List",description:"\u0421\u043F\u0438\u0441\u043E\u043A \u0434\u0435\u043B",icon:"mdi:format-list-checks"},{type:"vertical-stack",name:"Vertical Stack",description:"\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u0433\u0440\u0443\u043F\u043F\u0430",icon:"mdi:arrow-split-horizontal"},{type:"weather-forecast",name:"Weather Forecast",description:"\u041F\u0440\u043E\u0433\u043D\u043E\u0437 \u043F\u043E\u0433\u043E\u0434\u044B",icon:"mdi:weather-cloudy"},{type:"energy-date-selection",name:"Energy Date",description:"\u0412\u044B\u0431\u043E\u0440 \u0434\u0430\u0442\u044B \u044D\u043D\u0435\u0440\u0433\u0438\u0438",icon:"mdi:calendar-range"},{type:"energy-usage-graph",name:"Energy Usage",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u0435\u043D\u0438\u044F",icon:"mdi:lightning-bolt"},{type:"energy-solar-graph",name:"Energy Solar",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u0441\u043E\u043B\u043D\u0435\u0447\u043D\u043E\u0439 \u044D\u043D\u0435\u0440\u0433\u0438\u0438",icon:"mdi:solar-power"},{type:"energy-gas-graph",name:"Energy Gas",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u0435\u043D\u0438\u044F \u0433\u0430\u0437\u0430",icon:"mdi:fire"},{type:"energy-water-graph",name:"Energy Water",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u043F\u043E\u0442\u0440\u0435\u0431\u043B\u0435\u043D\u0438\u044F \u0432\u043E\u0434\u044B",icon:"mdi:water"},{type:"energy-devices-graph",name:"Energy Devices",description:"\u0413\u0440\u0430\u0444\u0438\u043A \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432",icon:"mdi:devices"},{type:"energy-sources-table",name:"Energy Sources",description:"\u0422\u0430\u0431\u043B\u0438\u0446\u0430 \u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u043E\u0432",icon:"mdi:table"},{type:"energy-distribution",name:"Energy Distribution",description:"\u0420\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u044D\u043D\u0435\u0440\u0433\u0438\u0438",icon:"mdi:chart-sankey"}].forEach(a=>{e.push({type:a.type,name:a.name,description:a.description,icon:a.icon,isCustom:!1})}),window.customCards&&Array.isArray(window.customCards)&&window.customCards.forEach(a=>{e.find(r=>r.type===a.type)||e.push({type:a.type,name:a.name||a.type,description:a.description||"",icon:a.preview||"mdi:puzzle",isCustom:!0})});let i=[];return typeof customElements!="undefined"&&["hui-","ha-","mushroom-","mini-","apexcharts-","bubble-","button-card","card-mod","decluttering-card","auto-entities","layout-card","stack-in-card","fold-entity-row","slider-entity-row","multiple-entity-row","simple-thermostat","weather-card","clock-weather-card","atomic-calendar","vacuum-card","bar-card","uptime-card","flex-horseshoe-card","restriction-card","state-switch","swipe-card","tabbed-card","vertical-stack-in-card","xiaomi-vacuum-map-card","lovelace-","sankey-chart","plotly-graph","power-flow-card","sunsynk-power-flow-card","lg-webos-remote-control","roku-card","frigate-card","webrtc-camera"].forEach(r=>{try{customElements.get(r)&&!e.find(o=>o.type===`custom:${r}`)&&e.push({type:`custom:${r}`,name:r.replace(/-/g," ").replace(/card$/i,"").trim(),description:"Custom card",icon:"mdi:puzzle",isCustom:!0})}catch(o){}}),e.sort((a,r)=>a.isCustom===r.isCustom?a.name.localeCompare(r.name):a.isCustom?1:-1),e}_renderCardTypeSelector(e){let t=this._getAllAvailableCards(),i=t.filter(r=>!r.isCustom),a=t.filter(r=>r.isCustom);return`
      <div class="card-picker-container">
        <div class="card-picker-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input type="text" id="card-search" placeholder="\u041F\u043E\u0438\u0441\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A..." autocomplete="off">
        </div>
        
        <div class="card-picker-sections">
          <div class="card-section">
            <h4 class="card-section-title">
              <ha-icon icon="mdi:home-assistant"></ha-icon>
              \u0421\u0442\u0430\u043D\u0434\u0430\u0440\u0442\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 (${i.length})
            </h4>
            <div class="card-type-grid" data-section="builtin">
              ${i.map(r=>this._renderCardTypeButton(r,e)).join("")}
            </div>
          </div>
          
          ${a.length>0?`
            <div class="card-section">
              <h4 class="card-section-title">
                <ha-icon icon="mdi:puzzle"></ha-icon>
                \u041A\u0430\u0441\u0442\u043E\u043C\u043D\u044B\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 (${a.length})
              </h4>
              <div class="card-type-grid" data-section="custom">
                ${a.map(r=>this._renderCardTypeButton(r,e)).join("")}
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
            <button class="btn btn-add" id="add-custom-card">\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C</button>
          </div>
        </div>
      </div>
    `}_renderCardTypeButton(e,t){let i=typeof e.icon=="string"&&e.icon.startsWith("mdi:")?e.icon:"mdi:card-outline";return`
      <button class="card-type-btn ${e.isCustom?"custom":""}" 
              data-type="${e.type}" 
              data-section="${t}"
              title="${e.description||e.name}">
        <ha-icon icon="${i}"></ha-icon>
        <span class="card-name">${this._escapeHtml(e.name)}</span>
        ${e.isCustom?'<span class="custom-badge">CUSTOM</span>':""}
      </button>
    `}_bindCardTypeSelector(e,t){let i=e.querySelector("#card-search");i&&i.addEventListener("input",r=>{let o=r.target.value.toLowerCase().trim();e.querySelectorAll(".card-type-btn").forEach(n=>{var u,p,h;let c=((p=(u=n.querySelector(".card-name"))==null?void 0:u.textContent)==null?void 0:p.toLowerCase())||"",l=((h=n.dataset.type)==null?void 0:h.toLowerCase())||"",d=c.includes(o)||l.includes(o);n.style.display=d?"":"none"})}),e.querySelectorAll(".card-type-btn").forEach(r=>{r.addEventListener("click",()=>{let o=r.dataset.type,n=this._getDefaultCardConfig(o);this._addCardConfig(t,n),this._closeSubEditor()})});let a=e.querySelector("#add-custom-card");if(a){a.addEventListener("click",()=>{var c;let o=e.querySelector("#custom-card-type"),n=(c=o==null?void 0:o.value)==null?void 0:c.trim();n&&(this._addCardConfig(t,{type:n}),this._closeSubEditor())});let r=e.querySelector("#custom-card-type");r&&r.addEventListener("keypress",o=>{o.key==="Enter"&&a.click()})}}_getDefaultCardConfig(e){return{markdown:{type:"markdown",content:"\u041D\u043E\u0432\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430"},entities:{type:"entities",entities:[]},button:{type:"button",tap_action:{action:"toggle"}},gauge:{type:"gauge",entity:""},glance:{type:"glance",entities:[]},"history-graph":{type:"history-graph",entities:[]},light:{type:"light",entity:""},"media-control":{type:"media-control",entity:""},picture:{type:"picture",image:""},sensor:{type:"sensor",entity:""},thermostat:{type:"thermostat",entity:""},"weather-forecast":{type:"weather-forecast",entity:""}}[e]||{type:e}}async _showCardEditor(e,t,i,a){let r=t.type||"",o=this._configToYaml(t),n=this._inlineEditSection!==null;e.innerHTML=`
      <div class="card-editor-toolbar">
        <span class="editor-title">
          <ha-icon icon="mdi:code-braces"></ha-icon>
          ${this._escapeHtml(r)}
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
    `;let c=e.querySelector("#code-editor-slot"),l=null;customElements.get("ha-code-editor")?(l=document.createElement("ha-code-editor"),l.mode="yaml",l.autofocus=!0,l.autocompleteEntities=!0,l.autocompleteIcons=!0,l.value=o,this._hass&&(l.hass=this._hass),c.appendChild(l)):c.innerHTML=`<textarea class="yaml-fallback-editor">${this._escapeHtml(o)}</textarea>`;let d=e.querySelector('[data-action="save-inline"]');d&&d.addEventListener("click",()=>{try{let p="";if(l)p=l.value;else{let g=e.querySelector(".yaml-fallback-editor");p=(g==null?void 0:g.value)||""}let h=this._yamlToConfig(p);this._updateCardConfig(i,a,h),n?this._closeInlineEditor():this._closeSubEditor()}catch(p){alert("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 YAML: "+p.message)}});let u=e.querySelector('[data-action="cancel-inline"]');u&&u.addEventListener("click",()=>{n?this._closeInlineEditor():this._closeSubEditor()})}_renderTabsEditor(){return`
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
        
        <div class="field checkbox-field">
          <input type="checkbox" 
                 id="carousel_autoplay" 
                 name="carousel_autoplay"
                 ${this._config.carousel_autoplay?"checked":""}>
          <label for="carousel_autoplay">\u0410\u0432\u0442\u043E\u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435</label>
        </div>
        
        <div class="field">
          <label for="carousel_interval">\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B (\u043C\u0441)</label>
          <input type="number" 
                 id="carousel_interval" 
                 name="carousel_interval"
                 value="${this._config.carousel_interval||T.carousel_interval}" 
                 min="1000" 
                 max="60000">
        </div>
      </div>
    `}_escapeHtml(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}_getModeLabel(e){return{[E.EXPAND]:"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435 (expand)",[E.MODAL]:"\u041C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u043D\u043E (modal)",[E.FULLSCREEN]:"\u041F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u044B\u0439 (fullscreen)",[E.TABS]:"\u0412\u043A\u043B\u0430\u0434\u043A\u0438 (tabs)",[E.CAROUSEL]:"\u041A\u0430\u0440\u0443\u0441\u0435\u043B\u044C (carousel)",[E.SUBVIEW]:"Subview",[E.NONE]:"\u0422\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A (none)"}[e]||e}_getThemeLabel(e){return{[f.DEFAULT]:"\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",[f.TRANSPARENT]:"\u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u0430\u044F",[f.SOLID]:"\u041E\u0431\u044B\u0447\u043D\u0430\u044F",[f.GLASS]:"\u0421\u0442\u0435\u043A\u043B\u043E",[f.GLASSMORPHISM]:"Glassmorphism",[f.NEUMORPHISM]:"Neumorphism",[f.MINIMAL]:"\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u0438\u0437\u043C",[f.GRADIENT]:"\u0413\u0440\u0430\u0434\u0438\u0435\u043D\u0442",[f.DARK]:"\u0422\u0451\u043C\u043D\u0430\u044F",[f.NEON]:"\u041D\u0435\u043E\u043D",[f.AURORA]:"\u0410\u0432\u0440\u043E\u0440\u0430",[f.CARBON]:"Carbon",[f.SLATE]:"Slate",[f.OBSIDIAN]:"Obsidian",[f.CHARCOAL]:"Charcoal",[f.MIDNIGHT]:"Midnight",[f.CYBER]:"Cyber",[f.VOID]:"Void",[f.EMBER]:"Ember",[f.FOREST]:"Forest",[f.OCEAN]:"Ocean",[f.PURPLE_HAZE]:"Purple Haze",[f.MATRIX]:"Matrix",[f.GRAPHITE]:"Graphite",[f.SMOKE]:"Smoke",[f.NORD]:"Nord",[f.DRACULA]:"Dracula",[f.MONOKAI]:"Monokai",[f.TOKYO_NIGHT]:"Tokyo Night",[f.CATPPUCCIN]:"Catppuccin"}[e]||e}_getThemePreviewStyle(){let e=this._config.theme||f.DEFAULT,t={[f.DEFAULT]:"background: var(--ha-card-background, #fff); color: var(--primary-text-color, #333);",[f.TRANSPARENT]:"background: transparent; color: var(--primary-text-color, #fff); border: 1px dashed rgba(255,255,255,0.3);",[f.SOLID]:"background: var(--ha-card-background, #fff); color: var(--primary-text-color, #333);",[f.GLASS]:"background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: #fff; border: 1px solid rgba(255,255,255,0.2);",[f.GLASSMORPHISM]:"background: rgba(255,255,255,0.15); backdrop-filter: blur(20px); color: #fff; border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.1);",[f.NEUMORPHISM]:"background: #e0e5ec; color: #333; box-shadow: 8px 8px 16px #b8bec7, -8px -8px 16px #fff;",[f.MINIMAL]:"background: transparent; color: var(--primary-text-color, #fff); border-bottom: 1px solid rgba(255,255,255,0.2);",[f.GRADIENT]:"background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff;",[f.DARK]:"background: #1a1a2e; color: #eee;",[f.NEON]:"background: #0a0a0a; color: #0ff; border: 1px solid #0ff; box-shadow: 0 0 10px #0ff;",[f.AURORA]:"background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); color: #fff;",[f.CARBON]:"background: linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%); color: #ccc;",[f.SLATE]:"background: #334155; color: #f1f5f9;",[f.OBSIDIAN]:"background: #1e1e2e; color: #cdd6f4;",[f.CHARCOAL]:"background: #36454f; color: #fff;",[f.MIDNIGHT]:"background: #191970; color: #e6e6fa;",[f.CYBER]:"background: #0d0221; color: #ff00ff; border: 1px solid #ff00ff;",[f.VOID]:"background: #000; color: #666;",[f.EMBER]:"background: linear-gradient(135deg, #f12711, #f5af19); color: #fff;",[f.FOREST]:"background: linear-gradient(135deg, #134e5e, #71b280); color: #fff;",[f.OCEAN]:"background: linear-gradient(135deg, #2e3192, #1bffff); color: #fff;",[f.PURPLE_HAZE]:"background: linear-gradient(135deg, #7303c0, #ec38bc); color: #fff;",[f.MATRIX]:"background: #000; color: #00ff00;",[f.GRAPHITE]:"background: #3a3a3c; color: #d1d1d6;",[f.SMOKE]:"background: rgba(50,50,50,0.8); color: #ccc;",[f.NORD]:"background: #2e3440; color: #eceff4;",[f.DRACULA]:"background: #282a36; color: #f8f8f2;",[f.MONOKAI]:"background: #272822; color: #f8f8f2;",[f.TOKYO_NIGHT]:"background: #1a1b26; color: #c0caf5;",[f.CATPPUCCIN]:"background: #1e1e2e; color: #cdd6f4;"};return t[e]||t[f.DEFAULT]}_getYamlPreview(){let e=this._configToYaml(this._config);return this._highlightYaml(e)}_configToYaml(e,t=0){let i="  ".repeat(t),a="";for(let[r,o]of Object.entries(e))o!=null&&(Array.isArray(o)?o.length===0?a+=`${i}${r}: []
`:(a+=`${i}${r}:
`,o.forEach(n=>{typeof n=="object"?(a+=`${i}  -
`,a+=this._configToYaml(n,t+2)):a+=`${i}  - ${n}
`})):typeof o=="object"?(a+=`${i}${r}:
`,a+=this._configToYaml(o,t+1)):typeof o=="string"&&(o.includes(":")||o.includes("#")||o.includes(`
`))?a+=`${i}${r}: "${o}"
`:a+=`${i}${r}: ${o}
`);return a}_yamlToConfig(e){let t=e.split(`
`),i={},a=i,r=[{obj:i,indent:-1}];for(let o of t){if(!o.trim()||o.trim().startsWith("#"))continue;let n=o.search(/\S/),c=o.trim();for(;r.length>1&&r[r.length-1].indent>=n;)r.pop();if(a=r[r.length-1].obj,c.startsWith("- ")){let l=c.substring(2).trim();if(Array.isArray(a))if(l)a.push(this._parseYamlValue(l));else{let d={};a.push(d),r.push({obj:d,indent:n})}}else if(c.includes(":")){let l=c.indexOf(":"),d=c.substring(0,l).trim(),u=c.substring(l+1).trim();if(u===""||u==="[]")u==="[]"?a[d]=[]:(a[d]={},r.push({obj:a[d],indent:n}));else if(u.startsWith("[")||u.startsWith("{"))try{a[d]=JSON.parse(u)}catch(p){a[d]=u}else a[d]=this._parseYamlValue(u)}}return i}_parseYamlValue(e){return e==="true"?!0:e==="false"?!1:e==="null"?null:/^-?\d+$/.test(e)?parseInt(e,10):/^-?\d+\.\d+$/.test(e)?parseFloat(e):e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'")?e.slice(1,-1):e}_highlightYaml(e){return e.replace(/^(\s*)([a-z_]+)(:)/gmi,'$1<span class="yaml-key">$2</span>$3').replace(/: (.+)$/gm,': <span class="yaml-value">$1</span>').replace(/^(\s*-\s)(.+)$/gm,'$1<span class="yaml-value">$2</span>').replace(/\n/g,"<br>")}_addCardConfig(e,t){this._config[e]||(this._config[e]={cards:[]}),this._config[e].cards||(this._config[e].cards=[]),this._config[e].cards.push(t),this._pushHistory(this._config),this._fireConfigChangedAndRender()}_updateCardConfig(e,t,i){var a,r;(r=(a=this._config[e])==null?void 0:a.cards)!=null&&r[t]&&(this._config[e].cards[t]=i,this._pushHistory(this._config),this._fireConfigChangedAndRender())}_deleteCard(e,t){var i;(i=this._config[e])!=null&&i.cards&&(this._config[e].cards.splice(t,1),this._pushHistory(this._config),this._fireConfigChangedAndRender())}_openCardEditor(e,t){this._editingCardSection=e,this._editingCardIndex=t,this._showSubEditor=!0,this._render()}_closeSubEditor(){this._showSubEditor=!1,this._editingCardIndex=null,this._editingCardSection=null,this._subEditor=null,this._inlineEditSection=null,this._inlineEditIndex=null,this._render()}_openInlineEditor(e,t){this._inlineEditSection!==null&&this._closeInlineEditor(),this._inlineEditSection=e,this._inlineEditIndex=t,this._render(),requestAnimationFrame(()=>{this._initInlineEditor(e,t)})}_closeInlineEditor(){this._inlineEditSection=null,this._inlineEditIndex=null,this._render()}async _initInlineEditor(e,t){var o,n;let i=this.shadowRoot.getElementById(`inline-editor-${e}-${t}`);if(!i)return;let r=(e==="header"?((o=this._config.header)==null?void 0:o.cards)||[]:((n=this._config.body)==null?void 0:n.cards)||[])[t];r&&await this._showCardEditor(i,r,e,t)}_addCard(e){this._openCardEditor(e,-1)}_bindEvents(){this.shadowRoot.querySelectorAll(".tab-item").forEach(e=>{e.addEventListener("click",()=>{this._showSubEditor&&this._closeSubEditor(),this._activeSection=e.dataset.section,this._render()})}),this.shadowRoot.querySelectorAll(".toolbar-btn").forEach(e=>{e.addEventListener("click",()=>this._handleToolbarAction(e.dataset.action))}),this.shadowRoot.querySelectorAll('input[type="text"], input[type="number"]').forEach(e=>{e.addEventListener("input",t=>this._handleInputChange(t))}),this.shadowRoot.querySelectorAll('input[type="checkbox"], select').forEach(e=>{e.addEventListener("change",t=>this._handleInputChange(t))}),this.shadowRoot.querySelectorAll('[data-action="add-header-card"]').forEach(e=>{e.addEventListener("click",()=>this._addCard("header"))}),this.shadowRoot.querySelectorAll('[data-action="add-body-card"]').forEach(e=>{e.addEventListener("click",()=>this._addCard("body"))}),this.shadowRoot.querySelectorAll('[data-action="edit-card"]').forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.section,i=parseInt(e.dataset.index,10);this._openCardEditor(t,i)})}),this.shadowRoot.querySelectorAll('[data-action="edit-card-inline"]').forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let i=e.dataset.section,a=parseInt(e.dataset.index,10);this._openInlineEditor(i,a)})}),this.shadowRoot.querySelectorAll('[data-action="delete-card"]').forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.section,i=parseInt(e.dataset.index,10);confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443?")&&this._deleteCard(t,i)})}),this.shadowRoot.querySelectorAll('[data-action="close-sub-editor"]').forEach(e=>{e.addEventListener("click",()=>this._closeSubEditor())}),this.shadowRoot.querySelectorAll("[data-tab-index]").forEach(e=>{e.addEventListener("input",t=>{let i=parseInt(t.target.dataset.tabIndex,10),a=t.target.dataset.field,r=this._config.tabs?[...this._config.tabs]:[];r[i]||(r[i]={}),r[i]={...r[i],[a]:t.target.value},this._config={...this._config,tabs:r},this._fireConfigChanged()})}),this.shadowRoot.querySelectorAll('[data-action="add-tab"]').forEach(e=>{e.addEventListener("click",()=>{let t=this._config.tabs?[...this._config.tabs]:[];t.push({label:`\u0412\u043A\u043B\u0430\u0434\u043A\u0430 ${t.length+1}`}),this._config={...this._config,tabs:t},this._pushHistory(this._config),this._fireConfigChangedAndRender()})}),this.shadowRoot.querySelectorAll('[data-action="delete-tab"]').forEach(e=>{e.addEventListener("click",()=>{let t=parseInt(e.dataset.index,10);if(this._config.tabs){let i=this._config.tabs.filter((a,r)=>r!==t);this._config={...this._config,tabs:i},this._pushHistory(this._config),this._fireConfigChangedAndRender()}})}),this.shadowRoot.querySelectorAll(".feature-group-header[data-toggle]").forEach(e=>{e.addEventListener("click",()=>{e.closest(".feature-group").classList.toggle("expanded")})}),this._bindVisibilityConditions(),this._bindStateStyles(),this._bindActions(),this._bindSwipeGestures(),this._bindBadges(),this._bindAnimationPresets()}_bindVisibilityConditions(){let e=this.shadowRoot.querySelector('[data-action="add-visibility-condition"]');e&&e.addEventListener("click",()=>{let t=this.shadowRoot.querySelector("#new-condition-type"),i=t==null?void 0:t.value;if(!i)return;let a=this._config.visibility?[...this._config.visibility]:[];a.push({condition:i}),this._config={...this._config,visibility:a},t.value="",this._pushHistory(this._config),this._fireConfigChangedAndRender()}),this.shadowRoot.querySelectorAll('[data-action="delete-condition"]').forEach(t=>{t.addEventListener("click",()=>{let i=parseInt(t.dataset.index,10);if(this._config.visibility){let a=this._config.visibility.filter((r,o)=>o!==i);this._config={...this._config,visibility:a},this._pushHistory(this._config),this._fireConfigChangedAndRender()}})}),this.shadowRoot.querySelectorAll(".condition-item").forEach(t=>{let i=parseInt(t.dataset.index,10);t.querySelectorAll(".cond-field, .cond-operator, .cond-weekday, .cond-checkbox input").forEach(a=>{a.addEventListener("change",()=>{this._updateConditionField(i,t)}),a.tagName==="INPUT"&&a.type!=="checkbox"&&a.addEventListener("input",()=>{this._updateConditionField(i,t)})})})}_updateConditionField(e,t){var n,c,l,d,u,p,h,g,b,y,I,B;if(!this._config.visibility||!this._config.visibility[e])return;let i=this._config.visibility[e],a=t.dataset.type,r={...i};switch(a){case"state":let q=(n=t.querySelector('[data-field="entity"]'))==null?void 0:n.value,ye=(c=t.querySelector('[data-field="operator"]'))==null?void 0:c.value,Ae=(l=t.querySelector('[data-field="state"]'))==null?void 0:l.value;r.entity=q,ye==="neq"?(r.state_not=Ae,delete r.state):(r.state=Ae,delete r.state_not);break;case"numeric_state":r.entity=(d=t.querySelector('[data-field="entity"]'))==null?void 0:d.value;let ze=(u=t.querySelector('[data-field="above"]'))==null?void 0:u.value,pi=(p=t.querySelector('[data-field="below"]'))==null?void 0:p.value;r.above=ze?parseFloat(ze):void 0,r.below=pi?parseFloat(pi):void 0;break;case"user":let Wi=((h=t.querySelector('[data-field="users"]'))==null?void 0:h.value)||"";r.users=Wi.split(",").map(Ue=>Ue.trim()).filter(Ue=>Ue),r.is_admin=(g=t.querySelector('[data-field="is_admin"]'))==null?void 0:g.checked;break;case"time":r.after=((b=t.querySelector('[data-field="after"]'))==null?void 0:b.value)||void 0,r.before=((y=t.querySelector('[data-field="before"]'))==null?void 0:y.value)||void 0;let hi=t.querySelector('[data-field="weekday"]');r.weekday=hi?Array.from(hi.selectedOptions).map(Ue=>Ue.value):void 0;break;case"screen":let mi=(I=t.querySelector('[data-field="min_width"]'))==null?void 0:I.value,fi=(B=t.querySelector('[data-field="max_width"]'))==null?void 0:B.value;r.min_width=mi?parseInt(mi,10):void 0,r.max_width=fi?parseInt(fi,10):void 0;break}let o=[...this._config.visibility];o[e]=r,this._config={...this._config,visibility:o},this._fireConfigChanged()}_bindStateStyles(){let e=this.shadowRoot.querySelector("#state_styles_entity");e&&e.addEventListener("input",i=>{this._config={...this._config,state_styles_entity:i.target.value},this._fireConfigChanged()});let t=this.shadowRoot.querySelector('[data-action="add-state-style"]');t&&t.addEventListener("click",()=>{let i=this._config.state_styles?{...this._config.state_styles}:{},a=`state_${Object.keys(i).length+1}`;i[a]={background:"",color:""},this._config={...this._config,state_styles:i},this._pushHistory(this._config),this._fireConfigChangedAndRender()}),this.shadowRoot.querySelectorAll('[data-action="delete-state-style"]').forEach(i=>{i.addEventListener("click",()=>{let a=i.dataset.state;if(this._config.state_styles&&this._config.state_styles[a]){let r={...this._config.state_styles};delete r[a],this._config={...this._config,state_styles:r},this._pushHistory(this._config),this._fireConfigChangedAndRender()}})}),this.shadowRoot.querySelectorAll(".state-style-item").forEach(i=>{var r;let a=i.dataset.state;(r=i.querySelector(".state-key"))==null||r.addEventListener("change",o=>{let n=o.target.value;if(n&&n!==a&&this._config.state_styles){let c={...this._config.state_styles};c[n]={...c[a]},delete c[a],this._config={...this._config,state_styles:c},this._fireConfigChanged()}}),i.querySelectorAll(".style-field").forEach(o=>{o.addEventListener("input",()=>{var l;let n=((l=i.querySelector(".state-key"))==null?void 0:l.value)||a,c=o.dataset.style;if(this._config.state_styles&&this._config.state_styles[n]){let d={...this._config.state_styles};d[n]={...d[n],[c]:o.value},this._config={...this._config,state_styles:d},this._fireConfigChanged()}})})}),this.shadowRoot.querySelectorAll(".btn-preset").forEach(i=>{i.addEventListener("click",()=>{let a=i.dataset.preset;this._applyStateStylePreset(a)})})}_applyStateStylePreset(e){let t={"on-off":{on:{background:"rgba(76, 175, 80, 0.2)",color:"#4caf50"},off:{background:"rgba(158, 158, 158, 0.2)",color:"#9e9e9e"}},temperature:{"<15":{background:"rgba(33, 150, 243, 0.2)",color:"#2196f3"},"15-25":{background:"rgba(76, 175, 80, 0.2)",color:"#4caf50"},">25":{background:"rgba(244, 67, 54, 0.2)",color:"#f44336"}},battery:{"<20":{background:"rgba(244, 67, 54, 0.2)",color:"#f44336"},"20-50":{background:"rgba(255, 152, 0, 0.2)",color:"#ff9800"},">50":{background:"rgba(76, 175, 80, 0.2)",color:"#4caf50"}}};t[e]&&(this._config={...this._config,state_styles:JSON.parse(JSON.stringify(t[e]))},this._pushHistory(this._config),this._fireConfigChangedAndRender())}_bindActions(){this.shadowRoot.querySelectorAll(".expand-trigger-btn").forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.trigger,i={...this._config,expand_trigger:t},a=t==="double_tap"?"double_tap_action":`${t}_action`;t!=="none"&&i[a]&&(i={...i},delete i[a]),this._config=i,this.shadowRoot.querySelectorAll(".expand-trigger-btn").forEach(r=>r.classList.remove("active")),e.classList.add("active"),this._pushHistory(this._config),this._fireConfigChangedAndRender()})}),this.shadowRoot.querySelectorAll(".action-type-select").forEach(e=>{e.addEventListener("change",t=>{let i=t.target.dataset.actionKey,a=t.target.value,r=this._config[i]?{...this._config[i]}:{};r.action=a==="none"?void 0:a,a!=="call-service"&&delete r.service,a!=="navigate"&&delete r.navigation_path,a!=="url"&&delete r.url_path,this._config={...this._config,[i]:r},this._fireConfigChangedAndRender()})}),this.shadowRoot.querySelectorAll(".action-extra-field").forEach(e=>{e.addEventListener("input",t=>{let i=t.target.dataset.actionKey,a=t.target.dataset.field,r=this._config[i]?{...this._config[i]}:{};r[a]=t.target.value,this._config={...this._config,[i]:r},this._fireConfigChanged()})})}_bindSwipeGestures(){let e=this.shadowRoot.querySelector("#swipe_enabled");e&&e.addEventListener("change",i=>{let a=this._config.swipe?{...this._config.swipe}:{};a.enabled=i.target.checked,this._config={...this._config,swipe:a},this._fireConfigChanged()});let t=this.shadowRoot.querySelector("#swipe_direction");t&&t.addEventListener("change",i=>{let a=this._config.swipe?{...this._config.swipe}:{};a.direction=i.target.value,this._config={...this._config,swipe:a},this._fireConfigChanged()}),["left","right"].forEach(i=>{let a=this.shadowRoot.querySelector(`#swipe_${i}_action`);a&&a.addEventListener("change",r=>{let o=this._config.swipe?{...this._config.swipe}:{};r.target.value?o[`swipe_${i}`]={action:r.target.value}:delete o[`swipe_${i}`],this._config={...this._config,swipe:o},this._fireConfigChanged()})})}_bindBadges(){let e=this.shadowRoot.querySelector('[data-action="add-badge"]');e&&e.addEventListener("click",()=>{let t=this._config.badges?[...this._config.badges]:[];t.push({entity:"",icon:"",color:""}),this._config={...this._config,badges:t},this._pushHistory(this._config),this._fireConfigChangedAndRender()}),this.shadowRoot.querySelectorAll('[data-action="delete-badge"]').forEach(t=>{t.addEventListener("click",()=>{let i=parseInt(t.dataset.index,10);if(this._config.badges){let a=this._config.badges.filter((r,o)=>o!==i);this._config={...this._config,badges:a},this._pushHistory(this._config),this._fireConfigChangedAndRender()}})}),this.shadowRoot.querySelectorAll(".badge-item").forEach(t=>{let i=parseInt(t.dataset.index,10);t.querySelectorAll(".badge-field").forEach(a=>{a.addEventListener("input",()=>{if(this._config.badges&&this._config.badges[i]){let r=a.dataset.field,o=[...this._config.badges];o[i]={...o[i],[r]:a.value},this._config={...this._config,badges:o},this._fireConfigChanged()}})})})}_bindAnimationPresets(){this.shadowRoot.querySelectorAll(".animation-btn").forEach(a=>{a.addEventListener("click",()=>{let r=a.dataset.animationType,o=a.dataset.animation;r==="expand"?(this._config={...this._config,expand_animation:o},this.shadowRoot.querySelectorAll('.animation-btn[data-animation-type="expand"]').forEach(n=>n.classList.remove("active"))):r==="collapse"?(this._config={...this._config,collapse_animation:o},this.shadowRoot.querySelectorAll('.animation-btn[data-animation-type="collapse"]').forEach(n=>n.classList.remove("active"))):r==="cards"&&(this._config={...this._config,cards_animation:o},this.shadowRoot.querySelectorAll('.animation-btn[data-animation-type="cards"]').forEach(n=>n.classList.remove("active"))),a.classList.add("active"),this._fireConfigChanged()})});let e=this.shadowRoot.querySelector("#animation_duration_slider");e&&e.addEventListener("input",a=>{this._config={...this._config,animation_duration:parseInt(a.target.value,10)};let r=this.shadowRoot.querySelector(".duration-value");r&&(r.textContent=`${a.target.value}ms`),this._fireConfigChanged()});let t=this.shadowRoot.querySelector("#cards_stagger_slider");t&&t.addEventListener("input",a=>{this._config={...this._config,cards_stagger:parseInt(a.target.value,10)};let r=this.shadowRoot.querySelector(".stagger-value");r&&(r.textContent=`${a.target.value}ms`),this._fireConfigChanged()}),this.shadowRoot.querySelectorAll(".direction-btn").forEach(a=>{a.addEventListener("click",()=>{let r=a.dataset.direction;this._config={...this._config,cards_direction:r},this.shadowRoot.querySelectorAll(".direction-btn").forEach(o=>o.classList.remove("active")),a.classList.add("active"),this._fireConfigChanged()})});let i=this.shadowRoot.querySelector('[data-action="preview-animation"]');i&&i.addEventListener("click",()=>{this._previewAnimation()})}_previewAnimation(){let e=this.shadowRoot.querySelector(".preview-card");if(!e)return;let t=this._config.expand_animation||"slide",i=this._config.animation_duration||300,r={none:"",fade:"uc-animate-fadeIn",fadeUp:"uc-animate-fadeInUp",fadeDown:"uc-animate-fadeInDown",scale:"uc-animate-scaleIn",slide:"uc-animate-slideInUp",bounce:"uc-animate-bounceIn",flip:"uc-animate-flipInX"}[t];r&&(e.style.animation="",e.offsetHeight,e.style.animation=`${r.replace("uc-animate-","uc-")} ${i}ms ease forwards`,setTimeout(()=>{e.style.animation=""},i+100))}_handleToolbarAction(e){switch(e){case"undo":this._undo();break;case"redo":this._redo();break;case"reset":confirm("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0432\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438?")&&(this._config={type:"custom:universal-card"},this._fireConfigChangedAndRender());break}}_handleInputChange(e){let{name:t,value:i,type:a,checked:r}=e.target;if(!t)return;let o=t.split("."),n=a==="checkbox"?r:a==="number"?i!==""?parseInt(i,10):null:i;this._config=this._setNestedValue(this._config,o,n),this._fireConfigChanged()}_setNestedValue(e,t,i){let a=e?{...e}:{};if(t.length===1)return a[t[0]]=i,a;let[r,...o]=t;return a[r]=this._setNestedValue(a[r],o,i),a}_pushHistory(e){this._historyIndex<this._history.length-1&&(this._history=this._history.slice(0,this._historyIndex+1)),this._history.push(K(e)),this._historyIndex=this._history.length-1,this._history.length>50&&(this._history.shift(),this._historyIndex--)}_undo(){this._historyIndex>0&&(this._historyIndex--,this._config=K(this._history[this._historyIndex]),this._fireConfigChangedAndRender())}_redo(){this._historyIndex<this._history.length-1&&(this._historyIndex++,this._config=K(this._history[this._historyIndex]),this._fireConfigChangedAndRender())}_fireConfigChanged(){this._lastConfigStr=JSON.stringify(this._config),_(this,"config-changed",{config:this._config})}_fireConfigChangedAndRender(){_(this,"config-changed",{config:this._config}),this._render()}_getStyles(){return`
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
      
      .icon-picker-wrapper input {
        flex: 1;
      }
      
      .icon-preview {
        --mdc-icon-size: 24px;
        color: var(--editor-text);
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
      
      .hint {
        font-size: 12px;
        color: var(--editor-text-secondary);
        margin-bottom: 12px;
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
      
      .cond-field {
        padding: 6px 10px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 13px;
        min-width: 100px;
        flex: 1;
      }
      
      .cond-field.cond-small {
        max-width: 80px;
        flex: 0;
      }
      
      .cond-operator {
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
        background: var(--editor-surface);
      }
      
      .cond-weekday {
        padding: 4px;
        font-size: 11px;
        max-width: 120px;
      }
      
      .cond-checkbox {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        white-space: nowrap;
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
      
      /* Swipe Gestures */
      .swipe-actions-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 12px;
      }
      
      .swipe-action-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }
      
      .swipe-action-item ha-icon {
        --mdc-icon-size: 28px;
        color: var(--editor-primary);
      }
      
      .swipe-action-item select {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
      }
      
      /* Badges */
      .badges-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      
      .badge-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px;
        background: var(--editor-bg);
        border: 1px solid var(--editor-border);
        border-radius: 8px;
      }
      
      .badge-field {
        flex: 1;
        padding: 6px 8px;
        border: 1px solid var(--editor-border);
        border-radius: 6px;
        font-size: 12px;
      }
      
      .badge-field.badge-small {
        max-width: 80px;
        flex: 0;
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
        
        .swipe-actions-grid {
          grid-template-columns: 1fr;
        }
      }
    `}};var it=class{constructor(e=[]){this._conditions=e,this._hass=null,this._cachedResult=!0,this._cacheKey=null}set hass(e){this._hass=e,this._cacheKey=null}set conditions(e){this._conditions=e,this._cacheKey=null}evaluate(){if(!this._conditions||this._conditions.length===0)return!0;let e=this._generateCacheKey();if(e===this._cacheKey)return this._cachedResult;let t=this._conditions.every(i=>this._evaluateCondition(i));return this._cacheKey=e,this._cachedResult=t,t}_evaluateCondition(e){let t=e.condition;switch(t){case A.STATE:return this._evaluateStateCondition(e);case A.NUMERIC_STATE:return this._evaluateNumericStateCondition(e);case A.USER:return this._evaluateUserCondition(e);case A.TIME:return this._evaluateTimeCondition(e);case A.SCREEN:return this._evaluateScreenCondition(e);case A.AND:return this._evaluateAndCondition(e);case A.OR:return this._evaluateOrCondition(e);case A.NOT:return this._evaluateNotCondition(e);default:return console.warn(`[UniversalCard] Unknown condition type: ${t}`),!0}}_evaluateStateCondition(e){let{entity:t,state:i,state_not:a,attribute:r}=e;if(!t||!this._hass)return!0;let o;return r?o=ae(this._hass,t,r):o=R(this._hass,t),a!==void 0?!(Array.isArray(a)?a:[a]).includes(o):i!==void 0?(Array.isArray(i)?i:[i]).includes(o):!0}_evaluateNumericStateCondition(e){let{entity:t,attribute:i,above:a,below:r}=e;if(!t||!this._hass)return!0;let o;i?o=ae(this._hass,t,i):o=R(this._hass,t);let n=parseFloat(o);return!(isNaN(n)||a!==void 0&&n<=a||r!==void 0&&n>=r)}_evaluateUserCondition(e){let{users:t,is_admin:i,is_owner:a}=e;if(!this._hass)return!0;let r=Ze(this._hass);return r?!(t&&Array.isArray(t)&&!t.includes(r.name)&&!t.includes(r.id)||i!==void 0&&r.is_admin!==i||a!==void 0&&r.is_owner!==a):!0}_evaluateTimeCondition(e){let{after:t,before:i,weekday:a}=e,r=new Date,o=r.getHours()*60+r.getMinutes();if(t){let[n,c]=t.split(":").map(Number),l=n*60+c;if(o<l)return!1}if(i){let[n,c]=i.split(":").map(Number),l=n*60+c;if(o>=l)return!1}if(a&&Array.isArray(a)){let c=["sun","mon","tue","wed","thu","fri","sat"][r.getDay()];if(!a.includes(c))return!1}return!0}_evaluateScreenCondition(e){let{media_query:t,min_width:i,max_width:a}=e;if(t)return window.matchMedia(t).matches;let r=window.innerWidth;return!(i!==void 0&&r<i||a!==void 0&&r>a)}_evaluateAndCondition(e){let{conditions:t}=e;return!t||!Array.isArray(t)?!0:t.every(i=>this._evaluateCondition(i))}_evaluateOrCondition(e){let{conditions:t}=e;return!t||!Array.isArray(t)?!0:t.some(i=>this._evaluateCondition(i))}_evaluateNotCondition(e){let{conditions:t}=e;return!t||!Array.isArray(t)?!0:!t.every(i=>this._evaluateCondition(i))}_generateCacheKey(){if(!this._hass)return"no-hass";let t=this._getRelevantEntities().map(r=>{let o=this._hass.states[r];return o?`${r}:${o.state}`:`${r}:null`});if(this._conditions.some(r=>r.condition===A.SCREEN)&&t.push(`screen:${window.innerWidth}`),this._conditions.some(r=>r.condition===A.TIME)){let r=new Date;t.push(`time:${r.getHours()}:${r.getMinutes()}`)}return t.join("|")}_getRelevantEntities(){let e=new Set,t=i=>{i.forEach(a=>{a.entity&&e.add(a.entity),a.conditions&&Array.isArray(a.conditions)&&t(a.conditions)})};return t(this._conditions),Array.from(e)}hasEntityDependencies(){return this._getRelevantEntities().length>0}hasScreenDependencies(){return this._conditions.some(e=>e.condition===A.SCREEN)}hasTimeDependencies(){return this._conditions.some(e=>e.condition===A.TIME)}};var at=class{constructor(e={}){this._config=e,this._hass=null,this._element=null,this._appliedStyles={}}set hass(e){this._hass=e,this._update()}set element(e){this._element=e,this._update()}set config(e){this._config=e,this._update()}_update(){if(!this._element||!this._hass||!this._config)return;let{entity:e,state_styles:t,attribute:i}=this._config;if(!e||!t)return;let a;i?a=ae(this._hass,e,i):a=R(this._hass,e);let r=this._findMatchingStyle(a,t);this._applyStyles(r)}_findMatchingStyle(e,t){if(t[e])return t[e];let i=parseFloat(e);if(!isNaN(i)){for(let[a,r]of Object.entries(t))if(this._matchesNumericCondition(i,a))return r}return t["*"]||t.default?t["*"]||t.default:null}_matchesNumericCondition(e,t){if(t.includes("-")&&!t.startsWith("-")){let[i,a]=t.split("-").map(Number);return e>=i&&e<=a}return t.startsWith(">=")?e>=parseFloat(t.slice(2)):t.startsWith("<=")?e<=parseFloat(t.slice(2)):t.startsWith(">")?e>parseFloat(t.slice(1)):t.startsWith("<")?e<parseFloat(t.slice(1)):!1}_applyStyles(e){if(!this._element||(this._removeAppliedStyles(),!e))return;let t=this._normalizeStyles(e);if(Object.entries(t).forEach(([i,a])=>{i.startsWith("--")?this._element.style.setProperty(i,a):this._element.style[i]=a,this._appliedStyles[i]=a}),e.class){let i=Array.isArray(e.class)?e.class:[e.class];i.forEach(a=>this._element.classList.add(a)),this._appliedStyles._classes=i}}_removeAppliedStyles(){this._element&&(Object.keys(this._appliedStyles).forEach(e=>{e==="_classes"?this._appliedStyles._classes.forEach(t=>{this._element.classList.remove(t)}):e.startsWith("--")?this._element.style.removeProperty(e):this._element.style[e]=""}),this._appliedStyles={})}_normalizeStyles(e){let t={},i={background:"background",bg:"background",color:"color",text_color:"color",border:"border",border_color:"borderColor",border_width:"borderWidth",border_radius:"borderRadius",shadow:"boxShadow",box_shadow:"boxShadow",opacity:"opacity",transform:"transform",filter:"filter"};return Object.entries(e).forEach(([a,r])=>{if(a==="class")return;let n=(i[a]||a).replace(/_([a-z])/g,(c,l)=>l.toUpperCase());t[n]=r}),t}static getStateColor(e){return{on:"var(--state-active-color, #fdd835)",off:"var(--state-inactive-color, #969696)",home:"var(--state-home-color, #4caf50)",not_home:"var(--state-not-home-color, #f44336)",armed_home:"var(--warning-color, #ff9800)",armed_away:"var(--error-color, #f44336)",armed_night:"var(--warning-color, #ff9800)",disarmed:"var(--success-color, #4caf50)",triggered:"var(--error-color, #f44336)",pending:"var(--warning-color, #ff9800)",locked:"var(--success-color, #4caf50)",unlocked:"var(--warning-color, #ff9800)",open:"var(--state-active-color, #fdd835)",closed:"var(--state-inactive-color, #969696)",opening:"var(--warning-color, #ff9800)",closing:"var(--warning-color, #ff9800)",heating:"var(--error-color, #f44336)",cooling:"var(--info-color, #03a9f4)",idle:"var(--state-inactive-color, #969696)",unavailable:"var(--disabled-text-color, #bdbdbd)",unknown:"var(--disabled-text-color, #bdbdbd)"}[e]||null}static getIconColorStyles(){return`
      /* State-based icon colors */
      .state-on { --icon-color: var(--state-active-color, #fdd835); }
      .state-off { --icon-color: var(--state-inactive-color, #969696); }
      .state-home { --icon-color: var(--state-home-color, #4caf50); }
      .state-not_home { --icon-color: var(--state-not-home-color, #f44336); }
      .state-unavailable { --icon-color: var(--disabled-text-color, #bdbdbd); }
    `}};var rt=class{constructor(e,t={}){this._element=e,this._options={threshold:t.threshold||50,velocityThreshold:t.velocityThreshold||.3,direction:t.direction||"horizontal",preventScroll:t.preventScroll||!1,...t},this._touchStart={x:0,y:0,time:0},this._touchCurrent={x:0,y:0},this._isTracking=!1,this._listeners={left:[],right:[],up:[],down:[]},this._handleTouchStart=this._handleTouchStart.bind(this),this._handleTouchMove=this._handleTouchMove.bind(this),this._handleTouchEnd=this._handleTouchEnd.bind(this),this._attach()}_attach(){this._element.addEventListener("touchstart",this._handleTouchStart,{passive:!0}),this._element.addEventListener("touchmove",this._handleTouchMove,{passive:!this._options.preventScroll}),this._element.addEventListener("touchend",this._handleTouchEnd),this._element.addEventListener("touchcancel",this._handleTouchEnd)}destroy(){this._element.removeEventListener("touchstart",this._handleTouchStart),this._element.removeEventListener("touchmove",this._handleTouchMove),this._element.removeEventListener("touchend",this._handleTouchEnd),this._element.removeEventListener("touchcancel",this._handleTouchEnd),this._listeners={left:[],right:[],up:[],down:[]}}_handleTouchStart(e){let t=e.touches[0];this._touchStart={x:t.clientX,y:t.clientY,time:Date.now()},this._touchCurrent={x:t.clientX,y:t.clientY},this._isTracking=!0}_handleTouchMove(e){if(!this._isTracking)return;let t=e.touches[0];if(this._touchCurrent={x:t.clientX,y:t.clientY},this._options.preventScroll){let i=Math.abs(this._touchCurrent.x-this._touchStart.x),a=Math.abs(this._touchCurrent.y-this._touchStart.y);(this._options.direction==="horizontal"&&i>a||this._options.direction==="vertical"&&a>i)&&e.preventDefault()}}_handleTouchEnd(e){if(!this._isTracking)return;this._isTracking=!1;let t=this._touchCurrent.x-this._touchStart.x,i=this._touchCurrent.y-this._touchStart.y,a=Date.now()-this._touchStart.time,r=Math.abs(t)/a,o=Math.abs(i)/a,n=this._getSwipeDirection(t,i,r,o);n&&this._triggerSwipe(n,{deltaX:t,deltaY:i,velocityX:r,velocityY:o,duration:a})}_getSwipeDirection(e,t,i,a){let{threshold:r,velocityThreshold:o,direction:n}=this._options,c=Math.abs(e),l=Math.abs(t),d=c>r||i>o,u=l>r||a>o;return n!=="vertical"&&d&&c>l?e>0?"right":"left":n!=="horizontal"&&u&&l>c?t>0?"down":"up":null}_triggerSwipe(e,t){this._listeners[e].forEach(i=>{try{i(t)}catch(a){console.error("[UniversalCard] Swipe callback error:",a)}}),_(this._element,"uc-swipe",{direction:e,...t})}on(e,t){return this._listeners[e]?(this._listeners[e].push(t),()=>{let i=this._listeners[e].indexOf(t);i>-1&&this._listeners[e].splice(i,1)}):(console.warn(`[UniversalCard] Invalid swipe direction: ${e}`),()=>{})}onSwipeLeft(e){return this.on("left",e)}onSwipeRight(e){return this.on("right",e)}onSwipeUp(e){return this.on("up",e)}onSwipeDown(e){return this.on("down",e)}};var ot={xs:{max:480},sm:{min:481,max:768},md:{min:769,max:1024},lg:{min:1025,max:1280},xl:{min:1281}},nt=class{constructor(e={},t={}){this._config=e,this._options=t,this._element=null,this._currentBreakpoint=null,this._resizeObserver=null,this._listeners=[],this._mediaQueries={},this._debouncedUpdate=Q(()=>this._update(),100)}init(e){this._element=e,this._setupMediaQueries(),this._config.useContainerQueries&&this._setupResizeObserver(),this._update()}_setupMediaQueries(){let e=this._config.breakpoints||ot;Object.entries(e).forEach(([t,i])=>{let a=this._buildMediaQuery(i),r=window.matchMedia(a);this._mediaQueries[t]=r;let o=()=>this._debouncedUpdate();r.addEventListener?r.addEventListener("change",o):r.addListener(o)})}_buildMediaQuery(e){let t=[];return e.min!==void 0&&t.push(`(min-width: ${e.min}px)`),e.max!==void 0&&t.push(`(max-width: ${e.max}px)`),t.join(" and ")||"all"}_setupResizeObserver(){!this._element||!("ResizeObserver"in window)||(this._resizeObserver=new ResizeObserver(e=>{this._debouncedUpdate()}),this._resizeObserver.observe(this._element))}_update(){let e=this._getCurrentBreakpoint();if(e!==this._currentBreakpoint){let t=this._currentBreakpoint;this._currentBreakpoint=e,this._applyBreakpointStyles(e),this._notifyListeners(e,t)}}_getCurrentBreakpoint(){if(this._config.useContainerQueries&&this._element){let e=this._element.offsetWidth;return this._getBreakpointForWidth(e)}for(let[e,t]of Object.entries(this._mediaQueries))if(t.matches)return e;return"default"}_getBreakpointForWidth(e){let t=this._config.breakpoints||ot;for(let[i,a]of Object.entries(t)){let r=a.min===void 0||e>=a.min,o=a.max===void 0||e<=a.max;if(r&&o)return i}return"default"}_applyBreakpointStyles(e){var i;if(!this._element)return;this._element.dataset.breakpoint=e;let t=(i=this._config.responsive)==null?void 0:i[e];t&&(t.columns!==void 0&&this._element.style.setProperty("--uc-grid-columns",t.columns),t.gap!==void 0&&this._element.style.setProperty("--uc-gap",t.gap),t.padding!==void 0&&this._element.style.setProperty("--uc-padding",t.padding),t.styles&&Object.entries(t.styles).forEach(([a,r])=>{a.startsWith("--")?this._element.style.setProperty(a,r):this._element.style[a]=r}))}_notifyListeners(e,t){this._listeners.forEach(i=>{var a;try{i({breakpoint:e,previousBreakpoint:t,width:((a=this._element)==null?void 0:a.offsetWidth)||window.innerWidth})}catch(r){console.error("[UniversalCard] Breakpoint listener error:",r)}})}get current(){return this._currentBreakpoint}is(e){return(Array.isArray(e)?e:[e]).includes(this._currentBreakpoint)}isAtLeast(e){let t=Object.keys(this._config.breakpoints||ot),i=t.indexOf(this._currentBreakpoint),a=t.indexOf(e);return i>=a}isAtMost(e){let t=Object.keys(this._config.breakpoints||ot),i=t.indexOf(this._currentBreakpoint),a=t.indexOf(e);return i<=a}onChange(e){return this._listeners.push(e),()=>{let t=this._listeners.indexOf(e);t>-1&&this._listeners.splice(t,1)}}destroy(){this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._mediaQueries={},this._listeners=[],this._element=null}};var st=class s{constructor(e={},t={}){this._config=e,this._options=t,this._menu=null,this._hass=null,this._closeHandler=this._handleOutsideClick.bind(this),this._escapeHandler=this._handleEscape.bind(this)}set hass(e){this._hass=e}show(e,t,i={}){this.hide(),this._menu=this._createMenu(i),this._positionMenu(e,t),document.body.appendChild(this._menu),document.addEventListener("click",this._closeHandler),document.addEventListener("contextmenu",this._closeHandler),document.addEventListener("keydown",this._escapeHandler),requestAnimationFrame(()=>{var a;(a=this._menu)==null||a.classList.add("open")})}hide(){this._menu&&(document.removeEventListener("click",this._closeHandler),document.removeEventListener("contextmenu",this._closeHandler),document.removeEventListener("keydown",this._escapeHandler),this._menu.classList.remove("open"),setTimeout(()=>{var e;(e=this._menu)==null||e.remove(),this._menu=null},150))}_createMenu(e){let t=document.createElement("div");return t.className="uc-context-menu",t.innerHTML=`<style>${s.getStyles()}</style>`,(this._config.items||[]).forEach((a,r)=>{a.type==="separator"?t.appendChild(this._createSeparator()):t.appendChild(this._createMenuItem(a,r,e))}),t}_createMenuItem(e,t,i){let a=document.createElement("button");a.className="uc-context-menu-item",e.disabled&&(a.disabled=!0,a.classList.add("disabled"));let r=e.icon?`<ha-icon icon="${e.icon}"></ha-icon>`:'<span class="icon-placeholder"></span>',o=e.label||e.name||"",n=e.shortcut?`<span class="shortcut">${e.shortcut}</span>`:"",c=e.submenu?'<ha-icon icon="mdi:chevron-right" class="submenu-icon"></ha-icon>':"";return a.innerHTML=`
      ${r}
      <span class="label">${o}</span>
      ${n}
      ${c}
    `,e.submenu?a.addEventListener("mouseenter",()=>{this._showSubmenu(a,e.submenu,i)}):a.addEventListener("click",l=>{l.stopPropagation(),this._handleItemClick(e,i)}),a}_createSeparator(){let e=document.createElement("div");return e.className="uc-context-menu-separator",e}_positionMenu(e,t){if(!this._menu)return;let i=this._menu.getBoundingClientRect(),a=window.innerWidth,r=window.innerHeight;e+i.width>a&&(e=a-i.width-8),t+i.height>r&&(t=r-i.height-8),e=Math.max(8,e),t=Math.max(8,t),this._menu.style.left=`${e}px`,this._menu.style.top=`${t}px`}_showSubmenu(e,t,i){console.debug("[UniversalCard] Submenu:",t)}_handleItemClick(e,t){this.hide(),e.action&&J(this._hass,document.body,e.action),e.callback&&typeof e.callback=="function"&&e.callback(t),e.event&&_(document.body,e.event,{item:e,context:t})}_handleOutsideClick(e){this._menu&&!this._menu.contains(e.target)&&this.hide()}_handleEscape(e){e.key==="Escape"&&this.hide()}static getStyles(){return`
      .uc-context-menu {
        position: fixed;
        z-index: 10000;
        min-width: 180px;
        max-width: 280px;
        background: var(--ha-card-background, white);
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        padding: 4px 0;
        opacity: 0;
        transform: scale(0.95);
        transform-origin: top left;
        transition: opacity 0.15s ease, transform 0.15s ease;
      }
      
      .uc-context-menu.open {
        opacity: 1;
        transform: scale(1);
      }
      
      .uc-context-menu-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 16px;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        color: var(--primary-text-color);
        font-size: 14px;
        transition: background 0.1s ease;
      }
      
      .uc-context-menu-item:hover {
        background: rgba(0, 0, 0, 0.06);
      }
      
      .uc-context-menu-item.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .uc-context-menu-item.disabled:hover {
        background: none;
      }
      
      .uc-context-menu-item ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }
      
      .uc-context-menu-item .icon-placeholder {
        width: 20px;
      }
      
      .uc-context-menu-item .label {
        flex: 1;
      }
      
      .uc-context-menu-item .shortcut {
        font-size: 12px;
        color: var(--secondary-text-color);
        opacity: 0.7;
      }
      
      .uc-context-menu-item .submenu-icon {
        --mdc-icon-size: 16px;
        margin-right: -8px;
      }
      
      .uc-context-menu-separator {
        height: 1px;
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
        margin: 4px 0;
      }
    `}destroy(){this.hide()}};var ct=class s{constructor(e={},t={}){this._config=e,this._options={radius:t.radius||80,itemSize:t.itemSize||48,startAngle:t.startAngle||-90,...t},this._menu=null,this._center=null,this._hass=null,this._selectedIndex=null,this._centerPos={x:0,y:0},this._moveHandler=this._handleMove.bind(this),this._endHandler=this._handleEnd.bind(this)}set hass(e){this._hass=e}show(e,t,i={}){this.hide(),this._centerPos={x:e,y:t},this._menu=this._createMenu(i),document.body.appendChild(this._menu),document.addEventListener("touchmove",this._moveHandler,{passive:!1}),document.addEventListener("touchend",this._endHandler),document.addEventListener("mousemove",this._moveHandler),document.addEventListener("mouseup",this._endHandler),requestAnimationFrame(()=>{var a;(a=this._menu)==null||a.classList.add("open")})}hide(e=!1){if(this._menu){if(e&&this._selectedIndex!==null){let i=(this._config.items||[])[this._selectedIndex];i&&this._executeItem(i)}document.removeEventListener("touchmove",this._moveHandler),document.removeEventListener("touchend",this._endHandler),document.removeEventListener("mousemove",this._moveHandler),document.removeEventListener("mouseup",this._endHandler),this._menu.classList.remove("open"),setTimeout(()=>{var t;(t=this._menu)==null||t.remove(),this._menu=null,this._center=null,this._selectedIndex=null},200)}}_createMenu(e){let t=document.createElement("div");t.className="uc-radial-menu",t.innerHTML=`<style>${s.getStyles()}</style>`;let i=document.createElement("div");i.className="uc-radial-overlay",t.appendChild(i),this._center=document.createElement("div"),this._center.className="uc-radial-center",this._center.style.left=`${this._centerPos.x}px`,this._center.style.top=`${this._centerPos.y}px`,t.appendChild(this._center);let a=this._config.items||[],r=360/a.length;return a.forEach((o,n)=>{let c=this._createItem(o,n,r);t.appendChild(c)}),t}_createItem(e,t,i){let{radius:a,itemSize:r,startAngle:o}=this._options,c=(o+t*i)*Math.PI/180,l=this._centerPos.x+a*Math.cos(c),d=this._centerPos.y+a*Math.sin(c),u=document.createElement("button");return u.className="uc-radial-item",u.dataset.index=t,u.style.left=`${l}px`,u.style.top=`${d}px`,u.style.width=`${r}px`,u.style.height=`${r}px`,u.style.setProperty("--delay",`${t*30}ms`),e.color&&u.style.setProperty("--item-color",e.color),e.icon?u.innerHTML=`<ha-icon icon="${e.icon}"></ha-icon>`:e.label&&(u.innerHTML=`<span>${e.label.charAt(0)}</span>`),e.label&&(u.title=e.label),u}_handleMove(e){e.preventDefault();let t,i;e.touches?(t=e.touches[0].clientX,i=e.touches[0].clientY):(t=e.clientX,i=e.clientY);let a=t-this._centerPos.x,r=i-this._centerPos.y,o=Math.sqrt(a*a+r*r);if(this._center){let c=Math.min(20,Math.max(-20,a*.3)),l=Math.min(20,Math.max(-20,r*.3));this._center.style.transform=`translate(-50%, -50%) translate(${c}px, ${l}px)`}if(o>30){let c=(Math.atan2(r,a)*(180/Math.PI)-this._options.startAngle+360)%360,l=this._config.items||[],d=360/l.length,u=Math.round(c/d)%l.length;this._selectItem(u)}else this._selectItem(null)}_handleEnd(e){this.hide(!0)}_selectItem(e){var t,i;if(e!==this._selectedIndex){if(this._selectedIndex!==null){let a=(t=this._menu)==null?void 0:t.querySelector(`.uc-radial-item[data-index="${this._selectedIndex}"]`);a==null||a.classList.remove("selected")}if(this._selectedIndex=e,e!==null){let a=(i=this._menu)==null?void 0:i.querySelector(`.uc-radial-item[data-index="${e}"]`);a==null||a.classList.add("selected")}}}_executeItem(e){e.action&&J(this._hass,document.body,e.action),e.callback&&typeof e.callback=="function"&&e.callback(),e.event&&_(document.body,e.event,{item:e})}static getStyles(){return`
      .uc-radial-menu {
        position: fixed;
        inset: 0;
        z-index: 10001;
        pointer-events: none;
      }
      
      .uc-radial-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0);
        transition: background 0.2s ease;
        pointer-events: auto;
      }
      
      .uc-radial-menu.open .uc-radial-overlay {
        background: rgba(0, 0, 0, 0.3);
      }
      
      .uc-radial-center {
        position: absolute;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--ha-card-background, white);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
        pointer-events: none;
        opacity: 0;
      }
      
      .uc-radial-menu.open .uc-radial-center {
        opacity: 1;
      }
      
      .uc-radial-item {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--item-color, var(--primary-color));
        color: white;
        border: none;
        cursor: pointer;
        transform: translate(-50%, -50%) scale(0);
        transition: 
          transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
          box-shadow 0.2s ease;
        transition-delay: var(--delay, 0ms);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        pointer-events: auto;
      }
      
      .uc-radial-menu.open .uc-radial-item {
        transform: translate(-50%, -50%) scale(1);
      }
      
      .uc-radial-item.selected {
        transform: translate(-50%, -50%) scale(1.2);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      }
      
      .uc-radial-item ha-icon {
        --mdc-icon-size: 24px;
      }
      
      .uc-radial-item span {
        font-size: 18px;
        font-weight: 600;
      }
    `}destroy(){this.hide()}};var la={width:120,height:40,hours:24,strokeWidth:2,strokeColor:"var(--primary-color, #03a9f4)",fillColor:"var(--primary-color, #03a9f4)",fillOpacity:.1,showValue:!0,showMinMax:!1,animationDuration:200,position:"top",offset:8},lt=class{constructor(e,t={}){this._hass=e,this._config={...la,...t},this._previewElement=null,this._currentEntityId=null,this._historyCache=new Map,this._hideTimeout=null,this._debouncedShow=Q(this._showPreview.bind(this),150)}set hass(e){this._hass=e}_createPreviewElement(){let e=document.createElement("div");return e.className="uc-entity-preview",e.innerHTML=`
      <div class="uc-preview-header">
        <span class="uc-preview-name"></span>
        <span class="uc-preview-value"></span>
      </div>
      <div class="uc-preview-chart">
        <svg class="uc-preview-sparkline"></svg>
      </div>
      <div class="uc-preview-stats">
        <span class="uc-preview-min"></span>
        <span class="uc-preview-max"></span>
      </div>
    `,document.body.appendChild(e),e}attach(e,t){!e||!t||(e.addEventListener("mouseenter",i=>{this._currentEntityId=t,this._debouncedShow(e,t)}),e.addEventListener("mouseleave",()=>{this._hidePreview()}),e.addEventListener("mousemove",i=>{this._updatePosition(i)}))}detach(e){var i;if(!e)return;let t=e.cloneNode(!0);return(i=e.parentNode)==null||i.replaceChild(t,e),t}async _showPreview(e,t){var n,c;if(this._currentEntityId!==t)return;this._previewElement||(this._previewElement=this._createPreviewElement());let i=(c=(n=this._hass)==null?void 0:n.states)==null?void 0:c[t];if(!i)return;let a=this._previewElement.querySelector(".uc-preview-name"),r=this._previewElement.querySelector(".uc-preview-value");a.textContent=i.attributes.friendly_name||t,r.textContent=`${i.state} ${i.attributes.unit_of_measurement||""}`;let o=await this._fetchHistory(t);o&&o.length>0&&this._currentEntityId===t&&(this._renderSparkline(o),this._config.showMinMax&&this._renderStats(o)),this._positionPreview(e),this._previewElement.classList.add("visible")}_hidePreview(){this._currentEntityId=null,this._hideTimeout&&clearTimeout(this._hideTimeout),this._hideTimeout=setTimeout(()=>{this._previewElement&&this._previewElement.classList.remove("visible")},100)}async _fetchHistory(e){let t=this._historyCache.get(e);if(t&&Date.now()-t.timestamp<6e4)return t.data;try{let i=new Date,a=new Date(i.getTime()-this._config.hours*60*60*1e3),r=await this._hass.callApi("GET",`history/period/${a.toISOString()}?filter_entity_id=${e}&end_time=${i.toISOString()}&minimal_response&no_attributes`);if(r&&r[0]){let o=r[0].map(n=>({time:new Date(n.last_changed),value:parseFloat(n.state)})).filter(n=>!isNaN(n.value));return this._historyCache.set(e,{data:o,timestamp:Date.now()}),o}}catch(i){console.warn(`[EntityPreview] Failed to fetch history for ${e}:`,i)}return[]}_renderSparkline(e){let t=this._previewElement.querySelector(".uc-preview-sparkline");if(!t||e.length<2)return;let{width:i,height:a,strokeWidth:r,strokeColor:o,fillColor:n,fillOpacity:c}=this._config,l=e.map(q=>q.value),d=Math.min(...l),p=Math.max(...l)-d||1,h=r,g=i-h*2,b=a-h*2,y=e.map((q,ye)=>{let Ae=h+ye/(e.length-1)*g,ze=h+b-(q.value-d)/p*b;return{x:Ae,y:ze}}),I=y.map((q,ye)=>ye===0?`M ${q.x} ${q.y}`:`L ${q.x} ${q.y}`).join(" "),B=`${I} L ${y[y.length-1].x} ${a-h} L ${h} ${a-h} Z`;t.setAttribute("width",i),t.setAttribute("height",a),t.innerHTML=`
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${n};stop-opacity:${c}" />
          <stop offset="100%" style="stop-color:${n};stop-opacity:0" />
        </linearGradient>
      </defs>
      <path d="${B}" fill="url(#sparkline-gradient)" />
      <path d="${I}" fill="none" stroke="${o}" stroke-width="${r}" 
            stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${y[y.length-1].x}" cy="${y[y.length-1].y}" 
              r="3" fill="${o}" />
    `}_renderStats(e){let t=e.map(n=>n.value),i=Math.min(...t),a=Math.max(...t),r=this._previewElement.querySelector(".uc-preview-min"),o=this._previewElement.querySelector(".uc-preview-max");r.textContent=`Min: ${i.toFixed(1)}`,o.textContent=`Max: ${a.toFixed(1)}`,this._previewElement.querySelector(".uc-preview-stats").style.display="flex"}_positionPreview(e){if(!this._previewElement||!e)return;let t=e.getBoundingClientRect(),i=this._previewElement.getBoundingClientRect(),{position:a,offset:r}=this._config,o,n;switch(a){case"top":o=t.top-i.height-r,n=t.left+(t.width-i.width)/2;break;case"bottom":o=t.bottom+r,n=t.left+(t.width-i.width)/2;break;case"left":o=t.top+(t.height-i.height)/2,n=t.left-i.width-r;break;case"right":o=t.top+(t.height-i.height)/2,n=t.right+r;break}let c=window.innerWidth,l=window.innerHeight;n<8&&(n=8),n+i.width>c-8&&(n=c-i.width-8),o<8&&(o=t.bottom+r),o+i.height>l-8&&(o=t.top-i.height-r),this._previewElement.style.top=`${o}px`,this._previewElement.style.left=`${n}px`}_updatePosition(e){}clearCache(){this._historyCache.clear()}destroy(){this._hidePreview(),this._previewElement&&(this._previewElement.remove(),this._previewElement=null),this._historyCache.clear()}static getStyles(){return`
      .uc-entity-preview {
        position: fixed;
        z-index: 10000;
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: 12px;
        padding: 12px;
        box-shadow: 
          0 4px 20px rgba(0, 0, 0, 0.15),
          0 0 0 1px rgba(0, 0, 0, 0.05);
        opacity: 0;
        visibility: hidden;
        transform: translateY(4px) scale(0.95);
        transition: 
          opacity 0.2s ease,
          visibility 0.2s ease,
          transform 0.2s ease;
        pointer-events: none;
        min-width: 150px;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .uc-entity-preview.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) scale(1);
      }

      .uc-preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        gap: 12px;
      }

      .uc-preview-name {
        font-size: 12px;
        color: var(--secondary-text-color, #666);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100px;
      }

      .uc-preview-value {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color, #333);
        white-space: nowrap;
      }

      .uc-preview-chart {
        display: flex;
        justify-content: center;
      }

      .uc-preview-sparkline {
        display: block;
      }

      .uc-preview-stats {
        display: none;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 10px;
        color: var(--secondary-text-color, #666);
      }

      .uc-preview-min,
      .uc-preview-max {
        opacity: 0.7;
      }

      /* \u0422\u0451\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430 */
      @media (prefers-color-scheme: dark) {
        .uc-entity-preview {
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }
      }
    `}};var pe={INFO:"info",WARNING:"warning",ERROR:"error",SUCCESS:"success",CRITICAL:"critical"},Z={ABOVE:"above",BELOW:"below",EQUALS:"equals",NOT_EQUALS:"not_equals",BETWEEN:"between",OUTSIDE:"outside",CHANGED:"changed",UNAVAILABLE:"unavailable"},we={BADGE:"badge",BORDER:"border",PULSE:"pulse",SHAKE:"shake",NOTIFICATION:"notification",SOUND:"sound",SERVICE:"service"},da={debounce_time:1e3,history_size:10,auto_dismiss:5e3,sounds:{info:"/local/sounds/info.mp3",warning:"/local/sounds/warning.mp3",error:"/local/sounds/error.mp3",critical:"/local/sounds/critical.mp3"}},dt=class{constructor(e,t={}){this._hass=e,this._config={...da,...t},this._alerts=new Map,this._history=[],this._lastTriggerTime=new Map,this._entityStates=new Map,this._container=null,this._callbacks=new Set}set hass(e){let t=this._hass;this._hass=e,this._checkAlerts(t)}register(e,t){var a,r;let i={id:e,entity_id:t.entity_id,condition:t.condition||Z.ABOVE,value:t.value,value_min:t.value_min,value_max:t.value_max,type:t.type||pe.WARNING,message:t.message,actions:t.actions||[we.BADGE],service:t.service,service_data:t.service_data,enabled:t.enabled!==!1,triggered:!1};return this._alerts.set(e,i),(r=(a=this._hass)==null?void 0:a.states)!=null&&r[i.entity_id]&&this._entityStates.set(i.entity_id,this._hass.states[i.entity_id].state),e}unregister(e){this._alerts.delete(e),this._lastTriggerTime.delete(e)}setEnabled(e,t){let i=this._alerts.get(e);i&&(i.enabled=t,t||(i.triggered=!1))}_checkAlerts(e){var t,i;if(this._hass)for(let[a,r]of this._alerts){if(!r.enabled)continue;let o=r.entity_id,n=(t=this._hass.states)==null?void 0:t[o],c=(i=e==null?void 0:e.states)==null?void 0:i[o];if(!n)continue;let l=this._evaluateCondition(r,n,c);l&&!r.triggered?this._triggerAlert(r,n):!l&&r.triggered&&this._clearAlert(r)}}_evaluateCondition(e,t,i){let a=t.state,r=parseFloat(a),{condition:o,value:n,value_min:c,value_max:l}=e;switch(o){case Z.ABOVE:return!isNaN(r)&&r>n;case Z.BELOW:return!isNaN(r)&&r<n;case Z.EQUALS:return a===String(n)||r===n;case Z.NOT_EQUALS:return a!==String(n)&&r!==n;case Z.BETWEEN:return!isNaN(r)&&r>=c&&r<=l;case Z.OUTSIDE:return!isNaN(r)&&(r<c||r>l);case Z.CHANGED:return i&&i.state!==a;case Z.UNAVAILABLE:return a==="unavailable"||a==="unknown";default:return!1}}_triggerAlert(e,t){let i=this._lastTriggerTime.get(e.id),a=Date.now();if(!(i&&a-i<this._config.debounce_time)){e.triggered=!0,this._lastTriggerTime.set(e.id,a),this._addToHistory(e,t);for(let r of e.actions)this._executeAction(r,e,t);this._notifyCallbacks("triggered",e,t)}}_clearAlert(e){e.triggered=!1,this._notifyCallbacks("cleared",e)}_executeAction(e,t,i){switch(e){case we.NOTIFICATION:this._showNotification(t,i);break;case we.SOUND:this._playSound(t.type);break;case we.SERVICE:this._callService(t);break;default:break}}_showNotification(e,t){var r;let i=this._formatMessage(e.message,t);this._container||(this._container=document.createElement("div"),this._container.className="uc-alerts-container",document.body.appendChild(this._container));let a=document.createElement("div");a.className=`uc-alert-notification uc-alert-${e.type}`,a.innerHTML=`
      <div class="uc-alert-icon">${this._getIcon(e.type)}</div>
      <div class="uc-alert-content">
        <div class="uc-alert-title">${((r=t.attributes)==null?void 0:r.friendly_name)||e.entity_id}</div>
        <div class="uc-alert-message">${i}</div>
      </div>
      <button class="uc-alert-close">\xD7</button>
    `,a.querySelector(".uc-alert-close").addEventListener("click",()=>{a.classList.add("uc-alert-hiding"),setTimeout(()=>a.remove(),300)}),this._container.appendChild(a),this._config.auto_dismiss>0&&setTimeout(()=>{a.parentNode&&(a.classList.add("uc-alert-hiding"),setTimeout(()=>a.remove(),300))},this._config.auto_dismiss)}_playSound(e){var i;let t=(i=this._config.sounds)==null?void 0:i[e];if(t){let a=new Audio(t);a.volume=.5,a.play().catch(()=>{})}}_callService(e){if(!e.service||!this._hass)return;let[t,i]=e.service.split(".");t&&i&&this._hass.callService(t,i,e.service_data||{})}_formatMessage(e,t){var i,a;return e?e.replace(/\{state\}/g,t.state).replace(/\{entity_id\}/g,t.entity_id).replace(/\{friendly_name\}/g,((i=t.attributes)==null?void 0:i.friendly_name)||t.entity_id).replace(/\{unit\}/g,((a=t.attributes)==null?void 0:a.unit_of_measurement)||"").replace(/\{(\w+)\}/g,(r,o)=>{var n;return((n=t.attributes)==null?void 0:n[o])||r}):`\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435: ${t.state}`}_getIcon(e){return{[pe.INFO]:"\u{1F4A1}",[pe.WARNING]:"\u26A0\uFE0F",[pe.ERROR]:"\u274C",[pe.SUCCESS]:"\u2705",[pe.CRITICAL]:"\u{1F6A8}"}[e]||"\u{1F4E2}"}_addToHistory(e,t){this._history.unshift({id:e.id,type:e.type,entity_id:e.entity_id,state:t.state,message:this._formatMessage(e.message,t),timestamp:new Date}),this._history.length>this._config.history_size&&this._history.pop()}getHistory(){return[...this._history]}getActiveAlerts(){return Array.from(this._alerts.values()).filter(e=>e.triggered)}subscribe(e){return this._callbacks.add(e),()=>this._callbacks.delete(e)}_notifyCallbacks(e,t,i=null){for(let a of this._callbacks)try{a(e,t,i)}catch(r){console.error("[Alerts] Callback error:",r)}}getClassesForEntity(e){let t=[];for(let i of this._alerts.values())if(i.entity_id===e&&i.triggered){t.push("uc-alert-active"),t.push(`uc-alert-type-${i.type}`);for(let a of i.actions)[we.BORDER,we.PULSE,we.SHAKE].includes(a)&&t.push(`uc-alert-${a}`)}return t}clearAll(){for(let e of this._alerts.values())e.triggered=!1;this._history=[]}destroy(){this._alerts.clear(),this._history=[],this._lastTriggerTime.clear(),this._entityStates.clear(),this._callbacks.clear(),this._container&&(this._container.remove(),this._container=null)}static getStyles(){return`
      /* \u041A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439 */
      .uc-alerts-container {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 400px;
        pointer-events: none;
      }

      /* \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435 */
      .uc-alert-notification {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 12px;
        background: var(--ha-card-background, white);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        animation: uc-alert-slide-in 0.3s ease-out;
        pointer-events: auto;
        border-left: 4px solid;
      }

      .uc-alert-notification.uc-alert-hiding {
        animation: uc-alert-slide-out 0.3s ease-out forwards;
      }

      @keyframes uc-alert-slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes uc-alert-slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      /* \u0422\u0438\u043F\u044B \u043E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u0439 */
      .uc-alert-info {
        border-color: var(--info-color, #2196f3);
      }

      .uc-alert-warning {
        border-color: var(--warning-color, #ff9800);
      }

      .uc-alert-error {
        border-color: var(--error-color, #f44336);
      }

      .uc-alert-success {
        border-color: var(--success-color, #4caf50);
      }

      .uc-alert-critical {
        border-color: #d32f2f;
        background: linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, transparent 100%);
      }

      .uc-alert-icon {
        font-size: 20px;
        line-height: 1;
        flex-shrink: 0;
      }

      .uc-alert-content {
        flex: 1;
        min-width: 0;
      }

      .uc-alert-title {
        font-weight: 600;
        font-size: 14px;
        color: var(--primary-text-color);
        margin-bottom: 2px;
      }

      .uc-alert-message {
        font-size: 13px;
        color: var(--secondary-text-color);
        word-wrap: break-word;
      }

      .uc-alert-close {
        background: none;
        border: none;
        font-size: 20px;
        line-height: 1;
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 0;
        opacity: 0.5;
        transition: opacity 0.2s;
      }

      .uc-alert-close:hover {
        opacity: 1;
      }

      /* \u041A\u043B\u0430\u0441\u0441\u044B \u0434\u043B\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0441 \u043E\u043F\u043E\u0432\u0435\u0449\u0435\u043D\u0438\u044F\u043C\u0438 */
      .uc-alert-active {
        position: relative;
      }

      .uc-alert-border {
        box-shadow: 0 0 0 2px var(--error-color, #f44336) !important;
      }

      .uc-alert-type-warning.uc-alert-border {
        box-shadow: 0 0 0 2px var(--warning-color, #ff9800) !important;
      }

      .uc-alert-type-critical.uc-alert-border {
        box-shadow: 0 0 0 3px #d32f2f !important;
      }

      .uc-alert-pulse {
        animation: uc-pulse 2s infinite;
      }

      @keyframes uc-pulse {
        0%, 100% {
          box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
        }
      }

      .uc-alert-shake {
        animation: uc-shake 0.5s ease-in-out;
      }

      @keyframes uc-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `}};var S={TOGGLE:"toggle",TURN_ON:"turn_on",TURN_OFF:"turn_off",SERVICE:"service",MORE_INFO:"more-info",NAVIGATE:"navigate",URL:"url",FIRE_EVENT:"fire-event",SCRIPT:"script",SCENE:"scene"},ua={[S.TOGGLE]:"mdi:toggle-switch",[S.TURN_ON]:"mdi:power",[S.TURN_OFF]:"mdi:power-off",[S.SERVICE]:"mdi:cog",[S.MORE_INFO]:"mdi:information",[S.NAVIGATE]:"mdi:arrow-right",[S.URL]:"mdi:open-in-new",[S.FIRE_EVENT]:"mdi:broadcast",[S.SCRIPT]:"mdi:script-text",[S.SCENE]:"mdi:palette"},ut=class{constructor(e,t={}){this._hass=e,this._config=t,this._actions=[],this._element=null,this._confirmDialog=null}set hass(e){this._hass=e,this._updateStates()}setActions(e){this._actions=e.map((t,i)=>({id:t.id||`action_${i}`,type:t.type||S.SERVICE,name:t.name,icon:t.icon||ua[t.type]||"mdi:gesture-tap",entity_id:t.entity_id,service:t.service,service_data:t.service_data,target:t.target,navigation_path:t.navigation_path,url:t.url,url_new_tab:t.url_new_tab!==!1,event:t.event,event_data:t.event_data,confirmation:t.confirmation,show_state:t.show_state,disabled_when:t.disabled_when,hidden_when:t.hidden_when,color:t.color,active_color:t.active_color||"var(--primary-color)"}))}render(){this._element=document.createElement("div"),this._element.className="uc-quick-actions";for(let e of this._actions){let t=this._createActionButton(e);t&&this._element.appendChild(t)}return this._element}_createActionButton(e){if(this._evaluateCondition(e.hidden_when))return null;let t=document.createElement("button");t.className="uc-quick-action",t.dataset.actionId=e.id,this._evaluateCondition(e.disabled_when)&&(t.disabled=!0,t.classList.add("disabled"));let a=this._isActionActive(e);a&&t.classList.add("active");let r=document.createElement("ha-icon");if(r.setAttribute("icon",e.icon),t.appendChild(r),e.name){let o=document.createElement("span");o.className="uc-action-name",o.textContent=e.name,t.appendChild(o)}if(e.show_state&&e.entity_id){let o=document.createElement("span");o.className="uc-action-state",o.textContent=this._getEntityState(e.entity_id),t.appendChild(o)}return e.color&&t.style.setProperty("--action-color",e.color),a&&e.active_color&&t.style.setProperty("--action-color",e.active_color),t.addEventListener("click",o=>{o.stopPropagation(),this._executeAction(e)}),e.name&&(t.title=e.name),t}async _executeAction(e){if(!(e.confirmation&&!await this._showConfirmation(e.confirmation))){switch(e.type){case S.TOGGLE:this._executeToggle(e);break;case S.TURN_ON:this._executeTurnOn(e);break;case S.TURN_OFF:this._executeTurnOff(e);break;case S.SERVICE:this._executeService(e);break;case S.MORE_INFO:this._executeMoreInfo(e);break;case S.NAVIGATE:this._executeNavigate(e);break;case S.URL:this._executeUrl(e);break;case S.FIRE_EVENT:this._executeFireEvent(e);break;case S.SCRIPT:this._executeScript(e);break;case S.SCENE:this._executeScene(e);break}this._animateButton(e.id)}}_executeToggle(e){if(!e.entity_id)return;let t=e.entity_id.split(".")[0],i="toggle";["script","scene"].includes(t)&&(i="turn_on"),this._hass.callService(t,i,{entity_id:e.entity_id})}_executeTurnOn(e){if(!e.entity_id)return;let t=e.entity_id.split(".")[0];this._hass.callService(t,"turn_on",{entity_id:e.entity_id,...e.service_data})}_executeTurnOff(e){if(!e.entity_id)return;let t=e.entity_id.split(".")[0];this._hass.callService(t,"turn_off",{entity_id:e.entity_id})}_executeService(e){if(!e.service)return;let[t,i]=e.service.split(".");if(!t||!i)return;let a={...e.service_data};e.target?this._hass.callService(t,i,a,e.target):e.entity_id?(a.entity_id=e.entity_id,this._hass.callService(t,i,a)):this._hass.callService(t,i,a)}_executeMoreInfo(e){e.entity_id&&_(window,"hass-more-info",{entityId:e.entity_id})}_executeNavigate(e){e.navigation_path&&(history.pushState(null,"",e.navigation_path),_(window,"location-changed"))}_executeUrl(e){e.url&&(e.url_new_tab?window.open(e.url,"_blank"):window.location.href=e.url)}_executeFireEvent(e){e.event&&this._hass.callApi("POST","events/"+e.event,e.event_data||{})}_executeScript(e){e.entity_id&&this._hass.callService("script","turn_on",{entity_id:e.entity_id,...e.service_data})}_executeScene(e){e.entity_id&&this._hass.callService("scene","turn_on",{entity_id:e.entity_id})}async _showConfirmation(e){let t=typeof e=="string"?e:e.text||"\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B?";return new Promise(i=>{let a=document.createElement("div");a.className="uc-confirm-dialog",a.innerHTML=`
        <div class="uc-confirm-backdrop"></div>
        <div class="uc-confirm-content">
          <div class="uc-confirm-message">${t}</div>
          <div class="uc-confirm-buttons">
            <button class="uc-confirm-cancel">\u041E\u0442\u043C\u0435\u043D\u0430</button>
            <button class="uc-confirm-ok">OK</button>
          </div>
        </div>
      `,a.querySelector(".uc-confirm-backdrop").addEventListener("click",()=>{a.remove(),i(!1)}),a.querySelector(".uc-confirm-cancel").addEventListener("click",()=>{a.remove(),i(!1)}),a.querySelector(".uc-confirm-ok").addEventListener("click",()=>{a.remove(),i(!0)}),document.body.appendChild(a),setTimeout(()=>{a.querySelector(".uc-confirm-ok").focus()},10)})}_isActionActive(e){var i,a;if(!e.entity_id)return!1;let t=(a=(i=this._hass)==null?void 0:i.states)==null?void 0:a[e.entity_id];return t?["on","playing","home","open","unlocked"].includes(t.state):!1}_evaluateCondition(e){var t,i,a,r;if(!e)return!1;if(typeof e=="string"){let o=(i=(t=this._hass)==null?void 0:t.states)==null?void 0:i[e];return(o==null?void 0:o.state)==="on"}if(e.entity_id){let o=(r=(a=this._hass)==null?void 0:a.states)==null?void 0:r[e.entity_id];if(!o)return!1;if(e.state!==void 0)return o.state===String(e.state);if(e.state_not!==void 0)return o.state!==String(e.state_not);let n=parseFloat(o.state);if(e.above!==void 0)return n>e.above;if(e.below!==void 0)return n<e.below}return!1}_getEntityState(e){var a,r,o;let t=(r=(a=this._hass)==null?void 0:a.states)==null?void 0:r[e];if(!t)return"-";let i=(o=t.attributes)==null?void 0:o.unit_of_measurement;return i?`${t.state} ${i}`:t.state}_animateButton(e){if(!this._element)return;let t=this._element.querySelector(`[data-action-id="${e}"]`);t&&(t.classList.add("uc-action-clicked"),setTimeout(()=>{t.classList.remove("uc-action-clicked")},300))}_updateStates(){if(this._element)for(let e of this._actions){let t=this._element.querySelector(`[data-action-id="${e.id}"]`);if(!t)continue;let i=this._isActionActive(e);if(t.classList.toggle("active",i),e.show_state&&e.entity_id){let r=t.querySelector(".uc-action-state");r&&(r.textContent=this._getEntityState(e.entity_id))}let a=this._evaluateCondition(e.disabled_when);t.disabled=a,t.classList.toggle("disabled",a)}}destroy(){this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
      .uc-quick-actions {
        display: flex;
        gap: 4px;
        align-items: center;
        flex-wrap: wrap;
      }

      .uc-quick-action {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 6px 10px;
        border: none;
        border-radius: 8px;
        background: var(--action-color, var(--primary-background-color, rgba(0,0,0,0.05)));
        color: var(--primary-text-color);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 12px;
        min-width: 32px;
        min-height: 32px;
      }

      .uc-quick-action:hover:not(.disabled) {
        background: var(--action-color, var(--primary-color));
        color: var(--text-primary-color, white);
        transform: translateY(-1px);
      }

      .uc-quick-action:active:not(.disabled) {
        transform: translateY(0) scale(0.95);
      }

      .uc-quick-action.active {
        background: var(--action-color, var(--primary-color));
        color: var(--text-primary-color, white);
      }

      .uc-quick-action.disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .uc-quick-action.uc-action-clicked {
        animation: uc-action-ripple 0.3s ease;
      }

      @keyframes uc-action-ripple {
        0% { transform: scale(1); }
        50% { transform: scale(0.9); }
        100% { transform: scale(1); }
      }

      .uc-quick-action ha-icon {
        --mdc-icon-size: 18px;
      }

      .uc-action-name {
        white-space: nowrap;
      }

      .uc-action-state {
        font-size: 11px;
        opacity: 0.8;
        white-space: nowrap;
      }

      /* \u0414\u0438\u0430\u043B\u043E\u0433 \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u044F */
      .uc-confirm-dialog {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-confirm-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
      }

      .uc-confirm-content {
        position: relative;
        background: var(--ha-card-background, white);
        border-radius: 16px;
        padding: 24px;
        min-width: 280px;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: uc-confirm-appear 0.2s ease;
      }

      @keyframes uc-confirm-appear {
        from {
          transform: scale(0.9);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }

      .uc-confirm-message {
        font-size: 16px;
        color: var(--primary-text-color);
        margin-bottom: 20px;
        text-align: center;
      }

      .uc-confirm-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .uc-confirm-cancel,
      .uc-confirm-ok {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .uc-confirm-cancel {
        background: var(--secondary-background-color, #f0f0f0);
        color: var(--primary-text-color);
      }

      .uc-confirm-cancel:hover {
        background: var(--disabled-color, #ddd);
      }

      .uc-confirm-ok {
        background: var(--primary-color, #03a9f4);
        color: white;
      }

      .uc-confirm-ok:hover {
        filter: brightness(1.1);
      }

      .uc-confirm-ok:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
    `}};var z={COUNTDOWN:"countdown",COUNTUP:"countup",TIMER:"timer",ENTITY:"entity",REMAINING:"remaining"},ke={FULL:"full",COMPACT:"compact",HUMAN:"human",DIGITAL:"digital"},Di={mode:z.COUNTDOWN,format:ke.DIGITAL,show_icon:!0,show_label:!1,warning_threshold:60,danger_threshold:10,end_action:null,sound_on_end:!1,hide_when_inactive:!1},pt=class{constructor(e,t={}){this._hass=e,this._config={...Di,...t},this._element=null,this._intervalId=null,this._targetTime=null,this._startTime=null,this._isRunning=!1,this._isPaused=!1,this._remainingOnPause=0}set hass(e){this._hass=e,this._updateFromEntity()}setConfig(e){switch(this._config={...Di,...e},this._config.mode){case z.COUNTDOWN:this._config.target_time?this.setTargetTime(new Date(this._config.target_time)):this._config.duration&&this.setDuration(this._config.duration);break;case z.COUNTUP:this._config.start_time?this._startTime=new Date(this._config.start_time):this._startTime=new Date;break}}render(){return this._element=document.createElement("div"),this._element.className="uc-timer",this._element.innerHTML=`
      ${this._config.show_icon?'<ha-icon class="uc-timer-icon" icon="mdi:timer"></ha-icon>':""}
      ${this._config.show_label&&this._config.label?`<span class="uc-timer-label">${this._config.label}</span>`:""}
      <span class="uc-timer-value">--:--</span>
      ${this._config.show_controls?this._renderControls():""}
    `,this._config.show_controls&&this._bindControlEvents(),this._updateDisplay(),this._element}_renderControls(){return`
      <div class="uc-timer-controls">
        <button class="uc-timer-btn uc-timer-start" title="\u0421\u0442\u0430\u0440\u0442">
          <ha-icon icon="mdi:play"></ha-icon>
        </button>
        <button class="uc-timer-btn uc-timer-pause" title="\u041F\u0430\u0443\u0437\u0430">
          <ha-icon icon="mdi:pause"></ha-icon>
        </button>
        <button class="uc-timer-btn uc-timer-reset" title="\u0421\u0431\u0440\u043E\u0441">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </button>
      </div>
    `}_bindControlEvents(){let e=this._element.querySelector(".uc-timer-start"),t=this._element.querySelector(".uc-timer-pause"),i=this._element.querySelector(".uc-timer-reset");e&&e.addEventListener("click",a=>{a.stopPropagation(),this.start()}),t&&t.addEventListener("click",a=>{a.stopPropagation(),this.pause()}),i&&i.addEventListener("click",a=>{a.stopPropagation(),this.reset()})}setTargetTime(e){this._targetTime=e,this._updateDisplay()}setDuration(e){let t;if(typeof e=="string"){let i=e.split(":").map(Number);i.length===3?t=i[0]*3600+i[1]*60+i[2]:i.length===2?t=i[0]*60+i[1]:t=parseInt(e,10)}else t=e;this._targetTime=new Date(Date.now()+t*1e3),this._config.initial_duration=t}start(){if(!this._isRunning){if(this._isPaused&&this._remainingOnPause>0&&(this._targetTime=new Date(Date.now()+this._remainingOnPause*1e3),this._isPaused=!1,this._remainingOnPause=0),this._config.mode===z.TIMER&&this._config.entity_id){this._hass.callService("timer","start",{entity_id:this._config.entity_id});return}this._isRunning=!0,this._startTicking(),this._updateControlsState()}}pause(){if(this._isRunning){if(this._config.mode===z.TIMER&&this._config.entity_id){this._hass.callService("timer","pause",{entity_id:this._config.entity_id});return}this._isRunning=!1,this._isPaused=!0,this._remainingOnPause=this._getRemaining(),this._stopTicking(),this._updateControlsState()}}reset(){if(this._config.mode===z.TIMER&&this._config.entity_id){this._hass.callService("timer","cancel",{entity_id:this._config.entity_id});return}this._isRunning=!1,this._isPaused=!1,this._remainingOnPause=0,this._config.initial_duration&&this.setDuration(this._config.initial_duration),this._stopTicking(),this._updateDisplay(),this._updateControlsState()}_startTicking(){this._stopTicking(),this._intervalId=setInterval(()=>{this._tick()},1e3)}_stopTicking(){this._intervalId&&(clearInterval(this._intervalId),this._intervalId=null)}_tick(){let e=this._getRemaining();this._updateDisplay(),this._config.mode===z.COUNTDOWN&&e<=0&&this._onTimerEnd()}_onTimerEnd(){this._isRunning=!1,this._stopTicking(),this._config.sound_on_end&&this._playEndSound(),this._config.end_action&&this._executeEndAction(),_(this._element,"timer-end",{config:this._config}),this._element.classList.add("uc-timer-ended"),this._updateControlsState()}_playEndSound(){let e=this._config.end_sound||"/local/sounds/timer-end.mp3",t=new Audio(e);t.volume=.5,t.play().catch(()=>{})}_executeEndAction(){let e=this._config.end_action;if(e.service){let[t,i]=e.service.split(".");t&&i&&this._hass.callService(t,i,e.service_data||{})}}_getRemaining(){switch(this._config.mode){case z.COUNTDOWN:return this._targetTime?Math.max(0,Math.floor((this._targetTime-Date.now())/1e3)):0;case z.COUNTUP:return this._startTime?Math.floor((Date.now()-this._startTime)/1e3):0;case z.TIMER:case z.ENTITY:case z.REMAINING:return this._getRemainingFromEntity();default:return 0}}_getRemainingFromEntity(){var a,r,o,n;let e=this._config.entity_id;if(!e||!((r=(a=this._hass)==null?void 0:a.states)!=null&&r[e]))return 0;let t=this._hass.states[e];if(e.startsWith("timer.")){if(t.state!=="active")return 0;let c=new Date(t.attributes.finishes_at);return Math.max(0,Math.floor((c-Date.now())/1e3))}if((o=t.attributes)!=null&&o.remaining)return this._parseTimeString(t.attributes.remaining);if((n=t.attributes)!=null&&n.end_time){let c=new Date(t.attributes.end_time);return Math.max(0,Math.floor((c-Date.now())/1e3))}let i=parseFloat(t.state);return isNaN(i)?0:Math.floor(i)}_parseTimeString(e){let t=e.split(":").map(Number);return t.length===3?t[0]*3600+t[1]*60+t[2]:t.length===2?t[0]*60+t[1]:parseInt(e,10)||0}_updateFromEntity(){var i,a;if(!this._config.entity_id)return;let e=this._config.entity_id,t=(a=(i=this._hass)==null?void 0:i.states)==null?void 0:a[e];if(t){if(e.startsWith("timer.")){let r=t.state==="active",o=t.state==="paused";r&&!this._isRunning?(this._isRunning=!0,this._startTicking()):!r&&this._isRunning&&(this._isRunning=!1,this._stopTicking()),this._isPaused=o}this._updateDisplay(),this._updateControlsState()}}_updateDisplay(){if(!this._element)return;let e=this._getRemaining(),t=this._element.querySelector(".uc-timer-value");if(t&&(t.textContent=this._formatTime(e),this._element.classList.remove("uc-timer-warning","uc-timer-danger"),this._config.mode===z.COUNTDOWN&&(e<=this._config.danger_threshold&&e>0?this._element.classList.add("uc-timer-danger"):e<=this._config.warning_threshold&&this._element.classList.add("uc-timer-warning")),this._config.hide_when_inactive)){let i=!this._isRunning&&e===0;this._element.classList.toggle("uc-timer-hidden",i)}}_formatTime(e){let t=e<0;e=Math.abs(e);let i=Math.floor(e/86400),a=Math.floor(e%86400/3600),r=Math.floor(e%3600/60),o=e%60,n=t?"-":"";switch(this._config.format){case ke.FULL:let c=[];return i>0&&c.push(`${i}\u0434`),a>0&&c.push(`${a}\u0447`),r>0&&c.push(`${r}\u043C`),c.push(`${o}\u0441`),n+c.join(" ");case ke.COMPACT:return i>0?`${n}${i}:${this._pad(a)}:${this._pad(r)}:${this._pad(o)}`:a>0?`${n}${a}:${this._pad(r)}:${this._pad(o)}`:`${n}${r}:${this._pad(o)}`;case ke.HUMAN:return n+this._humanize(i,a,r,o);case ke.DIGITAL:default:return i>0?`${n}${i}\u0434 ${this._pad(a)}:${this._pad(r)}:${this._pad(o)}`:a>0?`${n}${this._pad(a)}:${this._pad(r)}:${this._pad(o)}`:`${n}${this._pad(r)}:${this._pad(o)}`}}_pad(e){return String(e).padStart(2,"0")}_humanize(e,t,i,a){return e>0?`\u0447\u0435\u0440\u0435\u0437 ${e} ${this._pluralize(e,"\u0434\u0435\u043D\u044C","\u0434\u043D\u044F","\u0434\u043D\u0435\u0439")}`:t>0?`\u0447\u0435\u0440\u0435\u0437 ${t} ${this._pluralize(t,"\u0447\u0430\u0441","\u0447\u0430\u0441\u0430","\u0447\u0430\u0441\u043E\u0432")}`:i>0?`\u0447\u0435\u0440\u0435\u0437 ${i} ${this._pluralize(i,"\u043C\u0438\u043D\u0443\u0442\u0443","\u043C\u0438\u043D\u0443\u0442\u044B","\u043C\u0438\u043D\u0443\u0442")}`:`\u0447\u0435\u0440\u0435\u0437 ${a} ${this._pluralize(a,"\u0441\u0435\u043A\u0443\u043D\u0434\u0443","\u0441\u0435\u043A\u0443\u043D\u0434\u044B","\u0441\u0435\u043A\u0443\u043D\u0434")}`}_pluralize(e,t,i,a){let r=e%10,o=e%100;return o>=11&&o<=19?a:r===1?t:r>=2&&r<=4?i:a}_updateControlsState(){if(!this._element||!this._config.show_controls)return;let e=this._element.querySelector(".uc-timer-start"),t=this._element.querySelector(".uc-timer-pause");e&&(e.style.display=this._isRunning?"none":""),t&&(t.style.display=this._isRunning?"":"none")}destroy(){this._stopTicking(),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
      .uc-timer {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
      }

      .uc-timer.uc-timer-hidden {
        display: none;
      }

      .uc-timer-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }

      .uc-timer-label {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .uc-timer-value {
        font-size: 16px;
        font-weight: 600;
        color: var(--primary-text-color);
        letter-spacing: 0.5px;
        transition: color 0.3s ease;
      }

      /* \u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F */
      .uc-timer.uc-timer-warning .uc-timer-value {
        color: var(--warning-color, #ff9800);
      }

      .uc-timer.uc-timer-danger .uc-timer-value {
        color: var(--error-color, #f44336);
        animation: uc-timer-blink 0.5s infinite;
      }

      .uc-timer.uc-timer-ended .uc-timer-value {
        color: var(--error-color, #f44336);
      }

      @keyframes uc-timer-blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      /* \u042D\u043B\u0435\u043C\u0435\u043D\u0442\u044B \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F */
      .uc-timer-controls {
        display: flex;
        gap: 4px;
        margin-left: 8px;
      }

      .uc-timer-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 6px;
        background: var(--primary-background-color, rgba(0,0,0,0.05));
        color: var(--primary-text-color);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .uc-timer-btn:hover {
        background: var(--primary-color);
        color: white;
      }

      .uc-timer-btn ha-icon {
        --mdc-icon-size: 16px;
      }

      /* \u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C */
      .uc-timer.compact {
        gap: 4px;
      }

      .uc-timer.compact .uc-timer-value {
        font-size: 14px;
      }

      .uc-timer.compact .uc-timer-icon {
        --mdc-icon-size: 16px;
      }

      /* \u0411\u043E\u043B\u044C\u0448\u043E\u0439 \u0440\u0435\u0436\u0438\u043C */
      .uc-timer.large .uc-timer-value {
        font-size: 24px;
      }

      .uc-timer.large .uc-timer-icon {
        --mdc-icon-size: 28px;
      }
    `}};var Ne={light:{on:{icon:"mdi:lightbulb",color:"var(--warning-color, #ffc107)"},off:{icon:"mdi:lightbulb-off",color:"var(--secondary-text-color)"},unavailable:{icon:"mdi:lightbulb-question",color:"var(--disabled-color)"}},switch:{on:{icon:"mdi:toggle-switch",color:"var(--primary-color)"},off:{icon:"mdi:toggle-switch-off",color:"var(--secondary-text-color)"}},lock:{locked:{icon:"mdi:lock",color:"var(--success-color, #4caf50)"},unlocked:{icon:"mdi:lock-open",color:"var(--warning-color, #ff9800)"},locking:{icon:"mdi:lock-clock",color:"var(--info-color)"},unlocking:{icon:"mdi:lock-clock",color:"var(--info-color)"}},binary_sensor_door:{on:{icon:"mdi:door-open",color:"var(--warning-color, #ff9800)"},off:{icon:"mdi:door-closed",color:"var(--success-color, #4caf50)"}},binary_sensor_window:{on:{icon:"mdi:window-open",color:"var(--warning-color, #ff9800)"},off:{icon:"mdi:window-closed",color:"var(--success-color, #4caf50)"}},binary_sensor_motion:{on:{icon:"mdi:motion-sensor",color:"var(--primary-color)"},off:{icon:"mdi:motion-sensor-off",color:"var(--secondary-text-color)"}},binary_sensor_occupancy:{on:{icon:"mdi:home-account",color:"var(--primary-color)"},off:{icon:"mdi:home-outline",color:"var(--secondary-text-color)"}},battery:{high:{icon:"mdi:battery-high",color:"var(--success-color, #4caf50)"},medium:{icon:"mdi:battery-medium",color:"var(--warning-color, #ff9800)"},low:{icon:"mdi:battery-low",color:"var(--error-color, #f44336)"},charging:{icon:"mdi:battery-charging",color:"var(--info-color)"}},climate:{heat:{icon:"mdi:fire",color:"#ff5722"},cool:{icon:"mdi:snowflake",color:"#2196f3"},heat_cool:{icon:"mdi:sun-snowflake",color:"var(--primary-color)"},auto:{icon:"mdi:thermostat-auto",color:"var(--success-color)"},dry:{icon:"mdi:water-percent",color:"#795548"},fan_only:{icon:"mdi:fan",color:"#00bcd4"},off:{icon:"mdi:power",color:"var(--secondary-text-color)"}},media_player:{playing:{icon:"mdi:play-circle",color:"var(--primary-color)"},paused:{icon:"mdi:pause-circle",color:"var(--warning-color)"},idle:{icon:"mdi:stop-circle",color:"var(--secondary-text-color)"},off:{icon:"mdi:power",color:"var(--secondary-text-color)"}},weather:{"clear-night":{icon:"mdi:weather-night",color:"#1a237e"},cloudy:{icon:"mdi:weather-cloudy",color:"#78909c"},fog:{icon:"mdi:weather-fog",color:"#90a4ae"},hail:{icon:"mdi:weather-hail",color:"#b0bec5"},lightning:{icon:"mdi:weather-lightning",color:"#ffc107"},"lightning-rainy":{icon:"mdi:weather-lightning-rainy",color:"#ff9800"},partlycloudy:{icon:"mdi:weather-partly-cloudy",color:"#8bc34a"},pouring:{icon:"mdi:weather-pouring",color:"#2196f3"},rainy:{icon:"mdi:weather-rainy",color:"#03a9f4"},snowy:{icon:"mdi:weather-snowy",color:"#e0e0e0"},"snowy-rainy":{icon:"mdi:weather-snowy-rainy",color:"#b3e5fc"},sunny:{icon:"mdi:weather-sunny",color:"#ffeb3b"},windy:{icon:"mdi:weather-windy",color:"#26a69a"},"windy-variant":{icon:"mdi:weather-windy-variant",color:"#4db6ac"}},person:{home:{icon:"mdi:home-account",color:"var(--success-color, #4caf50)"},not_home:{icon:"mdi:account-arrow-right",color:"var(--secondary-text-color)"},unknown:{icon:"mdi:account-question",color:"var(--warning-color)"}},vacuum:{cleaning:{icon:"mdi:robot-vacuum",color:"var(--primary-color)"},docked:{icon:"mdi:robot-vacuum",color:"var(--success-color)"},returning:{icon:"mdi:robot-vacuum",color:"var(--info-color)"},paused:{icon:"mdi:robot-vacuum",color:"var(--warning-color)"},idle:{icon:"mdi:robot-vacuum",color:"var(--secondary-text-color)"},error:{icon:"mdi:robot-vacuum-alert",color:"var(--error-color)"}}},ht=class{constructor(e,t={}){this._hass=e,this._config=t,this._customMappings=new Map}set hass(e){this._hass=e}register(e,t){this._customMappings.set(e,t)}unregister(e){this._customMappings.delete(e)}getIconAndColor(e,t={}){var l,d,u,p;if(!e||!((d=(l=this._hass)==null?void 0:l.states)!=null&&d[e]))return{icon:t.default_icon||"mdi:help-circle",color:null};let i=this._hass.states[e],a=i.state,r=e.split(".")[0],o=(u=i.attributes)==null?void 0:u.device_class,n=this._customMappings.get(e);if(n||(n=this._customMappings.get(`${r}.*`)),n||(r==="binary_sensor"&&o&&(n=Ne[`binary_sensor_${o}`]),n||(n=Ne[r])),!n)return this._getDefaultIcon(i,t);let c=n[a];if(!c&&n._ranges){let h=parseFloat(a);isNaN(h)||(c=this._findInRanges(n._ranges,h))}return!c&&r==="sensor"&&o==="battery"&&(c=this._getBatteryIcon(a)),c||(c=n.default||n.unknown),c?{icon:c.icon||t.default_icon||((p=i.attributes)==null?void 0:p.icon),color:c.color||null}:this._getDefaultIcon(i,t)}_findInRanges(e,t){for(let i of e){let{min:a=-1/0,max:r=1/0,...o}=i;if(t>=a&&t<=r)return o}return null}_getBatteryIcon(e){let t=parseInt(e,10);return isNaN(t)?Ne.battery.unavailable||{icon:"mdi:battery-unknown",color:"var(--secondary-text-color)"}:t<=10?{icon:"mdi:battery-10",color:"var(--error-color, #f44336)"}:t<=20?{icon:"mdi:battery-20",color:"var(--error-color, #f44336)"}:t<=30?{icon:"mdi:battery-30",color:"var(--warning-color, #ff9800)"}:t<=40?{icon:"mdi:battery-40",color:"var(--warning-color, #ff9800)"}:t<=50?{icon:"mdi:battery-50",color:"var(--warning-color, #ff9800)"}:t<=60?{icon:"mdi:battery-60",color:"var(--success-color, #4caf50)"}:t<=70?{icon:"mdi:battery-70",color:"var(--success-color, #4caf50)"}:t<=80?{icon:"mdi:battery-80",color:"var(--success-color, #4caf50)"}:t<=90?{icon:"mdi:battery-90",color:"var(--success-color, #4caf50)"}:{icon:"mdi:battery",color:"var(--success-color, #4caf50)"}}_getDefaultIcon(e,t){var r;let i=t.default_icon||((r=e.attributes)==null?void 0:r.icon)||this._getDomainIcon(e.entity_id),a=e.state==="on"||e.state==="home"?"var(--primary-color)":null;return{icon:i,color:a}}_getDomainIcon(e){let t=e.split(".")[0];return{automation:"mdi:robot",binary_sensor:"mdi:checkbox-marked-circle",button:"mdi:gesture-tap-button",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",cover:"mdi:window-shutter",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",input_boolean:"mdi:toggle-switch",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",lock:"mdi:lock",media_player:"mdi:cast",person:"mdi:account",scene:"mdi:palette",script:"mdi:script-text",sensor:"mdi:eye",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",vacuum:"mdi:robot-vacuum",weather:"mdi:weather-cloudy",zone:"mdi:map-marker"}[t]||"mdi:bookmark"}static createMappingFromConfig(e){let t={};for(let i of e)i.state!==void 0&&(t[i.state]={icon:i.icon,color:i.color}),(i.above!==void 0||i.below!==void 0)&&(t._ranges||(t._ranges=[]),t._ranges.push({min:i.above!=null?i.above:-1/0,max:i.below!=null?i.below:1/0,icon:i.icon,color:i.color}));return t}renderIcon(e,t={}){let{icon:i,color:a}=this.getIconAndColor(e,t),r=document.createElement("ha-icon");return r.setAttribute("icon",i),a&&(r.style.color=a),t.size&&r.style.setProperty("--mdc-icon-size",typeof t.size=="number"?`${t.size}px`:t.size),r}static getAvailablePresets(){return Object.keys(Ne)}static getStyles(){return`
      /* Icon Mapping \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u0441\u0442\u0438\u043B\u0435\u0439 */
      /* \u0426\u0432\u0435\u0442\u0430 \u043F\u0440\u0438\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F \u0438\u043D\u043B\u0430\u0439\u043D */
      
      .uc-mapped-icon {
        transition: color 0.3s ease;
      }
      
      .uc-mapped-icon.animate {
        animation: uc-icon-pulse 0.3s ease;
      }
      
      @keyframes uc-icon-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
    `}};var x={ENTRANCE:"entrance",EXIT:"exit",ATTENTION:"attention",STATE:"state",LOADING:"loading",CONTINUOUS:"continuous"},he={fadeIn:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,animation:"uc-fadeIn 0.3s ease-out forwards",description:"\u041F\u043B\u0430\u0432\u043D\u043E\u0435 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435"},fadeInUp:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,animation:"uc-fadeInUp 0.4s ease-out forwards",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043D\u0438\u0437\u0443"},fadeInDown:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,animation:"uc-fadeInDown 0.4s ease-out forwards",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0432\u0435\u0440\u0445\u0443"},fadeInLeft:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-fadeInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,animation:"uc-fadeInLeft 0.4s ease-out forwards",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043B\u0435\u0432\u0430"},fadeInRight:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-fadeInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `,animation:"uc-fadeInRight 0.4s ease-out forwards",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043F\u0440\u0430\u0432\u0430"},scaleIn:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-scaleIn {
        from {
          opacity: 0;
          transform: scale(0.8);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,animation:"uc-scaleIn 0.3s ease-out forwards",description:"\u041C\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0438 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0438"},slideInUp:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-slideInUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
    `,animation:"uc-slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",description:"\u0412\u044B\u0435\u0437\u0434 \u0441\u043D\u0438\u0437\u0443"},bounceIn:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-bounceIn {
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
    `,animation:"uc-bounceIn 0.6s ease-out forwards",description:"\u041F\u0440\u0443\u0436\u0438\u043D\u044F\u0449\u0435\u0435 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435"},flipInX:{category:x.ENTRANCE,keyframes:`
      @keyframes uc-flipInX {
        from {
          opacity: 0;
          transform: perspective(400px) rotateX(90deg);
        }
        to {
          opacity: 1;
          transform: perspective(400px) rotateX(0);
        }
      }
    `,animation:"uc-flipInX 0.5s ease-out forwards",description:"3D \u043F\u0435\u0440\u0435\u0432\u043E\u0440\u043E\u0442 \u043F\u043E X"},fadeOut:{category:x.EXIT,keyframes:`
      @keyframes uc-fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,animation:"uc-fadeOut 0.3s ease-out forwards",description:"\u041F\u043B\u0430\u0432\u043D\u043E\u0435 \u0438\u0441\u0447\u0435\u0437\u043D\u043E\u0432\u0435\u043D\u0438\u0435"},fadeOutDown:{category:x.EXIT,keyframes:`
      @keyframes uc-fadeOutDown {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(20px);
        }
      }
    `,animation:"uc-fadeOutDown 0.3s ease-out forwards",description:"\u0418\u0441\u0447\u0435\u0437\u043D\u043E\u0432\u0435\u043D\u0438\u0435 \u0432\u043D\u0438\u0437"},scaleOut:{category:x.EXIT,keyframes:`
      @keyframes uc-scaleOut {
        from {
          opacity: 1;
          transform: scale(1);
        }
        to {
          opacity: 0;
          transform: scale(0.8);
        }
      }
    `,animation:"uc-scaleOut 0.3s ease-out forwards",description:"\u0423\u043C\u0435\u043D\u044C\u0448\u0435\u043D\u0438\u0435 \u043F\u0440\u0438 \u0438\u0441\u0447\u0435\u0437\u043D\u043E\u0432\u0435\u043D\u0438\u0438"},pulse:{category:x.ATTENTION,keyframes:`
      @keyframes uc-pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
    `,animation:"uc-pulse 1s ease-in-out infinite",description:"\u041F\u0443\u043B\u044C\u0441\u0430\u0446\u0438\u044F"},shake:{category:x.ATTENTION,keyframes:`
      @keyframes uc-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `,animation:"uc-shake 0.5s ease-in-out",description:"\u0422\u0440\u044F\u0441\u043A\u0430"},wobble:{category:x.ATTENTION,keyframes:`
      @keyframes uc-wobble {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(-5deg); }
        30% { transform: rotate(3deg); }
        45% { transform: rotate(-3deg); }
        60% { transform: rotate(2deg); }
        75% { transform: rotate(-1deg); }
      }
    `,animation:"uc-wobble 0.8s ease-in-out",description:"\u041F\u043E\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435"},jello:{category:x.ATTENTION,keyframes:`
      @keyframes uc-jello {
        0%, 100% { transform: skewX(0deg) skewY(0deg); }
        11.1% { transform: skewX(-6.25deg) skewY(-6.25deg); }
        22.2% { transform: skewX(3.125deg) skewY(3.125deg); }
        33.3% { transform: skewX(-1.5625deg) skewY(-1.5625deg); }
        44.4% { transform: skewX(0.78125deg) skewY(0.78125deg); }
        55.5% { transform: skewX(-0.390625deg) skewY(-0.390625deg); }
      }
    `,animation:"uc-jello 0.9s both",description:"\u0416\u0435\u043B\u0435"},heartbeat:{category:x.ATTENTION,keyframes:`
      @keyframes uc-heartbeat {
        0%, 40%, 80%, 100% { transform: scale(1); }
        20%, 60% { transform: scale(1.15); }
      }
    `,animation:"uc-heartbeat 1.3s ease-in-out infinite",description:"\u0421\u0435\u0440\u0434\u0446\u0435\u0431\u0438\u0435\u043D\u0438\u0435"},flash:{category:x.ATTENTION,keyframes:`
      @keyframes uc-flash {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0; }
      }
    `,animation:"uc-flash 1s ease infinite",description:"\u041C\u0438\u0433\u0430\u043D\u0438\u0435"},rubberBand:{category:x.ATTENTION,keyframes:`
      @keyframes uc-rubberBand {
        0%, 100% { transform: scaleX(1); }
        30% { transform: scaleX(1.25) scaleY(0.75); }
        40% { transform: scaleX(0.75) scaleY(1.25); }
        50% { transform: scaleX(1.15) scaleY(0.85); }
        65% { transform: scaleX(0.95) scaleY(1.05); }
        75% { transform: scaleX(1.05) scaleY(0.95); }
      }
    `,animation:"uc-rubberBand 1s ease",description:"\u0420\u0435\u0437\u0438\u043D\u043A\u0430"},stateChange:{category:x.STATE,keyframes:`
      @keyframes uc-stateChange {
        0% { transform: scale(1); }
        30% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `,animation:"uc-stateChange 0.3s ease-out",description:"\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F"},colorPulse:{category:x.STATE,keyframes:`
      @keyframes uc-colorPulse {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3); }
      }
    `,animation:"uc-colorPulse 0.5s ease",description:"\u041F\u0443\u043B\u044C\u0441\u0430\u0446\u0438\u044F \u0446\u0432\u0435\u0442\u0430"},ripple:{category:x.STATE,keyframes:`
      @keyframes uc-ripple {
        0% {
          transform: scale(0);
          opacity: 0.5;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
    `,animation:"uc-ripple 0.6s linear",description:"\u0412\u043E\u043B\u043D\u0430 (ripple effect)"},spin:{category:x.LOADING,keyframes:`
      @keyframes uc-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,animation:"uc-spin 1s linear infinite",description:"\u0412\u0440\u0430\u0449\u0435\u043D\u0438\u0435"},bounce:{category:x.LOADING,keyframes:`
      @keyframes uc-bounce {
        0%, 100% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
    `,animation:"uc-bounce 1s infinite",description:"\u041F\u0440\u044B\u0436\u043A\u0438"},shimmer:{category:x.LOADING,keyframes:`
      @keyframes uc-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `,animation:"uc-shimmer 1.5s ease-in-out infinite",description:"\u041C\u0435\u0440\u0446\u0430\u043D\u0438\u0435 (\u0434\u043B\u044F skeleton)"},dots:{category:x.LOADING,keyframes:`
      @keyframes uc-dots {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `,animation:"uc-dots 1.4s ease-in-out infinite both",description:"\u0422\u043E\u0447\u043A\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438"},float:{category:x.CONTINUOUS,keyframes:`
      @keyframes uc-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `,animation:"uc-float 3s ease-in-out infinite",description:"\u041F\u043B\u0430\u0432\u0430\u043D\u0438\u0435"},glow:{category:x.CONTINUOUS,keyframes:`
      @keyframes uc-glow {
        0%, 100% { box-shadow: 0 0 5px currentColor; }
        50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
      }
    `,animation:"uc-glow 2s ease-in-out infinite",description:"\u0421\u0432\u0435\u0447\u0435\u043D\u0438\u0435"},wave:{category:x.CONTINUOUS,keyframes:`
      @keyframes uc-wave {
        0%, 100% { transform: rotate(0deg); }
        20%, 60% { transform: rotate(-25deg); }
        40%, 80% { transform: rotate(10deg); }
      }
    `,animation:"uc-wave 2.5s infinite",description:"\u041C\u0430\u0448\u0443\u0449\u0430\u044F \u0440\u0443\u043A\u0430"}},mt=class{constructor(){this._injectedStyles=new Set}getPreset(e){return he[e]||null}getByCategory(e){let t={};for(let[i,a]of Object.entries(he))a.category===e&&(t[i]=a);return t}apply(e,t,i={}){let a=he[t];if(!a){console.warn(`[AnimationPresets] Unknown preset: ${t}`);return}this._injectKeyframes(t,a.keyframes);let r=a.animation;i.duration&&(r=r.replace(/\d+\.?\d*s/,`${i.duration}s`)),i.delay&&(r+=` ${i.delay}s`),i.iterations&&(r=r.replace(/infinite|1/,String(i.iterations))),e.style.animation=r,i.onComplete&&e.addEventListener("animationend",i.onComplete,{once:!0}),i.removeOnComplete!==!1&&e.addEventListener("animationend",()=>{e.style.animation=""},{once:!0})}stagger(e,t,i={}){let a=i.staggerDelay||.05,r=i.startDelay||0;Array.from(e).forEach((o,n)=>{this.apply(o,t,{...i,delay:r+n*a})})}_injectKeyframes(e,t){if(this._injectedStyles.has(e))return;let i=document.createElement("style");i.textContent=t,i.setAttribute("data-uc-animation",e),document.head.appendChild(i),this._injectedStyles.add(e)}static getAllStyles(){let e=[];for(let[t,i]of Object.entries(he))e.push(i.keyframes),e.push(`
        .uc-animate-${t} {
          animation: ${i.animation};
        }
      `);return e.push(`
      /* \u0423\u0442\u0438\u043B\u0438\u0442\u0430\u0440\u043D\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u044B \u0434\u043B\u044F \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u0439 */
      .uc-animate-delay-100 { animation-delay: 0.1s; }
      .uc-animate-delay-200 { animation-delay: 0.2s; }
      .uc-animate-delay-300 { animation-delay: 0.3s; }
      .uc-animate-delay-400 { animation-delay: 0.4s; }
      .uc-animate-delay-500 { animation-delay: 0.5s; }

      .uc-animate-duration-fast { animation-duration: 0.2s; }
      .uc-animate-duration-normal { animation-duration: 0.4s; }
      .uc-animate-duration-slow { animation-duration: 0.8s; }

      .uc-animate-ease-linear { animation-timing-function: linear; }
      .uc-animate-ease-in { animation-timing-function: ease-in; }
      .uc-animate-ease-out { animation-timing-function: ease-out; }
      .uc-animate-ease-in-out { animation-timing-function: ease-in-out; }
      .uc-animate-ease-spring { animation-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55); }

      .uc-animate-infinite { animation-iteration-count: infinite; }
      .uc-animate-once { animation-iteration-count: 1; }
      .uc-animate-twice { animation-iteration-count: 2; }

      .uc-animate-paused { animation-play-state: paused; }
      .uc-animate-running { animation-play-state: running; }

      /* \u0420\u0435\u0441\u043F\u0435\u043A\u0442 prefers-reduced-motion */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `),e.join(`
`)}static getPresetNames(){return Object.keys(he)}static getDescription(e){var t;return((t=he[e])==null?void 0:t.description)||""}};var me={IMMEDIATE:"immediate",THROTTLED:"throttled",BATCHED:"batched",ON_DEMAND:"on_demand",VISIBLE_ONLY:"visible_only"},re={CRITICAL:0,HIGH:1,NORMAL:2,LOW:3,BACKGROUND:4},pa={strategy:me.THROTTLED,throttleMs:100,batchDelayMs:50,maxBatchSize:50,visibilityThreshold:.1,priorityThrottles:{[re.CRITICAL]:0,[re.HIGH]:50,[re.NORMAL]:100,[re.LOW]:250,[re.BACKGROUND]:500}},Be=class{constructor(){this._config={...pa},this._subscribers=new Map,this._pendingUpdates=new Map,this._batchTimeout=null,this._lastUpdateTime=new Map,this._visibilityObserver=null,this._visibleElements=new WeakSet,this._metrics={totalUpdates:0,throttledUpdates:0,batchedUpdates:0,skippedUpdates:0}}configure(e){this._config={...this._config,...e}}subscribe(e,t,i={}){let a={callback:t,priority:i.priority!=null?i.priority:re.NORMAL,element:i.element,strategy:i.strategy!=null?i.strategy:this._config.strategy};return this._subscribers.has(e)||this._subscribers.set(e,new Set),this._subscribers.get(e).add(a),i.element&&a.strategy===me.VISIBLE_ONLY&&this._observeVisibility(i.element),()=>{this._unsubscribe(e,a)}}_unsubscribe(e,t){let i=this._subscribers.get(e);i&&(i.delete(t),i.size===0&&this._subscribers.delete(e)),t.element&&this._unobserveVisibility(t.element)}processHassUpdate(e,t){var a,r;if(!(t!=null&&t.states))return;let i=[];for(let o of this._subscribers.keys()){let n=(a=e==null?void 0:e.states)==null?void 0:a[o],c=(r=t==null?void 0:t.states)==null?void 0:r[o];this._hasStateChanged(n,c)&&i.push({entityId:o,newState:c})}if(i.length!==0)switch(this._config.strategy){case me.IMMEDIATE:this._processImmediate(i);break;case me.THROTTLED:this._processThrottled(i);break;case me.BATCHED:this._processBatched(i);break;default:this._processThrottled(i)}}_hasStateChanged(e,t){return!e&&t||e&&!t?!0:!e&&!t?!1:e.state!==t.state||e.last_changed!==t.last_changed}_processImmediate(e){for(let{entityId:t,newState:i}of e)this._notifySubscribers(t,i);this._metrics.totalUpdates+=e.length}_processThrottled(e){let t=Date.now();for(let{entityId:i,newState:a}of e){let r=this._subscribers.get(i);if(!r)continue;let o=re.BACKGROUND;for(let l of r)l.priority<o&&(o=l.priority);let n=this._config.priorityThrottles[o]!=null?this._config.priorityThrottles[o]:this._config.throttleMs,c=this._lastUpdateTime.get(i)||0;t-c>=n?(this._notifySubscribers(i,a),this._lastUpdateTime.set(i,t),this._metrics.totalUpdates++):(this._pendingUpdates.set(i,a),this._scheduleDeferredUpdate(i,n-(t-c)),this._metrics.throttledUpdates++)}}_processBatched(e){for(let{entityId:t,newState:i}of e)this._pendingUpdates.set(t,i);this._metrics.batchedUpdates+=e.length,this._batchTimeout||(this._batchTimeout=setTimeout(()=>{this._processBatch()},this._config.batchDelayMs))}_processBatch(){this._batchTimeout=null;let e=Array.from(this._pendingUpdates.entries()).slice(0,this._config.maxBatchSize);requestAnimationFrame(()=>{for(let[t,i]of e)this._notifySubscribers(t,i),this._pendingUpdates.delete(t);this._metrics.totalUpdates+=e.length}),this._pendingUpdates.size>0&&(this._batchTimeout=setTimeout(()=>{this._processBatch()},this._config.batchDelayMs))}_scheduleDeferredUpdate(e,t){setTimeout(()=>{let i=this._pendingUpdates.get(e);i&&(this._notifySubscribers(e,i),this._pendingUpdates.delete(e),this._lastUpdateTime.set(e,Date.now()))},t)}_notifySubscribers(e,t){let i=this._subscribers.get(e);if(i)for(let a of i){if(a.strategy===me.VISIBLE_ONLY&&a.element&&!this._visibleElements.has(a.element)){this._metrics.skippedUpdates++;continue}try{a.callback(t)}catch(r){console.error(`[WebSocketOptimizer] Callback error for ${e}:`,r)}}}_observeVisibility(e){this._visibilityObserver||(this._visibilityObserver=new IntersectionObserver(t=>{for(let i of t)i.isIntersecting?this._visibleElements.add(i.target):this._visibleElements.delete(i.target)},{threshold:this._config.visibilityThreshold})),this._visibilityObserver.observe(e)}_unobserveVisibility(e){this._visibilityObserver&&this._visibilityObserver.unobserve(e),this._visibleElements.delete(e)}forceUpdate(e,t){this._notifySubscribers(e,t),this._lastUpdateTime.set(e,Date.now())}flush(){this._batchTimeout&&(clearTimeout(this._batchTimeout),this._batchTimeout=null);for(let[e,t]of this._pendingUpdates)this._notifySubscribers(e,t);this._pendingUpdates.clear()}getMetrics(){return{...this._metrics,activeSubscriptions:this._subscribers.size,pendingUpdates:this._pendingUpdates.size,efficiency:this._metrics.totalUpdates>0?((this._metrics.totalUpdates-this._metrics.throttledUpdates)/this._metrics.totalUpdates*100).toFixed(1)+"%":"100%"}}resetMetrics(){this._metrics={totalUpdates:0,throttledUpdates:0,batchedUpdates:0,skippedUpdates:0}}destroy(){this.flush(),this._subscribers.clear(),this._lastUpdateTime.clear(),this._visibilityObserver&&(this._visibilityObserver.disconnect(),this._visibilityObserver=null)}},ri=null;function zi(){return ri||(ri=new Be),ri}function Ui(s,e=100){return Ie(s,e)}function Pi(s,e=100){return Q(s,e)}var F={STATE_CHANGE:"uc-link-state-change",EXPAND:"uc-link-expand",COLLAPSE:"uc-link-collapse",TOGGLE:"uc-link-toggle",TAB_CHANGE:"uc-link-tab-change",CUSTOM:"uc-link-custom"},Me={MIRROR:"mirror",EXPAND_ONLY:"expand_only",COLLAPSE_ONLY:"collapse_only",INVERSE:"inverse",CUSTOM:"custom"},ni=class{constructor(){this._groups=new Map,this._masters=new Map,this._slaves=new Map,this._listeners=new Map}register(e,t,i={}){let{role:a="slave",syncMode:r=Me.MIRROR}=i;this._groups.has(e)||(this._groups.set(e,new Set),this._slaves.set(e,new Set)),this._groups.get(e).add(t),a==="master"?(this._masters.set(e,t),this._setupMasterListeners(e,t)):(this._slaves.get(e).add(t),this._setupSlaveListeners(e,t,r)),t._ucLinkData={groupId:e,role:a,syncMode:r}}unregister(e,t){let i=this._groups.get(e);i&&(i.delete(t),i.size===0&&(this._groups.delete(e),this._masters.delete(e),this._slaves.delete(e))),this._removeListeners(t),delete t._ucLinkData}_setupMasterListeners(e,t){let i=new Map,a=l=>{this._broadcastToSlaves(e,F.STATE_CHANGE,l.detail)},r=()=>{this._broadcastToSlaves(e,F.EXPAND,{})},o=()=>{this._broadcastToSlaves(e,F.COLLAPSE,{})},n=l=>{this._broadcastToSlaves(e,F.TOGGLE,l.detail)},c=l=>{this._broadcastToSlaves(e,F.TAB_CHANGE,l.detail)};t.addEventListener("uc-state-changed",a),t.addEventListener("uc-expanded",r),t.addEventListener("uc-collapsed",o),t.addEventListener("uc-toggled",n),t.addEventListener("uc-tab-changed",c),i.set("uc-state-changed",a),i.set("uc-expanded",r),i.set("uc-collapsed",o),i.set("uc-toggled",n),i.set("uc-tab-changed",c),this._listeners.set(t,i)}_setupSlaveListeners(e,t,i){let a=new Map,r=o=>{let{type:n,detail:c}=o;o.target!==t&&this._applySyncAction(t,n,c,i)};for(let o of Object.values(F)){let n=c=>{var l;((l=c.detail)==null?void 0:l.groupId)===e&&r({type:o,detail:c.detail})};window.addEventListener(o,n),a.set(o,n)}this._listeners.set(t,a)}_removeListeners(e){let t=this._listeners.get(e);if(!t)return;let i=e._ucLinkData;if((i==null?void 0:i.role)==="master")for(let[a,r]of t)e.removeEventListener(a,r);else for(let[a,r]of t)window.removeEventListener(a,r);this._listeners.delete(e)}_broadcastToSlaves(e,t,i){_(window,t,{...i,groupId:e})}_applySyncAction(e,t,i,a){var r,o,n,c,l;if(!(a===Me.EXPAND_ONLY&&t!==F.EXPAND)&&!(a===Me.COLLAPSE_ONLY&&t!==F.COLLAPSE))switch(t){case F.EXPAND:a===Me.INVERSE?(r=e._collapse)==null||r.call(e):(o=e._expand)==null||o.call(e);break;case F.COLLAPSE:a===Me.INVERSE?(n=e._expand)==null||n.call(e):(c=e._collapse)==null||c.call(e);break;case F.TOGGLE:(l=e._toggle)==null||l.call(e);break;case F.TAB_CHANGE:e._setActiveTab&&i.tabIndex!==void 0&&e._setActiveTab(i.tabIndex);break;case F.STATE_CHANGE:e._handleLinkedStateChange&&e._handleLinkedStateChange(i);break}}getGroup(e){return this._groups.get(e)||new Set}getMaster(e){return this._masters.get(e)}getSlaves(e){return this._slaves.get(e)||new Set}hasGroup(e){return this._groups.has(e)}sendToGroup(e,t,i={}){_(window,F.CUSTOM,{groupId:e,eventName:t,data:i})}clear(){for(let[e,t]of this._groups)for(let i of t)this.unregister(e,i)}},oi=null;function ha(){return oi||(oi=new ni),oi}var ft=class{constructor(e,t={}){this._card=e,this._config=t,this._registry=ha()}setConfig(e){this._config.group_id&&this._registry.unregister(this._config.group_id,this._card),this._config=e,e.group_id&&this._registry.register(e.group_id,this._card,{role:e.role||"slave",syncMode:e.sync_mode||Me.MIRROR})}broadcast(e,t={}){this._config.group_id&&this._config.role==="master"&&_(this._card,e,t)}sendCustomEvent(e,t={}){this._config.group_id&&this._registry.sendToGroup(this._config.group_id,e,t)}isMaster(){return this._config.role==="master"}getGroupInfo(){let e=this._config.group_id;return e?{id:e,totalCards:this._registry.getGroup(e).size,hasMaster:!!this._registry.getMaster(e),slavesCount:this._registry.getSlaves(e).size}:null}destroy(){this._config.group_id&&this._registry.unregister(this._config.group_id,this._card)}};var oe={DOMAIN:"domain",AREA:"area",DEVICE_CLASS:"device_class",DEVICE:"device",FLOOR:"floor",LABEL:"label",STATE:"state",CUSTOM:"custom"},je={ALPHABETICAL:"alphabetical",COUNT_DESC:"count_desc",COUNT_ASC:"count_asc",PRIORITY:"priority",CUSTOM:"custom"},ma={automation:"mdi:robot",binary_sensor:"mdi:checkbox-marked-circle",button:"mdi:gesture-tap-button",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",cover:"mdi:window-shutter",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",input_boolean:"mdi:toggle-switch",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",lock:"mdi:lock",media_player:"mdi:cast",number:"mdi:ray-vertex",person:"mdi:account",scene:"mdi:palette",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",update:"mdi:package-up",vacuum:"mdi:robot-vacuum",weather:"mdi:weather-cloudy",zone:"mdi:map-marker"},fa={automation:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u0438",binary_sensor:"\u0411\u0438\u043D\u0430\u0440\u043D\u044B\u0435 \u0441\u0435\u043D\u0441\u043E\u0440\u044B",button:"\u041A\u043D\u043E\u043F\u043A\u0438",calendar:"\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0438",camera:"\u041A\u0430\u043C\u0435\u0440\u044B",climate:"\u041A\u043B\u0438\u043C\u0430\u0442",cover:"\u0428\u0442\u043E\u0440\u044B/\u0416\u0430\u043B\u044E\u0437\u0438",device_tracker:"\u0422\u0440\u0435\u043A\u0435\u0440\u044B",fan:"\u0412\u0435\u043D\u0442\u0438\u043B\u044F\u0442\u043E\u0440\u044B",group:"\u0413\u0440\u0443\u043F\u043F\u044B",input_boolean:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u0438",input_number:"\u0427\u0438\u0441\u043B\u0430",input_select:"\u0421\u043F\u0438\u0441\u043A\u0438 \u0432\u044B\u0431\u043E\u0440\u0430",input_text:"\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0435 \u043F\u043E\u043B\u044F",light:"\u041E\u0441\u0432\u0435\u0449\u0435\u043D\u0438\u0435",lock:"\u0417\u0430\u043C\u043A\u0438",media_player:"\u041C\u0435\u0434\u0438\u0430\u043F\u043B\u0435\u0435\u0440\u044B",number:"\u0427\u0438\u0441\u043B\u0430",person:"\u041B\u044E\u0434\u0438",scene:"\u0421\u0446\u0435\u043D\u044B",script:"\u0421\u043A\u0440\u0438\u043F\u0442\u044B",select:"\u0421\u043F\u0438\u0441\u043A\u0438 \u0432\u044B\u0431\u043E\u0440\u0430",sensor:"\u0421\u0435\u043D\u0441\u043E\u0440\u044B",sun:"\u0421\u043E\u043B\u043D\u0446\u0435",switch:"\u0412\u044B\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u0438",timer:"\u0422\u0430\u0439\u043C\u0435\u0440\u044B",update:"\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F",vacuum:"\u041F\u044B\u043B\u0435\u0441\u043E\u0441\u044B",weather:"\u041F\u043E\u0433\u043E\u0434\u0430",zone:"\u0417\u043E\u043D\u044B"},Hi={strategy:oe.DOMAIN,sort:je.ALPHABETICAL,collapsed_by_default:!1,show_empty_groups:!1,show_counts:!0,max_items_per_group:0,exclude_domains:[],exclude_entities:[],include_entities:[],priority_order:[],custom_groups:{}},gt=class{constructor(e,t={}){this._hass=e,this._config={...Hi,...t},this._cache=null,this._cacheTimestamp=0}set hass(e){this._hass=e,this._invalidateCache()}setConfig(e){this._config={...Hi,...e},this._invalidateCache()}getGroups(e=null){if(this._cache&&Date.now()-this._cacheTimestamp<1e3)return this._cache;let t=this._getFilteredEntities(e),i;switch(this._config.strategy){case oe.DOMAIN:i=this._groupByDomain(t);break;case oe.AREA:i=this._groupByArea(t);break;case oe.DEVICE_CLASS:i=this._groupByDeviceClass(t);break;case oe.DEVICE:i=this._groupByDevice(t);break;case oe.FLOOR:i=this._groupByFloor(t);break;case oe.LABEL:i=this._groupByLabel(t);break;case oe.STATE:i=this._groupByState(t);break;case oe.CUSTOM:i=this._groupByCustomRules(t);break;default:i=this._groupByDomain(t)}return i=this._sortGroups(i),this._config.max_items_per_group>0&&(i=i.map(a=>({...a,entities:a.entities.slice(0,this._config.max_items_per_group),hasMore:a.entities.length>this._config.max_items_per_group}))),this._cache=i,this._cacheTimestamp=Date.now(),i}_getFilteredEntities(e){var a,r;let t=((a=this._hass)==null?void 0:a.states)||{},i;return e?i=e.filter(o=>t[o]).map(o=>({entity_id:o,...t[o]})):((r=this._config.include_entities)==null?void 0:r.length)>0?i=this._config.include_entities.filter(o=>t[o]).map(o=>({entity_id:o,...t[o]})):i=Object.entries(t).map(([o,n])=>({entity_id:o,...n})),i.filter(o=>{let n=o.entity_id.split(".")[0];return!(this._config.exclude_domains.includes(n)||this._config.exclude_entities.includes(o.entity_id))})}_groupByDomain(e){let t=new Map;for(let i of e){let a=i.entity_id.split(".")[0];t.has(a)||t.set(a,{id:a,name:fa[a]||this._capitalize(a),icon:ma[a]||"mdi:bookmark",entities:[],collapsed:this._config.collapsed_by_default}),t.get(a).entities.push(i)}return Array.from(t.values()).filter(i=>this._config.show_empty_groups||i.entities.length>0)}_groupByArea(e){var o,n,c;let t=new Map,i=((o=this._hass)==null?void 0:o.areas)||{},a=((n=this._hass)==null?void 0:n.entities)||{},r=((c=this._hass)==null?void 0:c.devices)||{};t.set("_no_area",{id:"_no_area",name:"\u0411\u0435\u0437 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",icon:"mdi:help-circle-outline",entities:[],collapsed:this._config.collapsed_by_default});for(let l of e){let d=null,u=a[l.entity_id];if(u!=null&&u.area_id)d=u.area_id;else if(u!=null&&u.device_id){let p=r[u.device_id];p!=null&&p.area_id&&(d=p.area_id)}d&&i[d]?(t.has(d)||t.set(d,{id:d,name:i[d].name,icon:i[d].icon||"mdi:home-floor-0",entities:[],collapsed:this._config.collapsed_by_default}),t.get(d).entities.push(l)):t.get("_no_area").entities.push(l)}return Array.from(t.values()).filter(l=>this._config.show_empty_groups||l.entities.length>0)}_groupByDeviceClass(e){var i;let t=new Map;for(let a of e){let r=((i=a.attributes)==null?void 0:i.device_class)||"_none";t.has(r)||t.set(r,{id:r,name:r==="_none"?"\u0411\u0435\u0437 \u043A\u043B\u0430\u0441\u0441\u0430":this._capitalize(r),icon:this._getDeviceClassIcon(r),entities:[],collapsed:this._config.collapsed_by_default}),t.get(r).entities.push(a)}return Array.from(t.values()).filter(a=>this._config.show_empty_groups||a.entities.length>0)}_groupByDevice(e){var r,o;let t=new Map,i=((r=this._hass)==null?void 0:r.entities)||{},a=((o=this._hass)==null?void 0:o.devices)||{};t.set("_no_device",{id:"_no_device",name:"\u0411\u0435\u0437 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",icon:"mdi:help-circle-outline",entities:[],collapsed:this._config.collapsed_by_default});for(let n of e){let c=i[n.entity_id],l=c==null?void 0:c.device_id;if(l&&a[l]){let d=a[l];t.has(l)||t.set(l,{id:l,name:d.name||d.name_by_user||l,icon:"mdi:devices",manufacturer:d.manufacturer,model:d.model,entities:[],collapsed:this._config.collapsed_by_default}),t.get(l).entities.push(n)}else t.get("_no_device").entities.push(n)}return Array.from(t.values()).filter(n=>this._config.show_empty_groups||n.entities.length>0)}_groupByFloor(e){var n,c,l,d,u;let t=new Map,i=((n=this._hass)==null?void 0:n.areas)||{},a=((c=this._hass)==null?void 0:c.floors)||{},r=((l=this._hass)==null?void 0:l.entities)||{},o=((d=this._hass)==null?void 0:d.devices)||{};t.set("_no_floor",{id:"_no_floor",name:"\u0411\u0435\u0437 \u044D\u0442\u0430\u0436\u0430",icon:"mdi:help-circle-outline",entities:[],collapsed:this._config.collapsed_by_default});for(let p of e){let h=null,g=r[p.entity_id],b=g==null?void 0:g.area_id;if(!b&&(g!=null&&g.device_id)){let y=o[g.device_id];b=y==null?void 0:y.area_id}b&&((u=i[b])!=null&&u.floor_id)&&(h=i[b].floor_id),h&&a[h]?(t.has(h)||t.set(h,{id:h,name:a[h].name,icon:a[h].icon||"mdi:home-floor-0",level:a[h].level,entities:[],collapsed:this._config.collapsed_by_default}),t.get(h).entities.push(p)):t.get("_no_floor").entities.push(p)}return Array.from(t.values()).filter(p=>this._config.show_empty_groups||p.entities.length>0)}_groupByLabel(e){var r,o;let t=new Map,i=((r=this._hass)==null?void 0:r.labels)||{},a=((o=this._hass)==null?void 0:o.entities)||{};t.set("_no_label",{id:"_no_label",name:"\u0411\u0435\u0437 \u043C\u0435\u0442\u043A\u0438",icon:"mdi:label-off-outline",entities:[],collapsed:this._config.collapsed_by_default});for(let n of e){let c=a[n.entity_id],l=(c==null?void 0:c.labels)||[];if(l.length===0)t.get("_no_label").entities.push(n);else for(let d of l){if(!t.has(d)){let u=i[d]||{name:d};t.set(d,{id:d,name:u.name,icon:u.icon||"mdi:label",color:u.color,entities:[],collapsed:this._config.collapsed_by_default})}t.get(d).entities.push(n)}}return Array.from(t.values()).filter(n=>this._config.show_empty_groups||n.entities.length>0)}_groupByState(e){let t=new Map;for(let i of e){let a=i.state;t.has(a)||t.set(a,{id:a,name:this._getStateName(a),icon:this._getStateIcon(a),entities:[],collapsed:this._config.collapsed_by_default}),t.get(a).entities.push(i)}return Array.from(t.values()).filter(i=>this._config.show_empty_groups||i.entities.length>0)}_groupByCustomRules(e){let t=new Map,i=this._config.custom_groups||{};for(let[a,r]of Object.entries(i))t.set(a,{id:a,name:r.name||a,icon:r.icon||"mdi:folder",entities:[],collapsed:r.collapsed!=null?r.collapsed:this._config.collapsed_by_default});t.set("_other",{id:"_other",name:"\u041F\u0440\u043E\u0447\u0435\u0435",icon:"mdi:dots-horizontal",entities:[],collapsed:this._config.collapsed_by_default});for(let a of e){let r=!1;for(let[o,n]of Object.entries(i))if(this._matchesGroupRules(a,n)){t.get(o).entities.push(a),r=!0;break}r||t.get("_other").entities.push(a)}return Array.from(t.values()).filter(a=>this._config.show_empty_groups||a.entities.length>0)}_matchesGroupRules(e,t){var a;let i=t.rules||{};if(i.entity_id&&!new RegExp(i.entity_id.replace(/\*/g,".*")).test(e.entity_id))return!1;if(i.domain){let r=e.entity_id.split(".")[0];if(!(Array.isArray(i.domain)?i.domain:[i.domain]).includes(r))return!1}if(i.state&&!(Array.isArray(i.state)?i.state:[i.state]).includes(e.state))return!1;if(i.attribute){let{name:r,value:o,above:n,below:c}=i.attribute,l=(a=e.attributes)==null?void 0:a[r];if(o!==void 0&&l!==o||n!==void 0&&parseFloat(l)<=n||c!==void 0&&parseFloat(l)>=c)return!1}return!0}_sortGroups(e){switch(this._config.sort){case je.ALPHABETICAL:return e.sort((i,a)=>i.name.localeCompare(a.name));case je.COUNT_DESC:return e.sort((i,a)=>a.entities.length-i.entities.length);case je.COUNT_ASC:return e.sort((i,a)=>i.entities.length-a.entities.length);case je.PRIORITY:let t=this._config.priority_order||[];return e.sort((i,a)=>{let r=t.indexOf(i.id),o=t.indexOf(a.id);return r===-1&&o===-1?0:r===-1?1:o===-1?-1:r-o});default:return e}}_invalidateCache(){this._cache=null,this._cacheTimestamp=0}_capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1).replace(/_/g," ")}_getDeviceClassIcon(e){return{battery:"mdi:battery",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",connectivity:"mdi:connection",current:"mdi:current-ac",door:"mdi:door",energy:"mdi:lightning-bolt",gas:"mdi:gas-cylinder",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",moisture:"mdi:water",motion:"mdi:motion-sensor",occupancy:"mdi:home-account",power:"mdi:flash",power_factor:"mdi:angle-acute",pressure:"mdi:gauge",problem:"mdi:alert-circle",safety:"mdi:shield-check",smoke:"mdi:smoke-detector",sound:"mdi:volume-high",temperature:"mdi:thermometer",timestamp:"mdi:clock",voltage:"mdi:sine-wave",window:"mdi:window-closed"}[e]||"mdi:bookmark"}_getStateName(e){return{on:"\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E",off:"\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E",home:"\u0414\u043E\u043C\u0430",not_home:"\u041D\u0435 \u0434\u043E\u043C\u0430",open:"\u041E\u0442\u043A\u0440\u044B\u0442\u043E",closed:"\u0417\u0430\u043A\u0440\u044B\u0442\u043E",locked:"\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E",unlocked:"\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E",playing:"\u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435",paused:"\u041F\u0430\u0443\u0437\u0430",idle:"\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435",unavailable:"\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E",unknown:"\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E"}[e]||this._capitalize(e)}_getStateIcon(e){return{on:"mdi:check-circle",off:"mdi:close-circle",home:"mdi:home",not_home:"mdi:home-export-outline",open:"mdi:door-open",closed:"mdi:door-closed",locked:"mdi:lock",unlocked:"mdi:lock-open",playing:"mdi:play",paused:"mdi:pause",idle:"mdi:sleep",unavailable:"mdi:alert",unknown:"mdi:help-circle"}[e]||"mdi:circle"}};var k={NONE:"none",REDUCED:"reduced",COMPACT:"compact",MINIMAL:"minimal",ICON_ONLY:"icon_only"},fe={MANUAL:"manual",SCREEN_WIDTH:"screen_width",CONTAINER_WIDTH:"container_width",CARD_COUNT:"card_count",AUTO:"auto"},ga={enabled:!0,level:k.NONE,trigger:fe.AUTO,breakpoints:{[k.REDUCED]:768,[k.COMPACT]:480,[k.MINIMAL]:320,[k.ICON_ONLY]:200},containerBreakpoints:{[k.REDUCED]:400,[k.COMPACT]:300,[k.MINIMAL]:200,[k.ICON_ONLY]:120},levelSettings:{[k.NONE]:{padding:"16px",gap:"12px",fontSize:"14px",iconSize:"24px",showTitle:!0,showSubtitle:!0,showBadges:!0,showFooter:!0,gridColumns:null},[k.REDUCED]:{padding:"12px",gap:"8px",fontSize:"13px",iconSize:"22px",showTitle:!0,showSubtitle:!0,showBadges:!0,showFooter:!0,gridColumns:null},[k.COMPACT]:{padding:"8px",gap:"6px",fontSize:"12px",iconSize:"20px",showTitle:!0,showSubtitle:!1,showBadges:!0,showFooter:!1,gridColumns:1},[k.MINIMAL]:{padding:"6px",gap:"4px",fontSize:"11px",iconSize:"18px",showTitle:!0,showSubtitle:!1,showBadges:!1,showFooter:!1,gridColumns:1},[k.ICON_ONLY]:{padding:"4px",gap:"2px",fontSize:"10px",iconSize:"16px",showTitle:!1,showSubtitle:!1,showBadges:!1,showFooter:!1,gridColumns:1}}},_t=class{constructor(e,t={}){this._element=e,this._config=this._mergeConfig(ga,t),this._currentLevel=k.NONE,this._resizeObserver=null,this._mediaQueryListeners=[],this._callbacks=new Set,this._init()}_mergeConfig(e,t){let i={...e};for(let a of Object.keys(t))t[a]&&typeof t[a]=="object"&&!Array.isArray(t[a])?i[a]=this._mergeConfig(e[a]||{},t[a]):i[a]=t[a];return i}_init(){if(this._config.enabled){switch(this._config.trigger){case fe.SCREEN_WIDTH:case fe.AUTO:this._setupMediaQueries();break;case fe.CONTAINER_WIDTH:this._setupResizeObserver();break;case fe.MANUAL:this.setLevel(this._config.level);break}this._config.trigger===fe.AUTO&&this._setupResizeObserver()}}_setupMediaQueries(){let e=this._config.breakpoints,t=Object.entries(e).sort(([,i],[,a])=>i-a);for(let[i,a]of t){let r=window.matchMedia(`(max-width: ${a}px)`),o=n=>{this._evaluateLevel()};r.addEventListener("change",o),this._mediaQueryListeners.push({mql:r,handler:o})}this._evaluateLevel()}_setupResizeObserver(){window.ResizeObserver&&(this._resizeObserver=new ResizeObserver(e=>{for(let t of e)this._handleResize(t.contentRect.width)}),this._resizeObserver.observe(this._element))}_handleResize(e){if(this._config.trigger!==fe.CONTAINER_WIDTH&&this._config.trigger!==fe.AUTO)return;let t=this._config.containerBreakpoints,i=k.NONE;for(let[a,r]of Object.entries(t))e<=r&&(i=a);this.setLevel(i)}_evaluateLevel(){let e=this._config.breakpoints,t=window.innerWidth,i=k.NONE;for(let[a,r]of Object.entries(e))t<=r&&(i=a);this.setLevel(i)}setLevel(e){if(!Object.values(k).includes(e)){console.warn(`[CompactMode] Unknown level: ${e}`);return}if(e===this._currentLevel)return;let t=this._currentLevel;this._currentLevel=e,this._applyLevel(e),this._notifyCallbacks(e,t)}getLevel(){return this._currentLevel}getCurrentSettings(){return this._config.levelSettings[this._currentLevel]||{}}_applyLevel(e){for(let i of Object.values(k))this._element.classList.remove(`uc-compact-${i}`);this._element.classList.add(`uc-compact-${e}`);let t=this._config.levelSettings[e];t&&(this._element.style.setProperty("--uc-compact-padding",t.padding),this._element.style.setProperty("--uc-compact-gap",t.gap),this._element.style.setProperty("--uc-compact-font-size",t.fontSize),this._element.style.setProperty("--uc-compact-icon-size",t.iconSize)),this._element.dataset.compactLevel=e}toggleNext(){let e=Object.values(k),i=(e.indexOf(this._currentLevel)+1)%e.length;this.setLevel(e[i])}togglePrevious(){let e=Object.values(k),i=(e.indexOf(this._currentLevel)-1+e.length)%e.length;this.setLevel(e[i])}reset(){this.setLevel(k.NONE)}isCompact(){return this._currentLevel!==k.NONE}shouldShow(e){let t=this.getCurrentSettings(),i=`show${e.charAt(0).toUpperCase()+e.slice(1)}`;return t[i]!==!1}getGridColumns(e=2){let t=this.getCurrentSettings();return t.gridColumns!=null?t.gridColumns:e}subscribe(e){return this._callbacks.add(e),()=>this._callbacks.delete(e)}_notifyCallbacks(e,t){for(let i of this._callbacks)try{i(e,t)}catch(a){console.error("[CompactMode] Callback error:",a)}}destroy(){for(let{mql:e,handler:t}of this._mediaQueryListeners)e.removeEventListener("change",t);this._mediaQueryListeners=[],this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._callbacks.clear();for(let e of Object.values(k))this._element.classList.remove(`uc-compact-${e}`);this._element.style.removeProperty("--uc-compact-padding"),this._element.style.removeProperty("--uc-compact-gap"),this._element.style.removeProperty("--uc-compact-font-size"),this._element.style.removeProperty("--uc-compact-icon-size"),delete this._element.dataset.compactLevel}static getStyles(){return`
      /* \u0411\u0430\u0437\u043E\u0432\u044B\u0435 CSS \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435 */
      :host {
        --uc-compact-padding: 16px;
        --uc-compact-gap: 12px;
        --uc-compact-font-size: 14px;
        --uc-compact-icon-size: 24px;
      }

      /* REDUCED - \u0423\u043C\u0435\u043D\u044C\u0448\u0435\u043D\u043D\u044B\u0435 \u043E\u0442\u0441\u0442\u0443\u043F\u044B */
      :host(.uc-compact-reduced),
      .uc-compact-reduced {
        --uc-compact-padding: 12px;
        --uc-compact-gap: 8px;
        --uc-compact-font-size: 13px;
        --uc-compact-icon-size: 22px;
      }

      /* COMPACT - \u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C */
      :host(.uc-compact-compact),
      .uc-compact-compact {
        --uc-compact-padding: 8px;
        --uc-compact-gap: 6px;
        --uc-compact-font-size: 12px;
        --uc-compact-icon-size: 20px;
      }

      :host(.uc-compact-compact) .uc-subtitle,
      .uc-compact-compact .uc-subtitle {
        display: none;
      }

      :host(.uc-compact-compact) .uc-footer,
      .uc-compact-compact .uc-footer {
        display: none;
      }

      /* MINIMAL - \u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0435\u0436\u0438\u043C */
      :host(.uc-compact-minimal),
      .uc-compact-minimal {
        --uc-compact-padding: 6px;
        --uc-compact-gap: 4px;
        --uc-compact-font-size: 11px;
        --uc-compact-icon-size: 18px;
      }

      :host(.uc-compact-minimal) .uc-subtitle,
      :host(.uc-compact-minimal) .uc-badges,
      :host(.uc-compact-minimal) .uc-footer,
      .uc-compact-minimal .uc-subtitle,
      .uc-compact-minimal .uc-badges,
      .uc-compact-minimal .uc-footer {
        display: none;
      }

      /* ICON_ONLY - \u0422\u043E\u043B\u044C\u043A\u043E \u0438\u043A\u043E\u043D\u043A\u0438 */
      :host(.uc-compact-icon_only),
      .uc-compact-icon_only {
        --uc-compact-padding: 4px;
        --uc-compact-gap: 2px;
        --uc-compact-font-size: 10px;
        --uc-compact-icon-size: 16px;
      }

      :host(.uc-compact-icon_only) .uc-title,
      :host(.uc-compact-icon_only) .uc-subtitle,
      :host(.uc-compact-icon_only) .uc-badges,
      :host(.uc-compact-icon_only) .uc-footer,
      :host(.uc-compact-icon_only) .uc-action-name,
      .uc-compact-icon_only .uc-title,
      .uc-compact-icon_only .uc-subtitle,
      .uc-compact-icon_only .uc-badges,
      .uc-compact-icon_only .uc-footer,
      .uc-compact-icon_only .uc-action-name {
        display: none;
      }

      /* \u041F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0445 */
      .uc-header,
      .uc-body,
      .uc-footer {
        padding: var(--uc-compact-padding);
        gap: var(--uc-compact-gap);
      }

      .uc-title,
      .uc-subtitle,
      .uc-content {
        font-size: var(--uc-compact-font-size);
      }

      .uc-header ha-icon,
      .uc-body ha-icon {
        --mdc-icon-size: var(--uc-compact-icon-size);
      }

      /* \u0410\u043D\u0438\u043C\u0430\u0446\u0438\u044F \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u043E\u0432 */
      :host,
      .uc-header,
      .uc-body,
      .uc-footer,
      .uc-title,
      .uc-subtitle {
        transition: 
          padding 0.2s ease,
          gap 0.2s ease,
          font-size 0.2s ease;
      }

      /* Grid \u0430\u0434\u0430\u043F\u0442\u0430\u0446\u0438\u044F */
      :host([data-compact-level="compact"]) .uc-body-grid,
      :host([data-compact-level="minimal"]) .uc-body-grid,
      :host([data-compact-level="icon_only"]) .uc-body-grid,
      [data-compact-level="compact"] .uc-body-grid,
      [data-compact-level="minimal"] .uc-body-grid,
      [data-compact-level="icon_only"] .uc-body-grid {
        grid-template-columns: 1fr !important;
      }

      /* \u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0435 \u043A\u043D\u043E\u043F\u043A\u0438 */
      :host(.uc-compact-compact) .uc-quick-action,
      :host(.uc-compact-minimal) .uc-quick-action,
      :host(.uc-compact-icon_only) .uc-quick-action,
      .uc-compact-compact .uc-quick-action,
      .uc-compact-minimal .uc-quick-action,
      .uc-compact-icon_only .uc-quick-action {
        padding: 4px 8px;
        min-width: 28px;
        min-height: 28px;
      }

      /* \u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439 header */
      :host(.uc-compact-minimal) .uc-header,
      :host(.uc-compact-icon_only) .uc-header,
      .uc-compact-minimal .uc-header,
      .uc-compact-icon_only .uc-header {
        min-height: auto;
      }

      /* \u0421\u043A\u0440\u044B\u0442\u0438\u0435 \u0441\u0442\u0440\u0435\u043B\u043A\u0438 \u0432 \u043C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0445 \u0440\u0435\u0436\u0438\u043C\u0430\u0445 */
      :host(.uc-compact-icon_only) .uc-expand-icon,
      .uc-compact-icon_only .uc-expand-icon {
        display: none;
      }
    `}};var bt={DEFAULT:{name:"Default",blur:10,opacity:.7,saturation:180,borderOpacity:.2,borderWidth:1,shadowOpacity:.1},CLEAR:{name:"Clear",blur:20,opacity:.9,saturation:100,borderOpacity:.1,borderWidth:1,shadowOpacity:.05},FROSTED:{name:"Frosted",blur:25,opacity:.6,saturation:150,borderOpacity:.3,borderWidth:1,shadowOpacity:.15},TINTED:{name:"Tinted",blur:15,opacity:.5,saturation:200,borderOpacity:.2,borderWidth:1,shadowOpacity:.12,tint:"var(--primary-color)"},DENSE:{name:"Dense",blur:8,opacity:.85,saturation:120,borderOpacity:.4,borderWidth:2,shadowOpacity:.2},NEON:{name:"Neon",blur:12,opacity:.6,saturation:250,borderOpacity:.5,borderWidth:1,shadowOpacity:.15,glowColor:"var(--primary-color)",glowIntensity:10},MINIMAL:{name:"Minimal",blur:5,opacity:.95,saturation:100,borderOpacity:.05,borderWidth:0,shadowOpacity:.05}},si={LIGHT:{background:"rgba(255, 255, 255, {opacity})",border:"rgba(255, 255, 255, {borderOpacity})",shadow:"rgba(0, 0, 0, {shadowOpacity})"},DARK:{background:"rgba(0, 0, 0, {opacity})",border:"rgba(255, 255, 255, {borderOpacity})",shadow:"rgba(0, 0, 0, {shadowOpacity})"},PRIMARY:{background:"rgba(var(--rgb-primary-color), {opacity})",border:"rgba(var(--rgb-primary-color), {borderOpacity})",shadow:"rgba(var(--rgb-primary-color), {shadowOpacity})"},ACCENT:{background:"rgba(var(--rgb-accent-color), {opacity})",border:"rgba(var(--rgb-accent-color), {borderOpacity})",shadow:"rgba(var(--rgb-accent-color), {shadowOpacity})"}},yt=class{constructor(e={}){this._config={preset:"DEFAULT",colorScheme:"LIGHT",customSettings:{},...e}}setPreset(e){bt[e]&&(this._config.preset=e)}setColorScheme(e){si[e]&&(this._config.colorScheme=e)}getSettings(){return{...bt[this._config.preset]||bt.DEFAULT,...this._config.customSettings}}generateStyles(e={}){let t={...this.getSettings(),...e},i=si[this._config.colorScheme]||si.LIGHT,a=i.background.replace("{opacity}",t.opacity),r=i.border.replace("{borderOpacity}",t.borderOpacity),o=i.shadow.replace("{shadowOpacity}",t.shadowOpacity),n={background:a,backdropFilter:`blur(${t.blur}px) saturate(${t.saturation}%)`,WebkitBackdropFilter:`blur(${t.blur}px) saturate(${t.saturation}%)`,border:t.borderWidth>0?`${t.borderWidth}px solid ${r}`:"none",boxShadow:`0 8px 32px ${o}`};return t.tint&&(n.background=`linear-gradient(135deg, ${t.tint}20, ${a})`),t.glowColor&&t.glowIntensity&&(n.boxShadow=`
        0 8px 32px ${o},
        0 0 ${t.glowIntensity}px ${t.glowColor}40,
        inset 0 0 ${t.glowIntensity/2}px ${t.glowColor}20
      `),n}apply(e,t={}){let i=this.generateStyles(t);for(let[a,r]of Object.entries(i))e.style[a]=r;e.classList.add("uc-glass")}remove(e){let t=["background","backdropFilter","webkitBackdropFilter","border","boxShadow"];for(let i of t)e.style[i]="";e.classList.remove("uc-glass")}generateCSS(e="glass",t={}){let i=this.generateStyles(t);return`
      .${e} {
        background: ${i.background};
        backdrop-filter: ${i.backdropFilter};
        -webkit-backdrop-filter: ${i.WebkitBackdropFilter};
        border: ${i.border};
        box-shadow: ${i.boxShadow};
        border-radius: var(--ha-card-border-radius, 12px);
      }
    `}static getStyles(){let e=[];e.push(`
      .uc-glass {
        position: relative;
        isolation: isolate;
      }

      .uc-glass::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: -1;
      }
    `);for(let[t,i]of Object.entries(bt)){let a=`uc-glass-${t.toLowerCase()}`,r=`rgba(255, 255, 255, ${i.opacity})`,o=`rgba(0, 0, 0, ${i.opacity})`,n=`rgba(255, 255, 255, ${i.borderOpacity})`,c=`rgba(0, 0, 0, ${i.shadowOpacity})`;e.push(`
        .${a} {
          background: ${r};
          backdrop-filter: blur(${i.blur}px) saturate(${i.saturation}%);
          -webkit-backdrop-filter: blur(${i.blur}px) saturate(${i.saturation}%);
          border: ${i.borderWidth}px solid ${n};
          box-shadow: 0 8px 32px ${c};
        }

        @media (prefers-color-scheme: dark) {
          .${a} {
            background: ${o};
          }
        }
      `),i.glowColor&&e.push(`
          .${a} {
            box-shadow: 
              0 8px 32px ${c},
              0 0 ${i.glowIntensity}px ${i.glowColor}40,
              inset 0 0 ${i.glowIntensity/2}px ${i.glowColor}20;
          }
        `)}return e.push(`
      /* \u0423\u0442\u0438\u043B\u0438\u0442\u0430\u0440\u043D\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u044B \u0434\u043B\u044F \u0440\u0430\u0437\u043C\u044B\u0442\u0438\u044F */
      .uc-blur-none { backdrop-filter: none; -webkit-backdrop-filter: none; }
      .uc-blur-sm { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
      .uc-blur-md { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
      .uc-blur-lg { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      .uc-blur-xl { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
      .uc-blur-2xl { backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); }

      /* \u041D\u0430\u0441\u044B\u0449\u0435\u043D\u043D\u043E\u0441\u0442\u044C */
      .uc-saturate-0 { backdrop-filter: saturate(0%); -webkit-backdrop-filter: saturate(0%); }
      .uc-saturate-50 { backdrop-filter: saturate(50%); -webkit-backdrop-filter: saturate(50%); }
      .uc-saturate-100 { backdrop-filter: saturate(100%); -webkit-backdrop-filter: saturate(100%); }
      .uc-saturate-150 { backdrop-filter: saturate(150%); -webkit-backdrop-filter: saturate(150%); }
      .uc-saturate-200 { backdrop-filter: saturate(200%); -webkit-backdrop-filter: saturate(200%); }

      /* Fallback \u0434\u043B\u044F \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043E\u0432 \u0431\u0435\u0437 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0438 backdrop-filter */
      @supports not (backdrop-filter: blur(10px)) {
        .uc-glass,
        [class*="uc-glass-"] {
          background: var(--ha-card-background, rgba(255, 255, 255, 0.95)) !important;
        }
      }
    `),e.join(`
`)}};var U={FLAT:"flat",RAISED:"raised",PRESSED:"pressed",INSET:"inset",CONVEX:"convex",CONCAVE:"concave"},ge={SUBTLE:"subtle",LIGHT:"light",MEDIUM:"medium",STRONG:"strong",EXTREME:"extreme"},ci={[ge.SUBTLE]:{distance:3,blur:6,lightOpacity:.5,shadowOpacity:.1},[ge.LIGHT]:{distance:5,blur:10,lightOpacity:.7,shadowOpacity:.15},[ge.MEDIUM]:{distance:8,blur:16,lightOpacity:1,shadowOpacity:.2},[ge.STRONG]:{distance:12,blur:24,lightOpacity:1,shadowOpacity:.3},[ge.EXTREME]:{distance:20,blur:40,lightOpacity:1,shadowOpacity:.4}},vt={LIGHT:{background:"#e0e5ec",lightShadow:"#ffffff",darkShadow:"#a3b1c6",text:"#333333",accent:"#6d5dfc"},DARK:{background:"#2d2d2d",lightShadow:"#3d3d3d",darkShadow:"#1d1d1d",text:"#e0e0e0",accent:"#6d5dfc"},BLUE:{background:"#d6e4f0",lightShadow:"#ffffff",darkShadow:"#a3b8cc",text:"#2c3e50",accent:"#3498db"},GREEN:{background:"#d4e6d4",lightShadow:"#ffffff",darkShadow:"#a3c4a3",text:"#2d4a2d",accent:"#27ae60"},PINK:{background:"#f0d6e4",lightShadow:"#ffffff",darkShadow:"#c4a3b4",text:"#4a2d3d",accent:"#e91e63"},CUSTOM:{background:"var(--neu-background, #e0e5ec)",lightShadow:"var(--neu-light-shadow, #ffffff)",darkShadow:"var(--neu-dark-shadow, #a3b1c6)",text:"var(--neu-text, #333333)",accent:"var(--neu-accent, #6d5dfc)"}},xt=class{constructor(e={}){this._config={type:U.RAISED,intensity:ge.MEDIUM,palette:"LIGHT",lightAngle:145,borderRadius:12,...e}}setType(e){Object.values(U).includes(e)&&(this._config.type=e)}setIntensity(e){Object.values(ge).includes(e)&&(this._config.intensity=e)}setPalette(e){vt[e]&&(this._config.palette=e)}setLightAngle(e){this._config.lightAngle=e%360}getPalette(){return vt[this._config.palette]||vt.LIGHT}_calculateShadowOffset(){let t=this._config.lightAngle*Math.PI/180,i=ci[this._config.intensity],a=i.distance,r=Math.round(-Math.cos(t)*a),o=Math.round(-Math.sin(t)*a),n=Math.round(Math.cos(t)*a),c=Math.round(Math.sin(t)*a);return{lightX:r,lightY:o,darkX:n,darkY:c,blur:i.blur}}generateShadow(e={}){let t={...this._config,...e},i=this.getPalette(),a=ci[t.intensity],r=this._calculateShadowOffset(),o=i.lightShadow,n=i.darkShadow;switch(t.type){case U.FLAT:return"none";case U.RAISED:return`
          ${r.lightX}px ${r.lightY}px ${r.blur}px ${o},
          ${r.darkX}px ${r.darkY}px ${r.blur}px ${n}
        `.trim();case U.PRESSED:return`
          inset ${r.darkX}px ${r.darkY}px ${r.blur}px ${n},
          inset ${r.lightX}px ${r.lightY}px ${r.blur}px ${o}
        `.trim();case U.INSET:return`
          inset ${r.lightX}px ${r.lightY}px ${r.blur/2}px ${o},
          inset ${r.darkX}px ${r.darkY}px ${r.blur/2}px ${n}
        `.trim();case U.CONVEX:return`
          ${r.lightX}px ${r.lightY}px ${r.blur}px ${o},
          ${r.darkX}px ${r.darkY}px ${r.blur}px ${n},
          inset ${r.lightX/2}px ${r.lightY/2}px ${r.blur/4}px ${o},
          inset ${r.darkX/2}px ${r.darkY/2}px ${r.blur/4}px ${n}
        `.trim();case U.CONCAVE:return`
          ${r.lightX}px ${r.lightY}px ${r.blur}px ${o},
          ${r.darkX}px ${r.darkY}px ${r.blur}px ${n},
          inset ${r.darkX/2}px ${r.darkY/2}px ${r.blur/4}px ${n},
          inset ${r.lightX/2}px ${r.lightY/2}px ${r.blur/4}px ${o}
        `.trim();default:return"none"}}generateGradient(){let e=this.getPalette(),t=this._config.lightAngle;switch(this._config.type){case U.CONVEX:return`linear-gradient(${t}deg, 
          ${this._lighten(e.background,5)}, 
          ${this._darken(e.background,5)})`;case U.CONCAVE:return`linear-gradient(${t}deg, 
          ${this._darken(e.background,5)}, 
          ${this._lighten(e.background,5)})`;default:return null}}_lighten(e,t){if(e.startsWith("var("))return e;let i=parseInt(e.replace("#",""),16),a=Math.round(2.55*t),r=Math.min(255,(i>>16)+a),o=Math.min(255,(i>>8&255)+a),n=Math.min(255,(i&255)+a);return`#${(16777216+r*65536+o*256+n).toString(16).slice(1)}`}_darken(e,t){if(e.startsWith("var("))return e;let i=parseInt(e.replace("#",""),16),a=Math.round(2.55*t),r=Math.max(0,(i>>16)-a),o=Math.max(0,(i>>8&255)-a),n=Math.max(0,(i&255)-a);return`#${(16777216+r*65536+o*256+n).toString(16).slice(1)}`}generateStyles(e={}){let t=this.getPalette(),i=this.generateShadow(e),a=this.generateGradient(),r={backgroundColor:t.background,boxShadow:i,borderRadius:`${this._config.borderRadius}px`,color:t.text,border:"none"};return a&&(r.background=a),r}apply(e,t={}){let i=this.generateStyles(t);for(let[a,r]of Object.entries(i))e.style[a]=r;e.classList.add("uc-neu"),e.dataset.neuType=this._config.type}remove(e){let t=["backgroundColor","background","boxShadow","borderRadius","color","border"];for(let i of t)e.style[i]="";e.classList.remove("uc-neu"),delete e.dataset.neuType}static getStyles(){let e=[];for(let[t,i]of Object.entries(vt)){let a=t.toLowerCase();e.push(`
        .uc-neu-${a} {
          --neu-background: ${i.background};
          --neu-light-shadow: ${i.lightShadow};
          --neu-dark-shadow: ${i.darkShadow};
          --neu-text: ${i.text};
          --neu-accent: ${i.accent};
          background: var(--neu-background);
          color: var(--neu-text);
        }
      `);for(let[r,o]of Object.entries(U)){let n=r.toLowerCase(),c=ci[ge.MEDIUM],l;switch(o){case U.FLAT:l="none";break;case U.RAISED:l=`-${c.distance}px -${c.distance}px ${c.blur}px var(--neu-light-shadow), ${c.distance}px ${c.distance}px ${c.blur}px var(--neu-dark-shadow)`;break;case U.PRESSED:l=`inset ${c.distance}px ${c.distance}px ${c.blur}px var(--neu-dark-shadow), inset -${c.distance}px -${c.distance}px ${c.blur}px var(--neu-light-shadow)`;break;case U.INSET:l=`inset -${c.distance/2}px -${c.distance/2}px ${c.blur/2}px var(--neu-light-shadow), inset ${c.distance/2}px ${c.distance/2}px ${c.blur/2}px var(--neu-dark-shadow)`;break;default:l="none"}e.push(`
          .uc-neu-${a}.uc-neu-${n} {
            box-shadow: ${l};
          }
        `)}}return e.push(`
      /* Hover \u044D\u0444\u0444\u0435\u043A\u0442 - \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u043A pressed */
      .uc-neu-interactive:hover {
        box-shadow: inset 4px 4px 8px var(--neu-dark-shadow),
                    inset -4px -4px 8px var(--neu-light-shadow);
      }

      /* Active \u044D\u0444\u0444\u0435\u043A\u0442 - \u0433\u043B\u0443\u0431\u0436\u0435 pressed */
      .uc-neu-interactive:active {
        box-shadow: inset 6px 6px 12px var(--neu-dark-shadow),
                    inset -6px -6px 12px var(--neu-light-shadow);
      }

      /* Transition \u0434\u043B\u044F \u043F\u043B\u0430\u0432\u043D\u043E\u0441\u0442\u0438 */
      .uc-neu {
        transition: box-shadow 0.2s ease, background 0.2s ease;
      }

      /* \u0423\u0442\u0438\u043B\u0438\u0442\u0430\u0440\u043D\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u044B \u0438\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u0438 */
      .uc-neu-subtle { --neu-intensity: 0.5; }
      .uc-neu-light { --neu-intensity: 0.7; }
      .uc-neu-medium { --neu-intensity: 1; }
      .uc-neu-strong { --neu-intensity: 1.3; }
      .uc-neu-extreme { --neu-intensity: 1.6; }

      /* \u041A\u043D\u043E\u043F\u043A\u0430 \u0432 \u0441\u0442\u0438\u043B\u0435 neumorphism */
      .uc-neu-button {
        padding: 12px 24px;
        border-radius: 12px;
        border: none;
        cursor: pointer;
        font-weight: 500;
        background: var(--neu-background);
        color: var(--neu-text);
        box-shadow: -5px -5px 10px var(--neu-light-shadow),
                    5px 5px 10px var(--neu-dark-shadow);
        transition: all 0.2s ease;
      }

      .uc-neu-button:hover {
        box-shadow: -2px -2px 5px var(--neu-light-shadow),
                    2px 2px 5px var(--neu-dark-shadow);
      }

      .uc-neu-button:active {
        box-shadow: inset 3px 3px 6px var(--neu-dark-shadow),
                    inset -3px -3px 6px var(--neu-light-shadow);
      }

      /* \u0418\u043D\u043F\u0443\u0442 \u0432 \u0441\u0442\u0438\u043B\u0435 neumorphism */
      .uc-neu-input {
        padding: 12px 16px;
        border-radius: 8px;
        border: none;
        background: var(--neu-background);
        color: var(--neu-text);
        box-shadow: inset 3px 3px 6px var(--neu-dark-shadow),
                    inset -3px -3px 6px var(--neu-light-shadow);
        outline: none;
      }

      .uc-neu-input:focus {
        box-shadow: inset 4px 4px 8px var(--neu-dark-shadow),
                    inset -4px -4px 8px var(--neu-light-shadow),
                    0 0 0 2px var(--neu-accent);
      }
    `),e.join(`
`)}};var L={GEOMETRIC:"geometric",DOTS:"dots",LINES:"lines",WAVES:"waves",NOISE:"noise",ORGANIC:"organic"},Ee={grid:{category:L.GEOMETRIC,name:"Grid",css:(s="rgba(0,0,0,0.05)",e=20)=>`
      linear-gradient(${s} 1px, transparent 1px),
      linear-gradient(90deg, ${s} 1px, transparent 1px)
    `,size:(s=20)=>`${s}px ${s}px`,description:"\u0421\u0435\u0442\u043A\u0430"},checkerboard:{category:L.GEOMETRIC,name:"Checkerboard",css:(s="rgba(0,0,0,0.05)",e=20)=>`
      linear-gradient(45deg, ${s} 25%, transparent 25%),
      linear-gradient(-45deg, ${s} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${s} 75%),
      linear-gradient(-45deg, transparent 75%, ${s} 75%)
    `,size:(s=20)=>`${s}px ${s}px`,position:(s=20)=>`0 0, 0 ${s/2}px, ${s/2}px -${s/2}px, -${s/2}px 0px`,description:"\u0428\u0430\u0445\u043C\u0430\u0442\u043D\u0430\u044F \u0434\u043E\u0441\u043A\u0430"},triangles:{category:L.GEOMETRIC,name:"Triangles",css:(s="rgba(0,0,0,0.05)",e=40)=>`
      linear-gradient(135deg, ${s} 25%, transparent 25%) -${e/2}px 0,
      linear-gradient(225deg, ${s} 25%, transparent 25%) -${e/2}px 0,
      linear-gradient(315deg, ${s} 25%, transparent 25%),
      linear-gradient(45deg, ${s} 25%, transparent 25%)
    `,size:(s=40)=>`${s}px ${s}px`,description:"\u0422\u0440\u0435\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0438"},hexagons:{category:L.GEOMETRIC,name:"Hexagons",svg:(s="#00000010",e=30)=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="${e*2}" height="${e*1.73}">
        <polygon points="${e},0 ${e*2},${e*.5} ${e*2},${e*1.23} ${e},${e*1.73} 0,${e*1.23} 0,${e*.5}"
                 fill="none" stroke="${s}" stroke-width="1"/>
      </svg>
    `,description:"\u0428\u0435\u0441\u0442\u0438\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0438"},diamonds:{category:L.GEOMETRIC,name:"Diamonds",css:(s="rgba(0,0,0,0.05)",e=20)=>`
      linear-gradient(135deg, ${s} 25%, transparent 25%),
      linear-gradient(225deg, ${s} 25%, transparent 25%),
      linear-gradient(45deg, ${s} 25%, transparent 25%),
      linear-gradient(315deg, ${s} 25%, transparent 25%)
    `,size:(s=20)=>`${s}px ${s}px`,position:(s=20)=>`${s/2}px 0, ${s/2}px 0, 0 0, 0 0`,description:"\u0420\u043E\u043C\u0431\u044B"},dots:{category:L.DOTS,name:"Dots",css:(s="rgba(0,0,0,0.1)",e=20)=>`
      radial-gradient(${s} 2px, transparent 2px)
    `,size:(s=20)=>`${s}px ${s}px`,description:"\u0422\u043E\u0447\u043A\u0438"},dotsLarge:{category:L.DOTS,name:"Dots Large",css:(s="rgba(0,0,0,0.08)",e=30)=>`
      radial-gradient(${s} 4px, transparent 4px)
    `,size:(s=30)=>`${s}px ${s}px`,description:"\u041A\u0440\u0443\u043F\u043D\u044B\u0435 \u0442\u043E\u0447\u043A\u0438"},dotsGradient:{category:L.DOTS,name:"Dots Gradient",css:(s="rgba(0,0,0,0.1)",e=20)=>`
      radial-gradient(circle at center, ${s}, transparent 50%)
    `,size:(s=20)=>`${s}px ${s}px`,description:"\u0422\u043E\u0447\u043A\u0438 \u0441 \u0433\u0440\u0430\u0434\u0438\u0435\u043D\u0442\u043E\u043C"},horizontalLines:{category:L.LINES,name:"Horizontal Lines",css:(s="rgba(0,0,0,0.05)",e=10)=>`
      linear-gradient(${s} 1px, transparent 1px)
    `,size:(s=10)=>`100% ${s}px`,description:"\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u043B\u0438\u043D\u0438\u0438"},verticalLines:{category:L.LINES,name:"Vertical Lines",css:(s="rgba(0,0,0,0.05)",e=10)=>`
      linear-gradient(90deg, ${s} 1px, transparent 1px)
    `,size:(s=10)=>`${s}px 100%`,description:"\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u043B\u0438\u043D\u0438\u0438"},diagonalLines:{category:L.LINES,name:"Diagonal Lines",css:(s="rgba(0,0,0,0.05)",e=10)=>`
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent ${e}px,
        ${s} ${e}px,
        ${s} ${e+1}px
      )
    `,size:()=>"auto",description:"\u0414\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043B\u0438\u043D\u0438\u0438"},crosshatch:{category:L.LINES,name:"Crosshatch",css:(s="rgba(0,0,0,0.05)",e=10)=>`
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent ${e}px,
        ${s} ${e}px,
        ${s} ${e+1}px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent ${e}px,
        ${s} ${e}px,
        ${s} ${e+1}px
      )
    `,size:()=>"auto",description:"\u041F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043D\u0430\u044F \u0448\u0442\u0440\u0438\u0445\u043E\u0432\u043A\u0430"},waves:{category:L.WAVES,name:"Waves",svg:(s="#00000010",e=40)=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e/2}">
        <path d="M0 ${e/4} Q ${e/4} 0 ${e/2} ${e/4} T ${e} ${e/4}" 
              fill="none" stroke="${s}" stroke-width="1"/>
      </svg>
    `,description:"\u0412\u043E\u043B\u043D\u044B"},zigzag:{category:L.WAVES,name:"Zigzag",css:(s="rgba(0,0,0,0.05)",e=20)=>`
      linear-gradient(135deg, ${s} 25%, transparent 25%),
      linear-gradient(225deg, ${s} 25%, transparent 25%)
    `,size:(s=20)=>`${s}px ${s}px`,position:()=>"0 0, 10px 0",description:"\u0417\u0438\u0433\u0437\u0430\u0433"},noise:{category:L.NOISE,name:"Noise",svg:()=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.05"/>
      </svg>
    `,description:"\u0428\u0443\u043C"},grain:{category:L.NOISE,name:"Grain",svg:()=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
        <filter id="grain">
          <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" result="noise"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.03"/>
      </svg>
    `,description:"\u0417\u0435\u0440\u043D\u0438\u0441\u0442\u043E\u0441\u0442\u044C"},topography:{category:L.ORGANIC,name:"Topography",svg:(s="#00000008")=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <circle cx="20" cy="20" r="15" fill="none" stroke="${s}" stroke-width="1"/>
        <circle cx="20" cy="20" r="25" fill="none" stroke="${s}" stroke-width="1"/>
        <circle cx="20" cy="20" r="35" fill="none" stroke="${s}" stroke-width="1"/>
        <circle cx="80" cy="80" r="10" fill="none" stroke="${s}" stroke-width="1"/>
        <circle cx="80" cy="80" r="20" fill="none" stroke="${s}" stroke-width="1"/>
        <circle cx="80" cy="80" r="30" fill="none" stroke="${s}" stroke-width="1"/>
      </svg>
    `,description:"\u0422\u043E\u043F\u043E\u0433\u0440\u0430\u0444\u0438\u044F"},circuit:{category:L.ORGANIC,name:"Circuit",svg:(s="#00000010")=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
        <path d="M0 25 H20 V10 H30 V25 H50 M25 0 V10 M25 50 V40" 
              fill="none" stroke="${s}" stroke-width="1"/>
        <circle cx="25" cy="10" r="2" fill="${s}"/>
        <circle cx="25" cy="40" r="2" fill="${s}"/>
      </svg>
    `,description:"\u0421\u0445\u0435\u043C\u0430"}},wt=class{constructor(e={}){this._config={pattern:"grid",color:"rgba(0, 0, 0, 0.05)",size:20,opacity:1,blend:"normal",...e}}setPattern(e){Ee[e]&&(this._config.pattern=e)}setColor(e){this._config.color=e}setSize(e){this._config.size=e}getPattern(){return Ee[this._config.pattern]||Ee.grid}generateStyles(e={}){let t={...this._config,...e},i=Ee[t.pattern];if(!i)return{};let a={backgroundBlendMode:t.blend};if(i.css&&(a.backgroundImage=i.css(t.color,t.size),i.size&&(a.backgroundSize=i.size(t.size)),i.position&&(a.backgroundPosition=i.position(t.size))),i.svg){let r=i.svg(t.color,t.size),o=encodeURIComponent(r);a.backgroundImage=`url("data:image/svg+xml,${o}")`}return t.opacity<1&&(a.opacity=t.opacity),a}apply(e,t={}){let i=this.generateStyles(t);for(let[a,r]of Object.entries(i))e.style[a]=r;e.classList.add("uc-pattern"),e.dataset.pattern=this._config.pattern}remove(e){e.style.backgroundImage="",e.style.backgroundSize="",e.style.backgroundPosition="",e.style.backgroundBlendMode="",e.classList.remove("uc-pattern"),delete e.dataset.pattern}static getByCategory(e){let t={};for(let[i,a]of Object.entries(Ee))a.category===e&&(t[i]=a);return t}static getPatternNames(){return Object.keys(Ee)}static getStyles(){let e=[];for(let[t,i]of Object.entries(Ee))if(i.css){let a=i.css("rgba(0,0,0,0.05)",20),r=i.size?i.size(20):"auto",o=i.position?i.position(20):"0 0";e.push(`
          .uc-pattern-${t} {
            background-image: ${a};
            background-size: ${r};
            background-position: ${o};
          }
        `)}else if(i.svg){let a=i.svg("rgba(0,0,0,0.05)",20),r=encodeURIComponent(a);e.push(`
          .uc-pattern-${t} {
            background-image: url("data:image/svg+xml,${r}");
          }
        `)}return e.push(`
      /* \u0420\u0430\u0437\u043C\u0435\u0440\u044B \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u043E\u0432 */
      .uc-pattern-sm { background-size: 10px 10px; }
      .uc-pattern-md { background-size: 20px 20px; }
      .uc-pattern-lg { background-size: 40px 40px; }
      .uc-pattern-xl { background-size: 60px 60px; }

      /* \u041F\u0440\u043E\u0437\u0440\u0430\u0447\u043D\u043E\u0441\u0442\u044C */
      .uc-pattern-opacity-10 { opacity: 0.1; }
      .uc-pattern-opacity-25 { opacity: 0.25; }
      .uc-pattern-opacity-50 { opacity: 0.5; }
      .uc-pattern-opacity-75 { opacity: 0.75; }

      /* \u0420\u0435\u0436\u0438\u043C\u044B \u043D\u0430\u043B\u043E\u0436\u0435\u043D\u0438\u044F */
      .uc-pattern-blend-multiply { background-blend-mode: multiply; }
      .uc-pattern-blend-screen { background-blend-mode: screen; }
      .uc-pattern-blend-overlay { background-blend-mode: overlay; }
      .uc-pattern-blend-darken { background-blend-mode: darken; }
      .uc-pattern-blend-lighten { background-blend-mode: lighten; }

      /* \u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u043F\u0430\u0442\u0442\u0435\u0440\u043D\u044B */
      .uc-pattern-animated {
        animation: uc-pattern-move 20s linear infinite;
      }

      @keyframes uc-pattern-move {
        from { background-position: 0 0; }
        to { background-position: 100px 100px; }
      }
    `),e.join(`
`)}};var ie={GRADIENT:"gradient",GLOW:"glow",PULSE:"pulse",RAINBOW:"rainbow",DASH:"dash",WAVE:"wave",NEON:"neon",SHIMMER:"shimmer"},kt={PRIMARY:["var(--primary-color)","var(--accent-color, #6366f1)"],RAINBOW:["#ff0000","#ff7f00","#ffff00","#00ff00","#0000ff","#8b00ff","#ff0000"],SUNSET:["#ff6b6b","#feca57","#ff9ff3"],OCEAN:["#0077be","#00a5cf","#00d4aa"],FIRE:["#ff4500","#ff6b00","#ffd700"],PURPLE:["#667eea","#764ba2"],CYAN:["#00d2ff","#3a7bd5"],EMERALD:["#11998e","#38ef7d"]},_a={type:ie.GRADIENT,width:2,radius:12,duration:3,colors:kt.PRIMARY,glowSize:10,glowOpacity:.5},Et=class{constructor(e={}){this._config={..._a,...e},this._styleElement=null,this._animationId=`uc-border-${Math.random().toString(36).substr(2,9)}`}setType(e){Object.values(ie).includes(e)&&(this._config.type=e)}setColors(e){this._config.colors=e}setGradientPreset(e){kt[e]&&(this._config.colors=kt[e])}generateStyles(){let{type:e,width:t,radius:i,colors:a,glowSize:r,glowOpacity:o}=this._config;switch(e){case ie.GRADIENT:return this._generateGradientStyles();case ie.GLOW:return this._generateGlowStyles();case ie.PULSE:return this._generatePulseStyles();case ie.RAINBOW:return this._generateRainbowStyles();case ie.DASH:return this._generateDashStyles();case ie.WAVE:return this._generateWaveStyles();case ie.NEON:return this._generateNeonStyles();case ie.SHIMMER:return this._generateShimmerStyles();default:return{}}}_generateGradientStyles(){let{width:e,radius:t,colors:i,duration:a}=this._config,r=`linear-gradient(90deg, ${i.join(", ")})`;return{position:"relative",borderRadius:`${t}px`,padding:`${e}px`,background:r,backgroundSize:"200% 200%",animation:`${this._animationId}-gradient ${a}s ease infinite`,keyframes:`
        @keyframes ${this._animationId}-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}}_generateGlowStyles(){let{width:e,radius:t,colors:i,glowSize:a,glowOpacity:r,duration:o}=this._config,n=i[0];return{position:"relative",borderRadius:`${t}px`,border:`${e}px solid ${n}`,boxShadow:`0 0 ${a}px ${n}`,animation:`${this._animationId}-glow ${o}s ease-in-out infinite`,keyframes:`
        @keyframes ${this._animationId}-glow {
          0%, 100% {
            box-shadow: 0 0 ${a}px ${n}${Math.round(r*255).toString(16)};
          }
          50% {
            box-shadow: 0 0 ${a*2}px ${n}, 0 0 ${a*3}px ${n}${Math.round(r*.5*255).toString(16)};
          }
        }
      `}}_generatePulseStyles(){let{width:e,radius:t,colors:i,duration:a}=this._config;return{position:"relative",borderRadius:`${t}px`,border:`${e}px solid ${i[0]}`,animation:`${this._animationId}-pulse ${a}s ease-in-out infinite`,keyframes:`
        @keyframes ${this._animationId}-pulse {
          0%, 100% {
            border-color: ${i[0]};
            border-width: ${e}px;
          }
          50% {
            border-color: ${i[1]||i[0]};
            border-width: ${e+1}px;
          }
        }
      `}}_generateRainbowStyles(){let{width:e,radius:t,duration:i}=this._config,a=kt.RAINBOW;return{position:"relative",borderRadius:`${t}px`,padding:`${e}px`,background:`linear-gradient(90deg, ${a.join(", ")})`,backgroundSize:"400% 400%",animation:`${this._animationId}-rainbow ${i}s linear infinite`,keyframes:`
        @keyframes ${this._animationId}-rainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 400% 50%; }
        }
      `}}_generateDashStyles(){let{width:e,radius:t,colors:i,duration:a}=this._config;return{position:"relative",borderRadius:`${t}px`,border:`${e}px dashed ${i[0]}`,animation:`${this._animationId}-dash ${a}s linear infinite`,keyframes:`
        @keyframes ${this._animationId}-dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `,svgAnimation:!0}}_generateWaveStyles(){let{width:e,radius:t,colors:i,duration:a}=this._config;return{position:"relative",borderRadius:`${t}px`,border:`${e}px solid transparent`,backgroundImage:`linear-gradient(var(--ha-card-background), var(--ha-card-background)), linear-gradient(90deg, ${i.join(", ")})`,backgroundOrigin:"border-box",backgroundClip:"padding-box, border-box",animation:`${this._animationId}-wave ${a}s ease-in-out infinite`,keyframes:`
        @keyframes ${this._animationId}-wave {
          0%, 100% { border-width: ${e}px; }
          50% { border-width: ${e+2}px; }
        }
      `}}_generateNeonStyles(){let{width:e,radius:t,colors:i,glowSize:a,duration:r}=this._config,o=i[0];return{position:"relative",borderRadius:`${t}px`,border:`${e}px solid ${o}`,boxShadow:`
        0 0 ${a/2}px ${o},
        0 0 ${a}px ${o},
        0 0 ${a*2}px ${o},
        inset 0 0 ${a/2}px ${o}
      `,animation:`${this._animationId}-neon ${r}s ease-in-out infinite alternate`,keyframes:`
        @keyframes ${this._animationId}-neon {
          from {
            box-shadow:
              0 0 ${a/2}px ${o},
              0 0 ${a}px ${o},
              0 0 ${a*2}px ${o},
              inset 0 0 ${a/2}px ${o};
          }
          to {
            box-shadow:
              0 0 ${a}px ${o},
              0 0 ${a*2}px ${o},
              0 0 ${a*3}px ${o},
              0 0 ${a*4}px ${o},
              inset 0 0 ${a}px ${o};
          }
        }
      `}}_generateShimmerStyles(){let{width:e,radius:t,colors:i,duration:a}=this._config;return{position:"relative",borderRadius:`${t}px`,padding:`${e}px`,background:`linear-gradient(90deg, transparent 0%, ${i[0]}40 50%, transparent 100%), ${i[0]}`,backgroundSize:"200% 100%, 100% 100%",animation:`${this._animationId}-shimmer ${a}s linear infinite`,keyframes:`
        @keyframes ${this._animationId}-shimmer {
          from { background-position: -200% 0, 0 0; }
          to { background-position: 200% 0, 0 0; }
        }
      `}}apply(e){let t=this.generateStyles();t.keyframes&&this._injectKeyframes(t.keyframes);for(let[i,a]of Object.entries(t))i!=="keyframes"&&i!=="svgAnimation"&&(e.style[i]=a);t.svgAnimation&&this._applySvgBorder(e),e.classList.add("uc-border-animated"),e.dataset.borderAnimation=this._config.type}_injectKeyframes(e){if(this._styleElement){this._styleElement.textContent=e;return}this._styleElement=document.createElement("style"),this._styleElement.textContent=e,this._styleElement.setAttribute("data-uc-border",this._animationId),document.head.appendChild(this._styleElement)}_applySvgBorder(e){let t=e.getBoundingClientRect(),{width:i,radius:a,colors:r,duration:o}=this._config,n=document.createElementNS("http://www.w3.org/2000/svg","svg");n.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: visible;
    `,n.innerHTML=`
      <rect 
        x="${i/2}" 
        y="${i/2}" 
        width="calc(100% - ${i}px)" 
        height="calc(100% - ${i}px)"
        rx="${a}"
        fill="none"
        stroke="${r[0]}"
        stroke-width="${i}"
        stroke-dasharray="10 5"
        stroke-linecap="round"
      >
        <animate 
          attributeName="stroke-dashoffset"
          from="0"
          to="-30"
          dur="${o}s"
          repeatCount="indefinite"
        />
      </rect>
    `,e.style.position="relative",e.appendChild(n)}remove(e){let t=["position","borderRadius","padding","background","backgroundSize","backgroundImage","backgroundOrigin","backgroundClip","border","boxShadow","animation"];for(let a of t)e.style[a]="";let i=e.querySelector("svg");i&&i.remove(),this._styleElement&&(this._styleElement.remove(),this._styleElement=null),e.classList.remove("uc-border-animated"),delete e.dataset.borderAnimation}static getStyles(){return`
      .uc-border-animated {
        isolation: isolate;
      }

      .uc-border-animated::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        pointer-events: none;
        z-index: -1;
      }

      /* \u0423\u0442\u0438\u043B\u0438\u0442\u0430\u0440\u043D\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u044B */
      .uc-border-gradient {
        background: linear-gradient(90deg, var(--primary-color), var(--accent-color, #6366f1));
        background-size: 200% 200%;
        animation: uc-border-gradient-anim 3s ease infinite;
      }

      @keyframes uc-border-gradient-anim {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .uc-border-glow {
        box-shadow: 0 0 10px var(--primary-color);
        animation: uc-border-glow-anim 2s ease-in-out infinite;
      }

      @keyframes uc-border-glow-anim {
        0%, 100% { box-shadow: 0 0 10px var(--primary-color); }
        50% { box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-color); }
      }

      .uc-border-rainbow {
        background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff, #ff0000);
        background-size: 400% 400%;
        animation: uc-border-rainbow-anim 3s linear infinite;
      }

      @keyframes uc-border-rainbow-anim {
        0% { background-position: 0% 50%; }
        100% { background-position: 400% 50%; }
      }
    `}};var C={TRANSFORM:"transform",SHADOW:"shadow",GLOW:"glow",OVERLAY:"overlay",BORDER:"border",BACKGROUND:"background"},St={lift:{category:C.TRANSFORM,name:"Lift",description:"\u041F\u0440\u0438\u043F\u043E\u0434\u043D\u0438\u043C\u0430\u043D\u0438\u0435",styles:{transition:"transform 0.3s ease, box-shadow 0.3s ease",":hover":{transform:"translateY(-4px)",boxShadow:"0 12px 24px rgba(0, 0, 0, 0.15)"}}},scale:{category:C.TRANSFORM,name:"Scale",description:"\u0423\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u0438\u0435",styles:{transition:"transform 0.3s ease",":hover":{transform:"scale(1.02)"}}},tilt:{category:C.TRANSFORM,name:"Tilt",description:"\u041D\u0430\u043A\u043B\u043E\u043D",styles:{transition:"transform 0.3s ease",":hover":{transform:"perspective(1000px) rotateX(5deg) rotateY(5deg)"}},interactive:!0},float:{category:C.TRANSFORM,name:"Float",description:"\u041F\u043B\u0430\u0432\u0430\u043D\u0438\u0435",styles:{transition:"transform 0.3s ease, box-shadow 0.3s ease",":hover":{transform:"translateY(-8px) scale(1.01)",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.2)"}}},push:{category:C.TRANSFORM,name:"Push",description:"\u0412\u0434\u0430\u0432\u043B\u0438\u0432\u0430\u043D\u0438\u0435",styles:{transition:"transform 0.2s ease, box-shadow 0.2s ease",":hover":{transform:"scale(0.98)",boxShadow:"inset 0 2px 4px rgba(0, 0, 0, 0.1)"}}},rotate:{category:C.TRANSFORM,name:"Rotate",description:"\u041B\u0451\u0433\u043A\u0438\u0439 \u043F\u043E\u0432\u043E\u0440\u043E\u0442",styles:{transition:"transform 0.3s ease",":hover":{transform:"rotate(1deg)"}}},shadowLift:{category:C.SHADOW,name:"Shadow Lift",description:"\u0422\u0435\u043D\u044C \u0441 \u043F\u043E\u0434\u044A\u0451\u043C\u043E\u043C",styles:{boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)",transition:"box-shadow 0.3s ease, transform 0.3s ease",":hover":{boxShadow:"0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)",transform:"translateY(-2px)"}}},shadowGrow:{category:C.SHADOW,name:"Shadow Grow",description:"\u0420\u0430\u0441\u0442\u0443\u0449\u0430\u044F \u0442\u0435\u043D\u044C",styles:{boxShadow:"0 2px 4px rgba(0, 0, 0, 0.1)",transition:"box-shadow 0.3s ease",":hover":{boxShadow:"0 8px 30px rgba(0, 0, 0, 0.2)"}}},shadowColor:{category:C.SHADOW,name:"Shadow Color",description:"\u0426\u0432\u0435\u0442\u043D\u0430\u044F \u0442\u0435\u043D\u044C",styles:{transition:"box-shadow 0.3s ease",":hover":{boxShadow:"0 10px 30px var(--primary-color, rgba(99, 102, 241, 0.3))"}}},shadowInset:{category:C.SHADOW,name:"Shadow Inset",description:"\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u0442\u0435\u043D\u044C",styles:{transition:"box-shadow 0.3s ease",":hover":{boxShadow:"inset 0 4px 8px rgba(0, 0, 0, 0.1)"}}},glow:{category:C.GLOW,name:"Glow",description:"\u0421\u0432\u0435\u0447\u0435\u043D\u0438\u0435",styles:{transition:"box-shadow 0.3s ease",":hover":{boxShadow:"0 0 20px var(--primary-color, rgba(99, 102, 241, 0.5))"}}},glowPulse:{category:C.GLOW,name:"Glow Pulse",description:"\u041F\u0443\u043B\u044C\u0441\u0438\u0440\u0443\u044E\u0449\u0435\u0435 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u0435",styles:{transition:"box-shadow 0.3s ease",":hover":{animation:"uc-hover-glow-pulse 1.5s ease-in-out infinite"}}},neon:{category:C.GLOW,name:"Neon",description:"\u041D\u0435\u043E\u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u0435",styles:{transition:"box-shadow 0.3s ease, border-color 0.3s ease",":hover":{borderColor:"var(--primary-color)",boxShadow:`
          0 0 5px var(--primary-color),
          0 0 10px var(--primary-color),
          0 0 20px var(--primary-color),
          0 0 40px var(--primary-color)
        `}}},shine:{category:C.OVERLAY,name:"Shine",description:"\u0411\u043B\u0435\u0441\u043A",styles:{position:"relative",overflow:"hidden",":hover::after":{content:'""',position:"absolute",top:"-50%",left:"-50%",width:"200%",height:"200%",background:"linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",transform:"rotate(30deg)",animation:"uc-hover-shine 0.75s ease-out"}},requiresPseudo:!0},overlay:{category:C.OVERLAY,name:"Overlay",description:"\u0417\u0430\u0442\u0435\u043C\u043D\u0435\u043D\u0438\u0435",styles:{position:"relative",":hover::after":{content:'""',position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0, 0, 0, 0.1)",borderRadius:"inherit",pointerEvents:"none"}},requiresPseudo:!0},gradient:{category:C.OVERLAY,name:"Gradient",description:"\u0413\u0440\u0430\u0434\u0438\u0435\u043D\u0442\u043D\u043E\u0435 \u043D\u0430\u043B\u043E\u0436\u0435\u043D\u0438\u0435",styles:{position:"relative",":hover::after":{content:'""',position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(135deg, var(--primary-color, rgba(99, 102, 241, 0.1)) 0%, transparent 100%)",borderRadius:"inherit",pointerEvents:"none"}},requiresPseudo:!0},borderHighlight:{category:C.BORDER,name:"Border Highlight",description:"\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u0433\u0440\u0430\u043D\u0438\u0446\u044B",styles:{border:"2px solid transparent",transition:"border-color 0.3s ease",":hover":{borderColor:"var(--primary-color)"}}},borderGradient:{category:C.BORDER,name:"Border Gradient",description:"\u0413\u0440\u0430\u0434\u0438\u0435\u043D\u0442\u043D\u0430\u044F \u0433\u0440\u0430\u043D\u0438\u0446\u0430",styles:{position:"relative",":hover::before":{content:'""',position:"absolute",top:-2,left:-2,right:-2,bottom:-2,background:"linear-gradient(90deg, var(--primary-color), var(--accent-color, #6366f1))",borderRadius:"inherit",zIndex:-1}},requiresPseudo:!0},bgBrighten:{category:C.BACKGROUND,name:"Brighten",description:"\u041E\u0441\u0432\u0435\u0442\u043B\u0435\u043D\u0438\u0435 \u0444\u043E\u043D\u0430",styles:{transition:"filter 0.3s ease",":hover":{filter:"brightness(1.05)"}}},bgDarken:{category:C.BACKGROUND,name:"Darken",description:"\u0417\u0430\u0442\u0435\u043C\u043D\u0435\u043D\u0438\u0435 \u0444\u043E\u043D\u0430",styles:{transition:"filter 0.3s ease",":hover":{filter:"brightness(0.95)"}}},bgColor:{category:C.BACKGROUND,name:"Color Shift",description:"\u0421\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0446\u0432\u0435\u0442\u0430",styles:{transition:"background-color 0.3s ease",":hover":{backgroundColor:"var(--primary-color, rgba(99, 102, 241, 0.1))"}}}},Ct=class{constructor(e,t={}){this._element=e,this._config={effect:"lift",duration:.3,customStyles:{},...t},this._styleElement=null,this._effectId=`uc-hover-${Math.random().toString(36).substr(2,9)}`}setEffect(e){St[e]&&(this._config.effect=e)}getEffect(){return St[this._config.effect]||St.lift}apply(){let e=this.getEffect();for(let[t,i]of Object.entries(e.styles))t.startsWith(":")||(this._element.style[t]=i);this._injectStyles(e),this._element.classList.add("uc-hover-effect",this._effectId)}_injectStyles(e){this._styleElement&&this._styleElement.remove();let t=e.styles[":hover"]||{},i=e.styles[":hover::before"]||{},a=e.styles[":hover::after"]||{},r="";Object.keys(t).length>0&&(r+=`.${this._effectId}:hover { ${this._objectToCSS(t)} }
`),(e.styles["::before"]||Object.keys(i).length>0)&&(r+=`.${this._effectId}::before { content: ''; ${this._objectToCSS(e.styles["::before"]||{})} }
`,r+=`.${this._effectId}:hover::before { ${this._objectToCSS(i)} }
`),Object.keys(a).length>0&&(r+=`.${this._effectId}::after { content: ''; position: absolute; opacity: 0; transition: opacity 0.3s ease; }
`,r+=`.${this._effectId}:hover::after { opacity: 1; ${this._objectToCSS(a)} }
`),this._styleElement=document.createElement("style"),this._styleElement.textContent=r,this._styleElement.setAttribute("data-uc-hover",this._effectId),document.head.appendChild(this._styleElement)}_objectToCSS(e){return Object.entries(e).filter(([t])=>!t.startsWith(":")).map(([t,i])=>`${t.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${i}`).join("; ")}remove(){this._element.classList.remove("uc-hover-effect",this._effectId),this._styleElement&&(this._styleElement.remove(),this._styleElement=null)}static applyTilt(e,t={}){let{max:i=10,perspective:a=1e3,scale:r=1.02}=t;e.style.transition="transform 0.1s ease-out",e.style.transformStyle="preserve-3d";let o=c=>{let l=e.getBoundingClientRect(),d=c.clientX-l.left,u=c.clientY-l.top,p=l.width/2,h=l.height/2,g=(u-h)/h*-i,b=(d-p)/p*i;e.style.transform=`perspective(${a}px) rotateX(${g}deg) rotateY(${b}deg) scale(${r})`},n=()=>{e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale(1)"};return e.addEventListener("mousemove",o),e.addEventListener("mouseleave",n),()=>{e.removeEventListener("mousemove",o),e.removeEventListener("mouseleave",n)}}static getStyles(){let e=[];for(let[t,i]of Object.entries(St)){let a=`uc-hover-${t}`,r={...i.styles};delete r[":hover"],delete r[":hover::before"],delete r[":hover::after"],e.push(`
        .${a} {
          ${Object.entries(r).filter(([o])=>!o.startsWith(":")).map(([o,n])=>`${o.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${n}`).join("; ")}
        }
      `),i.styles[":hover"]&&e.push(`
          .${a}:hover {
            ${Object.entries(i.styles[":hover"]).map(([o,n])=>`${o.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${n}`).join("; ")}
          }
        `)}return e.push(`
      @keyframes uc-hover-shine {
        from { transform: translateX(-100%) rotate(30deg); }
        to { transform: translateX(100%) rotate(30deg); }
      }

      @keyframes uc-hover-glow-pulse {
        0%, 100% { box-shadow: 0 0 20px var(--primary-color, rgba(99, 102, 241, 0.5)); }
        50% { box-shadow: 0 0 40px var(--primary-color, rgba(99, 102, 241, 0.8)); }
      }

      /* \u0411\u0430\u0437\u043E\u0432\u044B\u0435 \u0443\u0442\u0438\u043B\u0438\u0442\u0430\u0440\u043D\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u044B */
      .uc-hover-effect {
        cursor: pointer;
      }

      .uc-hover-disabled {
        pointer-events: none;
      }
    `),e.join(`
`)}};var _e={light:{name:"Light",type:"light",colors:{background:"#ffffff",surface:"#f5f5f5",primary:"#6366f1",secondary:"#8b5cf6",accent:"#06b6d4",text:"#1f2937",textSecondary:"#6b7280",border:"#e5e7eb",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6"}},paper:{name:"Paper",type:"light",colors:{background:"#faf8f5",surface:"#f5f2ed",primary:"#8b7355",secondary:"#a67c52",accent:"#c49a6c",text:"#3d3d3d",textSecondary:"#6b6b6b",border:"#e0dcd5",success:"#5d8a66",warning:"#c9a227",error:"#b54040",info:"#5a7fa6"}},cream:{name:"Cream",type:"light",colors:{background:"#fffdf7",surface:"#fff9e6",primary:"#d4a574",secondary:"#c49570",accent:"#e6c88a",text:"#4a4540",textSecondary:"#7d7267",border:"#ece4d4",success:"#7db47d",warning:"#e0b050",error:"#d47070",info:"#70a0c0"}},dark:{name:"Dark",type:"dark",colors:{background:"#1a1a2e",surface:"#16213e",primary:"#6366f1",secondary:"#8b5cf6",accent:"#06b6d4",text:"#f1f5f9",textSecondary:"#94a3b8",border:"#334155",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6"}},midnight:{name:"Midnight",type:"dark",colors:{background:"#0f0f1a",surface:"#1a1a2e",primary:"#818cf8",secondary:"#a78bfa",accent:"#22d3ee",text:"#e2e8f0",textSecondary:"#94a3b8",border:"#2d2d44",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa"}},amoled:{name:"AMOLED",type:"dark",colors:{background:"#000000",surface:"#0a0a0a",primary:"#6366f1",secondary:"#8b5cf6",accent:"#06b6d4",text:"#ffffff",textSecondary:"#a1a1aa",border:"#27272a",success:"#22c55e",warning:"#eab308",error:"#ef4444",info:"#3b82f6"}},ocean:{name:"Ocean",type:"dark",colors:{background:"#0c1929",surface:"#132f4c",primary:"#00a9ff",secondary:"#0091ea",accent:"#00e5ff",text:"#e3f2fd",textSecondary:"#90caf9",border:"#1e4976",success:"#4caf50",warning:"#ffc107",error:"#ff5252",info:"#29b6f6"}},forest:{name:"Forest",type:"dark",colors:{background:"#1a2f1a",surface:"#2d4a2d",primary:"#4caf50",secondary:"#66bb6a",accent:"#a5d6a7",text:"#e8f5e9",textSecondary:"#a5d6a7",border:"#3d6b3d",success:"#81c784",warning:"#ffd54f",error:"#ef5350",info:"#4fc3f7"}},sunset:{name:"Sunset",type:"dark",colors:{background:"#2d1f2f",surface:"#4a2d4a",primary:"#ff6b6b",secondary:"#feca57",accent:"#ff9ff3",text:"#fff5f5",textSecondary:"#ffb8b8",border:"#5c3a5c",success:"#7bed9f",warning:"#ffeaa7",error:"#ff6b6b",info:"#74b9ff"}},lavender:{name:"Lavender",type:"light",colors:{background:"#f5f0ff",surface:"#ede4ff",primary:"#7c3aed",secondary:"#8b5cf6",accent:"#c4b5fd",text:"#3b0764",textSecondary:"#6b21a8",border:"#d8b4fe",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#6366f1"}},rose:{name:"Rose",type:"light",colors:{background:"#fff5f7",surface:"#ffe4e6",primary:"#f43f5e",secondary:"#fb7185",accent:"#fda4af",text:"#4c0519",textSecondary:"#881337",border:"#fecdd3",success:"#10b981",warning:"#f59e0b",error:"#e11d48",info:"#3b82f6"}},neon:{name:"Neon",type:"dark",colors:{background:"#0a0a0a",surface:"#141414",primary:"#00ff88",secondary:"#ff00ff",accent:"#00ffff",text:"#ffffff",textSecondary:"#888888",border:"#333333",success:"#00ff88",warning:"#ffff00",error:"#ff0055",info:"#00ffff"}},cyberpunk:{name:"Cyberpunk",type:"dark",colors:{background:"#0d0221",surface:"#1a0a3e",primary:"#ff00ff",secondary:"#00ffff",accent:"#ffff00",text:"#ffffff",textSecondary:"#b794f6",border:"#3d1a78",success:"#00ff88",warning:"#ffff00",error:"#ff0055",info:"#00ffff"}},terminal:{name:"Terminal",type:"dark",colors:{background:"#0c0c0c",surface:"#1a1a1a",primary:"#00ff00",secondary:"#00cc00",accent:"#88ff88",text:"#00ff00",textSecondary:"#00aa00",border:"#004400",success:"#00ff00",warning:"#ffff00",error:"#ff0000",info:"#00ffff"}},sepia:{name:"Sepia",type:"light",colors:{background:"#f4ecd8",surface:"#e8dcc8",primary:"#8b4513",secondary:"#a0522d",accent:"#cd853f",text:"#3e2723",textSecondary:"#5d4037",border:"#d7cbb9",success:"#558b2f",warning:"#f9a825",error:"#c62828",info:"#0277bd"}}},Tt=class{constructor(e={}){this._config={scheme:"light",customColors:{},...e}}setScheme(e){_e[e]&&(this._config.scheme=e)}getScheme(){let e=_e[this._config.scheme]||_e.light;return{...e,colors:{...e.colors,...this._config.customColors}}}getColor(e){return this.getScheme().colors[e]||e}setCustomColor(e,t){this._config.customColors[e]=t}generateCSSVariables(){let e=this.getScheme(),t={};for(let[i,a]of Object.entries(e.colors)){t[`--uc-${this._kebabCase(i)}`]=a;let r=this._hexToRgb(a);r&&(t[`--uc-${this._kebabCase(i)}-rgb`]=`${r.r}, ${r.g}, ${r.b}`)}return t}apply(e){let t=this.generateCSSVariables();for(let[i,a]of Object.entries(t))e.style.setProperty(i,a);e.dataset.colorScheme=this._config.scheme,e.classList.add("uc-color-scheme")}remove(e){let t=this.getScheme();for(let i of Object.keys(t.colors))e.style.removeProperty(`--uc-${this._kebabCase(i)}`),e.style.removeProperty(`--uc-${this._kebabCase(i)}-rgb`);delete e.dataset.colorScheme,e.classList.remove("uc-color-scheme")}_kebabCase(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}_hexToRgb(e){if(!e.startsWith("#"))return null;let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}static getSchemeNames(){return Object.keys(_e)}static getSchemesByType(e){let t={};for(let[i,a]of Object.entries(_e))a.type===e&&(t[i]=a);return t}static getStyles(){let e=[];for(let[t,i]of Object.entries(_e)){let a=Object.entries(i.colors).map(([r,o])=>`--uc-${r.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}: ${o}`).join(`;
    `);e.push(`
        .uc-scheme-${t},
        [data-color-scheme="${t}"] {
          ${a};
        }
      `)}return e.push(`
      /* \u0426\u0432\u0435\u0442\u0430 \u0442\u0435\u043A\u0441\u0442\u0430 */
      .uc-text-primary { color: var(--uc-text); }
      .uc-text-secondary { color: var(--uc-text-secondary); }
      .uc-text-success { color: var(--uc-success); }
      .uc-text-warning { color: var(--uc-warning); }
      .uc-text-error { color: var(--uc-error); }
      .uc-text-info { color: var(--uc-info); }

      /* \u0426\u0432\u0435\u0442\u0430 \u0444\u043E\u043D\u0430 */
      .uc-bg-background { background-color: var(--uc-background); }
      .uc-bg-surface { background-color: var(--uc-surface); }
      .uc-bg-primary { background-color: var(--uc-primary); }
      .uc-bg-secondary { background-color: var(--uc-secondary); }
      .uc-bg-accent { background-color: var(--uc-accent); }

      /* \u0426\u0432\u0435\u0442\u0430 \u0433\u0440\u0430\u043D\u0438\u0446 */
      .uc-border-default { border-color: var(--uc-border); }
      .uc-border-primary { border-color: var(--uc-primary); }
      .uc-border-secondary { border-color: var(--uc-secondary); }

      /* \u0410\u0434\u0430\u043F\u0442\u0438\u0432\u043D\u0430\u044F \u0441\u0445\u0435\u043C\u0430 */
      @media (prefers-color-scheme: dark) {
        .uc-scheme-auto {
          ${Object.entries(_e.dark.colors).map(([t,i])=>`--uc-${t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}: ${i}`).join(`;
    `)};
        }
      }

      @media (prefers-color-scheme: light) {
        .uc-scheme-auto {
          ${Object.entries(_e.light.colors).map(([t,i])=>`--uc-${t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}: ${i}`).join(`;
    `)};
        }
      }
    `),e.join(`
`)}};var Y={SPINNER:"spinner",DOTS:"dots",BARS:"bars",PULSE:"pulse",SKELETON:"skeleton",WAVE:"wave",RING:"ring",BOUNCE:"bounce",PROGRESS:"progress",SHIMMER:"shimmer"},Ce={XS:"xs",SM:"sm",MD:"md",LG:"lg",XL:"xl"},Se={[Ce.XS]:{size:16,stroke:2,dotSize:4},[Ce.SM]:{size:24,stroke:2.5,dotSize:6},[Ce.MD]:{size:32,stroke:3,dotSize:8},[Ce.LG]:{size:48,stroke:4,dotSize:10},[Ce.XL]:{size:64,stroke:5,dotSize:12}},$t=class{constructor(e={}){this._config={type:Y.SPINNER,size:Ce.MD,color:"var(--primary-color, #6366f1)",secondaryColor:"var(--primary-color-light, rgba(99, 102, 241, 0.2))",speed:1,...e}}setType(e){Object.values(Y).includes(e)&&(this._config.type=e)}setSize(e){Object.values(Ce).includes(e)&&(this._config.size=e)}create(){let{type:e}=this._config;switch(e){case Y.SPINNER:return this._createSpinner();case Y.DOTS:return this._createDots();case Y.BARS:return this._createBars();case Y.PULSE:return this._createPulse();case Y.SKELETON:return this._createSkeleton();case Y.WAVE:return this._createWave();case Y.RING:return this._createRing();case Y.BOUNCE:return this._createBounce();case Y.PROGRESS:return this._createProgress();case Y.SHIMMER:return this._createShimmer();default:return this._createSpinner()}}_createSpinner(){let e=Se[this._config.size],{size:t,stroke:i}=e,{color:a,secondaryColor:r,speed:o}=this._config,n=document.createElement("div");return n.className="uc-loading uc-loading-spinner",n.innerHTML=`
      <svg width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">
        <circle
          cx="${t/2}"
          cy="${t/2}"
          r="${(t-i)/2}"
          stroke="${r}"
          stroke-width="${i}"
          fill="none"
        />
        <circle
          cx="${t/2}"
          cy="${t/2}"
          r="${(t-i)/2}"
          stroke="${a}"
          stroke-width="${i}"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="${Math.PI*(t-i)*.75}"
          stroke-dashoffset="0"
          style="animation: uc-loading-spin ${1/o}s linear infinite; transform-origin: center;"
        />
      </svg>
    `,n}_createDots(){let e=Se[this._config.size],{dotSize:t}=e,{color:i,speed:a}=this._config,r=document.createElement("div");r.className="uc-loading uc-loading-dots",r.style.gap=`${t/2}px`;for(let o=0;o<3;o++){let n=document.createElement("span");n.style.cssText=`
        width: ${t}px;
        height: ${t}px;
        background: ${i};
        border-radius: 50%;
        animation: uc-loading-dots-bounce ${.6/a}s ease-in-out infinite;
        animation-delay: ${o*.1}s;
      `,r.appendChild(n)}return r}_createBars(){let e=Se[this._config.size],{size:t}=e,{color:i,speed:a}=this._config,r=document.createElement("div");r.className="uc-loading uc-loading-bars",r.style.height=`${t}px`,r.style.gap="3px";for(let o=0;o<5;o++){let n=document.createElement("span");n.style.cssText=`
        width: ${t/8}px;
        height: 100%;
        background: ${i};
        border-radius: 2px;
        animation: uc-loading-bars-scale ${1/a}s ease-in-out infinite;
        animation-delay: ${o*.1}s;
      `,r.appendChild(n)}return r}_createPulse(){let e=Se[this._config.size],{size:t}=e,{color:i,speed:a}=this._config,r=document.createElement("div");return r.className="uc-loading uc-loading-pulse",r.style.cssText=`
      width: ${t}px;
      height: ${t}px;
      background: ${i};
      border-radius: 50%;
      animation: uc-loading-pulse ${1/a}s ease-in-out infinite;
    `,r}_createSkeleton(){let{color:e,secondaryColor:t}=this._config,i=document.createElement("div");return i.className="uc-loading uc-loading-skeleton",i.style.cssText=`
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        ${t} 25%,
        ${e}40 50%,
        ${t} 75%
      );
      background-size: 200% 100%;
      animation: uc-loading-shimmer 1.5s infinite;
      border-radius: inherit;
    `,i}_createWave(){let e=Se[this._config.size],{size:t}=e,{color:i,speed:a}=this._config,r=document.createElement("div");r.className="uc-loading uc-loading-wave",r.style.cssText=`
      display: flex;
      align-items: center;
      gap: 4px;
      height: ${t}px;
    `;for(let o=0;o<5;o++){let n=document.createElement("span");n.style.cssText=`
        width: 4px;
        height: 40%;
        background: ${i};
        border-radius: 2px;
        animation: uc-loading-wave ${1.2/a}s ease-in-out infinite;
        animation-delay: ${o*.1}s;
      `,r.appendChild(n)}return r}_createRing(){let e=Se[this._config.size],{size:t,stroke:i}=e,{color:a,speed:r}=this._config,o=document.createElement("div");return o.className="uc-loading uc-loading-ring",o.style.cssText=`
      width: ${t}px;
      height: ${t}px;
      border: ${i}px solid ${a}30;
      border-top-color: ${a};
      border-radius: 50%;
      animation: uc-loading-spin ${1/r}s linear infinite;
    `,o}_createBounce(){let e=Se[this._config.size],{dotSize:t}=e,{color:i,speed:a}=this._config,r=document.createElement("div");r.className="uc-loading uc-loading-bounce",r.style.cssText=`
      display: flex;
      align-items: flex-end;
      gap: ${t/2}px;
      height: ${t*2}px;
    `;for(let o=0;o<3;o++){let n=document.createElement("span");n.style.cssText=`
        width: ${t}px;
        height: ${t}px;
        background: ${i};
        border-radius: 50%;
        animation: uc-loading-bounce ${.5/a}s ease-in-out infinite alternate;
        animation-delay: ${o*.1}s;
      `,r.appendChild(n)}return r}_createProgress(){let{color:e,secondaryColor:t,speed:i}=this._config,a=document.createElement("div");a.className="uc-loading uc-loading-progress",a.style.cssText=`
      width: 100%;
      height: 4px;
      background: ${t};
      border-radius: 2px;
      overflow: hidden;
    `;let r=document.createElement("div");return r.style.cssText=`
      width: 30%;
      height: 100%;
      background: ${e};
      border-radius: 2px;
      animation: uc-loading-progress ${1.5/i}s ease-in-out infinite;
    `,a.appendChild(r),a}_createShimmer(){let{color:e,secondaryColor:t}=this._config,i=document.createElement("div");return i.className="uc-loading uc-loading-shimmer",i.style.cssText=`
      width: 100%;
      height: 100%;
      background: linear-gradient(
        110deg,
        ${t} 8%,
        ${e}20 18%,
        ${t} 33%
      );
      background-size: 200% 100%;
      animation: uc-loading-shimmer 1.5s linear infinite;
      border-radius: inherit;
    `,i}static getStyles(){return`
      /* \u0411\u0430\u0437\u043E\u0432\u044B\u0435 \u0441\u0442\u0438\u043B\u0438 */
      .uc-loading {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .uc-loading-dots,
      .uc-loading-bars,
      .uc-loading-wave,
      .uc-loading-bounce {
        display: inline-flex;
      }

      /* \u0410\u043D\u0438\u043C\u0430\u0446\u0438\u0438 */
      @keyframes uc-loading-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes uc-loading-dots-bounce {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes uc-loading-bars-scale {
        0%, 40%, 100% {
          transform: scaleY(0.4);
        }
        20% {
          transform: scaleY(1);
        }
      }

      @keyframes uc-loading-pulse {
        0%, 100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        50% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes uc-loading-wave {
        0%, 40%, 100% {
          transform: scaleY(0.4);
        }
        20% {
          transform: scaleY(1);
        }
      }

      @keyframes uc-loading-bounce {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(-100%);
        }
      }

      @keyframes uc-loading-progress {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(400%);
        }
      }

      @keyframes uc-loading-shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      /* \u0423\u0442\u0438\u043B\u0438\u0442\u0430\u0440\u043D\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u044B \u0440\u0430\u0437\u043C\u0435\u0440\u043E\u0432 */
      .uc-loading-xs { transform: scale(0.5); }
      .uc-loading-sm { transform: scale(0.75); }
      .uc-loading-md { transform: scale(1); }
      .uc-loading-lg { transform: scale(1.5); }
      .uc-loading-xl { transform: scale(2); }

      /* \u041E\u0432\u0435\u0440\u043B\u0435\u0439 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 */
      .uc-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ha-card-background, rgba(255, 255, 255, 0.8));
        backdrop-filter: blur(4px);
        z-index: 10;
        border-radius: inherit;
      }
    `}};var P={CLICK:"click",TOGGLE:"toggle",SUCCESS:"success",ERROR:"error",NOTIFICATION:"notification",PROGRESS:"progress",FEEDBACK:"feedback"},Fi={ripple:{category:P.CLICK,name:"Ripple",description:"Material Design \u0432\u043E\u043B\u043D\u0430",trigger:"click"},pop:{category:P.CLICK,name:"Pop",description:"\u0411\u044B\u0441\u0442\u0440\u043E\u0435 \u0443\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u0438\u0435",trigger:"click",keyframes:`
      @keyframes uc-micro-pop {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
    `,duration:200},press:{category:P.CLICK,name:"Press",description:"\u041D\u0430\u0436\u0430\u0442\u0438\u0435",trigger:"click",keyframes:`
      @keyframes uc-micro-press {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.97); }
      }
    `,duration:150},flip:{category:P.TOGGLE,name:"Flip",description:"3D \u043F\u0435\u0440\u0435\u0432\u043E\u0440\u043E\u0442",trigger:"toggle",keyframes:`
      @keyframes uc-micro-flip {
        0% { transform: perspective(400px) rotateY(0); }
        100% { transform: perspective(400px) rotateY(180deg); }
      }
    `,duration:400},slide:{category:P.TOGGLE,name:"Slide",description:"\u0421\u043A\u043E\u043B\u044C\u0436\u0435\u043D\u0438\u0435",trigger:"toggle",keyframes:`
      @keyframes uc-micro-slide-on {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      @keyframes uc-micro-slide-off {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `,duration:200},morph:{category:P.TOGGLE,name:"Morph",description:"\u0422\u0440\u0430\u043D\u0441\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u0444\u043E\u0440\u043C\u044B",trigger:"toggle"},checkmark:{category:P.SUCCESS,name:"Checkmark",description:"\u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0433\u0430\u043B\u043E\u0447\u043A\u0430",trigger:"success",svg:`
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path 
          class="uc-checkmark-path"
          d="M4 12 L9 17 L20 6" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `,keyframes:`
      @keyframes uc-micro-checkmark {
        0% { stroke-dashoffset: 24; }
        100% { stroke-dashoffset: 0; }
      }
    `,duration:300},confetti:{category:P.SUCCESS,name:"Confetti",description:"\u041A\u043E\u043D\u0444\u0435\u0442\u0442\u0438",trigger:"success",duration:1e3},celebrate:{category:P.SUCCESS,name:"Celebrate",description:"\u041F\u0440\u0430\u0437\u0434\u043D\u043E\u0432\u0430\u043D\u0438\u0435",trigger:"success",keyframes:`
      @keyframes uc-micro-celebrate {
        0%, 100% { transform: scale(1) rotate(0); }
        25% { transform: scale(1.2) rotate(-5deg); }
        50% { transform: scale(1.2) rotate(5deg); }
        75% { transform: scale(1.1) rotate(-3deg); }
      }
    `,duration:500},shake:{category:P.ERROR,name:"Shake",description:"\u0422\u0440\u044F\u0441\u043A\u0430",trigger:"error",keyframes:`
      @keyframes uc-micro-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `,duration:500},cross:{category:P.ERROR,name:"Cross",description:"\u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043A\u0440\u0435\u0441\u0442\u0438\u043A",trigger:"error",svg:`
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path 
          class="uc-cross-path-1"
          d="M6 6 L18 18" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="3"
          stroke-linecap="round"
        />
        <path 
          class="uc-cross-path-2"
          d="M18 6 L6 18" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    `,duration:300},bell:{category:P.NOTIFICATION,name:"Bell",description:"\u0417\u0432\u043E\u043D\u043E\u043A \u043A\u043E\u043B\u043E\u043A\u043E\u043B\u044C\u0447\u0438\u043A\u0430",trigger:"notification",keyframes:`
      @keyframes uc-micro-bell {
        0%, 100% { transform: rotate(0); }
        10%, 30% { transform: rotate(10deg); }
        20%, 40% { transform: rotate(-10deg); }
        50% { transform: rotate(5deg); }
        60% { transform: rotate(-5deg); }
        70% { transform: rotate(2deg); }
        80% { transform: rotate(-2deg); }
      }
    `,duration:600},badge:{category:P.NOTIFICATION,name:"Badge",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0431\u0435\u0439\u0434\u0436\u0430",trigger:"notification",keyframes:`
      @keyframes uc-micro-badge {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
    `,duration:300},heartbeat:{category:P.FEEDBACK,name:"Heartbeat",description:"\u0421\u0435\u0440\u0434\u0446\u0435\u0431\u0438\u0435\u043D\u0438\u0435",trigger:"feedback",keyframes:`
      @keyframes uc-micro-heartbeat {
        0%, 100% { transform: scale(1); }
        14% { transform: scale(1.3); }
        28% { transform: scale(1); }
        42% { transform: scale(1.3); }
        70% { transform: scale(1); }
      }
    `,duration:800},thumb:{category:P.FEEDBACK,name:"Thumb",description:"\u041B\u0430\u0439\u043A",trigger:"feedback",keyframes:`
      @keyframes uc-micro-thumb {
        0% { transform: scale(1); }
        30% { transform: scale(1.2) rotate(-15deg); }
        50% { transform: scale(1.3) rotate(0deg); }
        70% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
    `,duration:500}},At=class{constructor(){this._injectedStyles=new Set}play(e,t,i={}){let a=Fi[t];if(!a){console.warn(`[MicroInteractions] Unknown interaction: ${t}`);return}switch(a.keyframes&&!this._injectedStyles.has(t)&&this._injectStyles(t,a.keyframes),t){case"ripple":this._playRipple(e,i);break;case"confetti":this._playConfetti(e,i);break;case"checkmark":case"cross":this._playSvgAnimation(e,a,i);break;default:this._playKeyframeAnimation(e,a,i)}}_playRipple(e,t={}){let{x:i,y:a,color:r="var(--primary-color, rgba(99, 102, 241, 0.3))"}=t,o=e.getBoundingClientRect(),n=i!==void 0?i-o.left:o.width/2,c=a!==void 0?a-o.top:o.height/2,l=Math.max(o.width,o.height)*2,d=document.createElement("span");d.className="uc-ripple",d.style.cssText=`
      position: absolute;
      width: ${l}px;
      height: ${l}px;
      left: ${n-l/2}px;
      top: ${c-l/2}px;
      background: ${r};
      border-radius: 50%;
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
      animation: uc-micro-ripple 0.6s ease-out forwards;
    `,e.style.position="relative",e.style.overflow="hidden",e.appendChild(d),setTimeout(()=>d.remove(),600)}_playConfetti(e,t={}){let{count:i=30,colors:a=["#ff0","#f0f","#0ff","#f00","#0f0"]}=t,r=e.getBoundingClientRect(),o=document.createElement("div");o.className="uc-confetti-container",o.style.cssText=`
      position: fixed;
      top: ${r.top+r.height/2}px;
      left: ${r.left+r.width/2}px;
      pointer-events: none;
      z-index: 10000;
    `;for(let n=0;n<i;n++){let c=document.createElement("span"),l=a[Math.floor(Math.random()*a.length)],d=Math.random()*360*(Math.PI/180),u=50+Math.random()*100,p=Math.cos(d)*u,h=Math.sin(d)*u,g=Math.random()*360;c.style.cssText=`
        position: absolute;
        width: ${4+Math.random()*4}px;
        height: ${4+Math.random()*4}px;
        background: ${l};
        transform: rotate(${g}deg);
        animation: uc-confetti-fall 1s ease-out forwards;
        --x: ${p}px;
        --y: ${h}px;
      `,o.appendChild(c)}document.body.appendChild(o),setTimeout(()=>o.remove(),1e3)}_playSvgAnimation(e,t,i={}){let a=document.createElement("div");a.innerHTML=t.svg,a.style.cssText=`
      display: inline-flex;
      color: ${i.color||"currentColor"};
    `,a.querySelectorAll("path").forEach((o,n)=>{let c=o.getTotalLength();o.style.strokeDasharray=c,o.style.strokeDashoffset=c,o.style.animation=`uc-micro-draw ${t.duration}ms ease forwards`,o.style.animationDelay=`${n*100}ms`}),i.target?(i.target.innerHTML="",i.target.appendChild(a)):(e.appendChild(a),setTimeout(()=>a.remove(),t.duration+200))}_playKeyframeAnimation(e,t,i={}){let a=`uc-micro-${t.name.toLowerCase()}`,r=i.duration||t.duration;e.style.animation=`${a} ${r}ms ease`;let o=()=>{var n;e.style.animation="",e.removeEventListener("animationend",o),(n=i.onComplete)==null||n.call(i)};e.addEventListener("animationend",o)}_injectStyles(e,t){let i=document.createElement("style");i.textContent=t,i.setAttribute("data-uc-micro",e),document.head.appendChild(i),this._injectedStyles.add(e)}bind(e,t,i,a={}){let r=o=>{let n={...a};o.clientX!==void 0&&(n.x=o.clientX,n.y=o.clientY),this.play(e,i,n)};return e.addEventListener(t,r),()=>e.removeEventListener(t,r)}static getStyles(){let e=[];for(let[t,i]of Object.entries(Fi))i.keyframes&&e.push(i.keyframes);return e.push(`
      /* Ripple \u044D\u0444\u0444\u0435\u043A\u0442 */
      @keyframes uc-micro-ripple {
        to {
          transform: scale(1);
          opacity: 0;
        }
      }

      .uc-ripple {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      }

      /* Confetti */
      @keyframes uc-confetti-fall {
        0% {
          transform: translate(0, 0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translate(var(--x), calc(var(--y) + 200px)) rotate(720deg);
          opacity: 0;
        }
      }

      /* SVG \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0435 */
      @keyframes uc-micro-draw {
        to {
          stroke-dashoffset: 0;
        }
      }

      /* \u0423\u0442\u0438\u043B\u0438\u0442\u0430\u0440\u043D\u044B\u0435 \u043A\u043B\u0430\u0441\u0441\u044B */
      .uc-micro-disabled {
        pointer-events: none;
      }

      .uc-micro-active {
        animation-play-state: running;
      }

      .uc-micro-paused {
        animation-play-state: paused;
      }
    `),e.join(`
`)}};var ba={GET:"GET",POST:"POST",PUT:"PUT",PATCH:"PATCH",DELETE:"DELETE"},Te={RAW:"raw",VALUE:"value",TABLE:"table",LIST:"list",TEMPLATE:"template",CHART:"chart"},Bi={url:"",method:ba.GET,headers:{},body:null,refresh_interval:0,timeout:1e4,cache_ttl:6e4,display_format:Te.VALUE,value_path:"",template:"",transform:null,error_message:"\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445",loading_message:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...",show_timestamp:!1,authentication:null},Lt=class{constructor(e,t={}){this._hass=e,this._config={...Bi,...t},this._element=null,this._data=null,this._error=null,this._loading=!1,this._lastFetch=0,this._refreshInterval=null,this._cache=new Map,this._abortController=null}set hass(e){this._hass=e}setConfig(e){this._config={...Bi,...e},this._stopAutoRefresh(),this._config.refresh_interval>0&&this._startAutoRefresh()}render(){return this._element=document.createElement("div"),this._element.className="uc-rest-widget",this._updateDisplay(),this._fetchData(),this._element}async _fetchData(){let{url:e,method:t,headers:i,body:a,timeout:r,cache_ttl:o}=this._config;if(!e){this._error="URL \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D",this._updateDisplay();return}let n=this._getCacheKey(),c=this._cache.get(n);if(c&&Date.now()-c.timestamp<o){this._data=c.data,this._updateDisplay();return}this._abortController&&this._abortController.abort(),this._abortController=new AbortController,this._loading=!0,this._error=null,this._updateDisplay();try{let l=this._processTemplate(e),d={...i};if(this._config.authentication){let g=this._config.authentication;if(g.type==="bearer")d.Authorization=`Bearer ${g.token}`;else if(g.type==="basic"){let b=btoa(`${g.username}:${g.password}`);d.Authorization=`Basic ${b}`}else g.type==="api_key"&&(d[g.header||"X-API-Key"]=g.key)}let u=await fetch(l,{method:t,headers:d,body:a?JSON.stringify(this._processTemplate(a)):null,signal:this._abortController.signal,timeout:r});if(!u.ok)throw new Error(`HTTP ${u.status}: ${u.statusText}`);let p=u.headers.get("content-type"),h;p!=null&&p.includes("application/json")?h=await u.json():h=await u.text(),this._config.transform&&(h=this._applyTransform(h)),this._cache.set(n,{data:h,timestamp:Date.now()}),this._data=h,this._lastFetch=Date.now(),this._loading=!1,this._error=null}catch(l){if(l.name==="AbortError")return;this._loading=!1,this._error=l.message||this._config.error_message,console.error("[RestApiWidget] Fetch error:",l)}this._updateDisplay()}_getCacheKey(){let{url:e,method:t,body:i}=this._config;return`${t}:${e}:${JSON.stringify(i||{})}`}_processTemplate(e){if(typeof e=="string")return e.replace(/\{\{\s*(\w+\.\w+)\s*\}\}/g,(t,i)=>{var a,r,o;return((o=(r=(a=this._hass)==null?void 0:a.states)==null?void 0:r[i])==null?void 0:o.state)||t});if(typeof e=="object"&&e!==null){let t=Array.isArray(e)?[]:{};for(let[i,a]of Object.entries(e))t[i]=this._processTemplate(a);return t}return e}_applyTransform(e){let t=this._config.transform;if(typeof t=="function")return t(e);if(typeof t=="string")try{return new Function("data",`return ${t}`)(e)}catch(i){return console.error("[RestApiWidget] Transform error:",i),e}return e}_getValueByPath(e,t){var r;if(!t)return e;let i=t.split("."),a=e;for(let o of i){let n=o.match(/^(\w+)\[(\d+)\]$/);if(n?a=(r=a==null?void 0:a[n[1]])==null?void 0:r[parseInt(n[2])]:a=a==null?void 0:a[o],a===void 0)return}return a}_updateDisplay(){var n;if(!this._element)return;if(this._loading){this._element.innerHTML=`
        <div class="uc-rest-loading">
          <div class="uc-rest-spinner"></div>
          <span>${this._config.loading_message}</span>
        </div>
      `;return}if(this._error){this._element.innerHTML=`
        <div class="uc-rest-error">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <span>${this._error}</span>
          <button class="uc-rest-retry">\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button>
        </div>
      `,(n=this._element.querySelector(".uc-rest-retry"))==null||n.addEventListener("click",()=>{this._fetchData()});return}let{display_format:e,value_path:t,template:i,show_timestamp:a}=this._config,r=this._getValueByPath(this._data,t),o="";switch(e){case Te.RAW:o=`<pre class="uc-rest-raw">${JSON.stringify(r,null,2)}</pre>`;break;case Te.VALUE:o=`<div class="uc-rest-value">${this._formatValue(r)}</div>`;break;case Te.TABLE:o=this._renderTable(r);break;case Te.LIST:o=this._renderList(r);break;case Te.TEMPLATE:o=this._renderTemplate(i,r);break;case Te.CHART:o=this._renderChart(r);break;default:o=`<div class="uc-rest-value">${this._formatValue(r)}</div>`}if(a&&this._lastFetch){let c=new Date(this._lastFetch).toLocaleTimeString();o+=`<div class="uc-rest-timestamp">\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E: ${c}</div>`}this._element.innerHTML=o}_formatValue(e){return e==null?"-":typeof e=="object"?JSON.stringify(e):String(e)}_renderTable(e){if(!e)return'<div class="uc-rest-empty">\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445</div>';let t=Array.isArray(e)?e:[e];if(t.length===0)return'<div class="uc-rest-empty">\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445</div>';let i=Object.keys(t[0]||{});return`
      <table class="uc-rest-table">
        <thead>
          <tr>
            ${i.map(a=>`<th>${a}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${t.map(a=>`
            <tr>
              ${i.map(r=>`<td>${this._formatValue(a[r])}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}_renderList(e){return e?`
      <ul class="uc-rest-list">
        ${(Array.isArray(e)?e:Object.entries(e).map(([i,a])=>({key:i,value:a}))).map(i=>typeof i=="object"?i.key!==void 0?`<li><strong>${i.key}:</strong> ${this._formatValue(i.value)}</li>`:`<li>${this._formatValue(i)}</li>`:`<li>${this._formatValue(i)}</li>`).join("")}
      </ul>
    `:'<div class="uc-rest-empty">\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445</div>'}_renderTemplate(e,t){return e?e.replace(/\{\{\s*([\w.[\]]+)\s*\}\}/g,(i,a)=>{let r=this._getValueByPath(t,a);return this._formatValue(r)}):this._formatValue(t)}_renderChart(e){if(!Array.isArray(e)||e.length===0)return'<div class="uc-rest-empty">\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0433\u0440\u0430\u0444\u0438\u043A\u0430</div>';let t=e.map(n=>typeof n=="number"?n:n.value||0),i=Math.max(...t),a=Math.min(...t),r=i-a||1;return`
      <svg class="uc-rest-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points="${t.map((n,c)=>{let l=c/(t.length-1)*100,d=100-(n-a)/r*100;return`${l},${d}`}).join(" ")}"
          fill="none"
          stroke="var(--primary-color)"
          stroke-width="2"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    `}_startAutoRefresh(){this._config.refresh_interval<=0||(this._refreshInterval=setInterval(()=>{this._fetchData()},this._config.refresh_interval*1e3))}_stopAutoRefresh(){this._refreshInterval&&(clearInterval(this._refreshInterval),this._refreshInterval=null)}refresh(){this._cache.clear(),this._fetchData()}destroy(){this._stopAutoRefresh(),this._abortController&&this._abortController.abort(),this._cache.clear(),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
      .uc-rest-widget {
        width: 100%;
      }

      .uc-rest-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 16px;
        color: var(--secondary-text-color);
      }

      .uc-rest-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid var(--divider-color);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: uc-rest-spin 1s linear infinite;
      }

      @keyframes uc-rest-spin {
        to { transform: rotate(360deg); }
      }

      .uc-rest-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        color: var(--error-color);
        text-align: center;
      }

      .uc-rest-error ha-icon {
        --mdc-icon-size: 32px;
      }

      .uc-rest-retry {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
        font-size: 14px;
      }

      .uc-rest-retry:hover {
        filter: brightness(1.1);
      }

      .uc-rest-value {
        font-size: 24px;
        font-weight: 600;
        text-align: center;
        padding: 16px;
      }

      .uc-rest-raw {
        font-family: monospace;
        font-size: 12px;
        background: var(--code-editor-background-color, #f5f5f5);
        padding: 12px;
        border-radius: 8px;
        overflow: auto;
        max-height: 200px;
        margin: 0;
      }

      .uc-rest-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }

      .uc-rest-table th,
      .uc-rest-table td {
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-rest-table th {
        font-weight: 600;
        background: var(--secondary-background-color);
      }

      .uc-rest-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .uc-rest-list li {
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-rest-list li:last-child {
        border-bottom: none;
      }

      .uc-rest-chart {
        width: 100%;
        height: 60px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .uc-rest-empty {
        padding: 16px;
        text-align: center;
        color: var(--secondary-text-color);
      }

      .uc-rest-timestamp {
        font-size: 11px;
        color: var(--secondary-text-color);
        text-align: right;
        padding-top: 8px;
      }
    `}};var ya={CONTAIN:"contain",COVER:"cover",FILL:"fill",NONE:"none",SCALE_DOWN:"scale-down"},G={CAMERA:"camera",IMAGE:"image",URL:"url",PERSON:"person",LOCAL:"local"},ji={entity_id:"",url:"",fit:ya.CONTAIN,aspect_ratio:"16:9",refresh_interval:0,show_state:!1,show_name:!1,placeholder:"mdi:image",error_placeholder:"mdi:image-broken",lazy_load:!0,click_action:"more-info",border_radius:8},It=class{constructor(e,t={}){this._hass=e,this._config={...ji,...t},this._element=null,this._imgElement=null,this._refreshInterval=null,this._intersectionObserver=null,this._isVisible=!1,this._errorCount=0}set hass(e){this._hass=e,this._updateImage()}setConfig(e){this._config={...ji,...e}}render(){return this._element=document.createElement("div"),this._element.className="uc-image-widget",this._applyAspectRatio(),this._element.innerHTML=`
      <div class="uc-image-container">
        <div class="uc-image-placeholder">
          <ha-icon icon="${this._config.placeholder}"></ha-icon>
        </div>
        <img class="uc-image" alt="" />
        ${this._config.show_name?'<div class="uc-image-name"></div>':""}
        ${this._config.show_state?'<div class="uc-image-state"></div>':""}
      </div>
    `,this._imgElement=this._element.querySelector(".uc-image"),this._imgElement.addEventListener("load",()=>this._onImageLoad()),this._imgElement.addEventListener("error",()=>this._onImageError()),this._config.click_action&&(this._element.addEventListener("click",()=>this._onClick()),this._element.style.cursor="pointer"),this._config.lazy_load?this._setupLazyLoad():this._loadImage(),this._config.refresh_interval>0&&this._startAutoRefresh(),this._element}_applyAspectRatio(){let e=this._config.aspect_ratio;if(e==="auto")this._element.style.aspectRatio="auto";else if(e.includes(":")){let[t,i]=e.split(":").map(Number);this._element.style.aspectRatio=`${t}/${i}`}else e.includes("/")?this._element.style.aspectRatio=e:this._element.style.aspectRatio=e}_setupLazyLoad(){this._intersectionObserver=new IntersectionObserver(e=>{e[0].isIntersecting?(this._isVisible=!0,this._loadImage(),!this._getSourceType()===G.CAMERA&&this._intersectionObserver.disconnect()):this._isVisible=!1},{threshold:.1}),this._intersectionObserver.observe(this._element)}_getSourceType(){let{entity_id:e,url:t}=this._config;if(t)return t.startsWith("/local/")?G.LOCAL:G.URL;if(!e)return null;switch(e.split(".")[0]){case"camera":return G.CAMERA;case"image":return G.IMAGE;case"person":return G.PERSON;default:return null}}_getImageUrl(){var a,r,o,n,c,l,d,u;let e=this._getSourceType(),{entity_id:t,url:i}=this._config;switch(e){case G.URL:return i;case G.LOCAL:return i;case G.CAMERA:let p=Date.now();return`/api/camera_proxy/${t}?token=${(a=this._hass)!=null&&a.hassUrl,""}&_=${p}`;case G.IMAGE:let h=(o=(r=this._hass)==null?void 0:r.states)==null?void 0:o[t];return((n=h==null?void 0:h.attributes)==null?void 0:n.entity_picture)||((c=h==null?void 0:h.attributes)==null?void 0:c.url);case G.PERSON:let g=(d=(l=this._hass)==null?void 0:l.states)==null?void 0:d[t];return(u=g==null?void 0:g.attributes)==null?void 0:u.entity_picture;default:return null}}_loadImage(){let e=this._getImageUrl();if(!e){this._showPlaceholder();return}let t=e;if(this._getSourceType()===G.CAMERA){let i=e.includes("?")?"&":"?";t=`${e}${i}_=${Date.now()}`}this._imgElement.src=t,this._element.classList.add("loading")}_updateImage(){this._config.lazy_load&&!this._isVisible||(this._loadImage(),this._updateOverlays())}_updateOverlays(){var r,o,n;let{entity_id:e,show_name:t,show_state:i}=this._config;if(!e)return;let a=(o=(r=this._hass)==null?void 0:r.states)==null?void 0:o[e];if(a){if(t){let c=this._element.querySelector(".uc-image-name");c&&(c.textContent=((n=a.attributes)==null?void 0:n.friendly_name)||e)}if(i){let c=this._element.querySelector(".uc-image-state");c&&(c.textContent=a.state)}}}_onImageLoad(){this._element.classList.remove("loading","error"),this._element.classList.add("loaded"),this._imgElement.style.display="block",this._errorCount=0;let e=this._element.querySelector(".uc-image-placeholder");e&&(e.style.display="none")}_onImageError(){var t;this._element.classList.remove("loading","loaded"),this._element.classList.add("error"),this._imgElement.style.display="none",this._errorCount++;let e=this._element.querySelector(".uc-image-placeholder");e&&(e.style.display="flex",(t=e.querySelector("ha-icon"))==null||t.setAttribute("icon",this._config.error_placeholder)),this._getSourceType()===G.CAMERA&&this._errorCount<3&&setTimeout(()=>this._loadImage(),2e3)}_showPlaceholder(){this._imgElement.style.display="none";let e=this._element.querySelector(".uc-image-placeholder");e&&(e.style.display="flex")}_onClick(){let{click_action:e,entity_id:t}=this._config;switch(e){case"more-info":if(t){let i=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}});this._element.dispatchEvent(i)}break;case"fullscreen":this._showFullscreen();break;case"none":break}}_showFullscreen(){let e=this._getImageUrl();if(!e)return;let t=document.createElement("div");t.className="uc-image-fullscreen",t.innerHTML=`
      <img src="${e}" />
      <button class="uc-image-fullscreen-close">\xD7</button>
    `,t.addEventListener("click",i=>{(i.target===t||i.target.classList.contains("uc-image-fullscreen-close"))&&t.remove()}),document.body.appendChild(t)}_startAutoRefresh(){this._stopAutoRefresh(),this._refreshInterval=setInterval(()=>{(this._isVisible||!this._config.lazy_load)&&this._loadImage()},this._config.refresh_interval*1e3)}_stopAutoRefresh(){this._refreshInterval&&(clearInterval(this._refreshInterval),this._refreshInterval=null)}destroy(){this._stopAutoRefresh(),this._intersectionObserver&&this._intersectionObserver.disconnect(),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
      .uc-image-widget {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: var(--ha-card-border-radius, 12px);
        background: var(--secondary-background-color);
      }

      .uc-image-container {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .uc-image {
        width: 100%;
        height: 100%;
        object-fit: var(--uc-image-fit, contain);
        display: none;
        transition: opacity 0.3s ease;
      }

      .uc-image-widget.loaded .uc-image {
        opacity: 1;
      }

      .uc-image-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
      }

      .uc-image-placeholder ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.5;
      }

      .uc-image-widget.loading .uc-image-placeholder ha-icon {
        animation: uc-image-pulse 1s ease-in-out infinite;
      }

      @keyframes uc-image-pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.7; }
      }

      .uc-image-widget.error .uc-image-placeholder {
        color: var(--error-color);
      }

      .uc-image-name,
      .uc-image-state {
        position: absolute;
        left: 0;
        right: 0;
        padding: 8px 12px;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        color: white;
        font-size: 14px;
      }

      .uc-image-name {
        bottom: 0;
        font-weight: 500;
      }

      .uc-image-state {
        top: 0;
        background: linear-gradient(rgba(0,0,0,0.7), transparent);
        font-size: 12px;
        text-transform: capitalize;
      }

      /* Fullscreen */
      .uc-image-fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: zoom-out;
      }

      .uc-image-fullscreen img {
        max-width: 95vw;
        max-height: 95vh;
        object-fit: contain;
      }

      .uc-image-fullscreen-close {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-image-fullscreen-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      /* Object-fit \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B */
      .uc-image-contain .uc-image { object-fit: contain; }
      .uc-image-cover .uc-image { object-fit: cover; }
      .uc-image-fill .uc-image { object-fit: fill; }
      .uc-image-none .uc-image { object-fit: none; }
      .uc-image-scale-down .uc-image { object-fit: scale-down; }
    `}};var va={COMPACT:"compact",NORMAL:"normal",FULL:"full"},Gi={entity_id:"",style:va.NORMAL,show_artwork:!0,show_volume:!0,show_progress:!0,show_source:!1,artwork_border_radius:8,volume_step:5},Ot=class{constructor(e,t={}){this._hass=e,this._config={...Gi,...t},this._element=null,this._progressInterval=null}set hass(e){this._hass=e,this._update()}setConfig(e){this._config={...Gi,...e}}_getState(){var e,t;return(t=(e=this._hass)==null?void 0:e.states)==null?void 0:t[this._config.entity_id]}render(){return this._element=document.createElement("div"),this._element.className=`uc-media-mini uc-media-${this._config.style}`,this._renderContent(),this._bindEvents(),this._startProgressUpdate(),this._element}_renderContent(){var g;let e=this._getState();if(!e){this._element.innerHTML=`
        <div class="uc-media-unavailable">
          <ha-icon icon="mdi:speaker-off"></ha-icon>
          <span>\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E</span>
        </div>
      `;return}let t=e.state==="playing",i=e.state==="paused",a=e.state==="idle"||e.state==="off",r=e.attributes,o=this._config.show_artwork&&r.entity_picture?`
      <div class="uc-media-artwork" style="background-image: url('${r.entity_picture}')">
        ${t?'<div class="uc-media-playing-indicator"><span></span><span></span><span></span></div>':""}
      </div>
    `:"",n=r.media_title||r.friendly_name||this._config.entity_id,c=r.media_artist||r.media_album_name||r.app_name||"",l=`
      <div class="uc-media-controls">
        <button class="uc-media-btn" data-action="prev" title="\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0438\u0439">
          <ha-icon icon="mdi:skip-previous"></ha-icon>
        </button>
        <button class="uc-media-btn uc-media-btn-main" data-action="play_pause" title="${t?"\u041F\u0430\u0443\u0437\u0430":"\u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0441\u0442\u0438"}">
          <ha-icon icon="mdi:${t?"pause":"play"}"></ha-icon>
        </button>
        <button class="uc-media-btn" data-action="next" title="\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439">
          <ha-icon icon="mdi:skip-next"></ha-icon>
        </button>
      </div>
    `,d=this._config.show_progress&&r.media_duration?`
      <div class="uc-media-progress">
        <span class="uc-media-time uc-media-time-current">${this._formatTime(r.media_position||0)}</span>
        <div class="uc-media-progress-bar">
          <div class="uc-media-progress-fill" style="width: ${this._getProgressPercent(r)}%"></div>
        </div>
        <span class="uc-media-time uc-media-time-duration">${this._formatTime(r.media_duration)}</span>
      </div>
    `:"",u=Math.round((r.volume_level||0)*100),p=this._config.show_volume?`
      <div class="uc-media-volume">
        <button class="uc-media-btn uc-media-btn-sm" data-action="volume_mute" title="${r.is_volume_muted?"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0432\u0443\u043A":"\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0432\u0443\u043A"}">
          <ha-icon icon="mdi:${r.is_volume_muted?"volume-off":u>50?"volume-high":"volume-medium"}"></ha-icon>
        </button>
        <input type="range" class="uc-media-volume-slider" 
               min="0" max="100" value="${u}"
               data-action="volume_set" />
        <span class="uc-media-volume-value">${u}%</span>
      </div>
    `:"",h=this._config.show_source&&((g=r.source_list)!=null&&g.length)?`
      <div class="uc-media-source">
        <select class="uc-media-source-select" data-action="source_select">
          ${r.source_list.map(b=>`
            <option value="${b}" ${b===r.source?"selected":""}>${b}</option>
          `).join("")}
        </select>
      </div>
    `:"";this._element.innerHTML=`
      ${o}
      <div class="uc-media-content">
        <div class="uc-media-info">
          <div class="uc-media-title">${n}</div>
          ${c?`<div class="uc-media-artist">${c}</div>`:""}
        </div>
        ${l}
        ${d}
        ${p}
        ${h}
      </div>
    `,this._element.classList.toggle("is-playing",t),this._element.classList.toggle("is-paused",i),this._element.classList.toggle("is-idle",a)}_bindEvents(){this._element.addEventListener("click",a=>{let r=a.target.closest("[data-action]");r&&this._handleAction(r.dataset.action,a)});let e=this._element.querySelector(".uc-media-volume-slider");e&&e.addEventListener("input",a=>{this._setVolume(parseInt(a.target.value)/100)});let t=this._element.querySelector(".uc-media-source-select");t&&t.addEventListener("change",a=>{this._selectSource(a.target.value)});let i=this._element.querySelector(".uc-media-progress-bar");i&&i.addEventListener("click",a=>{let r=i.getBoundingClientRect(),o=(a.clientX-r.left)/r.width;this._seek(o)})}_handleAction(e,t){var a,r;let i=this._config.entity_id;switch(e){case"play_pause":this._hass.callService("media_player","media_play_pause",{entity_id:i});break;case"prev":this._hass.callService("media_player","media_previous_track",{entity_id:i});break;case"next":this._hass.callService("media_player","media_next_track",{entity_id:i});break;case"volume_mute":this._hass.callService("media_player","volume_mute",{entity_id:i,is_volume_muted:!((r=(a=this._getState())==null?void 0:a.attributes)!=null&&r.is_volume_muted)});break}}_setVolume(e){this._hass.callService("media_player","volume_set",{entity_id:this._config.entity_id,volume_level:Math.max(0,Math.min(1,e))})}_selectSource(e){this._hass.callService("media_player","select_source",{entity_id:this._config.entity_id,source:e})}_seek(e){var a;let t=this._getState(),i=(a=t==null?void 0:t.attributes)==null?void 0:a.media_duration;i&&this._hass.callService("media_player","media_seek",{entity_id:this._config.entity_id,seek_position:i*e})}_getProgressPercent(e){return!e.media_duration||!e.media_position?0:Math.min(100,e.media_position/e.media_duration*100)}_formatTime(e){let t=Math.floor(e/60),i=Math.floor(e%60);return`${t}:${i.toString().padStart(2,"0")}`}_startProgressUpdate(){this._stopProgressUpdate(),this._progressInterval=setInterval(()=>{let e=this._getState();(e==null?void 0:e.state)==="playing"&&this._updateProgress()},1e3)}_stopProgressUpdate(){this._progressInterval&&(clearInterval(this._progressInterval),this._progressInterval=null)}_updateProgress(){let e=this._getState();if(!e)return;let t=e.attributes,i=this._element.querySelector(".uc-media-progress-fill");i&&(i.style.width=`${this._getProgressPercent(t)}%`);let a=this._element.querySelector(".uc-media-time-current");if(a&&t.media_position!==void 0){let r=t.media_position+1;a.textContent=this._formatTime(Math.min(r,t.media_duration||r))}}_update(){this._element&&(this._renderContent(),this._bindEvents())}destroy(){this._stopProgressUpdate(),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
      .uc-media-mini {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: var(--ha-card-background, white);
        border-radius: 12px;
      }

      .uc-media-unavailable {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 16px;
        color: var(--secondary-text-color);
      }

      .uc-media-artwork {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 8px;
        background-size: cover;
        background-position: center;
        background-color: var(--secondary-background-color);
        flex-shrink: 0;
      }

      .uc-media-playing-indicator {
        position: absolute;
        bottom: 4px;
        right: 4px;
        display: flex;
        align-items: flex-end;
        gap: 2px;
        height: 12px;
        padding: 2px 4px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 4px;
      }

      .uc-media-playing-indicator span {
        width: 3px;
        background: white;
        border-radius: 1px;
        animation: uc-media-equalizer 0.5s ease infinite alternate;
      }

      .uc-media-playing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }

      .uc-media-playing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }

      @keyframes uc-media-equalizer {
        from { height: 30%; }
        to { height: 100%; }
      }

      .uc-media-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .uc-media-info {
        min-width: 0;
      }

      .uc-media-title {
        font-weight: 600;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .uc-media-artist {
        font-size: 12px;
        color: var(--secondary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .uc-media-controls {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .uc-media-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
      }

      .uc-media-btn:hover {
        background: var(--secondary-background-color);
      }

      .uc-media-btn:active {
        transform: scale(0.95);
      }

      .uc-media-btn-main {
        width: 44px;
        height: 44px;
        background: var(--primary-color);
        color: white;
      }

      .uc-media-btn-main:hover {
        background: var(--primary-color);
        filter: brightness(1.1);
      }

      .uc-media-btn-sm {
        width: 28px;
        height: 28px;
      }

      .uc-media-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .uc-media-btn-main ha-icon {
        --mdc-icon-size: 24px;
      }

      .uc-media-progress {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-media-time {
        font-size: 11px;
        color: var(--secondary-text-color);
        min-width: 35px;
      }

      .uc-media-time-duration {
        text-align: right;
      }

      .uc-media-progress-bar {
        flex: 1;
        height: 4px;
        background: var(--divider-color);
        border-radius: 2px;
        cursor: pointer;
        overflow: hidden;
      }

      .uc-media-progress-fill {
        height: 100%;
        background: var(--primary-color);
        border-radius: 2px;
        transition: width 0.1s linear;
      }

      .uc-media-volume {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uc-media-volume-slider {
        flex: 1;
        height: 4px;
        -webkit-appearance: none;
        background: var(--divider-color);
        border-radius: 2px;
        outline: none;
      }

      .uc-media-volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: var(--primary-color);
        border-radius: 50%;
        cursor: pointer;
      }

      .uc-media-volume-value {
        font-size: 11px;
        color: var(--secondary-text-color);
        min-width: 30px;
        text-align: right;
      }

      .uc-media-source-select {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--ha-card-background);
        color: var(--primary-text-color);
        font-size: 12px;
        outline: none;
      }

      /* Compact style */
      .uc-media-compact .uc-media-artwork {
        width: 48px;
        height: 48px;
      }

      .uc-media-compact .uc-media-progress,
      .uc-media-compact .uc-media-volume,
      .uc-media-compact .uc-media-source {
        display: none;
      }

      /* Full style */
      .uc-media-full {
        flex-direction: column;
      }

      .uc-media-full .uc-media-artwork {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        border-radius: 12px;
      }
    `}};var ne={INFO:"info",WARNING:"warning",ERROR:"error",SUCCESS:"success"},qi={max_items:10,show_timestamp:!0,show_source:!0,show_actions:!0,auto_dismiss:0,group_by_source:!1,filter_sources:[],exclude_sources:[],compact:!1},Rt=class{constructor(e,t={}){this._hass=e,this._config={...qi,...t},this._element=null,this._notifications=[],this._dismissedIds=new Set,this._unsubscribe=null}set hass(e){this._hass=e,this._loadNotifications()}setConfig(e){this._config={...qi,...e}}render(){return this._element=document.createElement("div"),this._element.className=`uc-notifications ${this._config.compact?"compact":""}`,this._loadNotifications(),this._subscribeToUpdates(),this._element}async _loadNotifications(){try{let e=await this._hass.callWS({type:"persistent_notification/get"}),t=[];e&&(t=Object.values(e).map(i=>({id:i.notification_id,title:i.title,message:i.message,created_at:new Date(i.created_at),source:"persistent_notification",type:this._detectType(i),dismissible:!0}))),t=this._filterNotifications(t),t.sort((i,a)=>a.created_at-i.created_at),this._notifications=t.slice(0,this._config.max_items),this._renderNotifications()}catch(e){console.error("[NotificationCenter] Error loading notifications:",e),this._renderError()}}_subscribeToUpdates(){}_filterNotifications(e){let t=e;return t=t.filter(i=>!this._dismissedIds.has(i.id)),this._config.filter_sources.length>0&&(t=t.filter(i=>this._config.filter_sources.includes(i.source))),this._config.exclude_sources.length>0&&(t=t.filter(i=>!this._config.exclude_sources.includes(i.source))),t}_detectType(e){let t=(e.message||"").toLowerCase(),i=(e.title||"").toLowerCase(),a=t+" "+i;return a.includes("error")||a.includes("\u043E\u0448\u0438\u0431\u043A\u0430")||a.includes("failed")?ne.ERROR:a.includes("warning")||a.includes("\u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435")||a.includes("\u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435")?ne.WARNING:a.includes("success")||a.includes("\u0443\u0441\u043F\u0435\u0448\u043D\u043E")||a.includes("\u0433\u043E\u0442\u043E\u0432\u043E")?ne.SUCCESS:ne.INFO}_renderNotifications(){if(!this._element)return;if(this._notifications.length===0){this._element.innerHTML=`
        <div class="uc-notifications-empty">
          <ha-icon icon="mdi:bell-check"></ha-icon>
          <span>\u041D\u0435\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439</span>
        </div>
      `;return}let e=this._config.group_by_source?this._groupBySource(this._notifications):{all:this._notifications},t="";for(let[i,a]of Object.entries(e))this._config.group_by_source&&i!=="all"&&(t+=`<div class="uc-notifications-group-header">${i}</div>`),t+=a.map(r=>this._renderNotification(r)).join("");this._element.innerHTML=`
      <div class="uc-notifications-list">
        ${t}
      </div>
      ${this._notifications.length>0?`
        <div class="uc-notifications-footer">
          <button class="uc-notifications-clear-all">\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435</button>
        </div>
      `:""}
    `,this._bindEvents()}_renderNotification(e){let{show_timestamp:t,show_source:i,show_actions:a,compact:r}=this._config,o=this._getTypeIcon(e.type),n=`uc-notification-${e.type}`,c=this._formatTimeAgo(e.created_at);return`
      <div class="uc-notification ${n}" data-id="${e.id}">
        <div class="uc-notification-icon">
          <ha-icon icon="${o}"></ha-icon>
        </div>
        <div class="uc-notification-content">
          ${e.title?`<div class="uc-notification-title">${e.title}</div>`:""}
          <div class="uc-notification-message">${e.message}</div>
          <div class="uc-notification-meta">
            ${t?`<span class="uc-notification-time">${c}</span>`:""}
            ${i?`<span class="uc-notification-source">${e.source}</span>`:""}
          </div>
        </div>
        ${e.dismissible&&a?`
          <button class="uc-notification-dismiss" data-action="dismiss" title="\u0421\u043A\u0440\u044B\u0442\u044C">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        `:""}
      </div>
    `}_renderError(){var e;this._element&&(this._element.innerHTML=`
      <div class="uc-notifications-error">
        <ha-icon icon="mdi:alert-circle"></ha-icon>
        <span>\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438</span>
        <button class="uc-notifications-retry">\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button>
      </div>
    `,(e=this._element.querySelector(".uc-notifications-retry"))==null||e.addEventListener("click",()=>{this._loadNotifications()}))}_groupBySource(e){let t={};for(let i of e){let a=i.source||"other";t[a]||(t[a]=[]),t[a].push(i)}return t}_getTypeIcon(e){return{[ne.INFO]:"mdi:information",[ne.WARNING]:"mdi:alert",[ne.ERROR]:"mdi:alert-circle",[ne.SUCCESS]:"mdi:check-circle"}[e]||"mdi:bell"}_formatTimeAgo(e){let i=new Date-e,a=Math.floor(i/1e3),r=Math.floor(a/60),o=Math.floor(r/60),n=Math.floor(o/24);return n>0?`${n} \u0434. \u043D\u0430\u0437\u0430\u0434`:o>0?`${o} \u0447. \u043D\u0430\u0437\u0430\u0434`:r>0?`${r} \u043C\u0438\u043D. \u043D\u0430\u0437\u0430\u0434`:"\u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E"}_bindEvents(){var e;this._element.querySelectorAll('[data-action="dismiss"]').forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();let a=t.closest(".uc-notification"),r=a==null?void 0:a.dataset.id;r&&this._dismissNotification(r)})}),(e=this._element.querySelector(".uc-notifications-clear-all"))==null||e.addEventListener("click",()=>{this._clearAll()}),this._element.querySelectorAll(".uc-notification").forEach(t=>{t.addEventListener("click",()=>{let i=t.dataset.id;this._onNotificationClick(i)})})}async _dismissNotification(e){try{await this._hass.callService("persistent_notification","dismiss",{notification_id:e})}catch(i){}this._dismissedIds.add(e);let t=this._element.querySelector(`[data-id="${e}"]`);t&&(t.style.animation="uc-notification-dismiss 0.3s ease forwards",setTimeout(()=>{this._notifications=this._notifications.filter(i=>i.id!==e),this._renderNotifications()},300))}async _clearAll(){for(let e of this._notifications)if(e.dismissible){try{await this._hass.callService("persistent_notification","dismiss",{notification_id:e.id})}catch(t){}this._dismissedIds.add(e.id)}this._notifications=[],this._renderNotifications()}_onNotificationClick(e){}addNotification(e){let t={id:e.id||`custom-${Date.now()}`,title:e.title,message:e.message,created_at:new Date,source:e.source||"custom",type:e.type||ne.INFO,dismissible:e.dismissible!==!1};this._notifications.unshift(t),this._notifications.length>this._config.max_items&&this._notifications.pop(),this._renderNotifications(),this._config.auto_dismiss>0&&setTimeout(()=>{this._dismissNotification(t.id)},this._config.auto_dismiss)}destroy(){this._unsubscribe&&this._unsubscribe(),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
      .uc-notifications {
        width: 100%;
      }

      .uc-notifications-empty,
      .uc-notifications-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 32px 16px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      .uc-notifications-empty ha-icon,
      .uc-notifications-error ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.5;
      }

      .uc-notifications-retry {
        margin-top: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
      }

      .uc-notifications-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .uc-notifications-group-header {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--secondary-text-color);
        padding: 8px 0 4px;
        letter-spacing: 0.5px;
      }

      .uc-notification {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: var(--ha-card-background, white);
        border-radius: 12px;
        border-left: 4px solid var(--divider-color);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .uc-notification:hover {
        transform: translateX(4px);
        box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
      }

      .uc-notification-info {
        border-left-color: var(--info-color, #2196f3);
      }

      .uc-notification-warning {
        border-left-color: var(--warning-color, #ff9800);
      }

      .uc-notification-error {
        border-left-color: var(--error-color, #f44336);
      }

      .uc-notification-success {
        border-left-color: var(--success-color, #4caf50);
      }

      .uc-notification-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--secondary-background-color);
      }

      .uc-notification-info .uc-notification-icon {
        color: var(--info-color);
        background: rgba(33, 150, 243, 0.1);
      }

      .uc-notification-warning .uc-notification-icon {
        color: var(--warning-color);
        background: rgba(255, 152, 0, 0.1);
      }

      .uc-notification-error .uc-notification-icon {
        color: var(--error-color);
        background: rgba(244, 67, 54, 0.1);
      }

      .uc-notification-success .uc-notification-icon {
        color: var(--success-color);
        background: rgba(76, 175, 80, 0.1);
      }

      .uc-notification-content {
        flex: 1;
        min-width: 0;
      }

      .uc-notification-title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .uc-notification-message {
        font-size: 13px;
        color: var(--primary-text-color);
        line-height: 1.4;
        word-wrap: break-word;
      }

      .uc-notification-meta {
        display: flex;
        gap: 12px;
        margin-top: 8px;
        font-size: 11px;
        color: var(--secondary-text-color);
      }

      .uc-notification-dismiss {
        flex-shrink: 0;
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 50%;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s, background 0.2s;
      }

      .uc-notification:hover .uc-notification-dismiss {
        opacity: 1;
      }

      .uc-notification-dismiss:hover {
        background: var(--secondary-background-color);
      }

      .uc-notifications-footer {
        display: flex;
        justify-content: center;
        padding-top: 12px;
        margin-top: 8px;
        border-top: 1px solid var(--divider-color);
      }

      .uc-notifications-clear-all {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--primary-color);
        cursor: pointer;
        font-size: 13px;
      }

      .uc-notifications-clear-all:hover {
        background: var(--secondary-background-color);
      }

      @keyframes uc-notification-dismiss {
        to {
          opacity: 0;
          transform: translateX(100%);
          height: 0;
          padding: 0;
          margin: 0;
        }
      }

      /* Compact mode */
      .uc-notifications.compact .uc-notification {
        padding: 8px;
        gap: 8px;
      }

      .uc-notifications.compact .uc-notification-icon {
        width: 24px;
        height: 24px;
      }

      .uc-notifications.compact .uc-notification-icon ha-icon {
        --mdc-icon-size: 16px;
      }

      .uc-notifications.compact .uc-notification-title {
        font-size: 13px;
      }

      .uc-notifications.compact .uc-notification-message {
        font-size: 12px;
      }
    `}};var v={STRING:"string",NUMBER:"number",BOOLEAN:"boolean",ENTITY:"entity",ICON:"icon",COLOR:"color",SELECT:"select",OBJECT:"object",ARRAY:"array",TEMPLATE:"template",ACTION:"action"},$={ERROR:"error",WARNING:"warning",INFO:"info"},xa={title:{type:v.STRING,description:"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",required:!1},subtitle:{type:v.STRING,description:"\u041F\u043E\u0434\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A",required:!1},icon:{type:v.ICON,description:"\u0418\u043A\u043E\u043D\u043A\u0430 \u0432 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0435",required:!1,default:"mdi:card"},entity:{type:v.ENTITY,description:"\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F entity \u0434\u043B\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",required:!1},body_mode:{type:v.SELECT,description:"\u0420\u0435\u0436\u0438\u043C \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u0442\u0435\u043B\u0430 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438",required:!1,default:"expand",options:Object.values(E)},cards:{type:v.ARRAY,description:"\u041C\u0430\u0441\u0441\u0438\u0432 \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A",required:!1,items:{type:v.OBJECT}},grid:{type:v.OBJECT,description:"\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 Grid layout",required:!1,properties:{columns:{type:v.NUMBER,description:"\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043A\u043E\u043B\u043E\u043D\u043E\u043A",min:1,max:12,default:2},gap:{type:v.STRING,description:"\u041E\u0442\u0441\u0442\u0443\u043F \u043C\u0435\u0436\u0434\u0443 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u043C\u0438",default:"8px"}}},header_left:{type:v.OBJECT,description:"\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0441\u043B\u0435\u0432\u0430 \u0432 header"},header_right:{type:v.OBJECT,description:"\u0421\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0441\u043F\u0440\u0430\u0432\u0430 \u0432 header"},tap_action:{type:v.ACTION,description:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u0440\u0438 \u043A\u043B\u0438\u043A\u0435"},hold_action:{type:v.ACTION,description:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u0440\u0438 \u0434\u043E\u043B\u0433\u043E\u043C \u043D\u0430\u0436\u0430\u0442\u0438\u0438"},double_tap_action:{type:v.ACTION,description:"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u0440\u0438 \u0434\u0432\u043E\u0439\u043D\u043E\u043C \u043A\u043B\u0438\u043A\u0435"},visibility:{type:v.ARRAY,description:"\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u0438",items:{type:v.OBJECT}},theme:{type:v.SELECT,description:"\u0422\u0435\u043C\u0430 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F",options:["default","glass","neumorphism","neon"]},color_scheme:{type:v.SELECT,description:"\u0426\u0432\u0435\u0442\u043E\u0432\u0430\u044F \u0441\u0445\u0435\u043C\u0430"},lazy_load:{type:v.BOOLEAN,description:"\u041B\u0435\u043D\u0438\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u043E\u043D\u0442\u0435\u043D\u0442\u0430",default:!0},collapsed:{type:v.BOOLEAN,description:"\u041D\u0430\u0447\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 (\u0441\u0432\u0451\u0440\u043D\u0443\u0442\u043E)",default:!1},link_group:{type:v.STRING,description:"ID \u0433\u0440\u0443\u043F\u043F\u044B \u0441\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A"},link_role:{type:v.SELECT,description:"\u0420\u043E\u043B\u044C \u0432 \u0433\u0440\u0443\u043F\u043F\u0435 \u0441\u0432\u044F\u0437\u044B\u0432\u0430\u043D\u0438\u044F",options:["master","slave"]}},Nt=class{constructor(){this._schema=xa,this._customRules=[]}addRule(e){this._customRules.push(e)}validate(e){let t={valid:!0,errors:[],warnings:[],suggestions:[]};if(!e||typeof e!="object")return t.valid=!1,t.errors.push({path:"",message:"\u041A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044F \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043E\u0431\u044A\u0435\u043A\u0442\u043E\u043C",level:$.ERROR}),t;this._validateSchema(e,this._schema,"",t);for(let i of this._customRules)try{let a=i(e);if(Array.isArray(a))for(let r of a)r.level===$.ERROR?(t.errors.push(r),t.valid=!1):r.level===$.WARNING?t.warnings.push(r):t.suggestions.push(r)}catch(a){console.warn("[ConfigValidator] Rule error:",a)}return this._addSuggestions(e,t),t}_validateSchema(e,t,i,a){for(let[r,o]of Object.entries(t)){let n=i?`${i}.${r}`:r,c=e[r];if(o.required&&c===void 0){a.errors.push({path:n,message:`\u041E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435 "${r}" \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E`,level:$.ERROR}),a.valid=!1;continue}c===void 0||!this._validateType(c,o,n,a)||(o.type===v.OBJECT&&o.properties&&this._validateSchema(c,o.properties,n,a),o.type===v.ARRAY&&o.items&&Array.isArray(c)&&c.forEach((d,u)=>{o.items.type===v.OBJECT&&o.items.properties&&this._validateSchema(d,o.items.properties,`${n}[${u}]`,a)}),o.type===v.NUMBER&&(o.min!==void 0&&c<o.min&&a.warnings.push({path:n,message:`\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 ${c} \u043C\u0435\u043D\u044C\u0448\u0435 \u043C\u0438\u043D\u0438\u043C\u0443\u043C\u0430 ${o.min}`,level:$.WARNING}),o.max!==void 0&&c>o.max&&a.warnings.push({path:n,message:`\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 ${c} \u0431\u043E\u043B\u044C\u0448\u0435 \u043C\u0430\u043A\u0441\u0438\u043C\u0443\u043C\u0430 ${o.max}`,level:$.WARNING})),o.type===v.SELECT&&o.options&&(o.options.includes(c)||(a.errors.push({path:n,message:`\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 "${c}". \u0414\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0435: ${o.options.join(", ")}`,level:$.ERROR}),a.valid=!1)))}for(let r of Object.keys(e))t[r]||a.warnings.push({path:i?`${i}.${r}`:r,message:`\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u043F\u043E\u043B\u0435 "${r}"`,level:$.WARNING})}_validateType(e,t,i,a){let{type:r}=t;switch(r){case v.STRING:if(typeof e!="string")return a.errors.push({path:i,message:`\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u0441\u0442\u0440\u043E\u043A\u0430, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${typeof e}`,level:$.ERROR}),a.valid=!1,!1;break;case v.NUMBER:if(typeof e!="number"||isNaN(e))return a.errors.push({path:i,message:`\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u0447\u0438\u0441\u043B\u043E, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${typeof e}`,level:$.ERROR}),a.valid=!1,!1;break;case v.BOOLEAN:if(typeof e!="boolean")return a.errors.push({path:i,message:`\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F boolean, \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ${typeof e}`,level:$.ERROR}),a.valid=!1,!1;break;case v.OBJECT:if(typeof e!="object"||e===null||Array.isArray(e))return a.errors.push({path:i,message:"\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043E\u0431\u044A\u0435\u043A\u0442",level:$.ERROR}),a.valid=!1,!1;break;case v.ARRAY:if(!Array.isArray(e))return a.errors.push({path:i,message:"\u041E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F \u043C\u0430\u0441\u0441\u0438\u0432",level:$.ERROR}),a.valid=!1,!1;break;case v.ENTITY:(typeof e!="string"||!e.includes("."))&&a.warnings.push({path:i,message:'Entity ID \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 "domain.entity"',level:$.WARNING});break;case v.ICON:(typeof e!="string"||!e.includes(":"))&&a.warnings.push({path:i,message:'\u0418\u043A\u043E\u043D\u043A\u0430 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 "mdi:icon-name"',level:$.WARNING});break}return!0}_addSuggestions(e,t){var i,a;((i=e.cards)==null?void 0:i.length)>5&&e.lazy_load!==!0&&t.suggestions.push({path:"lazy_load",message:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u044C lazy_load \u0434\u043B\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441 \u0431\u043E\u043B\u0435\u0435 \u0447\u0435\u043C 5 \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u043C\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438",level:$.INFO,fix:{lazy_load:!0}}),((a=e.cards)==null?void 0:a.length)>1&&!e.grid&&t.suggestions.push({path:"grid",message:"\u0420\u0435\u043A\u043E\u043C\u0435\u043D\u0434\u0443\u0435\u0442\u0441\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C grid layout \u0434\u043B\u044F \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u043A\u0430\u0440\u0442\u043E\u0447\u0435\u043A",level:$.INFO,fix:{grid:{columns:2}}}),(e.state_styles||e.alerts)&&!e.entity&&t.warnings.push({path:"entity",message:"\u0414\u043B\u044F state_styles \u0438 alerts \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F \u0443\u043A\u0430\u0437\u0430\u0442\u044C entity",level:$.WARNING}),e.body_mode==="tabs"&&(!e.tabs||e.tabs.length===0)&&t.warnings.push({path:"tabs",message:"\u0414\u043B\u044F \u0440\u0435\u0436\u0438\u043C\u0430 tabs \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E \u0443\u043A\u0430\u0437\u0430\u0442\u044C \u043C\u0430\u0441\u0441\u0438\u0432 \u0432\u043A\u043B\u0430\u0434\u043E\u043A",level:$.WARNING})}getCompletions(e=""){let t=[],i=e.split(".").filter(Boolean),a=this._schema;for(let r of i)if(a[r])a=a[r],a.properties&&(a=a.properties);else return[];for(let[r,o]of Object.entries(a))t.push({label:r,type:o.type,description:o.description,required:o.required,default:o.default,options:o.options});return t}getFieldDocumentation(e){let t=e.split(".").filter(Boolean),i=this._schema;for(let a of t)if(i[a])i=i[a],i.properties&&(i=i.properties);else return null;return{...i,path:e}}static getStyles(){return`
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
    `}};var wa={handle:null,ghostClass:"uc-drag-ghost",dragClass:"uc-dragging",dropZoneClass:"uc-drop-zone",dropActiveClass:"uc-drop-active",animation:200,threshold:10,axis:null,scrollSensitivity:50,scrollSpeed:10},Mt=class{constructor(e,t={}){this._container=e,this._config={...wa,...t},this._items=[],this._draggedItem=null,this._ghost=null,this._placeholder=null,this._startPos={x:0,y:0},this._currentPos={x:0,y:0},this._scrollInterval=null,this._isDragging=!1,this._callbacks={onStart:null,onMove:null,onEnd:null,onReorder:null},this._init()}_init(){this._updateItems(),this._bindEvents()}_updateItems(){this._items=Array.from(this._container.children)}_bindEvents(){this._container.addEventListener("mousedown",this._onMouseDown.bind(this)),document.addEventListener("mousemove",this._onMouseMove.bind(this)),document.addEventListener("mouseup",this._onMouseUp.bind(this)),this._container.addEventListener("touchstart",this._onTouchStart.bind(this),{passive:!1}),document.addEventListener("touchmove",this._onTouchMove.bind(this),{passive:!1}),document.addEventListener("touchend",this._onTouchEnd.bind(this))}on(e,t){this._callbacks.hasOwnProperty(e)&&(this._callbacks[e]=t)}_onMouseDown(e){if(e.button!==0)return;let t=this._getItemFromEvent(e);if(t){if(this._config.handle){let i=e.target.closest(this._config.handle);if(!i||!t.contains(i))return}e.preventDefault(),this._startDrag(t,e.clientX,e.clientY)}}_onTouchStart(e){if(e.touches.length!==1)return;let t=e.touches[0],i=this._getItemFromEvent(e);if(i){if(this._config.handle){let a=e.target.closest(this._config.handle);if(!a||!i.contains(a))return}this._startDrag(i,t.clientX,t.clientY)}}_getItemFromEvent(e){let t=e.target;return this._items.find(i=>i.contains(t))}_startDrag(e,t,i){this._draggedItem=e,this._startPos={x:t,y:i},this._currentPos={x:t,y:i},this._isDragging=!1;let a=e.getBoundingClientRect();this._itemRect=a}_onMouseMove(e){this._draggedItem&&this._handleMove(e.clientX,e.clientY)}_onTouchMove(e){if(!this._draggedItem||e.touches.length!==1)return;let t=e.touches[0];this._handleMove(t.clientX,t.clientY),this._isDragging&&e.preventDefault()}_handleMove(e,t){var r,o,n,c;let i=e-this._startPos.x,a=t-this._startPos.y;if(!this._isDragging){if(Math.sqrt(i*i+a*a)<this._config.threshold)return;this._isDragging=!0,this._createGhost(),this._createPlaceholder(),(o=(r=this._callbacks).onStart)==null||o.call(r,this._draggedItem,this._getItemIndex(this._draggedItem))}this._currentPos={x:e,y:t},this._moveGhost(e,t),this._updateDropPosition(e,t),this._handleAutoScroll(t),(c=(n=this._callbacks).onMove)==null||c.call(n,this._draggedItem,e,t)}_createGhost(){let e=this._itemRect;this._ghost=this._draggedItem.cloneNode(!0),this._ghost.className=`${this._draggedItem.className} ${this._config.ghostClass}`,this._ghost.style.cssText=`
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
    `,document.body.appendChild(this._ghost),this._draggedItem.classList.add(this._config.dragClass),this._draggedItem.style.opacity="0.3"}_createPlaceholder(){let e=this._itemRect;this._placeholder=document.createElement("div"),this._placeholder.className=this._config.dropZoneClass,this._placeholder.style.cssText=`
      height: ${e.height}px;
      background: var(--primary-color, #03a9f4);
      opacity: 0.2;
      border-radius: 8px;
      border: 2px dashed var(--primary-color);
      transition: all ${this._config.animation}ms ease;
    `,this._draggedItem.parentNode.insertBefore(this._placeholder,this._draggedItem)}_moveGhost(e,t){if(!this._ghost)return;let i=e-this._itemRect.width/2,a=t-this._itemRect.height/2;this._config.axis==="x"?a=this._itemRect.top:this._config.axis==="y"&&(i=this._itemRect.left),this._ghost.style.left=`${i}px`,this._ghost.style.top=`${a}px`}_updateDropPosition(e,t){if(!this._placeholder)return;this._updateItems();let i=null;for(let a=0;a<this._items.length;a++){let r=this._items[a];if(r===this._draggedItem||r===this._placeholder)continue;let o=r.getBoundingClientRect(),n=o.top+o.height/2;if(t<n){i=a;break}}if(i!==null){let a=this._items[i];a&&a!==this._placeholder.nextSibling&&this._container.insertBefore(this._placeholder,a)}else this._placeholder.nextSibling!==null&&this._container.appendChild(this._placeholder)}_handleAutoScroll(e){let t=this._container.getBoundingClientRect(),{scrollSensitivity:i,scrollSpeed:a}=this._config;this._scrollInterval&&(clearInterval(this._scrollInterval),this._scrollInterval=null),e<t.top+i?this._scrollInterval=setInterval(()=>{this._container.scrollTop-=a},16):e>t.bottom-i&&(this._scrollInterval=setInterval(()=>{this._container.scrollTop+=a},16))}_onMouseUp(e){this._endDrag()}_onTouchEnd(e){this._endDrag()}_endDrag(){var e,t,i,a;if(this._draggedItem){if(this._scrollInterval&&(clearInterval(this._scrollInterval),this._scrollInterval=null),this._isDragging){let r=this._getItemIndex(this._draggedItem),o=this._getItemIndex(this._placeholder);this._placeholder&&this._placeholder.parentNode&&(this._placeholder.parentNode.insertBefore(this._draggedItem,this._placeholder),this._placeholder.remove()),this._ghost&&(this._ghost.remove(),this._ghost=null),this._draggedItem.classList.remove(this._config.dragClass),this._draggedItem.style.opacity="",r!==o&&((t=(e=this._callbacks).onReorder)==null||t.call(e,r,o,this._draggedItem),_(this._container,"items-reordered",{oldIndex:r,newIndex:o,item:this._draggedItem})),(a=(i=this._callbacks).onEnd)==null||a.call(i,this._draggedItem,o)}this._draggedItem=null,this._placeholder=null,this._isDragging=!1,this._updateItems()}}_getItemIndex(e){return Array.from(this._container.children).indexOf(e)}enable(){this._container.classList.add("uc-drag-enabled")}disable(){this._container.classList.remove("uc-drag-enabled"),this._endDrag()}destroy(){this.disable(),this._container.removeEventListener("mousedown",this._onMouseDown),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("mouseup",this._onMouseUp),this._container.removeEventListener("touchstart",this._onTouchStart),document.removeEventListener("touchmove",this._onTouchMove),document.removeEventListener("touchend",this._onTouchEnd)}static getStyles(){return`
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
    `}};var O={N:"n",S:"s",E:"e",W:"w",NE:"ne",NW:"nw",SE:"se",SW:"sw"},ka={handles:[O.SE],minWidth:100,minHeight:50,maxWidth:1/0,maxHeight:1/0,grid:[1,1],aspectRatio:null,handleSize:12,handleClass:"uc-resize-handle",resizingClass:"uc-resizing"},Dt=class{constructor(e,t={}){this._element=e,this._config={...ka,...t},this._handles=new Map,this._isResizing=!1,this._currentHandle=null,this._startRect=null,this._startPos={x:0,y:0},this._callbacks={onStart:null,onResize:null,onEnd:null},this._init()}_init(){this._element.style.position="relative",this._createHandles(),this._bindEvents()}_createHandles(){for(let e of this._config.handles){let t=document.createElement("div");t.className=`${this._config.handleClass} ${this._config.handleClass}-${e}`,t.dataset.handle=e,this._applyHandleStyles(t,e),this._element.appendChild(t),this._handles.set(e,t)}}_applyHandleStyles(e,t){let i=this._config.handleSize,a=i/2,r={position:"absolute",width:`${i}px`,height:`${i}px`,zIndex:"10"},o={[O.N]:{top:`-${a}px`,left:"50%",transform:"translateX(-50%)",cursor:"ns-resize"},[O.S]:{bottom:`-${a}px`,left:"50%",transform:"translateX(-50%)",cursor:"ns-resize"},[O.E]:{right:`-${a}px`,top:"50%",transform:"translateY(-50%)",cursor:"ew-resize"},[O.W]:{left:`-${a}px`,top:"50%",transform:"translateY(-50%)",cursor:"ew-resize"},[O.NE]:{top:`-${a}px`,right:`-${a}px`,cursor:"nesw-resize"},[O.NW]:{top:`-${a}px`,left:`-${a}px`,cursor:"nwse-resize"},[O.SE]:{bottom:`-${a}px`,right:`-${a}px`,cursor:"nwse-resize"},[O.SW]:{bottom:`-${a}px`,left:`-${a}px`,cursor:"nesw-resize"}};Object.assign(e.style,r,o[t])}_bindEvents(){for(let[e,t]of this._handles)t.addEventListener("mousedown",i=>this._onMouseDown(i,e)),t.addEventListener("touchstart",i=>this._onTouchStart(i,e),{passive:!1});document.addEventListener("mousemove",this._onMouseMove.bind(this)),document.addEventListener("mouseup",this._onMouseUp.bind(this)),document.addEventListener("touchmove",this._onTouchMove.bind(this),{passive:!1}),document.addEventListener("touchend",this._onTouchEnd.bind(this))}on(e,t){this._callbacks.hasOwnProperty(e)&&(this._callbacks[e]=t)}_onMouseDown(e,t){e.preventDefault(),e.stopPropagation(),this._startResize(t,e.clientX,e.clientY)}_onTouchStart(e,t){if(e.touches.length!==1)return;e.preventDefault();let i=e.touches[0];this._startResize(t,i.clientX,i.clientY)}_startResize(e,t,i){var a,r,o;this._isResizing=!0,this._currentHandle=e,this._startPos={x:t,y:i},this._startRect=this._element.getBoundingClientRect(),this._element.classList.add(this._config.resizingClass),document.body.style.cursor=((a=this._handles.get(e))==null?void 0:a.style.cursor)||"default",document.body.style.userSelect="none",(o=(r=this._callbacks).onStart)==null||o.call(r,{handle:e,width:this._startRect.width,height:this._startRect.height})}_onMouseMove(e){this._isResizing&&this._handleResize(e.clientX,e.clientY)}_onTouchMove(e){if(!this._isResizing||e.touches.length!==1)return;e.preventDefault();let t=e.touches[0];this._handleResize(t.clientX,t.clientY)}_handleResize(e,t){var l,d;let i=e-this._startPos.x,a=t-this._startPos.y,r=this._startRect.width,o=this._startRect.height,n=null,c=null;switch(this._currentHandle){case O.N:o=this._startRect.height-a,c=this._startRect.top+a;break;case O.S:o=this._startRect.height+a;break;case O.E:r=this._startRect.width+i;break;case O.W:r=this._startRect.width-i,n=this._startRect.left+i;break;case O.NE:r=this._startRect.width+i,o=this._startRect.height-a,c=this._startRect.top+a;break;case O.NW:r=this._startRect.width-i,o=this._startRect.height-a,n=this._startRect.left+i,c=this._startRect.top+a;break;case O.SE:r=this._startRect.width+i,o=this._startRect.height+a;break;case O.SW:r=this._startRect.width-i,o=this._startRect.height+a,n=this._startRect.left+i;break}if(r=Math.max(this._config.minWidth,Math.min(this._config.maxWidth,r)),o=Math.max(this._config.minHeight,Math.min(this._config.maxHeight,o)),this._config.grid[0]>1&&(r=Math.round(r/this._config.grid[0])*this._config.grid[0]),this._config.grid[1]>1&&(o=Math.round(o/this._config.grid[1])*this._config.grid[1]),this._config.aspectRatio){let u=this._config.aspectRatio;r/u>o?r=o*u:o=r/u}this._element.style.width=`${r}px`,this._element.style.height=`${o}px`,(d=(l=this._callbacks).onResize)==null||d.call(l,{handle:this._currentHandle,width:r,height:o,deltaX:i,deltaY:a})}_onMouseUp(){this._endResize()}_onTouchEnd(){this._endResize()}_endResize(){var t,i;if(!this._isResizing)return;this._isResizing=!1,this._element.classList.remove(this._config.resizingClass),document.body.style.cursor="",document.body.style.userSelect="";let e=this._element.getBoundingClientRect();(i=(t=this._callbacks).onEnd)==null||i.call(t,{handle:this._currentHandle,width:e.width,height:e.height}),_(this._element,"card-resized",{width:e.width,height:e.height}),this._currentHandle=null,this._startRect=null}setSize(e,t){this._element.style.width=`${e}px`,this._element.style.height=`${t}px`}getSize(){let e=this._element.getBoundingClientRect();return{width:e.width,height:e.height}}showHandles(){for(let e of this._handles.values())e.style.display=""}hideHandles(){for(let e of this._handles.values())e.style.display="none"}destroy(){for(let e of this._handles.values())e.remove();this._handles.clear(),document.removeEventListener("mousemove",this._onMouseMove),document.removeEventListener("mouseup",this._onMouseUp),document.removeEventListener("touchmove",this._onTouchMove),document.removeEventListener("touchend",this._onTouchEnd)}static getStyles(){return`
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
    `}};var se={NONE:"none",PARTIAL:"partial",FULL:"full"},Ge={EDIT:"edit",DELETE:"delete",MOVE:"move",RESIZE:"resize",DUPLICATE:"duplicate"},Ea={level:se.NONE,lockedActions:[],password:null,showIndicator:!0,indicatorPosition:"top-right"},zt=class{constructor(e,t={}){this._element=e,this._config={...Ea,...t},this._isLocked=this._config.level!==se.NONE,this._indicator=null,this._callbacks={onLock:null,onUnlock:null,onAttempt:null},this._init()}_init(){this._config.showIndicator&&this._isLocked&&this._createIndicator(),this._updateElementState()}_createIndicator(){this._indicator=document.createElement("div"),this._indicator.className=`uc-lock-indicator uc-lock-${this._config.indicatorPosition}`,this._indicator.innerHTML=`
      <ha-icon icon="mdi:lock"></ha-icon>
      ${this._config.level===se.FULL?"<span>\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E</span>":""}
    `,this._indicator.addEventListener("click",e=>{e.stopPropagation(),this._showUnlockDialog()}),this._element.appendChild(this._indicator)}_removeIndicator(){this._indicator&&(this._indicator.remove(),this._indicator=null)}_updateElementState(){this._element.classList.toggle("uc-locked",this._isLocked),this._element.classList.toggle("uc-locked-full",this._config.level===se.FULL),this._element.classList.toggle("uc-locked-partial",this._config.level===se.PARTIAL),this._element.dataset.lockLevel=this._config.level}on(e,t){this._callbacks.hasOwnProperty(e)&&(this._callbacks[e]=t)}lock(e=se.FULL,t=[]){var i,a;this._config.level=e,this._config.lockedActions=t,this._isLocked=e!==se.NONE,this._config.showIndicator&&this._isLocked&&!this._indicator&&this._createIndicator(),this._updateElementState(),(a=(i=this._callbacks).onLock)==null||a.call(i,e,t),_(this._element,"lock-changed",{locked:!0,level:e,actions:t})}unlock(e=null){var t,i;return this._config.password&&e!==this._config.password?(this._showError("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C"),!1):(this._config.level=se.NONE,this._isLocked=!1,this._removeIndicator(),this._updateElementState(),(i=(t=this._callbacks).onUnlock)==null||i.call(t),_(this._element,"lock-changed",{locked:!1}),!0)}toggle(){return this._isLocked?!this.unlock():(this.lock(),!0)}isActionLocked(e){return this._isLocked?this._config.level===se.FULL||this._config.lockedActions.length===0?!0:this._config.lockedActions.includes(e):!1}attemptAction(e,t){var i,a;return this.isActionLocked(e)?((a=(i=this._callbacks).onAttempt)==null||a.call(i,e),this._showBlockedMessage(e),!1):(t==null||t(),!0)}_showBlockedMessage(e){let i=`\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 "${{[Ge.EDIT]:"\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435",[Ge.DELETE]:"\u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435",[Ge.MOVE]:"\u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435",[Ge.RESIZE]:"\u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0440\u0430\u0437\u043C\u0435\u0440\u0430",[Ge.DUPLICATE]:"\u0434\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435"}[e]||e}" \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E`;this._showToast(i,"warning")}_showUnlockDialog(){if(!this._config.password){this.unlock();return}let e=document.createElement("div");e.className="uc-lock-dialog",e.innerHTML=`
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
    `;let t=e.querySelector(".uc-lock-password"),i=e.querySelector(".uc-lock-btn-cancel"),a=e.querySelector(".uc-lock-btn-unlock"),r=e.querySelector(".uc-lock-dialog-backdrop"),o=()=>e.remove();r.addEventListener("click",o),i.addEventListener("click",o),a.addEventListener("click",()=>{this.unlock(t.value)?o():(t.classList.add("error"),t.value="",t.focus())}),t.addEventListener("keypress",n=>{n.key==="Enter"&&a.click()}),document.body.appendChild(e),t.focus()}_showError(e){this._showToast(e,"error")}_showToast(e,t="info"){let i=document.createElement("div");i.className=`uc-lock-toast uc-lock-toast-${t}`,i.innerHTML=`
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
    `}};var W=class{constructor(e={}){this._config=e,this._element=null}render(){throw new Error("render() must be implemented")}getValue(){throw new Error("getValue() must be implemented")}setValue(e){throw new Error("setValue() must be implemented")}},Ut=class extends W{render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <input type="${this._config.type||"text"}" 
             class="uc-editor-input"
             placeholder="${this._config.placeholder||""}"
             value="${this._config.value||""}"
             ${this._config.required?"required":""} />
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._input=this._element.querySelector("input"),this._input.addEventListener("input",()=>{_(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){var e;return((e=this._input)==null?void 0:e.value)||""}setValue(e){this._input&&(this._input.value=e||"")}},Pt=class extends W{render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <input type="number" 
             class="uc-editor-input"
             min="${this._config.min!=null?this._config.min:""}"
             max="${this._config.max!=null?this._config.max:""}"
             step="${this._config.step!=null?this._config.step:1}"
             value="${this._config.value!=null?this._config.value:""}"
             ${this._config.required?"required":""} />
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._input=this._element.querySelector("input"),this._input.addEventListener("input",()=>{_(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){var t;let e=(t=this._input)==null?void 0:t.value;return e!==""?Number(e):null}setValue(e){this._input&&(this._input.value=e!=null?e:"")}},Ht=class extends W{render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field uc-editor-checkbox",this._element.innerHTML=`
      <label class="uc-editor-checkbox-label">
        <input type="checkbox" ${this._config.value?"checked":""} />
        <span class="uc-editor-checkbox-custom"></span>
        <span class="uc-editor-checkbox-text">${this._config.label||""}</span>
      </label>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._input=this._element.querySelector("input"),this._input.addEventListener("change",()=>{_(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){var e;return((e=this._input)==null?void 0:e.checked)||!1}setValue(e){this._input&&(this._input.checked=!!e)}},Ft=class extends W{render(){this._element=document.createElement("div"),this._element.className="uc-editor-field";let e=(this._config.options||[]).map(t=>{let i=typeof t=="object"?t.value:t,a=typeof t=="object"?t.label:t,r=i===this._config.value?"selected":"";return`<option value="${i}" ${r}>${a}</option>`}).join("");return this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <select class="uc-editor-select">
        ${this._config.placeholder?`<option value="">${this._config.placeholder}</option>`:""}
        ${e}
      </select>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._select=this._element.querySelector("select"),this._select.addEventListener("change",()=>{_(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){var e;return((e=this._select)==null?void 0:e.value)||""}setValue(e){this._select&&(this._select.value=e||"")}},Bt=class extends W{render(){var e;return this._element=document.createElement("div"),this._element.className="uc-editor-field",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <ha-entity-picker
        .hass="${this._config.hass}"
        .value="${this._config.value||""}"
        .includeDomains="${this._config.domains}"
        allow-custom-entity
      ></ha-entity-picker>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._picker=this._element.querySelector("ha-entity-picker"),(e=this._picker)==null||e.addEventListener("value-changed",t=>{_(this._element,"value-changed",{value:t.detail.value})}),this._element}getValue(){var e;return((e=this._picker)==null?void 0:e.value)||""}setValue(e){this._picker&&(this._picker.value=e||"")}},jt=class extends W{render(){var e;return this._element=document.createElement("div"),this._element.className="uc-editor-field",this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <ha-icon-picker
        .hass="${this._config.hass}"
        .value="${this._config.value||""}"
      ></ha-icon-picker>
      ${this._config.helper?`<span class="uc-editor-helper">${this._config.helper}</span>`:""}
    `,this._picker=this._element.querySelector("ha-icon-picker"),(e=this._picker)==null||e.addEventListener("value-changed",t=>{_(this._element,"value-changed",{value:t.detail.value})}),this._element}getValue(){var e;return((e=this._picker)==null?void 0:e.value)||""}setValue(e){this._picker&&(this._picker.value=e||"")}},Gt=class extends W{render(){return this._element=document.createElement("div"),this._element.className="uc-editor-field uc-editor-color",this._element.innerHTML=`
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
    `,this._colorInput=this._element.querySelector(".uc-editor-color-input"),this._textInput=this._element.querySelector(".uc-editor-color-text"),this._colorInput.addEventListener("input",()=>{this._textInput.value=this._colorInput.value,_(this._element,"value-changed",{value:this.getValue()})}),this._textInput.addEventListener("input",()=>{/^#[0-9a-fA-F]{6}$/.test(this._textInput.value)&&(this._colorInput.value=this._textInput.value),_(this._element,"value-changed",{value:this.getValue()})}),this._element}getValue(){var e;return((e=this._textInput)==null?void 0:e.value)||""}setValue(e){this._colorInput&&this._textInput&&(this._colorInput.value=e||"#ffffff",this._textInput.value=e||"")}},qt=class extends W{render(){return this._element=document.createElement("div"),this._element.className=`uc-editor-section ${this._config.expanded?"expanded":""}`,this._element.innerHTML=`
      <div class="uc-editor-section-header">
        <ha-icon icon="mdi:${this._config.icon||"chevron-right"}" class="uc-editor-section-icon"></ha-icon>
        <span class="uc-editor-section-title">${this._config.title||""}</span>
        <ha-icon icon="mdi:chevron-down" class="uc-editor-section-chevron"></ha-icon>
      </div>
      <div class="uc-editor-section-content"></div>
    `,this._header=this._element.querySelector(".uc-editor-section-header"),this._content=this._element.querySelector(".uc-editor-section-content"),this._header.addEventListener("click",()=>{this._element.classList.toggle("expanded")}),this._element}addContent(e){e instanceof W?this._content.appendChild(e.render()):this._content.appendChild(e)}getValue(){return null}setValue(){}},Vt=class extends W{render(){var i;this._element=document.createElement("div"),this._element.className="uc-editor-field uc-editor-action";let e=[{value:"none",label:"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F"},{value:"more-info",label:"\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F"},{value:"toggle",label:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C"},{value:"call-service",label:"\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441"},{value:"navigate",label:"\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F"},{value:"url",label:"\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL"}],t=((i=this._config.value)==null?void 0:i.action)||"none";return this._element.innerHTML=`
      ${this._config.label?`<label class="uc-editor-label">${this._config.label}</label>`:""}
      <select class="uc-editor-select uc-editor-action-type">
        ${e.map(a=>`
          <option value="${a.value}" ${a.value===t?"selected":""}>${a.label}</option>
        `).join("")}
      </select>
      <div class="uc-editor-action-options"></div>
    `,this._typeSelect=this._element.querySelector(".uc-editor-action-type"),this._optionsContainer=this._element.querySelector(".uc-editor-action-options"),this._typeSelect.addEventListener("change",()=>{this._updateOptions(),_(this._element,"value-changed",{value:this.getValue()})}),this._updateOptions(),this._element}_updateOptions(){var t,i,a,r;let e=this._typeSelect.value;switch(this._optionsContainer.innerHTML="",e){case"call-service":this._optionsContainer.innerHTML=`
          <input type="text" 
                 class="uc-editor-input action-service" 
                 placeholder="domain.service"
                 value="${((t=this._config.value)==null?void 0:t.service)||""}" />
          <textarea class="uc-editor-textarea action-data" 
                    placeholder="service_data (YAML)">${(i=this._config.value)!=null&&i.service_data?JSON.stringify(this._config.value.service_data,null,2):""}</textarea>
        `;break;case"navigate":this._optionsContainer.innerHTML=`
          <input type="text" 
                 class="uc-editor-input action-path" 
                 placeholder="/lovelace/view"
                 value="${((a=this._config.value)==null?void 0:a.navigation_path)||""}" />
        `;break;case"url":this._optionsContainer.innerHTML=`
          <input type="text" 
                 class="uc-editor-input action-url" 
                 placeholder="https://..."
                 value="${((r=this._config.value)==null?void 0:r.url_path)||""}" />
        `;break}this._optionsContainer.querySelectorAll("input, textarea").forEach(o=>{o.addEventListener("input",()=>{_(this._element,"value-changed",{value:this.getValue()})})})}getValue(){var i,a,r,o;let e=this._typeSelect.value,t={action:e};switch(e){case"call-service":let n=(i=this._optionsContainer.querySelector(".action-service"))==null?void 0:i.value,c=(a=this._optionsContainer.querySelector(".action-data"))==null?void 0:a.value;if(n&&(t.service=n),c)try{t.service_data=JSON.parse(c)}catch(u){}break;case"navigate":let l=(r=this._optionsContainer.querySelector(".action-path"))==null?void 0:r.value;l&&(t.navigation_path=l);break;case"url":let d=(o=this._optionsContainer.querySelector(".action-url"))==null?void 0:o.value;d&&(t.url_path=d);break}return e==="none"?null:t}setValue(e){this._config.value=e,this._typeSelect&&(this._typeSelect.value=(e==null?void 0:e.action)||"none",this._updateOptions())}};function Vi(){return`
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
  `}var N={EN:"en",RU:"ru",ES:"es",DE:"de",FR:"fr",IT:"it",PT:"pt",ZH:"zh",JA:"ja",KO:"ko"},qe={[N.EN]:{"card.title":"Universal Card","card.subtitle":"Flexible card with multiple body modes","header.title":"Title","header.subtitle":"Subtitle","header.icon":"Icon","header.entity":"Entity","body_mode.label":"Body Mode","body_mode.expand":"Expand","body_mode.modal":"Modal","body_mode.fullscreen":"Fullscreen","body_mode.tabs":"Tabs","body_mode.carousel":"Carousel","body_mode.subview":"Subview","body_mode.none":"None (header only)","action.tap":"Tap Action","action.hold":"Hold Action","action.double_tap":"Double Tap Action","action.none":"No action","action.more_info":"More info","action.toggle":"Toggle","action.call_service":"Call service","action.navigate":"Navigate","action.url":"Open URL","grid.columns":"Columns","grid.gap":"Gap","features.lazy_load":"Lazy loading","features.collapsed":"Start collapsed","features.visibility":"Visibility conditions","section.header":"Header","section.body":"Body","section.cards":"Cards","section.style":"Style","section.actions":"Actions","section.advanced":"Advanced","theme.default":"Default","theme.glass":"Glassmorphism","theme.neumorphism":"Neumorphism","theme.neon":"Neon","notification.saved":"Configuration saved","notification.error":"Error saving configuration","notification.locked":"Card is locked","button.save":"Save","button.cancel":"Cancel","button.add_card":"Add Card","button.remove":"Remove","button.duplicate":"Duplicate","button.move_up":"Move Up","button.move_down":"Move Down","validation.required":"This field is required","validation.invalid_entity":"Invalid entity format","validation.invalid_icon":"Invalid icon format","lock.locked":"Locked","lock.unlock":"Unlock","lock.enter_password":"Enter password","lock.wrong_password":"Wrong password","misc.loading":"Loading...","misc.no_data":"No data","misc.unavailable":"Unavailable"},[N.RU]:{"card.title":"Universal Card","card.subtitle":"\u0413\u0438\u0431\u043A\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0441 \u0440\u0430\u0437\u043D\u044B\u043C\u0438 \u0440\u0435\u0436\u0438\u043C\u0430\u043C\u0438","header.title":"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A","header.subtitle":"\u041F\u043E\u0434\u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A","header.icon":"\u0418\u043A\u043E\u043D\u043A\u0430","header.entity":"\u0421\u0443\u0449\u043D\u043E\u0441\u0442\u044C","body_mode.label":"\u0420\u0435\u0436\u0438\u043C \u0442\u0435\u043B\u0430","body_mode.expand":"\u0420\u0430\u0441\u043A\u0440\u044B\u0442\u0438\u0435","body_mode.modal":"\u041C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u043D\u043E","body_mode.fullscreen":"\u041F\u043E\u043B\u043D\u044B\u0439 \u044D\u043A\u0440\u0430\u043D","body_mode.tabs":"\u0412\u043A\u043B\u0430\u0434\u043A\u0438","body_mode.carousel":"\u041A\u0430\u0440\u0443\u0441\u0435\u043B\u044C","body_mode.subview":"\u041F\u043E\u0434\u0432\u044C\u044E","body_mode.none":"\u041D\u0435\u0442 (\u0442\u043E\u043B\u044C\u043A\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A)","action.tap":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u043E \u043D\u0430\u0436\u0430\u0442\u0438\u044E","action.hold":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u043E \u0443\u0434\u0435\u0440\u0436\u0430\u043D\u0438\u044E","action.double_tap":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043F\u043E \u0434\u0432\u043E\u0439\u043D\u043E\u043C\u0443 \u043D\u0430\u0436\u0430\u0442\u0438\u044E","action.none":"\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F","action.more_info":"\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F","action.toggle":"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C","action.call_service":"\u0412\u044B\u0437\u0432\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0438\u0441","action.navigate":"\u041D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F","action.url":"\u041E\u0442\u043A\u0440\u044B\u0442\u044C URL","grid.columns":"\u041A\u043E\u043B\u043E\u043D\u043A\u0438","grid.gap":"\u041E\u0442\u0441\u0442\u0443\u043F","features.lazy_load":"\u041B\u0435\u043D\u0438\u0432\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430","features.collapsed":"\u0421\u0432\u0451\u0440\u043D\u0443\u0442\u043E \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E","features.visibility":"\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0432\u0438\u0434\u0438\u043C\u043E\u0441\u0442\u0438","section.header":"\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A","section.body":"\u0422\u0435\u043B\u043E","section.cards":"\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438","section.style":"\u0421\u0442\u0438\u043B\u044C","section.actions":"\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F","section.advanced":"\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E","theme.default":"\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E","theme.glass":"\u0421\u0442\u0435\u043A\u043B\u043E","theme.neumorphism":"\u041D\u0435\u043E\u043C\u043E\u0440\u0444\u0438\u0437\u043C","theme.neon":"\u041D\u0435\u043E\u043D","notification.saved":"\u041A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430","notification.error":"\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F","notification.locked":"\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u0430","button.save":"\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C","button.cancel":"\u041E\u0442\u043C\u0435\u043D\u0430","button.add_card":"\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443","button.remove":"\u0423\u0434\u0430\u043B\u0438\u0442\u044C","button.duplicate":"\u0414\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u0442\u044C","button.move_up":"\u0412\u0432\u0435\u0440\u0445","button.move_down":"\u0412\u043D\u0438\u0437","validation.required":"\u041E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u043E\u043B\u0435","validation.invalid_entity":"\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 entity","validation.invalid_icon":"\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0438\u043A\u043E\u043D\u043A\u0438","lock.locked":"\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E","lock.unlock":"\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u0442\u044C","lock.enter_password":"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C","lock.wrong_password":"\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C","misc.loading":"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...","misc.no_data":"\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445","misc.unavailable":"\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E"},[N.ES]:{"card.title":"Universal Card","card.subtitle":"Tarjeta flexible con m\xFAltiples modos","header.title":"T\xEDtulo","header.subtitle":"Subt\xEDtulo","header.icon":"Icono","header.entity":"Entidad","body_mode.label":"Modo del cuerpo","body_mode.expand":"Expandir","body_mode.modal":"Modal","body_mode.fullscreen":"Pantalla completa","body_mode.tabs":"Pesta\xF1as","body_mode.carousel":"Carrusel","body_mode.subview":"Subvista","body_mode.none":"Ninguno","button.save":"Guardar","button.cancel":"Cancelar","button.add_card":"A\xF1adir tarjeta","misc.loading":"Cargando...","misc.unavailable":"No disponible"},[N.DE]:{"card.title":"Universal Card","card.subtitle":"Flexible Karte mit mehreren Modi","header.title":"Titel","header.subtitle":"Untertitel","header.icon":"Symbol","header.entity":"Entit\xE4t","body_mode.label":"K\xF6rpermodus","body_mode.expand":"Erweitern","body_mode.modal":"Modal","body_mode.fullscreen":"Vollbild","body_mode.tabs":"Tabs","body_mode.carousel":"Karussell","button.save":"Speichern","button.cancel":"Abbrechen","button.add_card":"Karte hinzuf\xFCgen","misc.loading":"Laden...","misc.unavailable":"Nicht verf\xFCgbar"}},Yt=class{constructor(){this._currentLanguage=N.EN,this._customTranslations={}}initFromHass(e){if(e!=null&&e.language){let t=e.language.split("-")[0].toLowerCase();qe[t]&&(this._currentLanguage=t)}}setLanguage(e){(qe[e]||this._customTranslations[e])&&(this._currentLanguage=e)}getLanguage(){return this._currentLanguage}t(e,t={}){var a,r,o;let i=(a=this._customTranslations[this._currentLanguage])==null?void 0:a[e];return i||(i=(r=qe[this._currentLanguage])==null?void 0:r[e]),i||(i=(o=qe[N.EN])==null?void 0:o[e]),i?i.replace(/\{(\w+)\}/g,(n,c)=>t[c]!==void 0?t[c]:n):e}addTranslations(e,t){this._customTranslations[e]||(this._customTranslations[e]={}),Object.assign(this._customTranslations[e],t)}getAllTranslations(e){return{...qe[e],...this._customTranslations[e]}}getSupportedLanguages(){return[{code:N.EN,name:"English"},{code:N.RU,name:"\u0420\u0443\u0441\u0441\u043A\u0438\u0439"},{code:N.ES,name:"Espa\xF1ol"},{code:N.DE,name:"Deutsch"},{code:N.FR,name:"Fran\xE7ais"},{code:N.IT,name:"Italiano"},{code:N.PT,name:"Portugu\xEAs"},{code:N.ZH,name:"\u4E2D\u6587"},{code:N.JA,name:"\u65E5\u672C\u8A9E"},{code:N.KO,name:"\uD55C\uAD6D\uC5B4"}]}};var H={DEBUG:"debug",INFO:"info",WARN:"warn",ERROR:"error"},De={LIFECYCLE:"lifecycle",STATE:"state",USER:"user",RENDER:"render",NETWORK:"network",ERROR:"error",PERFORMANCE:"performance"},Sa={enabled:!1,maxEntries:500,persistToStorage:!1,storageKey:"uc_event_log",levels:Object.values(H),categories:Object.values(De),showTimestamp:!0,showCategory:!0,groupSimilar:!0,groupTimeout:1e3},Ve=class{constructor(e={}){this._config={...Sa,...e},this._entries=[],this._listeners=new Set,this._groupedEvents=new Map,this._panel=null,this._isVisible=!1}enable(){this._config.enabled=!0,this._loadFromStorage()}disable(){this._config.enabled=!1}isEnabled(){return this._config.enabled}log(e,t,i,a={}){if(!this._config.enabled||!this._config.levels.includes(e)||!this._config.categories.includes(t))return;let r={id:this._generateId(),timestamp:Date.now(),level:e,category:t,message:i,data:a,stack:e===H.ERROR?new Error().stack:null};if(this._config.groupSimilar){let o=`${t}:${i}`,n=this._groupedEvents.get(o);if(n&&Date.now()-n.lastTime<this._config.groupTimeout){n.count++,n.lastTime=Date.now(),n.entry.count=n.count,this._notifyListeners("update",n.entry);return}this._groupedEvents.set(o,{count:1,lastTime:Date.now(),entry:r}),setTimeout(()=>this._groupedEvents.delete(o),this._config.groupTimeout*2)}r.count=1,this._entries.push(r),this._entries.length>this._config.maxEntries&&this._entries.shift(),this._config.persistToStorage&&this._saveToStorage(),this._notifyListeners("add",r),this._logToConsole(r)}debug(e,t,i){this.log(H.DEBUG,e,t,i)}info(e,t,i){this.log(H.INFO,e,t,i)}warn(e,t,i){this.log(H.WARN,e,t,i)}error(e,t,i){this.log(H.ERROR,e,t,i)}lifecycle(e,t={}){this.info(De.LIFECYCLE,e,t)}stateChange(e,t,i){this.debug(De.STATE,`State changed: ${e}`,{entityId:e,oldState:t,newState:i,changed:t!==i})}userAction(e,t={}){this.info(De.USER,e,t)}render(e,t){this.debug(De.RENDER,`Rendered: ${e}`,{component:e,duration:`${t.toFixed(2)}ms`})}_generateId(){return`${Date.now()}-${Math.random().toString(36).substr(2,9)}`}_logToConsole(e){let t=`[UC:${e.category}]`,i=this._getConsoleStyle(e.level);switch(e.level){case H.DEBUG:console.debug(`%c${t}`,i,e.message,e.data);break;case H.INFO:console.info(`%c${t}`,i,e.message,e.data);break;case H.WARN:console.warn(`%c${t}`,i,e.message,e.data);break;case H.ERROR:console.error(`%c${t}`,i,e.message,e.data),e.stack&&console.error(e.stack);break}}_getConsoleStyle(e){return{[H.DEBUG]:"color: #888",[H.INFO]:"color: #2196f3",[H.WARN]:"color: #ff9800",[H.ERROR]:"color: #f44336; font-weight: bold"}[e]||""}addListener(e){this._listeners.add(e)}removeListener(e){this._listeners.delete(e)}_notifyListeners(e,t){for(let i of this._listeners)try{i(e,t)}catch(a){console.error("[EventLogger] Listener error:",a)}}_loadFromStorage(){if(this._config.persistToStorage)try{let e=localStorage.getItem(this._config.storageKey);e&&(this._entries=JSON.parse(e))}catch(e){console.warn("[EventLogger] Failed to load from storage:",e)}}_saveToStorage(){try{localStorage.setItem(this._config.storageKey,JSON.stringify(this._entries))}catch(e){console.warn("[EventLogger] Failed to save to storage:",e)}}getEntries(e={}){let t=[...this._entries];if(e.level&&(t=t.filter(i=>i.level===e.level)),e.category&&(t=t.filter(i=>i.category===e.category)),e.search){let i=e.search.toLowerCase();t=t.filter(a=>a.message.toLowerCase().includes(i)||JSON.stringify(a.data).toLowerCase().includes(i))}return t}clear(){this._entries=[],this._groupedEvents.clear(),this._config.persistToStorage&&localStorage.removeItem(this._config.storageKey),this._notifyListeners("clear",null)}export(){return JSON.stringify(this._entries,null,2)}showPanel(){if(this._panel){this._panel.style.display="block",this._isVisible=!0;return}this._panel=document.createElement("div"),this._panel.className="uc-event-logger-panel",this._panel.innerHTML=`
      <div class="uc-logger-header">
        <span class="uc-logger-title">Event Logger</span>
        <div class="uc-logger-controls">
          <select class="uc-logger-filter-level">
            <option value="">All Levels</option>
            ${Object.values(H).map(e=>`<option value="${e}">${e}</option>`).join("")}
          </select>
          <select class="uc-logger-filter-category">
            <option value="">All Categories</option>
            ${Object.values(De).map(e=>`<option value="${e}">${e}</option>`).join("")}
          </select>
          <button class="uc-logger-btn uc-logger-clear" title="Clear">
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
          <button class="uc-logger-btn uc-logger-export" title="Export">
            <ha-icon icon="mdi:download"></ha-icon>
          </button>
          <button class="uc-logger-btn uc-logger-close" title="Close">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      </div>
      <div class="uc-logger-entries"></div>
    `,document.body.appendChild(this._panel),this._isVisible=!0,this._renderEntries(),this._panel.querySelector(".uc-logger-close").addEventListener("click",()=>this.hidePanel()),this._panel.querySelector(".uc-logger-clear").addEventListener("click",()=>{this.clear(),this._renderEntries()}),this._panel.querySelector(".uc-logger-export").addEventListener("click",()=>this._exportToFile()),this._panel.querySelectorAll("select").forEach(e=>{e.addEventListener("change",()=>this._renderEntries())}),this.addListener(()=>this._renderEntries())}hidePanel(){this._panel&&(this._panel.style.display="none",this._isVisible=!1)}togglePanel(){this._isVisible?this.hidePanel():this.showPanel()}_renderEntries(){if(!this._panel)return;let e=this._panel.querySelector(".uc-logger-entries"),t=this._panel.querySelector(".uc-logger-filter-level").value,i=this._panel.querySelector(".uc-logger-filter-category").value,a=this.getEntries({level:t||void 0,category:i||void 0});e.innerHTML=a.reverse().map(r=>`
      <div class="uc-logger-entry uc-logger-${r.level}">
        <span class="uc-logger-time">${new Date(r.timestamp).toLocaleTimeString()}</span>
        <span class="uc-logger-level">${r.level}</span>
        <span class="uc-logger-category">${r.category}</span>
        <span class="uc-logger-message">${r.message}</span>
        ${r.count>1?`<span class="uc-logger-count">\xD7${r.count}</span>`:""}
        ${Object.keys(r.data).length>0?`
          <details class="uc-logger-data">
            <summary>Data</summary>
            <pre>${JSON.stringify(r.data,null,2)}</pre>
          </details>
        `:""}
      </div>
    `).join(""),e.scrollTop=0}_exportToFile(){let e=this.export(),t=new Blob([e],{type:"application/json"}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download=`uc-events-${new Date().toISOString().split("T")[0]}.json`,a.click(),URL.revokeObjectURL(i)}static getStyles(){return`
      .uc-event-logger-panel {
        position: fixed;
        bottom: 0;
        right: 0;
        width: 500px;
        max-width: 100vw;
        height: 400px;
        background: var(--ha-card-background, #1c1c1c);
        border: 1px solid var(--divider-color);
        border-radius: 12px 0 0 0;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        font-family: monospace;
        font-size: 12px;
        box-shadow: -4px -4px 16px rgba(0, 0, 0, 0.3);
      }

      .uc-logger-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px 0 0 0;
      }

      .uc-logger-title {
        font-weight: 600;
        font-size: 14px;
      }

      .uc-logger-controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .uc-logger-controls select {
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        font-size: 11px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }

      .uc-logger-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-logger-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .uc-logger-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      .uc-logger-entries {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      .uc-logger-entry {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 6px 8px;
        border-radius: 4px;
        margin-bottom: 4px;
        background: var(--secondary-background-color);
        align-items: baseline;
      }

      .uc-logger-debug { opacity: 0.7; }
      .uc-logger-info .uc-logger-level { color: #2196f3; }
      .uc-logger-warn { background: rgba(255, 152, 0, 0.1); }
      .uc-logger-warn .uc-logger-level { color: #ff9800; }
      .uc-logger-error { background: rgba(244, 67, 54, 0.1); }
      .uc-logger-error .uc-logger-level { color: #f44336; }

      .uc-logger-time {
        color: var(--secondary-text-color);
        font-size: 10px;
      }

      .uc-logger-level {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 10px;
      }

      .uc-logger-category {
        background: var(--primary-color);
        color: white;
        padding: 1px 6px;
        border-radius: 3px;
        font-size: 10px;
      }

      .uc-logger-message {
        flex: 1;
        min-width: 150px;
      }

      .uc-logger-count {
        background: var(--warning-color);
        color: white;
        padding: 1px 6px;
        border-radius: 10px;
        font-size: 10px;
      }

      .uc-logger-data {
        width: 100%;
        margin-top: 4px;
      }

      .uc-logger-data summary {
        cursor: pointer;
        color: var(--secondary-text-color);
        font-size: 11px;
      }

      .uc-logger-data pre {
        margin: 4px 0 0;
        padding: 8px;
        background: var(--code-editor-background-color, #0d0d0d);
        border-radius: 4px;
        overflow-x: auto;
        font-size: 11px;
      }
    `}};var Ca={enabled:!1,watchHass:!0,watchConfig:!0,watchInternal:!0,highlightChanges:!0,changeHighlightDuration:1e3},Wt=class{constructor(e,t={}){this._cardElement=e,this._config={...Ca,...t},this._panel=null,this._isVisible=!1,this._state={hass:null,config:null,internal:{}},this._previousState={},this._watchers=new Map,this._updateInterval=null}enable(){this._config.enabled=!0,this._startWatching()}disable(){this._config.enabled=!1,this._stopWatching()}setHass(e){this._state.hass=e,this._checkChanges("hass")}setConfig(e){this._state.config=e,this._checkChanges("config")}setInternal(e,t){this._state.internal[e]=t,this._checkChanges(`internal.${e}`)}get(e){return this._getByPath(this._state,e)}watch(e,t){this._watchers.has(e)||this._watchers.set(e,new Set),this._watchers.get(e).add(t)}unwatch(e,t){let i=this._watchers.get(e);i&&i.delete(t)}_checkChanges(e){if(!this._config.enabled)return;let t=this.get(e),i=this._getByPath(this._previousState,e);if(JSON.stringify(t)!==JSON.stringify(i)){for(let[a,r]of this._watchers)if(e.startsWith(a)||a.startsWith(e))for(let o of r)try{o(t,i,e)}catch(n){console.error("[StateInspector] Watcher error:",n)}this._setByPath(this._previousState,e,JSON.parse(JSON.stringify(t))),this._isVisible&&this._updatePanel(e)}}_getByPath(e,t){return t.split(".").reduce((i,a)=>i==null?void 0:i[a],e)}_setByPath(e,t,i){let a=t.split("."),r=a.pop(),o=a.reduce((n,c)=>(n[c]||(n[c]={}),n[c]),e);o[r]=i}_startWatching(){this._stopWatching(),this._updateInterval=setInterval(()=>{this._isVisible&&this._renderPanel()},1e3)}_stopWatching(){this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}showPanel(){if(this._panel){this._panel.style.display="flex",this._isVisible=!0,this._renderPanel();return}this._panel=document.createElement("div"),this._panel.className="uc-state-inspector-panel",this._panel.innerHTML=`
      <div class="uc-inspector-header">
        <span class="uc-inspector-title">State Inspector</span>
        <div class="uc-inspector-controls">
          <button class="uc-inspector-btn uc-inspector-refresh" title="Refresh">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </button>
          <button class="uc-inspector-btn uc-inspector-copy" title="Copy State">
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button class="uc-inspector-btn uc-inspector-close" title="Close">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      </div>
      <div class="uc-inspector-tabs">
        <button class="uc-inspector-tab active" data-tab="config">Config</button>
        <button class="uc-inspector-tab" data-tab="hass">Hass</button>
        <button class="uc-inspector-tab" data-tab="internal">Internal</button>
        <button class="uc-inspector-tab" data-tab="entities">Entities</button>
      </div>
      <div class="uc-inspector-content"></div>
      <div class="uc-inspector-footer">
        <input type="text" class="uc-inspector-search" placeholder="Search state..." />
      </div>
    `,document.body.appendChild(this._panel),this._isVisible=!0,this._panel.querySelector(".uc-inspector-close").addEventListener("click",()=>this.hidePanel()),this._panel.querySelector(".uc-inspector-refresh").addEventListener("click",()=>this._renderPanel()),this._panel.querySelector(".uc-inspector-copy").addEventListener("click",()=>this._copyState()),this._panel.querySelectorAll(".uc-inspector-tab").forEach(e=>{e.addEventListener("click",()=>{this._panel.querySelectorAll(".uc-inspector-tab").forEach(t=>t.classList.remove("active")),e.classList.add("active"),this._renderPanel()})}),this._panel.querySelector(".uc-inspector-search").addEventListener("input",e=>{this._renderPanel(e.target.value)}),this._renderPanel()}hidePanel(){this._panel&&(this._panel.style.display="none",this._isVisible=!1)}togglePanel(){this._isVisible?this.hidePanel():this.showPanel()}_renderPanel(e=""){var r;if(!this._panel)return;let t=((r=this._panel.querySelector(".uc-inspector-tab.active"))==null?void 0:r.dataset.tab)||"config",i=this._panel.querySelector(".uc-inspector-content"),a;switch(t){case"config":a=this._state.config;break;case"hass":a=this._getHassInfo();break;case"internal":a=this._state.internal;break;case"entities":a=this._getEntitiesInfo();break}i.innerHTML=this._renderObject(a,"",e),i.querySelectorAll(".uc-inspector-key").forEach(o=>{o.addEventListener("click",()=>{let n=o.nextElementSibling;n!=null&&n.classList.contains("uc-inspector-children")&&(n.classList.toggle("collapsed"),o.classList.toggle("collapsed"))})}),i.querySelectorAll(".uc-inspector-value[contenteditable]").forEach(o=>{o.addEventListener("blur",()=>{let n=o.dataset.path,c=this._parseValue(o.textContent);this._setValue(n,c)})})}_updatePanel(e){if(!this._panel||!this._isVisible)return;let t=this._panel.querySelector(`[data-path="${e}"]`);t&&this._config.highlightChanges&&(t.classList.add("changed"),setTimeout(()=>{t.classList.remove("changed")},this._config.changeHighlightDuration)),this._renderPanel()}_renderObject(e,t="",i="",a=0){if(e===null)return'<span class="uc-inspector-null">null</span>';if(e===void 0)return'<span class="uc-inspector-undefined">undefined</span>';if(typeof e!="object")return this._renderPrimitive(e,t);if(Array.isArray(e)){if(e.length===0)return'<span class="uc-inspector-array">[]</span>';let n=e.map((c,l)=>{let d=t?`${t}[${l}]`:`[${l}]`;return`
          <div class="uc-inspector-item">
            <span class="uc-inspector-index">${l}:</span>
            ${this._renderObject(c,d,i,a+1)}
          </div>
        `}).join("");return`
        <span class="uc-inspector-array-bracket">[</span>
        <div class="uc-inspector-children ${a>1?"collapsed":""}">${n}</div>
        <span class="uc-inspector-array-bracket">]</span>
      `}let r=Object.keys(e);if(r.length===0)return'<span class="uc-inspector-object">{}</span>';let o=r.filter(n=>i?(t?`${t}.${n}`:n).toLowerCase().includes(i.toLowerCase())||JSON.stringify(e[n]).toLowerCase().includes(i.toLowerCase()):!0).map(n=>{let c=t?`${t}.${n}`:n;return`
          <div class="uc-inspector-item">
            <span class="uc-inspector-key ${a>1?"collapsed":""}">${n}:</span>
            ${this._renderObject(e[n],c,i,a+1)}
          </div>
        `}).join("");return`
      <span class="uc-inspector-object-bracket">{</span>
      <div class="uc-inspector-children ${a>1?"collapsed":""}">${o}</div>
      <span class="uc-inspector-object-bracket">}</span>
    `}_renderPrimitive(e,t){let i=typeof e,a=t.startsWith("internal")||t.startsWith("config");return i==="string"?`<span class="uc-inspector-value uc-inspector-string" 
                    data-path="${t}" 
                    ${a?'contenteditable="true"':""}>"${e}"</span>`:i==="number"?`<span class="uc-inspector-value uc-inspector-number" 
                    data-path="${t}"
                    ${a?'contenteditable="true"':""}>${e}</span>`:i==="boolean"?`<span class="uc-inspector-value uc-inspector-boolean" 
                    data-path="${t}"
                    ${a?'contenteditable="true"':""}>${e}</span>`:`<span class="uc-inspector-value">${String(e)}</span>`}_getHassInfo(){var e,t;return this._state.hass?{connected:this._state.hass.connected,language:this._state.hass.language,user:(e=this._state.hass.user)==null?void 0:e.name,themes:Object.keys(((t=this._state.hass.themes)==null?void 0:t.themes)||{}),panelUrl:this._state.hass.panelUrl}:null}_getEntitiesInfo(){var r;let e=this._state.config,t=this._state.hass;if(!e||!t)return{};let i={};e.entity&&(i[e.entity]=(r=t.states)==null?void 0:r[e.entity]);let a=o=>{var n,c;if(o)for(let l of o){if(l.entity&&(i[l.entity]=(n=t.states)==null?void 0:n[l.entity]),l.entities)for(let d of l.entities){let u=typeof d=="string"?d:d.entity;i[u]=(c=t.states)==null?void 0:c[u]}l.cards&&a(l.cards)}};return a(e.cards),i}_parseValue(e){if(e=e.trim(),e==="true")return!0;if(e==="false")return!1;if(e==="null")return null;let t=Number(e);if(!isNaN(t)&&e!=="")return t;if(e.startsWith('"')&&e.endsWith('"'))return e.slice(1,-1);try{return JSON.parse(e)}catch(i){return e}}_setValue(e,t){if(e.startsWith("internal.")){let i=e.replace("internal.","");this.setInternal(i,t)}else e.startsWith("config.")&&_(this._cardElement,"config-changed",{config:this._state.config})}_copyState(){let e=JSON.stringify(this._state,null,2);navigator.clipboard.writeText(e).then(()=>{let t=this._panel.querySelector(".uc-inspector-copy");t.innerHTML='<ha-icon icon="mdi:check"></ha-icon>',setTimeout(()=>{t.innerHTML='<ha-icon icon="mdi:content-copy"></ha-icon>'},1e3)})}destroy(){this._stopWatching(),this._watchers.clear(),this._panel&&(this._panel.remove(),this._panel=null)}static getStyles(){return`
      .uc-state-inspector-panel {
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        width: 400px;
        max-width: calc(100vw - 40px);
        max-height: 80vh;
        background: var(--ha-card-background, #1c1c1c);
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        font-family: monospace;
        font-size: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      }

      .uc-inspector-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px 12px 0 0;
      }

      .uc-inspector-title {
        font-weight: 600;
        font-size: 14px;
      }

      .uc-inspector-controls {
        display: flex;
        gap: 4px;
      }

      .uc-inspector-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-inspector-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .uc-inspector-tabs {
        display: flex;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-inspector-tab {
        flex: 1;
        padding: 8px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 11px;
        transition: all 0.2s;
      }

      .uc-inspector-tab:hover {
        background: var(--secondary-background-color);
      }

      .uc-inspector-tab.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }

      .uc-inspector-content {
        flex: 1;
        overflow: auto;
        padding: 12px;
        min-height: 200px;
      }

      .uc-inspector-footer {
        padding: 8px;
        border-top: 1px solid var(--divider-color);
      }

      .uc-inspector-search {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--secondary-background-color);
        color: var(--primary-text-color);
        font-size: 12px;
      }

      .uc-inspector-item {
        margin-left: 12px;
      }

      .uc-inspector-key {
        color: var(--primary-color);
        cursor: pointer;
      }

      .uc-inspector-key::before {
        content: '\u25BC';
        display: inline-block;
        width: 12px;
        font-size: 8px;
        transition: transform 0.2s;
      }

      .uc-inspector-key.collapsed::before {
        transform: rotate(-90deg);
      }

      .uc-inspector-children.collapsed {
        display: none;
      }

      .uc-inspector-index {
        color: var(--secondary-text-color);
      }

      .uc-inspector-string { color: #ce9178; }
      .uc-inspector-number { color: #b5cea8; }
      .uc-inspector-boolean { color: #569cd6; }
      .uc-inspector-null { color: #569cd6; }
      .uc-inspector-undefined { color: #808080; }

      .uc-inspector-value[contenteditable] {
        cursor: text;
        border-radius: 2px;
        padding: 0 2px;
      }

      .uc-inspector-value[contenteditable]:focus {
        outline: 1px solid var(--primary-color);
        background: var(--secondary-background-color);
      }

      .uc-inspector-value.changed {
        animation: uc-inspector-highlight 1s ease;
      }

      @keyframes uc-inspector-highlight {
        0% { background: var(--warning-color); }
        100% { background: transparent; }
      }
    `}};var be={RENDER:"render",UPDATE:"update",HASS_UPDATE:"hass_update",CONFIG_CHANGE:"config_change",ANIMATION:"animation",NETWORK:"network",MEMORY:"memory"},Ta={enabled:!1,sampleSize:100,warningThreshold:16,errorThreshold:50,autoProfile:!1,trackMemory:!0},Ye=class{constructor(e={}){this._config={...Ta,...e},this._metrics=new Map,this._activeTimers=new Map,this._panel=null,this._isVisible=!1,this._memoryInterval=null,this._fpsHistory=[],this._lastFrameTime=0,this._initMetricTypes()}_initMetricTypes(){for(let e of Object.values(be))this._metrics.set(e,{samples:[],min:1/0,max:0,total:0,count:0})}enable(){this._config.enabled=!0,this._config.trackMemory&&this._startMemoryTracking(),this._config.autoProfile&&this._startFPSTracking()}disable(){this._config.enabled=!1,this._stopMemoryTracking(),this._stopFPSTracking()}start(e,t=be.RENDER){if(!this._config.enabled)return()=>{};let i=performance.now(),a=`${t}:${e}:${i}`;return this._activeTimers.set(a,{name:e,type:t,startTime:i}),()=>this._end(a)}_end(e){let t=this._activeTimers.get(e);if(!t)return;let i=performance.now()-t.startTime;this._activeTimers.delete(e),this._recordMetric(t.type,t.name,i)}async measure(e,t,i){let a=this.start(e,t);try{return await i()}finally{a()}}measureSync(e,t,i){let a=this.start(e,t);try{return i()}finally{a()}}_recordMetric(e,t,i){let a=this._metrics.get(e);if(!a)return;let r={name:t,duration:i,timestamp:Date.now()};a.samples.push(r),a.samples.length>this._config.sampleSize&&a.samples.shift(),a.min=Math.min(a.min,i),a.max=Math.max(a.max,i),a.total+=i,a.count++,i>this._config.errorThreshold?console.warn(`[Profiler] Slow ${e}: ${t} took ${i.toFixed(2)}ms`):i>this._config.warningThreshold&&console.debug(`[Profiler] ${e}: ${t} took ${i.toFixed(2)}ms`),this._isVisible&&this._updatePanel()}_recordMemoryMetric(){if(!performance.memory)return;let e=this._metrics.get(be.MEMORY),t={usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize,jsHeapSizeLimit:performance.memory.jsHeapSizeLimit,timestamp:Date.now()};e.samples.push(t),e.samples.length>this._config.sampleSize&&e.samples.shift()}_startMemoryTracking(){performance.memory&&(this._stopMemoryTracking(),this._memoryInterval=setInterval(()=>{this._recordMemoryMetric()},1e3))}_stopMemoryTracking(){this._memoryInterval&&(clearInterval(this._memoryInterval),this._memoryInterval=null)}_startFPSTracking(){let e=t=>{if(!(!this._config.enabled||!this._config.autoProfile)){if(this._lastFrameTime){let a=1e3/(t-this._lastFrameTime);this._fpsHistory.push({fps:a,timestamp:Date.now()}),this._fpsHistory.length>60&&this._fpsHistory.shift()}this._lastFrameTime=t,requestAnimationFrame(e)}};requestAnimationFrame(e)}_stopFPSTracking(){this._lastFrameTime=0,this._fpsHistory=[]}getStats(e){let t=this._metrics.get(e);return!t||t.count===0?{min:0,max:0,avg:0,count:0,samples:[]}:{min:t.min,max:t.max,avg:t.total/t.count,count:t.count,samples:[...t.samples]}}getCurrentFPS(){return this._fpsHistory.length===0?0:this._fpsHistory.reduce((t,i)=>t+i.fps,0)/this._fpsHistory.length}getMemoryUsage(){var t;let e=(t=this._metrics.get(be.MEMORY))==null?void 0:t.samples;return!e||e.length===0?null:e[e.length-1]}reset(){this._initMetricTypes(),this._fpsHistory=[],this._activeTimers.clear()}showPanel(){if(this._panel){this._panel.style.display="flex",this._isVisible=!0,this._updatePanel();return}this._panel=document.createElement("div"),this._panel.className="uc-profiler-panel",this._panel.innerHTML=`
      <div class="uc-profiler-header">
        <span class="uc-profiler-title">Performance Profiler</span>
        <div class="uc-profiler-controls">
          <button class="uc-profiler-btn uc-profiler-reset" title="Reset">
            <ha-icon icon="mdi:refresh"></ha-icon>
          </button>
          <button class="uc-profiler-btn uc-profiler-export" title="Export">
            <ha-icon icon="mdi:download"></ha-icon>
          </button>
          <button class="uc-profiler-btn uc-profiler-close" title="Close">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
      </div>
      <div class="uc-profiler-summary"></div>
      <div class="uc-profiler-charts"></div>
      <div class="uc-profiler-details"></div>
    `,document.body.appendChild(this._panel),this._isVisible=!0,this._panel.querySelector(".uc-profiler-close").addEventListener("click",()=>this.hidePanel()),this._panel.querySelector(".uc-profiler-reset").addEventListener("click",()=>{this.reset(),this._updatePanel()}),this._panel.querySelector(".uc-profiler-export").addEventListener("click",()=>this._export()),this._updatePanel(),this._panelUpdateInterval=setInterval(()=>{this._isVisible&&this._updatePanel()},500)}hidePanel(){this._panel&&(this._panel.style.display="none",this._isVisible=!1),this._panelUpdateInterval&&(clearInterval(this._panelUpdateInterval),this._panelUpdateInterval=null)}togglePanel(){this._isVisible?this.hidePanel():this.showPanel()}_updatePanel(){if(!this._panel)return;let e=this._panel.querySelector(".uc-profiler-summary"),t=this.getCurrentFPS(),i=this.getMemoryUsage(),a=this.getStats(be.RENDER);e.innerHTML=`
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value ${t<30?"warning":t<55?"caution":""}">${t.toFixed(0)}</span>
        <span class="uc-profiler-stat-label">FPS</span>
      </div>
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value ${a.avg>this._config.warningThreshold?"warning":""}">${a.avg.toFixed(1)}</span>
        <span class="uc-profiler-stat-label">Avg Render (ms)</span>
      </div>
      ${i?`
        <div class="uc-profiler-stat">
          <span class="uc-profiler-stat-value">${(i.usedJSHeapSize/1024/1024).toFixed(1)}</span>
          <span class="uc-profiler-stat-label">Memory (MB)</span>
        </div>
      `:""}
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value">${a.count}</span>
        <span class="uc-profiler-stat-label">Renders</span>
      </div>
    `;let r=this._panel.querySelector(".uc-profiler-charts");r.innerHTML=`
      <div class="uc-profiler-chart">
        <div class="uc-profiler-chart-title">Render Times</div>
        <div class="uc-profiler-chart-bars">
          ${this._renderBars(a.samples.slice(-30))}
        </div>
      </div>
      ${this._fpsHistory.length>0?`
        <div class="uc-profiler-chart">
          <div class="uc-profiler-chart-title">FPS</div>
          <div class="uc-profiler-chart-line">
            ${this._renderLineChart(this._fpsHistory.slice(-60).map(c=>c.fps),60)}
          </div>
        </div>
      `:""}
    `;let o=this._panel.querySelector(".uc-profiler-details"),n=Object.values(be).filter(c=>c!==be.MEMORY);o.innerHTML=n.map(c=>{let l=this.getStats(c);return l.count===0?"":`
        <div class="uc-profiler-detail">
          <div class="uc-profiler-detail-header">${c}</div>
          <div class="uc-profiler-detail-stats">
            <span>Min: ${l.min.toFixed(2)}ms</span>
            <span>Max: ${l.max.toFixed(2)}ms</span>
            <span>Avg: ${l.avg.toFixed(2)}ms</span>
            <span>Count: ${l.count}</span>
          </div>
        </div>
      `}).join("")}_renderBars(e){if(e.length===0)return'<div class="uc-profiler-no-data">No data</div>';let t=Math.max(...e.map(i=>i.duration),this._config.errorThreshold);return e.map(i=>{let a=i.duration/t*100,r="uc-profiler-bar";return i.duration>this._config.errorThreshold?r+=" error":i.duration>this._config.warningThreshold&&(r+=" warning"),`<div class="${r}" style="height: ${a}%" title="${i.name}: ${i.duration.toFixed(2)}ms"></div>`}).join("")}_renderLineChart(e,t=60){if(e.length<2)return"";let i=Math.max(...e,t),a=e.map((o,n)=>{let c=n/(e.length-1)*100,l=100-o/i*100;return`${c},${l}`}).join(" "),r=100-t/i*100;return`
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="${r}" x2="100" y2="${r}" class="uc-profiler-target-line" />
        <polyline points="${a}" class="uc-profiler-line" />
      </svg>
    `}_export(){let e={timestamp:new Date().toISOString(),fps:this.getCurrentFPS(),memory:this.getMemoryUsage(),metrics:{}};for(let r of Object.values(be))e.metrics[r]=this.getStats(r);let t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download=`uc-performance-${new Date().toISOString().split("T")[0]}.json`,a.click(),URL.revokeObjectURL(i)}destroy(){this.disable(),this.hidePanel(),this._panel&&(this._panel.remove(),this._panel=null)}static getStyles(){return`
      .uc-profiler-panel {
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 350px;
        max-width: calc(100vw - 40px);
        background: var(--ha-card-background, #1c1c1c);
        border: 1px solid var(--divider-color);
        border-radius: 12px;
        z-index: 10001;
        display: flex;
        flex-direction: column;
        font-family: monospace;
        font-size: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        max-height: 500px;
        overflow: hidden;
      }

      .uc-profiler-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: var(--primary-color);
        color: white;
        border-radius: 12px 12px 0 0;
      }

      .uc-profiler-title {
        font-weight: 600;
        font-size: 14px;
      }

      .uc-profiler-controls {
        display: flex;
        gap: 4px;
      }

      .uc-profiler-btn {
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uc-profiler-summary {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        padding: 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-profiler-stat {
        text-align: center;
      }

      .uc-profiler-stat-value {
        display: block;
        font-size: 20px;
        font-weight: 600;
        color: var(--primary-color);
      }

      .uc-profiler-stat-value.warning {
        color: var(--error-color);
      }

      .uc-profiler-stat-value.caution {
        color: var(--warning-color);
      }

      .uc-profiler-stat-label {
        font-size: 10px;
        color: var(--secondary-text-color);
      }

      .uc-profiler-charts {
        padding: 12px;
        border-bottom: 1px solid var(--divider-color);
      }

      .uc-profiler-chart {
        margin-bottom: 12px;
      }

      .uc-profiler-chart:last-child {
        margin-bottom: 0;
      }

      .uc-profiler-chart-title {
        font-size: 10px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }

      .uc-profiler-chart-bars {
        display: flex;
        align-items: flex-end;
        height: 40px;
        gap: 1px;
        background: var(--secondary-background-color);
        border-radius: 4px;
        padding: 2px;
      }

      .uc-profiler-bar {
        flex: 1;
        background: var(--primary-color);
        border-radius: 1px;
        min-height: 2px;
        transition: height 0.1s;
      }

      .uc-profiler-bar.warning {
        background: var(--warning-color);
      }

      .uc-profiler-bar.error {
        background: var(--error-color);
      }

      .uc-profiler-chart-line {
        height: 40px;
        background: var(--secondary-background-color);
        border-radius: 4px;
      }

      .uc-profiler-chart-line svg {
        width: 100%;
        height: 100%;
      }

      .uc-profiler-line {
        fill: none;
        stroke: var(--primary-color);
        stroke-width: 2;
        vector-effect: non-scaling-stroke;
      }

      .uc-profiler-target-line {
        stroke: var(--success-color, #4caf50);
        stroke-width: 1;
        stroke-dasharray: 4 2;
        vector-effect: non-scaling-stroke;
      }

      .uc-profiler-details {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
      }

      .uc-profiler-detail {
        margin-bottom: 8px;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 6px;
      }

      .uc-profiler-detail-header {
        font-weight: 600;
        text-transform: capitalize;
        margin-bottom: 4px;
      }

      .uc-profiler-detail-stats {
        display: flex;
        gap: 12px;
        font-size: 10px;
        color: var(--secondary-text-color);
      }

      .uc-profiler-no-data {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
      }
    `}};var li={BEFORE_INIT:"beforeInit",AFTER_INIT:"afterInit",BEFORE_RENDER:"beforeRender",AFTER_RENDER:"afterRender",BEFORE_UPDATE:"beforeUpdate",AFTER_UPDATE:"afterUpdate",BEFORE_DESTROY:"beforeDestroy",CONFIG_VALIDATE:"configValidate",CONFIG_TRANSFORM:"configTransform",STATE_CHANGE:"stateChange",HASS_UPDATE:"hassUpdate",HEADER_RENDER:"headerRender",BODY_RENDER:"bodyRender",FOOTER_RENDER:"footerRender",ACTION_EXECUTE:"actionExecute",CLICK:"click",HOLD:"hold",CUSTOM:"custom"},$a={HIGHEST:0,HIGH:25,NORMAL:50,LOW:75,LOWEST:100},Xt=class{constructor(){this._plugins=new Map,this._hooks=new Map,this._enabled=!0,this._logger=null,this._initHooks()}_initHooks(){for(let e of Object.values(li))this._hooks.set(e,[])}setLogger(e){this._logger=e}register(e){if(!this._validatePlugin(e))return console.error("[PluginSystem] Invalid plugin:",e),!1;let{id:t,name:i,version:a,hooks:r,init:o,destroy:n}=e;if(this._plugins.has(t)&&(console.warn(`[PluginSystem] Plugin "${t}" already registered, updating...`),this.unregister(t)),this._plugins.set(t,{id:t,name:i||t,version:a||"1.0.0",hooks:r||{},init:o,destroy:n,enabled:!0,context:{}}),this._registerHooks(t,r||{}),o)try{o.call(this._plugins.get(t).context)}catch(c){console.error(`[PluginSystem] Error initializing plugin "${t}":`,c)}return this._log("info",`Plugin registered: ${i||t} v${a||"1.0.0"}`),!0}_validatePlugin(e){return!(!e||typeof e!="object"||!e.id||typeof e.id!="string")}_registerHooks(e,t){for(let[i,a]of Object.entries(t)){this._hooks.has(i)||this._hooks.set(i,[]);let r={pluginId:e,handler:typeof a=="function"?a:a.handler,priority:typeof a=="object"&&a.priority!=null?a.priority:$a.NORMAL};this._hooks.get(i).push(r),this._hooks.get(i).sort((o,n)=>o.priority-n.priority)}}unregister(e){let t=this._plugins.get(e);if(!t)return!1;if(t.destroy)try{t.destroy.call(t.context)}catch(i){console.error(`[PluginSystem] Error destroying plugin "${e}":`,i)}for(let i of this._hooks.values()){let a=i.findIndex(r=>r.pluginId===e);a!==-1&&i.splice(a,1)}return this._plugins.delete(e),this._log("info",`Plugin unregistered: ${e}`),!0}enable(e){let t=this._plugins.get(e);t&&(t.enabled=!0)}disable(e){let t=this._plugins.get(e);t&&(t.enabled=!1)}async executeHook(e,t={},i={}){if(!this._enabled)return t;let a=this._hooks.get(e);if(!a||a.length===0)return t;let r={...t};for(let{pluginId:o,handler:n}of a){let c=this._plugins.get(o);if(!(!c||!c.enabled))try{let l=await n.call(c.context,r,i);if(l&&typeof l=="object"&&(r={...r,...l}),l===!1){this._log("debug",`Hook "${e}" chain stopped by plugin "${o}"`);break}}catch(l){console.error(`[PluginSystem] Error in hook "${e}" (plugin: ${o}):`,l),this._log("error",`Hook error: ${e} (${o}): ${l.message}`)}}return r}executeHookSync(e,t={},i={}){if(!this._enabled)return t;let a=this._hooks.get(e);if(!a||a.length===0)return t;let r={...t};for(let{pluginId:o,handler:n}of a){let c=this._plugins.get(o);if(!(!c||!c.enabled))try{let l=n.call(c.context,r,i);if(l&&typeof l=="object"&&(r={...r,...l}),l===!1)break}catch(l){console.error(`[PluginSystem] Error in hook "${e}" (plugin: ${o}):`,l)}}return r}getPlugins(){return Array.from(this._plugins.values()).map(e=>({id:e.id,name:e.name,version:e.version,enabled:e.enabled}))}getPlugin(e){return this._plugins.get(e)||null}hasPlugin(e){return this._plugins.has(e)}enableSystem(){this._enabled=!0}disableSystem(){this._enabled=!1}_log(e,t){this._logger&&this._logger.log(e,"plugin",t)}destroy(){for(let e of this._plugins.keys())this.unregister(e);this._hooks.clear(),this._enabled=!1}};function Aa(s){return{id:s.id,name:s.name||s.id,version:s.version||"1.0.0",description:s.description||"",author:s.author||"",hooks:s.hooks||{},init:s.init,destroy:s.destroy}}var un=Aa({id:"example-plugin",name:"Example Plugin",version:"1.0.0",description:"\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u043F\u043B\u0430\u0433\u0438\u043D",hooks:{[li.AFTER_INIT]:function(s){return console.log("[ExamplePlugin] Card initialized!"),s},[li.CONFIG_TRANSFORM]:function(s){return s}},init(){console.log("[ExamplePlugin] Plugin initialized")},destroy(){console.log("[ExamplePlugin] Plugin destroyed")}});var La={APPEND:"append",PREPEND:"prepend",REPLACE:"replace"},$e={CARD:"card",HEADER:"header",BODY:"body",FOOTER:"footer",GLOBAL:"global"},Ia={enabled:!0,sanitize:!0,allowVariables:!0,allowAnimations:!0,maxLength:5e4,blockedProperties:["behavior","expression","-moz-binding"],blockedSelectors:["body","html",":root","head","script"]},Kt=class{constructor(e,t={}){this._shadowRoot=e,this._config={...Ia,...t},this._styles=new Map,this._styleElement=null,this._init()}_init(){this._styleElement=document.createElement("style"),this._styleElement.setAttribute("data-custom-css","true"),this._shadowRoot.appendChild(this._styleElement)}add(e,t,i={}){if(!this._config.enabled)return!1;let{scope:a=$e.CARD,mode:r=La.APPEND,priority:o=0}=i;if(!t||typeof t!="string")return console.warn("[CustomCSS] Invalid CSS"),!1;if(t.length>this._config.maxLength)return console.warn("[CustomCSS] CSS exceeds maximum length"),!1;let n=t;return this._config.sanitize&&(n=this._sanitize(t),!n)?(console.warn("[CustomCSS] CSS failed sanitization"),!1):(n=this._addScopePrefix(n,a),this._styles.set(e,{css:n,originalCSS:t,scope:a,mode:r,priority:o,enabled:!0}),this._updateStyles(),!0)}remove(e){let t=this._styles.delete(e);return t&&this._updateStyles(),t}enable(e){let t=this._styles.get(e);t&&(t.enabled=!0,this._updateStyles())}disable(e){let t=this._styles.get(e);t&&(t.enabled=!1,this._updateStyles())}update(e,t){let i=this._styles.get(e);return i?this.add(e,t,{scope:i.scope,mode:i.mode,priority:i.priority}):!1}_sanitize(e){let t=e;t=t.replace(/\/\*[\s\S]*?\*\//g,"");for(let i of this._config.blockedProperties)if(new RegExp(`${i}\\s*:`,"gi").test(t))return console.warn(`[CustomCSS] Blocked property detected: ${i}`),null;for(let i of this._config.blockedSelectors)if(new RegExp(`(^|[{},\\s])${i}[\\s{,]`,"gi").test(t))return console.warn(`[CustomCSS] Blocked selector detected: ${i}`),null;return/url\s*\(\s*['"]?\s*javascript:/gi.test(t)?(console.warn("[CustomCSS] JavaScript URL detected"),null):(/@import/gi.test(t)&&(console.warn("[CustomCSS] @import is not allowed"),t=t.replace(/@import[^;]*;/gi,"")),this._config.allowAnimations||(t=t.replace(/animation[^;]*;/gi,""),t=t.replace(/transition[^;]*;/gi,"")),t)}_addScopePrefix(e,t){if(t===$e.GLOBAL)return e;let a={[$e.CARD]:":host",[$e.HEADER]:".uc-header",[$e.BODY]:".uc-body",[$e.FOOTER]:".uc-footer"}[t]||"";return a?e.replace(/([^{}]+)(\{[^}]*\})/g,(r,o,n)=>`${o.split(",").map(l=>(l=l.trim(),l.startsWith(":host")||l.startsWith(a)?l:a===":host"?`:host ${l}`:`${a} ${l}`)).join(", ")} ${n}`):e}_updateStyles(){if(!this._styleElement)return;let t=Array.from(this._styles.values()).filter(i=>i.enabled).sort((i,a)=>i.priority-a.priority).map(i=>i.css).join(`

`);this._styleElement.textContent=t}applyFromConfig(e){for(let t of this._styles.keys())t.startsWith("config-")&&this._styles.delete(t);if(!e){this._updateStyles();return}if(typeof e=="string"){this.add("config-main",e);return}if(Array.isArray(e)){e.forEach((t,i)=>{typeof t=="string"?this.add(`config-${i}`,t):typeof t=="object"&&this.add(`config-${t.id||i}`,t.css,t)});return}if(typeof e=="object")for(let[t,i]of Object.entries(e))if($e[t.toUpperCase()])this.add(`config-${t}`,i,{scope:t});else{this.add(`config-${e.id||"main"}`,e.css||e,e);break}}setVariable(e,t){if(!this._config.allowVariables)return;let a=`:host { ${e.startsWith("--")?e:`--${e}`}: ${t}; }`;this.add(`var-${e}`,a,{priority:-1})}setVariables(e){for(let[t,i]of Object.entries(e))this.setVariable(t,i)}getStyles(){return Array.from(this._styles.entries()).map(([e,t])=>({id:e,...t}))}clear(){this._styles.clear(),this._styleElement&&(this._styleElement.textContent="")}destroy(){this.clear(),this._styleElement&&(this._styleElement.remove(),this._styleElement=null)}static fromObject(e){let t=[];for(let[i,a]of Object.entries(e)){let r=Object.entries(a).map(([o,n])=>`  ${o.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${n};`).join(`
`);t.push(`${i} {
${r}
}`)}return t.join(`

`)}static get helpers(){return{hide:e=>`${e} { display: none !important; }`,color:(e,t)=>`${e} { color: ${t} !important; }`,background:(e,t)=>`${e} { background: ${t} !important; }`,padding:(e,t)=>`${e} { padding: ${t} !important; }`,border:(e,t)=>`${e} { border: ${t} !important; }`,fontSize:(e,t)=>`${e} { font-size: ${t} !important; }`,borderRadius:(e,t)=>`${e} { border-radius: ${t} !important; }`,shadow:(e,t)=>`${e} { box-shadow: ${t} !important; }`,fadeIn:(e,t="0.3s")=>`
        ${e} {
          animation: uc-custom-fade-in ${t} ease;
        }
        @keyframes uc-custom-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,gradient:(e,t,i,a="to bottom")=>`${e} { background: linear-gradient(${a}, ${t}, ${i}) !important; }`}}};m("[UC] 1. Start loading");m("[UC] 2. Constants loaded");m("[UC] 3. UniversalCard loaded");m("[UC] 4. Editor loaded");m("[UC] 5. Config loaded");m("[UC] 6. Performance utils loaded");m("[UC] 7. Helpers loaded");m("[UC] 8. HA helpers loaded");m("[UC] 9. Modes loaded");m("[UC] 10. Features loaded");m("[UC] 11. UI loaded");m("[UC] 12. Advanced loaded");m("[UC] 13. Complex loaded");m("[UC] 14. Themes loaded");m("[UC] 15. Widgets loaded");m("[UC] 16. Editor components loaded");m("[UC] 17. Devtools loaded");m("[UC] 18. Extensibility loaded");m("[UC] 19. Styles loaded");m("[UC] 20. Starting registration...");customElements.get("universal-card")||(m("[UC] 21. Defining universal-card..."),customElements.define("universal-card",He),m("[UC] 22. universal-card defined"));customElements.get("universal-card-editor")||(m("[UC] 23. Defining universal-card-editor..."),customElements.define("universal-card-editor",Fe),m("[UC] 24. universal-card-editor defined"));window.customCards=window.customCards||[];window.customCards.some(s=>s.type==="universal-card")||window.customCards.push({type:"universal-card",name:wi,description:ki,preview:!0,documentationURL:"https://github.com/Mesteriis/universal-card"});window.UniversalCard={version:ei,UniversalCard:He,UniversalCardEditor:Fe,ConfigManager:xe,createMode:et,getAllModeStyles:tt,modes:{BaseMode:D,ExpandMode:le,ModalMode:de,FullscreenMode:ue,TabsMode:ee,CarouselMode:te},features:{VisibilityConditions:it,StateStyles:at,SwipeGestures:rt,ResponsiveBreakpoints:nt},ui:{Header:Oe,Footer:Re,Badges:Qe,ContextMenu:st,RadialMenu:ct},advanced:{EntityPreview:lt,Alerts:dt,QuickActions:ut,Timer:pt,IconMapping:ht,AnimationPresets:mt,WebSocketOptimizer:Be,getWebSocketOptimizer:zi,createThrottledCallback:Ui,createDebouncedCallback:Pi},complex:{CardLinking:ft,AutoGrouping:gt,CompactMode:_t},themes:{Glassmorphism:yt,Neumorphism:xt,BackgroundPatterns:wt,BorderAnimations:Et,HoverEffects:Ct,ColorSchemes:Tt,LoadingVariants:$t,MicroInteractions:At},widgets:{RestApiWidget:Lt,ImageEntity:It,MediaPlayerMini:Ot,NotificationCenter:Rt},editor:{ConfigValidator:Nt,DragDrop:Mt,ResizableCards:Dt,LockMode:zt,TextInput:Ut,NumberInput:Pt,Checkbox:Ht,Select:Ft,EntityPicker:Bt,IconPicker:jt,ColorPicker:Gt,Section:qt,ActionEditor:Vt,getEditorStyles:Vi,MultiLanguage:Yt},devtools:{EventLogger:Ve,StateInspector:Wt,PerformanceProfiler:Ye},PluginSystem:Xt,CustomCSS:Kt,utils:{debounce:Q,throttle:Ie,raf:Si,rafDouble:Ci,batchUpdates:ti,createBatchUpdater:Ti,whenIdle:$i,measureTime:Ai,deepMerge:Qt,deepClone:K,generateId:We,isObject:X,isNonEmptyString:Zt,fireEvent:_,nextFrame:yi,getNestedValue:_i,ensureArray:bi,formatNumber:vi,formatDateTime:xi,isValidEntityId:Xe,getCardHelpers:Pe,createCardElement:ii,createCardElements:ce,createErrorCard:ai,getEntityState:Je,getStateValue:R,getAttributeValue:ae,isState:Li,executeAction:J,hapticFeedback:Ii,getThemeVariables:Oi,getCurrentUser:Ze,isUserAdmin:Ri},constants:{BODY_MODES:E,THEMES:f,DEFAULTS:T,EVENTS:ve,ACTION_TYPES:V,CONDITION_TYPES:A,CSS_VARS:Ei,LIMITS:M,ALERT_TYPES:pe,ALERT_CONDITIONS:Z,TIMER_MODES:z,DISPLAY_FORMATS:ke,ANIMATION_CATEGORIES:x,PRESETS:he,PRESET_MAPPINGS:Ne,UPDATE_STRATEGIES:me,UPDATE_PRIORITY:re},config:{ConfigManager:xe,ConfigValidationError:w}};console.info("%c \u{1F3B4} UNIVERSAL-CARD %c v"+ei+" %c","color: white; background: #3498db; font-weight: bold; padding: 2px 8px; border-radius: 4px 0 0 4px;","color: #3498db; background: #ecf0f1; font-weight: bold; padding: 2px 8px; border-radius: 0 4px 4px 0;","");var di=null,ui=null;function Yi(s,e){e=e||document;for(var t=[],i=e.querySelectorAll(s),a=0;a<i.length;a++)t.push(i[a]);for(var r=e.querySelectorAll("*"),o=0;o<r.length;o++){var n=r[o];if(n.shadowRoot)for(var c=Yi(s,n.shadowRoot),l=0;l<c.length;l++)t.push(c[l])}return t}window.__UC_DEVTOOLS__={get logger(){return di||(di=new Ve({enabled:!0})),di},get profiler(){return ui||(ui=new Ye({enabled:!0})),ui},findCards:function(){return Yi("universal-card")},showLogger:function(){return this.logger.showPanel(),"Logger panel opened"},showProfiler:function(){return this.profiler.showPanel(),"Profiler panel opened"},showInspector:function(){console.log("%c\u{1F4CA} State Inspector","color: #9b59b6; font-weight: bold;"),console.log("All universal-card elements (including Shadow DOM):");var s=this.findCards();return s.forEach(function(e,t){console.log("Card "+t+":",{title:e._config?e._config.title:"unknown",config:e._config,expanded:e._expanded,hass:e._hass?"connected":"not connected",bodyCards:e._bodyCards?e._bodyCards.length:0})}),"Found "+s.length+" cards"},listCards:function(){var s=this.findCards();return console.table(Array.from(s).map(function(e,t){return{index:t,title:e._config?e._config.title:"unknown",mode:e._config?e._config.body_mode:"unknown",expanded:e._expanded}})),s.length+" cards found"},toggleCard:function(s){var e=this.findCards();return e[s]?(e[s]._toggle(),"Toggled card "+s):"Card not found"},getCard:function(s){var e=this.findCards();return e[s]||null}};window.enableUniversalCardDebug=function(){return Jt(!0),console.log("%c\u{1F527} Universal Card Debug Mode Enabled","color: #03a9f4; font-weight: bold; font-size: 14px;"),console.log(""),console.log("%cAvailable commands:","font-weight: bold;"),console.log("  \u2022 __UC_DEVTOOLS__.listCards()       - List all cards"),console.log("  \u2022 __UC_DEVTOOLS__.showInspector()   - Show card states"),console.log("  \u2022 __UC_DEVTOOLS__.toggleCard(0)     - Toggle card by index"),console.log("  \u2022 __UC_DEVTOOLS__.getCard(0)        - Get card element"),console.log("  \u2022 __UC_DEVTOOLS__.showLogger()      - Show event logger"),console.log("  \u2022 __UC_DEVTOOLS__.showProfiler()    - Show profiler"),console.log("  \u2022 disableUniversalCardDebug()       - Disable debug mode"),console.log(""),console.log("%cQuick access:","font-weight: bold;"),console.log("  \u2022 window.UniversalCard - Full API"),"Debug mode enabled! Logs will now appear. Try __UC_DEVTOOLS__.listCards()"};window.disableUniversalCardDebug=function(){return Jt(!1),console.log("%c\u{1F527} Universal Card Debug Mode Disabled","color: #888; font-weight: bold;"),"Debug mode disabled. Logs will be suppressed."};m("[UC] Debug functions registered: enableUniversalCardDebug(), __UC_DEVTOOLS__");})();
