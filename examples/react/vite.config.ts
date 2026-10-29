import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    minify: false,
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['../..'],
    },
  },
});
