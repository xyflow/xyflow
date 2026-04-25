import Component from '@glimmer/component';
import { pageTitle } from 'ember-page-title';
import {
  Background,
  BackgroundVariant,
  Controls,
  EmberFlow,
  Panel,
  Position,
} from '@xyflow/ember';

import ResizableNode from 'ember-examples/components/parity-samples/resizable-node';

import type { Edge, Node, Viewport } from '@xyflow/ember';

export default class ResizingSample extends Component {
  nodeTypes = {
    ResizableNode,
  };

  initialViewport: Viewport = { x: 250, y: 300, zoom: 1 };

  nodes: Node[] = [
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
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--purple parity-resizable-node',
    },
    {
      id: 'publish',
      type: 'ResizableNode',
      data: { label: 'Publish', detail: 'Minimum size is enforced' },
      position: { x: 410, y: -70 },
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
              <li>Click a node to reveal resize lines and corner handles.</li>
              <li>Drag a corner handle; the node should resize without scaling the toolbar UI.</li>
              <li>Connected edges should follow the resized node bounds while dragging.</li>
              <li>Try shrinking below the minimum size; it should clamp.</li>
            </ol>
          </div>
        </Panel>
        <Panel @position='top-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/viewport-controls'>Viewport</a>
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
