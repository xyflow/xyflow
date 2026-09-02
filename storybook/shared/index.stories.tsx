import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'xyflow/Index',
  parameters: {
    docs: {
      description: {
        component:
          'This Storybook composes the React Flow and Svelte Flow Storybooks. Use the sidebar to switch between them.',
      },
    },
  },
  render: () => (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 480, lineHeight: 1.5 }}>
      <img
        src="https://user-images.githubusercontent.com/2857535/279643999-ffda9f91-6b6d-447d-82be-fcbd6103edb6.svg#gh-light-mode-only"
        alt="xyflow-header"
        style={{ width: '100%', height: 'auto' }}
      />
      <h1>xyflow Storybook</h1>
      <p>
        Select <strong>React Flow</strong> or <strong>Svelte Flow</strong> in the sidebar to browse framework-specific
        stories and run tests.
      </p>
      <p style={{ marginBottom: 0, color: '#666' }}>
        In development, run all instances with <code>pnpm storybook</code> from the monorepo root.
      </p>
    </div>
  ),
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
