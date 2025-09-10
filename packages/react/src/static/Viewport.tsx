import { ReactNode } from 'react';
import { type Viewport } from '@xyflow/system';

export function Viewport({ viewport, children }: { viewport: Viewport; children: ReactNode }) {
  return (
    <div
      className="react-flow__viewport react-flow__container"
      style={{
        transform: `translate(${viewport.x}px,${viewport.y}px) scale(${viewport.zoom})`,
      }}
    >
      {children}
    </div>
  );
}
