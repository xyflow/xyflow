import type { Preview } from '@storybook/react-vite';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React from 'react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
        <ReactFlowProvider>
          <Story />
        </ReactFlowProvider>
      </div>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: 'todo' },
  },
};

export default preview;
