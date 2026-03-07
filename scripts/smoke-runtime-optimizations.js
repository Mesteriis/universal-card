#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function readModule(relPathWithoutExtension) {
  const candidates = [
    `${relPathWithoutExtension}.ts`,
    `${relPathWithoutExtension}.js`
  ];

  for (const candidate of candidates) {
    const absolutePath = path.join(ROOT, candidate);
    if (fs.existsSync(absolutePath)) {
      return fs.readFileSync(absolutePath, 'utf8');
    }
  }

  throw new Error(`Module source not found for ${relPathWithoutExtension}`);
}

function requirePattern(text, pattern, error, errors) {
  if (!pattern.test(text)) {
    errors.push(error);
  }
}

function main() {
  const universalCard = readModule('src/core/UniversalCard');
  const runtime = read('src/core/runtime.ts');
  const baseMode = readModule('src/modes/BaseMode');
  const tabs = readModule('src/modes/TabsMode');
  const carousel = readModule('src/modes/CarouselMode');
  const constants = read('src/core/constants.ts');
  const buildScript = read('build.js');
  const entry = readModule('src/index');
  const publicApiPolicy = read('src/public-api-policy.ts');
  const extensibility = readModule('src/extensibility/index');

  const errors = [];

  // UniversalCard runtime optimization hooks
  requirePattern(universalCard, /_resolveLazyBatchConfig\(/, 'Missing smart lazy-load batch resolver', errors);
  requirePattern(universalCard, /_cancelPendingBodyLoad\(/, 'Missing lazy-load cancellation hook', errors);
  requirePattern(universalCard, /_saveModeState\(/, 'Missing mode state persistence hook', errors);
  requirePattern(universalCard, /_getBodyPoolKey\(/, 'Missing body pool key generator', errors);
  requirePattern(universalCard, /_releaseBodyCardsToPool\(/, 'Missing body card pool release path', errors);
  requirePattern(universalCard, /whenIdle\(/, 'Missing idle batching in lazy-load flow', errors);
  requirePattern(universalCard, /this\._bodyLoadToken/, 'Missing body load race token', errors);
  requirePattern(universalCard, /cardPool\.acquire\(/, 'Missing card pool acquire path', errors);
  requirePattern(universalCard, /performanceBudgetTracker\.record\(/, 'Missing performance budget tracker integration', errors);

  // Shared runtime services
  requirePattern(runtime, /class CardPool/, 'Missing shared CardPool service', errors);
  requirePattern(runtime, /class PerformanceBudgetTracker/, 'Missing performance budget tracker service', errors);
  requirePattern(runtime, /export const cardPool/, 'cardPool is not exported', errors);
  requirePattern(runtime, /export const performanceBudgetTracker/, 'performanceBudgetTracker is not exported', errors);
  requirePattern(runtime, /_pruneToScopeLimit\(/, 'CardPool is missing scope-aware pruning', errors);
  requirePattern(baseMode, /_buildCardsPoolKey\(/, 'BaseMode does not build shared pool key', errors);
  requirePattern(baseMode, /_getPoolReleaseOptions\(/, 'BaseMode does not provide pool release options', errors);
  requirePattern(baseMode, /cardPool\.acquire\(/, 'BaseMode does not acquire cards from pool', errors);
  requirePattern(baseMode, /cardPool\.release\(/, 'BaseMode does not release cards to pool', errors);
  requirePattern(tabs, /_getTabPoolKey\(/, 'Tabs mode does not provide tab pool key resolver', errors);
  requirePattern(tabs, /cardPool\.acquire\(/, 'Tabs mode does not acquire tab cards from pool', errors);

  // Stateful tabs / carousel hooks
  requirePattern(tabs, /onTabChange/, 'Tabs mode does not expose onTabChange callback', errors);
  requirePattern(carousel, /onSlideChange/, 'Carousel mode does not expose onSlideChange callback', errors);
  requirePattern(carousel, /startIndex/, 'Carousel mode does not accept persisted startIndex', errors);

  // Config + budgets
  requirePattern(constants, /export const PERF_BUDGETS/, 'Missing PERF_BUDGETS constants', errors);
  requirePattern(constants, /lazy_initial_batch/, 'Missing lazy_initial_batch default', errors);
  requirePattern(constants, /enable_card_pool/, 'Missing enable_card_pool default', errors);
  requirePattern(constants, /pool_scope/, 'Missing pool_scope default', errors);
  requirePattern(constants, /POOL_MIN_TTL_MS/, 'Missing pool TTL limits', errors);
  requirePattern(buildScript, /BUNDLE_BUDGET_KB/, 'Build script is missing bundle budget check', errors);
  requirePattern(buildScript, /uc-lazy-advanced/, 'Build script is missing lazy bundle entries', errors);
  requirePattern(buildScript, /uc-lazy-card-editor/, 'Build script is missing lazy card editor bundle entry', errors);
  requirePattern(entry, /loadOptionalBundle\(/, 'Entry point does not use optional lazy bundle loader', errors);
  requirePattern(entry, /cardEditor:\s*'lazy\/uc-lazy-card-editor\.js'/, 'Entry point does not map lazy card editor bundle', errors);
  requirePattern(entry, /class UniversalCardEditorProxy/, 'Entry point does not define lazy editor proxy element', errors);
  requirePattern(entry, /loadCardEditorClass\(/, 'Entry point does not expose lazy card editor class loader', errors);
  requirePattern(entry, /createUniversalCardPlatformApi\(/, 'Entry point does not build the global API from the public API policy', errors);
  requirePattern(entry, /getCurrentVersion:\s*\(\)\s*=> ConfigManager\.getCurrentConfigVersion\(\)/, 'Global API does not expose current config version helper', errors);
  requirePattern(entry, /migrate:\s*\(config\)\s*=> ConfigManager\.migrate\(config\)/, 'Global API does not expose config migration helper', errors);
  requirePattern(entry, /advanced:\s*loadAdvancedModules/, 'Global API does not expose lazy advanced loader', errors);
  requirePattern(entry, /editor:\s*loadEditorModules/, 'Global API does not expose lazy editor loader', errors);
  requirePattern(entry, /cardEditor:\s*loadCardEditorClass/, 'Global API does not expose lazy card editor loader', errors);
  requirePattern(entry, /devtools:\s*loadDevtoolsModules/, 'Global API does not expose lazy devtools loader', errors);
  requirePattern(entry, /plugins:\s*\{[\s\S]*register:\s*\(plugin(?::[^)]*)?\)\s*=> pluginSystem\.register\(plugin\)/, 'Global API does not expose plugin registration surface', errors);
  requirePattern(entry, /plugins:\s*\{[\s\S]*getHooks:\s*\(\)\s*=> \[\.\.\.Object\.values\(PUBLIC_PLUGIN_HOOKS\)\]/, 'Global API does not expose public plugin hook inventory', errors);
  requirePattern(publicApiPolicy, /PUBLIC_NAMESPACE_VERSIONS\s*=\s*Object\.freeze\(/, 'Public API policy is missing namespace version catalog', errors);
  requirePattern(publicApiPolicy, /compatibility:\s*Object\.freeze\(\{[\s\S]*backwardCompatible:\s*false/, 'Public API policy does not declare development-stage compatibility rules', errors);
  requirePattern(publicApiPolicy, /supportsNamespace\(/, 'Public API policy is missing namespace support helper', errors);
  requirePattern(publicApiPolicy, /supportsNamespaceMember\(/, 'Public API policy is missing namespace member support helper', errors);
  requirePattern(publicApiPolicy, /publicNamespaces:\s*PUBLIC_NAMESPACE_MEMBERS/, 'Capability catalog does not expose public namespace member inventory', errors);
  requirePattern(publicApiPolicy, /pluginLifecycleVersion:\s*PUBLIC_PLUGIN_LIFECYCLE_VERSION/, 'Capability catalog does not expose plugin lifecycle version', errors);
  requirePattern(publicApiPolicy, /pluginHooks:\s*Object\.freeze\(\[\.\.\.Object\.values\(PUBLIC_PLUGIN_HOOKS\)\]\)/, 'Capability catalog does not expose plugin hook list', errors);
  requirePattern(extensibility, /Remote plugin URLs are no longer supported/, 'Extensibility helpers do not reject remote plugin URLs', errors);
  requirePattern(extensibility, /\[PLUGIN_HOOKS\.HEADER_RENDER\]/, 'Extensibility helpers do not use public header render hooks', errors);
  requirePattern(extensibility, /\[PLUGIN_HOOKS\.ACTION_EXECUTE\]/, 'Extensibility helpers do not use public action hooks', errors);

  if (/import\(url\)/.test(extensibility) || /loadPluginFromUrl\(/.test(extensibility)) {
    errors.push('Extensibility helpers still contain remote plugin loading code');
  }

  if (errors.length > 0) {
    console.error('[smoke:runtime] FAILED');
    errors.forEach((error) => console.error(` - ${error}`));
    process.exit(1);
  }

  console.log('[smoke:runtime] OK');
}

main();
