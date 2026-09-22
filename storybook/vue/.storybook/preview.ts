import { setup, type Preview } from '@storybook/vue3-vite';
import { createPinia } from 'pinia';
import '../index.css';

setup((app) => {
  app.use(createPinia());
});

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: {
        order: [
          'Components',
          'Examples',
          ['Basic', 'Edges', 'Nodes', 'Handles', 'Connections', 'State & API', 'Layout', 'Interaction', 'Stress'],
          'Generic Tests',
        ],
      },
    },
  },
  decorators: [() => ({ template: '<div style="width: 100%; height: 100vh"><story /></div>' })],
};

export default preview;
