import { useNodes, ViewportPortal } from '@xyflow/react';

type NodeInspectorProps = {
  color: string;
};

export default function NodeInspector({ color = '#aaa' }: NodeInspectorProps) {
  const nodes = useNodes();

  return (
    <ViewportPortal>
      {nodes.map((node) => {
        const x = node.computed?.positionAbsolute?.x || 0;
        const y = node.computed?.positionAbsolute?.y || 0;
        const height = node.computed?.height || 0;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              fontSize: 10,
              color: color,
              pointerEvents: 'none',
              zIndex: 9999,
              transform: `translate(${x}px, ${y + height}px)`,
            }}
          >
            <div>id: {node.id}</div>
            <div>type: {node.type}</div>
            <div>
              position: {x.toFixed(1)}, {y.toFixed(1)}
            </div>
            <div>data: {JSON.stringify(node.data, null, 2)}</div>
          </div>
        );
      })}
    </ViewportPortal>
  );
}
