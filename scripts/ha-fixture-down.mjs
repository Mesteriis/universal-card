import { spawnSync } from 'node:child_process';

const composeFile = 'tests/ha-fixture/compose.yaml';

const result = spawnSync('docker', ['compose', '-f', composeFile, 'down'], {
  stdio: 'inherit'
});

process.exit(result.status ?? 1);
