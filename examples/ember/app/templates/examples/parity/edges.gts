import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { pageTitle } from 'ember-page-title';
import {
  Background,
  BackgroundVariant,
  Controls,
  EdgeReconnectAnchor,
  EdgeLabelRenderer,
  EdgeToolbar,
  EmberFlow,
  type EmberFlowStore,
  MarkerType,
  Panel,
  Position,
} from '@xyflow/ember';

import type { Connection, Edge, Node, Viewport } from '@xyflow/ember';

export default class EdgesSample extends Component {
  @tracked reconnectMessage = 'Reconnect anchors ready';

  initialViewport: Viewport = { x: 390, y: 410, zoom: 0.55 };
  publicReconnectSourcePosition = { x: -156, y: -39 };
  publicReconnectTargetPosition = { x: -40, y: 231 };

  nodes: Node[] = [
    {
      id: 'source',
      data: { label: 'Source' },
      position: { x: -320, y: -80 },
      type: 'input',
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue',
    },
    {
      id: 'animated',
      data: { label: 'Animated' },
      position: { x: 10, y: -120 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green',
    },
    {
      id: 'marker',
      data: { label: 'Markers' },
      position: { x: 330, y: -20 },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--amber',
    },
    {
      id: 'hitbox',
      data: { label: 'Wide hit target' },
      position: { x: -40, y: 190 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--purple',
    },
    {
      id: 'simple',
      data: { label: 'Simple Bezier' },
      position: { x: 330, y: 190 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green',
    },
  ];

  edges: Edge[] = [
    {
      id: 'source-animated',
      source: 'source',
      target: 'animated',
      animated: true,
      style: { stroke: '#2563eb', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed },
      label: 'animated',
    },
    {
      id: 'animated-marker',
      source: 'animated',
      target: 'marker',
      style: { stroke: '#16a34a', strokeWidth: 2 },
      markerStart: { type: MarkerType.Arrow },
      markerEnd: { type: MarkerType.ArrowClosed },
      label: 'markers',
    },
    {
      id: 'source-hitbox',
      source: 'source',
      target: 'hitbox',
      interactionWidth: 60,
      style: { stroke: '#7c3aed', strokeWidth: 2, strokeDasharray: '8 5' },
      ariaLabel: 'wide hit target edge',
      label: 'wide hitbox',
    },
    {
      id: 'hitbox-simple',
      source: 'hitbox',
      target: 'simple',
      type: 'simplebezier',
      style: { stroke: '#0f766e', strokeWidth: 2 },
      label: 'simplebezier',
    },
  ];

  handleReconnect = (oldEdge: Edge, connection: Connection) => {
    this.reconnectMessage = `${oldEdge.id}: ${connection.source} -> ${connection.target}`;
  };

  inspectEdge = (edgeId: string, event: MouseEvent) => {
    event.stopPropagation();
    this.reconnectMessage = `selected: ${edgeId}`;
  };

  deleteEdge = async (flow: EmberFlowStore, edgeId: string, event: MouseEvent) => {
    event.stopPropagation();
    let { deletedEdges } = await flow.deleteElements({ edges: [{ id: edgeId }] });
    this.reconnectMessage = `deleted ${deletedEdges.length} edge`;
  };

  <template>
    {{pageTitle "EmberFlow Edges Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @initialViewport={{this.initialViewport}}
        @minZoom={{0.25}}
        @maxZoom={{4}}
        @edgesReconnectable={{true}}
        @onReconnect={{this.handleReconnect}}
        as |flow|
      >
        <EdgeToolbar
          @edgeId='source-hitbox'
          @position={{Position.Bottom}}
          @offset={{52}}
          @alignY='top'
        >
          <div class='parity-edge-toolbar' role='toolbar' aria-label='Selected edge actions'>
            <button type='button' class='nodrag nopan' {{on 'click' (fn this.inspectEdge 'source-hitbox')}}>
              inspect
            </button>
            <button type='button' class='nodrag nopan' {{on 'click' (fn this.deleteEdge flow 'source-hitbox')}}>
              delete
            </button>
          </div>
        </EdgeToolbar>
        <EdgeReconnectAnchor
          @edgeId='source-hitbox'
          @type='source'
          @position={{this.publicReconnectSourcePosition}}
          @size={{28}}
          @className='parity-public-reconnect-anchor parity-public-reconnect-anchor--source'
          @dragThreshold={{1}}
        >
          <span aria-hidden='true'></span>
        </EdgeReconnectAnchor>
        <EdgeReconnectAnchor
          @edgeId='source-hitbox'
          @type='target'
          @position={{this.publicReconnectTargetPosition}}
          @size={{28}}
          @className='parity-public-reconnect-anchor parity-public-reconnect-anchor--target'
          @dragThreshold={{1}}
        >
          <span aria-hidden='true'></span>
        </EdgeReconnectAnchor>
        <EdgeLabelRenderer>
          <div
            class='parity-renderer-label nopan nodrag'
            data-testid='edge-label-renderer-probe'
            style='position: absolute; transform: translate(410px, 110px); pointer-events: all;'
          >
            EdgeLabelRenderer
          </div>
        </EdgeLabelRenderer>
        <Background
          @variant={{BackgroundVariant.Dots}}
          @gap={{18}}
          @size={{2}}
          @color='#a8b3c1'
          @bgColor='#f8fafc'
        />
        <Controls />
        <Panel @position='top-left'>
          <div class='parity-note'>
            <strong>Edges + Markers</strong>
            <ol>
              <li>Click an edge to select it; the selected edge shows a dark action toolbar.</li>
              <li>Press Backspace after selecting an edge to delete it.</li>
              <li>Inspect or click the centered labels; they should target the owning edge.</li>
              <li>Click near the dashed purple edge; its wider interaction path should make selection easier and show an EdgeToolbar.</li>
              <li>Compare the teal simple-bezier curve against the default and marker edges.</li>
              <li>The small renderer label is portal content that moves with the viewport.</li>
              <li>Drag an invisible edge endpoint anchor to another compatible handle to reconnect the edge.</li>
              <li>The visible teal endpoint uses the public EdgeReconnectAnchor component.</li>
            </ol>
            <div class='parity-event-log' aria-label='Reconnect log'>
              <span>{{this.reconnectMessage}}</span>
            </div>
          </div>
        </Panel>
        <Panel @position='bottom-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/viewport-controls'>Viewport</a>
            <a href='/examples/parity/custom-controls'>Custom UI</a>
            <a href='/examples/parity/node-adornments'>Tile UI</a>
            <a href='/examples/parity/editing'>Editing</a>
            <a href='/examples/parity/minimap'>MiniMap</a>
            <a href='/examples/parity/custom-handles'>Handles</a>
            <a href='/examples/parity/resizing'>Resize</a>
          </nav>
        </Panel>
      </EmberFlow>
    </main>
  </template>
}
