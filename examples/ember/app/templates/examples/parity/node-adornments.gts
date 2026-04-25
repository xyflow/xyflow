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
  NodeToolbar,
  Panel,
  Position,
} from '@xyflow/ember';

import type { Edge, EmberFlowStore, Node, NodeToolbarContext, Viewport } from '@xyflow/ember';

type AdornmentNodeData = {
  label: string;
  detail: string;
};

export default class NodeAdornmentsSample extends Component {
  @tracked activeNodeId = 'strategy';
  @tracked adornmentMessage = 'Tile adornments ready';

  initialViewport: Viewport = { x: 290, y: 220, zoom: 0.9 };

  groupNodeIds = ['strategy', 'design'];

  nodes: Node<AdornmentNodeData>[] = [
    {
      id: 'strategy',
      data: { label: 'Strategy tile', detail: 'App-owned controls' },
      position: { x: 120, y: 40 },
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue parity-adornment-node',
    },
    {
      id: 'design',
      data: { label: 'Design tile', detail: 'Grouped adornment' },
      position: { x: 390, y: 90 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--purple parity-adornment-node',
    },
    {
      id: 'ship',
      data: { label: 'Ship tile', detail: 'Click to retarget' },
      position: { x: 320, y: 310 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green parity-adornment-node',
    },
  ];

  edges: Edge[] = [
    {
      id: 'strategy-design',
      source: 'strategy',
      target: 'design',
    },
    {
      id: 'design-ship',
      source: 'design',
      target: 'ship',
      animated: true,
    },
  ];

  handleNodeClick = (_event: MouseEvent, node: Node) => {
    this.activeNodeId = node.id;
    this.adornmentMessage = `selected ${node.id}`;
  };

  selectTile = (flow: EmberFlowStore, nodeId: string, event: MouseEvent) => {
    event.stopPropagation();
    flow.clearSelection();
    flow.selectNode(nodeId);
    this.activeNodeId = nodeId;
    this.adornmentMessage = `selected ${nodeId}`;
  };

  promoteTile = (
    flow: EmberFlowStore<Node<AdornmentNodeData>>,
    toolbar: NodeToolbarContext<Node<AdornmentNodeData>>,
    event: MouseEvent
  ) => {
    event.stopPropagation();
    let node = toolbar.nodes[0];
    if (!node) {
      return;
    }

    flow.updateNodeData(node.id, {
      label: 'Polished tile',
      detail: 'Updated by app UI',
    });
    this.activeNodeId = node.id;
    this.adornmentMessage = `promoted ${node.id} from NodeToolbar`;
  };

  fitTile = (
    flow: EmberFlowStore<Node<AdornmentNodeData>>,
    toolbar: NodeToolbarContext<Node<AdornmentNodeData>>,
    event: MouseEvent
  ) => {
    event.stopPropagation();
    let nodeId = toolbar.nodeIds[0];
    if (!nodeId) {
      return;
    }

    let bounds = flow.getNodesBounds([nodeId]);
    void flow.fitBounds(bounds, { padding: 0.6, duration: 180 });
    this.adornmentMessage = `fit ${nodeId}`;
  };

  tagGroup = (
    flow: EmberFlowStore<Node<AdornmentNodeData>>,
    toolbar: NodeToolbarContext<Node<AdornmentNodeData>>,
    event: MouseEvent
  ) => {
    event.stopPropagation();
    for (let nodeId of toolbar.nodeIds) {
      flow.updateNodeData(nodeId, (node) => ({
        detail: `${node.data.detail} / grouped`,
      }));
    }
    this.adornmentMessage = `tagged ${toolbar.nodeIds.join(', ')}`;
  };

  <template>
    {{pageTitle "EmberFlow Tile Adornments Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @initialViewport={{this.initialViewport}}
        @minZoom={{0.25}}
        @maxZoom={{4}}
        @onNodeClick={{this.handleNodeClick}}
        as |flow|
      >
        <NodeToolbar
          @nodeId={{this.activeNodeId}}
          @isVisible={{true}}
          @position={{Position.Top}}
          @offset={{18}}
          @className='parity-adornment-menu parity-adornment-menu--tile'
          as |toolbarFlow toolbar|
        >
          <div class='parity-adornment-menu__surface' role='toolbar' aria-label='Tile adornment actions'>
            <span class='parity-adornment-menu__title'>{{this.activeNodeId}}</span>
            <button type='button' {{on 'click' (fn this.promoteTile toolbarFlow toolbar)}}>promote</button>
            <button type='button' {{on 'click' (fn this.fitTile toolbarFlow toolbar)}}>focus</button>
          </div>
        </NodeToolbar>

        <NodeToolbar
          @nodeId={{this.groupNodeIds}}
          @isVisible={{true}}
          @position={{Position.Bottom}}
          @offset={{24}}
          @className='parity-adornment-menu parity-adornment-menu--group'
          as |toolbarFlow toolbar|
        >
          <div class='parity-adornment-menu__surface' role='toolbar' aria-label='Group adornment actions'>
            <span class='parity-adornment-menu__title'>{{toolbar.nodes.length}} tiles</span>
            <button type='button' {{on 'click' (fn this.tagGroup toolbarFlow toolbar)}}>tag group</button>
          </div>
        </NodeToolbar>

        <Background
          @variant={{BackgroundVariant.Dots}}
          @gap={{22}}
          @size={{2}}
          @color='#b8c5d6'
          @bgColor='#f8fafc'
        />
        <Controls />
        <Panel @position='top-left'>
          <div class='parity-note'>
            <strong>Tile Adornments</strong>
            <ol>
              <li>The dark tile menu is app-owned UI positioned by NodeToolbar.</li>
              <li>Click any tile to retarget the menu without putting controls inside the node component.</li>
              <li>Drag the active tile; the menu should follow and stay the same screen size.</li>
              <li>The lower menu is anchored to a two-tile group using an array of node ids.</li>
              <li>Use the note buttons to select tiles from external Ember UI.</li>
            </ol>
            <div class='parity-note-actions' aria-label='Tile selection actions'>
              <button type='button' {{on 'click' (fn this.selectTile flow 'strategy')}}>select strategy</button>
              <button type='button' {{on 'click' (fn this.selectTile flow 'design')}}>select design</button>
              <button type='button' {{on 'click' (fn this.selectTile flow 'ship')}}>select ship</button>
            </div>
            <div class='parity-event-log' aria-label='Adornment log'>
              <span>{{this.adornmentMessage}}</span>
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
