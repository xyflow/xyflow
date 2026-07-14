import type { Meta, StoryObj } from '@storybook/svelte-vite';

import { edgesGeneralSvelteConfig } from 'storybook-shared/flow-configs/edges-general';
import { nodesGeneralSvelteConfig } from 'storybook-shared/flow-configs/nodes-general';
import { paneGeneralConfig } from 'storybook-shared/flow-configs/pane-general';
import { paneNonDefaultsSvelteConfig } from 'storybook-shared/flow-configs/pane-non-defaults';
import {
  createEdgesGeneralSuite,
  createNodesGeneralSuite,
  createPaneGeneralSuite,
  createPaneNonDefaultsSuite,
  createPropsColorModeSuite,
} from 'storybook-shared/play-helpers';

import ColorModeStory from '../../../components/ColorModeStory.svelte';
import DragHandleNode from '../../../components/DragHandleNode.svelte';
import { exampleStoryParameters } from '../../examples/exampleStory';

import SvelteFlowExample from './Flow.svelte';
import TestFlow from './TestFlow.svelte';
import { createEventHandlerArgs, eventHandlerArgTypes } from './eventHandlers';
import {
  API_DOCS_URL,
  PROP_SECTIONS,
  SECTION_DESCRIPTIONS,
  SECTION_DOC_ANCHORS,
  defaultFlowArgs,
  sectionArgs,
  sectionControls,
  svelteFlowArgTypes,
  type PropSection,
} from './config';

const runPaneGeneralSuite = createPaneGeneralSuite('svelte');
const runPaneNonDefaultsSuite = createPaneNonDefaultsSuite('svelte');
const runNodesGeneralSuite = createNodesGeneralSuite('svelte');
const runEdgesGeneralSuite = createEdgesGeneralSuite('svelte');
const runColorModeSuite = createPropsColorModeSuite('svelte');

const nodeTypes = { DragHandleNode };

const testStoryParameters = {
  layout: 'fullscreen' as const,
  controls: { disable: true },
};

const meta = {
  title: 'Components/SvelteFlow',
  component: SvelteFlowExample,
  tags: ['components'],
  parameters: {
    ...exampleStoryParameters,
    docs: {
      description: {
        component: `Interactive playground for [\`<SvelteFlow />\`](${API_DOCS_URL}) props. Each story focuses on one docs subsection — use the controls panel to tweak values. The EventHandlers story logs callbacks in the Storybook **Actions** panel.

Stories suffixed with regression coverage (e.g. ViewportGeneral) run automated play-function tests in CI.`,
      },
    },
  },
  args: defaultFlowArgs,
  argTypes: { ...svelteFlowArgTypes, ...eventHandlerArgTypes },
} satisfies Meta<typeof SvelteFlowExample>;

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
  component: ColorModeStory,
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  play: runColorModeSuite,
};

export const ViewportProps: Story = sectionStory('viewport');

export const ViewportGeneral: Story = {
  component: TestFlow,
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  args: { flowConfig: paneGeneralConfig },
  play: runPaneGeneralSuite,
};

export const ViewportNonDefaults: Story = {
  component: TestFlow,
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  args: { flowConfig: paneNonDefaultsSvelteConfig },
  play: runPaneNonDefaultsSuite,
};

export const EdgeProps: Story = sectionStory('edge');

export const EdgeGeneral: Story = {
  component: TestFlow,
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  args: { flowConfig: edgesGeneralSvelteConfig },
  play: runEdgesGeneralSuite,
};

export const InteractionProps: Story = sectionStory('interaction');

export const InteractionGeneral: Story = {
  component: TestFlow,
  tags: ['test', 'components'],
  parameters: testStoryParameters,
  args: { flowConfig: nodesGeneralSvelteConfig, nodeTypes },
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
      include: [...PROP_SECTIONS.eventHandlers, ...Object.keys(createEventHandlerArgs())],
    },
    docs: {
      description: {
        story: `${SECTION_DESCRIPTIONS.eventHandlers} See [docs](${API_DOCS_URL}${SECTION_DOC_ANCHORS.eventHandlers}).

**General:** onflowerror, oninit, ondelete, onbeforedelete

**Node:** onnodeclick, onnodedrag*, onnodepointer*, onnodecontextmenu

**Edge:** onedgeclick, onedgecontextmenu, onedgepointer*, onreconnect*, onbeforereconnect

**Connection:** onconnect, onconnectstart, onconnectend, onbeforeconnect, onclickconnect*, isValidConnection

**Pane:** onmove, onmovestart, onmoveend, onpaneclick, onpanecontextmenu

**Selection:** onselectionchange, onselectiondrag*, onselectionstart, onselectionend, onselectionclick, onselectioncontextmenu`,
      },
    },
  },
};
