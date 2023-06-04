<script lang="ts">
  import SvelteFlow, {
    SvelteFlowProvider,
    Controls,
    Background,
    BackgroundVariant,
    Minimap,
    createNodes,
    createEdges,
    type Node,
    type Edge
  } from '../../lib/index';

  const yNodes = 20;
  const xNodes = 20;

  const nodeItems: Node[] = [];
  const edgeItems: Edge[] = [];

  let source = null;

  for (let y = 0; y < yNodes; y++) {
    for (let x = 0; x < xNodes; x++) {
      const position = { x: x * 100, y: y * 50 };
      const id = `${x}-${y}`;
      const data = { label: `Node ${id}` };
      const node = {
        id,
        data,
        position,
        type: 'default',
      };
      nodeItems.push(node);

      if (source) {
        const edge = {
          id: `${source.id}-${id}`,
          source: source.id,
          target: id,
        };
        edgeItems.push(edge);
      }

      source = node;
    }
  }

  const nodes = createNodes(nodeItems);
  const edges = createEdges(edgeItems, { animated: true });
</script>

<SvelteFlowProvider
  {nodes}
  {edges}
>
  <SvelteFlow
    fitView
    minZoom={0.2}
  >
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <Minimap />
  </SvelteFlow>
</SvelteFlowProvider>