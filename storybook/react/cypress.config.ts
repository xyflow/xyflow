import react from '@vitejs/plugin-react';
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: { plugins: [react()] },
    },
    video: false,
    screenshotOnRunFailure: false,
  },
  e2e: {
    baseUrl: 'http://localhost:6006',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false,
  },
});
