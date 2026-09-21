import { setup, type Preview } from '@storybook/vue3-vite';
import { createPinia } from 'pinia';
import '../index.css';

setup((app) => {
  app.use(createPinia());
});

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    options: { storySort: { order: ['Examples', ['Basic'], 'Generic Tests'] } },
  },
  decorators: [() => ({ template: '<div style="width: 100%; height: 100vh"><story /></div>' })],
};

export default preview;
