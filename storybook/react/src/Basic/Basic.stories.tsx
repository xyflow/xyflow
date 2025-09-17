// storybook/react/src/Basic/Basic.stories.tsx
import { useRef, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Basic, { type BasicHandle } from './Basic';
import { waitForDragging } from '../../../shared/waitForDragging';

const meta: Meta<typeof Basic> = {
  title: 'React Flow/Basic',
  component: Basic,
  argTypes: {
    reset: { control: 'button' },
    updatePos: { control: 'button' },
    toggleClassnames: { control: 'button' },
    toObject: { control: 'button' },
    deleteSelected: { control: 'button' },
    deleteSome: { control: 'button' },
    setNodes: { control: 'button' },
    updateNode: { control: 'button' },
    addNode: { control: 'button' },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const bindRef = (() => {
  const box: { current: BasicHandle | null } = { current: null };
  const Render = () => {
    const ref = useRef<BasicHandle>(null);
    useEffect(() => {
      box.current = ref.current;
    }, []);
    return <Basic ref={ref} />;
  };
  const call = (fn: (api: BasicHandle) => void) => () => {
    box.current && fn(box.current);
  };
  return { Render, call };
})();

export const BasicStory: Story = {
  render: bindRef.Render,
  args: {
    reset: bindRef.call((api) => api.resetTransform()),
    updatePos: bindRef.call((api) => api.updatePos()),
    toggleClassnames: bindRef.call((api) => api.toggleClassnames()),
    toObject: bindRef.call((api) => api.toObject()),
    deleteSelected: bindRef.call((api) => api.deleteSelectedElements()),
    deleteSome: bindRef.call((api) => api.deleteSomeElements()),
    setNodes: bindRef.call((api) => api.setNodes()),
    updateNode: bindRef.call((api) => api.updateNode()),
    addNode: bindRef.call((api) => api.addNode()),
  },
};

export const UserDragAddsDraggingClass: Story = {
  name: 'User drag adds .dragging',
  parameters: { test: { timeout: 15000 } },
  play: async ({ canvasElement }) => {
    await waitForDragging(canvasElement, { findByLabelText: /Hello/i });
  },
};
