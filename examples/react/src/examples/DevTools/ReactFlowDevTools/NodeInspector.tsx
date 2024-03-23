import { useNodes, ViewportPortal } from '@xyflow/react';

type NodeInfoProps = {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  data: any;
};

function NodeInfo({ id, type, x, y, width, height, data }: NodeInfoProps) {
  if (!width || !height) {
    return <div></div>;
  }

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 9999,
        transform: `translate(${x}px, ${y + height}px)`,
        padding: 5,
        boxSizing: 'border-box',
        width: width * 2,
      }}
    >
      <div>id: {id}</div>
      <div>type: {type}</div>
      <div>
        position: {x.toFixed(1)}, {y.toFixed(1)}
      </div>
      <div>
        dimensions: {width} × {height}
      </div>
      <div>data: {JSON.stringify(data, null, 2)}</div>
    </div>
  );
}

type NodeInspectorProps = {
  color: string;
};

export default function NodeInspector({ color = '#555' }: NodeInspectorProps) {
  const nodes = useNodes();

  return (
    <ViewportPortal>
      <div style={{ color, fontSize: 10, fontFamily: 'monospace' }}>
        {nodes.map((node) => {
          const x = node.computed?.positionAbsolute?.x || 0;
          const y = node.computed?.positionAbsolute?.y || 0;
          const width = node.computed?.width || 0;
          const height = node.computed?.height || 0;

          return (
            <NodeInfo
              key={node.id}
              id={node.id}
              type={node.type || 'default'}
              x={x}
              y={y}
              width={width}
              height={height}
              data={node.data}
            />
          );
        })}
      </div>
    </ViewportPortal>
  );
}
