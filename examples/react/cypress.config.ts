import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000/examples',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: false,
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    screenshotOnRunFailure: false,
    video: false,
  },
});
