import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: /\.tsx?$/,
    }),
    svelte({
      include: /\.svelte$/,
    }),
  ],
  resolve: {
    conditions: ['browser', 'default'],
  },
});



