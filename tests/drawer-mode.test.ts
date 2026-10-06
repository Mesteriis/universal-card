// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigManager } from '../src/core/config.js';
import { DrawerMode } from '../src/modes/DrawerMode.js';
import { createMode, getAllModeStyles } from '../src/modes/index.js';
import { drawerSizePercent } from '../src/utils/drawer.js';
import { cardPool } from '../src/core/runtime.js';

const config = (drawer = {}) => ({body_mode: 'drawer', title: 'Details', drawer, body: {cards: [{type: 'markdown', content: 'Drawer content'}]}});
const finish = async (p: Promise<unknown>) => {await vi.runAllTimersAsync();await p;};
function prepare(mode: DrawerMode) {
  mode._getCardHelpers = async () => ({createCardElement: async () => {
    const child = document.createElement('div');child.textContent = 'Loaded detail';return child;
  }});
}

describe('drawer viewport size contract', () => {
  it.each([['full',100],['1/1',100],['1/2',50],['1/3',100/3],['1/4',25],['1/5',20],['2/3',200/3],[' 1 / 4 ',25],['50%',50],['12.5%',12.5],[1,100],[.25,25]])('parses %s', (input, pct) => {
    expect(drawerSizePercent(input)).toBeCloseTo(pct);
    expect(() => ConfigManager.validate(config({size:input}))).not.toThrow();
  });
  it.each([0,-1,1.1,NaN,Infinity,true,null,{},'', 'half','0/2','1/0','3/2','101%','0%','-50%','calc(50%)','1/2; background:red'])('rejects invalid size %s', input => {
    expect(drawerSizePercent(input)).toBeNull();
    expect(() => ConfigManager.validate(config({size:input}))).toThrow(/drawer.size/);
  });
  it.each(['left','right','top','bottom'])('validates and preserves %s', side => {
    const normalized = ConfigManager.normalize(config({side,size:'1/4',loading_strategy:'preload',close_on_escape:false,custom_css:'.uc-drawer-dialog{color:red}'}));
    expect(normalized.drawer).toMatchObject({side,size:'1/4',loading_strategy:'preload',close_on_escape:false,custom_css:'.uc-drawer-dialog{color:red}'});
  });
  it('normalizes defaults and exposes the editor schema', () => {
    expect(ConfigManager.normalize(config()).drawer).toMatchObject({side:'right',size:'1/3',loading_strategy:'lazy'});
    const schema = ConfigManager.getSchema();
    expect(schema.properties.body_mode.enum).toContain('drawer');
    expect(schema.properties.drawer.properties.side.enum).toEqual(['left','right','top','bottom']);
  });
  it.each([{side:'diagonal'},{side:true},{custom_css:7},{loading_strategy:'eager'},{close_on_escape:'yes'},{backdrop_color:7}])('rejects invalid drawer option %s', drawer => {
    expect(() => ConfigManager.validate(config(drawer))).toThrow();
  });
  it('preserves existing modal custom CSS through normalization', () => {
    expect(ConfigManager.normalize({body_mode:'modal',modal:{custom_css:'.uc-modal-title{color:red}'}}).modal.custom_css).toBe('.uc-modal-title{color:red}');
  });
});

