import { existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const runtimePath = resolve(root, 'tests/ha-fixture/runtime');
const keep = new Set(['.gitignore']);

if (!existsSync(runtimePath)) {
  console.log(`[ha-fixture] fixture runtime directory not found: ${runtimePath}`);
  process.exit(0);
}

for (const entry of readdirSync(runtimePath)) {
  if (keep.has(entry)) {
    continue;
  }

  const targetPath = resolve(runtimePath, entry);
  try {
    rmSync(targetPath, { recursive: true, force: true });
    console.log(`[ha-fixture] removed ${targetPath}`);
  } catch (error) {
    console.warn(`[ha-fixture] failed to remove ${targetPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
