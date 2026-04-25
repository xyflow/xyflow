import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { pageTitle } from 'ember-page-title';
import {
  Background,
  BackgroundVariant,
  Controls,
  EmberFlow,
  MiniMap,
  Panel,
  Position,
} from '@xyflow/ember';

import type { Edge, Node } from '@xyflow/ember';

import CustomMiniMapNode from 'ember-examples/components/parity-samples/minimap-node';

export default class MiniMapSample extends Component {
  @tracked minimapMessage = 'MiniMap callbacks ready';

  nodeComponent = CustomMiniMapNode;

  nodes: Node[] = [
    {
      id: 'north',
      data: { label: 'North' },
      position: { x: -320, y: -170 },
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue',
      style: { backgroundColor: '#eff6ff' },
    },
    {
      id: 'center',
      data: { label: 'Center' },
      position: { x: 20, y: 30 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--purple',
      style: { backgroundColor: '#f5f3ff' },
    },
    {
      id: 'south',
      data: { label: 'South' },
      position: { x: 370, y: 210 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green',
      style: { backgroundColor: '#f0fdf4' },
    },
  ];

  edges: Edge[] = [
    {
      id: 'north-center',
      source: 'north',
      target: 'center',
    },
    {
      id: 'center-south',
      source: 'center',
      target: 'south',
      animated: true,
    },
  ];

  handleMiniMapClick = (_event: MouseEvent, position: { x: number; y: number }) => {
    this.minimapMessage = `minimap click ${Math.round(position.x)},${Math.round(position.y)}`;
  };

  handleMiniMapNodeClick = (_event: MouseEvent, node: Node) => {
    this.minimapMessage = `minimap node ${node.id}`;
  };

  <template>
    {{pageTitle "EmberFlow MiniMap Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @fitView={{true}}
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
        <MiniMap
          @position='top-right'
          @nodeStrokeColor='#334155'
          @nodeStrokeWidth={{3}}
          @nodeComponent={{this.nodeComponent}}
          @nodeBorderRadius={{8}}
          @maskColor='rgba(148, 163, 184, 0.28)'
          @maskStrokeColor='#475569'
          @maskStrokeWidth={{1}}
          @pannable={{true}}
          @zoomable={{true}}
          @zoomStep={{1}}
          @ariaLabel='EmberFlow parity minimap'
          @onClick={{this.handleMiniMapClick}}
          @onNodeClick={{this.handleMiniMapNodeClick}}
        />
        <Controls />
        <Panel @position='top-left'>
          <div class='parity-note'>
            <strong>MiniMap</strong>
            <ol>
              <li>Drag the canvas and confirm the mask moves in the minimap.</li>
              <li>Drag inside the minimap to pan the main canvas.</li>
              <li>Wheel inside the minimap to zoom the main canvas.</li>
              <li>Zoom with the wheel or controls and confirm the mask changes size.</li>
              <li>Node rectangles should match the flow node placement and colors.</li>
              <li>Custom minimap nodes render as app-owned SVG components and emit node click callbacks.</li>
            </ol>
            <div class='parity-event-log' aria-label='MiniMap log'>
              <span>{{this.minimapMessage}}</span>
            </div>
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
            <a href='/examples/parity/custom-handles'>Handles</a>
            <a href='/examples/parity/resizing'>Resize</a>
          </nav>
        </Panel>
      </EmberFlow>
    </main>
  </template>
}
