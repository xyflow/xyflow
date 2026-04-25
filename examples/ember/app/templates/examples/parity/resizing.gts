import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { pageTitle } from 'ember-page-title';
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  EmberFlow,
  Panel,
  Position,
} from '@xyflow/ember';

import ResizableNode from 'ember-examples/components/parity-samples/resizable-node';

import type { Edge, Node, NodeChange, Viewport } from '@xyflow/ember';

export default class ResizingSample extends Component {
  nodeTypes = {
    ResizableNode,
  };

  initialViewport: Viewport = { x: 280, y: 285, zoom: 0.85 };

  @tracked nodes: Node[] = [
    {
      id: 'brief',
      type: 'ResizableNode',
      data: { label: 'Brief', detail: 'Select, then drag a resize handle' },
      position: { x: -240, y: -90 },
      width: 180,
      height: 84,
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue parity-resizable-node',
    },
    {
      id: 'layout',
      type: 'ResizableNode',
      data: { label: 'Layout', detail: 'Edges update while resizing' },
      position: { x: 70, y: 30 },
      width: 210,
      height: 96,
      selected: true,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--purple parity-resizable-node',
    },
    {
      id: 'publish',
      type: 'ResizableNode',
      data: { label: 'Publish', detail: 'Minimum size is enforced' },
      position: { x: 320, y: -70 },
      width: 190,
      height: 84,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green parity-resizable-node',
    },
  ];

  edges: Edge[] = [
    {
      id: 'brief-layout',
      source: 'brief',
      target: 'layout',
      animated: true,
    },
    {
      id: 'layout-publish',
      source: 'layout',
      target: 'publish',
    },
  ];

  handleNodesChange = (changes: NodeChange[]) => {
    this.nodes = applyNodeChanges(changes, this.nodes);
  };

  <template>
    {{pageTitle "EmberFlow Resizing Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @nodeTypes={{this.nodeTypes}}
        @initialViewport={{this.initialViewport}}
        @minZoom={{0.25}}
        @maxZoom={{4}}
        @onNodesChange={{this.handleNodesChange}}
      >
        <Background
          @variant={{BackgroundVariant.Lines}}
          @gap={{24}}
          @lineWidth={{1}}
          @color='#d7dee8'
          @bgColor='#fbfcfe'
        />
        <Controls />
        <Panel @position='top-left'>
          <div class='parity-note'>
            <strong>Node Resizing</strong>
            <ol>
              <li>The Layout node starts selected; click empty canvas or another node to hide its resize handles.</li>
              <li>Drag a corner handle; the node should resize without scaling the toolbar UI.</li>
              <li>Connected edges should follow the resized node bounds while dragging.</li>
              <li>Hold a resize drag near a viewport edge; the canvas should pan and resizing should continue.</li>
              <li>Try shrinking below the minimum size; it should clamp.</li>
            </ol>
          </div>
        </Panel>
        <Panel @position='bottom-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/viewport-controls'>Viewport</a>
            <a href='/examples/parity/custom-controls'>Custom UI</a>
            <a href='/examples/parity/node-controls'>Node UI</a>
            <a href='/examples/parity/editing'>Editing</a>
            <a href='/examples/parity/edges'>Edges</a>
            <a href='/examples/parity/minimap'>MiniMap</a>
            <a href='/examples/parity/custom-handles'>Handles</a>
          </nav>
        </Panel>
      </EmberFlow>
    </main>
  </template>
}
