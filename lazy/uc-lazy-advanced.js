function ie(a,e=100,t={}){let{leading:i=!1,trailing:r=!0}=t,n=null,s=null,o=null,c,l=null;function d(m){let L=s,Q=o;return L&&(s=null,o=null,l=m,c=a.apply(Q,L)),c}function h(m){let L=l===null?e:m-l;return l===null||L>=e}function b(){let m=Date.now();return h(m)?g(m):(n=setTimeout(b,e-(m-l)),c)}function g(m){return n=null,r&&s?d(m):(s=null,o=null,c)}function u(m){return l=m,n=setTimeout(b,e),i?d(m):c}function C(...m){let L=Date.now(),Q=h(L);return s=m,o=this,Q&&n===null?u(L):(n===null&&(n=setTimeout(b,e)),c)}return C.cancel=function(){n!==null&&clearTimeout(n),s=null,o=null,l=null,n=null},C.flush=function(){return n!==null?g(Date.now()):c},C.pending=function(){return n!==null},C}function Ne(a,e=16,t={}){let{leading:i=!0,trailing:r=!0}=t,n=0,s=null,o=null,c=null;function l(){let h=o,b=c;if(h)return o=null,c=null,n=Date.now(),a.apply(b,h)}function d(...h){let g=Date.now()-n;if(o=h,c=this,g>=e&&(s!==null&&(clearTimeout(s),s=null),i))return l();if(s===null&&r){let u=e-g;s=setTimeout(()=>{s=null,l()},u>0?u:0)}}return d.cancel=function(){s!==null&&(clearTimeout(s),s=null),n=0,o=null,c=null},d}var Me=()=>{};function Pe(a){return new Error(`[ProviderContext] ${a}`)}function Z(a){return typeof a=="function"}function J(a){return!!a&&typeof a=="object"&&!Array.isArray(a)}function De(a,e){if(!J(e))return null;let t=J(e.attributes)?e.attributes:{},i=typeof e.state=="string"?e.state:"";return{...e,entity_id:typeof e.entity_id=="string"?e.entity_id:void 0,state:i,attributes:t}}function Qe(a){return J(a)?Object.fromEntries(Object.entries(a).map(([e,t])=>[e,De(e,t)]).filter(([,e])=>e!==null)):{}}function Ze(a){if(a instanceof Date&&!Number.isNaN(a.getTime()))return a;if(typeof a=="string"||typeof a=="number"){let e=new Date(a);if(!Number.isNaN(e.getTime()))return e}return new Date}function Je(a){let e=a.notification_id??a.id??`notification-${Date.now()}`;return{id:String(e),title:typeof a.title=="string"?a.title:"",message:typeof a.message=="string"?a.message:"",created_at:Ze(a.created_at),source:"persistent_notification",dismissible:!0,raw:a}}function et(a){let e=a?.data?.entity_id;return typeof e=="string"&&e.startsWith("persistent_notification.")}function tt(a){return a?.data?.domain==="persistent_notification"}async function it(a){let e=await a;return Z(e)?e:Me}function rt(a){if(Z(a))return a;if(Z(globalThis.fetch))return globalThis.fetch.bind(globalThis);throw Pe("HTTP provider is unavailable because fetch is not defined.")}function He(a){return!!a&&typeof a=="object"&&a.__universalCardProviderContext===!0}function nt(a,e={}){if(He(a))return a;let t=a??null,i=rt(e.fetcher),r=o=>{let c=t,l=c?.[o];if(!Z(l))throw Pe(`Home Assistant provider method "${String(o)}" is unavailable.`);return l.bind(c)},n={async call(o){return r("callWS")(o)},async subscribe(o,c){let l=t?.connection?.subscribeEvents;return Z(l)?it(l.call(t?.connection,o,c)):Me}},s={__universalCardProviderContext:!0,setHass(o){t=o??null},getHass(){return t},entities:{getState(o){if(!o)return null;let c=t?.states?.[o];return De(o,c)},getStates(){return Qe(t?.states)}},services:{async call(o,c,l,d){return r("callService")(o,c,l||{},d)}},api:{async call(o,c,l){return r("callApi")(o,c,l||{})}},websocket:n,http:{async request(o,c){return i(o,c)}},notifications:{async list(){let o=await n.call({type:"persistent_notification/get"});return J(o)?Object.values(o).filter(J).map(c=>Je(c)):[]},async dismiss(o){await s.services.call("persistent_notification","dismiss",{notification_id:o})},async subscribe(o){let c=await Promise.all([n.subscribe(l=>{et(l)&&o({reason:"state_changed",event:l})},"state_changed"),n.subscribe(l=>{tt(l)&&o({reason:"call_service",event:l})},"call_service"),n.subscribe(l=>{o({reason:"persistent_notifications_updated",event:l})},"persistent_notifications_updated")]);return()=>{c.forEach(l=>{try{l()}catch(d){console.warn("[ProviderContext] Failed to unsubscribe notification stream:",d)}})}}}};return s}function v(a,e={}){return He(a)?a:nt(a,e)}var st={width:120,height:40,hours:24,strokeWidth:2,strokeColor:"var(--primary-color, #03a9f4)",fillColor:"var(--primary-color, #03a9f4)",fillOpacity:.1,showValue:!0,showMinMax:!1,animationDuration:200,position:"top",offset:8},re=class{constructor(e,t={}){this._providers=v(e),this._config={...st,...t},this._previewElement=null,this._currentEntityId=null,this._historyCache=new Map,this._hideTimeout=null,this._debouncedShow=ie(this._showPreview.bind(this),150)}set hass(e){this._providers.setHass(e)}_createPreviewElement(){let e=document.createElement("div");return e.className="uc-entity-preview",e.innerHTML=`
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
    `,document.body.appendChild(e),e}attach(e,t){!e||!t||(e.addEventListener("mouseenter",i=>{this._currentEntityId=t,this._debouncedShow(e,t)}),e.addEventListener("mouseleave",()=>{this._hidePreview()}),e.addEventListener("mousemove",i=>{this._updatePosition(i)}))}detach(e){if(!e)return;let t=e.cloneNode(!0);return e.parentNode?.replaceChild(t,e),t}async _showPreview(e,t){if(this._currentEntityId!==t)return;this._previewElement||(this._previewElement=this._createPreviewElement());let i=this._providers.entities.getState(t);if(!i)return;let r=this._previewElement.querySelector(".uc-preview-name"),n=this._previewElement.querySelector(".uc-preview-value");r.textContent=i.attributes.friendly_name||t,n.textContent=`${i.state} ${i.attributes.unit_of_measurement||""}`;let s=await this._fetchHistory(t);s&&s.length>0&&this._currentEntityId===t&&(this._renderSparkline(s),this._config.showMinMax&&this._renderStats(s)),this._positionPreview(e),this._previewElement.classList.add("visible")}_hidePreview(){this._currentEntityId=null,this._hideTimeout&&clearTimeout(this._hideTimeout),this._hideTimeout=setTimeout(()=>{this._previewElement&&this._previewElement.classList.remove("visible")},100)}async _fetchHistory(e){let t=this._historyCache.get(e);if(t&&Date.now()-t.timestamp<6e4)return t.data;try{let i=new Date,r=new Date(i.getTime()-this._config.hours*60*60*1e3),n=await this._providers.api.call("GET",`history/period/${r.toISOString()}?filter_entity_id=${e}&end_time=${i.toISOString()}&minimal_response&no_attributes`);if(n&&n[0]){let s=n[0].map(o=>({time:new Date(o.last_changed),value:parseFloat(o.state)})).filter(o=>!isNaN(o.value));return this._historyCache.set(e,{data:s,timestamp:Date.now()}),s}}catch(i){console.warn(`[EntityPreview] Failed to fetch history for ${e}:`,i)}return[]}_renderSparkline(e){let t=this._previewElement.querySelector(".uc-preview-sparkline");if(!t||e.length<2)return;let{width:i,height:r,strokeWidth:n,strokeColor:s,fillColor:o,fillOpacity:c}=this._config,l=e.map(P=>P.value),d=Math.min(...l),b=Math.max(...l)-d||1,g=n,u=i-g*2,C=r-g*2,m=e.map((P,Ae)=>{let qe=g+Ae/(e.length-1)*u,Ke=g+C-(P.value-d)/b*C;return{x:qe,y:Ke}}),L=m.map((P,Ae)=>Ae===0?`M ${P.x} ${P.y}`:`L ${P.x} ${P.y}`).join(" "),Q=`${L} L ${m[m.length-1].x} ${r-g} L ${g} ${r-g} Z`;t.setAttribute("width",i),t.setAttribute("height",r),t.innerHTML=`
      <defs>
        <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${o};stop-opacity:${c}" />
          <stop offset="100%" style="stop-color:${o};stop-opacity:0" />
        </linearGradient>
      </defs>
      <path d="${Q}" fill="url(#sparkline-gradient)" />
      <path d="${L}" fill="none" stroke="${s}" stroke-width="${n}" 
            stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${m[m.length-1].x}" cy="${m[m.length-1].y}" 
              r="3" fill="${s}" />
    `}_renderStats(e){let t=e.map(c=>c.value),i=Math.min(...t),r=Math.max(...t),n=this._previewElement.querySelector(".uc-preview-min"),s=this._previewElement.querySelector(".uc-preview-max");n.textContent=`Min: ${i.toFixed(1)}`,s.textContent=`Max: ${r.toFixed(1)}`;let o=this._previewElement.querySelector(".uc-preview-stats");o&&(o.style.display="flex")}_positionPreview(e){if(!this._previewElement||!e)return;let t=e.getBoundingClientRect(),i=this._previewElement.getBoundingClientRect(),{position:r,offset:n}=this._config,s,o;switch(r){case"top":s=t.top-i.height-n,o=t.left+(t.width-i.width)/2;break;case"bottom":s=t.bottom+n,o=t.left+(t.width-i.width)/2;break;case"left":s=t.top+(t.height-i.height)/2,o=t.left-i.width-n;break;case"right":s=t.top+(t.height-i.height)/2,o=t.right+n;break}let c=window.innerWidth,l=window.innerHeight;o<8&&(o=8),o+i.width>c-8&&(o=c-i.width-8),s<8&&(s=t.bottom+n),s+i.height>l-8&&(s=t.top-i.height-n),this._previewElement.style.top=`${s}px`,this._previewElement.style.left=`${o}px`}_updatePosition(e){}clearCache(){this._historyCache.clear()}destroy(){this._hidePreview(),this._previewElement&&(this._previewElement.remove(),this._previewElement=null),this._historyCache.clear()}static getStyles(){return`
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
    `}};function O(a,e,t={},i={}){let r=new CustomEvent(e,{bubbles:i.bubbles!==!1,cancelable:i.cancelable!==!1,composed:i.composed!==!1,detail:t});return a.dispatchEvent(r),r}var D={INFO:"info",WARNING:"warning",ERROR:"error",SUCCESS:"success",CRITICAL:"critical"},$={ABOVE:"above",BELOW:"below",EQUALS:"equals",NOT_EQUALS:"not_equals",BETWEEN:"between",OUTSIDE:"outside",CHANGED:"changed",UNAVAILABLE:"unavailable"},F={BADGE:"badge",BORDER:"border",PULSE:"pulse",SHAKE:"shake",NOTIFICATION:"notification",SOUND:"sound",SERVICE:"service"},ot={debounce_time:1e3,history_size:10,auto_dismiss:5e3,sounds:{info:"/local/sounds/info.mp3",warning:"/local/sounds/warning.mp3",error:"/local/sounds/error.mp3",critical:"/local/sounds/critical.mp3"}},ne=class{constructor(e,t={}){this._providers=v(e),this._config={...ot,...t},this._alerts=new Map,this._history=[],this._lastTriggerTime=new Map,this._entityStates=new Map,this._container=null,this._callbacks=new Set}set hass(e){let t=this._providers.getHass();this._providers.setHass(e),this._checkAlerts(t)}register(e,t){let i={id:e,entity_id:t.entity_id,condition:t.condition||$.ABOVE,value:t.value,value_min:t.value_min,value_max:t.value_max,type:t.type||D.WARNING,message:t.message,actions:t.actions||[F.BADGE],service:t.service,service_data:t.service_data,enabled:t.enabled!==!1,triggered:!1};this._alerts.set(e,i);let r=this._providers.entities.getState(i.entity_id);return r&&this._entityStates.set(i.entity_id,r.state),e}unregister(e){this._alerts.delete(e),this._lastTriggerTime.delete(e)}setEnabled(e,t){let i=this._alerts.get(e);i&&(i.enabled=t,t||(i.triggered=!1))}_checkAlerts(e){if(this._providers.getHass())for(let[t,i]of this._alerts){if(!i.enabled)continue;let r=i.entity_id,n=this._providers.entities.getState(r),s=e?.states?.[r];if(!n)continue;let o=this._evaluateCondition(i,n,s);o&&!i.triggered?this._triggerAlert(i,n):!o&&i.triggered&&this._clearAlert(i)}}_evaluateCondition(e,t,i){let r=t.state,n=parseFloat(r),{condition:s,value:o,value_min:c,value_max:l}=e;switch(s){case $.ABOVE:return!isNaN(n)&&n>o;case $.BELOW:return!isNaN(n)&&n<o;case $.EQUALS:return r===String(o)||n===o;case $.NOT_EQUALS:return r!==String(o)&&n!==o;case $.BETWEEN:return!isNaN(n)&&n>=c&&n<=l;case $.OUTSIDE:return!isNaN(n)&&(n<c||n>l);case $.CHANGED:return i&&i.state!==r;case $.UNAVAILABLE:return r==="unavailable"||r==="unknown";default:return!1}}_triggerAlert(e,t){let i=this._lastTriggerTime.get(e.id),r=Date.now();if(!(i&&r-i<this._config.debounce_time)){e.triggered=!0,this._lastTriggerTime.set(e.id,r),this._addToHistory(e,t);for(let n of e.actions)this._executeAction(n,e,t);this._notifyCallbacks("triggered",e,t)}}_clearAlert(e){e.triggered=!1,this._notifyCallbacks("cleared",e)}_executeAction(e,t,i){switch(e){case F.NOTIFICATION:this._showNotification(t,i);break;case F.SOUND:this._playSound(t.type);break;case F.SERVICE:this._callService(t);break;default:break}}_showNotification(e,t){let i=this._formatMessage(e.message,t);this._container||(this._container=document.createElement("div"),this._container.className="uc-alerts-container",document.body.appendChild(this._container));let r=document.createElement("div");r.className=`uc-alert-notification uc-alert-${e.type}`,r.innerHTML=`
      <div class="uc-alert-icon">${this._getIcon(e.type)}</div>
      <div class="uc-alert-content">
        <div class="uc-alert-title">${t.attributes?.friendly_name||e.entity_id}</div>
        <div class="uc-alert-message">${i}</div>
      </div>
      <button class="uc-alert-close">\xD7</button>
    `,r.querySelector(".uc-alert-close").addEventListener("click",()=>{r.classList.add("uc-alert-hiding"),setTimeout(()=>r.remove(),300)}),this._container.appendChild(r),this._config.auto_dismiss>0&&setTimeout(()=>{r.parentNode&&(r.classList.add("uc-alert-hiding"),setTimeout(()=>r.remove(),300))},this._config.auto_dismiss)}_playSound(e){let t=this._config.sounds?.[e];if(t){let i=new Audio(t);i.volume=.5,i.play().catch(()=>{})}}_callService(e){if(!e.service)return;let[t,i]=e.service.split(".");t&&i&&this._providers.services.call(t,i,e.service_data||{})}_formatMessage(e,t){return e?e.replace(/\{state\}/g,t.state).replace(/\{entity_id\}/g,t.entity_id).replace(/\{friendly_name\}/g,t.attributes?.friendly_name||t.entity_id).replace(/\{unit\}/g,t.attributes?.unit_of_measurement||"").replace(/\{(\w+)\}/g,(i,r)=>t.attributes?.[r]||i):`\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435: ${t.state}`}_getIcon(e){return{[D.INFO]:"\u{1F4A1}",[D.WARNING]:"\u26A0\uFE0F",[D.ERROR]:"\u274C",[D.SUCCESS]:"\u2705",[D.CRITICAL]:"\u{1F6A8}"}[e]||"\u{1F4E2}"}_addToHistory(e,t){this._history.unshift({id:e.id,type:e.type,entity_id:e.entity_id,state:t.state,message:this._formatMessage(e.message,t),timestamp:new Date}),this._history.length>this._config.history_size&&this._history.pop()}getHistory(){return[...this._history]}getActiveAlerts(){return Array.from(this._alerts.values()).filter(e=>e.triggered)}subscribe(e){return this._callbacks.add(e),()=>this._callbacks.delete(e)}_notifyCallbacks(e,t,i=null){for(let r of this._callbacks)try{r(e,t,i)}catch(n){console.error("[Alerts] Callback error:",n)}}getClassesForEntity(e){let t=[];for(let i of this._alerts.values())if(i.entity_id===e&&i.triggered){t.push("uc-alert-active"),t.push(`uc-alert-type-${i.type}`);for(let r of i.actions)[F.BORDER,F.PULSE,F.SHAKE].includes(r)&&t.push(`uc-alert-${r}`)}return t}clearAll(){for(let e of this._alerts.values())e.triggered=!1;this._history=[]}destroy(){this._alerts.clear(),this._history=[],this._lastTriggerTime.clear(),this._entityStates.clear(),this._callbacks.clear(),this._container&&(this._container.remove(),this._container=null)}static getStyles(){return`
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
    `}};var _={TOGGLE:"toggle",TURN_ON:"turn_on",TURN_OFF:"turn_off",SERVICE:"service",MORE_INFO:"more-info",NAVIGATE:"navigate",URL:"url",FIRE_EVENT:"fire-event",SCRIPT:"script",SCENE:"scene"},at={[_.TOGGLE]:"mdi:toggle-switch",[_.TURN_ON]:"mdi:power",[_.TURN_OFF]:"mdi:power-off",[_.SERVICE]:"mdi:cog",[_.MORE_INFO]:"mdi:information",[_.NAVIGATE]:"mdi:arrow-right",[_.URL]:"mdi:open-in-new",[_.FIRE_EVENT]:"mdi:broadcast",[_.SCRIPT]:"mdi:script-text",[_.SCENE]:"mdi:palette"},se=class{constructor(e,t={}){this._providers=v(e),this._config=t,this._actions=[],this._element=null,this._confirmDialog=null}set hass(e){this._providers.setHass(e),this._updateStates()}setActions(e){this._actions=e.map((t,i)=>({id:t.id||`action_${i}`,type:t.type||_.SERVICE,name:t.name,icon:t.icon||at[t.type]||"mdi:gesture-tap",entity_id:t.entity_id,service:t.service,service_data:t.service_data,target:t.target,navigation_path:t.navigation_path,url:t.url,url_new_tab:t.url_new_tab!==!1,event:t.event,event_data:t.event_data,confirmation:t.confirmation,show_state:t.show_state,disabled_when:t.disabled_when,hidden_when:t.hidden_when,color:t.color,active_color:t.active_color||"var(--primary-color)"}))}render(){this._element=document.createElement("div"),this._element.className="uc-quick-actions";for(let e of this._actions){let t=this._createActionButton(e);t&&this._element.appendChild(t)}return this._element}_createActionButton(e){if(this._evaluateCondition(e.hidden_when))return null;let t=document.createElement("button");t.className="uc-quick-action",t.dataset.actionId=e.id,this._evaluateCondition(e.disabled_when)&&(t.disabled=!0,t.classList.add("disabled"));let r=this._isActionActive(e);r&&t.classList.add("active");let n=document.createElement("ha-icon");if(n.setAttribute("icon",e.icon),t.appendChild(n),e.name){let s=document.createElement("span");s.className="uc-action-name",s.textContent=e.name,t.appendChild(s)}if(e.show_state&&e.entity_id){let s=document.createElement("span");s.className="uc-action-state",s.textContent=this._getEntityState(e.entity_id),t.appendChild(s)}return e.color&&t.style.setProperty("--action-color",e.color),r&&e.active_color&&t.style.setProperty("--action-color",e.active_color),t.addEventListener("click",s=>{s.stopPropagation(),this._executeAction(e)}),e.name&&(t.title=e.name),t}async _executeAction(e){if(!(e.confirmation&&!await this._showConfirmation(e.confirmation))){switch(e.type){case _.TOGGLE:this._executeToggle(e);break;case _.TURN_ON:this._executeTurnOn(e);break;case _.TURN_OFF:this._executeTurnOff(e);break;case _.SERVICE:this._executeService(e);break;case _.MORE_INFO:this._executeMoreInfo(e);break;case _.NAVIGATE:this._executeNavigate(e);break;case _.URL:this._executeUrl(e);break;case _.FIRE_EVENT:this._executeFireEvent(e);break;case _.SCRIPT:this._executeScript(e);break;case _.SCENE:this._executeScene(e);break}this._animateButton(e.id)}}_executeToggle(e){if(!e.entity_id)return;let t=e.entity_id.split(".")[0],i="toggle";["script","scene"].includes(t)&&(i="turn_on"),this._providers.services.call(t,i,{entity_id:e.entity_id})}_executeTurnOn(e){if(!e.entity_id)return;let t=e.entity_id.split(".")[0];this._providers.services.call(t,"turn_on",{entity_id:e.entity_id,...e.service_data})}_executeTurnOff(e){if(!e.entity_id)return;let t=e.entity_id.split(".")[0];this._providers.services.call(t,"turn_off",{entity_id:e.entity_id})}_executeService(e){if(!e.service)return;let[t,i]=e.service.split(".");if(!t||!i)return;let r={...e.service_data};e.target?this._providers.services.call(t,i,r,e.target):e.entity_id?(r.entity_id=e.entity_id,this._providers.services.call(t,i,r)):this._providers.services.call(t,i,r)}_executeMoreInfo(e){e.entity_id&&O(window,"hass-more-info",{entityId:e.entity_id})}_executeNavigate(e){e.navigation_path&&(history.pushState(null,"",e.navigation_path),O(window,"location-changed"))}_executeUrl(e){e.url&&(e.url_new_tab?window.open(e.url,"_blank"):window.location.href=e.url)}_executeFireEvent(e){e.event&&this._providers.api.call("POST","events/"+e.event,e.event_data||{})}_executeScript(e){e.entity_id&&this._providers.services.call("script","turn_on",{entity_id:e.entity_id,...e.service_data})}_executeScene(e){e.entity_id&&this._providers.services.call("scene","turn_on",{entity_id:e.entity_id})}async _showConfirmation(e){let t=typeof e=="string"?e:e.text||"\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B?";return new Promise(i=>{let r=document.createElement("div");r.className="uc-confirm-dialog",r.innerHTML=`
        <div class="uc-confirm-backdrop"></div>
        <div class="uc-confirm-content">
          <div class="uc-confirm-message">${t}</div>
          <div class="uc-confirm-buttons">
            <button class="uc-confirm-cancel">\u041E\u0442\u043C\u0435\u043D\u0430</button>
            <button class="uc-confirm-ok">OK</button>
          </div>
        </div>
      `,r.querySelector(".uc-confirm-backdrop").addEventListener("click",()=>{r.remove(),i(!1)}),r.querySelector(".uc-confirm-cancel").addEventListener("click",()=>{r.remove(),i(!1)}),r.querySelector(".uc-confirm-ok").addEventListener("click",()=>{r.remove(),i(!0)}),document.body.appendChild(r),setTimeout(()=>{r.querySelector(".uc-confirm-ok")?.focus()},10)})}_isActionActive(e){if(!e.entity_id)return!1;let t=this._providers.entities.getState(e.entity_id);return t?["on","playing","home","open","unlocked"].includes(t.state):!1}_evaluateCondition(e){if(!e)return!1;if(typeof e=="string")return this._providers.entities.getState(e)?.state==="on";if(e.entity_id){let t=this._providers.entities.getState(e.entity_id);if(!t)return!1;if(e.state!==void 0)return t.state===String(e.state);if(e.state_not!==void 0)return t.state!==String(e.state_not);let i=parseFloat(t.state);if(e.above!==void 0)return i>e.above;if(e.below!==void 0)return i<e.below}return!1}_getEntityState(e){let t=this._providers.entities.getState(e);if(!t)return"-";let i=t.attributes?.unit_of_measurement;return i?`${t.state} ${i}`:t.state}_animateButton(e){if(!this._element)return;let t=this._element.querySelector(`[data-action-id="${e}"]`);t&&(t.classList.add("uc-action-clicked"),setTimeout(()=>{t.classList.remove("uc-action-clicked")},300))}_updateStates(){if(this._element)for(let e of this._actions){let t=this._element.querySelector(`[data-action-id="${e.id}"]`);if(!t)continue;let i=this._isActionActive(e);if(t.classList.toggle("active",i),e.show_state&&e.entity_id){let s=t.querySelector(".uc-action-state");s&&(s.textContent=this._getEntityState(e.entity_id))}let r=this._evaluateCondition(e.disabled_when),n=t;n.disabled=r,n.classList.toggle("disabled",r)}}destroy(){this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
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
    `}};var w={COUNTDOWN:"countdown",COUNTUP:"countup",TIMER:"timer",ENTITY:"entity",REMAINING:"remaining"},j={FULL:"full",COMPACT:"compact",HUMAN:"human",DIGITAL:"digital"},ze={mode:w.COUNTDOWN,format:j.DIGITAL,show_icon:!0,show_label:!1,warning_threshold:60,danger_threshold:10,end_action:null,sound_on_end:!1,hide_when_inactive:!1},oe=class{constructor(e,t={}){this._providers=v(e),this._config={...ze,...t},this._element=null,this._intervalId=null,this._targetTime=null,this._startTime=null,this._isRunning=!1,this._isPaused=!1,this._remainingOnPause=0}set hass(e){this._providers.setHass(e),this._updateFromEntity()}setConfig(e){switch(this._config={...ze,...e},this._config.mode){case w.COUNTDOWN:this._config.target_time?this.setTargetTime(new Date(this._config.target_time)):this._config.duration&&this.setDuration(this._config.duration);break;case w.COUNTUP:this._config.start_time?this._startTime=new Date(this._config.start_time):this._startTime=new Date;break}}render(){return this._element=document.createElement("div"),this._element.className="uc-timer",this._element.innerHTML=`
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
    `}_bindControlEvents(){let e=this._element.querySelector(".uc-timer-start"),t=this._element.querySelector(".uc-timer-pause"),i=this._element.querySelector(".uc-timer-reset");e&&e.addEventListener("click",r=>{r.stopPropagation(),this.start()}),t&&t.addEventListener("click",r=>{r.stopPropagation(),this.pause()}),i&&i.addEventListener("click",r=>{r.stopPropagation(),this.reset()})}setTargetTime(e){this._targetTime=e,this._updateDisplay()}setDuration(e){let t;if(typeof e=="string"){let i=e.split(":").map(Number);i.length===3?t=i[0]*3600+i[1]*60+i[2]:i.length===2?t=i[0]*60+i[1]:t=parseInt(e,10)}else t=e;this._targetTime=new Date(Date.now()+t*1e3),this._config.initial_duration=t}start(){if(!this._isRunning){if(this._isPaused&&this._remainingOnPause>0&&(this._targetTime=new Date(Date.now()+this._remainingOnPause*1e3),this._isPaused=!1,this._remainingOnPause=0),this._config.mode===w.TIMER&&this._config.entity_id){this._providers.services.call("timer","start",{entity_id:this._config.entity_id});return}this._isRunning=!0,this._startTicking(),this._updateControlsState()}}pause(){if(this._isRunning){if(this._config.mode===w.TIMER&&this._config.entity_id){this._providers.services.call("timer","pause",{entity_id:this._config.entity_id});return}this._isRunning=!1,this._isPaused=!0,this._remainingOnPause=this._getRemaining(),this._stopTicking(),this._updateControlsState()}}reset(){if(this._config.mode===w.TIMER&&this._config.entity_id){this._providers.services.call("timer","cancel",{entity_id:this._config.entity_id});return}this._isRunning=!1,this._isPaused=!1,this._remainingOnPause=0,this._config.initial_duration&&this.setDuration(this._config.initial_duration),this._stopTicking(),this._updateDisplay(),this._updateControlsState()}_startTicking(){this._stopTicking(),this._intervalId=setInterval(()=>{this._tick()},1e3)}_stopTicking(){this._intervalId&&(clearInterval(this._intervalId),this._intervalId=null)}_tick(){let e=this._getRemaining();this._updateDisplay(),this._config.mode===w.COUNTDOWN&&e<=0&&this._onTimerEnd()}_onTimerEnd(){this._isRunning=!1,this._stopTicking(),this._config.sound_on_end&&this._playEndSound(),this._config.end_action&&this._executeEndAction(),O(this._element,"timer-end",{config:this._config}),this._element.classList.add("uc-timer-ended"),this._updateControlsState()}_playEndSound(){let e=this._config.end_sound||"/local/sounds/timer-end.mp3",t=new Audio(e);t.volume=.5,t.play().catch(()=>{})}_executeEndAction(){let e=this._config.end_action;if(e.service){let[t,i]=e.service.split(".");t&&i&&this._providers.services.call(t,i,e.service_data||{})}}_getRemaining(){switch(this._config.mode){case w.COUNTDOWN:return this._targetTime?Math.max(0,Math.floor((this._targetTime.getTime()-Date.now())/1e3)):0;case w.COUNTUP:return this._startTime?Math.floor((Date.now()-this._startTime.getTime())/1e3):0;case w.TIMER:case w.ENTITY:case w.REMAINING:return this._getRemainingFromEntity();default:return 0}}_getRemainingFromEntity(){let e=this._config.entity_id,t=this._providers.entities.getState(e);if(!e||!t)return 0;if(e.startsWith("timer.")){if(t.state!=="active")return 0;let r=new Date(t.attributes.finishes_at);return Math.max(0,Math.floor((r.getTime()-Date.now())/1e3))}if(t.attributes?.remaining)return this._parseTimeString(t.attributes.remaining);if(t.attributes?.end_time){let r=new Date(t.attributes.end_time);return Math.max(0,Math.floor((r.getTime()-Date.now())/1e3))}let i=parseFloat(t.state);return isNaN(i)?0:Math.floor(i)}_parseTimeString(e){let t=e.split(":").map(Number);return t.length===3?t[0]*3600+t[1]*60+t[2]:t.length===2?t[0]*60+t[1]:parseInt(e,10)||0}_updateFromEntity(){if(!this._config.entity_id)return;let e=this._config.entity_id,t=this._providers.entities.getState(e);if(t){if(e.startsWith("timer.")){let i=t.state==="active",r=t.state==="paused";i&&!this._isRunning?(this._isRunning=!0,this._startTicking()):!i&&this._isRunning&&(this._isRunning=!1,this._stopTicking()),this._isPaused=r}this._updateDisplay(),this._updateControlsState()}}_updateDisplay(){if(!this._element)return;let e=this._getRemaining(),t=this._element.querySelector(".uc-timer-value");if(t&&(t.textContent=this._formatTime(e),this._element.classList.remove("uc-timer-warning","uc-timer-danger"),this._config.mode===w.COUNTDOWN&&(e<=this._config.danger_threshold&&e>0?this._element.classList.add("uc-timer-danger"):e<=this._config.warning_threshold&&this._element.classList.add("uc-timer-warning")),this._config.hide_when_inactive)){let i=!this._isRunning&&e===0;this._element.classList.toggle("uc-timer-hidden",i)}}_formatTime(e){let t=e<0;e=Math.abs(e);let i=Math.floor(e/86400),r=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),s=e%60,o=t?"-":"";switch(this._config.format){case j.FULL:let c=[];return i>0&&c.push(`${i}\u0434`),r>0&&c.push(`${r}\u0447`),n>0&&c.push(`${n}\u043C`),c.push(`${s}\u0441`),o+c.join(" ");case j.COMPACT:return i>0?`${o}${i}:${this._pad(r)}:${this._pad(n)}:${this._pad(s)}`:r>0?`${o}${r}:${this._pad(n)}:${this._pad(s)}`:`${o}${n}:${this._pad(s)}`;case j.HUMAN:return o+this._humanize(i,r,n,s);case j.DIGITAL:default:return i>0?`${o}${i}\u0434 ${this._pad(r)}:${this._pad(n)}:${this._pad(s)}`:r>0?`${o}${this._pad(r)}:${this._pad(n)}:${this._pad(s)}`:`${o}${this._pad(n)}:${this._pad(s)}`}}_pad(e){return String(e).padStart(2,"0")}_humanize(e,t,i,r){return e>0?`\u0447\u0435\u0440\u0435\u0437 ${e} ${this._pluralize(e,"\u0434\u0435\u043D\u044C","\u0434\u043D\u044F","\u0434\u043D\u0435\u0439")}`:t>0?`\u0447\u0435\u0440\u0435\u0437 ${t} ${this._pluralize(t,"\u0447\u0430\u0441","\u0447\u0430\u0441\u0430","\u0447\u0430\u0441\u043E\u0432")}`:i>0?`\u0447\u0435\u0440\u0435\u0437 ${i} ${this._pluralize(i,"\u043C\u0438\u043D\u0443\u0442\u0443","\u043C\u0438\u043D\u0443\u0442\u044B","\u043C\u0438\u043D\u0443\u0442")}`:`\u0447\u0435\u0440\u0435\u0437 ${r} ${this._pluralize(r,"\u0441\u0435\u043A\u0443\u043D\u0434\u0443","\u0441\u0435\u043A\u0443\u043D\u0434\u044B","\u0441\u0435\u043A\u0443\u043D\u0434")}`}_pluralize(e,t,i,r){let n=e%10,s=e%100;return s>=11&&s<=19?r:n===1?t:n>=2&&n<=4?i:r}_updateControlsState(){if(!this._element||!this._config.show_controls)return;let e=this._element.querySelector(".uc-timer-start"),t=this._element.querySelector(".uc-timer-pause");e&&(e.style.display=this._isRunning?"none":""),t&&(t.style.display=this._isRunning?"":"none")}destroy(){this._stopTicking(),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
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
    `}};var q={light:{on:{icon:"mdi:lightbulb",color:"var(--warning-color, #ffc107)"},off:{icon:"mdi:lightbulb-off",color:"var(--secondary-text-color)"},unavailable:{icon:"mdi:lightbulb-question",color:"var(--disabled-color)"}},switch:{on:{icon:"mdi:toggle-switch",color:"var(--primary-color)"},off:{icon:"mdi:toggle-switch-off",color:"var(--secondary-text-color)"}},lock:{locked:{icon:"mdi:lock",color:"var(--success-color, #4caf50)"},unlocked:{icon:"mdi:lock-open",color:"var(--warning-color, #ff9800)"},locking:{icon:"mdi:lock-clock",color:"var(--info-color)"},unlocking:{icon:"mdi:lock-clock",color:"var(--info-color)"}},binary_sensor_door:{on:{icon:"mdi:door-open",color:"var(--warning-color, #ff9800)"},off:{icon:"mdi:door-closed",color:"var(--success-color, #4caf50)"}},binary_sensor_window:{on:{icon:"mdi:window-open",color:"var(--warning-color, #ff9800)"},off:{icon:"mdi:window-closed",color:"var(--success-color, #4caf50)"}},binary_sensor_motion:{on:{icon:"mdi:motion-sensor",color:"var(--primary-color)"},off:{icon:"mdi:motion-sensor-off",color:"var(--secondary-text-color)"}},binary_sensor_occupancy:{on:{icon:"mdi:home-account",color:"var(--primary-color)"},off:{icon:"mdi:home-outline",color:"var(--secondary-text-color)"}},battery:{high:{icon:"mdi:battery-high",color:"var(--success-color, #4caf50)"},medium:{icon:"mdi:battery-medium",color:"var(--warning-color, #ff9800)"},low:{icon:"mdi:battery-low",color:"var(--error-color, #f44336)"},charging:{icon:"mdi:battery-charging",color:"var(--info-color)"}},climate:{heat:{icon:"mdi:fire",color:"#ff5722"},cool:{icon:"mdi:snowflake",color:"#2196f3"},heat_cool:{icon:"mdi:sun-snowflake",color:"var(--primary-color)"},auto:{icon:"mdi:thermostat-auto",color:"var(--success-color)"},dry:{icon:"mdi:water-percent",color:"#795548"},fan_only:{icon:"mdi:fan",color:"#00bcd4"},off:{icon:"mdi:power",color:"var(--secondary-text-color)"}},media_player:{playing:{icon:"mdi:play-circle",color:"var(--primary-color)"},paused:{icon:"mdi:pause-circle",color:"var(--warning-color)"},idle:{icon:"mdi:stop-circle",color:"var(--secondary-text-color)"},off:{icon:"mdi:power",color:"var(--secondary-text-color)"}},weather:{"clear-night":{icon:"mdi:weather-night",color:"#1a237e"},cloudy:{icon:"mdi:weather-cloudy",color:"#78909c"},fog:{icon:"mdi:weather-fog",color:"#90a4ae"},hail:{icon:"mdi:weather-hail",color:"#b0bec5"},lightning:{icon:"mdi:weather-lightning",color:"#ffc107"},"lightning-rainy":{icon:"mdi:weather-lightning-rainy",color:"#ff9800"},partlycloudy:{icon:"mdi:weather-partly-cloudy",color:"#8bc34a"},pouring:{icon:"mdi:weather-pouring",color:"#2196f3"},rainy:{icon:"mdi:weather-rainy",color:"#03a9f4"},snowy:{icon:"mdi:weather-snowy",color:"#e0e0e0"},"snowy-rainy":{icon:"mdi:weather-snowy-rainy",color:"#b3e5fc"},sunny:{icon:"mdi:weather-sunny",color:"#ffeb3b"},windy:{icon:"mdi:weather-windy",color:"#26a69a"},"windy-variant":{icon:"mdi:weather-windy-variant",color:"#4db6ac"}},person:{home:{icon:"mdi:home-account",color:"var(--success-color, #4caf50)"},not_home:{icon:"mdi:account-arrow-right",color:"var(--secondary-text-color)"},unknown:{icon:"mdi:account-question",color:"var(--warning-color)"}},vacuum:{cleaning:{icon:"mdi:robot-vacuum",color:"var(--primary-color)"},docked:{icon:"mdi:robot-vacuum",color:"var(--success-color)"},returning:{icon:"mdi:robot-vacuum",color:"var(--info-color)"},paused:{icon:"mdi:robot-vacuum",color:"var(--warning-color)"},idle:{icon:"mdi:robot-vacuum",color:"var(--secondary-text-color)"},error:{icon:"mdi:robot-vacuum-alert",color:"var(--error-color)"}}},ae=class{constructor(e,t={}){this._providers=v(e),this._config=t,this._customMappings=new Map}set hass(e){this._providers.setHass(e)}register(e,t){this._customMappings.set(e,t)}unregister(e){this._customMappings.delete(e)}getIconAndColor(e,t={}){let i=this._providers.entities.getState(e);if(!e||!i)return{icon:t.default_icon||"mdi:help-circle",color:null};let r=i.state,n=e.split(".")[0],s=i.attributes?.device_class,o=this._customMappings.get(e);if(o||(o=this._customMappings.get(`${n}.*`)),o||(n==="binary_sensor"&&s&&(o=q[`binary_sensor_${s}`]),o||(o=q[n])),!o)return this._getDefaultIcon(i,t);let c=o[r];if(!c&&o._ranges){let l=parseFloat(r);isNaN(l)||(c=this._findInRanges(o._ranges,l))}return!c&&n==="sensor"&&s==="battery"&&(c=this._getBatteryIcon(r)),c||(c=o.default||o.unknown),c?{icon:c.icon||t.default_icon||i.attributes?.icon,color:c.color||null}:this._getDefaultIcon(i,t)}_findInRanges(e,t){for(let i of e){let{min:r=-1/0,max:n=1/0,...s}=i;if(t>=r&&t<=n)return s}return null}_getBatteryIcon(e){let t=parseInt(e,10);return isNaN(t)?q.battery.unavailable||{icon:"mdi:battery-unknown",color:"var(--secondary-text-color)"}:t<=10?{icon:"mdi:battery-10",color:"var(--error-color, #f44336)"}:t<=20?{icon:"mdi:battery-20",color:"var(--error-color, #f44336)"}:t<=30?{icon:"mdi:battery-30",color:"var(--warning-color, #ff9800)"}:t<=40?{icon:"mdi:battery-40",color:"var(--warning-color, #ff9800)"}:t<=50?{icon:"mdi:battery-50",color:"var(--warning-color, #ff9800)"}:t<=60?{icon:"mdi:battery-60",color:"var(--success-color, #4caf50)"}:t<=70?{icon:"mdi:battery-70",color:"var(--success-color, #4caf50)"}:t<=80?{icon:"mdi:battery-80",color:"var(--success-color, #4caf50)"}:t<=90?{icon:"mdi:battery-90",color:"var(--success-color, #4caf50)"}:{icon:"mdi:battery",color:"var(--success-color, #4caf50)"}}_getDefaultIcon(e,t){let i=t.default_icon||e.attributes?.icon||this._getDomainIcon(e.entity_id),r=e.state==="on"||e.state==="home"?"var(--primary-color)":null;return{icon:i,color:r}}_getDomainIcon(e){let t=e.split(".")[0];return{automation:"mdi:robot",binary_sensor:"mdi:checkbox-marked-circle",button:"mdi:gesture-tap-button",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",cover:"mdi:window-shutter",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",input_boolean:"mdi:toggle-switch",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",lock:"mdi:lock",media_player:"mdi:cast",person:"mdi:account",scene:"mdi:palette",script:"mdi:script-text",sensor:"mdi:eye",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",vacuum:"mdi:robot-vacuum",weather:"mdi:weather-cloudy",zone:"mdi:map-marker"}[t]||"mdi:bookmark"}static createMappingFromConfig(e){let t={};for(let i of e)i.state!==void 0&&(t[i.state]={icon:i.icon,color:i.color}),(i.above!==void 0||i.below!==void 0)&&(t._ranges||(t._ranges=[]),t._ranges.push({min:i.above!=null?i.above:-1/0,max:i.below!=null?i.below:1/0,icon:i.icon,color:i.color}));return t}renderIcon(e,t={}){let{icon:i,color:r}=this.getIconAndColor(e,t),n=document.createElement("ha-icon");return n.setAttribute("icon",i),r&&(n.style.color=r),t.size&&n.style.setProperty("--mdc-icon-size",typeof t.size=="number"?`${t.size}px`:t.size),n}static getAvailablePresets(){return Object.keys(q)}static getStyles(){return`
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
    `}};var p={ENTRANCE:"entrance",EXIT:"exit",ATTENTION:"attention",STATE:"state",LOADING:"loading",CONTINUOUS:"continuous"},H={fadeIn:{category:p.ENTRANCE,keyframes:`
      @keyframes uc-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,animation:"uc-fadeIn 0.3s ease-out forwards",description:"\u041F\u043B\u0430\u0432\u043D\u043E\u0435 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435"},fadeInUp:{category:p.ENTRANCE,keyframes:`
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
    `,animation:"uc-fadeInUp 0.4s ease-out forwards",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043D\u0438\u0437\u0443"},fadeInDown:{category:p.ENTRANCE,keyframes:`
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
    `,animation:"uc-fadeInDown 0.4s ease-out forwards",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0432\u0435\u0440\u0445\u0443"},fadeInLeft:{category:p.ENTRANCE,keyframes:`
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
    `,animation:"uc-fadeInLeft 0.4s ease-out forwards",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043B\u0435\u0432\u0430"},fadeInRight:{category:p.ENTRANCE,keyframes:`
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
    `,animation:"uc-fadeInRight 0.4s ease-out forwards",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043F\u0440\u0430\u0432\u0430"},scaleIn:{category:p.ENTRANCE,keyframes:`
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
    `,animation:"uc-scaleIn 0.3s ease-out forwards",description:"\u041C\u0430\u0441\u0448\u0442\u0430\u0431\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0438 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0438"},slideInUp:{category:p.ENTRANCE,keyframes:`
      @keyframes uc-slideInUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
    `,animation:"uc-slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",description:"\u0412\u044B\u0435\u0437\u0434 \u0441\u043D\u0438\u0437\u0443"},bounceIn:{category:p.ENTRANCE,keyframes:`
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
    `,animation:"uc-bounceIn 0.6s ease-out forwards",description:"\u041F\u0440\u0443\u0436\u0438\u043D\u044F\u0449\u0435\u0435 \u043F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435"},flipInX:{category:p.ENTRANCE,keyframes:`
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
    `,animation:"uc-flipInX 0.5s ease-out forwards",description:"3D \u043F\u0435\u0440\u0435\u0432\u043E\u0440\u043E\u0442 \u043F\u043E X"},fadeOut:{category:p.EXIT,keyframes:`
      @keyframes uc-fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,animation:"uc-fadeOut 0.3s ease-out forwards",description:"\u041F\u043B\u0430\u0432\u043D\u043E\u0435 \u0438\u0441\u0447\u0435\u0437\u043D\u043E\u0432\u0435\u043D\u0438\u0435"},fadeOutDown:{category:p.EXIT,keyframes:`
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
    `,animation:"uc-fadeOutDown 0.3s ease-out forwards",description:"\u0418\u0441\u0447\u0435\u0437\u043D\u043E\u0432\u0435\u043D\u0438\u0435 \u0432\u043D\u0438\u0437"},scaleOut:{category:p.EXIT,keyframes:`
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
    `,animation:"uc-scaleOut 0.3s ease-out forwards",description:"\u0423\u043C\u0435\u043D\u044C\u0448\u0435\u043D\u0438\u0435 \u043F\u0440\u0438 \u0438\u0441\u0447\u0435\u0437\u043D\u043E\u0432\u0435\u043D\u0438\u0438"},pulse:{category:p.ATTENTION,keyframes:`
      @keyframes uc-pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
    `,animation:"uc-pulse 1s ease-in-out infinite",description:"\u041F\u0443\u043B\u044C\u0441\u0430\u0446\u0438\u044F"},shake:{category:p.ATTENTION,keyframes:`
      @keyframes uc-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `,animation:"uc-shake 0.5s ease-in-out",description:"\u0422\u0440\u044F\u0441\u043A\u0430"},wobble:{category:p.ATTENTION,keyframes:`
      @keyframes uc-wobble {
        0%, 100% { transform: rotate(0deg); }
        15% { transform: rotate(-5deg); }
        30% { transform: rotate(3deg); }
        45% { transform: rotate(-3deg); }
        60% { transform: rotate(2deg); }
        75% { transform: rotate(-1deg); }
      }
    `,animation:"uc-wobble 0.8s ease-in-out",description:"\u041F\u043E\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435"},jello:{category:p.ATTENTION,keyframes:`
      @keyframes uc-jello {
        0%, 100% { transform: skewX(0deg) skewY(0deg); }
        11.1% { transform: skewX(-6.25deg) skewY(-6.25deg); }
        22.2% { transform: skewX(3.125deg) skewY(3.125deg); }
        33.3% { transform: skewX(-1.5625deg) skewY(-1.5625deg); }
        44.4% { transform: skewX(0.78125deg) skewY(0.78125deg); }
        55.5% { transform: skewX(-0.390625deg) skewY(-0.390625deg); }
      }
    `,animation:"uc-jello 0.9s both",description:"\u0416\u0435\u043B\u0435"},heartbeat:{category:p.ATTENTION,keyframes:`
      @keyframes uc-heartbeat {
        0%, 40%, 80%, 100% { transform: scale(1); }
        20%, 60% { transform: scale(1.15); }
      }
    `,animation:"uc-heartbeat 1.3s ease-in-out infinite",description:"\u0421\u0435\u0440\u0434\u0446\u0435\u0431\u0438\u0435\u043D\u0438\u0435"},flash:{category:p.ATTENTION,keyframes:`
      @keyframes uc-flash {
        0%, 50%, 100% { opacity: 1; }
        25%, 75% { opacity: 0; }
      }
    `,animation:"uc-flash 1s ease infinite",description:"\u041C\u0438\u0433\u0430\u043D\u0438\u0435"},rubberBand:{category:p.ATTENTION,keyframes:`
      @keyframes uc-rubberBand {
        0%, 100% { transform: scaleX(1); }
        30% { transform: scaleX(1.25) scaleY(0.75); }
        40% { transform: scaleX(0.75) scaleY(1.25); }
        50% { transform: scaleX(1.15) scaleY(0.85); }
        65% { transform: scaleX(0.95) scaleY(1.05); }
        75% { transform: scaleX(1.05) scaleY(0.95); }
      }
    `,animation:"uc-rubberBand 1s ease",description:"\u0420\u0435\u0437\u0438\u043D\u043A\u0430"},stateChange:{category:p.STATE,keyframes:`
      @keyframes uc-stateChange {
        0% { transform: scale(1); }
        30% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `,animation:"uc-stateChange 0.3s ease-out",description:"\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F"},colorPulse:{category:p.STATE,keyframes:`
      @keyframes uc-colorPulse {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3); }
      }
    `,animation:"uc-colorPulse 0.5s ease",description:"\u041F\u0443\u043B\u044C\u0441\u0430\u0446\u0438\u044F \u0446\u0432\u0435\u0442\u0430"},ripple:{category:p.STATE,keyframes:`
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
    `,animation:"uc-ripple 0.6s linear",description:"\u0412\u043E\u043B\u043D\u0430 (ripple effect)"},spin:{category:p.LOADING,keyframes:`
      @keyframes uc-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,animation:"uc-spin 1s linear infinite",description:"\u0412\u0440\u0430\u0449\u0435\u043D\u0438\u0435"},bounce:{category:p.LOADING,keyframes:`
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
    `,animation:"uc-bounce 1s infinite",description:"\u041F\u0440\u044B\u0436\u043A\u0438"},shimmer:{category:p.LOADING,keyframes:`
      @keyframes uc-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `,animation:"uc-shimmer 1.5s ease-in-out infinite",description:"\u041C\u0435\u0440\u0446\u0430\u043D\u0438\u0435 (\u0434\u043B\u044F skeleton)"},dots:{category:p.LOADING,keyframes:`
      @keyframes uc-dots {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `,animation:"uc-dots 1.4s ease-in-out infinite both",description:"\u0422\u043E\u0447\u043A\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438"},float:{category:p.CONTINUOUS,keyframes:`
      @keyframes uc-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `,animation:"uc-float 3s ease-in-out infinite",description:"\u041F\u043B\u0430\u0432\u0430\u043D\u0438\u0435"},glow:{category:p.CONTINUOUS,keyframes:`
      @keyframes uc-glow {
        0%, 100% { box-shadow: 0 0 5px currentColor; }
        50% { box-shadow: 0 0 20px currentColor, 0 0 30px currentColor; }
      }
    `,animation:"uc-glow 2s ease-in-out infinite",description:"\u0421\u0432\u0435\u0447\u0435\u043D\u0438\u0435"},wave:{category:p.CONTINUOUS,keyframes:`
      @keyframes uc-wave {
        0%, 100% { transform: rotate(0deg); }
        20%, 60% { transform: rotate(-25deg); }
        40%, 80% { transform: rotate(10deg); }
      }
    `,animation:"uc-wave 2.5s infinite",description:"\u041C\u0430\u0448\u0443\u0449\u0430\u044F \u0440\u0443\u043A\u0430"}},ce=class{constructor(){this._injectedStyles=new Set}getPreset(e){return H[e]||null}getByCategory(e){let t={};for(let[i,r]of Object.entries(H))r.category===e&&(t[i]=r);return t}apply(e,t,i={}){let r=H[t];if(!r){console.warn(`[AnimationPresets] Unknown preset: ${t}`);return}this._injectKeyframes(t,r.keyframes);let n=r.animation;i.duration&&(n=n.replace(/\d+\.?\d*s/,`${i.duration}s`)),i.delay&&(n+=` ${i.delay}s`),i.iterations&&(n=n.replace(/infinite|1/,String(i.iterations))),e.style.animation=n,i.onComplete&&e.addEventListener("animationend",i.onComplete,{once:!0}),i.removeOnComplete!==!1&&e.addEventListener("animationend",()=>{e.style.animation=""},{once:!0})}stagger(e,t,i={}){let r=i.staggerDelay||.05,n=i.startDelay||0;Array.from(e).forEach((s,o)=>{this.apply(s,t,{...i,delay:n+o*r})})}_injectKeyframes(e,t){if(this._injectedStyles.has(e))return;let i=document.createElement("style");i.textContent=t,i.setAttribute("data-uc-animation",e),document.head.appendChild(i),this._injectedStyles.add(e)}static getAllStyles(){let e=[];for(let[t,i]of Object.entries(H))e.push(i.keyframes),e.push(`
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
`)}static getPresetNames(){return Object.keys(H)}static getDescription(e){return H[e]?.description||""}};var z={IMMEDIATE:"immediate",THROTTLED:"throttled",BATCHED:"batched",ON_DEMAND:"on_demand",VISIBLE_ONLY:"visible_only"},R={CRITICAL:0,HIGH:1,NORMAL:2,LOW:3,BACKGROUND:4},ct={strategy:z.THROTTLED,throttleMs:100,batchDelayMs:50,maxBatchSize:50,visibilityThreshold:.1,priorityThrottles:{[R.CRITICAL]:0,[R.HIGH]:50,[R.NORMAL]:100,[R.LOW]:250,[R.BACKGROUND]:500}},ee=class{constructor(){this._config={...ct},this._subscribers=new Map,this._pendingUpdates=new Map,this._batchTimeout=null,this._lastUpdateTime=new Map,this._visibilityObserver=null,this._visibleElements=new WeakSet,this._metrics={totalUpdates:0,throttledUpdates:0,batchedUpdates:0,skippedUpdates:0}}configure(e){this._config={...this._config,...e}}subscribe(e,t,i={}){let r={callback:t,priority:i.priority!=null?i.priority:R.NORMAL,element:i.element,strategy:i.strategy!=null?i.strategy:this._config.strategy};return this._subscribers.has(e)||this._subscribers.set(e,new Set),this._subscribers.get(e).add(r),i.element&&r.strategy===z.VISIBLE_ONLY&&this._observeVisibility(i.element),()=>{this._unsubscribe(e,r)}}_unsubscribe(e,t){let i=this._subscribers.get(e);i&&(i.delete(t),i.size===0&&this._subscribers.delete(e)),t.element&&this._unobserveVisibility(t.element)}processHassUpdate(e,t){if(!t?.states)return;let i=[];for(let r of this._subscribers.keys()){let n=e?.states?.[r],s=t?.states?.[r];this._hasStateChanged(n,s)&&i.push({entityId:r,newState:s})}if(i.length!==0)switch(this._config.strategy){case z.IMMEDIATE:this._processImmediate(i);break;case z.THROTTLED:this._processThrottled(i);break;case z.BATCHED:this._processBatched(i);break;default:this._processThrottled(i)}}_hasStateChanged(e,t){return!e&&t||e&&!t?!0:!e&&!t?!1:e.state!==t.state||e.last_changed!==t.last_changed}_processImmediate(e){for(let{entityId:t,newState:i}of e)this._notifySubscribers(t,i);this._metrics.totalUpdates+=e.length}_processThrottled(e){let t=Date.now();for(let{entityId:i,newState:r}of e){let n=this._subscribers.get(i);if(!n)continue;let s=R.BACKGROUND;for(let l of n)l.priority<s&&(s=l.priority);let o=this._config.priorityThrottles[s]!=null?this._config.priorityThrottles[s]:this._config.throttleMs,c=this._lastUpdateTime.get(i)||0;t-c>=o?(this._notifySubscribers(i,r),this._lastUpdateTime.set(i,t),this._metrics.totalUpdates++):(this._pendingUpdates.set(i,r),this._scheduleDeferredUpdate(i,o-(t-c)),this._metrics.throttledUpdates++)}}_processBatched(e){for(let{entityId:t,newState:i}of e)this._pendingUpdates.set(t,i);this._metrics.batchedUpdates+=e.length,this._batchTimeout||(this._batchTimeout=setTimeout(()=>{this._processBatch()},this._config.batchDelayMs))}_processBatch(){this._batchTimeout=null;let e=Array.from(this._pendingUpdates.entries()).slice(0,this._config.maxBatchSize);requestAnimationFrame(()=>{for(let[t,i]of e)this._notifySubscribers(t,i),this._pendingUpdates.delete(t);this._metrics.totalUpdates+=e.length}),this._pendingUpdates.size>0&&(this._batchTimeout=setTimeout(()=>{this._processBatch()},this._config.batchDelayMs))}_scheduleDeferredUpdate(e,t){setTimeout(()=>{let i=this._pendingUpdates.get(e);i&&(this._notifySubscribers(e,i),this._pendingUpdates.delete(e),this._lastUpdateTime.set(e,Date.now()))},t)}_notifySubscribers(e,t){let i=this._subscribers.get(e);if(i)for(let r of i){if(r.strategy===z.VISIBLE_ONLY&&r.element&&!this._visibleElements.has(r.element)){this._metrics.skippedUpdates++;continue}try{r.callback(t)}catch(n){console.error(`[WebSocketOptimizer] Callback error for ${e}:`,n)}}}_observeVisibility(e){this._visibilityObserver||(this._visibilityObserver=new IntersectionObserver(t=>{for(let i of t)i.isIntersecting?this._visibleElements.add(i.target):this._visibleElements.delete(i.target)},{threshold:this._config.visibilityThreshold})),this._visibilityObserver.observe(e)}_unobserveVisibility(e){this._visibilityObserver&&this._visibilityObserver.unobserve(e),this._visibleElements.delete(e)}forceUpdate(e,t){this._notifySubscribers(e,t),this._lastUpdateTime.set(e,Date.now())}flush(){this._batchTimeout&&(clearTimeout(this._batchTimeout),this._batchTimeout=null);for(let[e,t]of this._pendingUpdates)this._notifySubscribers(e,t);this._pendingUpdates.clear()}getMetrics(){return{...this._metrics,activeSubscriptions:this._subscribers.size,pendingUpdates:this._pendingUpdates.size,efficiency:this._metrics.totalUpdates>0?((this._metrics.totalUpdates-this._metrics.throttledUpdates)/this._metrics.totalUpdates*100).toFixed(1)+"%":"100%"}}resetMetrics(){this._metrics={totalUpdates:0,throttledUpdates:0,batchedUpdates:0,skippedUpdates:0}}destroy(){this.flush(),this._subscribers.clear(),this._lastUpdateTime.clear(),this._visibilityObserver&&(this._visibilityObserver.disconnect(),this._visibilityObserver=null)}},$e=null;function Ue(){return $e||($e=new ee),$e}function Ge(a,e=100){return Ne(a,e)}function Be(a,e=100){return ie(a,e)}var S={STATE_CHANGE:"uc-link-state-change",EXPAND:"uc-link-expand",COLLAPSE:"uc-link-collapse",TOGGLE:"uc-link-toggle",TAB_CHANGE:"uc-link-tab-change",CUSTOM:"uc-link-custom"},K={MIRROR:"mirror",EXPAND_ONLY:"expand_only",COLLAPSE_ONLY:"collapse_only",INVERSE:"inverse",CUSTOM:"custom"},Ie=class{constructor(){this._groups=new Map,this._masters=new Map,this._slaves=new Map,this._listeners=new Map}register(e,t,i={}){let{role:r="slave",syncMode:n=K.MIRROR}=i;this._groups.has(e)||(this._groups.set(e,new Set),this._slaves.set(e,new Set)),this._groups.get(e).add(t),r==="master"?(this._masters.set(e,t),this._setupMasterListeners(e,t)):(this._slaves.get(e).add(t),this._setupSlaveListeners(e,t,n)),t._ucLinkData={groupId:e,role:r,syncMode:n}}unregister(e,t){let i=this._groups.get(e);i&&(i.delete(t),i.size===0&&(this._groups.delete(e),this._masters.delete(e),this._slaves.delete(e))),this._removeListeners(t),delete t._ucLinkData}_setupMasterListeners(e,t){let i=new Map,r=l=>{this._broadcastToSlaves(e,S.STATE_CHANGE,l.detail)},n=()=>{this._broadcastToSlaves(e,S.EXPAND,{})},s=()=>{this._broadcastToSlaves(e,S.COLLAPSE,{})},o=l=>{this._broadcastToSlaves(e,S.TOGGLE,l.detail)},c=l=>{this._broadcastToSlaves(e,S.TAB_CHANGE,l.detail)};t.addEventListener("uc-state-changed",r),t.addEventListener("uc-expanded",n),t.addEventListener("uc-collapsed",s),t.addEventListener("uc-toggled",o),t.addEventListener("uc-tab-changed",c),i.set("uc-state-changed",r),i.set("uc-expanded",n),i.set("uc-collapsed",s),i.set("uc-toggled",o),i.set("uc-tab-changed",c),this._listeners.set(t,i)}_setupSlaveListeners(e,t,i){let r=new Map,n=s=>{let{type:o,detail:c}=s;s.target!==t&&this._applySyncAction(t,o,c,i)};for(let s of Object.values(S)){let o=c=>{let l=c;l.detail?.groupId===e&&n({type:s,detail:l.detail})};window.addEventListener(s,o),r.set(s,o)}this._listeners.set(t,r)}_removeListeners(e){let t=this._listeners.get(e);if(!t)return;if(e._ucLinkData?.role==="master")for(let[r,n]of t)e.removeEventListener(r,n);else for(let[r,n]of t)window.removeEventListener(r,n);this._listeners.delete(e)}_broadcastToSlaves(e,t,i){O(window,t,{...i,groupId:e})}_applySyncAction(e,t,i,r){if(!(r===K.EXPAND_ONLY&&t!==S.EXPAND)&&!(r===K.COLLAPSE_ONLY&&t!==S.COLLAPSE))switch(t){case S.EXPAND:r===K.INVERSE?e._collapse?.():e._expand?.();break;case S.COLLAPSE:r===K.INVERSE?e._expand?.():e._collapse?.();break;case S.TOGGLE:e._toggle?.();break;case S.TAB_CHANGE:e._setActiveTab&&i.tabIndex!==void 0&&e._setActiveTab(i.tabIndex);break;case S.STATE_CHANGE:e._handleLinkedStateChange&&e._handleLinkedStateChange(i);break}}getGroup(e){return this._groups.get(e)||new Set}getMaster(e){return this._masters.get(e)}getSlaves(e){return this._slaves.get(e)||new Set}hasGroup(e){return this._groups.has(e)}sendToGroup(e,t,i={}){O(window,S.CUSTOM,{groupId:e,eventName:t,data:i})}clear(){for(let[e,t]of this._groups)for(let i of t)this.unregister(e,i)}},Le=null;function lt(){return Le||(Le=new Ie),Le}var le=class{constructor(e,t={}){this._card=e,this._config=t,this._registry=lt()}setConfig(e){this._config.group_id&&this._registry.unregister(this._config.group_id,this._card),this._config=e,e.group_id&&this._registry.register(e.group_id,this._card,{role:e.role||"slave",syncMode:e.sync_mode||K.MIRROR})}broadcast(e,t={}){this._config.group_id&&this._config.role==="master"&&O(this._card,e,t)}sendCustomEvent(e,t={}){this._config.group_id&&this._registry.sendToGroup(this._config.group_id,e,t)}isMaster(){return this._config.role==="master"}getGroupInfo(){let e=this._config.group_id;return e?{id:e,totalCards:this._registry.getGroup(e).size,hasMaster:!!this._registry.getMaster(e),slavesCount:this._registry.getSlaves(e).size}:null}destroy(){this._config.group_id&&this._registry.unregister(this._config.group_id,this._card)}};var N={DOMAIN:"domain",AREA:"area",DEVICE_CLASS:"device_class",DEVICE:"device",FLOOR:"floor",LABEL:"label",STATE:"state",CUSTOM:"custom"},te={ALPHABETICAL:"alphabetical",COUNT_DESC:"count_desc",COUNT_ASC:"count_asc",PRIORITY:"priority",CUSTOM:"custom"},dt={automation:"mdi:robot",binary_sensor:"mdi:checkbox-marked-circle",button:"mdi:gesture-tap-button",calendar:"mdi:calendar",camera:"mdi:video",climate:"mdi:thermostat",cover:"mdi:window-shutter",device_tracker:"mdi:account",fan:"mdi:fan",group:"mdi:google-circles-communities",input_boolean:"mdi:toggle-switch",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",light:"mdi:lightbulb",lock:"mdi:lock",media_player:"mdi:cast",number:"mdi:ray-vertex",person:"mdi:account",scene:"mdi:palette",script:"mdi:script-text",select:"mdi:format-list-bulleted",sensor:"mdi:eye",sun:"mdi:white-balance-sunny",switch:"mdi:flash",timer:"mdi:timer",update:"mdi:package-up",vacuum:"mdi:robot-vacuum",weather:"mdi:weather-cloudy",zone:"mdi:map-marker"},ut={automation:"\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u0438",binary_sensor:"\u0411\u0438\u043D\u0430\u0440\u043D\u044B\u0435 \u0441\u0435\u043D\u0441\u043E\u0440\u044B",button:"\u041A\u043D\u043E\u043F\u043A\u0438",calendar:"\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u0438",camera:"\u041A\u0430\u043C\u0435\u0440\u044B",climate:"\u041A\u043B\u0438\u043C\u0430\u0442",cover:"\u0428\u0442\u043E\u0440\u044B/\u0416\u0430\u043B\u044E\u0437\u0438",device_tracker:"\u0422\u0440\u0435\u043A\u0435\u0440\u044B",fan:"\u0412\u0435\u043D\u0442\u0438\u043B\u044F\u0442\u043E\u0440\u044B",group:"\u0413\u0440\u0443\u043F\u043F\u044B",input_boolean:"\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u0438",input_number:"\u0427\u0438\u0441\u043B\u0430",input_select:"\u0421\u043F\u0438\u0441\u043A\u0438 \u0432\u044B\u0431\u043E\u0440\u0430",input_text:"\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0435 \u043F\u043E\u043B\u044F",light:"\u041E\u0441\u0432\u0435\u0449\u0435\u043D\u0438\u0435",lock:"\u0417\u0430\u043C\u043A\u0438",media_player:"\u041C\u0435\u0434\u0438\u0430\u043F\u043B\u0435\u0435\u0440\u044B",number:"\u0427\u0438\u0441\u043B\u0430",person:"\u041B\u044E\u0434\u0438",scene:"\u0421\u0446\u0435\u043D\u044B",script:"\u0421\u043A\u0440\u0438\u043F\u0442\u044B",select:"\u0421\u043F\u0438\u0441\u043A\u0438 \u0432\u044B\u0431\u043E\u0440\u0430",sensor:"\u0421\u0435\u043D\u0441\u043E\u0440\u044B",sun:"\u0421\u043E\u043B\u043D\u0446\u0435",switch:"\u0412\u044B\u043A\u043B\u044E\u0447\u0430\u0442\u0435\u043B\u0438",timer:"\u0422\u0430\u0439\u043C\u0435\u0440\u044B",update:"\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F",vacuum:"\u041F\u044B\u043B\u0435\u0441\u043E\u0441\u044B",weather:"\u041F\u043E\u0433\u043E\u0434\u0430",zone:"\u0417\u043E\u043D\u044B"},Fe={strategy:N.DOMAIN,sort:te.ALPHABETICAL,collapsed_by_default:!1,show_empty_groups:!1,show_counts:!0,max_items_per_group:0,exclude_domains:[],exclude_entities:[],include_entities:[],priority_order:[],custom_groups:{}},de=class{constructor(e,t={}){this._hass=e,this._config={...Fe,...t},this._cache=null,this._cacheTimestamp=0}set hass(e){this._hass=e,this._invalidateCache()}setConfig(e){this._config={...Fe,...e},this._invalidateCache()}getGroups(e=null){if(this._cache&&Date.now()-this._cacheTimestamp<1e3)return this._cache;let t=this._getFilteredEntities(e),i;switch(this._config.strategy){case N.DOMAIN:i=this._groupByDomain(t);break;case N.AREA:i=this._groupByArea(t);break;case N.DEVICE_CLASS:i=this._groupByDeviceClass(t);break;case N.DEVICE:i=this._groupByDevice(t);break;case N.FLOOR:i=this._groupByFloor(t);break;case N.LABEL:i=this._groupByLabel(t);break;case N.STATE:i=this._groupByState(t);break;case N.CUSTOM:i=this._groupByCustomRules(t);break;default:i=this._groupByDomain(t)}return i=this._sortGroups(i),this._config.max_items_per_group>0&&(i=i.map(r=>({...r,entities:r.entities.slice(0,this._config.max_items_per_group),hasMore:r.entities.length>this._config.max_items_per_group}))),this._cache=i,this._cacheTimestamp=Date.now(),i}_getFilteredEntities(e){let t=this._hass?.states||{},i;return e?i=e.filter(r=>t[r]).map(r=>({entity_id:r,...t[r]||{}})):this._config.include_entities?.length>0?i=this._config.include_entities.filter(r=>t[r]).map(r=>({entity_id:r,...t[r]||{}})):i=Object.entries(t).map(([r,n])=>({entity_id:r,...n||{}})),i.filter(r=>{let n=r.entity_id.split(".")[0];return!(this._config.exclude_domains.includes(n)||this._config.exclude_entities.includes(r.entity_id))})}_groupByDomain(e){let t=new Map;for(let i of e){let r=i.entity_id.split(".")[0];t.has(r)||t.set(r,{id:r,name:ut[r]||this._capitalize(r),icon:dt[r]||"mdi:bookmark",entities:[],collapsed:this._config.collapsed_by_default}),t.get(r).entities.push(i)}return Array.from(t.values()).filter(i=>this._config.show_empty_groups||i.entities.length>0)}_groupByArea(e){let t=new Map,i=this._hass?.areas||{},r=this._hass?.entities||{},n=this._hass?.devices||{};t.set("_no_area",{id:"_no_area",name:"\u0411\u0435\u0437 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",icon:"mdi:help-circle-outline",entities:[],collapsed:this._config.collapsed_by_default});for(let s of e){let o=null,c=r[s.entity_id];if(c?.area_id)o=c.area_id;else if(c?.device_id){let l=n[c.device_id];l?.area_id&&(o=l.area_id)}o&&i[o]?(t.has(o)||t.set(o,{id:o,name:i[o].name,icon:i[o].icon||"mdi:home-floor-0",entities:[],collapsed:this._config.collapsed_by_default}),t.get(o).entities.push(s)):t.get("_no_area").entities.push(s)}return Array.from(t.values()).filter(s=>this._config.show_empty_groups||s.entities.length>0)}_groupByDeviceClass(e){let t=new Map;for(let i of e){let r=i.attributes?.device_class||"_none";t.has(r)||t.set(r,{id:r,name:r==="_none"?"\u0411\u0435\u0437 \u043A\u043B\u0430\u0441\u0441\u0430":this._capitalize(r),icon:this._getDeviceClassIcon(r),entities:[],collapsed:this._config.collapsed_by_default}),t.get(r).entities.push(i)}return Array.from(t.values()).filter(i=>this._config.show_empty_groups||i.entities.length>0)}_groupByDevice(e){let t=new Map,i=this._hass?.entities||{},r=this._hass?.devices||{};t.set("_no_device",{id:"_no_device",name:"\u0411\u0435\u0437 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430",icon:"mdi:help-circle-outline",entities:[],collapsed:this._config.collapsed_by_default});for(let n of e){let o=i[n.entity_id]?.device_id;if(o&&r[o]){let c=r[o];t.has(o)||t.set(o,{id:o,name:c.name||c.name_by_user||o,icon:"mdi:devices",manufacturer:c.manufacturer,model:c.model,entities:[],collapsed:this._config.collapsed_by_default}),t.get(o).entities.push(n)}else t.get("_no_device").entities.push(n)}return Array.from(t.values()).filter(n=>this._config.show_empty_groups||n.entities.length>0)}_groupByFloor(e){let t=new Map,i=this._hass?.areas||{},r=this._hass?.floors||{},n=this._hass?.entities||{},s=this._hass?.devices||{};t.set("_no_floor",{id:"_no_floor",name:"\u0411\u0435\u0437 \u044D\u0442\u0430\u0436\u0430",icon:"mdi:help-circle-outline",entities:[],collapsed:this._config.collapsed_by_default});for(let o of e){let c=null,l=n[o.entity_id],d=l?.area_id;!d&&l?.device_id&&(d=s[l.device_id]?.area_id),d&&i[d]?.floor_id&&(c=i[d].floor_id),c&&r[c]?(t.has(c)||t.set(c,{id:c,name:r[c].name,icon:r[c].icon||"mdi:home-floor-0",level:r[c].level,entities:[],collapsed:this._config.collapsed_by_default}),t.get(c).entities.push(o)):t.get("_no_floor").entities.push(o)}return Array.from(t.values()).filter(o=>this._config.show_empty_groups||o.entities.length>0)}_groupByLabel(e){let t=new Map,i=this._hass?.labels||{},r=this._hass?.entities||{};t.set("_no_label",{id:"_no_label",name:"\u0411\u0435\u0437 \u043C\u0435\u0442\u043A\u0438",icon:"mdi:label-off-outline",entities:[],collapsed:this._config.collapsed_by_default});for(let n of e){let o=r[n.entity_id]?.labels||[];if(o.length===0)t.get("_no_label").entities.push(n);else for(let c of o){if(!t.has(c)){let l=i[c]||{name:c,icon:"mdi:label"};t.set(c,{id:c,name:l.name,icon:l.icon||"mdi:label",color:l.color,entities:[],collapsed:this._config.collapsed_by_default})}t.get(c).entities.push(n)}}return Array.from(t.values()).filter(n=>this._config.show_empty_groups||n.entities.length>0)}_groupByState(e){let t=new Map;for(let i of e){let r=i.state;t.has(r)||t.set(r,{id:r,name:this._getStateName(r),icon:this._getStateIcon(r),entities:[],collapsed:this._config.collapsed_by_default}),t.get(r).entities.push(i)}return Array.from(t.values()).filter(i=>this._config.show_empty_groups||i.entities.length>0)}_groupByCustomRules(e){let t=new Map,i=this._config.custom_groups||{};for(let[r,n]of Object.entries(i))t.set(r,{id:r,name:n.name||r,icon:n.icon||"mdi:folder",entities:[],collapsed:n.collapsed!=null?n.collapsed:this._config.collapsed_by_default});t.set("_other",{id:"_other",name:"\u041F\u0440\u043E\u0447\u0435\u0435",icon:"mdi:dots-horizontal",entities:[],collapsed:this._config.collapsed_by_default});for(let r of e){let n=!1;for(let[s,o]of Object.entries(i))if(this._matchesGroupRules(r,o)){t.get(s).entities.push(r),n=!0;break}n||t.get("_other").entities.push(r)}return Array.from(t.values()).filter(r=>this._config.show_empty_groups||r.entities.length>0)}_matchesGroupRules(e,t){let i=t.rules||{};if(i.entity_id&&!new RegExp(i.entity_id.replace(/\*/g,".*")).test(e.entity_id))return!1;if(i.domain){let r=e.entity_id.split(".")[0];if(!(Array.isArray(i.domain)?i.domain:[i.domain]).includes(r))return!1}if(i.state&&!(Array.isArray(i.state)?i.state:[i.state]).includes(e.state))return!1;if(i.attribute){let{name:r,value:n,above:s,below:o}=i.attribute,c=e.attributes?.[r];if(n!==void 0&&c!==n||s!==void 0&&parseFloat(c)<=s||o!==void 0&&parseFloat(c)>=o)return!1}return!0}_sortGroups(e){switch(this._config.sort){case te.ALPHABETICAL:return e.sort((i,r)=>i.name.localeCompare(r.name));case te.COUNT_DESC:return e.sort((i,r)=>r.entities.length-i.entities.length);case te.COUNT_ASC:return e.sort((i,r)=>i.entities.length-r.entities.length);case te.PRIORITY:let t=this._config.priority_order||[];return e.sort((i,r)=>{let n=t.indexOf(i.id),s=t.indexOf(r.id);return n===-1&&s===-1?0:n===-1?1:s===-1?-1:n-s});default:return e}}_invalidateCache(){this._cache=null,this._cacheTimestamp=0}_capitalize(e){return e.charAt(0).toUpperCase()+e.slice(1).replace(/_/g," ")}_getDeviceClassIcon(e){return{battery:"mdi:battery",carbon_dioxide:"mdi:molecule-co2",carbon_monoxide:"mdi:molecule-co",connectivity:"mdi:connection",current:"mdi:current-ac",door:"mdi:door",energy:"mdi:lightning-bolt",gas:"mdi:gas-cylinder",humidity:"mdi:water-percent",illuminance:"mdi:brightness-5",moisture:"mdi:water",motion:"mdi:motion-sensor",occupancy:"mdi:home-account",power:"mdi:flash",power_factor:"mdi:angle-acute",pressure:"mdi:gauge",problem:"mdi:alert-circle",safety:"mdi:shield-check",smoke:"mdi:smoke-detector",sound:"mdi:volume-high",temperature:"mdi:thermometer",timestamp:"mdi:clock",voltage:"mdi:sine-wave",window:"mdi:window-closed"}[e]||"mdi:bookmark"}_getStateName(e){return{on:"\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E",off:"\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E",home:"\u0414\u043E\u043C\u0430",not_home:"\u041D\u0435 \u0434\u043E\u043C\u0430",open:"\u041E\u0442\u043A\u0440\u044B\u0442\u043E",closed:"\u0417\u0430\u043A\u0440\u044B\u0442\u043E",locked:"\u0417\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E",unlocked:"\u0420\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043D\u043E",playing:"\u0412\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0434\u0435\u043D\u0438\u0435",paused:"\u041F\u0430\u0443\u0437\u0430",idle:"\u041E\u0436\u0438\u0434\u0430\u043D\u0438\u0435",unavailable:"\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E",unknown:"\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E"}[e]||this._capitalize(e)}_getStateIcon(e){return{on:"mdi:check-circle",off:"mdi:close-circle",home:"mdi:home",not_home:"mdi:home-export-outline",open:"mdi:door-open",closed:"mdi:door-closed",locked:"mdi:lock",unlocked:"mdi:lock-open",playing:"mdi:play",paused:"mdi:pause",idle:"mdi:sleep",unavailable:"mdi:alert",unknown:"mdi:help-circle"}[e]||"mdi:circle"}};var f={NONE:"none",REDUCED:"reduced",COMPACT:"compact",MINIMAL:"minimal",ICON_ONLY:"icon_only"},U={MANUAL:"manual",SCREEN_WIDTH:"screen_width",CONTAINER_WIDTH:"container_width",CARD_COUNT:"card_count",AUTO:"auto"},pt={enabled:!0,level:f.NONE,trigger:U.AUTO,breakpoints:{[f.REDUCED]:768,[f.COMPACT]:480,[f.MINIMAL]:320,[f.ICON_ONLY]:200},containerBreakpoints:{[f.REDUCED]:400,[f.COMPACT]:300,[f.MINIMAL]:200,[f.ICON_ONLY]:120},levelSettings:{[f.NONE]:{padding:"16px",gap:"12px",fontSize:"14px",iconSize:"24px",showTitle:!0,showSubtitle:!0,showBadges:!0,showFooter:!0,gridColumns:null},[f.REDUCED]:{padding:"12px",gap:"8px",fontSize:"13px",iconSize:"22px",showTitle:!0,showSubtitle:!0,showBadges:!0,showFooter:!0,gridColumns:null},[f.COMPACT]:{padding:"8px",gap:"6px",fontSize:"12px",iconSize:"20px",showTitle:!0,showSubtitle:!1,showBadges:!0,showFooter:!1,gridColumns:1},[f.MINIMAL]:{padding:"6px",gap:"4px",fontSize:"11px",iconSize:"18px",showTitle:!0,showSubtitle:!1,showBadges:!1,showFooter:!1,gridColumns:1},[f.ICON_ONLY]:{padding:"4px",gap:"2px",fontSize:"10px",iconSize:"16px",showTitle:!1,showSubtitle:!1,showBadges:!1,showFooter:!1,gridColumns:1}}},ue=class{constructor(e,t={}){this._element=e,this._config=this._mergeConfig(pt,t),this._currentLevel=f.NONE,this._resizeObserver=null,this._mediaQueryListeners=[],this._callbacks=new Set,this._init()}_mergeConfig(e,t){let i={...e};for(let r of Object.keys(t)){let n=t[r],s=e[r];n&&typeof n=="object"&&!Array.isArray(n)?i[r]=this._mergeConfig(typeof s=="object"&&s?s:{},n):i[r]=n}return i}_init(){if(this._config.enabled){switch(this._config.trigger){case U.SCREEN_WIDTH:case U.AUTO:this._setupMediaQueries();break;case U.CONTAINER_WIDTH:this._setupResizeObserver();break;case U.MANUAL:this.setLevel(this._config.level);break}this._config.trigger===U.AUTO&&this._setupResizeObserver()}}_setupMediaQueries(){let e=this._config.breakpoints,t=Object.entries(e).sort(([,i],[,r])=>i-r);for(let[i,r]of t){let n=window.matchMedia(`(max-width: ${r}px)`),s=o=>{this._evaluateLevel()};n.addEventListener("change",s),this._mediaQueryListeners.push({mql:n,handler:s})}this._evaluateLevel()}_setupResizeObserver(){window.ResizeObserver&&(this._resizeObserver=new ResizeObserver(e=>{for(let t of e)this._handleResize(t.contentRect.width)}),this._resizeObserver.observe(this._element))}_handleResize(e){if(this._config.trigger!==U.CONTAINER_WIDTH&&this._config.trigger!==U.AUTO)return;let t=this._config.containerBreakpoints,i=f.NONE;for(let[r,n]of Object.entries(t))e<=n&&(i=r);this.setLevel(i)}_evaluateLevel(){let e=this._config.breakpoints,t=window.innerWidth,i=f.NONE;for(let[r,n]of Object.entries(e))t<=n&&(i=r);this.setLevel(i)}setLevel(e){if(!Object.values(f).includes(e)){console.warn(`[CompactMode] Unknown level: ${e}`);return}if(e===this._currentLevel)return;let t=this._currentLevel;this._currentLevel=e,this._applyLevel(e),this._notifyCallbacks(e,t)}getLevel(){return this._currentLevel}getCurrentSettings(){return this._config.levelSettings[this._currentLevel]||this._config.levelSettings[f.NONE]}_applyLevel(e){for(let i of Object.values(f))this._element.classList.remove(`uc-compact-${i}`);this._element.classList.add(`uc-compact-${e}`);let t=this._config.levelSettings[e];t&&(this._element.style.setProperty("--uc-compact-padding",t.padding),this._element.style.setProperty("--uc-compact-gap",t.gap),this._element.style.setProperty("--uc-compact-font-size",t.fontSize),this._element.style.setProperty("--uc-compact-icon-size",t.iconSize)),this._element.dataset.compactLevel=e}toggleNext(){let e=Object.values(f),i=(e.indexOf(this._currentLevel)+1)%e.length;this.setLevel(e[i])}togglePrevious(){let e=Object.values(f),i=(e.indexOf(this._currentLevel)-1+e.length)%e.length;this.setLevel(e[i])}reset(){this.setLevel(f.NONE)}isCompact(){return this._currentLevel!==f.NONE}shouldShow(e){let t=this.getCurrentSettings(),i=`show${e.charAt(0).toUpperCase()+e.slice(1)}`;return t[i]!==!1}getGridColumns(e=2){let t=this.getCurrentSettings();return t.gridColumns!=null?t.gridColumns:e}subscribe(e){return this._callbacks.add(e),()=>this._callbacks.delete(e)}_notifyCallbacks(e,t){for(let i of this._callbacks)try{i(e,t)}catch(r){console.error("[CompactMode] Callback error:",r)}}destroy(){for(let{mql:e,handler:t}of this._mediaQueryListeners)e.removeEventListener("change",t);this._mediaQueryListeners=[],this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._callbacks.clear();for(let e of Object.values(f))this._element.classList.remove(`uc-compact-${e}`);this._element.style.removeProperty("--uc-compact-padding"),this._element.style.removeProperty("--uc-compact-gap"),this._element.style.removeProperty("--uc-compact-font-size"),this._element.style.removeProperty("--uc-compact-icon-size"),delete this._element.dataset.compactLevel}static getStyles(){return`
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
    `}};var pe={DEFAULT:{name:"Default",blur:10,opacity:.7,saturation:180,borderOpacity:.2,borderWidth:1,shadowOpacity:.1},CLEAR:{name:"Clear",blur:20,opacity:.9,saturation:100,borderOpacity:.1,borderWidth:1,shadowOpacity:.05},FROSTED:{name:"Frosted",blur:25,opacity:.6,saturation:150,borderOpacity:.3,borderWidth:1,shadowOpacity:.15},TINTED:{name:"Tinted",blur:15,opacity:.5,saturation:200,borderOpacity:.2,borderWidth:1,shadowOpacity:.12,tint:"var(--primary-color)"},DENSE:{name:"Dense",blur:8,opacity:.85,saturation:120,borderOpacity:.4,borderWidth:2,shadowOpacity:.2},NEON:{name:"Neon",blur:12,opacity:.6,saturation:250,borderOpacity:.5,borderWidth:1,shadowOpacity:.15,glowColor:"var(--primary-color)",glowIntensity:10},MINIMAL:{name:"Minimal",blur:5,opacity:.95,saturation:100,borderOpacity:.05,borderWidth:0,shadowOpacity:.05}},Oe={LIGHT:{background:"rgba(255, 255, 255, {opacity})",border:"rgba(255, 255, 255, {borderOpacity})",shadow:"rgba(0, 0, 0, {shadowOpacity})"},DARK:{background:"rgba(0, 0, 0, {opacity})",border:"rgba(255, 255, 255, {borderOpacity})",shadow:"rgba(0, 0, 0, {shadowOpacity})"},PRIMARY:{background:"rgba(var(--rgb-primary-color), {opacity})",border:"rgba(var(--rgb-primary-color), {borderOpacity})",shadow:"rgba(var(--rgb-primary-color), {shadowOpacity})"},ACCENT:{background:"rgba(var(--rgb-accent-color), {opacity})",border:"rgba(var(--rgb-accent-color), {borderOpacity})",shadow:"rgba(var(--rgb-accent-color), {shadowOpacity})"}},me=class{constructor(e={}){this._config={preset:"DEFAULT",colorScheme:"LIGHT",customSettings:{},...e}}setPreset(e){pe[e]&&(this._config.preset=e)}setColorScheme(e){Oe[e]&&(this._config.colorScheme=e)}getSettings(){return{...pe[this._config.preset]||pe.DEFAULT,...this._config.customSettings}}generateStyles(e={}){let t={...this.getSettings(),...e},i=Oe[this._config.colorScheme]||Oe.LIGHT,r=i.background.replace("{opacity}",String(t.opacity)),n=i.border.replace("{borderOpacity}",String(t.borderOpacity)),s=i.shadow.replace("{shadowOpacity}",String(t.shadowOpacity)),o={background:r,backdropFilter:`blur(${t.blur}px) saturate(${t.saturation}%)`,WebkitBackdropFilter:`blur(${t.blur}px) saturate(${t.saturation}%)`,border:t.borderWidth>0?`${t.borderWidth}px solid ${n}`:"none",boxShadow:`0 8px 32px ${s}`};return t.tint&&(o.background=`linear-gradient(135deg, ${t.tint}20, ${r})`),t.glowColor&&t.glowIntensity&&(o.boxShadow=`
        0 8px 32px ${s},
        0 0 ${t.glowIntensity}px ${t.glowColor}40,
        inset 0 0 ${t.glowIntensity/2}px ${t.glowColor}20
      `),o}apply(e,t={}){let i=this.generateStyles(t);for(let[r,n]of Object.entries(i))e.style.setProperty(r.replace(/[A-Z]/g,s=>`-${s.toLowerCase()}`),String(n));e.classList.add("uc-glass")}remove(e){let t=["background","backdropFilter","webkitBackdropFilter","border","boxShadow"];for(let i of t)e.style[i]="";e.classList.remove("uc-glass")}generateCSS(e="glass",t={}){let i=this.generateStyles(t);return`
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
    `);for(let[t,i]of Object.entries(pe)){let r=`uc-glass-${t.toLowerCase()}`,n=`rgba(255, 255, 255, ${i.opacity})`,s=`rgba(0, 0, 0, ${i.opacity})`,o=`rgba(255, 255, 255, ${i.borderOpacity})`,c=`rgba(0, 0, 0, ${i.shadowOpacity})`;e.push(`
        .${r} {
          background: ${n};
          backdrop-filter: blur(${i.blur}px) saturate(${i.saturation}%);
          -webkit-backdrop-filter: blur(${i.blur}px) saturate(${i.saturation}%);
          border: ${i.borderWidth}px solid ${o};
          box-shadow: 0 8px 32px ${c};
        }

        @media (prefers-color-scheme: dark) {
          .${r} {
            background: ${s};
          }
        }
      `),i.glowColor&&e.push(`
          .${r} {
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
`)}};var k={FLAT:"flat",RAISED:"raised",PRESSED:"pressed",INSET:"inset",CONVEX:"convex",CONCAVE:"concave"},G={SUBTLE:"subtle",LIGHT:"light",MEDIUM:"medium",STRONG:"strong",EXTREME:"extreme"},Re={[G.SUBTLE]:{distance:3,blur:6,lightOpacity:.5,shadowOpacity:.1},[G.LIGHT]:{distance:5,blur:10,lightOpacity:.7,shadowOpacity:.15},[G.MEDIUM]:{distance:8,blur:16,lightOpacity:1,shadowOpacity:.2},[G.STRONG]:{distance:12,blur:24,lightOpacity:1,shadowOpacity:.3},[G.EXTREME]:{distance:20,blur:40,lightOpacity:1,shadowOpacity:.4}},fe={LIGHT:{background:"#e0e5ec",lightShadow:"#ffffff",darkShadow:"#a3b1c6",text:"#333333",accent:"#6d5dfc"},DARK:{background:"#2d2d2d",lightShadow:"#3d3d3d",darkShadow:"#1d1d1d",text:"#e0e0e0",accent:"#6d5dfc"},BLUE:{background:"#d6e4f0",lightShadow:"#ffffff",darkShadow:"#a3b8cc",text:"#2c3e50",accent:"#3498db"},GREEN:{background:"#d4e6d4",lightShadow:"#ffffff",darkShadow:"#a3c4a3",text:"#2d4a2d",accent:"#27ae60"},PINK:{background:"#f0d6e4",lightShadow:"#ffffff",darkShadow:"#c4a3b4",text:"#4a2d3d",accent:"#e91e63"},CUSTOM:{background:"var(--neu-background, #e0e5ec)",lightShadow:"var(--neu-light-shadow, #ffffff)",darkShadow:"var(--neu-dark-shadow, #a3b1c6)",text:"var(--neu-text, #333333)",accent:"var(--neu-accent, #6d5dfc)"}},ge=class{constructor(e={}){this._config={type:k.RAISED,intensity:G.MEDIUM,palette:"LIGHT",lightAngle:145,borderRadius:12,...e}}setType(e){Object.values(k).includes(e)&&(this._config.type=e)}setIntensity(e){Object.values(G).includes(e)&&(this._config.intensity=e)}setPalette(e){fe[e]&&(this._config.palette=e)}setLightAngle(e){this._config.lightAngle=e%360}getPalette(){return fe[this._config.palette]||fe.LIGHT}_calculateShadowOffset(){let t=this._config.lightAngle*Math.PI/180,i=Re[this._config.intensity],r=i.distance,n=Math.round(-Math.cos(t)*r),s=Math.round(-Math.sin(t)*r),o=Math.round(Math.cos(t)*r),c=Math.round(Math.sin(t)*r);return{lightX:n,lightY:s,darkX:o,darkY:c,blur:i.blur}}generateShadow(e={}){let t={...this._config,...e},i=this.getPalette(),r=Re[t.intensity],n=this._calculateShadowOffset(),s=i.lightShadow,o=i.darkShadow;switch(t.type){case k.FLAT:return"none";case k.RAISED:return`
          ${n.lightX}px ${n.lightY}px ${n.blur}px ${s},
          ${n.darkX}px ${n.darkY}px ${n.blur}px ${o}
        `.trim();case k.PRESSED:return`
          inset ${n.darkX}px ${n.darkY}px ${n.blur}px ${o},
          inset ${n.lightX}px ${n.lightY}px ${n.blur}px ${s}
        `.trim();case k.INSET:return`
          inset ${n.lightX}px ${n.lightY}px ${n.blur/2}px ${s},
          inset ${n.darkX}px ${n.darkY}px ${n.blur/2}px ${o}
        `.trim();case k.CONVEX:return`
          ${n.lightX}px ${n.lightY}px ${n.blur}px ${s},
          ${n.darkX}px ${n.darkY}px ${n.blur}px ${o},
          inset ${n.lightX/2}px ${n.lightY/2}px ${n.blur/4}px ${s},
          inset ${n.darkX/2}px ${n.darkY/2}px ${n.blur/4}px ${o}
        `.trim();case k.CONCAVE:return`
          ${n.lightX}px ${n.lightY}px ${n.blur}px ${s},
          ${n.darkX}px ${n.darkY}px ${n.blur}px ${o},
          inset ${n.darkX/2}px ${n.darkY/2}px ${n.blur/4}px ${o},
          inset ${n.lightX/2}px ${n.lightY/2}px ${n.blur/4}px ${s}
        `.trim();default:return"none"}}generateGradient(){let e=this.getPalette(),t=this._config.lightAngle;switch(this._config.type){case k.CONVEX:return`linear-gradient(${t}deg, 
          ${this._lighten(e.background,5)}, 
          ${this._darken(e.background,5)})`;case k.CONCAVE:return`linear-gradient(${t}deg, 
          ${this._darken(e.background,5)}, 
          ${this._lighten(e.background,5)})`;default:return null}}_lighten(e,t){if(e.startsWith("var("))return e;let i=parseInt(e.replace("#",""),16),r=Math.round(2.55*t),n=Math.min(255,(i>>16)+r),s=Math.min(255,(i>>8&255)+r),o=Math.min(255,(i&255)+r);return`#${(16777216+n*65536+s*256+o).toString(16).slice(1)}`}_darken(e,t){if(e.startsWith("var("))return e;let i=parseInt(e.replace("#",""),16),r=Math.round(2.55*t),n=Math.max(0,(i>>16)-r),s=Math.max(0,(i>>8&255)-r),o=Math.max(0,(i&255)-r);return`#${(16777216+n*65536+s*256+o).toString(16).slice(1)}`}generateStyles(e={}){let t=this.getPalette(),i=this.generateShadow(e),r=this.generateGradient(),n={backgroundColor:t.background,boxShadow:i,borderRadius:`${this._config.borderRadius}px`,color:t.text,border:"none"};return r&&(n.background=r),n}apply(e,t={}){let i=this.generateStyles(t);for(let[r,n]of Object.entries(i))e.style.setProperty(r.replace(/[A-Z]/g,s=>`-${s.toLowerCase()}`),String(n));e.classList.add("uc-neu"),e.dataset.neuType=this._config.type}remove(e){let t=["backgroundColor","background","boxShadow","borderRadius","color","border"];for(let i of t)e.style[i]="";e.classList.remove("uc-neu"),delete e.dataset.neuType}static getStyles(){let e=[];for(let[t,i]of Object.entries(fe)){let r=t.toLowerCase();e.push(`
        .uc-neu-${r} {
          --neu-background: ${i.background};
          --neu-light-shadow: ${i.lightShadow};
          --neu-dark-shadow: ${i.darkShadow};
          --neu-text: ${i.text};
          --neu-accent: ${i.accent};
          background: var(--neu-background);
          color: var(--neu-text);
        }
      `);for(let[n,s]of Object.entries(k)){let o=n.toLowerCase(),c=Re[G.MEDIUM],l;switch(s){case k.FLAT:l="none";break;case k.RAISED:l=`-${c.distance}px -${c.distance}px ${c.blur}px var(--neu-light-shadow), ${c.distance}px ${c.distance}px ${c.blur}px var(--neu-dark-shadow)`;break;case k.PRESSED:l=`inset ${c.distance}px ${c.distance}px ${c.blur}px var(--neu-dark-shadow), inset -${c.distance}px -${c.distance}px ${c.blur}px var(--neu-light-shadow)`;break;case k.INSET:l=`inset -${c.distance/2}px -${c.distance/2}px ${c.blur/2}px var(--neu-light-shadow), inset ${c.distance/2}px ${c.distance/2}px ${c.blur/2}px var(--neu-dark-shadow)`;break;default:l="none"}e.push(`
          .uc-neu-${r}.uc-neu-${o} {
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
`)}};var x={GEOMETRIC:"geometric",DOTS:"dots",LINES:"lines",WAVES:"waves",NOISE:"noise",ORGANIC:"organic"},W={grid:{category:x.GEOMETRIC,name:"Grid",css:(a="rgba(0,0,0,0.05)",e=20)=>`
      linear-gradient(${a} 1px, transparent 1px),
      linear-gradient(90deg, ${a} 1px, transparent 1px)
    `,size:(a=20)=>`${a}px ${a}px`,description:"\u0421\u0435\u0442\u043A\u0430"},checkerboard:{category:x.GEOMETRIC,name:"Checkerboard",css:(a="rgba(0,0,0,0.05)",e=20)=>`
      linear-gradient(45deg, ${a} 25%, transparent 25%),
      linear-gradient(-45deg, ${a} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${a} 75%),
      linear-gradient(-45deg, transparent 75%, ${a} 75%)
    `,size:(a=20)=>`${a}px ${a}px`,position:(a=20)=>`0 0, 0 ${a/2}px, ${a/2}px -${a/2}px, -${a/2}px 0px`,description:"\u0428\u0430\u0445\u043C\u0430\u0442\u043D\u0430\u044F \u0434\u043E\u0441\u043A\u0430"},triangles:{category:x.GEOMETRIC,name:"Triangles",css:(a="rgba(0,0,0,0.05)",e=40)=>`
      linear-gradient(135deg, ${a} 25%, transparent 25%) -${e/2}px 0,
      linear-gradient(225deg, ${a} 25%, transparent 25%) -${e/2}px 0,
      linear-gradient(315deg, ${a} 25%, transparent 25%),
      linear-gradient(45deg, ${a} 25%, transparent 25%)
    `,size:(a=40)=>`${a}px ${a}px`,description:"\u0422\u0440\u0435\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0438"},hexagons:{category:x.GEOMETRIC,name:"Hexagons",svg:(a="#00000010",e=30)=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="${e*2}" height="${e*1.73}">
        <polygon points="${e},0 ${e*2},${e*.5} ${e*2},${e*1.23} ${e},${e*1.73} 0,${e*1.23} 0,${e*.5}"
                 fill="none" stroke="${a}" stroke-width="1"/>
      </svg>
    `,description:"\u0428\u0435\u0441\u0442\u0438\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0438"},diamonds:{category:x.GEOMETRIC,name:"Diamonds",css:(a="rgba(0,0,0,0.05)",e=20)=>`
      linear-gradient(135deg, ${a} 25%, transparent 25%),
      linear-gradient(225deg, ${a} 25%, transparent 25%),
      linear-gradient(45deg, ${a} 25%, transparent 25%),
      linear-gradient(315deg, ${a} 25%, transparent 25%)
    `,size:(a=20)=>`${a}px ${a}px`,position:(a=20)=>`${a/2}px 0, ${a/2}px 0, 0 0, 0 0`,description:"\u0420\u043E\u043C\u0431\u044B"},dots:{category:x.DOTS,name:"Dots",css:(a="rgba(0,0,0,0.1)",e=20)=>`
      radial-gradient(${a} 2px, transparent 2px)
    `,size:(a=20)=>`${a}px ${a}px`,description:"\u0422\u043E\u0447\u043A\u0438"},dotsLarge:{category:x.DOTS,name:"Dots Large",css:(a="rgba(0,0,0,0.08)",e=30)=>`
      radial-gradient(${a} 4px, transparent 4px)
    `,size:(a=30)=>`${a}px ${a}px`,description:"\u041A\u0440\u0443\u043F\u043D\u044B\u0435 \u0442\u043E\u0447\u043A\u0438"},dotsGradient:{category:x.DOTS,name:"Dots Gradient",css:(a="rgba(0,0,0,0.1)",e=20)=>`
      radial-gradient(circle at center, ${a}, transparent 50%)
    `,size:(a=20)=>`${a}px ${a}px`,description:"\u0422\u043E\u0447\u043A\u0438 \u0441 \u0433\u0440\u0430\u0434\u0438\u0435\u043D\u0442\u043E\u043C"},horizontalLines:{category:x.LINES,name:"Horizontal Lines",css:(a="rgba(0,0,0,0.05)",e=10)=>`
      linear-gradient(${a} 1px, transparent 1px)
    `,size:(a=10)=>`100% ${a}px`,description:"\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u043B\u0438\u043D\u0438\u0438"},verticalLines:{category:x.LINES,name:"Vertical Lines",css:(a="rgba(0,0,0,0.05)",e=10)=>`
      linear-gradient(90deg, ${a} 1px, transparent 1px)
    `,size:(a=10)=>`${a}px 100%`,description:"\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0435 \u043B\u0438\u043D\u0438\u0438"},diagonalLines:{category:x.LINES,name:"Diagonal Lines",css:(a="rgba(0,0,0,0.05)",e=10)=>`
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent ${e}px,
        ${a} ${e}px,
        ${a} ${e+1}px
      )
    `,size:()=>"auto",description:"\u0414\u0438\u0430\u0433\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u043B\u0438\u043D\u0438\u0438"},crosshatch:{category:x.LINES,name:"Crosshatch",css:(a="rgba(0,0,0,0.05)",e=10)=>`
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent ${e}px,
        ${a} ${e}px,
        ${a} ${e+1}px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent ${e}px,
        ${a} ${e}px,
        ${a} ${e+1}px
      )
    `,size:()=>"auto",description:"\u041F\u0435\u0440\u0435\u043A\u0440\u0451\u0441\u0442\u043D\u0430\u044F \u0448\u0442\u0440\u0438\u0445\u043E\u0432\u043A\u0430"},waves:{category:x.WAVES,name:"Waves",svg:(a="#00000010",e=40)=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e/2}">
        <path d="M0 ${e/4} Q ${e/4} 0 ${e/2} ${e/4} T ${e} ${e/4}" 
              fill="none" stroke="${a}" stroke-width="1"/>
      </svg>
    `,description:"\u0412\u043E\u043B\u043D\u044B"},zigzag:{category:x.WAVES,name:"Zigzag",css:(a="rgba(0,0,0,0.05)",e=20)=>`
      linear-gradient(135deg, ${a} 25%, transparent 25%),
      linear-gradient(225deg, ${a} 25%, transparent 25%)
    `,size:(a=20)=>`${a}px ${a}px`,position:()=>"0 0, 10px 0",description:"\u0417\u0438\u0433\u0437\u0430\u0433"},noise:{category:x.NOISE,name:"Noise",svg:()=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.05"/>
      </svg>
    `,description:"\u0428\u0443\u043C"},grain:{category:x.NOISE,name:"Grain",svg:()=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
        <filter id="grain">
          <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" result="noise"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" opacity="0.03"/>
      </svg>
    `,description:"\u0417\u0435\u0440\u043D\u0438\u0441\u0442\u043E\u0441\u0442\u044C"},topography:{category:x.ORGANIC,name:"Topography",svg:(a="#00000008")=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <circle cx="20" cy="20" r="15" fill="none" stroke="${a}" stroke-width="1"/>
        <circle cx="20" cy="20" r="25" fill="none" stroke="${a}" stroke-width="1"/>
        <circle cx="20" cy="20" r="35" fill="none" stroke="${a}" stroke-width="1"/>
        <circle cx="80" cy="80" r="10" fill="none" stroke="${a}" stroke-width="1"/>
        <circle cx="80" cy="80" r="20" fill="none" stroke="${a}" stroke-width="1"/>
        <circle cx="80" cy="80" r="30" fill="none" stroke="${a}" stroke-width="1"/>
      </svg>
    `,description:"\u0422\u043E\u043F\u043E\u0433\u0440\u0430\u0444\u0438\u044F"},circuit:{category:x.ORGANIC,name:"Circuit",svg:(a="#00000010")=>`
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
        <path d="M0 25 H20 V10 H30 V25 H50 M25 0 V10 M25 50 V40" 
              fill="none" stroke="${a}" stroke-width="1"/>
        <circle cx="25" cy="10" r="2" fill="${a}"/>
        <circle cx="25" cy="40" r="2" fill="${a}"/>
      </svg>
    `,description:"\u0421\u0445\u0435\u043C\u0430"}},he=class{constructor(e={}){this._config={pattern:"grid",color:"rgba(0, 0, 0, 0.05)",size:20,opacity:1,blend:"normal",...e}}setPattern(e){W[e]&&(this._config.pattern=e)}setColor(e){this._config.color=e}setSize(e){this._config.size=e}getPattern(){return W[this._config.pattern]||W.grid}generateStyles(e={}){let t={...this._config,...e},i=W[t.pattern];if(!i)return{};let r={backgroundBlendMode:String(t.blend||"normal")};if(i.css&&(r.backgroundImage=i.css(t.color,t.size),i.size&&(r.backgroundSize=i.size(t.size)),i.position&&(r.backgroundPosition=i.position(t.size))),i.svg){let n=i.svg(t.color,t.size),s=encodeURIComponent(n);r.backgroundImage=`url("data:image/svg+xml,${s}")`}return t.opacity<1&&(r.opacity=t.opacity),r}apply(e,t={}){let i=this.generateStyles(t);for(let[r,n]of Object.entries(i))e.style.setProperty(r.replace(/[A-Z]/g,s=>`-${s.toLowerCase()}`),String(n));e.classList.add("uc-pattern"),e.dataset.pattern=this._config.pattern}remove(e){e.style.backgroundImage="",e.style.backgroundSize="",e.style.backgroundPosition="",e.style.backgroundBlendMode="",e.classList.remove("uc-pattern"),delete e.dataset.pattern}static getByCategory(e){let t={};for(let[i,r]of Object.entries(W))r.category===e&&(t[i]=r);return t}static getPatternNames(){return Object.keys(W)}static getStyles(){let e=[];for(let[t,i]of Object.entries(W))if(i.css){let r=i.css("rgba(0,0,0,0.05)",20),n=i.size?i.size(20):"auto",s=i.position?i.position(20):"0 0";e.push(`
          .uc-pattern-${t} {
            background-image: ${r};
            background-size: ${n};
            background-position: ${s};
          }
        `)}else if(i.svg){let r=i.svg("rgba(0,0,0,0.05)",20),n=encodeURIComponent(r);e.push(`
          .uc-pattern-${t} {
            background-image: url("data:image/svg+xml,${n}");
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
`)}};var I={GRADIENT:"gradient",GLOW:"glow",PULSE:"pulse",RAINBOW:"rainbow",DASH:"dash",WAVE:"wave",NEON:"neon",SHIMMER:"shimmer"},_e={PRIMARY:["var(--primary-color)","var(--accent-color, #6366f1)"],RAINBOW:["#ff0000","#ff7f00","#ffff00","#00ff00","#0000ff","#8b00ff","#ff0000"],SUNSET:["#ff6b6b","#feca57","#ff9ff3"],OCEAN:["#0077be","#00a5cf","#00d4aa"],FIRE:["#ff4500","#ff6b00","#ffd700"],PURPLE:["#667eea","#764ba2"],CYAN:["#00d2ff","#3a7bd5"],EMERALD:["#11998e","#38ef7d"]},mt={type:I.GRADIENT,width:2,radius:12,duration:3,colors:_e.PRIMARY,glowSize:10,glowOpacity:.5},ye=class{constructor(e={}){this._config={...mt,...e},this._styleElement=null,this._animationId=`uc-border-${Math.random().toString(36).substr(2,9)}`}setType(e){Object.values(I).includes(e)&&(this._config.type=e)}setColors(e){this._config.colors=e}setGradientPreset(e){_e[e]&&(this._config.colors=_e[e])}generateStyles(){let{type:e}=this._config;switch(e){case I.GRADIENT:return this._generateGradientStyles();case I.GLOW:return this._generateGlowStyles();case I.PULSE:return this._generatePulseStyles();case I.RAINBOW:return this._generateRainbowStyles();case I.DASH:return this._generateDashStyles();case I.WAVE:return this._generateWaveStyles();case I.NEON:return this._generateNeonStyles();case I.SHIMMER:return this._generateShimmerStyles();default:return{}}}_generateGradientStyles(){let{width:e,radius:t,colors:i,duration:r}=this._config,n=`linear-gradient(90deg, ${i.join(", ")})`;return{position:"relative",borderRadius:`${t}px`,padding:`${e}px`,background:n,backgroundSize:"200% 200%",animation:`${this._animationId}-gradient ${r}s ease infinite`,keyframes:`
        @keyframes ${this._animationId}-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}}_generateGlowStyles(){let{width:e,radius:t,colors:i,glowSize:r,glowOpacity:n,duration:s}=this._config,o=i[0];return{position:"relative",borderRadius:`${t}px`,border:`${e}px solid ${o}`,boxShadow:`0 0 ${r}px ${o}`,animation:`${this._animationId}-glow ${s}s ease-in-out infinite`,keyframes:`
        @keyframes ${this._animationId}-glow {
          0%, 100% {
            box-shadow: 0 0 ${r}px ${o}${Math.round(n*255).toString(16)};
          }
          50% {
            box-shadow: 0 0 ${r*2}px ${o}, 0 0 ${r*3}px ${o}${Math.round(n*.5*255).toString(16)};
          }
        }
      `}}_generatePulseStyles(){let{width:e,radius:t,colors:i,duration:r}=this._config;return{position:"relative",borderRadius:`${t}px`,border:`${e}px solid ${i[0]}`,animation:`${this._animationId}-pulse ${r}s ease-in-out infinite`,keyframes:`
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
      `}}_generateRainbowStyles(){let{width:e,radius:t,duration:i}=this._config,r=_e.RAINBOW;return{position:"relative",borderRadius:`${t}px`,padding:`${e}px`,background:`linear-gradient(90deg, ${r.join(", ")})`,backgroundSize:"400% 400%",animation:`${this._animationId}-rainbow ${i}s linear infinite`,keyframes:`
        @keyframes ${this._animationId}-rainbow {
          0% { background-position: 0% 50%; }
          100% { background-position: 400% 50%; }
        }
      `}}_generateDashStyles(){let{width:e,radius:t,colors:i,duration:r}=this._config;return{position:"relative",borderRadius:`${t}px`,border:`${e}px dashed ${i[0]}`,animation:`${this._animationId}-dash ${r}s linear infinite`,keyframes:`
        @keyframes ${this._animationId}-dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `,svgAnimation:!0}}_generateWaveStyles(){let{width:e,radius:t,colors:i,duration:r}=this._config;return{position:"relative",borderRadius:`${t}px`,border:`${e}px solid transparent`,backgroundImage:`linear-gradient(var(--ha-card-background), var(--ha-card-background)), linear-gradient(90deg, ${i.join(", ")})`,backgroundOrigin:"border-box",backgroundClip:"padding-box, border-box",animation:`${this._animationId}-wave ${r}s ease-in-out infinite`,keyframes:`
        @keyframes ${this._animationId}-wave {
          0%, 100% { border-width: ${e}px; }
          50% { border-width: ${e+2}px; }
        }
      `}}_generateNeonStyles(){let{width:e,radius:t,colors:i,glowSize:r,duration:n}=this._config,s=i[0];return{position:"relative",borderRadius:`${t}px`,border:`${e}px solid ${s}`,boxShadow:`
        0 0 ${r/2}px ${s},
        0 0 ${r}px ${s},
        0 0 ${r*2}px ${s},
        inset 0 0 ${r/2}px ${s}
      `,animation:`${this._animationId}-neon ${n}s ease-in-out infinite alternate`,keyframes:`
        @keyframes ${this._animationId}-neon {
          from {
            box-shadow:
              0 0 ${r/2}px ${s},
              0 0 ${r}px ${s},
              0 0 ${r*2}px ${s},
              inset 0 0 ${r/2}px ${s};
          }
          to {
            box-shadow:
              0 0 ${r}px ${s},
              0 0 ${r*2}px ${s},
              0 0 ${r*3}px ${s},
              0 0 ${r*4}px ${s},
              inset 0 0 ${r}px ${s};
          }
        }
      `}}_generateShimmerStyles(){let{width:e,radius:t,colors:i,duration:r}=this._config;return{position:"relative",borderRadius:`${t}px`,padding:`${e}px`,background:`linear-gradient(90deg, transparent 0%, ${i[0]}40 50%, transparent 100%), ${i[0]}`,backgroundSize:"200% 100%, 100% 100%",animation:`${this._animationId}-shimmer ${r}s linear infinite`,keyframes:`
        @keyframes ${this._animationId}-shimmer {
          from { background-position: -200% 0, 0 0; }
          to { background-position: 200% 0, 0 0; }
        }
      `}}apply(e){let t=this.generateStyles();t.keyframes&&this._injectKeyframes(t.keyframes);for(let[i,r]of Object.entries(t))i!=="keyframes"&&i!=="svgAnimation"&&e.style.setProperty(i.replace(/[A-Z]/g,n=>`-${n.toLowerCase()}`),String(r));t.svgAnimation&&this._applySvgBorder(e),e.classList.add("uc-border-animated"),e.dataset.borderAnimation=this._config.type}_injectKeyframes(e){if(this._styleElement){this._styleElement.textContent=e;return}this._styleElement=document.createElement("style"),this._styleElement.textContent=e,this._styleElement.setAttribute("data-uc-border",this._animationId),document.head.appendChild(this._styleElement)}_applySvgBorder(e){let t=e.getBoundingClientRect(),{width:i,radius:r,colors:n,duration:s}=this._config,o=document.createElementNS("http://www.w3.org/2000/svg","svg");o.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: visible;
    `,o.innerHTML=`
      <rect 
        x="${i/2}" 
        y="${i/2}" 
        width="calc(100% - ${i}px)" 
        height="calc(100% - ${i}px)"
        rx="${r}"
        fill="none"
        stroke="${n[0]}"
        stroke-width="${i}"
        stroke-dasharray="10 5"
        stroke-linecap="round"
      >
        <animate 
          attributeName="stroke-dashoffset"
          from="0"
          to="-30"
          dur="${s}s"
          repeatCount="indefinite"
        />
      </rect>
    `,e.style.position="relative",e.appendChild(o)}remove(e){let t=["position","borderRadius","padding","background","backgroundSize","backgroundImage","backgroundOrigin","backgroundClip","border","boxShadow","animation"];for(let r of t)e.style[r]="";let i=e.querySelector("svg");i&&i.remove(),this._styleElement&&(this._styleElement.remove(),this._styleElement=null),e.classList.remove("uc-border-animated"),delete e.dataset.borderAnimation}static getStyles(){return`
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
    `}};var y={TRANSFORM:"transform",SHADOW:"shadow",GLOW:"glow",OVERLAY:"overlay",BORDER:"border",BACKGROUND:"background"},be={lift:{category:y.TRANSFORM,name:"Lift",description:"\u041F\u0440\u0438\u043F\u043E\u0434\u043D\u0438\u043C\u0430\u043D\u0438\u0435",styles:{transition:"transform 0.3s ease, box-shadow 0.3s ease",":hover":{transform:"translateY(-4px)",boxShadow:"0 12px 24px rgba(0, 0, 0, 0.15)"}}},scale:{category:y.TRANSFORM,name:"Scale",description:"\u0423\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u0438\u0435",styles:{transition:"transform 0.3s ease",":hover":{transform:"scale(1.02)"}}},tilt:{category:y.TRANSFORM,name:"Tilt",description:"\u041D\u0430\u043A\u043B\u043E\u043D",styles:{transition:"transform 0.3s ease",":hover":{transform:"perspective(1000px) rotateX(5deg) rotateY(5deg)"}},interactive:!0},float:{category:y.TRANSFORM,name:"Float",description:"\u041F\u043B\u0430\u0432\u0430\u043D\u0438\u0435",styles:{transition:"transform 0.3s ease, box-shadow 0.3s ease",":hover":{transform:"translateY(-8px) scale(1.01)",boxShadow:"0 20px 40px rgba(0, 0, 0, 0.2)"}}},push:{category:y.TRANSFORM,name:"Push",description:"\u0412\u0434\u0430\u0432\u043B\u0438\u0432\u0430\u043D\u0438\u0435",styles:{transition:"transform 0.2s ease, box-shadow 0.2s ease",":hover":{transform:"scale(0.98)",boxShadow:"inset 0 2px 4px rgba(0, 0, 0, 0.1)"}}},rotate:{category:y.TRANSFORM,name:"Rotate",description:"\u041B\u0451\u0433\u043A\u0438\u0439 \u043F\u043E\u0432\u043E\u0440\u043E\u0442",styles:{transition:"transform 0.3s ease",":hover":{transform:"rotate(1deg)"}}},shadowLift:{category:y.SHADOW,name:"Shadow Lift",description:"\u0422\u0435\u043D\u044C \u0441 \u043F\u043E\u0434\u044A\u0451\u043C\u043E\u043C",styles:{boxShadow:"0 4px 6px rgba(0, 0, 0, 0.1)",transition:"box-shadow 0.3s ease, transform 0.3s ease",":hover":{boxShadow:"0 14px 28px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)",transform:"translateY(-2px)"}}},shadowGrow:{category:y.SHADOW,name:"Shadow Grow",description:"\u0420\u0430\u0441\u0442\u0443\u0449\u0430\u044F \u0442\u0435\u043D\u044C",styles:{boxShadow:"0 2px 4px rgba(0, 0, 0, 0.1)",transition:"box-shadow 0.3s ease",":hover":{boxShadow:"0 8px 30px rgba(0, 0, 0, 0.2)"}}},shadowColor:{category:y.SHADOW,name:"Shadow Color",description:"\u0426\u0432\u0435\u0442\u043D\u0430\u044F \u0442\u0435\u043D\u044C",styles:{transition:"box-shadow 0.3s ease",":hover":{boxShadow:"0 10px 30px var(--primary-color, rgba(99, 102, 241, 0.3))"}}},shadowInset:{category:y.SHADOW,name:"Shadow Inset",description:"\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u0442\u0435\u043D\u044C",styles:{transition:"box-shadow 0.3s ease",":hover":{boxShadow:"inset 0 4px 8px rgba(0, 0, 0, 0.1)"}}},glow:{category:y.GLOW,name:"Glow",description:"\u0421\u0432\u0435\u0447\u0435\u043D\u0438\u0435",styles:{transition:"box-shadow 0.3s ease",":hover":{boxShadow:"0 0 20px var(--primary-color, rgba(99, 102, 241, 0.5))"}}},glowPulse:{category:y.GLOW,name:"Glow Pulse",description:"\u041F\u0443\u043B\u044C\u0441\u0438\u0440\u0443\u044E\u0449\u0435\u0435 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u0435",styles:{transition:"box-shadow 0.3s ease",":hover":{animation:"uc-hover-glow-pulse 1.5s ease-in-out infinite"}}},neon:{category:y.GLOW,name:"Neon",description:"\u041D\u0435\u043E\u043D\u043E\u0432\u043E\u0435 \u0441\u0432\u0435\u0447\u0435\u043D\u0438\u0435",styles:{transition:"box-shadow 0.3s ease, border-color 0.3s ease",":hover":{borderColor:"var(--primary-color)",boxShadow:`
          0 0 5px var(--primary-color),
          0 0 10px var(--primary-color),
          0 0 20px var(--primary-color),
          0 0 40px var(--primary-color)
        `}}},shine:{category:y.OVERLAY,name:"Shine",description:"\u0411\u043B\u0435\u0441\u043A",styles:{position:"relative",overflow:"hidden",":hover::after":{content:'""',position:"absolute",top:"-50%",left:"-50%",width:"200%",height:"200%",background:"linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",transform:"rotate(30deg)",animation:"uc-hover-shine 0.75s ease-out"}},requiresPseudo:!0},overlay:{category:y.OVERLAY,name:"Overlay",description:"\u0417\u0430\u0442\u0435\u043C\u043D\u0435\u043D\u0438\u0435",styles:{position:"relative",":hover::after":{content:'""',position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0, 0, 0, 0.1)",borderRadius:"inherit",pointerEvents:"none"}},requiresPseudo:!0},gradient:{category:y.OVERLAY,name:"Gradient",description:"\u0413\u0440\u0430\u0434\u0438\u0435\u043D\u0442\u043D\u043E\u0435 \u043D\u0430\u043B\u043E\u0436\u0435\u043D\u0438\u0435",styles:{position:"relative",":hover::after":{content:'""',position:"absolute",top:0,left:0,right:0,bottom:0,background:"linear-gradient(135deg, var(--primary-color, rgba(99, 102, 241, 0.1)) 0%, transparent 100%)",borderRadius:"inherit",pointerEvents:"none"}},requiresPseudo:!0},borderHighlight:{category:y.BORDER,name:"Border Highlight",description:"\u041F\u043E\u0434\u0441\u0432\u0435\u0442\u043A\u0430 \u0433\u0440\u0430\u043D\u0438\u0446\u044B",styles:{border:"2px solid transparent",transition:"border-color 0.3s ease",":hover":{borderColor:"var(--primary-color)"}}},borderGradient:{category:y.BORDER,name:"Border Gradient",description:"\u0413\u0440\u0430\u0434\u0438\u0435\u043D\u0442\u043D\u0430\u044F \u0433\u0440\u0430\u043D\u0438\u0446\u0430",styles:{position:"relative",":hover::before":{content:'""',position:"absolute",top:-2,left:-2,right:-2,bottom:-2,background:"linear-gradient(90deg, var(--primary-color), var(--accent-color, #6366f1))",borderRadius:"inherit",zIndex:-1}},requiresPseudo:!0},bgBrighten:{category:y.BACKGROUND,name:"Brighten",description:"\u041E\u0441\u0432\u0435\u0442\u043B\u0435\u043D\u0438\u0435 \u0444\u043E\u043D\u0430",styles:{transition:"filter 0.3s ease",":hover":{filter:"brightness(1.05)"}}},bgDarken:{category:y.BACKGROUND,name:"Darken",description:"\u0417\u0430\u0442\u0435\u043C\u043D\u0435\u043D\u0438\u0435 \u0444\u043E\u043D\u0430",styles:{transition:"filter 0.3s ease",":hover":{filter:"brightness(0.95)"}}},bgColor:{category:y.BACKGROUND,name:"Color Shift",description:"\u0421\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0446\u0432\u0435\u0442\u0430",styles:{transition:"background-color 0.3s ease",":hover":{backgroundColor:"var(--primary-color, rgba(99, 102, 241, 0.1))"}}}},ve=class{constructor(e,t={}){this._element=e,this._config={effect:"lift",duration:.3,customStyles:{},...t},this._styleElement=null,this._effectId=`uc-hover-${Math.random().toString(36).substr(2,9)}`}setEffect(e){be[e]&&(this._config.effect=e)}getEffect(){return be[this._config.effect]||be.lift}apply(){let e=this.getEffect();for(let[t,i]of Object.entries(e.styles))!t.startsWith(":")&&typeof i!="object"&&this._element.style.setProperty(t.replace(/([A-Z])/g,"-$1").toLowerCase(),String(i));this._injectStyles(e),this._element.classList.add("uc-hover-effect",this._effectId)}_injectStyles(e){this._styleElement&&this._styleElement.remove();let t=this._getSelectorStyles(e.styles[":hover"]),i=this._getSelectorStyles(e.styles[":hover::before"]),r=this._getSelectorStyles(e.styles[":hover::after"]),n="";Object.keys(t).length>0&&(n+=`.${this._effectId}:hover { ${this._objectToCSS(t)} }
`);let s=this._getSelectorStyles(e.styles["::before"]);(Object.keys(s).length>0||Object.keys(i).length>0)&&(n+=`.${this._effectId}::before { content: ''; ${this._objectToCSS(s)} }
`,n+=`.${this._effectId}:hover::before { ${this._objectToCSS(i)} }
`),Object.keys(r).length>0&&(n+=`.${this._effectId}::after { content: ''; position: absolute; opacity: 0; transition: opacity 0.3s ease; }
`,n+=`.${this._effectId}:hover::after { opacity: 1; ${this._objectToCSS(r)} }
`),this._styleElement=document.createElement("style"),this._styleElement.textContent=n,this._styleElement.setAttribute("data-uc-hover",this._effectId),document.head.appendChild(this._styleElement)}_objectToCSS(e){return Object.entries(e).filter(([t])=>!t.startsWith(":")).map(([t,i])=>`${t.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${i}`).join("; ")}_getSelectorStyles(e){return e&&typeof e=="object"?e:{}}remove(){this._element.classList.remove("uc-hover-effect",this._effectId),this._styleElement&&(this._styleElement.remove(),this._styleElement=null)}static applyTilt(e,t={}){let{max:i=10,perspective:r=1e3,scale:n=1.02}=t;e.style.transition="transform 0.1s ease-out",e.style.transformStyle="preserve-3d";let s=c=>{let l=e.getBoundingClientRect(),d=c.clientX-l.left,h=c.clientY-l.top,b=l.width/2,g=l.height/2,u=(h-g)/g*-i,C=(d-b)/b*i;e.style.transform=`perspective(${r}px) rotateX(${u}deg) rotateY(${C}deg) scale(${n})`},o=()=>{e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale(1)"};return e.addEventListener("mousemove",s),e.addEventListener("mouseleave",o),()=>{e.removeEventListener("mousemove",s),e.removeEventListener("mouseleave",o)}}static getStyles(){let e=[];for(let[t,i]of Object.entries(be)){let r=`uc-hover-${t}`,n={...i.styles};delete n[":hover"],delete n[":hover::before"],delete n[":hover::after"],e.push(`
        .${r} {
          ${Object.entries(n).filter(([s])=>!s.startsWith(":")).map(([s,o])=>`${s.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${o}`).join("; ")}
        }
      `),i.styles[":hover"]&&e.push(`
          .${r}:hover {
            ${Object.entries(i.styles[":hover"]).map(([s,o])=>`${s.replace(/([A-Z])/g,"-$1").toLowerCase()}: ${o}`).join("; ")}
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
`)}};var B={light:{name:"Light",type:"light",colors:{background:"#ffffff",surface:"#f5f5f5",primary:"#6366f1",secondary:"#8b5cf6",accent:"#06b6d4",text:"#1f2937",textSecondary:"#6b7280",border:"#e5e7eb",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6"}},paper:{name:"Paper",type:"light",colors:{background:"#faf8f5",surface:"#f5f2ed",primary:"#8b7355",secondary:"#a67c52",accent:"#c49a6c",text:"#3d3d3d",textSecondary:"#6b6b6b",border:"#e0dcd5",success:"#5d8a66",warning:"#c9a227",error:"#b54040",info:"#5a7fa6"}},cream:{name:"Cream",type:"light",colors:{background:"#fffdf7",surface:"#fff9e6",primary:"#d4a574",secondary:"#c49570",accent:"#e6c88a",text:"#4a4540",textSecondary:"#7d7267",border:"#ece4d4",success:"#7db47d",warning:"#e0b050",error:"#d47070",info:"#70a0c0"}},dark:{name:"Dark",type:"dark",colors:{background:"#1a1a2e",surface:"#16213e",primary:"#6366f1",secondary:"#8b5cf6",accent:"#06b6d4",text:"#f1f5f9",textSecondary:"#94a3b8",border:"#334155",success:"#10b981",warning:"#f59e0b",error:"#ef4444",info:"#3b82f6"}},midnight:{name:"Midnight",type:"dark",colors:{background:"#0f0f1a",surface:"#1a1a2e",primary:"#818cf8",secondary:"#a78bfa",accent:"#22d3ee",text:"#e2e8f0",textSecondary:"#94a3b8",border:"#2d2d44",success:"#34d399",warning:"#fbbf24",error:"#f87171",info:"#60a5fa"}},amoled:{name:"AMOLED",type:"dark",colors:{background:"#000000",surface:"#0a0a0a",primary:"#6366f1",secondary:"#8b5cf6",accent:"#06b6d4",text:"#ffffff",textSecondary:"#a1a1aa",border:"#27272a",success:"#22c55e",warning:"#eab308",error:"#ef4444",info:"#3b82f6"}},ocean:{name:"Ocean",type:"dark",colors:{background:"#0c1929",surface:"#132f4c",primary:"#00a9ff",secondary:"#0091ea",accent:"#00e5ff",text:"#e3f2fd",textSecondary:"#90caf9",border:"#1e4976",success:"#4caf50",warning:"#ffc107",error:"#ff5252",info:"#29b6f6"}},forest:{name:"Forest",type:"dark",colors:{background:"#1a2f1a",surface:"#2d4a2d",primary:"#4caf50",secondary:"#66bb6a",accent:"#a5d6a7",text:"#e8f5e9",textSecondary:"#a5d6a7",border:"#3d6b3d",success:"#81c784",warning:"#ffd54f",error:"#ef5350",info:"#4fc3f7"}},sunset:{name:"Sunset",type:"dark",colors:{background:"#2d1f2f",surface:"#4a2d4a",primary:"#ff6b6b",secondary:"#feca57",accent:"#ff9ff3",text:"#fff5f5",textSecondary:"#ffb8b8",border:"#5c3a5c",success:"#7bed9f",warning:"#ffeaa7",error:"#ff6b6b",info:"#74b9ff"}},lavender:{name:"Lavender",type:"light",colors:{background:"#f5f0ff",surface:"#ede4ff",primary:"#7c3aed",secondary:"#8b5cf6",accent:"#c4b5fd",text:"#3b0764",textSecondary:"#6b21a8",border:"#d8b4fe",success:"#22c55e",warning:"#f59e0b",error:"#ef4444",info:"#6366f1"}},rose:{name:"Rose",type:"light",colors:{background:"#fff5f7",surface:"#ffe4e6",primary:"#f43f5e",secondary:"#fb7185",accent:"#fda4af",text:"#4c0519",textSecondary:"#881337",border:"#fecdd3",success:"#10b981",warning:"#f59e0b",error:"#e11d48",info:"#3b82f6"}},neon:{name:"Neon",type:"dark",colors:{background:"#0a0a0a",surface:"#141414",primary:"#00ff88",secondary:"#ff00ff",accent:"#00ffff",text:"#ffffff",textSecondary:"#888888",border:"#333333",success:"#00ff88",warning:"#ffff00",error:"#ff0055",info:"#00ffff"}},cyberpunk:{name:"Cyberpunk",type:"dark",colors:{background:"#0d0221",surface:"#1a0a3e",primary:"#ff00ff",secondary:"#00ffff",accent:"#ffff00",text:"#ffffff",textSecondary:"#b794f6",border:"#3d1a78",success:"#00ff88",warning:"#ffff00",error:"#ff0055",info:"#00ffff"}},terminal:{name:"Terminal",type:"dark",colors:{background:"#0c0c0c",surface:"#1a1a1a",primary:"#00ff00",secondary:"#00cc00",accent:"#88ff88",text:"#00ff00",textSecondary:"#00aa00",border:"#004400",success:"#00ff00",warning:"#ffff00",error:"#ff0000",info:"#00ffff"}},sepia:{name:"Sepia",type:"light",colors:{background:"#f4ecd8",surface:"#e8dcc8",primary:"#8b4513",secondary:"#a0522d",accent:"#cd853f",text:"#3e2723",textSecondary:"#5d4037",border:"#d7cbb9",success:"#558b2f",warning:"#f9a825",error:"#c62828",info:"#0277bd"}}},xe=class{constructor(e={}){this._config={scheme:"light",customColors:{},...e}}setScheme(e){B[e]&&(this._config.scheme=e)}getScheme(){let e=B[this._config.scheme]||B.light;return{...e,colors:{...e.colors,...this._config.customColors}}}getColor(e){return this.getScheme().colors[e]||e}setCustomColor(e,t){this._config.customColors[e]=t}generateCSSVariables(){let e=this.getScheme(),t={};for(let[i,r]of Object.entries(e.colors)){t[`--uc-${this._kebabCase(i)}`]=r;let n=this._hexToRgb(r);n&&(t[`--uc-${this._kebabCase(i)}-rgb`]=`${n.r}, ${n.g}, ${n.b}`)}return t}apply(e){let t=this.generateCSSVariables();for(let[i,r]of Object.entries(t))e.style.setProperty(i,String(r));e.dataset.colorScheme=this._config.scheme,e.classList.add("uc-color-scheme")}remove(e){let t=this.getScheme();for(let i of Object.keys(t.colors))e.style.removeProperty(`--uc-${this._kebabCase(i)}`),e.style.removeProperty(`--uc-${this._kebabCase(i)}-rgb`);delete e.dataset.colorScheme,e.classList.remove("uc-color-scheme")}_kebabCase(e){return e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}_hexToRgb(e){if(!e.startsWith("#"))return null;let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}static getSchemeNames(){return Object.keys(B)}static getSchemesByType(e){let t={};for(let[i,r]of Object.entries(B))r.type===e&&(t[i]=r);return t}static getStyles(){let e=[];for(let[t,i]of Object.entries(B)){let r=Object.entries(i.colors).map(([n,s])=>`--uc-${n.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}: ${s}`).join(`;
    `);e.push(`
        .uc-scheme-${t},
        [data-color-scheme="${t}"] {
          ${r};
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
          ${Object.entries(B.dark.colors).map(([t,i])=>`--uc-${t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}: ${i}`).join(`;
    `)};
        }
      }

      @media (prefers-color-scheme: light) {
        .uc-scheme-auto {
          ${Object.entries(B.light.colors).map(([t,i])=>`--uc-${t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}: ${i}`).join(`;
    `)};
        }
      }
    `),e.join(`
`)}};var A={SPINNER:"spinner",DOTS:"dots",BARS:"bars",PULSE:"pulse",SKELETON:"skeleton",WAVE:"wave",RING:"ring",BOUNCE:"bounce",PROGRESS:"progress",SHIMMER:"shimmer"},V={XS:"xs",SM:"sm",MD:"md",LG:"lg",XL:"xl"},Y={[V.XS]:{size:16,stroke:2,dotSize:4},[V.SM]:{size:24,stroke:2.5,dotSize:6},[V.MD]:{size:32,stroke:3,dotSize:8},[V.LG]:{size:48,stroke:4,dotSize:10},[V.XL]:{size:64,stroke:5,dotSize:12}},we=class{constructor(e={}){this._config={type:A.SPINNER,size:V.MD,color:"var(--primary-color, #6366f1)",secondaryColor:"var(--primary-color-light, rgba(99, 102, 241, 0.2))",speed:1,...e}}setType(e){Object.values(A).includes(e)&&(this._config.type=e)}setSize(e){Object.values(V).includes(e)&&(this._config.size=e)}create(){let{type:e}=this._config;switch(e){case A.SPINNER:return this._createSpinner();case A.DOTS:return this._createDots();case A.BARS:return this._createBars();case A.PULSE:return this._createPulse();case A.SKELETON:return this._createSkeleton();case A.WAVE:return this._createWave();case A.RING:return this._createRing();case A.BOUNCE:return this._createBounce();case A.PROGRESS:return this._createProgress();case A.SHIMMER:return this._createShimmer();default:return this._createSpinner()}}_createSpinner(){let e=Y[this._config.size],{size:t,stroke:i}=e,{color:r,secondaryColor:n,speed:s}=this._config,o=document.createElement("div");return o.className="uc-loading uc-loading-spinner",o.innerHTML=`
      <svg width="${t}" height="${t}" viewBox="0 0 ${t} ${t}">
        <circle
          cx="${t/2}"
          cy="${t/2}"
          r="${(t-i)/2}"
          stroke="${n}"
          stroke-width="${i}"
          fill="none"
        />
        <circle
          cx="${t/2}"
          cy="${t/2}"
          r="${(t-i)/2}"
          stroke="${r}"
          stroke-width="${i}"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="${Math.PI*(t-i)*.75}"
          stroke-dashoffset="0"
          style="animation: uc-loading-spin ${1/s}s linear infinite; transform-origin: center;"
        />
      </svg>
    `,o}_createDots(){let e=Y[this._config.size],{dotSize:t}=e,{color:i,speed:r}=this._config,n=document.createElement("div");n.className="uc-loading uc-loading-dots",n.style.gap=`${t/2}px`;for(let s=0;s<3;s++){let o=document.createElement("span");o.style.cssText=`
        width: ${t}px;
        height: ${t}px;
        background: ${i};
        border-radius: 50%;
        animation: uc-loading-dots-bounce ${.6/r}s ease-in-out infinite;
        animation-delay: ${s*.1}s;
      `,n.appendChild(o)}return n}_createBars(){let e=Y[this._config.size],{size:t}=e,{color:i,speed:r}=this._config,n=document.createElement("div");n.className="uc-loading uc-loading-bars",n.style.height=`${t}px`,n.style.gap="3px";for(let s=0;s<5;s++){let o=document.createElement("span");o.style.cssText=`
        width: ${t/8}px;
        height: 100%;
        background: ${i};
        border-radius: 2px;
        animation: uc-loading-bars-scale ${1/r}s ease-in-out infinite;
        animation-delay: ${s*.1}s;
      `,n.appendChild(o)}return n}_createPulse(){let e=Y[this._config.size],{size:t}=e,{color:i,speed:r}=this._config,n=document.createElement("div");return n.className="uc-loading uc-loading-pulse",n.style.cssText=`
      width: ${t}px;
      height: ${t}px;
      background: ${i};
      border-radius: 50%;
      animation: uc-loading-pulse ${1/r}s ease-in-out infinite;
    `,n}_createSkeleton(){let{color:e,secondaryColor:t}=this._config,i=document.createElement("div");return i.className="uc-loading uc-loading-skeleton",i.style.cssText=`
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
    `,i}_createWave(){let e=Y[this._config.size],{size:t}=e,{color:i,speed:r}=this._config,n=document.createElement("div");n.className="uc-loading uc-loading-wave",n.style.cssText=`
      display: flex;
      align-items: center;
      gap: 4px;
      height: ${t}px;
    `;for(let s=0;s<5;s++){let o=document.createElement("span");o.style.cssText=`
        width: 4px;
        height: 40%;
        background: ${i};
        border-radius: 2px;
        animation: uc-loading-wave ${1.2/r}s ease-in-out infinite;
        animation-delay: ${s*.1}s;
      `,n.appendChild(o)}return n}_createRing(){let e=Y[this._config.size],{size:t,stroke:i}=e,{color:r,speed:n}=this._config,s=document.createElement("div");return s.className="uc-loading uc-loading-ring",s.style.cssText=`
      width: ${t}px;
      height: ${t}px;
      border: ${i}px solid ${r}30;
      border-top-color: ${r};
      border-radius: 50%;
      animation: uc-loading-spin ${1/n}s linear infinite;
    `,s}_createBounce(){let e=Y[this._config.size],{dotSize:t}=e,{color:i,speed:r}=this._config,n=document.createElement("div");n.className="uc-loading uc-loading-bounce",n.style.cssText=`
      display: flex;
      align-items: flex-end;
      gap: ${t/2}px;
      height: ${t*2}px;
    `;for(let s=0;s<3;s++){let o=document.createElement("span");o.style.cssText=`
        width: ${t}px;
        height: ${t}px;
        background: ${i};
        border-radius: 50%;
        animation: uc-loading-bounce ${.5/r}s ease-in-out infinite alternate;
        animation-delay: ${s*.1}s;
      `,n.appendChild(o)}return n}_createProgress(){let{color:e,secondaryColor:t,speed:i}=this._config,r=document.createElement("div");r.className="uc-loading uc-loading-progress",r.style.cssText=`
      width: 100%;
      height: 4px;
      background: ${t};
      border-radius: 2px;
      overflow: hidden;
    `;let n=document.createElement("div");return n.style.cssText=`
      width: 30%;
      height: 100%;
      background: ${e};
      border-radius: 2px;
      animation: uc-loading-progress ${1.5/i}s ease-in-out infinite;
    `,r.appendChild(n),r}_createShimmer(){let{color:e,secondaryColor:t}=this._config,i=document.createElement("div");return i.className="uc-loading uc-loading-shimmer",i.style.cssText=`
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
    `}};var E={CLICK:"click",TOGGLE:"toggle",SUCCESS:"success",ERROR:"error",NOTIFICATION:"notification",PROGRESS:"progress",FEEDBACK:"feedback"},je={ripple:{category:E.CLICK,name:"Ripple",description:"Material Design \u0432\u043E\u043B\u043D\u0430",trigger:"click"},pop:{category:E.CLICK,name:"Pop",description:"\u0411\u044B\u0441\u0442\u0440\u043E\u0435 \u0443\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u0438\u0435",trigger:"click",keyframes:`
      @keyframes uc-micro-pop {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
      }
    `,duration:200},press:{category:E.CLICK,name:"Press",description:"\u041D\u0430\u0436\u0430\u0442\u0438\u0435",trigger:"click",keyframes:`
      @keyframes uc-micro-press {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.97); }
      }
    `,duration:150},flip:{category:E.TOGGLE,name:"Flip",description:"3D \u043F\u0435\u0440\u0435\u0432\u043E\u0440\u043E\u0442",trigger:"toggle",keyframes:`
      @keyframes uc-micro-flip {
        0% { transform: perspective(400px) rotateY(0); }
        100% { transform: perspective(400px) rotateY(180deg); }
      }
    `,duration:400},slide:{category:E.TOGGLE,name:"Slide",description:"\u0421\u043A\u043E\u043B\u044C\u0436\u0435\u043D\u0438\u0435",trigger:"toggle",keyframes:`
      @keyframes uc-micro-slide-on {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      @keyframes uc-micro-slide-off {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
      }
    `,duration:200},morph:{category:E.TOGGLE,name:"Morph",description:"\u0422\u0440\u0430\u043D\u0441\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u0444\u043E\u0440\u043C\u044B",trigger:"toggle"},checkmark:{category:E.SUCCESS,name:"Checkmark",description:"\u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u0430\u044F \u0433\u0430\u043B\u043E\u0447\u043A\u0430",trigger:"success",svg:`
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
    `,duration:300},confetti:{category:E.SUCCESS,name:"Confetti",description:"\u041A\u043E\u043D\u0444\u0435\u0442\u0442\u0438",trigger:"success",duration:1e3},celebrate:{category:E.SUCCESS,name:"Celebrate",description:"\u041F\u0440\u0430\u0437\u0434\u043D\u043E\u0432\u0430\u043D\u0438\u0435",trigger:"success",keyframes:`
      @keyframes uc-micro-celebrate {
        0%, 100% { transform: scale(1) rotate(0); }
        25% { transform: scale(1.2) rotate(-5deg); }
        50% { transform: scale(1.2) rotate(5deg); }
        75% { transform: scale(1.1) rotate(-3deg); }
      }
    `,duration:500},shake:{category:E.ERROR,name:"Shake",description:"\u0422\u0440\u044F\u0441\u043A\u0430",trigger:"error",keyframes:`
      @keyframes uc-micro-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
    `,duration:500},cross:{category:E.ERROR,name:"Cross",description:"\u0410\u043D\u0438\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043A\u0440\u0435\u0441\u0442\u0438\u043A",trigger:"error",svg:`
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
    `,duration:300},bell:{category:E.NOTIFICATION,name:"Bell",description:"\u0417\u0432\u043E\u043D\u043E\u043A \u043A\u043E\u043B\u043E\u043A\u043E\u043B\u044C\u0447\u0438\u043A\u0430",trigger:"notification",keyframes:`
      @keyframes uc-micro-bell {
        0%, 100% { transform: rotate(0); }
        10%, 30% { transform: rotate(10deg); }
        20%, 40% { transform: rotate(-10deg); }
        50% { transform: rotate(5deg); }
        60% { transform: rotate(-5deg); }
        70% { transform: rotate(2deg); }
        80% { transform: rotate(-2deg); }
      }
    `,duration:600},badge:{category:E.NOTIFICATION,name:"Badge",description:"\u041F\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u0435 \u0431\u0435\u0439\u0434\u0436\u0430",trigger:"notification",keyframes:`
      @keyframes uc-micro-badge {
        0% { transform: scale(0); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
    `,duration:300},heartbeat:{category:E.FEEDBACK,name:"Heartbeat",description:"\u0421\u0435\u0440\u0434\u0446\u0435\u0431\u0438\u0435\u043D\u0438\u0435",trigger:"feedback",keyframes:`
      @keyframes uc-micro-heartbeat {
        0%, 100% { transform: scale(1); }
        14% { transform: scale(1.3); }
        28% { transform: scale(1); }
        42% { transform: scale(1.3); }
        70% { transform: scale(1); }
      }
    `,duration:800},thumb:{category:E.FEEDBACK,name:"Thumb",description:"\u041B\u0430\u0439\u043A",trigger:"feedback",keyframes:`
      @keyframes uc-micro-thumb {
        0% { transform: scale(1); }
        30% { transform: scale(1.2) rotate(-15deg); }
        50% { transform: scale(1.3) rotate(0deg); }
        70% { transform: scale(1.2) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); }
      }
    `,duration:500}},ke=class{constructor(){this._injectedStyles=new Set}play(e,t,i={}){let r=je[t];if(!r){console.warn(`[MicroInteractions] Unknown interaction: ${t}`);return}switch(r.keyframes&&!this._injectedStyles.has(t)&&this._injectStyles(t,r.keyframes),t){case"ripple":this._playRipple(e,i);break;case"confetti":this._playConfetti(e,i);break;case"checkmark":case"cross":this._playSvgAnimation(e,r,i);break;default:this._playKeyframeAnimation(e,r,i)}}_playRipple(e,t={}){let{x:i,y:r,color:n="var(--primary-color, rgba(99, 102, 241, 0.3))"}=t,s=e.getBoundingClientRect(),o=i!==void 0?i-s.left:s.width/2,c=r!==void 0?r-s.top:s.height/2,l=Math.max(s.width,s.height)*2,d=document.createElement("span");d.className="uc-ripple",d.style.cssText=`
      position: absolute;
      width: ${l}px;
      height: ${l}px;
      left: ${o-l/2}px;
      top: ${c-l/2}px;
      background: ${n};
      border-radius: 50%;
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
      animation: uc-micro-ripple 0.6s ease-out forwards;
    `,e.style.position="relative",e.style.overflow="hidden",e.appendChild(d),setTimeout(()=>d.remove(),600)}_playConfetti(e,t={}){let{count:i=30,colors:r=["#ff0","#f0f","#0ff","#f00","#0f0"]}=t,n=e.getBoundingClientRect(),s=document.createElement("div");s.className="uc-confetti-container",s.style.cssText=`
      position: fixed;
      top: ${n.top+n.height/2}px;
      left: ${n.left+n.width/2}px;
      pointer-events: none;
      z-index: 10000;
    `;for(let o=0;o<i;o++){let c=document.createElement("span"),l=r[Math.floor(Math.random()*r.length)],d=Math.random()*360*(Math.PI/180),h=50+Math.random()*100,b=Math.cos(d)*h,g=Math.sin(d)*h,u=Math.random()*360;c.style.cssText=`
        position: absolute;
        width: ${4+Math.random()*4}px;
        height: ${4+Math.random()*4}px;
        background: ${l};
        transform: rotate(${u}deg);
        animation: uc-confetti-fall 1s ease-out forwards;
        --x: ${b}px;
        --y: ${g}px;
      `,s.appendChild(c)}document.body.appendChild(s),setTimeout(()=>s.remove(),1e3)}_playSvgAnimation(e,t,i={}){let r=document.createElement("div");r.innerHTML=t.svg,r.style.cssText=`
      display: inline-flex;
      color: ${i.color||"currentColor"};
    `,r.querySelectorAll("path").forEach((s,o)=>{let c=s.getTotalLength();s.style.strokeDasharray=String(c),s.style.strokeDashoffset=String(c),s.style.animation=`uc-micro-draw ${t.duration}ms ease forwards`,s.style.animationDelay=`${o*100}ms`}),i.target?(i.target.innerHTML="",i.target.appendChild(r)):(e.appendChild(r),setTimeout(()=>r.remove(),t.duration+200))}_playKeyframeAnimation(e,t,i={}){let r=`uc-micro-${t.name.toLowerCase()}`,n=i.duration||t.duration;e.style.animation=`${r} ${n}ms ease`;let s=()=>{e.style.animation="",e.removeEventListener("animationend",s),i.onComplete?.()};e.addEventListener("animationend",s)}_injectStyles(e,t){let i=document.createElement("style");i.textContent=t,i.setAttribute("data-uc-micro",e),document.head.appendChild(i),this._injectedStyles.add(e)}bind(e,t,i,r={}){let n=s=>{let o={...r};s.clientX!==void 0&&(o.x=s.clientX,o.y=s.clientY),this.play(e,i,o)};return e.addEventListener(t,n),()=>e.removeEventListener(t,n)}static getStyles(){let e=[];for(let[t,i]of Object.entries(je))i.keyframes&&e.push(i.keyframes);return e.push(`
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
`)}};function ft(a,e="Unknown error"){return a instanceof Error&&typeof a.message=="string"&&a.message?a.message:e}var gt={GET:"GET",POST:"POST",PUT:"PUT",PATCH:"PATCH",DELETE:"DELETE"},X={RAW:"raw",VALUE:"value",TABLE:"table",LIST:"list",TEMPLATE:"template",CHART:"chart"},We={url:"",method:gt.GET,headers:{},body:null,refresh_interval:0,timeout:1e4,cache_ttl:6e4,display_format:X.VALUE,value_path:"",template:"",transform:null,allow_unsafe_html:!1,error_message:"\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445",loading_message:"\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...",show_timestamp:!1,authentication:null},Ee=class{constructor(e,t={}){this._providers=v(e),this._config={...We,...t},this._element=null,this._data=null,this._error=null,this._loading=!1,this._lastFetch=0,this._refreshInterval=null,this._cache=new Map,this._abortController=null}set hass(e){this._providers.setHass(e)}setConfig(e){this._config={...We,...e},this._stopAutoRefresh(),this._config.refresh_interval>0&&this._startAutoRefresh()}render(){return this._element=document.createElement("div"),this._element.className="uc-rest-widget",this._config.refresh_interval>0&&this._startAutoRefresh(),this._updateDisplay(),this._fetchData(),this._element}async _fetchData(){let{url:e,method:t,headers:i,body:r,timeout:n,cache_ttl:s}=this._config;if(!e){this._error="URL \u043D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D",this._updateDisplay();return}this._abortController&&this._abortController.abort(),this._abortController=new AbortController;let o=this._processTemplate(e),c=r?this._processTemplate(r):null,l={...i};if(this._config.authentication){let u=this._config.authentication;if(u.type==="bearer")l.Authorization=`Bearer ${u.token}`;else if(u.type==="basic"){let C=btoa(`${u.username}:${u.password}`);l.Authorization=`Basic ${C}`}else u.type==="api_key"&&(l[u.header||"X-API-Key"]=u.key)}let d=this._getCacheKey({method:t,url:o,body:c,headers:l}),h=this._cache.get(d);if(h&&Date.now()-h.timestamp<s){this._data=h.data,this._loading=!1,this._error=null,this._updateDisplay();return}this._loading=!0,this._error=null,this._updateDisplay();let b=!1,g=null;Number.isFinite(n)&&n>0&&(g=setTimeout(()=>{b=!0,this._abortController?.abort()},n));try{let u=await this._providers.http.request(o,{method:t,headers:l,body:c?JSON.stringify(c):null,signal:this._abortController.signal});if(!u.ok)throw new Error(`HTTP ${u.status}: ${u.statusText}`);let C=u.headers.get("content-type"),m;C?.includes("application/json")?m=await u.json():m=await u.text(),this._config.transform&&(m=this._applyTransform(m)),this._cache.set(d,{data:m,timestamp:Date.now()}),this._data=m,this._lastFetch=Date.now(),this._loading=!1,this._error=null}catch(u){if(u instanceof Error&&u.name==="AbortError"&&!b)return;this._loading=!1,this._error=b?`\u0422\u0430\u0439\u043C\u0430\u0443\u0442 \u0437\u0430\u043F\u0440\u043E\u0441\u0430 (${n}\u043C\u0441)`:ft(u,this._config.error_message),console.error("[RestApiWidget] Fetch error:",u)}finally{g&&clearTimeout(g)}this._updateDisplay()}_getCacheKey(e){let{method:t,url:i,body:r,headers:n}=e;return`${t}:${i}:${JSON.stringify(r||{})}:${JSON.stringify(n||{})}`}_processTemplate(e){if(typeof e=="string")return e.replace(/\{\{\s*(\w+\.\w+)\s*\}\}/g,(t,i)=>this._providers.entities.getState(i)?.state||t);if(typeof e=="object"&&e!==null){let t=Array.isArray(e)?[]:{};for(let[i,r]of Object.entries(e))t[i]=this._processTemplate(r);return t}return e}_applyTransform(e){let t=this._config.transform;if(typeof t=="function")return t(e);if(typeof t=="string"){let i=t.trim();return i?i.startsWith("path:")?this._getValueByPath(e,i.slice(5).trim()):/^[\w.[\]]+$/.test(i)?this._getValueByPath(e,i):(console.warn("[RestApiWidget] Unsafe string transform blocked. Use path:<json_path>."),e):e}return e}_getValueByPath(e,t){if(!t)return e;let i=t.split("."),r=e;for(let n of i){let s=n.match(/^(\w+)\[(\d+)\]$/);if(s?r=r?.[s[1]]?.[parseInt(s[2])]:r=r?.[n],r===void 0)return}return r}_updateDisplay(){if(!this._element)return;if(this._loading){this._element.innerHTML=`
        <div class="uc-rest-loading">
          <div class="uc-rest-spinner"></div>
          <span>${this._escapeHtml(this._config.loading_message)}</span>
        </div>
      `;return}if(this._error){this._element.innerHTML=`
        <div class="uc-rest-error">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <span>${this._escapeHtml(this._error)}</span>
          <button class="uc-rest-retry">\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button>
        </div>
      `,this._element.querySelector(".uc-rest-retry")?.addEventListener("click",()=>{this._fetchData()});return}let{display_format:e,value_path:t,template:i,show_timestamp:r}=this._config,n=this._getValueByPath(this._data,t),s="";switch(e){case X.RAW:s=`<pre class="uc-rest-raw">${this._escapeHtml(JSON.stringify(n,null,2))}</pre>`;break;case X.VALUE:s=`<div class="uc-rest-value">${this._formatValue(n)}</div>`;break;case X.TABLE:s=this._renderTable(n);break;case X.LIST:s=this._renderList(n);break;case X.TEMPLATE:s=this._renderTemplate(i,n);break;case X.CHART:s=this._renderChart(n);break;default:s=`<div class="uc-rest-value">${this._formatValue(n)}</div>`}if(r&&this._lastFetch){let o=new Date(this._lastFetch).toLocaleTimeString();s+=`<div class="uc-rest-timestamp">\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E: ${o}</div>`}this._element.innerHTML=s}_formatValue(e){let t="-";return e!=null&&(t=typeof e=="object"?JSON.stringify(e):String(e)),this._config.allow_unsafe_html?t:this._escapeHtml(t)}_renderTable(e){if(!e)return'<div class="uc-rest-empty">\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445</div>';let t=Array.isArray(e)?e:[e];if(t.length===0)return'<div class="uc-rest-empty">\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445</div>';let i=Object.keys(t[0]||{});return`
      <table class="uc-rest-table">
        <thead>
          <tr>
            ${i.map(r=>`<th>${this._formatValue(r)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${t.map(r=>`
            <tr>
              ${i.map(n=>`<td>${this._formatValue(r[n])}</td>`).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    `}_renderList(e){return e?`
      <ul class="uc-rest-list">
        ${(Array.isArray(e)?e:Object.entries(e).map(([i,r])=>({key:i,value:r}))).map(i=>typeof i=="object"?i.key!==void 0?`<li><strong>${this._escapeHtml(i.key)}:</strong> ${this._formatValue(i.value)}</li>`:`<li>${this._formatValue(i)}</li>`:`<li>${this._formatValue(i)}</li>`).join("")}
      </ul>
    `:'<div class="uc-rest-empty">\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445</div>'}_renderTemplate(e,t){if(!e)return this._formatValue(t);let i=e.replace(/\{\{\s*([\w.[\]]+)\s*\}\}/g,(r,n)=>{let s=this._getValueByPath(t,n);return s==null?"-":typeof s=="object"?JSON.stringify(s):String(s)});return this._config.allow_unsafe_html?i:`<div class="uc-rest-template">${this._escapeHtml(i)}</div>`}_renderChart(e){if(!Array.isArray(e)||e.length===0)return'<div class="uc-rest-empty">\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u0433\u0440\u0430\u0444\u0438\u043A\u0430</div>';let t=e.map(o=>typeof o=="number"?o:o.value||0),i=Math.max(...t),r=Math.min(...t),n=i-r||1;return`
      <svg class="uc-rest-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points="${t.map((o,c)=>{let l=t.length===1?50:c/(t.length-1)*100,d=100-(o-r)/n*100;return`${l},${d}`}).join(" ")}"
          fill="none"
          stroke="var(--primary-color)"
          stroke-width="2"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    `}_escapeHtml(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}_startAutoRefresh(){this._config.refresh_interval<=0||(this._stopAutoRefresh(),this._refreshInterval=setInterval(()=>{this._fetchData()},this._config.refresh_interval*1e3))}_stopAutoRefresh(){this._refreshInterval&&(clearInterval(this._refreshInterval),this._refreshInterval=null)}refresh(){this._cache.clear(),this._fetchData()}destroy(){this._stopAutoRefresh(),this._abortController&&this._abortController.abort(),this._cache.clear(),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
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
    `}};var ht={CONTAIN:"contain",COVER:"cover",FILL:"fill",NONE:"none",SCALE_DOWN:"scale-down"},T={CAMERA:"camera",IMAGE:"image",URL:"url",PERSON:"person",LOCAL:"local"},Ye={entity_id:"",url:"",fit:ht.CONTAIN,aspect_ratio:"16:9",refresh_interval:0,show_state:!1,show_name:!1,placeholder:"mdi:image",error_placeholder:"mdi:image-broken",lazy_load:!0,click_action:"more-info",border_radius:8},Se=class{constructor(e,t={}){this._providers=v(e),this._config={...Ye,...t},this._element=null,this._imgElement=null,this._refreshInterval=null,this._intersectionObserver=null,this._isVisible=!1,this._errorCount=0}set hass(e){this._providers.setHass(e),this._updateImage()}setConfig(e){this._config={...Ye,...e}}render(){return this._element=document.createElement("div"),this._element.className="uc-image-widget",this._applyAspectRatio(),this._element.innerHTML=`
      <div class="uc-image-container">
        <div class="uc-image-placeholder">
          <ha-icon icon="${this._config.placeholder}"></ha-icon>
        </div>
        <img class="uc-image" alt="" />
        ${this._config.show_name?'<div class="uc-image-name"></div>':""}
        ${this._config.show_state?'<div class="uc-image-state"></div>':""}
      </div>
    `,this._imgElement=this._element.querySelector(".uc-image"),this._imgElement.addEventListener("load",()=>this._onImageLoad()),this._imgElement.addEventListener("error",()=>this._onImageError()),this._config.click_action&&(this._element.addEventListener("click",()=>this._onClick()),this._element.style.cursor="pointer"),this._config.lazy_load?this._setupLazyLoad():this._loadImage(),this._config.refresh_interval>0&&this._startAutoRefresh(),this._element}_applyAspectRatio(){if(!this._element)return;let e=this._config.aspect_ratio;if(e==="auto")this._element.style.aspectRatio="auto";else if(e.includes(":")){let[t,i]=e.split(":").map(Number);this._element.style.aspectRatio=`${t}/${i}`}else e.includes("/")?this._element.style.aspectRatio=e:this._element.style.aspectRatio=e}_setupLazyLoad(){this._element&&(this._intersectionObserver=new IntersectionObserver(e=>{e[0].isIntersecting?(this._isVisible=!0,this._loadImage(),this._getSourceType()!==T.CAMERA&&this._intersectionObserver.disconnect()):this._isVisible=!1},{threshold:.1}),this._intersectionObserver.observe(this._element))}_getSourceType(){let{entity_id:e,url:t}=this._config;if(t)return t.startsWith("/local/")?T.LOCAL:T.URL;if(!e)return null;switch(e.split(".")[0]){case"camera":return T.CAMERA;case"image":return T.IMAGE;case"person":return T.PERSON;default:return null}}_getImageUrl(){let e=this._getSourceType(),{entity_id:t,url:i}=this._config;switch(e){case T.URL:return i;case T.LOCAL:return i;case T.CAMERA:return this._providers.entities.getState(t)?.attributes?.entity_picture||`/api/camera_proxy/${t}`;case T.IMAGE:let r=this._providers.entities.getState(t);return r?.attributes?.entity_picture||r?.attributes?.url;case T.PERSON:return this._providers.entities.getState(t)?.attributes?.entity_picture;default:return null}}_loadImage(){if(!this._imgElement||!this._element)return;let e=this._getImageUrl();if(!e){this._showPlaceholder();return}let t=e;if(this._getSourceType()===T.CAMERA){let i=e.includes("?")?"&":"?";t=`${e}${i}_=${Date.now()}`}this._imgElement.src=t,this._element.classList.add("loading")}_updateImage(){this._element&&(this._config.lazy_load&&!this._isVisible||(this._loadImage(),this._updateOverlays()))}_updateOverlays(){if(!this._element)return;let{entity_id:e,show_name:t,show_state:i}=this._config;if(!e)return;let r=this._providers.entities.getState(e);if(r){if(t){let n=this._element.querySelector(".uc-image-name");n&&(n.textContent=r.attributes?.friendly_name||e)}if(i){let n=this._element.querySelector(".uc-image-state");n&&(n.textContent=r.state)}}}_onImageLoad(){if(!this._element||!this._imgElement)return;this._element.classList.remove("loading","error"),this._element.classList.add("loaded"),this._imgElement.style.display="block",this._errorCount=0;let e=this._element.querySelector(".uc-image-placeholder");e&&(e.style.display="none")}_onImageError(){if(!this._element||!this._imgElement)return;this._element.classList.remove("loading","loaded"),this._element.classList.add("error"),this._imgElement.style.display="none",this._errorCount++;let e=this._element.querySelector(".uc-image-placeholder");e&&(e.style.display="flex",e.querySelector("ha-icon")?.setAttribute("icon",this._config.error_placeholder)),this._getSourceType()===T.CAMERA&&this._errorCount<3&&setTimeout(()=>this._loadImage(),2e3)}_showPlaceholder(){if(!this._element||!this._imgElement)return;this._imgElement.style.display="none";let e=this._element.querySelector(".uc-image-placeholder");e&&(e.style.display="flex")}_onClick(){if(!this._element)return;let{click_action:e,entity_id:t}=this._config;switch(e){case"more-info":if(t){let i=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}});this._element.dispatchEvent(i)}break;case"fullscreen":this._showFullscreen();break;case"none":break}}_showFullscreen(){let e=this._getImageUrl();if(!e)return;let t=document.createElement("div");t.className="uc-image-fullscreen",t.innerHTML=`
      <img src="${e}" />
      <button class="uc-image-fullscreen-close">\xD7</button>
    `,t.addEventListener("click",i=>{let r=i.target;(r===t||r?.classList.contains("uc-image-fullscreen-close"))&&t.remove()}),document.body.appendChild(t)}_startAutoRefresh(){this._stopAutoRefresh(),this._refreshInterval=setInterval(()=>{(this._isVisible||!this._config.lazy_load)&&this._loadImage()},this._config.refresh_interval*1e3)}_stopAutoRefresh(){this._refreshInterval&&(clearInterval(this._refreshInterval),this._refreshInterval=null)}destroy(){this._stopAutoRefresh(),this._intersectionObserver&&(this._intersectionObserver.disconnect(),this._intersectionObserver=null),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
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
    `}};var _t={COMPACT:"compact",NORMAL:"normal",FULL:"full"},Ve={entity_id:"",style:_t.NORMAL,show_artwork:!0,show_volume:!0,show_progress:!0,show_source:!1,artwork_border_radius:8,volume_step:5},Ce=class{constructor(e,t={}){this._providers=v(e),this._config={...Ve,...t},this._element=null,this._progressInterval=null}set hass(e){this._providers.setHass(e),this._update()}setConfig(e){this._config={...Ve,...e}}_getState(){return this._providers.entities.getState(this._config.entity_id)}render(){return this._element=document.createElement("div"),this._element.className=`uc-media-mini uc-media-${this._config.style}`,this._renderContent(),this._bindEvents(),this._startProgressUpdate(),this._element}_renderContent(){if(!this._element)return;let e=this._getState();if(!e){this._element.innerHTML=`
        <div class="uc-media-unavailable">
          <ha-icon icon="mdi:speaker-off"></ha-icon>
          <span>\u041D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E</span>
        </div>
      `;return}let t=e.state==="playing",i=e.state==="paused",r=e.state==="idle"||e.state==="off",n=e.attributes,s=this._config.show_artwork&&n.entity_picture?`
      <div class="uc-media-artwork" style="background-image: url('${n.entity_picture}')">
        ${t?'<div class="uc-media-playing-indicator"><span></span><span></span><span></span></div>':""}
      </div>
    `:"",o=n.media_title||n.friendly_name||this._config.entity_id,c=n.media_artist||n.media_album_name||n.app_name||"",l=`
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
    `,d=this._config.show_progress&&n.media_duration?`
      <div class="uc-media-progress">
        <span class="uc-media-time uc-media-time-current">${this._formatTime(n.media_position||0)}</span>
        <div class="uc-media-progress-bar">
          <div class="uc-media-progress-fill" style="width: ${this._getProgressPercent(n)}%"></div>
        </div>
        <span class="uc-media-time uc-media-time-duration">${this._formatTime(n.media_duration)}</span>
      </div>
    `:"",h=Math.round((n.volume_level||0)*100),b=this._config.show_volume?`
      <div class="uc-media-volume">
        <button class="uc-media-btn uc-media-btn-sm" data-action="volume_mute" title="${n.is_volume_muted?"\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0432\u0443\u043A":"\u0412\u044B\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0437\u0432\u0443\u043A"}">
          <ha-icon icon="mdi:${n.is_volume_muted?"volume-off":h>50?"volume-high":"volume-medium"}"></ha-icon>
        </button>
        <input type="range" class="uc-media-volume-slider" 
               min="0" max="100" value="${h}"
               data-action="volume_set" />
        <span class="uc-media-volume-value">${h}%</span>
      </div>
    `:"",g=this._config.show_source&&n.source_list?.length?`
      <div class="uc-media-source">
        <select class="uc-media-source-select" data-action="source_select">
          ${n.source_list.map(u=>`
            <option value="${u}" ${u===n.source?"selected":""}>${u}</option>
          `).join("")}
        </select>
      </div>
    `:"";this._element.innerHTML=`
      ${s}
      <div class="uc-media-content">
        <div class="uc-media-info">
          <div class="uc-media-title">${o}</div>
          ${c?`<div class="uc-media-artist">${c}</div>`:""}
        </div>
        ${l}
        ${d}
        ${b}
        ${g}
      </div>
    `,this._element.classList.toggle("is-playing",t),this._element.classList.toggle("is-paused",i),this._element.classList.toggle("is-idle",r)}_bindEvents(){if(!this._element)return;this._element.addEventListener("click",r=>{let n=r.target?.closest("[data-action]");n&&this._handleAction(n.dataset.action)});let e=this._element.querySelector(".uc-media-volume-slider");e&&e.addEventListener("input",r=>{this._setVolume(parseInt(r.target?.value||"0",10)/100)});let t=this._element.querySelector(".uc-media-source-select");t&&t.addEventListener("change",r=>{this._selectSource(r.target?.value)});let i=this._element.querySelector(".uc-media-progress-bar");i&&i.addEventListener("click",r=>{let n=i.getBoundingClientRect(),s=(r.clientX-n.left)/n.width;this._seek(s)})}_handleAction(e){let t=this._config.entity_id;switch(e){case"play_pause":this._providers.services.call("media_player","media_play_pause",{entity_id:t});break;case"prev":this._providers.services.call("media_player","media_previous_track",{entity_id:t});break;case"next":this._providers.services.call("media_player","media_next_track",{entity_id:t});break;case"volume_mute":this._providers.services.call("media_player","volume_mute",{entity_id:t,is_volume_muted:!this._getState()?.attributes?.is_volume_muted});break}}_setVolume(e){this._providers.services.call("media_player","volume_set",{entity_id:this._config.entity_id,volume_level:Math.max(0,Math.min(1,e))})}_selectSource(e){this._providers.services.call("media_player","select_source",{entity_id:this._config.entity_id,source:e})}_seek(e){let i=this._getState()?.attributes?.media_duration;i&&this._providers.services.call("media_player","media_seek",{entity_id:this._config.entity_id,seek_position:i*e})}_getProgressPercent(e){return!e.media_duration||!e.media_position?0:Math.min(100,e.media_position/e.media_duration*100)}_formatTime(e){let t=Math.floor(e/60),i=Math.floor(e%60);return`${t}:${i.toString().padStart(2,"0")}`}_startProgressUpdate(){this._stopProgressUpdate(),this._progressInterval=setInterval(()=>{this._getState()?.state==="playing"&&this._updateProgress()},1e3)}_stopProgressUpdate(){this._progressInterval&&(clearInterval(this._progressInterval),this._progressInterval=null)}_updateProgress(){let e=this._getState();if(!e||!this._element)return;let t=e.attributes,i=this._element.querySelector(".uc-media-progress-fill");i&&(i.style.width=`${this._getProgressPercent(t)}%`);let r=this._element.querySelector(".uc-media-time-current");if(r&&t.media_position!==void 0){let n=t.media_position+1;r.textContent=this._formatTime(Math.min(n,t.media_duration||n))}}_update(){this._element&&(this._renderContent(),this._bindEvents())}destroy(){this._stopProgressUpdate(),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
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
    `}};var M={INFO:"info",WARNING:"warning",ERROR:"error",SUCCESS:"success"},Xe={max_items:10,show_timestamp:!0,show_source:!0,show_actions:!0,auto_dismiss:0,group_by_source:!1,filter_sources:[],exclude_sources:[],compact:!1},Te=class{constructor(e,t={}){this._providers=v(e),this._config={...Xe,...t},this._element=null,this._notifications=[],this._dismissedIds=new Set,this._unsubscribe=null,this._subscriptionEpoch=0}set hass(e){this._providers.setHass(e),this._loadNotifications(),this._subscribeToUpdates()}setConfig(e){this._config={...Xe,...e}}render(){return this._element=document.createElement("div"),this._element.className=`uc-notifications ${this._config.compact?"compact":""}`,this._loadNotifications(),this._subscribeToUpdates(),this._element}async _loadNotifications(){try{let e=await this._providers.notifications.list(),t=[];Array.isArray(e)&&(t=e.map(i=>({id:i.id,title:i.title,message:i.message,created_at:new Date(i.created_at),source:i.source||"persistent_notification",type:this._detectType(i),dismissible:i.dismissible!==!1}))),t=this._filterNotifications(t),t.sort((i,r)=>r.created_at.getTime()-i.created_at.getTime()),this._notifications=t.slice(0,this._config.max_items),this._renderNotifications()}catch(e){console.error("[NotificationCenter] Error loading notifications:",e),this._renderError()}}_subscribeToUpdates(){this._subscriptionEpoch+=1;let e=this._subscriptionEpoch;this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=null),Promise.resolve(this._providers.notifications.subscribe(()=>{this._loadNotifications()})).then(t=>{if(e!==this._subscriptionEpoch){typeof t=="function"&&t();return}this._unsubscribe=typeof t=="function"?t:null}).catch(t=>{console.warn("[NotificationCenter] Notification subscription failed:",t)})}_filterNotifications(e){let t=e;return t=t.filter(i=>!this._dismissedIds.has(i.id)),this._config.filter_sources.length>0&&(t=t.filter(i=>this._config.filter_sources.includes(i.source))),this._config.exclude_sources.length>0&&(t=t.filter(i=>!this._config.exclude_sources.includes(i.source))),t}_detectType(e){let t=(e.message||"").toLowerCase(),i=(e.title||"").toLowerCase(),r=t+" "+i;return r.includes("error")||r.includes("\u043E\u0448\u0438\u0431\u043A\u0430")||r.includes("failed")?M.ERROR:r.includes("warning")||r.includes("\u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435")||r.includes("\u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435")?M.WARNING:r.includes("success")||r.includes("\u0443\u0441\u043F\u0435\u0448\u043D\u043E")||r.includes("\u0433\u043E\u0442\u043E\u0432\u043E")?M.SUCCESS:M.INFO}_renderNotifications(){if(!this._element)return;if(this._notifications.length===0){this._element.innerHTML=`
        <div class="uc-notifications-empty">
          <ha-icon icon="mdi:bell-check"></ha-icon>
          <span>\u041D\u0435\u0442 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0439</span>
        </div>
      `;return}let e=this._config.group_by_source?this._groupBySource(this._notifications):{all:this._notifications},t="";for(let[i,r]of Object.entries(e))this._config.group_by_source&&i!=="all"&&(t+=`<div class="uc-notifications-group-header">${i}</div>`),t+=r.map(n=>this._renderNotification(n)).join("");this._element.innerHTML=`
      <div class="uc-notifications-list">
        ${t}
      </div>
      ${this._notifications.length>0?`
        <div class="uc-notifications-footer">
          <button class="uc-notifications-clear-all">\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435</button>
        </div>
      `:""}
    `,this._bindEvents()}_renderNotification(e){let{show_timestamp:t,show_source:i,show_actions:r,compact:n}=this._config,s=this._getTypeIcon(e.type),o=`uc-notification-${e.type}`,c=this._formatTimeAgo(e.created_at);return`
      <div class="uc-notification ${o}" data-id="${e.id}">
        <div class="uc-notification-icon">
          <ha-icon icon="${s}"></ha-icon>
        </div>
        <div class="uc-notification-content">
          ${e.title?`<div class="uc-notification-title">${e.title}</div>`:""}
          <div class="uc-notification-message">${e.message}</div>
          <div class="uc-notification-meta">
            ${t?`<span class="uc-notification-time">${c}</span>`:""}
            ${i?`<span class="uc-notification-source">${e.source}</span>`:""}
          </div>
        </div>
        ${e.dismissible&&r?`
          <button class="uc-notification-dismiss" data-action="dismiss" title="\u0421\u043A\u0440\u044B\u0442\u044C">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        `:""}
      </div>
    `}_renderError(){this._element&&(this._element.innerHTML=`
      <div class="uc-notifications-error">
        <ha-icon icon="mdi:alert-circle"></ha-icon>
        <span>\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438</span>
        <button class="uc-notifications-retry">\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C</button>
      </div>
    `,this._element.querySelector(".uc-notifications-retry")?.addEventListener("click",()=>{this._loadNotifications()}))}_groupBySource(e){let t={};for(let i of e){let r=i.source||"other";t[r]||(t[r]=[]),t[r].push(i)}return t}_getTypeIcon(e){return{[M.INFO]:"mdi:information",[M.WARNING]:"mdi:alert",[M.ERROR]:"mdi:alert-circle",[M.SUCCESS]:"mdi:check-circle"}[e]||"mdi:bell"}_formatTimeAgo(e){let i=new Date().getTime()-e.getTime(),r=Math.floor(i/1e3),n=Math.floor(r/60),s=Math.floor(n/60),o=Math.floor(s/24);return o>0?`${o} \u0434. \u043D\u0430\u0437\u0430\u0434`:s>0?`${s} \u0447. \u043D\u0430\u0437\u0430\u0434`:n>0?`${n} \u043C\u0438\u043D. \u043D\u0430\u0437\u0430\u0434`:"\u0442\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E"}_bindEvents(){this._element.querySelectorAll('[data-action="dismiss"]').forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();let r=e.closest(".uc-notification")?.dataset.id;r&&this._dismissNotification(r)})}),this._element.querySelector(".uc-notifications-clear-all")?.addEventListener("click",()=>{this._clearAll()}),this._element.querySelectorAll(".uc-notification").forEach(e=>{e.addEventListener("click",()=>{let t=e.dataset.id;this._onNotificationClick(t)})})}async _dismissNotification(e){try{await this._providers.notifications.dismiss(e)}catch{}this._dismissedIds.add(e);let t=this._element.querySelector(`[data-id="${e}"]`);t&&(t.style.animation="uc-notification-dismiss 0.3s ease forwards",setTimeout(()=>{this._notifications=this._notifications.filter(i=>i.id!==e),this._renderNotifications()},300))}async _clearAll(){for(let e of this._notifications)if(e.dismissible){try{await this._providers.notifications.dismiss(e.id)}catch{}this._dismissedIds.add(e.id)}this._notifications=[],this._renderNotifications()}_onNotificationClick(e){}addNotification(e){let t={id:e.id||`custom-${Date.now()}`,title:e.title,message:e.message,created_at:new Date,source:e.source||"custom",type:e.type||M.INFO,dismissible:e.dismissible!==!1};this._notifications.unshift(t),this._notifications.length>this._config.max_items&&this._notifications.pop(),this._renderNotifications(),this._config.auto_dismiss>0&&setTimeout(()=>{this._dismissNotification(t.id)},this._config.auto_dismiss)}destroy(){this._subscriptionEpoch+=1,this._unsubscribe&&(this._unsubscribe(),this._unsubscribe=null),this._element&&(this._element.remove(),this._element=null)}static getStyles(){return`
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
    `}};var Ti={EntityPreview:re,Alerts:ne,QuickActions:se,Timer:oe,IconMapping:ae,AnimationPresets:ce,WebSocketOptimizer:ee,getWebSocketOptimizer:Ue,createThrottledCallback:Ge,createDebouncedCallback:Be},Ai={CardLinking:le,AutoGrouping:de,CompactMode:ue},$i={Glassmorphism:me,Neumorphism:ge,BackgroundPatterns:he,BorderAnimations:ye,HoverEffects:ve,ColorSchemes:xe,LoadingVariants:we,MicroInteractions:ke},Li={RestApiWidget:Ee,ImageEntity:Se,MediaPlayerMini:Ce,NotificationCenter:Te},Ii={ALERT_TYPES:D,ALERT_CONDITIONS:$,TIMER_MODES:w,DISPLAY_FORMATS:j,ANIMATION_CATEGORIES:p,PRESETS:H,PRESET_MAPPINGS:q,UPDATE_STRATEGIES:z,UPDATE_PRIORITY:R};export{Ti as advanced,Ai as complex,Ii as constants,$i as themes,Li as widgets};
