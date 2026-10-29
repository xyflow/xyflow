import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // lets you skip importing describe/it/expect
    environment: 'node', // or 'jsdom' if you touch the DOM
  },
});
