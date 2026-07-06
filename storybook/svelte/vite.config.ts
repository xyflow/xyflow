import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['svelte', 'browser', 'development', 'import', 'module', 'default'],
  },
});
