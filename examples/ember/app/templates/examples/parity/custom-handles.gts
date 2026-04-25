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

import HandleNode from 'ember-examples/components/parity-samples/handle-node';

import type { Edge, Node, Viewport } from '@xyflow/ember';

export default class CustomHandlesSample extends Component {
  nodeTypes = {
    HandleNode,
  };

  initialViewport: Viewport = { x: 260, y: 315, zoom: 0.9 };

  nodes: Node[] = [
    {
      id: 'start',
      type: 'HandleNode',
      data: { label: 'Start', tone: 'custom source handle' },
      position: { x: -240, y: -80 },
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue parity-handle-node',
    },
    {
      id: 'middle',
      type: 'HandleNode',
      data: { label: 'Transform', tone: 'custom in/out handles' },
      position: { x: 40, y: 20 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--purple parity-handle-node',
    },
    {
      id: 'done',
      type: 'HandleNode',
      data: { label: 'Done', tone: 'custom target handle' },
      position: { x: 320, y: -60 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green parity-handle-node',
    },
  ];

  edges: Edge[] = [
    {
      id: 'start-middle',
      source: 'start',
      target: 'middle',
      sourceHandle: 'out',
      targetHandle: 'in',
      animated: true,
    },
  ];

  <template>
    {{pageTitle "EmberFlow Custom Handles Sample"}}
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
          @variant={{BackgroundVariant.Dots}}
          @gap={{24}}
          @size={{2}}
          @color='#9aa7b7'
          @bgColor='#fbfcfe'
        />
        <Controls />
        <Panel @position='top-left'>
          <div class='parity-note'>
            <strong>Custom Handles</strong>
            <ol>
              <li>Drag from the blue node right handle to a target handle to create a new edge.</li>
              <li>Custom handles are DOM elements inside a custom Ember node component.</li>
              <li>The created connection preserves source and target handle ids.</li>
              <li>Release near a compatible handle; the connection should magnetize without pixel-perfect targeting.</li>
              <li>Zoom and pan; handle positions should remain pinned to their nodes.</li>
            </ol>
          </div>
        </Panel>
        <Panel @position='bottom-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/viewport-controls'>Viewport</a>
            <a href='/examples/parity/custom-controls'>Custom UI</a>
            <a href='/examples/parity/editing'>Editing</a>
            <a href='/examples/parity/edges'>Edges</a>
            <a href='/examples/parity/minimap'>MiniMap</a>
            <a href='/examples/parity/resizing'>Resize</a>
          </nav>
        </Panel>
      </EmberFlow>
    </main>
  </template>
}
