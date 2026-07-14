import type { Meta, StoryObj } from '@storybook/react-vite';

import { edgesGeneralReactConfig } from 'storybook-shared/flow-configs/edges-general';
import { nodesGeneralReactConfig } from 'storybook-shared/flow-configs/nodes-general';
import { paneGeneralConfig } from 'storybook-shared/flow-configs/pane-general';
import { paneNonDefaultsConfig } from 'storybook-shared/flow-configs/pane-non-defaults';
import {
  createEdgesGeneralSuite,
  createNodesGeneralSuite,
  createPaneGeneralSuite,
  createPaneNonDefaultsSuite,
  createPropsColorModeSuite,
} from 'storybook-shared/play-helpers';

import { ColorModeStory } from '../../../components/ColorModeStory';
import DragHandleNode from '../../../components/DragHandleNode';
import { withReactFlowProvider, exampleStoryParameters } from '../../examples/exampleStory';
import { Flow } from '../../Flow';

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

const runPaneGeneralSuite = createPaneGeneralSuite('react');
const runPaneNonDefaultsSuite = createPaneNonDefaultsSuite('react');
const runNodesGeneralSuite = createNodesGeneralSuite('react');
const runEdgesGeneralSuite = createEdgesGeneralSuite('react');
const runColorModeSuite = createPropsColorModeSuite('react');

const nodeTypes = { DragHandleNode };

const testStoryParameters = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};

const meta = {
  title: 'Components/ReactFlow',
  component: ReactFlowApiExample,
  tags: ['components'],
  parameters: {
    ...exampleStoryParameters,
    docs: {
      description: {
        component: `Interactive playground for [\`<ReactFlow />\`](${API_DOCS_URL}) props. Each story focuses on one docs subsection — use the controls panel to tweak values. The EventHandlers story logs callbacks in the Storybook **Actions** panel.

Stories suffixed with regression coverage (e.g. ViewportGeneral) run automated play-function tests in CI.`,
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

export const CommonColorMode: Story = {
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  render: () => <ColorModeStory />,
  play: runColorModeSuite,
};

export const ViewportProps: Story = sectionStory('viewport');

export const ViewportGeneral: Story = {
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  render: () => <Flow flowConfig={paneGeneralConfig} />,
  play: runPaneGeneralSuite,
};

export const ViewportNonDefaults: Story = {
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  render: () => <Flow flowConfig={paneNonDefaultsConfig} />,
  play: runPaneNonDefaultsSuite,
};

export const EdgeProps: Story = sectionStory('edge');

export const EdgeGeneral: Story = {
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  render: () => <Flow flowConfig={edgesGeneralReactConfig} />,
  play: runEdgesGeneralSuite,
};

export const InteractionProps: Story = sectionStory('interaction');

export const InteractionGeneral: Story = {
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  render: () => <Flow flowConfig={nodesGeneralReactConfig} nodeTypes={nodeTypes} />,
  play: runNodesGeneralSuite,
};

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
