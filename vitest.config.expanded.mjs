import { defineConfig, mergeConfig } from 'vitest/config';

import baseConfig from './vitest.config.mjs';

const expandedCoverageInclude = [
  ...(baseConfig.test?.coverage?.include || []),
  'src/modes/BaseMode.ts',
  'src/modes/ExpandMode.ts',
  'src/modes/ModalMode.ts',
  'src/modes/FullscreenMode.ts',
  'src/modes/SubviewMode.ts',
  'src/modes/TabsMode.ts',
  'src/modes/CarouselMode.ts'
];

export default mergeConfig(baseConfig, defineConfig({
  test: {
    coverage: {
      include: expandedCoverageInclude,
      thresholds: {
        lines: 70,
        functions: 80,
        branches: 60,
        statements: 70
      }
    }
  }
}));
