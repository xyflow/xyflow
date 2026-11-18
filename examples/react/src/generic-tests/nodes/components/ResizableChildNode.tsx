import { NodeResizer } from '@xyflow/react';

export default function ResizableChildNode() {
  return (
    <>
      <NodeResizer isVisible minWidth={20} minHeight={20} />
      <div style={{ width: '100%', height: '100%', background: '#eee' }} />
    </>
  );
}
