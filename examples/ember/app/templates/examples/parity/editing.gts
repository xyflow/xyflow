import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
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

import ToolbarNode from 'ember-examples/components/parity-samples/toolbar-node';

import type { Edge, EmberFlowStore, Node, Viewport } from '@xyflow/ember';

export default class EditingSample extends Component {
  @tracked apiMessage = 'Store helpers ready';

  nodeTypes = {
    ToolbarNode,
  };

  initialViewport: Viewport = { x: 260, y: 250, zoom: 0.85 };

  nodes: Node[] = [
    {
      id: 'idea',
      type: 'ToolbarNode',
      data: { label: 'Idea card', detail: 'Click to show toolbar' },
      position: { x: 140, y: 20 },
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue parity-toolbar-node',
    },
    {
      id: 'draft',
      type: 'ToolbarNode',
      data: { label: 'Draft card', detail: 'Drag me' },
      position: { x: 300, y: 80 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green parity-toolbar-node',
    },
    {
      id: 'review',
      type: 'ToolbarNode',
      data: { label: 'Review card', detail: 'Connect into me' },
      position: { x: 360, y: 230 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--amber parity-toolbar-node',
    },
    {
      id: 'locked',
      data: { label: 'Not draggable' },
      position: { x: 220, y: 330 },
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

  addApiNode = (store: EmberFlowStore) => {
    if (store.getNode('api-added')) {
      this.apiMessage = 'api-added already exists';
      return;
    }

    store.addNodes({
      id: 'api-added',
      type: 'ToolbarNode',
      data: { label: 'API card', detail: 'Added through EmberFlowStore' },
      position: { x: 520, y: 150 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--blue parity-toolbar-node',
    });
    store.addEdges({
      id: 'review-api-added',
      source: 'review',
      target: 'api-added',
      animated: true,
    });
    this.apiMessage = 'addNodes + addEdges inserted api-added';
  };

  renameDraft = (store: EmberFlowStore) => {
    store.updateNodeData('draft', {
      label: 'Updated draft',
      detail: 'Changed through updateNodeData',
    });
    this.apiMessage = 'updateNodeData changed draft';
  };

  countIntersections = (store: EmberFlowStore) => {
    let intersections = store.getIntersectingNodes({ x: 100, y: 0, width: 560, height: 280 });
    this.apiMessage = `intersections: ${intersections.map((node) => node.id).join(', ') || 'none'}`;
  };

  deleteApiNode = async (store: EmberFlowStore) => {
    let { deletedNodes, deletedEdges } = await store.deleteElements({ nodes: [{ id: 'api-added' }] });
    this.apiMessage = `deleted ${deletedNodes.length} node, ${deletedEdges.length} edge`;
  };

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
        as |flow|
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
              <li>Use the buttons below to exercise EmberFlowStore helper parity.</li>
            </ol>
            <div class='parity-note-actions' aria-label='Store helper actions'>
              <button type='button' {{on 'click' (fn this.addApiNode flow)}}>add node</button>
              <button type='button' {{on 'click' (fn this.renameDraft flow)}}>update data</button>
              <button type='button' {{on 'click' (fn this.countIntersections flow)}}>intersections</button>
              <button type='button' {{on 'click' (fn this.deleteApiNode flow)}}>delete added</button>
            </div>
            <div class='parity-event-log' aria-label='Store helper log'>
              <span>{{this.apiMessage}}</span>
            </div>
          </div>
        </Panel>
        <Panel @position='bottom-right'>
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
