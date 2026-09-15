import type { Preview } from '@storybook/react-vite';

import '@xyflow/react/dist/style.css';

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
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
