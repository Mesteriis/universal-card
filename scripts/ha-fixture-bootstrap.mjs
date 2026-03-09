import { spawnSync } from 'node:child_process';

const steps = [
  ['node', ['scripts/ha-fixture-up.mjs']],
  ['node', ['scripts/ha-fixture-wait.mjs']],
  ['node', ['scripts/ha-fixture-onboard.mjs']]
];

for (const [command, args] of steps) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}
