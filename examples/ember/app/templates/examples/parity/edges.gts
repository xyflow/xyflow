import Component from '@glimmer/component';
import { pageTitle } from 'ember-page-title';
import {
  Background,
  BackgroundVariant,
  Controls,
  EdgeToolbar,
  EmberFlow,
  MarkerType,
  Panel,
  Position,
} from '@xyflow/ember';

import type { Edge, Node } from '@xyflow/ember';

export default class EdgesSample extends Component {
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
      targetPosition: Position.Left,
      className: 'parity-node parity-node--purple',
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
  ];

  <template>
    {{pageTitle "EmberFlow Edges Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @fitView={{true}}
        @minZoom={{0.25}}
        @maxZoom={{4}}
      >
        <EdgeToolbar
          @edgeId='source-hitbox'
          @position={{Position.Top}}
          @offset={{18}}
        >
          <div class='parity-edge-toolbar'>selected edge</div>
        </EdgeToolbar>
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
              <li>Click an edge to select it; a subtle outline and label keyline mark selection.</li>
              <li>Press Backspace after selecting an edge to delete it.</li>
              <li>Inspect or click the centered labels; they should target the owning edge.</li>
              <li>Click near the dashed purple edge; its wider interaction path should make selection easier and show an EdgeToolbar.</li>
            </ol>
          </div>
        </Panel>
        <Panel @position='top-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/viewport-controls'>Viewport</a>
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
