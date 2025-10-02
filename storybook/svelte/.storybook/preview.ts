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
  },
};

export default preview;
