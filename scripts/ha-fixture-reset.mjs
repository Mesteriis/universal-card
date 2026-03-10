import { existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const runtimePath = process.env.HA_FIXTURE_RUNTIME_DIR || '/tmp/universal-card-ha-fixture-config';

if (!existsSync(runtimePath)) {
  console.log(`[ha-fixture] fixture runtime directory not found: ${runtimePath}`);
  process.exit(0);
}

for (const entry of readdirSync(runtimePath)) {
  const targetPath = resolve(runtimePath, entry);
  try {
    rmSync(targetPath, { recursive: true, force: true });
    console.log(`[ha-fixture] removed ${targetPath}`);
  } catch (error) {
    console.warn(`[ha-fixture] failed to remove ${targetPath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
