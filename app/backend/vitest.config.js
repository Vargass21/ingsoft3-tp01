import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      reportsDirectory: process.env.COVERAGE_DIR || 'coverage',
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      all: true,
      thresholds: { lines: 80 },
      include: ['src/services/**/*.js'],
      exclude: ['**/*.{test,spec}.{js,jsx}', '**/__tests__/**'],
    },
  },
});
