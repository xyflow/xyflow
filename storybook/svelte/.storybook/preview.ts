import type { Preview } from '@storybook/svelte-vite';

import '@xyflow/svelte/dist/style.css';

const preview: Preview = {
  parameters: {
    // Storybook statically parses this value; keep it inline and in sync across frameworks.
    options: {
      storySort: {
        order: [
          'Components',
          'Examples',
          ['Basic', 'Edges', 'Nodes', 'Handles', 'Connections', 'State & API', 'Layout', 'Interaction', 'Stress'],
        ],
      },
    },
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
