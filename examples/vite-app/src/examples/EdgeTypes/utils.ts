import { Edge, Node, Position } from '@xyflow/react';

const nodeWidth = 80;
const nodeGapWidth = nodeWidth * 2;
const nodeStyle = { width: nodeWidth, fontSize: 11, color: 'white' };

const sourceTargetPositions = [
  { source: Position.Bottom, target: Position.Top },
  { source: Position.Right, target: Position.Left },
];
const nodeColors = [
  ['#0c5956', '#1e9e99', '#4cb3ac', '#6ec9c0', '#8ddfd4'],
  ['#0f4c75', '#1b5d8b', '#276fa1', '#3282b8', '#4fa6e0'],
];
const edgeTypes = ['default', 'step', 'smoothstep', 'straight', 'simplebezier'];
const offsets = [
  {
    x: 0,
    y: -nodeGapWidth,
  },
  {
    x: nodeGapWidth,
    y: -nodeGapWidth,
  },
  {
    x: nodeGapWidth,
    y: 0,
  },
  {
    x: nodeGapWidth,
    y: nodeGapWidth,
  },
  {
    x: 0,
    y: nodeGapWidth,
  },
  {
    x: -nodeGapWidth,
    y: nodeGapWidth,
  },
  {
    x: -nodeGapWidth,
    y: 0,
  },
  {
    x: -nodeGapWidth,
    y: -nodeGapWidth,
  },
];

let id = 0;
const getNodeId = (): string => (id++).toString();

export function getElements(): { nodes: Node[]; edges: Edge[] } {
  const initialElements = { nodes: [] as Node[], edges: [] as Edge[] };

  for (let sourceTargetIndex = 0; sourceTargetIndex < sourceTargetPositions.length; sourceTargetIndex++) {
    const currSourceTargetPos = sourceTargetPositions[sourceTargetIndex];

    for (let edgeTypeIndex = 0; edgeTypeIndex < edgeTypes.length; edgeTypeIndex++) {
      const currEdgeType = edgeTypes[edgeTypeIndex];

      for (let offsetIndex = 0; offsetIndex < offsets.length; offsetIndex++) {
        const currOffset = offsets[offsetIndex];

        const style = {
          ...nodeStyle,
          background: nodeColors[sourceTargetIndex][edgeTypeIndex],
        };
        const sourcePosition = {
          x: offsetIndex * nodeWidth * 4,
          y: edgeTypeIndex * 300 + sourceTargetIndex * edgeTypes.length * 300,
        };
        const sourceId = getNodeId();
        const sourceData = { label: `Source ${sourceId}` };
        const sourceNode: Node = {
          id: sourceId,
          style,
          data: sourceData,
          position: sourcePosition,
          sourcePosition: currSourceTargetPos.source,
          targetPosition: currSourceTargetPos.target,
        };

        const targetId = getNodeId();
        const targetData = { label: `Target ${targetId}` };
        const targetPosition = {
          x: sourcePosition.x + currOffset.x,
          y: sourcePosition.y + currOffset.y,
        };
        const targetNode: Node = {
          id: targetId,
          style,
          data: targetData,
          position: targetPosition,
          sourcePosition: currSourceTargetPos.source,
          targetPosition: currSourceTargetPos.target,
        };

        initialElements.nodes.push(sourceNode);
        initialElements.nodes.push(targetNode);

        initialElements.edges.push({
          id: `${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          type: currEdgeType,
        } as Edge);
      }
    }
  }

  return initialElements;
}
