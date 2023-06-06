<script lang="ts">
    import { writable } from 'svelte/store';
  import SvelteFlow, {
    Controls,
    Panel,
    PanOnScrollMode,
    MiniMap,
    type OnMoveEnd,
    type Node,
    type Edge,
  } from '../../lib/index';

  const nodes = writable([
    {
      id: '1',
      type: 'input',
      data: { label: 'Node 1' },
      position: { x: 250, y: 5 },
    },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
    { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
    { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
  ]);

  const edges = writable([
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3' },
  ]);

  const onNodeDragStart = (_: MouseEvent, node: Node) => console.log('drag start', node);
  const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
  const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);
  const onEdgeClick = (_: MouseEvent, edge: Edge) => console.log('click', edge);
  const onPaneClick = (event: MouseEvent) => console.log('onPaneClick', event);
  const onPaneScroll = (event?: WheelEvent) => console.log('onPaneScroll', event);
  const onPaneContextMenu = (event: MouseEvent) => console.log('onPaneContextMenu', event);
  const onMoveEnd: OnMoveEnd = (_, viewport) => console.log('onMoveEnd', viewport);


  let isSelectable = false;
  let isDraggable = false;
  let isConnectable = false;
  let zoomOnScroll = false;
  let zoomOnPinch = false;
  let panOnScroll = false;
  let panOnScrollMode = PanOnScrollMode.Free;
  let zoomOnDoubleClick = false;
  let panOnDrag = true;
  let captureZoomClick = false;
  let captureZoomScroll = false;
  let captureElementClick = false;
</script>

<SvelteFlow
  {nodes}
  {edges}
  elementsSelectable={isSelectable}
  nodesConnectable={isConnectable}
  nodesDraggable={isDraggable}
  zoomOnScroll={zoomOnScroll}
  zoomOnPinch={zoomOnPinch}
  panOnScroll={panOnScroll}
  panOnScrollMode={panOnScrollMode}
  zoomOnDoubleClick={zoomOnDoubleClick}
  panOnDrag={panOnDrag}
  onMoveEnd={onMoveEnd}
>
  <MiniMap />
  <Controls />

  <Panel position="top-right">
    <div>
      <label for="draggable">
        nodesDraggable
        <input
          id="draggable"
          type="checkbox"
          bind:checked={isDraggable}
          class="react-flow__draggable"
        />
      </label>
    </div>
    <div>
      <label for="connectable">
        nodesConnectable
        <input
          id="connectable"
          type="checkbox"
          bind:checked={isConnectable}
          class="react-flow__connectable"
        />
      </label>
    </div>
    <div>
      <label for="selectable">
        elementsSelectable
        <input
          id="selectable"
          type="checkbox"
          bind:checked={isSelectable}
          class="react-flow__selectable"
        />
      </label>
    </div>
    <div>
      <label for="zoomonscroll">
        zoomOnScroll
        <input
          id="zoomonscroll"
          type="checkbox"
          bind:checked={zoomOnScroll}
          class="react-flow__zoomonscroll"
        />
      </label>
    </div>
    <div>
      <label for="zoomonpinch">
        zoomOnPinch
        <input
          id="zoomonpinch"
          type="checkbox"
          bind:checked={zoomOnPinch}
          class="react-flow__zoomonpinch"
        />
      </label>
    </div>
    <div>
      <label for="panonscroll">
        panOnScroll
        <input
          id="panonscroll"
          type="checkbox"
          bind:checked={panOnScroll}
          class="react-flow__panonscroll"
        />
      </label>
    </div>
    <div>
      <label for="panonscrollmode">
        panOnScrollMode
        <select
          id="panonscrollmode"
          bind:value={panOnScrollMode}
          on:change={(event) => { panOnScrollMode = PanOnScrollMode.Free }}
          class="react-flow__panonscrollmode"
        >
          <option value="free">free</option>
          <option value="horizontal">horizontal</option>
          <option value="vertical">vertical</option>
        </select>
      </label>
    </div>
    <div>
      <label for="zoomondbl">
        zoomOnDoubleClick
        <input
          id="zoomondbl"
          type="checkbox"
          bind:checked={zoomOnDoubleClick}
          class="react-flow__zoomondbl"
        />
      </label>
    </div>
    <div>
      <label for="panondrag">
        panOnDrag
        <input
          id="panondrag"
          type="checkbox"
          bind:checked={panOnDrag}
          class="react-flow__panondrag"
        />
      </label>
    </div>
    <div>
      <label for="capturezoompaneclick">
        capture onPaneClick
        <input
          id="capturezoompaneclick"
          type="checkbox"
          bind:checked={captureZoomClick}
          class="react-flow__capturezoompaneclick"
        />
      </label>
    </div>
    <div>
      <label for="capturezoompanescroll">
        capture onPaneScroll
        <input
          id="capturezoompanescroll"
          type="checkbox"
          bind:checked={captureZoomScroll}
          class="react-flow__capturezoompanescroll"
        />
      </label>
    </div>
    <div>
      <label for="captureelementclick">
        capture onElementClick
        <input
          id="captureelementclick"
          type="checkbox"
          bind:checked={captureElementClick}
          class="react-flow__captureelementclick"
        />
      </label>
    </div>
  </Panel>
</SvelteFlow>
