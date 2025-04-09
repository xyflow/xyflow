import { CSSProperties, memo, useRef } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';

import { useStore } from '../../hooks/useStore';
import { DotPattern, LinePattern } from './Patterns';
import { containerStyle } from '../../styles/utils';
import { type BackgroundProps, BackgroundVariant } from './types';
import { type ReactFlowState } from '../../types';

const defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6,
};

const selector = (s: ReactFlowState) => ({ transform: s.transform, patternId: `pattern-${s.rfId}` });

function BackgroundComponent({
  id,
  variant = BackgroundVariant.Dots,
  // only used for dots and cross
  gap = 20,
  // only used for lines and cross
  size,
  lineWidth = 1,
  offset = 0,
  color,
  bgColor,
  style,
  className,
  patternClassName,
}: BackgroundProps) {
  const ref = useRef<SVGSVGElement>(null);
  const { transform, patternId } = useStore(selector, shallow);
  const patternSize = size || defaultSize[variant];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY: [number, number] = Array.isArray(gap) ? gap : [gap, gap];
  const scaledGap: [number, number] = [gapXY[0] * transform[2] || 1, gapXY[1] * transform[2] || 1];
  const scaledSize = patternSize * transform[2];
  const offsetXY: [number, number] = Array.isArray(offset) ? offset : [offset, offset];

  const patternDimensions: [number, number] = isCross ? [scaledSize, scaledSize] : scaledGap;
  const scaledOffset: [number, number] = [
    offsetXY[0] * transform[2] || 1 + patternDimensions[0] / 2,
    offsetXY[1] * transform[2] || 1 + patternDimensions[1] / 2,
  ];

  const _patternId = `${patternId}${id ? id : ''}`;

  return (
    <svg
      className={cc(['react-flow__background', className])}
      style={
        {
          ...style,
          ...containerStyle,
          '--xy-background-color-props': bgColor,
          '--xy-background-pattern-color-props': color,
        } as CSSProperties
      }
      ref={ref}
      data-testid="rf__background"
    >
      <pattern
        id={_patternId}
        x={transform[0] % scaledGap[0]}
        y={transform[1] % scaledGap[1]}
        width={scaledGap[0]}
        height={scaledGap[1]}
        patternUnits="userSpaceOnUse"
        patternTransform={`translate(-${scaledOffset[0]},-${scaledOffset[1]})`}
      >
        {isDots ? (
          <DotPattern radius={scaledSize / 2} className={patternClassName} />
        ) : (
          <LinePattern
            dimensions={patternDimensions}
            lineWidth={lineWidth}
            variant={variant}
            className={patternClassName}
          />
        )}
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${_patternId})`} />
    </svg>
  );
}

BackgroundComponent.displayName = 'Background';

/**
 * The `<Background />` component makes it convenient to render different types of backgrounds common in node-based UIs. It comes with three variants: lines, dots and cross.
 *
 * @example
 *
 * A simple example of how to use the Background component.
 *
 * ```tsx
 * import { useState } from 'react';
 * import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
 *
 * export default function Flow() {
 *   return (
 *     <ReactFlow defaultNodes={[...]} defaultEdges={[...]}>
 *       <Background color="#ccc" variant={BackgroundVariant.Dots} />
 *     </ReactFlow>
 *   );
 * }
 * ```
 *
 * @example
 *
 * In this example you can see how to combine multiple backgrounds
 *
 * ```tsx
 * import { ReactFlow, Background, BackgroundVariant } from '@xyflow/react';
 * import '@xyflow/react/dist/style.css';
 *
 * export default function Flow() {
 *   return (
 *     <ReactFlow defaultNodes={[...]} defaultEdges={[...]}>
 *       <Background
 *         id="1"
 *         gap={10}
 *         color="#f1f1f1"
 *         variant={BackgroundVariant.Lines}
 *       />
 *       <Background
 *         id="2"
 *         gap={100}
 *         color="#ccc"
 *         variant={BackgroundVariant.Lines}
 *       />
 *     </ReactFlow>
 *   );
 * }
 * ```
 *
 * @remarks
 *
 * When combining multiple <Background /> components it’s important to give each of them a unique id prop!
 *
 */
export const Background = memo(BackgroundComponent);
