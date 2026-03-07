var c={DEBUG:"debug",INFO:"info",WARN:"warn",ERROR:"error"},p={LIFECYCLE:"lifecycle",STATE:"state",USER:"user",RENDER:"render",NETWORK:"network",ERROR:"error",PERFORMANCE:"performance"},_={enabled:!1,maxEntries:500,persistToStorage:!1,storageKey:"uc_event_log",levels:Object.values(c),categories:Object.values(p),showTimestamp:!0,showCategory:!0,groupSimilar:!0,groupTimeout:1e3},g=class{constructor(e={}){this._config={..._,...e},this._entries=[],this._listeners=new Set,this._groupedEvents=new Map,this._panel=null,this._isVisible=!1}enable(){this._config.enabled=!0,this._loadFromStorage()}disable(){this._config.enabled=!1}isEnabled(){return this._config.enabled}log(e,t,r,n={}){if(!this._config.enabled||!this._config.levels.includes(e)||!this._config.categories.includes(t))return;let i={id:this._generateId(),timestamp:Date.now(),level:e,category:t,message:r,data:n,stack:e===c.ERROR&&new Error().stack||null,count:1};if(this._config.groupSimilar){let o=`${t}:${r}`,s=this._groupedEvents.get(o);if(s&&Date.now()-s.lastTime<this._config.groupTimeout){s.count++,s.lastTime=Date.now(),s.entry.count=s.count,this._notifyListeners("update",s.entry);return}this._groupedEvents.set(o,{count:1,lastTime:Date.now(),entry:i}),setTimeout(()=>this._groupedEvents.delete(o),this._config.groupTimeout*2)}this._entries.push(i),this._entries.length>this._config.maxEntries&&this._entries.shift(),this._config.persistToStorage&&this._saveToStorage(),this._notifyListeners("add",i),this._logToConsole(i)}debug(e,t,r){this.log(c.DEBUG,e,t,r)}info(e,t,r){this.log(c.INFO,e,t,r)}warn(e,t,r){this.log(c.WARN,e,t,r)}error(e,t,r){this.log(c.ERROR,e,t,r)}lifecycle(e,t={}){this.info(p.LIFECYCLE,e,t)}stateChange(e,t,r){this.debug(p.STATE,`State changed: ${e}`,{entityId:e,oldState:t,newState:r,changed:t!==r})}userAction(e,t={}){this.info(p.USER,e,t)}render(e,t){this.debug(p.RENDER,`Rendered: ${e}`,{component:e,duration:`${t.toFixed(2)}ms`})}_generateId(){return`${Date.now()}-${Math.random().toString(36).substr(2,9)}`}_logToConsole(e){let t=`[UC:${e.category}]`,r=this._getConsoleStyle(e.level);switch(e.level){case c.DEBUG:console.debug(`%c${t}`,r,e.message,e.data);break;case c.INFO:console.info(`%c${t}`,r,e.message,e.data);break;case c.WARN:console.warn(`%c${t}`,r,e.message,e.data);break;case c.ERROR:console.error(`%c${t}`,r,e.message,e.data),e.stack&&console.error(e.stack);break}}_getConsoleStyle(e){return{[c.DEBUG]:"color: #888",[c.INFO]:"color: #2196f3",[c.WARN]:"color: #ff9800",[c.ERROR]:"color: #f44336; font-weight: bold"}[e]||""}addListener(e){this._listeners.add(e)}removeListener(e){this._listeners.delete(e)}_notifyListeners(e,t){for(let r of this._listeners)try{r(e,t)}catch(n){console.error("[EventLogger] Listener error:",n)}}_loadFromStorage(){if(this._config.persistToStorage)try{let e=localStorage.getItem(this._config.storageKey);e&&(this._entries=JSON.parse(e))}catch(e){console.warn("[EventLogger] Failed to load from storage:",e)}}_saveToStorage(){try{localStorage.setItem(this._config.storageKey,JSON.stringify(this._entries))}catch(e){console.warn("[EventLogger] Failed to save to storage:",e)}}getEntries(e={}){let t=[...this._entries];if(e.level&&(t=t.filter(r=>r.level===e.level)),e.category&&(t=t.filter(r=>r.category===e.category)),e.search){let r=e.search.toLowerCase();t=t.filter(n=>n.message.toLowerCase().includes(r)||JSON.stringify(n.data).toLowerCase().includes(r))}return t}clear(){this._entries=[],this._groupedEvents.clear(),this._config.persistToStorage&&localStorage.removeItem(this._config.storageKey),this._notifyListeners("clear",null)}export(){return JSON.stringify(this._entries,null,2)}showPanel(){if(this._panel){this._panel.style.display="block",this._isVisible=!0;return}this._panel=document.createElement("div"),this._panel.className="uc-event-logger-panel",this._panel.innerHTML=`
      <div class="uc-logger-header">
        <span class="uc-logger-title">Event Logger</span>
        <div class="uc-logger-controls">
          <select class="uc-logger-filter-level">
            <option value="">All Levels</option>
            ${Object.values(c).map(e=>`<option value="${e}">${e}</option>`).join("")}
          </select>
          <select class="uc-logger-filter-category">
            <option value="">All Categories</option>
            ${Object.values(p).map(e=>`<option value="${e}">${e}</option>`).join("")}
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
    `,document.body.appendChild(this._panel),this._isVisible=!0,this._renderEntries(),this._panel.querySelector(".uc-logger-close").addEventListener("click",()=>this.hidePanel()),this._panel.querySelector(".uc-logger-clear").addEventListener("click",()=>{this.clear(),this._renderEntries()}),this._panel.querySelector(".uc-logger-export").addEventListener("click",()=>this._exportToFile()),this._panel.querySelectorAll("select").forEach(e=>{e.addEventListener("change",()=>this._renderEntries())}),this.addListener(()=>this._renderEntries())}hidePanel(){this._panel&&(this._panel.style.display="none",this._isVisible=!1)}togglePanel(){this._isVisible?this.hidePanel():this.showPanel()}_renderEntries(){if(!this._panel)return;let e=this._panel.querySelector(".uc-logger-entries"),t=this._panel.querySelector(".uc-logger-filter-level")?.value||"",r=this._panel.querySelector(".uc-logger-filter-category")?.value||"";if(!e)return;let n=this.getEntries({level:t||void 0,category:r||void 0});e.innerHTML=n.reverse().map(i=>`
      <div class="uc-logger-entry uc-logger-${i.level}">
        <span class="uc-logger-time">${new Date(i.timestamp).toLocaleTimeString()}</span>
        <span class="uc-logger-level">${i.level}</span>
        <span class="uc-logger-category">${i.category}</span>
        <span class="uc-logger-message">${i.message}</span>
        ${i.count>1?`<span class="uc-logger-count">\xD7${i.count}</span>`:""}
        ${Object.keys(i.data).length>0?`
          <details class="uc-logger-data">
            <summary>Data</summary>
            <pre>${JSON.stringify(i.data,null,2)}</pre>
          </details>
        `:""}
      </div>
    `).join(""),e.scrollTop=0}_exportToFile(){let e=this.export(),t=new Blob([e],{type:"application/json"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`uc-events-${new Date().toISOString().split("T")[0]}.json`,n.click(),URL.revokeObjectURL(r)}static getStyles(){return`
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
    `}};function m(d,e,t={},r={}){let n=new CustomEvent(e,{bubbles:r.bubbles!==!1,cancelable:r.cancelable!==!1,composed:r.composed!==!1,detail:t});return d.dispatchEvent(n),n}var y={enabled:!1,watchHass:!0,watchConfig:!0,watchInternal:!0,highlightChanges:!0,changeHighlightDuration:1e3},h=class{constructor(e,t={}){this._cardElement=e,this._config={...y,...t},this._panel=null,this._isVisible=!1,this._state={hass:null,config:null,internal:{}},this._previousState={},this._watchers=new Map,this._updateInterval=null}enable(){this._config.enabled=!0,this._startWatching()}disable(){this._config.enabled=!1,this._stopWatching()}setHass(e){this._state.hass=e,this._checkChanges("hass")}setConfig(e){this._state.config=e,this._checkChanges("config")}setInternal(e,t){this._state.internal[e]=t,this._checkChanges(`internal.${e}`)}get(e){return this._getByPath(this._state,e)}watch(e,t){this._watchers.has(e)||this._watchers.set(e,new Set),this._watchers.get(e).add(t)}unwatch(e,t){let r=this._watchers.get(e);r&&r.delete(t)}_checkChanges(e){if(!this._config.enabled)return;let t=this.get(e),r=this._getByPath(this._previousState,e);if(JSON.stringify(t)!==JSON.stringify(r)){for(let[n,i]of this._watchers)if(e.startsWith(n)||n.startsWith(e))for(let o of i)try{o(t,r,e)}catch(s){console.error("[StateInspector] Watcher error:",s)}this._setByPath(this._previousState,e,JSON.parse(JSON.stringify(t))),this._isVisible&&this._updatePanel(e)}}_getByPath(e,t){return t.split(".").reduce((r,n)=>r?.[n],e)}_setByPath(e,t,r){let n=t.split("."),i=n.pop(),o=n.reduce((s,a)=>(s[a]||(s[a]={}),s[a]),e);o[i]=r}_startWatching(){this._stopWatching(),this._updateInterval=setInterval(()=>{this._isVisible&&this._renderPanel()},1e3)}_stopWatching(){this._updateInterval&&(clearInterval(this._updateInterval),this._updateInterval=null)}showPanel(){if(this._panel){this._panel.style.display="flex",this._isVisible=!0,this._renderPanel();return}this._panel=document.createElement("div"),this._panel.className="uc-state-inspector-panel",this._panel.innerHTML=`
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
    `,document.body.appendChild(this._panel),this._isVisible=!0,this._panel.querySelector(".uc-inspector-close")?.addEventListener("click",()=>this.hidePanel()),this._panel.querySelector(".uc-inspector-refresh")?.addEventListener("click",()=>this._renderPanel()),this._panel.querySelector(".uc-inspector-copy")?.addEventListener("click",()=>this._copyState()),this._panel.querySelectorAll(".uc-inspector-tab").forEach(e=>{e.addEventListener("click",()=>{this._panel.querySelectorAll(".uc-inspector-tab").forEach(t=>t.classList.remove("active")),e.classList.add("active"),this._renderPanel()})}),this._panel.querySelector(".uc-inspector-search")?.addEventListener("input",e=>{this._renderPanel(e.target?.value||"")}),this._renderPanel()}hidePanel(){this._panel&&(this._panel.style.display="none",this._isVisible=!1)}togglePanel(){this._isVisible?this.hidePanel():this.showPanel()}_renderPanel(e=""){if(!this._panel)return;let t=this._panel.querySelector(".uc-inspector-tab.active")?.dataset.tab||"config",r=this._panel.querySelector(".uc-inspector-content");if(!r)return;let n;switch(t){case"config":n=this._state.config;break;case"hass":n=this._getHassInfo();break;case"internal":n=this._state.internal;break;case"entities":n=this._getEntitiesInfo();break}r.innerHTML=this._renderObject(n,"",e),r.querySelectorAll(".uc-inspector-key").forEach(i=>{i.addEventListener("click",()=>{let o=i.nextElementSibling;o?.classList.contains("uc-inspector-children")&&(o.classList.toggle("collapsed"),i.classList.toggle("collapsed"))})}),r.querySelectorAll(".uc-inspector-value[contenteditable]").forEach(i=>{i.addEventListener("blur",()=>{let o=i.dataset.path||"",s=this._parseValue(i.textContent||"");this._setValue(o,s)})})}_updatePanel(e){if(!this._panel||!this._isVisible)return;let t=this._panel.querySelector(`[data-path="${e}"]`);t&&this._config.highlightChanges&&(t.classList.add("changed"),setTimeout(()=>{t.classList.remove("changed")},this._config.changeHighlightDuration)),this._renderPanel()}_renderObject(e,t="",r="",n=0){if(e===null)return'<span class="uc-inspector-null">null</span>';if(e===void 0)return'<span class="uc-inspector-undefined">undefined</span>';if(typeof e!="object")return this._renderPrimitive(e,t);if(Array.isArray(e)){if(e.length===0)return'<span class="uc-inspector-array">[]</span>';let s=e.map((a,l)=>{let b=t?`${t}[${l}]`:`[${l}]`;return`
          <div class="uc-inspector-item">
            <span class="uc-inspector-index">${l}:</span>
            ${this._renderObject(a,b,r,n+1)}
          </div>
        `}).join("");return`
        <span class="uc-inspector-array-bracket">[</span>
        <div class="uc-inspector-children ${n>1?"collapsed":""}">${s}</div>
        <span class="uc-inspector-array-bracket">]</span>
      `}let i=Object.keys(e);if(i.length===0)return'<span class="uc-inspector-object">{}</span>';let o=i.filter(s=>r?(t?`${t}.${s}`:s).toLowerCase().includes(r.toLowerCase())||JSON.stringify(e[s]).toLowerCase().includes(r.toLowerCase()):!0).map(s=>{let a=t?`${t}.${s}`:s;return`
          <div class="uc-inspector-item">
            <span class="uc-inspector-key ${n>1?"collapsed":""}">${s}:</span>
            ${this._renderObject(e[s],a,r,n+1)}
          </div>
        `}).join("");return`
      <span class="uc-inspector-object-bracket">{</span>
      <div class="uc-inspector-children ${n>1?"collapsed":""}">${o}</div>
      <span class="uc-inspector-object-bracket">}</span>
    `}_renderPrimitive(e,t){let r=typeof e,n=t.startsWith("internal")||t.startsWith("config");return r==="string"?`<span class="uc-inspector-value uc-inspector-string" 
                    data-path="${t}" 
                    ${n?'contenteditable="true"':""}>"${e}"</span>`:r==="number"?`<span class="uc-inspector-value uc-inspector-number" 
                    data-path="${t}"
                    ${n?'contenteditable="true"':""}>${e}</span>`:r==="boolean"?`<span class="uc-inspector-value uc-inspector-boolean" 
                    data-path="${t}"
                    ${n?'contenteditable="true"':""}>${e}</span>`:`<span class="uc-inspector-value">${String(e)}</span>`}_getHassInfo(){return this._state.hass?{connected:this._state.hass.connected,language:this._state.hass.language,user:this._state.hass.user?.name,themes:Object.keys(this._state.hass.themes?.themes||{}),panelUrl:this._state.hass.panelUrl}:null}_getEntitiesInfo(){let e=this._state.config,t=this._state.hass;if(!e||!t)return{};let r={};e.entity&&(r[e.entity]=t.states?.[e.entity]);let n=i=>{if(i)for(let o of i){if(o.entity&&(r[o.entity]=t.states?.[o.entity]),o.entities)for(let s of o.entities){let a=typeof s=="string"?s:s.entity;r[a]=t.states?.[a]}o.cards&&n(o.cards)}};return n(e.cards),r}_parseValue(e){if(e=e.trim(),e==="true")return!0;if(e==="false")return!1;if(e==="null")return null;let t=Number(e);if(!isNaN(t)&&e!=="")return t;if(e.startsWith('"')&&e.endsWith('"'))return e.slice(1,-1);try{return JSON.parse(e)}catch{return e}}_setValue(e,t){if(e.startsWith("internal.")){let r=e.replace("internal.","");this.setInternal(r,t)}else e.startsWith("config.")&&m(this._cardElement,"config-changed",{config:this._state.config})}_copyState(){let e=JSON.stringify(this._state,null,2);navigator.clipboard.writeText(e).then(()=>{let t=this._panel?.querySelector(".uc-inspector-copy");t&&(t.innerHTML='<ha-icon icon="mdi:check"></ha-icon>',setTimeout(()=>{t.innerHTML='<ha-icon icon="mdi:content-copy"></ha-icon>'},1e3))})}destroy(){this._stopWatching(),this._watchers.clear(),this._panel&&(this._panel.remove(),this._panel=null)}static getStyles(){return`
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
    `}};var u={TTI:"tti",RENDER:"render",UPDATE:"update",HASS_UPDATE:"hass_update",CONFIG_CHANGE:"config_change",BODY_LOAD:"body_load",ANIMATION:"animation",NETWORK:"network",MEMORY:"memory"},v={enabled:!1,sampleSize:100,warningThreshold:16,errorThreshold:50,autoProfile:!1,trackMemory:!0},f=class{constructor(e={}){this._config={...v,...e},this._metrics=new Map,this._activeTimers=new Map,this._panel=null,this._isVisible=!1,this._memoryInterval=null,this._fpsHistory=[],this._lastFrameTime=0,this._boundRuntimeMetricHandler=this._handleRuntimeMetric.bind(this),this._isEnabled=!1,this._panelUpdateInterval=null,this._initMetricTypes(),this._config.enabled&&this.enable()}_initMetricTypes(){for(let e of Object.values(u))this._metrics.set(e,{samples:[],min:1/0,max:0,total:0,count:0})}enable(){this._isEnabled||(this._isEnabled=!0,this._config.enabled=!0,typeof window<"u"&&window.addEventListener("universal-card-performance",this._boundRuntimeMetricHandler),this._config.trackMemory&&this._startMemoryTracking(),this._config.autoProfile&&this._startFPSTracking())}disable(){this._isEnabled&&(this._isEnabled=!1,this._config.enabled=!1,typeof window<"u"&&window.removeEventListener("universal-card-performance",this._boundRuntimeMetricHandler),this._stopMemoryTracking(),this._stopFPSTracking())}start(e,t=u.RENDER){if(!this._config.enabled)return()=>{};let r=performance.now(),n=`${t}:${e}:${r}`;return this._activeTimers.set(n,{name:e,type:t,startTime:r}),()=>this._end(n)}_end(e){let t=this._activeTimers.get(e);if(!t)return;let r=performance.now()-t.startTime;this._activeTimers.delete(e),this._recordMetric(t.type,t.name,r)}async measure(e,t,r){let n=this.start(e,t);try{return await r()}finally{n()}}measureSync(e,t,r){let n=this.start(e,t);try{return r()}finally{n()}}record(e,t,r,n={}){this._config.enabled&&Number.isFinite(r)&&this._recordMetric(e,t,r,n)}_handleRuntimeMetric(e){if(!this._config.enabled)return;let t=e?.detail||{};!t.type||!Number.isFinite(t.durationMs)||this._recordMetric(t.type,t.card_id||t.name||t.type,t.durationMs,t)}_recordMetric(e,t,r,n={}){let i=this._metrics.get(e);if(!i)return;let o={name:t,duration:r,timestamp:Date.now(),...n};i.samples.push(o),i.samples.length>this._config.sampleSize&&i.samples.shift(),i.min=Math.min(i.min,r),i.max=Math.max(i.max,r),i.total+=r,i.count++,r>this._config.errorThreshold?console.warn(`[Profiler] Slow ${e}: ${t} took ${r.toFixed(2)}ms`):r>this._config.warningThreshold&&console.debug(`[Profiler] ${e}: ${t} took ${r.toFixed(2)}ms`),this._isVisible&&this._updatePanel()}_recordMemoryMetric(){let e=performance;if(!e.memory)return;let t=this._metrics.get(u.MEMORY);if(!t)return;let r={usedJSHeapSize:e.memory.usedJSHeapSize,totalJSHeapSize:e.memory.totalJSHeapSize,jsHeapSizeLimit:e.memory.jsHeapSizeLimit,timestamp:Date.now()};t.samples.push(r),t.samples.length>this._config.sampleSize&&t.samples.shift()}_startMemoryTracking(){performance.memory&&(this._stopMemoryTracking(),this._memoryInterval=window.setInterval(()=>{this._recordMemoryMetric()},1e3))}_stopMemoryTracking(){this._memoryInterval&&(clearInterval(this._memoryInterval),this._memoryInterval=null)}_startFPSTracking(){let e=t=>{if(!(!this._config.enabled||!this._config.autoProfile)){if(this._lastFrameTime){let n=1e3/(t-this._lastFrameTime);this._fpsHistory.push({fps:n,timestamp:Date.now()}),this._fpsHistory.length>60&&this._fpsHistory.shift()}this._lastFrameTime=t,requestAnimationFrame(e)}};requestAnimationFrame(e)}_stopFPSTracking(){this._lastFrameTime=0,this._fpsHistory=[]}getStats(e){let t=this._metrics.get(e);return!t||t.count===0?{min:0,max:0,avg:0,count:0,samples:[]}:{min:t.min,max:t.max,avg:t.total/t.count,count:t.count,samples:[...t.samples]}}getCurrentFPS(){return this._fpsHistory.length===0?0:this._fpsHistory.reduce((t,r)=>t+r.fps,0)/this._fpsHistory.length}getMemoryUsage(){let e=this._metrics.get(u.MEMORY)?.samples;return!e||e.length===0?null:e[e.length-1]}reset(){this._initMetricTypes(),this._fpsHistory=[],this._activeTimers.clear()}showPanel(){if(this._panel){this._panel.style.display="flex",this._isVisible=!0,this._updatePanel();return}this._panel=document.createElement("div"),this._panel.className="uc-profiler-panel",this._panel.innerHTML=`
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
    `,document.body.appendChild(this._panel),this._isVisible=!0,this._panel.querySelector(".uc-profiler-close").addEventListener("click",()=>this.hidePanel()),this._panel.querySelector(".uc-profiler-reset").addEventListener("click",()=>{this.reset(),this._updatePanel()}),this._panel.querySelector(".uc-profiler-export").addEventListener("click",()=>this._export()),this._updatePanel(),this._panelUpdateInterval=setInterval(()=>{this._isVisible&&this._updatePanel()},500)}hidePanel(){this._panel&&(this._panel.style.display="none",this._isVisible=!1),this._panelUpdateInterval&&(clearInterval(this._panelUpdateInterval),this._panelUpdateInterval=null)}togglePanel(){this._isVisible?this.hidePanel():this.showPanel()}_updatePanel(){if(!this._panel)return;let e=this._panel.querySelector(".uc-profiler-summary"),t=this.getCurrentFPS(),r=this.getMemoryUsage(),n=this.getStats(u.RENDER);if(!e)return;e.innerHTML=`
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value ${t<30?"warning":t<55?"caution":""}">${t.toFixed(0)}</span>
        <span class="uc-profiler-stat-label">FPS</span>
      </div>
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value ${n.avg>this._config.warningThreshold?"warning":""}">${n.avg.toFixed(1)}</span>
        <span class="uc-profiler-stat-label">Avg Render (ms)</span>
      </div>
      ${r?`
        <div class="uc-profiler-stat">
          <span class="uc-profiler-stat-value">${(r.usedJSHeapSize/1024/1024).toFixed(1)}</span>
          <span class="uc-profiler-stat-label">Memory (MB)</span>
        </div>
      `:""}
      <div class="uc-profiler-stat">
        <span class="uc-profiler-stat-value">${n.count}</span>
        <span class="uc-profiler-stat-label">Renders</span>
      </div>
    `;let i=this._panel.querySelector(".uc-profiler-charts");if(!i)return;i.innerHTML=`
      <div class="uc-profiler-chart">
        <div class="uc-profiler-chart-title">Render Times</div>
        <div class="uc-profiler-chart-bars">
          ${this._renderBars(n.samples.slice(-30))}
        </div>
      </div>
      ${this._fpsHistory.length>0?`
        <div class="uc-profiler-chart">
          <div class="uc-profiler-chart-title">FPS</div>
          <div class="uc-profiler-chart-line">
            ${this._renderLineChart(this._fpsHistory.slice(-60).map(a=>a.fps),60)}
          </div>
        </div>
      `:""}
    `;let o=this._panel.querySelector(".uc-profiler-details");if(!o)return;let s=Object.values(u).filter(a=>a!==u.MEMORY);o.innerHTML=s.map(a=>{let l=this.getStats(a);return l.count===0?"":`
        <div class="uc-profiler-detail">
          <div class="uc-profiler-detail-header">${a}</div>
          <div class="uc-profiler-detail-stats">
            <span>Min: ${l.min.toFixed(2)}ms</span>
            <span>Max: ${l.max.toFixed(2)}ms</span>
            <span>Avg: ${l.avg.toFixed(2)}ms</span>
            <span>Count: ${l.count}</span>
          </div>
        </div>
      `}).join("")}_renderBars(e){if(e.length===0)return'<div class="uc-profiler-no-data">No data</div>';let t=Math.max(...e.map(r=>r.duration),this._config.errorThreshold);return e.map(r=>{let n=r.duration/t*100,i="uc-profiler-bar";return r.duration>this._config.errorThreshold?i+=" error":r.duration>this._config.warningThreshold&&(i+=" warning"),`<div class="${i}" style="height: ${n}%" title="${r.name}: ${r.duration.toFixed(2)}ms"></div>`}).join("")}_renderLineChart(e,t=60){if(e.length<2)return"";let r=Math.max(...e,t),n=e.map((o,s)=>{let a=s/(e.length-1)*100,l=100-o/r*100;return`${a},${l}`}).join(" "),i=100-t/r*100;return`
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="0" y1="${i}" x2="100" y2="${i}" class="uc-profiler-target-line" />
        <polyline points="${n}" class="uc-profiler-line" />
      </svg>
    `}_export(){let e={timestamp:new Date().toISOString(),fps:this.getCurrentFPS(),memory:this.getMemoryUsage(),metrics:{}};for(let i of Object.values(u))e.metrics[i]=this.getStats(i);let t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),r=URL.createObjectURL(t),n=document.createElement("a");n.href=r,n.download=`uc-performance-${new Date().toISOString().split("T")[0]}.json`,n.click(),URL.revokeObjectURL(r)}destroy(){this.disable(),this.hidePanel(),this._panel&&(this._panel.remove(),this._panel=null)}static getStyles(){return`
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
    `}};var M={EventLogger:g,StateInspector:h,PerformanceProfiler:f};export{M as devtools};
