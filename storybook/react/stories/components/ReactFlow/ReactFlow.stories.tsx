import type { Meta, StoryObj } from '@storybook/react-vite';

import { withReactFlowProvider, exampleStoryParameters } from '../../examples/exampleStory';

import { createEventHandlerArgs, eventHandlerArgTypes } from './eventHandlers';
import { ReactFlowApiExample } from './Flow';
import {
  API_DOCS_URL,
  PROP_SECTIONS,
  SECTION_DESCRIPTIONS,
  SECTION_DOC_ANCHORS,
  defaultFlowArgs,
  reactFlowArgTypes,
  sectionArgs,
  sectionControls,
  type PropSection,
} from './config';

const meta = {
  title: 'Components/ReactFlow',
  component: ReactFlowApiExample,
  tags: ['api-reference'],
  parameters: {
    ...exampleStoryParameters,
    docs: {
      description: {
        component: `Interactive playground for [\`<ReactFlow />\`](${API_DOCS_URL}) props. Each story focuses on one docs subsection — use the controls panel to tweak values. The EventHandlers story logs callbacks in the Storybook **Actions** panel.

Automated regression tests for the same areas live under **Tests** in the sidebar (Viewport, Interaction, Edge, Common, etc.).`,
      },
    },
  },
  decorators: [withReactFlowProvider],
  args: defaultFlowArgs,
  argTypes: { ...reactFlowArgTypes, ...eventHandlerArgTypes },
} satisfies Meta<typeof ReactFlowApiExample>;

export default meta;

type Story = StoryObj<typeof meta>;

function sectionStory(section: PropSection): Story {
  return {
    args: sectionArgs(section),
    parameters: {
      controls: {
        include: sectionControls(section),
      },
      docs: {
        description: {
          story: `${SECTION_DESCRIPTIONS[section]} See [docs](${API_DOCS_URL}${SECTION_DOC_ANCHORS[section]}).`,
        },
      },
    },
  };
}

export const CommonProps: Story = sectionStory('common');

export const ViewportProps: Story = sectionStory('viewport');

export const EdgeProps: Story = sectionStory('edge');

export const InteractionProps: Story = sectionStory('interaction');

export const ConnectionLineProps: Story = sectionStory('connectionLine');

export const KeyboardProps: Story = sectionStory('keyboard');

export const StyleProps: Story = sectionStory('style');

export const EventHandlers: Story = {
  args: {
    ...sectionArgs('eventHandlers'),
    ...createEventHandlerArgs(),
  },
  parameters: {
    controls: {
      include: [...PROP_SECTIONS.eventHandlers],
    },
    docs: {
      description: {
        story: `${SECTION_DESCRIPTIONS.eventHandlers} See [docs](${API_DOCS_URL}${SECTION_DOC_ANCHORS.eventHandlers}).

**General:** onError, onInit, onDelete, onBeforeDelete

**Node:** onNodeClick, onNodeDoubleClick, onNodeDrag*, onNodeMouse*, onNodeContextMenu, onNodesDelete, onNodesChange

**Edge:** onEdgeClick, onEdgeDoubleClick, onEdgeMouse*, onEdgeContextMenu, onReconnect*, onEdgesDelete, onEdgesChange

**Connection:** onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, isValidConnection

**Pane:** onMove, onMoveStart, onMoveEnd, onPaneClick, onPaneContextMenu, onPaneScroll, onPaneMouse*

**Selection:** onSelectionChange, onSelectionDrag*, onSelectionStart, onSelectionEnd, onSelectionContextMenu`,
      },
    },
  },
};
