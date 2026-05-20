import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    globals: false,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        '**/*.config.*',
        '**/*.d.ts',
        'src/apps/web/main.ts',
        'src/sw.ts',
        'src/**/index.ts',
      ],
      thresholds: {
        lines: 80,
        branches: 75,
        functions: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@contexts': resolve(__dirname, './src/contexts'),
      '@shared-kernel': resolve(__dirname, './src/shared-kernel'),
      '@shared-infrastructure': resolve(__dirname, './src/shared-infrastructure'),
      '@apps': resolve(__dirname, './src/apps'),
    },
  },
});
