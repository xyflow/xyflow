import type { Preview } from '@storybook/svelte-vite';
import 'storybook-shared-tests/base.css';
import Wrapper from './Wrapper.svelte';

const preview: Preview = {
  decorators: [
    (Story) => {
      const story = Story();
      return { Component: Wrapper, props: { story } };
    },
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

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
