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

function extractObjectBlock(text, marker) {
  const markerIndex = text.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Marker not found: ${marker}`);
  }

  const openIndex = text.indexOf('{', markerIndex);
  if (openIndex === -1) {
    throw new Error(`Object start not found for marker: ${marker}`);
  }

  let depth = 0;
  let closeIndex = -1;

  for (let i = openIndex; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        closeIndex = i;
        break;
      }
    }
  }

  if (closeIndex === -1) {
    throw new Error(`Object end not found for marker: ${marker}`);
  }

  return text.slice(openIndex + 1, closeIndex);
}

function parseObjectStringValues(block) {
  return Array.from(block.matchAll(/:\s*'([^']+)'/g), (m) => m[1]);
}

function parseObjectKeys(block) {
  return Array.from(block.matchAll(/(?:'([^']+)'|([a-zA-Z_][a-zA-Z0-9_-]*))\s*:/g), (m) => m[1] || m[2]);
}

function uniq(items) {
  return Array.from(new Set(items));
}

function main() {
  const constantsText = read('src/core/constants.ts');
  const themesText = readModule('src/styles/themes');
  const modesIndexText = readModule('src/modes/index');
  const cardText = readModule('src/core/UniversalCard');

  const themesBlock = extractObjectBlock(constantsText, 'export const THEMES = Object.freeze(');
  const bodyModesBlock = extractObjectBlock(constantsText, 'export const BODY_MODES = Object.freeze(');
  const previewBlock = extractObjectBlock(themesText, 'export const THEME_PREVIEW_STYLES = Object.freeze(');
  const modeClassesBlock = extractObjectBlock(modesIndexText, 'const MODE_CLASSES =');

  const themeNames = uniq(parseObjectStringValues(themesBlock));
  const bodyModes = uniq(parseObjectStringValues(bodyModesBlock));
  const previewThemeKeys = new Set(uniq(parseObjectKeys(previewBlock)));
  const modeFactoryKeys = new Set(uniq(parseObjectKeys(modeClassesBlock)));
  const themeCssClasses = new Set(Array.from(themesText.matchAll(/\.theme-([a-z0-9-]+)/g), (m) => m[1]));

  const errors = [];

  themeNames.forEach((theme) => {
    if (!previewThemeKeys.has(theme)) {
      errors.push(`Missing preview style for theme "${theme}" in THEME_PREVIEW_STYLES.`);
    }
    if (theme !== 'default' && !themeCssClasses.has(theme)) {
      errors.push(`Missing CSS class ".theme-${theme}" in src/styles/themes source.`);
    }
  });

  bodyModes
    .filter((mode) => mode !== 'none')
    .forEach((mode) => {
      if (!modeFactoryKeys.has(mode)) {
        errors.push(`Mode "${mode}" is missing from MODE_CLASSES factory mapping.`);
      }
    });

  if (!/this\._mode\.open\(\)/.test(cardText)) {
    errors.push('UniversalCard does not call this._mode.open() in expand flow.');
  }
  if (!/this\._mode\.close\(\)/.test(cardText)) {
    errors.push('UniversalCard does not call this._mode.close() in collapse flow.');
  }

  const matrixSize = themeNames.length * bodyModes.length;
  console.log(`[smoke] themes: ${themeNames.length}`);
  console.log(`[smoke] body modes: ${bodyModes.length}`);
  console.log(`[smoke] matrix combinations: ${matrixSize}`);

  if (errors.length > 0) {
    console.error('[smoke] FAILED');
    errors.forEach((err) => console.error(` - ${err}`));
    process.exit(1);
  }

  console.log('[smoke] OK');
}

main();
