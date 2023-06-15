<script lang="ts">
  import { writable } from 'svelte/store';
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    Panel,
    SelectionMode,
    type NodeTypes,
    type EdgeTypes
  } from '../../lib/index';

  import { CustomNode } from './CustomNode';
  import { CustomEdge } from './CustomEdge';

  const nodeTypes: NodeTypes = {
    custom: CustomNode
  };

  const edgeTypes: EdgeTypes = {
    custom: CustomEdge
  };

  const nodes = writable([
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 150, y: 5 }
    },
    {
      id: '2',
      type: 'default',
      data: { label: 'Node' },
      position: { x: 0, y: 150 },
      selectable: false
    },
    {
      id: 'A',
      type: 'default',
      data: { label: 'Styled with class' },
      class: 'custom-style',
      position: { x: 150, y: 150 }
    },
    {
      id: 'D',
      type: 'default',
      data: { label: 'Not draggable' },
      position: { x: 150, y: 200 },
      draggable: false
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Node' },
      position: { x: 300, y: 150 }
    },
    {
      id: 'B',
      type: 'default',
      data: { label: 'Styled with style' },
      style: 'border: 2px solid #ff5050;',
      position: { x: 450, y: 150 }
    },
    {
      id: '4',
      type: 'custom',
      data: { label: 'Custom Node' },
      position: { x: 150, y: 300 }
    }
  ]);

  const edges = writable([
    {
      id: '1-2',
      type: 'default',
      source: '1',
      target: '2',
      label: 'Edge Text'
    },
    {
      id: '1-3',
      type: 'smoothstep',
      source: '1',
      target: '3',
      selectable: false
    },
    {
      id: '2-4',
      type: 'custom',
      source: '2',
      target: '4',
      animated: true
    }
  ]);

  function updateNode() {
    nodes.update((nds) =>
      nds.map((n) => {
        if (n.id === '1') {
          return {
            ...n,
            position: { x: n.position.x + 20, y: n.position.y }
          };
        }

        return n;
      })
    );
  }

  $: {
    console.log('nodes changed', $nodes);
  }
</script>

<SvelteFlow
  {nodes}
  {edges}
  {nodeTypes}
  {edgeTypes}
  fitView
  minZoom={0.1}
  maxZoom={2.5}
  selectionMode={SelectionMode.Full}
  initialViewport={{ x: 100, y: 100, zoom: 2 }}
  snapGrid={[25, 25]}
  on:node:click={(event) => console.log('on node click', event)}
  on:node:mouseenter={(event) => console.log('on node enter', event)}
  on:node:mouseleave={(event) => console.log('on node leave', event)}
  on:edge:click={(event) => console.log('edge click', event)}
  on:connect:start={(event) => console.log('on connect start', event)}
  on:connect={(event) => console.log('on connect', event)}
  on:connect:end={(event) => console.log('on connect end', event)}
  on:pane:click={(event) => console.log('on pane click', event)}
  on:pane:contextmenu={(event) => {
    event.preventDefault();
    console.log('on pane contextmenu', event);
  }}
>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
  <Panel position="top-right">
    <button on:click={updateNode}>update node pos</button>
  </Panel>
</SvelteFlow>

<style>
  :global(.svelte-flow .custom-style) {
    background: #ff5050;
    color: white;
  }

  :root {
    --background-color: #ffffdd;
    --background-pattern-color: #5050ff;

    --minimap-background-color: #f5f6f7;
    --minimap-mask-color: rgb(255, 255, 240, 0.6);

    --controls-button-background-color: #ddd;
    --controls-button-background-color-hover: #ccc;
  }
</style>
