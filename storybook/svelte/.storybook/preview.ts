import type { Preview } from '@storybook/svelte-vite';
import DecoratorWrapper from './DecoratorWrapper.svelte';
import '@xyflow/svelte/dist/style.css';

const preview: Preview = {
  decorators: [
    (Story) => {
      const story = Story();
      return { Component: DecoratorWrapper, props: { story } };
    },
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
  },
};

export default preview;
