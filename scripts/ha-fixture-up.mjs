import { spawnSync } from 'node:child_process';

const composeFile = 'tests/ha-fixture/compose.yaml';

const syncResult = spawnSync('node', ['scripts/ha-fixture-sync-assets.mjs'], {
  stdio: 'inherit'
});

if ((syncResult.status ?? 1) !== 0) {
  process.exit(syncResult.status ?? 1);
}

const result = spawnSync('docker', ['compose', '-f', composeFile, 'up', '-d'], {
  stdio: 'inherit'
});

process.exit(result.status ?? 1);
