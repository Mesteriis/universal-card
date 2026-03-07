import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    exclude: ['tests/e2e/**/*'],
    environment: 'node',
    pool: 'vmThreads',
    fileParallelism: false,
    testTimeout: 5000,
    hookTimeout: 10000,
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: [
        'src/core/action-hooks.ts',
        'src/core/config.ts',
        'src/core/config-migrations.ts',
        'src/core/constants.ts',
        'src/core/runtime.ts',
        'src/modes/index.ts',
        'src/editor/ConfigValidator.ts',
        'src/editor/EditorContract.ts',
        'src/editor/SchemaContract.ts',
        'src/providers/ProviderContext.ts',
        'src/providers/DerivedProviderContext.ts',
        'src/extensibility/PluginSystem.ts',
        'src/public-api-policy.ts'
      ],
      exclude: [
        'tests/**/*',
        'scripts/**/*'
      ],
      thresholds: {
        lines: 70,
        functions: 90,
        branches: 60,
        statements: 70
      }
    }
  }
});
