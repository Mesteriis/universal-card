import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const sourceBundle = resolve(root, 'universal-card.js');
const sourceLazy = resolve(root, 'lazy');
const templateConfig = resolve(root, 'tests/ha-fixture/config');
const runtimeConfig = resolve(root, 'tests/ha-fixture/runtime/config');
const targetWww = resolve(runtimeConfig, 'www');

if (!existsSync(sourceBundle)) {
  console.error('[ha-fixture] universal-card.js not found. Run npm run build first.');
  process.exit(1);
}

if (!existsSync(sourceLazy)) {
  console.error('[ha-fixture] lazy/ directory not found. Run npm run build first.');
  process.exit(1);
}

for (const filename of ['configuration.yaml', 'ui-lovelace.yaml']) {
  const sourcePath = resolve(templateConfig, filename);
  if (!existsSync(sourcePath)) {
    console.error(`[ha-fixture] fixture template file not found: ${sourcePath}`);
    process.exit(1);
  }
}

mkdirSync(runtimeConfig, { recursive: true });
cpSync(resolve(templateConfig, 'configuration.yaml'), resolve(runtimeConfig, 'configuration.yaml'), { force: true });
cpSync(resolve(templateConfig, 'ui-lovelace.yaml'), resolve(runtimeConfig, 'ui-lovelace.yaml'), { force: true });
mkdirSync(targetWww, { recursive: true });
cpSync(sourceBundle, resolve(targetWww, 'universal-card.js'));
cpSync(sourceLazy, resolve(targetWww, 'lazy'), { recursive: true, force: true });

console.log('[ha-fixture] prepared runtime config and synced bundle into tests/ha-fixture/runtime/config/www');
