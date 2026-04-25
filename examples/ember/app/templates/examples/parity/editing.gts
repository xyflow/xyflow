import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import { pageTitle } from 'ember-page-title';
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  EmberFlow,
  EmberFlowProvider,
  Panel,
  Position,
  UseConnection,
  UseEdges,
  UseInternalNode,
  UseKeyPress,
  UseNodeConnections,
  UseNodes,
  UseNodesData,
  UseNodesInitialized,
  UseStore,
  UseViewport,
} from '@xyflow/ember';

import ToolbarNode from 'ember-examples/components/parity-samples/toolbar-node';

import type { Edge, EmberFlowStore, Node, NodeChange, Viewport } from '@xyflow/ember';

export default class EditingSample extends Component {
  @tracked apiMessage = 'Store helpers ready';

  nodeTypes = {
    ToolbarNode,
  };

  initialViewport: Viewport = { x: 260, y: 250, zoom: 0.85 };

  @tracked nodes: Node[] = [
    {
      id: 'idea',
      type: 'ToolbarNode',
      data: { label: 'Idea node', detail: 'Click to show toolbar' },
      position: { x: 140, y: 20 },
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue parity-toolbar-node',
    },
    {
      id: 'draft',
      type: 'ToolbarNode',
      data: { label: 'Draft node', detail: 'Drag me' },
      position: { x: 300, y: 80 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green parity-toolbar-node',
    },
    {
      id: 'review',
      type: 'ToolbarNode',
      data: { label: 'Review node', detail: 'Connect into me' },
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

  handleNodesChange = (changes: NodeChange[]) => {
    this.nodes = applyNodeChanges(changes, this.nodes);
  };

  addApiNode = (store: EmberFlowStore) => {
    if (store.getNode('api-added')) {
      this.apiMessage = 'api-added already exists';
      return;
    }

    store.addNodes({
      id: 'api-added',
      type: 'ToolbarNode',
      data: { label: 'API node', detail: 'Added through EmberFlowStore' },
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

  nodeDataLabel(snapshot: { data: Record<string, unknown> }) {
    return typeof snapshot.data.label === 'string' ? snapshot.data.label : '';
  }

  countIntersections = (store: EmberFlowStore) => {
    let intersections = store.getIntersectingNodes({ x: 100, y: 0, width: 560, height: 280 });
    this.apiMessage = `intersections: ${intersections.map((node) => node.id).join(', ') || 'none'}`;
  };

  inspectStoreApi = (store: EmberFlowStore) => {
    store.updateEdge('idea-draft', { label: 'API edge' });

    let flowPoint = store.screenToFlowPosition({ x: 200, y: 200 });
    let screenPoint = store.flowToScreenPosition(flowPoint);
    let snapshot = store.toObject();
    let draftConnections = store.getNodeConnections({ nodeId: 'draft' });
    let draftTargetConnections = store.getHandleConnections({ nodeId: 'draft', type: 'target' });

    this.apiMessage = [
      `snapshot ${snapshot.nodes.length}/${snapshot.edges.length}`,
      `node links ${draftConnections.length}`,
      `target links ${draftTargetConnections.length}`,
      `roundtrip ${Math.round(screenPoint.x)},${Math.round(screenPoint.y)}`,
    ].join('; ');
  };

  replaceCollections = (store: EmberFlowStore) => {
    store.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === 'review'
          ? {
              ...node,
              data: { ...node.data, label: 'Review updated' },
            }
          : node,
      ),
    );
    store.setEdges((edges) =>
      edges.map((edge) =>
        edge.id === 'draft-review'
          ? {
              ...edge,
              label: 'setEdges',
            }
          : edge,
      ),
    );
    this.apiMessage = 'setNodes + setEdges replaced collection state';
  };

  deleteApiNode = async (store: EmberFlowStore) => {
    let { deletedNodes, deletedEdges } = await store.deleteElements({ nodes: [{ id: 'api-added' }] });
    this.apiMessage = `deleted ${deletedNodes.length} node, ${deletedEdges.length} edge`;
  };

  selectSelectedCount = (store: EmberFlowStore) => store.selectedNodes.length + store.selectedEdges.length;

  <template>
    {{pageTitle "EmberFlow Editing Sample"}}
    <main class='parity-sample'>
      <EmberFlowProvider @initialViewport={{this.initialViewport}} as |providedFlow|>
        <EmberFlow
          @store={{providedFlow}}
          @nodes={{this.nodes}}
          @edges={{this.edges}}
          @nodeTypes={{this.nodeTypes}}
          @minZoom={{0.25}}
          @maxZoom={{4}}
          @onNodesChange={{this.handleNodesChange}}
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
                <li>Click a node to select it and show its toolbar.</li>
                <li>Drag selected or unselected nodes; the gray node should neither move nor pan the canvas.</li>
                <li>Shift-drag on empty canvas to marquee-select multiple nodes.</li>
                <li>Use arrow keys after selecting a node; Shift+arrow moves faster.</li>
                <li>Drag from a source handle to another node target handle to create an edge.</li>
                <li>Click a node or edge and press Backspace to delete it.</li>
                <li>Use the buttons below to exercise the provider-owned EmberFlowStore helper API.</li>
              </ol>
              <div class='parity-note-actions' aria-label='Store helper actions'>
                <button type='button' {{on 'click' (fn this.addApiNode flow)}}>add node</button>
                <button type='button' {{on 'click' (fn this.renameDraft flow)}}>update data</button>
                <button type='button' {{on 'click' (fn this.countIntersections flow)}}>intersections</button>
                <button type='button' {{on 'click' (fn this.inspectStoreApi flow)}}>store API</button>
                <button type='button' {{on 'click' (fn this.replaceCollections flow)}}>replace sets</button>
                <button type='button' {{on 'click' (fn this.deleteApiNode flow)}}>delete added</button>
              </div>
              <div class='parity-event-log' aria-label='Store helper log'>
                <span>{{this.apiMessage}}</span>
              </div>
              <div class='parity-event-log' aria-label='Store query readout'>
                <UseNodes as |nodes|>
                  <span>nodes {{nodes.length}}</span>
                </UseNodes>
                <UseEdges as |edges|>
                  <span>edges {{edges.length}}</span>
                </UseEdges>
                <UseViewport as |viewport|>
                  <span>zoom {{viewport.zoom}}</span>
                </UseViewport>
                <UseNodesInitialized as |initialized|>
                  <span>initialized {{if initialized "yes" "no"}}</span>
                </UseNodesInitialized>
                <UseInternalNode @id='draft' as |internalNode|>
                  <span>draft internals {{if internalNode "ready" "missing"}}</span>
                </UseInternalNode>
                <UseNodeConnections @id='draft' as |connections|>
                  <span>draft links {{connections.length}}</span>
                </UseNodeConnections>
                <UseNodesData @nodeId='draft' as |draftData|>
                  {{#if draftData}}
                    <span>draft data {{this.nodeDataLabel draftData}}</span>
                  {{/if}}
                </UseNodesData>
                <UseConnection as |connection|>
                  <span>connection {{if connection.inProgress "active" "idle"}}</span>
                </UseConnection>
                <UseKeyPress @key='Shift' as |pressed|>
                  <span>shift {{if pressed "down" "up"}}</span>
                </UseKeyPress>
                <UseStore @selector={{this.selectSelectedCount}} as |selectedCount|>
                  <span>selected {{selectedCount}}</span>
                </UseStore>
              </div>
            </div>
          </Panel>
          <Panel @position='bottom-right'>
            <nav class='parity-sample-nav' aria-label='Parity samples'>
              <a href='/examples/parity'>All samples</a>
              <a href='/examples/parity/viewport-controls'>Viewport</a>
              <a href='/examples/parity/custom-controls'>Custom UI</a>
              <a href='/examples/parity/node-controls'>Node UI</a>
              <a href='/examples/parity/edges'>Edges</a>
              <a href='/examples/parity/minimap'>MiniMap</a>
              <a href='/examples/parity/custom-handles'>Handles</a>
              <a href='/examples/parity/resizing'>Resize</a>
            </nav>
          </Panel>
        </EmberFlow>
      </EmberFlowProvider>
    </main>
  </template>
}
