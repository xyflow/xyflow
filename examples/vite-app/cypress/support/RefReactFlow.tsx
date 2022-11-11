import { useEffect, useRef } from 'react';
import ReactFlow from 'reactflow';

export function RefReactFlow({ onGetRef }: { onGetRef: (element: HTMLDivElement | null) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onGetRef(ref.current);
  }, []);

  return <ReactFlow ref={ref} />;
}
