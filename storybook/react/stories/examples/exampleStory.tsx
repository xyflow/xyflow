import type { Decorator } from '@storybook/react-vite';
import { ReactFlowProvider } from '@xyflow/react';

export const exampleStoryParameters = {
  layout: 'fullscreen' as const,
};

export const withReactFlowProvider: Decorator = (Story) => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <ReactFlowProvider>
      <Story />
    </ReactFlowProvider>
  </div>
);
