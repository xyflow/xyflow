import { useEffect, useRef } from 'react';
import { useUpdateNodeInternals, useReactFlow, type NodeProps } from '@xyflow/react';

export default function UpdateNodeInternalsNode({ id }: NodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  const { getInternalNode } = useReactFlow();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = window as any;
    w.__updateNodeInternals = updateNodeInternals;
    w.__getInternalNode = getInternalNode;
    w.__nodeId = id;
    w.__expandContainer = () => {
      const container = containerRef.current;
      if (container && !container.querySelector('.extra-content')) {
        const extra = document.createElement('div');
        extra.className = 'extra-content';
        extra.style.height = '150px';
        extra.style.background = '#a8dadc';
        container.appendChild(extra);
      }
    };
  }, [id, updateNodeInternals, getInternalNode]);

  return (
    <div className="update-internals-node" style={{ padding: 10, border: '1px solid #ccc', background: '#fff' }}>
      <div>Update Internals</div>
      <div ref={containerRef} className="toggle-container" />
    </div>
  );
}
