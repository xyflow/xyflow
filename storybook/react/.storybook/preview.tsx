import React from 'react';
import type { Preview } from '@storybook/react-vite';
import 'common-storybook/base.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
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
