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

type ControlNodeData = {
  label: string;
  detail: string;
};

export default class NodeControlsSample extends Component {
  @tracked activeNodeId = 'strategy';
  @tracked controlMessage = 'Node controls ready';

  initialViewport: Viewport = { x: 290, y: 220, zoom: 0.9 };

  groupNodeIds = ['strategy', 'design'];
  artboardLabelNodeIds = ['strategy', 'design', 'ship'];

  nodes: Node<ControlNodeData>[] = [
    {
      id: 'strategy',
      data: { label: 'Strategy node', detail: 'App-owned controls' },
      position: { x: 120, y: 40 },
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue parity-control-node',
    },
    {
      id: 'design',
      data: { label: 'Design node', detail: 'Grouped control' },
      position: { x: 390, y: 90 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--purple parity-control-node',
    },
    {
      id: 'ship',
      data: { label: 'Ship node', detail: 'Click to retarget' },
      position: { x: 320, y: 310 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green parity-control-node',
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
    this.controlMessage = `selected ${node.id}`;
  };

  selectNode = (flow: EmberFlowStore<Node<ControlNodeData>>, nodeId: string, event: MouseEvent) => {
    event.stopPropagation();
    flow.clearSelection();
    flow.selectNode(nodeId);
    this.activeNodeId = nodeId;
    this.controlMessage = `selected ${nodeId}`;
  };

  promoteNode = (
    flow: EmberFlowStore,
    toolbar: NodeToolbarContext,
    event: MouseEvent
  ) => {
    event.stopPropagation();
    let node = toolbar.nodes[0];
    if (!node) {
      return;
    }

    flow.updateNodeData(node.id, {
      label: 'Polished node',
      detail: 'Updated by app UI',
    });
    this.activeNodeId = node.id;
    this.controlMessage = `promoted ${node.id} from NodeToolbar`;
  };

  fitNode = (
    flow: EmberFlowStore,
    toolbar: NodeToolbarContext,
    event: MouseEvent
  ) => {
    event.stopPropagation();
    let nodeId = toolbar.nodeIds[0];
    if (!nodeId) {
      return;
    }

    let bounds = flow.getNodesBounds([nodeId]);
    void flow.fitBounds(bounds, { padding: 0.6, duration: 180 });
    this.controlMessage = `fit ${nodeId}`;
  };

  tagGroup = (
    flow: EmberFlowStore,
    toolbar: NodeToolbarContext,
    event: MouseEvent
  ) => {
    event.stopPropagation();
    for (let nodeId of toolbar.nodeIds) {
      flow.updateNodeData(nodeId, (node) => ({
        detail: `${typeof node.data.detail === 'string' ? node.data.detail : 'node'} / grouped`,
      }));
    }
    this.controlMessage = `tagged ${toolbar.nodeIds.join(', ')}`;
  };

  artboardLabelFor(toolbar: NodeToolbarContext) {
    let label = toolbar.nodes[0]?.data.label;
    return typeof label === 'string' ? label : (toolbar.nodeIds[0] ?? 'node');
  }

  <template>
    {{pageTitle "EmberFlow Node Controls Sample"}}
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
        {{#each this.artboardLabelNodeIds as |nodeId|}}
          <NodeToolbar
            @nodeId={{nodeId}}
            @isVisible={{true}}
            @position={{Position.Top}}
            @align='start'
            @offset={{7}}
            @className='parity-artboard-label'
            as |_toolbarFlow toolbar|
          >
            <span aria-label='Artboard label'>{{this.artboardLabelFor toolbar}}</span>
          </NodeToolbar>
        {{/each}}

        <NodeToolbar
          @nodeId={{this.activeNodeId}}
          @isVisible={{true}}
          @position={{Position.Top}}
          @offset={{34}}
          @className='parity-control-menu parity-control-menu--node'
          as |toolbarFlow toolbar|
        >
          <div class='parity-control-menu__frame' role='toolbar' aria-label='Node control actions'>
            <span class='parity-control-menu__title'>{{this.activeNodeId}}</span>
            <button type='button' {{on 'click' (fn this.promoteNode toolbarFlow toolbar)}}>promote</button>
            <button type='button' {{on 'click' (fn this.fitNode toolbarFlow toolbar)}}>focus</button>
          </div>
        </NodeToolbar>

        <NodeToolbar
          @nodeId={{this.groupNodeIds}}
          @isVisible={{true}}
          @position={{Position.Bottom}}
          @offset={{24}}
          @className='parity-control-menu parity-control-menu--group'
          as |toolbarFlow toolbar|
        >
          <div class='parity-control-menu__frame' role='toolbar' aria-label='Group control actions'>
            <span class='parity-control-menu__title'>{{toolbar.nodes.length}} nodes</span>
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
            <strong>Node Controls</strong>
            <ol>
              <li>The dark node menu is app-owned UI positioned by NodeToolbar.</li>
              <li>Click any node to retarget the menu without putting controls inside the node component.</li>
              <li>Drag the active node; the menu should follow and stay the same screen size.</li>
              <li>The lower menu is anchored to a two-node group using an array of node ids.</li>
              <li>The gray artboard labels are passive controls that are always visible.</li>
              <li>Use the note buttons to select nodes from external Ember UI.</li>
            </ol>
            <div class='parity-note-actions' aria-label='Node selection actions'>
              <button type='button' {{on 'click' (fn this.selectNode flow 'strategy')}}>select strategy</button>
              <button type='button' {{on 'click' (fn this.selectNode flow 'design')}}>select design</button>
              <button type='button' {{on 'click' (fn this.selectNode flow 'ship')}}>select ship</button>
            </div>
            <div class='parity-event-log' aria-label='Control log'>
              <span>{{this.controlMessage}}</span>
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
            <a href='/examples/parity/minimap'>MiniMap</a>
            <a href='/examples/parity/custom-handles'>Handles</a>
            <a href='/examples/parity/resizing'>Resize</a>
          </nav>
        </Panel>
      </EmberFlow>
    </main>
  </template>
}
