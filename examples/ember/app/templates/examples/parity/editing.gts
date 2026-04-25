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

import ToolbarNode from 'ember-examples/components/parity-samples/toolbar-node';

import type { Edge, Node, Viewport } from '@xyflow/ember';

export default class EditingSample extends Component {
  nodeTypes = {
    ToolbarNode,
  };

  initialViewport: Viewport = { x: 230, y: 400, zoom: 1 };

  nodes: Node[] = [
    {
      id: 'idea',
      type: 'ToolbarNode',
      data: { label: 'Idea card', detail: 'Click to show toolbar' },
      position: { x: -220, y: -80 },
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue parity-toolbar-node',
    },
    {
      id: 'draft',
      type: 'ToolbarNode',
      data: { label: 'Draft card', detail: 'Drag me' },
      position: { x: 30, y: -40 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green parity-toolbar-node',
    },
    {
      id: 'review',
      type: 'ToolbarNode',
      data: { label: 'Review card', detail: 'Connect into me' },
      position: { x: 280, y: 100 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--amber parity-toolbar-node',
    },
    {
      id: 'locked',
      data: { label: 'Not draggable' },
      position: { x: -70, y: 190 },
      draggable: false,
      targetPosition: Position.Top,
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--muted nopan',
    },
  ];

  edges: Edge[] = [
    {
      id: 'idea-draft',
      source: 'idea',
      target: 'draft',
    },
    {
      id: 'draft-review',
      source: 'draft',
      target: 'review',
      animated: true,
    },
  ];

  <template>
    {{pageTitle "EmberFlow Editing Sample"}}
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
            <strong>Editing + Toolbar</strong>
            <ol>
              <li>Click a card to select it and show its toolbar.</li>
              <li>Drag selected or unselected cards; the gray node should neither move nor pan the canvas.</li>
              <li>Shift-drag on empty canvas to marquee-select multiple nodes.</li>
              <li>Drag from a source handle to another card target handle to create an edge.</li>
              <li>Click a node or edge and press Backspace to delete it.</li>
            </ol>
          </div>
        </Panel>
        <Panel @position='top-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/viewport-controls'>Viewport</a>
            <a href='/examples/parity/edges'>Edges</a>
            <a href='/examples/parity/minimap'>MiniMap</a>
            <a href='/examples/parity/custom-handles'>Handles</a>
            <a href='/examples/parity/resizing'>Resize</a>
          </nav>
        </Panel>
      </EmberFlow>
    </main>
  </template>
}
