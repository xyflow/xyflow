<script lang="ts">
  import SvelteFlow, {
    Controls,
    Background,
    BackgroundVariant,
    Minimap,
    Panel,
    createNodes,
    createEdges,
    useSvelteFlow
  } from '../../lib/index';
 
  const nodes = createNodes([
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
      position: { x: 0, y: 150 }
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Node' },
      position: { x: 300, y: 150 }
    }
  ]);

  const edges = createEdges([
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
      target: '3'
    }
  ]);

  const svelteFlow = useSvelteFlow();
</script>

<SvelteFlow
  {nodes}
  {edges}
>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <Minimap />
  <Panel position="top-right">
    <button on:click={() => svelteFlow.zoomIn()}>zoom in</button>
    <button on:click={() => svelteFlow.zoomOut({ duration: 1000 })}>zoom out transition</button>
    <button on:click={() => svelteFlow.fitView()}>fitView</button>
  </Panel>
</SvelteFlow>
