import { useRef, useState, type ReactNode } from 'react';
import type { Transform } from '@xyflow/system';

import { useStoreApi } from '../../hooks/useStore';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';

const toTransformString = (transform: Transform) =>
  `translate(${transform[0]}px,${transform[1]}px) scale(${transform[2]})`;

type ViewportProps = {
  children: ReactNode;
};

export function Viewport({ children }: ViewportProps) {
  const store = useStoreApi();
  const viewportRef = useRef<HTMLDivElement>(null);
  // seed the transform for first paint and SSR without subscribing, so we don't re-render on pan/zoom
  const [initialTransform] = useState(() => store.getState().transform);

  // transform changes every pan/zoom frame, so write it to the DOM directly to keep React out of the hot path
  useIsomorphicLayoutEffect(() => {
    let prevTransform: Transform | null = null;

    const applyTransform = () => {
      const transform = store.getState().transform;

      // store.subscribe fires on every update, so only touch the DOM when x, y or zoom actually changed
      if (
        prevTransform &&
        transform[0] === prevTransform[0] &&
        transform[1] === prevTransform[1] &&
        transform[2] === prevTransform[2]
      ) {
        return;
      }

      prevTransform = transform;

      if (viewportRef.current) {
        viewportRef.current.style.transform = toTransformString(transform);
      }
    };

    applyTransform();

    return store.subscribe(applyTransform);
  }, [store]);

  return (
    <div
      ref={viewportRef}
      className="react-flow__viewport xyflow__viewport react-flow__container"
      style={{ transform: toTransformString(initialTransform) }}
    >
      {children}
    </div>
  );
}
