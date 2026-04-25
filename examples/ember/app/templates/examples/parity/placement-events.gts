import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { pageTitle } from 'ember-page-title';
import {
  Background,
  BackgroundVariant,
  Controls,
  EmberFlow,
  Panel,
  Position,
} from '@xyflow/ember';

import type { Edge, Node, SnapGrid, Viewport } from '@xyflow/ember';

export default class PlacementEventsSample extends Component {
  @tracked events: string[] = ['Ready'];

  initialViewport: Viewport = { x: 260, y: 310, zoom: 0.8 };
  snapGrid: SnapGrid = [50, 50];

  nodes: Node[] = [
    {
      id: 'snap',
      data: { label: 'Snap grid' },
      position: { x: -100, y: -40 },
      width: 140,
      height: 64,
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue',
    },
    {
      id: 'origin',
      data: { label: 'Centered origin' },
      position: { x: 220, y: -20 },
      width: 160,
      height: 72,
      origin: [0.5, 0.5],
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--amber',
    },
    {
      id: 'extent',
      data: { label: 'Extent clamped' },
      position: { x: 420, y: -70 },
      width: 160,
      height: 72,
      extent: [
        [420, -120],
        [700, 120],
      ],
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green',
    },
  ];

  edges: Edge[] = [
    {
      id: 'snap-origin',
      source: 'snap',
      target: 'origin',
      label: 'click edge',
    },
    {
      id: 'origin-extent',
      source: 'origin',
      target: 'extent',
      animated: true,
    },
  ];

  record(message: string) {
    this.events = [message, ...this.events].slice(0, 5);
  }

  handleNodeClick = (_event: MouseEvent, node: Node) => {
    this.record(`node click: ${node.id}`);
  };

  handleEdgeClick = (_event: MouseEvent, edge: Edge) => {
    this.record(`edge click: ${edge.id}`);
  };

  handlePaneClick = () => {
    this.record('pane click');
  };

  handleNodeDragStart = (_event: PointerEvent, node: Node) => {
    this.record(`drag start: ${node.id}`);
  };

  handleNodeDragStop = (_event: PointerEvent, node: Node) => {
    this.record(`drag stop: ${node.id}`);
  };

  handleSelectionChange = ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    this.record(`selection: ${nodes.length} nodes, ${edges.length} edges`);
  };

  <template>
    {{pageTitle "EmberFlow Placement + Events Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @initialViewport={{this.initialViewport}}
        @minZoom={{0.25}}
        @maxZoom={{4}}
        @snapToGrid={{true}}
        @snapGrid={{this.snapGrid}}
        @onNodeClick={{this.handleNodeClick}}
        @onEdgeClick={{this.handleEdgeClick}}
        @onPaneClick={{this.handlePaneClick}}
        @onNodeDragStart={{this.handleNodeDragStart}}
        @onNodeDragStop={{this.handleNodeDragStop}}
        @onSelectionChange={{this.handleSelectionChange}}
      >
        <Background
          @variant={{BackgroundVariant.Dots}}
          @gap={{50}}
          @size={{2}}
          @color='#c6d1df'
          @bgColor='#fbfcfe'
        />
        <Controls />
        <Panel @position='top-left'>
          <div class='parity-note parity-note--wide'>
            <strong>Placement + Events</strong>
            <ol>
              <li>Drag the blue node; it should land on 50 px grid increments.</li>
              <li>The amber node uses a centered origin, so its position is anchored at its center.</li>
              <li>Drag the green node beyond its box; it should clamp to its extent.</li>
              <li>Click nodes, edges, or empty pane space; the event log should update.</li>
            </ol>
            <div class='parity-event-log' aria-label='Event log'>
              {{#each this.events as |event|}}
                <span>{{event}}</span>
              {{/each}}
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
            <a href='/examples/parity/resizing'>Resizing</a>
          </nav>
        </Panel>
      </EmberFlow>
    </main>
  </template>
}
