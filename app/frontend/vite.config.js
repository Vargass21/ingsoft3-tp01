import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [...configDefaults.exclude, 'e2e/**'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/testSetup.js',
    coverage: {
      reportsDirectory: process.env.COVERAGE_DIR || 'coverage',
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      all: true,
      thresholds: { lines: 60 },
      include: [
        'src/lib/**/*.js',
        'src/services/**/*.js',
        'src/pages/**/*.jsx',
        'src/components/**/*.jsx',
      ],
      exclude: ['**/*.{test,spec}.{js,jsx}', '**/__tests__/**'],
    },
  },
});
