/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom', // Using jsdom for DOM testing
    setupFiles: ['./setup.ts'],
    include: ['./components/**/*.test.{ts,tsx}', './utils/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