describe('drawer portal lifecycle', () => {
  const modes: DrawerMode[] = [];
  beforeEach(() => {
    vi.useFakeTimers();cardPool.clear();
    vi.stubGlobal('requestAnimationFrame', (fn:FrameRequestCallback) => setTimeout(fn,0));
  });
  afterEach(async () => {
    for(const mode of modes.splice(0)) mode.destroy();
    await vi.runAllTimersAsync();vi.useRealTimers();vi.unstubAllGlobals();
    document.body.innerHTML='';document.body.style.overflow='';
  });
  const make = (drawer={}) => {const mode = new DrawerMode(config(drawer));prepare(mode);modes.push(mode);return mode;};
  it.each(['left','right','top','bottom'])('mounts %s panel and retains HA children on reopen', async side => {
    const mode=make({side,size:'1/4'});mode.hass={states:{'sensor.test':{state:'42'}}};
    expect(mode.render().dataset.ucMode).toBe('drawer');
    await finish(mode.open());
    const first=mode._cards[0];const dialog=document.querySelector<HTMLElement>('.uc-drawer-dialog')!;
    expect(dialog.dataset.side).toBe(side);expect(dialog.style.getPropertyValue('--drawer-size')).toBe('25%');
    expect(dialog.getAttribute('role')).toBe('dialog');expect(first.hass).toBe(mode.hass);
    expect(document.body.style.overflow).toBe('hidden');
    await finish(mode.close());expect(document.querySelector('.uc-drawer-overlay')).toBeNull();
    expect(document.body.style.overflow).toBe('');await finish(mode.open());expect(mode._cards[0]).toBe(first);
  });
  it('uses the HA portal context rather than body when available', async () => {
    const root=document.createElement('hui-root');const shadow=root.attachShadow({mode:'open'});const card=document.createElement('div');shadow.append(card);document.body.append(root);
    const mode=new DrawerMode(config(),{card});prepare(mode);modes.push(mode);await finish(mode.open());
    expect(shadow.querySelector('.uc-drawer-overlay')).not.toBeNull();expect(document.body.querySelector('.uc-drawer-overlay')).toBeNull();
  });
  it('defaults safely when constructed without a drawer section', () => {
    const mode = new DrawerMode({body_mode:'drawer'});modes.push(mode);
    const overlay = mode._renderModal();
    expect(overlay.dataset.side).toBe('right');
    expect(parseFloat(mode._dialog!.style.getPropertyValue('--drawer-size'))).toBeCloseTo(100/3);
  });
  it('destroys a closing drawer without leaking or releasing another lock', async () => {
    const a=make(),b=make();await finish(a.open());await finish(b.open());
    const closing=a.close();a.destroy();await finish(closing);
    expect(document.querySelectorAll('.uc-drawer-overlay')).toHaveLength(1);
    expect(document.body.style.overflow).toBe('hidden');
    await finish(b.close());expect(document.body.style.overflow).toBe('');
  });
  it('serializes reopen while a previous close is pending', async () => {
    const mode=make();await finish(mode.open());const closing=mode.close();const reopening=mode.open();await finish(Promise.all([closing,reopening]));
    expect(mode.active).toBe(true);expect(document.querySelectorAll('.uc-drawer-overlay')).toHaveLength(1);expect(document.body.style.overflow).toBe('hidden');
    await finish(mode.close());expect(document.body.style.overflow).toBe('');
  });
  it('ignores repeated opens and closes without duplicating locks', async () => {
    const mode=make();await finish(Promise.all([mode.open(),mode.open()]));expect(document.querySelectorAll('.uc-drawer-overlay')).toHaveLength(1);
    await finish(Promise.all([mode.close(),mode.close()]));await mode.close();expect(document.body.style.overflow).toBe('');
  });
  it('closes by Escape and restores trigger focus', async () => {
    const button=document.createElement('button');document.body.append(button);button.focus();const mode=make();await finish(mode.open());
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));await vi.runAllTimersAsync();expect(mode.active).toBe(false);expect(document.activeElement).toBe(button);
  });
  it('honors disabled Escape/backdrop close; button can still close', async () => {
    const mode=make({close_on_escape:false,close_on_backdrop:false});await finish(mode.open());
    document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));mode._overlay!.click();await vi.runAllTimersAsync();expect(mode.active).toBe(true);
    mode._dialog!.querySelector<HTMLButtonElement>('[data-uc-role="close"]')!.click();await vi.runAllTimersAsync();expect(mode.active).toBe(false);
  });
  it('closes by backdrop and keeps scrolling locked for nested drawers', async () => {
    const a=make(),b=make();await finish(a.open());await finish(b.open());b._overlay!.click();await vi.runAllTimersAsync();expect(document.body.style.overflow).toBe('hidden');
    await finish(a.close());expect(document.body.style.overflow).toBe('');
  });
  it('retains custom CSS after built-in drawer geometry', () => {
    const mode=make({custom_css:'.uc-drawer-dialog {color:red}'});const overlay=mode._renderModal();const css=overlay.querySelector('style')!.textContent!;
    expect(css.endsWith('.uc-drawer-dialog {color:red}')).toBe(true);expect(css).toContain('prefers-reduced-motion');
  });
  it('traps Tab inside the drawer, including shadow children', async () => {
    const mode=make({close_on_escape:false});await finish(mode.open());
    const host=document.createElement('div');const shadow=host.attachShadow({mode:'open'});const a=document.createElement('button'),b=document.createElement('button');shadow.append(a,b);mode._dialog!.append(host);
    for(const el of [a,b]) el.getClientRects=()=>[{}] as unknown as DOMRectList;
    b.focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',cancelable:true}));expect(shadow.activeElement).toBe(a);
    a.focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,cancelable:true}));expect(shadow.activeElement).toBe(b);
  });
  it('focuses the dialog when it has no tabbable controls', async () => {
    const mode=make({show_close:false});await finish(mode.open());document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',cancelable:true}));expect(document.activeElement).toBe(mode._dialog);
  });
  it('registers drawer with factory and stylesheet aggregation', () => {
    const mode=createMode('drawer',config()) as DrawerMode;modes.push(mode);expect(mode).toBeInstanceOf(DrawerMode);expect(getAllModeStyles()).toContain('.uc-drawer-overlay');
  });
});
