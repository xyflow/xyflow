import { svelteConditions } from '../shared/config/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: svelteConditions,
  },
});
